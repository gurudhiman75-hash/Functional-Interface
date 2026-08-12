import assert from "node:assert/strict";
import "./authority-editorial.test";
import { SAP_CP009_PROTOTYPE_IDS } from "./editorial-runtime";
import { generateSapCp009ReviewRecords } from "./full-review-v2";

const records = generateSapCp009ReviewRecords();
assert.equal(records.length, 300);
assert.equal(new Set(records.map((r) => r.questionId)).size, 300);
assert.equal(new Set(records.map((r) => r.canonicalPayloadKey)).size, 300);
assert.equal(new Set(records.map((r) => r.generationIdentity)).size, 300);
assert.equal(new Set(records.map((r) => r.prototypeId)).size, 19);

const positions = [0, 0, 0, 0];
const counts = new Map<string, number>();
const relations = new Set<string>();
const overUnder = new Set<string>();
const nearestKinds = new Set<string>();
let sameRun = 1;
let maxRun = 1;

for (let i = 0; i < records.length; i += 1) {
  const r = records[i]!;
  counts.set(r.prototypeId, (counts.get(r.prototypeId) ?? 0) + 1);
  positions[r.correctIndex]! += 1;
  assert.equal(r.validation.ok, true, `${r.questionId}: ${r.validation.errors.join("; ")}`);
  assert.equal(r.options.length, 4);
  assert.equal(new Set(r.options.map((o) => o.value)).size, 4);
  assert.ok(r.stem.length <= 260);
  assert.ok(r.explanation.steps.length >= 2 && r.explanation.steps.length <= 3);
  const studentText = `${r.stem} ${r.explanation.coreConcept} ${r.explanation.steps.join(" ")} ${r.explanation.verification.join(" ")} ${r.options.map((o) => o.analysis).join(" ")}`;
  assert.doesNotMatch(studentText, /oracle|runtime|prototype|canonical|learner route|transformed expression|internal|guard|apply the declared/i);
  assert.equal(r.lifecycle.active, false);
  assert.equal(r.lifecycle.questionStudioDiscoverable, false);
  assert.equal(r.lifecycle.questionBankWritable, false);
  assert.equal(r.lifecycle.testEligible, false);
  assert.equal(r.lifecycle.publiclyPublishable, false);
  if (r.prototypeId === SAP_CP009_PROTOTYPE_IDS[13]) relations.add(r.canonicalAnswer);
  if (r.prototypeId === SAP_CP009_PROTOTYPE_IDS[18]) overUnder.add(r.canonicalAnswer);
  if (r.prototypeId === SAP_CP009_PROTOTYPE_IDS[12]) {
    nearestKinds.add(String(r.oracle.data.kind));
    if (r.oracle.data.kind === "PRODUCT") {
      assert.equal(Number(r.oracle.data.roundUnit), 100);
      assert.equal(Number(r.canonicalAnswer) % 10000, 0, `${r.questionId}: nearest-product answer should be exam-calculable after hundred rounding.`);
    }
  }
  if (r.prototypeId === SAP_CP009_PROTOTYPE_IDS[18]) {
    assert.doesNotMatch(r.explanation.steps.join(" "), /\d{6,}\s*[×=]/, `${r.questionId}: unnecessary large multiplication leaked into explanation.`);
  }
  if (i > 0 && records[i - 1]!.correctIndex === r.correctIndex) {
    sameRun += 1;
    maxRun = Math.max(maxRun, sameRun);
  } else sameRun = 1;
}

SAP_CP009_PROTOTYPE_IDS.forEach((id, index) => assert.equal(counts.get(id), index < 15 ? 16 : 15));
assert.deepEqual(positions, [75, 75, 75, 75]);
assert.ok(maxRun < 3);
assert.deepEqual([...relations].sort(), ["A < B", "A = B", "A > B"].sort());
assert.deepEqual([...overUnder].sort(), ["Overestimate", "Underestimate"].sort());
assert.deepEqual([...nearestKinds].sort(), ["PRODUCT", "QUOTIENT"]);

console.log("SAP-CP-009 remediated 300-review passed: 19 identities, 75/75/75/75 answers, safe ratios, exam-calculable product estimates, short explanations and no 3-position streak.");
