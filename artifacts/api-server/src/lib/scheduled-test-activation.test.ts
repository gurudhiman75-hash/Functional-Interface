import assert from "node:assert/strict";
import test from "node:test";

import { maybeActivateDueScheduledTests } from "./scheduled-test-activation";

test("scheduled activation runs at most once a minute per instance", async () => {
  let runs = 0;
  const run = async () => { runs += 1; return []; };
  await maybeActivateDueScheduledTests(1_000_000, run);
  await maybeActivateDueScheduledTests(1_030_000, run);
  assert.equal(runs, 1);
  await maybeActivateDueScheduledTests(1_061_000, run);
  assert.equal(runs, 2);
});

test("scheduled activation can be switched off", async () => {
  process.env.EXAMTREE_SCHEDULED_ACTIVATION_DISABLED = "true";
  let runs = 0;
  await maybeActivateDueScheduledTests(9_000_000, async () => { runs += 1; return []; });
  delete process.env.EXAMTREE_SCHEDULED_ACTIVATION_DISABLED;
  assert.equal(runs, 0);
});

test("a failing run never throws", async () => {
  await maybeActivateDueScheduledTests(20_000_000, async () => { throw new Error("db down"); });
});
