import assert from "node:assert/strict";
import {
  SER_CP007_TEMPLATE_PROBES_V71,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7-1";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV71Final } from "./adaptive-review-v7-1-final";
import {
  selectSerCp007PrimaryReleaseV71,
  type SerCp007ReleaseEntryV71,
} from "./student-release-selection-v7-1";

function seriesLine(stem: string): string | null {
  return [...stem.split("\n")]
    .reverse()
    .find((line) => line.includes(","))
    ?.trim() ?? null;
}

function displayedCount(question: SerCp007EditorialQuestion): number {
  return seriesLine(question.stem)?.split(",").length ?? 0;
}

function answerIndexes(question: SerCp007EditorialQuestion): readonly number[] {
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes;
  }
  if (typeof question.hiddenState?.answerIndex === "number") {
    return [question.hiddenState.answerIndex];
  }
  return [];
}

function commonPrefix(left: string, right: string): number {
  let index = 0;
  while (index < left.length && index < right.length && left[index] === right[index]) {
    index += 1;
  }
  return index;
}

const entries: SerCp007ReleaseEntryV71[] = [];
let interleavedRecords = 0;
let interleavedFutureTerms = 0;
let cumulativeWeakDistractors = 0;
let explanationModeMismatches = 0;
let markerContractProofs = 0;
let gapContractProofs = 0;
let explicitAdvancedProofs = 0;
let q154Internal = 0;
let q159TwoSided = 0;

for (const probe of SER_CP007_TEMPLATE_PROBES_V71) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const review = buildAdaptiveSerCp007ReviewV71Final(question);
    entries.push({ question, review });

    if (review.interleavedEvidence) {
      interleavedRecords += 1;
      assert.equal(review.interleavedEvidence.usesOnlyDisplayedTermsAndAnswers, true);
      const count = displayedCount(question);
      const future = (question.hiddenState?.canonicalTerms ?? []).slice(count);
      for (const term of future) {
        if (term && review.conciseReview.includes(term)) interleavedFutureTerms += 1;
      }
    }

    if (question.sourceRuleId === "CUMULATIVE_PREFIX_GROWTH") {
      const index = answerIndexes(question)[0];
      const previous =
        index !== undefined && index > 0
          ? question.hiddenState?.canonicalTerms?.[index - 1]
          : undefined;
      if (previous) {
        for (const option of question.options) {
          if (option === question.correctAnswer) continue;
          if (commonPrefix(option, previous) < Math.max(0, previous.length - 1)) {
            cumulativeWeakDistractors += 1;
          }
        }
      }
    }

    const hasExpanded = review.expandedReview !== review.conciseReview;
    if (
      (review.explanationMode === "CONCISE_WITH_EXPANDED_HELP") !== hasExpanded
    ) {
      explanationModeMismatches += 1;
    }

    if (question.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
      assert.equal(review.renderingContract?.kind, "CASE_MARKER");
      markerContractProofs += 1;
    }
    if (question.taskKind === "FILL_GAPS" || question.taskKind === "FILL_GAP_GROUPS") {
      assert.equal(review.renderingContract?.kind, "PERIODIC_GAP_LINE");
      gapContractProofs += 1;
    }
    if (
      ((question.temporaryTemplateId === "SER-CP-007-WD-TMP-029" &&
        question.seed === 3) ||
        (question.temporaryTemplateId === "SER-CP-007-WD-TMP-031" &&
          question.seed === 1)) &&
      review.releaseTier === "ADVANCED_PRACTICE"
    ) {
      explicitAdvancedProofs += 1;
    }
    if (
      question.temporaryTemplateId === "SER-CP-007-TMP-014" &&
      question.seed === 2 &&
      review.releaseTier === "INTERNAL_REVIEW_ONLY"
    ) {
      q154Internal += 1;
    }
    if (
      question.temporaryTemplateId === "SER-CP-007-WC-TMP-002" &&
      question.seed === 1
    ) {
      assert.match(review.conciseReview, /SDNG → OZKJ → KVHM/);
      assert.doesNotMatch(review.conciseReview, /GREP/);
      assert.ok((review.interleavedEvidence?.twoSidedMissingProofs ?? 0) >= 1);
      q159TwoSided += 1;
    }
  }
}

assert.equal(entries.length, 420);
assert.equal(interleavedFutureTerms, 0);
assert.equal(cumulativeWeakDistractors, 0);
assert.equal(explanationModeMismatches, 0);
assert.equal(explicitAdvancedProofs, 2);
assert.equal(q154Internal, 1);
assert.equal(q159TwoSided, 1);
assert.ok(markerContractProofs > 0);
assert.ok(gapContractProofs > 0);

const selection = selectSerCp007PrimaryReleaseV71(entries);
assert.equal(selection.primary.length, 135);
assert.equal(selection.standardPrimary.length, 96);
assert.equal(selection.advancedPrimary.length, 39);
assert.deepEqual(selection.standardAnswerPositionCounts, [24, 24, 24, 24]);
assert.ok(
  Math.max(...selection.advancedAnswerPositionCounts) -
    Math.min(...selection.advancedAnswerPositionCounts) <=
    1,
);
assert.equal(
  new Set(selection.primary.map((entry) => entry.review.studentReleasePoolKey)).size,
  135,
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_V7_1_RELEASE_REMEDIATION",
      temporaryTemplates: SER_CP007_TEMPLATE_PROBES_V71.length,
      sampledQuestions: entries.length,
      interleavedRecords,
      interleavedFutureTerms,
      cumulativeWeakDistractors,
      explanationModeMismatches,
      markerContractProofs,
      gapContractProofs,
      explicitAdvancedProofs,
      q154Internal,
      q159TwoSided,
      independentReleasePools: selection.primary.length,
      standardPrimaryCandidates: selection.standardPrimary.length,
      advancedPrimaryCandidates: selection.advancedPrimary.length,
      standardAnswerPositionCounts: selection.standardAnswerPositionCounts,
      advancedAnswerPositionCounts: selection.advancedAnswerPositionCounts,
      permanentQls: 0,
      englishFreeze: "PENDING_V7_1_MANUAL_APPROVAL",
      lifecycle: {
        questionStudio: false,
        questionBank: false,
        tests: false,
        public: false,
        localization: false,
      },
    },
    null,
    2,
  ),
);
