import { TSD_CP004_AUTHORITIES } from "./authority";
import { polishCp004EditorialV2Options, renderCp004EnglishEditorialV2Stem } from "./editorial-v2";
import { generateCp004FinalEnglishQuestion } from "./runtime-final";
import { buildCp004FaithfulVisualV2 } from "./visual-v2";
import type { TsdCp004AuthorityId } from "./authority";
import type { TsdCp004Question } from "./types";
import { verifyCp004 } from "./verifier";

function validateV2(q: TsdCp004Question): void {
  if (!q.stem.endsWith("?")) throw new Error(`CP004 V2 stem is not a direct question: ${q.stem}`);
  if (q.options.length !== 4 || new Set(q.options).size !== 4) throw new Error(`CP004 V2 options are not four unique values: ${q.authorityId}/${q.seed}`);
  if (q.options[q.correctIndex] !== q.solution.answerText) throw new Error(`CP004 V2 correct option parity failed: ${q.authorityId}/${q.seed}`);
  const verification = verifyCp004(q.state, q.solution);
  if (!verification.valid) throw new Error(`CP004 V2 verifier failed: ${verification.errors.join("; ")}`);
  if (q.permanentQlId !== null || q.questionStudioDiscoverable || q.questionBankStatus !== "NOT_STORED" || q.testEligibility !== "INELIGIBLE" || q.publiclyPublishable) throw new Error("CP004 V2 lifecycle lock failed");
}

export function generateCp004EditorialV2EnglishQuestion(authorityId: TsdCp004AuthorityId, seed: string): TsdCp004Question {
  const base = generateCp004FinalEnglishQuestion(authorityId, seed);
  const optionAudit = polishCp004EditorialV2Options(base);
  const options = Object.freeze(optionAudit.map((x) => x.text));
  const q: TsdCp004Question = Object.freeze({
    ...base,
    stem: renderCp004EnglishEditorialV2Stem(base),
    visual: buildCp004FaithfulVisualV2(base.state, "en"),
    options,
    optionAudit,
  });
  validateV2(q);
  return q;
}

export function generateCp004EditorialV2StressCorpus(seedsPerAuthority = 50): readonly TsdCp004Question[] {
  const rows: TsdCp004Question[] = [];
  for (const authority of TSD_CP004_AUTHORITIES) for (let i = 0; i < seedsPerAuthority; i += 1) rows.push(generateCp004EditorialV2EnglishQuestion(authority.authorityId, `cp004-v2-${authority.authorityId.toLowerCase()}-${String(i + 1).padStart(3, "0")}`));
  return Object.freeze(rows);
}

function findReviewRow(authorityId: TsdCp004AuthorityId, variant: number, usedMath: Set<string>, usedActors: Set<string>): TsdCp004Question {
  let mathFallback: TsdCp004Question | null = null;
  for (let i = variant; i < 3000; i += 3) {
    const q = generateCp004EditorialV2EnglishQuestion(authorityId, `cp004-v2-review-${authorityId.toLowerCase()}-${i}`);
    if (q.state.variant !== variant || usedMath.has(q.solution.mathematicalFingerprint)) continue;
    if (!mathFallback) mathFallback = q;
    if (!usedActors.has(q.state.actorKind)) return q;
  }
  if (mathFallback) return mathFallback;
  throw new Error(`Unable to find distinct CP004 V2 review state for ${authorityId} variant ${variant}`);
}

export function generateCp004EditorialV2EnglishReviewCorpus(): readonly TsdCp004Question[] {
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
