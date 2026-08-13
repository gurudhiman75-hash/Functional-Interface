import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  reduceRationalRatio,
  subtractRational,
} from "./rational";
import type { Rational } from "./types";
import {
  getMalCp006Vessel,
  malCp006ComponentB,
  malCp006ConcentrationPercent,
  solveMalCp006Ledger,
  verifyMalCp006EqualExchange,
} from "./cp006-solver";
import { generateMalCp006Wave01Question } from "./cp006-discovery-runtime-wave01";
import {
  MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
  type MalCp006DiscoveryQuestion,
  type MalCp006ExactAnswer,
  type MalCp006OptionAudit,
  type MalCp006VesselState,
  type MalCp006Wave01PrototypeId,
} from "./cp006-types";

const ZERO = rational(0);
const HUNDRED = rational(100);

export const MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS = [
  "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
  "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
  "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
  "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
  "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
] as const satisfies readonly MalCp006Wave01PrototypeId[];

export type MalCp006Wave01V2PrototypeId =
  (typeof MAL_CP006_WAVE01_V2_RETAINED_PROTOTYPE_IDS)[number];

export const MAL_CP006_WAVE01_V2_HELD_PROTOTYPES = Object.freeze({
  "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE": {
    decision: "HOLD_CP001_WEIGHTED_BLEND_EQUIVALENT" as const,
    reason:
      "If the final concentrations are already known to be equal, the common concentration is simply total initial solute divided by total initial liquid; the exchange amount is not needed to answer the question.",
  },
});

type Unit = "litres" | "ml";
interface Context {
  first: string;
  second: string;
  mixture: string;
  unit: Unit;
}

const CONTEXTS: readonly Context[] = [
  { first: "milk", second: "water", mixture: "milk-water mixture", unit: "litres" },
  { first: "alcohol", second: "water", mixture: "alcohol-water mixture", unit: "litres" },
  { first: "salt", second: "water", mixture: "salt-water solution", unit: "litres" },
  { first: "acid", second: "water", mixture: "acid-water solution", unit: "litres" },
] as const;

function hash(text: string): number {
  let x = 2166136261;
  for (const ch of text) {
    x ^= ch.codePointAt(0) ?? 0;
    x = Math.imul(x, 16777619);
  }
  return x >>> 0;
}
function pick<T>(items: readonly T[], seed: string): T {
  return items[hash(seed) % items.length]!;
}
function shuffle<T>(items: readonly T[], seed: string): T[] {
  const out = [...items];
  let s = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i -= 1) {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}
