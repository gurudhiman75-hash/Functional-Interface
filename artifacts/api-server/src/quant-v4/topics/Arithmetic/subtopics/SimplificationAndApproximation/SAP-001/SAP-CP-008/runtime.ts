export const SAP_CP008_POLICY = "ROUND_EACH_DECLARED_TERM_THEN_EVALUATE" as const;

export const SAP_CP008_PROTOTYPE_IDS = [
  "SAP-CP008-PROT-APPROX-INTEGER-SUM",
  "SAP-CP008-PROT-APPROX-INTEGER-DIFFERENCE",
  "SAP-CP008-PROT-SIGNED-ADDITIVE-CHAIN",
  "SAP-CP008-PROT-BRACKETED-ADDITIVE-CHAIN",
  "SAP-CP008-PROT-DECIMAL-SUM",
  "SAP-CP008-PROT-DECIMAL-DIFFERENCE",
  "SAP-CP008-PROT-COMPATIBLE-ADDENDS",
  "SAP-CP008-PROT-ADD-MULTIPLY-ADDITIVE-DOMINANT",
  "SAP-CP008-PROT-DIVIDE-ADD-ADDITIVE-DOMINANT",
  "SAP-CP008-PROT-BOUNDED-BODMAS-ADDITIVE",
  "SAP-CP008-PROT-MISSING-ADDEND-APPROX-EQUALITY",
  "SAP-CP008-PROT-MISSING-SUBTRAHEND-APPROX-EQUALITY",
  "SAP-CP008-PROT-NEAREST-OPTION-ADDITIVE",
  "SAP-CP008-PROT-SUM-ROUNDING-BOUNDS",
  "SAP-CP008-PROT-DIFFERENCE-ROUNDING-BOUNDS",
  "SAP-CP008-PROT-OVER-UNDER-CLASS",
  "SAP-CP008-PROT-COMPARE-ADDITIVE-ESTIMATES",
  "SAP-CP008-PROT-DIAGNOSE-INVALID-ROUNDING-DIRECTION",
] as const;

export type SapCp008PrototypeId = typeof SAP_CP008_PROTOTYPE_IDS[number];
export type SapCp008Difficulty = "EASY" | "MEDIUM" | "HARD";
export type SapCp008TaskDirection = "ESTIMATE" | "INVERSE" | "BOUND" | "COMPARISON" | "DIAGNOSIS";

export interface SapCp008Option {
  value: string;
  isCorrect: boolean;
  misconceptionId: string | null;
  analysis: string;
}

export interface SapCp008Package {
  checkpointId: "SAP-CP-008";
  prototypeId: SapCp008PrototypeId;
  proposedPermanentQlId: string;
  seed: number;
  difficulty: SapCp008Difficulty;
  taskDirection: SapCp008TaskDirection;
  policy: typeof SAP_CP008_POLICY;
  stem: string;
  canonicalAnswer: string;
  options: readonly SapCp008Option[];
  correctIndex: number;
  explanation: {
    coreConcept: string;
    steps: readonly string[];
    finalAnswer: string;
    verification: readonly string[];
  };
  oracle: { kind: SapCp008PrototypeId; data: Readonly<Record<string, number | string>> };
  canonicalPayloadKey: string;
  generationIdentity: string;
  validation: { ok: boolean; errors: readonly string[] };
  lifecycle: {
    permanentQlId: null;
    contentStatus: "ENGLISH_REVIEW_CANDIDATE";
    active: false;
    questionStudioDiscoverable: false;
    questionBankWritable: false;
    testEligible: false;
    publiclyPublishable: false;
  };
}

const LIFECYCLE: SapCp008Package["lifecycle"] = Object.freeze({
  permanentQlId: null,
  contentStatus: "ENGLISH_REVIEW_CANDIDATE",
  active: false,
  questionStudioDiscoverable: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
});

export const SAP_CP008_CATALOGUE = Object.freeze(SAP_CP008_PROTOTYPE_IDS.map((prototypeId, index) => Object.freeze({
  prototypeId,
  proposedPermanentQlId: `SAP-QL-${String(129 + index).padStart(3, "0")}`,
  difficulty: (index < 2 ? "EASY" : index < 13 ? "MEDIUM" : "HARD") as SapCp008Difficulty,
  taskDirection: ([10, 11].includes(index) ? "INVERSE" : [13, 14].includes(index) ? "BOUND" : [16].includes(index) ? "COMPARISON" : [15, 17].includes(index) ? "DIAGNOSIS" : "ESTIMATE") as SapCp008TaskDirection,
})));

