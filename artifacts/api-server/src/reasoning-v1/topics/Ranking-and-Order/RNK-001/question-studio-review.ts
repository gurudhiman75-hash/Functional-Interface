import { generateRnkCp001PermanentQuestion, RNK_CP001_PERMANENT_QL_IDS } from "./RNK-CP-001/cp001-permanent-runtime";
import { generateRnkCp002PermanentQuestion, RNK_CP002_PERMANENT_QL_IDS } from "./RNK-CP-002/cp002-permanent-runtime";
import { generateRnkCp003PermanentQuestion, RNK_CP003_PERMANENT_QL_IDS } from "./RNK-CP-003/cp003-permanent-runtime";
import { buildRnkCp004PermanentRuntime, RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS } from "./RNK-CP-004/cp004-permanent-runtime-v1";
import { buildRnkCp005PermanentRuntime, RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS } from "./RNK-CP-005/cp005-permanent-runtime-v1";
import { buildRnkCp006PermanentRuntime, RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS } from "./RNK-CP-006/cp006-permanent-runtime-v1";
import { buildRnkCp007PermanentRuntime, RNK_CP007_PERMANENT_QL_ID } from "./RNK-CP-007/cp007-permanent-runtime-v1";
import { adaptRnkQuestionForBankingFiveOptions } from "./rnk-001-banking-five-option-adapter-v1";
import { auditRnkExamModeMix, rnkExamRealismTier, type RnkExamRealismTier } from "./rnk-001-exam-delivery-policy-v1";

export const RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY =
  "RNK-001-QUESTION-STUDIO-REVIEW-V1" as const;
export const RNK_001_QUESTION_STUDIO_REVIEW_STATUS =
  "ENGLISH_FROZEN_EXAM_PROFILE_REVIEW_ONLY" as const;
export const RNK_001_QUESTION_STUDIO_RELEASE_FREEZE =
  "ENGLISH_ONLY_REVIEW_PENDING_MULTILINGUAL_CONSOLIDATION" as const;

export const RNK_001_QUESTION_STUDIO_LANGUAGES = ["en"] as const;
export const RNK_001_QUESTION_STUDIO_DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
export type RnkQuestionStudioLanguage = typeof RNK_001_QUESTION_STUDIO_LANGUAGES[number];
export type RnkQuestionStudioDifficulty = typeof RNK_001_QUESTION_STUDIO_DIFFICULTIES[number];
export type RnkQuestionStudioExamProfileId =
  | "CHAPTER_COVERAGE"
  | "SSC_CGL_T1"
  | "SSC_CHSL_T1"
  | "SSC_MTS"
  | "IBPS_PO_PRE"
  | "IBPS_CLERK_PRE"
  | "PUNJAB_PSSSB_CLERK"
  | "PUNJAB_EXCISE_INSP"
  | "PUNJAB_POLICE";

type AnyQuestion = Record<string, any>;

const ALL_QL_IDS = [
  ...RNK_CP001_PERMANENT_QL_IDS,
  ...RNK_CP002_PERMANENT_QL_IDS,
  ...RNK_CP003_PERMANENT_QL_IDS,
  ...RNK_CP004_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  ...RNK_CP005_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  ...RNK_CP006_PERMANENT_AUTHORITY_ASSIGNMENTS.map((entry) => entry.qlId),
  RNK_CP007_PERMANENT_QL_ID,
] as readonly string[];

const CP004 = buildRnkCp004PermanentRuntime() as readonly AnyQuestion[];
const CP005 = buildRnkCp005PermanentRuntime() as readonly AnyQuestion[];
const CP006 = buildRnkCp006PermanentRuntime() as readonly AnyQuestion[];
const CP007 = buildRnkCp007PermanentRuntime() as readonly AnyQuestion[];

const TIER_ORDER = ["CORE", "SECONDARY", "ADVANCED", "SOURCE_SPECIFIC"] as const;

