import { endpointDirection } from "../foundation/answer-classifier";
import { classifyDirection, oppositeDirection, turnLeft, turnRight } from "../foundation/directions";
import { validateDirectionOptions } from "../foundation/option-validator";
import { createInitialPathState, solvePath } from "../foundation/path-state";
import type { Coordinate, Direction, DirectionOption, PathOperation, SolvedPath } from "../foundation/types";
import { solveOrderedPathIndependent } from "./independent-solver";
import { PATH_DIRECTION_LABELS, renderCombinedStem, renderEndpointStem, renderPathSequence } from "./question-language.en";
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

export interface PathExplanation {
  readonly concept: string;
  readonly steps: readonly { readonly statement: string; readonly result: string }[];
  readonly conclusion: string;
  readonly closestTrapRejection: string;
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
        const turn = pick(
          [
            { kind: "TURN", sense: "CLOCKWISE", degrees: 90 },
            { kind: "TURN", sense: "ANTICLOCKWISE", degrees: 90 },
            { kind: "TURN", sense: "CLOCKWISE", degrees: 180 },
          ] as const,
          random,
        );
        operations.push(turn);
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
  const random = seededRandom(seed * 43 + 29);
  return shuffle(
    [
      { value: correct, label: PATH_DIRECTION_LABELS[correct], errorLabel: null },
      ...uniqueDirectionDistractors(correct, vector).map((option) => ({
        ...option,
        label: PATH_DIRECTION_LABELS[option.value],
      })),
    ],
    random,
  );
}

function combinedLabel(answer: CombinedPathAnswer): string {
  return `${PATH_DIRECTION_LABELS[answer.endpointDirection]}; facing ${PATH_DIRECTION_LABELS[answer.finalFacing]}`;
}

function combinedOptions(correct: CombinedPathAnswer, seed: number): readonly RenderedPathOption<CombinedPathAnswer>[] {
  const wrongEndpoint = oppositeDirection(correct.endpointDirection);
  const wrongFacing = oppositeDirection(correct.finalFacing);
  const random = seededRandom(seed * 47 + 31);
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
    random,
  );
}

function normalizedCoordinate(value: number): number {
  const rounded = Math.round(value * 1e9) / 1e9;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function explanationFor(
  path: BuiltPath,
  endpoint: Direction,
  reverseQuery: boolean,
  includeFacing: boolean,
): PathExplanation {
  const steps = path.solved.trace.map((step) => {
    const position = `(${normalizedCoordinate(step.after.position.x)}, ${normalizedCoordinate(step.after.position.y)})`;
    if (step.operation.kind === "TURN") {
      return {
        statement: `Apply the next turn while remaining at ${position}.`,
        result: `Facing ${PATH_DIRECTION_LABELS[step.after.facing]}`,
      };
    }
    return {
      statement: `Move ${step.operation.distance} metres towards ${PATH_DIRECTION_LABELS[step.movementDirection!]}.`,
      result: `Position ${position}; facing ${PATH_DIRECTION_LABELS[step.after.facing]}`,
    };
  });
  const final = path.solved.final.position;
  const vectorText = reverseQuery
    ? `From the final position to the start, the net vector is (${normalizedCoordinate(-final.x)}, ${normalizedCoordinate(-final.y)}).`
    : `From the start to the final position, the net vector is (${normalizedCoordinate(final.x)}, ${normalizedCoordinate(final.y)}).`;
  const conclusion = includeFacing
    ? `${vectorText} Therefore, the endpoint is ${PATH_DIRECTION_LABELS[endpoint]} of the start and the final facing is ${PATH_DIRECTION_LABELS[path.solved.final.facing]}.`
    : `${vectorText} Therefore, the required direction is ${PATH_DIRECTION_LABELS[endpoint]}.`;
  return {
    concept: "Replay every movement and turn in order, then compare the required reference and subject coordinates.",
    steps,
    conclusion,
    closestTrapRejection: "Do not report the last movement direction or reverse the asked relationship unless the question asks from the endpoint back to the start.",
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
      stem: renderEndpointStem(path.person, path.initialFacing, path.operations, reverseQuery, seed),
      structuredPrompt: {
        person: path.person,
        initialFacing: path.initialFacing,
        operations: path.operations,
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
  return {
    qlId,
    checkpointId: "DIR-CP-002",
    ruleId: ql.ruleId,
    seed,
    difficulty: difficultyFor(ql.answerDemand, path.legCount),
    stem: renderCombinedStem(path.person, path.initialFacing, path.operations, seed),
    structuredPrompt: { person: path.person, initialFacing: path.initialFacing, operations: path.operations },
    options,
    correctIndex: validation.satisfyingOptionIndexes[0],
    correctAnswer: correct,
    explanation: explanationFor(path, generatedEndpoint, false, true),
    metadata: { answerDemand: ql.answerDemand, legCount: path.legCount, reverseQuery: false, solverVerified: true, solveMode: null },
  };
}
