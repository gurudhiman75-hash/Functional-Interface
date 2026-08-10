import { LinearTopology } from "../topology/linear.ts";
import type { LinearSeatingState } from "../types.ts";

export function renderLinearDiagram(state: LinearSeatingState): string {
  const topology = new LinearTopology(state.seats.length);
  const nameById = new Map(state.persons.map((person) => [person.id, person.displayName] as const));
  const rows = [...state.assignments]
    .sort((left, right) => topology.indexOf(left.seatId) - topology.indexOf(right.seatId))
    .map((assignment) => ({
      name: nameById.get(assignment.personId) ?? assignment.personId,
      facing: assignment.facing === "NORTH" ? "↑" : "↓",
    }));

  // Use explicit separators rather than fixed-width padding. The English name
  // pool deliberately contains names longer than seven characters, and a
  // fixed-width renderer can visually merge adjacent occupants.
  const seatLine = `Seat:    ${rows.map((_, index) => String(index + 1)).join(" | ")}`;
  const personLine = `Person:  ${rows.map((row) => row.name).join(" | ")}`;
  const facingLine = `Facing:  ${rows.map((row) => row.facing).join(" | ")}`;
  return [seatLine, personLine, facingLine].join("\n");
}
