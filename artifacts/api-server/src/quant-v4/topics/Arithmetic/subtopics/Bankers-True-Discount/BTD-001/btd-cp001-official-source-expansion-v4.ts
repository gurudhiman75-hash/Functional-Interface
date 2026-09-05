import {
  BTD_001_PROTOTYPE_IDS,
  type Rational,
} from "./btd-cp001-source-bound-foundation-v1";
import {
  buildBtdDiscoveryQuestionV3,
  type BtdPrototypeId,
} from "./btd-cp001-discovery-packaging-v3";
import { BTD_001_SOURCE_AUTHORITY_V2 } from "./btd-cp001-source-authority-v2";

export const BTD_001_OFFICIAL_SOURCE_EXPANSION_V4 = "BTD-001-CP001-OFFICIAL-SOURCE-EXPANSION-v4" as const;
export const BTD_001_DISCOVERY_PROTOTYPE_IDS_V4 = Object.freeze([
  ...BTD_001_PROTOTYPE_IDS,
  "BTD-PROT-009",
] as const);
export type BtdDiscoveryPrototypeIdV4 = (typeof BTD_001_DISCOVERY_PROTOTYPE_IDS_V4)[number];

export const BTD_001_PROTOTYPE_009_CONTRACT = Object.freeze({
  prototypeId: "BTD-PROT-009" as const,
  title: "Annual rate from BD:TD ratio plus rate-to-term relation" as const,
  givenUnknown: "BD:TD ratio + R = kT relation -> annual rate" as const,
  answerKind: "RATE_PERCENT" as const,
  ownership: "BTD-001" as const,
  sourceAuthorityId: "OFFICIAL-GPSC-GOA-JSO-BATCH8-2026-Q27" as const,
});

function abs(value: bigint) { return value < 0n ? -value : value; }
function gcd(left: bigint, right: bigint): bigint {
  let a = abs(left); let b = abs(right);
  while (b) { const next = a % b; a = b; b = next; }
  return a || 1n;
}
function rat(n: bigint | number, d: bigint | number = 1n): Rational {
  let numerator = BigInt(n); let denominator = BigInt(d);
  if (denominator === 0n) throw new Error("BTD P009 denominator cannot be zero");
  if (denominator < 0n) { numerator = -numerator; denominator = -denominator; }
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ n: numerator / divisor, d: denominator / divisor });
}
function add(a: Rational, b: Rational) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
function sub(a: Rational, b: Rational) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
function mul(a: Rational, b: Rational) { return rat(a.n * b.n, a.d * b.d); }
function div(a: Rational, b: Rational) { if (b.n === 0n) throw new Error("BTD P009 division by zero"); return rat(a.n * b.d, a.d * b.n); }
function eq(a: Rational, b: Rational) { return a.n === b.n && a.d === b.d; }
function square(a: Rational) { return mul(a, a); }
function hash(text: string) {
  let value = 2166136261;
  for (let index = 0; index < text.length; index += 1) { value ^= text.charCodeAt(index); value = Math.imul(value, 16777619); }
  return value >>> 0;
}
function pick<T>(items: readonly T[], seed: string, salt: string): T { return items[hash(`${seed}:${salt}`) % items.length]!; }
function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (!value || typeof value !== "object") return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  return Object.freeze(value);
}
function hundredthSafe(value: Rational) { return (value.n * 100n) % value.d === 0n; }
function decimal(value: Rational) {
  if (!hundredthSafe(value)) throw new Error(`BTD P009 value is not hundredth-safe: ${value.n}/${value.d}`);
  const hundredths = value.n * 100n / value.d;
  const whole = hundredths / 100n;
  const fraction = abs(hundredths % 100n);
  if (fraction === 0n) return whole.toString();
  if (fraction % 10n === 0n) return `${whole}.${fraction / 10n}`;
  return `${whole}.${fraction.toString().padStart(2, "0")}`;
}
function percent(value: Rational) { return `${decimal(value)}%`; }
function ratioText(value: Rational) { return `${value.n}:${value.d}`; }

