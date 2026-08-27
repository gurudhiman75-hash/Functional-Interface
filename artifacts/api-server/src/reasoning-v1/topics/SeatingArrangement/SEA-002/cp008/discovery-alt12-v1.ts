import { createHash } from "node:crypto";

import {
  squareOppositeIndex,
  squareRelativeIndex,
  squareSameSide,
  squareSeat,
} from "./topology-v1.ts";

export const SEA002_CP008_ALT12_PROTOTYPE_ID = "SEA-CP008-PROT-011" as const;
export const SEA002_CP008_ALT12_SCHEMA = "ALT12_CORNER_PLUS_TWO_SIDE" as const;
export const SEA002_CP008_ALT12_PERIMETER_METRES = 60 as const;
export const SEA002_CP008_ALT12_SEAT_SPACING_METRES = 5 as const;

export type Sea002Cp008Alt12Clue =
  | Readonly<{ kind: "ROLE"; person: string; role: "CORNER" | "SIDE" }>
  | Readonly<{ kind: "SAME_SIDE"; a: string; b: string }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "RELATIVE_METRIC"; subject: string; reference: string; direction: "LEFT" | "RIGHT"; metres: 5 | 10 | 15 | 20 | 25 | 30 }>;

export type Sea002Cp008Alt12Caselet = Readonly<{
  prototypeId: typeof SEA002_CP008_ALT12_PROTOTYPE_ID;
  seed: string;
  schema: typeof SEA002_CP008_ALT12_SCHEMA;
  perimeterMetres: typeof SEA002_CP008_ALT12_PERIMETER_METRES;
  seatSpacingMetres: typeof SEA002_CP008_ALT12_SEAT_SPACING_METRES;
  facingMode: "ALL_IN";
  participants: readonly Readonly<{ id: string; seatIndex: number; facing: "IN" }>[];
  clues: readonly Sea002Cp008Alt12Clue[];
  query: Readonly<{
    kind: "RELATIVE_METRIC" | "OPPOSITE";
    reference: string;
    direction?: "LEFT" | "RIGHT";
    metres?: 5 | 10 | 15 | 20 | 25 | 30;
    answer: string;
  }>;
  lifecycle: Readonly<{
    status: "DISCOVERY_ONLY";
    permanentQlAllocated: false;
    questionStudioRegistered: false;
    questionBankWritable: false;
    publiclyPublishable: false;
  }>;
  structuralFingerprint: string;
}>;

const NAMES = Object.freeze([
  "Aarav", "Aditi", "Kabir", "Mehak", "Rohan", "Simran",
  "Arjun", "Isha", "Karan", "Neha", "Yash", "Zoya",
] as const);

const LIFECYCLE = Object.freeze({
  status: "DISCOVERY_ONLY" as const,
  permanentQlAllocated: false as const,
  questionStudioRegistered: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
});

