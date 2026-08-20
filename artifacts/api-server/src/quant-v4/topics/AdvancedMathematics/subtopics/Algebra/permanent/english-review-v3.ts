import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentEnglishReviewV2,
  type AlgPermanentEnglishReviewV2Item,
} from "./english-review-v2";

export const ALG_ENGLISH_REVIEW_V3_ID = "ALG-EN-review-v3" as const;

export const ALG_ENGLISH_REVIEW_V3_AUTHORITY = Object.freeze({
  basedOn: "ALG-EN-review-v2" as const,
  semanticQlFreezeReopened: false as const,
  solverAuthorityReopened: false as const,
  learnerEnglishFreezeReopened: true as const,
  editorialGoals: [
    "remove unnecessary stem openings",
    "prefer familiar a/b/c-style temporary notation",
    "state why each formula or theorem applies",
    "show formula substitution and calculation as separate visible steps",
    "avoid compressed solver-trace prose",
    "keep every learner explanation renderable as plain UTF-8 text",
  ] as const,
  downstreamLocked: true as const,
});

export interface AlgPermanentEnglishReviewV3Item extends Omit<
  AlgPermanentEnglishReviewV2Item,
  "reviewCandidateId" | "maturity" | "reviewStatus"
> {
  readonly reviewCandidateId: typeof ALG_ENGLISH_REVIEW_V3_ID;
  readonly maturity: "ENGLISH_REVIEW_CANDIDATE_V3";
  readonly reviewStatus: "STEPWISE_HUMAN_EDITORIAL_REVIEW";
}

function removeRootSumProductAliases(prototypeId: string, explanation: string): string {
  let value = explanation;

  if (prototypeId === "ALG-CP010-CAND-010") {
    value = value.replace(
      /Let S = ([^\s]+) and P = ([^\s.]+)\. The new roots are P \+ S = ([^\s]+) and P - S = ([^\s.]+)\. Their sum is ([^\s]+) and product is ([^\s,]+), so the required monic equation is ([^.]+)\./,
      "From Vieta, α + β = $1 and αβ = $2.\nThe required roots are αβ + α + β and αβ - α - β.\nFirst root = $2 + $1 = $3.\nSecond root = $2 - $1 = $4.\nTheir sum = $5 and their product = $6.\nTherefore the required monic equation is $7.",
    );
  }

  value = value
    .replace(/\bLet u\b/g, "Let a")
    .replace(/\b and v = /g, " and b = ")
    .replace(/\bu \+ v\b/g, "a + b")
    .replace(/\buv\b/g, "ab")
    .replace(/\bu² \+ v²\b/g, "a² + b²");

  return value;
}

function splitVisibleSteps(explanation: string): string[] {
  const firstPass = explanation
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);

  const steps: string[] = [];
  for (const line of firstPass) {
    if (line.startsWith("Given:") || line.startsWith("Required:") || line.startsWith("Why this method:")) {
      steps.push(line);
      continue;
    }
    const sentenceParts = line
      .replace(/;\s+/g, ". ")
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .map((part) => part.trim())
      .filter(Boolean);
    steps.push(...sentenceParts);
  }
  return steps;
}

function clarifyCalculationSteps(prototypeId: string, steps: readonly string[]): string[] {
  const result: string[] = [];
  for (const step of steps) {
    result.push(step);

    if (prototypeId === "ALG-CP010-CAND-001" && step.includes("α + β = -b/a")) {
      result.push("Read a and b directly from the quadratic before substituting them into -b/a.");
    }
    if (prototypeId === "ALG-CP010-CAND-002" && step.includes("αβ = c/a")) {
      result.push("Read a and c directly from the quadratic before substituting them into c/a.");
    }
    if (prototypeId === "ALG-CP010-CAND-012" && step.includes("Vieta gives")) {
      result.push("For the asked pairwise-product sum, use only αβ + βγ + γα = C/A; the other two Vieta relations are not needed for the calculation.");
    }
    if ((prototypeId === "ALG-CP012-CAND-011" || prototypeId === "ALG-CP012-CAND-012") && step.startsWith("Equality occurs")) {
      result.push("This equality case is essential: it proves the bound is reachable, so the bound is the actual minimum rather than only a lower estimate.");
    }
  }
  return result;
}

function buildV3Explanation(item: AlgPermanentEnglishReviewV2Item): string {
  const withoutAliases = removeRootSumProductAliases(item.prototypeId, item.explanation);
  const visible = splitVisibleSteps(withoutAliases);
  const clarified = clarifyCalculationSteps(item.prototypeId, visible);
  return clarified.join("\n");
}

export function generateAlgPermanentEnglishReviewV3(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishReviewV3Item {
  const v2 = generateAlgPermanentEnglishReviewV2(qlId, seed, requestedVariantIndex);
  return {
    ...v2,
    reviewCandidateId: ALG_ENGLISH_REVIEW_V3_ID,
    explanation: buildV3Explanation(v2),
    maturity: "ENGLISH_REVIEW_CANDIDATE_V3",
    reviewStatus: "STEPWISE_HUMAN_EDITORIAL_REVIEW",
  };
}
