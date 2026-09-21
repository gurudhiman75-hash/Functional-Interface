export type DiHistogramVisualBin = Readonly<{
  lower: number;
  upper: number;
  frequency: number;
}>;

export type DiHistogramVisualModel = Readonly<{
  title: string;
  xAxisLabel: string;
  yAxisLabel: string;
  bins: readonly DiHistogramVisualBin[];
  description?: string;
}>;

export const DI_HISTOGRAM_VISUAL_THEME = "EXAMTREE_DI_ORIGINAL_FAMILY_V1" as const;
export const DI_HISTOGRAM_COLOR_PALETTE = "EXAMTREE_BALANCED_MULTICOLOUR" as const;

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

function niceYAxisStep(maxFrequency: number) {
  const rough = Math.max(1, maxFrequency / 6);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return Math.max(1, Math.ceil(nice * magnitude));
}

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function intervalLabel(bin: DiHistogramVisualBin) {
  return `${bin.lower}–${bin.upper}`;
}

/** Presentation-only renderer for equal-width histogram data. */
export function renderDiHistogramSvg(model: DiHistogramVisualModel): string {
  if (model.bins.length === 0) throw new Error("DI histogram renderer requires at least one bin.");
  if (!model.bins.every((bin) => Number.isFinite(bin.frequency) && bin.frequency >= 0)) throw new Error("DI histogram renderer received an invalid frequency.");
  const width = 940, height = 500, left = 92, right = 28, top = 58, bottom = 92;
  const plotWidth = width - left - right, plotHeight = height - top - bottom, plotRight = left + plotWidth, plotBottom = top + plotHeight;
  const maxFrequency = Math.max(...model.bins.map((bin) => bin.frequency), 1);
  const yStep = niceYAxisStep(maxFrequency), roundedYMax = yStep * Math.ceil(maxFrequency / yStep), yMax = roundedYMax === maxFrequency ? roundedYMax + yStep : roundedYMax;
  const boundaryPositions = Array.from({ length: model.bins.length + 1 }, (_, index) => Number((left + (plotWidth * index) / model.bins.length).toFixed(3)));
  const safeTitle = escapeSvgText(model.title), safeXAxis = escapeSvgText(model.xAxisLabel), safeYAxis = escapeSvgText(model.yAxisLabel);
  const safeDescription = escapeSvgText(model.description ?? `Continuous equal-width histogram with ${model.bins.length} class intervals. Frequency is represented by bar height.`);
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-presentation-layer="shared" data-di-chart-theme="${DI_HISTOGRAM_VISUAL_THEME}" data-color-palette="${DI_HISTOGRAM_COLOR_PALETTE}" data-clean-axis="true" data-vertical-axis-spine="none" data-boundary-ticks="none" data-plot-headroom="true" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`,
    `<desc>${safeDescription}</desc>`,
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
  parts.push(`<g data-contiguous-bars="true" data-renderer-version="SHARED_V1" data-bar-palette="${DI_HISTOGRAM_COLOR_PALETTE}">`);
  model.bins.forEach((bin, index) => {
    const x = boundaryPositions[index]!, nextX = boundaryPositions[index + 1]!, barWidth = nextX - x, h = (bin.frequency / yMax) * plotHeight, y = plotBottom - h;
    const color = BAR_COLORS[index % BAR_COLORS.length]!;
    parts.push(`<rect data-bin-index="${index}" data-bar-color-index="${index % BAR_COLORS.length}" x="${x.toFixed(3)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(3)}" height="${h.toFixed(2)}" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1.05" vector-effect="non-scaling-stroke"/>`);
  });
  parts.push(`</g>`);
  model.bins.forEach((bin, index) => {
    const x = (boundaryPositions[index]! + boundaryPositions[index + 1]!) / 2;
    parts.push(`<text data-class-interval-label="${index}" x="${x.toFixed(3)}" y="${plotBottom + 29}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11.5" font-weight="500" fill="${COLORS.intervalText}">${escapeSvgText(intervalLabel(bin))}</text>`);
  });
  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 18}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeXAxis}</text>`);
  parts.push(`<text x="24" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 24 ${top + plotHeight / 2})" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeYAxis}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}
