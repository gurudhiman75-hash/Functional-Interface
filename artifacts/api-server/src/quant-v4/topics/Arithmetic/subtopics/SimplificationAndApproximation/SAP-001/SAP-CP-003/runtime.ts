import { SAP_CP003_AUTHORITY_BY_ID, SAP_CP003_PROTOTYPE_AUTHORITIES } from "./catalogue";
import {
  type Rat,
  add,
  canonicalRat,
  compareRat,
  divide,
  ensureSentence,
  equalRat,
  formatPercentLiteral,
  formatRat,
  formatTerminatingDecimal,
  hash32,
  independentAdd,
  independentDivide,
  independentMultiply,
  independentSubtract,
  isTerminating,
  multiply,
  normalizePayload,
  normalizeStudentMath,
  parseNumericLiteral,
  parseRecurringDecimal,
  pow10,
  rat,
  subtract,
} from "./exact";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003AnswerSemantic,
  type SapCp003Difficulty,
  type SapCp003Explanation,
  type SapCp003Option,
  type SapCp003Package,
  type SapCp003PrototypeId,
  type SapCp003Validation,
} from "./types";

interface WrongRat {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

interface WrongText {
  readonly value: string;
  readonly misconceptionId: string;
  readonly analysis: string;
}

interface Draft {
  readonly stem: string;
  readonly answerRat?: Rat;
  readonly verifierRat?: Rat;
  readonly answerText?: string;
  readonly verifierText?: string;
  readonly wrongRats?: readonly WrongRat[];
  readonly wrongTexts?: readonly WrongText[];
  readonly steps: readonly string[];
  readonly complexity: number;
  readonly payloadParts: readonly string[];
}

class Rng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0 || 0x9e3779b9;
  }

  next(): number {
    let value = this.state;
    value ^= value << 13;
    value ^= value >>> 17;
    value ^= value << 5;
    this.state = value >>> 0;
    return this.state;
  }

  int(min: number, max: number): number {
    return min + (this.next() % (max - min + 1));
  }

  pick<T>(values: readonly T[]): T {
    return values[this.next() % values.length]!;
  }

  bool(): boolean {
    return (this.next() & 1) === 1;
  }
}

const DECIMALS = Object.freeze([
  "0.125", "0.2", "0.25", "0.375", "0.4", "0.5", "0.6", "0.625", "0.75", "0.8", "0.875",
  "1.2", "1.25", "1.5", "1.75", "2.4", "2.5", "3.2", "3.75", "4.5", "6.25", "7.5",
] as const);

const COMPATIBLE_DIVISORS = Object.freeze(["0.2", "0.25", "0.5", "1.25", "2.5"] as const);
const FRACTIONS = Object.freeze(["1/8", "1/5", "1/4", "3/8", "2/5", "1/2", "3/5", "5/8", "3/4", "4/5", "7/8"] as const);
const PERCENTS = Object.freeze(["12.5%", "20%", "25%", "37.5%", "40%", "50%", "60%", "62.5%", "75%", "80%", "87.5%", "125%"] as const);
const RECURRING = Object.freeze(["0.(1)", "0.(2)", "0.(3)", "0.(6)", "0.1(6)", "0.4(5)", "0.8(3)"] as const);
const BENCHMARKS = Object.freeze([
  { fraction: "1/8", decimal: "0.125", percent: "12.5%" },
  { fraction: "1/5", decimal: "0.2", percent: "20%" },
  { fraction: "1/4", decimal: "0.25", percent: "25%" },
  { fraction: "3/8", decimal: "0.375", percent: "37.5%" },
  { fraction: "2/5", decimal: "0.4", percent: "40%" },
  { fraction: "1/2", decimal: "0.5", percent: "50%" },
  { fraction: "3/5", decimal: "0.6", percent: "60%" },
  { fraction: "5/8", decimal: "0.625", percent: "62.5%" },
  { fraction: "3/4", decimal: "0.75", percent: "75%" },
  { fraction: "4/5", decimal: "0.8", percent: "80%" },
  { fraction: "7/8", decimal: "0.875", percent: "87.5%" },
] as const);

function literal(text: string): Rat {
  const value = parseNumericLiteral(text);
  if (!value) throw new Error(`Unsupported CP-003 numeric literal ${text}.`);
  return value;
}

function decimalFromScaled(integer: number, places: number): string {
  return formatTerminatingDecimal(rat(BigInt(integer), pow10(places)));
}

function valueForSemantic(value: Rat, semantic: SapCp003AnswerSemantic): string {
  switch (semantic) {
    case "TERMINATING_DECIMAL":
    case "MISSING_DECIMAL":
    case "OPTION_VALUE":
      return formatTerminatingDecimal(value);
    case "SIMPLIFIED_RATIONAL":
      return formatRat(value);
    case "INTEGER":
      if (value.d !== 1n) throw new Error(`${formatRat(value)} is not an integer.`);
      return formatRat(value);
    case "PERCENTAGE_LITERAL":
    case "MISSING_PERCENTAGE":
      return formatPercentLiteral(value);
    default:
      throw new Error(`Semantic ${semantic} is not numeric.`);
  }
}

function wrong(value: Rat, misconceptionId: string, analysis: string): WrongRat {
  return Object.freeze({ value, misconceptionId, analysis: ensureSentence(analysis) });
}

function genericWrongRats(correct: Rat, semantic: SapCp003AnswerSemantic): readonly WrongRat[] {
  const scaleUp = multiply(correct, rat(10n));
  const scaleDown = divide(correct, rat(10n));
  const unit = semantic === "PERCENTAGE_LITERAL" || semantic === "MISSING_PERCENTAGE"
    ? rat(1n, 100n)
    : semantic === "TERMINATING_DECIMAL" || semantic === "MISSING_DECIMAL" || semantic === "OPTION_VALUE"
      ? rat(1n, 10n)
      : rat(1n);
  return Object.freeze([
    wrong(scaleUp, "DECIMAL_POINT_ONE_PLACE_RIGHT", "The decimal point was placed one position too far to the right."),
    wrong(scaleDown, "DECIMAL_POINT_ONE_PLACE_LEFT", "The decimal point was placed one position too far to the left."),
    wrong(add(correct, unit), "FINAL_PLACE_VALUE_INCREMENT", "The setup was retained, but one unit of the answer's displayed place value was added."),
    wrong(subtract(correct, unit), "FINAL_PLACE_VALUE_DECREMENT", "The setup was retained, but one unit of the answer's displayed place value was subtracted."),
    wrong(rat(-correct.n, correct.d), "FINAL_SIGN_REVERSED", "The correct magnitude was obtained with the opposite sign."),
  ]);
}

