import { formatExactNumber, hashSeed, pick, seededRandom, shuffle } from "../shared/exact";
import type {
  Sta001ContractId,
  Sta001Difficulty,
  Sta001ExamProfile,
  Sta001Explanation,
  Sta001Option,
  Sta001Question,
  Sta001SolveMode,
  Sta001State,
  Sta001ValidationCheck,
} from "./types";

export const STA001_CONTRACTS: readonly Sta001ContractId[] = [
  "STAT-TEMP-001-SIMPLE-MEAN",
  "STAT-TEMP-002-MISSING-OBSERVATION",
  "STAT-TEMP-003-CORRECTED-MEAN",
  "STAT-TEMP-004-COMBINED-MEAN",
  "STAT-TEMP-005-MEDIAN-RAW",
  "STAT-TEMP-006-MODE-RAW",
] as const;

const SIMPLE_MEAN_PATTERNS = [
  [-8, -4, 0, 4, 8],
  [-10, -6, -2, 3, 7, 8],
  [-12, -3, -1, 2, 5, 9],
] as const;

const MISSING_PATTERNS = [
  [-9, -4, 1, 5, 7],
  [-8, -3, -1, 4, 8],
  [-10, -2, 2, 3, 7],
  [-10, -6, -1, 2, 6, 9],
  [-12, -4, -1, 3, 5, 9],
  [-12, -9, -5, -1, 2, 5, 8, 12],
] as const;

const MEDIAN_ODD_OFFSETS = [-12, -7, -3, 1, 5, 9, 15] as const;
const MEDIAN_EVEN_OFFSETS = [-14, -9, -4, -1, 3, 7, 12, 18] as const;

const CONTRACT_META: Record<Sta001ContractId, { solveMode: Sta001SolveMode; difficulty: Sta001Difficulty }> = {
  "STAT-TEMP-001-SIMPLE-MEAN": { solveMode: "DIRECT_MEAN", difficulty: "Easy" },
  "STAT-TEMP-002-MISSING-OBSERVATION": { solveMode: "REVERSE_MEAN_TOTAL", difficulty: "Medium" },
  "STAT-TEMP-003-CORRECTED-MEAN": { solveMode: "MEAN_CORRECTION", difficulty: "Medium" },
  "STAT-TEMP-004-COMBINED-MEAN": { solveMode: "WEIGHTED_GROUP_MEAN", difficulty: "Hard" },
  "STAT-TEMP-005-MEDIAN-RAW": { solveMode: "ORDER_STATISTIC_MEDIAN", difficulty: "Medium" },
  "STAT-TEMP-006-MODE-RAW": { solveMode: "FREQUENCY_MODE", difficulty: "Medium" },
};

type Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
type Draft = Readonly<{
  state: Sta001State;
  stem: string;
  answer: string;
  candidates: readonly Candidate[];
  explanation: Sta001Explanation;
}>;

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function arithmeticMean(values: readonly number[]): string {
  return formatExactNumber(sum(values), values.length);
}

function median(values: readonly number[]): string {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? String(sorted[middle]!)
    : formatExactNumber(sorted[middle - 1]! + sorted[middle]!, 2);
}

function mode(values: readonly number[]): number {
  const counts = new Map<number, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  const ordered = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  if (ordered.length < 2 || ordered[0]![1] === ordered[1]![1]) throw new Error("STAT-001 requires a unique mode.");
  return ordered[0]![0];
}

function surface(seed: string): 0 | 1 | 2 {
  return (hashSeed(`${seed}:surface`) % 3) as 0 | 1 | 2;
}

function list(values: readonly number[]): string {
  return values.join(", ");
}

