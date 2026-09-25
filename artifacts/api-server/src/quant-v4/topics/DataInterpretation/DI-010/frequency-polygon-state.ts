import { pick, seededRandom } from "../DI-001/exact";
import type { Di010DistributionShape, Di010ExamProfile, Di010Stimulus } from "./types";

const SHAPES: readonly Di010DistributionShape[] = [
  "UNIMODAL",
  "RIGHT_SKEWED",
  "LEFT_SKEWED",
  "ASCENDING",
  "DESCENDING",
  "CONTROLLED_IRREGULAR",
];

const CONTEXTS = [
  { title: "Marks of students", xAxisLabel: "Marks", yAxisLabel: "Number of students", unit: "students", startPool: [20, 30, 40], widthPool: [10] },
  { title: "Travel time of employees", xAxisLabel: "Travel time (minutes)", yAxisLabel: "Number of employees", unit: "employees", startPool: [10, 20, 30], widthPool: [10] },
  { title: "Weights in a fitness survey", xAxisLabel: "Weight (kg)", yAxisLabel: "Number of persons", unit: "persons", startPool: [40, 50, 60], widthPool: [10] },
  { title: "Heights in a sports group", xAxisLabel: "Height (cm)", yAxisLabel: "Number of players", unit: "players", startPool: [130, 140, 150], widthPool: [10] },
  { title: "Daily wages of workers", xAxisLabel: "Daily wage (₹)", yAxisLabel: "Number of workers", unit: "workers", startPool: [200, 300, 400], widthPool: [20] },
  { title: "Ages of workers", xAxisLabel: "Age (years)", yAxisLabel: "Number of workers", unit: "workers", startPool: [20, 25, 30], widthPool: [10] },
] as const;

function frequenciesFor(shape: Di010DistributionShape, count: number, seed: string) {
  const random = seededRandom(`${seed}:frequencies`);
  const base = 5 + Math.floor(random() * 3) * 5;
  const step = 5 + Math.floor(random() * 2) * 5;
  if (shape === "ASCENDING") return Array.from({ length: count }, (_, index) => base + index * step);
  if (shape === "DESCENDING") return Array.from({ length: count }, (_, index) => base + (count - 1 - index) * step);
  if (shape === "UNIMODAL") {
    const peak = Math.max(1, Math.min(count - 2, Math.floor(count / 2) + (random() < 0.5 ? -1 : 0)));
    return Array.from({ length: count }, (_, index) => base + (count - Math.abs(index - peak)) * step);
  }
  if (shape === "RIGHT_SKEWED") {
    const peak = Math.min(1, count - 1);
    return Array.from({ length: count }, (_, index) => base + Math.max(1, count - Math.abs(index - peak)) * step);
  }
  if (shape === "LEFT_SKEWED") {
    const peak = Math.max(0, count - 2);
    return Array.from({ length: count }, (_, index) => base + Math.max(1, count - Math.abs(index - peak)) * step);
  }
  const values = Array.from({ length: count }, (_, index) => base + (2 + Math.floor(random() * 5) + (index % 2)) * 5);
  const peak = Math.floor(random() * count);
  const currentMax = Math.max(...values);
  values[peak] = currentMax + 10;
  return values;
}

export function buildDi010Stimulus(seed: string, examProfile: Di010ExamProfile): Di010Stimulus {
  const random = seededRandom(`${seed}:${examProfile}:state`);
  const context = pick(random, CONTEXTS);
  const classCount = 5 + Math.floor(random() * 4);
  const classWidth = pick(random, context.widthPool);
  const start = pick(random, context.startPool);
  const shape = pick(random, SHAPES);
  const frequencies = frequenciesFor(shape, classCount, `${seed}:${examProfile}:${shape}`);
  const classes = frequencies.map((frequency, index) => {
    const lower = start + index * classWidth;
    const upper = lower + classWidth;
    return { lower, upper, classMark: (lower + upper) / 2, frequency };
  });
  return {
    kind: "FREQUENCY_POLYGON",
    title: context.title,
    instruction: "Study the frequency polygon and answer the questions that follow.",
    classes,
    classWidth,
    shape,
    xAxisLabel: context.xAxisLabel,
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
  };
}
