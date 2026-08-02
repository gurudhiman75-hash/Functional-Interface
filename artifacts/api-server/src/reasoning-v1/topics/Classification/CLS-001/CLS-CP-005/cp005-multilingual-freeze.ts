import {
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
} from "./cp005-english-contracts";
import { generateClsCp005EnglishQuestion } from "./cp005-english-runtime";
import {
  localizeClsCp005Question,
  type GeneratedClsCp005LocalizedQuestion,
} from "./localization/cp005-localizer";
import type { ClsCp005TranslatedLocale } from "./localization/cp005-language-pack";

export const CLS_CP005_MULTILINGUAL_FREEZE = {
  chapterId: "CLS-001",
  checkpointId: "CLS-CP-005",
  status: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
  approvalAuthority: "EXPLICIT_USER_EDITORIAL_SIGN_OFF",
  approvalCommentId: 5157862721,
  approvedAtUtc: "2026-08-02T12:29:23Z",
  approvedAtIst: "2026-08-02T17:59:23+05:30",
  approvedReviewedHead: "d4f8a786ab28bad895216dc8558b3afb904f6cd6",
  synchronizedBaseHead: "30ae44d7c84dc956cf6c91b719fb6bd3259d83d7",
  preFreezeValidatedHead: "46ba3f81e2672a3d22656558d5f2fa1df2bf17ef",
  permanentQlIds: [
    CLS_CP005_ODD_TUPLE_QL_ID,
    CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  ],
  frozenLocales: ["hi-IN", "pa-IN"],
  ruleCount: 35,
  reviewQuestionCount: 140,
  localeQuestionCounts: {
    "hi-IN": 70,
    "pa-IN": 70,
  },
  qlQuestionCounts: {
    [CLS_CP005_ODD_TUPLE_QL_ID]: 70,
    [CLS_CP005_EQUIVALENT_TUPLE_QL_ID]: 70,
  },
  synchronizedProof: {
    workflowRunId: 30748032576,
    reviewArtifact: {
      id: 8833522921,
      name: "cls-001-cp005-hi-pa-localisation-review",
      digest: "sha256:f455a5dc11a40f41613e193b1ccc0e42b2ba4e99af74ff4d28d89cc8312e8ad9",
      questionCount: 140,
    },
    diagnosticsArtifact: {
      id: 8833521410,
      name: "cls-001-cp005-localisation-diagnostics",
      digest: "sha256:01fa792418920d8deaadd29ea09c40518e6434f003f3865a5fd6543dfb334f23",
    },
  },
  contentGuarantees: {
    canonicalEnglishSolverUnchanged: true,
    mathematicalStateUnchanged: true,
    optionOrderUnchanged: true,
    answerAndIndexUnchanged: true,
    ambiguityProofUnchanged: true,
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

export type ClsCp005MultilingualFreeze = typeof CLS_CP005_MULTILINGUAL_FREEZE;

export type GeneratedClsCp005FrozenQuestion = Omit<
  GeneratedClsCp005LocalizedQuestion,
  "metadata" | "lifecycle"
> & {
  readonly metadata: Omit<
    GeneratedClsCp005LocalizedQuestion["metadata"],
    "runtimeVersion" | "localizationStatus"
  > & {
    readonly runtimeVersion: "cls-cp005-multilingual-frozen-runtime-v1";
    readonly localizationStatus: "FROZEN_MULTILINGUAL_RUNTIME_PROOF";
  };
  readonly lifecycle: Omit<
    GeneratedClsCp005LocalizedQuestion["lifecycle"],
    "reviewStatus"
  > & {
    readonly reviewStatus: "APPROVED_MULTILINGUAL_FROZEN";
  };
};

export function generateClsCp005FrozenQuestion(
  qlId: ClsCp005EnglishQlId,
  locale: ClsCp005TranslatedLocale,
  seed = 0,
  requestedOptionCount?: 4 | 5,
): GeneratedClsCp005FrozenQuestion {
  const english = generateClsCp005EnglishQuestion(qlId, seed, requestedOptionCount);
  const localized = localizeClsCp005Question(english, locale);

  return {
    ...localized,
    metadata: {
      ...localized.metadata,
      runtimeVersion: "cls-cp005-multilingual-frozen-runtime-v1",
      localizationStatus: "FROZEN_MULTILINGUAL_RUNTIME_PROOF",
    },
    lifecycle: {
      ...localized.lifecycle,
      reviewStatus: "APPROVED_MULTILINGUAL_FROZEN",
    },
  };
}
