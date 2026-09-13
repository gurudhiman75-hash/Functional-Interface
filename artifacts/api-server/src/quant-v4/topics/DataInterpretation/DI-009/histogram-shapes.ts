import { pick, seededRandom } from "../DI-001/exact";
import type {
  Di009DistributionShape,
  Di009ExamProfile,
  Di009HistogramBin,
  Di009Stimulus,
} from "./types";

const CONTEXTS = [
  { title: "Marks obtained by students in a test", xAxisLabel: "Marks", yAxisLabel: "Number of students", unit: "students", start: 0, width: 10 },
  { title: "Heights of students in a sports group", xAxisLabel: "Height (cm)", yAxisLabel: "Number of students", unit: "students", start: 140, width: 5 },
  { title: "Weights of participants in a fitness survey", xAxisLabel: "Weight (kg)", yAxisLabel: "Number of participants", unit: "participants", start: 40, width: 5 },
  { title: "Daily travel time of employees", xAxisLabel: "Travel time (minutes)", yAxisLabel: "Number of employees", unit: "employees", start: 10, width: 10 },
  { title: "Ages of workers in a unit", xAxisLabel: "Age (years)", yAxisLabel: "Number of workers", unit: "workers", start: 20, width: 5 },
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
  return Array.from({ length: count }, (_, index) => {
    const distance = Math.abs(index - peak);
    const asymmetry = index > peak ? pick(random, [0, 0, 5] as const) : 0;
    return ensurePositiveMultipleOfFive(peakHeight - distance * step - asymmetry);
  });
}

function buildRightSkewed(count: number, seed: string) {
  const random = seededRandom(`${seed}:right-skewed`);
  const peak = pick(random, count >= 7 ? [1, 2] as const : [1] as const);
  const base = pick(random, [10, 15] as const);
  const peakHeight = pick(random, [40, 45, 50] as const);
  return Array.from({ length: count }, (_, index) => {
    if (index < peak) return ensurePositiveMultipleOfFive(peakHeight - (peak - index) * 10);
    if (index === peak) return peakHeight;
    return ensurePositiveMultipleOfFive(peakHeight - (index - peak) * 5 - base / 2);
  });
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

function niceYAxisStep(maxFrequency: number) {
  const rough = maxFrequency / 5;
  if (rough <= 5) return 5;
  if (rough <= 10) return 10;
  if (rough <= 20) return 20;
  return Math.ceil(rough / 10) * 10;
}

export function renderDi009HistogramSvg(stimulus: Omit<Di009Stimulus, "svg">): string {
  const width = 800;
  const height = 420;
  const left = 78;
  const right = 28;
  const top = 52;
  const bottom = 82;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxFrequency = Math.max(...stimulus.bins.map((bin) => bin.frequency));
  const yStep = niceYAxisStep(maxFrequency);
  const yMax = yStep * Math.ceil(maxFrequency / yStep);
  const barWidth = plotWidth / stimulus.bins.length;
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${stimulus.title}">`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="white"/>`,
    `<text x="${width / 2}" y="26" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="600">${stimulus.title}</text>`,
    `<line x1="${left}" y1="${top + plotHeight}" x2="${left + plotWidth}" y2="${top + plotHeight}" stroke="#222" stroke-width="1.2"/>`,
    `<line x1="${left}" y1="${top}" x2="${left}" y2="${top + plotHeight}" stroke="#222" stroke-width="1.2"/>`,
    `<g data-contiguous-bars="true">`,
  ];

  stimulus.bins.forEach((bin, index) => {
    const x = left + index * barWidth;
    const h = (bin.frequency / yMax) * plotHeight;
    const y = top + plotHeight - h;
    parts.push(`<rect data-bin-index="${index}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${h.toFixed(2)}" fill="#f4f4f4" stroke="#333" stroke-width="1"/>`);
  });
  parts.push(`</g>`);

  for (let value = 0; value <= yMax; value += yStep) {
    const y = top + plotHeight - (value / yMax) * plotHeight;
    parts.push(`<line x1="${left - 5}" y1="${y.toFixed(2)}" x2="${left}" y2="${y.toFixed(2)}" stroke="#222" stroke-width="1"/>`);
    parts.push(`<text x="${left - 10}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-family="Arial, sans-serif" font-size="11">${value}</text>`);
  }

  const boundaries = [stimulus.bins[0]!.lower, ...stimulus.bins.map((bin) => bin.upper)];
  boundaries.forEach((boundary, index) => {
    const x = left + index * barWidth;
    parts.push(`<line x1="${x.toFixed(2)}" y1="${top + plotHeight}" x2="${x.toFixed(2)}" y2="${top + plotHeight + 5}" stroke="#222" stroke-width="1"/>`);
    parts.push(`<text x="${x.toFixed(2)}" y="${top + plotHeight + 22}" text-anchor="middle" font-family="Arial, sans-serif" font-size="10.5">${boundary}</text>`);
  });

  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 20}" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">${stimulus.xAxisLabel}</text>`);
  parts.push(`<text transform="translate(20 ${top + plotHeight / 2}) rotate(-90)" text-anchor="middle" font-family="Arial, sans-serif" font-size="12">${stimulus.yAxisLabel}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}

export function buildDi009Stimulus(seed: string, profile: Di009ExamProfile): Di009Stimulus {
  const context = pick(seededRandom(`${seed}:${profile}:context`), CONTEXTS);
  const classCount = pick(seededRandom(`${seed}:${profile}:class-count`), [5, 6, 7, 8, 9] as const);
  const shape = pick(seededRandom(`${seed}:${profile}:shape`), SHAPES);
  const scale = pick(seededRandom(`${seed}:${profile}:scale`), profile === "SSC_CGL_TIER_II" ? [1, 1, 2] as const : [1, 1, 1, 2] as const);
  const frequencies = frequenciesFor(shape, classCount, `${seed}:${profile}`).map((value) => value * scale);
  const bins: Di009HistogramBin[] = frequencies.map((frequency, index) => ({
    lower: context.start + index * context.width,
    upper: context.start + (index + 1) * context.width,
    frequency,
  }));
  const core = {
    kind: "HISTOGRAM" as const,
    title: context.title,
    instruction: "Study the histogram and answer the questions that follow.",
    bins,
    classWidth: context.width,
    shape,
    xAxisLabel: context.xAxisLabel,
    yAxisLabel: context.yAxisLabel,
    unit: context.unit,
  };
  return { ...core, svg: renderDi009HistogramSvg(core) };
}
