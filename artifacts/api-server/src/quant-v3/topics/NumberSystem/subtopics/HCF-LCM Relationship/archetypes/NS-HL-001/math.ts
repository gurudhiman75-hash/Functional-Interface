import type { NsHl001MathJaxFields, NsHl001Pair, NsHl001Parameters } from "./types";

export const NS_HL_001_MATHJAX_KEYS = [
  "productRelationLatex",
  "divisibilityCheckLatex",
  "productRelationCheckLatex",
  "missingNumberFormulaLatex",
  "hcfVerificationLatex",
  "lcmVerificationLatex",
  "quotientLatex",
  "factorPairListLatex",
  "coprimePairFilterLatex",
  "conditionFilterLatex",
  "reconstructedPairLatex",
  "factorPairCountLatex",
  "orderedPairPolicyLatex",
  "unorderedPairPolicyLatex",
  "ratioReductionLatex",
  "ratioMultiplierLatex",
  "hcfMultiplierLatex",
  "lcmMultiplierLatex",
  "consistencyCheckLatex",
] as const;

export function gcd(a: number, b: number) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }
  return x;
}

export function lcm2(a: number, b: number) {
  return Math.abs((a / gcd(a, b)) * b);
}

export function hcfOf(numbers: readonly number[]) {
  return numbers.reduce((current, value) => gcd(current, value));
}

export function lcmOf(numbers: readonly number[]) {
  return numbers.reduce((current, value) => lcm2(current, value), 1);
}

export function factorPairs(value: number): NsHl001Pair[] {
  const pairs: NsHl001Pair[] = [];
  for (let factor = 1; factor * factor <= value; factor += 1) {
    if (value % factor === 0) pairs.push({ a: factor, b: value / factor });
  }
  return pairs;
}

export function coprimeFactorPairs(value: number) {
  return factorPairs(value).filter((pair) => gcd(pair.a, pair.b) === 1);
}

export function formatPair(pair: NsHl001Pair) {
  return `${pair.a} and ${pair.b}`;
}

export function formatPairList(pairs: readonly NsHl001Pair[]) {
  if (pairs.length === 0) return "none";
  return pairs.map((pair) => `(${pair.a}, ${pair.b})`).join(", ");
}

export function parseRatio(ratio: string) {
  const [left, right] = ratio.split(":").map((part) => Number(part.trim()));
  if (!Number.isInteger(left) || !Number.isInteger(right) || left <= 0 || right <= 0) {
    throw new Error(`NS-HL-001 invalid ratio: ${ratio}`);
  }
  const divisor = gcd(left, right);
  return { left, right, reducedLeft: left / divisor, reducedRight: right / divisor, divisor };
}

export function operandSizeBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value <= 500) return "small";
  if (value <= 5000) return "medium";
  return "large";
}

export function quotientSizeBucket(value: number | undefined) {
  if (typeof value !== "number") return "not-applicable";
  if (value <= 20) return "small";
  if (value <= 100) return "medium";
  return "large";
}

export function buildMathJax(parameters: NsHl001Parameters, input: {
  answer: number | string;
  answerPair?: NsHl001Pair;
  factorPairs?: readonly NsHl001Pair[];
  coprimePairs?: readonly NsHl001Pair[];
  selectedPairs?: readonly NsHl001Pair[];
  quotient?: number;
}) : NsHl001MathJaxFields {
  const hcf = parameters.hcf ?? 0;
  const lcm = parameters.lcm ?? 0;
  const product = parameters.product ?? (hcf && lcm ? hcf * lcm : undefined);
  const quotient = input.quotient ?? (hcf && lcm && lcm % hcf === 0 ? lcm / hcf : undefined);
  const pairs = input.factorPairs ?? (quotient ? factorPairs(quotient) : []);
  const coprimePairs = input.coprimePairs ?? (quotient ? coprimeFactorPairs(quotient) : []);
  const selectedPairs = input.selectedPairs ?? [];
  const pair = input.answerPair;
  return {
    productRelationLatex: productRelationLatex(parameters, product),
    divisibilityCheckLatex: divisibilityCheckLatex(parameters),
    productRelationCheckLatex: productRelationCheckLatex(parameters),
    missingNumberFormulaLatex: missingNumberFormulaLatex(parameters, input.answer),
    hcfVerificationLatex: pair && hcf ? `\\operatorname{HCF}(${pair.a}, ${pair.b}) = ${hcf}` : "\\text{HCF verification is not required}",
    lcmVerificationLatex: pair && lcm ? `\\operatorname{LCM}(${pair.a}, ${pair.b}) = ${lcm}` : "\\text{LCM verification is not required}",
    quotientLatex: quotient ? `\\frac{\\operatorname{LCM}}{\\operatorname{HCF}} = \\frac{${lcm}}{${hcf}} = ${quotient}` : "\\text{Quotient is not required}",
    factorPairListLatex: pairs.length ? `\\text{Factor pairs: } ${formatPairList(pairs)}` : "\\text{No factor pairs are required}",
    coprimePairFilterLatex: coprimePairs.length ? `\\text{Co-prime pairs: } ${formatPairList(coprimePairs)}` : "\\text{No co-prime pair filter is required}",
    conditionFilterLatex: conditionFilterLatex(parameters, selectedPairs),
    reconstructedPairLatex: pair && hcf ? `(${hcf}\\times ${pair.a / hcf}, ${hcf}\\times ${pair.b / hcf}) = (${pair.a}, ${pair.b})` : pair ? `(${pair.a}, ${pair.b})` : "\\text{No pair reconstruction is required}",
    factorPairCountLatex: `\\text{Co-prime factor-pair count} = ${coprimePairs.length}`,
    orderedPairPolicyLatex: parameters.pairPolicy === "orderedPairs" ? `${coprimePairs.length}\\times 2 = ${coprimePairs.length * 2}` : "\\text{Ordered-pair rule is not used}",
    unorderedPairPolicyLatex: parameters.pairPolicy !== "orderedPairs" ? `\\text{Unordered pairs} = ${coprimePairs.length}` : "\\text{Unordered-pair rule is not used}",
    ratioReductionLatex: ratioReductionLatex(parameters),
    ratioMultiplierLatex: ratioMultiplierLatex(parameters),
    hcfMultiplierLatex: hcfMultiplierLatex(parameters),
    lcmMultiplierLatex: lcmMultiplierLatex(parameters),
    consistencyCheckLatex: consistencyCheckLatex(parameters, pair),
  };
}

