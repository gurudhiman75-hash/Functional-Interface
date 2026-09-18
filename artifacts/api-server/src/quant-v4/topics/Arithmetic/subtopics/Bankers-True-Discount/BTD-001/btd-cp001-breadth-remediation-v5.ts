import { createHash } from "node:crypto";
import type { Rational } from "./btd-cp001-source-bound-foundation-v1";
import {
  BTD_001_DISCOVERY_PROTOTYPE_IDS_V4,
  BTD_001_PROTOTYPE_009_CONTRACT,
  buildBtdDiscoveryQuestionV4,
  type BtdDiscoveryPrototypeIdV4,
} from "./btd-cp001-official-source-expansion-v4";
import { BTD_001_SOURCE_AUTHORITY_V2 } from "./btd-cp001-source-authority-v2";

export const BTD_001_BREADTH_REMEDIATION_V5 = "BTD-001-CP001-BREADTH-REMEDIATION-v5" as const;
export const BTD_001_DISCOVERY_PROTOTYPE_IDS_V5 = BTD_001_DISCOVERY_PROTOTYPE_IDS_V4;
export type BtdDiscoveryPrototypeIdV5 = BtdDiscoveryPrototypeIdV4;
export { BTD_001_PROTOTYPE_009_CONTRACT };

function abs(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint { let a = abs(left); let b = abs(right); while (b) { const next = a % b; a = b; b = next; } return a || 1n; }
function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let a = BigInt(n); let b = BigInt(d); if (b === 0n) throw new Error("BTD P006 denominator zero"); if (b < 0n) { a = -a; b = -b; } const g = gcd(a, b); return Object.freeze({ n: a / g, d: b / g });
}
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function mul(a: Rational, b: Rational) { return rat(a.n * b.n, a.d * b.d); }
function div(a: Rational, b: Rational) { if (b.n === 0n) throw new Error("BTD P006 division by zero"); return rat(a.n * b.d, a.d * b.n); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function key(value: Rational) { return `${value.n}/${value.d}`; }
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value; const objectValue = value as object; if (seen.has(objectValue)) return value; seen.add(objectValue); for (const property of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[property], seen); return Object.freeze(value);
}
function stableIndex(seed: string, size: number) { return createHash("sha256").update(seed).digest().readUInt32BE(0) % size; }
function hundredthSafe(value: Rational) { return (value.n * 100n) % value.d === 0n; }
function decimal(value: Rational) { if (!hundredthSafe(value)) throw new Error(`BTD P006 unsafe display ${key(value)}`); const h = value.n * 100n / value.d; const whole = h / 100n; const fraction = abs(h % 100n); if (fraction === 0n) return whole.toString(); if (fraction % 10n === 0n) return `${whole}.${fraction / 10n}`; return `${whole}.${fraction.toString().padStart(2, "0")}`; }
function percent(value: Rational) { return `${decimal(value)}%`; }
function ratioText(value: Rational) { return `${value.n}:${value.d}`; }
function monthText(months: number) { return months === 12 ? "1 year" : months % 12 === 0 ? `${months / 12} years` : `${months} months`; }

const RATES = Object.freeze([5, 6, 8, 10, 12, 15] as const);
const MONTHS = Object.freeze([3, 4, 5, 6, 8, 9, 12, 15, 18, 24, 30, 36] as const);
const CONTEXTS = Object.freeze(["bill of exchange", "trade bill", "promissory note", "merchant bill", "invoice"] as const);

export type BtdPrototype006V5State = Readonly<{
  prototypeId: "BTD-PROT-006";
  context: string;
  bdToTdRatio: Rational;
  months: number;
}>;

const P006_STATE_POOL: readonly BtdPrototype006V5State[] = Object.freeze(
  RATES.flatMap((rate) => MONTHS.flatMap((months) => CONTEXTS.map((context) => deepFreeze({
    prototypeId: "BTD-PROT-006" as const,
    context,
    bdToTdRatio: add(rat(1), rat(rate * months, 1200)),
    months,
  })))),
);

export function constructBtdPrototype006V5State(seed: string): BtdPrototype006V5State {
  return P006_STATE_POOL[stableIndex(`BTD-PROT-006:${seed}`, P006_STATE_POOL.length)]!;
}
export function solveBtdPrototype006V5(state: BtdPrototype006V5State): Rational {
  return div(mul(sub(state.bdToTdRatio, rat(1)), rat(1200)), rat(state.months));
}
export function verifyBtdPrototype006V5(state: BtdPrototype006V5State, candidateRate: Rational): boolean {
  if (candidateRate.n <= 0n) return false;
  const reconstructedRatio = add(rat(1), div(mul(candidateRate, rat(state.months)), rat(1200)));
  return eq(reconstructedRatio, state.bdToTdRatio);
}

