export const SAP_CP009_POLICY = "DECLARED_MULTIPLICATIVE_APPROXIMATION" as const;

export const SAP_CP009_PROTOTYPE_IDS = [
  "SAP-CP009-PROT-ROUNDED-PRODUCT",
  "SAP-CP009-PROT-DECIMAL-PRODUCT",
  "SAP-CP009-PROT-COMPATIBLE-QUOTIENT",
  "SAP-CP009-PROT-PERCENT-OF-QUANTITY",
  "SAP-CP009-PROT-QUANTITY-AS-PERCENT",
  "SAP-CP009-PROT-PERCENT-FACTOR-PRODUCT",
  "SAP-CP009-PROT-PRODUCT-QUOTIENT-CHAIN",
  "SAP-CP009-PROT-COORDINATED-RATIO-SCALING",
  "SAP-CP009-PROT-CANCEL-BEFORE-APPROXIMATION",
  "SAP-CP009-PROT-RECIPROCAL-THEN-MULTIPLY",
  "SAP-CP009-PROT-MISSING-APPROX-FACTOR",
  "SAP-CP009-PROT-MISSING-APPROX-DIVISOR",
  "SAP-CP009-PROT-NEAREST-OPTION-PRODUCT-QUOTIENT",
  "SAP-CP009-PROT-COMPARE-APPROX-RATIOS",
  "SAP-CP009-PROT-POSITIVE-PRODUCT-BOUNDS",
  "SAP-CP009-PROT-POSITIVE-QUOTIENT-BOUNDS",
  "SAP-CP009-PROT-DECIMAL-SCALE-DIAGNOSIS",
  "SAP-CP009-PROT-RATIO-DISTORTION-DIAGNOSIS",
  "SAP-CP009-PROT-PRODUCT-OVER-UNDER-CLASS",
] as const;

export type SapCp009PrototypeId = typeof SAP_CP009_PROTOTYPE_IDS[number];
export type SapCp009Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp009TaskDirection = "ESTIMATE" | "INVERSE" | "COMPARISON" | "BOUND" | "DIAGNOSIS";

export interface SapCp009Option {
  readonly value: string;
  readonly isCorrect: boolean;
  readonly misconceptionId: string | null;
  readonly analysis: string;
}

export interface SapCp009Package {
  readonly checkpointId: "SAP-CP-009";
  readonly prototypeId: SapCp009PrototypeId;
  readonly proposedPermanentQlId: string;
  readonly seed: number;
  readonly difficulty: SapCp009Difficulty;
  readonly taskDirection: SapCp009TaskDirection;
  readonly policy: typeof SAP_CP009_POLICY;
  readonly stem: string;
  readonly canonicalAnswer: string;
  readonly options: readonly SapCp009Option[];
  readonly correctIndex: number;
  readonly explanation: {
    readonly coreConcept: string;
    readonly steps: readonly string[];
    readonly finalAnswer: string;
    readonly verification: readonly string[];
  };
  readonly oracle: { readonly kind: SapCp009PrototypeId; readonly data: Readonly<Record<string, number | string>> };
  readonly canonicalPayloadKey: string;
  readonly generationIdentity: string;
  readonly validation: { readonly ok: boolean; readonly errors: readonly string[] };
  readonly lifecycle: {
    readonly permanentQlId: null;
    readonly contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    readonly active: false;
    readonly questionStudioDiscoverable: false;
    readonly questionBankWritable: false;
    readonly testEligible: false;
    readonly publiclyPublishable: false;
  };
}

const TITLES = [
  "Product estimated by rounding factors",
  "Decimal product estimated at a convenient scale",
  "Quotient estimated with compatible rounded values",
  "Approximate percentage of a quantity",
  "Approximate one quantity as a percentage of another",
  "Percentage-factor product",
  "Product-quotient approximation chain",
  "Coordinated ratio scaling",
  "Cancel a common factor before approximation",
  "Reciprocal-then-multiply estimate",
  "Missing factor under approximate equality",
  "Missing divisor under approximate equality",
  "Nearest option for a product or quotient estimate",
  "Compare two approximate ratios",
  "Bounds for a positive rounded product",
  "Bounds for a positive rounded quotient",
  "Decimal-scale diagnosis",
  "Diagnose ratio distortion from unsafe rounding",
  "Classify a rounded product as overestimate or underestimate",
] as const;

const DIFFICULTIES: readonly SapCp009Difficulty[] = [
  "EASY", "MEDIUM", "EASY", "MEDIUM", "MEDIUM", "MEDIUM", "HARD", "MEDIUM", "MEDIUM", "MEDIUM",
  "MEDIUM", "MEDIUM", "MEDIUM", "HARD", "HARD", "HARD", "MEDIUM", "HARD", "MEDIUM",
];

const DIRECTIONS: readonly SapCp009TaskDirection[] = [
  "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE", "ESTIMATE",
  "INVERSE", "INVERSE", "ESTIMATE", "COMPARISON", "BOUND", "BOUND", "DIAGNOSIS", "DIAGNOSIS", "COMPARISON",
];

export const SAP_CP009_CATALOGUE = Object.freeze(SAP_CP009_PROTOTYPE_IDS.map((prototypeId, index) => Object.freeze({
  prototypeId,
  proposedPermanentQlId: `SAP-QL-${String(147 + index).padStart(3, "0")}`,
  title: TITLES[index]!,
  difficulty: DIFFICULTIES[index]!,
  taskDirection: DIRECTIONS[index]!,
})));

const LIFECYCLE: SapCp009Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

