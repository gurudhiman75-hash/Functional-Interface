import assert from "node:assert/strict";

import {
  generateSerCp009NumberSeries,
  SER_CP009_NUMBER_SERIES_QL_IDS,
  SER_CP009_QL_AUTHORITIES,
  solveVisibleNumberSeries,
  type SerCp009Locale,
} from "./number-series-final";

assert.equal(SER_CP009_NUMBER_SERIES_QL_IDS.length, 14);
assert.equal(SER_CP009_QL_AUTHORITIES.length, 14);

// Recent SSC fixtures prove that pure number series are a live SER-001 source
// family rather than a banking-only or Number-System concern.
assert.equal(
  solveVisibleNumberSeries("SER-QL-030", "Question\n382, 322, 272, 232, 202, ?"),
  "182",
  "SSC CGL 2022 progressive-difference fixture",
);
assert.equal(
  solveVisibleNumberSeries("SER-QL-030", "Question\n232, 221, 199, ?, 122, 67"),
  "166",
  "SSC CGL 2023 progressive-difference fixture",
);
assert.equal(
  solveVisibleNumberSeries("SER-QL-035", "Question\n1, 3, 10, 41, ?, 1237"),
  "206",
  "SSC CGL 2024 progressive-multiplier fixture",
);

// Source-backed edge families.
assert.equal(
  solveVisibleNumberSeries("SER-QL-039", "Question\n2478, 4728, 7248, 2478, ?"),
  "4728",
);
assert.equal(
  solveVisibleNumberSeries("SER-QL-040", "Question\n0, 7, 28, 63, 124, 215"),
  "28",
);
assert.equal(
  solveVisibleNumberSeries("SER-QL-041", "Question\n3, 5, 35, 10, 12, 35, ?, ?"),
  "17, 19",
  "equal +7 grouped rows are source-backed and must remain legal",
);
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-042",
    "Question\n143, 275, 385, 462, ?",
    ["456", "495", "564", "785"],
  ),
  "495",
);

const locales: readonly SerCp009Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const seedsPerQl = 120;
const report: Record<string, unknown>[] = [];
let independentVisibleProofs = 0;
let localizationProofs = 0;
let lifecycleProofs = 0;
let misconceptionOptionProofs = 0;

