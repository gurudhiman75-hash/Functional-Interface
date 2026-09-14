import { pick, seededRandom } from "../DI-001/exact";
import type { Di009DistributionShape, Di009ExamProfile, Di009HistogramBin, Di009Stimulus } from "./types";

const CONTEXTS = [
  { title: "Marks obtained by students in a test", xAxisLabel: "Marks", yAxisLabel: "Number of students", unit: "students", start: 0, width: 10 },
  { title: "Heights of students in a sports group", xAxisLabel: "Height (cm)", yAxisLabel: "Number of students", unit: "students", start: 140, width: 5 },
  { title: "Weights of participants in a fitness survey", xAxisLabel: "Weight (kg)", yAxisLabel: "Number of participants", unit: "participants", start: 40, width: 5 },
  { title: "Daily travel time of employees", xAxisLabel: "Travel time (minutes)", yAxisLabel: "Number of employees", unit: "employees", start: 10, width: 10 },
  { title: "Ages of workers in a unit", xAxisLabel: "Age (years)", yAxisLabel: "Number of workers", unit: "workers", start: 20, width: 5 },
  { title: "Daily wages of workers", xAxisLabel: "Daily wage (₹)", yAxisLabel: "Number of workers", unit: "workers", start: 200, width: 50 },
] as const;
const SHAPES: readonly Di009DistributionShape[] = ["UNIMODAL", "RIGHT_SKEWED", "LEFT_SKEWED", "ASCENDING", "DESCENDING", "CONTROLLED_IRREGULAR"];
const DIAGRAM_THEME = "EXAMTREE_DI_WORLD_CLASS_V4" as const;
const DIAGRAM_PALETTE = "EXAMTREE_BLUE_SINGLE_SERIES" as const;
const COLORS = { canvas: "#ffffff", plot: "#f7fafe", plotBorder: "#dce6f0", grid: "#dce6f0", axis: "#294c6f", yTick: "#365b7d", tickText: "#61758a", title: "#102a43", axisLabel: "#173a5e", barFill: "#cfe1f5", barStroke: "#355c86", intervalText: "#294c6f" } as const;

