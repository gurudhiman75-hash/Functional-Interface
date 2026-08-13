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
  solveMalCp006EqualExchangeAmount,
  solveMalCp006Ledger,
  verifyMalCp006EqualExchange,
} from "./cp006-solver";
import {
  MAL_CP006_ID,
  MAL_CP006_WAVE01_RUNTIME_ID,
  type MalCp006AnswerSemantic,
  type MalCp006DiscoveryQuestion,
  type MalCp006ExactAnswer,
  type MalCp006Operation,
  type MalCp006OptionAudit,
  type MalCp006VesselState,
  type MalCp006Wave01PrototypeId,
} from "./cp006-types";

const ZERO = rational(0);
const HUNDRED = rational(100);

interface Context {
  componentA: string;
  componentB: string;
  unit: "litres" | "ml";
}

const CONTEXTS: readonly Context[] = [
  { componentA: "milk", componentB: "water", unit: "litres" },
  { componentA: "spirit", componentB: "water", unit: "litres" },
  { componentA: "salt solution component", componentB: "water", unit: "ml" },
  { componentA: "sugar syrup", componentB: "milk", unit: "litres" },
] as const;

const VOLUMES = [40, 48, 60, 72, 80, 90, 100, 120] as const;
const CYCLE_VOLUMES = [100, 120, 150, 200, 240, 300, 500] as const;
const FRACTIONS: readonly [number, number][] = [
  [1, 5],
  [1, 4],
  [3, 10],
  [1, 3],
  [2, 5],
  [1, 2],
  [3, 5],
  [2, 3],
  [3, 4],
  [4, 5],
] as const;
const LOW_FRACTIONS: readonly [number, number][] = [
  [1, 10],
  [1, 5],
  [1, 4],
  [3, 10],
  [1, 3],
  [2, 5],
] as const;
const HIGH_FRACTIONS: readonly [number, number][] = [
  [3, 5],
  [2, 3],
  [7, 10],
  [3, 4],
  [4, 5],
  [9, 10],
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
  const result = [...values];
  let state = hash(seed) || 0x9e3779b9;
  const next = () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    state >>>= 0;
    return state;
  };
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = next() % (index + 1);
    [result[index], result[swapIndex]] = [
      result[swapIndex]!,
      result[index]!,
    ];
  }
  return result;
}

function fraction(pair: readonly [number, number]): Rational {
  return rational(pair[0], pair[1]);
}

function quantityText(value: Rational, unit: Context["unit"]): string {
  return `${formatRational(value)} ${unit}`;
}

function percentText(value: Rational): string {
  return `${formatRational(value)}%`;
}

function ratioText(first: Rational, second: Rational): string {
  if (compareRational(first, ZERO) <= 0 || compareRational(second, ZERO) <= 0) {
    throw new Error("Displayed ratio parts must be positive.");
  }
  const [a, b] = reduceRationalRatio(first, second);
  return `${formatRational(a)} : ${formatRational(b)}`;
}

function exactAnswerText(answer: MalCp006ExactAnswer, unit: Context["unit"]): string {
  if (answer.kind === "RATIO") return ratioText(answer.first, answer.second);
  if (answer.kind === "PERCENT") return percentText(answer.value);
  return quantityText(answer.value, unit);
}

function canonicalText(value: string): string {
  return value.toLowerCase().replace(/\s+/gu, " ").trim();
}