function absBig(value: bigint): bigint { return value < 0n ? -value : value; }
function num(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  if (100n % value.denominator === 0n) {
    const scaled = value.numerator * (100n / value.denominator);
    const sign = scaled < 0n ? "-" : "";
    const absolute = absBig(scaled);
    const whole = absolute / 100n;
    const decimal = String(absolute % 100n).padStart(2, "0").replace(/0+$/u, "");
    return decimal ? `${sign}${whole}.${decimal}` : `${sign}${whole}`;
  }
  return formatRational(value);
}
function qty(value: Rational, unit: Unit): string { return `${num(value)} ${unit}`; }
function pct(value: Rational): string { return `${num(value)}%`; }
function ratio(a: Rational, b: Rational): string {
  const [x, y] = reduceRationalRatio(a, b);
  return `${num(x)} : ${num(y)}`;
}
function frac(v: MalCp006VesselState): Rational { return divideRational(v.componentA, v.volume); }
function percent(v: MalCp006VesselState): Rational { return multiplyRational(frac(v), HUNDRED); }
function parts(v: MalCp006VesselState, amount: Rational) {
  const first = multiplyRational(amount, frac(v));
  return { first, second: subtractRational(amount, first) };
}
function answerText(answer: MalCp006ExactAnswer, unit: Unit): string {
  if (answer.kind === "RATIO") return ratio(answer.first, answer.second);
  if (answer.kind === "PERCENT") return pct(answer.value);
  return qty(answer.value, unit);
}
function sameAnswer(a: MalCp006ExactAnswer, b: MalCp006ExactAnswer): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "RATIO" && b.kind === "RATIO") {
    const [a1, a2] = reduceRationalRatio(a.first, a.second);
    const [b1, b2] = reduceRationalRatio(b.first, b.second);
    return equalsRational(a1, b1) && equalsRational(a2, b2);
  }
  return a.kind !== "RATIO" && b.kind !== "RATIO" && equalsRational(a.value, b.value);
}
function options(
  correct: MalCp006ExactAnswer,
  candidates: readonly { answer: MalCp006ExactAnswer; misconceptionId: string }[],
  unit: Unit,
  seed: string,
): { answer: string; options: string[]; correctIndex: number; optionAudit: MalCp006OptionAudit[] } {
  const unique = new Map<string, { answer: MalCp006ExactAnswer; misconceptionId: string }>();
  for (const candidate of candidates) {
    if (sameAnswer(candidate.answer, correct)) continue;
    const text = answerText(candidate.answer, unit);
    if (text === answerText(correct, unit) || unique.has(text)) continue;
    unique.set(text, candidate);
  }
  if (unique.size < 3) throw new Error(`${seed}: not enough misconception distractors.`);
  const chosen = shuffle([...unique.values()], `${seed}:d`).slice(0, 3);
  const all = shuffle([{ answer: correct, misconceptionId: "CORRECT" }, ...chosen], `${seed}:p`);
  const rendered = all.map((item) => answerText(item.answer, unit));
  const correctIndex = all.findIndex((item) => sameAnswer(item.answer, correct));
  return {
    answer: answerText(correct, unit),
    options: rendered,
    correctIndex,
    optionAudit: all.map((item, index) => ({
      text: rendered[index]!, misconceptionId: item.misconceptionId, isCorrect: index === correctIndex,
    })),
  };
}
function answerFriendly(answer: MalCp006ExactAnswer): boolean {
  if (answer.kind === "RATIO") {
    const [a, b] = reduceRationalRatio(answer.first, answer.second);
    return a.numerator <= 90n && b.numerator <= 90n;
  }
  if (answer.kind === "PERCENT") return answer.value.denominator <= 4n || 10n % answer.value.denominator === 0n;
  return answer.value.denominator <= 5n || 10n % answer.value.denominator === 0n;
}
function baseFriendly(question: MalCp006DiscoveryQuestion): boolean {
  if (!answerFriendly(question.exactAnswer)) return false;
  return question.exactState.ledger.snapshots.every((snapshot) =>
    snapshot.vessels.every((v) => v.volume.denominator <= 20n && v.componentA.denominator <= 30n),
  );
}
function cleanBase(prototypeId: MalCp006Wave01V2PrototypeId, seed: string): MalCp006DiscoveryQuestion {
  for (let attempt = 0; attempt < 800; attempt += 1) {
    const candidate = generateMalCp006Wave01Question(prototypeId, `${seed}:clean:${attempt}`);
    if (baseFriendly(candidate)) return candidate;
  }
  throw new Error(`${prototypeId}: no calculation-friendly state for ${seed}.`);
}
function variant(seed: string): number { return hash(`${seed}:variant`) % 4; }
function finish(
  base: MalCp006DiscoveryQuestion,
  seed: string,
  stem: string,
  lines: string[],
  mistake: string,
  verification: string[],
  set: ReturnType<typeof options>,
): MalCp006DiscoveryQuestion {
  const learner = [stem, ...lines, mistake].join(" ").toLowerCase();
  const banned = ["component load", "salt solution component", "sugar syrup-milk", "recompute", "ledger", "state key", "current fraction"];
  const errors: string[] = [];
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (lines.length < 3 || lines.length > 4) errors.push("V2 needs three or four visible lines.");
  if (lines.filter((line) => /\d/u.test(line)).length < 3) errors.push("V2 must show numerical working in at least three lines.");
  for (const term of banned) if (learner.includes(term)) errors.push(`Forbidden learner phrase: ${term}`);
  if (new Set(set.options).size !== 4) errors.push("Options are not unique.");
  return {
    ...base,
    runtimeId: MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
    requestedSeed: seed,
    selectedSeed: base.requestedSeed,
    questionId: `MAL-CP006-W1V2-${hash(`${base.stateKey}|${seed}`).toString(16).padStart(8, "0")}`,
    stem,
    answer: set.answer,
    options: set.options,
    correctIndex: set.correctIndex,
    optionAudit: set.optionAudit,
    explanation: { visibleLines: lines, answerLine: `Answer: ${set.answer}`, optionalHelp: { commonMistake: mistake, verification } },
    validation: { ok: errors.length === 0, errors },
  };
}

