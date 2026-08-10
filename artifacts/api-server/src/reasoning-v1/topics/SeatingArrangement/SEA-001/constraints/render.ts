import type { LinearConstraint, SeatingPerson } from "../types.ts";

function nameOf(personId: string, persons: readonly SeatingPerson[]): string {
  const person = persons.find((candidate) => candidate.id === personId);
  if (!person) throw new Error(`Unknown person ${personId}`);
  return person.displayName;
}

function ordinal(position: number): string {
  const remainder100 = position % 100;
  if (remainder100 >= 11 && remainder100 <= 13) return `${position}th`;
  const suffix = position % 10 === 1 ? "st" : position % 10 === 2 ? "nd" : position % 10 === 3 ? "rd" : "th";
  return `${position}${suffix}`;
}

export function renderConstraint(constraint: LinearConstraint, persons: readonly SeatingPerson[], seatCount: number): string {
  switch (constraint.kind) {
    case "ABSOLUTE_SEAT": {
      const person = nameOf(constraint.personId, persons);
      if (constraint.seatIndex === 0) return `${person} sits at the left end.`;
      if (constraint.seatIndex === seatCount - 1) return `${person} sits at the right end.`;
      const fromLeft = constraint.seatIndex + 1;
      const fromRight = seatCount - constraint.seatIndex;
      return fromLeft <= fromRight
        ? `${person} sits ${ordinal(fromLeft)} from the left end.`
        : `${person} sits ${ordinal(fromRight)} from the right end.`;
    }
    case "AT_END":
      return `${nameOf(constraint.personId, persons)} sits at one of the extreme ends.`;
    case "AT_MIDDLE":
      return `${nameOf(constraint.personId, persons)} sits in a middle seat.`;
    case "RELATIVE_POSITION":
      return `${nameOf(constraint.subjectId, persons)} sits ${constraint.steps === 1 ? "immediately" : ordinal(constraint.steps)} to the ${constraint.direction.toLowerCase()} of ${nameOf(constraint.referenceId, persons)}.`;
    case "ADJACENT":
      return `${nameOf(constraint.firstId, persons)} sits next to ${nameOf(constraint.secondId, persons)}.`;
    case "NOT_ADJACENT":
      return `${nameOf(constraint.firstId, persons)} does not sit next to ${nameOf(constraint.secondId, persons)}.`;
    case "EXACT_COUNT_BETWEEN":
      return `Exactly ${constraint.count} ${constraint.count === 1 ? "person sits" : "persons sit"} between ${nameOf(constraint.firstId, persons)} and ${nameOf(constraint.secondId, persons)}.`;
  }
}
