import assert from "node:assert/strict";
import {
  independentlyContinueAlphanumericInterleaved,
  independentlyContinueAlphanumericParallel,
  independentlyContinueClusterNumber,
  independentlyContinueInterleavedLetterRows,
  independentlyContinueSingleLetterProgression,
} from "./independent-solver";
import {
  SER_CP008_PROVISIONAL_QL_IDS,
  SER_CP008_QL_AUTHORITIES,
} from "./question-language";
import { generateSerCp008Final } from "./runtime-final";
import { independentlySolveVisibleSerCp008 } from "./visible-series-verifier";

assert.deepEqual(SER_CP008_PROVISIONAL_QL_IDS, [
  "SER-QL-014",
  "SER-QL-015",
  "SER-QL-016",
  "SER-QL-017",
  "SER-QL-018",
]);
assert.equal(SER_CP008_QL_AUTHORITIES.length, 5);
assert.equal(new Set(SER_CP008_QL_AUTHORITIES.map((entry) => entry.authorityId)).size, 5);
assert.ok(SER_CP008_QL_AUTHORITIES.every((entry) => entry.sourceEvidence.length > 0));

assert.equal(
  independentlyContinueSingleLetterProgression({
    start: "B",
    firstJump: 2,
    jumpIncrement: 1,
    transitionCount: 4,
  }),
  "P",
);
assert.deepEqual(
  independentlyContinueInterleavedLetterRows({
    rowStarts: ["B", "C", "O"],
    rowJumps: [2, 2, 1],
    completedCycles: 3,
  }),
  ["H", "I", "R"],
);
assert.deepEqual(
  independentlyContinueAlphanumericParallel({
    letter: "E",
    number: 5,
    letterJump: 2,
    numberJump: 2,
    transitions: 4,
  }),
  { letter: "M", number: 13 },
);
assert.deepEqual(
  independentlyContinueAlphanumericParallel({
    letter: "I",
    number: 2,
    letterJump: 3,
    numberJump: 7,
    transitions: 3,
  }),
  { letter: "R", number: 23 },
);
assert.deepEqual(
  independentlyContinueAlphanumericInterleaved({
    targetRowStartLetter: "Z",
    targetRowStartNumber: 2,
    targetRowLetterJump: -1,
    targetRowNumberJump: 2,
    completedTargetRowTransitions: 2,
  }),
  { letter: "X", number: 6 },
);
assert.deepEqual(
  independentlyContinueClusterNumber({
    letters: ["U", "E"],
    number: 88,
    letterJumps: [1, 2],
    numberJump: -4,
    transitions: 4,
  }),
  { letters: ["Y", "M"], number: 72 },
);

assert.equal(
  independentlySolveVisibleSerCp008("SER-QL-014", "Find the next letter.\nB, D, G, K, ?"),
  "P",
);
assert.equal(
  independentlySolveVisibleSerCp008("SER-QL-015", "Find the next three letters.\nB, C, O, D, E, P, F, G, Q, ?, ?, ?"),
  "H, I, R",
);
assert.equal(
  independentlySolveVisibleSerCp008("SER-QL-016", "Find the next term.\nE-5, G-7, I-9, K-11, ?"),
  "M-13",
);
assert.equal(
  independentlySolveVisibleSerCp008("SER-QL-017", "Find the next term.\n22P, 2Z, 24Q, 4Y, 26R, ?"),
  "6X",
);
assert.equal(
  independentlySolveVisibleSerCp008("SER-QL-018", "Find the next term.\nUE88, VG84, WI80, XK76, ?"),
  "YM72",
);

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const seedsPerQl = 240;
const report: Record<string, unknown>[] = [];

