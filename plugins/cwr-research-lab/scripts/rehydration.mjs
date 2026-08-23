#!/usr/bin/env node

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_LAB_ROOT = resolve(SCRIPT_DIR, "..", "..", "..", "CWR_RESEARCH_LAB");
export const REHYDRATION_SCHEMA = "cwr.rehydration-capsule.v2";
export const ENGINE_VERSION = "0.2.0";

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function sha256File(path) {
  return sha256Bytes(readFileSync(path));
}

function readUtf8(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function scalar(db, sql, ...params) {
  const row = db.prepare(sql).get(...params);
  return row ? Object.values(row)[0] : null;
}

function plainRows(db, sql, ...params) {
  return db.prepare(sql).all(...params).map((row) => ({ ...row }));
}

function capture(text, expression, fallback = "unknown") {
  return text.match(expression)?.[1]?.trim() || fallback;
}

function atomicWrite(path, content) {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.tmp`;
  writeFileSync(temporary, content, "utf8");
  renameSync(temporary, path);
}

function capsuleMarkdown(capsule) {
  const issueLines = capsule.integrity.open_issues.length
    ? capsule.integrity.open_issues.map(
        (issue) => `- [${issue.severity}] ${issue.issue_key}: ${issue.summary}`,
      )
    : ["- none"];
  return [
    "# CWR Rehydration Capsule",
    "",
    `schema: ${capsule.schema}`,
    `snapshot_id: ${capsule.snapshot.snapshot_id}`,
    `ready_for_instruction: ${capsule.readiness.ready_for_instruction ? "yes" : "no"}`,
    `working_mode: ${capsule.readiness.working_mode}`,
    `live_bridge_available: ${capsule.connectivity.live_bridge_available}`,
    "",
    "## Research pointer",
    "",
    `- latest confirmed byproduct: ${capsule.research_pointer.latest_confirmed_byproduct}`,
    `- next byproduct: ${capsule.research_pointer.next_byproduct}`,
    `- last completed wave: ${capsule.research_pointer.last_completed_wave}`,
    `- current frontier: ${capsule.research_pointer.current_frontier}`,
    `- immediate attack: ${capsule.research_pointer.immediate_attack}`,
    "",
    "## Verified coverage",
    "",
    `- blobs: ${capsule.coverage.blobs_verified}/${capsule.coverage.blobs_expected}`,
    `- occurrences indexed: ${capsule.coverage.occurrences_indexed}`,
    `- documents indexed: ${capsule.coverage.documents_indexed}`,
    `- conversation turns indexed chronologically: ${capsule.coverage.conversation_turns_indexed}`,
    `- byproducts indexed: ${capsule.coverage.byproducts_indexed}`,
    `- registry artifact boundary: CWR-BP-${String(capsule.coverage.registry_max).padStart(3, "0")}`,
    "",
    "## Integrity issues (preserved, not hidden)",
    "",
    ...issueLines,
    "",
    "## Context contract",
    "",
    "The capsule is the verified working-state projection, not a replacement for canonical evidence.",
    "Exact bytes remain addressable by document ID and SHA-256 in the local database/object store.",
    "Retrieve full records or cited line ranges only when the active query needs them.",
    "An unavailable MCP bridge changes connectivity mode; it does not invalidate a verified local/static snapshot.",
    "",
    "## Canonical kernel",
    "",
    capsule.core.kernel,
    "",
    "## Canonical state",
    "",
    capsule.core.state,
    "",
  ].join("\n");
}

export function workingCapsuleView(capsule) {
  return {
    schema: capsule.schema,
    engine_version: capsule.engine_version,
    snapshot: capsule.snapshot,
    authority: capsule.authority,
    connectivity: capsule.connectivity,
    readiness: capsule.readiness,
    coverage: capsule.coverage,
    research_pointer: capsule.research_pointer,
    integrity: capsule.integrity,
    active_nodes: capsule.active_nodes,
    provenance: {
      document_catalog: capsule.provenance.document_catalog,
      exact_retrieval_contract: capsule.provenance.exact_retrieval_contract,
    },
    core: {
      kernel: capsule.core.kernel,
      state: capsule.core.state,
    },
    context_policy: capsule.context_policy,
    terminal_report: capsule.terminal_report,
  };
}

export function buildRehydrationCapsule(
  labRoot = DEFAULT_LAB_ROOT,
  { liveBridgeAvailable = "not_checked" } = {},
) {
  const root = resolve(labRoot);
  const dbPath = resolve(root, "data", "lab.sqlite3");
  const kernelPath = resolve(root, "LAB_KERNEL.md");
  const statePath = resolve(root, "LAB_STATE.md");
  const nextContextPath = resolve(root, "exports", "NEXT_SESSION_CONTEXT.md");
  for (const required of [dbPath, kernelPath, statePath, nextContextPath]) {
    if (!existsSync(required)) throw new Error(`Required CWR source is missing: ${required}`);
  }

  const kernel = readUtf8(kernelPath);
  const state = readUtf8(statePath);
  const nextContext = readUtf8(nextContextPath);
  const dbSha256 = sha256File(dbPath);
  const db = new DatabaseSync(dbPath, { readOnly: true });
  try {
    const blobs = plainRows(
      db,
      "SELECT sha256,byte_size,media_type,object_relpath FROM content_blobs ORDER BY sha256",
    );
    const verificationFailures = [];
    const catalog = blobs.map((blob) => {
      const objectPath = resolve(root, ...String(blob.object_relpath).split(/[\\/]+/));
      const exists = existsSync(objectPath);
      const actualSha256 = exists ? sha256File(objectPath) : null;
      const actualSize = exists ? readFileSync(objectPath).byteLength : null;
      const verified =
        exists && actualSha256 === blob.sha256 && Number(actualSize) === Number(blob.byte_size);
      if (!verified) {
        verificationFailures.push({
          sha256: blob.sha256,
          reason: !exists
            ? "missing"
            : actualSha256 !== blob.sha256
              ? "sha256_mismatch"
              : "byte_size_mismatch",
        });
      }
      return {
        sha256: blob.sha256,
        byte_size: Number(blob.byte_size),
        media_type: blob.media_type,
        object_relpath: String(blob.object_relpath).replaceAll("\\", "/"),
        verified,
      };
    });

    const counts = {
      blobs: Number(scalar(db, "SELECT COUNT(*) FROM content_blobs")),
      occurrences: Number(scalar(db, "SELECT COUNT(*) FROM occurrences")),
      documents: Number(scalar(db, "SELECT COUNT(*) FROM documents")),
      chunks: Number(scalar(db, "SELECT COUNT(*) FROM document_chunks")),
      conversation_turns: Number(scalar(db, "SELECT COUNT(*) FROM conversation_turns")),
      byproducts: Number(scalar(db, "SELECT COUNT(*) FROM byproducts")),
      registry_max: Number(scalar(db, "SELECT COALESCE(MAX(number),0) FROM byproduct_versions")),
      confirmed_max: Number(scalar(db, "SELECT COALESCE(MAX(number),0) FROM byproducts")),
      papers: Number(scalar(db, "SELECT COUNT(*) FROM papers")),
      source_ledger_entries: Number(scalar(db, "SELECT COUNT(*) FROM source_ledger_entries")),
      checkpoints: Number(scalar(db, "SELECT COUNT(*) FROM checkpoints")),
    };
    const checkpoint = {
      ...db.prepare(
        "SELECT label,created_at,db_sha256,manifest_path,note FROM checkpoints ORDER BY id DESC LIMIT 1",
      ).get(),
    };
    const issues = plainRows(
      db,
      "SELECT issue_key,severity,status,summary,evidence FROM integrity_issues WHERE status='OPEN' ORDER BY id",
    );
    const activeNodes = plainRows(
      db,
      "SELECT code,title,status,evidence_level,artifact_state FROM byproducts ORDER BY number DESC LIMIT 8",
    ).reverse();
    const documents = plainRows(
      db,
      "SELECT id,blob_sha256,preferred_name,kind,title,version_label,canonicality,line_count " +
        "FROM documents ORDER BY id",
    );
    const chronology = plainRows(
      db,
      "SELECT document_id,MIN(turn_no) AS first_turn,MAX(turn_no) AS last_turn,COUNT(*) AS turn_count " +
        "FROM conversation_turns GROUP BY document_id ORDER BY document_id",
    );
    const latest = capture(state, /Latest confirmed byproduct:\s*`?([^`.\r\n]+)`?/i,
      `CWR-BP-${String(counts.confirmed_max).padStart(3, "0")}`);
    const next = capture(state, /Next byproduct:\s*`?([^`.\r\n]+)`?/i,
      `CWR-BP-${String(counts.confirmed_max + 1).padStart(3, "0")}`);
    const lastWave = capture(state, /Last completed wave:\s*`?([^`\r\n]+)`?/i);
    const frontier = capture(state, /Current frontier:\s*`?([^`\r\n]+)`?/i);
    const immediateAttack = capture(state, /Immediate attack:\s*([^\r\n]+)/i);
    const autonomy = String(scalar(db, "SELECT value FROM meta WHERE key='autonomy'") || "unknown");
    const sourceHashes = {
      database: dbSha256,
      kernel: sha256File(kernelPath),
      state: sha256File(statePath),
      next_session_context: sha256File(nextContextPath),
    };
    const snapshotId = sha256Bytes(
      Buffer.from(JSON.stringify({ schema: REHYDRATION_SCHEMA, sourceHashes, counts })),
    );
    const archiveIntegrity = verificationFailures.length === 0 && catalog.length === counts.blobs;
    const pointerReady = ![latest, next, lastWave, frontier].includes("unknown");
    const researchStateReady = archiveIntegrity && pointerReady && counts.conversation_turns > 0;
    const bridge = [true, false, "not_checked"].includes(liveBridgeAvailable)
      ? liveBridgeAvailable
      : "not_checked";

    return {
      schema: REHYDRATION_SCHEMA,
      engine_version: ENGINE_VERSION,
      snapshot: {
        snapshot_id: snapshotId,
        checkpoint_label: checkpoint.label || "unlabelled",
        checkpoint_created_at: checkpoint.created_at || "unknown",
        checkpoint_database_sha256: checkpoint.db_sha256 || "unknown",
        source_hashes: sourceHashes,
      },
      authority: {
        live_canonical: "local CWR database and content-addressed object store",
        owner_backup: "private GitLab (not required for runtime readiness)",
        public_distribution: "public GitHub static mirror (not canonical write state)",
        chat_memory_is_source_of_truth: false,
      },
      connectivity: {
        live_bridge_available: bridge,
        bridge_is_readiness_gate: false,
        remote_commit_search_required: false,
      },
      readiness: {
        archive_integrity: archiveIntegrity ? "verified" : "failed",
        research_state_ready: researchStateReady,
        ready_for_instruction: researchStateReady,
        working_mode: bridge === true ? "live_local_database" : "verified_snapshot",
        blocking_failures: [
          ...(archiveIntegrity ? [] : ["archive_integrity_failed"]),
          ...(pointerReady ? [] : ["research_pointer_incomplete"]),
          ...(counts.conversation_turns > 0 ? [] : ["chronology_missing"]),
        ],
      },
      coverage: {
        blobs_expected: counts.blobs,
        blobs_verified: catalog.filter((item) => item.verified).length,
        occurrences_indexed: counts.occurrences,
        documents_indexed: counts.documents,
        chunks_indexed: counts.chunks,
        conversation_turns_indexed: counts.conversation_turns,
        byproducts_indexed: counts.byproducts,
        registry_max: counts.registry_max,
        confirmed_max: counts.confirmed_max,
        papers_indexed: counts.papers,
        source_ledger_entries: counts.source_ledger_entries,
        chronology_index_complete: chronology.length > 0,
        artifact_catalog_complete: documents.length === counts.documents,
      },
      research_pointer: {
        latest_confirmed_byproduct: latest,
        next_byproduct: next,
        last_completed_wave: lastWave,
        current_frontier: frontier,
        immediate_attack: immediateAttack,
        autonomy,
      },
      integrity: {
        verification_failures: verificationFailures,
        open_issues: issues,
        warnings_block_readiness: false,
        note:
          "Known missing canonical artifacts remain explicit evidence limits; they do not erase the verified transcript-confirmed state.",
      },
      active_nodes: activeNodes,
      provenance: {
        document_catalog: documents,
        content_object_catalog: catalog,
        chronology_partitions: chronology,
        exact_retrieval_contract:
          "Use get_document/search_archive/build_context for query-specific exact bytes and locators. Search excerpts never count as full-document reading.",
      },
      core: { kernel, state, next_session_context: nextContext },
      context_policy: {
        canonical_bytes_preserved_outside_model_context: true,
        capsule_is_evidence_replacement: false,
        eager_full_archive_tool_loop_required: false,
        query_specific_exact_retrieval_required: true,
        silent_context_compression_permitted: false,
      },
      terminal_report: {
        marker: researchStateReady ? "CWR INSTANCE READY" : "CWR REHYDRATION BLOCKED",
        ready_for_instruction: researchStateReady ? "yes" : "no",
        live_database_status: bridge === true ? "available" : "optional_not_available",
      },
    };
  } finally {
    db.close();
  }
}

export function writeRehydrationExports(labRoot = DEFAULT_LAB_ROOT) {
  const capsule = buildRehydrationCapsule(labRoot);
  const exportsDir = resolve(labRoot, "exports");
  const capsuleJsonPath = resolve(exportsDir, "REHYDRATION_CAPSULE.json");
  const bootstrapJsonPath = resolve(exportsDir, "REHYDRATION_BOOTSTRAP.json");
  const capsuleMdPath = resolve(exportsDir, "REHYDRATION_CAPSULE.md");
  const json = `${JSON.stringify(capsule, null, 2)}\n`;
  const bootstrapJson = `${JSON.stringify(workingCapsuleView(capsule), null, 2)}\n`;
  const markdown = capsuleMarkdown(capsule);
  atomicWrite(capsuleJsonPath, json);
  atomicWrite(bootstrapJsonPath, bootstrapJson);
  atomicWrite(capsuleMdPath, markdown);
  const releaseManifest = {
    schema: "cwr.release-manifest.v1",
    snapshot_id: capsule.snapshot.snapshot_id,
    ready_for_instruction: capsule.readiness.ready_for_instruction,
    files: [
      { path: "CWR_RESEARCH_LAB/exports/REHYDRATION_CAPSULE.json", sha256: sha256File(capsuleJsonPath) },
      { path: "CWR_RESEARCH_LAB/exports/REHYDRATION_BOOTSTRAP.json", sha256: sha256File(bootstrapJsonPath) },
      { path: "CWR_RESEARCH_LAB/exports/REHYDRATION_CAPSULE.md", sha256: sha256File(capsuleMdPath) },
      { path: "CWR_RESEARCH_LAB/LAB_KERNEL.md", sha256: capsule.snapshot.source_hashes.kernel },
      { path: "CWR_RESEARCH_LAB/LAB_STATE.md", sha256: capsule.snapshot.source_hashes.state },
      {
        path: "CWR_RESEARCH_LAB/exports/NEXT_SESSION_CONTEXT.md",
        sha256: capsule.snapshot.source_hashes.next_session_context,
      },
    ],
  };
  const manifestPath = resolve(exportsDir, "RELEASE_MANIFEST.json");
  atomicWrite(manifestPath, `${JSON.stringify(releaseManifest, null, 2)}\n`);
  return { capsule, capsuleJsonPath, bootstrapJsonPath, capsuleMdPath, manifestPath };
}

async function main() {
  const labRootIndex = process.argv.indexOf("--lab-root");
  const labRoot = labRootIndex >= 0 ? process.argv[labRootIndex + 1] : DEFAULT_LAB_ROOT;
  if (process.argv.includes("--write-exports")) {
    const result = writeRehydrationExports(labRoot);
    process.stdout.write(`${JSON.stringify({
      snapshot_id: result.capsule.snapshot.snapshot_id,
      ready_for_instruction: result.capsule.readiness.ready_for_instruction,
      outputs: [
        result.capsuleJsonPath,
        result.bootstrapJsonPath,
        result.capsuleMdPath,
        result.manifestPath,
      ],
    }, null, 2)}\n`);
    return;
  }
  process.stdout.write(`${JSON.stringify(buildRehydrationCapsule(labRoot), null, 2)}\n`);
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === entry) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exit(1);
  });
}

