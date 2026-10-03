import { createHash } from "node:crypto";

import {
  SEA002_CP007_DISCOVERY_LIFECYCLE,
  type Sea002Cp007Participant,
  type Sea002Cp007Question,
  type Sea002Cp007Row,
} from "./types.ts";
import {
  areOpposite,
  facingRelation,
  relativeDelta,
  sitsRelative,
  validateState,
} from "./solver.ts";

export type Sea002Cp007Wave02PrototypeId =
  | "SEA-CP007-PROT-004"
  | "SEA-CP007-PROT-005"
  | "SEA-CP007-PROT-006"
  | "SEA-CP007-PROT-007";

export type Sea002Cp007Wave02Question = Readonly<
  Omit<Sea002Cp007Question, "prototypeId"> & {
    prototypeId: Sea002Cp007Wave02PrototypeId;
    solveFamily:
      | "PARAMETERIZED_RELATIVE_DISTANCE"
      | "PARTIAL_FACING_RELATION_CHAIN"
      | "JOINT_ROW_FACING_INFERENCE"
      | "INFERRED_FACING_DIAGONAL";
  }
>;

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

function facingBit(seed: string, row: Sea002Cp007Row, position: number): number {
  const parity = hashInt(`${seed}:facing-parity`) % 2;
  const mode = hashInt(`${seed}:facing-pattern`) % 4;
  const rowShift = row === "BOTTOM" ? 1 : 0;
  if (mode === 0) return (position + rowShift + parity) % 2;
  if (mode === 1) return (Math.floor(position / 2) + rowShift + parity) % 2;
  if (mode === 2) return (position + parity) % 2;
  return (Math.floor((position + 1) / 2) + rowShift + parity) % 2;
}

function buildState(seed: string, width: number): readonly Sea002Cp007Participant[] {
  const names = rotate(NAMES, hashInt(`${seed}:names`) % NAMES.length).slice(0, width * 2);
  const participants: Sea002Cp007Participant[] = [];
  let nameIndex = 0;
  for (const row of ["TOP", "BOTTOM"] as const satisfies readonly Sea002Cp007Row[]) {
    const positions = rotate([...Array(width).keys()], hashInt(`${seed}:${row}:order`) % width);
    for (const position of positions) {
      participants.push(Object.freeze({
        id: names[nameIndex++]!,
        seat: Object.freeze({ row, position }),
        facing: facingBit(seed, row, position) === 0 ? "N" : "S",
      }));
    }
  }
  validateState(participants, width);
  return Object.freeze(participants);
}

function sortedRow(
  participants: readonly Sea002Cp007Participant[],
  row: Sea002Cp007Row,
): Sea002Cp007Participant[] {
  return participants
    .filter((participant) => participant.seat.row === row)
    .sort((left, right) => left.seat.position - right.seat.position);
}

function rowSentence(participants: readonly Sea002Cp007Participant[], row: Sea002Cp007Row): string {
  return `The ${row === "TOP" ? "upper" : "lower"} row, read from the observer's left to right, is ${sortedRow(participants, row).map((p) => p.id).join(", ")}.`;
}

function stateFingerprint(participants: readonly Sea002Cp007Participant[], semantic: string): string {
  return createHash("sha256")
    .update(`${semantic}:${JSON.stringify([...participants].sort((a, b) => a.id.localeCompare(b.id)))}`)
    .digest("hex");
}

function answerIndex(seed: string): number {
  return hashInt(`${seed}:answer-index`) % 4;
}

function optionsAt(answer: string, distractors: readonly string[], correctIndex: number): readonly string[] {
  const wrong = [...new Set(distractors.filter((item) => item !== answer))].slice(0, 3);
  if (wrong.length !== 3) throw new Error("SEA-CP-007 Wave02 requires exactly three unique distractors.");
  const options = [...wrong];
  options.splice(correctIndex, 0, answer);
  return Object.freeze(options);
}

