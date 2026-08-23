import type {
  Sea002Cp006State,
  Sea002ParallelFacing,
  Sea002ParallelRow,
  Sea002ParallelSeat,
  Sea002ParallelSide,
  Sea002PersonId,
} from "./types.ts";

export function facingForRow(row: Sea002ParallelRow): Sea002ParallelFacing {
  return row === "TOP" ? "SOUTH" : "NORTH";
}

export function seatOf(state: Sea002Cp006State, person: Sea002PersonId): Sea002ParallelSeat {
  const topColumn = state.top.indexOf(person);
  if (topColumn >= 0) return { row: "TOP", column: topColumn };
  const bottomColumn = state.bottom.indexOf(person);
  if (bottomColumn >= 0) return { row: "BOTTOM", column: bottomColumn };
  throw new Error(`Unknown SEA-002 CP006 person '${person}'.`);
}

export function personAt(state: Sea002Cp006State, seat: Sea002ParallelSeat): Sea002PersonId | null {
  if (seat.column < 0 || seat.column >= state.seatCountPerRow) return null;
  return (seat.row === "TOP" ? state.top[seat.column] : state.bottom[seat.column]) ?? null;
}

export function oppositePerson(state: Sea002Cp006State, person: Sea002PersonId): Sea002PersonId {
  const seat = seatOf(state, person);
  const opposite = personAt(state, { row: seat.row === "TOP" ? "BOTTOM" : "TOP", column: seat.column });
  if (!opposite) throw new Error(`Missing opposite seat for ${person}.`);
  return opposite;
}

export function sameRowMove(
  state: Sea002Cp006State,
  reference: Sea002PersonId,
  side: Sea002ParallelSide,
  steps: number,
): Sea002PersonId | null {
  const seat = seatOf(state, reference);
  const facing = facingForRow(seat.row);
  const observerDelta = facing === "NORTH"
    ? (side === "LEFT" ? -steps : steps)
    : (side === "LEFT" ? steps : -steps);
  return personAt(state, { row: seat.row, column: seat.column + observerDelta });
}

export function sameRow(state: Sea002Cp006State, first: Sea002PersonId, second: Sea002PersonId): boolean {
  return seatOf(state, first).row === seatOf(state, second).row;
}

export function areOpposite(state: Sea002Cp006State, first: Sea002PersonId, second: Sea002PersonId): boolean {
  const a = seatOf(state, first);
  const b = seatOf(state, second);
  return a.row !== b.row && a.column === b.column;
}

export function areDiagonal(state: Sea002Cp006State, first: Sea002PersonId, second: Sea002PersonId): boolean {
  const a = seatOf(state, first);
  const b = seatOf(state, second);
  return a.row !== b.row && Math.abs(a.column - b.column) === 1;
}

export function mirroredState(state: Sea002Cp006State): Sea002Cp006State {
  return {
    seatCountPerRow: state.seatCountPerRow,
    top: [...state.top].reverse(),
    bottom: [...state.bottom].reverse(),
  };
}

export function observerColumnLabel(column: number): string {
  return `column ${column + 1}`;
}
