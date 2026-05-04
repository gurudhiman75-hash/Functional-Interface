import type {
  SeatingDiagramData,
  SeatingDiagramSeat,
  SeatingExplanationBranch,
  SeatingExplanationFlow,
  SeatingExplanationStep,
} from "@workspace/api-zod";
import type {
  LinearSeatingClue,
  LinearSeatingScenario,
} from "./seating-engine";

type LayoutFamily =
  | "single-row"
  | "ring"
  | "two-row";

function getLayoutFamily(
  scenario: LinearSeatingScenario,
): LayoutFamily {
  if (
    scenario.arrangementType ===
      "double-row" ||
    scenario.arrangementType ===
      "parallel-row"
  ) {
    return "two-row";
  }

  if (
    scenario.arrangementType ===
      "circular" ||
    scenario.arrangementType ===
      "square" ||
    scenario.arrangementType ===
      "rectangular"
  ) {
    return "ring";
  }

  return "single-row";
}

function getColCount(
  scenario: LinearSeatingScenario,
) {
  return getLayoutFamily(scenario) ===
    "two-row"
    ? scenario.arrangement.length / 2
    : scenario.arrangement.length;
}

function buildEmptySeats(
  scenario: LinearSeatingScenario,
) {
  const colCount = getColCount(
    scenario,
  );

  return scenario.arrangement.map(
    (_label, position) => ({
      label: "?",
      position,
      facing:
        scenario.seatFacings[position]!,
      row:
        getLayoutFamily(scenario) ===
        "two-row"
          ? Math.floor(
              position / colCount,
            )
          : 0,
      col:
        getLayoutFamily(scenario) ===
        "two-row"
          ? position % colCount
          : position,
      seatLabel:
        scenario.seatLabels[position],
    }),
  );
}

function createSnapshot(
  scenario: LinearSeatingScenario,
  placed: Map<number, string>,
  highlightedLabel?: string,
  answerLabel?: string,
): SeatingDiagramData {
  const baseSeats =
    buildEmptySeats(scenario);

  const seats = baseSeats.map(
    (seat) => {
      const label =
        placed.get(seat.position) ??
        "?";
      const known = label !== "?";

      return {
        ...seat,
        label,
        highlighted:
          known &&
          label === highlightedLabel,
        isAnswer:
          known &&
          label === answerLabel,
      } satisfies SeatingDiagramSeat;
    },
  );

  return {
    arrangementType:
      scenario.arrangementType,
    orientationType:
      scenario.orientationType,
    seats,
    seatLabels:
      scenario.seatLabels,
    questionTarget: {
      label: scenario.prompt.anchor,
      promptType:
        scenario.prompt.type,
      answerLabel:
        scenario.prompt.correctAnswer,
    },
    rowCount:
      getLayoutFamily(scenario) ===
      "two-row"
        ? 2
        : 1,
    colCount: getColCount(scenario),
  };
}

function classifyStepType(
  clue: LinearSeatingClue,
): SeatingExplanationStep["type"] {
  if (
    clue.type === "absolute" ||
    clue.type === "end"
  ) {
    return "reference";
  }

  if (
    clue.type === "not-adjacent" ||
    clue.type === "not-end" ||
    clue.type === "not-opposite" ||
    clue.type === "different-row" ||
    clue.type === "not-facing"
  ) {
    return "elimination";
  }

  if (
    clue.type === "adjacent" &&
    !clue.ordered
  ) {
    return "case-analysis";
  }

  if (
    clue.type === "between" ||
    clue.type === "adjacent-both"
  ) {
    return "case-analysis";
  }

  return "inference";
}

function clueTitle(
  type: SeatingExplanationStep["type"],
  index: number,
) {
  if (type === "reference") {
    return `Reference ${index}`;
  }

  if (type === "case-analysis") {
    return `Case Analysis ${index}`;
  }

  if (type === "elimination") {
    return `Elimination ${index}`;
  }

  return `Inference ${index}`;
}

