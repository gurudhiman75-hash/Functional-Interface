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
  const random = seededRandom(`${seed}:${kind}:surface:p2`);
  const index = Math.floor(random() * values.length);
  return { text: values[index]!, id: index };
}

function targetIndex(seed: string, stimulus: Di010Stimulus, suffix: string) {
  const random = seededRandom(`${seed}:${suffix}:p2`);
  return Math.floor(random() * stimulus.classes.length);
}

function rangeSubject(stimulus: Di010Stimulus, lower: number, upper: number): string {
  if (stimulus.title === "Marks of students") return `students who scored at least ${fmt(lower)} but less than ${fmt(upper)} marks`;
  if (stimulus.title === "Travel time of employees") return `employees whose travel time was at least ${fmt(lower)} but less than ${fmt(upper)} minutes`;
  if (stimulus.title === "Weights in a fitness survey") return `persons whose weight was at least ${fmt(lower)} kg but less than ${fmt(upper)} kg`;
  if (stimulus.title === "Heights in a sports group") return `players whose height was at least ${fmt(lower)} cm but less than ${fmt(upper)} cm`;
  if (stimulus.title === "Daily wages of workers") return `workers whose daily wage was at least ₹${fmt(lower)} but less than ₹${fmt(upper)}`;
  if (stimulus.title === "Ages of workers") return `workers aged at least ${fmt(lower)} but less than ${fmt(upper)} years`;
  return `${stimulus.unit} in the range ${fmt(lower)}–${fmt(upper)}`;
}

function classSubject(stimulus: Di010Stimulus, index: number) {
  const item = stimulus.classes[index]!;
  return rangeSubject(stimulus, item.lower, item.upper);
}

function spanSubject(stimulus: Di010Stimulus, start: number, end: number) {
  return rangeSubject(stimulus, stimulus.classes[start]!.lower, stimulus.classes[end]!.upper);
}

function measuredQuantity(stimulus: Di010Stimulus) {
  if (stimulus.title === "Marks of students") return "marks";
  if (stimulus.title === "Travel time of employees") return "travel time";
  if (stimulus.title === "Weights in a fitness survey") return "weight";
  if (stimulus.title === "Heights in a sports group") return "height";
  if (stimulus.title === "Daily wages of workers") return "daily wage";
  if (stimulus.title === "Ages of workers") return "age";
  return stimulus.xAxisLabel.toLowerCase();
}

function populationLabel(stimulus: Di010Stimulus) {
  if (stimulus.title === "Marks of students") return "students";
  if (stimulus.title === "Travel time of employees") return "employees";
  if (stimulus.title === "Weights in a fitness survey") return "persons";
  if (stimulus.title === "Heights in a sports group") return "players";
  if (stimulus.title === "Daily wages of workers") return "workers";
  if (stimulus.title === "Ages of workers") return "workers";
  return stimulus.unit;
}

function averagePhrase(stimulus: Di010Stimulus) {
  if (stimulus.title === "Marks of students") return "average marks of the students";
  if (stimulus.title === "Travel time of employees") return "average travel time of the employees";
  if (stimulus.title === "Weights in a fitness survey") return "average weight of the persons";
  if (stimulus.title === "Heights in a sports group") return "average height of the players";
  if (stimulus.title === "Daily wages of workers") return "average daily wage of the workers";
  if (stimulus.title === "Ages of workers") return "average age of the workers";
  return `average ${measuredQuantity(stimulus)}`;
}

function medianPhrase(stimulus: Di010Stimulus) {
  if (stimulus.title === "Marks of students") return "median marks";
  if (stimulus.title === "Travel time of employees") return "median travel time";
  if (stimulus.title === "Weights in a fitness survey") return "median weight";
  if (stimulus.title === "Heights in a sports group") return "median height";
  if (stimulus.title === "Daily wages of workers") return "median daily wage";
  if (stimulus.title === "Ages of workers") return "median age";
  return `median ${measuredQuantity(stimulus)}`;
}

