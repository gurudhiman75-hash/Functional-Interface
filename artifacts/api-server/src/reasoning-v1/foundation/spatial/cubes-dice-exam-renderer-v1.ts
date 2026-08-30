import type { CubeNetCellV1, DiceObservationV1 } from "./cubes-dice-foundation-v1";

export const CND_001_EXAM_RENDERER_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-EXAM-RENDERER-V1" as const,
  chapterCode: "CND-001" as const,
  background: "WHITE" as const,
  stroke: "#111827" as const,
  strokeWidth: 1.35 as const,
  cameraPolicy: "CANONICAL_ISOMETRIC_NO_RANDOM_TILT" as const,
  netPolicy: "ORTHOGONAL_EQUAL_SQUARES_CANONICAL_UPRIGHT" as const,
  preservesSemanticAdjacency: true,
  automaticStudentPublication: false,
});

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function svgShell(content: string, width: number, height: number, ariaLabel: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(ariaLabel)}" shape-rendering="geometricPrecision"><rect width="${width}" height="${height}" fill="white"/>${content}</svg>`;
}

const EDGE_STYLE = `fill="white" stroke="#111827" stroke-width="1.35" stroke-linejoin="round"`;
const LINE_STYLE = `stroke="#111827" stroke-width="1.35" stroke-linecap="round" fill="none"`;
const TEXT_STYLE = `font-family="Arial, sans-serif" font-size="18" font-weight="600" text-anchor="middle" dominant-baseline="middle" fill="#111827"`;

export function renderDiceObservationExamSvgV1(observation: DiceObservationV1): string {
  const top = "90,18 148,48 90,78 32,48";
  const front = "32,48 90,78 90,138 32,108";
  const right = "90,78 148,48 148,108 90,138";
  const content = [
    `<polygon points="${top}" ${EDGE_STYLE}/>` ,
    `<polygon points="${front}" ${EDGE_STYLE}/>` ,
    `<polygon points="${right}" ${EDGE_STYLE}/>` ,
    `<text x="90" y="49" ${TEXT_STYLE}>${escapeXml(observation.top)}</text>`,
    `<text x="61" y="94" ${TEXT_STYLE}>${escapeXml(observation.front)}</text>`,
    `<text x="119" y="94" ${TEXT_STYLE}>${escapeXml(observation.right)}</text>`,
  ].join("");
  return svgShell(content, 180, 156, "Die view showing top, front and right faces");
}

export function renderDiceObservationPairExamSvgV1(observations: readonly [DiceObservationV1, DiceObservationV1]): string {
  const left = renderDiceObservationExamSvgV1(observations[0])
    .replace(/^<svg[^>]*><rect[^>]*\/>/, "")
    .replace(/<\/svg>$/, "");
  const right = renderDiceObservationExamSvgV1(observations[1])
    .replace(/^<svg[^>]*><rect[^>]*\/>/, "")
    .replace(/<\/svg>$/, "");
  const content = `<g transform="translate(8 0)">${left}</g><g transform="translate(196 0)">${right}</g>`;
  return svgShell(content, 384, 156, "Two positions of the same die");
}

export function renderCubeNetExamSvgV1(cells: readonly CubeNetCellV1[]): string {
  if (cells.length === 0) throw new Error("CND cube-net renderer requires at least one cell.");
  const minX = Math.min(...cells.map((cell) => cell.x));
  const maxX = Math.max(...cells.map((cell) => cell.x));
  const minY = Math.min(...cells.map((cell) => cell.y));
  const maxY = Math.max(...cells.map((cell) => cell.y));
  const cellSize = 44;
  const margin = 12;
  const width = (maxX - minX + 1) * cellSize + margin * 2;
  const height = (maxY - minY + 1) * cellSize + margin * 2;
  const content = cells.map((cell) => {
    const x = margin + (cell.x - minX) * cellSize;
    const y = margin + (cell.y - minY) * cellSize;
    return `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" ${EDGE_STYLE}/><text x="${x + cellSize / 2}" y="${y + cellSize / 2}" ${TEXT_STYLE}>${escapeXml(cell.label)}</text>`;
  }).join("");
  return svgShell(content, width, height, "Open cube net");
}

