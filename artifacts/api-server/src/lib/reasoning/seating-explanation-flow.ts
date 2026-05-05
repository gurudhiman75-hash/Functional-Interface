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

  return ` Reference clues used: ${refs}.`;
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
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} This gives us the first stable reference point for the arrangement.`;
  }

  if (type === "case-analysis") {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} At this stage we test the possible seat choice and keep the remaining arrangement flexible until the next clue confirms or rejects it.`;
  }

  if (type === "elimination") {
    const eliminated =
      step.eliminatedPossibilities
        .length > 0
        ? ` Eliminated possibilities: ${step.eliminatedPossibilities.join("; ")}.`
        : "";

    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)}${eliminated} This is the standard SSC/Banking elimination move where an invalid case is removed before proceeding further.`;
  }

  if (
    type === "final-arrangement"
  ) {
    return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} The arrangement is now fixed, so the asked position can be read directly from the completed figure.`;
  }

  return `${step.deduction}${normalizeConstraintRefs(step.sourceConstraintIds)} This deduction locks more positions and reduces the remaining uncertainty step by step.`;
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

  return `Start from the fixed reference, test the progressive deductions in the same order as the solver trace, and remove the contradictory cases one by one. This solution uses ${branchCount} branch test${branchCount === 1 ? "" : "s"} and ${eliminationCount} elimination move${eliminationCount === 1 ? "" : "s"} before reaching the final arrangement.`;
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
