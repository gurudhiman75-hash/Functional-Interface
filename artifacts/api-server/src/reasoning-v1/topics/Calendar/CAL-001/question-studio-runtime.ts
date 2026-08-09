import {
  CALENDAR_PERMANENT_QL_IDS,
  getCalendarPermanentContract,
  type CalendarFrozenSourcePrototypeId,
  type CalendarPermanentQlId,
} from "./permanent-contracts.ts";
import { generateCalendarQuestion } from "./runtime.ts";
import {
  generateLocalizedCalendarSourceGapQuestion,
  type LocalizedCalendarSourceGapQuestion,
} from "./source-gap-multilingual.ts";
import type { CalendarSourceGapPrototypeId } from "./source-gap-runtime.ts";
import type {
  CalendarPrototypeId,
  CalendarQuestionPackage,
  Difficulty,
  Locale,
} from "./types.ts";

export const CAL_001_QUESTION_STUDIO_VERSION =
  "CAL_001_QUESTION_STUDIO_V1" as const;
export const CAL_001_PACKAGE_ID = "CAL-001" as const;
export const CAL_001_QUESTION_STUDIO_LANGUAGES = ["en", "hi", "pa"] as const;

export type Cal001QuestionStudioLanguage =
  (typeof CAL_001_QUESTION_STUDIO_LANGUAGES)[number];
export type Cal001QuestionStudioDifficulty = "Easy" | "Medium" | "Hard";

export const CAL_001_QUESTION_STUDIO_ACTIVATION = {
  version: CAL_001_QUESTION_STUDIO_VERSION,
  packageId: CAL_001_PACKAGE_ID,
  permanentQlRange: "CAL-QL-001..036",
  permanentQlCount: CALENDAR_PERMANENT_QL_IDS.length,
  supportedLanguages: CAL_001_QUESTION_STUDIO_LANGUAGES,
  questionStudioVisible: true,
  questionStudioGeneratable: true,
  reviewAndRevisionEnabled: true,
  regenerationEnabled: true,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
} as const;

export const CAL_001_QUESTION_STUDIO_PACKAGE = {
  id: CAL_001_PACKAGE_ID,
  packageId: CAL_001_PACKAGE_ID,
  type: "reasoning-v1",
  section: "Reasoning",
  domain: "reasoning",
  topic: "Reasoning",
  subtopic: "Calendar",
  name: "CAL-001 Calendar",
  label: "Calendar — 36 Frozen Question Languages",
  generationDomain: "reasoning-v1",
  canonicalProblems: CALENDAR_PERMANENT_QL_IDS.map((qlId) => {
    const contract = getCalendarPermanentContract(qlId);
    return {
      id: qlId,
      label: `${qlId} — ${contract.studentTask}`,
    };
  }),
  cpIds: [...CALENDAR_PERMANENT_QL_IDS],
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: [...CAL_001_QUESTION_STUDIO_LANGUAGES],
  enabled: true,
  runtimeMode: "FROZEN_MULTILINGUAL_REVIEW",
  reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
  questionBankStatus: CAL_001_QUESTION_STUDIO_ACTIVATION.questionBankStatus,
  testEligibility: CAL_001_QUESTION_STUDIO_ACTIVATION.testEligibility,
  publiclyPublishable: CAL_001_QUESTION_STUDIO_ACTIVATION.publiclyPublishable,
  freezeStatus: "ENGLISH_HINDI_PUNJABI_FROZEN",
} as const;

export type Cal001QuestionStudioInput = Readonly<{
  difficultyBand?: Cal001QuestionStudioDifficulty;
  language?: Cal001QuestionStudioLanguage;
  seed?: string;
}>;

export type Cal001QuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  topic?: string;
  subtopic?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: Cal001QuestionStudioDifficulty | string | number;
  language?: Cal001QuestionStudioLanguage;
  seed?: string;
  count?: number;
}>;

type CalendarSourcePackage =
  | CalendarQuestionPackage
  | LocalizedCalendarSourceGapQuestion;

