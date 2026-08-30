import {
  ALL_CUBE_FACES_V1,
  CND_001_FOUNDATION_AUTHORITY_V1,
  CUBE_ORIENTATIONS_V1,
  buildStableVoxelStackFromHeightsV1,
  enumeratePaintedCuboidCellsV1,
  foldCubeNetV1,
  observeCubeV1,
  oppositeCubeFaceV1,
  oppositeLabelCandidatesV1,
  oppositeNetLabelV1,
  paintedFaceCountDistributionV1,
  voxelProjectionCountV1,
  type CubeFaceV1,
  type CubeLabelAssignmentV1,
  type CubeNetCellV1,
  type DiceObservationV1,
  type VoxelViewV1,
} from "./cubes-dice-foundation-v1";
import {
  CND_001_EXAM_RENDERER_AUTHORITY_V1,
  renderCubeNetExamSvgV1,
  renderDiceObservationPairExamSvgV1,
  renderPaintedCubeExamSvgV1,
  renderVoxelStackExamSvgV1,
} from "./cubes-dice-exam-renderer-v1";

export type CubesDiceTaskKindV1 =
  | "DICE_OPPOSITE_FROM_TWO_VIEWS"
  | "CUBE_NET_OPPOSITE_FACE"
  | "PAINTED_CUBE_EXACT_FACE_COUNT"
  | "VOXEL_ORTHOGRAPHIC_VIEW_COUNT";

export type CubesDiceDifficultyV1 = "EASY" | "MODERATE" | "HARD";

export interface CubesDiceCandidateQuestionV1 {
  version: "CND-001-CANDIDATE-QUESTION-V1";
  chapterCode: "CND-001";
  permanentQlId: null;
  nextPermanentQlId: "SPA-QL-043";
  taskKind: CubesDiceTaskKindV1;
  candidateId:
    | "CND-CAND-A-DICE-RELATION"
    | "CND-CAND-B-CUBE-NET"
    | "CND-CAND-C-PAINTED-CUBE"
    | "CND-CAND-D-ORTHOGRAPHIC-VIEW";
  seed: string;
  difficulty: CubesDiceDifficultyV1;
  stem: string;
  stimulusSvgs: readonly [string];
  options: readonly (string | number)[];
  correctIndex: number;
  answer: string | number;
  scene: Readonly<Record<string, unknown>>;
  solverEvidence: Readonly<Record<string, unknown>>;
  renderer: Readonly<{
    authority: typeof CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId;
    kind: "SVG";
    whiteBackground: true;
    canonicalCamera: true;
    randomWholeFigureTiltAllowed: false;
  }>;
  lifecycle: Readonly<{
    reviewOnly: true;
    permanentQlAllocated: false;
    questionStudioRegistered: false;
    persistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}

export const CND_001_PRODUCTION_GENERATOR_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-PRODUCTION-GENERATOR-V1" as const,
  foundationAuthorityId: CND_001_FOUNDATION_AUTHORITY_V1.authorityId,
  rendererAuthorityId: CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId,
  chapterCode: "CND-001" as const,
  nextPermanentQlId: "SPA-QL-043" as const,
  implementedCandidateFamilies: [
    "CND-CAND-A-DICE-RELATION",
    "CND-CAND-B-CUBE-NET",
    "CND-CAND-C-PAINTED-CUBE",
    "CND-CAND-D-ORTHOGRAPHIC-VIEW",
  ] as const,
  status: "SEEDED_REVIEW_RUNTIME_WITH_EXAM_RENDERER_PRE_QL_ALLOCATION" as const,
  permanentQlAllocationAuthorized: false,
  automaticStudentPublication: false,
});