function buildOptions(input: {
  answer: MalCp006ExactAnswer;
  unit: Context["unit"];
  seed: string;
}): {
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: MalCp006OptionAudit[];
} {
  const answer = exactAnswerText(input.answer, input.unit);
  const candidates: Array<{ text: string; misconceptionId: string }> = [];

  if (input.answer.kind === "RATIO") {
    const [a, b] = reduceRationalRatio(input.answer.first, input.answer.second);
    candidates.push(
      { text: ratioText(b, a), misconceptionId: "REVERSED_REQUESTED_RATIO" },
      {
        text: ratioText(addRational(a, rational(1)), b),
        misconceptionId: "ADDED_ONE_PART_AFTER_REDUCTION",
      },
      {
        text: ratioText(a, addRational(b, rational(1))),
        misconceptionId: "ALTERED_COMPLEMENT_PART",
      },
      {
        text: ratioText(
          addRational(a, rational(1)),
          addRational(b, rational(1)),
        ),
        misconceptionId: "ADDED_TRANSFER_AS_WHOLE_PARTS",
      },
      {
        text: ratioText(multiplyRational(a, rational(2)), b),
        misconceptionId: "DOUBLE_COUNTED_FIRST_COMPONENT",
      },
      {
        text: ratioText(a, multiplyRational(b, rational(2))),
        misconceptionId: "DOUBLE_COUNTED_SECOND_COMPONENT",
      },
      {
        text: ratioText(addRational(a, b), b),
        misconceptionId: "USED_TOTAL_AS_FIRST_COMPONENT",
      },
      {
        text: ratioText(a, addRational(a, b)),
        misconceptionId: "USED_TOTAL_AS_SECOND_COMPONENT",
      },
      {
        text: ratioText(multiplyRational(a, rational(3)), b),
        misconceptionId: "TRIPLED_FIRST_COMPONENT",
      },
      {
        text: ratioText(a, multiplyRational(b, rational(3))),
        misconceptionId: "TRIPLED_SECOND_COMPONENT",
      },
    );
  } else if (input.answer.kind === "PERCENT") {
    const value = input.answer.value;
    const percentCandidates = [
      { value: subtractRational(value, rational(5)), id: "USED_PREVIOUS_STAGE_CONCENTRATION" },
      { value: addRational(value, rational(5)), id: "USED_INITIAL_INSTEAD_OF_CURRENT_SAMPLE" },
      { value: subtractRational(HUNDRED, value), id: "REPORTED_COMPLEMENT_PERCENT" },
      { value: divideRational(value, rational(2)), id: "HALVED_FINAL_COMPONENT_SHARE" },
      { value: multiplyRational(value, rational(2)), id: "DOUBLE_COUNTED_TRANSFERRED_COMPONENT" },
    ];
    for (const candidate of percentCandidates) {
      if (
        compareRational(candidate.value, ZERO) >= 0 &&
        compareRational(candidate.value, HUNDRED) <= 0
      ) {
        candidates.push({
          text: percentText(candidate.value),
          misconceptionId: candidate.id,
        });
      }
    }
  } else {
    const value = input.answer.value;
    const quantityCandidates = [
      { value: subtractRational(value, rational(1)), id: "SUBTRACTED_ONE_LITRE_EXTRA" },
      { value: addRational(value, rational(1)), id: "ADDED_ONE_LITRE_EXTRA" },
      { value: divideRational(value, rational(2)), id: "HALVED_EXCHANGE_AMOUNT" },
      { value: multiplyRational(value, rational(2)), id: "DOUBLED_EXCHANGE_AMOUNT" },
    ];
    for (const candidate of quantityCandidates) {
      if (compareRational(candidate.value, ZERO) > 0) {
        candidates.push({
          text: quantityText(candidate.value, input.unit),
          misconceptionId: candidate.id,
        });
      }
    }
  }

  const unique = new Map<string, { text: string; misconceptionId: string }>();
  for (const candidate of candidates) {
    const key = canonicalText(candidate.text);
    if (key === canonicalText(answer) || unique.has(key)) continue;
    unique.set(key, candidate);
  }
  if (unique.size < 3) throw new Error(`Insufficient distractors for ${input.seed}.`);

  const distractors = shuffle([...unique.values()], `${input.seed}:distractors`).slice(0, 3);
  const selected = shuffle(
    [{ text: answer, misconceptionId: "CORRECT" }, ...distractors],
    `${input.seed}:positions`,
  );
  const correctIndex = selected.findIndex(
    (candidate) => canonicalText(candidate.text) === canonicalText(answer),
  );
  return {
    answer,
    options: selected.map((candidate) => candidate.text),
    correctIndex,
    optionAudit: selected.map((candidate) => ({
      text: candidate.text,
      misconceptionId: candidate.misconceptionId,
      isCorrect: canonicalText(candidate.text) === canonicalText(answer),
    })),
  };
}

