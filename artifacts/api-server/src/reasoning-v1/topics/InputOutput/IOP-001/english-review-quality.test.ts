import assert from "node:assert/strict";
import { generateIopEnglishReviewCaselet } from "./english-review-generator.ts";
import {
  IOP_RICH_OBJECT_POOL_STATS,
  IOP_RICH_GENERAL_WORD_POOL,
  IOP_RICH_TEXT_VOWEL_BUCKETS,
} from "./english-rich-sources.ts";
import { IOP_ENGLISH_SOURCE_MODES } from "./english-production.ts";

assert.ok(IOP_RICH_OBJECT_POOL_STATS.generalWordCount >= 180, "General IOP word pool must contain at least 180 words");
assert.ok(IOP_RICH_OBJECT_POOL_STATS.generalNumberCount >= 80, "General IOP number pool must contain at least 80 numbers");
assert.equal(IOP_RICH_OBJECT_POOL_STATS.lengthBucketCount, 8, "Word-length authority must cover lengths 3 through 10");
assert.ok(IOP_RICH_OBJECT_POOL_STATS.minWordsPerLengthBucket >= 20, "Every word-length bucket must contain at least 20 alternatives");
assert.equal(IOP_RICH_OBJECT_POOL_STATS.textVowelBucketCount, 5, "RBI text authority must cover five distinct vowel-count buckets");
assert.ok(IOP_RICH_OBJECT_POOL_STATS.minWordsPerTextVowelBucket >= 20, "Every RBI text vowel-count bucket must contain at least 20 words");
assert.ok(IOP_RICH_OBJECT_POOL_STATS.mixedNumberCandidateCount >= 800, "Mixed RBI number authority must contain at least 800 three-digit candidates");
assert.ok(IOP_RICH_OBJECT_POOL_STATS.numericOddCandidateCount >= 40, "Numeric parity authority needs at least 40 odd candidates");
assert.ok(IOP_RICH_OBJECT_POOL_STATS.numericEvenCandidateCount >= 40, "Numeric parity authority needs at least 40 even candidates");
assert.equal(new Set(IOP_RICH_GENERAL_WORD_POOL).size, IOP_RICH_GENERAL_WORD_POOL.length, "General IOP word pool contains duplicates");

for (const [countText, bucket] of Object.entries(IOP_RICH_TEXT_VOWEL_BUCKETS)) {
  const expected = Number(countText);
  for (const word of bucket) {
    const actual = [...word.toLowerCase()].filter((letter) => "aeiou".includes(letter)).length;
    assert.equal(actual, expected, `Text word ${word} is in vowel bucket ${expected} but has ${actual} vowels`);
  }
}

const targetFingerprintsByMode = new Map<string, Set<string>>();
const seenAlphabeticObjects = new Set<string>();
const seenNumericObjects = new Set<string>();
let explanationCount = 0;
let minimumExplanationLength = Number.POSITIVE_INFINITY;
let maximumSingleObjectFrequency = 0;
const objectFrequency = new Map<string, number>();

for (const mode of IOP_ENGLISH_SOURCE_MODES) {
  for (let sample = 0; sample < 4; sample += 1) {
    const caselet = generateIopEnglishReviewCaselet(
      `IOP-RICH-QUALITY-${mode.sourceModeId}-${sample}`,
      mode.qlId,
      mode.sourceModeId,
    );
    const targetFingerprint = caselet.target.input.join("|");
    const modeFingerprints = targetFingerprintsByMode.get(mode.sourceModeId) ?? new Set<string>();
    modeFingerprints.add(targetFingerprint);
    targetFingerprintsByMode.set(mode.sourceModeId, modeFingerprints);

    for (const value of [...caselet.demonstration.input, ...caselet.target.input]) {
      if (/^[a-z]+$/i.test(value)) seenAlphabeticObjects.add(value.toLowerCase());
      if (/^\d+$/.test(value)) seenNumericObjects.add(value);
      const next = (objectFrequency.get(value) ?? 0) + 1;
      objectFrequency.set(value, next);
      maximumSingleObjectFrequency = Math.max(maximumSingleObjectFrequency, next);
    }

    for (const child of caselet.children) {
      explanationCount += 1;
      minimumExplanationLength = Math.min(minimumExplanationLength, child.explanation.length);
      assert.ok(child.explanation.includes(child.answerDisplay), `${mode.sourceModeId}/${child.kind} explanation omits exact answer`);
      assert.ok(child.explanation.length >= (child.kind === "REMAINING_STEP_COUNT" ? 140 : 220), `${mode.sourceModeId}/${child.kind} explanation is too thin`);
    }
  }
}

for (const [modeId, fingerprints] of targetFingerprintsByMode) {
  assert.equal(fingerprints.size, 4, `${modeId} repeated a target input across four diversity samples`);
}

assert.ok(seenAlphabeticObjects.size >= 90, `Rich review samples exposed only ${seenAlphabeticObjects.size} distinct alphabetic objects`);
assert.ok(seenNumericObjects.size >= 70, `Rich review samples exposed only ${seenNumericObjects.size} distinct numeric objects`);
assert.ok(maximumSingleObjectFrequency <= 18, `One review object repeated ${maximumSingleObjectFrequency} times across the diversity sample`);

console.log("PASS_IOP_001_ENGLISH_REVIEW_QUALITY");
console.log(`general word pool ${IOP_RICH_OBJECT_POOL_STATS.generalWordCount}`);
console.log(`general number pool ${IOP_RICH_OBJECT_POOL_STATS.generalNumberCount}`);
console.log(`minimum words per length bucket ${IOP_RICH_OBJECT_POOL_STATS.minWordsPerLengthBucket}`);
console.log(`minimum words per vowel bucket ${IOP_RICH_OBJECT_POOL_STATS.minWordsPerTextVowelBucket}`);
console.log(`mixed number candidates ${IOP_RICH_OBJECT_POOL_STATS.mixedNumberCandidateCount}`);
console.log(`sample alphabetic objects ${seenAlphabeticObjects.size}`);
console.log(`sample numeric objects ${seenNumericObjects.size}`);
console.log(`maximum sampled object frequency ${maximumSingleObjectFrequency}`);
console.log(`explanations audited ${explanationCount}`);
console.log(`minimum explanation length ${minimumExplanationLength}`);
