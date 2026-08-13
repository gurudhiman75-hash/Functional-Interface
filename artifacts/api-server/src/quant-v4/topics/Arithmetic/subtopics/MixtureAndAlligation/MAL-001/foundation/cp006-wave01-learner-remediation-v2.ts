import {
  addRational,
  compareRational,
  divideRational,
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
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
      "Once equal final concentrations are guaranteed, the requested common concentration is total initial solute divided by total initial liquid. The exchange quantity is unnecessary to the answer, so the learner task collapses to CP-001 weighted blending rather than requiring a CP-006 vessel ledger.",
  },
});

interface LearnerContext {
  componentA: string;
  componentB: string;
  mixture: string;
  unit: "litres" | "ml";
}

const NATURAL_CONTEXTS: readonly LearnerContext[] = [
  {
    componentA: "milk",
    componentB: "water",
    mixture: "milk-water mixture",
    unit: "litres",
  },
  {
    componentA: "alcohol",
    componentB: "water",
    mixture: "alcohol-water mixture",
    unit: "litres",
  },
  {
    componentA: "salt",
    componentB: "water",
    mixture: "salt-water solution",
    unit: "litres",
  },
  {
    componentA: "acid",
    componentB: "water",
    mixture: "acid-water solution",
    unit: "litres",
  },
] as const;

function hash(value: string): number {
  let state = 2166136261;
  for (const character of value) {
    state ^= character.codePointAt(0) ?? 0;
    state = Math.imul(state, 16777619);
  }
  return state >>> 0;
}

function pick<T>(values: readonly T[], seed: string): T {
  if (values.length === 0) throw new Error("Cannot pick from an empty list.");
  return values[hash(seed) % values.length]!;
}

function shuffle<T>(values: readonly T[], seed: string): T[] {
  const output = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!];
  }
  return output;
}

function absBigInt(value: bigint): bigint {
  return value < 0n ? -value : value;
}

function friendlyNumber(value: Rational): string {
  if (value.denominator === 1n) return String(value.numerator);
  if (100n % value.denominator === 0n) {
    const scaled = value.numerator * (100n / value.denominator);
    const sign = scaled < 0n ? "-" : "";
    const absolute = absBigInt(scaled);
    const whole = absolute / 100n;
    const decimal = String(absolute % 100n).padStart(2, "0").replace(/0+$/u, "");
    return decimal.length > 0 ? `${sign}${whole}.${decimal}` : `${sign}${whole}`;
  }
  return formatRational(value);
}

function quantityText(value: Rational, unit: LearnerContext["unit"]): string {
  return `${friendlyNumber(value)} ${unit}`;
}

function percentText(value: Rational): string {
  return `${friendlyNumber(value)}%`;
}

function ratioText(first: Rational, second: Rational): string {
  const [a, b] = reduceRationalRatio(first, second);
  return `${friendlyNumber(a)} : ${friendlyNumber(b)}`;
}

function fractionOf(vessel: MalCp006VesselState): Rational {
  return divideRational(vessel.componentA, vessel.volume);
}

function percentageOf(vessel: MalCp006VesselState): Rational {
  return multiplyRational(fractionOf(vessel), HUNDRED);
}

function movedParts(vessel: MalCp006VesselState, amount: Rational): {
  componentA: Rational;
  componentB: Rational;
} {
  const componentA = multiplyRational(amount, fractionOf(vessel));
  return {
    componentA,
    componentB: subtractRational(amount, componentA),
  };
}

function sameExactAnswer(a: MalCp006ExactAnswer, b: MalCp006ExactAnswer): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "RATIO" && b.kind === "RATIO") {
    const [a1, a2] = reduceRationalRatio(a.first, a.second);
    const [b1, b2] = reduceRationalRatio(b.first, b.second);
    return equalsRational(a1, b1) && equalsRational(a2, b2);
  }
  if (a.kind === "PERCENT" && b.kind === "PERCENT") {
    return equalsRational(a.value, b.value);
  }
  if (a.kind === "QUANTITY" && b.kind === "QUANTITY") {
    return equalsRational(a.value, b.value);
  }
  return false;
}

function answerText(answer: MalCp006ExactAnswer, unit: LearnerContext["unit"]): string {
  if (answer.kind === "RATIO") return ratioText(answer.first, answer.second);
  if (answer.kind === "PERCENT") return percentText(answer.value);
  return quantityText(answer.value, unit);
}

interface OptionCandidate {
  answer: MalCp006ExactAnswer;
  misconceptionId: string;
}

