import { pick, seededRandom } from "../DI-001/exact";
import type { Di010Difficulty, Di010Explanation, Di010Stimulus, Di010TaskKind } from "./types";

export type Di010Candidate = Readonly<{ text: string; misconceptionId: string; derivation: string }>;
export type Di010Draft = Readonly<{
  kind: Di010TaskKind;
  difficulty: Di010Difficulty;
  stem: string;
  answer: string;
  candidates: readonly Di010Candidate[];
  explanation: Di010Explanation;
  evidence: Readonly<Record<string, number | string>>;
}>;

function fmt(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2)));
}

function interval(stimulus: Di010Stimulus, index: number) {
  const item = stimulus.classes[index]!;
  return `${fmt(item.lower)}–${fmt(item.upper)}`;
}

function coordinate(x: number, y: number) {
  return `(${fmt(x)}, ${fmt(y)})`;
}

function surface(seed: string, kind: Di010TaskKind, values: readonly string[]) {
  const random = seededRandom(`${seed}:${kind}:surface`);
  const index = Math.floor(random() * values.length);
  return { text: values[index]!, id: index };
}

function targetIndex(seed: string, stimulus: Di010Stimulus, suffix: string) {
  const random = seededRandom(`${seed}:${suffix}`);
  return Math.floor(random() * stimulus.classes.length);
}

function intervalPhrase(stimulus: Di010Stimulus, index: number) {
  const item = stimulus.classes[index]!;
  if (stimulus.title === "Marks of students") return `students scoring ${fmt(item.lower)} or more but less than ${fmt(item.upper)} marks`;
  if (stimulus.title === "Travel time of employees") return `employees whose travel time is ${fmt(item.lower)} minutes or more but less than ${fmt(item.upper)} minutes`;
  if (stimulus.title === "Weights in a fitness survey") return `persons weighing ${fmt(item.lower)} kg or more but less than ${fmt(item.upper)} kg`;
  if (stimulus.title === "Heights in a sports group") return `players with height ${fmt(item.lower)} cm or more but less than ${fmt(item.upper)} cm`;
  if (stimulus.title === "Daily wages of workers") return `workers earning ₹${fmt(item.lower)} or more but less than ₹${fmt(item.upper)} per day`;
  if (stimulus.title === "Ages of workers") return `workers aged ${fmt(item.lower)} years or more but less than ${fmt(item.upper)} years`;
  return `${stimulus.unit} in the class ${interval(stimulus, index)}`;
}

function spanPhrase(stimulus: Di010Stimulus, start: number, end: number) {
  const lower = stimulus.classes[start]!.lower;
  const upper = stimulus.classes[end]!.upper;
  if (stimulus.title === "Marks of students") return `students scoring from ${fmt(lower)} to less than ${fmt(upper)} marks`;
  if (stimulus.title === "Travel time of employees") return `employees with travel time from ${fmt(lower)} to less than ${fmt(upper)} minutes`;
  if (stimulus.title === "Weights in a fitness survey") return `persons weighing from ${fmt(lower)} kg to less than ${fmt(upper)} kg`;
  if (stimulus.title === "Heights in a sports group") return `players with height from ${fmt(lower)} cm to less than ${fmt(upper)} cm`;
  if (stimulus.title === "Daily wages of workers") return `workers earning from ₹${fmt(lower)} to less than ₹${fmt(upper)} per day`;
  if (stimulus.title === "Ages of workers") return `workers aged from ${fmt(lower)} to less than ${fmt(upper)} years`;
  return `${stimulus.unit} from ${fmt(lower)} to less than ${fmt(upper)}`;
}

function percentage(numerator: number, denominator: number) {
  return `${Number(((numerator / denominator) * 100).toFixed(2))}%`;
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a || 1;
}

function ratio(left: number, right: number) {
  const divisor = gcd(left, right);
  return `${left / divisor}:${right / divisor}`;
}

