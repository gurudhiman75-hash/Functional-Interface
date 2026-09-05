import { createHash } from "node:crypto";
import type { Rational } from "./btd-cp001-source-bound-foundation-v1";
import {
  BTD_001_BREADTH_REMEDIATION_V5,
  BTD_001_DISCOVERY_PROTOTYPE_IDS_V5,
  buildBtdDiscoveryQuestionV5,
  solveBtdPrototype006V5,
  verifyBtdPrototype006V5,
  type BtdDiscoveryPrototypeIdV5,
} from "./btd-cp001-breadth-remediation-v5";
import {
  BTD_001_PROTOTYPE_009_CONTRACT,
  solveBtdPrototype009,
  verifyBtdPrototype009,
  type BtdPrototype009State,
} from "./btd-cp001-official-source-expansion-v4";
import { BTD_001_SOURCE_AUTHORITY_V2 } from "./btd-cp001-source-authority-v2";

export const BTD_001_BREADTH_REMEDIATION_V6 = "BTD-001-CP001-BREADTH-REMEDIATION-v6" as const;
export const BTD_001_DISCOVERY_PROTOTYPE_IDS_V6 = BTD_001_DISCOVERY_PROTOTYPE_IDS_V5;
export type BtdDiscoveryPrototypeIdV6 = BtdDiscoveryPrototypeIdV5;
export { BTD_001_PROTOTYPE_009_CONTRACT, solveBtdPrototype006V5, verifyBtdPrototype006V5 };

function abs(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint { let a = abs(left); let b = abs(right); while (b) { const next = a % b; a = b; b = next; } return a || 1n; }
function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let a = BigInt(n); let b = BigInt(d); if (b === 0n) throw new Error("BTD P009 denominator zero"); if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b); return Object.freeze({ n: a / g, d: b / g });
}
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function key(value: Rational) { return `${value.n}/${value.d}`; }
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value; const objectValue = value as object; if (seen.has(objectValue)) return value; seen.add(objectValue); for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen); return Object.freeze(value);
}
function stableIndex(seed: string, size: number) { return createHash("sha256").update(seed).digest().readUInt32BE(0) % size; }
function hash(seed: string) { return createHash("sha256").update(seed).digest().readUInt32BE(0); }
function decimal(value: Rational) {
  if ((value.n * 100n) % value.d !== 0n) throw new Error(`BTD P009 display is not hundredth-safe: ${key(value)}`);
  const h = value.n * 100n / value.d; const whole = h / 100n; const fraction = abs(h % 100n); if (fraction === 0n) return whole.toString(); if (fraction % 10n === 0n) return `${whole}.${fraction / 10n}`; return `${whole}.${fraction.toString().padStart(2, "0")}`;
}
function percent(value: Rational) { return `${decimal(value)}%`; }
function ratioText(value: Rational) { return `${value.n}:${value.d}`; }

const YEARS = Object.freeze([1, 2, 3, 4] as const);
const MULTIPLIERS = Object.freeze([3, 4, 5, 6, 8, 10] as const);
const CONTEXTS = Object.freeze(["bill of exchange", "trade bill", "promissory note", "merchant bill", "bank-discount bill"] as const);

const P009_STATE_POOL: readonly BtdPrototype009State[] = Object.freeze(
  YEARS.flatMap((years) => MULTIPLIERS.flatMap((multiplier) => CONTEXTS.map((context) => {
    const rate = multiplier * years;
    const ratio = add(rat(1), rat(rate * years, 100));
    return deepFreeze({
      prototypeId: "BTD-PROT-009" as const,
      context,
      bdToTdRatio: ratio,
      rateEqualsYearsMultiplier: multiplier,
      hiddenCanonicalYears: years,
    });
  }))),
);

export function constructBtdPrototype009V6State(seed: string): BtdPrototype009State {
  return P009_STATE_POOL[stableIndex(`BTD-PROT-009:${seed}`, P009_STATE_POOL.length)]!;
}

