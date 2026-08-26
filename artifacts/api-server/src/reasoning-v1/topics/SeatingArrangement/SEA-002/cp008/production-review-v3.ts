import { createHash } from "node:crypto";

import {
  generateSea002Cp008EnglishReviewCandidate,
  type Sea002Cp008NormalizedClue,
  type Sea002Cp008NormalizedQuery,
  type Sea002Cp008ReviewCandidate,
} from "./production-review-v1.ts";
import {
  compileSea002Cp008ProductionLearnerGraphV3,
  type Sea002Cp008ProductionClueV3,
  type Sea002Cp008ProductionQueryV3,
} from "./production-clue-compiler-v3.ts";
import {
  SEA002_CP008_PERMANENT_QL_IDS,
  type Sea002Cp008PermanentQlId,
} from "./permanent/registry.ts";

export type Sea002Cp008ReviewCandidateV3 = Sea002Cp008ReviewCandidate & Readonly<{
  productionGraphProof: ReturnType<typeof compileSea002Cp008ProductionLearnerGraphV3>["proof"];
}>;

function hashInt(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  if (values.length === 0) return [];
  const shift = ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function ordinal(steps: number): string {
  if (steps === 1) return "immediately";
  if (steps === 2) return "second";
  if (steps === 3) return "third";
  if (steps === 4) return "fourth";
  if (steps === 5) return "fifth";
  return `${steps} places`;
}

function renderClue(clue: Sea002Cp008ProductionClueV3, style: number): string {
  if (clue.kind === "ROLE") {
    if (clue.role === "CORNER") {
      return style % 3 === 0
        ? `${clue.person} occupies a corner seat.`
        : style % 3 === 1
          ? `${clue.person} is seated at one of the corners.`
          : `${clue.person} sits at a corner of the table.`;
    }
    return style % 2 === 0 ? `${clue.person} occupies a side position.` : `${clue.person} is seated on a side, not at a corner.`;
  }
  if (clue.kind === "FACING_ANCHOR") {
    return style % 2 === 0
      ? `${clue.person} faces ${clue.facing === "IN" ? "the centre" : "outside"}.`
      : `${clue.person}'s face is directed ${clue.facing === "IN" ? "towards the centre" : "away from the centre"}.`;
  }
  if (clue.kind === "FACING_RELATION") {
    return clue.relation === "SAME"
      ? (style % 2 === 0 ? `${clue.a} and ${clue.b} face in the same direction.` : `${clue.a} faces the same way as ${clue.b}.`)
      : (style % 2 === 0 ? `${clue.a} and ${clue.b} face in opposite directions.` : `${clue.a} faces a direction opposite to ${clue.b}.`);
  }
  if (clue.kind === "OPPOSITE") {
    return style % 2 === 0 ? `${clue.a} sits directly opposite ${clue.b}.` : `${clue.a} and ${clue.b} are seated opposite each other.`;
  }
  if (clue.kind === "SAME_SIDE") {
    return style % 2 === 0 ? `${clue.a} and ${clue.b} are on the same side of the table.` : `${clue.a} shares the same side of the table with ${clue.b}.`;
  }
  if (clue.kind === "OCCUPANCY_CLASS") {
    return clue.occupancyKind === "SINGLE"
      ? `${clue.person} is the only person seated on that side.`
      : `${clue.person} is seated on a side occupied by two persons.`;
  }
  if (clue.kind === "RELATIVE_METRIC") {
    return style % 3 === 0
      ? `${clue.subject} is ${clue.metres} m to the ${clue.direction.toLowerCase()} of ${clue.reference}, measured along the perimeter.`
      : style % 3 === 1
        ? `Moving along the perimeter from ${clue.reference}'s ${clue.direction.toLowerCase()}, ${clue.subject} is ${clue.metres} m away.`
        : `${clue.subject} is seated ${clue.metres} m away on the ${clue.direction.toLowerCase()}-hand side of ${clue.reference}.`;
  }
  const position = ordinal(clue.steps);
  return style % 3 === 0
    ? `${clue.subject} sits ${position} to the ${clue.direction.toLowerCase()} of ${clue.reference}.`
    : style % 3 === 1
      ? `Counting from ${clue.reference}'s ${clue.direction.toLowerCase()}, ${clue.subject} is in the ${position === "immediately" ? "next" : position} position.`
      : `${clue.subject} is ${position} on the ${clue.direction.toLowerCase()}-hand side of ${clue.reference}.`;
}

function renderQuestion(query: Sea002Cp008ProductionQueryV3, style: number): string {
  if (query.kind === "OPPOSITE") {
    return style % 2 === 0 ? `Who is seated opposite ${query.reference}?` : `Which person sits directly opposite ${query.reference}?`;
  }
  if (query.kind === "RELATIVE_METRIC") {
    return style % 2 === 0
      ? `Who is ${query.metres} m to the ${query.direction!.toLowerCase()} of ${query.reference} along the perimeter?`
      : `Starting from ${query.reference}, which person is found ${query.metres} m away on the ${query.direction!.toLowerCase()}?`;
  }
  return style % 2 === 0
    ? `Who sits ${ordinal(query.steps!)} to the ${query.direction!.toLowerCase()} of ${query.reference}?`
    : `Which person is ${ordinal(query.steps!)} on ${query.reference}'s ${query.direction!.toLowerCase()}?`;
}

function shuffledClueText(clues: readonly Sea002Cp008ProductionClueV3[], seed: string): string {
  return clues
    .map((clue, index) => ({ clue, index, rank: hashInt(`${seed}:clue-order:${index}:${JSON.stringify(clue)}`) }))
    .sort((a, b) => a.rank - b.rank || a.index - b.index)
    .map(({ clue, index }) => renderClue(clue, hashInt(`${seed}:clue-style:${index}`) % 6))
    .join(" ");
}

function buildOptions(answer: string, participantIds: readonly string[], seed: string): readonly string[] {
  const others = participantIds.filter((id) => id !== answer);
  const distractors = rotate(others, hashInt(`${seed}:v3-distractors`) % others.length).slice(0, 3);
  return Object.freeze(rotate([answer, ...distractors], hashInt(`${seed}:v3-options`) % 4));
}

function relationText(query: Sea002Cp008ProductionQueryV3): string {
  if (query.kind === "OPPOSITE") return `directly opposite ${query.reference}`;
  if (query.kind === "RELATIVE_METRIC") return `${query.metres} m to the ${query.direction!.toLowerCase()} of ${query.reference} along the perimeter`;
  return `${ordinal(query.steps!)} to the ${query.direction!.toLowerCase()} of ${query.reference}`;
}

function explanation(
  candidate: Sea002Cp008ReviewCandidate,
  query: Sea002Cp008ProductionQueryV3,
  proof: ReturnType<typeof compileSea002Cp008ProductionLearnerGraphV3>["proof"],
): string {
  const ordered = [...candidate.participants].sort((a, b) => a.seatIndex - b.seatIndex);
  const showFacing = candidate.topology === "ALT8_MIXED"
    || candidate.topology === "SIDEPAIR8_MIXED"
    || candidate.topology === "ALT8_ROLE_DERIVED"
    || candidate.topology === "ALT12_ROLE_DERIVED";
  const orderText = ordered.map((participant) =>
    showFacing ? `${participant.id} (${participant.facing === "IN" ? "in" : "out"})` : participant.id,
  ).join(" → ");

  let opening: string;
  if (candidate.topology === "ALT12_METRIC") {
    opening = "Since adjacent seats are 5 m apart, first convert every distance clue into seat-steps and place the linked persons around the perimeter.";
  } else if (candidate.topology === "VARIABLE_SIDE6") {
    opening = "Start with the side-occupancy clue to fix the 1-2-1-2 pattern, then combine the opposite and left/right relations to place the remaining persons.";
  } else if (candidate.topology === "ALT8_MIXED" || candidate.topology === "SIDEPAIR8_MIXED") {
    opening = `First use the facing clues to determine each person's direction, then apply the left/right and opposite relations. The asked pair is separated by ${proof.askedRelationGraphDepth} clue-links, so it is obtained only after combining the arrangement.`;
  } else if (candidate.topology === "ALT8_ROLE_DERIVED" || candidate.topology === "ALT12_ROLE_DERIVED") {
    opening = "First identify the corner and side positions. The stated corner-versus-side rule then fixes each person's facing direction, after which the relative-position clues can be combined.";
  } else {
    opening = `Use the role or same-side anchor to fix the square orientation, then combine the relative-position clues. The asked relation needs ${proof.askedRelationGraphDepth} clue-links rather than coming directly from one clue.`;
  }
  return `${opening} One valid clockwise representation is ${orderText}. Hence ${query.answer} is ${relationText(query)}. Therefore, the correct answer is ${query.answer}.`;
}

function introFromBase(base: Sea002Cp008ReviewCandidate): string {
  const firstClue = base.clues.length > 0 ? renderClue(base.clues[0] as unknown as Sea002Cp008ProductionClueV3, 0) : "";
  if (!firstClue || !base.stem.endsWith(firstClue)) {
    const marker = base.stem.indexOf(". ");
    return marker >= 0 ? base.stem.slice(0, marker + 1) : base.stem;
  }
  return base.stem.slice(0, Math.max(0, base.stem.length - firstClue.length)).trim();
}

function topologyIntroduction(base: Sea002Cp008ReviewCandidate): string {
  if (base.topology === "ALT8_ROLE_DERIVED") {
    return base.facingMode === "CORNERS_OUT_SIDES_IN"
      ? "Eight persons sit around a square table, four at the corners and four at the side-centres. Corner occupants face outside and side-centre occupants face the centre."
      : "Eight persons sit around a square table, four at the corners and four at the side-centres. Corner occupants face the centre and side-centre occupants face outside.";
  }
  if (base.topology === "ALT12_ROLE_DERIVED") {
    return base.facingMode === "CORNERS_OUT_SIDES_IN"
      ? "Twelve persons sit around a square table, one at each corner and two along each side. Corner occupants face outside while side occupants face the centre."
      : "Twelve persons sit around a square table, one at each corner and two along each side. Corner occupants face the centre while side occupants face outside.";
  }
  if (base.topology === "SIDEPAIR8_UNIFORM") return "Eight persons sit around a square table, exactly two on each side and none at the corners. Everyone faces the centre.";
  if (base.topology === "SIDEPAIR8_MIXED") return "Eight persons sit around a square table, exactly two on each side and none at the corners. Some face the centre and the others face outside.";
  if (base.topology === "ALT8_UNIFORM") return base.facingMode === "ALL_OUT"
    ? "Eight persons sit around a square table, four at the corners and four at the side-centres. Everyone faces outside."
    : "Eight persons sit around a square table, four at the corners and four at the side-centres. Everyone faces the centre.";
  if (base.topology === "ALT8_MIXED") return "Eight persons sit around a square table, four at the corners and four at the side-centres. Each person may face the centre or outside.";
  if (base.topology === "VARIABLE_SIDE6") return "Six persons sit on the sides of a square table and all face the centre. No one sits at a corner; opposite sides follow a 1-2-1-2 occupancy pattern.";
  if (base.topology === "ALT12_METRIC") return "Twelve persons are equally spaced around a square table of perimeter 60 m. One sits at each corner and two sit on each side; adjacent seats are 5 m apart and everyone faces the centre.";
  return introFromBase(base);
}

export function generateSea002Cp008EnglishReviewCandidateV3(
  permanentQlId: Sea002Cp008PermanentQlId,
  variantIndex: number,
): Sea002Cp008ReviewCandidateV3 {
  const hidden = generateSea002Cp008EnglishReviewCandidate(permanentQlId, variantIndex);
  const compiled = compileSea002Cp008ProductionLearnerGraphV3({
    topology: hidden.topology,
    facingMode: hidden.facingMode,
    difficulty: hidden.difficulty,
    participants: hidden.participants,
    seed: hidden.seed,
  });
  const clueText = shuffledClueText(compiled.clues, hidden.seed);
  const stem = `${topologyIntroduction(hidden)} ${clueText}`;
  const question = renderQuestion(compiled.query, hashInt(`${hidden.seed}:v3-question-style`) % 6);
  const participantIds = hidden.participants.map((participant) => participant.id);
  const options = buildOptions(compiled.query.answer, participantIds, hidden.seed);
  const correctOptionIndex = options.indexOf(compiled.query.answer);
  const finalExplanation = explanation(hidden, compiled.query, compiled.proof);
  const fingerprint = createHash("sha256")
    .update(JSON.stringify({
      version: "CP008_EXAM_REAL_PRODUCTION_GRAPH_V3",
      permanentQlId,
      seed: hidden.seed,
      topology: hidden.topology,
      facingMode: hidden.facingMode,
      difficulty: hidden.difficulty,
      clues: compiled.clues,
      query: compiled.query,
      stem,
      question,
      options,
      explanation: finalExplanation,
      proof: compiled.proof,
    }))
    .digest("hex");

  return Object.freeze({
    ...hidden,
    clues: compiled.clues as readonly Sea002Cp008NormalizedClue[],
    query: compiled.query as Sea002Cp008NormalizedQuery,
    stem,
    question,
    options,
    correctOptionIndex,
    answer: compiled.query.answer,
    explanation: finalExplanation,
    fingerprint,
    productionGraphProof: compiled.proof,
  });
}

export const SEA002_CP008_ENGLISH_REVIEW_SET_V3: readonly Sea002Cp008ReviewCandidateV3[] = Object.freeze(
  SEA002_CP008_PERMANENT_QL_IDS.flatMap((permanentQlId) =>
    Array.from({ length: 6 }, (_, variantIndex) => generateSea002Cp008EnglishReviewCandidateV3(permanentQlId, variantIndex)),
  ),
);

export const SEA002_CP008_PRODUCTION_EDITORIAL_V3 = Object.freeze({
  renderer: "EXAM_REAL_SQUARE_PRODUCTION_GRAPH_V3" as const,
  canonicalSurfaceCount: SEA002_CP008_ENGLISH_REVIEW_SET_V3.length,
  discoveryConstraintSpineUsed: false as const,
  learnerGraphIndependentlySolvable: true as const,
  difficultyPolicy: "STRUCTURAL_DEDUCTION_DEPTH_NOT_LABEL_ONLY" as const,
  humanApprovalStatus: "PENDING" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  publiclyPublishable: false as const,
});
