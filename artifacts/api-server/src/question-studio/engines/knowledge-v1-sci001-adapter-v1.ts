import { deterministicShuffle } from "../../knowledge-v1/deterministic";
import {
  generateScienceFinalLocalizedCorpusV1,
  SCI_001_FINAL_LOCALIZED_CP_IDS_V1,
  type ScienceFinalLocalizedQuestionV1,
  type ScienceLocaleV1,
} from "../../knowledge-v1/science/science-final-multilingual-corpus-v1";
import type {
  QuestionStudioEngineAdapter,
  QuestionStudioGenerationRequest,
  QuestionStudioGenerationResult,
  QuestionStudioLanguage,
  QuestionStudioPackageDefinition,
} from "../engine-types";
import { QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1 } from "../standard-lifecycle";

export const SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1 = "SCI-001" as const;
export const SCI_001_QUESTION_STUDIO_RUNTIME_MODE_V1 = "review-only" as const;
export const SCI_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1 =
  "SCI-001-FINAL-MULTILINGUAL-CLOSURE-V1" as const;
export const SCI_001_REVISION_POLICY_V1 = "SOURCE_LOCALIZATION_AUTHORITY_ONLY" as const;

const languages: readonly ScienceLocaleV1[] = ["en", "hi", "pa"] as const;
const locales: Readonly<Record<ScienceLocaleV1, string>> = Object.freeze({
  en: "en-IN",
  hi: "hi-IN",
  pa: "pa-IN",
});

function materialize(locale: ScienceLocaleV1): readonly ScienceFinalLocalizedQuestionV1[] {
  return Object.freeze(generateScienceFinalLocalizedCorpusV1(locale));
}

export const SCI_001_QUESTION_STUDIO_CORPUS_V1: Readonly<
  Record<ScienceLocaleV1, readonly ScienceFinalLocalizedQuestionV1[]>
> = Object.freeze({
  en: materialize("en"),
  hi: materialize("hi"),
  pa: materialize("pa"),
});

const english = SCI_001_QUESTION_STUDIO_CORPUS_V1.en;
const cpIds = [...SCI_001_FINAL_LOCALIZED_CP_IDS_V1];
const qlIds = [...new Set(english.map((q) => q.qlId))].sort();

for (const locale of languages) {
  const corpus = SCI_001_QUESTION_STUDIO_CORPUS_V1[locale];
  if (corpus.length !== 5280) {
    throw new Error(`SCI-001 ${locale} Question Studio corpus must contain 5280 questions; found ${corpus.length}`);
  }
  if (new Set(corpus.map((q) => q.questionId)).size !== corpus.length) {
    throw new Error(`SCI-001 ${locale} corpus contains duplicate question IDs`);
  }
  if (new Set(corpus.map((q) => q.cpId)).size !== 40) {
    throw new Error(`SCI-001 ${locale} corpus must cover 40 CPs`);
  }
  for (const q of corpus) {
    if (q.reviewOnly !== true || q.runtimeRegistered !== false) {
      throw new Error(`${q.questionId}: frozen Science lifecycle mismatch`);
    }
    if (q.options.length !== 4 || new Set(q.options).size !== 4) {
      throw new Error(`${q.questionId}: options must contain four unique values`);
    }
    if (q.options[q.correctIndex] !== q.canonicalAnswer) {
      throw new Error(`${q.questionId}: canonical answer/index mismatch`);
    }
  }
}

for (let index = 0; index < english.length; index += 1) {
  const en = english[index]!;
  for (const locale of ["hi", "pa"] as const) {
    const localized = SCI_001_QUESTION_STUDIO_CORPUS_V1[locale][index]!;
    if (localized.englishQuestionId !== en.questionId) {
      throw new Error(`${localized.questionId}: English identity mismatch`);
    }
    if (
      localized.cpId !== en.cpId ||
      localized.qlId !== en.qlId ||
      localized.difficulty !== en.difficulty ||
      localized.correctIndex !== en.correctIndex
    ) {
      throw new Error(`${localized.questionId}: frozen multilingual parity mismatch`);
    }
  }
}

const lifecycle = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;
const supportedLanguages: QuestionStudioLanguage[] = ["en", "hi", "pa"];
const supportedDifficulties = ["Easy", "Medium", "Hard"] as const;