function ensurePositiveMultipleOfFive(value: number) { return Math.max(5, Math.round(value / 5) * 5); }
function buildUnimodal(count: number, seed: string) { const random = seededRandom(`${seed}:unimodal`); const peak = Math.max(1, Math.min(count - 2, Math.floor(count / 2) + pick(random, [-1, 0, 0, 1] as const))); const base = pick(random, [10, 15, 20] as const); const step = pick(random, [5, 10] as const); const peakHeight = base + step * (Math.max(peak, count - 1 - peak) + 2); return Array.from({ length: count }, (_, index) => ensurePositiveMultipleOfFive(peakHeight - Math.abs(index - peak) * step - (index > peak ? pick(random, [0, 0, 5] as const) : 0))); }
function buildRightSkewed(count: number, seed: string) { const random = seededRandom(`${seed}:right-skewed`); const peak = pick(random, count >= 7 ? [1, 2] as const : [1] as const); const base = pick(random, [10, 15] as const); const peakHeight = pick(random, [40, 45, 50] as const); return Array.from({ length: count }, (_, index) => index < peak ? ensurePositiveMultipleOfFive(peakHeight - (peak - index) * 10) : index === peak ? peakHeight : ensurePositiveMultipleOfFive(peakHeight - (index - peak) * 5 - base / 2)); }
function buildLeftSkewed(count: number, seed: string) { return [...buildRightSkewed(count, `${seed}:mirror`)].reverse(); }
function buildAscending(count: number, seed: string) { const random = seededRandom(`${seed}:ascending`); const start = pick(random, [10, 15, 20] as const); const step = pick(random, [5, 10] as const); return Array.from({ length: count }, (_, index) => start + index * step); }
function buildDescending(count: number, seed: string) { return [...buildAscending(count, `${seed}:descending-source`)].reverse(); }
function buildControlledIrregular(count: number, seed: string) { const random = seededRandom(`${seed}:irregular`); const base = pick(random, [10, 15, 20] as const); const unit = pick(random, [5, 10] as const); const pattern = [2, 3, 2, 5, 4, 3, 2, 3, 2] as const; const offset = pick(random, [0, 0, 1] as const); return Array.from({ length: count }, (_, index) => base + unit * Math.max(1, pattern[(index + offset) % pattern.length]!)); }
function frequenciesFor(shape: Di009DistributionShape, count: number, seed: string) { switch (shape) { case "UNIMODAL": return buildUnimodal(count, seed); case "RIGHT_SKEWED": return buildRightSkewed(count, seed); case "LEFT_SKEWED": return buildLeftSkewed(count, seed); case "ASCENDING": return buildAscending(count, seed); case "DESCENDING": return buildDescending(count, seed); case "CONTROLLED_IRREGULAR": return buildControlledIrregular(count, seed); } }
function niceYAxisStep(maxFrequency: number) { const rough = Math.max(1, maxFrequency / 6); const magnitude = 10 ** Math.floor(Math.log10(rough)); const normalized = rough / magnitude; const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10; return nice * magnitude; }
function escapeSvgText(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;"); }
function intervalLabel(bin: Di009HistogramBin) { return `${bin.lower}–${bin.upper}`; }

export function renderDi009HistogramSvg(stimulus: Omit<Di009Stimulus, "svg">): string {
  const width = 900, height = 480, left = 92, right = 34, top = 72, bottom = 96;
  const plotWidth = width - left - right, plotHeight = height - top - bottom, plotRight = left + plotWidth, plotBottom = top + plotHeight;
  const maxFrequency = Math.max(...stimulus.bins.map((bin) => bin.frequency));
  const yStep = niceYAxisStep(maxFrequency), roundedYMax = yStep * Math.ceil(maxFrequency / yStep), yMax = roundedYMax === maxFrequency ? roundedYMax + yStep : roundedYMax;
  const boundaryPositions = Array.from({ length: stimulus.bins.length + 1 }, (_, index) => Number((left + (plotWidth * index) / stimulus.bins.length).toFixed(3)));
  const safeTitle = escapeSvgText(stimulus.title), safeXAxis = escapeSvgText(stimulus.xAxisLabel), safeYAxis = escapeSvgText(stimulus.yAxisLabel);
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-chart-theme="${DIAGRAM_THEME}" data-color-palette="${DIAGRAM_PALETTE}" data-plot-headroom="true" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`, `<desc>Continuous equal-width histogram with ${stimulus.bins.length} class intervals. Frequency is represented by bar height.</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${COLORS.canvas}"/>`,
    `<text x="${width / 2}" y="35" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="21" font-weight="700" fill="${COLORS.title}">${safeTitle}</text>`,
    `<rect data-plot-area="true" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" rx="8" fill="${COLORS.plot}" stroke="${COLORS.plotBorder}" stroke-width="1"/>`,
  ];
  for (let value = 0, tickIndex = 0; value <= yMax; value += yStep, tickIndex += 1) { const y = plotBottom - (value / yMax) * plotHeight; if (value > 0) parts.push(`<line data-gridline="${tickIndex}" x1="${left}" y1="${y.toFixed(2)}" x2="${plotRight}" y2="${y.toFixed(2)}" stroke="${COLORS.grid}" stroke-width="1" stroke-dasharray="3 5"/>`); parts.push(`<line data-y-tick="${tickIndex}" x1="${left - 5}" y1="${y.toFixed(2)}" x2="${left}" y2="${y.toFixed(2)}" stroke="${COLORS.yTick}" stroke-width="1" vector-effect="non-scaling-stroke"/>`); parts.push(`<text x="${left - 13}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="12" fill="${COLORS.tickText}">${value}</text>`); }
  parts.push(`<line data-axis="y" x1="${left}" y1="${top}" x2="${left}" y2="${plotBottom}" stroke="${COLORS.axis}" stroke-width="1.7" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<line data-axis="x" data-baseline-owned-by-axis="true" x1="${left}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${COLORS.axis}" stroke-width="1.7" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<g data-contiguous-bars="true" data-renderer-version="V4" data-bar-palette="${DIAGRAM_PALETTE}">`);
  stimulus.bins.forEach((bin, index) => { const x = boundaryPositions[index]!, nextX = boundaryPositions[index + 1]!, barWidth = nextX - x, h = (bin.frequency / yMax) * plotHeight, y = plotBottom - h; parts.push(`<rect data-bin-index="${index}" x="${x.toFixed(3)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(3)}" height="${h.toFixed(2)}" fill="${COLORS.barFill}" stroke="${COLORS.barStroke}" stroke-width="1.15" vector-effect="non-scaling-stroke"/>`); });
  parts.push(`</g>`);
  for (let boundaryIndex = 1; boundaryIndex <= stimulus.bins.length; boundaryIndex += 1) { const x = boundaryPositions[boundaryIndex]!; parts.push(`<line data-boundary-tick="${boundaryIndex}" x1="${x.toFixed(3)}" y1="${plotBottom}" x2="${x.toFixed(3)}" y2="${plotBottom + 6}" stroke="${COLORS.barStroke}" stroke-width="1" vector-effect="non-scaling-stroke"/>`); }
  stimulus.bins.forEach((bin, index) => { const x = (boundaryPositions[index]! + boundaryPositions[index + 1]!) / 2; parts.push(`<text data-class-interval-label="${index}" x="${x.toFixed(3)}" y="${plotBottom + 28}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11.5" font-weight="550" fill="${COLORS.intervalText}">${escapeSvgText(intervalLabel(bin))}</text>`); });
  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 21}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="650" fill="${COLORS.axisLabel}">${safeXAxis}</text>`);
  parts.push(`<text x="27" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 27 ${top + plotHeight / 2})" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="650" fill="${COLORS.axisLabel}">${safeYAxis}</text>`);
  parts.push(`</svg>`); return parts.join("");
}

export function buildDi009Stimulus(seed: string, profile: Di009ExamProfile): Di009Stimulus {
  const context = pick(seededRandom(`${seed}:${profile}:context`), CONTEXTS); const classCount = pick(seededRandom(`${seed}:${profile}:class-count`), [5, 6, 7, 8, 9] as const); const shape = pick(seededRandom(`${seed}:${profile}:shape`), SHAPES); const scale = pick(seededRandom(`${seed}:${profile}:scale`), profile === "SSC_CGL_TIER_II" ? [1, 1, 2] as const : [1, 1, 1, 2] as const); const frequencies = frequenciesFor(shape, classCount, `${seed}:${profile}`).map((value) => value * scale); const bins: Di009HistogramBin[] = frequencies.map((frequency, index) => ({ lower: context.start + index * context.width, upper: context.start + (index + 1) * context.width, frequency })); const core = { kind: "HISTOGRAM" as const, title: context.title, instruction: "Study the histogram and answer the questions that follow.", bins, classWidth: context.width, shape, xAxisLabel: context.xAxisLabel, yAxisLabel: context.yAxisLabel, unit: context.unit }; return { ...core, svg: renderDi009HistogramSvg(core) };
}
