import { createHash } from "node:crypto";

import {
  squareOppositeIndex,
  squareRelativeIndex,
  type Sea002Cp008Facing,
  type Sea002Cp008RelativeDirection,
} from "./topology-v1.ts";
import type { Sea002Cp008DiscoveryClue } from "./discovery-v1.ts";

export const SEA002_CP008_WAVE02_PROTOTYPE_IDS = Object.freeze([
  "SEA-CP008-PROT-006",
  "SEA-CP008-PROT-007",
  "SEA-CP008-PROT-008",
] as const);

export type Sea002Cp008Wave02PrototypeId = (typeof SEA002_CP008_WAVE02_PROTOTYPE_IDS)[number];
export type Sea002Cp008Wave02FacingMode = "ALL_IN" | "ALL_OUT" | "MIXED";

export type Sea002Cp008Wave02Caselet = Readonly<{
  prototypeId: Sea002Cp008Wave02PrototypeId;
  seed: string;
  schema: "ALT8_CORNERS_MIDDLES";
  facingMode: Sea002Cp008Wave02FacingMode;
  participants: readonly Readonly<{ id: string; seatIndex: number; facing: Sea002Cp008Facing }>[];
  clues: readonly Sea002Cp008DiscoveryClue[];
  query: Readonly<{
    kind: "OPPOSITE" | "RELATIVE";
    reference: string;
    steps?: number;
    direction?: Sea002Cp008RelativeDirection;
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

const NAMES = Object.freeze(["Aarav", "Aditi", "Kabir", "Mehak", "Rohan", "Simran", "Arjun", "Isha"] as const);
const MIXED_PATTERN = Object.freeze(["IN", "IN", "OUT", "IN", "OUT", "OUT", "IN", "OUT"] as const);
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

function facingMode(prototypeId: Sea002Cp008Wave02PrototypeId): Sea002Cp008Wave02FacingMode {
  if (prototypeId === "SEA-CP008-PROT-006") return "ALL_IN";
  if (prototypeId === "SEA-CP008-PROT-007") return "ALL_OUT";
  return "MIXED";
}

function participantsFor(prototypeId: Sea002Cp008Wave02PrototypeId, seed: string) {
  const names = rotate(NAMES, hashInt(`${seed}:names`) % NAMES.length);
  const mode = facingMode(prototypeId);
  const invert = hashInt(`${seed}:mixed-invert`) % 2 === 1;
  return Object.freeze(names.map((id, seatIndex) => Object.freeze({
    id,
    seatIndex,
    facing: mode === "ALL_IN"
      ? "IN" as const
      : mode === "ALL_OUT"
        ? "OUT" as const
        : (invert ? (MIXED_PATTERN[seatIndex] === "IN" ? "OUT" : "IN") : MIXED_PATTERN[seatIndex]),
  })));
}

function nextDirection(facing: Sea002Cp008Facing): Sea002Cp008RelativeDirection {
  return facing === "OUT" ? "RIGHT" : "LEFT";
}

function cluesFor(prototypeId: Sea002Cp008Wave02PrototypeId, participants: ReturnType<typeof participantsFor>) {
  const clues: Sea002Cp008DiscoveryClue[] = [];
  clues.push(Object.freeze({ kind: "ROLE", person: participants[0]!.id, role: "CORNER" as const }));
  clues.push(Object.freeze({ kind: "ROLE", person: participants[1]!.id, role: "SIDE" as const }));
  clues.push(Object.freeze({ kind: "FACING_ANCHOR", person: participants[0]!.id, facing: participants[0]!.facing }));

  if (prototypeId === "SEA-CP008-PROT-008") {
    for (let index = 1; index < participants.length; index += 1) {
      const previous = participants[index - 1]!;
      const current = participants[index]!;
      clues.push(Object.freeze({
        kind: "FACING_RELATION",
        a: previous.id,
        b: current.id,
        relation: previous.facing === current.facing ? "SAME" as const : "OPPOSITE" as const,
      }));
    }
  }

  for (let index = 1; index < participants.length; index += 1) {
    const reference = participants[index - 1]!;
    const subject = participants[index]!;
    clues.push(Object.freeze({
      kind: "RELATIVE",
      subject: subject.id,
      reference: reference.id,
      steps: 1,
      direction: nextDirection(reference.facing),
    }));
  }
  return Object.freeze(clues);
}

function queryFor(prototypeId: Sea002Cp008Wave02PrototypeId, participants: ReturnType<typeof participantsFor>) {
  if (prototypeId === "SEA-CP008-PROT-007") {
    const reference = participants[2]!;
    const direction = "RIGHT" as const;
    const steps = 2;
    const target = squareRelativeIndex("ALT8_CORNERS_MIDDLES", reference.seatIndex, reference.facing, direction, steps);
    return Object.freeze({ kind: "RELATIVE" as const, reference: reference.id, direction, steps, answer: participants[target]!.id });
  }
  const reference = prototypeId === "SEA-CP008-PROT-008" ? participants[3]! : participants[1]!;
  return Object.freeze({
    kind: "OPPOSITE" as const,
    reference: reference.id,
    answer: participants[squareOppositeIndex("ALT8_CORNERS_MIDDLES", reference.seatIndex)]!.id,
  });
}

export function generateSea002Cp008Wave02Caselet(
  prototypeId: Sea002Cp008Wave02PrototypeId,
  seed: string,
): Sea002Cp008Wave02Caselet {
  const participants = participantsFor(prototypeId, seed);
  const clues = cluesFor(prototypeId, participants);
  const query = queryFor(prototypeId, participants);
  const fingerprint = createHash("sha256").update(JSON.stringify({ prototypeId, participants, clues, query })).digest("hex");
  return Object.freeze({
    prototypeId,
    seed,
    schema: "ALT8_CORNERS_MIDDLES" as const,
    facingMode: facingMode(prototypeId),
    participants,
    clues,
    query,
    lifecycle: LIFECYCLE,
    structuralFingerprint: fingerprint,
  });
}
