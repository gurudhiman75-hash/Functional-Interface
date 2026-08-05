import {
  divideRational,
  formatRational,
  multiplyRational,
  rational,
} from "./rational";
import { solveMalCp003MinimumOperationsBelowThreshold } from "./cp003-external-source-wave08";
import {
  generateMalCp003Wave12UnifiedQuestion as generateBaseQuestion,
  malCp003Wave12UnifiedStable as stableBaseQuestion,
  type MalCp003Wave12ContractId,
  type MalCp003Wave12UnifiedQuestion,
} from "./cp003-unified-runtime-wave12";

export {
  MAL_CP003_WAVE12_CONTRACT_IDS,
  MAL_CP003_WAVE12_READINESS,
  MAL_CP003_WAVE12_RUNTIME_ID,
} from "./cp003-unified-runtime-wave12";
export type {
  MalCp003Wave12ContractId,
  MalCp003Wave12UnifiedQuestion,
} from "./cp003-unified-runtime-wave12";

const REMOVAL_INVERSE_OPENERS = [
  "",
  "During an equal-replacement process, ",
  "For a repeated-replacement calculation, ",
  "In a competitive-exam vessel problem, ",
  "A student records the following operation: ",
  "Consider this repeated remove-and-refill process: ",
] as const;

const THRESHOLD_EDITORIAL_CASES = [
  { vesselVolume: 40, removedQuantity: 20, original: "milk", refill: "water", container: "vessel" },
  { vesselVolume: 40, removedQuantity: 10, original: "milk", refill: "water", container: "can" },
  { vesselVolume: 50, removedQuantity: 10, original: "juice", refill: "water", container: "container" },
  { vesselVolume: 64, removedQuantity: 8, original: "wine", refill: "water", container: "cask" },
  { vesselVolume: 50, removedQuantity: 5, original: "solution", refill: "solvent", container: "tank" },
  { vesselVolume: 80, removedQuantity: 20, original: "milk", refill: "water", container: "tank" },
  { vesselVolume: 96, removedQuantity: 12, original: "fruit juice", refill: "water", container: "vessel" },
  { vesselVolume: 100, removedQuantity: 10, original: "liquid A", refill: "liquid B", container: "container" },
] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
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
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function lowerFirst(value: string): string {
  return value.length === 0 ? value : `${value[0]!.toLowerCase()}${value.slice(1)}`;
}

function varyRemovalStem(baseStem: string, seed: string): string {
  const opener =
    REMOVAL_INVERSE_OPENERS[
      hash(`${seed}:wave12-removal-opener`) % REMOVAL_INVERSE_OPENERS.length
    ]!;
  if (!opener) return baseStem;
  return `${opener}${lowerFirst(baseStem)}`;
}