function hashSeed(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function normalizeSelectorText(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function localeForLanguage(language: Cal001QuestionStudioLanguage): Locale {
  if (language === "hi") return "hi-IN";
  if (language === "pa") return "pa-IN";
  return "en-IN";
}

function difficultyLabel(value: Difficulty | undefined): Cal001QuestionStudioDifficulty {
  if (value === "EASY") return "Easy";
  if (value === "HARD") return "Hard";
  return "Medium";
}

function normalizeDifficulty(value: unknown): Cal001QuestionStudioDifficulty | undefined {
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "easy") return "Easy";
    if (normalized === "medium" || normalized === "moderate") return "Medium";
    if (normalized === "hard") return "Hard";
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    if (value >= 6) return "Hard";
    if (value >= 3) return "Medium";
    return "Easy";
  }
  return undefined;
}

function sourceGapDifficulty(
  qlId: CalendarPermanentQlId,
): Cal001QuestionStudioDifficulty {
  return qlId === "CAL-QL-036" ? "Easy" : "Medium";
}

function isSourceGap(
  sourceId: CalendarFrozenSourcePrototypeId,
): sourceId is CalendarSourceGapPrototypeId {
  return sourceId.startsWith("CAL-GAP-PROT-");
}

function buildSourcePackage(
  qlId: CalendarPermanentQlId,
  sourceId: CalendarFrozenSourcePrototypeId,
  seed: number,
  locale: Locale,
): CalendarSourcePackage {
  if (isSourceGap(sourceId)) {
    return generateLocalizedCalendarSourceGapQuestion(sourceId, seed, locale);
  }
  return generateCalendarQuestion(sourceId as CalendarPrototypeId, seed, locale);
}

function sourcePackageDifficulty(
  qlId: CalendarPermanentQlId,
  pkg: CalendarSourcePackage,
): Cal001QuestionStudioDifficulty {
  return "difficulty" in pkg
    ? difficultyLabel(pkg.difficulty)
    : sourceGapDifficulty(qlId);
}

function selectSourcePackage(
  qlId: CalendarPermanentQlId,
  input: Cal001QuestionStudioInput,
): {
  sourceId: CalendarFrozenSourcePrototypeId;
  numericSeed: number;
  pkg: CalendarSourcePackage;
  difficulty: Cal001QuestionStudioDifficulty;
} {
  const contract = getCalendarPermanentContract(qlId);
  const language = input.language ?? "en";
  const locale = localeForLanguage(language);
  const seedText = input.seed ?? `${qlId}:${language}:question-studio`;
  const base = hashSeed(`${CAL_001_QUESTION_STUDIO_VERSION}:${seedText}:${qlId}`);
  const sourceStart = base % contract.sourcePrototypeIds.length;
  let fallback: {
    sourceId: CalendarFrozenSourcePrototypeId;
    numericSeed: number;
    pkg: CalendarSourcePackage;
    difficulty: Cal001QuestionStudioDifficulty;
  } | null = null;

  for (let attempt = 0; attempt < 256; attempt++) {
    const sourceId = contract.sourcePrototypeIds[
      (sourceStart + attempt) % contract.sourcePrototypeIds.length
    ]!;
    const numericSeed = (base + Math.imul(attempt + 1, 104729)) >>> 0;
    const pkg = buildSourcePackage(qlId, sourceId, numericSeed, locale);
    const difficulty = sourcePackageDifficulty(qlId, pkg);
    const candidate = { sourceId, numericSeed, pkg, difficulty };
    fallback ??= candidate;
    if (!input.difficultyBand || difficulty === input.difficultyBand) {
      return candidate;
    }
  }

  return fallback!;
}

function explanationLines(pkg: CalendarSourcePackage): string[] {
  return [
    pkg.explanation.observation,
    pkg.explanation.rule,
    ...pkg.explanation.working,
    pkg.explanation.conclusion,
    pkg.explanation.closestTrap
      ? `Common trap: ${pkg.explanation.closestTrap}`
      : "",
    "verification" in pkg.explanation && pkg.explanation.verification
      ? pkg.explanation.verification
      : "",
  ].filter(Boolean);
}

function sourceOptions(pkg: CalendarSourcePackage): string[] {
  return "optionValues" in pkg
    ? [...pkg.options]
    : pkg.options.map((option) => option.display);
}

function sourceAnswerIndex(pkg: CalendarSourcePackage): 0 | 1 | 2 | 3 {
  return pkg.answerIndex;
}

