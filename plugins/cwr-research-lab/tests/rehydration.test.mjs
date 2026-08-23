import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import {
  buildRehydrationCapsule,
  workingCapsuleView,
  writeRehydrationExports,
} from "../scripts/rehydration.mjs";

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const LAB_ROOT = resolve(TEST_DIR, "..", "..", "..", "CWR_RESEARCH_LAB");

test("rehydration is deterministic, complete, and leaves the canonical database unchanged", () => {
  const before = readFileSync(resolve(LAB_ROOT, "data", "lab.sqlite3"));
  const first = buildRehydrationCapsule(LAB_ROOT);
  const second = buildRehydrationCapsule(LAB_ROOT);
  const after = readFileSync(resolve(LAB_ROOT, "data", "lab.sqlite3"));

  assert.deepEqual(after, before);
  assert.equal(first.snapshot.snapshot_id, second.snapshot.snapshot_id);
  assert.equal(first.readiness.ready_for_instruction, true);
  assert.equal(first.connectivity.bridge_is_readiness_gate, false);
  assert.equal(first.coverage.blobs_verified, first.coverage.blobs_expected);
  assert.equal(first.coverage.chronology_index_complete, true);
  assert.equal(first.context_policy.eager_full_archive_tool_loop_required, false);
});

test("the working capsule is bounded but preserves the locator catalog", () => {
  const capsule = buildRehydrationCapsule(LAB_ROOT);
  const working = workingCapsuleView(capsule);
  const bytes = Buffer.byteLength(JSON.stringify(working));
  assert.ok(bytes < 50_000, `working capsule is unexpectedly large: ${bytes}`);
  assert.equal(working.provenance.document_catalog.length, working.coverage.documents_indexed);
  assert.equal(working.provenance.content_object_catalog, undefined);
});

test("a corrupted content object blocks readiness with an exact failure", () => {
  const temporary = mkdtempSync(resolve(tmpdir(), "cwr-rehydration-test-"));
  try {
    cpSync(LAB_ROOT, temporary, { recursive: true });
    const baseline = buildRehydrationCapsule(temporary);
    const target = baseline.provenance.content_object_catalog[0];
    const targetPath = resolve(temporary, ...target.object_relpath.split("/"));
    writeFileSync(targetPath, Buffer.from("tampered-test-object"));

    const corrupted = buildRehydrationCapsule(temporary);
    assert.equal(corrupted.readiness.ready_for_instruction, false);
    assert.equal(corrupted.readiness.archive_integrity, "failed");
    assert.deepEqual(corrupted.readiness.blocking_failures, ["archive_integrity_failed"]);
    assert.equal(corrupted.integrity.verification_failures[0].sha256, target.sha256);
  } finally {
    rmSync(temporary, { recursive: true, force: true });
  }
});

test("static exports are reproducible and self-describing", () => {
  const first = writeRehydrationExports(LAB_ROOT);
  const firstJson = readFileSync(first.bootstrapJsonPath, "utf8");
  const second = writeRehydrationExports(LAB_ROOT);
  const secondJson = readFileSync(second.bootstrapJsonPath, "utf8");
  assert.equal(secondJson, firstJson);
  const manifest = JSON.parse(readFileSync(second.manifestPath, "utf8"));
  assert.equal(manifest.ready_for_instruction, true);
  assert.equal(manifest.snapshot_id, second.capsule.snapshot.snapshot_id);
  assert.ok(manifest.files.some((item) => item.path.endsWith("REHYDRATION_BOOTSTRAP.json")));
});

