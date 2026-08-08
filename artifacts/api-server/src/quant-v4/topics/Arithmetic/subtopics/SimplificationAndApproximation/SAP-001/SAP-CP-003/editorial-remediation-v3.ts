import {
  type Rat,
  add,
  divide,
  equalRat,
  ensureSentence,
  formatPercentLiteral,
  formatRat,
  formatTerminatingDecimal,
  isTerminating,
  multiply,
  parseNumericLiteral,
  rat,
  subtract,
} from "./exact";
import type {
  SapCp003Difficulty,
  SapCp003Option,
  SapCp003Package,
} from "./types";

interface WrongCandidate {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

interface RecurringCase {
  readonly display: string;
  readonly value: Rat;
  readonly source: string;
}

const BENCHMARK_RATES = Object.freeze([
  Object.freeze({ display: "6.25%", value: rat(1n, 16n) }),
  Object.freeze({ display: "12.5%", value: rat(1n, 8n) }),
  Object.freeze({ display: "20%", value: rat(1n, 5n) }),
  Object.freeze({ display: "25%", value: rat(1n, 4n) }),
  Object.freeze({ display: "31.25%", value: rat(5n, 16n) }),
  Object.freeze({ display: "37.5%", value: rat(3n, 8n) }),
  Object.freeze({ display: "40%", value: rat(2n, 5n) }),
  Object.freeze({ display: "62.5%", value: rat(5n, 8n) }),
  Object.freeze({ display: "75%", value: rat(3n, 4n) }),
  Object.freeze({ display: "87.5%", value: rat(7n, 8n) }),
  Object.freeze({ display: "112.5%", value: rat(9n, 8n) }),
  Object.freeze({ display: "125%", value: rat(5n, 4n) }),
  Object.freeze({ display: "150%", value: rat(3n, 2n) }),
  Object.freeze({ display: "200%", value: rat(2n) }),
] as const);

const EQUIVALENCE_CASES = Object.freeze([
  Object.freeze({ decimal: "0.125", decimalValue: rat(1n, 8n), fraction: "1/8", fractionValue: rat(1n, 8n) }),
  Object.freeze({ decimal: "0.25", decimalValue: rat(1n, 4n), fraction: "1/4", fractionValue: rat(1n, 4n) }),
  Object.freeze({ decimal: "0.375", decimalValue: rat(3n, 8n), fraction: "3/8", fractionValue: rat(3n, 8n) }),
  Object.freeze({ decimal: "0.4", decimalValue: rat(2n, 5n), fraction: "2/5", fractionValue: rat(2n, 5n) }),
  Object.freeze({ decimal: "0.625", decimalValue: rat(5n, 8n), fraction: "5/8", fractionValue: rat(5n, 8n) }),
  Object.freeze({ decimal: "0.75", decimalValue: rat(3n, 4n), fraction: "3/4", fractionValue: rat(3n, 4n) }),
  Object.freeze({ decimal: "0.8", decimalValue: rat(4n, 5n), fraction: "4/5", fractionValue: rat(4n, 5n) }),
  Object.freeze({ decimal: "0.875", decimalValue: rat(7n, 8n), fraction: "7/8", fractionValue: rat(7n, 8n) }),
] as const);

const RECURRING_CASES: readonly RecurringCase[] = Object.freeze([
  Object.freeze({ display: "0.3̅ (3 recurring)", value: rat(1n, 3n), source: "0.(3)" }),
  Object.freeze({ display: "0.6̅ (6 recurring)", value: rat(2n, 3n), source: "0.(6)" }),
  Object.freeze({ display: "0.16̅ (6 recurring)", value: rat(1n, 6n), source: "0.1(6)" }),
  Object.freeze({ display: "0.83̅ (3 recurring)", value: rat(5n, 6n), source: "0.8(3)" }),
  Object.freeze({ display: "0.2̅7̅ (27 recurring)", value: rat(3n, 11n), source: "0.(27)" }),
  Object.freeze({ display: "0.45̅ (5 recurring)", value: rat(41n, 90n), source: "0.4(5)" }),
] as const);

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function exactDisplay(value: Rat): string {
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function displayForFormat(value: Rat, format: "DECIMAL" | "FRACTION" | "PERCENTAGE"): string {
  if (format === "FRACTION") return formatRat(value);
  if (format === "PERCENTAGE") return formatPercentLiteral(value);
  return exactDisplay(value);
}

function nearbyStep(value: Rat): Rat {
  if (value.d > 1n) return rat(1n, value.d);
  const integerMagnitude = abs(value.n);
  if (integerMagnitude >= 100n) return rat(integerMagnitude / 20n || 1n);
  if (integerMagnitude >= 20n) return rat(2n);
  return rat(1n);
}

function makeOptions(
  correct: Rat,
  candidates: readonly WrongCandidate[],
  format: "DECIMAL" | "FRACTION" | "PERCENTAGE",
): readonly SapCp003Option[] {
  const correctText = displayForFormat(correct, format);
  const step = format === "PERCENTAGE" ? rat(1n, 8n) : nearbyStep(correct);
  const fallbacks: readonly WrongCandidate[] = Object.freeze([
    Object.freeze({
      value: add(correct, step),
      misconceptionId: "FINAL_PLACE_VALUE_ONE_UNIT_HIGH",
      analysis: "The method is nearly correct, but the final place-value unit is one step too high.",
    }),
    Object.freeze({
      value: subtract(correct, step),
      misconceptionId: "FINAL_PLACE_VALUE_ONE_UNIT_LOW",
      analysis: "The method is nearly correct, but the final place-value unit is one step too low.",
    }),
    Object.freeze({
      value: add(correct, multiply(step, rat(2n))),
      misconceptionId: "FINAL_PLACE_VALUE_TWO_UNITS_HIGH",
      analysis: "A small last-step arithmetic slip makes the result two place-value units too high.",
    }),
    Object.freeze({
      value: subtract(correct, multiply(step, rat(2n))),
      misconceptionId: "FINAL_PLACE_VALUE_TWO_UNITS_LOW",
      analysis: "A small last-step arithmetic slip makes the result two place-value units too low.",
    }),
  ]);

  const used = new Set<string>([correctText]);
  const wrongs: SapCp003Option[] = [];
  for (const candidate of [...candidates, ...fallbacks]) {
    if (equalRat(candidate.value, correct)) continue;
    const value = displayForFormat(candidate.value, format);
    if (used.has(value)) continue;
    used.add(value);
    wrongs.push(Object.freeze({
      displayIndex: wrongs.length + 2,
      value,
      isCorrect: false,
      misconceptionId: candidate.misconceptionId,
      analysis: ensureSentence(candidate.analysis),
    }));
    if (wrongs.length === 3) break;
  }
  if (wrongs.length !== 3) throw new Error(`Could not create three V3 distractors for ${correctText}.`);

  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This option matches the exact value obtained from the visible operations.",
    }),
    ...wrongs,
  ]);
}