function constructionProperty(seed: string): Di010Draft {
  const s = surface(seed, "CONSTRUCTION_PROPERTY", [
    "Which statement correctly describes a frequency polygon?",
    "Which of the following is true for the frequency polygon shown?",
    "How are the main plotted points of a frequency polygon obtained?",
  ]);
  return {
    kind: "CONSTRUCTION_PROPERTY",
    difficulty: "Easy",
    stem: s.text,
    answer: "Frequencies are plotted against class marks.",
    candidates: [
      { text: "Cumulative frequencies are plotted against upper class boundaries.", misconceptionId: "CONFUSE_WITH_OGIVE", derivation: "Describes an ogive rather than a frequency polygon." },
      { text: "Frequencies are plotted against lower class limits only.", misconceptionId: "USE_LOWER_LIMITS", derivation: "Uses lower class limits instead of class marks." },
      { text: "Frequencies are plotted against class boundaries.", misconceptionId: "USE_CLASS_BOUNDARIES", derivation: "Uses class boundaries instead of class midpoints." },
    ],
    explanation: {
      keyIdea: "In a frequency polygon, each class is represented by its class mark and the corresponding frequency.",
      steps: ["The x-coordinate is the class mark (midpoint).", "The y-coordinate is the class frequency.", "The plotted points are joined by straight line segments."],
    },
    evidence: { surfaceId: s.id },
  };
}

