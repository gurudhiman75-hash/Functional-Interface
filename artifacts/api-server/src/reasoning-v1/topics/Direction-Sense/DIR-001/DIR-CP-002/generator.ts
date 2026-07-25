import { endpointDirection } from "../foundation/answer-classifier";
import { classifyDirection, oppositeDirection, turnLeft, turnRight } from "../foundation/directions";
import { validateDirectionOptions } from "../foundation/option-validator";
import { createInitialPathState, solvePath } from "../foundation/path-state";
import type { Coordinate, Direction, DirectionOption, PathOperation, SolvedPath } from "../foundation/types";
import { solveOrderedPathIndependent } from "./independent-solver";
import { buildPathDiagram, type PathDiagramSpec } from "./path-diagram";
import { PATH_DIRECTION_LABELS, renderCombinedStem, renderEndpointStem } from "./question-language.en";
import { dirCp002Ql } from "./task-registry";

const CARDINAL_DIRECTIONS = ["NORTH", "EAST", "SOUTH", "WEST"] as const;
const DISTANCES = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15] as const;
const PERSON_NAMES = ["Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha"] as const;

export interface CombinedPathAnswer {
  readonly endpointDirection: Direction;
  readonly finalFacing: Direction;
}

export type PathAnswerValue = Direction | CombinedPathAnswer;

export interface RenderedPathOption<T extends PathAnswerValue = PathAnswerValue> extends DirectionOption<T> {
  readonly label: string;
}

export interface PathExplanationStep {
  readonly stepNumber: number;
  readonly title: string;
  readonly statement: string;
  readonly calculation: string;
  readonly result: string;
}

