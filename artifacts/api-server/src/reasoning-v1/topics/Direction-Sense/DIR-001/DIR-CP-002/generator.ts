import { endpointDirection } from "../foundation/answer-classifier";
import { classifyDirection, oppositeDirection, turnLeft, turnRight } from "../foundation/directions";
import { validateDirectionOptions } from "../foundation/option-validator";
import { createInitialPathState, solvePath } from "../foundation/path-state";
import type { Coordinate, Direction, DirectionOption, PathOperation, SolvedPath, TurnOperation } from "../foundation/types";
import { solveOrderedPathIndependent } from "./independent-solver";
import { buildPathDiagram, type PathDiagramSpec } from "./path-diagram";
import { PATH_DIRECTION_LABELS, renderCombinedStem, renderEndpointStem } from "./question-language.en";
import { dirCp002Ql } from "./task-registry";

const CARDINAL_DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const DISTANCES = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15] as const;
const PERSON_NAMES = ["Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha"] as const;
const EPSILON = 1e-9;

export interface CombinedPathAnswer {
  readonly endpointDirection: Direction;
  readonly finalFacing: Direction;
}

export type PathAnswerValue = Direction | CombinedPathAnswer;

export interface RenderedPathOption<T extends PathAnswerValue = PathAnswerValue> extends DirectionOption<T> {
  readonly label: string;
}

export interface PathExplanation {
  readonly given: string;
  readonly movementLines: readonly string[];
  readonly conclusion: string;
  readonly diagram: PathDiagramSpec;
}

export interface GeneratedPathQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-002";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly RenderedPathOption[];
  readonly correctIndex: number;
  readonly correctAnswer: PathAnswerValue;
  readonly explanation: PathExplanation;
  readonly metadata: {
    readonly answerDemand: string;
    readonly legCount: number;
    readonly reverseQuery: boolean;
    readonly solverVerified: true;
    readonly solveMode: null;
  };
}

interface BuiltPath {
  readonly person: string;
  readonly initialFacing: Direction;
  readonly operations: readonly PathOperation[];
  readonly solved: SolvedPath;
  readonly legCount: number;
}