function prototype004(
  participants: readonly Sea002Cp007Participant[], seed: string, width: number,
): Sea002Cp007Wave02Question {
  const direction = hashInt(`${seed}:direction`) % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
  const candidates = participants.filter((reference) => {
    const target = reference.seat.position + relativeDelta(reference.facing, direction) * 2;
    return target >= 0 && target < width;
  });
  const reference = candidates[hashInt(`${seed}:reference`) % candidates.length]!;
  const targetPosition = reference.seat.position + relativeDelta(reference.facing, direction) * 2;
  const target = participants.find((p) => p.seat.row === reference.seat.row && p.seat.position === targetPosition)!;
  if (!sitsRelative(target, reference, direction, 2)) throw new Error("Distance-two relation failed self-check.");
  const answer = target.id;
  const correctIndex = answerIndex(seed);
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-004",
    solveFamily: "PARAMETERIZED_RELATIVE_DISTANCE",
    seed,
    width,
    participants,
    stem: `${rowSentence(participants, reference.seat.row)} ${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. Who sits second to the ${direction.toLowerCase()} of ${reference.id}?`,
    options: optionsAt(answer, participants.filter((p) => p.id !== answer).map((p) => p.id), correctIndex),
    correctIndex,
    answer,
    explanation: `${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. Moving two positions to ${reference.id}'s ${direction.toLowerCase()} reaches position ${target.seat.position + 1} in the same row. ${target.id} occupies that position.`,
    mathematicalFingerprint: stateFingerprint(participants, `P004:${direction}:${reference.id}`),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

function prototype005(
  participants: readonly Sea002Cp007Participant[], seed: string, width: number,
): Sea002Cp007Wave02Question {
  const direction = hashInt(`${seed}:direction`) % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
  const candidates = participants.filter((reference) => {
    const target = reference.seat.position + relativeDelta(reference.facing, direction);
    return target >= 0 && target < width;
  });
  const reference = candidates[hashInt(`${seed}:reference`) % candidates.length]!;
  const target = participants.find((p) => sitsRelative(p, reference, direction))!;
  const relation = facingRelation(reference, target);
  const answer = `${target.id} — ${target.facing === "N" ? "North" : "South"}`;
  const correctIndex = answerIndex(seed);
  const row = sortedRow(participants, reference.seat.row);
  const distractors = [
    `${target.id} — ${target.facing === "N" ? "South" : "North"}`,
    `${reference.id} — ${reference.facing === "N" ? "North" : "South"}`,
    `${row.find((p) => p.id !== target.id && p.id !== reference.id)!.id} — ${target.facing === "N" ? "North" : "South"}`,
  ];
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-005",
    solveFamily: "PARTIAL_FACING_RELATION_CHAIN",
    seed,
    width,
    participants,
    stem: `${rowSentence(participants, reference.seat.row)} ${reference.id} faces ${reference.facing === "N" ? "north" : "south"}. The person immediately to the ${direction.toLowerCase()} of ${reference.id} faces in the ${relation === "SAME" ? "same" : "opposite"} direction as ${reference.id}. Which option correctly identifies that person and the direction they face?`,
    options: optionsAt(answer, distractors, correctIndex),
    correctIndex,
    answer,
    explanation: `Because ${reference.id} faces ${reference.facing === "N" ? "north" : "south"}, the immediate ${direction.toLowerCase()} position is position ${target.seat.position + 1}. ${target.id} is there. The clue says the two face in the ${relation === "SAME" ? "same" : "opposite"} direction, so ${target.id} faces ${target.facing === "N" ? "north" : "south"}.`,
    mathematicalFingerprint: stateFingerprint(participants, `P005:${direction}:${relation}:${reference.id}`),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

function prototype006(
  participants: readonly Sea002Cp007Participant[], seed: string, width: number,
): Sea002Cp007Wave02Question {
  const direction = hashInt(`${seed}:direction`) % 2 === 0 ? "LEFT" as const : "RIGHT" as const;
  const candidates = participants.filter((reference) => {
    const target = reference.seat.position + relativeDelta(reference.facing, direction);
    return target >= 0 && target < width;
  });
  const reference = candidates[hashInt(`${seed}:reference`) % candidates.length]!;
  const target = participants.find((p) => sitsRelative(p, reference, direction))!;
  const relation = facingRelation(reference, target);
  const rowLabel = target.seat.row === "TOP" ? "Upper row" : "Lower row";
  const facingLabel = target.facing === "N" ? "North" : "South";
  const answer = `${rowLabel} — ${facingLabel}`;
  const correctIndex = answerIndex(seed);
  const all = ["Upper row — North", "Upper row — South", "Lower row — North", "Lower row — South"];
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-006",
    solveFamily: "JOINT_ROW_FACING_INFERENCE",
    seed,
    width,
    participants,
    stem: `${reference.id} is in the ${reference.seat.row === "TOP" ? "upper" : "lower"} row at position ${reference.seat.position + 1} and faces ${reference.facing === "N" ? "north" : "south"}. ${target.id} sits immediately to the ${direction.toLowerCase()} of ${reference.id} and faces in the ${relation === "SAME" ? "same" : "opposite"} direction. Which option gives ${target.id}'s row and facing direction?`,
    options: optionsAt(answer, all.filter((item) => item !== answer), correctIndex),
    correctIndex,
    answer,
    explanation: `Immediate left/right keeps ${target.id} in ${reference.id}'s row, so ${target.id} is in the ${target.seat.row === "TOP" ? "upper" : "lower"} row. Using the ${relation === "SAME" ? "same-facing" : "opposite-facing"} clue, ${target.id} faces ${target.facing === "N" ? "north" : "south"}.`,
    mathematicalFingerprint: stateFingerprint(participants, `P006:${direction}:${relation}:${reference.id}`),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

function prototype007(
  participants: readonly Sea002Cp007Participant[], seed: string, width: number,
): Sea002Cp007Wave02Question {
  const anchors = participants.filter((p) => p.seat.row === "TOP" && p.seat.position >= 1 && p.seat.position < width - 1);
  const anchor = anchors[hashInt(`${seed}:anchor`) % anchors.length]!;
  const opposite = participants.find((p) => areOpposite(p, anchor))!;
  const relation = facingRelation(anchor, opposite);
  const targetPosition = opposite.seat.position + relativeDelta(opposite.facing, "RIGHT");
  if (targetPosition < 0 || targetPosition >= width) {
    throw new Error("Wave02 diagonal seed selected an invalid right-hand diagonal target.");
  }
  const diagonal = participants.find((p) => p.seat.row === anchor.seat.row && p.seat.position === targetPosition)!;
  const answer = diagonal.id;
  const correctIndex = answerIndex(seed);
  return Object.freeze({
    prototypeId: "SEA-CP007-PROT-007",
    solveFamily: "INFERRED_FACING_DIAGONAL",
    seed,
    width,
    participants,
    stem: `${anchor.id} and ${opposite.id} occupy opposite positions. ${anchor.id} faces ${anchor.facing === "N" ? "north" : "south"}, and ${opposite.id} faces in the ${relation === "SAME" ? "same" : "opposite"} direction as ${anchor.id}. ${rowSentence(participants, anchor.seat.row)} Who sits diagonally from ${opposite.id} in ${opposite.id}'s right-hand direction?`,
    options: optionsAt(answer, participants.filter((p) => p.id !== answer).map((p) => p.id), correctIndex),
    correctIndex,
    answer,
    explanation: `From the facing-relation clue, ${opposite.id} faces ${opposite.facing === "N" ? "north" : "south"}. Therefore ${opposite.id}'s right-hand direction points toward position ${targetPosition + 1}. The diagonally corresponding seat is in the other row at that position, occupied by ${diagonal.id}.`,
    mathematicalFingerprint: stateFingerprint(participants, `P007:${relation}:${anchor.id}`),
    lifecycle: SEA002_CP007_DISCOVERY_LIFECYCLE,
  });
}

export const SEA002_CP007_WAVE02_PROTOTYPES = Object.freeze([
  "SEA-CP007-PROT-004",
  "SEA-CP007-PROT-005",
  "SEA-CP007-PROT-006",
  "SEA-CP007-PROT-007",
] as const satisfies readonly Sea002Cp007Wave02PrototypeId[]);

export function generateSea002Cp007Wave02(
  prototypeId: Sea002Cp007Wave02PrototypeId,
  seed: string,
  width = 4,
): Sea002Cp007Wave02Question {
  const participants = buildState(`${prototypeId}:${seed}`, width);
  if (prototypeId === "SEA-CP007-PROT-004") return prototype004(participants, seed, width);
  if (prototypeId === "SEA-CP007-PROT-005") return prototype005(participants, seed, width);
  if (prototypeId === "SEA-CP007-PROT-006") return prototype006(participants, seed, width);
  return prototype007(participants, seed, width);
}
