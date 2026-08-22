#!/usr/bin/env python3
"""Offline-first persistent research lab for the Cold War Renaissance archive."""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import re
import shutil
import sqlite3
import sys
import textwrap
import zipfile
from datetime import datetime, timezone
from pathlib import Path


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="backslashreplace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="backslashreplace")


ROOT = Path(__file__).resolve().parent
DB_PATH = ROOT / "data" / "lab.sqlite3"
SCHEMA_PATH = ROOT / "schema" / "lab.sql"
OBJECTS = ROOT / "objects" / "sha256"
EXPORTS = ROOT / "exports"
WAVES = ROOT / "waves"
CHECKPOINTS = ROOT / "checkpoints"
TEXT_EXTENSIONS = {
    ".txt", ".md", ".markdown", ".sql", ".json", ".jsonl", ".csv", ".tsv",
    ".yaml", ".yml", ".py", ".ps1", ".toml", ".xml", ".html", ".tex"
}
TRANSCRIPT_RE = re.compile(
    r"(?ms)^={10,}\r?\nTURN\s+(\d{3})\s+\|\s+(USER|ASSISTANT|SYSTEM|TOOL)\s+\|\s+([^\r\n]+)\r?\n={10,}\r?\n(.*?)(?=^={10,}\r?\nTURN\s+|\Z)"
)
BYPRODUCT_RE = re.compile(
    r"(?ms)^##\s+(CWR-BP-(\d{3}))\s+[—-]\s+([^\r\n]+)\r?\n(.*?)(?=^##\s+CWR-BP-\d{3}\s+[—-]|^#\s+|\Z)"
)
SOURCE_ENTRY_RE = re.compile(
    r"(?ms)^##\s+([^\r\n]+)\r?\n(.*?)(?=^##\s+|^#\s+|\Z)"
)


def now() -> str:
    return datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds")


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def connect() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON")
    conn.execute("PRAGMA journal_mode=WAL")
    return conn


def init_db() -> None:
    for path in (OBJECTS, EXPORTS, WAVES, CHECKPOINTS):
        path.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        conn.executescript(SCHEMA_PATH.read_text(encoding="utf-8"))
        stamp = now()
        conn.execute(
            "INSERT INTO meta(key,value,updated_at) VALUES('schema_version','1',?) "
            "ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at",
            (stamp,),
        )
        conn.execute(
            "INSERT INTO meta(key,value,updated_at) VALUES('autonomy','disabled',?) "
            "ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at",
            (stamp,),
        )


def decode_text(data: bytes, suffix: str) -> tuple[str | None, str | None]:
    if suffix.lower() not in TEXT_EXTENSIONS:
        return None, None
    for encoding in ("utf-8-sig", "utf-8", "utf-16", "cp1254", "cp1252"):
        try:
            return data.decode(encoding), encoding
        except UnicodeDecodeError:
            continue
    return data.decode("utf-8", errors="replace"), "utf-8-replace"


def classify(name: str, text: str | None) -> tuple[str, str | None, str | None, str]:
    upper = name.upper()
    version = None
    match = re.search(r"V0[_\-. ]?(\d+)", upper)
    if match:
        version = str(int(match.group(1)))
    if "BYPRODUCT_REGISTRY" in upper:
        kind = "BYPRODUCT_REGISTRY"
        canonicality = "SNAPSHOT"
    elif "CONVERSATION" in upper or (text and "TURN 001 | USER" in text):
        kind = "CONVERSATION"
        canonicality = "RAW_PROVENANCE"
    elif "HANDOFF" in upper or "START_HERE" in upper:
        kind = "HANDOFF"
        canonicality = "STATE_SNAPSHOT"
    elif "LAB_STATE" in upper:
        kind = "LAB_STATE"
        canonicality = "STATE_SNAPSHOT"
    elif "SOURCE" in upper and "LEDGER" in upper:
        kind = "SOURCE_LEDGER"
        canonicality = "LEDGER"
    elif "CHECK" in upper:
        kind = "COMPUTATIONAL_CHECK"
        canonicality = "EVIDENCE"
    elif re.search(r"CW\d{3}[A-Z]?", upper):
        kind = "THEOREM_NOTE"
        canonicality = "RESEARCH_ARTIFACT"
    elif upper.endswith(".ZIP"):
        kind = "ARCHIVE_CONTAINER"
        canonicality = "RAW_PROVENANCE"
    elif upper.endswith(".SQL"):
        kind = "SCHEMA"
        canonicality = "REFERENCE"
    else:
        kind = "DOCUMENT"
        canonicality = "RAW"
    title = None
    if text:
        for line in text.splitlines()[:30]:
            if line.startswith("#"):
                title = line.lstrip("# ").strip()
                break
    return kind, title, version, canonicality