interface RouteSegment {
  readonly start: Coordinate;
  readonly end: Coordinate;
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

function pick<T>(items: readonly T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function nearlyEqual(left: number, right: number): boolean {
  return Math.abs(left - right) <= EPSILON;
}

function sameCoordinate(left: Coordinate, right: Coordinate): boolean {
  return nearlyEqual(left.x, right.x) && nearlyEqual(left.y, right.y);
}

function coordinateKey(coordinate: Coordinate): string {
  return `${Math.round(coordinate.x * 1e9)}:${Math.round(coordinate.y * 1e9)}`;
}

function between(value: number, edgeA: number, edgeB: number): boolean {
  return value >= Math.min(edgeA, edgeB) - EPSILON && value <= Math.max(edgeA, edgeB) + EPSILON;
}

function positiveIntervalOverlap(a1: number, a2: number, b1: number, b2: number): boolean {
  const overlap = Math.min(Math.max(a1, a2), Math.max(b1, b2)) - Math.max(Math.min(a1, a2), Math.min(b1, b2));
  return overlap > EPSILON;
}

function segmentsConflict(first: RouteSegment, second: RouteSegment, consecutive: boolean): boolean {
  const firstVertical = nearlyEqual(first.start.x, first.end.x);
  const secondVertical = nearlyEqual(second.start.x, second.end.x);

  if (firstVertical && secondVertical) {
    return nearlyEqual(first.start.x, second.start.x)
      && positiveIntervalOverlap(first.start.y, first.end.y, second.start.y, second.end.y);
  }

  if (!firstVertical && !secondVertical) {
    return nearlyEqual(first.start.y, second.start.y)
      && positiveIntervalOverlap(first.start.x, first.end.x, second.start.x, second.end.x);
  }

  const vertical = firstVertical ? first : second;
  const horizontal = firstVertical ? second : first;
  const crossing = {
    x: vertical.start.x,
    y: horizontal.start.y,
  };
  const intersects = between(crossing.y, vertical.start.y, vertical.end.y)
    && between(crossing.x, horizontal.start.x, horizontal.end.x);
  if (!intersects) return false;

  if (consecutive) {
    const sharedEndpoint = sameCoordinate(first.end, second.start) || sameCoordinate(second.end, first.start);
    if (sharedEndpoint && (
      sameCoordinate(crossing, first.end)
      || sameCoordinate(crossing, first.start)
      || sameCoordinate(crossing, second.end)
      || sameCoordinate(crossing, second.start)
    )) {
      return false;
    }
  }
  return true;
}

function routeIsDiagramClear(solved: SolvedPath): boolean {
  const seenPoints = new Set<string>([coordinateKey(solved.initial.position)]);
  const segments: RouteSegment[] = [];

  for (const trace of solved.trace) {
    if (trace.operation.kind !== "MOVE") continue;
    if (seenPoints.has(coordinateKey(trace.after.position))) return false;
    seenPoints.add(coordinateKey(trace.after.position));
    segments.push({ start: trace.before.position, end: trace.after.position });
  }

  for (let left = 0; left < segments.length; left += 1) {
    for (let right = left + 1; right < segments.length; right += 1) {
      if (segmentsConflict(segments[left], segments[right], right === left + 1)) return false;
    }
  }
  return true;
}

function buildPath(seed: number): BuiltPath {
  for (let attempt = 0; attempt < 256; attempt += 1) {
    const random = seededRandom(seed * 41 + attempt * 101 + 17);
    const person = pick(PERSON_NAMES, random);
    const initialFacing = pick(CARDINAL_DIRECTIONS, random);
    const legCount = 2 + Math.floor(random() * 4);
    const operations: PathOperation[] = [];

    for (let leg = 0; leg < legCount; leg += 1) {
      operations.push({
        kind: "MOVE",
        heading: { kind: "RELATIVE", relation: "FORWARD" },
        distance: pick(DISTANCES, random),
        facingAfterMove: "UNCHANGED",
      });
      if (leg < legCount - 1) {
        operations.push(pick(
          [
            { kind: "TURN", sense: "CLOCKWISE", degrees: 90 },
            { kind: "TURN", sense: "ANTICLOCKWISE", degrees: 90 },
            { kind: "TURN", sense: "CLOCKWISE", degrees: 180 },
          ] as const,
          random,
        ));
      }
    }

    const solved = solvePath(createInitialPathState(initialFacing), operations);
    if (endpointDirection(solved.initial, solved.final) !== "SAME_POSITION" && routeIsDiagramClear(solved)) {
      return { person, initialFacing, operations, solved, legCount };
    }
  }
  throw new Error(`Unable to construct a clear non-degenerate DIR-CP-002 path for seed ${seed}`);
}

function uniqueDirectionDistractors(correct: Direction, vector: Coordinate): readonly { value: Direction; errorLabel: string }[] {
  const candidates: readonly { value: ReturnType<typeof classifyDirection>; errorLabel: string }[] = [
    { value: oppositeDirection(correct), errorLabel: "QUERY_RELATION_REVERSED" },
    { value: classifyDirection(-vector.x, vector.y), errorLabel: "X_SIGN_REVERSED" },
    { value: classifyDirection(vector.x, -vector.y), errorLabel: "Y_SIGN_REVERSED" },
    { value: turnLeft(correct), errorLabel: "LEFT_RIGHT_REVERSED" },
    { value: turnRight(correct), errorLabel: "LEFT_RIGHT_REVERSED" },
  ];
  const used = new Set<Direction>([correct]);
  const distractors: { value: Direction; errorLabel: string }[] = [];
  for (const candidate of candidates) {
    if (candidate.value === "SAME_POSITION" || used.has(candidate.value)) continue;
    used.add(candidate.value);
    distractors.push({ value: candidate.value, errorLabel: candidate.errorLabel });
    if (distractors.length === 3) return distractors;
  }
  throw new Error(`Unable to construct three unique direction distractors for ${correct}`);
}

function directionOptions(correct: Direction, vector: Coordinate, seed: number): readonly RenderedPathOption<Direction>[] {
  return shuffle(
    [
      { value: correct, label: PATH_DIRECTION_LABELS[correct], errorLabel: null },
      ...uniqueDirectionDistractors(correct, vector).map((option) => ({
        ...option,
        label: PATH_DIRECTION_LABELS[option.value],
      })),
    ],
    seededRandom(seed * 43 + 29),
  );
}

function combinedLabel(answer: CombinedPathAnswer): string {
  return `${PATH_DIRECTION_LABELS[answer.endpointDirection]}; facing ${PATH_DIRECTION_LABELS[answer.finalFacing]}`;
}

function combinedOptions(correct: CombinedPathAnswer, seed: number): readonly RenderedPathOption<CombinedPathAnswer>[] {
  const wrongEndpoint = oppositeDirection(correct.endpointDirection);
  const wrongFacing = oppositeDirection(correct.finalFacing);
  return shuffle(
    [
      { value: correct, label: combinedLabel(correct), errorLabel: null },
      {
        value: { endpointDirection: correct.endpointDirection, finalFacing: wrongFacing },
        label: combinedLabel({ endpointDirection: correct.endpointDirection, finalFacing: wrongFacing }),
        errorLabel: "FINAL_FACING_REVERSED",
      },
      {
        value: { endpointDirection: wrongEndpoint, finalFacing: correct.finalFacing },
        label: combinedLabel({ endpointDirection: wrongEndpoint, finalFacing: correct.finalFacing }),
        errorLabel: "QUERY_RELATION_REVERSED",
      },
      {
        value: { endpointDirection: wrongEndpoint, finalFacing: wrongFacing },
        label: combinedLabel({ endpointDirection: wrongEndpoint, finalFacing: wrongFacing }),
        errorLabel: "ENDPOINT_AND_FACING_REVERSED",
      },
    ],
    seededRandom(seed * 47 + 31),
  );
}

function turnPhrase(turn: TurnOperation): string {
  if (turn.degrees === 180) return "turning around";
  return turn.sense === "CLOCKWISE" ? "turning right" : "turning left";
}

function movementWalkthrough(path: BuiltPath): readonly string[] {
  const lines: string[] = [];
  let pendingTurn: TurnOperation | null = null;
  let movementNumber = 0;

  for (const trace of path.solved.trace) {
    if (trace.operation.kind === "TURN") {
      pendingTurn = trace.operation;
      continue;
    }

    movementNumber += 1;
    const direction = PATH_DIRECTION_LABELS[trace.movementDirection!];
    if (movementNumber === 1) {
      lines.push(`First, ${path.person} walks ${trace.operation.distance} metres ${direction}.`);
    } else if (pendingTurn) {
      lines.push(`After ${turnPhrase(pendingTurn)}, ${path.person} walks ${trace.operation.distance} metres ${direction}.`);
    } else {
      lines.push(`Next, ${path.person} walks ${trace.operation.distance} metres ${direction}.`);
    }
    pendingTurn = null;
  }
  return lines;
}

function explanationFor(
  path: BuiltPath,
  endpoint: Direction,
  reverseQuery: boolean,
  includeFacing: boolean,
): PathExplanation {
  const given = `${path.person} starts facing ${PATH_DIRECTION_LABELS[path.initialFacing]}. Reading each turn in order gives the following movements.`;
  const conclusion = includeFacing
    ? `${path.person}'s final position is ${PATH_DIRECTION_LABELS[endpoint]} of the starting point, and ${path.person} is facing ${PATH_DIRECTION_LABELS[path.solved.final.facing]} at the end.`
    : reverseQuery
      ? `The starting point is ${PATH_DIRECTION_LABELS[endpoint]} of ${path.person}'s final position.`
      : `${path.person}'s final position is ${PATH_DIRECTION_LABELS[endpoint]} of the starting point.`;
  return {
    given,
    movementLines: movementWalkthrough(path),
    conclusion,
    diagram: buildPathDiagram(path.solved),
  };
}

function difficultyFor(answerDemand: string, legCount: number): "EASY" | "MEDIUM" | "HARD" {
  if (answerDemand === "ENDPOINT_DIRECTION_AND_FINAL_FACING") {
    return legCount >= 5 ? "HARD" : "MEDIUM";
  }
  if (legCount <= 2) return "EASY";
  if (legCount <= 4) return "MEDIUM";
  return "HARD";
}

function pairNormalize(value: CombinedPathAnswer): string {
  return `${value.endpointDirection}::${value.finalFacing}`;
}

export function generateDirCp002Question(qlId: string, seed = 0): GeneratedPathQuestion {
  if (!Number.isInteger(seed)) throw new Error(`DIR-CP-002 seed must be an integer, received ${seed}`);
  const ql = dirCp002Ql(qlId);
  const path = buildPath(seed * 59 + (ql.answerDemand === "ENDPOINT_DIRECTION" ? 37 : 41));
  const independent = solveOrderedPathIndependent(path.initialFacing, path.operations);
  const generatedEndpoint = endpointDirection(path.solved.initial, path.solved.final);
  if (generatedEndpoint === "SAME_POSITION") throw new Error(`Unexpected zero displacement for ${qlId} seed ${seed}`);
  if (
    generatedEndpoint !== independent.endpointDirection
    || path.solved.final.facing !== independent.finalFacing
    || Math.abs(path.solved.final.position.x - independent.finalPosition.x) > EPSILON
    || Math.abs(path.solved.final.position.y - independent.finalPosition.y) > EPSILON
  ) {
    throw new Error(`Independent path solver disagreed for ${qlId} seed ${seed}`);
  }

  if (ql.answerDemand === "ENDPOINT_DIRECTION") {
    const reverseQuery = seed % 2 === 1;
    const correct = reverseQuery ? oppositeDirection(generatedEndpoint) : generatedEndpoint;
    const queryVector = reverseQuery
      ? { x: -path.solved.final.position.x, y: -path.solved.final.position.y }
      : path.solved.final.position;
    const options = directionOptions(correct, queryVector, seed * 61 + 43);
    const validation = validateDirectionOptions(options, (value) => value === correct);
    if (!validation.valid) throw new Error(validation.errors.join("; "));
    const explanation = explanationFor(path, correct, reverseQuery, false);
    return {
      qlId,
      checkpointId: "DIR-CP-002",
      ruleId: ql.ruleId,
      seed,
      difficulty: difficultyFor(ql.answerDemand, path.legCount),
      stem: renderEndpointStem(path.person, path.solved, reverseQuery),
      structuredPrompt: {
        person: path.person,
        initialFacing: path.initialFacing,
        operations: path.operations,
        labelledPoints: explanation.diagram.points,
        queryReference: reverseQuery ? "START_FROM_FINAL" : "FINAL_FROM_START",
      },
      options,
      correctIndex: validation.satisfyingOptionIndexes[0],
      correctAnswer: correct,
      explanation,
      metadata: { answerDemand: ql.answerDemand, legCount: path.legCount, reverseQuery, solverVerified: true, solveMode: null },
    };
  }

  const correct: CombinedPathAnswer = {
    endpointDirection: generatedEndpoint,
    finalFacing: path.solved.final.facing,
  };
  const options = combinedOptions(correct, seed * 67 + 47);
  const validation = validateDirectionOptions(
    options,
    (value) => value.endpointDirection === correct.endpointDirection && value.finalFacing === correct.finalFacing,
    pairNormalize,
  );
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const explanation = explanationFor(path, generatedEndpoint, false, true);
  return {
    qlId,
    checkpointId: "DIR-CP-002",
    ruleId: ql.ruleId,
    seed,
    difficulty: difficultyFor(ql.answerDemand, path.legCount),
    stem: renderCombinedStem(path.person, path.solved),
    structuredPrompt: {
      person: path.person,
      initialFacing: path.initialFacing,
      operations: path.operations,
      labelledPoints: explanation.diagram.points,
    },
    options,
    correctIndex: validation.satisfyingOptionIndexes[0],
    correctAnswer: correct,
    explanation,
    metadata: { answerDemand: ql.answerDemand, legCount: path.legCount, reverseQuery: false, solverVerified: true, solveMode: null },
  };
}
