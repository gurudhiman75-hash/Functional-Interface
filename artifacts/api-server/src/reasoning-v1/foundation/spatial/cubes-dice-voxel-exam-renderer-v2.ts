import type { VoxelV1 } from "./cubes-dice-foundation-v1";

export const CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2 = Object.freeze({
  authorityId: "CND-001-VOXEL-EXAM-RENDERER-V2" as const,
  chapterCode: "CND-001" as const,
  background: "WHITE" as const,
  stroke: "#111827" as const,
  strokeWidth: 1.35 as const,
  cameraPolicy: "CANONICAL_ISOMETRIC_NO_RANDOM_TILT" as const,
  surfacePolicy: "VISIBLE_POSITIVE_X_POSITIVE_Y_POSITIVE_Z_FACES_ONLY" as const,
  clippingPolicy: "DYNAMIC_CONTENT_BOUNDS_WITH_MARGIN" as const,
  hiddenInteriorEdgesRendered: false,
  randomWholeFigureTiltAllowed: false,
  preservesVoxelOccupancy: true,
  automaticStudentPublication: false,
});

type Point2V2 = readonly [number, number];
type FaceKindV2 = "TOP" | "RIGHT_X" | "LEFT_Y";

interface FaceV2 {
  kind: FaceKindV2;
  cube: VoxelV1;
  points: readonly Point2V2[];
}

const STROKE = "#111827";
const STROKE_WIDTH = 1.35;
const MARGIN = 14;

function escapeXmlV2(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function rawIsoPointV2(x: number, y: number, z: number): Point2V2 {
  return [(x - y) * 24, (x + y) * 13 - z * 26];
}

function keyV2(x: number, y: number, z: number): string {
  return `${x},${y},${z}`;
}

function facePointsV2(cube: VoxelV1, kind: FaceKindV2): readonly Point2V2[] {
  const { x, y, z } = cube;
  const p100 = rawIsoPointV2(x + 1, y, z);
  const p010 = rawIsoPointV2(x, y + 1, z);
  const p110 = rawIsoPointV2(x + 1, y + 1, z);
  const p001 = rawIsoPointV2(x, y, z + 1);
  const p101 = rawIsoPointV2(x + 1, y, z + 1);
  const p011 = rawIsoPointV2(x, y + 1, z + 1);
  const p111 = rawIsoPointV2(x + 1, y + 1, z + 1);
  if (kind === "TOP") return Object.freeze([p001, p101, p111, p011]);
  if (kind === "LEFT_Y") return Object.freeze([p010, p110, p111, p011]);
  return Object.freeze([p100, p110, p111, p101]);
}

function visibleFacesV2(voxels: readonly VoxelV1[]): readonly FaceV2[] {
  const occupied = new Set(voxels.map((voxel) => keyV2(voxel.x, voxel.y, voxel.z)));
  const sorted = [...voxels].sort((a, b) =>
    (a.x + a.y) - (b.x + b.y)
    || a.z - b.z
    || a.y - b.y
    || a.x - b.x,
  );
  const faces: FaceV2[] = [];
  for (const cube of sorted) {
    if (!occupied.has(keyV2(cube.x, cube.y, cube.z + 1))) {
      faces.push(Object.freeze({ kind: "TOP", cube, points: facePointsV2(cube, "TOP") }));
    }
    if (!occupied.has(keyV2(cube.x, cube.y + 1, cube.z))) {
      faces.push(Object.freeze({ kind: "LEFT_Y", cube, points: facePointsV2(cube, "LEFT_Y") }));
    }
    if (!occupied.has(keyV2(cube.x + 1, cube.y, cube.z))) {
      faces.push(Object.freeze({ kind: "RIGHT_X", cube, points: facePointsV2(cube, "RIGHT_X") }));
    }
  }
  return Object.freeze(faces);
}

function normalizedPolygonV2(points: readonly Point2V2[], minX: number, minY: number): string {
  const rendered = points
    .map(([x, y]) => `${(x - minX + MARGIN).toFixed(2)},${(y - minY + MARGIN).toFixed(2)}`)
    .join(" ");
  return `<polygon points="${rendered}" fill="white" stroke="${STROKE}" stroke-width="${STROKE_WIDTH}" stroke-linejoin="round"/>`;
}

export function countVisibleVoxelSurfaceFacesV2(voxels: readonly VoxelV1[]): Readonly<Record<FaceKindV2, number>> {
  const faces = visibleFacesV2(voxels);
  return Object.freeze({
    TOP: faces.filter((face) => face.kind === "TOP").length,
    RIGHT_X: faces.filter((face) => face.kind === "RIGHT_X").length,
    LEFT_Y: faces.filter((face) => face.kind === "LEFT_Y").length,
  });
}

export function renderVoxelStackExamSvgV2(voxels: readonly VoxelV1[]): string {
  if (voxels.length === 0) throw new Error("CND voxel renderer requires at least one occupied unit cube.");
  const unique = new Set<string>();
  for (const voxel of voxels) {
    if (![voxel.x, voxel.y, voxel.z].every((value) => Number.isInteger(value) && value >= 0)) {
      throw new Error("CND voxel renderer requires non-negative integer coordinates.");
    }
    const key = keyV2(voxel.x, voxel.y, voxel.z);
    if (unique.has(key)) throw new Error(`CND voxel renderer received duplicate voxel ${key}.`);
    unique.add(key);
  }

  const faces = visibleFacesV2(voxels);
  const points = faces.flatMap((face) => [...face.points]);
  const minX = Math.min(...points.map(([x]) => x));
  const maxX = Math.max(...points.map(([x]) => x));
  const minY = Math.min(...points.map(([, y]) => y));
  const maxY = Math.max(...points.map(([, y]) => y));
  const width = Math.ceil(maxX - minX + MARGIN * 2);
  const height = Math.ceil(maxY - minY + MARGIN * 2);
  const content = faces.map((face) => normalizedPolygonV2(face.points, minX, minY)).join("");
  const maxVoxelZ = Math.max(...voxels.map((voxel) => voxel.z));
  const maxVoxelX = Math.max(...voxels.map((voxel) => voxel.x));
  const maxVoxelY = Math.max(...voxels.map((voxel) => voxel.y));
  const aria = `Stable unit-cube stack, ${maxVoxelX + 1} by ${maxVoxelY + 1} footprint, ${maxVoxelZ + 1} maximum height`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXmlV2(aria)}" shape-rendering="geometricPrecision"><rect width="${width}" height="${height}" fill="white"/>${content}</svg>`;
}