interface Rat { n: bigint; d: bigint }
function gcd(a: bigint, b: bigint): bigint {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) [x, y] = [y, x % y];
  return x || 1n;
}
function rat(n: bigint | number, d: bigint | number = 1): Rat {
  let nn = BigInt(n), dd = BigInt(d);
  if (dd === 0n) throw new Error("Zero denominator.");
  if (dd < 0n) { nn = -nn; dd = -dd; }
  const g = gcd(nn, dd);
  return { n: nn / g, d: dd / g };
}
function formatRat(v: Rat): string { return v.d === 1n ? `${v.n}` : `${v.n}/${v.d}`; }
function decimalRat(v: Rat, places = 1): string {
  const scale = 10 ** places;
  const scaled = Number(v.n) * scale / Number(v.d);
  const rounded = Math.round(scaled);
  return (rounded / scale).toFixed(places).replace(/\.0$/, "");
}
function roundIntegerToUnit(value: number, unit: number): number {
  if (!Number.isInteger(value) || !Number.isInteger(unit) || unit <= 0) throw new Error("Integer rounding contract breached.");
  const sign = value < 0 ? -1 : 1;
  const abs = Math.abs(value);
  const q = Math.floor(abs / unit);
  const r = abs % unit;
  return sign * (r * 2 >= unit ? q + 1 : q) * unit;
}
function formatTenths(value: number): string {
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  return `${sign}${Math.floor(abs / 10)}.${abs % 10}`;
}
function correctIndex(seed: number, modeIndex: number): number { return ((seed - 1) + modeIndex) % 4; }
function wrong(value: string, misconceptionId: string, analysis: string): SapCp009Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}
function makeOptions(answer: string, seed: number, modeIndex: number, distractors: readonly SapCp009Option[]): readonly SapCp009Option[] {
  const distinct = distractors.filter((item, index, all) => item.value !== answer && all.findIndex((x) => x.value === item.value) === index);
  if (distinct.length < 3) throw new Error(`${answer}: fewer than three distinct distractors.`);
  const correct: SapCp009Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "Correct estimate." });
  const options = [...distinct.slice(0, 3)];
  options.splice(correctIndex(seed, modeIndex), 0, correct);
  return Object.freeze(options);
}
function numericOptions(answer: number, step: number, seed: number, modeIndex: number): readonly SapCp009Option[] {
  return makeOptions(String(answer), seed, modeIndex, [
    wrong(String(answer + step), "ONE_STEP_HIGH", "The estimate is one convenient step too high."),
    wrong(String(answer - step), "ONE_STEP_LOW", "The estimate is one convenient step too low."),
    wrong(String(answer + 2 * step), "TWO_STEPS_HIGH", "The rounding adjustment has been applied twice."),
    wrong(String(answer - 2 * step), "TWO_STEPS_LOW", "The estimate has been reduced too much."),
  ]);
}
function simplePolicy(seed: number, place: string): string {
  return [
    `Round the required numbers to the ${place} and estimate`,
    `Estimate by first rounding the required numbers to the ${place}`,
    `Using ${place} rounded values, estimate`,
    `For a quick estimate, round the required numbers to the ${place} and find`,
  ][(seed - 1) % 4]!;
}
function build(
  prototypeId: SapCp009PrototypeId,
  seed: number,
  generated: {
    stem: string;
    answer: string;
    options: readonly SapCp009Option[];
    data: Readonly<Record<string, number | string>>;
    coreConcept: string;
    steps: readonly string[];
    verification: readonly string[];
  },
): SapCp009Package {
  const modeIndex = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  const meta = SAP_CP009_CATALOGUE[modeIndex]!;
  const partial: Omit<SapCp009Package, "validation"> = Object.freeze({
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
    correctIndex: generated.options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: generated.coreConcept,
      steps: Object.freeze(generated.steps),
      finalAnswer: `Answer: ${generated.answer}.`,
      verification: Object.freeze(generated.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data: generated.data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: generated.stem, answer: generated.answer, data: generated.data }),
    generationIdentity: `${prototypeId}:v1:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (partial.options.length !== 4 || new Set(partial.options.map((x) => x.value)).size !== 4) errors.push("Four distinct options required.");
  if (partial.options.filter((x) => x.isCorrect).length !== 1) errors.push("Exactly one correct option required.");
  if (partial.options[partial.correctIndex]?.value !== partial.canonicalAnswer) errors.push("Correct answer is not bound to correctIndex.");
  if (partial.explanation.steps.length < 2 || partial.explanation.steps.length > 3) errors.push("Student explanation must use 2-3 steps.");
  const studentText = `${partial.stem} ${partial.explanation.coreConcept} ${partial.explanation.steps.join(" ")} ${partial.explanation.verification.join(" ")}`;
  if (/oracle|runtime|prototype|canonical payload|learner route|transformed expression|internal|guard/i.test(studentText)) errors.push("Internal engineering language leaked into student content.");
  if (partial.lifecycle.active || partial.lifecycle.questionStudioDiscoverable || partial.lifecycle.questionBankWritable || partial.lifecycle.testEligible || partial.lifecycle.publiclyPublishable) errors.push("Lifecycle lock breached.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function productState(seed: number): { a: number; b: number; ra: number; rb: number } {
  const a = 121 + seed * 37 + (seed % 7);
  const b = 83 + seed * 23 + ((seed * 3) % 9);
  return { a, b, ra: roundIntegerToUnit(a, 10), rb: roundIntegerToUnit(b, 10) };
}

function generateRoundedProduct(seed: number): SapCp009Package {
  const mode = 0;
  const s = productState(seed);
  const answer = s.ra * s.rb;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `${simplePolicy(seed, "nearest ten")} ${s.a} × ${s.b}.`,
    answer: String(answer),
    options: makeOptions(String(answer), seed, mode, [
      wrong(String(s.a * s.rb), "ONLY_SECOND_ROUNDED", "Only the second factor was rounded."),
      wrong(String(s.ra * s.b), "ONLY_FIRST_ROUNDED", "Only the first factor was rounded."),
      wrong(String(answer + 10 * Math.max(s.ra, s.rb)), "EXTRA_TEN_FACTOR", "One rounded factor was increased by an extra ten."),
      wrong(String(Math.max(1, answer - 10 * Math.min(s.ra, s.rb))), "EXTRA_DOWNWARD_SHIFT", "One rounded factor was reduced by an extra ten."),
    ]),
    data: Object.freeze({ ...s, answer }),
    coreConcept: "Round both factors first, then multiply the rounded values.",
    steps: [`${s.a} → ${s.ra} and ${s.b} → ${s.rb}.`, `${s.ra} × ${s.rb} = ${answer}.`],
    verification: [`Both factors were rounded to the nearest ten.`, `The multiplication is done only after rounding.`],
  });
}

function generateDecimalProduct(seed: number): SapCp009Package {
  const mode = 1;
  const a10 = 207 + seed * 13 + ((seed * 7) % 8);
  const b10 = 123 + seed * 9 + ((seed * 5) % 7);
  const ra10 = roundIntegerToUnit(a10, 10), rb10 = roundIntegerToUnit(b10, 10);
  const a = ra10 / 10, b = rb10 / 10, answer = a * b;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `${simplePolicy(seed, "nearest whole number")} ${formatTenths(a10)} × ${formatTenths(b10)}.`,
    answer: String(answer),
    options: numericOptions(answer, Math.max(1, Math.round(Math.max(a, b))), seed, mode),
    data: Object.freeze({ a10, b10, ra10, rb10, answer }),
    coreConcept: "Round each decimal to a convenient whole number and then multiply.",
    steps: [`${formatTenths(a10)} → ${a} and ${formatTenths(b10)} → ${b}.`, `${a} × ${b} = ${answer}.`],
    verification: [`The decimal point is removed only by rounding to whole numbers.`, `The final scale matches ${a} × ${b}.`],
  });
}

function generateCompatibleQuotient(seed: number): SapCp009Package {
  const mode = 2;
  const quotient = 5 + ((seed - 1) % 16);
  const divisorRounded = [20, 30, 40, 50][(seed - 1) % 4]!;
  const dividendRounded = quotient * divisorRounded;
  const divisor = divisorRounded + [-4, -2, 3, 4][seed % 4]!;
  const dividend = dividendRounded + [-8, -4, 4, 8][(seed + 1) % 4]!;
  const answer = quotient;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${dividend} to the nearest ten and ${divisor} to the nearest ten. Using these compatible values, estimate ${dividend} ÷ ${divisor}.`,
    answer: String(answer),
    options: makeOptions(String(answer), seed, mode, [
      wrong(String(answer + 1), "QUOTIENT_HIGH", "The rounded dividend or divisor was shifted one step too far."),
      wrong(String(Math.max(1, answer - 1)), "QUOTIENT_LOW", "The compatible quotient was reduced by one."),
      wrong(String(answer * 10), "PLACE_VALUE_ERROR", "A factor of ten was introduced incorrectly."),
      wrong(String(Math.max(1, Math.round(divisorRounded / dividendRounded))), "RECIPROCAL_ERROR", "The quotient was reversed."),
    ]),
    data: Object.freeze({ dividend, divisor, dividendRounded, divisorRounded, answer }),
    coreConcept: "Choose the stated rounded values so the division becomes easy.",
    steps: [`${dividend} → ${dividendRounded} and ${divisor} → ${divisorRounded}.`, `${dividendRounded} ÷ ${divisorRounded} = ${answer}.`],
    verification: [`The rounded divisor is not zero.`, `The rounded numbers give an exact compatible quotient.`],
  });
}

