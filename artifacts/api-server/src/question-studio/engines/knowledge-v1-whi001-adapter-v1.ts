import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import en from "../../knowledge-v1/world-history-cp001-en-v1.json";
import hi from "../../knowledge-v1/world-history-cp001-hi-v1.json";
import pa from "../../knowledge-v1/world-history-cp001-pa-v1.json";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const WHI_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "WHI-001" as const;
export const WHI_001_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const WHI_001_CP001_REGISTRATION_AUTHORITY_V1 = "WHI-001-CP001-APPROVED-REVIEW-CORPUS-V1" as const;
export const WHI_001_CP001_REVISION_POLICY_V1 = "REVISE_SOURCE_CORPUS_AND_RELOCALIZE_ALL_LANGUAGES" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const languages: readonly QuestionStudioLanguage[] = ["en", "hi", "pa"];
const locales: Readonly<Record<QuestionStudioLanguage, string>> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };
const corpusByLanguage = Object.freeze({ en, hi, pa });
const cpId = "WHI-001-CP001";
const english = corpusByLanguage.en;

for (const language of languages) {
  const corpus = corpusByLanguage[language];
  if (corpus.length !== 60) throw new Error(`WHI-001-CP001 ${language} corpus must contain 60 items`);
  if (new Set(corpus.map((q) => q.questionId)).size !== corpus.length) throw new Error(`WHI-001-CP001 ${language} has duplicate question IDs`);
  for (const q of corpus) {
    if (q.options.length !== 4 || new Set(q.options).size !== 4) throw new Error(`${q.questionId}: expected four unique options`);
    if (q.correctIndex < 0 || q.correctIndex > 3 || q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`${q.questionId}: answer key mismatch`);
    if (q.cpId !== cpId || q.language !== language || !q.sourceIds.length) throw new Error(`${q.questionId}: missing checkpoint, language, or source provenance`);
  }
}

for (let i = 0; i < english.length; i += 1) {
  const canonical = english[i]!;
  for (const language of ["hi", "pa"] as const) {
    const localized = corpusByLanguage[language][i]!;
    if (localized.englishQuestionId !== canonical.questionId || localized.correctIndex !== canonical.correctIndex || localized.difficulty !== canonical.difficulty) {
      throw new Error(`${localized.questionId}: localization identity, answer position, or difficulty mismatch`);
    }
  }
}

const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;
export const WHI_001_CP001_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: WHI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "World History",
  subtopic: "Ancient and Medieval World",
  label: "Static GK · World History · Ancient and Medieval World",
  enabled: true,
  cpIds: [cpId],
  supportedLanguages: [...languages],
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: WHI_001_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [WHI_001_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1],
  lifecycleId: lifecycle.lifecycleId,
  lifecycleStage: lifecycle.stage,
  reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired,
  questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable,
  testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible,
  mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable,
  automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    ...lifecycle,
    registrationAuthorityId: WHI_001_CP001_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    localizationStatus: "REVIEW_REQUIRED",
    reviewOnly: true,
    immutableCorpus: true,
    questionCountPerLanguage: 60,
    supportedDifficulties: [...supportedDifficulties],
    correctIndexAndDifficultyParityRequired: true,
    permanentQlIdsAllocated: false,
    studentPublicationAuthorized: false,
  },
};

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  if (!language) return "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`WHI-001 does not support language ${String(language)}`);
}
function normalizeCount(count: number | undefined): number {
  const value = count ?? 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) throw new Error("WHI-001 review batches require count between 1 and 50");
  return value;
}
function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]): "Mixed" | "Easy" | "Medium" | "Hard" {
  if (!difficulty || difficulty === "Mixed") return "Mixed";
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("WHI-001 difficulty must be Easy, Medium, Hard, or Mixed");
}
function selectorValues(request: QuestionStudioGenerationRequest): string[] {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}
function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const selectors = selectorValues(request);
  const known = new Set(["WHI-001", cpId, ...english.map((q) => q.questionId.toUpperCase())]);
  const unknown = selectors.filter((value) => !known.has(value));
  if (unknown.length) throw new Error(`Unknown WHI-001 selector ${unknown[0]}`);
  const questionIds = selectors.filter((value) => value.startsWith("WHI-CP001-Q"));
  if (new Set(questionIds).size > 1) throw new Error("Conflicting WHI-001 question selectors");
  return { questionId: questionIds[0] };
}

export function isWhi001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === WHI_001_QUESTION_STUDIO_PACKAGE_ID_V1;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const selectors = selectorValues(request);
  return topic === "world history" || (subject === "static gk" && selectors.some((v) => v.startsWith("WHI-")));
}

export const knowledgeV1Whi001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return [WHI_001_CP001_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== WHI_001_QUESTION_STUDIO_PACKAGE_ID_V1) throw new Error(`WHI-001 adapter cannot generate package ${packageId}`);
    if (request.runtimeMode && request.runtimeMode !== WHI_001_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1) throw new Error("WHI-001 only supports review-only runtime");
    const language = normalizeLanguage(request.language);
    const difficulty = normalizeDifficulty(request.difficulty);
    const count = normalizeCount(request.count);
    const { questionId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "whi-001-cp001-review-v1";
    const candidates = corpusByLanguage[language].filter((q) =>
      (!questionId || q.englishQuestionId.toUpperCase() === questionId) &&
      (difficulty === "Mixed" || q.difficulty === difficulty),
    );
    if (!candidates.length) throw new Error(`WHI-001 selectors produced no ${difficulty} questions`);
    if (count > candidates.length) throw new Error(`WHI-001 cannot fill ${count} questions from ${candidates.length} candidates without repeats`);
    const selected = deterministicShuffle(candidates, `${seed}:${language}:${difficulty}:${questionId ?? "ALL"}`).slice(0, count);
    const questions = selected.map((q) => ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      sourceQuestionId: q.englishQuestionId,
      packageId: WHI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: q.questionFamily,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "World History",
      subtopic: "Ancient and Medieval World",
      language,
      locale: locales[language],
      stem: q.stem,
      text: q.stem,
      options: [...q.options],
      correctIndex: q.correctIndex,
      correct: q.correctIndex,
      canonicalAnswer: q.canonicalAnswer,
      answer: q.canonicalAnswer,
      explanation: q.explanation,
      difficulty: q.difficulty,
      difficultyLabel: q.difficulty,
      questionFamily: q.questionFamily,
      sourceIds: [...q.sourceIds],
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_001_CP001_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "REVIEW_REQUIRED",
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      revisionPolicy: WHI_001_CP001_REVISION_POLICY_V1,
      productionReleased: false,
    }));
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: WHI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: WHI_001_CP001_QUESTION_STUDIO_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_001_CP001_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "REVIEW_REQUIRED",
      language,
      locale: locales[language],
      difficulty,
      cpId,
      seed,
      requestedCount: count,
      candidateCount: candidates.length,
      corpusQuestionCount: corpusByLanguage[language].length,
      studentPublicationAuthorized: false,
    } };
  },
};
