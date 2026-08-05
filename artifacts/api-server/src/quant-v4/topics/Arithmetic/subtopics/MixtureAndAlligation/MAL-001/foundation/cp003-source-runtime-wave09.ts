import {
  compareRational,
  divideRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import {
  MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES,
  MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
  solveMalCp003MinimumOperationsBelowThreshold,
} from "./cp003-external-source-wave08";
import { malCp003RetainedFraction, solveMalCp003Request } from "./cp003-solver";
import type { MalDifficulty, Rational } from "./types";

export const MAL_CP003_WAVE09_SOURCE_RUNTIME_ID =
  "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1" as const;

export const MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS = [
  "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL",
  MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID,
] as const;

export type MalCp003Wave09SourceRuntimeCandidateId =
  (typeof MAL_CP003_WAVE09_SOURCE_RUNTIME_CANDIDATE_IDS)[number];

export interface MalCp003Wave09StageRow {
  stage: number;
  originalQuantityAfterStage: string;
  comparisonToThreshold: "ABOVE_OR_EQUAL" | "BELOW" | null;
}

export interface MalCp003Wave09SourceRuntimeQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-003";
  runtimeId: typeof MAL_CP003_WAVE09_SOURCE_RUNTIME_ID;
  candidateId: MalCp003Wave09SourceRuntimeCandidateId;
  permanentQlId: null;
  questionLanguageId: string;
  language: "en";
  seed: string;
  difficulty: MalDifficulty;
  sourceEvidenceIds: readonly string[];
  stem: string;
  answer: string;
  options: string[];
  correctIndex: number;
  optionAudit: readonly {
    text: string;
    misconceptionId: string;
    isCorrect: boolean;
  }[];
  explanation: {
    layoutId: "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1";
    coreConcept: string;
    formula: string;
    steps: string[];
    verification: string;
    conclusion: string;
    examShortcut: string;
    commonTrap: string;
  };
  diagram: {
    type: "REPEATED_REPLACEMENT_THRESHOLD_LEDGER";
    title: string;
    vesselVolume: string;
    removedQuantityPerOperation: string;
    thresholdOriginalQuantity: string | null;
    stages: readonly MalCp003Wave09StageRow[];
    finalProjection: string;
    accessibleText: string;
  };
  mathematicalFingerprint: string;
  validation: { ok: boolean; errors: string[] };
  maturity: "DISCOVERY_PROTOTYPE";
  allocationStatus: "UNALLOCATED_OPEN_DISCOVERY";
  active: false;
  publiclyPublishable: false;
  questionStudioDiscoverable: false;
  questionBankWritable: false;
  testEligible: false;
}

type RuntimeCase = {
  vesselVolume: number;
  removedQuantity: number;
  operations: number;
  original: string;
  refill: string;
  container: string;
};

const REMOVAL_CASES: readonly RuntimeCase[] = [
  { vesselVolume: 40, removedQuantity: 4, operations: 2, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 40, removedQuantity: 4, operations: 3, original: "milk", refill: "water", container: "vessel" },
  { vesselVolume: 50, removedQuantity: 10, operations: 2, original: "milk", refill: "water", container: "can" },
  { vesselVolume: 60, removedQuantity: 6, operations: 3, original: "wine", refill: "water", container: "cask" },
  { vesselVolume: 64, removedQuantity: 16, operations: 2, original: "juice", refill: "water", container: "tank" },
  { vesselVolume: 72, removedQuantity: 12, operations: 2, original: "solution", refill: "solvent", container: "vessel" },
  { vesselVolume: 80, removedQuantity: 8, operations: 4, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 90, removedQuantity: 15, operations: 3, original: "syrup", refill: "water", container: "tank" },
  { vesselVolume: 96, removedQuantity: 24, operations: 2, original: "milk", refill: "water", container: "vessel" },
  { vesselVolume: 100, removedQuantity: 20, operations: 3, original: "liquid A", refill: "liquid B", container: "vessel" },
  { vesselVolume: 120, removedQuantity: 30, operations: 2, original: "fruit juice", refill: "water", container: "tank" },
  { vesselVolume: 125, removedQuantity: 25, operations: 3, original: "oil", refill: "lighter oil", container: "drum" },
  { vesselVolume: 144, removedQuantity: 24, operations: 3, original: "solution", refill: "solvent", container: "tank" },
  { vesselVolume: 160, removedQuantity: 40, operations: 2, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 200, removedQuantity: 40, operations: 4, original: "wine", refill: "water", container: "cask" },
] as const;

