import {
  getCp008PermanentContract,
  type Cp008QlId,
  type Cp008SolveContractId,
} from "./cp008-permanent-contracts";
import { generateCp008PrototypeQuestion } from "./cp008-prototype-runtime";
import type {
  Cp008PrototypeId,
  GeneratedCp008PrototypeQuestion,
} from "./cp008-prototype-types";

type PrototypeMetadata = GeneratedCp008PrototypeQuestion["metadata"];

export type GeneratedCp008Question = Omit<
  GeneratedCp008PrototypeQuestion,
  "prototypeId" | "permanentQlId" | "prototypeOnly" | "metadata"
> & {
  qlId: Cp008QlId;
  permanentQlId: Cp008QlId;
  prototypeOnly: false;
  reviewOnly: true;
  questionStudioVisible: false;
  metadata: Omit<PrototypeMetadata, "runtimeVersion"> & {
    runtimeVersion: "cod-cp008-runtime-v1";
    sourcePrototypeId: Cp008PrototypeId;
    solveContractId: Cp008SolveContractId;
  };
};

export function generateCp008Question(qlId: Cp008QlId, seed = 0): GeneratedCp008Question {
  const contract = getCp008PermanentContract(qlId);
  const generated = generateCp008PrototypeQuestion(contract.prototypeId, seed);
  const {
    prototypeId: _prototypeId,
    permanentQlId: _permanentQlId,
    prototypeOnly: _prototypeOnly,
    metadata,
    ...question
  } = generated;

  if (generated.ruleId !== contract.ruleId) {
    throw new Error(`${qlId}/${seed} generated rule '${generated.ruleId}' instead of '${contract.ruleId}'`);
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
      runtimeVersion: "cod-cp008-runtime-v1",
      sourcePrototypeId: contract.prototypeId,
      solveContractId: contract.solveContractId,
    },
  };
}
