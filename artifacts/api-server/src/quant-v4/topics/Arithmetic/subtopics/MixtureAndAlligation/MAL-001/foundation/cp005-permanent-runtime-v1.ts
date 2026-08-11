import {
  MAL_CP005_PERMANENT_ALLOCATION,
  MAL_CP005_PERMANENT_ALLOCATION_ID,
  MAL_CP005_PERMANENT_QL_RANGE,
  getMalCp005PermanentAllocation,
  type MalCp005PermanentAllocationEntry,
  type MalCp005PermanentQlId,
} from "./cp005-permanent-allocation-v1";
import {
  generateMalCp005ExamReadyV2Question,
} from "./cp005-exam-ready-v2-runtime";
import type { MalCp005ExamReadyQuestionV2 } from "./cp005-exam-ready-v2-types";
import type { MalCp005DiscoveryPrototypeId } from "./cp005-types";
import {
  MAL_CP005_WAVE03_CANDIDATE_ID,
} from "./cp005-wave03-price-change-candidate";
import {
  generateMalCp005Wave03ProductReadyV2,
  type MalCp005Wave03ProductReadyQuestionV2,
} from "./cp005-wave03-product-ready-v2";

export const MAL_CP005_PERMANENT_RUNTIME_ID =
  "MAL-CP005-EN-PERMANENT-RUNTIME-V1" as const;
export const MAL_CP005_ENGLISH_RELEASE_ID = "MAL-CP005-EN-v1" as const;
export const MAL_CP005_RELEASE_EXPLANATION_LAYOUT_ID =
  "MAL-CP005-EN-SOLUTION-FIRST-RELEASE-V1" as const;

export type MalCp005ReleaseDifficulty = "Easy" | "Medium";

export interface MalCp005ReleaseAllocationEntry
  extends MalCp005PermanentAllocationEntry {
  readonly difficulty: MalCp005ReleaseDifficulty;
}

function releaseDifficulty(
  qlId: MalCp005PermanentQlId,
): MalCp005ReleaseDifficulty {
  return qlId === "MAL-QL-048" || qlId === "MAL-QL-049"
    ? "Easy"
    : "Medium";
}

export const MAL_CP005_RELEASE_ALLOCATION: readonly MalCp005ReleaseAllocationEntry[] =
  MAL_CP005_PERMANENT_ALLOCATION.map((entry) => ({
    ...entry,
    difficulty: releaseDifficulty(entry.qlId),
  }));

export const MAL_CP005_ENGLISH_RELEASE = Object.freeze({
  releaseId: MAL_CP005_ENGLISH_RELEASE_ID,
  allocationId: MAL_CP005_PERMANENT_ALLOCATION_ID,
  packageId: "MAL-001" as const,
  canonicalProblemId: "MAL-CP-005" as const,
  runtimeId: MAL_CP005_PERMANENT_RUNTIME_ID,
  language: "en" as const,
  locale: "en-IN" as const,
  status: "FROZEN" as const,
  releaseStatus: "APPROVED" as const,
  allocationStatus: "RELEASED_ENGLISH_V1" as const,
  qlCount: MAL_CP005_RELEASE_ALLOCATION.length,
  qlRange: MAL_CP005_PERMANENT_QL_RANGE,
  sharedMathematicalCoreCount: 3,
  approvedAt: "2026-08-11" as const,
  approvedBy: "ExamTree product-owner continuation directive" as const,
  terminologyPolicy: "COST_PRICE" as const,
  questionStudioDiscoverable: true,
  questionBankWritable: true,
  testEligible: true,
  publiclyPublishable: true,
  active: true,
  excludedLanguages: ["hi", "pa"] as const,
});

type MalCp005ReleaseSourceQuestion =
  | MalCp005ExamReadyQuestionV2
  | MalCp005Wave03ProductReadyQuestionV2;

