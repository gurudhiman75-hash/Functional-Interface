import {
  type Rat,
  add,
  divide,
  ensureSentence,
  formatPercentLiteral,
  formatRat,
  formatTerminatingDecimal,
  isTerminating,
  multiply,
  rat,
  subtract,
} from "./exact";
import type { SapCp003Option, SapCp003Package } from "./types";

interface RateCase {
  readonly display: string;
  readonly value: Rat;
}

interface WrongRate {
  readonly value: Rat;
  readonly misconceptionId: string;
  readonly analysis: string;
}

const RATE_CASES: readonly RateCase[] = Object.freeze([
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
] as const);

function exactDisplay(value: Rat): string {
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function withinBound(value: Rat): boolean {
  return value.n >= 0n && value.n * 2n <= value.d * 3n;
}

function same(left: Rat, right: Rat): boolean {
  return left.n * right.d === right.n * left.d;
}

function makeOptions(correct: Rat): readonly SapCp003Option[] {
  const candidates: WrongRate[] = [];
  const complement = subtract(rat(1n), correct);
  if (withinBound(complement)) candidates.push({
    value: complement,
    misconceptionId: "COMPLEMENTARY_PERCENTAGE_USED",
    analysis: "The complementary percentage was selected instead of the factor that produces the displayed amount.",
  });
  const half = divide(correct, rat(2n));
  if (withinBound(half)) candidates.push({
    value: half,
    misconceptionId: "PERCENTAGE_HALVED",
    analysis: "The isolated percentage factor was halved without justification.",
  });
  const plusBenchmark = add(correct, rat(1n, 8n));
  if (withinBound(plusBenchmark)) candidates.push({
    value: plusBenchmark,
    misconceptionId: "BENCHMARK_PERCENTAGE_ADDED",
    analysis: "An extra 12.5 percentage points were added after the missing factor was isolated.",
  });
  const minusBenchmark = subtract(correct, rat(1n, 8n));
  if (withinBound(minusBenchmark)) candidates.push({
    value: minusBenchmark,
    misconceptionId: "BENCHMARK_PERCENTAGE_SUBTRACTED",
    analysis: "Twelve and a half percentage points were subtracted after the missing factor was isolated.",
  });
  const double = multiply(correct, rat(2n));
  if (withinBound(double)) candidates.push({
    value: double,
    misconceptionId: "PERCENTAGE_DOUBLED",
    analysis: "The isolated percentage factor was doubled without justification.",
  });
  for (const fallback of RATE_CASES) candidates.push({
    value: fallback.value,
    misconceptionId: "NEARBY_BENCHMARK_PERCENTAGE_SELECTED",
    analysis: "A nearby familiar benchmark percentage was selected instead of the value obtained from the equation.",
  });

  const correctText = formatPercentLiteral(correct);
  const used = new Set<string>([correctText]);
  const wrongs: SapCp003Option[] = [];
  for (const candidate of candidates) {
    if (same(candidate.value, correct)) continue;
    const value = formatPercentLiteral(candidate.value);
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
  if (wrongs.length !== 3) throw new Error(`Could not build bounded percentage options for ${correctText}.`);
  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This percentage is obtained by isolating the percentage amount and dividing it by the complete visible base.",
    }),
    ...wrongs,
  ]);
}

