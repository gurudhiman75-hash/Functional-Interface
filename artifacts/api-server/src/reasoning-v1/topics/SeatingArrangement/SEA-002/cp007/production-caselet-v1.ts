import { createHash } from "node:crypto";

import {
  SEA002_CP007_DISCOVERY_LIFECYCLE,
  type Sea002Cp007Facing,
  type Sea002Cp007Participant,
  type Sea002Cp007Row,
} from "./types.ts";
import { relativeDelta, validateState } from "./solver.ts";

export type Sea002Cp007CandidateAuthorityKey =
  | "CP007-AUTH-01"
  | "CP007-AUTH-02"
  | "CP007-AUTH-03"
  | "CP007-AUTH-04";

export type Sea002Cp007ProductionClue =
  | Readonly<{ kind: "FACING_ANCHOR"; person: string; facing: Sea002Cp007Facing }>
  | Readonly<{ kind: "FACING_RELATION"; left: string; right: string; relation: "SAME" | "OPPOSITE" }>
  | Readonly<{ kind: "ROW_ANCHOR"; person: string; row: Sea002Cp007Row }>
  | Readonly<{ kind: "SAME_ROW_OFFSET"; subject: string; reference: string; direction: "LEFT" | "RIGHT"; distance: number }>
  | Readonly<{ kind: "OPPOSITE"; left: string; right: string }>
  | Readonly<{ kind: "DIAGONAL"; subject: string; reference: string; direction: "LEFT" | "RIGHT" }>;

export type Sea002Cp007ProductionCaselet = Readonly<{
  caseletId: string;
  seed: string;
  width: number;
  authorityKey: Sea002Cp007CandidateAuthorityKey;
  participants: readonly Sea002Cp007Participant[];
  rowGroups: Readonly<{ top: readonly string[]; bottom: readonly string[] }>;
  rowMembershipMode: "GIVEN" | "INFERRED";
  clues: readonly Sea002Cp007ProductionClue[];
  stem: string;
  question: string;
  options: readonly string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  mathematicalFingerprint: string;
  lifecycle: typeof SEA002_CP007_DISCOVERY_LIFECYCLE;
}>;

const NAMES = Object.freeze([
  "Aarav", "Aditi", "Kabir", "Mehak", "Rohan", "Simran",
  "Arjun", "Isha", "Karan", "Neha", "Yash", "Zoya",
]);

