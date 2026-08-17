export const SAP_CP010_POLICY = "BENCHMARK_BRACKETING_AND_DECLARED_ROUNDING" as const;

export const SAP_CP010_PROTOTYPE_IDS = [
  "SAP-CP010-PROT-SQRT-INTERVAL",
  "SAP-CP010-PROT-CBRT-INTERVAL",
  "SAP-CP010-PROT-FOURTH-ROOT-INTERVAL",
  "SAP-CP010-PROT-NEAREST-INTEGER-SQRT",
  "SAP-CP010-PROT-NEAREST-INTEGER-CBRT",
  "SAP-CP010-PROT-INTEGER-ROOT-BOUND",
  "SAP-CP010-PROT-DECIMAL-POWER-ESTIMATE",
  "SAP-CP010-PROT-PERCENT-POWER-FACTOR",
  "SAP-CP010-PROT-RECIPROCAL-BENCHMARK",
  "SAP-CP010-PROT-ROOT-PRODUCT",
  "SAP-CP010-PROT-ROOT-QUOTIENT",
  "SAP-CP010-PROT-MIXED-POWER-ROOT",
  "SAP-CP010-PROT-MISSING-RADICAND",
  "SAP-CP010-PROT-MISSING-POWER-BASE",
  "SAP-CP010-PROT-NEAREST-OPTION-SPECIAL-FORM",
  "SAP-CP010-PROT-COMPARE-ROOT-POWER",
  "SAP-CP010-PROT-WRONG-BENCHMARK-DIAGNOSIS",
] as const;

export type SapCp010PrototypeId = (typeof SAP_CP010_PROTOTYPE_IDS)[number];

export const SAP_CP010_CATALOGUE = Object.freeze([
  ["SAP-QL-166", "Square-root interval from nearby perfect squares", "EASY"],
  ["SAP-QL-167", "Cube-root interval from nearby perfect cubes", "EASY"],
  ["SAP-QL-168", "Bounded higher-root interval", "MEDIUM"],
  ["SAP-QL-169", "Nearest integer square root", "EASY"],
  ["SAP-QL-170", "Nearest integer cube root", "MEDIUM"],
  ["SAP-QL-171", "Greatest lower or least upper integer root bound", "MEDIUM"],
  ["SAP-QL-172", "Small decimal power estimate", "EASY"],
  ["SAP-QL-173", "Percentage power-factor estimate", "MEDIUM"],
  ["SAP-QL-174", "Reciprocal near an integer benchmark", "EASY"],
  ["SAP-QL-175", "Approximate product of roots", "MEDIUM"],
  ["SAP-QL-176", "Approximate quotient of roots", "MEDIUM"],
  ["SAP-QL-177", "Mixed bounded power-root estimate", "MEDIUM"],
  ["SAP-QL-178", "Missing radicand under nearest-integer root", "MEDIUM"],
  ["SAP-QL-179", "Missing base under bounded approximate power", "MEDIUM"],
  ["SAP-QL-180", "Nearest option for a root or power estimate", "MEDIUM"],
  ["SAP-QL-181", "Compare approximate root and power values", "MEDIUM"],
  ["SAP-QL-182", "Diagnose a wrong root benchmark", "MEDIUM"],
].map(([proposedPermanentQlId, title, difficulty], index) => Object.freeze({
  prototypeId: SAP_CP010_PROTOTYPE_IDS[index]!,
  proposedPermanentQlId: proposedPermanentQlId as `SAP-QL-${string}`,
  title,
  difficulty: difficulty as SapCp010Difficulty,
}))) as readonly SapCp010CatalogueEntry[];

export type SapCp010Difficulty = "EASY" | "MEDIUM" | "HARD";

export interface SapCp010CatalogueEntry {
  readonly prototypeId: SapCp010PrototypeId;
  readonly proposedPermanentQlId: `SAP-QL-${string}`;
  readonly title: string;
  readonly difficulty: SapCp010Difficulty;
}

export interface SapCp010Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapCp010Package {
  readonly checkpointId: "SAP-CP-010";
  readonly prototypeId: SapCp010PrototypeId;
  readonly proposedPermanentQlId: `SAP-QL-${string}`;
  readonly seed: number;
  readonly difficulty: SapCp010Difficulty;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly SapCp010Option[];
  readonly correctIndex: number;
  readonly explanation: Readonly<{
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    verification: readonly string[];
  }>;
  readonly oracle: Readonly<{ kind: SapCp010PrototypeId; data: Readonly<Record<string, number | string>> }>;
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
  readonly validation: Readonly<{ ok: boolean; errors: readonly string[] }>;
  readonly lifecycle: Readonly<{
    permanentQlId: null;
    contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  }>;
}