for (const qlId of SER_CP008_PROVISIONAL_QL_IDS) {
  const answerPositions = [0, 0, 0, 0];
  const seenDifficulties = new Set<string>();
  const visibleFingerprints = new Set<string>();
  const fullFingerprints = new Set<string>();

  for (let seed = 0; seed < seedsPerQl; seed += 1) {
    const english = generateSerCp008Final(qlId, seed, "en-IN");
    const replay = generateSerCp008Final(qlId, seed, "en-IN");
    assert.deepEqual(replay, english, `${qlId}:${seed} is not deterministic.`);
    assert.equal(english.seed, seed, `${qlId}:${seed} did not preserve the requested seed.`);
    assert.equal(english.qlId, qlId);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4);
    assert.equal(english.options.filter((option) => option.errorLabel === null).length, 1);
    assert.ok(english.options.filter((option) => option.errorLabel !== null).every((option) => Boolean(option.errorLabel)));
    assert.equal(english.options[english.correctIndex]!.value, english.correctAnswer);
    assert.equal(english.options[english.correctIndex]!.errorLabel, null);

    const independentAnswer = independentlySolveVisibleSerCp008(qlId, english.stem);
    assert.equal(independentAnswer, english.correctAnswer, `${qlId}:${seed} disagrees with the visible-state verifier.`);
    assert.equal(
      english.options.filter((option) => option.value === independentAnswer).length,
      1,
      `${qlId}:${seed} must expose exactly one independently valid answer.`,
    );

    const requestedIndex = ((seed + Number(qlId.slice(-3))) % 4 + 4) % 4;
    assert.equal(english.correctIndex, requestedIndex);
    answerPositions[english.correctIndex] += 1;
    seenDifficulties.add(english.difficulty);
    visibleFingerprints.add(english.stem.split("\n").at(-1)!);
    fullFingerprints.add(JSON.stringify({
      stem: english.stem,
      options: english.options,
      answer: english.correctAnswer,
      difficulty: english.difficulty,
    }));

    for (const locale of locales.slice(1)) {
      const localized = generateSerCp008Final(qlId, seed, locale);
      assert.equal(localized.correctAnswer, english.correctAnswer);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.difficulty, english.difficulty);
      assert.deepEqual(localized.structuralFeatures, english.structuralFeatures);
      assert.deepEqual(
        localized.options.map((option) => [option.value, option.errorLabel]),
        english.options.map((option) => [option.value, option.errorLabel]),
      );
      assert.ok(localized.stem.length > 15);
      assert.ok(localized.explanation.length >= 3);
      if (locale === "pa-IN") {
        assert.ok(!localized.explanation.some((line) => line.includes("ਟਾਂਕ")), `${qlId}:${seed} uses non-standard Punjabi odd/even wording.`);
      }
    }
  }

  assert.deepEqual(answerPositions, [60, 60, 60, 60], `${qlId} answer positions are not balanced.`);
  assert.ok(
    visibleFingerprints.size / seedsPerQl >= 0.65,
    `${qlId} visible-series diversity is too low: ${visibleFingerprints.size}/${seedsPerQl}.`,
  );
  assert.ok(
    fullFingerprints.size / seedsPerQl >= 0.90,
    `${qlId} full-output diversity is too low: ${fullFingerprints.size}/${seedsPerQl}.`,
  );

  report.push({
    qlId,
    generatedPerLocale: seedsPerQl,
    answerPositions,
    difficulties: [...seenDifficulties],
    visibleSeriesUnique: visibleFingerprints.size,
    fullOutputUnique: fullFingerprints.size,
  });
}

const ql014Difficulties = new Set(
  Array.from({ length: seedsPerQl }, (_, seed) => generateSerCp008Final("SER-QL-014", seed, "en-IN").difficulty),
);
assert.ok(ql014Difficulties.has("MEDIUM"));
assert.ok(ql014Difficulties.has("HARD"));
const ql016Difficulties = new Set(
  Array.from({ length: seedsPerQl }, (_, seed) => generateSerCp008Final("SER-QL-016", seed, "en-IN").difficulty),
);
assert.ok(ql016Difficulties.has("MEDIUM"));
assert.ok(ql016Difficulties.has("HARD"));
for (const qlId of ["SER-QL-015", "SER-QL-017", "SER-QL-018"] as const) {
  assert.equal(generateSerCp008Final(qlId, 17, "en-IN").difficulty, "HARD");
}

console.log("SER-CP-008 source-gap and stress audit passed.", report);
