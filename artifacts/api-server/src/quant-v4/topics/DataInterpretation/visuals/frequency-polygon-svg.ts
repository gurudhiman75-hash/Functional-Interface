export type DiFrequencyPolygonVisualClass = Readonly<{ lower: number; upper: number; classMark: number; frequency: number }>;
export type DiFrequencyPolygonVisualModel = Readonly<{ title: string; xAxisLabel: string; yAxisLabel: string; classWidth: number; classes: readonly DiFrequencyPolygonVisualClass[]; description?: string }>;

export const DI_FREQUENCY_POLYGON_VISUAL_THEME = "EXAMTREE_DI_ORIGINAL_FAMILY_V1" as const;

const COLORS = { canvas: "#ffffff", grid: "#e8ecf2", baseline: "#344054", tickText: "#667085", title: "#172033", axisLabel: "#172033", line: "#4c67c8", pointFill: "#ffffff", pointStroke: "#4c67c8", endpoint: "#98a2b3" } as const;

function niceYAxisStep(maxFrequency: number) {
  const rough = Math.max(1, maxFrequency / 6);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const normalized = rough / magnitude;
  const nice = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10;
  return Math.max(1, Math.ceil(nice * magnitude));
}

function escapeSvgText(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

function fmt(value: number) { return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(2))); }

export function renderDiFrequencyPolygonSvg(model: DiFrequencyPolygonVisualModel): string {
  if (model.classes.length < 2) throw new Error("DI frequency-polygon renderer requires at least two classes.");
  if (!model.classes.every((item) => Number.isFinite(item.frequency) && item.frequency >= 0 && item.classMark === (item.lower + item.upper) / 2)) throw new Error("DI frequency-polygon renderer received invalid semantic data.");
  const width = 940, height = 500, left = 92, right = 30, top = 58, bottom = 92;
  const plotWidth = width - left - right, plotHeight = height - top - bottom, plotRight = left + plotWidth, plotBottom = top + plotHeight;
  const firstMark = model.classes[0]!.classMark, lastMark = model.classes[model.classes.length - 1]!.classMark;
  const xMin = firstMark - model.classWidth, xMax = lastMark + model.classWidth;
  const maxFrequency = Math.max(...model.classes.map((item) => item.frequency), 1);
  const yStep = niceYAxisStep(maxFrequency), roundedYMax = yStep * Math.ceil(maxFrequency / yStep), yMax = roundedYMax === maxFrequency ? roundedYMax + yStep : roundedYMax;
  const x = (value: number) => left + ((value - xMin) / (xMax - xMin)) * plotWidth;
  const y = (value: number) => plotBottom - (value / yMax) * plotHeight;
  const points = [{ x: xMin, y: 0 }, ...model.classes.map((item) => ({ x: item.classMark, y: item.frequency })), { x: xMax, y: 0 }];
  const safeTitle = escapeSvgText(model.title), safeXAxis = escapeSvgText(model.xAxisLabel), safeYAxis = escapeSvgText(model.yAxisLabel);
  const safeDescription = escapeSvgText(model.description ?? "Frequency polygon formed by joining class-mark frequency points with straight segments and closing to zero frequency one class width outside the data range.");
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${safeTitle}" data-di-presentation-layer="shared" data-di-chart-theme="${DI_FREQUENCY_POLYGON_VISUAL_THEME}" data-frequency-polygon="true" data-straight-segments="true" data-zero-closing-endpoints="true" data-no-value-labels="true" shape-rendering="geometricPrecision">`,
    `<title>${safeTitle}</title>`,
    `<desc>${safeDescription}</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="${COLORS.canvas}"/>`,
    `<text x="${width / 2}" y="32" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="${COLORS.title}">${safeTitle}</text>`,
  ];
  for (let value = 0, tickIndex = 0; value <= yMax; value += yStep, tickIndex += 1) {
    const yy = y(value);
    if (value > 0) parts.push(`<line data-gridline="${tickIndex}" x1="${left}" y1="${yy.toFixed(2)}" x2="${plotRight}" y2="${yy.toFixed(2)}" stroke="${COLORS.grid}" stroke-width="1" stroke-dasharray="4 6"/>`);
    parts.push(`<text data-y-label="${tickIndex}" x="${left - 14}" y="${(yy + 4).toFixed(2)}" text-anchor="end" font-family="Inter, Arial, sans-serif" font-size="12" fill="${COLORS.tickText}">${fmt(value)}</text>`);
  }
  parts.push(`<line data-axis="x" x1="${left}" y1="${plotBottom}" x2="${plotRight}" y2="${plotBottom}" stroke="${COLORS.baseline}" stroke-width="1.5" vector-effect="non-scaling-stroke"/>`);
  const pointString = points.map((point) => `${x(point.x).toFixed(2)},${y(point.y).toFixed(2)}`).join(" ");
  parts.push(`<polyline data-frequency-polygon-line="true" points="${pointString}" fill="none" stroke="${COLORS.line}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>`);
  parts.push(`<circle data-closing-endpoint="left" cx="${x(xMin).toFixed(2)}" cy="${y(0).toFixed(2)}" r="4" fill="${COLORS.canvas}" stroke="${COLORS.endpoint}" stroke-width="1.5"/>`);
  model.classes.forEach((item, index) => {
    parts.push(`<circle data-point-index="${index}" cx="${x(item.classMark).toFixed(2)}" cy="${y(item.frequency).toFixed(2)}" r="4.5" fill="${COLORS.pointFill}" stroke="${COLORS.pointStroke}" stroke-width="2"/>`);
    parts.push(`<text data-x-label="${index}" x="${x(item.classMark).toFixed(2)}" y="${plotBottom + 28}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="11.5" font-weight="500" fill="${COLORS.tickText}">${fmt(item.classMark)}</text>`);
  });
  parts.push(`<circle data-closing-endpoint="right" cx="${x(xMax).toFixed(2)}" cy="${y(0).toFixed(2)}" r="4" fill="${COLORS.canvas}" stroke="${COLORS.endpoint}" stroke-width="1.5"/>`);
  parts.push(`<text x="${left + plotWidth / 2}" y="${height - 18}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeXAxis}</text>`);
  parts.push(`<text x="24" y="${top + plotHeight / 2}" text-anchor="middle" transform="rotate(-90 24 ${top + plotHeight / 2})" font-family="Inter, Arial, sans-serif" font-size="13" font-weight="600" fill="${COLORS.axisLabel}">${safeYAxis}</text>`);
  parts.push(`</svg>`);
  return parts.join("");
}
