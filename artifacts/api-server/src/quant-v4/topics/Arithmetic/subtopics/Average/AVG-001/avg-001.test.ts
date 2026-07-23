import { strict as assert } from "node:assert";
import {
  getAvg001QuestionEntries,
  getAvg001QuestionLanguageIds,
} from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries();
const cp001 = entries.filter((entry) => entry.cpId === "AVG-CP-001");
const cp002 = entries.filter((entry) => entry.cpId === "AVG-CP-002");
const cp003 = entries.filter((entry) => entry.cpId === "AVG-CP-003");
const cp004 = entries.filter((entry) => entry.cpId === "AVG-CP-004");
const cp005 = entries.filter((entry) => entry.cpId === "AVG-CP-005");

const expectedCpCounts = {
  "AVG-CP-001": 72,
  "AVG-CP-002": 50,
  "AVG-CP-003": 86,
  "AVG-CP-004": 65,
  "AVG-CP-005": 56,
} as const;
const expectedTotal = Object.values(expectedCpCounts).reduce(
  (sum, count) => sum + count,
  0,
);

assert.equal(entries.length, expectedTotal);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, expectedTotal);
assert.equal(cp001.length, expectedCpCounts["AVG-CP-001"]);
assert.equal(cp002.length, expectedCpCounts["AVG-CP-002"]);
assert.equal(cp003.length, expectedCpCounts["AVG-CP-003"]);
assert.equal(cp004.length, expectedCpCounts["AVG-CP-004"]);
assert.equal(cp005.length, expectedCpCounts["AVG-CP-005"]);
assert.deepEqual(
  cp001.map((entry) => entry.qlId),
  Array.from({ length: 72 }, (_, index) =>
    `AVG-QL-${String(index + 1).padStart(3, "0")}`,
  ),
);
assert.deepEqual(
  cp003.map((entry) => entry.qlId),
  Array.from({ length: 86 }, (_, index) =>
    `AVG-QL-${String(index + 123).padStart(3, "0")}`,
  ),
);
assert.deepEqual(
  cp004.map((entry) => entry.qlId),
  Array.from({ length: 65 }, (_, index) =>
    `AVG-QL-${String(index + 209).padStart(3, "0")}`,
  ),
);
assert.deepEqual(
  cp005.map((entry) => entry.qlId),
  Array.from({ length: 56 }, (_, index) =>
    `AVG-QL-${String(index + 274).padStart(3, "0")}`,
  ),
);

const expectedCp001ModeCounts: Record<string, number> = {
  findSumFromAverageAndCount: 18,
  findAverageFromSumAndCount: 18,
  findCountFromSumAndAverage: 18,
  findMissingValueFromAverage: 18,
};
for (const [mode, expectedCount] of Object.entries(expectedCp001ModeCounts)) {
  assert.equal(
    cp001.filter((entry) => entry.solveMode === mode).length,
    expectedCount,
    `${mode} CP-001 allocation`,
  );
}

const expectedCp003ModeCounts: Record<string, number> = {
  findNewAverageAfterAddition: 13,
  findNewAverageAfterRemoval: 12,
  findNewAverageAfterReplacement: 13,
  findAddedMemberValueFromShift: 13,
  findRemovedMemberValueFromShift: 12,
  findReplacementValueFromShift: 11,
  findInningsValueOrNewCricketAverage: 12,
};
for (const [mode, expectedCount] of Object.entries(expectedCp003ModeCounts)) {
  assert.equal(
    cp003.filter((entry) => entry.solveMode === mode).length,
    expectedCount,
    `${mode} allocation`,
  );
}
assert.equal(
  cp003.filter((entry) => entry.scenarioVariant.toLowerCase().includes("years"))
    .length >= 6,
  true,
);
assert.equal(
  cp003.filter((entry) => entry.contextDomain === "Sports").length >= 8,
  true,
);

const expectedCp004ModeCounts: Record<string, number> = {
  findCombinedAverageOfTwoGroups: 16,
  findCombinedAverageOfThreeOrFourGroups: 12,
  findGroupCountFromCombinedAverage: 11,
  findMissingGroupAverage: 11,
  findAverageSpeedEqualDistance: 8,
  findAverageSpeedEqualTime: 7,
};
for (const [mode, expectedCount] of Object.entries(expectedCp004ModeCounts)) {
  assert.equal(
    cp004.filter((entry) => entry.solveMode === mode).length,
    expectedCount,
    `${mode} CP-004 allocation`,
  );
}

const expectedCp005ModeCounts: Record<string, number> = {
  findCorrectedAverageFromMistake: 10,
  findReportedAverageBeforeCorrection: 6,
  findCorrectValueFromAverageShift: 9,
  findIncorrectValueFromCorrection: 9,
  findEntryDifferenceFromAverageCorrection: 6,
  findAverageChangeFromEntryCorrection: 5,
  findNumberOfItemsFromTotalCorrection: 6,
  findCorrectedAverageFromMultipleMistakes: 5,
};
for (const [mode, expectedCount] of Object.entries(expectedCp005ModeCounts)) {
  assert.equal(
    cp005.filter((entry) => entry.solveMode === mode).length,
    expectedCount,
    `${mode} CP-005 allocation`,
  );
}

let generated = 0;
for (const questionLanguageId of getAvg001QuestionLanguageIds()) {
  for (let index = 0; index < 12; index += 1) {
    const seed = `avg-proof:${questionLanguageId}:${index}`;
    const first = runAvg001Pipeline({ questionLanguageId, seed });
    const second = runAvg001Pipeline({ questionLanguageId, seed });
    assert.equal(first.validation.valid, true);
    assert.equal(first.stem, second.stem);
    assert.deepEqual(first.parameters, second.parameters);
    assert.deepEqual(first.options, second.options);
    assert.equal(first.answer, second.answer);
    assert.deepEqual(first.explanation, second.explanation);
    assert.equal(first.mathematicalFingerprint, second.mathematicalFingerprint);
    generated += 1;
  }
}

for (const qlId of ["AVG-QL-001", "AVG-QL-073", "AVG-QL-123", "AVG-QL-209", "AVG-QL-274"]) {
  for (const language of ["hi", "pa"] as const) {
    assert.throws(
      () => runAvg001Pipeline({ questionLanguageId: qlId, seed: "unsupported", language }),
      /English only/,
    );
  }
}

console.log(
  JSON.stringify(
    {
      qlCount: entries.length,
      cp001QlCount: cp001.length,
      cp002QlCount: cp002.length,
      cp003QlCount: cp003.length,
      cp004QlCount: cp004.length,
      cp005QlCount: cp005.length,
      seedsPerQl: 12,
      generated,
      status: "PASS",
    },
    null,
    2,
  ),
);