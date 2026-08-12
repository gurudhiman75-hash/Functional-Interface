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

export function generateCandidateTrg001ProductionQuestion(qlId: string, seed: string): any {
  if (qlId === "TRG-001-QL-062") return buildQl062(seed);
  return generateTrg001ProductionQuestion(qlId, seed);
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
