import { INT_001_WAVE03_QL_IDS, type Int001Wave03QlId } from "./int-001-wave03-permanent-allocation-v1";
import { generateInt001Wave05EnglishFrozenQuestion, INT_001_WAVE05_ENGLISH_FREEZE_VERSION } from "./int-001-wave05-english-freeze-v1";
import {
  generateInt001Wave05LocalizedQuestion,
  INT_001_WAVE05_LOCALIZATION_VERSION,
} from "./int-001-wave05-localization-v1";

export const INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION = "INT-001-WAVE05-QUESTION-STUDIO-REGISTRATION-v1" as const;
export const INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;
export const INT_001_WAVE05_QUESTION_STUDIO_DIFFICULTIES = ["Medium", "Hard"] as const;
export type Int001Wave05QuestionStudioLanguage = (typeof INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES)[number];
export type Int001Wave05QuestionStudioDifficulty = (typeof INT_001_WAVE05_QUESTION_STUDIO_DIFFICULTIES)[number];

const DIFFICULTY_BY_QL = Object.freeze({
  "INT-QL-132": "Medium",
  "INT-QL-133": "Hard",
  "INT-QL-134": "Hard",
} as const satisfies Record<Int001Wave03QlId, Int001Wave05QuestionStudioDifficulty>);

export const INT_001_WAVE05_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: "INT-001-WAVE05",
  packageId: "INT-001",
  chapterId: "INT-001",
  checkpointId: "INT-WAVE05",
  type: "quant-v4",
  section: "Quantitative Aptitude",
  domain: "quant",
  topic: "Arithmetic",
  subtopic: "Interest",
  name: "INT-001 Interest — Wave05 Frozen Multilingual Review",
  label: "Interest · QL132–134 · Frozen EN/HI/PA",
  qlIds: [...INT_001_WAVE03_QL_IDS],
  permanentQlIds: [...INT_001_WAVE03_QL_IDS],
  supportedLanguages: [...INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES],
  supportedDifficulties: [...INT_001_WAVE05_QUESTION_STUDIO_DIFFICULTIES],
  enabled: true,
  reviewOnly: true,
  reviewPreviewAvailable: true,
  questionStudioVisible: true,
  questionStudioDiscoverable: true,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY",
  questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED",
  persistenceAllowed: true,
  databaseWriteEnabled: true,
  questionBankStatus: "NOT_STORED",
  questionBankWritable: false,
  questionBankEligible: false,
  testEligibility: "INELIGIBLE",
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
  manualApprovalRequired: true,
  automaticStudentPublication: false,
  englishFreezeVersion: INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
  localizationVersion: INT_001_WAVE05_LOCALIZATION_VERSION,
  registrationVersion: INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION,
} as const);

export type Int001Wave05QuestionStudioRequest = Readonly<{
  language?: Int001Wave05QuestionStudioLanguage;
  qlId?: Int001Wave03QlId;
  difficulty?: Int001Wave05QuestionStudioDifficulty;
  seed?: string;
  count?: number;
}>;

