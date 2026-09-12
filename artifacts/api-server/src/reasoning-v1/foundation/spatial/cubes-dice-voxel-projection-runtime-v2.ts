import {
  buildStableVoxelStackFromHeightsV1,
  exposedVoxelFaceCountV1,
  voxelProjectionCountV1,
  type VoxelV1,
} from "./cubes-dice-foundation-v1";
import {
  CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2,
  renderVoxelStackExamSvgV2,
} from "./cubes-dice-voxel-exam-renderer-v2";

export type CubesDiceVoxelRuntimeTaskKindV2 =
  | "STACK_TOTAL_CUBES"
  | "STACK_EXPOSED_FACES"
  | "STACK_MISSING_TO_COMPLETE_CUBOID"
  | "ORTHOGRAPHIC_TOP_CELL_COUNT"
  | "ORTHOGRAPHIC_FRONT_CELL_COUNT"
  | "ORTHOGRAPHIC_RIGHT_CELL_COUNT";

export type CubesDiceVoxelDifficultyV2 = "Easy" | "Medium" | "Hard";
export type CubesDiceVoxelCandidateQlIdV2 = "SPA-QL-046" | "SPA-QL-047";

export interface CubesDiceVoxelRuntimeQuestionV2 {
  version: "CND-001-VOXEL-PROJECTION-RUNTIME-QUESTION-V2";
  chapterCode: "CND-001";
  seed: string;
  proposedPermanentQlId: CubesDiceVoxelCandidateQlIdV2;
  canonicalSkillId: "CND-CAN-D-VOXEL-STACK-OCCUPANCY" | "CND-CAN-E-ORTHOGRAPHIC-PROJECTION";
  taskKind: CubesDiceVoxelRuntimeTaskKindV2;
  templateId: string;
  difficultyBand: CubesDiceVoxelDifficultyV2;
  stemVariantId: string;
  stem: string;
  heights: readonly (readonly number[])[];
  voxels: readonly VoxelV1[];
  stimulusSvg: string;
  options: readonly [number, number, number, number];
  correctIndex: number;
  answer: number;
  metrics: Readonly<{
    rows: number;
    columns: number;
    maxHeight: number;
    totalCubes: number;
    exposedFaces: number;
    boundingCuboidVolume: number;
    missingToCompleteCuboid: number;
    topProjectionCells: number;
    frontProjectionCells: number;
    rightProjectionCells: number;
  }>;
  solutionFacts: Readonly<{
    layerCounts: readonly number[];
    verticalContacts: number;
    leftRightContacts: number;
    frontBackContacts: number;
    totalContacts: number;
    topOccupiedByRow: readonly number[];
    frontProfile: readonly number[];
    rightProfile: readonly number[];
  }>;
  renderer: Readonly<{
    authorityId: typeof CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.authorityId;
    whiteBackground: true;
    strokeWidth: 1.35;
    canonicalCamera: true;
    randomWholeFigureTiltAllowed: false;
    hiddenInteriorEdgesRendered: false;
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

interface StackTemplateV2 {
  id: string;
  complexity: 1 | 2 | 3;
  heights: readonly (readonly number[])[];
}

export const CND_001_VOXEL_STACK_TEMPLATES_V2: readonly StackTemplateV2[] = Object.freeze([
  { id: "CORNER-RISE-2X2", complexity: 1, heights: Object.freeze([Object.freeze([1, 1]), Object.freeze([1, 2])]) },
  { id: "STEP-2X3", complexity: 2, heights: Object.freeze([Object.freeze([1, 2, 3]), Object.freeze([1, 1, 2])]) },
  { id: "ASYM-2X3", complexity: 2, heights: Object.freeze([Object.freeze([2, 1, 0]), Object.freeze([3, 2, 1])]) },
  { id: "L-TOWER-3X3", complexity: 3, heights: Object.freeze([Object.freeze([3, 1, 0]), Object.freeze([2, 1, 1]), Object.freeze([1, 1, 1])]) },
  { id: "CENTRE-HIGH-3X3", complexity: 3, heights: Object.freeze([Object.freeze([1, 2, 1]), Object.freeze([2, 4, 2]), Object.freeze([1, 2, 0])]) },
  { id: "TWIN-PEAK-3X3", complexity: 3, heights: Object.freeze([Object.freeze([2, 1, 2]), Object.freeze([1, 3, 1]), Object.freeze([1, 1, 0])]) },
  { id: "STAIRCASE-3X3", complexity: 3, heights: Object.freeze([Object.freeze([1, 2, 3]), Object.freeze([1, 2, 2]), Object.freeze([1, 1, 1])]) },
  { id: "SPLIT-RISE-3X3", complexity: 3, heights: Object.freeze([Object.freeze([3, 0, 1]), Object.freeze([2, 2, 1]), Object.freeze([1, 1, 2])]) },
  { id: "RIDGE-2X4", complexity: 3, heights: Object.freeze([Object.freeze([1, 2, 3, 2]), Object.freeze([1, 1, 2, 1])]) },
  { id: "OFFSET-PLATFORM-3X3", complexity: 2, heights: Object.freeze([Object.freeze([2, 2, 1]), Object.freeze([2, 3, 1]), Object.freeze([0, 1, 1])]) },
  { id: "LOW-TERRACE-3X3", complexity: 2, heights: Object.freeze([Object.freeze([1, 1, 1]), Object.freeze([2, 2, 1]), Object.freeze([3, 2, 1])]) },
  { id: "BROKEN-CORNER-3X3", complexity: 3, heights: Object.freeze([Object.freeze([2, 2, 0]), Object.freeze([2, 3, 1]), Object.freeze([1, 1, 1])]) },
]);

const STEM_VARIANTS: Readonly<Record<CubesDiceVoxelRuntimeTaskKindV2, readonly string[]>> = Object.freeze({
  STACK_TOTAL_CUBES: Object.freeze([
    "How many unit cubes are present in the stack shown below?",
    "Count the total number of small cubes used to make the arrangement.",
    "Including the hidden supporting cubes, how many unit cubes are there?",
    "Find the total number of unit cubes in the given solid arrangement.",
  ]),
  STACK_EXPOSED_FACES: Object.freeze([
    "How many unit-square faces are exposed to the outside in the arrangement shown?",
    "Count the total exposed faces of all unit cubes in the given stack.",
    "How many small square faces remain uncovered in this cube arrangement?",
    "Find the number of outward-facing unit-square faces in the stack.",
  ]),
  STACK_MISSING_TO_COMPLETE_CUBOID: Object.freeze([
    "How many more unit cubes are required to complete the smallest enclosing cuboid?",
    "How many cubes must be added to make the arrangement a complete cuboid of the same outer dimensions?",
    "Find the number of unit cubes missing from the smallest complete cuboid containing this stack.",
    "How many additional cubes will complete the bounding cuboid?",
  ]),
  ORTHOGRAPHIC_TOP_CELL_COUNT: Object.freeze([
    "When viewed exactly from the top, how many unit squares are visible?",
    "How many unit cells appear in the top view of the cube stack?",
    "Find the number of occupied unit-square cells in the top projection.",
    "Looking vertically downward, how many unit squares make up the top view?",
  ]),
  ORTHOGRAPHIC_FRONT_CELL_COUNT: Object.freeze([
    "When viewed exactly from the front, how many unit squares are visible?",
    "How many unit cells appear in the front view of the cube stack?",
    "Find the number of unit squares in the front projection of the arrangement.",
    "Ignoring depth, how many unit-square cells are seen from the front?",
  ]),
  ORTHOGRAPHIC_RIGHT_CELL_COUNT: Object.freeze([
    "When viewed exactly from the right side, how many unit squares are visible?",
    "How many unit cells appear in the right-side view of the cube stack?",
    "Find the number of unit squares in the right-side projection of the arrangement.",
    "Ignoring width, how many unit-square cells are seen from the right?",
  ]),
});

export const CND_001_VOXEL_PROJECTION_RUNTIME_AUTHORITY_V2 = Object.freeze({
  authorityId: "CND-001-VOXEL-PROJECTION-RUNTIME-V2" as const,
  chapterCode: "CND-001" as const,
  supersedesRuntimeProofAuthorityId: "CND-001-VOXEL-PROJECTION-RUNTIME-PROOF-V1" as const,
  rendererAuthorityId: CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.authorityId,
  canonicalSkillIds: Object.freeze([
    "CND-CAN-D-VOXEL-STACK-OCCUPANCY",
    "CND-CAN-E-ORTHOGRAPHIC-PROJECTION",
  ] as const),
  proposedPermanentQlRange: "SPA-QL-046..SPA-QL-047" as const,
  curatedStackTemplateCount: CND_001_VOXEL_STACK_TEMPLATES_V2.length,
  taskKinds: Object.freeze(Object.keys(STEM_VARIANTS) as CubesDiceVoxelRuntimeTaskKindV2[]),
  reviewEvidencePullRequest: 1291,
  productOwnerReviewStatus: "APPROVED_2026_08_31" as const,
  explanationQualityStandard: "CND_STUDENT_SOLUTION_V4_APPROVED" as const,
  status: "RUNTIME_AND_VISUAL_REVIEW_APPROVED" as const,
  permanentQlAllocationAuthorized: true,
  questionStudioRegistrationAuthorized: false,
  persistenceAllowed: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  automaticStudentPublication: false,
  nextGate: "CND_001_PERMANENT_QL_046_047_ALLOCATION_V1" as const,
});

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function cloneHeights(heights: readonly (readonly number[])[]): readonly (readonly number[])[] {
  return Object.freeze(heights.map((row) => Object.freeze([...row])));
}

function deriveMetrics(heights: readonly (readonly number[])[], voxels: readonly VoxelV1[]) {
  const rows = heights.length;
  const columns = heights[0]!.length;
  if (rows < 1 || columns < 1 || heights.some((row) => row.length !== columns)) throw new Error("CND voxel runtime requires a non-empty rectangular height matrix.");
  const maxHeight = Math.max(...heights.flat());
  const totalCubes = voxels.length;
  const boundingCuboidVolume = rows * columns * maxHeight;
  return Object.freeze({
    rows,
    columns,
    maxHeight,
    totalCubes,
    exposedFaces: exposedVoxelFaceCountV1(voxels),
    boundingCuboidVolume,
    missingToCompleteCuboid: boundingCuboidVolume - totalCubes,
    topProjectionCells: voxelProjectionCountV1(voxels, "TOP"),
    frontProjectionCells: voxelProjectionCountV1(voxels, "FRONT"),
    rightProjectionCells: voxelProjectionCountV1(voxels, "RIGHT"),
  });
}

function deriveSolutionFacts(heights: readonly (readonly number[])[], maxHeight: number) {
  const rows = heights.length;
  const columns = heights[0]!.length;
  const layerCounts = Array.from({ length: maxHeight }, (_, levelIndex) => {
    const level = levelIndex + 1;
    return heights.flat().filter((height) => height >= level).length;
  });
  const verticalContacts = heights.flat().reduce((sum, height) => sum + Math.max(0, height - 1), 0);
  let leftRightContacts = 0;
  let frontBackContacts = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns - 1; x += 1) leftRightContacts += Math.min(heights[y]![x]!, heights[y]![x + 1]!);
  }
  for (let y = 0; y < rows - 1; y += 1) {
    for (let x = 0; x < columns; x += 1) frontBackContacts += Math.min(heights[y]![x]!, heights[y + 1]![x]!);
  }
  const topOccupiedByRow = heights.map((row) => row.filter((height) => height > 0).length);
  const frontProfile = Array.from({ length: columns }, (_, x) => Math.max(...heights.map((row) => row[x]!)));
  const rightProfile = heights.map((row) => Math.max(...row));
  return Object.freeze({
    layerCounts: Object.freeze(layerCounts),
    verticalContacts,
    leftRightContacts,
    frontBackContacts,
    totalContacts: verticalContacts + leftRightContacts + frontBackContacts,
    topOccupiedByRow: Object.freeze(topOccupiedByRow),
    frontProfile: Object.freeze(frontProfile),
    rightProfile: Object.freeze(rightProfile),
  });
}

