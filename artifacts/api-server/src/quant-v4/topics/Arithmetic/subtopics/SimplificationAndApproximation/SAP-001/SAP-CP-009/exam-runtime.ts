import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateBase,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./final-runtime";
import type { SapCp009Option } from "./runtime";

export { SAP_CP009_CATALOGUE, SAP_CP009_POLICY, SAP_CP009_PROTOTYPE_IDS };
export type { SapCp009Package, SapCp009PrototypeId };

function correctPosition(seed: number, mode: number): number {
  return ((seed - 1) + mode) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function optionSet(
  answer: string,
  seed: number,
  mode: number,
  wrongs: readonly SapCp009Option[],
): readonly SapCp009Option[] {
  const unique = wrongs.filter(
    (item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index,
  );
  if (unique.length < 3) throw new Error(`${answer}: exam-runtime distractors collapsed in mode ${mode}.`);
  const correct: SapCp009Option = Object.freeze({
    value: answer,
    isCorrect: true,
    misconceptionId: null,
    analysis: "Correct.",
  });
  const out = [...unique.slice(0, 3)];
  out.splice(correctPosition(seed, mode), 0, correct);
  return Object.freeze(out);
}

function repack(
  base: SapCp009Package,
  args: {
    stem?: string;
    answer?: string;
    options?: readonly SapCp009Option[];
    data?: Readonly<Record<string, number | string>>;
    concept?: string;
    steps?: readonly string[];
    verification?: readonly string[];
    difficulty?: SapCp009Package["difficulty"];
    versionTag: string;
  },
): SapCp009Package {
  const stem = args.stem ?? base.stem;
  const answer = args.answer ?? base.canonicalAnswer;
  const options = args.options ?? base.options;
  const data = Object.freeze({ ...(args.data ?? base.oracle.data), examEditorialVersion: 3 });
  const concept = args.concept ?? base.explanation.coreConcept;
  const steps = Object.freeze([...(args.steps ?? base.explanation.steps)]);
  const verification = Object.freeze([...(args.verification ?? base.explanation.verification)]);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const errors: string[] = [];
  if (options.length !== 4 || new Set(options.map((option) => option.value)).size !== 4) errors.push("Four distinct options required.");
  if (options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (options[correctIndex]?.value !== answer) errors.push("Correct option mismatch.");
  if (steps.length < 2 || steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  const studentText = `${stem} ${concept} ${steps.join(" ")} ${verification.join(" ")} ${options.map((option) => option.analysis).join(" ")}`;
  if (/oracle|runtime|prototype|canonical payload|learner route|transformed expression|internal|guard/i.test(studentText)) {
    errors.push("Internal wording leaked.");
  }
  if (/for estimation, take|using cancellation|using\s+-?\d+(?:\.\d+)?\s+for\s+-?\d+(?:\.\d+)?|round the required numbers/i.test(stem)) {
    errors.push("Stem gives away the approximation route or uses non-exam wording.");
  }
  return Object.freeze({
    ...base,
    difficulty: args.difficulty ?? base.difficulty,
    stem,
    canonicalAnswer: answer,
    options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: concept,
      steps,
      finalAnswer: `Answer: ${answer}.`,
      verification,
    }),
    oracle: Object.freeze({ kind: base.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem, answer, data, examEditorial: args.versionTag }),
    generationIdentity: `${base.prototypeId}:exam-v3:${args.versionTag}:${base.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function closeNumericOptions(answer: number, seed: number, mode: number, suffix = ""): readonly SapCp009Option[] {
  const magnitude = Math.max(5, Math.abs(answer) * 0.25);
  const step = Math.max(5, Math.round(magnitude / 5) * 5);
  const fmt = (value: number) => `${Math.max(0, value)}${suffix}`;
  return optionSet(`${answer}${suffix}`, seed, mode, [
    wrong(fmt(answer - step), "NEARBY_LOW", "The estimate is slightly too low."),
    wrong(fmt(answer + step), "NEARBY_HIGH", "The estimate is slightly too high."),
    wrong(fmt(answer + 2 * step), "ROUNDING_TOO_HIGH", "The rounded values were taken too high."),
    wrong(fmt(Math.max(0, answer - 2 * step)), "ROUNDING_TOO_LOW", "The rounded values were taken too low."),
  ]);
}

function roundedProduct(seed: number): SapCp009Package {
  const mode = 0;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const base = generateBase(prototypeId, seed);
  const block = Math.floor((seed - 1) / 25);
  const ra = 50 + ((seed - 1) % 25) * 10;
  const rb = 20 + block * 20;
  const offsets = [-4, -2, 2, 4] as const;
  const a = ra + offsets[seed % 4]!;
  const b = rb + offsets[(seed + 1) % 4]!;
  const answerNumber = ra * rb;
  const answer = String(answerNumber);
  const step = 10 * Math.min(ra, rb);
  const options = optionSet(answer, seed, mode, [
    wrong(String(answerNumber - step), "ONE_ROUNDED_STEP_LOW", "One rounded factor was taken one ten too low."),
    wrong(String(answerNumber + step), "ONE_ROUNDED_STEP_HIGH", "One rounded factor was taken one ten too high."),
    wrong(String(answerNumber + 2 * step), "TWO_ROUNDED_STEPS_HIGH", "A rounded factor was moved two tens too high."),
    wrong(String(answerNumber - 2 * step), "TWO_ROUNDED_STEPS_LOW", "A rounded factor was moved two tens too low."),
  ]);
  const stems = [
    `Round each factor to the nearest ten and estimate ${a} × ${b}.`,
    `Estimate ${a} × ${b} by rounding both factors to the nearest ten.`,
    `The approximate value of ${a} × ${b}, when each factor is rounded to the nearest ten, is:`,
    `Using nearest-ten approximation, find the value of ${a} × ${b}.`,
  ] as const;
  return repack(base, {
    stem: stems[(seed - 1) % stems.length]!,
    answer,
    options,
    data: Object.freeze({ a, b, ra, rb, answer: answerNumber }),
    concept: "Round each factor to the nearest ten and multiply the rounded values.",
    steps: [`${a} → ${ra} and ${b} → ${rb}.`, `${ra} × ${rb} = ${answer}.`],
    verification: ["Both factors are rounded to the nearest ten.", "The rounded multiplication remains short enough for an approximation question."],
    difficulty: "EASY",
    versionTag: "rounded-product-bounded",
  });
}

function percentOfQuantity(seed: number): SapCp009Package {
  const mode = 3;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const answerNumber = Number(base.canonicalAnswer);
  const stems = [
    `Using suitable approximation, find ${d.p}% of ${d.q}.`,
    `The approximate value of ${d.p}% of ${d.q} is:`,
    `Estimate ${d.p}% of ${d.q} using convenient nearby values.`,
    `Which of the following is the best approximate value of ${d.p}% of ${d.q}?`,
  ] as const;
  return repack(base, {
    stem: stems[(seed - 1) % stems.length]!,
    options: closeNumericOptions(answerNumber, seed, mode),
    concept: "Choose nearby percentage and quantity values that make the calculation quick.",
    steps: [`${d.p}% ≈ ${d.pRounded}% and ${d.q} ≈ ${d.qRounded}.`, `${d.pRounded}/100 × ${d.qRounded} = ${base.canonicalAnswer}.`],
    verification: ["The replacements are close to the original values.", "The percentage calculation is done after approximation."],
    versionTag: "percent-unguided",
  });
}

function quantityAsPercent(seed: number): SapCp009Package {
  const mode = 4;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const answerNumber = Number(String(base.canonicalAnswer).replace("%", ""));
  const stems = [
    `Using suitable approximation, ${d.numerator} is approximately what percent of ${d.denominator}?`,
    `${d.numerator} is approximately what percent of ${d.denominator}?`,
    `Estimate ${d.numerator} as a percentage of ${d.denominator}.`,
    `Which option best approximates ${d.numerator} as a percentage of ${d.denominator}?`,
  ] as const;
  return repack(base, {
    stem: stems[(seed - 1) % stems.length]!,
    options: closeNumericOptions(answerNumber, seed, mode, "%"),
    concept: "Approximate the part and the whole with convenient nearby values, then convert the fraction to a percentage.",
    steps: [`${d.numerator}/${d.denominator} ≈ ${d.numeratorRounded}/${d.denominatorRounded}.`, `${d.numeratorRounded}/${d.denominatorRounded} × 100 = ${base.canonicalAnswer}.`],
    verification: ["The numerator and denominator are replaced by nearby compatible values.", "The final result is expressed as a percentage."],
    versionTag: "quantity-percent-unguided",
  });
}

function percentageFactor(seed: number): SapCp009Package {
  const mode = 5;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const answerNumber = Number(base.canonicalAnswer);
  return repack(base, {
    options: closeNumericOptions(answerNumber, seed, mode),
    concept: "Round the quantity as instructed, then apply the percentage factor.",
    steps: base.explanation.steps,
    verification: base.explanation.verification,
    versionTag: "percent-factor-close-options",
  });
}

function ratioScaling(seed: number): SapCp009Package {
  const mode = 7;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const rp = Number(d.rp), rq = Number(d.rq);
  const answer = `${rp}:${rq}`;
  const candidates = [
    `${rq}:${rp}`,
    `${rp + 1}:${rq}`,
    `${rp}:${rq + 1}`,
    `${rp + 1}:${rq + 1}`,
    `${Math.max(1, rp - 1)}:${rq + 1}`,
  ];
  const equivalent = (ratio: string) => {
    const [a, b] = ratio.split(":").map(Number);
    return a! * rq === b! * rp;
  };
  const wrongs = candidates
    .filter((value, index, all) => !equivalent(value) && all.indexOf(value) === index)
    .map((value, index) => wrong(value, `RATIO_DISTRACTOR_${index + 1}`, "The rounded ratio has not been reduced or compared correctly."));
  return repack(base, {
    options: optionSet(answer, seed, mode, wrongs),
    versionTag: "ratio-no-equivalent-options",
  });
}

function cancellation(seed: number): SapCp009Package {
  const mode = 8;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  return repack(base, {
    stem: `Round ${d.a} and ${d.b} to the nearest ten and estimate (${d.a} × ${d.numeratorFactor}) ÷ (${d.b} × ${d.denominatorFactor}).`,
    concept: "Simplify the exact common factor first, then round the remaining awkward numbers.",
    steps: [`${d.numeratorFactor}/${d.denominatorFactor} = 2, so the expression becomes (2 × ${d.a})/${d.b}.`, `${d.a} → ${d.ra}, ${d.b} → ${d.rb}; 2 × ${d.ra}/${d.rb} ≈ ${base.canonicalAnswer}.`],
    verification: ["The exact common factor is simplified before approximation.", "Only the remaining two-digit values are rounded."],
    versionTag: "cancellation-not-given-away",
  });
}

function reciprocal(seed: number): SapCp009Package {
  const mode = 9;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  return repack(base, {
    stem: `Round ${d.numerator} and ${d.divisor} to the nearest ten and estimate ${d.numerator} × 1/${d.divisor}.`,
    concept: "After rounding, multiply by the reciprocal of the rounded divisor.",
    steps: [`${d.numerator} → ${d.numeratorRounded} and ${d.divisor} → ${d.divisorRounded}.`, `${d.numeratorRounded} × 1/${d.divisorRounded} = ${base.canonicalAnswer}.`],
    verification: ["Both values are rounded by the stated rule.", "The reciprocal is used only after rounding."],
    versionTag: "reciprocal-not-given-away",
  });
}

function nearestOption(seed: number): SapCp009Package {
  const mode = 12;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  if (d.kind !== "QUOTIENT") return repack(base, { versionTag: "nearest-product-retained" });
  return repack(base, {
    stem: `Round ${d.rawN ?? d.n} and ${d.rawD ?? d.d} to the nearest ten. Which option is nearest to ${d.rawN ?? d.n} ÷ ${d.rawD ?? d.d}?`,
    concept: "Round the numerator and denominator to nearby tens, then divide the rounded values.",
    steps: base.explanation.steps,
    verification: base.explanation.verification,
    versionTag: "nearest-quotient-not-given-away",
  });
}

function cleanLongDecimals(value: string): string {
  return value.replace(/-?\d+\.\d{6,}/g, (token) => {
    const n = Number(token);
    if (!Number.isFinite(n)) return token;
    return n.toFixed(6).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
  });
}

function decimalScale(seed: number): SapCp009Package {
  const mode = 16;
  const base = generateBase(SAP_CP009_PROTOTYPE_IDS[mode]!, seed);
  const old = base.oracle.data;
  const correct = Number(Number(old.correct).toFixed(6));
  const wrongValue = Number(Number(old.wrongValue).toFixed(6));
  const data = Object.freeze({ ...old, correct, wrongValue });
  const answer = cleanLongDecimals(base.canonicalAnswer);
  const options = Object.freeze(base.options.map((option) => Object.freeze({
    ...option,
    value: cleanLongDecimals(option.value),
    analysis: cleanLongDecimals(option.analysis),
  })));
  return repack(base, {
    stem: cleanLongDecimals(base.stem),
    answer,
    options,
    data,
    concept: cleanLongDecimals(base.explanation.coreConcept),
    steps: base.explanation.steps.map(cleanLongDecimals),
    verification: base.explanation.verification.map(cleanLongDecimals),
    versionTag: "fixed-point-display",
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  const mode = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  if (mode === 0) return roundedProduct(seed);
  if (mode === 3) return percentOfQuantity(seed);
  if (mode === 4) return quantityAsPercent(seed);
  if (mode === 5) return percentageFactor(seed);
  if (mode === 7) return ratioScaling(seed);
  if (mode === 8) return cancellation(seed);
  if (mode === 9) return reciprocal(seed);
  if (mode === 12) return nearestOption(seed);
  if (mode === 16) return decimalScale(seed);
  return repack(generateBase(prototypeId, seed), { versionTag: "exam-language-pass-through" });
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
