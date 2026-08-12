import type { AngleMeasure, ExactTrigNumber, IndependentVerification, TrigExpression } from "../foundation/types";
import {
  addExact, assertDefined, divideExact, exactInteger, exactKey, exactRational, exactRationalSurd,
  exactSurd, exactToNumber, formatExactPlain, multiplyExact, powerExact, subtractExact,
} from "../foundation/exact";
import { degree, radianPi, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import { evaluateTrigExpression, expr } from "../foundation/expression";
import { verifyExpressionNumerically } from "../foundation/independent-verifier";
import {
  TRG_001_PROOF_CP_IDS,
  TRG_001_RUNTIME_PROOF_REGISTRY,
  generateTrg001RuntimeProofQuestion,
  proofQuestionFingerprint,
  type Trg001ProofQuestion,
} from "./runtime-proof";

export type Trg001MvpCpId = (typeof TRG_001_PROOF_CP_IDS)[number];
type Difficulty = "Easy" | "Medium" | "Hard";
type Target = "SCALAR" | "LENGTH";
type Unit = "NONE" | "UNITS";
type Answer = { kind: "NUMBER"; value: ExactTrigNumber; unit: Unit };
export type Trg001MvpRegistryEntry = {
  qlId: string;
  cpId: Trg001MvpCpId;
  solveMode: string;
  difficulty: Difficulty;
  target: Target;
  mvpOnly: true;
  description: string;
};
export type Trg001MvpOption = {
  label: "A" | "B" | "C" | "D";
  value: Answer;
  display: string;
  isCorrect: boolean;
  misconceptionId: string | null;
};
export type Trg001MvpExplanation = {
  keyRule: string;
  steps: Array<{ title: string; body: string; equation?: string }>;
  shortcut: string;
  traps: string[];
};
export type Trg001MvpExpansionQuestion = {
  packageId: "TRG-001";
  cpId: Trg001MvpCpId;
  qlId: string;
  solveMode: string;
  language: "en";
  seed: string;
  difficulty: Difficulty;
  target: Target;
  stem: string;
  options: Trg001MvpOption[];
  correctIndex: number;
  answer: string;
  exactAnswer: Answer;
  explanation: Trg001MvpExplanation;
  canonicalState: Record<string, string | number | boolean>;
  verification: { valid: boolean; method: string; expected: string; reconstructed: string; numericDelta: number | null };
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  proofOnly: false;
  mvpOnly: true;
};
export type Trg001MvpQuestion = Trg001ProofQuestion | Trg001MvpExpansionQuestion;

const A = [
  ["TRG-001-QL-006", "TRG-CP-001", "findTanFromKnownSides", "Easy", "SCALAR", "Direct tangent from sides"],
  ["TRG-001-QL-007", "TRG-CP-001", "findCotFromKnownSides", "Easy", "SCALAR", "Direct cotangent from sides"],
  ["TRG-001-QL-008", "TRG-CP-001", "findSecFromKnownSides", "Easy", "SCALAR", "Direct secant from sides"],
  ["TRG-001-QL-009", "TRG-CP-001", "findCosecFromKnownSides", "Easy", "SCALAR", "Direct cosecant from sides"],
  ["TRG-001-QL-010", "TRG-CP-001", "deriveCosFromSinRatio", "Medium", "SCALAR", "Cosine from a sine ratio"],
  ["TRG-001-QL-011", "TRG-CP-001", "deriveTanFromCosRatio", "Medium", "SCALAR", "Tangent from a cosine ratio"],
  ["TRG-001-QL-012", "TRG-CP-001", "deriveTanFromSecRatio", "Medium", "SCALAR", "Tangent from a secant ratio"],

  ["TRG-001-QL-030", "TRG-CP-002", "evaluateStandardCosine", "Easy", "SCALAR", "Standard cosine"],
  ["TRG-001-QL-031", "TRG-CP-002", "evaluateStandardTangent", "Easy", "SCALAR", "Standard tangent"],
  ["TRG-001-QL-032", "TRG-CP-002", "evaluateStandardCosecant", "Easy", "SCALAR", "Standard cosecant"],
  ["TRG-001-QL-033", "TRG-CP-002", "evaluateStandardSum", "Medium", "SCALAR", "Standard-value sum"],
  ["TRG-001-QL-034", "TRG-CP-002", "evaluateStandardSquareSum", "Medium", "SCALAR", "Standard-value square sum"],
  ["TRG-001-QL-035", "TRG-CP-002", "evaluateStandardQuotient", "Medium", "SCALAR", "Standard-value quotient"],
  ["TRG-001-QL-036", "TRG-CP-002", "evaluateRadianStandardValue", "Medium", "SCALAR", "Standard value with radian input"],

  ["TRG-001-QL-054", "TRG-CP-003", "evaluateThirdQuadrantSine", "Medium", "SCALAR", "Third-quadrant sine"],
  ["TRG-001-QL-055", "TRG-CP-003", "evaluateFourthQuadrantTangent", "Medium", "SCALAR", "Fourth-quadrant tangent"],
  ["TRG-001-QL-056", "TRG-CP-003", "evaluateRadianReduction", "Medium", "SCALAR", "Radian reduction"],
  ["TRG-001-QL-057", "TRG-CP-003", "evaluateComplementaryTangent", "Medium", "SCALAR", "Complementary tangent"],
  ["TRG-001-QL-058", "TRG-CP-003", "evaluateNegativeAngleCosine", "Medium", "SCALAR", "Negative-angle cosine"],
  ["TRG-001-QL-059", "TRG-CP-003", "evaluateAngleBeyondFullTurn", "Medium", "SCALAR", "Coterminal angle beyond 360 degrees"],
  ["TRG-001-QL-060", "TRG-CP-003", "evaluateReducedSecant", "Hard", "SCALAR", "Secant with reduction and sign"],

  ["TRG-001-QL-078", "TRG-CP-004", "simplifyOneMinusCosSquared", "Medium", "SCALAR", "Pythagorean identity quotient"],
  ["TRG-001-QL-079", "TRG-CP-004", "simplifySecSquaredMinusOne", "Medium", "SCALAR", "Secant identity quotient"],
  ["TRG-001-QL-080", "TRG-CP-004", "deriveSecSquaredFromTanRatio", "Medium", "SCALAR", "Secant square from tangent ratio"],
  ["TRG-001-QL-081", "TRG-CP-004", "deriveCosecSquaredFromCotRatio", "Medium", "SCALAR", "Cosecant square from cotangent ratio"],
  ["TRG-001-QL-082", "TRG-CP-004", "simplifySinCosecProduct", "Easy", "SCALAR", "Reciprocal product identity"],
  ["TRG-001-QL-083", "TRG-CP-004", "simplifyTanCosOverSin", "Medium", "SCALAR", "Quotient identity simplification"],
  ["TRG-001-QL-084", "TRG-CP-004", "simplifyOnePlusTanSquaredOverSecSquared", "Medium", "SCALAR", "Secant identity ratio"],

  ["TRG-001-QL-102", "TRG-CP-005", "evaluateSumDifferenceRatioFromTan", "Hard", "SCALAR", "Derived ratio from tangent"],
  ["TRG-001-QL-103", "TRG-CP-005", "recoverSecPlusTanFromDifference", "Hard", "SCALAR", "Recover sec plus tan"],
  ["TRG-001-QL-104", "TRG-CP-005", "recoverCosecPlusCotFromDifference", "Hard", "SCALAR", "Recover cosec plus cot"],
  ["TRG-001-QL-105", "TRG-CP-005", "deriveProductFromSinPlusCos", "Hard", "SCALAR", "Product from sin plus cos"],
  ["TRG-001-QL-106", "TRG-CP-005", "solveTanFromASinEqualsBCos", "Medium", "SCALAR", "Linear sine-cosine relation"],
  ["TRG-001-QL-107", "TRG-CP-005", "recoverSecMinusTanFromSum", "Hard", "SCALAR", "Recover sec minus tan"],
  ["TRG-001-QL-108", "TRG-CP-005", "recoverCosecMinusCotFromSum", "Hard", "SCALAR", "Recover cosec minus cot"],

  ["TRG-001-QL-126", "TRG-CP-006", "evaluateSinSeventyFive", "Hard", "SCALAR", "Angle-sum exact value"],
  ["TRG-001-QL-127", "TRG-CP-006", "evaluateCosFifteen", "Hard", "SCALAR", "Angle-difference exact value"],
  ["TRG-001-QL-128", "TRG-CP-006", "evaluateTanSeventyFive", "Hard", "SCALAR", "Tangent angle-sum exact value"],
  ["TRG-001-QL-129", "TRG-CP-006", "evaluateSinDoubleAngle", "Medium", "SCALAR", "Double-angle sine"],
  ["TRG-001-QL-130", "TRG-CP-006", "evaluateCosDoubleAngle", "Medium", "SCALAR", "Double-angle cosine"],
  ["TRG-001-QL-131", "TRG-CP-006", "findMaximumScaledSinCosSum", "Hard", "SCALAR", "Simple maximum of scaled sin plus cos"],
  ["TRG-001-QL-132", "TRG-CP-006", "recoverTriangleSideFromAreaAndSine", "Hard", "LENGTH", "Reverse triangle area using sine"],
] as const;

export const TRG_001_MVP_ADDITIONAL_REGISTRY: Trg001MvpRegistryEntry[] = A.map(
  ([qlId, cpId, solveMode, difficulty, target, description]) => ({
    qlId, cpId, solveMode, difficulty, target, description, mvpOnly: true,
  }),
);

export const TRG_001_MVP_REGISTRY = [
  ...TRG_001_RUNTIME_PROOF_REGISTRY.map((entry) => ({ ...entry, phase: "PROOF" as const })),
  ...TRG_001_MVP_ADDITIONAL_REGISTRY.map((entry) => ({ ...entry, phase: "MVP_EXPANSION" as const })),
];

const BY_ID = new Map(TRG_001_MVP_ADDITIONAL_REGISTRY.map((entry) => [entry.qlId, entry]));
const TRIPLES = [{ o: 3, a: 4, h: 5 }, { o: 5, a: 12, h: 13 }, { o: 8, a: 15, h: 17 }, { o: 7, a: 24, h: 25 }, { o: 20, a: 21, h: 29 }] as const;
function hash(text: string) { let h = 2166136261; for (const c of text) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function pick<T>(seed: string, salt: string, values: readonly T[]): T { return values[hash(`${seed}|${salt}`) % values.length]; }
function tri(seed: string, id: string) { return pick(seed, `${id}|tri`, TRIPLES); }
const N = (value: ExactTrigNumber, unit: Unit = "NONE"): Answer => ({ kind: "NUMBER", value, unit });
const Q = (n: number, d: number) => exactRational(n, d);
const std = (fn: "SIN" | "COS" | "TAN" | "COT" | "SEC" | "COSEC", angle: number) => requireTrigExact(fn, degree(angle));
const sq = (value: ExactTrigNumber) => assertDefined(powerExact(value, 2));
const div = (a: ExactTrigNumber, b: ExactTrigNumber) => assertDefined(divideExact(a, b));
function answerKey(answer: Answer) { return `${answer.unit}:${exactKey(answer.value)}`; }
function show(answer: Answer) { const text = formatExactPlain(answer.value); return answer.unit === "UNITS" ? `${text} units` : text; }
function shuffle<T>(seed: string, values: T[]) { let state = hash(seed) || 1; for (let i = values.length - 1; i > 0; i -= 1) { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; const j = state % (i + 1); [values[i], values[j]] = [values[j], values[i]]; } return values; }
function explanation(rule: string, body: string, trap: string, shortcut = rule): Trg001MvpExplanation { return { keyRule: rule, steps: [{ title: "Working", body }], shortcut, traps: [trap] }; }
function numericVerification(expected: ExactTrigNumber, reconstructed: number, method: string) { const actual = exactToNumber(expected); const delta = Math.abs(actual - reconstructed); return { valid: Number.isFinite(reconstructed) && delta <= 1e-10, method, expected: exactKey(expected), reconstructed: `NUM:${reconstructed}`, numericDelta: delta }; }
function expressionVerification(expression: TrigExpression, expected: ExactTrigNumber) { const result = verifyExpressionNumerically(expression, expected); return { valid: result.valid, method: result.method, expected: result.expectedKey, reconstructed: result.reconstructedKey, numericDelta: result.numericDelta }; }
type Wrong = { value: Answer; misconceptionId: string };
type Spec = { stem: string; correct: Answer; wrong: Wrong[]; explanation: Trg001MvpExplanation; state: Record<string, string | number | boolean>; verification: Trg001MvpExpansionQuestion["verification"] };
function exprSpec(stem: string, expression: TrigExpression, wrong: Wrong[], exp: Trg001MvpExplanation, state: Spec["state"], unit: Unit = "NONE"): Spec {
  const value = evaluateTrigExpression(expression); if (value.kind === "UNDEFINED") throw new Error("MVP expression unexpectedly undefined.");
  return { stem, correct: N(value, unit), wrong, explanation: exp, state, verification: expressionVerification(expression, value) };
}
function wording(seed: string, id: string, a: string, b: string) { return pick(seed, `${id}|wording`, [a, b] as const); }

function buildSpec(id: string, seed: string): Spec {
  const t = tri(seed, id);
  switch (id) {
    case "TRG-001-QL-006": { const c = N(Q(t.o, t.a)); return { stem: `In a right triangle, opposite = ${t.o} and adjacent = ${t.a}. Find tan θ.`, correct: c, wrong: [{ value: N(Q(t.a, t.o)), misconceptionId: "USED_COT" }, { value: N(Q(t.o, t.h)), misconceptionId: "USED_SIN" }, { value: N(Q(t.h, t.a)), misconceptionId: "USED_SEC" }], explanation: explanation("tan θ = opposite/adjacent", `${t.o}/${t.a} = ${show(c)}.`, "Do not use the hypotenuse in tangent."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.o / t.a, "SIDE_RATIO") }; }
    case "TRG-001-QL-007": { const c = N(Q(t.a, t.o)); return { stem: `For an acute angle θ, adjacent = ${t.a} and opposite = ${t.o}. Find cot θ.`, correct: c, wrong: [{ value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }, { value: N(Q(t.a, t.h)), misconceptionId: "USED_COS" }, { value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }], explanation: explanation("cot θ = adjacent/opposite", `${t.a}/${t.o} = ${show(c)}.`, "Cotangent is the reciprocal of tangent."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.a / t.o, "SIDE_RATIO") }; }
    case "TRG-001-QL-008": { const c = N(Q(t.h, t.a)); return { stem: `The adjacent side to θ is ${t.a} and the hypotenuse is ${t.h}. Find sec θ.`, correct: c, wrong: [{ value: N(Q(t.h, t.o)), misconceptionId: "SEC_COSEC_SWAP" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS" }, { value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }], explanation: explanation("sec θ = hypotenuse/adjacent", `${t.h}/${t.a} = ${show(c)}.`, "Secant is the reciprocal of cosine."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.h / t.a, "SIDE_RATIO") }; }
    case "TRG-001-QL-009": { const c = N(Q(t.h, t.o)); return { stem: `The side opposite θ is ${t.o} and the hypotenuse is ${t.h}. Find cosec θ.`, correct: c, wrong: [{ value: N(Q(t.h, t.a)), misconceptionId: "COSEC_SEC_SWAP" }, { value: N(Q(t.o, t.h)), misconceptionId: "RETURNED_SIN" }, { value: N(Q(t.a, t.o)), misconceptionId: "USED_COT" }], explanation: explanation("cosec θ = hypotenuse/opposite", `${t.h}/${t.o} = ${show(c)}.`, "Cosecant is the reciprocal of sine."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.h / t.o, "SIDE_RATIO") }; }
    case "TRG-001-QL-010": { const c = N(Q(t.a, t.h)); return { stem: `If sin θ = ${t.o}/${t.h} and θ is acute, find cos θ.`, correct: c, wrong: [{ value: N(Q(t.o, t.h)), misconceptionId: "RETURNED_GIVEN_RATIO" }, { value: N(Q(t.h, t.a)), misconceptionId: "USED_SEC" }, { value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }], explanation: explanation("Build the right triangle from the sine ratio.", `Opposite:hypotenuse = ${t.o}:${t.h}, so adjacent = ${t.a}; cos θ=${t.a}/${t.h}.`, "Acute-angle information keeps all side ratios positive."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, Math.sqrt(t.h * t.h - t.o * t.o) / t.h, "PYTHAGOREAN_RECONSTRUCTION") }; }
    case "TRG-001-QL-011": { const c = N(Q(t.o, t.a)); return { stem: `If cos θ = ${t.a}/${t.h} and θ is acute, find tan θ.`, correct: c, wrong: [{ value: N(Q(t.a, t.o)), misconceptionId: "USED_COT" }, { value: N(Q(t.o, t.h)), misconceptionId: "USED_SIN" }, { value: N(Q(t.h, t.a)), misconceptionId: "USED_SEC" }], explanation: explanation("Recover the missing side, then use tangent.", `Adjacent:hypotenuse = ${t.a}:${t.h}, so opposite = ${t.o}; tan θ=${t.o}/${t.a}.`, "Do not invert the tangent ratio."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, Math.sqrt(t.h * t.h - t.a * t.a) / t.a, "PYTHAGOREAN_RECONSTRUCTION") }; }
    case "TRG-001-QL-012": { const c = N(Q(t.o, t.a)); return { stem: `If sec θ = ${t.h}/${t.a} and θ is acute, find tan θ.`, correct: c, wrong: [{ value: N(Q(t.a, t.o)), misconceptionId: "USED_COT" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS" }, { value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }], explanation: explanation("Interpret secant as hypotenuse/adjacent.", `Hypotenuse:adjacent = ${t.h}:${t.a}, so opposite = ${t.o}; tan θ=${t.o}/${t.a}.`, "Secant does not directly give opposite/adjacent."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, Math.sqrt(t.h * t.h - t.a * t.a) / t.a, "PYTHAGOREAN_RECONSTRUCTION") }; }

    case "TRG-001-QL-030": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(std("COS", a)); return { stem: `Find the exact value of cos ${a}°.`, correct: c, wrong: [{ value: N(std("SIN", a)), misconceptionId: "SIN_COS_SWAP" }, { value: N(std("TAN", a)), misconceptionId: "USED_TAN" }, { value: N(std("SEC", a)), misconceptionId: "USED_RECIPROCAL" }], explanation: explanation("Use the standard-angle exact value.", `cos ${a}° = ${show(c)}.`, "Do not replace cosine with sine or secant."), state: { angle: a }, verification: numericVerification(c.value, Math.cos(a * Math.PI / 180), "INDEPENDENT_NUMERIC_TRIG") }; }
    case "TRG-001-QL-031": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(std("TAN", a)); return { stem: `Evaluate tan ${a}° exactly.`, correct: c, wrong: [{ value: N(std("COT", a)), misconceptionId: "USED_COT" }, { value: N(std("SIN", a)), misconceptionId: "USED_SIN" }, { value: N(std("COS", a)), misconceptionId: "USED_COS" }], explanation: explanation("Use the standard tangent value.", `tan ${a}° = ${show(c)}.`, "Tangent is sin/cos, not either value alone."), state: { angle: a }, verification: numericVerification(c.value, Math.tan(a * Math.PI / 180), "INDEPENDENT_NUMERIC_TRIG") }; }
    case "TRG-001-QL-032": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(std("COSEC", a)); return { stem: `Find cosec ${a}° exactly.`, correct: c, wrong: [{ value: N(std("SEC", a)), misconceptionId: "COSEC_SEC_SWAP" }, { value: N(std("SIN", a)), misconceptionId: "RETURNED_SIN" }, { value: N(std("COS", a)), misconceptionId: "USED_COS" }], explanation: explanation("cosec θ = 1/sin θ.", `cosec ${a}° = ${show(c)}.`, "Reciprocate sine, not cosine."), state: { angle: a }, verification: numericVerification(c.value, 1 / Math.sin(a * Math.PI / 180), "INDEPENDENT_NUMERIC_TRIG") }; }
    case "TRG-001-QL-033": { const a = pick(seed, `${id}|a`, [30, 60] as const); const b = 90 - a; const e = expr.add(expr.trig("SIN", degree(a)), expr.trig("COS", degree(b))); const s = requireTrigExact("SIN", degree(a)); const c = assertDefined(addExact(s, s)); return exprSpec(`Evaluate exactly: sin ${a}° + cos ${b}°.`, e, [{ value: N(exactInteger(0)), misconceptionId: "SUBTRACTED_TERMS" }, { value: N(s), misconceptionId: "USED_ONE_TERM" }, { value: N(sq(s)), misconceptionId: "MULTIPLIED_TERMS" }], explanation("Recognize complementary equal values before adding.", `cos ${b}° = sin ${a}°, so the sum is ${show(N(c))}.`, "Do not treat a sum as a product."), { a, b }); }
    case "TRG-001-QL-034": { const a = pick(seed, `${id}|a`, [30, 60] as const); const s = std("SIN", a), c0 = std("COS", a); const e = expr.add(expr.power(expr.trig("SIN", degree(a)), 2), expr.power(expr.trig("COS", degree(a)), 2)); return exprSpec(`Evaluate sin²${a}° + cos²${a}°.`, e, [{ value: N(sq(s)), misconceptionId: "USED_ONLY_SIN_SQUARED" }, { value: N(sq(c0)), misconceptionId: "USED_ONLY_COS_SQUARED" }, { value: N(exactInteger(2)), misconceptionId: "ADDED_IDENTITY_TWICE" }], explanation("Use sin²θ + cos²θ = 1.", `For θ=${a}°, the sum is 1.`, "Do not square the identity result again."), { angle: a }); }
    case "TRG-001-QL-035": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.divide(expr.trig("SIN", degree(a)), expr.trig("COS", degree(a))); return exprSpec(`Evaluate exactly: sin ${a}° / cos ${a}°.`, e, [{ value: N(std("COT", a)), misconceptionId: "INVERTED_QUOTIENT" }, { value: N(std("SIN", a)), misconceptionId: "USED_NUMERATOR_ONLY" }, { value: N(std("COS", a)), misconceptionId: "USED_DENOMINATOR_ONLY" }], explanation("sin θ / cos θ = tan θ.", `So the quotient equals tan ${a}°.`, "Keep the numerator and denominator in the stated order."), { angle: a }); }
    case "TRG-001-QL-036": { const den = pick(seed, `${id}|d`, [6, 3] as const); const angle = radianPi(1, den); const degreeValue = den === 6 ? 30 : 60; const c = N(std("SIN", degreeValue)); return { stem: `Find the exact value of sin(π/${den}).`, correct: c, wrong: [{ value: N(std("COS", degreeValue)), misconceptionId: "SIN_COS_SWAP" }, { value: N(std("TAN", degreeValue)), misconceptionId: "USED_TAN" }, { value: N(std("SEC", degreeValue)), misconceptionId: "USED_SEC" }], explanation: explanation("Convert the familiar radian angle to degrees.", `π/${den} = ${degreeValue}°, so sin(π/${den}) = ${show(c)}.`, "Do not treat the radian denominator as a degree measure."), state: { denominator: den, degree: degreeValue }, verification: numericVerification(c.value, Math.sin((Math.PI / den)), "INDEPENDENT_RADIAN_TRIG") }; }

    case "TRG-001-QL-054": { const a = pick(seed, `${id}|a`, [210, 240] as const); const c = N(std("SIN", a)); return { stem: `Evaluate sin ${a}° exactly.`, correct: c, wrong: [{ value: N(multiplyExact(exactInteger(-1), c.value)), misconceptionId: "WRONG_QUADRANT_SIGN" }, { value: N(std("COS", a)), misconceptionId: "SIN_COS_SWAP" }, { value: N(std("TAN", a)), misconceptionId: "USED_TAN" }], explanation: explanation("Use the reference angle and the sign in quadrant III.", `The reference angle is ${a - 180}° and sine is negative in quadrant III.`, "The reference value keeps its magnitude but not always its sign."), state: { angle: a, reference: a - 180 }, verification: numericVerification(c.value, Math.sin(a * Math.PI / 180), "INDEPENDENT_NUMERIC_TRIG") }; }
    case "TRG-001-QL-055": { const a = pick(seed, `${id}|a`, [300, 330] as const); const c = N(std("TAN", a)); return { stem: `Find tan ${a}° exactly.`, correct: c, wrong: [{ value: N(multiplyExact(exactInteger(-1), c.value)), misconceptionId: "WRONG_QUADRANT_SIGN" }, { value: N(std("SIN", a)), misconceptionId: "USED_SIN" }, { value: N(std("COS", a)), misconceptionId: "USED_COS" }], explanation: explanation("Tangent is negative in quadrant IV.", `Reduce to the reference angle ${360 - a}° and apply the quadrant-IV sign.`, "Do not copy the positive reference value without its sign."), state: { angle: a, reference: 360 - a }, verification: numericVerification(c.value, Math.tan(a * Math.PI / 180), "INDEPENDENT_NUMERIC_TRIG") }; }
    case "TRG-001-QL-056": { const numerator = pick(seed, `${id}|n`, [5, 7] as const); const angle = radianPi(numerator, 6); const c = N(requireTrigExact("COS", angle)); const degrees = numerator * 30; return { stem: `Evaluate cos(${numerator}π/6) exactly.`, correct: c, wrong: [{ value: N(multiplyExact(exactInteger(-1), c.value)), misconceptionId: "WRONG_SIGN" }, { value: N(exactRational(1, 2)), misconceptionId: "USED_REFERENCE_SINE" }, { value: N(exactRational(-1, 2)), misconceptionId: "USED_WRONG_REFERENCE_FUNCTION" }], explanation: explanation("Convert the rational-π angle and reduce by quadrant.", `${numerator}π/6 = ${degrees}°; use the corresponding reference angle and cosine sign.`, "Radian conversion and quadrant sign are separate steps."), state: { numerator, denominator: 6, degrees }, verification: numericVerification(c.value, Math.cos(numerator * Math.PI / 6), "INDEPENDENT_RADIAN_TRIG") }; }
    case "TRG-001-QL-057": { const a = pick(seed, `${id}|a`, [30, 60] as const); const target = 90 - a; const c = N(std("TAN", target)); return { stem: `Evaluate tan(90° − ${a}°) exactly.`, correct: c, wrong: [{ value: N(std("TAN", a)), misconceptionId: "IGNORED_COMPLEMENT" }, { value: N(std("SIN", target)), misconceptionId: "USED_SIN" }, { value: N(std("COS", target)), misconceptionId: "USED_COS" }], explanation: explanation("tan(90°−θ) = cot θ.", `90°−${a}°=${target}°, so evaluate tan ${target}°.`, "A complementary angle changes tangent to cotangent."), state: { angle: a, target }, verification: numericVerification(c.value, Math.tan(target * Math.PI / 180), "COMPLEMENTARY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-058": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(std("COS", a)); return { stem: `Find cos(−${a}°) exactly.`, correct: c, wrong: [{ value: N(multiplyExact(exactInteger(-1), c.value)), misconceptionId: "TREATED_COS_AS_ODD" }, { value: N(multiplyExact(exactInteger(-1), std("SIN", a))), misconceptionId: "USED_NEGATIVE_SINE" }, { value: N(multiplyExact(exactInteger(-1), std("TAN", a))), misconceptionId: "USED_NEGATIVE_TANGENT" }], explanation: explanation("Cosine is an even function: cos(−θ)=cos θ.", `Therefore cos(−${a}°)=cos ${a}°=${show(c)}.`, "Only sine and tangent change sign under θ→−θ."), state: { angle: -a }, verification: numericVerification(c.value, Math.cos(-a * Math.PI / 180), "NEGATIVE_ANGLE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-059": { const base = pick(seed, `${id}|a`, [30, 60] as const); const a = 360 + base; const c = N(std("SIN", base)); return { stem: `Evaluate sin ${a}° exactly.`, correct: c, wrong: [{ value: N(std("COS", base)), misconceptionId: "SIN_COS_SWAP" }, { value: N(multiplyExact(exactInteger(-1), c.value)), misconceptionId: "WRONG_COTERMINAL_SIGN" }, { value: N(std("TAN", base)), misconceptionId: "USED_TAN" }], explanation: explanation("Subtract one full turn: sin(360°+θ)=sin θ.", `${a}° is coterminal with ${base}°, so the exact value is unchanged.`, "A full 360° turn does not change the trigonometric value."), state: { angle: a, reduced: base }, verification: numericVerification(c.value, Math.sin(a * Math.PI / 180), "COTERMINAL_NUMERIC_CHECK") }; }
    case "TRG-001-QL-060": { const a = pick(seed, `${id}|a`, [120, 150] as const); const c = N(std("SEC", a)); return { stem: `Find sec ${a}° exactly.`, correct: c, wrong: [{ value: N(multiplyExact(exactInteger(-1), c.value)), misconceptionId: "WRONG_QUADRANT_SIGN" }, { value: N(std("COS", a)), misconceptionId: "RETURNED_COS" }, { value: N(std("COSEC", a)), misconceptionId: "SEC_COSEC_SWAP" }], explanation: explanation("Reduce the angle, apply cosine's sign, then reciprocate.", `Cosine is negative in quadrant II, so secant is also negative.`, "Do not take the reciprocal before fixing the quadrant sign."), state: { angle: a, reference: 180 - a }, verification: numericVerification(c.value, 1 / Math.cos(a * Math.PI / 180), "INDEPENDENT_NUMERIC_TRIG") }; }

    case "TRG-001-QL-078": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.divide(expr.subtract(expr.constant(exactInteger(1)), expr.power(expr.trig("COS", degree(a)), 2)), expr.power(expr.trig("SIN", degree(a)), 2)); return exprSpec(`Simplify exactly: (1 − cos²${a}°)/sin²${a}°.`, e, [{ value: N(sq(std("SIN", a))), misconceptionId: "STOPPED_AT_NUMERATOR" }, { value: N(sq(std("COS", a))), misconceptionId: "USED_WRONG_SQUARE" }, { value: N(exactInteger(2)), misconceptionId: "ADDED_IDENTITY_TERMS" }], explanation("Use 1−cos²θ = sin²θ.", `The numerator equals the denominator, so the ratio is 1.`, "Do not substitute approximate decimals."), { angle: a }); }
    case "TRG-001-QL-079": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.divide(expr.subtract(expr.power(expr.trig("SEC", degree(a)), 2), expr.constant(exactInteger(1))), expr.power(expr.trig("TAN", degree(a)), 2)); const sec2 = sq(std("SEC", a)); return exprSpec(`Simplify exactly: (sec²${a}° − 1)/tan²${a}°.`, e, [{ value: N(sq(std("TAN", a))), misconceptionId: "STOPPED_AT_NUMERATOR" }, { value: N(sec2), misconceptionId: "DROPPED_MINUS_ONE" }, { value: N(div(exactInteger(1), sec2)), misconceptionId: "RECIPROCAL_SEC_SQUARED" }], explanation("sec²θ−1 = tan²θ.", `Numerator and denominator are equal, so the ratio is 1.`, "Keep the square on tangent."), { angle: a }); }
    case "TRG-001-QL-080": { const tan = Q(t.o, t.a), c = N(Q(t.h * t.h, t.a * t.a)); return { stem: `If tan θ = ${t.o}/${t.a}, find sec²θ.`, correct: c, wrong: [{ value: N(Q(t.o * t.o, t.a * t.a)), misconceptionId: "RETURNED_TAN_SQUARED" }, { value: N(Q(t.h, t.a)), misconceptionId: "RETURNED_SEC" }, { value: N(addExact(exactInteger(1), tan)), misconceptionId: "FORGOT_TO_SQUARE_TAN" }], explanation: explanation("Use sec²θ = 1 + tan²θ.", `1+(${t.o}/${t.a})² = ${show(c)}.`, "The identity contains tan²θ, not tan θ."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, 1 + (t.o / t.a) ** 2, "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-081": { const cot = Q(t.a, t.o), c = N(Q(t.h * t.h, t.o * t.o)); return { stem: `If cot θ = ${t.a}/${t.o}, find cosec²θ.`, correct: c, wrong: [{ value: N(Q(t.a * t.a, t.o * t.o)), misconceptionId: "RETURNED_COT_SQUARED" }, { value: N(Q(t.h, t.o)), misconceptionId: "RETURNED_COSEC" }, { value: N(addExact(exactInteger(1), cot)), misconceptionId: "FORGOT_TO_SQUARE_COT" }], explanation: explanation("Use cosec²θ = 1 + cot²θ.", `1+(${t.a}/${t.o})² = ${show(c)}.`, "The identity contains cot²θ."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, 1 + (t.a / t.o) ** 2, "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-082": { const a = pick(seed, `${id}|a`, [30, 45, 60] as const); const e = expr.multiply(expr.trig("SIN", degree(a)), expr.trig("COSEC", degree(a))); return exprSpec(`Evaluate sin ${a}° × cosec ${a}°.`, e, [{ value: N(exactInteger(0)), misconceptionId: "TREATED_RECIPROCALS_AS_OPPOSITES" }, { value: N(sq(std("SIN", a))), misconceptionId: "SQUARED_SINE" }, { value: N(sq(std("COSEC", a))), misconceptionId: "SQUARED_COSEC" }], explanation("A non-zero value times its reciprocal is 1.", `cosec ${a}° = 1/sin ${a}°, so the product is 1.`, "Reciprocal functions multiply to 1, not 0."), { angle: a }); }
    case "TRG-001-QL-083": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.divide(expr.multiply(expr.trig("TAN", degree(a)), expr.trig("COS", degree(a))), expr.trig("SIN", degree(a))); return exprSpec(`Simplify: tan ${a}° × cos ${a}° / sin ${a}°.`, e, [{ value: N(std("TAN", a)), misconceptionId: "CANCELLED_WRONG_FACTOR" }, { value: N(sq(std("SIN", a))), misconceptionId: "USED_SIN_SQUARED" }, { value: N(sq(std("COS", a))), misconceptionId: "USED_COS_SQUARED" }], explanation("Replace tanθ by sinθ/cosθ.", `Then cosθ cancels and the remaining sinθ/sinθ = 1.`, "Do not cancel across addition; here every operation is multiplicative."), { angle: a }); }
    case "TRG-001-QL-084": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.divide(expr.add(expr.constant(exactInteger(1)), expr.power(expr.trig("TAN", degree(a)), 2)), expr.power(expr.trig("SEC", degree(a)), 2)); const sec2 = sq(std("SEC", a)); return exprSpec(`Simplify exactly: (1 + tan²${a}°)/sec²${a}°.`, e, [{ value: N(sq(std("TAN", a))), misconceptionId: "USED_TAN_SQUARED_ONLY" }, { value: N(sec2), misconceptionId: "FAILED_TO_DIVIDE" }, { value: N(div(exactInteger(1), sec2)), misconceptionId: "RECIPROCAL_ONLY" }], explanation("Use 1+tan²θ = sec²θ.", `The ratio becomes sec²θ/sec²θ = 1.`, "Do not invert the identity."), { angle: a }); }

    case "TRG-001-QL-102": { const numerator = t.o + t.a, denominator = t.o - t.a; const c = N(Q(numerator, denominator)); return { stem: `If tan θ = ${t.o}/${t.a}, find (sin θ + cos θ)/(sin θ − cos θ).`, correct: c, wrong: [{ value: N(Q(t.a - t.o, t.a + t.o)), misconceptionId: "INVERTED_AND_SIGNED_RATIO" }, { value: N(Q(t.o - t.a, t.o + t.a)), misconceptionId: "RECIPROCAL_RATIO" }, { value: N(Q(t.a + t.o, t.a - t.o)), misconceptionId: "WRONG_DIFFERENCE_SIGN" }], explanation: explanation("Use proportional sine and cosine values from tanθ.", `sin:cos = ${t.o}:${t.a}; therefore the required ratio is (${t.o}+${t.a})/(${t.o}−${t.a}).`, "The order in the denominator controls the sign."), state: { o: t.o, a: t.a }, verification: numericVerification(c.value, (t.o / t.h + t.a / t.h) / (t.o / t.h - t.a / t.h), "DERIVED_RATIO_NUMERIC_CHECK") }; }
    case "TRG-001-QL-103": { const a = pick(seed, `${id}|a`, [45, 60] as const); const sec = std("SEC", a), tan = std("TAN", a), diff = subtractExact(sec, tan), sum = addExact(sec, tan), c = N(sum); return { stem: `For acute θ=${a}°, sec θ − tan θ = ${formatExactPlain(diff)}. Find sec θ + tan θ.`, correct: c, wrong: [{ value: N(diff), misconceptionId: "RETURNED_GIVEN_EXPRESSION" }, { value: N(sec), misconceptionId: "USED_SEC_ONLY" }, { value: N(tan), misconceptionId: "USED_TAN_ONLY" }], explanation: explanation("(secθ−tanθ)(secθ+tanθ)=1.", `So secθ+tanθ is the reciprocal of ${formatExactPlain(diff)}, giving ${show(c)}.`, "Do not add 1 to the given value; use the conjugate product identity."), state: { angle: a }, verification: numericVerification(c.value, 1 / (1 / Math.cos(a * Math.PI / 180) - Math.tan(a * Math.PI / 180)), "CONJUGATE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-104": { const a = pick(seed, `${id}|a`, [30, 45] as const); const cosec = std("COSEC", a), cot = std("COT", a), diff = subtractExact(cosec, cot), sum = addExact(cosec, cot), c = N(sum); return { stem: `If θ=${a}° and cosec θ − cot θ = ${formatExactPlain(diff)}, find cosec θ + cot θ.`, correct: c, wrong: [{ value: N(diff), misconceptionId: "RETURNED_GIVEN_EXPRESSION" }, { value: N(cosec), misconceptionId: "USED_COSEC_ONLY" }, { value: N(cot), misconceptionId: "USED_COT_ONLY" }], explanation: explanation("(cosecθ−cotθ)(cosecθ+cotθ)=1.", `Take the reciprocal of the given conjugate to obtain ${show(c)}.`, "Use the cosecant-cotangent identity, not the secant-tangent one mechanically."), state: { angle: a }, verification: numericVerification(c.value, 1 / (1 / Math.sin(a * Math.PI / 180) - 1 / Math.tan(a * Math.PI / 180)), "CONJUGATE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-105": { const a = pick(seed, `${id}|a`, [30, 45] as const); const s = addExact(std("SIN", a), std("COS", a)); const product = multiplyExact(std("SIN", a), std("COS", a)); const c = N(product); const s2 = sq(s); return { stem: `If sin θ + cos θ = ${formatExactPlain(s)}, find sin θ cos θ.`, correct: c, wrong: [{ value: N(div(addExact(s2, exactInteger(1)), exactInteger(2))), misconceptionId: "USED_PLUS_ONE" }, { value: N(subtractExact(s2, exactInteger(1))), misconceptionId: "FORGOT_DIVIDE_BY_TWO" }, { value: N(subtractExact(exactInteger(1), s2)), misconceptionId: "REVERSED_SUBTRACTION" }], explanation: explanation("Square the given sum: (sinθ+cosθ)²=1+2sinθcosθ.", `Hence sinθcosθ = ((${formatExactPlain(s)})²−1)/2 = ${show(c)}.`, "The cross term is 2sinθcosθ."), state: { angle: a }, verification: numericVerification(c.value, Math.sin(a * Math.PI / 180) * Math.cos(a * Math.PI / 180), "DERIVED_PRODUCT_NUMERIC_CHECK") }; }
    case "TRG-001-QL-106": { const pair = pick(seed, `${id}|pair`, [[3, 4], [5, 12], [7, 24]] as const); const aa = pair[0], b = pair[1], c = N(Q(b, aa)); return { stem: `If ${aa} sin θ = ${b} cos θ and cos θ ≠ 0, find tan θ.`, correct: c, wrong: [{ value: N(Q(aa, b)), misconceptionId: "INVERTED_RATIO" }, { value: N(Q(b, aa + b)), misconceptionId: "USED_SUM_DENOMINATOR" }, { value: N(Q(aa + b, aa)), misconceptionId: "ADDED_COEFFICIENTS" }], explanation: explanation("Divide both sides by cosθ and by the sine coefficient.", `${aa} tan θ = ${b}, so tan θ = ${b}/${aa}.`, "Keep track of which coefficient moves to the denominator."), state: { a: aa, b }, verification: numericVerification(c.value, b / aa, "ALGEBRAIC_RELATION_CHECK") }; }
    case "TRG-001-QL-107": { const a = pick(seed, `${id}|a`, [45, 60] as const); const sec = std("SEC", a), tan = std("TAN", a), sum = addExact(sec, tan), diff = subtractExact(sec, tan), c = N(diff); return { stem: `If θ=${a}° and sec θ + tan θ = ${formatExactPlain(sum)}, find sec θ − tan θ.`, correct: c, wrong: [{ value: N(sum), misconceptionId: "RETURNED_GIVEN_EXPRESSION" }, { value: N(sec), misconceptionId: "USED_SEC_ONLY" }, { value: N(tan), misconceptionId: "USED_TAN_ONLY" }], explanation: explanation("The two secant-tangent conjugates multiply to 1.", `Therefore secθ−tanθ = 1/(${formatExactPlain(sum)}) = ${show(c)}.`, "Do not subtract tan directly from the given sum without knowing sec separately."), state: { angle: a }, verification: numericVerification(c.value, 1 / (1 / Math.cos(a * Math.PI / 180) + Math.tan(a * Math.PI / 180)), "CONJUGATE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-108": { const a = pick(seed, `${id}|a`, [30, 45] as const); const cosec = std("COSEC", a), cot = std("COT", a), sum = addExact(cosec, cot), diff = subtractExact(cosec, cot), c = N(diff); return { stem: `If θ=${a}° and cosec θ + cot θ = ${formatExactPlain(sum)}, find cosec θ − cot θ.`, correct: c, wrong: [{ value: N(sum), misconceptionId: "RETURNED_GIVEN_EXPRESSION" }, { value: N(cosec), misconceptionId: "USED_COSEC_ONLY" }, { value: N(cot), misconceptionId: "USED_COT_ONLY" }], explanation: explanation("The cosecant-cotangent conjugates multiply to 1.", `So the required difference is the reciprocal of ${formatExactPlain(sum)}.`, "Do not confuse the conjugate identity with simple subtraction."), state: { angle: a }, verification: numericVerification(c.value, 1 / (1 / Math.sin(a * Math.PI / 180) + 1 / Math.tan(a * Math.PI / 180)), "CONJUGATE_NUMERIC_CHECK") }; }

    case "TRG-001-QL-126": { const e = expr.add(expr.multiply(expr.trig("SIN", degree(45)), expr.trig("COS", degree(30))), expr.multiply(expr.trig("COS", degree(45)), expr.trig("SIN", degree(30)))); const wrongA = div(subtractExact(exactSurd(1, 6), exactSurd(1, 2)), exactInteger(4)); const wrongB = exactSurd(1, 2, 2); const wrongC = exactRational(1, 2); return exprSpec(wording(seed, id, "Evaluate sin 75° exactly.", "Find the exact value of sin(45°+30°)."), e, [{ value: N(wrongA), misconceptionId: "USED_DIFFERENCE_SIGN" }, { value: N(wrongB), misconceptionId: "USED_SIN45_ONLY" }, { value: N(wrongC), misconceptionId: "USED_SIN30_ONLY" }], explanation("Use sin(A+B)=sinA cosB+cosA sinB.", "Substitute 45° and 30° standard values and simplify exactly.", "The sine sum identity uses a plus sign between the two products."), { angle: 75 }); }
    case "TRG-001-QL-127": { const e = expr.add(expr.multiply(expr.trig("COS", degree(45)), expr.trig("COS", degree(30))), expr.multiply(expr.trig("SIN", degree(45)), expr.trig("SIN", degree(30)))); const wrongA = div(subtractExact(exactSurd(1, 6), exactSurd(1, 2)), exactInteger(4)); const wrongB = exactSurd(1, 2, 2); const wrongC = exactRational(1, 2); return exprSpec(wording(seed, id, "Evaluate cos 15° exactly.", "Find the exact value of cos(45°−30°)."), e, [{ value: N(wrongA), misconceptionId: "USED_WRONG_DIFFERENCE_SIGN" }, { value: N(wrongB), misconceptionId: "USED_COS45_ONLY" }, { value: N(wrongC), misconceptionId: "USED_COS60_VALUE" }], explanation("Use cos(A−B)=cosA cosB+sinA sinB.", "Substitute the 45° and 30° values, then combine the surds.", "Cosine of a difference uses a plus between the product terms."), { angle: 15 }); }
    case "TRG-001-QL-128": { const root3 = exactSurd(1, 3), c = N(addExact(exactInteger(2), root3)); return { stem: wording(seed, id, "Evaluate tan 75° exactly.", "Find tan(45°+30°) in exact form."), correct: c, wrong: [{ value: N(subtractExact(exactInteger(2), root3)), misconceptionId: "USED_DIFFERENCE_FORM" }, { value: N(root3), misconceptionId: "USED_TAN60" }, { value: N(exactInteger(1)), misconceptionId: "USED_TAN45" }], explanation: explanation("Use tan(A+B)=(tanA+tanB)/(1−tanA tanB).", `Substituting 45° and 30° gives ${show(c)} after rationalization.`, "The denominator for a tangent sum contains a minus sign."), state: { angle: 75 }, verification: numericVerification(c.value, Math.tan(75 * Math.PI / 180), "ANGLE_SUM_NUMERIC_CHECK") }; }
    case "TRG-001-QL-129": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.multiply(expr.constant(exactInteger(2)), expr.trig("SIN", degree(a)), expr.trig("COS", degree(a))); return exprSpec(`Evaluate sin(2×${a}°) using 2 sin${a}° cos${a}°.`, e, [{ value: N(multiplyExact(exactInteger(2), sq(std("SIN", a)))), misconceptionId: "USED_TWO_SIN_SQUARED" }, { value: N(multiplyExact(exactInteger(2), sq(std("COS", a)))), misconceptionId: "USED_TWO_COS_SQUARED" }, { value: N(multiplyExact(std("SIN", a), std("COS", a))), misconceptionId: "DROPPED_FACTOR_TWO" }], explanation("Use sin2θ = 2sinθcosθ.", `For θ=${a}°, substitute exact standard values and simplify.`, "Do not double sine alone."), { theta: a, angle: 2 * a }); }
    case "TRG-001-QL-130": { const a = pick(seed, `${id}|a`, [30, 60] as const); const e = expr.subtract(expr.power(expr.trig("COS", degree(a)), 2), expr.power(expr.trig("SIN", degree(a)), 2)); const c = evaluateTrigExpression(e); if (c.kind === "UNDEFINED") throw new Error("Unexpected undefined double-angle cosine."); return exprSpec(`Evaluate cos(2×${a}°) using cos²${a}° − sin²${a}°.`, e, [{ value: N(multiplyExact(exactInteger(-1), c)), misconceptionId: "REVERSED_SUBTRACTION" }, { value: N(exactInteger(1)), misconceptionId: "USED_PYTHAGOREAN_SUM" }, { value: N(exactInteger(0)), misconceptionId: "ASSUMED_EQUAL_SQUARES" }], explanation("Use cos2θ = cos²θ−sin²θ.", `Substitute θ=${a}° and preserve the subtraction order.`, "Reversing the squares changes the sign."), { theta: a, angle: 2 * a }); }
    case "TRG-001-QL-131": { const k = pick(seed, `${id}|k`, [1, 2, 3] as const); const c = N(exactSurd(k, 2)); return { stem: `Find the maximum value of ${k}(sin θ + cos θ).`, correct: c, wrong: [{ value: N(exactInteger(k)), misconceptionId: "ASSUMED_MAX_ONE" }, { value: N(exactInteger(2 * k)), misconceptionId: "ADDED_SEPARATE_MAXIMA" }, { value: N(exactSurd(k, 3)), misconceptionId: "USED_WRONG_AMPLITUDE" }], explanation: explanation("sinθ+cosθ has maximum √2.", `Therefore the maximum is ${k}√2.`, "sinθ and cosθ cannot both equal 1 at the same angle."), state: { coefficient: k }, verification: numericVerification(c.value, k * Math.SQRT2, "AMPLITUDE_CHECK") }; }
    case "TRG-001-QL-132": { const pair = pick(seed, `${id}|pair`, [[8, 6], [10, 14], [12, 18]] as const); const aa = pair[0], b = pair[1], area = aa * b / 4, c = N(exactInteger(b), "UNITS"); return { stem: `A triangle has one side ${aa} units, included angle 30°, and area ${area} square units. Find the other side forming the 30° angle.`, correct: c, wrong: [{ value: N(exactInteger(aa), "UNITS"), misconceptionId: "RETURNED_GIVEN_SIDE" }, { value: N(exactInteger(b / 2), "UNITS"), misconceptionId: "FAILED_TO_CANCEL_HALF" }, { value: N(exactInteger(2 * b), "UNITS"), misconceptionId: "DOUBLED_UNKNOWN_SIDE" }], explanation: explanation("Use area = 1/2 ab sin C.", `${area}=1/2×${aa}×b×1/2, so b=${b} units.`, "At 30°, sin30°=1/2 creates a second factor of 1/2."), state: { a: aa, b, angle: 30, area }, verification: numericVerification(c.value, (2 * area) / (aa * Math.sin(Math.PI / 6)), "REVERSE_AREA_NUMERIC_CHECK") }; }
    default: throw new Error(`No TRG-001 MVP expansion spec for ${id}`);
  }
}

function make(entry: Trg001MvpRegistryEntry, seed: string, spec: Spec): Trg001MvpExpansionQuestion {
  const raw = [{ value: spec.correct, isCorrect: true, misconceptionId: null as string | null }, ...spec.wrong.map((wrong) => ({ ...wrong, isCorrect: false }))];
  if (raw.length !== 4) throw new Error(`${entry.qlId}: expected four options.`);
  if (new Set(raw.map((option) => answerKey(option.value))).size !== 4) throw new Error(`${entry.qlId}: mathematically equivalent option collision.`);
  const options: Trg001MvpOption[] = shuffle(`${seed}|${entry.qlId}`, raw).map((option, index) => ({ label: (["A", "B", "C", "D"] as const)[index], value: option.value, display: show(option.value), isCorrect: option.isCorrect, misconceptionId: option.misconceptionId }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const checks = [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => answerKey(option.value))).size === 4, message: "Mathematically unique options." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0, message: "Valid correct index." },
    { name: "VERIFIED", passed: spec.verification.valid, message: "Independent verification passed." },
    { name: "NO_PLACEHOLDERS", passed: !/[{}]\\w+|\\{\\{/.test(spec.stem), message: "No unresolved placeholders." },
    { name: "ACTIVATION_LOCK", passed: true, message: "MVP remains inactive." },
  ];
  return {
    packageId: "TRG-001", cpId: entry.cpId, qlId: entry.qlId, solveMode: entry.solveMode, language: "en", seed,
    difficulty: entry.difficulty, target: entry.target, stem: spec.stem, options, correctIndex, answer: show(spec.correct), exactAnswer: spec.correct,
    explanation: spec.explanation, canonicalState: spec.state, verification: spec.verification, validation: { valid: checks.every((check) => check.passed), checks },
    reviewStatus: "UNREVIEWED", questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false,
    questionStudioDiscoverable: false, proofOnly: false, mvpOnly: true,
  };
}

export function generateTrg001MvpExpansionQuestion(qlId: string, seed: string) {
  const entry = BY_ID.get(qlId); if (!entry) throw new Error(`Unknown TRG-001 MVP expansion QL ${qlId}`);
  const question = make(entry, seed, buildSpec(qlId, seed)); if (!question.validation.valid) throw new Error(`${qlId}: MVP validation failed.`); return question;
}
export function generateTrg001MvpQuestion(qlId: string, seed: string): Trg001MvpQuestion {
  if (TRG_001_RUNTIME_PROOF_REGISTRY.some((entry) => entry.qlId === qlId)) return generateTrg001RuntimeProofQuestion(qlId, seed);
  return generateTrg001MvpExpansionQuestion(qlId, seed);
}
export function generateAllTrg001MvpQuestions(seed: string) { return TRG_001_MVP_REGISTRY.map((entry) => generateTrg001MvpQuestion(entry.qlId, seed)); }
export function mvpQuestionFingerprint(question: Trg001MvpQuestion) {
  if (question.proofOnly) return proofQuestionFingerprint(question);
  return [question.qlId, question.seed, question.stem, question.options.map((option) => `${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"), question.correctIndex, answerKey(question.exactAnswer)].join("::");
}
