import type {
  UniformDigitPrototypeId,
  UniformDigitTaskKind,
} from "./uniform-digit-types";

export type UniformDigitProvisionalSolveContract =
  | "FORWARD_UNIFORM_DIGIT_TRANSLATION"
  | "INVERSE_UNIFORM_DIGIT_TRANSLATION"
  | "MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION";

export interface UniformDigitTaskDisposition {
  prototypeId: UniformDigitPrototypeId;
  taskKind: UniformDigitTaskKind;
  provisionalSolveContract: UniformDigitProvisionalSolveContract;
  disposition: "RETAIN" | "MERGE_AS_PRESENTATION";
  reason: string;
}

export const UNIFORM_DIGIT_TASK_DISPOSITIONS: readonly UniformDigitTaskDisposition[] = [
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-ENCODE",
    taskKind: "ENCODE_TARGET",
    provisionalSolveContract: "FORWARD_UNIFORM_DIGIT_TRANSLATION",
    disposition: "MERGE_AS_PRESENTATION",
    reason: "The shift is disclosed, but the answer predicate and forward token operation are the same as infer-and-encode.",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-INFER-ENCODE",
    taskKind: "INFER_AND_ENCODE",
    provisionalSolveContract: "FORWARD_UNIFORM_DIGIT_TRANSLATION",
    disposition: "RETAIN",
    reason: "This is the canonical source-backed forward contract: infer the unique shift and apply it to the target.",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-CHOOSE-MATCHING",
    taskKind: "CHOOSE_MATCHING_CODE",
    provisionalSolveContract: "FORWARD_UNIFORM_DIGIT_TRANSLATION",
    disposition: "MERGE_AS_PRESENTATION",
    reason: "All generated questions are multiple choice; selecting the matching code does not change the forward correctness predicate.",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-DECODE",
    taskKind: "DECODE_TARGET",
    provisionalSolveContract: "INVERSE_UNIFORM_DIGIT_TRANSLATION",
    disposition: "RETAIN",
    reason: "The student must apply the inverse decimal movement and answer in the source domain.",
  },
  {
    prototypeId: "COD-CP007-PROT-UNIFORM-DIGIT-MISSING",
    taskKind: "RECOVER_MISSING_TOKEN",
    provisionalSolveContract: "MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION",
    disposition: "RETAIN",
    reason: "The answer is one omitted token and the explanation must reconstruct the complete target before selecting one position.",
  },
] as const;

export const UNIFORM_DIGIT_PROVISIONAL_SOLVE_CONTRACTS = [
  "FORWARD_UNIFORM_DIGIT_TRANSLATION",
  "INVERSE_UNIFORM_DIGIT_TRANSLATION",
  "MISSING_MEMBER_UNIFORM_DIGIT_TRANSLATION",
] as const satisfies readonly UniformDigitProvisionalSolveContract[];

export function provisionalSolveContractFor(
  prototypeId: UniformDigitPrototypeId,
): UniformDigitProvisionalSolveContract {
  const found = UNIFORM_DIGIT_TASK_DISPOSITIONS.find((entry) => entry.prototypeId === prototypeId);
  if (!found) throw new Error(`No merge/split disposition for '${prototypeId}'`);
  return found.provisionalSolveContract;
}