const TIER_QLS: Readonly<Record<RnkExamRealismTier, readonly string[]>> = Object.freeze({
  CORE: ALL_QL_IDS.filter((qlId) => rnkExamRealismTier(qlId) === "CORE"),
  SECONDARY: ALL_QL_IDS.filter((qlId) => rnkExamRealismTier(qlId) === "SECONDARY"),
  ADVANCED: ALL_QL_IDS.filter((qlId) => rnkExamRealismTier(qlId) === "ADVANCED"),
  SOURCE_SPECIFIC: ALL_QL_IDS.filter((qlId) => rnkExamRealismTier(qlId) === "SOURCE_SPECIFIC"),
});

const PROFILE_WEIGHTS: Readonly<Record<Exclude<RnkQuestionStudioExamProfileId, "CHAPTER_COVERAGE">, Readonly<Record<RnkExamRealismTier, number>>>> = Object.freeze({
  SSC_CGL_T1: { CORE: 80, SECONDARY: 15, ADVANCED: 4, SOURCE_SPECIFIC: 1 },
  SSC_CHSL_T1: { CORE: 82, SECONDARY: 14, ADVANCED: 3, SOURCE_SPECIFIC: 1 },
  SSC_MTS: { CORE: 88, SECONDARY: 10, ADVANCED: 1, SOURCE_SPECIFIC: 1 },
  IBPS_PO_PRE: { CORE: 70, SECONDARY: 20, ADVANCED: 8, SOURCE_SPECIFIC: 2 },
  IBPS_CLERK_PRE: { CORE: 75, SECONDARY: 18, ADVANCED: 6, SOURCE_SPECIFIC: 1 },
  PUNJAB_PSSSB_CLERK: { CORE: 84, SECONDARY: 12, ADVANCED: 3, SOURCE_SPECIFIC: 1 },
  PUNJAB_EXCISE_INSP: { CORE: 82, SECONDARY: 14, ADVANCED: 3, SOURCE_SPECIFIC: 1 },
  PUNJAB_POLICE: { CORE: 88, SECONDARY: 10, ADVANCED: 1, SOURCE_SPECIFIC: 1 },
});

export const RNK_001_QUESTION_STUDIO_REVIEW_PACKAGE = Object.freeze({
  packageId: "RNK-001" as const,
  chapterId: "RNK-001" as const,
  label: "Ranking & Order",
  subject: "Reasoning Ability",
  topic: "Reasoning",
  subtopic: "Ranking & Order",
  permanentQlCount: 42,
  permanentQlRange: "RNK-QL-001..042",
  permanentQlAllocationStatus: "ALLOCATED_FROZEN" as const,
  supportedLanguages: RNK_001_QUESTION_STUDIO_LANGUAGES,
  supportedDifficulties: RNK_001_QUESTION_STUDIO_DIFFICULTIES,
  supportedExamProfiles: Object.keys(PROFILE_WEIGHTS) as readonly Exclude<RnkQuestionStudioExamProfileId, "CHAPTER_COVERAGE">[],
  runtimeMode: "RNK-001-FROZEN-AUTHORITY-REVIEW-V1",
  reviewStatus: RNK_001_QUESTION_STUDIO_REVIEW_STATUS,
  integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
  releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  questionStudioRegistrationStatus: "REGISTERED_REVIEW_ONLY" as const,
  questionStudioVisible: true as const,
  reviewOnly: true as const,
  englishOnlyUntilMultilingualConsolidation: true as const,
  percentageAdapterStatus: "V2_NATIVE_GRAMMAR_PENDING_BRANCH_CONSOLIDATION" as const,
  questionBankStatus: "NOT_STORED" as const,
  questionBankWritable: false as const,
  testEligibility: "INELIGIBLE" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
  automaticStudentPublication: false as const,
  manualApprovalRequired: true as const,
});

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function deterministicShuffle<T>(items: readonly T[], seed: string): T[] {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swap = stableHash(`${seed}:shuffle:${index}`) % (index + 1);
    [output[index], output[swap]] = [output[swap]!, output[index]!];
  }
  return output;
}

function normalizeDifficulty(value: unknown): RnkQuestionStudioDifficulty | undefined {
  const text = String(value ?? "").trim().toLowerCase();
  if (!text || text === "mixed") return undefined;
  if (text === "easy") return "Easy";
  if (text === "medium" || text === "moderate") return "Medium";
  if (text === "hard") return "Hard";
  throw new Error(`Unsupported RNK-001 difficulty '${String(value)}'.`);
}

