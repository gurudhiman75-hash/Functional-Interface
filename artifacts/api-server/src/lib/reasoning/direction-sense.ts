import type {
  DifficultyLabel,
  DistractorMetadata,
  ExamProfileId,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  pickRandomItem,
  random,
  ReasoningStep,
  shuffle,
} from "../shared";
import {
  createSpatialReasoningScenario,
  renderPathSvg,
  VectorPathState,
} from "./spatial-reasoning";

type FacingDirection =
  | "North"
  | "East"
  | "South"
  | "West";

type TurnDirection =
  | "left"
  | "right"
  | "back";

type DirectionQuestionType =
  | "distance"
  | "facing"
  | "coordinates";

type DirectionMove = {
  turn?: TurnDirection;
  distance: number;
  note?: string;
};

type DirectionSenseScenario = {
  traveler: string;
  startFacing: FacingDirection;
  moves: DirectionMove[];
  questionType: DirectionQuestionType;
  finalFacing: FacingDirection;
  finalX: number;
  finalY: number;
  shortestDistance: number;
  correctAnswer: string;
  reasoningSteps: ReasoningStep[];
  stemOverride?: string;
  explanationOverride?: string;
  customOptions?: string[];
  customOptionMetadata?: OptionMetadata[];
  svg?: string;
};

const CARDINAL_DIRECTIONS: FacingDirection[] =
  [
    "North",
    "East",
    "South",
    "West",
  ];

const DIRECTION_TRAVELERS = [
  "Ravi",
  "Anita",
  "Karan",
  "Neha",
  "Amit",
  "Pooja",
  "Vikas",
  "Meera",
];

function turnFacing(
  facing: FacingDirection,
  turn: TurnDirection,
) {
  const facingIndex =
    CARDINAL_DIRECTIONS.indexOf(
      facing,
    );
  const offset =
    turn === "left"
      ? -1
      : turn === "right"
        ? 1
        : 2;

  return CARDINAL_DIRECTIONS[
    (facingIndex + offset + 4) % 4
  ]!;
}

function moveAlongFacing(
  x: number,
  y: number,
  facing: FacingDirection,
  distance: number,
) {
  switch (facing) {
    case "North":
      return { x, y: y + distance };
    case "South":
      return { x, y: y - distance };
    case "East":
      return { x: x + distance, y };
    case "West":
    default:
      return { x: x - distance, y };
  }
}

function facingToDegrees(
  facing: FacingDirection,
) {
  switch (facing) {
    case "North":
      return 90;
    case "East":
      return 0;
    case "South":
      return 270;
    case "West":
    default:
      return 180;
  }
}

function turnToDegrees(
  turn: TurnDirection,
) {
  return turn === "left"
    ? 90
    : turn === "right"
      ? -90
      : 180;
}

function pickDirectionDistance(
  difficulty: DifficultyLabel,
) {
  if (difficulty === "Easy") {
    return pickRandomItem([
      2, 3, 4, 5, 6, 8,
    ]);
  }

  if (difficulty === "Hard") {
    return pickRandomItem([
      4, 5, 6, 7, 8, 9, 10, 12,
    ]);
  }

  return pickRandomItem([
    3, 4, 5, 6, 7, 8, 9,
  ]);
}

function createDirectionMoveText(
  move: DirectionMove,
) {
  if (!move.turn) {
    return `walks ${move.distance} m straight`;
  }

  const turnText =
    move.turn === "back"
      ? "turns back and walks"
      : `turns ${move.turn} and walks`;

  return `${turnText} ${move.distance} m`;
}

function formatCoordinate(
  x: number,
  y: number,
) {
  return `(${x}, ${y})`;
}

