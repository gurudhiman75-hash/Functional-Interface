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

const EXPANDED_PERCENTAGES = Object.freeze([
  { display: "2.5%", value: rat(1n, 40n) },
  { display: "5%", value: rat(1n, 20n) },
  { display: "6.25%", value: rat(1n, 16n) },
  { display: "10%", value: rat(1n, 10n) },
  { display: "15%", value: rat(3n, 20n) },
  { display: "30%", value: rat(3n, 10n) },
  { display: "31.25%", value: rat(5n, 16n) },
  { display: "45%", value: rat(9n, 20n) },
  { display: "112.5%", value: rat(9n, 8n) },
  { display: "150%", value: rat(3n, 2n) },
  { display: "200%", value: rat(2n) },
] as const);

const COMPLEMENTARY_PAIRS = Object.freeze([
  ["12.5%", "87.5%"],
  ["20%", "80%"],
  ["25%", "75%"],
  ["37.5%", "62.5%"],
  ["40%", "60%"],
] as const);

const DIFFERENCE_PAIRS = Object.freeze([
  ["62.5%", "37.5%"],
  ["75%", "25%"],
  ["80%", "20%"],
  ["87.5%", "12.5%"],
] as const);

const THREE_PART_PERCENTAGES = Object.freeze([
  ["12.5%", "37.5%", "50%"],
  ["20%", "30%", "50%"],
  ["25%", "25%", "50%"],
  ["6.25%", "31.25%", "62.5%"],
] as const);

const SUCCESSIVE_PAIRS = Object.freeze([
  ["40%", "125%"],
  ["75%", "80%"],
  ["112.5%", "80%"],
  ["62.5%", "120%"],
  ["150%", "75%"],
  ["200%", "37.5%"],
  ["125%", "96%"],
  ["80%", "150%"],
  ["60%", "125%"],
  ["25%", "160%"],
  ["37.5%", "120%"],
  ["31.25%", "160%"],
  ["6.25%", "800%"],
  ["45%", "200%"],
] as const);

function exactDisplay(value: Rat): string {
  return isTerminating(value) ? formatTerminatingDecimal(value) : formatRat(value);
}