const LIFECYCLE = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

function correctPosition(seed: number, mode: number): number {
  return ((seed - 1) + mode) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp010Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function optionSet(answer: string, seed: number, mode: number, wrongs: readonly SapCp010Option[]): readonly SapCp010Option[] {
  const unique = wrongs.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: CP010 distractors collapsed in mode ${mode}.`);
  const correct = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." }) as SapCp010Option;
  const options = [...unique.slice(0, 3)];
  options.splice(correctPosition(seed, mode), 0, correct);
  return Object.freeze(options);
}

function formatDecimal(value: number, places = 6): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function build(
  prototypeId: SapCp010PrototypeId,
  seed: number,
  args: {
    stem: string;
    answer: string;
    options: readonly SapCp010Option[];
    data: Readonly<Record<string, number | string>>;
    concept: string;
    steps: readonly string[];
    verification: readonly string[];
    difficulty?: SapCp010Difficulty;
  },
): SapCp010Package {
  const mode = SAP_CP010_PROTOTYPE_IDS.indexOf(prototypeId);
  const meta = SAP_CP010_CATALOGUE[mode]!;
  const correctIndex = args.options.findIndex((option) => option.isCorrect);
  const errors: string[] = [];
  if (args.options.length !== 4 || new Set(args.options.map((option) => option.value)).size !== 4) errors.push("Four distinct options required.");
  if (args.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (args.options[correctIndex]?.value !== args.answer) errors.push("Correct option mismatch.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  if (args.stem.length > 220) errors.push("Stem too long for exam presentation.");
  const studentText = `${args.stem} ${args.answer} ${args.options.map((o) => o.value).join(" ")} ${args.concept} ${args.steps.join(" ")} ${args.verification.join(" ")}`;
  if (/oracle|runtime|prototype|canonical|internal|guard|apply the declared|machine policy/i.test(studentText)) errors.push("Internal wording leaked.");
  if (/-?\d+\.\d{6,}/.test(studentText)) errors.push("Long floating-point display leaked.");
  const data = Object.freeze({ ...args.data, runtimeVersion: 1 });
  return Object.freeze({
    checkpointId: "SAP-CP-010",
    prototypeId,
    proposedPermanentQlId: meta.proposedPermanentQlId,
    seed,
    difficulty: args.difficulty ?? meta.difficulty,
    stem: args.stem,
    canonicalAnswer: args.answer,
    options: args.options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze([...args.steps]),
      finalAnswer: `Answer: ${args.answer}.`,
      verification: Object.freeze([...args.verification]),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: args.stem, answer: args.answer, data }),
    generationIdentity: `${prototypeId}:v1:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}

function squareRootInterval(seed: number): SapCp010Package {
  const mode = 0;
  const k = 10 + ((seed - 1) % 25);
  const block = Math.floor((seed - 1) / 25);
  const n = k * k + 1 + 2 * block;
  const answer = `${k} < √${n} < ${k + 1}`;
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Between which two consecutive integers does √${n} lie?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(`${k - 1} < √${n} < ${k}`, "LOWER_SQUARE", "The radicand is already greater than the next perfect square."),
      wrong(`${k + 1} < √${n} < ${k + 2}`, "UPPER_SQUARE", "The radicand is smaller than the square of the lower endpoint shown."),
      wrong(`${k} < √${n} < ${k + 2}`, "NON_CONSECUTIVE", "The question asks for consecutive integer bounds."),
    ]),
    data: { n, lower: k, upper: k + 1, degree: 2 },
    concept: "Bracket the radicand between consecutive perfect squares.",
    steps: [`${k}² = ${k * k} and ${k + 1}² = ${(k + 1) * (k + 1)}.`, `${k * k} < ${n} < ${(k + 1) * (k + 1)}, so ${answer}.`],
    verification: ["The radicand is not a perfect square.", "The two bounds are consecutive integers."],
  });
}