function generatePercentOfQuantity(seed: number): SapCp009Package {
  const mode = 3;
  const pRounded = [10, 20, 25, 40, 50][(seed - 1) % 5]!;
  const qRounded = [200, 300, 400, 500, 600][Math.floor((seed - 1) / 5) % 5]!;
  const p = pRounded + [-2, -1, 1, 2][seed % 4]!;
  const q = qRounded + [-24, -11, 13, 21][(seed + 1) % 4]!;
  const answer = (pRounded * qRounded) / 100;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Use ${pRounded}% for ${p}% and ${qRounded} for ${q}. Estimate ${p}% of ${q}.`,
    answer: String(answer),
    options: makeOptions(String(answer), seed, mode, [
      wrong(String((pRounded * qRounded) / 10), "PERCENT_AS_TENTHS", "The percent was divided by 10 instead of 100."),
      wrong(String(pRounded + qRounded), "ADD_INSTEAD_OF_PERCENT", "The rounded values were added instead of taking a percentage."),
      wrong(String(Math.max(1, qRounded - answer)), "USED_COMPLEMENT", "The complement of the required percentage was used."),
      wrong(String(Math.max(1, answer + qRounded / 10)), "PERCENT_STEP_HIGH", "The percentage estimate is one large step too high."),
    ]),
    data: Object.freeze({ p, q, pRounded, qRounded, answer }),
    coreConcept: "Convert the rounded percentage to a fraction out of 100, then multiply by the rounded quantity.",
    steps: [`${p}% ≈ ${pRounded}% and ${q} ≈ ${qRounded}.`, `${pRounded}% of ${qRounded} = ${pRounded}/100 × ${qRounded} = ${answer}.`],
    verification: [`${pRounded}% means ${pRounded}/100.`, `The answer is of the same order as ${pRounded}% of ${qRounded}.`],
  });
}

function generateQuantityAsPercent(seed: number): SapCp009Package {
  const mode = 4;
  const percent = [20, 25, 40, 50, 60, 75, 80][(seed - 1) % 7]!;
  const denominatorRounded = [200, 400, 500, 800, 1000][Math.floor((seed - 1) / 7) % 5]!;
  const numeratorRounded = denominatorRounded * percent / 100;
  const numerator = numeratorRounded + [-4, -2, 2, 4][seed % 4]!;
  const denominator = denominatorRounded + [-18, -7, 9, 17][(seed + 2) % 4]!;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Use ${numeratorRounded} for ${numerator} and ${denominatorRounded} for ${denominator}. Approximately what percent of ${denominator} is ${numerator}?`,
    answer: `${percent}%`,
    options: makeOptions(`${percent}%`, seed, mode, [
      wrong(`${Math.max(1, 100 - percent)}%`, "COMPLEMENT_PERCENT", "The complement was chosen."),
      wrong(`${percent + 10}%`, "TEN_PERCENT_HIGH", "The ratio was moved ten percentage points too high."),
      wrong(`${Math.max(1, percent - 10)}%`, "TEN_PERCENT_LOW", "The ratio was moved ten percentage points too low."),
      wrong(`${Math.min(99, percent + 5)}%`, "FIVE_PERCENT_HIGH", "The ratio estimate was increased without reason."),
    ]),
    data: Object.freeze({ numerator, denominator, numeratorRounded, denominatorRounded, percent }),
    coreConcept: "Divide the rounded part by the rounded whole and multiply by 100.",
    steps: [`${numerator}/${denominator} ≈ ${numeratorRounded}/${denominatorRounded}.`, `${numeratorRounded}/${denominatorRounded} × 100 = ${percent}%.`],
    verification: [`The rounded numerator is smaller than or equal to the rounded denominator.`, `The percentage matches the rounded ratio exactly.`],
  });
}