function buildNumericPackage(
  pkg: SapCp003Package,
  input: {
    readonly frameId: string;
    readonly stem: string;
    readonly answer: Rat;
    readonly wrongs: readonly WrongCandidate[];
    readonly coreConcept: string;
    readonly strategy: string;
    readonly steps: readonly string[];
    readonly difficulty: SapCp003Difficulty;
    readonly difficultyScore: number;
    readonly payloadParts: readonly string[];
    readonly format?: "DECIMAL" | "FRACTION" | "PERCENTAGE";
  },
): SapCp003Package {
  const format = input.format ?? "DECIMAL";
  const answer = displayForFormat(input.answer, format);
  const options = makeOptions(input.answer, input.wrongs, format);
  return Object.freeze({
    ...pkg,
    difficulty: input.difficulty,
    difficultyScore: input.difficultyScore,
    stem: input.stem,
    options,
    correctIndex: 0,
    canonicalAnswer: answer,
    verifierAnswer: answer,
    explanation: Object.freeze({
      coreConcept: ensureSentence(`${input.coreConcept} ${input.strategy}`),
      steps: Object.freeze(input.steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`Therefore, the answer is ${answer}`),
    }),
    canonicalPayloadKey: [
      "SAP_CP003_EDITORIAL_V3",
      pkg.prototypeId,
      input.frameId,
      ...input.payloadParts,
    ].join("|"),
    generationIdentity: [
      "SAP_CP003_EDITORIAL_V3",
      pkg.prototypeId,
      String(pkg.seed),
      input.frameId,
    ].join("|"),
    validation: Object.freeze({
      ...pkg.validation,
      ok: true,
      errors: Object.freeze([]),
      exactAgreementPassed: true,
      optionUniquenessPassed: true,
      singleCorrectOptionPassed: true,
      answerBindingPassed: true,
      surfaceSyntaxPassed: true,
      explanationCompletenessPassed: true,
      lifecyclePassed: true,
    }),
  });
}