function sourceCanonicalAnswer(pkg: CalendarSourcePackage): unknown {
  return pkg.canonicalAnswer;
}

function sourceFingerprint(pkg: CalendarSourcePackage): string {
  return pkg.mathematicalFingerprint;
}

function sourceFacts(pkg: CalendarSourcePackage): Record<string, unknown> {
  return pkg.facts;
}

function sourceCheckpoint(pkg: CalendarSourcePackage): string {
  return pkg.checkpoint;
}

function sourcePrototype(pkg: CalendarSourcePackage): string {
  return pkg.prototypeAuthority;
}

export function getCal001ActivePermanentQlIds(): CalendarPermanentQlId[] {
  return [...CALENDAR_PERMANENT_QL_IDS];
}

export function runCal001QuestionStudioPipeline(
  qlId: CalendarPermanentQlId,
  input: Cal001QuestionStudioInput = {},
) {
  if (!CALENDAR_PERMANENT_QL_IDS.includes(qlId)) {
    throw new Error(`Unknown CAL-001 permanent question language: ${qlId}`);
  }

  const language = input.language ?? "en";
  if (!CAL_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`CAL-001 does not support language '${language}'.`);
  }

  const contract = getCalendarPermanentContract(qlId);
  const selected = selectSourcePackage(qlId, input);
  const options = sourceOptions(selected.pkg);
  const correctIndex = sourceAnswerIndex(selected.pkg);
  const answer = options[correctIndex]!;
  const sourceId = sourcePrototype(selected.pkg);
  const seed = input.seed ?? `${qlId}:${sourceId}:${selected.numericSeed}`;
  const questionId = `${qlId}:${sourceId}:${language}:${selected.numericSeed}`;
  const explanationId = `${qlId}-CAL-EXPLANATION-${language.toUpperCase()}-${CAL_001_QUESTION_STUDIO_VERSION}`;
  const lines = explanationLines(selected.pkg);

  const validationChecks = [
    {
      name: "permanent-identity",
      passed: contract.qlId === qlId,
      message: "Question is owned by the requested frozen permanent QL.",
    },
    {
      name: "source-authority-ownership",
      passed: contract.sourcePrototypeIds.includes(
        sourceId as CalendarFrozenSourcePrototypeId,
      ),
      message: "Selected source authority belongs to the permanent QL.",
    },
    {
      name: "four-unique-options",
      passed:
        options.length === 4 &&
        new Set(options).size === 4 &&
        correctIndex >= 0 &&
        correctIndex < options.length,
      message: "Question has four unique options and one valid answer index.",
    },
    {
      name: "multilingual-human-freeze",
      passed: CAL_001_QUESTION_STUDIO_ACTIVATION.supportedLanguages.includes(language),
      message: "Language is part of the approved multilingual freeze.",
    },
    {
      name: "question-studio-only-boundary",
      passed:
        CAL_001_QUESTION_STUDIO_ACTIVATION.questionStudioGeneratable &&
        CAL_001_QUESTION_STUDIO_ACTIVATION.questionBankStatus === "NOT_STORED" &&
        CAL_001_QUESTION_STUDIO_ACTIVATION.testEligibility === "INELIGIBLE" &&
        CAL_001_QUESTION_STUDIO_ACTIVATION.publiclyPublishable === false,
      message: "Question Studio is active while downstream delivery remains locked.",
    },
  ];
  const validation = {
    valid: validationChecks.every((check) => check.passed),
    checks: validationChecks,
  };
  if (!validation.valid) {
    throw new Error(
      `${qlId} ${language}: Question Studio validation failed: ${validationChecks
        .filter((check) => !check.passed)
        .map((check) => check.message)
        .join(" | ")}`,
    );
  }

  const traceability = {
    questionId,
    archetypeId: CAL_001_PACKAGE_ID,
    canonicalProblemId: qlId,
    questionLanguageId: qlId,
    explanationId,
    language,
    difficultyBand: selected.difficulty,
    taskKind: contract.solveAuthority,
    answerType: contract.answerType,
    checkpointIds: [...contract.checkpointIds],
    sourcePrototypeAuthority: sourceId,
    sourcePrototypeIds: [...contract.sourcePrototypeIds],
    studentTask: contract.studentTask,
    mathematicalFingerprint: sourceFingerprint(selected.pkg),
    generationMode: "FROZEN_MULTILINGUAL_REVIEW",
    reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
    questionStudioStatus: "ACTIVE",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    seed,
  } as const;

  return {
    archetypeId: CAL_001_PACKAGE_ID,
    canonicalProblemId: qlId,
    questionId,
    questionLanguageId: qlId,
    explanationId,
    language,
    difficultyBand: selected.difficulty,
    stem: selected.pkg.stem,
    answer,
    options,
    correctIndex,
    parameters: {
      archetypeId: CAL_001_PACKAGE_ID,
      canonicalProblemId: qlId,
      permanentQlId: qlId,
      sourcePrototypeAuthority: sourceId,
      checkpoint: sourceCheckpoint(selected.pkg),
      questionLanguageId: qlId,
      explanationId,
      language,
      difficultyBand: selected.difficulty,
      taskKind: contract.solveAuthority,
      answerType: contract.answerType,
      seed,
      runtimeMode: "FROZEN_MULTILINGUAL_REVIEW",
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
      questionStudioStatus: "ACTIVE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      mathematicalFingerprint: sourceFingerprint(selected.pkg),
      facts: sourceFacts(selected.pkg),
    },
    solver: {
      answer,
      canonicalAnswer: sourceCanonicalAnswer(selected.pkg),
      answerType: contract.answerType,
      evidence: {
        permanentQlId: qlId,
        sourcePrototypeAuthority: sourceId,
        mathematicalFingerprint: sourceFingerprint(selected.pkg),
        crossCheckPassed:
          "crossCheck" in selected.pkg ? selected.pkg.crossCheck.passed : true,
      },
      mathJax: {},
    },
    reasoningGraph: {
      graphId: `${questionId}-graph`,
      nodes: [
        { id: "authority", label: "Solve authority", value: contract.solveAuthority },
        { id: "source", label: "Source prototype", value: sourceId },
        { id: "answer", label: "Verified answer", value: answer },
        {
          id: "delivery",
          label: "Delivery boundary",
          value: "QUESTION_STUDIO_ONLY",
        },
      ],
    },
    explanation: {
      explanationId,
      lines,
    },
    traceability,
    validation,
    mathJax: {},
  } as const;
}