type MalCp005ReleaseOptionalHelp =
  MalCp005ExamReadyQuestionV2["explanation"]["optionalHelp"];

export interface MalCp005ReleasedQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-005";
  runtimeId: typeof MAL_CP005_PERMANENT_RUNTIME_ID;
  releaseId: typeof MAL_CP005_ENGLISH_RELEASE_ID;
  sourceRuntimeId: string;
  sourceQuestionId: string;
  sourceReviewStatus: "PRODUCT_REVIEW_APPROVED";
  permanentQlId: MalCp005PermanentQlId;
  permanentSolveModeId: MalCp005PermanentAllocationEntry["solveModeId"];
  questionLanguageId: MalCp005PermanentQlId;
  questionId: string;
  language: "en";
  locale: "en-IN";
  requestedSeed: string;
  selectedSeed: string;
  selectionAttempt: number;
  stateKey: string;
  siblingStateKey: string;
  difficulty: MalCp005ReleaseDifficulty;
  difficultyBand: MalCp005ReleaseDifficulty;
  taskDirection: MalCp005PermanentAllocationEntry["taskDirection"];
  answerSemantic: MalCp005PermanentAllocationEntry["answerSemantic"];
  authorityId: MalCp005PermanentAllocationEntry["authorityId"];
  coreFamily: MalCp005PermanentAllocationEntry["coreFamily"];
  sourceEvidenceIds: readonly string[];
  parameters: unknown;
  solution: unknown;
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp005ExamReadyQuestionV2["optionAudit"];
  explanation: {
    layoutId: typeof MAL_CP005_RELEASE_EXPLANATION_LAYOUT_ID;
    visibleLines: string[];
    answerLine: string;
    optionalHelp: MalCp005ReleaseOptionalHelp;
  };
  sourceValidation: {
    ok: true;
    message: string;
  };
  maturity: "FROZEN";
  allocationStatus: "RELEASED_ENGLISH_V1";
  releaseStatus: "APPROVED";
  runtimeMode: "RELEASED";
  reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
  questionBankStatus: "WRITABLE";
  testEligibility: "ELIGIBLE";
  permanentIdentityFrozen: true;
  active: true;
  publiclyPublishable: true;
  questionStudioDiscoverable: true;
  questionBankWritable: true;
  testEligible: true;
  validation: {
    ok: true;
    valid: true;
    errors: [];
    checks: readonly {
      name: string;
      passed: true;
      message: string;
    }[];
  };
  traceability: {
    packageId: "MAL-001";
    canonicalProblemId: "MAL-CP-005";
    questionLanguageId: MalCp005PermanentQlId;
    qlTemplateId: MalCp005PermanentAllocationEntry["qlTemplateId"];
    solveModeId: MalCp005PermanentAllocationEntry["solveModeId"];
    authorityId: MalCp005PermanentAllocationEntry["authorityId"];
    coreFamily: MalCp005PermanentAllocationEntry["coreFamily"];
    releaseId: typeof MAL_CP005_ENGLISH_RELEASE_ID;
    sourceEvidenceIds: readonly string[];
    taskDirection: MalCp005PermanentAllocationEntry["taskDirection"];
    answerSemantic: MalCp005PermanentAllocationEntry["answerSemantic"];
    difficulty: MalCp005ReleaseDifficulty;
    language: "en";
    locale: "en-IN";
    terminologyPolicy: "COST_PRICE";
    runtimeMode: "RELEASED";
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH";
    questionBankStatus: "WRITABLE";
    testEligibility: "ELIGIBLE";
    publiclyPublishable: true;
  };
}

function normalizeCostPriceText(text: string): string {
  return text
    .replace(/\bbuying rate\b/giu, "cost price")
    .replace(/\bpurchase rate\b/giu, "cost price");
}

