import type {
  LayoutManifest,
  SeatingDiagramData,
} from "@workspace/api-zod";
import type {
  SeatingQuestionPrompt,
  SeatingScenario,
} from "./seating-engine";

function getQuestionTarget(
  prompt: SeatingQuestionPrompt,
) {
  if (
    prompt.type === "slot-occupant" ||
    prompt.type === "entity-slot"
  ) {
    return {
      label: prompt.anchor,
      promptType: prompt.type,
      answerLabel: prompt.correctAnswer,
    };
  }

  return {
    label: prompt.anchor,
    promptType: prompt.type,
    answerLabel: prompt.correctAnswer,
  };
}

export function buildSeatingDiagramData(
  scenario: SeatingScenario,
): SeatingDiagramData {
  const questionTarget =
    getQuestionTarget(
      scenario.prompt,
    );

  const isTwoRow =
    scenario.arrangementType ===
      "double-row" ||
    scenario.arrangementType ===
      "parallel-row";
  const isVertical =
    scenario.constraintDimensionality ===
    "vertical";
  const isCalendar =
    scenario.constraintDimensionality ===
    "temporal";

  const legacySeats =
    scenario.arrangement.map(
      (label, position) => {
        const entityAttributes =
          scenario.attributeMap?.[label];

        return {
          label,
          position,
          facing:
            scenario.seatFacings[
              position
            ]!,
          highlighted:
            label ===
            questionTarget.label,
          isAnswer:
            label ===
            questionTarget.answerLabel,
          row:
            isVertical
              ? scenario.arrangement.length -
                position -
                1
              : isTwoRow
              ? Math.floor(
                  position /
                    (scenario.arrangement
                      .length / 2),
                )
              : 0,
          col:
            isVertical
              ? 0
              : isTwoRow
              ? position %
                (scenario.arrangement
                  .length / 2)
              : position,
          seatLabel:
            scenario.seatLabels[
              position
            ],
          secondaryLabel:
            entityAttributes
              ? Object.values(
                  entityAttributes,
                )[0]
              : undefined,
        };
      },
    );
  const rowCount =
    isVertical
      ? scenario.arrangement.length
      : isTwoRow
      ? 2
      : 1;
  const colCount =
    isVertical
      ? 1
      : isCalendar
        ? scenario.arrangement.length
        : isTwoRow
      ? scenario.arrangement.length / 2
      : scenario.arrangement.length;
  const manifest =
    buildLayoutManifest(
      scenario,
      legacySeats,
      rowCount,
      colCount,
    );

  return {
    arrangementType:
      scenario.arrangementType,
    orientationType:
      scenario.orientationType,
    seats: legacySeats,
    seatLabels:
      scenario.seatLabels,
    questionTarget,
    rowCount,
    colCount,
    layoutManifest: manifest,
  };
}

type LegacySeat = SeatingDiagramData["seats"][number] & {
  secondaryLabel?: string;
};

function getManifestType(
  scenario: SeatingScenario,
): LayoutManifest["type"] {
  if (
    scenario.arrangementType ===
      "circular" ||
    scenario.arrangementType ===
      "square" ||
    scenario.arrangementType ===
      "rectangular"
  ) {
    return "RING";
  }

  if (
    scenario.arrangementType ===
      "double-row" ||
    scenario.arrangementType ===
      "parallel-row"
  ) {
    return "PARALLEL";
  }

  if (
    scenario.constraintDimensionality ===
      "vertical" ||
    scenario.arrangementType ===
      "floor" ||
    scenario.arrangementType ===
      "box-stack"
  ) {
    return "STACK";
  }

  if (
    scenario.constraintDimensionality ===
      "matrix" ||
    scenario.arrangementType ===
      "mapping"
  ) {
    return "GRID";
  }

  return "LINEAR";
}

function normalizeFacing(
  facing: string | undefined,
) {
  if (facing === "center") {
    return "IN" as const;
  }
  if (facing === "outward") {
    return "OUT" as const;
  }
  if (facing === "south") {
    return "SOUTH" as const;
  }
  return "NORTH" as const;
}

