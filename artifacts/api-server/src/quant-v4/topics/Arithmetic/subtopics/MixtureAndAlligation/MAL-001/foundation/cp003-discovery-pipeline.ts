import { formatRational } from "./rational";
import {
  cp003Stable,
  generateMalCp003DiscoveryPrototype,
} from "./cp003-prototype-runtime";
import type {
  MalCp003ExecutablePrototypeId,
  MalCp003GeneratedPrototype,
} from "./cp003-types";

const SHALLOW_EXPLANATION_ERROR =
  "Explanation has fewer than four worked steps.";

/**
 * Final open-discovery authoring gate.
 *
 * The core runtime builds one worked row for every unequal replacement stage
 * and a final quantity row. A two-stage instance therefore needs one explicit
 * product row so the learner can see why the stage factors multiply before
 * they are applied to the initial amount.
 */
export function runMalCp003DiscoveryPipeline(
  prototypeId: MalCp003ExecutablePrototypeId,
  seed = `mal-cp003:${prototypeId}:default`,
): MalCp003GeneratedPrototype {
  const base = generateMalCp003DiscoveryPrototype(prototypeId, seed);
  if (base.explanation.steps.length >= 4) return base;

  if (
    base.request.mode !== "FINAL_ORIGINAL_QUANTITY_UNEQUAL_STAGES" ||
    base.solution.kind !== "FINAL_ORIGINAL_QUANTITY" ||
    base.explanation.steps.length !== 3
  ) {
    throw new Error(
      `${base.prototypeId}/${seed}: unexpected shallow explanation shape.`,
    );
  }

  const stageSteps = base.explanation.steps.slice(0, -1);
  const finalStep = base.explanation.steps.at(-1);
  if (!finalStep) {
    throw new Error(`${base.prototypeId}/${seed}: final calculation step is missing.`);
  }

  const productStep = `Step ${stageSteps.length + 1}: Multiply the stage-specific retained fractions. The cumulative retained fraction is \\(${formatRational(
    base.solution.retainedFraction,
  )}\\).`;
  const renumberedFinalStep = finalStep.replace(
    /^Step\s+\d+:/u,
    `Step ${stageSteps.length + 2}:`,
  );
  const errors = base.validation.errors.filter(
    (error) => error !== SHALLOW_EXPLANATION_ERROR,
  );

  return {
    ...base,
    explanation: {
      ...base.explanation,
      steps: [...stageSteps, productStep, renumberedFinalStep],
    },
    validation: {
      ok: errors.length === 0,
      errors,
    },
  };
}

export { cp003Stable };
