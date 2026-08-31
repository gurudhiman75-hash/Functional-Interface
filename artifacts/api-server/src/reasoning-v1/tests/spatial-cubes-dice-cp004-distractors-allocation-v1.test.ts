import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import {
  CND_001_CP004_AUTHORITY_V1,
  generateCubesDiceCp004QuestionV1,
  type CubesDiceCp004TaskKindV1,
} from "../foundation/spatial/cubes-dice-cp004-distractors-allocation-v1";
import {
  SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7,
  SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7,
  SPATIAL_PERMANENT_QL_ALLOCATIONS_V7,
} from "../foundation/spatial/spatial-permanent-ql-allocation-v7";
import { CND_001_CANONICAL_SKILLS_V1 } from "../foundation/spatial/cubes-dice-merge-split-v1";

assert.equal(CND_001_CP004_AUTHORITY_V1.permanentQlAllocationAuthorized, true);
assert.equal(CND_001_CP004_AUTHORITY_V1.allocatedRange, "SPA-QL-043..SPA-QL-045");
assert.equal(CND_001_CP004_AUTHORITY_V1.nextPermanentQlId, "SPA-QL-046");
assert.equal(CND_001_CP004_AUTHORITY_V1.questionStudioRegistrationAllowed, false);
assert.equal(CND_001_CP004_AUTHORITY_V1.automaticStudentPublication, false);

assert.deepEqual(
  SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7.map((entry) => entry.permanentQlId),
  ["SPA-QL-043", "SPA-QL-044", "SPA-QL-045"],
);
assert.deepEqual(
  SPATIAL_CUBES_DICE_PERMANENT_QL_ALLOCATIONS_V7.map((entry) => entry.proposalId),
  ["CND-CAN-A-DIE-FACE-RELATIONS", "CND-CAN-B-CUBE-NET-FOLDING", "CND-CAN-C-PAINTED-CUBE-EXPOSURE"],
);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATIONS_V7.length, 45);
assert.equal(new Set(SPATIAL_PERMANENT_QL_ALLOCATIONS_V7.map((entry) => entry.permanentQlId)).size, 45);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.nextAvailablePermanentQlId, "SPA-QL-046");
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.permanentQlCount, 45);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.lifecycle.questionStudioDiscoverable, false);
assert.equal(SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.lifecycle.automaticStudentPublication, false);

const held = CND_001_CANONICAL_SKILLS_V1.filter((skill) => skill.status === "RETAIN_HELD_FOR_RUNTIME_PROOF");
assert.deepEqual(held.map((skill) => skill.canonicalSkillId), ["CND-CAN-D-VOXEL-STACK-OCCUPANCY", "CND-CAN-E-ORTHOGRAPHIC-PROJECTION"]);
assert.deepEqual(held.map((skill) => skill.earliestPermanentQlId), [null, null]);

const TASKS: readonly CubesDiceCp004TaskKindV1[] = [
  "DICE_OPPOSITE_FROM_TWO_VIEWS",
  "CUBE_NET_OPPOSITE_FACE",
  "PAINTED_CUBE_EXACT_FACE_COUNT",
];
const EXPECTED_QL: Readonly<Record<CubesDiceCp004TaskKindV1, string>> = Object.freeze({
  DICE_OPPOSITE_FROM_TWO_VIEWS: "SPA-QL-043",
  CUBE_NET_OPPOSITE_FACE: "SPA-QL-044",
  PAINTED_CUBE_EXACT_FACE_COUNT: "SPA-QL-045",
});

const evidenceRows: Record<string, unknown>[] = [];
const answerPositions = new Map<CubesDiceCp004TaskKindV1, Set<number>>();
const distractorFamilies = new Set<string>();
let reviewed = 0;

