import {
  SAP_CP009_CATALOGUE,
  SAP_CP009_POLICY,
  SAP_CP009_PROTOTYPE_IDS,
  generateSapCp009 as generateV6,
  type SapCp009Package,
  type SapCp009PrototypeId,
} from "./runtime-v6";
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

function correctPosition(seed: number, mode: number): number {
  return ((seed - 1) + mode) % 4;
}
function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}
function optionSet(answer: string, seed: number, mode: number, wrongs: readonly SapCp009Option[]): readonly SapCp009Option[] {
  const unique = wrongs.filter((item, index, all) => item.value !== answer && all.findIndex((other) => other.value === item.value) === index);
  if (unique.length < 3) throw new Error(`${answer}: editorial distractors collapsed in mode ${mode}.`);
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct." });
  const out = [...unique.slice(0, 3)];
  out.splice(correctPosition(seed, mode), 0, correct);
  return Object.freeze(out);
}
function build(
  prototypeId: SapCp009PrototypeId,
  seed: number,
  args: {
    stem: string;
    answer: string;
    options: readonly SapCp009Option[];
    data: Readonly<Record<string, number | string>>;
    concept: string;
    steps: readonly string[];
    verification: readonly string[];
    difficulty?: SapCp009Package["difficulty"];
  },
): SapCp009Package {
  const mode = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  const meta = SAP_CP009_CATALOGUE[mode]!;
  const correctIndex = args.options.findIndex((o) => o.isCorrect);
  const errors: string[] = [];
  if (args.options.length !== 4 || new Set(args.options.map((o) => o.value)).size !== 4) errors.push("Four distinct options required.");
  if (args.options.filter((o) => o.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (args.options[correctIndex]?.value !== args.answer) errors.push("Correct option mismatch.");
  if (args.steps.length < 2 || args.steps.length > 3) errors.push("Explanation must use 2-3 steps.");
  const text = `${args.stem} ${args.concept} ${args.steps.join(" ")} ${args.verification.join(" ")} ${args.options.map((o) => o.analysis).join(" ")}`;
  if (/oracle|runtime|prototype|canonical|learner route|transformed expression|internal|guard/i.test(text)) errors.push("Internal wording leaked.");
  const data = Object.freeze({ ...args.data, editorialVersion: 1 });
  return Object.freeze({
    checkpointId: "SAP-CP-009",
    prototypeId,
    proposedPermanentQlId: meta.proposedPermanentQlId,
    seed,
    difficulty: args.difficulty ?? meta.difficulty,
    taskDirection: meta.taskDirection,
    policy: SAP_CP009_POLICY,
    stem: args.stem,
    canonicalAnswer: args.answer,
    options: args.options,
    correctIndex,
    explanation: Object.freeze({
      coreConcept: args.concept,
      steps: Object.freeze(args.steps),
      finalAnswer: `Answer: ${args.answer}.`,
      verification: Object.freeze(args.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: args.stem, answer: args.answer, data, editorial: 1 }),
    generationIdentity: `${prototypeId}:editorial-v1:${seed}:${JSON.stringify(data)}`,
    validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }),
    lifecycle: LIFECYCLE,
  });
}
function clonePresentation(
  base: SapCp009Package,
  stem: string,
  concept: string,
  steps: readonly string[],
  verification = base.explanation.verification,
  data: Readonly<Record<string, number | string>> = base.oracle.data,
): SapCp009Package {
  return build(base.prototypeId, base.seed, {
    stem,
    answer: base.canonicalAnswer,
    options: base.options,
    data,
    concept,
    steps,
    verification,
    difficulty: base.difficulty,
  });
}

function percentageOf(seed: number): SapCp009Package {
  const base = generateV6(SAP_CP009_PROTOTYPE_IDS[3]!, seed);
  const d = base.oracle.data;
  return clonePresentation(
    base,
    `For estimation, take ${d.p}% ≈ ${d.pRounded}% and ${d.q} ≈ ${d.qRounded}. Find ${d.p}% of ${d.q} approximately.`,
    "Use the nearby percentage and quantity given in the question, then calculate the percentage normally.",
    [`${d.p}% of ${d.q} ≈ ${d.pRounded}% of ${d.qRounded}.`, `${d.pRounded}/100 × ${d.qRounded} = ${base.canonicalAnswer}.`],
  );
}

function quantityAsPercent(seed: number): SapCp009Package {
  const base = generateV6(SAP_CP009_PROTOTYPE_IDS[4]!, seed);
  const d = base.oracle.data;
  return clonePresentation(
    base,
    `For estimation, take ${d.numerator} ≈ ${d.numeratorRounded} and ${d.denominator} ≈ ${d.denominatorRounded}. Approximately what percent of ${d.denominator} is ${d.numerator}?`,
    "Use the nearby part and whole, then convert the resulting fraction to a percentage.",
    [`${d.numerator}/${d.denominator} ≈ ${d.numeratorRounded}/${d.denominatorRounded}.`, `${d.numeratorRounded}/${d.denominatorRounded} × 100 = ${base.canonicalAnswer}.`],
  );
}

function coordinatedRatio(seed: number): SapCp009Package {
  const base = generateV6(SAP_CP009_PROTOTYPE_IDS[7]!, seed);
  const d = base.oracle.data;
  const block = Math.floor((seed - 1) / 8);
  const scale = 1000 + block * 200;
  const rp = Number(d.rp), rq = Number(d.rq);
  const aRounded = scale * rp, bRounded = scale * rq;
  const offsets = [-41, -23, 17, 39] as const;
  const a = aRounded + offsets[seed % 4]!;
  const b = bRounded + offsets[(seed + 1) % 4]!;
  const data = Object.freeze({ a, b, aRounded, bRounded, rp, rq, scale, safeRatioState: 1 });
  return clonePresentation(
    base,
    `Round both terms to the nearest hundred and estimate the ratio ${a}:${b} in simplest form.`,
    "Round both terms on the same scale, then reduce the rounded ratio.",
    [`${a}:${b} ≈ ${aRounded}:${bRounded}.`, `${aRounded}:${bRounded} = ${base.canonicalAnswer}.`],
    ["Both terms are rounded to the nearest hundred.", "The original values lie close to the rounded values, so the ratio is not changed sharply."],
    data,
  );
}

function cancellation(seed: number): SapCp009Package {
  const base = generateV6(SAP_CP009_PROTOTYPE_IDS[8]!, seed);
  const d = base.oracle.data;
  return clonePresentation(
    base,
    `Using cancellation and nearest-ten values, estimate (${d.a} × ${d.numeratorFactor}) ÷ (${d.b} × ${d.denominatorFactor}).`,
    "Cancel the exact common factor first. Then round only the remaining awkward numbers.",
    [`${d.numeratorFactor}/${d.denominatorFactor} = 2, so use (2 × ${d.a})/${d.b}.`, `${d.a} → ${d.ra}, ${d.b} → ${d.rb}; 2 × ${d.ra}/${d.rb} ≈ ${base.canonicalAnswer}.`],
  );
}

function reciprocal(seed: number): SapCp009Package {
  const base = generateV6(SAP_CP009_PROTOTYPE_IDS[9]!, seed);
  const d = base.oracle.data;
  return clonePresentation(
    base,
    `Using ${d.numeratorRounded} for ${d.numerator} and ${d.divisorRounded} for ${d.divisor}, estimate ${d.numerator} × 1/${d.divisor}.`,
    "A reciprocal turns division into multiplication, so use the compatible reciprocal after rounding.",
    [`${d.numerator} × 1/${d.divisor} ≈ ${d.numeratorRounded} × 1/${d.divisorRounded}.`, `${d.numeratorRounded} × 1/${d.divisorRounded} = ${base.canonicalAnswer}.`],
  );
}

function nearestOption(seed: number): SapCp009Package {
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[12]!;
  if (seed % 2 === 0) return generateV6(prototypeId, seed);
  const mode = 12;
  const block = Math.floor((seed - 1) / 2);
  const ra = 200 + (block % 10) * 100;
  const rb = 300 + Math.floor(block / 10) * 100;
  const offsets = [-41, -23, 17, 39] as const;
  const a = ra + offsets[seed % 4]!;
  const b = rb + offsets[(seed + 1) % 4]!;
  const estimate = ra * rb;
  const answer = String(estimate);
  const step = 100 * rb;
  const opts = optionSet(answer, seed, mode, [
    wrong(String(estimate + step), "FIRST_FACTOR_HIGH", "The first rounded factor was taken one hundred too high."),
    wrong(String(Math.max(1, estimate - step)), "FIRST_FACTOR_LOW", "The first rounded factor was taken one hundred too low."),
    wrong(String(estimate + 2 * step), "FIRST_FACTOR_TWO_HIGH", "The first factor was moved two hundreds too high."),
    wrong(String(estimate + 3 * step), "FIRST_FACTOR_THREE_HIGH", "The first factor was moved three hundreds too high."),
  ]);
  return build(prototypeId, seed, {
    stem: `Round ${a} and ${b} to the nearest hundred. Which option is nearest to ${a} × ${b}?`,
    answer,
    options: opts,
    data: Object.freeze({ kind: "PRODUCT", a, b, ra, rb, estimate, roundUnit: 100 }),
    concept: "Round the factors to hundreds so the product can be estimated quickly, then choose the nearest option.",
    steps: [`${a} → ${ra} and ${b} → ${rb}.`, `${ra} × ${rb} = ${estimate}; choose ${estimate}.`],
    verification: ["Both factors are rounded to the nearest hundred.", "The other options are separated by at least one hundred-factor step."],
  });
}

function compareRatios(seed: number): SapCp009Package {
  const base = generateV6(SAP_CP009_PROTOTYPE_IDS[13]!, seed);
  const d = base.oracle.data;
  const block = Math.floor((seed - 1) / 3);
  const scale = 1000 + block * 200;
  const leftN = Number(d.leftN), leftD = Number(d.leftD), rightN = Number(d.rightN), rightD = Number(d.rightD);
  const offsets = [-41, -23, 17, 39] as const;
  const a = scale * leftN + offsets[seed % 4]!;
  const b = scale * leftD + offsets[(seed + 1) % 4]!;
  const c = scale * rightN + offsets[(seed + 2) % 4]!;
  const dd = scale * rightD + offsets[(seed + 3) % 4]!;
  const data = Object.freeze({ a, b, c, d: dd, scale, leftN, leftD, rightN, rightD, answer: base.canonicalAnswer, safeRatioState: 1 });
  return clonePresentation(
    base,
    `Round each term to the nearest hundred. Let A = ${a}/${b} and B = ${c}/${dd}. Compare the two approximate ratios.`,
    "Round every term to the same place, then compare the two simple ratios by cross-multiplication.",
    [`A ≈ ${leftN}/${leftD} and B ≈ ${rightN}/${rightD}.`, `${leftN}×${rightD} ${base.canonicalAnswer === "A < B" ? "<" : base.canonicalAnswer === "A > B" ? ">" : "="} ${rightN}×${leftD}, so ${base.canonicalAnswer}.`],
    ["All four numbers are close to their nearest-hundred values.", "Cross-multiplication compares the two positive ratios."],
    data,
  );
}

function ratioDistortion(seed: number): SapCp009Package {
  const mode = 17;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const block = Math.floor((seed - 1) / 8);
  const denominatorRounded = 1000 + ((seed - 1) % 8) * 200 + block * 1600;
  const factor = [2, 3, 4][(seed - 1) % 3]!;
  const numeratorRounded = denominatorRounded * factor;
  const offsets = [-41, -23, 17, 39] as const;
  const numerator = numeratorRounded + offsets[seed % 4]!;
  const denominator = denominatorRounded + offsets[(seed + 1) % 4]!;
  const wrongDenominator = denominatorRounded - 100;
  const answer = `Use the same rounding place: ${numeratorRounded}:${denominatorRounded}`;
  const opts = optionSet(answer, seed, mode, [
    wrong(`Keep ${numeratorRounded}:${wrongDenominator}`, "ACCEPT_MISMATCH", "The denominator has been shifted one hundred away from its nearest-hundred value."),
    wrong(`Use ${numeratorRounded + 100}:${wrongDenominator}`, "MOVE_BOTH_WRONGLY", "Moving both terms away from their nearest values does not repair the estimate."),
    wrong(`Use ${numeratorRounded}:${denominatorRounded + 100}`, "DENOMINATOR_OTHER_WAY", "The denominator should be its actual nearest-hundred value."),
    wrong("Ratios should not be estimated", "REJECT_ESTIMATION", "A ratio can be estimated safely when both terms use a suitable common precision."),
  ]);
  return build(prototypeId, seed, {
    stem: `For ${numerator}:${denominator}, a student uses ${numeratorRounded}:${wrongDenominator} as the estimate. Which correction is best?`,
    answer,
    options: opts,
    data: Object.freeze({ numerator, denominator, numeratorRounded, denominatorRounded, wrongDenominator, factor, safeRatioState: 1 }),
    concept: "Use a suitable common precision for both terms of a ratio; do not shift one term away from its nearest rounded value.",
    steps: [`${numerator} → ${numeratorRounded} and ${denominator} → ${denominatorRounded} to the nearest hundred.`, `So use ${numeratorRounded}:${denominatorRounded}, not ${numeratorRounded}:${wrongDenominator}.`],
    verification: ["Both corrected terms are their nearest-hundred values.", "Only the student's denominator was displaced by an extra hundred."],
    difficulty: "MEDIUM",
  });
}

function overUnder(seed: number): SapCp009Package {
  const mode = 18;
  const prototypeId = SAP_CP009_PROTOTYPE_IDS[mode]!;
  const ra = 200 + seed * 10;
  const rb = 300 + seed * 20;
  const isUnder = seed % 2 === 1;
  const a = isUnder ? ra + 4 : ra - 4;
  const b = isUnder ? rb + 3 : rb - 3;
  const estimate = ra * rb;
  const exact = a * b;
  const answer = isUnder ? "Underestimate" : "Overestimate";
  const opts = optionSet(answer, seed, mode, [
    wrong("Overestimate", "CLASS_OVER", "This does not match the direction in which both factors were rounded."),
    wrong("Underestimate", "CLASS_UNDER", "This does not match the direction in which both factors were rounded."),
    wrong("Exact after rounding", "CLASS_EXACT", "At least one factor changes, so the product changes."),
    wrong("Cannot be determined", "CLASS_UNKNOWN", "Because both positive factors move in the same direction, the effect on the product is known."),
  ]);
  const direction = isUnder ? "down" : "up";
  return build(prototypeId, seed, {
    stem: `Round ${a} and ${b} to the nearest ten. Without doing the full multiplication, decide whether the estimated product is an overestimate or an underestimate.`,
    answer,
    options: opts,
    data: Object.freeze({ a, b, ra, rb, exact, estimate, answer, direction }),
    concept: "For positive factors, if both are rounded down the product decreases; if both are rounded up the product increases.",
    steps: [`${a} → ${ra} (${direction}) and ${b} → ${rb} (${direction}).`, `Both positive factors move ${direction}, so the rounded product is an ${answer.toLowerCase()}.`],
    verification: ["No large multiplication is needed.", "The direction of both rounding changes is enough to decide the result."],
  });
}

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[3]) return percentageOf(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[4]) return quantityAsPercent(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[7]) return coordinatedRatio(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[8]) return cancellation(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[9]) return reciprocal(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[12]) return nearestOption(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[13]) return compareRatios(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[17]) return ratioDistortion(seed);
  if (prototypeId === SAP_CP009_PROTOTYPE_IDS[18]) return overUnder(seed);
  return generateV6(prototypeId, seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
