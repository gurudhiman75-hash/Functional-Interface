import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Every action that publishes or schedules a test must pass through BOTH the QA
// gate and the localization gate. A new publish/schedule action that is added to
// admin-tests.ts but not to the gates would silently skip those checks.
const GATED_ACTIONS = ["approve", "schedule", "publish", "approve-publish", "approve-schedule"];
const read = (name: string) => readFileSync(new URL(`./${name}`, import.meta.url), "utf8");

test("QA and localization gates cover every publish/schedule action", () => {
  for (const file of ["admin-test-qa-gate.ts", "admin-test-localization-gate.ts"]) {
    const source = read(file);
    for (const action of GATED_ACTIONS) {
      assert.ok(source.includes(`"/:id/actions/${action}"`), `${file} must gate /actions/${action}`);
    }
  }
});

test("bulk workflow cannot publish or schedule through the direct (QA-free) actions", () => {
  const bulk = read("admin-test-bulk-workflow.ts");
  assert.ok(!/ACTIONS\s*=\s*\[[^\]]*approve-publish/.test(bulk));
  assert.ok(!/ACTIONS\s*=\s*\[[^\]]*approve-schedule/.test(bulk));
});
