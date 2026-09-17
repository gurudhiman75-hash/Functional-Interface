import { randomUUID } from "node:crypto";

import {
  previewMenCp009QuestionStudioReview,
  type MenCp009QuestionStudioDifficulty,
  type MenCp009QuestionStudioLanguage,
} from "./question-studio-review-adapter";
import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  getMensurationPatternRealismMetadataV2,
  type MensurationQuestionStudioExamProfile,
} from "../../mensuration-question-studio-selection-v2";
import {
  generateMensurationLocalizedQuestionV1,
  type MensurationStudioLanguage,
} from "../../localization/mensuration-localization-runtime-v1";

export const MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID = "MEN-002" as const;
export const MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID = "MEN-CP-009" as const;

export const MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Mensuration",
  name: "MEN-002 Mensuration — Spheres & Hemispheres",
  label: "Mensuration — Spheres & Hemispheres",
  generationDomain: "quant-v4",
  cpIds: [MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID],
  canonicalProblems: [
    {
      id: MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
      label: "Spheres & Hemispheres",
    },
  ],
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: ["en", "hi", "pa"],
  enabled: true,
} as const);

const MEN002_FULL_CHAPTER_PATTERNS = MENSURATION_QUESTION_STUDIO_PATTERNS.filter(
  (pattern) => pattern.packageId === MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
);

const MEN002_FULL_CHAPTER_CP_IDS = Object.freeze(
  [...new Set(MEN002_FULL_CHAPTER_PATTERNS.map((pattern) => pattern.cpId))].sort(),
);

export const MEN_002_FULL_CHAPTER_QUESTION_STUDIO_PACKAGE = Object.freeze({
  id: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
  type: "quant-v4",
  section: "Quant",
  domain: "quant",
  topic: "Advanced Mathematics",
  subtopic: "Mensuration",
  name: "MEN-002 Solid Mensuration, Recasting & Composite Solids",
  label: "Solid Mensuration, Recasting & Composite Solids",
  generationDomain: "quant-v4",
  cpIds: MEN002_FULL_CHAPTER_CP_IDS,
  canonicalProblems: MEN002_FULL_CHAPTER_CP_IDS.map((cpId) => ({ id: cpId, label: cpId })),
  supportedDifficulties: ["easy", "medium", "hard"],
  supportedLanguages: ["en", "hi", "pa"],
  enabled: true,
  runtimeMode: "FULL_CHAPTER_REALISM_V2",
  reviewStatus: "CHAPTER_REVIEWED_SOURCE_WITH_RELEASE_LOCK",
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
} as const);

export type MenCp009StandardQuestionStudioRequest = Readonly<{
  packageId?: string;
  archetypeId?: string;
  patternId?: string;
  canonicalProblemId?: string;
  cpId?: string;
  difficulty?: string | number;
  language?: MenCp009QuestionStudioLanguage;
  examProfile?: string;
  seed?: string;
  count?: number;
}>;

function normalizeDifficulty(
  value: MenCp009StandardQuestionStudioRequest["difficulty"],
): MenCp009QuestionStudioDifficulty | undefined {
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

function selectedPackageId(request: MenCp009StandardQuestionStudioRequest) {
  return String(request.packageId ?? request.archetypeId ?? "").trim().toUpperCase();
}

export function isMenCp009StandardQuestionStudioRequest(
  request: MenCp009StandardQuestionStudioRequest,
) {
  const packageId = selectedPackageId(request);
  const patternId = String(request.patternId ?? "").trim().toUpperCase();
  const cpId = String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();

  return (
    packageId === MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID ||
    patternId === MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID ||
    cpId === MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID
  );
}

function toStandardQuestion(
  question: ReturnType<typeof previewMenCp009QuestionStudioReview>["questions"][number],
) {
  return {
    text: question.stem,
    stem: question.stem,
    options: [...question.options],
    correct: question.correctIndex,
    correctIndex: question.correctIndex,
    answer: question.answer,
    canonicalAnswer: question.answer,
    explanation: [...question.explanation.steps].join("\n"),
    richExplanation: question.explanation,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.qlId,
    packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
    canonicalProblemId: MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.parameters.seed,
    renderer: question.renderer,
    traceability: question.traceability,
    validation: question.validation,
  };
}

function hashText(text: string) {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function mixedHash(text: string) {
  let value = hashText(text) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d) >>> 0;
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b) >>> 0;
  value ^= value >>> 16;
  return value >>> 0;
}