function cubeRootInterval(seed: number): SapCp010Package {
  const mode = 1;
  const k = 3 + ((seed - 1) % 10);
  const block = Math.floor((seed - 1) / 10);
  const n = k ** 3 + 1 + 3 * block;
  const answer = `${k} < ∛${n} < ${k + 1}`;
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Between which two consecutive integers does ∛${n} lie?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(`${k - 1} < ∛${n} < ${k}`, "LOWER_CUBE", "The radicand is greater than the cube of the upper endpoint shown."),
      wrong(`${k + 1} < ∛${n} < ${k + 2}`, "UPPER_CUBE", "The radicand is below the next perfect cube."),
      wrong(`${k} < ∛${n} < ${k + 2}`, "NON_CONSECUTIVE", "The required bounds must be consecutive integers."),
    ]),
    data: { n, lower: k, upper: k + 1, degree: 3 },
    concept: "Bracket the radicand between consecutive perfect cubes.",
    steps: [`${k}³ = ${k ** 3} and ${k + 1}³ = ${(k + 1) ** 3}.`, `${k ** 3} < ${n} < ${(k + 1) ** 3}, so ${answer}.`],
    verification: ["The radicand is not a perfect cube.", "The interval is determined by exact cube benchmarks."],
  });
}

function fourthRootInterval(seed: number): SapCp010Package {
  const mode = 2;
  const k = 2 + ((seed - 1) % 8);
  const block = Math.floor((seed - 1) / 8);
  const n = k ** 4 + 1 + block;
  const answer = `${k} < ∜${n} < ${k + 1}`;
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Between which two consecutive integers does ∜${n} lie?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(`${k - 1} < ∜${n} < ${k}`, "LOWER_FOURTH_POWER", "The radicand is greater than the fourth power of the upper endpoint shown."),
      wrong(`${k + 1} < ∜${n} < ${k + 2}`, "UPPER_FOURTH_POWER", "The radicand is below the next fourth power."),
      wrong(`${k} < ∜${n} < ${k + 2}`, "NON_CONSECUTIVE", "The required integer bounds are consecutive."),
    ]),
    data: { n, lower: k, upper: k + 1, degree: 4 },
    concept: "Use nearby exact fourth powers as benchmarks.",
    steps: [`${k}⁴ = ${k ** 4} and ${k + 1}⁴ = ${(k + 1) ** 4}.`, `${k ** 4} < ${n} < ${(k + 1) ** 4}, so ${answer}.`],
    verification: ["Only exact integer powers are used.", "No decimal root algorithm is required."],
  });
}

function nearestIntegerSqrt(seed: number): SapCp010Package {
  const mode = 3;
  const k = 10 + ((seed - 1) % 25);
  const block = Math.floor((seed - 1) / 25);
  const d = 1 + block;
  const lowerCase = seed % 2 === 1;
  const n = lowerCase ? k * k + d : (k + 1) * (k + 1) - d;
  const answerNumber = lowerCase ? k : k + 1;
  const answer = String(answerNumber);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `√${n} is nearest to which integer?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String(answerNumber - 1), "ONE_LOW", "This is one integer below the nearest benchmark."),
      wrong(String(answerNumber + 1), "ONE_HIGH", "This is one integer above the nearest benchmark."),
      wrong(String(answerNumber + 2), "TWO_HIGH", "This lies too far above the root."),
    ]),
    data: { n, k, answer: answerNumber, threshold4: (2 * k + 1) ** 2, scaledN: 4 * n },
    concept: "First bracket the square root, then decide which integer it is closer to.",
    steps: [`${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}, so √${n} lies between ${k} and ${k + 1}.`, lowerCase ? `√${n} < ${k}.5, so it is nearer to ${k}.` : `√${n} > ${k}.5, so it is nearer to ${k + 1}.`],
    verification: [`Compare 4 × ${n} = ${4 * n} with ${(2 * k + 1)}² = ${(2 * k + 1) ** 2}; this checks the half-way point without decimal approximation.`],
  });
}

function nearestIntegerCbrt(seed: number): SapCp010Package {
  const mode = 4;
  const k = 3 + ((seed - 1) % 10);
  const block = Math.floor((seed - 1) / 10);
  const d = 1 + 2 * block;
  const lowerCase = seed % 2 === 1;
  const n = lowerCase ? k ** 3 + d : (k + 1) ** 3 - d;
  const answerNumber = lowerCase ? k : k + 1;
  const answer = String(answerNumber);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `∛${n} is nearest to which integer?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String(answerNumber - 1), "ONE_LOW", "This is below the nearest cube-root benchmark."),
      wrong(String(answerNumber + 1), "ONE_HIGH", "This is above the nearest cube-root benchmark."),
      wrong(String(answerNumber + 2), "TWO_HIGH", "This lies too far above the cube root."),
    ]),
    data: { n, k, answer: answerNumber, threshold8: (2 * k + 1) ** 3, scaledN: 8 * n },
    concept: "Bracket the cube root, then compare it with the half-way point between the two integers.",
    steps: [`${k}³ = ${k ** 3} and ${k + 1}³ = ${(k + 1) ** 3}, so ∛${n} lies between ${k} and ${k + 1}.`, lowerCase ? `∛${n} < ${k}.5, so ${answerNumber} is nearer.` : `∛${n} > ${k}.5, so ${answerNumber} is nearer.`],
    verification: [`Compare 8 × ${n} = ${8 * n} with ${(2 * k + 1)}³ = ${(2 * k + 1) ** 3}.`],
  });
}

