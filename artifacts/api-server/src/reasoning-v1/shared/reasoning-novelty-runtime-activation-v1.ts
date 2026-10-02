export const REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_VERSION =
  "REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_2026_10_02_V1" as const;

export const REASONING_V1_NOVELTY_RUNTIME_ACTIVATION_V1 = Object.freeze({
  authorization: "EXPLICIT_PROJECT_OWNER_APPROVAL_2026_10_02",
  operatingTarget: 0.20,
  acceptableBand: [0.15, 0.25] as const,
  liveQuestionStudioProviders: [
    "ALP-001-TRANSFORMED-GAP",
    "BLR-001-CODED-FILTERED-COUNT",
    "CAL-001-IMPLICIT-RANGE-FREQUENCY",
    "OPS-001-INFER-THEN-FILL",
    "DIR-001-GRAPH-RELATIVE-PATH",
    "CLK-001-FAULTY-TIME-ANGLE",
  ] as const,
  contentApprovedAwaitingQuestionStudioRoute: [
    "RNK-001-CROSS-FAMILY-CASELET",
    "CAE-001-EDGE-FAMILIES",
  ] as const,
  safeguards: Object.freeze({
    explicitQlOrCpScopePreserved: true,
    reviewedLanguageOnly: true,
    difficultyCalibrationRequired: true,
    automaticStudentPublicationChanged: false,
    questionBankReleaseChanged: false,
    permanentQlAllocationChanged: false,
  }),
});
