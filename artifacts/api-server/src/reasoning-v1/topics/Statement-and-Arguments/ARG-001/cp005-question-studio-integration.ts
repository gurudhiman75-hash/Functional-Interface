import { createHash } from "node:crypto";

import { ARG_CP003_TEMPLATES_BY_QL } from "./cp003-templates.ts";
import { generateArgCp004Question } from "./cp004-generator.ts";
import { ARG_QL_IDS, type ArgDifficulty, type ArgLocale, type ArgQlId } from "./types.ts";

export const ARG_CP005_QUESTION_STUDIO_AUTHORITY = "ARG_CP005_QUESTION_STUDIO_REVIEW_V1" as const;
export const ARG_CP005_CHECKPOINT_ID = "ARG-CP-005" as const;
export const ARG_CP005_PACKAGE_ID = "ARG-001" as const;
export const ARG_CP005_CHAPTER_ID = "REAS-ARG" as const;
export const ARG_CP005_SUPPORTED_LANGUAGES = ["en", "hi", "pa"] as const;
export const ARG_CP005_DESIGN_TARGET_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export const ARG_CP005_SUPPORTED_DIFFICULTIES = ARG_CP005_DESIGN_TARGET_DIFFICULTIES;
export const ARG_CP005_BLOCKED_DIFFICULTIES = [] as const;

export type ArgCp005Language = (typeof ARG_CP005_SUPPORTED_LANGUAGES)[number];
export type ArgCp005Difficulty = (typeof ARG_CP005_DESIGN_TARGET_DIFFICULTIES)[number];

export interface ArgCp005QuestionStudioInput {
  readonly seed?: string;
  readonly count?: number;
  readonly language?: string;
  readonly difficulty?: string;
  readonly qlId?: string;
  readonly canonicalProblemId?: string;
  readonly patternId?: string;
  readonly cpId?: string;
}

function displayDifficulty(value: ArgDifficulty): ArgCp005Difficulty {
  if (value === "EASY") return "Easy";
  if (value === "MEDIUM") return "Medium";
  return "Hard";
}

export const ARG_CP005_DIFFICULTIES_BY_QL: Readonly<Record<ArgQlId, readonly ArgCp005Difficulty[]>> = Object.freeze(
  ARG_QL_IDS.reduce<Record<ArgQlId, readonly ArgCp005Difficulty[]>>((coverage, qlId) => {
    coverage[qlId] = Object.freeze([
      ...new Set(ARG_CP003_TEMPLATES_BY_QL[qlId].map((template) => displayDifficulty(template.difficulty))),
    ]);
    return coverage;
  }, {} as Record<ArgQlId, readonly ArgCp005Difficulty[]>),
);

export const ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  id: ARG_CP005_PACKAGE_ID,
  packageId: ARG_CP005_PACKAGE_ID,
  type: "reasoning-v1" as const,
  section: "Reasoning" as const,
  domain: "reasoning" as const,
  subject: "Reasoning Ability" as const,
  topic: "Reasoning" as const,
  subtopic: "Statement & Arguments" as const,
  name: "ARG-001 Statement & Arguments — trilingual certified review runtime",
  label: "Statement & Arguments",
  generationDomain: "reasoning-v1" as const,
  integrationAuthority: ARG_CP005_QUESTION_STUDIO_AUTHORITY,
  integrationCheckpointId: ARG_CP005_CHECKPOINT_ID,
  cpIds: Object.freeze(["ARG-CP-001", "ARG-CP-002", "ARG-CP-003", "ARG-CP-004", ARG_CP005_CHECKPOINT_ID] as const),
  canonicalProblems: Object.freeze(ARG_QL_IDS.map((qlId) => Object.freeze({
    id: qlId,
    label: qlId,
    checkpointId: ARG_CP005_CHECKPOINT_ID,
    supportedDifficulties: ARG_CP005_DIFFICULTIES_BY_QL[qlId],
  }))),
  permanentQlCount: ARG_QL_IDS.length,
  permanentQlIds: ARG_QL_IDS,
  supportedLanguages: ARG_CP005_SUPPORTED_LANGUAGES,
  designTargetDifficulties: ARG_CP005_DESIGN_TARGET_DIFFICULTIES,
  supportedDifficulties: ARG_CP005_SUPPORTED_DIFFICULTIES,
  blockedDifficulties: ARG_CP005_BLOCKED_DIFFICULTIES,
  difficultyCoverageByQl: ARG_CP005_DIFFICULTIES_BY_QL,
  difficultyCoverageStatus: "CERTIFIED_EASY_MEDIUM_HARD" as const,
  enabled: true as const,
  questionStudioVisible: true as const,
  questionStudioDiscoverable: true as const,
  questionStudioGenerationEnabled: true as const,
  persistenceAllowed: false as const,
  runtimeMode: "REVIEW_ONLY_CERTIFIED_CP004" as const,
  reviewStatus: "QUESTION_STUDIO_REVIEW_CONNECTED" as const,
  reviewOnly: true as const,
  manualApprovalRequired: true as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  learnerRelease: "LOCKED" as const,
});

