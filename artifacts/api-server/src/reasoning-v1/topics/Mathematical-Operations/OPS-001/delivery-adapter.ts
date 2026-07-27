import {
  generateFrozenOpsQuestion,
  generateLocalizedFrozenOpsQuestion,
  getOpsQlEntry,
  type OpsQlId,
} from "./registry";

export type OpsDeliveryLanguage = "en" | "hi" | "pa";

export const OPS_001_DELIVERY_POLICY = {
  chapterId: "OPS-001",
  maturity: "FROZEN_INTERNAL",
  publiclyPublishable: false,
  publicationEnabled: false,
  studentRouteRegistered: false,
  reason: "OPS-001 is integrated for internal generation, review and Question Bank conversion only.",
} as const;

function generate(qlId: OpsQlId, seed: number, language: OpsDeliveryLanguage) {
  if (!Number.isInteger(seed) || seed < 0) {
    throw new Error(`OPS-001 delivery seed must be a non-negative integer; received ${seed}.`);
  }
  if (language === "en") return generateFrozenOpsQuestion(qlId, seed);
  return generateLocalizedFrozenOpsQuestion(
    qlId,
    seed,
    language === "hi" ? "hi-IN" : "pa-IN",
  );
}

function explanationText(question: ReturnType<typeof generate>): string {
  return [
    question.explanation.ruleStatement,
    ...question.explanation.steps.map((step) =>
      `${step.label}: ${step.expression}${step.result ? ` → ${step.result}` : ""}`,
    ),
    question.explanation.conclusion,
  ].filter(Boolean).join("\n\n");
}

export function buildOpsStudentPrompt(input: {
  readonly qlId: OpsQlId;
  readonly seed: number;
  readonly language?: OpsDeliveryLanguage;
}) {
  const language = input.language ?? "en";
  const question = generate(input.qlId, input.seed, language);
  const entry = getOpsQlEntry(input.qlId);
  return {
    questionId: `OPS-001:${input.qlId}:${input.seed}`,
    chapterId: "OPS-001",
    qlId: input.qlId,
    checkpointId: question.checkpointId,
    language,
    renderer: question.renderer,
    stem: question.stem,
    options: question.options.map((option) => option.value),
    taskKind: question.taskKind,
    answerSemantic: entry.answerSemantic,
    publication: OPS_001_DELIVERY_POLICY,
  } as const;
}

export function buildOpsStudentSolution(input: {
  readonly qlId: OpsQlId;
  readonly seed: number;
  readonly language?: OpsDeliveryLanguage;
}) {
  const language = input.language ?? "en";
  const question = generate(input.qlId, input.seed, language);
  return {
    questionId: `OPS-001:${input.qlId}:${input.seed}`,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: explanationText(question),
    proof: {
      unique: question.proof.unique,
      solverRoute: question.proof.solverRoute,
      semanticFingerprint: question.proof.semanticFingerprint,
    },
  } as const;
}

export function buildOpsInternalDeliveryPreview(input: {
  readonly access: "internal-preview";
  readonly qlId: OpsQlId;
  readonly seed: number;
  readonly language?: OpsDeliveryLanguage;
}) {
  if (input.access !== "internal-preview") {
    throw new Error("OPS-001 public student delivery is disabled.");
  }
  return {
    prompt: buildOpsStudentPrompt(input),
    solution: buildOpsStudentSolution(input),
    publiclyPublishable: false,
  } as const;
}
