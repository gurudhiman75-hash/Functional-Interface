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
  const seatLine = `Seat:    ${rows.map((_, index) => String(index + 1).padEnd(7)).join("").trimEnd()}`;
  const personLine = `Person:  ${rows.map((row) => row.name.padEnd(7)).join("").trimEnd()}`;
  const facingLine = `Facing:  ${rows.map((row) => row.facing.padEnd(7)).join("").trimEnd()}`;
  return [seatLine, personLine, facingLine].join("\n");
}