function buildOptions(seed: string, answer: string, candidates: readonly Candidate[]) {
  const seen = new Set<string>();
  const retained: Sta001Option[] = [];
  const add = (candidate: Candidate) => {
    const key = candidate.text.trim().toLowerCase();
    if (!candidate.text.trim() || seen.has(key)) return;
    seen.add(key);
    retained.push(candidate);
  };

  add({ text: answer, misconceptionId: "CORRECT", derivation: "Exact recomputation from the STAT-001 mathematical state." });
  candidates.forEach(add);
  if (retained.length < 4) {
    throw new Error(`STAT-001 could construct only ${retained.length} unique options; 4 are required.`);
  }

  const shuffled = shuffle(seededRandom(`${seed}:options`), retained.slice(0, 4));
  const correctIndex = shuffled.findIndex((option) => option.misconceptionId === "CORRECT");
  if (correctIndex < 0) throw new Error("STAT-001 lost the correct option during deterministic shuffling.");
  return { options: shuffled.map((option) => option.text), optionMetadata: shuffled, correctIndex };
}

function buildSimpleMean(seed: string, profile: Sta001ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:simple-mean`);
  const meanValue = pick(random, profile === "SSC_CGL_JSO" ? [48, 56, 64, 72, 80] : [24, 32, 40, 48, 56]);
  const allowedPatterns = profile === "SSC_CGL_JSO" ? SIMPLE_MEAN_PATTERNS.slice(1) : SIMPLE_MEAN_PATTERNS;
  const pattern = pick(random, allowedPatterns);
  const values = shuffle(seededRandom(`${seed}:simple-values`), pattern.map((offset) => meanValue + offset));
  const total = sum(values);
  const answer = String(meanValue);
  const s = surface(`${seed}:simple`);
  const stems = [
    `Find the arithmetic mean of the observations ${list(values)}.`,
    `The observations are ${list(values)}. What is their average?`,
    `A data set contains ${list(values)}. What is its mean?`,
  ] as const;

  return {
    state: { kind: "SIMPLE_MEAN_RAW", values },
    stem: stems[s],
    answer,
    candidates: [
      { text: formatExactNumber(total, values.length - 1), misconceptionId: "DIVIDE_BY_ONE_FEWER", derivation: `Adds the observations correctly but divides by ${values.length - 1} instead of ${values.length}.` },
      { text: formatExactNumber(total, values.length + 1), misconceptionId: "DIVIDE_BY_ONE_EXTRA", derivation: `Uses ${values.length + 1} as the number of observations instead of ${values.length}.` },
      { text: formatExactNumber(total - values[0]!, values.length), misconceptionId: "OMIT_ONE_KEEP_DENOMINATOR", derivation: `Omits the first listed observation ${values[0]} from the total but still divides by ${values.length}.` },
      { text: formatExactNumber(total + values[0]!, values.length), misconceptionId: "COUNT_ONE_TWICE", derivation: `Counts the first listed observation ${values[0]} twice before dividing by ${values.length}.` },
    ],
    explanation: {
      keyIdea: "The arithmetic mean equals the sum of all observations divided by the number of observations, so both the total and the count must be correct.",
      steps: [`Sum of the ${values.length} observations = ${total}.`, `Mean = ${total} ÷ ${values.length} = ${answer}.`],
      shortcut: `Because the values are clustered around ${meanValue}, pair low and high deviations around ${meanValue}; their deviations cancel, revealing the mean quickly.`,
      trap: "Do not divide by the number of gaps between observations; the denominator is the number of observations themselves.",
    },
  };
}

function buildMissingObservation(seed: string, profile: Sta001ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:missing`);
  const profilePatterns = profile === "SSC_CGL_JSO"
    ? MISSING_PATTERNS.filter((pattern) => pattern.length >= 6)
    : MISSING_PATTERNS.filter((pattern) => pattern.length <= 6);
  const pattern = pick(random, profilePatterns);
  const meanValue = pick(random, profile === "SSC_CGL_JSO" ? [50, 60, 70, 80] : [30, 40, 50, 60]);
  const hiddenIndex = Math.floor(random() * pattern.length);
  const fullValues = pattern.map((offset) => meanValue + offset);
  const missingValue = fullValues[hiddenIndex]!;
  const knownValues = fullValues.filter((_, index) => index !== hiddenIndex);
  const knownSum = sum(knownValues);
  const total = meanValue * pattern.length;
  const deviation = missingValue - meanValue;
  const knownAverage = formatExactNumber(knownSum, knownValues.length);
  const s = surface(`${seed}:missing`);
  const stems = [
    `The mean of ${pattern.length} observations is ${meanValue}. If ${list(knownValues)} are ${knownValues.length} of them, find the remaining observation.`,
    `${pattern.length} observations have an average of ${meanValue}. All but one are ${list(knownValues)}. What is the missing value?`,
    `The average of a set of ${pattern.length} values is ${meanValue}. The known values are ${list(knownValues)}. Determine the omitted value.`,
  ] as const;

  return {
    state: { kind: "MISSING_OBSERVATION", observationCount: pattern.length, mean: meanValue, knownValues },
    stem: stems[s],
    answer: String(missingValue),
    candidates: [
      { text: String(meanValue), misconceptionId: "ASSUME_MISSING_EQUALS_MEAN", derivation: "Assumes the missing observation must equal the overall mean without first balancing the known observations." },
      { text: String(meanValue - deviation), misconceptionId: "REVERSE_DEVIATION", derivation: "Moves the missing observation to the opposite side of the mean by reversing its required deviation." },
      { text: formatExactNumber(knownSum, pattern.length), misconceptionId: "DIVIDE_KNOWN_SUM_BY_FULL_COUNT", derivation: `Divides the sum of the ${knownValues.length} known observations by all ${pattern.length} positions instead of recovering the missing total contribution.` },
      { text: knownAverage, misconceptionId: "REPORT_KNOWN_AVERAGE", derivation: "Finds the average of the known observations and reports it as the missing observation." },
      { text: String(total + knownSum), misconceptionId: "ADD_KNOWN_SUM_TO_REQUIRED_TOTAL", derivation: "Adds the known sum to the required total instead of subtracting it." },
    ],
    explanation: {
      keyIdea: "Convert the stated mean back to the required total of all observations, then subtract the sum of the known observations.",
      steps: [`Required total = ${meanValue} × ${pattern.length} = ${total}.`, `Known total = ${knownSum}; missing observation = ${total} - ${knownSum} = ${missingValue}.`],
      shortcut: `Compare the known observations with ${meanValue}: their net deviation is ${-deviation}, so the missing observation must contribute the opposite deviation ${deviation >= 0 ? "+" : ""}${deviation}.`,
      trap: "The mean is not automatically the missing value; that is true only when the known observations already balance exactly around the mean.",
    },
  };
}

