export type DiGroupedBarVisualPoint = Readonly<{
  category: string;
  seriesA: number;
  seriesB: number;
}>;

export type DiGroupedBarVisualModel = Readonly<{
  title: string;
  yAxisLabel: string;
  seriesALabel: string;
  seriesBLabel: string;
  points: readonly DiGroupedBarVisualPoint[];
  description?: string;
}>;

export const DI_GROUPED_BAR_VISUAL_THEME = "EXAMTREE_DI_GROUPED_BAR_CLEAN_V1" as const;
export const DI_GROUPED_BAR_COLOR_PALETTE = "EXAMTREE_TWO_SERIES_BLUE_TEAL" as const;

const COLORS = {
  canvas: "#ffffff",
  grid: "#e8ecf2",
  baseline: "#344054",
  tickText: "#667085",
  title: "#172033",
  axisLabel: "#172033",
  categoryText: "#344054",
  legendText: "#475467",
  seriesA: { fill: "#6c8cf5", stroke: "#4c67c8" },
  seriesB: { fill: "#62c6b0", stroke: "#3d927f" },
} as const;

function gcd(a: number, b: number) {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x || 1;
}

function niceYAxisStep(maxValue: number) {
  const rough = Math.max(1, maxValue / 6);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

function readableYAxisStep(values: readonly number[], maxValue: number) {
  const commonUnit = values.filter((value) => value > 0).reduce((current, value) => gcd(current, value), 0);
  if (commonUnit > 0 && maxValue / commonUnit <= 10) return commonUnit;
  return niceYAxisStep(maxValue);
}

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

/** Presentation-only grouped-bar renderer. Semantic question state stays SVG-free. */
export function renderDiGroupedBarSvg(model: DiGroupedBarVisualModel): string {
  if (model.points.length < 3) throw new Error("DI grouped-bar renderer requires at least three categories.");
  if (!model.points.every((point) => Number.isFinite(point.seriesA) && point.seriesA >= 0 && Number.isFinite(point.seriesB) && point.seriesB >= 0)) {
    throw new Error("DI grouped-bar renderer received an invalid bar value.");
  }

  const width = 940;
  const height = 520;
  const left = 92;
  const right = 28;
  const top = 78;
  const bottom = 92;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const plotRight = left + plotWidth;
  const plotBottom = top + plotHeight;
  const values = model.points.flatMap((point) => [point.seriesA, point.seriesB]);
  const maxValue = Math.max(...values, 1);
  const yStep = readableYAxisStep(values, maxValue);
  const roundedYMax = yStep * Math.ceil(maxValue / yStep);
  const yMax = roundedYMax === maxValue ? roundedYMax + yStep : roundedYMax;
  const groupWidth = plotWidth / model.points.length;
  const barWidth = Math.min(58, groupWidth * 0.29);
  const pairGap = Math.min(12, groupWidth * 0.06);
  const safeTitle = escapeSvgText(model.title);
  const safeYAxis = escapeSvgText(model.yAxisLabel);
  const safeSeriesA = escapeSvgText(model.seriesALabel);
  const safeSeriesB = escapeSvgText(model.seriesBLabel);
  const safeDescription = escapeSvgText(model.description ?? `Grouped bar chart with ${model.points.length} categories and two series, ${model.seriesALabel} and ${model.seriesBLabel}. Values are represented by bar height.`);

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-presentation-layer="shared" data-grouped-bar="true" data-di-chart-theme="${DI_GROUPED_BAR_VISUAL_THEME}" data-color-palette="${DI_GROUPED_BAR_COLOR_PALETTE}" data-clean-axis="true" data-vertical-axis-spine="none" data-boundary-ticks="none" data-bar-value-labels="none" data-plot-headroom="true" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`,
    `<desc>${safeDescription}</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${COLORS.canvas}"/>`,
    `<text x="${width / 2}" y="32" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="${COLORS.title}">${safeTitle}</text>`,
    `<rect data-plot-area="true" x="${left}" y="${top}" width="${plotWidth}" height="${plotHeight}" fill="none" stroke="none"/>`,
  ];

  for (let value = 0, tickIndex = 0; value <= yMax; value += yStep, tickIndex += 1) {
    const y = plotBottom - (value / yMax) * plotHeight;
    if (value > 0) {
      parts.push(`<line data-gridline="${tickIndex}" x1="${left}" y1="${y.toFixed(2)}" x2="${plotRight}" y2="${y.toFixed(2)}" stroke="${COLORS.grid}" stroke-width="1" stroke-dasharray="4 6"/>`);
    }
    parts.push(`<text data-y-label="${tickIndex}" x="${left - 14}" y="${(y + 4).toFixed(2)}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="12" fill="${COLORS.tickText}">${value}</text>`);
  }

  parts.push(`<line data-axis="x" data-baseline-owned-by-axis="true" x1="${left}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${COLORS.baseline}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<g data-series="SERIES_A" data-series-color="#6c8cf5">`);
  model.points.forEach((point, index) => {
    const centre = left + groupWidth * (index + 0.5);
    const x = centre - pairGap / 2 - barWidth;
    const h = (point.seriesA / yMax) * plotHeight;
    const y = plotBottom - h;
    parts.push(`<rect data-bar="true" data-series-id="SERIES_A" data-category-index="${index}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${h.toFixed(2)}" rx="1.5" fill="${COLORS.seriesA.fill}" stroke="${COLORS.seriesA.stroke}" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
  });
  parts.push(`</g>`);

  parts.push(`<g data-series="SERIES_B" data-series-color="#62c6b0">`);
  model.points.forEach((point, index) => {
    const centre = left + groupWidth * (index + 0.5);
    const x = centre + pairGap / 2;
    const h = (point.seriesB / yMax) * plotHeight;
    const y = plotBottom - h;
    parts.push(`<rect data-bar="true" data-series-id="SERIES_B" data-category-index="${index}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${h.toFixed(2)}" rx="1.5" fill="${COLORS.seriesB.fill}" stroke="${COLORS.seriesB.stroke}" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
  });
  parts.push(`</g>`);

  model.points.forEach((point, index) => {
    const centre = left + groupWidth * (index + 0.5);
    parts.push(`<text data-category-label="${index}" x="${centre.toFixed(2)}" y="${plotBottom + 28}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="12" font-weight="500" fill="${COLORS.categoryText}">${escapeSvgText(point.category)}</text>`);
  });

  const legendY = 56;
  const legendCentre = width / 2;
  parts.push(`<g data-legend="true">`);
  parts.push(`<rect x="${legendCentre - 160}" y="${legendY - 10}" width="14" height="14" rx="2" fill="${COLORS.seriesA.fill}" stroke="${COLORS.seriesA.stroke}"/>`);
  parts.push(`<text x="${legendCentre - 138}" y="${legendY + 1}" font-family="Inter, Arial, sans-serif" font-size="12" fill="${COLORS.legendText}">${safeSeriesA}</text>`);
  parts.push(`<rect x="${legendCentre + 20}" y="${legendY - 10}" width="14" height="14" rx="2" fill="${COLORS.seriesB.fill}" stroke="${COLORS.seriesB.stroke}"/>`);
  parts.push(`<text x="${legendCentre + 42}" y="${legendY + 1}" font-family="Inter, Arial, sans-serif" font-size="12" fill="${COLORS.legendText}">${safeSeriesB}</text>`);
  parts.push(`</g>`);

  parts.push(`<text x="24" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 24 ${top + plotHeight / 2})" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeYAxis}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}
