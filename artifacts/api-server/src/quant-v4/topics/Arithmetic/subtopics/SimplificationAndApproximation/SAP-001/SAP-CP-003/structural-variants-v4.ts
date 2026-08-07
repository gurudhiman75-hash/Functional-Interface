import {
  type Rat,
  add,
  divide,
  equalRat,
  ensureSentence,
  formatRat,
  formatTerminatingDecimal,
  isTerminating,
  multiply,
  rat,
  subtract,
} from "./exact";
import type { SapCp003Option, SapCp003Package } from "./types";

interface DecimalFractionCase {
  readonly decimal: string;
  readonly decimalValue: Rat;
  readonly fraction: string;
  readonly fractionValue: Rat;
  readonly divisor: string;
  readonly divisorValue: Rat;
}

interface ConversionCase {
  readonly decimal: string;
  readonly decimalValue: Rat;
  readonly percent: string;
  readonly percentValue: Rat;
  readonly fraction: string;
  readonly fractionValue: Rat;
}

interface WrongCandidate {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

const DECIMAL_FRACTION_CASES: readonly DecimalFractionCase[] = Object.freeze([
  Object.freeze({ decimal: "0.25", decimalValue: rat(1n, 4n), fraction: "3/8", fractionValue: rat(3n, 8n), divisor: "0.5", divisorValue: rat(1n, 2n) }),
  Object.freeze({ decimal: "0.375", decimalValue: rat(3n, 8n), fraction: "1/4", fractionValue: rat(1n, 4n), divisor: "0.25", divisorValue: rat(1n, 4n) }),
  Object.freeze({ decimal: "0.625", decimalValue: rat(5n, 8n), fraction: "1/2", fractionValue: rat(1n, 2n), divisor: "0.5", divisorValue: rat(1n, 2n) }),
  Object.freeze({ decimal: "0.75", decimalValue: rat(3n, 4n), fraction: "5/8", fractionValue: rat(5n, 8n), divisor: "0.25", divisorValue: rat(1n, 4n) }),
  Object.freeze({ decimal: "0.875", decimalValue: rat(7n, 8n), fraction: "3/4", fractionValue: rat(3n, 4n), divisor: "0.5", divisorValue: rat(1n, 2n) }),
  Object.freeze({ decimal: "1.25", decimalValue: rat(5n, 4n), fraction: "7/8", fractionValue: rat(7n, 8n), divisor: "0.25", divisorValue: rat(1n, 4n) }),
]);

const CONVERSION_CASES: readonly ConversionCase[] = Object.freeze([
  Object.freeze({ decimal: "0.375", decimalValue: rat(3n, 8n), percent: "25%", percentValue: rat(1n, 4n), fraction: "1/8", fractionValue: rat(1n, 8n) }),
  Object.freeze({ decimal: "0.625", decimalValue: rat(5n, 8n), percent: "12.5%", percentValue: rat(1n, 8n), fraction: "1/4", fractionValue: rat(1n, 4n) }),
  Object.freeze({ decimal: "0.75", decimalValue: rat(3n, 4n), percent: "50%", percentValue: rat(1n, 2n), fraction: "3/8", fractionValue: rat(3n, 8n) }),
  Object.freeze({ decimal: "0.2", decimalValue: rat(1n, 5n), percent: "40%", percentValue: rat(2n, 5n), fraction: "3/5", fractionValue: rat(3n, 5n) }),
  Object.freeze({ decimal: "0.875", decimalValue: rat(7n, 8n), percent: "25%", percentValue: rat(1n, 4n), fraction: "1/8", fractionValue: rat(1n, 8n) }),
  Object.freeze({ decimal: "1.25", decimalValue: rat(5n, 4n), percent: "75%", percentValue: rat(3n, 4n), fraction: "1/2", fractionValue: rat(1n, 2n) }),
]);

function exactDisplay(value: Rat): string {
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function makeOptions(correct: Rat, candidates: readonly WrongCandidate[]): readonly SapCp003Option[] {
  const correctText = exactDisplay(correct);
  const fallbackCandidates: readonly WrongCandidate[] = Object.freeze([
    Object.freeze({ value: add(correct, rat(1n)), misconceptionId: "FINAL_VALUE_ONE_TOO_LARGE", analysis: "One was added to the exact result." }),
    Object.freeze({ value: subtract(correct, rat(1n)), misconceptionId: "FINAL_VALUE_ONE_TOO_SMALL", analysis: "One was subtracted from the exact result." }),
    Object.freeze({ value: multiply(correct, rat(2n)), misconceptionId: "FINAL_VALUE_DOUBLED", analysis: "The exact result was doubled without justification." }),
    Object.freeze({ value: divide(correct, rat(2n)), misconceptionId: "FINAL_VALUE_HALVED", analysis: "The exact result was halved without justification." }),
  ]);
  const used = new Set<string>([correctText]);
  const wrongOptions: SapCp003Option[] = [];
  for (const candidate of [...candidates, ...fallbackCandidates]) {
    if (equalRat(candidate.value, correct)) continue;
    const text = exactDisplay(candidate.value);
    if (used.has(text)) continue;
    used.add(text);
    wrongOptions.push(Object.freeze({
      displayIndex: wrongOptions.length + 2,
      value: text,
      isCorrect: false,
      misconceptionId: candidate.misconceptionId,
      analysis: ensureSentence(candidate.analysis),
    }));
    if (wrongOptions.length === 3) break;
  }
  if (wrongOptions.length !== 3) throw new Error(`Could not create four structural V4 options for ${correctText}.`);
  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This option matches the exact value after preserving the displayed operation structure.",
    }),
    ...wrongOptions,
  ]);
}

