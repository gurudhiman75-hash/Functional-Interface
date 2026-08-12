import { TSD_CP004_AUTHORITIES } from "./authority";
import { generateCp004EditorialV2EnglishQuestion } from "./runtime-v2";
import { buildCp004FaithfulVisualV3 } from "./visual-v3";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004Question } from "./types";

export function generateCp004EditorialV3EnglishQuestion(authorityId: TsdCp004AuthorityId, seed: string): TsdCp004Question {
  const base = generateCp004EditorialV2EnglishQuestion(authorityId, seed);
  return Object.freeze({ ...base, visual: buildCp004FaithfulVisualV3(base.state, "en") });
}

export function generateCp004EditorialV3StressCorpus(seedsPerAuthority = 50): readonly TsdCp004Question[] {
  const rows: TsdCp004Question[] = [];
  for (const authority of TSD_CP004_AUTHORITIES) for (let i = 0; i < seedsPerAuthority; i += 1) rows.push(generateCp004EditorialV3EnglishQuestion(authority.authorityId, `cp004-v3-${authority.authorityId.toLowerCase()}-${String(i + 1).padStart(3, "0")}`));
  return Object.freeze(rows);
}

function findReviewRow(authorityId: TsdCp004AuthorityId, variant: number, usedMath: Set<string>, usedActors: Set<string>): TsdCp004Question {
  let fallback: TsdCp004Question | null = null;
  for (let i = variant; i < 3000; i += 3) {
    const q = generateCp004EditorialV3EnglishQuestion(authorityId, `cp004-v3-review-${authorityId.toLowerCase()}-${i}`);
    if (q.state.variant !== variant || usedMath.has(q.solution.mathematicalFingerprint)) continue;
    if (!fallback) fallback = q;
    if (!usedActors.has(q.state.actorKind)) return q;
  }
  if (fallback) return fallback;
  throw new Error(`Unable to find CP004 V3 review row for ${authorityId} variant ${variant}`);
}

export function generateCp004EditorialV3EnglishReviewCorpus(): readonly TsdCp004Question[] {
  const rows: TsdCp004Question[] = [];
  for (const authority of TSD_CP004_AUTHORITIES) {
    const usedMath = new Set<string>();
    const usedActors = new Set<string>();
    for (let variant = 0; variant < 3; variant += 1) {
      const q = findReviewRow(authority.authorityId, variant, usedMath, usedActors);
      usedMath.add(q.solution.mathematicalFingerprint);
      usedActors.add(q.state.actorKind);
      rows.push(q);
    }
  }
  return Object.freeze(rows);
}
