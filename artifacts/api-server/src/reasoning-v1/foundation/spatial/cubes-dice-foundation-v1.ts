export type CubeFaceV1 = "U" | "D" | "F" | "B" | "R" | "L";
export type CubeVectorV1 = readonly [number, number, number];
export type CubeMatrixV1 = readonly [CubeVectorV1, CubeVectorV1, CubeVectorV1];

export const CND_001_FOUNDATION_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-FOUNDATION-V1" as const,
  chapterCode: "CND-001" as const,
  nextPermanentQlId: "SPA-QL-043" as const,
  orientationGroupSize: 24 as const,
  modules: [
    "DICE_ORIENTATION",
    "OPPOSITE_AND_ADJACENT_FACES",
    "POSSIBLE_IMPOSSIBLE_ARRANGEMENTS",
    "CUBE_NETS",
    "PAINTED_CUBES_AND_CUBOIDS",
    "INCOMPLETE_CUBE_STACKS",
    "TOP_FRONT_SIDE_VIEWS",
  ] as const,
  status: "EXECUTABLE_FOUNDATION_BEFORE_PERMANENT_QL_ALLOCATION" as const,
  automaticStudentPublication: false,
});

const FACE_NORMALS: Readonly<Record<CubeFaceV1, CubeVectorV1>> = Object.freeze({
  U: [0, 0, 1],
  D: [0, 0, -1],
  F: [0, -1, 0],
  B: [0, 1, 0],
  R: [1, 0, 0],
  L: [-1, 0, 0],
});

const OPPOSITE_FACE: Readonly<Record<CubeFaceV1, CubeFaceV1>> = Object.freeze({
  U: "D",
  D: "U",
  F: "B",
  B: "F",
  R: "L",
  L: "R",
});

const IDENTITY: CubeMatrixV1 = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
const RX_90: CubeMatrixV1 = [
  [1, 0, 0],
  [0, 0, -1],
  [0, 1, 0],
];
const RY_90: CubeMatrixV1 = [
  [0, 0, 1],
  [0, 1, 0],
  [-1, 0, 0],
];
const RZ_90: CubeMatrixV1 = [
  [0, -1, 0],
  [1, 0, 0],
  [0, 0, 1],
];

function dot(a: CubeVectorV1, b: CubeVectorV1): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function applyMatrix(matrix: CubeMatrixV1, vector: CubeVectorV1): CubeVectorV1 {
  return [dot(matrix[0], vector), dot(matrix[1], vector), dot(matrix[2], vector)];
}

function multiplyMatrices(a: CubeMatrixV1, b: CubeMatrixV1): CubeMatrixV1 {
  const columns: readonly CubeVectorV1[] = [
    [b[0][0], b[1][0], b[2][0]],
    [b[0][1], b[1][1], b[2][1]],
    [b[0][2], b[1][2], b[2][2]],
  ];
  return [
    [dot(a[0], columns[0]), dot(a[0], columns[1]), dot(a[0], columns[2])],
    [dot(a[1], columns[0]), dot(a[1], columns[1]), dot(a[1], columns[2])],
    [dot(a[2], columns[0]), dot(a[2], columns[1]), dot(a[2], columns[2])],
  ];
}

function matrixKey(matrix: CubeMatrixV1): string {
  return matrix.flat().join(",");
}

function vectorKey(vector: CubeVectorV1): string {
  return vector.join(",");
}

function faceFromNormal(vector: CubeVectorV1): CubeFaceV1 {
  for (const [face, normal] of Object.entries(FACE_NORMALS) as [CubeFaceV1, CubeVectorV1][]) {
    if (vectorKey(vector) === vectorKey(normal)) return face;
  }
  throw new Error(`Invalid cube normal ${vectorKey(vector)}.`);
}

export interface CubeOrientationV1 {
  id: string;
  matrix: CubeMatrixV1;
  worldFaceToCanonicalFace: Readonly<Record<CubeFaceV1, CubeFaceV1>>;
}

