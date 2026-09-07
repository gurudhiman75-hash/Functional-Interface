import { getQuantV4OptionCount } from "../../../../common/exam-profile";
import {
  SAP_QUESTION_STUDIO_QLS,
  runSapQuestionStudioPipeline,
  type SapQuestionStudioCpId,
  type SapQuestionStudioDifficulty,
  type SapQuestionStudioQlDescriptor,
  type SapQuestionStudioQlId,
} from "./question-studio-adapter";

export type SapBankingSpeedExamProfile = "BANKING_PRELIMS" | "BANKING_MAINS";

type DifficultyMix = Readonly<Record<SapQuestionStudioDifficulty, number>>;

export interface SapBankingSpeedProfileConfig {
  readonly id: SapBankingSpeedExamProfile;
  readonly label: string;
  readonly optionCount: 5;
  readonly eligibleCpIds: readonly SapQuestionStudioCpId[];
  readonly approximationCpIds: readonly SapQuestionStudioCpId[];
  readonly specialistAllowed: boolean;
  readonly targetApproximationShare: number;
  readonly difficultyMix: DifficultyMix;
  readonly targetSolveSeconds: Readonly<Record<SapQuestionStudioDifficulty, number>>;
}

const EXACT_CP_IDS = [
  "SAP-CP-001",
  "SAP-CP-002",
  "SAP-CP-003",
  "SAP-CP-004",
  "SAP-CP-005",
  "SAP-CP-006",
] as const satisfies readonly SapQuestionStudioCpId[];

const APPROXIMATION_CP_IDS = [
  "SAP-CP-007",
  "SAP-CP-008",
  "SAP-CP-009",
  "SAP-CP-010",
  "SAP-CP-011",
  "SAP-CP-012",
] as const satisfies readonly SapQuestionStudioCpId[];

const PRELIMS_CP_IDS = [
  "SAP-CP-001",
  "SAP-CP-002",
  "SAP-CP-003",
  "SAP-CP-004",
  "SAP-CP-006",
  "SAP-CP-007",
  "SAP-CP-008",
  "SAP-CP-009",
  "SAP-CP-010",
  "SAP-CP-011",
] as const satisfies readonly SapQuestionStudioCpId[];

export const SAP_BANKING_SPEED_PROFILES: Readonly<Record<SapBankingSpeedExamProfile, SapBankingSpeedProfileConfig>> = Object.freeze({
  BANKING_PRELIMS: Object.freeze({
    id: "BANKING_PRELIMS",
    label: "Banking Prelims — Speed Maths",
    optionCount: getQuantV4OptionCount("BANKING_PRELIMS"),
    eligibleCpIds: PRELIMS_CP_IDS,
    approximationCpIds: APPROXIMATION_CP_IDS.filter((cpId) => PRELIMS_CP_IDS.includes(cpId as (typeof PRELIMS_CP_IDS)[number])),
    specialistAllowed: false,
    targetApproximationShare: 0.5,
    difficultyMix: Object.freeze({ Easy: 0.45, Medium: 0.45, Hard: 0.1 }),
    targetSolveSeconds: Object.freeze({ Easy: 25, Medium: 40, Hard: 55 }),
  }),
  BANKING_MAINS: Object.freeze({
    id: "BANKING_MAINS",
    label: "Banking Mains — Speed Maths",
    optionCount: getQuantV4OptionCount("BANKING_MAINS"),
    eligibleCpIds: Object.freeze([...EXACT_CP_IDS, ...APPROXIMATION_CP_IDS]),
    approximationCpIds: APPROXIMATION_CP_IDS,
    specialistAllowed: true,
    targetApproximationShare: 0.6,
    difficultyMix: Object.freeze({ Easy: 0.15, Medium: 0.55, Hard: 0.3 }),
    targetSolveSeconds: Object.freeze({ Easy: 35, Medium: 55, Hard: 80 }),
  }),
});

