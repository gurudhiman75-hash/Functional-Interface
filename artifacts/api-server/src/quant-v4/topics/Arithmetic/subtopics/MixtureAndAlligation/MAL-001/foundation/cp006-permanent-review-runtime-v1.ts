import {
  MAL_CP006_PERMANENT_ALLOCATION,
  MAL_CP006_PERMANENT_ALLOCATION_ID,
  MAL_CP006_PERMANENT_QL_RANGE,
  getMalCp006PermanentAllocation,
  type MalCp006PermanentAllocationEntry,
  type MalCp006PermanentQlId,
} from "./cp006-permanent-allocation";
import {
  generateMalCp006Wave01FinalLearnerAuthorityQuestion,
  type MalCp006Wave01V2PrototypeId,
} from "./cp006-wave01-learner-authority-final";
import {
  generateMalCp006Wave02FinalAuthorityV4,
  type MalCp006Wave02FinalQuestionV4,
} from "./cp006-wave02-final-authority-v4";
import type { MalCp006Wave02PrototypeId } from "./cp006-source-fixtures-wave02";
import {
  generateMalCp006Wave04FinalGeneralisation,
  type MalCp006Wave04FinalQuestion,
} from "./cp006-wave04-within-identity-generalisation-v2";
import type { MalCp006DiscoveryQuestion, MalCp006Difficulty } from "./cp006-types";

export const MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID =
  "MAL-CP006-EN-PERMANENT-REVIEW-RUNTIME-V1" as const;
export const MAL_CP006_ENGLISH_REVIEW_CANDIDATE_ID =
  "MAL-CP006-EN-REVIEW-CANDIDATE-V1" as const;
export const MAL_CP006_REVIEW_EXPLANATION_LAYOUT_ID =
  "MAL-CP006-EN-SOLUTION-FIRST-REVIEW-V1" as const;

export type MalCp006ReviewAnswerSemantic =
  | "FINAL_COMPONENT_RATIO"
  | "TRANSFER_QUANTITY"
  | "FINAL_CONCENTRATION_PERCENT"
  | "CROSS_VESSEL_COMPONENT_RATIO"
  | "REMAINING_COMPONENT_QUANTITY";

export type MalCp006ReviewAllocationEntry = MalCp006PermanentAllocationEntry & {
  difficulty: MalCp006Difficulty;
  answerSemantic: MalCp006ReviewAnswerSemantic;
};

const REVIEW_PROFILE: Record<
  MalCp006PermanentQlId,
  { difficulty: MalCp006Difficulty; answerSemantic: MalCp006ReviewAnswerSemantic }
> = {
  "MAL-QL-061": { difficulty: "Medium", answerSemantic: "FINAL_COMPONENT_RATIO" },
  "MAL-QL-062": { difficulty: "Medium", answerSemantic: "TRANSFER_QUANTITY" },
  "MAL-QL-063": { difficulty: "Hard", answerSemantic: "FINAL_CONCENTRATION_PERCENT" },
  "MAL-QL-064": { difficulty: "Hard", answerSemantic: "FINAL_COMPONENT_RATIO" },
  "MAL-QL-065": { difficulty: "Medium", answerSemantic: "CROSS_VESSEL_COMPONENT_RATIO" },
  "MAL-QL-066": { difficulty: "Hard", answerSemantic: "TRANSFER_QUANTITY" },
  "MAL-QL-067": { difficulty: "Hard", answerSemantic: "REMAINING_COMPONENT_QUANTITY" },
};

export const MAL_CP006_REVIEW_ALLOCATION: readonly MalCp006ReviewAllocationEntry[] =
  MAL_CP006_PERMANENT_ALLOCATION.map((entry) => ({
    ...entry,
    ...REVIEW_PROFILE[entry.qlId],
  }));

