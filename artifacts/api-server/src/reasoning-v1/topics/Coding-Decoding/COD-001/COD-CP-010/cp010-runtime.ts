import { getCp010PermanentContract, type Cp010QlId } from "./cp010-permanent-contracts";
import { generateCp010PrototypeQuestion } from "./cp010-prototype-runtime";
import type { GeneratedCp010PrototypeQuestion } from "./cp010-prototype-types";

export type GeneratedCp010Question = Omit<
  GeneratedCp010PrototypeQuestion,
  "prototypeId" | "permanentQlId" | "prototypeOnly" | "metadata"
> & {
  qlId: Cp010QlId;
  permanentQlId: Cp010QlId;
  prototypeOnly: false;
  reviewOnly: true;
  questionStudioVisible: false;
  metadata: Omit<GeneratedCp010PrototypeQuestion["metadata"], "runtimeVersion"> & {
    runtimeVersion: "cod-cp010-runtime-v1";
    sourcePrototypeId: "COD-CP010-PROT-APPLY-CONDITIONAL-TABLE";
    solveContractId: "APPLY_CONDITIONAL_TABLE_FORWARD";
  };
};

export function generateCp010Question(qlId: Cp010QlId, seed = 0): GeneratedCp010Question {
  const contract = getCp010PermanentContract(qlId);
  const generated = generateCp010PrototypeQuestion(seed);
  const {
    prototypeId: sourcePrototypeId,
    permanentQlId: _prototypePermanentQlId,
    prototypeOnly: _prototypeOnly,
    metadata,
    ...question
  } = generated;

  if (sourcePrototypeId !== contract.sourcePrototypeId) {
    throw new Error(`${qlId}/${seed} generated unexpected prototype '${sourcePrototypeId}'`);
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
      runtimeVersion: "cod-cp010-runtime-v1",
      sourcePrototypeId,
      solveContractId: contract.solveContractId,
    },
  };
}