function resolveMensurationExamProfile(value: unknown): MensurationQuestionStudioExamProfile {
  const profile = String(value ?? "").trim().toUpperCase();
  if (profile.includes("PUNJAB")) return "PUNJAB_STATE";
  if (profile.includes("BANK")) return "BANKING";
  if (profile.includes("TIER_II") || profile.includes("TIER-II") || profile.includes("JSO") || profile.includes("ADVANCED")) {
    return "SSC_ADVANCED";
  }
  return "SSC_CORE";
}

function explicitCpId(request: MenCp009StandardQuestionStudioRequest) {
  return String(request.canonicalProblemId ?? request.cpId ?? "").trim().toUpperCase();
}

function shouldUseLegacyCp009Route(request: MenCp009StandardQuestionStudioRequest) {
  const cpId = explicitCpId(request);
  const patternId = String(request.patternId ?? "").trim().toUpperCase();
  return cpId === MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID
    || patternId === MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID;
}

function weightedPattern(
  eligible: typeof MEN002_FULL_CHAPTER_PATTERNS,
  examProfile: MensurationQuestionStudioExamProfile,
  seed: string,
) {
  const rows = eligible.map((pattern) => ({
    pattern,
    weight: getMensurationPatternRealismMetadataV2(pattern).profileWeights[examProfile],
  }));
  const total = rows.reduce((sum, row) => sum + row.weight, 0);
  let ticket = (mixedHash(seed) / 0x100000000) * total;
  for (const row of rows) {
    ticket -= row.weight;
    if (ticket < 0) return row.pattern;
  }
  return rows[rows.length - 1]!.pattern;
}

function toFullChapterStandardQuestion(question: any) {
  const richExplanation = question.explanation ?? { steps: [], shortcut: "", traps: [] };
  const steps = Array.isArray(richExplanation.steps) ? richExplanation.steps.map(String) : [];
  return {
    text: String(question.stem ?? ""),
    stem: String(question.stem ?? ""),
    options: Array.isArray(question.options) ? [...question.options] : [],
    correct: Number(question.correctIndex),
    correctIndex: Number(question.correctIndex),
    answer: String(question.answer ?? ""),
    canonicalAnswer: String(question.answer ?? ""),
    explanation: steps.join("\n"),
    richExplanation,
    difficulty: question.difficultyBand,
    difficultyLabel: question.difficultyBand,
    patternId: question.patternId,
    packageId: question.packageId,
    canonicalProblemId: question.cpId,
    questionLanguageId: question.questionLanguageId,
    questionId: question.questionId,
    topic: "Advanced Mathematics",
    subtopic: "Mensuration",
    subject: "Quantitative Aptitude",
    language: question.language,
    locale: question.locale,
    seed: question.seed,
    renderer: question.renderer,
    traceability: {
      integrationAuthority: question.integrationAuthority,
      realism: question.realism,
      localization: question.localization ?? null,
      sourceAuthority: question.sourceAuthority,
      sourceReviewStatus: question.sourceReviewStatus,
      sourceMaturity: question.sourceMaturity,
    },
    validation: question.validation,
    realism: question.realism,
    solveMode: question.solveMode,
    testEligible: false,
    publiclyPublishable: false,
    questionBankWritable: false,
    questionBankStatus: "NOT_STORED",
  };
}