function percentage(numerator: number, denominator: number) {
  return `${Math.round((numerator / denominator) * 100)}%`;
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
    "In a frequency polygon, what do the x-coordinates of the main plotted points represent?",
    "The points of a frequency polygon are plotted above which values on the horizontal axis?",
    "For each original class, which value is taken on the x-axis while drawing a frequency polygon?",
  ]);
  return {
    kind: "CONSTRUCTION_PROPERTY",
    difficulty: "Easy",
    stem: s.text,
    answer: "Class marks (midpoints)",
    candidates: [
      { text: "Lower class limits", misconceptionId: "USE_LOWER_LIMITS", derivation: "Uses the lower limits instead of the midpoints of the classes." },
      { text: "Upper class limits", misconceptionId: "USE_UPPER_LIMITS", derivation: "Uses the upper limits instead of the midpoints of the classes." },
      { text: "Cumulative frequencies", misconceptionId: "CONFUSE_WITH_OGIVE", derivation: "Confuses frequency-polygon construction with cumulative-frequency plotting." },
    ],
    explanation: {
      keyIdea: "A frequency polygon plots each class frequency at the class mark, which is the midpoint of that class.",
      steps: ["Find the midpoint of each class interval.", "Plot its frequency above that midpoint.", "Join the plotted points with straight line segments."],
    },
    evidence: { surfaceId: s.id },
  };
}

