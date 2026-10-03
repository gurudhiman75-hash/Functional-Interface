import {
  SEA002_CP008_VARIABLE_SIDE6_SYMMETRY,
  variableSide6OppositeIndex,
  variableSide6RelativeIndex,
  variableSide6SameSide,
  variableSide6Seat,
} from "./variable-side6-topology-v1.ts";
import type {
  Sea002Cp008VariableSide6Caselet,
  Sea002Cp008VariableSide6Clue,
} from "./discovery-variable-side6-v1.ts";

function clueSatisfied(
  clue: Sea002Cp008VariableSide6Clue,
  assigned: ReadonlyMap<string, number>,
): boolean {
  if (clue.kind === "OCCUPANCY_CLASS") {
    const seat = assigned.get(clue.person);
    return seat === undefined || variableSide6Seat(seat).occupancyKind === clue.occupancyKind;
  }
  if (clue.kind === "SAME_SIDE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    return a === undefined || b === undefined || variableSide6SameSide(a, b);
  }
  if (clue.kind === "OPPOSITE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    return a === undefined || b === undefined || b === variableSide6OppositeIndex(a);
  }
  const subject = assigned.get(clue.subject);
  const reference = assigned.get(clue.reference);
  if (subject === undefined || reference === undefined) return true;
  return subject === variableSide6RelativeIndex(reference, "IN", clue.direction, clue.steps);
}

function clueDegree(caselet: Sea002Cp008VariableSide6Caselet, person: string): number {
  return caselet.clues.reduce((score, clue) => {
    if (clue.kind === "OCCUPANCY_CLASS") return score + Number(clue.person === person);
    if (clue.kind === "RELATIVE") return score + Number(clue.subject === person || clue.reference === person);
    return score + Number(clue.a === person || clue.b === person);
  }, 0);
}

function canonicalHalfTurnKey(seatByPerson: Readonly<Record<string, number>>): string {
  const ids = Object.keys(seatByPerson).sort();
  return SEA002_CP008_VARIABLE_SIDE6_SYMMETRY.legitimateRotationShifts
    .map((shift) => ids.map((id) => `${id}:${(seatByPerson[id]! - shift + 6) % 6}`).join("|"))
    .sort()[0]!;
}

function answerForState(
  caselet: Sea002Cp008VariableSide6Caselet,
  seatByPerson: Readonly<Record<string, number>>,
): string {
  const referenceSeat = seatByPerson[caselet.query.reference]!;
  const targetSeat = caselet.query.kind === "OPPOSITE"
    ? variableSide6OppositeIndex(referenceSeat)
    : variableSide6RelativeIndex(
      referenceSeat,
      "IN",
      caselet.query.direction!,
      caselet.query.steps!,
    );
  const person = Object.entries(seatByPerson).find(([, seat]) => seat === targetSeat)?.[0];
  if (!person) throw new Error("VARIABLE_SIDE6 solved state is missing the query target seat.");
  return person;
}

export function independentlySolveSea002Cp008VariableSide6Caselet(
  caselet: Sea002Cp008VariableSide6Caselet,
) {
  const ids = caselet.participants.map((participant) => participant.id);
  const order = [...ids].sort((a, b) => clueDegree(caselet, b) - clueDegree(caselet, a) || a.localeCompare(b));
  const assigned = new Map<string, number>();
  const used = new Set<number>();
  const rawStates: Readonly<Record<string, number>>[] = [];

  function dfs(index: number): void {
    if (rawStates.length > 32) return;
    if (index === order.length) {
      rawStates.push(Object.freeze(Object.fromEntries([...assigned.entries()])));
      return;
    }
    const person = order[index]!;
    for (let seat = 0; seat < 6; seat += 1) {
      if (used.has(seat)) continue;
      assigned.set(person, seat);
      used.add(seat);
      if (caselet.clues.every((clue) => clueSatisfied(clue, assigned))) dfs(index + 1);
      used.delete(seat);
      assigned.delete(person);
    }
  }

  dfs(0);
  const canonical = new Map<string, Readonly<Record<string, number>>>();
  for (const state of rawStates) canonical.set(canonicalHalfTurnKey(state), state);
  const answers = new Set(rawStates.map((state) => answerForState(caselet, state)));
  return Object.freeze({
    rawSolutionCount: rawStates.length,
    halfTurnUniqueSolutionCount: canonical.size,
    queryAnswers: Object.freeze([...answers].sort()),
    solvedStates: Object.freeze([...canonical.values()]),
  });
}