function buildCubeOrientations(): readonly CubeOrientationV1[] {
  const queue: CubeMatrixV1[] = [IDENTITY];
  const seen = new Map<string, CubeMatrixV1>();
  while (queue.length > 0) {
    const matrix = queue.shift()!;
    const key = matrixKey(matrix);
    if (seen.has(key)) continue;
    seen.set(key, matrix);
    for (const generator of [RX_90, RY_90, RZ_90] as const) {
      queue.push(multiplyMatrices(generator, matrix));
    }
  }
  const matrices = [...seen.values()];
  if (matrices.length !== 24) {
    throw new Error(`Cube rotation group must contain exactly 24 proper orientations; got ${matrices.length}.`);
  }
  return Object.freeze(matrices.map((matrix, index) => {
    const worldFaceToCanonicalFace = {} as Record<CubeFaceV1, CubeFaceV1>;
    for (const canonicalFace of Object.keys(FACE_NORMALS) as CubeFaceV1[]) {
      const worldFace = faceFromNormal(applyMatrix(matrix, FACE_NORMALS[canonicalFace]));
      worldFaceToCanonicalFace[worldFace] = canonicalFace;
    }
    return Object.freeze({
      id: `CND-ROT-${String(index + 1).padStart(2, "0")}`,
      matrix,
      worldFaceToCanonicalFace: Object.freeze(worldFaceToCanonicalFace),
    });
  }));
}

export const CUBE_ORIENTATIONS_V1 = buildCubeOrientations();

export function oppositeCubeFaceV1(face: CubeFaceV1): CubeFaceV1 {
  return OPPOSITE_FACE[face];
}

export function areAdjacentCubeFacesV1(a: CubeFaceV1, b: CubeFaceV1): boolean {
  return a !== b && OPPOSITE_FACE[a] !== b;
}

export type CubeLabelAssignmentV1 = Readonly<Record<CubeFaceV1, string>>;

export interface DiceObservationV1 {
  top: string;
  front: string;
  right: string;
}

export function observeCubeV1(
  assignment: CubeLabelAssignmentV1,
  orientation: CubeOrientationV1,
): DiceObservationV1 {
  return Object.freeze({
    top: assignment[orientation.worldFaceToCanonicalFace.U],
    front: assignment[orientation.worldFaceToCanonicalFace.F],
    right: assignment[orientation.worldFaceToCanonicalFace.R],
  });
}

function permutations(values: readonly string[]): string[][] {
  if (values.length <= 1) return [values.slice()];
  const out: string[][] = [];
  for (let index = 0; index < values.length; index += 1) {
    const head = values[index]!;
    const rest = values.filter((_, candidateIndex) => candidateIndex !== index);
    for (const tail of permutations(rest)) out.push([head, ...tail]);
  }
  return out;
}

function assignmentFromPermutation(values: readonly string[]): CubeLabelAssignmentV1 {
  const faces: readonly CubeFaceV1[] = ["U", "D", "F", "B", "R", "L"];
  return Object.freeze(Object.fromEntries(faces.map((face, index) => [face, values[index]!])) as Record<CubeFaceV1, string>);
}

function supportsObservation(assignment: CubeLabelAssignmentV1, observation: DiceObservationV1): boolean {
  return CUBE_ORIENTATIONS_V1.some((orientation) => {
    const visible = observeCubeV1(assignment, orientation);
    return visible.top === observation.top && visible.front === observation.front && visible.right === observation.right;
  });
}

export function solveDiceAssignmentsV1(input: Readonly<{
  labels: readonly string[];
  observations: readonly DiceObservationV1[];
}>): readonly CubeLabelAssignmentV1[] {
  if (input.labels.length !== 6 || new Set(input.labels).size !== 6) {
    throw new Error("CND-001 dice solver requires exactly six unique face labels.");
  }
  if (input.observations.length < 1) throw new Error("CND-001 dice solver requires at least one observation.");
  return Object.freeze(
    permutations(input.labels)
      .map(assignmentFromPermutation)
      .filter((assignment) => input.observations.every((observation) => supportsObservation(assignment, observation))),
  );
}