function buildCorrectedMean(seed: string, profile: Sta001ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:corrected`);
  const observationCount = pick(random, profile === "SSC_CGL_JSO" ? [10, 20, 25] : [5, 10, 20]);
  const reportedMean = pick(random, profile === "SSC_CGL_JSO" ? [45, 50, 55, 60, 65] : [30, 35, 40, 45, 50]);
  const shiftPerObservation = pick(random, [1, 2, 3, 4]);
  const direction = random() < 0.5 ? -1 : 1;
  const totalMagnitude = observationCount * shiftPerObservation;
  const totalDifference = totalMagnitude * direction;
  const positiveFloor = direction < 0 ? totalMagnitude + 20 : 40;
  const wrongValue = pick(random, [positiveFloor, positiveFloor + 20, positiveFloor + 40, positiveFloor + 60, positiveFloor + 80]);
  const correctValue = wrongValue + totalDifference;
  const correctedMean = reportedMean + shiftPerObservation * direction;
  const reverseMean = reportedMean - shiftPerObservation * direction;
  const s = surface(`${seed}:corrected`);
  const stems = [
    `The mean of ${observationCount} observations was calculated as ${reportedMean}. Later, a value entered as ${wrongValue} was found to be ${correctValue}. What is the correct mean?`,
    `An average of ${reportedMean} was obtained for ${observationCount} observations using ${wrongValue} in place of the correct value ${correctValue}. Find the corrected average.`,
    `For ${observationCount} observations, the reported mean is ${reportedMean}. One observation was recorded as ${wrongValue} instead of ${correctValue}. Determine the actual mean.`,
  ] as const;

  return {
    state: { kind: "CORRECTED_MEAN", observationCount, reportedMean, wrongValue, correctValue },
    stem: stems[s],
    answer: String(correctedMean),
    candidates: [
      { text: String(reportedMean), misconceptionId: "KEEP_REPORTED_MEAN", derivation: "Leaves the mean unchanged even though one recorded observation has been corrected." },
      { text: String(reverseMean), misconceptionId: "REVERSE_CORRECTION", derivation: "Applies the correction in the opposite direction by subtracting where it should add, or vice versa." },
      { text: String(reportedMean + totalDifference), misconceptionId: "APPLY_FULL_DIFFERENCE_TO_MEAN", derivation: `Adds the entire observation correction ${totalDifference} directly to the mean instead of dividing its effect across ${observationCount} observations.` },
      { text: String(correctValue), misconceptionId: "REPORT_CORRECTED_OBSERVATION", derivation: "Reports the corrected observation itself rather than the corrected mean of the full data set." },
    ],
    explanation: {
      keyIdea: "Correcting one observation changes the total by correct minus wrong; the mean changes by that total correction divided by the number of observations.",
      steps: [`Total correction = ${correctValue} - ${wrongValue} = ${totalDifference}.`, `Mean correction = ${totalDifference} ÷ ${observationCount} = ${shiftPerObservation * direction}; correct mean = ${reportedMean} ${shiftPerObservation * direction >= 0 ? "+" : "-"} ${Math.abs(shiftPerObservation * direction)} = ${correctedMean}.`],
      shortcut: "You do not need to reconstruct the original total: divide the single-entry correction by the number of observations and adjust the reported mean directly.",
      trap: "Do not add the full difference between the corrected and wrong values directly to the mean; that difference belongs to the total, not to each observation.",
    },
  };
}

function buildCombinedMean(seed: string, profile: Sta001ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:combined`);
  const countPairs = profile === "SSC_CGL_JSO"
    ? [[40, 60], [50, 80], [60, 90], [75, 45], [80, 50]] as const
    : [[20, 30], [30, 50], [40, 20], [25, 35], [15, 45]] as const;
  const [group1Count, group2Count] = pick(random, countPairs);
  const meanPairs = [[40, 50], [45, 60], [52, 68], [56, 44], [64, 48]] as const;
  const [group1Mean, group2Mean] = pick(random, meanPairs);
  const weightedNumerator = group1Count * group1Mean + group2Count * group2Mean;
  const totalCount = group1Count + group2Count;
  const answer = formatExactNumber(weightedNumerator, totalCount);
  const simpleAverage = formatExactNumber(group1Mean + group2Mean, 2);
  const swappedWeighted = formatExactNumber(group2Count * group1Mean + group1Count * group2Mean, totalCount);
  const wrongDenominator = formatExactNumber(weightedNumerator, totalCount - 1);
  const s = surface(`${seed}:combined`);
  const stems = [
    `One group has ${group1Count} observations with mean ${group1Mean}, and another has ${group2Count} observations with mean ${group2Mean}. What is the mean of all the observations together?`,
    `The average of ${group1Count} values is ${group1Mean}, while the average of another ${group2Count} values is ${group2Mean}. Find the combined mean.`,
    `Two data groups contain ${group1Count} and ${group2Count} observations, with means ${group1Mean} and ${group2Mean} respectively. Determine their overall mean.`,
  ] as const;

  return {
    state: { kind: "COMBINED_MEAN", group1Count, group1Mean, group2Count, group2Mean },
    stem: stems[s],
    answer,
    candidates: [
      { text: simpleAverage, misconceptionId: "UNWEIGHTED_MEAN_OF_MEANS", derivation: "Takes the simple average of the two group means and ignores that the group sizes are different." },
      { text: swappedWeighted, misconceptionId: "SWAP_GROUP_WEIGHTS", derivation: "Attaches each group mean to the other group's size while forming the weighted total." },
      { text: wrongDenominator, misconceptionId: "DIVIDE_BY_ONE_FEWER_TOTAL", derivation: `Uses ${totalCount - 1} instead of the combined ${totalCount} observations as the denominator.` },
      { text: String(Math.max(group1Mean, group2Mean)), misconceptionId: "REPORT_LARGER_GROUP_MEAN", derivation: "Reports one component mean instead of weighting both groups by their observation counts." },
    ],
    explanation: {
      keyIdea: "A combined mean is a weighted mean: recover each group's total from count × mean, add the totals, then divide by the combined count.",
      steps: [`Combined total = ${group1Count} × ${group1Mean} + ${group2Count} × ${group2Mean} = ${weightedNumerator}.`, `Combined count = ${group1Count + group2Count} = ${totalCount}; combined mean = ${weightedNumerator} ÷ ${totalCount} = ${answer}.`],
      shortcut: `Start from ${group1Mean}: the second group is ${group2Mean - group1Mean} away and carries ${group2Count}/${totalCount} of the weight, which gives the same weighted shift quickly.`,
      trap: "Averaging the two means directly is valid only when the two group sizes are equal; here the counts must be used as weights.",
    },
  };
}

