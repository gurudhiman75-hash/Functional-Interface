import assert from "node:assert/strict";
import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009,
} from "./runtime-v6";
import { runCp009Authority } from "./authority-core";
import { generateSapCp009ReviewRecords } from "./full-review";

runCp009Authority({
  prototypeIds: SAP_CP009_PROTOTYPE_IDS,
  catalogueLength: SAP_CP009_CATALOGUE.length,
  policy: SAP_CP009_POLICY,
  generate: generateSapCp009,
  seedsPerMode: 100,
});

const records = generateSapCp009ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((r) => r.questionId)).size, 300);
assert.equal(new Set(records.map((r) => r.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((r) => r.generationIdentity)).size, 300);
assert.equal(new Set(records.map((r) => r.prototypeId)).size, 19);
assert.deepEqual(
  [...new Set(records.map((r) => r.proposedPermanentQlId))].sort(),
  Array.from({ length: 19 }, (_, i) => `SAP-QL-${String(147 + i).padStart(3, "0")}`),
);

const byMode = new Map<string, number>();
const positions = [0, 0, 0, 0];
const ratioRelations = new Set<string>();
const overUnder = new Set<string>();
const nearestKinds = new Set<string>();
let longestSamePositionRun = 1;
let currentRun = 1;
for (let i = 0; i < records.length; i += 1) {
  const record = records[i]!;
  byMode.set(record.prototypeId, (byMode.get(record.prototypeId) ?? 0) + 1);
  positions[record.correctIndex]! += 1;
  assert.equal(record.validation.ok, true, `${record.questionId}: ${record.validation.errors.join("; ")}`);
  assert.equal(record.options.length, 4);
  assert.equal(new Set(record.options.map((o) => o.value)).size, 4);
  assert.ok(record.stem.length <= 260, `${record.questionId}: stem too long for exam-style review.`);
  assert.ok(record.explanation.steps.length >= 2 && record.explanation.steps.length <= 3);
  const learnerText = `${record.stem} ${record.explanation.coreConcept} ${record.explanation.steps.join(" ")} ${record.options.map((o) => o.analysis).join(" ")}`;
  assert.doesNotMatch(learnerText, /oracle|runtime|prototype|canonical|learner route|transformed expression|internal|guard|apply the declared/i);
  assert.equal(record.lifecycle.active, false);
  assert.equal(record.lifecycle.questionStudioDiscoverable, false);
  assert.equal(record.lifecycle.questionBankWritable, false);
  assert.equal(record.lifecycle.testEligible, false);
  assert.equal(record.lifecycle.publiclyPublishable, false);
  if (record.prototypeId === "SAP-CP009-PROT-COMPARE-APPROX-RATIOS") ratioRelations.add(record.canonicalAnswer);
  if (record.prototypeId === "SAP-CP009-PROT-PRODUCT-OVER-UNDER-CLASS") overUnder.add(record.canonicalAnswer);
  if (record.prototypeId === "SAP-CP009-PROT-NEAREST-OPTION-PRODUCT-QUOTIENT") nearestKinds.add(String(record.oracle.data.kind));
  if (i > 0 && records[i - 1]!.correctIndex === record.correctIndex) {
    currentRun += 1;
    longestSamePositionRun = Math.max(longestSamePositionRun, currentRun);
  } else {
    currentRun = 1;
  }
}

SAP_CP009_PROTOTYPE_IDS.forEach((prototypeId, modeIndex) => {
  assert.equal(byMode.get(prototypeId), modeIndex < 15 ? 16 : 15, `${prototypeId}: review count mismatch.`);
});
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.ok(longestSamePositionRun < 3, `Answer-position streak too long: ${longestSamePositionRun}.`);
assert.deepEqual([...ratioRelations].sort(), ["A < B", "A = B", "A > B"].sort());
assert.ok(overUnder.has("Overestimate"));
assert.ok(overUnder.has("Underestimate"));
assert.deepEqual([...nearestKinds].sort(), ["PRODUCT", "QUOTIENT"]);
assert.ok(records.some((r) => r.prototypeId === "SAP-CP009-PROT-POSITIVE-PRODUCT-BOUNDS"));
assert.ok(records.some((r) => r.prototypeId === "SAP-CP009-PROT-POSITIVE-QUOTIENT-BOUNDS"));
assert.ok(records.some((r) => r.prototypeId === "SAP-CP009-PROT-DECIMAL-SCALE-DIAGNOSIS"));
assert.ok(records.some((r) => r.prototypeId === "SAP-CP009-PROT-RATIO-DISTORTION-DIAGNOSIS"));

console.log("SAP-CP-009 300-question review passed: 19 identities, 75/75/75/75 answers, no 3-position streak, full ratio/over-under/nearest-option diversity, short explanations and inactive lifecycle.");
