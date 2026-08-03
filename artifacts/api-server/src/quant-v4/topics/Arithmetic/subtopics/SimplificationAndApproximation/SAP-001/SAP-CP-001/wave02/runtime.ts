import { SAP_001_PACKAGE_ID, SAP_CP_001_ID, SAP_CP001_WAVE02_PROTOTYPE_IDS, type SapCp001Wave02Explanation, type SapCp001Wave02Option, type SapCp001Wave02Package, type SapCp001Wave02PrototypeId } from "./types";
import { LIFECYCLE, SOURCE_ANCESTRY, DeterministicRng, assertPositiveInteger, difficultyForSeed, prototypeIndex, type BuiltState } from "./common";
import { buildComparisonState, buildEquivalentGroupingState } from "./comparison-runtime";
import { buildFirstValidStepState, buildIncorrectChainState } from "./diagnostic-runtime";
import { buildPartialEvaluationState } from "./partial-runtime";

function buildState(prototypeId: SapCp001Wave02PrototypeId, seed: number, difficulty: import("./types").SapDifficulty, rng: DeterministicRng): BuiltState {
  const correctIndex = (seed + prototypeIndex(prototypeId)) % 4;
  switch (prototypeId) {
    case "SAP-CP001-PROT-COMPARE-DIFFERENT-GROUPINGS": return buildComparisonState(rng, seed, difficulty, correctIndex);
    case "SAP-CP001-PROT-SELECT-EQUIVALENT-GROUPING": return buildEquivalentGroupingState(rng, seed, difficulty, correctIndex);
    case "SAP-CP001-PROT-IDENTIFY-FIRST-VALID-STEP": return buildFirstValidStepState(rng, seed, difficulty, correctIndex);
    case "SAP-CP001-PROT-IDENTIFY-INCORRECT-PRECEDENCE-STEP": return buildIncorrectChainState(rng, seed, difficulty);
    case "SAP-CP001-PROT-PARTIAL-SUBEXPRESSION-VALUE": return buildPartialEvaluationState(rng, seed, difficulty, correctIndex);
  }
}

function validatePackage(pkg: Omit<SapCp001Wave02Package, "validation">): readonly string[] {
  const errors: string[] = [];
  if (pkg.canonicalAnswer !== pkg.verifierAnswer) errors.push("Canonical and verifier answers differ.");
  if (pkg.options.length !== 4) errors.push("Exactly four options are required.");
  if (new Set(pkg.options.map((option) => option.value)).size !== 4) errors.push("Option values must be unique.");
  if (pkg.options.filter((option) => option.isCorrect).length !== 1) errors.push("Exactly one option must be correct.");
  if (!pkg.options[pkg.correctIndex]?.isCorrect) errors.push("correctIndex does not identify the correct option.");
  if (pkg.options[pkg.correctIndex]?.value !== pkg.canonicalAnswer) errors.push("Correct option value does not match canonical answer.");
  if (pkg.options.some((option) => !option.isCorrect && (!option.misconceptionId || option.analysis.length === 0))) {
    errors.push("Every wrong option needs misconception evidence.");
  }
  if (pkg.stem.length < 25) errors.push("Stem is too short for review.");
  if (pkg.explanation.stepByStep.length < 2) errors.push("Explanation needs at least two concrete steps.");
  if (pkg.explanation.commonTraps.length !== 3) errors.push("Explanation must expose three option-linked traps.");
  if (!pkg.explanation.finalAnswer.includes(pkg.canonicalAnswer)) errors.push("Final answer does not state the canonical answer.");
  if (pkg.lifecycle.permanentQlId !== null || pkg.permanentQlId !== null) errors.push("A discovery package received a permanent QL ID.");
  if (pkg.lifecycle.active || pkg.lifecycle.questionStudioDiscoverable || pkg.lifecycle.publiclyPublishable) {
    errors.push("A discovery package escaped lifecycle locks.");
  }
  return Object.freeze(errors);
}

export function generateSapCp001Wave02Package(
  prototypeId: SapCp001Wave02PrototypeId,
  seed: number,
): SapCp001Wave02Package {
  assertPositiveInteger(seed, "SAP-CP-001 Wave 02 seed");
  if (!SAP_CP001_WAVE02_PROTOTYPE_IDS.includes(prototypeId)) {
    throw new Error(`Unknown SAP-CP-001 Wave 02 prototype: ${prototypeId}`);
  }
  const difficulty = difficultyForSeed(seed);
  const rng = new DeterministicRng(`${prototypeId}:${seed}`);
  const built = buildState(prototypeId, seed, difficulty, rng);
  const options: readonly SapCp001Wave02Option[] = Object.freeze(built.optionDrafts.map((option) => Object.freeze(option)));
  const correctIndex = options.findIndex((option) => option.isCorrect);
  const commonTraps = Object.freeze(options
    .filter((option) => !option.isCorrect)
    .map((option) => option.analysis));
  const explanation: SapCp001Wave02Explanation = Object.freeze({
    ...built.explanation,
    commonTraps,
    finalAnswer: `The correct answer is ${built.canonicalAnswer}.`,
  });
  const withoutValidation = {
    packageId: SAP_001_PACKAGE_ID,
    checkpointId: SAP_CP_001_ID,
    temporaryPrototypeId: prototypeId,
    permanentQlId: null,
    locale: "en-IN" as const,
    seed,
    difficulty,
    difficultyEvidence: built.difficultyEvidence,
    taskDirection: built.taskDirection,
    answerSemantic: built.answerSemantic,
    stem: built.stem,
    questionState: built.questionState,
    canonicalAnswer: built.canonicalAnswer,
    verifierAnswer: built.verifierAnswer,
    canonicalTrace: built.canonicalTrace,
    options,
    correctIndex,
    explanation,
    hiddenState: built.hiddenState,
    mathematicalFingerprint: `${prototypeId}|${built.fingerprintParts.join("|")}`,
    sourceAncestry: SOURCE_ANCESTRY,
    prototypeAncestry: Object.freeze([prototypeId, "SAP-CP-001-WAVE02"]),
    lifecycle: LIFECYCLE,
  } satisfies Omit<SapCp001Wave02Package, "validation">;
  const errors = validatePackage(withoutValidation);
  return Object.freeze({
    ...withoutValidation,
    validation: Object.freeze({ ok: errors.length === 0, errors }),
  });
}

export function generateSapCp001Wave02Sweep(
  seedsPerPrototype: number,
): readonly SapCp001Wave02Package[] {
  assertPositiveInteger(seedsPerPrototype, "SAP-CP-001 Wave 02 seeds per prototype");
  const packages: SapCp001Wave02Package[] = [];
  for (const prototypeId of SAP_CP001_WAVE02_PROTOTYPE_IDS) {
    for (let seed = 1; seed <= seedsPerPrototype; seed += 1) {
      packages.push(generateSapCp001Wave02Package(prototypeId, seed));
    }
  }
  return Object.freeze(packages);
}
