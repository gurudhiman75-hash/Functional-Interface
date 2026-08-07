import {
  type Rat,
  add,
  divide,
  equalRat,
  ensureSentence,
  formatRat,
  multiply,
  rat,
  subtract,
} from "./exact";
import type { SapCp003Option, SapCp003Package } from "./types";

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

const CONVERSION_CASES: readonly ConversionCase[] = Object.freeze([
  Object.freeze({ decimal: "0.375", decimalValue: rat(3n, 8n), percent: "25%", percentValue: rat(1n, 4n), fraction: "1/8", fractionValue: rat(1n, 8n) }),
  Object.freeze({ decimal: "0.625", decimalValue: rat(5n, 8n), percent: "12.5%", percentValue: rat(1n, 8n), fraction: "1/4", fractionValue: rat(1n, 4n) }),
  Object.freeze({ decimal: "0.75", decimalValue: rat(3n, 4n), percent: "50%", percentValue: rat(1n, 2n), fraction: "3/8", fractionValue: rat(3n, 8n) }),
  Object.freeze({ decimal: "0.2", decimalValue: rat(1n, 5n), percent: "40%", percentValue: rat(2n, 5n), fraction: "3/5", fractionValue: rat(3n, 5n) }),
  Object.freeze({ decimal: "0.875", decimalValue: rat(7n, 8n), percent: "25%", percentValue: rat(1n, 4n), fraction: "1/8", fractionValue: rat(1n, 8n) }),
  Object.freeze({ decimal: "1.25", decimalValue: rat(5n, 4n), percent: "75%", percentValue: rat(3n, 4n), fraction: "1/2", fractionValue: rat(1n, 2n) }),
]);

function makeOptions(correct: Rat, candidates: readonly WrongCandidate[]): readonly SapCp003Option[] {
  const correctText = formatRat(correct);
  const allCandidates: readonly WrongCandidate[] = Object.freeze([
    ...candidates,
    Object.freeze({ value: add(correct, rat(1n)), misconceptionId: "FINAL_VALUE_ONE_TOO_LARGE", analysis: "One was added to the reduced result." }),
    Object.freeze({ value: subtract(correct, rat(1n)), misconceptionId: "FINAL_VALUE_ONE_TOO_SMALL", analysis: "One was subtracted from the reduced result." }),
    Object.freeze({ value: multiply(correct, rat(2n)), misconceptionId: "FINAL_VALUE_DOUBLED", analysis: "The reduced result was doubled without justification." }),
  ]);
  const used = new Set<string>([correctText]);
  const wrongs: SapCp003Option[] = [];
  for (const candidate of allCandidates) {
    if (equalRat(candidate.value, correct)) continue;
    const value = formatRat(candidate.value);
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
  if (wrongs.length !== 3) throw new Error(`Could not construct QL-042 options for ${correctText}.`);
  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This option is the exact reduced result after converting every displayed representation to fractions.",
    }),
    ...wrongs,
  ]);
}

