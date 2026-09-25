import { pick, seededRandom } from "../DI-001/exact";
import type { Di009DistributionShape, Di009ExamProfile, Di009HistogramBin, Di009Stimulus } from "./types";

const CONTEXTS = [
  { title: "Marks obtained by students in a test", xAxisLabel: "Marks", yAxisLabel: "Number of students", unit: "students", start: 0, width: 10 },
  { title: "Heights of students in a sports group", xAxisLabel: "Height (cm)", yAxisLabel: "Number of students", unit: "students", start: 140, width: 10 },
  { title: "Weights of participants in a fitness survey", xAxisLabel: "Weight (kg)", yAxisLabel: "Number of participants", unit: "participants", start: 40, width: 10 },
  { title: "Daily travel time of employees", xAxisLabel: "Travel time (minutes)", yAxisLabel: "Number of employees", unit: "employees", start: 10, width: 10 },
  { title: "Ages of workers in a unit", xAxisLabel: "Age (years)", yAxisLabel: "Number of workers", unit: "workers", start: 20, width: 10 },
  { title: "Daily wages of workers", xAxisLabel: "Daily wage (₹)", yAxisLabel: "Number of workers", unit: "workers", start: 200, width: 50 },
] as const;

const SHAPES: readonly Di009DistributionShape[] = [
  "UNIMODAL",
  "RIGHT_SKEWED",
  "LEFT_SKEWED",
  "ASCENDING",
  "DESCENDING",
  "CONTROLLED_IRREGULAR",
];

function ensurePositiveMultipleOfFive(value: number) {
  return Math.max(5, Math.round(value / 5) * 5);
}

function buildUnimodal(count: number, seed: string) {
  const random = seededRandom(`${seed}:unimodal`);
  const peak = Math.max(1, Math.min(count - 2, Math.floor(count / 2) + pick(random, [-1, 0, 0, 1] as const)));
  const base = pick(random, [10, 15, 20] as const);
  const step = pick(random, [5, 10] as const);
  const peakHeight = base + step * (Math.max(peak, count - 1 - peak) + 2);
  return Array.from({ length: count }, (_, index) =>
    ensurePositiveMultipleOfFive(peakHeight - Math.abs(index - peak) * step - (index > peak ? pick(random, [0, 0, 5] as const) : 0)),
  );
}

function buildRightSkewed(count: number, seed: string) {
  const random = seededRandom(`${seed}:right-skewed`);
  const peak = pick(random, count >= 7 ? [1, 2] as const : [1] as const);
  const base = pick(random, [10, 15] as const);
  const peakHeight = pick(random, [40, 45, 50] as const);
  return Array.from({ length: count }, (_, index) =>
    index < peak
      ? ensurePositiveMultipleOfFive(peakHeight - (peak - index) * 10)
      : index === peak
        ? peakHeight
        : ensurePositiveMultipleOfFive(peakHeight - (index - peak) * 5 - base / 2),
  );
}

function buildLeftSkewed(count: number, seed: string) {
  return [...buildRightSkewed(count, `${seed}:mirror`)].reverse();
}

function buildAscending(count: number, seed: string) {
  const random = seededRandom(`${seed}:ascending`);
  const start = pick(random, [10, 15, 20] as const);
  const step = pick(random, [5, 10] as const);
  return Array.from({ length: count }, (_, index) => start + index * step);
}

function buildDescending(count: number, seed: string) {
  return [...buildAscending(count, `${seed}:descending-source`)].reverse();
}

function buildControlledIrregular(count: number, seed: string) {
  const random = seededRandom(`${seed}:irregular`);
  const base = pick(random, [10, 15, 20] as const);
  const unit = pick(random, [5, 10] as const);
  const pattern = [2, 3, 2, 5, 4, 3, 2, 3, 2] as const;
  const offset = pick(random, [0, 0, 1] as const);
  return Array.from({ length: count }, (_, index) => base + unit * Math.max(1, pattern[(index + offset) % pattern.length]!));
}

function frequenciesFor(shape: Di009DistributionShape, count: number, seed: string) {
  switch (shape) {
    case "UNIMODAL": return buildUnimodal(count, seed);
    case "RIGHT_SKEWED": return buildRightSkewed(count, seed);
    case "LEFT_SKEWED": return buildLeftSkewed(count, seed);
    case "ASCENDING": return buildAscending(count, seed);
    case "DESCENDING": return buildDescending(count, seed);
    case "CONTROLLED_IRREGULAR": return buildControlledIrregular(count, seed);
  }
}

export function buildDi009Stimulus(seed: string, profile: Di009ExamProfile): Di009Stimulus {
  const context = pick(seededRandom(`${seed}:${profile}:context`), CONTEXTS);
  const classCount = pick(seededRandom(`${seed}:${profile}:class-count`), [5, 6, 7, 8, 9] as const);
  const shape = pick(seededRandom(`${seed}:${profile}:shape`), SHAPES);
  const scale = pick(
    seededRandom(`${seed}:${profile}:scale`),
    profile === "SSC_CGL_TIER_II" ? [1, 1, 2] as const : [1, 1, 1, 2] as const,
  );
  const frequencies = frequenciesFor(shape, classCount, `${seed}:${profile}`).map((value) => value * scale);
  const bins: Di009HistogramBin[] = frequencies.map((frequency, index) => ({
    lower: context.start + index * context.width,
    upper: context.start + (index + 1) * context.width,
    frequency,
  }));

  return {
    kind: "HISTOGRAM",
    title: context.title,
    instruction: "Study the histogram and answer the questions that follow.",
    bins,
    classWidth: context.width,
    shape,
    xAxisLabel: context.xAxisLabel,
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
  };
}
