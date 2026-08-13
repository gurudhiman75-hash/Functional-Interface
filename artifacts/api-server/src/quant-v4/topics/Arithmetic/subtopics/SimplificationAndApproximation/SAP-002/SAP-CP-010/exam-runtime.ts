import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateBase,
  type SapCp010Difficulty,
  type SapCp010Option,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Difficulty, SapCp010Option, SapCp010Package, SapCp010PrototypeId };

function correctPosition(seed: number, mode: number): number {
  return ((seed - 1) + mode) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp010Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function optionSet(answer: string, seed: number, mode: number, wrongs: readonly SapCp010Option[]): readonly SapCp010Option[] {
  const unique = wrongs.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: CP010 exam distractors collapsed in mode ${mode}.`);
  const correct: SapCp010Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const out = [...unique.slice(0, 3)];
  out.splice(correctPosition(seed, mode), 0, correct);
  return Object.freeze(out);
}

function fmt(value: number, places = 6): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function repack(
  base: SapCp010Package,
  args: {
    stem: string;
    answer: string;
    options: readonly SapCp010Option[];
    data: Readonly<Record<string, number | string>>;
    concept: string;
    steps: readonly string[];
    verification: readonly string[];
    difficulty?: SapCp010Difficulty;
    tag: string;
  },
): SapCp010Package {
  const correctIndex = args.options.findIndex((o) => o.isCorrect);
  const errors: string[] = [];
  if (args.options.length !== 4 || new Set(args.options.map((o) => o.value)).size !== 4) errors.push("Four distinct options required.");
  if (args.options.filter((o) => o.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (args.options[correctIndex]?.value !== args.answer) errors.push("Correct option mismatch.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  if (args.stem.length > 220) errors.push("Stem too long for exam presentation.");
  const studentText = `${args.stem} ${args.answer} ${args.options.map((o) => o.value).join(" ")} ${args.concept} ${args.steps.join(" ")} ${args.verification.join(" ")}`;
  if (/oracle|runtime|prototype|canonical|internal|guard|machine policy|apply the declared/i.test(studentText)) errors.push("Internal wording leaked.");
  if (/-?\d+\.\d{6,}/.test(studentText)) errors.push("Long floating-point display leaked.");
  const data = Object.freeze({ ...args.data, examRuntimeVersion: 2 });
  return Object.freeze({
    ...base,
    difficulty: args.difficulty ?? base.difficulty,
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
    oracle: Object.freeze({ kind: base.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem: args.stem, answer: args.answer, data, tag: args.tag }),
    generationIdentity: `${base.prototypeId}:exam-v2:${args.tag}:${base.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function decimalPower(seed: number): SapCp010Package {
  const mode = 6;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const rounded = 2 + ((seed - 1) % 9);
  const block = Math.floor((seed - 1) / 9);
  const delta = 10 + 3 * block;
  const sign = seed % 2 === 0 ? 1 : -1;
  const raw100 = rounded * 100 + sign * delta;
  const raw = raw100 / 100;
  const exponent = seed % 3 === 0 ? 3 : 2;
  const answerNumber = rounded ** exponent;
  const answer = String(answerNumber);
  return repack(base, {
    stem: `Round ${fmt(raw, 2)} to the nearest whole number and estimate (${fmt(raw, 2)})^${exponent}.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String(Math.max(1, rounded - 1) ** exponent), "BASE_LOW", "The base was rounded one integer too low."),
      wrong(String((rounded + 1) ** exponent), "BASE_HIGH", "The base was rounded one integer too high."),
      wrong(String(rounded * exponent), "EXPONENT_AS_MULTIPLIER", "The exponent was treated as multiplication."),
      wrong(String(answerNumber + rounded), "POWER_ARITHMETIC_SLIP", "The rounded power was evaluated incorrectly."),
    ]),
    data: { raw100, raw: fmt(raw, 2), rounded, exponent, answer: answerNumber },
    concept: "Round the base first, then evaluate the small integer power.",
    steps: [`${fmt(raw, 2)} → ${rounded}.`, `${rounded}^${exponent} = ${answerNumber}.`],
    verification: ["The raw value lies within half a unit of the rounded integer."],
    difficulty: exponent === 3 && rounded >= 8 ? "MEDIUM" : "EASY",
    tag: "decimal-power-diverse",
  });
}

function percentPower(seed: number): SapCp010Package {
  const mode = 7;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const rounded = 20 + ((seed - 1) % 7) * 10;
  const deltas = [-4, -3, -2, -1, 1, 2, 3, 4] as const;
  const deltaIndex = Math.floor((seed - 1) / 7) % deltas.length;
  const percent = rounded + deltas[deltaIndex]!;
  const exponent = seed <= 56 ? 2 : 3;
  const factor = rounded / 100;
  const answerNumber = factor ** exponent;
  const answer = fmt(answerNumber, 4);
  return repack(base, {
    stem: `Round ${percent}% to the nearest 10% and estimate (${percent}%)^${exponent} as a decimal factor.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(fmt((Math.max(10, rounded - 10) / 100) ** exponent, 4), "PERCENT_LOW", "The percentage was rounded one step too low."),
      wrong(fmt((Math.min(100, rounded + 10) / 100) ** exponent, 4), "PERCENT_HIGH", "The percentage was rounded one step too high."),
      wrong(String(rounded ** exponent), "PERCENT_NOT_CONVERTED", "The percentage was not converted to a decimal factor."),
      wrong(fmt(factor * exponent, 4), "POWER_AS_MULTIPLIER", "The exponent was treated as multiplication."),
    ]),
    data: { percent, roundedPercent: rounded, exponent, answer },
    concept: "Round the percentage, write it as a decimal factor, then take the power.",
    steps: [`${percent}% → ${rounded}% = ${fmt(factor, 2)}.`, `${fmt(factor, 2)}^${exponent} = ${answer}.`],
    verification: ["The rounded percentage is within 5 percentage points of the original."],
    difficulty: "MEDIUM",
    tag: "percent-power-diverse",
  });
}

function nearSquare(root: number, seed: number, shift: number): number {
  const d = 1 + ((Math.floor((seed - 1) / 20) + shift) % 5);
  return (seed + shift) % 2 === 0 ? root * root + d : root * root - d;
}

function rootProduct(seed: number): SapCp010Package {
  const mode = 9;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const r1 = 5 + ((seed - 1) % 20);
  const r2 = 3 + Math.floor((seed - 1) / 20);
  const n1 = nearSquare(r1, seed, 0);
  const n2 = nearSquare(r2, seed, 1);
  const answerNumber = r1 * r2;
  const answer = String(answerNumber);
  return repack(base, {
    stem: `Estimate √${n1} × √${n2} by taking each square root to the nearest integer.`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((r1 - 1) * r2), "FIRST_ROOT_LOW", "The first root benchmark was one integer too low."),
      wrong(String(r1 * (r2 + 1)), "SECOND_ROOT_HIGH", "The second root benchmark was one integer too high."),
      wrong(String(r1 + r2), "ADD_ROOTS", "The rounded roots were added instead of multiplied."),
    ]),
    data: { n1, n2, r1, r2, answer: answerNumber },
    concept: "Take each square root to its nearest integer benchmark, then multiply.",
    steps: [`√${n1} ≈ ${r1} and √${n2} ≈ ${r2}.`, `${r1} × ${r2} = ${answerNumber}.`],
    verification: [`${r1}² = ${r1 ** 2}; ${r2}² = ${r2 ** 2}, both close to their radicands.`],
    difficulty: "MEDIUM",
    tag: "root-product-100",
  });
}

