import type {
  LinearSeatingClue,
  SeatingArrangementType,
  SeatingOrientationType,
  SeatingQuestionPrompt,
  SeatFacingDirection,
} from "./seating-engine";

type LayoutFamily =
  | "single-row"
  | "ring"
  | "two-row";

type SeatNode = {
  index: number;
  row: number;
  col: number;
  facing: SeatFacingDirection;
};

type SeatingLayout = {
  arrangementType: SeatingArrangementType;
  orientationType: SeatingOrientationType;
  family: LayoutFamily;
  seatCount: number;
  rowCount: number;
  colCount: number;
  seats: SeatNode[];
};

type SeatingValidationResult = {
  valid: boolean;
  warnings: string[];
  solutionCount: number;
  solverComplexity: number;
  solverTrace: string[];
  inferenceSteps: InferenceStep[];
  traceExport: InferenceTraceExport;
  validationReport: ValidationReport;
};

export type ValidationStage =
  | "topology"
  | "constraint-consistency"
  | "solvability"
  | "uniqueness"
  | "inference-difficulty";

export type ValidationStageResult = {
  stage: ValidationStage;
  passed: boolean;
  warnings: string[];
  diagnostics: Record<
    string,
    unknown
  >;
  metrics: Record<string, number>;
};

export type ValidationReport = {
  passed: boolean;
  stageResults: ValidationStageResult[];
  warnings: string[];
  metrics: Record<string, number>;
};

export type InferenceStep = {
  stepId: string;
  sourceConstraintIds: string[];
  deduction: string;
  eliminatedPossibilities: string[];
  resultingStateSnapshot: string;
};

export type InferenceTraceExport = {
  steps: InferenceStep[];
  text: string[];
  json: string;
};

type SeatingSolveResult = {
  solutions: string[][];
  solutionCount: number;
  rawSolutionCount: number;
  canonicalSolutions: string[];
  solverComplexity: number;
  trace: string[];
  inferenceSteps: InferenceStep[];
  traceExport: InferenceTraceExport;
};

function getClueOperator(
  clue: LinearSeatingClue,
) {
  return clue.operator ?? "EQUALS";
}

function applyClueOperator(
  clue: LinearSeatingClue,
  conditionMet: boolean,
) {
  return getClueOperator(clue) ===
    "NOT_EQUALS"
    ? !conditionMet
    : conditionMet;
}

function createMixedFacings(
  count: number,
  primary: SeatFacingDirection,
  secondary: SeatFacingDirection,
) {
  return Array.from(
    { length: count },
    (_value, index) =>
      index % 2 === 0
        ? primary
        : secondary,
  );
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
    }),
  );
}