function transferReturn(seed: string): MalCp006DiscoveryQuestion {
  const base = cleanBase("MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO", seed);
  const context = pick(CONTEXTS, `${seed}:context`);
  const [a0, b0] = base.exactState.initialVessels;
  const [op1, op2] = base.exactState.operations;
  if (!a0 || !b0 || op1?.kind !== "TRANSFER" || op2?.kind !== "TRANSFER") throw new Error("Bad round-trip topology.");
  const a1 = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "A")!;
  const b1 = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "B")!;
  const b2 = getMalCp006Vessel(base.exactState.ledger, "B");
  const moved1 = parts(b0, op1.amount);
  const moved2 = parts(a1, op2.amount);
  const water2 = malCp006ComponentB(b2);
  const correct: MalCp006ExactAnswer = { kind: "RATIO", first: b2.componentA, second: water2 };
  const wrongA = multiplyRational(op2.amount, frac(a0));
  const wrongB = multiplyRational(op2.amount, frac(b0));
  const set = options(correct, [
    { answer: { kind: "RATIO", first: addRational(b1.componentA, wrongA), second: addRational(malCp006ComponentB(b1), subtractRational(op2.amount, wrongA)) }, misconceptionId: "USED_A_STARTING_PERCENT_FOR_RETURN" },
    { answer: { kind: "RATIO", first: addRational(b1.componentA, wrongB), second: addRational(malCp006ComponentB(b1), subtractRational(op2.amount, wrongB)) }, misconceptionId: "USED_B_STARTING_PERCENT_FOR_RETURN" },
    { answer: { kind: "RATIO", first: addRational(b1.componentA, op2.amount), second: malCp006ComponentB(b1) }, misconceptionId: "TREATED_RETURN_AS_PURE_FIRST_LIQUID" },
    { answer: { kind: "RATIO", first: water2, second: b2.componentA }, misconceptionId: "REVERSED_RATIO" },
  ], context.unit, seed);
  const pA = percent(a0), pB = percent(b0), v = variant(seed);
  const stems = [
    `Vessels A and B each contain ${qty(a0.volume, context.unit)} of a ${context.mixture}. A contains ${pct(pA)} ${context.first} and B contains ${pct(pB)} ${context.first}. ${qty(op1.amount, context.unit)} is transferred from B to A. After mixing A, ${qty(op2.amount, context.unit)} is transferred back to B. What is the final ratio of ${context.first} to ${context.second} in B?`,
    `A and B each hold ${qty(a0.volume, context.unit)} of a ${context.mixture}, with ${pct(pA)} and ${pct(pB)} ${context.first}, respectively. First ${qty(op1.amount, context.unit)} goes B→A; then, after mixing, ${qty(op2.amount, context.unit)} goes A→B. Find ${context.first} : ${context.second} in B at the end.`,
    `Two equal vessels contain ${qty(a0.volume, context.unit)} each of a ${context.mixture}. The ${context.first} percentages are ${pct(pA)} in A and ${pct(pB)} in B. Transfer ${qty(op1.amount, context.unit)} from B to A, mix, and return ${qty(op2.amount, context.unit)} from A to B. What is B's final ${context.first}-to-${context.second} ratio?`,
    `Vessel A has ${qty(a0.volume, context.unit)} of ${pct(pA)} ${context.first} mixture and B has the same quantity at ${pct(pB)}. After ${qty(op1.amount, context.unit)} is moved B→A and ${qty(op2.amount, context.unit)} of the mixed A is moved back, what is ${context.first} : ${context.second} in B?`,
  ];
  const lines = [
    `B→A: ${context.first} moved = ${pct(pB)} of ${qty(op1.amount, context.unit)} = ${qty(moved1.first, context.unit)}; ${context.second} moved = ${qty(moved1.second, context.unit)}.`,
    `A now has ${qty(a1.componentA, context.unit)} ${context.first} in ${qty(a1.volume, context.unit)}. Therefore the ${qty(op2.amount, context.unit)} returned from A contains ${qty(moved2.first, context.unit)} ${context.first} and ${qty(moved2.second, context.unit)} ${context.second}.`,
    `B finally has ${qty(b2.componentA, context.unit)} ${context.first} and ${qty(water2, context.unit)} ${context.second}.`,
    `Required ratio = ${num(b2.componentA)} : ${num(water2)} = ${ratio(b2.componentA, water2)}.`,
  ];
  return finish(base, seed, stems[v]!, lines, `Do not use A's starting ${pct(pA)} for the return transfer; A has already received liquid from B.`, [`The two final amounts in B add to ${qty(b2.volume, context.unit)}.`], set);
}

