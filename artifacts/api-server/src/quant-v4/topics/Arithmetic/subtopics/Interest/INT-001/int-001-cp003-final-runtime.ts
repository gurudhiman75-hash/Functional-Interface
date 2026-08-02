import {
  generateIntCp003Question as generateBaseQuestion,
  verifyIntCp003Option,
  type IntCp003GeneratedQuestion,
  type IntCp003OptionAudit,
  type IntCp003QlId,
  type Rational,
} from "./cp003-annual-compound-runtime";
export {
  INT_CP003_FINAL_REGISTRY,
  INT_CP003_LEGACY_FAMILIES,
  INT_CP003_QL_IDS,
  getIntCp003RegistryEntry,
  verifyIntCp003Option,
  type IntCp003GeneratedQuestion,
  type IntCp003QlId,
  type Rational,
} from "./cp003-annual-compound-runtime";

const abs = (value: bigint) => value < 0n ? -value : value;
function gcd(a: bigint, b: bigint): bigint {
  a = abs(a); b = abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1n;
}
function rat(numerator: bigint | number, denominator: bigint | number = 1): Rational {
  let n = BigInt(numerator), d = BigInt(denominator);
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d);
  return Object.freeze({ numerator: n / divisor, denominator: d / divisor });
}
const add = (a: Rational, b: Rational) => rat(a.numerator * b.denominator + b.numerator * a.denominator, a.denominator * b.denominator);
const sub = (a: Rational, b: Rational) => rat(a.numerator * b.denominator - b.numerator * a.denominator, a.denominator * b.denominator);
const mul = (a: Rational, b: Rational) => rat(a.numerator * b.numerator, a.denominator * b.denominator);
const div = (a: Rational, b: Rational) => rat(a.numerator * b.denominator, a.denominator * b.numerator);
function pow(value: Rational, exponent: number): Rational {
  return rat(value.numerator ** BigInt(exponent), value.denominator ** BigInt(exponent));
}
const factor = (ratePercent: Rational) => add(rat(1), div(ratePercent, rat(100)));
const amount = (principal: Rational, ratePercent: Rational, years: number) => mul(principal, pow(factor(ratePercent), years));
const yearlyInterest = (principal: Rational, ratePercent: Rational, year: number) => sub(amount(principal, ratePercent, year), amount(principal, ratePercent, year - 1));
const equal = (a: Rational, b: Rational) => a.numerator === b.numerator && a.denominator === b.denominator;

function parseRational(value: string): Rational {
  const [numerator, denominator = "1"] = value.split("/");
  return rat(BigInt(numerator!), BigInt(denominator));
}
function formatInteger(value: bigint): string {
  const source = abs(value).toString();
  const groups: string[] = [];
  for (let index = source.length; index > 0; index -= 3) groups.unshift(source.slice(Math.max(0, index - 3), index));
  return `${value < 0n ? "-" : ""}${groups.join(",")}`;
}
function optionText(question: IntCp003GeneratedQuestion, value: Rational): string {
  if (question.answerSemantic === "TIME_YEARS") {
    const years = Number(value.numerator / value.denominator);
    return `${years} year${years === 1 ? "" : "s"}`;
  }
  if (question.answerSemantic === "RATE_PERCENT") return `${value.numerator / value.denominator}%`;
  return value.denominator === 1n ? `₹${formatInteger(value.numerator)}` : `₹${value.numerator}/${value.denominator}`;
}

function replacementFor(question: IntCp003GeneratedQuestion): Omit<IntCp003OptionAudit, "text"> {
  const principal = parseRational(String(question.hiddenState.principal));
  const ratePercent = parseRational(String(question.hiddenState.ratePercent));
  const years = Number(question.hiddenState.years);
  const specifiedYear = Number(question.hiddenState.specifiedYear);
  const observationYear = Number(question.hiddenState.observationYear);
  switch (question.qlId) {
    case "INT-QL-056":
      return {
        value: amount(principal, ratePercent, years),
        misconceptionId: "RETURN_AMOUNT",
        explanation: "Adds the principal and returns the maturity amount instead of the compound interest inverse.",
      };
    case "INT-QL-058":
      return {
        value: rat(years + 2),
        misconceptionId: "TWO_EXTRA_YEARS",
        explanation: "Counts two extra complete annual periods.",
      };
    case "INT-QL-059":
      return {
        value: yearlyInterest(principal, ratePercent, specifiedYear + 1),
        misconceptionId: "NEXT_YEAR",
        explanation: "Uses the following year's interest instead of the specified year's interest.",
      };
    case "INT-QL-064":
      return {
        value: sub(amount(principal, ratePercent, observationYear + 1), amount(principal, ratePercent, observationYear)),
        misconceptionId: "RETURN_ANNUAL_INCREASE",
        explanation: "Uses the increase between the two observed balances as the original principal.",
      };
    default:
      throw new Error(`${question.qlId}: generic fallback option has no final-runtime replacement.`);
  }
}

function freezeDeep<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) freezeDeep(nested);
    Object.freeze(value);
  }
  return value;
}

export function generateIntCp003Question(
  qlId: IntCp003QlId,
  seed = "int-cp003-default",
): IntCp003GeneratedQuestion {
  const source = generateBaseQuestion(qlId, seed);
  const fallbackIndex = source.optionAudit.findIndex((option) => option.misconceptionId === "OFFSET");
  if (fallbackIndex < 0) return source;

  const replacement = replacementFor(source);
  if (
    replacement.value.numerator <= 0n
    || source.optionAudit.some((option, index) => index !== fallbackIndex && equal(option.value, replacement.value))
    || verifyIntCp003Option(qlId, seed, replacement.value)
  ) {
    throw new Error(`${qlId}: task-specific fallback replacement is not a valid unique distractor.`);
  }

  const optionAudit = source.optionAudit.map((option, index) => index === fallbackIndex
    ? Object.freeze({ ...replacement, text: optionText(source, replacement.value) })
    : option);
  const options = optionAudit.map((option) => option.text);
  const trapAnalysis = optionAudit
    .map((option, index) => ({ option, index }))
    .filter(({ index }) => index !== source.correctIndex)
    .map(({ option, index }) => Object.freeze({
      optionNumber: index + 1,
      misconceptionId: option.misconceptionId,
      explanation: option.explanation,
    }));

  return freezeDeep({
    ...source,
    options,
    optionAudit,
    explanation: {
      ...source.explanation,
      trapAnalysis,
    },
  });
}
