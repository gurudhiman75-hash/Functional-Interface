import { generateMalCp006Wave01Question } from "./cp006-discovery-runtime-wave01";
import {
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
} from "./rational";
import {
  solveMalCp006EqualExchangeAmount,
  solveMalCp006Ledger,
} from "./cp006-solver";
import {
  MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
  type MalCp006DiscoveryQuestion,
  type MalCp006ExactAnswer,
  type MalCp006OptionAudit,
  type MalCp006VesselState,
} from "./cp006-types";

function hash(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const output = [...values];
  let state = hash(seed) || 1;
  for (let index = output.length - 1; index > 0; index -= 1) {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    const swapIndex = state % (index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

function absBig(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function friendlyNumber(value: { numerator: bigint; denominator: bigint }): string {
  if (value.denominator === 1n) return String(value.numerator);
  if (100n % value.denominator === 0n) {
    const scaled = value.numerator * (100n / value.denominator);
    const sign = scaled < 0n ? "-" : "";
    const absolute = absBig(scaled);
    const whole = absolute / 100n;
    const decimal = String(absolute % 100n)
      .padStart(2, "0")
      .replace(/0+$/u, "");
    return decimal ? `${sign}${whole}.${decimal}` : `${sign}${whole}`;
  }
  return formatRational(value);
}

const CAPACITY_PAIRS = [
  [12, 18], [12, 24], [12, 36], [16, 24], [16, 48],
  [18, 30], [20, 30], [24, 30], [24, 36], [24, 48],
  [30, 45], [36, 45], [40, 24],
] as const;

const CONCENTRATION_PAIRS = [
  [20, 80], [25, 75], [30, 70], [40, 60],
  [20, 60], [25, 80], [30, 80], [40, 75],
] as const;

const CONTEXTS = [
  { first: "milk", mixture: "milk-water mixture" },
  { first: "salt", mixture: "salt-water solution" },
  { first: "alcohol", mixture: "alcohol-water mixture" },
  { first: "acid", mixture: "acid-water solution" },
] as const;

export function generateMalCp006EqualExchangeV2Final(
  seed: string,
): MalCp006DiscoveryQuestion {
  const metadata = generateMalCp006Wave01Question(
    "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
    `${seed}:metadata`,
  );
  const [aNumber, bNumber] = CAPACITY_PAIRS[hash(`${seed}:capacity`) % CAPACITY_PAIRS.length]!;
  const [lowPercent, highPercent] = CONCENTRATION_PAIRS[hash(`${seed}:concentration`) % CONCENTRATION_PAIRS.length]!;
  const context = CONTEXTS[hash(`${seed}:context`) % CONTEXTS.length]!;

  const capacityA = rational(aNumber);
  const capacityB = rational(bNumber);
  const low = rational(lowPercent, 100);
  const high = rational(highPercent, 100);
  const exchange = solveMalCp006EqualExchangeAmount(capacityA, capacityB, low, high);

  const initialVessels: readonly MalCp006VesselState[] = [
    { id: "A", volume: capacityA, componentA: multiplyRational(capacityA, low) },
    { id: "B", volume: capacityB, componentA: multiplyRational(capacityB, high) },
  ];
  const operations = [{
    kind: "SIMULTANEOUS_EQUAL_EXCHANGE" as const,
    vesselA: "A",
    vesselB: "B",
    amount: exchange,
  }] as const;
  const ledger = solveMalCp006Ledger(initialVessels, operations);
  const exactAnswer: MalCp006ExactAnswer = { kind: "QUANTITY", value: exchange };

  const wrongCandidates = [
    { value: divideRational(exchange, rational(2)), misconceptionId: "EXCHANGED_ONLY_HALF_REQUIRED" },
    { value: divideRational(capacityA, rational(2)), misconceptionId: "USED_HALF_OF_VESSEL_A" },
    { value: divideRational(capacityB, rational(2)), misconceptionId: "USED_HALF_OF_VESSEL_B" },
    { value: divideRational(rational(aNumber + bNumber), rational(4)), misconceptionId: "AVERAGED_VESSEL_SIZES_THEN_HALVED" },
    { value: rational(Math.abs(bNumber - aNumber)), misconceptionId: "USED_DIFFERENCE_OF_VESSEL_SIZES" },
  ];
  const uniqueWrong = new Map<string, (typeof wrongCandidates)[number]>();
  for (const candidate of wrongCandidates) {
    if (candidate.value.numerator <= 0n || equalsRational(candidate.value, exchange)) continue;
    const key = rationalKey(candidate.value);
    if (!uniqueWrong.has(key)) uniqueWrong.set(key, candidate);
  }
  if (uniqueWrong.size < 3) throw new Error(`${seed}: insufficient equal-exchange misconception options.`);

  const chosenWrong = shuffle([...uniqueWrong.values()], `${seed}:wrong`).slice(0, 3);
  const entries = shuffle([
    { value: exchange, misconceptionId: "CORRECT", isCorrect: true },
    ...chosenWrong.map((item) => ({ ...item, isCorrect: false })),
  ], `${seed}:positions`);
  const optionText = (value: typeof exchange) => `${friendlyNumber(value)} litres`;
  const options = entries.map((entry) => optionText(entry.value));
  const correctIndex = entries.findIndex((entry) => entry.isCorrect);
  const optionAudit: MalCp006OptionAudit[] = entries.map((entry) => ({
    text: optionText(entry.value),
    misconceptionId: entry.misconceptionId,
    isCorrect: entry.isCorrect,
  }));

  const stems = [
    `Vessel A contains ${aNumber} litres of a ${context.mixture} with ${lowPercent}% ${context.first}, while vessel B contains ${bNumber} litres with ${highPercent}% ${context.first}. The same quantity is taken from each vessel at the same time and poured into the other. How many litres must be exchanged so that the final ${context.first} percentages are equal?`,
    `A has ${aNumber} litres of ${lowPercent}% ${context.first} mixture and B has ${bNumber} litres of ${highPercent}% ${context.first} mixture. Equal quantities are exchanged simultaneously between the two vessels. What quantity must be exchanged to make their final concentrations equal?`,
    `Two vessels contain ${aNumber} litres and ${bNumber} litres of the same ${context.mixture}, with ${lowPercent}% and ${highPercent}% ${context.first}, respectively. If equal quantities are swapped simultaneously, how much must be moved from each vessel so that both end with the same concentration?`,
    `Vessels A and B hold ${aNumber} litres and ${bNumber} litres of a ${context.mixture}, containing ${lowPercent}% and ${highPercent}% ${context.first}. What equal amount must be exchanged simultaneously to make the final concentrations equal?`,
  ];

  const answer = optionText(exchange);
  return {
    ...metadata,
    runtimeId: MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
    requestedSeed: seed,
    selectedSeed: seed,
    questionId: `MAL-CP006-W1V2-EQ-${hash(seed).toString(16).padStart(8, "0")}`,
    stateKey: `A:${aNumber}:${lowPercent}|B:${bNumber}:${highPercent}|X:${rationalKey(exchange)}`,
    siblingStateKey: `EQUAL-EXCHANGE-AMOUNT|${aNumber}|${bNumber}`,
    difficulty: "Medium",
    answerSemantic: "TRANSFER_QUANTITY",
    stem: stems[hash(`${seed}:stem`) % stems.length]!,
    answer,
    exactAnswer,
    options,
    correctIndex,
    optionAudit,
    explanation: {
      visibleLines: [
        `Let x litres be exchanged. In A, final ${context.first} = ${lowPercent}% of (${aNumber} − x) + ${highPercent}% of x.`,
        `In B, final ${context.first} = ${highPercent}% of (${bNumber} − x) + ${lowPercent}% of x. Divide these by ${aNumber} and ${bNumber} and equate the two concentrations.`,
        `On simplifying, x = (${aNumber} × ${bNumber}) ÷ (${aNumber} + ${bNumber}) = ${friendlyNumber(exchange)} litres.`,
      ],
      answerLine: `Answer: ${answer}`,
      optionalHelp: {
        commonMistake: "Do not simply take half of either vessel or average the vessel sizes. Both vessel volumes are used in the equation.",
        verification: [`Exchanging ${friendlyNumber(exchange)} litres gives equal final ${context.first} concentrations in A and B.`],
      },
    },
    exactState: { initialVessels, operations, ledger },
    validation: { ok: true, errors: [] },
  };
}
