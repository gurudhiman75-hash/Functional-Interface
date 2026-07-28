import {
  getClsCp001PermanentContract,
  type ClsCp001QlId,
  type ClsCp001SolveContractId,
} from "./cp001-permanent-contracts";
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
    readonly solveContractId: ClsCp001SolveContractId;
  };
  readonly lifecycle: ClsCp001FrozenLifecycle;
};

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
  const maximumSeed = Math.floor((Number.MAX_SAFE_INTEGER - prototypeIndex) / prototypeCount);
  if (seed > maximumSeed) {
    throw new Error(`Seed ${seed} is too large for CLS-CP-001 permanent runtime expansion`);
  }
  return seed * prototypeCount + prototypeIndex;
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
  const sourcePrototypeSeed = sourceSeed(seed, prototypeIndex, contract.allowedPrototypeIds.length);
  const generated = generateClsCp001Prototype(sourcePrototypeId, sourcePrototypeSeed);

  if (generated.task !== contract.task) {
    throw new Error(`${qlId}/${seed} produced task '${generated.task}' instead of '${contract.task}'`);
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
      sourcePrototypeSeed,
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