function integerRootBound(seed: number): SapCp010Package {
  const mode = 5;
  const degree = seed % 2 === 0 ? 2 : 3;
  const k = degree === 2 ? 12 + ((seed - 1) % 20) : 4 + ((seed - 1) % 9);
  const block = Math.floor((seed - 1) / (degree === 2 ? 20 : 9));
  const n = k ** degree + 1 + block;
  const lowerQuestion = seed % 4 < 2;
  const rootSymbol = degree === 2 ? `√${n}` : `∛${n}`;
  const answerNumber = lowerQuestion ? k : k + 1;
  const answer = String(answerNumber);
  const relation = lowerQuestion ? "greatest integer less than" : "least integer greater than";
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `What is the ${relation} ${rootSymbol}?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String(answerNumber - 1), "BOUND_LOW", "This is not the tight integer bound requested."),
      wrong(String(answerNumber + 1), "BOUND_HIGH", "This is not the tight integer bound requested."),
      wrong(String(answerNumber + 2), "BOUND_TOO_WIDE", "This bound is valid only in a loose sense, not the requested greatest/least integer bound."),
    ]),
    data: { n, degree, lower: k, upper: k + 1, kind: lowerQuestion ? "LOWER" : "UPPER", answer: answerNumber },
    concept: "Use consecutive exact powers to obtain the tight integer bound.",
    steps: [`${k}^${degree} = ${k ** degree} and ${k + 1}^${degree} = ${(k + 1) ** degree}.`, `${k ** degree} < ${n} < ${(k + 1) ** degree}, so the required integer bound is ${answerNumber}.`],
    verification: ["The radicand is strictly between the two benchmark powers."],
  });
}

function decimalPowerEstimate(seed: number): SapCp010Package {
  const mode = 6;
  const rounded = 2 + ((seed - 1) % 9);
  const offsets = [-3, -2, 2, 3] as const;
  const base10 = 10 * rounded + offsets[(seed - 1) % 4]!;
  const base = base10 / 10;
  const exponent = seed % 2 === 0 ? 2 : 3;
  const answerNumber = rounded ** exponent;
  const answer = String(answerNumber);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${formatDecimal(base, 1)} to the nearest whole number and estimate (${formatDecimal(base, 1)})^${exponent}.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((rounded - 1) ** exponent), "BASE_LOW", "The base was rounded one integer too low."),
      wrong(String((rounded + 1) ** exponent), "BASE_HIGH", "The base was rounded one integer too high."),
      wrong(String(rounded * exponent), "MULTIPLY_EXPONENT", "The exponent was treated as multiplication."),
      wrong(String(answerNumber + rounded), "ARITHMETIC_SLIP", "The rounded power was not evaluated correctly."),
    ]),
    data: { base10, base: formatDecimal(base, 1), rounded, exponent, answer: answerNumber },
    concept: "Round the base first, then evaluate the small integer power.",
    steps: [`${formatDecimal(base, 1)} → ${rounded}.`, `${rounded}^${exponent} = ${answerNumber}.`],
    verification: ["The base is rounded to the nearest whole number as stated."],
  });
}

function percentPowerFactor(seed: number): SapCp010Package {
  const mode = 7;
  const rounded = 20 + ((seed - 1) % 7) * 10;
  const offsets = [-4, -2, 2, 4] as const;
  const percent = rounded + offsets[(seed - 1) % 4]!;
  const exponent = seed % 2 === 0 ? 2 : 3;
  const factor = rounded / 100;
  const answerNumber = factor ** exponent;
  const answer = formatDecimal(answerNumber, 4);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${percent}% to the nearest 10% and estimate (${percent}%)^${exponent} as a decimal factor.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(formatDecimal((Math.max(10, rounded - 10) / 100) ** exponent, 4), "PERCENT_LOW", "The percentage was rounded one step too low."),
      wrong(formatDecimal((Math.min(100, rounded + 10) / 100) ** exponent, 4), "PERCENT_HIGH", "The percentage was rounded one step too high."),
      wrong(String(rounded ** exponent), "PERCENT_NOT_CONVERTED", "The percentage was powered without converting it to a decimal factor."),
    ]),
    data: { percent, roundedPercent: rounded, exponent, answer },
    concept: "Round the percentage, convert it to a decimal factor, then apply the power.",
    steps: [`${percent}% → ${rounded}% = ${formatDecimal(factor, 2)}.`, `${formatDecimal(factor, 2)}^${exponent} = ${answer}.`],
    verification: ["The percentage is converted to a decimal before taking the power."],
  });
}

function reciprocalBenchmark(seed: number): SapCp010Package {
  const mode = 8;
  const rounded = 3 + ((seed - 1) % 25);
  const offsets = [-3, -2, 2, 3] as const;
  const raw10 = 10 * rounded + offsets[(seed - 1) % 4]!;
  const raw = raw10 / 10;
  const answer = `1/${rounded}`;
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${formatDecimal(raw, 1)} to the nearest whole number and estimate its reciprocal.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(`1/${rounded - 1}`, "DENOMINATOR_LOW", "The original value was rounded one integer too low."),
      wrong(`1/${rounded + 1}`, "DENOMINATOR_HIGH", "The original value was rounded one integer too high."),
      wrong(String(rounded), "NOT_RECIPROCAL", "The rounded value was reported instead of its reciprocal."),
    ]),
    data: { raw10, raw: formatDecimal(raw, 1), rounded, numerator: 1 },
    concept: "Round the number to the stated benchmark, then take the reciprocal of that benchmark.",
    steps: [`${formatDecimal(raw, 1)} → ${rounded}.`, `Reciprocal ≈ 1/${rounded}.`],
    verification: ["The denominator is non-zero and comes from the stated rounding rule."],
  });
}

function nearestSquareRadicand(root: number, seed: number, offsetIndex: number): number {
  const offsets = [1, 2, 3, 4] as const;
  const d = offsets[(seed + offsetIndex) % offsets.length]!;
  return seed % 2 === 0 ? root * root + d : root * root - d;
}

function rootProduct(seed: number): SapCp010Package {
  const mode = 9;
  const r1 = 5 + ((seed - 1) % 12);
  const r2 = 3 + (Math.floor((seed - 1) / 12) % 8);
  const n1 = nearestSquareRadicand(r1, seed, 0);
  const n2 = nearestSquareRadicand(r2, seed, 1);
  const answerNumber = r1 * r2;
  const answer = String(answerNumber);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Estimate √${n1} × √${n2} by taking each square root to the nearest integer.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((r1 - 1) * r2), "FIRST_ROOT_LOW", "The first square root was taken one integer too low."),
      wrong(String(r1 * (r2 + 1)), "SECOND_ROOT_HIGH", "The second square root was taken one integer too high."),
      wrong(String(r1 + r2), "ADD_ROOTS", "The two rounded roots were added instead of multiplied."),
    ]),
    data: { n1, n2, r1, r2, answer: answerNumber },
    concept: "Estimate each root from its nearest perfect square, then multiply the integer benchmarks.",
    steps: [`√${n1} ≈ ${r1} and √${n2} ≈ ${r2}.`, `${r1} × ${r2} = ${answerNumber}.`],
    verification: [`${r1}² = ${r1 * r1} and ${r2}² = ${r2 * r2}, both close to their radicands.`],
  });
}

function rootQuotient(seed: number): SapCp010Package {
  const mode = 10;
  const divisorRoot = 3 + ((seed - 1) % 8);
  const quotient = 2 + (Math.floor((seed - 1) / 8) % 4);
  const numeratorRoot = divisorRoot * quotient;
  const n = nearestSquareRadicand(numeratorRoot, seed, 0);
  const d = nearestSquareRadicand(divisorRoot, seed, 1);
  const answer = String(quotient);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Estimate √${n} ÷ √${d} by taking each square root to the nearest integer.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String(Math.max(1, quotient - 1)), "QUOTIENT_LOW", "One root benchmark was taken too low."),
      wrong(String(quotient + 1), "QUOTIENT_HIGH", "One root benchmark was taken too high."),
      wrong(String(numeratorRoot + divisorRoot), "ADD_ROOTS", "The rounded roots were added instead of divided."),
    ]),
    data: { n, d, numeratorRoot, divisorRoot, quotient },
    concept: "Estimate each square root first, then divide the rounded root values.",
    steps: [`√${n} ≈ ${numeratorRoot} and √${d} ≈ ${divisorRoot}.`, `${numeratorRoot} ÷ ${divisorRoot} = ${quotient}.`],
    verification: ["The rounded denominator root is non-zero."],
  });
}

function mixedPowerRoot(seed: number): SapCp010Package {
  const mode = 11;
  const root = 6 + ((seed - 1) % 12);
  const n = nearestSquareRadicand(root, seed, 0);
  const roundedBase = 2 + (Math.floor((seed - 1) / 12) % 7);
  const offsets = [-3, -2, 2, 3] as const;
  const raw10 = 10 * roundedBase + offsets[(seed - 1) % 4]!;
  const raw = raw10 / 10;
  const answerNumber = root + roundedBase ** 2;
  const answer = String(answerNumber);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Take √${n} to the nearest integer and ${formatDecimal(raw, 1)} to the nearest whole number. Estimate √${n} + (${formatDecimal(raw, 1)})².`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((root - 1) + roundedBase ** 2), "ROOT_LOW", "The square root benchmark was one integer too low."),
      wrong(String(root + (roundedBase + 1) ** 2), "POWER_BASE_HIGH", "The decimal base was rounded one integer too high."),
      wrong(String(root * roundedBase ** 2), "WRONG_OUTER_OPERATION", "The two derived values were multiplied instead of added."),
    ]),
    data: { n, root, raw10, raw: formatDecimal(raw, 1), roundedBase, answer: answerNumber },
    concept: "Estimate the root and the power separately, then perform the final operation.",
    steps: [`√${n} ≈ ${root}; ${formatDecimal(raw, 1)} → ${roundedBase}, so (${formatDecimal(raw, 1)})² ≈ ${roundedBase ** 2}.`, `${root} + ${roundedBase ** 2} = ${answerNumber}.`],
    verification: ["Both special forms are approximated before the final addition."],
  });
}