function generatePercentFactorProduct(seed: number): SapCp009Package {
  const mode = 5;
  const factorPercent = [50, 75, 125, 150, 200][(seed - 1) % 5]!;
  const qRounded = [40, 60, 80, 100, 120][Math.floor((seed - 1) / 5) % 5]!;
  const q10 = qRounded * 10 + [-4, -2, 3, 4][seed % 4]!;
  const answer = qRounded * factorPercent / 100;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${formatTenths(q10)} to the nearest whole number and estimate ${factorPercent}% of it.`,
    answer: String(answer),
    options: makeOptions(String(answer), seed, mode, [
      wrong(String(qRounded * factorPercent / 10), "PERCENT_SCALE_TEN", "The percentage was divided by 10 instead of 100."),
      wrong(String(qRounded + factorPercent), "ADD_PERCENT_NUMBER", "The percentage number was added to the quantity."),
      wrong(String(Math.abs(qRounded - answer)), "SUBTRACTED_FACTOR", "The percentage factor was treated as a subtraction."),
      wrong(String(answer + Math.max(5, qRounded / 4)), "FACTOR_HIGH", "The percentage factor was applied too strongly."),
    ]),
    data: Object.freeze({ q10, qRounded, factorPercent, answer }),
    coreConcept: "First round the quantity, then apply the percentage factor to that rounded value.",
    steps: [`${formatTenths(q10)} → ${qRounded}.`, `${factorPercent}% of ${qRounded} = ${answer}.`],
    verification: [`${factorPercent}% = ${factorPercent}/100.`, `The rounded quantity is used only once.`],
  });
}

function generateProductQuotientChain(seed: number): SapCp009Package {
  const mode = 6;
  const aRounded = 20 + 10 * ((seed - 1) % 9);
  const bRounded = 10 + 10 * (Math.floor((seed - 1) / 9) % 6);
  const divisorRounded = [10, 20][seed % 2]!;
  const a = aRounded + [-4, -2, 3, 4][seed % 4]!;
  const b = bRounded + [-3, -1, 2, 4][(seed + 1) % 4]!;
  const divisor = divisorRounded + [-3, -1, 2, 4][(seed + 2) % 4]!;
  const answer = aRounded * bRounded / divisorRounded;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round each number to the nearest ten and estimate (${a} × ${b}) ÷ ${divisor}.`,
    answer: String(answer),
    options: numericOptions(answer, Math.max(5, Math.round(answer / 10)), seed, mode),
    data: Object.freeze({ a, b, divisor, aRounded, bRounded, divisorRounded, answer }),
    coreConcept: "Round all three numbers first, then follow multiplication and division in order.",
    steps: [`${a} → ${aRounded}, ${b} → ${bRounded}, ${divisor} → ${divisorRounded}.`, `(${aRounded} × ${bRounded}) ÷ ${divisorRounded} = ${answer}.`],
    verification: [`The divisor remains non-zero after rounding.`, `No extra rounding is done after the chain is evaluated.`],
  });
}

