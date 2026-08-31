import {
  buildStableVoxelStackFromHeightsV1,
  exposedVoxelFaceCountV1,
  voxelProjectionCountV1,
  type VoxelViewV1,
  type VoxelV1,
} from "./cubes-dice-foundation-v1";
import {
  CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2,
  renderVoxelStackExamSvgV2,
} from "./cubes-dice-voxel-exam-renderer-v2";

export type CubesDiceHeldCanonicalSkillIdV1 =
  | "CND-CAN-D-VOXEL-STACK-OCCUPANCY"
  | "CND-CAN-E-ORTHOGRAPHIC-PROJECTION";

export type CubesDiceVoxelRuntimeTaskKindV1 =
  | "STACK_TOTAL_CUBES"
  | "STACK_EXPOSED_FACES"
  | "STACK_MISSING_TO_COMPLETE_CUBOID"
  | "ORTHOGRAPHIC_TOP_CELL_COUNT"
  | "ORTHOGRAPHIC_FRONT_CELL_COUNT"
  | "ORTHOGRAPHIC_RIGHT_CELL_COUNT";

export type CubesDiceVoxelDifficultyV1 = "Easy" | "Medium" | "Hard";

export type CubesDiceVoxelDistractorFamilyV1 =
  | "VISIBLE_OR_FOOTPRINT_ONLY"
  | "BOUNDING_CUBOID_CONFUSION"
  | "PROJECTION_AXIS_CONFUSION"
  | "EXPOSED_FACE_CONFUSION"
  | "ARITHMETIC_SLIP";

export interface CubesDiceVoxelDistractorEvidenceV1 {
  optionIndex: number;
  value: number;
  family: CubesDiceVoxelDistractorFamilyV1;
  solverAttestedIncorrect: true;
}

export interface CubesDiceVoxelRuntimeQuestionV1 {
  version: "CND-001-VOXEL-PROJECTION-RUNTIME-PROOF-QUESTION-V1";
  seed: string;
  candidateSkillId: CubesDiceHeldCanonicalSkillIdV1;
  proposedPermanentQlId: "SPA-QL-046" | "SPA-QL-047";
  taskKind: CubesDiceVoxelRuntimeTaskKindV1;
  templateId: string;
  stemVariantId: string;
  difficultyBand: CubesDiceVoxelDifficultyV1;
  heights: readonly (readonly number[])[];
  voxels: readonly VoxelV1[];
  view: VoxelViewV1 | null;
  stem: string;
  stimulusSvg: string;
  options: readonly number[];
  correctIndex: number;
  answer: number;
  distractorEvidence: readonly CubesDiceVoxelDistractorEvidenceV1[];
  explanation: Readonly<{
    whatIsGiven: string;
    howToReason: string;
    conclusion: string;
  }>;
  metrics: Readonly<{
    totalCubes: number;
    exposedFaces: number;
    boundingCuboidVolume: number;
    missingToCompleteCuboid: number;
    topProjectionCells: number;
    frontProjectionCells: number;
    rightProjectionCells: number;
    maxHeight: number;
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
    runtimeProofImplemented: true;
    permanentQlAllocated: false;
    questionStudioRegistered: false;
    persistenceAllowed: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
    automaticStudentPublication: false;
  }>;
}

interface StackTemplateV1 {
  id: string;
  heights: readonly (readonly number[])[];
  complexity: 1 | 2 | 3;
}

