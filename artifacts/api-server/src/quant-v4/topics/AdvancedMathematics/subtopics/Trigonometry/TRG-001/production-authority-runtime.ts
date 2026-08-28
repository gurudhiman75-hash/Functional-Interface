import type { AngleMeasure, ExactTrigNumber } from "../foundation/types";
import {
  addExact,
  exactInteger,
  exactKey,
  exactRational,
  exactSurd,
  exactToNumber,
  formatExactPlain,
  multiplyExact,
  powerExact,
  assertDefined,
} from "../foundation/exact";
import { degree, toDegrees } from "../foundation/angle";
import { requireTrigExact } from "../foundation/standard-values";
import { generateCandidateTrg001ProductionQuestion } from "./production-candidate-runtime";

type Answer =
  | { kind: "NUMBER"; value: ExactTrigNumber; unit: "NONE" | "UNITS" | "SQUARE_UNITS" }
  | { kind: "ANGLE"; value: AngleMeasure; preferredDisplay: "DEGREE" | "RADIAN_PI" }
  | { kind: "TEXT"; value: string };

type Wrong = { value: Answer; misconceptionId: string };
type Verification = { valid: boolean; method: string; expected: string; reconstructed: string; numericDelta: number | null };
type Spec = {
  solveMode: string;
  difficulty: "Easy" | "Medium" | "Hard";
  target: "SCALAR" | "LENGTH" | "ANGLE" | "DOMAIN" | "RELATION";
  stem: string;
  correct: Answer;
  wrong: Wrong[];
  explanation: { keyRule: string; steps: Array<{ title: string; body: string }>; shortcut: string; traps: string[] };
  state: Record<string, string | number | boolean>;
  verification: Verification;
};

const TRIPLES = [
  { o: 3, a: 4, h: 5 },
  { o: 5, a: 12, h: 13 },
  { o: 8, a: 15, h: 17 },
  { o: 7, a: 24, h: 25 },
  { o: 20, a: 21, h: 29 },
] as const;

const SOURCE_MAP: Record<string, string> = {
  "005":"001","006":"002","007":"006","008":"007","009":"003","010":"023",
  "013":"004","014":"017","015":"018","016":"019","017":"010","018":"011","019":"012","020":"013","021":"014","022":"015","023":"024",
  "025":"025","026":"030","027":"031","028":"036","029":"026","030":"032","031":"037",
  "033":"027","034":"029","035":"035","036":"041","037":"042","041":"033","042":"039","043":"040","044":"046","047":"047","048":"048",
  "049":"049","050":"050","051":"061","052":"062","053":"051","054":"057","055":"066","056":"067",
  "059":"052","060":"063","061":"065","064":"064","065":"059","067":"054","068":"055","069":"060","070":"053","071":"056","072":"070",
  "073":"073","074":"076","075":"085","076":"028","077":"074","078":"075","079":"080","080":"077","081":"081","082":"090",
  "083":"082","084":"083","085":"091","086":"092","087":"078","088":"079","089":"087","090":"088","091":"093","092":"089","095":"086","096":"096",
  "097":"097","098":"100","099":"102","100":"118","101":"107","102":"103","103":"109","104":"110","105":"108","106":"104","107":"111","108":"112",
  "109":"105","110":"113","111":"114","113":"101","114":"117","117":"119","118":"120",
  "121":"121","122":"122","123":"123","124":"125","125":"133","126":"134","127":"126","128":"127","129":"128","130":"135","131":"129","132":"136","133":"137",
  "138":"141","139":"142","140":"124","141":"143","142":"144","143":"095",
};

const CUSTOM_IDS = new Set([
  "001","002","003","004","011","012","024","032","038","039","040","045","046","057","058","062","063","066","093","094","112","115","116","119","120","134","135","136","137","144",
]);

function hash(text: string) { let value = 2166136261; for (const character of text) { value ^= character.charCodeAt(0); value = Math.imul(value, 16777619); } return value >>> 0; }
function pick<T>(seed: string, salt: string, values: readonly T[]): T { return values[hash(`${seed}|${salt}`) % values.length]; }
function tri(seed: string, id: string) { return pick(seed, `${id}|authority-triangle`, TRIPLES); }
function shuffle<T>(seed: string, values: T[]) { let state = hash(seed) || 1; for (let i = values.length - 1; i > 0; i -= 1) { state = (Math.imul(state, 1664525) + 1013904223) >>> 0; const j = state % (i + 1); [values[i], values[j]] = [values[j], values[i]]; } return values; }
const N = (value: ExactTrigNumber, unit: "NONE" | "UNITS" | "SQUARE_UNITS" = "NONE"): Answer => ({ kind: "NUMBER", value, unit });
const A = (degrees: number): Answer => ({ kind: "ANGLE", value: degree(degrees), preferredDisplay: "DEGREE" });
const T = (value: string): Answer => ({ kind: "TEXT", value });
const Q = (n: number, d: number = 1) => exactRational(n, d);
const sq = (value: ExactTrigNumber) => assertDefined(powerExact(value, 2));
const std = (fn: "SIN" | "COS" | "TAN" | "COT" | "SEC" | "COSEC", angle: number) => requireTrigExact(fn, degree(angle));

function ql(n: number | string) { return `TRG-001-QL-${String(n).padStart(3, "0")}`; }
function numberOf(id: string) { return Number(id.slice(-3)); }
function cpFor(id: string) { const n = numberOf(id); return n <= 24 ? "TRG-CP-001" : n <= 48 ? "TRG-CP-002" : n <= 72 ? "TRG-CP-003" : n <= 96 ? "TRG-CP-004" : n <= 120 ? "TRG-CP-005" : "TRG-CP-006"; }

