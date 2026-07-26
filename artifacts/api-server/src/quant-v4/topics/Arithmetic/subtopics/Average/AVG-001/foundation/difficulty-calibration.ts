import type {
  Avg001CanonicalProblemId,
  Avg001Difficulty,
  Avg001QuestionLanguageEntry,
  Avg001SolveMode,
} from "./types";

type DifficultySplit = Record<Avg001Difficulty, number>;

export const AVG_001_EXAM_DIFFICULTY_CALIBRATION = Object.freeze({
  version: "AVG-001 exam difficulty calibration v2",
  basis: [
    "Structural complexity: direct one-relation tasks are Easy; reverse or weighted tasks are Medium; nested or chained tasks are Hard.",
    "Computational effort: clean one-equation arithmetic does not become Hard merely because values are large or contextual.",
    "Reasoning depth: elapsed-age chains, original-count recovery, four-group aggregation, unequal-stage speeds, multiple mistakes and nested missing subgroups remain Hard.",
  ],
  previousChapterSplit: { Easy: 109, Medium: 187, Hard: 129 },
  calibratedChapterSplit: { Easy: 182, Medium: 185, Hard: 58 },
});

const BASE_DIFFICULTY_BY_MODE: Record<Avg001SolveMode, Avg001Difficulty> = {
  findSumFromAverageAndCount: "Easy",
  findAverageFromSumAndCount: "Easy",
  findCountFromSumAndAverage: "Easy",
  findMissingValueFromAverage: "Easy",
  findAverageAfterUniformTransformation: "Easy",

  findAverageOfConsecutiveSet: "Easy",
  findMiddleTermFromAverage: "Easy",
  findExtremeFromAverageAndCount: "Medium",
  findAverageOfOddOrEvenSet: "Easy",
  findTermCountFromAverageAndExtreme: "Medium",
  findCommonDifferenceFromAverageCountAndExtreme: "Medium",

  findNewAverageAfterAddition: "Easy",
  findNewAverageAfterRemoval: "Easy",
  findNewAverageAfterReplacement: "Easy",
  findAddedMemberValueFromShift: "Medium",
  findRemovedMemberValueFromShift: "Medium",
  findReplacementValueFromShift: "Medium",
  findInningsValueOrNewCricketAverage: "Medium",
  findOriginalCountFromJoiningMemberShift: "Hard",
  findOriginalCountFromLeavingMemberShift: "Hard",

  findCombinedAverageOfTwoGroups: "Medium",
  findCombinedAverageOfThreeOrFourGroups: "Medium",
  findGroupCountFromCombinedAverage: "Medium",
  findMissingGroupAverage: "Medium",
  findAverageSpeedEqualDistance: "Medium",
  findAverageSpeedEqualTime: "Easy",
  findGroupCountRatioFromCombinedAverage: "Medium",
  findAverageSpeedForUnequalDistances: "Hard",
  findAverageSpeedForUnequalTimes: "Hard",

  findCorrectedAverageFromMistake: "Easy",
  findReportedAverageBeforeCorrection: "Medium",
  findCorrectValueFromAverageShift: "Medium",
  findIncorrectValueFromCorrection: "Medium",
  findEntryDifferenceFromAverageCorrection: "Easy",
  findAverageChangeFromEntryCorrection: "Easy",
  findNumberOfItemsFromTotalCorrection: "Medium",
  findCorrectedAverageFromMultipleMistakes: "Hard",

  findClassAverageFromSectionAverages: "Medium",
  findSuperGroupAverageFromSubgroups: "Medium",
  findMissingSectionAverage: "Hard",
  findSectionCountFromOverallAverage: "Medium",
  findMissingSubgroupCount: "Hard",
  findSubgroupTotalFromAverageAndCount: "Easy",
  findOverallTotalFromHierarchy: "Medium",
  findMissingLowerLevelAverage: "Hard",
};

const UNIFORM_MULTI_OPERATION_QLS = new Set(["AVG-QL-376", "AVG-QL-379"]);
const ELAPSED_AGE_NEW_AVERAGE_QLS = new Set([
  "AVG-QL-131", "AVG-QL-132", "AVG-QL-133", "AVG-QL-134",
  "AVG-QL-144", "AVG-QL-145", "AVG-QL-146",
  "AVG-QL-157", "AVG-QL-158", "AVG-QL-159",
]);
const ELAPSED_AGE_MEMBER_RECOVERY_QLS = new Set([
  "AVG-QL-169", "AVG-QL-170", "AVG-QL-171",
  "AVG-QL-182", "AVG-QL-183", "AVG-QL-184",
  "AVG-QL-193", "AVG-QL-194",
]);
const CRICKET_NEW_AVERAGE_QLS = new Set([
  "AVG-QL-203", "AVG-QL-204", "AVG-QL-205", "AVG-QL-206", "AVG-QL-208",
]);
const FOUR_GROUP_AGGREGATION_QLS = new Set([
  "AVG-QL-231", "AVG-QL-232", "AVG-QL-233",
  "AVG-QL-234", "AVG-QL-235", "AVG-QL-236",
]);

