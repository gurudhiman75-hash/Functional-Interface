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
assert.equal(new Set(probes.map((probe) => probe.temporaryTemplateId)).size, 140);

const OLD_HEADINGS = [
  "📌 **Rule**",
  "📝 **Solution**",
  "⚡ **Quick Method**",
  "⚠️ **Common Mistake**",
] as const;
const VISIBLE_TRAP_CODE = /\[[A-Z][A-Z0-9_]*\]/;
const INTERNAL_REVIEW_WORDING = /editorial task|proof model|trap code|canonical authority|temporary template/i;

function increment<K>(map: Map<K, number>, key: K): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function wordCount(value: string): number {
  return value
    .replace(/[`*_#✓]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

const taskCounts = new Map<SerCp007EditorialTaskKind, number>();
const proofModelCounts = new Map<SerCp007ProofModel, number>();
const openingLines = new Set<string>();
const reviewWordCounts: number[] = [];
let sampledReviews = 0;
let normalizedReplacementReviews = 0;
let shortcutReviews = 0;
let checkReviews = 0;
let reviewsOver180Words = 0;
let reviewsUnder45Words = 0;
let oldHeadingReviews = 0;
let visibleTrapCodeReviews = 0;
let internalMetadataReviews = 0;

for (const probe of probes) {
  for (const seed of [1, 2, 3]) {
    const question = probe.generate(seed);
    const candidate = buildAdaptiveSerCp007Review(question);
    const replay = buildAdaptiveSerCp007Review(probe.generate(seed));

    assert.deepEqual(candidate, replay);
    assert.equal(question.temporaryTemplateId, probe.temporaryTemplateId);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4);
    assert.equal(question.options[question.correctIndex], question.correctAnswer);

    assert.ok(candidate.review.includes(candidate.stem));
    assert.ok(candidate.review.includes("### Explanation"));
    assert.ok(
      candidate.review.includes(
        `**Answer:** ${question.correctIndex + 1}. ${question.correctAnswer}`,
      ),
    );
    question.options.forEach((option, index) => {
      const marker = index === question.correctIndex ? "✓" : " ";
      assert.ok(candidate.review.includes(`${marker} ${index + 1}. ${option}`));
    });

    const containsOldHeading = OLD_HEADINGS.some((heading) =>
      candidate.review.includes(heading),
    );
    if (containsOldHeading) oldHeadingReviews += 1;
    if (VISIBLE_TRAP_CODE.test(candidate.review)) visibleTrapCodeReviews += 1;
    if (INTERNAL_REVIEW_WORDING.test(candidate.review)) internalMetadataReviews += 1;

    assert.doesNotMatch(candidate.review, /^[✓ ] [A-D]\. /m);
    assert.doesNotMatch(candidate.review, /\bOption [A-D]\b/);
    assert.doesNotMatch(candidate.review, /SER-CP-007-(?:TMP|WB-TMP|WC-TMP|WD-TMP|WE-TMP)-/);

    if (question.taskKind === "WRONG_TERM") {
      assert.equal(candidate.editorialTaskKind, "REPLACE_WRONG_TERM");
      assert.doesNotMatch(candidate.stem, /identify the incorrect group/i);
      assert.match(candidate.stem, /replace|written in its place/i);
      normalizedReplacementReviews += 1;
    }
    assert.notEqual(candidate.editorialTaskKind as string, "WRONG_TERM");

    if (candidate.renderedShortcut) {
      assert.ok(candidate.review.includes("**Shortcut:**"));
      shortcutReviews += 1;
    } else {
      assert.doesNotMatch(candidate.review, /\*\*Shortcut:\*\*/);
    }
    if (candidate.renderedCheck) {
      assert.ok(candidate.review.includes("**Check:**"));
      checkReviews += 1;
    } else {
      assert.doesNotMatch(candidate.review, /\*\*Check:\*\*/);
    }

    const words = wordCount(candidate.review);
    reviewWordCounts.push(words);
    if (words > 180) reviewsOver180Words += 1;
    if (words < 45) reviewsUnder45Words += 1;

    openingLines.add(candidate.stem.split("\n")[0]!);
    increment(taskCounts, candidate.editorialTaskKind);
    increment(proofModelCounts, candidate.proofModel);
    sampledReviews += 1;
  }
}

assert.equal(sampledReviews, 420);
assert.equal(normalizedReplacementReviews, 99);
assert.equal(oldHeadingReviews, 0);
assert.equal(visibleTrapCodeReviews, 0);
assert.equal(internalMetadataReviews, 0);
assert.equal(proofModelCounts.size, 6);
assert.ok(openingLines.size > 10);
assert.ok(shortcutReviews > 0 && shortcutReviews < sampledReviews);
assert.ok(checkReviews > 0 && checkReviews < sampledReviews);

const averageReviewWords =
  reviewWordCounts.reduce((sum, count) => sum + count, 0) / reviewWordCounts.length;

assert.ok(averageReviewWords < 152.22);
assert.ok(Math.max(...reviewWordCounts) < 226);
assert.ok(reviewsOver180Words < 113);
assert.ok(Math.min(...reviewWordCounts) >= 35);

assert.deepEqual(
  Object.fromEntries([...taskCounts.entries()].sort()),
  {
    FILL_GAPS: 6,
    FILL_GAP_GROUPS: 6,
    MISSING_TERM: 99,
    MISSING_TWO_TERMS: 3,
    NEXT_TERM: 99,
    NEXT_TWO_TERMS: 18,
    PREVIOUS_TERM: 87,
    REPLACE_WRONG_TERM: 99,
    WRONG_AND_REPLACEMENT: 3,
  },
);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V1",
      temporaryTemplates: probes.length,
      sampledSeedsPerTemplate: 3,
      sampledReviews,
      proofModels: Object.fromEntries([...proofModelCounts.entries()].sort()),
      editorialTaskCounts: Object.fromEntries([...taskCounts.entries()].sort()),
      normalizedReplacementReviews,
      distinctOpeningLines: openingLines.size,
      shortcutReviews,
      checkReviews,
      oldHeadingReviews,
      visibleTrapCodeReviews,
      internalMetadataReviews,
      averageReviewWords: Number(averageReviewWords.toFixed(2)),
      minimumReviewWords: Math.min(...reviewWordCounts),
      maximumReviewWords: Math.max(...reviewWordCounts),
      reviewsOver180Words,
      reviewsUnder45Words,
      baselineAverageReviewWords: 152.22,
      baselineMaximumReviewWords: 226,
      baselineReviewsOver180Words: 113,
      baselineOpeningLines: 10,
      englishRemodelCandidate: "V1_EXECUTABLE",
      manualEnglishApproval: "PENDING",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      nextAuthority: "SER_CP007_ADAPTIVE_ENGLISH_CANDIDATE_V1_MANUAL_REVIEW",
    },
    null,
    2,
  ),
);
