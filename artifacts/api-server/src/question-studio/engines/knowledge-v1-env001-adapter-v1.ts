import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import {
  generateEnvCp001LocalizedReviewV1,
  generateEnvCp002LocalizedReviewV1,
  generateEnvCp003LocalizedReviewV1,
  generateEnvCp004LocalizedReviewV1,
  generateEnvCp005LocalizedReviewV1,
  generateEnvCp006LocalizedReviewV1,
  generateEnvCp007LocalizedReviewV1,
  generateEnvCp008LocalizedReviewV1,
  generateEnvCp009LocalizedReviewV1,
  generateEnvCp010LocalizedReviewV1,
  generateEnvCp011LocalizedReviewV1,
  generateEnvCp012LocalizedReviewV1,
  generateEnvCp013LocalizedReviewV1,
  generateEnvCp014LocalizedReviewV1,
  generateEnvCp015LocalizedReviewV1,
  generateEnvCp016LocalizedReviewV1,
  generateEnvCp017LocalizedReviewV1,
  generateEnvCp018LocalizedReviewV1,
  generateEnvCp019LocalizedReviewV1,
  generateEnvCp020LocalizedReviewV1,
  type EnvLocaleV1,
  type EnvLocalizedQuestionV1,
} from "../../knowledge-v1/environment-ecology/localization-v1/env-localization-generator-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "ENV-001" as const;
export const ENV_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ENV_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "ENV-001-MULTILINGUAL-CONTENT-FROZEN-2026-09-20" as const;
export const ENV_001_REVISION_POLICY_V1 = "SOURCE_LOCALIZATION_GENERATOR_ONLY" as const;

type EnvGenerator = (locale: EnvLocaleV1) => EnvLocalizedQuestionV1[];

const CP_GENERATORS = [
  ["ENV-CP-001", generateEnvCp001LocalizedReviewV1, 48],
  ["ENV-CP-002", generateEnvCp002LocalizedReviewV1, 60],
  ["ENV-CP-003", generateEnvCp003LocalizedReviewV1, 48],
  ["ENV-CP-004", generateEnvCp004LocalizedReviewV1, 48],
  ["ENV-CP-005", generateEnvCp005LocalizedReviewV1, 48],
  ["ENV-CP-006", generateEnvCp006LocalizedReviewV1, 48],
  ["ENV-CP-007", generateEnvCp007LocalizedReviewV1, 48],
  ["ENV-CP-008", generateEnvCp008LocalizedReviewV1, 60],
  ["ENV-CP-009", generateEnvCp009LocalizedReviewV1, 48],
  ["ENV-CP-010", generateEnvCp010LocalizedReviewV1, 48],
  ["ENV-CP-011", generateEnvCp011LocalizedReviewV1, 48],
  ["ENV-CP-012", generateEnvCp012LocalizedReviewV1, 48],
  ["ENV-CP-013", generateEnvCp013LocalizedReviewV1, 48],
  ["ENV-CP-014", generateEnvCp014LocalizedReviewV1, 60],
  ["ENV-CP-015", generateEnvCp015LocalizedReviewV1, 60],
  ["ENV-CP-016", generateEnvCp016LocalizedReviewV1, 60],
  ["ENV-CP-017", generateEnvCp017LocalizedReviewV1, 48],
  ["ENV-CP-018", generateEnvCp018LocalizedReviewV1, 48],
  ["ENV-CP-019", generateEnvCp019LocalizedReviewV1, 48],
  ["ENV-CP-020", generateEnvCp020LocalizedReviewV1, 48],
] as const satisfies readonly (readonly [string, EnvGenerator, number])[];

const cpIds = Object.freeze(CP_GENERATORS.map(([cpId]) => cpId));
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;
const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

