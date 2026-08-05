import assert from "node:assert/strict";
import {
  SER_CP007_TEMPORARY_TEMPLATES,
  generateSerCp007Question,
} from "../SER-CP-007/foundation";
import {
  SER_CP007_WAVE_B_TEMPORARY_TEMPLATES,
  generateSerCp007WaveBQuestion,
} from "../SER-CP-007-WAVE-B/foundation-expanded";
import {
  SER_CP007_WAVE_C_TEMPORARY_TEMPLATES,
  generateSerCp007WaveCQuestion,
} from "../SER-CP-007-WAVE-C/foundation-refined";
import {
  SER_CP007_WAVE_D_TEMPORARY_TEMPLATES,
  generateSerCp007WaveDQuestion,
} from "../SER-CP-007-WAVE-D/foundation";
import {
  SER_CP007_WAVE_E_TEMPORARY_TEMPLATES,
  generateSerCp007WaveEQuestion,
} from "../SER-CP-007-WAVE-E/foundation";
import type { SerCp007EditorialQuestion } from "./adaptive-review";
import { buildAdaptiveSerCp007ReviewV4 } from "./adaptive-review-v4";
import {
  selectSerCp007StandardMockSet,
  profileSerCp007Question,
} from "./exam-readiness-profile";
import { validateSerCp007DistractorCandidateV2 } from "../SER-CP-007-DISTRACTOR-AUDIT/distractor-candidate-v2";

type Probe = {
  readonly generate: (seed: number) => SerCp007EditorialQuestion;
};

const probes: readonly Probe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
];

assert.equal(probes.length, 140);

function answerIndexes(question: SerCp007EditorialQuestion): readonly number[] {
  if (question.hiddenState?.answerIndexes?.length) {
    return question.hiddenState.answerIndexes;
  }
  if (typeof question.hiddenState?.answerIndex === "number") {
    return [question.hiddenState.answerIndex];
  }
  return [];
}

function answerTerms(question: SerCp007EditorialQuestion): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms ?? [];
  const indexes = answerIndexes(question);
  if (terms.length > 0 && indexes.length > 0) {
    return indexes.map((index) => terms[index]!).filter(Boolean);
  }
  if (
    question.taskKind === "FILL_GAPS" ||
    question.taskKind === "FILL_GAP_GROUPS"
  ) {
    return [];
  }
  const pieces = question.correctAnswer
    .split(/,|→/)
    .map((piece) => piece.trim())
    .filter(Boolean);
  return question.correctAnswer.includes("→") ? pieces.slice(-1) : pieces;
}