function roundToUnit(value: number, unit: number): number {
  if (!Number.isInteger(value) || !Number.isInteger(unit) || unit <= 0) throw new Error("roundToUnit expects integer value and positive integer unit.");
  const sign = value < 0 ? -1 : 1;
  const absolute = Math.abs(value);
  const quotient = Math.floor(absolute / unit);
  const remainder = absolute % unit;
  const roundedQuotient = remainder * 2 >= unit ? quotient + 1 : quotient;
  return sign * roundedQuotient * unit;
}

function formatScaled(value: number, dp: number): string {
  const sign = value < 0 ? "-" : "";
  const absolute = Math.abs(value);
  if (dp === 0) return `${value}`;
  const factor = 10 ** dp;
  const whole = Math.floor(absolute / factor);
  const fraction = String(absolute % factor).padStart(dp, "0");
  return `${sign}${whole}.${fraction}`;
}

function correctIndex(seed: number): number {
  const n = seed - 1;
  return (n % 4 + Math.floor(n / 4)) % 4;
}

function wrong(value: string, misconceptionId: string, analysis: string): SapCp008Option {
  return Object.freeze({ value, isCorrect: false, misconceptionId, analysis });
}

function makeOptions(answer: string, seed: number, distractors: readonly SapCp008Option[]): readonly SapCp008Option[] {
  const distinct = distractors.filter((option, index, all) => option.value !== answer && all.findIndex((item) => item.value === option.value) === index);
  if (distinct.length < 3) throw new Error(`Need three distinct distractors for ${answer}.`);
  const correct: SapCp008Option = Object.freeze({ value: answer, isCorrect: true, misconceptionId: null, analysis: "This follows the declared terms-first approximation policy and then evaluates the transformed expression." });
  const options = [...distinct.slice(0, 3)];
  options.splice(correctIndex(seed), 0, correct);
  return Object.freeze(options);
}