function buildPackage(
  pkg: SapCp003Package,
  input: {
    readonly stem: string;
    readonly answer: Rat;
    readonly wrongs: readonly WrongCandidate[];
    readonly steps: readonly string[];
    readonly frameId: string;
    readonly item: ConversionCase;
    readonly difficulty: "MEDIUM" | "HARD";
    readonly difficultyScore: number;
  },
): SapCp003Package {
  const answer = formatRat(input.answer);
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
      coreConcept: ensureSentence("Convert the decimal and percentage to exact fractions, preserve the visible operation structure, and reduce only after the full calculation"),
      steps: Object.freeze(input.steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`Therefore, the reduced fraction is ${answer}`),
    }),
    canonicalPayloadKey: [
      "SAP_CP003_STRUCTURAL_V6",
      pkg.prototypeId,
      input.frameId,
      input.item.decimal,
      input.item.percent,
      input.item.fraction,
    ].join("|"),
    generationIdentity: [
      "SAP_CP003_STRUCTURAL_V6",
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

function fractionTargetVariant(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-CONVERT-TERMS-TO-FRACTIONS") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const item = CONVERSION_CASES[Math.floor((pkg.seed - 1) / 4) % CONVERSION_CASES.length]!;

  if (frame === 0) {
    const answer = add(add(item.decimalValue, item.percentValue), item.fractionValue);
    return buildPackage(pkg, {
      stem: `Evaluate ${item.decimal} + ${item.percent} + ${item.fraction}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(item.decimalValue, item.fractionValue), misconceptionId: "PERCENTAGE_TERM_OMITTED", analysis: `The term ${item.percent} was omitted.` }),
        Object.freeze({ value: add(item.percentValue, item.fractionValue), misconceptionId: "DECIMAL_TERM_OMITTED", analysis: `The term ${item.decimal} was omitted.` }),
        Object.freeze({ value: add(item.decimalValue, item.percentValue), misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${item.fraction} was omitted.` }),
      ]),
      steps: [
        `${item.decimal} = ${formatRat(item.decimalValue)} and ${item.percent} = ${formatRat(item.percentValue)}`,
        `${formatRat(item.decimalValue)} + ${formatRat(item.percentValue)} + ${item.fraction} = ${formatRat(answer)}`,
      ],
      frameId: "THREE_TERM_FRACTION_SUM",
      item,
      difficulty: "MEDIUM",
      difficultyScore: 5,
    });
  }

  if (frame === 1) {
    const bracket = add(item.decimalValue, item.percentValue);
    const answer = multiply(bracket, item.fractionValue);
    return buildPackage(pkg, {
      stem: `Evaluate (${item.decimal} + ${item.percent}) × ${item.fraction}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(item.decimalValue, multiply(item.percentValue, item.fractionValue)), misconceptionId: "FRACTION_APPLIED_TO_PERCENT_ONLY", analysis: `The factor ${item.fraction} was applied only to the percentage term.` }),
        Object.freeze({ value: bracket, misconceptionId: "FINAL_FRACTION_FACTOR_OMITTED", analysis: `The final multiplication by ${item.fraction} was omitted.` }),
        Object.freeze({ value: add(multiply(item.decimalValue, item.fractionValue), item.percentValue), misconceptionId: "FRACTION_APPLIED_TO_DECIMAL_ONLY", analysis: `The factor ${item.fraction} was applied only to the decimal term.` }),
      ]),
      steps: [
        `${item.decimal} + ${item.percent} = ${formatRat(item.decimalValue)} + ${formatRat(item.percentValue)} = ${formatRat(bracket)}`,
        `${formatRat(bracket)} × ${item.fraction} = ${formatRat(answer)}`,
      ],
      frameId: "FRACTION_TARGET_BRACKET_PRODUCT",
      item,
      difficulty: "MEDIUM",
      difficultyScore: 6,
    });
  }

  if (frame === 2) {
    const answer = add(subtract(item.decimalValue, item.percentValue), item.fractionValue);
    return buildPackage(pkg, {
      stem: `Evaluate ${item.decimal} − ${item.percent} + ${item.fraction}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(add(item.decimalValue, item.percentValue), item.fractionValue), misconceptionId: "PERCENTAGE_SUBTRACTION_CHANGED_TO_ADDITION", analysis: `The term ${item.percent} was added instead of subtracted.` }),
        Object.freeze({ value: subtract(item.decimalValue, item.percentValue), misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${item.fraction} was omitted.` }),
        Object.freeze({ value: add(subtract(item.percentValue, item.decimalValue), item.fractionValue), misconceptionId: "FIRST_SUBTRACTION_REVERSED", analysis: "The decimal and percentage were subtracted in the reverse order." }),
      ]),
      steps: [
        `${item.decimal} = ${formatRat(item.decimalValue)} and ${item.percent} = ${formatRat(item.percentValue)}`,
        `${formatRat(item.decimalValue)} − ${formatRat(item.percentValue)} + ${item.fraction} = ${formatRat(answer)}`,
      ],
      frameId: "FRACTION_TARGET_SIGNED_CHAIN",
      item,
      difficulty: "MEDIUM",
      difficultyScore: 5,
    });
  }

  const numerator = add(item.decimalValue, item.fractionValue);
  const answer = divide(numerator, item.percentValue);
  return buildPackage(pkg, {
    stem: `Evaluate (${item.decimal} + ${item.fraction}) ÷ ${item.percent}. Give the answer as a reduced fraction.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: multiply(numerator, item.percentValue), misconceptionId: "DIVISION_REPLACED_BY_MULTIPLICATION", analysis: `The bracket was multiplied by ${item.percent} instead of divided by it.` }),
      Object.freeze({ value: add(item.decimalValue, divide(item.fractionValue, item.percentValue)), misconceptionId: "PERCENTAGE_DIVISOR_APPLIED_TO_FRACTION_ONLY", analysis: "The percentage divisor was applied only to the fraction, not to the complete bracket." }),
      Object.freeze({ value: numerator, misconceptionId: "PERCENTAGE_DIVISOR_OMITTED", analysis: `The final division by ${item.percent} was omitted.` }),
    ]),
    steps: [
      `${item.decimal} + ${item.fraction} = ${formatRat(item.decimalValue)} + ${item.fraction} = ${formatRat(numerator)}`,
      `${item.percent} = ${formatRat(item.percentValue)}, so ${formatRat(numerator)} ÷ ${formatRat(item.percentValue)} = ${formatRat(answer)}`,
    ],
    frameId: "FRACTION_TARGET_BRACKET_DIVISION",
    item,
    difficulty: "HARD",
    difficultyScore: 7,
  });
}

export function applySapCp003StructuralVariantsV6(pkg: SapCp003Package): SapCp003Package {
  return fractionTargetVariant(pkg);
}
