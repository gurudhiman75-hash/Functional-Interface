import { generateCompleteCandidateSetPrototypeQuestion } from "./complete-candidate-set-generator";
import { generateExactSetMissingPrototypeQuestion } from "./exact-set-missing-generator";
import { generateExactAtomicPrototypeQuestion } from "./exact-atomic-generator";
import {
  getCp009PermanentContract,
  type Cp009PermanentContract,
  type Cp009QlId,
  type Cp009SolveContractId,
} from "./cp009-permanent-contracts";
import { generatePossibleImpossiblePrototypeQuestion } from "./possible-impossible-generator";
import { generatePossibleSetPrototypeQuestion } from "./possible-set-generator";
import { generateResolvedCompositionPrototypeQuestion } from "./resolved-composition-generator";

interface PrototypeQuestionLike {
  checkpointId: "COD-CP-009";
  prototypeId: string;
  permanentQlId: null;
  prototypeOnly: true;
  publiclyPublishable: false;
  seed: number;
  locale: "en-IN";
  topologyKind: string;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  structuredPrompt: unknown;
  options: readonly unknown[];
  correctIndex: number;
  explanation: unknown;
  metadata: Readonly<Record<string, unknown>>;
}

export type GeneratedCp009Question = Omit<
  PrototypeQuestionLike,
  "prototypeId" | "permanentQlId" | "prototypeOnly" | "metadata"
> & {
  qlId: Cp009QlId;
  permanentQlId: Cp009QlId;
  prototypeOnly: false;
  reviewOnly: true;
  questionStudioVisible: false;
  metadata: Readonly<Record<string, unknown>> & {
    runtimeVersion: "cod-cp009-runtime-v1";
    sourcePrototypeId: string;
    sourceTopologyKind: string;
    solveContractId: Cp009SolveContractId;
  };
};

function selectTopology(contract: Cp009PermanentContract, seed: number): string {
  const index = Math.abs(seed) % contract.topologyKinds.length;
  return contract.topologyKinds[index]!;
}

function generatePrototype(contract: Cp009PermanentContract, seed: number): PrototypeQuestionLike {
  const topologyKind = selectTopology(contract, seed);

  switch (contract.family) {
    case "EXACT_ATOMIC":
      return generateExactAtomicPrototypeQuestion(
        contract.prototypeId as never,
        seed,
        topologyKind as never,
      ) as PrototypeQuestionLike;

    case "EXACT_SET_OR_MISSING":
      return generateExactSetMissingPrototypeQuestion(
        contract.prototypeId as never,
        seed,
      ) as PrototypeQuestionLike;

    case "POSSIBLE_OR_IMPOSSIBLE_ATOMIC":
      return generatePossibleImpossiblePrototypeQuestion(
        contract.prototypeId as never,
        seed,
        topologyKind as never,
      ) as PrototypeQuestionLike;

    case "POSSIBLE_SET":
      return generatePossibleSetPrototypeQuestion(
        contract.prototypeId as never,
        seed,
        topologyKind as never,
      ) as PrototypeQuestionLike;

    case "RESOLVED_COMPOSITION":
      return generateResolvedCompositionPrototypeQuestion(
        contract.prototypeId as never,
        seed,
      ) as PrototypeQuestionLike;

    case "COMPLETE_CANDIDATE_SET":
      return generateCompleteCandidateSetPrototypeQuestion(
        contract.prototypeId as never,
        seed,
        topologyKind as never,
      ) as PrototypeQuestionLike;
  }
}

export function generateCp009Question(qlId: Cp009QlId, seed = 0): GeneratedCp009Question {
  const contract = getCp009PermanentContract(qlId);
  const generated = generatePrototype(contract, seed);
  const {
    prototypeId: sourcePrototypeId,
    permanentQlId: _prototypePermanentQlId,
    prototypeOnly: _prototypeOnly,
    metadata,
    ...question
  } = generated;

  if (!contract.topologyKinds.includes(generated.topologyKind)) {
    throw new Error(`${qlId}/${seed} generated unexpected topology '${generated.topologyKind}'`);
  }

  return {
    ...question,
    qlId,
    permanentQlId: qlId,
    prototypeOnly: false,
    reviewOnly: true,
    questionStudioVisible: false,
    metadata: {
      ...metadata,
      runtimeVersion: "cod-cp009-runtime-v1",
      sourcePrototypeId,
      sourceTopologyKind: generated.topologyKind,
      solveContractId: contract.solveContractId,
    },
  };
}