function vessel(
  id: string,
  volume: Rational,
  componentAFraction: Rational,
): MalCp006VesselState {
  return {
    id,
    volume,
    componentA: multiplyRational(volume, componentAFraction),
  };
}

function stateKey(
  initial: readonly MalCp006VesselState[],
  operations: readonly MalCp006Operation[],
): string {
  const vesselPart = initial
    .map(
      (item) =>
        `${item.id}:${rationalKey(item.volume)}:${rationalKey(item.componentA)}`,
    )
    .join("|");
  const operationPart = operations
    .map((operation) => {
      if (operation.kind === "TRANSFER") {
        return `T:${operation.from}>${operation.to}:${rationalKey(operation.amount)}`;
      }
      if (operation.kind === "REFILL") {
        return `R:${operation.vessel}:${rationalKey(operation.amount)}:${rationalKey(operation.componentAFraction)}`;
      }
      return `X:${operation.vesselA}<->${operation.vesselB}:${rationalKey(operation.amount)}`;
    })
    .join("|");
  return `${vesselPart}::${operationPart}`;
}

function buildQuestion(input: {
  prototypeId: MalCp006Wave01PrototypeId;
  seed: string;
  context: Context;
  difficulty: "Medium" | "Hard";
  answerSemantic: MalCp006AnswerSemantic;
  sourceEvidenceIds: readonly string[];
  initialVessels: readonly MalCp006VesselState[];
  operations: readonly MalCp006Operation[];
  exactAnswer: MalCp006ExactAnswer;
  stem: string;
  visibleLines: string[];
  commonMistake: string;
  verification: string[];
  siblingStateKey: string;
}): MalCp006DiscoveryQuestion {
  const ledger = solveMalCp006Ledger(input.initialVessels, input.operations);
  const optionSet = buildOptions({
    answer: input.exactAnswer,
    unit: input.context.unit,
    seed: input.seed,
  });
  const errors: string[] = [];
  if (!input.stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (optionSet.options.length !== 4 || new Set(optionSet.options.map(canonicalText)).size !== 4) {
    errors.push("Question must have four unique options.");
  }
  if (optionSet.options[optionSet.correctIndex] !== optionSet.answer) {
    errors.push("Correct answer/index mismatch.");
  }
  if (input.visibleLines.length < 1 || input.visibleLines.length > 4) {
    errors.push("Visible solution must contain one to four lines.");
  }
  if (ledger.snapshots.length !== input.operations.length + 1) {
    errors.push("Ledger snapshot count is incomplete.");
  }

  return {
    archetypeId: "MAL-001",
    canonicalProblemId: MAL_CP006_ID,
    prototypeId: input.prototypeId,
    runtimeId: MAL_CP006_WAVE01_RUNTIME_ID,
    permanentQlId: null,
    permanentSolveModeId: null,
    language: "en",
    requestedSeed: input.seed,
    selectedSeed: input.seed,
    questionId: `MAL-CP006-W1-${hash(`${input.prototypeId}|${input.seed}`).toString(16).padStart(8, "0")}`,
    stateKey: stateKey(input.initialVessels, input.operations),
    siblingStateKey: input.siblingStateKey,
    difficulty: input.difficulty,
    answerSemantic: input.answerSemantic,
    sourceEvidenceIds: input.sourceEvidenceIds,
    stem: input.stem,
    answer: optionSet.answer,
    exactAnswer: input.exactAnswer,
    options: optionSet.options,
    correctIndex: optionSet.correctIndex,
    optionAudit: optionSet.optionAudit,
    explanation: {
      visibleLines: input.visibleLines,
      answerLine: `Answer: ${optionSet.answer}`,
      optionalHelp: {
        commonMistake: input.commonMistake,
        verification: input.verification,
      },
    },
    exactState: {
      initialVessels: input.initialVessels,
      operations: input.operations,
      ledger,
    },
    validation: { ok: errors.length === 0, errors },
    maturity: "DISCOVERY_PROTOTYPE",
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY",
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    runtimeMode: "REVIEW_ONLY",
    active: false,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    questionBankWritable: false,
    testEligible: false,
  };
}

function transferReturnQuestion(seed: string): MalCp006DiscoveryQuestion {
  const context = pick(CONTEXTS, `${seed}:context`);
  const volume = rational(pick(VOLUMES, `${seed}:volume`));
  const fractionA = fraction(pick(LOW_FRACTIONS, `${seed}:a-fraction`));
  const fractionB = fraction(pick(HIGH_FRACTIONS, `${seed}:b-fraction`));
  const firstAmount = multiplyRational(
    volume,
    fraction(pick([[1, 5], [1, 4], [1, 3]] as const, `${seed}:first`)),
  );
  const afterFirstVolumeA = addRational(volume, firstAmount);
  const returnAmount = multiplyRational(
    afterFirstVolumeA,
    fraction(pick([[1, 5], [1, 4]] as const, `${seed}:return`)),
  );
  const initial = [
    vessel("A", volume, fractionA),
    vessel("B", volume, fractionB),
  ] as const;
  const operations = [
    { kind: "TRANSFER", from: "B", to: "A", amount: firstAmount },
    { kind: "TRANSFER", from: "A", to: "B", amount: returnAmount },
  ] as const satisfies readonly MalCp006Operation[];
  const ledger = solveMalCp006Ledger(initial, operations);
  const finalB = getMalCp006Vessel(ledger, "B");
  const componentB = malCp006ComponentB(finalB);
  const exactAnswer: MalCp006ExactAnswer = {
    kind: "RATIO",
    first: finalB.componentA,
    second: componentB,
  };
  return buildQuestion({
    prototypeId: "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO",
    seed,
    context,
    difficulty: "Medium",
    answerSemantic: "FINAL_COMPONENT_RATIO",
    sourceEvidenceIds: [
      "CAT-2022-S2-Q61-TWO-CONTAINER-ROUND-TRIP",
      "TESTBOOK-RUM-WATER-25PCT-RETURN",
    ],
    initialVessels: initial,
    operations,
    exactAnswer,
    stem:
      `Vessels A and B each contain ${quantityText(volume, context.unit)} of a ${context.componentA}-${context.componentB} mixture. ` +
      `The ${context.componentA} fractions in A and B are ${percentText(multiplyRational(fractionA, HUNDRED))} and ${percentText(multiplyRational(fractionB, HUNDRED))}, respectively. ` +
      `${quantityText(firstAmount, context.unit)} is transferred from B to A. After mixing A thoroughly, ${quantityText(returnAmount, context.unit)} of the current mixture in A is transferred back to B. ` +
      `What is the final ratio of ${context.componentA} to ${context.componentB} in B?`,
    visibleLines: [
      `First sample B using B's initial ${context.componentA} fraction and add that component load to A.`,
      `Before the return transfer, recompute A's current ${context.componentA} fraction from its new component amount and new volume.`,
      `Apply that current fraction to the return sample; B finally contains ${ratioText(finalB.componentA, componentB)} of ${context.componentA} : ${context.componentB}.`,
    ],
    commonMistake:
      "Do not use A's initial composition for the return sample. A has already received mixture from B.",
    verification: [
      `Final volume in B is ${quantityText(finalB.volume, context.unit)} and its two component amounts sum exactly to that volume.`,
    ],
    siblingStateKey: `ROUND-TRIP|${rationalKey(fractionA)}|${rationalKey(fractionB)}|${rationalKey(divideRational(firstAmount, volume))}|${rationalKey(divideRational(returnAmount, afterFirstVolumeA))}`,
  });
}

function equalExchangeInput(seed: string) {
  const context = pick(CONTEXTS.slice(0, 3), `${seed}:context`);
  const capacityA = rational(pick([12, 16, 18, 20, 24, 30, 36, 40] as const, `${seed}:capacity-a`));
  const capacityB = rational(pick([15, 18, 24, 27, 30, 36, 45, 48] as const, `${seed}:capacity-b`));
  const low = fraction(pick(LOW_FRACTIONS, `${seed}:low`));
  const high = fraction(pick(HIGH_FRACTIONS, `${seed}:high`));
  const exchange = solveMalCp006EqualExchangeAmount(capacityA, capacityB, low, high);
  return { context, capacityA, capacityB, low, high, exchange };
}

function equalExchangeAmountQuestion(seed: string): MalCp006DiscoveryQuestion {
  const { context, capacityA, capacityB, low, high, exchange } =
    equalExchangeInput(seed);
  const initial = [
    vessel("A", capacityA, low),
    vessel("B", capacityB, high),
  ] as const;
  const operations = [
    {
      kind: "SIMULTANEOUS_EQUAL_EXCHANGE",
      vesselA: "A",
      vesselB: "B",
      amount: exchange,
    },
  ] as const satisfies readonly MalCp006Operation[];
  if (!verifyMalCp006EqualExchange(capacityA, capacityB, low, high, exchange)) {
    throw new Error("Equal-exchange construction did not equalise concentrations.");
  }
  return buildQuestion({
    prototypeId:
      "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS",
    seed,
    context,
    difficulty: "Medium",
    answerSemantic: "TRANSFER_QUANTITY",
    sourceEvidenceIds: ["TESTBOOK-SIMULTANEOUS-EQUAL-EXCHANGE-12-18"],
    initialVessels: initial,
    operations,
    exactAnswer: { kind: "QUANTITY", value: exchange },
    stem:
      `Vessels A and B contain ${quantityText(capacityA, context.unit)} and ${quantityText(capacityB, context.unit)} of two ${context.componentA}-${context.componentB} mixtures with different concentrations. ` +
      `An equal quantity is withdrawn simultaneously from each vessel and poured into the other. What quantity must be exchanged so that the final ${context.componentA} concentration is the same in both vessels?`,
    visibleLines: [
      `Let the exchanged quantity be x. Each vessel loses x of its own current mixture and receives x from the other.`,
      `Equating the two final concentrations cancels the initial concentration difference and gives x = VA×VB/(VA+VB).`,
      `Thus x = ${formatRational(capacityA)}×${formatRational(capacityB)}/(${formatRational(capacityA)}+${formatRational(capacityB)}) = ${quantityText(exchange, context.unit)}.`,
    ],
    commonMistake:
      "Do not average the vessel capacities or the two concentrations. The exchanged amount is constrained by both vessel volumes.",
    verification: [
      "Substituting this x into the simultaneous-exchange ledger gives exactly equal final component fractions in A and B.",
    ],
    siblingStateKey: `EQUAL-EXCHANGE-AMOUNT|${rationalKey(capacityA)}|${rationalKey(capacityB)}`,
  });
}

function equalExchangeCommonPercentQuestion(seed: string): MalCp006DiscoveryQuestion {
  const { context, capacityA, capacityB, low, high, exchange } =
    equalExchangeInput(`${seed}:common`);
  const initial = [
    vessel("A", capacityA, low),
    vessel("B", capacityB, high),
  ] as const;
  const operations = [
    {
      kind: "SIMULTANEOUS_EQUAL_EXCHANGE",
      vesselA: "A",
      vesselB: "B",
      amount: exchange,
    },
  ] as const satisfies readonly MalCp006Operation[];
  const ledger = solveMalCp006Ledger(initial, operations);
  const finalA = getMalCp006Vessel(ledger, "A");
  const finalB = getMalCp006Vessel(ledger, "B");
  const percentA = malCp006ConcentrationPercent(finalA);
  const percentB = malCp006ConcentrationPercent(finalB);
  if (!equalsRational(percentA, percentB)) {
    throw new Error("Constructed equal exchange did not produce one common concentration.");
  }
  return buildQuestion({
    prototypeId:
      "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE",
    seed,
    context,
    difficulty: "Medium",
    answerSemantic: "FINAL_CONCENTRATION_PERCENT",
    sourceEvidenceIds: ["TESTBOOK-SIMULTANEOUS-EQUAL-EXCHANGE-12-18"],
    initialVessels: initial,
    operations,
    exactAnswer: { kind: "PERCENT", value: percentA },
    stem:
      `Vessel A contains ${quantityText(capacityA, context.unit)} at ${percentText(multiplyRational(low, HUNDRED))} ${context.componentA}, while vessel B contains ${quantityText(capacityB, context.unit)} at ${percentText(multiplyRational(high, HUNDRED))}. ` +
      `${quantityText(exchange, context.unit)} is simultaneously exchanged between the vessels, after which their ${context.componentA} concentrations are equal. What is that common concentration?`,
    visibleLines: [
      `The exchange conserves total ${context.componentA} across the two-vessel system and keeps both vessel volumes unchanged.`,
      `Since both final concentrations are equal, the common fraction equals total ${context.componentA} divided by total volume.`,
      `The common concentration is ${percentText(percentA)}.`,
    ],
    commonMistake:
      "Do not take the simple average of the two percentages when the vessel volumes are different.",
    verification: [
      `The explicit exchange ledger gives ${percentText(percentA)} in A and ${percentText(percentB)} in B.`,
    ],
    siblingStateKey: `EQUAL-EXCHANGE-COMMON|${rationalKey(capacityA)}|${rationalKey(capacityB)}|${rationalKey(low)}|${rationalKey(high)}`,
  });
}

function threeVesselCycleQuestion(seed: string): MalCp006DiscoveryQuestion {
  const context: Context = {
    componentA: "salt",
    componentB: "water",
    unit: "ml",
  };
  const volume = rational(pick(CYCLE_VOLUMES, `${seed}:volume`));
  const transfer = multiplyRational(
    volume,
    fraction(pick([[1, 10], [1, 5], [1, 4]] as const, `${seed}:transfer`)),
  );
  const fractions = shuffle(
    [
      fraction(pick(LOW_FRACTIONS, `${seed}:f1`)),
      fraction(pick(FRACTIONS.slice(3, 8), `${seed}:f2`)),
      fraction(pick(HIGH_FRACTIONS, `${seed}:f3`)),
    ],
    `${seed}:fractions`,
  );
  const initial = [
    vessel("A", volume, fractions[0]!),
    vessel("B", volume, fractions[1]!),
    vessel("C", volume, fractions[2]!),
  ] as const;
  const operations = [
    { kind: "TRANSFER", from: "A", to: "B", amount: transfer },
    { kind: "TRANSFER", from: "B", to: "C", amount: transfer },
    { kind: "TRANSFER", from: "C", to: "A", amount: transfer },
  ] as const satisfies readonly MalCp006Operation[];
  const ledger = solveMalCp006Ledger(initial, operations);
  const finalA = getMalCp006Vessel(ledger, "A");
  const percent = malCp006ConcentrationPercent(finalA);
  return buildQuestion({
    prototypeId:
      "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION",
    seed,
    context,
    difficulty: "Hard",
    answerSemantic: "FINAL_CONCENTRATION_PERCENT",
    sourceEvidenceIds: ["CAT-2019-S2-Q80-THREE-VESSEL-SALT-CYCLE"],
    initialVessels: initial,
    operations,
    exactAnswer: { kind: "PERCENT", value: percent },
    stem:
      `Vessels A, B and C each contain ${quantityText(volume, context.unit)} of salt solution with strengths ` +
      `${percentText(multiplyRational(fractions[0]!, HUNDRED))}, ${percentText(multiplyRational(fractions[1]!, HUNDRED))} and ${percentText(multiplyRational(fractions[2]!, HUNDRED))}, respectively. ` +
      `${quantityText(transfer, context.unit)} is transferred A→B, then the same quantity of the current mixture in B is transferred B→C, and finally the same quantity of the current mixture in C is transferred C→A. ` +
      `What is the final salt concentration in A?`,
    visibleLines: [
      "After A→B, update B before sampling it; after B→C, update C before sampling it.",
      `The third sample therefore uses C's current composition, not C's initial percentage.`,
      `The final salt concentration in A is ${percentText(percent)}.`,
    ],
    commonMistake:
      "Using the initial B or C concentration for a later transfer ignores the mixture received in the preceding stage.",
    verification: [
      "Every transfer preserves global volume and total salt; the final A component amount divided by final A volume reproduces the stated percentage.",
    ],
    siblingStateKey: `THREE-CYCLE|${rationalKey(volume)}|${rationalKey(transfer)}|${fractions.map(rationalKey).join(":")}`,
  });
}

function sourceRefillRetransferQuestion(seed: string): MalCp006DiscoveryQuestion {
  const context: Context = {
    componentA: "spirit",
    componentB: "water",
    unit: "litres",
  };
  const volume = rational(pick([64, 72, 80, 96, 100, 120] as const, `${seed}:volume`));
  const initialFraction = fraction(
    pick([[3, 8], [7, 16], [1, 2], [5, 8], [2, 3]] as const, `${seed}:fraction`),
  );
  const firstTransfer = multiplyRational(
    volume,
    fraction(pick([[1, 5], [1, 4]] as const, `${seed}:first`)),
  );
  const refill = firstTransfer;
  const secondTransfer = multiplyRational(
    volume,
    fraction(pick([[1, 4], [2, 5], [1, 2]] as const, `${seed}:second`)),
  );
  const initial = [
    vessel("A", volume, initialFraction),
    { id: "B", volume: ZERO, componentA: ZERO },
  ] as const;
  const operations = [
    { kind: "TRANSFER", from: "A", to: "B", amount: firstTransfer },
    { kind: "REFILL", vessel: "A", amount: refill, componentAFraction: ZERO },
    { kind: "TRANSFER", from: "A", to: "B", amount: secondTransfer },
  ] as const satisfies readonly MalCp006Operation[];
  const ledger = solveMalCp006Ledger(initial, operations);
  const finalB = getMalCp006Vessel(ledger, "B");
  const water = malCp006ComponentB(finalB);
  return buildQuestion({
    prototypeId:
      "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO",
    seed,
    context,
    difficulty: "Hard",
    answerSemantic: "FINAL_COMPONENT_RATIO",
    sourceEvidenceIds: ["SSC-CGL-T2-2023-SPIRIT-WATER-RETRANSFER"],
    initialVessels: initial,
    operations,
    exactAnswer: { kind: "RATIO", first: water, second: finalB.componentA },
    stem:
      `Container A has ${quantityText(volume, context.unit)} of spirit and water with spirit fraction ${percentText(multiplyRational(initialFraction, HUNDRED))}; container B is empty. ` +
      `${quantityText(firstTransfer, context.unit)} is transferred from A to B. A is then refilled with ${quantityText(refill, context.unit)} of pure water. ` +
      `After mixing A, ${quantityText(secondTransfer, context.unit)} of its current mixture is again transferred to B. What is the final ratio of water to spirit in B?`,
    visibleLines: [
      "The first sample has A's initial composition and is stored in B.",
      "Refilling A with pure water changes A's composition; use this new fraction for the second sample.",
      `Add the two received component loads in B. Final water : spirit = ${ratioText(water, finalB.componentA)}.`,
    ],
    commonMistake:
      "Do not use A's original ratio for the second transfer after pure water has been added.",
    verification: [
      `B's final water and spirit amounts sum to ${quantityText(finalB.volume, context.unit)}, the total of the two transfers.`,
    ],
    siblingStateKey: `REFILL-RETRANSFER|${rationalKey(initialFraction)}|${rationalKey(divideRational(firstTransfer, volume))}|${rationalKey(divideRational(secondTransfer, volume))}`,
  });
}

function crossVesselRatioQuestion(seed: string): MalCp006DiscoveryQuestion {
  const context: Context = {
    componentA: "milk",
    componentB: "water",
    unit: "litres",
  };
  const volumeA = rational(pick([40, 45, 50, 55, 60, 70, 80] as const, `${seed}:volume-a`));
  const volumeB = rational(pick([30, 35, 40, 45, 50, 60] as const, `${seed}:volume-b`));
  const firstTransfer = rational(pick([4, 5, 6, 8, 10] as const, `${seed}:first`));
  if (compareRational(firstTransfer, volumeA) >= 0) {
    throw new Error("Cross-vessel first transfer exceeds source volume.");
  }
  const afterFirstB = addRational(volumeB, firstTransfer);
  const secondFraction = fraction(
    pick([[1, 5], [1, 4], [1, 3]] as const, `${seed}:second-fraction`),
  );
  const secondTransfer = multiplyRational(afterFirstB, secondFraction);
  const initial = [
    vessel("A", volumeA, rational(1)),
    vessel("B", volumeB, rational(0)),
  ] as const;
  const operations = [
    { kind: "TRANSFER", from: "A", to: "B", amount: firstTransfer },
    { kind: "TRANSFER", from: "B", to: "A", amount: secondTransfer },
  ] as const satisfies readonly MalCp006Operation[];
  const ledger = solveMalCp006Ledger(initial, operations);
  const finalA = getMalCp006Vessel(ledger, "A");
  const finalB = getMalCp006Vessel(ledger, "B");
  const waterInB = malCp006ComponentB(finalB);
  return buildQuestion({
    prototypeId:
      "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO",
    seed,
    context,
    difficulty: "Medium",
    answerSemantic: "CROSS_VESSEL_COMPONENT_RATIO",
    sourceEvidenceIds: ["PREPP-PURE-MILK-WATER-CROSS-VESSEL-RATIO"],
    initialVessels: initial,
    operations,
    exactAnswer: { kind: "RATIO", first: finalA.componentA, second: waterInB },
    stem:
      `Vessel A contains ${quantityText(volumeA, context.unit)} of pure milk and vessel B contains ${quantityText(volumeB, context.unit)} of pure water. ` +
      `${quantityText(firstTransfer, context.unit)} of milk is transferred A→B. Then ${quantityText(secondTransfer, context.unit)} of the current mixture in B is transferred back to A. ` +
      `What is the ratio of the final quantity of milk in A to the final quantity of water in B?`,
    visibleLines: [
      `After the first transfer, B contains ${quantityText(firstTransfer, context.unit)} milk mixed with its original water.`,
      "The return sample carries milk and water in B's current proportions.",
      `After updating both vessels, milk in A : water in B = ${ratioText(finalA.componentA, waterInB)}.`,
    ],
    commonMistake:
      "The material returned from B is not pure water; it is sampled from B's current milk-water mixture.",
    verification: [
      "Across the two transfers, global milk and global water are each conserved exactly.",
    ],
    siblingStateKey: `PURE-ROUND-TRIP|${rationalKey(volumeA)}|${rationalKey(volumeB)}|${rationalKey(firstTransfer)}|${rationalKey(secondFraction)}`,
  });
}

export function generateMalCp006Wave01Question(
  prototypeId: MalCp006Wave01PrototypeId,
  seed = "mal-cp006-wave01:default",
): MalCp006DiscoveryQuestion {
  switch (prototypeId) {
    case "MAL-CP006-PROT-TRANSFER-RETURN-FINAL-RATIO":
      return transferReturnQuestion(seed);
    case "MAL-CP006-PROT-EQUAL-EXCHANGE-AMOUNT-FOR-EQUAL-CONCENTRATIONS":
      return equalExchangeAmountQuestion(seed);
    case "MAL-CP006-PROT-FINAL-COMMON-CONCENTRATION-AFTER-EQUAL-EXCHANGE":
      return equalExchangeCommonPercentQuestion(seed);
    case "MAL-CP006-PROT-THREE-VESSEL-CYCLE-FINAL-CONCENTRATION":
      return threeVesselCycleQuestion(seed);
    case "MAL-CP006-PROT-SOURCE-REFILL-RETRANSFER-DESTINATION-RATIO":
      return sourceRefillRetransferQuestion(seed);
    case "MAL-CP006-PROT-ROUND-TRIP-CROSS-VESSEL-COMPONENT-RATIO":
      return crossVesselRatioQuestion(seed);
  }
}

export function malCp006Wave01Stable(
  question: MalCp006DiscoveryQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? `${value}n` : value,
  );
}
