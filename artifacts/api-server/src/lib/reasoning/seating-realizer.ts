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

function stableClueVariantIndex(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
  variantCount: number,
) {
  const source = JSON.stringify({
    clue,
    arrangementType:
      scenario.arrangementType,
    orientationType:
      scenario.orientationType,
  });
  let hash = 2166136261;

  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) % variantCount;
}

function selectClueVariant(
  clue: LinearSeatingClue,
  scenario: LinearSeatingScenario,
  variants: string[],
) {
  return variants[
    stableClueVariantIndex(
      clue,
      scenario,
      variants.length,
    )
  ]!;
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
  const isTableLayout =
    scenario.arrangementType ===
      "circular" ||
    scenario.arrangementType ===
      "square" ||
    scenario.arrangementType ===
      "rectangular";
  const isRowLayout =
    scenario.arrangementType ===
      "linear" ||
    scenario.arrangementType ===
      "parallel-row" ||
    scenario.arrangementType ===
      "double-row";
  const constraintLead =
    scenario.arrangementType ===
      "floor"
      ? `${personCount} persons live on different floors of an apartment. The bottom floor is numbered $1$.`
      : scenario.arrangementType ===
          "box-stack"
        ? `${personCount} boxes are kept one above another in a vertical stack. Position $1$ is the bottom position.`
        : scenario.arrangementType ===
            "scheduling"
          ? `${personCount} events are scheduled on different weekdays from Monday to Friday.`
          : scenario.arrangementType ===
              "ranking"
            ? `${personCount} entities are arranged in a rank order from left to right.`
            : scenario.arrangementType ===
                "mapping"
              ? `${personCount} entities are mapped to distinct slots and attributes.`
              : "";

  if (constraintLead) {
    return `${constraintLead} Use the constraints to find the unique mapping.`;
  }
  const orientationText =
    scenario.orientationType ===
      "center"
      ? "facing the centre"
      : scenario.orientationType ===
          "outward"
        ? "facing outward"
        : scenario.orientationType ===
            "alternate"
          ? isTableLayout
            ? "with alternate seats facing the centre and outward"
            : "with alternate north/south facing directions"
          : scenario.orientationType ===
              "mixed"
            ? isTableLayout
              ? "with some persons facing the centre and some facing outward"
              : "with some persons facing north and some facing south"
            : isRowLayout &&
                (scenario.orientationType ===
                  "north" ||
                  scenario.orientationType ===
                    "south")
              ? `with all persons facing ${scenario.orientationType}`
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
    case "slot-fixed":
      return `${clue.entity} is assigned to ${clue.slotLabel}.`;
    case "slot-gap":
      return clue.axis === "after" ||
        clue.axis === "before"
        ? `There are ${clue.gap} scheduled slot(s) between ${clue.left} and ${clue.right}.`
        : `There are ${clue.gap} slot(s) between ${clue.left} and ${clue.right}.`;
    case "slot-parity":
      return `${clue.entity} is in an ${clue.parity}-numbered slot.`;
    case "slot-immediate":
      return clue.axis === "after" ||
        clue.axis === "before"
        ? `${clue.upper} is scheduled immediately ${clue.axis} ${clue.lower}.`
        : `${clue.upper} is kept immediately ${clue.axis} ${clue.lower}.`;
    case "slot-not":
      return `${clue.entity} is not assigned to ${clue.slotLabel}.`;
    case "attribute":
      return `${clue.entity} has ${clue.attribute} ${clue.value}.`;
    case "absolute":
      return `${clue.person} ${seatSideWord} ${ordinal(clue.index + 1)} from the left end.`;
    case "end":
      return clue.side === "left"
        ? `${clue.person} ${seatSideWord} at the extreme left end.`
        : `${clue.person} ${seatSideWord} at the extreme right end.`;
    case "adjacent":
      return clue.ordered
        ? selectClueVariant(
            clue,
            scenario,
            [
              `${clue.left} sits immediately to the left of ${clue.right}.`,
              `${clue.right} sits immediately to the right of ${clue.left}.`,
              `${clue.left} and ${clue.right} are immediate neighbours, with ${clue.left} on the left.`,
            ],
          )
        : selectClueVariant(
            clue,
            scenario,
            [
              `${clue.left} is an immediate neighbour of ${clue.right}.`,
              `${clue.left} and ${clue.right} sit next to each other.`,
              `${clue.right} has ${clue.left} as an immediate neighbour.`,
            ],
          );
    case "not-adjacent":
      return selectClueVariant(
        clue,
        scenario,
        [
          `${clue.left} is not an immediate neighbour of ${clue.right}.`,
          `${clue.left} and ${clue.right} do not sit next to each other.`,
          `${clue.right} is not seated adjacent to ${clue.left}.`,
        ],
      );
    case "offset":
      return selectClueVariant(
        clue,
        scenario,
        [
          `${clue.person} sits ${clue.distance === 1 ? "immediately" : clue.distance === 2 ? "second" : "third"} to the ${clue.direction} of ${clue.anchor}.`,
          `${clue.person} is placed ${clue.distance === 1 ? "immediately" : clue.distance === 2 ? "two seats" : "three seats"} to the ${clue.direction} of ${clue.anchor}.`,
          `Counting from ${clue.anchor}, ${clue.person} is ${clue.distance === 1 ? "immediately" : clue.distance === 2 ? "second" : "third"} to the ${clue.direction}.`,
        ],
      );
    case "distance-gap":
      return selectClueVariant(
        clue,
        scenario,
        [
          `${clue.gap === 1 ? "Only one person" : "Two persons"} sit${clue.gap === 1 ? "s" : ""} between ${clue.left} and ${clue.right}.`,
          `There ${clue.gap === 1 ? "is one person" : "are two persons"} between ${clue.left} and ${clue.right}.`,
          `${clue.left} and ${clue.right} have ${clue.gap === 1 ? "one" : "two"} person${clue.gap === 1 ? "" : "s"} between them.`,
        ],
      );
    case "between":
      return selectClueVariant(
        clue,
        scenario,
        [
          `${clue.middle} sits between ${clue.first} and ${clue.second}.`,
          `${clue.middle} is placed in between ${clue.first} and ${clue.second}.`,
          `${clue.first}, ${clue.middle}, and ${clue.second} form a consecutive block with ${clue.middle} in the middle.`,
        ],
      );
    case "adjacent-both":
      return selectClueVariant(
        clue,
        scenario,
        [
          `${clue.middle} is an immediate neighbour of both ${clue.first} and ${clue.second}.`,
          `${clue.middle} sits next to both ${clue.first} and ${clue.second}.`,
          `${clue.first} and ${clue.second} occupy the two seats adjacent to ${clue.middle}.`,
        ],
      );
    case "not-end":
      return `${clue.person} is not sitting at any extreme end.`;
    case "opposite":
      return scenario.arrangementType ===
        "double-row"
        ? selectClueVariant(
            clue,
            scenario,
            [
              `${clue.left} sits facing ${clue.right}.`,
              `${clue.left} is directly opposite ${clue.right}.`,
              `${clue.right} faces ${clue.left}.`,
            ],
          )
        : selectClueVariant(
            clue,
            scenario,
            [
              `${clue.left} sits opposite ${clue.right}.`,
              `${clue.left} is directly opposite ${clue.right}.`,
              `${clue.right} sits opposite ${clue.left}.`,
            ],
          );
    case "not-opposite":
      return scenario.arrangementType ===
        "double-row"
        ? selectClueVariant(
            clue,
            scenario,
            [
              `${clue.left} does not sit facing ${clue.right}.`,
              `${clue.left} is not directly opposite ${clue.right}.`,
              `${clue.right} does not face ${clue.left}.`,
            ],
          )
        : selectClueVariant(
            clue,
            scenario,
            [
              `${clue.left} does not sit opposite ${clue.right}.`,
              `${clue.left} is not directly opposite ${clue.right}.`,
              `${clue.right} is not opposite ${clue.left}.`,
            ],
          );
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
    case "slot-fixed":
    case "attribute":
      return createReasoningStep(
        "compare",
        clueToText(clue, scenario),
      );
    case "slot-gap":
    case "slot-immediate":
      return createReasoningStep(
        "infer",
        clueToText(clue, scenario),
      );
    case "slot-parity":
    case "slot-not":
      return createReasoningStep(
        "filter",
        clueToText(clue, scenario),
      );
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
      scenario.constraintDimensionality
        ? "Combine fixed assignments, domain pruning, and relative slot links until only one Entity-to-Slot mapping remains."
        : scenario.arrangementType ===
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
  const optionSource =
    scenario.prompt.type ===
      "entity-slot" &&
    scenario.attributeMap
      ? [
        ...new Set(
          Object.values(
            scenario.attributeMap,
          ).flatMap((entry) =>
            Object.values(entry),
          ),
        ),
      ]
      : scenario.participants;
  const options = shuffle([
    correctAnswer,
    ...optionSource.filter(
      (value) => value !== correctAnswer,
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
