import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateV4,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./runtime-v4";
import type { SapCp009Option } from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

const LIFECYCLE: SapCp009Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

function position(seed: number, modeIndex: number): number {
  return ((seed - 1) + modeIndex) % 4;
}
function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}
function makeOptions(answer: string, seed: number, modeIndex: number, candidates: readonly SapCp009Option[]): readonly SapCp009Option[] {
  const unique = candidates.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: v5 distractors collapsed for mode ${modeIndex}.`);
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct estimate." });
  const result = [...unique.slice(0, 3)];
  result.splice(position(seed, modeIndex), 0, correct);
  return Object.freeze(result);
}
function makePackage(
  prototypeId: SapCp009PrototypeId,
  seed: number,
  generated: {
    stem: string;
    answer: string;
    options: readonly SapCp009Option[];
    data: Readonly<Record<string, number | string>>;
    concept: string;
    steps: readonly string[];
    verification: readonly string[];
  },
): SapCp009Package {
  const modeIndex = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  const meta = SAP_CP009_CATALOGUE[modeIndex]!;
  const correctIndex = generated.options.findIndex((item) => item.isCorrect);
  const visible = `${generated.stem} ${generated.concept} ${generated.steps.join(" ")} ${generated.verification.join(" ")}`;
  const errors: string[] = [];
  if (generated.options.length !== 4 || new Set(generated.options.map((item) => item.value)).size !== 4) errors.push("Four distinct options required.");
  if (generated.options.filter((item) => item.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (generated.options[correctIndex]?.value !== generated.answer) errors.push("Correct answer mismatch.");
  if (generated.steps.length < 2 || generated.steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  if (/oracle|runtime|prototype|canonical payload|learner route|transformed expression|internal|guard/i.test(visible)) errors.push("Internal wording leaked.");
  return Object.freeze({
    checkpointId: "SAP-CP-009",
    prototypeId,
    proposedPermanentQlId: meta.proposedPermanentQlId,
    seed,
    difficulty: meta.difficulty,
    taskDirection: meta.taskDirection,
    policy: SAP_CP009_POLICY,
    stem: generated.stem,
    canonicalAnswer: generated.answer,
    options: generated.options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: generated.concept,
      steps: Object.freeze(generated.steps),
      finalAnswer: `Answer: ${generated.answer}.`,
      verification: Object.freeze(generated.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data: generated.data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: generated.stem, answer: generated.answer, data: generated.data, runtime: "v5" }),
    generationIdentity: `${prototypeId}:v5:${seed}:${JSON.stringify(generated.data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}

function reciprocalRoute(seed: number): SapCp009Package {
  const mode = 9;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const quotient = 5 + ((seed - 1) % 16);
  const block = Math.floor((seed - 1) / 16);
  const divisorRounded = [20, 30, 40, 50][(seed - 1) % 4]! + block * 40;
  const numeratorRounded = quotient * divisorRounded;
  const offsets = [-4, -2, 2, 4] as const;
  const numerator = numeratorRounded + offsets[seed % 4]!;
  const divisor = divisorRounded + offsets[(seed + 1) % 4]!;
  const answer = String(quotient);
  const opts = makeOptions(answer, seed, mode, [
    wrong(String(quotient + 1), "RECIPROCAL_HIGH", "The reciprocal product is one unit too high."),
    wrong(String(Math.max(1, quotient - 1)), "RECIPROCAL_LOW", "The reciprocal product is one unit too low."),
    wrong(String(quotient * 10), "PLACE_VALUE_ERROR", "An extra factor of ten was introduced."),
    wrong(String(quotient + 2), "RECIPROCAL_TWO_HIGH", "The quotient was increased by two."),
  ]);
  return makePackage(prototypeId, seed, {
    stem: `Use ${numeratorRounded} for ${numerator} and ${divisorRounded} for ${divisor}. Estimate ${numerator} ÷ ${divisor} by multiplying by the reciprocal of ${divisorRounded}.`,
    answer,
    options: opts,
    data: Object.freeze({ numerator, divisor, numeratorRounded, divisorRounded, answer: quotient, stateBlock: block }),
    concept: "Division by a convenient number can be written as multiplication by its reciprocal.",
    steps: [`${numerator}/${divisor} ≈ ${numeratorRounded}/${divisorRounded}.`, `${numeratorRounded} × 1/${divisorRounded} = ${quotient}.`],
    verification: [`1/${divisorRounded} is the reciprocal of ${divisorRounded}.`, "The compatible quotient is exact."],
  });
}

function missingFactor(seed: number): SapCp009Package {
  const mode = 10;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const missing = 3 + ((seed - 1) % 18);
  const block = Math.floor((seed - 1) / 18);
  const known = [20, 30, 40, 50][(seed - 1) % 4]! + block * 40;
  const target = known * missing;
  const answer = String(missing);
  const opts = makeOptions(answer, seed, mode, [
    wrong(String(missing + 1), "FACTOR_HIGH", "The missing factor is one too high."),
    wrong(String(Math.max(1, missing - 1)), "FACTOR_LOW", "The missing factor is one too low."),
    wrong(String(missing + 2), "FACTOR_TWO_HIGH", "The missing factor is two too high."),
    wrong(String(Math.max(1, missing - 2)), "FACTOR_TWO_LOW", "The missing factor is two too low."),
  ]);
  return makePackage(prototypeId, seed, {
    stem: `After rounding, one factor is ${known} and the product is approximately ${target}. What rounded value should replace □ in ${known} × □ ≈ ${target}?`,
    answer,
    options: opts,
    data: Object.freeze({ known, missing, target, stateBlock: block }),
    concept: "Find a missing factor by dividing the approximate product by the known rounded factor.",
    steps: [`□ ≈ ${target} ÷ ${known}.`, `${target} ÷ ${known} = ${missing}.`],
    verification: [`${known} × ${missing} = ${target}.`, "Substitution reproduces the approximate product."],
  });
}

function missingDivisor(seed: number): SapCp009Package {
  const mode = 11;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const quotient = 4 + ((seed - 1) % 17);
  const block = Math.floor((seed - 1) / 17);
  const divisor = [10, 20, 30, 40, 50][(seed - 1) % 5]! + block * 50;
  const dividend = quotient * divisor;
  const answer = String(divisor);
  const opts = makeOptions(answer, seed, mode, [
    wrong(String(divisor + 10), "DIVISOR_HIGH", "The divisor is one convenient step too high."),
    wrong(String(Math.max(10, divisor - 10)), "DIVISOR_LOW", "The divisor is one convenient step too low."),
    wrong(String(divisor + 20), "DIVISOR_TWO_STEPS_HIGH", "The divisor is two convenient steps too high."),
    wrong(String(Math.max(10, divisor - 20)), "DIVISOR_TWO_STEPS_LOW", "The divisor is two convenient steps too low."),
  ]);
  return makePackage(prototypeId, seed, {
    stem: `Using rounded values, ${dividend} ÷ □ ≈ ${quotient}. What rounded divisor should replace □?`,
    answer,
    options: opts,
    data: Object.freeze({ quotient, divisor, dividend, stateBlock: block }),
    concept: "If dividend ÷ divisor = quotient, then divisor = dividend ÷ quotient.",
    steps: [`□ ≈ ${dividend} ÷ ${quotient}.`, `${dividend} ÷ ${quotient} = ${divisor}.`],
    verification: [`${dividend} ÷ ${divisor} = ${quotient}.`, "The divisor is positive and non-zero."],
  });
}

function nearestOption(seed: number): SapCp009Package {
  const mode = 12;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  if (seed % 2 === 1) return generateV4(prototypeId, seed);
  const quotient = 5 + ((seed - 1) % 16);
  const block = Math.floor((seed - 1) / 16);
  const divisorRounded = [20, 40, 50, 80][(seed - 1) % 4]! + block * 80;
  const numeratorRounded = quotient * divisorRounded;
  const offsets = [-4, -2, 2, 4] as const;
  const originalN = numeratorRounded + offsets[seed % 4]!;
  const originalD = divisorRounded + offsets[(seed + 1) % 4]!;
  const answer = String(quotient);
  const opts = makeOptions(answer, seed, mode, [
    wrong(String(quotient + 2), "QUOTIENT_TWO_HIGH", "The option is too high for the compatible quotient."),
    wrong(String(Math.max(1, quotient - 2)), "QUOTIENT_TWO_LOW", "The option is too low for the compatible quotient."),
    wrong(String(quotient + 5), "QUOTIENT_FIVE_HIGH", "The option is much too high."),
    wrong(String(quotient * 10), "PLACE_VALUE_ERROR", "An extra factor of ten was introduced."),
  ]);
  return makePackage(prototypeId, seed, {
    stem: `Use ${numeratorRounded} for ${originalN} and ${divisorRounded} for ${originalD}. Which option is nearest to ${originalN} ÷ ${originalD}?`,
    answer,
    options: opts,
    data: Object.freeze({ kind: "QUOTIENT", originalN, originalD, n: numeratorRounded, d: divisorRounded, q: quotient, stateBlock: block }),
    concept: "Use the compatible values, find the quick quotient, and choose the nearest option.",
    steps: [`${originalN}/${originalD} ≈ ${numeratorRounded}/${divisorRounded}.`, `${numeratorRounded} ÷ ${divisorRounded} = ${quotient}; choose ${quotient}.`],
    verification: ["The compatible divisor is non-zero.", "The nearest option is clearly separated from the others."],
  });
}

function compareRatios(seed: number): SapCp009Package {
  const mode = 13;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const relation = (seed - 1) % 3;
  const block = Math.floor((seed - 1) / 3);
  const scale = 200 + block * 100;
  const patterns = [
    [1, 2, 2, 3],
    [2, 3, 4, 6],
    [3, 4, 2, 3],
  ] as const;
  const [leftN, leftD, rightN, rightD] = patterns[relation]!;
  const offsets = [-41, -23, 17, 39] as const;
  const a = scale * leftN + offsets[seed % 4]!;
  const b = scale * leftD + offsets[(seed + 1) % 4]!;
  const c = scale * rightN + offsets[(seed + 2) % 4]!;
  const d = scale * rightD + offsets[(seed + 3) % 4]!;
  const cmp = leftN * rightD - rightN * leftD;
  const answer = cmp < 0 ? "A < B" : cmp > 0 ? "A > B" : "A = B";
  const opts = makeOptions(answer, seed, mode, [
    wrong("A < B", "RELATION_LT", "This relation does not match the rounded ratios."),
    wrong("A = B", "RELATION_EQ", "This relation does not match the rounded ratios."),
    wrong("A > B", "RELATION_GT", "This relation does not match the rounded ratios."),
    wrong("Cannot be compared", "UNNECESSARY_UNCERTAINTY", "The rounded ratios are enough for the comparison."),
  ]);
  return makePackage(prototypeId, seed, {
    stem: `Round each term to the nearest hundred. Let A = ${a}/${b} and B = ${c}/${d}. Compare the two approximate ratios.`,
    answer,
    options: opts,
    data: Object.freeze({ a, b, c, d, scale, leftN, leftD, rightN, rightD, answer, stateBlock: block }),
    concept: "Round all four terms to the same place, then compare the two ratios.",
    steps: [`A ≈ ${leftN}/${leftD} and B ≈ ${rightN}/${rightD}.`, `${leftN}×${rightD} ${cmp < 0 ? "<" : cmp > 0 ? ">" : "="} ${rightN}×${leftD}, so ${answer}.`],
    verification: ["Cross-multiplication compares the positive ratios.", "Every term uses nearest-hundred rounding."],
  });
}

function ratioDistortion(seed: number): SapCp009Package {
  const mode = 17;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const block = Math.floor((seed - 1) / 8);
  const denominatorRounded = 200 + ((seed - 1) % 8) * 100 + block * 800;
  const factor = [2, 3, 4][(seed - 1) % 3]!;
  const numeratorRounded = denominatorRounded * factor;
  const offsets = [-41, -23, 17, 39] as const;
  const numerator = numeratorRounded + offsets[seed % 4]!;
  const denominator = denominatorRounded + offsets[(seed + 1) % 4]!;
  const wrongDenominator = denominatorRounded - 100;
  const answer = `Round both terms to the same place: use ${numeratorRounded}:${denominatorRounded}`;
  const opts = makeOptions(answer, seed, mode, [
    wrong("The method is correct because both numbers are smaller", "UNCOORDINATED_SCALE_OK", "Changing one term by a different amount distorts the ratio."),
    wrong(`Use ${numeratorRounded + 100}:${wrongDenominator} instead`, "MOVE_ONLY_NUMERATOR", "Changing only the numerator does not repair the mismatch."),
    wrong(`Use ${numeratorRounded}:${denominatorRounded + 100} instead`, "MOVE_DENOMINATOR_OTHER_WAY", "The denominator should use normal nearest-hundred rounding."),
    wrong("Ratios should never be rounded", "REJECT_ALL_RATIO_APPROXIMATION", "Coordinated rounding is valid for a declared estimate."),
  ]);
  return makePackage(prototypeId, seed, {
    stem: `For ${numerator}:${denominator}, one estimate uses ${numeratorRounded}:${wrongDenominator}. Which statement correctly diagnoses the method?`,
    answer,
    options: opts,
    data: Object.freeze({ numerator, denominator, numeratorRounded, denominatorRounded, wrongDenominator, factor, stateBlock: block }),
    concept: "Approximate both terms of a ratio on the same scale; changing only one term can distort the ratio.",
    steps: [`${numerator} → ${numeratorRounded} and ${denominator} → ${denominatorRounded} to the nearest hundred.`, `Use ${numeratorRounded}:${denominatorRounded}, not ${numeratorRounded}:${wrongDenominator}.`],
    verification: ["Both corrected terms use the same rounding place.", "The unsafe estimate shifts only the denominator by an extra hundred."],
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[9]) return reciprocalRoute(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[10]) return missingFactor(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[11]) return missingDivisor(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[12]) return nearestOption(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[13]) return compareRatios(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[17]) return ratioDistortion(seed);
  return generateV4(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
