import assert from "node:assert/strict";
import {
  SER_CP007_TEMPLATE_PROBES_V6,
} from "../SER-CP-007-AUTHORITY-FREEZE-CANDIDATE/authority-compression-contract-v6";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV6 } from "./adaptive-review-v6";

const insertionRules = new Set([
  "CENTER_INSERTION_GROWTH",
  "ALTERNATING_INTERIOR_INSERTION_GROWTH",
]);
const rotationRules = new Set([
  "CYCLIC_CLUSTER_ROTATION",
  "NEXT_TWO_ROTATION",
]);

const failures: Array<{
  readonly template: string;
  readonly seed: number;
  readonly sourceRule: string;
  readonly blockers: readonly string[];
}> = [];
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
const releasePools = new Set<string>();
let sampledQuestions = 0;
let insertionProofs = 0;
let rotationProofs = 0;
let progressiveWrapProofs = 0;
let reverseDirectionProofs = 0;
let symmetricGrowthProofs = 0;
let visibleChecks = 0;
let visibleAnswerOccurrences = 0;

for (const probe of SER_CP007_TEMPLATE_PROBES_V6) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed) as unknown as SerCp007EditorialQuestion;
    const review = buildAdaptiveSerCp007ReviewV6(question);
    sampledQuestions += 1;
    visibleAnswerOccurrences += review.structuralDepth.visibleAnswerOccurrences;
    releasePools.add(review.studentReleasePoolKey);
    difficultyCounts.set(
      review.difficulty,
      (difficultyCounts.get(review.difficulty) ?? 0) + 1,
    );
    releaseCounts.set(
      review.releaseTier,
      (releaseCounts.get(review.releaseTier) ?? 0) + 1,
    );

    assert.equal(review.options.length, 4);
    assert.equal(new Set(review.options).size, 4);
    assert.equal(review.options[question.correctIndex], question.correctAnswer);
    assert.ok(
      review.review.includes(
        `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
      ),
    );
    assert.ok(review.review.includes("### Explanation"));
    assert.ok(!review.review.includes("move the first 1 letter"));
    assert.ok(
      !review.review.includes(
        "although the positions follow different movements",
      ),
    );
    if (review.review.includes("**Check:**")) visibleChecks += 1;

    if (!review.structuralDepth.passesStructuralDepth) {
      failures.push({
        template: question.temporaryTemplateId,
        seed,
        sourceRule: question.sourceRuleId,
        blockers: review.structuralDepth.blockers,
      });
    }

    if (insertionRules.has(question.sourceRuleId)) {
      insertionProofs += 1;
      assert.equal(review.structuralDepth.determinateRule, true);
      assert.match(question.explanation.rule, /inserted letters follow a fixed \+\d+/i);
      assert.match(review.review, /Inserted-letter sequence:/);
      if (question.taskKind === "NEXT_TERM") {
        assert.match(review.review, /Use both insertion position and inserted-letter progression/);
      }
    }

    if (rotationRules.has(question.sourceRuleId)) {
      rotationProofs += 1;
      const terms = question.hiddenState?.canonicalTerms ?? [];
      assert.equal(terms.length, 7);
      assert.equal(new Set(terms).size, 7);
      assert.equal(review.structuralDepth.visibleAnswerOccurrences, 0);
      assert.equal(review.structuralDepth.minimumExactPeriod, null);
      assert.match(review.review, /position order/i);
      assert.match(review.review, /rearranged, not changed alphabetically/i);
    }

    if (question.sourceRuleId === "PROGRESSIVE_COLUMN_SHIFTS") {
      if (review.review.includes("wraps to")) progressiveWrapProofs += 1;
      assert.match(review.review, /Keep the conceptual jump progression/);
    }

    if (
      question.sourceRuleId === "SHRINKING_CONSECUTIVE_BLOCKS" &&
      seed === 3
    ) {
      reverseDirectionProofs += 1;
      assert.match(review.review, /Moving backward, skip/);
      assert.ok(
        !review.review.includes(
          "G and H and I and J and K and L and M and N and O and P and Q and R",
        ),
      );
    }

    if (question.canonicalAuthorityId === "SYMMETRIC_EDGE_GROWTH") {
      symmetricGrowthProofs += 1;
      assert.match(review.review, /New left-edge letters:/);
      assert.match(review.review, /New right-edge letters:/);
      assert.match(review.review, /new left letter moves/);
      assert.match(review.review, /new right letter moves/);
    }
  }
}

if (failures.length > 0) {
  console.error(
    JSON.stringify(
      {
        status: "FAIL_SER_CP007_V6_REMEDIATION",
        failures,
      },
      null,
      2,
    ),
  );
}

assert.equal(SER_CP007_TEMPLATE_PROBES_V6.length, 140);
assert.equal(sampledQuestions, 420);
assert.equal(failures.length, 0);
assert.equal(visibleAnswerOccurrences, 0);
assert.equal(insertionProofs, 24);
assert.equal(rotationProofs, 15);
assert.ok(progressiveWrapProofs > 0);
assert.equal(reverseDirectionProofs, 3);
assert.equal(symmetricGrowthProofs, 15);
assert.equal(visibleChecks, 0);
assert.ok(releasePools.size < sampledQuestions);
assert.ok(releasePools.size >= 120);
assert.ok((difficultyCounts.get("HARD") ?? 0) < 170);
assert.equal(releaseCounts.get("INTERNAL_REVIEW_ONLY") ?? 0, 0);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_V6_TARGETED_REMEDIATION",
      temporaryTemplates: SER_CP007_TEMPLATE_PROBES_V6.length,
      sampledQuestions,
      structuralFailures: failures.length,
      visibleAnswerOccurrences,
      determinateInsertionProofs: insertionProofs,
      cycleSafeRotationProofs: rotationProofs,
      progressiveWrapProofs,
      reverseDirectionProofs,
      symmetricGrowthProofs,
      misleadingVisibleChecks: visibleChecks,
      independentStudentReleasePools: releasePools.size,
      mutuallyExclusiveVariants: sampledQuestions - releasePools.size,
      difficultyCounts: Object.fromEntries(difficultyCounts),
      releaseCounts: Object.fromEntries(releaseCounts),
      permanentQls: 0,
      englishFreeze: "PENDING_V6_MANUAL_APPROVAL",
    },
    null,
    2,
  ),
);
