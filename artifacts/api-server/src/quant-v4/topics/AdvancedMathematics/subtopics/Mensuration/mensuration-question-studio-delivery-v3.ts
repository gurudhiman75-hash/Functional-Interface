import {
  assertQuantV4OptionCount,
  getQuantV4ExamProfileContract,
  type QuantV4ExamProfileId,
} from "../../../../common/exam-profile";
import {
  QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1,
  QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1,
} from "../../../../../question-studio/standard-lifecycle";
import {
  MENSURATION_LOCALIZATION_AUTHORITY,
  MENSURATION_LOCALIZED_LANGUAGES,
  MENSURATION_LOCALIZED_PACKAGE_V1,
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
  generateMensurationLocalizedBatchV1,
  generateMensurationLocalizedQuestionV1,
  type MensurationLocalizedQuestionV1,
  type MensurationQuestionStudioCpId,
  type MensurationQuestionStudioDifficulty,
  type MensurationQuestionStudioExamProfile,
  type MensurationStudioLanguage,
} from "./localization/mensuration-localization-runtime-v1";

export const MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY =
  "MENSURATION-QUESTION-STUDIO-DELIVERY-V3-CENTRAL-PROFILE-MIXED-LIFECYCLE" as const;

export const MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3 = [
  "SSC_CORE",
  "SSC_ADVANCED",
  "BANKING_PRELIMS",
  "BANKING_MAINS",
  "PUNJAB_STATE",
] as const;

export type MensurationStudioExamProfileV3 =
  (typeof MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3)[number];

type OptionLabelV3 = "A" | "B" | "C" | "D" | "E";

const LABELS: readonly OptionLabelV3[] = ["A", "B", "C", "D", "E"];
const BANK_ONLY = QUESTION_STUDIO_STANDARD_BANK_ONLY_LIFECYCLE_V1;
const REVIEW_ONLY = QUESTION_STUDIO_STANDARD_REVIEW_ONLY_LIFECYCLE_V1;

const ENGLISH_BANK_ONLY_REVIEW_STATUS_BY_CP: Readonly<Record<string, readonly string[]>> = Object.freeze({
  "MEN-CP-007": ["APPROVED_EDITORIAL_ENGLISH"],
  "MEN-CP-008": ["ENGLISH_IMPLEMENTATION_FROZEN"],
  "MEN-CP-009": ["APPROVED_MULTILINGUAL_TEACHING_FROZEN"],
  "MEN-CP-010": ["ENGLISH_REVIEW_APPROVED", "EXAM_REALISM_REVIEW_APPROVED"],
  "MEN-CP-013": ["ENGLISH_REVIEW_APPROVED"],
});

export const MENSURATION_BANK_ONLY_ENGLISH_CP_IDS = Object.freeze(
  Object.keys(ENGLISH_BANK_ONLY_REVIEW_STATUS_BY_CP),
);

function sourceProfile(profile: MensurationStudioExamProfileV3): MensurationQuestionStudioExamProfile {
  return profile === "BANKING_PRELIMS" || profile === "BANKING_MAINS" ? "BANKING" : profile;
}

export function centralProfileForMensurationV3(profile: MensurationStudioExamProfileV3): QuantV4ExamProfileId {
  if (profile === "SSC_ADVANCED") return "SSC_CGL_JSO";
  if (profile === "BANKING_PRELIMS") return "BANKING_PRELIMS";
  if (profile === "BANKING_MAINS") return "BANKING_MAINS";
  if (profile === "PUNJAB_STATE") return "GENERIC_PRACTICE";
  return "SSC_CGL_CHSL";
}

function hashText(text: string): number {
  let hash = 2166136261 >>> 0;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  hash ^= hash >>> 16;
  hash = Math.imul(hash, 0x7feb352d) >>> 0;
  hash ^= hash >>> 15;
  hash = Math.imul(hash, 0x846ca68b) >>> 0;
  hash ^= hash >>> 16;
  return hash >>> 0;
}

