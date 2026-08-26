import {
  squareOppositeIndex,
  squareQuarterSpan,
  squareRelativeIndex,
  squareRoleFacing,
  squareSameSide,
  squareSeat,
  squareSeatCount,
  type Sea002Cp008SquareSchema,
} from "./topology-v1.ts";
import {
  SEA002_CP008_VARIABLE_SIDE6_SYMMETRY,
  variableSide6OppositeIndex,
  variableSide6RelativeIndex,
  variableSide6SameSide,
  variableSide6Seat,
} from "./variable-side6-topology-v1.ts";
import type {
  Sea002Cp008ProductionClueV3,
  Sea002Cp008ProductionFacingV3,
  Sea002Cp008ProductionQueryV3,
  Sea002Cp008ProductionTopologyV3,
} from "./production-clue-compiler-v3.ts";

export type Sea002Cp008ProductionSolveInputV3 = Readonly<{
  topology: Sea002Cp008ProductionTopologyV3;
  facingMode: string;
  participantIds: readonly string[];
  clues: readonly Sea002Cp008ProductionClueV3[];
  query: Sea002Cp008ProductionQueryV3;
}>;

type State = Readonly<{
  seatByPerson: Readonly<Record<string, number>>;
  facingByPerson: Readonly<Record<string, Sea002Cp008ProductionFacingV3>>;
}>;

function schemaFor(topology: Sea002Cp008ProductionTopologyV3): Sea002Cp008SquareSchema | null {
  if (topology === "VARIABLE_SIDE6") return null;
  if (topology === "ALT12_ROLE_DERIVED" || topology === "ALT12_METRIC") return "ALT12_CORNER_PLUS_TWO_SIDE";
  if (topology === "SIDEPAIR8_UNIFORM" || topology === "SIDEPAIR8_MIXED") return "SIDEPAIR8";
  return "ALT8_CORNERS_MIDDLES";
}

function seatCount(input: Sea002Cp008ProductionSolveInputV3): number {
  const schema = schemaFor(input.topology);
  return schema ? squareSeatCount(schema) : 6;
}

function oppositeFacing(value: Sea002Cp008ProductionFacingV3): Sea002Cp008ProductionFacingV3 {
  return value === "IN" ? "OUT" : "IN";
}

function inferIndependentFacing(input: Sea002Cp008ProductionSolveInputV3): Readonly<Record<string, Sea002Cp008ProductionFacingV3>> | null {
  if (input.topology !== "ALT8_MIXED" && input.topology !== "SIDEPAIR8_MIXED") return null;
  const facing = new Map<string, Sea002Cp008ProductionFacingV3>();
  for (const clue of input.clues) if (clue.kind === "FACING_ANCHOR") facing.set(clue.person, clue.facing);
  let changed = true;
  while (changed) {
    changed = false;
    for (const clue of input.clues) {
      if (clue.kind !== "FACING_RELATION") continue;
      const a = facing.get(clue.a);
      const b = facing.get(clue.b);
      if (a && !b) {
        facing.set(clue.b, clue.relation === "SAME" ? a : oppositeFacing(a));
        changed = true;
      } else if (b && !a) {
        facing.set(clue.a, clue.relation === "SAME" ? b : oppositeFacing(b));
        changed = true;
      } else if (a && b) {
        const expected = clue.relation === "SAME" ? a : oppositeFacing(a);
        if (b !== expected) throw new Error("CP008 V3 facing graph is inconsistent.");
      }
    }
  }
  if (input.participantIds.some((id) => !facing.has(id))) throw new Error("CP008 V3 facing graph does not infer every participant.");
  return Object.freeze(Object.fromEntries(input.participantIds.map((id) => [id, facing.get(id)!])));
}