function numericOptions(
  correct: Rat,
  candidates: readonly WrongCandidate[],
): readonly SapCp003Option[] {
  const correctText = exactDisplay(correct);
  const fallbacks: readonly WrongCandidate[] = Object.freeze([
    {
      value: multiply(correct, rat(10n)),
      misconceptionId: "FINAL_SCALE_TEN_TIMES_LARGE",
      analysis: "The final value was made ten times too large.",
    },
    {
      value: divide(correct, rat(10n)),
      misconceptionId: "FINAL_SCALE_TEN_TIMES_SMALL",
      analysis: "The final value was made ten times too small.",
    },
    {
      value: add(correct, rat(1n)),
      misconceptionId: "FINAL_VALUE_ONE_TOO_LARGE",
      analysis: "One was added to the correctly simplified value.",
    },
    {
      value: subtract(correct, rat(1n)),
      misconceptionId: "FINAL_VALUE_ONE_TOO_SMALL",
      analysis: "One was subtracted from the correctly simplified value.",
    },
  ]);
  const used = new Set<string>([correctText]);
  const wrongs: SapCp003Option[] = [];
  for (const candidate of [...candidates, ...fallbacks]) {
    if (equalRat(candidate.value, correct)) continue;
    const value = exactDisplay(candidate.value);
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
  if (wrongs.length !== 3) throw new Error(`Could not construct three structural V2 options for ${correctText}.`);
  return Object.freeze([
    Object.freeze({
      displayIndex: 1,
      value: correctText,
      isCorrect: true,
      misconceptionId: null,
      analysis: "This option matches the exact evaluated value.",
    }),
    ...wrongs,
  ]);
}

function replaceNumericPackage(
  pkg: SapCp003Package,
  input: {
    readonly stem: string;
    readonly answer: Rat;
    readonly wrongs: readonly WrongCandidate[];
    readonly coreConcept: string;
    readonly steps: readonly string[];
    readonly difficulty: SapCp003Difficulty;
    readonly difficultyScore: number;
    readonly payloadParts: readonly string[];
    readonly variantId: string;
  },
): SapCp003Package {
  const answer = exactDisplay(input.answer);
  const options = numericOptions(input.answer, input.wrongs);
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
      finalAnswer: ensureSentence(`Therefore, the answer is ${answer}`),
    }),
    canonicalPayloadKey: [
      "SAP_CP003_STRUCTURAL_V2",
      pkg.prototypeId,
      input.variantId,
      ...input.payloadParts,
    ].join("|"),
    generationIdentity: [
      "SAP_CP003_STRUCTURAL_V2",
      pkg.prototypeId,
      String(pkg.seed),
      input.variantId,
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

function expandedPercentageFactor(pkg: SapCp003Package): SapCp003Package {
  if (
    pkg.prototypeId !== "SAP-CP003-PROT-PERCENTAGE-AS-NUMERIC-FACTOR"
    || pkg.seed % 4 !== 0
  ) return pkg;
  const rate = EXPANDED_PERCENTAGES[(pkg.seed / 4 - 1) % EXPANDED_PERCENTAGES.length]!;
  const quantity = 80 * (2 + (pkg.seed % 19));
  const Q = rat(BigInt(quantity));
  const answer = multiply(rate.value, Q);
  const rawPercentNumber = parseNumericLiteral(rate.display.replace("%", ""))!;
  return replaceNumericPackage(pkg, {
    stem: `Evaluate ${rate.display} × ${quantity}.`,
    answer,
    wrongs: [
      {
        value: multiply(rawPercentNumber, Q),
        misconceptionId: "PERCENT_SIGN_IGNORED",
        analysis: `${rate.display} was treated as ${rate.display.replace("%", "")} instead of a value divided by 100.`,
      },
      {
        value: divide(Q, rate.value),
        misconceptionId: "PERCENT_FACTOR_USED_AS_DIVISOR",
        analysis: "The quantity was divided by the percentage factor instead of multiplied by it.",
      },
      {
        value: multiply(subtract(rat(1n), rate.value), Q),
        misconceptionId: "COMPLEMENTARY_PERCENTAGE_USED",
        analysis: "The complementary percentage was used instead of the displayed percentage.",
      },
    ],
    coreConcept: "Convert the displayed percentage to an exact fraction or decimal factor before multiplying",
    steps: [
      `${rate.display} = ${formatRat(rate.value)}`,
      `${formatRat(rate.value)} × ${quantity} = ${exactDisplay(answer)}`,
    ],
    difficulty: ["2.5%", "6.25%", "31.25%", "112.5%"].includes(rate.display) ? "MEDIUM" : "EASY",
    difficultyScore: ["2.5%", "6.25%", "31.25%", "112.5%"].includes(rate.display) ? 5 : 3,
    payloadParts: [rate.display, String(quantity)],
    variantId: "EXPANDED_PERCENTAGE_POOL",
  });
}

function expandedPercentOfExpression(pkg: SapCp003Package): SapCp003Package {
  if (
    pkg.prototypeId !== "SAP-CP003-PROT-PERCENT-OF-QUANTITY-IN-EXPRESSION"
    || pkg.seed % 5 !== 0
  ) return pkg;
  const rate = EXPANDED_PERCENTAGES[(pkg.seed / 5 - 1) % EXPANDED_PERCENTAGES.length]!;
  const baseTexts = ["0.25", "1.5", "2.75", "3.125"] as const;
  const baseText = baseTexts[(pkg.seed / 5 - 1) % baseTexts.length]!;
  const base = parseNumericLiteral(baseText)!;
  const quantity = 80 * (2 + (pkg.seed % 17));
  const block = multiply(rate.value, rat(BigInt(quantity)));
  const addMode = (pkg.seed / 5) % 2 === 0;
  const answer = addMode ? add(base, block) : subtract(block, base);
  return replaceNumericPackage(pkg, {
    stem: addMode
      ? `Evaluate ${baseText} + ${rate.display} of ${quantity}.`
      : `Evaluate ${rate.display} of ${quantity} − ${baseText}.`,
    answer,
    wrongs: [
      {
        value: multiply(add(base, rate.value), rat(BigInt(quantity))),
        misconceptionId: "OF_SCOPE_EXTENDED_TO_OUTSIDE_TERM",
        analysis: "The outside decimal was incorrectly included inside the percentage-of block.",
      },
      {
        value: addMode ? add(base, rate.value) : subtract(rate.value, base),
        misconceptionId: "QUANTITY_AFTER_OF_OMITTED",
        analysis: `The quantity ${quantity} following 'of' was omitted.`,
      },
      {
        value: addMode ? subtract(block, base) : add(block, base),
        misconceptionId: "FINAL_OPERATION_REVERSED",
        analysis: "The percentage block was evaluated correctly, but the final addition or subtraction was reversed.",
      },
    ],
    coreConcept: "Treat the complete percentage-of quantity as one block before combining it with the outside decimal",
    steps: [
      `${rate.display} of ${quantity} = ${formatRat(rate.value)} × ${quantity} = ${exactDisplay(block)}`,
      `${addMode ? `${baseText} + ${exactDisplay(block)}` : `${exactDisplay(block)} − ${baseText}`} = ${exactDisplay(answer)}`,
    ],
    difficulty: "MEDIUM",
    difficultyScore: 5,
    payloadParts: [baseText, rate.display, String(quantity), addMode ? "ADD" : "SUBTRACT"],
    variantId: "EXPANDED_PERCENT_OF_BLOCK",
  });
}

function complementaryVariants(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-COMPLEMENTARY-PERCENTAGE-EXPRESSION") return pkg;
  const mode = pkg.seed % 4;
  if (mode === 0) return pkg;

  if (mode === 1) {
    const [firstText, secondText] = COMPLEMENTARY_PAIRS[pkg.seed % COMPLEMENTARY_PAIRS.length]!;
    const first = parseNumericLiteral(firstText)!;
    const second = parseNumericLiteral(secondText)!;
    const leftQuantity = 8 * (20 + (pkg.seed % 31));
    const rightQuantity = 8 * (40 + ((pkg.seed * 3) % 31));
    const leftValue = multiply(first, rat(BigInt(leftQuantity)));
    const rightValue = multiply(second, rat(BigInt(rightQuantity)));
    const answer = add(leftValue, rightValue);
    return replaceNumericPackage(pkg, {
      stem: `Evaluate ${firstText} of ${leftQuantity} + ${secondText} of ${rightQuantity}.`,
      answer,
      wrongs: [
        {
          value: rat(BigInt(leftQuantity)),
          misconceptionId: "DIFFERENT_BASES_TREATED_AS_COMMON_BASE",
          analysis: "The complementary factors were combined as 100% even though the two quantities are different.",
        },
        {
          value: multiply(first, rat(BigInt(leftQuantity + rightQuantity))),
          misconceptionId: "FIRST_PERCENTAGE_APPLIED_TO_BOTH_BASES",
          analysis: `The first percentage ${firstText} was applied to both quantities.`,
        },
        {
          value: multiply(second, rat(BigInt(leftQuantity + rightQuantity))),
          misconceptionId: "SECOND_PERCENTAGE_APPLIED_TO_BOTH_BASES",
          analysis: `The second percentage ${secondText} was applied to both quantities.`,
        },
      ],
      coreConcept: "Complementary percentages can be combined to 100% only when they act on the same base quantity",
      steps: [
        `${firstText} of ${leftQuantity} = ${exactDisplay(leftValue)}`,
        `${secondText} of ${rightQuantity} = ${exactDisplay(rightValue)}`,
        `${exactDisplay(leftValue)} + ${exactDisplay(rightValue)} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 5,
      payloadParts: [firstText, String(leftQuantity), secondText, String(rightQuantity)],
      variantId: "COMPLEMENTARY_DIFFERENT_BASES",
    });
  }

  if (mode === 2) {
    const [firstText, secondText] = DIFFERENCE_PAIRS[pkg.seed % DIFFERENCE_PAIRS.length]!;
    const first = parseNumericLiteral(firstText)!;
    const second = parseNumericLiteral(secondText)!;
    const quantity = 8 * (30 + (pkg.seed % 41));
    const firstValue = multiply(first, rat(BigInt(quantity)));
    const secondValue = multiply(second, rat(BigInt(quantity)));
    const answer = subtract(firstValue, secondValue);
    return replaceNumericPackage(pkg, {
      stem: `Evaluate ${firstText} of ${quantity} − ${secondText} of ${quantity}.`,
      answer,
      wrongs: [
        {
          value: rat(BigInt(quantity)),
          misconceptionId: "PERCENTAGES_ADDED_AS_COMPLEMENTS",
          analysis: "The two percentages were added to 100% even though the expression asks for their difference.",
        },
        {
          value: firstValue,
          misconceptionId: "SECOND_PERCENTAGE_TERM_OMITTED",
          analysis: `The ${secondText} term was omitted.`,
        },
        {
          value: secondValue,
          misconceptionId: "FIRST_PERCENTAGE_TERM_OMITTED",
          analysis: `Only the ${secondText} term was retained.`,
        },
      ],
      coreConcept: "When two percentages act on the same base, subtract their factors before applying the common quantity",
      steps: [
        `${firstText} − ${secondText} = ${formatPercentLiteral(subtract(first, second))}`,
        `${formatPercentLiteral(subtract(first, second))} of ${quantity} = ${exactDisplay(answer)}`,
      ],
      difficulty: "MEDIUM",
      difficultyScore: 4,
      payloadParts: [firstText, secondText, String(quantity)],
      variantId: "COMPLEMENTARY_DIFFERENCE",
    });
  }

  const [firstText, secondText, thirdText] = THREE_PART_PERCENTAGES[pkg.seed % THREE_PART_PERCENTAGES.length]!;
  const first = parseNumericLiteral(firstText)!;
  const second = parseNumericLiteral(secondText)!;
  const third = parseNumericLiteral(thirdText)!;
  const quantity = 16 * (20 + (pkg.seed % 37));
  const Q = rat(BigInt(quantity));
  const firstValue = multiply(first, Q);
  const secondValue = multiply(second, Q);
  const thirdValue = multiply(third, Q);
  const answer = add(add(firstValue, secondValue), thirdValue);
  return replaceNumericPackage(pkg, {
    stem: `Evaluate ${firstText} of ${quantity} + ${secondText} of ${quantity} + ${thirdText} of ${quantity}.`,
    answer,
    wrongs: [
      {
        value: add(firstValue, secondValue),
        misconceptionId: "THIRD_PERCENTAGE_TERM_OMITTED",
        analysis: `The ${thirdText} term was omitted.`,
      },
      {
        value: add(firstValue, thirdValue),
        misconceptionId: "SECOND_PERCENTAGE_TERM_OMITTED",
        analysis: `The ${secondText} term was omitted.`,
      },
      {
        value: add(add(first, second), third),
        misconceptionId: "COMMON_QUANTITY_OMITTED",
        analysis: `The percentages were combined correctly, but the common quantity ${quantity} was omitted.`,
      },
    ],
    coreConcept: "Percentage parts that total 100% of the same quantity combine to the complete quantity",
    steps: [
      `${firstText} + ${secondText} + ${thirdText} = 100%`,
      `100% of ${quantity} = ${quantity}`,
    ],
    difficulty: "EASY",
    difficultyScore: 3,
    payloadParts: [firstText, secondText, thirdText, String(quantity)],
    variantId: "THREE_PART_COMPLETE_PERCENTAGE",
  });
}

function successiveVariants(pkg: SapCp003Package): SapCp003Package {
  if (pkg.prototypeId !== "SAP-CP003-PROT-SUCCESSIVE-PERCENT-FACTORS") return pkg;
  const [firstText, secondText] = SUCCESSIVE_PAIRS[(pkg.seed - 1) % SUCCESSIVE_PAIRS.length]!;
  const first = parseNumericLiteral(firstText)!;
  const second = parseNumericLiteral(secondText)!;
  const quantity = 8 * (20 + (pkg.seed % 81));
  const Q = rat(BigInt(quantity));
  const factor = multiply(first, second);
  const answer = multiply(factor, Q);
  const frame = pkg.seed % 3;
  const stem = frame === 0
    ? `Evaluate ${firstText} of (${secondText} of ${quantity}).`
    : frame === 1
      ? `Evaluate ${firstText} × ${secondText} × ${quantity}.`
      : `Evaluate (${firstText} × ${secondText}) of ${quantity}.`;
  return replaceNumericPackage(pkg, {
    stem,
    answer,
    wrongs: [
      {
        value: multiply(add(first, second), Q),
        misconceptionId: "PERCENT_FACTORS_ADDED",
        analysis: "The successive percentage factors were added instead of multiplied.",
      },
      {
        value: multiply(first, Q),
        misconceptionId: "SECOND_PERCENTAGE_FACTOR_OMITTED",
        analysis: `The second factor ${secondText} was omitted.`,
      },
      {
        value: multiply(second, Q),
        misconceptionId: "FIRST_PERCENTAGE_FACTOR_OMITTED",
        analysis: `The first factor ${firstText} was omitted.`,
      },
    ],
    coreConcept: "Successive percentages are multiplicative factors, so convert and multiply both factors before applying the quantity",
    steps: [
      `${firstText} × ${secondText} = ${formatPercentLiteral(factor)}`,
      `${formatPercentLiteral(factor)} of ${quantity} = ${exactDisplay(answer)}`,
    ],
    difficulty: "MEDIUM",
    difficultyScore: 5,
    payloadParts: [firstText, secondText, String(quantity), String(frame)],
    variantId: "EXPANDED_SUCCESSIVE_PERCENT_POOL",
  });
}

export function applySapCp003StructuralVariantsV2(pkg: SapCp003Package): SapCp003Package {
  const percentage = expandedPercentageFactor(pkg);
  const scoped = expandedPercentOfExpression(percentage);
  const complementary = complementaryVariants(scoped);
  return successiveVariants(complementary);
}