def iter_chunks(text: str, target_chars: int = 4200):
    lines = text.splitlines()
    if not lines:
        return
    start = 0
    ordinal = 0
    while start < len(lines):
        size = 0
        end = start
        while end < len(lines) and (size < target_chars or end == start):
            size += len(lines[end]) + 1
            end += 1
        body = "\n".join(lines[start:end]).strip()
        if body:
            yield ordinal, start + 1, end, body
            ordinal += 1
        start = end


def store_blob(data: bytes) -> tuple[str, str]:
    digest = sha256(data)
    rel = Path("objects") / "sha256" / digest[:2] / digest
    dest = ROOT / rel
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not dest.exists():
        dest.write_bytes(data)
    return digest, rel.as_posix()


def preferred_name_for_blob(conn: sqlite3.Connection, digest: str, fallback: str) -> str:
    row = conn.execute(
        "SELECT display_name FROM occurrences WHERE blob_sha256=? "
        "ORDER BY CASE WHEN archive_member IS NULL THEN 0 ELSE 1 END, length(display_name), id LIMIT 1",
        (digest,),
    ).fetchone()
    return row[0] if row else fallback


def upsert_document(conn: sqlite3.Connection, digest: str, name: str, data: bytes, encoding: str | None, text: str | None) -> int:
    existing = conn.execute("SELECT id FROM documents WHERE blob_sha256=?", (digest,)).fetchone()
    if existing:
        return int(existing[0])
    kind, title, version, canonicality = classify(name, text)
    cur = conn.execute(
        "INSERT INTO documents(blob_sha256,preferred_name,kind,title,version_label,canonicality,text_content,line_count,created_at) "
        "VALUES(?,?,?,?,?,?,?,?,?)",
        (digest, name, kind, title, version, canonicality, text, len(text.splitlines()) if text else None, now()),
    )
    doc_id = int(cur.lastrowid)
    if text:
        for ordinal, line_start, line_end, body in iter_chunks(text):
            c = conn.execute(
                "INSERT INTO document_chunks(document_id,ordinal,line_start,line_end,body) VALUES(?,?,?,?,?)",
                (doc_id, ordinal, line_start, line_end, body),
            )
            conn.execute(
                "INSERT INTO chunks_fts(body,preferred_name,document_id,chunk_id) VALUES(?,?,?,?)",
                (body, name, str(doc_id), str(c.lastrowid)),
            )
        parse_turns(conn, doc_id, text)
        parse_byproducts(conn, doc_id, text, int(version) if version else None)
        if kind == "SOURCE_LEDGER":
            parse_source_ledger(conn, doc_id, text)
    return doc_id


def parse_turns(conn: sqlite3.Connection, doc_id: int, text: str) -> None:
    for match in TRANSCRIPT_RE.finditer(text):
        conn.execute(
            "INSERT OR IGNORE INTO conversation_turns(document_id,turn_no,role,external_id,body) VALUES(?,?,?,?,?)",
            (doc_id, int(match.group(1)), match.group(2), match.group(3).strip(), match.group(4).strip()),
        )


def status_from_body(body: str) -> str | None:
    match = re.search(r"(?im)^Status:\s*([^\r\n]+)", body)
    return match.group(1).strip() if match else None


def parse_byproducts(conn: sqlite3.Connection, doc_id: int, text: str, registry_version: int | None) -> None:
    if "CWR-BP-" not in text:
        return
    for match in BYPRODUCT_RE.finditer(text):
        code, number, title, body = match.group(1), int(match.group(2)), match.group(3).strip(), match.group(4).strip()
        conn.execute(
            "INSERT OR IGNORE INTO byproduct_versions(code,number,title,status,body,document_id,registry_version,created_at) "
            "VALUES(?,?,?,?,?,?,?,?)",
            (code, number, title, status_from_body(body), body, doc_id, registry_version, now()),
        )


