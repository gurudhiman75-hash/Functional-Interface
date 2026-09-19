import assert from "node:assert/strict";
import {
  DIRECTIONS,
  aboutTurn,
  applyTurn,
  classifyDirection,
  directionAndDistance,
  directionBetween,
  movementVector,
  oppositeDirection,
  pathTopologyFingerprint,
  relationTopologyFingerprint,
  rotateDirection,
  solveEntityPositions,
  solvePath,
  turnLeft,
  turnRight,
  validateDirectionOptions,
  type DirectionQuestionLogicContract,
  type PathOperation,
  type PositionRelation,
} from "./index";
import {
  DIR_001_ALLOCATION_POLICY,
  assertContinuousDirectionQlIds,
  assertMaterialQlNeed,
  nextDirectionQlId,
} from "../DIR-001-CHAPTER-MANIFEST";

for (const direction of DIRECTIONS) {
  assert.equal(rotateDirection(direction, 8), direction);
  assert.equal(rotateDirection(direction, -8), direction);
  assert.equal(oppositeDirection(oppositeDirection(direction)), direction);
  assert.equal(turnRight(turnLeft(direction)), direction);
  assert.equal(turnLeft(turnRight(direction)), direction);
  assert.equal(aboutTurn(direction), oppositeDirection(direction));

  for (let steps = -16; steps <= 16; steps += 1) {
    assert.equal(rotateDirection(rotateDirection(direction, steps), -steps), direction);
  }
}

assert.equal(applyTurn("NORTH", { kind: "TURN", sense: "CLOCKWISE", degrees: 90 }), "EAST");
assert.equal(applyTurn("SOUTH_EAST", { kind: "TURN", sense: "ANTICLOCKWISE", degrees: 135 }), "NORTH");
assert.throws(() => applyTurn("NORTH", { kind: "TURN", sense: "CLOCKWISE", degrees: 30 }));

const diagonal = movementVector("NORTH_EAST", 10);
assert.ok(Math.abs(diagonal.x - 10 / Math.sqrt(2)) < 1e-10);
assert.ok(Math.abs(diagonal.y - 10 / Math.sqrt(2)) < 1e-10);
assert.ok(Math.abs(Math.hypot(diagonal.x, diagonal.y) - 10) < 1e-10);
assert.equal(classifyDirection(diagonal.x, diagonal.y), "NORTH_EAST");
assert.equal(classifyDirection(0, 0), "SAME_POSITION");

const operations: readonly PathOperation[] = [
  {
    kind: "MOVE",
    heading: { kind: "RELATIVE", relation: "FORWARD" },
    distance: 10,
    facingAfterMove: "UNCHANGED",
  },
  { kind: "TURN", sense: "CLOCKWISE", degrees: 90 },
  {
    kind: "MOVE",
    heading: { kind: "RELATIVE", relation: "FORWARD" },
    distance: 5,
    facingAfterMove: "UNCHANGED",
  },
  {
    kind: "MOVE",
    heading: { kind: "ABSOLUTE", direction: "SOUTH" },
    distance: 4,
    facingAfterMove: "MOVEMENT_DIRECTION",
  },
];

const solvedPath = solvePath({ position: { x: 0, y: 0 }, facing: "NORTH", totalDistance: 0 }, operations);
assert.deepEqual(solvedPath.final.position, { x: 5, y: 6 });
assert.equal(solvedPath.final.facing, "SOUTH");
assert.equal(solvedPath.final.totalDistance, 19);
assert.equal(solvedPath.trace.length, operations.length);
assert.equal(directionBetween(solvedPath.initial.position, solvedPath.final.position), "NORTH_EAST");
assert.equal(directionAndDistance(solvedPath.initial.position, solvedPath.final.position).distance.exactInteger, null);

const relations: readonly PositionRelation[] = [
  { fromEntity: "A", toEntity: "B", vector: { x: 4, y: 0 } },
  { fromEntity: "B", toEntity: "C", vector: { x: 0, y: 3 } },
];
const graph = solveEntityPositions(relations, "A");
assert.equal(graph.connected, true);
assert.deepEqual(graph.contradictions, []);
assert.deepEqual(graph.coordinates, {
  A: { x: 0, y: 0 },
  B: { x: 4, y: 0 },
  C: { x: 4, y: 3 },
});
const graphAnswer = directionAndDistance(graph.coordinates.A, graph.coordinates.C);
assert.equal(graphAnswer.direction, "NORTH_EAST");
assert.equal(graphAnswer.distance.exactInteger, 5);

const contradictoryGraph = solveEntityPositions([
  { fromEntity: "A", toEntity: "B", vector: { x: 2, y: 0 } },
  { fromEntity: "A", toEntity: "B", vector: { x: -2, y: 0 } },
]);
assert.ok(contradictoryGraph.contradictions.length > 0);

const optionValidation = validateDirectionOptions(
  [
    { value: "NORTH_EAST", errorLabel: null },
    { value: "NORTH_WEST", errorLabel: "X_SIGN_REVERSED" },
    { value: "SOUTH_EAST", errorLabel: "Y_SIGN_REVERSED" },
    { value: "SOUTH_WEST", errorLabel: "OPPOSITE_DIRECTION" },
  ],
  (value) => value === "NORTH_EAST",
);
assert.equal(optionValidation.valid, true);
assert.deepEqual(optionValidation.satisfyingOptionIndexes, [0]);

assert.equal(pathTopologyFingerprint(operations), pathTopologyFingerprint(operations));
assert.notEqual(pathTopologyFingerprint(operations), pathTopologyFingerprint(operations.slice(0, -1)));
assert.equal(relationTopologyFingerprint(relations), relationTopologyFingerprint([...relations].reverse()));

assert.equal(DIR_001_ALLOCATION_POLICY.fixedQlTotal, null);
assert.equal(DIR_001_ALLOCATION_POLICY.fixedSolveModeInventory, null);
assertMaterialQlNeed({ independentSolverContract: "Requires inverse reconstruction with uniqueness proof" });
assert.throws(() => assertMaterialQlNeed({}));

const qls: DirectionQuestionLogicContract[] = [
  {
    qlId: "DIR-QL-001",
    checkpointId: "DIR-CP-001",
    ruleId: "DIR_ROTATE_FROM_KNOWN_FACING",
    solverCapabilities: ["ROTATE_ORIENTATION"],
    presentationMode: "TEXT",
    answerType: "DIRECTION",
    renderer: "TEXT",
    localeMode: "TRANSLATABLE",
    status: "DRAFT",
  },
  {
    qlId: "DIR-QL-002",
    checkpointId: "DIR-CP-001",
    ruleId: "DIR_INFER_INITIAL_FACING",
    solveMode: "INVERSE_ORIENTATION",
    solverCapabilities: ["ROTATE_ORIENTATION", "INVERT_ROTATION"],
    presentationMode: "TEXT",
    answerType: "DIRECTION",
    renderer: "TEXT",
    localeMode: "TRANSLATABLE",
    status: "DRAFT",
  },
];
assertContinuousDirectionQlIds(qls);
assert.equal(nextDirectionQlId(qls), "DIR-QL-003");

console.log("DIR-001 foundation exhaustive contract test passed.", {
  directionCount: DIRECTIONS.length,
  operationCount: operations.length,
  graphEntityCount: Object.keys(graph.coordinates).length,
});
