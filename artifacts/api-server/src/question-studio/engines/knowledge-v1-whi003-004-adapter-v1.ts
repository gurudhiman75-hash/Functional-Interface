import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import cp003en from "../../knowledge-v1/world-history-cp003-en-v1.json";
import cp003hi from "../../knowledge-v1/world-history-cp003-hi-v1.json";
import cp003pa from "../../knowledge-v1/world-history-cp003-pa-v1.json";
import cp004en from "../../knowledge-v1/world-history-cp004-en-v1.json";
import cp004hi from "../../knowledge-v1/world-history-cp004-hi-v1.json";
import cp004pa from "../../knowledge-v1/world-history-cp004-pa-v1.json";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 as lifecycle } from "../standard-lifecycle";

type RawQuestion = {
  questionId: string;
  englishQuestionId: string;
  checkpointId: string;
  factId: string;
  language: string;
  difficulty: string;
  questionFamily: string;
  stem: string;
  options: Array<{ key: string; text: string }>;
  correctOption: string;
  explanation: string;
  sourceIds: string[];
  reviewOnly: boolean;
  runtimeRegistered: boolean;
};
type Question = {
  questionId: string;
  englishQuestionId: string;
  cpId: string;
  language: QuestionStudioLanguage;
  factId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  questionFamily: string;
  stem: string;
  options: string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceIds: string[];
};
type Config = {
  cp: "CP003" | "CP004";
  packageId: "WHI-003" | "WHI-004";
  title: string;
  pools: Readonly<Record<QuestionStudioLanguage, readonly RawQuestion[]>>;
};
const configs: readonly Config[] = [
  { cp: "CP003", packageId: "WHI-003", title: "Enlightenment and Atlantic Revolutions", pools: { en: cp003en as RawQuestion[], hi: cp003hi as RawQuestion[], pa: cp003pa as RawQuestion[] } },
  { cp: "CP004", packageId: "WHI-004", title: "French Revolution and Napoleonic Europe", pools: { en: cp004en as RawQuestion[], hi: cp004hi as RawQuestion[], pa: cp004pa as RawQuestion[] } },
];
const languages: readonly QuestionStudioLanguage[] = ["en", "hi", "pa"];
const difficulties = ["Easy", "Medium", "Hard"] as const;
const locales: Readonly<Record<QuestionStudioLanguage, string>> = { en: "en-IN", hi: "hi-IN", pa: "pa-IN" };

function normalize(config: Config, language: QuestionStudioLanguage): readonly Question[] {
  const rows = config.pools[language].map((q) => {
    const options = q.options.map((option) => option.text);
    const correctIndex = q.options.findIndex((option) => option.key === q.correctOption);
    if (correctIndex < 0) throw new Error(`${q.questionId}: missing keyed answer`);
    if (q.language !== language || q.reviewOnly !== true || q.runtimeRegistered !== false) throw new Error(`${q.questionId}: invalid language or review state`);
    return Object.freeze({
      questionId: q.questionId, englishQuestionId: q.englishQuestionId, cpId: q.checkpointId,
      language, factId: q.factId,
      difficulty: (q.difficulty[0]!.toUpperCase() + q.difficulty.slice(1).toLowerCase()) as Question["difficulty"],
      questionFamily: q.questionFamily, stem: q.stem, options, correctIndex,
      canonicalAnswer: options[correctIndex]!, explanation: q.explanation, sourceIds: [...q.sourceIds],
    });
  });
  if (rows.length !== 60 || new Set(rows.map((q) => q.questionId)).size !== 60) throw new Error(`${config.cp} ${language} must have 60 unique questions`);
  if (difficulties.some((d) => rows.filter((q) => q.difficulty === d).length !== ({ Easy: 18, Medium: 30, Hard: 12 }[d]))) throw new Error(`${config.cp} ${language} has an incorrect difficulty mix`);
  for (const q of rows) {
    if (q.cpId !== `WHI-001-${config.cp}` || q.language !== language || q.options.length !== 4 || new Set(q.options).size !== 4 || !q.sourceIds.length) {
      throw new Error(`${q.questionId}: invalid checkpoint, language, options, or source provenance`);
    }
  }
  return Object.freeze(rows);
}

const corpora = new Map<Config, Readonly<Record<QuestionStudioLanguage, readonly Question[]>>>();
for (const config of configs) {
  const normalized = { en: normalize(config, "en"), hi: normalize(config, "hi"), pa: normalize(config, "pa") };
  const englishById = new Map(normalized.en.map((q) => [q.questionId, q]));
  for (const language of ["hi", "pa"] as const) {
    for (const q of normalized[language]) {
      const english = englishById.get(q.englishQuestionId);
      if (!english || english.correctIndex !== q.correctIndex || english.difficulty !== q.difficulty) {
        throw new Error(`${q.questionId}: English answer or difficulty parity mismatch`);
      }
    }
  }
  corpora.set(config, normalized);
}