def infer_read_scope(body: str) -> str:
    lower = body.lower()
    if "cover-to-cover" in lower and "do not" not in lower and "never" not in lower:
        return "FULL"
    if "proof" in lower or "kanıt" in lower:
        return "PROOF_OR_MECHANISM"
    if "theorem" in lower or "proposition" in lower:
        return "THEOREM_OR_STATEMENT"
    if "abstract" in lower:
        return "ABSTRACT_OR_METADATA"
    return "SCOPED_UNSPECIFIED"


def parse_source_ledger(conn: sqlite3.Connection, doc_id: int, text: str) -> None:
    section = None
    cursor = 0
    headings = list(SOURCE_ENTRY_RE.finditer(text))
    for match in headings:
        prefix = text[cursor:match.start()]
        section_matches = re.findall(r"(?m)^#\s+([^#\r\n][^\r\n]*)", prefix)
        if section_matches:
            section = section_matches[-1].strip()
        heading, body = match.group(1).strip(), match.group(2).strip()
        ownership = None
        own_match = re.search(
            r"(?ims)^(?:Ownership(?: rule| correction)?|Important ownership rule|Rule):\s*(.*?)(?=^[A-Z][^\r\n]{0,50}:|\Z)",
            body,
        )
        if own_match:
            ownership = own_match.group(1).strip()
        conn.execute(
            "INSERT OR REPLACE INTO source_ledger_entries(document_id,section,heading,body,read_scope,ownership_note) "
            "VALUES(?,?,?,?,?,?)",
            (doc_id, section, heading, body, infer_read_scope(body), ownership),
        )
        cursor = match.end()


def ingest_bytes(
    conn: sqlite3.Connection,
    batch_id: int,
    data: bytes,
    source_path: str,
    display_name: str,
    modified_at: str | None,
    container_occurrence_id: int | None = None,
    archive_member: str | None = None,
) -> tuple[int, str, int]:
    digest, rel = store_blob(data)
    suffix = Path(archive_member or display_name).suffix
    text, encoding = decode_text(data, suffix)
    media_type = mimetypes.guess_type(archive_member or display_name)[0] or "application/octet-stream"
    conn.execute(
        "INSERT OR IGNORE INTO content_blobs(sha256,byte_size,media_type,encoding,object_relpath,first_seen_at) VALUES(?,?,?,?,?,?)",
        (digest, len(data), media_type, encoding, rel, now()),
    )
    cur = conn.execute(
        "INSERT OR IGNORE INTO occurrences(batch_id,blob_sha256,source_path,display_name,container_occurrence_id,archive_member,modified_at,imported_at) "
        "VALUES(?,?,?,?,?,?,?,?)",
        (batch_id, digest, source_path, display_name, container_occurrence_id, archive_member, modified_at, now()),
    )
    if cur.lastrowid:
        occurrence_id = int(cur.lastrowid)
    else:
        row = conn.execute(
            "SELECT id FROM occurrences WHERE batch_id=? AND source_path=? AND archive_member IS ?",
            (batch_id, source_path, archive_member),
        ).fetchone()
        occurrence_id = int(row[0])
    doc_id = upsert_document(conn, digest, display_name, data, encoding, text)
    return occurrence_id, digest, doc_id


def iter_input_files(paths: list[str]):
    seen: set[Path] = set()
    for raw in paths:
        path = Path(raw).resolve()
        if not path.exists():
            raise FileNotFoundError(path)
        candidates = sorted(path.rglob("*")) if path.is_dir() else [path]
        for candidate in candidates:
            if not candidate.is_file() or candidate in seen:
                continue
            if ROOT == candidate or ROOT in candidate.parents:
                continue
            if ".git" in candidate.parts or ".build" in candidate.parts:
                continue
            seen.add(candidate)
            yield candidate