function equalExchange(seed: string): MalCp006DiscoveryQuestion {
  const base = cleanBase("MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS", seed);
  const context = pick(CONTEXTS, `${seed}:exchange-context`);
  const [a, b] = base.exactState.initialVessels;
  const op = base.exactState.operations[0];
  if (!a || !b || op?.kind !== "SIMULTANEOUS_EQUAL_EXCHANGE") throw new Error("Bad equal-exchange topology.");
  const correct: MalCp006ExactAnswer = { kind: "QUANTITY", value: op.amount };
  const set = options(correct, [
    { answer: { kind: "QUANTITY", value: divideRational(op.amount, rational(2)) }, misconceptionId: "USED_HALF_THE_REQUIRED_EXCHANGE" },
    { answer: { kind: "QUANTITY", value: divideRational(a.volume, rational(2)) }, misconceptionId: "USED_HALF_OF_A" },
    { answer: { kind: "QUANTITY", value: divideRational(b.volume, rational(2)) }, misconceptionId: "USED_HALF_OF_B" },
    { answer: { kind: "QUANTITY", value: divideRational(addRational(a.volume, b.volume), rational(4)) }, misconceptionId: "AVERAGED_VOLUMES_THEN_HALVED" },
  ], context.unit, seed);
  const pA = percent(a), pB = percent(b), v = variant(seed);
  const stems = [
    `Vessel A contains ${qty(a.volume, context.unit)} of a ${context.mixture} with ${pct(pA)} ${context.first}, while B contains ${qty(b.volume, context.unit)} with ${pct(pB)} ${context.first}. The same quantity is taken from each vessel at the same time and poured into the other. How much must be exchanged so that the final ${context.first} percentages are equal?`,
    `A has ${qty(a.volume, context.unit)} of ${pct(pA)} ${context.first} mixture and B has ${qty(b.volume, context.unit)} of ${pct(pB)} mixture. Equal quantities are simultaneously exchanged. What quantity makes the two final concentrations equal?`,
    `Two vessels contain ${qty(a.volume, context.unit)} and ${qty(b.volume, context.unit)} of the same ${context.mixture}, at ${pct(pA)} and ${pct(pB)} ${context.first}. If equal quantities are swapped simultaneously, how much must move from each vessel so that both end at the same concentration?`,
    `Vessels A and B hold ${qty(a.volume, context.unit)} and ${qty(b.volume, context.unit)} of a ${context.mixture} containing ${pct(pA)} and ${pct(pB)} ${context.first}. Find the equal amount that must be exchanged simultaneously to make the final concentrations equal.`,
  ];
  const lines = [
    `Let the exchanged amount be x. In A, final ${context.first} = ${pct(pA)} of (${num(a.volume)} − x) + ${pct(pB)} of x.`,
    `In B, final ${context.first} = ${pct(pB)} of (${num(b.volume)} − x) + ${pct(pA)} of x. Divide by ${num(a.volume)} and ${num(b.volume)} respectively and equate the concentrations.`,
    `The unequal starting percentages cancel, giving x = (${num(a.volume)} × ${num(b.volume)}) ÷ (${num(a.volume)} + ${num(b.volume)}) = ${qty(op.amount, context.unit)}.`,
  ];
  return finish(base, seed, stems[v]!, lines, "Do not simply take half of one vessel or average the two vessel sizes.", [`Substituting ${qty(op.amount, context.unit)} gives exactly equal final concentrations.`], set);
}

