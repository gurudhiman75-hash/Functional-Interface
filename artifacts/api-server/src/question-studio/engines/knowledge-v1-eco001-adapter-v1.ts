import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import { generateEcoCp001Cp028LocalizedReviewV1 } from "../../knowledge-v1/indian-economy/localization-v1/eco-localization-generator-v1";
import type {
  EcoLocaleV1,
  EcoLocalizedQuestionV1,
} from "../../knowledge-v1/indian-economy/localization-v1/eco-localization-types-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "ECO-001" as const;
export const ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "ECO-001-CP001-CP028-COVERAGE-GAP-CLOSURE-V1" as const;
export const ECO_001_REVISION_POLICY_V1 = "SOURCE_LOCALIZATION_AUTHORITY_ONLY" as const;

const languages: readonly EcoLocaleV1[] = ["en", "hi", "pa"] as const;
const locales: Readonly<Record<EcoLocaleV1, string>> = Object.freeze({
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
});

function materialize(locale: EcoLocaleV1): readonly EcoLocalizedQuestionV1[] {
  return Object.freeze(generateEcoCp001Cp028LocalizedReviewV1(locale));
}

const corpusByLanguage: Readonly<Record<EcoLocaleV1, readonly EcoLocalizedQuestionV1[]>> =
  Object.freeze({
    en: materialize("en"),
    hi: materialize("hi"),
    pa: materialize("pa"),
  });

export const ECO_001_QUESTION_STUDIO_CORPUS_V1 = corpusByLanguage;

const english = corpusByLanguage.en;
const cpIds = [...new Set(english.map((question) => question.cpId))].sort();
const qlIds = [...new Set(english.map((question) => question.qlId))].sort();

for (const locale of languages) {
  const corpus = corpusByLanguage[locale];
  if (corpus.length !== 1132) {
    throw new Error(`ECO-001 ${locale} Question Studio corpus must contain 1132 questions; found ${corpus.length}`);
  }
  if (new Set(corpus.map((question) => question.questionId)).size !== corpus.length) {
    throw new Error(`ECO-001 ${locale} corpus contains duplicate question IDs`);
  }

  for (const question of corpus) {
    if (question.reviewOnly !== true || question.runtimeRegistered !== false) {
      throw new Error(`${question.questionId}: frozen Economy lifecycle mismatch`);
    }
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      throw new Error(`${question.questionId}: options must contain four unique values`);
    }
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      throw new Error(`${question.questionId}: canonical answer/index mismatch`);
    }
  }
}

if (cpIds.length !== 28) {
  throw new Error(`ECO-001 Question Studio registration requires 28 frozen CPs; found ${cpIds.length}`);
}

for (let index = 0; index < english.length; index += 1) {
  const en = english[index]!;
  for (const locale of ["hi", "pa"] as const) {
    const localized = corpusByLanguage[locale][index]!;
    if (localized.localizationV1.englishQuestionId !== en.questionId) {
      throw new Error(`${localized.questionId}: localization/English identity mismatch`);
    }
    if (
      localized.cpId !== en.cpId ||
      localized.qlId !== en.qlId ||
      localized.difficulty !== en.difficulty ||
      localized.correctIndex !== en.correctIndex ||
      JSON.stringify(localized.sourceIds) !== JSON.stringify(en.sourceIds) ||
      JSON.stringify(localized.sourceFactIds) !== JSON.stringify(en.sourceFactIds)
    ) {
      throw new Error(`${localized.questionId}: frozen localization parity mismatch`);
    }
  }
}

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): EcoLocaleV1 {
  if (!language) return "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`ECO-001 language ${String(language)} is not supported`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("ECO-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("ECO-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compactCp = raw.match(/^ECO-CP(\d{3})$/);
  return compactCp ? `ECO-CP-${compactCp[1]}` : raw;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map(normalizeSelector)
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value as (typeof cpIds)[number]));
  const unknown = values.filter(
    (value) =>
      value !== ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value as (typeof cpIds)[number]),
  );

  if (unknown.length) throw new Error(`Unknown ECO-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting ECO-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting ECO-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? english.find((question) => question.qlId === qlId)?.cpId : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting ECO-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }

  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian Economy",
  subtopic: "Complete Chapter",
  label: "Static GK · Indian Economy · ECO-CP-001–028 Multilingual Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    chapterContentComplete: true,
    multilingualContentFrozen: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    localeIndependentSemanticDraw: true,
    revisionPolicy: ECO_001_REVISION_POLICY_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    questionsPerLanguage: 1132,
    multilingualSurfaceCount: 3396,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isEco001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();

  return (
    values.some((value) => value.startsWith("ECO-CP-") || qlIds.includes(value)) ||
    (subject === "static gk" && topic === "indian economy" && (!subtopic || subtopic === "complete chapter")) ||
    (topic === "indian economy" && (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1Eco001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [ECO_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 ECO-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`ECO-001 only supports ${ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "eco-001-question-studio-multilingual-freeze-v1";
    const corpus = corpusByLanguage[language];

    const candidates = corpus.filter(
      (question) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`ECO-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(
        `ECO-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`,
      );
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((question) => ({
      ...lifecycle,
      id: question.questionId,
      questionId: question.questionId,
      sourceQuestionId: question.localizationV1.englishQuestionId,
      packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: question.qlId,
      qlId: question.qlId,
      qlName: question.qlName,
      cpId: question.cpId,
      subject: "Static GK",
      topic: "Indian Economy",
      subtopic: "Complete Chapter",
      language,
      locale: locales[language],
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
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      multilingualContentFrozen: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      revisionPolicy: ECO_001_REVISION_POLICY_V1,
      productionReleased: false,
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: ECO_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: ECO_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: ECO_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        chapterContentComplete: true,
        multilingualContentFrozen: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        localeIndependentSemanticDraw: true,
        revisionPolicy: ECO_001_REVISION_POLICY_V1,
        language,
        locale: locales[language],
        difficulty,
        cpId: cpId ?? null,
        qlId: qlId ?? null,
        seed,
        requestedCount: count,
        candidateCount: candidates.length,
        corpusQuestionCount: corpus.length,
        cpCount: cpIds.length,
        qlCount: qlIds.length,
      },
    };
  },
};