function normalizeLanguage(language: QuestionStudioGenerationRequest["language"]): ScienceLocaleV1 {
  if (!language) return "en";
  if (language === "en" || language === "hi" || language === "pa") return language;
  throw new Error(`SCI-001 language ${String(language)} is not supported`);
}

function normalizeCount(count: number | undefined) {
  if (count == null) return 5;
  if (!Number.isInteger(count) || count < 1 || count > 50) {
    throw new Error("SCI-001 review batches require count between 1 and 50");
  }
  return count;
}

function normalizeDifficulty(difficulty: QuestionStudioGenerationRequest["difficulty"]) {
  if (!difficulty || difficulty === "Mixed") return "Mixed" as const;
  if (difficulty === "Easy" || difficulty === "Medium" || difficulty === "Hard") return difficulty;
  throw new Error("SCI-001 difficulty must be Easy, Medium, Hard, or Mixed");
}

function normalizeSelector(value: unknown) {
  const raw = String(value ?? "").trim().toUpperCase();
  const compactCp = raw.match(/^SCI-CP(\d{3})$/);
  return compactCp ? `SCI-CP-${compactCp[1]}` : raw;
}

function selectorValues(request: QuestionStudioGenerationRequest) {
  return [request.patternId, request.canonicalProblemId, request.questionLanguageId]
    .map(normalizeSelector)
    .filter(Boolean);
}

function normalizeSelectors(request: QuestionStudioGenerationRequest) {
  const values = selectorValues(request);
  const qlMatches = values.filter((value) => qlIds.includes(value));
  const cpMatches = values.filter((value) => cpIds.includes(value));
  const unknown = values.filter(
    (value) =>
      value !== SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1 &&
      !qlIds.includes(value) &&
      !cpIds.includes(value),
  );

  if (unknown.length) throw new Error(`Unknown SCI-001 selector ${unknown[0]}`);
  if (new Set(qlMatches).size > 1) throw new Error(`Conflicting SCI-001 QL selectors ${qlMatches.join(", ")}`);
  if (new Set(cpMatches).size > 1) throw new Error(`Conflicting SCI-001 CP selectors ${cpMatches.join(", ")}`);

  const qlId = qlMatches[0];
  const explicitCpId = cpMatches[0];
  const qlCpId = qlId ? english.find((q) => q.qlId === qlId)?.cpId : undefined;
  if (explicitCpId && qlCpId && explicitCpId !== qlCpId) {
    throw new Error(`Conflicting SCI-001 CP/QL selectors ${explicitCpId} and ${qlId}`);
  }

  return { qlId, cpId: explicitCpId ?? qlCpId };
}

export const SCI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1: QuestionStudioPackageDefinition = {
  engineId: "knowledge-v1",
  packageId: SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
  subject: "Static GK",
  topic: "General Science",
  subtopic: "Complete Chapter",
  label: "Static GK · General Science · SCI-CP-001–040 Frozen",
  enabled: true,
  cpIds: [...cpIds],
  supportedLanguages,
  supportedDifficulties: [...supportedDifficulties],
  difficultyFilterSupported: true,
  runtimeMode: SCI_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
  supportedRuntimeModes: [SCI_001_QUESTION_STUDIO_RUNTIME_MODE_V1],
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
    registrationAuthorityId: SCI_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
    authoringReviewApproved: true,
    chapterContentComplete: true,
    multilingualContentFrozen: true,
    reviewOnly: true,
    frozenCorpusOnly: true,
    immutableCorpus: true,
    deterministicSelection: true,
    selectionWithoutReplacement: true,
    revisionPolicy: SCI_001_REVISION_POLICY_V1,
    permanentQlIds: qlIds,
    qlCount: qlIds.length,
    cpIds: [...cpIds],
    cpCount: cpIds.length,
    questionsPerLanguage: english.length,
    multilingualSurfaceCount: english.length * languages.length,
    physicsQuestionsPerCp: 348,
    cp011ToCp040QuestionsPerCp: 60,
    supportedDifficulties: [...supportedDifficulties],
    productionDifficultyClaimsAuthorized: false,
  },
};