function createRingSeats(
  seatCount: number,
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

  return Array.from(
    { length: seatCount },
    (_value, index) => ({
      index,
      row: 0,
      col: index,
      facing: facings[index]!,
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

function evaluateClueCondition(
  arrangement: string[],
  clue: LinearSeatingClue,
  layout: SeatingLayout,
) {
  switch (clue.type) {
    case "absolute":
      return (
        arrangement[clue.index] ===
        clue.person
      );
    case "end":
      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      return clue.side === "left"
        ? arrangement[0] === clue.person
        : arrangement[
            arrangement.length - 1
          ] === clue.person;
    case "adjacent": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      if (clue.ordered) {
        return (
          getRelativeIndex(
            leftIndex,
            "right",
            1,
            layout,
          ) === rightIndex
        );
      }

      return areAdjacent(
        leftIndex,
        rightIndex,
        layout,
      );
    }
    case "not-adjacent": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return !areAdjacent(
        leftIndex,
        rightIndex,
        layout,
      );
    }
    case "offset": {
      const anchorIndex =
        arrangement.indexOf(
          clue.anchor,
        );
      const personIndex =
        arrangement.indexOf(
          clue.person,
        );

      return (
        getRelativeIndex(
          anchorIndex,
          clue.direction,
          clue.distance,
          layout,
        ) === personIndex
      );
    }
    case "distance-gap": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      if (layout.family === "ring") {
        return (
          getCircularDistance(
            leftIndex,
            rightIndex,
            layout,
          ) === clue.gap + 1
        );
      }

      if (
        !sameRow(
          leftIndex,
          rightIndex,
          layout,
        )
      ) {
        return false;
      }

      return (
        Math.abs(
          getSeat(layout, leftIndex)
            .col -
            getSeat(
              layout,
              rightIndex,
            ).col,
        ) === clue.gap + 1
      );
    }
    case "between":
    case "adjacent-both": {
      const middleIndex =
        arrangement.indexOf(
          clue.middle,
        );
      const firstIndex =
        arrangement.indexOf(clue.first);
      const secondIndex =
        arrangement.indexOf(clue.second);

      return (
        areAdjacent(
          middleIndex,
          firstIndex,
          layout,
        ) &&
        areAdjacent(
          middleIndex,
          secondIndex,
          layout,
        ) &&
        firstIndex !== secondIndex
      );
    }
    case "not-end": {
      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      const personIndex =
        arrangement.indexOf(clue.person);

      return (
        personIndex > 0 &&
        personIndex <
          arrangement.length - 1
      );
    }
    case "opposite": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) === rightIndex
      );
    }
    case "not-opposite": {
      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) !== rightIndex
      );
    }
    case "same-row": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      return sameRow(
        arrangement.indexOf(clue.left),
        arrangement.indexOf(
          clue.right,
        ),
        layout,
      );
    }
    case "different-row": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      return !sameRow(
        arrangement.indexOf(clue.left),
        arrangement.indexOf(
          clue.right,
        ),
        layout,
      );
    }
    case "facing": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) === rightIndex
      );
    }
    case "not-facing": {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      const leftIndex =
        arrangement.indexOf(clue.left);
      const rightIndex =
        arrangement.indexOf(clue.right);

      return (
        getOppositeIndex(
          leftIndex,
          layout,
        ) !== rightIndex
      );
    }
    default:
      return false;
  }
}

function matchesClue(
  arrangement: string[],
  clue: LinearSeatingClue,
  layout: SeatingLayout,
) {
  return applyClueOperator(
    clue,
    evaluateClueCondition(
      arrangement,
      clue,
      layout,
    ),
  );
}

function getClueWeight(
  clue: LinearSeatingClue,
) {
  return (
    clue.weight ??
    (getClueOperator(clue) ===
    "NOT_EQUALS"
      ? 2.5
      : 1)
  );
}

function getClueId(
  clue: LinearSeatingClue,
  index: number,
) {
  return `clue-${index + 1}:${clue.type}`;
}

function formatArrangementSnapshot(
  assignment: Map<string, number>,
  seatCount: number,
) {
  const seats = Array.from(
    { length: seatCount },
    () => "?",
  );

  for (const [
    person,
    seatIndex,
  ] of assignment.entries()) {
    seats[seatIndex] = person;
  }

  return seats.join(" | ");
}

function summarizeArrangement(
  arrangement: string[],
) {
  return arrangement.join(" | ");
}

function buildInferenceTraceExport(
  steps: InferenceStep[],
): InferenceTraceExport {
  const text = steps.map(
    (step) =>
      `${step.stepId}: ${step.deduction} -> ${step.resultingStateSnapshot}`,
  );

  return {
    steps,
    text,
    json: JSON.stringify(
      steps,
      null,
      2,
    ),
  };
}

export function exportInferenceTrace(
  steps: InferenceStep[],
) {
  return buildInferenceTraceExport(
    steps,
  );
}

function buildStageResult(
  stage: ValidationStage,
  passed: boolean,
  warnings: string[],
  diagnostics: Record<
    string,
    unknown
  >,
  metrics: Record<string, number>,
): ValidationStageResult {
  return {
    stage,
    passed,
    warnings,
    diagnostics,
    metrics,
  };
}

function countDistinctClueTypes(
  clues: LinearSeatingClue[],
) {
  return new Set(
    clues.map((clue) => clue.type),
  ).size;
}

