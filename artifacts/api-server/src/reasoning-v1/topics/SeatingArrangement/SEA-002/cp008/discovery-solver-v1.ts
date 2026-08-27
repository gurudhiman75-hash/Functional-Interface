import {
  squareOppositeIndex,
  squareQuarterSpan,
  squareRelativeIndex,
  squareRoleFacing,
  squareSameSide,
  squareSeat,
  squareSeatCount,
  type Sea002Cp008Facing,
} from "./topology-v1.ts";
import type {
  Sea002Cp008DiscoveryCaselet,
  Sea002Cp008DiscoveryClue,
} from "./discovery-v1.ts";

export type Sea002Cp008SolvedState = Readonly<{
  seatByPerson: Readonly<Record<string, number>>;
  facingByPerson: Readonly<Record<string, Sea002Cp008Facing>>;
}>;

function oppositeFacing(value: Sea002Cp008Facing): Sea002Cp008Facing {
  return value === "IN" ? "OUT" : "IN";
}

function inferMixedFacing(caselet: Sea002Cp008DiscoveryCaselet): Readonly<Record<string, Sea002Cp008Facing>> {
  const facing = new Map<string, Sea002Cp008Facing>();
  for (const clue of caselet.clues) {
    if (clue.kind === "FACING_ANCHOR") facing.set(clue.person, clue.facing);
  }
  let changed = true;
  while (changed) {
    changed = false;
    for (const clue of caselet.clues) {
      if (clue.kind !== "FACING_RELATION") continue;
      const left = facing.get(clue.a);
      const right = facing.get(clue.b);
      if (left && !right) {
        facing.set(clue.b, clue.relation === "SAME" ? left : oppositeFacing(left));
        changed = true;
      } else if (right && !left) {
        facing.set(clue.a, clue.relation === "SAME" ? right : oppositeFacing(right));
        changed = true;
      } else if (left && right) {
        const expected = clue.relation === "SAME" ? left : oppositeFacing(left);
        if (right !== expected) throw new Error(`${caselet.prototypeId}: inconsistent mixed-facing clue graph.`);
      }
    }
  }
  const ids = caselet.participants.map((participant) => participant.id);
  if (ids.some((id) => !facing.has(id))) throw new Error(`${caselet.prototypeId}: mixed-facing graph is not fully connected.`);
  return Object.freeze(Object.fromEntries(ids.map((id) => [id, facing.get(id)!])));
}

function facingFor(
  caselet: Sea002Cp008DiscoveryCaselet,
  person: string,
  seatIndex: number,
  mixedFacing: Readonly<Record<string, Sea002Cp008Facing>> | null,
): Sea002Cp008Facing {
  if (caselet.facingMode === "ALL_IN") return "IN";
  if (caselet.facingMode === "MIXED") return mixedFacing![person]!;
  return squareRoleFacing(squareSeat(caselet.schema, seatIndex).role, caselet.facingMode);
}

function clueSatisfiedWhenReady(
  clue: Sea002Cp008DiscoveryClue,
  caselet: Sea002Cp008DiscoveryCaselet,
  assigned: ReadonlyMap<string, number>,
  mixedFacing: Readonly<Record<string, Sea002Cp008Facing>> | null,
): boolean {
  if (clue.kind === "ROLE") {
    const seat = assigned.get(clue.person);
    return seat === undefined || squareSeat(caselet.schema, seat).role === clue.role;
  }
  if (clue.kind === "FACING_ANCHOR") {
    const seat = assigned.get(clue.person);
    return seat === undefined || facingFor(caselet, clue.person, seat, mixedFacing) === clue.facing;
  }
  if (clue.kind === "FACING_RELATION") {
    const aSeat = assigned.get(clue.a);
    const bSeat = assigned.get(clue.b);
    if (aSeat === undefined || bSeat === undefined) return true;
    const a = facingFor(caselet, clue.a, aSeat, mixedFacing);
    const b = facingFor(caselet, clue.b, bSeat, mixedFacing);
    return clue.relation === "SAME" ? a === b : a !== b;
  }
  if (clue.kind === "RELATIVE") {
    const subject = assigned.get(clue.subject);
    const reference = assigned.get(clue.reference);
    if (subject === undefined || reference === undefined) return true;
    const facing = facingFor(caselet, clue.reference, reference, mixedFacing);
    return subject === squareRelativeIndex(caselet.schema, reference, facing, clue.direction, clue.steps);
  }
  if (clue.kind === "OPPOSITE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    return a === undefined || b === undefined || b === squareOppositeIndex(caselet.schema, a);
  }
  const a = assigned.get(clue.a);
  const b = assigned.get(clue.b);
  return a === undefined || b === undefined || squareSameSide(caselet.schema, a, b);
}

