import type {
  Avg001CanonicalProblemId,
  Avg001Difficulty,
  Avg001QuestionLanguageEntry,
  Avg001SolveMode,
} from "./types";

type DifficultySplit = Record<Avg001Difficulty, number>;

export const AVG_001_DIFFICULTY_SPLITS: Record<Avg001SolveMode, DifficultySplit> = {
  findSumFromAverageAndCount: { Easy: 12, Medium: 6, Hard: 0 },
  findAverageFromSumAndCount: { Easy: 10, Medium: 8, Hard: 0 },
  findCountFromSumAndAverage: { Easy: 8, Medium: 10, Hard: 0 },
  findMissingValueFromAverage: { Easy: 0, Medium: 10, Hard: 8 },
  findAverageAfterUniformTransformation: { Easy: 2, Medium: 4, Hard: 2 },

  findAverageOfConsecutiveSet: { Easy: 8, Medium: 6, Hard: 0 },
  findMiddleTermFromAverage: { Easy: 8, Medium: 4, Hard: 0 },
  findExtremeFromAverageAndCount: { Easy: 0, Medium: 8, Hard: 4 },
  findAverageOfOddOrEvenSet: { Easy: 4, Medium: 8, Hard: 0 },
  findTermCountFromAverageAndExtreme: { Easy: 0, Medium: 1, Hard: 5 },
  findCommonDifferenceFromAverageCountAndExtreme: { Easy: 0, Medium: 1, Hard: 5 },

  findNewAverageAfterAddition: { Easy: 7, Medium: 6, Hard: 0 },
  findNewAverageAfterRemoval: { Easy: 6, Medium: 6, Hard: 0 },
  findNewAverageAfterReplacement: { Easy: 2, Medium: 8, Hard: 3 },
  findAddedMemberValueFromShift: { Easy: 1, Medium: 7, Hard: 5 },
  findRemovedMemberValueFromShift: { Easy: 1, Medium: 6, Hard: 5 },
  findReplacementValueFromShift: { Easy: 0, Medium: 5, Hard: 6 },
  findInningsValueOrNewCricketAverage: { Easy: 2, Medium: 6, Hard: 4 },
  findOriginalCountFromJoiningMemberShift: { Easy: 0, Medium: 1, Hard: 5 },
  findOriginalCountFromLeavingMemberShift: { Easy: 0, Medium: 1, Hard: 5 },

  findCombinedAverageOfTwoGroups: { Easy: 10, Medium: 6, Hard: 0 },
  findCombinedAverageOfThreeOrFourGroups: { Easy: 2, Medium: 7, Hard: 3 },
  findGroupCountFromCombinedAverage: { Easy: 0, Medium: 4, Hard: 7 },
  findMissingGroupAverage: { Easy: 0, Medium: 4, Hard: 7 },
  findAverageSpeedEqualDistance: { Easy: 2, Medium: 4, Hard: 2 },
  findAverageSpeedEqualTime: { Easy: 4, Medium: 3, Hard: 0 },
  findGroupCountRatioFromCombinedAverage: { Easy: 0, Medium: 2, Hard: 6 },
  findAverageSpeedForUnequalDistances: { Easy: 0, Medium: 1, Hard: 5 },
  findAverageSpeedForUnequalTimes: { Easy: 0, Medium: 2, Hard: 4 },

  findCorrectedAverageFromMistake: { Easy: 6, Medium: 4, Hard: 0 },
  findReportedAverageBeforeCorrection: { Easy: 1, Medium: 4, Hard: 1 },
  findCorrectValueFromAverageShift: { Easy: 0, Medium: 5, Hard: 4 },
  findIncorrectValueFromCorrection: { Easy: 0, Medium: 5, Hard: 4 },
  findEntryDifferenceFromAverageCorrection: { Easy: 2, Medium: 4, Hard: 0 },
  findAverageChangeFromEntryCorrection: { Easy: 3, Medium: 2, Hard: 0 },
  findNumberOfItemsFromTotalCorrection: { Easy: 0, Medium: 2, Hard: 4 },
  findCorrectedAverageFromMultipleMistakes: { Easy: 0, Medium: 1, Hard: 4 },

  findClassAverageFromSectionAverages: { Easy: 2, Medium: 5, Hard: 1 },
  findSuperGroupAverageFromSubgroups: { Easy: 0, Medium: 3, Hard: 3 },
  findMissingSectionAverage: { Easy: 0, Medium: 2, Hard: 4 },
  findSectionCountFromOverallAverage: { Easy: 0, Medium: 1, Hard: 4 },
  findMissingSubgroupCount: { Easy: 0, Medium: 1, Hard: 4 },
  findSubgroupTotalFromAverageAndCount: { Easy: 5, Medium: 0, Hard: 0 },
  findOverallTotalFromHierarchy: { Easy: 1, Medium: 3, Hard: 1 },
  findMissingLowerLevelAverage: { Easy: 0, Medium: 0, Hard: 4 },
};