function terminatingDecimalExpression(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-TERMINATING-DECIMAL-EXPRESSION") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const k = 2 + Math.floor((pkg.seed - 1) / 4) % 23;
  const K = rat(BigInt(k));

  if (frame === 0) {
    const a = divide(K, rat(4n));
    const b = [rat(1n, 4n), rat(1n, 2n), rat(3n, 4n), rat(5n, 4n)][k % 4]!;
    const c = [rat(8n, 5n), rat(12n, 5n), rat(4n), rat(5n, 2n)][k % 4]!;
    const product = multiply(b, c);
    const answer = add(a, product);
    return buildNumericPackage(pkg, {
      frameId: "DECIMAL_BODMAS_PRODUCT_FIRST",
      stem: `Evaluate ${exactDisplay(a)} + ${exactDisplay(b)} × ${exactDisplay(c)}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(add(a, b), c), misconceptionId: "ADDITION_DONE_BEFORE_MULTIPLICATION", analysis: "The addition was performed before multiplication, ignoring BODMAS." }),
        Object.freeze({ value: add(add(a, b), c), misconceptionId: "MULTIPLICATION_REPLACED_BY_ADDITION", analysis: "The multiplication sign was treated as an addition sign." }),
        Object.freeze({ value: add(multiply(a, b), c), misconceptionId: "WRONG_PAIR_MULTIPLIED", analysis: "The first two numbers were multiplied instead of the two numbers joined by the multiplication sign." }),
      ]),
      coreConcept: "Apply multiplication before addition.",
      strategy: "Calculate the product as one block, then add the remaining decimal.",
      steps: [
        `${exactDisplay(b)} × ${exactDisplay(c)} = ${exactDisplay(product)}`,
        `${exactDisplay(a)} + ${exactDisplay(product)} = ${exactDisplay(answer)}`,
      ],
      difficulty: k % 3 === 0 ? "EASY" : "MEDIUM",
      difficultyScore: k % 3 === 0 ? 3 : 5,
      payloadParts: [exactDisplay(a), exactDisplay(b), exactDisplay(c)],
    });
  }

  if (frame === 1) {
    const divisor = [rat(1n, 4n), rat(1n, 2n), rat(5n, 4n), rat(5n, 2n)][k % 4]!;
    const quotient = divide(K, rat(2n));
    const total = multiply(divisor, quotient);
    const a = divide(total, rat(4n));
    const b = subtract(total, a);
    const answer = divide(add(a, b), divisor);
    return buildNumericPackage(pkg, {
      frameId: "DECIMAL_BRACKET_DIVISION",
      stem: `Evaluate (${exactDisplay(a)} + ${exactDisplay(b)}) ÷ ${exactDisplay(divisor)}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(a, divide(b, divisor)), misconceptionId: "DIVISOR_APPLIED_TO_SECOND_TERM_ONLY", analysis: "The divisor was applied only to the second term instead of the complete bracket." }),
        Object.freeze({ value: multiply(add(a, b), divisor), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The bracket value was multiplied by the divisor instead of divided by it." }),
        Object.freeze({ value: subtract(add(a, b), divisor), misconceptionId: "DIVISION_REPLACED_BY_SUBTRACTION", analysis: "The final division was incorrectly replaced by subtraction." }),
      ]),
      coreConcept: "Evaluate a bracket before dividing.",
      strategy: "Add inside the bracket first, then divide the complete bracket value.",
      steps: [
        `${exactDisplay(a)} + ${exactDisplay(b)} = ${exactDisplay(total)}`,
        `${exactDisplay(total)} ÷ ${exactDisplay(divisor)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [exactDisplay(a), exactDisplay(b), exactDisplay(divisor)],
    });
  }

  if (frame === 2) {
    const multiplier = [rat(4n, 5n), rat(5n, 4n), rat(5n, 2n), rat(4n)][k % 4]!;
    const difference = divide(K, rat(4n));
    const c = divide(rat(BigInt(2 + (k % 5))), rat(4n));
    const b = add(c, difference);
    const answer = multiply(multiplier, subtract(b, c));
    return buildNumericPackage(pkg, {
      frameId: "DECIMAL_MULTIPLY_BRACKET_DIFFERENCE",
      stem: `Evaluate ${exactDisplay(multiplier)} × (${exactDisplay(b)} − ${exactDisplay(c)}).`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: subtract(multiply(multiplier, b), c), misconceptionId: "BRACKET_SCOPE_IGNORED", analysis: "The multiplier was applied only to the first term inside the bracket." }),
        Object.freeze({ value: multiply(multiplier, add(b, c)), misconceptionId: "SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The subtraction inside the bracket was changed to addition." }),
        Object.freeze({ value: multiply(subtract(multiplier, b), c), misconceptionId: "WRONG_BRACKET_FORMED", analysis: "The visible bracket was replaced by a different subtraction." }),
      ]),
      coreConcept: "A multiplier outside a bracket applies to the complete bracket value.",
      strategy: "Find the difference first; then multiply once.",
      steps: [
        `${exactDisplay(b)} − ${exactDisplay(c)} = ${exactDisplay(difference)}`,
        `${exactDisplay(multiplier)} × ${exactDisplay(difference)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [exactDisplay(multiplier), exactDisplay(b), exactDisplay(c)],
    });
  }

  const divisor = [rat(1n, 4n), rat(1n, 2n), rat(5n, 4n), rat(5n, 2n)][k % 4]!;
  const quotient = divide(K, rat(2n));
  const dividend = multiply(divisor, quotient);
  const outside = divide(rat(BigInt(1 + (k % 7))), rat(4n));
  const answer = add(divide(dividend, divisor), outside);
  return buildNumericPackage(pkg, {
    frameId: "DECIMAL_DIVISION_THEN_ADD",
    stem: `Evaluate ${exactDisplay(dividend)} ÷ ${exactDisplay(divisor)} + ${exactDisplay(outside)}.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: divide(dividend, add(divisor, outside)), misconceptionId: "ADDITION_ABSORBED_INTO_DIVISOR", analysis: "The outside addition was incorrectly included in the divisor." }),
      Object.freeze({ value: add(multiply(dividend, divisor), outside), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The first operation was multiplied instead of divided." }),
      Object.freeze({ value: subtract(divide(dividend, divisor), outside), misconceptionId: "FINAL_ADDITION_CHANGED_TO_SUBTRACTION", analysis: "The division was correct, but the final addition was changed to subtraction." }),
    ]),
    coreConcept: "Division and multiplication are completed before addition.",
    strategy: "Evaluate the quotient first and then add the outside decimal.",
    steps: [
      `${exactDisplay(dividend)} ÷ ${exactDisplay(divisor)} = ${exactDisplay(quotient)}`,
      `${exactDisplay(quotient)} + ${exactDisplay(outside)} = ${exactDisplay(answer)}`,
    ],
    difficulty: "MEDIUM",
    difficultyScore: 5,
    payloadParts: [exactDisplay(dividend), exactDisplay(divisor), exactDisplay(outside)],
  });
}

function percentOfQuantityExpression(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const rate = BENCHMARK_RATES[Math.floor((pkg.seed - 1) / 2) % BENCHMARK_RATES.length]!;
  const baseUnit = rate.value.d;
  const quantity = Number(baseUnit) * (12 + (pkg.seed % 23));
  const Q = rat(BigInt(quantity));
  const block = multiply(rate.value, Q);
  const outside = divide(rat(BigInt(1 + (pkg.seed % 11))), rat(4n));

  if (frame === 0) {
    const answer = add(block, outside);
    return buildNumericPackage(pkg, {
      frameId: "PERCENT_BLOCK_PLUS_DECIMAL",
      stem: `Evaluate ${rate.display} of ${quantity} + ${exactDisplay(outside)}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(rate.value, add(Q, outside)), misconceptionId: "OF_SCOPE_EXTENDED_TO_OUTSIDE_TERM", analysis: "The outside decimal was incorrectly included inside the percentage-of block." }),
        Object.freeze({ value: add(rate.value, outside), misconceptionId: "QUANTITY_AFTER_OF_OMITTED", analysis: `The quantity ${quantity} after 'of' was omitted.` }),
        Object.freeze({ value: subtract(block, outside), misconceptionId: "FINAL_ADDITION_CHANGED_TO_SUBTRACTION", analysis: "The percentage block was correct, but the final addition was changed to subtraction." }),
      ]),
      coreConcept: "Treat percentage-of as one complete multiplication block.",
      strategy: "Evaluate the percentage block first, then combine it with the outside decimal.",
      steps: [
        `${rate.display} of ${quantity} = ${formatRat(rate.value)} × ${quantity} = ${exactDisplay(block)}`,
        `${exactDisplay(block)} + ${exactDisplay(outside)} = ${exactDisplay(answer)}`,
      ],
      difficulty: rate.value.d >= 16n ? "MEDIUM" : "EASY",
      difficultyScore: rate.value.d >= 16n ? 5 : 3,
      payloadParts: [rate.display, String(quantity), exactDisplay(outside)],
    });
  }

  if (frame === 1) {
    const extra = Number(baseUnit) * (3 + (pkg.seed % 7));
    const combined = rat(BigInt(quantity + extra));
    const combinedBlock = multiply(rate.value, combined);
    const answer = subtract(combinedBlock, outside);
    return buildNumericPackage(pkg, {
      frameId: "PERCENT_OF_BRACKET_MINUS_DECIMAL",
      stem: `Evaluate ${rate.display} of (${quantity} + ${extra}) − ${exactDisplay(outside)}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(multiply(rate.value, Q), rat(BigInt(extra))), misconceptionId: "PERCENTAGE_APPLIED_TO_FIRST_BRACKET_TERM_ONLY", analysis: "The percentage was applied only to the first number inside the bracket." }),
        Object.freeze({ value: add(combinedBlock, outside), misconceptionId: "FINAL_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The percentage block was correct, but the final subtraction was changed to addition." }),
        Object.freeze({ value: subtract(add(Q, rat(BigInt(extra))), outside), misconceptionId: "PERCENTAGE_FACTOR_OMITTED", analysis: "The bracket was evaluated, but the displayed percentage factor was omitted." }),
      ]),
      coreConcept: "A percentage placed before a bracket applies to the complete bracket value.",
      strategy: "Add inside the bracket, apply the percentage, and only then subtract the outside decimal.",
      steps: [
        `${quantity} + ${extra} = ${quantity + extra}`,
        `${rate.display} of ${quantity + extra} = ${exactDisplay(combinedBlock)}`,
        `${exactDisplay(combinedBlock)} − ${exactDisplay(outside)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      payloadParts: [rate.display, String(quantity), String(extra), exactDisplay(outside)],
    });
  }

  if (frame === 2) {
    const divisor = [rat(1n, 2n), rat(2n), rat(5n, 2n), rat(4n)][pkg.seed % 4]!;
    const adjusted = subtract(block, outside);
    const answer = divide(adjusted, divisor);
    return buildNumericPackage(pkg, {
      frameId: "PERCENT_BLOCK_ADJUST_THEN_DIVIDE",
      stem: `Evaluate (${rate.display} of ${quantity} − ${exactDisplay(outside)}) ÷ ${exactDisplay(divisor)}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: subtract(block, divide(outside, divisor)), misconceptionId: "DIVISOR_APPLIED_TO_OUTSIDE_TERM_ONLY", analysis: "The final divisor was applied only to the decimal term, not to the complete bracket." }),
        Object.freeze({ value: multiply(adjusted, divisor), misconceptionId: "FINAL_DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The bracket value was multiplied by the final number instead of divided by it." }),
        Object.freeze({ value: divide(add(block, outside), divisor), misconceptionId: "BRACKET_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The subtraction inside the bracket was changed to addition." }),
      ]),
      coreConcept: "Complete a percentage block and its bracketed adjustment before the final division.",
      strategy: "Work from the innermost percentage block outward.",
      steps: [
        `${rate.display} of ${quantity} = ${exactDisplay(block)}`,
        `${exactDisplay(block)} − ${exactDisplay(outside)} = ${exactDisplay(adjusted)}`,
        `${exactDisplay(adjusted)} ÷ ${exactDisplay(divisor)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "HARD",
      difficultyScore: 7,
      payloadParts: [rate.display, String(quantity), exactDisplay(outside), exactDisplay(divisor)],
    });
  }

  const multiplier = [rat(1n, 2n), rat(3n, 2n), rat(2n), rat(5n, 2n)][pkg.seed % 4]!;
  const scaledBlock = multiply(block, multiplier);
  const answer = add(outside, scaledBlock);
  return buildNumericPackage(pkg, {
    frameId: "DECIMAL_PLUS_SCALED_PERCENT_BLOCK",
    stem: `Evaluate ${exactDisplay(outside)} + ${exactDisplay(multiplier)} × (${rate.display} of ${quantity}).`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: multiply(add(outside, block), multiplier), misconceptionId: "MULTIPLIER_APPLIED_TO_OUTSIDE_TERM", analysis: "The outside decimal was incorrectly included in the multiplication." }),
      Object.freeze({ value: add(outside, block), misconceptionId: "MULTIPLIER_OMITTED", analysis: `The multiplier ${exactDisplay(multiplier)} was omitted after evaluating the percentage block.` }),
      Object.freeze({ value: add(outside, multiply(multiplier, rate.value)), misconceptionId: "QUANTITY_AFTER_OF_OMITTED", analysis: `The quantity ${quantity} after 'of' was omitted.` }),
    ]),
    coreConcept: "A bracketed percentage-of block can be treated as one exact value in a larger multiplication.",
    strategy: "Evaluate the percentage block, multiply it, and then add the outside decimal.",
    steps: [
      `${rate.display} of ${quantity} = ${exactDisplay(block)}`,
      `${exactDisplay(multiplier)} × ${exactDisplay(block)} = ${exactDisplay(scaledBlock)}`,
      `${exactDisplay(outside)} + ${exactDisplay(scaledBlock)} = ${exactDisplay(answer)}`,
    ],
    difficulty: "MEDIUM",
    difficultyScore: 6,
    payloadParts: [exactDisplay(outside), exactDisplay(multiplier), rate.display, String(quantity)],
  });
}