const YEARS = Object.freeze([1, 2, 3, 4] as const);
const MULTIPLIERS = Object.freeze([3, 4, 5, 6, 8, 10] as const);
const CONTEXTS = Object.freeze(["bill of exchange", "trade bill", "promissory note", "merchant bill", "bank-discount bill"] as const);

export type BtdPrototype009State = Readonly<{
  prototypeId: "BTD-PROT-009";
  context: string;
  bdToTdRatio: Rational;
  rateEqualsYearsMultiplier: number;
  hiddenCanonicalYears: number;
}>;

export function constructBtdPrototype009State(seed: string): BtdPrototype009State {
  const years = pick(YEARS, seed, "years");
  const multiplier = pick(MULTIPLIERS, seed, "multiplier");
  const rate = multiplier * years;
  const x = rat(BigInt(rate * years), 100n);
  const ratio = add(rat(1), x);
  return deepFreeze({
    prototypeId: "BTD-PROT-009",
    context: pick(CONTEXTS, seed, "context"),
    bdToTdRatio: ratio,
    rateEqualsYearsMultiplier: multiplier,
    hiddenCanonicalYears: years,
  });
}

export function solveBtdPrototype009(state: BtdPrototype009State): Rational {
  // BD/TD = 1 + RT/100 and R = kT, hence R² = 100k(BD/TD - 1).
  const targetSquare = mul(rat(100 * state.rateEqualsYearsMultiplier), sub(state.bdToTdRatio, rat(1)));
  for (let rate = 1; rate <= 100; rate += 1) {
    const candidate = rat(rate);
    if (eq(square(candidate), targetSquare)) return candidate;
  }
  throw new Error(`BTD-PROT-009: no positive integer exam-safe rate solves target square ${targetSquare.n}/${targetSquare.d}`);
}

export function verifyBtdPrototype009(state: BtdPrototype009State, candidateRate: Rational): boolean {
  if (candidateRate.n <= 0n) return false;
  const left = square(candidateRate);
  const right = mul(rat(100 * state.rateEqualsYearsMultiplier), sub(state.bdToTdRatio, rat(1)));
  return eq(left, right);
}

function optionsFor(state: BtdPrototype009State, answer: Rational, seed: string) {
  if (answer.d !== 1n) throw new Error("BTD-PROT-009 canonical rate must be an integer");
  const rate = Number(answer.n);
  const pool = [
    { rate: rate - state.rateEqualsYearsMultiplier, id: "USE_ONE_YEAR_LESS" },
    { rate: rate + state.rateEqualsYearsMultiplier, id: "USE_ONE_YEAR_MORE" },
    { rate: Math.max(1, Math.round(rate / state.rateEqualsYearsMultiplier)), id: "REPORT_TIME_AS_RATE" },
    { rate: rate * 2, id: "DOUBLE_RATE" },
    { rate: rate + 5, id: "ADD_RELATION_MULTIPLIER" },
  ];
  const selected: { value: Rational; misconceptionId: string }[] = [];
  const seen = new Set([key(answer)]);
  for (const item of pool) {
    if (item.rate <= 0) continue;
    const value = rat(item.rate);
    if (seen.has(key(value)) || verifyBtdPrototype009(state, value)) continue;
    seen.add(key(value)); selected.push({ value, misconceptionId: item.id });
    if (selected.length === 3) break;
  }
  if (selected.length !== 3) throw new Error(`${seed}: BTD-PROT-009 insufficient distinct distractors`);
  const correctIndex = hash(`${seed}:correct-index`) % 4;
  const arranged = [...selected]; arranged.splice(correctIndex, 0, { value: answer, misconceptionId: "CORRECT" });
  return Object.freeze(arranged.map((item) => deepFreeze({
    value: item.value,
    text: percent(item.value),
    misconceptionId: item.misconceptionId,
    isCorrect: eq(item.value, answer),
  })));
}
function key(value: Rational) { return `${value.n}/${value.d}`; }