function wordCount(value: string): number {
  return value
    .replace(/[`*_#✓]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

const questions: SerCp007EditorialQuestion[] = [];
const roleCombinations = new Set<string>();
const difficultyCounts = new Map<string, number>();
const releaseCounts = new Map<string, number>();
const reviewWords: number[] = [];
let sampledReviews = 0;
let targetStepProofs = 0;
let progressiveTableProofs = 0;
let cumulativeTargetProofs = 0;
let consecutiveLengthAndStartProofs = 0;
let symmetricTargetProofs = 0;
let distractorProofs = 0;
let deadDisplayedOptions = 0;
let unchangedArrowOptions = 0;
let visibleCheckProofs = 0;
let polishedPreviousStems = 0;
let polishedWrongPairStems = 0;
let advancedQuestions = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const v4 = buildAdaptiveSerCp007ReviewV4(question);
    questions.push(question);

    assert.equal(v4.options.length, 4);
    assert.equal(new Set(v4.options).size, 4);
    assert.equal(v4.options[question.correctIndex], question.correctAnswer);
    assert.equal(v4.distractors.length, 3);
    assert.equal(new Set(v4.distractors.map((entry) => entry.role)).size, 3);
    roleCombinations.add(v4.distractors.map((entry) => entry.role).join("|"));

    for (const distractor of v4.distractors) {
      assert.ok(validateSerCp007DistractorCandidateV2(question, distractor));
      assert.ok(v4.review.includes(distractor.value));
      distractorProofs += 1;
    }

    const lastStemLine = question.stem.split("\n").at(-1) ?? "";
    const displayed = new Set(
      lastStemLine
        .split(",")
        .map((term) => term.trim().replace(/^\?+|\?+$/g, ""))
        .filter((term) => /^[A-Za-z]+$/.test(term)),
    );
    for (const distractor of v4.distractors) {
      if (displayed.has(distractor.value)) deadDisplayedOptions += 1;
      if (distractor.value.includes("→")) {
        const [left, right] = distractor.value
          .split("→")
          .map((part) => part.trim());
        if (left === right) unchangedArrowOptions += 1;
      }
    }

    const requiredTerms = answerTerms(question);
    if (requiredTerms.length > 0) {
      for (const answer of requiredTerms) {
        assert.ok(
          v4.workedSteps.some((step) => step.includes(answer)),
          `${question.temporaryTemplateId}: exact answer term missing from worked proof`,
        );
      }
      targetStepProofs += 1;
    }

    if (question.sourceRuleId === "PROGRESSIVE_COLUMN_SHIFTS") {
      assert.ok(v4.workedSteps.every((step) => /jumps:|required .* group/i.test(step)));
      assert.ok(v4.workedSteps.some((step) => /jumps:/i.test(step)));
      progressiveTableProofs += 1;
    }

    if (
      question.sourceRuleId === "CUMULATIVE_PREFIX_GROWTH" &&
      (question.taskKind === "MISSING_TERM" || question.taskKind === "PREVIOUS_TERM")
    ) {
      const terms = question.hiddenState?.canonicalTerms ?? [];
      const index = answerIndexes(question)[0];
      assert.notEqual(index, undefined);
      const answer = terms[index!]!;
      const neighbour = index! > 0 ? terms[index! - 1]! : terms[index! + 1]!;
      assert.ok(v4.workedSteps.some((step) => step.includes(answer) && step.includes(neighbour)));
      cumulativeTargetProofs += 1;
    }

    if (
      question.sourceRuleId === "SHRINKING_CONSECUTIVE_BLOCKS" ||
      question.sourceRuleId === "GROWING_CONSECUTIVE_BLOCKS"
    ) {
      assert.ok(v4.workedSteps.some((step) => step.startsWith("Lengths:")));
      assert.ok(v4.workedSteps.some((step) => step.startsWith("Starting letters:")));
      assert.ok(v4.workedSteps.some((step) => /skipped/i.test(step)));
      consecutiveLengthAndStartProofs += 1;
    }

    if (
      question.sourceRuleId === "SYMMETRIC_EDGE_GROWTH" &&
      (question.taskKind === "MISSING_TERM" || question.taskKind === "PREVIOUS_TERM")
    ) {
      const terms = question.hiddenState?.canonicalTerms ?? [];
      const index = answerIndexes(question)[0];
      assert.notEqual(index, undefined);
      const answer = terms[index!]!;
      const neighbour = index! > 0 ? terms[index! - 1]! : terms[index! + 1]!;
      assert.ok(v4.workedSteps.some((step) => step.includes(answer) && step.includes(neighbour)));
      symmetricTargetProofs += 1;
    }

    if (question.taskKind === "PREVIOUS_TERM") {
      assert.match(
        v4.stem,
        /^Which letter group should come immediately before the first given term\?/,
      );
      assert.doesNotMatch(v4.review, /Now move one step backward using the same rule/i);
      polishedPreviousStems += 1;
    }

    if (question.taskKind === "WRONG_AND_REPLACEMENT") {
      assert.match(
        v4.stem,
        /^Identify the incorrect group and select its correct replacement\./,
      );
      polishedWrongPairStems += 1;
    }

    if (v4.renderedCheck) {
      assert.ok(v4.visibleCheckRole);
      assert.match(v4.review, /\*\*Check:\*\* Option [1-4] \(.+\) is tempting because/);
      visibleCheckProofs += 1;
    }

    assert.ok(["EASY", "MEDIUM", "HARD"].includes(v4.difficulty));
    assert.ok(
      ["STANDARD_MOCK", "ADVANCED_PRACTICE", "INTERNAL_REVIEW_ONLY"].includes(
        v4.releaseTier,
      ),
    );
    if (v4.standardMockEligible) {
      assert.ok(v4.maximumTermLength <= 14);
      assert.ok(v4.visibleCharacterLoad <= 105);
    } else {
      advancedQuestions += 1;
    }

    difficultyCounts.set(v4.difficulty, (difficultyCounts.get(v4.difficulty) ?? 0) + 1);
    releaseCounts.set(v4.releaseTier, (releaseCounts.get(v4.releaseTier) ?? 0) + 1);

    assert.doesNotMatch(v4.review, /trap code|canonical authority|distractor role/i);
    assert.doesNotMatch(v4.review, /📌|📝|⚡|⚠️/);
    reviewWords.push(wordCount(v4.review));
    sampledReviews += 1;
  }
}

assert.equal(sampledReviews, 420);
assert.equal(distractorProofs, 1_260);
assert.equal(deadDisplayedOptions, 0);
assert.equal(unchangedArrowOptions, 0);
assert.ok(roleCombinations.size >= 18);
assert.equal(progressiveTableProofs, 12);
assert.equal(cumulativeTargetProofs, 6);
assert.equal(consecutiveLengthAndStartProofs, 24);
assert.equal(symmetricTargetProofs, 6);
assert.equal(polishedPreviousStems, 84);
assert.equal(polishedWrongPairStems, 3);
assert.equal(visibleCheckProofs, 102);
assert.ok(targetStepProofs >= 400);
assert.ok(advancedQuestions > 0);
assert.ok(difficultyCounts.size === 3);
assert.ok(releaseCounts.size >= 2);

const standardSet = selectSerCp007StandardMockSet(questions, 40);
assert.equal(standardSet.length, 40);
const standardProfiles = standardSet.map(profileSerCp007Question);
assert.equal(
  new Set(standardProfiles.map((profile) => profile.stateFingerprint)).size,
  standardSet.length,
);
assert.ok(standardProfiles.every((profile) => profile.standardMockEligible));
assert.ok(
  standardSet.filter((question) => question.taskKind === "PREVIOUS_TERM").length <= 6,
);

const averageWords =
  reviewWords.reduce((sum, value) => sum + value, 0) / reviewWords.length;
assert.ok(averageWords < 135);
assert.ok(Math.max(...reviewWords) < 260);
assert.ok(Math.min(...reviewWords) >= 35);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_V4_ONE_GO_EXAM_READINESS_REMEDIATION",
      temporaryTemplates: probes.length,
      sampledReviews,
      targetStepProofs,
      progressiveTableProofs,
      cumulativeTargetProofs,
      consecutiveLengthAndStartProofs,
      symmetricTargetProofs,
      distractorProofs,
      deadDisplayedOptions,
      unchangedArrowOptions,
      distractorRoleCombinations: roleCombinations.size,
      visibleCheckProofs,
      polishedPreviousStems,
      polishedWrongPairStems,
      difficultyCounts: Object.fromEntries(difficultyCounts),
      releaseCounts: Object.fromEntries(releaseCounts),
      standardMockSelectionProof: standardSet.length,
      standardMockUniqueStates: new Set(
        standardProfiles.map((profile) => profile.stateFingerprint),
      ).size,
      averageReviewWords: Number(averageWords.toFixed(2)),
      maximumReviewWords: Math.max(...reviewWords),
      permanentQls: 0,
      englishFreeze: "PENDING_REGENERATED_PACK_MANUAL_APPROVAL",
      nextAuthority: "SER_CP007_V4_REGENERATED_400Q_MANUAL_APPROVAL",
    },
    null,
    2,
  ),
);
