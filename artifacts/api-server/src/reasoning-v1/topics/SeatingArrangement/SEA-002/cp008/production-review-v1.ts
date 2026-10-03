import { createHash } from "node:crypto";

import { generateSea002Cp008DiscoveryCaselet } from "./discovery-v1.ts";
import { generateSea002Cp008Wave02Caselet } from "./discovery-wave02-v1.ts";
import { generateSea002Cp008VariableSide6Caselet } from "./discovery-variable-side6-v1.ts";
import { generateSea002Cp008Alt12Caselet } from "./discovery-alt12-v1.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  SEA002_CP008_PERMANENT_QL_REGISTRY,
  type Sea002Cp008PermanentQlId,
} from "./permanent/registry.ts";

export type Sea002Cp008Difficulty = "Easy" | "Medium" | "Hard";
export type Sea002Cp008Facing = "IN" | "OUT";

export type Sea002Cp008NormalizedClue =
  | Readonly<{ kind: "ROLE"; person: string; role: "CORNER" | "SIDE" }>
  | Readonly<{ kind: "FACING_ANCHOR"; person: string; facing: Sea002Cp008Facing }>
  | Readonly<{ kind: "FACING_RELATION"; a: string; b: string; relation: "SAME" | "OPPOSITE" }>
  | Readonly<{ kind: "RELATIVE"; subject: string; reference: string; steps: number; direction: "LEFT" | "RIGHT" }>
  | Readonly<{ kind: "OPPOSITE"; a: string; b: string }>
  | Readonly<{ kind: "SAME_SIDE"; a: string; b: string }>
  | Readonly<{ kind: "OCCUPANCY_CLASS"; person: string; occupancyKind: "SINGLE" | "PAIRED" }>
  | Readonly<{ kind: "RELATIVE_METRIC"; subject: string; reference: string; direction: "LEFT" | "RIGHT"; metres: number }>;

export type Sea002Cp008NormalizedQuery = Readonly<{
  kind: "OPPOSITE" | "RELATIVE" | "RELATIVE_METRIC";
  reference: string;
  steps?: number;
  direction?: "LEFT" | "RIGHT";
  metres?: number;
  answer: string;
}>;

export type Sea002Cp008ReviewTopology =
  | "ALT8_ROLE_DERIVED"
  | "ALT12_ROLE_DERIVED"
  | "SIDEPAIR8_UNIFORM"
  | "SIDEPAIR8_MIXED"
  | "ALT8_UNIFORM"
  | "ALT8_MIXED"
  | "VARIABLE_SIDE6"
  | "ALT12_METRIC";

export type Sea002Cp008ReviewCandidate = Readonly<{
  checkpointId: "SEA-CP-008";
  permanentQlId: Sea002Cp008PermanentQlId;
  authorityKey: string;
  signatureId: string;
  seed: string;
  variantIndex: number;
  topology: Sea002Cp008ReviewTopology;
  facingMode: string;
  difficulty: Sea002Cp008Difficulty;
  examLineage: "SSC" | "RRB" | "BANKING" | "STATE";
  participants: readonly Readonly<{ id: string; seatIndex: number; facing: Sea002Cp008Facing }>[];
  clues: readonly Sea002Cp008NormalizedClue[];
  query: Sea002Cp008NormalizedQuery;
  stem: string;
  question: string;
  options: readonly string[];
  correctOptionIndex: number;
  answer: string;
  explanation: string;
  reviewStatus: "ENGLISH_REVIEW_CANDIDATE_HUMAN_APPROVAL_PENDING";
  active: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  publiclyPublishable: false;
  fingerprint: string;
}>;

