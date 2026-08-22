# CWR Research Lab Plugin

This plugin is the shared access layer between ChatGPT/Codex and the existing CWR lab:

```text
Codex ------\
             +-- CWR Plugin -- MCP -- CWR SQLite database
ChatGPT ----/                         \\-- GitLab-backed repository
```

The first release exposes read-only tools. It does not ingest files, append byproducts, create waves, checkpoint, commit, or push.

## Local Codex transport

The bundled `.mcp.json` launches `scripts/server.mjs --stdio`. The server locates the repository's `CWR_RESEARCH_LAB` directory, or uses `CWR_LAB_ROOT` when set.

For installed/cache copies, set `CWR_LAB_ROOT` to the absolute lab directory and restart the ChatGPT/Codex desktop app so the MCP process inherits it. This workstation is configured with that user-level variable.

Install dependencies once inside this plugin directory:

```powershell
npm install
```

## ChatGPT transport

Run the same server with Streamable HTTP:

```powershell
npm run start:http -- --host 127.0.0.1 --port 8787
```

The MCP endpoint is `http://127.0.0.1:8787/mcp`. ChatGPT requires a reachable HTTPS MCP URL, so local testing needs an authenticated secure tunnel or later private hosting. Do not expose the endpoint publicly without authentication.

## Tools

- `lab_status`
- `search_archive`
- `get_document`
- `get_byproduct`
- `get_paper`
- `list_integrity_issues`
- `build_context`
- `gitlab_backup_status`

All database connections are opened read-only.
