import assert from "node:assert/strict";
import { MEN_CP_009_FROZEN_QLS_V2 } from "./registry";
import { buildMenCp009V3StudentReviewBatch } from "./student-review-batch-v3";
import { generateMenCp009QuestionV2 } from "./runtime";
import { MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY } from "./student-view-v4";
import { buildMenCp009StudentViewV4Final } from "./student-view-v4-final";
import { generateMenCp009NativeTeachingV2 } from "../native/runtime-v2";

const review = buildMenCp009V3StudentReviewBatch();
assert.equal(review.rows.length, 110);

const english = review.rows.map(buildMenCp009StudentViewV4Final);
assert.equal(new Set(english.map((row) => row.permanentQlId)).size, 28);
assert.equal(new Set(english.map((row) => row.stem)).size, 110);

const rawLatex = /\$|\\(?:pi|frac|text|times|sqrt)/;
const heavyStem = /determine the required|requested measure|calculate carefully|choose the correct|select the correct/i;
let explicitPiQuestions = 0;
let explicitPiTeachingUses = 0;
let middleCalculationProofs = 0;
let decimalisedThreePointFourteenOptions = 0;

for (let index = 0; index < english.length; index += 1) {
  const row = english[index]!;
  const source = review.rows[index]!;
  assert.equal(row.authority, MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY);
  assert.equal(row.permanentQlId, source.permanentQlId);
  assert.equal(row.correctIndex, source.correctIndex);
  assert.equal(row.options.length, 4);
  assert.equal(new Set(row.options.map((option) => option.display)).size, 4);
  assert.equal(row.options.filter((option) => option.isCorrect).length, 1);
  assert.ok(!heavyStem.test(row.stem), `${row.permanentQlId}: heavy/generator wording in stem.`);
  assert.ok(!rawLatex.test(row.stem), `${row.permanentQlId}: raw LaTeX in stem.`);
  assert.ok(!rawLatex.test(row.answer), `${row.permanentQlId}: raw LaTeX in answer.`);
  assert.ok(row.explanationLines.length >= 4 && row.explanationLines.length <= 5,
    `${row.permanentQlId}: teaching explanation should use 4-5 connected lines.`);
  assert.ok(row.explanationLines.some((line) => /[=×÷]|√|∛/.test(line)),
    `${row.permanentQlId}: explanation needs visible working.`);
  assert.ok(row.explanationLines.at(-1)?.endsWith(`${row.answer}.`),
    `${row.permanentQlId}: explanation should finish with the actual answer.`);
  for (const line of row.explanationLines) {
    assert.ok(!rawLatex.test(line), `${row.permanentQlId}: raw LaTeX in explanation.`);
  }

  const sourceStem = source.stem;
  if (/Use \$\\pi=/.test(sourceStem)) {
    explicitPiQuestions += 1;
    const expected = sourceStem.includes("22}{7") ? "22/7" : "3.14";
    const uses = row.explanationLines.filter((line) => line.includes(expected)).length;
    assert.ok(uses >= 2, `${row.permanentQlId}: ${expected} must be shown in setup and calculation.`);
    explicitPiTeachingUses += 1;
  }
  if (row.explanationLines.some((line) => /so .* =|gives .* =|= .* =|substitute the actual values/i.test(line))) {
    middleCalculationProofs += 1;
  }
  if (sourceStem.includes("3.14") && row.options.some((option) => /\d+\.\d+/.test(option.display))) {
    decimalisedThreePointFourteenOptions += 1;
  }
}

assert.ok(explicitPiQuestions > 0);
assert.equal(explicitPiTeachingUses, explicitPiQuestions);
assert.ok(middleCalculationProofs >= 90, "Most review questions should expose a middle calculation, not a formula-to-answer jump.");
assert.ok(decimalisedThreePointFourteenOptions > 0, "Terminating 3.14 results should display as normal decimals where exact.");

const englishWords = /\b(?:the|with|given|formula|surface|volume|radius|diameter|ratio|increase|new|cost|rate|area|sphere|hemisphere|required|reduce|cancel|common|divide|dividing|match|gives|therefore|here|putting|substitute|solving|write)\b/i;
let nativeReviewRows = 0;
for (const source of review.rows) {
  for (const language of ["hi", "pa"] as const) {
    const native = generateMenCp009NativeTeachingV2(source.permanentQlId, source.seed, language);
    assert.equal(native.correctIndex, source.correctIndex);
    assert.equal(native.options.filter((option) => option.isCorrect).length, 1);
    assert.equal(native.parity.valid, true);
    assert.ok(native.explanationLines.length >= 4 && native.explanationLines.length <= 5);
    assert.ok(native.explanationLines.some((line) => /[=×÷]|√|∛/.test(line)));
    assert.ok(!englishWords.test(native.stem), `${source.permanentQlId} ${language}: English prose leaked into native stem.`);
    for (const line of native.explanationLines) {
      assert.ok(!englishWords.test(line), `${source.permanentQlId} ${language}: English prose leaked: ${line}`);
    }
    if (language === "hi") {
      assert.ok(/[\u0900-\u097F]/.test(native.stem));
      assert.ok(native.explanationLines.some((line) => /[\u0900-\u097F]/.test(line)));
    } else {
      assert.ok(/[\u0A00-\u0A7F]/.test(native.stem));
      assert.ok(native.explanationLines.some((line) => /[\u0A00-\u0A7F]/.test(line)));
    }
    nativeReviewRows += 1;
  }
}
assert.equal(nativeReviewRows, 220);

let regressionPackages = 0;
for (const definition of MEN_CP_009_FROZEN_QLS_V2) {
  for (let index = 0; index < 40; index += 1) {
    const seed = `men-cp009-teaching-v4:${definition.qlId}:${index}`;
    const raw = generateMenCp009QuestionV2(definition.qlId, seed);
    const en = buildMenCp009StudentViewV4Final(raw);
    assert.equal(en.sourceValidationPassed, true);
    assert.equal(en.sourceVerificationPassed, true);
    for (const language of ["hi", "pa"] as const) {
      const native = generateMenCp009NativeTeachingV2(definition.qlId, seed, language);
      assert.equal(native.parity.valid, true);
      assert.equal(native.correctIndex, en.correctIndex);
      assert.equal(native.options.length, en.options.length);
      regressionPackages += 1;
    }
  }
}
assert.equal(regressionPackages, 28 * 40 * 2);

console.log(JSON.stringify({
  authority: MEN_CP_009_STUDENT_VIEW_V4_AUTHORITY,
  englishReviewQuestions: english.length,
  nativeReviewQuestions: nativeReviewRows,
  regressionPackages,
  explicitPiQuestions,
  explicitPiTeachingUses,
  middleCalculationProofs,
  decimalisedThreePointFourteenOptions,
  status: "PASS_CP009_TEACHING_V4_NATIVE_V2",
}, null, 2));
