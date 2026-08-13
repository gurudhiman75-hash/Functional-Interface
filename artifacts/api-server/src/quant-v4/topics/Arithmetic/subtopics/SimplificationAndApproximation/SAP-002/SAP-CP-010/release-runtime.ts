import {
  SAP_CP010_CATALOGUE,
  SAP_CP010_POLICY,
  SAP_CP010_PROTOTYPE_IDS,
  generateSapCp010 as generateCertified,
  type SapCp010Option,
  type SapCp010Package,
  type SapCp010PrototypeId,
} from "./certified-runtime";

export { SAP_CP010_CATALOGUE, SAP_CP010_POLICY, SAP_CP010_PROTOTYPE_IDS };
export type { SapCp010Package, SapCp010PrototypeId };

function fmt(value: number, places = 4): string {
  return value.toFixed(places).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp010Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function rebuild(
  base: SapCp010Package,
  args: {
    stem: string;
    answer?: string;
    wrongs: readonly SapCp010Option[];
    concept: string;
    steps: readonly string[];
    verification: readonly string[];
    tag: string;
  },
): SapCp010Package {
  const answer = args.answer ?? base.canonicalAnswer;
  const unique = args.wrongs.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${base.prototypeId}:${base.seed}: release distractors collapsed.`);
  const correct: SapCp010Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const options = [...unique.slice(0, 3)];
  options.splice(base.correctIndex, 0, correct);
  const frozenOptions = Object.freeze(options);
  const data = Object.freeze({ ...base.oracle.data, releaseRuntimeVersion: 5 });
  const visible = `${args.stem} ${answer} ${frozenOptions.map((o) => o.value).join(" ")} ${args.concept} ${args.steps.join(" ")} ${args.verification.join(" ")}`;
  const errors: string[] = [];
  if (frozenOptions.length !== 4 || new Set(frozenOptions.map((o) => o.value)).size !== 4) errors.push("Four distinct options required.");
  if (frozenOptions.filter((o) => o.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (frozenOptions[base.correctIndex]?.value !== answer) errors.push("Correct option mismatch.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  if (args.stem.length > 220) errors.push("Stem too long for exam presentation.");
  if (/oracle|runtime|prototype|canonical|internal|guard|machine policy|newton|taylor|logarithmic interpolation|binomial series/i.test(visible)) errors.push("Internal or unsupported wording leaked.");
  if (/-?\d+\.\d{6,}/.test(visible)) errors.push("Long floating-point display leaked.");
  return Object.freeze({
    ...base,
    stem: args.stem,
    canonicalAnswer: answer,
    options: frozenOptions,
    correctIndex: base.correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze([...args.steps]),
      finalAnswer: `Answer: ${answer}.`,
      verification: Object.freeze([...args.verification]),
    }),
    oracle: Object.freeze({ kind: base.prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId: base.prototypeId, stem: args.stem, answer, data, releaseTag: args.tag }),
    generationIdentity: `${base.prototypeId}:release-v5:${args.tag}:${base.seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
  });
}

