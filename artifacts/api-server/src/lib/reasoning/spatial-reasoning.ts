import type {
  DifficultyLabel,
  OptionMetadata,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  createReasoningStep,
  ReasoningStep,
  shuffle,
} from "../shared";

export type SpatialAxis = "x" | "y";

export type SpatialPoint = {
  x: number;
  y: number;
};

export type DiceFace =
  | "Top"
  | "Bottom"
  | "Front"
  | "Back"
  | "Left"
  | "Right";

export type DiceConfiguration = [
  top: number,
  bottom: number,
  front: number,
  back: number,
  left: number,
  right: number,
];

export type SpatialScenario = {
  kind:
    | "vector-path"
    | "shadow"
    | "dice"
    | "cube-painting"
    | "reflection"
    | "paper-fold";
  stem: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  reasoningSteps: ReasoningStep[];
  svg?: string;
  finalX?: number;
  finalY?: number;
  finalFacing?: string;
  shortestDistance?: number;
  optionMetadata?: OptionMetadata[];
};

export class VectorPathState {
  position: SpatialPoint;
  thetaDegrees: number;
  readonly snapshots: Array<{
    from: SpatialPoint;
    to: SpatialPoint;
    distance: number;
    thetaDegrees: number;
  }> = [];

  constructor(
    start: SpatialPoint = { x: 0, y: 0 },
    thetaDegrees = 90,
  ) {
    this.position = { ...start };
    this.thetaDegrees = thetaDegrees;
  }

  turn(degrees: number) {
    this.thetaDegrees =
      (this.thetaDegrees + degrees + 360) %
      360;
  }

  move(distance: number) {
    const radians =
      (this.thetaDegrees * Math.PI) / 180;
    const next = {
      x: normalizeCoordinate(
        this.position.x +
          distance * Math.cos(radians),
      ),
      y: normalizeCoordinate(
        this.position.y +
          distance * Math.sin(radians),
      ),
    };

    this.snapshots.push({
      from: { ...this.position },
      to: { ...next },
      distance,
      thetaDegrees: this.thetaDegrees,
    });
    this.position = next;
  }

  shortestDistance() {
    return normalizeDistance(
      Math.sqrt(
        this.position.x ** 2 +
          this.position.y ** 2,
      ),
    );
  }

  validateClosure(
    expectedClosed = false,
  ) {
    const closed =
      this.position.x === 0 &&
      this.position.y === 0;

    return {
      valid:
        !expectedClosed || closed,
      reason:
        expectedClosed && !closed
          ? "Path claims to return to start but final vector is non-zero."
          : undefined,
    };
  }
}

function normalizeCoordinate(
  value: number,
) {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) < 1e-9
    ? rounded
    : Number(value.toFixed(2));
}

function normalizeDistance(
  value: number,
) {
  const rounded = Math.round(value);
  return Math.abs(value - rounded) < 1e-9
    ? rounded
    : Number(value.toFixed(2));
}

export function flipShape<
  T extends SpatialPoint,
>(
  points: T[],
  axis: SpatialAxis,
) {
  return points.map((point) => ({
    ...point,
    x:
      axis === "x"
        ? -point.x
        : point.x,
    y:
      axis === "y"
        ? -point.y
        : point.y,
  }));
}

export function mirrorText(
  value: string,
) {
  return value
    .split("")
    .reverse()
    .join("");
}

export function waterImageText(
  value: string,
) {
  return value
    .split("")
    .map((char) =>
      char === "6"
        ? "9"
        : char === "9"
          ? "6"
          : char,
    )
    .join("");
}

export function getOppositeFace(
  dice: DiceConfiguration,
  face: number,
) {
  const pairs: Array<[number, number]> = [
    [dice[0], dice[1]],
    [dice[2], dice[3]],
    [dice[4], dice[5]],
  ];
  const pair = pairs.find(
    ([left, right]) =>
      left === face || right === face,
  );

  if (!pair) {
    return undefined;
  }

  return pair[0] === face
    ? pair[1]
    : pair[0];
}

