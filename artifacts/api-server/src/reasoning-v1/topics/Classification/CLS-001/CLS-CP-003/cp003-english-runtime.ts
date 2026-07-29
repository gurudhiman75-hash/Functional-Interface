import {
  getClsCp003EnglishContract,
  type ClsCp003EnglishQlId,
} from "./cp003-english-contracts";
import { generateClsCp003DiscoveryQuestion } from "./discovery-runtime";

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionCountForSeed(qlId: ClsCp003EnglishQlId, seed: number): 4 | 5 {
  return hashText(`${qlId}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

export function generateClsCp003EnglishQuestion(
  qlId: ClsCp003EnglishQlId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const contract = getClsCp003EnglishContract(qlId);
  const prototypeIndex = hashText(`${qlId}:prototype:${seed}`) % contract.allowedPrototypeIds.length;
  const sourcePrototypeId = contract.allowedPrototypeIds[prototypeIndex]!;
  const optionCount = requestedOptionCount ?? optionCountForSeed(qlId, seed);
  const source = generateClsCp003DiscoveryQuestion(sourcePrototypeId, seed, optionCount);
  if (source.task !== contract.task) {
    throw new Error(`${qlId}/${seed} generated task ${source.task}, expected ${contract.task}`);
  }
  return {
    ...source,
    qlId,
    permanentQlId: qlId,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      ...source.metadata,
      runtimeVersion: "cls-cp003-english-runtime-v1" as const,
      sourcePrototypeId,
      solveContractId: contract.solveContractId,
      sourceSaturationStatus: "ENGLISH_SOURCE_SATURATED" as const,
    },
    lifecycle: {
      permanentQlId: qlId,
      reviewStatus: "FROZEN_ENGLISH_RUNTIME_PROOF" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      publiclyPublishable: false as const,
      questionStudioDiscoverable: false as const,
    },
  };
}

export type GeneratedClsCp003EnglishQuestion = ReturnType<typeof generateClsCp003EnglishQuestion>;
