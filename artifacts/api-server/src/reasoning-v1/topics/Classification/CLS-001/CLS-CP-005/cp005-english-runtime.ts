import {
  CLS_CP005_ENGLISH_CONTRACT_BY_QL,
  CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
  CLS_CP005_ODD_TUPLE_QL_ID,
  type ClsCp005EnglishQlId,
  type ClsCp005PermanentSourceDescriptor,
} from "./cp005-english-contracts";
import { generateClsCp005QualityQuestion } from "./quality-runtime";
import {
  auditClsCp005QuestionAgainstExpandedRegistry,
  CLS_CP005_EXPANDED_RULE_COUNT,
} from "./source-gap-expanded-audit";
import { generateClsCp005Wave2Question } from "./wave2-runtime";
import { generateClsCp005Wave2DigitProductQuestion } from "./wave2-digit-product-runtime";
import { generateClsCp005DigitProductEquivalentQuestion } from "./wave2-digit-product-equivalent-runtime";

const MAX_WAVE1_EXPANDED_ATTEMPTS = 96;

function hashText(text: string): number {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function optionCountForSeed(qlId: ClsCp005EnglishQlId, seed: number): 4 | 5 {
  return hashText(`${qlId}:option-count:${seed}`) % 4 === 0 ? 5 : 4;
}

function generateExpandedWave1Source(
  descriptor: Extract<ClsCp005PermanentSourceDescriptor, { sourceFamily: "WAVE_1" }>,
  sourceSeed: number,
  optionCount: 4 | 5,
) {
  for (let attempt = 0; attempt < MAX_WAVE1_EXPANDED_ATTEMPTS; attempt += 1) {
    const candidateSeed = sourceSeed + attempt * 100_003;
    const candidate = generateClsCp005QualityQuestion(
      descriptor.prototypeId,
      candidateSeed,
      optionCount,
    );
    const expandedAmbiguityAudit = auditClsCp005QuestionAgainstExpandedRegistry({
      task: candidate.task,
      referenceTuple: candidate.referenceTuple,
      tuples: candidate.tuples,
      intendedRuleId: candidate.intendedRuleId,
      intendedRuleValue: candidate.intendedRuleValue,
    });
    if (
      expandedAmbiguityAudit.result === "EXPANDED_UNIQUE"
      && expandedAmbiguityAudit.answerIndex === candidate.correctIndex
    ) {
      return {
        ...candidate,
        expandedAmbiguityAudit,
        metadata: {
          ...candidate.metadata,
          expandedRegistryAttempt: attempt,
          completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
        },
      };
    }
  }
  throw new Error(
    `${descriptor.prototypeId}/${sourceSeed} did not produce a 35-rule-safe permanent state`,
  );
}

function generateSourceQuestion(
  descriptor: ClsCp005PermanentSourceDescriptor,
  sourceSeed: number,
  optionCount: 4 | 5,
) {
  switch (descriptor.sourceFamily) {
    case "WAVE_1":
      return generateExpandedWave1Source(descriptor, sourceSeed, optionCount);
    case "SOURCE_GAP_WAVE_2":
      return generateClsCp005Wave2Question(descriptor.prototypeId, sourceSeed, optionCount);
    case "DIGIT_PRODUCT_ODD":
      return generateClsCp005Wave2DigitProductQuestion(sourceSeed, optionCount);
    case "DIGIT_PRODUCT_EQUIVALENT":
      return generateClsCp005DigitProductEquivalentQuestion(sourceSeed, optionCount);
    default: {
      const exhaustive: never = descriptor;
      throw new Error(`Unsupported CP005 permanent source: ${JSON.stringify(exhaustive)}`);
    }
  }
}

export function generateClsCp005EnglishQuestion(
  qlId: ClsCp005EnglishQlId,
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  if (!Number.isSafeInteger(seed) || seed < 0) {
    throw new Error(`Seed must be a non-negative safe integer: ${seed}`);
  }
  const contract = CLS_CP005_ENGLISH_CONTRACT_BY_QL.get(qlId);
  if (!contract) throw new Error(`Unknown CLS-CP-005 English QL: ${qlId}`);

  const sourceIndex = seed % contract.allowedSources.length;
  const descriptor = contract.allowedSources[sourceIndex]!;
  const sourceSeed = Math.floor(seed / contract.allowedSources.length);
  const optionCount = requestedOptionCount ?? optionCountForSeed(qlId, seed);
  const source = generateSourceQuestion(descriptor, sourceSeed, optionCount);
  const expandedAmbiguityAudit = source.expandedAmbiguityAudit;

  if (
    expandedAmbiguityAudit.result !== "EXPANDED_UNIQUE"
    || expandedAmbiguityAudit.answerIndex !== source.correctIndex
  ) {
    throw new Error(
      `${descriptor.prototypeId}/${sourceSeed} failed the permanent expanded ambiguity gate`,
    );
  }

  const sourceTask = source.task;
  const sourceRuntimeVersion = source.metadata.runtimeVersion;
  const difficulty = "difficulty" in source ? source.difficulty : "MEDIUM" as const;

  return {
    ...source,
    seed,
    qlId,
    permanentQlId: qlId,
    task: contract.task,
    difficulty,
    expandedAmbiguityAudit,
    reviewOnly: true as const,
    questionStudioVisible: false as const,
    metadata: {
      ...source.metadata,
      runtimeVersion: "cls-cp005-english-runtime-v1" as const,
      sourceRuntimeVersion,
      sourceFamily: descriptor.sourceFamily,
      sourcePrototypeId: descriptor.prototypeId,
      sourcePrototypeSeed: sourceSeed,
      sourceTask,
      solveContractId: contract.solveContractId,
      completeRuleCount: CLS_CP005_EXPANDED_RULE_COUNT,
      sourceSaturationStatus: "ENGLISH_SOURCE_SATURATED__NO_MEANINGFUL_GAP" as const,
      permanentBoundaryStatus: "TWO_CONTRACTS_FROZEN" as const,
      digitProductEquivalentAdmission: "ADMITTED_TO_REFERENCE_SET_CONTRACT" as const,
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

export function generateClsCp005OddTupleQuestion(
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp005EnglishQuestion(
    CLS_CP005_ODD_TUPLE_QL_ID,
    seed,
    requestedOptionCount,
  );
}

export function generateClsCp005EquivalentTupleQuestion(
  seed = 0,
  requestedOptionCount?: 4 | 5,
) {
  return generateClsCp005EnglishQuestion(
    CLS_CP005_EQUIVALENT_TUPLE_QL_ID,
    seed,
    requestedOptionCount,
  );
}

export type GeneratedClsCp005EnglishQuestion = ReturnType<
  typeof generateClsCp005EnglishQuestion
>;
