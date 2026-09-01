import { createHash } from "node:crypto";

import {
  ARG_CP007_EXAM_PROFILES,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator-v2.ts";
import { generateArgCp009EnglishQuestion } from "./cp009-english-generator.ts";
import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { generateArgCp009LocalizedQuestionV2 } from "./cp009-localized-generator-v2.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import {
  ARG_CP010_AUTHORITY,
  ARG_CP010_CHECKPOINT_ID,
  generateArgCp010RealPaperBatch,
} from "./cp010-correlated-real-paper-generator.ts";
import { ARG_QL_IDS, type ArgDifficulty, type ArgLocale, type ArgQlId } from "./types.ts";

export const ARG_CP010_QUESTION_STUDIO_AUTHORITY = "ARG_CP010_QUESTION_STUDIO_REMEDIATED_REVIEW_V1" as const;
export const ARG_CP010_RUNTIME_MODE = "REVIEW_ONLY_CP009_CP010_REMEDIATED" as const;
export const ARG_CP010_REVIEW_STATUS = "QUESTION_STUDIO_REMEDIATED_REVIEW_CONNECTED" as const;
export const ARG_CP010_SUPPORTED_LANGUAGES = ["en", "hi", "pa"] as const;
export const ARG_CP010_SUPPORTED_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type ArgCp010Language = (typeof ARG_CP010_SUPPORTED_LANGUAGES)[number];
export type ArgCp010Difficulty = (typeof ARG_CP010_SUPPORTED_DIFFICULTIES)[number];

