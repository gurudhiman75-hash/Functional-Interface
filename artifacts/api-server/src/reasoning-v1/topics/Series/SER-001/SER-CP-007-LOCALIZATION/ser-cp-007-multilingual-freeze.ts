import { SER_CP007_PERMANENT_QL_IDS } from "../SER-PERMANENT-QL-REGISTRY";
import {
  generateSerCp007PermanentLocalizedPackage,
  regenerateSerCp007PermanentLocalizedPackage,
  SER_CP007_LOCALES,
  type SerCp007Locale,
  type SerCp007PermanentLocalizedPackage,
} from "./ser-cp-007-localized-runtime-final";

export const SER_CP007_MULTILINGUAL_FREEZE_VERSION =
  "SER_CP007_HI_PA_MULTILINGUAL_MANUAL_FREEZE_V1" as const;

export const SER_CP007_MULTILINGUAL_FREEZE = Object.freeze({
  chapterId: "SER-001",
  checkpointId: "SER-CP-007",
  status: "MULTILINGUAL_MANUAL_FREEZE_APPROVED",
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF_IN_PROJECT_CHAT",
  approvalStatement: "approved",
  approvedAtUtc: "2026-08-08T05:42:58Z",
  approvedAtIst: "2026-08-08T11:12:58+05:30",
  approvedReviewedHead: "ae0da642814de6a96c04f30732c7bba03f18ca72",
  permanentQlIds: SER_CP007_PERMANENT_QL_IDS,
  frozenLocales: SER_CP007_LOCALES,
  frozenTemplateCount: 140,
  frozenLearnerReleasePoolCount: 135,
  reviewTripletCount: 104,
  localeReviewCounts: Object.freeze({
    "hi-IN": 104,
    "pa-IN": 104,
  }),
  parityProof: Object.freeze({
    workflowRunId: 31241724874,
    localizedPackageCount: 840,
    permanentQlCount: 13,
    deterministicRegeneration: true,
    answerOptionParity: true,
    releaseMetadataParity: true,
    rendererParity: true,
    englishLearnerProseLeakCount: 0,
    wrongScriptContaminationCount: 0,
  }),
  reviewEvidence: Object.freeze({
    workflowRunId: 31241724885,
    artifactId: 9017239441,
    artifactName: "ser-001-cp007-native-language-review-104",
    artifactDigest:
      "sha256:268d0fff5b410eb8f1d8ec81686364d9a2b971246706c28bd7490b9ef82e75f3",
    englishReferenceCount: 104,
    hindiCandidateCount: 104,
    punjabiCandidateCount: 104,
    recordsPerPermanentQl: 8,
  }),
  contentGuarantees: Object.freeze({
    frozenEnglishIdentityUnchanged: true,
    hiddenLogicalStateUnchanged: true,
    optionOrderUnchanged: true,
    correctAnswerAndIndexUnchanged: true,
    difficultyAndReleaseMetadataUnchanged: true,
    learnerRendererUnchanged: true,
    learnerFacingHindiApproved: true,
    learnerFacingPunjabiApproved: true,
    markdownLineStructurePreserved: true,
  }),
  lifecycle: Object.freeze({
    active: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  }),
  reopenOnlyFor: Object.freeze([
    "LOGICAL_OR_ANSWER_DEFECT",
    "AMBIGUITY_OR_COMPETING_ANSWER_DEFECT",
    "SOURCE_OR_RELEASE_POOL_PARITY_DEFECT",
    "HINDI_MEANING_OR_NATURALNESS_DEFECT",
    "PUNJABI_MEANING_OR_NATURALNESS_DEFECT",
    "SCRIPT_CONTAMINATION_DEFECT",
    "MARKDOWN_OR_RENDERING_DEFECT",
  ]),
  nextAuthority: "SER_CP007_QUESTION_STUDIO_INTEGRATION_READINESS_AUDIT",
} as const);

export type SerCp007MultilingualFreeze =
  typeof SER_CP007_MULTILINGUAL_FREEZE;

type SerCp007FrozenLifecycle = Omit<
  SerCp007PermanentLocalizedPackage["lifecycle"],
  "localizationStatus"
> & {
  readonly localizationStatus: "MULTILINGUAL_MANUAL_FREEZE_APPROVED";
};

export type SerCp007FrozenLocalizedPackage = Omit<
  SerCp007PermanentLocalizedPackage,
  "localizationVersion" | "reviewDecision" | "lifecycle"
> & {
  readonly localizationVersion: typeof SER_CP007_MULTILINGUAL_FREEZE_VERSION;
  readonly reviewDecision: "APPROVED_NATIVE_LANGUAGE_MANUAL_FREEZE";
  readonly lifecycle: SerCp007FrozenLifecycle;
  readonly multilingualFreeze: SerCp007MultilingualFreeze;
};

function freezePackage(
  candidate: SerCp007PermanentLocalizedPackage,
): SerCp007FrozenLocalizedPackage {
  return Object.freeze({
    ...candidate,
    localizationVersion: SER_CP007_MULTILINGUAL_FREEZE_VERSION,
    reviewDecision: "APPROVED_NATIVE_LANGUAGE_MANUAL_FREEZE" as const,
    lifecycle: Object.freeze({
      ...candidate.lifecycle,
      localizationStatus: "MULTILINGUAL_MANUAL_FREEZE_APPROVED" as const,
    }),
    multilingualFreeze: SER_CP007_MULTILINGUAL_FREEZE,
  });
}

export function generateSerCp007FrozenLocalizedPackage(
  temporaryTemplateId: string,
  locale: SerCp007Locale,
  seed: number,
): SerCp007FrozenLocalizedPackage {
  return freezePackage(
    generateSerCp007PermanentLocalizedPackage(
      temporaryTemplateId,
      locale,
      seed,
    ),
  );
}

export function regenerateSerCp007FrozenLocalizedPackage(input: {
  readonly temporaryTemplateId: string;
  readonly locale: SerCp007Locale;
  readonly seed: number;
  readonly subtypeId: string;
  readonly learnerRenderer: string;
}): SerCp007FrozenLocalizedPackage {
  return freezePackage(regenerateSerCp007PermanentLocalizedPackage(input));
}
