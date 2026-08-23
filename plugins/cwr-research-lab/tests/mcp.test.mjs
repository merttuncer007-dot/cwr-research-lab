import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const PLUGIN_ROOT = resolve(TEST_DIR, "..");
const LAB_ROOT = resolve(PLUGIN_ROOT, "..", "..", "CWR_RESEARCH_LAB");
const SERVER = resolve(PLUGIN_ROOT, "scripts", "server.mjs");

async function connectedClient() {
  const client = new Client({ name: "cwr-plugin-test", version: "0.2.0" });
  const transport = new StdioClientTransport({
    command: process.execPath,
    args: [SERVER, "--stdio"],
    env: { ...process.env, CWR_LAB_ROOT: LAB_ROOT },
    stderr: "pipe",
  });
  await client.connect(transport);
  return client;
}

async function connectedLauncherClient() {
  const client = new Client({ name: "cwr-launcher-test", version: "0.2.0" });
  const transport = new StdioClientTransport({
    command: "cmd.exe",
    args: ["/d", "/s", "/c", "call", "./scripts/launch_cwr_mcp.cmd"],
    cwd: PLUGIN_ROOT,
    env: { ...process.env },
    stderr: "pipe",
  });
  await client.connect(transport);
  return client;
}

test("publishes only the intended read-only tool surface", async (t) => {
  const client = await connectedClient();
  t.after(() => client.close());
  const listing = await client.listTools();
  const names = listing.tools.map((tool) => tool.name).sort();
  assert.deepEqual(names, [
    "build_context",
    "get_byproduct",
    "get_document",
    "get_paper",
    "gitlab_backup_status",
    "lab_status",
    "list_integrity_issues",
    "rehydrate_lab",
    "search_archive",
  ]);
  for (const tool of listing.tools) {
    assert.equal(tool.annotations?.readOnlyHint, true);
    assert.equal(tool.annotations?.destructiveHint, false);
  }
});

test("the packaged Windows launcher resolves Node and the lab", { skip: process.platform !== "win32" }, async (t) => {
  const client = await connectedLauncherClient();
  t.after(() => client.close());
  const status = await client.callTool({ name: "lab_status", arguments: {} });
  assert.ok(status.structuredContent.counts.documents >= 75);
});

test("reads the canonical lab state and archived records", async (t) => {
  const client = await connectedClient();
  t.after(() => client.close());

  const status = await client.callTool({ name: "lab_status", arguments: {} });
  assert.equal(status.isError, undefined);
  assert.ok(status.structuredContent.counts.documents >= 75);
  assert.ok(status.structuredContent.counts.confirmed_max >= 220);
  assert.equal(status.structuredContent.autonomy.toLowerCase(), "disabled");

  const search = await client.callTool({
    name: "search_archive",
    arguments: { query: "rank two PSD", limit: 3 },
  });
  assert.ok(search.structuredContent.results.length > 0);
  assert.ok(search.structuredContent.results[0].document_id > 0);

  const byproduct = await client.callTool({
    name: "get_byproduct",
    arguments: { code: 220 },
  });
  assert.equal(byproduct.structuredContent.byproduct.code, "CWR-BP-220");
  assert.match(byproduct.structuredContent.byproduct.artifact_state, /MISSING|AVAILABLE/);
});

test("rehydrates in one bounded call and does not gate readiness on remote connectivity", async (t) => {
  const client = await connectedClient();
  t.after(() => client.close());

  const result = await client.callTool({ name: "rehydrate_lab", arguments: {} });
  assert.equal(result.isError, undefined);
  assert.equal(result.structuredContent.readiness.archive_integrity, "verified");
  assert.equal(result.structuredContent.readiness.ready_for_instruction, true);
  assert.equal(result.structuredContent.connectivity.bridge_is_readiness_gate, false);
  assert.equal(result.structuredContent.coverage.blobs_verified, 75);
  assert.equal(result.structuredContent.coverage.conversation_turns_indexed, 88);
  assert.equal(result.structuredContent.research_pointer.next_byproduct, "CWR-BP-221");
  assert.match(result.content[0].text, /CWR INSTANCE READY/);
});

test("builds an in-memory sourced context without adding a file", async (t) => {
  const client = await connectedClient();
  t.after(() => client.close());
  const result = await client.callTool({
    name: "build_context",
    arguments: { query: "scalar sign reachability", limit: 2 },
  });
  assert.match(result.structuredContent.context, /CWR Deterministic Rehydration Context/);
  assert.equal(result.structuredContent.excerpts.length, 2);
});

test("serves the same tools over Streamable HTTP for ChatGPT", async (t) => {
  const port = 20_000 + (process.pid % 10_000);
  const child = spawn(
    process.execPath,
    [SERVER, "--http", "--host", "127.0.0.1", "--port", String(port)],
    {
      env: { ...process.env, CWR_LAB_ROOT: LAB_ROOT },
      stdio: ["ignore", "ignore", "pipe"],
      windowsHide: true,
    },
  );
  t.after(() => child.kill());

  const health = `http://127.0.0.1:${port}/health`;
  let ready = false;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(health);
      if (response.ok) {
        ready = true;
        break;
      }
    } catch {
      // Server startup is asynchronous.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 100));
  }
  assert.equal(ready, true, "HTTP MCP server did not become healthy");

  const client = new Client({ name: "cwr-http-test", version: "0.2.0" });
  t.after(() => client.close());
  await client.connect(
    new StreamableHTTPClientTransport(new URL(`http://127.0.0.1:${port}/mcp`)),
  );
  const status = await client.callTool({ name: "lab_status", arguments: {} });
  assert.ok(status.structuredContent.counts.byproducts >= 220);
});

