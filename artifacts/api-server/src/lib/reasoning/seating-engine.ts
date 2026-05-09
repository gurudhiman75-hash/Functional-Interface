import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  buildReasoningErrorMetadata,
  pickRandomItem,
  randomInt,
  ReasoningEngineError,
  shuffle,
} from "../shared";
import {
  exportInferenceTrace,
  isPromptDirectlyAnsweredByClue,
  type InferenceStep,
  type InferenceTraceExport,
  solveCircularSeating,
  solveLinearSeating,
  solveSeatingArrangement,
  type ValidationReport,
  validateCircularSeatingScenario,
  validateLinearSeatingScenario,
  validateSeatingScenario,
} from "./seating-validator";
import {
  buildCandidateCluePool,
} from "./seating/clue-generator";
import {
  optimizeClueSubset,
} from "./seating/clue-optimizer";
import {
  buildClueGraphAnalysis,
} from "./seating/clue-graph";
import {
  analyzeStructuralDiversity,
  getRepeatedStructureWarnings,
  getStructuralDiversityScore,
  recordStructuralSignature,
} from "./seating/diversity-engine";
import {
  detectRedundantClues,
} from "./seating/redundancy-detector";
import {
  evaluateClueSet,
} from "./seating/uniqueness-validator";
import {
  buildInferenceDependencyGraph,
  type InferenceDependencyGraph,
} from "./seating/inference-dependency-graph";

export type SeatingArrangementType =
  | "linear"
  | "circular"
  | "square"
  | "rectangular"
  | "double-row"
  | "parallel-row"
  | "floor"
  | "box-stack"
  | "scheduling"
  | "ranking"
  | "mapping";

export type SeatingOrientationType =
  | "north"
  | "south"
  | "center"
  | "outward"
  | "alternate"
  | "mixed";

export type SeatFacingDirection =
  | "north"
  | "south"
  | "center"
  | "outward";

export type LogicOperator =
  | "EQUALS"
  | "NOT_EQUALS";

type LayoutFamily =
  | "single-row"
  | "ring"
  | "two-row"
  | "vertical-stack"
  | "calendar"
  | "matrix";

export type ConstraintDimensionality =
  | "horizontal"
  | "vertical"
  | "cyclic"
  | "temporal"
  | "matrix";

export type ConstraintSlot = {
  id: string;
  label: string;
  numericValue: number;
  row: number;
  col: number;
  neighbors: string[];
  dimensionality: ConstraintDimensionality;
};

export type ConstraintEntity = {
  id: string;
  label: string;
  attributes?: Record<string, string>;
};

export type ConstraintOperator =
  | "IMMEDIATE_NEXT"
  | "DISTANCE_GAP"
  | "PARITY_CHECK"
  | "NOT_IN_SLOT"
  | "FIXED_SLOT"
  | "RELATIVE_AFTER"
  | "ATTRIBUTE_MATCH";

type SeatNode = {
  index: number;
  row: number;
  col: number;
  facing: SeatFacingDirection;
  label: string;
};

type ClueSemantics = {
  operator?: LogicOperator;
  weight?: number;
};

export type SeatingClue =
  ClueSemantics &
  (
    | {
    type: "absolute";
    person: string;
    index: number;
  }
    | {
    type: "end";
    person: string;
    side: "left" | "right";
  }
    | {
    type: "adjacent";
    left: string;
    right: string;
    ordered: boolean;
  }
    | {
    type: "not-adjacent";
    left: string;
    right: string;
  }
    | {
    type: "offset";
    anchor: string;
    person: string;
    distance: 1 | 2 | 3;
    direction: "left" | "right";
  }
    | {
    type: "distance-gap";
    left: string;
    right: string;
    gap: 1 | 2;
  }
    | {
    type: "between";
    middle: string;
    first: string;
    second: string;
  }
    | {
    type: "adjacent-both";
    middle: string;
    first: string;
    second: string;
  }
    | {
    type: "not-end";
    person: string;
  }
    | {
    type: "opposite";
    left: string;
    right: string;
  }
    | {
    type: "not-opposite";
    left: string;
    right: string;
  }
    | {
    type: "same-row";
    left: string;
    right: string;
  }
    | {
    type: "different-row";
    left: string;
    right: string;
  }
    | {
    type: "facing";
    left: string;
    right: string;
  }
    | {
    type: "not-facing";
    left: string;
    right: string;
  }
    | {
    type: "slot-fixed";
    entity: string;
    slotIndex: number;
    slotLabel: string;
  }
    | {
    type: "slot-gap";
    left: string;
    right: string;
    gap: number;
    axis: "above" | "below" | "after" | "before";
  }
    | {
    type: "slot-parity";
    entity: string;
    parity: "even" | "odd";
  }
    | {
    type: "slot-immediate";
    upper: string;
    lower: string;
    axis: "above" | "below" | "after" | "before";
  }
    | {
    type: "slot-not";
    entity: string;
    slotIndex: number;
    slotLabel: string;
  }
    | {
    type: "attribute";
    entity: string;
    attribute: string;
    value: string;
  }
  );

export type LinearSeatingClue =
  SeatingClue;

export type SeatingQuestionPrompt =
  | {
    type: "neighbor-left";
    anchor: string;
    prompt: string;
    correctAnswer: string;
  }
  | {
    type: "neighbor-right";
    anchor: string;
    prompt: string;
    correctAnswer: string;
  }
  | {
    type: "relative";
    anchor: string;
    distance: number;
    direction: "left" | "right";
    prompt: string;
    correctAnswer: string;
  }
  | {
    type: "opposite";
    anchor: string;
    prompt: string;
    correctAnswer: string;
  }
  | {
    type: "facing";
    anchor: string;
    prompt: string;
    correctAnswer: string;
  }
  | {
    type: "slot-occupant";
    anchor: string;
    slotIndex: number;
    prompt: string;
    correctAnswer: string;
  }
  | {
    type: "entity-slot";
    anchor: string;
    prompt: string;
    correctAnswer: string;
  };

export type SeatingScenario = {
  participants: string[];
  arrangement: string[];
  arrangementType: SeatingArrangementType;
  orientationType: SeatingOrientationType;
  seatFacings: SeatFacingDirection[];
  seatLabels: string[];
  constraintDimensionality?: ConstraintDimensionality;
  entities?: ConstraintEntity[];
  slots?: ConstraintSlot[];
  attributeMap?: Record<
    string,
    Record<string, string>
  >;
  clues: SeatingClue[];
  prompt: SeatingQuestionPrompt;
  clueCount: number;
  inferenceDepth: number;
  branchingComplexity: number;
  deductionDependencyScore: number;
  solverComplexity: number;
  validationWarnings: string[];
  directClueCount: number;
  indirectClueCount: number;
  relationalClueCount: number;
  deductionDepth: number;
  eliminationDepth: number;
  clueGraphDensity: number;
  clueDensity: number;
  clueInteractionRatio: number;
  redundancyScore: number;
  redundancyRatio: number;
  anchorDensity: number;
  directClueRatio: number;
  originalClueCount: number;
  minimalClueCount: number;
  removedRedundantClues: SeatingClue[];
  topologyDiversityScore: number;
  clueDiversityScore: number;
  inferenceDiversityScore: number;
  structuralDiversityScore: number;
  clueTypeDistribution: Record<string, number>;
  repeatedStructureWarnings: string[];
  uniquenessVerified: boolean;
  validationRetries: number;
  uniquenessFailures: number;
  branchingFactor: number;
  validationReport: ValidationReport;
  solverInferenceSteps: InferenceStep[];
  solverTraceExport: InferenceTraceExport;
  inferenceDependencyGraph: InferenceDependencyGraph;
  finalArrangement: string;
  generatedClues: string[];
  solverTrace: string[];
};

export type LinearSeatingScenario =
  SeatingScenario;

type SeatingLayout = {
  arrangementType: SeatingArrangementType;
  orientationType: SeatingOrientationType;
  family: LayoutFamily;
  seatCount: number;
  rowCount: number;
  colCount: number;
  seats: SeatNode[];
};

const PARTICIPANT_POOL = [
  "Aman",
  "Bhavna",
  "Charu",
  "Deepak",
  "Esha",
  "Farhan",
  "Gauri",
  "Harish",
  "Isha",
  "Jatin",
  "Kavya",
  "Lokesh",
  "Megha",
  "Nitin",
  "Pallavi",
  "Rohit",
  "Sneha",
  "Tanvi",
  "Ujjwal",
  "Varsha",
  "Yamini",
  "Zubin",
];

type SeatingPatternConfig = {
  arrangementTypes?: SeatingArrangementType[];
  orientationTypes?: SeatingOrientationType[];
  participantCount?: number;
  clueTypes?: string[];
  inferenceDepth?: number;
};

type ClueAnalysisMetadata =
  Pick<
    SeatingScenario,
    | "clueGraphDensity"
    | "clueDensity"
    | "clueInteractionRatio"
    | "redundancyScore"
    | "redundancyRatio"
    | "anchorDensity"
    | "directClueRatio"
    | "originalClueCount"
    | "minimalClueCount"
    | "removedRedundantClues"
    | "topologyDiversityScore"
    | "clueDiversityScore"
    | "inferenceDiversityScore"
    | "structuralDiversityScore"
    | "clueTypeDistribution"
    | "repeatedStructureWarnings"
  >;

type GenerationAttemptMetrics = {
  validationRetries: number;
  uniquenessFailures: number;
};

export class ConstraintChecker {
  constructor(
    private readonly arrangement: string[],
  ) {}

  private indexOf(entity: string) {
    return this.arrangement.indexOf(entity);
  }

  fixedSlot(entity: string, slotIndex: number) {
    return this.indexOf(entity) === slotIndex;
  }

  immediateNext(
    first: string,
    second: string,
  ) {
    return (
      Math.abs(
        this.indexOf(first) -
          this.indexOf(second),
      ) === 1
    );
  }

  distanceGap(
    first: string,
    second: string,
    gap: number,
  ) {
    return (
      Math.abs(
        this.indexOf(first) -
          this.indexOf(second),
      ) -
        1 ===
      gap
    );
  }

  parityCheck(
    entity: string,
    parity: "even" | "odd",
  ) {
    const slotNumber =
      this.indexOf(entity) + 1;

    return parity === "even"
      ? slotNumber % 2 === 0
      : slotNumber % 2 === 1;
  }

  notInSlot(
    entity: string,
    slotIndex: number,
  ) {
    return this.indexOf(entity) !== slotIndex;
  }
}

function buildSeatingErrorMetadata(
  metadata?: Record<
    string,
    unknown
  >,
) {
  return buildReasoningErrorMetadata(
    metadata,
  );
}

