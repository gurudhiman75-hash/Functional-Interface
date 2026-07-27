import type {
  UniformDigitPrototypeContract,
  UniformDigitPrototypeId,
} from "./uniform-digit-types";

export const UNIFORM_DIGIT_PROTOTYPE_CONTRACTS: readonly UniformDigitPrototypeContract[] = [
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-ENCODE",
    taskKind: "ENCODE_TARGET",
    queryDirection: "FORWARD",
    answerType: "DIGIT_SEQUENCE",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-DECODE",
    taskKind: "DECODE_TARGET",
    queryDirection: "INVERSE",
    answerType: "DIGIT_SEQUENCE",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-MISSING",
    taskKind: "RECOVER_MISSING_TOKEN",
    queryDirection: "FORWARD",
    answerType: "SINGLE_CODE_TOKEN",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE",
    taskKind: "INFER_AND_ENCODE",
    queryDirection: "FORWARD",
    answerType: "DIGIT_SEQUENCE",
    status: "PROTOTYPE",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING",
    taskKind: "CHOOSE_MATCHING_CODE",
    queryDirection: "FORWARD",
    answerType: "DIGIT_SEQUENCE",
    status: "PROTOTYPE",
  },
] as const;

export function getUniformDigitPrototypeContract(
  prototypeId: UniformDigitPrototypeId,
): UniformDigitPrototypeContract {
  const found = UNIFORM_DIGIT_PROTOTYPE_CONTRACTS.find((contract) => contract.prototypeId === prototypeId);
  if (!found) throw new Error(`Unknown CP-007 uniform digit prototype '${prototypeId}'`);
  return found;
}