function fallbackNone(language: MensurationStudioLanguage) {
  if (language === "hi") return "इनमें से कोई नहीं";
  if (language === "pa") return "ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਕੋਈ ਨਹੀਂ";
  return "None of these";
}

function mutateNumericToken(text: string, delta: number): string | null {
  const matches = [...text.matchAll(/-?\d+(?:\.\d+)?/g)];
  const target = matches.at(-1);
  if (!target || target.index === undefined) return null;
  const value = Number(target[0]);
  if (!Number.isFinite(value)) return null;
  const shifted = value + delta;
  if (!Number.isFinite(shifted)) return null;
  const rendered = Number.isInteger(shifted) ? String(shifted) : String(Number(shifted.toFixed(2)));
  return `${text.slice(0, target.index)}${rendered}${text.slice(target.index + target[0].length)}`;
}

function extraWrongOption(question: MensurationLocalizedQuestionV1) {
  const existing = new Set(question.options.map((option) => option.trim()));
  const candidates = [1, -1, 2, -2, 5, -5]
    .map((delta) => mutateNumericToken(question.answer, delta))
    .filter((value): value is string => Boolean(value?.trim()));
  candidates.push(fallbackNone(question.language));
  const candidate = candidates.find((value) => {
    const normalized = value.trim();
    return normalized && normalized !== question.answer.trim() && !existing.has(normalized);
  });
  if (!candidate) throw new Error(`${question.patternId}/${question.seed}: no unique fifth Banking distractor available.`);
  return candidate;
}

function expandOptions(
  question: MensurationLocalizedQuestionV1,
  examProfile: MensurationStudioExamProfileV3,
) {
  const centralExamProfile = centralProfileForMensurationV3(examProfile);
  const optionCount = getQuantV4ExamProfileContract(centralExamProfile).optionCount;
  if (optionCount === 4) {
    assertQuantV4OptionCount(centralExamProfile, question.options.length, "Mensuration Question Studio V3");
    return {
      options: [...question.options],
      optionDetails: question.optionDetails.map((option) => ({ ...option, label: option.label as OptionLabelV3 })),
      correctIndex: question.correctIndex,
      answer: question.answer,
      optionCount,
      centralExamProfile,
    };
  }

  const extra = extraWrongOption(question);
  const wrongs = [
    ...question.optionDetails.filter((option) => !option.isCorrect).map((option) => option.text),
    extra,
  ];
  if (wrongs.length !== 4 || new Set(wrongs).size !== 4 || wrongs.includes(question.answer)) {
    throw new Error(`${question.patternId}/${question.seed}: Banking option expansion is not unique.`);
  }
  const correctIndex = hashText(`${question.seed}:${question.patternId}:${examProfile}:v3-answer-position`) % 5;
  const options = [...wrongs];
  options.splice(correctIndex, 0, question.answer);
  const optionDetails = options.map((text, index) => ({
    label: LABELS[index]!,
    text,
    isCorrect: index === correctIndex,
    misconceptionId: index === correctIndex ? null : `MEN-DIST-V3-M${index + 1}`,
  }));
  assertQuantV4OptionCount(centralExamProfile, options.length, "Mensuration Question Studio V3");
  return { options, optionDetails, correctIndex, answer: question.answer, optionCount, centralExamProfile };
}

