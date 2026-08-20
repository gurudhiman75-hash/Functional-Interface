import type { AlgPermanentQlId } from "./allocation";
import {
  generateAlgPermanentEnglishReviewV3 as generateAlgPermanentEnglishReviewV3Raw,
  type AlgPermanentEnglishReviewV3Item,
} from "./english-review-v3";

function normalizeRenderedSigns(text: string): string {
  return text
    .replace(/\+\s+-([0-9]+)/g, "- $1")
    .replace(/-\s+-([0-9]+)/g, "+ $1")
    .replace(/\+\s+\(-([0-9]+)\)/g, "- $1")
    .replace(/-\s+\(-([0-9]+)\)/g, "+ $1")
    .replace(/=\s*(-?[0-9]+(?:\/[0-9]+)?)\s*=\s*\1\b/g, "= $1");
}

function coefficient(token: string | undefined): string {
  if (!token || token === "+") return "1";
  if (token === "-") return "-1";
  return token.startsWith("+") ? token.slice(1) : token;
}

function extractQuadraticExpression(question: string): string | null {
  const normalized = question.replace(/\s+/g, " ").trim();
  const patterns = [
    /roots of (.+?x².+?) = 0/i,
    /Solve (.+?x².+?) = 0/i,
    /does (.+?x².+?) = 0/i,
    /minimum value of (.+?x².+?) and the value/i,
    /maximum value of (.+?x².+?) and the value/i,
    /is (.+?x².+?) (?:≥|>|≤|<) 0 for every real x/i,
  ];
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
}

function extractQuadraticCoefficients(question: string): { a: string; b: string; c: string; expression: string } | null {
  const expression = extractQuadraticExpression(question);
  if (!expression) return null;
  const compact = expression.replace(/\s+/g, "");
  const match = compact.match(/^([+-]?\d*)x²(?:([+-]\d*)x)?([+-](?:\d+|k))?$/i);
  if (!match) return null;
  return {
    a: coefficient(match[1]),
    b: match[2] ? coefficient(match[2]) : "0",
    c: match[3] ? coefficient(match[3]) : "0",
    expression,
  };
}

function insertAfterWhy(explanation: string, line: string): string {
  const steps = explanation.split(/\n+/).map((step) => step.trim()).filter(Boolean);
  if (steps.some((step) => step === line)) return explanation;
  const whyIndex = steps.findIndex((step) => step.startsWith("Why this method:"));
  if (whyIndex < 0) return explanation;
  steps.splice(whyIndex + 1, 0, line);
  return steps.join("\n");
}

function needsQuadraticAbc(prototypeId: string): boolean {
  return [
    "ALG-CP009-CAND-003",
    "ALG-CP009-CAND-004",
    "ALG-CP009-CAND-005",
    "ALG-CP010-CAND-001",
    "ALG-CP010-CAND-002",
    "ALG-CP010-CAND-003",
    "ALG-CP010-CAND-004",
    "ALG-CP010-CAND-005",
    "ALG-CP010-CAND-006",
    "ALG-CP010-CAND-007",
    "ALG-CP010-CAND-008",
    "ALG-CP010-CAND-009",
    "ALG-CP010-CAND-010",
    "ALG-CP010-CAND-011",
    "ALG-CP012-CAND-007",
    "ALG-CP012-CAND-008",
    "ALG-CP012-CAND-009",
  ].includes(prototypeId);
}

function polishQuestion(prototypeId: string, question: string): string {
  let value = normalizeRenderedSigns(question);
  if (prototypeId === "ALG-CP005-CAND-004") {
    value = value.replace(
      /^(P\(x\) = .+?) is divided by (.+?), the remainder is (.+?)\. Find (.+)\.$/,
      "$1 leaves remainder $3 when divided by $2. Find $4.",
    );
  }
  return value;
}

function expandReciprocalCube(prototypeId: string, explanation: string): string {
  let value = explanation;
  if (prototypeId === "ALG-CP002-CAND-004") {
    value = value.replace(
      /Thus the value is (.+?) = (.+?)\.$/m,
      "Substitute the given value into the identity: x³ + 1/x³ = $1.\nEvaluate the cube and product separately, then combine them: x³ + 1/x³ = $2.",
    );
  }
  if (prototypeId === "ALG-CP002-CAND-007") {
    value = value.replace(
      /Since \(x - 1\/x\)³ = x³ - 1\/x³ - 3\(x - 1\/x\), we get x³ - 1\/x³ = (.+?) = (.+?)\.$/m,
      "Use (x - 1/x)³ = x³ - 1/x³ - 3(x - 1/x).\nRearrange for the required expression: x³ - 1/x³ = (x - 1/x)³ + 3(x - 1/x).\nSubstitute the given value: x³ - 1/x³ = $1.\nEvaluate the cube and product, then combine them: x³ - 1/x³ = $2.",
    );
  }
  return value;
}