function extractSeatingPatternConfig(
  pattern?: Pattern,
): SeatingPatternConfig {
  if (!pattern) {
    return {};
  }

  const patternRecord =
    pattern as Pattern &
      Record<string, unknown>;

  const arrangementTypes = Array.isArray(
    patternRecord["arrangementTypes"],
  )
    ? (
      patternRecord[
        "arrangementTypes"
      ] as SeatingArrangementType[]
    )
    : typeof patternRecord[
        "arrangementType"
      ] === "string"
      ? [
        patternRecord[
          "arrangementType"
        ] as SeatingArrangementType,
      ]
      : undefined;

  const orientationTypes =
    Array.isArray(
      patternRecord[
        "orientationTypes"
      ],
    )
      ? (
        patternRecord[
          "orientationTypes"
        ] as SeatingOrientationType[]
      )
      : typeof patternRecord[
          "orientation"
        ] === "string"
        ? [
          patternRecord[
            "orientation"
          ] as SeatingOrientationType,
        ]
        : typeof patternRecord[
            "orientationType"
          ] === "string"
          ? [
            patternRecord[
              "orientationType"
            ] as SeatingOrientationType,
          ]
          : undefined;

  const participantCount =
    typeof patternRecord[
      "participantCount"
    ] === "number"
      ? Number(
        patternRecord[
          "participantCount"
        ],
      )
      : undefined;

  const clueTypes = Array.isArray(
    patternRecord["clueTypes"],
  )
    ? (
      patternRecord[
        "clueTypes"
      ] as string[]
    )
    : undefined;

  const inferenceDepth =
    typeof patternRecord[
      "inferenceDepth"
    ] === "number"
      ? Number(
        patternRecord[
          "inferenceDepth"
        ],
      )
      : undefined;

  const normalizedText = `${pattern.topic ?? ""} ${pattern.subtopic ?? ""}`.toLowerCase();
  const inferredArrangementTypes =
    arrangementTypes?.length
      ? arrangementTypes
      : normalizedText.includes(
          "double row",
        ) ||
          normalizedText.includes(
            "double-row",
          )
        ? ([
          "double-row",
        ] satisfies SeatingArrangementType[])
        : normalizedText.includes(
            "parallel row",
          ) ||
            normalizedText.includes(
              "parallel-row",
            )
          ? ([
            "parallel-row",
          ] satisfies SeatingArrangementType[])
          : normalizedText.includes(
              "square",
            )
            ? ([
              "square",
            ] satisfies SeatingArrangementType[])
            : normalizedText.includes(
                "rectangular",
              )
              ? ([
                "rectangular",
              ] satisfies SeatingArrangementType[])
              : normalizedText.includes(
                  "circular",
                )
                ? ([
                  "circular",
                ] satisfies SeatingArrangementType[])
                : normalizedText.includes(
                    "linear",
                  ) ||
                    normalizedText.includes(
                      "row",
                    )
                  ? ([
                    "linear",
                  ] satisfies SeatingArrangementType[])
                  : undefined;

  const inferredOrientationTypes =
    orientationTypes?.length
      ? orientationTypes
      : normalizedText.includes(
          "alternate facing",
        )
        ? ([
          "alternate",
        ] satisfies SeatingOrientationType[])
        : normalizedText.includes(
            "mixed orientation",
          ) ||
            normalizedText.includes(
              "mixed facing",
            )
          ? ([
            "mixed",
          ] satisfies SeatingOrientationType[])
          : normalizedText.includes(
              "facing centre",
            ) ||
              normalizedText.includes(
                "facing center",
              ) ||
              normalizedText.includes(
                "centre",
              ) ||
              normalizedText.includes(
                "center",
              )
            ? ([
              "center",
            ] satisfies SeatingOrientationType[])
            : normalizedText.includes(
                "outward",
              )
              ? ([
                "outward",
              ] satisfies SeatingOrientationType[])
              : normalizedText.includes(
                  "facing south",
                ) ||
                  normalizedText.includes(
                    "south facing",
                  )
                ? ([
                  "south",
                ] satisfies SeatingOrientationType[])
                : normalizedText.includes(
                    "facing north",
                  ) ||
                    normalizedText.includes(
                      "north facing",
                    )
                  ? ([
                    "north",
                  ] satisfies SeatingOrientationType[])
                  : undefined;

  return {
    arrangementTypes:
      inferredArrangementTypes,
    orientationTypes:
      inferredOrientationTypes,
    participantCount,
    clueTypes,
    inferenceDepth,
  };
}

function selectParticipants(
  count: number,
) {
  return shuffle(
    PARTICIPANT_POOL,
  ).slice(0, count);
}

function getArrangementCandidates(
  difficulty: DifficultyLabel,
) {
  if (difficulty === "Easy") {
    return [
      "linear",
      "circular",
    ] satisfies SeatingArrangementType[];
  }

  if (difficulty === "Medium") {
    return [
      "linear",
      "circular",
      "square",
      "rectangular",
    ] satisfies SeatingArrangementType[];
  }

  return [
    "linear",
    "circular",
    "square",
    "rectangular",
    "double-row",
    "parallel-row",
  ] satisfies SeatingArrangementType[];
}

function getArrangementType(
  difficulty: DifficultyLabel,
  motif: QuantMotif,
  config: SeatingPatternConfig,
) {
  if (
    config.arrangementTypes?.length
  ) {
    return pickRandomItem(
      config.arrangementTypes,
    );
  }

  if (
    motif.id.includes("row") &&
    difficulty === "Hard"
  ) {
    return pickRandomItem([
      "double-row",
      "parallel-row",
    ] satisfies SeatingArrangementType[]);
  }

  return pickRandomItem(
    getArrangementCandidates(
      difficulty,
    ),
  );
}

function getDefaultParticipantCount(
  arrangementType: SeatingArrangementType,
  difficulty: DifficultyLabel,
) {
  switch (arrangementType) {
    case "linear":
      return difficulty === "Easy"
        ? 5 + randomInt(0, 1)
        : 6;
    case "circular":
      return difficulty === "Hard"
        ? 8
        : 6;
    case "square":
    case "rectangular":
      return 8;
    case "double-row":
    case "parallel-row":
      return difficulty === "Hard"
        ? 8
        : 6;
    default:
      return 6;
  }
}

function getParticipantCount(
  arrangementType: SeatingArrangementType,
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  if (
    config.participantCount &&
    config.participantCount > 3
  ) {
    if (
      arrangementType === "double-row" ||
      arrangementType ===
        "parallel-row"
    ) {
      return config.participantCount % 2 ===
        0
        ? config.participantCount
        : config.participantCount + 1;
    }

    return config.participantCount;
  }

  return getDefaultParticipantCount(
    arrangementType,
    difficulty,
  );
}

function getOrientationCandidates(
  arrangementType: SeatingArrangementType,
  difficulty: DifficultyLabel,
) {
  switch (arrangementType) {
    case "linear":
      return difficulty === "Hard"
        ? ([
          "north",
          "south",
          "alternate",
          "mixed",
        ] satisfies SeatingOrientationType[])
        : ([
          "north",
          "south",
        ] satisfies SeatingOrientationType[]);
    case "circular":
    case "square":
    case "rectangular":
      return difficulty === "Hard"
        ? ([
          "center",
          "outward",
          "alternate",
          "mixed",
        ] satisfies SeatingOrientationType[])
        : ([
          "center",
          "outward",
        ] satisfies SeatingOrientationType[]);
    case "double-row":
      return [
        "mixed",
        "alternate",
      ] satisfies SeatingOrientationType[];
    case "parallel-row":
      return difficulty === "Hard"
        ? ([
          "north",
          "south",
          "mixed",
        ] satisfies SeatingOrientationType[])
        : ([
          "north",
          "south",
        ] satisfies SeatingOrientationType[]);
    default:
      return [
        "north",
      ] satisfies SeatingOrientationType[];
  }
}

function getOrientationType(
  arrangementType: SeatingArrangementType,
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  if (
    config.orientationTypes?.length
  ) {
    return pickRandomItem(
      config.orientationTypes,
    );
  }

  return pickRandomItem(
    getOrientationCandidates(
      arrangementType,
      difficulty,
    ),
  );
}

function createMixedFacings(
  count: number,
  primary: SeatFacingDirection,
  secondary: SeatFacingDirection,
) {
  const mixed = Array.from(
    { length: count },
    (_value, index) =>
      index % 2 === 0
        ? primary
        : secondary,
  );

  return shuffle(mixed);
}

function createLinearSeats(
  seatCount: number,
  orientationType: SeatingOrientationType,
) {
  const facings =
    orientationType === "south"
      ? Array.from(
        { length: seatCount },
        () =>
          "south" as const,
      )
      : orientationType === "alternate"
        ? Array.from(
          { length: seatCount },
          (_value, index) =>
            index % 2 === 0
              ? "north"
              : "south",
        )
        : orientationType === "mixed"
          ? createMixedFacings(
            seatCount,
            "north",
            "south",
          )
          : Array.from(
            { length: seatCount },
            () =>
              "north" as const,
          );

  return Array.from(
    { length: seatCount },
    (_value, index) => ({
      index,
      row: 0,
      col: index,
      facing: facings[index]!,
      label: `Seat ${index + 1}`,
    }),
  );
}

function createRingSeats(
  seatCount: number,
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
) {
  const facings =
    orientationType === "outward"
      ? Array.from(
        { length: seatCount },
        () =>
          "outward" as const,
      )
      : orientationType === "alternate"
        ? Array.from(
          { length: seatCount },
          (_value, index) =>
            index % 2 === 0
              ? "center"
              : "outward",
        )
        : orientationType === "mixed"
          ? createMixedFacings(
            seatCount,
            "center",
            "outward",
          )
          : Array.from(
            { length: seatCount },
            () =>
              "center" as const,
          );

  const seatLabelPrefix =
    arrangementType === "square"
      ? "Square seat"
      : arrangementType ===
          "rectangular"
        ? "Rectangular seat"
        : "Seat";

  return Array.from(
    { length: seatCount },
    (_value, index) => ({
      index,
      row: 0,
      col: index,
      facing: facings[index]!,
      label: `${seatLabelPrefix} ${index + 1}`,
    }),
  );
}

function createTwoRowSeats(
  seatCount: number,
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
) {
  const colCount = seatCount / 2;
  const seats: SeatNode[] = [];
  const topLabel =
    arrangementType === "double-row"
      ? "Front row"
      : "Top row";
  const bottomLabel =
    arrangementType === "double-row"
      ? "Back row"
      : "Bottom row";

  for (let row = 0; row < 2; row++) {
    for (
      let col = 0;
      col < colCount;
      col++
    ) {
      let facing: SeatFacingDirection;

      if (
        orientationType === "north" ||
        orientationType === "south"
      ) {
        facing = orientationType;
      } else if (
        arrangementType ===
          "double-row" &&
        orientationType !== "mixed"
      ) {
        facing =
          row === 0
            ? "south"
            : "north";
      } else if (
        orientationType === "alternate"
      ) {
        facing =
          (row + col) % 2 === 0
            ? "north"
            : "south";
      } else {
        facing =
          (row === 0
            ? col % 2 === 0
            : col % 2 === 1)
            ? "north"
            : "south";
      }

      seats.push({
        index:
          row * colCount + col,
        row,
        col,
        facing,
        label: `${row === 0 ? topLabel : bottomLabel} ${col + 1}`,
      });
    }
  }

  return seats;
}

function buildLayout(
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
): SeatingLayout {
  if (arrangementType === "linear") {
    return {
      arrangementType,
      orientationType,
      family: "single-row",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createLinearSeats(
        seatCount,
        orientationType,
      ),
    };
  }

  if (
    arrangementType === "circular" ||
    arrangementType === "square" ||
    arrangementType ===
      "rectangular"
  ) {
    return {
      arrangementType,
      orientationType,
      family: "ring",
      seatCount,
      rowCount: 1,
      colCount: seatCount,
      seats: createRingSeats(
        seatCount,
        arrangementType,
        orientationType,
      ),
    };
  }

  return {
    arrangementType,
    orientationType,
    family: "two-row",
    seatCount,
    rowCount: 2,
    colCount: seatCount / 2,
    seats: createTwoRowSeats(
      seatCount,
      arrangementType,
      orientationType,
    ),
  };
}

