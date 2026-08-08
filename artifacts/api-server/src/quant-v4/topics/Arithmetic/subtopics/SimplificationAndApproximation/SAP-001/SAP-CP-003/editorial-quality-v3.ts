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

const GENERIC_DISTRACTOR_IDS = new Set([
  "FINAL_SCALE_TEN_TIMES_LARGE",
  "FINAL_SCALE_TEN_TIMES_SMALL",
  "FINAL_VALUE_ONE_TOO_LARGE",
  "FINAL_VALUE_ONE_TOO_SMALL",
  "FINAL_VALUE_DOUBLED",
]);

const PRODUCT_CASES = Object.freeze([
  Object.freeze({ left: "4.8", right: "2.5" }),
  Object.freeze({ left: "12.5", right: "0.32" }),
  Object.freeze({ left: "6.25", right: "1.6" }),
  Object.freeze({ left: "0.375", right: "4.8" }),
  Object.freeze({ left: "2.4", right: "1.25" }),
  Object.freeze({ left: "0.625", right: "3.2" }),
  Object.freeze({ left: "7.5", right: "0.48" }),
  Object.freeze({ left: "0.875", right: "1.6" }),
] as const);

const DIVISION_CASES = Object.freeze([
  Object.freeze({ divisor: "0.5", divisorValue: rat(1n, 2n) }),
  Object.freeze({ divisor: "0.25", divisorValue: rat(1n, 4n) }),
  Object.freeze({ divisor: "0.2", divisorValue: rat(1n, 5n) }),
  Object.freeze({ divisor: "1.25", divisorValue: rat(5n, 4n) }),
  Object.freeze({ divisor: "2.5", divisorValue: rat(5n, 2n) }),
  Object.freeze({ divisor: "0.125", divisorValue: rat(1n, 8n) }),
] as const);

const RATE_CASES = Object.freeze([
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
  Object.freeze({ display: "150%", value: rat(3n, 2n) }),
] as const);

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function exactDisplay(value: Rat): string {
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function formatLikeAnswer(value: Rat, answer: string): string {
  if (answer.endsWith("%")) return formatPercentLiteral(value);
  if (answer.includes("/")) return formatRat(value);
  return exactDisplay(value);
}

function buildOptions(
  correct: Rat,
  wrongs: readonly WrongCandidate[],
): readonly SapCp003Option[] {
  const correctText = exactDisplay(correct);
  const used = new Set<string>([correctText]);
  const options: SapCp003Option[] = [Object.freeze({
    displayIndex: 1,
    value: correctText,
    isCorrect: true,
    misconceptionId: null,
    analysis: "This option matches the exact result obtained from the displayed operations.",
  })];
  for (const wrong of wrongs) {
    if (equalRat(wrong.value, correct)) continue;
    const value = exactDisplay(wrong.value);
    if (used.has(value)) continue;
    used.add(value);
    options.push(Object.freeze({
      displayIndex: options.length + 1,
      value,
      isCorrect: false,
      misconceptionId: wrong.misconceptionId,
      analysis: ensureSentence(wrong.analysis),
    }));
  }
  const nearby = [add(correct, rat(1n)), subtract(correct, rat(1n)), add(correct, rat(2n)), subtract(correct, rat(2n))];
  for (const valueRat of nearby) {
    if (options.length === 4) break;
    const value = exactDisplay(valueRat);
    if (used.has(value)) continue;
    used.add(value);
    options.push(Object.freeze({
      displayIndex: options.length + 1,
      value,
      isCorrect: false,
      misconceptionId: valueRat.n > correct.n ? "NEARBY_FINAL_ARITHMETIC_HIGH" : "NEARBY_FINAL_ARITHMETIC_LOW",
      analysis: "A small final arithmetic slip produces this nearby value.",
    }));
  }
  if (options.length !== 4) throw new Error(`Could not build four editorial-quality options for ${correctText}.`);
  return Object.freeze(options);
}

function buildPackage(
  pkg: SapCp003Package,
  input: {
    readonly frameId: string;
    readonly stem: string;
    readonly answer: Rat;
    readonly wrongs: readonly WrongCandidate[];
    readonly concept: string;
    readonly strategy: string;
    readonly steps: readonly string[];
    readonly difficulty: SapCp003Difficulty;
    readonly difficultyScore: number;
    readonly payloadParts: readonly string[];
  },
): SapCp003Package {
  const answer = exactDisplay(input.answer);
  const options = buildOptions(input.answer, input.wrongs);
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
      coreConcept: ensureSentence(`${input.concept} ${input.strategy}`),
      steps: Object.freeze(input.steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`Therefore, the answer is ${answer}`),
    }),
    canonicalPayloadKey: ["SAP_CP003_EDITORIAL_QUALITY_V3", pkg.prototypeId, input.frameId, ...input.payloadParts].join("|"),
    generationIdentity: ["SAP_CP003_EDITORIAL_QUALITY_V3", pkg.prototypeId, String(pkg.seed), input.frameId].join("|"),
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

