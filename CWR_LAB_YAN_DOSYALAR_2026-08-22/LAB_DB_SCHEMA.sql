PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS meta(
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS documents(
  id INTEGER PRIMARY KEY,
  path TEXT NOT NULL UNIQUE,
  filename TEXT NOT NULL,
  kind TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  bytes INTEGER NOT NULL,
  modified_utc TEXT,
  canonical INTEGER NOT NULL DEFAULT 0,
  source_layer TEXT NOT NULL DEFAULT 'artifact'
);

CREATE TABLE IF NOT EXISTS document_chunks(
  id INTEGER PRIMARY KEY,
  document_id INTEGER NOT NULL REFERENCES documents(id),
  chunk_no INTEGER NOT NULL,
  text TEXT NOT NULL,
  UNIQUE(document_id, chunk_no)
);

CREATE VIRTUAL TABLE IF NOT EXISTS chunks_fts USING fts5(
  text,
  document_id UNINDEXED,
  chunk_no UNINDEXED
);

CREATE TABLE IF NOT EXISTS conversations(
  id INTEGER PRIMARY KEY,
  document_id INTEGER UNIQUE REFERENCES documents(id),
  conversation_key TEXT,
  started_at TEXT,
  title TEXT,
  imported_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS research_threads(
  code TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  frontier TEXT,
  next_action TEXT,
  updated_at TEXT
);

CREATE TABLE IF NOT EXISTS byproducts(
  code TEXT PRIMARY KEY,
  title TEXT,
  origin TEXT,
  parents TEXT,
  body TEXT,
  status TEXT,
  dcsg_relation TEXT,
  collision_state TEXT,
  source_document_id INTEGER REFERENCES documents(id),
  ordinal INTEGER
);

CREATE TABLE IF NOT EXISTS claims(
  id INTEGER PRIMARY KEY,
  thread_code TEXT REFERENCES research_threads(code),
  statement TEXT NOT NULL,
  status TEXT NOT NULL,
  novelty_state TEXT,
  proof_document_id INTEGER REFERENCES documents(id),
  provenance_document_id INTEGER REFERENCES documents(id),
  superseded_by INTEGER REFERENCES claims(id)
);

CREATE TABLE IF NOT EXISTS sources(
  id INTEGER PRIMARY KEY,
  citation_key TEXT UNIQUE,
  author TEXT,
  title TEXT NOT NULL,
  year TEXT,
  doi TEXT,
  url TEXT,
  source_type TEXT,
  authority_level TEXT,
  local_document_id INTEGER REFERENCES documents(id),
  audit_state TEXT
);

CREATE TABLE IF NOT EXISTS claim_sources(
  claim_id INTEGER REFERENCES claims(id),
  source_id INTEGER REFERENCES sources(id),
  locator TEXT,
  relation TEXT,
  PRIMARY KEY(claim_id, source_id, locator)
);

CREATE TABLE IF NOT EXISTS artifacts(
  id INTEGER PRIMARY KEY,
  document_id INTEGER UNIQUE REFERENCES documents(id),
  status TEXT,
  thread_code TEXT REFERENCES research_threads(code),
  created_from TEXT
);

CREATE TABLE IF NOT EXISTS corrections(
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_key TEXT NOT NULL,
  old_state TEXT,
  new_state TEXT NOT NULL,
  provenance_document_id INTEGER REFERENCES documents(id)
);

CREATE TABLE IF NOT EXISTS checkpoints(
  id INTEGER PRIMARY KEY,
  created_at TEXT NOT NULL,
  label TEXT NOT NULL,
  state_sha256 TEXT,
  registry_sha256 TEXT,
  next_byproduct_id TEXT,
  notes TEXT
);
