import { SIF_001_CHAPTER_FREEZE_V1 } from "./chapter-freeze-v1-manifest.ts";
import { listSifAuthorities } from "./authorities.ts";
import { generateSifQuestion } from "./generator.ts";
import { SIF_CP_IDS, type GeneratedSifQuestion, type SifCpId, type SifDifficulty, type SifLocale } from "./types.ts";
import type { QuestionStudioGenerationRequest, QuestionStudioGenerationResult, QuestionStudioLanguage, QuestionStudioPackageDefinition } from "../../../../question-studio/engine-types.ts";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../../../../question-studio/standard-lifecycle.ts";
import { SIF_001_QUESTION_STUDIO_PACKAGE_ID, SIF_001_QUESTION_STUDIO_REVIEW_AUTHORITY, SIF_001_QUESTION_STUDIO_REVIEW_STATUS } from "./question-studio-review.ts";
import {
  generateSifBankingThreeInferenceQuestion,
  SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
} from "./banking-three-inference.ts";

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const cpIds = [...SIF_CP_IDS];

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
    throw new Error("SIF-001 review batches require count between 1 and 50");
  }
  return value;
}

function normalizeLanguage(value: QuestionStudioLanguage | undefined): SifLocale {
  if (value === "hi") return "hi-IN";
  if (value === "pa") return "pa-IN";
  if (value === undefined || value === "en") return "en-IN";
  throw new Error(`SIF-001 does not support language ${String(value)}`);
}

function normalizeDifficulty(value: unknown): SifDifficulty | undefined {
  const normalized = text(value).toUpperCase();
  if (!normalized || normalized === "MIXED") return undefined;
  if (normalized === "EASY") return "EASY";
  if (normalized === "MEDIUM" || normalized === "MODERATE") return "MEDIUM";
  if (normalized === "HARD") return "HARD";
  throw new Error(`SIF-001 difficulty must be Easy, Medium, Hard or Mixed; received ${String(value)}`);
}

function isCpId(value: string): value is SifCpId {
  return SIF_CP_IDS.includes(value as SifCpId);
}

function isBankingThreeInferenceRequest(request: QuestionStudioGenerationRequest): boolean {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .includes(SIF_BANKING_THREE_INFERENCE_PROFILE_ID);
}

function requestedCpIds(request: QuestionStudioGenerationRequest): readonly SifCpId[] {
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase())
    .filter(Boolean);
  const matches = [...new Set(selectors.filter(isCpId))];
  const allowed = new Set<string>([
    SIF_001_QUESTION_STUDIO_PACKAGE_ID,
    "SIF-001",
    SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
    ...SIF_CP_IDS,
  ]);
  const unknownSelector = selectors.find((selector) => selector.startsWith("SIF-") && !allowed.has(selector));
  if (unknownSelector) throw new Error(`Unknown SIF-001 content-pack selector ${unknownSelector}`);
  if (matches.length > 1) throw new Error(`Conflicting SIF-001 content-pack selectors ${matches.join(", ")}`);
  return matches.length ? matches : SIF_CP_IDS;
}

function requestedAuthorities(request: QuestionStudioGenerationRequest) {
  const selectedCps = requestedCpIds(request);
  const difficulty = normalizeDifficulty(request.difficulty);
  const authorities = selectedCps.flatMap((cpId) => listSifAuthorities(cpId));
  const eligible = difficulty
    ? authorities.filter((authority) => authority.difficulty === difficulty)
    : authorities;
  if (eligible.length === 0) {
    throw new Error(`SIF-001 has no ${difficulty?.toLowerCase() ?? "requested"} authorities in the selected content pack`);
  }
  return { selectedCps, difficulty, eligible };
}

function questionText(question: GeneratedSifQuestion): string {
  return [
    question.instruction,
    "",
    question.statement,
    "",
    `I. ${question.inferences[0]}`,
    `II. ${question.inferences[1]}`,
  ].join("\n");
}