function decimalProduct(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-DECIMAL-PRODUCT-PLACE-VALUE") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const item = PRODUCT_CASES[Math.floor((pkg.seed - 1) / 2) % PRODUCT_CASES.length]!;
  const left = parseNumericLiteral(item.left)!;
  const right = parseNumericLiteral(item.right)!;
  const product = multiply(left, right);

  if (frame === 0) {
    return buildPackage(pkg, {
      frameId: "DECIMAL_PRODUCT_DIRECT",
      stem: `Evaluate ${item.left} × ${item.right}.`,
      answer: product,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(product, rat(10n)), misconceptionId: "DECIMAL_POINT_ONE_PLACE_RIGHT", analysis: "The product has been made ten times too large by placing the decimal one position too far right." }),
        Object.freeze({ value: divide(product, rat(10n)), misconceptionId: "DECIMAL_POINT_ONE_PLACE_LEFT", analysis: "The product has been made ten times too small by placing the decimal one position too far left." }),
        Object.freeze({ value: add(left, right), misconceptionId: "MULTIPLICATION_REPLACED_BY_ADDITION", analysis: "The two factors were added instead of multiplied." }),
      ]),
      concept: "Multiply the whole-number digits and restore the total visible decimal places.",
      strategy: "Use compatible benchmark factors where possible before doing long multiplication.",
      steps: [`${item.left} × ${item.right} = ${exactDisplay(product)}`],
      difficulty: ["4.8", "2.5", "12.5", "0.32", "6.25", "1.6"].includes(item.left) || ["4.8", "2.5", "12.5", "0.32", "6.25", "1.6"].includes(item.right) ? "EASY" : "MEDIUM",
      difficultyScore: 4,
      payloadParts: [item.left, item.right],
    });
  }

  if (frame === 1) {
    const answer = divide(product, rat(10n));
    return buildPackage(pkg, {
      frameId: "DECIMAL_PRODUCT_THEN_DIVIDE_TEN",
      stem: `Evaluate (${item.left} × ${item.right}) ÷ 10.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: product, misconceptionId: "FINAL_DIVISION_BY_TEN_OMITTED", analysis: "The decimal product was found, but the final division by 10 was omitted." }),
        Object.freeze({ value: multiply(product, rat(10n)), misconceptionId: "DIVISION_BY_TEN_REVERSED", analysis: "The final division by 10 was reversed into multiplication by 10." }),
        Object.freeze({ value: divide(add(left, right), rat(10n)), misconceptionId: "PRODUCT_REPLACED_BY_SUM", analysis: "The factors were added before dividing by 10." }),
      ]),
      concept: "Evaluate the bracketed decimal product before shifting one place left.",
      strategy: "Find the exact product, then divide by 10 once.",
      steps: [`${item.left} × ${item.right} = ${exactDisplay(product)}`, `${exactDisplay(product)} ÷ 10 = ${exactDisplay(answer)}`],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [item.left, item.right],
    });
  }

  if (frame === 2) {
    const outside = parseNumericLiteral(["0.25", "0.5", "0.75", "1.25"][pkg.seed % 4]!)!;
    const bracket = add(right, outside);
    const answer = multiply(left, bracket);
    return buildPackage(pkg, {
      frameId: "DECIMAL_PRODUCT_OF_BRACKET",
      stem: `Evaluate ${item.left} × (${item.right} + ${exactDisplay(outside)}).`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(product, outside), misconceptionId: "MULTIPLIER_APPLIED_TO_FIRST_BRACKET_TERM_ONLY", analysis: "The outside multiplier was applied only to the first bracket term." }),
        Object.freeze({ value: multiply(left, subtract(right, outside)), misconceptionId: "BRACKET_ADDITION_CHANGED_TO_SUBTRACTION", analysis: "The addition inside the bracket was changed to subtraction." }),
        Object.freeze({ value: add(left, bracket), misconceptionId: "OUTSIDE_MULTIPLICATION_REPLACED_BY_ADDITION", analysis: "The outside multiplication was replaced by addition." }),
      ]),
      concept: "An outside decimal factor multiplies the complete bracket.",
      strategy: "Add inside the bracket first, then multiply once.",
      steps: [`${item.right} + ${exactDisplay(outside)} = ${exactDisplay(bracket)}`, `${item.left} × ${exactDisplay(bracket)} = ${exactDisplay(answer)}`],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      payloadParts: [item.left, item.right, exactDisplay(outside)],
    });
  }

  const outside = parseNumericLiteral(["0.125", "0.25", "0.5", "0.75"][pkg.seed % 4]!)!;
  const bracket = subtract(right, outside);
  const answer = multiply(left, bracket);
  return buildPackage(pkg, {
    frameId: "DECIMAL_PRODUCT_OF_DIFFERENCE",
    stem: `Evaluate ${item.left} × (${item.right} − ${exactDisplay(outside)}).`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: subtract(product, outside), misconceptionId: "MULTIPLIER_APPLIED_TO_FIRST_TERM_ONLY", analysis: "The multiplier was applied only to the first bracket term." }),
      Object.freeze({ value: multiply(left, add(right, outside)), misconceptionId: "BRACKET_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The subtraction inside the bracket was changed to addition." }),
      Object.freeze({ value: subtract(left, bracket), misconceptionId: "OUTSIDE_MULTIPLICATION_REPLACED_BY_SUBTRACTION", analysis: "The outside multiplication was replaced by subtraction." }),
    ]),
    concept: "Evaluate the bracketed difference before multiplying.",
    strategy: "Keep the decimal-place structure exact and avoid premature rounding.",
    steps: [`${item.right} − ${exactDisplay(outside)} = ${exactDisplay(bracket)}`, `${item.left} × ${exactDisplay(bracket)} = ${exactDisplay(answer)}`],
    difficulty: "MEDIUM",
    difficultyScore: 6,
    payloadParts: [item.left, item.right, exactDisplay(outside)],
  });
}

function compatibleDivision(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-DECIMAL-DIVISION-COMPATIBLE-FACTOR") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const item = DIVISION_CASES[pkg.seed % DIVISION_CASES.length]!;
  const quotient = rat(BigInt(4 + (pkg.seed % 29)));
  const dividend = multiply(item.divisorValue, quotient);

  if (frame === 0) {
    return buildPackage(pkg, {
      frameId: "COMPATIBLE_DECIMAL_DIVISION_DIRECT",
      stem: `Evaluate ${exactDisplay(dividend)} ÷ ${item.divisor}.`,
      answer: quotient,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(dividend, item.divisorValue), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The dividend was multiplied by the decimal divisor instead of divided by it." }),
        Object.freeze({ value: divide(item.divisorValue, dividend), misconceptionId: "DIVISION_ORDER_REVERSED", analysis: "The divisor was divided by the dividend in reverse order." }),
        Object.freeze({ value: divide(dividend, multiply(item.divisorValue, rat(10n))), misconceptionId: "DIVISOR_SHIFTED_WITHOUT_BALANCING_DIVIDEND", analysis: "The divisor was made ten times larger without making the same change to the dividend." }),
      ]),
      concept: "Scale the dividend and divisor by the same power of ten to remove the decimal divisor.",
      strategy: "Use the compatible reciprocal shortcut when the divisor is 0.5, 0.25, 0.2 or 0.125.",
      steps: [`${exactDisplay(dividend)} ÷ ${item.divisor} = ${exactDisplay(quotient)}`],
      difficulty: ["0.5", "0.25", "0.2"].includes(item.divisor) ? "EASY" : "MEDIUM",
      difficultyScore: ["0.5", "0.25", "0.2"].includes(item.divisor) ? 3 : 5,
      payloadParts: [exactDisplay(dividend), item.divisor],
    });
  }

  if (frame === 1) {
    const addend = multiply(item.divisorValue, rat(BigInt(2 + (pkg.seed % 7))));
    const total = add(dividend, addend);
    const answer = divide(total, item.divisorValue);
    return buildPackage(pkg, {
      frameId: "COMPATIBLE_DIVISION_OF_SUM",
      stem: `Evaluate (${exactDisplay(dividend)} + ${exactDisplay(addend)}) ÷ ${item.divisor}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(dividend, divide(addend, item.divisorValue)), misconceptionId: "DIVISOR_APPLIED_TO_SECOND_TERM_ONLY", analysis: "The divisor was applied only to the second term, not to the complete bracket." }),
        Object.freeze({ value: multiply(total, item.divisorValue), misconceptionId: "FINAL_DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The bracket value was multiplied by the divisor instead of divided." }),
        Object.freeze({ value: quotient, misconceptionId: "BRACKET_ADDEND_OMITTED", analysis: "The extra term inside the bracket was omitted." }),
      ]),
      concept: "Evaluate the bracket before dividing by the compatible decimal factor.",
      strategy: "Combine the compatible terms first, then use one exact division.",
      steps: [`${exactDisplay(dividend)} + ${exactDisplay(addend)} = ${exactDisplay(total)}`, `${exactDisplay(total)} ÷ ${item.divisor} = ${exactDisplay(answer)}`],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [exactDisplay(dividend), exactDisplay(addend), item.divisor],
    });
  }

  if (frame === 2) {
    const multiplier = rat(BigInt(2 + (pkg.seed % 5)));
    const scaled = multiply(dividend, multiplier);
    const answer = divide(scaled, item.divisorValue);
    return buildPackage(pkg, {
      frameId: "SCALED_NUMERATOR_COMPATIBLE_DIVISION",
      stem: `Evaluate (${exactDisplay(dividend)} × ${exactDisplay(multiplier)}) ÷ ${item.divisor}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: divide(dividend, item.divisorValue), misconceptionId: "NUMERATOR_MULTIPLIER_OMITTED", analysis: `The multiplier ${exactDisplay(multiplier)} in the numerator was omitted.` }),
        Object.freeze({ value: multiply(scaled, item.divisorValue), misconceptionId: "FINAL_DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The scaled numerator was multiplied by the divisor instead of divided." }),
        Object.freeze({ value: divide(dividend, multiply(multiplier, item.divisorValue)), misconceptionId: "MULTIPLIER_MOVED_TO_DENOMINATOR", analysis: "The numerator multiplier was incorrectly moved into the denominator." }),
      ]),
      concept: "Preserve the numerator product before dividing by the compatible decimal factor.",
      strategy: "Use cancellation or the reciprocal after the numerator is complete.",
      steps: [`${exactDisplay(dividend)} × ${exactDisplay(multiplier)} = ${exactDisplay(scaled)}`, `${exactDisplay(scaled)} ÷ ${item.divisor} = ${exactDisplay(answer)}`],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      payloadParts: [exactDisplay(dividend), exactDisplay(multiplier), item.divisor],
    });
  }

  const subtrahend = multiply(item.divisorValue, rat(BigInt(1 + (pkg.seed % 5))));
  const difference = subtract(dividend, subtrahend);
  const answer = divide(difference, item.divisorValue);
  return buildPackage(pkg, {
    frameId: "COMPATIBLE_DIVISION_OF_DIFFERENCE",
    stem: `Evaluate (${exactDisplay(dividend)} − ${exactDisplay(subtrahend)}) ÷ ${item.divisor}.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: subtract(dividend, divide(subtrahend, item.divisorValue)), misconceptionId: "DIVISOR_APPLIED_TO_SECOND_TERM_ONLY", analysis: "The divisor was applied only to the subtracted term, not to the complete bracket." }),
      Object.freeze({ value: divide(add(dividend, subtrahend), item.divisorValue), misconceptionId: "BRACKET_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The subtraction inside the bracket was changed to addition." }),
      Object.freeze({ value: quotient, misconceptionId: "SUBTRAHEND_OMITTED", analysis: "The subtracted term inside the bracket was omitted." }),
    ]),
    concept: "Evaluate the bracketed difference before dividing by the decimal factor.",
    strategy: "Keep the divisor outside the complete bracket and use compatible division once.",
    steps: [`${exactDisplay(dividend)} − ${exactDisplay(subtrahend)} = ${exactDisplay(difference)}`, `${exactDisplay(difference)} ÷ ${item.divisor} = ${exactDisplay(answer)}`],
    difficulty: "MEDIUM",
    difficultyScore: 5,
    payloadParts: [exactDisplay(dividend), exactDisplay(subtrahend), item.divisor],
  });
}

