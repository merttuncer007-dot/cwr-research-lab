---
name: cwr-research-lab
description: Query or rehydrate the persistent Cold War Renaissance lab through its CWR MCP tools. Use for CWR archive search, lab status, byproduct lookup, paper lookup, integrity review, or query-specific context retrieval. Do not use it to invent missing artifacts or start autonomous research without an explicit request.
---

# CWR Research Lab

Treat the chat as a temporary client and the CWR database as the source of truth.

For a new instance, call `rehydrate_lab` once. It verifies the archive and returns a bounded capsule; do not replace it with a loop over all stored documents. A missing remote bridge is connectivity state, not a readiness failure when a static/local snapshot is independently verified. Use `search_archive` for discovery, then `get_document` or `get_byproduct` for exact stored material. Use `build_context` when an active query needs the kernel, current state, integrity warnings, and query-relevant excerpts together.

Preserve these boundaries:

- Distinguish canonical artifacts from transcript-confirmed records whose physical artifact is missing.
- Report proof, check, conjecture, novelty, and collision states exactly as stored.
- Do not claim a paper was read beyond its recorded `read_scope`.
- Do not treat a search snippet as the full document.
- Do not generate or append research merely because the plugin was invoked.
- Do not push, checkpoint, ingest, or mutate the lab unless a later write-capable tool exists and the user explicitly authorizes the action.

Use `gitlab_backup_status` only to inspect whether the local repository is clean and connected to the expected GitLab remote. It does not perform a push.

