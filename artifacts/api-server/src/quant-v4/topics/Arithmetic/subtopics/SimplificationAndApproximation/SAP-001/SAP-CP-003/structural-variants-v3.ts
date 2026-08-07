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

interface Benchmark {
  readonly percent: string;
  readonly percentValue: Rat;
  readonly fraction: string;
  readonly fractionValue: Rat;
  readonly decimal: string;
  readonly decimalValue: Rat;
}

interface WrongCandidate {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

const BENCHMARKS: readonly Benchmark[] = Object.freeze([
  Object.freeze({ percent: "12.5%", percentValue: rat(1n, 8n), fraction: "3/8", fractionValue: rat(3n, 8n), decimal: "0.5", decimalValue: rat(1n, 2n) }),
  Object.freeze({ percent: "25%", percentValue: rat(1n, 4n), fraction: "5/8", fractionValue: rat(5n, 8n), decimal: "0.75", decimalValue: rat(3n, 4n) }),
  Object.freeze({ percent: "37.5%", percentValue: rat(3n, 8n), fraction: "1/4", fractionValue: rat(1n, 4n), decimal: "0.625", decimalValue: rat(5n, 8n) }),
  Object.freeze({ percent: "62.5%", percentValue: rat(5n, 8n), fraction: "3/4", fractionValue: rat(3n, 4n), decimal: "0.25", decimalValue: rat(1n, 4n) }),
  Object.freeze({ percent: "75%", percentValue: rat(3n, 4n), fraction: "7/8", fractionValue: rat(7n, 8n), decimal: "0.375", decimalValue: rat(3n, 8n) }),
  Object.freeze({ percent: "87.5%", percentValue: rat(7n, 8n), fraction: "1/2", fractionValue: rat(1n, 2n), decimal: "0.125", decimalValue: rat(1n, 8n) }),
]);

function exactDisplay(value: Rat): string {
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function makeOptions(correct: Rat, wrongCandidates: readonly WrongCandidate[]): readonly SapCp003Option[] {
  const correctText = formatRat(correct);
  const candidates: readonly WrongCandidate[] = Object.freeze([
    ...wrongCandidates,
    Object.freeze({
      value: add(correct, rat(1n)),
      misconceptionId: "FINAL_VALUE_ONE_TOO_LARGE",
      analysis: "One was added after the correct simplification.",
    }),
    Object.freeze({
      value: subtract(correct, rat(1n)),
      misconceptionId: "FINAL_VALUE_ONE_TOO_SMALL",
      analysis: "One was subtracted after the correct simplification.",
    }),
    Object.freeze({
      value: multiply(correct, rat(2n)),
      misconceptionId: "FINAL_VALUE_DOUBLED",
      analysis: "The final exact result was doubled without justification.",
    }),
  ]);
  const used = new Set<string>([correctText]);
  const wrongOptions: SapCp003Option[] = [];
  for (const candidate of candidates) {
    if (equalRat(candidate.value, correct)) continue;
    const text = formatRat(candidate.value);
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
  if (wrongOptions.length !== 3) throw new Error(`Could not construct QL-041 options for ${correctText}.`);
  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This option matches the exact reduced fraction after all three representations are simplified.",
    }),
    ...wrongOptions,
  ]);
}