export interface SapBankingSpeedGenerationInput {
  readonly seed?: string;
  readonly examProfile?: SapBankingSpeedExamProfile;
  readonly difficulty?: SapQuestionStudioDifficulty;
  readonly questionLanguageId?: SapQuestionStudioQlId;
}

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
}

function unitInterval(seed: string, salt: string): number {
  return hashText(`${seed}:${salt}`) / 0x100000000;
}

function chooseDifficulty(seed: string, mix: DifficultyMix): SapQuestionStudioDifficulty {
  const roll = unitInterval(seed, "difficulty");
  if (roll < mix.Easy) return "Easy";
  if (roll < mix.Easy + mix.Medium) return "Medium";
  return "Hard";
}

function effectiveWeight(descriptor: SapQuestionStudioQlDescriptor): number {
  if (!Number.isFinite(descriptor.defaultWeight) || descriptor.defaultWeight <= 0) return 0;
  return descriptor.defaultWeight;
}

function weightedPick(
  seed: string,
  salt: string,
  descriptors: readonly SapQuestionStudioQlDescriptor[],
): SapQuestionStudioQlDescriptor {
  const weighted = descriptors
    .map((descriptor) => ({ descriptor, weight: effectiveWeight(descriptor) }))
    .filter((entry) => entry.weight > 0);
  if (!weighted.length) throw new Error(`SAP Banking Speed profile has no eligible weighted QLs for ${salt}.`);
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = unitInterval(seed, salt) * total;
  for (const entry of weighted) {
    cursor -= entry.weight;
    if (cursor < 0) return entry.descriptor;
  }
  return weighted[weighted.length - 1]!.descriptor;
}

function isApproximationCp(cpId: SapQuestionStudioCpId): boolean {
  return APPROXIMATION_CP_IDS.includes(cpId as (typeof APPROXIMATION_CP_IDS)[number]);
}

export function listSapBankingSpeedEligibleQls(
  profileId: SapBankingSpeedExamProfile,
): readonly SapQuestionStudioQlDescriptor[] {
  const profile = SAP_BANKING_SPEED_PROFILES[profileId];
  return Object.freeze(
    SAP_QUESTION_STUDIO_QLS.filter((descriptor) => {
      if (!profile.eligibleCpIds.includes(descriptor.checkpointId)) return false;
      if (!profile.specialistAllowed && descriptor.specialist) return false;
      return effectiveWeight(descriptor) > 0;
    }),
  );
}

function selectDescriptor(
  seed: string,
  profile: SapBankingSpeedProfileConfig,
  explicitQl?: SapQuestionStudioQlId,
): SapQuestionStudioQlDescriptor {
  const eligible = listSapBankingSpeedEligibleQls(profile.id);
  if (explicitQl) {
    const descriptor = eligible.find((entry) => entry.qlId === explicitQl);
    if (!descriptor) {
      throw new Error(`${explicitQl} is not eligible for ${profile.id} Banking Speed Maths.`);
    }
    return descriptor;
  }

  const approximationRequested = unitInterval(seed, "exact-vs-approximation") < profile.targetApproximationShare;
  const preferred = eligible.filter((descriptor) => isApproximationCp(descriptor.checkpointId) === approximationRequested);
  return weightedPick(seed, approximationRequested ? "approximation-pool" : "exact-pool", preferred.length ? preferred : eligible);
}

function normalizeDifficulty(value: unknown): SapQuestionStudioDifficulty {
  const normalized = String(value ?? "Medium").toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "hard") return "Hard";
  return "Medium";
}