export function validateStandardDice(
  dice: DiceConfiguration,
) {
  const faces = new Set(dice);
  const uniqueFaces =
    faces.size === 6 &&
    [...faces].every(
      (face) => face >= 1 && face <= 6,
    );
  const oppositeSums =
    dice[0] + dice[1] === 7 &&
    dice[2] + dice[3] === 7 &&
    dice[4] + dice[5] === 7;

  return {
    valid:
      uniqueFaces && oppositeSums,
    reason:
      uniqueFaces && oppositeSums
        ? undefined
        : "Standard dice must use faces 1-6 and opposite faces must sum to 7.",
  };
}

export function renderPathSvg(
  snapshots: VectorPathState["snapshots"],
) {
  const points = snapshots.flatMap(
    (snapshot, index) =>
      index === 0
        ? [snapshot.from, snapshot.to]
        : [snapshot.to],
  );
  const scale = 12;
  const toSvgPoint = (
    point: SpatialPoint,
  ) =>
    `${100 + point.x * scale},${100 - point.y * scale}`;

  const polyline = points
    .map(toSvgPoint)
    .join(" ");

  return `<svg viewBox="0 0 200 200" role="img" aria-label="Direction path"><line x1="100" y1="0" x2="100" y2="200" stroke="#ddd"/><line x1="0" y1="100" x2="200" y2="100" stroke="#ddd"/><polyline points="${polyline}" fill="none" stroke="#2563eb" stroke-width="4"/><circle cx="100" cy="100" r="4" fill="#111827"/></svg>`;
}

function buildOptionBundle(
  correct: string,
  distractors: string[],
) {
  const metadata: OptionMetadata[] = [
    {
      value: correct,
      isCorrect: true,
    },
  ];

  for (const distractor of distractors) {
    if (
      distractor !== correct &&
      !metadata.some(
        (entry) =>
          entry.value === distractor,
      )
    ) {
      metadata.push({
        value: distractor,
        isCorrect: false,
        distractorType:
          "wrongIntermediateValue",
        likelyMistake:
          "Applied a common spatial shortcut incorrectly.",
        reasoningTrap:
          "Spatial visualization trap.",
      });
    }
  }

  let filler = 1;
  while (metadata.length < 4) {
    metadata.push({
      value: `${correct}${filler}`,
      isCorrect: false,
      distractorType:
        "arithmeticSlip",
      likelyMistake:
        "Made a small spatial calculation slip.",
      reasoningTrap:
        "Plausible nearby option.",
    });
    filler += 1;
  }

  const shuffled = shuffle(
    metadata.slice(0, 4),
  );

  return {
    options: shuffled.map(
      (entry) => entry.value,
    ),
    optionMetadata: shuffled,
  };
}

function createDegreePathScenario() {
  const path = new VectorPathState(
    { x: 0, y: 0 },
    90,
  );
  path.move(10);
  path.turn(-135);
  path.move(10);

  const answer =
    path.thetaDegrees === 315
      ? "North-West"
      : "South-East";
  const bundle = buildOptionBundle(
    answer,
    [
      "North-East",
      "South-West",
      "East",
    ],
  );

  return {
    kind: "vector-path" as const,
    stem:
      "A person starts facing North, walks $10$ m, turns $135^\\circ$ clockwise and walks another $10$ m. In which direction is the person now facing?",
    correctAnswer: answer,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "Clockwise turn means subtract the angle from the current facing. From North, $135^\\circ$ clockwise points to South-East.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Treat facing as an angle on the coordinate plane.",
      ),
      createReasoningStep(
        "infer",
        "Apply the clockwise turn and map the final angle to direction.",
      ),
    ],
    svg: renderPathSvg(path.snapshots),
    finalX: path.position.x,
    finalY: path.position.y,
    finalFacing: answer,
    shortestDistance:
      path.shortestDistance(),
  } satisfies SpatialScenario;
}

function createShadowScenario() {
  const answer = "West";
  const bundle = buildOptionBundle(
    answer,
    [
      "East",
      "North",
      "South",
    ],
  );

  return {
    kind: "shadow" as const,
    stem:
      "In the morning, the sun is in the East. If Ravi's shadow falls directly behind him, which direction is the shadow pointing?",
    correctAnswer: answer,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "At sunrise, the sun is in the East, so the shadow forms in the opposite direction, West.",
    reasoningSteps: [
      createReasoningStep(
        "compare",
        "Use the opposite direction of sunlight to locate the shadow.",
      ),
    ],
  } satisfies SpatialScenario;
}

