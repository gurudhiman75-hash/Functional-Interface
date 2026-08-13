import assert from "node:assert/strict";
import "./authority-release.test";
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateReviewReady,
} from "./review-ready-runtime";
import { generateSapCp010 as generateStudent } from "./student-runtime";

const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0, 0, 0, 0];

function assertConsecutiveInterval(value: string, prototypeId: string, seed: number): void {
  const match = value.match(/^(-?\d+) < .+ < (-?\d+)$/);
  assert.ok(match, `${prototypeId}:${seed}: interval option is not in expected form: ${value}`);
  const lower = Number(match![1]);
  const upper = Number(match![2]);
  assert.equal(upper, lower + 1, `${prototypeId}:${seed}: non-consecutive interval distractor returned: ${value}`);
}

for (const prototypeId of SAP_CP010_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const q = generateReviewReady(prototypeId, seed);
    const student = generateStudent(prototypeId, seed);

    assert.equal(q.validation.ok, true, `${prototypeId}:${seed}: ${q.validation.errors.join("; ")}`);
    assert.equal(q.canonicalAnswer, student.canonicalAnswer, `${prototypeId}:${seed}: review-ready option layer changed the answer.`);
    assert.deepEqual(q.oracle.data, student.oracle.data, `${prototypeId}:${seed}: review-ready option layer changed the mathematical state.`);
    assert.equal(q.correctIndex, student.correctIndex, `${prototypeId}:${seed}: answer position drifted.`);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options.map((o) => o.value)).size, 4);
    assert.equal(q.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(q.options[q.correctIndex]?.value, q.canonicalAnswer);
    assert.equal(q.lifecycle.active, false);
    assert.equal(q.lifecycle.questionStudioDiscoverable, false);
    assert.equal(q.lifecycle.questionBankWritable, false);
    assert.equal(q.lifecycle.testEligible, false);
    assert.equal(q.lifecycle.publiclyPublishable, false);

    const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(prototypeId);
    if (mode >= 0 && mode <= 2) {
      for (const option of q.options) assertConsecutiveInterval(option.value, prototypeId, seed);
    }

    assert.ok(!stems.has(q.stem), `${prototypeId}:${seed}: duplicate visible stem`);
    assert.ok(!payloads.has(q.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate payload`);
    assert.ok(!identities.has(q.generationIdentity), `${prototypeId}:${seed}: duplicate identity`);
    stems.add(q.stem);
    payloads.add(q.canonicalPayloadKey);
    identities.add(q.generationIdentity);
    positions[q.correctIndex]! += 1;
  }
  assert.equal(stems.size, 100);
}

assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.deepEqual(positions, [425, 425, 425, 425]);

console.log("SAP-CP-010 review-ready authority passed: release semantics are preserved across 1,700 states and every root-interval option uses consecutive integer bounds.");