function difficulty(score: number): SapCp003Difficulty {
  return score <= 3 ? "EASY" : score <= 6 ? "MEDIUM" : "HARD";
}

function finalizeNumericDraft(
  semantic: SapCp003AnswerSemantic,
  draft: Draft,
): { readonly answer: string; readonly verifier: string; readonly wrongs: readonly WrongText[] } {
  if (!draft.answerRat || !draft.verifierRat) throw new Error("Numeric draft is missing exact values.");
  const answer = valueForSemantic(draft.answerRat, semantic);
  const verifier = valueForSemantic(draft.verifierRat, semantic);
  const candidates = [...(draft.wrongRats ?? []), ...genericWrongRats(draft.answerRat, semantic)];
  const wrongs: WrongText[] = [];
  const used = new Set<string>([answer]);
  for (const candidate of candidates) {
    if (equalRat(candidate.value, draft.answerRat)) continue;
    let displayed: string;
    try {
      displayed = valueForSemantic(candidate.value, semantic);
    } catch {
      continue;
    }
    if (used.has(displayed)) continue;
    used.add(displayed);
    wrongs.push(Object.freeze({
      value: displayed,
      misconceptionId: candidate.misconceptionId,
      analysis: candidate.analysis,
    }));
    if (wrongs.length === 3) break;
  }
  if (wrongs.length !== 3) throw new Error(`Could not construct three numeric distractors for ${answer}.`);
  return Object.freeze({ answer, verifier, wrongs: Object.freeze(wrongs) });
}

function orderOptions(
  prototypeId: SapCp003PrototypeId,
  seed: number,
  answer: string,
  wrongs: readonly WrongText[],
): readonly SapCp003Option[] {
  const prototypeIndex = SAP_CP003_PROTOTYPE_IDS.indexOf(prototypeId);
  const correctIndex = (seed + prototypeIndex) % 4;
  const wrongOffset = hash32(`${prototypeId}|${seed}|wrong-order`) % 3;
  const rotated = wrongs.map((_, index) => wrongs[(index + wrongOffset) % wrongs.length]!);
  const options: SapCp003Option[] = [];
  let wrongIndex = 0;
  for (let index = 0; index < 4; index += 1) {
    if (index === correctIndex) {
      options.push(Object.freeze({
        displayIndex: index + 1,
        value: answer,
        isCorrect: true,
        misconceptionId: null,
        analysis: "This option matches the exact value and the required representation.",
      }));
    } else {
      const candidate = rotated[wrongIndex++]!;
      options.push(Object.freeze({
        displayIndex: index + 1,
        value: candidate.value,
        isCorrect: false,
        misconceptionId: candidate.misconceptionId,
        analysis: candidate.analysis,
      }));
    }
  }
  return Object.freeze(options);
}

function decimalExpression(rng: Rng): Draft {
  const a = rng.pick(DECIMALS);
  const b = rng.pick(DECIMALS);
  if (rng.bool()) {
    const c = rng.pick(["0.2", "0.25", "0.5", "1.25", "2.5"] as const);
    const A = literal(a); const B = literal(b); const C = literal(c);
    const product = multiply(B, C);
    const answer = add(A, product);
    const verifier = independentAdd(A, independentMultiply(B, C));
    return {
      stem: `Evaluate ${a} + ${b} × ${c}.`,
      answerRat: answer,
      verifierRat: verifier,
      wrongRats: [
        wrong(multiply(add(A, B), C), "ADDITION_BEFORE_MULTIPLICATION", "The addition was completed before the multiplication."),
        wrong(add(A, B), "FINAL_FACTOR_OMITTED", `The final multiplication by ${c} was omitted.`),
      ],
      steps: [`Multiply first: ${b} × ${c} = ${formatTerminatingDecimal(product)}`, `${a} + ${formatTerminatingDecimal(product)} = ${formatTerminatingDecimal(answer)}`],
      complexity: 4 + (Math.max(a.length, b.length) > 4 ? 1 : 0),
      payloadParts: [a, b, c, "+*"],
    };
  }
  const c = rng.pick(COMPATIBLE_DIVISORS);
  const A = literal(a); const B = literal(b); const C = literal(c);
  const sum = add(A, B);
  const answer = divide(sum, C);
  if (!isTerminating(answer)) return decimalExpression(rng);
  const verifier = independentDivide(independentAdd(A, B), C);
  return {
    stem: `Evaluate (${a} + ${b}) ÷ ${c}.`,
    answerRat: answer,
    verifierRat: verifier,
    wrongRats: [
      wrong(add(A, divide(B, C)), "BRACKET_SCOPE_IGNORED", `Only ${b} was divided by ${c}; the complete bracket was not used as the dividend.`),
      wrong(multiply(sum, C), "DIVISION_REPLACED_BY_MULTIPLICATION", `The bracket value was multiplied by ${c} instead of divided by it.`),
    ],
    steps: [`Complete the bracket: ${a} + ${b} = ${formatTerminatingDecimal(sum)}`, `${formatTerminatingDecimal(sum)} ÷ ${c} = ${formatTerminatingDecimal(answer)}`],
    complexity: 5,
    payloadParts: [a, b, c, "bracket/divide"],
  };
}

function decimalFractionMixed(rng: Rng): Draft {
  const a = rng.pick(DECIMALS);
  const f = rng.pick(FRACTIONS);
  const b = rng.pick(["0.4", "0.5", "0.8", "1.2", "1.5", "2", "2.4", "2.5", "4", "5"] as const);
  const A = literal(a); const F = literal(f); const B = literal(b);
  const product = multiply(F, B);
  const answer = add(A, product);
  if (!isTerminating(answer)) return decimalFractionMixed(rng);
  return {
    stem: `Evaluate ${a} + ${f} × ${b}.`,
    answerRat: answer,
    verifierRat: independentAdd(A, independentMultiply(F, B)),
    wrongRats: [
      wrong(multiply(add(A, F), B), "ADDITION_BEFORE_MULTIPLICATION", "The decimal and fraction were added before applying the multiplication."),
      wrong(add(A, F), "DECIMAL_FACTOR_OMITTED", `The factor ${b} was omitted from the fraction product.`),
    ],
    steps: [`Convert only as needed and multiply: ${f} × ${b} = ${formatTerminatingDecimal(product)}`, `${a} + ${formatTerminatingDecimal(product)} = ${formatTerminatingDecimal(answer)}`],
    complexity: 5,
    payloadParts: [a, f, b],
  };
}