function toQuestionStudioItem(
  question: GeneratedSifQuestion,
  authorityIndex: number,
  authorityPoolSize: number,
): Record<string, unknown> {
  const difficulty = question.difficulty[0] + question.difficulty.slice(1).toLowerCase();
  const questionId = `${question.scenarioId}:${question.seed}:${question.locale}`;
  const stem = questionText(question);
  return {
    ...lifecycle,
    id: questionId,
    questionId,
    packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
    lifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
    patternId: question.cpId,
    cpId: question.cpId,
    checkpointId: question.cpId,
    canonicalProblemId: question.cpId,
    scenarioId: question.scenarioId,
    sourceAuthorityId: question.scenarioId,
    sourceAuthorityVersion: SIF_001_CHAPTER_FREEZE_V1.freezeId,
    sourceAuthorityIndex: authorityIndex,
    sourceAuthorityPoolSize: authorityPoolSize,
    subject: "Reasoning",
    topic: "Statement & Inference",
    subtopic: "Statement and Inference",
    language: question.locale.slice(0, 2),
    locale: question.locale,
    stem,
    text: stem,
    instruction: question.instruction,
    statement: question.statement,
    inferences: question.inferences,
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
    format: question.format,
    domain: question.domain,
    factIds: [...question.factIds],
    candidateStrengths: [...question.candidateStrengths],
    mechanisms: [...question.mechanisms],
    distractorTypes: [...question.distractorTypes],
    validation: [...question.validation],
    generationSeed: question.seed,
    registrationStatus: "REGISTERED_REVIEW_ONLY",
    registrationAuthorityId: SIF_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: SIF_001_QUESTION_STUDIO_REVIEW_STATUS,
    releaseFreezeId: SIF_001_CHAPTER_FREEZE_V1.freezeId,
    questionStudioDiscoverable: true,
    questionStudioGenerationEnabled: true,
    runtimeRegistered: true,
    reviewOnly: true,
    readOnly: true,
    productionReleased: false,
    sourceValidation: [...question.validation],
    generationContext: {
      engineId: "reasoning-v1",
      packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
      chapterId: "SIF-001",
      cpId: question.cpId,
      scenarioId: question.scenarioId,
      locale: question.locale,
      solver: question.metadata.solver,
      generationOrder: question.metadata.generationOrder,
      freezeId: SIF_001_CHAPTER_FREEZE_V1.freezeId,
      lifecycleId: lifecycle.lifecycleId,
      stage: lifecycle.stage,
      reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
      canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
      questionBankStatus: lifecycle.questionBankStatus,
      questionBankWritable: lifecycle.questionBankWritable,
      testEligible: lifecycle.testEligible,
      mockTestEligible: lifecycle.mockTestEligible,
      publiclyPublishable: lifecycle.publiclyPublishable,
      automaticStudentPublication: lifecycle.automaticStudentPublication,
      productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
    },
    semanticMetadata: {
      cpId: question.cpId,
      scenarioId: question.scenarioId,
      answerClass: question.answerClass,
      mechanisms: [...question.mechanisms],
      candidateStrengths: [...question.candidateStrengths],
    },
  };
}

export const SIF_001_QUESTION_STUDIO_PACKAGE: QuestionStudioPackageDefinition = {
  engineId: "reasoning-v1",
  packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
  subject: "Reasoning Ability",
  topic: "Reasoning",
  subtopic: "Statement & Inference",
  label: "Reasoning · Statement & Inference — SIF-001",
  enabled: true,
  cpIds,
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
  questionBankWritable: lifecycle.questionBankWritable,
  questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
  questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    chapterId: "SIF-001",
    chapterFreezeId: SIF_001_CHAPTER_FREEZE_V1.freezeId,
    registrationAuthorityId: SIF_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewStatus: SIF_001_QUESTION_STUDIO_REVIEW_STATUS,
    reviewOnly: true,
    reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
    multilingualFrozen: true,
  },
};

export function isSif001QuestionStudioRequest(request: QuestionStudioGenerationRequest): boolean {
  const packageId = text(request.packageId);
  if (packageId) return packageId === SIF_001_QUESTION_STUDIO_PACKAGE_ID;

  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => text(value).toUpperCase());
  if (selectors.some((selector) => selector.startsWith("SIF-CP"))) return true;

  const topic = text(request.topic).toLowerCase();
  const subtopic = text(request.subtopic).toLowerCase();
  return topic.includes("statement & inference")
    || topic.includes("statement and inference")
    || subtopic.includes("statement & inference")
    || subtopic.includes("statement and inference");
}

