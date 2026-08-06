import type { BlrCp007PrototypeId } from "./cp007-model";
import {
  buildBlrCp007EditorialV3Telemetry,
  generateBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3";
import type {
  BlrCp007EditorialV3Telemetry,
  BlrCp007V3Difficulty,
  GeneratedBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3-model";
import {
  BLR_CP007_V3_PROTOTYPE_PLANS,
  type BlrCp007V3PrototypePlan,
  type BlrCp007V3RelationTemplate,
} from "./cp007-editorial-v3-scenarios";

const mutablePlan = (plan: BlrCp007V3PrototypePlan) => plan as {
  templates: readonly BlrCp007V3RelationTemplate[];
};

const EASY_PROTOTYPES = new Set<BlrCp007PrototypeId>([
  "BLR-CP007-PROT-SELECT-DIRECT-FORWARD",
  "BLR-CP007-PROT-SELECT-DIRECT-REVERSE",
  "BLR-CP007-PROT-MISSING-TOKEN-DIRECT",
  "BLR-CP007-PROT-MISSING-TOKEN-REVERSE",
]);

const HARD_PROTOTYPES = new Set<BlrCp007PrototypeId>([
  "BLR-CP007-PROT-SELECT-THREE-LINK",
  "BLR-CP007-PROT-SELECT-AFFINAL",
  "BLR-CP007-PROT-MISSING-PAIR-THREE-LINK",
  "BLR-CP007-PROT-MISSING-PAIR-AFFINAL",
  "BLR-CP007-PROT-MISSING-PERSON-ENDPOINT",
  "BLR-CP007-PROT-VALIDITY-INCORRECT-DERIVED",
]);

function calibratedDifficulty(prototypeId: BlrCp007PrototypeId): BlrCp007V3Difficulty {
  if (EASY_PROTOTYPES.has(prototypeId)) return "EASY";
  if (HARD_PROTOTYPES.has(prototypeId)) return "HARD";
  return "MEDIUM";
}

function calibrate(question: GeneratedBlrCp007EditorialV3Question): GeneratedBlrCp007EditorialV3Question {
  const difficulty = calibratedDifficulty(question.sourcePrototypeId);
  const options = question.qlId === "BLR-QL-031" && question.completedStatements.length === 1
    ? question.options.map((option) => option.isCorrectAnswerForTask
      ? { ...option, studentExplanation: `${option.text} decodes as: ${option.decodedAssertions[0]}` }
      : option)
    : question.options;
  const optionAnalysis = question.explanation.optionAnalysis.map((analysis, index) => ({
    ...analysis,
    explanation: options[index]!.studentExplanation,
  }));
  return {
    ...question,
    options,
    explanation: { ...question.explanation, optionAnalysis },
    reviewProof: { ...question.reviewProof, difficulty },
    metadata: { ...question.metadata, difficulty },
  };
}

/**
 * The foundation validity generator uses a rolling four-option window. Without
 * this authority rotation, the focal-index rule selects template positions
 * 0/2/4/6 twice. Rotate the eight-template catalogue per seed so the keyed
 * statement is a different semantic construction in every record.
 */
export function generateBlrCp007EditorialV3FinalQuestion(
  prototypeId: BlrCp007PrototypeId,
  seed: number,
): GeneratedBlrCp007EditorialV3Question {
  const plan = BLR_CP007_V3_PROTOTYPE_PLANS.find((value) => value.prototypeId === prototypeId);
  if (!plan || plan.taskKind !== "SELECT_VALIDITY") {
    return calibrate(generateBlrCp007EditorialV3Question(prototypeId, seed));
  }

  const original = plan.templates;
  const focalIndex = (seed + (seed % 4)) % 8;
  const rotation = (seed - focalIndex + 8) % 8;
  const rotated = Array.from(
    { length: original.length },
    (_, index) => original[(index + rotation) % original.length]!,
  );

  mutablePlan(plan).templates = rotated;
  try {
    return calibrate(generateBlrCp007EditorialV3Question(prototypeId, seed));
  } finally {
    mutablePlan(plan).templates = original;
  }
}

export function generateBlrCp007EditorialV3FinalBank(): readonly GeneratedBlrCp007EditorialV3Question[] {
  return BLR_CP007_V3_PROTOTYPE_PLANS.flatMap((plan) =>
    Array.from({ length: 8 }, (_, seed) =>
      generateBlrCp007EditorialV3FinalQuestion(plan.prototypeId, seed),
    ),
  );
}

export function buildBlrCp007EditorialV3FinalTelemetry(
  bank = generateBlrCp007EditorialV3FinalBank(),
): BlrCp007EditorialV3Telemetry {
  return buildBlrCp007EditorialV3Telemetry(bank);
}