function decimalProduct(rng: Rng): Draft {
  const leftPlaces = rng.int(1, 3);
  const rightPlaces = rng.int(1, 2);
  const leftInteger = rng.int(12, 999);
  const rightInteger = rng.int(11, 199);
  const left = decimalFromScaled(leftInteger, leftPlaces);
  const right = decimalFromScaled(rightInteger, rightPlaces);
  const L = literal(left); const R = literal(right);
  const answer = multiply(L, R);
  return {
    stem: `Evaluate ${left} × ${right}.`,
    answerRat: answer,
    verifierRat: rat(BigInt(leftInteger * rightInteger), pow10(leftPlaces + rightPlaces)),
    wrongRats: [
      wrong(rat(BigInt(leftInteger * rightInteger), pow10(Math.max(0, leftPlaces + rightPlaces - 1))), "TOO_FEW_DECIMAL_PLACES", "One fewer decimal place than the combined factor scale was restored."),
      wrong(rat(BigInt(leftInteger * rightInteger), pow10(leftPlaces + rightPlaces + 1)), "TOO_MANY_DECIMAL_PLACES", "One extra decimal place was inserted in the product."),
    ],
    steps: [`Ignore the decimal points temporarily: ${leftInteger} × ${rightInteger} = ${leftInteger * rightInteger}`, `The factors contain ${leftPlaces + rightPlaces} decimal places in total, so the product is ${formatTerminatingDecimal(answer)}`],
    complexity: leftPlaces + rightPlaces >= 4 ? 5 : 3,
    payloadParts: [left, right, String(leftPlaces + rightPlaces)],
  };
}

function divideByPowerOfTen(rng: Rng): Draft {
  const sourcePlaces = rng.int(1, 3);
  const sourceInteger = rng.int(101, 99999);
  const divisorPower = rng.int(1, 3);
  const source = decimalFromScaled(sourceInteger, sourcePlaces);
  const divisor = 10 ** divisorPower;
  const S = literal(source);
  const answer = divide(S, rat(BigInt(divisor)));
  return {
    stem: `Evaluate ${source} ÷ ${divisor}.`,
    answerRat: answer,
    verifierRat: rat(BigInt(sourceInteger), pow10(sourcePlaces + divisorPower)),
    wrongRats: [
      wrong(multiply(S, rat(BigInt(divisor))), "DECIMAL_SHIFT_WRONG_DIRECTION", "The decimal point was shifted right as though the value were multiplied by the power of ten."),
      wrong(divide(S, rat(BigInt(10 ** Math.max(0, divisorPower - 1)))), "DECIMAL_SHIFT_TOO_SHORT", "The decimal point was shifted one place fewer than required."),
    ],
    steps: [`The divisor ${divisor} has ${divisorPower} zero${divisorPower === 1 ? "" : "s"}`, `Shift the decimal point ${divisorPower} place${divisorPower === 1 ? "" : "s"} left: ${source} ÷ ${divisor} = ${formatTerminatingDecimal(answer)}`],
    complexity: divisorPower + sourcePlaces >= 5 ? 4 : 2,
    payloadParts: [source, String(divisor)],
  };
}

function divideByCompatibleFactor(rng: Rng): Draft {
  const divisor = rng.pick(COMPATIBLE_DIVISORS);
  const multiplier = rng.int(2, 60);
  const D = literal(divisor);
  const answer = rat(BigInt(multiplier));
  const dividendValue = multiply(D, answer);
  const dividend = formatTerminatingDecimal(dividendValue);
  const reciprocal = divide(rat(1n), D);
  return {
    stem: `Evaluate ${dividend} ÷ ${divisor}.`,
    answerRat: answer,
    verifierRat: independentDivide(literal(dividend), D),
    wrongRats: [
      wrong(multiply(literal(dividend), D), "DIVISOR_USED_AS_MULTIPLIER", `The dividend was multiplied by ${divisor} instead of by its reciprocal ${formatTerminatingDecimal(reciprocal)}.`),
      wrong(divide(D, literal(dividend)), "DIVIDEND_AND_DIVISOR_REVERSED", "The divisor was divided by the dividend."),
    ],
    steps: [`Use the compatible reciprocal: 1 ÷ ${divisor} = ${formatTerminatingDecimal(reciprocal)}`, `${dividend} × ${formatTerminatingDecimal(reciprocal)} = ${multiplier}`],
    complexity: divisor === "0.2" || divisor === "0.25" ? 3 : 4,
    payloadParts: [dividend, divisor],
  };
}

function percentageFactor(rng: Rng): Draft {
  const percent = rng.pick(PERCENTS);
  const quantity = rng.int(4, 240) * 4;
  const P = literal(percent); const Q = rat(BigInt(quantity));
  const answer = multiply(P, Q);
  return {
    stem: `Evaluate ${percent} × ${quantity}.`,
    answerRat: answer,
    verifierRat: independentDivide(independentMultiply(literal(percent.replace("%", "")), Q), rat(100n)),
    wrongRats: [
      wrong(multiply(literal(percent.replace("%", "")), Q), "PERCENT_SIGN_IGNORED", `${percent} was treated as ${percent.replace("%", "")} instead of being divided by 100.`),
      wrong(divide(Q, P), "PERCENT_FACTOR_USED_AS_DIVISOR", "The quantity was divided by the percentage factor instead of multiplied by it."),
    ],
    steps: [`${percent} = ${formatRat(P)}`, `${formatRat(P)} × ${quantity} = ${isTerminating(answer) ? formatTerminatingDecimal(answer) : formatRat(answer)}`],
    complexity: percent.includes(".") ? 4 : 3,
    payloadParts: [percent, String(quantity)],
  };
}

