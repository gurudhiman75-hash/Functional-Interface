import { createHash } from "node:crypto";

import {
  SEA002_CP007_DISCOVERY_LIFECYCLE,
  type Sea002Cp007Facing,
  type Sea002Cp007Participant,
  type Sea002Cp007PrototypeId,
  type Sea002Cp007Question,
  type Sea002Cp007Row,
} from "./types.ts";
import {
  areOpposite,
  participantById,
  relativeDelta,
  sitsRelative,
  validateState,
} from "./solver.ts";

const NAMES = Object.freeze([
  "Aarav", "Aditi", "Kabir", "Mehak", "Rohan", "Simran",
  "Arjun", "Isha", "Karan", "Neha", "Yash", "Zoya",
]);

function hashInt(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  if (values.length === 0) return [];
  const shift = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function facingFor(
  prototypeId: Sea002Cp007PrototypeId,
  row: Sea002Cp007Row,
  position: number,
  seed: string,
): Sea002Cp007Facing {
  if (prototypeId === "SEA-CP007-PROT-001") {
    const north = hashInt(`${seed}:same-direction`) % 2 === 0;
    return north ? "N" : "S";
  }
  if (prototypeId === "SEA-CP007-PROT-002") {
    return (position + (row === "BOTTOM" ? 1 : 0) + hashInt(`${seed}:mixed`)) % 2 === 0 ? "N" : "S";
  }
  const pivot = hashInt(`${seed}:inferred`) % 2;
  return (position + pivot) % 3 === 0 ? "S" : "N";
}

function buildState(
  prototypeId: Sea002Cp007PrototypeId,
  seed: string,
  width: number,
): readonly Sea002Cp007Participant[] {
  const names = rotate(NAMES, hashInt(`${seed}:names`) % NAMES.length).slice(0, width * 2);
  const participants: Sea002Cp007Participant[] = [];
  let index = 0;
  for (const row of ["TOP", "BOTTOM"] as const) {
    const order = rotate([...Array(width).keys()], hashInt(`${seed}:${row}:seat-order`) % width);
    for (const position of order) {
      participants.push(Object.freeze({
        id: names[index++]!,
        seat: Object.freeze({ row, position }),
        facing: facingFor(prototypeId, row, position, seed),
      }));
    }
  }
  validateState(participants, width);
  return Object.freeze(participants);
}

function seatLabel(participant: Sea002Cp007Participant): string {
  return `${participant.seat.row === "TOP" ? "upper" : "lower"} row, position ${participant.seat.position + 1}`;
}

function stateFingerprint(participants: readonly Sea002Cp007Participant[]): string {
  return createHash("sha256")
    .update(JSON.stringify([...participants].sort((a, b) => a.id.localeCompare(b.id))))
    .digest("hex");
}

function chooseAnswerIndex(seed: string): number {
  return hashInt(`${seed}:answer-position`) % 4;
}

function makeOptions(answer: string, distractors: readonly string[], correctIndex: number): readonly string[] {
  const wrong = [...new Set(distractors.filter((value) => value !== answer))].slice(0, 3);
  if (wrong.length !== 3) throw new Error("SEA-CP-007 could not construct three unique distractors.");
  const result = [...wrong];
  result.splice(correctIndex, 0, answer);
  return Object.freeze(result);
}

function prototype001(
  participants: readonly Sea002Cp007Participant[],
  seed: string,
  width: number,
): Sea002Cp007Question {
  const reference = participants.find((p) => p.seat.row === "TOP" && p.seat.position >= 1 && p.seat.position < width - 1)!;
  const delta = relativeDelta(reference.facing, "RIGHT");
  const subject = participants.find((p) => p.seat.row === reference.seat.row && p.seat.position === reference.seat.position + delta)!;
  const opposite = participants.find((p) => areOpposite(p, reference))!;
  const answer = subject.id;
  const correctIndex = chooseAnswerIndex(seed);
  const distractors = [opposite.id, reference.id, participants.find((p) => p.id !== answer && p.id !== reference.id && p.id !== opposite.id)!.id];
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-001",
    seed,
    width,
    participants,
    stem: `Two parallel rows contain ${width} persons each. Everyone in both rows faces ${reference.facing === "N" ? "north" : "south"}. Who sits immediately to the right of ${reference.id}?`,
    options: makeOptions(answer, distractors, correctIndex),
    correctIndex,
    answer,
    explanation: `${reference.id} is at ${seatLabel(reference)} and faces ${reference.facing === "N" ? "north" : "south"}. For that facing, the right-hand position is position ${subject.seat.position + 1}. ${subject.id} occupies that position, so ${subject.id} is immediately to the right of ${reference.id}.`,
    mathematicalFingerprint: stateFingerprint(participants),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

function prototype002(
  participants: readonly Sea002Cp007Participant[],
  seed: string,
  width: number,
): Sea002Cp007Question {
  const references = participants.filter((p) => p.seat.position >= 1 && p.seat.position < width - 1);
  const reference = references[hashInt(`${seed}:ref`) % references.length]!;
  const direction = hashInt(`${seed}:direction`) % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
  const targetPosition = reference.seat.position + relativeDelta(reference.facing, direction);
  const subject = participants.find((p) => p.seat.row === reference.seat.row && p.seat.position === targetPosition)!;
  if (!sitsRelative(subject, reference, direction)) throw new Error("Mixed-facing relative relation failed self-check.");
  const answer = subject.id;
  const correctIndex = chooseAnswerIndex(seed);
  const opposite = participants.find((p) => areOpposite(p, reference))!;
  const distractors = [reference.id, opposite.id, participants.find((p) => p.id !== answer && p.id !== reference.id && p.id !== opposite.id)!.id];
  const facingStatements = participants.map((p) => `${p.id} faces ${p.facing === "N" ? "north" : "south"}`).join("; ");
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-002",
    seed,
    width,
    participants,
    stem: `Two parallel rows contain ${width} persons each. Individual facing directions are: ${facingStatements}. Who sits immediately to the ${direction.toLowerCase()} of ${reference.id}?`,
    options: makeOptions(answer, distractors, correctIndex),
    correctIndex,
    answer,
    explanation: `${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. So ${direction.toLowerCase()} from ${reference.id}'s point of view leads to position ${subject.seat.position + 1} in the same row. ${subject.id} is there.`,
    mathematicalFingerprint: stateFingerprint(participants),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

function prototype003(
  participants: readonly Sea002Cp007Participant[],
  seed: string,
  width: number,
): Sea002Cp007Question {
  const reference = participants[hashInt(`${seed}:facing-ref`) % participants.length]!;
  const opposite = participants.find((p) => areOpposite(p, reference))!;
  const relation = reference.facing === opposite.facing ? "same" : "opposite";
  const answer = opposite.facing === "N" ? "North" : "South";
  const correctIndex = chooseAnswerIndex(seed);
  const distractors = answer === "North"
    ? ["South", "Cannot be determined", "Either north or south"]
    : ["North", "Cannot be determined", "Either north or south"];
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-003",
    seed,
    width,
    participants,
    stem: `${reference.id} and ${opposite.id} occupy opposite positions in two parallel rows. ${reference.id} faces ${reference.facing === "N" ? "north" : "south"}, and the two face in the ${relation} direction. Which direction does ${opposite.id} face?`,
    options: makeOptions(answer, distractors, correctIndex),
    correctIndex,
    answer,
    explanation: `${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. The pair faces in the ${relation} direction, so ${opposite.id} must face ${answer.toLowerCase()}.`,
    mathematicalFingerprint: stateFingerprint(participants),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

export function generateSea002Cp007Wave01(
  prototypeId: Sea002Cp007PrototypeId,
  seed: string,
  width = 4,
): Sea002Cp007Question {
  const participants = buildState(prototypeId, seed, width);
  if (prototypeId === "SEA-CP007-PROT-001") return prototype001(participants, seed, width);
  if (prototypeId === "SEA-CP007-PROT-002") return prototype002(participants, seed, width);
  return prototype003(participants, seed, width);
}