const STACK_TEMPLATES_V1: readonly StackTemplateV1[] = Object.freeze([
  { id: "CORNER-RISE-2X2", heights: Object.freeze([Object.freeze([1, 1]), Object.freeze([1, 2])]), complexity: 1 },
  { id: "STEP-2X3", heights: Object.freeze([Object.freeze([1, 2, 3]), Object.freeze([1, 1, 2])]), complexity: 2 },
  { id: "ASYM-2X3", heights: Object.freeze([Object.freeze([2, 1, 0]), Object.freeze([3, 2, 1])]), complexity: 2 },
  { id: "L-TOWER-3X3", heights: Object.freeze([Object.freeze([3, 1, 0]), Object.freeze([2, 1, 1]), Object.freeze([1, 1, 1])]), complexity: 3 },
  { id: "CENTRE-HIGH-3X3", heights: Object.freeze([Object.freeze([1, 2, 1]), Object.freeze([2, 4, 2]), Object.freeze([1, 2, 0])]), complexity: 3 },
  { id: "TWIN-PEAK-3X3", heights: Object.freeze([Object.freeze([2, 1, 2]), Object.freeze([1, 3, 1]), Object.freeze([1, 1, 0])]), complexity: 3 },
  { id: "STAIRCASE-3X3", heights: Object.freeze([Object.freeze([1, 2, 3]), Object.freeze([1, 2, 2]), Object.freeze([1, 1, 1])]), complexity: 3 },
  { id: "SPLIT-RISE-3X3", heights: Object.freeze([Object.freeze([3, 0, 1]), Object.freeze([2, 2, 1]), Object.freeze([1, 1, 2])]), complexity: 3 },
  { id: "RIDGE-2X4", heights: Object.freeze([Object.freeze([1, 2, 3, 2]), Object.freeze([1, 1, 2, 1])]), complexity: 3 },
  { id: "OFFSET-PLATFORM-3X3", heights: Object.freeze([Object.freeze([2, 2, 1]), Object.freeze([2, 3, 1]), Object.freeze([0, 1, 1])]), complexity: 2 },
  { id: "LOW-TERRACE-3X3", heights: Object.freeze([Object.freeze([1, 1, 1]), Object.freeze([2, 2, 1]), Object.freeze([3, 2, 1])]), complexity: 2 },
  { id: "BROKEN-CORNER-3X3", heights: Object.freeze([Object.freeze([2, 2, 0]), Object.freeze([2, 3, 1]), Object.freeze([1, 1, 1])]), complexity: 3 },
]);

const STEM_VARIANTS_V1: Readonly<Record<CubesDiceVoxelRuntimeTaskKindV1, readonly string[]>> = Object.freeze({
  STACK_TOTAL_CUBES: Object.freeze([
    "How many unit cubes are present in the stack shown below?",
    "Count the total number of small cubes used to make the given arrangement.",
    "What is the total number of unit cubes in this solid arrangement?",
    "Including cubes that support the upper cubes, how many unit cubes are there?",
  ]),
  STACK_EXPOSED_FACES: Object.freeze([
    "How many unit-square faces of the cubes are exposed to the outside in the arrangement shown?",
    "Count the total exposed faces of all unit cubes in the given stack.",
    "How many small square faces remain uncovered in this cube arrangement?",
    "What is the number of outward-facing unit-square faces in the stack?",
  ]),
  STACK_MISSING_TO_COMPLETE_CUBOID: Object.freeze([
    "How many more unit cubes are required to complete the smallest enclosing cuboid?",
    "If the arrangement is completed into its bounding cuboid, how many cubes must be added?",
    "Find the number of unit cubes missing from the smallest complete cuboid containing this stack.",
    "How many additional cubes will make the shown arrangement a complete cuboid of the same outer dimensions?",
  ]),
  ORTHOGRAPHIC_TOP_CELL_COUNT: Object.freeze([
    "When viewed exactly from the top, how many unit squares are visible in the orthographic view?",
    "How many unit cells appear in the top view of the given cube stack?",
    "Find the number of occupied unit-square cells in the top projection.",
    "Looking vertically downward, how many unit squares make up the top-view footprint?",
  ]),
  ORTHOGRAPHIC_FRONT_CELL_COUNT: Object.freeze([
    "When viewed exactly from the front, how many unit squares appear in the orthographic view?",
    "How many unit cells are occupied in the front projection of this stack?",
    "Find the number of unit squares in the front view of the arrangement.",
    "Ignoring depth, how many unit-square cells are seen from the front?",
  ]),
  ORTHOGRAPHIC_RIGHT_CELL_COUNT: Object.freeze([
    "When viewed exactly from the right side, how many unit squares appear in the orthographic view?",
    "How many unit cells are occupied in the right-side projection of this stack?",
    "Find the number of unit squares in the right view of the arrangement.",
    "Ignoring width, how many unit-square cells are seen from the right?",
  ]),
});