export const MAL_CP006_ENGLISH_REVIEW_CANDIDATE = Object.freeze({
  reviewCandidateId: MAL_CP006_ENGLISH_REVIEW_CANDIDATE_ID,
  runtimeId: MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID,
  allocationId: MAL_CP006_PERMANENT_ALLOCATION_ID,
  packageId: "MAL-001" as const,
  canonicalProblemId: "MAL-CP-006" as const,
  qlRange: MAL_CP006_PERMANENT_QL_RANGE,
  qlCount: MAL_CP006_REVIEW_ALLOCATION.length,
  language: "en" as const,
  locale: "en-IN" as const,
  maturity: "ENGLISH_REVIEW_CANDIDATE" as const,
  reviewStatus: "PENDING_PRODUCT_OWNER_EDITORIAL_REVIEW" as const,
  permanentIdentityFrozen: true,
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  hindiAuthorised: false,
  punjabiAuthorised: false,
});

type MalCp006ReviewSourceQuestion =
  | MalCp006DiscoveryQuestion
  | MalCp006Wave02FinalQuestionV4
  | MalCp006Wave04FinalQuestion;

export interface MalCp006PermanentReviewQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-006";
  runtimeId: typeof MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID;
  reviewCandidateId: typeof MAL_CP006_ENGLISH_REVIEW_CANDIDATE_ID;
  sourceRuntimeId: string;
  sourcePrototypeId: string;
  sourceVariantId: string | null;
  permanentQlId: MalCp006PermanentQlId;
  permanentSolveModeId: MalCp006PermanentAllocationEntry["solveModeId"];
  questionLanguageId: MalCp006PermanentQlId;
  questionId: string;
  language: "en";
  locale: "en-IN";
  requestedSeed: string;
  selectedSeed: string;
  stateKey: string;
  difficulty: MalCp006Difficulty;
  answerSemantic: MalCp006ReviewAnswerSemantic;
  sharedCoreId: MalCp006PermanentAllocationEntry["sharedCoreId"];
  learnerContract: string;
  sourceEvidenceIds: readonly string[];
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  explanation: {
    layoutId: typeof MAL_CP006_REVIEW_EXPLANATION_LAYOUT_ID;
    visibleLines: string[];
    answerLine: string;
    optionalHelp: {
      commonMistake: string;
      verification: string[];
    };
  };
  sourceValidation: { ok: true; message: string };
  maturity: "ENGLISH_REVIEW_CANDIDATE";
  allocationStatus: "PERMANENT_IDENTITY_REVIEW_ONLY";
  reviewStatus: "PENDING_PRODUCT_OWNER_EDITORIAL_REVIEW";
  runtimeMode: "REVIEW_ONLY";
  permanentIdentityFrozen: true;
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
  validation: {
    ok: true;
    valid: true;
    errors: [];
    checks: readonly { name: string; passed: true; message: string }[];
  };
  traceability: {
    packageId: "MAL-001";
    canonicalProblemId: "MAL-CP-006";
    allocationId: typeof MAL_CP006_PERMANENT_ALLOCATION_ID;
    questionLanguageId: MalCp006PermanentQlId;
    solveModeId: MalCp006PermanentAllocationEntry["solveModeId"];
    prototypeId: string;
    sharedCoreId: MalCp006PermanentAllocationEntry["sharedCoreId"];
    authorityIds: readonly string[];
    difficulty: MalCp006Difficulty;
    answerSemantic: MalCp006ReviewAnswerSemantic;
    language: "en";
    locale: "en-IN";
    runtimeMode: "REVIEW_ONLY";
  };
}

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function sourceFor(
  allocation: MalCp006PermanentAllocationEntry,
  seed: string,
): MalCp006ReviewSourceQuestion {
  if (allocation.qlId === "MAL-QL-061" && hash(`${seed}:forward-generalisation`) % 4 === 0) {
    return generateMalCp006Wave04FinalGeneralisation(
      "THREE_LEG_ALTERNATING_FORWARD",
      `${seed}:three-leg`,
    );
  }
  if (allocation.qlId === "MAL-QL-066") {
    return hash(`${seed}:inverse-generalisation`) % 2 === 0
      ? generateMalCp006Wave02FinalAuthorityV4(
          allocation.prototypeId as MalCp006Wave02PrototypeId,
          `${seed}:equal-return`,
        )
      : generateMalCp006Wave04FinalGeneralisation(
          "ASYMMETRIC_INVERSE_RETURN",
          `${seed}:asymmetric-return`,
        );
  }
  if (allocation.qlId === "MAL-QL-067") {
    return generateMalCp006Wave02FinalAuthorityV4(
      allocation.prototypeId as MalCp006Wave02PrototypeId,
      seed,
    );
  }
  return generateMalCp006Wave01FinalLearnerAuthorityQuestion(
    allocation.prototypeId as MalCp006Wave01V2PrototypeId,
    seed,
  );
}

