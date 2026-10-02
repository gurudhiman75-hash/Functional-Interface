export const REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_VERSION =
  "REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_2026_10_02_V1" as const;

export type ReasoningNoveltyHumanContentReviewVerdictV1 =
  "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION";

export interface ReasoningNoveltyHumanContentReviewEntryV1 {
  readonly providerId: string;
  readonly verdict: ReasoningNoveltyHumanContentReviewVerdictV1;
  readonly reviewedSampleCount: 4;
  readonly reviewSeedBand: string;
  readonly stemQuality: "PASS";
  readonly optionQuality: "PASS";
  readonly explanationQuality: "PASS";
  readonly answerDefensibility: "PASS";
  readonly chapterOwnership: "PASS";
  readonly noveltySubstance: "PASS";
  readonly activationAuthorized: false;
  readonly reviewerNote: string;
}

export const REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1 =
  Object.freeze([
    Object.freeze({
      providerId: "ALP-001-TRANSFORMED-GAP",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14000..14003",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Explicit alphabet transformation followed by transformed-order gap reasoning is exam-natural, solver-clear and substantively multi-stage.",
    }),
    Object.freeze({
      providerId: "OPS-001-INFER-THEN-FILL",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14100..14103",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Post-remediation samples rotate coded answers across M/N/P/Q and retain unique mapping inference before target-symbol completion.",
    }),
    Object.freeze({
      providerId: "RNK-001-CROSS-FAMILY-CASELET",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14200..14203",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Post-remediation samples use four distinct constraint structures and varied rank queries while preserving one unique six-person order.",
    }),
    Object.freeze({
      providerId: "CLK-001-FAULTY-TIME-ANGLE",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14300..14303",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Post-remediation wording is exam-natural and the explanation explicitly derives displayed time, hand angles and the smaller angle without engineering jargon.",
    }),
    Object.freeze({
      providerId: "CAE-001-EDGE-FAMILIES",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14400..14403",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Sequence, connector, immediate-cause and next-outcome samples are causally defensible; near-duplicate simple-event distractors are deterministically rejected.",
    }),
    Object.freeze({
      providerId: "DIR-001-GRAPH-RELATIVE-PATH",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14500..14503",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Post-remediation samples rotate orientation across quadrants and explanations show movement components plus exact Pythagorean shortest-distance working.",
    }),
    Object.freeze({
      providerId: "CAL-001-IMPLICIT-RANGE-FREQUENCY",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14600..14603",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Implicit date-range frequency questions are natural and explanations correctly decompose duration into complete weeks plus boundary days.",
    }),
    Object.freeze({
      providerId: "BLR-001-CODED-FILTERED-COUNT",
      verdict: "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
      reviewedSampleCount: 4,
      reviewSeedBand: "14700..14703",
      stemQuality: "PASS",
      optionQuality: "PASS",
      explanationQuality: "PASS",
      answerDefensibility: "PASS",
      chapterOwnership: "PASS",
      noveltySubstance: "PASS",
      activationAuthorized: false,
      reviewerNote:
        "Coded two-generation filtered-count questions are natural, uniquely solvable and explain decoded relations before counting female grandchildren.",
    }),
  ] as const satisfies readonly ReasoningNoveltyHumanContentReviewEntryV1[]);

export const REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_STATE = Object.freeze({
  reviewedProviderCount: REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1.length,
  passedProviderCount: REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1.filter(
    (entry) => entry.verdict === "CONTENT_REVIEW_PASS_AWAITING_ACTIVATION",
  ).length,
  activationAuthorizedProviderCount: REASONING_V1_NOVELTY_HUMAN_CONTENT_REVIEW_V1.filter(
    (entry) => entry.activationAuthorized,
  ).length,
  productionMixingChange: false,
  assemblyCreditChange: false,
});
