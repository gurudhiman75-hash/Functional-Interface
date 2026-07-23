import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries, getAvg001QuestionLanguageIds } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries();
const byCp = (cpId: string) => entries.filter((entry) => entry.cpId === cpId);
const expectedCpCounts = {
  "AVG-CP-001": 72,
  "AVG-CP-002": 50,
  "AVG-CP-003": 86,
  "AVG-CP-004": 65,
  "AVG-CP-005": 56,
  "AVG-CP-006": 44,
} as const;
const expectedTotal = Object.values(expectedCpCounts).reduce((sum, count) => sum + count, 0);

assert.equal(entries.length, 373);
assert.equal(entries.length, expectedTotal);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, expectedTotal);
for (const [cpId, count] of Object.entries(expectedCpCounts)) assert.equal(byCp(cpId).length, count, cpId);

const ranges: Array<[string, number, number]> = [
  ["AVG-CP-001", 1, 72],
  ["AVG-CP-002", 73, 122],
  ["AVG-CP-003", 123, 208],
  ["AVG-CP-004", 209, 273],
  ["AVG-CP-005", 274, 329],
  ["AVG-CP-006", 330, 373],
];
for (const [cpId, start, end] of ranges) {
  assert.deepEqual(byCp(cpId).map((entry) => entry.qlId), Array.from({ length: end - start + 1 }, (_, index) => `AVG-QL-${String(start + index).padStart(3, "0")}`));
}

const expectedModes: Record<string, Record<string, number>> = {
  "AVG-CP-001": { findSumFromAverageAndCount: 18, findAverageFromSumAndCount: 18, findCountFromSumAndAverage: 18, findMissingValueFromAverage: 18 },
  "AVG-CP-003": { findNewAverageAfterAddition: 13, findNewAverageAfterRemoval: 12, findNewAverageAfterReplacement: 13, findAddedMemberValueFromShift: 13, findRemovedMemberValueFromShift: 12, findReplacementValueFromShift: 11, findInningsValueOrNewCricketAverage: 12 },
  "AVG-CP-004": { findCombinedAverageOfTwoGroups: 16, findCombinedAverageOfThreeOrFourGroups: 12, findGroupCountFromCombinedAverage: 11, findMissingGroupAverage: 11, findAverageSpeedEqualDistance: 8, findAverageSpeedEqualTime: 7 },
  "AVG-CP-005": { findCorrectedAverageFromMistake: 10, findReportedAverageBeforeCorrection: 6, findCorrectValueFromAverageShift: 9, findIncorrectValueFromCorrection: 9, findEntryDifferenceFromAverageCorrection: 6, findAverageChangeFromEntryCorrection: 5, findNumberOfItemsFromTotalCorrection: 6, findCorrectedAverageFromMultipleMistakes: 5 },
  "AVG-CP-006": { findClassAverageFromSectionAverages: 8, findSuperGroupAverageFromSubgroups: 6, findMissingSectionAverage: 6, findSectionCountFromOverallAverage: 5, findMissingSubgroupCount: 5, findSubgroupTotalFromAverageAndCount: 5, findOverallTotalFromHierarchy: 5, findMissingLowerLevelAverage: 4 },
};
for (const [cpId, modes] of Object.entries(expectedModes)) {
  for (const [mode, count] of Object.entries(modes)) assert.equal(byCp(cpId).filter((entry) => entry.solveMode === mode).length, count, `${cpId}:${mode}`);
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

for (const qlId of ["AVG-QL-001", "AVG-QL-073", "AVG-QL-123", "AVG-QL-209", "AVG-QL-274", "AVG-QL-330"]) {
  for (const language of ["hi", "pa"] as const) assert.throws(() => runAvg001Pipeline({ questionLanguageId: qlId, seed: "unsupported", language }), /English only/);
}

console.log(JSON.stringify({ qlCount: entries.length, cpCounts: expectedCpCounts, seedsPerQl: 12, generated, status: "PASS" }, null, 2));