function hashSeed(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function stableQlOrder(qlIds: readonly Int001Wave03QlId[], seed: string) {
  return [...qlIds]
    .map((qlId) => ({ qlId, score: hashSeed(`${seed}:${qlId}`) }))
    .sort((a, b) => a.score - b.score || a.qlId.localeCompare(b.qlId))
    .map(({ qlId }) => qlId);
}

function frozenSource(qlId: Int001Wave03QlId, seed: string, language: Int001Wave05QuestionStudioLanguage) {
  if (language === "en") return generateInt001Wave05EnglishFrozenQuestion(qlId, seed) as any;
  return generateInt001Wave05LocalizedQuestion(qlId, seed, language) as any;
}

function toPreview(source: any, language: Int001Wave05QuestionStudioLanguage) {
  if (!source.lifecycle?.permanentIdentityFrozen || !source.lifecycle?.learnerContentFrozen) {
    throw new Error(`${source.qlId}: Wave05 Question Studio source is not fully frozen.`);
  }
  if (source.lifecycle.questionStudioDiscoverable) {
    throw new Error(`${source.qlId}: source authority itself must remain undiscoverable; registration adapter owns discovery.`);
  }
  const locale = language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN";
  const questionId = ["INT-WAVE05", source.qlId, locale, source.requestedSeed].join(":");
  const displayedAnswer = String(source.options[source.correctIndex]?.text ?? "");
  if (!displayedAnswer) throw new Error(`${source.qlId}: missing displayed answer.`);

  return Object.freeze({
    archetypeId: "INT-001",
    packageId: "INT-001",
    canonicalProblemId: source.checkpointId,
    qlId: source.qlId as Int001Wave03QlId,
    questionId,
    canonicalItemId: `${source.qlId}:${source.requestedSeed}`,
    questionLanguageId: questionId,
    explanationId: `${questionId}:EXPLANATION`,
    language,
    locale,
    difficultyBand: DIFFICULTY_BY_QL[source.qlId as Int001Wave03QlId],
    useMode: "GENERATED_FROZEN_WAVE05_QL",
    stem: source.stem,
    options: source.options.map((option: any) => option.text),
    optionDetails: source.options.map((option: any, index: number) => Object.freeze({
      label: String.fromCharCode(65 + index),
      text: option.text,
      misconceptionId: option.misconceptionId,
      isCorrect: index === source.correctIndex,
    })),
    correctIndex: source.correctIndex,
    answer: displayedAnswer,
    explanation: Object.freeze({
      explanationId: `${questionId}:EXPLANATION`,
      whatAsked: "",
      keyIdea: "",
      steps: [...source.explanation.steps],
      conclusion: source.explanation.finalAnswer,
      shortcut: "",
      commonTrap: "",
      style: "DIRECT_CALCULATION" as const,
    }),
    renderer: Object.freeze({ kind: "text-mathjax", renderingContract: "markdown-inline-latex-v1", textFallbackAvailable: true }),
    runtimeMode: "INT-WAVE05-FROZEN-REVIEW-v1",
    reviewStatus: "FROZEN_EN_HI_PA_REVIEW" as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    manualApprovalRequired: true as const,
    automaticStudentPublication: false as const,
    integrationAuthority: INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION,
    parameters: Object.freeze({
      chapterId: "INT-001",
      checkpointId: source.checkpointId,
      qlId: source.qlId,
      seed: source.requestedSeed,
      sourcePrototypeId: source.sourcePrototypeId,
      answerSemantic: source.answerSemantic,
      stemFamilyId: source.stemFamilyId,
      questionBankWritable: false,
      testEligible: false,
      publiclyPublishable: false,
      persistenceAllowed: true,
    }),
    traceability: Object.freeze({
      permanentQlId: source.qlId,
      mathematicalFingerprint: source.mathematicalFingerprint,
      sourcePrototypeId: source.sourcePrototypeId,
      englishFreezeVersion: INT_001_WAVE05_ENGLISH_FREEZE_VERSION,
      localizationVersion: language === "en" ? null : INT_001_WAVE05_LOCALIZATION_VERSION,
      registrationVersion: INT_001_WAVE05_QUESTION_STUDIO_REGISTRATION_VERSION,
    }),
    validation: Object.freeze({
      valid: true as const,
      permanentIdentityFrozen: true as const,
      learnerContentFrozen: true as const,
      directCalculationExplanation: true as const,
      sourceLifecycleLocked: true as const,
      downstreamDeliveryClosed: true as const,
    }),
  });
}

export function previewInt001Wave05QuestionStudio(request: Int001Wave05QuestionStudioRequest = {}) {
  const language = request.language ?? "en";
  if (!(INT_001_WAVE05_QUESTION_STUDIO_LANGUAGES as readonly string[]).includes(language)) throw new Error(`Unsupported Wave05 language '${String(language)}'.`);
  if (request.qlId && !(INT_001_WAVE03_QL_IDS as readonly string[]).includes(request.qlId)) throw new Error(`Unsupported Wave05 QL '${String(request.qlId)}'.`);
  if (request.difficulty && !(INT_001_WAVE05_QUESTION_STUDIO_DIFFICULTIES as readonly string[]).includes(request.difficulty)) throw new Error(`Unsupported Wave05 difficulty '${String(request.difficulty)}'.`);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const seed = request.seed?.trim() || ["INT-WAVE05", language, request.qlId ?? "all", request.difficulty ?? "all"].join(":");
  const eligible = INT_001_WAVE03_QL_IDS.filter((qlId) => (!request.qlId || qlId === request.qlId) && (!request.difficulty || DIFFICULTY_BY_QL[qlId] === request.difficulty));
  if (!eligible.length) throw new Error("No Wave05 QLs match the requested filters.");
  const ordered = stableQlOrder(eligible, seed);
  const questions: ReturnType<typeof toPreview>[] = [];
  const rounds = Math.ceil(count / ordered.length) + 1;
  for (let round = 0; round < rounds && questions.length < count; round += 1) {
    for (const qlId of ordered) {
      const source = frozenSource(qlId, `${seed}:${round}:${qlId}`, language);
      questions.push(toPreview(source, language));
      if (questions.length >= count) break;
    }
  }
  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: "INT-001",
      checkpointId: "INT-WAVE05",
      language,
      locale: language === "en" ? "en-IN" : language === "hi" ? "hi-IN" : "pa-IN",
      seed,
      runtimeMode: "INT-WAVE05-FROZEN-REVIEW-v1" as const,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      questionBankStatus: "NOT_STORED" as const,
      questionBankWritable: false as const,
      testEligibility: "INELIGIBLE" as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      persistenceAllowed: true as const,
      reviewOnly: true as const,
    }),
    questions: Object.freeze(questions),
  });
}