function questionDifficulty(question: AnyQuestion): RnkQuestionStudioDifficulty {
  const text = String(question.difficulty ?? question.difficultyBand ?? "Medium").toLowerCase();
  if (text.includes("easy")) return "Easy";
  if (text.includes("hard")) return "Hard";
  return "Medium";
}

function qlNumber(qlId: string): number {
  const match = /^RNK-QL-(\d{3})$/u.exec(qlId);
  if (!match) throw new Error(`Invalid RNK QL id '${qlId}'.`);
  return Number(match[1]);
}

function selectFrozenBankQuestion(bank: readonly AnyQuestion[], qlId: string, seed: number): AnyQuestion {
  const candidates = bank.filter((question) =>
    String(question.permanentProfile?.permanentQlId ?? question.reviewMetadata?.permanentProfile?.permanentQlId) === qlId,
  );
  if (candidates.length === 0) throw new Error(`No frozen RNK question found for ${qlId}.`);
  return candidates[stableHash(`${qlId}:${seed}`) % candidates.length]!;
}

function rawQuestionForQl(qlId: string, seed: number): AnyQuestion {
  const number = qlNumber(qlId);
  if (number <= 9) return generateRnkCp001PermanentQuestion(qlId as any, seed) as unknown as AnyQuestion;
  if (number <= 17) return generateRnkCp002PermanentQuestion(qlId as any, seed) as unknown as AnyQuestion;
  if (number <= 26) return generateRnkCp003PermanentQuestion(qlId as any, seed) as unknown as AnyQuestion;
  if (number <= 35) return selectFrozenBankQuestion(CP004, qlId, seed);
  if (number <= 38) return selectFrozenBankQuestion(CP005, qlId, seed);
  if (number <= 41) return selectFrozenBankQuestion(CP006, qlId, seed);
  return selectFrozenBankQuestion(CP007, qlId, seed);
}

function questionForQl(qlId: string, seed: number, difficulty?: RnkQuestionStudioDifficulty): AnyQuestion {
  if (!difficulty) return rawQuestionForQl(qlId, seed);
  for (let attempt = 0; attempt < 64; attempt += 1) {
    const question = rawQuestionForQl(qlId, stableHash(`${seed}:difficulty:${attempt}`));
    if (questionDifficulty(question) === difficulty) return question;
  }
  throw new Error(`${qlId} could not produce ${difficulty} within the bounded RNK review search.`);
}

function profileTierPlan(
  profileId: Exclude<RnkQuestionStudioExamProfileId, "CHAPTER_COVERAGE">,
  count: number,
  seed: string,
): readonly RnkExamRealismTier[] {
  const weights = PROFILE_WEIGHTS[profileId];
  const allocations = TIER_ORDER.map((tier, order) => {
    const exact = (count * weights[tier]) / 100;
    const base = Math.floor(exact);
    return { tier, order, count: base, remainder: exact - base };
  });
  let remaining = count - allocations.reduce((sum, entry) => sum + entry.count, 0);
  allocations
    .slice()
    .sort((left, right) => right.remainder - left.remainder || left.order - right.order)
    .forEach((entry) => {
      if (remaining > 0) {
        entry.count += 1;
        remaining -= 1;
      }
    });
  const plan = allocations.flatMap((entry) => Array.from({ length: entry.count }, () => entry.tier));
  if (plan.length !== count) throw new Error(`${profileId} tier allocation produced ${plan.length}/${count}`);
  return deterministicShuffle(plan, `${profileId}:${seed}:tier-plan`);
}