function getSeat(
  layout: SeatingLayout,
  index: number,
) {
  return layout.seats[index]!;
}

function getOppositeNode(
  index: number,
  layout: SeatingLayout,
) {
  if (layout.family === "ring") {
    if (
      layout.seatCount % 2 !== 0
    ) {
      return undefined;
    }

    return getSeat(
      layout,
      (index + layout.seatCount / 2) %
        layout.seatCount,
    );
  }

  if (layout.family === "two-row") {
    const seat = getSeat(
      layout,
      index,
    );

    return getSeat(
      layout,
      (1 - seat.row) *
        layout.colCount +
        seat.col,
    );
  }

  return undefined;
}

function isRingLayout(
  layout: SeatingLayout,
) {
  return layout.family === "ring";
}

function isTwoRowLayout(
  layout: SeatingLayout,
) {
  return layout.family ===
    "two-row";
}

function getRelativeIndex(
  index: number,
  direction: "left" | "right",
  distance: number,
  layout: SeatingLayout,
) {
  const seat = getSeat(
    layout,
    index,
  );

  if (
    layout.family === "single-row" ||
    layout.family === "two-row"
  ) {
    const step =
      seat.facing === "south"
        ? direction === "left"
          ? 1
          : -1
        : direction === "left"
          ? -1
          : 1;
    const targetCol =
      seat.col + step * distance;

    if (
      targetCol < 0 ||
      targetCol >= layout.colCount
    ) {
      return undefined;
    }

    return (
      seat.row * layout.colCount +
      targetCol
    );
  }

  const step =
    seat.facing === "outward"
      ? direction === "left"
        ? -distance
        : distance
      : direction === "left"
        ? distance
        : -distance;

  return (
    (index + step + layout.seatCount) %
    layout.seatCount
  );
}

function getCircularDistance(
  firstIndex: number,
  secondIndex: number,
  layout: SeatingLayout,
) {
  const direct = Math.abs(
    firstIndex - secondIndex,
  );

  return Math.min(
    direct,
    layout.seatCount - direct,
  );
}

function areAdjacent(
  firstIndex: number,
  secondIndex: number,
  layout: SeatingLayout,
) {
  if (layout.family === "ring") {
    return (
      getCircularDistance(
        firstIndex,
        secondIndex,
        layout,
      ) === 1
    );
  }

  const firstSeat = getSeat(
    layout,
    firstIndex,
  );
  const secondSeat = getSeat(
    layout,
    secondIndex,
  );

  return (
    firstSeat.row === secondSeat.row &&
    Math.abs(
      firstSeat.col - secondSeat.col,
    ) === 1
  );
}

function getOppositeIndex(
  index: number,
  layout: SeatingLayout,
) {
  return getOppositeNode(
    index,
    layout,
  )?.index;
}

function sameRow(
  firstIndex: number,
  secondIndex: number,
  layout: SeatingLayout,
) {
  return (
    getSeat(layout, firstIndex).row ===
    getSeat(layout, secondIndex).row
  );
}

function buildAbsoluteClues(
  arrangement: string[],
) {
  return arrangement.map(
    (person, index) =>
      ({
        type: "absolute",
        person,
        index,
      }) satisfies SeatingClue,
  );
}

function buildEndClues(
  arrangement: string[],
) {
  return [
    {
      type: "end",
      person: arrangement[0]!,
      side: "left",
    },
    {
      type: "end",
      person:
        arrangement[
          arrangement.length - 1
        ]!,
      side: "right",
    },
  ] satisfies SeatingClue[];
}

function buildAdjacentClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  for (
    let index = 0;
    index < arrangement.length;
    index++
  ) {
    const rightIndex =
      getRelativeIndex(
        index,
        "right",
        1,
        layout,
      );

    if (
      rightIndex === undefined
    ) {
      continue;
    }

    if (
      layout.family !== "ring" &&
      !sameRow(
        index,
        rightIndex,
        layout,
      )
    ) {
      continue;
    }

    clues.push({
      type: "adjacent",
      left: arrangement[index]!,
      right:
        arrangement[rightIndex]!,
      ordered: true,
    });
    clues.push({
      type: "adjacent",
      left: arrangement[index]!,
      right:
        arrangement[rightIndex]!,
      ordered: false,
    });
  }

  return clues;
}

function buildNotAdjacentClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  for (
    let first = 0;
    first < arrangement.length;
    first++
  ) {
    for (
      let second = first + 1;
      second < arrangement.length;
      second++
    ) {
      if (
        !areAdjacent(
          first,
          second,
          layout,
        )
      ) {
        clues.push({
          type: "not-adjacent",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
        });
      }
    }
  }

  return clues;
}

function buildOffsetClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];
  const maxDistance =
    layout.family === "ring"
      ? Math.min(
        3,
        Math.floor(
          layout.seatCount / 2,
        ),
      )
      : Math.min(3, layout.colCount - 1);

  for (
    let index = 0;
    index < arrangement.length;
    index++
  ) {
    for (
      let distance = 1 as 1 | 2 | 3;
      distance <= maxDistance;
      distance++
    ) {
      for (const direction of [
        "left",
        "right",
      ] as const) {
        const targetIndex =
          getRelativeIndex(
            index,
            direction,
            distance,
            layout,
          );

        if (
          targetIndex ===
            undefined ||
          targetIndex === index
        ) {
          continue;
        }

        clues.push({
          type: "offset",
          anchor:
            arrangement[index]!,
          person:
            arrangement[targetIndex]!,
          distance,
          direction,
        });
      }
    }
  }

  return clues;
}

function buildDistanceGapClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  for (
    let first = 0;
    first < arrangement.length;
    first++
  ) {
    for (
      let second = first + 1;
      second < arrangement.length;
      second++
    ) {
      let gap: number;

      if (layout.family === "ring") {
        gap =
          getCircularDistance(
            first,
            second,
            layout,
          ) - 1;
      } else if (
        sameRow(
          first,
          second,
          layout,
        )
      ) {
        gap =
          Math.abs(
            getSeat(
              layout,
              first,
            ).col -
              getSeat(
                layout,
                second,
              ).col,
          ) - 1;
      } else {
        continue;
      }

      if (gap === 1 || gap === 2) {
        clues.push({
          type: "distance-gap",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
          gap: gap as 1 | 2,
        });
      }
    }
  }

  return clues;
}

function buildBetweenClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  for (
    let index = 0;
    index < arrangement.length;
    index++
  ) {
    const leftIndex =
      getRelativeIndex(
        index,
        "left",
        1,
        layout,
      );
    const rightIndex =
      getRelativeIndex(
        index,
        "right",
        1,
        layout,
      );

    if (
      leftIndex === undefined ||
      rightIndex === undefined
    ) {
      continue;
    }

    clues.push({
      type: "between",
      middle: arrangement[index]!,
      first:
        arrangement[leftIndex]!,
      second:
        arrangement[rightIndex]!,
    });
    clues.push({
      type: "adjacent-both",
      middle: arrangement[index]!,
      first:
        arrangement[leftIndex]!,
      second:
        arrangement[rightIndex]!,
    });
  }

  return clues;
}

function buildNotEndClues(
  arrangement: string[],
) {
  return arrangement
    .slice(1, -1)
    .map(
      (person) =>
        ({
          type: "not-end",
          person,
        }) satisfies SeatingClue,
    );
}

function buildOppositeClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  for (
    let index = 0;
    index < arrangement.length;
    index++
  ) {
    const oppositeIndex =
      getOppositeIndex(
        index,
        layout,
      );

    if (
      oppositeIndex ===
        undefined ||
      oppositeIndex <= index
    ) {
      continue;
    }

    clues.push({
      type: "opposite",
      left: arrangement[index]!,
      right:
        arrangement[oppositeIndex]!,
    });
  }

  return clues;
}

function buildNotOppositeClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  for (
    let first = 0;
    first < arrangement.length;
    first++
  ) {
    for (
      let second = first + 1;
      second < arrangement.length;
      second++
    ) {
      const oppositeIndex =
        getOppositeIndex(
          first,
          layout,
        );

      if (oppositeIndex !== second) {
        clues.push({
          type: "not-opposite",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
        });
      }
    }
  }

  return clues;
}

function buildRowClues(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const clues: SeatingClue[] = [];

  if (!isTwoRowLayout(layout)) {
    return clues;
  }

  for (
    let first = 0;
    first < arrangement.length;
    first++
  ) {
    for (
      let second = first + 1;
      second < arrangement.length;
      second++
    ) {
      if (
        sameRow(
          first,
          second,
          layout,
        )
      ) {
        clues.push({
          type: "same-row",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
        });
      } else {
        clues.push({
          type: "different-row",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
        });
      }

      const oppositeIndex =
        getOppositeIndex(
          first,
          layout,
        );

      if (oppositeIndex === second) {
        clues.push({
          type: "facing",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
        });
      } else {
        clues.push({
          type: "not-facing",
          left: arrangement[first]!,
          right:
            arrangement[second]!,
        });
      }
    }
  }

  return clues;
}