export const CND_001_VOXEL_PROJECTION_RUNTIME_PROOF_AUTHORITY_V1 = Object.freeze({
  authorityId: "CND-001-VOXEL-PROJECTION-RUNTIME-PROOF-V1" as const,
  chapterCode: "CND-001" as const,
  rendererAuthorityId: CND_001_VOXEL_EXAM_RENDERER_AUTHORITY_V2.authorityId,
  canonicalSkillIds: Object.freeze([
    "CND-CAN-D-VOXEL-STACK-OCCUPANCY",
    "CND-CAN-E-ORTHOGRAPHIC-PROJECTION",
  ] as const),
  proposedPermanentQlRange: "SPA-QL-046..SPA-QL-047" as const,
  taskKinds: Object.freeze([
    "STACK_TOTAL_CUBES",
    "STACK_EXPOSED_FACES",
    "STACK_MISSING_TO_COMPLETE_CUBOID",
    "ORTHOGRAPHIC_TOP_CELL_COUNT",
    "ORTHOGRAPHIC_FRONT_CELL_COUNT",
    "ORTHOGRAPHIC_RIGHT_CELL_COUNT",
  ] as const),
  curatedStackTemplateCount: STACK_TEMPLATES_V1.length,
  status: "RUNTIME_PROOF_IMPLEMENTED_REVIEW_REQUIRED" as const,
  permanentQlAllocationAuthorized: false,
  questionStudioRegistrationAuthorized: false,
  automaticStudentPublication: false,
  nextGate: "CND_001_VOXEL_PROJECTION_RUNTIME_REVIEW_V1" as const,
});

function hashSeedV1(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function cloneHeightsV1(heights: readonly (readonly number[])[]): readonly (readonly number[])[] {
  return Object.freeze(heights.map((row) => Object.freeze([...row])));
}

function metricsV1(heights: readonly (readonly number[])[], voxels: readonly VoxelV1[]) {
  const rowCount = heights.length;
  const columnCount = heights[0]!.length;
  if (heights.some((row) => row.length !== columnCount)) throw new Error("CND voxel runtime requires rectangular height matrices.");
  const maxHeight = Math.max(...heights.flat());
  const totalCubes = voxels.length;
  const boundingCuboidVolume = rowCount * columnCount * maxHeight;
  const missingToCompleteCuboid = boundingCuboidVolume - totalCubes;
  return Object.freeze({
    totalCubes,
    exposedFaces: exposedVoxelFaceCountV1(voxels),
    boundingCuboidVolume,
    missingToCompleteCuboid,
    topProjectionCells: voxelProjectionCountV1(voxels, "TOP"),
    frontProjectionCells: voxelProjectionCountV1(voxels, "FRONT"),
    rightProjectionCells: voxelProjectionCountV1(voxels, "RIGHT"),
    maxHeight,
  });
}

function skillForTaskV1(taskKind: CubesDiceVoxelRuntimeTaskKindV1): Readonly<{
  candidateSkillId: CubesDiceHeldCanonicalSkillIdV1;
  proposedPermanentQlId: "SPA-QL-046" | "SPA-QL-047";
  view: VoxelViewV1 | null;
}> {
  if (taskKind.startsWith("STACK_")) {
    return Object.freeze({ candidateSkillId: "CND-CAN-D-VOXEL-STACK-OCCUPANCY", proposedPermanentQlId: "SPA-QL-046", view: null });
  }
  if (taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT") return Object.freeze({ candidateSkillId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION", proposedPermanentQlId: "SPA-QL-047", view: "TOP" });
  if (taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT") return Object.freeze({ candidateSkillId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION", proposedPermanentQlId: "SPA-QL-047", view: "FRONT" });
  return Object.freeze({ candidateSkillId: "CND-CAN-E-ORTHOGRAPHIC-PROJECTION", proposedPermanentQlId: "SPA-QL-047", view: "RIGHT" });
}

