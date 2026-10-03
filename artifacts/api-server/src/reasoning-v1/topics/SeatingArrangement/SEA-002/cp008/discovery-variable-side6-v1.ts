import { createHash } from "node:crypto";

import {
  variableSide6OppositeIndex,
  variableSide6RelativeIndex,
  variableSide6SameSide,
  variableSide6Seat,
  variableSide6Seats,
} from "./variable-side6-topology-v1.ts";

export const SEA002_CP008_VARIABLE_SIDE6_PROTOTYPE_ID = "SEA-CP008-PROT-009" as const;

export type Sea002Cp008VariableSide6Clue =
  | Readonly<{ kind: "OCCUPANCY_CLASS"; person: string; occupancyKind: "SINGLE" | "PAIRED" }>
  | Readonly<{ kind: "SAME_SIDE"; a: string; b: string }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "RELATIVE"; subject: string; reference: string; steps: number; direction: "LEFT" | "RIGHT" }>;

export type Sea002Cp008VariableSide6Caselet = Readonly<{
  prototypeId: typeof SEA002_CP008_VARIABLE_SIDE6_PROTOTYPE_ID;
  seed: string;
  topology: "VARIABLE_SIDE6";
  facingMode: "ALL_IN";
  participants: readonly Readonly<{ id: string; seatIndex: number; facing: "IN" }>[];
  clues: readonly Sea002Cp008VariableSide6Clue[];
  query: Readonly<{
    kind: "RELATIVE" | "OPPOSITE";
    reference: string;
    steps?: number;
    direction?: "LEFT" | "RIGHT";
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

const NAMES = Object.freeze(["Aarav", "Aditi", "Kabir", "Mehak", "Rohan", "Simran"] as const);
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

function buildClues(participants: ReturnType<typeof participantsFor>): readonly Sea002Cp008VariableSide6Clue[] {
  const clues: Sea002Cp008VariableSide6Clue[] = [];
  const single = participants.filter((participant) => variableSide6Seat(participant.seatIndex).occupancyKind === "SINGLE");
  const paired = participants.filter((participant) => variableSide6Seat(participant.seatIndex).occupancyKind === "PAIRED");
  clues.push(Object.freeze({ kind: "OCCUPANCY_CLASS", person: single[0]!.id, occupancyKind: "SINGLE" as const }));
  clues.push(Object.freeze({ kind: "OCCUPANCY_CLASS", person: paired[0]!.id, occupancyKind: "PAIRED" as const }));

  for (const [aIndex, bIndex] of [[1, 2], [4, 5]] as const) {
    clues.push(Object.freeze({
      kind: "SAME_SIDE",
      a: participants[aIndex]!.id,
      b: participants[bIndex]!.id,
    }));
  }

  clues.push(Object.freeze({
    kind: "OPPOSITE",
    a: participants[0]!.id,
    b: participants[variableSide6OppositeIndex(0)]!.id,
  }));

  // Synthetic discovery constraint spine; later exam-real generation must replace this with minimal source-natural clues.
  for (let index = 1; index < participants.length; index += 1) {
    const reference = participants[index - 1]!;
    const subject = participants[index]!;
    clues.push(Object.freeze({
      kind: "RELATIVE",
      subject: subject.id,
      reference: reference.id,
      steps: 1,
      direction: "LEFT" as const, // all inward; clockwise index progression is learner-left.
    }));
  }

  return Object.freeze(clues);
}

function buildQuery(seed: string, participants: ReturnType<typeof participantsFor>) {
  const useOpposite = hashInt(`${seed}:query-family`) % 2 === 0;
  if (useOpposite) {
    const reference = participants[2]!;
    const answer = participants[variableSide6OppositeIndex(reference.seatIndex)]!.id;
    return Object.freeze({ kind: "OPPOSITE" as const, reference: reference.id, answer });
  }
  const reference = participants[3]!;
  const direction = "RIGHT" as const;
  const steps = 2;
  const target = variableSide6RelativeIndex(reference.seatIndex, "IN", direction, steps);
  const answer = participants[target]!.id;
  return Object.freeze({ kind: "RELATIVE" as const, reference: reference.id, direction, steps, answer });
}

export function generateSea002Cp008VariableSide6Caselet(seed: string): Sea002Cp008VariableSide6Caselet {
  const participants = participantsFor(seed);
  const clues = buildClues(participants);
  const query = buildQuery(seed, participants);
  if (!variableSide6SameSide(participants[1]!.seatIndex, participants[2]!.seatIndex)
    || !variableSide6SameSide(participants[4]!.seatIndex, participants[5]!.seatIndex)) {
    throw new Error("VARIABLE_SIDE6 canonical same-side pairs drifted.");
  }
  const structuralFingerprint = createHash("sha256").update(JSON.stringify({ participants, clues, query })).digest("hex");
  return Object.freeze({
    prototypeId: SEA002_CP008_VARIABLE_SIDE6_PROTOTYPE_ID,
    seed,
    topology: "VARIABLE_SIDE6" as const,
    facingMode: "ALL_IN" as const,
    participants,
    clues,
    query,
    lifecycle: LIFECYCLE,
    structuralFingerprint,
  });
}

export const SEA002_CP008_VARIABLE_SIDE6_CANONICAL_OCCUPANCY = Object.freeze(
  variableSide6Seats().map((seat) => Object.freeze({ side: seat.side, occupancyKind: seat.occupancyKind })),
);
