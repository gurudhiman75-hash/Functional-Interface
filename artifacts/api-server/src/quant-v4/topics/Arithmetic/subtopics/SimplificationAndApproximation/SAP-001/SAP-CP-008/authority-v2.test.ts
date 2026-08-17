import assert from "node:assert/strict";
import "./authority.test";
import {
  SAP_CP008_CATALOGUE,
  SAP_CP008_POLICY,
  SAP_CP008_PROTOTYPE_IDS,
  generateSapCp008,
} from "./runtime-v3";
import { generateSapCp008 as generateV2 } from "./runtime-v2";

function explicitTermsFirstPolicy(stem: string): boolean {
  return /round/i.test(stem) && /(first|before|when rounded)/i.test(stem);
}

const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0, 0, 0, 0];
const openings = new Set<string>();
let total = 0;

for (const prototypeId of SAP_CP008_PROTOTYPE_IDS) {
  const localStems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const current = generateSapCp008(prototypeId, seed);
    const prior = generateV2(prototypeId, seed);

    assert.equal(current.validation.ok, true, `${prototypeId}:${seed}: ${current.validation.errors.join("; ")}`);
    assert.equal(current.policy, SAP_CP008_POLICY);
    assert.ok(explicitTermsFirstPolicy(current.stem), `${prototypeId}:${seed}: approximation stage is not explicit.`);
    assert.doesNotMatch(current.stem, /significant figure/i);
    assert.equal(current.options.length, 4);
    assert.equal(new Set(current.options.map((option) => option.value)).size, 4);
    assert.equal(current.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(current.options[current.correctIndex]?.value, current.canonicalAnswer);
    assert.equal(current.correctIndex, prior.correctIndex, `${prototypeId}:${seed}: editorial layer moved the correct answer slot.`);
    assert.equal(current.lifecycle.permanentQlId, null);
    assert.equal(current.lifecycle.active, false);
    assert.equal(current.lifecycle.questionStudioDiscoverable, false);
    assert.equal(current.lifecycle.questionBankWritable, false);
    assert.equal(current.lifecycle.testEligible, false);
    assert.equal(current.lifecycle.publiclyPublishable, false);

    if (prototypeId === "SAP-CP008-PROT-DECIMAL-SUM" || prototypeId === "SAP-CP008-PROT-DECIMAL-DIFFERENCE") {
      assert.equal(Number(current.canonicalAnswer), Number(prior.canonicalAnswer));
      assert.doesNotMatch(current.canonicalAnswer, /\.0$/);
      for (const option of current.options) assert.doesNotMatch(option.value, /\.0$/);
    } else if (prototypeId === "SAP-CP008-PROT-COMPATIBLE-ADDENDS") {
      assert.equal(current.canonicalAnswer, `${current.oracle.data.targetA} and ${current.oracle.data.targetB}`);
      assert.doesNotMatch(current.canonicalAnswer, /=/);
    } else {
      assert.equal(current.canonicalAnswer, prior.canonicalAnswer, `${prototypeId}:${seed}: editorial layer changed mathematical answer.`);
    }

    if (prototypeId === "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS") {
      assert.match(current.canonicalAnswer, /^-?\d+ < exact value < -?\d+$/);
    }
    if (prototypeId === "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT") {
      assert.match(current.stem, /nearest multiple of (20|50)/i);
    }
    if (prototypeId === "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY" || prototypeId === "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY") {
      assert.match(current.stem, /what is the rounded value of □/i);
      assert.doesNotMatch(current.stem, /must □ contribute/i);
    }

    assert.ok(!payloads.has(current.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate editorial payload.`);
    assert.ok(!identities.has(current.generationIdentity), `${prototypeId}:${seed}: duplicate editorial identity.`);
    assert.ok(!localStems.has(current.stem), `${prototypeId}:${seed}: duplicate editorial stem.`);
    payloads.add(current.canonicalPayloadKey);
    identities.add(current.generationIdentity);
    localStems.add(current.stem);
    positions[current.correctIndex]! += 1;
    if (prototypeId === "SAP-CP008-PROT-APPROX-INTEGER-SUM") openings.add(current.stem.split(". ")[0]!);
    total += 1;
  }
  assert.equal(localStems.size, 100, `${prototypeId}: expected 100 distinct editorial stems.`);
}

assert.equal(total, 1800);
assert.equal(payloads.size, 1800);
assert.equal(identities.size, 1800);
assert.deepEqual(positions, [450, 450, 450, 450]);
assert.equal(SAP_CP008_CATALOGUE.length, 18);
assert.ok(openings.size >= 4, `Direct additive policy surface remained too repetitive: ${openings.size} openings.`);

console.log("SAP-CP-008 editorial v3 authority passed: inherited 1,800-case mathematics plus 1,800 editorial parity checks, explicit terms-first policy, natural integer decimal answers, compatible-pair surface, varied instructions, exact answer-slot preservation and inactive lifecycle.");