function sourceRuntimeId(source: MalCp006ReviewSourceQuestion): string {
  if ("runtimeId" in source) return source.runtimeId;
  return source.finalAuthorityId;
}

function requestedSeed(source: MalCp006ReviewSourceQuestion, fallback: string): string {
  return "requestedSeed" in source ? source.requestedSeed : source.seed ?? fallback;
}

function selectedSeed(source: MalCp006ReviewSourceQuestion, fallback: string): string {
  return "selectedSeed" in source ? source.selectedSeed : source.seed ?? fallback;
}

function sourceExplanation(source: MalCp006ReviewSourceQuestion): {
  visibleLines: string[];
  answerLine: string;
  commonMistake: string;
  verification: string[];
} {
  if (Array.isArray(source.explanation)) {
    return {
      visibleLines: [...source.explanation],
      answerLine: `Answer: ${source.answer}`,
      commonMistake: source.commonMistake,
      verification: [],
    };
  }
  return {
    visibleLines: [...source.explanation.visibleLines],
    answerLine: source.explanation.answerLine,
    commonMistake: source.explanation.optionalHelp.commonMistake,
    verification: [...source.explanation.optionalHelp.verification],
  };
}

function sourceVariantId(source: MalCp006ReviewSourceQuestion): string | null {
  return "variantId" in source ? source.variantId : null;
}

function assertLearnerSurface(
  source: MalCp006ReviewSourceQuestion,
  qlId: MalCp006PermanentQlId,
): void {
  if (!source.validation.ok) {
    throw new Error(`${qlId}: source authority validation failed: ${source.validation.errors.join("; ")}`);
  }
  if (!source.stem.endsWith("?")) {
    throw new Error(`${qlId}: learner stem is not interrogative.`);
  }
  if (source.options.length !== 4 || new Set(source.options).size !== 4) {
    throw new Error(`${qlId}: learner options are not four unique choices.`);
  }
  if (source.options[source.correctIndex] !== source.answer) {
    throw new Error(`${qlId}: answer/index mapping failed.`);
  }
  const explanation = sourceExplanation(source);
  if (explanation.visibleLines.length < 1 || explanation.visibleLines.length > 4) {
    throw new Error(`${qlId}: visible solution must contain 1-4 calculation lines.`);
  }
  const learnerText = [
    source.stem,
    ...source.options,
    ...explanation.visibleLines,
    explanation.commonMistake,
  ].join(" ");
  if (/component load|state key|current fraction|global component/iu.test(learnerText)) {
    throw new Error(`${qlId}: internal generator terminology leaked into learner text.`);
  }
  if (/\b1 litres\b/iu.test(learnerText)) {
    throw new Error(`${qlId}: singular litre grammar regressed.`);
  }
  if (/\b\d+ litres (?:is|goes)\b/iu.test(learnerText)) {
    throw new Error(`${qlId}: quantity agreement regressed.`);
  }
}