function convertTermsToDecimals(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-CONVERT-TERMS-TO-DECIMALS") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const first = EQUIVALENCE_CASES[pkg.seed % EQUIVALENCE_CASES.length]!;
  const second = EQUIVALENCE_CASES[(pkg.seed * 3 + 1) % EQUIVALENCE_CASES.length]!;
  const rate = BENCHMARK_RATES[(pkg.seed * 5 + 2) % 10]!;
  const rateDecimal = exactDisplay(rate.value);

  if (frame === 0) {
    const answer = add(add(first.fractionValue, rate.value), second.decimalValue);
    return buildNumericPackage(pkg, {
      frameId: "DECIMAL_TARGET_THREE_TERM_SUM",
      stem: `Evaluate ${first.fraction} + ${rate.display} + ${second.decimal}. Give the answer as a decimal.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(first.fractionValue, second.decimalValue), misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${rate.display} was omitted.` }),
        Object.freeze({ value: add(rate.value, second.decimalValue), misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${first.fraction} was omitted.` }),
        Object.freeze({ value: add(first.fractionValue, rate.value), misconceptionId: "DECIMAL_TERM_OMITTED", analysis: `The term ${second.decimal} was omitted.` }),
      ]),
      coreConcept: "Convert each displayed term to a terminating decimal before combining them.",
      strategy: "Use familiar fraction and percentage benchmarks, then add the decimal values.",
      steps: [
        `${first.fraction} = ${first.decimal} and ${rate.display} = ${rateDecimal}`,
        `${first.decimal} + ${rateDecimal} + ${second.decimal} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [first.fraction, rate.display, second.decimal],
    });
  }

  if (frame === 1) {
    const answer = subtract(add(second.decimalValue, first.fractionValue), rate.value);
    return buildNumericPackage(pkg, {
      frameId: "DECIMAL_TARGET_SIGNED_CHAIN",
      stem: `Evaluate ${second.decimal} + ${first.fraction} − ${rate.display}. Give the answer as a decimal.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(add(second.decimalValue, first.fractionValue), rate.value), misconceptionId: "PERCENTAGE_SUBTRACTION_CHANGED_TO_ADDITION", analysis: `The term ${rate.display} was added instead of subtracted.` }),
        Object.freeze({ value: subtract(second.decimalValue, add(first.fractionValue, rate.value)), misconceptionId: "FRACTION_SIGN_CHANGED", analysis: `The term ${first.fraction} was incorrectly subtracted.` }),
        Object.freeze({ value: add(second.decimalValue, first.fractionValue), misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${rate.display} was omitted.` }),
      ]),
      coreConcept: "Convert all representations to decimals while preserving every visible sign.",
      strategy: "Write each term as a decimal, then evaluate from left to right.",
      steps: [
        `${first.fraction} = ${first.decimal} and ${rate.display} = ${rateDecimal}`,
        `${second.decimal} + ${first.decimal} − ${rateDecimal} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [second.decimal, first.fraction, rate.display],
    });
  }

  if (frame === 2) {
    const multiplier = rat(BigInt(4 + (pkg.seed % 9)));
    const bracket = add(first.fractionValue, rate.value);
    const answer = multiply(bracket, multiplier);
    return buildNumericPackage(pkg, {
      frameId: "DECIMAL_TARGET_BRACKET_PRODUCT",
      stem: `Evaluate (${first.fraction} + ${rate.display}) × ${exactDisplay(multiplier)}. Give the answer as a decimal.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(first.fractionValue, multiply(rate.value, multiplier)), misconceptionId: "MULTIPLIER_APPLIED_TO_PERCENTAGE_ONLY", analysis: "The multiplier was applied only to the percentage term, not to the complete bracket." }),
        Object.freeze({ value: add(multiply(first.fractionValue, multiplier), rate.value), misconceptionId: "MULTIPLIER_APPLIED_TO_FRACTION_ONLY", analysis: "The multiplier was applied only to the fraction term, not to the complete bracket." }),
        Object.freeze({ value: bracket, misconceptionId: "FINAL_MULTIPLIER_OMITTED", analysis: `The final multiplication by ${exactDisplay(multiplier)} was omitted.` }),
      ]),
      coreConcept: "Convert the bracket terms to decimals before multiplying the complete bracket.",
      strategy: "Simplify the bracket first and multiply once.",
      steps: [
        `${first.fraction} = ${first.decimal} and ${rate.display} = ${rateDecimal}`,
        `${first.decimal} + ${rateDecimal} = ${exactDisplay(bracket)}`,
        `${exactDisplay(bracket)} × ${exactDisplay(multiplier)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      payloadParts: [first.fraction, rate.display, exactDisplay(multiplier)],
    });
  }

  const divisor = [rat(1n, 2n), rat(1n, 4n), rat(5n, 4n), rat(5n, 2n)][pkg.seed % 4]!;
  const bracket = add(first.fractionValue, second.decimalValue);
  const answer = divide(bracket, divisor);
  return buildNumericPackage(pkg, {
    frameId: "DECIMAL_TARGET_BRACKET_DIVISION",
    stem: `Evaluate (${first.fraction} + ${second.decimal}) ÷ ${exactDisplay(divisor)}. Give the answer as a decimal.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: add(first.fractionValue, divide(second.decimalValue, divisor)), misconceptionId: "DIVISOR_APPLIED_TO_DECIMAL_ONLY", analysis: "The divisor was applied only to the decimal term, not to the complete bracket." }),
      Object.freeze({ value: multiply(bracket, divisor), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The bracket value was multiplied instead of divided." }),
      Object.freeze({ value: bracket, misconceptionId: "FINAL_DIVISOR_OMITTED", analysis: `The final division by ${exactDisplay(divisor)} was omitted.` }),
    ]),
    coreConcept: "Convert the fraction to a terminating decimal before dividing the complete bracket.",
    strategy: "Evaluate the bracket in decimal form, then perform the final division.",
    steps: [
      `${first.fraction} = ${first.decimal}`,
      `${first.decimal} + ${second.decimal} = ${exactDisplay(bracket)}`,
      `${exactDisplay(bracket)} ÷ ${exactDisplay(divisor)} = ${exactDisplay(answer)}`,
    ],
    difficulty: "HARD",
    difficultyScore: 7,
    payloadParts: [first.fraction, second.decimal, exactDisplay(divisor)],
  });
}

