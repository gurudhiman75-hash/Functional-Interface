import {
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { generateClsCp006EnglishQuestion } from "./cp006-english-runtime";
import {
  localizeClsCp006Question,
  type GeneratedClsCp006LocalizedQuestion,
} from "./localization/cp006-localizer";
import type { ClsCp006TranslatedLocale } from "./localization/cp006-language-pack";

export const CLS_CP006_MULTILINGUAL_FREEZE = {
  chapterId: "CLS-001",
  checkpointId: "CLS-CP-006",
  status: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF",
  approvalCommentId: 5158340874,
  approvedOnUtcDate: "2026-08-02",
  approvedReviewedHead: "28d9cf3525e0d0d018327585829b17c34c92bcb8",
  synchronizedBaseHead: "9f78cf8e3328e620e106ac9be4f5a9218b7618bc",
  preFreezeValidatedHead: "763e1368d7301094b4ae1649484608b0fa6fe970",
  permanentQlIds: [
    CLS_CP006_ODD_LETTER_QL_ID,
    CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  ],
  frozenLocales: ["hi-IN", "pa-IN"],
  ruleCount: 8,
  ruleCountsByQl: {
    [CLS_CP006_ODD_LETTER_QL_ID]: 3,
    [CLS_CP006_ODD_LETTER_PAIR_QL_ID]: 5,
  },
  reviewQuestionCount: 32,
  localeQuestionCounts: {
    "hi-IN": 16,
    "pa-IN": 16,
  },
  qlQuestionCounts: {
    [CLS_CP006_ODD_LETTER_QL_ID]: 12,
    [CLS_CP006_ODD_LETTER_PAIR_QL_ID]: 20,
  },
  synchronizedProof: {
    workflowRunId: 30750954437,
    reviewArtifact: {
      id: 8834426462,
      name: "cls-001-cp006-hi-pa-localisation-review",
      digest: "sha256:98b9c969cde57c682fad622c2b7a65cf3e0f5c39582d986760831342ee44ff17",
      questionCount: 32,
    },
    diagnosticsArtifact: {
      id: 8834426353,
      name: "cls-001-cp006-localisation-diagnostics",
      digest: "sha256:18984f92ada22b2d383bf045324bc580b05e00222cb6a953f24a21d703e84af3",
    },
  },
  contentGuarantees: {
    canonicalEnglishSolverUnchanged: true,
    mathematicalStateUnchanged: true,
    displayedItemsUnchanged: true,
    optionOrderUnchanged: true,
    answerAndIndexUnchanged: true,
    intendedRuleAndValueUnchanged: true,
    ambiguityProofUnchanged: true,
    difficultyAndFeaturesUnchanged: true,
    learnerFacingHindiApproved: true,
    learnerFacingPunjabiApproved: true,
  },
  lifecycle: {
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
    publiclyPublishable: false,
  },
  reopenOnlyFor: [
    "MATHEMATICAL_OR_LOGICAL_DEFECT",
    "ANSWER_INTEGRITY_DEFECT",
    "AMBIGUITY_OR_COMPETING_ANSWER_DEFECT",
    "SOURCE_PARITY_DEFECT",
    "LOCALISATION_MEANING_DEFECT",
    "LANGUAGE_NATURALNESS_DEFECT",
    "RENDERING_DEFECT",
  ],
} as const;

export type ClsCp006MultilingualFreeze = typeof CLS_CP006_MULTILINGUAL_FREEZE;

export type GeneratedClsCp006FrozenQuestion = Omit<
  GeneratedClsCp006LocalizedQuestion,
  "metadata" | "lifecycle"
> & {
  readonly metadata: Omit<
    GeneratedClsCp006LocalizedQuestion["metadata"],
    "runtimeVersion" | "localizationStatus"
  > & {
    readonly runtimeVersion: "cls-cp006-multilingual-frozen-runtime-v1";
    readonly localizationStatus: "FROZEN_MULTILINGUAL_RUNTIME_PROOF";
  };
  readonly lifecycle: Omit<
    GeneratedClsCp006LocalizedQuestion["lifecycle"],
    "reviewStatus"
  > & {
    readonly reviewStatus: "APPROVED_MULTILINGUAL_FROZEN";
  };
};

export function generateClsCp006FrozenQuestion(
  qlId: ClsCp006EnglishQlId,
  locale: ClsCp006TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp006FrozenQuestion {
  const english = generateClsCp006EnglishQuestion(qlId, seed, requestedOptionCount);
  const localized = localizeClsCp006Question(english, locale);

  return {
    ...localized,
    metadata: {
      ...localized.metadata,
      runtimeVersion: "cls-cp006-multilingual-frozen-runtime-v1",
      localizationStatus: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
    },
    lifecycle: {
      ...localized.lifecycle,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
    },
  };
}