function optionsFor(state: BtdPrototype009State, answer: Rational, seed: string) {
  if (answer.d !== 1n) throw new Error(`${seed}: P009 canonical rate must be an integer`);
  const rate = Number(answer.n);
  const candidates = [
    { value: rat(Math.max(1, rate - 1)), misconceptionId: "RATE_ONE_LOW" },
    { value: rat(rate + 1), misconceptionId: "RATE_ONE_HIGH" },
    { value: rat(Math.max(1, rate - 2)), misconceptionId: "RATE_TWO_LOW" },
    { value: rat(rate + 2), misconceptionId: "RATE_TWO_HIGH" },
    { value: rat(Math.max(1, rate - state.rateEqualsYearsMultiplier)), misconceptionId: "USE_ONE_YEAR_LESS" },
    { value: rat(rate + state.rateEqualsYearsMultiplier), misconceptionId: "USE_ONE_YEAR_MORE" },
    { value: rat(Math.max(1, state.hiddenCanonicalYears)), misconceptionId: "REPORT_TIME_AS_RATE" },
    { value: rat(rate * 2), misconceptionId: "DOUBLE_RATE" },
  ];
  const selected: { value: Rational; misconceptionId: string }[] = [];
  const seen = new Set([key(answer)]);
  for (const candidate of candidates) {
    const candidateKey = key(candidate.value);
    if (seen.has(candidateKey) || verifyBtdPrototype009(state, candidate.value)) continue;
    seen.add(candidateKey); selected.push(candidate); if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`${seed}: P009 v6 could not build three distinct distractors`);
  const correctIndex = hash(`${seed}:correct-index`) % 4;
  const arranged = [...selected]; arranged.splice(correctIndex, 0, { value: answer, misconceptionId: "CORRECT" });
  return Object.freeze(arranged.map((item) => deepFreeze({ value: item.value, text: percent(item.value), misconceptionId: item.misconceptionId, isCorrect: eq(item.value, answer) })));
}

function presentationFor(state: BtdPrototype009State, seed: string) {
  const family = hash(`${seed}:stem-family`) % 3;
  const ratio = ratioText(state.bdToTdRatio);
  const relation = state.rateEqualsYearsMultiplier;
  const stems = [
    `For a ${state.context}, banker's discount and true discount are in the ratio ${ratio}. If the annual rate percent is numerically ${relation} times the bill term in years, find the annual rate.`,
    `A ${state.context} has BD:TD = ${ratio}. The rate percent per annum equals ${relation} times the number of years for which the bill runs. What is the annual rate?`,
    `On a ${state.context}, the ratio of banker's discount to true discount is ${ratio}. Also R = ${relation}T numerically, where R is the annual rate percent and T is the term in years. Determine R.`,
  ];
  return Object.freeze({ stemFamilyId: `BTD-PROT-009-T${family + 1}`, stem: stems[family]! });
}

function explanationFor(state: BtdPrototype009State, answer: Rational) {
  return Object.freeze({
    whatAsked: "Find the annual rate from the BD:TD ratio and the rate-to-term relation.",
    keyIdea: "For one bill, BD/TD = 1 + RT/100. Combining this with R = kT gives a direct equation in R, so the term need not be guessed.",
    steps: Object.freeze([
      `Use BD/TD = ${ratioText(state.bdToTdRatio)} = 1 + RT/100.`,
      `Since R = ${state.rateEqualsYearsMultiplier}T, substitute T = R/${state.rateEqualsYearsMultiplier}.`,
      `This gives R² = 100 × ${state.rateEqualsYearsMultiplier} × (BD/TD - 1).`,
      `Solving gives R = ${percent(answer)}; the corresponding term is ${state.hiddenCanonicalYears} year${state.hiddenCanonicalYears === 1 ? "" : "s"}.`,
    ]),
    finalAnswer: percent(answer),
  });
}

function buildP009V6(seed: string) {
  const state = constructBtdPrototype009V6State(seed);
  const answer = solveBtdPrototype009(state);
  if (!verifyBtdPrototype009(state, answer)) throw new Error(`${seed}: P009 v6 canonical answer rejected`);
  const presentation = presentationFor(state, seed);
  const options = optionsFor(state, answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${seed}: P009 v6 answer ownership invalid`);
  return deepFreeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-001" as const,
    packagingVersion: BTD_001_BREADTH_REMEDIATION_V6,
    prototypeId: "BTD-PROT-009" as const,
    contract: BTD_001_PROTOTYPE_009_CONTRACT,
    sourceBoundary: BTD_001_SOURCE_AUTHORITY_V2,
    requestedSeed: seed,
    effectiveSeed: seed,
    packagingResolutionAttempts: 1 as const,
    packagingRemediation: "CURATED_120_STATE_P009_BREADTH_POOL" as const,
    seed,
    state,
    answerKind: "RATE_PERCENT" as const,
    answer,
    presentation,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: explanationFor(state, answer),
    lifecycle: Object.freeze({ discoveryOnly: true as const, permanentQlAllocated: false as const, questionStudioDiscoverable: false as const, questionBankWritable: false as const, testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const }),
  });
}

export function buildBtdDiscoveryQuestionV6(prototypeId: BtdDiscoveryPrototypeIdV6, seed: string) {
  if (prototypeId === "BTD-PROT-009") return buildP009V6(seed);
  const base = buildBtdDiscoveryQuestionV5(prototypeId, seed) as any;
  return deepFreeze({ ...base, packagingVersion: BTD_001_BREADTH_REMEDIATION_V6 });
}

export const BTD_001_PREVIOUS_BREADTH_VERSION = BTD_001_BREADTH_REMEDIATION_V5;