function buildPackage(
  prototypeId: SapCp008PrototypeId,
  seed: number,
  generated: {
    stem: string;
    answer: string;
    options: readonly SapCp008Option[];
    data: Readonly<Record<string, number | string>>;
    coreConcept: string;
    steps: readonly string[];
    verification: readonly string[];
  },
): SapCp008Package {
  const catalogue = SAP_CP008_CATALOGUE.find((item) => item.prototypeId === prototypeId)!;
  const partial: Omit<SapCp008Package, "validation"> = Object.freeze({
    checkpointId: "SAP-CP-008",
    prototypeId,
    proposedPermanentQlId: catalogue.proposedPermanentQlId,
    seed,
    difficulty: catalogue.difficulty,
    taskDirection: catalogue.taskDirection,
    policy: SAP_CP008_POLICY,
    stem: generated.stem,
    canonicalAnswer: generated.answer,
    options: generated.options,
    correctIndex: generated.options.findIndex((option) => option.isCorrect),
    explanation: Object.freeze({
      coreConcept: generated.coreConcept,
      steps: Object.freeze(generated.steps),
      finalAnswer: `Therefore, the required answer is ${generated.answer}.`,
      verification: Object.freeze(generated.verification),
    }),
    oracle: Object.freeze({ kind: prototypeId, data: generated.data }),
    canonicalPayloadKey: JSON.stringify({ prototypeId, stem: generated.stem, answer: generated.answer, data: generated.data }),
    generationIdentity: `${prototypeId}:v1:seed:${seed}:${JSON.stringify(generated.data)}`,
    lifecycle: LIFECYCLE,
  });
  const errors: string[] = [];
  if (partial.options.length !== 4 || new Set(partial.options.map((option) => option.value)).size !== 4) errors.push("Options must contain four distinct values.");
  if (partial.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (partial.options[partial.correctIndex]?.value !== partial.canonicalAnswer) errors.push("Correct index is not answer-bound.");
  if (!partial.stem.includes("Round each indicated term")) errors.push("Declared terms-first policy is missing from the stem.");
  if (partial.explanation.steps.length < 2 || partial.explanation.verification.length < 2) errors.push("Explanation depth is insufficient.");
  if (partial.lifecycle.active || partial.lifecycle.questionStudioDiscoverable || partial.lifecycle.questionBankWritable || partial.lifecycle.testEligible || partial.lifecycle.publiclyPublishable) errors.push("Lifecycle lock breached.");
  return Object.freeze({ ...partial, validation: Object.freeze({ ok: errors.length === 0, errors: Object.freeze(errors) }) });
}

function state(seed: number): { unit: number; a: number; b: number; c: number } {
  const unit = [10, 100][(seed - 1) % 2]!;
  const block = Math.floor((seed - 1) / 2);
  const a = 230 + block * 37 + ((seed * 7) % 29);
  const b = 140 + block * 23 + ((seed * 11) % 31);
  const c = 70 + block * 13 + ((seed * 17) % 23);
  return { unit, a, b, c };
}

function estimateOptions(answer: number, unit: number, seed: number): readonly SapCp008Option[] {
  return makeOptions(String(answer), seed, [
    wrong(String(answer + unit), "ONE_UNIT_HIGH", "This moves the final estimate one complete rounding unit above the value produced by the declared policy."),
    wrong(String(answer - unit), "ONE_UNIT_LOW", "This moves the final estimate one complete rounding unit below the value produced by the declared policy."),
    wrong(String(answer + 2 * unit), "TWO_UNITS_HIGH", "This reflects compounding a rounding adjustment instead of evaluating the rounded terms exactly once."),
    wrong(String(answer - 2 * unit), "TWO_UNITS_LOW", "This over-corrects downward after the term-rounding stage."),
  ]);
}

function generateDirect(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  const s = state(seed);
  const ra = roundToUnit(s.a, s.unit), rb = roundToUnit(s.b, s.unit), rc = roundToUnit(s.c, s.unit);
  const place = s.unit === 10 ? "nearest ten" : "nearest hundred";
  const policy = `Round each indicated term to the ${place} first, then evaluate.`;

  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[0]) {
    const answer = ra + rb + rc;
    return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${s.a} + ${s.b} + ${s.c}.`, answer: String(answer), options: estimateOptions(answer, s.unit, seed), data: Object.freeze({ ...s, ra, rb, rc, answer }), coreConcept: "For a declared terms-first additive estimate, each addend is rounded independently to the stated place and only then are the rounded values added. The exact unrounded sum is retained only as an oracle, not as the learner route.", steps: [`${s.a} → ${ra}, ${s.b} → ${rb}, ${s.c} → ${rc}.`, `${ra} + ${rb} + ${rc} = ${answer}.`], verification: [`Exact sum = ${s.a + s.b + s.c}.`, `Applying the declared rounding map to all three terms independently reproduces ${answer}.`] });
  }
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[1]) {
    const a = s.a + s.b + 3 * s.unit;
    const ra2 = roundToUnit(a, s.unit);
    const answer = ra2 - rb;
    return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${a} − ${s.b}.`, answer: String(answer), options: estimateOptions(answer, s.unit, seed), data: Object.freeze({ unit: s.unit, a, b: s.b, ra: ra2, rb, answer }), coreConcept: "In a declared approximate difference, both displayed terms must be rounded by the same stated policy before subtraction. This prevents switching silently between an exact difference and a terms-first estimate.", steps: [`${a} → ${ra2} and ${s.b} → ${rb}.`, `${ra2} − ${rb} = ${answer}.`], verification: [`Exact difference = ${a - s.b}.`, `The transformed difference under the declared policy is exactly ${answer}.`] });
  }
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[2]) {
    const answer = ra - rb + rc;
    return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${s.a} − ${s.b} + ${s.c}.`, answer: String(answer), options: estimateOptions(answer, s.unit, seed), data: Object.freeze({ ...s, ra, rb, rc, answer }), coreConcept: "Signs stay attached to their terms during additive estimation. Round the magnitudes according to the declared place, keep the plus/minus structure unchanged, and then evaluate from left to right where operations have equal precedence.", steps: [`Rounded signed chain: ${ra} − ${rb} + ${rc}.`, `${ra} − ${rb} + ${rc} = ${answer}.`], verification: [`Exact signed value = ${s.a - s.b + s.c}.`, `No sign changes occur during the term-rounding stage.`] });
  }
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[3]) {
    const answer = ra + (rb - rc);
    return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${s.a} + (${s.b} − ${s.c}).`, answer: String(answer), options: estimateOptions(answer, s.unit, seed), data: Object.freeze({ ...s, ra, rb, rc, answer }), coreConcept: "Rounding changes the numeric terms, not the grouping. A bracketed additive estimate therefore keeps the bracket structure exactly as printed after every indicated term has been rounded.", steps: [`Rounded expression: ${ra} + (${rb} − ${rc}).`, `${rb} − ${rc} = ${rb - rc}; adding ${ra} gives ${answer}.`], verification: [`Exact bracketed value = ${s.a + (s.b - s.c)}.`, `The bracket is preserved unchanged in the transformed expression.`] });
  }
  throw new Error(`Unsupported direct prototype ${prototypeId}.`);
}