def ingest(paths: list[str], batch_label: str, source_note: str | None) -> None:
    init_db()
    with connect() as conn:
        stamp = now()
        conn.execute(
            "INSERT INTO import_batches(label,started_at,source_note) VALUES(?,?,?) "
            "ON CONFLICT(label) DO UPDATE SET source_note=COALESCE(excluded.source_note,source_note)",
            (batch_label, stamp, source_note),
        )
        batch_id = int(conn.execute("SELECT id FROM import_batches WHERE label=?", (batch_label,)).fetchone()[0])
        file_count = member_count = 0
        for path in iter_input_files(paths):
            data = path.read_bytes()
            modified = datetime.fromtimestamp(path.stat().st_mtime, timezone.utc).astimezone().isoformat(timespec="seconds")
            occurrence_id, _, _ = ingest_bytes(
                conn, batch_id, data, str(path), path.name, modified
            )
            file_count += 1
            if path.suffix.lower() == ".zip":
                try:
                    with zipfile.ZipFile(path) as archive:
                        for info in archive.infolist():
                            if info.is_dir():
                                continue
                            member_data = archive.read(info)
                            ingest_bytes(
                                conn, batch_id, member_data, str(path), Path(info.filename).name,
                                None, occurrence_id, info.filename,
                            )
                            member_count += 1
                except zipfile.BadZipFile:
                    record_issue(conn, f"bad_zip:{path}", "ERROR", f"Unreadable ZIP: {path}", None)
        conn.execute("UPDATE import_batches SET completed_at=? WHERE id=?", (now(), batch_id))
        select_canonical_byproducts(conn)
        recover_tail_from_transcript(conn)
        detect_integrity_issues(conn)
        conn.commit()
        print(f"Ingest complete: {file_count} files, {member_count} ZIP members, batch={batch_label}")


def select_canonical_byproducts(conn: sqlite3.Connection) -> None:
    rows = conn.execute(
        "SELECT bv.* FROM byproduct_versions bv JOIN documents d ON d.id=bv.document_id "
        "ORDER BY bv.number, COALESCE(bv.registry_version,-1) DESC, length(bv.body) DESC"
    ).fetchall()
    selected: set[str] = set()
    for row in rows:
        if row["code"] in selected:
            continue
        selected.add(row["code"])
        conn.execute(
            "INSERT INTO byproducts(code,number,title,status,body,source_document_id,evidence_level,artifact_state,updated_at) "
            "VALUES(?,?,?,?,?,?,?,?,?) ON CONFLICT(code) DO UPDATE SET "
            "title=excluded.title,status=excluded.status,body=excluded.body,source_document_id=excluded.source_document_id," 
            "evidence_level=excluded.evidence_level,artifact_state=excluded.artifact_state,updated_at=excluded.updated_at",
            (row["code"], row["number"], row["title"], row["status"], row["body"], row["document_id"],
             "REGISTRY", "PRESENT", now()),
        )


def recover_tail_from_transcript(conn: sqlite3.Connection) -> None:
    row = conn.execute(
        "SELECT id,text_content FROM documents WHERE kind='CONVERSATION' AND text_content LIKE '%CWR-BP-213–220%' "
        "ORDER BY length(text_content) DESC LIMIT 1"
    ).fetchone()
    if not row:
        return
    body = row["text_content"]
    if "registry CWR-BP-213–220" not in body and "CWR-BP-213–220" not in body:
        return
    known = {
        213: "PSD/symmetric semigroup literature collision frontier",
        214: "Positive determinant and bounded positive-definite factorization warning",
        215: "Rank-one PSD rational normal form",
        216: "Rank-one PSD scalar-sign signed-walk reduction",
        217: "Polynomial-time parity-graph reachability",
        218: "Finite strict-sign witness bound |w| <= 2k",
        219: "Exact-zero witness bound |w| <= 2",
        220: "Rank-one PSD classification and rank-two frontier",
    }
    for number, title in known.items():
        code = f"CWR-BP-{number:03d}"
        if conn.execute("SELECT 1 FROM byproducts WHERE code=?", (code,)).fetchone():
            continue
        evidence = (
            "The final archived assistant turn states that BP-213–220 were added and summarizes the rank-one PSD "
            "normal form, signed parity graph, polynomial-time reachability, strict-sign witness <=2k, zero witness <=2, "
            "and the rank-two PSD frontier. The referenced v0.20 canonical registry is absent, so this title is a "
            "recovery label rather than verbatim canonical registry text."
        )
        conn.execute(
            "INSERT INTO byproducts(code,number,title,status,body,source_document_id,evidence_level,artifact_state,updated_at) "
            "VALUES(?,?,?,?,?,?,?,?,?)",
            (code, number, title, "TRANSCRIPT-CONFIRMED", evidence, row["id"], "TRANSCRIPT_SUMMARY", "CANONICAL_ARTIFACT_MISSING", now()),
        )


