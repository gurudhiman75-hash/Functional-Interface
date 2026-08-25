import { createHash } from "node:crypto";

import {
  squareOppositeIndex,
  squareRelativeIndex,
  squareRoleFacing,
  squareSeat,
  squareSeatCount,
  type Sea002Cp008Facing,
  type Sea002Cp008RelativeDirection,
  type Sea002Cp008SeatRole,
  type Sea002Cp008SquareSchema,
} from "./topology-v1.ts";

export const SEA002_CP008_PROTOTYPE_IDS = Object.freeze([
  "SEA-CP008-PROT-001",
  "SEA-CP008-PROT-002",
  "SEA-CP008-PROT-003",
  "SEA-CP008-PROT-004",
  "SEA-CP008-PROT-005",
] as const);

export type Sea002Cp008PrototypeId = (typeof SEA002_CP008_PROTOTYPE_IDS)[number];

export type Sea002Cp008FacingMode =
  | "CORNERS_IN_SIDES_OUT"
  | "CORNERS_OUT_SIDES_IN"
  | "ALL_IN"
  | "MIXED";

export type Sea002Cp008DiscoveryClue =
  | Readonly<{ kind: "RELATIVE"; subject: string; reference: string; steps: number; direction: Sea002Cp008RelativeDirection }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "ROLE"; person: string; role: Sea002Cp008SeatRole }>
  | Readonly<{ kind: "FACING_ANCHOR"; person: string; facing: Sea002Cp008Facing }>
  | Readonly<{ kind: "FACING_RELATION"; a: string; b: string; relation: "SAME" | "OPPOSITE" }>
  | Readonly<{ kind: "SAME_SIDE"; a: string; b: string }>;

export type Sea002Cp008DiscoveryParticipant = Readonly<{
  id: string;
  seatIndex: number;
  facing: Sea002Cp008Facing;
}>;

export type Sea002Cp008DiscoveryQuery = Readonly<{
  kind: "OPPOSITE" | "RELATIVE";
  reference: string;
  steps?: number;
  direction?: Sea002Cp008RelativeDirection;
  answer: string;
}>;

