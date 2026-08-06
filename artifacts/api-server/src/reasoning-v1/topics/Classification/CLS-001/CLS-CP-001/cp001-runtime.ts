import {
  getClsCp001PermanentContract,
  type ClsCp001QlId,
  type ClsCp001SolveContractId,
} from "./cp001-permanent-contracts";
import { generateClsCp001CoherentGroupPrototype } from "./cp001-coherent-group-runtime";
import { polishClsCp001PlainLanguage } from "./cp001-plain-language";
import { simplifyClsCp001EnglishQuestion } from "./cp001-student-editorial";
import { generateClsCp001Prototype } from "./runtime";
import type {
  GeneratedClassificationQuestion,
  PrototypeId,
} from "./types";

type PrototypeMetadata = GeneratedClassificationQuestion["metadata"];

export type ClsCp001FrozenLifecycle = {
  readonly permanentQlId: ClsCp001QlId;
  readonly reviewStatus: "FROZEN_RUNTIME_PROOF";
  readonly questionBankStatus: "NOT_STORED";
  readonly testEligibility: "INELIGIBLE";
  readonly publiclyPublishable: false;
  readonly questionStudioDiscoverable: false;
};

export type GeneratedClsCp001EnglishQuestion = Omit<
  GeneratedClassificationQuestion,
  "prototypeId" | "seed" | "metadata" | "lifecycle"
> & {
  readonly qlId: ClsCp001QlId;
  readonly permanentQlId: ClsCp001QlId;
  readonly seed: number;
  readonly reviewOnly: true;
  readonly questionStudioVisible: false;
  readonly metadata: Omit<PrototypeMetadata, "locale"> & {
    readonly locale: "en-IN";
    readonly runtimeVersion: "cls-cp001-runtime-v1";
    readonly sourcePrototypeId: PrototypeId;
    readonly sourcePrototypeSeed: number;
    readonly sourceOptionCount: 4 | 5;
    readonly solveContractId: ClsCp001SolveContractId;
  };
  readonly lifecycle: ClsCp001FrozenLifecycle;
};

const SOURCE_SEED_STRIDE = 32;
const MAX_SAFE_SOURCE_ATTEMPTS = SOURCE_SEED_STRIDE;

const FACTUALLY_FLYING_LABELS = new Set([
  "Eagle",
  "Sparrow",
  "Parrot",
  "Pigeon",
  "Peacock",
  "Crow",
  "Owl",
  "Duck",
  "Hen",
  "Bat",
  "Butterfly",
  "Bee",
  "Dragonfly",
]);

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function selectPrototypeId(qlId: ClsCp001QlId, seed: number): PrototypeId {
  const contract = getClsCp001PermanentContract(qlId);
  const index = hashText(`${qlId}:${seed}`) % contract.allowedPrototypeIds.length;
  return contract.allowedPrototypeIds[index]!;
}

function sourceSeed(seed: number, prototypeIndex: number, prototypeCount: number): number {
  const maximumBaseSeed = Math.floor(
    (Number.MAX_SAFE_INTEGER - (SOURCE_SEED_STRIDE - 1)) / SOURCE_SEED_STRIDE,
  );
  const maximumSeed = Math.floor((maximumBaseSeed - prototypeIndex) / prototypeCount);
  if (seed > maximumSeed) {
    throw new Error(`Seed ${seed} is too large for CLS-CP-001 permanent runtime expansion`);
  }
  return (seed * prototypeCount + prototypeIndex) * SOURCE_SEED_STRIDE;
}

