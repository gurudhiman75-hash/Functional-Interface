import assert from "node:assert/strict";

import {
  QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTER_AUTHORITY,
  advancedMathSectionQuestionFingerprint,
  generateQuantV4AdvancedMathSectionQuestion,
  type QuantV4AdvancedMathSectionExamId,
} from "./quant-v4-real-exam-advanced-math-adapters-p2";

const EXAMS: readonly QuantV4AdvancedMathSectionExamId[] = [
  "SSC_CGL_TIER_I",
  "SSC_CGL_TIER_II",
  "SSC_CHSL",
  "PSSSB",
  "PPSC",
  "PUNJAB_POLICE",
];

function questionText(question: any): string {
  return String(question?.text ?? question?.stem ?? "").trim();
}

function explanationText(question: any): string {
  if (typeof question?.explanation === "string") return question.explanation.trim();
  if (Array.isArray(question?.explanation?.steps)) return question.explanation.steps.map((step: any) => String(step?.body ?? step)).join(" ").trim();
  if (Array.isArray(question?.packageExplanation?.steps)) return question.packageExplanation.steps.map((step: any) => String(step?.body ?? step)).join(" ").trim();
  return "";
}

function assertQuestionSurface(question: any, source: string) {
  const options = Array.isArray(question?.options) ? question.options.map((option: any) => String(option)) : [];
  assert.ok(questionText(question), `${source} returned an empty stem.`);
  assert.ok(explanationText(question), `${source} returned an empty explanation.`);
  assert.equal(options.length, 4, `${source} must expose four options for current SSC/Punjab section slots.`);
  assert.equal(new Set(options).size, 4, `${source} returned duplicate options.`);
  const correctIndex = Number(question?.correctIndex ?? question?.correct);
  assert.ok(Number.isInteger(correctIndex) && correctIndex >= 0 && correctIndex < 4, `${source} returned an invalid correct index.`);
}

assert.equal(
  QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTER_AUTHORITY,
  "QUANT-V4-REAL-EXAM-ADVANCED-MATH-ADAPTERS-P2",
);

let algebraQuestions = 0;
let trigonometryQuestions = 0;
const trigPackages = new Set<string>();

for (const examId of EXAMS) {
  for (let index = 1; index <= 6; index += 1) {
    const algebra = await generateQuantV4AdvancedMathSectionQuestion({
      examId,
      slotKind: "ALGEBRA",
      seed: `advanced-math-adapter:${examId}:algebra:${index}`,
    });
    assert.equal(algebra.examId, examId);
    assert.equal(algebra.slotKind, "ALGEBRA");
    assert.equal(algebra.selectionPolicy, "PROVISIONAL_NON_PYQ_WEIGHTED");
    assertQuestionSurface(algebra.question, `Algebra/${examId}/seed-${index}`);
    assert.equal(algebra.question.questionBankWritable, true);
    assert.equal(algebra.question.questionBankAcceptanceMode, "BANK_ONLY");
    assert.equal(algebra.question.testEligible, false, "Algebra must remain test-locked until a later lifecycle checkpoint.");
    assert.equal(algebra.question.mockTestEligible, false);
    assert.equal(algebra.question.publiclyPublishable, false);
    algebraQuestions += 1;

    const trig = await generateQuantV4AdvancedMathSectionQuestion({
      examId,
      slotKind: "TRIGONOMETRY",
      seed: `advanced-math-adapter:${examId}:trigonometry:${index}`,
    });
    assert.equal(trig.examId, examId);
    assert.equal(trig.slotKind, "TRIGONOMETRY");
    assert.equal(trig.selectionPolicy, "PROVISIONAL_NON_PYQ_WEIGHTED");
    assert.ok(trig.packageId === "TRG-001" || trig.packageId === "TRG-002");
    assertQuestionSurface(trig.question, `${trig.packageId}/${examId}/seed-${index}`);
    assert.equal(trig.question.testEligible, true, "Current Trigonometry internal lifecycle must remain test eligible.");
    assert.equal(trig.question.publiclyPublishable, false);
    trigPackages.add(trig.packageId);
    trigonometryQuestions += 1;
  }

  for (const slotKind of ["ALGEBRA", "TRIGONOMETRY"] as const) {
    const seed = `advanced-math-adapter:${examId}:${slotKind}:determinism`;
    const first = await generateQuantV4AdvancedMathSectionQuestion({ examId, slotKind, seed });
    const second = await generateQuantV4AdvancedMathSectionQuestion({ examId, slotKind, seed });
    assert.equal(
      advancedMathSectionQuestionFingerprint(first),
      advancedMathSectionQuestionFingerprint(second),
      `${examId}/${slotKind} is not deterministic for a fixed section seed.`,
    );
  }
}

assert.ok(trigPackages.has("TRG-001"), "The adapter proof did not exercise TRG-001.");
assert.ok(trigPackages.has("TRG-002"), "The adapter proof did not exercise TRG-002.");

console.log("PASS_QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTERS_P2", {
  exams: EXAMS.length,
  algebraQuestions,
  trigonometryQuestions,
  trigonometryPackages: [...trigPackages].sort(),
  algebraLifecycle: "BANK_ONLY_TEST_LOCKED",
  trigonometryLifecycle: "INTERNAL_TEST_ELIGIBLE_PUBLIC_LOCKED",
  selectionPolicy: "PROVISIONAL_NON_PYQ_WEIGHTED",
});