function createDirectionMoves(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
) {
  const moveCount =
    motif.id ===
      "straight_path_distance"
      ? 1
      : motif.id ===
          "simple_turn_tracking"
        ? 2
        : motif.id ===
            "shortest_distance_inference"
          ? 3
          : motif.id ===
              "orientation_shift_chain"
            ? 4
            : difficulty === "Hard"
              ? 5
              : 4;
  const turnPool: TurnDirection[] =
    motif.id ===
      "straight_path_distance"
      ? []
      : motif.id ===
          "simple_turn_tracking"
        ? ["left", "right"]
        : motif.id ===
            "orientation_shift_chain"
          ? ["left", "right", "back"]
          : ["left", "right"];
  const moves: DirectionMove[] = [];

  for (
    let index = 0;
    index < moveCount;
    index++
  ) {
    const distance =
      pickDirectionDistance(
        difficulty,
      );

    if (!turnPool.length || index === 0) {
      moves.push({ distance });
      continue;
    }

    const turn =
      difficulty === "Hard" &&
      motif.id !==
        "conditional_movement_reasoning" &&
      motif.id !==
        "coordinate_inference_chain" &&
      index === moveCount - 1
        ? "back"
        : pickRandomItem(turnPool);

    moves.push({
      turn,
      distance,
      note:
        motif.id ===
          "conditional_movement_reasoning" &&
        index >= 2
          ? "Track the facing carefully after this turn."
          : undefined,
    });
  }

  return moves;
}

function buildDirectionReasoningTrail(
  traveler: string,
  startFacing: FacingDirection,
  moves: DirectionMove[],
) {
  let facing = startFacing;
  const vectorPath =
    new VectorPathState(
      { x: 0, y: 0 },
      facingToDegrees(
        startFacing,
      ),
    );
  const steps: ReasoningStep[] = [];

  moves.forEach((move, index) => {
    const startingFacing = facing;

    if (move.turn) {
      facing = turnFacing(
        facing,
        move.turn,
      );
      vectorPath.turn(
        turnToDegrees(
          move.turn,
        ),
      );
      steps.push(
        createReasoningStep(
          "transform",
          `${traveler} turns ${move.turn} from ${startingFacing} and now faces ${facing}.`,
        ),
      );
    }

    vectorPath.move(move.distance);
    const nextPosition =
      vectorPath.position;
    steps.push(
      createReasoningStep(
        index === 0
          ? "transform"
          : "infer",
        `${traveler} then moves ${move.distance} m towards ${facing}. Vector update: $P_{new}=P_{old}+[d\\cos\\theta,d\\sin\\theta]$, reaching ${formatCoordinate(
          nextPosition.x,
          nextPosition.y,
        )}.`,
      ),
    );
  });

  return {
    finalFacing: facing,
    finalX: vectorPath.position.x,
    finalY: vectorPath.position.y,
    reasoningSteps: steps,
    svg: renderPathSvg(
      vectorPath.snapshots,
    ),
  };
}

function getShortestDistance(
  x: number,
  y: number,
) {
  const squaredDistance =
    x * x + y * y;
  const distance = Math.sqrt(
    squaredDistance,
  );

  return Number.isInteger(distance)
    ? distance
    : Number(distance.toFixed(1));
}

function chooseDirectionQuestionType(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
): DirectionQuestionType {
  if (
    motif.id ===
    "straight_path_distance"
  ) {
    return "distance";
  }

  if (
    motif.id ===
    "simple_turn_tracking"
  ) {
    return difficulty === "Easy"
      ? "facing"
      : "distance";
  }

  if (
    motif.id ===
    "shortest_distance_inference"
  ) {
    return "distance";
  }

  if (
    motif.id ===
    "orientation_shift_chain"
  ) {
    return "facing";
  }

  if (
    motif.id ===
      "conditional_movement_reasoning" ||
    motif.id ===
      "coordinate_inference_chain"
  ) {
    return random() > 0.5
      ? "coordinates"
      : "distance";
  }

  return "distance";
}

