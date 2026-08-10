import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV7Final } from "./adaptive-review-v7-final";
import {
  buildAdaptiveSerCp007ReviewV71,
  type SerCp007AdaptiveReviewV71,
  type SerCp007ExamSuitabilityV71,
} from "./adaptive-review-v7-1";

function isUnderEvidencedInterleaved(question: SerCp007EditorialQuestion): boolean {
  return (
    question.temporaryTemplateId === "SER-CP-007-TMP-014" &&
    question.seed === 2
  );
}

function isExplicitAdvancedFourRow(question: SerCp007EditorialQuestion): boolean {
  return (
    (question.temporaryTemplateId === "SER-CP-007-WD-TMP-029" &&
      question.seed === 3) ||
    (question.temporaryTemplateId === "SER-CP-007-WD-TMP-031" &&
      question.seed === 1)
  );
}

function standardSuitability(
  difficulty: SerCp007AdaptiveReviewV71["difficulty"],
  maximumTermLength: number,
  visibleCharacterLoad: number,
): readonly SerCp007ExamSuitabilityV71[] {
  if (difficulty === "EASY") {
    return [
      "FOUNDATION",
      "SSC_MTS_CHSL",
      "SSC_CGL",
      "BANK_PRELIMS",
      "PUNJAB_STATE",
    ];
  }
  if (difficulty === "HARD") {
    return ["SSC_CGL", "BANK_MAINS", "PUNJAB_STATE"];
  }
  const tags: SerCp007ExamSuitabilityV71[] = [
    "SSC_CGL",
    "BANK_PRELIMS",
    "PUNJAB_STATE",
  ];
  if (maximumTermLength <= 6 && visibleCharacterLoad <= 35) {
    tags.unshift("SSC_MTS_CHSL");
  }
  return tags;
}

export function buildAdaptiveSerCp007ReviewV71Final(
  question: SerCp007EditorialQuestion,
): SerCp007AdaptiveReviewV71 {
  const review = buildAdaptiveSerCp007ReviewV71(question);
  const v7 = buildAdaptiveSerCp007ReviewV7Final(question);

  if (isUnderEvidencedInterleaved(question)) {
    return {
      ...review,
      releaseTier: "INTERNAL_REVIEW_ONLY",
      standardMockEligible: false,
      examSuitability: [],
    };
  }

  if (isExplicitAdvancedFourRow(question)) {
    return {
      ...review,
      releaseTier: "ADVANCED_PRACTICE",
      standardMockEligible: false,
      examSuitability: ["SSC_CGL", "BANK_MAINS", "ADVANCED_PRACTICE"],
    };
  }

  if (
    review.releaseTier === "ADVANCED_PRACTICE" &&
    v7.releaseTier === "STANDARD_MOCK" &&
    question.sourceRuleId === "FOUR_INTERLEAVED_CLUSTER_ROWS"
  ) {
    return {
      ...review,
      releaseTier: "STANDARD_MOCK",
      standardMockEligible: true,
      examSuitability: standardSuitability(
        review.difficulty,
        review.maximumTermLength,
        review.visibleCharacterLoad,
      ),
    };
  }

  return review;
}