function hashInt(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const shift = values.length === 0 ? 0 : ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function stateFingerprint(participants: readonly Sea002Cp007Participant[], clues: readonly Sea002Cp007ProductionClue[]): string {
  return createHash("sha256")
    .update(JSON.stringify({ participants: [...participants].sort((a, b) => a.id.localeCompare(b.id)), clues }))
    .digest("hex");
}

function buildState(seed: string, width: number): readonly Sea002Cp007Participant[] {
  const names = rotate(NAMES, hashInt(`${seed}:names`) % NAMES.length).slice(0, width * 2);
  const participants: Sea002Cp007Participant[] = [];
  const facingParity = hashInt(`${seed}:facing`) % 2;
  let nameIndex = 0;
  for (const row of ["TOP", "BOTTOM"] as const satisfies readonly Sea002Cp007Row[]) {
    const seatNames = rotate(names.slice(nameIndex, nameIndex + width), hashInt(`${seed}:${row}:names`) % width);
    nameIndex += width;
    for (let position = 0; position < width; position += 1) {
      const rowShift = row === "BOTTOM" ? 1 : 0;
      participants.push(Object.freeze({
        id: seatNames[position]!,
        seat: Object.freeze({ row, position }),
        facing: (position + rowShift + facingParity) % 2 === 0 ? "N" : "S",
      }));
    }
  }
  validateState(participants, width);
  return Object.freeze(participants);
}

function at(
  participants: readonly Sea002Cp007Participant[], row: Sea002Cp007Row, position: number,
): Sea002Cp007Participant {
  const found = participants.find((p) => p.seat.row === row && p.seat.position === position);
  if (!found) throw new Error(`Missing participant at ${row}:${position}.`);
  return found;
}

function facingAnchorId(participants: readonly Sea002Cp007Participant[]): string {
  return [...participants].sort((a, b) => a.id.localeCompare(b.id))[0]!.id;
}

function relationDirection(reference: Sea002Cp007Participant, subjectPosition: number): "LEFT" | "RIGHT" {
  const physicalDelta = subjectPosition - reference.seat.position;
  const rightDelta = relativeDelta(reference.facing, "RIGHT");
  return Math.sign(physicalDelta) === Math.sign(rightDelta) ? "RIGHT" : "LEFT";
}

function buildFacingClues(participants: readonly Sea002Cp007Participant[]): Sea002Cp007ProductionClue[] {
  const ordered = [...participants].sort((a, b) => a.id.localeCompare(b.id));
  const clues: Sea002Cp007ProductionClue[] = [
    Object.freeze({ kind: "FACING_ANCHOR", person: ordered[0]!.id, facing: ordered[0]!.facing }),
  ];
  for (let index = 1; index < ordered.length; index += 1) {
    const left = ordered[index - 1]!;
    const right = ordered[index]!;
    clues.push(Object.freeze({
      kind: "FACING_RELATION",
      left: left.id,
      right: right.id,
      relation: left.facing === right.facing ? "SAME" : "OPPOSITE",
    }));
  }
  return clues;
}

function buildRowAnchorClue(
  participants: readonly Sea002Cp007Participant[], seed: string,
): Sea002Cp007ProductionClue {
  const anchor = participants[hashInt(`${seed}:row-anchor`) % participants.length]!;
  return Object.freeze({ kind: "ROW_ANCHOR", person: anchor.id, row: anchor.seat.row });
}

function buildSeatClues(
  participants: readonly Sea002Cp007Participant[], width: number, seed: string,
): Sea002Cp007ProductionClue[] {
  const clues: Sea002Cp007ProductionClue[] = [];
  for (let position = 0; position < width - 1; position += 1) {
    const reference = at(participants, "TOP", position);
    const subject = at(participants, "TOP", position + 1);
    clues.push(Object.freeze({
      kind: "SAME_ROW_OFFSET",
      subject: subject.id,
      reference: reference.id,
      direction: relationDirection(reference, subject.seat.position),
      distance: 1,
    }));
  }

  const split = 1 + (hashInt(`${seed}:split`) % Math.max(1, width - 2));
  for (let position = 0; position < width - 1; position += 1) {
    if (position === split - 1) continue;
    const reference = at(participants, "BOTTOM", position);
    const subject = at(participants, "BOTTOM", position + 1);
    clues.push(Object.freeze({
      kind: "SAME_ROW_OFFSET",
      subject: subject.id,
      reference: reference.id,
      direction: relationDirection(reference, subject.seat.position),
      distance: 1,
    }));
  }

  const segmentTwoAnchor = at(participants, "BOTTOM", split);
  const topOpposite = at(participants, "TOP", split);
  clues.push(Object.freeze({ kind: "OPPOSITE", left: topOpposite.id, right: segmentTwoAnchor.id }));

  const segmentOneAnchor = at(participants, "BOTTOM", split - 1);
  const diagonalReferenceCandidates = participants.filter((p) => {
    if (p.seat.row !== "TOP") return false;
    for (const direction of ["LEFT", "RIGHT"] as const) {
      if (p.seat.position + relativeDelta(p.facing, direction) === segmentOneAnchor.seat.position) return true;
    }
    return false;
  });
  const diagonalReference = diagonalReferenceCandidates[hashInt(`${seed}:diagonal-ref`) % diagonalReferenceCandidates.length]!;
  const diagonalDirection = diagonalReference.seat.position + relativeDelta(diagonalReference.facing, "RIGHT") === segmentOneAnchor.seat.position
    ? "RIGHT" as const
    : "LEFT" as const;
  clues.push(Object.freeze({
    kind: "DIAGONAL",
    subject: segmentOneAnchor.id,
    reference: diagonalReference.id,
    direction: diagonalDirection,
  }));

  return clues;
}

function renderClue(clue: Sea002Cp007ProductionClue): string {
  switch (clue.kind) {
    case "FACING_ANCHOR":
      return `${clue.person} faces ${clue.facing === "N" ? "north" : "south"}.`;
    case "FACING_RELATION":
      return `${clue.left} and ${clue.right} face in ${clue.relation === "SAME" ? "the same" : "opposite"} directions.`;
    case "ROW_ANCHOR":
      return `${clue.person} sits in the ${clue.row === "TOP" ? "upper" : "lower"} row.`;
    case "SAME_ROW_OFFSET":
      return `${clue.subject} sits ${clue.distance === 1 ? "immediately" : `${clue.distance} positions`} to the ${clue.direction.toLowerCase()} of ${clue.reference}.`;
    case "OPPOSITE":
      return `${clue.left} sits opposite ${clue.right}.`;
    case "DIAGONAL":
      return `${clue.subject} sits diagonally from ${clue.reference} in ${clue.reference}'s ${clue.direction.toLowerCase()}-hand direction.`;
  }
}

function makeOptions(answer: string, distractors: readonly string[], correctIndex: number): readonly string[] {
  const wrong = [...new Set(distractors.filter((item) => item !== answer))].slice(0, 3);
  if (wrong.length !== 3) throw new Error("Production caselet requires three unique distractors.");
  const options = [...wrong];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

function queryForAuthority(
  authorityKey: Sea002Cp007CandidateAuthorityKey,
  participants: readonly Sea002Cp007Participant[],
  seed: string,
  rowAnchorPerson?: string,
): { question: string; answer: string; distractors: string[]; explanation: string } {
  const directFacingAnchor = facingAnchorId(participants);
  if (authorityKey === "CP007-AUTH-01") {
    const references = participants.filter((p) => p.seat.position > 0 && p.seat.position < Math.max(...participants.map((x) => x.seat.position)));
    const reference = references[hashInt(`${seed}:qref`) % references.length]!;
    const direction = hashInt(`${seed}:qdir`) % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
    const targetPosition = reference.seat.position + relativeDelta(reference.facing, direction);
    const target = at(participants, reference.seat.row, targetPosition);
    return {
      question: `Who sits immediately to the ${direction.toLowerCase()} of ${reference.id}?`,
      answer: target.id,
      distractors: participants.filter((p) => p.id !== target.id).slice(0, 3).map((p) => p.id),
      explanation: `${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. From that facing, the immediate ${direction.toLowerCase()} position is position ${targetPosition + 1} in the same row, occupied by ${target.id}.`,
    };
  }
  if (authorityKey === "CP007-AUTH-02") {
    const candidates = participants.filter((p) => p.id !== directFacingAnchor);
    const target = candidates[hashInt(`${seed}:qtarget`) % candidates.length]!;
    const answer = target.facing === "N" ? "North" : "South";
    return {
      question: `Which direction does ${target.id} face?`,
      answer,
      distractors: answer === "North" ? ["South", "Cannot be determined", "Either north or south"] : ["North", "Cannot be determined", "Either north or south"],
      explanation: `Starting from the stated facing clue and following the same/opposite-facing relations fixes ${target.id}'s direction as ${answer.toLowerCase()}.`,
    };
  }
  if (authorityKey === "CP007-AUTH-03") {
    const candidates = participants.filter((p) => p.id !== directFacingAnchor && p.id !== rowAnchorPerson);
    const target = candidates[hashInt(`${seed}:qtarget`) % candidates.length]!;
    const answer = `${target.seat.row === "TOP" ? "Upper row" : "Lower row"} — ${target.facing === "N" ? "North" : "South"}`;
    const all = ["Upper row — North", "Upper row — South", "Lower row — North", "Lower row — South"];
    return {
      question: `Which option correctly gives ${target.id}'s row and facing direction?`,
      answer,
      distractors: all.filter((item) => item !== answer),
      explanation: `The row-position clues place ${target.id} in the ${target.seat.row === "TOP" ? "upper" : "lower"} row. The facing-relation chain fixes ${target.id} as facing ${target.facing === "N" ? "north" : "south"}.`,
    };
  }
  const references = participants.filter((p) =>
    p.id !== directFacingAnchor
    && p.seat.position > 0
    && p.seat.position < Math.max(...participants.map((x) => x.seat.position)),
  );
  const reference = references[hashInt(`${seed}:qref`) % references.length]!;
  const direction = hashInt(`${seed}:qdir`) % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
  const targetPosition = reference.seat.position + relativeDelta(reference.facing, direction);
  const target = at(participants, reference.seat.row === "TOP" ? "BOTTOM" : "TOP", targetPosition);
  return {
    question: `Who sits diagonally from ${reference.id} in ${reference.id}'s ${direction.toLowerCase()}-hand direction?`,
    answer: target.id,
    distractors: participants.filter((p) => p.seat.row !== reference.seat.row && p.id !== target.id).slice(0, 3).map((p) => p.id),
    explanation: `${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. Moving one position in ${reference.id}'s ${direction.toLowerCase()}-hand direction and switching to the other row reaches position ${targetPosition + 1}, where ${target.id} sits.`,
  };
}

export function generateSea002Cp007ProductionCaselet(
  seed: string,
  width: number,
  authorityKey: Sea002Cp007CandidateAuthorityKey,
): Sea002Cp007ProductionCaselet {
  const participants = buildState(seed, width);
  const top = participants.filter((p) => p.seat.row === "TOP").sort((a, b) => a.seat.position - b.seat.position);
  const bottom = participants.filter((p) => p.seat.row === "BOTTOM").sort((a, b) => a.seat.position - b.seat.position);
  const rowMembershipMode = authorityKey === "CP007-AUTH-03" ? "INFERRED" as const : "GIVEN" as const;
  const rowAnchor = rowMembershipMode === "INFERRED" ? buildRowAnchorClue(participants, seed) : null;
  const clues = Object.freeze([
    ...buildFacingClues(participants),
    ...(rowAnchor ? [rowAnchor] : []),
    ...buildSeatClues(participants, width, seed),
  ]);
  const query = queryForAuthority(
    authorityKey,
    participants,
    seed,
    rowAnchor?.kind === "ROW_ANCHOR" ? rowAnchor.person : undefined,
  );
  const correctIndex = hashInt(`${seed}:${authorityKey}:answer-index`) % 4;
  const rowRoster = rowMembershipMode === "GIVEN"
    ? `The upper-row members are ${top.map((p) => p.id).sort().join(", ")}; the lower-row members are ${bottom.map((p) => p.id).sort().join(", ")}. `
    : "";
  return Object.freeze({
    caseletId: `SEA-CP007-CASE-${createHash("sha256").update(`${seed}:${width}`).digest("hex").slice(0, 12)}`,
    seed,
    width,
    authorityKey,
    participants,
    rowGroups: Object.freeze({
      top: Object.freeze(top.map((p) => p.id)),
      bottom: Object.freeze(bottom.map((p) => p.id)),
    }),
    rowMembershipMode,
    clues,
    stem: `Two parallel rows contain ${width} persons each. ${rowRoster}Some persons face north and some face south. ${clues.map(renderClue).join(" ")}`,
    question: query.question,
    options: makeOptions(query.answer, query.distractors, correctIndex),
    correctIndex,
    answer: query.answer,
    explanation: query.explanation,
    mathematicalFingerprint: stateFingerprint(participants, clues),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

function permutations<T>(values: readonly T[]): T[][] {
  if (values.length <= 1) return [Array.from(values)];
  const result: T[][] = [];
  for (let index = 0; index < values.length; index += 1) {
    const head = values[index]!;
    const tail = [...values.slice(0, index), ...values.slice(index + 1)];
    for (const rest of permutations(tail)) result.push([head, ...rest]);
  }
  return result;
}

function solveFacings(
  people: readonly string[], clues: readonly Sea002Cp007ProductionClue[],
): Map<string, Sea002Cp007Facing> | null {
  const facings = new Map<string, Sea002Cp007Facing>();
  for (const clue of clues) if (clue.kind === "FACING_ANCHOR") facings.set(clue.person, clue.facing);
  let changed = true;
  while (changed) {
    changed = false;
    for (const clue of clues) {
      if (clue.kind !== "FACING_RELATION") continue;
      const left = facings.get(clue.left);
      const right = facings.get(clue.right);
      if (left && !right) {
        facings.set(clue.right, clue.relation === "SAME" ? left : left === "N" ? "S" : "N");
        changed = true;
      } else if (right && !left) {
        facings.set(clue.left, clue.relation === "SAME" ? right : right === "N" ? "S" : "N");
        changed = true;
      } else if (left && right) {
        const expected = clue.relation === "SAME" ? left : left === "N" ? "S" : "N";
        if (right !== expected) return null;
      }
    }
  }
  return facings.size === people.length ? facings : null;
}

function oppositeRow(row: Sea002Cp007Row): Sea002Cp007Row {
  return row === "TOP" ? "BOTTOM" : "TOP";
}

function rowRelation(clue: Sea002Cp007ProductionClue):
  | { left: string; right: string; relation: "SAME" | "DIFFERENT" }
  | null {
  if (clue.kind === "SAME_ROW_OFFSET") {
    return { left: clue.subject, right: clue.reference, relation: "SAME" };
  }
  if (clue.kind === "OPPOSITE") {
    return { left: clue.left, right: clue.right, relation: "DIFFERENT" };
  }
  if (clue.kind === "DIAGONAL") {
    return { left: clue.subject, right: clue.reference, relation: "DIFFERENT" };
  }
  return null;
}

function solveRows(
  people: readonly string[], width: number, clues: readonly Sea002Cp007ProductionClue[],
): Map<string, Sea002Cp007Row> | null {
  const rows = new Map<string, Sea002Cp007Row>();
  for (const clue of clues) {
    if (clue.kind !== "ROW_ANCHOR") continue;
    const existing = rows.get(clue.person);
    if (existing && existing !== clue.row) return null;
    rows.set(clue.person, clue.row);
  }
  if (rows.size === 0) return null;

  let changed = true;
  while (changed) {
    changed = false;
    for (const clue of clues) {
      const relation = rowRelation(clue);
      if (!relation) continue;
      const left = rows.get(relation.left);
      const right = rows.get(relation.right);
      if (left && !right) {
        rows.set(relation.right, relation.relation === "SAME" ? left : oppositeRow(left));
        changed = true;
      } else if (right && !left) {
        rows.set(relation.left, relation.relation === "SAME" ? right : oppositeRow(right));
        changed = true;
      } else if (left && right) {
        const expected = relation.relation === "SAME" ? left : oppositeRow(left);
        if (right !== expected) return null;
      }
    }
  }

  if (rows.size !== people.length) return null;
  const topCount = people.filter((person) => rows.get(person) === "TOP").length;
  const bottomCount = people.filter((person) => rows.get(person) === "BOTTOM").length;
  return topCount === width && bottomCount === width ? rows : null;
}

function sameRowCluesSatisfied(
  order: readonly string[], row: Sea002Cp007Row, facings: ReadonlyMap<string, Sea002Cp007Facing>, clues: readonly Sea002Cp007ProductionClue[],
): boolean {
  const position = new Map(order.map((person, index) => [person, index] as const));
  for (const clue of clues) {
    if (clue.kind !== "SAME_ROW_OFFSET") continue;
    if (!position.has(clue.reference) && !position.has(clue.subject)) continue;
    if (!position.has(clue.reference) || !position.has(clue.subject)) return false;
    const facing = facings.get(clue.reference)!;
    const expected = position.get(clue.reference)! + relativeDelta(facing, clue.direction) * clue.distance;
    if (position.get(clue.subject) !== expected) return false;
  }
  void row;
  return true;
}

export function independentlySolveSea002Cp007Caselet(caselet: Sea002Cp007ProductionCaselet) {
  const people = caselet.participants.map((participant) => participant.id);
  const facings = solveFacings(people, caselet.clues);
  if (!facings) return Object.freeze({ solutionCount: 0, solutions: Object.freeze([]) });

  const rows = caselet.rowMembershipMode === "INFERRED"
    ? solveRows(people, caselet.width, caselet.clues)
    : new Map<string, Sea002Cp007Row>([
      ...caselet.rowGroups.top.map((person) => [person, "TOP" as const] as const),
      ...caselet.rowGroups.bottom.map((person) => [person, "BOTTOM" as const] as const),
    ]);
  if (!rows) return Object.freeze({ solutionCount: 0, solutions: Object.freeze([]) });

  const topPeople = people.filter((person) => rows.get(person) === "TOP");
  const bottomPeople = people.filter((person) => rows.get(person) === "BOTTOM");
  const topOrders = permutations(topPeople).filter((order) => sameRowCluesSatisfied(order, "TOP", facings, caselet.clues));
  const bottomOrders = permutations(bottomPeople).filter((order) => sameRowCluesSatisfied(order, "BOTTOM", facings, caselet.clues));
  const solutions: Array<{ top: string[]; bottom: string[]; facings: Record<string, Sea002Cp007Facing> }> = [];

  for (const top of topOrders) {
    const topPos = new Map(top.map((person, index) => [person, index] as const));
    for (const bottom of bottomOrders) {
      const bottomPos = new Map(bottom.map((person, index) => [person, index] as const));
      const locate = (person: string) => topPos.has(person)
        ? { row: "TOP" as const, position: topPos.get(person)! }
        : { row: "BOTTOM" as const, position: bottomPos.get(person)! };
      let valid = true;
      for (const clue of caselet.clues) {
        if (clue.kind === "ROW_ANCHOR") {
          const located = locate(clue.person);
          if (located.row !== clue.row) { valid = false; break; }
        }
        if (clue.kind === "OPPOSITE") {
          const left = locate(clue.left);
          const right = locate(clue.right);
          if (left.row === right.row || left.position !== right.position) { valid = false; break; }
        }
        if (clue.kind === "DIAGONAL") {
          const subject = locate(clue.subject);
          const reference = locate(clue.reference);
          const expected = reference.position + relativeDelta(facings.get(clue.reference)!, clue.direction);
          if (subject.row === reference.row || subject.position !== expected) { valid = false; break; }
        }
      }
      if (valid) solutions.push({
        top: [...top],
        bottom: [...bottom],
        facings: Object.fromEntries([...facings]),
      });
    }
  }

  return Object.freeze({ solutionCount: solutions.length, solutions: Object.freeze(solutions) });
}