export function mensurationBankOnlyEligibility(question: MensurationLocalizedQuestionV1) {
  if (question.language !== "en") {
    return Object.freeze({ eligible: false as const, reason: "LOCALIZATION_REMAINS_CONTROLLED_REVIEW" as const });
  }
  if (question.patternKind !== "QL" || !question.qlId) {
    return Object.freeze({ eligible: false as const, reason: "PERMANENT_QL_REQUIRED" as const });
  }
  const allowedStatuses = ENGLISH_BANK_ONLY_REVIEW_STATUS_BY_CP[question.cpId];
  if (!allowedStatuses) {
    return Object.freeze({ eligible: false as const, reason: "CP_NOT_BANK_ONLY_APPROVED" as const });
  }
  if (!allowedStatuses.includes(question.sourceReviewStatus)) {
    return Object.freeze({ eligible: false as const, reason: "SOURCE_REVIEW_AUTHORITY_NOT_APPROVED" as const });
  }
  if (!question.validation.valid || !question.validation.sourceLifecycleLocked) {
    return Object.freeze({ eligible: false as const, reason: "SOURCE_VALIDATION_OR_LOCK_FAILED" as const });
  }
  return Object.freeze({ eligible: true as const, reason: "FROZEN_APPROVED_ENGLISH_PERMANENT_QL" as const });
}

export type MensurationDeliveredQuestionV3 = Omit<
  MensurationLocalizedQuestionV1,
  "options" | "optionDetails" | "correctIndex"
> & {
  examProfile: MensurationStudioExamProfileV3;
  sourceExamProfile: MensurationQuestionStudioExamProfile;
  centralExamProfile: QuantV4ExamProfileId;
  optionCount: 4 | 5;
  options: string[];
  optionDetails: Array<{
    label: OptionLabelV3;
    text: string;
    isCorrect: boolean;
    misconceptionId: string | null;
  }>;
  correctIndex: number;
  deliveryAuthority: typeof MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY;
  bankOnlyEligibility: ReturnType<typeof mensurationBankOnlyEligibility>;
  lifecycleId: typeof BANK_ONLY.lifecycleId | typeof REVIEW_ONLY.lifecycleId;
  lifecycleStage: typeof BANK_ONLY.stage | typeof REVIEW_ONLY.stage;
  reviewSurfaceRequired: true;
  reviewRunPersistenceAllowed: true;
  canonicalQuestionPersistenceAllowed: boolean;
  manualApprovalRequired: true;
  questionBankStatus: typeof BANK_ONLY.questionBankStatus | typeof REVIEW_ONLY.questionBankStatus;
  questionBankWritable: boolean;
  questionBankAcceptanceMode: "BANK_ONLY" | null;
  questionBankAcceptanceAuthority: string | null;
  testEligibility: "INELIGIBLE";
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
  automaticStudentPublication: false;
  productionReleaseAuthorized: false;
};

export const MENSURATION_QUESTION_STUDIO_PACKAGE_V3 = Object.freeze({
  ...MENSURATION_LOCALIZED_PACKAGE_V1,
  label: "Mensuration · Full Chapter · Central Profile Delivery V3",
  deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
  supportedExamProfiles: MENSURATION_QUESTION_STUDIO_EXAM_PROFILES_V3,
  defaultExamProfile: "SSC_CORE" as const,
  optionCountByExamProfile: Object.freeze({
    SSC_CORE: 4,
    SSC_ADVANCED: 4,
    BANKING_PRELIMS: 5,
    BANKING_MAINS: 5,
    PUNJAB_STATE: 4,
  }),
  lifecycleMode: "PER_ITEM_FAIL_CLOSED" as const,
  packageWideQuestionBankWritable: false as const,
  eligibleItemQuestionBankWritable: true as const,
  bankOnlyEnglishCpIds: MENSURATION_BANK_ONLY_ENGLISH_CP_IDS,
  reviewOnlyCpIds: ["MEN-CP-001", "MEN-CP-002", "MEN-CP-003", "MEN-CP-004", "MEN-CP-005", "MEN-CP-006", "MEN-CP-011", "MEN-CP-012"] as const,
  nonEnglishLifecycle: "REVIEW_ONLY" as const,
  testEligible: false as const,
  mockTestEligible: false as const,
  publiclyPublishable: false as const,
});