def record_issue(conn: sqlite3.Connection, key: str, severity: str, summary: str, evidence: str | None) -> None:
    conn.execute(
        "INSERT INTO integrity_issues(issue_key,severity,status,summary,evidence,created_at) VALUES(?,?,?,?,?,?) "
        "ON CONFLICT(issue_key) DO UPDATE SET severity=excluded.severity,summary=excluded.summary,evidence=excluded.evidence",
        (key, severity, "OPEN", summary, evidence, now()),
    )


def detect_integrity_issues(conn: sqlite3.Connection) -> None:
    max_registry = conn.execute(
        "SELECT MAX(number) FROM byproduct_versions"
    ).fetchone()[0] or 0
    max_confirmed = conn.execute("SELECT MAX(number) FROM byproducts").fetchone()[0] or 0
    if max_confirmed > max_registry:
        record_issue(
            conn,
            "registry_tail_missing",
            "WARNING",
            f"Confirmed state reaches BP-{max_confirmed:03d}, but available registry artifacts reach only BP-{max_registry:03d}.",
            "Full conversation turn 088 references registry v0.20 and CW-002P, while supplied physical registry snapshots stop at v0.19/BP-212.",
        )
    record_issue(
        conn,
        "autonomy_disabled",
        "INFO",
        "Autonomous research macros are intentionally disabled in lab v1.",
        "Enable only after the staged validation gates in LAB_AUTOMATION_ROADMAP.md.",
    )


def tokenize_query(query: str) -> str:
    tokens = re.findall(r"[\wÀ-ž]+", query, flags=re.UNICODE)
    return " AND ".join(f'"{token}"' for token in tokens[:20])


def search_rows(conn: sqlite3.Connection, query: str, limit: int):
    fts = tokenize_query(query)
    if not fts:
        return []
    rows = conn.execute(
        "SELECT f.document_id,f.chunk_id,f.preferred_name,dc.line_start,dc.line_end," 
        "snippet(chunks_fts,0,'[[',']]', ' … ',24) AS snippet,bm25(chunks_fts) AS score "
        "FROM chunks_fts f JOIN document_chunks dc ON dc.id=CAST(f.chunk_id AS INTEGER) "
        "WHERE chunks_fts MATCH ? ORDER BY score LIMIT ?",
        (fts, limit),
    ).fetchall()
    if rows:
        return rows
    loose = " OR ".join(fts.split(" AND "))
    return conn.execute(
        "SELECT f.document_id,f.chunk_id,f.preferred_name,dc.line_start,dc.line_end," 
        "snippet(chunks_fts,0,'[[',']]', ' … ',24) AS snippet,bm25(chunks_fts) AS score "
        "FROM chunks_fts f JOIN document_chunks dc ON dc.id=CAST(f.chunk_id AS INTEGER) "
        "WHERE chunks_fts MATCH ? ORDER BY score LIMIT ?",
        (loose, limit),
    ).fetchall()


def cmd_search(args) -> None:
    init_db()
    with connect() as conn:
        rows = search_rows(conn, args.query, args.limit)
        for i, row in enumerate(rows, 1):
            print(f"[{i}] doc={row['document_id']} {row['preferred_name']} lines {row['line_start']}-{row['line_end']}")
            print(textwrap.fill(row["snippet"].replace("\n", " "), 110))
            print()


def status_dict(conn: sqlite3.Connection) -> dict:
    scalar = lambda sql: conn.execute(sql).fetchone()[0]
    return {
        "blobs": scalar("SELECT COUNT(*) FROM content_blobs"),
        "occurrences": scalar("SELECT COUNT(*) FROM occurrences"),
        "documents": scalar("SELECT COUNT(*) FROM documents"),
        "chunks": scalar("SELECT COUNT(*) FROM document_chunks"),
        "conversation_turns": scalar("SELECT COUNT(*) FROM conversation_turns"),
        "byproducts": scalar("SELECT COUNT(*) FROM byproducts"),
        "registry_max": scalar("SELECT COALESCE(MAX(number),0) FROM byproduct_versions"),
        "confirmed_max": scalar("SELECT COALESCE(MAX(number),0) FROM byproducts"),
        "papers": scalar("SELECT COUNT(*) FROM papers"),
        "source_ledger_entries": scalar("SELECT COUNT(*) FROM source_ledger_entries"),
        "checkpoints": scalar("SELECT COUNT(*) FROM checkpoints"),
        "open_issues": scalar("SELECT COUNT(*) FROM integrity_issues WHERE status='OPEN'"),
        "duplicate_occurrences": scalar(
            "SELECT COALESCE(SUM(c-1),0) FROM (SELECT COUNT(*) c FROM occurrences GROUP BY blob_sha256 HAVING c>1)"
        ),
    }