export function isCal001GenerationRequest(
  request: Cal001QuestionStudioRequest,
): boolean {
  const explicit = String(request.packageId ?? request.archetypeId ?? "")
    .trim()
    .toUpperCase();
  if (explicit === CAL_001_PACKAGE_ID) return true;

  const pattern = String(request.patternId ?? "").trim().toUpperCase();
  if (pattern === CAL_001_PACKAGE_ID || pattern.startsWith("CAL-QL-")) return true;

  const topic = normalizeSelectorText(request.topic);
  const subtopic = normalizeSelectorText(request.subtopic);
  return (
    subtopic === "calendar" ||
    topic === "calendar" ||
    (topic === "reasoning" && subtopic.includes("calendar"))
  );
}

function resolveQlId(request: Cal001QuestionStudioRequest): CalendarPermanentQlId | undefined {
  const explicit = String(
    request.canonicalProblemId ?? request.cpId ?? request.patternId ?? "",
  )
    .trim()
    .toUpperCase();
  if (!explicit || explicit === CAL_001_PACKAGE_ID) return undefined;
  if (
    CALENDAR_PERMANENT_QL_IDS.includes(explicit as CalendarPermanentQlId)
  ) {
    return explicit as CalendarPermanentQlId;
  }
  throw new Error(`Unknown CAL-001 permanent question language '${explicit}'.`);
}

function shuffledQlIds(seed: string): CalendarPermanentQlId[] {
  const values = [...CALENDAR_PERMANENT_QL_IDS];
  let state = hashSeed(seed) || 1;
  for (let index = values.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [values[index], values[swapIndex]] = [values[swapIndex]!, values[index]!];
  }
  return values;
}