function buildOptions(
  correct: MalCp006ExactAnswer,
  candidates: readonly OptionCandidate[],
  unit: LearnerContext["unit"],
  seed: string,
+): {
+  answer: string;
+  options: string[];
+  correctIndex: number;
+  optionAudit: MalCp006OptionAudit[];
+} {
+  const correctText = answerText(correct, unit);
+  const unique = new Map<string, OptionCandidate>();
+  for (const candidate of candidates) {
+    if (sameExactAnswer(correct, candidate.answer)) continue;
+    const text = answerText(candidate.answer, unit);
+    if (text === correctText || unique.has(text)) continue;
+    unique.set(text, candidate);
+  }
+  if (unique.size < 3) {
+    throw new Error(`V2 misconception pool produced fewer than three unique distractors for ${seed}.`);
+  }
+  const distractors = shuffle([...unique.values()], `${seed}:distractors`).slice(0, 3);
+  const selected = shuffle(
+    [{ answer: correct, misconceptionId: "CORRECT" }, ...distractors],
+    `${seed}:positions`,
+  );
+  const options = selected.map((entry) => answerText(entry.answer, unit));
+  const correctIndex = selected.findIndex((entry) => sameExactAnswer(entry.answer, correct));
+  return {
+    answer: correctText,
+    options,
+    correctIndex,
+    optionAudit: selected.map((entry, index) => ({
+      text: options[index]!,
+      misconceptionId: entry.misconceptionId,
+      isCorrect: index === correctIndex,
+    })),
+  };
+}
+
+function rationalFriendly(value: Rational, maxDenominator = 30n): boolean {
+  return value.denominator <= maxDenominator;
+}
+
+function exactAnswerFriendly(answer: MalCp006ExactAnswer): boolean {
+  if (answer.kind === "RATIO") {
+    const [a, b] = reduceRationalRatio(answer.first, answer.second);
+    return a.numerator <= 90n && b.numerator <= 90n;
+  }
+  if (answer.kind === "PERCENT") {
+    return (
+      answer.value.denominator <= 4n ||
+      10n % answer.value.denominator === 0n
+    );
+  }
+  return answer.value.denominator <= 5n || 10n % answer.value.denominator === 0n;
+}
+
+function numericallyFriendly(question: MalCp006DiscoveryQuestion): boolean {
+  if (!exactAnswerFriendly(question.exactAnswer)) return false;
+  for (const vessel of question.exactState.initialVessels) {
+    if (!rationalFriendly(vessel.volume, 10n) || !rationalFriendly(vessel.componentA, 20n)) {
+      return false;
+    }
+  }
+  for (const operation of question.exactState.operations) {
+    if (!rationalFriendly(operation.amount, 10n)) return false;
+  }
+  for (const snapshot of question.exactState.ledger.snapshots) {
+    for (const vessel of snapshot.vessels) {
+      if (!rationalFriendly(vessel.volume, 20n) || !rationalFriendly(vessel.componentA, 30n)) {
+        return false;
+      }
+    }
+  }
+  return true;
+}
+
+function selectFriendlyBase(
+  prototypeId: MalCp006Wave01V2PrototypeId,
+  seed: string,
+): MalCp006DiscoveryQuestion {
+  for (let attempt = 0; attempt < 600; attempt += 1) {
+    const candidateSeed = `${seed}:friendly:${attempt}`;
+    const candidate = generateMalCp006Wave01Question(prototypeId, candidateSeed);
+    if (numericallyFriendly(candidate)) return candidate;
+  }
+  throw new Error(`${prototypeId}: could not find a calculation-friendly exact state for ${seed}.`);
+}
+
+function contextualise(seed: string): LearnerContext {
+  return pick(NATURAL_CONTEXTS, `${seed}:learner-context`);
+}
+
+function stemVariant(seed: string): 1 | 2 | 3 | 4 {
+  return ((hash(`${seed}:stem-variant`) % 4) + 1) as 1 | 2 | 3 | 4;
+}
+
+function stateHash(base: MalCp006DiscoveryQuestion, seed: string): string {
+  return `MAL-CP006-W1V2-${hash(`${base.prototypeId}|${base.stateKey}|${seed}`).toString(16).padStart(8, "0")}`;
+}
+
+function finalise(
+  base: MalCp006DiscoveryQuestion,
+  seed: string,
+  stem: string,
+  visibleLines: string[],
+  commonMistake: string,
+  verification: string[],
+  optionSet: ReturnType<typeof buildOptions>,
+): MalCp006DiscoveryQuestion {
+  const forbidden = [
+    "component load",
+    "salt solution component",
+    "sugar syrup-milk",
+    "recompute",
+    "ledger",
+    "state key",
+    "current fraction",
+  ];
+  const learnerText = [stem, ...visibleLines, commonMistake].join(" ").toLowerCase();
+  const errors: string[] = [];
+  if (!stem.endsWith("?")) errors.push("Stem must end with a question mark.");
+  if (visibleLines.length < 3 || visibleLines.length > 4) {
+    errors.push("V2 visible solution must have three or four calculation-first lines.");
+  }
+  if (visibleLines.filter((line) => /\d/u.test(line)).length < 3) {
+    errors.push("At least three visible solution lines must show actual numerical working.");
+  }
+  for (const phrase of forbidden) {
+    if (learnerText.includes(phrase)) errors.push(`Forbidden learner phrase: ${phrase}`);
+  }
+  if (new Set(optionSet.options).size !== 4) errors.push("Options are not unique.");
+  if (optionSet.options[optionSet.correctIndex] !== optionSet.answer) {
+    errors.push("Answer/index mismatch.");
+  }
+
+  return {
+    ...base,
+    runtimeId: MAL_CP006_WAVE01_EDITORIAL_RUNTIME_ID,
+    requestedSeed: seed,
+    selectedSeed: base.requestedSeed,
+    questionId: stateHash(base, seed),
+    stem,
+    answer: optionSet.answer,
+    options: optionSet.options,
+    correctIndex: optionSet.correctIndex,
+    optionAudit: optionSet.optionAudit,
+    explanation: {
+      visibleLines,
+      answerLine: `Answer: ${optionSet.answer}`,
+      optionalHelp: { commonMistake, verification },
+    },
+    validation: { ok: errors.length === 0, errors },
+  };
+}
+
+function transferReturn(seed: string): MalCp006DiscoveryQuestion {
+  const base = selectFriendlyBase(
+    "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
+    seed,
+  );
+  const context = contextualise(seed);
+  const [initialA, initialB] = base.exactState.initialVessels;
+  const [first, second] = base.exactState.operations;
+  if (!initialA || !initialB || first?.kind !== "TRANSFER" || second?.kind !== "TRANSFER") {
+    throw new Error("Unexpected transfer-return topology.");
+  }
+  const afterFirstA = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "A")!;
+  const afterFirstB = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "B")!;
+  const finalB = getMalCp006Vessel(base.exactState.ledger, "B");
+  const firstMoved = movedParts(initialB, first.amount);
+  const secondMoved = movedParts(afterFirstA, second.amount);
+  const finalWater = malCp006ComponentB(finalB);
+  const correct: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: finalB.componentA,
+    second: finalWater,
+  };
+
+  const initialAFraction = fractionOf(initialA);
+  const initialBFraction = fractionOf(initialB);
+  const wrongInitialAReturnA = multiplyRational(second.amount, initialAFraction);
+  const wrongInitialBReturnA = multiplyRational(second.amount, initialBFraction);
+  const bAfterFirstA = afterFirstB.componentA;
+  const bAfterFirstB = malCp006ComponentB(afterFirstB);
+  const wrongUsingInitialA: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: addRational(bAfterFirstA, wrongInitialAReturnA),
+    second: addRational(
+      bAfterFirstB,
+      subtractRational(second.amount, wrongInitialAReturnA),
+    ),
+  };
+  const wrongUsingInitialB: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: addRational(bAfterFirstA, wrongInitialBReturnA),
+    second: addRational(
+      bAfterFirstB,
+      subtractRational(second.amount, wrongInitialBReturnA),
+    ),
+  };
+  const wrongPureA: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: addRational(bAfterFirstA, second.amount),
+    second: bAfterFirstB,
+  };
+  const wrongPureB: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: bAfterFirstA,
+    second: addRational(bAfterFirstB, second.amount),
+  };
+  const reversed: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: finalWater,
+    second: finalB.componentA,
+  };
+  const options = buildOptions(
+    correct,
+    [
+      { answer: wrongUsingInitialA, misconceptionId: "USED_A_INITIAL_COMPOSITION_FOR_RETURN" },
+      { answer: wrongUsingInitialB, misconceptionId: "USED_B_INITIAL_COMPOSITION_FOR_RETURN" },
+      { answer: wrongPureA, misconceptionId: "TREATED_RETURN_AS_PURE_FIRST_LIQUID" },
+      { answer: wrongPureB, misconceptionId: "TREATED_RETURN_AS_PURE_WATER" },
+      { answer: reversed, misconceptionId: "REVERSED_REQUESTED_RATIO" },
+    ],
+    context.unit,
+    seed,
+  );
+
+  const pA = percentageOf(initialA);
+  const pB = percentageOf(initialB);
+  const variant = stemVariant(seed);
+  const stem =
+    variant === 1
+      ? `Vessels A and B each contain ${quantityText(initialA.volume, context.unit)} of a ${context.mixture}. A contains ${percentText(pA)} ${context.componentA} and B contains ${percentText(pB)} ${context.componentA}. ${quantityText(first.amount, context.unit)} is poured from B into A. After mixing A well, ${quantityText(second.amount, context.unit)} is poured back from A into B. What is the final ratio of ${context.componentA} to ${context.componentB} in B?`
+      : variant === 2
+        ? `Two vessels A and B hold equal quantities of a ${context.mixture}: ${quantityText(initialA.volume, context.unit)} each. The ${context.componentA} percentages are ${percentText(pA)} in A and ${percentText(pB)} in B. First ${quantityText(first.amount, context.unit)} goes from B to A; then, after mixing, ${quantityText(second.amount, context.unit)} goes from A back to B. Find the final ${context.componentA} : ${context.componentB} ratio in B.`
+        : variant === 3
+          ? `A and B each have ${quantityText(initialA.volume, context.unit)} of a ${context.mixture}. A is ${percentText(pA)} ${context.componentA} and B is ${percentText(pB)} ${context.componentA}. Transfer ${quantityText(first.amount, context.unit)} from B to A, mix A, and return ${quantityText(second.amount, context.unit)} from A to B. What is the final ratio of ${context.componentA} to ${context.componentB} in vessel B?`
+          : `Vessel A contains ${quantityText(initialA.volume, context.unit)} of ${percentText(pA)} ${context.componentA} mixture and vessel B contains the same quantity at ${percentText(pB)} ${context.componentA}. ${quantityText(first.amount, context.unit)} is transferred B→A and, after mixing, ${quantityText(second.amount, context.unit)} is transferred A→B. What is ${context.componentA} : ${context.componentB} in B at the end?`;
+
+  const lines = [
+    `From B to A: ${context.componentA} = ${percentText(pB)} of ${quantityText(first.amount, context.unit)} = ${quantityText(firstMoved.componentA, context.unit)}; ${context.componentB} = ${quantityText(firstMoved.componentB, context.unit)}.`,
+    `A now has ${quantityText(afterFirstA.componentA, context.unit)} ${context.componentA} in ${quantityText(afterFirstA.volume, context.unit)}. So the ${quantityText(second.amount, context.unit)} returned from A contains ${quantityText(secondMoved.componentA, context.unit)} ${context.componentA} and ${quantityText(secondMoved.componentB, context.unit)} ${context.componentB}.`,
+    `B finally has ${quantityText(finalB.componentA, context.unit)} ${context.componentA} and ${quantityText(finalWater, context.unit)} ${context.componentB}.`,
+    `${context.componentA} : ${context.componentB} = ${friendlyNumber(finalB.componentA)} : ${friendlyNumber(finalWater)} = ${ratioText(finalB.componentA, finalWater)}.`,
+  ];
+  return finalise(
+    base,
+    seed,
+    stem,
+    lines,
+    `After the first transfer, A's composition has changed. Do not use A's original ${percentText(pA)} for the return transfer.`,
+    [`Final amounts in B add to ${quantityText(finalB.volume, context.unit)}.`],
+    options,
+  );
+}
+
+function equalExchangeAmount(seed: string): MalCp006DiscoveryQuestion {
+  const base = selectFriendlyBase(
+    "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
+    seed,
+  );
+  const context = contextualise(`${seed}:exchange`);
+  const [a, b] = base.exactState.initialVessels;
+  const operation = base.exactState.operations[0];
+  if (!a || !b || operation?.kind !== "SIMULTANEOUS_EQUAL_EXCHANGE") {
+    throw new Error("Unexpected equal-exchange topology.");
+  }
+  const correct: MalCp006ExactAnswer = { kind: "QUANTITY", value: operation.amount };
+  const halfA = divideRational(a.volume, rational(2));
+  const halfB = divideRational(b.volume, rational(2));
+  const halfCorrect = divideRational(operation.amount, rational(2));
+  const averageThenHalf = divideRational(addRational(a.volume, b.volume), rational(4));
+  const smaller = compareRational(a.volume, b.volume) <= 0 ? a.volume : b.volume;
+  const smallerHalf = divideRational(smaller, rational(2));
+  const options = buildOptions(
+    correct,
+    [
+      { answer: { kind: "QUANTITY", value: halfCorrect }, misconceptionId: "EXCHANGED_ONLY_HALF_REQUIRED" },
+      { answer: { kind: "QUANTITY", value: halfA }, misconceptionId: "USED_HALF_OF_VESSEL_A" },
+      { answer: { kind: "QUANTITY", value: halfB }, misconceptionId: "USED_HALF_OF_VESSEL_B" },
+      { answer: { kind: "QUANTITY", value: averageThenHalf }, misconceptionId: "AVERAGED_CAPACITIES_THEN_HALVED" },
+      { answer: { kind: "QUANTITY", value: smallerHalf }, misconceptionId: "USED_HALF_OF_SMALLER_VESSEL" },
+    ],
+    context.unit,
+    seed,
+  );
+  const pA = percentageOf(a);
+  const pB = percentageOf(b);
+  const variant = stemVariant(seed);
+  const stem =
+    variant === 1
+      ? `Vessel A contains ${quantityText(a.volume, context.unit)} of a ${context.mixture} with ${percentText(pA)} ${context.componentA}, and vessel B contains ${quantityText(b.volume, context.unit)} with ${percentText(pB)} ${context.componentA}. The same quantity is taken from each vessel at the same time and poured into the other. How much must be exchanged so that the final ${context.componentA} percentages become equal?`
+      : variant === 2
+        ? `A has ${quantityText(a.volume, context.unit)} of ${percentText(pA)} ${context.componentA} mixture and B has ${quantityText(b.volume, context.unit)} of ${percentText(pB)} ${context.componentA} mixture. Equal quantities are simultaneously exchanged between A and B. What quantity makes the two final concentrations equal?`
+        : variant === 3
+          ? `Two vessels contain ${quantityText(a.volume, context.unit)} and ${quantityText(b.volume, context.unit)} of the same ${context.mixture}. Their ${context.componentA} concentrations are ${percentText(pA)} and ${percentText(pB)}. If an equal quantity is exchanged simultaneously, what quantity must be moved from each vessel so that both end with the same concentration?`
+          : `Vessels A and B contain ${quantityText(a.volume, context.unit)} and ${quantityText(b.volume, context.unit)} of a ${context.mixture}, at ${percentText(pA)} and ${percentText(pB)} ${context.componentA}. The same amount is swapped between them simultaneously. Find the amount that makes their final ${context.componentA} concentrations equal.`;
+  const lines = [
+    `Let the exchanged amount be x. Final ${context.componentA} in A = ${percentText(pA)} of (${friendlyNumber(a.volume)} − x) + ${percentText(pB)} of x.`,
+    `Final ${context.componentA} in B = ${percentText(pB)} of (${friendlyNumber(b.volume)} − x) + ${percentText(pA)} of x. Divide these by ${friendlyNumber(a.volume)} and ${friendlyNumber(b.volume)} and equate the two concentrations.`,
+    `After cancelling the unequal starting percentages, x = (${friendlyNumber(a.volume)} × ${friendlyNumber(b.volume)}) ÷ (${friendlyNumber(a.volume)} + ${friendlyNumber(b.volume)}) = ${quantityText(operation.amount, context.unit)}.`,
+  ];
+  return finalise(
+    base,
+    seed,
+    stem,
+    lines,
+    "Do not simply average the vessel sizes or exchange half of one vessel. Both vessel volumes matter.",
+    [
+      `Using ${quantityText(operation.amount, context.unit)} in the exact swap gives the same final ${context.componentA} percentage in A and B.`,
+    ],
+    options,
+  );
+}
+
+function threeVesselCycle(seed: string): MalCp006DiscoveryQuestion {
+  const base = selectFriendlyBase(
+    "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
+    seed,
+  );
+  const context: LearnerContext = {
+    componentA: "salt",
+    componentB: "water",
+    mixture: "salt-water solution",
+    unit: "ml",
+  };
+  const [a0, b0, c0] = base.exactState.initialVessels;
+  const [op1, op2, op3] = base.exactState.operations;
+  if (!a0 || !b0 || !c0 || op1?.kind !== "TRANSFER" || op2?.kind !== "TRANSFER" || op3?.kind !== "TRANSFER") {
+    throw new Error("Unexpected three-vessel cycle topology.");
+  }
+  const after1B = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "B")!;
+  const after2C = base.exactState.ledger.snapshots[2]!.vessels.find((v) => v.id === "C")!;
+  const finalA = getMalCp006Vessel(base.exactState.ledger, "A");
+  const moved1 = movedParts(a0, op1.amount);
+  const moved2 = movedParts(after1B, op2.amount);
+  const moved3 = movedParts(after2C, op3.amount);
+  const correct: MalCp006ExactAnswer = {
+    kind: "PERCENT",
+    value: malCp006ConcentrationPercent(finalA),
+  };
+
+  const wrongInitialCFinalSalt = addRational(
+    subtractRational(a0.componentA, moved1.componentA),
+    multiplyRational(op3.amount, fractionOf(c0)),
+  );
+  const wrongInitialCPercent = multiplyRational(
+    divideRational(wrongInitialCFinalSalt, finalA.volume),
+    HUNDRED,
+  );
+  const wrongInitialBMove2 = multiplyRational(op2.amount, fractionOf(b0));
+  const cWrongAfter2A = addRational(c0.componentA, wrongInitialBMove2);
+  const cWrongAfter2V = addRational(c0.volume, op2.amount);
+  const wrongMove3FromUpdatedC = multiplyRational(
+    op3.amount,
+    divideRational(cWrongAfter2A, cWrongAfter2V),
+  );
+  const wrongInitialBPercent = multiplyRational(
+    divideRational(
+      addRational(subtractRational(a0.componentA, moved1.componentA), wrongMove3FromUpdatedC),
+      finalA.volume,
+    ),
+    HUNDRED,
+  );
+  const ignoreLastPercent = multiplyRational(
+    divideRational(subtractRational(a0.componentA, moved1.componentA), subtractRational(a0.volume, op1.amount)),
+    HUNDRED,
+  );
+  const complement = subtractRational(HUNDRED, correct.value);
+  const options = buildOptions(
+    correct,
+    [
+      { answer: { kind: "PERCENT", value: wrongInitialCPercent }, misconceptionId: "USED_C_INITIAL_PERCENT_FOR_LAST_TRANSFER" },
+      { answer: { kind: "PERCENT", value: wrongInitialBPercent }, misconceptionId: "USED_B_INITIAL_PERCENT_FOR_SECOND_TRANSFER" },
+      { answer: { kind: "PERCENT", value: ignoreLastPercent }, misconceptionId: "STOPPED_AFTER_FIRST_TRANSFER" },
+      { answer: { kind: "PERCENT", value: complement }, misconceptionId: "REPORTED_WATER_PERCENT_INSTEAD_OF_SALT" },
+    ],
+    context.unit,
+    seed,
+  );
+  const pA = percentageOf(a0);
+  const pB = percentageOf(b0);
+  const pC = percentageOf(c0);
+  const variant = stemVariant(seed);
+  const stem =
+    variant === 1
+      ? `Vessels A, B and C each contain ${quantityText(a0.volume, context.unit)} of salt-water solution. Their salt concentrations are ${percentText(pA)}, ${percentText(pB)} and ${percentText(pC)}, respectively. ${quantityText(op1.amount, context.unit)} is transferred A→B, then the same amount of B's mixed solution is transferred B→C, and finally the same amount of C's mixed solution is transferred C→A. What is the final salt concentration in A?`
+      : variant === 2
+        ? `Three equal vessels A, B and C contain ${quantityText(a0.volume, context.unit)} each of salt-water solution at ${percentText(pA)}, ${percentText(pB)} and ${percentText(pC)} salt. Transfer ${quantityText(op1.amount, context.unit)} from A to B, then ${quantityText(op2.amount, context.unit)} from the mixed B to C, and then ${quantityText(op3.amount, context.unit)} from the mixed C to A. Find the final percentage of salt in A.`
+        : variant === 3
+          ? `A, B and C each hold ${quantityText(a0.volume, context.unit)} of salt solution with strengths ${percentText(pA)}, ${percentText(pB)} and ${percentText(pC)}. The same ${quantityText(op1.amount, context.unit)} is moved successively A→B, B→C and C→A, mixing before each next transfer. What percentage of salt is finally present in A?`
+          : `Each of A, B and C has ${quantityText(a0.volume, context.unit)} of salt-water solution, containing ${percentText(pA)}, ${percentText(pB)} and ${percentText(pC)} salt. After successive transfers of ${quantityText(op1.amount, context.unit)} along A→B→C→A, with mixing at every stage, what is A's final salt concentration?`;
+  const lines = [
+    `A→B: salt moved = ${percentText(pA)} of ${quantityText(op1.amount, context.unit)} = ${quantityText(moved1.componentA, context.unit)}. B now has ${quantityText(after1B.componentA, context.unit)} salt in ${quantityText(after1B.volume, context.unit)}.`,
+    `B→C: ${quantityText(op2.amount, context.unit)} of this new B mixture carries ${quantityText(moved2.componentA, context.unit)} salt. C now has ${quantityText(after2C.componentA, context.unit)} salt in ${quantityText(after2C.volume, context.unit)}.`,
+    `C→A: the last ${quantityText(op3.amount, context.unit)} therefore carries ${quantityText(moved3.componentA, context.unit)} salt back to A.`,
+    `A finally has ${quantityText(finalA.componentA, context.unit)} salt in ${quantityText(finalA.volume, context.unit)}; concentration = ${friendlyNumber(finalA.componentA)} ÷ ${friendlyNumber(finalA.volume)} × 100 = ${percentText(correct.value)}.`,
+  ];
+  return finalise(
+    base,
+    seed,
+    stem,
+    lines,
+    "B and C change after receiving liquid. Use their new composition before the next transfer, not their starting percentage.",
+    ["The total amount of salt across A, B and C remains unchanged through all three transfers."],
+    options,
+  );
+}
+
+function refillRetransfer(seed: string): MalCp006DiscoveryQuestion {
+  const base = selectFriendlyBase(
+    "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
+    seed,
+  );
+  const context: LearnerContext = {
+    componentA: "spirit",
+    componentB: "water",
+    mixture: "spirit-water mixture",
+    unit: "litres",
+  };
+  const [a0] = base.exactState.initialVessels;
+  const [op1, refill, op3] = base.exactState.operations;
+  if (!a0 || op1?.kind !== "TRANSFER" || refill?.kind !== "REFILL" || op3?.kind !== "TRANSFER") {
+    throw new Error("Unexpected refill-retransfer topology.");
+  }
+  const afterRefillA = base.exactState.ledger.snapshots[2]!.vessels.find((v) => v.id === "A")!;
+  const finalB = getMalCp006Vessel(base.exactState.ledger, "B");
+  const firstMoved = movedParts(a0, op1.amount);
+  const secondMoved = movedParts(afterRefillA, op3.amount);
+  const waterFinal = malCp006ComponentB(finalB);
+  const correct: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: waterFinal,
+    second: finalB.componentA,
+  };
+  const originalFraction = fractionOf(a0);
+  const wrongSecondSpirit = multiplyRational(op3.amount, originalFraction);
+  const wrongOriginalRatio: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: addRational(firstMoved.componentB, subtractRational(op3.amount, wrongSecondSpirit)),
+    second: addRational(firstMoved.componentA, wrongSecondSpirit),
+  };
+  const wrongPureWater: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: addRational(firstMoved.componentB, op3.amount),
+    second: firstMoved.componentA,
+  };
+  const wrongPureSpirit: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: firstMoved.componentB,
+    second: addRational(firstMoved.componentA, op3.amount),
+  };
+  const reversed: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: finalB.componentA,
+    second: waterFinal,
+  };
+  const options = buildOptions(
+    correct,
+    [
+      { answer: wrongOriginalRatio, misconceptionId: "USED_ORIGINAL_RATIO_AFTER_WATER_REFILL" },
+      { answer: wrongPureWater, misconceptionId: "TREATED_SECOND_TRANSFER_AS_PURE_WATER" },
+      { answer: wrongPureSpirit, misconceptionId: "TREATED_SECOND_TRANSFER_AS_PURE_SPIRIT" },
+      { answer: reversed, misconceptionId: "REVERSED_WATER_SPIRIT_RATIO" },
+    ],
+    context.unit,
+    seed,
+  );
+  const p0 = percentageOf(a0);
+  const pAfter = percentageOf(afterRefillA);
+  const variant = stemVariant(seed);
+  const stem =
+    variant === 1
+      ? `Container A has ${quantityText(a0.volume, context.unit)} of a spirit-water mixture containing ${percentText(p0)} spirit; container B is empty. ${quantityText(op1.amount, context.unit)} is transferred from A to B. A is refilled with the same amount of pure water and mixed. Then ${quantityText(op3.amount, context.unit)} is transferred from A to B again. What is the final ratio of water to spirit in B?`
+      : variant === 2
+        ? `A contains ${quantityText(a0.volume, context.unit)} of ${percentText(p0)} spirit mixture and B is empty. First move ${quantityText(op1.amount, context.unit)} from A to B, replace it in A with pure water, mix A, and then move another ${quantityText(op3.amount, context.unit)} from A to B. Find water : spirit in B at the end.`
+        : variant === 3
+          ? `A has ${quantityText(a0.volume, context.unit)} of a mixture that is ${percentText(p0)} spirit. B starts empty. After transferring ${quantityText(op1.amount, context.unit)} to B, the same quantity of water is added back to A. A is mixed and ${quantityText(op3.amount, context.unit)} is transferred to B. What is the final water-to-spirit ratio in B?`
+          : `From ${quantityText(a0.volume, context.unit)} of ${percentText(p0)} spirit mixture in A, ${quantityText(op1.amount, context.unit)} is moved to empty B. A is topped back up with pure water, mixed, and ${quantityText(op3.amount, context.unit)} more is sent to B. What is water : spirit in B?`;
+  const lines = [
+    `First transfer to B: spirit = ${percentText(p0)} of ${quantityText(op1.amount, context.unit)} = ${quantityText(firstMoved.componentA, context.unit)}; water = ${quantityText(firstMoved.componentB, context.unit)}.`,
+    `After adding ${quantityText(refill.amount, context.unit)} pure water, A has ${quantityText(afterRefillA.componentA, context.unit)} spirit in ${quantityText(afterRefillA.volume, context.unit)}, i.e. ${percentText(pAfter)} spirit.`,
+    `Second transfer: spirit = ${percentText(pAfter)} of ${quantityText(op3.amount, context.unit)} = ${quantityText(secondMoved.componentA, context.unit)}; water = ${quantityText(secondMoved.componentB, context.unit)}.`,
+    `So B has ${quantityText(waterFinal, context.unit)} water and ${quantityText(finalB.componentA, context.unit)} spirit; water : spirit = ${ratioText(waterFinal, finalB.componentA)}.`,
+  ];
+  return finalise(
+    base,
+    seed,
+    stem,
+    lines,
+    `Adding pure water changes A from ${percentText(p0)} to ${percentText(pAfter)} spirit. Use the new percentage for the second transfer.`,
+    [`B's final spirit and water add to ${quantityText(finalB.volume, context.unit)}.`],
+    options,
+  );
+}
+
+function pureRoundTrip(seed: string): MalCp006DiscoveryQuestion {
+  const base = selectFriendlyBase(
+    "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
+    seed,
+  );
+  const context: LearnerContext = {
+    componentA: "milk",
+    componentB: "water",
+    mixture: "milk-water mixture",
+    unit: "litres",
+  };
+  const [a0, b0] = base.exactState.initialVessels;
+  const [op1, op2] = base.exactState.operations;
+  if (!a0 || !b0 || op1?.kind !== "TRANSFER" || op2?.kind !== "TRANSFER") {
+    throw new Error("Unexpected pure round-trip topology.");
+  }
+  const after1B = base.exactState.ledger.snapshots[1]!.vessels.find((v) => v.id === "B")!;
+  const finalA = getMalCp006Vessel(base.exactState.ledger, "A");
+  const finalB = getMalCp006Vessel(base.exactState.ledger, "B");
+  const returnParts = movedParts(after1B, op2.amount);
+  const waterB = malCp006ComponentB(finalB);
+  const correct: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: finalA.componentA,
+    second: waterB,
+  };
+  const milkAfterFirst = subtractRational(a0.componentA, op1.amount);
+  const wrongPureWater: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: milkAfterFirst,
+    second: subtractRational(b0.volume, op2.amount),
+  };
+  const wrongPureMilk: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: addRational(milkAfterFirst, op2.amount),
+    second: b0.volume,
+  };
+  const wrongIgnoreReturn: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: milkAfterFirst,
+    second: b0.volume,
+  };
+  const reversed: MalCp006ExactAnswer = {
+    kind: "RATIO",
+    first: waterB,
+    second: finalA.componentA,
+  };
+  const options = buildOptions(
+    correct,
+    [
+      { answer: wrongPureWater, misconceptionId: "TREATED_RETURN_AS_PURE_WATER" },
+      { answer: wrongPureMilk, misconceptionId: "TREATED_RETURN_AS_PURE_MILK" },
+      { answer: wrongIgnoreReturn, misconceptionId: "IGNORED_RETURN_TRANSFER" },
+      { answer: reversed, misconceptionId: "REVERSED_CROSS_VESSEL_RATIO" },
+    ],
+    context.unit,
+    seed,
+  );
+  const milkPercentB = percentageOf(after1B);
+  const variant = stemVariant(seed);
+  const stem =
+    variant === 1
+      ? `Vessel A contains ${quantityText(a0.volume, context.unit)} of pure milk and vessel B contains ${quantityText(b0.volume, context.unit)} of pure water. ${quantityText(op1.amount, context.unit)} of milk is transferred from A to B and mixed. Then ${quantityText(op2.amount, context.unit)} of the mixture in B is transferred back to A. What is the ratio of the final milk in A to the final water in B?`
+      : variant === 2
+        ? `A starts with ${quantityText(a0.volume, context.unit)} pure milk and B with ${quantityText(b0.volume, context.unit)} pure water. Move ${quantityText(op1.amount, context.unit)} from A to B, mix B, and return ${quantityText(op2.amount, context.unit)} from B to A. Find final milk in A : final water in B.`
+        : variant === 3
+          ? `There are ${quantityText(a0.volume, context.unit)} of pure milk in A and ${quantityText(b0.volume, context.unit)} of pure water in B. After ${quantityText(op1.amount, context.unit)} milk is added to B, the contents are mixed and ${quantityText(op2.amount, context.unit)} is sent back to A. What is the final ratio of milk in A to water in B?`
+          : `A has ${quantityText(a0.volume, context.unit)} pure milk; B has ${quantityText(b0.volume, context.unit)} pure water. ${quantityText(op1.amount, context.unit)} goes A→B, B is mixed, then ${quantityText(op2.amount, context.unit)} goes B→A. What is final milk in A : final water in B?`;
+  const lines = [
+    `After A→B, B contains ${quantityText(op1.amount, context.unit)} milk and ${quantityText(b0.volume, context.unit)} water, total ${quantityText(after1B.volume, context.unit)}.`,
+    `Milk percentage in B = ${friendlyNumber(op1.amount)} ÷ ${friendlyNumber(after1B.volume)} × 100 = ${percentText(milkPercentB)}. Therefore the ${quantityText(op2.amount, context.unit)} returned contains ${quantityText(returnParts.componentA, context.unit)} milk and ${quantityText(returnParts.componentB, context.unit)} water.`,
+    `Milk left in A = ${friendlyNumber(a0.volume)} − ${friendlyNumber(op1.amount)} + ${friendlyNumber(returnParts.componentA)} = ${quantityText(finalA.componentA, context.unit)}; water left in B = ${quantityText(waterB, context.unit)}.`,
+    `Required ratio = ${friendlyNumber(finalA.componentA)} : ${friendlyNumber(waterB)} = ${ratioText(finalA.componentA, waterB)}.`,
+  ];
+  return finalise(
+    base,
+    seed,
+    stem,
+    lines,
+    "The liquid returned from B is a milk-water mixture, not pure water or pure milk.",
+    ["Total milk and total water across A and B are unchanged by the two transfers."],
+    options,
+  );
+}
+
+export function generateMalCp006Wave01EditorialV2Question(
+  prototypeId: MalCp006Wave01V2PrototypeId,
+  seed = "mal-cp006-wave01-v2:default",
+): MalCp006DiscoveryQuestion {
+  switch (prototypeId) {
+    case "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO":
+      return transferReturn(seed);
+    case "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS":
+      return equalExchangeAmount(seed);
+    case "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION":
+      return threeVesselCycle(seed);
+    case "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO":
+      return refillRetransfer(seed);
+    case "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO":
+      return pureRoundTrip(seed);
+  }
+}
+
+export function verifyMalCp006Wave01V2Answer(
+  question: MalCp006DiscoveryQuestion,
+): boolean {
+  const ledger = solveMalCp006Ledger(
+    question.exactState.initialVessels,
+    question.exactState.operations,
+  );
+  switch (question.prototypeId) {
+    case "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO": {
+      if (question.exactAnswer.kind !== "RATIO") return false;
+      const finalB = getMalCp006Vessel(ledger, "B");
+      const [a1, a2] = reduceRationalRatio(finalB.componentA, malCp006ComponentB(finalB));
+      const [b1, b2] = reduceRationalRatio(question.exactAnswer.first, question.exactAnswer.second);
+      return equalsRational(a1, b1) && equalsRational(a2, b2);
+    }
+    case "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS": {
+      if (question.exactAnswer.kind !== "QUANTITY") return false;
+      const [a, b] = question.exactState.initialVessels;
+      if (!a || !b) return false;
+      return verifyMalCp006EqualExchange(
+        a.volume,
+        b.volume,
+        fractionOf(a),
+        fractionOf(b),
+        question.exactAnswer.value,
+      );
+    }
+    case "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION": {
+      if (question.exactAnswer.kind !== "PERCENT") return false;
+      return equalsRational(
+        malCp006ConcentrationPercent(getMalCp006Vessel(ledger, "A")),
+        question.exactAnswer.value,
+      );
+    }
+    case "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO": {
+      if (question.exactAnswer.kind !== "RATIO") return false;
+      const finalB = getMalCp006Vessel(ledger, "B");
+      const [a1, a2] = reduceRationalRatio(malCp006ComponentB(finalB), finalB.componentA);
+      const [b1, b2] = reduceRationalRatio(question.exactAnswer.first, question.exactAnswer.second);
+      return equalsRational(a1, b1) && equalsRational(a2, b2);
+    }
+    case "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO": {
+      if (question.exactAnswer.kind !== "RATIO") return false;
+      const finalA = getMalCp006Vessel(ledger, "A");
+      const finalB = getMalCp006Vessel(ledger, "B");
+      const [a1, a2] = reduceRationalRatio(finalA.componentA, malCp006ComponentB(finalB));
+      const [b1, b2] = reduceRationalRatio(question.exactAnswer.first, question.exactAnswer.second);
+      return equalsRational(a1, b1) && equalsRational(a2, b2);
+    }
+    case "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE":
+      return false;
+  }
+}
+
+export function malCp006Wave01V2Stable(question: MalCp006DiscoveryQuestion): string {
+  return JSON.stringify(question, (_key, value) =>
+    typeof value === "bigint" ? `${value}n` : value,
+  );
+}