function normalizeLearnerValue<T>(value: T): T {
  if (typeof value === "string") {
    return normalizeCostPriceText(value) as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => normalizeLearnerValue(item)) as T;
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const normalized: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(record)) {
      normalized[key] = normalizeLearnerValue(item);
    }
    return normalized as T;
  }
  return value;
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function sourceQuestionFor(
  allocation: MalCp005PermanentAllocationEntry,
  seed: string,
): MalCp005ReleaseSourceQuestion {
  if (allocation.authorityId === MAL_CP005_WAVE03_CANDIDATE_ID) {
    return generateMalCp005Wave03ProductReadyV2(seed);
  }
  return generateMalCp005ExamReadyV2Question(
    allocation.authorityId as MalCp005DiscoveryPrototypeId,
    seed,
  );
}

function sourceValidation(
  source: MalCp005ReleaseSourceQuestion,
): { ok: true; message: string } {
  if (source.reviewStatus !== "PRODUCT_REVIEW_APPROVED") {
    throw new Error(`${source.questionId}: source question is not product approved.`);
  }
  if ("validation" in source) {
    if (!source.validation.ok) {
      throw new Error(
        `${source.questionId}: source validation failed: ${source.validation.errors.join("; ")}`,
      );
    }
    return {
      ok: true,
      message: "Exam-ready V2 mathematical/editorial validation passed before release wrapping.",
    };
  }
  if (
    !source.equivalence.percentMatchesExistingSolver ||
    !source.equivalence.distinctAnswerSemantic ||
    !source.equivalence.scalingWitness.sameProfitPercent ||
    !source.equivalence.scalingWitness.doubledProfitAmount
  ) {
    throw new Error(`${source.questionId}: Wave 03 equivalence proof failed.`);
  }
  return {
    ok: true,
    message: "Wave 03 product-approved equivalence and scaling-distinctness proof passed.",
  };
}

