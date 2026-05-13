import type {
  SeatingDiagramData,
  SeatingDiagramSeat,
  SeatingExplanationBranch,
  SeatingExplanationFlow,
  SeatingExplanationStep,
} from "@workspace/api-zod";
import type {
  InferenceStep,
} from "./seating-validator";
import type {
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

function parseSnapshotLabels(
  snapshot: string,
  seatCount: number,
) {
  const labels = snapshot
    .split("|")
    .map((token) => token.trim())
    .filter(Boolean);

  if (labels.length === seatCount) {
    return labels;
  }

  return Array.from(
    { length: seatCount },
    (_value, index) =>
      labels[index] ?? "?",
  );
}

function buildSnapshotFromLabels(
  scenario: LinearSeatingScenario,
  labels: string[],
): SeatingDiagramData {
  const colCount = getColCount(
    scenario,
  );

  return {
    arrangementType:
      scenario.arrangementType,
    orientationType:
      scenario.orientationType,
    seats: labels.map(
      (label, position) =>
        ({
          label,
          position,
          facing:
            scenario.seatFacings[
              position
            ]!,
          highlighted:
            label !== "?" &&
            label ===
              scenario.prompt.anchor,
          isAnswer:
            label !== "?" &&
            label ===
              scenario.prompt.correctAnswer,
          row:
            getLayoutFamily(
              scenario,
            ) === "two-row"
              ? Math.floor(
                  position / colCount,
                )
              : 0,
          col:
            getLayoutFamily(
              scenario,
            ) === "two-row"
              ? position % colCount
              : position,
          seatLabel:
            scenario.seatLabels[
              position
            ],
        }) satisfies SeatingDiagramSeat,
    ),
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
    colCount,
  };
}

function normalizeConstraintRefs(
  sourceConstraintIds: string[],
) {
  if (!sourceConstraintIds.length) {
    return "";
  }

  const refs = sourceConstraintIds
    .map((value) =>
      value.replace(":", " "),
    )
    .join(", ");

  return ` (from clues: ${refs})`;
}

function classifyTraceStep(
  step: InferenceStep,
): SeatingExplanationStep["type"] {
  if (
    step.deduction.includes(
      "Anchored",
    )
  ) {
    return "reference";
  }

  if (
    step.deduction.includes(
      "Branching on",
    )
  ) {
    return "case-analysis";
  }

  if (
    step.deduction.includes(
      "contradiction",
    ) ||
    step.eliminatedPossibilities
      .length > 0
  ) {
    return "elimination";
  }

  if (
    step.deduction.includes(
      "Accepted arrangement",
    )
  ) {
    return "final-arrangement";
  }

  return "inference";
}

function titleForTraceStep(
  type: SeatingExplanationStep["type"],
  index: number,
) {
  switch (type) {
    case "reference":
      return `Reference ${index}`;
    case "case-analysis":
      return `Case Analysis ${index}`;
    case "elimination":
      return `Elimination ${index}`;
    case "final-arrangement":
      return "Final Arrangement";
    default:
      return `Inference ${index}`;
  }
}

function toHumanExplanation(
  step: InferenceStep,
  type: SeatingExplanationStep["type"],
) {
  if (type === "reference") {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} This fixes a starting position so the rest of the clues can be checked in order.`;
  }

  if (type === "case-analysis") {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} Here we try a possible seat; we keep going only if the remaining clues can still be satisfied.`;
  }

  if (type === "elimination") {
    const eliminated =
      step.eliminatedPossibilities
        .length > 0
        ? ` Ruled out: ${step.eliminatedPossibilities.join("; ")}.`
        : "";

    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)}${eliminated} This is a routine elimination: the impossible case is dropped and the search continues with the surviving options.`;
  }

  if (
    type === "final-arrangement"
  ) {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} With every seat filled consistently, you can read the asked position straight from the final sketch.`;
  }

  return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} Each such move pins more seats and shrinks the remaining possibilities.`;
}

function buildBranches(
  step: InferenceStep,
  scenario: LinearSeatingScenario,
): SeatingExplanationBranch[] {
  if (
    !step.deduction.includes(
      "Branching on",
    )
  ) {
    return [];
  }

  const snapshot =
    buildSnapshotFromLabels(
      scenario,
      parseSnapshotLabels(
        step.resultingStateSnapshot,
        scenario.arrangement.length,
      ),
    );

  return [
    {
      id: `${step.stepId}-candidate`,
      label: "Current Case",
      status: "candidate",
      text: "This is the working case being tested against the remaining clues.",
      arrangementSnapshot:
        snapshot,
    },
  ];
}

function buildTraceDrivenSteps(
  scenario: LinearSeatingScenario,
) {
  return scenario.solverInferenceSteps.map(
    (step, index) => {
      const type =
        classifyTraceStep(step);

      return {
        type,
        title: titleForTraceStep(
          type,
          index + 1,
        ),
        text: toHumanExplanation(
          step,
          type,
        ),
        arrangementSnapshot:
          buildSnapshotFromLabels(
            scenario,
            parseSnapshotLabels(
              step.resultingStateSnapshot,
              scenario.arrangement.length,
            ),
          ),
        branches:
          type === "case-analysis"
            ? buildBranches(
                step,
                scenario,
              )
            : undefined,
      } satisfies SeatingExplanationStep;
    },
  );
}

function buildSummary(
  scenario: LinearSeatingScenario,
) {
  const eliminationCount =
    scenario.solverInferenceSteps.filter(
      (step) =>
        step.eliminatedPossibilities
          .length > 0,
    ).length;
  const branchCount =
    scenario.solverInferenceSteps.filter(
      (step) =>
        step.deduction.includes(
          "Branching on",
        ),
    ).length;

  return `Begin from the strongest fixed clue, follow the same logical order as in the trace, and whenever two cases remain, keep the one that survives every cross-check. This walk uses ${branchCount} branching check${branchCount === 1 ? "" : "s"} and ${eliminationCount} elimination step${eliminationCount === 1 ? "" : "s"} before the layout becomes unique.`;
}

export function buildSeatingExplanationFlow(
  scenario: LinearSeatingScenario,
): SeatingExplanationFlow {
  const steps =
    buildTraceDrivenSteps(
      scenario,
    );

  if (
    !steps.some(
      (step) =>
        step.type ===
        "final-arrangement",
    )
  ) {
    steps.push({
      type: "final-arrangement",
      title: "Final Arrangement",
      text: `After applying the full inference chain in order, the final arrangement is fixed and ${scenario.prompt.correctAnswer} is obtained for the asked position.`,
      arrangementSnapshot:
        buildSnapshotFromLabels(
          scenario,
          scenario.arrangement,
        ),
    });
  }

  return {
    summary: buildSummary(
      scenario,
    ),
    steps,
  };
}
