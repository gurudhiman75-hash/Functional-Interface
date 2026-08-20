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
  editorialRevision: "STEPWISE_FORMULA_EXPLANATIONS_R2" as const,
  blockingFindings: [
    "ALG-QL-040 data-sufficiency stems omitted Statement I and Statement II from the learner question",
    "unit-coefficient rendering could surface forms such as -1x outside the original 1..12 audit seed window",
    "exact rational integers could render as n/1 in learner-facing surd/Vieta work",
    "negative-root factor text could render x - -a instead of x + a",
    "several explanations contained duplicated or mechanically unsimplified result clauses",
    "formula-based solutions were too compressed and did not always state why the formula applies",
    "temporary substitutions sometimes used unfamiliar u/v or S/P notation instead of familiar a/b/c-style notation",
    "many stems opened with unnecessary If/Given wrappers",
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

function removeUnnecessaryStemOpening(question: string): string {
  let value = question.trim();

  value = value.replace(/^If (.+), find (.+)\.$/s, "$1. Find $2.");
  value = value.replace(/^If (.+), form (.+)\.$/s, "$1. Form $2.");
  value = value.replace(/^If (.+), which (.+)\?$/s, "$1. Which $2?");
  value = value.replace(/^Given x = ([^,]+), compare /, "x = $1. Compare ");
  value = value.replace(/^Given the system (.+), find (.+)\.$/s, "$1. Find $2.");
  value = value.replace(/^For x = ([^,]+), the expression /, "At x = $1, the expression ");

  return value;
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

function formulaReason(source: AlgPermanentEnglishCandidateItem): string | null {
  const id = source.prototypeId;

  if (id.startsWith("ALG-CP002-")) {
    return "The required expression is directly connected to the given expression by a standard algebraic identity, so using that identity avoids solving for the variables separately.";
  }
  if (["ALG-CP003-CAND-001", "ALG-CP003-CAND-002", "ALG-CP003-CAND-003", "ALG-CP003-CAND-004", "ALG-CP003-CAND-005"].includes(id)) {
    return "The given information and the required expression are symmetric in a, b and c, so the standard three-variable identity connects them directly.";
  }
  if (["ALG-CP004-CAND-002", "ALG-CP004-CAND-003"].includes(id)) {
    return "The expression matches a standard identity exactly, so recognizing the identity gives the factorisation without trial-and-error.";
  }
  if (id.startsWith("ALG-CP005-")) {
    return "For a divisor x - r, the Remainder Theorem says the remainder is P(r); if x - r is a factor, the Factor Theorem requires P(r) = 0.";
  }
  if (id.startsWith("ALG-CP008-") && id !== "ALG-CP008-CAND-001") {
    return "A rational equation can be simplified or cross-multiplied only after excluding values that make an original denominator zero.";
  }
  if (id.startsWith("ALG-CP009-")) {
    return "For ax² + bx + c = 0, factorisation is used when the factors are visible; otherwise the discriminant D = b² - 4ac and the quadratic formula give the exact root information.";
  }
  if (id.startsWith("ALG-CP010-")) {
    return "The question asks about a symmetric function or transformation of the roots, so Vieta's relations use the coefficients directly and avoid solving the original roots unnecessarily.";
  }
  if (["ALG-CP012-CAND-004", "ALG-CP012-CAND-005", "ALG-CP012-CAND-006", "ALG-CP012-CAND-010"].includes(id)) {
    return "A quadratic changes sign only at its real roots. After finding the roots, the sign follows from whether the parabola opens upward or downward.";
  }
  if (["ALG-CP012-CAND-007", "ALG-CP012-CAND-008"].includes(id)) {
    return "A quadratic reaches its minimum or maximum at the vertex. For ax² + bx + c, the vertex occurs at x = -b/(2a).";
  }
  if (id === "ALG-CP012-CAND-009") {
    return "For a quadratic to keep one sign for every real x, its opening direction must be correct and it must not cross the x-axis; that is why the discriminant condition is used.";
  }
  if (["ALG-CP012-CAND-011", "ALG-CP012-CAND-012"].includes(id)) {
    return "The variables are positive and their sum is fixed. Cauchy's inequality gives a sharp bound, and its equality condition shows whether that bound is actually attainable.";
  }
  if (id.startsWith("ALG-CP013-")) {
    return "Absolute value represents distance from zero, so an equation or inequality in |A| is solved by applying the corresponding distance rule to A.";
  }
  if (id === "ALG-CP007-CAND-008") {
    return "A 3×3 linear system is solved by eliminating one variable to reduce it to a 2×2 system, then back-substituting into an original equation.";
  }
  return null;
}

function questionContext(question: string): { given?: string; required?: string } {
  const normalized = question.replace(/\n/g, " ").trim();
  const findMatch = normalized.match(/^(.*?)\.\s+Find (.+)\.$/s);
  if (findMatch) return { given: findMatch[1], required: findMatch[2] };
  const formMatch = normalized.match(/^(.*?)\.\s+Form (.+)\.$/s);
  if (formMatch) return { given: formMatch[1], required: formMatch[2] };
  return {};
}

function splitIntoSteps(text: string): string[] {
  const normalized = text
    .replace(/;\s+/g, ". ")
    .replace(/\.\s+(?=(?:Therefore|Hence|Thus|So|Since|For |From |Using |Substitute|Now |After |Because |The |This |Then |By |First |Next |Finally |Original |Reciprocal |Their |Solving |Eliminate |Check |Equality |A |An |Every |Each |Taken |Statement ))/g, ".\n");
  return normalized.split(/\n+/).map((part) => part.trim()).filter(Boolean);
}

function expandKnownFormulaWorking(source: AlgPermanentEnglishCandidateItem, explanation: string): string {
  let value = explanation;

  if (source.prototypeId === "ALG-CP002-CAND-001") {
    value = value.replace(
      /Use \(a \+ b\)² = a² \+ b² \+ 2ab\. Therefore a² \+ b² = (.+) = (.+)\./,
      "Use (a + b)² = a² + b² + 2ab.\nRearrange it for the required expression: a² + b² = (a + b)² - 2ab.\nSubstitute the given values: a² + b² = $1.\nNow evaluate the square and the product, then subtract: a² + b² = $2.",
    );
  }

  if (source.prototypeId === "ALG-CP002-CAND-008") {
    value = value.replace(
      /Use a² - b² = \(a \+ b\)\(a - b\)\. So the value is (.+) = (.+)\./,
      "Use the identity a² - b² = (a + b)(a - b).\nIt is used because both factors on the right are given directly.\nSubstitute the values: a² - b² = $1.\nMultiply the two factors: a² - b² = $2.",
    );
  }

  if (source.prototypeId === "ALG-CP002-CAND-002") {
    value = value.replace(
      /Use a³ \+ b³ = \(a \+ b\)³ - 3ab\(a \+ b\)\. So a³ \+ b³ = (.+) = (.+)\./,
      "Use a³ + b³ = (a + b)³ - 3ab(a + b).\nThis identity is suitable because a + b and ab are exactly the two quantities given.\nSubstitute them: a³ + b³ = $1.\nEvaluate the cube and the product, then combine the terms: a³ + b³ = $2.",
    );
  }

  if (source.prototypeId === "ALG-CP002-CAND-003") {
    value = value.replace(
      /Square the given relation: (.+)\. Hence (.+) = (.+) = (.+)\./,
      "Square the given relation because squaring creates the required x² + 1/x² term.\n$1.\nRearrange to isolate the required expression: $2 = $3.\nEvaluate it: $2 = $4.",
    );
  }

  if (source.prototypeId === "ALG-CP002-CAND-006") {
    value = value.replace(
      /Square the given relation: (.+)\. Therefore (.+) = (.+) = (.+)\./,
      "Square the given relation because squaring creates the required x² + 1/x² term.\n$1.\nRearrange to isolate the required expression: $2 = $3.\nEvaluate it: $2 = $4.",
    );
  }

  if (source.prototypeId === "ALG-CP002-CAND-009") {
    value = value
      .replace(/Let u = (.+?) and v = (.+?)\. Then u \+ v = (.+?) and uv = (.+?)\./, "Let a = $1 and b = $2. Then a + b = $3 and ab = $4.")
      .replace(/Use u² \+ v² = \(u \+ v\)² - 2uv\./, "Use a² + b² = (a + b)² - 2ab because the required expression is exactly a² + b² after this substitution.")
      .replace(/Therefore the required value is (.+) = (.+)\./, "Substitute the known values: a² + b² = $1.\nEvaluate the square and product, then subtract: a² + b² = $2.");
  }

  if (source.prototypeId === "ALG-CP010-CAND-005") {
    value = value.replace(/Let S = α \+ β = (.+?) and P = αβ = (.+?)\. Use α³ \+ β³ = S³ - 3PS\./, "From Vieta, α + β = $1 and αβ = $2.\nUse α³ + β³ = (α + β)³ - 3αβ(α + β) because the required expression is a symmetric function of the two roots.");
  }

  if (source.prototypeId === "ALG-CP010-CAND-006") {
    value = value.replace(/A monic quadratic with root sum S and product P is x² - Sx \+ P = 0\. Substituting S = (.+?) and P = (.+?) gives (.+)\./, "For roots α and β, (x - α)(x - β) = x² - (α + β)x + αβ.\nSo a monic quadratic with root sum $1 and product $2 is x² - ($1)x + ($2) = 0.\nAfter simplifying signs, the required equation is $3.");
  }

  if (source.prototypeId === "ALG-CP010-CAND-007") {
    value = value.replace(/Original Vieta values are S = (.+?) and P = (.+?)\. After shifting each root by (.+?), the new sum is S' = S \+ 2t = (.+?) and the new product is P' = P \+ tS \+ t² = (.+?)\. Therefore x² - S'x \+ P' = 0 gives (.+)\./,
      "From Vieta, α + β = $1 and αβ = $2.\nThe new roots are α + $3 and β + $3.\nTheir sum = (α + β) + 2($3) = $4.\nTheir product = αβ + $3(α + β) + ($3)² = $5.\nA monic quadratic with this sum and product is $6.");
  }

  if (source.prototypeId === "ALG-CP010-CAND-008") {
    value = value.replace(/Original Vieta values are S = (.+?) and P = (.+?)\. For reciprocal roots, S' = S\/P = (.+?) and P' = 1\/P = (.+?)\. Hence x² - S'x \+ P' = 0 gives (.+)\./,
      "From Vieta, α + β = $1 and αβ = $2.\nFor reciprocal roots, 1/α + 1/β = (α + β)/(αβ) = $3.\nTheir product is 1/(αβ) = $4.\nA monic quadratic with this root sum and product is $5.");
  }

  if (source.prototypeId === "ALG-CP010-CAND-011") {
    value = value.replace(/Original Vieta values are S = (.+?) and P = (.+?)\. Reciprocal roots have sum (.+?) and product (.+?)\. After shifting both by (.+?), the final sum is (.+?) and product is (.+?)\. Therefore the monic equation is (.+)\./,
      "From Vieta, α + β = $1 and αβ = $2.\nFirst take reciprocals: 1/α + 1/β = (α + β)/(αβ) = $3 and (1/α)(1/β) = 1/(αβ) = $4.\nNow shift each reciprocal root by $5.\nThe final root sum is $6 and the final root product is $7.\nTherefore the monic equation is $8.");
  }

  return value;
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
      "Start with a + 1/b = $1.\nIsolate 1/b: 1/b = $1 - a, so b = $2.\nSubstitute this b in b + 1/c = $3.\nIsolate 1/c and simplify to obtain c = $4.\nNow substitute in the required expression: c + 1/a = $5.",
    );
  }

  value = expandKnownFormulaWorking(source, value);
  return cleanPresentation(value);
}

function buildStepwiseExplanation(source: AlgPermanentEnglishCandidateItem, question: string): string {
  const cleaned = cleanSpecialExplanation(source, source.explanation);
  const reason = formulaReason(source);
  const context = questionContext(question);
  const lines: string[] = [];

  if (context.given && reason) lines.push(`Given: ${context.given}.`);
  if (context.required && reason) lines.push(`Required: ${context.required}.`);
  if (reason) lines.push(`Why this method: ${reason}`);

  for (const step of splitIntoSteps(cleaned)) {
    if (!lines.includes(step)) lines.push(step);
  }

  return lines.join("\n");
}

export function generateAlgPermanentEnglishReviewV2(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishReviewV2Item {
  const source = generateAlgPermanentEnglishCandidate(qlId, seed, requestedVariantIndex);
  const question = cleanPresentation(removeUnnecessaryStemOpening(rebuildDataSufficiencyQuestion(source)));
  const explanation = buildStepwiseExplanation(source, question);

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
