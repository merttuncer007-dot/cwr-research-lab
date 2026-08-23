# CWR ChatGPT Rehydration Entry v2

This repository is a distribution/backup layer, not the runtime memory of the lab.
The canonical working state is the local SQLite database plus content-addressed
objects. ChatGPT should load a verified working capsule and retrieve exact evidence
on demand; it must not serially read the whole archive into one model turn.

## One-step load order

1. If the CWR MCP tool `rehydrate_lab` exists, call it once.
2. Otherwise fetch exactly
   `CWR_RESEARCH_LAB/exports/REHYDRATION_BOOTSTRAP.json`.
3. Optionally verify it against
   `CWR_RESEARCH_LAB/exports/RELEASE_MANIFEST.json`.
4. Do not search commits and do not enumerate `objects/sha256/` during bootstrap.

Public raw bootstrap:

`https://raw.githubusercontent.com/merttuncer007-dot/cwr-research-lab/main/CWR_RESEARCH_LAB/exports/REHYDRATION_BOOTSTRAP.json`

## Readiness rule

`archive_integrity=verified`, `research_state_ready=true`, and an empty
`blocking_failures` list are sufficient for `ready_for_instruction: yes`.
An unavailable plugin, tunnel, GitLab connection, GitHub connector, or live MCP
cross-check changes only `working_mode`/connectivity. It is not a blocking failure
when the packaged/static snapshot is verified.

Open integrity warnings must remain visible. In particular,
`TRANSCRIPT-CONFIRMED / CANONICAL-ARTIFACT-MISSING` is an evidence boundary, not
a reason to erase the confirmed research pointer.

## After load

- Treat chat memory as temporary.
- Keep snapshot ID, source hashes, coverage, kernel/state, pointer, open issues,
  active nodes, and document locators from the capsule.
- For a new query use query-specific context/search and exact document retrieval.
- Search snippets are not full-document reading.
- Do not mutate the lab, commit/push, or start autonomous research unless asked.
- Emit the terminal report specified by `MATRYOSHKA.txt`, then wait.