function stableHash(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function normalizeLanguage(value: unknown): ArgCp005Language {
  const text = String(value ?? "en").trim().toLowerCase();
  if (text === "en" || text === "en-in") return "en";
  if (text === "hi" || text === "hi-in") return "hi";
  if (text === "pa" || text === "pa-in" || text === "pb") return "pa";
  throw new Error(`ARG-001 does not support Question Studio language '${String(value)}'.`);
}

function localeForLanguage(language: ArgCp005Language): ArgLocale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function normalizeDifficulty(value: unknown): ArgCp005Difficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text) return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error(`ARG-001 does not support difficulty '${String(value)}'.`);
}

function authorityDifficulty(value: ArgCp005Difficulty): ArgDifficulty {
  if (value === "Easy") return "EASY";
  if (value === "Medium") return "MEDIUM";
  return "HARD";
}

function normalizeQl(value: unknown): ArgQlId | undefined {
  const text = String(value ?? "").trim().toUpperCase();
  if (!text) return undefined;
  if (!(ARG_QL_IDS as readonly string[]).includes(text)) {
    throw new Error(`Unsupported ARG-001 QL '${String(value)}'.`);
  }
  return text as ArgQlId;
}

function requestedQl(input: ArgCp005QuestionStudioInput): ArgQlId | undefined {
  for (const value of [input.qlId, input.canonicalProblemId, input.patternId]) {
    const text = String(value ?? "").trim().toUpperCase();
    if (text.startsWith("ARG-QL-")) return normalizeQl(text);
  }
  return undefined;
}

function instruction(locale: ArgLocale): string {
  if (locale === "hi-IN") return "कथन को पढ़िए और तय कीजिए कि निम्नलिखित में से कौन-सा/कौन-से तर्क मजबूत हैं।";
  if (locale === "pa-IN") return "ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਹੇਠ ਲਿਖੀਆਂ ਦਲੀਲਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀ/ਕਿਹੜੀਆਂ ਮਜ਼ਬੂਤ ਹਨ।";
  return "Read the statement and decide which of the following arguments is/are strong.";
}

function displayStem(locale: ArgLocale, statement: string, argumentsList: readonly [string, string]): string {
  if (locale === "hi-IN") return `कथन: ${statement}\nतर्क:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
  if (locale === "pa-IN") return `ਕਥਨ: ${statement}\nਦਲੀਲਾਂ:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
  return `Statement: ${statement}\nArguments:\nI. ${argumentsList[0]}\nII. ${argumentsList[1]}`;
}

function contentFingerprint(parts: readonly unknown[]): string {
  return createHash("sha256").update(JSON.stringify(parts)).digest("hex");
}

function generateMatchingQuestion(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgLocale;
  readonly batchSeed: string;
  readonly itemIndex: number;
  readonly difficulty?: ArgCp005Difficulty;
}) {
  const expectedDifficulty = input.difficulty ? authorityDifficulty(input.difficulty) : undefined;
  for (let attempt = 0; attempt < 4096; attempt += 1) {
    const seed = stableHash(`${ARG_CP005_QUESTION_STUDIO_AUTHORITY}:${input.batchSeed}:${input.itemIndex}:${attempt}`) & 0x7fffffff;
    const question = generateArgCp004Question({ qlId: input.qlId, locale: input.locale, seed });
    if (!expectedDifficulty || question.difficulty === expectedDifficulty) return question;
  }
  throw new Error(`Unable to resolve ${input.qlId} at requested difficulty ${input.difficulty}.`);
}

function normalizePayload(question: ReturnType<typeof generateArgCp004Question>, language: ArgCp005Language) {
  const stem = displayStem(question.locale, question.statement, question.arguments);
  const fingerprint = contentFingerprint([
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
    canonicalItemId: `${question.templateId}:${question.variantKey}:${question.locale}`,
    questionId: `ARG-001:${question.qlId}:${question.templateId}:${question.variantKey}:${question.locale}`,
    contentFingerprint: fingerprint,
    packageId: ARG_CP005_PACKAGE_ID,
    chapterId: ARG_CP005_CHAPTER_ID,
    checkpointId: ARG_CP005_CHECKPOINT_ID,
    sourceCheckpointId: question.checkpointId,
    topic: "Reasoning",
    subtopic: "Statement & Arguments",
    subject: "Reasoning Ability",
    language,
    locale: question.locale,
    seed: question.seed,
    scenarioId: question.scenarioId,
    archetype: question.archetype,
    runtimeMode: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
    reviewStatus: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
    lifecycleStatus: "REVIEW_ONLY" as const,
    questionStudioVisible: true as const,
    questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
    questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
    revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
    manualApprovalRequired: true as const,
    persistenceAllowed: false as const,
    questionBankStatus: "NOT_STORED" as const,
    questionBankWritable: false as const,
    testEligibility: "INELIGIBLE" as const,
    testEligible: false as const,
    mockTestEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
    sourceAuthority: question.metadata.authority,
    sourceLocalizationStatus: question.metadata.localizationStatus,
    sourceAntiGamingScheduler: question.metadata.antiGamingScheduler,
    sourceSemanticSurfaceCapacityPerQl: question.metadata.semanticSurfaceCapacityPerQl,
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      packageId: ARG_CP005_PACKAGE_ID,
      chapterId: ARG_CP005_CHAPTER_ID,
      checkpointId: ARG_CP005_CHECKPOINT_ID,
      sourceCheckpointId: question.checkpointId,
      qlId: question.qlId,
      templateId: question.templateId,
      runtimeMode: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
      lifecycleStatus: "REVIEW_ONLY" as const,
      crossLanguageSemanticParity: true as const,
      antiGamingCertified: true as const,
      questionStudioVisible: true as const,
      questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
      questionStudioStagingStatus: "REVIEW_QUEUE_ENABLED" as const,
      revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
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
      integrationAuthority: ARG_CP005_QUESTION_STUDIO_AUTHORITY,
    }),
  });
}