function threeCycle(seed: string): MalCp006DiscoveryQuestion {
  const base = cleanBase("MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION", seed);
  const context: Context = { first: "salt", second: "water", mixture: "salt-water solution", unit: "ml" };
  const [a0, b0, c0] = base.exactState.initialVessels;
  const [op1, op2, op3] = base.exactState.operations;
  if (!a0 || !b0 || !c0 || op1?.kind !== "TRANSFER" || op2?.kind !== "TRANSFER" || op3?.kind !== "TRANSFER") throw new Error("Bad three-cycle topology.");
  const b1 = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "B")!;
  const c2 = base.exactState.ledger.snapshots[2]!.vessels.find((v) => v.id === "C")!;
  const a3 = getMalCp006Vessel(base.exactState.ledger, "A");
  const m1 = parts(a0, op1.amount), m2 = parts(b1, op2.amount), m3 = parts(c2, op3.amount);
  const correct: MalCp006ExactAnswer = { kind: "PERCENT", value: malCp006ConcentrationPercent(a3) };
  const wrongC = multiplyRational(divideRational(addRational(subtractRational(a0.componentA, m1.first), multiplyRational(op3.amount, frac(c0))), a3.volume), HUNDRED);
  const wrongBMove = multiplyRational(op2.amount, frac(b0));
  const wrongC2First = addRational(c0.componentA, wrongBMove);
  const wrongC2Volume = addRational(c0.volume, op2.amount);
  const wrongReturn = multiplyRational(op3.amount, divideRational(wrongC2First, wrongC2Volume));
  const wrongB = multiplyRational(divideRational(addRational(subtractRational(a0.componentA, m1.first), wrongReturn), a3.volume), HUNDRED);
  const set = options(correct, [
    { answer: { kind: "PERCENT", value: wrongC }, misconceptionId: "USED_C_STARTING_PERCENT_ON_LAST_TRANSFER" },
    { answer: { kind: "PERCENT", value: wrongB }, misconceptionId: "USED_B_STARTING_PERCENT_ON_SECOND_TRANSFER" },
    { answer: { kind: "PERCENT", value: subtractRational(HUNDRED, correct.value) }, misconceptionId: "REPORTED_WATER_PERCENT" },
    { answer: { kind: "PERCENT", value: percent(a0) }, misconceptionId: "IGNORED_ALL_TRANSFERS" },
  ], context.unit, seed);
  const pA = percent(a0), pB = percent(b0), pC = percent(c0), v = variant(seed);
  const stems = [
    `Vessels A, B and C each contain ${qty(a0.volume, context.unit)} of salt-water solution at ${pct(pA)}, ${pct(pB)} and ${pct(pC)} salt. ${qty(op1.amount, context.unit)} is transferred A→B, then the same amount from the mixed B→C, and finally from the mixed C→A. What is the final salt concentration in A?`,
    `A, B and C each have ${qty(a0.volume, context.unit)} of salt solution with strengths ${pct(pA)}, ${pct(pB)} and ${pct(pC)}. Move ${qty(op1.amount, context.unit)} successively A→B→C→A, mixing before each next transfer. Find A's final salt percentage.`,
    `Three vessels contain equal quantities, ${qty(a0.volume, context.unit)} each, of ${pct(pA)}, ${pct(pB)} and ${pct(pC)} salt solution. The same ${qty(op1.amount, context.unit)} is moved A→B, B→C and C→A, with mixing at every stage. What percentage of salt is finally in A?`,
    `Each of A, B and C holds ${qty(a0.volume, context.unit)} of salt-water solution, containing ${pct(pA)}, ${pct(pB)} and ${pct(pC)} salt. After successive transfers of ${qty(op1.amount, context.unit)} along A→B→C→A, what is A's final salt concentration?`,
  ];
  const lines = [
    `A→B: salt moved = ${pct(pA)} of ${qty(op1.amount, context.unit)} = ${qty(m1.first, context.unit)}. B now has ${qty(b1.componentA, context.unit)} salt in ${qty(b1.volume, context.unit)}.`,
    `B→C: ${qty(op2.amount, context.unit)} of this new B mixture carries ${qty(m2.first, context.unit)} salt. C now has ${qty(c2.componentA, context.unit)} salt in ${qty(c2.volume, context.unit)}.`,
    `C→A: the last ${qty(op3.amount, context.unit)} carries ${qty(m3.first, context.unit)} salt back to A.`,
    `A finally has ${qty(a3.componentA, context.unit)} salt in ${qty(a3.volume, context.unit)}; concentration = ${num(a3.componentA)} ÷ ${num(a3.volume)} × 100 = ${pct(correct.value)}.`,
  ];
  return finish(base, seed, stems[v]!, lines, "B and C change after receiving liquid, so do not use their starting percentages for later transfers.", ["Total salt across all three vessels is unchanged."], set);
}

