import assert from "node:assert/strict";
import "./authority-v2.test";
import {
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008,
} from "./runtime-v4";
import { generateSapCp008 as generateV3 } from "./runtime-v3";

const positions = [0, 0, 0, 0];
const payloads = new Set<string>();
let total = 0;

for (const prototypeId of SAP_CP008_PROTOTYPE_IDS) {
  for (let seed = 1; seed <= 100; seed += 1) {
    const current = generateSapCp008(prototypeId, seed);
    const prior = generateV3(prototypeId, seed);
    assert.equal(current.validation.ok, true, `${prototypeId}:${seed}: ${current.validation.errors.join("; ")}`);
    assert.equal(current.stem, prior.stem);
    assert.equal(current.canonicalAnswer, prior.canonicalAnswer);
    assert.equal(current.correctIndex, prior.correctIndex);
    assert.deepEqual(current.options.map((option) => option.value), prior.options.map((option) => option.value));
    assert.equal(current.explanation.steps.join("|"), prior.explanation.steps.join("|"));
    assert.ok(current.explanation.coreConcept.length >= 100);
    assert.equal(current.explanation.verification.length, 2);
    const studentText = JSON.stringify({ explanation: current.explanation, options: current.options });
    assert.doesNotMatch(studentText, /oracle|learner route|CP-008|transformed expression|declared policy|state avoids near-cancellation|scaled terms/i);
    assert.ok(!payloads.has(current.canonicalPayloadKey));
    payloads.add(current.canonicalPayloadKey);
    positions[current.correctIndex]! += 1;
    total += 1;
  }
}

assert.equal(total, 1800);
assert.equal(payloads.size, 1800);
assert.deepEqual(positions, [450, 450, 450, 450]);
console.log("SAP-CP-008 explanation v4 authority passed: inherited mathematics/editorial parity plus 1,800 student-facing explanation checks with no internal engine vocabulary and unchanged stems, answers, options, worked steps or answer positions.");