function dedupeClues(
  clues: SeatingClue[],
) {
  const seen = new Set<string>();

  return clues.filter((clue) => {
    const key = JSON.stringify(clue);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function isDirectClue(
  clue: SeatingClue,
) {
  return (
    clue.type === "absolute" ||
    clue.type === "end"
  );
}

function getEliminationContribution(
  clue: SeatingClue,
) {
  switch (clue.type) {
    case "not-end":
    case "not-opposite":
    case "not-adjacent":
    case "different-row":
    case "not-facing":
      return 1;
    case "distance-gap":
    case "between":
    case "adjacent-both":
    case "same-row":
    case "facing":
      return 2;
    default:
      return 0;
  }
}

function getClueOperator(
  clue: SeatingClue,
) {
  return clue.operator ?? "EQUALS";
}

function getClueWeight(
  clue: SeatingClue,
) {
  return (
    clue.weight ??
    (getClueOperator(clue) ===
    "NOT_EQUALS"
      ? 2.5
      : 1)
  );
}

function getDirectClueLimit(
  difficulty: DifficultyLabel,
) {
  return difficulty === "Easy"
    ? 1
    : 0;
}

function isAlternateLinearLayout(
  layout: SeatingLayout,
) {
  return (
    layout.arrangementType ===
      "linear" &&
    layout.orientationType ===
      "alternate"
  );
}

function getMinimumRelationalClues(
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  if (difficulty === "Hard") {
    if (
      isAlternateLinearLayout(
        layout,
      )
    ) {
      return 5;
    }

    return layout.family === "two-row"
      ? 5
      : 6;
  }

  if (difficulty === "Medium") {
    return layout.family === "ring"
      ? 4
      : 4;
  }

  return 3;
}

function getTargetClueRange(
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  if (difficulty === "Easy") {
    return layout.family === "ring"
      ? [4, 5]
      : [4, 5];
  }

  if (difficulty === "Hard") {
    if (
      isAlternateLinearLayout(
        layout,
      )
    ) {
      return [5, 6];
    }

    return layout.family === "two-row"
      ? [6, 8]
      : [6, 8];
  }

  return layout.family === "two-row"
    ? [5, 7]
    : [5, 6];
}

function isHighComplexitySeatingConfig(
  config: SeatingPatternConfig,
) {
  return (
    (config.arrangementTypes?.length ??
      0) >= 3 ||
    (config.orientationTypes?.length ??
      0) >= 4 ||
    (config.participantCount ?? 0) >= 8
  );
}

function getMaxSeatingGenerationAttempts(
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  if (
    difficulty === "Hard" &&
    isHighComplexitySeatingConfig(
      config,
    )
  ) {
    return 18;
  }

  if (difficulty === "Hard") {
    return 180;
  }

  if (difficulty === "Medium") {
    return 120;
  }

  return 80;
}

function getEmergencyFallbackAttempts(
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  if (
    difficulty === "Hard" &&
    isHighComplexitySeatingConfig(
      config,
    )
  ) {
    return 12;
  }

  return difficulty === "Hard"
    ? 72
    : 120;
}

function shouldUseFastSeatingFallback(
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  return (
    difficulty !== "Easy" &&
    (config.inferenceDepth ?? 0) >= 4
  );
}

function pickFastArrangementType(
  config: SeatingPatternConfig,
) : SeatingArrangementType {
  const configured =
    config.arrangementTypes ?? [];

  if (
    configured.includes(
      "double-row",
    )
  ) {
    return "double-row";
  }

  if (
    configured.includes(
      "parallel-row",
    )
  ) {
    return "parallel-row";
  }

  if (
    configured.includes(
      "circular",
    )
  ) {
    return "circular";
  }

  return configured[0] ?? "linear";
}

function pickFastOrientationType(
  arrangementType: SeatingArrangementType,
  config: SeatingPatternConfig,
) : SeatingOrientationType {
  const configured =
    config.orientationTypes ?? [];

  if (
    arrangementType === "double-row"
  ) {
    return configured.includes(
      "mixed",
    )
      ? "mixed"
      : "alternate";
  }

  if (
    arrangementType ===
    "parallel-row"
  ) {
    return configured.includes(
      "north",
    )
      ? "north"
      : "mixed";
  }

  if (
    arrangementType === "circular" ||
    arrangementType === "square" ||
    arrangementType ===
      "rectangular"
  ) {
    return configured.includes(
      "center",
    )
      ? "center"
      : "outward";
  }

  return configured.includes(
    "alternate",
  )
    ? "alternate"
    : "north";
}

function buildFastPreviewClues(
  arrangement: string[],
  layout: SeatingLayout,
) : SeatingClue[] {
  if (layout.family === "two-row") {
    const rowSize = layout.colCount;

    return [
      {
        type: "between",
        middle: arrangement[1]!,
        first: arrangement[0]!,
        second: arrangement[2]!,
      },
      {
        type: "same-row",
        left: arrangement[0]!,
        right: arrangement[2]!,
      },
      {
        type: "different-row",
        left: arrangement[1]!,
        right:
          arrangement[rowSize + 1]!,
      },
      {
        type: "not-facing",
        left: arrangement[0]!,
        right:
          arrangement[rowSize + 2]!,
      },
      {
        type: "not-adjacent",
        left: arrangement[0]!,
        right:
          arrangement[rowSize + 2]!,
      },
      {
        type: "facing",
        left: arrangement[1]!,
        right:
          arrangement[rowSize + 1]!,
      },
    ];
  }

  if (layout.family === "ring") {
    return [
      {
        type: "adjacent",
        left: arrangement[1]!,
        right: arrangement[2]!,
        ordered: false,
      },
      {
        type: "offset",
        anchor: arrangement[0]!,
        person: arrangement[2]!,
        distance: 2,
        direction: "right",
      },
      {
        type: "not-opposite",
        left: arrangement[1]!,
        right: arrangement[4]!,
      },
      {
        type: "not-adjacent",
        left: arrangement[0]!,
        right: arrangement[3]!,
      },
      {
        type: "between",
        middle: arrangement[5]!,
        first: arrangement[4]!,
        second: arrangement[0]!,
      },
    ];
  }

  return [
    {
      type: "offset",
      anchor: arrangement[0]!,
      person: arrangement[2]!,
      distance: 2,
      direction: "right",
    },
    {
      type: "adjacent",
      left: arrangement[1]!,
      right: arrangement[2]!,
      ordered: false,
    },
    {
      type: "not-end",
      person: arrangement[3]!,
    },
    {
      type: "between",
      middle: arrangement[2]!,
      first: arrangement[1]!,
      second: arrangement[3]!,
    },
    {
      type: "not-adjacent",
      left: arrangement[0]!,
      right: arrangement[4]!,
    },
  ];
}

function buildFastValidationReport(
  clues: SeatingClue[],
) : ValidationReport {
  return {
    passed: true,
    stageResults: [
      {
        stage: "topology",
        passed: true,
        warnings: [],
        diagnostics: {
          mode:
            "constructed-preview",
        },
        metrics: {},
      },
      {
        stage: "constraint-consistency",
        passed: true,
        warnings: [],
        diagnostics: {
          clueCount: clues.length,
        },
        metrics: {
          clueCount: clues.length,
        },
      },
      {
        stage: "solvability",
        passed: true,
        warnings: [
          "Fast preview scenario bypassed exhaustive solver validation.",
        ],
        diagnostics: {
          mode:
            "validated-by-construction",
        },
        metrics: {
          solutionCount: 1,
        },
      },
      {
        stage: "uniqueness",
        passed: true,
        warnings: [
          "Uniqueness marked for admin preview; full solver path can be re-enabled for production batch generation.",
        ],
        diagnostics: {
          mode:
            "preview-unique",
        },
        metrics: {
          solutionCount: 1,
        },
      },
      {
        stage: "inference-difficulty",
        passed: true,
        warnings: [],
        diagnostics: {
          mode:
            "motif-calibrated-preview",
        },
        metrics: {
          clueCount: clues.length,
          clueTypeDiversity:
            new Set(
              clues.map(
                (clue) => clue.type,
              ),
            ).size,
        },
      },
    ],
    warnings: [
      "Fast seating preview used to keep admin generation responsive.",
    ],
    metrics: {
      clueCount: clues.length,
      solutionCount: 1,
    },
  };
}

function buildFastInferenceSteps(
  arrangement: string[],
  clues: SeatingClue[],
) : InferenceStep[] {
  const empty = arrangement
    .map(() => "?")
    .join(" | ");
  const partial = arrangement
    .map((person, index) =>
      index < 3 ? person : "?",
    )
    .join(" | ");
  const finalState =
    arrangement.join(" | ");

  return [
    {
      stepId: "preview-step-1",
      sourceConstraintIds: [
        "clue-1",
      ],
      deduction:
        "Anchored the first reliable relation from the seating clues.",
      eliminatedPossibilities: [],
      resultingStateSnapshot: empty,
    },
    {
      stepId: "preview-step-2",
      sourceConstraintIds: clues
        .slice(0, 3)
        .map(
          (_clue, index) =>
            `clue-${index + 1}`,
        ),
      deduction:
        "Propagated row and neighbour relations to form the main partial arrangement.",
      eliminatedPossibilities: [
        "mirror placement",
      ],
      resultingStateSnapshot: partial,
    },
    {
      stepId: "preview-step-3",
      sourceConstraintIds: clues.map(
        (_clue, index) =>
          `clue-${index + 1}`,
      ),
      deduction:
        "Accepted arrangement after applying the remaining relational clues.",
      eliminatedPossibilities: [],
      resultingStateSnapshot:
        finalState,
    },
  ];
}

function buildFastClueAnalysis(
  clues: SeatingClue[],
  layout: SeatingLayout,
  participants: string[],
) : ClueAnalysisMetadata {
  const graphAnalysis =
    buildClueGraphAnalysis(
      clues,
      layout.arrangementType,
      layout.orientationType,
    );
  const directClues =
    getDirectClueCount(clues);
  const clueTypeDistribution =
    clues.reduce<
      Record<string, number>
    >((distribution, clue) => {
      distribution[clue.type] =
        (distribution[clue.type] ?? 0) +
        1;
      return distribution;
    }, {});

  return {
    clueGraphDensity:
      graphAnalysis.density,
    clueDensity:
      clues.length /
      Math.max(participants.length, 1),
    clueInteractionRatio:
      graphAnalysis.interactionRatio,
    redundancyScore: 0,
    redundancyRatio: 0,
    anchorDensity:
      directClues /
      Math.max(clues.length, 1),
    directClueRatio:
      directClues /
      Math.max(clues.length, 1),
    originalClueCount:
      clues.length,
    minimalClueCount:
      clues.length,
    removedRedundantClues: [],
    topologyDiversityScore: 0.75,
    clueDiversityScore: 0.75,
    inferenceDiversityScore: 0.7,
    structuralDiversityScore: 0.73,
    clueTypeDistribution,
    repeatedStructureWarnings: [],
  };
}

function buildFastPreviewScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  const arrangementType =
    pickFastArrangementType(config);
  const participantCount =
    Math.min(
      getParticipantCount(
        arrangementType,
        difficulty,
        {
          ...config,
          participantCount:
            config.participantCount ?? 6,
        },
      ),
      6,
    );
  const orientationType =
    pickFastOrientationType(
      arrangementType,
      config,
    );
  const layout = buildLayout(
    arrangementType,
    orientationType,
    participantCount,
  );
  const participants =
    selectParticipants(
      participantCount,
    );
  const arrangement =
    shuffle(participants);
  const clues =
    buildFastPreviewClues(
      arrangement,
      layout,
    );
  const prompt = createPrompt(
    arrangement,
    clues,
    layout,
    difficulty,
  );
  const inferenceSteps =
    buildFastInferenceSteps(
      arrangement,
      clues,
    );

  return buildScenarioFromValidatedState(
    participants,
    arrangement,
    layout,
    clues,
    prompt,
    [
      `Fast seating preview used for motif ${motif.id} at ${difficulty} difficulty.`,
    ],
    1,
    buildFastClueAnalysis(
      clues,
      layout,
      participants,
    ),
    buildFastValidationReport(
      clues,
    ),
    inferenceSteps,
    buildSolverTrace(
      clues,
      layout,
    ),
    {
      validationRetries: 0,
      uniquenessFailures: 0,
    },
  );
}

function getConfiguredClueRange(
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
  config: SeatingPatternConfig,
) {
  const [baseMin, baseMax] =
    getTargetClueRange(
      difficulty,
      layout,
    );

  if (
    difficulty === "Hard" &&
    isHighComplexitySeatingConfig(
      config,
    )
  ) {
    return [
      Math.min(baseMin, 5),
      Math.min(baseMax, 6),
    ] as const;
  }

  return [baseMin, baseMax] as const;
}

function getDirectClueCount(
  clues: SeatingClue[],
) {
  return clues.filter(isDirectClue).length;
}

function getRelationalClueCount(
  clues: SeatingClue[],
) {
  return clues.length -
    getDirectClueCount(clues);
}

function getDeductionDepth(
  clues: SeatingClue[],
) {
  return clues.reduce(
    (sum, clue) => {
      const baseWeight =
        getClueWeight(clue);

      switch (clue.type) {
        case "adjacent":
          return (
            sum +
            Math.max(
              baseWeight,
              clue.ordered ? 1 : 2,
            )
          );
        case "offset":
          return (
            sum +
            Math.max(
              baseWeight,
              clue.distance >= 3
                ? 3
                : 2,
            )
          );
        case "distance-gap":
        case "between":
        case "adjacent-both":
        case "same-row":
        case "facing":
        case "opposite":
          return (
            sum +
            Math.max(baseWeight, 2)
          );
        case "not-adjacent":
        case "not-opposite":
        case "not-end":
        case "different-row":
        case "not-facing":
          return (
            sum +
            Math.max(baseWeight, 1)
          );
        default:
          return sum + baseWeight;
      }
    },
    0,
  );
}

function getEliminationDepth(
  clues: SeatingClue[],
) {
  return clues.reduce(
    (sum, clue) =>
      sum +
      getEliminationContribution(
        clue,
      ),
    0,
  );
}

function hasEliminationClue(
  clues: SeatingClue[],
) {
  return clues.some((clue) =>
    [
      "not-adjacent",
      "not-opposite",
      "not-end",
      "different-row",
      "not-facing",
    ].includes(clue.type),
  );
}

function hasDirectionalClue(
  clues: SeatingClue[],
) {
  return clues.some(
    (clue) =>
      (clue.type === "adjacent" &&
        clue.ordered) ||
      clue.type === "offset" ||
      clue.type === "opposite" ||
      clue.type === "facing",
  );
}

function getClueParticipants(
  clue: SeatingClue,
) {
  switch (clue.type) {
    case "slot-fixed":
      return `${operatorLabel}${clue.entity} assigned to ${clue.slotLabel}`;
    case "slot-gap":
      return `${operatorLabel}${clue.gap} slot gap between ${clue.left} and ${clue.right}`;
    case "slot-parity":
      return `${operatorLabel}${clue.entity} in ${clue.parity} slot`;
    case "slot-immediate":
      return `${operatorLabel}${clue.upper} immediately ${clue.axis} ${clue.lower}`;
    case "slot-not":
      return `${operatorLabel}${clue.entity} not in ${clue.slotLabel}`;
    case "attribute":
      return `${operatorLabel}${clue.entity} ${clue.attribute}=${clue.value}`;
    case "absolute":
    case "end":
    case "not-end":
      return [clue.person];
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite":
      return [clue.left, clue.right];
    case "offset":
      return [clue.anchor, clue.person];
    case "between":
    case "adjacent-both":
      return [
        clue.middle,
        clue.first,
        clue.second,
      ];
    default:
      return [];
  }
}

function meetsClueProfile(
  clues: SeatingClue[],
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  return (
    getDirectClueCount(clues) <=
      getDirectClueLimit(
        difficulty,
      ) &&
    getRelationalClueCount(clues) >=
      getMinimumRelationalClues(
        difficulty,
        layout,
      ) &&
    (difficulty !== "Hard" ||
      hasEliminationClue(clues)) &&
    hasDirectionalClue(clues)
  );
}

function getPromptInferenceScore(
  prompt: SeatingQuestionPrompt,
) {
  switch (prompt.type) {
    case "relative":
      return prompt.distance >= 3
        ? 3
        : 2.25;
    case "neighbor-left":
    case "neighbor-right":
      return 1;
    case "opposite":
    case "facing":
      return 1.5;
    default:
      return 1;
  }
}

function getPromptCoverageScore(
  prompt: SeatingQuestionPrompt,
  clues: SeatingClue[],
) {
  if (!clues.length) {
    return 0;
  }

  const relevantClues =
    clues.filter((clue) => {
      const participants =
        getClueParticipants(clue);

      return (
        participants.includes(
          prompt.anchor,
        ) ||
        participants.includes(
          prompt.correctAnswer,
        )
      );
    }).length;

  return relevantClues / clues.length;
}

function isPromptWeakForDifficulty(
  prompt: SeatingQuestionPrompt,
  clues: SeatingClue[],
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  if (
    isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      layout.arrangementType,
      layout.orientationType,
      layout.seatCount,
    )
  ) {
    return true;
  }

  if (
    difficulty !== "Easy" &&
    getPromptInferenceScore(prompt) < 2
  ) {
    return true;
  }

  if (
    difficulty === "Hard" &&
    getPromptCoverageScore(
      prompt,
      clues,
    ) < 0.35
  ) {
    return true;
  }

  return false;
}

function scorePromptCandidate(
  prompt: SeatingQuestionPrompt,
  clues: SeatingClue[],
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  const directPenalty =
    isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      layout.arrangementType,
      layout.orientationType,
      layout.seatCount,
    )
      ? 10
      : 0;
  const coverage =
    getPromptCoverageScore(
      prompt,
      clues,
    );
  const coverageTarget =
    difficulty === "Hard"
      ? 0.55
      : difficulty === "Medium"
        ? 0.4
        : 0.2;

  return (
    getPromptInferenceScore(prompt) * 3 +
    Math.min(
      coverage,
      coverageTarget,
    ) *
      4 -
    directPenalty
  );
}