export function mathJaxPresent(fields: NsHl001MathJaxFields) {
  return NS_HL_001_MATHJAX_KEYS.every((key) => typeof fields[key] === "string" && fields[key].length > 0);
}

function productRelationLatex(parameters: NsHl001Parameters, product: number | undefined) {
  if (parameters.hcf && parameters.lcm) return `${parameters.hcf}\\times ${parameters.lcm} = ${parameters.hcf * parameters.lcm}`;
  if (parameters.product && parameters.hcf) return `${parameters.product} = ${parameters.hcf}\\times \\operatorname{LCM}`;
  if (parameters.product && parameters.lcm) return `${parameters.product} = \\operatorname{HCF}\\times ${parameters.lcm}`;
  return `\\operatorname{HCF}\\times\\operatorname{LCM} = ${product ?? "\\text{product}"}`;
}

function divisibilityCheckLatex(parameters: NsHl001Parameters) {
  if (!parameters.hcf || !parameters.lcm) return "\\text{Divisibility check is not required}";
  const remainder = parameters.lcm % parameters.hcf;
  return `${parameters.lcm}\\div ${parameters.hcf}\\text{ leaves remainder }${remainder}`;
}

function productRelationCheckLatex(parameters: NsHl001Parameters) {
  if (parameters.a && parameters.b && parameters.hcf && parameters.lcm) {
    return `${parameters.a}\\times ${parameters.b} = ${parameters.a * parameters.b},\\quad ${parameters.hcf}\\times ${parameters.lcm} = ${parameters.hcf * parameters.lcm}`;
  }
  if (parameters.hcf && parameters.lcm) return `${parameters.hcf}\\times ${parameters.lcm} = ${parameters.hcf * parameters.lcm}`;
  return "\\text{Product relation check is not required}";
}

function missingNumberFormulaLatex(parameters: NsHl001Parameters, answer: number | string) {
  if (!parameters.hcf || !parameters.lcm || !parameters.knownNumber) return "\\text{Missing number formula is not required}";
  return `\\frac{${parameters.hcf}\\times ${parameters.lcm}}{${parameters.knownNumber}} = ${answer}`;
}

function conditionFilterLatex(parameters: NsHl001Parameters, selectedPairs: readonly NsHl001Pair[]) {
  const selected = selectedPairs.length ? formatPairList(selectedPairs) : "none";
  if (parameters.conditionType === "sumCondition") return `\\text{Required sum }=${parameters.sum};\\ \\text{selected pair: } ${selected}`;
  if (parameters.conditionType === "differenceCondition") return `\\text{Required difference }=${parameters.difference};\\ \\text{selected pair: } ${selected}`;
  if (parameters.conditionType === "rangeCondition") return `\\text{Range }[${parameters.lowerBound}, ${parameters.upperBound}];\\ \\text{selected pair: } ${selected}`;
  if (parameters.conditionType === "directPairCondition") return `\\text{Direct condition selects: } ${selected}`;
  return "\\text{No pair condition is required}";
}

function ratioReductionLatex(parameters: NsHl001Parameters) {
  if (!parameters.ratio) return "\\text{Ratio reduction is not required}";
  const ratio = parseRatio(parameters.ratio);
  return `${ratio.left}:${ratio.right} = ${ratio.reducedLeft}:${ratio.reducedRight}`;
}

function ratioMultiplierLatex(parameters: NsHl001Parameters) {
  if (!parameters.ratio) return "\\text{Ratio multiplier is not required}";
  const ratio = parseRatio(parameters.ratio);
  return `\\text{Numbers }= ${ratio.reducedLeft}k\\text{ and }${ratio.reducedRight}k`;
}

function hcfMultiplierLatex(parameters: NsHl001Parameters) {
  if (!parameters.ratio || !parameters.hcf) return "\\text{HCF multiplier is not used}";
  return `k = \\operatorname{HCF} = ${parameters.hcf}`;
}

function lcmMultiplierLatex(parameters: NsHl001Parameters) {
  if (!parameters.ratio || !parameters.lcm) return "\\text{LCM multiplier is not used}";
  const ratio = parseRatio(parameters.ratio);
  return `k = \\frac{${parameters.lcm}}{${ratio.reducedLeft}\\times ${ratio.reducedRight}}`;
}

function consistencyCheckLatex(parameters: NsHl001Parameters, pair: NsHl001Pair | undefined) {
  if (!pair) return "\\text{Consistency check is not required}";
  const checks = [];
  if (parameters.hcf) checks.push(`\\operatorname{HCF}(${pair.a}, ${pair.b})=${hcfOf([pair.a, pair.b])}`);
  if (parameters.lcm) checks.push(`\\operatorname{LCM}(${pair.a}, ${pair.b})=${lcmOf([pair.a, pair.b])}`);
  return checks.join(", ");
}