const packages: readonly QuestionStudioPackageDefinition[] = configs.map((config) => ({
  engineId: "knowledge-v1", packageId: config.packageId, subject: "Static GK", topic: "World History",
  subtopic: config.title, label: `Static GK · World History · ${config.title}`, enabled: true,
  cpIds: [`WHI-001-${config.cp}`], supportedLanguages: [...languages], supportedDifficulties: [...difficulties],
  difficultyFilterSupported: true, runtimeMode: "review-only", supportedRuntimeModes: ["review-only"],
  lifecycleId: lifecycle.lifecycleId, lifecycleStage: lifecycle.stage, reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
  manualApprovalRequired: lifecycle.manualApprovalRequired, questionBankStatus: lifecycle.questionBankStatus,
  questionBankWritable: lifecycle.questionBankWritable, testEligibility: lifecycle.testEligibility,
  testEligible: lifecycle.testEligible, mockTestEligible: lifecycle.mockTestEligible,
  publiclyPublishable: lifecycle.publiclyPublishable, automaticStudentPublication: lifecycle.automaticStudentPublication,
  productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  metadata: {
    ...lifecycle, registrationAuthorityId: `WHI-001-${config.cp}-EN-HI-PA-REVIEW-CORPORA-V1`,
    authoringReviewApproved: true, localizationStatus: "REVIEW_REQUIRED", reviewOnly: true, immutableCorpus: true,
    questionCountPerLanguage: 60, supportedDifficulties: [...difficulties], nativeLanguageProofreadingRequired: true,
    correctIndexAndDifficultyParityRequired: true, permanentQlIdsAllocated: false, studentPublicationAuthorized: false,
  },
}));

function selectedConfig(request: QuestionStudioGenerationRequest): Config | undefined {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return configs.find((config) => config.packageId === packageId);
  const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map((value) => String(value ?? "").trim().toUpperCase()).filter(Boolean);
  return configs.find((config) => selectors.some((value) => value === `WHI-001-${config.cp}` || value.startsWith(`WHI-${config.cp}-Q`)));
}
export function isWhi003004QuestionStudioRequestV1(request: QuestionStudioGenerationRequest): boolean {
  return selectedConfig(request) !== undefined;
}

export const knowledgeV1Whi003004QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",
  listPackages() { return [...packages]; },
  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const config = selectedConfig(request);
    if (!config) throw new Error("WHI-003 or WHI-004 package or checkpoint selector is required");
    if (request.packageId && String(request.packageId).trim().toUpperCase() !== config.packageId) throw new Error(`${config.packageId} cannot generate the requested package`);
    if (request.runtimeMode && request.runtimeMode !== "review-only") throw new Error(`${config.packageId} only supports review-only runtime`);
    const language = request.language ?? "en";
    if (!languages.includes(language)) throw new Error(`${config.packageId} does not support language ${String(language)}`);
    const difficulty = request.difficulty ?? "Mixed";
    if (!(difficulty === "Mixed" || difficulties.includes(difficulty as typeof difficulties[number]))) throw new Error("Difficulty must be Easy, Medium, Hard, or Mixed");
    const count = request.count ?? 5;
    if (!Number.isInteger(count) || count < 1 || count > 50) throw new Error(`${config.packageId} review batches require count between 1 and 50`);
    const selectors = [request.patternId, request.canonicalProblemId, request.questionLanguageId]
      .map((value) => String(value ?? "").trim().toUpperCase()).filter((value) => value.startsWith(`WHI-${config.cp}-Q`));
    if (new Set(selectors).size > 1) throw new Error("Conflicting question selectors");
    const questionId = selectors[0];
    const corpus = corpora.get(config)![language];
    if (questionId && !corpora.get(config)!.en.some((q) => q.questionId.toUpperCase() === questionId)) throw new Error(`Unknown ${config.cp} question selector ${questionId}`);
    const candidates = corpus.filter((q) => (!questionId || q.englishQuestionId.toUpperCase() === questionId) && (difficulty === "Mixed" || q.difficulty === difficulty));
    if (!candidates.length || count > candidates.length) throw new Error(`${config.packageId} cannot fill ${count} questions from ${candidates.length} candidates without repeats`);
    const seed = request.seed?.trim() || `${config.cp.toLowerCase()}-review-v1`;
    const selected = deterministicShuffle(candidates, `${seed}:${language}:${difficulty}:${questionId ?? "ALL"}`).slice(0, count);
    const authority = `WHI-001-${config.cp}-EN-HI-PA-REVIEW-CORPORA-V1`;
    const questions = selected.map((q) => ({
      ...lifecycle, id: q.questionId, questionId: q.questionId, sourceQuestionId: q.englishQuestionId,
      packageId: config.packageId, patternId: q.questionFamily, cpId: q.cpId, subject: "Static GK", topic: "World History",
      subtopic: config.title, language, locale: locales[language], stem: q.stem, text: q.stem, options: [...q.options],
      correctIndex: q.correctIndex, correct: q.correctIndex, canonicalAnswer: q.canonicalAnswer, answer: q.canonicalAnswer,
      explanation: q.explanation, difficulty: q.difficulty, difficultyLabel: q.difficulty, questionFamily: q.questionFamily,
      sourceIds: [...q.sourceIds], factId: q.factId, registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: authority,
      authoringReviewApproved: true, localizationStatus: "REVIEW_REQUIRED", nativeLanguageProofreadingRequired: language !== "en",
      reviewOnly: true, runtimeRegistered: true, readOnly: true, productionReleased: false,
    }));
    return { questions, generationContext: {
      ...lifecycle, engineId: "knowledge-v1", packageId: config.packageId, runtimeMode: "review-only",
      registrationStatus: "REGISTERED_REVIEW_ONLY", registrationAuthorityId: authority, authoringReviewApproved: true,
      localizationStatus: "REVIEW_REQUIRED", nativeLanguageProofreadingRequired: language !== "en", language, locale: locales[language],
      difficulty, cpId: `WHI-001-${config.cp}`, seed, requestedCount: count, candidateCount: candidates.length,
      corpusQuestionCount: corpus.length, studentPublicationAuthorized: false,
    } };
  },
};