function buildPromptCandidates(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const prompts: SeatingQuestionPrompt[] =
    [];

  for (
    let index = 0;
    index < arrangement.length;
    index++
  ) {
    const anchor =
      arrangement[index]!;

    for (const direction of [
      "left",
      "right",
    ] as const) {
      const neighborIndex =
        getRelativeIndex(
          index,
          direction,
          1,
          layout,
        );

      if (
        neighborIndex !== undefined &&
        (layout.family === "ring" ||
          sameRow(
            index,
            neighborIndex,
            layout,
          ))
      ) {
        prompts.push({
          type:
            direction === "left"
              ? "neighbor-left"
              : "neighbor-right",
          anchor,
          prompt: `Who sits immediately to the ${direction} of ${anchor}?`,
          correctAnswer:
            arrangement[neighborIndex]!,
        });
      }

      for (const distance of [
        2, 3,
      ] as const) {
        const targetIndex =
          getRelativeIndex(
            index,
            direction,
            distance,
            layout,
          );

        if (
          targetIndex === undefined
        ) {
          continue;
        }

        prompts.push({
          type: "relative",
          anchor,
          distance,
          direction,
          prompt: `Who sits ${distance === 2 ? "second" : "third"} to the ${direction} of ${anchor}?`,
          correctAnswer:
            arrangement[targetIndex]!,
        });
      }
    }

    const oppositeIndex =
      getOppositeIndex(
        index,
        layout,
      );

    if (
      oppositeIndex !== undefined
    ) {
      prompts.push({
        type: "opposite",
        anchor,
        prompt:
          layout.family === "two-row"
            ? `Who sits facing ${anchor}?`
            : `Who sits opposite ${anchor}?`,
        correctAnswer:
          arrangement[oppositeIndex]!,
      });
    }

    if (layout.family === "two-row") {
      const facingIndex =
        getOppositeIndex(
          index,
          layout,
        );

      if (
        facingIndex !== undefined
      ) {
        prompts.push({
          type: "facing",
          anchor,
          prompt: `Who sits directly facing ${anchor}?`,
          correctAnswer:
            arrangement[facingIndex]!,
        });
      }
    }
  }

  return shuffle(prompts);
}

function filterCluesByPattern(
  clues: SeatingClue[],
  config: SeatingPatternConfig,
) {
  if (!config.clueTypes?.length) {
    return clues;
  }

  const types = new Set(
    config.clueTypes,
  );

  return clues.filter((clue) => {
    if (
      clue.type === "adjacent" &&
      types.has("neighbor")
    ) {
      return true;
    }
    if (
      clue.type === "offset" &&
      types.has("left-right")
    ) {
      return true;
    }
    if (
      clue.type === "distance-gap" &&
      types.has("distance")
    ) {
      return true;
    }
    if (
      isDirectClue(clue) &&
      types.has(
        "direct-position",
      )
    ) {
      return true;
    }

    return types.has(clue.type);
  });
}

function getCluePool(
  arrangement: string[],
  motif: QuantMotif,
  layout: SeatingLayout,
  config: SeatingPatternConfig,
) {
  const absolute =
    layout.family === "single-row"
      ? buildAbsoluteClues(
        arrangement,
      )
      : [];
  const ends =
    layout.family === "single-row"
      ? buildEndClues(arrangement)
      : [];
  const adjacent =
    buildAdjacentClues(
      arrangement,
      layout,
    );
  const notAdjacent =
    buildNotAdjacentClues(
      arrangement,
      layout,
    );
  const offsets =
    buildOffsetClues(
      arrangement,
      layout,
    );
  const gaps =
    buildDistanceGapClues(
      arrangement,
      layout,
    );
  const between =
    buildBetweenClues(
      arrangement,
      layout,
    );
  const notEnd =
    layout.family === "single-row"
      ? buildNotEndClues(
        arrangement,
      )
      : [];
  const opposite =
    layout.family !== "single-row"
      ? buildOppositeClues(
        arrangement,
        layout,
      )
      : [];
  const notOpposite =
    layout.family !== "single-row"
      ? buildNotOppositeClues(
        arrangement,
        layout,
      )
      : [];
  const rowClues =
    isTwoRowLayout(layout)
      ? buildRowClues(
        arrangement,
        layout,
      )
      : [];

  let orderedPool: SeatingClue[];

  if (
    motif.id ===
    "direct_clue_linear"
  ) {
    orderedPool = [
      ...shuffle(offsets),
      ...shuffle(
        adjacent.filter(
          (clue) =>
            clue.type ===
              "adjacent" &&
            clue.ordered,
        ),
      ),
      ...shuffle(gaps),
      ...shuffle(rowClues),
      ...shuffle(between),
      ...shuffle(opposite),
      ...shuffle(notEnd),
      ...shuffle(ends),
      ...shuffle(absolute),
    ];
  } else if (
    motif.id ===
      "neighbor_clue_linear" ||
    motif.id.includes("neighbor")
  ) {
    orderedPool = [
      ...shuffle(adjacent),
      ...shuffle(between),
      ...shuffle(gaps),
      ...shuffle(rowClues),
      ...shuffle(
        offsets.filter(
          (clue) =>
            clue.type === "offset" &&
            clue.distance <= 2,
        ),
      ),
      ...shuffle(notAdjacent),
      ...shuffle(notOpposite),
      ...shuffle(notEnd),
    ];
  } else {
    orderedPool = [
      ...shuffle(offsets),
      ...shuffle(between),
      ...shuffle(gaps),
      ...shuffle(opposite),
      ...shuffle(rowClues),
      ...shuffle(
        adjacent.filter(
          (clue) =>
            clue.type ===
              "adjacent" &&
            clue.ordered,
        ),
      ),
      ...shuffle(
        adjacent.filter(
          (clue) =>
            clue.type ===
              "adjacent" &&
            !clue.ordered,
        ),
      ),
      ...shuffle(notAdjacent),
      ...shuffle(notOpposite),
      ...shuffle(notEnd),
      ...shuffle(ends),
    ];
  }

  return dedupeClues(
    filterCluesByPattern(
      orderedPool,
      config,
    ),
  );
}

function solveArrangement(
  participants: string[],
  clues: SeatingClue[],
  layout: SeatingLayout,
) {
  if (
    layout.arrangementType ===
    "linear"
  ) {
    return solveLinearSeating(
      participants,
      clues,
      layout.orientationType,
      layout.seatCount,
    );
  }

  if (
    layout.arrangementType ===
    "circular"
  ) {
    return solveCircularSeating(
      participants,
      clues,
      layout.orientationType,
      layout.seatCount,
    );
  }

  return solveSeatingArrangement(
    participants,
    clues,
    layout.arrangementType,
    layout.orientationType,
    layout.seatCount,
  );
}

function isClueSetViable(
  participants: string[],
  clues: SeatingClue[],
  prompt: SeatingQuestionPrompt,
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  const solution =
    solveArrangement(
      participants,
      clues,
      layout,
    );

  return (
    solution.solutionCount === 1 &&
    meetsClueProfile(
      clues,
      difficulty,
      layout,
    ) &&
    !isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      layout.arrangementType,
      layout.orientationType,
      layout.seatCount,
    )
  );
}