for (const taskKind of TASKS) {
  const positions = new Set<number>();
  answerPositions.set(taskKind, positions);
  for (let index = 0; index < 64; index += 1) {
    const seed = `CND-CP004-${taskKind}-${index}`;
    const question = generateCubesDiceCp004QuestionV1({ seed, taskKind });
    const replay = generateCubesDiceCp004QuestionV1({ seed, taskKind });

    assert.equal(question.version, "CND-001-CP004-QUESTION-V1");
    assert.equal(question.permanentQlId, EXPECTED_QL[taskKind]);
    assert.equal(question.nextPermanentQlId, "SPA-QL-046");
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options.map(String)).size, 4, `${seed}: options must be unique.`);
    assert.equal(question.options[question.correctIndex], question.answer, `${seed}: correct option must match solver answer.`);
    assert.equal(question.options.filter((option) => option === question.answer).length, 1, `${seed}: answer must occur exactly once.`);
    assert.equal(question.distractorEvidence.length, 3);
    assert.ok(question.distractorEvidence.every((entry) => entry.solverAttestedIncorrect));
    assert.ok(question.distractorEvidence.every((entry) => entry.value !== question.answer));
    assert.deepEqual(question.options, replay.options, `${seed}: seeded option construction must replay exactly.`);
    assert.equal(question.correctIndex, replay.correctIndex);
    assert.equal(question.answer, replay.answer);
    assert.equal(question.stimulusSvgs[0], replay.stimulusSvgs[0]);
    assert.match(question.stimulusSvgs[0], /fill="white"/);
    assert.match(question.stimulusSvgs[0], /stroke-width="1\.35"/);
    assert.equal(question.renderer.randomWholeFigureTiltAllowed, false);
    assert.equal(question.lifecycle.permanentQlAllocated, true);
    assert.equal(question.lifecycle.questionStudioRegistered, false);
    assert.equal(question.lifecycle.questionBankWritable, false);
    assert.equal(question.lifecycle.testEligible, false);
    assert.equal(question.lifecycle.publiclyPublishable, false);
    assert.equal(question.lifecycle.automaticStudentPublication, false);

    for (const entry of question.distractorEvidence) distractorFamilies.add(entry.family);
    positions.add(question.correctIndex);
    reviewed += 1;
    evidenceRows.push({
      seed,
      taskKind,
      permanentQlId: question.permanentQlId,
      correctIndex: question.correctIndex,
      answer: question.answer,
      options: question.options,
      distractorEvidence: question.distractorEvidence,
      stemVariantId: question.stemVariantId,
    });
  }
  assert.ok(positions.size >= 3, `${taskKind}: answer positions should not collapse to one or two slots.`);
}

assert.equal(reviewed, 192);
assert.ok(distractorFamilies.has("ADJACENT_FACE_CONFUSED_WITH_OPPOSITE"));
assert.ok(distractorFamilies.has("NET_NEIGHBOUR_CONFUSED_WITH_OPPOSITE"));
assert.ok(distractorFamilies.has("WRONG_PAINTED_FACE_CATEGORY"));
assert.ok(distractorFamilies.has("BOUNDARY_FORMULA_CONFUSION"));

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
const evidence = {
  authority: CND_001_CP004_AUTHORITY_V1.authorityId,
  allocationAuthority: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.authorityId,
  result: "PASS",
  reviewed,
  reviewedPerAllocatedQl: 64,
  allocatedRange: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.allocatedRange,
  nextPermanentQlId: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.nextAvailablePermanentQlId,
  permanentQlCount: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.permanentQlCount,
  answerPositionCoverage: Object.fromEntries([...answerPositions.entries()].map(([task, values]) => [task, [...values].sort()])),
  distractorFamilies: [...distractorFamilies].sort(),
  heldCanonicalSkills: held.map((skill) => skill.canonicalSkillId),
  lifecycle: SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V7.lifecycle,
  evidenceRows,
  invariants: [
    "EXACTLY_THREE_RETAINED_CANONICAL_SKILLS_ALLOCATED",
    "SPA_QL_043_TO_045_CONTIGUOUS_AND_COLLISION_FREE",
    "DICE_DISTRACTORS_MODEL_ADJACENT_VS_OPPOSITE_CONFUSION",
    "NET_DISTRACTORS_MODEL_NEIGHBOUR_VS_OPPOSITE_CONFUSION",
    "PAINTED_CUBE_DISTRACTORS_USE_WRONG_CATEGORY_OR_BOUNDARY_FORMULA_CONFUSIONS",
    "ALL_DISTRACTORS_SOLVER_ATTESTED_INCORRECT",
    "FOUR_UNIQUE_OPTIONS_AND_SINGLE_CORRECT_ANSWER",
    "WHITE_BACKGROUND_EXAM_STROKE_AND_NO_RANDOM_TILT_PRESERVED",
    "VOXEL_AND_ORTHOGRAPHIC_SKILLS_REMAIN_HELD",
    "QUESTION_STUDIO_AND_PUBLICATION_REMAIN_LOCKED",
  ],
};
writeFileSync("dist/reasoning-v1/spatial/spa-cnd-001-cp004-distractors-allocation-v1-evidence.json", `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ result: "PASS", reviewed, allocatedRange: evidence.allocatedRange, permanentQlCount: evidence.permanentQlCount, distractorFamilies: evidence.distractorFamilies, answerPositionCoverage: evidence.answerPositionCoverage }, null, 2));
