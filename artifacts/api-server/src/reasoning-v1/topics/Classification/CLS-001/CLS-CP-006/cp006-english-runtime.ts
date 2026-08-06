import {
  CLS_CP006_ENGLISH_CONTRACT_BY_QL,
  CLS_CP006_ODD_LETTER_PAIR_QL_ID,
  CLS_CP006_ODD_LETTER_QL_ID,
  type ClsCp006EnglishQlId,
} from "./cp006-english-contracts";
import { independentlyVerifyClsCp006Question } from "./audit";
import {
  auditClsCp006PresentationQuality,
  generateClsCp006QualityQuestion,
} from "./quality-runtime";

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionCountForSeed(qlId: ClsCp006EnglishQlId, seed: number): 4 | 5 {
  return hashText(`${qlId}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

export function generateClsCp006EnglishQuestion(
  qlId: ClsCp006EnglishQlId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const contract = CLS_CP006_ENGLISH_CONTRACT_BY_QL.get(qlId);
  if (!contract) throw new Error(`Unknown CLS-CP-006 English QL: ${qlId}`);

  const sourceIndex = seed % contract.allowedSources.length;
  const descriptor = contract.allowedSources[sourceIndex]!;
  const sourceSeed = Math.floor(seed / contract.allowedSources.length);
  const optionCount = requestedOptionCount ?? optionCountForSeed(qlId, seed);
  const source = generateClsCp006QualityQuestion(
    descriptor.prototypeId,
    sourceSeed,
    optionCount,
  );
  const independentAudit = independentlyVerifyClsCp006Question(source);
  const presentationAudit = auditClsCp006PresentationQuality(source);

  if (
    independentAudit.result !== "UNIQUE"
    || independentAudit.answerIndex !== source.correctIndex
    || !independentAudit.intendedRuleSupported
  ) {
    throw new Error(
      `${descriptor.prototypeId}/${sourceSeed} failed the permanent complete-registry ambiguity gate`,
    );
  }
  if (presentationAudit.result !== "PASS") {
    throw new Error(
      `${descriptor.prototypeId}/${sourceSeed} failed the permanent presentation gate: ${presentationAudit.reasons.join("; ")}`,
    );
  }
  if (
    source.task !== contract.task
    || source.optionKind !== contract.optionKind
    || source.intendedRuleId !== descriptor.ruleId
  ) {
    throw new Error(
      `${descriptor.prototypeId}/${sourceSeed} crossed its frozen solve-contract boundary`,
    );
  }

  const sourceRuntimeVersion = source.metadata.runtimeVersion;
  return {
    ...source,
    seed,
    qlId,
    permanentQlId: qlId,
    task: contract.task,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      ...source.metadata,
      runtimeVersion: "cls-cp006-english-runtime-v1" as const,
      sourceRuntimeVersion,
      sourcePrototypeId: descriptor.prototypeId,
      sourcePrototypeSeed: sourceSeed,
      sourceTask: source.task,
      solveContractId: contract.solveContractId,
      completeRuleCount: 8 as const,
      sourceSaturationStatus: "ENGLISH_SOURCE_SATURATED__NO_MEANINGFUL_GAP" as const,
      permanentBoundaryStatus: "TWO_CONTRACTS_FROZEN" as const,
      rejectedAmbiguousSourceStates: 1 as const,
      controlledSourceRemediations: 1 as const,
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

export function generateClsCp006OddLetterQuestion(
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp006EnglishQuestion(
    CLS_CP006_ODD_LETTER_QL_ID,
    seed,
    requestedOptionCount,
  );
}

export function generateClsCp006OddLetterPairQuestion(
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp006EnglishQuestion(
    CLS_CP006_ODD_LETTER_PAIR_QL_ID,
    seed,
    requestedOptionCount,
  );
}

export type GeneratedClsCp006EnglishQuestion = ReturnType<
  typeof generateClsCp006EnglishQuestion
>;
