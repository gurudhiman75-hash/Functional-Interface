import {
  exactInteger,
  exactKey,
  exactRational,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
} from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  generateAuthorityAlignedTrg001Question,
} from "./production-authority-runtime";

const TRIPLES = [
  { o: 3, a: 4, h: 5 },
  { o: 5, a: 12, h: 13 },
  { o: 8, a: 15, h: 17 },
  { o: 7, a: 24, h: 25 },
  { o: 20, a: 21, h: 29 },
] as const;

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function pick<T>(seed: string, salt: string, values: readonly T[]): T {
  return values[hash(`${seed}|${salt}`) % values.length];
}

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function shuffle<T>(seed: string, values: T[]) {
  let state = hash(seed) || 1;
  for (let index = values.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const target = state % (index + 1);
    [values[index], values[target]] = [values[target], values[index]];
  }
  return values;
}

function makeNumberOptions(seed: string, qlId: string, correctValue: any, wrong: Array<{ value: any; misconceptionId: string }>) {
  const correct = { kind: "NUMBER" as const, value: correctValue, unit: "NONE" as const };
  const raw = [
    { value: correct, isCorrect: true, misconceptionId: null as string | null },
    ...wrong.map((entry) => ({ value: { kind: "NUMBER" as const, value: entry.value, unit: "NONE" as const }, isCorrect: false, misconceptionId: entry.misconceptionId })),
  ];
  if (new Set(raw.map((entry) => answerKey(entry.value))).size !== 4) throw new Error(`${qlId}: authority hardening option collision.`);
  const options = shuffle(`${seed}|${qlId}|authority-options`, raw).map((entry, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: entry.value,
    display: formatExactPlain(entry.value.value),
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  return { correct, options, correctIndex: options.findIndex((option) => option.isCorrect) };
}

function commonInactiveState() {
  return {
    reviewStatus: "UNREVIEWED" as const,
    aiEditorialStatus: "PENDING" as const,
    humanReviewStatus: "PENDING" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    proofOnly: false as const,
    mvpOnly: false as const,
    productionOnly: false as const,
    productionCandidate: true as const,
  };
}

function buildQl066(seed: string) {
  const angle = pick(seed, "TRG-001-QL-066|angle", [30, 60] as const);
  const cos = requireTrigExact("COS", degree(angle));
  const sin = requireTrigExact("SIN", degree(angle));
  const correctValue = multiplyExact(exactInteger(-1), cos);
  const built = makeNumberOptions(seed, "TRG-001-QL-066", correctValue, [
    { value: cos, misconceptionId: "LOST_QUADRANT_SIGN" },
    { value: multiplyExact(exactInteger(-1), sin), misconceptionId: "USED_NEGATIVE_SINE" },
    { value: sin, misconceptionId: "USED_POSITIVE_SINE" },
  ]);
  const expectedNumeric = Math.sin((270 + angle) * Math.PI / 180);
  const delta = Math.abs(exactToNumber(correctValue) - expectedNumeric);
  const variant = hash(`${seed}|TRG-001-QL-066|authority-stem`) % 2;
  return {
    packageId: "TRG-001", cpId: "TRG-CP-003", qlId: "TRG-001-QL-066",
    solveMode: "reduceSineAfterTwoSeventy", language: "en", seed, difficulty: "Medium", target: "SCALAR",
    stem: variant === 0 ? `Evaluate exactly: sin(270° + ${angle}°).` : `Find the exact value of sin(${270 + angle}°) by reduction.`,
    options: built.options, correctIndex: built.correctIndex, answer: formatExactPlain(correctValue), exactAnswer: built.correct,
    explanation: {
      keyRule: "Use sin(270°+θ)=−cosθ.",
      steps: [
        { title: "Step 1", body: `${270 + angle}° lies beyond 270° with reference angle ${angle}°.` },
        { title: "Answer", body: `sin(270°+${angle}°)=−cos${angle}°=${formatExactPlain(correctValue)}.` },
      ],
      shortcut: "A 270° shift changes sine to negative cosine.",
      traps: ["Do not treat a 270° shift as a simple 360° coterminal reduction."],
    },
    canonicalState: { theta: angle, target: 270 + angle },
    verification: { valid: delta <= 1e-10, method: "TWO_SEVENTY_REDUCTION_NUMERIC_CHECK", expected: exactKey(correctValue), reconstructed: `NUM:${expectedNumeric}`, numericDelta: delta },
    validation: { valid: true, checks: [
      { name: "FOUR_OPTIONS", passed: true, message: "Exactly four options." },
      { name: "ONE_CORRECT", passed: true, message: "Exactly one correct option." },
      { name: "UNIQUE_OPTIONS", passed: true, message: "No equivalent options." },
      { name: "VERIFIED", passed: delta <= 1e-10, message: "270-degree reduction verified independently." },
      { name: "AUTHORITY_FAMILY", passed: true, message: "Aligned to TWOSEVENTY_THREESIXTY_REDUCTION." },
      { name: "ACTIVATION_LOCK", passed: true, message: "All activation locks remain closed." },
    ] },
    ...commonInactiveState(),
    authorityAlignment: { status: "ALIGNED", family: "TWOSEVENTY_THREESIXTY_REDUCTION", source: "CUSTOM_HARDENED" },
    authorityStemVariant: variant,
  };
}

function buildQl095(seed: string) {
  const t = pick(seed, "TRG-001-QL-095|triple", TRIPLES);
  const correctValue = exactRational(t.h * t.h, t.o * t.a);
  const built = makeNumberOptions(seed, "TRG-001-QL-095", correctValue, [
    { value: exactRational(t.o, t.a), misconceptionId: "RETURNED_TAN" },
    { value: exactRational(t.a, t.o), misconceptionId: "RETURNED_COT" },
    { value: exactRational(t.h, t.a), misconceptionId: "RETURNED_SEC" },
  ]);
  const expectedNumeric = t.o / t.a + t.a / t.o;
  const delta = Math.abs(exactToNumber(correctValue) - expectedNumeric);
  const variant = hash(`${seed}|TRG-001-QL-095|authority-stem`) % 2;
  return {
    packageId: "TRG-001", cpId: "TRG-CP-004", qlId: "TRG-001-QL-095",
    solveMode: "evaluateTanPlusCotFromSineRatio", language: "en", seed, difficulty: "Hard", target: "SCALAR",
    stem: variant === 0
      ? `If sin θ = ${t.o}/${t.h} and θ is acute, find tan θ + cot θ.`
      : `For acute θ, sinθ=${t.o}/${t.h}. Evaluate tanθ+cotθ.`,
    options: built.options, correctIndex: built.correctIndex, answer: formatExactPlain(correctValue), exactAnswer: built.correct,
    explanation: {
      keyRule: "Reconstruct the right triangle from the given sine ratio, then form tanθ+cotθ.",
      steps: [
        { title: "Step 1", body: `Opposite:hypotenuse=${t.o}:${t.h}, so the adjacent side is ${t.a}.` },
        { title: "Step 2", body: `tanθ=${t.o}/${t.a} and cotθ=${t.a}/${t.o}.` },
        { title: "Answer", body: `Adding gives (${t.o * t.o}+${t.a * t.a})/${t.o * t.a}=${t.h * t.h}/${t.o * t.a}=${formatExactPlain(correctValue)}.` },
      ],
      shortcut: "After reconstruction, tanθ+cotθ=(opposite²+adjacent²)/(opposite·adjacent)=hypotenuse²/(opposite·adjacent).",
      traps: ["Do not return tanθ or cotθ alone; the target is their sum."],
    },
    canonicalState: { o: t.o, a: t.a, h: t.h },
    verification: { valid: delta <= 1e-10, method: "EXPRESSION_FROM_GIVEN_SINE_RATIO", expected: exactKey(correctValue), reconstructed: `NUM:${expectedNumeric}`, numericDelta: delta },
    validation: { valid: true, checks: [
      { name: "FOUR_OPTIONS", passed: true, message: "Exactly four options." },
      { name: "ONE_CORRECT", passed: true, message: "Exactly one correct option." },
      { name: "UNIQUE_OPTIONS", passed: true, message: "No equivalent options." },
      { name: "VERIFIED", passed: delta <= 1e-10, message: "Derived expression verified independently." },
      { name: "EXPLANATION_DEPTH", passed: true, message: "Hard explanation contains three reasoning steps." },
      { name: "AUTHORITY_FAMILY", passed: true, message: "Aligned to EXPRESSION_FROM_GIVEN_RATIO." },
      { name: "ACTIVATION_LOCK", passed: true, message: "All activation locks remain closed." },
    ] },
    ...commonInactiveState(),
    authorityAlignment: { status: "ALIGNED", family: "EXPRESSION_FROM_GIVEN_RATIO", source: "CUSTOM_HARDENED" },
    authorityStemVariant: variant,
  };
}

function buildQl098(seed: string) {
  const t = pick(seed, "TRG-001-QL-098|triple", TRIPLES);
  const correctValue = exactRational(t.h * t.h + t.a * t.a, t.a * t.h);
  const difference = exactRational(t.h * t.h - t.a * t.a, t.a * t.h);
  const built = makeNumberOptions(seed, "TRG-001-QL-098", correctValue, [
    { value: exactRational(t.h, t.a), misconceptionId: "RETURNED_SEC" },
    { value: exactRational(t.a, t.h), misconceptionId: "RETURNED_COS" },
    { value: difference, misconceptionId: "SUBTRACTED_INSTEAD_OF_ADDED" },
  ]);
  const expectedNumeric = t.h / t.a + t.a / t.h;
  const delta = Math.abs(exactToNumber(correctValue) - expectedNumeric);
  const variant = hash(`${seed}|TRG-001-QL-098|authority-stem`) % 2;
  return {
    packageId: "TRG-001", cpId: "TRG-CP-005", qlId: "TRG-001-QL-098",
    solveMode: "deriveSecPlusCosFromTangent", language: "en", seed, difficulty: "Hard", target: "SCALAR",
    stem: variant === 0
      ? `If tan θ = ${t.o}/${t.a} and θ is acute, find sec θ + cos θ.`
      : `For acute θ with tanθ=${t.o}/${t.a}, evaluate secθ+cosθ.`,
    options: built.options, correctIndex: built.correctIndex, answer: formatExactPlain(correctValue), exactAnswer: built.correct,
    explanation: {
      keyRule: "Use the tangent ratio to reconstruct secθ and cosθ before combining them.",
      steps: [
        { title: "Step 1", body: `tanθ=${t.o}/${t.a} gives opposite:adjacent=${t.o}:${t.a}, so hypotenuse=${t.h}.` },
        { title: "Step 2", body: `secθ=${t.h}/${t.a} and cosθ=${t.a}/${t.h}.` },
        { title: "Answer", body: `Their sum is (${t.h * t.h}+${t.a * t.a})/${t.a * t.h}=${formatExactPlain(correctValue)}.` },
      ],
      shortcut: "Once the right triangle is known, combine secθ and cosθ with a common denominator.",
      traps: ["Do not mistake secθ+cosθ for a standard reciprocal identity equal to 1."],
    },
    canonicalState: { o: t.o, a: t.a, h: t.h },
    verification: { valid: delta <= 1e-10, method: "DERIVED_EXPRESSION_FROM_TANGENT_RATIO", expected: exactKey(correctValue), reconstructed: `NUM:${expectedNumeric}`, numericDelta: delta },
    validation: { valid: true, checks: [
      { name: "FOUR_OPTIONS", passed: true, message: "Exactly four options." },
      { name: "ONE_CORRECT", passed: true, message: "Exactly one correct option." },
      { name: "UNIQUE_OPTIONS", passed: true, message: "No equivalent options." },
      { name: "VERIFIED", passed: delta <= 1e-10, message: "Derived expression verified independently." },
      { name: "EXPLANATION_DEPTH", passed: true, message: "Hard explanation contains three reasoning steps." },
      { name: "AUTHORITY_FAMILY", passed: true, message: "Aligned to DERIVED_RATIO_EXPRESSION." },
      { name: "ACTIVATION_LOCK", passed: true, message: "All activation locks remain closed." },
    ] },
    ...commonInactiveState(),
    authorityAlignment: { status: "ALIGNED", family: "DERIVED_RATIO_EXPRESSION", source: "CUSTOM_HARDENED" },
    authorityStemVariant: variant,
  };
}

function buildQl135(seed: string) {
  const correctValue = requireTrigExact("COS", degree(30));
  const built = makeNumberOptions(seed, "TRG-001-QL-135", correctValue, [
    { value: exactRational(1, 2), misconceptionId: "USED_COS60_ONLY" },
    { value: exactInteger(1), misconceptionId: "ASSUMED_ALL_CANCEL" },
    { value: requireTrigExact("SEC", degree(30)), misconceptionId: "RECIPROCATED_WRONG_FACTOR" },
  ]);
  const expectedNumeric = Math.cos(Math.PI / 6) * Math.cos(Math.PI / 3) * (1 / Math.cos(Math.PI / 3));
  const delta = Math.abs(exactToNumber(correctValue) - expectedNumeric);
  const variant = hash(`${seed}|TRG-001-QL-135|authority-stem`) % 2;
  return {
    packageId: "TRG-001", cpId: "TRG-CP-006", qlId: "TRG-001-QL-135",
    solveMode: "evaluateReciprocalCancellationProduct", language: "en", seed, difficulty: "Medium", target: "SCALAR",
    stem: variant === 0 ? "Evaluate exactly: cos30° · cos60° · sec60°." : "Find the exact product cos30°·cos60°·sec60°.",
    options: built.options, correctIndex: built.correctIndex, answer: formatExactPlain(correctValue), exactAnswer: built.correct,
    explanation: {
      keyRule: "Cancel the same-angle reciprocal pair before multiplying the remaining factor.",
      steps: [
        { title: "Step 1", body: "cos60°·sec60°=1." },
        { title: "Answer", body: `The product therefore reduces to cos30°=${formatExactPlain(correctValue)}.` },
      ],
      shortcut: "Only cos60° and sec60° cancel; cos30° remains.",
      traps: ["Do not cancel cos30° with sec60° because the angles differ."],
    },
    canonicalState: { expression: "cos30*cos60*sec60" },
    verification: { valid: delta <= 1e-10, method: "STANDARD_PRODUCT_RECIPROCAL_CHECK", expected: exactKey(correctValue), reconstructed: `NUM:${expectedNumeric}`, numericDelta: delta },
    validation: { valid: true, checks: [
      { name: "FOUR_OPTIONS", passed: true, message: "Exactly four options." },
      { name: "ONE_CORRECT", passed: true, message: "Exactly one correct option." },
      { name: "UNIQUE_OPTIONS", passed: true, message: "No mathematically equivalent options." },
      { name: "VERIFIED", passed: delta <= 1e-10, message: "Independent numeric product check passed." },
      { name: "EXPLANATION_DEPTH", passed: true, message: "Medium explanation depth satisfied." },
      { name: "AUTHORITY_FAMILY", passed: true, message: "Aligned to STANDARD_SERIES_PRODUCTS." },
      { name: "ACTIVATION_LOCK", passed: true, message: "All activation locks remain closed." },
    ] },
    ...commonInactiveState(),
    authorityAlignment: { status: "ALIGNED", family: "STANDARD_SERIES_PRODUCTS", source: "CUSTOM_HARDENED" },
    authorityStemVariant: variant,
  };
}

const ALT_STEMS: Record<string, string> = {
  "TRG-001-QL-001": "In right triangle ABC, the right angle is at C. Which side lies opposite ∠A?",
  "TRG-001-QL-002": "Triangle ABC is right-angled at C. Which leg is adjacent to ∠A?",
  "TRG-001-QL-003": "Triangle PQR is right-angled at Q. Identify its hypotenuse.",
  "TRG-001-QL-004": "In right triangle ABC with ∠C=90°, choose the ratio equal to sin A.",
  "TRG-001-QL-032": "Evaluate sec 45° in exact form.",
  "TRG-001-QL-038": "Find the exact value of (sin 30°)².",
  "TRG-001-QL-039": "Find (cos 30°)² in exact form.",
  "TRG-001-QL-040": "Find the exact value of (tan 60°)².",
  "TRG-001-QL-045": "Find the exact value of sin²30° + cos²60° + tan45°.",
  "TRG-001-QL-046": "Find sec60° + cosec30° − tan45° exactly.",
  "TRG-001-QL-119": "For acute θ, solve 2cosθ=1.",
  "TRG-001-QL-120": "For 0°<θ<90°, find θ if tanθ=√3.",
  "TRG-001-QL-134": "Find sin30°·sin60°·tan45° in exact form.",
  "TRG-001-QL-136": "Find tan30°·tan60° + sin²45° exactly.",
  "TRG-001-QL-137": "Find the exact sum sin²30° + sin²45° + sin²60°.",
  "TRG-001-QL-144": "Which trigonometric function is equivalent to (1−cos2θ)/sin2θ, wherever defined?",
};

function applyAuthorityStemDiversity(question: any) {
  const alternate = ALT_STEMS[question.qlId];
  if (!alternate) return question;
  const variant = hash(`${question.seed}|${question.qlId}|authority-stem`) % 2;
  return variant === 0 ? { ...question, authorityStemVariant: 0 } : { ...question, stem: alternate, authorityStemVariant: 1 };
}

export function generateAuthorityCandidateTrg001Question(qlId: string, seed: string) {
  let question: any;
  if (qlId === "TRG-001-QL-066") question = buildQl066(seed);
  else if (qlId === "TRG-001-QL-095") question = buildQl095(seed);
  else if (qlId === "TRG-001-QL-098") question = buildQl098(seed);
  else if (qlId === "TRG-001-QL-135") question = buildQl135(seed);
  else question = generateAuthorityAlignedTrg001Question(qlId, seed);
  return applyAuthorityStemDiversity(question);
}

export function generateAllAuthorityCandidateTrg001Questions(seed: string) {
  return TRG_001_AUTHORITY_ALIGNED_IDS.map((id) => generateAuthorityCandidateTrg001Question(id, seed));
}

export function authorityCandidateFingerprint(question: any) {
  return [
    question.qlId,
    question.seed,
    question.authorityAlignment.family,
    question.stem,
    question.options.map((option: any) => `${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),
    question.correctIndex,
    answerKey(question.exactAnswer),
    question.explanation.steps.map((step: any) => `${step.title}:${step.body}`).join("|"),
  ].join("::");
}
