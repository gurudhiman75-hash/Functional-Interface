import { pick, ratioDisplay, seededRandom } from "../DI-001/exact";
import type {
  Di009Difficulty,
  Di009Explanation,
  Di009HistogramBin,
  Di009Stimulus,
  Di009TaskKind,
} from "./types";

export type Di009Candidate = Readonly<{
  text: string;
  misconceptionId: string;
  derivation: string;
}>;

export type Di009Draft = Readonly<{
  kind: Di009TaskKind;
  difficulty: Di009Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Di009Candidate[];
  explanation: Di009Explanation;
  evidence: Readonly<Record<string, number | string>>;
}>;

function formatWhole(numerator: number, denominator: number): string {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new Error("DI-009 received an invalid whole-number fraction.");
  }
  return String(Math.round(numerator / denominator));
}

function formatPercent(part: number, whole: number) {
  return `${formatWhole(part * 100, whole)}%`;
}

function interval(bin: Di009HistogramBin) {
  return `${bin.lower}–${bin.upper}`;
}

function rangeLabel(bins: readonly Di009HistogramBin[], start: number, end: number) {
  return `${bins[start]!.lower}–${bins[end]!.upper}`;
}

function totalFrequency(bins: readonly Di009HistogramBin[]) {
  return bins.reduce((sum, bin) => sum + bin.frequency, 0);
}

function sumRange(bins: readonly Di009HistogramBin[], start: number, end: number) {
  let total = 0;
  for (let index = start; index <= end; index += 1) total += bins[index]!.frequency;
  return total;
}

function cumulativeFrequencies(bins: readonly Di009HistogramBin[]) {
  let running = 0;
  return bins.map((bin) => {
    running += bin.frequency;
    return running;
  });
}

function modalIndexOf(bins: readonly Di009HistogramBin[]) {
  let modalIndex = 0;
  for (let index = 1; index < bins.length; index += 1) {
    if (bins[index]!.frequency > bins[modalIndex]!.frequency) modalIndex = index;
  }
  return modalIndex;
}

function firstCumulativeAtLeast(cumulative: readonly number[], target: number) {
  const index = cumulative.findIndex((value) => value >= target);
  if (index < 0) throw new Error("DI-009 cumulative target exceeded total frequency.");
  return index;
}

function surface(seed: string, kind: Di009TaskKind, variants: readonly string[]) {
  const indexed = variants.map((text, index) => ({ text, index }));
  return pick(seededRandom(`${seed}:${kind}:surface`), indexed);
}

function classAlternatives(bins: readonly Di009HistogramBin[], correctIndex: number): Di009Candidate[] {
  return bins
    .map((bin, index) => ({ bin, index }))
    .filter(({ index }) => index !== correctIndex)
    .map(({ bin, index }) => ({
      text: interval(bin),
      misconceptionId: `CHOOSE_OTHER_CLASS_${index}`,
      derivation: `Selects class ${interval(bin)} instead of the class identified by the required frequency reasoning.`,
    }));
}

function frequencyShiftCandidates(answer: number, step: number): Di009Candidate[] {
  const shifts = [-2, -1, 1, 2, 3] as const;
  return shifts
    .map((shift) => answer + shift * step)
    .filter((value) => value > 0)
    .map((value, index) => ({
      text: String(value),
      misconceptionId: `NEARBY_FREQUENCY_${index}`,
      derivation: "Uses a nearby histogram height instead of the required frequency calculation.",
    }));
}

function percentShiftCandidates(answerPart: number, total: number, step: number): Di009Candidate[] {
  return [answerPart - step, answerPart + step, answerPart + 2 * step, Math.max(step, answerPart - 2 * step)]
    .filter((part) => part > 0 && part < total)
    .map((part, index) => ({
      text: formatPercent(part, total),
      misconceptionId: `NEARBY_PART_PERCENT_${index}`,
      derivation: "Uses a nearby class frequency as the part while keeping the full histogram total as the denominator.",
    }));
}

function directFrequencyDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const targetIndex = pick(seededRandom(`${seed}:direct:index`), bins.map((_, index) => index));
  const target = bins[targetIndex]!;
  const s = surface(seed, "DIRECT_CLASS_FREQUENCY", [
    `How many ${stimulus.unit} are represented by the class interval ${interval(target)}?`,
    `What is the frequency of the class ${interval(target)}?`,
    `According to the histogram, the interval ${interval(target)} contains how many ${stimulus.unit}?`,
    `Read the frequency corresponding to ${interval(target)} from the histogram.`,
  ]);
  return {
    kind: "DIRECT_CLASS_FREQUENCY",
    difficulty: "Easy",
    stem: s.text,
    answer: String(target.frequency),
    candidates: [
      ...bins.filter((_, index) => index !== targetIndex).map((bin, index) => ({
        text: String(bin.frequency),
        misconceptionId: `READ_OTHER_BAR_${index}`,
        derivation: `Reads the height of class ${interval(bin)} instead of ${interval(target)}.`,
      })),
      ...frequencyShiftCandidates(target.frequency, 5),
    ],
    explanation: {
      keyIdea: "For equal class widths, the height of each histogram rectangle gives that class frequency.",
      steps: [`Locate the rectangle over ${interval(target)}.`, `Its height is ${target.frequency}.`],
    },
    evidence: { targetIndex, surfaceId: s.index },
  };
}

function totalFrequencyDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const total = totalFrequency(bins);
  const frequencies = bins.map((bin) => bin.frequency);
  const s = surface(seed, "TOTAL_FREQUENCY", [
    `How many ${stimulus.unit} are represented in the histogram altogether?`,
    `Find the total frequency represented by the histogram.`,
    `What is the total number of ${stimulus.unit} shown in all the class intervals?`,
  ]);
  return {
    kind: "TOTAL_FREQUENCY",
    difficulty: "Easy",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total - Math.max(...frequencies)), misconceptionId: "OMIT_TALLEST_CLASS", derivation: "Adds all classes except the highest-frequency class." },
      { text: String(total - frequencies[0]!), misconceptionId: "OMIT_FIRST_CLASS", derivation: "Leaves out the first class interval." },
      { text: String(total - frequencies.at(-1)!), misconceptionId: "OMIT_LAST_CLASS", derivation: "Leaves out the last class interval." },
      { text: String(Math.max(...frequencies)), misconceptionId: "USE_MAXIMUM_ONLY", derivation: "Reports only the tallest bar height instead of summing all frequencies." },
      { text: String(sumRange(bins, 0, Math.floor((bins.length - 1) / 2))), misconceptionId: "SUM_FIRST_HALF_ONLY", derivation: "Adds only the first half of the histogram." },
    ],
    explanation: {
      keyIdea: "The total frequency is the sum of the frequencies of all histogram classes.",
      steps: [`Add the bar heights: ${frequencies.join(" + ")} = ${total}.`],
    },
    evidence: { surfaceId: s.index },
  };
}

function combinedRangeDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const maxStart = Math.max(0, bins.length - 3);
  const start = pick(seededRandom(`${seed}:combined:start`), Array.from({ length: maxStart + 1 }, (_, index) => index));
  const width = pick(seededRandom(`${seed}:combined:width`), [2, 3] as const);
  const end = Math.min(bins.length - 1, start + width - 1);
  const answer = sumRange(bins, start, end);
  const s = surface(seed, "COMBINED_RANGE_TOTAL", [
    `How many ${stimulus.unit} lie in the range ${rangeLabel(bins, start, end)}?`,
    `Find the combined frequency for the interval ${rangeLabel(bins, start, end)}.`,
    `What is the total frequency of the classes from ${bins[start]!.lower} to ${bins[end]!.upper}?`,
    `The classes covering ${rangeLabel(bins, start, end)} together contain how many ${stimulus.unit}?`,
  ]);
  return {
    kind: "COMBINED_RANGE_TOTAL",
    difficulty: "Medium",
    stem: s.text,
    answer: String(answer),
    candidates: [
      { text: String(bins[start]!.frequency), misconceptionId: "FIRST_CLASS_ONLY", derivation: "Uses only the first class in the requested range." },
      { text: String(bins[end]!.frequency), misconceptionId: "LAST_CLASS_ONLY", derivation: "Uses only the final class in the requested range." },
      { text: String(Math.abs(bins[start]!.frequency - bins[end]!.frequency)), misconceptionId: "SUBTRACT_ENDPOINTS", derivation: "Subtracts endpoint bar heights instead of adding all frequencies in the range." },
      { text: String(start > 0 ? answer + bins[start - 1]!.frequency : answer + bins[Math.min(bins.length - 1, end + 1)]!.frequency), misconceptionId: "INCLUDE_NEIGHBOUR", derivation: "Includes one adjacent class outside the requested range." },
      ...frequencyShiftCandidates(answer, 5),
    ],
    explanation: {
      keyIdea: "Add the frequencies of every class whose base lies inside the stated range.",
      steps: [`Required frequencies = ${bins.slice(start, end + 1).map((bin) => bin.frequency).join(" + ")} = ${answer}.`],
    },
    evidence: { startIndex: start, endIndex: end, surfaceId: s.index },
  };
}

function aboveBoundaryDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const startIndex = pick(seededRandom(`${seed}:above:index`), Array.from({ length: bins.length - 2 }, (_, index) => index + 1));
  const boundary = bins[startIndex]!.lower;
  const answer = sumRange(bins, startIndex, bins.length - 1);
  const s = surface(seed, "ABOVE_BOUNDARY_TOTAL", [
    `How many ${stimulus.unit} are in classes starting at ${boundary} or above?`,
    `Find the total frequency for values from ${boundary} onwards.`,
    `According to the histogram, how many ${stimulus.unit} fall in the class intervals at or above ${boundary}?`,
  ]);
  return {
    kind: "ABOVE_BOUNDARY_TOTAL",
    difficulty: "Medium",
    stem: s.text,
    answer: String(answer),
    candidates: [
      { text: String(sumRange(bins, 0, startIndex - 1)), misconceptionId: "SUM_BELOW_INSTEAD", derivation: "Adds the classes below the boundary instead of those at or above it." },
      { text: String(sumRange(bins, startIndex + 1, bins.length - 1)), misconceptionId: "EXCLUDE_BOUNDARY_CLASS", derivation: "Starts one class too late and omits the class beginning at the boundary." },
      { text: String(bins[startIndex]!.frequency), misconceptionId: "BOUNDARY_CLASS_ONLY", derivation: "Uses only the class beginning at the boundary." },
      { text: String(totalFrequency(bins)), misconceptionId: "WHOLE_HISTOGRAM", derivation: "Uses the complete histogram total." },
      ...frequencyShiftCandidates(answer, 5),
    ],
    explanation: {
      keyIdea: "Start with the class whose lower boundary is the stated value, then add every frequency to its right.",
      steps: [`Frequencies from ${boundary} onwards = ${bins.slice(startIndex).map((bin) => bin.frequency).join(" + ")} = ${answer}.`],
    },
    evidence: { startIndex, boundary, surfaceId: s.index },
  };
}

function belowBoundaryDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const endExclusive = pick(seededRandom(`${seed}:below:index`), Array.from({ length: bins.length - 2 }, (_, index) => index + 2));
  const boundary = bins[endExclusive]!.lower;
  const answer = sumRange(bins, 0, endExclusive - 1);
  const s = surface(seed, "BELOW_BOUNDARY_TOTAL", [
    `How many ${stimulus.unit} are represented below ${boundary}?`,
    `Find the cumulative frequency for values less than ${boundary}.`,
    `What is the total frequency of all class intervals lying below ${boundary}?`,
  ]);
  return {
    kind: "BELOW_BOUNDARY_TOTAL",
    difficulty: "Medium",
    stem: s.text,
    answer: String(answer),
    candidates: [
      { text: String(sumRange(bins, endExclusive, bins.length - 1)), misconceptionId: "SUM_ABOVE_INSTEAD", derivation: "Adds classes at and above the boundary instead of classes below it." },
      { text: String(answer + bins[endExclusive]!.frequency), misconceptionId: "INCLUDE_BOUNDARY_CLASS", derivation: "Includes the first class beginning at the boundary even though the question asks for values below it." },
      { text: String(bins[endExclusive - 1]!.frequency), misconceptionId: "LAST_CLASS_ONLY", derivation: "Uses only the final class below the boundary." },
      { text: String(totalFrequency(bins)), misconceptionId: "WHOLE_HISTOGRAM", derivation: "Uses the complete histogram total." },
      ...frequencyShiftCandidates(answer, 5),
    ],
    explanation: {
      keyIdea: "Add the frequencies of all classes whose upper boundary does not exceed the stated cutoff.",
      steps: [`Frequencies below ${boundary} = ${bins.slice(0, endExclusive).map((bin) => bin.frequency).join(" + ")} = ${answer}.`],
    },
    evidence: { endExclusive, boundary, surfaceId: s.index },
  };
}

function rangeRatioDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const split = Math.max(2, Math.floor(bins.length / 2));
  const leftStart = 0;
  const leftEnd = split - 1;
  const rightStart = split;
  const rightEnd = bins.length - 1;
  const left = sumRange(bins, leftStart, leftEnd);
  const right = sumRange(bins, rightStart, rightEnd);
  const answer = ratioDisplay(left, right);
  const s = surface(seed, "RANGE_RATIO", [
    `What is the ratio of the frequency in ${rangeLabel(bins, leftStart, leftEnd)} to that in ${rangeLabel(bins, rightStart, rightEnd)}?`,
    `Find the ratio of the total frequency of the first ${split} classes to the remaining classes.`,
    `The combined frequency from ${bins[leftStart]!.lower} to ${bins[leftEnd]!.upper} is in what ratio to the combined frequency from ${bins[rightStart]!.lower} to ${bins[rightEnd]!.upper}?`,
  ]);
  const leftWithoutLast = sumRange(bins, leftStart, Math.max(leftStart, leftEnd - 1));
  const rightWithoutFirst = sumRange(bins, Math.min(rightEnd, rightStart + 1), rightEnd);
  return {
    kind: "RANGE_RATIO",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: ratioDisplay(right, left), misconceptionId: "REVERSE_RATIO", derivation: "Reverses the order of the two requested ranges." },
      { text: ratioDisplay(bins[leftEnd]!.frequency, bins[rightStart]!.frequency), misconceptionId: "USE_BOUNDARY_BARS_ONLY", derivation: "Uses only the two bars nearest the split instead of range totals." },
      { text: ratioDisplay(leftWithoutLast, right), misconceptionId: "OMIT_LEFT_CLASS", derivation: "Leaves one class out of the first range." },
      { text: ratioDisplay(left, rightWithoutFirst), misconceptionId: "OMIT_RIGHT_CLASS", derivation: "Leaves one class out of the second range." },
      { text: ratioDisplay(sumRange(bins, leftStart, Math.min(leftEnd + 1, rightEnd)), right), misconceptionId: "OVERLAP_SPLIT", derivation: "Counts the first class of the second range in both sides." },
      { text: ratioDisplay(left + bins[rightStart]!.frequency, Math.max(1, right - bins[rightStart]!.frequency)), misconceptionId: "MOVE_SPLIT_ONE_CLASS", derivation: "Places the split one class too far to the right." },
    ],
    explanation: {
      keyIdea: "Add the frequencies within each range first, then simplify the ratio of the two totals.",
      steps: [`First range total = ${left}.`, `Second range total = ${right}.`, `Required ratio = ${left}:${right} = ${answer}.`],
    },
    evidence: { leftStart, leftEnd, rightStart, rightEnd, surfaceId: s.index },
  };
}

function classShareDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const total = totalFrequency(bins);
  const targetIndex = pick(seededRandom(`${seed}:share:index`), bins.map((_, index) => index));
  const target = bins[targetIndex]!;
  const answer = formatPercent(target.frequency, total);
  const s = surface(seed, "CLASS_SHARE_OF_TOTAL", [
    `To the nearest whole percent, what percentage of the total frequency is represented by class ${interval(target)}?`,
    `Approximately what whole percentage of all ${stimulus.unit} fall in the interval ${interval(target)}?`,
    `Find the percentage share of class ${interval(target)} in the complete histogram, rounded to the nearest whole percent.`,
  ]);
  const neighbour = bins[targetIndex === bins.length - 1 ? targetIndex - 1 : targetIndex + 1]!;
  return {
    kind: "CLASS_SHARE_OF_TOTAL",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: formatPercent(neighbour.frequency, total), misconceptionId: "USE_NEIGHBOUR_CLASS", derivation: "Uses the frequency of an adjacent class as the numerator." },
      { text: formatPercent(target.frequency, Math.max(1, total - target.frequency)), misconceptionId: "EXCLUDE_TARGET_FROM_TOTAL", derivation: "Uses the total of the other classes as the denominator." },
      { text: formatPercent(total - target.frequency, total), misconceptionId: "USE_COMPLEMENT", derivation: "Finds the percentage outside the target class." },
      { text: `${target.frequency}%`, misconceptionId: "ATTACH_PERCENT_SIGN", derivation: "Treats the raw class frequency as a percentage." },
      ...percentShiftCandidates(target.frequency, total, 5),
    ],
    explanation: {
      keyIdea: "Use the class frequency as the part and the sum of all bar frequencies as the whole.",
      steps: [`Total frequency = ${total}.`, `Required percentage = ${target.frequency}/${total} × 100 ≈ ${answer} to the nearest whole percent.`],
    },
    evidence: { targetIndex, surfaceId: s.index },
  };
}

function frequencyDifferenceDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const pairs: [number, number][] = [];
  for (let left = 0; left < bins.length; left += 1) {
    for (let right = left + 1; right < bins.length; right += 1) {
      if (bins[left]!.frequency !== bins[right]!.frequency) pairs.push([left, right]);
    }
  }
  const [leftIndex, rightIndex] = pick(seededRandom(`${seed}:difference:pair`), pairs);
  const left = bins[leftIndex]!;
  const right = bins[rightIndex]!;
  const answerValue = Math.abs(left.frequency - right.frequency);
  const s = surface(seed, "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES", [
    `What is the difference between the frequencies of ${interval(left)} and ${interval(right)}?`,
    `By how much do the frequencies of the classes ${interval(left)} and ${interval(right)} differ?`,
    `Find the absolute difference between the two bar heights for ${interval(left)} and ${interval(right)}.`,
  ]);
  return {
    kind: "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES",
    difficulty: "Medium",
    stem: s.text,
    answer: String(answerValue),
    candidates: [
      { text: String(left.frequency + right.frequency), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two class frequencies instead of finding their difference." },
      { text: String(left.frequency), misconceptionId: "READ_LEFT_ONLY", derivation: "Reports the first bar height without comparing it." },
      { text: String(right.frequency), misconceptionId: "READ_RIGHT_ONLY", derivation: "Reports the second bar height without comparing it." },
      ...frequencyShiftCandidates(answerValue, 5),
    ],
    explanation: {
      keyIdea: "Read the two bar heights and subtract the smaller frequency from the larger one.",
      steps: [`Frequencies = ${left.frequency} and ${right.frequency}.`, `Difference = |${left.frequency} - ${right.frequency}| = ${answerValue}.`],
    },
    evidence: { leftIndex, rightIndex, surfaceId: s.index },
  };
}

function modalClassDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const modalIndex = modalIndexOf(bins);
  const modal = bins[modalIndex]!;
  const s = surface(seed, "MODAL_CLASS_IDENTIFICATION", [
    `Which class interval is the modal class?`,
    `Identify the class with the highest frequency.`,
    `Which interval corresponds to the tallest rectangle in the histogram?`,
  ]);
  return {
    kind: "MODAL_CLASS_IDENTIFICATION",
    difficulty: "Easy",
    stem: s.text,
    answer: interval(modal),
    candidates: classAlternatives(bins, modalIndex),
    explanation: {
      keyIdea: "The modal class is the class interval with the highest frequency.",
      steps: [`The highest bar has frequency ${modal.frequency}.`, `Its class interval is ${interval(modal)}.`],
    },
    evidence: { modalIndex, surfaceId: s.index },
  };
}

function medianClassDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const cumulative = cumulativeFrequencies(bins);
  const total = cumulative.at(-1)!;
  const target = total / 2;
  const observationPosition = Math.ceil(target);
  const medianIndex = firstCumulativeAtLeast(cumulative, target);
  const s = surface(seed, "MEDIAN_CLASS_IDENTIFICATION", [
    `Which class interval contains the median observation?`,
    `Identify the median class from the histogram.`,
    `In which class does the N/2-th observation lie?`,
    `Which interval is the median class for this frequency distribution?`,
  ]);
  return {
    kind: "MEDIAN_CLASS_IDENTIFICATION",
    difficulty: "Hard",
    stem: s.text,
    answer: interval(bins[medianIndex]!),
    candidates: classAlternatives(bins, medianIndex),
    explanation: {
      keyIdea: "Form cumulative frequencies and locate the first class whose cumulative frequency reaches or exceeds N/2.",
      steps: [`Total frequency N = ${total}. For cumulative-frequency location, use observation number ${observationPosition}.`, `The first cumulative frequency reaching this position is ${cumulative[medianIndex]}, in class ${interval(bins[medianIndex]!)}.`],
      workingTable: {
        headers: ["Class", "f", "Cumulative f"],
        rows: bins.map((bin, index) => [interval(bin), String(bin.frequency), String(cumulative[index])]),
      },
    },
    evidence: { medianIndex, total, surfaceId: s.index },
  };
}

function kthObservationDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const cumulative = cumulativeFrequencies(bins);
  const total = cumulative.at(-1)!;
  const fraction = pick(seededRandom(`${seed}:kth:fraction`), [
    { numerator: 1, denominator: 4 },
    { numerator: 2, denominator: 5 },
    { numerator: 3, denominator: 5 },
    { numerator: 3, denominator: 4 },
  ] as const);
  const rank = Math.max(1, Math.ceil((total * fraction.numerator) / fraction.denominator));
  const targetIndex = firstCumulativeAtLeast(cumulative, rank);
  const s = surface(seed, "KTH_OBSERVATION_CLASS", [
    `The ${rank}th observation lies in which class interval?`,
    `Which class contains observation number ${rank} when the data are arranged in ascending order?`,
    `Locate the class interval containing the ${rank}th item of the distribution.`,
  ]);
  return {
    kind: "KTH_OBSERVATION_CLASS",
    difficulty: "Hard",
    stem: s.text,
    answer: interval(bins[targetIndex]!),
    candidates: classAlternatives(bins, targetIndex),
    explanation: {
      keyIdea: "Use cumulative frequency to see where the required observation number is first reached.",
      steps: [`Required position = ${rank}.`, `The first cumulative frequency at least ${rank} is ${cumulative[targetIndex]}, so the observation lies in ${interval(bins[targetIndex]!)}.`],
      workingTable: {
        headers: ["Class", "Cumulative f"],
        rows: bins.map((bin, index) => [interval(bin), String(cumulative[index])]),
      },
    },
    evidence: { rank, targetIndex, surfaceId: s.index },
  };
}

function groupedMeanDraft(seed: string, stimulus: Di009Stimulus): Di009Draft {
  const bins = stimulus.bins;
  const total = totalFrequency(bins);
  const doubledWeighted = bins.reduce((sum, bin) => sum + (bin.lower + bin.upper) * bin.frequency, 0);
  const denominator = 2 * total;
  const answer = formatWhole(doubledWeighted, denominator);
  const weightedLower = formatWhole(bins.reduce((sum, bin) => sum + bin.lower * bin.frequency, 0), total);
  const weightedUpper = formatWhole(bins.reduce((sum, bin) => sum + bin.upper * bin.frequency, 0), total);
  const unweightedMidpointMean = formatWhole(bins.reduce((sum, bin) => sum + bin.lower + bin.upper, 0), 2 * bins.length);
  const s = surface(seed, "APPROX_GROUPED_MEAN_FROM_HISTOGRAM", [
    `Using class marks, find the approximate mean of the distribution to the nearest whole number.`,
    `What is the approximate arithmetic mean represented by this histogram, rounded to the nearest whole number?`,
    `Calculate the grouped mean using the midpoint of each class and give the nearest whole number.`,
    `Estimate the mean from the histogram by the class-mark method, to the nearest whole number.`,
  ]);
  return {
    kind: "APPROX_GROUPED_MEAN_FROM_HISTOGRAM",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: weightedLower, misconceptionId: "USE_LOWER_LIMITS", derivation: "Uses lower class limits instead of class marks." },
      { text: weightedUpper, misconceptionId: "USE_UPPER_LIMITS", derivation: "Uses upper class limits instead of class marks." },
      { text: unweightedMidpointMean, misconceptionId: "IGNORE_FREQUENCIES", derivation: "Averages the class marks without weighting them by frequency." },
      { text: formatWhole(doubledWeighted, 2 * bins.length), misconceptionId: "DIVIDE_BY_CLASS_COUNT", derivation: "Divides the weighted total by the number of classes instead of total frequency." },
      { text: formatWhole(doubledWeighted + stimulus.classWidth * total, 2 * total), misconceptionId: "SHIFT_CLASS_MARKS_UP", derivation: "Uses class marks shifted upward by half a class width." },
    ],
    explanation: {
      keyIdea: "Use each class midpoint x with its frequency f, then compute Σfx / Σf.",
      steps: [`Σf = ${total}.`, `Σfx = ${doubledWeighted / 2}.`, `Mean = Σfx/Σf ≈ ${answer} to the nearest whole number.`],
      workingTable: {
        headers: ["Class", "f", "Class mark x", "fx"],
        rows: bins.map((bin) => {
          const midpointNumerator = bin.lower + bin.upper;
          return [interval(bin), String(bin.frequency), String(midpointNumerator / 2), String((midpointNumerator * bin.frequency) / 2)];
        }),
      },
    },
    evidence: { total, doubledWeighted, surfaceId: s.index },
  };
}

