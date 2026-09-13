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

const DIAGRAM_THEME = "EXAMTREE_DI_WORLD_CLASS_V3" as const;

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
  const rough = Math.max(1, maxFrequency / 5);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function intervalLabel(bin: Di009HistogramBin) {
  return `${bin.lower}–${bin.upper}`;
}

export function renderDi009HistogramSvg(stimulus: Omit<Di009Stimulus, "svg">): string {
  const width = 900;
  const height = 480;
  const left = 90;
  const right = 32;
  const top = 66;
  const bottom = 98;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const plotBottom = top + plotHeight;
  const maxFrequency = Math.max(...stimulus.bins.map((bin) => bin.frequency));
  const yStep = niceYAxisStep(maxFrequency);
  const yMax = yStep * Math.ceil(maxFrequency / yStep);
  const barWidth = plotWidth / stimulus.bins.length;
  const safeTitle = escapeSvgText(stimulus.title);
  const safeXAxis = escapeSvgText(stimulus.xAxisLabel);
  const safeYAxis = escapeSvgText(stimulus.yAxisLabel);
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-chart-theme="${DIAGRAM_THEME}" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`,
    `<desc>Continuous equal-width histogram with ${stimulus.bins.length} class intervals. Frequency is represented by bar height.</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>`,
    `<text x="${width / 2}" y="34" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="700" fill="#101828">${safeTitle}</text>`,
    `<rect data-plot-area="true" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" rx="10" fill="#fbfcfe" stroke="#eaecf0" stroke-width="1"/>`,
  ];

  for (let value = 0, tickIndex = 0; value <= yMax; value += yStep, tickIndex += 1) {
    const y = plotBottom - (value / yMax) * plotHeight;
    parts.push(`<line data-gridline="${tickIndex}" x1="${left}" y1="${y.toFixed(2)}" x2="${left + plotWidth}" y2="${y.toFixed(2)}" stroke="${value === 0 ? "#d0d5dd" : "#e4e7ec"}" stroke-width="${value === 0 ? "1.2" : "1"}"${value === 0 ? "" : ' stroke-dasharray="4 5"'}/>`);
    parts.push(`<text x="${left - 13}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="12" fill="#667085">${value}</text>`);
  }

  parts.push(`<line x1="${left}" y1="${top}" x2="${left}" y2="${plotBottom}" stroke="#344054" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<line x1="${left}" y1="${plotBottom}" x2="${left + plotWidth}" y2="${plotBottom}" stroke="#344054" stroke-width="1.6" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<g data-contiguous-bars="true" data-renderer-version="V3">`);

  stimulus.bins.forEach((bin, index) => {
    const x = left + index * barWidth;
    const h = (bin.frequency / yMax) * plotHeight;
    const y = plotBottom - h;
    parts.push(`<rect data-bin-index="${index}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${h.toFixed(2)}" fill="#dbe4f0" stroke="#344054" stroke-width="1.25" vector-effect="non-scaling-stroke"/>`);
    parts.push(`<line data-bar-top="${index}" x1="${(x + 1.5).toFixed(2)}" y1="${(y + 1.5).toFixed(2)}" x2="${(x + barWidth - 1.5).toFixed(2)}" y2="${(y + 1.5).toFixed(2)}" stroke="#ffffff" stroke-opacity="0.78" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
  });
  parts.push(`</g>`);

  for (let boundaryIndex = 0; boundaryIndex <= stimulus.bins.length; boundaryIndex += 1) {
    const x = left + boundaryIndex * barWidth;
    parts.push(`<line data-boundary-tick="${boundaryIndex}" x1="${x.toFixed(2)}" y1="${plotBottom}" x2="${x.toFixed(2)}" y2="${plotBottom + 6}" stroke="#344054" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
  }

  stimulus.bins.forEach((bin, index) => {
    const x = left + (index + 0.5) * barWidth;
    parts.push(`<text data-class-interval-label="${index}" x="${x.toFixed(2)}" y="${plotBottom + 27}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11.5" font-weight="500" fill="#344054">${escapeSvgText(intervalLabel(bin))}</text>`);
  });

  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 23}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="#101828">${safeXAxis}</text>`);
  parts.push(`<text x="27" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 27 ${top + plotHeight / 2})" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="#101828">${safeYAxis}</text>`);
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