function mixedPowerRoot(seed: number): SapCp010Package {
  const mode = 11;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const root = 6 + ((seed - 1) % 12);
  const n = nearSquare(root, seed, 0);
  const roundedBase = 2 + Math.floor((seed - 1) / 12);
  const block = Math.floor((seed - 1) / 48);
  const delta = 20 + 5 * block;
  const sign = seed % 2 === 0 ? 1 : -1;
  const raw100 = roundedBase * 100 + sign * delta;
  const raw = raw100 / 100;
  const answerNumber = root + roundedBase ** 2;
  const answer = String(answerNumber);
  return repack(base, {
    stem: `Take √${n} to the nearest integer and ${fmt(raw, 2)} to the nearest whole number. Estimate √${n} + (${fmt(raw, 2)})².`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((root - 1) + roundedBase ** 2), "ROOT_LOW", "The root benchmark was one integer too low."),
      wrong(String(root + (roundedBase + 1) ** 2), "POWER_BASE_HIGH", "The power base was rounded one integer too high."),
      wrong(String(root * roundedBase ** 2), "WRONG_OUTER_OPERATION", "The two derived values were multiplied instead of added."),
    ]),
    data: { n, root, raw100, raw: fmt(raw, 2), roundedBase, answer: answerNumber },
    concept: "Approximate the root and the power separately, then complete the final addition.",
    steps: [`√${n} ≈ ${root}; ${fmt(raw, 2)} → ${roundedBase}, so (${fmt(raw, 2)})² ≈ ${roundedBase ** 2}.`, `${root} + ${roundedBase ** 2} = ${answerNumber}.`],
    verification: ["Both special forms are resolved before the final operation."],
    difficulty: "MEDIUM",
    tag: "mixed-root-power-100",
  });
}

