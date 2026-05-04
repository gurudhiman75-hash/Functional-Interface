import type { SeatingDiagramData } from "@workspace/api-zod";
import type {
  SeatingQuestionPrompt,
  SeatingScenario,
} from "./seating-engine";

function getQuestionTarget(
  prompt: SeatingQuestionPrompt,
) {
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

  return {
    arrangementType:
      scenario.arrangementType,
    orientationType:
      scenario.orientationType,
    seats:
      scenario.arrangement.map(
        (label, position) => ({
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
            scenario.arrangementType ===
              "double-row" ||
            scenario.arrangementType ===
              "parallel-row"
              ? Math.floor(
                  position /
                    (scenario.arrangement
                      .length / 2),
                )
              : 0,
          col:
            scenario.arrangementType ===
              "double-row" ||
            scenario.arrangementType ===
              "parallel-row"
              ? position %
                (scenario.arrangement
                  .length / 2)
              : position,
          seatLabel:
            scenario.seatLabels[
              position
            ],
        }),
      ),
    seatLabels:
      scenario.seatLabels,
    questionTarget,
    rowCount:
      scenario.arrangementType ===
        "double-row" ||
      scenario.arrangementType ===
        "parallel-row"
        ? 2
        : 1,
    colCount:
      scenario.arrangementType ===
        "double-row" ||
      scenario.arrangementType ===
        "parallel-row"
        ? scenario.arrangement.length / 2
        : scenario.arrangement.length,
  };
}
