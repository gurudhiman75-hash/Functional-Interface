import assert from "node:assert/strict";
import "./authority-certified.test";
import {
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateRelease,
} from "./release-runtime";
import { generateSapCp010 as generateCertified } from "./certified-runtime";

function coreData(data: Readonly<Record<string, number | string>>): Record<string, number | string> {
  const copy = { ...data };
  delete copy.releaseRuntimeVersion;
  return copy;
}

const payloads = new Set<string>();
const identities = new Set<string>();
const positions = [0, 0, 0, 0];

for (const prototypeId of SAP_CP010_PROTOTYPE_IDS) {
  const stems = new Set<string>();
  for (let seed = 1; seed <= 100; seed += 1) {
    const release = generateRelease(prototypeId, seed);
    const certified = generateCertified(prototypeId, seed);

    assert.equal(release.validation.ok, true, `${prototypeId}:${seed}: ${release.validation.errors.join("; ")}`);
    assert.equal(release.canonicalAnswer, certified.canonicalAnswer, `${prototypeId}:${seed}: editorial layer changed the answer.`);
    assert.deepEqual(coreData(release.oracle.data), certified.oracle.data, `${prototypeId}:${seed}: editorial layer changed certified math state.`);
    assert.equal(release.correctIndex, certified.correctIndex, `${prototypeId}:${seed}: answer position drifted.`);
    assert.equal(release.options.length, 4);
    assert.equal(new Set(release.options.map((o) => o.value)).size, 4);
    assert.equal(release.options.filter((o) => o.isCorrect).length, 1);
    assert.equal(release.options[release.correctIndex]?.value, release.canonicalAnswer);
    assert.ok(release.explanation.steps.length >= 2 && release.explanation.steps.length <= 3);
    assert.ok(release.stem.length <= 220);

    const visible = `${release.stem} ${release.canonicalAnswer} ${release.options.map((o) => o.value).join(" ")} ${release.explanation.coreConcept} ${release.explanation.steps.join(" ")} ${release.explanation.verification.join(" ")}`;
    assert.doesNotMatch(visible, /oracle|runtime|prototype|canonical|internal|guard|machine policy|newton|taylor|logarithmic interpolation|binomial series/i);
    assert.doesNotMatch(visible, /-?\d+\.\d{6,}/);
    assert.doesNotMatch(release.stem, /the original number was (?:above|below) its rounded value/i, `${prototypeId}:${seed}: unnatural inverse wording returned.`);

    assert.equal(release.lifecycle.active, false);
    assert.equal(release.lifecycle.questionStudioDiscoverable, false);
    assert.equal(release.lifecycle.questionBankWritable, false);
    assert.equal(release.lifecycle.testEligible, false);
    assert.equal(release.lifecycle.publiclyPublishable, false);

    assert.ok(!stems.has(release.stem), `${prototypeId}:${seed}: duplicate release stem`);
    assert.ok(!payloads.has(release.canonicalPayloadKey), `${prototypeId}:${seed}: duplicate release payload`);
    assert.ok(!identities.has(release.generationIdentity), `${prototypeId}:${seed}: duplicate release identity`);
    stems.add(release.stem);
    payloads.add(release.canonicalPayloadKey);
    identities.add(release.generationIdentity);
    positions[release.correctIndex]! += 1;

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[2]) {
      assert.match(release.stem, /fourth root/i, `${prototypeId}:${seed}: fourth-root stem should use natural exam language.`);
      assert.doesNotMatch(release.stem, /∜/, `${prototypeId}:${seed}: uncommon fourth-root glyph leaked into the stem.`);
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[3] || prototypeId === SAP_CP010_PROTOTYPE_IDS[4]) {
      const explanation = `${release.explanation.steps.join(" ")} ${release.explanation.verification.join(" ")}`;
      assert.doesNotMatch(explanation, /Compare\s+[48]\s*×/i, `${prototypeId}:${seed}: technical scaled midpoint shortcut returned.`);
      assert.match(explanation, /midpoint|\.5/i, `${prototypeId}:${seed}: student midpoint reasoning is missing.`);
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[6]) {
      const answer = Number(release.canonicalAnswer);
      for (const option of release.options) {
        const value = Number(option.value);
        assert.ok(Number.isFinite(value) && value > 0, `${prototypeId}:${seed}: non-positive power option.`);
        assert.ok(value >= answer / 4 && value <= answer * 4, `${prototypeId}:${seed}: power distractor is too remote (${option.value} vs ${answer}).`);
      }
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[7]) {
      for (const option of release.options) {
        const value = Number(option.value);
        assert.ok(Number.isFinite(value) && value >= 0 && value <= 1, `${prototypeId}:${seed}: implausible percentage-factor option ${option.value}`);
      }
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[8]) {
      for (const option of release.options) assert.match(option.value, /^1\/\d+$/, `${prototypeId}:${seed}: reciprocal option is not a nearby fraction.`);
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[10]) {
      const answer = Number(release.canonicalAnswer);
      for (const option of release.options) {
        const value = Number(option.value);
        assert.ok(Number.isFinite(value) && value >= 1 && Math.abs(value - answer) <= 2, `${prototypeId}:${seed}: quotient distractor too remote.`);
      }
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[11]) {
      const answer = Number(release.canonicalAnswer);
      for (const option of release.options) {
        const value = Number(option.value);
        assert.ok(Number.isFinite(value) && value > 0 && value <= answer * 2, `${prototypeId}:${seed}: mixed-form distractor too remote.`);
      }
    }

    if (prototypeId === SAP_CP010_PROTOTYPE_IDS[13]) {
      assert.match(release.stem, /0\.2 (?:greater|less) than an integer/i, `${prototypeId}:${seed}: inverse power stem should state the exact offset.`);
      assert.doesNotMatch(release.stem, /slightly/i, `${prototypeId}:${seed}: vague inverse power wording returned.`);
    }
  }
  assert.equal(stems.size, 100, `${prototypeId}: expected 100 unique release stems`);
}

assert.equal(payloads.size, 1700);
assert.equal(identities.size, 1700);
assert.deepEqual(positions, [425, 425, 425, 425]);

console.log("SAP-CP-010 release authority passed: certified mathematics preserved across 1,700 states while exam-standard stems, plausible distractors, midpoint-friendly explanations and inactive lifecycle are enforced.");