function percentOfInside(rng: Rng): Draft {
  const base = rng.pick(DECIMALS);
  const percent = rng.pick(PERCENTS);
  const quantity = rng.int(8, 160) * 8;
  const A = literal(base); const P = literal(percent); const Q = rat(BigInt(quantity));
  const block = multiply(P, Q);
  const answer = rng.bool() ? add(A, block) : subtract(block, A);
  const plus = compareRat(answer, block) > 0;
  const stem = plus
    ? `Evaluate ${base} + ${percent} of ${quantity}.`
    : `Evaluate ${percent} of ${quantity} − ${base}.`;
  const verifier = plus
    ? independentAdd(A, independentMultiply(P, Q))
    : independentSubtract(independentMultiply(P, Q), A);
  return {
    stem,
    answerRat: answer,
    verifierRat: verifier,
    wrongRats: [
      wrong(multiply(add(A, P), Q), "OF_SCOPE_EXTENDED_TO_OUTSIDE_TERM", "The outside decimal was incorrectly included inside the percentage-of block."),
      wrong(plus ? add(A, P) : subtract(P, A), "QUANTITY_AFTER_OF_OMITTED", `The quantity ${quantity} following 'of' was omitted.`),
    ],
    steps: [`Complete the scoped block: ${percent} of ${quantity} = ${formatTerminatingDecimal(block)}`, `${plus ? `${base} + ${formatTerminatingDecimal(block)}` : `${formatTerminatingDecimal(block)} − ${base}`} = ${formatTerminatingDecimal(answer)}`],
    complexity: 5,
    payloadParts: [base, percent, String(quantity), plus ? "plus" : "minus"],
  };
}

function mixedPercentFractionDecimal(rng: Rng): Draft {
  const percent = rng.pick(PERCENTS);
  const quantity = rng.int(8, 120) * 8;
  const fraction = rng.pick(FRACTIONS);
  const decimal = rng.pick(DECIMALS);
  const P = literal(percent); const Q = rat(BigInt(quantity)); const F = literal(fraction); const D = literal(decimal);
  const first = multiply(P, Q);
  const second = multiply(F, D);
  const answer = rng.bool() ? add(first, second) : subtract(first, second);
  const addMode = compareRat(answer, first) >= 0;
  return {
    stem: `Evaluate ${percent} of ${quantity} ${addMode ? "+" : "−"} ${fraction} × ${decimal}. Give the answer as a reduced fraction.`,
    answerRat: answer,
    verifierRat: addMode
      ? independentAdd(independentMultiply(P, Q), independentMultiply(F, D))
      : independentSubtract(independentMultiply(P, Q), independentMultiply(F, D)),
    wrongRats: [
      wrong(addMode ? multiply(add(first, F), D) : multiply(subtract(first, F), D), "FINAL_DECIMAL_APPLIED_TO_WHOLE_EXPRESSION", `The factor ${decimal} was applied to the entire preceding expression instead of only to ${fraction}.`),
      wrong(addMode ? add(first, F) : subtract(first, F), "DECIMAL_FACTOR_OMITTED", `The factor ${decimal} was omitted from the fractional product.`),
    ],
    steps: [`${percent} of ${quantity} = ${formatRat(first)}`, `${fraction} × ${decimal} = ${formatRat(second)}`, `${formatRat(first)} ${addMode ? "+" : "−"} ${formatRat(second)} = ${formatRat(answer)}`],
    complexity: 7,
    payloadParts: [percent, String(quantity), fraction, decimal, addMode ? "+" : "-"],
  };
}

function convertTermsToFractions(rng: Rng): Draft {
  const decimal = rng.pick(DECIMALS);
  const percent = rng.pick(PERCENTS);
  const fraction = rng.pick(FRACTIONS);
  const D = literal(decimal); const P = literal(percent); const F = literal(fraction);
  const answer = rng.bool() ? add(add(D, P), F) : subtract(add(D, P), F);
  const plusFraction = compareRat(answer, add(D, P)) >= 0;
  return {
    stem: `Evaluate ${decimal} + ${percent} ${plusFraction ? "+" : "−"} ${fraction}. Give the answer as a reduced fraction.`,
    answerRat: answer,
    verifierRat: plusFraction
      ? independentAdd(independentAdd(D, P), F)
      : independentSubtract(independentAdd(D, P), F),
    wrongRats: [
      wrong(plusFraction ? add(D, F) : subtract(D, F), "PERCENTAGE_TERM_OMITTED", `The percentage term ${percent} was omitted during conversion.`),
      wrong(plusFraction ? add(add(D, literal(percent.replace("%", ""))), F) : subtract(add(D, literal(percent.replace("%", ""))), F), "PERCENT_NOT_DIVIDED_BY_100", `${percent} was treated as ${percent.replace("%", "")} rather than as a fraction of 100.`),
    ],
    steps: [`Convert ${decimal} to ${formatRat(D)} and ${percent} to ${formatRat(P)}`, `${formatRat(D)} + ${formatRat(P)} ${plusFraction ? "+" : "−"} ${formatRat(F)} = ${formatRat(answer)}`],
    complexity: 6,
    payloadParts: [decimal, percent, fraction, plusFraction ? "+" : "-"],
  };
}

function convertTermsToDecimals(rng: Rng): Draft {
  const first = rng.pick(BENCHMARKS);
  const second = rng.pick(BENCHMARKS);
  const decimal = rng.pick(DECIMALS);
  const A = literal(first.fraction); const B = literal(second.percent); const D = literal(decimal);
  const answer = add(add(A, B), D);
  return {
    stem: `Evaluate ${first.fraction} + ${second.percent} + ${decimal}. Give the answer as a decimal.`,
    answerRat: answer,
    verifierRat: independentAdd(independentAdd(literal(first.decimal), literal(second.decimal)), D),
    wrongRats: [
      wrong(add(A, D), "PERCENTAGE_TERM_OMITTED", `The percentage ${second.percent} was omitted.`),
      wrong(add(add(literal(first.percent.replace("%", "")), B), D), "FRACTION_CONVERTED_TO_PERCENT_NUMBER", `${first.fraction} was replaced by ${first.percent.replace("%", "")} rather than by ${first.decimal}.`),
    ],
    steps: [`${first.fraction} = ${first.decimal} and ${second.percent} = ${second.decimal}`, `${first.decimal} + ${second.decimal} + ${decimal} = ${formatTerminatingDecimal(answer)}`],
    complexity: 5,
    payloadParts: [first.fraction, second.percent, decimal],
  };
}