function mirrorArrangement(
  arrangement: string[],
  layout: SeatingLayout,
) {
  if (layout.family === "single-row") {
    return [...arrangement].reverse();
  }

  if (layout.family === "ring") {
    if (arrangement.length <= 1) {
      return [...arrangement];
    }

    return [
      arrangement[0]!,
      ...arrangement.slice(1).reverse(),
    ];
  }

  const mirrored = Array.from(
    { length: arrangement.length },
    () => "",
  );

  for (const seat of layout.seats) {
    const targetCol =
      layout.colCount - 1 - seat.col;
    const targetSeat = layout.seats.find(
      (candidate) =>
        candidate.row === seat.row &&
        candidate.col === targetCol,
    );

    if (targetSeat) {
      mirrored[targetSeat.index] =
        arrangement[seat.index]!;
    }
  }

  return mirrored;
}

function serializeArrangement(
  arrangement: string[],
) {
  return arrangement.join("|");
}

function canonicalizeArrangement(
  arrangement: string[],
  layout: SeatingLayout,
) {
  const serialized =
    serializeArrangement(arrangement);
  const mirrored =
    serializeArrangement(
      mirrorArrangement(
        arrangement,
        layout,
      ),
    );

  return serialized < mirrored
    ? serialized
    : mirrored;
}