function hash32(input: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function seededRandom(seed: string): () => number {
  let state = hash32(seed) || 0x6d2b79f5;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(values: readonly T[], random: () => number): T {
  return values[Math.floor(random() * values.length)]!;
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const out = values.slice();
  for (let index = out.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [out[index], out[swapIndex]] = [out[swapIndex]!, out[index]!];
  }
  return out;
}

function shuffledOptions<T extends string | number>(correct: T, distractors: readonly T[], random: () => number): readonly T[] {
  const unique = [correct, ...distractors].filter((value, index, all) => all.indexOf(value) === index);
  if (unique.length < 4) throw new Error("CND-001 requires four unique answer options.");
  return Object.freeze(shuffle(unique.slice(0, 4), random));
}

function lifecycle() {
  return Object.freeze({
    reviewOnly: true as const,
    permanentQlAllocated: false as const,
    questionStudioRegistered: false as const,
    persistenceAllowed: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
    automaticStudentPublication: false as const,
  });
}

function rendererMetadata() {
  return Object.freeze({
    authority: CND_001_EXAM_RENDERER_AUTHORITY_V1.authorityId,
    kind: "SVG" as const,
    whiteBackground: true as const,
    canonicalCamera: true as const,
    randomWholeFigureTiltAllowed: false as const,
  });
}

function assignmentFromLabels(labels: readonly string[], random: () => number): CubeLabelAssignmentV1 {
  const shuffled = shuffle(labels, random);
  const faces: readonly CubeFaceV1[] = ["U", "D", "F", "B", "R", "L"];
  return Object.freeze(Object.fromEntries(faces.map((face, index) => [face, shuffled[index]!])) as Record<CubeFaceV1, string>);
}

function actualOppositeLabel(assignment: CubeLabelAssignmentV1, target: string): string {
  const face = (Object.keys(assignment) as CubeFaceV1[]).find((candidate) => assignment[candidate] === target);
  if (!face) throw new Error(`Unknown die label ${target}.`);
  return assignment[oppositeCubeFaceV1(face)];
}

function diceQuestion(seed: string): CubesDiceCandidateQuestionV1 {
  const random = seededRandom(`${seed}:dice`);
  const labelSets = [
    ["1", "2", "3", "4", "5", "6"],
    ["A", "B", "C", "D", "E", "F"],
    ["P", "Q", "R", "S", "T", "U"],
  ] as const;
  for (let retry = 0; retry < 80; retry += 1) {
    const labels = pick(labelSets, random);
    const assignment = assignmentFromLabels(labels, random);
    const targetLabel = pick(labels, random);
    const orientations = shuffle(CUBE_ORIENTATIONS_V1, random);
    const observations: readonly [DiceObservationV1, DiceObservationV1] = [
      observeCubeV1(assignment, orientations[0]!),
      observeCubeV1(assignment, orientations[1]!),
    ];
    const candidates = oppositeLabelCandidatesV1({ labels, observations, targetLabel });
    const correct = actualOppositeLabel(assignment, targetLabel);
    if (candidates.length !== 1 || candidates[0] !== correct) continue;
    const distractors = shuffle(labels.filter((label) => label !== targetLabel && label !== correct), random).slice(0, 3);
    const options = shuffledOptions(correct, distractors, random);
    return Object.freeze({
      version: "CND-001-CANDIDATE-QUESTION-V1",
      chapterCode: "CND-001",
      permanentQlId: null,
      nextPermanentQlId: "SPA-QL-043",
      taskKind: "DICE_OPPOSITE_FROM_TWO_VIEWS",
      candidateId: "CND-CAND-A-DICE-RELATION",
      seed,
      difficulty: retry < 10 ? "EASY" : "MODERATE",
      stem: `Two positions of the same die are shown. Which face is opposite to ${targetLabel}?`,
      stimulusSvgs: Object.freeze([renderDiceObservationPairExamSvgV1(observations)]) as readonly [string],
      options,
      correctIndex: options.indexOf(correct),
      answer: correct,
      scene: Object.freeze({ labels: [...labels], observations }),
      solverEvidence: Object.freeze({ compatibleOppositeLabels: candidates, exactRotationGroupSize: CUBE_ORIENTATIONS_V1.length }),
      renderer: rendererMetadata(),
      lifecycle: lifecycle(),
    });
  }
  throw new Error(`Unable to generate uniquely solvable CND dice item for seed ${seed}.`);
}

const NET_TEMPLATE: readonly Omit<CubeNetCellV1, "label">[] = Object.freeze([
  { id: "c0", x: 1, y: 1 },
  { id: "c1", x: 0, y: 1 },
  { id: "c2", x: 2, y: 1 },
  { id: "c3", x: 1, y: 0 },
  { id: "c4", x: 1, y: 2 },
  { id: "c5", x: 1, y: 3 },
]);

function netQuestion(seed: string): CubesDiceCandidateQuestionV1 {
  const random = seededRandom(`${seed}:net`);
  const labels = shuffle(["A", "B", "C", "D", "E", "F"], random);
  const cells: readonly CubeNetCellV1[] = NET_TEMPLATE.map((cell, index) => Object.freeze({ ...cell, label: labels[index]! }));
  const folded = foldCubeNetV1(cells);
  if (!folded.valid) throw new Error(`Internal CND cube-net template invalid: ${folded.reason}`);
  const target = pick(labels, random);
  const correct = oppositeNetLabelV1(cells, target);
  const distractors = shuffle(labels.filter((label) => label !== target && label !== correct), random).slice(0, 3);
  const options = shuffledOptions(correct, distractors, random);
  return Object.freeze({
    version: "CND-001-CANDIDATE-QUESTION-V1",
    chapterCode: "CND-001",
    permanentQlId: null,
    nextPermanentQlId: "SPA-QL-043",
    taskKind: "CUBE_NET_OPPOSITE_FACE",
    candidateId: "CND-CAND-B-CUBE-NET",
    seed,
    difficulty: "MODERATE",
    stem: `The given net is folded to form a cube. Which face will be opposite to ${target}?`,
    stimulusSvgs: Object.freeze([renderCubeNetExamSvgV1(cells)]) as readonly [string],
    options,
    correctIndex: options.indexOf(correct),
    answer: correct,
    scene: Object.freeze({ cells }),
    solverEvidence: Object.freeze({ foldedValid: true, normalByCellId: folded.normalByCellId }),
    renderer: rendererMetadata(),
    lifecycle: lifecycle(),
  });
}

function paintedCubeQuestion(seed: string): CubesDiceCandidateQuestionV1 {
  const random = seededRandom(`${seed}:paint`);
  const n = 3 + Math.floor(random() * 5);
  const paintedFaceCount = Math.floor(random() * 4);
  const cells = enumeratePaintedCuboidCellsV1({ xCount: n, yCount: n, zCount: n, paintedFaces: ALL_CUBE_FACES_V1 });
  const distribution = paintedFaceCountDistributionV1(cells);
  const correct = distribution[paintedFaceCount] ?? 0;
  const distractorPool = [correct + 1, Math.max(0, correct - 1), correct + Math.max(2, n - 2), Math.max(0, correct - Math.max(2, n - 2))];
  const options = shuffledOptions(correct, distractorPool, random);
  return Object.freeze({
    version: "CND-001-CANDIDATE-QUESTION-V1",
    chapterCode: "CND-001",
    permanentQlId: null,
    nextPermanentQlId: "SPA-QL-043",
    taskKind: "PAINTED_CUBE_EXACT_FACE_COUNT",
    candidateId: "CND-CAND-C-PAINTED-CUBE",
    seed,
    difficulty: paintedFaceCount === 0 ? "MODERATE" : "EASY",
    stem: `A cube is painted on all six faces and divided into ${n ** 3} equal smaller cubes. How many smaller cubes have exactly ${paintedFaceCount} painted face${paintedFaceCount === 1 ? "" : "s"}?`,
    stimulusSvgs: Object.freeze([renderPaintedCubeExamSvgV1(n)]) as readonly [string],
    options,
    correctIndex: options.indexOf(correct),
    answer: correct,
    scene: Object.freeze({ subdivisionsPerEdge: n, paintedFaces: ALL_CUBE_FACES_V1 }),
    solverEvidence: Object.freeze({ coordinateEnumerationCount: cells.length, distribution }),
    renderer: rendererMetadata(),
    lifecycle: lifecycle(),
  });
}

function voxelQuestion(seed: string): CubesDiceCandidateQuestionV1 {
  const random = seededRandom(`${seed}:voxel`);
  const heights = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => Math.floor(random() * 4)));
  if (heights.every((row) => row.every((height) => height === 0))) heights[1]![1] = 1;
  const voxels = buildStableVoxelStackFromHeightsV1(heights);
  const view = pick(["TOP", "FRONT", "RIGHT"] as const satisfies readonly VoxelViewV1[], random);
  const correct = voxelProjectionCountV1(voxels, view);
  const options = shuffledOptions(correct, [correct + 1, Math.max(0, correct - 1), correct + 2, Math.max(0, correct - 2)], random);
  return Object.freeze({
    version: "CND-001-CANDIDATE-QUESTION-V1",
    chapterCode: "CND-001",
    permanentQlId: null,
    nextPermanentQlId: "SPA-QL-043",
    taskKind: "VOXEL_ORTHOGRAPHIC_VIEW_COUNT",
    candidateId: "CND-CAND-D-ORTHOGRAPHIC-VIEW",
    seed,
    difficulty: view === "TOP" ? "EASY" : "MODERATE",
    stem: `A stack of unit cubes is shown. How many unit squares appear in its ${view.toLowerCase()} orthographic view?`,
    stimulusSvgs: Object.freeze([renderVoxelStackExamSvgV1(heights)]) as readonly [string],
    options,
    correctIndex: options.indexOf(correct),
    answer: correct,
    scene: Object.freeze({ heights, view }),
    solverEvidence: Object.freeze({ voxelCount: voxels.length, projectionCount: correct }),
    renderer: rendererMetadata(),
    lifecycle: lifecycle(),
  });
}

export function generateCubesDiceCandidateQuestionV1(input: Readonly<{
  seed: string;
  taskKind: CubesDiceTaskKindV1;
}>): CubesDiceCandidateQuestionV1 {
  if (!input.seed.trim()) throw new Error("CND-001 seed must not be empty.");
  if (input.taskKind === "DICE_OPPOSITE_FROM_TWO_VIEWS") return diceQuestion(input.seed);
  if (input.taskKind === "CUBE_NET_OPPOSITE_FACE") return netQuestion(input.seed);
  if (input.taskKind === "PAINTED_CUBE_EXACT_FACE_COUNT") return paintedCubeQuestion(input.seed);
  return voxelQuestion(input.seed);
}