function deliverFiveBankingOptions(source: any) {
  const sourceOptions = Array.isArray(source.options) ? source.options.map(String) : [];
  const sourceCorrectIndex = Number(source.correctIndex);
  if (sourceOptions.length !== 4) {
    throw new Error(`SAP Banking Speed adapter expected the frozen four-option SAP source, found ${sourceOptions.length}.`);
  }
  if (!Number.isInteger(sourceCorrectIndex) || sourceCorrectIndex < 0 || sourceCorrectIndex >= sourceOptions.length) {
    throw new Error(`SAP Banking Speed adapter received invalid source correctIndex ${source.correctIndex}.`);
  }
  if (sourceOptions.some((option: string) => option.trim().toLowerCase() === "none of these")) {
    throw new Error("SAP Banking Speed source already contains a None of these option.");
  }

  const options = Object.freeze([...sourceOptions, "None of these"]);
  return Object.freeze({
    options,
    correctIndex: sourceCorrectIndex,
    optionCount: 5 as const,
    bankingOptionAnalysis: Object.freeze([
      ...sourceOptions.map((option: string, index: number) => Object.freeze({
        option,
        isCorrect: index === sourceCorrectIndex,
        source: "FROZEN_SAP_OPTION" as const,
      })),
      Object.freeze({
        option: "None of these",
        isCorrect: false,
        source: "BANKING_DELIVERY_ADAPTER" as const,
        misconceptionId: "NONE_OF_THESE_KNOWN_FALSE",
        analysis: "The computed answer is already present among options A-D, so 'None of these' is not correct.",
      }),
    ]),
  });
}

export function generateSapBankingSpeedQuestion(input: SapBankingSpeedGenerationInput = {}) {
  const examProfile = input.examProfile ?? "BANKING_PRELIMS";
  const profile = SAP_BANKING_SPEED_PROFILES[examProfile];
  const seed = input.seed ?? `SAP-BANKING-SPEED:${examProfile}:DEFAULT`;
  const descriptor = selectDescriptor(seed, profile, input.questionLanguageId);
  const requestedDifficulty = input.difficulty ?? (input.questionLanguageId ? undefined : chooseDifficulty(seed, profile.difficultyMix));

  let source: any;
  let lastError: unknown;
  for (let attempt = 0; attempt < 24; attempt += 1) {
    try {
      source = runSapQuestionStudioPipeline(descriptor.checkpointId, {
        language: "en",
        questionLanguageId: descriptor.qlId,
        difficulty: requestedDifficulty,
        seed: `${seed}:source:${attempt}`,
      });
      break;
    } catch (error) {
      lastError = error;
      if (input.questionLanguageId) break;
    }
  }
  if (!source) {
    throw lastError instanceof Error ? lastError : new Error(`Unable to generate SAP Banking Speed question for ${descriptor.qlId}.`);
  }

  const delivered = deliverFiveBankingOptions(source);
  const difficulty = normalizeDifficulty(source.difficultyBand ?? source.difficulty);
  const approximationContract = isApproximationCp(descriptor.checkpointId)
    ? "CERTIFIED_APPROXIMATION_ONLY"
    : "EXACT_RESULT_REQUIRED";

  return Object.freeze({
    ...source,
    options: delivered.options,
    correctIndex: delivered.correctIndex,
    optionCount: delivered.optionCount,
    examProfile,
    bankingSpeedProfile: Object.freeze({
      version: "SAP_BANKING_SPEED_PROFILE_V1",
      label: profile.label,
      targetSolveSeconds: profile.targetSolveSeconds[difficulty],
      approximationContract,
      sourceCheckpointId: descriptor.checkpointId,
      sourceQlId: descriptor.qlId,
      sourceSpecialist: descriptor.specialist,
      fifthOptionPolicy: "KNOWN_FALSE_NONE_OF_THESE",
    }),
    bankingOptionAnalysis: delivered.bankingOptionAnalysis,
    reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    traceability: Object.freeze({
      ...(source.traceability ?? {}),
      deliveryProfile: "SAP_BANKING_SPEED_PROFILE_V1",
      examProfile,
      sourceCheckpointId: descriptor.checkpointId,
      sourceQlId: descriptor.qlId,
      sourceLifecyclePreserved: true,
      reviewStatus: "BANKING_SPEED_PROFILE_REVIEW_ONLY",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    }),
  });
}