export function oppositeLabelCandidatesV1(input: Readonly<{
  labels: readonly string[];
  observations: readonly DiceObservationV1[];
  targetLabel: string;
}>): readonly string[] {
  const candidates = new Set<string>();
  for (const assignment of solveDiceAssignmentsV1(input)) {
    const face = (Object.keys(assignment) as CubeFaceV1[]).find((candidate) => assignment[candidate] === input.targetLabel);
    if (!face) continue;
    candidates.add(assignment[oppositeCubeFaceV1(face)]);
  }
  return Object.freeze([...candidates].sort());
}

export interface CubeNetCellV1 {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface FoldFrameV1 {
  normal: CubeVectorV1;
  right: CubeVectorV1;
  up: CubeVectorV1;
}

function neg(vector: CubeVectorV1): CubeVectorV1 {
  return [-vector[0], -vector[1], -vector[2]];
}

function sameVector(a: CubeVectorV1, b: CubeVectorV1): boolean {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

function foldFrame(frame: FoldFrameV1, dx: number, dy: number): FoldFrameV1 {
  if (dx === 1 && dy === 0) return { normal: frame.right, right: neg(frame.normal), up: frame.up };
  if (dx === -1 && dy === 0) return { normal: neg(frame.right), right: frame.normal, up: frame.up };
  if (dx === 0 && dy === -1) return { normal: frame.up, right: frame.right, up: neg(frame.normal) };
  if (dx === 0 && dy === 1) return { normal: neg(frame.up), right: frame.right, up: frame.normal };
  throw new Error("Cube-net cells must be orthogonally adjacent.");
}

export interface FoldedCubeNetV1 {
  valid: boolean;
  reason: string | null;
  normalByCellId: Readonly<Record<string, CubeVectorV1>>;
}

export function foldCubeNetV1(cells: readonly CubeNetCellV1[]): FoldedCubeNetV1 {
  if (cells.length !== 6) return { valid: false, reason: "A cube net must contain exactly six cells.", normalByCellId: {} };
  const coordinateMap = new Map<string, CubeNetCellV1>();
  const idSet = new Set<string>();
  for (const cell of cells) {
    const key = `${cell.x},${cell.y}`;
    if (coordinateMap.has(key) || idSet.has(cell.id)) {
      return { valid: false, reason: "Cube-net cells must have unique ids and coordinates.", normalByCellId: {} };
    }
    coordinateMap.set(key, cell);
    idSet.add(cell.id);
  }
  const frames = new Map<string, FoldFrameV1>();
  frames.set(cells[0]!.id, { normal: [0, 0, 1], right: [1, 0, 0], up: [0, 1, 0] });
  const queue = [cells[0]!];
  while (queue.length > 0) {
    const current = queue.shift()!;
    const currentFrame = frames.get(current.id)!;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, -1], [0, 1]] as const) {
      const neighbour = coordinateMap.get(`${current.x + dx},${current.y + dy}`);
      if (!neighbour) continue;
      const nextFrame = foldFrame(currentFrame, dx, dy);
      const existing = frames.get(neighbour.id);
      if (existing) {
        if (!sameVector(existing.normal, nextFrame.normal) || !sameVector(existing.right, nextFrame.right) || !sameVector(existing.up, nextFrame.up)) {
          return { valid: false, reason: "Cube net folds inconsistently.", normalByCellId: {} };
        }
      } else {
        frames.set(neighbour.id, nextFrame);
        queue.push(neighbour);
      }
    }
  }
  if (frames.size !== 6) return { valid: false, reason: "Cube net is disconnected.", normalByCellId: {} };
  const normalKeys = new Set([...frames.values()].map((frame) => vectorKey(frame.normal)));
  if (normalKeys.size !== 6) return { valid: false, reason: "Cube net overlaps two cells onto the same cube face.", normalByCellId: {} };
  const normalByCellId = Object.fromEntries([...frames.entries()].map(([id, frame]) => [id, frame.normal]));
  return { valid: true, reason: null, normalByCellId: Object.freeze(normalByCellId) };
}

