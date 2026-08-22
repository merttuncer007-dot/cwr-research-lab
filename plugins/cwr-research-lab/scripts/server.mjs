#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { createServer as createHttpServer } from "node:http";
import { DatabaseSync } from "node:sqlite";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as z from "zod/v4";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const DEFAULT_LAB_ROOT = resolve(SCRIPT_DIR, "..", "..", "..", "CWR_RESEARCH_LAB");
const SERVER_NAME = "cwr-research-lab";
const SERVER_VERSION = "0.1.0";
const MAX_TEXT = 50_000;

export function resolveLabRoot(value = process.env.CWR_LAB_ROOT) {
  return resolve(value || DEFAULT_LAB_ROOT);
}

function assertLabRoot(labRoot) {
  const required = [
    resolve(labRoot, "data", "lab.sqlite3"),
    resolve(labRoot, "LAB_KERNEL.md"),
    resolve(labRoot, "LAB_STATE.md"),
  ];
  const missing = required.filter((path) => !existsSync(path));
  if (missing.length) {
    throw new Error(`CWR lab root is incomplete: ${missing.join(", ")}`);
  }
}

function openDatabase(labRoot) {
  assertLabRoot(labRoot);
  return new DatabaseSync(resolve(labRoot, "data", "lab.sqlite3"), {
    readOnly: true,
  });
}

function plain(row) {
  return row ? { ...row } : row;
}

function rows(statement, ...params) {
  return statement.all(...params).map(plain);
}

function scalar(db, sql, ...params) {
  const row = db.prepare(sql).get(...params);
  return row ? Object.values(row)[0] : null;
}

function textResult(payload, summary) {
  return {
    structuredContent: payload,
    content: [
      {
        type: "text",
        text: summary || JSON.stringify(payload, null, 2),
      },
    ],
  };
}

function errorResult(message) {
  return {
    isError: true,
    content: [{ type: "text", text: message }],
  };
}

function readUtf8(path) {
  return readFileSync(path, "utf8").replace(/^\uFEFF/, "");
}

function ftsExpression(query, joiner = " AND ") {
  const tokens = String(query).match(/[\p{L}\p{N}_-]+/gu) || [];
  return tokens
    .slice(0, 20)
    .map((token) => `"${token.replaceAll('"', '""')}"`)
    .join(joiner);
}

function searchArchive(db, query, limit) {
  const exact = ftsExpression(query);
  if (!exact) return [];
  const statement = db.prepare(
    "SELECT f.document_id, CAST(f.chunk_id AS INTEGER) AS chunk_id, " +
      "f.preferred_name, dc.line_start, dc.line_end, " +
      "snippet(chunks_fts,0,'[[',']]', ' ... ',24) AS snippet, " +
      "bm25(chunks_fts) AS score " +
      "FROM chunks_fts f " +
      "JOIN document_chunks dc ON dc.id=CAST(f.chunk_id AS INTEGER) " +
      "WHERE chunks_fts MATCH ? ORDER BY score LIMIT ?",
  );
  let found = rows(statement, exact, limit);
  if (!found.length) {
    found = rows(statement, ftsExpression(query, " OR "), limit);
  }
  return found;
}

function cleanRemoteUrl(raw) {
  if (!raw) return null;
  try {
    const url = new URL(raw);
    url.username = "";
    url.password = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return raw;
  }
}