function generateCoordinatedRatio(seed: number): SapCp009Package {
  const mode = 7;
  const base = 100 * (2 + ((seed - 1) % 7));
  const p = [1, 2, 3, 4][Math.floor((seed - 1) / 7) % 4]!;
  const q = [2, 3, 4, 5][(seed + 1) % 4]!;
  const g = gcd(BigInt(p), BigInt(q));
  const rp = p / Number(g), rq = q / Number(g);
  const aRounded = base * p, bRounded = base * q;
  const a = aRounded + [-41, -23, 17, 39][seed % 4]!;
  const b = bRounded + [-37, -19, 21, 43][(seed + 1) % 4]!;
  const answer = `${rp}:${rq}`;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round both terms to the nearest hundred and estimate the ratio ${a}:${b} in simplest form.`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong(`${rq}:${rp}`, "REVERSED_RATIO", "The order of the ratio was reversed."),
      wrong(`${p + 1}:${q}`, "FIRST_TERM_HIGH", "Only the first rounded term was increased."),
      wrong(`${p}:${q + 1}`, "SECOND_TERM_HIGH", "Only the second rounded term was increased."),
      wrong(`${Math.max(1, rp - 1)}:${rq}`, "FIRST_TERM_LOW", "The first ratio term was reduced too much."),
    ]),
    data: Object.freeze({ a, b, aRounded, bRounded, rp, rq }),
    coreConcept: "Round both terms on the same scale, then simplify the resulting ratio.",
    steps: [`${a}:${b} ≈ ${aRounded}:${bRounded}.`, `${aRounded}:${bRounded} = ${answer}.`],
    verification: [`Both terms were rounded to the same place.`, `The final ratio is in simplest form.`],
  });
}

function generateCancelBeforeApprox(seed: number): SapCp009Package {
  const mode = 8;
  const a = 121 + seed * 17;
  const b = 83 + seed * 11;
  const ra = roundIntegerToUnit(a, 10), rb = roundIntegerToUnit(b, 10);
  const common = [2, 3, 4, 5][seed % 4]!;
  const numeratorFactor = common * 2;
  const denominatorFactor = common;
  const answerRat = rat(2 * ra, rb);
  const answer = decimalRat(answerRat, 1);
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `For a quick estimate, first cancel the common factor in (${a} × ${numeratorFactor}) ÷ (${b} × ${denominatorFactor}), then round ${a} and ${b} to the nearest ten.`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong(decimalRat(rat(ra, rb), 1), "MISSED_FACTOR_TWO", "The exact common-factor reduction left a factor 2, but it was dropped."),
      wrong(decimalRat(rat(common * ra, rb), 1), "PARTIAL_CANCELLATION", "The common factor was only partly cancelled."),
      wrong(decimalRat(rat(2 * rb, ra), 1), "REVERSED_AFTER_CANCELLATION", "The reduced ratio was reversed."),
      wrong(decimalRat(rat(3 * ra, rb), 1), "EXTRA_FACTOR", "An extra factor was introduced after cancellation."),
    ]),
    data: Object.freeze({ a, b, ra, rb, common, numeratorFactor, denominatorFactor, answer }),
    coreConcept: "Cancel an exact common factor before rounding; this keeps the estimate simple without changing the value first.",
    steps: [`${numeratorFactor}/${denominatorFactor} = 2, so the expression becomes about (2 × ${a})/${b}.`, `${a} → ${ra}, ${b} → ${rb}; 2 × ${ra}/${rb} ≈ ${answer}.`],
    verification: [`The exact common factor is removed before approximation.`, `Only ${a} and ${b} are rounded.`],
  });
}

function generateReciprocalRoute(seed: number): SapCp009Package {
  const mode = 9;
  const divisorRounded = [20, 25, 40, 50][(seed - 1) % 4]!;
  const answer = 5 + ((seed - 1) % 16);
  const numeratorRounded = divisorRounded * answer;
  const numerator = numeratorRounded + [-8, -4, 4, 8][seed % 4]!;
  const divisor = divisorRounded + [-2, -1, 1, 2][(seed + 1) % 4]!;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Use ${numeratorRounded} for ${numerator} and ${divisorRounded} for ${divisor}. Estimate ${numerator} ÷ ${divisor} by multiplying by the reciprocal of ${divisorRounded}.`,
    answer: String(answer),
    options: makeOptions(String(answer), seed, mode, [
      wrong(String(answer + 1), "RECIPROCAL_ROUTE_HIGH", "The reciprocal product is one unit too high."),
      wrong(String(Math.max(1, answer - 1)), "RECIPROCAL_ROUTE_LOW", "The reciprocal product is one unit too low."),
      wrong(String(numeratorRounded * divisorRounded), "MULTIPLIED_BY_DIVISOR", "The divisor was multiplied instead of replaced by its reciprocal."),
      wrong(String(Math.max(1, Math.round(divisorRounded / numeratorRounded))), "REVERSED_RECIPROCAL", "The reciprocal was taken for the wrong number."),
    ]),
    data: Object.freeze({ numerator, divisor, numeratorRounded, divisorRounded, answer }),
    coreConcept: "Division by a convenient number can be written as multiplication by its reciprocal.",
    steps: [`${numerator}/${divisor} ≈ ${numeratorRounded}/${divisorRounded}.`, `${numeratorRounded} × 1/${divisorRounded} = ${answer}.`],
    verification: [`1/${divisorRounded} is the reciprocal of ${divisorRounded}.`, `Multiplying by the reciprocal gives the same compatible quotient.`],
  });
}

function generateMissingFactor(seed: number): SapCp009Package {
  const mode = 10;
  const known = [20, 30, 40, 50][(seed - 1) % 4]!;
  const missing = 3 + ((seed - 1) % 18);
  const target = known * missing;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `After rounding, one factor is ${known} and the product is approximately ${target}. What rounded value should replace □ in ${known} × □ ≈ ${target}?`,
    answer: String(missing),
    options: makeOptions(String(missing), seed, mode, [
      wrong(String(missing + 1), "FACTOR_HIGH", "The missing factor is one too high."),
      wrong(String(Math.max(1, missing - 1)), "FACTOR_LOW", "The missing factor is one too low."),
      wrong(String(target - known), "SUBTRACT_INSTEAD_OF_DIVIDE", "Subtraction was used instead of division."),
      wrong(String(known), "COPIED_KNOWN_FACTOR", "The known factor was copied into the box."),
    ]),
    data: Object.freeze({ known, missing, target }),
    coreConcept: "To recover a missing factor, divide the approximate product by the known rounded factor.",
    steps: [`□ ≈ ${target} ÷ ${known}.`, `${target} ÷ ${known} = ${missing}.`],
    verification: [`${known} × ${missing} = ${target}.`, `Substitution reproduces the approximate product.`],
  });
}

