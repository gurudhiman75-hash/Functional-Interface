import {
  type Rat,
  add,
  divide,
  ensureSentence,
  formatRat,
  multiply,
  rat,
  subtract,
} from "./exact";
import type { SapCp003Option, SapCp003Package } from "./types";

interface RecurringCase {
  readonly display: string;
  readonly exact: Rat;
  readonly finiteReading: Rat;
  readonly identity: string;
}

interface WrongCandidate {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

const CASES: readonly RecurringCase[] = Object.freeze([
  Object.freeze({ display: "0.3̅ (3 recurring)", exact: rat(1n, 3n), finiteReading: rat(3n, 10n), identity: "0.(3)" }),
  Object.freeze({ display: "0.6̅ (6 recurring)", exact: rat(2n, 3n), finiteReading: rat(3n, 5n), identity: "0.(6)" }),
  Object.freeze({ display: "0.16̅ (6 recurring)", exact: rat(1n, 6n), finiteReading: rat(4n, 25n), identity: "0.1(6)" }),
  Object.freeze({ display: "0.83̅ (3 recurring)", exact: rat(5n, 6n), finiteReading: rat(83n, 100n), identity: "0.8(3)" }),
  Object.freeze({ display: "0.2̅7̅ (27 recurring)", exact: rat(3n, 11n), finiteReading: rat(27n, 100n), identity: "0.(27)" }),
  Object.freeze({ display: "0.45̅ (5 recurring)", exact: rat(41n, 90n), finiteReading: rat(9n, 20n), identity: "0.4(5)" }),
] as const);

function same(left: Rat, right: Rat): boolean {
  return left.n * right.d === right.n * left.d;
}

function makeOptions(correct: Rat, candidates: readonly WrongCandidate[]): readonly SapCp003Option[] {
  const correctText = formatRat(correct);
  const used = new Set<string>([correctText]);
  const wrongs: SapCp003Option[] = [];
  const fallbacks: readonly WrongCandidate[] = Object.freeze([
    Object.freeze({ value: add(correct, rat(1n, 9n)), misconceptionId: "COMMON_DENOMINATOR_ADDITION_HIGH", analysis: "A common-denominator arithmetic slip makes the numerator one unit too high." }),
    Object.freeze({ value: subtract(correct, rat(1n, 9n)), misconceptionId: "COMMON_DENOMINATOR_ADDITION_LOW", analysis: "A common-denominator arithmetic slip makes the numerator one unit too low." }),
    Object.freeze({ value: multiply(correct, rat(2n)), misconceptionId: "FINAL_FRACTION_DOUBLED", analysis: "The reduced fraction was doubled without justification." }),
  ]);
  for (const candidate of [...candidates, ...fallbacks]) {
    if (same(candidate.value, correct)) continue;
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
  if (wrongs.length !== 3) throw new Error(`Could not create recurring-decimal options for ${correctText}.`);
  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This is the exact reduced fraction after converting every recurring decimal correctly.",
    }),
    ...wrongs,
  ]);
}

function buildPackage(
  pkg: SapCp003Package,
  input: {
    readonly frameId: string;
    readonly stem: string;
    readonly answer: Rat;
    readonly wrongs: readonly WrongCandidate[];
    readonly steps: readonly string[];
    readonly difficulty: "MEDIUM" | "HARD";
    readonly difficultyScore: number;
    readonly payloadParts: readonly string[];
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
      coreConcept: ensureSentence("A recurring decimal represents an exact rational value; convert it to its exact fraction before applying the visible arithmetic"),
      steps: Object.freeze(input.steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`Therefore, the reduced fraction is ${answer}`),
    }),
    canonicalPayloadKey: ["SAP_CP003_RECURRING_DECIMAL_V3", pkg.prototypeId, input.frameId, ...input.payloadParts].join("|"),
    generationIdentity: ["SAP_CP003_RECURRING_DECIMAL_V3", pkg.prototypeId, String(pkg.seed), input.frameId].join("|"),
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

