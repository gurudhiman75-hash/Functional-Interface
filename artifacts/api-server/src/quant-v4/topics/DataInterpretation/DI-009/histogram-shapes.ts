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
const DIAGRAM_THEME = "EXAMTREE_DI_MULTICOLOUR_CLEAN_AXIS_V5" as const;
const DIAGRAM_PALETTE = "EXAMTREE_BALANCED_MULTICOLOUR" as const;
const COLORS = {
  canvas: "#ffffff",
  grid: "#e8ecf2",
  baseline: "#344054",
  tickText: "#667085",
  title: "#172033",
  axisLabel: "#172033",
  intervalText: "#344054",
} as const;
const BAR_COLORS = [
  { fill: "#6c8cf5", stroke: "#4c67c8" },
  { fill: "#62c6b0", stroke: "#3d927f" },
  { fill: "#f0b45c", stroke: "#c9872f" },
  { fill: "#a98bef", stroke: "#765cc2" },
  { fill: "#ee8790", stroke: "#c65c67" },
  { fill: "#6fb6e9", stroke: "#4688b5" },
  { fill: "#8bcb68", stroke: "#5e9a40" },
  { fill: "#d895d6", stroke: "#a664a4" },
  { fill: "#e9a36d", stroke: "#b97545" },
] as const;

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
  const width = 940, height = 500, left = 92, right = 28, top = 58, bottom = 92;
  const plotWidth = width - left - right, plotHeight = height - top - bottom, plotRight = left + plotWidth, plotBottom = top + plotHeight;
  const maxFrequency = Math.max(...stimulus.bins.map((bin) => bin.frequency));
  const yStep = niceYAxisStep(maxFrequency), roundedYMax = yStep * Math.ceil(maxFrequency / yStep), yMax = roundedYMax === maxFrequency ? roundedYMax + yStep : roundedYMax;
  const boundaryPositions = Array.from({ length: stimulus.bins.length + 1 }, (_, index) => Number((left + (plotWidth * index) / stimulus.bins.length).toFixed(3)));
  const safeTitle = escapeSvgText(stimulus.title), safeXAxis = escapeSvgText(stimulus.xAxisLabel), safeYAxis = escapeSvgText(stimulus.yAxisLabel);
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-chart-theme="${DIAGRAM_THEME}" data-color-palette="${DIAGRAM_PALETTE}" data-clean-axis="true" data-vertical-axis-spine="none" data-boundary-ticks="none" data-plot-headroom="true" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`,
    `<desc>Continuous equal-width histogram with ${stimulus.bins.length} class intervals. Frequency is represented by bar height.</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${COLORS.canvas}"/>`,
    `<text x="${width / 2}" y="32" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="${COLORS.title}">${safeTitle}</text>`,
    `<rect data-plot-area="true" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" fill="none" stroke="none"/>`,
  ];

  for (let value = 0, tickIndex = 0; value <= yMax; value += yStep, tickIndex += 1) {
    const y = plotBottom - (value / yMax) * plotHeight;
    if (value > 0) parts.push(`<line data-gridline="${tickIndex}" x1="${left}" y1="${y.toFixed(2)}" x2="${plotRight}" y2="${y.toFixed(2)}" stroke="${COLORS.grid}" stroke-width="1" stroke-dasharray="4 6"/>`);
    parts.push(`<text data-y-label="${tickIndex}" x="${left - 14}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="12" fill="${COLORS.tickText}">${value}</text>`);
  }

  parts.push(`<line data-axis="x" data-baseline-owned-by-axis="true" x1="${left}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${COLORS.baseline}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<g data-contiguous-bars="true" data-renderer-version="V5" data-bar-palette="${DIAGRAM_PALETTE}">`);
  stimulus.bins.forEach((bin, index) => {
    const x = boundaryPositions[index]!, nextX = boundaryPositions[index + 1]!, barWidth = nextX - x, h = (bin.frequency / yMax) * plotHeight, y = plotBottom - h;
    const color = BAR_COLORS[index % BAR_COLORS.length]!;
    parts.push(`<rect data-bin-index="${index}" data-bar-color-index="${index % BAR_COLORS.length}" x="${x.toFixed(3)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(3)}" height="${h.toFixed(2)}" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.05" vector-effect="non-scaling-stroke"/>`);
  });
  parts.push(`</g>`);

  stimulus.bins.forEach((bin, index) => {
    const x = (boundaryPositions[index]! + boundaryPositions[index + 1]!) / 2;
    parts.push(`<text data-class-interval-label="${index}" x="${x.toFixed(3)}" y="${plotBottom + 29}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11.5" font-weight="500" fill="${COLORS.intervalText}">${escapeSvgText(intervalLabel(bin))}</text>`);
  });

  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 18}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeXAxis}</text>`);
  parts.push(`<text x="24" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 24 ${top + plotHeight / 2})" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeYAxis}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}

export function buildDi009Stimulus(seed: string, profile: Di009ExamProfile): Di009Stimulus {
  const context = pick(seededRandom(`${seed}:${profile}:context`), CONTEXTS);
  const classCount = pick(seededRandom(`${seed}:${profile}:class-count`), [5, 6, 7, 8, 9] as const);
  const shape = pick(seededRandom(`${seed}:${profile}:shape`), SHAPES);
  const scale = pick(seededRandom(`${seed}:${profile}:scale`), profile === "SSC_CGL_TIER_II" ? [1, 1, 2] as const : [1, 1, 1, 2] as const);
  const frequencies = frequenciesFor(shape, classCount, `${seed}:${profile}`).map((value) => value * scale);
  const bins: Di009HistogramBin[] = frequencies.map((frequency, index) => ({ lower: context.start + index * context.width, upper: context.start + (index + 1) * context.width, frequency }));
  const core = { kind: "HISTOGRAM" as const, title: context.title, instruction: "Study the histogram and answer the questions that follow.", bins, classWidth: context.width, shape, xAxisLabel: context.xAxisLabel, yAxisLabel: context.yAxisLabel, unit: context.unit };
  return { ...core, svg: renderDi009HistogramSvg(core) };
}
