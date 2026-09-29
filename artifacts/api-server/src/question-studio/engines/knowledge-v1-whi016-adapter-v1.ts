import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import en from "../../knowledge-v1/world-history-cp016-en-v1.json";
import hi from "../../knowledge-v1/world-history-cp016-hi-v1.json";
import pa from "../../knowledge-v1/world-history-cp016-pa-v1.json";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const WHI_001_CP016_PACKAGE_ID_V1 = "WHI-001-CP016" as const;
export const WHI_001_CP016_RUNTIME_MODE_V1 = "review-only" as const;
export const WHI_001_CP016_REGISTRATION_AUTHORITY_V1 = "WHI-001-CP016-APPROVED-CUMULATIVE-REVIEW-V1" as const;
export const WHI_001_CP016_REVISION_POLICY_V1 = "REVISE_SOURCE_CORPUS_AND_RELOCALIZE_ALL_LANGUAGES" as const;

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const languages: readonly QuestionStudioLanguage[] = ["en", "hi", "pa"];
const locales: Readonly<Record<QuestionStudioLanguage, string>> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };
const cpId = "WHI-001-CP016";

type RawQuestion = {
  questionId: string;
  englishQuestionId: string;
  checkpointId: string;
  language: string;
  difficulty: string;
  questionFamily: string;
  stem: string;
  options: Array<{ key: string; text: string }>;
  correctOption: string;
  explanation: string;
  sourceIds: string[];
  originCheckpointId: string;
  originQuestionId: string;
  originFactId: string;
  originSourceIds: string[];
  factId: string;
  reviewOnly: boolean;
  runtimeRegistered: boolean;
};
type LocalizedQuestion = {
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
  factId: string;
  originCheckpointId: string;
  originQuestionId: string;
  originFactId: string;
  originSourceIds: string[];
};

function normalizeCorpus(rows: readonly RawQuestion[], language: QuestionStudioLanguage): readonly LocalizedQuestion[] {
  return Object.freeze(rows.map((q) => {
    const correctIndex = q.options.findIndex((option) => option.key === q.correctOption);
    const options = q.options.map((option) => option.text);
    if (correctIndex < 0) throw new Error(`${q.questionId}: missing keyed answer`);
    return Object.freeze({
      questionId: q.questionId,
      englishQuestionId: q.englishQuestionId,
      cpId: q.checkpointId,
      language,
      difficulty: (q.difficulty[0]!.toUpperCase() + q.difficulty.slice(1).toLowerCase()) as LocalizedQuestion["difficulty"],
      questionFamily: q.questionFamily,
      stem: q.stem,
      options,
      correctIndex,
      canonicalAnswer: options[correctIndex]!,
      explanation: q.explanation,
      sourceIds: [...q.sourceIds],
      factId: q.factId,
      originCheckpointId: q.originCheckpointId,
      originQuestionId: q.originQuestionId,
      originFactId: q.originFactId,
      originSourceIds: [...q.originSourceIds],
    });
  }));
}

const corpusByLanguage = Object.freeze({
  en: normalizeCorpus(en as RawQuestion[], "en"),
  hi: normalizeCorpus(hi as RawQuestion[], "hi"),
  pa: normalizeCorpus(pa as RawQuestion[], "pa"),
});
const english = corpusByLanguage.en;

for (const language of languages) {
  const corpus = corpusByLanguage[language];
  if (corpus.length !== 60) throw new Error(`WHI-001-CP016 ${language} corpus must contain 60 items`);
  if (new Set(corpus.map((q) => q.questionId)).size !== corpus.length) throw new Error(`WHI-001-CP016 ${language} has duplicate question IDs`);
  for (const q of corpus) {
    if (q.cpId !== cpId || q.language !== language || q.options.length !== 4 || new Set(q.options).size !== 4 || !q.sourceIds.length) {
      throw new Error(`${q.questionId}: invalid checkpoint, language, choices, or source provenance`);
    }
    if (q.options[q.correctIndex] !== q.canonicalAnswer) throw new Error(`${q.questionId}: answer key mismatch`);
  }
}
for (let i = 0; i < english.length; i += 1) {
  const canonical = english[i]!;
  for (const language of ["hi", "pa"] as const) {
    const localized = corpusByLanguage[language][i]!;
    if (localized.englishQuestionId !== canonical.questionId || localized.correctIndex !== canonical.correctIndex || localized.difficulty !== canonical.difficulty || localized.sourceIds.join("|") !== canonical.sourceIds.join("|")) {
      throw new Error(`${localized.questionId}: identity, source, answer-position, or difficulty parity mismatch`);
    }
  }
}

