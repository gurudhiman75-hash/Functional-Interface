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

function graphType(seed: string): Di010Draft {
  const s = surface(seed, "GRAPH_TYPE_IDENTIFICATION", [
    "Which type of graph is shown?",
    "Identify the statistical graph shown in the figure.",
    "The plotted class-mark points are joined by straight lines. What is this graph called?",
  ]);
  return {
    kind: "GRAPH_TYPE_IDENTIFICATION",
    difficulty: "Easy",
    stem: s.text,
    answer: "Frequency polygon",
    candidates: [
      { text: "Histogram", misconceptionId: "CONFUSE_WITH_HISTOGRAM", derivation: "Treats the grouped-frequency line figure as adjacent histogram rectangles." },
      { text: "Ogive", misconceptionId: "CONFUSE_WITH_OGIVE", derivation: "Confuses ordinary class frequencies with cumulative frequencies." },
      { text: "Bar graph", misconceptionId: "CONFUSE_WITH_BAR_GRAPH", derivation: "Treats class-mark points as separate categorical bars." },
    ],
    explanation: {
      keyIdea: "A frequency polygon plots class frequencies at the class marks and joins the points by straight line segments.",
      steps: ["The x-axis uses class marks, not class boundaries.", "The plotted frequencies are joined by straight segments, so the graph is a frequency polygon."],
    },
    evidence: { surfaceId: s.id },
  };
}