function generateDecimal(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  const n = seed - 1;
  const a = 1200 + n * 17 + ((seed * 13) % 47);
  const b = 800 + n * 11 + ((seed * 19) % 43);
  const c = 300 + n * 7 + ((seed * 23) % 37);
  const ra = roundToUnit(a, 10), rb = roundToUnit(b, 10), rc = roundToUnit(c, 10);
  const policy = "Round each indicated term to the nearest integer first, then evaluate.";
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[4]) {
    const answerScaled = ra + rb + rc;
    const answer = formatScaled(answerScaled, 1);
    return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${formatScaled(a, 1)} + ${formatScaled(b, 1)} + ${formatScaled(c, 1)}.`, answer, options: makeOptions(answer, seed, [wrong(formatScaled(answerScaled + 10, 1), "ONE_HIGH", "This is one whole unit above the terms-first estimate."), wrong(formatScaled(answerScaled - 10, 1), "ONE_LOW", "This is one whole unit below the terms-first estimate."), wrong(formatScaled(answerScaled + 20, 1), "TWO_HIGH", "This adds an extra two units after the rounded terms have already been combined.")]), data: Object.freeze({ a, b, c, ra, rb, rc, answerScaled, inputDp: 1 }), coreConcept: "A decimal additive estimate can be kept exact by storing tenths as integers. Rounding each decimal to the nearest integer means rounding each scaled tenths value to a multiple of ten before adding.", steps: [`${formatScaled(a, 1)} → ${formatScaled(ra, 1)}, ${formatScaled(b, 1)} → ${formatScaled(rb, 1)}, ${formatScaled(c, 1)} → ${formatScaled(rc, 1)}.`, `${formatScaled(ra, 1)} + ${formatScaled(rb, 1)} + ${formatScaled(rc, 1)} = ${answer}.`], verification: [`Exact scaled sum = ${a + b + c} tenths.`, `Rounded scaled terms sum to ${answerScaled} tenths.`] });
  }
  const a2 = a + b + 500;
  const ra2 = roundToUnit(a2, 10);
  const answerScaled = ra2 - rb;
  const answer = formatScaled(answerScaled, 1);
  return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${formatScaled(a2, 1)} − ${formatScaled(b, 1)}.`, answer, options: makeOptions(answer, seed, [wrong(formatScaled(answerScaled + 10, 1), "ONE_HIGH", "This is one unit above the declared estimate."), wrong(formatScaled(answerScaled - 10, 1), "ONE_LOW", "This is one unit below the declared estimate."), wrong(formatScaled(answerScaled + 20, 1), "TWO_HIGH", "This adds an unjustified extra adjustment after term rounding.")]), data: Object.freeze({ a: a2, b, ra: ra2, rb, answerScaled, inputDp: 1 }), coreConcept: "For decimal subtraction under a declared terms-first policy, round both decimals to the requested place using exact scaled integers, then subtract the transformed values.", steps: [`${formatScaled(a2, 1)} → ${formatScaled(ra2, 1)} and ${formatScaled(b, 1)} → ${formatScaled(rb, 1)}.`, `${formatScaled(ra2, 1)} − ${formatScaled(rb, 1)} = ${answer}.`], verification: [`Exact scaled difference = ${a2 - b} tenths.`, `The approved transformed difference is ${answerScaled} tenths.`] });
}