export function isSci001QuestionStudioRequestV1(request: QuestionStudioGenerationRequest) {
  const packageId = String(request.packageId ?? "").trim().toUpperCase();
  if (packageId) return packageId === SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1;

  const values = selectorValues(request);
  const subject = String(request.subject ?? "").trim().toLowerCase();
  const topic = String(request.topic ?? "").trim().toLowerCase();
  const subtopic = String(request.subtopic ?? "").trim().toLowerCase();
  const scienceTopic = ["science", "general science"].includes(topic);

  return (
    values.some((value) => value.startsWith("SCI-CP-") || qlIds.includes(value)) ||
    (subject === "static gk" && scienceTopic && (!subtopic || subtopic === "complete chapter")) ||
    (scienceTopic && (!subtopic || subtopic === "complete chapter"))
  );
}

export const knowledgeV1Sci001QuestionStudioAdapterV1: QuestionStudioEngineAdapter = {
  engineId: "knowledge-v1",

  listPackages() {
    return [SCI_001_STANDARD_REVIEW_ONLY_PACKAGE_V1];
  },

  async generate(request: QuestionStudioGenerationRequest): Promise<QuestionStudioGenerationResult> {
    const packageId = String(request.packageId ?? "").trim().toUpperCase();
    if (packageId && packageId !== SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1) {
      throw new Error(`knowledge-v1 SCI-001 adapter cannot generate package ${String(request.packageId)}`);
    }
    if (request.runtimeMode && request.runtimeMode !== SCI_001_QUESTION_STUDIO_RUNTIME_MODE_V1) {
      throw new Error(`SCI-001 only supports ${SCI_001_QUESTION_STUDIO_RUNTIME_MODE_V1} runtime`);
    }

    const language = normalizeLanguage(request.language);
    const count = normalizeCount(request.count);
    const difficulty = normalizeDifficulty(request.difficulty);
    const { qlId, cpId } = normalizeSelectors(request);
    const seed = request.seed?.trim() || "sci-001-question-studio-final-freeze-v1";
    const corpus = SCI_001_QUESTION_STUDIO_CORPUS_V1[language];

    const candidates = corpus.filter(
      (q) =>
        (!cpId || q.cpId === cpId) &&
        (!qlId || q.qlId === qlId) &&
        (difficulty === "Mixed" || q.difficulty === difficulty),
    );

    if (!candidates.length) throw new Error(`SCI-001 selectors produced no ${difficulty} frozen questions`);
    if (count > candidates.length) {
      throw new Error(
        `SCI-001 cannot fill ${count} questions from a ${candidates.length}-question frozen pool without repeats`,
      );
    }

    const selected = deterministicShuffle(
      candidates,
      `${seed}:${cpId ?? "ALL_CPS"}:${qlId ?? "ALL_QLS"}:${difficulty}`,
    ).slice(0, count);

    const questions = selected.map((q) => ({
      ...lifecycle,
      id: q.questionId,
      questionId: q.questionId,
      sourceQuestionId: q.englishQuestionId,
      packageId: SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
      patternId: q.qlId,
      qlId: q.qlId,
      qlName: q.qlName,
      cpId: q.cpId,
      subject: "Static GK",
      topic: "General Science",
      subtopic: "Complete Chapter",
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
      sourceIds: [...q.sourceIds],
      sourceFactIds: [...q.sourceFactIds],
      registrationStatus: "REGISTERED_REVIEW_ONLY",
      registrationAuthorityId: SCI_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
      authoringReviewApproved: true,
      multilingualContentFrozen: true,
      questionStudioDiscoverable: true,
      questionStudioGenerationEnabled: true,
      reviewOnly: true,
      runtimeRegistered: true,
      readOnly: true,
      revisionPolicy: SCI_001_REVISION_POLICY_V1,
      productionReleased: false,
    }));

    return {
      questions,
      generationContext: {
        ...lifecycle,
        engineId: "knowledge-v1",
        packageId: SCI_001_QUESTION_STUDIO_PACKAGE_ID_V1,
        runtimeMode: SCI_001_QUESTION_STUDIO_RUNTIME_MODE_V1,
        registrationStatus: "REGISTERED_REVIEW_ONLY",
        registrationAuthorityId: SCI_001_QUESTION_STUDIO_REGISTRATION_AUTHORITY_V1,
        authoringReviewApproved: true,
        chapterContentComplete: true,
        multilingualContentFrozen: true,
        reviewOnly: true,
        frozenCorpusOnly: true,
        immutableCorpus: true,
        deterministicSelection: true,
        selectionWithoutReplacement: true,
        revisionPolicy: SCI_001_REVISION_POLICY_V1,
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
