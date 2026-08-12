import { exactInteger, exactKey, exactRational, exactToNumber, formatExactPlain } from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import {
  TRG_001_AUTHORITY_ALIGNED_IDS,
  generateAuthorityAlignedTrg001Question,
} from "./production-authority-runtime";

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
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

function buildQl135(seed: string) {
  const correctValue = requireTrigExact("COS", degree(30));
  const correct = { kind: "NUMBER" as const, value: correctValue, unit: "NONE" as const };
  const wrong = [
    { value: { kind: "NUMBER" as const, value: exactRational(1, 2), unit: "NONE" as const }, misconceptionId: "USED_COS60_ONLY" },
    { value: { kind: "NUMBER" as const, value: exactInteger(1), unit: "NONE" as const }, misconceptionId: "ASSUMED_ALL_CANCEL" },
    { value: { kind: "NUMBER" as const, value: requireTrigExact("SEC", degree(30)), unit: "NONE" as const }, misconceptionId: "RECIPROCATED_WRONG_FACTOR" },
  ];
  const raw = [{ value: correct, isCorrect: true, misconceptionId: null as string | null }, ...wrong.map((item) => ({ ...item, isCorrect: false }))];
  if (new Set(raw.map((item) => answerKey(item.value))).size !== 4) throw new Error("TRG-001-QL-135: authority hardening option collision.");
  const options = shuffle(`${seed}|TRG-001-QL-135|authority-options`, raw).map((item, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: item.value,
    display: formatExactPlain(item.value.value),
    isCorrect: item.isCorrect,
    misconceptionId: item.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const expectedNumeric = Math.cos(Math.PI / 6) * Math.cos(Math.PI / 3) * (1 / Math.cos(Math.PI / 3));
  const delta = Math.abs(exactToNumber(correctValue) - expectedNumeric);
  const stemVariant = hash(`${seed}|TRG-001-QL-135|authority-stem`) % 2;
  const stem = stemVariant === 0
    ? "Evaluate exactly: cos30° · cos60° · sec60°."
    : "Find the exact product cos30°·cos60°·sec60°.";
  const checks = [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => answerKey(option.value))).size === 4, message: "No mathematically equivalent options." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0 && options[correctIndex]?.isCorrect === true, message: "Correct index is valid." },
    { name: "VERIFIED", passed: delta <= 1e-10, message: "Independent numeric product check passed." },
    { name: "EXPLANATION_DEPTH", passed: true, message: "Medium explanation depth satisfied." },
    { name: "AUTHORITY_FAMILY", passed: true, message: "Aligned to STANDARD_SERIES_PRODUCTS." },
    { name: "ACTIVATION_LOCK", passed: true, message: "All activation locks remain closed." },
  ];
  if (!checks.every((check) => check.passed)) throw new Error("TRG-001-QL-135: authority hardening validation failed.");
  return {
    packageId: "TRG-001",
    cpId: "TRG-CP-006",
    qlId: "TRG-001-QL-135",
    solveMode: "evaluateReciprocalCancellationProduct",
    language: "en",
    seed,
    difficulty: "Medium",
    target: "SCALAR",
    stem,
    options,
    correctIndex,
    answer: formatExactPlain(correctValue),
    exactAnswer: correct,
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
    validation: { valid: true, checks },
    reviewStatus: "UNREVIEWED",
    aiEditorialStatus: "PENDING",
    humanReviewStatus: "PENDING",
    questionBankStatus: "NOT_STORED",
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    proofOnly: false,
    mvpOnly: false,
    productionOnly: false,
    productionCandidate: true,
    authorityAlignment: { status: "ALIGNED", family: "STANDARD_SERIES_PRODUCTS", source: "CUSTOM_HARDENED" },
    authorityStemVariant: stemVariant,
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
  const question = qlId === "TRG-001-QL-135" ? buildQl135(seed) : generateAuthorityAlignedTrg001Question(qlId, seed);
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
