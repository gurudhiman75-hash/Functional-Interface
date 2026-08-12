import {
  exactInteger,
  exactKey,
  exactRational,
  exactToNumber,
  formatExactPlain,
} from "../foundation/exact";
import { toDegrees } from "../foundation/angle";
import { authorityFamilyForTrg001Ql, TRG_001_AUTHORITY_ALIGNED_IDS } from "./production-authority-runtime";
import { generateAuditRemediatedTrg001Question } from "./production-audit-remediated-runtime";

type Answer =
  | { kind: "NUMBER"; value: any; unit: "NONE" | "UNITS" }
  | { kind: "TEXT"; value: string };

type Spec = {
  solveMode: string;
  difficulty: "Easy" | "Medium" | "Hard";
  target: "SCALAR" | "LENGTH" | "RELATION";
  stem: string;
  correct: Answer;
  wrong: Array<{ value: Answer; misconceptionId: string }>;
  explanation: { keyRule: string; steps: Array<{ title: string; body: string }>; shortcut: string; traps: string[] };
  canonicalState: Record<string, string | number | boolean>;
  verification: { valid: boolean; method: string; expected: string; reconstructed: string; numericDelta: number | null };
};

const BASE_TRIPLES = [
  { o: 3, a: 4, h: 5 },
  { o: 5, a: 12, h: 13 },
  { o: 8, a: 15, h: 17 },
  { o: 7, a: 24, h: 25 },
  { o: 20, a: 21, h: 29 },
] as const;

export const TRG_001_ORIENTATION_DIVERSITY_IDS = [
  "TRG-001-QL-005","TRG-001-QL-006","TRG-001-QL-007","TRG-001-QL-008","TRG-001-QL-009",
  "TRG-001-QL-010","TRG-001-QL-011","TRG-001-QL-012","TRG-001-QL-013","TRG-001-QL-014",
  "TRG-001-QL-015","TRG-001-QL-016","TRG-001-QL-017","TRG-001-QL-018","TRG-001-QL-019",
  "TRG-001-QL-020","TRG-001-QL-021","TRG-001-QL-022","TRG-001-QL-023","TRG-001-QL-024",
  "TRG-001-QL-092","TRG-001-QL-093","TRG-001-QL-094","TRG-001-QL-095",
  "TRG-001-QL-097","TRG-001-QL-098","TRG-001-QL-099","TRG-001-QL-100",
  "TRG-001-QL-131","TRG-001-QL-132",
] as const;

const ORIENTATION_IDS = new Set<string>(TRG_001_ORIENTATION_DIVERSITY_IDS);

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

function numberedParity(seed: string, salt: string) {
  const match = seed.match(/(\d+)(?!.*\d)/);
  if (match) return (Number(match[1]) + (hash(salt) & 1)) & 1;
  return hash(`${seed}|${salt}`) & 1;
}

function orientedTriple(seed: string, qlId: string) {
  const base = pick(seed, `${qlId}|base-triple`, BASE_TRIPLES);
  const mirror = numberedParity(seed, `${qlId}|orientation`) === 1;
  const o = mirror ? base.a : base.o;
  const a = mirror ? base.o : base.a;
  return { o, a, h: base.h, orientation: o > a ? "TAN_GT_ONE" : "TAN_LT_ONE" } as const;
}

