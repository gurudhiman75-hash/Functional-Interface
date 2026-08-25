import { createHash } from "node:crypto";

import {
  generateSea002Cp007ProductionCaselet as generateV1,
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
  type Sea002Cp007ProductionCaselet,
} from "./production-caselet-v1.ts";
import { relativeDelta } from "./solver.ts";

function hashInt(value: string): number {
  return Number.parseInt(createHash("sha256").update(value).digest("hex").slice(0, 8), 16) >>> 0;
}

function rotate<T>(values: readonly T[], offset: number): T[] {
  const shift = values.length === 0 ? 0 : ((offset % values.length) + values.length) % values.length;
  return [...values.slice(shift), ...values.slice(0, shift)];
}

function pairDirectlyClued(caselet: Sea002Cp007ProductionCaselet, left: string, right: string): boolean {
  return caselet.clues.some((clue) =>
    clue.kind === "SAME_ROW_OFFSET"
    && ((clue.subject === left && clue.reference === right)
      || (clue.subject === right && clue.reference === left)),
  );
}

function hardenAuth01(base: Sea002Cp007ProductionCaselet): Sea002Cp007ProductionCaselet {
  const facingAnchor = base.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!facingAnchor || facingAnchor.kind !== "FACING_ANCHOR") throw new Error("CP007 AUTH01 requires a facing anchor.");

  const candidates: Array<{
    reference: (typeof base.participants)[number];
    target: (typeof base.participants)[number];
    direction: "LEFT" | "RIGHT";
  }> = [];

  for (const reference of base.participants) {
    if (reference.id === facingAnchor.person) continue;
    for (const physicalDelta of [-1, 1] as const) {
      const targetPosition = reference.seat.position + physicalDelta;
      if (targetPosition < 0 || targetPosition >= base.width) continue;
      const target = base.participants.find((person) =>
        person.seat.row === reference.seat.row && person.seat.position === targetPosition,
      );
      if (!target) continue;
      if (pairDirectlyClued(base, reference.id, target.id)) continue;
      const direction = physicalDelta === relativeDelta(reference.facing, "RIGHT") ? "RIGHT" as const : "LEFT" as const;
      candidates.push({ reference, target, direction });
    }
  }

  if (candidates.length === 0) {
    throw new Error(`No non-direct AUTH01 query candidate for ${base.caseletId}.`);
  }

  const picked = candidates[hashInt(`${base.seed}:auth01-v2-query`) % candidates.length]!;
  const wrongPool = rotate(
    base.participants
      .map((participant) => participant.id)
      .filter((id) => id !== picked.target.id && id !== picked.reference.id),
    hashInt(`${base.seed}:auth01-v2-distractors`),
  );
  const wrong = [...new Set(wrongPool)].slice(0, 3);
  if (wrong.length !== 3) throw new Error(`AUTH01 V2 needs three distractors for ${base.caseletId}.`);
  const options = [...wrong];
  options.splice(base.correctIndex, 0, picked.target.id);

  return Object.freeze({
    ...base,
    question: `Who sits immediately to the ${picked.direction.toLowerCase()} of ${picked.reference.id}?`,
    options: Object.freeze(options),
    answer: picked.target.id,
    explanation: `${picked.reference.id}'s facing must first be established. Then the row-position clues and the cross-row alignment determine ${picked.reference.id}'s immediate ${picked.direction.toLowerCase()} neighbour as ${picked.target.id}.`,
  });
}

function directDiagonalClue(
  caselet: Sea002Cp007ProductionCaselet,
  reference: string,
  target: string,
  direction: "LEFT" | "RIGHT",
): boolean {
  return caselet.clues.some((clue) =>
    clue.kind === "DIAGONAL"
    && clue.reference === reference
    && clue.subject === target
    && clue.direction === direction,
  );
}

function hardenAuth04(base: Sea002Cp007ProductionCaselet): Sea002Cp007ProductionCaselet {
  const facingAnchor = base.clues.find((clue) => clue.kind === "FACING_ANCHOR");
  if (!facingAnchor || facingAnchor.kind !== "FACING_ANCHOR") throw new Error("CP007 AUTH04 requires a facing anchor.");

  const candidates: Array<{
    reference: (typeof base.participants)[number];
    target: (typeof base.participants)[number];
    direction: "LEFT" | "RIGHT";
  }> = [];

  for (const reference of base.participants) {
    if (reference.id === facingAnchor.person) continue;
    for (const direction of ["LEFT", "RIGHT"] as const) {
      const targetPosition = reference.seat.position + relativeDelta(reference.facing, direction);
      if (targetPosition < 0 || targetPosition >= base.width) continue;
      const otherRow = reference.seat.row === "TOP" ? "BOTTOM" as const : "TOP" as const;
      const target = base.participants.find((person) =>
        person.seat.row === otherRow && person.seat.position === targetPosition,
      );
      if (!target) continue;
      if (directDiagonalClue(base, reference.id, target.id, direction)) continue;
      candidates.push({ reference, target, direction });
    }
  }

  if (candidates.length === 0) {
    throw new Error(`No non-direct AUTH04 query candidate for ${base.caseletId}.`);
  }

  const picked = candidates[hashInt(`${base.seed}:auth04-v2-query`) % candidates.length]!;
  const wrongPool = rotate(
    base.participants
      .filter((participant) => participant.seat.row !== picked.reference.seat.row)
      .map((participant) => participant.id)
      .filter((id) => id !== picked.target.id),
    hashInt(`${base.seed}:auth04-v2-distractors`),
  );
  const wrong = [...new Set(wrongPool)].slice(0, 3);
  if (wrong.length !== 3) throw new Error(`AUTH04 V2 needs three distractors for ${base.caseletId}.`);
  const options = [...wrong];
  options.splice(base.correctIndex, 0, picked.target.id);

  return Object.freeze({
    ...base,
    question: `Who sits diagonally from ${picked.reference.id} in ${picked.reference.id}'s ${picked.direction.toLowerCase()}-hand direction?`,
    options: Object.freeze(options),
    answer: picked.target.id,
    explanation: `${picked.reference.id}'s facing and the two-row alignment must first be established. Then moving one position in ${picked.reference.id}'s ${picked.direction.toLowerCase()}-hand direction and switching rows identifies ${picked.target.id}.`,
  });
}

export function generateSea002Cp007ProductionCaselet(
  seed: string,
  width: number,
  authorityKey: Sea002Cp007CandidateAuthorityKey,
): Sea002Cp007ProductionCaselet {
  const base = generateV1(seed, width, authorityKey);
  if (authorityKey === "CP007-AUTH-01") return hardenAuth01(base);
  if (authorityKey === "CP007-AUTH-04") return hardenAuth04(base);
  return base;
}

export {
  independentlySolveSea002Cp007Caselet,
  type Sea002Cp007CandidateAuthorityKey,
  type Sea002Cp007ProductionCaselet,
};
