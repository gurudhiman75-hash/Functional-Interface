import assert from "node:assert/strict";
import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009,
} from "./exam-runtime-v2";
import { runCp009Authority } from "./authority-core";

const result = runCp009Authority({
  prototypeIds: SAP_CP009_PROTOTYPE_IDS,
  catalogueLength: SAP_CP009_CATALOGUE.length,
  policy: SAP_CP009_POLICY,
  generate: generateSapCp009,
  seedsPerMode: 100,
});

function numeric(value: string): number | null {
  const stripped = value.replace(/%$/, "");
  if (!/^-?\d+(?:\.\d+)?$/.test(stripped)) return null;
  const n = Number(stripped);
  return Number.isFinite(n) ? n : null;
}

for (let seed = 1; seed <= 100; seed += 1) {
  for (const prototypeId of SAP_CP009_PROTOTYPE_IDS) {
    const q = generateSapCp009(prototypeId, seed);
    const studentText = `${q.stem} ${q.canonicalAnswer} ${q.options.map((o) => o.value).join(" ")} ${q.explanation.coreConcept} ${q.explanation.steps.join(" ")} ${q.explanation.verification.join(" ")}`;

    assert.doesNotMatch(
      q.stem,
      /for estimation, take|using cancellation|using\s+-?\d+(?:\.\d+)?\s+for\s+-?\d+(?:\.\d+)?|round the required numbers/i,
      `${prototypeId}:${seed}: non-exam or over-guided stem wording`,
    );
    assert.doesNotMatch(
      studentText,
      /-?\d+\.\d{6,}/,
      `${prototypeId}:${seed}: raw floating-point value leaked into student content`,
    );
    assert.ok(q.stem.length <= 220, `${prototypeId}:${seed}: stem too long for exam presentation`);
  }

  const product = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[0]!, seed);
  assert.ok(Number(product.oracle.data.ra) <= 300, `QL147:${seed}: first rounded factor too large for EASY approximation.`);
  assert.ok(Number(product.oracle.data.rb) <= 80, `QL147:${seed}: second rounded factor too large for EASY approximation.`);
  assert.ok(Number(product.canonicalAnswer) <= 24000, `QL147:${seed}: product estimate is unnecessarily laborious.`);

  for (const mode of [3, 4]) {
    const q = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
    assert.doesNotMatch(q.stem, /≈/, `QL${147 + mode}:${seed}: stem supplies the chosen approximation.`);
  }

  for (const mode of [3, 5]) {
    const q = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
    const answer = numeric(q.canonicalAnswer);
    assert.notEqual(answer, null);
    const wrongValues = q.options.filter((o) => !o.isCorrect).map((o) => numeric(o.value)).filter((v): v is number => v !== null);
    assert.equal(wrongValues.length, 3);
    const near = wrongValues.filter((value) => Math.abs(value - answer!) <= Math.max(10, Math.abs(answer!)));
    assert.ok(near.length >= 2, `QL${147 + mode}:${seed}: distractors are too far from the correct answer.`);
  }

  const ratio = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[7]!, seed);
  const [rp, rq] = ratio.canonicalAnswer.split(":").map(Number);
  for (const option of ratio.options.filter((o) => !o.isCorrect)) {
    const [a, b] = option.value.split(":").map(Number);
    assert.notEqual(a! * rq!, b! * rp!, `QL154:${seed}: equivalent ratio used as a distractor (${option.value}).`);
  }

  const cancellation = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[8]!, seed);
  assert.doesNotMatch(cancellation.stem, /cancel/i, `QL155:${seed}: stem gives away cancellation shortcut.`);

  const reciprocal = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[9]!, seed);
  assert.doesNotMatch(reciprocal.stem, /using\s+\d+\s+for\s+\d+/i, `QL156:${seed}: rounded values are supplied in the stem.`);

  const nearest = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[12]!, seed);
  if (nearest.oracle.data.kind === "QUOTIENT") {
    assert.match(nearest.stem, /round .* nearest ten/i);
    assert.doesNotMatch(nearest.stem, /use\s+\d+\s+for\s+\d+/i, `QL159:${seed}: compatible values are supplied instead of being found by the student.`);
  }

  const scale = generateSapCp009(SAP_CP009_PROTOTYPE_IDS[16]!, seed);
  const scaleText = `${scale.stem} ${scale.canonicalAnswer} ${scale.options.map((o) => o.value).join(" ")} ${scale.explanation.steps.join(" ")}`;
  assert.doesNotMatch(scaleText, /-?\d+\.\d{6,}/, `QL163:${seed}: floating-point artifact remains.`);
}

console.log(`SAP-CP-009 exam-standard authority passed: ${result.total} states preserve mathematical proof while enforcing competitive-exam stems, student-owned approximation choices, close distractors, distinct ratios and clean decimal display.`);