function generateCompatible(seed: number): SapCp008Package {
  const prototypeId = SAP_CP008_PROTOTYPE_IDS[6];
  const unit = seed % 2 === 0 ? 100 : 10;
  const n = seed - 1;
  const targetA = (8 + n) * unit;
  const targetB = (5 + (n % 17)) * unit;
  const a = targetA + (seed % 3 === 0 ? Math.floor(unit * 0.4) : -Math.floor(unit * 0.3));
  const b = targetB + (seed % 2 === 0 ? Math.floor(unit * 0.2) : -Math.floor(unit * 0.4));
  const answer = targetA + targetB;
  const place = unit === 10 ? "nearest ten" : "nearest hundred";
  return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the ${place} first, then evaluate. Which convenient rounded pair gives the approved estimate of ${a} + ${b}?`, answer: `${targetA} + ${targetB} = ${answer}`, options: makeOptions(`${targetA} + ${targetB} = ${answer}`, seed, [wrong(`${targetA + unit} + ${targetB} = ${answer + unit}`, "FIRST_TERM_WRONG_DIRECTION", "The first addend is rounded in the wrong direction."), wrong(`${targetA} + ${targetB + unit} = ${answer + unit}`, "SECOND_TERM_WRONG_DIRECTION", "The second addend is rounded in the wrong direction."), wrong(`${targetA - unit} + ${targetB} = ${answer - unit}`, "FIRST_TERM_TOO_LOW", "The first addend is moved to the neighbouring lower benchmark instead of its nearest declared benchmark.")]), data: Object.freeze({ unit, a, b, targetA, targetB, answer }), coreConcept: "Compatible addends are not freely invented here: the declared place-value policy fixes the rounded benchmark for each visible addend. The compatible pair is simply the pair of those approved rounded values.", steps: [`${a} → ${targetA} and ${b} → ${targetB}.`, `${targetA} + ${targetB} = ${answer}.`], verification: [`Each original lies inside the rounding interval of its displayed benchmark.`, `The pair therefore follows the declared policy without any discretionary substitution.`] });
}

function generateMixed(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  const s = state(seed);
  const unit = 10;
  const a = s.a, b = s.b, c = s.c;
  const ra = roundToUnit(a, unit), rb = roundToUnit(b, unit), rc = roundToUnit(c, unit);
  const policy = "Round each indicated term to the nearest ten first, then evaluate.";
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[7]) {
    const answer = ra + 2 * rb;
    return buildPackage(prototypeId, seed, { stem: `${policy} Estimate ${a} + 2 × ${b}.`, answer: String(answer), options: estimateOptions(answer, unit, seed), data: Object.freeze({ a, b, ra, rb, multiplier: 2, answer }), coreConcept: "This mixed chain remains CP-008 because the only approximated quantities are additive terms and the small exact multiplier merely scales one rounded addend. Keep multiplication before the final addition after rounding the indicated numeric terms.", steps: [`${a} → ${ra}; ${b} → ${rb}.`, `Evaluate ${ra} + 2 × ${rb} = ${ra} + ${2 * rb} = ${answer}.`], verification: [`The multiplier 2 is exact and is not rounded.`, `The transformed expression is evaluated by ordinary precedence after term rounding.`] });
  }
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[8]) {
    const divisor = [2, 5][seed % 2]!;
    const base = roundToUnit(a, divisor * 10);
    const adjusted = base + (seed % 2 === 0 ? divisor * 3 : -divisor * 2);
    const roundedA = roundToUnit(adjusted, divisor * 10);
    const roundedB = roundToUnit(b, 10);
    const answer = roundedA / divisor + roundedB;
    return buildPackage(prototypeId, seed, { stem: `Round each indicated term as follows first, then evaluate: round ${adjusted} to the nearest ${divisor * 10} and ${b} to the nearest ten. Estimate ${adjusted} ÷ ${divisor} + ${b}.`, answer: String(answer), options: estimateOptions(answer, 10, seed), data: Object.freeze({ a: adjusted, b, divisor, roundedA, roundedB, answer }), coreConcept: "A divide-add chain can remain additive-dominant when the divisor is a small exact constant and the declared compatible rounding affects the numeric numerator and addend. Apply each stated benchmark first, perform the exact division, then add.", steps: [`${adjusted} → ${roundedA}; ${b} → ${roundedB}.`, `${roundedA} ÷ ${divisor} + ${roundedB} = ${roundedA / divisor} + ${roundedB} = ${answer}.`], verification: [`${roundedA} is divisible by ${divisor}, so the transformed division is exact.`, `No denominator can round to zero because the divisor is the fixed exact integer ${divisor}.`] });
  }
  const answer = (ra - rb) + 2 * rc;
  return buildPackage(prototypeId, seed, { stem: `${policy} Estimate (${a} − ${b}) + 2 × ${c}.`, answer: String(answer), options: estimateOptions(answer, unit, seed), data: Object.freeze({ a, b, c, ra, rb, rc, answer }), coreConcept: "A bounded additive-dominant BODMAS estimate keeps the printed grouping and exact small coefficients after rounding the indicated numeric terms. The approximation step ends before the ordinary precedence calculation begins.", steps: [`Rounded expression: (${ra} − ${rb}) + 2 × ${rc}.`, `${ra - rb} + ${2 * rc} = ${answer}.`], verification: [`The bracket and multiplier remain unchanged.`, `Re-evaluating the transformed expression independently gives ${answer}.`] });
}

function generateInverse(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  const unit = seed % 2 === 0 ? 100 : 10;
  const n = seed - 1;
  const roundedKnown = (12 + n) * unit;
  const roundedMissing = (5 + (n % 23)) * unit;
  const target = prototypeId === SAP_CP008_PROTOTYPE_IDS[10] ? roundedKnown + roundedMissing : roundedKnown - roundedMissing;
  const known = roundedKnown + (seed % 3 === 0 ? Math.floor(unit * 0.4) : -Math.floor(unit * 0.2));
  const answer = roundedMissing;
  const place = unit === 10 ? "nearest ten" : "nearest hundred";
  const operator = prototypeId === SAP_CP008_PROTOTYPE_IDS[10] ? "+" : "−";
  return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the ${place} first, then evaluate. After rounding, ${known} ${operator} □ is approximately ${target}. What rounded value must □ contribute?`, answer: String(answer), options: makeOptions(String(answer), seed, [wrong(String(answer + unit), "ONE_UNIT_HIGH", "This makes the transformed equality exceed or miss the target by one full rounding unit."), wrong(String(answer - unit), "ONE_UNIT_LOW", "This leaves the transformed equality one rounding unit short of the required target."), wrong(String(answer + 2 * unit), "TWO_UNITS_HIGH", "This over-adjusts the missing rounded operand by two units.")]), data: Object.freeze({ unit, known, roundedKnown, roundedMissing, target, operator, answer }), coreConcept: "This is direct approximation-aware inversion, not a general equation family. First replace the visible known term by its declared rounded value, then recover the single missing rounded operand from the transformed additive equality.", steps: [`${known} → ${roundedKnown}.`, prototypeId === SAP_CP008_PROTOTYPE_IDS[10] ? `${roundedKnown} + □ = ${target}, so □ = ${target - roundedKnown}.` : `${roundedKnown} − □ = ${target}, so □ = ${roundedKnown - target}.`], verification: [`Substituting ${answer} into the transformed expression gives ${target}.`, `The candidate is unique among the displayed rounded values because the additive inverse is direct.`] });
}