function missingRadicand(seed: number): SapCp010Package {
  const mode = 12;
  const k = 8 + ((seed - 1) % 20);
  const d = 1 + (Math.floor((seed - 1) / 20) % 4);
  const correctN = k * k + d;
  const answer = String(correctN);
  const upper = k + 1;
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Which value of □ makes √□ nearest to ${k}?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((k - 1) ** 2 - d), "NEAR_PREVIOUS_ROOT", "This radicand has a square root nearer to the previous integer."),
      wrong(String(upper ** 2 + d), "NEAR_NEXT_ROOT", "This radicand has a square root nearer to the next integer."),
      wrong(String((upper + 1) ** 2 - d), "TOO_HIGH", "This radicand lies near a still larger integer root."),
    ]),
    data: { k, correctN, lowerThreshold4: (2 * k - 1) ** 2, upperThreshold4: (2 * k + 1) ** 2 },
    concept: "A square root rounds to an integer when the radicand lies inside that integer's nearest-root band.",
    steps: [`${k}² = ${k * k}, and ${correctN} is just above this perfect square.`, `√${correctN} is still below ${k}.5, so it is nearest to ${k}.`],
    verification: [`4 × ${correctN} = ${4 * correctN} < ${(2 * k + 1) ** 2}, which proves √${correctN} < ${k}.5.`],
  });
}