const QL_CONFIG = Object.freeze({
  "SEA-QL-029": Object.freeze({ topology: "ALT8_ROLE_DERIVED" as const, lineage: ["RRB", "BANKING", "SSC", "RRB", "BANKING", "BANKING"] as const }),
  "SEA-QL-030": Object.freeze({ topology: "SIDEPAIR8_UNIFORM" as const, lineage: ["SSC", "BANKING", "RRB", "SSC", "BANKING", "STATE"] as const }),
  "SEA-QL-031": Object.freeze({ topology: "SIDEPAIR8_MIXED" as const, lineage: ["BANKING", "BANKING", "RRB", "SSC", "BANKING", "STATE"] as const }),
  "SEA-QL-032": Object.freeze({ topology: "ALT8_UNIFORM" as const, lineage: ["RRB", "SSC", "STATE", "RRB", "SSC", "BANKING"] as const }),
  "SEA-QL-033": Object.freeze({ topology: "ALT8_MIXED" as const, lineage: ["BANKING", "BANKING", "SSC", "RRB", "BANKING", "STATE"] as const }),
  "SEA-QL-034": Object.freeze({ topology: "VARIABLE_SIDE6" as const, lineage: ["RRB", "RRB", "SSC", "STATE", "RRB", "BANKING"] as const }),
  "SEA-QL-035": Object.freeze({ topology: "ALT12_METRIC" as const, lineage: ["BANKING", "BANKING", "BANKING", "SSC", "BANKING", "RRB"] as const }),
} as const);

