import {
  localizePersonName,
} from "../../entity-registry";
import type {
  SemanticClue,
} from "../../semantic-primitives";
import { ordinalEn } from "../shared";

const name = (value: unknown) =>
  localizePersonName(value, "en");

export function realizeSeatingEnglish(
  clue: SemanticClue,
) {
  const subject = name(clue.subject);
  const object = name(clue.object);
  const secondObject = name(clue.secondObject);
  const distance = clue.distance ?? 1;

  switch (clue.primitive) {
    case "immediate-left":
      return `${subject} sits to the immediate left of ${object}.`;
    case "immediate-right":
      return `${subject} sits to the immediate right of ${object}.`;
    case "relative-left":
      return `${subject} sits ${ordinalEn(distance)} to the left of ${object}.`;
    case "relative-right":
      return `${subject} sits ${ordinalEn(distance)} to the right of ${object}.`;
    case "opposite":
      return `${subject} sits opposite ${object}.`;
    case "not-opposite":
      return `${subject} does not sit opposite ${object}.`;
    case "adjacent":
      return `${subject} and ${object} sit adjacent to each other.`;
    case "not-adjacent":
      return `${subject} and ${object} do not sit adjacent to each other.`;
    case "between":
      if (clue.secondObject) {
        return `${subject} sits between ${object} and ${secondObject}.`;
      }
      return `${subject} satisfies the given between-position condition with ${object}.`;
    case "same-row":
      return `${subject} and ${object} are in the same row.`;
    case "different-row":
      return `${subject} and ${object} are in different rows.`;
    case "north-facing":
      return `${subject} faces north.`;
    case "south-facing":
      return `${subject} faces south.`;
    case "clockwise":
      return `${subject} is placed clockwise from ${object}.`;
    case "anti-clockwise":
      return `${subject} is placed anti-clockwise from ${object}.`;
    case "not-end":
      return `${subject} is not seated at either end.`;
    default:
      return `Condition: ${clue.raw ?? clue.primitive}.`;
  }
}