function generateNearest(seed: number): SapCp008Package {
  const prototypeId = SAP_CP008_PROTOTYPE_IDS[12];
  const s = state(seed), unit = s.unit;
  const estimate = roundToUnit(s.a, unit) + roundToUnit(s.b, unit) - roundToUnit(s.c, unit);
  const options = [estimate - 3 * unit, estimate - unit, estimate + 2 * unit, estimate + 4 * unit];
  options[(seed - 1) % 4] = estimate;
  const answer = String(estimate);
  const place = unit === 10 ? "nearest ten" : "nearest hundred";
  return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the ${place} first, then evaluate. Which option is nearest to the approved estimate of ${s.a} + ${s.b} − ${s.c}?`, answer, options: makeOptions(answer, seed, options.filter((value) => value !== estimate).map((value, index) => wrong(String(value), `NEARBY_OPTION_${index + 1}`, "This option is near the estimate but does not equal the value obtained from the declared transformed expression."))), data: Object.freeze({ ...s, estimate, optionGapUnit: unit }), coreConcept: "Nearest-option selection is allowed here because the additive estimate itself is the decisive computation. Compute the approved terms-first estimate first; only then compare that estimate with the supplied alternatives.", steps: [`Rounded expression: ${roundToUnit(s.a, unit)} + ${roundToUnit(s.b, unit)} − ${roundToUnit(s.c, unit)}.`, `Its value is ${estimate}, so the nearest supplied option is ${answer}.`], verification: [`The approved estimate is an exact integer multiple of ${unit}.`, `Every wrong option is separated from it by at least one full rounding unit.`] });
}

function generateBounds(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  const unit = seed % 2 === 0 ? 100 : 10;
  const n = seed - 1;
  const x = (20 + n) * unit;
  const y = (8 + (n % 19)) * unit;
  const half = unit / 2;
  const sum = prototypeId === SAP_CP008_PROTOTYPE_IDS[13];
  const low = sum ? (x - half) + (y - half) : (x - half) - (y + half);
  const highExclusive = sum ? (x + half) + (y + half) : (x + half) - (y - half);
  const answer = `${low} ≤ exact value < ${highExclusive}`;
  const place = unit === 10 ? "nearest ten" : "nearest hundred";
  const expression = sum ? `${x} + ${y}` : `${x} − ${y}`;
  return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the ${place} first, then evaluate. Two positive values round to ${x} and ${y}. What certified interval contains the exact ${sum ? "sum" : "difference"} represented by the estimate ${expression}?`, answer, options: makeOptions(answer, seed, [wrong(`${low + half} ≤ exact value < ${highExclusive}`, "LOW_BOUND_TOO_HIGH", "This removes valid originals from the lower side of the certified rounding intervals."), wrong(`${low} ≤ exact value < ${highExclusive - half}`, "HIGH_BOUND_TOO_LOW", "This cuts away valid originals near the upper side of the certified interval."), wrong(`${low - unit} ≤ exact value < ${highExclusive}`, "LOW_BOUND_TOO_WIDE", "This extends the interval beyond values that can round to the stated term benchmarks.")]), data: Object.freeze({ unit, x, y, half, low, highExclusive, operation: sum ? "sum" : "difference" }), coreConcept: sum ? "For positive rounded addends, the smallest exact sum uses both lower endpoints and the supremum uses both upper endpoints. Because the upper endpoints of half-up rounding intervals belong to the next rounded benchmark, the combined upper bound remains open." : "For a difference x − y, the smallest exact value uses the smallest possible first term and largest possible second term; the largest uses the largest first term and smallest second term. This sign-aware endpoint pairing is essential.", steps: sum ? [`Each original lies in [${x - half}, ${x + half}) and [${y - half}, ${y + half}).`, `Add lower endpoints and upper endpoints: ${low} ≤ exact value < ${highExclusive}.`] : [`First original: [${x - half}, ${x + half}); second: [${y - half}, ${y + half}).`, `For x − y use lower−upper and upper−lower, giving ${low} ≤ exact value < ${highExclusive}.`], verification: [`The interval is reconstructed from the two rounding bands, not from the rounded estimate alone.`, `The state avoids near-cancellation: the entire certified difference interval stays safely positive.`] });
}

