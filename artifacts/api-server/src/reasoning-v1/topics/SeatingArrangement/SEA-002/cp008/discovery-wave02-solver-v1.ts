import {
  squareOppositeIndex,
  squareRelativeIndex,
  squareSeat,
  type Sea002Cp008Facing,
} from "./topology-v1.ts";
import type { Sea002Cp008DiscoveryClue } from "./discovery-v1.ts";
import type { Sea002Cp008Wave02Caselet } from "./discovery-wave02-v1.ts";

function opposite(value: Sea002Cp008Facing): Sea002Cp008Facing {
  return value === "IN" ? "OUT" : "IN";
}

function inferFacing(caselet: Sea002Cp008Wave02Caselet): Readonly<Record<string, Sea002Cp008Facing>> | null {
  if (caselet.facingMode !== "MIXED") return null;
  const map = new Map<string, Sea002Cp008Facing>();
  for (const clue of caselet.clues) if (clue.kind === "FACING_ANCHOR") map.set(clue.person, clue.facing);
  let changed = true;
  while (changed) {
    changed = false;
    for (const clue of caselet.clues) {
      if (clue.kind !== "FACING_RELATION") continue;
      const a = map.get(clue.a);
      const b = map.get(clue.b);
      if (a && !b) {
        map.set(clue.b, clue.relation === "SAME" ? a : opposite(a));
        changed = true;
      } else if (b && !a) {
        map.set(clue.a, clue.relation === "SAME" ? b : opposite(b));
        changed = true;
      }
    }
  }
  if (caselet.participants.some((participant) => !map.has(participant.id))) {
    throw new Error(`${caselet.prototypeId}: mixed facing graph is incomplete.`);
  }
  return Object.freeze(Object.fromEntries([...map.entries()]));
}

function facingFor(caselet: Sea002Cp008Wave02Caselet, person: string, mixed: Readonly<Record<string, Sea002Cp008Facing>> | null): Sea002Cp008Facing {
  if (caselet.facingMode === "ALL_IN") return "IN";
  if (caselet.facingMode === "ALL_OUT") return "OUT";
  return mixed![person]!;
}

function satisfied(
  clue: Sea002Cp008DiscoveryClue,
  caselet: Sea002Cp008Wave02Caselet,
  assigned: ReadonlyMap<string, number>,
  mixed: Readonly<Record<string, Sea002Cp008Facing>> | null,
): boolean {
  if (clue.kind === "ROLE") {
    const seat = assigned.get(clue.person);
    return seat === undefined || squareSeat("ALT8_CORNERS_MIDDLES", seat).role === clue.role;
  }
  if (clue.kind === "FACING_ANCHOR") {
    return facingFor(caselet, clue.person, mixed) === clue.facing;
  }
  if (clue.kind === "FACING_RELATION") {
    const a = facingFor(caselet, clue.a, mixed);
    const b = facingFor(caselet, clue.b, mixed);
    return clue.relation === "SAME" ? a === b : a !== b;
  }
  if (clue.kind === "RELATIVE") {
    const subject = assigned.get(clue.subject);
    const reference = assigned.get(clue.reference);
    if (subject === undefined || reference === undefined) return true;
    return subject === squareRelativeIndex(
      "ALT8_CORNERS_MIDDLES",
      reference,
      facingFor(caselet, clue.reference, mixed),
      clue.direction,
      clue.steps,
    );
  }
  if (clue.kind === "OPPOSITE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    return a === undefined || b === undefined || b === squareOppositeIndex("ALT8_CORNERS_MIDDLES", a);
  }
  return true;
}

function canonicalKey(seatByPerson: Readonly<Record<string, number>>): string {
  const ids = Object.keys(seatByPerson).sort();
  return Array.from({ length: 4 }, (_, turn) => {
    const shift = turn * 2;
    return ids.map((id) => `${id}:${(seatByPerson[id]! - shift + 8) % 8}`).join("|");
  }).sort()[0]!;
}

function answer(caselet: Sea002Cp008Wave02Caselet, seatByPerson: Readonly<Record<string, number>>, mixed: Readonly<Record<string, Sea002Cp008Facing>> | null): string {
  const reference = seatByPerson[caselet.query.reference]!;
  const target = caselet.query.kind === "OPPOSITE"
    ? squareOppositeIndex("ALT8_CORNERS_MIDDLES", reference)
    : squareRelativeIndex(
      "ALT8_CORNERS_MIDDLES",
      reference,
      facingFor(caselet, caselet.query.reference, mixed),
      caselet.query.direction!,
      caselet.query.steps!,
    );
  return Object.entries(seatByPerson).find(([, seat]) => seat === target)![0];
}

export function independentlySolveSea002Cp008Wave02Caselet(caselet: Sea002Cp008Wave02Caselet) {
  const mixed = inferFacing(caselet);
  const ids = caselet.participants.map((participant) => participant.id);
  const assigned = new Map<string, number>();
  const used = new Set<number>();
  const raw: Readonly<Record<string, number>>[] = [];

  function dfs(index: number): void {
    if (index === ids.length) {
      raw.push(Object.freeze(Object.fromEntries(assigned.entries())));
      return;
    }
    const person = ids[index]!;
    for (let seat = 0; seat < 8; seat += 1) {
      if (used.has(seat)) continue;
      assigned.set(person, seat);
      used.add(seat);
      if (caselet.clues.every((clue) => satisfied(clue, caselet, assigned, mixed))) dfs(index + 1);
      used.delete(seat);
      assigned.delete(person);
    }
  }

  dfs(0);
  const canonical = new Set(raw.map(canonicalKey));
  const answers = new Set(raw.map((state) => answer(caselet, state, mixed)));
  return Object.freeze({
    rawSolutionCount: raw.length,
    rotationallyUniqueSolutionCount: canonical.size,
    queryAnswers: Object.freeze([...answers].sort()),
  });
}