function readClassFrequency(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "read-context-index");
  const item = stimulus.classes[index]!;
  const previous = stimulus.classes[Math.max(0, index - 1)]!.frequency;
  const next = stimulus.classes[Math.min(stimulus.classes.length - 1, index + 1)]!.frequency;
  const phrase = intervalPhrase(stimulus, index);
  const s = surface(seed, "READ_CLASS_FREQUENCY_CONTEXT", [
    `According to the graph, how many ${phrase}?`,
    `What is the number of ${phrase} shown by the polygon?`,
    `The point for the class ${interval(stimulus, index)} represents how many ${stimulus.unit}?`,
  ]);
  return {
    kind: "READ_CLASS_FREQUENCY_CONTEXT",
    difficulty: "Easy",
    stem: s.text,
    answer: String(item.frequency),
    candidates: [
      { text: String(previous), misconceptionId: "READ_PREVIOUS_CLASS", derivation: "Reads the frequency of the previous class instead of the named class." },
      { text: String(next), misconceptionId: "READ_NEXT_CLASS", derivation: "Reads the frequency of the next class instead of the named class." },
      { text: String(item.frequency + 5), misconceptionId: "READ_NEARBY_GRID_LEVEL", derivation: "Reads the next nearby grid value instead of the plotted frequency." },
    ],
    explanation: { keyIdea: "Locate the class on the x-axis and read the frequency of its plotted point.", steps: [`For ${interval(stimulus, index)}, the plotted frequency is ${item.frequency}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function modalClass(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const maxFrequency = Math.max(...stimulus.classes.map((item) => item.frequency));
  const index = stimulus.classes.findIndex((item) => item.frequency === maxFrequency);
  const s = surface(seed, "MODAL_CLASS_FROM_POLYGON", [
    "Which class interval has the highest frequency?",
    "Which class is represented by the highest point of the polygon?",
    "Identify the modal class from the frequency polygon.",
  ]);
  const alternatives = [index - 2, index - 1, index + 1, index + 2, 0, stimulus.classes.length - 1]
    .filter((candidate, position, values) => candidate >= 0 && candidate < stimulus.classes.length && candidate !== index && values.indexOf(candidate) === position)
    .slice(0, 3);
  return {
    kind: "MODAL_CLASS_FROM_POLYGON",
    difficulty: "Easy",
    stem: s.text,
    answer: interval(stimulus, index),
    candidates: alternatives.map((candidateIndex, optionIndex) => ({ text: interval(stimulus, candidateIndex), misconceptionId: `NEARBY_MODAL_CLASS_${optionIndex}`, derivation: "Chooses another visible class instead of the one at the highest point." })),
    explanation: { keyIdea: "The modal class is the class interval with the greatest frequency.", steps: [`The highest frequency is ${maxFrequency}.`, `That point belongs to the class ${interval(stimulus, index)}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function classIntervalFromMark(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "mark-to-class-index");
  const item = stimulus.classes[index]!;
  const width = stimulus.classWidth;
  const s = surface(seed, "CLASS_INTERVAL_FROM_MARK", [
    `The polygon has a point at x = ${fmt(item.classMark)}. Which class interval does this point represent?`,
    `Which class interval has class mark ${fmt(item.classMark)}?`,
    `A plotted point uses class mark ${fmt(item.classMark)}. Identify its class interval.`,
  ]);
  return {
    kind: "CLASS_INTERVAL_FROM_MARK",
    difficulty: "Easy",
    stem: s.text,
    answer: interval(stimulus, index),
    candidates: [
      { text: `${fmt(item.lower - width / 2)}–${fmt(item.classMark)}`, misconceptionId: "TREAT_MARK_AS_UPPER_LIMIT", derivation: "Treats the class mark as the upper class limit." },
      { text: `${fmt(item.classMark)}–${fmt(item.upper + width / 2)}`, misconceptionId: "TREAT_MARK_AS_LOWER_LIMIT", derivation: "Treats the class mark as the lower class limit." },
      { text: `${fmt(item.lower - width)}–${fmt(item.upper - width)}`, misconceptionId: "SHIFT_TO_PREVIOUS_CLASS", derivation: "Moves one full class width to the previous interval." },
    ],
    explanation: { keyIdea: "The class mark is the midpoint of its class interval.", steps: [`Half the class width is ${fmt(width / 2)}.`, `${fmt(item.classMark)} − ${fmt(width / 2)} = ${fmt(item.lower)} and ${fmt(item.classMark)} + ${fmt(width / 2)} = ${fmt(item.upper)}.`, `So the class interval is ${interval(stimulus, index)}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function totalFrequency(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const first = stimulus.classes[0]!.frequency;
  const last = stimulus.classes[stimulus.classes.length - 1]!.frequency;
  const s = surface(seed, "TOTAL_FREQUENCY_FROM_POLYGON", [
    `How many ${stimulus.unit} are represented by the graph in all?`,
    `Find the total number of ${stimulus.unit} represented by all the classes together.`,
    `What is the total frequency represented by the polygon?`,
  ]);
  return {
    kind: "TOTAL_FREQUENCY_FROM_POLYGON",
    difficulty: "Medium",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total - first), misconceptionId: "OMIT_FIRST_CLASS", derivation: "Adds all class frequencies except the first class." },
      { text: String(total - last), misconceptionId: "OMIT_LAST_CLASS", derivation: "Adds all class frequencies except the last class." },
      { text: String(total + stimulus.classWidth), misconceptionId: "ADD_CLASS_WIDTH", derivation: "Incorrectly adds the class width to the total frequency." },
    ],
    explanation: { keyIdea: "The total represented is the sum of the frequencies of all plotted classes.", steps: [`Total = ${stimulus.classes.map((item) => item.frequency).join(" + ")} = ${total}.`] },
    evidence: { total, surfaceId: s.id },
  };
}

function consecutiveRangeTotal(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const random = seededRandom(`${seed}:context-range-total`);
  const span = stimulus.classes.length >= 7 && random() > 0.5 ? 3 : 2;
  const start = Math.floor(random() * (stimulus.classes.length - span + 1));
  const end = start + span - 1;
  const total = stimulus.classes.slice(start, end + 1).reduce((sum, item) => sum + item.frequency, 0);
  const before = stimulus.classes[Math.max(0, start - 1)]!.frequency;
  const after = stimulus.classes[Math.min(stimulus.classes.length - 1, end + 1)]!.frequency;
  const phrase = spanPhrase(stimulus, start, end);
  const s = surface(seed, "CONSECUTIVE_RANGE_TOTAL_CONTEXT", [
    `According to the graph, how many ${phrase}?`,
    `Find the number of ${phrase}.`,
    `What is the combined frequency for ${phrase}?`,
  ]);
  return {
    kind: "CONSECUTIVE_RANGE_TOTAL_CONTEXT",
    difficulty: "Medium",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total + before), misconceptionId: "INCLUDE_PREVIOUS_CLASS", derivation: "Includes one class immediately before the requested range." },
      { text: String(total + after), misconceptionId: "INCLUDE_NEXT_CLASS", derivation: "Includes one class immediately after the requested range." },
      { text: String(Math.max(1, total - stimulus.classes[start]!.frequency)), misconceptionId: "OMIT_FIRST_CLASS_IN_RANGE", derivation: "Leaves out the first class that belongs to the requested range." },
    ],
    explanation: { keyIdea: "Add the frequencies only for the classes that fall inside the stated range.", steps: [`Required frequencies: ${stimulus.classes.slice(start, end + 1).map((item) => item.frequency).join(" + ")}.`, `Total = ${total}.`] },
    evidence: { startIndex: start, endIndex: end, surfaceId: s.id },
  };
}

function differentPair(seed: string, stimulus: Di010Stimulus) {
  const random = seededRandom(`${seed}:context-difference`);
  const candidates: Array<[number, number]> = [];
  for (let left = 0; left < stimulus.classes.length; left += 1) {
    for (let right = left + 1; right < stimulus.classes.length; right += 1) {
      if (stimulus.classes[left]!.frequency !== stimulus.classes[right]!.frequency) candidates.push([left, right]);
    }
  }
  return pick(random, candidates);
}

function frequencyDifference(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const [aIndex, bIndex] = differentPair(seed, stimulus);
  const a = stimulus.classes[aIndex]!;
  const b = stimulus.classes[bIndex]!;
  const highIndex = a.frequency > b.frequency ? aIndex : bIndex;
  const lowIndex = highIndex === aIndex ? bIndex : aIndex;
  const high = stimulus.classes[highIndex]!;
  const low = stimulus.classes[lowIndex]!;
  const difference = high.frequency - low.frequency;
  const highPhrase = intervalPhrase(stimulus, highIndex);
  const lowPhrase = intervalPhrase(stimulus, lowIndex);
  const s = surface(seed, "FREQUENCY_DIFFERENCE_CONTEXT", [
    `How many more ${highPhrase} are there than ${lowPhrase}?`,
    `By how much does the number of ${highPhrase} exceed the number of ${lowPhrase}?`,
    `Find the difference between the frequencies for ${interval(stimulus, highIndex)} and ${interval(stimulus, lowIndex)}.`,
  ]);
  return {
    kind: "FREQUENCY_DIFFERENCE_CONTEXT",
    difficulty: "Medium",
    stem: s.text,
    answer: String(difference),
    candidates: [
      { text: String(high.frequency + low.frequency), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two class frequencies instead of finding how much one exceeds the other." },
      { text: String(high.frequency), misconceptionId: "REPORT_HIGHER_FREQUENCY", derivation: "Reports the larger frequency itself instead of the difference." },
      { text: String(Math.abs(difference - 5) || difference + 5), misconceptionId: "NEARBY_READING_ERROR", derivation: "Uses a nearby graph reading and makes a five-unit error." },
    ],
    explanation: { keyIdea: "Read the two frequencies and subtract the smaller one from the larger one.", steps: [`The frequencies are ${high.frequency} and ${low.frequency}.`, `Difference = ${high.frequency} − ${low.frequency} = ${difference}.`] },
    evidence: { highIndex, lowIndex, surfaceId: s.id },
  };
}

function classShare(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "class-share-index");
  const item = stimulus.classes[index]!;
  const total = stimulus.classes.reduce((sum, current) => sum + current.frequency, 0);
  const answer = percentage(item.frequency, total);
  const neighbor = stimulus.classes[index === stimulus.classes.length - 1 ? index - 1 : index + 1]!;
  const s = surface(seed, "CLASS_SHARE_OF_TOTAL", [
    `What percentage of all ${stimulus.unit} are in the class ${interval(stimulus, index)}?`,
    `The ${interval(stimulus, index)} class accounts for what percentage of the total ${stimulus.unit}?`,
    `Approximately what percentage of all ${stimulus.unit} are ${intervalPhrase(stimulus, index)}?`,
  ]);
  return {
    kind: "CLASS_SHARE_OF_TOTAL",
    difficulty: "Medium",
    stem: s.text,
    answer,
    candidates: [
      { text: percentage(neighbor.frequency, total), misconceptionId: "USE_NEIGHBOR_CLASS", derivation: "Uses the frequency of an adjacent class while keeping the correct total." },
      { text: percentage(item.frequency, Math.max(1, total - item.frequency)), misconceptionId: "EXCLUDE_TARGET_FROM_TOTAL", derivation: "Removes the target class from the denominator instead of using the full total." },
      { text: percentage(item.frequency, Math.max(...stimulus.classes.map((current) => current.frequency))), misconceptionId: "USE_MAX_FREQUENCY_AS_TOTAL", derivation: "Divides by the largest single class frequency instead of the total frequency." },
    ],
    explanation: { keyIdea: "Use the class frequency as the part and the sum of all class frequencies as the whole.", steps: [`Total frequency = ${total}.`, `Required percentage = ${item.frequency}/${total} × 100 = ${answer}.`] },
    evidence: { targetIndex: index, total, surfaceId: s.id },
  };
}

function histogramBarHeight(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "histogram-height-index");
  const item = stimulus.classes[index]!;
  const previous = stimulus.classes[Math.max(0, index - 1)]!.frequency;
  const next = stimulus.classes[Math.min(stimulus.classes.length - 1, index + 1)]!.frequency;
  const s = surface(seed, "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON", [
    `If the same data are drawn as a histogram, what will be the height of the rectangle for ${interval(stimulus, index)}?`,
    `The polygon is converted into a histogram. What height should the bar for ${interval(stimulus, index)} have?`,
    `In the equivalent histogram, what frequency will be represented by the class ${interval(stimulus, index)}?`,
  ]);
  return {
    kind: "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON",
    difficulty: "Medium",
    stem: s.text,
    answer: String(item.frequency),
    candidates: [
      { text: String(previous), misconceptionId: "USE_PREVIOUS_POLYGON_POINT", derivation: "Uses the neighboring point to the left as the histogram bar height." },
      { text: String(next), misconceptionId: "USE_NEXT_POLYGON_POINT", derivation: "Uses the neighboring point to the right as the histogram bar height." },
      { text: String(item.classMark), misconceptionId: "CONFUSE_CLASS_MARK_WITH_HEIGHT", derivation: "Uses the class mark as the bar height instead of the frequency." },
    ],
    explanation: { keyIdea: "A histogram and its frequency polygon represent the same class frequencies.", steps: [`For ${interval(stimulus, index)}, the polygon frequency is ${item.frequency}.`, `So the corresponding histogram rectangle has height ${item.frequency}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function zeroEndpoints(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const first = stimulus.classes[0]!;
  const last = stimulus.classes[stimulus.classes.length - 1]!;
  const left = first.classMark - stimulus.classWidth;
  const right = last.classMark + stimulus.classWidth;
  const s = surface(seed, "ZERO_CLOSING_ENDPOINTS", [
    "If this polygon is obtained from the corresponding histogram, which pair of zero-frequency points should be used to close it?",
    "What should be the starting and ending zero-frequency points of the line diagram?",
    "Which two zero-frequency points are needed to complete the frequency polygon?",
  ]);
  return {
    kind: "ZERO_CLOSING_ENDPOINTS",
    difficulty: "Hard",
    stem: s.text,
    answer: `${coordinate(left, 0)} and ${coordinate(right, 0)}`,
    candidates: [
      { text: `${coordinate(first.classMark - stimulus.classWidth / 2, 0)} and ${coordinate(last.classMark + stimulus.classWidth / 2, 0)}`, misconceptionId: "HALF_WIDTH_CLOSURE", derivation: "Moves only half a class width outside the first and last class marks." },
      { text: `${coordinate(first.classMark, 0)} and ${coordinate(last.classMark, 0)}`, misconceptionId: "CLOSE_AT_DATA_MARKS", derivation: "Drops the first and last data class marks directly to zero frequency." },
      { text: `${coordinate(first.lower, 0)} and ${coordinate(last.upper, 0)}`, misconceptionId: "CLOSE_AT_BOUNDARIES", derivation: "Uses the outer class boundaries instead of the midpoints of zero-frequency adjoining classes." },
    ],
    explanation: {
      keyIdea: "To close a frequency polygon, add one imaginary class of the same width at each end with frequency zero.",
      steps: [`Class width = ${fmt(stimulus.classWidth)}.`, `Left closing class mark = ${fmt(first.classMark)} − ${fmt(stimulus.classWidth)} = ${fmt(left)}.`, `Right closing class mark = ${fmt(last.classMark)} + ${fmt(stimulus.classWidth)} = ${fmt(right)}.`, `Hence the points are ${coordinate(left, 0)} and ${coordinate(right, 0)}.`],
    },
    evidence: { leftEndpoint: left, rightEndpoint: right, surfaceId: s.id },
  };
}

function rangeRatio(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const random = seededRandom(`${seed}:range-ratio-v2`);
  const pairs: Array<{ leftStart: number; rightStart: number; leftTotal: number; rightTotal: number }> = [];
  for (let leftStart = 0; leftStart <= stimulus.classes.length - 4; leftStart += 1) {
    for (let rightStart = leftStart + 2; rightStart <= stimulus.classes.length - 2; rightStart += 1) {
      const leftTotal = stimulus.classes.slice(leftStart, leftStart + 2).reduce((sum, item) => sum + item.frequency, 0);
      const rightTotal = stimulus.classes.slice(rightStart, rightStart + 2).reduce((sum, item) => sum + item.frequency, 0);
      if (leftTotal !== rightTotal) pairs.push({ leftStart, rightStart, leftTotal, rightTotal });
    }
  }
  const chosen = pick(random, pairs);
  const leftEnd = chosen.leftStart + 1;
  const rightEnd = chosen.rightStart + 1;
  const answer = ratio(chosen.leftTotal, chosen.rightTotal);
  const s = surface(seed, "RANGE_RATIO_FROM_POLYGON", [
    `What is the ratio of the number of ${spanPhrase(stimulus, chosen.leftStart, leftEnd)} to the number of ${spanPhrase(stimulus, chosen.rightStart, rightEnd)}?`,
    `Find the ratio of the total frequency from ${interval(stimulus, chosen.leftStart)} to ${interval(stimulus, leftEnd)} to that from ${interval(stimulus, chosen.rightStart)} to ${interval(stimulus, rightEnd)}.`,
    `Compare the totals in the two ranges ${interval(stimulus, chosen.leftStart)}–${interval(stimulus, leftEnd)} and ${interval(stimulus, chosen.rightStart)}–${interval(stimulus, rightEnd)}. What is their ratio in the same order?`,
  ]);
  return {
    kind: "RANGE_RATIO_FROM_POLYGON",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: ratio(chosen.rightTotal, chosen.leftTotal), misconceptionId: "REVERSE_RANGE_RATIO", derivation: "Reverses the order of the two requested range totals." },
      { text: ratio(stimulus.classes[chosen.leftStart]!.frequency, stimulus.classes[chosen.rightStart]!.frequency), misconceptionId: "USE_FIRST_CLASS_ONLY", derivation: "Uses only the first class in each two-class range." },
      { text: ratio(chosen.leftTotal - stimulus.classes[leftEnd]!.frequency, chosen.rightTotal), misconceptionId: "OMIT_SECOND_CLASS_FIRST_RANGE", derivation: "Omits the second class from the first requested range." },
    ],
    explanation: { keyIdea: "First add the frequencies in each requested range, then simplify the ratio of the two totals.", steps: [`First range total = ${stimulus.classes[chosen.leftStart]!.frequency} + ${stimulus.classes[leftEnd]!.frequency} = ${chosen.leftTotal}.`, `Second range total = ${stimulus.classes[chosen.rightStart]!.frequency} + ${stimulus.classes[rightEnd]!.frequency} = ${chosen.rightTotal}.`, `Ratio = ${chosen.leftTotal}:${chosen.rightTotal} = ${answer}.`] },
    evidence: { leftStart: chosen.leftStart, rightStart: chosen.rightStart, leftTotal: chosen.leftTotal, rightTotal: chosen.rightTotal, surfaceId: s.id },
  };
}

function groupedMean(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const weighted = stimulus.classes.reduce((sum, item) => sum + item.classMark * item.frequency, 0);
  const answerNumber = Number((weighted / total).toFixed(2));
  const answer = fmt(answerNumber);
  const simpleMean = Number((stimulus.classes.reduce((sum, item) => sum + item.classMark, 0) / stimulus.classes.length).toFixed(2));
  const lowerMean = Number((stimulus.classes.reduce((sum, item) => sum + item.lower * item.frequency, 0) / total).toFixed(2));
  const upperMean = Number((stimulus.classes.reduce((sum, item) => sum + item.upper * item.frequency, 0) / total).toFixed(2));
  const s = surface(seed, "GROUPED_MEAN_FROM_POLYGON", [
    `Using the class marks, what is the approximate mean value represented by the frequency polygon?`,
    `Find the grouped mean of the distribution shown in the polygon, using class marks.`,
    `What is the approximate arithmetic mean of the grouped data represented by the polygon?`,
  ]);
  return {
    kind: "GROUPED_MEAN_FROM_POLYGON",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: fmt(simpleMean), misconceptionId: "UNWEIGHTED_CLASS_MARK_MEAN", derivation: "Averages the class marks without weighting them by frequency." },
      { text: fmt(lowerMean), misconceptionId: "USE_LOWER_LIMITS_AS_VALUES", derivation: "Uses lower class limits instead of class marks in the weighted mean." },
      { text: fmt(upperMean), misconceptionId: "USE_UPPER_LIMITS_AS_VALUES", derivation: "Uses upper class limits instead of class marks in the weighted mean." },
    ],
    explanation: {
      keyIdea: "For grouped data, use each class mark as x and calculate Σfx / Σf.",
      steps: [`Σf = ${total}.`, `Σfx = ${fmt(weighted)}.`, `Mean = ${fmt(weighted)}/${total} = ${answer}.`],
      workingTable: {
        headers: ["Class", "Class mark (x)", "f", "fx"],
        rows: stimulus.classes.map((item) => [interval(stimulus, stimulus.classes.indexOf(item)), fmt(item.classMark), String(item.frequency), fmt(item.classMark * item.frequency)]),
      },
    },
    evidence: { total, weighted, surfaceId: s.id },
  };
}

function medianClass(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const target = total / 2;
  let cumulative = 0;
  let index = 0;
  const cumulativeValues: number[] = [];
  for (let current = 0; current < stimulus.classes.length; current += 1) {
    cumulative += stimulus.classes[current]!.frequency;
    cumulativeValues.push(cumulative);
    if (cumulative >= target && index === 0) index = current;
  }
  const s = surface(seed, "MEDIAN_CLASS_FROM_POLYGON", [
    "Which class interval contains the median observation?",
    "From the frequencies shown, identify the median class.",
    "After forming cumulative frequencies, in which class does the N/2-th observation lie?",
  ]);
  const alternatives = [index - 2, index - 1, index + 1, index + 2, 0, stimulus.classes.length - 1]
    .filter((candidate, position, values) => candidate >= 0 && candidate < stimulus.classes.length && candidate !== index && values.indexOf(candidate) === position)
    .slice(0, 3);
  return {
    kind: "MEDIAN_CLASS_FROM_POLYGON",
    difficulty: "Hard",
    stem: s.text,
    answer: interval(stimulus, index),
    candidates: alternatives.map((candidateIndex, optionIndex) => ({ text: interval(stimulus, candidateIndex), misconceptionId: `WRONG_CUMULATIVE_CLASS_${optionIndex}`, derivation: "Stops the cumulative count in a neighboring class instead of the first class reaching N/2." })),
    explanation: {
      keyIdea: "The median class is the first class whose cumulative frequency reaches or exceeds N/2.",
      steps: [`Total frequency N = ${total}, so N/2 = ${fmt(target)}.`, `The first cumulative frequency reaching ${fmt(target)} is ${cumulativeValues[index]}.`, `Therefore the median class is ${interval(stimulus, index)}.`],
      workingTable: {
        headers: ["Class", "f", "Cumulative f"],
        rows: stimulus.classes.map((item, itemIndex) => [interval(stimulus, itemIndex), String(item.frequency), String(cumulativeValues[itemIndex])]),
      },
    },
    evidence: { targetIndex: index, total, halfTotal: target, surfaceId: s.id },
  };
}

export function buildDi010DraftsV2(seed: string, stimulus: Di010Stimulus): readonly Di010Draft[] {
  return [
    constructionProperty(seed),
    readClassFrequency(seed, stimulus),
    modalClass(seed, stimulus),
    classIntervalFromMark(seed, stimulus),
    totalFrequency(seed, stimulus),
    consecutiveRangeTotal(seed, stimulus),
    frequencyDifference(seed, stimulus),
    classShare(seed, stimulus),
    histogramBarHeight(seed, stimulus),
    zeroEndpoints(seed, stimulus),
    rangeRatio(seed, stimulus),
    groupedMean(seed, stimulus),
    medianClass(seed, stimulus),
  ];
}