function localeRows(locale: EnvLocaleV1): readonly EnvLocalizedQuestionV1[] {
  const rows = CP_GENERATORS.flatMap(([cpId, generate, expected]) => {
    const batch = generate(locale);
    if (batch.length !== expected) {
      throw new Error(`${cpId}/${locale} Question Studio freeze expected ${expected} questions; found ${batch.length}`);
    }
    for (const question of batch) {
      if (question.chapterId !== "ENV-001" || question.cpId !== cpId) {
        throw new Error(`${question.questionId}: Environment chapter/CP invariant failed`);
      }
      if (question.reviewOnly !== true || question.runtimeRegistered !== false) {
        throw new Error(`${question.questionId}: source localization must remain review-only and unregistered`);
      }
      if (!/^ENV-\d{3}-QL-\d{3}$/.test(question.qlId)) {
        throw new Error(`${question.questionId}: invalid Environment QL ID ${question.qlId}`);
      }
      if (!["Easy", "Medium", "Hard"].includes(question.difficulty)) {
        throw new Error(`${question.questionId}: invalid difficulty ${question.difficulty}`);
      }
      if (!question.stem.trim() || !question.explanation.trim()) {
        throw new Error(`${question.questionId}: learner text is incomplete`);
      }
      if (question.options.length !== 4 || new Set(question.options).size !== 4) {
        throw new Error(`${question.questionId}: options must contain four unique values`);
      }
      if (question.correctIndex < 0 || question.correctIndex >= 4 ||
          question.options[question.correctIndex] !== question.canonicalAnswer) {
        throw new Error(`${question.questionId}: answer/options invariant failed`);
      }
    }
    return batch;
  });
  if (rows.length !== 1020) {
    throw new Error(`ENV-001/${locale} Question Studio freeze requires 1020 questions; found ${rows.length}`);
  }
  return Object.freeze(rows);
}

const corpusByLocale = Object.freeze({
  en: localeRows("en"),
  hi: localeRows("hi"),
  pa: localeRows("pa"),
});

const englishCorpus = corpusByLocale.en;
const qlIds = Object.freeze([...new Set(englishCorpus.map((question) => question.qlId))].sort());

if (cpIds.length !== 20 || new Set(cpIds).size !== 20) {
  throw new Error("ENV-001 Question Studio registration requires 20 unique CPs");
}
if (qlIds.length !== 255) {
  throw new Error(`ENV-001 Question Studio registration requires 255 frozen QLs; found ${qlIds.length}`);
}
if (new Set(englishCorpus.map((question) => question.questionId)).size !== englishCorpus.length) {
  throw new Error("ENV-001 English corpus contains duplicate question IDs");
}

const localizedByEnglishId = Object.freeze({
  en: new Map(corpusByLocale.en.map((q) => [q.localizationV1.englishQuestionId, q] as const)),
  hi: new Map(corpusByLocale.hi.map((q) => [q.localizationV1.englishQuestionId, q] as const)),
  pa: new Map(corpusByLocale.pa.map((q) => [q.localizationV1.englishQuestionId, q] as const)),
});

