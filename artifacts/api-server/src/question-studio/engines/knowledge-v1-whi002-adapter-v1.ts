import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import en from "../../knowledge-v1/world-history-cp002-en-v1.json";
import hi from "../../knowledge-v1/world-history-cp002-hi-v1.json";
import pa from "../../knowledge-v1/world-history-cp002-pa-v1.json";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const WHI_002_QUESTION_STUDIO_PACKAGE_ID_V1 = "WHI-002" as const;
export const WHI_002_CP002_RUNTIME_MODE_V1 = "review-only" as const;
export const WHI_002_CP002_REGISTRATION_AUTHORITY_V1 = "WHI-001-CP002-EN-HI-PA-REVIEW-CORPORA-V1" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
type RawQuestion = {
  questionId: string;
  englishQuestionId?: string;
  checkpointId: string;
  language: string;
  difficulty: string;
  questionFamily: string;
  stem: string;
  options: Array<{ key: string; text: string }>;
  correctOption: string;
  explanation: string;
  sourceIds: string[];
};
type Question = {
  questionId: string;
  englishQuestionId: string;
  cpId: string;
  language: QuestionStudioLanguage;
  difficulty: "Easy" | "Medium" | "Hard";
  questionFamily: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
};
const cpId = "WHI-001-CP002";
const rawByLanguage: Readonly<Record<QuestionStudioLanguage, readonly RawQuestion[]>> = {
  en: en as RawQuestion[],
  hi: hi as RawQuestion[],
  pa: pa as RawQuestion[],
};
function normalizeCorpus(language: QuestionStudioLanguage): readonly Question[] {
  const normalized = rawByLanguage[language].map((q) => {
    const options = q.options.map((option) => option.text);
    const correctIndex = q.options.findIndex((option) => option.key === q.correctOption);
    if (correctIndex < 0) throw new Error(`${q.questionId}: missing keyed answer`);
    return Object.freeze({
      questionId: q.questionId,
      englishQuestionId: q.englishQuestionId ?? q.questionId,
      cpId: q.checkpointId,
      language,
      difficulty: (q.difficulty[0]!.toUpperCase() + q.difficulty.slice(1).toLowerCase()) as Question["difficulty"],
      questionFamily: q.questionFamily,
      stem: q.stem,
      options,
      correctIndex,
      canonicalAnswer: options[correctIndex]!,
      explanation: q.explanation,
      sourceIds: [...q.sourceIds],
    });
  });
  if (normalized.length !== 60) throw new Error(`WHI-001-CP002 ${language} corpus must contain 60 items`);
  if (new Set(normalized.map((q) => q.questionId)).size !== normalized.length) throw new Error(`WHI-001-CP002 ${language} has duplicate question IDs`);
  for (const q of normalized) {
    if (q.cpId !== cpId || q.language !== language || q.options.length !== 4 || new Set(q.options).size !== 4 || !q.sourceIds.length) {
      throw new Error(`${q.questionId}: invalid checkpoint, language, options, or source provenance`);
    }
    if (q.correctIndex < 0 || q.correctIndex > 3 || q.options[q.correctIndex] !== q.canonicalAnswer) {
      throw new Error(`${q.questionId}: answer key mismatch`);
    }
  }
  return Object.freeze(normalized);
}
const corpusByLanguage: Readonly<Record<QuestionStudioLanguage, readonly Question[]>> = {
  en: normalizeCorpus("en"),
  hi: normalizeCorpus("hi"),
  pa: normalizeCorpus("pa"),
};
const englishById = new Map(corpusByLanguage.en.map((q) => [q.questionId, q]));
for (const language of ["hi", "pa"] as const) {
  const corpus = corpusByLanguage[language];
  if (corpus.length !== corpusByLanguage.en.length) throw new Error(`WHI-001-CP002 ${language} count does not match English`);
  for (let index = 0; index < corpus.length; index += 1) {
    const localized = corpus[index]!;
    const english = englishById.get(localized.englishQuestionId);
    if (!english || english.correctIndex !== localized.correctIndex || english.difficulty !== localized.difficulty) {
      throw new Error(`${localized.questionId}: English answer or difficulty parity mismatch`);
    }
  }
}
const difficulties = ["Easy", "Medium", "Hard"] as const;
const locales: Readonly<Record<QuestionStudioLanguage, string>> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };

export const WHI_002_CP002_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: WHI_002_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "World History",
  subtopic: "Renaissance, Reformation, Scientific Revolution, and Exploration",
  label: "Static GK · World History · Renaissance to Exploration",
  enabled: true,
  cpIds: [cpId],
  supportedLanguages: ["en", "hi", "pa"],
  supportedDifficulties: [...difficulties],
  difficultyFilterSupported: true,
  runtimeMode: WHI_002_CP002_RUNTIME_MODE_V1,
  supportedRuntimeModes: [WHI_002_CP002_RUNTIME_MODE_V1],
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
    registrationAuthorityId: WHI_002_CP002_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    localizationStatus: "REVIEW_REQUIRED",
    reviewOnly: true,
    immutableCorpus: true,
    questionCountPerLanguage: 60,
    supportedDifficulties: [...difficulties],
    correctIndexAndDifficultyParityRequired: true,
    nativeLanguageProofreadingRequired: true,
    permanentQlIdsAllocated: false,
    studentPublicationAuthorized: false,
  },
};

function normalizeDifficulty(value: QuestionStudioGenerationRequest["difficulty"]): "Mixed" | Question["difficulty"] {
  if (!value || value === "Mixed") return "Mixed";
  if (value === "Easy" || value === "Medium" || value === "Hard") return value;
  throw new Error("WHI-002 difficulty must be Easy, Medium, Hard, or Mixed");
}
function normalizeLanguage(value: QuestionStudioGenerationRequest["language"]): QuestionStudioLanguage {
  return value ?? "en";
}
function selectorValues(request: QuestionStudioGenerationRequest): string[] {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase()).filter(Boolean);
}
function normalizeSelectors(request: QuestionStudioGenerationRequest): string | undefined {
  const selectors = selectorValues(request);
  const ids = new Set(corpusByLanguage.en.map((q) => q.questionId.toUpperCase()));
  const known = new Set(["WHI-002", cpId, ...ids]);
  const unknown = selectors.find((value) => !known.has(value));
  if (unknown) throw new Error(`Unknown WHI-002 selector ${unknown}`);
  const selected = selectors.filter((value) => value.startsWith("WHI-CP002-Q"));
  if (new Set(selected).size > 1) throw new Error("Conflicting WHI-002 question selectors");
  return selected[0];
}
export function isWhi002QuestionStudioRequestV1(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === WHI_002_QUESTION_STUDIO_PACKAGE_ID_V1;
  return selectorValues(request).some((value) => value === cpId || value.startsWith("WHI-CP002-Q"));
}
function normalizeCount(value: number | undefined): number {
  const count = value ?? 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error("WHI-002 review batches require count between 1 and 50");
  return count;
}

export const knowledgeV1Whi002QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return [WHI_002_CP002_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== WHI_002_QUESTION_STUDIO_PACKAGE_ID_V1) throw new Error(`WHI-002 cannot generate package ${packageId}`);
    if (request.runtimeMode && request.runtimeMode !== WHI_002_CP002_RUNTIME_MODE_V1) throw new Error("WHI-002 only supports review-only runtime");
    const language = normalizeLanguage(request.language);
    const locale = locales[language];
    const corpus = corpusByLanguage[language];
    const difficulty = normalizeDifficulty(request.difficulty);
    const count = normalizeCount(request.count);
    const questionId = normalizeSelectors(request);
    const seed = request.seed?.trim() || "whi-001-cp002-review-v1";
    const candidates = corpus.filter((q) => (!questionId || q.englishQuestionId.toUpperCase() === questionId) && (difficulty === "Mixed" || q.difficulty === difficulty));
    if (!candidates.length) throw new Error(`WHI-002 selectors produced no ${difficulty} questions`);
    if (count > candidates.length) throw new Error(`WHI-002 cannot fill ${count} questions from ${candidates.length} candidates without repeats`);
    const selected = deterministicShuffle(candidates, `${seed}:${language}:${difficulty}:${questionId ?? "ALL"}`).slice(0, count);
    const result = selected.map((q) => ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      sourceQuestionId: q.englishQuestionId,
      packageId: WHI_002_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: q.questionFamily,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "World History",
      subtopic: "Renaissance, Reformation, Scientific Revolution, and Exploration",
      language,
      locale,
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
      registrationAuthorityId: WHI_002_CP002_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "REVIEW_REQUIRED",
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      productionReleased: false,
    }));
    return { questions: result, generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: WHI_002_QUESTION_STUDIO_PACKAGE_ID_V1,
      runtimeMode: WHI_002_CP002_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_002_CP002_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "REVIEW_REQUIRED",
      language,
      locale,
      difficulty,
      cpId,
      seed,
      requestedCount: count,
      candidateCount: candidates.length,
      corpusQuestionCount: corpus.length,
      studentPublicationAuthorized: false,
    } };
  },
};
