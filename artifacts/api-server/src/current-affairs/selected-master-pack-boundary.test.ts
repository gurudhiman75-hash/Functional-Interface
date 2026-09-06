import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  evaluateSelectedMasterPackMembership,
  evaluateSelectedMasterPackQuality,
  SELECTED_MASTER_PACK_BOUNDARY_VERSION,
} from "./selected-daily-master-pack";

const a = "11111111-1111-4111-8111-111111111111";
const b = "22222222-2222-4222-8222-222222222222";
const c = "33333333-3333-4333-8333-333333333333";

assert.equal(SELECTED_MASTER_PACK_BOUNDARY_VERSION, "ca-cp068-selected-master-pack-boundary-v1");

const exact = evaluateSelectedMasterPackMembership([a, b], [b, a]);
assert.equal(exact.complete, true);
assert.equal(exact.expectedEventCount, 2);
assert.equal(exact.actualEventCount, 2);
assert.deepEqual(exact.missingEventIds, []);
assert.deepEqual(exact.extraEventIds, []);

const leaked = evaluateSelectedMasterPackMembership([a, b], [a, b, c]);
assert.equal(leaked.complete, false);
assert.deepEqual(leaked.extraEventIds, [c]);

const missing = evaluateSelectedMasterPackMembership([a, b], [a]);
assert.equal(missing.complete, false);
assert.deepEqual(missing.missingEventIds, [b]);

const duplicated = evaluateSelectedMasterPackMembership([a, b], [a, a, b]);
assert.equal(duplicated.complete, false);
assert.equal(duplicated.duplicateActualEventCount, 1);

const goodEvent = {
  id: a,
  publicCode: "CA-TEST-A",
  category: "national",
  eventDate: "2026-09-01",
  title: "RBI reports Q1 current account deficit",
  summary: "The Reserve Bank of India reported the Q1 current account deficit.",
  oneLiner: "Q1 current account deficit — Reserve Bank of India.",
  sourceTitleSimilarity: 0.55,
  examFamilies: ["banking"],
  facts: [{ key: "action_subject", value: "Q1 current account deficit", type: "string", confidence: 0.99 }],
  sources: [{ name: "Reserve Bank of India", url: "https://www.rbi.org.in/", primary: true }],
};
const goodQuality = evaluateSelectedMasterPackQuality([goodEvent] as any);
assert.equal(goodQuality.ready, true, goodQuality.blockers.join("\n"));

const badQuality = evaluateSelectedMasterPackQuality([
  { ...goodEvent, id: b, title: "CCI . purchase gets clearance", sourceTitleSimilarity: 0.73 },
] as any);
assert.equal(badQuality.ready, false);
assert.ok(badQuality.blockers.some((item) => item.includes("0.72 source-title similarity ceiling")));
assert.ok(badQuality.blockers.some((item) => item.includes("malformed punctuation")));

const duplicateQuality = evaluateSelectedMasterPackQuality([
  goodEvent,
  { ...goodEvent, id: c, publicCode: "CA-TEST-C" },
] as any);
assert.equal(duplicateQuality.ready, false);
assert.ok(duplicateQuality.blockers.some((item) => item.includes("Duplicate learner title")));
assert.ok(duplicateQuality.blockers.some((item) => item.includes("Duplicate learner one-liner")));

// Manual selection is the relevance/inclusion authority for the selected pack.
// A low-scored/routine event may still be QA-blocked, but must not be silently
// removed from selected membership by a second include_recommended SQL gate.
const routineSelectedQuality = evaluateSelectedMasterPackQuality([
  { ...goodEvent, id: b, examFamilies: [] },
] as any);
assert.equal(routineSelectedQuality.ready, false);
assert.ok(routineSelectedQuality.blockers.some((item) => item.includes("no recommended product exam family")));

const source = readFileSync(new URL("./selected-daily-master-pack.ts", import.meta.url), "utf8");
const loader = source.slice(
  source.indexOf("async function loadSelectedPackEvents"),
  source.indexOf("const RESOURCE_TITLE"),
);
assert.ok(loader.includes("Manual editorial selection is the relevance/inclusion authority"));
assert.ok(!loader.includes("AND EXISTS (\n        SELECT 1 FROM content.current_affairs_exam_scores relevance"));
assert.ok(loader.includes("score.include_recommended=true"), "Automated scores remain advisory pack annotations");

console.log("Current Affairs CP-068 selected master-pack boundary contracts passed");
