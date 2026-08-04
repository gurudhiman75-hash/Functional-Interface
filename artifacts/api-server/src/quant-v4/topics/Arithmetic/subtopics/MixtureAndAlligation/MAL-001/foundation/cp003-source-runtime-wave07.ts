import {
  equalsRational,
  formatRational,
  multiplyRational,
  rational,
  rationalKey,
  subtractRational,
} from "./rational";
import { MAL_CP003_DISCOVERY_PROTOTYPE_IDS } from "./cp003-types";
import {
  MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS,
  MAL_CP003_WAVE04_SOURCE_REFERENCES,
  formatMalCp003SourceRatio,
  solveMalCp003FinalRatioSourceContract,
  solveMalCp003VesselVolumeFromFinalRatioSourceContract,
  type MalCp003Wave04SourceCandidateId,
} from "./cp003-source-contract-wave04";
import {
  buildMalCp003FinalRatioDistractors,
  malCp003FinalOriginalQuantity,
} from "./cp003-adversarial-wave06";
import type { MalDifficulty, Rational } from "./types";

export const MAL_CP003_UNIFIED_DISCOVERY_CANDIDATE_IDS = [
  ...MAL_CP003_DISCOVERY_PROTOTYPE_IDS,
  ...MAL_CP003_WAVE04_SOURCE_CANDIDATE_IDS,
] as const;

export const MAL_CP003_SOURCE_RUNTIME_ID =
  "MAL-CP003-EN-SOURCE-BACKED-DISCOVERY-V1" as const;

export interface MalCp003SourceRuntimeDiagram {
  type: "REPEATED_REPLACEMENT_SOURCE_FLOW";
  title: string;
  stages: readonly {
    stage: number;
    removedQuantity: string;
    retainedOriginalFractionAfterStage: string;
  }[];
  finalProjection: string;
  accessibleText: string;
}

export interface MalCp003SourceRuntimeQuestion {
  archetypeId: "MAL-001";
  canonicalProblemId: "MAL-CP-003";
  runtimeId: typeof MAL_CP003_SOURCE_RUNTIME_ID;
  candidateId: MalCp003Wave04SourceCandidateId;
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
    layoutId: "MAL-CP003-EN-SOURCE-CONTRACT-DISCOVERY-V1";
    coreConcept: string;
    formula: string;
    steps: string[];
    verification: string;
    conclusion: string;
    examShortcut: string;
    commonTrap: string;
  };
  diagram: MalCp003SourceRuntimeDiagram;
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

type SourceCase = {
  vesselVolume: number;
  removedQuantity: number;
  operations: number;
  original: string;
  refill: string;
  container: string;
};

