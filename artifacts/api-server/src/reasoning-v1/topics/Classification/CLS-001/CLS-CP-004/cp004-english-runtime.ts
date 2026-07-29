import {
  CLS_CP004_ENGLISH_CONTRACT,
  CLS_CP004_ENGLISH_QL_ID,
  type ClsCp004EnglishQlId,
} from "./cp004-english-contract";
import { generateClsCp004DiscoveryQuestion } from "./discovery-runtime";

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionCountForSeed(seed: number): 4 | 5 {
  return hashText(`${CLS_CP004_ENGLISH_QL_ID}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

export function generateClsCp004EnglishQuestion(
  qlId: ClsCp004EnglishQlId = CLS_CP004_ENGLISH_QL_ID,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (qlId !== CLS_CP004_ENGLISH_QL_ID) throw new Error(`Unknown CLS-CP-004 English QL: ${qlId}`);
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const prototypeIndex = hashText(`${qlId}:prototype:${seed}`) % CLS_CP004_ENGLISH_CONTRACT.allowedPrototypeIds.length;
  const sourcePrototypeId = CLS_CP004_ENGLISH_CONTRACT.allowedPrototypeIds[prototypeIndex]!;
  const optionCount = requestedOptionCount ?? optionCountForSeed(seed);
  const source = generateClsCp004DiscoveryQuestion(sourcePrototypeId, seed, optionCount);
  return {
    ...source,
    qlId,
    permanentQlId: qlId,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      ...source.metadata,
      runtimeVersion: "cls-cp004-english-runtime-v1" as const,
      sourcePrototypeId,
      solveContractId: CLS_CP004_ENGLISH_CONTRACT.solveContractId,
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

export type GeneratedClsCp004EnglishQuestion = ReturnType<typeof generateClsCp004EnglishQuestion>;