export function createDirectionSenseScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
) {
  if (motif.id.startsWith("spa-")) {
    const spatialScenario =
      createSpatialReasoningScenario(
        motif,
        difficulty,
      );

    return {
      traveler: "Candidate",
      startFacing: "North",
      moves: [],
      questionType: "distance",
      finalFacing:
        (spatialScenario.finalFacing as FacingDirection | undefined) ??
        "North",
      finalX:
        spatialScenario.finalX ?? 0,
      finalY:
        spatialScenario.finalY ?? 0,
      shortestDistance:
        spatialScenario.shortestDistance ??
        0,
      correctAnswer:
        spatialScenario.correctAnswer,
      reasoningSteps:
        spatialScenario.reasoningSteps,
      stemOverride:
        spatialScenario.stem,
      explanationOverride:
        spatialScenario.explanation,
      customOptions:
        spatialScenario.options,
      customOptionMetadata:
        spatialScenario.optionMetadata,
      svg: spatialScenario.svg,
    } satisfies DirectionSenseScenario;
  }

  for (
    let attempt = 0;
    attempt < 20;
    attempt++
  ) {
    const traveler =
      pickRandomItem(
        DIRECTION_TRAVELERS,
      );
    const startFacing =
      pickRandomItem(
        CARDINAL_DIRECTIONS,
      );
    const moves =
      createDirectionMoves(
        motif,
        difficulty,
      );
    const trail =
      buildDirectionReasoningTrail(
        traveler,
        startFacing,
        moves,
      );
    const questionType =
      chooseDirectionQuestionType(
        motif,
        difficulty,
      );
    const shortestDistance =
      getShortestDistance(
        trail.finalX,
        trail.finalY,
      );

    if (
      questionType === "distance" &&
      motif.id ===
        "shortest_distance_inference" &&
      !Number.isInteger(
        shortestDistance,
      )
    ) {
      continue;
    }

    return {
      traveler,
      startFacing,
      moves,
      questionType,
      finalFacing: trail.finalFacing,
      finalX: trail.finalX,
      finalY: trail.finalY,
      shortestDistance,
      correctAnswer:
        questionType === "facing"
          ? trail.finalFacing
          : questionType ===
              "coordinates"
            ? formatCoordinate(
                trail.finalX,
                trail.finalY,
              )
            : String(shortestDistance),
      reasoningSteps:
        trail.reasoningSteps,
      svg: trail.svg,
    } satisfies DirectionSenseScenario;
  }

  const fallback =
    buildDirectionReasoningTrail(
      "Ravi",
      "North",
      [
        { distance: 4 },
        {
          turn: "right",
          distance: 3,
        },
      ],
    );

  return {
    traveler: "Ravi",
    startFacing: "North",
    moves: [
      { distance: 4 },
      { turn: "right", distance: 3 },
    ],
    questionType: "distance",
    finalFacing: fallback.finalFacing,
    finalX: fallback.finalX,
    finalY: fallback.finalY,
    shortestDistance: 5,
    correctAnswer: "5",
    reasoningSteps:
      fallback.reasoningSteps,
    svg: fallback.svg,
  } satisfies DirectionSenseScenario;
}

export function buildDirectionSenseStem(
  scenario: ReturnType<
    typeof createDirectionSenseScenario
  >,
  examProfile: ExamProfileId,
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy",
) {
  if (scenario.stemOverride) {
    return scenario.stemOverride;
  }

  const intro =
    wordingStyle === "concise"
      ? `${scenario.traveler} starts facing ${scenario.startFacing}.`
      : wordingStyle ===
          "inference-heavy"
        ? `Directions: ${scenario.traveler} starts from the origin facing ${scenario.startFacing}. Follow every turn and movement in order.`
        : `Directions: ${scenario.traveler} is at a point facing ${scenario.startFacing}.`;

  const movementText =
    scenario.moves
      .map((move, index) =>
        index === 0
          ? `${scenario.traveler} ${createDirectionMoveText(
              move,
            )}`
          : `then ${createDirectionMoveText(
              move,
            )}`,
      )
      .join(", ") + ".";
  const question =
    scenario.questionType ===
    "facing"
      ? `Which direction is ${scenario.traveler} facing at the end?`
      : scenario.questionType ===
          "coordinates"
        ? `What are the final coordinates of ${scenario.traveler} from the starting point, taking the start as ${formatCoordinate(
            0,
            0,
          )}?`
        : `What is the shortest distance of ${scenario.traveler} from the starting point?`;

  void examProfile;

  return `${intro} ${movementText} ${question}`;
}

export function buildDirectionSenseExplanation(
  scenario: ReturnType<
    typeof createDirectionSenseScenario
  >,
) {
  if (scenario.explanationOverride) {
    return `${scenario.explanationOverride}${scenario.svg ? `\n\nPath visual:\n${scenario.svg}` : ""}`;
  }

  const conclusion =
    scenario.questionType ===
    "facing"
      ? `${scenario.traveler} finally faces ${scenario.finalFacing}.`
      : scenario.questionType ===
          "coordinates"
        ? `${scenario.traveler} finally reaches ${formatCoordinate(
            scenario.finalX,
            scenario.finalY,
          )}.`
        : `The final position is ${formatCoordinate(
            scenario.finalX,
            scenario.finalY,
          )}, so the shortest distance from the starting point is ${scenario.shortestDistance} m.`;

  return `Track the path in order. ${scenario.reasoningSteps
    .map((step) => step.detail)
    .join(" ")} ${conclusion}${scenario.svg ? `\n\nPath visual:\n${scenario.svg}` : ""}`;
}

