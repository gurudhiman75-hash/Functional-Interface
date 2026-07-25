import { applyTurn, oppositeDirection, turnLeft, turnRight } from "../foundation/directions";
import { DIRECTIONS, type Direction, type DirectionOption, type TurnOperation } from "../foundation/types";
import { validateDirectionOptions } from "../foundation/option-validator";
import {
  DIRECTION_LABELS,
  RELATIVE_TURN_LABELS,
  renderForwardFacingStem,
  renderInverseFacingStem,
  renderMissingTurnStem,
} from "./question-language.en";
import {
  solveFinalFacingIndependent,
  solveInitialFacingIndependent,
  solveMissingRelativeTurnIndependent,
  type RelativeTurnAnswer,
} from "./independent-solver";
import { dirCp001Ql } from "./task-registry";

const PERSON_NAMES = ["Aman", "Beena", "Charan", "Deepa", "Farhan", "Gurpreet", "Harpreet", "Isha"] as const;
const TURN_DEGREES = [45, 90, 135, 180] as const;

export interface OrientationExplanationStep {
  readonly statement: string;
  readonly result: string;
}

export interface OrientationExplanation {
  readonly concept: string;
  readonly steps: readonly OrientationExplanationStep[];
  readonly conclusion: string;
  readonly closestTrapRejection: string;
}

export interface RenderedDirectionOption<T extends Direction | RelativeTurnAnswer> extends DirectionOption<T> {
  readonly label: string;
}

