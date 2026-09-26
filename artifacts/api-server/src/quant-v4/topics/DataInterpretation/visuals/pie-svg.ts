import type { Di005V2Stimulus } from "../DI-005/pie-v2-types";

export const DI_PIE_VISUAL_THEME = "EXAMTREE_DI_PIE_CLEAN_V1" as const;
export const DI_PIE_COLOR_PALETTE = "EXAMTREE_BALANCED_MULTICOLOUR" as const;

const COLORS = [
  { fill: "#6c8cf5", stroke: "#4c67c8" },
  { fill: "#62c6b0", stroke: "#3d927f" },
  { fill: "#f2b66d", stroke: "#c98940" },
  { fill: "#b58de8", stroke: "#8663b9" },
  { fill: "#ef7f8f", stroke: "#c45163" },
] as const;

function escapeSvgText(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function polar(cx: number, cy: number, radius: number, degrees: number) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
}

function sectorPath(cx: number, cy: number, radius: number, startDeg: number, endDeg: number) {
  const start = polar(cx, cy, radius, endDeg);
  const end = polar(cx, cy, radius, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${start.x.toFixed(2)} ${start.y.toFixed(2)}`,
    `A ${radius} ${radius} 0 ${largeArc} 0 ${end.x.toFixed(2)} ${end.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/** Presentation-only pie renderer. Question generators store semantic pie data only. */
export function renderDiPieSvg(model: Di005V2Stimulus): string {
  if (model.slices.length !== 5) throw new Error("DI pie renderer requires exactly five slices.");
  const totalPercent = model.slices.reduce((sum, slice) => sum + slice.percent, 0);
  if (totalPercent !== 100) throw new Error("DI pie renderer requires shares totaling 100%.");
  if (!model.slices.every((slice) => Number.isFinite(slice.percent) && slice.percent > 0)) {
    throw new Error("DI pie renderer received an invalid slice percentage.");
  }

  const width = 940;
  const height = 520;
  const cx = 320;
  const cy = 275;
  const radius = 168;
  const labelRadius = 103;
  const title = escapeSvgText(model.title);
  const description = escapeSvgText(model.description ?? "Pie chart with five categories. One percentage label may be hidden and shown as a question mark.");
  const totalText = escapeSvgText(`${model.totalLabel}: ${model.totalValue} ${model.unit}`);

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${title}" data-di-presentation-layer="shared" data-pie-chart="true" data-di-chart-theme="${DI_PIE_VISUAL_THEME}" data-color-palette="${DI_PIE_COLOR_PALETTE}" data-renderer-version="SHARED_V1" shape-rendering="geometricPrecision">`,
    `<title>${title}</title>`,
    `<desc>${description}</desc>`,
    `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>`,
    `<text x="${width / 2}" y="34" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#172033">${title}</text>`,
    `<text x="${width / 2}" y="60" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="13" fill="#667085">${totalText}</text>`,
    `<g data-pie-plot="true">`,
  ];

  let startDeg = 0;
  model.slices.forEach((slice, index) => {
    const sweep = slice.percent * 3.6;
    const endDeg = startDeg + sweep;
    const color = COLORS[index % COLORS.length]!;
    parts.push(`<path data-slice="true" data-slice-index="${index}" data-percent="${slice.percent}" d="${sectorPath(cx, cy, radius, startDeg, endDeg)}" fill="${color.fill}" stroke="#ffffff" stroke-width="3" vector-effect="non-scaling-stroke"/>`);

    const midDeg = startDeg + sweep / 2;
    const labelPoint = polar(cx, cy, labelRadius, midDeg);
    const label = slice.displayPercent === "?" ? "?" : `${slice.displayPercent}%`;
    parts.push(`<text data-slice-label="${index}" x="${labelPoint.x.toFixed(2)}" y="${(labelPoint.y + 5).toFixed(2)}" text-anchor="middle" font-family="Inter, Arial, sans-serif" font-size="15" font-weight="700" fill="#172033">${escapeSvgText(label)}</text>`);
    startDeg = endDeg;
  });
  parts.push(`</g>`);

  const legendX = 590;
  const legendStartY = 170;
  model.slices.forEach((slice, index) => {
    const y = legendStartY + index * 52;
    const color = COLORS[index % COLORS.length]!;
    parts.push(`<g data-legend-item="${index}">`);
    parts.push(`<rect x="${legendX}" y="${y - 13}" width="18" height="18" rx="3" fill="${color.fill}" stroke="${color.stroke}" stroke-width="1"/>`);
    parts.push(`<text x="${legendX + 30}" y="${y + 1}" font-family="Inter, Arial, sans-serif" font-size="14" font-weight="600" fill="#344054">${escapeSvgText(slice.category)}</text>`);
    parts.push(`</g>`);
  });

  parts.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="#d0d5dd" stroke-width="1" vector-effect="non-scaling-stroke"/>`);
  parts.push(`</svg>`);
  return parts.join("");
}
