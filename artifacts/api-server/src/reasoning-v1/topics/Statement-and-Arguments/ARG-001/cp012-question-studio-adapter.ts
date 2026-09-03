import { createHash } from "node:crypto";

import {
  ARG_CP007_EXAM_PROFILES,
  type ArgCp007Difficulty,
  type ArgCp007ExamProfile,
} from "./cp007-exam-profile-generator-v2.ts";
import { ARG_CP009_CHECKPOINT_ID, ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY } from "./cp009-english-remediated-templates.ts";
import { ARG_CP009_LOCALIZATION_AUTHORITY_V2 } from "./cp009-localized-remediated-templates-v2.ts";
import {
  ARG_CP010_AUTHORITY,
  ARG_CP010_CHECKPOINT_ID,
} from "./cp010-correlated-real-paper-generator.ts";
import {
  generateArgCp010QuestionStudioBatch,
  isArgCp010CurrentReviewRequest,
  isArgCp010RealPaperRequest,
  normalizeArgCp010Difficulty,
  normalizeArgCp010Language,
  normalizeArgCp010Profile,
  normalizeArgCp010Ql,
  type ArgCp010QuestionStudioInput,
} from "./cp010-question-studio-adapter.ts";
import {
  ARG_CP012_AUTHORITY,
  ARG_CP012_CHECKPOINT_ID,
  generateArgCp012RealPaperBatch,
} from "./cp012-editorial-real-paper-remediation.ts";
import { ARG_QL_IDS, type ArgLocale } from "./types.ts";

export const ARG_CP012_QUESTION_STUDIO_AUTHORITY = "ARG_CP012_QUESTION_STUDIO_EDITORIAL_REMEDIATION_V1" as const;
export const ARG_CP012_RUNTIME_MODE = "REVIEW_ONLY_CP009_CORE_CP012_REAL_PAPER" as const;
export const ARG_CP012_REVIEW_STATUS = "QUESTION_STUDIO_CP012_EDITORIAL_REMEDIATION_CONNECTED" as const;
export const ARG_CP012_SUPPORTED_LANGUAGES = ["en", "hi", "pa"] as const;
export const ARG_CP012_SUPPORTED_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;

export type ArgCp012QuestionStudioInput = ArgCp010QuestionStudioInput;

type ArgCp012Language = (typeof ARG_CP012_SUPPORTED_LANGUAGES)[number];

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function fingerprint(parts: readonly unknown[]): string {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}

function localeForLanguage(language: ArgCp012Language): ArgLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
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

function explicitProfile(input: ArgCp012QuestionStudioInput): ArgCp007ExamProfile | undefined {
  for (const value of [input.examProfile, input.paperProfile, input.deliveryProfile]) {
    if (text(value)) return normalizeArgCp010Profile(value);
  }
  return undefined;
}

export function isArgCp012CurrentReviewRequest(input: Readonly<Record<string, unknown>>): boolean {
  return isArgCp010CurrentReviewRequest(input);
}

export function isArgCp012RealPaperRequest(input: ArgCp012QuestionStudioInput): boolean {
  return text(input.cpId).toUpperCase() === ARG_CP012_CHECKPOINT_ID || isArgCp010RealPaperRequest(input);
}