function lerp(a: readonly [number, number], b: readonly [number, number], t: number): readonly [number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function line(a: readonly [number, number], b: readonly [number, number]): string {
  return `<line x1="${a[0].toFixed(3)}" y1="${a[1].toFixed(3)}" x2="${b[0].toFixed(3)}" y2="${b[1].toFixed(3)}" ${LINE_STYLE}/>`;
}

export function renderPaintedCubeExamSvgV1(subdivisionsPerEdge: number): string {
  if (!Number.isInteger(subdivisionsPerEdge) || subdivisionsPerEdge < 1 || subdivisionsPerEdge > 12) {
    throw new Error("CND painted-cube renderer supports 1 to 12 subdivisions per edge.");
  }
  const A: readonly [number, number] = [92, 18];
  const B: readonly [number, number] = [154, 50];
  const C: readonly [number, number] = [92, 82];
  const D: readonly [number, number] = [30, 50];
  const E: readonly [number, number] = [30, 118];
  const F: readonly [number, number] = [92, 150];
  const G: readonly [number, number] = [154, 118];
  const faces = [
    `<polygon points="${A.join(",")} ${B.join(",")} ${C.join(",")} ${D.join(",")}" ${EDGE_STYLE}/>` ,
    `<polygon points="${D.join(",")} ${C.join(",")} ${F.join(",")} ${E.join(",")}" ${EDGE_STYLE}/>` ,
    `<polygon points="${C.join(",")} ${B.join(",")} ${G.join(",")} ${F.join(",")}" ${EDGE_STYLE}/>` ,
  ];
  const grid: string[] = [];
  for (let index = 1; index < subdivisionsPerEdge; index += 1) {
    const t = index / subdivisionsPerEdge;
    grid.push(line(lerp(D, A, t), lerp(C, B, t)));
    grid.push(line(lerp(A, B, t), lerp(D, C, t)));
    grid.push(line(lerp(D, E, t), lerp(C, F, t)));
    grid.push(line(lerp(D, C, t), lerp(E, F, t)));
    grid.push(line(lerp(B, G, t), lerp(C, F, t)));
    grid.push(line(lerp(B, C, t), lerp(G, F, t)));
  }
  return svgShell(`${faces.join("")}${grid.join("")}`, 184, 168, `Cube divided into ${subdivisionsPerEdge} equal parts per edge`);
}

type Point2 = readonly [number, number];
function isoPoint(x: number, y: number, z: number): Point2 {
  return [112 + (x - y) * 22, 42 + (x + y) * 12 - z * 24];
}

function polygon(points: readonly Point2[]): string {
  return `<polygon points="${points.map((point) => `${point[0].toFixed(2)},${point[1].toFixed(2)}`).join(" ")}" ${EDGE_STYLE}/>`;
}

export function renderVoxelStackExamSvgV1(heights: readonly (readonly number[])[]): string {
  const cubes: { x: number; y: number; z: number }[] = [];
  for (let y = 0; y < heights.length; y += 1) {
    for (let x = 0; x < heights[y]!.length; x += 1) {
      const height = heights[y]![x]!;
      if (!Number.isInteger(height) || height < 0 || height > 8) throw new Error("CND voxel renderer heights must be integers from 0 to 8.");
      for (let z = 0; z < height; z += 1) cubes.push({ x, y, z });
    }
  }
  cubes.sort((a, b) => (a.x + a.y + a.z) - (b.x + b.y + b.z) || a.y - b.y || a.x - b.x || a.z - b.z);
  const content = cubes.map(({ x, y, z }) => {
    const p000 = isoPoint(x, y, z);
    const p100 = isoPoint(x + 1, y, z);
    const p010 = isoPoint(x, y + 1, z);
    const p110 = isoPoint(x + 1, y + 1, z);
    const p001 = isoPoint(x, y, z + 1);
    const p101 = isoPoint(x + 1, y, z + 1);
    const p011 = isoPoint(x, y + 1, z + 1);
    const p111 = isoPoint(x + 1, y + 1, z + 1);
    return [
      polygon([p001, p101, p111, p011]),
      polygon([p010, p110, p111, p011]),
      polygon([p100, p110, p111, p101]),
      line(p000, p100),
      line(p000, p010),
      line(p000, p001),
    ].join("");
  }).join("");
  return svgShell(`<g transform="translate(18 48)">${content}</g>`, 260, 230, "Stack of unit cubes");
}