export const AVG_001_CP_DIFFICULTY_TARGETS: Record<Avg001CanonicalProblemId, DifficultySplit> = {
  "AVG-CP-001": { Easy: 32, Medium: 38, Hard: 10 },
  "AVG-CP-002": { Easy: 20, Medium: 28, Hard: 14 },
  "AVG-CP-003": { Easy: 19, Medium: 46, Hard: 33 },
  "AVG-CP-004": { Easy: 18, Medium: 33, Hard: 34 },
  "AVG-CP-005": { Easy: 12, Medium: 27, Hard: 17 },
  "AVG-CP-006": { Easy: 8, Medium: 15, Hard: 21 },
};

export const AVG_001_DIRECT_MODES_WITHOUT_HARD: Avg001SolveMode[] = [
  "findSumFromAverageAndCount",
  "findAverageFromSumAndCount",
  "findCountFromSumAndAverage",
  "findAverageOfConsecutiveSet",
  "findMiddleTermFromAverage",
  "findNewAverageAfterAddition",
  "findNewAverageAfterRemoval",
  "findCombinedAverageOfTwoGroups",
  "findAverageSpeedEqualTime",
  "findCorrectedAverageFromMistake",
  "findEntryDifferenceFromAverageCorrection",
  "findAverageChangeFromEntryCorrection",
  "findSubgroupTotalFromAverageAndCount",
];

export const AVG_001_REVERSE_MODES_WITHOUT_EASY: Avg001SolveMode[] = [
  "findMissingValueFromAverage",
  "findExtremeFromAverageAndCount",
  "findTermCountFromAverageAndExtreme",
  "findCommonDifferenceFromAverageCountAndExtreme",
  "findReplacementValueFromShift",
  "findOriginalCountFromJoiningMemberShift",
  "findOriginalCountFromLeavingMemberShift",
  "findGroupCountFromCombinedAverage",
  "findMissingGroupAverage",
  "findGroupCountRatioFromCombinedAverage",
  "findAverageSpeedForUnequalDistances",
  "findAverageSpeedForUnequalTimes",
  "findCorrectValueFromAverageShift",
  "findIncorrectValueFromCorrection",
  "findNumberOfItemsFromTotalCorrection",
  "findCorrectedAverageFromMultipleMistakes",
  "findSuperGroupAverageFromSubgroups",
  "findMissingSectionAverage",
  "findSectionCountFromOverallAverage",
  "findMissingSubgroupCount",
  "findMissingLowerLevelAverage",
];

const DIFFICULTIES: Avg001Difficulty[] = ["Easy", "Medium", "Hard"];

function qlNumber(entry: Avg001QuestionLanguageEntry) {
  return Number(entry.qlId.slice(-3));
}

export function applyAvg001DifficultyCalibration(
  entries: Avg001QuestionLanguageEntry[],
): Avg001QuestionLanguageEntry[] {
  const familyByMode = new Map<Avg001SolveMode, Avg001QuestionLanguageEntry[]>();
  for (const entry of entries) {
    const family = familyByMode.get(entry.solveMode) ?? [];
    family.push(entry);
    familyByMode.set(entry.solveMode, family);
  }
  for (const family of familyByMode.values()) family.sort((a, b) => qlNumber(a) - qlNumber(b));

  return entries.map((entry) => {
    const family = familyByMode.get(entry.solveMode)!;
    const index = family.findIndex((item) => item.qlId === entry.qlId);
    const split = AVG_001_DIFFICULTY_SPLITS[entry.solveMode];
    const expectedFamilyCount = DIFFICULTIES.reduce((sum, difficulty) => sum + split[difficulty], 0);
    if (family.length !== expectedFamilyCount) {
      throw new Error(`${entry.solveMode}: ${family.length} QLs; calibration expects ${expectedFamilyCount}`);
    }
    const difficulty = index < split.Easy
      ? "Easy"
      : index < split.Easy + split.Medium
        ? "Medium"
        : "Hard";
    return difficulty === entry.difficulty ? entry : { ...entry, difficulty };
  });
}