function clueText(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
) {
  switch (clue.type) {
    case "absolute":
      return `${clue.person} is fixed at ${scenario.seatLabels[clue.index]}.`;
    case "end":
      return `${clue.person} is placed at the ${clue.side} end reference.`;
    case "adjacent":
      return clue.ordered
        ? `${clue.left} must sit immediately to the left of ${clue.right}, so both seats move together as a pair.`
        : `${clue.left} and ${clue.right} must be neighbours, so we keep them as one adjacent block and test both orders.`;
    case "not-adjacent":
      return `${clue.left} cannot sit next to ${clue.right}, so any neighbouring case is rejected.`;
    case "offset":
      return `${clue.person} is fixed ${clue.distance} seat(s) to the ${clue.direction} of ${clue.anchor}, which places both positions together.`;
    case "distance-gap":
      return `${clue.left} and ${clue.right} must keep a gap of ${clue.gap} seat(s), which narrows the usable slots sharply.`;
    case "between":
      return `${clue.middle} must remain between ${clue.first} and ${clue.second}, so we test both side orders around the middle seat.`;
    case "adjacent-both":
      return `${clue.middle} must touch both ${clue.first} and ${clue.second}, so the only choice is which side each one occupies.`;
    case "not-end":
      return `${clue.person} cannot occupy an extreme seat, so the edge positions are eliminated.`;
    case "opposite":
      return `${clue.left} and ${clue.right} are fixed on opposite seats.`;
    case "not-opposite":
      return `${clue.left} and ${clue.right} cannot face each other directly, so that case is removed.`;
    case "same-row":
      return `${clue.left} and ${clue.right} must stay in the same row.`;
    case "different-row":
      return `${clue.left} and ${clue.right} must lie in different rows, so same-row placements are eliminated.`;
    case "facing":
      return `${clue.left} must sit directly facing ${clue.right}.`;
    case "not-facing":
      return `${clue.left} cannot sit directly facing ${clue.right}, so direct-facing cases are rejected.`;
    default:
      return "Use the clue to refine the arrangement.";
  }
}

function indexesForClue(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
) {
  const positions = new Set<number>();
  const indexByLabel = new Map(
    scenario.arrangement.map(
      (label, index) => [label, index] as const,
    ),
  );
  const maybeAdd = (label?: string) => {
    if (!label) return;
    const index = indexByLabel.get(
      label,
    );
    if (index !== undefined) {
      positions.add(index);
    }
  };

  switch (clue.type) {
    case "absolute":
    case "end":
    case "not-end":
      maybeAdd(clue.person);
      break;
    case "adjacent":
    case "not-adjacent":
    case "distance-gap":
    case "same-row":
    case "different-row":
    case "facing":
    case "not-facing":
    case "opposite":
    case "not-opposite":
      maybeAdd(clue.left);
      maybeAdd(clue.right);
      break;
    case "offset":
      maybeAdd(clue.anchor);
      maybeAdd(clue.person);
      break;
    case "between":
    case "adjacent-both":
      maybeAdd(clue.middle);
      maybeAdd(clue.first);
      maybeAdd(clue.second);
      break;
  }

  return [...positions];
}

function createMirrorPlacement(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
) {
  const actual = new Map<
    number,
    string
  >();
  const alternative = new Map<
    number,
    string
  >();
  const positions = indexesForClue(
    clue,
    scenario,
  );

  positions.forEach((position) => {
    actual.set(
      position,
      scenario.arrangement[position]!,
    );
  });

  if (
    clue.type === "adjacent" &&
    !clue.ordered &&
    positions.length === 2
  ) {
    alternative.set(
      positions[0]!,
      scenario.arrangement[
        positions[1]!
      ]!,
    );
    alternative.set(
      positions[1]!,
      scenario.arrangement[
        positions[0]!
      ]!,
    );
  } else if (
    (clue.type === "between" ||
      clue.type === "adjacent-both") &&
    positions.length === 3
  ) {
    const middle = positions.find(
      (position) =>
        scenario.arrangement[position] ===
        clue.middle,
    );
    const others = positions.filter(
      (position) =>
        position !== middle,
    );

    if (
      middle !== undefined &&
      others.length === 2
    ) {
      alternative.set(
        middle,
        clue.middle,
      );
      alternative.set(
        others[0]!,
        scenario.arrangement[
          others[1]!
        ]!,
      );
      alternative.set(
        others[1]!,
        scenario.arrangement[
          others[0]!
        ]!,
      );
    }
  }

  return {
    actual,
    alternative:
      alternative.size > 0
        ? alternative
        : null,
  };
}

