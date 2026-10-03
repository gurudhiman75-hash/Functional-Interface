import {
  squareOppositeIndex,
  squareRelativeIndex,
  squareSameSide,
  squareSeat,
} from "./topology-v1.ts";
import {
  SEA002_CP008_ALT12_SCHEMA,
  SEA002_CP008_ALT12_SEAT_SPACING_METRES,
  type Sea002Cp008Alt12Caselet,
  type Sea002Cp008Alt12Clue,
} from "./discovery-alt12-v1.ts";

const ROTATION_SHIFTS = Object.freeze([0, 3, 6, 9] as const);

function clueSatisfied(clue: Sea002Cp008Alt12Clue, assigned: ReadonlyMap<string, number>): boolean {
  if (clue.kind === "ROLE") {
    const seat = assigned.get(clue.person);
    return seat === undefined || squareSeat(SEA002_CP008_ALT12_SCHEMA, seat).role === clue.role;
  }
  if (clue.kind === "SAME_SIDE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    return a === undefined || b === undefined || squareSameSide(SEA002_CP008_ALT12_SCHEMA, a, b);
  }
  if (clue.kind === "OPPOSITE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    return a === undefined || b === undefined || b === squareOppositeIndex(SEA002_CP008_ALT12_SCHEMA, a);
  }
  const subject = assigned.get(clue.subject);
  const reference = assigned.get(clue.reference);
  if (subject === undefined || reference === undefined) return true;
  return subject === squareRelativeIndex(
    SEA002_CP008_ALT12_SCHEMA,
    reference,
    "IN",
    clue.direction,
    clue.metres / SEA002_CP008_ALT12_SEAT_SPACING_METRES,
  );
}

function clueDegree(caselet: Sea002Cp008Alt12Caselet, person: string): number {
  return caselet.clues.reduce((score, clue) => {
    if (clue.kind === "ROLE") return score + Number(clue.person === person);
    if (clue.kind === "RELATIVE_METRIC") return score + Number(clue.subject === person || clue.reference === person);
    return score + Number(clue.a === person || clue.b === person);
  }, 0);
}

function canonicalQuarterTurnKey(seatByPerson: Readonly<Record<string, number>>): string {
  const ids = Object.keys(seatByPerson).sort();
  return ROTATION_SHIFTS
    .map((shift) => ids.map((id) => `${id}:${(seatByPerson[id]! - shift + 12) % 12}`).join("|"))
    .sort()[0]!;
}

function answerForState(caselet: Sea002Cp008Alt12Caselet, seatByPerson: Readonly<Record<string, number>>): string {
  const referenceSeat = seatByPerson[caselet.query.reference]!;
  const targetSeat = caselet.query.kind === "OPPOSITE"
    ? squareOppositeIndex(SEA002_CP008_ALT12_SCHEMA, referenceSeat)
    : squareRelativeIndex(
      SEA002_CP008_ALT12_SCHEMA,
      referenceSeat,
      "IN",
      caselet.query.direction!,
      caselet.query.metres! / SEA002_CP008_ALT12_SEAT_SPACING_METRES,
    );
  const person = Object.entries(seatByPerson).find(([, seat]) => seat === targetSeat)?.[0];
  if (!person) throw new Error("ALT12 solved state is missing query target seat.");
  return person;
}

export function independentlySolveSea002Cp008Alt12Caselet(caselet: Sea002Cp008Alt12Caselet) {
  const ids = caselet.participants.map((participant) => participant.id);
  const order = [...ids].sort((a, b) => clueDegree(caselet, b) - clueDegree(caselet, a) || a.localeCompare(b));
  const assigned = new Map<string, number>();
  const used = new Set<number>();
  const rawStates: Readonly<Record<string, number>>[] = [];

  function dfs(index: number): void {
    if (rawStates.length > 16) return;
    if (index === order.length) {
      rawStates.push(Object.freeze(Object.fromEntries([...assigned.entries()])));
      return;
    }
    const person = order[index]!;
    for (let seat = 0; seat < 12; seat += 1) {
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
  for (const state of rawStates) canonical.set(canonicalQuarterTurnKey(state), state);
  const answers = new Set(rawStates.map((state) => answerForState(caselet, state)));
  return Object.freeze({
    rawSolutionCount: rawStates.length,
    quarterTurnUniqueSolutionCount: canonical.size,
    queryAnswers: Object.freeze([...answers].sort()),
    solvedStates: Object.freeze([...canonical.values()]),
  });
}