function refillRetransfer(seed: string): MalCp006DiscoveryQuestion {
  const base = cleanBase("MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO", seed);
  const context: Context = { first: "spirit", second: "water", mixture: "spirit-water mixture", unit: "litres" };
  const [a0] = base.exactState.initialVessels;
  const [op1, refill, op3] = base.exactState.operations;
  if (!a0 || op1?.kind !== "TRANSFER" || refill?.kind !== "REFILL" || op3?.kind !== "TRANSFER") throw new Error("Bad refill topology.");
  const a2 = base.exactState.ledger.snapshots[2]!.vessels.find((v) => v.id === "A")!;
  const b3 = getMalCp006Vessel(base.exactState.ledger, "B");
  const m1 = parts(a0, op1.amount), m2 = parts(a2, op3.amount);
  const water3 = malCp006ComponentB(b3);
  const correct: MalCp006ExactAnswer = { kind: "RATIO", first: water3, second: b3.componentA };
  const wrongSecondSpirit = multiplyRational(op3.amount, frac(a0));
  const set = options(correct, [
    { answer: { kind: "RATIO", first: addRational(m1.second, subtractRational(op3.amount, wrongSecondSpirit)), second: addRational(m1.first, wrongSecondSpirit) }, misconceptionId: "USED_ORIGINAL_PERCENT_AFTER_REFILL" },
    { answer: { kind: "RATIO", first: addRational(m1.second, op3.amount), second: m1.first }, misconceptionId: "TREATED_SECOND_TRANSFER_AS_PURE_WATER" },
    { answer: { kind: "RATIO", first: m1.second, second: addRational(m1.first, op3.amount) }, misconceptionId: "TREATED_SECOND_TRANSFER_AS_PURE_SPIRIT" },
    { answer: { kind: "RATIO", first: b3.componentA, second: water3 }, misconceptionId: "REVERSED_WATER_SPIRIT_RATIO" },
  ], context.unit, seed);
  const p0 = percent(a0), p2 = percent(a2), v = variant(seed);
  const stems = [
    `Container A has ${qty(a0.volume, context.unit)} of a spirit-water mixture containing ${pct(p0)} spirit; B is empty. ${qty(op1.amount, context.unit)} is transferred to B. A is refilled with the same amount of pure water and mixed. Then ${qty(op3.amount, context.unit)} is transferred from A to B again. What is the final ratio of water to spirit in B?`,
    `A contains ${qty(a0.volume, context.unit)} of ${pct(p0)} spirit mixture and B starts empty. Move ${qty(op1.amount, context.unit)} to B, replace it in A with pure water, mix A, and then move ${qty(op3.amount, context.unit)} more to B. Find water : spirit in B.`,
    `A has ${qty(a0.volume, context.unit)} of a mixture that is ${pct(p0)} spirit. After ${qty(op1.amount, context.unit)} is sent to empty B, the same amount of pure water is added to A. A is mixed and ${qty(op3.amount, context.unit)} is sent to B. What is B's final water-to-spirit ratio?`,
    `From ${qty(a0.volume, context.unit)} of ${pct(p0)} spirit mixture in A, ${qty(op1.amount, context.unit)} goes to empty B. A is topped back up with pure water, mixed, and ${qty(op3.amount, context.unit)} more is sent to B. What is water : spirit in B?`,
  ];
  const lines = [
    `First transfer: spirit = ${pct(p0)} of ${qty(op1.amount, context.unit)} = ${qty(m1.first, context.unit)}; water = ${qty(m1.second, context.unit)}.`,
    `After adding ${qty(refill.amount, context.unit)} pure water, A has ${qty(a2.componentA, context.unit)} spirit in ${qty(a2.volume, context.unit)}, so A is now ${pct(p2)} spirit.`,
    `Second transfer: spirit = ${pct(p2)} of ${qty(op3.amount, context.unit)} = ${qty(m2.first, context.unit)}; water = ${qty(m2.second, context.unit)}.`,
    `B finally has ${qty(water3, context.unit)} water and ${qty(b3.componentA, context.unit)} spirit; water : spirit = ${ratio(water3, b3.componentA)}.`,
  ];
  return finish(base, seed, stems[v]!, lines, `After pure water is added, A changes from ${pct(p0)} to ${pct(p2)} spirit. Use the new percentage for the second transfer.`, [`B's final spirit and water add to ${qty(b3.volume, context.unit)}.`], set);
}