export function getAvg001CalibratedDifficulty(
  entry: Avg001QuestionLanguageEntry,
): Avg001Difficulty {
  if (UNIFORM_MULTI_OPERATION_QLS.has(entry.qlId)) return "Medium";
  if (ELAPSED_AGE_NEW_AVERAGE_QLS.has(entry.qlId)) return "Medium";
  if (ELAPSED_AGE_MEMBER_RECOVERY_QLS.has(entry.qlId)) return "Hard";
  if (CRICKET_NEW_AVERAGE_QLS.has(entry.qlId)) return "Easy";
  if (FOUR_GROUP_AGGREGATION_QLS.has(entry.qlId)) return "Hard";
  return BASE_DIFFICULTY_BY_MODE[entry.solveMode];
}

export const AVG_001_DIFFICULTY_SPLITS: Record<Avg001SolveMode, DifficultySplit> = {
  findSumFromAverageAndCount: { Easy: 18, Medium: 0, Hard: 0 },
  findAverageFromSumAndCount: { Easy: 18, Medium: 0, Hard: 0 },
  findCountFromSumAndAverage: { Easy: 18, Medium: 0, Hard: 0 },
  findMissingValueFromAverage: { Easy: 18, Medium: 0, Hard: 0 },
  findAverageAfterUniformTransformation: { Easy: 6, Medium: 2, Hard: 0 },

  findAverageOfConsecutiveSet: { Easy: 14, Medium: 0, Hard: 0 },
  findMiddleTermFromAverage: { Easy: 12, Medium: 0, Hard: 0 },
  findExtremeFromAverageAndCount: { Easy: 0, Medium: 12, Hard: 0 },
  findAverageOfOddOrEvenSet: { Easy: 12, Medium: 0, Hard: 0 },
  findTermCountFromAverageAndExtreme: { Easy: 0, Medium: 6, Hard: 0 },
  findCommonDifferenceFromAverageCountAndExtreme: { Easy: 0, Medium: 6, Hard: 0 },

  findNewAverageAfterAddition: { Easy: 9, Medium: 4, Hard: 0 },
  findNewAverageAfterRemoval: { Easy: 9, Medium: 3, Hard: 0 },
  findNewAverageAfterReplacement: { Easy: 10, Medium: 3, Hard: 0 },
  findAddedMemberValueFromShift: { Easy: 0, Medium: 10, Hard: 3 },
  findRemovedMemberValueFromShift: { Easy: 0, Medium: 9, Hard: 3 },
  findReplacementValueFromShift: { Easy: 0, Medium: 9, Hard: 2 },
  findInningsValueOrNewCricketAverage: { Easy: 5, Medium: 7, Hard: 0 },
  findOriginalCountFromJoiningMemberShift: { Easy: 0, Medium: 0, Hard: 6 },
  findOriginalCountFromLeavingMemberShift: { Easy: 0, Medium: 0, Hard: 6 },

  findCombinedAverageOfTwoGroups: { Easy: 0, Medium: 16, Hard: 0 },
  findCombinedAverageOfThreeOrFourGroups: { Easy: 0, Medium: 6, Hard: 6 },
  findGroupCountFromCombinedAverage: { Easy: 0, Medium: 11, Hard: 0 },
  findMissingGroupAverage: { Easy: 0, Medium: 11, Hard: 0 },
  findAverageSpeedEqualDistance: { Easy: 0, Medium: 8, Hard: 0 },
  findAverageSpeedEqualTime: { Easy: 7, Medium: 0, Hard: 0 },
  findGroupCountRatioFromCombinedAverage: { Easy: 0, Medium: 8, Hard: 0 },
  findAverageSpeedForUnequalDistances: { Easy: 0, Medium: 0, Hard: 6 },
  findAverageSpeedForUnequalTimes: { Easy: 0, Medium: 0, Hard: 6 },

  findCorrectedAverageFromMistake: { Easy: 10, Medium: 0, Hard: 0 },
  findReportedAverageBeforeCorrection: { Easy: 0, Medium: 6, Hard: 0 },
  findCorrectValueFromAverageShift: { Easy: 0, Medium: 9, Hard: 0 },
  findIncorrectValueFromCorrection: { Easy: 0, Medium: 9, Hard: 0 },
  findEntryDifferenceFromAverageCorrection: { Easy: 6, Medium: 0, Hard: 0 },
  findAverageChangeFromEntryCorrection: { Easy: 5, Medium: 0, Hard: 0 },
  findNumberOfItemsFromTotalCorrection: { Easy: 0, Medium: 6, Hard: 0 },
  findCorrectedAverageFromMultipleMistakes: { Easy: 0, Medium: 0, Hard: 5 },

  findClassAverageFromSectionAverages: { Easy: 0, Medium: 8, Hard: 0 },
  findSuperGroupAverageFromSubgroups: { Easy: 0, Medium: 6, Hard: 0 },
  findMissingSectionAverage: { Easy: 0, Medium: 0, Hard: 6 },
  findSectionCountFromOverallAverage: { Easy: 0, Medium: 5, Hard: 0 },
  findMissingSubgroupCount: { Easy: 0, Medium: 0, Hard: 5 },
  findSubgroupTotalFromAverageAndCount: { Easy: 5, Medium: 0, Hard: 0 },
  findOverallTotalFromHierarchy: { Easy: 0, Medium: 5, Hard: 0 },
  findMissingLowerLevelAverage: { Easy: 0, Medium: 0, Hard: 4 },
};