function questionForTier(
  tier: RnkExamRealismTier,
  seed: string,
  index: number,
  difficulty?: RnkQuestionStudioDifficulty,
): { qlId: string; question: AnyQuestion } {
  const primary = deterministicShuffle(TIER_QLS[tier], `${seed}:${index}:${tier}:ql-order`);
  const fallback = tier === "CORE"
    ? []
    : deterministicShuffle(TIER_QLS.CORE, `${seed}:${index}:${tier}:core-fallback`);
  let lastError: unknown = null;
  for (const qlId of [...primary, ...fallback]) {
    try {
      const numericSeed = stableHash(`${seed}:${index}:${qlId}`);
      return { qlId, question: questionForQl(qlId, numericSeed, difficulty) };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error(`No RNK-001 ${tier} authority supports the requested filters.`);
}

function optionText(option: unknown): string {
  if (typeof option === "object" && option !== null) {
    const record = option as Record<string, unknown>;
    return String(record.label ?? record.value ?? record.answer ?? record.answerKey ?? "");
  }
  return String(option);
}

function misconceptionId(option: unknown): string | null {
  if (typeof option !== "object" || option === null) return null;
  const value = (option as Record<string, unknown>).misconceptionId;
  return value == null ? null : String(value);
}

function explanationText(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return String(value ?? "");
  const record = value as Record<string, unknown>;
  const parts: string[] = [];
  for (const key of ["mentalPicture", "keyRule", "examSpeedShortcut", "conclusion"] as const) {
    if (typeof record[key] === "string") parts.push(String(record[key]));
  }
  for (const key of ["steps", "stepByStepSolution", "optionAnalysis"] as const) {
    if (Array.isArray(record[key])) parts.push(...(record[key] as unknown[]).map(String));
  }
  return parts.length ? parts.join("\n") : JSON.stringify(value);
}

function checkpointForQl(qlId: string): string {
  const value = qlNumber(qlId);
  if (value <= 9) return "RNK-CP-001";
  if (value <= 17) return "RNK-CP-002";
  if (value <= 26) return "RNK-CP-003";
  if (value <= 35) return "RNK-CP-004";
  if (value <= 38) return "RNK-CP-005";
  if (value <= 41) return "RNK-CP-006";
  return "RNK-CP-007";
}

export interface RnkQuestionStudioReviewQuestion {
  readonly packageId: "RNK-001";
  readonly chapterId: "RNK-001";
  readonly checkpointId: string;
  readonly qlId: string;
  readonly permanentQlId: string;
  readonly patternId: string;
  readonly questionId: string;
  readonly language: "en";
  readonly locale: "en-IN";
  readonly difficultyBand: RnkQuestionStudioDifficulty;
  readonly stem: string;
  readonly displayStem: string;
  readonly options: readonly string[];
  readonly optionDetails: readonly { label: string; text: string; isCorrect: boolean; misconceptionId: string | null }[];
  readonly correctIndex: number;
  readonly answer: string;
  readonly explanation: string;
  readonly seed: number;
  readonly examProfileId: RnkQuestionStudioExamProfileId;
  readonly realismTier: RnkExamRealismTier;
  readonly optionCount: number;
  readonly questionStudioVisible: true;
  readonly lifecycleStatus: "REVIEW_ONLY";
  readonly validation: { valid: boolean; optionsDistinct: boolean; exactlyOneCorrect: boolean; frozenQl: true };
  readonly source: AnyQuestion;
}

function reviewQuestion(rawInput: AnyQuestion, qlId: string, seed: number, examProfileId: RnkQuestionStudioExamProfileId): RnkQuestionStudioReviewQuestion {
  const raw = examProfileId.startsWith("IBPS_")
    ? adaptRnkQuestionForBankingFiveOptions(rawInput, "en-IN")
    : rawInput;
  const optionsRaw = raw.options as readonly unknown[];
  const options = optionsRaw.map(optionText);
  const correctIndex = Number.isInteger(raw.correctIndex) ? Number(raw.correctIndex) : Number(raw.answerIndex);
  if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
    throw new Error(`${qlId} produced an invalid correct option index.`);
  }
  const answer = options[correctIndex]!;
  const optionsDistinct = new Set(options).size === options.length;
  const exactlyOneCorrect = options.filter((option) => option === answer).length === 1;
  const stem = String(raw.stem ?? raw.instruction ?? "");
  return {
    packageId: "RNK-001",
    chapterId: "RNK-001",
    checkpointId: checkpointForQl(qlId),
    qlId,
    permanentQlId: qlId,
    patternId: qlId,
    questionId: `RNK-001:${qlId}:${seed}:en`,
    language: "en",
    locale: "en-IN",
    difficultyBand: questionDifficulty(raw),
    stem,
    displayStem: stem,
    options,
    optionDetails: optionsRaw.map((option, index) => ({
      label: String.fromCharCode(65 + index),
      text: optionText(option),
      isCorrect: index === correctIndex,
      misconceptionId: misconceptionId(option),
    })),
    correctIndex,
    answer,
    explanation: explanationText(raw.explanation),
    seed,
    examProfileId,
    realismTier: rnkExamRealismTier(qlId),
    optionCount: options.length,
    questionStudioVisible: true,
    lifecycleStatus: "REVIEW_ONLY",
    validation: {
      valid: optionsDistinct && exactlyOneCorrect && stem.length > 0,
      optionsDistinct,
      exactlyOneCorrect,
      frozenQl: true,
    },
    source: raw,
  };
}

export interface PreviewRnk001QuestionStudioInput {
  readonly language?: RnkQuestionStudioLanguage;
  readonly qlId?: string;
  readonly difficulty?: RnkQuestionStudioDifficulty | "Mixed";
  readonly examProfileId?: RnkQuestionStudioExamProfileId;
  readonly seed?: string;
  readonly count?: number;
}

export function previewRnk001QuestionStudioReview(input: PreviewRnk001QuestionStudioInput = {}) {
  const language = input.language ?? "en";
  if (language !== "en") {
    throw new Error("RNK-001 Hindi/Punjabi Question Studio delivery remains locked until the multilingual lineage is consolidated.");
  }
  const profileId = input.examProfileId ?? "CHAPTER_COVERAGE";
  if (profileId !== "CHAPTER_COVERAGE" && !(profileId in PROFILE_WEIGHTS)) {
    throw new Error(`Unsupported RNK-001 exam profile '${String(profileId)}'.`);
  }
  if (input.qlId && !ALL_QL_IDS.includes(input.qlId)) throw new Error(`Unsupported RNK-001 QL '${input.qlId}'.`);
  const difficulty = normalizeDifficulty(input.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 5) || 5)));
  const seedText = input.seed?.trim() || "rnk-001-question-studio-review";

  const questions: RnkQuestionStudioReviewQuestion[] = [];
  if (input.qlId) {
    for (let index = 0; index < count; index += 1) {
      const seed = stableHash(`${seedText}:${input.qlId}:${index}`);
      questions.push(reviewQuestion(questionForQl(input.qlId, seed, difficulty), input.qlId, seed, profileId));
    }
  } else if (profileId === "CHAPTER_COVERAGE") {
    for (let index = 0; index < count; index += 1) {
      const qlId = ALL_QL_IDS[index % ALL_QL_IDS.length]!;
      const seed = stableHash(`${seedText}:${qlId}:${index}`);
      questions.push(reviewQuestion(questionForQl(qlId, seed, difficulty), qlId, seed, profileId));
    }
  } else {
    const tierPlan = profileTierPlan(profileId, count, seedText);
    tierPlan.forEach((tier, index) => {
      const selected = questionForTier(tier, seedText, index, difficulty);
      const seed = stableHash(`${seedText}:${selected.qlId}:${index}`);
      questions.push(reviewQuestion(selected.question, selected.qlId, seed, profileId));
    });
  }

  if (profileId !== "CHAPTER_COVERAGE" && count >= 20) {
    const mix = auditRnkExamModeMix(questions.map((question) => question.qlId));
    if (!mix.passesExamRealismGuard) {
      throw new Error(`RNK-001 exam-profile batch failed realism guard: ${mix.violations.join(", ")}`);
    }
  }

  return {
    questions,
    integrationAuthority: RNK_001_QUESTION_STUDIO_REVIEW_AUTHORITY,
    reviewOnly: true as const,
    examProfileId: profileId,
    releaseFreezeStatus: RNK_001_QUESTION_STUDIO_RELEASE_FREEZE,
  };
}

export function listRnk001QuestionStudioQlIds() {
  return [...ALL_QL_IDS];
}