function hash(text: string) { return createHash("sha256").update(text).digest().readUInt32BE(0); }
function optionsFor(state: BtdPrototype006V5State, answer: Rational, seed: string) {
  if (answer.d !== 1n) throw new Error(`${seed}: P006 curated state did not produce integer annual rate`);
  const rate = Number(answer.n);
  const candidates = [
    { value: rat(Math.max(1, rate - 2)), misconceptionId: "RATE_TWO_LOW" },
    { value: rat(Math.max(1, rate - 1)), misconceptionId: "RATE_ONE_LOW" },
    { value: rat(rate + 2), misconceptionId: "RATE_TWO_HIGH" },
    { value: rat(rate + 5), misconceptionId: "RATE_FIVE_HIGH" },
    { value: rat(Math.max(1, Math.round(rate * state.months / 12))), misconceptionId: "CONFUSE_RT_WITH_RATE" },
  ];
  const selected: { value: Rational; misconceptionId: string }[] = [];
  const seen = new Set([key(answer)]);
  for (const candidate of candidates) {
    const candidateKey = key(candidate.value);
    if (seen.has(candidateKey) || verifyBtdPrototype006V5(state, candidate.value)) continue;
    seen.add(candidateKey); selected.push(candidate); if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`${seed}: P006 v5 could not build three distinct distractors`);
  const correctIndex = hash(`${seed}:correct-index`) % 4;
  const arranged = [...selected]; arranged.splice(correctIndex, 0, { value: answer, misconceptionId: "CORRECT" });
  return Object.freeze(arranged.map((item) => deepFreeze({ value: item.value, text: percent(item.value), misconceptionId: item.misconceptionId, isCorrect: eq(item.value, answer) })));
}
function presentationFor(state: BtdPrototype006V5State, seed: string) {
  const family = hash(`${seed}:stem-family`) % 3;
  const ratio = ratioText(state.bdToTdRatio);
  const stems = [
    `For a ${state.context}, banker's discount : true discount = ${ratio}. If the unexpired time is ${monthText(state.months)}, find the annual simple-interest rate.`,
    `A ${state.context} has BD:TD = ${ratio} for an unexpired period of ${monthText(state.months)}. What rate percent per annum is being used?`,
    `The ratio of banker's discount to true discount is ${ratio}. The bill has ${monthText(state.months)} left to run. Determine the annual rate.`,
  ];
  return Object.freeze({ stemFamilyId: `BTD-PROT-006-T${family + 1}`, stem: stems[family]! });
}
function explanationFor(state: BtdPrototype006V5State, answer: Rational) {
  const x = sub(state.bdToTdRatio, rat(1));
  return Object.freeze({
    whatAsked: "Find the annual rate from the BD:TD ratio and known unexpired time.",
    keyIdea: "For the same bill, BD/TD = Face/PW = 1 + RT. With time known, the annual rate follows directly.",
    steps: Object.freeze([
      `From BD:TD = ${ratioText(state.bdToTdRatio)}, RT = ${x.n}/${x.d}.`,
      `The time is ${state.months}/12 years, so R = RT × 1200/${state.months}.`,
      `R = (${x.n}/${x.d}) × 1200/${state.months} = ${percent(answer)}.`,
    ]),
    finalAnswer: percent(answer),
  });
}
function buildP006V5(seed: string) {
  const state = constructBtdPrototype006V5State(seed); const answer = solveBtdPrototype006V5(state); if (!verifyBtdPrototype006V5(state, answer)) throw new Error(`${seed}: P006 v5 canonical rate rejected`); const presentation = presentationFor(state, seed); const options = optionsFor(state, answer, seed); const correctIndex = options.findIndex((option) => option.isCorrect);
  return deepFreeze({
    chapterId: "BTD-001" as const, checkpointId: "BTD-CP-001" as const, packagingVersion: BTD_001_BREADTH_REMEDIATION_V5, prototypeId: "BTD-PROT-006" as const,
    contract: Object.freeze({ title: "Annual rate from BD:TD ratio and known unexpired time", givenUnknown: "BD:TD ratio + known time -> annual rate", answerKind: "RATE_PERCENT" as const, ownership: "BTD-001" as const }),
    sourceBoundary: BTD_001_SOURCE_AUTHORITY_V2, requestedSeed: seed, effectiveSeed: seed, packagingResolutionAttempts: 1 as const, packagingRemediation: "CURATED_360_STATE_P006_BREADTH_POOL" as const,
    seed, state, answerKind: "RATE_PERCENT" as const, answer, presentation, options, correctIndex, correctAnswer: options[correctIndex]!.text, explanation: explanationFor(state, answer),
    lifecycle: Object.freeze({ discoveryOnly: true as const, permanentQlAllocated: false as const, questionStudioDiscoverable: false as const, questionBankWritable: false as const, testEligible: false as const, mockTestEligible: false as const, publiclyPublishable: false as const }),
  });
}

export function buildBtdDiscoveryQuestionV5(prototypeId: BtdDiscoveryPrototypeIdV5, seed: string) {
  if (prototypeId === "BTD-PROT-006") return buildP006V5(seed);
  const base = buildBtdDiscoveryQuestionV4(prototypeId, seed) as any;
  return deepFreeze({ ...base, packagingVersion: BTD_001_BREADTH_REMEDIATION_V5 });
}
