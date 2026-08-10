import {
  INT_CP004_LOCALIZED_EXAM_FRIENDLY_RUNTIME_V9_VERSION,
  generateIntCp004ExamFriendlyLocalizedQuestionV9,
} from "./cp004-localized-exam-friendly-runtime-v9";
import type {
  IntCp004LocalizedQuestion,
  IntCp004LocalizedRuntimeInput,
} from "./cp004-localization-types";

export const INT_CP004_MULTILINGUAL_FREEZE_V9 = {
  chapterId: "INT-001",
  checkpointId: "INT-CP-004",
  freezeId: "INT-CP-004-HI-PA-v9-frozen",
  status: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF",
  approvalCommentId: 5244153118,
  approvedAtUtc: "2026-08-10T18:12:00Z",
  approvedAtIst: "2026-08-10T23:42:00+05:30",
  approvedReviewedHead: "16e8a7f772f79e222aa8e09475b15b6eddf42d6b",
  canonicalEnglishFreezeId: "INT-CP-004-EN-v1-frozen",
  canonicalEnglishBaseHead: "cb42395a88609f9ead26e0afa49ded365eec198b",
  approvedRuntimeVersion: INT_CP004_LOCALIZED_EXAM_FRIENDLY_RUNTIME_V9_VERSION,
  qlRange: "INT-QL-067..INT-QL-085",
  qlCount: 19,
  frozenLocales: ["hi-IN", "pa-IN"],
  reviewQuestionCount: 152,
  localeQuestionCounts: {
    "hi-IN": 76,
    "pa-IN": 76,
  },
  validationProof: {
    cp004LocalizationWorkflowRunId: 31416083460,
    examFriendlyV9WorkflowRunId: 31416083505,
    cp001IsolationWorkflowRunId: 31416083578,
    reviewArtifact: {
      id: 9073471740,
      name: "int-cp004-hi-pa-localisation-human-review-packs-v2",
      digest: "sha256:d706bb58511fa184c10809536178098927aa84f4e0801f8d5c988b5d2a251aaa",
      questionCount: 152,
    },
    runtimeEvidenceArtifact: {
      id: 9073464813,
      name: "int-cp004-exam-friendly-v9-evidence",
      digest: "sha256:5a5d637bfa116ccdb7e5b1a6d93f72acf1340d4807994f94666a2916678262ae",
      arbitraryRuntimeQuestionCount: 3800,
      optionCheckCount: 15200,
    },
  },
  contentGuarantees: {
    historicalEnglishFreezeUntouched: true,
    approvedRemediationStateFrozen: true,
    canonicalSolverVerifierReused: true,
    learnerContentIdenticalToApprovedV9: true,
    zeroDecimalTokens: true,
    formulaFirstEveryQuestion: true,
    completeCalculationEveryQuestion: true,
    optionFeedbackSuppressed: true,
    answerOwnershipPreserved: true,
    hindiApproved: true,
    punjabiApproved: true,
    punjabiMishritViajRequired: true,
  },
  lifecycle: {
    enabled: false,
    stagingStatus: "NOT_STAGED",
    registrationStatus: "NOT_REGISTERED",
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
  reopenOnlyFor: [
    "MATHEMATICAL_OR_LOGICAL_DEFECT",
    "ANSWER_INTEGRITY_DEFECT",
    "AMBIGUITY_OR_COMPETING_ANSWER_DEFECT",
    "DECIMAL_OR_EXAM_FRIENDLINESS_REGRESSION",
    "FORMULA_OR_CALCULATION_COMPLETENESS_DEFECT",
    "LOCALISATION_MEANING_DEFECT",
    "LANGUAGE_NATURALNESS_DEFECT",
    "RENDERING_DEFECT",
  ],
} as const;

export type IntCp004MultilingualFreezeV9 = typeof INT_CP004_MULTILINGUAL_FREEZE_V9;

export type IntCp004MultilingualFrozenQuestionV9 = Omit<
  IntCp004LocalizedQuestion,
  "editorialStatus" | "approvalStatus" | "allocationStatus" | "lifecycle" | "localization"
> & {
  readonly editorialStatus: "MULTILINGUAL_FROZEN";
  readonly approvalStatus: "APPROVED_MULTILINGUAL_FROZEN";
  readonly allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN";
  readonly lifecycle: Omit<IntCp004LocalizedQuestion["lifecycle"], "maturity" | "reviewStatus"> & {
    readonly maturity: "MULTILINGUAL_FROZEN";
    readonly reviewStatus: "APPROVED_MULTILINGUAL_FROZEN";
  };
  readonly localization: Omit<IntCp004LocalizedQuestion["localization"], "status"> & {
    readonly status: "FROZEN_MULTILINGUAL_RUNTIME_PROOF";
  };
  readonly multilingualFreeze: IntCp004MultilingualFreezeV9;
};

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}

export function generateIntCp004MultilingualFrozenQuestionV9(
  input: IntCp004LocalizedRuntimeInput,
): IntCp004MultilingualFrozenQuestionV9 {
  const reviewed = generateIntCp004ExamFriendlyLocalizedQuestionV9(input);

  return deepFreeze({
    ...reviewed,
    editorialStatus: "MULTILINGUAL_FROZEN",
    approvalStatus: "APPROVED_MULTILINGUAL_FROZEN",
    allocationStatus: "INACTIVE_MULTILINGUAL_FROZEN",
    lifecycle: {
      ...reviewed.lifecycle,
      maturity: "MULTILINGUAL_FROZEN",
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
    },
    localization: {
      ...reviewed.localization,
      status: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
    },
    multilingualFreeze: INT_CP004_MULTILINGUAL_FREEZE_V9,
  });
}