function classMark(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "class-mark-index");
  const item = stimulus.classes[index]!;
  const s = surface(seed, "CLASS_MARK_FROM_INTERVAL", [
    `What class mark is used for the interval ${interval(stimulus, index)}?`,
    `Find the midpoint plotted on the x-axis for the class ${interval(stimulus, index)}.`,
    `For the class interval ${interval(stimulus, index)}, which x-coordinate is used in the frequency polygon?`,
  ]);
  const quarter = item.lower + stimulus.classWidth / 4;
  return {
    kind: "CLASS_MARK_FROM_INTERVAL",
    difficulty: "Easy",
    stem: s.text,
    answer: fmt(item.classMark),
    candidates: [
      { text: fmt(item.lower), misconceptionId: "USE_LOWER_BOUNDARY", derivation: "Uses the lower class boundary instead of the midpoint." },
      { text: fmt(item.upper), misconceptionId: "USE_UPPER_BOUNDARY", derivation: "Uses the upper class boundary instead of the midpoint." },
      { text: fmt(quarter), misconceptionId: "USE_QUARTER_CLASS", derivation: "Moves only one-quarter of the class width from the lower boundary." },
    ],
    explanation: {
      keyIdea: "A frequency polygon is plotted at class marks (midpoints).",
      steps: [`Class mark = (${fmt(item.lower)} + ${fmt(item.upper)}) / 2 = ${fmt(item.classMark)}.`],
    },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function pointCoordinate(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "point-coordinate-index");
  const item = stimulus.classes[index]!;
  const s = surface(seed, "POINT_COORDINATE_FOR_CLASS", [
    `What is the coordinate of the point for the class ${interval(stimulus, index)}?`,
    `Which ordered pair represents the class ${interval(stimulus, index)} on this frequency polygon?`,
    `For ${interval(stimulus, index)}, write the plotted point as (class mark, frequency).`,
  ]);
  return {
    kind: "POINT_COORDINATE_FOR_CLASS",
    difficulty: "Medium",
    stem: s.text,
    answer: coordinate(item.classMark, item.frequency),
    candidates: [
      { text: coordinate(item.frequency, item.classMark), misconceptionId: "SWAP_COORDINATES", derivation: "Interchanges the class mark and frequency." },
      { text: coordinate(item.lower, item.frequency), misconceptionId: "LOWER_BOUNDARY_AS_X", derivation: "Uses the lower boundary instead of the class mark." },
      { text: coordinate(item.upper, item.frequency), misconceptionId: "UPPER_BOUNDARY_AS_X", derivation: "Uses the upper boundary instead of the class mark." },
    ],
    explanation: {
      keyIdea: "Each polygon point is (class mark, frequency).",
      steps: [`Class mark = (${fmt(item.lower)} + ${fmt(item.upper)}) / 2 = ${fmt(item.classMark)}.`, `The frequency is ${item.frequency}.`, `So the point is ${coordinate(item.classMark, item.frequency)}.`],
    },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function readFrequency(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const index = targetIndex(seed, stimulus, "read-frequency-index");
  const item = stimulus.classes[index]!;
  const previous = stimulus.classes[Math.max(0, index - 1)]!.frequency;
  const next = stimulus.classes[Math.min(stimulus.classes.length - 1, index + 1)]!.frequency;
  const s = surface(seed, "READ_FREQUENCY_AT_CLASS_MARK", [
    `What frequency is shown at class mark ${fmt(item.classMark)}?`,
    `Read the frequency corresponding to x = ${fmt(item.classMark)} from the polygon.`,
    `The point above class mark ${fmt(item.classMark)} represents how many ${stimulus.unit}?`,
  ]);
  return {
    kind: "READ_FREQUENCY_AT_CLASS_MARK",
    difficulty: "Easy",
    stem: s.text,
    answer: String(item.frequency),
    candidates: [
      { text: String(previous), misconceptionId: "READ_PREVIOUS_POINT", derivation: "Reads the neighboring point to the left." },
      { text: String(next), misconceptionId: "READ_NEXT_POINT", derivation: "Reads the neighboring point to the right." },
      { text: String(item.frequency + 5), misconceptionId: "READ_ADJACENT_GRID_LEVEL", derivation: "Reads the next nearby frequency level rather than the plotted point." },
    ],
    explanation: { keyIdea: "Read the y-value of the point above the given class mark.", steps: [`At class mark ${fmt(item.classMark)}, the polygon point is at frequency ${item.frequency}.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function zeroEndpoints(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const first = stimulus.classes[0]!;
  const last = stimulus.classes[stimulus.classes.length - 1]!;
  const left = first.classMark - stimulus.classWidth;
  const right = last.classMark + stimulus.classWidth;
  const s = surface(seed, "ZERO_CLOSING_ENDPOINTS", [
    "Which two zero-frequency points are used to close this frequency polygon?",
    "Find the two endpoints on the x-axis needed to complete the frequency polygon.",
    "At which two x-coordinates should zero-frequency points be added to close the polygon?",
  ]);
  return {
    kind: "ZERO_CLOSING_ENDPOINTS",
    difficulty: "Hard",
    stem: s.text,
    answer: `${coordinate(left, 0)} and ${coordinate(right, 0)}`,
    candidates: [
      { text: `${coordinate(first.classMark - stimulus.classWidth / 2, 0)} and ${coordinate(last.classMark + stimulus.classWidth / 2, 0)}`, misconceptionId: "HALF_WIDTH_CLOSURE", derivation: "Moves only half a class width outside the first and last class marks." },
      { text: `${coordinate(first.classMark, 0)} and ${coordinate(last.classMark, 0)}`, misconceptionId: "CLOSE_AT_DATA_MARKS", derivation: "Drops the first and last data class marks directly to zero." },
      { text: `${coordinate(first.lower, 0)} and ${coordinate(last.upper, 0)}`, misconceptionId: "CLOSE_AT_BOUNDARIES", derivation: "Uses outer class boundaries instead of one full class width beyond the class marks." },
    ],
    explanation: {
      keyIdea: "A frequency polygon is closed with zero-frequency points one class width before the first class mark and one class width after the last class mark.",
      steps: [`Class width = ${fmt(stimulus.classWidth)}.`, `Left endpoint = ${fmt(first.classMark)} − ${fmt(stimulus.classWidth)} = ${fmt(left)}.`, `Right endpoint = ${fmt(last.classMark)} + ${fmt(stimulus.classWidth)} = ${fmt(right)}.`, `Therefore the closing points are ${coordinate(left, 0)} and ${coordinate(right, 0)}.`],
    },
    evidence: { leftEndpoint: left, rightEndpoint: right, surfaceId: s.id },
  };
}

function totalFrequency(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const total = stimulus.classes.reduce((sum, item) => sum + item.frequency, 0);
  const first = stimulus.classes[0]!.frequency;
  const last = stimulus.classes[stimulus.classes.length - 1]!.frequency;
  const s = surface(seed, "TOTAL_FREQUENCY_FROM_POLYGON", [
    `What is the total number of ${stimulus.unit} represented by the polygon?`,
    "Find the total frequency represented by all plotted classes.",
    `How many ${stimulus.unit} are represented in all classes together?`,
  ]);
  return {
    kind: "TOTAL_FREQUENCY_FROM_POLYGON",
    difficulty: "Medium",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total - first), misconceptionId: "OMIT_FIRST_CLASS", derivation: "Adds all frequencies except the first class." },
      { text: String(total - last), misconceptionId: "OMIT_LAST_CLASS", derivation: "Adds all frequencies except the last class." },
      { text: String(total + stimulus.classWidth), misconceptionId: "ADD_CLASS_WIDTH", derivation: "Incorrectly adds the class width to the frequency total." },
    ],
    explanation: { keyIdea: "Total frequency is the sum of the frequencies at all class-mark points.", steps: [`Adding the plotted frequencies gives ${stimulus.classes.map((item) => item.frequency).join(" + ")} = ${total}.`] },
    evidence: { total, surfaceId: s.id },
  };
}

function modalClass(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const maxFrequency = Math.max(...stimulus.classes.map((item) => item.frequency));
  const index = stimulus.classes.findIndex((item) => item.frequency === maxFrequency);
  const alternatives = [0, Math.max(0, index - 1), Math.min(stimulus.classes.length - 1, index + 1), stimulus.classes.length - 1]
    .filter((value, position, values) => value !== index && values.indexOf(value) === position)
    .slice(0, 3);
  const s = surface(seed, "MODAL_CLASS_FROM_POLYGON", [
    "Which class interval is the modal class?",
    "The highest point of the polygon corresponds to which class?",
    "Identify the class with the greatest frequency.",
  ]);
  return {
    kind: "MODAL_CLASS_FROM_POLYGON",
    difficulty: "Easy",
    stem: s.text,
    answer: interval(stimulus, index),
    candidates: alternatives.map((candidateIndex, optionIndex) => ({ text: interval(stimulus, candidateIndex), misconceptionId: `NEARBY_CLASS_${optionIndex}`, derivation: "Chooses another visible class instead of the class at the highest point." })),
    explanation: { keyIdea: "The modal class is the class interval with the highest frequency.", steps: [`The highest plotted frequency is ${maxFrequency}, at class mark ${fmt(stimulus.classes[index]!.classMark)}.`, `That class mark belongs to ${interval(stimulus, index)}, so ${interval(stimulus, index)} is the modal class.`] },
    evidence: { targetIndex: index, surfaceId: s.id },
  };
}

function differentPair(seed: string, stimulus: Di010Stimulus) {
  const random = seededRandom(`${seed}:different-pair`);
  const candidates: [number, number][] = [];
  for (let left = 0; left < stimulus.classes.length; left += 1) {
    for (let right = left + 1; right < stimulus.classes.length; right += 1) {
      if (stimulus.classes[left]!.frequency !== stimulus.classes[right]!.frequency) candidates.push([left, right]);
    }
  }
  return pick(random, candidates);
}

function frequencyDifference(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const [leftIndex, rightIndex] = differentPair(seed, stimulus);
  const left = stimulus.classes[leftIndex]!;
  const right = stimulus.classes[rightIndex]!;
  const difference = Math.abs(left.frequency - right.frequency);
  const s = surface(seed, "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES", [
    `What is the difference between the frequencies of classes ${interval(stimulus, leftIndex)} and ${interval(stimulus, rightIndex)}?`,
    `By how much do the frequencies of ${interval(stimulus, leftIndex)} and ${interval(stimulus, rightIndex)} differ?`,
    `Find the absolute difference between the plotted frequencies for ${interval(stimulus, leftIndex)} and ${interval(stimulus, rightIndex)}.`,
  ]);
  return {
    kind: "FREQUENCY_DIFFERENCE_BETWEEN_CLASSES",
    difficulty: "Medium",
    stem: s.text,
    answer: String(difference),
    candidates: [
      { text: String(left.frequency + right.frequency), misconceptionId: "ADD_INSTEAD_OF_SUBTRACT", derivation: "Adds the two class frequencies instead of taking their difference." },
      { text: String(Math.max(left.frequency, right.frequency)), misconceptionId: "USE_LARGER_FREQUENCY", derivation: "Reports the larger frequency itself instead of the difference." },
      { text: String(difference + 5), misconceptionId: "NEARBY_GRID_DIFFERENCE", derivation: "Uses a nearby grid reading and makes a five-unit difference error." },
    ],
    explanation: { keyIdea: "Read the two class frequencies and subtract the smaller from the larger.", steps: [`The two frequencies are ${left.frequency} and ${right.frequency}.`, `Difference = |${left.frequency} − ${right.frequency}| = ${difference}.`] },
    evidence: { leftIndex, rightIndex, surfaceId: s.id },
  };
}

function combinedRange(seed: string, stimulus: Di010Stimulus): Di010Draft {
  const random = seededRandom(`${seed}:combined-range`);
  const span = stimulus.classes.length >= 7 && random() > 0.45 ? 3 : 2;
  const start = Math.floor(random() * (stimulus.classes.length - span + 1));
  const end = start + span - 1;
  const selected = stimulus.classes.slice(start, end + 1);
  const total = selected.reduce((sum, item) => sum + item.frequency, 0);
  const before = stimulus.classes[Math.max(0, start - 1)]!.frequency;
  const after = stimulus.classes[Math.min(stimulus.classes.length - 1, end + 1)]!.frequency;
  const s = surface(seed, "COMBINED_RANGE_TOTAL_FROM_POLYGON", [
    `How many ${stimulus.unit} lie in the classes from ${interval(stimulus, start)} through ${interval(stimulus, end)}?`,
    `Find the combined frequency for the consecutive classes ${interval(stimulus, start)} to ${interval(stimulus, end)}.`,
    `What is the total frequency represented by the class range ${interval(stimulus, start)} to ${interval(stimulus, end)}?`,
  ]);
  return {
    kind: "COMBINED_RANGE_TOTAL_FROM_POLYGON",
    difficulty: "Hard",
    stem: s.text,
    answer: String(total),
    candidates: [
      { text: String(total + before), misconceptionId: "INCLUDE_CLASS_BEFORE_RANGE", derivation: "Includes the class immediately before the requested range." },
      { text: String(total + after), misconceptionId: "INCLUDE_CLASS_AFTER_RANGE", derivation: "Includes the class immediately after the requested range." },
      { text: String(Math.max(1, total - selected[0]!.frequency)), misconceptionId: "OMIT_FIRST_REQUESTED_CLASS", derivation: "Omits the first class that belongs to the requested range." },
    ],
    explanation: { keyIdea: "Add only the frequencies of the consecutive classes named in the question.", steps: [`Required frequencies: ${selected.map((item) => item.frequency).join(" + ")}.`, `Combined frequency = ${total}.`] },
    evidence: { startIndex: start, endIndex: end, surfaceId: s.id },
  };
}

export function buildDi010Drafts(seed: string, stimulus: Di010Stimulus): readonly Di010Draft[] {
  return [
    graphType(seed),
    classMark(seed, stimulus),
    pointCoordinate(seed, stimulus),
    readFrequency(seed, stimulus),
    zeroEndpoints(seed, stimulus),
    totalFrequency(seed, stimulus),
    modalClass(seed, stimulus),
    frequencyDifference(seed, stimulus),
    combinedRange(seed, stimulus),
  ];
}