function generateDiagnosis(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  const unit = 10;
  const n = seed - 1;
  const a = 200 + n * 11 + [4, 6][seed % 2]!;
  const b = 120 + n * 7 + [3, 7][(seed + 1) % 2]!;
  const ra = roundToUnit(a, unit), rb = roundToUnit(b, unit);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[15]) {
    const estimate = ra + rb;
    const exact = a + b;
    const cls = estimate > exact ? "Overestimate" : estimate < exact ? "Underestimate" : "Exact after rounding";
    return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the nearest ten first, then evaluate. For ${a} + ${b}, classify the approved estimate relative to the exact sum.`, answer: cls, options: makeOptions(cls, seed, [wrong("Overestimate", "OVER_CLASS", "This classification is only correct if the rounded transformed sum exceeds the exact sum."), wrong("Underestimate", "UNDER_CLASS", "This classification is only correct if the rounded transformed sum is below the exact sum."), wrong("Exact after rounding", "EXACT_CLASS", "This requires the rounding changes to cancel exactly, which they do not in this state."), wrong("Cannot be determined", "NO_COMPARISON", "Both the exact sum and declared estimate are fully determined by the displayed numbers.")]), data: Object.freeze({ a, b, ra, rb, estimate, exact, classification: cls }), coreConcept: "Overestimate/underestimate is decided by comparing the fully evaluated transformed estimate with the exact oracle. Individual terms may round in different directions, so the class must be determined from the net effect rather than guessed term by term.", steps: [`Declared estimate: ${ra} + ${rb} = ${estimate}.`, `Exact sum: ${a} + ${b} = ${exact}; therefore the estimate is an ${cls.toLowerCase()}.`], verification: [`Net estimation error = ${estimate - exact}.`, `Its sign independently determines the stated class.`] });
  }
  const actual = ra + rb;
  const wrongA = ra + (a % 10 >= 5 ? -10 : 10);
  const wrongEstimate = wrongA + rb;
  const answer = `The first term was rounded in the wrong direction; the approved estimate is ${actual}`;
  return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the nearest ten first, then evaluate. A student estimates ${a} + ${b} by using ${wrongA} + ${rb} = ${wrongEstimate}. Which diagnosis is correct?`, answer, options: makeOptions(answer, seed, [wrong(`The method is valid; ${wrongEstimate} is the approved estimate`, "WRONG_ROUTE_ACCEPTED", "The first displayed benchmark is not the nearest ten for the original first term."), wrong(`Only the addition is wrong; the correct estimate is ${wrongEstimate}`, "ARITHMETIC_BLAMED", "The addition of the student's rounded terms is internally consistent; the defect occurs earlier in the rounding direction."), wrong(`Both terms should instead be rounded upward`, "FORCED_UPWARD", "The policy is nearest-place rounding, not always-round-up estimation.")]), data: Object.freeze({ a, b, ra, rb, wrongA, wrongEstimate, actual }), coreConcept: "A terms-first approximation chain can be invalid even when the final arithmetic is correct. Diagnose the first transformation that violates the declared rounding rule, then recompute the estimate from the approved rounded terms.", steps: [`${a} should round to ${ra}, not ${wrongA}; ${b} correctly rounds to ${rb}.`, `Approved estimate = ${ra} + ${rb} = ${actual}.`], verification: [`The student's displayed addition ${wrongA} + ${rb} = ${wrongEstimate} is arithmetically correct.`, `Therefore the error is specifically the first term's rounding direction.`] });
}