const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;
export const WHI_001_CP016_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: WHI_001_CP016_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "World History",
  subtopic: "Cumulative Review",
  label: "Static GK · World History · Cumulative Review (CP016)",
  enabled: true,
  cpIds: [cpId],
  supportedLanguages: [...languages],
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: WHI_001_CP016_RUNTIME_MODE_V1,
  supportedRuntimeModes: [WHI_001_CP016_RUNTIME_MODE_V1],
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
    registrationAuthorityId: WHI_001_CP016_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    localizationStatus: "APPROVED_FOR_REVIEW",
    reviewOnly: true,
    runtimeRegistered: false,
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
  throw new Error(`WHI-001-CP016 does not support language ${String(language)}`);
}
function normalizeCount(count: number | undefined): number {
  const value = count ?? 5;
  if (!Number.isInteger(value) || value < 1 || value > 50) throw new Error("WHI-001-CP016 review batches require count between 1 and 50");
  return value;
}
function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]): "Mixed" | "Easy" | "Medium" | "Hard" {
  if (!difficulty || difficulty === "Mixed") return "Mixed";
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("WHI-001-CP016 difficulty must be Easy, Medium, Hard, or Mixed");
}
function selectorValues(request: QuestionStudioGenerationRequest): string[] {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase())
    .filter(Boolean);
}
function normalizeQuestionId(value: string): string | undefined {
  const match = value.match(/^(WHI-CP016-Q\d{3})(?:-(?:HI|PA))?$/);
  return match?.[1];
}
function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const selectors = selectorValues(request);
  const known = new Set([WHI_001_CP016_PACKAGE_ID_V1, cpId, ...english.map((q) => q.questionId.toUpperCase())]);
  const questionIds = selectors.map(normalizeQuestionId).filter((value): value is string => Boolean(value));
  const unknown = selectors.filter((value) => !known.has(value) && !normalizeQuestionId(value));
  if (unknown.length) throw new Error(`Unknown WHI-001-CP016 selector ${unknown[0]}`);
  if (new Set(questionIds).size > 1) throw new Error("Conflicting WHI-001-CP016 question selectors");
  return { questionId: questionIds[0] };
}

export function isWhi016QuestionStudioRequestV1(request: QuestionStudioGenerationRequest): boolean {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === WHI_001_CP016_PACKAGE_ID_V1;
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  return selectorValues(request).some((value) => value.startsWith("WHI-CP016-")) ||
    (topic === "world history" && subtopic === "cumulative review");
}

export const knowledgeV1Whi016QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return [WHI_001_CP016_REVIEW_ONLY_PACKAGE_V1]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== WHI_001_CP016_PACKAGE_ID_V1) throw new Error(`WHI-001-CP016 adapter cannot generate package ${packageId}`);
    if (request.runtimeMode && request.runtimeMode !== WHI_001_CP016_RUNTIME_MODE_V1) throw new Error("WHI-001-CP016 only supports review-only runtime");
    const language = normalizeLanguage(request.language);
    const difficulty = normalizeDifficulty(request.difficulty);
    const count = normalizeCount(request.count);
    const { questionId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "whi-001-cp016-review-v1";
    const candidates = corpusByLanguage[language].filter((q) =>
      (!questionId || q.englishQuestionId.toUpperCase() === questionId) &&
      (difficulty === "Mixed" || q.difficulty === difficulty),
    );
    if (!candidates.length) throw new Error(`WHI-001-CP016 selectors produced no ${difficulty} questions`);
    if (count > candidates.length) throw new Error(`WHI-001-CP016 cannot fill ${count} questions from ${candidates.length} candidates without repeats`);
    const selected = deterministicShuffle(candidates, `${seed}:${language}:${difficulty}:${questionId ?? "ALL"}`).slice(0, count);
    const questions = selected.map((q) => ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      sourceQuestionId: q.englishQuestionId,
      packageId: WHI_001_CP016_PACKAGE_ID_V1,
      patternId: q.questionFamily,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "World History",
      subtopic: "Cumulative Review",
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
      factId: q.factId,
      sourceIds: [...q.sourceIds],
      originCheckpointId: q.originCheckpointId,
      originQuestionId: q.originQuestionId,
      originFactId: q.originFactId,
      originSourceIds: [...q.originSourceIds],
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_001_CP016_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "APPROVED_FOR_REVIEW",
      reviewOnly: true,
      runtimeRegistered: false,
      readOnly: true,
      revisionPolicy: WHI_001_CP016_REVISION_POLICY_V1,
      productionReleased: false,
    }));
    return { questions, generationContext: {
      ...lifecycle,
      engineId: "knowledge-v1",
      packageId: WHI_001_CP016_PACKAGE_ID_V1,
      runtimeMode: WHI_001_CP016_RUNTIME_MODE_V1,
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: WHI_001_CP016_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      localizationStatus: "APPROVED_FOR_REVIEW",
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
