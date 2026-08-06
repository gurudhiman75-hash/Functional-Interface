import assert from "node:assert/strict";
import {
  SER_CP007_TEMPLATE_PROBES_V7,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v7";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV7 } from "./adaptive-review-v7";
import { isUniformWholeAnswerShiftV7 } from "./distractor-remediation-v7";
import {
  assertSerCp007ReleasePoolUniquenessV7,
  excludeRecentSerCp007ReleasePoolsV7,
  selectSerCp007PrimaryReleaseV7,
  type SerCp007ReleaseEntryV7,
} from "./student-release-selection-v7";

const INTERLEAVED_RULES = new Set([
  "TWO_INTERLEAVED_CLUSTER_ROWS",
  "ALTERNATING_FRAME_CORE_ROWS",
  "THREE_INTERLEAVED_CLUSTER_ROWS",
  "FOUR_INTERLEAVED_CLUSTER_ROWS",
  "NEXT_TWO_INTERLEAVED_ROWS",
]);

const entries: SerCp007ReleaseEntryV7[] = [];
let sampledQuestions = 0;
let interleavedProofs = 0;
let markerProofs = 0;
let progressiveAdvancedProofs = 0;
let globalShiftDistractors = 0;
let standardOverLength = 0;
let standardOverLoad = 0;
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();

for (const probe of SER_CP007_TEMPLATE_PROBES_V7) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const review = buildAdaptiveSerCp007ReviewV7(question);
    entries.push({ question, review });
    sampledQuestions += 1;

    assert.equal(review.options.length, 4);
    assert.equal(new Set(review.options).size, 4);
    assert.equal(review.options[question.correctIndex], question.correctAnswer);
    assert.match(review.review, /### Explanation/);
    assert.match(review.review, /\*\*Answer:\*\*/);
    assert.equal(review.explanationMode, "CONCISE_WITH_EXPANDED_HELP");

    for (const option of review.options) {
      if (
        option !== question.correctAnswer &&
        isUniformWholeAnswerShiftV7(option, question.correctAnswer)
      ) {
        globalShiftDistractors += 1;
      }
    }

    if (INTERLEAVED_RULES.has(question.sourceRuleId)) {
      interleavedProofs += 1;
      assert.ok(review.interleavedProof);
      assert.equal(review.interleavedProof?.passesSameRowProof, true);
      assert.ok((review.interleavedProof?.transitions.length ?? 0) >= 2);
      for (const transition of review.interleavedProof!.transitions) {
        assert.equal(
          transition.fromIndex % review.interleavedProof!.rowCount,
          transition.targetRowIndex,
        );
        assert.equal(
          transition.toIndex % review.interleavedProof!.rowCount,
          transition.targetRowIndex,
        );
        assert.equal(transition.rowIndex, transition.targetRowIndex);
      }
      assert.match(review.conciseReview, /target row only/i);
      assert.ok(!review.conciseReview.includes("YA → XK: Y→X"));
      assert.ok(!review.conciseReview.includes("DVUPNG → ZFOMAN"));
      assert.ok(!review.conciseReview.includes("EIDJ → GREP"));
      assert.ok(!review.conciseReview.includes("OMS → KWC"));
      assert.ok(!review.conciseReview.includes("WG → YA"));
    }

    if (question.sourceRuleId === "UNIFORM_FRAME_CASE_MARKER_ROTATION") {
      markerProofs += 1;
      assert.match(review.review, /Marker positions:/);
      assert.match(review.review, /Track the marker position/);
      assert.ok(!review.review.includes("x→X (0)"));
      assert.ok(!review.review.includes("X→x (0)"));
    }

    if (question.sourceRuleId === "PROGRESSIVE_COLUMN_SHIFTS") {
      progressiveAdvancedProofs += 1;
      assert.equal(review.releaseTier, "ADVANCED_PRACTICE");
      assert.equal(review.difficulty, "HARD");
      assert.ok(review.conciseReview.length < review.expandedReview.length);
      assert.match(review.conciseReview, /decisive progressive jump/i);
    }

    if (review.releaseTier === "STANDARD_MOCK") {
      const fillTask =
        question.taskKind === "FILL_GAPS" ||
        question.taskKind === "FILL_GAP_GROUPS";
      if (!fillTask && review.maximumTermLength > 10) standardOverLength += 1;
      if (!fillTask && review.visibleCharacterLoad > 50) standardOverLoad += 1;
      if (fillTask) assert.ok(review.visibleCharacterLoad <= 70);
    }

    difficultyCounts.set(
      review.difficulty,
      (difficultyCounts.get(review.difficulty) ?? 0) + 1,
    );
    releaseCounts.set(
      review.releaseTier,
      (releaseCounts.get(review.releaseTier) ?? 0) + 1,
    );
  }
}

const selection = selectSerCp007PrimaryReleaseV7(entries);
assert.equal(SER_CP007_TEMPLATE_PROBES_V7.length, 140);
assert.equal(sampledQuestions, 420);
assert.equal(interleavedProofs, 48);
assert.equal(markerProofs, 12);
assert.equal(progressiveAdvancedProofs, 12);
assert.equal(globalShiftDistractors, 0);
assert.equal(standardOverLength, 0);
assert.equal(standardOverLoad, 0);
assert.equal(selection.primary.length, 135);
assert.equal(selection.standardPrimary.length + selection.advancedPrimary.length, 135);
assertSerCp007ReleasePoolUniquenessV7(selection.primary);

const nextTerms = selection.standardPrimary.filter(
  (entry) => entry.review.editorialTaskKind === "NEXT_TERM",
).length;
const missingTerms = selection.standardPrimary.filter(
  (entry) => entry.review.editorialTaskKind === "MISSING_TERM",
).length;
const nextShare = nextTerms / selection.standardPrimary.length;
assert.ok(selection.standardPrimary.length >= 90);
assert.ok(selection.advancedPrimary.length >= 25);
assert.ok(nextShare >= 0.4 && nextShare <= 0.55);
assert.ok(missingTerms >= 12);

const blocked = new Set(
  selection.primary.slice(0, 10).map(
    (entry) => entry.review.studentReleasePoolKey,
  ),
);
const recentSafe = excludeRecentSerCp007ReleasePoolsV7(
  selection.primary,
  blocked,
);
assert.equal(recentSafe.length, selection.primary.length - 10);
assert.ok(
  recentSafe.every(
    (entry) => !blocked.has(entry.review.studentReleasePoolKey),
  ),
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_V7_EDITORIAL_REMEDIATION",
      temporaryTemplates: SER_CP007_TEMPLATE_PROBES_V7.length,
      sampledQuestions,
      interleavedSameRowProofs: interleavedProofs,
      markerPositionProofs: markerProofs,
      progressiveAdvancedProofs,
      uniformWholeAnswerShiftDistractors: globalShiftDistractors,
      standardOverLength,
      standardOverLoad,
      independentReleasePools: selection.primary.length,
      standardPrimaryCandidates: selection.standardPrimary.length,
      advancedPrimaryCandidates: selection.advancedPrimary.length,
      standardPrimaryTaskCounts: selection.taskCounts,
      standardNextTermShare: Number(nextShare.toFixed(4)),
      difficultyCounts: Object.fromEntries(difficultyCounts),
      releaseCounts: Object.fromEntries(releaseCounts),
      permanentQls: 0,
      englishFreeze: "PENDING_V7_MANUAL_APPROVAL",
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
