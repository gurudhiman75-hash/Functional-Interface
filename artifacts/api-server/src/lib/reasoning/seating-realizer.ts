import type {
  ExamProfileId,
} from "../core/generator-engine";
import type {
  LinearSeatingClue,
  LinearSeatingScenario,
} from "./seating-engine";
import {
  createReasoningStep,
  shuffle,
} from "../shared";
import type { OptionResult } from "../shared";

function ordinal(
  value: number,
) {
  switch (value) {
    case 1:
      return "first";
    case 2:
      return "second";
    case 3:
      return "third";
    case 4:
      return "fourth";
    case 5:
      return "fifth";
    case 6:
      return "sixth";
    default:
      return `${value}th`;
  }
}

function arrangementLead(
  scenario: LinearSeatingScenario,
  examProfile: ExamProfileId,
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy",
) {
  const personCount =
    scenario.participants.length;
  const orientationText =
    scenario.orientationType ===
      "center"
      ? "facing the centre"
      : scenario.orientationType ===
          "outward"
        ? "facing outward"
        : scenario.orientationType ===
            "alternate"
          ? "with alternate facing directions"
          : scenario.orientationType ===
              "mixed"
            ? "with mixed facing directions"
            : `facing ${scenario.orientationType}`;

  const intro =
    scenario.arrangementType ===
      "linear"
      ? `${personCount} persons are seated in a straight line, ${orientationText}.`
      : scenario.arrangementType ===
          "circular"
        ? `${personCount} persons are seated around a circular table, ${orientationText}.`
        : scenario.arrangementType ===
            "square"
          ? `${personCount} persons are seated around a square table, ${orientationText}.`
          : scenario.arrangementType ===
              "rectangular"
            ? `${personCount} persons are seated around a rectangular table, ${orientationText}.`
            : scenario.arrangementType ===
                "double-row"
              ? `${personCount} persons are seated in two rows facing each other, ${orientationText}.`
              : `${personCount} persons are seated in two parallel rows, ${orientationText}.`;

  if (
    examProfile === "ssc" ||
    wordingStyle === "concise"
  ) {
    return intro;
  }

  if (
    examProfile === "cat" ||
    wordingStyle ===
      "inference-heavy"
  ) {
    return `${intro} Use the relational clues to infer the complete arrangement.`;
  }

  return `${intro} Read the clues carefully and determine the arrangement.`;
}

function clueToText(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
) {
  const seatSideWord =
    scenario.arrangementType ===
      "linear" ||
    scenario.arrangementType ===
      "parallel-row" ||
    scenario.arrangementType ===
      "double-row"
      ? "sits"
      : "is seated";

  switch (clue.type) {
    case "absolute":
      return `${clue.person} ${seatSideWord} ${ordinal(clue.index + 1)} from the left end.`;
    case "end":
      return clue.side === "left"
        ? `${clue.person} ${seatSideWord} at the extreme left end.`
        : `${clue.person} ${seatSideWord} at the extreme right end.`;
    case "adjacent":
      return clue.ordered
        ? `${clue.left} sits immediately to the left of ${clue.right}.`
        : `${clue.left} is an immediate neighbour of ${clue.right}.`;
    case "not-adjacent":
      return `${clue.left} is not an immediate neighbour of ${clue.right}.`;
    case "offset":
      return `${clue.person} sits ${clue.distance === 1 ? "immediately" : clue.distance === 2 ? "second" : "third"} to the ${clue.direction} of ${clue.anchor}.`;
    case "distance-gap":
      return `${clue.gap === 1 ? "Only one person" : "Two persons"} sit${clue.gap === 1 ? "s" : ""} between ${clue.left} and ${clue.right}.`;
    case "between":
      return `${clue.middle} sits between ${clue.first} and ${clue.second}.`;
    case "adjacent-both":
      return `${clue.middle} is an immediate neighbour of both ${clue.first} and ${clue.second}.`;
    case "not-end":
      return `${clue.person} is not sitting at any extreme end.`;
    case "opposite":
      return scenario.arrangementType ===
        "double-row"
        ? `${clue.left} sits facing ${clue.right}.`
        : `${clue.left} sits opposite ${clue.right}.`;
    case "not-opposite":
      return scenario.arrangementType ===
        "double-row"
        ? `${clue.left} does not sit facing ${clue.right}.`
        : `${clue.left} does not sit opposite ${clue.right}.`;
    case "same-row":
      return `${clue.left} sits in the same row as ${clue.right}.`;
    case "different-row":
      return `${clue.left} does not sit in the same row as ${clue.right}.`;
    case "facing":
      return `${clue.left} sits directly facing ${clue.right}.`;
    case "not-facing":
      return `${clue.left} does not sit directly facing ${clue.right}.`;
    default:
      return "Use the seating clue carefully.";
  }
}

