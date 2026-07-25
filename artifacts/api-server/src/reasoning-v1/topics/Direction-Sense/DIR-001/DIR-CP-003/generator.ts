import { distanceBetween } from "../foundation/coordinates";
import { oppositeDirection, turnLeft, turnRight } from "../foundation/directions";
import { exactDistanceFromComponents, formatDistanceValue, formatDistanceWithUnit, type DistanceDisplayMode, type ExactDistanceValue } from "../foundation/exact-distance";
import { createInitialPathState, solvePath } from "../foundation/path-state";
import type { Coordinate, Direction, DirectionOption, PathOperation, SolvedPath, TurnOperation } from "../foundation/types";
import { buildPathDiagram, type PathDiagramSpec } from "../DIR-CP-002/path-diagram";
import { solveDistancePathIndependent, solveMissingDistanceIndependent, type UnknownDistanceOperation } from "./independent-solver";
import {
  DISTANCE_DIRECTION_LABELS,
  formatDirectionDistance,
  renderDirectionDistanceStem,
  renderMissingDistanceStem,
  renderNonIntegerDistanceStem,
  renderShortestDistanceStem,
  renderTravelDisplacementStem,
  metreText,
  type PersonProfile,
} from "./question-language.en";
import { dirCp003Ql, type DirCp003AnswerDemand } from "./task-registry";

const CARDINAL_DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const PYTHAGOREAN_TRIPLES = [
  [3, 4, 5],
  [5, 12, 13],
  [7, 24, 25],
  [8, 15, 17],
  [9, 40, 41],
] as const;
const NON_INTEGER_COMPONENTS = [
  [2, 3],
  [2, 5],
  [3, 5],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 8],
] as const;
const PEOPLE: readonly PersonProfile[] = [
  { name: "Aman", pronoun: "He", possessive: "his" },
  { name: "Beena", pronoun: "She", possessive: "her" },
  { name: "Charan", pronoun: "He", possessive: "his" },
  { name: "Deepa", pronoun: "She", possessive: "her" },
  { name: "Farhan", pronoun: "He", possessive: "his" },
  { name: "Gurpreet", pronoun: "She", possessive: "her" },
  { name: "Harpreet", pronoun: "He", possessive: "his" },
  { name: "Isha", pronoun: "She", possessive: "her" },
];
const EPSILON = 1e-9;

export type DistancePathProfile = "AXIS" | "PYTHAGOREAN" | "NON_INTEGER" | "INVERSE_TARGET";

export interface DistanceOnlyAnswer {
  readonly kind: "DISTANCE";
  readonly distance: number;
  readonly squaredDistance: number;
}

export interface DirectionDistanceAnswer {
  readonly kind: "DIRECTION_DISTANCE";
  readonly direction: Direction;
  readonly distance: number;
  readonly squaredDistance: number;
}

export interface TravelDisplacementAnswer {
  readonly kind: "TOTAL_AND_DISPLACEMENT";
  readonly totalDistance: number;
  readonly displacement: number;
}

export type DirCp003Answer = DistanceOnlyAnswer | DirectionDistanceAnswer | TravelDisplacementAnswer;

export interface RenderedDistanceOption extends DirectionOption<DirCp003Answer> {
  readonly label: string;
}

export interface DistanceExplanation {
  readonly given: string;
  readonly movementLines: readonly string[];
  readonly netLine: string;
  readonly calculationLine: string | null;
  readonly conclusion: string;
  readonly diagram: PathDiagramSpec;
}

export interface GeneratedDistanceQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-003";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly RenderedDistanceOption[];
  readonly correctIndex: number;
  readonly correctAnswer: DirCp003Answer;
  readonly explanation: DistanceExplanation;
  readonly metadata: {
    readonly answerDemand: DirCp003AnswerDemand;
    readonly legCount: number;
    readonly pathProfile: DistancePathProfile;
    readonly reverseQuery: boolean;
    readonly displayMode: DistanceDisplayMode;
    readonly solverVerified: true;
    readonly solveMode: null;
  };
}

interface BuiltDistancePath {
  readonly person: PersonProfile;
  readonly initialFacing: Direction;
  readonly operations: readonly PathOperation[];
  readonly solved: SolvedPath;
  readonly profile: DistancePathProfile;
}