function presentationFor(state: BtdPrototype009State, seed: string) {
  const family = hash(`${seed}:stem-family`) % 3;
  const relation = `the annual interest rate is numerically ${state.rateEqualsYearsMultiplier} times the number of years for which the bill is due`;
  const ratio = ratioText(state.bdToTdRatio);
  const stems = [
    `For a ${state.context}, banker's discount is ${ratio} of true discount in the ratio BD:TD. If ${relation}, find the annual interest rate.`,
    `The ratio of banker's discount to true discount on a ${state.context} is ${ratio}. The rate percent per annum is numerically ${state.rateEqualsYearsMultiplier} times the bill term in years. Find the rate.`,
    `A ${state.context} satisfies BD:TD = ${ratio}. Also, R = ${state.rateEqualsYearsMultiplier}T numerically, where R is the annual rate percent and T is the term in years. Determine R.`,
  ];
  return Object.freeze({ stemFamilyId: `BTD-PROT-009-T${family + 1}`, stem: stems[family]! });
}

function explanationFor(state: BtdPrototype009State, answer: Rational) {
  const x = sub(state.bdToTdRatio, rat(1));
  return Object.freeze({
    whatAsked: "Find the annual interest rate from the BD:TD ratio and the rate–time relation.",
    keyIdea: "For the same bill, BD/TD = 1 + RT/100. Combine this with R = kT instead of guessing the term.",
    steps: Object.freeze([
      `From BD:TD = ${ratioText(state.bdToTdRatio)}, RT/100 = ${x.n}/${x.d}.`,
      `Given R = ${state.rateEqualsYearsMultiplier}T, substitute T = R/${state.rateEqualsYearsMultiplier}.`,
      `So R²/(100 × ${state.rateEqualsYearsMultiplier}) = ${x.n}/${x.d}.`,
      `Hence R = ${percent(answer)}; the implied term is ${state.hiddenCanonicalYears} year${state.hiddenCanonicalYears === 1 ? "" : "s"}.`,
    ]),
    finalAnswer: percent(answer),
  });
}

function buildPrototype009(seed: string) {
  const state = constructBtdPrototype009State(seed);
  const answer = solveBtdPrototype009(state);
  if (!verifyBtdPrototype009(state, answer)) throw new Error(`${seed}: P009 independent verifier rejected canonical rate`);
  const presentation = presentationFor(state, seed);
  const options = optionsFor(state, answer, seed);
  const correctIndex = options.findIndex((option) => option.isCorrect);
  if (correctIndex < 0 || options.filter((option) => option.isCorrect).length !== 1) throw new Error(`${seed}: P009 answer ownership invalid`);
  return deepFreeze({
    chapterId: "BTD-001" as const,
    checkpointId: "BTD-CP-001" as const,
    packagingVersion: BTD_001_OFFICIAL_SOURCE_EXPANSION_V4,
    prototypeId: "BTD-PROT-009" as const,
    contract: BTD_001_PROTOTYPE_009_CONTRACT,
    sourceBoundary: BTD_001_SOURCE_AUTHORITY_V2,
    requestedSeed: seed,
    effectiveSeed: seed,
    packagingResolutionAttempts: 1 as const,
    packagingRemediation: "NONE_REQUIRED" as const,
    seed,
    state,
    answerKind: "RATE_PERCENT" as const,
    answer,
    presentation,
    options,
    correctIndex,
    correctAnswer: options[correctIndex]!.text,
    explanation: explanationFor(state, answer),
    lifecycle: Object.freeze({
      discoveryOnly: true as const,
      permanentQlAllocated: false as const,
      questionStudioDiscoverable: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
    }),
  });
}

export function buildBtdDiscoveryQuestionV4(prototypeId: BtdDiscoveryPrototypeIdV4, seed: string) {
  if (prototypeId === "BTD-PROT-009") return buildPrototype009(seed);
  const base = buildBtdDiscoveryQuestionV3(prototypeId as BtdPrototypeId, seed) as any;
  return deepFreeze({
    ...base,
    packagingVersion: BTD_001_OFFICIAL_SOURCE_EXPANSION_V4,
    sourceBoundary: BTD_001_SOURCE_AUTHORITY_V2,
  });
}