function generateMen002FullChapterBatch(
  request: MenCp009StandardQuestionStudioRequest,
) {
  const language = (request.language ?? "en") as MensurationStudioLanguage;
  const difficulty = normalizeDifficulty(request.difficulty);
  const examProfile = resolveMensurationExamProfile(request.examProfile);
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const batchSeed = request.seed?.trim() || [
    MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
    "FULL_CHAPTER",
    language,
    examProfile,
    difficulty ?? "mixed",
    Date.now(),
    randomUUID(),
  ].join(":");
  const cpId = explicitCpId(request);
  const requestedPatternId = String(request.patternId ?? "").trim();

  let eligible = MEN002_FULL_CHAPTER_PATTERNS.filter((pattern) => !cpId || pattern.cpId === cpId);
  if (requestedPatternId) eligible = eligible.filter((pattern) => pattern.patternId === requestedPatternId);
  if (!eligible.length) {
    throw new Error(`No MEN-002 full-chapter pattern matched cp='${cpId || "mixed"}' pattern='${requestedPatternId || "mixed"}'.`);
  }

  const questions: any[] = [];
  const numericalStates = new Set<string>();
  const exactStates = new Set<string>();
  const recentPatterns: string[] = [];
  for (let attempt = 0; questions.length < count && attempt < count * 2048; attempt += 1) {
    const pattern = requestedPatternId
      ? eligible[0]!
      : weightedPattern(eligible, examProfile, `${batchSeed}:pattern:${attempt}`);
    if (!requestedPatternId && eligible.length >= 8 && recentPatterns.slice(-3).includes(pattern.patternId)) continue;

    const sourceSeed = `${batchSeed}:${questions.length}:${attempt}`;
    const question = generateMensurationLocalizedQuestionV1({
      patternId: pattern.patternId,
      seed: sourceSeed,
      examProfile,
      language,
    });
    if (difficulty && question.difficultyBand !== difficulty) continue;

    const exact = `${question.patternId}|${question.stem}|${question.options.join("|")}`;
    const numericalState = String(question.realism?.numericalStateSignature ?? exact);
    if (exactStates.has(exact) || numericalStates.has(numericalState)) continue;

    exactStates.add(exact);
    numericalStates.add(numericalState);
    recentPatterns.push(question.patternId);
    questions.push(toFullChapterStandardQuestion(question));
  }

  if (questions.length !== count) {
    throw new Error(`Unable to construct ${count} MEN-002 full-chapter questions for the requested filters/profile.`);
  }

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: "MEN-002-FULL-CHAPTER",
      seed: batchSeed,
      timestamp: Date.now(),
      sourceAuthority: "MENSURATION-FULL-CHAPTER-QUESTION-STUDIO-REALISM-V2",
      examProfile,
      language,
      cpId: cpId || null,
      difficulty: difficulty ?? null,
      publiclyPublishable: false,
      testEligibility: "INELIGIBLE",
    }),
    questionPackages: questions,
    questions,
  });
}

export function generateMenCp009StandardQuestionStudioBatch(
  request: MenCp009StandardQuestionStudioRequest = {},
) {
  // Historical checkpoint-specific requests stay on the human-reviewed CP-009
  // adapter. A package-level MEN-002 request now uses the existing full-chapter
  // Mensuration V2 runtime instead of silently collapsing the package to spheres.
  if (!shouldUseLegacyCp009Route(request)) {
    return generateMen002FullChapterBatch(request);
  }

  const language = request.language ?? "en";
  const count = Math.min(50, Math.max(1, Math.floor(Number(request.count ?? 1) || 1)));
  const difficulty = normalizeDifficulty(request.difficulty);
  const batchSeed =
    request.seed?.trim() ||
    [
      MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
      language,
      difficulty ?? "mixed",
      Date.now(),
      randomUUID(),
    ].join(":");

  const generated = previewMenCp009QuestionStudioReview({
    language,
    difficulty,
    count,
    seed: batchSeed,
  });
  const questions = generated.questions.map(toStandardQuestion);

  return Object.freeze({
    generationContext: Object.freeze({
      generationDomain: "quant-v4" as const,
      packageId: MEN_CP009_STANDARD_QUESTION_STUDIO_PACKAGE_ID,
      checkpointId: MEN_CP009_STANDARD_QUESTION_STUDIO_CHECKPOINT_ID,
      seed: batchSeed,
      timestamp: Date.now(),
      sourceAuthority: generated.generationContext.integrationAuthority,
    }),
    questionPackages: questions,
    questions,
  });
}