function missingRadicand(seed: number): SapCp010Package {
  const mode = 12;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const k = 8 + ((seed - 1) % 20);
  const d = 1 + Math.floor((seed - 1) / 20);
  const correctN = k * k + d;
  const answer = String(correctN);
  return repack(base, {
    stem: `Which value of □ makes √□ nearest to ${k}?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((k - 1) ** 2 - d), "NEAR_PREVIOUS_ROOT", "This radicand is nearer to the previous integer root."),
      wrong(String((k + 1) ** 2 + d), "NEAR_NEXT_ROOT", "This radicand is nearer to the next integer root."),
      wrong(String((k + 2) ** 2 - d), "TOO_HIGH", "This radicand lies near a still larger integer root."),
    ]),
    data: { k, correctN, d, upperThreshold4: (2 * k + 1) ** 2 },
    concept: "Choose a radicand whose square root lies inside the nearest-integer band for the required answer.",
    steps: [`${k}² = ${k ** 2}, and ${correctN} lies just above it.`, `√${correctN} < ${k}.5, so it is nearest to ${k}.`],
    verification: [`4 × ${correctN} = ${4 * correctN} < ${(2 * k + 1) ** 2}.`],
    difficulty: "MEDIUM",
    tag: "missing-radicand-100",
  });
}

function missingPowerBase(seed: number): SapCp010Package {
  const mode = 13;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const rounded = 3 + ((seed - 1) % 12);
  const block = Math.floor((seed - 1) / 12);
  const delta = 12 + 4 * block;
  const sign = seed % 2 === 0 ? 1 : -1;
  const correct100 = rounded * 100 + sign * delta;
  const correct = correct100 / 100;
  const exponent = seed % 3 === 0 ? 3 : 2;
  const target = rounded ** exponent;
  const answer = fmt(correct, 2);
  const low = rounded - 1 + 0.2;
  const high = rounded + 1 - 0.2;
  return repack(base, {
    stem: `A number is rounded to the nearest whole number before raising it to the power ${exponent}. The estimate is ${target}. Which value could the original number be?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(fmt(low, 1), "ROUNDS_LOW", "This value rounds to the previous integer."),
      wrong(fmt(high, 1), "ROUNDS_HIGH", "This value rounds to the next integer."),
      wrong(fmt(rounded + 1.8, 1), "ROUNDS_TOO_HIGH", "This value rounds well above the required base."),
    ]),
    data: { correct100, correct: answer, rounded, exponent, target },
    concept: "Find the integer base that produces the estimated power, then choose a value that rounds to it.",
    steps: [`${rounded}^${exponent} = ${target}, so the rounded base is ${rounded}.`, `${answer} rounds to ${rounded}.`],
    verification: ["Each wrong option rounds to a different whole number."],
    difficulty: "MEDIUM",
    tag: "missing-power-base-100",
  });
}

