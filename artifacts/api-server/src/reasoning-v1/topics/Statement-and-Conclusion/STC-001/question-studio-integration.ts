import type {
  QuestionStudioDifficulty,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";
import { STC_001_CHAPTER_FREEZE_V2_2 } from "./chapter-freeze-v2-2-manifest.ts";
import {
  generateStcV22Question,
  STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
} from "./editorial-v2-2-generator.ts";
import {
  STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
  STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS,
} from "./question-studio-review-v2-2.ts";
import { STC_QL_IDS, type StcDifficulty, type StcLocale, type StcQlId } from "./types.ts";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

const STC_CP_IDS = ["STC-CP-001", "STC-CP-002", "STC-CP-003"] as const;
type StcCpId = (typeof STC_CP_IDS)[number];

const QLS_BY_CP: Readonly<Record<StcCpId, readonly StcQlId[]>> = Object.freeze({
  "STC-CP-001": ["STC-QL-001", "STC-QL-002"],
  "STC-CP-002": ["STC-QL-003", "STC-QL-004"],
  "STC-CP-003": ["STC-QL-005", "STC-QL-006"],
});

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stableHash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function normalizeCount(value: number | undefined): number {
  if (value == null) return 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) {
    throw new Error("STC-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioLanguage | undefined): StcLocale {
  if (value === "hi") return "hi-IN";
  if (value === "pa") return "pa-IN";
  if (value === undefined || value === "en") return "en-IN";
  throw new Error(`STC-001 does not support language ${String(value)}`);
}

function normalizeDifficulty(value: QuestionStudioDifficulty | "Mixed" | string | undefined): StcDifficulty | undefined {
  const normalized = text(value).toUpperCase();
  if (!normalized || normalized === "MIXED") return undefined;
  if (normalized === "EASY") return "EASY";
  if (normalized === "MEDIUM" || normalized === "MODERATE") return "MEDIUM";
  if (normalized === "HARD" || normalized === "DIFFICULT") return "HARD";
  throw new Error(`STC-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function isQlId(value: string): value is StcQlId {
  return STC_QL_IDS.includes(value as StcQlId);
}

function isCpId(value: string): value is StcCpId {
  return STC_CP_IDS.includes(value as StcCpId);
}

function requestedQlIds(request: QuestionStudioGenerationRequest): readonly StcQlId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);

  const qlMatches = [...new Set(selectors.filter(isQlId))];
  const cpMatches = [...new Set(selectors.filter(isCpId))];

  if (qlMatches.length > 1) {
    throw new Error(`Conflicting STC-001 QL selectors: ${qlMatches.join(", ")}`);
  }
  if (cpMatches.length > 1) {
    throw new Error(`Conflicting STC-001 checkpoint selectors: ${cpMatches.join(", ")}`);
  }
  if (qlMatches.length && cpMatches.length && !QLS_BY_CP[cpMatches[0]!].includes(qlMatches[0]!)) {
    throw new Error(`STC-001 selector ${qlMatches[0]} does not belong to ${cpMatches[0]}`);
  }

  const allowed = new Set<string>([
    "STC-001",
    STC_001_V22_QUESTION_STUDIO_PACKAGE_ID.toUpperCase(),
    ...STC_CP_IDS,
    ...STC_QL_IDS,
  ]);
  const unknown = selectors.find((selector) => selector.startsWith("STC-") && !allowed.has(selector));
  if (unknown) throw new Error(`Unknown STC-001 content selector ${unknown}`);

  if (qlMatches.length) return qlMatches;
  if (cpMatches.length) return QLS_BY_CP[cpMatches[0]!];
  return STC_QL_IDS;
}

function instruction(locale: StcLocale): string {
  if (locale === "hi-IN") {
    return "कथन और दोनों निष्कर्षों को ध्यान से पढ़िए। तय कीजिए कि कौन-सा/कौन-से निष्कर्ष कथन से तार्किक रूप से निकलते हैं।";
  }
  if (locale === "pa-IN") {
    return "ਕਥਨ ਅਤੇ ਦੋਵੇਂ ਨਤੀਜਿਆਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ। ਦੱਸੋ ਕਿ ਕਿਹੜਾ/ਕਿਹੜੇ ਨਤੀਜੇ ਕਥਨ ਤੋਂ ਤਰਕਸੰਗਤ ਤੌਰ ਤੇ ਨਿਕਲਦੇ ਹਨ।";
  }
  return "Read the statement and the two conclusions carefully. Decide which conclusion(s) logically follow from the statement.";
}

function statementLabel(locale: StcLocale): string {
  if (locale === "hi-IN") return "कथन";
  if (locale === "pa-IN") return "ਕਥਨ";
  return "Statement";
}

function titleDifficulty(value: StcDifficulty): "Easy" | "Medium" | "Hard" {
  if (value === "EASY") return "Easy";
  if (value === "HARD") return "Hard";
  return "Medium";
}

function toStudioItem(
  question: ReturnType<typeof generateStcV22Question>,
  locale: StcLocale,
): Record<string, unknown> {
  const learnerInstruction = instruction(locale);
  const stem = [
    learnerInstruction,
    "",
    `${statementLabel(locale)}: ${question.stem}`,
    "",
    `I. ${question.conclusions[0]}`,
    `II. ${question.conclusions[1]}`,
  ].join("\n");
  const difficulty = titleDifficulty(question.difficulty);
  const questionId = `${question.qlId}:${question.scenarioId}:${question.metadata.conclusionsReversed ? "R" : "N"}:${locale}`;

  return {
    ...lifecycle,
    id: questionId,
    questionId,
    packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
    chapterId: "STC-001",
    patternId: question.qlId,
    qlId: question.qlId,
    canonicalProblemId: question.qlId,
    cpId: question.checkpointId,
    checkpointId: question.checkpointId,
    scenarioId: question.scenarioId,
    sourceAuthorityId: question.templateId,
    sourceAuthorityVersion: STC_001_CHAPTER_FREEZE_V2_2.freezeId,
    subject: "Reasoning",
    topic: "Statement & Conclusion",
    subtopic: "Statement and Conclusion",
    language: locale.slice(0, 2),
    locale,
    instruction: learnerInstruction,
    statement: question.stem,
    conclusions: [...question.conclusions],
    stem,
    text: stem,
    options: [...question.options],
    correctIndex: question.correctIndex,
    correct: question.correctIndex,
    answerClass: question.answerClass,
    answer: question.answerClass,
    canonicalAnswer: question.options[question.correctIndex],
    explanation: question.explanation,
    difficulty,
    difficultyLabel: difficulty,
    difficultyAuthority: question.difficulty,
    surfaceArchetype: question.surfaceArchetype,
    templateId: question.templateId,
    variantIndex: question.variantIndex,
    variantKey: question.variantKey,
    generationSeed: question.seed,
    runtimeMode: "review-only",
    registrationStatus: "REGISTERED_REVIEW_ONLY",
    registrationAuthorityId: STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS,
    releaseFreezeId: STC_001_CHAPTER_FREEZE_V2_2.freezeId,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    runtimeRegistered: true,
    reviewOnly: true,
    readOnly: true,
    productionReleased: false,
    questionBankWritable: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    automaticStudentPublication: false,
    productionReleaseAuthorized: false,
    validation: {
      independentProofVerified: question.metadata.independentProofVerified,
      independentProofAuthority: question.metadata.independentProofAuthority,
      independentProofMechanism: question.metadata.independentProofMechanism,
      trilingualTemplateParity: question.metadata.trilingualTemplateParity,
      saturationReady: question.metadata.saturationReady,
    },
    semanticMetadata: {
      qlId: question.qlId,
      answerClass: question.answerClass,
      templateId: question.templateId,
      semanticSlot: question.metadata.semanticSlot,
      conclusionsReversed: question.metadata.conclusionsReversed,
      surfaceArchetype: question.surfaceArchetype,
    },
  };
}

export const STC_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning Ability",
  topic: "Reasoning",
  subtopic: "Statement & Conclusion",
  label: "Reasoning · Statement & Conclusion — STC-001",
  enabled: true,
  cpIds: [...STC_CP_IDS],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: ["Easy", "Medium", "Hard"],
  difficultyFilterSupported: true,
  runtimeMode: "review-only",
  supportedRuntimeModes: ["review-only"],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: false,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  productionReleaseAuthorized: false,
  metadata: {
    chapterId: "STC-001",
    chapterFreezeId: STC_001_CHAPTER_FREEZE_V2_2.freezeId,
    registrationAuthorityId: STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: STC_001_V22_QUESTION_STUDIO_REVIEW_STATUS,
    permanentQlIds: [...STC_QL_IDS],
    semanticSurfaceCapacityPerQl: STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
    fourWayOnly: true,
    bankingFiveWayEitherStatus: "REMOVED_FROM_ACTIVE_NON_SYLLOGISTIC_STC",
    reviewOnly: true,
    multilingualFrozen: true,
  },
};

export function isStc001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId);
  if (packageId) return packageId === STC_001_V22_QUESTION_STUDIO_PACKAGE_ID;

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector === "STC-001" || selector.startsWith("STC-CP-") || selector.startsWith("STC-QL-"))) {
    return true;
  }

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic.includes("statement & conclusion")
    || topic.includes("statement and conclusion")
    || subtopic.includes("statement & conclusion")
    || subtopic.includes("statement and conclusion");
}

export function generateStc001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (request.runtimeMode && request.runtimeMode !== "review-only") {
    throw new Error("STC-001 only supports the review-only Question Studio runtime");
  }

  const count = normalizeCount(request.count);
  const locale = normalizeLanguage(request.language);
  const difficulty = normalizeDifficulty(request.difficulty);
  const selectedQls = requestedQlIds(request);
  const seedText = text(request.seed) || "stc-001-question-studio-v2-2";
  const baseSeed = stableHash(seedText);

  const questions: Record<string, unknown>[] = [];
  const seen = new Set<string>();
  const maximumAttempts = STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL * selectedQls.length;

  for (let attempt = 0; attempt < maximumAttempts && questions.length < count; attempt += 1) {
    const qlId = selectedQls[attempt % selectedQls.length]!;
    const cycleIndex = Math.floor(attempt / selectedQls.length);
    const questionSeed = (baseSeed + cycleIndex) >>> 0;
    const generated = generateStcV22Question({ qlId, locale, seed: questionSeed });
    if (difficulty && generated.difficulty !== difficulty) continue;

    const key = `${generated.qlId}:${generated.scenarioId}:${generated.metadata.conclusionsReversed ? "R" : "N"}`;
    if (seen.has(key)) continue;
    seen.add(key);
    questions.push(toStudioItem(generated, locale));
  }

  if (questions.length < count) {
    throw new Error(
      `STC-001 could produce only ${questions.length} distinct ${difficulty?.toLowerCase() ?? "requested"} review questions for the selected QL/checkpoint scope; requested ${count}`,
    );
  }

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: STC_001_V22_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "STC-001",
      selectedQlIds: [...selectedQls],
      locale,
      requestedDifficulty: difficulty ?? "Mixed",
      difficultyFilterApplied: difficulty !== undefined,
      seed: seedText,
      count,
      semanticSurfaceCapacityPerQl: STC_V22_SEMANTIC_SURFACE_CAPACITY_PER_QL,
      registrationAuthorityId: STC_001_V22_QUESTION_STUDIO_REVIEW_AUTHORITY,
      releaseFreezeId: STC_001_CHAPTER_FREEZE_V2_2.freezeId,
      reviewOnly: true,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      productionReleaseAuthorized: false,
    },
  };
}