function coordinateForSlot(
  manifestType: LayoutManifest["type"],
  seat: LegacySeat,
  index: number,
  count: number,
  dimensions: {
    rows: number;
    cols: number;
  },
) {
  if (manifestType === "RING") {
    const angle =
      -Math.PI / 2 +
      (index / Math.max(count, 1)) *
        Math.PI *
        2;

    return {
      x:
        50 +
        Math.cos(angle) * 36,
      y:
        50 +
        Math.sin(angle) * 32,
    };
  }

  if (manifestType === "STACK") {
    return {
      x: 50,
      y:
        12 +
        ((count - index - 1) /
          Math.max(count - 1, 1)) *
          76,
    };
  }

  if (manifestType === "PARALLEL") {
    return {
      x:
        12 +
        ((seat.col ?? index) /
          Math.max(
            dimensions.cols - 1,
            1,
          )) *
          76,
      y:
        28 +
        (seat.row ?? 0) * 34,
    };
  }

  if (manifestType === "GRID") {
    return {
      x:
        16 +
        ((seat.col ?? index) /
          Math.max(
            dimensions.cols - 1,
            1,
          )) *
          68,
      y:
        20 +
        ((seat.row ?? 0) /
          Math.max(
            dimensions.rows - 1,
            1,
          )) *
          60,
    };
  }

  return {
    x:
      10 +
      (index / Math.max(count - 1, 1)) *
        80,
    y: 50,
  };
}

function buildLayoutManifest(
  scenario: SeatingScenario,
  seats: LegacySeat[],
  rows: number,
  cols: number,
): LayoutManifest {
  const type = getManifestType(scenario);
  const dimensions = { rows, cols };
  const slots = seats.map((seat, index) => {
    const attributes =
      scenario.attributeMap?.[
        seat.label
      ];
    const attributeValues =
      attributes
        ? Object.values(attributes)
        : [];
    const coordinates =
      coordinateForSlot(
        type,
        seat,
        index,
        seats.length,
        dimensions,
      );

    return {
      id: index,
      coordinates,
      facing: normalizeFacing(
        seat.facing,
      ),
      data: {
        primaryLabel: seat.label,
        secondaryLabel:
          attributeValues[0] ??
          seat.seatLabel,
        tertiaryLabel:
          attributeValues[1],
        colorCode:
          attributes?.colour ??
          undefined,
      },
      state: seat.isAnswer
        ? ("HIGHLIGHTED" as const)
        : seat.label
          ? ("OCCUPIED" as const)
          : ("EMPTY" as const),
    };
  });
  const entityPositions =
    Object.fromEntries(
      seats.map((seat, index) => [
        seat.label,
        index,
      ]),
    );
  const answerSlotIds = slots
    .filter(
      (slot) =>
        slot.state === "HIGHLIGHTED",
    )
    .map((slot) => slot.id);
  const stateSync =
    buildStateSync(
      scenario,
      seats,
      answerSlotIds,
    );
  const reasoningTimeline =
    buildReasoningTimeline(
      scenario,
      seats,
      answerSlotIds,
      stateSync,
    );

  return {
    type,
    dimensions,
    slots,
    slotMap: slots.map((slot, index) => ({
      slotId: slot.id,
      coordinates: slot.coordinates,
      label:
        seats[index]?.seatLabel ??
        `Slot ${slot.id + 1}`,
      row: seats[index]?.row,
      col: seats[index]?.col,
    })),
    stateSync,
    attributeLayers:
      Object.fromEntries(
        seats.map((seat) => {
          const attributes =
            scenario.attributeMap?.[
              seat.label
            ];
          const values = attributes
            ? Object.values(attributes)
            : [];

          return [
            seat.label,
            {
              core: seat.label,
              badge:
                values[0] ??
                seat.seatLabel,
              detail: values[1],
              visual: {
                colorCode:
                  attributes?.colour,
                strokeCode:
                  seat.isAnswer
                    ? "#16a34a"
                    : undefined,
                style: seat.isAnswer
                  ? "answer"
                  : undefined,
              },
            },
          ];
        }),
      ),
    reasoningTimeline,
  };
}