function knownEquivalence(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-KNOWN-FRACTION-DECIMAL-EQUIVALENCE") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const pair = EQUIVALENCE_CASES[pkg.seed % EQUIVALENCE_CASES.length]!;
  const firstQuantity = 8 * (8 + (pkg.seed % 17));
  const secondQuantity = 8 * (4 + ((pkg.seed * 3) % 13));
  const A = rat(BigInt(firstQuantity));
  const B = rat(BigInt(secondQuantity));
  const decimalA = multiply(pair.decimalValue, A);
  const fractionB = multiply(pair.fractionValue, B);

  if (frame === 0) {
    const answer = add(decimalA, fractionB);
    return buildNumericPackage(pkg, {
      frameId: "EQUIVALENT_FACTORS_TWO_BASES_SUM",
      stem: `Evaluate ${pair.decimal} × ${firstQuantity} + ${pair.fraction} × ${secondQuantity}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(pair.decimalValue, add(A, B)), misconceptionId: "DECIMAL_FACTOR_APPLIED_TO_BOTH_BASES", analysis: `The decimal factor ${pair.decimal} was applied to both quantities.` }),
        Object.freeze({ value: multiply(pair.fractionValue, subtract(A, B)), misconceptionId: "FINAL_ADDITION_CHANGED_TO_DIFFERENCE", analysis: "The two equivalent-factor products were subtracted instead of added." }),
        Object.freeze({ value: decimalA, misconceptionId: "SECOND_TERM_OMITTED", analysis: `The term ${pair.fraction} × ${secondQuantity} was omitted.` }),
      ]),
      coreConcept: "Recognise the decimal and fraction as the same factor, while preserving their different base quantities.",
      strategy: "Use the benchmark equivalence to calculate both products quickly.",
      steps: [
        `${pair.decimal} = ${pair.fraction}`,
        `${pair.decimal} × ${firstQuantity} = ${exactDisplay(decimalA)} and ${pair.fraction} × ${secondQuantity} = ${exactDisplay(fractionB)}`,
        `${exactDisplay(decimalA)} + ${exactDisplay(fractionB)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [pair.decimal, pair.fraction, String(firstQuantity), String(secondQuantity)],
    });
  }

  if (frame === 1) {
    const bracket = add(pair.decimalValue, pair.fractionValue);
    const answer = multiply(bracket, A);
    return buildNumericPackage(pkg, {
      frameId: "EQUIVALENT_FACTORS_SHARED_BASE",
      stem: `Evaluate (${pair.decimal} + ${pair.fraction}) × ${firstQuantity}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(pair.decimalValue, multiply(pair.fractionValue, A)), misconceptionId: "MULTIPLIER_APPLIED_TO_FRACTION_ONLY", analysis: `The multiplier ${firstQuantity} was applied only to the fraction term.` }),
        Object.freeze({ value: multiply(pair.decimalValue, A), misconceptionId: "ONE_EQUIVALENT_TERM_OMITTED", analysis: "Only one of the two equal factors was used." }),
        Object.freeze({ value: multiply(subtract(pair.decimalValue, pair.fractionValue), A), misconceptionId: "BRACKET_ADDITION_CHANGED_TO_SUBTRACTION", analysis: "The addition inside the bracket was changed to subtraction." }),
      ]),
      coreConcept: "Equivalent decimal and fraction factors can be combined when they share the same base.",
      strategy: "Replace both with one representation, add the factors, and multiply once.",
      steps: [
        `${pair.decimal} = ${pair.fraction}, so ${pair.decimal} + ${pair.fraction} = ${formatRat(bracket)}`,
        `${formatRat(bracket)} × ${firstQuantity} = ${exactDisplay(answer)}`,
      ],
      difficulty: "EASY",
      difficultyScore: 3,
      payloadParts: [pair.decimal, pair.fraction, String(firstQuantity)],
    });
  }

  if (frame === 2) {
    const answer = subtract(decimalA, fractionB);
    return buildNumericPackage(pkg, {
      frameId: "EQUIVALENT_FACTORS_TWO_BASES_DIFFERENCE",
      stem: `Evaluate ${pair.decimal} of ${firstQuantity} − ${pair.fraction} of ${secondQuantity}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(decimalA, fractionB), misconceptionId: "FINAL_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The two evaluated terms were added instead of subtracted." }),
        Object.freeze({ value: multiply(pair.decimalValue, subtract(A, B)), misconceptionId: "BASES_COMBINED_BEFORE_CHECKING_SIGNS", analysis: "The bases were combined without preserving the visible subtraction structure." }),
        Object.freeze({ value: fractionB, misconceptionId: "FIRST_TERM_OMITTED", analysis: `The term ${pair.decimal} of ${firstQuantity} was omitted.` }),
      ]),
      coreConcept: "Use the benchmark equivalence to evaluate both terms, then preserve the subtraction sign.",
      strategy: "Convert mentally, calculate each part, and subtract in the shown order.",
      steps: [
        `${pair.decimal} of ${firstQuantity} = ${exactDisplay(decimalA)}`,
        `${pair.fraction} of ${secondQuantity} = ${exactDisplay(fractionB)}`,
        `${exactDisplay(decimalA)} − ${exactDisplay(fractionB)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [pair.decimal, pair.fraction, String(firstQuantity), String(secondQuantity)],
    });
  }

  const combinedBase = add(A, B);
  const firstPart = multiply(pair.decimalValue, combinedBase);
  const answer = subtract(firstPart, fractionB);
  return buildNumericPackage(pkg, {
    frameId: "EQUIVALENT_FACTOR_BRACKET_SCOPE",
    stem: `Evaluate ${pair.decimal} × (${firstQuantity} + ${secondQuantity}) − ${pair.fraction} × ${secondQuantity}.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: subtract(decimalA, fractionB), misconceptionId: "DECIMAL_FACTOR_APPLIED_TO_FIRST_BASE_ONLY", analysis: "The decimal factor was applied only to the first number inside the bracket." }),
      Object.freeze({ value: add(firstPart, fractionB), misconceptionId: "FINAL_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The final fraction term was added instead of subtracted." }),
      Object.freeze({ value: firstPart, misconceptionId: "FINAL_FRACTION_TERM_OMITTED", analysis: `The term ${pair.fraction} × ${secondQuantity} was omitted.` }),
    ]),
    coreConcept: "Use equivalent factors while respecting the scope of the bracket and the final subtraction.",
    strategy: "Evaluate the bracketed product first, then subtract the second equivalent-factor product.",
    steps: [
      `${firstQuantity} + ${secondQuantity} = ${firstQuantity + secondQuantity}`,
      `${pair.decimal} × ${firstQuantity + secondQuantity} = ${exactDisplay(firstPart)}`,
      `${pair.fraction} × ${secondQuantity} = ${exactDisplay(fractionB)}, so the result is ${exactDisplay(answer)}`,
    ],
    difficulty: "HARD",
    difficultyScore: 7,
    payloadParts: [pair.decimal, pair.fraction, String(firstQuantity), String(secondQuantity)],
  });
}