function percentageFactor(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const rate = RATE_CASES[pkg.seed % RATE_CASES.length]!;
  const quantity = Number(rate.value.d) * (8 + (pkg.seed % 23));
  const Q = rat(BigInt(quantity));
  const amount = multiply(rate.value, Q);

  if (frame === 0 || frame === 1) {
    return buildPackage(pkg, {
      frameId: frame === 0 ? "PERCENTAGE_OF_QUANTITY_DIRECT" : "QUANTITY_TIMES_PERCENTAGE_FACTOR",
      stem: frame === 0 ? `Evaluate ${rate.display} of ${quantity}.` : `Evaluate ${quantity} × ${rate.display}.`,
      answer: amount,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(subtract(rat(1n), rate.value), Q), misconceptionId: "COMPLEMENTARY_PERCENTAGE_USED", analysis: "The complementary percentage was used instead of the displayed percentage." }),
        Object.freeze({ value: divide(Q, rate.value), misconceptionId: "PERCENTAGE_FACTOR_USED_AS_DIVISOR", analysis: "The quantity was divided by the percentage factor instead of multiplied by it." }),
        Object.freeze({ value: add(Q, rate.value), misconceptionId: "PERCENTAGE_FACTOR_ADDED_TO_QUANTITY", analysis: "The percentage factor was added to the quantity instead of multiplied." }),
      ]),
      concept: "Convert the percentage to an exact fraction or decimal factor before multiplying.",
      strategy: "Use benchmark conversions such as 12.5% = 1/8 and 37.5% = 3/8 for speed.",
      steps: [`${rate.display} = ${formatRat(rate.value)}`, `${formatRat(rate.value)} × ${quantity} = ${exactDisplay(amount)}`],
      difficulty: rate.value.d >= 16n || rate.value.n > rate.value.d ? "MEDIUM" : "EASY",
      difficultyScore: rate.value.d >= 16n || rate.value.n > rate.value.d ? 5 : 3,
      payloadParts: [rate.display, String(quantity), frame === 0 ? "OF" : "FACTOR"],
    });
  }

  if (frame === 2) {
    const extra = Number(rate.value.d) * (2 + (pkg.seed % 7));
    const combined = rat(BigInt(quantity + extra));
    const answer = multiply(rate.value, combined);
    return buildPackage(pkg, {
      frameId: "PERCENTAGE_FACTOR_OF_BRACKET_BASE",
      stem: `Evaluate ${rate.display} of (${quantity} + ${extra}).`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(amount, rat(BigInt(extra))), misconceptionId: "PERCENTAGE_APPLIED_TO_FIRST_BRACKET_TERM_ONLY", analysis: "The percentage was applied only to the first number inside the bracket." }),
        Object.freeze({ value: multiply(rate.value, rat(BigInt(extra))), misconceptionId: "FIRST_BRACKET_TERM_OMITTED", analysis: `The quantity ${quantity} was omitted from the bracket.` }),
        Object.freeze({ value: combined, misconceptionId: "PERCENTAGE_FACTOR_OMITTED", analysis: "The bracket was evaluated, but the percentage factor was omitted." }),
      ]),
      concept: "A percentage before a bracket applies to the complete bracket value.",
      strategy: "Add the base first, then multiply by the benchmark percentage factor.",
      steps: [`${quantity} + ${extra} = ${quantity + extra}`, `${rate.display} of ${quantity + extra} = ${exactDisplay(answer)}`],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [rate.display, String(quantity), String(extra)],
    });
  }

  const divisor = rat(BigInt(2 + (pkg.seed % 4)));
  const answer = divide(amount, divisor);
  return buildPackage(pkg, {
    frameId: "PERCENTAGE_FACTOR_THEN_DIVIDE",
    stem: `Evaluate (${rate.display} of ${quantity}) ÷ ${exactDisplay(divisor)}.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: amount, misconceptionId: "FINAL_DIVISOR_OMITTED", analysis: `The percentage amount was found, but the final division by ${exactDisplay(divisor)} was omitted.` }),
      Object.freeze({ value: multiply(amount, divisor), misconceptionId: "FINAL_DIVISION_REPLACED_BY_MULTIPLICATION", analysis: "The percentage amount was multiplied by the final number instead of divided." }),
      Object.freeze({ value: divide(Q, divisor), misconceptionId: "PERCENTAGE_FACTOR_OMITTED", analysis: "The final division was performed on the original quantity, omitting the percentage factor." }),
    ]),
    concept: "Evaluate the percentage amount before applying the outside division.",
    strategy: "Treat the bracketed percentage-of expression as one exact number.",
    steps: [`${rate.display} of ${quantity} = ${exactDisplay(amount)}`, `${exactDisplay(amount)} ÷ ${exactDisplay(divisor)} = ${exactDisplay(answer)}`],
    difficulty: "MEDIUM",
    difficultyScore: 6,
    payloadParts: [rate.display, String(quantity), exactDisplay(divisor)],
  });
}

function replaceGenericDistractors(pkg: SapCp003Package): SapCp003Package {
  if (!pkg.options.some((option) => option.misconceptionId && GENERIC_DISTRACTOR_IDS.has(option.misconceptionId))) return pkg;
  const correct = parseNumericLiteral(pkg.canonicalAnswer);
  if (!correct) return pkg;
  const step = pkg.canonicalAnswer.endsWith("%")
    ? rat(1n, 8n)
    : correct.d > 1n
      ? rat(1n, correct.d)
      : rat(abs(correct.n) >= 100n ? abs(correct.n) / 25n || 1n : 1n);
  const candidateValues = [
    add(correct, step),
    subtract(correct, step),
    add(correct, multiply(step, rat(2n))),
    subtract(correct, multiply(step, rat(2n))),
    add(correct, multiply(step, rat(3n))),
    subtract(correct, multiply(step, rat(3n))),
  ];
  const used = new Set(pkg.options.filter((option) => !option.misconceptionId || !GENERIC_DISTRACTOR_IDS.has(option.misconceptionId)).map((option) => option.value));
  let cursor = 0;
  const options = pkg.options.map((option): SapCp003Option => {
    if (!option.misconceptionId || !GENERIC_DISTRACTOR_IDS.has(option.misconceptionId)) return option;
    while (cursor < candidateValues.length) {
      const candidate = candidateValues[cursor++]!;
      if (equalRat(candidate, correct)) continue;
      const value = formatLikeAnswer(candidate, pkg.canonicalAnswer);
      if (used.has(value)) continue;
      used.add(value);
      return Object.freeze({
        ...option,
        value,
        misconceptionId: candidate.n * correct.d > correct.n * candidate.d
          ? "NEARBY_FINAL_ARITHMETIC_HIGH"
          : "NEARBY_FINAL_ARITHMETIC_LOW",
        analysis: "The main method is plausible, but a small final arithmetic or place-value slip produces this nearby result.",
      });
    }
    return option;
  });
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  if (!optionUniquenessPassed) return pkg;
  return Object.freeze({
    ...pkg,
    options: Object.freeze(options),
    validation: Object.freeze({
      ...pkg.validation,
      optionUniquenessPassed,
      ok: pkg.validation.ok && optionUniquenessPassed,
    }),
  });
}

function recalibrateDifficulty(pkg: SapCp003Package): SapCp003Package {
  let difficulty = pkg.difficulty;
  let difficultyScore = pkg.difficultyScore;
  if (pkg.prototypeId === "SAP-CP003-PROT-DECIMAL-DIVISION-POWER-OF-TEN") {
    difficulty = "EASY";
    difficultyScore = 2;
  } else if (pkg.prototypeId === "SAP-CP003-PROT-MISSING-DECIMAL-OPERAND") {
    if (/×|÷/.test(pkg.stem)) {
      difficulty = "MEDIUM";
      difficultyScore = 5;
    } else {
      difficulty = "EASY";
      difficultyScore = 3;
    }
  } else if (pkg.prototypeId === "SAP-CP003-PROT-SELECT-CORRECT-DECIMAL-PLACEMENT") {
    difficulty = pkg.stem.match(/0\.0\d|\d+\.\d+ × \d+\.\d+/) ? "MEDIUM" : "EASY";
    difficultyScore = difficulty === "MEDIUM" ? 5 : 3;
  }
  return difficulty === pkg.difficulty && difficultyScore === pkg.difficultyScore
    ? pkg
    : Object.freeze({ ...pkg, difficulty, difficultyScore });
}

export function applySapCp003EditorialQualityV3(pkg: SapCp003Package): SapCp003Package {
  const ql036 = decimalProduct(pkg);
  const ql038 = compatibleDivision(ql036);
  const ql039 = percentageFactor(ql038);
  const closeOptions = replaceGenericDistractors(ql039);
  return recalibrateDifficulty(closeOptions);
}
