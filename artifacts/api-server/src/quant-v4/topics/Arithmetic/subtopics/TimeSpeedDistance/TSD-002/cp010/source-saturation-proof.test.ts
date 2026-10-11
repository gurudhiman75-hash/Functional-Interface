import {
  TSD_CP010_AUTHORITY_KEYS,
  TSD_CP010_SOURCE_SATURATION,
  TSD_CP010_SOURCE_SATURATION_SUMMARY,
} from "./source-saturation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-010 source saturation proof failed: ${message}`);
}

assert(TSD_CP010_SOURCE_SATURATION.length === 34, "expected exactly 34 source candidates");
assert(new Set(TSD_CP010_SOURCE_SATURATION.map((x) => x.id)).size === 34, "candidate ids must be unique");
assert(new Set(TSD_CP010_SOURCE_SATURATION.map((x) => x.sourceKey)).size === 34, "source keys must be unique");
assert(TSD_CP010_AUTHORITY_KEYS.length === 10, "expected exactly 10 learner authorities");
assert(TSD_CP010_SOURCE_SATURATION_SUMMARY.learnerAuthorities === 10, "learner-authority count mismatch");
assert(TSD_CP010_SOURCE_SATURATION_SUMMARY.mergedRepresentations === 19, "merged-representation count mismatch");
assert(TSD_CP010_SOURCE_SATURATION_SUMMARY.crossCheckpointHolds === 1, "cross-checkpoint hold count mismatch");
assert(TSD_CP010_SOURCE_SATURATION_SUMMARY.internalQaModes === 4, "internal-QA count mismatch");

for (const key of TSD_CP010_AUTHORITY_KEYS) {
  const roots = TSD_CP010_SOURCE_SATURATION.filter((x) => x.disposition === "LEARNER_AUTHORITY" && x.authorityKey === key);
  assert(roots.length === 1, `${key} must have exactly one learner-authority root`);
}

const relay = TSD_CP010_SOURCE_SATURATION.find((x) => x.sourceKey === "findRelayLegTimeOrDistance");
assert(relay?.disposition === "CROSS_CHECKPOINT_HOLD", "relay synthesis must stay out of CP010");
assert(relay.note.includes("CP012"), "relay hold must identify CP012 ownership");

console.log("TSD-CP-010 SOURCE SATURATION PROOF: PASS");
console.log(JSON.stringify(TSD_CP010_SOURCE_SATURATION_SUMMARY, null, 2));