function knownEquivalence(rng: Rng): Draft {
  const first = rng.pick(BENCHMARKS.filter((item) => ["1/8", "3/8", "5/8", "7/8"].includes(item.fraction)));
  const second = rng.pick(BENCHMARKS.filter((item) => ["1/4", "1/2", "3/4"].includes(item.fraction)));
  const firstMultiplier = rng.int(1, 20) * 8;
  const secondMultiplier = rng.int(1, 20) * 4;
  const A = literal(first.decimal); const B = rat(BigInt(firstMultiplier));
  const C = literal(second.fraction); const D = rat(BigInt(secondMultiplier));
  const firstValue = multiply(A, B);
  const secondValue = multiply(C, D);
  const answer = add(firstValue, secondValue);
  return {
    stem: `Evaluate ${first.decimal} × ${firstMultiplier} + ${second.fraction} × ${secondMultiplier}.`,
    answerRat: answer,
    verifierRat: independentAdd(independentMultiply(literal(first.fraction), B), independentMultiply(literal(second.decimal), D)),
    wrongRats: [
      wrong(add(B, D), "LANDMARK_FACTORS_IGNORED", "The multipliers were added without applying the benchmark fraction-decimal factors."),
      wrong(add(firstValue, D), "SECOND_BENCHMARK_OMITTED", `The multiplier ${secondMultiplier} was used without the factor ${second.fraction}.`),
    ],
    steps: [`Recognise ${first.decimal} = ${first.fraction}, so the first product is ${formatRat(firstValue)}`, `Recognise ${second.fraction} = ${second.decimal}, so the second product is ${formatRat(secondValue)}`, `${formatRat(firstValue)} + ${formatRat(secondValue)} = ${formatRat(answer)}`],
    complexity: 5,
    payloadParts: [first.decimal, String(firstMultiplier), second.fraction, String(secondMultiplier)],
  };
}

function recurringInside(rng: Rng): Draft {
  const recurring = rng.pick(RECURRING);
  const fraction = rng.pick(["1/9", "1/6", "1/3", "2/9", "2/3", "5/6", "7/9"] as const);
  const R = parseRecurringDecimal(recurring)!;
  const F = literal(fraction);
  const addMode = rng.bool();
  const answer = addMode ? add(R, F) : subtract(R, F);
  return {
    stem: `Evaluate ${recurring} ${addMode ? "+" : "−"} ${fraction}. Give the answer as a reduced fraction.`,
    answerRat: answer,
    verifierRat: addMode ? independentAdd(R, F) : independentSubtract(R, F),
    wrongRats: [
      wrong(addMode ? add(literal(recurring.replace(/[().]/g, "")), F) : subtract(literal(recurring.replace(/[().]/g, "")), F), "RECURRING_MARK_IGNORED", "The recurring block was read as ordinary digits instead of an infinite recurring decimal."),
      wrong(addMode ? add(rat(R.n + 1n, R.d), F) : subtract(rat(R.n + 1n, R.d), F), "RECURRING_CONVERSION_NUMERATOR_SLIP", "The recurring decimal was converted with its numerator one unit too large."),
    ],
    steps: [`Convert ${recurring} to the exact fraction ${formatRat(R)}`, `${formatRat(R)} ${addMode ? "+" : "−"} ${fraction} = ${formatRat(answer)}`],
    complexity: 7,
    payloadParts: [recurring, fraction, addMode ? "+" : "-"],
  };
}

function complementaryPercentages(rng: Rng): Draft {
  const first = rng.pick(["12.5%", "20%", "25%", "37.5%", "40%", "62.5%", "75%", "80%", "87.5%"] as const);
  const firstValue = literal(first);
  const secondValue = subtract(rat(1n), firstValue);
  const second = formatPercentLiteral(secondValue);
  const quantity = rng.int(2, 250) * 8;
  const Q = rat(BigInt(quantity));
  const answer = add(multiply(firstValue, Q), multiply(secondValue, Q));
  return {
    stem: `Evaluate ${first} of ${quantity} + ${second} of ${quantity}.`,
    answerRat: answer,
    verifierRat: independentMultiply(independentAdd(firstValue, secondValue), Q),
    wrongRats: [
      wrong(multiply(firstValue, Q), "COMPLEMENTARY_TERM_OMITTED", `The ${second} term was omitted.`),
      wrong(add(firstValue, secondValue), "COMMON_QUANTITY_OMITTED", `The common quantity ${quantity} was omitted after combining the percentage factors.`),
    ],
    steps: [`${first} + ${second} = 100%`, `100% of ${quantity} = ${quantity}`],
    complexity: first.includes(".") ? 4 : 3,
    payloadParts: [first, second, String(quantity)],
  };
}

function successivePercentFactors(rng: Rng): Draft {
  const pairs = Object.freeze([
    ["120%", "80%"], ["125%", "80%"], ["150%", "60%"], ["75%", "125%"], ["110%", "90%"], ["62.5%", "160%"],
  ] as const);
  const [first, second] = rng.pick(pairs);
  const quantity = rng.int(4, 200) * 4;
  const A = literal(first); const B = literal(second); const Q = rat(BigInt(quantity));
  const factor = multiply(A, B);
  const answer = multiply(factor, Q);
  return {
    stem: `Evaluate ${first} × ${second} × ${quantity}.`,
    answerRat: answer,
    verifierRat: independentDivide(independentMultiply(independentMultiply(literal(first.replace("%", "")), literal(second.replace("%", ""))), Q), rat(10000n)),
    wrongRats: [
      wrong(multiply(add(A, B), Q), "PERCENT_FACTORS_ADDED", "The successive percentage factors were added instead of multiplied."),
      wrong(multiply(literal(first.replace("%", "")), multiply(B, Q)), "FIRST_PERCENT_SIGN_IGNORED", `The first factor ${first} was not divided by 100.`),
    ],
    steps: [`Convert the factors: ${first} × ${second} = ${formatTerminatingDecimal(factor)}`, `${formatTerminatingDecimal(factor)} × ${quantity} = ${formatTerminatingDecimal(answer)}`],
    complexity: first.includes(".") || second.includes(".") ? 6 : 5,
    payloadParts: [first, second, String(quantity)],
  };
}