function generateMissingDivisor(seed: number): SapCp009Package {
  const mode = 11;
  const quotient = 4 + ((seed - 1) % 17);
  const divisor = [10, 20, 25, 40, 50][(seed - 1) % 5]!;
  const dividend = quotient * divisor;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Using rounded values, ${dividend} ÷ □ ≈ ${quotient}. What rounded divisor should replace □?`,
    answer: String(divisor),
    options: makeOptions(String(divisor), seed, mode, [
      wrong(String(divisor + 10), "DIVISOR_HIGH", "The divisor is one convenient step too high."),
      wrong(String(Math.max(1, divisor - 10)), "DIVISOR_LOW", "The divisor is one convenient step too low."),
      wrong(String(quotient), "COPIED_QUOTIENT", "The quotient was copied into the divisor position."),
      wrong(String(dividend - quotient), "SUBTRACT_INSTEAD_OF_DIVIDE", "Subtraction was used instead of inverse division."),
    ]),
    data: Object.freeze({ quotient, divisor, dividend }),
    coreConcept: "If dividend ÷ divisor = quotient, then divisor = dividend ÷ quotient.",
    steps: [`□ ≈ ${dividend} ÷ ${quotient}.`, `${dividend} ÷ ${quotient} = ${divisor}.`],
    verification: [`${dividend} ÷ ${divisor} = ${quotient}.`, `The divisor is positive and non-zero.`],
  });
}

function generateNearestOption(seed: number): SapCp009Package {
  const mode = 12;
  const productMode = seed % 2 === 1;
  if (productMode) {
    const s = productState(seed + 100);
    const estimate = s.ra * s.rb;
    const spacing = Math.max(100, 10 * Math.min(s.ra, s.rb));
    return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
      stem: `Round ${s.a} and ${s.b} to the nearest ten. Which option is nearest to ${s.a} × ${s.b}?`,
      answer: String(estimate),
      options: numericOptions(estimate, spacing, seed, mode),
      data: Object.freeze({ kind: "PRODUCT", ...s, estimate, spacing }),
      coreConcept: "Use the rounded product, then select the option nearest to that estimate.",
      steps: [`${s.a} → ${s.ra} and ${s.b} → ${s.rb}.`, `${s.ra} × ${s.rb} = ${estimate}; choose ${estimate}.`],
      verification: [`The other options are at least ${spacing} away.`, `The rounded product gives a unique nearest option.`],
    });
  }
  const q = 5 + ((seed - 1) % 16);
  const d = [20, 40, 50][seed % 3]!;
  const n = q * d;
  const originalN = n + [-8, -3, 4, 7][seed % 4]!;
  const originalD = d + [-3, -1, 2, 4][(seed + 1) % 4]!;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Use ${n} for ${originalN} and ${d} for ${originalD}. Which option is nearest to ${originalN} ÷ ${originalD}?`,
    answer: String(q),
    options: makeOptions(String(q), seed, mode, [
      wrong(String(q + 2), "QUOTIENT_TWO_HIGH", "The option is too high for the compatible quotient."),
      wrong(String(Math.max(1, q - 2)), "QUOTIENT_TWO_LOW", "The option is too low for the compatible quotient."),
      wrong(String(q * 10), "PLACE_VALUE_TEN", "A factor of ten was introduced."),
      wrong(String(q + 5), "QUOTIENT_FIVE_HIGH", "The option is much too high."),
    ]),
    data: Object.freeze({ kind: "QUOTIENT", originalN, originalD, n, d, q }),
    coreConcept: "Use the given compatible values, find the quick quotient, and choose the nearest option.",
    steps: [`${originalN}/${originalD} ≈ ${n}/${d}.`, `${n} ÷ ${d} = ${q}; choose ${q}.`],
    verification: [`The compatible divisor is non-zero.`, `The correct option is separated clearly from the distractors.`],
  });
}