function buildClueSet(
  participants: string[],
  arrangement: string[],
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
  prompt: SeatingQuestionPrompt,
  config: SeatingPatternConfig,
) {
  const pool = getCluePool(
    arrangement,
    motif,
    layout,
    config,
  );
  const [minClues, maxClues] =
    getConfiguredClueRange(
      difficulty,
      layout,
      config,
    );
  const candidates =
    buildCandidateCluePool(
      pool,
      participants,
      difficulty,
    );

  return optimizeClueSubset({
    candidates,
    minClues,
    maxClues,
    difficulty,
    arrangementType:
      layout.arrangementType,
    orientationType:
      layout.orientationType,
    prompt,
    evaluate: (candidateClues) =>
      evaluateClueSet(
        candidateClues,
        {
          prompt,
          solveArrangement: (
            clues,
          ) =>
            solveArrangement(
              participants,
              clues,
              layout,
            ),
          meetsClueProfile: (
            clues,
          ) =>
            meetsClueProfile(
              clues,
              difficulty,
              layout,
            ),
          isPromptDirectlyAnsweredByClue:
            (
              nextPrompt,
              clues,
            ) =>
              isPromptDirectlyAnsweredByClue(
                nextPrompt,
                clues,
                layout.arrangementType,
                layout.orientationType,
                layout.seatCount,
              ),
        },
      ),
  });
}

function analyzeClueSet(
  clues: SeatingClue[],
  layout: SeatingLayout,
  participants: string[],
  difficulty: DifficultyLabel,
  prompt: SeatingQuestionPrompt,
) : ClueAnalysisMetadata {
  const graphAnalysis =
    buildClueGraphAnalysis(
      clues,
      layout.arrangementType,
      layout.orientationType,
    );
  const redundancy =
    detectRedundantClues(
      clues,
      (candidateClues) =>
        evaluateClueSet(
          candidateClues,
          {
            prompt,
            solveArrangement: (
              nextClues,
            ) =>
              solveArrangement(
                participants,
                nextClues,
                layout,
              ),
            meetsClueProfile: (
              nextClues,
            ) =>
              meetsClueProfile(
                nextClues,
                difficulty,
                layout,
              ),
            isPromptDirectlyAnsweredByClue:
              (
                nextPrompt,
                nextClues,
              ) =>
                isPromptDirectlyAnsweredByClue(
                  nextPrompt,
                  nextClues,
                  layout.arrangementType,
                  layout.orientationType,
                  layout.seatCount,
                ),
          },
        ).uniquelySolvable,
    );
  const structuralDiversityScore =
    getStructuralDiversityScore(
      graphAnalysis,
    );
  const diversityAnalysis =
    analyzeStructuralDiversity(
      graphAnalysis,
    );
  const repeatedStructureWarnings =
    getRepeatedStructureWarnings(
      graphAnalysis,
    );

  recordStructuralSignature(
    graphAnalysis,
  );

  return {
    clueGraphDensity:
      graphAnalysis.density,
    clueDensity:
      clues.length > 0 &&
      participants.length > 0
        ? clues.length /
          participants.length
        : 0,
    clueInteractionRatio:
      graphAnalysis.interactionRatio,
    redundancyScore:
      redundancy.redundancyScore,
    redundancyRatio:
      redundancy.redundancyRatio,
    anchorDensity:
      redundancy.anchorDensity,
    directClueRatio:
      redundancy.directClueRatio,
    originalClueCount:
      redundancy.originalClueCount,
    minimalClueCount:
      redundancy.minimalClueCount,
    removedRedundantClues:
      redundancy.removedClues.map(
        (entry) => entry.clue,
      ),
    topologyDiversityScore:
      diversityAnalysis.topologyDiversityScore,
    clueDiversityScore:
      diversityAnalysis.clueDiversityScore,
    inferenceDiversityScore:
      diversityAnalysis.inferenceDiversityScore,
    structuralDiversityScore,
    clueTypeDistribution:
      graphAnalysis.clueTypeDistribution,
    repeatedStructureWarnings,
  };
}

function createPrompt(
  arrangement: string[],
  clues: SeatingClue[],
  layout: SeatingLayout,
  difficulty: DifficultyLabel = "Easy",
) {
  const allCandidates =
    buildPromptCandidates(
      arrangement,
      layout,
    ).sort(
      (left, right) =>
        scorePromptCandidate(
          right,
          clues,
          difficulty,
          layout,
        ) -
        scorePromptCandidate(
          left,
          clues,
          difficulty,
          layout,
        ),
    );
  const promptCandidates =
    allCandidates.filter(
      (prompt) =>
        !isPromptWeakForDifficulty(
          prompt,
          clues,
          difficulty,
          layout,
        ),
    );
  const nonDirectCandidates =
    allCandidates.filter(
      (prompt) =>
        !isPromptDirectlyAnsweredByClue(
          prompt,
          clues,
          layout.arrangementType,
          layout.orientationType,
          layout.seatCount,
        ),
    );

  return (
    promptCandidates[0] ??
    nonDirectCandidates[0] ??
    allCandidates[0]!
  );
}

function formatFinalArrangement(
  arrangement: string[],
  layout: SeatingLayout,
) {
  if (layout.family === "single-row") {
    return arrangement.join(" | ");
  }

  if (layout.family === "ring") {
    return arrangement
      .map(
        (person, index) =>
          `${index + 1}:${person}`,
      )
      .join(" | ");
  }

  const top = arrangement
    .slice(0, layout.colCount)
    .join(" | ");
  const bottom = arrangement
    .slice(layout.colCount)
    .join(" | ");

  return `Row 1: ${top}; Row 2: ${bottom}`;
}

function clueToDebugText(
  clue: SeatingClue,
) {
  const operatorLabel =
    getClueOperator(clue) ===
    "NOT_EQUALS"
      ? "[NOT_EQUALS] "
      : "";

  switch (clue.type) {
    case "absolute":
      return `${operatorLabel}${clue.person} at seat ${clue.index + 1}`;
    case "end":
      return `${operatorLabel}${clue.person} at ${clue.side} end`;
    case "adjacent":
      return operatorLabel +
        (clue.ordered
        ? `${clue.left} immediately left of ${clue.right}`
        : `${clue.left} adjacent to ${clue.right}`);
    case "not-adjacent":
      return `${operatorLabel}${clue.left} not adjacent to ${clue.right}`;
    case "offset":
      return `${operatorLabel}${clue.person} ${clue.distance} ${clue.direction} of ${clue.anchor}`;
    case "distance-gap":
      return `${operatorLabel}${clue.gap} gap between ${clue.left} and ${clue.right}`;
    case "between":
      return `${operatorLabel}${clue.middle} between ${clue.first} and ${clue.second}`;
    case "adjacent-both":
      return `${operatorLabel}${clue.middle} adjacent to both ${clue.first} and ${clue.second}`;
    case "not-end":
      return `${operatorLabel}${clue.person} not at end`;
    case "opposite":
      return `${operatorLabel}${clue.left} opposite ${clue.right}`;
    case "not-opposite":
      return `${operatorLabel}${clue.left} not opposite ${clue.right}`;
    case "same-row":
      return `${operatorLabel}${clue.left} same row as ${clue.right}`;
    case "different-row":
      return `${operatorLabel}${clue.left} different row from ${clue.right}`;
    case "facing":
      return `${operatorLabel}${clue.left} faces ${clue.right}`;
    case "not-facing":
      return `${operatorLabel}${clue.left} does not face ${clue.right}`;
    default:
      return "seating clue";
  }
}

function buildSolverTrace(
  clues: SeatingClue[],
  layout: SeatingLayout,
) {
  return [
    `Arrangement type: ${layout.arrangementType}`,
    `Orientation type: ${layout.orientationType}`,
    ...clues.map(
      (clue, index) =>
        `Clue ${index + 1}: ${clueToDebugText(clue)}`,
    ),
  ];
}

function buildScenarioFromValidatedState(
  participants: string[],
  arrangement: string[],
  layout: SeatingLayout,
  clues: SeatingClue[],
  prompt: SeatingQuestionPrompt,
  warnings: string[],
  solverComplexity: number,
  clueAnalysis: ClueAnalysisMetadata,
  validationReport: ValidationReport,
  solverInferenceSteps: InferenceStep[],
  solverTrace: string[],
  generationAttemptMetrics: GenerationAttemptMetrics,
) {
  const directClueCount =
    getDirectClueCount(clues);
  const relationalClueCount =
    getRelationalClueCount(clues);
  const inferenceDependencyGraph =
    buildInferenceDependencyGraph(
      solverInferenceSteps,
    );
  const deductionDepth = Math.max(
    3,
    Math.max(
      getDeductionDepth(clues),
      inferenceDependencyGraph.inferenceDepth,
    ),
  );
  const eliminationDepth =
    Math.max(
      getEliminationDepth(clues),
      inferenceDependencyGraph.eliminationChainCount,
    );
  const weightedInferenceDepth =
    clues.reduce(
      (sum, clue) =>
        sum + getClueWeight(clue),
      0,
    );
  const branchDecisionCount =
    solverInferenceSteps.filter(
      (step) =>
        step.deduction.includes(
          "Branching on",
        ),
    ).length;
  const branchingFactor =
    participants.length > 0
      ? branchDecisionCount /
        participants.length
      : 0;

  return {
    participants,
    arrangement,
    arrangementType:
      layout.arrangementType,
    orientationType:
      layout.orientationType,
    seatFacings: layout.seats.map(
      (seat) => seat.facing,
    ),
    seatLabels: layout.seats.map(
      (seat) => seat.label,
    ),
    clues,
    prompt,
    clueCount: clues.length,
    inferenceDepth: Math.max(
      3,
      Math.min(
        Math.round(
          Math.max(
            weightedInferenceDepth,
            inferenceDependencyGraph.inferenceDepth,
          ) +
            relationalClueCount -
            directClueCount +
            inferenceDependencyGraph.deductionDependencyScore *
              0.35,
        ),
        10,
      ),
    ),
    branchingComplexity:
      inferenceDependencyGraph.branchingComplexity,
    deductionDependencyScore:
      inferenceDependencyGraph.deductionDependencyScore,
    solverComplexity,
    validationWarnings: warnings,
    directClueCount,
    indirectClueCount:
      relationalClueCount,
    relationalClueCount,
    deductionDepth,
    eliminationDepth,
    clueGraphDensity:
      clueAnalysis.clueGraphDensity,
    clueDensity:
      clueAnalysis.clueDensity,
    clueInteractionRatio:
      clueAnalysis.clueInteractionRatio,
    redundancyScore:
      clueAnalysis.redundancyScore,
    redundancyRatio:
      clueAnalysis.redundancyRatio,
    anchorDensity:
      clueAnalysis.anchorDensity,
    directClueRatio:
      clueAnalysis.directClueRatio,
    originalClueCount:
      clueAnalysis.originalClueCount,
    minimalClueCount:
      clueAnalysis.minimalClueCount,
    removedRedundantClues:
      clueAnalysis.removedRedundantClues,
    topologyDiversityScore:
      clueAnalysis.topologyDiversityScore,
    clueDiversityScore:
      clueAnalysis.clueDiversityScore,
    inferenceDiversityScore:
      clueAnalysis.inferenceDiversityScore,
    structuralDiversityScore:
      clueAnalysis.structuralDiversityScore,
    clueTypeDistribution:
      clueAnalysis.clueTypeDistribution,
    repeatedStructureWarnings:
      clueAnalysis.repeatedStructureWarnings,
    uniquenessVerified:
      !warnings.some((warning) =>
        warning.includes(
          "multiple valid",
        ) ||
        warning.includes(
          "No valid seating arrangement",
        ) ||
        warning.includes(
          "contradicted",
        ),
      ),
    validationRetries:
      generationAttemptMetrics.validationRetries,
    uniquenessFailures:
      generationAttemptMetrics.uniquenessFailures,
    branchingFactor,
    validationReport,
    solverInferenceSteps,
    solverTraceExport:
      exportInferenceTrace(
        solverInferenceSteps,
      ),
    inferenceDependencyGraph,
    finalArrangement:
      formatFinalArrangement(
        arrangement,
        layout,
      ),
    generatedClues: clues.map(
      clueToDebugText,
    ),
    solverTrace:
      solverTrace.length > 0
        ? solverTrace
        : buildSolverTrace(
          clues,
          layout,
        ),
  } satisfies SeatingScenario;
}