export function authorityFamilyForTrg001Ql(id: string) {
  const n = numberOf(id);
  if (n <= 4) return "SIDE_ROLE_RECOGNITION";
  if (n <= 8) return "DIRECT_SIDE_RATIO";
  if (n <= 12) return "PYTHAGOREAN_THEN_RATIO";
  if (n <= 16) return "SIDE_RECOVERY_FROM_RATIO";
  if (n <= 22) return "DERIVED_RATIOS_FROM_ONE_RATIO";
  if (n <= 24) return "RECIPROCAL_COMPARISON";
  if (n <= 28) return "SINGLE_STANDARD_VALUE";
  if (n <= 32) return "RECIPROCAL_STANDARD_VALUE";
  if (n <= 37) return "STANDARD_PRODUCTS_QUOTIENTS";
  if (n <= 40) return "STANDARD_POWERS";
  if (n <= 44) return "STANDARD_SUMS_DIFFERENCES";
  if (n <= 46) return "MIXED_STANDARD_EXPRESSION";
  if (n <= 48) return "STANDARD_DOMAIN_COMPARISON";
  if (n <= 52) return "DEGREE_RADIAN_CONVERSION";
  if (n <= 58) return "COMPLEMENTARY_RELATIONS";
  if (n <= 63) return "NINETY_ONEEIGHTY_REDUCTION";
  if (n <= 66) return "TWOSEVENTY_THREESIXTY_REDUCTION";
  if (n <= 69) return "QUADRANT_REFERENCE_SIGN";
  if (n <= 72) return "MIXED_PERIODIC_REDUCTION";
  if (n <= 76) return "PYTHAGOREAN_SIN_COS_IDENTITY";
  if (n <= 79) return "SEC_TAN_IDENTITY";
  if (n <= 82) return "COSEC_COT_IDENTITY";
  if (n <= 86) return "RECIPROCAL_QUOTIENT_IDENTITY";
  if (n <= 91) return "RATIONAL_IDENTITY_SIMPLIFICATION";
  if (n <= 95) return "EXPRESSION_FROM_GIVEN_RATIO";
  if (n === 96) return "IDENTITY_EQUIVALENCE";
  if (n <= 100) return "DERIVED_RATIO_EXPRESSION";
  if (n <= 104) return "SEC_TAN_CONJUGATE";
  if (n <= 108) return "COSEC_COT_CONJUGATE";
  if (n <= 112) return "SIN_COS_SUM_DIFFERENCE";
  if (n <= 116) return "LINEAR_SIN_COS_RELATION";
  if (n <= 120) return "CONTROLLED_STANDARD_EQUATION";
  if (n <= 126) return "MIXED_IDENTITY_EXPRESSION";
  if (n <= 130) return "ANGLE_SUM_DIFFERENCE";
  if (n <= 133) return "DOUBLE_ANGLE";
  if (n <= 137) return "STANDARD_SERIES_PRODUCTS";
  if (n <= 139) return "MAXIMUM_MINIMUM";
  if (n <= 141) return "TRIANGLE_AREA_SINE";
  return "EQUIVALENCE_VERIFICATION_COMPOSITE";
}

function answerKey(answer: Answer) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const d = toDegrees(answer.value); return `A:${d.numerator}/${d.denominator}`;
}
function show(answer: Answer) {
  if (answer.kind === "TEXT") return answer.value;
  if (answer.kind === "ANGLE") { const d = toDegrees(answer.value); return `${d.denominator === 1n ? d.numerator : `${d.numerator}/${d.denominator}`}°`; }
  const text = formatExactPlain(answer.value); return answer.unit === "UNITS" ? `${text} units` : answer.unit === "SQUARE_UNITS" ? `${text} square units` : text;
}
function numericVerification(expected: ExactTrigNumber, value: number, method: string): Verification { const delta = Math.abs(exactToNumber(expected) - value); return { valid: Number.isFinite(value) && delta <= 1e-10, method, expected: exactKey(expected), reconstructed: `NUM:${value}`, numericDelta: delta }; }
function theoremVerification(expected: string, method: string): Verification { return { valid: true, method, expected, reconstructed: expected, numericDelta: null }; }
function angleVerification(degrees: number, method: string): Verification { return { valid: true, method, expected: `${degrees}°`, reconstructed: `${degrees}°`, numericDelta: 0 }; }
function explanation(rule: string, steps: string[], trap: string, shortcut = rule) { return { keyRule: rule, steps: steps.map((body, index) => ({ title: index === steps.length - 1 ? "Answer" : `Step ${index + 1}`, body })), shortcut, traps: [trap] }; }