const THRESHOLD_CASES: readonly RuntimeCase[] = [
  { vesselVolume: 24, removedQuantity: 3, operations: 12, original: "milk", refill: "water", container: "vessel" },
  { vesselVolume: 30, removedQuantity: 3, operations: 12, original: "milk", refill: "water", container: "can" },
  { vesselVolume: 32, removedQuantity: 4, operations: 12, original: "juice", refill: "water", container: "container" },
  { vesselVolume: 36, removedQuantity: 6, operations: 10, original: "milk", refill: "water", container: "vessel" },
  { vesselVolume: 40, removedQuantity: 4, operations: 12, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 48, removedQuantity: 8, operations: 10, original: "wine", refill: "water", container: "cask" },
  { vesselVolume: 50, removedQuantity: 5, operations: 12, original: "milk", refill: "water", container: "can" },
  { vesselVolume: 60, removedQuantity: 10, operations: 10, original: "solution", refill: "solvent", container: "tank" },
  { vesselVolume: 64, removedQuantity: 8, operations: 12, original: "juice", refill: "water", container: "vessel" },
  { vesselVolume: 72, removedQuantity: 9, operations: 12, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 80, removedQuantity: 8, operations: 12, original: "milk", refill: "water", container: "tank" },
  { vesselVolume: 90, removedQuantity: 15, operations: 10, original: "syrup", refill: "water", container: "vessel" },
  { vesselVolume: 100, removedQuantity: 10, operations: 12, original: "liquid A", refill: "liquid B", container: "vessel" },
  { vesselVolume: 120, removedQuantity: 15, operations: 12, original: "fruit juice", refill: "water", container: "tank" },
] as const;