function nearestOption(seed: number): SapCp010Package {
  const mode = 14;
  if (seed % 2 === 1) return generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const rounded = 3 + (((seed / 2) - 1) % 10);
  const block = Math.floor(((seed / 2) - 1) / 10);
  const delta = 12 + 6 * block;
  const raw100 = rounded * 100 + delta;
  const raw = raw100 / 100;
  const target = rounded ** 2;
  const answer = String(target);
  return repack(base, {
    stem: `Round ${fmt(raw, 2)} to the nearest whole number. Which option is nearest to (${fmt(raw, 2)})²?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(String((rounded - 1) ** 2), "POWER_LOW", "The base was rounded one integer too low."),
      wrong(String((rounded + 1) ** 2), "POWER_HIGH", "The base was rounded one integer too high."),
      wrong(String(2 * rounded), "MULTIPLY_TWO", "Squaring was confused with multiplying by 2."),
    ]),
    data: { kind: "POWER", raw100, raw: fmt(raw, 2), rounded, exponent: 2, target },
    concept: "Round the base as instructed, square the rounded value, then choose the matching option.",
    steps: [`${fmt(raw, 2)} → ${rounded}.`, `${rounded}² = ${target}.`],
    verification: ["The raw base is within half a unit of the rounded value."],
    difficulty: "MEDIUM",
    tag: "nearest-power-unique",
  });
}

function compareRootPower(seed: number): SapCp010Package {
  const mode = 15;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const relationIndex = (seed - 1) % 3;
  const group = Math.floor((seed - 1) / 3);
  const roundedBase = 3 + (group % 8);
  const powerValue = roundedBase ** 2;
  const rootValue = relationIndex === 0 ? powerValue - 1 : relationIndex === 1 ? powerValue : powerValue + 1;
  const d = 1 + Math.floor(group / 8);
  const n = rootValue ** 2 + d;
  const raw100 = roundedBase * 100 + 18 + (group % 4) * 5;
  const raw = raw100 / 100;
  const relation = relationIndex === 0 ? "A < B" : relationIndex === 1 ? "A = B" : "A > B";
  return repack(base, {
    stem: `Take √${n} to the nearest integer and ${fmt(raw, 2)} to the nearest whole number. If A = √${n} and B = (${fmt(raw, 2)})², compare A and B.`,
    answer: relation,
    options: optionSet(relation, seed, mode, [
      wrong("A < B", "FORCE_LT", "This relation does not match the estimated values."),
      wrong("A = B", "FORCE_EQ", "This relation does not match the estimated values."),
      wrong("A > B", "FORCE_GT", "This relation does not match the estimated values."),
      wrong("Cannot be compared", "NO_COMPARISON", "Both sides reduce to ordinary numeric estimates."),
    ]),
    data: { n, rootValue, raw100, raw: fmt(raw, 2), roundedBase, powerValue, relation, d },
    concept: "Estimate both special forms under the stated rules, then compare the two resulting values.",
    steps: [`A ≈ ${rootValue}; B ≈ ${roundedBase}² = ${powerValue}.`, `${rootValue} ${relation === "A < B" ? "<" : relation === "A > B" ? ">" : "="} ${powerValue}, so ${relation}.`],
    verification: ["The relation is checked only after both approximations are completed."],
    difficulty: "MEDIUM",
    tag: "compare-all-relations",
  });
}

function diagnosis(seed: number): SapCp010Package {
  const mode = 16;
  const base = generateBase(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const correctRoot = 8 + ((seed - 1) % 20);
  const d = 1 + Math.floor((seed - 1) / 20);
  const n = correctRoot ** 2 + d;
  const wrongRoot = correctRoot + 1;
  const answer = `Use ${correctRoot}, because ${correctRoot}² = ${correctRoot ** 2} is the nearer root benchmark.`;
  return repack(base, {
    stem: `A student estimates √${n} as ${wrongRoot}. Which correction is appropriate?`,
    answer,
    options: optionSet(answer, seed, mode, [
      wrong(`Keep ${wrongRoot}, because ${wrongRoot ** 2} is a perfect square.`, "KEEP_WRONG_BENCHMARK", "A benchmark must be appropriate for the radicand, not merely perfect."),
      wrong(`Use ${correctRoot - 1}, because ${(correctRoot - 1) ** 2} is below ${n}.`, "BENCHMARK_TOO_LOW", "This benchmark is farther from the root."),
      wrong("No estimate is possible without a calculator.", "REJECT_BENCHMARKING", "Nearby perfect squares are enough to make the estimate."),
    ]),
    data: { n, correctRoot, wrongRoot, correctSquare: correctRoot ** 2, wrongSquare: wrongRoot ** 2, d },
    concept: "Use the nearby perfect square that correctly represents the root, not just any convenient perfect square.",
    steps: [`${correctRoot}² = ${correctRoot ** 2} and ${wrongRoot}² = ${wrongRoot ** 2}.`, `${n} is just above ${correctRoot ** 2}, so ${correctRoot} is the appropriate integer benchmark.`],
    verification: [`4 × ${n} < ${(2 * correctRoot + 1) ** 2}, so √${n} < ${correctRoot}.5.`],
    difficulty: "MEDIUM",
    tag: "diagnosis-100",
  });
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[6]) return decimalPower(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[7]) return percentPower(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[9]) return rootProduct(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[11]) return mixedPowerRoot(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[12]) return missingRadicand(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[13]) return missingPowerBase(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[14]) return nearestOption(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[15]) return compareRootPower(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[16]) return diagnosis(seed);
  return generateBase(prototypeId, seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
