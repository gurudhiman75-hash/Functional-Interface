import { strict as assert } from "node:assert";
import { getAvg001QuestionEntries, getAvg001QuestionLanguageIds } from "./foundation/library";
import { runAvg001Pipeline } from "./foundation/pipeline";

const entries = getAvg001QuestionEntries();
const byCp = (cpId: string) => entries.filter((entry) => entry.cpId === cpId);
const expectedCpCounts = {
  "AVG-CP-001": 80,
  "AVG-CP-002": 62,
  "AVG-CP-003": 98,
  "AVG-CP-004": 85,
  "AVG-CP-005": 56,
  "AVG-CP-006": 44,
} as const;
const expectedTotal = 425;

assert.equal(entries.length, expectedTotal);
assert.equal(new Set(entries.map((entry) => entry.qlId)).size, expectedTotal);
assert.deepEqual(entries.map((entry) => entry.qlId), Array.from({ length: 425 }, (_, index) => `AVG-QL-${String(index + 1).padStart(3, "0")}`));
for (const [cpId, count] of Object.entries(expectedCpCounts)) assert.equal(byCp(cpId).length, count, cpId);

const expectedModes: Record<string, Record<string, number>> = {
  "AVG-CP-001": { findSumFromAverageAndCount: 18, findAverageFromSumAndCount: 18, findCountFromSumAndAverage: 18, findMissingValueFromAverage: 18, findAverageAfterUniformTransformation: 8 },
  "AVG-CP-002": { findAverageOfConsecutiveSet: 14, findMiddleTermFromAverage: 12, findExtremeFromAverageAndCount: 12, findAverageOfOddOrEvenSet: 12, findTermCountFromAverageAndExtreme: 6, findCommonDifferenceFromAverageCountAndExtreme: 6 },
  "AVG-CP-003": { findNewAverageAfterAddition: 13, findNewAverageAfterRemoval: 12, findNewAverageAfterReplacement: 13, findAddedMemberValueFromShift: 13, findRemovedMemberValueFromShift: 12, findReplacementValueFromShift: 11, findInningsValueOrNewCricketAverage: 12, findOriginalCountFromJoiningMemberShift: 6, findOriginalCountFromLeavingMemberShift: 6 },
  "AVG-CP-004": { findCombinedAverageOfTwoGroups: 16, findCombinedAverageOfThreeOrFourGroups: 12, findGroupCountFromCombinedAverage: 11, findMissingGroupAverage: 11, findAverageSpeedEqualDistance: 8, findAverageSpeedEqualTime: 7, findGroupCountRatioFromCombinedAverage: 8, findAverageSpeedForUnequalDistances: 6, findAverageSpeedForUnequalTimes: 6 },
  "AVG-CP-005": { findCorrectedAverageFromMistake: 10, findReportedAverageBeforeCorrection: 6, findCorrectValueFromAverageShift: 9, findIncorrectValueFromCorrection: 9, findEntryDifferenceFromAverageCorrection: 6, findAverageChangeFromEntryCorrection: 5, findNumberOfItemsFromTotalCorrection: 6, findCorrectedAverageFromMultipleMistakes: 5 },
  "AVG-CP-006": { findClassAverageFromSectionAverages: 8, findSuperGroupAverageFromSubgroups: 6, findMissingSectionAverage: 6, findSectionCountFromOverallAverage: 5, findMissingSubgroupCount: 5, findSubgroupTotalFromAverageAndCount: 5, findOverallTotalFromHierarchy: 5, findMissingLowerLevelAverage: 4 },
};
for (const [cpId, modes] of Object.entries(expectedModes)) for (const [mode, count] of Object.entries(modes)) assert.equal(byCp(cpId).filter((entry) => entry.solveMode === mode).length, count, `${cpId}:${mode}`);

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

for (const qlId of ["AVG-QL-001", "AVG-QL-073", "AVG-QL-123", "AVG-QL-209", "AVG-QL-274", "AVG-QL-330", "AVG-QL-374"]) {
  for (const language of ["hi", "pa"] as const) assert.throws(() => runAvg001Pipeline({ questionLanguageId: qlId, seed: "unsupported", language }), /English only/);
}
console.log(JSON.stringify({ qlCount: entries.length, cpCounts: expectedCpCounts, seedsPerQl: 12, generated, status: "PASS" }, null, 2));