function expandThreeVariableIdentity(prototypeId: string, explanation: string): string {
  let value = explanation;
  if (["ALG-CP003-CAND-001", "ALG-CP003-CAND-004"].includes(prototypeId)) {
    value = value.replace(
      /(?:So|Hence) 2\(ab \+ bc \+ ca\) = (.+?), (?:giving|so) ab \+ bc \+ ca = (.+?)\.$/m,
      "Substitute the known values into the identity and isolate the pairwise-product term: 2(ab + bc + ca) = $1.\nDivide both sides by 2: ab + bc + ca = $2.",
    );
  }
  if (prototypeId === "ALG-CP003-CAND-002") {
    value = value.replace(
      /From \(a \+ b \+ c\)² = a² \+ b² \+ c² \+ 2\(ab \+ bc \+ ca\), we get a² \+ b² \+ c² = (.+?) = (.+?)\.$/m,
      "Use (a + b + c)² = a² + b² + c² + 2(ab + bc + ca).\nRearrange for the required expression: a² + b² + c² = (a + b + c)² - 2(ab + bc + ca).\nSubstitute the given values: a² + b² + c² = $1.\nEvaluate the square and product, then combine them: a² + b² + c² = $2.",
    );
  }
  if (prototypeId === "ALG-CP003-CAND-003") {
    value = value.replace(
      /Therefore the value is (.+?) = (.+?)\.$/m,
      "Substitute abc into a³ + b³ + c³ = 3abc: a³ + b³ + c³ = $1.\nMultiply: a³ + b³ + c³ = $2.",
    );
  }
  if (prototypeId === "ALG-CP003-CAND-005") {
    value = value.replace(
      /Therefore the value is (.+?) = (.+?)\.$/m,
      "Substitute the given square-sum and pairwise-product sum: required value = $1.\nEvaluate the bracket first and then multiply by 2: required value = $2.",
    );
  }
  return value;
}

function expandQuadraticFormula(prototypeId: string, explanation: string): string {
  let value = explanation;
  if (prototypeId === "ALG-CP009-CAND-003") {
    value = value.replace(
      /The quadratic formula gives x = (.+?), which simplifies to (.+?) and (.+?)\.$/m,
      "Use the quadratic formula x = [-b ± √D]/(2a).\nSubstitute a, b and D: x = $1.\nSimplify the surd and divide by 2: x = $2 or $3.",
    );
  }
  return value;
}

function removeVietaDuplication(prototypeId: string, explanation: string): string {
  if (!["ALG-CP010-CAND-001", "ALG-CP010-CAND-002"].includes(prototypeId)) return explanation;
  const steps = explanation.split(/\n+/).map((step) => step.trim()).filter(Boolean);
  const seen = new Set<string>();
  return steps.filter((step) => {
    if (step.startsWith("Read a and ")) return false;
    if (seen.has(step)) return false;
    seen.add(step);
    return true;
  }).join("\n");
}

function expandVertexWorking(prototypeId: string, question: string, explanation: string): string {
  if (!["ALG-CP012-CAND-007", "ALG-CP012-CAND-008"].includes(prototypeId)) return explanation;
  const coeffs = extractQuadraticCoefficients(question);
  if (!coeffs) return explanation;

  const xMatch = explanation.match(/(?:gives x =|x = -b\/\(2a\) =) ([^\.]+)\./);
  const valueMatch = explanation.match(/(?:minimum|maximum) value ([-0-9/]+)\./);
  if (!xMatch?.[1] || !valueMatch?.[1]) return explanation;

  const xValue = xMatch[1].trim();
  const finalValue = valueMatch[1].trim();
  const substituted = coeffs.expression
    .replace(/x²/g, `(${xValue})²`)
    .replace(/x/g, `(${xValue})`);

  let value = explanation.replace(
    /(?:Using x = -b\/\(2a\) gives x =|The vertex occurs at x = -b\/\(2a\) =) [^\.]+\./,
    `Use x = -b/(2a). Substitute a = ${coeffs.a} and b = ${coeffs.b}: x = -(${coeffs.b})/[2(${coeffs.a})] = ${xValue}.`,
  );
  value = value.replace(
    /Substitut(?:ing|ion)(?: this x into the quadratic)? gives the (?:minimum|maximum) value [-0-9/]+\./,
    `Now substitute x = ${xValue} into the quadratic: ${substituted}.\nEvaluate this expression step by step to get ${finalValue}.`,
  );
  return value;
}

function addQuadraticCoefficientContext(prototypeId: string, question: string, explanation: string): string {
  if (!needsQuadraticAbc(prototypeId)) return explanation;
  const coeffs = extractQuadraticCoefficients(question);
  if (!coeffs) return explanation;
  const line = `Compare with ax² + bx + c: a = ${coeffs.a}, b = ${coeffs.b}, c = ${coeffs.c}.`;
  return insertAfterWhy(explanation, line);
}

function polishExplanation(item: AlgPermanentEnglishReviewV3Item, question: string): string {
  let value = normalizeRenderedSigns(item.explanation);
  value = expandReciprocalCube(item.prototypeId, value);
  value = expandThreeVariableIdentity(item.prototypeId, value);
  value = expandQuadraticFormula(item.prototypeId, value);
  value = removeVietaDuplication(item.prototypeId, value);
  value = expandVertexWorking(item.prototypeId, question, value);
  value = addQuadraticCoefficientContext(item.prototypeId, question, value);
  return normalizeRenderedSigns(value);
}

export function generateAlgPermanentEnglishReviewV3(
  qlId: AlgPermanentQlId,
  seed: number,
  requestedVariantIndex?: number,
): AlgPermanentEnglishReviewV3Item {
  const item = generateAlgPermanentEnglishReviewV3Raw(qlId, seed, requestedVariantIndex);
  const question = polishQuestion(item.prototypeId, item.question);
  return {
    ...item,
    question,
    explanation: polishExplanation(item, question),
  };
}
