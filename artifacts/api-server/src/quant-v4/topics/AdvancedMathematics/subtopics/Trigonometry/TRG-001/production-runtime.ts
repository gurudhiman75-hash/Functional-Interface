import type { AngleMeasure, ExactTrigNumber } from "../foundation/types";
import {
  addExact,
  assertDefined,
  divideExact,
  exactInteger,
  exactKey,
  exactRational,
  exactSurd,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  powerExact,
  subtractExact,
} from "../foundation/exact";
import { degree, radianPi, toDegrees, toRadianPiAngle } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import {
  TRG_001_MVP_REGISTRY,
} from "./mvp-runtime";
import {
  generateReviewedTrg001MvpQuestion,
  reviewedMvpFingerprint,
} from "./mvp-reviewed-runtime";

export type Trg001ProductionCpId =
  | "TRG-CP-001"
  | "TRG-CP-002"
  | "TRG-CP-003"
  | "TRG-CP-004"
  | "TRG-CP-005"
  | "TRG-CP-006";

type Difficulty = "Easy" | "Medium" | "Hard";
type Target = "SCALAR" | "LENGTH" | "ANGLE" | "DOMAIN" | "RELATION";
type Unit = "NONE" | "UNITS" | "SQUARE_UNITS";
type NumberAnswer = { kind: "NUMBER"; value: ExactTrigNumber; unit: Unit };
type AngleAnswer = { kind: "ANGLE"; value: AngleMeasure; preferredDisplay: "DEGREE" | "RADIAN_PI" };
type TextAnswer = { kind: "TEXT"; value: string };
type Answer = NumberAnswer | AngleAnswer | TextAnswer;
type Verification = { valid: boolean; method: string; expected: string; reconstructed: string; numericDelta: number | null };
type Explanation = { keyRule: string; steps: Array<{ title: string; body: string }>; shortcut: string; traps: string[] };

type Wrong = { value: Answer; misconceptionId: string };
type Spec = {
  stem: string;
  correct: Answer;
  wrong: Wrong[];
  explanation: Explanation;
  state: Record<string, string | number | boolean>;
  verification: Verification;
};

export type Trg001ProductionRegistryEntry = {
  qlId: string;
  cpId: Trg001ProductionCpId;
  solveMode: string;
  difficulty: Difficulty;
  target: Target;
  description: string;
  productionOnly: true;
};

export type Trg001ProductionExpansionQuestion = {
  packageId: "TRG-001";
  cpId: Trg001ProductionCpId;
  qlId: string;
  solveMode: string;
  language: "en";
  seed: string;
  difficulty: Difficulty;
  target: Target;
  stem: string;
  options: Array<{ label: "A" | "B" | "C" | "D"; value: Answer; display: string; isCorrect: boolean; misconceptionId: string | null }>;
  correctIndex: number;
  answer: string;
  exactAnswer: Answer;
  explanation: Explanation;
  canonicalState: Record<string, string | number | boolean>;
  verification: Verification;
  validation: { valid: boolean; checks: Array<{ name: string; passed: boolean; message: string }> };
  reviewStatus: "UNREVIEWED";
  aiEditorialStatus: "PENDING";
  humanReviewStatus: "PENDING";
  questionBankStatus: "NOT_STORED";
  testEligibility: "INELIGIBLE";
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  proofOnly: false;
  mvpOnly: false;
  productionOnly: true;
};

const R = [
  ["TRG-001-QL-013", "TRG-CP-001", "deriveSinFromCotRatio", "Medium", "SCALAR", "Sine from cotangent ratio"],
  ["TRG-001-QL-014", "TRG-CP-001", "deriveCosFromTanRatio", "Medium", "SCALAR", "Cosine from tangent ratio"],
  ["TRG-001-QL-015", "TRG-CP-001", "deriveCosecFromCosRatio", "Medium", "SCALAR", "Cosecant from cosine ratio"],
  ["TRG-001-QL-016", "TRG-CP-001", "deriveSecFromSinRatio", "Medium", "SCALAR", "Secant from sine ratio"],
  ["TRG-001-QL-017", "TRG-CP-001", "recoverAdjacentFromCosAndHypotenuse", "Medium", "LENGTH", "Adjacent-side recovery from cosine"],
  ["TRG-001-QL-018", "TRG-CP-001", "recoverHypotenuseFromTanAndAdjacent", "Medium", "LENGTH", "Hypotenuse recovery from tangent"],
  ["TRG-001-QL-019", "TRG-CP-001", "recoverOppositeFromCotAndAdjacent", "Medium", "LENGTH", "Opposite-side recovery from cotangent"],
  ["TRG-001-QL-020", "TRG-CP-001", "deriveSinFromTanRatio", "Medium", "SCALAR", "Sine from tangent ratio"],
  ["TRG-001-QL-021", "TRG-CP-001", "deriveCotFromSinRatio", "Medium", "SCALAR", "Cotangent from sine ratio"],
  ["TRG-001-QL-022", "TRG-CP-001", "deriveCosecFromSecRatio", "Medium", "SCALAR", "Cosecant from secant ratio"],
  ["TRG-001-QL-023", "TRG-CP-001", "findSecAfterPythagoreanRecovery", "Hard", "SCALAR", "Secant after Pythagorean recovery"],
  ["TRG-001-QL-024", "TRG-CP-001", "compareSinAndCosFromTan", "Easy", "RELATION", "Compare sine and cosine from tangent"],

  ["TRG-001-QL-037", "TRG-CP-002", "evaluateStandardCotangent", "Easy", "SCALAR", "Standard cotangent"],
  ["TRG-001-QL-038", "TRG-CP-002", "evaluateCosecFortyFive", "Easy", "SCALAR", "Standard cosecant at forty-five degrees"],
  ["TRG-001-QL-039", "TRG-CP-002", "evaluateComplementaryStandardSum", "Easy", "SCALAR", "Complementary standard-value sum"],
  ["TRG-001-QL-040", "TRG-CP-002", "evaluateSecTanDifference", "Easy", "SCALAR", "Standard secant-tangent difference"],
  ["TRG-001-QL-041", "TRG-CP-002", "evaluateSameAngleTanCotProduct", "Easy", "SCALAR", "Same-angle tangent-cotangent product"],
  ["TRG-001-QL-042", "TRG-CP-002", "evaluateSecCosecProduct", "Medium", "SCALAR", "Secant-cosecant product at forty-five degrees"],
  ["TRG-001-QL-043", "TRG-CP-002", "evaluateSinCosQuotient", "Medium", "SCALAR", "Standard sine-cosine quotient"],
  ["TRG-001-QL-044", "TRG-CP-002", "evaluateSquaredStandardSum", "Hard", "SCALAR", "Square of a standard-value sum"],
  ["TRG-001-QL-045", "TRG-CP-002", "evaluateReciprocalStandardProduct", "Medium", "SCALAR", "Reciprocal of a standard-value product"],
  ["TRG-001-QL-046", "TRG-CP-002", "evaluateCosecCotSum", "Medium", "SCALAR", "Cosecant-cotangent standard sum"],
  ["TRG-001-QL-047", "TRG-CP-002", "classifyTanNinetyDomain", "Medium", "DOMAIN", "Domain of tangent at ninety degrees"],
  ["TRG-001-QL-048", "TRG-CP-002", "classifyCotZeroDomain", "Medium", "DOMAIN", "Domain of cotangent at zero degrees"],

  ["TRG-001-QL-061", "TRG-CP-003", "convertLargeDegreeAngleToRadians", "Medium", "ANGLE", "Degree to radian conversion above 180 degrees"],
  ["TRG-001-QL-062", "TRG-CP-003", "convertLargeRadianAngleToDegrees", "Medium", "ANGLE", "Radian to degree conversion above pi"],
  ["TRG-001-QL-063", "TRG-CP-003", "reduceSineAfterOneEighty", "Medium", "SCALAR", "Sine reduction through 180 plus theta"],
  ["TRG-001-QL-064", "TRG-CP-003", "reduceCosineBeforeFullTurn", "Medium", "SCALAR", "Cosine reduction through 360 minus theta"],
  ["TRG-001-QL-065", "TRG-CP-003", "reduceTangentBeforeOneEighty", "Medium", "SCALAR", "Tangent reduction through 180 minus theta"],
  ["TRG-001-QL-066", "TRG-CP-003", "evaluateComplementaryCosecant", "Medium", "SCALAR", "Complementary cosecant relation"],
  ["TRG-001-QL-067", "TRG-CP-003", "evaluateComplementarySecant", "Medium", "SCALAR", "Complementary secant relation"],
  ["TRG-001-QL-068", "TRG-CP-003", "evaluateNegativeAngleSine", "Medium", "SCALAR", "Negative-angle sine"],
  ["TRG-001-QL-069", "TRG-CP-003", "evaluateNegativeAngleTangent", "Medium", "SCALAR", "Negative-angle tangent"],
  ["TRG-001-QL-070", "TRG-CP-003", "reduceCosineThroughFiveForty", "Hard", "SCALAR", "Reduction through 540 minus theta"],
  ["TRG-001-QL-071", "TRG-CP-003", "evaluateReducedRadianTangent", "Hard", "SCALAR", "Quadrant reduction with rational-pi tangent"],
  ["TRG-001-QL-072", "TRG-CP-003", "identifyPositiveFunctionsInQuadrantTwo", "Easy", "RELATION", "Quadrant sign identification"],

  ["TRG-001-QL-085", "TRG-CP-004", "simplifyOneMinusSinSquared", "Medium", "SCALAR", "Pythagorean identity quotient from sine"],
  ["TRG-001-QL-086", "TRG-CP-004", "simplifyCosecSquaredMinusOne", "Medium", "SCALAR", "Cosecant identity quotient"],
  ["TRG-001-QL-087", "TRG-CP-004", "simplifySecSquaredOverTanIdentity", "Medium", "SCALAR", "Secant identity ratio"],
  ["TRG-001-QL-088", "TRG-CP-004", "simplifyCosecSquaredOverCotIdentity", "Medium", "SCALAR", "Cosecant identity ratio"],
  ["TRG-001-QL-089", "TRG-CP-004", "deriveSinSquaredFromCosRatio", "Medium", "SCALAR", "Sine square from cosine ratio"],
  ["TRG-001-QL-090", "TRG-CP-004", "deriveCotSquaredFromCosecRatio", "Medium", "SCALAR", "Cotangent square from cosecant ratio"],
  ["TRG-001-QL-091", "TRG-CP-004", "evaluateReciprocalSecIdentity", "Medium", "SCALAR", "Evaluate reciprocal secant identity"],
  ["TRG-001-QL-092", "TRG-CP-004", "evaluateTanSecSquareRatio", "Medium", "SCALAR", "Evaluate tangent-secant square ratio"],
  ["TRG-001-QL-093", "TRG-CP-004", "simplifySecMinusCosOverTan", "Hard", "SCALAR", "Derived secant-cosine identity"],
  ["TRG-001-QL-094", "TRG-CP-004", "simplifyCosecMinusSinOverCot", "Hard", "SCALAR", "Derived cosecant-sine identity"],
  ["TRG-001-QL-095", "TRG-CP-004", "simplifyTanCotSecCosecComposite", "Hard", "SCALAR", "Composite reciprocal identity"],
  ["TRG-001-QL-096", "TRG-CP-004", "identifyEquivalentReciprocalIdentity", "Medium", "RELATION", "Identity equivalence recognition"],

  ["TRG-001-QL-109", "TRG-CP-005", "recoverSecFromSecTanSum", "Hard", "SCALAR", "Recover secant from secant-tangent sum"],
  ["TRG-001-QL-110", "TRG-CP-005", "recoverTanFromSecTanSum", "Hard", "SCALAR", "Recover tangent from secant-tangent sum"],
  ["TRG-001-QL-111", "TRG-CP-005", "recoverCosecFromCosecCotSum", "Hard", "SCALAR", "Recover cosecant from cosecant-cotangent sum"],
  ["TRG-001-QL-112", "TRG-CP-005", "recoverCotFromCosecCotSum", "Hard", "SCALAR", "Recover cotangent from cosecant-cotangent sum"],
  ["TRG-001-QL-113", "TRG-CP-005", "deriveSinMinusCosSquareFromSum", "Hard", "SCALAR", "Difference square from sine-cosine sum"],
  ["TRG-001-QL-114", "TRG-CP-005", "deriveSinCosProductFromDifference", "Hard", "SCALAR", "Sine-cosine product from difference"],
  ["TRG-001-QL-115", "TRG-CP-005", "deriveTanCotSquareSum", "Hard", "SCALAR", "Tangent-cotangent square sum"],
  ["TRG-001-QL-116", "TRG-CP-005", "recoverSecFromSecTanDifference", "Hard", "SCALAR", "Recover secant from secant-tangent difference"],
  ["TRG-001-QL-117", "TRG-CP-005", "deriveSumDifferenceRatioFromLinearRelation", "Hard", "SCALAR", "Derived ratio from linear sine-cosine relation"],
  ["TRG-001-QL-118", "TRG-CP-005", "deriveSinSquareMinusCosSquareFromTan", "Hard", "SCALAR", "Squared difference from tangent ratio"],
  ["TRG-001-QL-119", "TRG-CP-005", "solveAcuteAngleFromSinSquaredEquation", "Medium", "ANGLE", "Controlled sine-square equation"],
  ["TRG-001-QL-120", "TRG-CP-005", "solveAcuteAngleFromTanCotEquality", "Medium", "ANGLE", "Controlled tangent-cotangent equation"],

  ["TRG-001-QL-133", "TRG-CP-006", "evaluateCosSeventyFivePlusSinFifteen", "Hard", "SCALAR", "Mixed exact 15/75 degree sum"],
  ["TRG-001-QL-134", "TRG-CP-006", "evaluateSinSeventyFiveMinusCosSeventyFive", "Hard", "SCALAR", "Mixed exact 75 degree difference"],
  ["TRG-001-QL-135", "TRG-CP-006", "evaluateTanFifteen", "Hard", "SCALAR", "Tangent difference exact value"],
  ["TRG-001-QL-136", "TRG-CP-006", "deriveCosDoubleAngleFromTanRatio", "Hard", "SCALAR", "Cosine double angle from tangent ratio"],
  ["TRG-001-QL-137", "TRG-CP-006", "evaluateTanDoubleAngleFromStandardRatio", "Hard", "SCALAR", "Tangent double angle from exact tangent"],
  ["TRG-001-QL-138", "TRG-CP-006", "deriveSinDoubleAngleFromTanRatio", "Hard", "SCALAR", "Sine double angle from tangent ratio"],
  ["TRG-001-QL-139", "TRG-CP-006", "evaluateCosDifferenceExpansion", "Medium", "SCALAR", "Cosine difference expansion"],
  ["TRG-001-QL-140", "TRG-CP-006", "evaluateCosSumExpansion", "Medium", "SCALAR", "Cosine sum expansion"],
  ["TRG-001-QL-141", "TRG-CP-006", "findMaximumGeneralSinCosLinearForm", "Hard", "SCALAR", "Maximum of general sine-cosine linear form"],
  ["TRG-001-QL-142", "TRG-CP-006", "findMinimumGeneralSinCosLinearForm", "Hard", "SCALAR", "Minimum of general sine-cosine linear form"],
  ["TRG-001-QL-143", "TRG-CP-006", "recoverIncludedAngleFromTriangleArea", "Hard", "ANGLE", "Recover acute included angle from triangle area"],
  ["TRG-001-QL-144", "TRG-CP-006", "identifyCosineSumIdentity", "Medium", "RELATION", "Cosine-sum identity equivalence"],
] as const;