function thresholdEditorialQuestion(
  base: MalCp003Wave12UnifiedQuestion,
  seed: string,
): MalCp003Wave12UnifiedQuestion {
  const selected =
    THRESHOLD_EDITORIAL_CASES[
      hash(`${seed}:wave12-threshold-case`) % THRESHOLD_EDITORIAL_CASES.length
    ]!;
  const vesselVolume = rational(selected.vesselVolume);
  const removedQuantity = rational(selected.removedQuantity);
  const threshold = divideRational(vesselVolume, rational(2));
  const result = solveMalCp003MinimumOperationsBelowThreshold({
    vesselVolume,
    initialOriginalQuantity: vesselVolume,
    removedQuantity,
    thresholdOriginalQuantity: threshold,
    maximumOperations: 12,
  });
  const answer = `${result.operations} operations`;
  const candidates = [
    { text: answer, misconceptionId: "CORRECT" },
    {
      text: `${Math.max(1, result.operations - 1)} operations`,
      misconceptionId: "STOPS_BEFORE_STRICT_CROSSING",
    },
    {
      text: `${result.operations + 1} operations`,
      misconceptionId: "ONE_EXTRA_OPERATION",
    },
    {
      text: `${result.operations + 2} operations`,
      misconceptionId: "TWO_EXTRA_OPERATIONS",
    },
    {
      text: "1 operations",
      misconceptionId: "SINGLE_OPERATION_ASSUMED",
    },
  ];
  const unique = new Map<string, { text: string; misconceptionId: string }>();
  for (const candidate of candidates) {
    if (!unique.has(candidate.text)) unique.set(candidate.text, candidate);
  }
  const selectedOptions = shuffle([...unique.values()].slice(0, 4), `${seed}:threshold-options`);
  const options = selectedOptions.map((option) => option.text);
  const correctIndex = options.indexOf(answer);
  if (correctIndex < 0 || options.length !== 4) {
    throw new Error("Wave 12 threshold option construction failed.");
  }
  const stemVariants = [
    `A ${selected.container} initially contains ${selected.vesselVolume} litres of ${selected.original}. In each operation, ${selected.removedQuantity} litres are drawn out and replaced with ${selected.refill}. What is the minimum number of operations after which less than half of the mixture is the original ${selected.original}?`,
    `A ${selected.vesselVolume}-litre ${selected.container} is full of ${selected.original}. Every time, ${selected.removedQuantity} litres are removed and replaced with ${selected.refill}. After at least how many operations will the quantity of ${selected.refill} exceed the remaining ${selected.original}?`,
    `From a ${selected.container} holding ${selected.vesselVolume} litres of ${selected.original}, ${selected.removedQuantity} litres are repeatedly replaced by ${selected.refill}. Find the first operation after which the original ${selected.original} falls below ${formatRational(threshold)} litres?`,
  ] as const;
  const stem =
    stemVariants[hash(`${seed}:threshold-stem`) % stemVariants.length]!;
  const stages = [];
  let current = vesselVolume;
  for (let stage = 1; stage <= result.operations; stage += 1) {
    current = multiplyRational(current, result.retainedFractionPerStage);
    stages.push({
      stage,
      originalQuantityAfterStage: `${formatRational(current)} litres`,
      comparisonToThreshold:
        current.numerator * threshold.denominator <
        threshold.numerator * current.denominator
          ? ("BELOW" as const)
          : ("ABOVE_OR_EQUAL" as const),
    });
  }
  const errors = base.validation.errors.filter(
    (error) =>
      error !== "Stem is not interrogative." &&
      error !== "Correct option does not match the canonical answer.",
  );
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  return {
    ...base,
    seed,
    stem,
    answer,
    options,
    correctIndex,
    optionAudit: selectedOptions.map((option) => ({
      ...option,
      isCorrect: option.text === answer,
    })),
    explanation: {
      coreConcept:
        "The original component is multiplied by the same retained fraction after every operation. The required answer is the first stage at which its exact quantity becomes strictly less than half the vessel volume.",
      formula: `\\[Q_n=${selected.vesselVolume}\\left(1-\\frac{${selected.removedQuantity}}{${selected.vesselVolume}}\\right)^n\\]`,
      steps: [
        `One-stage retained fraction: \\[r=1-\\frac{${selected.removedQuantity}}{${selected.vesselVolume}}=${formatRational(result.retainedFractionPerStage)}\\]`,
        `Strict threshold for the original component: \\[T=\\frac{${selected.vesselVolume}}{2}=${formatRational(threshold)}\\]`,
        `After ${result.operations - 1} operations, the original quantity is \\[${formatRational(result.previousOriginalQuantity)}\\], which is not below ${formatRational(threshold)}.`,
        `After ${result.operations} operations, the original quantity is \\[${formatRational(result.finalOriginalQuantity)}\\], which is below ${formatRational(threshold)}.`,
        `Therefore the first strict crossing occurs at operation ${result.operations}.`,
      ],
      verification: `Operation ${result.operations - 1} fails the strict condition and operation ${result.operations} satisfies it, so ${answer} is both valid and minimal.`,
      conclusion: `Therefore, the minimum required number is ${answer}.`,
      examShortcut:
        "Apply the retained fraction stage by stage only until the original quantity first drops below half, then verify that the preceding stage still fails.",
      commonTrap:
        "Do not accept equality with half the vessel volume: the wording asks for less than the original component or for the replacement component to exceed it.",
    },
    diagram: {
      type: "REPEATED_REPLACEMENT_THRESHOLD_LEDGER",
      title: "Exact threshold crossing by replacement stage",
      vesselVolume: `${formatRational(vesselVolume)} litres`,
      removedQuantityPerOperation: `${formatRational(removedQuantity)} litres`,
      thresholdOriginalQuantity: `${formatRational(threshold)} litres`,
      stages,
      finalProjection: `First stage below ${formatRational(threshold)} litres = ${result.operations}`,
      accessibleText: `The original component remains at or above ${formatRational(threshold)} litres after ${result.operations - 1} operations and falls below it after ${result.operations} operations.`,
    },
    mathematicalFingerprint: [
      base.contractId,
      selected.vesselVolume,
      selected.removedQuantity,
      result.operations,
      formatRational(result.finalOriginalQuantity),
    ].join("|"),
    validation: { ok: errors.length === 0, errors },
  };
}

export function generateMalCp003Wave12EditorialQuestion(
  contractId: MalCp003Wave12ContractId,
  seed = `mal-cp003-wave12-editorial:${contractId}:default`,
): MalCp003Wave12UnifiedQuestion {
  const base = generateBaseQuestion(contractId, seed);
  if (contractId === "MAL-CP003-CONTRACT-MINIMUM-OPERATIONS-THRESHOLD") {
    return thresholdEditorialQuestion(base, seed);
  }
  if (contractId !== "MAL-CP003-CONTRACT-REMOVAL-QUANTITY-FROM-FINAL") {
    return base;
  }
  const stem = varyRemovalStem(base.stem, seed);
  const errors = base.validation.errors.filter(
    (error) => error !== "Stem is not interrogative.",
  );
  if (!stem.endsWith("?")) errors.push("Stem is not interrogative.");
  return {
    ...base,
    stem,
    validation: { ok: errors.length === 0, errors },
  };
}

export function malCp003Wave12EditorialStable(
  question: MalCp003Wave12UnifiedQuestion,
): string {
  return stableBaseQuestion(question);
}
