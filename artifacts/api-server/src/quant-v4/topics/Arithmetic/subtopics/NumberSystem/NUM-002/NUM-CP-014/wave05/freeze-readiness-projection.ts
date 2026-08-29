import { generateNumCp014Wave01 } from "../wave01/runtime-v2.ts";
import { generateNumCp014Wave02 } from "../wave02/runtime.ts";
import { generateNumCp014Wave03V2 } from "../wave03/runtime-v2.ts";
import { NUM_CP014_AUTHORITY_PROPOSAL, type NumCp014AuthorityId } from "../wave04/merge-split-proposal.ts";

export interface NumCp014AuthorityCandidateProjection {
  readonly authorityId: NumCp014AuthorityId;
  readonly authoritySeed: number;
  readonly sourceIndex: number;
  readonly sourceSeed: number;
  readonly sourcePrototypeId: string;
  readonly answerSemantic: string;
  readonly sourcePackage: any;
}

function seedOf(raw: number) {
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : 1;
}

function normalizeAnswerSemantic(sourcePrototypeId: string, sourcePackage: any): string {
  if (sourcePackage?.answerSemantic) return String(sourcePackage.answerSemantic);
  switch (sourcePrototypeId) {
    case "NUM-CP014-PROT-001": return "DIGIT";
    case "NUM-CP014-PROT-002": return "HIDDEN_NUMBER";
    case "NUM-CP014-PROT-003": return "HIDDEN_NUMBER";
    case "NUM-CP014-PROT-004": return "HIDDEN_EXPONENT";
    case "NUM-CP014-PROT-005": return "HIDDEN_BASE";
    case "NUM-CP014-PROT-006": return "HIDDEN_NUMBER";
    default: throw new Error(`CP014 freeze-readiness cannot normalize answer semantic for ${sourcePrototypeId}.`);
  }
}

export function resolveNumCp014AuthorityCandidate(
  authorityId: NumCp014AuthorityId,
  rawAuthoritySeed: number,
): NumCp014AuthorityCandidateProjection {
  const authoritySeed = seedOf(rawAuthoritySeed);
  const authority = NUM_CP014_AUTHORITY_PROPOSAL.find((entry) => entry.authorityId === authorityId);
  if (!authority) throw new Error(`Unknown CP014 authority proposal: ${authorityId}`);

  const sourceCount = authority.sourcePrototypeIds.length;
  if (sourceCount < 1) throw new Error(`${authorityId} has no source prototypes.`);

  // IMPORTANT: source choice and source-internal modes use separate clocks.
  // This avoids the CP012/CP013 class of parity/modulo reachability defects.
  const sourceIndex = (authoritySeed - 1) % sourceCount;
  const sourceSeed = Math.floor((authoritySeed - 1) / sourceCount) + 1;
  const sourcePrototypeId = authority.sourcePrototypeIds[sourceIndex]!;

  let sourcePackage: any;
  const numericId = Number(sourcePrototypeId.split("-").at(-1));
  if (numericId >= 1 && numericId <= 6) {
    // Wave01 runtime-v2 is canonical because P003 perfect-square synthesis was rejected
    // and replaced by the genuine divisor-count + perfect-cube family.
    sourcePackage = generateNumCp014Wave01(sourcePrototypeId as any, sourceSeed);
  } else if (numericId >= 7 && numericId <= 12) {
    sourcePackage = generateNumCp014Wave02(sourcePrototypeId as any, sourceSeed);
  } else if (numericId >= 13 && numericId <= 20) {
    sourcePackage = generateNumCp014Wave03V2(sourcePrototypeId as any, sourceSeed);
  } else {
    throw new Error(`${authorityId} references unsupported source prototype ${sourcePrototypeId}.`);
  }

  if (String(sourcePackage.temporaryPrototypeId) !== sourcePrototypeId) {
    throw new Error(`${authorityId}/${authoritySeed}: source dispatch drifted from ${sourcePrototypeId}.`);
  }
  if (sourcePrototypeId === "NUM-CP014-PROT-003" && !String(sourcePackage.mathematicalFingerprint).startsWith("P003V2|")) {
    throw new Error(`${authorityId}/${authoritySeed}: obsolete Wave01 P003 runtime leaked into freeze-readiness projection.`);
  }

  const answerSemantic = normalizeAnswerSemantic(sourcePrototypeId, sourcePackage);

  return Object.freeze({
    authorityId,
    authoritySeed,
    sourceIndex,
    sourceSeed,
    sourcePrototypeId,
    answerSemantic,
    sourcePackage,
  });
}