function pureRoundTrip(seed: string): MalCp006DiscoveryQuestion {
  const base = cleanBase("MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO", seed);
  const context: Context = { first: "milk", second: "water", mixture: "milk-water mixture", unit: "litres" };
  const [a0, b0] = base.exactState.initialVessels;
  const [op1, op2] = base.exactState.operations;
  if (!a0 || !b0 || op1?.kind !== "TRANSFER" || op2?.kind !== "TRANSFER") throw new Error("Bad pure round trip.");
  const b1 = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "B")!;
  const a2 = getMalCp006Vessel(base.exactState.ledger, "A");
  const b2 = getMalCp006Vessel(base.exactState.ledger, "B");
  const returned = parts(b1, op2.amount);
  const waterB = malCp006ComponentB(b2);
  const correct: MalCp006ExactAnswer = { kind: "RATIO", first: a2.componentA, second: waterB };
  const milkAfterFirst = subtractRational(a0.componentA, op1.amount);
  const set = options(correct, [
    { answer: { kind: "RATIO", first: milkAfterFirst, second: subtractRational(b0.volume, op2.amount) }, misconceptionId: "TREATED_RETURN_AS_PURE_WATER" },
    { answer: { kind: "RATIO", first: addRational(milkAfterFirst, op2.amount), second: b0.volume }, misconceptionId: "TREATED_RETURN_AS_PURE_MILK" },
    { answer: { kind: "RATIO", first: milkAfterFirst, second: b0.volume }, misconceptionId: "IGNORED_RETURN_TRANSFER" },
    { answer: { kind: "RATIO", first: waterB, second: a2.componentA }, misconceptionId: "REVERSED_CROSS_VESSEL_RATIO" },
  ], context.unit, seed);
  const pB = percent(b1), v = variant(seed);
  const stems = [
    `Vessel A contains ${qty(a0.volume, context.unit)} of pure milk and vessel B contains ${qty(b0.volume, context.unit)} of pure water. ${qty(op1.amount, context.unit)} of milk is transferred from A to B and mixed. Then ${qty(op2.amount, context.unit)} of the mixture in B is transferred back to A. What is the ratio of the final milk in A to the final water in B?`,
    `A starts with ${qty(a0.volume, context.unit)} pure milk and B with ${qty(b0.volume, context.unit)} pure water. Move ${qty(op1.amount, context.unit)} A→B, mix B, and return ${qty(op2.amount, context.unit)} B→A. Find final milk in A : final water in B.`,
    `There are ${qty(a0.volume, context.unit)} of pure milk in A and ${qty(b0.volume, context.unit)} of pure water in B. After ${qty(op1.amount, context.unit)} milk is added to B, B is mixed and ${qty(op2.amount, context.unit)} is sent back to A. What is the final ratio of milk in A to water in B?`,
    `A has ${qty(a0.volume, context.unit)} pure milk; B has ${qty(b0.volume, context.unit)} pure water. ${qty(op1.amount, context.unit)} goes A→B, B is mixed, then ${qty(op2.amount, context.unit)} goes B→A. What is final milk in A : final water in B?`,
  ];
  const lines = [
    `After A→B, B has ${qty(op1.amount, context.unit)} milk and ${qty(b0.volume, context.unit)} water, total ${qty(b1.volume, context.unit)}.`,
    `Milk percentage in B = ${num(op1.amount)} ÷ ${num(b1.volume)} × 100 = ${pct(pB)}. So the ${qty(op2.amount, context.unit)} returned contains ${qty(returned.first, context.unit)} milk and ${qty(returned.second, context.unit)} water.`,
    `Milk in A = ${num(a0.volume)} − ${num(op1.amount)} + ${num(returned.first)} = ${qty(a2.componentA, context.unit)}; water left in B = ${qty(waterB, context.unit)}.`,
    `Required ratio = ${num(a2.componentA)} : ${num(waterB)} = ${ratio(a2.componentA, waterB)}.`,
  ];
  return finish(base, seed, stems[v]!, lines, "The return from B is a milk-water mixture, not pure water or pure milk.", ["Total milk and total water across A and B remain unchanged."], set);
}

