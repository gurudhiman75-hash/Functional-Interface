import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import {
  HIS_001_FINAL_CP_IDS_V1,
  HIS_001_FINAL_MULTILINGUAL_CORPUS_V1,
  HIS_001_FINAL_MULTILINGUAL_FREEZE_ID_V1,
  HIS_001_FINAL_QL_IDS_V1,
} from "../../knowledge-v1/indian-history/localization-v1/his-001-final-multilingual-corpus-v1";
import type {
  HisLocaleV1,
  HisLocalizedQuestionV1,
} from "../../knowledge-v1/indian-history/localization-v1/his-localization-types-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "HIS-001" as const;
export const HIS_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const HIS_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  HIS_001_FINAL_MULTILINGUAL_FREEZE_ID_V1;
export const HIS_001_REVISION_POLICY_V1 = "SOURCE_LOCALIZATION_AUTHORITY_ONLY" as const;

const languages: readonly HisLocaleV1[] = ["en", "hi", "pa"] as const;
const locales: Record<HisLocaleV1, string> = {
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
};

const corpusByLanguage = HIS_001_FINAL_MULTILINGUAL_CORPUS_V1;
export const HIS_001_QUESTION_STUDIO_CORPUS_V1 = corpusByLanguage;

const english = corpusByLanguage.en;
const cpIds = [...HIS_001_FINAL_CP_IDS_V1];
const qlIds = [...HIS_001_FINAL_QL_IDS_V1];

for (const locale of languages) {
  const corpus = corpusByLanguage[locale];
  if (corpus.length !== 1434) {
    throw new Error(`HIS-001 ${locale} Question Studio corpus must contain 1434 questions; found ${corpus.length}`);
  }
  if (new Set(corpus.map((q) => q.questionId)).size !== corpus.length) {
    throw new Error(`HIS-001 ${locale} corpus contains duplicate question IDs`);
  }
  if (new Set(corpus.map((q) => q.cpId)).size !== 24) {
    throw new Error(`HIS-001 ${locale} corpus must expose 24 CPs`);
  }
  if (new Set(corpus.map((q) => q.qlId)).size !== 239) {
    throw new Error(`HIS-001 ${locale} corpus must expose 239 QLs`);
  }

  for (const question of corpus) {
    if (question.reviewOnly !== true || question.runtimeRegistered !== false) {
      throw new Error(`${question.questionId}: frozen History lifecycle mismatch`);
    }
    if (question.options.length !== 4 || new Set(question.options).size !== 4) {
      throw new Error(`${question.questionId}: options must contain four unique values`);
    }
    if (question.options[question.correctIndex] !== question.canonicalAnswer) {
      throw new Error(`${question.questionId}: canonical answer/index mismatch`);
    }
  }

  for (const qlId of qlIds) {
    const count = corpus.filter((q) => q.qlId === qlId).length;
    if (count !== 6) throw new Error(`${qlId}/${locale} must expose six frozen payloads; found ${count}`);
  }
}

if (cpIds.length !== 24) throw new Error(`HIS-001 requires 24 CPs; found ${cpIds.length}`);
if (qlIds.length !== 239) throw new Error(`HIS-001 requires 239 QLs; found ${qlIds.length}`);

for (let i = 0; i < english.length; i += 1) {
  const en = english[i]!;
  for (const locale of ["hi", "pa"] as const) {
    const localized = corpusByLanguage[locale][i]!;
    if (localized.localizationV1.englishQuestionId !== en.questionId) {
      throw new Error(`${localized.questionId}: localization/English identity mismatch`);
    }
    if (
      localized.cpId !== en.cpId ||
      localized.qlId !== en.qlId ||
      localized.difficulty !== en.difficulty ||
      localized.correctIndex !== en.correctIndex
    ) {
      throw new Error(`${localized.questionId}: frozen localization parity mismatch`);
    }
  }
}

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): HisLocaleV1 {
  if (!language) return "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`HIS-001 language ${String(language)} is not supported`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("HIS-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("HIS-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compactCp = raw.match(/^HIS-CP(\d{3})$/);
  return compactCp ? `HIS-CP-${compactCp[1]}` : raw;
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
      value !== HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value as typeof cpIds[number]),
  );

  if (unknown.length) throw new Error(`Unknown HIS-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting HIS-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting HIS-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? english.find((q) => q.qlId === qlId)?.cpId : undefined;

  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting HIS-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }

  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const HIS_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "Indian History",
  subtopic: "Complete Chapter",
  label: "Static GK · Indian History · HIS-CP-001–024 Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: HIS_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [HIS_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: HIS_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    chapterContentComplete: true,
    coverageGapAuditComplete: true,
    multilingualContentFrozen: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    revisionPolicy: HIS_001_REVISION_POLICY_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    questionsPerLanguage: 1434,
    multilingualSurfaceCount: 4302,
    payloadsPerPermanentQlPerLanguage: 6,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isHis001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  const historyTopics = ["history", "indian history"];

  return (
    values.some((value) => value.startsWith("HIS-CP-") || qlIds.includes(value)) ||
    (subject === "static gk" && historyTopics.includes(topic) && (!subtopic || subtopic === "complete chapter")) ||
    (historyTopics.includes(topic) && (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1His001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [HIS_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 HIS-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== HIS_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`HIS-001 only supports ${HIS_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "his-001-question-studio-multilingual-freeze-v1";
    const corpus = corpusByLanguage[language];

    const candidates = corpus.filter(
      (question:HisLocalizedQuestionV1) =>
        (!cpId || question.cpId === cpId) &&
        (!qlId || question.qlId === qlId) &&
        (difficulty === "Mixed" || question.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`HIS-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(
        `HIS-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`,
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
      packageId: HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: question.qlId,
      qlId: question.qlId,
      qlName: question.qlName,
      cpId: question.cpId,
      subject: "Static GK",
      topic: "Indian History",
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
      registrationAuthorityId: HIS_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      multilingualContentFrozen: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      revisionPolicy: HIS_001_REVISION_POLICY_V1,
      productionReleased: false,
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: HIS_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: HIS_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: HIS_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        chapterContentComplete: true,
        coverageGapAuditComplete: true,
        multilingualContentFrozen: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        revisionPolicy: HIS_001_REVISION_POLICY_V1,
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
