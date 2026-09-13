import assert from "node:assert/strict";

import {
  generateSerCp009NumberSeries,
  SER_CP009_NUMBER_SERIES_QL_IDS,
  SER_CP009_QL_AUTHORITIES,
  solveVisibleNumberSeries,
  type SerCp009Locale,
} from "./number-series";

assert.equal(SER_CP009_NUMBER_SERIES_QL_IDS.length, 14);
assert.equal(SER_CP009_QL_AUTHORITIES.length, 14);
assert.deepEqual(SER_CP009_NUMBER_SERIES_QL_IDS, [
  "SER-QL-029", "SER-QL-030", "SER-QL-031", "SER-QL-032",
  "SER-QL-033", "SER-QL-034", "SER-QL-035", "SER-QL-036",
  "SER-QL-037", "SER-QL-038", "SER-QL-039", "SER-QL-040",
  "SER-QL-041", "SER-QL-042",
]);

// Direct recent SSC source fixtures. These are intentionally solved from only
// the learner-visible question, not from generator state.
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-030",
    "Which number will replace the question mark in the following series?\n382, 322, 272, 232, 202, ?",
  ),
  "182",
  "SSC CGL 2022 progressive-difference fixture",
);
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-030",
    "Which number will replace the question mark in the following series?\n232, 221, 199, ?, 122, 67",
  ),
  "166",
  "SSC CGL 2023 progressive-difference fixture",
);
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-035",
    "Which number will replace the question mark in the following series?\n1, 3, 10, 41, ?, 1237",
  ),
  "206",
  "SSC CGL 2024 progressive-multiplier fixture",
);

// Additional exact source-style fixtures prove the less common authorities.
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-039",
    "Which number will replace the question mark in the following series?\n2478, 4728, 7248, 2478, ?",
  ),
  "4728",
  "digit-block rotation source fixture",
);
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-040",
    "Which number is wrong in the following series?\n0, 7, 28, 63, 124, 215",
  ),
  "28",
  "wrong-term cube-minus-one source fixture",
);
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-041",
    "Which set of numbers will replace the blanks in the series?\n3, 5, 35, 10, 12, 35, ?, ?",
  ),
  "17, 19",
  "grouped multi-missing SSC source fixture",
);
assert.equal(
  solveVisibleNumberSeries(
    "SER-QL-042",
    "Which number will replace the question mark and follow the same relation?\n143, 275, 385, 462, ?",
    ["456", "495", "564", "785"],
  ),
  "495",
  "within-number relation source fixture",
);