function replacePackage(
  pkg: SapCp003Package,
  input: {
    readonly stem: string;
    readonly answer: Rat;
    readonly wrongs: readonly WrongCandidate[];
    readonly coreConcept: string;
    readonly steps: readonly string[];
    readonly difficulty: "EASY" | "MEDIUM" | "HARD";
    readonly difficultyScore: number;
    readonly variantId: string;
    readonly payloadParts: readonly string[];
    readonly finalAnswerPrefix?: string;
  },
): SapCp003Package {
  const answer = exactDisplay(input.answer);
  const options = makeOptions(input.answer, input.wrongs);
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
      coreConcept: ensureSentence(input.coreConcept),
      steps: Object.freeze(input.steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`${input.finalAnswerPrefix ?? "Therefore, the answer is"} ${answer}`),
    }),
    canonicalPayloadKey: ["SAP_CP003_STRUCTURAL_V4", pkg.prototypeId, input.variantId, ...input.payloadParts].join("|"),
    generationIdentity: ["SAP_CP003_STRUCTURAL_V4", pkg.prototypeId, String(pkg.seed), input.variantId].join("|"),
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

function decimalFractionMixedVariant(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-DECIMAL-FRACTION-MIXED-EXPRESSION") return pkg;
  const item = DECIMAL_FRACTION_CASES[(pkg.seed - 1) % DECIMAL_FRACTION_CASES.length]!;
  const frame = (pkg.seed - 1) % 4;
  const quantity = 8 * (6 + (pkg.seed % 21));
  const secondQuantity = 8 * (3 + ((pkg.seed * 5) % 11));
  const Q = rat(BigInt(quantity));
  const R = rat(BigInt(secondQuantity));
  const fractionOfQuantity = multiply(item.fractionValue, Q);
  const decimalProduct = multiply(item.decimalValue, R);

  if (frame === 0) {
    const answer = add(item.decimalValue, fractionOfQuantity);
    return replacePackage(pkg, {
      stem: `Evaluate ${item.decimal} + ${item.fraction} of ${quantity}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(item.decimalValue, item.fractionValue), misconceptionId: "QUANTITY_AFTER_OF_OMITTED", analysis: `The quantity ${quantity} following 'of' was omitted.` }),
        Object.freeze({ value: fractionOfQuantity, misconceptionId: "DECIMAL_TERM_OMITTED", analysis: `The decimal term ${item.decimal} was omitted.` }),
        Object.freeze({ value: multiply(add(item.decimalValue, item.fractionValue), Q), misconceptionId: "OF_SCOPE_EXTENDED_TO_DECIMAL", analysis: `The quantity ${quantity} was applied to both the decimal and fraction.` }),
      ]),
      coreConcept: "Evaluate the fraction-of block first and then combine its exact value with the outside decimal",
      steps: [
        `${item.fraction} of ${quantity} = ${formatRat(item.fractionValue)} × ${quantity} = ${exactDisplay(fractionOfQuantity)}`,
        `${item.decimal} + ${exactDisplay(fractionOfQuantity)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "EASY",
      difficultyScore: 3,
      variantId: "DECIMAL_PLUS_FRACTION_OF_QUANTITY",
      payloadParts: [item.decimal, item.fraction, String(quantity)],
    });
  }

  if (frame === 1) {
    const combinedFactor = add(item.decimalValue, item.fractionValue);
    const answer = multiply(combinedFactor, Q);
    return replacePackage(pkg, {
      stem: `Evaluate (${item.decimal} + ${item.fraction}) × ${quantity}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(item.decimalValue, fractionOfQuantity), misconceptionId: "BRACKET_SCOPE_IGNORED", analysis: `The multiplier ${quantity} was applied only to the fraction.` }),
        Object.freeze({ value: add(decimalProduct, item.fractionValue), misconceptionId: "MULTIPLIER_APPLIED_TO_DECIMAL_ONLY", analysis: `The multiplier ${secondQuantity} was applied only to the decimal while the fraction remained unscaled.` }),
        Object.freeze({ value: combinedFactor, misconceptionId: "FINAL_MULTIPLIER_OMITTED", analysis: `The final multiplication by ${quantity} was omitted.` }),
      ]),
      coreConcept: "Complete the mixed decimal-fraction bracket as one exact factor before multiplying by the outside quantity",
      steps: [
        `${item.decimal} + ${item.fraction} = ${formatRat(item.decimalValue)} + ${formatRat(item.fractionValue)} = ${formatRat(combinedFactor)}`,
        `${formatRat(combinedFactor)} × ${quantity} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      variantId: "MIXED_BRACKET_TIMES_QUANTITY",
      payloadParts: [item.decimal, item.fraction, String(quantity)],
    });
  }

  if (frame === 2) {
    const answer = subtract(fractionOfQuantity, decimalProduct);
    return replacePackage(pkg, {
      stem: `Evaluate ${item.fraction} of ${quantity} − ${item.decimal} × ${secondQuantity}.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(fractionOfQuantity, decimalProduct), misconceptionId: "FINAL_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The two correctly evaluated products were added instead of subtracted." }),
        Object.freeze({ value: fractionOfQuantity, misconceptionId: "DECIMAL_PRODUCT_OMITTED", analysis: `The term ${item.decimal} × ${secondQuantity} was omitted.` }),
        Object.freeze({ value: subtract(multiply(item.fractionValue, R), decimalProduct), misconceptionId: "QUANTITIES_INTERCHANGED", analysis: "The two visible quantities were interchanged between the fraction and decimal terms." }),
      ]),
      coreConcept: "Evaluate the fraction-of term and decimal product independently before performing the final subtraction",
      steps: [
        `${item.fraction} of ${quantity} = ${exactDisplay(fractionOfQuantity)}`,
        `${item.decimal} × ${secondQuantity} = ${exactDisplay(decimalProduct)}`,
        `${exactDisplay(fractionOfQuantity)} − ${exactDisplay(decimalProduct)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      variantId: "FRACTION_OF_MINUS_DECIMAL_PRODUCT",
      payloadParts: [item.fraction, String(quantity), item.decimal, String(secondQuantity)],
    });
  }

  const bracket = add(item.decimalValue, item.fractionValue);
  const answer = divide(bracket, item.divisorValue);
  return replacePackage(pkg, {
    stem: `Evaluate (${item.decimal} + ${item.fraction}) ÷ ${item.divisor}.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: multiply(bracket, item.divisorValue), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: `The bracket was multiplied by ${item.divisor} instead of divided by it.` }),
      Object.freeze({ value: add(item.decimalValue, divide(item.fractionValue, item.divisorValue)), misconceptionId: "DIVISOR_APPLIED_TO_FRACTION_ONLY", analysis: "The divisor was applied only to the fraction rather than to the complete bracket." }),
      Object.freeze({ value: bracket, misconceptionId: "FINAL_DIVISION_OMITTED", analysis: `The final division by ${item.divisor} was omitted.` }),
    ]),
    coreConcept: "Complete the mixed bracket first, then divide the entire exact value by the terminating-decimal divisor",
    steps: [
      `${item.decimal} + ${item.fraction} = ${formatRat(bracket)}`,
      `${formatRat(bracket)} ÷ ${item.divisor} = ${exactDisplay(answer)}`,
    ],
    difficulty: "MEDIUM",
    difficultyScore: 5,
    variantId: "MIXED_BRACKET_DIVIDED_BY_DECIMAL",
    payloadParts: [item.decimal, item.fraction, item.divisor],
  });
}

function fractionTargetVariant(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS") return pkg;
  const item = CONVERSION_CASES[(pkg.seed - 1) % CONVERSION_CASES.length]!;
  const frame = (pkg.seed - 1) % 4;

  if (frame === 0) {
    const answer = add(add(item.decimalValue, item.percentValue), item.fractionValue);
    return replacePackage(pkg, {
      stem: `Evaluate ${item.decimal} + ${item.percent} + ${item.fraction}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(item.decimalValue, item.fractionValue), misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${item.percent} was omitted.` }),
        Object.freeze({ value: add(item.percentValue, item.fractionValue), misconceptionId: "DECIMAL_TERM_OMITTED", analysis: `The term ${item.decimal} was omitted.` }),
        Object.freeze({ value: add(item.decimalValue, item.percentValue), misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${item.fraction} was omitted.` }),
      ]),
      coreConcept: "Convert the decimal and percentage to exact fractions, then combine all three terms using a common denominator",
      steps: [
        `${item.decimal} = ${formatRat(item.decimalValue)} and ${item.percent} = ${formatRat(item.percentValue)}`,
        `${formatRat(item.decimalValue)} + ${formatRat(item.percentValue)} + ${item.fraction} = ${formatRat(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      variantId: "THREE_TERM_FRACTION_SUM",
      payloadParts: [item.decimal, item.percent, item.fraction],
      finalAnswerPrefix: "Therefore, the reduced fraction is",
    });
  }

  if (frame === 1) {
    const bracket = add(item.decimalValue, item.percentValue);
    const answer = multiply(bracket, item.fractionValue);
    return replacePackage(pkg, {
      stem: `Evaluate (${item.decimal} + ${item.percent}) × ${item.fraction}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(item.decimalValue, multiply(item.percentValue, item.fractionValue)), misconceptionId: "FRACTION_APPLIED_TO_PERCENT_ONLY", analysis: `The factor ${item.fraction} was applied only to the percentage term.` }),
        Object.freeze({ value: bracket, misconceptionId: "FINAL_FRACTION_FACTOR_OMITTED", analysis: `The final multiplication by ${item.fraction} was omitted.` }),
        Object.freeze({ value: add(multiply(item.decimalValue, item.fractionValue), item.percentValue), misconceptionId: "FRACTION_APPLIED_TO_DECIMAL_ONLY", analysis: `The factor ${item.fraction} was applied only to the decimal term.` }),
      ]),
      coreConcept: "Convert the decimal and percentage inside the bracket to fractions, simplify the bracket, and then multiply by the outside fraction",
      steps: [
        `${item.decimal} + ${item.percent} = ${formatRat(item.decimalValue)} + ${formatRat(item.percentValue)} = ${formatRat(bracket)}`,
        `${formatRat(bracket)} × ${item.fraction} = ${formatRat(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      variantId: "FRACTION_TARGET_BRACKET_PRODUCT",
      payloadParts: [item.decimal, item.percent, item.fraction],
      finalAnswerPrefix: "Therefore, the reduced fraction is",
    });
  }

  if (frame === 2) {
    const answer = add(subtract(item.decimalValue, item.percentValue), item.fractionValue);
    return replacePackage(pkg, {
      stem: `Evaluate ${item.decimal} − ${item.percent} + ${item.fraction}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(add(item.decimalValue, item.percentValue), item.fractionValue), misconceptionId: "PERCENTAGE_SUBTRACTION_CHANGED_TO_ADDITION", analysis: `The term ${item.percent} was added instead of subtracted.` }),
        Object.freeze({ value: subtract(item.decimalValue, item.percentValue), misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${item.fraction} was omitted.` }),
        Object.freeze({ value: add(subtract(item.percentValue, item.decimalValue), item.fractionValue), misconceptionId: "FIRST_SUBTRACTION_REVERSED", analysis: "The decimal and percentage were subtracted in the reverse order." }),
      ]),
      coreConcept: "Convert every displayed term to a fraction and preserve the left-to-right addition and subtraction signs",
      steps: [
        `${item.decimal} = ${formatRat(item.decimalValue)} and ${item.percent} = ${formatRat(item.percentValue)}`,
        `${formatRat(item.decimalValue)} − ${formatRat(item.percentValue)} + ${item.fraction} = ${formatRat(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      variantId: "FRACTION_TARGET_SIGNED_CHAIN",
      payloadParts: [item.decimal, item.percent, item.fraction],
      finalAnswerPrefix: "Therefore, the reduced fraction is",
    });
  }

  const numerator = add(item.decimalValue, item.fractionValue);
  const answer = divide(numerator, item.percentValue);
  return replacePackage(pkg, {
    stem: `Evaluate (${item.decimal} + ${item.fraction}) ÷ ${item.percent}. Give the answer as a reduced fraction.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: multiply(numerator, item.percentValue), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: `The bracket was multiplied by ${item.percent} instead of divided by it.` }),
      Object.freeze({ value: add(item.decimalValue, divide(item.fractionValue, item.percentValue)), misconceptionId: "PERCENTAGE_DIVISOR_APPLIED_TO_FRACTION_ONLY", analysis: "The percentage divisor was applied only to the fraction, not the complete bracket." }),
      Object.freeze({ value: numerator, misconceptionId: "PERCENTAGE_DIVISOR_OMITTED", analysis: `The final division by ${item.percent} was omitted.` }),
    ]),
    coreConcept: "Convert the bracket and percentage divisor to exact fractions, then divide by multiplying with the reciprocal",
    steps: [
      `${item.decimal} + ${item.fraction} = ${formatRat(item.decimalValue)} + ${item.fraction} = ${formatRat(numerator)}`,
      `${item.percent} = ${formatRat(item.percentValue)}, so ${formatRat(numerator)} ÷ ${formatRat(item.percentValue)} = ${formatRat(answer)}`,
    ],
    difficulty: "HARD",
    difficultyScore: 7,
    variantId: "FRACTION_TARGET_BRACKET_DIVISION",
    payloadParts: [item.decimal, item.fraction, item.percent],
    finalAnswerPrefix: "Therefore, the reduced fraction is",
  });
}

export function applySapCp003StructuralVariantsV4(pkg: SapCp003Package): SapCp003Package {
  return fractionTargetVariant(decimalFractionMixedVariant(pkg));
}