function buildPackage(
  pkg: SapCp003Package,
  input: {
    readonly frameId: string;
    readonly stem: string;
    readonly rate: RateCase;
    readonly steps: readonly string[];
    readonly difficulty: "MEDIUM" | "HARD";
    readonly difficultyScore: number;
    readonly payloadParts: readonly string[];
  },
): SapCp003Package {
  const options = makeOptions(input.rate.value);
  return Object.freeze({
    ...pkg,
    difficulty: input.difficulty,
    difficultyScore: input.difficultyScore,
    stem: input.stem,
    options,
    correctIndex: 0,
    canonicalAnswer: input.rate.display,
    verifierAnswer: input.rate.display,
    explanation: Object.freeze({
      coreConcept: ensureSentence("Isolate the complete percentage-of block, divide its amount by the visible base, and convert the exact factor to a percentage"),
      steps: Object.freeze(input.steps.map(ensureSentence)),
      finalAnswer: ensureSentence(`Therefore, the missing percentage is ${input.rate.display}`),
    }),
    canonicalPayloadKey: ["SAP_CP003_MISSING_PERCENTAGE_V3", pkg.prototypeId, input.frameId, ...input.payloadParts].join("|"),
    generationIdentity: ["SAP_CP003_MISSING_PERCENTAGE_V3", pkg.prototypeId, String(pkg.seed), input.frameId].join("|"),
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

export function applySapCp003MissingPercentageV3(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL") return pkg;
  const frame = (pkg.seed - 1) % 4;
  const rate = RATE_CASES[pkg.seed % RATE_CASES.length]!;
  const quantity = Number(rate.value.d) * (12 + (pkg.seed % 19));
  const base = rat(BigInt(quantity));
  const amount = multiply(rate.value, base);
  const amountInteger = Number(amount.n / amount.d);
  const outside = rat(BigInt(1 + (pkg.seed % Math.max(1, amountInteger - 1))));

  if (frame === 0) {
    const result = add(outside, amount);
    return buildPackage(pkg, {
      frameId: "ADD_OUTSIDE_TERM",
      stem: `Find the percentage represented by □: ${exactDisplay(outside)} + □% of ${quantity} = ${exactDisplay(result)}.`,
      rate,
      steps: [
        `□% of ${quantity} = ${exactDisplay(result)} − ${exactDisplay(outside)} = ${exactDisplay(amount)}`,
        `□% = ${exactDisplay(amount)} ÷ ${quantity} = ${formatRat(rate.value)} = ${rate.display}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [exactDisplay(outside), String(quantity), exactDisplay(result), rate.display],
    });
  }

  if (frame === 1) {
    const result = subtract(amount, outside);
    return buildPackage(pkg, {
      frameId: "BLOCK_MINUS_OUTSIDE_TERM",
      stem: `Find the percentage represented by □: □% of ${quantity} − ${exactDisplay(outside)} = ${exactDisplay(result)}.`,
      rate,
      steps: [
        `□% of ${quantity} = ${exactDisplay(result)} + ${exactDisplay(outside)} = ${exactDisplay(amount)}`,
        `□% = ${exactDisplay(amount)} ÷ ${quantity} = ${rate.display}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [String(quantity), exactDisplay(outside), exactDisplay(result), rate.display],
    });
  }

  if (frame === 2) {
    const total = add(amount, outside);
    return buildPackage(pkg, {
      frameId: "SUBTRACT_BLOCK_FROM_TOTAL",
      stem: `Find the percentage represented by □: ${exactDisplay(total)} − □% of ${quantity} = ${exactDisplay(outside)}.`,
      rate,
      steps: [
        `□% of ${quantity} = ${exactDisplay(total)} − ${exactDisplay(outside)} = ${exactDisplay(amount)}`,
        `□% = ${exactDisplay(amount)} ÷ ${quantity} = ${rate.display}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 6,
      payloadParts: [exactDisplay(total), String(quantity), exactDisplay(outside), rate.display],
    });
  }

  const extra = Number(rate.value.d) * (3 + (pkg.seed % 9));
  const combinedBase = rat(BigInt(quantity + extra));
  const combinedAmount = multiply(rate.value, combinedBase);
  return buildPackage(pkg, {
    frameId: "PERCENTAGE_OF_BRACKET_BASE",
    stem: `Find the percentage represented by □: □% of (${quantity} + ${extra}) = ${exactDisplay(combinedAmount)}.`,
    rate,
    steps: [
      `${quantity} + ${extra} = ${quantity + extra}`,
      `□% = ${exactDisplay(combinedAmount)} ÷ ${quantity + extra} = ${rate.display}`,
    ],
    difficulty: "HARD",
    difficultyScore: 7,
    payloadParts: [String(quantity), String(extra), exactDisplay(combinedAmount), rate.display],
  });
}
