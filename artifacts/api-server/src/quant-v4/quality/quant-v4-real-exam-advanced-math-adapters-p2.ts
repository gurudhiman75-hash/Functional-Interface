import {
  buildAlgebraBankOnlyReviewPayload,
} from "../topics/AdvancedMathematics/subtopics/Algebra/algebra-question-bank-activation-v1";
import {
  generateAlgebraStudioBatchV5,
  type AlgebraStudioExamProfileV5,
} from "../topics/AdvancedMathematics/subtopics/Algebra/algebra-question-studio-runtime-v5";
import { generateQuestion as generateTrigonometryQuestion } from "../../question-studio/shared-generation-engine-trigonometry";

export const QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTER_AUTHORITY =
  "QUANT-V4-REAL-EXAM-ADVANCED-MATH-ADAPTERS-P2" as const;

export type QuantV4AdvancedMathSectionExamId =
  | "SSC_CGL_TIER_I"
  | "SSC_CGL_TIER_II"
  | "SSC_CHSL"
  | "PSSSB"
  | "PPSC"
  | "PUNJAB_POLICE";

export type QuantV4AdvancedMathSectionSlotKind = "ALGEBRA" | "TRIGONOMETRY";
export type QuantV4AdvancedMathDifficulty = "Easy" | "Medium" | "Hard";

export interface QuantV4AdvancedMathSectionAdapterResult {
  readonly authority: typeof QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTER_AUTHORITY;
  readonly examId: QuantV4AdvancedMathSectionExamId;
  readonly slotKind: QuantV4AdvancedMathSectionSlotKind;
  readonly seed: string;
  readonly packageId: string;
  readonly selectionPolicy: "PROVISIONAL_NON_PYQ_WEIGHTED";
  readonly question: any;
}

function stableHash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function difficultyFor(seed: string): QuantV4AdvancedMathDifficulty {
  const bucket = stableHash(`${seed}:difficulty`) % 10;
  if (bucket <= 2) return "Easy";
  if (bucket <= 7) return "Medium";
  return "Hard";
}

function algebraProfileFor(examId: QuantV4AdvancedMathSectionExamId): AlgebraStudioExamProfileV5 {
  if (examId === "SSC_CGL_TIER_II") return "SSC_ADVANCED";
  if (examId === "PSSSB" || examId === "PPSC" || examId === "PUNJAB_POLICE") return "PUNJAB_STATE";
  return "SSC_CORE";
}

function trigonometryPackageFor(examId: QuantV4AdvancedMathSectionExamId, seed: string): "TRG-001" | "TRG-002" {
  const bucket = stableHash(`${seed}:trigonometry-family`);
  if (examId === "SSC_CGL_TIER_II") return bucket % 2 === 0 ? "TRG-001" : "TRG-002";
  return bucket % 4 === 0 ? "TRG-002" : "TRG-001";
}

function firstQuestion(result: any): any {
  if (Array.isArray(result?.questions) && result.questions.length) return result.questions[0];
  if (Array.isArray(result?.questionPackages) && result.questionPackages.length) return result.questionPackages[0];
  throw new Error("Advanced Mathematics section adapter runtime returned no question.");
}

function assertFourOptionSingleChoice(question: any, source: string): void {
  const options = Array.isArray(question?.options) ? question.options.map((option: any) => String(option)) : [];
  if (options.length !== 4) throw new Error(`${source} returned ${options.length} options; the current SSC/Punjab Advanced Mathematics section contract requires 4.`);
  if (new Set(options).size !== 4) throw new Error(`${source} returned duplicate displayed options.`);
  const correctIndex = Number(question?.correctIndex ?? question?.correct);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= 4) {
    throw new Error(`${source} returned an invalid correct option index.`);
  }
}

export async function generateQuantV4AdvancedMathSectionQuestion(input: {
  examId: QuantV4AdvancedMathSectionExamId;
  slotKind: QuantV4AdvancedMathSectionSlotKind;
  seed: string;
}): Promise<QuantV4AdvancedMathSectionAdapterResult> {
  const difficulty = difficultyFor(input.seed);

  if (input.slotKind === "ALGEBRA") {
    const examProfile = algebraProfileFor(input.examId);
    const batch = generateAlgebraStudioBatchV5({
      language: "en",
      examProfile,
      difficulty,
      seed: input.seed,
      count: 1,
    });
    const source = batch.questions[0];
    if (!source) throw new Error("Algebra V5 section adapter returned no question.");
    const question = buildAlgebraBankOnlyReviewPayload(source);
    assertFourOptionSingleChoice(question, `Algebra/${input.examId}`);
    if (question.questionBankAcceptanceMode !== "BANK_ONLY" || question.questionBankWritable !== true) {
      throw new Error("Algebra section adapter must preserve the approved BANK_ONLY Question Bank lifecycle.");
    }
    if (question.testEligible !== false || question.publiclyPublishable !== false) {
      throw new Error("Algebra section adapter must not silently promote BANK_ONLY content into test/public release.");
    }
    return Object.freeze({
      authority: QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTER_AUTHORITY,
      examId: input.examId,
      slotKind: input.slotKind,
      seed: input.seed,
      packageId: String(question.packageId ?? "ALGEBRA"),
      selectionPolicy: "PROVISIONAL_NON_PYQ_WEIGHTED",
      question,
    });
  }

  const packageId = trigonometryPackageFor(input.examId, input.seed);
  const result = await generateTrigonometryQuestion({
    packageId,
    language: "en",
    difficulty,
    seed: input.seed,
    count: 1,
  } as any);
  const question = firstQuestion(result);
  assertFourOptionSingleChoice(question, `${packageId}/${input.examId}`);
  if (question.testEligible !== true) {
    throw new Error(`${packageId} section adapter lost its current internal test eligibility.`);
  }
  if (question.publiclyPublishable !== false) {
    throw new Error(`${packageId} section adapter must preserve the public-release lock.`);
  }
  return Object.freeze({
    authority: QUANT_V4_REAL_EXAM_ADVANCED_MATH_ADAPTER_AUTHORITY,
    examId: input.examId,
    slotKind: input.slotKind,
    seed: input.seed,
    packageId,
    selectionPolicy: "PROVISIONAL_NON_PYQ_WEIGHTED",
    question,
  });
}

export function advancedMathSectionQuestionFingerprint(result: QuantV4AdvancedMathSectionAdapterResult): string {
  const question = result.question;
  const options = Array.isArray(question?.options) ? question.options.map((option: any) => String(option)).join("|") : "";
  return [
    result.examId,
    result.slotKind,
    result.packageId,
    String(question?.questionId ?? question?.id ?? ""),
    String(question?.text ?? question?.stem ?? ""),
    options,
    String(question?.correctIndex ?? question?.correct ?? ""),
  ].join("::");
}