def cmd_status(_args) -> None:
    init_db()
    with connect() as conn:
        s = status_dict(conn)
        print(json.dumps(s, indent=2, ensure_ascii=False))
        print("\nOpen integrity issues:")
        for row in conn.execute("SELECT severity,issue_key,summary FROM integrity_issues WHERE status='OPEN' ORDER BY id"):
            print(f"- [{row['severity']}] {row['issue_key']}: {row['summary']}")


def cmd_reindex(_args) -> None:
    init_db()
    with connect() as conn:
        conn.execute("DELETE FROM source_ledger_entries")
        for row in conn.execute("SELECT id,text_content FROM documents WHERE kind='SOURCE_LEDGER'"):
            if row["text_content"]:
                parse_source_ledger(conn, row["id"], row["text_content"])
        select_canonical_byproducts(conn)
        recover_tail_from_transcript(conn)
        detect_integrity_issues(conn)
        conn.commit()
        count = conn.execute("SELECT COUNT(*) FROM source_ledger_entries").fetchone()[0]
    print(f"Structured indexes refreshed; source ledger entries={count}")


def cmd_inventory(args) -> None:
    init_db()
    output = Path(args.output).resolve() if args.output else EXPORTS / "BOOTSTRAP_INVENTORY.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        occurrences = [dict(row) for row in conn.execute(
            "SELECT o.id,o.source_path,o.display_name,o.archive_member,o.blob_sha256,b.byte_size,b.media_type "
            "FROM occurrences o JOIN content_blobs b ON b.sha256=o.blob_sha256 ORDER BY o.id"
        )]
        duplicates = [dict(row) for row in conn.execute(
            "SELECT blob_sha256,COUNT(*) occurrence_count,GROUP_CONCAT(display_name,' | ') names "
            "FROM occurrences GROUP BY blob_sha256 HAVING COUNT(*)>1 ORDER BY occurrence_count DESC,blob_sha256"
        )]
        payload = {
            "generated_at": now(),
            "policy": "One content blob per SHA-256; every filename and ZIP member remains a separate occurrence.",
            "status": status_dict(conn),
            "occurrences": occurrences,
            "duplicate_groups": duplicates,
            "integrity_issues": [dict(row) for row in conn.execute(
                "SELECT issue_key,severity,status,summary,evidence FROM integrity_issues ORDER BY id"
            )],
        }
    output.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    print(output)


def cmd_doctor(_args) -> None:
    init_db()
    failures = 0
    with connect() as conn:
        integrity = conn.execute("PRAGMA integrity_check").fetchone()[0]
        print(f"SQLite integrity: {integrity}")
        if integrity != "ok":
            failures += 1
        missing = []
        for row in conn.execute("SELECT sha256,object_relpath FROM content_blobs"):
            path = ROOT / row["object_relpath"]
            if not path.exists() or sha256(path.read_bytes()) != row["sha256"]:
                missing.append(row["sha256"])
        print(f"Object hash check: {'ok' if not missing else 'FAILED'} ({len(missing)} bad/missing)")
        failures += bool(missing)
        orphan_fts = conn.execute(
            "SELECT COUNT(*) FROM chunks_fts f LEFT JOIN document_chunks d ON d.id=CAST(f.chunk_id AS INTEGER) WHERE d.id IS NULL"
        ).fetchone()[0]
        print(f"FTS linkage: {'ok' if not orphan_fts else 'FAILED'} ({orphan_fts} orphans)")
        failures += bool(orphan_fts)
        s = status_dict(conn)
        print(f"Registry/state pointer: available BP-{s['registry_max']:03d}; confirmed BP-{s['confirmed_max']:03d}")
        if s["confirmed_max"] > s["registry_max"]:
            print("Expected warning: canonical registry tail is missing; transcript recovery records are isolated.")
        autonomy = conn.execute("SELECT value FROM meta WHERE key='autonomy'").fetchone()[0]
        print(f"Autonomy: {autonomy}")
    if failures:
        raise SystemExit(1)