export function generateSif001QuestionStudioBatch(
  request: QuestionStudioGenerationRequest,
): QuestionStudioGenerationResult {
  if (request.runtimeMode && request.runtimeMode !== "review-only") {
    throw new Error("SIF-001 only supports the review-only Question Studio runtime");
  }

  const count = normalizeCount(request.count);
  const locale = normalizeLanguage(request.language);

  if (isBankingThreeInferenceRequest(request)) {
    if (count > 5) {
      throw new Error("SIF Banking three-inference review batches currently support at most 5 distinct curated authorities");
    }
    const seedText = text(request.seed) || "sif-001-banking-three-inference-v1";
    const baseSeed = stableHash(seedText);
    const questions = Array.from({ length: count }, (_, index) => {
      const question = generateSifBankingThreeInferenceQuestion({
        locale,
        seed: baseSeed + index,
      });
      const roman = ["I", "II", "III"];
      const instruction = locale === "hi-IN"
        ? "कथन और तीनों अनुमानों को ध्यान से पढ़िए। तय कीजिए कि कौन-सा/कौन-से अनुमान सही हैं।"
        : locale === "pa-IN"
          ? "ਕਥਨ ਅਤੇ ਤਿੰਨਾਂ ਅਨੁਮਾਨਾਂ ਨੂੰ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ। ਦੱਸੋ ਕਿ ਕਿਹੜਾ/ਕਿਹੜੇ ਅਨੁਮਾਨ ਸਹੀ ਹਨ।"
          : "Read the statement and the three inferences carefully. Decide which inference(s) follow.";
      const stem = [
        instruction,
        "",
        question.statement,
        "",
        ...question.inferences.map((value, inferenceIndex) => `${roman[inferenceIndex]}. ${value}`),
      ].join("\n");
      const difficulty = question.difficulty[0] + question.difficulty.slice(1).toLowerCase();
      return {
        ...lifecycle,
        id: `${question.authorityId}:${baseSeed + index}:${locale}`,
        questionId: `${question.authorityId}:${baseSeed + index}:${locale}`,
        packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
        patternId: SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
        canonicalProblemId: SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
        cpId: question.cpId,
        checkpointId: question.cpId,
        scenarioId: question.authorityId,
        sourceAuthorityId: question.baseScenarioId,
        sourceAuthorityVersion: SIF_001_CHAPTER_FREEZE_V1.freezeId,
        subject: "Reasoning",
        topic: "Statement & Inference",
        subtopic: "Statement and Inference",
        language: locale.slice(0, 2),
        locale,
        stem,
        text: stem,
        instruction,
        statement: question.statement,
        inferences: question.inferences,
        options: question.options,
        correctIndex: question.correctIndex,
        correct: question.correctIndex,
        canonicalAnswer: question.options[question.correctIndex],
        explanation: question.explanation,
        difficulty,
        difficultyLabel: difficulty,
        difficultyAuthority: question.difficulty,
        format: "THREE_INFERENCES",
        distractorTypes: question.distractorTypes,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: SIF_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
        reviewStatus: SIF_001_QUESTION_STUDIO_REVIEW_STATUS,
        releaseFreezeId: SIF_001_CHAPTER_FREEZE_V1.freezeId,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        runtimeRegistered: true,
        reviewOnly: true,
        readOnly: true,
        productionReleased: false,
        generationSeed: baseSeed + index,
        generationContext: {
          engineId: "reasoning-v1",
          packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
          chapterId: "SIF-001",
          presentationProfileId: SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
          locale,
          freezeId: SIF_001_CHAPTER_FREEZE_V1.freezeId,
          lifecycleId: lifecycle.lifecycleId,
          stage: lifecycle.stage,
          reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
          canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
          questionBankStatus: lifecycle.questionBankStatus,
          questionBankWritable: false,
          testEligible: false,
          mockTestEligible: false,
          publiclyPublishable: false,
          automaticStudentPublication: false,
          productionReleaseAuthorized: false,
        },
      };
    });

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "reasoning-v1",
        packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
        chapterId: "SIF-001",
        presentationProfileId: SIF_BANKING_THREE_INFERENCE_PROFILE_ID,
        locale,
        seed: seedText,
        count,
        questionBankWritable: false,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
        automaticStudentPublication: false,
      },
    };
  }
  const { selectedCps, difficulty, eligible } = requestedAuthorities(request);
  if (count > eligible.length) {
    throw new Error(`SIF-001 can provide only ${eligible.length} distinct authorities for this content-pack and difficulty selection`);
  }

  const seed = text(request.seed) || "sif-001-question-studio-review-v1";
  const authorities = [...eligible].sort((left, right) =>
    stableHash(`${seed}:${left.id}`) - stableHash(`${seed}:${right.id}`)
      || left.id.localeCompare(right.id),
  );

  const questions = authorities.slice(0, count).map((authority, index) => {
    const authorityPool = listSifAuthorities(authority.cpId);
    const authorityIndex = authorityPool.findIndex((entry) => entry.id === authority.id);
    const initialSeed = stableHash(`${seed}:${authority.id}:${index}`);
    const questionSeed = initialSeed
      + ((authorityIndex - (initialSeed % authorityPool.length) + authorityPool.length) % authorityPool.length);
    const generated = generateSifQuestion({ cpId: authority.cpId, locale, seed: questionSeed });
    if (generated.scenarioId !== authority.id) {
      throw new Error(`SIF-001 authority selection drifted for ${authority.id}`);
    }
    return toQuestionStudioItem(generated, authorityIndex, authorityPool.length);
  });

  return {
    questions,
    generationContext: {
      ...lifecycle,
      engineId: "reasoning-v1",
      packageId: SIF_001_QUESTION_STUDIO_PACKAGE_ID,
      topic: "Reasoning",
      subtopic: "Statement & Inference",
      chapterId: "SIF-001",
      chapterFreezeId: SIF_001_CHAPTER_FREEZE_V1.freezeId,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: SIF_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
      reviewStatus: SIF_001_QUESTION_STUDIO_REVIEW_STATUS,
      locale,
      selectedCpIds: [...selectedCps],
      requestedDifficulty: difficulty ?? "Mixed",
      difficultyFilterApplied: difficulty !== undefined,
      sourceAuthorityCount: eligible.length,
      sourceAuthorityIds: authorities.map((authority) => authority.id),
      seed,
      count,
      questionBankWritable: false,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
    },
  };
}