export interface PathExplanation {
  readonly concept: string;
  readonly coordinateConvention: string;
  readonly steps: readonly PathExplanationStep[];
  readonly askedRelation: string;
  readonly conclusion: string;
  readonly closestTrapRejection: string;
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

function buildPath(seed: number): BuiltPath {
  for (let attempt = 0; attempt < 32; attempt += 1) {
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
    if (endpointDirection(solved.initial, solved.final) !== "SAME_POSITION") {
      return { person, initialFacing, operations, solved, legCount };
    }
  }
  throw new Error(`Unable to construct a non-degenerate DIR-CP-002 path for seed ${seed}`);
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

function pointLabel(moveIndex: number): string {
  if (moveIndex === 0) return "O";
  return String.fromCharCode(64 + moveIndex);
}

function normalizedCoordinate(value: number): number {
  const rounded = Math.round(value * 1e9) / 1e9;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function coordinateText(coordinate: Coordinate): string {
  return `(${normalizedCoordinate(coordinate.x)}, ${normalizedCoordinate(coordinate.y)})`;
}

function turnName(before: Direction, after: Direction, degrees: number): string {
  return `${PATH_DIRECTION_LABELS[before]} → ${degrees}° turn → ${PATH_DIRECTION_LABELS[after]}`;
}

function vectorInterpretation(vector: Coordinate): string {
  const xPart = vector.x > 0 ? "east" : vector.x < 0 ? "west" : "no east-west change";
  const yPart = vector.y > 0 ? "north" : vector.y < 0 ? "south" : "no north-south change";
  return `${xPart} and ${yPart}`;
}

function explanationFor(
  path: BuiltPath,
  endpoint: Direction,
  reverseQuery: boolean,
  includeFacing: boolean,
): PathExplanation {
  const steps: PathExplanationStep[] = [
    {
      stepNumber: 1,
      title: "Fix the origin and compass axes",
      statement: `Take point O as the origin. ${path.person} starts at O facing ${PATH_DIRECTION_LABELS[path.initialFacing]}.`,
      calculation: "O = (0, 0); East = +x; West = −x; North = +y; South = −y",
      result: `Initial position ${coordinateText(path.solved.initial.position)}; initial facing ${PATH_DIRECTION_LABELS[path.initialFacing]}.`,
    },
  ];

  let moveIndex = 0;
  for (const trace of path.solved.trace) {
    const beforePoint = pointLabel(moveIndex);
    if (trace.operation.kind === "TURN") {
      steps.push({
        stepNumber: steps.length + 1,
        title: `Turn at point ${beforePoint}`,
        statement: `The turn changes only the facing direction. ${path.person} remains at point ${beforePoint}.`,
        calculation: turnName(trace.before.facing, trace.after.facing, trace.operation.degrees),
        result: `Coordinate remains ${coordinateText(trace.after.position)}; new facing is ${PATH_DIRECTION_LABELS[trace.after.facing]}.`,
      });
      continue;
    }

    moveIndex += 1;
    const afterPoint = pointLabel(moveIndex);
    const dx = trace.after.position.x - trace.before.position.x;
    const dy = trace.after.position.y - trace.before.position.y;
    steps.push({
      stepNumber: steps.length + 1,
      title: `Move from ${beforePoint} to ${afterPoint}`,
      statement: `${path.person} moves ${trace.operation.distance} metres towards ${PATH_DIRECTION_LABELS[trace.movementDirection!]}, without turning during the movement.`,
      calculation: `${beforePoint} ${coordinateText(trace.before.position)} + (${normalizedCoordinate(dx)}, ${normalizedCoordinate(dy)}) = ${afterPoint} ${coordinateText(trace.after.position)}`,
      result: `Point ${afterPoint} is at ${coordinateText(trace.after.position)}; facing is ${PATH_DIRECTION_LABELS[trace.after.facing]}.`,
    });
  }

  const finalPointLabel = pointLabel(moveIndex);
  const finalPosition = path.solved.final.position;
  const relationVector = reverseQuery
    ? { x: -finalPosition.x, y: -finalPosition.y }
    : { x: finalPosition.x, y: finalPosition.y };
  const referenceLabel = reverseQuery ? finalPointLabel : "O";
  const subjectLabel = reverseQuery ? "O" : finalPointLabel;
  steps.push({
    stepNumber: steps.length + 1,
    title: "Use the reference point named in the question",
    statement: `The question asks for point ${subjectLabel} with respect to point ${referenceLabel}. Therefore subtract the reference coordinate from the subject coordinate.`,
    calculation: `${subjectLabel} − ${referenceLabel} = (${normalizedCoordinate(relationVector.x)}, ${normalizedCoordinate(relationVector.y)})`,
    result: `The vector points ${vectorInterpretation(relationVector)}, so the required direction is ${PATH_DIRECTION_LABELS[endpoint]}.`,
  });

  if (includeFacing) {
    steps.push({
      stepNumber: steps.length + 1,
      title: "Read the final facing separately",
      statement: `Position and facing are different facts. The last coordinate gives location; the final path state gives facing.`,
      calculation: `Final facing = ${PATH_DIRECTION_LABELS[path.solved.final.facing]}`,
      result: `${path.person} is facing ${PATH_DIRECTION_LABELS[path.solved.final.facing]} at point ${finalPointLabel}.`,
    });
  }

  const askedRelation = `Point ${subjectLabel} from point ${referenceLabel} = ${PATH_DIRECTION_LABELS[endpoint]}`;
  const conclusion = includeFacing
    ? `Therefore, point ${finalPointLabel} is ${PATH_DIRECTION_LABELS[endpoint]} of point O, and ${path.person} finally faces ${PATH_DIRECTION_LABELS[path.solved.final.facing]}.`
    : `Therefore, point ${subjectLabel} is ${PATH_DIRECTION_LABELS[endpoint]} of point ${referenceLabel}.`;
  const diagram = buildPathDiagram(path.solved, reverseQuery, endpoint, includeFacing);

  return {
    concept: "Track position and facing as separate states. Turns change facing without changing coordinates; movements change coordinates in the current facing direction.",
    coordinateConvention: "East = +x, West = −x, North = +y, South = −y.",
    steps,
    askedRelation,
    conclusion,
    closestTrapRejection: "The final movement direction, the final facing direction, and the direction of one point from another are not automatically the same. Use the exact reference point stated in the question.",
    diagram,
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
    || Math.abs(path.solved.final.position.x - independent.finalPosition.x) > 1e-9
    || Math.abs(path.solved.final.position.y - independent.finalPosition.y) > 1e-9
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
        labelledPoints: explanationFor(path, correct, reverseQuery, false).diagram.points,
        queryReference: reverseQuery ? "START_FROM_FINAL" : "FINAL_FROM_START",
      },
      options,
      correctIndex: validation.satisfyingOptionIndexes[0],
      correctAnswer: correct,
      explanation: explanationFor(path, correct, reverseQuery, false),
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