function missingDecimalOperand(rng: Rng): Draft {
  const known = rng.pick(DECIMALS);
  const missing = rng.pick(DECIMALS);
  const K = literal(known); const X = literal(missing);
  const variant = rng.int(0, 2);
  if (variant === 0) {
    const result = add(K, X);
    return {
      stem: `Find the value of □: ${known} + □ = ${formatTerminatingDecimal(result)}.`,
      answerRat: X,
      verifierRat: independentSubtract(result, K),
      wrongRats: [
        wrong(add(result, K), "INVERSE_ADDITION_USED", "The known addend was added to the result instead of subtracted."),
        wrong(subtract(K, result), "SUBTRACTION_ORDER_REVERSED", "The subtraction order was reversed while isolating the blank."),
      ],
      steps: [`□ = ${formatTerminatingDecimal(result)} − ${known}`, `□ = ${missing}; check: ${known} + ${missing} = ${formatTerminatingDecimal(result)}`],
      complexity: 4,
      payloadParts: [known, missing, "add"],
    };
  }
  if (variant === 1) {
    const result = subtract(K, X);
    return {
      stem: `Find the value of □: ${known} − □ = ${formatTerminatingDecimal(result)}.`,
      answerRat: X,
      verifierRat: independentSubtract(K, result),
      wrongRats: [
        wrong(subtract(result, K), "SUBTRACTION_ORDER_REVERSED", "The known minuend and result were subtracted in the reverse order."),
        wrong(add(K, result), "INVERSE_OPERATION_REPLACED_BY_ADDITION", "The two visible values were added instead of using minuend minus result."),
      ],
      steps: [`□ = ${known} − ${formatTerminatingDecimal(result)}`, `□ = ${missing}; check: ${known} − ${missing} = ${formatTerminatingDecimal(result)}`],
      complexity: 5,
      payloadParts: [known, missing, "subtract"],
    };
  }
  const result = multiply(K, X);
  if (!isTerminating(result)) return missingDecimalOperand(rng);
  return {
    stem: `Find the value of □: ${known} × □ = ${formatTerminatingDecimal(result)}.`,
    answerRat: X,
    verifierRat: independentDivide(result, K),
    wrongRats: [
      wrong(multiply(result, K), "INVERSE_MULTIPLICATION_USED", "The result was multiplied by the known factor instead of divided by it."),
      wrong(divide(K, result), "DIVISION_ORDER_REVERSED", "The known factor was divided by the product."),
    ],
    steps: [`□ = ${formatTerminatingDecimal(result)} ÷ ${known}`, `□ = ${missing}; check: ${known} × ${missing} = ${formatTerminatingDecimal(result)}`],
    complexity: 5,
    payloadParts: [known, missing, "multiply"],
  };
}

function missingPercentageLiteral(rng: Rng): Draft {
  const percent = rng.pick(PERCENTS);
  const base = rng.pick(["0.5", "1.25", "2.5", "3.75", "5", "7.5", "10"] as const);
  const quantity = rng.int(2, 80) * 8;
  const P = literal(percent); const A = literal(base); const Q = rat(BigInt(quantity));
  const contribution = multiply(P, Q);
  const result = add(A, contribution);
  const verifier = independentDivide(independentSubtract(result, A), Q);
  return {
    stem: `Find the percentage represented by □: ${base} + □% of ${quantity} = ${formatTerminatingDecimal(result)}.`,
    answerRat: P,
    verifierRat: verifier,
    wrongRats: [
      wrong(independentSubtract(result, A), "PERCENT_CONTRIBUTION_NOT_SCALED", "The isolated contribution was reported directly as a percentage without dividing by the quantity."),
      wrong(independentDivide(independentAdd(result, A), Q), "KNOWN_TERM_ADDED_INSTEAD_OF_SUBTRACTED", `The known term ${base} was added to the result instead of subtracted.`),
    ],
    steps: [`□% of ${quantity} = ${formatTerminatingDecimal(result)} − ${base} = ${formatTerminatingDecimal(contribution)}`, `□% = ${formatTerminatingDecimal(contribution)} ÷ ${quantity} = ${formatRat(P)} = ${percent}`, `Check: ${base} + ${percent} of ${quantity} = ${formatTerminatingDecimal(result)}`],
    complexity: 6,
    payloadParts: [base, percent, String(quantity)],
  };
}

function compareRepresentations(rng: Rng): Draft {
  const benchmark = rng.pick(BENCHMARKS);
  const multiplier = rng.int(2, 80) * 8;
  const M = rat(BigInt(multiplier));
  const A = multiply(literal(benchmark.fraction), M);
  const relation = rng.int(0, 2);
  const delta = literal(rng.pick(["0.1", "0.2", "0.25", "0.5"] as const));
  const baseB = multiply(literal(benchmark.decimal), M);
  const B = relation === 0 ? baseB : relation === 1 ? subtract(baseB, delta) : add(baseB, delta);
  const symbol = compareRat(A, B) > 0 ? "A > B" : compareRat(A, B) < 0 ? "A < B" : "A = B";
  return {
    stem: `A = ${benchmark.fraction} × ${multiplier}; B = ${benchmark.percent} of ${multiplier}${relation === 0 ? "" : relation === 1 ? ` − ${formatTerminatingDecimal(delta)}` : ` + ${formatTerminatingDecimal(delta)}`}. Which relation is correct?`,
    answerText: symbol,
    verifierText: compareRat(A, B) > 0 ? "A > B" : compareRat(A, B) < 0 ? "A < B" : "A = B",
    wrongTexts: [
      { value: "A > B", misconceptionId: "RELATION_GREATER_SELECTED", analysis: "This relation does not match the sign of the exact difference A − B." },
      { value: "A < B", misconceptionId: "RELATION_LESS_SELECTED", analysis: "This relation does not match the sign of the exact difference A − B." },
      { value: "A = B", misconceptionId: "RELATION_EQUAL_SELECTED", analysis: "The two exact values are not equal in this case." },
      { value: "Cannot be determined", misconceptionId: "EXACT_REPRESENTATIONS_TREATED_AS_INCOMPARABLE", analysis: "All displayed values are exact, so the relation can be determined." },
    ].filter((option) => option.value !== symbol),
    steps: [`A = ${formatTerminatingDecimal(A)}`, `B = ${formatTerminatingDecimal(B)}`, `Therefore, ${symbol}`],
    complexity: relation === 0 ? 5 : 6,
    payloadParts: [benchmark.fraction, benchmark.percent, String(multiplier), String(relation), formatTerminatingDecimal(delta)],
  };
}