function generateComparison(seed: number): SapCp008Package {
  const prototypeId = SAP_CP008_PROTOTYPE_IDS[16];
  const n = seed - 1;
  const a = 240 + n * 13 + ((seed * 7) % 19), b = 110 + n * 9 + ((seed * 5) % 17);
  const c = 210 + n * 11 + ((seed * 3) % 23), d = 130 + n * 7 + ((seed * 11) % 19);
  const ea = roundToUnit(a, 10) + roundToUnit(b, 10);
  const eb = roundToUnit(c, 10) + roundToUnit(d, 10);
  const relation = ea < eb ? "A < B" : ea > eb ? "A > B" : "A = B";
  return buildPackage(prototypeId, seed, { stem: `Round each indicated term to the nearest ten first, then evaluate. Let A estimate ${a} + ${b} and B estimate ${c} + ${d}. Which relation is correct?`, answer: relation, options: makeOptions(relation, seed, [wrong("A < B", "REL_LT", "This relation disagrees with the two transformed additive estimates."), wrong("A = B", "REL_EQ", "This assumes equality without evaluating both rounded sums."), wrong("A > B", "REL_GT", "This reverses the ordering of the transformed estimates."), wrong("Cannot be determined", "REL_UNKNOWN", "The declared policy determines both estimates exactly.")]), data: Object.freeze({ a, b, c, d, estimateA: ea, estimateB: eb, relation }), coreConcept: "Comparison of additive estimates requires applying the same declared policy to both expressions before comparing their transformed values. Comparing the raw exact sums instead would answer a different question.", steps: [`A = ${roundToUnit(a, 10)} + ${roundToUnit(b, 10)} = ${ea}.`, `B = ${roundToUnit(c, 10)} + ${roundToUnit(d, 10)} = ${eb}; hence ${relation}.`], verification: [`Both expressions use the same nearest-ten terms-first rule.`, `Direct integer comparison of ${ea} and ${eb} reproduces ${relation}.`] });
}

export function generateSapCp008(prototypeId: SapCp008PrototypeId, seed: number): SapCp008Package {
  if (!Number.isInteger(seed) || seed < 1) throw new Error("Seed must be a positive integer.");
  if ([0, 1, 2, 3].includes(SAP_CP008_PROTOTYPE_IDS.indexOf(prototypeId))) return generateDirect(prototypeId, seed);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[4] || prototypeId === SAP_CP008_PROTOTYPE_IDS[5]) return generateDecimal(prototypeId, seed);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[6]) return generateCompatible(seed);
  if ([7, 8, 9].includes(SAP_CP008_PROTOTYPE_IDS.indexOf(prototypeId))) return generateMixed(prototypeId, seed);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[10] || prototypeId === SAP_CP008_PROTOTYPE_IDS[11]) return generateInverse(prototypeId, seed);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[12]) return generateNearest(seed);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[13] || prototypeId === SAP_CP008_PROTOTYPE_IDS[14]) return generateBounds(prototypeId, seed);
  if (prototypeId === SAP_CP008_PROTOTYPE_IDS[15] || prototypeId === SAP_CP008_PROTOTYPE_IDS[17]) return generateDiagnosis(prototypeId, seed);
  return generateComparison(seed);
}

export function generateSapCp008Sweep(seedsPerMode = 100): readonly SapCp008Package[] {
  if (!Number.isInteger(seedsPerMode) || seedsPerMode < 1) throw new Error("seedsPerMode must be positive.");
  return Object.freeze(SAP_CP008_PROTOTYPE_IDS.flatMap((prototypeId) => Array.from({ length: seedsPerMode }, (_, index) => generateSapCp008(prototypeId, index + 1))));
}

export const SAP_CP008_INTERNAL = Object.freeze({ roundToUnit, formatScaled });