function facingFor(
  input: Sea002Cp008ProductionSolveInputV3,
  person: string,
  seatIndex: number,
  independentFacing: Readonly<Record<string, Sea002Cp008ProductionFacingV3>> | null,
): Sea002Cp008ProductionFacingV3 {
  if (input.topology === "ALT8_MIXED" || input.topology === "SIDEPAIR8_MIXED") return independentFacing![person]!;
  if (input.topology === "ALT8_ROLE_DERIVED" || input.topology === "ALT12_ROLE_DERIVED") {
    const schema = schemaFor(input.topology)!;
    if (input.facingMode !== "CORNERS_IN_SIDES_OUT" && input.facingMode !== "CORNERS_OUT_SIDES_IN") {
      throw new Error(`CP008 V3 role-derived facing mode ${input.facingMode} is invalid.`);
    }
    return squareRoleFacing(squareSeat(schema, seatIndex).role, input.facingMode);
  }
  if (input.facingMode === "ALL_OUT") return "OUT";
  return "IN";
}

function clueSatisfied(
  input: Sea002Cp008ProductionSolveInputV3,
  clue: Sea002Cp008ProductionClueV3,
  assigned: ReadonlyMap<string, number>,
  independentFacing: Readonly<Record<string, Sea002Cp008ProductionFacingV3>> | null,
): boolean {
  const schema = schemaFor(input.topology);
  if (clue.kind === "ROLE") {
    const seat = assigned.get(clue.person);
    return seat === undefined || (schema !== null && squareSeat(schema, seat).role === clue.role);
  }
  if (clue.kind === "OCCUPANCY_CLASS") {
    const seat = assigned.get(clue.person);
    return seat === undefined || variableSide6Seat(seat).occupancyKind === clue.occupancyKind;
  }
  if (clue.kind === "FACING_ANCHOR") {
    const seat = assigned.get(clue.person);
    return seat === undefined || facingFor(input, clue.person, seat, independentFacing) === clue.facing;
  }
  if (clue.kind === "FACING_RELATION") {
    if (input.topology === "ALT8_MIXED" || input.topology === "SIDEPAIR8_MIXED") {
      const a = independentFacing![clue.a]!;
      const b = independentFacing![clue.b]!;
      return clue.relation === "SAME" ? a === b : a !== b;
    }
    const aSeat = assigned.get(clue.a);
    const bSeat = assigned.get(clue.b);
    if (aSeat === undefined || bSeat === undefined) return true;
    const a = facingFor(input, clue.a, aSeat, independentFacing);
    const b = facingFor(input, clue.b, bSeat, independentFacing);
    return clue.relation === "SAME" ? a === b : a !== b;
  }
  if (clue.kind === "SAME_SIDE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    if (a === undefined || b === undefined) return true;
    return schema === null ? variableSide6SameSide(a, b) : squareSameSide(schema, a, b);
  }
  if (clue.kind === "OPPOSITE") {
    const a = assigned.get(clue.a);
    const b = assigned.get(clue.b);
    if (a === undefined || b === undefined) return true;
    return b === (schema === null ? variableSide6OppositeIndex(a) : squareOppositeIndex(schema, a));
  }
  const subject = assigned.get(clue.subject);
  const reference = assigned.get(clue.reference);
  if (subject === undefined || reference === undefined) return true;
  const facing = facingFor(input, clue.reference, reference, independentFacing);
  if (clue.kind === "RELATIVE_METRIC") {
    if (schema === null) return false;
    return subject === squareRelativeIndex(schema, reference, facing, clue.direction, clue.metres / 5);
  }
  return subject === (schema === null
    ? variableSide6RelativeIndex(reference, facing, clue.direction, clue.steps)
    : squareRelativeIndex(schema, reference, facing, clue.direction, clue.steps));
}

function clueDegree(input: Sea002Cp008ProductionSolveInputV3, person: string): number {
  return input.clues.reduce((score, clue) => {
    if (clue.kind === "ROLE" || clue.kind === "FACING_ANCHOR" || clue.kind === "OCCUPANCY_CLASS") return score + Number(clue.person === person);
    if (clue.kind === "RELATIVE" || clue.kind === "RELATIVE_METRIC") return score + Number(clue.subject === person || clue.reference === person);
    return score + Number(clue.a === person || clue.b === person);
  }, 0);
}