function answerForTaskV1(taskKind: CubesDiceVoxelRuntimeTaskKindV1, metrics: ReturnType<typeof metricsV1>): number {
  if (taskKind === "STACK_TOTAL_CUBES") return metrics.totalCubes;
  if (taskKind === "STACK_EXPOSED_FACES") return metrics.exposedFaces;
  if (taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID") return metrics.missingToCompleteCuboid;
  if (taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT") return metrics.topProjectionCells;
  if (taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT") return metrics.frontProjectionCells;
  return metrics.rightProjectionCells;
}

function difficultyForV1(taskKind: CubesDiceVoxelRuntimeTaskKindV1, template: StackTemplateV1): CubesDiceVoxelDifficultyV1 {
  if (taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT" && template.complexity === 1) return "Easy";
  if (taskKind === "STACK_TOTAL_CUBES" && template.complexity <= 2) return "Easy";
  if (taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID" && template.complexity === 3) return "Hard";
  if ((taskKind === "STACK_EXPOSED_FACES" || taskKind === "ORTHOGRAPHIC_RIGHT_CELL_COUNT") && template.complexity === 3) return "Hard";
  return "Medium";
}

function candidateDistractorsV1(
  taskKind: CubesDiceVoxelRuntimeTaskKindV1,
  answer: number,
  metrics: ReturnType<typeof metricsV1>,
): readonly Readonly<{ value: number; family: CubesDiceVoxelDistractorFamilyV1 }>[] {
  const semantic: { value: number; family: CubesDiceVoxelDistractorFamilyV1 }[] = [];
  if (taskKind === "STACK_TOTAL_CUBES") {
    semantic.push(
      { value: metrics.topProjectionCells, family: "VISIBLE_OR_FOOTPRINT_ONLY" },
      { value: metrics.boundingCuboidVolume, family: "BOUNDING_CUBOID_CONFUSION" },
      { value: metrics.frontProjectionCells + metrics.rightProjectionCells, family: "VISIBLE_OR_FOOTPRINT_ONLY" },
      { value: metrics.totalCubes - metrics.maxHeight, family: "VISIBLE_OR_FOOTPRINT_ONLY" },
    );
  } else if (taskKind === "STACK_EXPOSED_FACES") {
    semantic.push(
      { value: metrics.totalCubes, family: "EXPOSED_FACE_CONFUSION" },
      { value: metrics.topProjectionCells + metrics.frontProjectionCells + metrics.rightProjectionCells, family: "EXPOSED_FACE_CONFUSION" },
      { value: metrics.boundingCuboidVolume, family: "BOUNDING_CUBOID_CONFUSION" },
      { value: metrics.totalCubes * 6, family: "EXPOSED_FACE_CONFUSION" },
    );
  } else if (taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID") {
    semantic.push(
      { value: metrics.totalCubes, family: "BOUNDING_CUBOID_CONFUSION" },
      { value: metrics.boundingCuboidVolume, family: "BOUNDING_CUBOID_CONFUSION" },
      { value: metrics.boundingCuboidVolume - metrics.topProjectionCells, family: "VISIBLE_OR_FOOTPRINT_ONLY" },
      { value: metrics.maxHeight, family: "BOUNDING_CUBOID_CONFUSION" },
    );
  } else {
    const otherViews = taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT"
      ? [metrics.frontProjectionCells, metrics.rightProjectionCells]
      : taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT"
        ? [metrics.topProjectionCells, metrics.rightProjectionCells]
        : [metrics.topProjectionCells, metrics.frontProjectionCells];
    semantic.push(
      { value: otherViews[0]!, family: "PROJECTION_AXIS_CONFUSION" },
      { value: otherViews[1]!, family: "PROJECTION_AXIS_CONFUSION" },
      { value: metrics.totalCubes, family: "VISIBLE_OR_FOOTPRINT_ONLY" },
      { value: metrics.boundingCuboidVolume, family: "BOUNDING_CUBOID_CONFUSION" },
    );
  }
  semantic.push(
    { value: answer + 1, family: "ARITHMETIC_SLIP" },
    { value: Math.max(0, answer - 1), family: "ARITHMETIC_SLIP" },
    { value: answer + metrics.maxHeight, family: "ARITHMETIC_SLIP" },
  );
  return Object.freeze(semantic.map((candidate) => Object.freeze(candidate)));
}

function buildOptionsV1(
  seed: string,
  taskKind: CubesDiceVoxelRuntimeTaskKindV1,
  answer: number,
  metrics: ReturnType<typeof metricsV1>,
): Readonly<{ options: readonly number[]; correctIndex: number; evidence: readonly CubesDiceVoxelDistractorEvidenceV1[] }> {
  const correctIndex = hashSeedV1(`${seed}:correct-position`) % 4;
  const distractors: Readonly<{ value: number; family: CubesDiceVoxelDistractorFamilyV1 }>[] = [];
  const seen = new Set<number>([answer]);
  for (const candidate of candidateDistractorsV1(taskKind, answer, metrics)) {
    if (!Number.isInteger(candidate.value) || candidate.value < 0 || seen.has(candidate.value)) continue;
    seen.add(candidate.value);
    distractors.push(candidate);
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error(`${seed}: CND voxel runtime could not form three unique solver-attested distractors.`);

  const options: number[] = new Array(4);
  const evidence: CubesDiceVoxelDistractorEvidenceV1[] = [];
  options[correctIndex] = answer;
  let cursor = 0;
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    if (optionIndex === correctIndex) continue;
    const distractor = distractors[cursor++]!;
    options[optionIndex] = distractor.value;
    evidence.push(Object.freeze({ optionIndex, value: distractor.value, family: distractor.family, solverAttestedIncorrect: true as const }));
  }
  return Object.freeze({ options: Object.freeze(options), correctIndex, evidence: Object.freeze(evidence) });
}

function columnSummaryV1(heights: readonly (readonly number[])[]): string {
  return heights.map((row) => `[${row.join(", ")}]`).join("; ");
}

function explanationForV1(
  taskKind: CubesDiceVoxelRuntimeTaskKindV1,
  heights: readonly (readonly number[])[],
  metrics: ReturnType<typeof metricsV1>,
  answer: number,
): CubesDiceVoxelRuntimeQuestionV1["explanation"] {
  const columns = columnSummaryV1(heights);
  if (taskKind === "STACK_TOTAL_CUBES") {
    return Object.freeze({
      whatIsGiven: `The stable stack has column heights ${columns}. Each height already includes every supporting cube below the top cube.`,
      howToReason: `Add all column heights: the exact occupied-voxel count is ${metrics.totalCubes}.`,
      conclusion: `Therefore the stack contains ${answer} unit cubes.`,
    });
  }
  if (taskKind === "STACK_EXPOSED_FACES") {
    return Object.freeze({
      whatIsGiven: `The occupied columns are ${columns}. Faces shared by two neighbouring cubes are internal and must not be counted.`,
      howToReason: `Checking all six neighbours of every occupied cube leaves ${metrics.exposedFaces} outward unit-square faces.`,
      conclusion: `Hence the number of exposed faces is ${answer}.`,
    });
  }
  if (taskKind === "STACK_MISSING_TO_COMPLETE_CUBOID") {
    const rows = heights.length;
    const columnsCount = heights[0]!.length;
    return Object.freeze({
      whatIsGiven: `The footprint is ${columnsCount} by ${rows} and the maximum stack height is ${metrics.maxHeight}.`,
      howToReason: `The smallest enclosing cuboid contains ${columnsCount} × ${rows} × ${metrics.maxHeight} = ${metrics.boundingCuboidVolume} unit positions. The shown stack occupies ${metrics.totalCubes}.`,
      conclusion: `${metrics.boundingCuboidVolume} − ${metrics.totalCubes} = ${answer} additional cubes are required.`,
    });
  }
  const viewName = taskKind === "ORTHOGRAPHIC_TOP_CELL_COUNT" ? "top" : taskKind === "ORTHOGRAPHIC_FRONT_CELL_COUNT" ? "front" : "right-side";
  return Object.freeze({
    whatIsGiven: `The 3D stack is projected orthographically onto the ${viewName} plane, so depth along the viewing direction is ignored.`,
    howToReason: `Merge occupied cubes that fall onto the same unit-square projection cell. The exact ${viewName} projection contains ${answer} distinct cells.`,
    conclusion: `Therefore the ${viewName} view has ${answer} occupied unit squares.`,
  });
}

export function assertCubesDiceVoxelRuntimeQuestionV1(question: CubesDiceVoxelRuntimeQuestionV1): void {
  if (question.options.length !== 4) throw new Error(`${question.seed}: exactly four options are required.`);
  if (new Set(question.options).size !== 4) throw new Error(`${question.seed}: options must be unique.`);
  if (question.correctIndex < 0 || question.correctIndex > 3) throw new Error(`${question.seed}: correct option index is invalid.`);
  if (question.options[question.correctIndex] !== question.answer) throw new Error(`${question.seed}: correct option does not equal solver answer.`);
  if (question.distractorEvidence.length !== 3) throw new Error(`${question.seed}: exactly three distractors need evidence.`);
  for (const evidence of question.distractorEvidence) {
    if (evidence.optionIndex === question.correctIndex) throw new Error(`${question.seed}: answer cannot be tagged as a distractor.`);
    if (question.options[evidence.optionIndex] !== evidence.value) throw new Error(`${question.seed}: distractor evidence mismatches option surface.`);
    if (evidence.value === question.answer) throw new Error(`${question.seed}: distractor duplicates solver answer.`);
  }
  if (!question.stimulusSvg.startsWith("<svg")) throw new Error(`${question.seed}: exam SVG stimulus is required.`);
  if (/rotate\s*\(|skew[XY]?\s*\(|matrix\s*\(/i.test(question.stimulusSvg)) throw new Error(`${question.seed}: random/free figure transforms are forbidden.`);
  if (!question.stimulusSvg.includes('fill="white"')) throw new Error(`${question.seed}: white exam background is required.`);
  const strokeWidths = [...question.stimulusSvg.matchAll(/stroke-width="([^"]+)"/g)].map((match) => match[1]);
  if (strokeWidths.length === 0 || strokeWidths.some((width) => width !== "1.35")) throw new Error(`${question.seed}: every geometry stroke must remain 1.35px.`);
  if (!question.lifecycle.reviewOnly || question.lifecycle.permanentQlAllocated || question.lifecycle.questionStudioRegistered) {
    throw new Error(`${question.seed}: runtime proof must remain unallocated and review-only.`);
  }
}

export function generateCubesDiceVoxelRuntimeQuestionV1(input: Readonly<{
  seed: string;
  taskKind: CubesDiceVoxelRuntimeTaskKindV1;
  templateId?: string;
}>): CubesDiceVoxelRuntimeQuestionV1 {
  const selectedTemplate = input.templateId
    ? STACK_TEMPLATES_V1.find((template) => template.id === input.templateId)
    : STACK_TEMPLATES_V1[hashSeedV1(`${input.seed}:template`) % STACK_TEMPLATES_V1.length];
  if (!selectedTemplate) throw new Error(`Unknown CND voxel stack template: ${input.templateId}.`);
  const heights = cloneHeightsV1(selectedTemplate.heights);
  const voxels = buildStableVoxelStackFromHeightsV1(heights);
  if (voxels.length === 0) throw new Error(`${input.seed}: runtime template produced an empty stack.`);
  const metrics = metricsV1(heights, voxels);
  const answer = answerForTaskV1(input.taskKind, metrics);
  const options = buildOptionsV1(input.seed, input.taskKind, answer, metrics);
  const skill = skillForTaskV1(input.taskKind);
  const stems = STEM_VARIANTS_V1[input.taskKind];
  const stemVariantIndex = hashSeedV1(`${input.seed}:stem`) % stems.length;
  const question: CubesDiceVoxelRuntimeQuestionV1 = Object.freeze({
    version: "CND-001-VOXEL-PROJECTION-RUNTIME-PROOF-QUESTION-V1",
    seed: input.seed,
    candidateSkillId: skill.candidateSkillId,
    proposedPermanentQlId: skill.proposedPermanentQlId,
    taskKind: input.taskKind,
    templateId: selectedTemplate.id,
    stemVariantId: `${input.taskKind}-STEM-${stemVariantIndex + 1}`,
    difficultyBand: difficultyForV1(input.taskKind, selectedTemplate),
    heights,
    voxels,
    view: skill.view,
    stem: stems[stemVariantIndex]!,
    stimulusSvg: renderVoxelStackExamSvgV2(voxels),
    options: options.options,
    correctIndex: options.correctIndex,
    answer,
    distractorEvidence: options.evidence,
    explanation: explanationForV1(input.taskKind, heights, metrics, answer),
    metrics,
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
      runtimeProofImplemented: true as const,
      permanentQlAllocated: false as const,
      questionStudioRegistered: false as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
    }),
  });
  assertCubesDiceVoxelRuntimeQuestionV1(question);
  return question;
}

export const CND_001_VOXEL_STACK_TEMPLATES_V1 = STACK_TEMPLATES_V1;