export function oppositeNetLabelV1(cells: readonly CubeNetCellV1[], targetLabel: string): string {
  const folded = foldCubeNetV1(cells);
  if (!folded.valid) throw new Error(folded.reason ?? "Invalid cube net.");
  const target = cells.find((cell) => cell.label === targetLabel);
  if (!target) throw new Error(`Unknown cube-net label ${targetLabel}.`);
  const targetNormal = folded.normalByCellId[target.id]!;
  const oppositeNormal = neg(targetNormal);
  const opposite = cells.find((cell) => sameVector(folded.normalByCellId[cell.id]!, oppositeNormal));
  if (!opposite) throw new Error(`Unable to resolve opposite face for ${targetLabel}.`);
  return opposite.label;
}

export interface PaintedCuboidCellV1 {
  x: number;
  y: number;
  z: number;
  paintedFaces: readonly CubeFaceV1[];
}

export const ALL_CUBE_FACES_V1 = Object.freeze(["U", "D", "F", "B", "R", "L"] as const);

export function enumeratePaintedCuboidCellsV1(input: Readonly<{
  xCount: number;
  yCount: number;
  zCount: number;
  paintedFaces?: readonly CubeFaceV1[];
}>): readonly PaintedCuboidCellV1[] {
  for (const value of [input.xCount, input.yCount, input.zCount]) {
    if (!Number.isInteger(value) || value < 1) throw new Error("Cuboid subdivision counts must be positive integers.");
  }
  const painted = new Set<CubeFaceV1>(input.paintedFaces ?? ALL_CUBE_FACES_V1);
  const cells: PaintedCuboidCellV1[] = [];
  for (let x = 0; x < input.xCount; x += 1) {
    for (let y = 0; y < input.yCount; y += 1) {
      for (let z = 0; z < input.zCount; z += 1) {
        const faces: CubeFaceV1[] = [];
        if (x === 0 && painted.has("L")) faces.push("L");
        if (x === input.xCount - 1 && painted.has("R")) faces.push("R");
        if (y === 0 && painted.has("F")) faces.push("F");
        if (y === input.yCount - 1 && painted.has("B")) faces.push("B");
        if (z === 0 && painted.has("D")) faces.push("D");
        if (z === input.zCount - 1 && painted.has("U")) faces.push("U");
        cells.push(Object.freeze({ x, y, z, paintedFaces: Object.freeze(faces) }));
      }
    }
  }
  return Object.freeze(cells);
}

export function paintedFaceCountDistributionV1(cells: readonly PaintedCuboidCellV1[]): Readonly<Record<number, number>> {
  const distribution: Record<number, number> = {};
  for (const cell of cells) distribution[cell.paintedFaces.length] = (distribution[cell.paintedFaces.length] ?? 0) + 1;
  return Object.freeze(distribution);
}

export interface VoxelV1 { x: number; y: number; z: number }
export type VoxelViewV1 = "TOP" | "FRONT" | "RIGHT";

export function buildStableVoxelStackFromHeightsV1(heights: readonly (readonly number[])[]): readonly VoxelV1[] {
  const voxels: VoxelV1[] = [];
  for (let y = 0; y < heights.length; y += 1) {
    const row = heights[y]!;
    for (let x = 0; x < row.length; x += 1) {
      const height = row[x]!;
      if (!Number.isInteger(height) || height < 0) throw new Error("Voxel-stack heights must be non-negative integers.");
      for (let z = 0; z < height; z += 1) voxels.push({ x, y, z });
    }
  }
  return Object.freeze(voxels);
}

export function voxelProjectionCountV1(voxels: readonly VoxelV1[], view: VoxelViewV1): number {
  const cells = new Set<string>();
  for (const voxel of voxels) {
    if (view === "TOP") cells.add(`${voxel.x},${voxel.y}`);
    else if (view === "FRONT") cells.add(`${voxel.x},${voxel.z}`);
    else cells.add(`${voxel.y},${voxel.z}`);
  }
  return cells.size;
}

export function exposedVoxelFaceCountV1(voxels: readonly VoxelV1[]): number {
  const occupied = new Set(voxels.map((voxel) => `${voxel.x},${voxel.y},${voxel.z}`));
  let exposed = 0;
  for (const voxel of voxels) {
    for (const [dx, dy, dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]] as const) {
      if (!occupied.has(`${voxel.x + dx},${voxel.y + dy},${voxel.z + dz}`)) exposed += 1;
    }
  }
  return exposed;
}