function hashInt(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  if (values.length === 0) return [];
  const shift = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function difficultyFor(variantIndex: number): Sea002Cp008Difficulty {
  if (variantIndex < 2) return "Easy";
  if (variantIndex < 4) return "Medium";
  return "Hard";
}

function normalizeDiscoveryClue(clue: any): Sea002Cp008NormalizedClue {
  if (clue.kind === "ROLE") return Object.freeze({ kind: "ROLE", person: clue.person, role: clue.role });
  if (clue.kind === "FACING_ANCHOR") return Object.freeze({ kind: "FACING_ANCHOR", person: clue.person, facing: clue.facing });
  if (clue.kind === "FACING_RELATION") return Object.freeze({ kind: "FACING_RELATION", a: clue.a, b: clue.b, relation: clue.relation });
  if (clue.kind === "RELATIVE") return Object.freeze({ kind: "RELATIVE", subject: clue.subject, reference: clue.reference, steps: clue.steps, direction: clue.direction });
  if (clue.kind === "OPPOSITE") return Object.freeze({ kind: "OPPOSITE", a: clue.a, b: clue.b });
  if (clue.kind === "SAME_SIDE") return Object.freeze({ kind: "SAME_SIDE", a: clue.a, b: clue.b });
  if (clue.kind === "OCCUPANCY_CLASS") return Object.freeze({ kind: "OCCUPANCY_CLASS", person: clue.person, occupancyKind: clue.occupancyKind });
  if (clue.kind === "RELATIVE_METRIC") return Object.freeze({ kind: "RELATIVE_METRIC", subject: clue.subject, reference: clue.reference, direction: clue.direction, metres: clue.metres });
  throw new Error(`Unsupported CP008 clue kind: ${String(clue.kind)}`);
}

function normalizeQuery(query: any): Sea002Cp008NormalizedQuery {
  return Object.freeze({
    kind: query.kind,
    reference: query.reference,
    steps: query.steps,
    direction: query.direction,
    metres: query.metres,
    answer: query.answer,
  });
}

function oppositeFacing(facing: Sea002Cp008Facing): Sea002Cp008Facing {
  return facing === "IN" ? "OUT" : "IN";
}

function oppositeDirection(direction: "LEFT" | "RIGHT"): "LEFT" | "RIGHT" {
  return direction === "LEFT" ? "RIGHT" : "LEFT";
}

function reverseRoleFacingCaselet(caselet: any): any {
  return Object.freeze({
    ...caselet,
    facingMode: caselet.facingMode === "CORNERS_IN_SIDES_OUT" ? "CORNERS_OUT_SIDES_IN" : "CORNERS_IN_SIDES_OUT",
    participants: Object.freeze(caselet.participants.map((participant: any) => Object.freeze({
      ...participant,
      facing: oppositeFacing(participant.facing),
    }))),
    clues: Object.freeze(caselet.clues.map((clue: any) => {
      if (clue.kind === "FACING_ANCHOR") return Object.freeze({ ...clue, facing: oppositeFacing(clue.facing) });
      if (clue.kind === "RELATIVE") return Object.freeze({ ...clue, direction: oppositeDirection(clue.direction) });
      return clue;
    })),
    query: caselet.query.kind === "RELATIVE"
      ? Object.freeze({ ...caselet.query, direction: oppositeDirection(caselet.query.direction) })
      : caselet.query,
  });
}

function hiddenCaselet(permanentQlId: Sea002Cp008PermanentQlId, seed: string, variantIndex: number) {
  if (permanentQlId === "SEA-QL-029") {
    const slot = variantIndex % 6;
    if (slot >= 4) {
      const alt12 = generateSea002Cp008DiscoveryCaselet("SEA-CP008-PROT-005", seed);
      return slot === 5 ? reverseRoleFacingCaselet(alt12) : alt12;
    }
    return generateSea002Cp008DiscoveryCaselet(slot % 2 === 0 ? "SEA-CP008-PROT-001" : "SEA-CP008-PROT-002", seed);
  }
  if (permanentQlId === "SEA-QL-030") return generateSea002Cp008DiscoveryCaselet("SEA-CP008-PROT-003", seed);
  if (permanentQlId === "SEA-QL-031") return generateSea002Cp008DiscoveryCaselet("SEA-CP008-PROT-004", seed);
  if (permanentQlId === "SEA-QL-032") {
    return generateSea002Cp008Wave02Caselet(variantIndex % 2 === 0 ? "SEA-CP008-PROT-006" : "SEA-CP008-PROT-007", seed);
  }
  if (permanentQlId === "SEA-QL-033") return generateSea002Cp008Wave02Caselet("SEA-CP008-PROT-008", seed);
  if (permanentQlId === "SEA-QL-034") return generateSea002Cp008VariableSide6Caselet(seed);
  return generateSea002Cp008Alt12Caselet(seed);
}

function facingModeLabel(caselet: any): string {
  return String(caselet.facingMode ?? "ALL_IN");
}

function topologyFor(permanentQlId: Sea002Cp008PermanentQlId, variantIndex: number): Sea002Cp008ReviewTopology {
  if (permanentQlId === "SEA-QL-029" && variantIndex % 6 >= 4) return "ALT12_ROLE_DERIVED";
  return QL_CONFIG[permanentQlId].topology;
}

function topologyIntro(topology: Sea002Cp008ReviewTopology, facingMode: string, style: number): string {
  const variants: Record<Sea002Cp008ReviewTopology, readonly string[]> = {
    ALT8_ROLE_DERIVED: facingMode === "CORNERS_OUT_SIDES_IN"
      ? [
        "Eight persons sit around a square table. Four occupy the corners and four sit at the middle of the sides. Corner occupants face outside while side-middle occupants face the centre.",
        "Eight people are seated at a square table, one at every corner and one at the centre of every side. Those at corners face away from the table; the others face inward.",
        "Around a square table sit eight persons: four at corners and four at side centres. The corner seats face outward and the side-centre seats face inward.",
      ]
      : [
        "Eight persons sit around a square table. Four occupy the corners and four sit at the middle of the sides. Corner occupants face the centre while side-middle occupants face outside.",
        "Eight people are seated at a square table, one at every corner and one at the centre of every side. Those at corners face inward; the others face away from the table.",
        "Around a square table sit eight persons: four at corners and four at side centres. The corner seats face the centre and the side-centre seats face outward.",
      ],
    ALT12_ROLE_DERIVED: facingMode === "CORNERS_OUT_SIDES_IN"
      ? [
        "Twelve persons sit around a square table. One person occupies each corner and two persons sit along each side. Corner occupants face outside while side occupants face the centre.",
        "A square table has twelve occupants: one at every corner and two on every side. Those at corners face away from the centre; all side-seat occupants face inward.",
        "Twelve people are seated around a square table with four corner seats and eight side seats. The corner seats face outward and the side seats face the centre.",
      ]
      : [
        "Twelve persons sit around a square table. One person occupies each corner and two persons sit along each side. Corner occupants face the centre while side occupants face outside.",
        "A square table has twelve occupants: one at every corner and two on every side. Those at corners face inward; all side-seat occupants face away from the centre.",
        "Twelve people are seated around a square table with four corner seats and eight side seats. The corner seats face the centre and the side seats face outward.",
      ],
    SIDEPAIR8_UNIFORM: [
      "Eight persons sit around a square table, two on each side. No one occupies a corner and everyone faces the centre.",
      "Eight people are seated along the four sides of a square table, with exactly two people on every side and none at a corner. All face inward.",
      "A square table has eight occupants, two on each side and no corner seat in use. Every person faces the centre.",
    ],
    SIDEPAIR8_MIXED: [
      "Eight persons sit around a square table, two on each side and none at the corners. Some face the centre and some face outside.",
      "Eight people occupy a square table with exactly two on each side; corner positions are vacant. Their facing directions are not uniform.",
      "There are eight occupants around a square table, two per side and no one at a corner. Each person may face inward or outward.",
    ],
    ALT8_UNIFORM: facingMode === "ALL_OUT"
      ? [
        "Eight persons sit around a square table, four at the corners and four at the middle of the sides. Everyone faces outside.",
        "Eight people occupy the four corners and four side-centres of a square table. All of them face away from the centre.",
        "A square table has one person at each corner and one at each side-centre; all eight face outward.",
      ]
      : [
        "Eight persons sit around a square table, four at the corners and four at the middle of the sides. Everyone faces the centre.",
        "Eight people occupy the four corners and four side-centres of a square table. All of them face inward.",
        "A square table has one person at each corner and one at each side-centre; all eight face the centre.",
      ],
    ALT8_MIXED: [
      "Eight persons sit around a square table, four at corners and four at side-centres. Some face the centre while the others face outside.",
      "Eight people occupy the corner and side-centre positions of a square table. Their inward/outward facing directions differ.",
      "A square table has eight occupants, one at each corner and side-centre. Each person may face inward or outward.",
    ],
    VARIABLE_SIDE6: [
      "Six persons sit on the sides of a square table and all face the centre. No one sits at a corner. One pair of opposite sides has one occupant each, while the other two sides have two occupants each.",
      "Six people are seated along a square table, with all corner positions vacant and everyone facing inward. Two opposite sides contain one person each; the remaining sides contain two each.",
      "Around a square table sit six persons, none at a corner. All face the centre. The side-occupancy pattern is 1-2-1-2 around the table.",
    ],
    ALT12_METRIC: [
      "Twelve persons sit around a square table of perimeter 60 m. One person sits at each corner and two sit on each side, with equal 5 m spacing between consecutive seats. Everyone faces the centre.",
      "A 60 m square perimeter has twelve equally spaced occupants: one at every corner and two on every side. Adjacent seats are 5 m apart and all persons face inward.",
      "Twelve people are equally spaced around a square table whose perimeter is 60 m. Each corner has one occupant and every side has two additional occupants; all face the centre.",
    ],
  };
  const pool = variants[topology];
  return pool[style % pool.length]!;
}

function ordinalPhrase(steps: number): string {
  if (steps === 1) return "immediately";
  if (steps === 2) return "second";
  if (steps === 3) return "third";
  if (steps === 4) return "fourth";
  return `${steps} places`;
}

function renderClue(clue: Sea002Cp008NormalizedClue, style: number): string {
  if (clue.kind === "ROLE") {
    if (clue.role === "CORNER") return style % 2 === 0 ? `${clue.person} sits at a corner.` : `${clue.person} occupies one of the corner seats.`;
    return style % 2 === 0 ? `${clue.person} sits on a side seat.` : `${clue.person} does not occupy a corner.`;
  }
  if (clue.kind === "FACING_ANCHOR") {
    return `${clue.person} faces ${clue.facing === "IN" ? "the centre" : "outside"}.`;
  }
  if (clue.kind === "FACING_RELATION") {
    return clue.relation === "SAME"
      ? `${clue.a} and ${clue.b} face in the same direction.`
      : `${clue.a} and ${clue.b} face in opposite directions.`;
  }
  if (clue.kind === "RELATIVE") {
    const position = ordinalPhrase(clue.steps);
    return clue.steps === 1
      ? `${clue.subject} sits ${position} to the ${clue.direction.toLowerCase()} of ${clue.reference}.`
      : `${clue.subject} sits ${position} to the ${clue.direction.toLowerCase()} of ${clue.reference}.`;
  }
  if (clue.kind === "OPPOSITE") {
    return style % 2 === 0 ? `${clue.a} sits opposite ${clue.b}.` : `${clue.a} and ${clue.b} are opposite each other.`;
  }
  if (clue.kind === "SAME_SIDE") {
    return style % 2 === 0 ? `${clue.a} and ${clue.b} sit on the same side of the table.` : `${clue.a} shares a side of the table with ${clue.b}.`;
  }
  if (clue.kind === "OCCUPANCY_CLASS") {
    return clue.occupancyKind === "SINGLE"
      ? `${clue.person} sits alone on one side of the table.`
      : `${clue.person} sits on a side that has two occupants.`;
  }
  return `${clue.subject} is ${clue.metres} m to the ${clue.direction.toLowerCase()} of ${clue.reference}, measured along the perimeter.`;
}

function renderQuestion(query: Sea002Cp008NormalizedQuery, style: number): string {
  if (query.kind === "OPPOSITE") {
    return style % 2 === 0
      ? `Who sits opposite ${query.reference}?`
      : `Which person is seated directly opposite ${query.reference}?`;
  }
  if (query.kind === "RELATIVE_METRIC") {
    return style % 2 === 0
      ? `Who sits ${query.metres} m to the ${query.direction!.toLowerCase()} of ${query.reference}, measured along the perimeter?`
      : `Starting from ${query.reference}, who is ${query.metres} m away in the ${query.direction!.toLowerCase()}-hand direction?`;
  }
  const position = ordinalPhrase(query.steps!);
  return style % 2 === 0
    ? `Who sits ${position} to the ${query.direction!.toLowerCase()} of ${query.reference}?`
    : `Which person is ${position} on ${query.reference}'s ${query.direction!.toLowerCase()}?`;
}

function buildOptions(answer: string, participants: readonly Readonly<{ id: string }>[], seed: string): readonly string[] {
  const others = participants.map((participant) => participant.id).filter((id) => id !== answer);
  const rotated = rotate(others, hashInt(`${seed}:distractors`) % others.length);
  const selected = [answer, ...rotated.slice(0, 3)];
  return Object.freeze(rotate(selected, hashInt(`${seed}:option-order`) % selected.length));
}

function queryRelationText(query: Sea002Cp008NormalizedQuery): string {
  if (query.kind === "OPPOSITE") return `directly opposite ${query.reference}`;
  if (query.kind === "RELATIVE_METRIC") return `${query.metres} m to the ${query.direction!.toLowerCase()} of ${query.reference} along the perimeter`;
  return `${ordinalPhrase(query.steps!)} to the ${query.direction!.toLowerCase()} of ${query.reference}`;
}

function explanationFor(
  topology: Sea002Cp008ReviewTopology,
  participants: readonly Readonly<{ id: string; seatIndex: number; facing: Sea002Cp008Facing }>[],
  query: Sea002Cp008NormalizedQuery,
): string {
  const ordered = [...participants].sort((a, b) => a.seatIndex - b.seatIndex);
  const mixed = new Set(ordered.map((participant) => participant.facing)).size > 1;
  const orderText = ordered.map((participant) => mixed ? `${participant.id} (${participant.facing === "IN" ? "in" : "out"})` : participant.id).join(" → ");
  const roleDerived = topology === "ALT8_ROLE_DERIVED" || topology === "ALT12_ROLE_DERIVED";
  const setup = topology === "ALT12_METRIC"
    ? "Treat each 5 m interval as one seat-step and apply left/right from the reference person's inward-facing direction."
    : topology === "VARIABLE_SIDE6"
      ? "First fix the 1-2-1-2 side-occupancy pattern; only a half-turn is an equivalent rotation for this layout."
      : roleDerived
        ? "First identify the corner and side positions; each person's facing direction then follows directly from the stated corner-versus-side rule before left/right clues are applied."
        : mixed
          ? "Fix the square positions and propagate the facing relations before interpreting each left/right clue."
          : "Fix the square positions first, using the stated facing rule when reading every left/right clue.";
  return `${setup} One valid clockwise representation of the completed arrangement is ${orderText}. In that arrangement, ${query.answer} is ${queryRelationText(query)}. Therefore, the answer is ${query.answer}.`;
}

export function generateSea002Cp008EnglishReviewCandidate(
  permanentQlId: Sea002Cp008PermanentQlId,
  variantIndex: number,
): Sea002Cp008ReviewCandidate {
  if (!Number.isInteger(variantIndex) || variantIndex < 0) throw new Error("CP008 review variant index must be a non-negative integer.");
  const registry = SEA002_CP008_PERMANENT_QL_REGISTRY.find((entry) => entry.permanentQlId === permanentQlId);
  if (!registry) throw new Error(`Unknown CP008 permanent QL: ${permanentQlId}`);
  const config = QL_CONFIG[permanentQlId];
  const topology = topologyFor(permanentQlId, variantIndex);
  const seed = `cp008-production:${permanentQlId}:${variantIndex}`;
  const hidden: any = hiddenCaselet(permanentQlId, seed, variantIndex);
  const participants = Object.freeze(hidden.participants.map((participant: any) => Object.freeze({
    id: participant.id,
    seatIndex: participant.seatIndex,
    facing: participant.facing as Sea002Cp008Facing,
  })));
  const clues = Object.freeze(hidden.clues.map((clue: any) => normalizeDiscoveryClue(clue)));
  const query = normalizeQuery(hidden.query);
  const style = hashInt(`${seed}:style`) % 6;
  const renderedClues = clues.map((clue, index) => renderClue(clue, style + index));
  const clueOrder = rotate(renderedClues, style % Math.max(1, renderedClues.length));
  const stem = `${topologyIntro(topology, facingModeLabel(hidden), style)} ${clueOrder.join(" ")}`;
  const question = renderQuestion(query, style);
  const options = buildOptions(query.answer, participants, seed);
  const correctOptionIndex = options.indexOf(query.answer);
  const explanation = explanationFor(topology, participants, query);
  const fingerprint = createHash("sha256").update(JSON.stringify({ permanentQlId, seed, stem, question, options, explanation })).digest("hex");
  return Object.freeze({
    checkpointId: "SEA-CP-008" as const,
    permanentQlId,
    authorityKey: registry.authorityKey,
    signatureId: registry.signatureId,
    seed,
    variantIndex,
    topology,
    facingMode: facingModeLabel(hidden),
    difficulty: difficultyFor(variantIndex % 6),
    examLineage: config.lineage[variantIndex % config.lineage.length],
    participants,
    clues,
    query,
    stem,
    question,
    options,
    correctOptionIndex,
    answer: query.answer,
    explanation,
    reviewStatus: "ENGLISH_REVIEW_CANDIDATE_HUMAN_APPROVAL_PENDING" as const,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    publiclyPublishable: false as const,
    fingerprint,
  });
}

export const SEA002_CP008_ENGLISH_REVIEW_SET_V1: readonly Sea002Cp008ReviewCandidate[] = Object.freeze(
  SEA002_CP008_PERMANENT_QL_IDS.flatMap((permanentQlId) =>
    Array.from({ length: 6 }, (_, variantIndex) => generateSea002Cp008EnglishReviewCandidate(permanentQlId, variantIndex)),
  ),
);