function hashInt(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const shift = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function participantsFor(seed: string) {
  const names = rotate(NAMES, hashInt(`${seed}:names`) % NAMES.length);
  return Object.freeze(names.map((id, seatIndex) => Object.freeze({ id, seatIndex, facing: "IN" as const })));
}

function metricClue(
  participants: ReturnType<typeof participantsFor>,
  subjectIndex: number,
  referenceIndex: number,
  direction: "LEFT" | "RIGHT",
  metres: 5 | 10 | 15 | 20 | 25 | 30,
): Sea002Cp008Alt12Clue {
  const expected = squareRelativeIndex(
    SEA002_CP008_ALT12_SCHEMA,
    participants[referenceIndex]!.seatIndex,
    "IN",
    direction,
    metres / SEA002_CP008_ALT12_SEAT_SPACING_METRES,
  );
  if (participants[subjectIndex]!.seatIndex !== expected) {
    throw new Error(`ALT12 metric clue ${subjectIndex}/${referenceIndex}/${direction}/${metres} does not match canonical topology.`);
  }
  return Object.freeze({
    kind: "RELATIVE_METRIC" as const,
    subject: participants[subjectIndex]!.id,
    reference: participants[referenceIndex]!.id,
    direction,
    metres,
  });
}

function buildClues(participants: ReturnType<typeof participantsFor>): readonly Sea002Cp008Alt12Clue[] {
  const clues: Sea002Cp008Alt12Clue[] = [
    Object.freeze({ kind: "ROLE", person: participants[0]!.id, role: "CORNER" as const }),
    Object.freeze({ kind: "OPPOSITE", a: participants[0]!.id, b: participants[6]!.id }),
  ];

  for (const [a, b] of [[1, 2], [4, 5], [7, 8], [10, 11]] as const) {
    if (!squareSameSide(SEA002_CP008_ALT12_SCHEMA, a, b)) throw new Error("ALT12 same-side topology drifted.");
    clues.push(Object.freeze({ kind: "SAME_SIDE", a: participants[a]!.id, b: participants[b]!.id }));
  }

  // Source-natural structural spine using the equal 5m spacing of a 60m perimeter.
  clues.push(metricClue(participants, 3, 0, "LEFT", 15));
  clues.push(metricClue(participants, 9, 6, "LEFT", 15));
  clues.push(metricClue(participants, 1, 0, "LEFT", 5));
  clues.push(metricClue(participants, 2, 1, "LEFT", 5));
  clues.push(metricClue(participants, 4, 3, "LEFT", 5));
  clues.push(metricClue(participants, 5, 4, "LEFT", 5));
  clues.push(metricClue(participants, 7, 6, "LEFT", 5));
  clues.push(metricClue(participants, 8, 7, "LEFT", 5));
  clues.push(metricClue(participants, 10, 9, "LEFT", 5));
  clues.push(metricClue(participants, 11, 10, "LEFT", 5));
  return Object.freeze(clues);
}

function buildQuery(seed: string, participants: ReturnType<typeof participantsFor>) {
  if (hashInt(`${seed}:query`) % 2 === 0) {
    const reference = participants[2]!;
    const direction = "RIGHT" as const;
    const metres = 15 as const;
    const targetSeat = squareRelativeIndex(
      SEA002_CP008_ALT12_SCHEMA,
      reference.seatIndex,
      "IN",
      direction,
      metres / SEA002_CP008_ALT12_SEAT_SPACING_METRES,
    );
    const answer = participants.find((participant) => participant.seatIndex === targetSeat)!.id;
    return Object.freeze({ kind: "RELATIVE_METRIC" as const, reference: reference.id, direction, metres, answer });
  }
  const reference = participants[1]!;
  const targetSeat = squareOppositeIndex(SEA002_CP008_ALT12_SCHEMA, reference.seatIndex);
  const answer = participants.find((participant) => participant.seatIndex === targetSeat)!.id;
  return Object.freeze({ kind: "OPPOSITE" as const, reference: reference.id, answer });
}

export function generateSea002Cp008Alt12Caselet(seed: string): Sea002Cp008Alt12Caselet {
  const participants = participantsFor(seed);
  const clues = buildClues(participants);
  const query = buildQuery(seed, participants);
  const structuralFingerprint = createHash("sha256").update(JSON.stringify({ participants, clues, query })).digest("hex");
  return Object.freeze({
    prototypeId: SEA002_CP008_ALT12_PROTOTYPE_ID,
    seed,
    schema: SEA002_CP008_ALT12_SCHEMA,
    perimeterMetres: SEA002_CP008_ALT12_PERIMETER_METRES,
    seatSpacingMetres: SEA002_CP008_ALT12_SEAT_SPACING_METRES,
    facingMode: "ALL_IN" as const,
    participants,
    clues,
    query,
    lifecycle: LIFECYCLE,
    structuralFingerprint,
  });
}

export const SEA002_CP008_ALT12_CANONICAL_ROLE_COUNTS = Object.freeze({
  corners: Array.from({ length: 12 }, (_, index) => squareSeat(SEA002_CP008_ALT12_SCHEMA, index)).filter((seat) => seat.role === "CORNER").length,
  sideSeats: Array.from({ length: 12 }, (_, index) => squareSeat(SEA002_CP008_ALT12_SCHEMA, index)).filter((seat) => seat.role === "SIDE").length,
  sameSidePairs: 4,
});