export function generateMalCp006Wave01EditorialV2Question(
  prototypeId: MalCp006Wave01V2PrototypeId,
  seed = "mal-cp006-wave01-v2:default",
): MalCp006DiscoveryQuestion {
  switch (prototypeId) {
    case "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO": return transferReturn(seed);
    case "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS": return equalExchange(seed);
    case "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION": return threeCycle(seed);
    case "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO": return refillRetransfer(seed);
    case "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO": return pureRoundTrip(seed);
  }
}

export function verifyMalCp006Wave01V2Answer(question: MalCp006DiscoveryQuestion): boolean {
  const ledger = solveMalCp006Ledger(question.exactState.initialVessels, question.exactState.operations);
  switch (question.prototypeId) {
    case "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO": {
      if (question.exactAnswer.kind !== "RATIO") return false;
      const b = getMalCp006Vessel(ledger, "B");
      return ratio(b.componentA, malCp006ComponentB(b)) === ratio(question.exactAnswer.first, question.exactAnswer.second);
    }
    case "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS": {
      if (question.exactAnswer.kind !== "QUANTITY") return false;
      const [a, b] = question.exactState.initialVessels;
      return Boolean(a && b && verifyMalCp006EqualExchange(a.volume, b.volume, frac(a), frac(b), question.exactAnswer.value));
    }
    case "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION":
      return question.exactAnswer.kind === "PERCENT" && equalsRational(malCp006ConcentrationPercent(getMalCp006Vessel(ledger, "A")), question.exactAnswer.value);
    case "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO": {
      if (question.exactAnswer.kind !== "RATIO") return false;
      const b = getMalCp006Vessel(ledger, "B");
      return ratio(malCp006ComponentB(b), b.componentA) === ratio(question.exactAnswer.first, question.exactAnswer.second);
    }
    case "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO": {
      if (question.exactAnswer.kind !== "RATIO") return false;
      const a = getMalCp006Vessel(ledger, "A"), b = getMalCp006Vessel(ledger, "B");
      return ratio(a.componentA, malCp006ComponentB(b)) === ratio(question.exactAnswer.first, question.exactAnswer.second);
    }
    case "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE": return false;
  }
}

export function malCp006Wave01V2Stable(question: MalCp006DiscoveryQuestion): string {
  return JSON.stringify(question, (_key, value) => typeof value === "bigint" ? `${value}n` : value);
}
