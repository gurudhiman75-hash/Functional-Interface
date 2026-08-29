export const IOP_001_LOCALIZATION_AUTHORITY = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  englishAuthority: "ENGLISH_FROZEN" as const,
  englishFreeze: true as const,
  frozenPermanentQlCount: 8 as const,
  frozenSourceModeCount: 19 as const,
  locales: ["hi-IN", "pa-IN"] as const,
  status: "LOCALIZATION_FROZEN_V1" as const,
  translationModel: "HUMAN_AUTHORED_SEMANTIC_PRESENTATION_LAYER" as const,
  questionStyle: "EXAM_LIKE_SIMPLE_NATURAL" as const,
  explanationStyle: "SIMPLE_NATURAL_WORKED_SOLUTION" as const,
  machineObjectsTranslated: false as const,
  canonicalTracePreserved: true as const,
  optionAncestryPreserved: true as const,
  answerIndexPreserved: true as const,
  difficultyPreserved: true as const,
  humanLanguageApproval: "APPROVED_2026_08_18" as const,
  localizationFreeze: true as const,
  questionStudioIntegrationAllowed: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export function assertIop001LocalizationFrozen(): true {
  return true;
}

export function assertIop001LocalizationProductActivationAllowed(): never {
  throw new Error("IOP-001 English/Hindi/Punjabi content is frozen. Question Studio integration may proceed, but Question Bank, test/mock delivery and public publication require separate gates.");
}