function normalizeCoreQuestion(question: Readonly<Record<string, any>>) {
  const contentFingerprint = fingerprint([
    ARG_CP012_QUESTION_STUDIO_AUTHORITY,
    question.contentFingerprint,
    question.sourceAuthority,
    question.statement,
    question.arguments,
    question.options,
    question.correctIndex,
  ]);
  return Object.freeze({
    ...question,
    checkpointId: ARG_CP012_CHECKPOINT_ID,
    contentFingerprint,
    currentQuestionStudioAuthority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
    runtimeMode: ARG_CP012_RUNTIME_MODE,
    reviewStatus: ARG_CP012_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    questionStudioRegistrationStatus: "REGISTERED_CP012_EDITORIAL_REVIEW_ONLY" as const,
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

function normalizeRealPaperQuestion(
  question: ReturnType<typeof generateArgCp012RealPaperBatch>["questions"][number],
  language: ArgCp012Language,
) {
  const stem = displayStem(question.locale, question.statement, question.arguments);
  const options: readonly string[] = question.options as readonly string[];
  const correctIndex: number = question.correctIndex;
  const answer = options[correctIndex] ?? "";
  return Object.freeze({
    text: stem,
    stem,
    instruction: instruction(question.locale),
    statement: question.statement,
    arguments: question.arguments,
    options,
    correct: correctIndex,
    correctIndex,
    answer,
    canonicalAnswer: answer,
    argumentStrengths: question.argumentStrengths,
    explanation: question.explanation,
    difficulty: question.difficultyLabel,
    difficultyLabel: question.difficultyLabel,
    qlId: question.qlId,
    permanentQlId: question.qlId,
    patternId: question.templateId,
    templateId: question.templateId,
    canonicalProblemId: question.qlId,
    canonicalItemId: `${question.templateId}:${question.metadata.correlatedScenarioId}:${question.profile}:${question.locale}:CP012`,
    questionId: `ARG-001:${question.qlId}:${question.profile}:${question.contentFingerprint.slice(0, 20)}:CP012`,
    contentFingerprint: question.contentFingerprint,
    packageId: "ARG-001" as const,
    chapterId: "REAS-ARG" as const,
    checkpointId: ARG_CP012_CHECKPOINT_ID,
    sourceCheckpointId: ARG_CP012_CHECKPOINT_ID,
    sourceAuthority: ARG_CP012_AUTHORITY,
    supersedesRealPaperAuthority: ARG_CP010_AUTHORITY,
    historicalRealPaperCheckpointId: ARG_CP010_CHECKPOINT_ID,
    currentQuestionStudioAuthority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
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
    runtimeMode: ARG_CP012_RUNTIME_MODE,
    reviewStatus: ARG_CP012_REVIEW_STATUS,
    lifecycleStatus: "REVIEW_ONLY" as const,
    questionStudioVisible: true as const,
    questionStudioRegistrationStatus: "REGISTERED_CP012_EDITORIAL_REVIEW_ONLY" as const,
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
    editorialCardinalityMode: question.metadata.cardinalityMode,
  });
}

export function generateArgCp012QuestionStudioBatch(input: ArgCp012QuestionStudioInput) {
  const realPaper = isArgCp012RealPaperRequest(input);

  if (!realPaper) {
    const legacy = generateArgCp010QuestionStudioBatch(input);
    const questions = Object.freeze(legacy.questions.map((question) => normalizeCoreQuestion(question as unknown as Readonly<Record<string, any>>)));
    return Object.freeze({
      packageId: "ARG-001" as const,
      checkpointId: ARG_CP012_CHECKPOINT_ID,
      authority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
      sourceAuthority: legacy.sourceAuthority,
      questions,
      generationContext: Object.freeze({
        ...legacy.generationContext,
        checkpointId: ARG_CP012_CHECKPOINT_ID,
        authority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
        runtimeMode: ARG_CP012_RUNTIME_MODE,
        reviewStatus: ARG_CP012_REVIEW_STATUS,
        profileMode: "core" as const,
        currentCoreCheckpointId: ARG_CP009_CHECKPOINT_ID,
        currentRealPaperCheckpointId: ARG_CP012_CHECKPOINT_ID,
        coreEnglishAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
        coreLocalizationAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
        realPaperAuthority: ARG_CP012_AUTHORITY,
        questionBankWritable: false as const,
        testEligible: false as const,
        mockTestEligible: false as const,
        publiclyPublishable: false as const,
        automaticStudentPublication: false as const,
        learnerRelease: "LOCKED" as const,
      }),
    });
  }

  const language = normalizeArgCp010Language(input.language) as ArgCp012Language;
  const locale = localeForLanguage(language);
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1) || 1)));
  const qlId = normalizeArgCp010Ql(input.qlId ?? input.canonicalProblemId);
  const profile = explicitProfile(input) ?? "SSC_RECENT_2X4";
  const supported = ARG_CP007_EXAM_PROFILES[profile].supportedDifficulties as readonly ArgCp007Difficulty[];
  const requestedDifficulty = normalizeArgCp010Difficulty(input.difficulty) as ArgCp007Difficulty | undefined;
  const difficulty = requestedDifficulty ?? supported[0]!;
  if (!supported.includes(difficulty)) throw new Error(`${profile} does not support ${difficulty}. Supported: ${supported.join(", ")}`);

  const result = generateArgCp012RealPaperBatch({
    profile,
    difficulty,
    ...(qlId ? { qlId } : {}),
    locale,
    seed: text(input.seed) || "ARG-CP012-QUESTION-STUDIO",
    count,
  });
  const questions = Object.freeze(result.questions.map((question) => normalizeRealPaperQuestion(question, language)));
  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP012_CHECKPOINT_ID,
    authority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
    sourceAuthority: ARG_CP012_AUTHORITY,
    questions,
    generationContext: Object.freeze({
      ...result.generationContext,
      authority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
      sourceAuthority: ARG_CP012_AUTHORITY,
      historicalRealPaperAuthority: ARG_CP010_AUTHORITY,
      coreEnglishAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
      coreLocalizationAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
      runtimeMode: ARG_CP012_RUNTIME_MODE,
      reviewStatus: ARG_CP012_REVIEW_STATUS,
      profileMode: "real-paper" as const,
      currentCoreCheckpointId: ARG_CP009_CHECKPOINT_ID,
      currentRealPaperCheckpointId: ARG_CP012_CHECKPOINT_ID,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export const ARG_CP012_QUESTION_STUDIO_PACKAGE = Object.freeze({
  packageId: "ARG-001" as const,
  chapterId: "REAS-ARG" as const,
  label: "Statement & Arguments" as const,
  topic: "Reasoning" as const,
  subtopic: "Statement & Arguments" as const,
  subject: "Reasoning Ability" as const,
  cpIds: Object.freeze([ARG_CP009_CHECKPOINT_ID, ARG_CP010_CHECKPOINT_ID, ARG_CP012_CHECKPOINT_ID] as const),
  permanentQlCount: ARG_QL_IDS.length,
  permanentQlIds: ARG_QL_IDS,
  supportedLanguages: ARG_CP012_SUPPORTED_LANGUAGES,
  supportedDifficulties: ARG_CP012_SUPPORTED_DIFFICULTIES,
  examProfiles: Object.freeze(Object.values(ARG_CP007_EXAM_PROFILES)),
  currentCoreCheckpointId: ARG_CP009_CHECKPOINT_ID,
  currentRealPaperCheckpointId: ARG_CP012_CHECKPOINT_ID,
  currentQuestionStudioAuthority: ARG_CP012_QUESTION_STUDIO_AUTHORITY,
  coreEnglishAuthority: ARG_CP009_ENGLISH_REMEDIATION_AUTHORITY,
  coreLocalizationAuthority: ARG_CP009_LOCALIZATION_AUTHORITY_V2,
  historicalRealPaperAuthority: ARG_CP010_AUTHORITY,
  realPaperAuthority: ARG_CP012_AUTHORITY,
  runtimeMode: ARG_CP012_RUNTIME_MODE,
  reviewStatus: ARG_CP012_REVIEW_STATUS,
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