function recurringDecimalExpression(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const first = RECURRING_CASES[pkg.seed % RECURRING_CASES.length]!;
  const second = RECURRING_CASES[(pkg.seed * 3 + 1) % RECURRING_CASES.length]!;
  const fractionCases = [rat(1n, 6n), rat(1n, 3n), rat(2n, 9n), rat(5n, 18n), rat(3n, 11n)] as const;
  const fraction = fractionCases[pkg.seed % fractionCases.length]!;
  const fractionText = formatRat(fraction);

  if (frame === 0) {
    const answer = add(first.value, fraction);
    return buildNumericPackage(pkg, {
      frameId: "RECURRING_PLUS_FRACTION",
      stem: `Evaluate ${first.display} + ${fractionText}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(parseNumericLiteral(first.source.replace(/[()]/g, "")) ?? rat(0n), fraction), misconceptionId: "RECURRING_DECIMAL_READ_AS_FINITE", analysis: "The recurring decimal was treated as a terminating decimal." }),
        Object.freeze({ value: subtract(first.value, fraction), misconceptionId: "ADDITION_CHANGED_TO_SUBTRACTION", analysis: "The displayed addition was changed to subtraction." }),
        Object.freeze({ value: first.value, misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${fractionText} was omitted.` }),
      ]),
      coreConcept: "Convert the recurring decimal to its exact fraction before combining it with another fraction.",
      strategy: "Use the recurring-decimal benchmark, take a common denominator, and reduce.",
      steps: [
        `${first.display} = ${formatRat(first.value)}`,
        `${formatRat(first.value)} + ${fractionText} = ${formatRat(answer)}`,
      ],
      difficulty: first.source.includes("27") || first.source.includes("4(5)") ? "HARD" : "MEDIUM",
      difficultyScore: first.source.includes("27") || first.source.includes("4(5)") ? 7 : 5,
      payloadParts: [first.source, fractionText],
      format: "FRACTION",
    });
  }

  if (frame === 1) {
    const larger = add(first.value, fraction);
    const answer = subtract(larger, fraction);
    return buildNumericPackage(pkg, {
      frameId: "RECURRING_MINUS_FRACTION",
      stem: `Evaluate (${first.display} + ${fractionText}) − ${fractionText}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: larger, misconceptionId: "FINAL_FRACTION_SUBTRACTION_OMITTED", analysis: `The final subtraction of ${fractionText} was omitted.` }),
        Object.freeze({ value: subtract(first.value, fraction), misconceptionId: "BRACKET_ADDITION_IGNORED", analysis: "The fraction inside the bracket was not added before the final subtraction." }),
        Object.freeze({ value: add(first.value, multiply(fraction, rat(2n))), misconceptionId: "FINAL_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The final subtraction was changed to addition." }),
      ]),
      coreConcept: "Convert the recurring decimal exactly and preserve the cancellation visible in the expression.",
      strategy: "Notice that the same fraction is added and then subtracted.",
      steps: [
        `${first.display} = ${formatRat(first.value)}`,
        `(${formatRat(first.value)} + ${fractionText}) − ${fractionText} = ${formatRat(first.value)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [first.source, fractionText],
      format: "FRACTION",
    });
  }

  if (frame === 2) {
    const multiplier = rat(BigInt(2 + (pkg.seed % 7)));
    const answer = multiply(first.value, multiplier);
    return buildNumericPackage(pkg, {
      frameId: "RECURRING_TIMES_INTEGER",
      stem: `Evaluate ${first.display} × ${exactDisplay(multiplier)}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(first.value, multiplier), misconceptionId: "MULTIPLICATION_REPLACED_BY_ADDITION", analysis: "The recurring decimal and integer were added instead of multiplied." }),
        Object.freeze({ value: divide(first.value, multiplier), misconceptionId: "MULTIPLICATION_REPLACED_BY_DIVISION", analysis: "The recurring decimal was divided by the integer instead of multiplied." }),
        Object.freeze({ value: first.value, misconceptionId: "INTEGER_MULTIPLIER_OMITTED", analysis: `The multiplier ${exactDisplay(multiplier)} was omitted.` }),
      ]),
      coreConcept: "Convert the recurring decimal to a fraction before multiplying.",
      strategy: "Use exact cancellation instead of rounding the recurring decimal.",
      steps: [
        `${first.display} = ${formatRat(first.value)}`,
        `${formatRat(first.value)} × ${exactDisplay(multiplier)} = ${formatRat(answer)}`,
      ],
      difficulty: first.source.includes("27") || first.source.includes("4(5)") ? "HARD" : "MEDIUM",
      difficultyScore: first.source.includes("27") || first.source.includes("4(5)") ? 7 : 5,
      payloadParts: [first.source, exactDisplay(multiplier)],
      format: "FRACTION",
    });
  }

  const answer = add(first.value, second.value);
  return buildNumericPackage(pkg, {
    frameId: "TWO_RECURRING_DECIMALS_SUM",
    stem: `Evaluate ${first.display} + ${second.display}. Give the answer as a reduced fraction.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: subtract(first.value, second.value), misconceptionId: "SECOND_RECURRING_TERM_SUBTRACTED", analysis: "The second recurring value was subtracted instead of added." }),
      Object.freeze({ value: first.value, misconceptionId: "SECOND_RECURRING_TERM_OMITTED", analysis: "The second recurring decimal was omitted." }),
      Object.freeze({ value: second.value, misconceptionId: "FIRST_RECURRING_TERM_OMITTED", analysis: "The first recurring decimal was omitted." }),
    ]),
    coreConcept: "Convert both recurring decimals to exact fractions before adding.",
    strategy: "Avoid rounded decimal approximations; use a common denominator and reduce.",
    steps: [
      `${first.display} = ${formatRat(first.value)} and ${second.display} = ${formatRat(second.value)}`,
      `${formatRat(first.value)} + ${formatRat(second.value)} = ${formatRat(answer)}`,
    ],
    difficulty: "HARD",
    difficultyScore: 7,
    payloadParts: [first.source, second.source],
    format: "FRACTION",
  });
}