export const TRG_001_PRODUCTION_ADDITIONAL_REGISTRY: Trg001ProductionRegistryEntry[] = R.map(
  ([qlId, cpId, solveMode, difficulty, target, description]) => ({
    qlId, cpId, solveMode, difficulty, target, description, productionOnly: true,
  }),
);

export const TRG_001_PRODUCTION_REGISTRY = [
  ...TRG_001_MVP_REGISTRY.map((entry) => ({ ...entry, phase: "REVIEWED_MVP" as const })),
  ...TRG_001_PRODUCTION_ADDITIONAL_REGISTRY.map((entry) => ({ ...entry, phase: "PRODUCTION_EXPANSION" as const })),
];

const BY_ID = new Map(TRG_001_PRODUCTION_ADDITIONAL_REGISTRY.map((entry) => [entry.qlId, entry]));
const TRIPLES = [{ o: 3, a: 4, h: 5 }, { o: 5, a: 12, h: 13 }, { o: 8, a: 15, h: 17 }, { o: 7, a: 24, h: 25 }, { o: 20, a: 21, h: 29 }] as const;

function hash(text: string) { let h = 2166136261; for (const character of text) { h ^= character.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function pick<T>(seed: string, salt: string, values: readonly T[]): T { return values[hash(`${seed}|${salt}`) % values.length]; }
function tri(seed: string, id: string) { return pick(seed, `${id}|triple`, TRIPLES); }
function shuffle<T>(seed: string, values: T[]) { let state = hash(seed) || 1; for (let i = values.length - 1; i > 0; i -= 1) { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; const j = state % (i + 1); [values[i], values[j]] = [values[j], values[i]]; } return values; }
const N = (value: ExactTrigNumber, unit: Unit = "NONE"): NumberAnswer => ({ kind: "NUMBER", value, unit });
const A = (value: AngleMeasure, preferredDisplay: "DEGREE" | "RADIAN_PI"): AngleAnswer => ({ kind: "ANGLE", value, preferredDisplay });
const T = (value: string): TextAnswer => ({ kind: "TEXT", value });
const Q = (n: number, d: number = 1) => exactRational(n, d);
const std = (fn: "SIN" | "COS" | "TAN" | "COT" | "SEC" | "COSEC", angle: number) => requireTrigExact(fn, degree(angle));
const sq = (value: ExactTrigNumber) => assertDefined(powerExact(value, 2));
const div = (left: ExactTrigNumber, right: ExactTrigNumber) => assertDefined(divideExact(left, right));
const neg = (value: ExactTrigNumber) => multiplyExact(exactInteger(-1), value);

function answerKey(answer: Answer) {
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function radianText(angle: AngleMeasure) {
  const value = toRadianPiAngle(angle).coefficient;
  const sign = value.numerator < 0n ? "-" : "";
  const numerator = value.numerator < 0n ? -value.numerator : value.numerator;
  if (numerator === 0n) return "0";
  if (value.denominator === 1n) return numerator === 1n ? `${sign}π` : `${sign}${numerator}π`;
  return numerator === 1n ? `${sign}π/${value.denominator}` : `${sign}${numerator}π/${value.denominator}`;
}

function show(answer: Answer) {
  if (answer.kind === "TEXT") return answer.value;
  if (answer.kind === "ANGLE") {
    if (answer.preferredDisplay === "RADIAN_PI") return radianText(answer.value);
    const degrees = toDegrees(answer.value);
    return `${degrees.denominator === 1n ? degrees.numerator : `${degrees.numerator}/${degrees.denominator}`}°`;
  }
  const value = formatExactPlain(answer.value);
  if (answer.unit === "UNITS") return `${value} units`;
  if (answer.unit === "SQUARE_UNITS") return `${value} square units`;
  return value;
}

function numericVerification(expected: ExactTrigNumber, reconstructed: number, method: string): Verification {
  const actual = exactToNumber(expected);
  const delta = Math.abs(actual - reconstructed);
  return { valid: Number.isFinite(reconstructed) && delta <= 1e-10, method, expected: exactKey(expected), reconstructed: `NUM:${reconstructed}`, numericDelta: delta };
}
function angleVerification(expected: AngleAnswer, degrees: number, method: string): Verification {
  const exact = toDegrees(expected.value);
  const actual = Number(exact.numerator) / Number(exact.denominator);
  const delta = Math.abs(actual - degrees);
  return { valid: delta <= 1e-12, method, expected: `${actual}°`, reconstructed: `${degrees}°`, numericDelta: delta };
}
function theoremVerification(expected: string, method: string): Verification {
  return { valid: true, method, expected, reconstructed: expected, numericDelta: null };
}
function ex(rule: string, steps: string[], trap: string, shortcut = rule): Explanation {
  return { keyRule: rule, steps: steps.map((body, index) => ({ title: index === steps.length - 1 ? "Answer" : `Step ${index + 1}`, body })), shortcut, traps: [trap] };
}

function buildSpec(id: string, seed: string): Spec {
  const t = tri(seed, id);
  switch (id) {
    case "TRG-001-QL-013": { const c = N(Q(t.o, t.h)); return { stem: `If cot θ = ${t.a}/${t.o} and θ is acute, find sin θ.`, correct: c, wrong: [{ value: N(Q(t.a, t.h)), misconceptionId: "USED_COS" }, { value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }, { value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }], explanation: ex("Interpret cot θ as adjacent/opposite.", [`Take adjacent:opposite = ${t.a}:${t.o}; the corresponding hypotenuse is ${t.h}.`, `Therefore sin θ = opposite/hypotenuse = ${show(c)}.`], "Do not invert cotangent before assigning the triangle sides."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.o / t.h, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-014": { const c = N(Q(t.a, t.h)); return { stem: `If tan θ = ${t.o}/${t.a} and θ is acute, find cos θ.`, correct: c, wrong: [{ value: N(Q(t.o, t.h)), misconceptionId: "USED_SIN" }, { value: N(Q(t.h, t.a)), misconceptionId: "USED_SEC" }, { value: N(Q(t.o, t.a)), misconceptionId: "RETURNED_TAN" }], explanation: ex("Build the right triangle from tangent.", [`Opposite:adjacent = ${t.o}:${t.a}, so the hypotenuse is ${t.h}.`, `cos θ = adjacent/hypotenuse = ${show(c)}.`], "Cosine uses the adjacent side, not the opposite side."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.a / t.h, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-015": { const c = N(Q(t.h, t.o)); return { stem: `If cos θ = ${t.a}/${t.h} and θ is acute, find cosec θ.`, correct: c, wrong: [{ value: N(Q(t.h, t.a)), misconceptionId: "USED_SEC" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS" }, { value: N(Q(t.o, t.h)), misconceptionId: "RETURNED_SIN" }], explanation: ex("Recover the opposite side, then use cosecant.", [`Adjacent:hypotenuse = ${t.a}:${t.h}, so the opposite side is ${t.o}.`, `cosec θ = hypotenuse/opposite = ${show(c)}.`], "Cosecant is the reciprocal of sine, not cosine."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.h / t.o, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-016": { const c = N(Q(t.h, t.a)); return { stem: `If sin θ = ${t.o}/${t.h} and θ is acute, find sec θ.`, correct: c, wrong: [{ value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS" }, { value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }], explanation: ex("Recover the adjacent side, then use secant.", [`Opposite:hypotenuse = ${t.o}:${t.h}, so adjacent = ${t.a}.`, `sec θ = hypotenuse/adjacent = ${show(c)}.`], "Secant is the reciprocal of cosine."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.h / t.a, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-017": { const scale = pick(seed, `${id}|scale`, [2, 3, 4, 5] as const); const c = N(exactInteger(t.a * scale), "UNITS"); return { stem: `If cos θ = ${t.a}/${t.h} and the hypotenuse is ${t.h * scale} units, find the side adjacent to θ.`, correct: c, wrong: [{ value: N(exactInteger(t.o * scale), "UNITS"), misconceptionId: "USED_OPPOSITE" }, { value: N(exactInteger(t.h * scale), "UNITS"), misconceptionId: "RETURNED_HYPOTENUSE" }, { value: N(exactInteger((t.h - t.a) * scale), "UNITS"), misconceptionId: "SUBTRACTED_RATIO_PARTS" }], explanation: ex("Use proportional sides from the cosine ratio.", [`${t.h} ratio-parts correspond to ${t.h * scale} units, so one part is ${scale} units.`, `The adjacent side is ${t.a}×${scale} = ${show(c)}.`], "Use the cosine numerator for the adjacent side."), state: { ratioA: t.a, ratioH: t.h, scale }, verification: numericVerification(c.value, (t.a / t.h) * t.h * scale, "SIDE_PROPORTION") }; }
    case "TRG-001-QL-018": { const scale = pick(seed, `${id}|scale`, [2, 3, 4] as const); const c = N(exactInteger(t.h * scale), "UNITS"); return { stem: `If tan θ = ${t.o}/${t.a} and the adjacent side is ${t.a * scale} units, find the hypotenuse.`, correct: c, wrong: [{ value: N(exactInteger(t.o * scale), "UNITS"), misconceptionId: "RETURNED_OPPOSITE" }, { value: N(exactInteger(t.a * scale), "UNITS"), misconceptionId: "RETURNED_ADJACENT" }, { value: N(exactInteger((t.o + t.a) * scale), "UNITS"), misconceptionId: "ADDED_LEGS" }], explanation: ex("Scale the tangent triangle and then use its hypotenuse.", [`The adjacent ratio ${t.a} has become ${t.a * scale}, so the scale factor is ${scale}.`, `The hypotenuse is ${t.h}×${scale} = ${show(c)}.`], "The hypotenuse is not the sum of the two legs."), state: { o: t.o, a: t.a, h: t.h, scale }, verification: numericVerification(c.value, Math.hypot(t.o * scale, t.a * scale), "PYTHAGOREAN_SIDE_RECOVERY") }; }
    case "TRG-001-QL-019": { const scale = pick(seed, `${id}|scale`, [2, 3, 4] as const); const c = N(exactInteger(t.o * scale), "UNITS"); return { stem: `If cot θ = ${t.a}/${t.o} and the adjacent side is ${t.a * scale} units, find the side opposite θ.`, correct: c, wrong: [{ value: N(exactInteger(t.a * scale), "UNITS"), misconceptionId: "RETURNED_ADJACENT" }, { value: N(exactInteger(t.h * scale), "UNITS"), misconceptionId: "USED_HYPOTENUSE" }, { value: N(exactInteger((t.a - t.o) * scale), "UNITS"), misconceptionId: "SUBTRACTED_RATIO_PARTS" }], explanation: ex("cot θ gives adjacent:opposite.", [`The ratio side ${t.a} is scaled to ${t.a * scale}, so the scale factor is ${scale}.`, `Opposite = ${t.o}×${scale} = ${show(c)}.`], "Do not reverse the cotangent ratio."), state: { o: t.o, a: t.a, scale }, verification: numericVerification(c.value, (t.o / t.a) * t.a * scale, "SIDE_PROPORTION") }; }
    case "TRG-001-QL-020": { const c = N(Q(t.o, t.h)); return { stem: `If tan θ = ${t.o}/${t.a} and θ is acute, find sin θ.`, correct: c, wrong: [{ value: N(Q(t.a, t.h)), misconceptionId: "USED_COS" }, { value: N(Q(t.o, t.a)), misconceptionId: "RETURNED_TAN" }, { value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }], explanation: ex("Convert tangent into a right-triangle side ratio.", [`Take opposite:adjacent = ${t.o}:${t.a}; then hypotenuse = ${t.h}.`, `sin θ = ${t.o}/${t.h}.`], "Tangent and sine do not have the same denominator."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.o / t.h, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-021": { const c = N(Q(t.a, t.o)); return { stem: `If sin θ = ${t.o}/${t.h} and θ is acute, find cot θ.`, correct: c, wrong: [{ value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }, { value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }, { value: N(Q(t.a, t.h)), misconceptionId: "USED_COS" }], explanation: ex("Recover the adjacent side from the sine triangle.", [`Opposite:hypotenuse = ${t.o}:${t.h}, so adjacent = ${t.a}.`, `cot θ = adjacent/opposite = ${show(c)}.`], "Cotangent is adjacent divided by opposite."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.a / t.o, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-022": { const c = N(Q(t.h, t.o)); return { stem: `If sec θ = ${t.h}/${t.a} and θ is acute, find cosec θ.`, correct: c, wrong: [{ value: N(Q(t.h, t.a)), misconceptionId: "RETURNED_SEC" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS" }, { value: N(Q(t.o, t.h)), misconceptionId: "RETURNED_SIN" }], explanation: ex("Use secant to reconstruct the triangle.", [`sec θ = hypotenuse/adjacent = ${t.h}/${t.a}, so the opposite side is ${t.o}.`, `cosec θ = ${t.h}/${t.o}.`], "Secant and cosecant use different legs."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, t.h / t.o, "RIGHT_TRIANGLE_RECONSTRUCTION") }; }
    case "TRG-001-QL-023": { const scale = pick(seed, `${id}|scale`, [2, 3] as const); const c = N(Q(t.h, t.a)); return { stem: `The perpendicular and base of a right triangle are ${t.o * scale} and ${t.a * scale} units. If θ is opposite the perpendicular, find sec θ.`, correct: c, wrong: [{ value: N(Q(t.h, t.o)), misconceptionId: "USED_COSEC" }, { value: N(Q(t.o, t.a)), misconceptionId: "USED_TAN" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS" }], explanation: ex("Find the hypotenuse before forming secant.", [`Hypotenuse = √(${t.o * scale}²+${t.a * scale}²) = ${t.h * scale}.`, `sec θ = hypotenuse/adjacent = ${t.h * scale}/${t.a * scale} = ${show(c)}.`], "The common scale cancels only after the hypotenuse is found."), state: { o: t.o * scale, a: t.a * scale, h: t.h * scale }, verification: numericVerification(c.value, Math.hypot(t.o * scale, t.a * scale) / (t.a * scale), "PYTHAGOREAN_RATIO") }; }
    case "TRG-001-QL-024": { return { stem: `For an acute angle θ, tan θ = ${t.o}/${t.a}. Which statement is correct?`, correct: T("cos θ > sin θ"), wrong: [{ value: T("sin θ > cos θ"), misconceptionId: "REVERSED_COMPARISON" }, { value: T("sin θ = cos θ"), misconceptionId: "ASSUMED_EQUAL" }, { value: T("The comparison cannot be determined"), misconceptionId: "IGNORED_TAN_RATIO" }], explanation: ex("For an acute angle, tan θ = sin θ/cos θ.", [`Here tan θ=${t.o}/${t.a}<1.`, `Therefore sin θ<cos θ, so cos θ>sin θ.`], "For positive acute-angle values, tan θ<1 directly fixes the comparison."), state: { tanN: t.o, tanD: t.a }, verification: theoremVerification("cos θ > sin θ", "ACUTE_TANGENT_COMPARISON") }; }

    case "TRG-001-QL-037": { const angle = pick(seed, `${id}|angle`, [30, 60] as const); const c = N(std("COT", angle)); return { stem: `Find the exact value of cot ${angle}°.`, correct: c, wrong: [{ value: N(std("TAN", angle)), misconceptionId: "USED_TAN" }, { value: N(std("SIN", angle)), misconceptionId: "USED_SIN" }, { value: N(std("COS", angle)), misconceptionId: "USED_COS" }], explanation: ex("Use the exact standard cotangent value.", [`cot ${angle}° = ${show(c)}.`], "Cotangent is the reciprocal of tangent."), state: { angle }, verification: numericVerification(c.value, 1 / Math.tan(angle * Math.PI / 180), "INDEPENDENT_STANDARD_VALUE") }; }
    case "TRG-001-QL-038": { const c = N(std("COSEC", 45)); return { stem: "Find the exact value of cosec 45°.", correct: c, wrong: [{ value: N(std("SIN", 45)), misconceptionId: "RETURNED_SIN" }, { value: N(std("SEC", 30)), misconceptionId: "USED_WRONG_RECIPROCAL" }, { value: N(exactInteger(2)), misconceptionId: "USED_COSEC30" }], explanation: ex("cosec θ = 1/sin θ.", [`sin45°=√2/2, so cosec45°=${show(c)}.`], "Reciprocate the exact value instead of doubling it mechanically."), state: { angle: 45 }, verification: numericVerification(c.value, 1 / Math.sin(Math.PI / 4), "INDEPENDENT_STANDARD_VALUE") }; }
    case "TRG-001-QL-039": { const c = N(exactInteger(1)); return { stem: "Evaluate exactly: sin 30° + cos 60°.", correct: c, wrong: [{ value: N(Q(1, 2)), misconceptionId: "USED_ONE_TERM" }, { value: N(exactSurd(1, 3)), misconceptionId: "USED_SIXTY_SINE" }, { value: N(exactInteger(2)), misconceptionId: "ADDED_NUMERATORS_ONLY" }], explanation: ex("Evaluate both standard values before adding.", ["sin30°=1/2 and cos60°=1/2.", "Their sum is 1."], "These are equal complementary values, but the operation is addition."), state: { a: 30, b: 60 }, verification: numericVerification(c.value, Math.sin(Math.PI / 6) + Math.cos(Math.PI / 3), "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-040": { const c = N(exactInteger(1)); return { stem: "Evaluate exactly: sec 60° − tan 45°.", correct: c, wrong: [{ value: N(exactInteger(2)), misconceptionId: "USED_SEC_ONLY" }, { value: N(exactInteger(-1)), misconceptionId: "REVERSED_SUBTRACTION" }, { value: N(exactInteger(3)), misconceptionId: "ADDED_TERMS" }], explanation: ex("Substitute the two standard values.", ["sec60°=2 and tan45°=1.", "Therefore 2−1=1."], "Keep the subtraction sign."), state: { a: 60, b: 45 }, verification: numericVerification(c.value, 1 / Math.cos(Math.PI / 3) - Math.tan(Math.PI / 4), "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-041": { const c = N(exactInteger(1)); return { stem: "Evaluate exactly: tan 30° × cot 30°.", correct: c, wrong: [{ value: N(std("TAN", 30)), misconceptionId: "USED_TAN_ONLY" }, { value: N(std("COT", 30)), misconceptionId: "USED_COT_ONLY" }, { value: N(exactInteger(2)), misconceptionId: "ADDED_RECIPROCALS" }], explanation: ex("tan θ and cot θ are reciprocals at the same angle.", ["tan30°×cot30°=1."], "The reciprocal-product shortcut works only because the angles are identical."), state: { angle: 30 }, verification: numericVerification(c.value, Math.tan(Math.PI / 6) * (1 / Math.tan(Math.PI / 6)), "RECIPROCAL_PRODUCT") }; }
    case "TRG-001-QL-042": { const c = N(exactInteger(2)); return { stem: "Evaluate exactly: sec 45° × cosec 45°.", correct: c, wrong: [{ value: N(exactSurd(1, 2)), misconceptionId: "USED_ONE_FACTOR" }, { value: N(exactInteger(1)), misconceptionId: "ASSUMED_RECIPROCALS" }, { value: N(exactInteger(4)), misconceptionId: "SQUARED_PRODUCT" }], explanation: ex("Evaluate both reciprocal functions exactly.", ["sec45°=√2 and cosec45°=√2.", "Their product is 2."], "Secant and cosecant are not reciprocals of each other."), state: { angle: 45 }, verification: numericVerification(c.value, (1 / Math.cos(Math.PI / 4)) * (1 / Math.sin(Math.PI / 4)), "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-043": { const c = N(exactInteger(1)); return { stem: "Evaluate exactly: sin 60° / cos 30°.", correct: c, wrong: [{ value: N(std("SIN", 60)), misconceptionId: "USED_NUMERATOR_ONLY" }, { value: N(Q(1, 2)), misconceptionId: "USED_COS60" }, { value: N(exactSurd(1, 3)), misconceptionId: "USED_TAN60" }], explanation: ex("Use the exact complementary standard values.", ["sin60°=√3/2 and cos30°=√3/2.", "The quotient of equal non-zero values is 1."], "Do not cancel the angles; cancel the equal values."), state: { numeratorAngle: 60, denominatorAngle: 30 }, verification: numericVerification(c.value, Math.sin(Math.PI / 3) / Math.cos(Math.PI / 6), "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-044": { const sum = addExact(std("SIN", 30), std("COS", 30)); const c = N(sq(sum)); return { stem: "Evaluate exactly: (sin 30° + cos 30°)².", correct: c, wrong: [{ value: N(exactInteger(1)), misconceptionId: "USED_PYTHAGOREAN_IDENTITY" }, { value: N(addExact(exactInteger(1), exactSurd(1, 3))), misconceptionId: "DOUBLED_CROSS_TERM" }, { value: N(exactSurd(1, 3, 2)), misconceptionId: "USED_CROSS_TERM_ONLY" }], explanation: ex("Square the entire sum, not the individual identity.", ["sin30°+cos30°=(1+√3)/2.", `Squaring and simplifying gives ${show(c)}.` , "The cross term must be retained."], "sin²θ+cos²θ=1 does not mean (sinθ+cosθ)²=1."), state: { angle: 30 }, verification: numericVerification(c.value, (Math.sin(Math.PI / 6) + Math.cos(Math.PI / 6)) ** 2, "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-045": { const c = N(exactInteger(4)); return { stem: "Evaluate exactly: 1 / (sin 30° × cos 60°).", correct: c, wrong: [{ value: N(exactInteger(2)), misconceptionId: "RECIPROCATED_ONE_FACTOR" }, { value: N(exactInteger(1)), misconceptionId: "ASSUMED_PRODUCT_ONE" }, { value: N(Q(1, 4)), misconceptionId: "DID_NOT_RECIPROCATE" }], explanation: ex("Evaluate the product first, then take its reciprocal.", ["sin30°×cos60°=(1/2)(1/2)=1/4.", "The reciprocal of 1/4 is 4."], "Reciprocate the whole product."), state: { a: 30, b: 60 }, verification: numericVerification(c.value, 1 / (Math.sin(Math.PI / 6) * Math.cos(Math.PI / 3)), "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-046": { const c = N(exactInteger(3)); return { stem: "Evaluate exactly: cosec 30° + cot 45°.", correct: c, wrong: [{ value: N(exactInteger(1)), misconceptionId: "USED_COT_ONLY" }, { value: N(exactInteger(2)), misconceptionId: "USED_COSEC_ONLY" }, { value: N(exactSurd(1, 3)), misconceptionId: "USED_COT30" }], explanation: ex("Use the standard reciprocal values.", ["cosec30°=2 and cot45°=1.", "Therefore the sum is 3."], "Evaluate each function at its own angle."), state: { a: 30, b: 45 }, verification: numericVerification(c.value, 1 / Math.sin(Math.PI / 6) + 1 / Math.tan(Math.PI / 4), "INDEPENDENT_STANDARD_EXPRESSION") }; }
    case "TRG-001-QL-047": { return { stem: "What is the value of tan 90°?", correct: T("Undefined"), wrong: [{ value: T("0"), misconceptionId: "USED_SIN90" }, { value: T("1"), misconceptionId: "ASSUMED_STANDARD_ONE" }, { value: T("∞"), misconceptionId: "TREATED_UNDEFINED_AS_INFINITY" }], explanation: ex("tan θ = sin θ/cos θ.", ["At 90°, cos90°=0.", "Division by zero is undefined, so tan90° is undefined."], "Do not report infinity as an exact real value."), state: { angle: 90 }, verification: theoremVerification("Undefined", "ZERO_COSINE_DENOMINATOR") }; }
    case "TRG-001-QL-048": { return { stem: "What is the value of cot 0°?", correct: T("Undefined"), wrong: [{ value: T("0"), misconceptionId: "USED_SIN0" }, { value: T("1"), misconceptionId: "ASSUMED_STANDARD_ONE" }, { value: T("∞"), misconceptionId: "TREATED_UNDEFINED_AS_INFINITY" }], explanation: ex("cot θ = cos θ/sin θ.", ["At 0°, sin0°=0.", "Division by zero is undefined, so cot0° is undefined."], "A zero denominator makes the ratio undefined."), state: { angle: 0 }, verification: theoremVerification("Undefined", "ZERO_SINE_DENOMINATOR") }; }

    case "TRG-001-QL-061": { const d = pick(seed, `${id}|degrees`, [225, 270, 315] as const); const c = A(radianPi(d, 180), "RADIAN_PI"); return { stem: `Convert ${d}° to radians in terms of π.`, correct: c, wrong: [{ value: A(radianPi(d, 360), "RADIAN_PI"), misconceptionId: "USED_360_DENOMINATOR" }, { value: A(radianPi(d, 90), "RADIAN_PI"), misconceptionId: "USED_90_DENOMINATOR" }, { value: A(radianPi(180, d), "RADIAN_PI"), misconceptionId: "INVERTED_CONVERSION" }], explanation: ex("Multiply degrees by π/180.", [`${d}° × π/180 = ${show(c)}.` , "Reduce the fraction completely."], "The degree-to-radian denominator is 180."), state: { degrees: d }, verification: angleVerification(c, d, "DEGREE_RADIAN_CONVERSION") }; }
    case "TRG-001-QL-062": { const z = pick(seed, `${id}|angle`, [{ n: 5, d: 4, deg: 225 }, { n: 7, d: 6, deg: 210 }, { n: 11, d: 6, deg: 330 }] as const); const c = A(degree(z.deg), "DEGREE"); return { stem: `Convert ${radianText(radianPi(z.n, z.d))} to degrees.`, correct: c, wrong: [{ value: A(degree(z.deg / 2), "DEGREE"), misconceptionId: "HALVED_RESULT" }, { value: A(degree(z.deg * 2), "DEGREE"), misconceptionId: "DOUBLED_RESULT" }, { value: A(degree(z.deg - 90), "DEGREE"), misconceptionId: "SUBTRACTED_NINETY" }], explanation: ex("Multiply the π coefficient by 180°.", [`(${z.n}/${z.d})×180°=${z.deg}°.` , `Therefore the angle is ${show(c)}.`], "π radians corresponds to 180°, not 360°."), state: { numerator: z.n, denominator: z.d }, verification: angleVerification(c, z.deg, "RADIAN_DEGREE_CONVERSION") }; }
    case "TRG-001-QL-063": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(neg(std("SIN", a))); return { stem: `Evaluate exactly: sin(180° + ${a}°).`, correct: c, wrong: [{ value: N(std("SIN", a)), misconceptionId: "LOST_QUADRANT_SIGN" }, { value: N(std("COS", a)), misconceptionId: "USED_COS" }, { value: N(std("TAN", a)), misconceptionId: "USED_TAN" }], explanation: ex("sin(180°+θ)=−sinθ.", [`180°+${a}° lies in quadrant III, where sine is negative.`, `Therefore the value is ${show(c)}.`], "Keep the reference-angle magnitude and apply the quadrant sign."), state: { theta: a, target: 180 + a }, verification: numericVerification(c.value, Math.sin((180 + a) * Math.PI / 180), "ANGLE_REDUCTION_NUMERIC_CHECK") }; }
    case "TRG-001-QL-064": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(std("COS", a)); return { stem: `Evaluate exactly: cos(360° − ${a}°).`, correct: c, wrong: [{ value: N(neg(std("COS", a))), misconceptionId: "WRONG_SIGN" }, { value: N(std("SIN", a)), misconceptionId: "USED_SIN" }, { value: N(std("TAN", a)), misconceptionId: "USED_TAN" }], explanation: ex("cos(360°−θ)=cosθ.", [`The angle is in quadrant IV, where cosine is positive.`, `Its reference angle is ${a}°, so the value is ${show(c)}.`], "Cosine remains positive in quadrant IV."), state: { theta: a, target: 360 - a }, verification: numericVerification(c.value, Math.cos((360 - a) * Math.PI / 180), "ANGLE_REDUCTION_NUMERIC_CHECK") }; }
    case "TRG-001-QL-065": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(neg(std("TAN", a))); return { stem: `Evaluate exactly: tan(180° − ${a}°).`, correct: c, wrong: [{ value: N(std("TAN", a)), misconceptionId: "LOST_QUADRANT_SIGN" }, { value: N(std("COT", a)), misconceptionId: "USED_COT" }, { value: N(neg(std("COT", a))), misconceptionId: "RECIPROCAL_AND_SIGN" }], explanation: ex("tan(180°−θ)=−tanθ.", [`The target angle lies in quadrant II, where tangent is negative.`, `Use reference angle ${a}° to obtain ${show(c)}.`], "Tangent is negative in quadrant II."), state: { theta: a, target: 180 - a }, verification: numericVerification(c.value, Math.tan((180 - a) * Math.PI / 180), "ANGLE_REDUCTION_NUMERIC_CHECK") }; }
    case "TRG-001-QL-066": { const a = pick(seed, `${id}|a`, [30, 60] as const); const target = 90 - a; const c = N(std("SEC", a)); return { stem: `Evaluate exactly: cosec(90° − ${a}°).`, correct: c, wrong: [{ value: N(std("COSEC", a)), misconceptionId: "DID_NOT_SWAP_COFUNCTION" }, { value: N(std("COS", a)), misconceptionId: "RETURNED_COS" }, { value: N(std("SIN", a)), misconceptionId: "RETURNED_SIN" }], explanation: ex("cosec(90°−θ)=secθ.", [`90°−${a}°=${target}°.` , `By the cofunction relation, the value is sec${a}°=${show(c)}.`], "Cosecant pairs with secant under complementary angles."), state: { theta: a, target }, verification: numericVerification(c.value, 1 / Math.sin(target * Math.PI / 180), "COFUNCTION_NUMERIC_CHECK") }; }
    case "TRG-001-QL-067": { const a = pick(seed, `${id}|a`, [30, 60] as const); const target = 90 - a; const c = N(std("COSEC", a)); return { stem: `Evaluate exactly: sec(90° − ${a}°).`, correct: c, wrong: [{ value: N(std("SEC", a)), misconceptionId: "DID_NOT_SWAP_COFUNCTION" }, { value: N(std("COS", a)), misconceptionId: "RETURNED_COS" }, { value: N(std("SIN", a)), misconceptionId: "RETURNED_SIN" }], explanation: ex("sec(90°−θ)=cosecθ.", [`90°−${a}°=${target}°.` , `Thus sec${target}°=cosec${a}°=${show(c)}.`], "Secant pairs with cosecant under complementary angles."), state: { theta: a, target }, verification: numericVerification(c.value, 1 / Math.cos(target * Math.PI / 180), "COFUNCTION_NUMERIC_CHECK") }; }
    case "TRG-001-QL-068": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(neg(std("SIN", a))); return { stem: `Find the exact value of sin(−${a}°).`, correct: c, wrong: [{ value: N(std("SIN", a)), misconceptionId: "TREATED_SIN_AS_EVEN" }, { value: N(std("COS", a)), misconceptionId: "USED_COS" }, { value: N(neg(std("COS", a))), misconceptionId: "USED_NEGATIVE_COS" }], explanation: ex("Sine is an odd function.", [`sin(−θ)=−sinθ.`, `Therefore sin(−${a}°)=${show(c)}.`], "Negative angles reverse the sign of sine."), state: { angle: -a }, verification: numericVerification(c.value, Math.sin(-a * Math.PI / 180), "NEGATIVE_ANGLE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-069": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(neg(std("TAN", a))); return { stem: `Find the exact value of tan(−${a}°).`, correct: c, wrong: [{ value: N(std("TAN", a)), misconceptionId: "TREATED_TAN_AS_EVEN" }, { value: N(std("COT", a)), misconceptionId: "USED_COT" }, { value: N(neg(std("COT", a))), misconceptionId: "RECIPROCAL_AND_SIGN" }], explanation: ex("Tangent is an odd function.", [`tan(−θ)=−tanθ.`, `Thus tan(−${a}°)=${show(c)}.`], "Do not confuse odd-function sign change with taking a reciprocal."), state: { angle: -a }, verification: numericVerification(c.value, Math.tan(-a * Math.PI / 180), "NEGATIVE_ANGLE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-070": { const a = pick(seed, `${id}|a`, [30, 60] as const); const target = 540 - a; const c = N(neg(std("COS", a))); return { stem: `Evaluate exactly: cos(${target}°).`, correct: c, wrong: [{ value: N(std("COS", a)), misconceptionId: "WRONG_SIGN" }, { value: N(neg(std("SIN", a))), misconceptionId: "USED_SIN" }, { value: N(std("SIN", a)), misconceptionId: "USED_POSITIVE_SIN" }], explanation: ex("Reduce the angle before applying the reference value.", [`${target}°−360°=${180 - a}°.` , `${180 - a}° is in quadrant II with reference angle ${a}°.` , `Cosine is negative there, so the value is ${show(c)}.`], "Subtract a full turn first; then use the correct quadrant sign."), state: { original: target, reduced: 180 - a, reference: a }, verification: numericVerification(c.value, Math.cos(target * Math.PI / 180), "MULTI_STEP_ANGLE_REDUCTION") }; }
    case "TRG-001-QL-071": { const z = pick(seed, `${id}|z`, [{ n: 7, d: 6, deg: 210 }, { n: 5, d: 3, deg: 300 }] as const); const c = N(requireTrigExact("TAN", radianPi(z.n, z.d))); const oppositeSign = neg(c.value); const reciprocal = std("COT", z.deg); return { stem: `Evaluate exactly: tan(${radianText(radianPi(z.n, z.d))}).`, correct: c, wrong: [{ value: N(oppositeSign), misconceptionId: "WRONG_QUADRANT_SIGN" }, { value: N(reciprocal), misconceptionId: "USED_COT" }, { value: N(neg(reciprocal)), misconceptionId: "RECIPROCAL_AND_SIGN" }], explanation: ex("Convert the rational-π angle and reduce by quadrant.", [`${radianText(radianPi(z.n, z.d))}=${z.deg}°.` , `Find the reference angle and tangent sign in that quadrant.`, `The exact result is ${show(c)}.`], "Radian conversion and quadrant sign are separate steps."), state: { numerator: z.n, denominator: z.d, degrees: z.deg }, verification: numericVerification(c.value, Math.tan(z.n * Math.PI / z.d), "RADIAN_REDUCTION_NUMERIC_CHECK") }; }
    case "TRG-001-QL-072": { return { stem: "In quadrant II, which pair of trigonometric functions is positive?", correct: T("sin θ and cosec θ"), wrong: [{ value: T("cos θ and sec θ"), misconceptionId: "USED_QUADRANT_FOUR_PAIR" }, { value: T("tan θ and cot θ"), misconceptionId: "USED_QUADRANT_THREE_PAIR" }, { value: T("All six functions"), misconceptionId: "ASSUMED_ALL_POSITIVE" }], explanation: ex("In quadrant II, sine is positive and cosine is negative.", ["Reciprocal functions keep the sign of their base function.", "Therefore sinθ and cosecθ are positive."], "Use ASTC/sign logic rather than memorizing isolated values."), state: { quadrant: "II" }, verification: theoremVerification("sin θ and cosec θ", "QUADRANT_SIGN_THEOREM") }; }

    case "TRG-001-QL-085": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(exactInteger(1)); return { stem: `Simplify exactly: (1 − sin²${a}°)/cos²${a}°.`, correct: c, wrong: [{ value: N(sq(std("SIN", a))), misconceptionId: "STOPPED_AT_NUMERATOR" }, { value: N(sq(std("COS", a))), misconceptionId: "RETURNED_DENOMINATOR" }, { value: N(exactInteger(2)), misconceptionId: "ADDED_IDENTITY_TERMS" }], explanation: ex("Use 1−sin²θ=cos²θ.", [`The numerator becomes cos²${a}°.` , "Numerator and denominator are equal, so the ratio is 1."], "Use the identity before substituting decimals."), state: { angle: a }, verification: numericVerification(c.value, (1 - Math.sin(a * Math.PI / 180) ** 2) / Math.cos(a * Math.PI / 180) ** 2, "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-086": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(exactInteger(1)); return { stem: `Simplify exactly: (cosec²${a}° − 1)/cot²${a}°.`, correct: c, wrong: [{ value: N(sq(std("COT", a))), misconceptionId: "STOPPED_AT_NUMERATOR" }, { value: N(sq(std("COSEC", a))), misconceptionId: "DROPPED_MINUS_ONE" }, { value: N(exactInteger(0)), misconceptionId: "SUBTRACTED_EQUAL_TERMS" }], explanation: ex("Use cosec²θ−1=cot²θ.", ["The numerator becomes cot²θ.", "The quotient cot²θ/cot²θ equals 1."], "Keep the square on cotangent."), state: { angle: a }, verification: numericVerification(c.value, ((1 / Math.sin(a * Math.PI / 180)) ** 2 - 1) / ((1 / Math.tan(a * Math.PI / 180)) ** 2), "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-087": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(exactInteger(1)); return { stem: `Simplify exactly: sec²${a}°/(1 + tan²${a}°).`, correct: c, wrong: [{ value: N(sq(std("SEC", a))), misconceptionId: "RETURNED_NUMERATOR" }, { value: N(sq(std("TAN", a))), misconceptionId: "RETURNED_TAN_SQUARED" }, { value: N(div(exactInteger(1), sq(std("SEC", a)))), misconceptionId: "INVERTED_RATIO" }], explanation: ex("Use 1+tan²θ=sec²θ.", ["Replace the denominator by sec²θ.", "The ratio is sec²θ/sec²θ=1."], "Do not invert the identity."), state: { angle: a }, verification: numericVerification(c.value, (1 / Math.cos(a * Math.PI / 180)) ** 2 / (1 + Math.tan(a * Math.PI / 180) ** 2), "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-088": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(exactInteger(1)); return { stem: `Simplify exactly: cosec²${a}°/(1 + cot²${a}°).`, correct: c, wrong: [{ value: N(sq(std("COSEC", a))), misconceptionId: "RETURNED_NUMERATOR" }, { value: N(sq(std("COT", a))), misconceptionId: "RETURNED_COT_SQUARED" }, { value: N(div(exactInteger(1), sq(std("COSEC", a)))), misconceptionId: "INVERTED_RATIO" }], explanation: ex("Use 1+cot²θ=cosec²θ.", ["Replace the denominator by cosec²θ.", "The ratio is 1."], "Do not confuse the cotangent identity with the tangent identity."), state: { angle: a }, verification: numericVerification(c.value, (1 / Math.sin(a * Math.PI / 180)) ** 2 / (1 + (1 / Math.tan(a * Math.PI / 180)) ** 2), "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-089": { const c = N(Q(t.o * t.o, t.h * t.h)); return { stem: `If cos θ = ${t.a}/${t.h} and θ is acute, find sin²θ.`, correct: c, wrong: [{ value: N(Q(t.o, t.h)), misconceptionId: "RETURNED_SIN" }, { value: N(Q(t.a * t.a, t.h * t.h)), misconceptionId: "RETURNED_COS_SQUARED" }, { value: N(Q(t.h * t.h, t.o * t.o)), misconceptionId: "USED_COSEC_SQUARED" }], explanation: ex("Use sin²θ=1−cos²θ.", [`sin²θ=1−(${t.a}/${t.h})².` , `After simplification, sin²θ=${show(c)}.`], "The target is the square, so no square root is required."), state: { cosN: t.a, cosD: t.h, o: t.o }, verification: numericVerification(c.value, 1 - (t.a / t.h) ** 2, "PYTHAGOREAN_IDENTITY_CHECK") }; }
    case "TRG-001-QL-090": { const c = N(Q(t.a * t.a, t.o * t.o)); return { stem: `If cosec θ = ${t.h}/${t.o} and θ is acute, find cot²θ.`, correct: c, wrong: [{ value: N(Q(t.h * t.h, t.o * t.o)), misconceptionId: "RETURNED_COSEC_SQUARED" }, { value: N(Q(t.a, t.o)), misconceptionId: "RETURNED_COT" }, { value: N(Q(t.o * t.o, t.a * t.a)), misconceptionId: "USED_TAN_SQUARED" }], explanation: ex("Use cot²θ=cosec²θ−1.", [`cot²θ=(${t.h}/${t.o})²−1.` , `This simplifies to ${show(c)}.`], "Subtract 1 after squaring cosecant."), state: { cosecN: t.h, cosecD: t.o, a: t.a }, verification: numericVerification(c.value, (t.h / t.o) ** 2 - 1, "COSEC_COT_IDENTITY_CHECK") }; }
    case "TRG-001-QL-091": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(sq(std("COS", a))); return { stem: `Evaluate exactly: 1/(1 + tan²${a}°).`, correct: c, wrong: [{ value: N(sq(std("SIN", a))), misconceptionId: "USED_SIN_SQUARED" }, { value: N(sq(std("TAN", a))), misconceptionId: "RETURNED_TAN_SQUARED" }, { value: N(sq(std("SEC", a))), misconceptionId: "USED_SEC_SQUARED" }], explanation: ex("Since 1+tan²θ=sec²θ, its reciprocal is cos²θ.", [`1/(1+tan²${a}°)=1/sec²${a}°.` , `That equals cos²${a}°=${show(c)}.`], "The reciprocal of sec²θ is cos²θ."), state: { angle: a }, verification: numericVerification(c.value, 1 / (1 + Math.tan(a * Math.PI / 180) ** 2), "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-092": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(sq(std("SIN", a))); return { stem: `Evaluate exactly: tan²${a}°/sec²${a}°.`, correct: c, wrong: [{ value: N(sq(std("COS", a))), misconceptionId: "USED_COS_SQUARED" }, { value: N(sq(std("TAN", a))), misconceptionId: "RETURNED_TAN_SQUARED" }, { value: N(exactInteger(1)), misconceptionId: "ASSUMED_EQUAL" }], explanation: ex("tanθ/secθ = sinθ.", [`tan²θ/sec²θ=(sinθ/cosθ)²×cos²θ.` , `This simplifies to sin²θ=${show(c)}.`], "Square the whole ratio consistently."), state: { angle: a }, verification: numericVerification(c.value, Math.tan(a * Math.PI / 180) ** 2 / (1 / Math.cos(a * Math.PI / 180)) ** 2, "IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-093": { const a = pick(seed, `${id}|a`, [30, 60] as const); const secMinusCos = subtractExact(std("SEC", a), std("COS", a)); const c = N(std("SIN", a)); return { stem: `Evaluate exactly: (sec ${a}° − cos ${a}°)/tan ${a}°.`, correct: c, wrong: [{ value: N(std("COS", a)), misconceptionId: "RETURNED_COS" }, { value: N(std("TAN", a)), misconceptionId: "RETURNED_TAN" }, { value: N(std("COSEC", a)), misconceptionId: "USED_COSEC" }], explanation: ex("Rewrite secθ−cosθ using a common denominator.", [`secθ−cosθ=(1−cos²θ)/cosθ=sin²θ/cosθ.` , "Dividing by tanθ=sinθ/cosθ leaves sinθ.", `At ${a}°, the exact value is ${show(c)}.`], "Use the identity before inserting standard values."), state: { angle: a, numerator: formatExactPlain(secMinusCos) }, verification: numericVerification(c.value, ((1 / Math.cos(a * Math.PI / 180)) - Math.cos(a * Math.PI / 180)) / Math.tan(a * Math.PI / 180), "DERIVED_IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-094": { const a = pick(seed, `${id}|a`, [30, 60] as const); const c = N(std("COS", a)); return { stem: `Evaluate exactly: (cosec ${a}° − sin ${a}°)/cot ${a}°.`, correct: c, wrong: [{ value: N(std("SIN", a)), misconceptionId: "RETURNED_SIN" }, { value: N(std("COT", a)), misconceptionId: "RETURNED_COT" }, { value: N(std("SEC", a)), misconceptionId: "USED_SEC" }], explanation: ex("Rewrite cosecθ−sinθ using a common denominator.", [`cosecθ−sinθ=(1−sin²θ)/sinθ=cos²θ/sinθ.` , "Dividing by cotθ=cosθ/sinθ leaves cosθ.", `At ${a}°, this is ${show(c)}.`], "Use the Pythagorean identity in the numerator."), state: { angle: a }, verification: numericVerification(c.value, ((1 / Math.sin(a * Math.PI / 180)) - Math.sin(a * Math.PI / 180)) / (1 / Math.tan(a * Math.PI / 180)), "DERIVED_IDENTITY_NUMERIC_CHECK") }; }
    case "TRG-001-QL-095": { const c = N(exactInteger(0)); return { stem: "Simplify: (tan θ + cot θ)² − sec²θ − cosec²θ, where all terms are defined.", correct: c, wrong: [{ value: N(exactInteger(1)), misconceptionId: "LEFT_IDENTITY_CONSTANT" }, { value: N(exactInteger(-1)), misconceptionId: "SIGN_ERROR" }, { value: N(exactInteger(2)), misconceptionId: "DOUBLE_COUNTED_CONSTANT" }], explanation: ex("Expand the square and use reciprocal identities.", ["(tan+cot)²=tan²+cot²+2 because tanθ·cotθ=1.", "sec²+cosec²=(1+tan²)+(1+cot²)=tan²+cot²+2.", "The two expressions are equal, so their difference is 0."], "Convert both sides to tan²+cot²+2."), state: { symbolic: true }, verification: theoremVerification("0", "SYMBOLIC_IDENTITY_REDUCTION") }; }
    case "TRG-001-QL-096": { return { stem: "Which expression is equivalent to 1/(1 + tan²θ), wherever it is defined?", correct: T("cos²θ"), wrong: [{ value: T("sin²θ"), misconceptionId: "USED_WRONG_RECIPROCAL" }, { value: T("sec²θ"), misconceptionId: "DID_NOT_RECIPROCATE" }, { value: T("cot²θ"), misconceptionId: "USED_COT_IDENTITY" }], explanation: ex("1+tan²θ=sec²θ.", ["Taking reciprocals gives 1/(1+tan²θ)=1/sec²θ.", "Since 1/sec²θ=cos²θ, the equivalent expression is cos²θ."], "Reciprocate both sides of the secant identity."), state: { symbolic: true }, verification: theoremVerification("cos²θ", "SYMBOLIC_IDENTITY_EQUIVALENCE") }; }

    case "TRG-001-QL-109": { const k = pick(seed, `${id}|k`, [2, 3, 4] as const); const c = N(Q(k * k + 1, 2 * k)); return { stem: `If sec θ + tan θ = ${k}, find sec θ.`, correct: c, wrong: [{ value: N(exactInteger(k)), misconceptionId: "RETURNED_GIVEN_SUM" }, { value: N(Q(1, k)), misconceptionId: "RETURNED_CONJUGATE" }, { value: N(Q(k * k - 1, 2 * k)), misconceptionId: "RETURNED_TAN" }], explanation: ex("Use the conjugate product to recover the second equation.", [`secθ−tanθ=1/${k}.`, `Add the two equations: 2secθ=${k}+1/${k}.`, `Hence secθ=${show(c)}.`], "Add the conjugate equations to isolate secant."), state: { given: k }, verification: numericVerification(c.value, (k + 1 / k) / 2, "CONJUGATE_RECOVERY") }; }
    case "TRG-001-QL-110": { const k = pick(seed, `${id}|k`, [2, 3, 4] as const); const c = N(Q(k * k - 1, 2 * k)); return { stem: `If sec θ + tan θ = ${k}, find tan θ.`, correct: c, wrong: [{ value: N(Q(k * k + 1, 2 * k)), misconceptionId: "RETURNED_SEC" }, { value: N(exactInteger(k)), misconceptionId: "RETURNED_GIVEN_SUM" }, { value: N(Q(1, k)), misconceptionId: "RETURNED_CONJUGATE" }], explanation: ex("Use (sec+tan)(sec−tan)=1.", [`secθ−tanθ=1/${k}.`, `Subtract the equations: 2tanθ=${k}−1/${k}.`, `Therefore tanθ=${show(c)}.`], "Subtract the conjugate equations to isolate tangent."), state: { given: k }, verification: numericVerification(c.value, (k - 1 / k) / 2, "CONJUGATE_RECOVERY") }; }
    case "TRG-001-QL-111": { const k = pick(seed, `${id}|k`, [2, 3, 4] as const); const c = N(Q(k * k + 1, 2 * k)); return { stem: `If cosec θ + cot θ = ${k}, find cosec θ.`, correct: c, wrong: [{ value: N(exactInteger(k)), misconceptionId: "RETURNED_GIVEN_SUM" }, { value: N(Q(1, k)), misconceptionId: "RETURNED_CONJUGATE" }, { value: N(Q(k * k - 1, 2 * k)), misconceptionId: "RETURNED_COT" }], explanation: ex("Use the cosecant-cotangent conjugate identity.", [`cosecθ−cotθ=1/${k}.`, `Add the equations to get 2cosecθ=${k}+1/${k}.`, `Thus cosecθ=${show(c)}.`], "Adding the conjugates isolates cosecant."), state: { given: k }, verification: numericVerification(c.value, (k + 1 / k) / 2, "CONJUGATE_RECOVERY") }; }
    case "TRG-001-QL-112": { const k = pick(seed, `${id}|k`, [2, 3, 4] as const); const c = N(Q(k * k - 1, 2 * k)); return { stem: `If cosec θ + cot θ = ${k}, find cot θ.`, correct: c, wrong: [{ value: N(Q(k * k + 1, 2 * k)), misconceptionId: "RETURNED_COSEC" }, { value: N(exactInteger(k)), misconceptionId: "RETURNED_GIVEN_SUM" }, { value: N(Q(1, k)), misconceptionId: "RETURNED_CONJUGATE" }], explanation: ex("Recover the conjugate and subtract.", [`cosecθ−cotθ=1/${k}.`, `Subtract the equations: 2cotθ=${k}−1/${k}.`, `Hence cotθ=${show(c)}.`], "Subtract the conjugate equations to isolate cotangent."), state: { given: k }, verification: numericVerification(c.value, (k - 1 / k) / 2, "CONJUGATE_RECOVERY") }; }
    case "TRG-001-QL-113": { const z = pick(seed, `${id}|s`, [{ n: 5, d: 4 }, { n: 4, d: 3 }, { n: 7, d: 5 }] as const); const s = Q(z.n, z.d); const c = N(subtractExact(exactInteger(2), sq(s))); return { stem: `If sin θ + cos θ = ${z.n}/${z.d}, find (sin θ − cos θ)².`, correct: c, wrong: [{ value: N(subtractExact(sq(s), exactInteger(1))), misconceptionId: "RETURNED_TWO_SIN_COS" }, { value: N(subtractExact(exactInteger(1), sq(s))), misconceptionId: "WRONG_CONSTANT" }, { value: N(sq(s)), misconceptionId: "JUST_SQUARED_GIVEN" }], explanation: ex("Connect the squares of the sum and difference.", ["(sinθ+cosθ)²=1+2sinθcosθ.", "(sinθ−cosθ)²=1−2sinθcosθ.", `Adding the two relations gives (sinθ−cosθ)²=2−(${z.n}/${z.d})²=${show(c)}.`], "The sum of the two squared expressions is always 2."), state: { n: z.n, d: z.d }, verification: numericVerification(c.value, 2 - (z.n / z.d) ** 2, "DERIVED_SUM_DIFFERENCE_RELATION") }; }
    case "TRG-001-QL-114": { const z = pick(seed, `${id}|d`, [{ n: 1, d: 5 }, { n: 1, d: 3 }, { n: 1, d: 2 }] as const); const d = Q(z.n, z.d); const c = N(div(subtractExact(exactInteger(1), sq(d)), exactInteger(2))); return { stem: `If sin θ − cos θ = ${z.n}/${z.d}, find sin θ cos θ.`, correct: c, wrong: [{ value: N(div(addExact(exactInteger(1), sq(d)), exactInteger(2))), misconceptionId: "USED_PLUS_SIGN" }, { value: N(subtractExact(exactInteger(1), sq(d))), misconceptionId: "FORGOT_DIVIDE_BY_TWO" }, { value: N(sq(d)), misconceptionId: "RETURNED_GIVEN_SQUARE" }], explanation: ex("Square the given difference.", ["(sinθ−cosθ)²=1−2sinθcosθ.", `So 2sinθcosθ=1−(${z.n}/${z.d})².`, `Divide by 2 to obtain ${show(c)}.`], "The cross term in a squared difference is negative."), state: { n: z.n, d: z.d }, verification: numericVerification(c.value, (1 - (z.n / z.d) ** 2) / 2, "DERIVED_PRODUCT_RELATION") }; }
    case "TRG-001-QL-115": { const k = pick(seed, `${id}|k`, [3, 4, 5] as const); const c = N(exactInteger(k * k - 2)); return { stem: `If tan θ + cot θ = ${k}, find tan²θ + cot²θ.`, correct: c, wrong: [{ value: N(exactInteger(k * k)), misconceptionId: "JUST_SQUARED_GIVEN" }, { value: N(exactInteger(k * k - 1)), misconceptionId: "SUBTRACTED_ONE" }, { value: N(exactInteger(2)), misconceptionId: "USED_CROSS_TERM_ONLY" }], explanation: ex("Square the given sum and use tanθ·cotθ=1.", [`${k * k}=tan²θ+cot²θ+2.` , `Therefore tan²θ+cot²θ=${k * k}−2=${show(c)}.` , "The cross term contributes exactly 2."], "Same-angle tangent and cotangent multiply to 1."), state: { sum: k }, verification: numericVerification(c.value, k * k - 2, "RECIPROCAL_SUM_SQUARE") }; }
    case "TRG-001-QL-116": { const z = pick(seed, `${id}|p`, [{ n: 1, d: 2 }, { n: 1, d: 3 }, { n: 1, d: 4 }] as const); const c = N(Q(z.d * z.d + z.n * z.n, 2 * z.n * z.d)); return { stem: `If sec θ − tan θ = ${z.n}/${z.d}, find sec θ.`, correct: c, wrong: [{ value: N(Q(z.d * z.d - z.n * z.n, 2 * z.n * z.d)), misconceptionId: "RETURNED_TAN" }, { value: N(Q(z.n, z.d)), misconceptionId: "RETURNED_GIVEN_DIFFERENCE" }, { value: N(Q(z.d, z.n)), misconceptionId: "RETURNED_CONJUGATE" }], explanation: ex("The other conjugate is the reciprocal.", [`secθ+tanθ=${z.d}/${z.n}.`, "Add the sum and difference equations to obtain 2secθ.", `After dividing by 2, secθ=${show(c)}.`], "Adding the conjugates isolates secant."), state: { n: z.n, d: z.d }, verification: numericVerification(c.value, ((z.n / z.d) + (z.d / z.n)) / 2, "CONJUGATE_RECOVERY") }; }
    case "TRG-001-QL-117": { const z = pick(seed, `${id}|pair`, [{ a: 2, b: 3 }, { a: 3, b: 4 }, { a: 4, b: 5 }, { a: 2, b: 5 }] as const); const c = N(Q(z.a + z.b, z.b - z.a)); return { stem: `If ${z.a} sin θ = ${z.b} cos θ and sin θ ≠ cos θ, find (sin θ + cos θ)/(sin θ − cos θ).`, correct: c, wrong: [{ value: N(Q(z.b - z.a, z.a + z.b)), misconceptionId: "INVERTED_RATIO" }, { value: N(Q(-(z.a + z.b), z.b - z.a)), misconceptionId: "WRONG_DENOMINATOR_SIGN" }, { value: N(Q(z.b, z.a)), misconceptionId: "RETURNED_TAN" }], explanation: ex("First convert the linear relation into a sine-cosine ratio.", [`${z.a}sinθ=${z.b}cosθ gives sinθ/cosθ=${z.b}/${z.a}.`, `So sinθ:cosθ=${z.b}:${z.a}.`, `The required ratio is (${z.b}+${z.a})/(${z.b}−${z.a})=${show(c)}.`], "Once the proportional values are known, the common scale cancels."), state: { a: z.a, b: z.b }, verification: numericVerification(c.value, (z.b + z.a) / (z.b - z.a), "LINEAR_RELATION_DERIVED_RATIO") }; }
    case "TRG-001-QL-118": { const c = N(Q(t.o * t.o - t.a * t.a, t.h * t.h)); return { stem: `If tan θ = ${t.o}/${t.a} and θ is acute, find sin²θ − cos²θ.`, correct: c, wrong: [{ value: N(Q(t.a * t.a - t.o * t.o, t.h * t.h)), misconceptionId: "REVERSED_SUBTRACTION" }, { value: N(Q(t.o * t.o, t.a * t.a)), misconceptionId: "RETURNED_TAN_SQUARED" }, { value: N(Q(t.a * t.a, t.h * t.h)), misconceptionId: "RETURNED_COS_SQUARED" }], explanation: ex("Build the right triangle from tangent.", [`Opposite:adjacent=${t.o}:${t.a}, so hypotenuse=${t.h}.`, `sin²θ=${t.o * t.o}/${t.h * t.h} and cos²θ=${t.a * t.a}/${t.h * t.h}.`, `Subtract in the stated order to get ${show(c)}.`], "Because these acute examples have adjacent>opposite, the result is negative."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, (t.o / t.h) ** 2 - (t.a / t.h) ** 2, "RIGHT_TRIANGLE_DERIVED_IDENTITY") }; }
    case "TRG-001-QL-119": { const c = A(degree(45), "DEGREE"); return { stem: "If 2sin²θ = 1 and 0° < θ < 90°, find θ.", correct: c, wrong: [{ value: A(degree(30), "DEGREE"), misconceptionId: "USED_SIN_HALF" }, { value: A(degree(60), "DEGREE"), misconceptionId: "USED_SIN_ROOT_THREE_HALF" }, { value: A(degree(90), "DEGREE"), misconceptionId: "USED_SIN_ONE" }], explanation: ex("Solve for the positive acute sine value.", ["2sin²θ=1 gives sin²θ=1/2.", "Since θ is acute, sinθ=√2/2.", "The acute standard angle with sinθ=√2/2 is 45°."], "The interval condition selects the positive standard-angle solution."), state: { interval: "acute" }, verification: angleVerification(c, 45, "CONTROLLED_STANDARD_ANGLE_EQUATION") }; }
    case "TRG-001-QL-120": { const c = A(degree(45), "DEGREE"); return { stem: "If tan θ = cot θ and 0° < θ < 90°, find θ.", correct: c, wrong: [{ value: A(degree(30), "DEGREE"), misconceptionId: "USED_TAN30" }, { value: A(degree(60), "DEGREE"), misconceptionId: "USED_TAN60" }, { value: A(degree(90), "DEGREE"), misconceptionId: "USED_AXIS_ANGLE" }], explanation: ex("Use cotθ=1/tanθ.", ["tanθ=1/tanθ gives tan²θ=1.", "For an acute angle, tanθ is positive, so tanθ=1.", "Therefore θ=45°."], "The acute interval removes the negative tangent branch."), state: { interval: "acute" }, verification: angleVerification(c, 45, "CONTROLLED_RECIPROCAL_EQUATION") }; }

    case "TRG-001-QL-133": { const sin15 = subtractExact(multiplyExact(std("SIN", 45), std("COS", 30)), multiplyExact(std("COS", 45), std("SIN", 30))); const cos75 = sin15; const c = N(addExact(cos75, sin15)); return { stem: "Evaluate exactly: cos 75° + sin 15°.", correct: c, wrong: [{ value: N(sin15), misconceptionId: "USED_ONE_TERM" }, { value: N(addExact(std("SIN", 60), std("COS", 60))), misconceptionId: "USED_WRONG_ANGLES" }, { value: N(exactInteger(1)), misconceptionId: "ASSUMED_COMPLEMENT_SUM_ONE" }], explanation: ex("Use the cofunction relation first, then evaluate the exact special angle.", ["cos75°=sin15°, so the expression is 2sin15°.", "sin15°=sin(45°−30°)=sin45°cos30°−cos45°sin30°.", `After exact simplification, the value is ${show(c)}.`], "Complementary sine and cosine are equal, but their sum is twice that common value."), state: { angles: "75,15" }, verification: numericVerification(c.value, Math.cos(75 * Math.PI / 180) + Math.sin(15 * Math.PI / 180), "MIXED_EXACT_ANGLE_CHECK") }; }
    case "TRG-001-QL-134": { const sin75 = addExact(multiplyExact(std("SIN", 45), std("COS", 30)), multiplyExact(std("COS", 45), std("SIN", 30))); const cos75 = subtractExact(multiplyExact(std("COS", 45), std("COS", 30)), multiplyExact(std("SIN", 45), std("SIN", 30))); const c = N(subtractExact(sin75, cos75)); return { stem: "Evaluate exactly: sin 75° − cos 75°.", correct: c, wrong: [{ value: N(addExact(sin75, cos75)), misconceptionId: "ADDED_INSTEAD_OF_SUBTRACTED" }, { value: N(sin75), misconceptionId: "USED_SINE_ONLY" }, { value: N(cos75), misconceptionId: "USED_COSINE_ONLY" }], explanation: ex("Evaluate the two 75° exact values or use a shifted-angle identity.", ["Write 75° as 45°+30° for sine and cosine.", "Subtract the two exact expressions carefully.", `The simplified result is ${show(c)}.`], "Keep the subtraction order sin75°−cos75°."), state: { angle: 75 }, verification: numericVerification(c.value, Math.sin(75 * Math.PI / 180) - Math.cos(75 * Math.PI / 180), "MIXED_EXACT_ANGLE_CHECK") }; }
    case "TRG-001-QL-135": { const c = N(subtractExact(exactInteger(2), exactSurd(1, 3))); return { stem: "Find the exact value of tan 15°.", correct: c, wrong: [{ value: N(addExact(exactInteger(2), exactSurd(1, 3))), misconceptionId: "USED_TAN75" }, { value: N(exactSurd(1, 3)), misconceptionId: "USED_TAN60" }, { value: N(exactSurd(1, 3, 3)), misconceptionId: "USED_TAN30" }], explanation: ex("Use tan(45°−30°).", ["tan15°=(tan45°−tan30°)/(1+tan45°tan30°).", "Substitute tan45°=1 and tan30°=√3/3.", `Rationalizing gives ${show(c)}.`], "For a tangent difference, the denominator uses a plus sign."), state: { angle: 15 }, verification: numericVerification(c.value, Math.tan(15 * Math.PI / 180), "ANGLE_DIFFERENCE_NUMERIC_CHECK") }; }
    case "TRG-001-QL-136": { const c = N(Q(t.a * t.a - t.o * t.o, t.h * t.h)); return { stem: `If tan θ = ${t.o}/${t.a} and θ is acute, find cos 2θ.`, correct: c, wrong: [{ value: N(Q(t.o * t.o - t.a * t.a, t.h * t.h)), misconceptionId: "REVERSED_NUMERATOR" }, { value: N(Q(2 * t.o * t.a, t.h * t.h)), misconceptionId: "USED_SIN_DOUBLE_ANGLE" }, { value: N(Q(t.a, t.h)), misconceptionId: "RETURNED_COS_THETA" }], explanation: ex("Use cos2θ=(1−tan²θ)/(1+tan²θ).", [`Substitute tanθ=${t.o}/${t.a}.`, `The expression becomes (${t.a * t.a}−${t.o * t.o})/(${t.a * t.a}+${t.o * t.o}).`, `Since ${t.a * t.a}+${t.o * t.o}=${t.h * t.h}, cos2θ=${show(c)}.`], "The denominator becomes the square of the reconstructed hypotenuse."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, (1 - (t.o / t.a) ** 2) / (1 + (t.o / t.a) ** 2), "DOUBLE_ANGLE_TANGENT_CHECK") }; }
    case "TRG-001-QL-137": { const c = N(exactSurd(1, 3)); return { stem: "If tan θ = √3/3 and θ is acute, find tan 2θ.", correct: c, wrong: [{ value: N(exactSurd(1, 3, 3)), misconceptionId: "RETURNED_TAN_THETA" }, { value: N(exactInteger(1)), misconceptionId: "USED_TAN45" }, { value: N(neg(exactSurd(1, 3))), misconceptionId: "WRONG_SIGN" }], explanation: ex("Use tan2θ=2tanθ/(1−tan²θ).", ["Substitute tanθ=√3/3.", "The denominator becomes 1−1/3=2/3.", `After simplification, tan2θ=${show(c)}.`], "Square tanθ only in the denominator term."), state: { tan: "sqrt3/3" }, verification: numericVerification(c.value, (2 * (Math.sqrt(3) / 3)) / (1 - 1 / 3), "TANGENT_DOUBLE_ANGLE_CHECK") }; }
    case "TRG-001-QL-138": { const c = N(Q(2 * t.o * t.a, t.h * t.h)); return { stem: `If tan θ = ${t.o}/${t.a} and θ is acute, find sin 2θ.`, correct: c, wrong: [{ value: N(Q(t.o * t.a, t.h * t.h)), misconceptionId: "DROPPED_FACTOR_TWO" }, { value: N(Q(t.a * t.a - t.o * t.o, t.h * t.h)), misconceptionId: "USED_COS_DOUBLE_ANGLE" }, { value: N(Q(t.o, t.h)), misconceptionId: "RETURNED_SIN_THETA" }], explanation: ex("Use sin2θ=2tanθ/(1+tan²θ).", [`Substitute tanθ=${t.o}/${t.a}.`, `Multiply numerator and denominator by ${t.a * t.a}.`, `This gives 2×${t.o}×${t.a}/${t.h * t.h}=${show(c)}.`], "The plus sign in the denominator is essential."), state: { o: t.o, a: t.a, h: t.h }, verification: numericVerification(c.value, (2 * (t.o / t.a)) / (1 + (t.o / t.a) ** 2), "SINE_DOUBLE_ANGLE_TANGENT_CHECK") }; }
    case "TRG-001-QL-139": { const c = N(std("COS", 30)); return { stem: "Evaluate exactly: cos 60°·cos 30° + sin 60°·sin 30°.", correct: c, wrong: [{ value: N(exactInteger(0)), misconceptionId: "USED_COS_SUM" }, { value: N(exactInteger(1)), misconceptionId: "ASSUMED_IDENTITY_ONE" }, { value: N(Q(1, 2)), misconceptionId: "USED_COS60" }], explanation: ex("Recognize cos(A−B)=cosAcosB+sinAsinB.", ["The expression is cos(60°−30°).", "That is cos30°.", `Hence the exact value is ${show(c)}.`], "The plus between products corresponds to cosine of a difference."), state: { a: 60, b: 30 }, verification: numericVerification(c.value, Math.cos(Math.PI / 3) * Math.cos(Math.PI / 6) + Math.sin(Math.PI / 3) * Math.sin(Math.PI / 6), "ANGLE_DIFFERENCE_EXPANSION_CHECK") }; }
    case "TRG-001-QL-140": { const c = N(exactInteger(0)); return { stem: "Evaluate exactly: cos 60°·cos 30° − sin 60°·sin 30°.", correct: c, wrong: [{ value: N(std("COS", 30)), misconceptionId: "USED_COS_DIFFERENCE" }, { value: N(exactInteger(1)), misconceptionId: "ASSUMED_IDENTITY_ONE" }, { value: N(Q(1, 2)), misconceptionId: "USED_COS60" }], explanation: ex("Recognize cos(A+B)=cosAcosB−sinAsinB.", ["The expression is cos(60°+30°).", "That is cos90°.", "Therefore the exact value is 0."], "The minus between products corresponds to cosine of a sum."), state: { a: 60, b: 30 }, verification: numericVerification(c.value, Math.cos(Math.PI / 3) * Math.cos(Math.PI / 6) - Math.sin(Math.PI / 3) * Math.sin(Math.PI / 6), "ANGLE_SUM_EXPANSION_CHECK") }; }
    case "TRG-001-QL-141": { const pair = pick(seed, `${id}|pair`, [{ a: 3, b: 4, r: 5 }, { a: 5, b: 12, r: 13 }, { a: 8, b: 15, r: 17 }] as const); const c = N(exactInteger(pair.r)); return { stem: `Find the maximum value of ${pair.a} sin θ + ${pair.b} cos θ.`, correct: c, wrong: [{ value: N(exactInteger(pair.a + pair.b)), misconceptionId: "ADDED_SEPARATE_MAXIMA" }, { value: N(exactInteger(Math.max(pair.a, pair.b))), misconceptionId: "USED_LARGER_COEFFICIENT" }, { value: N(exactInteger(pair.r * pair.r)), misconceptionId: "FORGOT_SQUARE_ROOT" }], explanation: ex("For a sinθ+b cosθ, the maximum is √(a²+b²).", [`Compute √(${pair.a}²+${pair.b}²).`, `This is √${pair.r * pair.r}=${pair.r}.`, `Therefore the maximum value is ${show(c)}.`], "Sine and cosine cannot independently attain 1 at the same angle."), state: { a: pair.a, b: pair.b }, verification: numericVerification(c.value, Math.hypot(pair.a, pair.b), "AMPLITUDE_MAXIMUM_CHECK") }; }
    case "TRG-001-QL-142": { const pair = pick(seed, `${id}|pair`, [{ a: 3, b: 4, r: 5 }, { a: 5, b: 12, r: 13 }] as const); const c = N(exactInteger(-pair.r)); return { stem: `For real θ, find the minimum value of ${pair.a} sin θ + ${pair.b} cos θ.`, correct: c, wrong: [{ value: N(exactInteger(pair.r)), misconceptionId: "RETURNED_MAXIMUM" }, { value: N(exactInteger(-Math.max(pair.a, pair.b))), misconceptionId: "USED_LARGER_COEFFICIENT" }, { value: N(exactInteger(-(pair.a + pair.b))), misconceptionId: "ADDED_SEPARATE_MINIMA" }], explanation: ex("The range of a sinθ+b cosθ is [−R,R], where R=√(a²+b²).", [`R=√(${pair.a}²+${pair.b}²)=${pair.r}.`, `Hence the minimum possible value is −${pair.r}.`, `Therefore the answer is ${show(c)}.`], "Use the negative amplitude for the minimum."), state: { a: pair.a, b: pair.b }, verification: numericVerification(c.value, -Math.hypot(pair.a, pair.b), "AMPLITUDE_MINIMUM_CHECK") }; }
    case "TRG-001-QL-143": { const z = pick(seed, `${id}|triangle`, [{ a: 6, b: 8, area: 12 * Math.sqrt(3) }, { a: 8, b: 10, area: 20 * Math.sqrt(3) }] as const); const c = A(degree(60), "DEGREE"); const displayArea = z.a === 6 ? "12√3" : "20√3"; return { stem: `Two sides of a triangle are ${z.a} and ${z.b} units, and its area is ${displayArea} square units. If the included angle is acute, find that angle.`, correct: c, wrong: [{ value: A(degree(30), "DEGREE"), misconceptionId: "USED_SIN_HALF" }, { value: A(degree(45), "DEGREE"), misconceptionId: "USED_SIN_ROOT_TWO_HALF" }, { value: A(degree(90), "DEGREE"), misconceptionId: "USED_SIN_ONE" }], explanation: ex("Use Area = 1/2 ab sinC.", [`Substitute the two sides and the given area.`, "Solving gives sinC=√3/2.", "Because C is acute, C=60°."], "The acute-angle condition removes the supplementary alternative."), state: { a: z.a, b: z.b, area: displayArea }, verification: angleVerification(c, 60, "REVERSE_TRIANGLE_AREA_ANGLE_CHECK") }; }
    case "TRG-001-QL-144": { return { stem: "Which expression is equal to cos(A + B)?", correct: T("cos A cos B − sin A sin B"), wrong: [{ value: T("cos A cos B + sin A sin B"), misconceptionId: "USED_COS_DIFFERENCE" }, { value: T("sin A cos B + cos A sin B"), misconceptionId: "USED_SIN_SUM" }, { value: T("sin A cos B − cos A sin B"), misconceptionId: "USED_SIN_DIFFERENCE" }], explanation: ex("Use the cosine-sum identity.", ["cos(A+B)=cosAcosB−sinAsinB.", "The minus sign distinguishes cosine of a sum from cosine of a difference."], "Remember: cosine keeps cosine-cosine first and changes the middle sign."), state: { identity: "COS_SUM" }, verification: theoremVerification("cos A cos B − sin A sin B", "ANGLE_SUM_IDENTITY") }; }
    default: throw new Error(`No TRG-001 production expansion spec for ${id}`);
  }
}

function make(entry: Trg001ProductionRegistryEntry, seed: string, spec: Spec): Trg001ProductionExpansionQuestion {
  const raw = [{ value: spec.correct, isCorrect: true, misconceptionId: null as string | null }, ...spec.wrong.map((wrong) => ({ ...wrong, isCorrect: false }))];
  if (raw.length !== 4) throw new Error(`${entry.qlId}: expected exactly four options.`);
  if (new Set(raw.map((option) => answerKey(option.value))).size !== 4) throw new Error(`${entry.qlId}: mathematically equivalent option collision.`);
  const options = shuffle(`${seed}|${entry.qlId}|production`, raw).map((option, index) => ({
    label: (["A", "B", "C", "D"] as const)[index], value: option.value, display: show(option.value), isCorrect: option.isCorrect, misconceptionId: option.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const minimumSteps = entry.difficulty === "Hard" ? 3 : entry.difficulty === "Medium" ? 2 : 1;
  const checks = [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => answerKey(option.value))).size === 4, message: "No mathematically equivalent option duplicates." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0 && options[correctIndex]?.isCorrect === true, message: "Correct index points to the correct option." },
    { name: "VERIFIED", passed: spec.verification.valid, message: "Independent/theorem verification passed." },
    { name: "EXPLANATION_DEPTH", passed: spec.explanation.steps.length >= minimumSteps, message: `Explanation meets ${entry.difficulty} depth floor.` },
    { name: "NO_INTERNAL_ASSIGNMENT_PROSE", passed: !/\b(opposite|adjacent)\s*=/.test(spec.stem), message: "No internal assignment-style prose." },
    { name: "ACTIVATION_LOCK", passed: true, message: "Production expansion remains inactive." },
  ];
  if (!checks.every((check) => check.passed)) throw new Error(`${entry.qlId}: production validation failed: ${checks.filter((check) => !check.passed).map((check) => check.name).join(", ")}`);
  return {
    packageId: "TRG-001", cpId: entry.cpId, qlId: entry.qlId, solveMode: entry.solveMode, language: "en", seed,
    difficulty: entry.difficulty, target: entry.target, stem: spec.stem, options, correctIndex, answer: show(spec.correct), exactAnswer: spec.correct,
    explanation: spec.explanation, canonicalState: spec.state, verification: spec.verification, validation: { valid: true, checks },
    reviewStatus: "UNREVIEWED", aiEditorialStatus: "PENDING", humanReviewStatus: "PENDING",
    questionBankStatus: "NOT_STORED", testEligibility: "INELIGIBLE", publiclyPublishable: false, questionStudioDiscoverable: false,
    proofOnly: false, mvpOnly: false, productionOnly: true,
  };
}

export function generateTrg001ProductionExpansionQuestion(qlId: string, seed: string) {
  const entry = BY_ID.get(qlId);
  if (!entry) throw new Error(`Unknown TRG-001 production expansion QL ${qlId}`);
  return make(entry, seed, buildSpec(qlId, seed));
}

export function generateTrg001ProductionQuestion(qlId: string, seed: string): any {
  if (TRG_001_MVP_REGISTRY.some((entry) => entry.qlId === qlId)) return generateReviewedTrg001MvpQuestion(qlId, seed);
  return generateTrg001ProductionExpansionQuestion(qlId, seed);
}

export function generateAllTrg001ProductionQuestions(seed: string) {
  return TRG_001_PRODUCTION_REGISTRY.map((entry) => generateTrg001ProductionQuestion(entry.qlId, seed));
}

export function productionQuestionFingerprint(question: any) {
  if (!question.productionOnly) return reviewedMvpFingerprint(question);
  return [
    question.qlId,
    question.seed,
    question.stem,
    question.options.map((option: any) => `${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),
    question.correctIndex,
    answerKey(question.exactAnswer),
    question.explanation.steps.map((step: any) => `${step.title}:${step.body}`).join("|"),
  ].join("::");
}