export interface GeneratedOrientationQuestion {
  readonly qlId: string;
  readonly checkpointId: "DIR-CP-001";
  readonly ruleId: string;
  readonly seed: number;
  readonly difficulty: "EASY" | "MEDIUM" | "HARD";
  readonly stem: string;
  readonly structuredPrompt: Readonly<Record<string, unknown>>;
  readonly options: readonly RenderedDirectionOption<Direction | RelativeTurnAnswer>[];
  readonly correctIndex: number;
  readonly correctAnswer: Direction | RelativeTurnAnswer;
  readonly explanation: OrientationExplanation;
  readonly metadata: {
    readonly answerDemand: string;
    readonly turnCount: number;
    readonly solverVerified: true;
    readonly solveMode: null;
  };
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

function buildTurns(seed: number): readonly TurnOperation[] {
  const random = seededRandom(seed * 31 + 7);
  const turnCount = 1 + Math.floor(random() * 4);
  return Array.from({ length: turnCount }, () => ({
    kind: "TURN" as const,
    sense: pick(["CLOCKWISE", "ANTICLOCKWISE"] as const, random),
    degrees: pick(TURN_DEGREES, random),
  }));
}

function applyTurns(initialFacing: Direction, turns: readonly TurnOperation[]): Direction {
  return turns.reduce((facing, turn) => applyTurn(facing, turn), initialFacing);
}

function directionOptions(correct: Direction, seed: number): readonly RenderedDirectionOption<Direction>[] {
  const random = seededRandom(seed * 43 + 13);
  const options: RenderedDirectionOption<Direction>[] = [
    { value: correct, label: DIRECTION_LABELS[correct], errorLabel: null },
    {
      value: oppositeDirection(correct),
      label: DIRECTION_LABELS[oppositeDirection(correct)],
      errorLabel: "OPPOSITE_DIRECTION",
    },
    {
      value: turnLeft(correct),
      label: DIRECTION_LABELS[turnLeft(correct)],
      errorLabel: "CLOCKWISE_ANTICLOCKWISE_REVERSED",
    },
    {
      value: turnRight(correct),
      label: DIRECTION_LABELS[turnRight(correct)],
      errorLabel: "ANGLE_MAGNITUDE_ERROR",
    },
  ];
  return shuffle(options, random);
}

function relativeTurnOperation(answer: RelativeTurnAnswer): TurnOperation {
  switch (answer) {
    case "LEFT_TURN":
      return { kind: "TURN", sense: "ANTICLOCKWISE", degrees: 90 };
    case "RIGHT_TURN":
      return { kind: "TURN", sense: "CLOCKWISE", degrees: 90 };
    case "ABOUT_TURN":
      return { kind: "TURN", sense: "CLOCKWISE", degrees: 180 };
    case "NO_TURN":
      return { kind: "TURN", sense: "CLOCKWISE", degrees: 0 };
  }
}

function turnOptions(correct: RelativeTurnAnswer, seed: number): readonly RenderedDirectionOption<RelativeTurnAnswer>[] {
  const errorLabels: Readonly<Record<RelativeTurnAnswer, string | null>> = {
    LEFT_TURN: correct === "LEFT_TURN" ? null : "LEFT_RIGHT_REVERSED",
    RIGHT_TURN: correct === "RIGHT_TURN" ? null : "LEFT_RIGHT_REVERSED",
    ABOUT_TURN: correct === "ABOUT_TURN" ? null : "ABOUT_TURN_AS_RIGHT_ANGLE",
    NO_TURN: correct === "NO_TURN" ? null : "INITIAL_FACING_IGNORED",
  };
  const random = seededRandom(seed * 47 + 17);
  return shuffle(
    (Object.keys(RELATIVE_TURN_LABELS) as RelativeTurnAnswer[]).map((value) => ({
      value,
      label: RELATIVE_TURN_LABELS[value],
      errorLabel: errorLabels[value],
    })),
    random,
  );
}

function directionExplanation(
  concept: string,
  initialFacing: Direction,
  turns: readonly TurnOperation[],
  conclusion: string,
): OrientationExplanation {
  let facing = initialFacing;
  const steps = turns.map((turn) => {
    const before = facing;
    facing = applyTurn(facing, turn);
    return {
      statement: `${DIRECTION_LABELS[before]} → ${turn.degrees}° ${turn.sense === "CLOCKWISE" ? "clockwise" : "anticlockwise"}`,
      result: DIRECTION_LABELS[facing],
    };
  });
  return {
    concept,
    steps,
    conclusion,
    closestTrapRejection: "Keep the current facing after every turn; do not repeatedly apply each turn to the original direction.",
  };
}

function difficultyFor(answerDemand: string, turnCount: number): "EASY" | "MEDIUM" | "HARD" {
  if (answerDemand === "MISSING_TURN") return "MEDIUM";
  if (turnCount <= 1) return "EASY";
  if (turnCount <= 3) return "MEDIUM";
  return "HARD";
}

export function generateDirCp001Question(qlId: string, seed = 0): GeneratedOrientationQuestion {
  if (!Number.isInteger(seed)) {
    throw new Error(`DIR-CP-001 seed must be an integer, received ${seed}`);
  }
  const ql = dirCp001Ql(qlId);
  const random = seededRandom(seed * 29 + 5);
  const person = pick(PERSON_NAMES, random);
  const initialFacing = pick(DIRECTIONS, random);

  if (ql.answerDemand === "FINAL_FACING") {
    const turns = buildTurns(seed * 53 + 19);
    const generatedAnswer = applyTurns(initialFacing, turns);
    const independentAnswer = solveFinalFacingIndependent(initialFacing, turns);
    if (generatedAnswer !== independentAnswer) {
      throw new Error(`Independent solver disagreed for ${qlId} seed ${seed}`);
    }
    const options = directionOptions(generatedAnswer, seed * 3 + 1);
    const validation = validateDirectionOptions(options, (value) => value === generatedAnswer);
    if (!validation.valid) throw new Error(validation.errors.join("; "));
    const correctIndex = validation.satisfyingOptionIndexes[0];
    return {
      qlId,
      checkpointId: "DIR-CP-001",
      ruleId: ql.ruleId,
      seed,
      difficulty: difficultyFor(ql.answerDemand, turns.length),
      stem: renderForwardFacingStem(person, initialFacing, turns, seed),
      structuredPrompt: { person, initialFacing, turns },
      options,
      correctIndex,
      correctAnswer: generatedAnswer,
      explanation: directionExplanation(
        "Update the facing direction after each turn in the stated order.",
        initialFacing,
        turns,
        `Therefore, ${person} finally faces ${DIRECTION_LABELS[generatedAnswer]}.`,
      ),
      metadata: { answerDemand: ql.answerDemand, turnCount: turns.length, solverVerified: true, solveMode: null },
    };
  }

  if (ql.answerDemand === "INITIAL_FACING") {
    const turns = buildTurns(seed * 59 + 23);
    const finalFacing = applyTurns(initialFacing, turns);
    const independentAnswer = solveInitialFacingIndependent(finalFacing, turns);
    if (independentAnswer !== initialFacing) {
      throw new Error(`Independent inverse solver disagreed for ${qlId} seed ${seed}`);
    }
    const options = directionOptions(initialFacing, seed * 3 + 2);
    const validation = validateDirectionOptions(options, (value) => value === initialFacing);
    if (!validation.valid) throw new Error(validation.errors.join("; "));
    const correctIndex = validation.satisfyingOptionIndexes[0];
    return {
      qlId,
      checkpointId: "DIR-CP-001",
      ruleId: ql.ruleId,
      seed,
      difficulty: difficultyFor(ql.answerDemand, turns.length),
      stem: renderInverseFacingStem(person, finalFacing, turns, seed),
      structuredPrompt: { person, finalFacing, turns },
      options,
      correctIndex,
      correctAnswer: initialFacing,
      explanation: {
        ...directionExplanation(
          "Undo the complete turn sequence from the known final direction.",
          initialFacing,
          turns,
          `The reconstructed initial direction is ${DIRECTION_LABELS[initialFacing]}.`,
        ),
        closestTrapRejection: "The turns must be reversed as a complete rotation effect; starting from the final direction and repeating them forward gives the wrong result.",
      },
      metadata: { answerDemand: ql.answerDemand, turnCount: turns.length, solverVerified: true, solveMode: null },
    };
  }

  const correctTurn = pick(["LEFT_TURN", "RIGHT_TURN", "ABOUT_TURN"] as const, random);
  const finalFacing = applyTurn(initialFacing, relativeTurnOperation(correctTurn));
  const independentAnswer = solveMissingRelativeTurnIndependent(initialFacing, finalFacing);
  if (independentAnswer !== correctTurn) {
    throw new Error(`Independent turn reconstruction disagreed for ${qlId} seed ${seed}`);
  }
  const options = turnOptions(correctTurn, seed * 3 + 3);
  const validation = validateDirectionOptions(options, (value) => value === correctTurn);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const correctIndex = validation.satisfyingOptionIndexes[0];
  return {
    qlId,
    checkpointId: "DIR-CP-001",
    ruleId: ql.ruleId,
    seed,
    difficulty: difficultyFor(ql.answerDemand, 1),
    stem: renderMissingTurnStem(person, initialFacing, finalFacing, seed),
    structuredPrompt: { person, initialFacing, finalFacing },
    options,
    correctIndex,
    correctAnswer: correctTurn,
    explanation: {
      concept: "Compare the initial and final directions and identify the unique governed relative turn.",
      steps: [
        {
          statement: `${DIRECTION_LABELS[initialFacing]} → ${RELATIVE_TURN_LABELS[correctTurn]}`,
          result: DIRECTION_LABELS[finalFacing],
        },
      ],
      conclusion: `${RELATIVE_TURN_LABELS[correctTurn]} changes ${DIRECTION_LABELS[initialFacing]} to ${DIRECTION_LABELS[finalFacing]}.`,
      closestTrapRejection: "A left turn and a right turn move in opposite directions around the compass; an about-turn changes the facing by 180°.",
    },
    metadata: { answerDemand: ql.answerDemand, turnCount: 1, solverVerified: true, solveMode: null },
  };
}
