import type {
  Sea002Cp007Facing,
  Sea002Cp007Participant,
  Sea002Cp007Row,
  Sea002Cp007Seat,
} from "./types.ts";

export function seatKey(seat: Sea002Cp007Seat): string {
  return `${seat.row}:${seat.position}`;
}

export function participantById(
  participants: readonly Sea002Cp007Participant[],
  id: string,
): Sea002Cp007Participant {
  const found = participants.find((participant) => participant.id === id);
  if (!found) throw new Error(`Unknown participant ${id}.`);
  return found;
}

export function oppositeSeat(seat: Sea002Cp007Seat): Sea002Cp007Seat {
  return Object.freeze({
    row: seat.row === "TOP" ? "BOTTOM" : "TOP",
    position: seat.position,
  });
}

export function relativeDelta(facing: Sea002Cp007Facing, direction: "LEFT" | "RIGHT"): number {
  if (facing === "N") return direction === "RIGHT" ? 1 : -1;
  return direction === "RIGHT" ? -1 : 1;
}

export function relativeSeat(
  reference: Sea002Cp007Participant,
  direction: "LEFT" | "RIGHT",
  distance = 1,
): Sea002Cp007Seat {
  return Object.freeze({
    row: reference.seat.row,
    position: reference.seat.position + relativeDelta(reference.facing, direction) * distance,
  });
}

export function sameRow(left: Sea002Cp007Participant, right: Sea002Cp007Participant): boolean {
  return left.seat.row === right.seat.row;
}

export function areOpposite(left: Sea002Cp007Participant, right: Sea002Cp007Participant): boolean {
  return left.seat.row !== right.seat.row && left.seat.position === right.seat.position;
}

export function sitsRelative(
  subject: Sea002Cp007Participant,
  reference: Sea002Cp007Participant,
  direction: "LEFT" | "RIGHT",
  distance = 1,
): boolean {
  const target = relativeSeat(reference, direction, distance);
  return subject.seat.row === target.row && subject.seat.position === target.position;
}

export function facingRelation(
  left: Sea002Cp007Participant,
  right: Sea002Cp007Participant,
): "SAME" | "OPPOSITE" {
  return left.facing === right.facing ? "SAME" : "OPPOSITE";
}

export function validateState(
  participants: readonly Sea002Cp007Participant[],
  width: number,
): void {
  if (!Number.isInteger(width) || width < 3 || width > 6) {
    throw new Error(`SEA-CP-007 width ${width} is outside discovery bounds 3..6.`);
  }
  if (participants.length !== width * 2) {
    throw new Error(`SEA-CP-007 requires ${width * 2} participants for width ${width}.`);
  }
  const ids = new Set<string>();
  const seats = new Set<string>();
  for (const participant of participants) {
    if (ids.has(participant.id)) throw new Error(`Duplicate participant ${participant.id}.`);
    ids.add(participant.id);
    if (participant.seat.position < 0 || participant.seat.position >= width) {
      throw new Error(`${participant.id} has an out-of-range position.`);
    }
    const key = seatKey(participant.seat);
    if (seats.has(key)) throw new Error(`Duplicate occupied seat ${key}.`);
    seats.add(key);
  }
  for (const row of ["TOP", "BOTTOM"] as const satisfies readonly Sea002Cp007Row[]) {
    for (let position = 0; position < width; position += 1) {
      if (!seats.has(`${row}:${position}`)) throw new Error(`Unoccupied seat ${row}:${position}.`);
    }
  }
}