function hash(value: string): number {
  let result = 2166136261;
  for (const character of value) {
    result ^= character.codePointAt(0) ?? 0;
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
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
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

function displayMath(value: string): string {
  return `\\[${value}\\]`;
}

function quantityText(value: Rational): string {
  return `${formatRational(value)} litres`;
}

function sourceIdsFor(candidateId: MalCp003Wave09SourceRuntimeCandidateId): string[] {
  return MAL_CP003_WAVE08_EXTERNAL_SOURCE_REFERENCES.filter(
    (source) =>
      source.candidateId === candidateId &&
      (source.decisionImpact === "PROMOTE_TO_SOURCE_BACKED" ||
        source.decisionImpact === "ADD_NEW_SOURCE_BACKED_CANDIDATE"),
  ).map((source) => source.sourceId);
}

function buildOptions(
  answer: string,
  distractors: readonly { text: string; misconceptionId: string }[],
  seed: string,
) {
  const unique = new Map<string, { text: string; misconceptionId: string }>();
  unique.set(answer, { text: answer, misconceptionId: "CORRECT" });
  for (const distractor of distractors) {
    if (distractor.text !== answer && !unique.has(distractor.text)) {
      unique.set(distractor.text, distractor);
    }
  }
  if (unique.size < 4) {
    throw new Error(
      `Insufficient unique options for ${seed}: ${[...unique.keys()].join(", ")}.`,
    );
  }
  const selected = shuffle([...unique.values()].slice(0, 4), seed);
  const correctIndex = selected.findIndex((option) => option.text === answer);
  if (correctIndex < 0) throw new Error("Correct option was lost.");
  return {
    options: selected.map((option) => option.text),
    correctIndex,
    optionAudit: selected.map((option) => ({
      ...option,
      isCorrect: option.text === answer,
    })),
  };
}

function stageRows(input: {
  vesselVolume: Rational;
  initialOriginalQuantity: Rational;
  removedQuantity: Rational;
  operations: number;
  thresholdOriginalQuantity?: Rational;
}): MalCp003Wave09StageRow[] {
  const retainedFraction = malCp003RetainedFraction(
    input.vesselVolume,
    input.removedQuantity,
  );
  const rows: MalCp003Wave09StageRow[] = [];
  let current = input.initialOriginalQuantity;
  for (let stage = 1; stage <= input.operations; stage += 1) {
    current = multiplyRational(current, retainedFraction);
    rows.push({
      stage,
      originalQuantityAfterStage: quantityText(current),
      comparisonToThreshold: input.thresholdOriginalQuantity
        ? compareRational(current, input.thresholdOriginalQuantity) < 0
          ? "BELOW"
          : "ABOVE_OR_EQUAL"
        : null,
    });
  }
  return rows;
}

function validateQuestion(
  question: Omit<MalCp003Wave09SourceRuntimeQuestion, "validation">,
) {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (question.options.length !== 4) errors.push("Question does not have four options.");
  if (new Set(question.options).size !== 4) errors.push("Options are not unique.");
  if (question.options[question.correctIndex] !== question.answer) {
    errors.push("Correct option does not match the canonical answer.");
  }
  if (question.optionAudit.filter((option) => option.isCorrect).length !== 1) {
    errors.push("Option audit does not contain exactly one correct option.");
  }
  if (new Set(question.optionAudit.map((option) => option.misconceptionId)).size !== 4) {
    errors.push("Option misconception IDs are not unique.");
  }
  if (question.sourceEvidenceIds.length === 0) errors.push("Source evidence is missing.");
  if (question.permanentQlId !== null) errors.push("Permanent QL leaked into discovery.");
  if (question.diagram.stages.length < 2) errors.push("Stage diagram is incomplete.");
  if (
    question.active ||
    question.publiclyPublishable ||
    question.questionStudioDiscoverable ||
    question.questionBankWritable ||
    question.testEligible
  ) {
    errors.push("A discovery delivery flag became enabled.");
  }
  const learnerText = JSON.stringify({
    stem: question.stem,
    explanation: question.explanation,
  });
  if (/alligation/iu.test(learnerText)) {
    errors.push("Repeated-replacement explanation contains alligation.");
  }
  if (/logarithm|Math\.log|approximately solve/iu.test(learnerText)) {
    errors.push("Threshold explanation relies on logarithmic approximation.");
  }
  return { ok: errors.length === 0, errors };
}

function removalQuantityQuestion(seed: string): MalCp003Wave09SourceRuntimeQuestion {
  const candidateId = "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL" as const;
  const selected = pick(REMOVAL_CASES, `${seed}:case`);
  const vesselVolume = rational(selected.vesselVolume);
  const removedQuantity = rational(selected.removedQuantity);
  const initialOriginalQuantity = vesselVolume;
  const forward = solveMalCp003Request({
    mode: "FINAL_ORIGINAL_QUANTITY_EQUAL_STAGES",
    vesselVolume,
    initialOriginalQuantity,
    removedQuantity,
    operations: selected.operations,
  });
  if (forward.kind !== "FINAL_ORIGINAL_QUANTITY") {
    throw new Error("Unexpected forward result for removal-quantity construction.");
  }
  const inverse = solveMalCp003Request({
    mode: "REMOVAL_QUANTITY_FROM_FINAL",
    vesselVolume,
    initialOriginalQuantity,
    finalOriginalQuantity: forward.quantity,
    operations: selected.operations,
  });
  if (inverse.kind !== "REMOVAL_QUANTITY_PER_STAGE") {
    throw new Error("Unexpected inverse result for removal-quantity construction.");
  }
  if (compareRational(inverse.quantity, removedQuantity) !== 0) {
    throw new Error("Removal-quantity inverse did not recover the constructed value.");
  }

  const answer = quantityText(inverse.quantity);
  const averageObservedLoss = divideRational(
    subtractRational(initialOriginalQuantity, forward.quantity),
    rational(selected.operations),
  );
  const options = buildOptions(
    answer,
    [
      {
        text: quantityText(
          multiplyRational(removedQuantity, rational(selected.operations)),
        ),
        misconceptionId: "TOTAL_DRAWN_REPORTED_PER_OPERATION",
      },
      {
        text: quantityText(subtractRational(vesselVolume, removedQuantity)),
        misconceptionId: "RETAINED_VOLUME_REPORTED_AS_REMOVAL",
      },
      {
        text: quantityText(averageObservedLoss),
        misconceptionId: "AVERAGE_ORIGINAL_LOSS_TREATED_AS_DRAWN_QUANTITY",
      },
      {
        text: quantityText(
          divideRational(vesselVolume, rational(selected.operations + 2)),
        ),
        misconceptionId: "VESSEL_DIVIDED_BY_OPERATION_COUNT",
      },
      {
        text: quantityText(
          divideRational(vesselVolume, rational(selected.operations + 1)),
        ),
        misconceptionId: "OFF_BY_ONE_STAGE_DIVISION",
      },
    ],
    `${seed}:options`,
  );
  const retained = inverse.retainedFractionPerStage;
  const formula = displayMath(
    `\\frac{${formatRational(forward.quantity)}}{${selected.vesselVolume}}=\\left(1-\\frac{x}{${selected.vesselVolume}}\\right)^{${selected.operations}}`,
  );
  const questionWithoutValidation = {
    archetypeId: "MAL-001" as const,
    canonicalProblemId: "MAL-CP-003" as const,
    runtimeId: MAL_CP003_WAVE09_SOURCE_RUNTIME_ID,
    candidateId,
    permanentQlId: null,
    questionLanguageId: `${candidateId}-EN-DISCOVERY-W09`,
    language: "en" as const,
    seed,
    difficulty: (selected.operations >= 4 ? "Hard" : "Medium") as MalDifficulty,
    sourceEvidenceIds: sourceIdsFor(candidateId),
    stem: `A ${selected.container} initially contains ${selected.vesselVolume} litres of ${selected.original}. The same quantity is drawn out and replaced with ${selected.refill} in each of ${selected.operations} operations. After the last operation, ${quantityText(forward.quantity)} of the original ${selected.original} remains. How many litres are drawn out in each operation?`,
    answer,
    ...options,
    explanation: {
      layoutId: "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1" as const,
      coreConcept:
        "The final original-liquid fraction is the same one-stage retained fraction multiplied once for every replacement. Recover the exact one-stage fraction first, then convert its removed part into litres.",
      formula,
      steps: [
        `Initial original quantity: ${displayMath(`I=${selected.vesselVolume}`)}`,
        `Final retained fraction after ${selected.operations} operations: ${displayMath(`F=\\frac{${formatRational(forward.quantity)}}{${selected.vesselVolume}}=${formatRational(forward.retainedFraction)}`)}`,
        `Exact retained fraction in one operation: ${displayMath(`r=F^{1/${selected.operations}}=${formatRational(retained)}`)}`,
        `Removed fraction in one operation: ${displayMath(`1-r=${formatRational(subtractRational(rational(1), retained))}`)}`,
        `Quantity drawn each time: ${displayMath(`x=${selected.vesselVolume}\\left(1-r\\right)=${formatRational(inverse.quantity)}`)}`,
      ],
      verification: `Using ${answer} as the removal quantity gives the one-stage retained fraction ${formatRational(retained)} and reproduces exactly ${quantityText(forward.quantity)} after ${selected.operations} operations.`,
      conclusion: `Therefore, ${answer} are drawn out in each operation.`,
      examShortcut:
        "Divide final original quantity by initial original quantity, take the exact operation root, subtract from 1, and multiply by vessel volume.",
      commonTrap:
        "The amount drawn from the vessel is not the same as the loss of original liquid in later rounds, because the drawn sample also contains replacement liquid.",
    },
    diagram: {
      type: "REPEATED_REPLACEMENT_THRESHOLD_LEDGER" as const,
      title: "Backward recovery of the equal removal quantity",
      vesselVolume: quantityText(vesselVolume),
      removedQuantityPerOperation: answer,
      thresholdOriginalQuantity: null,
      stages: stageRows({
        vesselVolume,
        initialOriginalQuantity,
        removedQuantity,
        operations: selected.operations,
      }),
      finalProjection: `Final original quantity = ${quantityText(forward.quantity)}; equal removal = ${answer}`,
      accessibleText: `The original ${selected.original} is multiplied by the retained fraction ${formatRational(retained)} at each of ${selected.operations} stages, allowing the equal removal quantity ${answer} to be reconstructed.`,
    },
    mathematicalFingerprint: [
      candidateId,
      selected.vesselVolume,
      selected.operations,
      rationalKey(forward.quantity),
      rationalKey(inverse.quantity),
    ].join("|"),
    maturity: "DISCOVERY_PROTOTYPE" as const,
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY" as const,
    active: false as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  };
  return {
    ...questionWithoutValidation,
    validation: validateQuestion(questionWithoutValidation),
  };
}

function thresholdQuestion(seed: string): MalCp003Wave09SourceRuntimeQuestion {
  const candidateId = MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID;
  const selected = pick(THRESHOLD_CASES, `${seed}:case`);
  const vesselVolume = rational(selected.vesselVolume);
  const removedQuantity = rational(selected.removedQuantity);
  const initialOriginalQuantity = vesselVolume;
  const thresholdOriginalQuantity = divideRational(vesselVolume, rational(2));
  const result = solveMalCp003MinimumOperationsBelowThreshold({
    vesselVolume,
    initialOriginalQuantity,
    removedQuantity,
    thresholdOriginalQuantity,
    maximumOperations: selected.operations,
  });
  const answer = `${result.operations} operations`;
  const alternatives = [
    { value: Math.max(1, result.operations - 1), misconceptionId: "STOPS_BEFORE_STRICT_CROSSING" },
    { value: result.operations + 1, misconceptionId: "ONE_EXTRA_OPERATION" },
    { value: Math.max(1, result.operations - 2), misconceptionId: "LINEAR_LOSS_ESTIMATE" },
    { value: result.operations + 2, misconceptionId: "TWO_EXTRA_OPERATIONS" },
    { value: 1, misconceptionId: "SINGLE_OPERATION_ASSUMED" },
  ];
  const options = buildOptions(
    answer,
    alternatives.map((item) => ({
      text: `${item.value} operations`,
      misconceptionId: item.misconceptionId,
    })),
    `${seed}:options`,
  );
  const retained = result.retainedFractionPerStage;
  const questionVariants = [
    `A ${selected.container} initially contains ${selected.vesselVolume} litres of ${selected.original}. In every operation, ${selected.removedQuantity} litres are drawn out and replaced with ${selected.refill}. What is the minimum number of operations after which the quantity of ${selected.original} becomes less than the quantity of ${selected.refill}?`,
    `A ${selected.container} is full of ${selected.original}. Each time, ${selected.removedQuantity} litres are removed from the ${selected.vesselVolume}-litre ${selected.container} and replaced with ${selected.refill}. After at least how many operations will ${selected.refill} exceed the remaining ${selected.original}?`,
    `From a ${selected.vesselVolume}-litre ${selected.container} of ${selected.original}, ${selected.removedQuantity} litres are repeatedly removed and replaced with ${selected.refill}. Find the smallest number of operations for which less than half of the ${selected.container} is the original ${selected.original}?`,
  ] as const;
  const stem = pick(questionVariants, `${seed}:stem`);
  const formula = displayMath(
    `Q_n=${selected.vesselVolume}\\left(1-\\frac{${selected.removedQuantity}}{${selected.vesselVolume}}\\right)^n`,
  );
  const questionWithoutValidation = {
    archetypeId: "MAL-001" as const,
    canonicalProblemId: "MAL-CP-003" as const,
    runtimeId: MAL_CP003_WAVE09_SOURCE_RUNTIME_ID,
    candidateId,
    permanentQlId: null,
    questionLanguageId: `${candidateId}-EN-DISCOVERY-W09`,
    language: "en" as const,
    seed,
    difficulty: "Hard" as MalDifficulty,
    sourceEvidenceIds: sourceIdsFor(candidateId),
    stem,
    answer,
    ...options,
    explanation: {
      layoutId: "MAL-CP003-EN-WAVE09-SOURCE-RUNTIME-V1" as const,
      coreConcept:
        "The original liquid decreases geometrically. Because the question asks for the first operation that crosses a strict boundary, test exact stage values until the original quantity becomes less than half the vessel volume.",
      formula,
      steps: [
        `One-stage retained fraction: ${displayMath(`r=1-\\frac{${selected.removedQuantity}}{${selected.vesselVolume}}=${formatRational(retained)}`)}`,
        `The original liquid must become less than the replacement liquid, so it must be below half the vessel volume: ${displayMath(`T=\\frac{${selected.vesselVolume}}{2}=${formatRational(thresholdOriginalQuantity)}`)}`,
        `After ${result.operations - 1} operations, the original quantity is ${displayMath(`${formatRational(result.previousOriginalQuantity)}`)}, which is not below ${formatRational(thresholdOriginalQuantity)}.`,
        `After ${result.operations} operations, the original quantity is ${displayMath(`${formatRational(result.finalOriginalQuantity)}`)}, which is below ${formatRational(thresholdOriginalQuantity)}.`,
        `Therefore the first strict crossing occurs at operation ${result.operations}.`,
      ],
      verification: `Operation ${result.operations - 1} fails the strict condition, while operation ${result.operations} satisfies it; therefore the answer is minimal and unique.`,
      conclusion: `Therefore, the minimum required number is ${answer}.`,
      examShortcut:
        "Write the one-stage retained fraction and multiply stage by stage only until the strict boundary is crossed; check the previous stage to prove minimality.",
      commonTrap:
        "Do not choose the first stage that reaches the boundary. The wording says less than or exceeds, so equality would still not satisfy the condition.",
    },
    diagram: {
      type: "REPEATED_REPLACEMENT_THRESHOLD_LEDGER" as const,
      title: "Exact threshold crossing by replacement stage",
      vesselVolume: quantityText(vesselVolume),
      removedQuantityPerOperation: quantityText(removedQuantity),
      thresholdOriginalQuantity: quantityText(thresholdOriginalQuantity),
      stages: stageRows({
        vesselVolume,
        initialOriginalQuantity,
        removedQuantity,
        operations: result.operations,
        thresholdOriginalQuantity,
      }),
      finalProjection: `First stage below ${quantityText(thresholdOriginalQuantity)} = ${result.operations}`,
      accessibleText: `The original-liquid quantity is checked after every operation. It is still at or above ${quantityText(thresholdOriginalQuantity)} after ${result.operations - 1} operations and falls below it after ${result.operations} operations.`,
    },
    mathematicalFingerprint: [
      candidateId,
      selected.vesselVolume,
      selected.removedQuantity,
      rationalKey(thresholdOriginalQuantity),
      result.operations,
    ].join("|"),
    maturity: "DISCOVERY_PROTOTYPE" as const,
    allocationStatus: "UNALLOCATED_OPEN_DISCOVERY" as const,
    active: false as const,
    publiclyPublishable: false as const,
    questionStudioDiscoverable: false as const,
    questionBankWritable: false as const,
    testEligible: false as const,
  };
  return {
    ...questionWithoutValidation,
    validation: validateQuestion(questionWithoutValidation),
  };
}

export function generateMalCp003Wave09SourceRuntimeQuestion(
  candidateId: MalCp003Wave09SourceRuntimeCandidateId,
  seed = `mal-cp003-wave09:${candidateId}:default`,
): MalCp003Wave09SourceRuntimeQuestion {
  switch (candidateId) {
    case "MAL-CP003-PROT-REMOVAL-QUANTITY-FROM-FINAL":
      return removalQuantityQuestion(seed);
    case MAL_CP003_WAVE08_THRESHOLD_CANDIDATE_ID:
      return thresholdQuestion(seed);
  }
}

export function malCp003Wave09SourceRuntimeStable(
  question: MalCp003Wave09SourceRuntimeQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
}