function clueDegree(caselet: Sea002Cp008DiscoveryCaselet, person: string): number {
  return caselet.clues.reduce((count, clue) => {
    if (clue.kind === "ROLE" || clue.kind === "FACING_ANCHOR") return count + Number(clue.person === person);
    if (clue.kind === "RELATIVE") return count + Number(clue.subject === person || clue.reference === person);
    return count + Number(clue.a === person || clue.b === person);
  }, 0);
}

function canonicalRotationKey(caselet: Sea002Cp008DiscoveryCaselet, seatByPerson: Readonly<Record<string, number>>): string {
  const ids = Object.keys(seatByPerson).sort();
  const count = squareSeatCount(caselet.schema);
  const step = squareQuarterSpan(caselet.schema);
  const variants = Array.from({ length: 4 }, (_, quarterTurns) => {
    const shift = quarterTurns * step;
    return ids.map((id) => `${id}:${(seatByPerson[id]! - shift + count) % count}`).join("|");
  });
  return variants.sort()[0]!;
}

function answerForState(caselet: Sea002Cp008DiscoveryCaselet, state: Sea002Cp008SolvedState): string {
  const referenceSeat = state.seatByPerson[caselet.query.reference]!;
  const targetSeat = caselet.query.kind === "OPPOSITE"
    ? squareOppositeIndex(caselet.schema, referenceSeat)
    : squareRelativeIndex(
      caselet.schema,
      referenceSeat,
      state.facingByPerson[caselet.query.reference]!,
      caselet.query.direction!,
      caselet.query.steps!,
    );
  const entry = Object.entries(state.seatByPerson).find(([, seat]) => seat === targetSeat);
  if (!entry) throw new Error(`${caselet.prototypeId}: solved state has no query target seat.`);
  return entry[0];
}

export function independentlySolveSea002Cp008DiscoveryCaselet(caselet: Sea002Cp008DiscoveryCaselet) {
  const ids = caselet.participants.map((participant) => participant.id);
  const mixedFacing = caselet.facingMode === "MIXED" ? inferMixedFacing(caselet) : null;
  const order = [...ids].sort((a, b) => clueDegree(caselet, b) - clueDegree(caselet, a) || a.localeCompare(b));
  const count = squareSeatCount(caselet.schema);
  const assigned = new Map<string, number>();
  const used = new Set<number>();
  const rawStates: Sea002Cp008SolvedState[] = [];

  function dfs(index: number): void {
    if (rawStates.length > 64) return;
    if (index === order.length) {
      const seatByPerson = Object.freeze(Object.fromEntries([...assigned.entries()]));
      const facingByPerson = Object.freeze(Object.fromEntries(ids.map((id) => [
        id,
        facingFor(caselet, id, seatByPerson[id]!, mixedFacing),
      ])));
      rawStates.push(Object.freeze({ seatByPerson, facingByPerson }));
      return;
    }
    const person = order[index]!;
    for (let seat = 0; seat < count; seat += 1) {
      if (used.has(seat)) continue;
      assigned.set(person, seat);
      used.add(seat);
      if (caselet.clues.every((clue) => clueSatisfiedWhenReady(clue, caselet, assigned, mixedFacing))) dfs(index + 1);
      used.delete(seat);
      assigned.delete(person);
    }
  }

  dfs(0);
  const canonical = new Map<string, Sea002Cp008SolvedState>();
  for (const state of rawStates) canonical.set(canonicalRotationKey(caselet, state.seatByPerson), state);
  const answers = new Set(rawStates.map((state) => answerForState(caselet, state)));
  return Object.freeze({
    rawSolutionCount: rawStates.length,
    rotationallyUniqueSolutionCount: canonical.size,
    queryAnswers: Object.freeze([...answers].sort()),
    solvedStates: Object.freeze([...canonical.values()]),
  });
}