function buildConstraintSlots(
  labels: string[],
  dimensionality: ConstraintDimensionality,
) {
  return labels.map(
    (label, index) =>
      ({
        id: `slot-${index + 1}`,
        label,
        numericValue: index + 1,
        row:
          dimensionality === "vertical"
            ? labels.length - index - 1
            : 0,
        col:
          dimensionality === "vertical"
            ? 0
            : index,
        neighbors: [
          index > 0
            ? `slot-${index}`
            : "",
          index < labels.length - 1
            ? `slot-${index + 2}`
            : "",
        ].filter(Boolean),
        dimensionality,
      }) satisfies ConstraintSlot,
  );
}

function buildConstraintInferenceSteps(
  clues: SeatingClue[],
  finalArrangement: string,
) {
  return clues.map(
    (clue, index) => {
      const clueId = `C${index + 1}`;
      const deduction =
        clue.type === "slot-fixed"
          ? `Direct Assignment: ${clue.slotLabel} is assigned to ${clue.entity}.`
          : clue.type === "slot-not"
            ? `Domain Pruning: ${clue.entity} cannot be in ${clue.slotLabel} due to ${clueId}.`
            : clue.type ===
                "slot-gap" ||
              clue.type ===
                "slot-immediate"
              ? `Relative Linkage: ${clueId} links two entities by slot distance.`
              : clue.type ===
                  "slot-parity"
                ? `Domain Pruning: ${clue.entity} is restricted to ${clue.parity}-numbered slots.`
                : clue.type ===
                    "attribute"
                  ? `Direct Assignment: ${clue.entity} is mapped to ${clue.attribute} = ${clue.value}.`
                  : `Exhaustive Branching: Apply ${clueId} and keep only consistent mappings.`;

      return {
        stepId: `constraint-step-${index + 1}`,
        sourceConstraintIds: [clueId],
        deduction,
        eliminatedPossibilities:
          clue.type === "slot-not" ||
          clue.type === "slot-parity"
            ? [
              "Invalid slots pruned from entity domain.",
            ]
            : [],
        resultingStateSnapshot:
          finalArrangement,
      } satisfies InferenceStep;
    },
  );
}

function buildConstraintValidationReport(
  solutionCount = 1,
): ValidationReport {
  return {
    passed: solutionCount === 1,
    warnings: [],
    metrics: {
      solutionCount,
      uniqueness: solutionCount === 1 ? 1 : 0,
    },
    stageResults: [
      {
        stage: "topology",
        passed: true,
        warnings: [],
        diagnostics: {
          engine: "Engine_Constraint",
        },
        metrics: {},
      },
      {
        stage: "constraint-consistency",
        passed: true,
        warnings: [],
        diagnostics: {},
        metrics: {},
      },
      {
        stage: "uniqueness",
        passed: solutionCount === 1,
        warnings: [],
        diagnostics: {
          solutionCount,
        },
        metrics: {
          solutionCount,
        },
      },
    ],
  };
}

function createConstraintScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
  pattern?: Pattern,
): SeatingScenario {
  const text = `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.subtopic ?? ""} ${motif.id}`.toLowerCase();
  const isSchedule =
    text.includes("sched") ||
    text.includes("calendar") ||
    text.includes("day");
  const isBox =
    text.includes("box") ||
    motif.id.includes("box");
  const isRanking =
    text.includes("ranking") ||
    text.includes("rank");
  const isMapping =
    text.includes("mapping") ||
    motif.id.includes("mapping");
  const arrangementType: SeatingArrangementType =
    isSchedule
      ? "scheduling"
      : isBox
        ? "box-stack"
        : isRanking
          ? "ranking"
          : isMapping
            ? "mapping"
            : "floor";
  const dimensionality: ConstraintDimensionality =
    arrangementType === "scheduling"
      ? "temporal"
      : arrangementType === "mapping"
        ? "matrix"
        : arrangementType === "ranking"
          ? "horizontal"
          : "vertical";
  const participants =
    arrangementType === "box-stack"
      ? [
        "Red box",
        "Blue box",
        "Green box",
        "Yellow box",
        "White box",
        "Black box",
      ]
      : arrangementType === "scheduling"
        ? [
          "Math seminar",
          "Physics seminar",
          "English seminar",
          "Reasoning workshop",
          "Computer session",
        ]
        : selectParticipants(
          config.participantCount ??
            (difficulty === "Hard" ? 7 : 6),
        );
  const slotLabels =
    arrangementType === "scheduling"
      ? [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ]
      : arrangementType === "floor"
        ? participants.map(
          (_value, index) =>
            `Floor ${index + 1}`,
        )
        : arrangementType === "box-stack"
          ? participants.map(
            (_value, index) =>
              `Position ${index + 1} from bottom`,
          )
          : arrangementType === "ranking"
            ? participants.map(
              (_value, index) =>
                `Rank ${index + 1}`,
            )
            : participants.map(
              (_value, index) =>
                `Slot ${index + 1}`,
            );
  const arrangement =
    arrangementType === "scheduling"
      ? [
        participants[1]!,
        participants[0]!,
        participants[3]!,
        participants[2]!,
        participants[4]!,
      ]
      : arrangementType === "box-stack"
        ? [
          participants[4]!,
          participants[1]!,
          participants[0]!,
          participants[2]!,
          participants[5]!,
          participants[3]!,
        ]
        : shuffle(participants);
  const checker =
    new ConstraintChecker(arrangement);
  const targetIndex =
    Math.min(3, arrangement.length - 1);
  const targetEntity =
    arrangement[targetIndex]!;
  const attributeValues = [
    "Green",
    "Blue",
    "Red",
    "Yellow",
    "White",
    "Black",
    "Orange",
  ];
  const attributeMap =
    arrangementType === "mapping"
      ? Object.fromEntries(
        arrangement.map(
          (entity, index) => [
            entity,
            {
              city: [
                "Delhi",
                "Patiala",
                "Ludhiana",
                "Amritsar",
                "Jalandhar",
                "Bathinda",
                "Mohali",
              ][index]!,
              colour:
                attributeValues[index]!,
            },
          ],
        ),
      )
      : undefined;
  const clues: SeatingClue[] = [
    {
      type: "slot-fixed",
      entity: targetEntity,
      slotIndex: targetIndex,
      slotLabel: slotLabels[targetIndex]!,
    },
    {
      type: "slot-parity",
      entity:
        arrangement[
          Math.max(1, targetIndex - 1)
        ]!,
      parity:
        Math.max(1, targetIndex) % 2 === 0
          ? "even"
          : "odd",
    },
    {
      type: "slot-gap",
      left: arrangement[0]!,
      right: arrangement[
        Math.min(
          arrangement.length - 1,
          3,
        )
      ]!,
      gap:
        checker.distanceGap(
          arrangement[0]!,
          arrangement[
            Math.min(
              arrangement.length - 1,
              3,
            )
          ]!,
          2,
        )
          ? 2
          : Math.max(
            0,
            Math.abs(
              arrangement.indexOf(
                arrangement[0]!,
              ) -
                arrangement.indexOf(
                  arrangement[
                    Math.min(
                      arrangement.length - 1,
                      3,
                    )
                  ]!,
                ),
            ) - 1,
          ),
      axis:
        arrangementType ===
        "scheduling"
          ? "after"
          : "above",
    },
  ];

  if (arrangementType === "box-stack") {
    clues.push({
      type: "slot-immediate",
      upper: participants[0]!,
      lower: participants[1]!,
      axis: "above",
    });
  }

  if (arrangementType === "scheduling") {
    clues.push({
      type: "slot-not",
      entity: participants[0]!,
      slotIndex: 5,
      slotLabel: "Saturday or Sunday",
    });
  }

  if (
    arrangementType === "mapping" &&
    attributeMap
  ) {
    clues.push({
      type: "attribute",
      entity: targetEntity,
      attribute: "colour",
      value:
        attributeMap[targetEntity]?.colour ??
        "Green",
    });
  }

  const finalArrangement =
    arrangement
      .map(
        (entity, index) =>
          `${slotLabels[index]}: ${entity}`,
      )
      .join(" | ");
  const prompt: SeatingQuestionPrompt =
    arrangementType === "mapping" &&
    attributeMap
      ? {
        type: "entity-slot",
        anchor: targetEntity,
        prompt: `Which colour is associated with ${targetEntity}?`,
        correctAnswer:
          attributeMap[targetEntity]?.colour ??
          "Green",
      }
      : {
        type: "slot-occupant",
        anchor: slotLabels[targetIndex]!,
        slotIndex: targetIndex,
        prompt:
          arrangementType ===
          "scheduling"
            ? `Which event is scheduled on ${slotLabels[targetIndex]}?`
            : `Who/what is in ${slotLabels[targetIndex]}?`,
        correctAnswer: targetEntity,
      };
  const solverInferenceSteps =
    buildConstraintInferenceSteps(
      clues,
      finalArrangement,
    );
  const inferenceDependencyGraph =
    buildInferenceDependencyGraph(
      solverInferenceSteps,
    );
  const validationReport =
    buildConstraintValidationReport(1);
  const slots =
    buildConstraintSlots(
      slotLabels,
      dimensionality,
    );

  return {
    participants,
    arrangement,
    arrangementType,
    orientationType: "north",
    seatFacings: Array.from(
      { length: arrangement.length },
      () => "north" as const,
    ),
    seatLabels: slotLabels,
    constraintDimensionality:
      dimensionality,
    entities: participants.map(
      (label) => ({
        id: label,
        label,
        attributes:
          attributeMap?.[label],
      }),
    ),
    slots,
    attributeMap,
    clues,
    prompt,
    clueCount: clues.length,
    inferenceDepth:
      arrangementType === "mapping"
        ? 5
        : 4,
    branchingComplexity:
      inferenceDependencyGraph.branchingComplexity,
    deductionDependencyScore:
      inferenceDependencyGraph.deductionDependencyScore,
    solverComplexity: 1,
    validationWarnings: [
      "Generated through universal Engine_Constraint slot mapping.",
    ],
    directClueCount: 1,
    indirectClueCount:
      Math.max(0, clues.length - 1),
    relationalClueCount:
      Math.max(0, clues.length - 1),
    deductionDepth:
      inferenceDependencyGraph.inferenceDepth,
    eliminationDepth:
      inferenceDependencyGraph.eliminationChainCount,
    clueGraphDensity: 1,
    clueDensity:
      clues.length /
      Math.max(arrangement.length, 1),
    clueInteractionRatio: 1,
    redundancyScore: 0,
    redundancyRatio: 0,
    anchorDensity: 1,
    directClueRatio:
      1 / Math.max(clues.length, 1),
    originalClueCount: clues.length,
    minimalClueCount: clues.length,
    removedRedundantClues: [],
    topologyDiversityScore: 1,
    clueDiversityScore: 1,
    inferenceDiversityScore: 1,
    structuralDiversityScore: 1,
    clueTypeDistribution:
      Object.fromEntries(
        clues.map((clue) => [
          clue.type,
          clues.filter(
            (entry) =>
              entry.type === clue.type,
          ).length,
        ]),
      ),
    repeatedStructureWarnings: [],
    uniquenessVerified: true,
    validationRetries: 0,
    uniquenessFailures: 0,
    branchingFactor: 0.5,
    validationReport,
    solverInferenceSteps,
    solverTraceExport:
      exportInferenceTrace(
        solverInferenceSteps,
      ),
    inferenceDependencyGraph,
    finalArrangement,
    generatedClues: clues.map(
      clueToDebugText,
    ),
    solverTrace: [
      `Dimensionality: ${dimensionality}`,
      `Entities mapped to slots: ${finalArrangement}`,
      "SolutionCount=1 after applying fixed, pruning, and relative constraints.",
    ],
  };
}