export function toCal001QuestionStudioPreview(
  pkg: ReturnType<typeof runCal001QuestionStudioPipeline>,
  seed: string,
) {
  const explanation = pkg.explanation.lines.join("\n\n");
  return {
    text: pkg.stem,
    stem: pkg.stem,
    options: [...pkg.options],
    correct: pkg.correctIndex,
    correctIndex: pkg.correctIndex,
    explanation,
    packageExplanation: pkg.explanation,
    difficulty: pkg.difficultyBand,
    difficultyLabel: pkg.difficultyBand,
    patternId: CAL_001_PACKAGE_ID,
    section: "Reasoning",
    topic: "Reasoning",
    subtopic: "Calendar",
    generationBackend: "reasoning-v1",
    debugSource: "cal-001-permanent-runtime",
    reasoningGraph: pkg.reasoningGraph,
    semanticMetadata: pkg.traceability,
    traceability: pkg.traceability,
    validation: pkg.validation,
    questionId: pkg.questionId,
    seed,
    answer: pkg.answer,
    canonicalAnswer: pkg.solver.canonicalAnswer,
    runtimeMode: pkg.parameters.runtimeMode,
    reviewStatus: pkg.parameters.reviewStatus,
    questionStudioStatus: pkg.parameters.questionStudioStatus,
    questionBankStatus: pkg.parameters.questionBankStatus,
    testEligibility: pkg.parameters.testEligibility,
    publiclyPublishable: pkg.parameters.publiclyPublishable,
    packageSource: "cal-001-permanent-runtime",
    packageId: CAL_001_PACKAGE_ID,
    canonicalProblemId: pkg.canonicalProblemId,
    questionLanguageId: pkg.questionLanguageId,
    taskKind: pkg.traceability.taskKind,
    scenarioId: pkg.traceability.sourcePrototypeAuthority,
    language: pkg.language,
    metadata: {
      language: pkg.language,
      packageId: CAL_001_PACKAGE_ID,
      canonicalProblemId: pkg.canonicalProblemId,
      permanentQlId: pkg.canonicalProblemId,
      questionLanguageId: pkg.questionLanguageId,
      explanationId: pkg.explanationId,
      taskKind: pkg.traceability.taskKind,
      scenarioId: pkg.traceability.sourcePrototypeAuthority,
      sourcePrototypeAuthority: pkg.traceability.sourcePrototypeAuthority,
      mathematicalFingerprint: pkg.traceability.mathematicalFingerprint,
      runtimeMode: pkg.parameters.runtimeMode,
      reviewStatus: pkg.parameters.reviewStatus,
      questionStudioStatus: pkg.parameters.questionStudioStatus,
      questionBankStatus: pkg.parameters.questionBankStatus,
      testEligibility: pkg.parameters.testEligibility,
      publiclyPublishable: pkg.parameters.publiclyPublishable,
    },
  };
}

export async function generateCal001QuestionStudioBatch(
  request: Cal001QuestionStudioRequest = {},
) {
  const language = request.language ?? "en";
  if (!CAL_001_QUESTION_STUDIO_LANGUAGES.includes(language)) {
    throw new Error(`CAL-001 does not support language '${String(language)}'.`);
  }
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const requestedQlId = resolveQlId(request);
  const difficultyBand = normalizeDifficulty(request.difficulty);
  const batchSeed = request.seed ?? [
    CAL_001_QUESTION_STUDIO_VERSION,
    requestedQlId ?? "mixed",
    language,
    Date.now(),
    Math.random().toString(36).slice(2),
  ].join(":");
  const qlOrder = requestedQlId
    ? [requestedQlId]
    : shuffledQlIds(`${batchSeed}:ql-order`);
  const questionPackages: Array<ReturnType<typeof runCal001QuestionStudioPipeline>> = [];
  const questions: Array<ReturnType<typeof toCal001QuestionStudioPreview>> = [];

  for (let index = 0; index < count; index++) {
    const qlId = qlOrder[index % qlOrder.length]!;
    const seed = `${batchSeed}:${qlId}:${index}`;
    const pkg = runCal001QuestionStudioPipeline(qlId, {
      difficultyBand,
      language,
      seed,
    });
    questionPackages.push(pkg);
    questions.push(toCal001QuestionStudioPreview(pkg, seed));
  }

  return {
    generationContext: {
      generationDomain: "reasoning-v1",
      packageId: CAL_001_PACKAGE_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      runtimeMode: "FROZEN_MULTILINGUAL_REVIEW",
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
      questionStudioStatus: "ACTIVE",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      permanentQlRange: "CAL-QL-001..036",
      language,
    },
    questionPackages,
    questions,
  };
}