const SOURCE_CASES: readonly SourceCase[] = [
  { vesselVolume: 24, removedQuantity: 8, operations: 4, original: "wine", refill: "water", container: "cask" },
  { vesselVolume: 40, removedQuantity: 4, operations: 3, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 50, removedQuantity: 10, operations: 2, original: "milk", refill: "water", container: "can" },
  { vesselVolume: 64, removedQuantity: 16, operations: 2, original: "juice", refill: "water", container: "tank" },
  { vesselVolume: 72, removedQuantity: 12, operations: 2, original: "acid solution", refill: "water", container: "vessel" },
  { vesselVolume: 80, removedQuantity: 8, operations: 3, original: "wine", refill: "water", container: "container" },
  { vesselVolume: 90, removedQuantity: 15, operations: 3, original: "syrup", refill: "water", container: "tank" },
  { vesselVolume: 96, removedQuantity: 24, operations: 2, original: "milk", refill: "water", container: "vessel" },
  { vesselVolume: 100, removedQuantity: 20, operations: 3, original: "liquid A", refill: "liquid B", container: "vessel" },
  { vesselVolume: 120, removedQuantity: 30, operations: 2, original: "fruit juice", refill: "water", container: "tank" },
  { vesselVolume: 125, removedQuantity: 25, operations: 3, original: "oil", refill: "lighter oil", container: "drum" },
  { vesselVolume: 144, removedQuantity: 24, operations: 3, original: "solution", refill: "solvent", container: "tank" },
  { vesselVolume: 160, removedQuantity: 40, operations: 2, original: "milk", refill: "water", container: "container" },
  { vesselVolume: 200, removedQuantity: 40, operations: 4, original: "wine", refill: "water", container: "cask" },
  { vesselVolume: 240, removedQuantity: 48, operations: 3, original: "juice", refill: "water", container: "vessel" },
  { vesselVolume: 300, removedQuantity: 60, operations: 2, original: "solution", refill: "water", container: "tank" },
  { vesselVolume: 480, removedQuantity: 48, operations: 3, original: "wine", refill: "water", container: "container" },
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

function quantityText(value: Rational): string {
  return `${formatRational(value)} litres`;
}

function displayMath(value: string): string {
  return `\\[${value}\\]`;
}

function retainedStageRows(input: {
  vesselVolume: Rational;
  removedQuantity: Rational;
  operations: number;
}) {
  const oneStageNumerator = subtractRational(
    input.vesselVolume,
    input.removedQuantity,
  );
  return Array.from({ length: input.operations }, (_value, index) => {
    const retained = multiplyRational(
      rational(1),
      rational(
        oneStageNumerator.numerator ** BigInt(index + 1),
        input.vesselVolume.numerator ** BigInt(index + 1),
      ),
    );
    return {
      stage: index + 1,
      removedQuantity: quantityText(input.removedQuantity),
      retainedOriginalFractionAfterStage: formatRational(retained),
    };
  });
}

function sourceIdsFor(candidateId: MalCp003Wave04SourceCandidateId): string[] {
  return MAL_CP003_WAVE04_SOURCE_REFERENCES.filter(
    (source) => source.candidateId === candidateId,
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
    throw new Error(`Insufficient unique options for ${seed}: ${[...unique.keys()].join(", ")}.`);
  }
  const selected = shuffle([...unique.values()].slice(0, 4), seed);
  const correctIndex = selected.findIndex((item) => item.text === answer);
  if (correctIndex < 0) throw new Error("Correct option was lost.");
  return {
    options: selected.map((item) => item.text),
    correctIndex,
    optionAudit: selected.map((item) => ({
      ...item,
      isCorrect: item.text === answer,
    })),
  };
}

function validateQuestion(question: Omit<MalCp003SourceRuntimeQuestion, "validation">) {
  const errors: string[] = [];
  if (!question.stem.endsWith("?")) errors.push("Stem is not interrogative.");
  if (question.options.length !== 4) errors.push("Question does not have four options.");
  if (new Set(question.options).size !== 4) errors.push("Options are not unique.");
  if (question.options[question.correctIndex] !== question.answer) {
    errors.push("Correct option does not match canonical answer.");
  }
  if (question.sourceEvidenceIds.length === 0) errors.push("Source evidence is missing.");
  if (question.permanentQlId !== null) errors.push("Permanent QL leaked into discovery.");
  if (
    question.active ||
    question.publiclyPublishable ||
    question.questionStudioDiscoverable ||
    question.questionBankWritable ||
    question.testEligible
  ) {
    errors.push("A discovery delivery flag became enabled.");
  }
  if (/alligation/iu.test(JSON.stringify(question.explanation))) {
    errors.push("Repeated-replacement explanation contains alligation.");
  }
  return { ok: errors.length === 0, errors };
}

function ratioQuestion(seed: string): MalCp003SourceRuntimeQuestion {
  const candidateId =
    "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS" as const;
  const selected = pick(SOURCE_CASES.slice(1), `${seed}:ratio-case`);
  const orientation =
    hash(`${seed}:orientation`) % 2 === 0
      ? "ORIGINAL_TO_REFILL"
      : "REFILL_TO_ORIGINAL";
  const source = solveMalCp003FinalRatioSourceContract({
    vesselVolume: rational(selected.vesselVolume),
    removedQuantity: rational(selected.removedQuantity),
    operations: selected.operations,
  });
  const project = (original: Rational, refill: Rational) =>
    orientation === "ORIGINAL_TO_REFILL"
      ? formatMalCp003SourceRatio(original, refill)
      : formatMalCp003SourceRatio(refill, original);
  const answer = project(source.originalPart, source.refillPart);
  const authority = buildMalCp003FinalRatioDistractors({
    vesselVolume: rational(selected.vesselVolume),
    removedQuantity: rational(selected.removedQuantity),
    operations: selected.operations,
    requestedOrientation: orientation,
  });
  const distractors = [...authority.distractors];
  for (const delta of [-1, 1, 2] as const) {
    const operations = Math.max(1, selected.operations + delta);
    const alternate = solveMalCp003FinalRatioSourceContract({
      vesselVolume: rational(selected.vesselVolume),
      removedQuantity: rational(selected.removedQuantity),
      operations,
    });
    distractors.push({
      text: project(alternate.originalPart, alternate.refillPart),
      misconceptionId:
        delta < 0 ? "TOO_FEW_OPERATIONS" : "TOO_MANY_OPERATIONS",
    });
  }
  const options = buildOptions(answer, distractors, `${seed}:ratio-options`);
  const initial = rational(selected.vesselVolume);
  const finalOriginal = malCp003FinalOriginalQuantity({
    vesselVolume: initial,
    removedQuantity: rational(selected.removedQuantity),
    operations: selected.operations,
  });
  const finalRefill = subtractRational(initial, finalOriginal);
  const requestedLabel =
    orientation === "ORIGINAL_TO_REFILL"
      ? `${selected.original}:${selected.refill}`
      : `${selected.refill}:${selected.original}`;
  const formula = displayMath(
    `R=\\left(1-\\frac{${selected.removedQuantity}}{${selected.vesselVolume}}\\right)^{${selected.operations}}`,
  );
  const questionWithoutValidation = {
    archetypeId: "MAL-001" as const,
    canonicalProblemId: "MAL-CP-003" as const,
    runtimeId: MAL_CP003_SOURCE_RUNTIME_ID,
    candidateId,
    permanentQlId: null,
    questionLanguageId: `${candidateId}-EN-DISCOVERY`,
    language: "en" as const,
    seed,
    difficulty: "Medium" as MalDifficulty,
    sourceEvidenceIds: sourceIdsFor(candidateId),
    stem: `A ${selected.container} initially contains ${selected.vesselVolume} litres of ${selected.original}. Each time, ${selected.removedQuantity} litres are drawn out and replaced with ${selected.refill}. After ${selected.operations} replacements, what is the final ratio of ${requestedLabel}?`,
    answer,
    ...options,
    explanation: {
      layoutId: "MAL-CP003-EN-SOURCE-CONTRACT-DISCOVERY-V1" as const,
      coreConcept:
        "Each replacement removes the same fraction of every component already present. Therefore the original liquid is multiplied by the one-stage retention factor once per operation.",
      formula,
      steps: [
        `One-stage retained fraction: ${displayMath(`r=\\frac{${selected.vesselVolume}-${selected.removedQuantity}}{${selected.vesselVolume}}`)}`,
        `Retained original fraction after ${selected.operations} operations: ${displayMath(`r^{${selected.operations}}=${formatRational(source.retainedFraction)}`)}`,
        `Final original quantity: ${displayMath(`${selected.vesselVolume}\\times ${formatRational(source.retainedFraction)}=${formatRational(finalOriginal)}`)}`,
        `Final refill quantity: ${displayMath(`${selected.vesselVolume}-${formatRational(finalOriginal)}=${formatRational(finalRefill)}`)}`,
        `Form the requested ordered ratio and reduce it: ${displayMath(`${requestedLabel}=${answer}`)}`,
      ],
      verification: `The two final component quantities add to ${selected.vesselVolume} litres, and reversing the requested order would produce a different option.`,
      conclusion: `Therefore, the final ratio of ${requestedLabel} is ${answer}.`,
      examShortcut:
        "Find the original-liquid fraction with the retention power, take its complement for the replacement liquid, and reduce the ratio in the exact order asked.",
      commonTrap:
        "Do not reverse the ratio and do not subtract the removed amount linearly from the original liquid at every round.",
    },
    diagram: {
      type: "REPEATED_REPLACEMENT_SOURCE_FLOW" as const,
      title: "Original-liquid retention across replacements",
      stages: retainedStageRows({
        vesselVolume: rational(selected.vesselVolume),
        removedQuantity: rational(selected.removedQuantity),
        operations: selected.operations,
      }),
      finalProjection: `${requestedLabel} = ${answer}`,
      accessibleText: `The original-liquid fraction is multiplied by the same retained fraction for ${selected.operations} stages, then converted to the requested ${requestedLabel} ratio.`,
    },
    mathematicalFingerprint: [
      candidateId,
      selected.vesselVolume,
      selected.removedQuantity,
      selected.operations,
      orientation,
      answer,
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

function vesselQuestion(seed: string): MalCp003SourceRuntimeQuestion {
  const candidateId = "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO" as const;
  const selected = pick(SOURCE_CASES, `${seed}:vessel-case`);
  const ratio = solveMalCp003FinalRatioSourceContract({
    vesselVolume: rational(selected.vesselVolume),
    removedQuantity: rational(selected.removedQuantity),
    operations: selected.operations,
  });
  const recovered = solveMalCp003VesselVolumeFromFinalRatioSourceContract({
    removedQuantity: rational(selected.removedQuantity),
    operations: selected.operations,
    finalOriginalPart: ratio.originalPart,
    finalRefillPart: ratio.refillPart,
  });
  if (!equalsRational(recovered.vesselVolume, rational(selected.vesselVolume))) {
    throw new Error("Valid-state vessel construction failed its inverse round trip.");
  }
  const answer = quantityText(recovered.vesselVolume);
  const distractorValues = [
    {
      value: subtractRational(recovered.vesselVolume, rational(selected.removedQuantity)),
      misconceptionId: "ONE_STAGE_RETAINED_VOLUME_REPORTED",
    },
    {
      value: multiplyRational(rational(selected.removedQuantity), rational(selected.operations)),
      misconceptionId: "TOTAL_DRAWN_REPORTED_AS_CAPACITY",
    },
    {
      value: rational(selected.removedQuantity),
      misconceptionId: "REMOVAL_QUANTITY_REPORTED_AS_CAPACITY",
    },
    {
      value: rational(selected.vesselVolume + selected.removedQuantity),
      misconceptionId: "REMOVED_QUANTITY_ADDED_TO_CAPACITY",
    },
  ];
  const options = buildOptions(
    answer,
    distractorValues.map((item) => ({
      text: quantityText(item.value),
      misconceptionId: item.misconceptionId,
    })),
    `${seed}:vessel-options`,
  );
  const finalRatio = formatMalCp003SourceRatio(
    ratio.originalPart,
    ratio.refillPart,
  );
  const totalParts = ratio.originalPart.numerator + ratio.refillPart.numerator;
  const formula = displayMath(
    `\\frac{${ratio.originalPart.numerator}}{${totalParts}}=\\left(1-\\frac{${selected.removedQuantity}}{V}\\right)^{${selected.operations}}`,
  );
  const questionWithoutValidation = {
    archetypeId: "MAL-001" as const,
    canonicalProblemId: "MAL-CP-003" as const,
    runtimeId: MAL_CP003_SOURCE_RUNTIME_ID,
    candidateId,
    permanentQlId: null,
    questionLanguageId: `${candidateId}-EN-DISCOVERY`,
    language: "en" as const,
    seed,
    difficulty: "Hard" as MalDifficulty,
    sourceEvidenceIds: sourceIdsFor(candidateId),
    stem: `A ${selected.container} is initially full of ${selected.original}. Each time, ${selected.removedQuantity} litres are drawn out and replaced with ${selected.refill}. After ${selected.operations} such operations, the ratio of ${selected.original} to ${selected.refill} is ${finalRatio}. What is the capacity of the ${selected.container}?`,
    answer,
    ...options,
    explanation: {
      layoutId: "MAL-CP003-EN-SOURCE-CONTRACT-DISCOVERY-V1" as const,
      coreConcept:
        "The final original-liquid ratio first gives the total retained fraction. Its exact nth root gives the retained fraction per operation, from which the vessel capacity is reconstructed.",
      formula,
      steps: [
        `Convert the final ratio to the final original fraction: ${displayMath(`F=\\frac{${ratio.originalPart.numerator}}{${totalParts}}=${formatRational(recovered.finalOriginalFraction)}`)}`,
        `Take the exact ${selected.operations}th root: ${displayMath(`r=F^{1/${selected.operations}}=${formatRational(recovered.retainedFractionPerStage)}`)}`,
        `The removed fraction per operation is: ${displayMath(`1-r=${formatRational(subtractRational(rational(1), recovered.retainedFractionPerStage))}`)}`,
        `Use removed quantity = vessel capacity × removed fraction: ${displayMath(`${selected.removedQuantity}=V\\times ${formatRational(subtractRational(rational(1), recovered.retainedFractionPerStage))}`)}`,
        `Solve for the capacity: ${displayMath(`V=${formatRational(recovered.vesselVolume)}`)}`,
      ],
      verification: `Substituting V = ${formatRational(recovered.vesselVolume)} gives the exact final ratio ${finalRatio} after ${selected.operations} operations.`,
      conclusion: `Therefore, the capacity of the ${selected.container} is ${answer}.`,
      examShortcut:
        "Turn the final ratio into the original-liquid fraction, take the exact operation root, and divide the removed quantity by one minus that root.",
      commonTrap:
        "Do not treat the final retained fraction as the one-stage retained fraction, and do not report the total quantity drawn across all rounds as the vessel capacity.",
    },
    diagram: {
      type: "REPEATED_REPLACEMENT_SOURCE_FLOW" as const,
      title: "Backward reconstruction from final ratio",
      stages: retainedStageRows({
        vesselVolume: recovered.vesselVolume,
        removedQuantity: rational(selected.removedQuantity),
        operations: selected.operations,
      }),
      finalProjection: `Final ${selected.original}:${selected.refill} = ${finalRatio}; capacity = ${answer}`,
      accessibleText: `The final original fraction is traced backward through ${selected.operations} equal retention stages to recover a vessel capacity of ${answer}.`,
    },
    mathematicalFingerprint: [
      candidateId,
      selected.removedQuantity,
      selected.operations,
      finalRatio,
      rationalKey(recovered.vesselVolume),
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

export function generateMalCp003SourceRuntimeQuestion(
  candidateId: MalCp003Wave04SourceCandidateId,
  seed = `mal-cp003-source-runtime:${candidateId}:default`,
): MalCp003SourceRuntimeQuestion {
  switch (candidateId) {
    case "MAL-CP003-PROT-FINAL-ORIGINAL-TO-REFILL-RATIO-EQUAL-REPLACEMENTS":
      return ratioQuestion(seed);
    case "MAL-CP003-PROT-VESSEL-VOLUME-FROM-FINAL-RATIO":
      return vesselQuestion(seed);
  }
}

export function malCp003SourceRuntimeStable(
  question: MalCp003SourceRuntimeQuestion,
): string {
  return JSON.stringify(question, (_key, value) =>
    typeof value === "bigint" ? value.toString() : value,
  );
}