function readClassFrequency(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "read-context-index");
  const item = stimulus.classes[index]!;
  const previous = stimulus.classes[Math.max(0, index - 1)]!.frequency;
  const next = stimulus.classes[Math.min(stimulus.classes.length - 1, index + 1)]!.frequency;
  const subject = classSubject(stimulus, index);
  const s = surface(seed, "READ_CLASS_FREQUENCY_CONTEXT", [
    `According to the graph, how many ${subject} are represented?`,
    `How many ${subject} does the frequency polygon show?`,
    `The class ${interval(stimulus, index)} represents how many ${populationLabel(stimulus)}?`,
  ]);
  return {
    kind: "READ_CLASS_FREQUENCY_CONTEXT",
    difficulty: "Easy",
    stem: s.text,
    answer: String(item.frequency),
    candidates: [
      { text: String(previous), misconceptionId: "READ_PREVIOUS_CLASS", derivation: "Reads the frequency of the previous class instead of the required class." },
      { text: String(next), misconceptionId: "READ_NEXT_CLASS", derivation: "Reads the frequency of the next class instead of the required class." },
      { text: String(item.frequency + 5), misconceptionId: "READ_NEARBY_GRID_LEVEL", derivation: "Reads a nearby grid value instead of the plotted frequency." },
    ],
    explanation: { keyIdea: "Locate the required class and read the height of its point on the frequency axis.", steps: [`For the class ${interval(stimulus, index)}, the graph shows a frequency of ${item.frequency}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function modalClass(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const maxFrequency = Math.max(...stimulus.classes.map((item) => item.frequency));
  const index = stimulus.classes.findIndex((item) => item.frequency === maxFrequency);
  const s = surface(seed, "MODAL_CLASS_FROM_POLYGON", [
    `The greatest number of ${populationLabel(stimulus)} lies in which class interval?`,
    "Which class interval corresponds to the highest point of the frequency polygon?",
    "Identify the modal class from the graph.",
  ]);
  const alternatives = [index - 2, index - 1, index + 1, index + 2, 0, stimulus.classes.length - 1]
    .filter((candidate, position, values) => candidate >= 0 && candidate < stimulus.classes.length && candidate !== index && values.indexOf(candidate) === position)
    .slice(0, 3);
  return {
    kind: "MODAL_CLASS_FROM_POLYGON",
    difficulty: "Easy",
    stem: s.text,
    answer: interval(stimulus, index),
    candidates: alternatives.map((candidateIndex, optionIndex) => ({ text: interval(stimulus, candidateIndex), misconceptionId: `NEARBY_MODAL_CLASS_${optionIndex}`, derivation: "Chooses another visible class instead of the class represented by the highest point." })),
    explanation: { keyIdea: "The modal class is the interval with the highest frequency.", steps: [`The highest point has frequency ${maxFrequency}.`, `That point represents the class ${interval(stimulus, index)}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function classIntervalFromMark(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "mark-to-class-index");
  const item = stimulus.classes[index]!;
  const width = stimulus.classWidth;
  const quantity = measuredQuantity(stimulus);
  const s = surface(seed, "CLASS_INTERVAL_FROM_MARK", [
    `The point plotted at ${fmt(item.classMark)} on the ${quantity} axis represents which class interval?`,
    `Which class interval has ${fmt(item.classMark)} as its class mark?`,
    `A point of the polygon is plotted at x = ${fmt(item.classMark)}. Which class does it represent?`,
  ]);
  return {
    kind: "CLASS_INTERVAL_FROM_MARK",
    difficulty: "Easy",
    stem: s.text,
    answer: interval(stimulus, index),
    candidates: [
      { text: `${fmt(item.lower - width / 2)}–${fmt(item.classMark)}`, misconceptionId: "TREAT_MARK_AS_UPPER_LIMIT", derivation: "Treats the class mark as the upper limit rather than the midpoint." },
      { text: `${fmt(item.classMark)}–${fmt(item.upper + width / 2)}`, misconceptionId: "TREAT_MARK_AS_LOWER_LIMIT", derivation: "Treats the class mark as the lower limit rather than the midpoint." },
      { text: `${fmt(item.lower - width)}–${fmt(item.upper - width)}`, misconceptionId: "SHIFT_TO_PREVIOUS_CLASS", derivation: "Moves one full class width to the preceding interval." },
    ],
    explanation: { keyIdea: "A class mark is the midpoint of its class interval.", steps: [`Class width = ${fmt(width)}, so half-width = ${fmt(width / 2)}.`, `Lower limit = ${fmt(item.classMark)} − ${fmt(width / 2)} = ${fmt(item.lower)}.`, `Upper limit = ${fmt(item.classMark)} + ${fmt(width / 2)} = ${fmt(item.upper)}.`, `Hence the interval is ${interval(stimulus, index)}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function totalFrequency(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const first = stimulus.classes[0]!.frequency;
  const last = stimulus.classes[stimulus.classes.length - 1]!.frequency;
  const people = populationLabel(stimulus);
  const s = surface(seed, "TOTAL_FREQUENCY_FROM_POLYGON", [
    `How many ${people} are represented by the graph altogether?`,
    `What is the total number of ${people} represented in the distribution?`,
    `Find the total frequency represented by the polygon.`,
  ]);
  return {
    kind: "TOTAL_FREQUENCY_FROM_POLYGON",
    difficulty: "Medium",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total - first), misconceptionId: "OMIT_FIRST_CLASS", derivation: "Adds all frequencies except the first class." },
      { text: String(total - last), misconceptionId: "OMIT_LAST_CLASS", derivation: "Adds all frequencies except the last class." },
      { text: String(total + stimulus.classWidth), misconceptionId: "ADD_CLASS_WIDTH", derivation: "Incorrectly adds the class width to the total frequency." },
    ],
    explanation: { keyIdea: "The total represented is the sum of the frequencies of all classes.", steps: [`Total = ${stimulus.classes.map((item) => item.frequency).join(" + ")} = ${total}.`] },
    evidence: { total, surfaceId: s.id },
  };
}

function consecutiveRangeTotal(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const random = seededRandom(`${seed}:context-range-total:p2`);
  const span = stimulus.classes.length >= 7 && random() > 0.5 ? 3 : 2;
  const start = Math.floor(random() * (stimulus.classes.length - span + 1));
  const end = start + span - 1;
  const total = stimulus.classes.slice(start, end + 1).reduce((sum, item) => sum + item.frequency, 0);
  const before = stimulus.classes[Math.max(0, start - 1)]!.frequency;
  const after = stimulus.classes[Math.min(stimulus.classes.length - 1, end + 1)]!.frequency;
  const subject = spanSubject(stimulus, start, end);
  const s = surface(seed, "CONSECUTIVE_RANGE_TOTAL_CONTEXT", [
    `How many ${subject} are represented in the graph?`,
    `According to the polygon, what is the total number of ${subject}?`,
    `Find the combined frequency for ${subject}.`,
  ]);
  return {
    kind: "CONSECUTIVE_RANGE_TOTAL_CONTEXT",
    difficulty: "Medium",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total + before), misconceptionId: "INCLUDE_PREVIOUS_CLASS", derivation: "Includes the class immediately before the required range." },
      { text: String(total + after), misconceptionId: "INCLUDE_NEXT_CLASS", derivation: "Includes the class immediately after the required range." },
      { text: String(Math.max(1, total - stimulus.classes[start]!.frequency)), misconceptionId: "OMIT_FIRST_CLASS_IN_RANGE", derivation: "Leaves out the first class belonging to the required range." },
    ],
    explanation: { keyIdea: "Add only the frequencies of the classes that fall inside the stated range.", steps: [`Required frequencies: ${stimulus.classes.slice(start, end + 1).map((item) => item.frequency).join(" + ")}.`, `Total = ${total}.`] },
    evidence: { startIndex: start, endIndex: end, surfaceId: s.id },
  };
}

function differentPair(seed: string, stimulus: Di010Stimulus) {
  const random = seededRandom(`${seed}:context-difference:p2`);
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
  const s = surface(seed, "FREQUENCY_DIFFERENCE_CONTEXT", [
    `How many more ${classSubject(stimulus, highIndex)} are there than ${classSubject(stimulus, lowIndex)}?`,
    `By how many does the frequency of ${interval(stimulus, highIndex)} exceed that of ${interval(stimulus, lowIndex)}?`,
    `Find the difference between the frequencies of the classes ${interval(stimulus, highIndex)} and ${interval(stimulus, lowIndex)}.`,
  ]);
  return {
    kind: "FREQUENCY_DIFFERENCE_CONTEXT",
    difficulty: "Medium",
    stem: s.text,
    answer: String(difference),
    candidates: [
      { text: String(high.frequency + low.frequency), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two frequencies instead of finding their difference." },
      { text: String(high.frequency), misconceptionId: "REPORT_HIGHER_FREQUENCY", derivation: "Reports the larger frequency itself instead of the difference." },
      { text: String(Math.abs(difference - 5) || difference + 5), misconceptionId: "NEARBY_READING_ERROR", derivation: "Uses a nearby graph reading and makes a five-unit error." },
    ],
    explanation: { keyIdea: "Read the two class frequencies and subtract the smaller from the larger.", steps: [`The two frequencies are ${high.frequency} and ${low.frequency}.`, `Difference = ${high.frequency} − ${low.frequency} = ${difference}.`] },
    evidence: { highIndex, lowIndex, surfaceId: s.id },
  };
}

function classShare(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "class-share-index");
  const item = stimulus.classes[index]!;
  const total = stimulus.classes.reduce((sum, current) => sum + current.frequency, 0);
  const answer = percentage(item.frequency, total);
  const neighbor = stimulus.classes[index === stimulus.classes.length - 1 ? index - 1 : index + 1]!;
  const people = populationLabel(stimulus);
  const subject = classSubject(stimulus, index);
  const s = surface(seed, "CLASS_SHARE_OF_TOTAL", [
    `To the nearest whole percent, what percentage of the total ${people} are ${subject}?`,
    `${subject[0]!.toUpperCase()}${subject.slice(1)} form approximately what whole percentage of all ${people}?`,
    `The class ${interval(stimulus, index)} represents approximately what percentage of the total ${people}, to the nearest whole percent?`,
  ]);
  return {
    kind: "CLASS_SHARE_OF_TOTAL",
    difficulty: "Medium",
    stem: s.text,
    answer,
    candidates: [
      { text: percentage(neighbor.frequency, total), misconceptionId: "USE_NEIGHBOR_CLASS", derivation: "Uses an adjacent class frequency with the correct total." },
      { text: percentage(item.frequency, Math.max(1, total - item.frequency)), misconceptionId: "EXCLUDE_TARGET_FROM_TOTAL", derivation: "Removes the target class from the denominator instead of using the complete total." },
      { text: percentage(item.frequency, Math.max(...stimulus.classes.map((current) => current.frequency))), misconceptionId: "USE_MAX_FREQUENCY_AS_TOTAL", derivation: "Divides by the largest single class frequency instead of the total frequency." },
    ],
    explanation: { keyIdea: "Use the required class frequency as the part and the total frequency as the whole.", steps: [`Total ${people} = ${total}.`, `Required percentage = ${item.frequency}/${total} × 100 ≈ ${answer} to the nearest whole percent.`] },
    evidence: { targetIndex: index, total, surfaceId: s.id },
  };
}

function histogramBarHeight(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "histogram-height-index");
  const item = stimulus.classes[index]!;
  const previous = stimulus.classes[Math.max(0, index - 1)]!.frequency;
  const next = stimulus.classes[Math.min(stimulus.classes.length - 1, index + 1)]!.frequency;
  const s = surface(seed, "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON", [
    `If the same distribution is shown as a histogram, what frequency should be shown for ${interval(stimulus, index)}?`,
    `The data are redrawn as a histogram. What frequency should the rectangle for ${interval(stimulus, index)} represent?`,
    `For the equivalent histogram, what frequency will be shown for the class ${interval(stimulus, index)}?`,
  ]);
  return {
    kind: "HISTOGRAM_BAR_HEIGHT_FROM_POLYGON",
    difficulty: "Medium",
    stem: s.text,
    answer: String(item.frequency),
    candidates: [
      { text: String(previous), misconceptionId: "USE_PREVIOUS_POLYGON_POINT", derivation: "Uses the frequency at the previous polygon point." },
      { text: String(next), misconceptionId: "USE_NEXT_POLYGON_POINT", derivation: "Uses the frequency at the next polygon point." },
      { text: String(item.classMark), misconceptionId: "CONFUSE_CLASS_MARK_WITH_HEIGHT", derivation: "Uses the class mark as the bar height instead of the class frequency." },
    ],
    explanation: { keyIdea: "A histogram and its frequency polygon represent the same frequency for each class.", steps: [`The class ${interval(stimulus, index)} has frequency ${item.frequency}.`, `Therefore the histogram will show frequency ${item.frequency} for this class.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function zeroEndpoints(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const first = stimulus.classes[0]!;
  const last = stimulus.classes[stimulus.classes.length - 1]!;
  const left = first.classMark - stimulus.classWidth;
  const right = last.classMark + stimulus.classWidth;
  const s = surface(seed, "ZERO_CLOSING_ENDPOINTS", [
    "Which pair of zero-frequency points should be added to close the frequency polygon at its two ends?",
    "If one zero-frequency class of the same width is added at each end, what are the two closing points of the polygon?",
    "Which two points on the x-axis complete this frequency polygon?",
  ]);
  return {
    kind: "ZERO_CLOSING_ENDPOINTS",
    difficulty: "Hard",
    stem: s.text,
    answer: `${coordinate(left, 0)} and ${coordinate(right, 0)}`,
    candidates: [
      { text: `${coordinate(first.classMark - stimulus.classWidth / 2, 0)} and ${coordinate(last.classMark + stimulus.classWidth / 2, 0)}`, misconceptionId: "HALF_WIDTH_CLOSURE", derivation: "Moves only half a class width outside the first and last class marks." },
      { text: `${coordinate(first.classMark, 0)} and ${coordinate(last.classMark, 0)}`, misconceptionId: "CLOSE_AT_DATA_MARKS", derivation: "Drops the first and last actual class marks directly to zero frequency." },
      { text: `${coordinate(first.lower, 0)} and ${coordinate(last.upper, 0)}`, misconceptionId: "CLOSE_AT_BOUNDARIES", derivation: "Uses the outer class boundaries instead of the midpoints of adjoining zero-frequency classes." },
    ],
    explanation: {
      keyIdea: "A frequency polygon is closed by adding one imaginary class of the same width at each end with frequency zero.",
      steps: [`Class width = ${fmt(stimulus.classWidth)}.`, `Left closing class mark = ${fmt(first.classMark)} − ${fmt(stimulus.classWidth)} = ${fmt(left)}.`, `Right closing class mark = ${fmt(last.classMark)} + ${fmt(stimulus.classWidth)} = ${fmt(right)}.`, `So the required points are ${coordinate(left, 0)} and ${coordinate(right, 0)}.`],
    },
    evidence: { leftEndpoint: left, rightEndpoint: right, surfaceId: s.id },
  };
}

function rangeRatio(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const random = seededRandom(`${seed}:range-ratio:p2`);
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
  const leftSubject = spanSubject(stimulus, chosen.leftStart, leftEnd);
  const rightSubject = spanSubject(stimulus, chosen.rightStart, rightEnd);
  const s = surface(seed, "RANGE_RATIO_FROM_POLYGON", [
    `What is the ratio of the number of ${leftSubject} to the number of ${rightSubject}?`,
    `The total frequency for ${leftSubject} is to that for ${rightSubject} in what ratio?`,
    `Compare the number of ${leftSubject} with the number of ${rightSubject}. What is the ratio in the same order?`,
  ]);
  return {
    kind: "RANGE_RATIO_FROM_POLYGON",
    difficulty: "Hard",
    stem: s.text,
    answer,
    candidates: [
      { text: ratio(chosen.rightTotal, chosen.leftTotal), misconceptionId: "REVERSE_RANGE_RATIO", derivation: "Reverses the order of the two requested range totals." },
      { text: ratio(stimulus.classes[chosen.leftStart]!.frequency, stimulus.classes[chosen.rightStart]!.frequency), misconceptionId: "USE_FIRST_CLASS_ONLY", derivation: "Uses only the first class of each requested range." },
      { text: ratio(chosen.leftTotal - stimulus.classes[leftEnd]!.frequency, chosen.rightTotal), misconceptionId: "OMIT_SECOND_CLASS_FIRST_RANGE", derivation: "Omits the second class from the first requested range." },
    ],
    explanation: { keyIdea: "Add the frequencies in each range first, then simplify the ratio of the two totals.", steps: [`First range: ${stimulus.classes[chosen.leftStart]!.frequency} + ${stimulus.classes[leftEnd]!.frequency} = ${chosen.leftTotal}.`, `Second range: ${stimulus.classes[chosen.rightStart]!.frequency} + ${stimulus.classes[rightEnd]!.frequency} = ${chosen.rightTotal}.`, `Ratio = ${chosen.leftTotal}:${chosen.rightTotal} = ${answer}.`] },
    evidence: { leftStart: chosen.leftStart, rightStart: chosen.rightStart, leftTotal: chosen.leftTotal, rightTotal: chosen.rightTotal, surfaceId: s.id },
  };
}

function groupedMean(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const weighted = stimulus.classes.reduce((sum, item) => sum + item.classMark * item.frequency, 0);
  const answer = String(Math.round(weighted / total));
  const simpleMean = Math.round(stimulus.classes.reduce((sum, item) => sum + item.classMark, 0) / stimulus.classes.length);
  const lowerMean = Math.round(stimulus.classes.reduce((sum, item) => sum + item.lower * item.frequency, 0) / total);
  const upperMean = Math.round(stimulus.classes.reduce((sum, item) => sum + item.upper * item.frequency, 0) / total);
  const s = surface(seed, "GROUPED_MEAN_FROM_POLYGON", [
    `Using the class marks, find the approximate ${averagePhrase(stimulus)} to the nearest whole number.`,
    `What is the approximate ${averagePhrase(stimulus)} for the grouped distribution shown, rounded to the nearest whole number?`,
    `Estimate the ${averagePhrase(stimulus)} by treating each class mark as the value for that class and give the nearest whole number.`,
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
      keyIdea: "For grouped data, use each class mark as x and calculate Σfx ÷ Σf.",
      steps: [`Σf = ${total}.`, `Σfx = ${fmt(weighted)}.`, `Approximate mean = ${fmt(weighted)} ÷ ${total} ≈ ${answer} to the nearest whole number.`],
      workingTable: {
        headers: ["Class", "Class mark (x)", "f", "fx"],
        rows: stimulus.classes.map((item, itemIndex) => [interval(stimulus, itemIndex), fmt(item.classMark), String(item.frequency), fmt(item.classMark * item.frequency)]),
      },
    },
    evidence: { total, weighted, surfaceId: s.id },
  };
}

function medianClass(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const target = total / 2;
  let cumulative = 0;
  let index = -1;
  const cumulativeValues: number[] = [];
  for (let current = 0; current < stimulus.classes.length; current += 1) {
    cumulative += stimulus.classes[current]!.frequency;
    cumulativeValues.push(cumulative);
    if (cumulative >= target && index < 0) index = current;
  }
  if (index < 0) throw new Error("DI-010 could not locate the median class.");
  const s = surface(seed, "MEDIAN_CLASS_FROM_POLYGON", [
    `The ${medianPhrase(stimulus)} lies in which class interval?`,
    `After forming cumulative frequencies, which interval contains the median ${measuredQuantity(stimulus)}?`,
    `Identify the median class for the distribution shown in the graph.`,
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
      keyIdea: "The median class is the first interval whose cumulative frequency reaches or exceeds N/2.",
      steps: [`Total frequency N = ${total}. For cumulative-frequency location, use observation number ${Math.ceil(target)}.`, `The first cumulative frequency reaching or exceeding this position is ${cumulativeValues[index]}.`, `Hence the median class is ${interval(stimulus, index)}.`],
      workingTable: {
        headers: ["Class", "f", "Cumulative f"],
        rows: stimulus.classes.map((item, itemIndex) => [interval(stimulus, itemIndex), String(item.frequency), String(cumulativeValues[itemIndex])]),
      },
    },
    evidence: { targetIndex: index, total, halfTotal: target, surfaceId: s.id },
  };
}

export function buildDi010DraftsV3(seed: string, stimulus: Di010Stimulus): readonly Di010Draft[] {
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