function buildMedian(seed: string, profile: Sta001ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:median`);
  const even = profile === "SSC_CGL_JSO" ? random() < 0.65 : random() < 0.45;
  const offsets = even ? MEDIAN_EVEN_OFFSETS : MEDIAN_ODD_OFFSETS;
  const base = pick(random, profile === "SSC_CGL_JSO" ? [50, 60, 70, 80] : [30, 40, 50, 60]);
  const values = shuffle(seededRandom(`${seed}:median-values`), offsets.map((offset) => base + offset));
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const answer = median(values);
  const lowerCentral = String(sorted[middle - 1]!);
  const upperCentral = String(sorted[middle]!);
  const nextCentral = String(sorted[middle + 1]!);
  const wrongPair = formatExactNumber(sorted[middle - 2]! + sorted[middle + 1]!, 2);
  const meanValue = arithmeticMean(values);
  const midrange = formatExactNumber(sorted[0]! + sorted[sorted.length - 1]!, 2);
  const medianCandidates: readonly Candidate[] = sorted.length % 2 === 0
    ? [
        { text: lowerCentral, misconceptionId: "USE_LOWER_CENTRAL_ONLY", derivation: "Uses only the lower of the two central ordered values instead of averaging both central positions." },
        { text: upperCentral, misconceptionId: "USE_UPPER_CENTRAL_ONLY", derivation: "Uses only the upper of the two central ordered values instead of averaging both central positions." },
        { text: wrongPair, misconceptionId: "AVERAGE_WRONG_CENTRAL_PAIR", derivation: "Averages values outside the two true central positions and therefore uses the wrong positional pair." },
        { text: meanValue, misconceptionId: "CALCULATE_MEAN_INSTEAD", derivation: "Calculates the arithmetic mean instead of locating the middle position after ordering the data." },
        { text: midrange, misconceptionId: "USE_MIDRANGE", derivation: "Averages the minimum and maximum values instead of the two central ordered observations." },
      ]
    : [
        { text: lowerCentral, misconceptionId: "USE_PREVIOUS_ORDERED_VALUE", derivation: "Chooses the observation immediately below the unique central position in the ordered data." },
        { text: nextCentral, misconceptionId: "USE_NEXT_ORDERED_VALUE", derivation: "Chooses the observation immediately above the unique central position in the ordered data." },
        { text: meanValue, misconceptionId: "CALCULATE_MEAN_INSTEAD", derivation: "Calculates the arithmetic mean instead of taking the unique central ordered observation." },
        { text: midrange, misconceptionId: "USE_MIDRANGE", derivation: "Averages the minimum and maximum values instead of selecting the central ordered observation." },
        { text: String(sorted[1]!), misconceptionId: "USE_LOWER_POSITION", derivation: "Selects a lower ordered position rather than the unique central position required for an odd-sized data set." },
      ];
  const s = surface(`${seed}:median`);
  const stems = [
    `Find the median of the observations ${list(values)}.`,
    `What is the median of the data set ${list(values)}?`,
    `The values are ${list(values)}. After arranging them in order, what is the median?`,
  ] as const;

  return {
    state: { kind: "MEDIAN_RAW", values },
    stem: stems[s],
    answer,
    candidates: medianCandidates,
    explanation: {
      keyIdea: "The median is positional: first arrange the data from smallest to largest, then use the central observation for odd size or the mean of the two central observations for even size.",
      steps: [`Ordered data: ${list(sorted)}.`, sorted.length % 2 === 1 ? `There are ${sorted.length} observations, so the median is the ${middle + 1}th value = ${answer}.` : `There are ${sorted.length} observations, so the median is the average of positions ${middle} and ${middle + 1}: (${sorted[middle - 1]} + ${sorted[middle]}) ÷ 2 = ${answer}.`],
      shortcut: "For an unsorted list, you only need enough ordering to identify the central position(s); computing the total is unnecessary.",
      trap: "Median is not the same as mean, and for an even number of observations neither central value alone is the median unless both central values are equal.",
    },
  };
}

function buildMode(seed: string, profile: Sta001ExamProfile): Draft {
  const random = seededRandom(`${seed}:${profile}:mode`);
  const base = pick(random, profile === "SSC_CGL_JSO" ? [50, 60, 70, 80] : [30, 40, 50, 60]);
  const modalValue = base + pick(random, [2, 4, 6]);
  const secondValue = base + pick(random, [10, 12, 14]);
  const uniqueA = base - pick(random, [3, 5, 7]);
  const uniqueB = base + pick(random, [17, 19, 21]);
  const values = shuffle(seededRandom(`${seed}:mode-values`), [modalValue, modalValue, modalValue, secondValue, secondValue, uniqueA, uniqueB]);
  const answer = String(mode(values));
  const meanValue = arithmeticMean(values);
  const medianValue = median(values);
  const s = surface(`${seed}:mode`);
  const stems = [
    `Find the mode of the observations ${list(values)}.`,
    `Which value is the mode of the data set ${list(values)}?`,
    `The observations are ${list(values)}. Identify the value with the greatest frequency.`,
  ] as const;

  return {
    state: { kind: "MODE_RAW", values },
    stem: stems[s],
    answer,
    candidates: [
      { text: String(secondValue), misconceptionId: "USE_SECOND_HIGHEST_FREQUENCY", derivation: `Chooses ${secondValue}, which occurs twice, instead of the value occurring most often.` },
      { text: medianValue, misconceptionId: "CALCULATE_MEDIAN_INSTEAD", derivation: "Finds the middle ordered observation instead of the most frequent observation." },
      { text: meanValue, misconceptionId: "CALCULATE_MEAN_INSTEAD", derivation: "Calculates the arithmetic average rather than identifying the highest-frequency value." },
      { text: "3", misconceptionId: "REPORT_MODAL_FREQUENCY", derivation: "Reports the highest frequency count, 3, instead of the data value that has that frequency." },
      { text: String(uniqueA), misconceptionId: "CHOOSE_SINGLETON_VALUE", derivation: "Selects a value that appears only once and therefore cannot be the mode." },
    ],
    explanation: {
      keyIdea: "The mode is the observation with the greatest frequency; it is a data value, not the number of times that value occurs.",
      steps: [`${modalValue} occurs 3 times; ${secondValue} occurs 2 times; the remaining values occur once.`, `The greatest frequency belongs to ${modalValue}, so the mode is ${modalValue}.`],
      shortcut: "Tally repetitions only until one value has a strictly higher count than every other value; no arithmetic total is required.",
      trap: "Do not answer with the frequency itself. If a value occurs three times, the mode is that value, not the number 3.",
    },
  };
}

function buildDraft(contractId: Sta001ContractId, seed: string, profile: Sta001ExamProfile): Draft {
  switch (contractId) {
    case "STAT-TEMP-001-SIMPLE-MEAN": return buildSimpleMean(seed, profile);
    case "STAT-TEMP-002-MISSING-OBSERVATION": return buildMissingObservation(seed, profile);
    case "STAT-TEMP-003-CORRECTED-MEAN": return buildCorrectedMean(seed, profile);
    case "STAT-TEMP-004-COMBINED-MEAN": return buildCombinedMean(seed, profile);
    case "STAT-TEMP-005-MEDIAN-RAW": return buildMedian(seed, profile);
    case "STAT-TEMP-006-MODE-RAW": return buildMode(seed, profile);
  }
}

function validateQuestion(question: Omit<Sta001Question, "validation">) {
  const checks: Sta001ValidationCheck[] = [];
  const add = (id: string, passed: boolean, message: string) => checks.push({ id, passed, message });
  add("FOUR_OPTIONS", question.options.length === 4, "SSC STAT-001 questions require exactly four options.");
  add("UNIQUE_OPTIONS", new Set(question.options).size === 4, "Displayed options must be unique.");
  add("ONE_CORRECT", question.optionMetadata.filter((option) => option.misconceptionId === "CORRECT").length === 1 && question.options[question.correctIndex] === question.answer, "Exactly one correct option must be bound to the answer.");
  add("OPTION_DERIVATIONS", question.optionMetadata.every((option) => option.derivation.length >= 24), "Every displayed option requires a meaningful derivation.");
  add("EXPLANATION_SPECIFICITY", question.explanation.keyIdea.length >= 50 && question.explanation.steps.length >= 2 && question.explanation.shortcut.length >= 35 && question.explanation.trap.length >= 35, "Learner explanation must contain specific reasoning, working, shortcut and trap guidance.");
  add("STEM_NATURALNESS", question.stem.length >= 35 && !/mock[- ]?test problem|textbook problem|competitive[- ]exam problem|template|generator|question library|ql[- ]?id/iu.test(question.stem), "Stem must be direct learner-facing exam prose without generator metadata.");
  add("LIFECYCLE_LOCK", !question.traceability.questionStudioDiscoverable && question.traceability.questionBankStatus === "NOT_STORED" && question.traceability.testEligibility === "INELIGIBLE" && !question.traceability.publiclyPublishable, "STAT-001 Phase 0 must remain review-only.");
  return { valid: checks.every((check) => check.passed), checks };
}

export function generateSta001Question(input: {
  seed?: string;
  examProfile?: Sta001ExamProfile;
  contractId?: Sta001ContractId;
} = {}): Sta001Question {
  const seed = input.seed ?? "STAT-001:P0";
  const examProfile = input.examProfile ?? "SSC_CGL_TIER_II";
  const contractId = input.contractId ?? pick(seededRandom(`${seed}:${examProfile}:contract`), STA001_CONTRACTS);
  const draft = buildDraft(contractId, seed, examProfile);
  const optionPackage = buildOptions(`${seed}:${examProfile}:${contractId}`, draft.answer, draft.candidates);
  const meta = CONTRACT_META[contractId];

  const withoutValidation: Omit<Sta001Question, "validation"> = {
    packageId: "STAT-001",
    questionId: `STAT-001-${hashSeed(`${seed}:${examProfile}:${contractId}`).toString(36)}`,
    seed,
    examProfile,
    contractId,
    solveMode: meta.solveMode,
    difficulty: meta.difficulty,
    language: "en",
    stem: draft.stem,
    options: optionPackage.options,
    optionMetadata: optionPackage.optionMetadata,
    correctIndex: optionPackage.correctIndex,
    answer: draft.answer,
    state: draft.state,
    explanation: draft.explanation,
    traceability: {
      packageId: "STAT-001",
      topic: "Statistics",
      subtopic: "Measures of Central Tendency",
      officialScope: "SSC_CGL_2026_STATISTICS_CENTRAL_TENDENCY",
      contractStatus: "TEMPORARY_REVIEW_CONTRACT",
      questionStudioDiscoverable: false,
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
    },
  };

  const validation = validateQuestion(withoutValidation);
  if (!validation.valid) {
    const failed = validation.checks.filter((check) => !check.passed).map((check) => check.id).join(", ");
    throw new Error(`STAT-001 validation failed: ${failed}`);
  }

  return { ...withoutValidation, validation };
}
