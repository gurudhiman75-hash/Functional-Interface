import {
  getCp007PermanentContract,
  type Cp007QlId,
  type Cp007SolveContractId,
} from "./cp007-permanent-contracts";
import { generateUniformDigitPrototypeQuestion } from "./uniform-digit-generator";
import type {
  GeneratedUniformDigitPrototypeQuestion,
  UniformDigitPrototypeId,
} from "./uniform-digit-types";

type PrototypeMetadata = GeneratedUniformDigitPrototypeQuestion["metadata"];

export type GeneratedCp007Question = Omit<
  GeneratedUniformDigitPrototypeQuestion,
  "prototypeId" | "permanentQlId" | "prototypeOnly" | "metadata"
> & {
  qlId: Cp007QlId;
  permanentQlId: Cp007QlId;
  prototypeOnly: false;
  reviewOnly: true;
  questionStudioVisible: false;
  metadata: Omit<PrototypeMetadata, "runtimeVersion"> & {
    runtimeVersion: "cod-cp007-runtime-v1";
    sourcePrototypeId: UniformDigitPrototypeId;
    solveContractId: Cp007SolveContractId;
  };
};

function selectPrototypeId(qlId: Cp007QlId, seed: number): UniformDigitPrototypeId {
  const contract = getCp007PermanentContract(qlId);
  const index = Math.abs(seed) % contract.prototypeIds.length;
  return contract.prototypeIds[index]!;
}

export function generateCp007Question(qlId: Cp007QlId, seed = 0): GeneratedCp007Question {
  const contract = getCp007PermanentContract(qlId);
  const sourcePrototypeId = selectPrototypeId(qlId, seed);
  const generated = generateUniformDigitPrototypeQuestion(sourcePrototypeId, seed);
  const {
    prototypeId: _prototypeId,
    permanentQlId: _permanentQlId,
    prototypeOnly: _prototypeOnly,
    metadata,
    ...question
  } = generated;

  return {
    ...question,
    qlId,
    permanentQlId: qlId,
    prototypeOnly: false,
    reviewOnly: true,
    questionStudioVisible: false,
    metadata: {
      ...metadata,
      runtimeVersion: "cod-cp007-runtime-v1",
      sourcePrototypeId,
      solveContractId: contract.solveContractId,
    },
  };
}
