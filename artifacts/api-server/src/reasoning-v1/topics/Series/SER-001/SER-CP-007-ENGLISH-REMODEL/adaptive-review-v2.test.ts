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
import {
  buildAdaptiveSerCp007Review,
  type SerCp007EditorialQuestion,
  type SerCp007EditorialTaskKind,
  type SerCp007ProofModel,
} from "./adaptive-review";

type Probe = {
  readonly temporaryTemplateId: string;
  readonly generate: (seed: number) => SerCp007EditorialQuestion;
};

const probes: readonly Probe[] = [
  ...SER_CP007_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007Question(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_B_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveBQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_C_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveCQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_D_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveDQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
  ...SER_CP007_WAVE_E_TEMPORARY_TEMPLATES.map((template) => ({
    temporaryTemplateId: template.temporaryTemplateId,
    generate: (seed: number) =>
      generateSerCp007WaveEQuestion(
        template.temporaryTemplateId,
        seed,
      ) as unknown as SerCp007EditorialQuestion,
  })),
];

assert.equal(probes.length, 140);

function increment<K>(map: Map<K, number>, key: K): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function wordCount(value: string): number {
  return value
    .replace(/[`*_#✓]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

function requiresTermAnswerApplication(
  taskKind: SerCp007EditorialTaskKind,
): boolean {
  return [
    "NEXT_TERM",
    "MISSING_TERM",
    "PREVIOUS_TERM",
    "REPLACE_WRONG_TERM",
  ].includes(taskKind);
}

function isGapCompletionTask(taskKind: SerCp007EditorialTaskKind): boolean {
  return taskKind === "FILL_GAPS" || taskKind === "FILL_GAP_GROUPS";
}

function answerTerms(question: SerCp007EditorialQuestion): readonly string[] {
  const terms = question.hiddenState?.canonicalTerms;
  const indexes =
    question.hiddenState?.answerIndexes ??
    (typeof question.hiddenState?.answerIndex === "number"
      ? [question.hiddenState.answerIndex]
      : []);
  if (terms && indexes.length > 0) {
    return indexes.map((index) => terms[index]!).filter(Boolean);
  }
  const replacement = question.correctAnswer.split("→").at(-1)?.trim();
  return replacement ? [replacement] : [question.correctAnswer];
}

const taskCounts = new Map<SerCp007EditorialTaskKind, number>();
const proofModelCounts = new Map<SerCp007ProofModel, number>();
const reviewWords: number[] = [];
let sampledReviews = 0;
let decisiveAnswerProofs = 0;
let gapReconstructionProofs = 0;
let multiAnswerProofs = 0;
let wrongPairProofs = 0;
let completePositionTableProofs = 0;
let compressedWrongSeriesProofs = 0;
let replacementCheckWordingProofs = 0;
let shortcutReviews = 0;
let checkReviews = 0;
let reviewsOver160Words = 0;
let missingTermAnswerProofs = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const candidate = buildAdaptiveSerCp007Review(question);

    assert.ok(candidate.workedSteps.length > 0);
    assert.equal(new Set(candidate.workedSteps).size, candidate.workedSteps.length);
    assert.doesNotMatch(
      candidate.workedSteps.join(" "),
      /^First write the correct series:/m,
    );
    assert.doesNotMatch(
      candidate.workedSteps.join(" "),
      /^First check the shown groups:/m,
    );

    const originalPositionRows = question.explanation.steps.filter((step) =>
      /^Position \d+:/i.test(step),
    );
    const selectedPositionRows = candidate.workedSteps.filter((step) =>
      /^Position \d+:/i.test(step),
    );

    if (originalPositionRows.length > 0) {
      assert.deepEqual(selectedPositionRows, originalPositionRows);
      completePositionTableProofs += 1;
    } else if (requiresTermAnswerApplication(candidate.editorialTaskKind)) {
      assert.ok(
        candidate.workedSteps.some((step) =>
          step.includes(question.correctAnswer),
        ),
        `${question.temporaryTemplateId}: worked proof does not apply the rule to ${question.correctAnswer}`,
      );
      decisiveAnswerProofs += 1;
    }

    if (isGapCompletionTask(candidate.editorialTaskKind)) {
      assert.equal(candidate.proofModel, "CONTINUOUS_GAP_COMPLETION");
      assert.ok(
        candidate.workedSteps.some((step) => /Complete line:/i.test(step)),
        `${question.temporaryTemplateId}: gap proof does not reconstruct the complete line`,
      );
      gapReconstructionProofs += 1;
    }

    if (
      candidate.editorialTaskKind === "NEXT_TWO_TERMS" ||
      candidate.editorialTaskKind === "MISSING_TWO_TERMS"
    ) {
      const requiredTerms = answerTerms(question);
      assert.equal(requiredTerms.length, 2);
      for (const term of requiredTerms) {
        assert.ok(
          candidate.workedSteps.some((step) => step.includes(term)),
          `${question.temporaryTemplateId}: two-answer proof omits ${term}`,
        );
      }
      multiAnswerProofs += 1;
    }

    if (candidate.editorialTaskKind === "WRONG_AND_REPLACEMENT") {
      const requiredTerms = answerTerms(question);
      assert.equal(requiredTerms.length, 1);
      assert.ok(
        candidate.workedSteps.some((step) => step.includes(requiredTerms[0]!)),
      );
      assert.equal(new Set(candidate.workedSteps).size, candidate.workedSteps.length);
      wrongPairProofs += 1;
    }

    if (candidate.editorialTaskKind === "MISSING_TERM") {
      if (originalPositionRows.length === 0) {
        assert.ok(
          candidate.workedSteps.some((step) =>
            step.includes(question.correctAnswer),
          ),
        );
      }
      missingTermAnswerProofs += 1;
    }

    if (candidate.editorialTaskKind === "REPLACE_WRONG_TERM") {
      assert.doesNotMatch(
        candidate.workedSteps.join("\n"),
        /^First write the correct series:/m,
      );
      assert.ok(candidate.review.includes(question.explanation.conclusion));
      if (candidate.renderedCheck) {
        assert.doesNotMatch(candidate.review, /row containing the blank|the blank/i);
        replacementCheckWordingProofs += 1;
      }
      compressedWrongSeriesProofs += 1;
    }

    if (candidate.renderedShortcut) shortcutReviews += 1;
    if (candidate.renderedCheck) checkReviews += 1;

    const words = wordCount(candidate.review);
    reviewWords.push(words);
    if (words > 160) reviewsOver160Words += 1;

    assert.doesNotMatch(candidate.review, /📌 \*\*Rule\*\*/);
    assert.doesNotMatch(candidate.review, /📝 \*\*Solution\*\*/);
    assert.doesNotMatch(candidate.review, /⚡ \*\*Quick Method\*\*/);
    assert.doesNotMatch(candidate.review, /⚠️ \*\*Common Mistake\*\*/);
    assert.doesNotMatch(candidate.review, /\[[A-Z][A-Z0-9_]*\]/);
    assert.doesNotMatch(
      candidate.review,
      /editorial task|proof model|trap code|canonical authority/i,
    );

    increment(taskCounts, candidate.editorialTaskKind);
    increment(proofModelCounts, candidate.proofModel);
    sampledReviews += 1;
  }
}

assert.equal(sampledReviews, 420);
assert.equal(proofModelCounts.size, 6);
assert.equal(missingTermAnswerProofs, 99);
assert.equal(gapReconstructionProofs, 12);
assert.equal(multiAnswerProofs, 21);
assert.equal(wrongPairProofs, 3);
assert.equal(compressedWrongSeriesProofs, 99);
assert.ok(replacementCheckWordingProofs > 0);
assert.ok(decisiveAnswerProofs > 0);
assert.ok(completePositionTableProofs > 0);
assert.ok(shortcutReviews >= 50 && shortcutReviews <= 260);
assert.equal(checkReviews, 102);

const averageReviewWords =
  reviewWords.reduce((sum, value) => sum + value, 0) / reviewWords.length;
assert.ok(averageReviewWords < 120);
assert.ok(Math.max(...reviewWords) < 190);
assert.ok(reviewsOver160Words < 40);
assert.ok(Math.min(...reviewWords) >= 35);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V2",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      sampledReviews,
      proofModels: Object.fromEntries([...proofModelCounts.entries()].sort()),
      editorialTaskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      decisiveAnswerProofs,
      gapReconstructionProofs,
      multiAnswerProofs,
      wrongPairProofs,
      completePositionTableProofs,
      missingTermAnswerProofs,
      compressedWrongSeriesProofs,
      replacementCheckWordingProofs,
      shortcutReviews,
      checkReviews,
      averageReviewWords: Number(averageReviewWords.toFixed(2)),
      minimumReviewWords: Math.min(...reviewWords),
      maximumReviewWords: Math.max(...reviewWords),
      reviewsOver160Words,
      candidateV1AverageReviewWords: 114.46,
      candidateV1MaximumReviewWords: 161,
      candidateV1ShortcutReviews: 363,
      candidateV1CheckReviews: 366,
      proofSufficiencyAudit: "PASS",
      manualEnglishApproval: "PENDING",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      nextAuthority:
        "SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V2_MANUAL_REVIEW",
    },
    null,
    2,
  ),
);
