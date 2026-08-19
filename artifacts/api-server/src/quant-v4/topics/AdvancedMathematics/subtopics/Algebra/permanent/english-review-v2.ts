import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentEnglishCandidate,
  type AlgPermanentEnglishCandidateItem,
} from "./english-adapter";

export const ALG_ENGLISH_REVIEW_V2_ID = "ALG-EN-review-v2" as const;
export const ALG_ENGLISH_REVIEW_V2_REOPENED_FROM = "ALG-EN-v1-frozen" as const;

export const ALG_ENGLISH_REVIEW_V2_REMEDIATION = Object.freeze({
  reason: "POST_FREEZE_ALL_VARIANT_ARTIFACT_AUDIT" as const,
  historicalFreezeStillTraceable: true as const,
  historicalFreezeCurrentAuthority: false as const,
  semanticQlFreezeReopened: false as const,
  solverAuthorityReopened: false as const,
  learnerEnglishFreezeReopened: true as const,
  blockingFindings: [
    "ALG-QL-040 data-sufficiency stems omitted Statement I and Statement II from the learner question",
    "unit-coefficient rendering could surface forms such as -1x outside the original 1..12 audit seed window",
    "exact rational integers could render as n/1 in learner-facing surd/Vieta work",
    "negative-root factor text could render x - -a instead of x + a",
    "several explanations contained duplicated or mechanically unsimplified result clauses",
  ] as const,
  downstreamLocked: true as const,
});

export interface AlgPermanentEnglishReviewV2Item extends Omit<
  AlgPermanentEnglishCandidateItem,
  "question" | "explanation" | "maturity" | "englishImplementationFrozen"
> {
  readonly reviewCandidateId: typeof ALG_ENGLISH_REVIEW_V2_ID;
  readonly reopenedFromFreezeId: typeof ALG_ENGLISH_REVIEW_V2_REOPENED_FROM;
  readonly question: string;
  readonly explanation: string;
  readonly maturity: "ENGLISH_REVIEW_CANDIDATE_V2";
  readonly reviewStatus: "POST_FREEZE_REMEDIATION_REVIEW";
  readonly englishImplementationFrozen: false;
}

function cleanPresentation(text: string): string {
  return text
    .replace(/-1x²/g, "-x²")
    .replace(/\b1x²/g, "x²")
    .replace(/-1x\b/g, "-x")
    .replace(/\b1x\b/g, "x")
    .replace(/\+\s*-/g, "- ")
    .replace(/\s-\s-([0-9])/g, " + $1")
    .replace(/\(x - -([0-9]+(?:\/[0-9]+)?)\)/g, "(x + $1)")
    .replace(/(-?[0-9]+)\/1\b/g, "$1")
    .replace(/-1\(/g, "-(")
    .replace(/(?<![0-9])1\(/g, "(")
    .replace(/Hence k = ([^.,;]+), giving k = \1\./g, "Hence k = $1.")
    .replace(/Therefore k = ([^.,;]+), giving k = \1\./g, "Therefore k = $1.")
    .replace(/≥ ([+-]?[0-9]+\/[0-9]+) = \1\./g, "≥ $1.")
    .replace(/≤ ([+-]?[0-9]+\/[0-9]+) = \1\./g, "≤ $1.")
    .replace(/Therefore statement i alone/g, "Therefore Statement I alone")
    .replace(/Therefore statement ii alone/g, "Therefore Statement II alone");
}

function rebuildDataSufficiencyQuestion(source: AlgPermanentEnglishCandidateItem): string {
  if (!source.prototypeId.startsWith("ALG-CP014-CAND-00")) return source.question;
  const candidateNumber = Number(source.prototypeId.slice(-1));
  if (candidateNumber < 4 || candidateNumber > 8) return source.question;
  const statements = (source.rawDiscoveryItem as unknown as { readonly statements?: readonly string[] }).statements;
  if (!statements || statements.length !== 2) {
    throw new Error(`${source.qlId}/${source.prototypeId}: data-sufficiency learner statements are missing`);
  }
  return `${source.question}\n${statements[0]}\n${statements[1]}`;
}

function cleanSpecialExplanation(source: AlgPermanentEnglishCandidateItem, explanation: string): string {
  let value = explanation;

  if (source.prototypeId === "ALG-CP013-CAND-003") {
    value = value.replace(
      /So (.+?) = 0, hence x = ([^ .]+) and x = \2\. Therefore x = \2\./,
      "So $1 = 0, hence x = $2.",
    );
  }

  if (source.prototypeId === "ALG-CP003-CAND-006") {
    value = value.replace(
      /From a \+ 1\/b = ([^,]+), we get b = ([^.]+)\. Substitute this into b \+ 1\/c = ([^.]+)\. Since \([^)]*\)² = [^,]+, simplification gives c = ([^.]+)\. Therefore c \+ 1\/a = ([^.]+)\./,
      "From a + 1/b = $1, isolate 1/b to obtain b = $2. Substitute this value of b into b + 1/c = $3 and isolate 1/c; this gives c = $4. Therefore c + 1/a = $5.",
    );
  }

  return cleanPresentation(value);
}

export function generateAlgPermanentEnglishReviewV2(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishReviewV2Item {
  const source = generateAlgPermanentEnglishCandidate(qlId, seed, requestedVariantIndex);
  const question = cleanPresentation(rebuildDataSufficiencyQuestion(source));
  const explanation = cleanSpecialExplanation(source, source.explanation);

  return {
    ...source,
    reviewCandidateId: ALG_ENGLISH_REVIEW_V2_ID,
    reopenedFromFreezeId: ALG_ENGLISH_REVIEW_V2_REOPENED_FROM,
    question,
    explanation,
    maturity: "ENGLISH_REVIEW_CANDIDATE_V2",
    reviewStatus: "POST_FREEZE_REMEDIATION_REVIEW",
    englishImplementationFrozen: false,
  };
}