function qlForTask(taskKind: CubesDiceVoxelRuntimeTaskKindV2): CubesDiceVoxelCandidateQlIdV2 {
  return taskKind.startsWith("STACK_") ? "SPA-QL-046" : "SPA-QL-047";
}

function skillForTask(taskKind: CubesDiceVoxelRuntimeTaskKindV2): CubesDiceVoxelRuntimeQuestionV2["canonicalSkillId"] {
  return taskKind.startsWith("STACK_") ? "CND-CAN-D-VOXEL-STACK-OCCUPANCY" : "CND-CAN-E-ORTHOGRAPHIC-PROJECTION";
}

function answerForTask(taskKind: CubesDiceVoxelRuntimeTaskKindV2, metrics: ReturnType<typeof deriveMetrics>): number {
  if (taskKind === "STACK_TOTAL_CUBES") return metrics.totalCubes;
  if (taskKind === "STACK_EXPOSED_FACES") return metrics.exposedFaces;
  if (taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID") return metrics.missingToCompleteCuboid;
  if (taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT") return metrics.topProjectionCells;
  if (taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT") return metrics.frontProjectionCells;
  return metrics.rightProjectionCells;
}

function difficultyForTask(taskKind: CubesDiceVoxelRuntimeTaskKindV2, complexity: 1 | 2 | 3): CubesDiceVoxelDifficultyV2 {
  if (complexity === 1 && (taskKind === "STACK_TOTAL_CUBES" || taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT")) return "Easy";
  if (complexity === 3 && (taskKind === "STACK_EXPOSED_FACES" || taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID" || taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT" || taskKind === "ORTHOGRAPHIC_RIGHT_CELL_COUNT")) return "Hard";
  return "Medium";
}

function semanticDistractors(taskKind: CubesDiceVoxelRuntimeTaskKindV2, answer: number, metrics: ReturnType<typeof deriveMetrics>): number[] {
  if (taskKind === "STACK_TOTAL_CUBES") return [metrics.topProjectionCells, metrics.boundingCuboidVolume, metrics.frontProjectionCells + metrics.rightProjectionCells];
  if (taskKind === "STACK_EXPOSED_FACES") return [metrics.totalCubes, metrics.totalCubes * 6, metrics.topProjectionCells + metrics.frontProjectionCells + metrics.rightProjectionCells];
  if (taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID") return [metrics.totalCubes, metrics.boundingCuboidVolume, metrics.boundingCuboidVolume - metrics.topProjectionCells];
  if (taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT") return [metrics.frontProjectionCells, metrics.rightProjectionCells, metrics.totalCubes];
  if (taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT") return [metrics.topProjectionCells, metrics.rightProjectionCells, metrics.totalCubes];
  return [metrics.topProjectionCells, metrics.frontProjectionCells, metrics.totalCubes];
}

function buildOptions(seed: string, taskKind: CubesDiceVoxelRuntimeTaskKindV2, answer: number, metrics: ReturnType<typeof deriveMetrics>): Readonly<{ options: readonly [number, number, number, number]; correctIndex: number }> {
  const seen = new Set<number>([answer]);
  const distractors: number[] = [];
  const candidates = [
    ...semanticDistractors(taskKind, answer, metrics),
    answer + 1,
    Math.max(0, answer - 1),
    answer + 2,
    Math.max(0, answer - 2),
    answer + metrics.maxHeight,
  ];
  for (const value of candidates) {
    if (!Number.isInteger(value) || value < 0 || seen.has(value)) continue;
    seen.add(value);
    distractors.push(value);
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`${seed}: could not form three unique CND voxel distractors.`);
  const correctIndex = hashSeed(`${seed}:answer-position`) % 4;
  const values: number[] = new Array(4);
  values[correctIndex] = answer;
  let cursor = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) continue;
    values[index] = distractors[cursor++]!;
  }
  return Object.freeze({ options: Object.freeze(values) as readonly [number, number, number, number], correctIndex });
}

export function assertCubesDiceVoxelRuntimeQuestionV2(question: CubesDiceVoxelRuntimeQuestionV2): void {
  if (question.options.length !== 4 || new Set(question.options).size !== 4) throw new Error(`${question.seed}: four unique options are required.`);
  if (question.options[question.correctIndex] !== question.answer) throw new Error(`${question.seed}: correct option does not match solver answer.`);
  if (!question.stimulusSvg.startsWith("<svg") || !question.stimulusSvg.includes('fill="white"')) throw new Error(`${question.seed}: white SVG stimulus is required.`);
  if (/rotate\s*\(|skew[XY]?\s*\(|matrix\s*\(/i.test(question.stimulusSvg)) throw new Error(`${question.seed}: random/free figure transforms are forbidden.`);
  if (/<line\b/i.test(question.stimulusSvg)) throw new Error(`${question.seed}: hidden/interior helper lines are forbidden.`);
  if (!question.lifecycle.reviewOnly || question.lifecycle.permanentQlAllocated || question.lifecycle.questionStudioRegistered) throw new Error(`${question.seed}: approved runtime remains pre-allocation and review-only.`);
}

export function generateCubesDiceVoxelRuntimeQuestionV2(input: Readonly<{
  seed: string;
  taskKind: CubesDiceVoxelRuntimeTaskKindV2;
  templateId?: string;
}>): CubesDiceVoxelRuntimeQuestionV2 {
  if (!input.seed.trim()) throw new Error("CND voxel runtime requires an explicit seed.");
  const template = input.templateId
    ? CND_001_VOXEL_STACK_TEMPLATES_V2.find((candidate) => candidate.id === input.templateId)
    : CND_001_VOXEL_STACK_TEMPLATES_V2[hashSeed(`${input.seed}:template`) % CND_001_VOXEL_STACK_TEMPLATES_V2.length];
  if (!template) throw new Error(`Unknown CND voxel template ${input.templateId}.`);
  const heights = cloneHeights(template.heights);
  const voxels = buildStableVoxelStackFromHeightsV1(heights);
  const metrics = deriveMetrics(heights, voxels);
  const solutionFacts = deriveSolutionFacts(heights, metrics.maxHeight);
  const answer = answerForTask(input.taskKind, metrics);
  const optionSurface = buildOptions(input.seed, input.taskKind, answer, metrics);
  const stems = STEM_VARIANTS[input.taskKind];
  const stemIndex = hashSeed(`${input.seed}:stem`) % stems.length;
  const question: CubesDiceVoxelRuntimeQuestionV2 = Object.freeze({
    version: "CND-001-VOXEL-PROJECTION-RUNTIME-QUESTION-V2",
    chapterCode: "CND-001",
    seed: input.seed,
    proposedPermanentQlId: qlForTask(input.taskKind),
    canonicalSkillId: skillForTask(input.taskKind),
    taskKind: input.taskKind,
    templateId: template.id,
    difficultyBand: difficultyForTask(input.taskKind, template.complexity),
    stemVariantId: `${input.taskKind}-STEM-${stemIndex + 1}`,
    stem: stems[stemIndex]!,
    heights,
    voxels,
    stimulusSvg: renderVoxelStackExamSvgV2(voxels),
    options: optionSurface.options,
    correctIndex: optionSurface.correctIndex,
    answer,
    metrics,
    solutionFacts,
    renderer: Object.freeze({
      authorityId: CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.authorityId,
      whiteBackground: true as const,
      strokeWidth: 1.35 as const,
      canonicalCamera: true as const,
      randomWholeFigureTiltAllowed: false as const,
      hiddenInteriorEdgesRendered: false as const,
    }),
    lifecycle: Object.freeze({
      reviewOnly: true as const,
      permanentQlAllocated: false as const,
      questionStudioRegistered: false as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
  assertCubesDiceVoxelRuntimeQuestionV2(question);
  return question;
}
