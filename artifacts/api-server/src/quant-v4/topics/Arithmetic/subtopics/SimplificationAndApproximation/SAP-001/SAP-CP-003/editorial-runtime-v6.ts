import { hash32 } from "./exact";
import {
  generateSapCp003Package as generateV5Package,
  SAP_CP003_RUNTIME_STATE,
} from "./editorial-runtime-v5";
import { applySapCp003EditorialRemediationV3 } from "./editorial-remediation-v3";
import { applySapCp003EditorialQualityV3 } from "./editorial-quality-v3";
import { applySapCp003MissingPercentageV3 } from "./missing-percentage-v3";
import {
  SAP_CP003_PROTOTYPE_IDS,
  type SapCp003Option,
  type SapCp003Package,
  type SapCp003PrototypeId,
} from "./types";

function nextXorShift32(state: number): number {
  let value = state >>> 0 || 0x9e3779b9;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return value >>> 0;
}

function finalOptionShuffle(pkg: SapCp003Package): SapCp003Package {
  const order = [0, 1, 2, 3];
  let state = hash32([
    "SAP_CP003_EDITORIAL_V3_FINAL_OPTION_ORDER",
    pkg.prototypeId,
    pkg.canonicalPayloadKey,
    pkg.generationIdentity,
  ].join("|"));

  for (let index = order.length - 1; index > 0; index -= 1) {
    state = nextXorShift32(state);
    const swapIndex = state % (index + 1);
    [order[index], order[swapIndex]] = [order[swapIndex]!, order[index]!];
  }

  const options: readonly SapCp003Option[] = Object.freeze(order.map((sourceIndex, displayIndex) => Object.freeze({
    ...pkg.options[sourceIndex]!,
    displayIndex: displayIndex + 1,
  })));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const optionUniquenessPassed = new Set(options.map((option) => option.value)).size === 4;
  const singleCorrectOptionPassed = options.filter((option) => option.isCorrect).length === 1;
  const answerBindingPassed = correctIndex >= 0 && options[correctIndex]?.value === pkg.canonicalAnswer;
  const errors = pkg.validation.errors.filter((error) => !/option|answer is not bound/i.test(error));
  if (!optionUniquenessPassed) errors.push("The four visible options are not unique.");
  if (!singleCorrectOptionPassed) errors.push("Exactly one option must be marked correct.");
  if (!answerBindingPassed) errors.push("The answer is not bound to the correct visible option.");

  return Object.freeze({
    ...pkg,
    options,
    correctIndex,
    validation: Object.freeze({
      ...pkg.validation,
      ok: errors.length === 0,
      errors: Object.freeze(errors),
      optionUniquenessPassed,
      singleCorrectOptionPassed,
      answerBindingPassed,
    }),
  });
}

export function generateSapCp003Package(
  prototypeId: SapCp003PrototypeId,
  seed: number,
): SapCp003Package {
  const base = generateV5Package(prototypeId, seed);
  const remediated = prototypeId === "SAP-CP003-PROT-MISSING-PERCENTAGE-LITERAL"
    ? applySapCp003MissingPercentageV3(base)
    : applySapCp003EditorialRemediationV3(base);
  const qualityControlled = applySapCp003EditorialQualityV3(remediated);
  return finalOptionShuffle(qualityControlled);
}

export function generateSapCp003Sweep(
  seedsPerPrototype: number,
): readonly SapCp003Package[] {
  if (!Number.isInteger(seedsPerPrototype) || seedsPerPrototype <= 0) {
    throw new Error("SAP-CP-003 sweep size must be a positive integer.");
  }
  const packages: SapCp003Package[] = [];
  for (const prototypeId of SAP_CP003_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp003Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}

export const SAP_CP003_EDITORIAL_V3_STATE = Object.freeze({
  status: "EDITORIAL_REMEDIATION_V3_HUMAN_REVIEW_PENDING" as const,
  explanationReview: "FULL_300_QUESTION_CANDIDATE_PENDING_HUMAN_APPROVAL" as const,
  active: false as const,
  questionStudioDiscoverable: false as const,
  questionBankWritable: false as const,
  testEligible: false as const,
  publiclyPublishable: false as const,
});

export { SAP_CP003_RUNTIME_STATE };