function percentPower(seed: number): SapCp010Package {
  const mode = 7;
  const base = generateCertified(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const percent = Number(d.percent);
  const rounded = Number(d.roundedPercent);
  const exponent = Number(d.exponent);
  const factor = rounded / 100;
  const answer = fmt(factor ** exponent, 4);
  const lowerFactor = Math.max(10, rounded - 10) / 100;
  const upperFactor = Math.min(90, rounded + 10) / 100;
  const alternatePower = exponent === 2 ? factor ** 3 : factor ** 2;
  return rebuild(base, {
    stem: `Round ${percent}% to the nearest 10%. What is the approximate value of (${percent}/100)^${exponent}?`,
    answer,
    wrongs: [
      wrong(fmt(lowerFactor ** exponent, 4), "PERCENT_ROUNDED_LOW", "The percentage was rounded one 10% step too low."),
      wrong(fmt(upperFactor ** exponent, 4), "PERCENT_ROUNDED_HIGH", "The percentage was rounded one 10% step too high."),
      wrong(fmt(alternatePower, 4), "WRONG_POWER", "The rounded percentage was raised to the wrong power."),
    ],
    concept: "Round the percentage first, write it as a decimal factor, and then apply the power.",
    steps: [`${percent}% → ${rounded}% = ${fmt(factor, 2)}.`, `${fmt(factor, 2)}^${exponent} = ${answer}.`],
    verification: ["All values remain decimal factors, so there is no percentage-place shift."],
    tag: "percent-power-close-options",
  });
}

function reciprocal(seed: number): SapCp010Package {
  const mode = 8;
  const base = generateCertified(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const raw = String(d.raw);
  const rounded = Number(d.rounded);
  const answer = `1/${rounded}`;
  return rebuild(base, {
    stem: `Round ${raw} to the nearest whole number. Which fraction best estimates 1/${raw}?`,
    answer,
    wrongs: [
      wrong(`1/${rounded - 1}`, "DENOMINATOR_ONE_LOW", "The number was rounded one integer too low before taking the reciprocal."),
      wrong(`1/${rounded + 1}`, "DENOMINATOR_ONE_HIGH", "The number was rounded one integer too high before taking the reciprocal."),
      wrong(`1/${rounded + 2}`, "DENOMINATOR_TWO_HIGH", "The reciprocal denominator was moved two integers too high."),
    ],
    concept: "Round the denominator first, then take the reciprocal of that rounded value.",
    steps: [`${raw} → ${rounded}.`, `Therefore 1/${raw} ≈ 1/${rounded}.`],
    verification: ["The denominator remains positive and non-zero."],
    tag: "reciprocal-nearby-fractions",
  });
}

function rootQuotient(seed: number): SapCp010Package {
  const mode = 10;
  const base = generateCertified(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const quotient = Number(d.quotient);
  const answer = String(quotient);
  return rebuild(base, {
    stem: base.stem,
    answer,
    wrongs: [
      wrong(String(Math.max(1, quotient - 1)), "QUOTIENT_ONE_LOW", "The estimated quotient is one unit too low."),
      wrong(String(quotient + 1), "QUOTIENT_ONE_HIGH", "The estimated quotient is one unit too high."),
      wrong(String(quotient + 2), "QUOTIENT_TWO_HIGH", "The estimated quotient is two units too high."),
    ],
    concept: "Take each square root to the nearest integer and then divide those two estimates.",
    steps: [`√${d.n} ≈ ${d.numeratorRoot} and √${d.d} ≈ ${d.divisorRoot}.`, `${d.numeratorRoot} ÷ ${d.divisorRoot} = ${quotient}.`],
    verification: ["Both root estimates use certified nearest-integer benchmarks."],
    tag: "root-quotient-close-options",
  });
}

function mixedRootPower(seed: number): SapCp010Package {
  const mode = 11;
  const base = generateCertified(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const root = Number(d.root);
  const roundedBase = Number(d.roundedBase);
  const answerNumber = root + roundedBase ** 2;
  const answer = String(answerNumber);
  return rebuild(base, {
    stem: base.stem,
    answer,
    wrongs: [
      wrong(String((root - 1) + roundedBase ** 2), "ROOT_ONE_LOW", "The square root was taken one integer too low."),
      wrong(String(root + (roundedBase + 1) ** 2), "POWER_BASE_ONE_HIGH", "The decimal base was rounded one integer too high before squaring."),
      wrong(String(root + roundedBase), "FORGOT_TO_SQUARE", "The rounded base was added without being squared."),
    ],
    concept: "Estimate the root and the squared term separately, then add them.",
    steps: [`√${d.n} ≈ ${root}; ${d.raw} → ${roundedBase}, so (${d.raw})² ≈ ${roundedBase ** 2}.`, `${root} + ${roundedBase ** 2} = ${answerNumber}.`],
    verification: ["Both special-form estimates are completed before the final addition."],
    tag: "mixed-root-power-plausible-options",
  });
}

function missingRadicand(seed: number): SapCp010Package {
  const mode = 12;
  const base = generateCertified(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const k = Number(d.k);
  const square = Number(d.square);
  const correctN = Number(d.correctN);
  const below = String(d.side) === "BELOW";
  const answer = String(correctN);
  const wrongs = below
    ? [
        wrong(String(square - k), "JUST_OUTSIDE_LOWER_BAND", "This value is just beyond the lower nearest-root boundary and is nearer to the previous integer root."),
        wrong(String(square - k - 1), "BELOW_LOWER_BAND", "This value lies below the nearest-root band for the required integer."),
        wrong(String(square - 2 * k + 1), "NEAR_PREVIOUS_SQUARE", "This value lies near the previous perfect square."),
      ]
    : [
        wrong(String(square + k + 1), "JUST_OUTSIDE_UPPER_BAND", "This value is just beyond the upper nearest-root boundary and is nearer to the next integer root."),
        wrong(String(square + k + 2), "ABOVE_UPPER_BAND", "This value lies above the nearest-root band for the required integer."),
        wrong(String(square + 2 * k), "NEAR_NEXT_SQUARE", "This value lies near the next perfect square."),
      ];
  return rebuild(base, {
    stem: `Which of the following values ${below ? "below" : "above"} ${square} has a square root nearest to ${k}?`,
    answer,
    wrongs,
    concept: "Use the nearest-integer band around the required perfect square.",
    steps: [`${k}² = ${square}, and ${correctN} is only ${Math.abs(correctN - square)} ${below ? "below" : "above"} it.`, `So √${correctN} is nearest to ${k}.`],
    verification: [`The wrong options lie outside the nearest-integer band for root ${k}.`],
    tag: "missing-radicand-boundary-options",
  });
}

function missingPowerBase(seed: number): SapCp010Package {
  const mode = 13;
  const base = generateCertified(SAP_CP010_PROTOTYPE_IDS[mode]!, seed);
  const d = base.oracle.data;
  const rounded = Number(d.rounded);
  const exponent = Number(d.exponent);
  const target = Number(d.target);
  const below = String(d.side) === "BELOW";
  const answer = base.canonicalAnswer;
  const relation = below ? "slightly less than an integer" : "slightly greater than an integer";
  const operation = exponent === 2 ? "squaring" : "cubing";
  const wrongs = below
    ? [
        wrong((rounded + 0.8).toFixed(1), "ROUNDS_ONE_HIGH", "This value rounds one integer above the required base."),
        wrong((rounded - 1.2).toFixed(1), "ROUNDS_ONE_LOW", "This value rounds one integer below the required base."),
        wrong((rounded + 1.8).toFixed(1), "ROUNDS_TWO_HIGH", "This value rounds two integers above the required base."),
      ]
    : [
        wrong((rounded - 0.8).toFixed(1), "ROUNDS_ONE_LOW", "This value rounds one integer below the required base."),
        wrong((rounded + 1.2).toFixed(1), "ROUNDS_ONE_HIGH", "This value rounds one integer above the required base."),
        wrong((rounded + 2.2).toFixed(1), "ROUNDS_TWO_HIGH", "This value rounds two integers above the required base."),
      ];
  return rebuild(base, {
    stem: `A number ${relation} is rounded to the nearest whole number. After ${operation} the rounded value, the result is ${target}. Which option could be the original number?`,
    answer,
    wrongs,
    concept: "Recover the rounded integer from the power, then choose the option that rounds to that integer.",
    steps: [`${rounded}^${exponent} = ${target}, so the rounded value must be ${rounded}.`, `${answer} rounds to ${rounded}.`],
    verification: ["Each distractor rounds to a different whole number."],
    tag: "missing-power-base-natural-stem",
  });
}

export function generateSapCp010(prototypeId: SapCp010PrototypeId, seed: number): SapCp010Package {
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[7]) return percentPower(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[8]) return reciprocal(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[10]) return rootQuotient(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[11]) return mixedRootPower(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[12]) return missingRadicand(seed);
  if (prototypeId === SAP_CP010_PROTOTYPE_IDS[13]) return missingPowerBase(seed);
  return generateCertified(prototypeId, seed);
}

export function generateSapCp010Sweep(seedsPerMode = 100): readonly SapCp010Package[] {
  return Object.freeze(SAP_CP010_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp010(prototypeId, index + 1)),
  ));
}