export function buildDirectionSenseOptions(
  scenario: ReturnType<
    typeof createDirectionSenseScenario
  >,
) {
  if (
    scenario.customOptions &&
    scenario.customOptionMetadata
  ) {
    return {
      options: scenario.customOptions,
      correct:
        scenario.customOptions.findIndex(
          (option) =>
            option ===
            scenario.correctAnswer,
        ),
      optionMetadata:
        scenario.customOptionMetadata,
    };
  }

  const options = new Map<
    string,
    OptionMetadata
  >();
  const correctValue =
    scenario.correctAnswer;

  options.set(correctValue, {
    value: correctValue,
    isCorrect: true,
  });

  const addOption = (
    value: string,
    metadata: DistractorMetadata,
  ) => {
    if (
      value !== correctValue &&
      !options.has(value)
    ) {
      options.set(value, {
        value,
        isCorrect: false,
        ...metadata,
      });
    }
  };

  if (
    scenario.questionType ===
    "facing"
  ) {
    addOption(
      turnFacing(
        scenario.finalFacing,
        "back",
      ),
      {
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Tracked the last movement but missed the final orientation change.",
        reasoningTrap:
          "Final-facing reversal trap.",
      },
    );
    addOption(
      turnFacing(
        scenario.finalFacing,
        "left",
      ),
      {
        distractorType:
          "comparisonTrap",
        likelyMistake:
          "Confused a right turn with a left turn during the chain.",
        reasoningTrap:
          "Left-right confusion trap.",
      },
    );
    addOption(
      scenario.startFacing,
      {
        distractorType:
          "cumulativeMistake",
        likelyMistake:
          "Ignored the cumulative effect of multiple turns.",
        reasoningTrap:
          "Starting-direction carryover trap.",
      },
    );
  } else if (
    scenario.questionType ===
    "coordinates"
  ) {
    addOption(
      formatCoordinate(
        scenario.finalY,
        scenario.finalX,
      ),
      {
        distractorType:
          "comparisonTrap",
        likelyMistake:
          "Swapped the east-west and north-south coordinates.",
        reasoningTrap:
          "Axis-swap trap.",
      },
    );
    addOption(
      formatCoordinate(
        -scenario.finalX,
        scenario.finalY,
      ),
      {
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Handled one horizontal turn in the opposite direction.",
        reasoningTrap:
          "Sign-direction trap.",
      },
    );
    addOption(
      formatCoordinate(
        scenario.finalX,
        -scenario.finalY,
      ),
      {
        distractorType:
          "cumulativeMistake",
        likelyMistake:
          "Reversed the vertical displacement after the last turn.",
        reasoningTrap:
          "North-south reversal trap.",
      },
    );
  } else {
    const totalPath = scenario.moves.reduce(
      (sum, move) =>
        sum + move.distance,
      0,
    );
    addOption(
      String(totalPath),
      {
        distractorType:
          "cumulativeMistake",
        likelyMistake:
          "Added the full path length instead of finding the shortest distance.",
        reasoningTrap:
          "Path-length trap.",
      },
    );
    addOption(
      String(
        Math.abs(scenario.finalX) +
          Math.abs(scenario.finalY),
      ),
      {
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Used horizontal and vertical displacements directly without forming the final distance.",
        reasoningTrap:
          "Coordinate-sum trap.",
      },
    );
    addOption(
      String(
        Math.max(
          Math.abs(scenario.finalX),
          Math.abs(scenario.finalY),
        ),
      ),
      {
        distractorType:
          "comparisonTrap",
        likelyMistake:
          "Picked the larger displacement component as the answer.",
        reasoningTrap:
          "Single-axis comparison trap.",
      },
    );
  }

  const shuffled = shuffle([
    ...options.values(),
  ].slice(0, 4));

  return {
    options: shuffled.map(
      (option) => option.value,
    ),
    correct: shuffled.findIndex(
      (option) => option.isCorrect,
    ),
    optionMetadata: shuffled,
  };
}