for (const qlId of SER_CP009_NUMBER_SERIES_QL_IDS) {
  const answerPositions = [0, 0, 0, 0];
  const visible = new Set<string>();
  const full = new Set<string>();
  const difficulties = new Set<string>();
  const tasks = new Set<string>();

  for (let seed = 0; seed < seedsPerQl; seed += 1) {
    const english = generateSerCp009NumberSeries(qlId, seed, "en-IN");
    const replay = generateSerCp009NumberSeries(qlId, seed, "en-IN");
    assert.deepEqual(replay, english, `${qlId}:${seed}: deterministic replay failed`);

    assert.equal(english.seed, seed, `${qlId}:${seed}: external seed drifted`);
    assert.equal(english.qlId, qlId);
    assert.equal(english.packageId, "SER-001");
    assert.equal(english.checkpointId, "SER-CP-009");
    assert.equal(english.examProfile, "SSC_REASONING");
    assert.equal(english.optionCount, 4);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4, `${qlId}:${seed}: duplicate options`);
    assert.equal(english.options.filter((option) => option.errorLabel === null).length, 1, `${qlId}:${seed}: one correct option required`);
    assert.equal(english.options[english.correctIndex]?.value, english.correctAnswer);
    assert.ok(
      english.options.filter((option) => option.errorLabel !== null).every((option) => Boolean(option.errorLabel)),
      `${qlId}:${seed}: every distractor needs a misconception label`,
    );
    misconceptionOptionProofs += 1;

    const solved = solveVisibleNumberSeries(qlId, english.stem, english.options.map((option) => option.value));
    assert.equal(solved, english.correctAnswer, `${qlId}:${seed}: visible-state solver disagrees`);
    assert.equal(english.options.filter((option) => option.value === solved).length, 1, `${qlId}:${seed}: solver answer not unique in options`);
    independentVisibleProofs += 1;

    const requestedIndex = (seed + Number(qlId.slice(-3))) % 4;
    assert.equal(english.correctIndex, requestedIndex, `${qlId}:${seed}: answer-position control failed`);
    answerPositions[english.correctIndex] += 1;

    assert.equal(english.maturity, "SOURCE_GAP_PROTOTYPE");
    assert.equal(english.reviewOnly, true);
    assert.equal(english.permanentQlId, null);
    assert.equal(english.questionStudioDiscoverable, false);
    assert.equal(english.questionBankWritable, false);
    assert.equal(english.mockTestEligible, false);
    assert.equal(english.publiclyPublishable, false);
    lifecycleProofs += 1;

    assert.ok(english.explanation.length >= 3, `${qlId}:${seed}: explanation too shallow`);
    assert.ok(
      english.explanation.join(" ").includes(english.correctAnswer.split(",")[0]!.trim()),
      `${qlId}:${seed}: explanation must show actual answer values`,
    );
    assert.equal("magnitude" in english.structuralFeatures, false, `${qlId}:${seed}: magnitude cannot be a difficulty feature`);
    assert.equal("termLength" in english.structuralFeatures, false, `${qlId}:${seed}: term length cannot be a difficulty feature`);

    visible.add(english.stem.split("\n").at(-1)!);
    full.add(JSON.stringify({
      stem: english.stem,
      options: english.options,
      answer: english.correctAnswer,
      difficulty: english.difficulty,
    }));
    difficulties.add(english.difficulty);
    tasks.add(english.taskKind);

    for (const locale of locales.slice(1)) {
      const localized = generateSerCp009NumberSeries(qlId, seed, locale);
      assert.equal(localized.seed, seed);
      assert.equal(localized.correctAnswer, english.correctAnswer, `${qlId}:${seed}:${locale}: localization changed answer`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}:${seed}:${locale}: localization changed answer position`);
      assert.equal(localized.difficulty, english.difficulty, `${qlId}:${seed}:${locale}: localization changed difficulty`);
      assert.deepEqual(localized.structuralFeatures, english.structuralFeatures, `${qlId}:${seed}:${locale}: localization changed structure`);
      assert.deepEqual(localized.options, english.options, `${qlId}:${seed}:${locale}: localization changed numeric options`);
      const localizedSolved = solveVisibleNumberSeries(qlId, localized.stem, localized.options.map((option) => option.value));
      assert.equal(localizedSolved, english.correctAnswer, `${qlId}:${seed}:${locale}: localized visible solver disagrees`);
      const combined = `${localized.stem}\n${localized.explanation.join("\n")}`;
      if (locale === "hi-IN") assert.match(combined, /[\u0900-\u097F]/u, `${qlId}:${seed}: Hindi script missing`);
      if (locale === "pa-IN") assert.match(combined, /[\u0A00-\u0A7F]/u, `${qlId}:${seed}: Punjabi script missing`);
      localizationProofs += 1;
    }
  }

  assert.deepEqual(answerPositions, [30, 30, 30, 30], `${qlId}: answer positions are biased`);
  const visibleMinimum = qlId === "SER-QL-042" ? 0.50 : 0.70;
  assert.ok(visible.size / seedsPerQl >= visibleMinimum, `${qlId}: visible diversity ${visible.size}/${seedsPerQl} below ${visibleMinimum}`);
  assert.ok(full.size / seedsPerQl >= 0.85, `${qlId}: full-output diversity ${full.size}/${seedsPerQl} below 0.85`);

  report.push({
    qlId,
    answerPositions,
    difficulties: [...difficulties],
    taskKinds: [...tasks],
    visibleUnique: visible.size,
    fullUnique: full.size,
  });
}

// Difficulty anti-magnitude proof. Do not depend on one brittle seed pair: scan
// a bounded deterministic sample and require a concrete witness in which the
// EASY constant-ratio item contains larger numerals than the HARD progressive-
// multiplier item. This proves numeric size is not monotonic with difficulty.
const numericMax = (stem: string): number => Math.max(...(stem.match(/\d+/g) ?? ["0"]).map(Number));
const easyCandidates = Array.from({ length: 64 }, (_, seed) => {
  const item = generateSerCp009NumberSeries("SER-QL-032", seed);
  assert.equal(item.difficulty, "EASY");
  return { seed, max: numericMax(item.stem) };
});
const hardCandidates = Array.from({ length: 64 }, (_, seed) => {
  const item = generateSerCp009NumberSeries("SER-QL-035", seed);
  assert.equal(item.difficulty, "HARD");
  return { seed, max: numericMax(item.stem) };
});
const largestEasy = easyCandidates.reduce((best, candidate) => candidate.max > best.max ? candidate : best);
const smallestHard = hardCandidates.reduce((best, candidate) => candidate.max < best.max ? candidate : best);
assert.ok(
  largestEasy.max > smallestHard.max,
  `anti-magnitude witness missing: largest EASY max=${largestEasy.max}, smallest HARD max=${smallestHard.max}`,
);

console.log("SER-CP-009 hardened pure-number-series audit passed.", {
  qlCount: SER_CP009_NUMBER_SERIES_QL_IDS.length,
  seedsPerQl,
  independentVisibleProofs,
  localizationProofs,
  lifecycleProofs,
  misconceptionOptionProofs,
  antiMagnitudeWitness: { largestEasy, smallestHard },
  report,
});