interface BuiltInversePath extends BuiltDistancePath {
  readonly unknownMoveNumber: number;
  readonly unknownOperations: readonly UnknownDistanceOperation[];
  readonly target: Coordinate;
  readonly missingDistance: number;
}

function seededRandom(seed: number): () => number {
  let state = (seed ^ 0x9e3779b9) >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], seed: number): T[] {
  const result = [...items];
  const random = seededRandom(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function personFor(seed: number): PersonProfile {
  return PEOPLE[Math.abs(seed) % PEOPLE.length];
}

function cardinalIndex(direction: Direction): number {
  const index = CARDINAL_DIRECTIONS.indexOf(direction as (typeof CARDINAL_DIRECTIONS)[number]);
  if (index === -1) throw new Error(`Expected cardinal direction, received ${direction}`);
  return index;
}

function turnBetween(from: Direction, to: Direction): TurnOperation {
  const delta = (cardinalIndex(to) - cardinalIndex(from) + 4) % 4;
  if (delta === 1) return { kind: "TURN", sense: "CLOCKWISE", degrees: 90 };
  if (delta === 2) return { kind: "TURN", sense: "CLOCKWISE", degrees: 180 };
  if (delta === 3) return { kind: "TURN", sense: "ANTICLOCKWISE", degrees: 90 };
  throw new Error(`Consecutive DIR-CP-003 legs may not use the same direction: ${from}`);
}

function operationsForLegs(directions: readonly Direction[], distances: readonly number[]): readonly PathOperation[] {
  if (directions.length !== distances.length || directions.length < 2) {
    throw new Error("DIR-CP-003 path legs require matching direction and distance arrays");
  }
  const operations: PathOperation[] = [];
  for (let index = 0; index < directions.length; index += 1) {
    if (index > 0) operations.push(turnBetween(directions[index - 1], directions[index]));
    operations.push({
      kind: "MOVE",
      heading: { kind: "RELATIVE", relation: "FORWARD" },
      distance: distances[index],
      facingAfterMove: "UNCHANGED",
    });
  }
  return operations;
}

function solveBuiltPath(person: PersonProfile, directions: readonly Direction[], distances: readonly number[], profile: DistancePathProfile): BuiltDistancePath {
  const initialFacing = directions[0];
  const operations = operationsForLegs(directions, distances);
  const solved = solvePath(createInitialPathState(initialFacing), operations);
  return { person, initialFacing, operations, solved, profile };
}

function horizontalDirection(seed: number): Direction {
  return (seed & 1) === 0 ? "EAST" : "WEST";
}

function verticalDirection(seed: number): Direction {
  return (seed & 2) === 0 ? "NORTH" : "SOUTH";
}

function buildExactPath(seed: number): BuiltDistancePath {
  const person = personFor(seed);
  if (Math.abs(seed) % 3 === 0) {
    const main = CARDINAL_DIRECTIONS[Math.abs(seed) % CARDINAL_DIRECTIONS.length];
    const side = (seed & 4) === 0 ? turnRight(main) : turnLeft(main);
    const detour = 2 + (Math.abs(seed * 7) % 5);
    const magnitude = 5 + (Math.abs(seed * 11) % 11);
    return solveBuiltPath(person, [side, main, oppositeDirection(side)], [detour, magnitude, detour], "AXIS");
  }

  const triple = PYTHAGOREAN_TRIPLES[Math.abs(seed) % PYTHAGOREAN_TRIPLES.length];
  const swap = (seed & 8) !== 0;
  const horizontalDistance = swap ? triple[1] : triple[0];
  const verticalDistance = swap ? triple[0] : triple[1];
  const horizontal = horizontalDirection(seed);
  const vertical = verticalDirection(seed);
  if ((seed & 16) === 0 || horizontalDistance < 4) {
    return solveBuiltPath(person, [horizontal, vertical], [horizontalDistance, verticalDistance], "PYTHAGOREAN");
  }
  const firstPart = Math.max(1, Math.floor(horizontalDistance / 2));
  const secondPart = horizontalDistance - firstPart;
  return solveBuiltPath(person, [horizontal, vertical, horizontal], [firstPart, verticalDistance, secondPart], "PYTHAGOREAN");
}

function buildNonIntegerPath(seed: number): BuiltDistancePath {
  const random = seededRandom(seed * 97 + 31);
  const person = PEOPLE[Math.floor(random() * PEOPLE.length)];
  for (let attempt = 0; attempt < 32; attempt += 1) {
    const pair = NON_INTEGER_COMPONENTS[(Math.abs(seed) + attempt) % NON_INTEGER_COMPONENTS.length];
    const scale = 1 + Math.floor(random() * 2);
    const horizontalDistance = pair[0] * scale;
    const verticalDistance = pair[1] * scale;
    const squared = horizontalDistance * horizontalDistance + verticalDistance * verticalDistance;
    if (Number.isInteger(Math.sqrt(squared))) continue;
    const horizontal: Direction = random() < 0.5 ? "EAST" : "WEST";
    const vertical: Direction = random() < 0.5 ? "NORTH" : "SOUTH";
    const firstPart = Math.max(1, Math.floor(horizontalDistance / 2));
    const secondPart = horizontalDistance - firstPart;
    if (horizontalDistance >= 4 && secondPart > 0 && random() < 0.5) {
      return solveBuiltPath(person, [horizontal, vertical, horizontal], [firstPart, verticalDistance, secondPart], "NON_INTEGER");
    }
    return solveBuiltPath(person, [horizontal, vertical], [horizontalDistance, verticalDistance], "NON_INTEGER");
  }
  throw new Error(`Unable to construct non-integer DIR-CP-003 path for seed ${seed}`);
}

function buildInversePath(seed: number): BuiltInversePath {
  const random = seededRandom(seed * 83 + 17);
  const person = PEOPLE[Math.floor(random() * PEOPLE.length)];
  const horizontal: Direction = random() < 0.5 ? "EAST" : "WEST";
  const vertical: Direction = random() < 0.5 ? "NORTH" : "SOUTH";
  const firstDistance = 7 + Math.floor(random() * 18);
  const verticalDistance = 4 + Math.floor(random() * 16);
  const useOppositeFinalLeg = random() < 0.5;
  const finalDirection = useOppositeFinalLeg ? oppositeDirection(horizontal) : horizontal;
  const missingDistance = useOppositeFinalLeg
    ? 2 + Math.floor(random() * Math.max(1, firstDistance - 3))
    : 3 + Math.floor(random() * 13);
  const built = solveBuiltPath(
    person,
    [horizontal, vertical, finalDirection],
    [firstDistance, verticalDistance, missingDistance],
    "INVERSE_TARGET",
  );
  const unknownMoveNumber = 3;
  let moveNumber = 0;
  const unknownOperations: UnknownDistanceOperation[] = built.operations.map((operation) => {
    if (operation.kind === "TURN") return operation;
    moveNumber += 1;
    return moveNumber === unknownMoveNumber ? { ...operation, distance: null } : operation;
  });
  return {
    ...built,
    unknownMoveNumber,
    unknownOperations,
    target: built.solved.final.position,
    missingDistance,
  };
}

function moveCount(operations: readonly PathOperation[]): number {
  return operations.filter((operation) => operation.kind === "MOVE").length;
}

function answerKey(answer: DirCp003Answer): string {
  if (answer.kind === "DISTANCE") return `D:${Math.round(answer.squaredDistance * 1e9)}`;
  if (answer.kind === "DIRECTION_DISTANCE") return `DD:${answer.direction}:${Math.round(answer.squaredDistance * 1e9)}`;
  return `TD:${Math.round(answer.totalDistance * 1e9)}:${Math.round(answer.displacement * 1e9)}`;
}

function validateOptions(options: readonly RenderedDistanceOption[], correct: DirCp003Answer): number {
  if (options.length !== 4) throw new Error(`DIR-CP-003 requires four options, received ${options.length}`);
  if (new Set(options.map((option) => option.label.toLocaleLowerCase("en-IN"))).size !== 4) {
    throw new Error("DIR-CP-003 options must have four unique labels");
  }
  const correctKey = answerKey(correct);
  const satisfying = options.map((option, index) => answerKey(option.value) === correctKey ? index : -1).filter((index) => index >= 0);
  if (satisfying.length !== 1) throw new Error(`DIR-CP-003 expected one correct option, received ${satisfying.length}`);
  return satisfying[0];
}

function distanceAnswer(value: number): DistanceOnlyAnswer {
  return { kind: "DISTANCE", distance: value, squaredDistance: value * value };
}

function distanceAnswerFromExact(value: ExactDistanceValue): DistanceOnlyAnswer {
  return { kind: "DISTANCE", distance: value.distance, squaredDistance: value.squaredDistance };
}

function uniquePositiveIntegers(correct: number, candidates: readonly number[]): readonly number[] {
  const used = new Set<number>([correct]);
  const result: number[] = [];
  for (const raw of candidates) {
    const candidate = Math.round(raw);
    if (candidate <= 0 || used.has(candidate)) continue;
    used.add(candidate);
    result.push(candidate);
    if (result.length === 3) return result;
  }
  for (let offset = 1; result.length < 3; offset += 1) {
    const candidate = correct + offset;
    if (!used.has(candidate)) {
      used.add(candidate);
      result.push(candidate);
    }
  }
  return result;
}

function integerDistanceOptions(path: BuiltDistancePath, exact: ExactDistanceValue, seed: number): readonly RenderedDistanceOption[] {
  if (exact.exactInteger === null) throw new Error("Integer option builder received a non-integer displacement");
  const correct = exact.exactInteger;
  const total = path.solved.final.totalDistance;
  const dx = Math.abs(exact.dx);
  const dy = Math.abs(exact.dy);
  const wrong = uniquePositiveIntegers(correct, [total, dx + dy, Math.max(dx, dy), Math.min(dx, dy), exact.squaredDistance, correct + 2, correct - 2]);
  const options: RenderedDistanceOption[] = [
    { value: distanceAnswer(correct), label: metreText(correct), errorLabel: null },
    { value: distanceAnswer(wrong[0]), label: metreText(wrong[0]), errorLabel: "TOTAL_OR_MANHATTAN_DISTANCE" },
    { value: distanceAnswer(wrong[1]), label: metreText(wrong[1]), errorLabel: "ONE_AXIS_OR_SQUARED_DISTANCE" },
    { value: distanceAnswer(wrong[2]), label: metreText(wrong[2]), errorLabel: "ARITHMETIC_DISTANCE_ERROR" },
  ];
  return shuffle(options, seed * 43 + 17);
}

function directionDistanceOptions(
  path: BuiltDistancePath,
  direction: Direction,
  exact: ExactDistanceValue,
  seed: number,
): readonly RenderedDistanceOption[] {
  if (exact.exactInteger === null) throw new Error("Direction-distance option builder received a non-integer displacement");
  const wrongDistance = uniquePositiveIntegers(exact.exactInteger, [path.solved.final.totalDistance, Math.abs(exact.dx) + Math.abs(exact.dy), Math.max(Math.abs(exact.dx), Math.abs(exact.dy)), exact.exactInteger + 2])[0];
  const correct: DirectionDistanceAnswer = { kind: "DIRECTION_DISTANCE", direction, distance: exact.exactInteger, squaredDistance: exact.squaredDistance };
  const reversed: DirectionDistanceAnswer = { ...correct, direction: oppositeDirection(direction) };
  const wrongMagnitude: DirectionDistanceAnswer = { ...correct, distance: wrongDistance, squaredDistance: wrongDistance * wrongDistance };
  const bothWrong: DirectionDistanceAnswer = { ...wrongMagnitude, direction: oppositeDirection(direction) };
  return shuffle([
    { value: correct, label: formatDirectionDistance(direction, exact, "INTEGER"), errorLabel: null },
    { value: reversed, label: formatDirectionDistance(reversed.direction, exact, "INTEGER"), errorLabel: "QUERY_RELATION_REVERSED" },
    { value: wrongMagnitude, label: `${DISTANCE_DIRECTION_LABELS[direction]}, ${metreText(wrongDistance)}`, errorLabel: "DISTANCE_COMPUTATION_ERROR" },
    { value: bothWrong, label: `${DISTANCE_DIRECTION_LABELS[bothWrong.direction]}, ${metreText(wrongDistance)}`, errorLabel: "DIRECTION_AND_DISTANCE_ERROR" },
  ], seed * 47 + 19);
}

function travelDisplacementOptions(path: BuiltDistancePath, exact: ExactDistanceValue, seed: number): readonly RenderedDistanceOption[] {
  if (exact.exactInteger === null) throw new Error("Travel-displacement option builder received a non-integer displacement");
  const total = path.solved.final.totalDistance;
  const displacement = exact.exactInteger;
  const wrongDisplacement = uniquePositiveIntegers(displacement, [Math.abs(exact.dx) + Math.abs(exact.dy), Math.max(Math.abs(exact.dx), Math.abs(exact.dy)), displacement + 2])[0];
  const wrongTotal = uniquePositiveIntegers(total, [total - 2, total + 2, displacement, Math.abs(exact.dx) + Math.abs(exact.dy)])[0];
  const pair = (candidateTotal: number, candidateDisplacement: number): TravelDisplacementAnswer => ({
    kind: "TOTAL_AND_DISPLACEMENT",
    totalDistance: candidateTotal,
    displacement: candidateDisplacement,
  });
  const values = [
    { value: pair(total, displacement), errorLabel: null },
    { value: pair(displacement, total), errorLabel: "TOTAL_AND_DISPLACEMENT_SWAPPED" },
    { value: pair(total, wrongDisplacement), errorLabel: "DISPLACEMENT_COMPUTATION_ERROR" },
    { value: pair(wrongTotal, displacement), errorLabel: "TRAVEL_DISTANCE_SUM_ERROR" },
  ];
  return shuffle(values.map((option) => ({
    ...option,
    label: `Total ${metreText(option.value.totalDistance)}; shortest ${metreText(option.value.displacement)}`,
  })), seed * 53 + 23);
}

function missingDistanceOptions(path: BuiltInversePath, seed: number): readonly RenderedDistanceOption[] {
  const correct = path.missingDistance;
  const wrong = uniquePositiveIntegers(correct, [correct + 2, correct - 2, path.solved.final.totalDistance, Math.abs(path.target.x), Math.abs(path.target.y), correct + 4]);
  return shuffle([
    { value: distanceAnswer(correct), label: metreText(correct), errorLabel: null },
    { value: distanceAnswer(wrong[0]), label: metreText(wrong[0]), errorLabel: "TARGET_COMPONENT_ADDITION_ERROR" },
    { value: distanceAnswer(wrong[1]), label: metreText(wrong[1]), errorLabel: "TURN_DIRECTION_REVERSAL" },
    { value: distanceAnswer(wrong[2]), label: metreText(wrong[2]), errorLabel: "TOTAL_DISTANCE_CONFUSION" },
  ], seed * 59 + 29);
}

function exactFromSquared(squaredDistance: number): ExactDistanceValue {
  return exactDistanceFromComponents(Math.sqrt(squaredDistance), 0);
}

function nonIntegerDistanceOptions(exact: ExactDistanceValue, displayMode: Exclude<DistanceDisplayMode, "INTEGER">, seed: number): readonly RenderedDistanceOption[] {
  const correct = distanceAnswerFromExact(exact);
  const dx = Math.abs(exact.dx);
  const dy = Math.abs(exact.dy);
  const candidateSquares = [
    dx * dx + dy,
    dx + dy * dy,
    (dx + dy) * (dx + dy),
    Math.abs(dx * dx - dy * dy),
    exact.squaredDistance + 1,
    exact.squaredDistance + 3,
    Math.max(1, exact.squaredDistance - 1),
  ].map((value) => Math.round(value));
  const usedLabels = new Set<string>([formatDistanceWithUnit(exact, displayMode)]);
  const distractors: RenderedDistanceOption[] = [];
  for (const squared of candidateSquares) {
    if (squared <= 0 || squared === exact.squaredDistance) continue;
    const candidate = exactFromSquared(squared);
    const label = formatDistanceWithUnit(candidate, displayMode);
    if (usedLabels.has(label)) continue;
    usedLabels.add(label);
    distractors.push({
      value: distanceAnswerFromExact(candidate),
      label,
      errorLabel: distractors.length === 0 ? "COMPONENT_NOT_SQUARED" : distractors.length === 1 ? "MANHATTAN_DISTANCE" : "RADICAL_OR_ROUNDING_ERROR",
    });
    if (distractors.length === 3) break;
  }
  if (distractors.length !== 3) throw new Error("Unable to create three non-integer distance distractors");
  return shuffle([
    { value: correct, label: formatDistanceWithUnit(exact, displayMode), errorLabel: null },
    ...distractors,
  ], seed * 61 + 31);
}

function turnPhrase(turn: TurnOperation): string {
  if (turn.degrees === 180) return "turning around";
  return turn.sense === "CLOCKWISE" ? "turning right" : "turning left";
}

function movementWalkthrough(path: BuiltDistancePath): readonly string[] {
  const lines: string[] = [];
  let pendingTurn: TurnOperation | null = null;
  let moveNumber = 0;
  for (const trace of path.solved.trace) {
    if (trace.operation.kind === "TURN") {
      pendingTurn = trace.operation;
      continue;
    }
    moveNumber += 1;
    const direction = DISTANCE_DIRECTION_LABELS[trace.movementDirection!];
    if (moveNumber === 1) {
      lines.push(`First, ${path.person.name} walks ${trace.operation.distance} metres ${direction}.`);
    } else if (pendingTurn) {
      lines.push(`After ${turnPhrase(pendingTurn)}, ${path.person.name} walks ${trace.operation.distance} metres ${direction}.`);
    } else {
      lines.push(`Next, ${path.person.name} walks ${trace.operation.distance} metres ${direction}.`);
    }
    pendingTurn = null;
  }
  return lines;
}

function axisComponentText(value: number, positive: string, negative: string): string | null {
  if (Math.abs(value) <= EPSILON) return null;
  return `${metreText(Math.abs(value))} ${value > 0 ? positive : negative}`;
}

function netLineFor(exact: ExactDistanceValue): string {
  const parts = [
    axisComponentText(exact.dx, "East", "West"),
    axisComponentText(exact.dy, "North", "South"),
  ].filter((value): value is string => value !== null);
  return `The net movement is ${parts.join(" and ")}.`;
}

function shortestDistanceCalculation(exact: ExactDistanceValue, displayMode: DistanceDisplayMode): string {
  const horizontal = Math.round(Math.abs(exact.dx));
  const vertical = Math.round(Math.abs(exact.dy));
  const rendered = formatDistanceWithUnit(exact, displayMode);

  if (horizontal === 0 || vertical === 0) {
    const remaining = horizontal === 0 ? vertical : horizontal;
    return `Only one net direction remains after cancellation. Therefore, the straight line from Start to Finish is ${remaining} metres.`;
  }

  const rootStep = `√(${horizontal}² + ${vertical}²) = √${exact.squaredDistance}`;
  if (displayMode === "INTEGER") {
    return `The shortest route is the straight line from Start to Finish: ${rootStep} = ${rendered}.`;
  }
  if (displayMode === "RADICAL") {
    const simplified = formatDistanceValue(exact, "RADICAL");
    const simplification = simplified === `√${exact.squaredDistance}` ? "" : ` = ${simplified}`;
    return `The shortest route is the straight line from Start to Finish: ${rootStep}${simplification} metres.`;
  }
  return `The shortest route is the straight line from Start to Finish: ${rootStep} ≈ ${rendered}.`;
}

function baseExplanation(
  path: BuiltDistancePath,
  exact: ExactDistanceValue,
  conclusion: string,
  displayMode: DistanceDisplayMode,
  illustrateShortestDistance: boolean,
): DistanceExplanation {
  const shortestDistanceLabel = illustrateShortestDistance ? formatDistanceWithUnit(exact, displayMode) : undefined;
  return {
    given: `${path.person.name} starts facing ${DISTANCE_DIRECTION_LABELS[path.initialFacing]}. Reading each turn in order gives the following movements.`,
    movementLines: movementWalkthrough(path),
    netLine: netLineFor(exact),
    calculationLine: illustrateShortestDistance ? shortestDistanceCalculation(exact, displayMode) : null,
    conclusion,
    diagram: buildPathDiagram(path.solved, shortestDistanceLabel ? { shortestDistanceLabel } : {}),
  };
}

function difficultyFor(answerDemand: DirCp003AnswerDemand, profile: DistancePathProfile, legCount: number): "EASY" | "MEDIUM" | "HARD" {
  if (answerDemand === "NON_INTEGER_SHORTEST_DISTANCE") return "HARD";
  if (answerDemand === "MISSING_MOVEMENT_DISTANCE") return legCount >= 3 ? "HARD" : "MEDIUM";
  if (profile === "AXIS" && answerDemand === "SHORTEST_DISTANCE") return "EASY";
  if (answerDemand === "DIRECTION_AND_SHORTEST_DISTANCE" || answerDemand === "TOTAL_DISTANCE_AND_DISPLACEMENT") return legCount >= 3 ? "HARD" : "MEDIUM";
  return "MEDIUM";
}

function verifyForwardPath(path: BuiltDistancePath): ExactDistanceValue {
  const independent = solveDistancePathIndependent(path.initialFacing, path.operations);
  const direct = distanceBetween(path.solved.initial.position, path.solved.final.position);
  if (
    Math.abs(independent.finalPosition.x - path.solved.final.position.x) > EPSILON
    || Math.abs(independent.finalPosition.y - path.solved.final.position.y) > EPSILON
    || Math.abs(independent.totalDistance - path.solved.final.totalDistance) > EPSILON
    || Math.abs(independent.displacement.distance - direct.distance) > EPSILON
  ) {
    throw new Error("Independent DIR-CP-003 solver disagreed with the generated path");
  }
  return independent.displacement;
}

export function generateDirCp003Question(qlId: string, seed = 0): GeneratedDistanceQuestion {
  if (!Number.isInteger(seed)) throw new Error(`DIR-CP-003 seed must be an integer, received ${seed}`);
  const ql = dirCp003Ql(qlId);

  if (ql.answerDemand === "MISSING_MOVEMENT_DISTANCE") {
    const path = buildInversePath(seed * 67 + 37);
    const inverse = solveMissingDistanceIndependent(path.initialFacing, path.unknownOperations, path.target);
    if (Math.abs(inverse.missingDistance - path.missingDistance) > EPSILON) {
      throw new Error(`Inverse DIR-CP-003 solver disagreed for seed ${seed}`);
    }
    const exact = exactDistanceFromComponents(path.target.x, path.target.y);
    const correct = distanceAnswer(path.missingDistance);
    const options = missingDistanceOptions(path, seed);
    const correctIndex = validateOptions(options, correct);
    const conclusion = `The final stretch must be ${path.missingDistance} metres for the stated endpoint to be reached.`;
    return {
      qlId,
      checkpointId: "DIR-CP-003",
      ruleId: ql.ruleId,
      seed,
      difficulty: difficultyFor(ql.answerDemand, path.profile, moveCount(path.operations)),
      stem: renderMissingDistanceStem(path.person, path.solved, path.target, path.unknownMoveNumber),
      structuredPrompt: {
        person: path.person,
        initialFacing: path.initialFacing,
        operations: path.unknownOperations,
        targetEndpoint: path.target,
        unknownMoveNumber: path.unknownMoveNumber,
      },
      options,
      correctIndex,
      correctAnswer: correct,
      explanation: baseExplanation(path, exact, conclusion, "INTEGER", false),
      metadata: {
        answerDemand: ql.answerDemand,
        legCount: moveCount(path.operations),
        pathProfile: path.profile,
        reverseQuery: false,
        displayMode: "INTEGER",
        solverVerified: true,
        solveMode: null,
      },
    };
  }

  if (ql.answerDemand === "NON_INTEGER_SHORTEST_DISTANCE") {
    const path = buildNonIntegerPath(seed * 71 + 41);
    const exact = verifyForwardPath(path);
    if (exact.exactInteger !== null) throw new Error(`Non-integer DIR-CP-003 path unexpectedly produced ${exact.exactInteger}`);
    const displayMode: Exclude<DistanceDisplayMode, "INTEGER"> = seed % 2 === 0 ? "RADICAL" : "DECIMAL_1";
    const correct = distanceAnswerFromExact(exact);
    const options = nonIntegerDistanceOptions(exact, displayMode, seed);
    const correctIndex = validateOptions(options, correct);
    const conclusion = `The shortest distance is ${formatDistanceWithUnit(exact, displayMode)}.`;
    return {
      qlId,
      checkpointId: "DIR-CP-003",
      ruleId: ql.ruleId,
      seed,
      difficulty: "HARD",
      stem: renderNonIntegerDistanceStem(path.person, path.solved, displayMode),
      structuredPrompt: { person: path.person, initialFacing: path.initialFacing, operations: path.operations, displayMode },
      options,
      correctIndex,
      correctAnswer: correct,
      explanation: baseExplanation(path, exact, conclusion, displayMode, true),
      metadata: {
        answerDemand: ql.answerDemand,
        legCount: moveCount(path.operations),
        pathProfile: path.profile,
        reverseQuery: false,
        displayMode,
        solverVerified: true,
        solveMode: null,
      },
    };
  }

  const path = buildExactPath(seed * 73 + qlId.charCodeAt(qlId.length - 1));
  const exact = verifyForwardPath(path);
  if (exact.exactInteger === null) throw new Error(`Exact DIR-CP-003 path produced non-integer displacement for ${qlId} seed ${seed}`);
  const legCount = moveCount(path.operations);

  if (ql.answerDemand === "SHORTEST_DISTANCE") {
    const correct = distanceAnswer(exact.exactInteger);
    const options = integerDistanceOptions(path, exact, seed);
    const correctIndex = validateOptions(options, correct);
    const conclusion = `The shortest distance between the starting point and final position is ${exact.exactInteger} metres.`;
    return {
      qlId,
      checkpointId: "DIR-CP-003",
      ruleId: ql.ruleId,
      seed,
      difficulty: difficultyFor(ql.answerDemand, path.profile, legCount),
      stem: renderShortestDistanceStem(path.person, path.solved),
      structuredPrompt: { person: path.person, initialFacing: path.initialFacing, operations: path.operations, query: "SHORTEST_DISTANCE" },
      options,
      correctIndex,
      correctAnswer: correct,
      explanation: baseExplanation(path, exact, conclusion, "INTEGER", true),
      metadata: { answerDemand: ql.answerDemand, legCount, pathProfile: path.profile, reverseQuery: false, displayMode: "INTEGER", solverVerified: true, solveMode: null },
    };
  }

  if (ql.answerDemand === "DIRECTION_AND_SHORTEST_DISTANCE") {
    const reverseQuery = seededRandom(seed * 79 + 11)() < 0.5;
    const endpointDirection = solveDistancePathIndependent(path.initialFacing, path.operations).endpointDirection;
    const direction = reverseQuery ? oppositeDirection(endpointDirection) : endpointDirection;
    const correct: DirectionDistanceAnswer = { kind: "DIRECTION_DISTANCE", direction, distance: exact.exactInteger, squaredDistance: exact.squaredDistance };
    const options = directionDistanceOptions(path, direction, exact, seed);
    const correctIndex = validateOptions(options, correct);
    const conclusion = reverseQuery
      ? `The starting point is ${DISTANCE_DIRECTION_LABELS[direction]} of the final position, at a shortest distance of ${exact.exactInteger} metres.`
      : `The final position is ${DISTANCE_DIRECTION_LABELS[direction]} of the starting point, at a shortest distance of ${exact.exactInteger} metres.`;
    return {
      qlId,
      checkpointId: "DIR-CP-003",
      ruleId: ql.ruleId,
      seed,
      difficulty: difficultyFor(ql.answerDemand, path.profile, legCount),
      stem: renderDirectionDistanceStem(path.person, path.solved, reverseQuery),
      structuredPrompt: { person: path.person, initialFacing: path.initialFacing, operations: path.operations, queryReference: reverseQuery ? "START_FROM_FINAL" : "FINAL_FROM_START" },
      options,
      correctIndex,
      correctAnswer: correct,
      explanation: baseExplanation(path, exact, conclusion, "INTEGER", true),
      metadata: { answerDemand: ql.answerDemand, legCount, pathProfile: path.profile, reverseQuery, displayMode: "INTEGER", solverVerified: true, solveMode: null },
    };
  }

  const correct: TravelDisplacementAnswer = {
    kind: "TOTAL_AND_DISPLACEMENT",
    totalDistance: path.solved.final.totalDistance,
    displacement: exact.exactInteger,
  };
  const options = travelDisplacementOptions(path, exact, seed);
  const correctIndex = validateOptions(options, correct);
  const conclusion = `${path.person.name} travels ${correct.totalDistance} metres in total, while the shortest distance from the starting point is ${correct.displacement} metres.`;
  return {
    qlId,
    checkpointId: "DIR-CP-003",
    ruleId: ql.ruleId,
    seed,
    difficulty: difficultyFor(ql.answerDemand, path.profile, legCount),
    stem: renderTravelDisplacementStem(path.person, path.solved),
    structuredPrompt: { person: path.person, initialFacing: path.initialFacing, operations: path.operations, query: "TOTAL_AND_DISPLACEMENT" },
    options,
    correctIndex,
    correctAnswer: correct,
    explanation: baseExplanation(path, exact, conclusion, "INTEGER", true),
    metadata: { answerDemand: ql.answerDemand, legCount, pathProfile: path.profile, reverseQuery: false, displayMode: "INTEGER", solverVerified: true, solveMode: null },
  };
}