def cmd_context(args) -> None:
    init_db()
    output = Path(args.output).resolve() if args.output else EXPORTS / "CONTEXT_PACK.md"
    output.parent.mkdir(parents=True, exist_ok=True)
    with connect() as conn:
        rows = search_rows(conn, args.query, args.limit)
        issues = conn.execute(
            "SELECT severity,summary,evidence FROM integrity_issues WHERE status='OPEN' ORDER BY id"
        ).fetchall()
        byproducts = conn.execute(
            "SELECT code,title,status,evidence_level,artifact_state FROM byproducts "
            "WHERE code IN ('CWR-BP-198','CWR-BP-201','CWR-BP-211','CWR-BP-220') ORDER BY number"
        ).fetchall()
        parts = [
            "# CWR Deterministic Rehydration Context",
            f"Generated: {now()}",
            f"Query: `{args.query}`",
            "\n## Required kernel\n",
            (ROOT / "LAB_KERNEL.md").read_text(encoding="utf-8"),
            "\n## Current state\n",
            (ROOT / "LAB_STATE.md").read_text(encoding="utf-8"),
            "\n## Active nodes\n",
        ]
        for bp in byproducts:
            parts.append(
                f"- {bp['code']} — {bp['title']} | {bp['status']} | {bp['evidence_level']} | {bp['artifact_state']}"
            )
        parts.append("\n## Open integrity issues\n")
        for issue in issues:
            parts.append(f"- [{issue['severity']}] {issue['summary']} Evidence: {issue['evidence'] or 'n/a'}")
        parts.append("\n## Query-relevant archive excerpts\n")
        for index, row in enumerate(rows, 1):
            doc = conn.execute(
                "SELECT blob_sha256 FROM documents WHERE id=?", (row["document_id"],)
            ).fetchone()
            chunk = conn.execute("SELECT body FROM document_chunks WHERE id=?", (row["chunk_id"],)).fetchone()[0]
            parts.append(
                f"### R{index}: {row['preferred_name']}\n"
                f"Locator: document={row['document_id']}; lines={row['line_start']}-{row['line_end']}; sha256={doc['blob_sha256']}\n\n"
                f"{chunk}\n"
            )
        parts.append(
            "\n## Continuation instruction\n"
            "Continue from the current frontier using LAB_WAVE_PROTOCOL.md. Treat transcript-confirmed/missing-artifact records as evidence of state, not as verbatim canonical registry text. Do not silently promote novelty or proof status."
        )
        output.write_text("\n".join(parts), encoding="utf-8")
    print(output)


def cmd_checkpoint(args) -> None:
    init_db()
    stamp = datetime.now().strftime("%Y%m%dT%H%M%S")
    folder = CHECKPOINTS / f"{stamp}_{re.sub(r'[^A-Za-z0-9._-]+','_',args.label)}"
    folder.mkdir(parents=True, exist_ok=False)
    target_db = folder / "lab.sqlite3"
    with connect() as source, sqlite3.connect(target_db) as target:
        source.backup(target)
    files = [
        ROOT / "AGENTS.md", ROOT / "LAB_KERNEL.md", ROOT / "LAB_STATE.md",
        ROOT / "LAB_WAVE_PROTOCOL.md", ROOT / "LAB_RETRIEVAL_POLICY.md", SCHEMA_PATH, target_db,
    ]
    manifest = {
        "label": args.label,
        "created_at": now(),
        "files": [
            {"path": str(path.relative_to(ROOT)), "bytes": path.stat().st_size, "sha256": sha256(path.read_bytes())}
            for path in files
        ],
    }
    manifest_path = folder / "manifest.sha256.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8")
    db_hash = sha256(target_db.read_bytes())
    with connect() as conn:
        conn.execute(
            "INSERT INTO checkpoints(label,created_at,db_sha256,manifest_path,note) VALUES(?,?,?,?,?)",
            (args.label, now(), db_hash, str(manifest_path.relative_to(ROOT)), args.note),
        )
        conn.commit()
    print(folder)