function makeCaseBranches(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
  revealed: Map<number, string>,
): SeatingExplanationBranch[] {
  const placements =
    createMirrorPlacement(
      clue,
      scenario,
    );

  if (!placements.alternative) {
    return [];
  }

  return [
    {
      id: "case-1",
      label: "Case 1",
      status: "selected",
      text: "This case remains consistent after cross-checking the other clues.",
      arrangementSnapshot:
        createSnapshot(
          scenario,
          new Map([
            ...revealed,
            ...placements.actual,
          ]),
          scenario.prompt.anchor,
          scenario.prompt.correctAnswer,
        ),
    },
    {
      id: "case-2",
      label: "Case 2",
      status: "eliminated",
      text: "This mirror case fails once the remaining reference clues are applied.",
      arrangementSnapshot:
        createSnapshot(
          scenario,
          new Map([
            ...revealed,
            ...placements.alternative,
          ]),
          scenario.prompt.anchor,
          scenario.prompt.correctAnswer,
        ),
    },
  ];
}

function finalSummary(
  scenario: LinearSeatingScenario,
) {
  return `Start from the fixed references, form short neighbour/relative blocks, test the ambiguous mirror case where needed, and eliminate the inconsistent case to reach the final arrangement. ${scenario.prompt.correctAnswer} answers the asked position.`;
}

export function buildSeatingExplanationFlow(
  scenario: LinearSeatingScenario,
): SeatingExplanationFlow {
  const revealed = new Map<
    number,
    string
  >();
  const steps: SeatingExplanationStep[] =
    [];

  scenario.clues.forEach(
    (clue, clueIndex) => {
      const stepType =
        classifyStepType(clue);
      const positions =
        indexesForClue(clue, scenario);

      if (
        stepType === "case-analysis"
      ) {
        const branches =
          makeCaseBranches(
            clue,
            scenario,
            revealed,
          );

        positions.forEach((position) => {
          revealed.set(
            position,
            scenario.arrangement[
              position
            ]!,
          );
        });

        steps.push({
          type: stepType,
          title: clueTitle(
            stepType,
            clueIndex + 1,
          ),
          text: clueText(
            clue,
            scenario,
          ),
          arrangementSnapshot:
            createSnapshot(
              scenario,
              revealed,
              scenario.prompt.anchor,
              scenario.prompt.correctAnswer,
            ),
          branches,
        });
        return;
      }

      positions.forEach((position) => {
        revealed.set(
          position,
          scenario.arrangement[position]!,
        );
      });

      steps.push({
        type: stepType,
        title: clueTitle(
          stepType,
          clueIndex + 1,
        ),
        text: clueText(
          clue,
          scenario,
        ),
        arrangementSnapshot:
          createSnapshot(
            scenario,
            revealed,
            scenario.prompt.anchor,
            scenario.prompt.correctAnswer,
          ),
      });
    },
  );

  steps.push({
    type: "final-arrangement",
    title: "Final Arrangement",
    text: `After applying all references, inferences, and eliminations, the arrangement is fixed and ${scenario.prompt.correctAnswer} is obtained for the asked position.`,
    arrangementSnapshot:
      createSnapshot(
        scenario,
        new Map(
          scenario.arrangement.map(
            (label, position) => [
              position,
              label,
            ] as const,
          ),
        ),
        scenario.prompt.anchor,
        scenario.prompt.correctAnswer,
      ),
  });

  return {
    summary: finalSummary(
      scenario,
    ),
    steps,
  };
}