export function generateMalCp006PermanentReviewQuestion(
  qlId: MalCp006PermanentQlId,
  seed = `mal-cp006-review:${qlId}:default`,
): MalCp006PermanentReviewQuestion {
  const allocation = getMalCp006PermanentAllocation(
    MAL_CP006_PERMANENT_ALLOCATION.find((entry) => entry.qlId === qlId)?.prototypeId ??
      (() => {
        throw new Error(`Unknown CP006 permanent QL ${qlId}.`);
      })(),
  );
  const profile = REVIEW_PROFILE[qlId];
  const source = sourceFor(allocation, seed);
  assertLearnerSurface(source, qlId);
  const explanation = sourceExplanation(source);
  const variantId = sourceVariantId(source);

  const checks = [
    {
      name: "PERMANENT_IDENTITY_FROZEN",
      passed: true as const,
      message: `${qlId} / ${allocation.solveModeId} is the frozen Wave 05 permanent identity.`,
    },
    {
      name: "SOURCE_AUTHORITY_VALID",
      passed: true as const,
      message: "The selected Wave 01/02/04 final learner authority passed its own exact validation.",
    },
    {
      name: "LEARNER_SURFACE_CLEAN",
      passed: true as const,
      message: "The English stem, options and solution pass the CP006 review-surface guards.",
    },
    {
      name: "GENERALISATION_STAYS_WITHIN_QL",
      passed: true as const,
      message: variantId
        ? `${variantId} remains inside ${qlId}; no extra QL is created.`
        : `${qlId} uses its approved base learner identity.`,
    },
    {
      name: "DELIVERY_REMAINS_LOCKED",
      passed: true as const,
      message: "This is an inactive permanent-Ql review runtime, not a product release.",
    },
  ];

  return {
    archetypeId: "MAL-001",
    canonicalProblemId: "MAL-CP-006",
    runtimeId: MAL_CP006_PERMANENT_REVIEW_RUNTIME_ID,
    reviewCandidateId: MAL_CP006_ENGLISH_REVIEW_CANDIDATE_ID,
    sourceRuntimeId: sourceRuntimeId(source),
    sourcePrototypeId: source.prototypeId,
    sourceVariantId: variantId,
    permanentQlId: qlId,
    permanentSolveModeId: allocation.solveModeId,
    questionLanguageId: qlId,
    questionId: `MAL-CP006-EN-REVIEW-${qlId}-${hash(seed).toString(16).padStart(8, "0")}`,
    language: "en",
    locale: "en-IN",
    requestedSeed: requestedSeed(source, seed),
    selectedSeed: selectedSeed(source, seed),
    stateKey: source.stateKey,
    difficulty: profile.difficulty,
    answerSemantic: profile.answerSemantic,
    sharedCoreId: allocation.sharedCoreId,
    learnerContract: allocation.learnerContract,
    sourceEvidenceIds: [...source.sourceEvidenceIds],
    stem: source.stem,
    answer: source.answer,
    options: [...source.options],
    correctIndex: source.correctIndex,
    explanation: {
      layoutId: MAL_CP006_REVIEW_EXPLANATION_LAYOUT_ID,
      visibleLines: explanation.visibleLines,
      answerLine: explanation.answerLine,
      optionalHelp: {
        commonMistake: explanation.commonMistake,
        verification: explanation.verification,
      },
    },
    sourceValidation: {
      ok: true,
      message: "Selected final learner authority passed exact mathematical and editorial validation.",
    },
    maturity: "ENGLISH_REVIEW_CANDIDATE",
    allocationStatus: "PERMANENT_IDENTITY_REVIEW_ONLY",
    reviewStatus: "PENDING_PRODUCT_OWNER_EDITORIAL_REVIEW",
    runtimeMode: "REVIEW_ONLY",
    permanentIdentityFrozen: true,
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    validation: {
      ok: true,
      valid: true,
      errors: [],
      checks,
    },
    traceability: {
      packageId: "MAL-001",
      canonicalProblemId: "MAL-CP-006",
      allocationId: MAL_CP006_PERMANENT_ALLOCATION_ID,
      questionLanguageId: qlId,
      solveModeId: allocation.solveModeId,
      prototypeId: allocation.prototypeId,
      sharedCoreId: allocation.sharedCoreId,
      authorityIds: allocation.authorityIds,
      difficulty: profile.difficulty,
      answerSemantic: profile.answerSemantic,
      language: "en",
      locale: "en-IN",
      runtimeMode: "REVIEW_ONLY",
    },
  };
}

export function runMalCp006EnglishReviewPipeline(input: {
  questionLanguageId: MalCp006PermanentQlId;
  seed?: string;
  language?: "en";
}): MalCp006PermanentReviewQuestion {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error(`MAL-CP-006 English review runtime does not support language '${language}'.`);
  }
  return generateMalCp006PermanentReviewQuestion(
    input.questionLanguageId,
    input.seed ?? `mal-cp006-review:${input.questionLanguageId}:default`,
  );
}

export function malCp006PermanentReviewStable(
  question: MalCp006PermanentReviewQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
