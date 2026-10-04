import { isDeepStrictEqual } from "node:util";

export const DIR_001_POST_CLOSURE_MAPPING_PROOF_AUTHORITY =
  "DIR_001_SOLVER_TO_QUESTION_STUDIO_MAPPING_PROOF_2026_10_04" as const;

function optionLabels(question: Readonly<Record<string, any>>): string[] {
  return Array.isArray(question.options)
    ? question.options.map((option: any) => String(option?.label ?? option ?? ""))
    : [];
}

export function assertDirGeneratedAnswerIntegrity(
  generated: Readonly<Record<string, any>>,
): void {
  if (!Array.isArray(generated.options) || generated.options.length !== 4) {
    throw new Error(`${generated.qlId ?? "DIR"}: expected four generated options`);
  }
  const labels = optionLabels(generated);
  if (new Set(labels).size !== 4 || labels.some((label) => !label.trim())) {
    throw new Error(`${generated.qlId ?? "DIR"}: generated option labels are not four unique learner values`);
  }
  const correctIndex = Number(generated.correctIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= 4) {
    throw new Error(`${generated.qlId ?? "DIR"}: invalid generated correct index`);
  }
  const nullErrorIndexes = generated.options.flatMap((option: any, index: number) =>
    option?.errorLabel === null ? [index] : [],
  );
  if (nullErrorIndexes.length !== 1 || nullErrorIndexes[0] !== correctIndex) {
    throw new Error(`${generated.qlId ?? "DIR"}: generated option proof disagrees with correct index`);
  }
  if (!isDeepStrictEqual(generated.options[correctIndex]?.value, generated.correctAnswer)) {
    throw new Error(`${generated.qlId ?? "DIR"}: generated correct option value disagrees with solver answer`);
  }
  if (generated.metadata?.solverVerified !== true) {
    throw new Error(`${generated.qlId ?? "DIR"}: generated instance is not solver verified`);
  }
}

export function assertDirQuestionStudioMappingIntegrity(
  generated: Readonly<Record<string, any>>,
  mapped: Readonly<Record<string, any>>,
  language: "en" | "hi" | "pa",
): void {
  assertDirGeneratedAnswerIntegrity(generated);

  const sourceLabels = optionLabels(generated);
  const mappedLabels = Array.isArray(mapped.options) ? mapped.options.map(String) : [];
  if (!isDeepStrictEqual(sourceLabels, mappedLabels)) {
    throw new Error(`${generated.qlId ?? "DIR"}: Question Studio changed localized option order/content`);
  }
  if (Number(mapped.correctIndex) !== Number(generated.correctIndex)
    || Number(mapped.correct) !== Number(generated.correctIndex)) {
    throw new Error(`${generated.qlId ?? "DIR"}: Question Studio changed the correct index`);
  }
  if (!isDeepStrictEqual(mapped.answer, generated.correctAnswer)) {
    throw new Error(`${generated.qlId ?? "DIR"}: Question Studio changed the semantic answer`);
  }
  if (String(mapped.canonicalAnswer ?? "") !== sourceLabels[Number(generated.correctIndex)]) {
    throw new Error(`${generated.qlId ?? "DIR"}: Question Studio canonical answer does not match the displayed correct option`);
  }
  if (mapped.validation?.solverVerified !== true) {
    throw new Error(`${generated.qlId ?? "DIR"}: Question Studio lost solver verification`);
  }
  if (language !== "en" && mapped.validation?.answerParityVerified !== true) {
    throw new Error(`${generated.qlId ?? "DIR"}: localized Question Studio answer parity is not verified`);
  }
  if (mapped.questionBankWritable !== false || mapped.testEligible !== false
    || mapped.mockTestEligible !== false || mapped.publiclyPublishable !== false
    || mapped.automaticStudentPublication !== false
    || mapped.productionReleaseAuthorized !== false || mapped.reviewOnly !== true) {
    throw new Error(`${generated.qlId ?? "DIR"}: Question Studio weakened the review-only lifecycle`);
  }
}
