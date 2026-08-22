PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS meta (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS import_batches (
  id INTEGER PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  started_at TEXT NOT NULL,
  completed_at TEXT,
  source_note TEXT
);

CREATE TABLE IF NOT EXISTS content_blobs (
  sha256 TEXT PRIMARY KEY CHECK(length(sha256)=64),
  byte_size INTEGER NOT NULL,
  media_type TEXT NOT NULL,
  encoding TEXT,
  object_relpath TEXT NOT NULL,
  first_seen_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS occurrences (
  id INTEGER PRIMARY KEY,
  batch_id INTEGER NOT NULL REFERENCES import_batches(id),
  blob_sha256 TEXT NOT NULL REFERENCES content_blobs(sha256),
  source_path TEXT NOT NULL,
  display_name TEXT NOT NULL,
  container_occurrence_id INTEGER REFERENCES occurrences(id),
  archive_member TEXT,
  modified_at TEXT,
  imported_at TEXT NOT NULL,
  UNIQUE(batch_id, source_path, archive_member)
);

CREATE TABLE IF NOT EXISTS documents (
  id INTEGER PRIMARY KEY,
  blob_sha256 TEXT NOT NULL UNIQUE REFERENCES content_blobs(sha256),
  preferred_name TEXT NOT NULL,
  kind TEXT NOT NULL,
  title TEXT,
  version_label TEXT,
  canonicality TEXT NOT NULL DEFAULT 'RAW',
  text_content TEXT,
  line_count INTEGER,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_chunks (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  ordinal INTEGER NOT NULL,
  line_start INTEGER NOT NULL,
  line_end INTEGER NOT NULL,
  body TEXT NOT NULL,
  UNIQUE(document_id, ordinal)
);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  body,
  preferred_name UNINDEXED,
  document_id UNINDEXED,
  chunk_id UNINDEXED,
  tokenize='unicode61 remove_diacritics 2'
);

CREATE TABLE IF NOT EXISTS conversation_turns (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  turn_no INTEGER NOT NULL,
  role TEXT NOT NULL,
  external_id TEXT,
  body TEXT NOT NULL,
  UNIQUE(document_id, turn_no)
);

CREATE TABLE IF NOT EXISTS byproduct_versions (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL,
  number INTEGER NOT NULL,
  title TEXT NOT NULL,
  status TEXT,
  body TEXT NOT NULL,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  registry_version INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE(code, document_id)
);

CREATE TABLE IF NOT EXISTS byproducts (
  code TEXT PRIMARY KEY,
  number INTEGER NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT,
  body TEXT NOT NULL,
  source_document_id INTEGER REFERENCES documents(id),
  evidence_level TEXT NOT NULL,
  artifact_state TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS byproduct_events (
  id INTEGER PRIMARY KEY,
  code TEXT NOT NULL REFERENCES byproducts(code),
  event_type TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  evidence_document_id INTEGER REFERENCES documents(id),
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS papers (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  authors TEXT,
  year TEXT,
  doi TEXT,
  url TEXT,
  blob_sha256 TEXT REFERENCES content_blobs(sha256),
  read_scope TEXT NOT NULL,
  locator TEXT,
  verification_status TEXT NOT NULL,
  summary TEXT,
  algebraic_ideas TEXT,
  implications TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS source_ledger_entries (
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  section TEXT,
  heading TEXT NOT NULL,
  body TEXT NOT NULL,
  read_scope TEXT NOT NULL,
  ownership_note TEXT,
  UNIQUE(document_id, heading)
);

CREATE TABLE IF NOT EXISTS claims (
  id INTEGER PRIMARY KEY,
  claim_key TEXT NOT NULL UNIQUE,
  statement TEXT NOT NULL,
  status TEXT NOT NULL,
  proof_state TEXT NOT NULL,
  novelty_state TEXT NOT NULL,
  byproduct_code TEXT REFERENCES byproducts(code),
  evidence_document_id INTEGER REFERENCES documents(id),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS claim_sources (
  claim_id INTEGER NOT NULL REFERENCES claims(id) ON DELETE CASCADE,
  paper_id INTEGER NOT NULL REFERENCES papers(id) ON DELETE CASCADE,
  relation TEXT NOT NULL,
  locator TEXT,
  note TEXT,
  PRIMARY KEY(claim_id, paper_id, relation)
);

CREATE TABLE IF NOT EXISTS research_relations (
  id INTEGER PRIMARY KEY,
  subject_type TEXT NOT NULL,
  subject_key TEXT NOT NULL,
  predicate TEXT NOT NULL,
  object_type TEXT NOT NULL,
  object_key TEXT NOT NULL,
  evidence_document_id INTEGER REFERENCES documents(id),
  confidence TEXT NOT NULL DEFAULT 'ASSERTED',
  note TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS integrity_issues (
  id INTEGER PRIMARY KEY,
  issue_key TEXT NOT NULL UNIQUE,
  severity TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'OPEN',
  summary TEXT NOT NULL,
  evidence TEXT,
  created_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE IF NOT EXISTS wave_runs (
  id INTEGER PRIMARY KEY,
  wave_code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  target TEXT NOT NULL,
  status TEXT NOT NULL,
  parent_codes TEXT,
  file_path TEXT,
  opened_at TEXT NOT NULL,
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS checkpoints (
  id INTEGER PRIMARY KEY,
  label TEXT NOT NULL,
  created_at TEXT NOT NULL,
  db_sha256 TEXT NOT NULL,
  manifest_path TEXT NOT NULL,
  note TEXT
);

CREATE INDEX IF NOT EXISTS idx_occurrence_blob ON occurrences(blob_sha256);
CREATE INDEX IF NOT EXISTS idx_occurrence_batch ON occurrences(batch_id);
CREATE INDEX IF NOT EXISTS idx_chunk_document ON document_chunks(document_id, ordinal);
CREATE INDEX IF NOT EXISTS idx_byproduct_version_number ON byproduct_versions(number, registry_version);
CREATE INDEX IF NOT EXISTS idx_paper_doi ON papers(doi);
CREATE INDEX IF NOT EXISTS idx_source_ledger_document ON source_ledger_entries(document_id);
CREATE INDEX IF NOT EXISTS idx_relation_subject ON research_relations(subject_type, subject_key);