export function isArg001QuestionStudioRequest(input: ArgCp005QuestionStudioInput): boolean {
  const normalize = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  const record = input as Readonly<Record<string, unknown>>;
  const ql = String(input.qlId ?? input.canonicalProblemId ?? input.patternId ?? "").toUpperCase();
  const checkpoint = String(input.cpId ?? "").toUpperCase();
  const raw = normalize(record.packageId ?? record.archetypeId);
  const topic = normalize(record.topic);
  const subtopic = normalize(record.subtopic);
  return raw === "arg 001"
    || ql.startsWith("ARG-QL-")
    || checkpoint.startsWith("ARG-CP-")
    || subtopic === "statement arguments"
    || subtopic === "statement and arguments"
    || (topic === "reasoning" && subtopic === "arguments");
}

export function listArg001QuestionStudioPackages() {
  return [ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE] as const;
}

export async function generateArg001QuestionStudioBatch(input: ArgCp005QuestionStudioInput) {
  if (input.cpId && String(input.cpId).trim().toUpperCase() !== ARG_CP005_CHECKPOINT_ID) {
    throw new Error(`ARG-001 Question Studio generation is exposed only through ${ARG_CP005_CHECKPOINT_ID}.`);
  }
  const language = normalizeLanguage(input.language);
  const locale = localeForLanguage(language);
  const difficulty = normalizeDifficulty(input.difficulty);
  const explicitQl = requestedQl(input);
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1) || 1)));
  const batchSeed = String(input.seed ?? "").trim() || `question-studio:ARG-001:${language}:default`;

  const candidateQls: readonly ArgQlId[] = explicitQl ? [explicitQl] : ARG_QL_IDS;
  const eligibleQls = difficulty
    ? candidateQls.filter((qlId) => ARG_CP005_DIFFICULTIES_BY_QL[qlId].includes(difficulty))
    : [...candidateQls];

  if (eligibleQls.length === 0) {
    throw new Error(
      `${explicitQl ?? "ARG-001"} has no certified ${difficulty ?? "requested"} authority in CP003/CP004.`,
    );
  }

  const questionPackages = Array.from({ length: count }, (_, index) => {
    const qlId = eligibleQls[stableHash(`${batchSeed}:ql:${index}`) % eligibleQls.length]!;
    return generateMatchingQuestion({ qlId, locale, batchSeed, itemIndex: index, difficulty });
  });
  const questions = questionPackages.map((question) => normalizePayload(question, language));

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "reasoning-v1" as const,
      packageId: ARG_CP005_PACKAGE_ID,
      chapterId: ARG_CP005_CHAPTER_ID,
      checkpointId: ARG_CP005_CHECKPOINT_ID,
      seed: batchSeed,
      runtimeMode: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.runtimeMode,
      reviewStatus: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.reviewStatus,
      lifecycleStatus: "REVIEW_ONLY" as const,
      permanentQlCount: ARG_QL_IDS.length,
      permanentQlIds: ARG_QL_IDS,
      language,
      locale,
      difficulty: difficulty ?? null,
      qlId: explicitQl ?? null,
      eligibleQlIds: Object.freeze([...eligibleQls]),
      designTargetDifficulties: ARG_CP005_DESIGN_TARGET_DIFFICULTIES,
      supportedDifficulties: ARG_CP005_SUPPORTED_DIFFICULTIES,
      blockedDifficulties: ARG_CP005_BLOCKED_DIFFICULTIES,
      difficultyCoverageStatus: ARG_CP005_QUESTION_STUDIO_REVIEW_PACKAGE.difficultyCoverageStatus,
      revisionPolicy: "SOURCE_GENERATOR_ONLY" as const,
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
      integrationAuthority: ARG_CP005_QUESTION_STUDIO_AUTHORITY,
    }),
    questionPackages,
    questions,
  });
}