function generateRatioComparison(seed: number): SapCp009Package {
  const mode = 13;
  const relationIndex = (seed - 1) % 3;
  const base = 100 * (2 + (seed % 5));
  const leftN = [1, 2, 3, 4][seed % 4]!, leftD = [2, 3, 4, 5][(seed + 1) % 4]!;
  let rightN = leftN, rightD = leftD;
  if (relationIndex === 0) rightN = leftN + 1;
  if (relationIndex === 2) rightD = leftD + 1;
  const a = base * leftN + [-31, -17, 19, 37][seed % 4]!;
  const b = base * leftD + [-29, -11, 23, 41][(seed + 1) % 4]!;
  const c = base * rightN + [-33, -13, 21, 39][(seed + 2) % 4]!;
  const d = base * rightD + [-27, -9, 17, 43][(seed + 3) % 4]!;
  const cmp = leftN * rightD - rightN * leftD;
  const answer = cmp < 0 ? "A < B" : cmp > 0 ? "A > B" : "A = B";
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round each term to the nearest hundred. Let A = ${a}/${b} and B = ${c}/${d}. Compare the two approximate ratios.`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong("A < B", "RELATION_LT", "This relation does not match the rounded ratios."),
      wrong("A = B", "RELATION_EQ", "The rounded ratios are not equal in this case."),
      wrong("A > B", "RELATION_GT", "This relation does not match the rounded ratios."),
      wrong("Cannot be compared", "UNNECESSARY_UNCERTAINTY", "The rounded ratios are sufficient for the requested comparison."),
    ]),
    data: Object.freeze({ a, b, c, d, base, leftN, leftD, rightN, rightD, answer }),
    coreConcept: "Round all four terms to the same place, form the two ratios, and compare them.",
    steps: [`A ≈ ${leftN}/${leftD} and B ≈ ${rightN}/${rightD}.`, `${leftN}×${rightD} ${cmp < 0 ? "<" : cmp > 0 ? ">" : "="} ${rightN}×${leftD}, so ${answer}.`],
    verification: [`Cross-multiplication compares the two positive ratios.`, `The same rounding place is used for every term.`],
  });
}

function generateProductBounds(seed: number): SapCp009Package {
  const mode = 14;
  const ra = 100 + 10 * ((seed - 1) % 20);
  const rb = 80 + 10 * (Math.floor((seed - 1) / 20) % 15);
  const low = (ra - 5) * (rb - 5), high = (ra + 5) * (rb + 5);
  const answer = `${low} ≤ exact product < ${high}`;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Two positive numbers round to ${ra} and ${rb} to the nearest ten. Which interval must contain their exact product?`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong(`${low} < exact product < ${high}`, "LOW_ENDPOINT_WRONGLY_OPEN", "Both lower endpoints are included, so their positive product can equal the lower bound."),
      wrong(`${low} ≤ exact product ≤ ${high}`, "UPPER_ENDPOINT_WRONGLY_CLOSED", "The upper rounding endpoints are excluded."),
      wrong(`${ra * rb - 5} ≤ exact product < ${ra * rb + 5}`, "USED_SINGLE_ROUNDING_ERROR", "Product uncertainty is larger than a single ±5 adjustment."),
      wrong(`${(ra - 10) * (rb - 10)} ≤ exact product < ${(ra + 10) * (rb + 10)}`, "USED_FULL_UNIT", "A full rounding unit was used on each side instead of half a unit."),
    ]),
    data: Object.freeze({ ra, rb, low, high }),
    coreConcept: "Each rounded number represents a half-open interval; for positive factors, multiply the lower endpoints and the upper endpoints.",
    steps: [`First number: [${ra - 5}, ${ra + 5}); second: [${rb - 5}, ${rb + 5}).`, `Product: ${answer}.`],
    verification: [`The lower product is attainable because both lower endpoints are included.`, `The upper product is not attained because the upper endpoints are excluded.`],
  });
}

function generateQuotientBounds(seed: number): SapCp009Package {
  const mode = 15;
  const rn = 200 + 20 * ((seed - 1) % 20);
  const rd = 40 + 10 * (Math.floor((seed - 1) / 20) % 10);
  const nLow = rn - 5, nHigh = rn + 5, dLow = rd - 5, dHigh = rd + 5;
  const low = rat(nLow, dHigh), high = rat(nHigh, dLow);
  const answer = `${formatRat(low)} < exact quotient < ${formatRat(high)}`;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `A positive numerator rounds to ${rn} and a positive denominator to ${rd}, both to the nearest ten. Which interval must contain the exact quotient?`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong(`${formatRat(low)} ≤ exact quotient < ${formatRat(high)}`, "LOW_BOUND_CLOSED", "The lower quotient would need the denominator's excluded upper endpoint."),
      wrong(`${formatRat(low)} < exact quotient ≤ ${formatRat(high)}`, "UPPER_BOUND_CLOSED", "The upper quotient would need the numerator's excluded upper endpoint."),
      wrong(`${formatRat(rat(nLow, dLow))} < exact quotient < ${formatRat(rat(nHigh, dHigh))}`, "WRONG_MONOTONIC_ENDPOINTS", "For a quotient, the denominator moves in the opposite direction when forming bounds."),
      wrong(`${formatRat(rat(rn, rd))} < exact quotient < ${formatRat(rat(rn + 10, rd - 10))}`, "USED_ROUNDED_CENTRE", "The rounded centre is not itself the lower endpoint."),
    ]),
    data: Object.freeze({ rn, rd, nLow, nHigh, dLow, dHigh, low: formatRat(low), high: formatRat(high) }),
    coreConcept: "For a positive quotient, the smallest value uses the smallest numerator and largest denominator; the largest uses the largest numerator and smallest denominator.",
    steps: [`Numerator: [${nLow}, ${nHigh}); denominator: [${dLow}, ${dHigh}).`, `So ${answer}.`],
    verification: [`The denominator interval stays positive and away from zero.`, `Both extreme quotient endpoints are open in these half-open rounding bands.`],
  });
}

function generateScaleDiagnosis(seed: number): SapCp009Package {
  const mode = 16;
  const a10 = 407 + seed * 11;
  const b1000 = 160 + ((seed * 7) % 35); // 0.160..0.194
  const aRounded = roundIntegerToUnit(a10, 10) / 10;
  const bRoundedTenths = roundIntegerToUnit(b1000, 100) / 1000; // nearest 0.1
  const correct = aRounded * bRoundedTenths;
  const wrongValue = correct * 10;
  const answer = `Decimal place shifted; estimate should be ${correct}`;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `A student rounds ${formatTenths(a10)} to ${aRounded} and ${(b1000 / 1000).toFixed(3)} to ${bRoundedTenths.toFixed(1)}, but writes the product as ${wrongValue}. What is the error?`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong(`Both rounded values are wrong`, "BLAME_ROUNDING_VALUES", "The rounded values are acceptable; the scale error occurs in multiplication."),
      wrong(`The product should be ${correct * 100}`, "SHIFTED_TWO_PLACES", "The decimal point is moved two places too far."),
      wrong(`No error; ${wrongValue} is correct`, "ACCEPT_SCALE_ERROR", "The product is ten times too large."),
      wrong(`The second factor should be rounded to ${Math.round(b1000 / 1000)}`, "WRONG_ROUNDING_TARGET", "The stated rounding target is tenths, not whole numbers."),
    ]),
    data: Object.freeze({ a10, b1000, aRounded, bRoundedTenths, correct, wrongValue }),
    coreConcept: "After rounding, keep the decimal scale when multiplying; do not add an extra factor of ten.",
    steps: [`Rounded product = ${aRounded} × ${bRoundedTenths.toFixed(1)}.`, `${aRounded} × ${bRoundedTenths.toFixed(1)} = ${correct}, not ${wrongValue}.`],
    verification: [`A factor near ${aRounded} times a factor below 1 should stay below ${aRounded}.`, `The written answer is ten times too large.`],
  });
}