function runGit(repoRoot, args) {
  return execFileSync("git", ["-C", repoRoot, ...args], {
    encoding: "utf8",
    windowsHide: true,
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function registerReadTools(server, labRoot) {
  const annotations = {
    readOnlyHint: true,
    openWorldHint: false,
    destructiveHint: false,
  };

  server.registerTool(
    "lab_status",
    {
      title: "Get CWR lab status",
      description:
        "Read canonical CWR archive counts, frontier state, autonomy setting, and open integrity warnings before continuing earlier work.",
      inputSchema: {},
      annotations,
    },
    async () => {
      const db = openDatabase(labRoot);
      try {
        const counts = {
          blobs: scalar(db, "SELECT COUNT(*) FROM content_blobs"),
          occurrences: scalar(db, "SELECT COUNT(*) FROM occurrences"),
          documents: scalar(db, "SELECT COUNT(*) FROM documents"),
          chunks: scalar(db, "SELECT COUNT(*) FROM document_chunks"),
          conversation_turns: scalar(db, "SELECT COUNT(*) FROM conversation_turns"),
          byproducts: scalar(db, "SELECT COUNT(*) FROM byproducts"),
          registry_max: scalar(db, "SELECT COALESCE(MAX(number),0) FROM byproduct_versions"),
          confirmed_max: scalar(db, "SELECT COALESCE(MAX(number),0) FROM byproducts"),
          papers: scalar(db, "SELECT COUNT(*) FROM papers"),
          source_ledger_entries: scalar(db, "SELECT COUNT(*) FROM source_ledger_entries"),
          checkpoints: scalar(db, "SELECT COUNT(*) FROM checkpoints"),
        };
        const autonomy = scalar(db, "SELECT value FROM meta WHERE key='autonomy'");
        const issues = rows(
          db.prepare(
            "SELECT issue_key,severity,status,summary,evidence FROM integrity_issues WHERE status='OPEN' ORDER BY id",
          ),
        );
        const state = readUtf8(resolve(labRoot, "LAB_STATE.md"));
        const payload = { counts, autonomy, issues, state };
        return textResult(
          payload,
          `CWR lab: ${counts.documents} documents, ${counts.byproducts} byproducts, ` +
            `available BP-${String(counts.registry_max).padStart(3, "0")}, ` +
            `confirmed BP-${String(counts.confirmed_max).padStart(3, "0")}. ` +
            `Autonomy=${autonomy}; open integrity issues=${issues.length}.\n\n${state}`,
        );
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "search_archive",
    {
      title: "Search the CWR archive",
      description:
        "Search stored document chunks with SQLite full-text search. Results are excerpts with document, chunk, line, and score locators, not full-document reading claims.",
      inputSchema: {
        query: z.string().min(1).max(500).describe("Terms or phrase to find"),
        limit: z.number().int().min(1).max(25).default(8),
      },
      annotations,
    },
    async ({ query, limit }) => {
      const db = openDatabase(labRoot);
      try {
        const results = searchArchive(db, query, limit);
        return textResult(
          { query, results },
          results.length
            ? results
                .map(
                  (item, index) =>
                    `[${index + 1}] document=${item.document_id}; chunk=${item.chunk_id}; ` +
                    `${item.preferred_name}; lines=${item.line_start}-${item.line_end}\n${item.snippet}`,
                )
                .join("\n\n")
            : `No archive matches for: ${query}`,
        );
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get_document",
    {
      title: "Read a stored CWR document",
      description:
        "Read exact stored text and provenance metadata for one document ID, optionally restricted to a line interval.",
      inputSchema: {
        document_id: z.number().int().positive(),
        line_start: z.number().int().positive().default(1),
        line_end: z.number().int().positive().optional(),
        max_chars: z.number().int().min(1000).max(MAX_TEXT).default(20_000),
      },
      annotations,
    },
    async ({ document_id, line_start, line_end, max_chars }) => {
      const db = openDatabase(labRoot);
      try {
        const document = plain(
          db
            .prepare(
              "SELECT id,blob_sha256,preferred_name,kind,title,version_label,canonicality,line_count,text_content " +
                "FROM documents WHERE id=?",
            )
            .get(document_id),
        );
        if (!document) return errorResult(`Document ${document_id} was not found.`);
        const allLines = String(document.text_content || "").split(/\r?\n/);
        const end = Math.min(line_end || line_start + 199, allLines.length);
        if (end < line_start) return errorResult("line_end must be greater than or equal to line_start.");
        const fullExcerpt = allLines.slice(line_start - 1, end).join("\n");
        const excerpt = fullExcerpt.slice(0, max_chars);
        delete document.text_content;
        const payload = {
          document,
          locator: { line_start, line_end: end },
          excerpt,
          truncated: fullExcerpt.length > excerpt.length,
        };
        return textResult(
          payload,
          `${document.preferred_name} | document=${document_id}; lines=${line_start}-${end}; ` +
            `sha256=${document.blob_sha256}; canonicality=${document.canonicality}\n\n${excerpt}`,
        );
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get_byproduct",
    {
      title: "Get a CWR byproduct",
      description:
        "Retrieve one canonical or transcript-confirmed CWR byproduct with its evidence and artifact state. Accepts CWR-BP-220 or 220.",
      inputSchema: {
        code: z.union([z.string().min(1), z.number().int().positive()]),
      },
      annotations,
    },
    async ({ code }) => {
      const normalized =
        typeof code === "number"
          ? `CWR-BP-${String(code).padStart(3, "0")}`
          : /^\d+$/.test(code.trim())
            ? `CWR-BP-${code.trim().padStart(3, "0")}`
            : code.trim().toUpperCase();
      const db = openDatabase(labRoot);
      try {
        const byproduct = plain(
          db
            .prepare(
              "SELECT code,number,title,status,body,evidence_level,artifact_state,source_document_id,updated_at " +
                "FROM byproducts WHERE code=?",
            )
            .get(normalized),
        );
        if (!byproduct) return errorResult(`${normalized} was not found.`);
        const events = rows(
          db.prepare(
            "SELECT event_type,old_value,new_value,note,created_at FROM byproduct_events WHERE code=? ORDER BY id",
          ),
          normalized,
        );
        return textResult(
          { byproduct, events },
          `${byproduct.code} - ${byproduct.title}\nStatus: ${byproduct.status}; ` +
            `evidence=${byproduct.evidence_level}; artifact=${byproduct.artifact_state}\n\n${byproduct.body}`,
        );
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "get_paper",
    {
      title: "Get a recorded paper",
      description:
        "Look up papers already recorded in the CWR source ledger by database ID, DOI, or title text, including read scope and verification status.",
      inputSchema: {
        paper_id: z.number().int().positive().optional(),
        doi: z.string().min(1).max(300).optional(),
        title: z.string().min(1).max(300).optional(),
      },
      annotations,
    },
    async ({ paper_id, doi, title }) => {
      if (!paper_id && !doi && !title) {
        return errorResult("Provide paper_id, doi, or title.");
      }
      const db = openDatabase(labRoot);
      try {
        let papers;
        if (paper_id) {
          papers = rows(db.prepare("SELECT * FROM papers WHERE id=?"), paper_id);
        } else if (doi) {
          papers = rows(db.prepare("SELECT * FROM papers WHERE lower(doi)=lower(?)"), doi.trim());
        } else {
          papers = rows(
            db.prepare("SELECT * FROM papers WHERE title LIKE ? ORDER BY year DESC,id LIMIT 10"),
            `%${title.trim()}%`,
          );
        }
        return textResult(
          { papers },
          papers.length ? JSON.stringify(papers, null, 2) : "No recorded paper matched the lookup.",
        );
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "list_integrity_issues",
    {
      title: "List CWR integrity issues",
      description:
        "List archive integrity warnings, especially transcript-confirmed byproducts whose canonical physical artifacts are missing.",
      inputSchema: {
        status: z.enum(["OPEN", "RESOLVED", "ALL"]).default("OPEN"),
      },
      annotations,
    },
    async ({ status }) => {
      const db = openDatabase(labRoot);
      try {
        const issues =
          status === "ALL"
            ? rows(db.prepare("SELECT * FROM integrity_issues ORDER BY id"))
            : rows(
                db.prepare("SELECT * FROM integrity_issues WHERE status=? ORDER BY id"),
                status,
              );
        return textResult({ status, issues });
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "build_context",
    {
      title: "Build a CWR rehydration context",
      description:
        "Assemble the stored kernel, current state, recent byproducts, open integrity warnings, and query-relevant archive excerpts in memory for a new session. Does not write a file or mutate the lab.",
      inputSchema: {
        query: z.string().min(1).max(500),
        limit: z.number().int().min(1).max(15).default(6),
      },
      annotations,
    },
    async ({ query, limit }) => {
      const db = openDatabase(labRoot);
      try {
        const kernel = readUtf8(resolve(labRoot, "LAB_KERNEL.md"));
        const state = readUtf8(resolve(labRoot, "LAB_STATE.md"));
        const issues = rows(
          db.prepare(
            "SELECT severity,summary,evidence FROM integrity_issues WHERE status='OPEN' ORDER BY id",
          ),
        );
        const active = rows(
          db.prepare(
            "SELECT code,title,status,evidence_level,artifact_state FROM byproducts ORDER BY number DESC LIMIT 8",
          ),
        ).reverse();
        const matches = searchArchive(db, query, limit);
        const excerpts = matches.map((match) => {
          const body = scalar(db, "SELECT body FROM document_chunks WHERE id=?", match.chunk_id);
          const sha256 = scalar(db, "SELECT blob_sha256 FROM documents WHERE id=?", match.document_id);
          return { ...match, sha256, body };
        });
        const sections = [
          "# CWR Deterministic Rehydration Context",
          `Query: ${query}`,
          "## Required kernel",
          kernel,
          "## Current state",
          state,
          "## Active nodes",
          ...active.map(
            (item) =>
              `- ${item.code} - ${item.title} | ${item.status} | ${item.evidence_level} | ${item.artifact_state}`,
          ),
          "## Open integrity issues",
          ...issues.map(
            (issue) => `- [${issue.severity}] ${issue.summary} Evidence: ${issue.evidence || "n/a"}`,
          ),
          "## Query-relevant archive excerpts",
          ...excerpts.map(
            (item, index) =>
              `### R${index + 1}: ${item.preferred_name}\n` +
              `Locator: document=${item.document_id}; chunk=${item.chunk_id}; ` +
              `lines=${item.line_start}-${item.line_end}; sha256=${item.sha256}\n\n${item.body}`,
          ),
          "## Continuation boundary",
          "Treat transcript-confirmed/missing-artifact records as evidence of state, not verbatim canonical text. Do not silently promote novelty, proof, or reading status.",
        ];
        const context = sections.join("\n\n").slice(0, MAX_TEXT);
        return textResult(
          { query, active, issues, excerpts, context },
          context,
        );
      } finally {
        db.close();
      }
    },
  );

  server.registerTool(
    "gitlab_backup_status",
    {
      title: "Inspect GitLab backup status",
      description:
        "Inspect the local Git repository branch, commit, cleanliness, and configured origin without contacting GitLab or pushing changes.",
      inputSchema: {},
      annotations,
    },
    async () => {
      const repoRoot = resolve(labRoot, "..");
      try {
        const status = runGit(repoRoot, ["status", "--short", "--branch"]);
        const remote = cleanRemoteUrl(runGit(repoRoot, ["remote", "get-url", "origin"]));
        const head = runGit(repoRoot, ["rev-parse", "HEAD"]);
        const branch = runGit(repoRoot, ["branch", "--show-current"]);
        const dirtyLines = status
          .split(/\r?\n/)
          .filter((line) => line && !line.startsWith("##"));
        const payload = {
          repo_root: repoRoot,
          branch,
          head,
          remote,
          clean: dirtyLines.length === 0,
          pending_changes: dirtyLines,
          note: "Read-only inspection; no network call or push was performed.",
        };
        return textResult(payload);
      } catch (error) {
        return errorResult(`Git backup status could not be read: ${error.message}`);
      }
    },
  );
}

export function createCwrServer(labRoot = resolveLabRoot()) {
  const server = new McpServer(
    { name: SERVER_NAME, version: SERVER_VERSION },
    {
      instructions:
        "Use this server as the read-only source of truth for the persistent CWR lab. Check lab_status before continuation. Search snippets are not full-document reading. Never invent missing canonical artifacts or imply that this server performed a Git push.",
    },
  );
  registerReadTools(server, labRoot);
  return server;
}

function optionValue(name, fallback) {
  const index = process.argv.indexOf(name);
  return index >= 0 && process.argv[index + 1] ? process.argv[index + 1] : fallback;
}

async function runStdio() {
  const server = createCwrServer();
  await server.connect(new StdioServerTransport());
  console.error(`CWR MCP ${SERVER_VERSION} running over stdio (read-only).`);
}

async function runHttp() {
  const host = optionValue("--host", process.env.CWR_MCP_HOST || "127.0.0.1");
  const port = Number(optionValue("--port", process.env.CWR_MCP_PORT || "8787"));
  const token = process.env.CWR_MCP_BEARER_TOKEN || "";
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("--port must be an integer between 1 and 65535.");
  }
  if (!["127.0.0.1", "::1", "localhost"].includes(host) && !token) {
    throw new Error("Refusing a non-loopback HTTP bind without CWR_MCP_BEARER_TOKEN.");
  }

  const app = createMcpExpressApp({ host });
  app.get("/health", (_req, res) => {
    res.json({ ok: true, name: SERVER_NAME, version: SERVER_VERSION, readOnly: true });
  });
  app.use("/mcp", (req, res, next) => {
    if (!token) return next();
    if (req.headers.authorization !== `Bearer ${token}`) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    return next();
  });
  app.post("/mcp", async (req, res) => {
    const server = createCwrServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    try {
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      res.on("close", () => {
        transport.close();
        server.close();
      });
    } catch (error) {
      console.error("MCP HTTP request failed:", error);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });
  app.get("/mcp", (_req, res) => res.status(405).set("Allow", "POST").send("Method Not Allowed"));
  app.delete("/mcp", (_req, res) => res.status(405).set("Allow", "POST").send("Method Not Allowed"));

  const httpServer = createHttpServer(app);
  await new Promise((resolveListen, reject) => {
    httpServer.once("error", reject);
    httpServer.listen(port, host, resolveListen);
  });
  console.error(`CWR MCP ${SERVER_VERSION} listening at http://${host}:${port}/mcp (read-only).`);
}

async function main() {
  assertLabRoot(resolveLabRoot());
  if (process.argv.includes("--http")) {
    await runHttp();
  } else {
    await runStdio();
  }
}

const entry = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === entry) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exit(1);
  });
}