function missingPowerBase(seed: number): SapCp010Package {
  const mode = 13;
  const rounded = 3 + ((seed - 1) % 12);
  const offsets = [-3, -2, 2, 3] as const;
  const correct10 = 10 * rounded + offsets[(seed - 1) % 4]!;
  const correct = correct10 / 10;
  const exponent = seed % 2 === 0 ? 2 : 3;
  const target = rounded ** exponent;
  const answer = formatDecimal(correct, 1);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `A number is rounded to the nearest whole number before raising it to the power ${exponent}. The estimate is ${target}. Which value could the original number be?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(formatDecimal((10 * (rounded - 1) + 2) / 10, 1), "ROUNDS_LOW", "This value rounds to the previous integer."),
      wrong(formatDecimal((10 * (rounded + 1) - 2) / 10, 1), "ROUNDS_HIGH", "This value rounds to the next integer."),
      wrong(formatDecimal((10 * (rounded + 2) + 2) / 10, 1), "ROUNDS_TOO_HIGH", "This value rounds two integers above the required base."),
    ]),
    data: { correct10, correct: answer, rounded, exponent, target },
    concept: "Recover the integer base from the power, then choose a value that rounds to that integer.",
    steps: [`${rounded}^${exponent} = ${target}, so the rounded base must be ${rounded}.`, `${answer} rounds to ${rounded}, so it can produce the estimate ${target}.`],
    verification: ["The other choices round to different integer bases."],
  });
}

function nearestOptionSpecial(seed: number): SapCp010Package {
  const mode = 14;
  if (seed % 2 === 1) {
    const k = 10 + ((seed - 1) % 20);
    const n = k * k + 1 + (Math.floor((seed - 1) / 20) % 4);
    const answer = String(k);
    return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
      stem: `Which option is nearest to √${n}?`,
      answer,
      options: optionSet(answer, seed, mode, [
        wrong(String(k - 1), "ROOT_LOW", "This is below the nearest integer root."),
        wrong(String(k + 1), "ROOT_HIGH", "This is above the nearest integer root."),
        wrong(String(k + 2), "ROOT_TOO_HIGH", "This lies still farther from the root."),
      ]),
      data: { kind: "ROOT", n, k },
      concept: "Use nearby perfect squares to identify the nearest option.",
      steps: [`${k}² = ${k * k} and ${k + 1}² = ${(k + 1) ** 2}.`, `√${n} is only slightly above ${k}, so ${k} is the nearest option.`],
      verification: [`4 × ${n} < ${(2 * k + 1) ** 2}, so √${n} < ${k}.5.`],
    });
  }
  const rounded = 3 + ((seed - 1) % 10);
  const raw10 = 10 * rounded + 2;
  const raw = raw10 / 10;
  const exponent = 2;
  const target = rounded ** exponent;
  const answer = String(target);
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${formatDecimal(raw, 1)} to the nearest whole number. Which option is nearest to (${formatDecimal(raw, 1)})²?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((rounded - 1) ** 2), "POWER_LOW", "The base was rounded too low."),
      wrong(String((rounded + 1) ** 2), "POWER_HIGH", "The base was rounded too high."),
      wrong(String(2 * rounded), "MULTIPLY_TWO", "Squaring was confused with multiplying by 2."),
    ]),
    data: { kind: "POWER", raw10, raw: formatDecimal(raw, 1), rounded, exponent, target },
    concept: "Apply the stated rounding to the base, then compare the resulting power with the options.",
    steps: [`${formatDecimal(raw, 1)} → ${rounded}.`, `${rounded}² = ${target}.`],
    verification: ["The selected option is the direct result of the declared approximation."],
  });
}

function compareRootPower(seed: number): SapCp010Package {
  const mode = 15;
  const rootValue = 5 + ((seed - 1) % 12);
  const n = nearestSquareRadicand(rootValue, seed, 0);
  const roundedBase = 2 + (Math.floor((seed - 1) / 12) % 7);
  const raw10 = 10 * roundedBase + 2;
  const raw = raw10 / 10;
  const powerValue = roundedBase ** 2;
  const relation = rootValue < powerValue ? "A < B" : rootValue > powerValue ? "A > B" : "A = B";
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Take √${n} to the nearest integer and ${formatDecimal(raw, 1)} to the nearest whole number. If A = √${n} and B = (${formatDecimal(raw, 1)})², compare A and B.`,
    answer: relation,
    options: optionSet(relation, seed, mode, [
      wrong("A < B", "FORCE_LT", "This relation does not match the two estimated values."),
      wrong("A = B", "FORCE_EQ", "The two estimated values are not equal in this state."),
      wrong("A > B", "FORCE_GT", "This relation does not match the two estimated values."),
      wrong("Cannot be compared", "NO_COMPARISON", "Both estimates are numeric and can be compared directly."),
    ]),
    data: { n, rootValue, raw10, raw: formatDecimal(raw, 1), roundedBase, powerValue, relation },
    concept: "Estimate both special forms under the stated rules, then compare the resulting numbers.",
    steps: [`A ≈ ${rootValue}; B ≈ ${roundedBase}² = ${powerValue}.`, `${rootValue} ${relation === "A < B" ? "<" : relation === "A > B" ? ">" : "="} ${powerValue}, so ${relation}.`],
    verification: ["Both sides use the same declared approximation rules throughout."],
  });
}