function extractTraceSteps(
  scenario: SeatingScenario,
) {
  return (
    scenario.solverTraceExport?.steps?.map(
      (entry) => entry.deduction,
    ) ??
    scenario.solverTraceExport?.text ??
    scenario.solverTrace ??
    []
  );
}

function mentionedSlotIds(
  text: string,
  seats: LegacySeat[],
) {
  if (!text) return [];

  return seats
    .filter(
      (seat) =>
        text.includes(seat.label) ||
        (seat.secondaryLabel
          ? text.includes(
              seat.secondaryLabel,
            )
          : false) ||
        (seat.seatLabel
          ? text.includes(
              seat.seatLabel,
            )
          : false),
    )
    .map((seat) => seat.position);
}

function visibleArrangementUntil(
  seats: LegacySeat[],
  visibleSlotIds: Set<number>,
) {
  return Object.fromEntries(
    seats
      .filter((seat) =>
        visibleSlotIds.has(
          seat.position,
        ),
      )
      .map((seat) => [
        seat.position,
        seat.label,
      ]),
  );
}

function buildStateSync(
  scenario: SeatingScenario,
  seats: LegacySeat[],
  answerSlotIds: number[],
): NonNullable<LayoutManifest["stateSync"]> {
  const steps = extractTraceSteps(
    scenario,
  );
  const visible = new Set<number>();

  if (!steps.length) {
    return {
      "0": {
        entityPositions:
          Object.fromEntries(
            seats.map((seat) => [
              seat.label,
              seat.position,
            ]),
          ),
        highlightedSlotIds:
          answerSlotIds,
        availableEntities: [],
      },
    };
  }

  return Object.fromEntries(
    steps.map((step, index) => {
      const highlighted =
        mentionedSlotIds(
          step,
          seats,
        );
      highlighted.forEach((slotId) =>
        visible.add(slotId),
      );

      const entityPositions =
        Object.fromEntries(
          seats
            .filter((seat) =>
              visible.has(
                seat.position,
              ),
            )
            .map((seat) => [
              seat.label,
              seat.position,
            ]),
        );

      return [
        String(index),
        {
          entityPositions,
          highlightedSlotIds:
            highlighted,
          availableEntities: seats
            .filter(
              (seat) =>
                !visible.has(
                  seat.position,
                ),
            )
            .map((seat) => seat.label),
        },
      ];
    }),
  );
}

function buildReasoningTimeline(
  scenario: SeatingScenario,
  seats: LegacySeat[],
  answerSlotIds: number[],
  stateSync: NonNullable<LayoutManifest["stateSync"]>,
): NonNullable<LayoutManifest["reasoningTimeline"]> {
  const steps = extractTraceSteps(
    scenario,
  );
  const visible = new Set<number>();

  if (!steps.length) {
    return [
      {
        stepIndex: 0,
        currentVisibleArrangement:
          visibleArrangementUntil(
            seats,
            new Set(
              seats.map(
                (seat) => seat.position,
              ),
            ),
          ),
        highlightedSlotIds:
          answerSlotIds,
        availableEntities: [],
        note: "Final arrangement",
      },
    ];
  }

  return steps.map((step, index) => {
    const sync =
      stateSync[String(index)];
    sync?.highlightedSlotIds.forEach(
      (slotId) => visible.add(slotId),
    );

    return {
      stepIndex: index,
      currentVisibleArrangement:
        visibleArrangementUntil(
          seats,
          visible,
        ),
      highlightedSlotIds:
        sync?.highlightedSlotIds ??
        [],
      availableEntities:
        sync?.availableEntities ?? [],
      note: step,
    };
  });
}