function buildValidationReport(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt: SeatingQuestionPrompt | undefined,
  layout: SeatingLayout,
): SeatingValidationResult {
  const stageResults: ValidationStageResult[] =
    [];
  const warnings: string[] = [];

  const topologyWarnings: string[] =
    [];
  const uniqueParticipants =
    new Set(participants);
  const uniqueArrangement =
    new Set(arrangement);
  const participantCoverage =
    participants.filter((person) =>
      arrangement.includes(person),
    ).length;

  if (
    uniqueParticipants.size !==
    participants.length
  ) {
    topologyWarnings.push(
      "Participant list contained duplicate names.",
    );
  }

  if (
    arrangement.length !==
    layout.seatCount
  ) {
    topologyWarnings.push(
      "Arrangement length did not match seat count.",
    );
  }

  if (
    uniqueArrangement.size !==
    arrangement.length
  ) {
    topologyWarnings.push(
      "Arrangement contained duplicate seat assignments.",
    );
  }

  if (
    participantCoverage !==
    participants.length
  ) {
    topologyWarnings.push(
      "Arrangement did not cover the full participant set.",
    );
  }

  const topologyMetrics = {
    participantCount:
      participants.length,
    seatCount:
      layout.seatCount,
    arrangementSize:
      arrangement.length,
    duplicateParticipantCount:
      participants.length -
      uniqueParticipants.size,
    duplicateSeatAssignments:
      arrangement.length -
      uniqueArrangement.size,
    participantCoverage,
  };

  stageResults.push(
    buildStageResult(
      "topology",
      topologyWarnings.length === 0,
      topologyWarnings,
      {
        layoutFamily:
          layout.family,
        arrangementType:
          layout.arrangementType,
        orientationType:
          layout.orientationType,
      },
      topologyMetrics,
    ),
  );
  warnings.push(...topologyWarnings);

  const constraintWarnings: string[] =
    [];
  const failedClues = clues
    .map((clue, index) => ({
      clue,
      index,
      satisfied: matchesClue(
        arrangement,
        clue,
        layout,
      ),
    }))
    .filter(
      (entry) => !entry.satisfied,
    );

  if (failedClues.length > 0) {
    constraintWarnings.push(
      "One or more clues contradicted the target arrangement.",
    );
  }

  stageResults.push(
    buildStageResult(
      "constraint-consistency",
      constraintWarnings.length === 0,
      constraintWarnings,
      {
        failedClueIndexes:
          failedClues.map(
            (entry) => entry.index,
          ),
        failedClueTypes:
          failedClues.map(
            (entry) =>
              entry.clue.type,
          ),
      },
      {
        clueCount: clues.length,
        failedClueCount:
          failedClues.length,
      },
    ),
  );
  warnings.push(...constraintWarnings);

  const solveResult =
    solveSeating(
      participants,
      clues,
      layout.arrangementType,
      layout.orientationType,
      layout.seatCount,
    );

  const solvabilityWarnings: string[] =
    [];

  if (solveResult.solutionCount === 0) {
    solvabilityWarnings.push(
      "No valid seating arrangement satisfied the clue set.",
    );
  }

  stageResults.push(
    buildStageResult(
      "solvability",
      solvabilityWarnings.length === 0,
      solvabilityWarnings,
      {
        tracePreview:
          solveResult.trace.slice(
            0,
            3,
          ),
      },
      {
        solutionCount:
          solveResult.solutionCount,
        rawSolutionCount:
          solveResult.rawSolutionCount,
        mirrorEquivalentSolutions:
          solveResult.rawSolutionCount -
          solveResult.solutionCount,
        solverComplexity:
          solveResult.solverComplexity,
      },
    ),
  );
  warnings.push(...solvabilityWarnings);

  const uniquenessWarnings: string[] =
    [];

  if (solveResult.solutionCount > 1) {
    uniquenessWarnings.push(
      "Clue set produced multiple valid arrangements.",
    );
  }

  if (
    prompt &&
    isPromptDirectlyAnsweredByClue(
      prompt,
      clues,
      layout.arrangementType,
      layout.orientationType,
      layout.seatCount,
    )
  ) {
    uniquenessWarnings.push(
      "Prompt answer was directly revealed by a clue.",
    );
  }

  stageResults.push(
    buildStageResult(
      "uniqueness",
      uniquenessWarnings.length === 0,
      uniquenessWarnings,
      {
        promptType:
          prompt?.type,
      },
      {
        solutionCount:
          solveResult.solutionCount,
        rawSolutionCount:
          solveResult.rawSolutionCount,
        promptDirectReveal:
          uniquenessWarnings.some(
            (warning) =>
              warning.includes(
                "directly revealed",
              ),
          )
            ? 1
            : 0,
      },
    ),
  );
  warnings.push(...uniquenessWarnings);

  const clueWeightTotal = clues.reduce(
    (sum, clue) =>
      sum + getClueWeight(clue),
    0,
  );
  const negativeClueCount =
    clues.filter(
      (clue) =>
        getClueOperator(clue) ===
        "NOT_EQUALS",
    ).length;
  const difficultyWarnings: string[] =
    [];

  if (
    clues.length > 0 &&
    clueWeightTotal / clues.length <
      1.25
  ) {
    difficultyWarnings.push(
      "Clue set is heavily direct and may be low on elimination depth.",
    );
  }

  stageResults.push(
    buildStageResult(
      "inference-difficulty",
      difficultyWarnings.length === 0,
      difficultyWarnings,
      {
        dominantClueTypes: [
          ...new Set(
            clues.map(
              (clue) => clue.type,
            ),
          ),
        ].slice(0, 5),
      },
      {
        clueCount: clues.length,
        clueWeightTotal,
        averageClueWeight:
          clues.length > 0
            ? clueWeightTotal /
              clues.length
            : 0,
        negativeClueCount,
        distinctClueTypes:
          countDistinctClueTypes(
            clues,
          ),
      },
    ),
  );
  warnings.push(...difficultyWarnings);

  const metrics = stageResults.reduce<
    Record<string, number>
  >((accumulator, stageResult) => {
    for (const [
      key,
      value,
    ] of Object.entries(
      stageResult.metrics,
    )) {
      accumulator[
        `${stageResult.stage}.${key}`
      ] = value;
    }

    return accumulator;
  }, {});

  const validationReport: ValidationReport =
    {
      passed:
        stageResults.every(
          (stageResult) =>
            stageResult.passed,
        ),
      stageResults,
      warnings,
      metrics,
    };

  return {
    valid:
      validationReport.passed,
    warnings,
    solutionCount:
      solveResult.solutionCount,
    solverComplexity:
      solveResult.solverComplexity,
    solverTrace:
      solveResult.trace,
    inferenceSteps:
      solveResult.inferenceSteps,
    traceExport:
      solveResult.traceExport,
    validationReport,
  };
}