for (const english of englishCorpus) {
  for (const locale of ["hi", "pa"] as const) {
    const localized = localizedByEnglishId[locale].get(english.questionId);
    if (!localized) throw new Error(`${english.questionId}: missing ${locale} localization`);
    if (
      localized.cpId !== english.cpId ||
      localized.qlId !== english.qlId ||
      localized.difficulty !== english.difficulty ||
      localized.correctIndex !== english.correctIndex
    ) {
      throw new Error(`${english.questionId}: ${locale} semantic routing invariant failed`);
    }
  }
}

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): EnvLocaleV1 {
  if (!language) return "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`ENV-001 language ${String(language)} is not supported`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 10;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("ENV-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("ENV-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compact = raw.match(/^ENV-CP(\d{3})$/);
  if (compact) return `ENV-CP-${compact[1]}`;
  const chapterScoped = raw.match(/^ENV-001-CP-(\d{3})$/);
  if (chapterScoped) return `ENV-CP-${chapterScoped[1]}`;
  return raw;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map(normalizeSelector)
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value as typeof cpIds[number]));
  const unknown = values.filter(
    (value) =>
      value !== ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value as typeof cpIds[number]),
  );
  if (unknown.length) throw new Error(`Unknown ENV-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting ENV-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting ENV-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? englishCorpus.find((question) => question.qlId === qlId)?.cpId : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting ENV-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }
  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const ENV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Environment & Ecology",
  subtopic: "Complete Chapter",
  label: "Static GK · Environment & Ecology · ENV-CP-001–020 · EN/HI/PA Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: ENV_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [ENV_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: ENV_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    multilingualReviewApproved: true,
    chapterContentComplete: true,
    englishEditorialComplete: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    revisionPolicy: ENV_001_REVISION_POLICY_V1,
    permanentQlIds: [...qlIds],
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    questionsPerLanguage: 1020,
    multilingualSurfaceCount: 3060,
    supportedLocales: ["en-IN", "hi-IN", "pa-IN"],
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEnv001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  const topicMatch = ["environment & ecology", "environment and ecology", "environment", "ecology"].includes(topic);

  return (
    values.some((value) => value.startsWith("ENV-CP-") || /^ENV-\d{3}-QL-\d{3}$/.test(value)) ||
    (subject === "static gk" && topicMatch && (!subtopic || subtopic === "complete chapter")) ||
    (topicMatch && (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1Env001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [ENV_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 ENV-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== ENV_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`ENV-001 only supports ${ENV_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "env-001-question-studio-frozen-v1";

    const candidates = englishCorpus.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) {
      throw new Error(`ENV-001 selectors produced no ${difficulty} frozen questions`);
    }
    if (count > candidates.length) {
      throw new Error(
        `ENV-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`,
      );
    }

    const selectedEnglish = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const localizedMap = localizedByEnglishId[language];
    const locale = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";

    const questions = selectedEnglish.map((english) => {
      const question = localizedMap.get(english.questionId);
      if (!question) throw new Error(`${english.questionId}: missing ${language} Question Studio surface`);
      return {
        ...lifecycle,
        id: question.questionId,
        questionId: question.questionId,
        sourceQuestionId: english.questionId,
        packageId: ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        patternId: question.qlId,
        qlId: question.qlId,
        qlName: question.qlName,
        cpId: question.cpId,
        chapterId: "ENV-001",
        subject: "Static GK",
        topic: "Environment & Ecology",
        subtopic: "Complete Chapter",
        language,
        locale,
        stem: question.stem,
        text: question.stem,
        options: [...question.options],
        correctIndex: question.correctIndex,
        correct: question.correctIndex,
        canonicalAnswer: question.canonicalAnswer,
        answer: question.canonicalAnswer,
        explanation: question.explanation,
        difficulty: question.difficulty,
        difficultyLabel: question.difficulty,
        sourceIds: [...question.sourceIds],
        sourceFactIds: [...question.sourceFactIds],
        localizationV1: question.localizationV1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENV_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        multilingualReviewApproved: true,
        chapterContentComplete: true,
        questionStudioDiscoverable: true,
        questionStudioGenerationEnabled: true,
        reviewOnly: true,
        runtimeRegistered: true,
        readOnly: true,
        revisionPolicy: ENV_001_REVISION_POLICY_V1,
        productionReleased: false,
      };
    });

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: ENV_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: ENV_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ENV_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        multilingualReviewApproved: true,
        chapterContentComplete: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        revisionPolicy: ENV_001_REVISION_POLICY_V1,
        language,
        locale,
        difficulty,
        cpId: cpId ?? null,
        qlId: qlId ?? null,
        seed,
        requestedCount: count,
        candidateCount: candidates.length,
        questionsPerLanguage: 1020,
        multilingualSurfaceCount: 3060,
        cpCount: cpIds.length,
        qlCount: qlIds.length,
      },
    };
  },
};