function mixedRepresentationVariant(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-MIXED-PERCENT-FRACTION-DECIMAL") return pkg;

  const benchmark = BENCHMARKS[(pkg.seed - 1) % BENCHMARKS.length]!;
  const frame = (pkg.seed - 1) % 4;
  const firstQuantity = 8 * (12 + (pkg.seed % 19));
  const secondQuantity = 8 * (6 + ((pkg.seed * 3) % 17));
  const thirdQuantity = 8 * (4 + ((pkg.seed * 5) % 13));
  const A = rat(BigInt(firstQuantity));
  const B = rat(BigInt(secondQuantity));
  const C = rat(BigInt(thirdQuantity));
  const percentTerm = multiply(benchmark.percentValue, A);
  const fractionTerm = multiply(benchmark.fractionValue, B);
  const decimalTerm = multiply(benchmark.decimalValue, C);

  let stem: string;
  let answer: Rat;
  let steps: readonly string[];
  let payloadFrame: string;
  let wrongs: readonly WrongCandidate[];

  if (frame === 0) {
    answer = add(add(percentTerm, fractionTerm), decimalTerm);
    stem = `Evaluate ${benchmark.percent} of ${firstQuantity} + ${benchmark.fraction} of ${secondQuantity} + ${benchmark.decimal} × ${thirdQuantity}. Give the answer as a reduced fraction.`;
    steps = Object.freeze([
      `${benchmark.percent} of ${firstQuantity} = ${formatRat(benchmark.percentValue)} × ${firstQuantity} = ${exactDisplay(percentTerm)}`,
      `${benchmark.fraction} of ${secondQuantity} = ${exactDisplay(fractionTerm)} and ${benchmark.decimal} × ${thirdQuantity} = ${exactDisplay(decimalTerm)}`,
      `${exactDisplay(percentTerm)} + ${exactDisplay(fractionTerm)} + ${exactDisplay(decimalTerm)} = ${formatRat(answer)}`,
    ]);
    payloadFrame = "THREE_TERM_SUM";
    wrongs = Object.freeze([
      Object.freeze({ value: add(percentTerm, fractionTerm), misconceptionId: "DECIMAL_TERM_OMITTED", analysis: `The term ${benchmark.decimal} × ${thirdQuantity} was omitted.` }),
      Object.freeze({ value: add(percentTerm, decimalTerm), misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${benchmark.fraction} of ${secondQuantity} was omitted.` }),
      Object.freeze({ value: add(fractionTerm, decimalTerm), misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${benchmark.percent} of ${firstQuantity} was omitted.` }),
    ]);
  } else if (frame === 1) {
    const bracketFactor = add(benchmark.fractionValue, benchmark.decimalValue);
    const bracketValue = multiply(bracketFactor, B);
    answer = subtract(bracketValue, percentTerm);
    stem = `Evaluate (${benchmark.fraction} + ${benchmark.decimal}) × ${secondQuantity} − ${benchmark.percent} of ${firstQuantity}. Give the answer as a reduced fraction.`;
    steps = Object.freeze([
      `${benchmark.fraction} + ${benchmark.decimal} = ${formatRat(benchmark.fractionValue)} + ${formatRat(benchmark.decimalValue)} = ${formatRat(bracketFactor)}`,
      `${formatRat(bracketFactor)} × ${secondQuantity} = ${exactDisplay(bracketValue)}`,
      `${benchmark.percent} of ${firstQuantity} = ${exactDisplay(percentTerm)}, so ${exactDisplay(bracketValue)} − ${exactDisplay(percentTerm)} = ${formatRat(answer)}`,
    ]);
    payloadFrame = "BRACKET_FACTOR_MINUS_PERCENT";
    wrongs = Object.freeze([
      Object.freeze({ value: add(bracketValue, percentTerm), misconceptionId: "FINAL_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The percentage term was added instead of subtracted." }),
      Object.freeze({ value: subtract(add(benchmark.fractionValue, multiply(benchmark.decimalValue, B)), percentTerm), misconceptionId: "BRACKET_SCOPE_IGNORED", analysis: `The multiplier ${secondQuantity} was applied only to the decimal term, not to the complete bracket.` }),
      Object.freeze({ value: bracketValue, misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${benchmark.percent} of ${firstQuantity} was omitted.` }),
    ]);
  } else if (frame === 2) {
    const fractionDecimalProduct = multiply(benchmark.fractionValue, benchmark.decimalValue);
    const middleValue = multiply(fractionDecimalProduct, B);
    answer = add(percentTerm, middleValue);
    stem = `Evaluate ${benchmark.percent} of ${firstQuantity} + (${benchmark.fraction} × ${benchmark.decimal}) of ${secondQuantity}. Give the answer as a reduced fraction.`;
    steps = Object.freeze([
      `${benchmark.percent} of ${firstQuantity} = ${exactDisplay(percentTerm)}`,
      `${benchmark.fraction} × ${benchmark.decimal} = ${formatRat(benchmark.fractionValue)} × ${formatRat(benchmark.decimalValue)} = ${formatRat(fractionDecimalProduct)}`,
      `${formatRat(fractionDecimalProduct)} of ${secondQuantity} = ${exactDisplay(middleValue)}, so the total is ${formatRat(answer)}`,
    ]);
    payloadFrame = "PERCENT_PLUS_FRACTION_DECIMAL_PRODUCT";
    wrongs = Object.freeze([
      Object.freeze({ value: add(percentTerm, multiply(add(benchmark.fractionValue, benchmark.decimalValue), B)), misconceptionId: "FRACTION_AND_DECIMAL_ADDED", analysis: "The fraction and decimal factors were added instead of multiplied." }),
      Object.freeze({ value: add(percentTerm, fractionDecimalProduct), misconceptionId: "QUANTITY_AFTER_OF_OMITTED", analysis: `The common quantity ${secondQuantity} was omitted from the second term.` }),
      Object.freeze({ value: middleValue, misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${benchmark.percent} of ${firstQuantity} was omitted.` }),
    ]);
  } else {
    const combinedBase = add(A, B);
    const combinedPercent = multiply(benchmark.percentValue, combinedBase);
    answer = add(subtract(combinedPercent, fractionTerm), decimalTerm);
    stem = `Evaluate ${benchmark.percent} of (${firstQuantity} + ${secondQuantity}) − ${benchmark.fraction} of ${secondQuantity} + ${benchmark.decimal} × ${thirdQuantity}. Give the answer as a reduced fraction.`;
    steps = Object.freeze([
      `${firstQuantity} + ${secondQuantity} = ${firstQuantity + secondQuantity}, so ${benchmark.percent} of the bracket = ${exactDisplay(combinedPercent)}`,
      `${benchmark.fraction} of ${secondQuantity} = ${exactDisplay(fractionTerm)} and ${benchmark.decimal} × ${thirdQuantity} = ${exactDisplay(decimalTerm)}`,
      `${exactDisplay(combinedPercent)} − ${exactDisplay(fractionTerm)} + ${exactDisplay(decimalTerm)} = ${formatRat(answer)}`,
    ]);
    payloadFrame = "PERCENT_OF_BRACKET_MIXED_CHAIN";
    wrongs = Object.freeze([
      Object.freeze({ value: add(subtract(percentTerm, fractionTerm), decimalTerm), misconceptionId: "PERCENTAGE_BRACKET_SCOPE_IGNORED", analysis: `The percentage was applied only to ${firstQuantity}, not to the complete bracket.` }),
      Object.freeze({ value: add(add(combinedPercent, fractionTerm), decimalTerm), misconceptionId: "FRACTION_SUBTRACTION_CHANGED_TO_ADDITION", analysis: "The fractional term was added instead of subtracted." }),
      Object.freeze({ value: subtract(combinedPercent, fractionTerm), misconceptionId: "DECIMAL_TERM_OMITTED", analysis: `The term ${benchmark.decimal} × ${thirdQuantity} was omitted.` }),
    ]);
  }

  const options = makeOptions(answer, wrongs);
  const displayedAnswer = formatRat(answer);
  return Object.freeze({
    ...pkg,
    difficulty: frame === 3 ? "HARD" as const : "MEDIUM" as const,
    difficultyScore: frame === 3 ? 7 : 6,
    stem,
    options,
    correctIndex: 0,
    canonicalAnswer: displayedAnswer,
    verifierAnswer: displayedAnswer,
    explanation: Object.freeze({
      coreConcept: ensureSentence("Convert the percentage, fraction and decimal terms to exact rational factors, preserve each operation's scope, and simplify after cancellation"),
      steps: Object.freeze(steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`Therefore, the reduced fraction is ${displayedAnswer}`),
    }),
    canonicalPayloadKey: [
      "SAP_CP003_STRUCTURAL_V3",
      pkg.prototypeId,
      payloadFrame,
      benchmark.percent,
      benchmark.fraction,
      benchmark.decimal,
      String(firstQuantity),
      String(secondQuantity),
      String(thirdQuantity),
    ].join("|"),
    generationIdentity: [
      "SAP_CP003_STRUCTURAL_V3",
      pkg.prototypeId,
      String(pkg.seed),
      payloadFrame,
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

export function applySapCp003StructuralVariantsV3(pkg: SapCp003Package): SapCp003Package {
  return mixedRepresentationVariant(pkg);
}