export function isPromptDirectlyAnsweredByClue(
  prompt: SeatingQuestionPrompt,
  clues: LinearSeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
) {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount,
  );

  return clues.some((clue) => {
    if (
      prompt.type ===
        "neighbor-left" ||
      prompt.type ===
        "neighbor-right"
    ) {
      return (
        clue.type === "adjacent" &&
        clue.ordered &&
        ((prompt.type ===
          "neighbor-right" &&
          clue.left ===
            prompt.anchor &&
          clue.right ===
            prompt.correctAnswer) ||
          (prompt.type ===
            "neighbor-left" &&
            clue.right ===
              prompt.anchor &&
            clue.left ===
              prompt.correctAnswer))
      );
    }

    if (prompt.type === "relative") {
      return (
        clue.type === "offset" &&
        clue.anchor === prompt.anchor &&
        clue.distance ===
          prompt.distance &&
        clue.direction ===
          prompt.direction &&
        clue.person ===
          prompt.correctAnswer
      );
    }

    if (prompt.type === "opposite") {
      return (
        clue.type === "opposite" &&
        ((clue.left ===
          prompt.anchor &&
          clue.right ===
            prompt.correctAnswer) ||
          (clue.right ===
            prompt.anchor &&
            clue.left ===
              prompt.correctAnswer))
      );
    }

    if (prompt.type === "facing") {
      if (
        layout.family !== "two-row"
      ) {
        return false;
      }

      return (
        clue.type === "facing" &&
        ((clue.left ===
          prompt.anchor &&
          clue.right ===
            prompt.correctAnswer) ||
          (clue.right ===
            prompt.anchor &&
            clue.left ===
              prompt.correctAnswer))
      );
    }

    return false;
  });
}

function evaluatePartialClueCondition(
  clue: LinearSeatingClue,
  assignment: Map<string, number>,
  layout: SeatingLayout,
) : boolean | undefined {
  const getIndex = (name: string) =>
    assignment.get(name);

  switch (clue.type) {
    case "absolute": {
      const index = getIndex(
        clue.person,
      );

      return index === undefined
        ? undefined
        : index === clue.index;
    }
    case "end": {
      const index = getIndex(
        clue.person,
      );

      if (index === undefined) {
        return undefined;
      }

      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      return clue.side === "left"
        ? index === 0
        : index ===
            layout.seatCount - 1;
    }
    case "not-end": {
      const index = getIndex(
        clue.person,
      );

      if (index === undefined) {
        return undefined;
      }

      if (
        layout.family !== "single-row"
      ) {
        return false;
      }

      return (
        index > 0 &&
        index < layout.seatCount - 1
      );
    }
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite": {
      const leftIndex = getIndex(
        clue.left,
      );
      const rightIndex = getIndex(
        clue.right,
      );

      if (
        leftIndex === undefined ||
        rightIndex === undefined
      ) {
        return undefined;
      }

      return matchesClue(
        Array.from(
          { length: layout.seatCount },
          () => "",
        ).map(
          (_value, index) =>
            [...assignment.entries()].find(
              (entry) =>
                entry[1] === index,
            )?.[0] ?? "",
        ),
        clue,
        layout,
      );
    }
    case "offset": {
      const anchorIndex = getIndex(
        clue.anchor,
      );
      const personIndex = getIndex(
        clue.person,
      );

      if (
        anchorIndex === undefined ||
        personIndex === undefined
      ) {
        return undefined;
      }

      return (
        getRelativeIndex(
          anchorIndex,
          clue.direction,
          clue.distance,
          layout,
        ) === personIndex
      );
    }
    case "between":
    case "adjacent-both": {
      const middleIndex = getIndex(
        clue.middle,
      );
      const firstIndex = getIndex(
        clue.first,
      );
      const secondIndex = getIndex(
        clue.second,
      );

      if (
        middleIndex === undefined ||
        firstIndex === undefined ||
        secondIndex === undefined
      ) {
        return undefined;
      }

      return (
        areAdjacent(
          middleIndex,
          firstIndex,
          layout,
        ) &&
        areAdjacent(
          middleIndex,
          secondIndex,
          layout,
        )
      );
    }
    default:
      return undefined;
  }
}