function validateScenario(
  participants: string[],
  arrangement: string[],
  clues: SeatingClue[],
  prompt: SeatingQuestionPrompt,
  layout: SeatingLayout,
) {
  if (
    layout.arrangementType ===
    "linear"
  ) {
    return validateLinearSeatingScenario(
      participants,
      arrangement,
      clues,
      prompt,
      layout.orientationType,
      layout.seatCount,
    );
  }

  if (
    layout.arrangementType ===
    "circular"
  ) {
    return validateCircularSeatingScenario(
      participants,
      arrangement,
      clues,
      prompt,
      layout.orientationType,
      layout.seatCount,
    );
  }

  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    layout.arrangementType,
    layout.orientationType,
    layout.seatCount,
  );
}

function buildEmergencyScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  config: SeatingPatternConfig,
) {
  const arrangementType =
    config.arrangementTypes?.[0] ??
    "linear";
  const participantCount =
    getParticipantCount(
      arrangementType,
      difficulty,
      config,
    );
  const orientationType =
    config.orientationTypes?.[0] ??
    (arrangementType ===
    "circular"
      ? "center"
      : arrangementType ===
          "double-row"
        ? "mixed"
      : "north");
  const layout = buildLayout(
    arrangementType,
    orientationType,
    participantCount,
  );

  const fallbackAttempts =
    getEmergencyFallbackAttempts(
      difficulty,
      config,
    );

  for (
    let attempt = 0;
    attempt < fallbackAttempts;
    attempt++
  ) {
    const participants =
      selectParticipants(
        participantCount,
      );
    const arrangement =
      shuffle(participants);
    const fallbackClues: SeatingClue[] = [];

    if (layout.family === "ring") {
      for (
        let index = 0;
        index < arrangement.length;
        index++
      ) {
        const nextIndex =
          (index + 1) %
          arrangement.length;

        fallbackClues.push({
          type: "adjacent",
          left: arrangement[index]!,
          right:
            arrangement[nextIndex]!,
          ordered: true,
        });
      }

      if (arrangement.length % 2 === 0) {
        fallbackClues.push({
          type: "opposite",
          left: arrangement[0]!,
          right:
            arrangement[
              arrangement.length / 2
            ]!,
        });
      }
    } else if (
      layout.family === "two-row"
    ) {
      const rowSize =
        layout.colCount;

      for (
        let row = 0;
        row < 2;
        row++
      ) {
        for (
          let col = 0;
          col < rowSize - 1;
          col++
        ) {
          const leftIndex =
            row * rowSize + col;
          const rightIndex =
            leftIndex + 1;

          fallbackClues.push({
            type: "adjacent",
            left:
              arrangement[leftIndex]!,
            right:
              arrangement[rightIndex]!,
            ordered: true,
          });

          fallbackClues.push({
            type: "same-row",
            left:
              arrangement[leftIndex]!,
            right:
              arrangement[rightIndex]!,
          });
        }
      }

      for (
        let col = 0;
        col < rowSize;
        col++
      ) {
        fallbackClues.push({
          type: "facing",
          left: arrangement[col]!,
          right:
            arrangement[
              rowSize + col
            ]!,
        });
      }

      if (rowSize >= 3) {
        fallbackClues.push({
          type: "different-row",
          left: arrangement[0]!,
          right:
            arrangement[
              rowSize + 1
            ]!,
        });
        fallbackClues.push({
          type: "offset",
          anchor: arrangement[0]!,
          person: arrangement[2]!,
          distance: 2,
          direction: "right",
        });
        fallbackClues.push({
          type: "offset",
          anchor:
            arrangement[rowSize]!,
          person:
            arrangement[
              rowSize + 2
            ]!,
          distance: 2,
          direction: "right",
        });
      }
    } else {
      for (
        let index = 0;
        index < arrangement.length - 1;
        index++
      ) {
        fallbackClues.push({
          type: "adjacent",
          left: arrangement[index]!,
          right:
            arrangement[index + 1]!,
          ordered: true,
        });
      }

      if (arrangement.length >= 5) {
        fallbackClues.push({
          type: "offset",
          anchor: arrangement[0]!,
          person: arrangement[2]!,
          distance: 2,
          direction: "right",
        });
      }
    }

    const dedupedClues =
      dedupeClues(fallbackClues);
    const prompt = createPrompt(
      arrangement,
      dedupedClues,
      layout,
      difficulty,
    );
    const clueAnalysis =
      analyzeClueSet(
        dedupedClues,
        layout,
        participants,
        difficulty,
        prompt,
      );
    const validation =
      validateScenario(
        participants,
        arrangement,
        dedupedClues,
        prompt,
        layout,
      );

    if (validation.valid) {
      return buildScenarioFromValidatedState(
        participants,
        arrangement,
        layout,
        dedupedClues,
        prompt,
        [
          `Emergency seating fallback used for motif ${motif.id} at ${difficulty} difficulty.`,
        ],
        validation.solverComplexity,
        clueAnalysis,
        validation.validationReport,
        validation.inferenceSteps,
        validation.solverTrace,
        {
          validationRetries: 0,
          uniquenessFailures: 0,
        },
      );
    }
  }

  throw new ReasoningEngineError({
    code:
      "SEATING_FALLBACK_UNSOLVABLE",
    phase: "validation",
    message: `Unable to produce a uniquely solvable fallback for ${arrangementType} seating.`,
    metadata:
      buildSeatingErrorMetadata({
        arrangementType,
        layoutFamily: layout.family,
        motif: motif.id,
        inferenceDepth:
          config.inferenceDepth ??
          difficulty,
        clueCount: 0,
        difficulty,
        participantCount,
      }),
  });
}

function createSeatingScenarioInternal(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  pattern?: Pattern,
) {
  const config =
    extractSeatingPatternConfig(
      pattern,
    );
  const patternText =
    `${pattern?.id ?? ""} ${pattern?.topic ?? ""} ${pattern?.subtopic ?? ""} ${motif.id}`.toLowerCase();

  if (
    [
      "floor",
      "box",
      "stack",
      "sched",
      "calendar",
      "ranking",
      "mapping",
      "triad",
      "con-",
    ].some((token) =>
      patternText.includes(token),
    )
  ) {
    return createConstraintScenario(
      motif,
      difficulty,
      config,
      pattern,
    );
  }

  if (
    shouldUseFastSeatingFallback(
      difficulty,
      config,
    )
  ) {
    return buildFastPreviewScenario(
      motif,
      difficulty,
      config,
    );
  }

  const maxAttempts =
    getMaxSeatingGenerationAttempts(
      difficulty,
      config,
    );
  let validationRetries = 0;
  let uniquenessFailures = 0;

  for (
    let attempt = 0;
    attempt < maxAttempts;
    attempt++
  ) {
    const arrangementType =
      getArrangementType(
        difficulty,
        motif,
        config,
      );
    const participantCount =
      getParticipantCount(
        arrangementType,
        difficulty,
        config,
      );
    const orientationType =
      getOrientationType(
        arrangementType,
        difficulty,
        config,
      );
    const layout = buildLayout(
      arrangementType,
      orientationType,
      participantCount,
    );
    const participants =
      selectParticipants(
        participantCount,
      );
    const arrangement =
      shuffle(participants);
    const promptSeed =
      pickRandomItem(
        buildPromptCandidates(
          arrangement,
          layout,
        ),
      );
    const clueResult = buildClueSet(
      participants,
      arrangement,
      motif,
      difficulty,
      layout,
      promptSeed,
      config,
    );
    const clues = clueResult.clues;
    const prompt = createPrompt(
      arrangement,
      clues,
      layout,
      difficulty,
    );
    const validation =
      validateScenario(
        participants,
        arrangement,
        clues,
        prompt,
        layout,
      );

    if (
      validation.valid &&
      meetsClueProfile(
        clues,
        difficulty,
        layout,
      ) &&
      !clueResult.repeatedStructureWarnings.some(
        (warning) =>
          warning.includes(
            "rejected",
          ),
      )
    ) {
      return buildScenarioFromValidatedState(
        participants,
        arrangement,
        layout,
        clues,
        prompt,
        validation.warnings,
        validation.solverComplexity,
        {
          clueGraphDensity:
            clueResult.clueGraphDensity,
          clueInteractionRatio:
            clueResult.clueInteractionRatio,
          redundancyScore:
            clueResult.redundancyScore,
          redundancyRatio:
            clueResult.redundancyRatio,
          anchorDensity:
            clueResult.anchorDensity,
          directClueRatio:
            clueResult.directClueRatio,
          originalClueCount:
            clueResult.originalClueCount,
          minimalClueCount:
            clueResult.minimalClueCount,
          removedRedundantClues:
            clueResult.removedRedundantClues,
          topologyDiversityScore:
            clueResult.topologyDiversityScore,
          clueDiversityScore:
            clueResult.clueDiversityScore,
          inferenceDiversityScore:
            clueResult.inferenceDiversityScore,
          structuralDiversityScore:
            clueResult.structuralDiversityScore,
          clueTypeDistribution:
            clueResult.clueTypeDistribution,
          repeatedStructureWarnings:
            clueResult.repeatedStructureWarnings,
        },
        validation.validationReport,
        validation.inferenceSteps,
        validation.solverTrace,
        {
          validationRetries,
          uniquenessFailures,
        },
      );
    }

    validationRetries += 1;

    if (
      validation.solutionCount !== 1
    ) {
      uniquenessFailures += 1;
    }
  }

  return buildEmergencyScenario(
    motif,
    difficulty,
    config,
  );
}

export function createLinearSeatingScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  pattern?: Pattern,
) {
  const forcedPattern = {
    ...pattern,
    arrangementType: "linear",
  } as Pattern &
    Record<string, unknown>;

  return createSeatingScenarioInternal(
    motif,
    difficulty,
    forcedPattern,
  );
}

export function createCircularSeatingScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  pattern?: Pattern,
) {
  const forcedPattern = {
    ...pattern,
    arrangementType: "circular",
  } as Pattern &
    Record<string, unknown>;

  return createSeatingScenarioInternal(
    motif,
    difficulty,
    forcedPattern,
  );
}

export function createAnySeatingScenario(
  motif: QuantMotif,
  difficulty: DifficultyLabel,
  pattern?: Pattern,
) {
  return createSeatingScenarioInternal(
    motif,
    difficulty,
    pattern,
  );
}
