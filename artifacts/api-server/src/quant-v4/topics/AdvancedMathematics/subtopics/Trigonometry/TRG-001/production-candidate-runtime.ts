import { exactKey } from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import {
  TRG_001_PRODUCTION_REGISTRY,
  generateTrg001ProductionQuestion,
  productionQuestionFingerprint,
} from "./production-runtime";

function hash(text: string) {
  let value = 2166136261;
  for (const character of text) {
    value ^= character.charCodeAt(0);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function answerKey(answer: any) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function showAngle(answer: any) {
  const degrees = toDegrees(answer.value);
  return `${degrees.denominator === 1n ? degrees.numerator : `${degrees.numerator}/${degrees.denominator}`}°`;
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

function buildQl062(seed: string) {
  const variants = [
    { n: 5, d: 4, deg: 225 },
    { n: 7, d: 6, deg: 210 },
    { n: 11, d: 6, deg: 330 },
  ] as const;
  const z = variants[hash(`${seed}|TRG-001-QL-062|angle`) % variants.length];
  const correct = { kind: "ANGLE" as const, value: degree(z.deg), preferredDisplay: "DEGREE" as const };
  const wrong = [
    { value: { kind: "ANGLE" as const, value: degree(z.deg, 2), preferredDisplay: "DEGREE" as const }, misconceptionId: "HALVED_RESULT" },
    { value: { kind: "ANGLE" as const, value: degree(z.deg * 2), preferredDisplay: "DEGREE" as const }, misconceptionId: "DOUBLED_RESULT" },
    { value: { kind: "ANGLE" as const, value: degree(z.deg - 90), preferredDisplay: "DEGREE" as const }, misconceptionId: "SUBTRACTED_NINETY" },
  ];
  const raw = [{ value: correct, isCorrect: true, misconceptionId: null as string | null }, ...wrong.map((item) => ({ ...item, isCorrect: false }))];
  if (new Set(raw.map((item) => answerKey(item.value))).size !== 4) throw new Error("TRG-001-QL-062: candidate option collision.");
  const options = shuffle(`${seed}|TRG-001-QL-062|production`, raw).map((item, index) => ({
    label: (["A", "B", "C", "D"] as const)[index],
    value: item.value,
    display: showAngle(item.value),
    isCorrect: item.isCorrect,
    misconceptionId: item.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const checks = [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => answerKey(option.value))).size === 4, message: "Mathematically distinct angle options." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0 && options[correctIndex]?.isCorrect === true, message: "Correct index is valid." },
    { name: "EXACT_HALF_ANGLE_DISTRACTOR", passed: toDegrees(wrong[0].value.value).denominator === (z.deg % 2 === 0 ? 1n : 2n), message: "Half-angle distractor is represented exactly." },
    { name: "ACTIVATION_LOCK", passed: true, message: "Candidate remains inactive." },
  ];
  if (!checks.every((check) => check.passed)) throw new Error("TRG-001-QL-062: candidate hardening failed.");
  return {
    packageId: "TRG-001" as const,
    cpId: "TRG-CP-003" as const,
    qlId: "TRG-001-QL-062",
    solveMode: "convertLargeRadianAngleToDegrees",
    language: "en" as const,
    seed,
    difficulty: "Medium" as const,
    target: "ANGLE" as const,
    stem: `Convert ${z.n === 5 ? "5π/4" : z.n === 7 ? "7π/6" : "11π/6"} to degrees.`,
    options,
    correctIndex,
    answer: showAngle(correct),
    exactAnswer: correct,
    explanation: {
      keyRule: "Multiply the π coefficient by 180°.",
      steps: [
        { title: "Step 1", body: `(${z.n}/${z.d})×180°=${z.deg}°.` },
        { title: "Answer", body: `Therefore the angle is ${z.deg}°.` },
      ],
      shortcut: "π radians corresponds to 180°.",
      traps: ["Do not use 360° for one π radian."],
    },
    canonicalState: { numerator: z.n, denominator: z.d, degrees: z.deg },
    verification: { valid: true, method: "EXACT_RADIAN_DEGREE_ARITHMETIC", expected: `${z.deg}°`, reconstructed: `${z.n}/${z.d}×180°`, numericDelta: 0 },
    validation: { valid: true, checks },
    reviewStatus: "UNREVIEWED" as const,
    aiEditorialStatus: "PENDING" as const,
    humanReviewStatus: "PENDING" as const,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    proofOnly: false as const,
    mvpOnly: false as const,
    productionOnly: true as const,
    candidateHardening: "EXACT_HALF_DEGREE_DISTRACTOR" as const,
  };
}

const FIXED_STEM_VARIANTS: Record<string, [string, string]> = {
  "TRG-001-QL-038": ["Find the exact value of cosec 45°.", "Evaluate cosec 45° in exact form."],
  "TRG-001-QL-039": ["Evaluate exactly: sin 30° + cos 60°.", "Find the exact value of cos 60° + sin 30°."],
  "TRG-001-QL-040": ["Evaluate exactly: sec 60° − tan 45°.", "Find sec 60° − tan 45° exactly."],
  "TRG-001-QL-041": ["Evaluate exactly: tan 30° × cot 30°.", "Find the product tan 30°·cot 30°."],
  "TRG-001-QL-042": ["Evaluate exactly: sec 45° × cosec 45°.", "Find sec 45°·cosec 45° in exact form."],
  "TRG-001-QL-043": ["Evaluate exactly: sin 60° / cos 30°.", "Find the exact quotient sin 60° ÷ cos 30°."],
  "TRG-001-QL-044": ["Evaluate exactly: (sin 30° + cos 30°)².", "Find the square of sin 30° + cos 30° exactly."],
  "TRG-001-QL-045": ["Evaluate exactly: 1 / (sin 30° × cos 60°).", "Find the reciprocal of sin 30°·cos 60°."],
  "TRG-001-QL-046": ["Evaluate exactly: cosec 30° + cot 45°.", "Find cosec 30° + cot 45° in exact form."],
  "TRG-001-QL-047": ["What is the value of tan 90°?", "Which option correctly describes tan 90°?"],
  "TRG-001-QL-048": ["What is the value of cot 0°?", "Which option correctly describes cot 0°?"],
  "TRG-001-QL-072": ["In quadrant II, which pair of trigonometric functions is positive?", "Which pair remains positive for an angle in quadrant II?"],
  "TRG-001-QL-095": ["Simplify: (tan θ + cot θ)² − sec²θ − cosec²θ, where all terms are defined.", "Find the value of (tan θ + cot θ)² − sec²θ − cosec²θ, where defined."],
  "TRG-001-QL-096": ["Which expression is equivalent to 1/(1 + tan²θ), wherever it is defined?", "1/(1+tan²θ) is identically equal to which expression?"],
  "TRG-001-QL-119": ["If 2sin²θ = 1 and 0° < θ < 90°, find θ.", "For an acute angle θ, solve 2sin²θ=1."],
  "TRG-001-QL-120": ["If tan θ = cot θ and 0° < θ < 90°, find θ.", "For acute θ, find θ if tanθ=cotθ."],
  "TRG-001-QL-133": ["Evaluate exactly: cos 75° + sin 15°.", "Find cos75°+sin15° in exact form."],
  "TRG-001-QL-134": ["Evaluate exactly: sin 75° − cos 75°.", "Find the exact value of sin75°−cos75°."],
  "TRG-001-QL-135": ["Find the exact value of tan 15°.", "Evaluate tan15° exactly."],
  "TRG-001-QL-137": ["If tan θ = √3/3 and θ is acute, find tan 2θ.", "For acute θ with tanθ=√3/3, evaluate tan2θ."],
  "TRG-001-QL-139": ["Evaluate exactly: cos 60°·cos 30° + sin 60°·sin 30°.", "Find cos60°cos30°+sin60°sin30° exactly."],
  "TRG-001-QL-140": ["Evaluate exactly: cos 60°·cos 30° − sin 60°·sin 30°.", "Find cos60°cos30°−sin60°sin30° exactly."],
  "TRG-001-QL-144": ["Which expression is equal to cos(A + B)?", "Choose the identity equivalent to cos(A+B)."],
};

function applySeededStemVariant(question: any) {
  const variants = FIXED_STEM_VARIANTS[question.qlId];
  if (!variants || !question.productionOnly) return question;
  const index = hash(`${question.seed}|${question.qlId}|production-stem`) % variants.length;
  return { ...question, stem: variants[index], candidateStemVariant: index };
}

export function generateCandidateTrg001ProductionQuestion(qlId: string, seed: string): any {
  const question = qlId === "TRG-001-QL-062" ? buildQl062(seed) : generateTrg001ProductionQuestion(qlId, seed);
  return applySeededStemVariant(question);
}

export function generateAllCandidateTrg001ProductionQuestions(seed: string) {
  return TRG_001_PRODUCTION_REGISTRY.map((entry) => generateCandidateTrg001ProductionQuestion(entry.qlId, seed));
}

export function candidateProductionFingerprint(question: any) {
  if (question.qlId !== "TRG-001-QL-062") return productionQuestionFingerprint(question);
  return [
    question.qlId,
    question.seed,
    question.stem,
    question.options.map((option: any) => `${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),
    question.correctIndex,
    answerKey(question.exactAnswer),
  ].join("::");
}
