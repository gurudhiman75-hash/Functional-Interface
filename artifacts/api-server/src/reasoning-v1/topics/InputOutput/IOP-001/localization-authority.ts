export const IOP_001_LOCALIZATION_AUTHORITY = Object.freeze({
  packageId: "IOP-001" as const,
  chapterId: "REAS-INP" as const,
  englishAuthority: "ENGLISH_FROZEN" as const,
  englishFreeze: true as const,
  frozenPermanentQlCount: 8 as const,
  frozenSourceModeCount: 19 as const,
  locales: ["hi-IN", "pa-IN"] as const,
  status: "REVIEW_CANDIDATE_V1" as const,
  translationModel: "HUMAN_AUTHORED_SEMANTIC_PRESENTATION_LAYER" as const,
  questionStyle: "EXAM_LIKE_SIMPLE_NATURAL" as const,
  explanationStyle: "SIMPLE_NATURAL_WORKED_SOLUTION" as const,
  machineObjectsTranslated: false as const,
  canonicalTracePreserved: true as const,
  optionAncestryPreserved: true as const,
  answerIndexPreserved: true as const,
  difficultyPreserved: true as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
  humanLanguageApproval: "PENDING" as const,
  localizationFreeze: false as const,
});

export function assertIop001LocalizationActivationAllowed(): never {
  throw new Error("IOP-001 Hindi/Punjabi are review candidates only. Human language approval and localization freeze are required before product activation.");
}