function selectDecimalPlacement(rng: Rng): Draft {
  const leftPlaces = rng.int(1, 3);
  const rightPlaces = rng.int(1, 2);
  const leftInteger = rng.int(11, 999);
  const rightInteger = rng.int(11, 199);
  const left = decimalFromScaled(leftInteger, leftPlaces);
  const right = decimalFromScaled(rightInteger, rightPlaces);
  const productInteger = leftInteger * rightInteger;
  const answer = rat(BigInt(productInteger), pow10(leftPlaces + rightPlaces));
  return {
    stem: `Which option is the correct value of ${left} × ${right}?`,
    answerRat: answer,
    verifierRat: multiply(literal(left), literal(right)),
    wrongRats: [
      wrong(rat(BigInt(productInteger), pow10(Math.max(0, leftPlaces + rightPlaces - 1))), "DECIMAL_ONE_PLACE_RIGHT", "The product was written with one fewer decimal place than the factors require."),
      wrong(rat(BigInt(productInteger), pow10(leftPlaces + rightPlaces + 1)), "DECIMAL_ONE_PLACE_LEFT", "The product was written with one extra decimal place."),
      wrong(rat(BigInt(productInteger), pow10(leftPlaces)), "ONLY_FIRST_FACTOR_SCALE_COUNTED", "Only the decimal places in the first factor were counted."),
      wrong(rat(BigInt(productInteger), pow10(rightPlaces)), "ONLY_SECOND_FACTOR_SCALE_COUNTED", "Only the decimal places in the second factor were counted."),
    ],
    steps: [`${leftInteger} × ${rightInteger} = ${productInteger}`, `The two factors contain ${leftPlaces + rightPlaces} decimal places in total, so the correct option is ${formatTerminatingDecimal(answer)}`],
    complexity: leftPlaces + rightPlaces >= 4 ? 5 : 3,
    payloadParts: [left, right, String(productInteger), String(leftPlaces + rightPlaces)],
  };
}

function diagnosis(rng: Rng): Draft {
  const first = rng.pick(BENCHMARKS);
  const second = rng.pick(BENCHMARKS);
  const A = literal(first.decimal);
  const B = literal(second.percent);
  const exact = add(A, B);
  const correctFraction = formatRat(exact);
  const correctDecimal = isTerminating(exact) ? formatTerminatingDecimal(exact) : formatRat(exact);
  const errorPosition = rng.int(0, 3);
  let step1 = `${first.fraction} + ${second.fraction}`;
  let step2 = correctFraction;
  let step3 = correctDecimal;
  let answer = "No error";
  if (errorPosition === 0) {
    const shifted = multiply(A, rat(10n));
    step1 = `${formatRat(shifted)} + ${second.fraction}`;
    const wrongSum = add(shifted, literal(second.fraction));
    step2 = formatRat(wrongSum);
    step3 = isTerminating(wrongSum) ? formatTerminatingDecimal(wrongSum) : formatRat(wrongSum);
    answer = "Step 1";
  } else if (errorPosition === 1) {
    const wrongSum = rat(A.n + B.n, A.d + B.d);
    step2 = formatRat(wrongSum);
    step3 = isTerminating(wrongSum) ? formatTerminatingDecimal(wrongSum) : formatRat(wrongSum);
    answer = "Step 2";
  } else if (errorPosition === 2) {
    step3 = isTerminating(exact) ? formatTerminatingDecimal(multiply(exact, rat(10n))) : formatRat(add(exact, rat(1n)));
    answer = "Step 3";
  }
  return {
    stem: `A student evaluates ${first.decimal} + ${second.percent}.\nStep 1: ${first.decimal} + ${second.percent} = ${step1}\nStep 2: ${step1} = ${step2}\nStep 3: ${step2} = ${step3}\nWhich is the first incorrect step?`,
    answerText: answer,
    verifierText: errorPosition === 0 ? "Step 1" : errorPosition === 1 ? "Step 2" : errorPosition === 2 ? "Step 3" : "No error",
    wrongTexts: [
      { value: "Step 1", misconceptionId: "STEP1_SELECTED", analysis: "Step 1 is exact unless it is the first value-changing conversion." },
      { value: "Step 2", misconceptionId: "STEP2_SELECTED", analysis: "Step 2 is exact unless it is the first value-changing combination." },
      { value: "Step 3", misconceptionId: "STEP3_SELECTED", analysis: "Step 3 is exact unless its final representation changes the value." },
      { value: "No error", misconceptionId: "NO_ERROR_SELECTED", analysis: "No error is valid only when every consecutive line has the same exact value." },
    ].filter((option) => option.value !== answer),
    steps: answer === "No error"
      ? [`${first.decimal} = ${first.fraction} and ${second.percent} = ${second.fraction}`, `Every displayed line equals ${correctFraction}, so there is no error`]
      : [`The original exact value is ${correctFraction}`, `${answer} is the first line that changes this exact value`],
    complexity: 7,
    payloadParts: [first.decimal, second.percent, String(errorPosition), step1, step2, step3],
  };
}

function buildDraft(prototypeId: SapCp003PrototypeId, seed: number): Draft {
  const rng = new Rng(hash32(`${prototypeId}|${seed}|SAP_CP003_DISCOVERY_V1`));
  switch (prototypeId) {
    case "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION": return decimalExpression(rng);
    case "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION": return decimalFractionMixed(rng);
    case "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE": return decimalProduct(rng);
    case "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN": return divideByPowerOfTen(rng);
    case "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR": return divideByCompatibleFactor(rng);
    case "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR": return percentageFactor(rng);
    case "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION": return percentOfInside(rng);
    case "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL": return mixedPercentFractionDecimal(rng);
    case "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS": return convertTermsToFractions(rng);
    case "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS": return convertTermsToDecimals(rng);
    case "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE": return knownEquivalence(rng);
    case "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION": return recurringInside(rng);
    case "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION": return complementaryPercentages(rng);
    case "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS": return successivePercentFactors(rng);
    case "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND": return missingDecimalOperand(rng);
    case "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL": return missingPercentageLiteral(rng);
    case "SAP-CP003-PROT-COMPARE-FRACTION-DECIMAL-PERCENT": return compareRepresentations(rng);
    case "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT": return selectDecimalPlacement(rng);
    case "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP": return diagnosis(rng);
  }
}

