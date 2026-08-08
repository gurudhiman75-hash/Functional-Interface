import { SAP_CP003_EXAM_READINESS_POLICY } from "./exam-readiness-policy";
import {
  type Rat,
  add,
  formatPercentLiteral,
  formatRat,
  formatTerminatingDecimal,
  isTerminating,
  multiply,
  parseNumericLiteral,
  rat,
  subtract,
} from "./exact";
import type { SapCp003Option, SapCp003Package, SapCp003PrototypeId } from "./types";

function numeric(value: Rat): number {
  return Number(value.n) / Number(value.d);
}

function requestsReducedFraction(pkg: SapCp003Package): boolean {
  return /reduced fraction/i.test(pkg.stem);
}

function displayLikeQuestion(value: Rat, pkg: SapCp003Package): string {
  if (pkg.canonicalAnswer.endsWith("%")) return formatPercentLiteral(value);
  if (requestsReducedFraction(pkg) || pkg.canonicalAnswer.includes("/")) return formatRat(value);
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function nearbyStep(answer: Rat, pkg: SapCp003Package): Rat {
  if (pkg.canonicalAnswer.endsWith("%")) return rat(1n, 16n);
  if (requestsReducedFraction(pkg) || pkg.canonicalAnswer.includes("/")) {
    return rat(1n, answer.d <= 16n ? answer.d : 16n);
  }
  const magnitude = Math.abs(numeric(answer));
  if (magnitude >= 100) return rat(BigInt(Math.max(2, Math.round(magnitude * 0.05))));
  if (magnitude >= 20) return rat(2n);
  if (magnitude >= 5) return rat(1n, 2n);
  if (magnitude >= 1) return rat(1n, 4n);
  if (magnitude >= 0.1) return rat(1n, 20n);
  return rat(1n, 100n);
}

function isCrediblyClose(correct: Rat, option: Rat): boolean {
  const correctNumber = numeric(correct);
  const difference = Math.abs(numeric(subtract(option, correct)));
  const allowance = Math.max(Math.abs(correctNumber) * 0.5, Math.abs(correctNumber) < 1 ? 0.1 : 0.5);
  return difference <= allowance;
}

const FAMILY_ANALYSES: Readonly<Record<SapCp003PrototypeId, string>> = Object.freeze({
  "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": "The operation order is identified correctly, but a small final decimal-arithmetic slip produces this nearby result.",
  "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": "The decimal and fraction structure is set up correctly, but a small final calculation slip produces this nearby result.",
  "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": "The decimal point is placed in the correct region, but a small multiplication or carry error produces this nearby value.",
  "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": "The decimal is shifted in the correct direction, but it is placed one nearby position incorrectly.",
  "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": "The compatible decimal divisor is handled correctly, but a small quotient-arithmetic slip produces this nearby result.",
  "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": "The percentage is converted to the correct type of factor, but a small multiplication or division slip produces this nearby result.",
  "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": "The percentage-of block is scoped correctly, but a small final arithmetic slip produces this nearby value.",
  "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": "The three representations are converted consistently, but a small final combination error produces this nearby exact value.",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": "The terms are converted to fractions correctly, but a small numerator or denominator arithmetic slip produces this nearby fraction.",
  "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": "The representations are converted to decimals correctly, but a small final arithmetic slip produces this nearby decimal.",
  "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": "The benchmark equivalence is recognised, but a small final multiplication or subtraction slip produces this nearby result.",
  "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": "The recurring decimal is converted to an exact fraction, but a small common-denominator arithmetic slip produces this nearby fraction.",
  "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": "The percentage relationship is recognised, but a small final addition or subtraction slip produces this nearby value.",
  "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": "The successive factors are formed correctly, but a small final multiplication slip produces this nearby result.",
  "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": "The correct inverse operation is selected, but a small final decimal-arithmetic slip produces this nearby missing value.",
  "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": "The percentage amount and base are isolated correctly, but a nearby benchmark percentage is selected after a small final division slip.",
  "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": "The quantities are converted consistently, but a small arithmetic slip changes the resulting comparison.",
  "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": "The whole-number product is correct, but the decimal is placed one nearby position incorrectly.",
  "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": "The calculation is checked in sequence, but the first value-changing step is identified one stage too early or too late.",
});

function improveNumericDistractors(pkg: SapCp003Package): SapCp003Package {
  const policy = SAP_CP003_EXAM_READINESS_POLICY[pkg.prototypeId];
  if (policy.mockUse === "FOUNDATION_ONLY") return pkg;
  if (pkg.taskDirection === "COMPARISON" || pkg.taskDirection === "DIAGNOSIS") return pkg;
  const correct = parseNumericLiteral(pkg.canonicalAnswer);
  if (!correct) return pkg;

  const wrongOptions = pkg.options.filter((option) => !option.isCorrect);
  const parsedWrongs = wrongOptions
    .map((option) => ({ option, value: parseNumericLiteral(option.value) }))
    .filter((entry): entry is { option: SapCp003Option; value: Rat } => Boolean(entry.value));
  if (parsedWrongs.some((entry) => isCrediblyClose(correct, entry.value))) return pkg;

  const step = nearbyStep(correct, pkg);
  const candidates = [
    add(correct, step),
    subtract(correct, step),
    add(correct, multiply(step, rat(2n))),
    subtract(correct, multiply(step, rat(2n))),
  ];
  const positiveAnswer = correct.n >= 0n;
  const used = new Set(pkg.options.map((option) => option.value));
  let candidate: Rat | undefined;
  let candidateDisplay: string | undefined;
  for (const value of candidates) {
    if (positiveAnswer && value.n < 0n) continue;
    const display = displayLikeQuestion(value, pkg);
    if (used.has(display)) continue;
    const parsed = parseNumericLiteral(display);
    if (!parsed || !isCrediblyClose(correct, parsed)) continue;
    candidate = value;
    candidateDisplay = display;
    break;
  }
  if (!candidate || !candidateDisplay) return pkg;

  const replaceEntry = parsedWrongs
    .slice()
    .sort((left, right) => Math.abs(numeric(right.value) - numeric(correct)) - Math.abs(numeric(left.value) - numeric(correct)))[0];
  if (!replaceEntry) return pkg;

  const direction = numeric(candidate) > numeric(correct) ? "HIGH" : "LOW";
  const options: readonly SapCp003Option[] = Object.freeze(pkg.options.map((option) =>
    option === replaceEntry.option
      ? Object.freeze({
        ...option,
        value: candidateDisplay!,
        misconceptionId: `NEARBY_${pkg.prototypeId.replace("SAP-CP003-PROT-", "").replace(/-/g, "_")}_${direction}`,
        analysis: FAMILY_ANALYSES[pkg.prototypeId],
      })
      : option,
  ));
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  if (!optionUniquenessPassed) return pkg;
  return Object.freeze({
    ...pkg,
    options,
    validation: Object.freeze({
      ...pkg.validation,
      optionUniquenessPassed,
      ok: pkg.validation.ok && optionUniquenessPassed,
    }),
  });
}

export function applySapCp003DistractorPlausibilityV3(pkg: SapCp003Package): SapCp003Package {
  return improveNumericDistractors(pkg);
}