function partialCluePossible(
  clue: LinearSeatingClue,
  assignment: Map<string, number>,
  layout: SeatingLayout,
) {
  const condition =
    evaluatePartialClueCondition(
      clue,
      assignment,
      layout,
    );

  if (condition === undefined) {
    return true;
  }

  return applyClueOperator(
    clue,
    condition,
  );
}

function solveSeating(
  participants: string[],
  clues: LinearSeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
): SeatingSolveResult {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount,
  );
  const solutions: string[][] = [];
  const canonicalSolutions =
    new Set<string>();
  const inferenceSteps: InferenceStep[] =
    [];
  let evaluated = 0;
  let stepCounter = 0;
  const assignment = new Map<
    string,
    number
  >();
  const usedSeats =
    new Set<number>();

  const remainingPeople = [
    ...participants,
  ];

  if (layout.family === "ring") {
    assignment.set(
      participants[0]!,
      0,
    );
    usedSeats.add(0);
    remainingPeople.shift();
    stepCounter += 1;
    inferenceSteps.push({
      stepId: `step-${stepCounter}`,
      sourceConstraintIds: [],
      deduction: `Anchored ${participants[0]!} at seat 1 to remove rotational symmetry.`,
      eliminatedPossibilities: [
        `${participants[0]!} != seats 2-${seatCount}`,
      ],
      resultingStateSnapshot:
        formatArrangementSnapshot(
          assignment,
          seatCount,
        ),
    });
  }

  function backtrack(
    personIndex: number,
  ) {
    if (canonicalSolutions.size > 1) {
      return;
    }

    if (
      personIndex >=
      remainingPeople.length
    ) {
      evaluated += 1;
      const arrangement =
        Array.from(
          { length: seatCount },
          () => "",
        );

      for (const [
        person,
        seatIndex,
      ] of assignment.entries()) {
        arrangement[seatIndex] =
          person;
      }

      if (
        clues.every((clue) =>
          matchesClue(
            arrangement,
            clue,
            layout,
          ),
        )
      ) {
        const canonical =
          canonicalizeArrangement(
            arrangement,
            layout,
          );
        const isNewCanonical =
          !canonicalSolutions.has(
            canonical,
          );

        canonicalSolutions.add(
          canonical,
        );
        solutions.push(arrangement);
        stepCounter += 1;
        inferenceSteps.push({
          stepId: `step-${stepCounter}`,
          sourceConstraintIds:
            clues.map(
              getClueId,
            ),
          deduction: isNewCanonical
            ? `Accepted canonical arrangement ${canonicalSolutions.size} after all active constraints were satisfied.`
            : "Accepted a mirror-equivalent arrangement and normalized it to the existing logical solution.",
          eliminatedPossibilities:
            [],
          resultingStateSnapshot:
            summarizeArrangement(
              arrangement,
            ),
        });
      }

      return;
    }

    const person =
      remainingPeople[
        personIndex
      ]!;

    for (
      let seat = 0;
      seat < seatCount;
      seat++
    ) {
      if (usedSeats.has(seat)) {
        continue;
      }

      assignment.set(person, seat);
      usedSeats.add(seat);
      stepCounter += 1;
      inferenceSteps.push({
        stepId: `step-${stepCounter}`,
        sourceConstraintIds: [],
        deduction: `Branching on ${person} at seat ${seat + 1}.`,
        eliminatedPossibilities: [],
        resultingStateSnapshot:
          formatArrangementSnapshot(
            assignment,
            seatCount,
          ),
      });

      const clueEvaluations = clues.map(
        (clue, clueIndex) => ({
          clue,
          clueIndex,
          condition:
            evaluatePartialClueCondition(
              clue,
              assignment,
              layout,
            ),
        }),
      );
      const blockingClues =
        clueEvaluations.filter(
          (entry) =>
            entry.condition !==
              undefined &&
            !applyClueOperator(
              entry.clue,
              entry.condition,
            ),
        );

      if (
        blockingClues.length === 0
      ) {
        const propagatedClues =
          clueEvaluations.filter(
            (entry) =>
              entry.condition === true,
          );

        if (
          propagatedClues.length > 0
        ) {
          stepCounter += 1;
          inferenceSteps.push({
            stepId: `step-${stepCounter}`,
            sourceConstraintIds:
              propagatedClues.map(
                (entry) =>
                  getClueId(
                    entry.clue,
                    entry.clueIndex,
                  ),
              ),
            deduction: `Propagated ${propagatedClues.length} satisfied partial deduction${propagatedClues.length === 1 ? "" : "s"} from the current branch.`,
            eliminatedPossibilities:
              [],
            resultingStateSnapshot:
              formatArrangementSnapshot(
                assignment,
                seatCount,
              ),
          });
        }

        backtrack(personIndex + 1);
      } else {
        stepCounter += 1;
        inferenceSteps.push({
          stepId: `step-${stepCounter}`,
          sourceConstraintIds:
            blockingClues.map(
              (entry) =>
                getClueId(
                  entry.clue,
                  entry.clueIndex,
                ),
            ),
          deduction: `Detected contradiction for ${person} at seat ${seat + 1}; pruning the branch.`,
          eliminatedPossibilities: [
            `${person} != seat ${seat + 1}`,
            ...blockingClues.map(
              (entry) =>
                `${entry.clue.type} invalidated this partial state`,
            ),
          ],
          resultingStateSnapshot:
            formatArrangementSnapshot(
              assignment,
              seatCount,
            ),
        });
      }

      usedSeats.delete(seat);
      assignment.delete(person);

      if (
        canonicalSolutions.size > 1
      ) {
        break;
      }
    }
  }

  backtrack(0);

  const traceExport =
    buildInferenceTraceExport(
      inferenceSteps,
    );

  return {
    solutions,
    solutionCount:
      canonicalSolutions.size,
    rawSolutionCount:
      solutions.length,
    canonicalSolutions: [
      ...canonicalSolutions,
    ],
    solverComplexity: evaluated,
    trace: traceExport.text,
    inferenceSteps,
    traceExport,
  };
}