function validatePackage(
  prototypeId: SapCp003PrototypeId,
  answer: string,
  verifier: string,
  options: readonly SapCp003Option[],
  correctIndex: number,
  explanation: SapCp003Explanation,
  lifecycle: SapCp003Package["lifecycle"],
): SapCp003Validation {
  const errors: string[] = [];
  const answerRat = parseNumericLiteral(answer);
  const verifierRat = parseNumericLiteral(verifier);
  const exactAgreementPassed = answerRat && verifierRat
    ? equalRat(answerRat, verifierRat)
    : answer === verifier;
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = options.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = options[correctIndex]?.isCorrect === true && options[correctIndex]?.value === answer;
  const surface = [answer, verifier, ...options.map((option) => option.value), explanation.coreConcept, ...explanation.steps, explanation.finalAnswer].join(" ");
  const surfaceSyntaxPassed = !/undefined|NaN|Evaluate\s+\*|\?\s*\./i.test(surface)
    && !/(^|[\s(=:+,])-(?=\d)/.test(surface);
  const explanationCompletenessPassed = explanation.steps.length >= 2 && explanation.finalAnswer.includes(answer);
  const lifecyclePassed = lifecycle.permanentQlId === null
    && lifecycle.active === false
    && lifecycle.questionStudioDiscoverable === false
    && lifecycle.questionBankWritable === false
    && lifecycle.testEligible === false
    && lifecycle.publiclyPublishable === false;
  if (!exactAgreementPassed) errors.push("Canonical and independent answers disagree.");
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");
  if (!surfaceSyntaxPassed) errors.push("Student-facing text contains a malformed token or sign.");
  if (!explanationCompletenessPassed) errors.push("The explanation is incomplete.");
  if (!lifecyclePassed) errors.push("The executable-discovery lifecycle is not safely inactive.");
  if (!SAP_CP003_AUTHORITY_BY_ID[prototypeId]) errors.push("Prototype authority is missing.");
  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors),
    exactAgreementPassed: Boolean(exactAgreementPassed),
    optionUniquenessPassed,
    singleCorrectOptionPassed,
    answerBindingPassed,
    surfaceSyntaxPassed,
    explanationCompletenessPassed,
    lifecyclePassed,
  });
}

export function generateSapCp003Package(prototypeId: SapCp003PrototypeId, seed: number): SapCp003Package {
  if (!Number.isSafeInteger(seed) || seed <= 0) throw new Error("SAP-CP-003 seed must be a positive safe integer.");
  const authority = SAP_CP003_AUTHORITY_BY_ID[prototypeId];
  const draft = buildDraft(prototypeId, seed);
  let answer: string;
  let verifier: string;
  let wrongs: readonly WrongText[];
  if (draft.answerRat && draft.verifierRat) {
    const numeric = finalizeNumericDraft(authority.answerSemantic, draft);
    answer = numeric.answer;
    verifier = numeric.verifier;
    wrongs = numeric.wrongs;
  } else {
    if (!draft.answerText || !draft.verifierText || !draft.wrongTexts || draft.wrongTexts.length < 3) {
      throw new Error(`${prototypeId}/${seed}: incomplete text-answer draft.`);
    }
    answer = draft.answerText;
    verifier = draft.verifierText;
    wrongs = Object.freeze(draft.wrongTexts.slice(0, 3));
  }
  const options = orderOptions(prototypeId, seed, answer, wrongs);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const explanation: SapCp003Explanation = Object.freeze({
    coreConcept: ensureSentence(authority.solveAuthority),
    steps: Object.freeze(draft.steps.map((step) => ensureSentence(step))),
    finalAnswer: ensureSentence(`Therefore, the answer is ${answer}`),
  });
  const lifecycle = Object.freeze({
    status: "EXECUTABLE_DISCOVERY_HUMAN_REVIEW_PENDING" as const,
    permanentQlId: null,
    active: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
    publiclyPublishable: false as const,
  });
  const canonicalPayloadKey = [
    "SAP_CP003_CANONICAL_V1",
    prototypeId,
    ...draft.payloadParts.map(normalizePayload),
    authority.answerSemantic,
  ].join("|");
  const generationIdentity = [
    "SAP_CP003_DISCOVERY_V1",
    "SAP-001",
    "SAP-CP-003",
    prototypeId,
    String(seed),
    "EN_IN",
  ].join("|");
  const validation = validatePackage(prototypeId, answer, verifier, options, correctIndex, explanation, lifecycle);
  return Object.freeze({
    packageId: "SAP-001",
    checkpointId: "SAP-CP-003",
    prototypeId,
    solveMode: authority.solveMode,
    seed,
    taskDirection: authority.taskDirection,
    answerSemantic: authority.answerSemantic,
    difficulty: difficulty(draft.complexity),
    difficultyScore: draft.complexity,
    stem: normalizeStudentMath(draft.stem).replace(/ Step /g, "\nStep "),
    options,
    correctIndex,
    canonicalAnswer: answer,
    verifierAnswer: verifier,
    explanation,
    canonicalPayloadKey,
    generationIdentity,
    validation,
    lifecycle,
  });
}

export function generateSapCp003Sweep(seedsPerPrototype: number): readonly SapCp003Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-003 sweep size must be a positive integer.");
  }
  const packages: SapCp003Package[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export const SAP_CP003_RUNTIME_STATE = Object.freeze({
  packageId: "SAP-001" as const,
  checkpointId: "SAP-CP-003" as const,
  prototypeCount: SAP_CP003_PROTOTYPE_IDS.length,
  solveModeCount: SAP_CP003_PROTOTYPE_AUTHORITIES.length,
  permanentQlId: null,
  nextAvailableQlId: "SAP-QL-034" as const,
  status: "EXECUTABLE_DISCOVERY_HUMAN_REVIEW_PENDING" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});