export function generateMalCp005PermanentQuestion(
  qlId: MalCp005PermanentQlId,
  seed = `mal-cp005-release:${qlId}:default`,
): MalCp005ReleasedQuestion {
  const allocation = getMalCp005PermanentAllocation(qlId);
  const source = sourceQuestionFor(allocation, seed);
  const sourceCheck = sourceValidation(source);
  const difficulty = releaseDifficulty(qlId);

  if (source.difficulty !== difficulty) {
    throw new Error(
      `${qlId}/${seed}: source difficulty ${source.difficulty} does not match release allocation ${difficulty}.`,
    );
  }
  if (source.taskDirection !== allocation.taskDirection) {
    throw new Error(`${qlId}/${seed}: source task direction no longer matches permanent allocation.`);
  }
  if (source.answerSemantic !== allocation.answerSemantic) {
    throw new Error(`${qlId}/${seed}: source answer semantic no longer matches permanent allocation.`);
  }

  const stem = normalizeCostPriceText(source.stem);
  const explanationSource = normalizeLearnerValue(source.explanation);
  const learnerText = JSON.stringify({
    stem,
    explanation: explanationSource,
    options: source.options,
    answer: source.answer,
  });
  if (/\b(?:buying|purchase) rate\b/iu.test(learnerText)) {
    throw new Error(`${qlId}/${seed}: forbidden buying/purchase-rate terminology survived release normalization.`);
  }

  const checks = [
    {
      name: "PRODUCT_REVIEW_AUTHORITY",
      passed: true as const,
      message: "The source task contract is explicitly product-review approved.",
    },
    {
      name: "PERMANENT_IDENTITY_ALLOCATION",
      passed: true as const,
      message: `${qlId} / ${allocation.solveModeId} is the frozen permanent identity.`,
    },
    {
      name: "NORMALIZED_SOURCE_TRACEABILITY",
      passed: true as const,
      message: `${allocation.sourceEvidence.length} normalized source references remain attached.`,
    },
    {
      name: "COST_PRICE_TERMINOLOGY",
      passed: true as const,
      message: "Learner-facing CP terminology uses cost price rather than buying rate or purchase rate.",
    },
    {
      name: "ENGLISH_DELIVERY_AUTHORIZATION",
      passed: true as const,
      message: "English Question Studio, Question Bank, test and publication surfaces are enabled under Wave 05.",
    },
  ];

  return {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-005",
    runtimeId: MAL_CP005_PERMANENT_RUNTIME_ID,
    releaseId: MAL_CP005_ENGLISH_RELEASE_ID,
    sourceRuntimeId: source.runtimeId,
    sourceQuestionId: source.questionId,
    sourceReviewStatus: "PRODUCT_REVIEW_APPROVED",
    permanentQlId: qlId,
    permanentSolveModeId: allocation.solveModeId,
    questionLanguageId: qlId,
    questionId: `MAL-CP005-EN-${qlId}-${hash(seed).toString(16).padStart(8, "0")}`,
    language: "en",
    locale: "en-IN",
    requestedSeed: source.requestedSeed,
    selectedSeed: source.selectedSeed,
    selectionAttempt: source.selectionAttempt,
    stateKey: source.stateKey,
    siblingStateKey: source.siblingStateKey,
    difficulty,
    difficultyBand: difficulty,
    taskDirection: allocation.taskDirection,
    answerSemantic: allocation.answerSemantic,
    authorityId: allocation.authorityId,
    coreFamily: allocation.coreFamily,
    sourceEvidenceIds: allocation.sourceEvidence,
    parameters: source.request,
    solution: source.solution,
    stem,
    answer: source.answer,
    options: [...source.options],
    correctIndex: source.correctIndex,
    optionAudit: source.optionAudit.map((item) => ({ ...item })),
    explanation: {
      layoutId: MAL_CP005_RELEASE_EXPLANATION_LAYOUT_ID,
      visibleLines: [...explanationSource.visibleLines],
      answerLine: explanationSource.answerLine,
      optionalHelp: explanationSource.optionalHelp,
    },
    sourceValidation: sourceCheck,
    maturity: "FROZEN",
    allocationStatus: "RELEASED_ENGLISH_V1",
    releaseStatus: "APPROVED",
    runtimeMode: "RELEASED",
    reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
    questionBankStatus: "WRITABLE",
    testEligibility: "ELIGIBLE",
    permanentIdentityFrozen: true,
    active: true,
    publiclyPublishable: true,
    questionStudioDiscoverable: true,
    questionBankWritable: true,
    testEligible: true,
    validation: {
      ok: true,
      valid: true,
      errors: [],
      checks,
    },
    traceability: {
      packageId: "MAL-001",
      canonicalProblemId: "MAL-CP-005",
      questionLanguageId: qlId,
      qlTemplateId: allocation.qlTemplateId,
      solveModeId: allocation.solveModeId,
      authorityId: allocation.authorityId,
      coreFamily: allocation.coreFamily,
      releaseId: MAL_CP005_ENGLISH_RELEASE_ID,
      sourceEvidenceIds: allocation.sourceEvidence,
      taskDirection: allocation.taskDirection,
      answerSemantic: allocation.answerSemantic,
      difficulty,
      language: "en",
      locale: "en-IN",
      terminologyPolicy: "COST_PRICE",
      runtimeMode: "RELEASED",
      reviewStatus: "APPROVED_EDITORIAL_ENGLISH",
      questionBankStatus: "WRITABLE",
      testEligibility: "ELIGIBLE",
      publiclyPublishable: true,
    },
  };
}

export function runMalCp005EnglishReleasePipeline(input: {
  questionLanguageId: MalCp005PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp005ReleasedQuestion {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(
      `MAL-CP-005 English release does not support language '${language}'.`,
    );
  }
  return generateMalCp005PermanentQuestion(
    input.questionLanguageId,
    input.seed ?? `mal-cp005-release:${input.questionLanguageId}:default`,
  );
}

export function malCp005PermanentStable(
  question: MalCp005ReleasedQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