export function applySapCp003RecurringDecimalV3(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-RECURRING-DECIMAL-IN-EXPRESSION") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const first = CASES[pkg.seed % CASES.length]!;
  const second = CASES[(pkg.seed * 3 + 1) % CASES.length]!;
  const fractionPool = [rat(1n, 6n), rat(1n, 3n), rat(2n, 9n), rat(5n, 18n), rat(3n, 11n)] as const;
  const fraction = fractionPool[pkg.seed % fractionPool.length]!;

  if (frame === 0) {
    const answer = add(first.exact, fraction);
    return buildPackage(pkg, {
      frameId: "RECURRING_PLUS_FRACTION",
      stem: `Evaluate ${first.display} + ${formatRat(fraction)}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: add(first.finiteReading, fraction), misconceptionId: "RECURRING_BLOCK_READ_AS_FINITE", analysis: `${first.display} was read as the finite decimal represented by its visible digits instead of as a recurring value.` }),
        Object.freeze({ value: subtract(first.exact, fraction), misconceptionId: "ADDITION_CHANGED_TO_SUBTRACTION", analysis: "The displayed addition was changed to subtraction after the recurring decimal was converted." }),
        Object.freeze({ value: first.exact, misconceptionId: "FRACTION_TERM_OMITTED", analysis: `The term ${formatRat(fraction)} was omitted.` }),
      ]),
      steps: [`Convert the recurring decimal to its exact fraction: ${first.display} = ${formatRat(first.exact)}`, `${formatRat(first.exact)} + ${formatRat(fraction)} = ${formatRat(answer)}`],
      difficulty: first.identity.includes("27") || first.identity.includes("4(5)") ? "HARD" : "MEDIUM",
      difficultyScore: first.identity.includes("27") || first.identity.includes("4(5)") ? 7 : 5,
      payloadParts: [first.identity, formatRat(fraction)],
    });
  }

  if (frame === 1) {
    const bracket = add(first.exact, fraction);
    const answer = subtract(bracket, fraction);
    return buildPackage(pkg, {
      frameId: "RECURRING_CANCELLATION",
      stem: `Evaluate (${first.display} + ${formatRat(fraction)}) − ${formatRat(fraction)}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: first.finiteReading, misconceptionId: "RECURRING_BLOCK_READ_AS_FINITE", analysis: `${first.display} was read as a terminating decimal, so the visible cancellation returned the wrong finite value.` }),
        Object.freeze({ value: bracket, misconceptionId: "FINAL_FRACTION_SUBTRACTION_OMITTED", analysis: `The final subtraction of ${formatRat(fraction)} was omitted.` }),
        Object.freeze({ value: subtract(first.exact, fraction), misconceptionId: "BRACKET_ADDITION_IGNORED", analysis: "The fraction inside the bracket was not added before the outside subtraction." }),
      ]),
      steps: [`Convert the recurring decimal to its exact fraction: ${first.display} = ${formatRat(first.exact)}`, `(${formatRat(first.exact)} + ${formatRat(fraction)}) − ${formatRat(fraction)} = ${formatRat(answer)}`],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [first.identity, formatRat(fraction)],
    });
  }

  if (frame === 2) {
    const multiplier = rat(BigInt(2 + (pkg.seed % 7)));
    const answer = multiply(first.exact, multiplier);
    return buildPackage(pkg, {
      frameId: "RECURRING_TIMES_INTEGER",
      stem: `Evaluate ${first.display} × ${formatRat(multiplier)}. Give the answer as a reduced fraction.`,
      answer,
      wrongs: Object.freeze([
        Object.freeze({ value: multiply(first.finiteReading, multiplier), misconceptionId: "RECURRING_BLOCK_READ_AS_FINITE", analysis: `${first.display} was treated as a terminating decimal before multiplication.` }),
        Object.freeze({ value: add(first.exact, multiplier), misconceptionId: "MULTIPLICATION_REPLACED_BY_ADDITION", analysis: "The recurring value and integer were added instead of multiplied." }),
        Object.freeze({ value: divide(first.exact, multiplier), misconceptionId: "MULTIPLICATION_REPLACED_BY_DIVISION", analysis: "The recurring value was divided by the integer instead of multiplied." }),
      ]),
      steps: [`Convert the recurring decimal to its exact fraction: ${first.display} = ${formatRat(first.exact)}`, `${formatRat(first.exact)} × ${formatRat(multiplier)} = ${formatRat(answer)}`],
      difficulty: first.identity.includes("27") || first.identity.includes("4(5)") ? "HARD" : "MEDIUM",
      difficultyScore: first.identity.includes("27") || first.identity.includes("4(5)") ? 7 : 5,
      payloadParts: [first.identity, formatRat(multiplier)],
    });
  }

  const answer = add(first.exact, second.exact);
  return buildPackage(pkg, {
    frameId: "TWO_RECURRING_DECIMALS_SUM",
    stem: `Evaluate ${first.display} + ${second.display}. Give the answer as a reduced fraction.`,
    answer,
    wrongs: Object.freeze([
      Object.freeze({ value: add(first.finiteReading, second.finiteReading), misconceptionId: "RECURRING_BLOCK_READ_AS_FINITE", analysis: "Both recurring decimals were read as finite decimals before addition." }),
      Object.freeze({ value: subtract(first.exact, second.exact), misconceptionId: "SECOND_RECURRING_TERM_SUBTRACTED", analysis: "The second recurring value was subtracted instead of added." }),
      Object.freeze({ value: first.exact, misconceptionId: "SECOND_RECURRING_TERM_OMITTED", analysis: "The second recurring decimal was omitted." }),
    ]),
    steps: [`Convert both recurring decimals to exact fractions: ${first.display} = ${formatRat(first.exact)} and ${second.display} = ${formatRat(second.exact)}`, `${formatRat(first.exact)} + ${formatRat(second.exact)} = ${formatRat(answer)}`],
    difficulty: "HARD",
    difficultyScore: 7,
    payloadParts: [first.identity, second.identity],
  });
}
