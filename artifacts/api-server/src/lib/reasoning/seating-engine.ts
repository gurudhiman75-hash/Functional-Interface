import type {
  DifficultyLabel,
  Pattern,
} from "../core/generator-engine";
import type { QuantMotif } from "../motifs/types";
import {
  pickRandomItem,
  shuffle,
} from "../shared";
import {
  isPromptDirectlyAnsweredByClue,
  solveCircularSeating,
  solveLinearSeating,
  solveSeatingArrangement,
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

export type SeatingArrangementType =
  | "linear"
  | "circular"
  | "square"
  | "rectangular"
  | "double-row"
  | "parallel-row";

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

type LayoutFamily =
  | "single-row"
  | "ring"
  | "two-row";

type SeatNode = {
  index: number;
  row: number;
  col: number;
  facing: SeatFacingDirection;
  label: string;
};

export type SeatingClue =
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
  };

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
  };

export type SeatingScenario = {
  participants: string[];
  arrangement: string[];
  arrangementType: SeatingArrangementType;
  orientationType: SeatingOrientationType;
  seatFacings: SeatFacingDirection[];
  seatLabels: string[];
  clues: SeatingClue[];
  prompt: SeatingQuestionPrompt;
  clueCount: number;
  inferenceDepth: number;
  solverComplexity: number;
  validationWarnings: string[];
  directClueCount: number;
  indirectClueCount: number;
  relationalClueCount: number;
  deductionDepth: number;
  eliminationDepth: number;
  clueGraphDensity: number;
  clueInteractionRatio: number;
  redundancyScore: number;
  structuralDiversityScore: number;
  clueTypeDistribution: Record<string, number>;
  repeatedStructureWarnings: string[];
  uniquenessVerified: boolean;
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
    | "clueInteractionRatio"
    | "redundancyScore"
    | "structuralDiversityScore"
    | "clueTypeDistribution"
    | "repeatedStructureWarnings"
  >;

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
        ? 5 + Math.round(Math.random())
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
  if (layout.family === "ring") {
    if (
      layout.seatCount % 2 !== 0
    ) {
      return undefined;
    }

    return (
      index + layout.seatCount / 2
    ) % layout.seatCount;
  }

  if (layout.family === "two-row") {
    const seat = getSeat(
      layout,
      index,
    );

    return (
      (1 - seat.row) *
        layout.colCount +
      seat.col
    );
  }

  return undefined;
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

function getDirectClueLimit(
  difficulty: DifficultyLabel,
) {
  return difficulty === "Easy"
    ? 1
    : 0;
}

function getMinimumRelationalClues(
  difficulty: DifficultyLabel,
  layout: SeatingLayout,
) {
  if (difficulty === "Hard") {
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
    return layout.family === "two-row"
      ? [6, 8]
      : [6, 8];
  }

  return layout.family === "two-row"
    ? [5, 7]
    : [5, 6];
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
      switch (clue.type) {
        case "adjacent":
          return sum +
            (clue.ordered ? 1 : 2);
        case "offset":
          return sum +
            (clue.distance >= 3
              ? 3
              : 2);
        case "distance-gap":
        case "between":
        case "adjacent-both":
        case "same-row":
        case "facing":
        case "opposite":
          return sum + 2;
        case "not-adjacent":
        case "not-opposite":
        case "not-end":
        case "different-row":
        case "not-facing":
          return sum + 1;
        default:
          return sum;
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
    getTargetClueRange(
      difficulty,
      layout,
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
      graphAnalysis.topologySignature,
    );
  const repeatedStructureWarnings =
    getRepeatedStructureWarnings(
      graphAnalysis.topologySignature,
      graphAnalysis.repeatedAdjacencySerialization,
    );

  recordStructuralSignature(
    graphAnalysis.topologySignature,
  );

  return {
    clueGraphDensity:
      graphAnalysis.density,
    clueInteractionRatio:
      graphAnalysis.interactionRatio,
    redundancyScore:
      redundancy.redundancyScore,
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
) {
  const promptCandidates =
    buildPromptCandidates(
      arrangement,
      layout,
    ).filter(
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
    buildPromptCandidates(
      arrangement,
      layout,
    )[0]!
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
  switch (clue.type) {
    case "absolute":
      return `${clue.person} at seat ${clue.index + 1}`;
    case "end":
      return `${clue.person} at ${clue.side} end`;
    case "adjacent":
      return clue.ordered
        ? `${clue.left} immediately left of ${clue.right}`
        : `${clue.left} adjacent to ${clue.right}`;
    case "not-adjacent":
      return `${clue.left} not adjacent to ${clue.right}`;
    case "offset":
      return `${clue.person} ${clue.distance} ${clue.direction} of ${clue.anchor}`;
    case "distance-gap":
      return `${clue.gap} gap between ${clue.left} and ${clue.right}`;
    case "between":
      return `${clue.middle} between ${clue.first} and ${clue.second}`;
    case "adjacent-both":
      return `${clue.middle} adjacent to both ${clue.first} and ${clue.second}`;
    case "not-end":
      return `${clue.person} not at end`;
    case "opposite":
      return `${clue.left} opposite ${clue.right}`;
    case "not-opposite":
      return `${clue.left} not opposite ${clue.right}`;
    case "same-row":
      return `${clue.left} same row as ${clue.right}`;
    case "different-row":
      return `${clue.left} different row from ${clue.right}`;
    case "facing":
      return `${clue.left} faces ${clue.right}`;
    case "not-facing":
      return `${clue.left} does not face ${clue.right}`;
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
) {
  const directClueCount =
    getDirectClueCount(clues);
  const relationalClueCount =
    getRelationalClueCount(clues);
  const deductionDepth = Math.max(
    3,
    getDeductionDepth(clues),
  );
  const eliminationDepth =
    getEliminationDepth(clues);

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
        clues.length +
          relationalClueCount -
          directClueCount,
        10,
      ),
    ),
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
    clueInteractionRatio:
      clueAnalysis.clueInteractionRatio,
    redundancyScore:
      clueAnalysis.redundancyScore,
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
    finalArrangement:
      formatFinalArrangement(
        arrangement,
        layout,
      ),
    generatedClues: clues.map(
      clueToDebugText,
    ),
    solverTrace: buildSolverTrace(
      clues,
      layout,
    ),
  } satisfies SeatingScenario;
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

  for (let attempt = 0; attempt < 120; attempt++) {
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
      );
    }
  }

  throw new Error(
    `Unable to produce a uniquely solvable fallback for ${arrangementType} seating.`,
  );
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
  const maxAttempts = 450;

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
          structuralDiversityScore:
            clueResult.structuralDiversityScore,
          clueTypeDistribution:
            clueResult.clueTypeDistribution,
          repeatedStructureWarnings:
            clueResult.repeatedStructureWarnings,
        },
      );
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
