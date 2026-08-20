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

function cleanV3Text(text: string): string {
  return text
    .replace(/\((-?[0-9]+)\)\/\(1\)/g, "$1")
    .replace(/-\(([0-9]+)\)\/\(1\)/g, "-$1")
    .replace(/\(([0-9]+)\)\/\(-1\)/g, "-$1");
}

function cleanV3Stem(question: string): string {
  let value = cleanV3Text(question.trim());
  value = value.replace(/^When (P\(x\) = .+?) is divided by /s, "$1 is divided by ");
  value = value.replace(/^For (P\(x\) = .+?), ([A-Za-z0-9x])/s, "$1; $2");
  value = value.replace(/^For the algebraic fraction (.+?), which value of x is not allowed\?$/s, "In the algebraic fraction $1, which value of x is not allowed?");
  return value;
}

function removeRootSumProductAliases(prototypeId: string, explanation: string): string {
  let value = explanation;

  if (prototypeId === "ALG-CP010-CAND-010") {
    value = value.replace(
      /Let S = ([^\s]+) and P = ([^\s.]+)\.\s+The new roots are P \+ S = ([^\s]+) and P - S = ([^\s.]+)\.\s+Their sum is ([^\s]+) and product is ([^\s,]+), so the required monic equation is ([^.]+)\./,
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

function specificMethodReason(prototypeId: string): string | null {
  switch (prototypeId) {
    case "ALG-CP002-CAND-001":
      return "The given values are a + b and ab, while the target is a² + b². The identity (a + b)² = a² + b² + 2ab contains exactly these three quantities.";
    case "ALG-CP002-CAND-008":
      return "Both a + b and a - b are given, and a² - b² factors directly as (a + b)(a - b).";
    case "ALG-CP002-CAND-002":
      return "The target a³ + b³ can be written using only a + b and ab, which are the two quantities supplied in the question.";
    case "ALG-CP002-CAND-003":
    case "ALG-CP002-CAND-006":
      return "Squaring the given reciprocal relation produces x² + 1/x² immediately, so there is no need to solve for x first.";
    case "ALG-CP002-CAND-004":
    case "ALG-CP002-CAND-007":
      return "The standard cube identity converts the given x ± 1/x value directly into x³ ± 1/x³.";
    case "ALG-CP002-CAND-005":
      return "For higher reciprocal powers, the recurrence uses the known value of x + 1/x repeatedly and avoids expanding or solving for x.";
    case "ALG-CP002-CAND-009":
      return "After naming 5x and 2/x as a and b, the target becomes a² + b² and the given relation becomes a + b, so the familiar square-sum identity applies directly.";
    case "ALG-CP003-CAND-001":
    case "ALG-CP003-CAND-002":
    case "ALG-CP003-CAND-004":
      return "Squaring a + b + c connects the square-sum and pairwise-product terms that appear in the given information and the target.";
    case "ALG-CP003-CAND-003":
      return "When a + b + c = 0, the cubic identity collapses to a³ + b³ + c³ = 3abc, so the target follows directly from abc.";
    case "ALG-CP003-CAND-005":
      return "Expanding the three squared differences reduces the target to the known square-sum and pairwise-product sum.";
    case "ALG-CP004-CAND-002":
      return "The expression is a difference of two perfect squares, so A² - B² = (A - B)(A + B) applies exactly.";
    case "ALG-CP004-CAND-003":
      return "The first and last terms are perfect squares and the middle term is twice their product, which is the signature of a perfect-square trinomial.";
    case "ALG-CP005-CAND-001":
    case "ALG-CP005-CAND-002":
    case "ALG-CP005-CAND-005":
      return "The divisor is linear, so the Remainder Theorem replaces polynomial division with one direct substitution into P(x).";
    case "ALG-CP005-CAND-003":
    case "ALG-CP005-CAND-006":
      return "A stated linear factor must make the polynomial zero, so the Factor Theorem turns the factor condition into P(r) = 0.";
    case "ALG-CP005-CAND-004":
    case "ALG-CP005-CAND-007":
    case "ALG-CP005-CAND-008":
      return "Each factor or remainder statement becomes a direct polynomial-value equation, giving the exact linear condition needed for the unknown parameter(s).";
    case "ALG-CP009-CAND-001":
      return "The quadratic factors into two linear factors, so the zero-product rule gives the roots most directly.";
    case "ALG-CP009-CAND-002":
      return "The quadratic is a perfect square, so its single repeated linear factor gives the repeated root immediately.";
    case "ALG-CP009-CAND-003":
      return "The quadratic does not factor into convenient integer factors, so the discriminant and quadratic formula give the exact surd roots.";
    case "ALG-CP009-CAND-004":
      return "Only the number of real roots is required, and the sign of D = b² - 4ac determines that without solving the equation.";
    case "ALG-CP009-CAND-005":
      return "Equal roots occur exactly when the discriminant is zero, so setting D = 0 gives the required parameter.";
    case "ALG-CP009-CAND-006":
      return "A number is a root only when substituting it makes the quadratic equal to zero, so direct substitution gives the coefficient condition.";
    case "ALG-CP010-CAND-001":
      return "The sum of quadratic roots is a direct Vieta invariant, α + β = -b/a, so the individual roots are unnecessary.";
    case "ALG-CP010-CAND-002":
      return "The product of quadratic roots is a direct Vieta invariant, αβ = c/a, so the coefficients already contain the answer.";
    case "ALG-CP010-CAND-009":
      return "Vieta gives the sum of both roots; subtracting the known root from that sum gives the missing root directly.";
    case "ALG-CP010-CAND-003":
      return "The target α² + β² depends only on α + β and αβ, both obtained directly from Vieta.";
    case "ALG-CP010-CAND-004":
      return "The reciprocal sum equals (α + β)/(αβ), so Vieta supplies both numerator and denominator without solving the roots.";
    case "ALG-CP010-CAND-005":
      return "The cube-sum identity uses only α + β and αβ, so Vieta plus the identity is shorter and cleaner than solving α and β.";
    case "ALG-CP010-CAND-006":
      return "A monic quadratic is determined by its root sum and root product: x² - (sum)x + product = 0.";
    case "ALG-CP010-CAND-007":
      return "For roots shifted by the same amount, first update their sum and product, then rebuild the monic quadratic from those two values.";
    case "ALG-CP010-CAND-008":
      return "For reciprocal roots, their sum and product can be written directly from the original α + β and αβ values supplied by Vieta.";
    case "ALG-CP010-CAND-010":
      return "Each transformed root is built only from α + β and αβ, so Vieta gives everything needed before forming the new quadratic.";
    case "ALG-CP010-CAND-011":
      return "This transformation is done in two controlled stages—take reciprocals, then shift—updating root sum and product after each stage.";
    case "ALG-CP010-CAND-012":
      return "For a cubic, the asked pairwise-product sum is exactly the Vieta invariant C/A, so individual cubic roots should not be solved.";
    case "ALG-CP012-CAND-004":
    case "ALG-CP012-CAND-005":
    case "ALG-CP012-CAND-006":
    case "ALG-CP012-CAND-010":
      return "A quadratic can change sign only at a real root. Find the roots first, then use the opening direction to choose the required interval.";
    case "ALG-CP012-CAND-007":
    case "ALG-CP012-CAND-008":
      return "The required extremum occurs at the vertex of the parabola, and x = -b/(2a) gives the vertex x-coordinate directly.";
    case "ALG-CP012-CAND-009":
      return "To remain non-negative for every real x, the upward-opening quadratic must never cross below the x-axis; this requires D ≤ 0.";
    case "ALG-CP012-CAND-011":
      return "With positive variables and a fixed sum, Cauchy gives a lower bound for the reciprocal sum and its equality condition checks attainability.";
    case "ALG-CP012-CAND-012":
      return "With a fixed sum, Cauchy relates (x + y + z)² to x² + y² + z² and gives the sharp minimum when the variables are equal.";
    case "ALG-CP007-CAND-008":
      return "Eliminate one variable from pairs of equations to reduce the 3×3 system to two equations in two unknowns, then back-substitute.";
    default:
      if (prototypeId.startsWith("ALG-CP008-") && prototypeId !== "ALG-CP008-CAND-001") {
        return "First protect the original domain, then clear the nonzero denominators so the remaining algebra can be solved safely.";
      }
      if (prototypeId.startsWith("ALG-CP013-")) {
        return "Absolute value is distance from zero, so the equation or inequality is converted into the corresponding distance branches or interval.";
      }
      return null;
  }
}

function applySpecificReason(prototypeId: string, steps: readonly string[]): string[] {
  const reason = specificMethodReason(prototypeId);
  if (!reason) return [...steps];
  let replaced = false;
  return steps.map((step) => {
    if (!replaced && step.startsWith("Why this method:")) {
      replaced = true;
      return `Why this method: ${reason}`;
    }
    return step;
  });
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
  const reasoned = applySpecificReason(item.prototypeId, visible);
  const clarified = clarifyCalculationSteps(item.prototypeId, reasoned);
  return cleanV3Text(clarified.join("\n"));
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
    question: cleanV3Stem(v2.question),
    explanation: buildV3Explanation(v2),
    maturity: "ENGLISH_REVIEW_CANDIDATE_V3",
    reviewStatus: "STEPWISE_HUMAN_EDITORIAL_REVIEW",
  };
}