function canonicalKey(input: Sea002Cp008ProductionSolveInputV3, seatByPerson: Readonly<Record<string, number>>): string {
  const ids = [...input.participantIds].sort();
  const schema = schemaFor(input.topology);
  const count = seatCount(input);
  const shifts = schema === null
    ? SEA002_CP008_VARIABLE_SIDE6_SYMMETRY.legitimateRotationShifts
    : Object.freeze(Array.from({ length: 4 }, (_, turn) => turn * squareQuarterSpan(schema)));
  return shifts
    .map((shift) => ids.map((id) => `${id}:${(seatByPerson[id]! - shift + count) % count}`).join("|"))
    .sort()[0]!;
}

function answerForState(
  input: Sea002Cp008ProductionSolveInputV3,
  state: State,
): string {
  const schema = schemaFor(input.topology);
  const referenceSeat = state.seatByPerson[input.query.reference]!;
  let targetSeat: number;
  if (input.query.kind === "OPPOSITE") {
    targetSeat = schema === null ? variableSide6OppositeIndex(referenceSeat) : squareOppositeIndex(schema, referenceSeat);
  } else {
    const facing = state.facingByPerson[input.query.reference]!;
    const steps = input.query.kind === "RELATIVE_METRIC" ? input.query.metres! / 5 : input.query.steps!;
    targetSeat = schema === null
      ? variableSide6RelativeIndex(referenceSeat, facing, input.query.direction!, steps)
      : squareRelativeIndex(schema, referenceSeat, facing, input.query.direction!, steps);
  }
  const person = Object.entries(state.seatByPerson).find(([, seat]) => seat === targetSeat)?.[0];
  if (!person) throw new Error("CP008 V3 solved state has no query target.");
  return person;
}

export function independentlySolveSea002Cp008ProductionLearnerGraphV3(input: Sea002Cp008ProductionSolveInputV3) {
  const count = seatCount(input);
  if (input.participantIds.length !== count) throw new Error(`CP008 V3 solver expected ${count} participants.`);
  const independentFacing = inferIndependentFacing(input);
  const order = [...input.participantIds].sort((a, b) => clueDegree(input, b) - clueDegree(input, a) || a.localeCompare(b));
  const assigned = new Map<string, number>();
  const used = new Set<number>();
  const rawStates: State[] = [];

  function dfs(index: number): void {
    if (rawStates.length > 64) return;
    if (index === order.length) {
      const seatByPerson = Object.freeze(Object.fromEntries([...assigned.entries()]));
      const facingByPerson = Object.freeze(Object.fromEntries(input.participantIds.map((id) => [
        id,
        facingFor(input, id, seatByPerson[id]!, independentFacing),
      ])));
      rawStates.push(Object.freeze({ seatByPerson, facingByPerson }));
      return;
    }
    const person = order[index]!;
    for (let seat = 0; seat < count; seat += 1) {
      if (used.has(seat)) continue;
      assigned.set(person, seat);
      used.add(seat);
      if (input.clues.every((clue) => clueSatisfied(input, clue, assigned, independentFacing))) dfs(index + 1);
      used.delete(seat);
      assigned.delete(person);
    }
  }

  dfs(0);
  const canonical = new Map<string, State>();
  for (const state of rawStates) canonical.set(canonicalKey(input, state.seatByPerson), state);
  const answers = new Set(rawStates.map((state) => answerForState(input, state)));
  return Object.freeze({
    rawSolutionCount: rawStates.length,
    rotationallyUniqueSolutionCount: canonical.size,
    queryAnswers: Object.freeze([...answers].sort()),
    solvedStates: Object.freeze([...canonical.values()]),
  });
}