function reasoningForClue(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
) {
  switch (clue.type) {
    case "absolute":
    case "end":
      return createReasoningStep(
        "compare",
        clueToText(clue, scenario),
      );
    case "adjacent":
    case "distance-gap":
    case "between":
    case "adjacent-both":
    case "same-row":
    case "facing":
    case "opposite":
      return createReasoningStep(
        "infer",
        clueToText(clue, scenario),
      );
    case "offset":
      return createReasoningStep(
        "transform",
        clueToText(clue, scenario),
      );
    case "not-end":
    case "not-adjacent":
    case "not-opposite":
    case "different-row":
    case "not-facing":
      return createReasoningStep(
        "filter",
        clueToText(clue, scenario),
      );
    default:
      return createReasoningStep(
        "infer",
        clueToText(clue, scenario),
      );
  }
}

export function buildSeatingStem(
  scenario: LinearSeatingScenario,
  examProfile: ExamProfileId,
  wordingStyle:
    | "concise"
    | "balanced"
    | "inference-heavy",
) {
  const clueLead = arrangementLead(
    scenario,
    examProfile,
    wordingStyle,
  );
  const clueText = scenario.clues
    .map((clue) =>
      clueToText(clue, scenario),
    )
    .join(" ");

  return `${clueLead} ${clueText} ${scenario.prompt.prompt}`;
}

export function buildSeatingExplanation(
  scenario: LinearSeatingScenario,
) {
  const orderedReasoning = [
    ...scenario.clues.map((clue) =>
      reasoningForClue(
        clue,
        scenario,
      ),
    ),
    createReasoningStep(
      "infer",
      scenario.arrangementType ===
        "linear"
        ? "Combine the left-right, neighbour, and elimination clues to narrow the row to one valid arrangement."
        : scenario.arrangementType ===
            "double-row" ||
            scenario.arrangementType ===
              "parallel-row"
          ? "Combine the row, facing, and positional clues to lock both rows into one valid arrangement."
          : "Combine the relational and orientation clues to narrow the arrangement to one valid layout.",
    ),
    createReasoningStep(
      "compare",
      `After arranging all positions consistently, ${scenario.prompt.correctAnswer} satisfies the asked position.`,
    ),
  ];

  return {
    text: orderedReasoning
      .map((step, index) =>
        `${index + 1}. ${step.detail}`,
      )
      .join(" "),
    reasoningSteps: orderedReasoning,
  };
}

export function buildSeatingOptions(
  scenario: LinearSeatingScenario,
): OptionResult {
  const correctAnswer =
    scenario.prompt.correctAnswer;
  const options = shuffle([
    correctAnswer,
    ...scenario.participants.filter(
      (participant) =>
        participant !== correctAnswer,
    ),
  ]).slice(0, 4);

  if (!options.includes(correctAnswer)) {
    options[options.length - 1] =
      correctAnswer;
  }

  const shuffled = shuffle(options);

  return {
    options: shuffled,
    correct:
      shuffled.indexOf(correctAnswer),
    optionMetadata: shuffled.map(
      (value: string) => ({
        value,
        isCorrect:
          value === correctAnswer,
      }),
    ),
  };
}