function applyDelivery(
  question: MensurationLocalizedQuestionV1,
  examProfile: MensurationStudioExamProfileV3,
): MensurationDeliveredQuestionV3 {
  const expanded = expandOptions(question, examProfile);
  const bankOnlyEligibility = mensurationBankOnlyEligibility(question);
  const lifecycle = bankOnlyEligibility.eligible ? BANK_ONLY : REVIEW_ONLY;
  return Object.freeze({
    ...question,
    examProfile,
    sourceExamProfile: sourceProfile(examProfile),
    centralExamProfile: expanded.centralExamProfile,
    optionCount: expanded.optionCount,
    options: expanded.options,
    optionDetails: expanded.optionDetails,
    correctIndex: expanded.correctIndex,
    answer: expanded.answer,
    deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
    bankOnlyEligibility,
    lifecycleId: lifecycle.lifecycleId,
    lifecycleStage: lifecycle.stage,
    reviewSurfaceRequired: lifecycle.reviewSurfaceRequired,
    reviewRunPersistenceAllowed: lifecycle.reviewRunPersistenceAllowed,
    canonicalQuestionPersistenceAllowed: lifecycle.canonicalQuestionPersistenceAllowed,
    manualApprovalRequired: lifecycle.manualApprovalRequired,
    questionBankStatus: lifecycle.questionBankStatus,
    questionBankWritable: lifecycle.questionBankWritable,
    questionBankAcceptanceMode: lifecycle.questionBankAcceptanceMode,
    questionBankAcceptanceAuthority: lifecycle.questionBankAcceptanceAuthority,
    testEligibility: lifecycle.testEligibility,
    testEligible: lifecycle.testEligible,
    mockTestEligible: lifecycle.mockTestEligible,
    publiclyPublishable: lifecycle.publiclyPublishable,
    automaticStudentPublication: lifecycle.automaticStudentPublication,
    productionReleaseAuthorized: lifecycle.productionReleaseAuthorized,
  }) as MensurationDeliveredQuestionV3;
}

export function generateMensurationDeliveredQuestionV3(input: {
  patternId: string;
  seed: string;
  examProfile?: MensurationStudioExamProfileV3;
  language?: MensurationStudioLanguage;
}) {
  const examProfile = input.examProfile ?? "SSC_CORE";
  const question = generateMensurationLocalizedQuestionV1({
    patternId: input.patternId,
    seed: input.seed,
    examProfile: sourceProfile(examProfile),
    language: input.language,
  });
  return applyDelivery(question, examProfile);
}

export function generateMensurationDeliveredBatchV3(input: {
  cpId?: MensurationQuestionStudioCpId;
  patternId?: string;
  difficulty?: MensurationQuestionStudioDifficulty;
  examProfile?: MensurationStudioExamProfileV3;
  seed?: string;
  count?: number;
  language?: MensurationStudioLanguage;
}) {
  const examProfile = input.examProfile ?? "SSC_CORE";
  const base = generateMensurationLocalizedBatchV1({
    cpId: input.cpId,
    patternId: input.patternId,
    difficulty: input.difficulty,
    examProfile: sourceProfile(examProfile),
    seed: input.seed,
    count: input.count,
    language: input.language,
  });
  const questions = base.questions.map((question) => applyDelivery(question, examProfile));
  return Object.freeze({
    ...base,
    package: MENSURATION_QUESTION_STUDIO_PACKAGE_V3,
    questions,
    filters: Object.freeze({ ...base.filters, examProfile }),
    deliveryAuthority: MENSURATION_QUESTION_STUDIO_DELIVERY_V3_AUTHORITY,
  });
}

export {
  MENSURATION_LOCALIZATION_AUTHORITY,
  MENSURATION_LOCALIZED_LANGUAGES,
  MENSURATION_QUESTION_STUDIO_CANONICAL_PROBLEMS,
  MENSURATION_QUESTION_STUDIO_DIFFICULTIES,
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  MENSURATION_QUESTION_STUDIO_REALISM_AUTHORITY,
};
export type {
  MensurationQuestionStudioCpId,
  MensurationQuestionStudioDifficulty,
  MensurationStudioLanguage,
};