export const AVG_001_CP_DIFFICULTY_TARGETS: Record<Avg001CanonicalProblemId, DifficultySplit> = {
  "AVG-CP-001": { Easy: 78, Medium: 2, Hard: 0 },
  "AVG-CP-002": { Easy: 38, Medium: 24, Hard: 0 },
  "AVG-CP-003": { Easy: 33, Medium: 45, Hard: 20 },
  "AVG-CP-004": { Easy: 7, Medium: 60, Hard: 18 },
  "AVG-CP-005": { Easy: 21, Medium: 30, Hard: 5 },
  "AVG-CP-006": { Easy: 5, Medium: 24, Hard: 15 },
};

export const AVG_001_DIRECT_MODES_WITHOUT_HARD: Avg001SolveMode[] = [
  "findSumFromAverageAndCount",
  "findAverageFromSumAndCount",
  "findCountFromSumAndAverage",
  "findMissingValueFromAverage",
  "findAverageAfterUniformTransformation",
  "findAverageOfConsecutiveSet",
  "findMiddleTermFromAverage",
  "findExtremeFromAverageAndCount",
  "findAverageOfOddOrEvenSet",
  "findTermCountFromAverageAndExtreme",
  "findCommonDifferenceFromAverageCountAndExtreme",
  "findNewAverageAfterAddition",
  "findNewAverageAfterRemoval",
  "findNewAverageAfterReplacement",
  "findInningsValueOrNewCricketAverage",
  "findCombinedAverageOfTwoGroups",
  "findGroupCountFromCombinedAverage",
  "findMissingGroupAverage",
  "findAverageSpeedEqualDistance",
  "findAverageSpeedEqualTime",
  "findGroupCountRatioFromCombinedAverage",
  "findCorrectedAverageFromMistake",
  "findReportedAverageBeforeCorrection",
  "findCorrectValueFromAverageShift",
  "findIncorrectValueFromCorrection",
  "findEntryDifferenceFromAverageCorrection",
  "findAverageChangeFromEntryCorrection",
  "findNumberOfItemsFromTotalCorrection",
  "findClassAverageFromSectionAverages",
  "findSuperGroupAverageFromSubgroups",
  "findSectionCountFromOverallAverage",
  "findSubgroupTotalFromAverageAndCount",
  "findOverallTotalFromHierarchy",
];

export const AVG_001_REVERSE_MODES_WITHOUT_EASY: Avg001SolveMode[] = [
  "findExtremeFromAverageAndCount",
  "findTermCountFromAverageAndExtreme",
  "findCommonDifferenceFromAverageCountAndExtreme",
  "findAddedMemberValueFromShift",
  "findRemovedMemberValueFromShift",
  "findReplacementValueFromShift",
  "findOriginalCountFromJoiningMemberShift",
  "findOriginalCountFromLeavingMemberShift",
  "findCombinedAverageOfTwoGroups",
  "findCombinedAverageOfThreeOrFourGroups",
  "findGroupCountFromCombinedAverage",
  "findMissingGroupAverage",
  "findAverageSpeedEqualDistance",
  "findGroupCountRatioFromCombinedAverage",
  "findAverageSpeedForUnequalDistances",
  "findAverageSpeedForUnequalTimes",
  "findReportedAverageBeforeCorrection",
  "findCorrectValueFromAverageShift",
  "findIncorrectValueFromCorrection",
  "findNumberOfItemsFromTotalCorrection",
  "findCorrectedAverageFromMultipleMistakes",
  "findClassAverageFromSectionAverages",
  "findSuperGroupAverageFromSubgroups",
  "findMissingSectionAverage",
  "findSectionCountFromOverallAverage",
  "findMissingSubgroupCount",
  "findOverallTotalFromHierarchy",
  "findMissingLowerLevelAverage",
];

export const AVG_001_HARD_ONLY_MODES: Avg001SolveMode[] = [
  "findOriginalCountFromJoiningMemberShift",
  "findOriginalCountFromLeavingMemberShift",
  "findAverageSpeedForUnequalDistances",
  "findAverageSpeedForUnequalTimes",
  "findCorrectedAverageFromMultipleMistakes",
  "findMissingSectionAverage",
  "findMissingSubgroupCount",
  "findMissingLowerLevelAverage",
];

export function applyAvg001DifficultyCalibration(
  entries: Avg001QuestionLanguageEntry[],
): Avg001QuestionLanguageEntry[] {
  return entries.map((entry) => {
    const difficulty = getAvg001CalibratedDifficulty(entry);
    return difficulty === entry.difficulty ? entry : { ...entry, difficulty };
  });
}
