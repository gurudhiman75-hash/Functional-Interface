import type { BlrCp007PrototypeId } from "./cp007-model";
import {
  buildBlrCp007EditorialV3Telemetry,
  generateBlrCp007EditorialV3Question,
} from "./cp007-editorial-v3";
import type {
  BlrCp007EditorialV3Telemetry,
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
    return generateBlrCp007EditorialV3Question(prototypeId, seed);
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
    return generateBlrCp007EditorialV3Question(prototypeId, seed);
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