export function solveSeatingArrangement(
  participants: string[],
  clues: LinearSeatingClue[],
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
) {
  return solveSeating(
    participants,
    clues,
    arrangementType,
    orientationType,
    seatCount,
  );
}

export function solveLinearSeating(
  participants: string[],
  clues: LinearSeatingClue[],
  orientationType: SeatingOrientationType = "north",
  seatCount = participants.length,
) {
  return solveSeating(
    participants,
    clues,
    "linear",
    orientationType,
    seatCount,
  );
}

export function solveCircularSeating(
  participants: string[],
  clues: LinearSeatingClue[],
  orientationType: SeatingOrientationType = "center",
  seatCount = participants.length,
) {
  return solveSeating(
    participants,
    clues,
    "circular",
    orientationType,
    seatCount,
  );
}

export function validateSeatingScenario(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt: SeatingQuestionPrompt | undefined,
  arrangementType: SeatingArrangementType,
  orientationType: SeatingOrientationType,
  seatCount: number,
): SeatingValidationResult {
  const layout = buildLayout(
    arrangementType,
    orientationType,
    seatCount,
  );

  return buildValidationReport(
    participants,
    arrangement,
    clues,
    prompt,
    layout,
  );
}

export function validateLinearSeatingScenario(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt?: SeatingQuestionPrompt,
  orientationType: SeatingOrientationType = "north",
  seatCount = participants.length,
) {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "linear",
    orientationType,
    seatCount,
  );
}

export function validateCircularSeatingScenario(
  participants: string[],
  arrangement: string[],
  clues: LinearSeatingClue[],
  prompt?: SeatingQuestionPrompt,
  orientationType: SeatingOrientationType = "center",
  seatCount = participants.length,
) {
  return validateSeatingScenario(
    participants,
    arrangement,
    clues,
    prompt,
    "circular",
    orientationType,
    seatCount,
  );
}