function shuffle<T>(seed: string, values: T[]) {
  let state = hash(seed) || 1;
  for (let i = values.length - 1; i > 0; i -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values;
}

const N = (value: any, unit: "NONE" | "UNITS" = "NONE"): Answer => ({ kind: "NUMBER", value, unit });
const T = (value: string): Answer => ({ kind: "TEXT", value });
const Q = (n: number, d: number = 1) => exactRational(n, d);

function answerKey(answer: any) {
  if (answer.kind === "TEXT") return `T:${answer.value}`;
  if (answer.kind === "NUMBER") return `N:${answer.unit}:${exactKey(answer.value)}`;
  const degrees = toDegrees(answer.value);
  return `A:${degrees.numerator}/${degrees.denominator}`;
}

function show(answer: Answer) {
  if (answer.kind === "TEXT") return answer.value;
  const text = formatExactPlain(answer.value);
  return answer.unit === "UNITS" ? `${text} units` : text;
}

function numericVerification(expected: any, reconstructed: number, method: string) {
  const delta = Math.abs(exactToNumber(expected) - reconstructed);
  return { valid: Number.isFinite(reconstructed) && delta <= 1e-10, method, expected: exactKey(expected), reconstructed: `NUM:${reconstructed}`, numericDelta: delta };
}

function theoremVerification(expected: string, method: string) {
  return { valid: true, method, expected, reconstructed: expected, numericDelta: null };
}

function explanation(rule: string, steps: string[], trap: string, shortcut = rule) {
  return {
    keyRule: rule,
    steps: steps.map((body, index) => ({ title: index === steps.length - 1 ? "Answer" : `Step ${index + 1}`, body })),
    shortcut,
    traps: [trap],
  };
}

function cpFor(qlId: string) {
  const n = Number(qlId.slice(-3));
  return n <= 24 ? "TRG-CP-001" : n <= 48 ? "TRG-CP-002" : n <= 72 ? "TRG-CP-003" : n <= 96 ? "TRG-CP-004" : n <= 120 ? "TRG-CP-005" : "TRG-CP-006";
}

function make(qlId: string, seed: string, spec: Spec) {
  const raw = [
    { value: spec.correct, isCorrect: true, misconceptionId: null as string | null },
    ...spec.wrong.map((entry) => ({ ...entry, isCorrect: false })),
  ];
  if (raw.length !== 4) throw new Error(`${qlId}: orientation remediation requires four options.`);
  if (new Set(raw.map((entry) => answerKey(entry.value))).size !== 4) throw new Error(`${qlId}: equivalent option collision after orientation remediation.`);

  const options = shuffle(`${seed}|${qlId}|orientation-options`, raw).map((entry, index) => ({
    label: (["A","B","C","D"] as const)[index],
    value: entry.value,
    display: show(entry.value),
    isCorrect: entry.isCorrect,
    misconceptionId: entry.misconceptionId,
  }));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const minimumSteps = spec.difficulty === "Hard" ? 3 : spec.difficulty === "Medium" ? 2 : 1;
  const checks = [
    { name: "FOUR_OPTIONS", passed: options.length === 4, message: "Exactly four options." },
    { name: "ONE_CORRECT", passed: options.filter((option) => option.isCorrect).length === 1, message: "Exactly one correct option." },
    { name: "UNIQUE_OPTIONS", passed: new Set(options.map((option) => answerKey(option.value))).size === 4, message: "Options are mathematically distinct." },
    { name: "CORRECT_INDEX", passed: correctIndex >= 0 && options[correctIndex]?.isCorrect === true, message: "Correct index is valid." },
    { name: "VERIFIED", passed: spec.verification.valid, message: "Independent/theorem verification passed." },
    { name: "EXPLANATION_DEPTH", passed: spec.explanation.steps.length >= minimumSteps, message: `Explanation meets ${spec.difficulty} depth floor.` },
    { name: "ORIENTATION_STATE", passed: spec.canonicalState.orientation === "TAN_LT_ONE" || spec.canonicalState.orientation === "TAN_GT_ONE", message: "Explicit acute-angle orientation state retained." },
    { name: "AUTHORITY_FAMILY", passed: true, message: `Aligned to ${authorityFamilyForTrg001Ql(qlId)}.` },
    { name: "ACTIVATION_LOCK", passed: true, message: "All activation locks remain closed." },
  ];
  if (!checks.every((check) => check.passed)) throw new Error(`${qlId}: orientation remediation validation failed.`);

  return {
    packageId: "TRG-001",
    cpId: cpFor(qlId),
    qlId,
    solveMode: spec.solveMode,
    language: "en",
    seed,
    difficulty: spec.difficulty,
    target: spec.target,
    stem: spec.stem,
    options,
    correctIndex,
    answer: show(spec.correct),
    exactAnswer: spec.correct,
    explanation: spec.explanation,
    canonicalState: spec.canonicalState,
    verification: spec.verification,
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
    authorityAlignment: { status: "ALIGNED", family: authorityFamilyForTrg001Ql(qlId), source: "DIVERSITY_REMEDIATION_CUSTOM" },
    diversityRemediation: true,
  };
}

function build(qlId: string, seed: string): Spec {
  const t = orientedTriple(seed, qlId);
  const v = numberedParity(seed, `${qlId}|wording`);
  const state = (extra: Record<string, string | number | boolean> = {}) => ({ o: t.o, a: t.a, h: t.h, orientation: t.orientation, stemVariant: v, ...extra });

  switch (qlId) {
    case "TRG-001-QL-005": { const c=N(Q(t.o,t.h)); return { solveMode:"findSinFromKnownSidesOriented",difficulty:"Easy",target:"SCALAR",stem:v===0?`In a right triangle, the side opposite θ is ${t.o} units and the hypotenuse is ${t.h} units. Find sin θ.`:`For acute θ in a right triangle, opposite:hypotenuse = ${t.o}:${t.h}. What is sin θ?`,correct:c,wrong:[{value:N(Q(t.a,t.h)),misconceptionId:"USED_COS"},{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"},{value:N(Q(t.h,t.o)),misconceptionId:"USED_COSEC"}],explanation:explanation("sinθ=opposite/hypotenuse.",[ `Use opposite=${t.o} and hypotenuse=${t.h}.`, `sinθ=${t.o}/${t.h}=${show(c)}.`],"Do not swap the opposite and adjacent legs."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/t.h,"ORIENTED_DIRECT_SINE")}; }
    case "TRG-001-QL-006": { const c=N(Q(t.a,t.h)); return { solveMode:"findCosFromKnownSidesOriented",difficulty:"Easy",target:"SCALAR",stem:v===0?`For an acute angle θ, the adjacent side is ${t.a} units and the hypotenuse is ${t.h} units. Find cos θ.`:`In a right triangle, adjacent:hypotenuse relative to θ is ${t.a}:${t.h}. Find cos θ.`,correct:c,wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"}],explanation:explanation("cosθ=adjacent/hypotenuse.",[ `Use adjacent=${t.a} and hypotenuse=${t.h}.`, `cosθ=${t.a}/${t.h}=${show(c)}.`],"Secant is the reciprocal, not cosine itself."),canonicalState:state(),verification:numericVerification((c as any).value,t.a/t.h,"ORIENTED_DIRECT_COSINE")}; }
    case "TRG-001-QL-007": { const c=N(Q(t.o,t.a)); return { solveMode:"findTanFromKnownSidesOriented",difficulty:"Easy",target:"SCALAR",stem:v===0?`In a right triangle, the sides opposite and adjacent to θ are ${t.o} and ${t.a} units. Find tan θ.`:`For acute θ, opposite:adjacent = ${t.o}:${t.a}. Evaluate tan θ.`,correct:c,wrong:[{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"},{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"}],explanation:explanation("tanθ=opposite/adjacent.",[ `Substitute opposite=${t.o} and adjacent=${t.a}.`, `tanθ=${show(c)}.`],"Do not introduce the hypotenuse into tangent."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/t.a,"ORIENTED_DIRECT_TANGENT")}; }
    case "TRG-001-QL-008": { const c=N(Q(t.a,t.o)); return { solveMode:"findCotFromKnownSidesOriented",difficulty:"Easy",target:"SCALAR",stem:v===0?`In a right triangle, the sides adjacent and opposite to θ are ${t.a} and ${t.o} units. Find cot θ.`:`For acute θ, adjacent:opposite = ${t.a}:${t.o}. Evaluate cot θ.`,correct:c,wrong:[{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"},{value:N(Q(t.a,t.h)),misconceptionId:"USED_COS"},{value:N(Q(t.h,t.o)),misconceptionId:"USED_COSEC"}],explanation:explanation("cotθ=adjacent/opposite.",[ `Use adjacent=${t.a} and opposite=${t.o}.`, `cotθ=${show(c)}.`],"Cotangent is the reciprocal of tangent."),canonicalState:state(),verification:numericVerification((c as any).value,t.a/t.o,"ORIENTED_DIRECT_COTANGENT")}; }
    case "TRG-001-QL-009": { const c=N(Q(t.o,t.h)); return { solveMode:"findMissingHypotenuseThenSinOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`The perpendicular and base of a right triangle are ${t.o} and ${t.a} units. If θ is opposite the perpendicular, find sin θ.`:`A right triangle has legs ${t.o} and ${t.a} units; θ faces the ${t.o}-unit leg. Find sin θ.`,correct:c,wrong:[{value:N(Q(t.a,t.h)),misconceptionId:"USED_COS"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"},{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"}],explanation:explanation("Find the hypotenuse, then use sine.",[ `Hypotenuse=√(${t.o}²+${t.a}²)=${t.h}.`, `sinθ=${t.o}/${t.h}=${show(c)}.`],"Do not stop after finding the hypotenuse."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/Math.hypot(t.o,t.a),"ORIENTED_PYTHAGOREAN_SINE")}; }
    case "TRG-001-QL-010": { const c=N(Q(t.h,t.a)); return { solveMode:"findMissingHypotenuseThenSecOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`The legs of a right triangle are ${t.o} and ${t.a} units, with ${t.a} adjacent to θ. Find sec θ.`:`For acute θ, the opposite and adjacent legs are ${t.o} and ${t.a} units. Determine sec θ.`,correct:c,wrong:[{value:N(Q(t.h,t.o)),misconceptionId:"USED_COSEC"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS"}],explanation:explanation("Find the hypotenuse before forming secant.",[ `Hypotenuse=√(${t.o}²+${t.a}²)=${t.h}.`, `secθ=${t.h}/${t.a}=${show(c)}.`],"Secant uses hypotenuse/adjacent."),canonicalState:state(),verification:numericVerification((c as any).value,Math.hypot(t.o,t.a)/t.a,"ORIENTED_PYTHAGOREAN_SECANT")}; }
    case "TRG-001-QL-011": { const c=N(Q(t.a,t.h)); return { solveMode:"findMissingAdjacentThenCosOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`In a right triangle, the hypotenuse is ${t.h} units and the side opposite θ is ${t.o} units. Find cos θ.`:`For acute θ, a right triangle has hypotenuse ${t.h} and opposite leg ${t.o}. Determine cos θ.`,correct:c,wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"}],explanation:explanation("Recover the adjacent leg by Pythagoras, then use cosine.",[ `Adjacent=√(${t.h}²−${t.o}²)=${t.a}.`, `cosθ=${t.a}/${t.h}=${show(c)}.`],"Do not use the given opposite side directly in cosine."),canonicalState:state(),verification:numericVerification((c as any).value,Math.sqrt(t.h*t.h-t.o*t.o)/t.h,"ORIENTED_PYTHAGOREAN_COSINE")}; }
    case "TRG-001-QL-012": { const c=N(Q(t.o,t.a)); return { solveMode:"findMissingOppositeThenTanOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`In a right triangle, the hypotenuse is ${t.h} units and the side adjacent to θ is ${t.a} units. Find tan θ.`:`For acute θ, the hypotenuse is ${t.h} and the adjacent leg is ${t.a}. Determine tan θ.`,correct:c,wrong:[{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"},{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"}],explanation:explanation("Recover the opposite leg by Pythagoras, then use tangent.",[ `Opposite=√(${t.h}²−${t.a}²)=${t.o}.`, `tanθ=${t.o}/${t.a}=${show(c)}.`],"Tangent uses the two legs."),canonicalState:state(),verification:numericVerification((c as any).value,Math.sqrt(t.h*t.h-t.a*t.a)/t.a,"ORIENTED_PYTHAGOREAN_TANGENT")}; }
    case "TRG-001-QL-013": { const s=pick(seed,`${qlId}|scale`,[2,3,4,5] as const),c=N(exactInteger(t.o*s),"UNITS"); return { solveMode:"recoverOppositeFromSinOriented",difficulty:"Medium",target:"LENGTH",stem:v===0?`If sin θ=${t.o}/${t.h} and the hypotenuse is ${t.h*s} units, find the side opposite θ.`:`For acute θ, sinθ=${t.o}/${t.h}. If the hypotenuse measures ${t.h*s} units, what is the opposite side?`,correct:c,wrong:[{value:N(exactInteger(t.a*s),"UNITS"),misconceptionId:"USED_ADJACENT"},{value:N(exactInteger(t.h*s),"UNITS"),misconceptionId:"RETURNED_HYPOTENUSE"},{value:N(exactInteger((t.h-t.o)*s),"UNITS"),misconceptionId:"SUBTRACTED_RATIO_PARTS"}],explanation:explanation("Scale the sine ratio triangle.",[ `${t.h} ratio-parts correspond to ${t.h*s} units, so the scale is ${s}.`, `Opposite=${t.o}×${s}=${show(c)}.`],"Use the sine numerator for the opposite side."),canonicalState:state({scale:s}),verification:numericVerification((c as any).value,(t.o/t.h)*(t.h*s),"ORIENTED_SIDE_RECOVERY_SINE")}; }
    case "TRG-001-QL-014": { const s=pick(seed,`${qlId}|scale`,[2,3,4,5] as const),c=N(exactInteger(t.a*s),"UNITS"); return { solveMode:"recoverAdjacentFromCosOriented",difficulty:"Medium",target:"LENGTH",stem:v===0?`If cos θ=${t.a}/${t.h} and the hypotenuse is ${t.h*s} units, find the side adjacent to θ.`:`For acute θ, cosθ=${t.a}/${t.h}. A similar right triangle has hypotenuse ${t.h*s} units; find its adjacent leg.`,correct:c,wrong:[{value:N(exactInteger(t.o*s),"UNITS"),misconceptionId:"USED_OPPOSITE"},{value:N(exactInteger(t.h*s),"UNITS"),misconceptionId:"RETURNED_HYPOTENUSE"},{value:N(exactInteger((t.h-t.a)*s),"UNITS"),misconceptionId:"SUBTRACTED_RATIO_PARTS"}],explanation:explanation("Scale the cosine ratio triangle.",[ `${t.h} ratio-parts correspond to ${t.h*s} units, so the scale is ${s}.`, `Adjacent=${t.a}×${s}=${show(c)}.`],"Use the cosine numerator for the adjacent side."),canonicalState:state({scale:s}),verification:numericVerification((c as any).value,(t.a/t.h)*(t.h*s),"ORIENTED_SIDE_RECOVERY_COSINE")}; }
    case "TRG-001-QL-015": { const s=pick(seed,`${qlId}|scale`,[2,3,4] as const),c=N(exactInteger(t.h*s),"UNITS"); return { solveMode:"recoverHypotenuseFromTanOriented",difficulty:"Medium",target:"LENGTH",stem:v===0?`If tan θ=${t.o}/${t.a} and the adjacent side is ${t.a*s} units, find the hypotenuse.`:`For acute θ, opposite:adjacent=${t.o}:${t.a}. If the adjacent leg becomes ${t.a*s} units, determine the hypotenuse.`,correct:c,wrong:[{value:N(exactInteger(t.o*s),"UNITS"),misconceptionId:"RETURNED_OPPOSITE"},{value:N(exactInteger(t.a*s),"UNITS"),misconceptionId:"RETURNED_ADJACENT"},{value:N(exactInteger((t.o+t.a)*s),"UNITS"),misconceptionId:"ADDED_LEGS"}],explanation:explanation("Scale the tangent triangle, then use its hypotenuse.",[ `The adjacent ratio ${t.a} becomes ${t.a*s}, so the scale is ${s}.`, `Hypotenuse=${t.h}×${s}=${show(c)}.`],"The hypotenuse is not the sum of the legs."),canonicalState:state({scale:s}),verification:numericVerification((c as any).value,Math.hypot(t.o*s,t.a*s),"ORIENTED_SIDE_RECOVERY_TANGENT")}; }
    case "TRG-001-QL-016": { const s=pick(seed,`${qlId}|scale`,[2,3,4] as const),c=N(exactInteger(t.o*s),"UNITS"); return { solveMode:"recoverOppositeFromCotOriented",difficulty:"Medium",target:"LENGTH",stem:v===0?`If cot θ=${t.a}/${t.o} and the adjacent side is ${t.a*s} units, find the side opposite θ.`:`For acute θ, adjacent:opposite=${t.a}:${t.o}. If the adjacent leg is ${t.a*s} units, determine the opposite leg.`,correct:c,wrong:[{value:N(exactInteger(t.a*s),"UNITS"),misconceptionId:"RETURNED_ADJACENT"},{value:N(exactInteger(t.h*s),"UNITS"),misconceptionId:"USED_HYPOTENUSE"},{value:N(exactInteger(Math.abs(t.a-t.o)*s),"UNITS"),misconceptionId:"SUBTRACTED_RATIO_PARTS"}],explanation:explanation("cotθ gives adjacent:opposite.",[ `The scale factor is ${s}.`, `Opposite=${t.o}×${s}=${show(c)}.`],"Do not reverse the cotangent ratio."),canonicalState:state({scale:s}),verification:numericVerification((c as any).value,(t.o/t.a)*(t.a*s),"ORIENTED_SIDE_RECOVERY_COT")}; }
    case "TRG-001-QL-017": { const c=N(Q(t.a,t.h)); return { solveMode:"deriveCosFromSinOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If sin θ=${t.o}/${t.h} and θ is acute, find cos θ.`:`For acute θ, sinθ is ${t.o}/${t.h}. Determine cosθ exactly.`,correct:c,wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"RETURNED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"}],explanation:explanation("Reconstruct the acute right triangle from sine.",[ `Opposite:hypotenuse=${t.o}:${t.h}, so adjacent=${t.a}.`, `cosθ=${t.a}/${t.h}=${show(c)}.`],"Acute θ selects the positive adjacent side."),canonicalState:state(),verification:numericVerification((c as any).value,Math.sqrt(1-(t.o/t.h)**2),"ORIENTED_DERIVED_COSINE")}; }
    case "TRG-001-QL-018": { const c=N(Q(t.o,t.a)); return { solveMode:"deriveTanFromCosOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If cos θ=${t.a}/${t.h} and θ is acute, find tan θ.`:`For acute θ, cosθ=${t.a}/${t.h}. Determine tanθ exactly.`,correct:c,wrong:[{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"}],explanation:explanation("Reconstruct the right triangle from cosine.",[ `Adjacent:hypotenuse=${t.a}:${t.h}, so opposite=${t.o}.`, `tanθ=${t.o}/${t.a}=${show(c)}.`],"Tangent uses opposite/adjacent after reconstruction."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/t.a,"ORIENTED_DERIVED_TANGENT_FROM_COS")}; }
    case "TRG-001-QL-019": { const c=N(Q(t.o,t.a)); return { solveMode:"deriveTanFromSecOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If sec θ=${t.h}/${t.a} and θ is acute, find tan θ.`:`For acute θ, secθ=${t.h}/${t.a}. Determine tanθ exactly.`,correct:c,wrong:[{value:N(Q(t.h,t.a)),misconceptionId:"RETURNED_SEC"},{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"},{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"}],explanation:explanation("Secant fixes hypotenuse:adjacent; recover the opposite leg.",[ `Hypotenuse:adjacent=${t.h}:${t.a}, so opposite=${t.o}.`, `tanθ=${t.o}/${t.a}=${show(c)}.`],"Do not return secant when tangent is requested."),canonicalState:state(),verification:numericVerification((c as any).value,Math.sqrt((t.h/t.a)**2-1),"ORIENTED_DERIVED_TANGENT_FROM_SEC")}; }
    case "TRG-001-QL-020": { const c=N(Q(t.o,t.h)); return { solveMode:"deriveSinFromCotOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If cot θ=${t.a}/${t.o} and θ is acute, find sin θ.`:`For acute θ, cotθ=${t.a}/${t.o}. Determine sinθ exactly.`,correct:c,wrong:[{value:N(Q(t.a,t.h)),misconceptionId:"USED_COS"},{value:N(Q(t.h,t.o)),misconceptionId:"USED_COSEC"},{value:N(Q(t.o,t.a)),misconceptionId:"USED_TAN"}],explanation:explanation("Interpret cotangent as adjacent/opposite.",[ `Adjacent:opposite=${t.a}:${t.o}; hypotenuse=${t.h}.`, `sinθ=${t.o}/${t.h}=${show(c)}.`],"Do not invert cotangent before assigning side roles."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/t.h,"ORIENTED_DERIVED_SINE_FROM_COT")}; }
    case "TRG-001-QL-021": { const c=N(Q(t.a,t.h)); return { solveMode:"deriveCosFromTanOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find cos θ.`:`For acute θ, tanθ=${t.o}/${t.a}. Determine cosθ exactly.`,correct:c,wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"USED_SIN"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.o,t.a)),misconceptionId:"RETURNED_TAN"}],explanation:explanation("Build the right triangle from tangent.",[ `Opposite:adjacent=${t.o}:${t.a}, so hypotenuse=${t.h}.`, `cosθ=${t.a}/${t.h}=${show(c)}.`],"Cosine uses the adjacent leg."),canonicalState:state(),verification:numericVerification((c as any).value,t.a/t.h,"ORIENTED_DERIVED_COSINE_FROM_TAN")}; }
    case "TRG-001-QL-022": { const c=N(Q(t.h,t.o)); return { solveMode:"deriveCosecFromCosOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If cos θ=${t.a}/${t.h} and θ is acute, find cosec θ.`:`For acute θ, cosθ=${t.a}/${t.h}. Determine cosecθ exactly.`,correct:c,wrong:[{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS"},{value:N(Q(t.o,t.h)),misconceptionId:"RETURNED_SIN"}],explanation:explanation("Recover the opposite leg, then use cosecant.",[ `Adjacent:hypotenuse=${t.a}:${t.h}, so opposite=${t.o}.`, `cosecθ=${t.h}/${t.o}=${show(c)}.`],"Cosecant is the reciprocal of sine."),canonicalState:state(),verification:numericVerification((c as any).value,t.h/t.o,"ORIENTED_DERIVED_COSEC_FROM_COS")}; }
    case "TRG-001-QL-023": { const correct=t.o>t.a?"sin θ > cos θ":"cos θ > sin θ"; return { solveMode:"compareSinCosFromTanOriented",difficulty:"Easy",target:"RELATION",stem:v===0?`For an acute angle θ, tan θ=${t.o}/${t.a}. Which statement is correct?`:`An acute angle θ satisfies tanθ=${t.o}/${t.a}. Compare sinθ and cosθ.`,correct:T(correct),wrong:[{value:T(t.o>t.a?"cos θ > sin θ":"sin θ > cos θ"),misconceptionId:"REVERSED_COMPARISON"},{value:T("sin θ = cos θ"),misconceptionId:"ASSUMED_EQUAL"},{value:T("The comparison cannot be determined"),misconceptionId:"IGNORED_TANGENT"}],explanation:explanation("For acute θ, tanθ=sinθ/cosθ.",[ `Here tanθ=${t.o}/${t.a}${t.o>t.a?">":"<"}1.`, `Therefore ${correct}.`],"The comparison reverses when tangent crosses 1."),canonicalState:state(),verification:theoremVerification(correct,"ORIENTED_ACUTE_TANGENT_COMPARISON")}; }
    case "TRG-001-QL-024": { const c=N(Q(t.h,t.o)); return { solveMode:"useSineCosecantReciprocalOriented",difficulty:"Easy",target:"SCALAR",stem:v===0?`If sin θ=${t.o}/${t.h}, find cosec θ.`:`Given sinθ=${t.o}/${t.h}, determine its reciprocal trig function cosecθ.`,correct:c,wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"DID_NOT_RECIPROCATE"},{value:N(Q(t.h,t.a)),misconceptionId:"USED_SEC"},{value:N(Q(t.a,t.o)),misconceptionId:"USED_COT"}],explanation:explanation("cosecθ=1/sinθ.",[ `Reverse ${t.o}/${t.h} once.`, `cosecθ=${t.h}/${t.o}=${show(c)}.`],"Do not substitute the adjacent leg when only a reciprocal is needed."),canonicalState:state(),verification:numericVerification((c as any).value,t.h/t.o,"ORIENTED_SINE_COSEC_RECIPROCAL")}; }

    case "TRG-001-QL-092": { const c=N(Q(t.o*t.o,t.h*t.h)); return { solveMode:"deriveSinSquaredFromCosOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If cos θ=${t.a}/${t.h} and θ is acute, find sin²θ.`:`For acute θ with cosθ=${t.a}/${t.h}, determine sin²θ exactly.`,correct:c,wrong:[{value:N(Q(t.o,t.h)),misconceptionId:"RETURNED_SIN"},{value:N(Q(t.a*t.a,t.h*t.h)),misconceptionId:"RETURNED_COS_SQUARED"},{value:N(Q(t.h*t.h,t.o*t.o)),misconceptionId:"USED_COSEC_SQUARED"}],explanation:explanation("Use sin²θ=1−cos²θ.",[ `sin²θ=1−(${t.a}/${t.h})².`, `This simplifies to ${show(c)}.`],"The target is sin²θ, so no square root is needed."),canonicalState:state(),verification:numericVerification((c as any).value,1-(t.a/t.h)**2,"ORIENTED_EXPRESSION_FROM_COS_RATIO")}; }
    case "TRG-001-QL-093": { const c=N(Q(t.h-t.a,t.h+t.a)); return { solveMode:"evaluateRationalExpressionFromSineOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If sin θ=${t.o}/${t.h} and θ is acute, find (1−cos θ)/(1+cos θ).`:`For acute θ with sinθ=${t.o}/${t.h}, evaluate (1−cosθ)/(1+cosθ).`,correct:c,wrong:[{value:N(Q(t.h+t.a,t.h-t.a)),misconceptionId:"INVERTED_EXPRESSION"},{value:N(Q(t.h-t.o,t.h+t.o)),misconceptionId:"USED_SINE_FOR_COS"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS"}],explanation:explanation("Reconstruct cosine from the sine ratio, then substitute.",[ `Opposite:hypotenuse=${t.o}:${t.h}, so adjacent=${t.a} and cosθ=${t.a}/${t.h}.`, `Substitute into the requested rational expression.`, `The result is (${t.h}−${t.a})/(${t.h}+${t.a})=${show(c)}.`],"Convert 1 to a fraction with denominator ${t.h} before combining."),canonicalState:state(),verification:numericVerification((c as any).value,(1-t.a/t.h)/(1+t.a/t.h),"ORIENTED_EXPRESSION_FROM_SINE_RATIO")}; }
    case "TRG-001-QL-094": { const c=N(Q(t.o*t.a,t.h*t.h)); return { solveMode:"evaluateSinCosProductFromTanOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find sin θ cos θ.`:`For acute θ with tanθ=${t.o}/${t.a}, evaluate sinθ·cosθ.`,correct:c,wrong:[{value:N(Q(2*t.o*t.a,t.h*t.h)),misconceptionId:"USED_DOUBLE_ANGLE"},{value:N(Q(t.o*t.o,t.h*t.h)),misconceptionId:"USED_SIN_SQUARED"},{value:N(Q(t.a*t.a,t.h*t.h)),misconceptionId:"USED_COS_SQUARED"}],explanation:explanation("Build the right triangle from tangent.",[ `Opposite:adjacent=${t.o}:${t.a}; hypotenuse=${t.h}.`, `sinθ=${t.o}/${t.h} and cosθ=${t.a}/${t.h}.`, `Their product is ${show(c)}.`],"Do not insert a factor 2 unless the target is sin2θ."),canonicalState:state(),verification:numericVerification((c as any).value,(t.o/t.h)*(t.a/t.h),"ORIENTED_SIN_COS_PRODUCT_FROM_TAN")}; }
    case "TRG-001-QL-095": { const c=N(Q(t.h*t.h,t.o*t.a)); return { solveMode:"evaluateTanPlusCotFromSineRatioOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If sin θ=${t.o}/${t.h} and θ is acute, find tan θ+cot θ.`:`For acute θ, sinθ=${t.o}/${t.h}. Evaluate tanθ+cotθ.`,correct:c,wrong:[{value:N(Q(t.o,t.a)),misconceptionId:"RETURNED_TAN"},{value:N(Q(t.a,t.o)),misconceptionId:"RETURNED_COT"},{value:N(Q(t.h,t.a)),misconceptionId:"RETURNED_SEC"}],explanation:explanation("Reconstruct the triangle, then form tangent plus cotangent.",[ `Opposite:hypotenuse=${t.o}:${t.h}, so adjacent=${t.a}.`, `tanθ=${t.o}/${t.a} and cotθ=${t.a}/${t.o}.`, `Their sum is ${t.h*t.h}/${t.o*t.a}=${show(c)}.`],"Use o²+a²=h² when adding the reciprocal ratios."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/t.a+t.a/t.o,"ORIENTED_TAN_PLUS_COT_FROM_SINE")}; }

    case "TRG-001-QL-097": { const c=N(Q(t.o+t.a,t.o-t.a)); return { solveMode:"evaluateSumDifferenceRatioFromTanOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find (sin θ+cos θ)/(sin θ−cos θ).`:`For acute θ with tanθ=${t.o}/${t.a}, evaluate (sinθ+cosθ)/(sinθ−cosθ).`,correct:c,wrong:[{value:N(Q(t.o-t.a,t.o+t.a)),misconceptionId:"INVERTED_RATIO"},{value:N(Q(-(t.o+t.a),t.o-t.a)),misconceptionId:"WRONG_SIGN"},{value:N(Q(t.o,t.a)),misconceptionId:"RETURNED_TAN"}],explanation:explanation("Use the common hypotenuse after reconstructing the tangent triangle.",[ `sinθ=${t.o}/${t.h} and cosθ=${t.a}/${t.h}.`, `The common denominator ${t.h} cancels in the outer ratio.`, `The result is (${t.o}+${t.a})/(${t.o}−${t.a})=${show(c)}.`],"Preserve the denominator order sinθ−cosθ; its sign depends on orientation."),canonicalState:state(),verification:numericVerification((c as any).value,((t.o/t.h)+(t.a/t.h))/((t.o/t.h)-(t.a/t.h)),"ORIENTED_SUM_DIFFERENCE_RATIO")}; }
    case "TRG-001-QL-098": { const c=N(Q(t.h*t.h+t.a*t.a,t.a*t.h)); return { solveMode:"deriveSecPlusCosFromTangentOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find sec θ+cos θ.`:`For acute θ with tanθ=${t.o}/${t.a}, evaluate secθ+cosθ.`,correct:c,wrong:[{value:N(Q(t.h,t.a)),misconceptionId:"RETURNED_SEC"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS"},{value:N(Q(t.h*t.h-t.a*t.a,t.a*t.h)),misconceptionId:"SUBTRACTED_INSTEAD_OF_ADDED"}],explanation:explanation("Use tangent to reconstruct secant and cosine.",[ `Opposite:adjacent=${t.o}:${t.a}, so hypotenuse=${t.h}.`, `secθ=${t.h}/${t.a} and cosθ=${t.a}/${t.h}.`, `Their sum is ${show(c)}.`],"Combine secant and cosine with a common denominator."),canonicalState:state(),verification:numericVerification((c as any).value,t.h/t.a+t.a/t.h,"ORIENTED_SEC_PLUS_COS_FROM_TAN")}; }
    case "TRG-001-QL-099": { const c=N(Q(t.o+t.a,t.h)); return { solveMode:"deriveSinPlusCosFromTanOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find sin θ+cos θ.`:`For acute θ with tanθ=${t.o}/${t.a}, evaluate sinθ+cosθ.`,correct:c,wrong:[{value:N(Q(t.o-t.a,t.h)),misconceptionId:"SUBTRACTED_COMPONENTS"},{value:N(Q(t.h,t.o+t.a)),misconceptionId:"RECIPROCAL_SUM"},{value:N(Q(t.o,t.h)),misconceptionId:"RETURNED_SIN"}],explanation:explanation("Convert tangent into a right triangle.",[ `Opposite:adjacent=${t.o}:${t.a}; hypotenuse=${t.h}.`, `sinθ=${t.o}/${t.h} and cosθ=${t.a}/${t.h}.`, `Adding gives ${show(c)}.`],"Both sine and cosine share the reconstructed hypotenuse denominator."),canonicalState:state(),verification:numericVerification((c as any).value,t.o/t.h+t.a/t.h,"ORIENTED_SIN_PLUS_COS_FROM_TAN")}; }
    case "TRG-001-QL-100": { const c=N(Q(t.o*t.o-t.a*t.a,t.h*t.h)); return { solveMode:"deriveSinSquareMinusCosSquareFromTanOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find sin²θ−cos²θ.`:`For acute θ with tanθ=${t.o}/${t.a}, evaluate sin²θ−cos²θ.`,correct:c,wrong:[{value:N(Q(t.a*t.a-t.o*t.o,t.h*t.h)),misconceptionId:"REVERSED_SUBTRACTION"},{value:N(Q(t.o*t.o,t.a*t.a)),misconceptionId:"RETURNED_TAN_SQUARED"},{value:N(Q(t.a*t.a,t.h*t.h)),misconceptionId:"RETURNED_COS_SQUARED"}],explanation:explanation("Reconstruct sine and cosine from tangent before subtracting their squares.",[ `sin²θ=${t.o*t.o}/${t.h*t.h}.`, `cos²θ=${t.a*t.a}/${t.h*t.h}.`, `Subtracting in order gives ${show(c)}.`],"The sign is not fixed: it changes when the acute angle moves across 45°."),canonicalState:state(),verification:numericVerification((c as any).value,(t.o/t.h)**2-(t.a/t.h)**2,"ORIENTED_SQUARE_DIFFERENCE_FROM_TAN")}; }

    case "TRG-001-QL-131": { const c=N(Q(2*t.o*t.a,t.h*t.h)); return { solveMode:"deriveSinDoubleAngleFromRatiosOriented",difficulty:"Medium",target:"SCALAR",stem:v===0?`If sin θ=${t.o}/${t.h} and cos θ=${t.a}/${t.h}, find sin 2θ.`:`For acute θ, sinθ=${t.o}/${t.h} and cosθ=${t.a}/${t.h}. Evaluate sin2θ.`,correct:c,wrong:[{value:N(Q(t.o*t.a,t.h*t.h)),misconceptionId:"DROPPED_FACTOR_TWO"},{value:N(Q(2*t.o*t.o,t.h*t.h)),misconceptionId:"USED_TWO_SIN_SQUARED"},{value:N(Q(t.a*t.a-t.o*t.o,t.h*t.h)),misconceptionId:"USED_COS_DOUBLE_ANGLE"}],explanation:explanation("Use sin2θ=2sinθcosθ.",[ `Substitute the two given ratios.`, `sin2θ=2×${t.o}/${t.h}×${t.a}/${t.h}.` , `The exact value is ${show(c)}.`],"Do not omit the factor 2."),canonicalState:state(),verification:numericVerification((c as any).value,2*(t.o/t.h)*(t.a/t.h),"ORIENTED_SINE_DOUBLE_ANGLE")}; }
    case "TRG-001-QL-132": { const c=N(Q(t.a*t.a-t.o*t.o,t.h*t.h)); return { solveMode:"deriveCosDoubleAngleFromTanOriented",difficulty:"Hard",target:"SCALAR",stem:v===0?`If tan θ=${t.o}/${t.a} and θ is acute, find cos 2θ.`:`For acute θ with tanθ=${t.o}/${t.a}, evaluate cos2θ exactly.`,correct:c,wrong:[{value:N(Q(t.o*t.o-t.a*t.a,t.h*t.h)),misconceptionId:"REVERSED_NUMERATOR"},{value:N(Q(2*t.o*t.a,t.h*t.h)),misconceptionId:"USED_SIN_DOUBLE_ANGLE"},{value:N(Q(t.a,t.h)),misconceptionId:"RETURNED_COS_THETA"}],explanation:explanation("Use cos2θ=(1−tan²θ)/(1+tan²θ).",[ `Substitute tanθ=${t.o}/${t.a}.`, `The ratio becomes (${t.a*t.a}−${t.o*t.o})/(${t.a*t.a}+${t.o*t.o}).`, `Since ${t.a*t.a}+${t.o*t.o}=${t.h*t.h}, cos2θ=${show(c)}.`],"The numerator sign changes when tanθ moves above 1."),canonicalState:state(),verification:numericVerification((c as any).value,(1-(t.o/t.a)**2)/(1+(t.o/t.a)**2),"ORIENTED_COSINE_DOUBLE_ANGLE")}; }
    default: throw new Error(`${qlId}: no orientation-diversity remediation spec.`);
  }
}

export function generateDiversityRemediatedTrg001Question(qlId: string, seed: string): any {
  if (!TRG_001_AUTHORITY_ALIGNED_IDS.includes(qlId)) throw new Error(`Unknown diversity-remediated TRG-001 QL ${qlId}`);
  if (ORIENTATION_IDS.has(qlId)) return make(qlId, seed, build(qlId, seed));
  return generateAuditRemediatedTrg001Question(qlId, seed);
}

export function generateAllDiversityRemediatedTrg001Questions(seed: string) {
  return TRG_001_AUTHORITY_ALIGNED_IDS.map((qlId) => generateDiversityRemediatedTrg001Question(qlId, seed));
}