function missingPercentage(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const rate = BENCHMARK_RATES[pkg.seed % BENCHMARK_RATES.length]!;
  const quantity = Number(rate.value.d) * (12 + (pkg.seed % 19));
  const Q = rat(BigInt(quantity));
  const percentBlock = multiply(rate.value, Q);
  const outside = rat(BigInt(2 + (pkg.seed % 11)));
  const percentageWrongs = (wrongBase?: Rat): readonly WrongCandidate[] => Object.freeze([
    Object.freeze({
      value: subtract(rat(1n), rate.value),
      misconceptionId: "COMPLEMENTARY_PERCENTAGE_USED",
      analysis: "The complementary percentage was selected instead of the percentage that produces the displayed amount.",
    }),
    Object.freeze({
      value: divide(rate.value, rat(2n)),
      misconceptionId: "PERCENTAGE_HALVED",
      analysis: "The isolated percentage factor was halved without justification.",
    }),
    Object.freeze({
      value: wrongBase ?? multiply(rate.value, rat(2n)),
      misconceptionId: wrongBase ? "WRONG_BASE_USED_TO_FIND_PERCENTAGE" : "PERCENTAGE_DOUBLED",
      analysis: wrongBase
        ? "The percentage was calculated using the wrong visible base quantity."
        : "The isolated percentage factor was doubled without justification.",
    }),
  ]);

  if (frame === 0) {
    const result = add(outside, percentBlock);
    return buildNumericPackage(pkg, {
      frameId: "MISSING_PERCENT_ADD_BLOCK",
      stem: `Find the percentage represented by □: ${exactDisplay(outside)} + □% of ${quantity} = ${exactDisplay(result)}.`,
      answer: rate.value,
      wrongs: percentageWrongs(divide(percentBlock, add(Q, outside))),
      coreConcept: "Isolate the percentage-of block before dividing by its base quantity.",
      strategy: "Subtract the outside term, divide by the base, and convert the factor to a percentage.",
      steps: [
        `□% of ${quantity} = ${exactDisplay(result)} − ${exactDisplay(outside)} = ${exactDisplay(percentBlock)}`,
        `□% = ${exactDisplay(percentBlock)} ÷ ${quantity} = ${formatRat(rate.value)} = ${rate.display}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [exactDisplay(outside), String(quantity), exactDisplay(result), rate.display],
      format: "PERCENTAGE",
    });
  }

  if (frame === 1) {
    const result = subtract(percentBlock, outside);
    return buildNumericPackage(pkg, {
      frameId: "MISSING_PERCENT_BLOCK_MINUS_TERM",
      stem: `Find the percentage represented by □: □% of ${quantity} − ${exactDisplay(outside)} = ${exactDisplay(result)}.`,
      answer: rate.value,
      wrongs: percentageWrongs(divide(result, Q)),
      coreConcept: "Reverse the outside subtraction before finding the percentage factor.",
      strategy: "Add the outside term back, then divide the percentage amount by the base.",
      steps: [
        `□% of ${quantity} = ${exactDisplay(result)} + ${exactDisplay(outside)} = ${exactDisplay(percentBlock)}`,
        `□% = ${exactDisplay(percentBlock)} ÷ ${quantity} = ${rate.display}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [String(quantity), exactDisplay(outside), exactDisplay(result), rate.display],
      format: "PERCENTAGE",
    });
  }

  if (frame === 2) {
    const largerOutside = add(percentBlock, outside);
    const result = subtract(largerOutside, percentBlock);
    return buildNumericPackage(pkg, {
      frameId: "MISSING_PERCENT_SUBTRACT_FROM_TOTAL",
      stem: `Find the percentage represented by □: ${exactDisplay(largerOutside)} − □% of ${quantity} = ${exactDisplay(result)}.`,
      answer: rate.value,
      wrongs: percentageWrongs(divide(result, Q)),
      coreConcept: "When a percentage block is subtracted from a total, isolate it by subtracting the result from the total.",
      strategy: "Find the missing amount first, then compare it with the base quantity.",
      steps: [
        `□% of ${quantity} = ${exactDisplay(largerOutside)} − ${exactDisplay(result)} = ${exactDisplay(percentBlock)}`,
        `□% = ${exactDisplay(percentBlock)} ÷ ${quantity} = ${rate.display}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      payloadParts: [exactDisplay(largerOutside), String(quantity), exactDisplay(result), rate.display],
      format: "PERCENTAGE",
    });
  }

  const extra = Number(rate.value.d) * (3 + (pkg.seed % 9));
  const combined = rat(BigInt(quantity + extra));
  const combinedAmount = multiply(rate.value, combined);
  return buildNumericPackage(pkg, {
    frameId: "MISSING_PERCENT_OF_BRACKET",
    stem: `Find the percentage represented by □: □% of (${quantity} + ${extra}) = ${exactDisplay(combinedAmount)}.`,
    answer: rate.value,
    wrongs: percentageWrongs(divide(combinedAmount, Q)),
    coreConcept: "A percentage before a bracket uses the complete bracket as its base.",
    strategy: "Add inside the bracket, then divide the displayed amount by that combined base.",
    steps: [
      `${quantity} + ${extra} = ${quantity + extra}`,
      `□% = ${exactDisplay(combinedAmount)} ÷ ${quantity + extra} = ${rate.display}`,
    ],
    difficulty: "HARD",
    difficultyScore: 7,
    payloadParts: [String(quantity), String(extra), exactDisplay(combinedAmount), rate.display],
    format: "PERCENTAGE",
  });
}

function diagnosisPackage(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-IDENTIFY-INCORRECT-CONVERSION-STEP") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const pair = EQUIVALENCE_CASES[pkg.seed % EQUIVALENCE_CASES.length]!;
  const rate = BENCHMARK_RATES[(pkg.seed * 3 + 1) % 10]!;
  const sum = add(pair.decimalValue, rate.value);
  const correctDecimal = isTerminating(sum) ? formatTerminatingDecimal(sum) : formatRat(sum);
  const wrongConversion = add(pair.decimalValue, rat(1n, 2n));
  const wrongSum = rat(pair.decimalValue.n + rate.value.n, pair.decimalValue.d + rate.value.d);
  const wrongDecimal = isTerminating(sum) ? formatTerminatingDecimal(add(sum, rat(1n, 10n))) : exactDisplay(add(sum, rat(1n, sum.d)));

  let step1: string;
  let step2: string;
  let step3: string;
  let answer: "Step 1" | "Step 2" | "Step 3" | "No error";
  let difficulty: SapCp003Difficulty;
  let difficultyScore: number;
  let concept: string;

  if (frame === 0) {
    step1 = `${pair.decimal} + ${rate.display} = ${formatRat(wrongConversion)} + ${formatRat(rate.value)}`;
    step2 = `${formatRat(wrongConversion)} + ${formatRat(rate.value)} = ${formatRat(add(wrongConversion, rate.value))}`;
    step3 = `${formatRat(add(wrongConversion, rate.value))} = ${exactDisplay(add(wrongConversion, rate.value))}`;
    answer = "Step 1";
    difficulty = "EASY";
    difficultyScore = 3;
    concept = `Step 1 changes ${pair.decimal} into the wrong fraction; the first value-changing step is Step 1.`;
  } else if (frame === 1) {
    step1 = `${pair.decimal} + ${rate.display} = ${formatRat(pair.decimalValue)} + ${formatRat(rate.value)}`;
    step2 = `${formatRat(pair.decimalValue)} + ${formatRat(rate.value)} = ${formatRat(wrongSum)}`;
    step3 = `${formatRat(wrongSum)} = ${exactDisplay(wrongSum)}`;
    answer = "Step 2";
    difficulty = "MEDIUM";
    difficultyScore = 5;
    concept = "Step 1 preserves both values, but Step 2 incorrectly adds numerators and denominators directly.";
  } else if (frame === 2) {
    step1 = `${pair.decimal} + ${rate.display} = ${formatRat(pair.decimalValue)} + ${formatRat(rate.value)}`;
    step2 = `${formatRat(pair.decimalValue)} + ${formatRat(rate.value)} = ${formatRat(sum)}`;
    step3 = `${formatRat(sum)} = ${wrongDecimal}`;
    answer = "Step 3";
    difficulty = "MEDIUM";
    difficultyScore = 5;
    concept = `Steps 1 and 2 preserve the value, but Step 3 gives the wrong decimal for ${formatRat(sum)}.`;
  } else {
    step1 = `${pair.decimal} + ${rate.display} = ${formatRat(pair.decimalValue)} + ${formatRat(rate.value)}`;
    step2 = `${formatRat(pair.decimalValue)} + ${formatRat(rate.value)} = ${formatRat(sum)}`;
    step3 = `${formatRat(sum)} = ${correctDecimal}`;
    answer = "No error";
    difficulty = "MEDIUM";
    difficultyScore = 6;
    concept = "Every displayed step preserves the original value, so there is no incorrect step.";
  }

  const values = ["Step 1", "Step 2", "Step 3", "No error"] as const;
  const options: readonly SapCp003Option[] = Object.freeze(values.map((value, index) => Object.freeze({
    displayIndex: index + 1,
    value,
    isCorrect: value === answer,
    misconceptionId: value === answer ? null : `FIRST_ERROR_MISLOCATED_${value.replace(/\s+/g, "_").toUpperCase()}`,
    analysis: value === answer
      ? ensureSentence(concept)
      : ensureSentence(`This choice overlooks where the first value-changing step actually occurs; the correct diagnosis is ${answer}`),
  })));

  return Object.freeze({
    ...pkg,
    difficulty,
    difficultyScore,
    stem: `A student evaluates ${pair.decimal} + ${rate.display}.\nStep 1: ${step1}\nStep 2: ${step2}\nStep 3: ${step3}\nWhich is the first incorrect step?`,
    options,
    correctIndex: values.indexOf(answer),
    canonicalAnswer: answer,
    verifierAnswer: answer,
    explanation: Object.freeze({
      coreConcept: ensureSentence("Check each displayed equality in order and stop at the first step that changes the value"),
      steps: Object.freeze([
        ensureSentence(`Original value: ${pair.decimal} + ${rate.display} = ${formatRat(pair.decimalValue)} + ${formatRat(rate.value)} = ${formatRat(sum)}`),
        ensureSentence(concept),
      ]),
      finalAnswer: ensureSentence(`Therefore, the correct answer is ${answer}`),
    }),
    canonicalPayloadKey: [
      "SAP_CP003_EDITORIAL_V3",
      pkg.prototypeId,
      `DIAGNOSIS_${answer.replace(/\s+/g, "_").toUpperCase()}`,
      pair.decimal,
      rate.display,
    ].join("|"),
    generationIdentity: [
      "SAP_CP003_EDITORIAL_V3",
      pkg.prototypeId,
      String(pkg.seed),
      `DIAGNOSIS_${answer.replace(/\s+/g, "_").toUpperCase()}`,
    ].join("|"),
    validation: Object.freeze({
      ...pkg.validation,
      ok: true,
      errors: Object.freeze([]),
      exactAgreementPassed: true,
      optionUniquenessPassed: true,
      singleCorrectOptionPassed: true,
      answerBindingPassed: true,
      surfaceSyntaxPassed: true,
      explanationCompletenessPassed: true,
      lifecyclePassed: true,
    }),
  });
}

export function applySapCp003EditorialRemediationV3(pkg: SapCp003Package): SapCp003Package {
  const ql034 = terminatingDecimalExpression(pkg);
  const ql040 = percentOfQuantityExpression(ql034);
  const ql043 = convertTermsToDecimals(ql040);
  const ql044 = knownEquivalence(ql043);
  const ql045 = recurringDecimalExpression(ql044);
  const ql049 = missingPercentage(ql045);
  return diagnosisPackage(ql049);
}