export interface ArgCp010QuestionStudioInput {
  readonly seed?: string;
  readonly count?: number;
  readonly language?: string;
  readonly difficulty?: string;
  readonly qlId?: string;
  readonly canonicalProblemId?: string;
  readonly patternId?: string;
  readonly cpId?: string;
  readonly examProfile?: string;
  readonly paperProfile?: string;
  readonly deliveryProfile?: string;
  readonly profileMode?: string;
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function fingerprint(parts: readonly unknown[]): string {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}

function displayDifficulty(value: ArgDifficulty): ArgCp010Difficulty {
  if (value === "EASY") return "Easy";
  if (value === "MEDIUM") return "Medium";
  return "Hard";
}

function authorityDifficulty(value: ArgCp010Difficulty): ArgDifficulty {
  if (value === "Easy") return "EASY";
  if (value === "Medium") return "MEDIUM";
  return "HARD";
}

export function normalizeArgCp010Language(value: unknown): ArgCp010Language {
  const normalized = text(value).toLowerCase();
  if (normalized === "hi" || normalized === "hi-in") return "hi";
  if (normalized === "pa" || normalized === "pa-in" || normalized === "pb") return "pa";
  return "en";
}

function localeForLanguage(language: ArgCp010Language): ArgLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

export function normalizeArgCp010Difficulty(value: unknown): ArgCp010Difficulty | undefined {
  const normalized = text(value).toLowerCase();
  if (!normalized || normalized === "mixed") return undefined;
  if (normalized === "easy") return "Easy";
  if (normalized === "medium" || normalized === "moderate") return "Medium";
  if (normalized === "hard") return "Hard";
  throw new Error(`ARG-001 does not support difficulty '${String(value)}'.`);
}

export function normalizeArgCp010Ql(value: unknown): ArgQlId | undefined {
  const normalized = text(value).toUpperCase();
  if (!normalized) return undefined;
  if (!(ARG_QL_IDS as readonly string[]).includes(normalized)) throw new Error(`Unsupported ARG-001 QL '${String(value)}'.`);
  return normalized as ArgQlId;
}

export function normalizeArgCp010Profile(value: unknown): ArgCp007ExamProfile | undefined {
  const normalized = text(value).toUpperCase();
  if (!normalized) return undefined;
  if (!(normalized in ARG_CP007_EXAM_PROFILES)) throw new Error(`Unsupported ARG-001 real-paper profile '${String(value)}'.`);
  return normalized as ArgCp007ExamProfile;
}

function explicitProfile(input: ArgCp010QuestionStudioInput): ArgCp007ExamProfile | undefined {
  for (const value of [input.examProfile, input.paperProfile, input.deliveryProfile]) {
    const normalized = text(value);
    if (normalized) return normalizeArgCp010Profile(normalized);
  }
  return undefined;
}

export function isArgCp010RealPaperRequest(input: ArgCp010QuestionStudioInput): boolean {
  if (explicitProfile(input)) return true;
  const cpId = text(input.cpId).toUpperCase();
  const profileMode = text(input.profileMode).toLowerCase();
  return cpId === "ARG-CP-007" || cpId === ARG_CP010_CHECKPOINT_ID || profileMode === "real-paper";
}

export function isArgCp010CurrentReviewRequest(input: ArgCp010QuestionStudioInput & Readonly<Record<string, unknown>>): boolean {
  const cpId = text(input.cpId).toUpperCase();
  const ql = text(input.qlId ?? input.canonicalProblemId ?? input.patternId).toUpperCase();
  const packageId = text(input.packageId ?? input.archetypeId).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const topic = text(input.topic).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const subtopic = text(input.subtopic).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  return packageId === "arg 001"
    || ql.startsWith("ARG-QL-")
    || cpId.startsWith("ARG-CP-")
    || subtopic === "statement arguments"
    || subtopic === "statement and arguments"
    || (topic === "reasoning" && subtopic === "arguments");
}

function instruction(locale: ArgLocale): string {
  if (locale === "hi-IN") return "कथन को पढ़िए और तय कीजिए कि निम्नलिखित में से कौन-सा/कौन-से तर्क मजबूत हैं।";
  if (locale === "pa-IN") return "ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਹੇਠ ਲਿਖੀਆਂ ਦਲੀਲਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ/ਕਿਹੜੀਆਂ ਮਜ਼ਬੂਤ ਹਨ।";
  return "Read the statement and decide which of the following arguments is/are strong.";
}

function displayStem(locale: ArgLocale, statement: string, argumentsList: readonly string[]): string {
  const labels = ["I", "II", "III", "IV"] as const;
  const heading = locale === "hi-IN" ? "कथन" : locale === "pa-IN" ? "ਕਥਨ" : "Statement";
  const argumentHeading = locale === "hi-IN" ? "तर्क" : locale === "pa-IN" ? "ਦਲੀਲਾਂ" : "Arguments";
  return `${heading}: ${statement}\n${argumentHeading}:\n${argumentsList.map((argument, index) => `${labels[index]}. ${argument}`).join("\n")}`;
}

function coreQuestion(input: {
  readonly qlId: ArgQlId;
  readonly language: ArgCp010Language;
  readonly seed: number;
  readonly difficulty?: ArgCp010Difficulty;
}) {
  const locale = localeForLanguage(input.language);
  const expected = input.difficulty ? authorityDifficulty(input.difficulty) : undefined;
  for (let attempt = 0; attempt < 4096; attempt += 1) {
    const candidateSeed = (input.seed + Math.imul(attempt, 104729)) & 0x7fffffff;
    const question = locale === "en-IN"
      ? generateArgCp009EnglishQuestion({ qlId: input.qlId, seed: candidateSeed })
      : generateArgCp009LocalizedQuestionV2({ qlId: input.qlId, locale, seed: candidateSeed });
    if (!expected || question.difficulty === expected) return question;
  }
  throw new Error(`Unable to resolve ${input.qlId} at requested difficulty ${input.difficulty}.`);
}

function normalizeCoreQuestion(question: ReturnType<typeof generateArgCp009EnglishQuestion> | ReturnType<typeof generateArgCp009LocalizedQuestionV2>, language: ArgCp010Language) {
  const stem = displayStem(question.locale, question.statement, question.arguments);
  const contentFingerprint = fingerprint([
    ARG_CP010_QUESTION_STUDIO_AUTHORITY,
    question.qlId,
    question.templateId,
    question.variantIndex,
    question.locale,
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
  ]);
  return Object.freeze({
    text: stem,
    stem,
    instruction: instruction(question.locale),
    statement: question.statement,
    arguments: question.arguments,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answerClass,
    canonicalAnswer: question.answerClass,
    argumentStrengths: question.argumentStrengths,
    explanation: question.explanation,
    difficulty: displayDifficulty(question.difficulty),
    difficultyLabel: displayDifficulty(question.difficulty),
    qlId: question.qlId,
    permanentQlId: question.qlId,
    patternId: question.templateId,
    templateId: question.templateId,
    canonicalProblemId: question.qlId,
    canonicalItemId: `${question.templateId}:${question.variantKey}:${question.locale}:CP009`,
    questionId: `ARG-001:${question.qlId}:${question.templateId}:${question.variantKey}:${question.locale}:CP009`,
    contentFingerprint,
    packageId: "ARG-001" as const,
    chapterId: "REAS-ARG" as const,
    checkpointId: ARG_CP010_CHECKPOINT_ID,
    sourceCheckpointId: ARG_CP009_CHECKPOINT_ID,
    sourceAuthority: question.authority,
    currentQuestionStudioAuthority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
    topic: "Reasoning" as const,
    subtopic: "Statement & Arguments" as const,
    subject: "Reasoning Ability" as const,
    language,
    locale: question.locale,
    seed: question.seed,
    scenarioId: question.scenarioId,
    archetype: question.archetype,
    profileMode: "core" as const,
    runtimeMode: ARG_CP010_RUNTIME_MODE,
    reviewStatus: ARG_CP010_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    questionStudioVisible: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REMEDIATED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    manualApprovalRequired: true as const,
    persistenceAllowed: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: "LOCKED" as const,
  });
}

function normalizeRealPaperQuestion(question: ReturnType<typeof generateArgCp010RealPaperBatch>["questions"][number], language: ArgCp010Language) {
  const stem = displayStem(question.locale, question.statement, question.arguments);
  return Object.freeze({
    text: stem,
    stem,
    instruction: instruction(question.locale),
    statement: question.statement,
    arguments: question.arguments,
    options: question.options,
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    argumentStrengths: question.argumentStrengths,
    explanation: question.explanation,
    difficulty: question.difficulty,
    difficultyLabel: question.difficulty,
    qlId: question.qlId,
    permanentQlId: question.qlId,
    patternId: question.templateId,
    templateId: question.templateId,
    canonicalProblemId: question.qlId,
    canonicalItemId: `${question.templateId}:${question.metadata.correlatedScenarioId}:${question.profile}:${question.locale}`,
    questionId: `ARG-001:${question.qlId}:${question.profile}:${question.contentFingerprint.slice(0, 20)}`,
    contentFingerprint: question.contentFingerprint,
    packageId: "ARG-001" as const,
    chapterId: "REAS-ARG" as const,
    checkpointId: ARG_CP010_CHECKPOINT_ID,
    sourceCheckpointId: ARG_CP010_CHECKPOINT_ID,
    sourceAuthority: ARG_CP010_AUTHORITY,
    currentQuestionStudioAuthority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
    topic: "Reasoning" as const,
    subtopic: "Statement & Arguments" as const,
    subject: "Reasoning Ability" as const,
    language,
    locale: question.locale,
    seed: question.seed,
    scenarioId: question.scenarioId,
    archetype: question.archetype,
    profileMode: "real-paper" as const,
    examProfile: question.profile,
    runtimeMode: ARG_CP010_RUNTIME_MODE,
    reviewStatus: ARG_CP010_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    questionStudioVisible: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REMEDIATED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    manualApprovalRequired: true as const,
    persistenceAllowed: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    learnerRelease: "LOCKED" as const,
  });
}

export function generateArgCp010QuestionStudioBatch(input: ArgCp010QuestionStudioInput) {
  const language = normalizeArgCp010Language(input.language);
  const locale = localeForLanguage(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1) || 1)));
  const explicitQl = normalizeArgCp010Ql(input.qlId ?? input.canonicalProblemId);
  const batchSeed = text(input.seed) || "ARG-CP010-QUESTION-STUDIO";
  const realPaper = isArgCp010RealPaperRequest(input);

  if (realPaper) {
    const profile = explicitProfile(input) ?? "SSC_RECENT_2X4";
    const supported = ARG_CP007_EXAM_PROFILES[profile].supportedDifficulties as readonly ArgCp007Difficulty[];
    const requested = normalizeArgCp010Difficulty(input.difficulty);
    const difficulty = (requested ?? supported[0]!) as ArgCp007Difficulty;
    if (!supported.includes(difficulty)) throw new Error(`${profile} does not support ${difficulty}. Supported: ${supported.join(", ")}`);
    const result = generateArgCp010RealPaperBatch({ profile, difficulty, qlId: explicitQl, locale, seed: batchSeed, count });
    return Object.freeze({
      packageId: "ARG-001" as const,
      checkpointId: ARG_CP010_CHECKPOINT_ID,
      authority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
      sourceAuthority: ARG_CP010_AUTHORITY,
      questions: Object.freeze(result.questions.map((question) => normalizeRealPaperQuestion(question, language))),
      generationContext: Object.freeze({
        ...result.generationContext,
        authority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
        sourceAuthority: ARG_CP010_AUTHORITY,
        coreEnglishAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
        coreLocalizationAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
        runtimeMode: ARG_CP010_RUNTIME_MODE,
        reviewStatus: ARG_CP010_REVIEW_STATUS,
        profileMode: "real-paper" as const,
        questionBankWritable: false as const,
        testEligible: false as const,
        mockTestEligible: false as const,
        publiclyPublishable: false as const,
        automaticStudentPublication: false as const,
        learnerRelease: "LOCKED" as const,
      }),
    });
  }

  const difficulty = normalizeArgCp010Difficulty(input.difficulty);
  const questions = Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = explicitQl ?? ARG_QL_IDS[index % ARG_QL_IDS.length]!;
    const seed = stableHash(`${ARG_CP010_QUESTION_STUDIO_AUTHORITY}:${batchSeed}:${qlId}:${index}`) & 0x7fffffff;
    return normalizeCoreQuestion(coreQuestion({ qlId, language, seed, difficulty }), language);
  }));

  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP010_CHECKPOINT_ID,
    authority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
    sourceAuthority: language === "en" ? ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY : ARG_CP009_LOCALIZATION_AUTHORITY_V2,
    questions,
    generationContext: Object.freeze({
      chapterId: "ARG-001" as const,
      checkpointId: ARG_CP010_CHECKPOINT_ID,
      sourceCheckpointId: ARG_CP009_CHECKPOINT_ID,
      authority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
      sourceAuthority: language === "en" ? ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY : ARG_CP009_LOCALIZATION_AUTHORITY_V2,
      coreEnglishAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
      coreLocalizationAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
      runtimeMode: ARG_CP010_RUNTIME_MODE,
      reviewStatus: ARG_CP010_REVIEW_STATUS,
      profileMode: "core" as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export const ARG_CP010_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: "ARG-001" as const,
  chapterId: "REAS-ARG" as const,
  label: "Statement & Arguments" as const,
  topic: "Reasoning" as const,
  subtopic: "Statement & Arguments" as const,
  subject: "Reasoning Ability" as const,
  cpIds: Object.freeze([ARG_CP009_CHECKPOINT_ID, ARG_CP010_CHECKPOINT_ID] as const),
  permanentQlCount: ARG_QL_IDS.length,
  permanentQlIds: ARG_QL_IDS,
  supportedLanguages: ARG_CP010_SUPPORTED_LANGUAGES,
  supportedDifficulties: ARG_CP010_SUPPORTED_DIFFICULTIES,
  examProfiles: Object.freeze(Object.values(ARG_CP007_EXAM_PROFILES)),
  currentCoreCheckpointId: ARG_CP009_CHECKPOINT_ID,
  currentRealPaperCheckpointId: ARG_CP010_CHECKPOINT_ID,
  currentQuestionStudioAuthority: ARG_CP010_QUESTION_STUDIO_AUTHORITY,
  coreEnglishAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
  coreLocalizationAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
  realPaperAuthority: ARG_CP010_AUTHORITY,
  runtimeMode: ARG_CP010_RUNTIME_MODE,
  reviewStatus: ARG_CP010_REVIEW_STATUS,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  reviewOnly: true as const,
  manualApprovalRequired: true as const,
  persistenceAllowed: false as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: "LOCKED" as const,
});