function optionCountForSeed(qlId: ClsCp001QlId, seed: number): 4 | 5 {
  return hashText(`${qlId}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

function generateSourceQuestion(
  sourcePrototypeId: PrototypeId,
  sourcePrototypeSeed: number,
  optionCount: 4 | 5,
): GeneratedClassificationQuestion {
  return sourcePrototypeId === "CLS-CP001-PROT-008"
    ? generateClsCp001CoherentGroupPrototype(sourcePrototypeSeed, optionCount)
    : generateClsCp001Prototype(sourcePrototypeId, sourcePrototypeSeed, optionCount);
}

function isFactuallyFlying(label: string): boolean {
  return FACTUALLY_FLYING_LABELS.has(label);
}

function hasHiddenFlyingConflict(question: GeneratedClassificationQuestion): boolean {
  if (question.task === "FIND_OUTLIER") {
    const flyingIndices = question.options
      .map((label, index) => isFactuallyFlying(label) ? index : -1)
      .filter((index) => index >= 0);

    if (question.intendedClassId === "CLS_FLYING_ANIMALS") {
      return flyingIndices.length !== question.options.length - 1
        || flyingIndices.includes(question.correctIndex);
    }

    if (flyingIndices.length === question.options.length - 1) {
      const hiddenOutlierIndex = question.options.findIndex((_, index) => !flyingIndices.includes(index));
      return hiddenOutlierIndex !== question.correctIndex;
    }
    return false;
  }

  if (question.task === "SELECT_CLASS_MEMBER") {
    const givensFormFlyingGroup = question.givens.every(isFactuallyFlying);
    if (question.intendedClassId !== "CLS_FLYING_ANIMALS" && !givensFormFlyingGroup) return false;

    const matchingIndices = question.options
      .map((label, index) => isFactuallyFlying(label) ? index : -1)
      .filter((index) => index >= 0);
    return matchingIndices.length !== 1 || matchingIndices[0] !== question.correctIndex;
  }

  const flyingGroupIndices = question.optionGroups
    .map((group, index) => group.every(isFactuallyFlying) ? index : -1)
    .filter((index) => index >= 0);

  if (question.intendedClassId === "CLS_FLYING_ANIMALS") {
    return flyingGroupIndices.length !== 1 || flyingGroupIndices[0] !== question.correctIndex;
  }

  return flyingGroupIndices.some((index) => index !== question.correctIndex);
}

function generateSafeSourceQuestion(
  sourcePrototypeId: PrototypeId,
  sourcePrototypeBaseSeed: number,
  optionCount: 4 | 5,
): {
  readonly question: GeneratedClassificationQuestion;
  readonly sourcePrototypeSeed: number;
} {
  for (let attempt = 0; attempt < MAX_SAFE_SOURCE_ATTEMPTS; attempt += 1) {
    const candidateSeed = sourcePrototypeBaseSeed + attempt;
    const question = generateSourceQuestion(sourcePrototypeId, candidateSeed, optionCount);
    if (!hasHiddenFlyingConflict(question)) {
      return { question, sourcePrototypeSeed: candidateSeed };
    }
  }
  throw new Error(
    `Unable to find a fact-safe ${sourcePrototypeId} state after ${MAX_SAFE_SOURCE_ATTEMPTS} attempts`,
  );
}

export function generateClsCp001EnglishQuestion(
  qlId: ClsCp001QlId,
  seed = 0,
): GeneratedClsCp001EnglishQuestion {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }

  const contract = getClsCp001PermanentContract(qlId);
  const sourcePrototypeId = selectPrototypeId(qlId, seed);
  const prototypeIndex = contract.allowedPrototypeIds.indexOf(sourcePrototypeId);
  const sourcePrototypeBaseSeed = sourceSeed(seed, prototypeIndex, contract.allowedPrototypeIds.length);
  const sourceOptionCount = optionCountForSeed(qlId, seed);
  const safeSource = generateSafeSourceQuestion(
    sourcePrototypeId,
    sourcePrototypeBaseSeed,
    sourceOptionCount,
  );
  const generated = polishClsCp001PlainLanguage(
    simplifyClsCp001EnglishQuestion(safeSource.question),
  );

  if (generated.task !== contract.task) {
    throw new Error(`${qlId}/${seed} produced task '${generated.task}' instead of '${contract.task}'`);
  }
  if (generated.options.length !== sourceOptionCount) {
    throw new Error(`${qlId}/${seed} produced ${generated.options.length} options instead of ${sourceOptionCount}`);
  }

  const {
    prototypeId: _prototypeId,
    seed: _prototypeSeed,
    metadata,
    lifecycle: _prototypeLifecycle,
    ...question
  } = generated;

  return {
    ...question,
    qlId,
    permanentQlId: qlId,
    seed,
    reviewOnly: true,
    questionStudioVisible: false,
    metadata: {
      ...metadata,
      locale: "en-IN",
      runtimeVersion: "cls-cp001-runtime-v1",
      sourcePrototypeId,
      sourcePrototypeSeed: safeSource.sourcePrototypeSeed,
      sourceOptionCount,
      solveContractId: contract.solveContractId,
    },
    lifecycle: {
      permanentQlId: qlId,
      reviewStatus: "FROZEN_RUNTIME_PROOF",
      questionBankStatus: "NOT_STORED",
      testEligibility: "INELIGIBLE",
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
    },
  };
}