function groupedModeDraft(seed: string, stimulus: Di009Stimulus): Di009Draft | null {
  const bins = stimulus.bins;
  const modalIndex = modalIndexOf(bins);
  if (modalIndex <= 0 || modalIndex >= bins.length - 1) return null;
  const modal = bins[modalIndex]!;
  const f0 = bins[modalIndex - 1]!.frequency;
  const f1 = modal.frequency;
  const f2 = bins[modalIndex + 1]!.frequency;
  const denominator = 2 * f1 - f0 - f2;
  if (denominator <= 0) return null;
  const numerator = modal.lower * denominator + (f1 - f0) * stimulus.classWidth;
  const answer = formatWhole(numerator, denominator);
  const midpoint = formatWhole(modal.lower + modal.upper, 2);
  const lowerShift = formatWhole((modal.lower - stimulus.classWidth) * denominator + (f1 - f0) * stimulus.classWidth, denominator);
  const wrongSwap = formatWhole(modal.lower * denominator + (f1 - f2) * stimulus.classWidth, denominator);
  const s = surface(seed, "APPROX_GROUPED_MODE_FROM_HISTOGRAM", [
    `Using the grouped-data mode formula, estimate the mode to the nearest whole number.`,
    `Find the approximate mode of the distribution, rounded to the nearest whole number.`,
    `Calculate the grouped mode using the modal class and its two neighbouring frequencies, and give the nearest whole number.`,
  ]);
  return {
    kind: "APPROX_GROUPED_MODE_FROM_HISTOGRAM",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: midpoint, misconceptionId: "USE_MODAL_MIDPOINT", derivation: "Uses the midpoint of the modal class instead of grouped interpolation." },
      { text: String(modal.lower), misconceptionId: "USE_MODAL_LOWER_LIMIT", derivation: "Reports the lower boundary of the modal class." },
      { text: String(modal.upper), misconceptionId: "USE_MODAL_UPPER_LIMIT", derivation: "Reports the upper boundary of the modal class." },
      { text: wrongSwap, misconceptionId: "SWAP_F0_F2_DIFFERENCE", derivation: "Uses f1−f2 in the numerator instead of f1−f0." },
      { text: lowerShift, misconceptionId: "USE_PREVIOUS_CLASS_LOWER", derivation: "Starts interpolation from the previous class lower boundary." },
    ],
    explanation: {
      keyIdea: "For grouped data, use Mode = l + [(f1−f0)/(2f1−f0−f2)]h.",
      steps: [`Modal class = ${interval(modal)}.`, `l = ${modal.lower}, h = ${stimulus.classWidth}, f0 = ${f0}, f1 = ${f1}, f2 = ${f2}.`, `Mode = ${modal.lower} + [(${f1}−${f0})/(2×${f1}−${f0}−${f2})]×${stimulus.classWidth} ≈ ${answer} to the nearest whole number.`],
      workingTable: {
        headers: ["Class", "Frequency", "Role"],
        rows: [
          [interval(bins[modalIndex - 1]!), String(f0), "f0"],
          [interval(modal), String(f1), "f1 (modal class)"],
          [interval(bins[modalIndex + 1]!), String(f2), "f2"],
        ],
      },
    },
    evidence: { modalIndex, f0, f1, f2, denominator, numerator, surfaceId: s.index },
  };
}

export function buildDi009Drafts(seed: string, stimulus: Di009Stimulus): Di009Draft[] {
  const drafts: (Di009Draft | null)[] = [
    directFrequencyDraft(seed, stimulus),
    totalFrequencyDraft(seed, stimulus),
    combinedRangeDraft(seed, stimulus),
    aboveBoundaryDraft(seed, stimulus),
    belowBoundaryDraft(seed, stimulus),
    rangeRatioDraft(seed, stimulus),
    classShareDraft(seed, stimulus),
    frequencyDifferenceDraft(seed, stimulus),
    modalClassDraft(seed, stimulus),
    medianClassDraft(seed, stimulus),
    kthObservationDraft(seed, stimulus),
    groupedMeanDraft(seed, stimulus),
    groupedModeDraft(seed, stimulus),
  ];
  return drafts.filter((draft): draft is Di009Draft => draft !== null);
}