export type Sea002Cp008DiscoveryCaselet = Readonly<{
  prototypeId: Sea002Cp008PrototypeId;
  seed: string;
  schema: Sea002Cp008SquareSchema;
  facingMode: Sea002Cp008FacingMode;
  participants: readonly Sea002Cp008DiscoveryParticipant[];
  clues: readonly Sea002Cp008DiscoveryClue[];
  query: Sea002Cp008DiscoveryQuery;
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

const DISCOVERY_LIFECYCLE = Object.freeze({
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
  if (values.length === 0) return [];
  const shift = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

export function sea002Cp008PrototypeConfig(prototypeId: Sea002Cp008PrototypeId) {
  if (prototypeId === "SEA-CP008-PROT-001") return Object.freeze({ schema: "ALT8_CORNERS_MIDDLES" as const, facingMode: "CORNERS_IN_SIDES_OUT" as const });
  if (prototypeId === "SEA-CP008-PROT-002") return Object.freeze({ schema: "ALT8_CORNERS_MIDDLES" as const, facingMode: "CORNERS_OUT_SIDES_IN" as const });
  if (prototypeId === "SEA-CP008-PROT-003") return Object.freeze({ schema: "SIDEPAIR8" as const, facingMode: "ALL_IN" as const });
  if (prototypeId === "SEA-CP008-PROT-004") return Object.freeze({ schema: "SIDEPAIR8" as const, facingMode: "MIXED" as const });
  return Object.freeze({ schema: "ALT12_CORNER_PLUS_TWO_SIDE" as const, facingMode: "CORNERS_IN_SIDES_OUT" as const });
}

function facingAt(
  prototypeId: Sea002Cp008PrototypeId,
  seatIndex: number,
  personId: string,
  seed: string,
): Sea002Cp008Facing {
  const { schema, facingMode } = sea002Cp008PrototypeConfig(prototypeId);
  if (facingMode === "CORNERS_IN_SIDES_OUT" || facingMode === "CORNERS_OUT_SIDES_IN") {
    return squareRoleFacing(squareSeat(schema, seatIndex).role, facingMode);
  }
  if (facingMode === "ALL_IN") return "IN";
  return hashInt(`${seed}:${personId}:mixed-facing`) % 2 === 0 ? "IN" : "OUT";
}

function makeParticipants(prototypeId: Sea002Cp008PrototypeId, seed: string): readonly Sea002Cp008DiscoveryParticipant[] {
  const { schema } = sea002Cp008PrototypeConfig(prototypeId);
  const count = squareSeatCount(schema);
  const names = rotate(NAMES, hashInt(`${seed}:names`) % NAMES.length).slice(0, count);
  return Object.freeze(names.map((id, seatIndex) => Object.freeze({
    id,
    seatIndex,
    facing: facingAt(prototypeId, seatIndex, id, seed),
  })));
}

function directionForClockwiseNext(facing: Sea002Cp008Facing): Sea002Cp008RelativeDirection {
  return facing === "OUT" ? "RIGHT" : "LEFT";
}

function buildConstraintProofClues(
  prototypeId: Sea002Cp008PrototypeId,
  participants: readonly Sea002Cp008DiscoveryParticipant[],
): readonly Sea002Cp008DiscoveryClue[] {
  const { schema, facingMode } = sea002Cp008PrototypeConfig(prototypeId);
  const clues: Sea002Cp008DiscoveryClue[] = [];
  const anchor = participants[0]!;
  clues.push(Object.freeze({ kind: "FACING_ANCHOR", person: anchor.id, facing: anchor.facing }));

  if (schema !== "SIDEPAIR8") {
    clues.push(Object.freeze({ kind: "ROLE", person: anchor.id, role: squareSeat(schema, anchor.seatIndex).role }));
  }

  if (facingMode === "MIXED") {
    for (let index = 1; index < participants.length; index += 1) {
      const previous = participants[index - 1]!;
      const current = participants[index]!;
      clues.push(Object.freeze({
        kind: "FACING_RELATION",
        a: previous.id,
        b: current.id,
        relation: previous.facing === current.facing ? "SAME" : "OPPOSITE",
      }));
    }
  }

  // Discovery-only constraint spine. It is intentionally not a learner stem; later waves must replace this with minimal exam-real clues.
  for (let index = 1; index < participants.length; index += 1) {
    const reference = participants[index - 1]!;
    const subject = participants[index]!;
    clues.push(Object.freeze({
      kind: "RELATIVE",
      subject: subject.id,
      reference: reference.id,
      steps: 1,
      direction: directionForClockwiseNext(reference.facing),
    }));
  }

  if (schema === "SIDEPAIR8") {
    for (let side = 0; side < 4; side += 1) {
      const pair = participants.filter((participant) => squareSeat(schema, participant.seatIndex).side === side);
      clues.push(Object.freeze({ kind: "SAME_SIDE", a: pair[0]!.id, b: pair[1]!.id }));
    }
  } else {
    const oppositeA = participants[0]!;
    const oppositeB = participants[squareOppositeIndex(schema, oppositeA.seatIndex)]!;
    clues.push(Object.freeze({ kind: "OPPOSITE", a: oppositeA.id, b: oppositeB.id }));
  }

  return Object.freeze(clues);
}

function buildQuery(
  prototypeId: Sea002Cp008PrototypeId,
  participants: readonly Sea002Cp008DiscoveryParticipant[],
): Sea002Cp008DiscoveryQuery {
  const { schema } = sea002Cp008PrototypeConfig(prototypeId);
  const reference = participants[1]!;
  if (prototypeId === "SEA-CP008-PROT-003" || prototypeId === "SEA-CP008-PROT-005") {
    const direction: Sea002Cp008RelativeDirection = "RIGHT";
    const steps = prototypeId === "SEA-CP008-PROT-005" ? 3 : 2;
    const targetIndex = squareRelativeIndex(schema, reference.seatIndex, reference.facing, direction, steps);
    const answer = participants.find((participant) => participant.seatIndex === targetIndex)!.id;
    return Object.freeze({ kind: "RELATIVE", reference: reference.id, direction, steps, answer });
  }
  const targetIndex = squareOppositeIndex(schema, reference.seatIndex);
  const answer = participants.find((participant) => participant.seatIndex === targetIndex)!.id;
  return Object.freeze({ kind: "OPPOSITE", reference: reference.id, answer });
}

export function generateSea002Cp008DiscoveryCaselet(
  prototypeId: Sea002Cp008PrototypeId,
  seed: string,
): Sea002Cp008DiscoveryCaselet {
  const config = sea002Cp008PrototypeConfig(prototypeId);
  const participants = makeParticipants(prototypeId, seed);
  const clues = buildConstraintProofClues(prototypeId, participants);
  const query = buildQuery(prototypeId, participants);
  const structuralFingerprint = createHash("sha256").update(JSON.stringify({
    prototypeId,
    schema: config.schema,
    facingMode: config.facingMode,
    participants,
    clues,
    query,
  })).digest("hex");
  return Object.freeze({
    prototypeId,
    seed,
    schema: config.schema,
    facingMode: config.facingMode,
    participants,
    clues,
    query,
    lifecycle: DISCOVERY_LIFECYCLE,
    structuralFingerprint,
  });
}