function wrongBenchmarkDiagnosis(seed: number): SapCp010Package {
  const mode = 16;
  const correctRoot = 8 + ((seed - 1) % 20);
  const n = correctRoot * correctRoot + 1 + (Math.floor((seed - 1) / 20) % 4);
  const wrongRoot = correctRoot + 1;
  const answer = `Use ${correctRoot}, because ${correctRoot}² = ${correctRoot * correctRoot} is the nearer root benchmark.`;
  return build(SAP_CP010_PROTOTYPE_IDS[mode]!, seed, {
    stem: `A student estimates √${n} as ${wrongRoot}. Which correction is appropriate?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(`Keep ${wrongRoot}, because ${(wrongRoot) ** 2} is a perfect square.`, "KEEP_WRONG_BENCHMARK", "Being a perfect square is not enough; the benchmark must be appropriate for the radicand."),
      wrong(`Use ${correctRoot - 1}, because ${(correctRoot - 1) ** 2} is below ${n}.`, "BENCHMARK_TOO_LOW", "This square is farther from the radicand than the correct benchmark."),
      wrong("No estimate is possible without a calculator.", "REJECT_BENCHMARKING", "Nearby perfect squares are sufficient for this estimate."),
    ]),
    data: { n, correctRoot, wrongRoot, correctSquare: correctRoot ** 2, wrongSquare: wrongRoot ** 2 },
    concept: "Choose the benchmark that actually brackets and best represents the non-perfect root.",
    steps: [`${correctRoot}² = ${correctRoot ** 2} and ${wrongRoot}² = ${wrongRoot ** 2}.`, `${n} lies just above ${correctRoot ** 2}, so ${correctRoot} is the appropriate nearby integer root.`],
    verification: [`4 × ${n} < ${(2 * correctRoot + 1) ** 2}, so √${n} is below ${correctRoot}.5.`],
  });
}

const GENERATORS: Readonly<Record<SapCp010PrototypeId, (seed: number) => SapCp010Package>> = Object.freeze({
  "SAP-CP010-PROT-SQRT-INTERVAL": squareRootInterval,
  "SAP-CP010-PROT-CBRT-INTERVAL": cubeRootInterval,
  "SAP-CP010-PROT-FOURTH-ROOT-INTERVAL": fourthRootInterval,
  "SAP-CP010-PROT-NEAREST-INTEGER-SQRT": nearestIntegerSqrt,
  "SAP-CP010-PROT-NEAREST-INTEGER-CBRT": nearestIntegerCbrt,
  "SAP-CP010-PROT-INTEGER-ROOT-BOUND": integerRootBound,
  "SAP-CP010-PROT-DECIMAL-POWER-ESTIMATE": decimalPowerEstimate,
  "SAP-CP010-PROT-PERCENT-POWER-FACTOR": percentPowerFactor,
  "SAP-CP010-PROT-RECIPROCAL-BENCHMARK": reciprocalBenchmark,
  "SAP-CP010-PROT-ROOT-PRODUCT": rootProduct,
  "SAP-CP010-PROT-ROOT-QUOTIENT": rootQuotient,
  "SAP-CP010-PROT-MIXED-POWER-ROOT": mixedPowerRoot,
  "SAP-CP010-PROT-MISSING-RADICAND": missingRadicand,
  "SAP-CP010-PROT-MISSING-POWER-BASE": missingPowerBase,
  "SAP-CP010-PROT-NEAREST-OPTION-SPECIAL-FORM": nearestOptionSpecial,
  "SAP-CP010-PROT-COMPARE-ROOT-POWER": compareRootPower,
  "SAP-CP010-PROT-WRONG-BENCHMARK-DIAGNOSIS": wrongBenchmarkDiagnosis,
});

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("seed must be a positive integer");
  return GENERATORS[prototypeId](seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
