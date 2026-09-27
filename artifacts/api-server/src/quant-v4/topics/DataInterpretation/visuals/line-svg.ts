export type DiLineVisualPoint = Readonly<{
  period: string;
  seriesA: number;
  seriesB: number;
}>;

export type DiLineVisualModel = Readonly<{
  title: string;
  yAxisLabel: string;
  unitLabel?: string;
  seriesALabel: string;
  seriesBLabel: string;
  points: readonly DiLineVisualPoint[];
  description?: string;
}>;

export const DI_LINE_VISUAL_THEME = "EXAMTREE_DI_LINE_CLEAN_V1" as const;
export const DI_LINE_COLOR_PALETTE = "EXAMTREE_TWO_SERIES_BLUE_TEAL" as const;

const COLORS = {
  canvas: "#ffffff",
  grid: "#e8ecf2",
  baseline: "#344054",
  tickText: "#667085",
  title: "#172033",
  axisLabel: "#172033",
  categoryText: "#344054",
  legendText: "#475467",
  seriesA: "#4c67c8",
  seriesB: "#3d927f",
  pointFill: "#ffffff",
} as const;

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function niceYAxisStep(maxValue: number) {
  const rough = Math.max(1, maxValue / 6);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

/** Presentation-only line-chart renderer. Question generators retain semantic data only. */
export function renderDiLineSvg(model: DiLineVisualModel): string {
  if (model.points.length < 3) throw new Error("DI line renderer requires at least three periods.");
  if (!model.points.every((point) =>
    Number.isFinite(point.seriesA) && point.seriesA >= 0 &&
    Number.isFinite(point.seriesB) && point.seriesB >= 0)) {
    throw new Error("DI line renderer received an invalid plotted value.");
  }

  const width = 940;
  const height = 520;
  const left = 92;
  const right = 34;
  const top = 82;
  const bottom = 92;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const plotRight = left + plotWidth;
  const plotBottom = top + plotHeight;
  const values = model.points.flatMap((point) => [point.seriesA, point.seriesB]);
  const maxValue = Math.max(...values, 1);
  const yStep = niceYAxisStep(maxValue);
  const roundedYMax = yStep * Math.ceil(maxValue / yStep);
  const yMax = roundedYMax === maxValue ? roundedYMax + yStep : roundedYMax;

  const x = (index: number) =>
    model.points.length === 1 ? left + plotWidth / 2 : left + (plotWidth * index) / (model.points.length - 1);
  const y = (value: number) => plotBottom - (value / yMax) * plotHeight;

  const safeTitle = escapeSvgText(model.title);
  const safeYAxis = escapeSvgText(model.unitLabel ? `${model.yAxisLabel} (${model.unitLabel})` : model.yAxisLabel);
  const safeSeriesA = escapeSvgText(model.seriesALabel);
  const safeSeriesB = escapeSvgText(model.seriesBLabel);
  const safeDescription = escapeSvgText(model.description ?? `Line chart with ${model.points.length} ordered periods and two series, ${model.seriesALabel} and ${model.seriesBLabel}.`);

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-presentation-layer="shared" data-line-chart="true" data-di-chart-theme="${DI_LINE_VISUAL_THEME}" data-color-palette="${DI_LINE_COLOR_PALETTE}" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`,
    `<desc>${safeDescription}</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${COLORS.canvas}"/>`,
    `<text x="${width / 2}" y="32" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="22" font-weight="700" fill="${COLORS.title}">${safeTitle}</text>`,
  ];

  for (let value = 0, tickIndex = 0; value <= yMax; value += yStep, tickIndex += 1) {
    const yy = y(value);
    if (value > 0) {
      parts.push(`<line data-gridline="${tickIndex}" x1="${left}" y1="${yy.toFixed(2)}" x2="${plotRight}" y2="${yy.toFixed(2)}" stroke="${COLORS.grid}" stroke-width="1" stroke-dasharray="4 6"/>`);
    }
    parts.push(`<text data-y-label="${tickIndex}" x="${left - 14}" y="${(yy + 4).toFixed(2)}" text-anchor="end" font-family="Inter,Arial,sans-serif" font-size="12" fill="${COLORS.tickText}">${value}</text>`);
  }

  parts.push(`<line data-axis="x" x1="${left}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${COLORS.baseline}" stroke-width="1.5"/>`);

  model.points.forEach((point, index) => {
    const xx = x(index);
    parts.push(`<text data-period-label="${index}" x="${xx.toFixed(2)}" y="${plotBottom + 28}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="500" fill="${COLORS.categoryText}">${escapeSvgText(point.period)}</text>`);
  });

  const lineA = model.points.map((point, index) => `${x(index).toFixed(2)},${y(point.seriesA).toFixed(2)}`).join(" ");
  const lineB = model.points.map((point, index) => `${x(index).toFixed(2)},${y(point.seriesB).toFixed(2)}`).join(" ");

  parts.push(`<polyline data-series="SERIES_A" points="${lineA}" fill="none" stroke="${COLORS.seriesA}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>`);
  parts.push(`<polyline data-series="SERIES_B" points="${lineB}" fill="none" stroke="${COLORS.seriesB}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>`);

  model.points.forEach((point, index) => {
    const xx = x(index);
    parts.push(`<circle data-series-a-point="${index}" cx="${xx.toFixed(2)}" cy="${y(point.seriesA).toFixed(2)}" r="4.5" fill="${COLORS.pointFill}" stroke="${COLORS.seriesA}" stroke-width="2"/>`);
    parts.push(`<circle data-series-b-point="${index}" cx="${xx.toFixed(2)}" cy="${y(point.seriesB).toFixed(2)}" r="4.5" fill="${COLORS.pointFill}" stroke="${COLORS.seriesB}" stroke-width="2"/>`);
  });

  const legendY = 58;
  const centre = width / 2;
  parts.push(`<g data-legend="true">`);
  parts.push(`<line x1="${centre - 170}" y1="${legendY}" x2="${centre - 135}" y2="${legendY}" stroke="${COLORS.seriesA}" stroke-width="2.8"/>`);
  parts.push(`<circle cx="${centre - 152.5}" cy="${legendY}" r="4" fill="${COLORS.pointFill}" stroke="${COLORS.seriesA}" stroke-width="2"/>`);
  parts.push(`<text x="${centre - 125}" y="${legendY + 4}" font-family="Inter,Arial,sans-serif" font-size="12" fill="${COLORS.legendText}">${safeSeriesA}</text>`);
  parts.push(`<line x1="${centre + 32}" y1="${legendY}" x2="${centre + 67}" y2="${legendY}" stroke="${COLORS.seriesB}" stroke-width="2.8"/>`);
  parts.push(`<circle cx="${centre + 49.5}" cy="${legendY}" r="4" fill="${COLORS.pointFill}" stroke="${COLORS.seriesB}" stroke-width="2"/>`);
  parts.push(`<text x="${centre + 77}" y="${legendY + 4}" font-family="Inter,Arial,sans-serif" font-size="12" fill="${COLORS.legendText}">${safeSeriesB}</text>`);
  parts.push(`</g>`);

  parts.push(`<text x="24" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 24 ${top + plotHeight / 2})" font-family="Inter,Arial,sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeYAxis}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}