const locales: readonly SerCp009Locale[] = ["en-IN", "hi-IN", "pa-IN"];
const seedsPerQl = 120;
const report: Record<string, unknown>[] = [];
let generatedPayloads = 0;
let independentSolverProofs = 0;
let localizedScriptProofs = 0;
let lifecycleSafetyProofs = 0;
let misconceptionDistractorProofs = 0;

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
    assert.equal(english.seed, seed, `${qlId}:${seed}: payload seed drifted`);
    assert.equal(english.qlId, qlId);
    assert.equal(english.packageId, "SER-001");
    assert.equal(english.checkpointId, "SER-CP-009");
    assert.equal(english.examProfile, "SSC_REASONING");
    assert.equal(english.optionCount, 4);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4, `${qlId}:${seed}: duplicate options`);
    assert.equal(english.options.filter((option) => option.errorLabel === null).length, 1, `${qlId}:${seed}: must have one correct semantic option`);
    assert.equal(english.options[english.correctIndex]?.value, english.correctAnswer);
    assert.ok(english.options.filter((option) => option.errorLabel !== null).every((option) => Boolean(option.errorLabel)), `${qlId}:${seed}: distractors need misconception labels`);
    misconceptionDistractorProofs += 1;

    const visibleSolved = solveVisibleNumberSeries(
      qlId,
      english.stem,
      english.options.map((option) => option.value),
    );
    assert.equal(visibleSolved, english.correctAnswer, `${qlId}:${seed}: visible-state solver disagrees`);
    assert.equal(english.options.filter((option) => option.value === visibleSolved).length, 1, `${qlId}:${seed}: solver answer is not unique in options`);
    independentSolverProofs += 1;

    assert.equal(english.correctIndex, (seed + Number(qlId.slice(-3))) % 4, `${qlId}:${seed}: requested answer position not honored`);
    answerPositions[english.correctIndex] += 1;
    visible.add(english.stem.split("\n").at(-1)!);
    full.add(JSON.stringify({ stem: english.stem, options: english.options, answer: english.correctAnswer, difficulty: english.difficulty }));
    difficulties.add(english.difficulty);
    tasks.add(english.taskKind);

    assert.equal(english.maturity, "SOURCE_GAP_PROTOTYPE");
    assert.equal(english.reviewOnly, true);
    assert.equal(english.permanentQlId, null);
    assert.equal(english.questionStudioDiscoverable, false);
    assert.equal(english.questionBankWritable, false);
    assert.equal(english.mockTestEligible, false);
    assert.equal(english.publiclyPublishable, false);
    lifecycleSafetyProofs += 1;

    assert.ok(english.explanation.length >= 3, `${qlId}:${seed}: explanation is too shallow`);
    assert.ok(english.explanation.join(" ").includes(english.correctAnswer.split(",")[0]!.trim()), `${qlId}:${seed}: explanation must expose actual answer values`);
    assert.equal("magnitude" in english.structuralFeatures, false, `${qlId}:${seed}: magnitude must not be a difficulty feature`);
    assert.equal("termLength" in english.structuralFeatures, false, `${qlId}:${seed}: term length must not be a difficulty feature`);

    for (const locale of locales.slice(1)) {
      const localized = generateSerCp009NumberSeries(qlId, seed, locale);
      assert.equal(localized.correctAnswer, english.correctAnswer, `${qlId}:${seed}:${locale}: localization changed answer`);
      assert.equal(localized.correctIndex, english.correctIndex, `${qlId}:${seed}:${locale}: localization changed answer position`);
      assert.equal(localized.difficulty, english.difficulty, `${qlId}:${seed}:${locale}: localization changed difficulty`);
      assert.deepEqual(localized.structuralFeatures, english.structuralFeatures, `${qlId}:${seed}:${locale}: localization changed structure`);
      assert.deepEqual(localized.options, english.options, `${qlId}:${seed}:${locale}: localization changed numeric options`);
      const combined = `${localized.stem}\n${localized.explanation.join("\n")}`;
      if (locale === "hi-IN") assert.match(combined, /[\u0900-\u097F]/u, `${qlId}:${seed}: Hindi script missing`);
      if (locale === "pa-IN") assert.match(combined, /[\u0A00-\u0A7F]/u, `${qlId}:${seed}: Punjabi script missing`);
      const localizedSolved = solveVisibleNumberSeries(qlId, localized.stem, localized.options.map((option) => option.value));
      assert.equal(localizedSolved, english.correctAnswer, `${qlId}:${seed}:${locale}: localized visible solver disagrees`);
      localizedScriptProofs += 1;
      generatedPayloads += 1;
    }
    generatedPayloads += 1;
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

// Difficulty anti-magnitude proof: the structurally hard progressive-multiplier
// item can be numerically smaller than an easy fixed-ratio item. The labels must
// remain driven by the stored reasoning features, not by the largest numeral.
const hardSample = generateSerCp009NumberSeries("SER-QL-035", 3, "en-IN");
const easyRatioSample = generateSerCp009NumberSeries("SER-QL-032", 3, "en-IN");
assert.equal(hardSample.difficulty, "HARD");
assert.equal(easyRatioSample.difficulty, "EASY");
const numericMax = (stem: string) => Math.max(...(stem.match(/\d+/g) ?? ["0"]).map(Number));
assert.ok(
  numericMax(easyRatioSample.stem) > numericMax(hardSample.stem),
  "anti-magnitude fixture must prove a larger-number EASY item than HARD item",
);

// Source-family ownership safety: this checkpoint is SSC Reasoning only and
// must not silently become the separate Banking Number Series product runtime.
for (const qlId of SER_CP009_NUMBER_SERIES_QL_IDS) {
  const q = generateSerCp009NumberSeries(qlId, 77);
  assert.equal(q.examProfile, "SSC_REASONING");
  assert.equal(q.optionCount, 4);
  assert.equal(q.questionStudioDiscoverable, false);
}

console.log("SER-CP-009 pure number-series source and stress audit passed.", {
  qlCount: SER_CP009_NUMBER_SERIES_QL_IDS.length,
  seedsPerQl,
  generatedPayloads,
  independentSolverProofs,
  localizedScriptProofs,
  lifecycleSafetyProofs,
  misconceptionDistractorProofs,
  report,
});
