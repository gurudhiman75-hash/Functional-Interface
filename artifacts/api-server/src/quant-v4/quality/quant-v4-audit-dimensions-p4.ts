export const QUANT_V4_AUDIT_DIMENSIONS_AUTHORITY =
  "QUANT-V4-AUDIT-DIMENSIONS-P4" as const;

export const QUANT_V4_REQUIRED_AUDIT_DIMENSIONS = Object.freeze([
  "COVERAGE",
  "QUESTION_BREADTH",
  "NOVEL_QUESTION_CAPABILITY",
  "EXAM_REALISM",
  "DIFFICULTY_CALIBRATION",
  "MATHEMATICAL_CORRECTNESS",
  "DISTRACTOR_QUALITY",
  "EXPLANATION_QUALITY",
  "LANGUAGE_LOCALIZATION_QUALITY",
  "LEARNER_SURFACE_FORMATTING",
  "REPETITION_DISTINCTIVENESS",
  "PROFILE_REALISM",
  "QUESTION_STUDIO_INTEGRATION",
  "LIFECYCLE_SAFETY",
  "PERFORMANCE_SCALE",
  "FINAL_GAP_AUDIT",
] as const);

export type QuantV4AuditDimension =
  (typeof QUANT_V4_REQUIRED_AUDIT_DIMENSIONS)[number];

export const QUANT_V4_NOVEL_QUESTION_CAPABILITY_REQUIREMENTS = Object.freeze([
  "PATTERN_BREADTH",
  "CANONICAL_PROBLEM_BREADTH",
  "STRUCTURAL_NOVELTY",
  "MATHEMATICAL_STATE_NOVELTY",
  "HELD_OUT_SEED_NOVELTY",
  "SEED_SENSITIVITY",
  "NON_COSMETIC_VARIATION",
] as const);

export const QUANT_V4_AUDIT_COMPLETION_RULES = Object.freeze({
  novelQuestionCapabilityRequired: true,
  highQuestionCountDoesNotProveNovelty: true,
  cosmeticReskinsDoNotCountAsNovelQuestions: true,
  missingMathematicalFingerprintMustBeReported: true,
  heldOutSeedEvidenceRequired: true,
  chapterAuditCompleteRequiresAllMaterialDimensionsClear: true,
});