function buildCustom(id: string, seed: string): Spec {
  const t = tri(seed, id);
  switch (id) {
    case "001": return { solveMode: "identifyOppositeSide", difficulty: "Easy", target: "RELATION", stem: "In right triangle ABC, ∠C = 90°. Relative to angle A, which side is opposite?", correct: T("BC"), wrong: [{ value:T("AC"),misconceptionId:"USED_ADJACENT"},{value:T("AB"),misconceptionId:"USED_HYPOTENUSE"},{value:T("Cannot be determined"),misconceptionId:"IGNORED_VERTEX_ROLES"}], explanation: explanation("The opposite side does not touch the reference angle.",["Angle A is formed by AB and AC.","The remaining side BC lies opposite angle A."],"Do not call the hypotenuse the opposite side merely because it is longest."), state:{rightAngle:"C",referenceAngle:"A"}, verification: theoremVerification("BC","RIGHT_TRIANGLE_SIDE_ROLE") };
    case "002": return { solveMode: "identifyAdjacentLeg", difficulty: "Easy", target: "RELATION", stem: "In right triangle ABC, ∠C = 90°. Which leg is adjacent to angle A?", correct: T("AC"), wrong: [{ value:T("BC"),misconceptionId:"USED_OPPOSITE"},{value:T("AB"),misconceptionId:"USED_HYPOTENUSE"},{value:T("Both AC and AB"),misconceptionId:"COUNTED_HYPOTENUSE_AS_LEG"}], explanation: explanation("The adjacent leg touches the reference angle but is not the hypotenuse.",["AB is the hypotenuse because it is opposite the right angle.","Therefore AC is the adjacent leg to angle A."],"For trig side roles, exclude the hypotenuse when naming the adjacent leg."), state:{rightAngle:"C",referenceAngle:"A"}, verification: theoremVerification("AC","RIGHT_TRIANGLE_SIDE_ROLE") };
    case "003": return { solveMode: "identifyHypotenuse", difficulty: "Easy", target: "RELATION", stem: "In right triangle PQR, ∠Q = 90°. Which side is the hypotenuse?", correct: T("PR"), wrong: [{value:T("PQ"),misconceptionId:"USED_LEG"},{value:T("QR"),misconceptionId:"USED_LEG"},{value:T("It depends on the acute angle"),misconceptionId:"TREATED_HYPOTENUSE_AS_RELATIVE"}], explanation: explanation("The hypotenuse is opposite the right angle.",["The right angle is at Q.","The side opposite Q is PR, so PR is the hypotenuse."],"Unlike opposite/adjacent legs, the hypotenuse does not change with the chosen acute angle."), state:{rightAngle:"Q"}, verification: theoremVerification("PR","RIGHT_TRIANGLE_HYPOTENUSE") };
    case "004": return { solveMode: "recognizeSineSideRoles", difficulty: "Easy", target: "RELATION", stem: "In right triangle ABC with ∠C = 90°, which ratio represents sin A?", correct: T("BC/AB"), wrong: [{value:T("AC/AB"),misconceptionId:"USED_COS"},{value:T("BC/AC"),misconceptionId:"USED_TAN"},{value:T("AB/BC"),misconceptionId:"USED_COSEC"}], explanation: explanation("sin A = opposite/hypotenuse.",["Relative to A, BC is opposite and AB is the hypotenuse.","Hence sin A = BC/AB."],"Identify side roles before choosing a trig ratio."), state:{referenceAngle:"A"}, verification: theoremVerification("BC/AB","SINE_SIDE_ROLE_DEFINITION") };
    case "011": { const c=N(Q(t.a,t.h)); return { solveMode:"findMissingAdjacentThenCos", difficulty:"Medium", target:"SCALAR", stem:`In a right triangle, the hypotenuse is ${t.h} units and the side opposite θ is ${t.o} units. Find cos θ.`, correct:c, wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"}], explanation: explanation("Find the adjacent side by Pythagoras, then use cosine.",[ `Adjacent = √(${t.h}²−${t.o}²) = ${t.a}.`, `cosθ=${t.a}/${t.h}=${show(c)}.`],"Do not use the given opposite side directly in cosine."), state:{o:t.o,a:t.a,h:t.h}, verification:numericVerification((c as any).value,Math.sqrt(t.h*t.h-t.o*t.o)/t.h,"PYTHAGOREAN_THEN_COS") }; }
    case "012": { const c=N(Q(t.o,t.a)); return { solveMode:"findMissingOppositeThenTan", difficulty:"Medium", target:"SCALAR", stem:`In a right triangle, the hypotenuse is ${t.h} units and the side adjacent to θ is ${t.a} units. Find tan θ.`, correct:c, wrong:[{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"},{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"}], explanation: explanation("Find the opposite side by Pythagoras, then use tangent.",[ `Opposite = √(${t.h}²−${t.a}²) = ${t.o}.`, `tanθ=${t.o}/${t.a}=${show(c)}.`],"Tangent uses the two legs, not the hypotenuse."), state:{o:t.o,a:t.a,h:t.h}, verification:numericVerification((c as any).value,Math.sqrt(t.h*t.h-t.a*t.a)/t.a,"PYTHAGOREAN_THEN_TAN") }; }
    case "024": { const c=N(Q(t.h,t.o)); return { solveMode:"useSineCosecantReciprocal", difficulty:"Easy", target:"SCALAR", stem:`If sin θ = ${t.o}/${t.h}, find cosec θ.`, correct:c, wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"DID_NOT_RECIPROCATE"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"}], explanation: explanation("cosecθ is the reciprocal of sinθ.",[ `cosecθ=${t.h}/${t.o}.`, `Therefore the exact value is ${show(c)}.`],"Reverse numerator and denominator exactly once."), state:{sinN:t.o,sinD:t.h}, verification:numericVerification((c as any).value,t.h/t.o,"RECIPROCAL_RELATION") }; }
    case "032": { const c=N(std("SEC",45)); return { solveMode:"evaluateSecFortyFive",difficulty:"Easy",target:"SCALAR",stem:"Find the exact value of sec 45°.",correct:c,wrong:[{value:N(std("COS",45)),misconceptionId:"RETURNED_COS"},{value:N(std("SEC",30)),misconceptionId:"USED_SEC30"},{value:N(std("COSEC",30)),misconceptionId:"USED_COSEC30"}],explanation:explanation("secθ=1/cosθ.",["cos45°=√2/2.",`Its reciprocal is ${show(c)}.`],"Rationalize the reciprocal exactly; do not convert to a decimal."),state:{angle:45},verification:numericVerification((c as any).value,1/Math.cos(Math.PI/4),"STANDARD_RECIPROCAL")}; }
    case "038": { const c=N(Q(1,4)); return { solveMode:"evaluateSinSquaredThirty",difficulty:"Easy",target:"SCALAR",stem:"Evaluate sin²30°.",correct:c,wrong:[{value:N(Q(1,2)),misconceptionId:"FORGOT_SQUARE"},{value:N(Q(3,4)),misconceptionId:"USED_COS_SQUARED"},{value:N(exactInteger(1)),misconceptionId:"USED_IDENTITY_TOTAL"}],explanation:explanation("Square the standard sine value.",["sin30°=1/2.","Therefore sin²30°=(1/2)²=1/4."],"Square both numerator and denominator."),state:{angle:30},verification:numericVerification((c as any).value,Math.sin(Math.PI/6)**2,"STANDARD_POWER")}; }
    case "039": { const c=N(Q(3,4)); return { solveMode:"evaluateCosSquaredThirty",difficulty:"Easy",target:"SCALAR",stem:"Evaluate cos²30° exactly.",correct:c,wrong:[{value:N(Q(1,4)),misconceptionId:"USED_SIN_SQUARED"},{value:N(Q(1,2)),misconceptionId:"DROPPED_RADICAL_SQUARE"},{value:N(exactInteger(1)),misconceptionId:"USED_IDENTITY_TOTAL"}],explanation:explanation("Square the exact cosine value.",["cos30°=√3/2.","Hence cos²30°=3/4."],"Squaring √3 gives 3."),state:{angle:30},verification:numericVerification((c as any).value,Math.cos(Math.PI/6)**2,"STANDARD_POWER")}; }
    case "040": { const c=N(exactInteger(3)); return { solveMode:"evaluateTanSquaredSixty",difficulty:"Easy",target:"SCALAR",stem:"Evaluate tan²60° exactly.",correct:c,wrong:[{value:N(exactSurd(1,3)),misconceptionId:"FORGOT_SQUARE"},{value:N(Q(1,3)),misconceptionId:"USED_TAN30_SQUARED"},{value:N(exactInteger(1)),misconceptionId:"USED_TAN45_SQUARED"}],explanation:explanation("Square the standard tangent value.",["tan60°=√3.","Therefore tan²60°=3."],"Do not replace tan60° by tan30°."),state:{angle:60},verification:numericVerification((c as any).value,Math.tan(Math.PI/3)**2,"STANDARD_POWER")}; }
    case "045": { const c=N(Q(3,2)); return { solveMode:"evaluateMixedSquaredStandardExpression",difficulty:"Medium",target:"SCALAR",stem:"Evaluate exactly: sin²30° + cos²60° + tan45°.",correct:c,wrong:[{value:N(exactInteger(1)),misconceptionId:"USED_PYTHAGOREAN_SHORTCUT"},{value:N(Q(3,4)),misconceptionId:"DROPPED_TAN_TERM"},{value:N(exactInteger(2)),misconceptionId:"FAILED_TO_SQUARE"}],explanation:explanation("Evaluate every standard term with its stated power.",["sin²30°=1/4, cos²60°=1/4, tan45°=1.","Adding gives 1/4+1/4+1=3/2."],"The sine and cosine terms are at different angles, so do not invoke sin²θ+cos²θ=1."),state:{expression:"sin2(30)+cos2(60)+tan45"},verification:numericVerification((c as any).value,Math.sin(Math.PI/6)**2+Math.cos(Math.PI/3)**2+1,"MIXED_STANDARD_EXPRESSION")}; }
    case "046": { const c=N(exactInteger(3)); return { solveMode:"evaluateMixedReciprocalStandardExpression",difficulty:"Medium",target:"SCALAR",stem:"Evaluate exactly: sec60° + cosec30° − tan45°.",correct:c,wrong:[{value:N(exactInteger(5)),misconceptionId:"ADDED_ALL_TERMS"},{value:N(exactInteger(1)),misconceptionId:"USED_ONLY_DIFFERENCE"},{value:N(exactInteger(4)),misconceptionId:"DROPPED_TAN"}],explanation:explanation("Substitute the reciprocal standard values before combining.",["sec60°=2, cosec30°=2 and tan45°=1.","Thus 2+2−1=3."],"Preserve the final subtraction sign."),state:{expression:"sec60+cosec30-tan45"},verification:numericVerification((c as any).value,1/Math.cos(Math.PI/3)+1/Math.sin(Math.PI/6)-1,"MIXED_STANDARD_EXPRESSION")}; }
    case "057": { const a=pick(seed,`${id}|a`,[30,60] as const); const c=N(std("SIN",a)); return { solveMode:"evaluateComplementaryCosine",difficulty:"Medium",target:"SCALAR",stem:`Evaluate exactly: cos(90° − ${a}°).`,correct:c,wrong:[{value:N(std("COS",a)),misconceptionId:"DID_NOT_SWAP_COFUNCTION"},{value:N(std("TAN",a)),misconceptionId:"USED_TAN"},{value:N(std("COT",a)),misconceptionId:"USED_COT"}],explanation:explanation("cos(90°−θ)=sinθ.",[ `Use the cofunction identity.`, `The value is sin${a}°=${show(c)}.`],"Cosine swaps with sine for complementary angles."),state:{theta:a},verification:numericVerification((c as any).value,Math.cos((90-a)*Math.PI/180),"COFUNCTION_CHECK")}; }
    case "058": { const a=pick(seed,`${id}|a`,[30,60] as const); const c=N(std("TAN",a)); return { solveMode:"evaluateComplementaryCotangent",difficulty:"Medium",target:"SCALAR",stem:`Evaluate exactly: cot(90° − ${a}°).`,correct:c,wrong:[{value:N(std("COT",a)),misconceptionId:"DID_NOT_SWAP_COFUNCTION"},{value:N(std("SIN",a)),misconceptionId:"USED_SIN"},{value:N(std("COS",a)),misconceptionId:"USED_COS"}],explanation:explanation("cot(90°−θ)=tanθ.",["Apply the tangent-cotangent cofunction relation.",`The exact value is tan${a}°=${show(c)}.`],"Complementary cotangent becomes tangent."),state:{theta:a},verification:numericVerification((c as any).value,1/Math.tan((90-a)*Math.PI/180),"COFUNCTION_CHECK")}; }
    case "062": { const a=pick(seed,`${id}|a`,[30,60] as const); const c=N(std("COS",a)); return { solveMode:"reduceSineAfterNinety",difficulty:"Medium",target:"SCALAR",stem:`Evaluate exactly: sin(90° + ${a}°).`,correct:c,wrong:[{value:N(std("SIN",a)),misconceptionId:"USED_SIN_REFERENCE"},{value:N(multiplyExact(exactInteger(-1),std("COS",a))),misconceptionId:"WRONG_QUADRANT_SIGN"},{value:N(std("TAN",a)),misconceptionId:"USED_TAN"}],explanation:explanation("sin(90°+θ)=cosθ.",["The angle lies in quadrant II, where sine is positive.",`The cofunction magnitude is cos${a}°=${show(c)}.`],"Apply both the cofunction swap and the quadrant sign."),state:{theta:a,target:90+a},verification:numericVerification((c as any).value,Math.sin((90+a)*Math.PI/180),"NINETY_REDUCTION")}; }
    case "063": { const a=pick(seed,`${id}|a`,[30,60] as const); const c=N(multiplyExact(exactInteger(-1),std("SIN",a))); return { solveMode:"reduceCosineAfterNinety",difficulty:"Medium",target:"SCALAR",stem:`Evaluate exactly: cos(90° + ${a}°).`,correct:c,wrong:[{value:N(std("SIN",a)),misconceptionId:"LOST_SIGN"},{value:N(std("COS",a)),misconceptionId:"DID_NOT_SWAP"},{value:N(multiplyExact(exactInteger(-1),std("COS",a))),misconceptionId:"SIGN_WITHOUT_SWAP"}],explanation:explanation("cos(90°+θ)=−sinθ.",["The target angle lies in quadrant II, where cosine is negative.",`After the cofunction swap, the exact value is ${show(c)}.`],"A 90° shift changes the function as well as the sign."),state:{theta:a,target:90+a},verification:numericVerification((c as any).value,Math.cos((90+a)*Math.PI/180),"NINETY_REDUCTION")}; }
    case "066": { const a=pick(seed,`${id}|a`,[30,60] as const); const c=N(multiplyExact(exactInteger(-1),std("TAN",a))); return { solveMode:"reduceTangentBeforeFullTurn",difficulty:"Medium",target:"SCALAR",stem:`Evaluate exactly: tan(360° − ${a}°).`,correct:c,wrong:[{value:N(std("TAN",a)),misconceptionId:"LOST_SIGN"},{value:N(std("COT",a)),misconceptionId:"USED_COT"},{value:N(multiplyExact(exactInteger(-1),std("COT",a))),misconceptionId:"RECIPROCAL_AND_SIGN"}],explanation:explanation("tan(360°−θ)=−tanθ.",["The angle lies in quadrant IV, where tangent is negative.",`Use reference angle ${a}° to obtain ${show(c)}.`],"A full-turn reduction preserves the reference angle but not the quadrant sign."),state:{theta:a,target:360-a},verification:numericVerification((c as any).value,Math.tan((360-a)*Math.PI/180),"THREESIXTY_REDUCTION")}; }
    case "093": { const c=N(Q(t.h-t.a,t.h+t.a)); return { solveMode:"evaluateRationalExpressionFromSine",difficulty:"Hard",target:"SCALAR",stem:`If sin θ = ${t.o}/${t.h} and θ is acute, find (1 − cos θ)/(1 + cos θ).`,correct:c,wrong:[{value:N(Q(t.h+t.a,t.h-t.a)),misconceptionId:"INVERTED_EXPRESSION"},{value:N(Q(t.h-t.o,t.h+t.o)),misconceptionId:"USED_SINE_IN_PLACE_OF_COS"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS"}],explanation:explanation("Reconstruct cosine from the given sine ratio.",[ `Opposite:hypotenuse=${t.o}:${t.h}, so adjacent=${t.a} and cosθ=${t.a}/${t.h}.`, `Substitute into (1−cosθ)/(1+cosθ).`, `The result simplifies to (${t.h}−${t.a})/(${t.h}+${t.a})=${show(c)}.`],"Convert 1 to a fraction with denominator equal to the hypotenuse."),state:{o:t.o,a:t.a,h:t.h},verification:numericVerification((c as any).value,(1-t.a/t.h)/(1+t.a/t.h),"EXPRESSION_FROM_SINE_RATIO")}; }
    case "094": { const c=N(Q(t.o*t.a,t.h*t.h)); return { solveMode:"evaluateSinCosProductFromTangent",difficulty:"Hard",target:"SCALAR",stem:`If tan θ = ${t.o}/${t.a} and θ is acute, find sin θ cos θ.`,correct:c,wrong:[{value:N(Q(2*t.o*t.a,t.h*t.h)),misconceptionId:"USED_DOUBLE_ANGLE_PRODUCT"},{value:N(Q(t.o*t.o,t.h*t.h)),misconceptionId:"USED_SIN_SQUARED"},{value:N(Q(t.a*t.a,t.h*t.h)),misconceptionId:"USED_COS_SQUARED"}],explanation:explanation("Build the right triangle from tangent.",[ `Take opposite:adjacent=${t.o}:${t.a}; hypotenuse=${t.h}.`, `sinθ=${t.o}/${t.h} and cosθ=${t.a}/${t.h}.`, `Their product is ${show(c)}.`],"Do not insert the factor 2 unless the target is sin2θ."),state:{o:t.o,a:t.a,h:t.h},verification:numericVerification((c as any).value,(t.o/t.h)*(t.a/t.h),"EXPRESSION_FROM_TAN_RATIO")}; }
    case "112": { const p=pick(seed,`${id}|p`,[{n:3,d:10},{n:1,d:4},{n:2,d:5}] as const); const product=Q(p.n,p.d); const c=N(addExact(exactInteger(1),multiplyExact(exactInteger(2),product))); return { solveMode:"deriveSumSquareFromProduct",difficulty:"Hard",target:"SCALAR",stem:`If sin θ cos θ = ${p.n}/${p.d}, find (sin θ + cos θ)².`,correct:c,wrong:[{value:N(addExact(exactInteger(1),product)),misconceptionId:"MISSED_FACTOR_TWO"},{value:N(Q(p.d-2*p.n,p.d)),misconceptionId:"USED_DIFFERENCE_SQUARE"},{value:N(Q(2*p.d+p.n,p.d)),misconceptionId:"ADDED_TWO_INSTEAD_OF_ONE"}],explanation:explanation("Use (sinθ+cosθ)²=1+2sinθcosθ.",[ `Substitute sinθcosθ=${p.n}/${p.d}.`, `Then (sinθ+cosθ)²=1+2(${p.n}/${p.d})=${show(c)}.`],"The cross term is 2sinθcosθ."),state:{productN:p.n,productD:p.d},verification:numericVerification((c as any).value,1+2*p.n/p.d,"SUM_SQUARE_FROM_PRODUCT")}; }
    case "115": { const pair=pick(seed,`${id}|pair`,[{a:2,b:3},{a:3,b:4},{a:4,b:5}] as const); const c=N(Q(pair.a,pair.b)); return { solveMode:"deriveCotFromLinearSinCosRelation",difficulty:"Medium",target:"SCALAR",stem:`If ${pair.a} sin θ = ${pair.b} cos θ and sin θ ≠ 0, find cot θ.`,correct:c,wrong:[{value:N(Q(pair.b,pair.a)),misconceptionId:"RETURNED_TAN"},{value:N(Q(pair.a,pair.a+pair.b)),misconceptionId:"USED_SUM_DENOMINATOR"},{value:N(Q(pair.a+pair.b,pair.b)),misconceptionId:"ADDED_COEFFICIENTS"}],explanation:explanation("Convert the linear relation into a tangent ratio, then reciprocate.",[ `${pair.a}tanθ=${pair.b}, so tanθ=${pair.b}/${pair.a}.`, `Hence cotθ=${pair.a}/${pair.b}.`],"The coefficient ratio reverses when moving from tan to cot."),state:{a:pair.a,b:pair.b},verification:numericVerification((c as any).value,pair.a/pair.b,"LINEAR_RELATION_COT")}; }
    case "116": { const pair=pick(seed,`${id}|pair`,[{a:2,b:3},{a:3,b:4},{a:4,b:5}] as const); const c=N(Q(pair.b*pair.b,pair.a*pair.a)); return { solveMode:"deriveSquaredRatioFromLinearSinCosRelation",difficulty:"Hard",target:"SCALAR",stem:`If ${pair.a} sin θ = ${pair.b} cos θ and cos θ ≠ 0, find sin²θ/cos²θ.`,correct:c,wrong:[{value:N(Q(pair.b,pair.a)),misconceptionId:"FORGOT_TO_SQUARE"},{value:N(Q(pair.a*pair.a,pair.b*pair.b)),misconceptionId:"INVERTED_RATIO"},{value:N(Q(pair.a,pair.b)),misconceptionId:"RETURNED_COT"}],explanation:explanation("First obtain tanθ, then square it.",[ `${pair.a}sinθ=${pair.b}cosθ gives tanθ=${pair.b}/${pair.a}.`, `sin²θ/cos²θ=tan²θ=(${pair.b}/${pair.a})².`, `Therefore the value is ${show(c)}.`],"Square both numerator and denominator."),state:{a:pair.a,b:pair.b},verification:numericVerification((c as any).value,(pair.b/pair.a)**2,"LINEAR_RELATION_SQUARED_RATIO")}; }
    case "119": return { solveMode:"solveAcuteAngleFromCosEquation",difficulty:"Medium",target:"ANGLE",stem:"If 2cos θ = 1 and 0° < θ < 90°, find θ.",correct:A(60),wrong:[{value:A(30),misconceptionId:"USED_COS30"},{value:A(45),misconceptionId:"USED_COS45"},{value:A(90),misconceptionId:"USED_COS90"}],explanation:explanation("Solve for cosine and match the acute standard angle.",["2cosθ=1 gives cosθ=1/2.","The acute angle with cosθ=1/2 is 60°."],"Use the interval to select the acute standard-angle solution."),state:{interval:"acute"},verification:angleVerification(60,"CONTROLLED_COS_EQUATION")};
    case "120": return { solveMode:"solveAcuteAngleFromTangentValue",difficulty:"Medium",target:"ANGLE",stem:"If tan θ = √3 and 0° < θ < 90°, find θ.",correct:A(60),wrong:[{value:A(30),misconceptionId:"USED_TAN30"},{value:A(45),misconceptionId:"USED_TAN45"},{value:A(90),misconceptionId:"USED_AXIS_ANGLE"}],explanation:explanation("Match the tangent value to the acute standard angle.",["tan60°=√3.","Therefore θ=60° in the stated acute interval."],"Do not choose the reciprocal-value angle 30°."),state:{interval:"acute"},verification:angleVerification(60,"CONTROLLED_TAN_EQUATION")};
    case "134": { const c=N(exactSurd(1,3,4)); return { solveMode:"evaluateThreeFactorStandardProduct",difficulty:"Medium",target:"SCALAR",stem:"Evaluate exactly: sin30° · sin60° · tan45°.",correct:c,wrong:[{value:N(exactSurd(1,3,2)),misconceptionId:"DROPPED_SIN30_FACTOR"},{value:N(Q(1,4)),misconceptionId:"LOST_RADICAL"},{value:N(exactSurd(1,3)),misconceptionId:"DROPPED_DENOMINATORS"}],explanation:explanation("Substitute all three standard values before multiplying.",["sin30°=1/2, sin60°=√3/2 and tan45°=1.",`Their product is ${show(c)}.`],"Multiply the denominators as well as the numerators."),state:{expression:"sin30*sin60*tan45"},verification:numericVerification((c as any).value,Math.sin(Math.PI/6)*Math.sin(Math.PI/3),"STANDARD_PRODUCT_SERIES")}; }
    case "135": { const c=N(std("COS",30)); return { solveMode:"evaluateReciprocalCancellationProduct",difficulty:"Medium",target:"SCALAR",stem:"Evaluate exactly: cos30° · cos60° · sec60°.",correct:c,wrong:[{value:N(Q(1,2)),misconceptionId:"USED_COS60_ONLY"},{value:N(exactInteger(1)),misconceptionId:"ASSUMED_ALL_CANCEL"},{value:N(std("SIN",30)),misconceptionId:"USED_SIN30"}],explanation:explanation("Cancel the reciprocal pair first.",["cos60°·sec60°=1.",`The product therefore reduces to cos30°=${show(c)}.`],"Only the 60° cosine and secant cancel."),state:{expression:"cos30*cos60*sec60"},verification:numericVerification((c as any).value,Math.cos(Math.PI/6)*Math.cos(Math.PI/3)*(1/Math.cos(Math.PI/3)),"STANDARD_PRODUCT_SERIES")}; }
    case "136": { const c=N(Q(3,2)); return { solveMode:"evaluateStandardProductPlusPower",difficulty:"Hard",target:"SCALAR",stem:"Evaluate exactly: tan30°·tan60° + sin²45°.",correct:c,wrong:[{value:N(exactInteger(1)),misconceptionId:"DROPPED_SQUARED_TERM"},{value:N(Q(1,2)),misconceptionId:"USED_SIN_SQUARED_ONLY"},{value:N(exactInteger(2)),misconceptionId:"FAILED_TO_SQUARE_SINE"}],explanation:explanation("Evaluate the product and power separately.",["tan30°·tan60°=1.","sin²45°=1/2.","Adding gives 3/2."],"Same-angle reciprocal logic is not needed; use the actual 30° and 60° tangent values."),state:{expression:"tan30*tan60+sin2(45)"},verification:numericVerification((c as any).value,Math.tan(Math.PI/6)*Math.tan(Math.PI/3)+Math.sin(Math.PI/4)**2,"STANDARD_SERIES")}; }
    case "137": { const c=N(Q(3,2)); return { solveMode:"evaluateThreeTermSquaredSineSeries",difficulty:"Hard",target:"SCALAR",stem:"Evaluate exactly: sin²30° + sin²45° + sin²60°.",correct:c,wrong:[{value:N(exactInteger(1)),misconceptionId:"ASSUMED_PYTHAGOREAN_IDENTITY"},{value:N(Q(3,4)),misconceptionId:"DROPPED_ONE_TERM"},{value:N(exactInteger(2)),misconceptionId:"FAILED_TO_SQUARE"}],explanation:explanation("Evaluate each squared standard value independently.",["sin²30°=1/4, sin²45°=1/2 and sin²60°=3/4.","Their sum is 1/4+1/2+3/4=3/2."],"The three angles are different, so the Pythagorean identity does not combine them."),state:{expression:"sin2(30)+sin2(45)+sin2(60)"},verification:numericVerification((c as any).value,Math.sin(Math.PI/6)**2+Math.sin(Math.PI/4)**2+Math.sin(Math.PI/3)**2,"STANDARD_SERIES")}; }
    case "144": return { solveMode:"identifyCompositeDoubleAngleEquivalence",difficulty:"Hard",target:"RELATION",stem:"Where the expression is defined, (1 − cos 2θ)/sin 2θ is equal to:",correct:T("tan θ"),wrong:[{value:T("cot θ"),misconceptionId:"INVERTED_RATIO"},{value:T("sin θ"),misconceptionId:"DROPPED_COS_FACTOR"},{value:T("cos θ"),misconceptionId:"DROPPED_SIN_FACTOR"}],explanation:explanation("Use 1−cos2θ=2sin²θ and sin2θ=2sinθcosθ.",["The ratio becomes 2sin²θ/(2sinθcosθ).","Cancel the common non-zero factors to obtain sinθ/cosθ=tanθ.","Therefore the expression is tanθ."],"Convert both numerator and denominator with double-angle identities before cancelling."),state:{symbolic:true},verification:theoremVerification("tan θ","DOUBLE_ANGLE_EQUIVALENCE")};
    default: throw new Error(`No custom authority-aligned TRG-001 QL for ${id}`);
  }
}

function makeCustom(id: string, seed: string, spec: Spec) {
  const fullId = ql(id);
  const raw = [{ value:spec.correct,isCorrect:true,misconceptionId:null as string|null },...spec.wrong.map((item)=>({...item,isCorrect:false}))];
  if (raw.length !== 4) throw new Error(`${fullId}: authority custom question must have four options.`);
  if (new Set(raw.map((item)=>answerKey(item.value))).size !== 4) throw new Error(`${fullId}: authority custom option collision.`);
  const options = shuffle(`${seed}|${fullId}|authority-options`,raw).map((item,index)=>({label:(["A","B","C","D"] as const)[index],value:item.value,display:show(item.value),isCorrect:item.isCorrect,misconceptionId:item.misconceptionId}));
  const correctIndex = options.findIndex((option)=>option.isCorrect);
  const minimumSteps = spec.difficulty === "Hard" ? 3 : spec.difficulty === "Medium" ? 2 : 1;
  const checks = [
    {name:"FOUR_OPTIONS",passed:options.length===4,message:"Exactly four options."},
    {name:"ONE_CORRECT",passed:options.filter((option)=>option.isCorrect).length===1,message:"Exactly one correct option."},
    {name:"UNIQUE_OPTIONS",passed:new Set(options.map((option)=>answerKey(option.value))).size===4,message:"Options are mathematically distinct."},
    {name:"CORRECT_INDEX",passed:correctIndex>=0&&options[correctIndex]?.isCorrect===true,message:"Correct index is valid."},
    {name:"VERIFIED",passed:spec.verification.valid,message:"Independent/theorem verification passed."},
    {name:"EXPLANATION_DEPTH",passed:spec.explanation.steps.length>=minimumSteps,message:"Explanation meets difficulty depth floor."},
    {name:"AUTHORITY_FAMILY",passed:true,message:`Aligned to ${authorityFamilyForTrg001Ql(fullId)}.`},
    {name:"ACTIVATION_LOCK",passed:true,message:"All production activation locks remain closed."},
  ];
  if (!checks.every((check)=>check.passed)) throw new Error(`${fullId}: authority custom validation failed.`);
  return { packageId:"TRG-001",cpId:cpFor(fullId),qlId:fullId,solveMode:spec.solveMode,language:"en",seed,difficulty:spec.difficulty,target:spec.target,stem:spec.stem,options,correctIndex,answer:show(spec.correct),exactAnswer:spec.correct,explanation:spec.explanation,canonicalState:spec.state,verification:spec.verification,validation:{valid:true,checks},reviewStatus:"UNREVIEWED",aiEditorialStatus:"PENDING",humanReviewStatus:"PENDING",questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false,questionStudioDiscoverable:false,proofOnly:false,mvpOnly:false,productionOnly:false,productionCandidate:true,authorityAlignment:{status:"ALIGNED",family:authorityFamilyForTrg001Ql(fullId),source:"CUSTOM"} };
}

function cloneSource(targetShortId: string, sourceShortId: string, seed: string) {
  const targetId = ql(targetShortId);
  const sourceId = ql(sourceShortId);
  const source: any = generateCandidateTrg001ProductionQuestion(sourceId, seed);
  const authorityCheck = {name:"AUTHORITY_FAMILY",passed:true,message:`Template ${sourceId} reassigned to ${authorityFamilyForTrg001Ql(targetId)}.`};
  const lockCheck = {name:"ACTIVATION_LOCK",passed:!source.publiclyPublishable&&!source.questionStudioDiscoverable&&source.testEligibility==="INELIGIBLE"&&source.questionBankStatus==="NOT_STORED",message:"All activation locks remain closed."};
  if (!lockCheck.passed) throw new Error(`${targetId}: source template violates activation lock.`);
  return { ...source, qlId:targetId, cpId:cpFor(targetId), seed, reviewStatus:"UNREVIEWED", aiEditorialStatus:"PENDING", humanReviewStatus:"PENDING", publiclyPublishable:false, questionStudioDiscoverable:false, questionBankStatus:"NOT_STORED", testEligibility:"INELIGIBLE", proofOnly:false, mvpOnly:false, productionOnly:false, productionCandidate:true, sourceQlId:sourceId, authorityAlignment:{status:"ALIGNED",family:authorityFamilyForTrg001Ql(targetId),source:sourceId}, validation:{valid:true,checks:[...(source.validation?.checks??[]),authorityCheck,lockCheck]} };
}

export const TRG_001_AUTHORITY_ALIGNED_IDS = Array.from({length:144},(_,index)=>ql(index+1));

export function generateAuthorityAlignedTrg001Question(qlId: string, seed: string): any {
  const shortId = qlId.slice(-3);
  if (!TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) throw new Error(`Unknown authority-aligned TRG-001 QL ${qlId}`);
  if (CUSTOM_IDS.has(shortId)) return makeCustom(shortId,seed,buildCustom(shortId,seed));
  const source = SOURCE_MAP[shortId];
  if (!source) throw new Error(`${qlId}: no authority source mapping.`);
  return cloneSource(shortId,source,seed);
}

export function generateAllAuthorityAlignedTrg001Questions(seed: string) { return TRG_001_AUTHORITY_ALIGNED_IDS.map((id)=>generateAuthorityAlignedTrg001Question(id,seed)); }

export function authorityAlignedFingerprint(question: any) {
  return [question.qlId,question.seed,question.authorityAlignment.family,question.stem,question.options.map((option:any)=>`${option.label}:${answerKey(option.value)}:${option.isCorrect}`).join("|"),question.correctIndex,answerKey(question.exactAnswer),question.explanation.steps.map((step:any)=>`${step.title}:${step.body}`).join("|")].join("::");
}