def cmd_add_paper(args) -> None:
    init_db()
    blob = None
    if args.file:
        ingest([args.file], args.batch or f"paper-{datetime.now().strftime('%Y%m%d-%H%M%S')}", "Paper ingestion")
        data = Path(args.file).read_bytes()
        blob = sha256(data)
    with connect() as conn:
        stamp = now()
        conn.execute(
            "INSERT INTO papers(title,authors,year,doi,url,blob_sha256,read_scope,locator,verification_status,summary,algebraic_ideas,implications,notes,created_at,updated_at) "
            "VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (args.title, args.authors, args.year, args.doi, args.url, blob, args.read_scope, args.locator,
             args.verification_status, args.summary, args.algebraic_ideas, args.implications, args.notes, stamp, stamp),
        )
        conn.commit()
    print("Paper record added.")


def cmd_new_wave(args) -> None:
    init_db()
    path = WAVES / f"{args.code}_{re.sub(r'[^A-Za-z0-9._-]+','_',args.title)[:80]}.md"
    if path.exists():
        raise SystemExit(f"Wave file exists: {path}")
    body = f"""# {args.code} — {args.title}

Status: OPEN
Opened: {now()}
Parents: {args.parents or 'NONE'}

## Exact target

{args.target}

## Input / quantifier / output contract

TODO

## Interaction hypothesis

TODO

## Cheapest destructive test

TODO

## Exact core / proof

TODO

## Computational checks

TODO — identify exact versus floating-point checks; record seed and invariant.

## Primary-source collision audit

TODO — record discovery/read scope/locator and ownership separately.

## Harvest and status changes

TODO

## Next frontier

TODO
"""
    path.write_text(body, encoding="utf-8")
    with connect() as conn:
        conn.execute(
            "INSERT INTO wave_runs(wave_code,title,target,status,parent_codes,file_path,opened_at) VALUES(?,?,?,?,?,?,?)",
            (args.code, args.title, args.target, "OPEN", args.parents, str(path.relative_to(ROOT)), now()),
        )
        conn.commit()
    print(path)


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("init").set_defaults(func=lambda _args: (init_db(), print(DB_PATH)))
    p = sub.add_parser("ingest")
    p.add_argument("paths", nargs="+")
    p.add_argument("--batch", required=True)
    p.add_argument("--note")
    p.set_defaults(func=lambda a: ingest(a.paths, a.batch, a.note))
    p = sub.add_parser("search")
    p.add_argument("query")
    p.add_argument("--limit", type=int, default=8)
    p.set_defaults(func=cmd_search)
    sub.add_parser("status").set_defaults(func=cmd_status)
    sub.add_parser("reindex").set_defaults(func=cmd_reindex)
    p = sub.add_parser("inventory")
    p.add_argument("--output")
    p.set_defaults(func=cmd_inventory)
    sub.add_parser("doctor").set_defaults(func=cmd_doctor)
    p = sub.add_parser("context")
    p.add_argument("--query", required=True)
    p.add_argument("--limit", type=int, default=12)
    p.add_argument("--output")
    p.set_defaults(func=cmd_context)
    p = sub.add_parser("checkpoint")
    p.add_argument("--label", required=True)
    p.add_argument("--note")
    p.set_defaults(func=cmd_checkpoint)
    p = sub.add_parser("add-paper")
    p.add_argument("--title", required=True)
    p.add_argument("--file")
    p.add_argument("--authors")
    p.add_argument("--year")
    p.add_argument("--doi")
    p.add_argument("--url")
    p.add_argument("--read-scope", required=True, choices=["DISCOVERED", "ABSTRACT", "SECTION", "THEOREM", "PROOF", "FULL"])
    p.add_argument("--locator")
    p.add_argument("--verification-status", default="UNVERIFIED", choices=["UNVERIFIED", "PRIMARY_SOURCE", "SECONDARY_SOURCE", "CROSS_CHECKED"])
    p.add_argument("--summary")
    p.add_argument("--algebraic-ideas")
    p.add_argument("--implications")
    p.add_argument("--notes")
    p.add_argument("--batch")
    p.set_defaults(func=cmd_add_paper)
    p = sub.add_parser("new-wave")
    p.add_argument("--code", required=True)
    p.add_argument("--title", required=True)
    p.add_argument("--target", required=True)
    p.add_argument("--parents")
    p.set_defaults(func=cmd_new_wave)
    return parser


if __name__ == "__main__":
    cli = build_parser()
    parsed = cli.parse_args()
    parsed.func(parsed)