function generateRatioDistortionDiagnosis(seed: number): SapCp009Package {
  const mode = 17;
  const denominatorRounded = 100 * (2 + ((seed - 1) % 8));
  const numeratorRounded = denominatorRounded * [2, 3, 4][seed % 3]!;
  const numerator = numeratorRounded + [-39, -21, 17, 43][seed % 4]!;
  const denominator = denominatorRounded + [-41, -19, 23, 37][(seed + 1) % 4]!;
  const correctRatio = `${numeratorRounded}:${denominatorRounded}`;
  const wrongDenominator = Math.max(100, denominatorRounded - 100);
  const answer = `Round both terms to the same place: use ${correctRatio}`;
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `For ${numerator}:${denominator}, one estimate uses ${numeratorRounded}:${wrongDenominator}. Which statement correctly diagnoses the method?`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong(`The method is correct because both numbers are smaller`, "UNCOORDINATED_SCALE_OK", "Changing one term by a different scale distorts the ratio."),
      wrong(`Use ${numeratorRounded + 100}:${wrongDenominator} instead`, "MOVE_ONLY_NUMERATOR", "Changing only the numerator does not repair the scale mismatch."),
      wrong(`Use ${numeratorRounded}:${denominatorRounded + 100} instead`, "MOVE_DENOMINATOR_OTHER_WAY", "The denominator should be rounded normally to the stated place."),
      wrong(`Ratios should never be rounded`, "REJECT_ALL_RATIO_APPROXIMATION", "Coordinated rounding is valid when the approximation is declared and safe."),
    ]),
    data: Object.freeze({ numerator, denominator, numeratorRounded, denominatorRounded, wrongDenominator }),
    coreConcept: "A ratio should be approximated on a common scale; changing only one term can distort the relative size.",
    steps: [`${numerator} → ${numeratorRounded} and ${denominator} → ${denominatorRounded} to the nearest hundred.`, `Use ${correctRatio}, not ${numeratorRounded}:${wrongDenominator}.`],
    verification: [`Both corrected terms use the same rounding place.`, `The unsafe estimate changes the denominator by an extra hundred.`],
  });
}

function generateOverUnder(seed: number): SapCp009Package {
  const mode = 18;
  const s = productState(seed + 250);
  const exact = s.a * s.b, estimate = s.ra * s.rb;
  const answer = estimate > exact ? "Overestimate" : estimate < exact ? "Underestimate" : "Exact after rounding";
  return build(SAP_CP009_PROTOTYPE_IDS[mode]!, seed, {
    stem: `Round ${s.a} and ${s.b} to the nearest ten and compare the estimated product with the exact product. Is the estimate an overestimate or an underestimate?`,
    answer,
    options: makeOptions(answer, seed, mode, [
      wrong("Overestimate", "CLASS_OVER", "This classification does not match the two products."),
      wrong("Underestimate", "CLASS_UNDER", "This classification does not match the two products."),
      wrong("Exact after rounding", "CLASS_EXACT", "The rounded product is not equal to the exact product here."),
      wrong("Cannot be determined", "CLASS_UNKNOWN", "Both products can be calculated directly."),
    ]),
    data: Object.freeze({ ...s, exact, estimate, answer }),
    coreConcept: "Compare the product of the rounded factors with the exact product.",
    steps: [`Estimate: ${s.ra} × ${s.rb} = ${estimate}.`, `Exact product: ${s.a} × ${s.b} = ${exact}; therefore ${answer}.`],
    verification: [`Both products are positive.`, `Their numerical comparison determines the class directly.`],
  });
}

const GENERATORS: readonly ((seed: number) => SapCp009Package)[] = [
  generateRoundedProduct,
  generateDecimalProduct,
  generateCompatibleQuotient,
  generatePercentOfQuantity,
  generateQuantityAsPercent,
  generatePercentFactorProduct,
  generateProductQuotientChain,
  generateCoordinatedRatio,
  generateCancelBeforeApprox,
  generateReciprocalRoute,
  generateMissingFactor,
  generateMissingDivisor,
  generateNearestOption,
  generateRatioComparison,
  generateProductBounds,
  generateQuotientBounds,
  generateScaleDiagnosis,
  generateRatioDistortionDiagnosis,
  generateOverUnder,
];

export function generateSapCp009(prototypeId: SapCp009PrototypeId, seed: number): SapCp009Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("seed must be a positive integer.");
  const index = SAP_CP009_PROTOTYPE_IDS.indexOf(prototypeId);
  if (index < 0) throw new Error(`Unknown CP009 prototype ${prototypeId}.`);
  return GENERATORS[index]!(seed);
}

export function generateSapCp009Sweep(seedsPerMode = 100): readonly SapCp009Package[] {
  return Object.freeze(SAP_CP009_PROTOTYPE_IDS.flatMap((prototypeId) =>
    Array.from({ length: seedsPerMode }, (_, index) => generateSapCp009(prototypeId, index + 1)),
  ));
}