function createDiceScenario() {
  const dice: DiceConfiguration = [
    1, 6, 2, 5, 3, 4,
  ];
  const validation =
    validateStandardDice(dice);

  if (!validation.valid) {
    throw new Error(
      validation.reason,
    );
  }

  const answer = String(
    getOppositeFace(dice, 2),
  );
  const bundle = buildOptionBundle(
    answer,
    ["1", "3", "4"],
  );

  return {
    kind: "dice" as const,
    stem:
      "A standard dice has opposite faces summing to $7$. If the face numbered $2$ is visible on the front, which number is on the opposite face?",
    correctAnswer: answer,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "For a standard dice, opposite faces sum to $7$. Therefore, the face opposite $2$ is $7-2=5$.",
    reasoningSteps: [
      createReasoningStep(
        "infer",
        "Use the standard dice opposite-face rule.",
      ),
    ],
  } satisfies SpatialScenario;
}

function createCubePaintingScenario() {
  const n = 4;
  const answer = String(
    12 * (n - 2),
  );
  const bundle = buildOptionBundle(
    answer,
    [
      String((n - 2) ** 3),
      String(8),
      String(6 * (n - 2) ** 2),
    ],
  );

  return {
    kind: "cube-painting" as const,
    stem:
      "A cube of side $4$ is painted on all faces and cut into $4 \\times 4 \\times 4$ equal small cubes. How many small cubes have exactly $2$ faces painted?",
    correctAnswer: answer,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "Exactly $2$ painted faces occur on edge cubes excluding corners. Count $=12(n-2)=12(4-2)=24$.",
    reasoningSteps: [
      createReasoningStep(
        "aggregate",
        "Count edge cubes after removing the two corner cubes on each edge.",
      ),
    ],
  } satisfies SpatialScenario;
}

function createReflectionScenario(
  water = false,
) {
  const source = water ? "MIX69" : "BRAIN";
  const answer = water
    ? waterImageText(source)
    : mirrorText(source);
  const bundle = buildOptionBundle(
    answer,
    water
      ? [
          mirrorText(source),
          source,
          mirrorText(answer),
        ]
      : [
          source,
          waterImageText(source),
          "NIARB",
        ],
  );

  return {
    kind: "reflection" as const,
    stem: water
      ? `Find the water image of $${source}$.`
      : `Find the mirror image of $${source}$.`,
    correctAnswer: answer,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation: water
      ? "Water image is a horizontal reflection, so top-bottom features change while left-right order is preserved."
      : "Mirror image is a vertical reflection, so the left-right order is reversed.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        water
          ? "Apply a horizontal reflection."
          : "Apply a vertical reflection.",
      ),
    ],
  } satisfies SpatialScenario;
}

function createPaperFoldScenario() {
  const answer =
    "four symmetric holes";
  const bundle = buildOptionBundle(
    answer,
    [
      "one central hole",
      "two vertical holes",
      "three diagonal holes",
    ],
  );

  return {
    kind: "paper-fold" as const,
    stem:
      "A square paper is folded once vertically and once horizontally. A hole is punched near the folded corner. After unfolding, how many holes appear?",
    correctAnswer: answer,
    options: bundle.options,
    optionMetadata:
      bundle.optionMetadata,
    explanation:
      "Each fold reflects the punched hole once. Two perpendicular folds create $2^2=4$ symmetric holes.",
    reasoningSteps: [
      createReasoningStep(
        "transform",
        "Apply one reflection for each fold.",
      ),
    ],
  } satisfies SpatialScenario;
}

export function createSpatialReasoningScenario(
  motif: QuantMotif,
  _difficulty: DifficultyLabel,
) {
  switch (motif.id) {
    case "spa-dir-shadow":
      return createShadowScenario();
    case "spa-dir-degrees":
      return createDegreePathScenario();
    case "spa-dice-logic":
    case "spa-cube-folding":
      return createDiceScenario();
    case "spa-cube-painting":
      return createCubePaintingScenario();
    case "spa-img-mirror":
      return createReflectionScenario(false);
    case "spa-img-water":
      return createReflectionScenario(true);
    case "spa-paper-fold":
      return createPaperFoldScenario();
    default:
      return createDegreePathScenario();
  }
}
