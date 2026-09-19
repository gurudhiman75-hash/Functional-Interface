import { assertMaterialQlNeed } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";

export type DirCp006AnswerDemand =
  | "CODED_RELATION_DIRECTION"
  | "CODED_ENTITY_LOOKUP"
  | "RECOVER_DIRECTION_CODE_MAP"
  | "EQUIVALENT_CODED_STATEMENT"
  | "VALID_CODED_CONCLUSION"
  | "MISSING_CODE_OPERATOR"
  | "CODED_MOVEMENT_ENDPOINT";

export interface DirCp006Ql extends DirectionQuestionLogicContract {
  readonly checkpointId: "DIR-CP-006";
  readonly answerDemand: DirCp006AnswerDemand;
}

function ql(
  qlId: string,
  ruleId: string,
  answerDemand: DirCp006AnswerDemand,
  answerType: string,
  evidence: Parameters<typeof assertMaterialQlNeed>[0],
): DirCp006Ql {
  assertMaterialQlNeed(evidence);
  return {
    qlId,
    checkpointId: "DIR-CP-006",
    ruleId,
    answerDemand,
    solverCapabilities: ["DECODE_DIRECTION_CODE_MAP", "SOLVE_CODED_RELATIONS"],
    presentationMode: "CODE_TABLE_AND_STATEMENT",
    answerType,
    renderer: "DIRECTION_DIAGRAM",
    localeMode: "TRANSLATABLE",
    status: "DRAFT",
  };
}

export const DIR_CP006_QLS = [
  ql("DIR-QL-023", "DIR_CODED_RELATION_DIRECTION", "CODED_RELATION_DIRECTION", "DIRECTION", {
    hiddenStateTopology: "one-to-one code map plus a coded relation chain",
    answerDemand: "derive the direction between coded-chain endpoints",
  }),
  ql("DIR-QL-024", "DIR_CODED_ENTITY_LOOKUP", "CODED_ENTITY_LOOKUP", "ENTITY", {
    answerDemand: "identify which named entity occupies a supplied decoded relation",
    rendererContract: "coded star graph with a highlighted reference",
  }),
  ql("DIR-QL-025", "DIR_CODED_MAP_RECOVERY", "RECOVER_DIRECTION_CODE_MAP", "CODE_SYMBOL", {
    inverseOrReconstructionBurden: "recover a unique one-to-one symbol map from combined coded evidence",
    independentSolverContract: "enumerate all cardinal-map permutations",
  }),
  ql("DIR-QL-026", "DIR_CODED_EQUIVALENT_STATEMENT", "EQUIVALENT_CODED_STATEMENT", "CODED_STATEMENT", {
    solveDirection: "encode a natural relation into the canonical subject-symbol-reference grammar",
    misconceptionProfile: "reversed entity order versus opposite symbol",
  }),
  ql("DIR-QL-027", "DIR_CODED_VALID_CONCLUSION", "VALID_CODED_CONCLUSION", "CONCLUSION", {
    answerDemand: "select the only valid natural-language conclusion after decoding a graph",
    generatorContract: "independently validate every statement-valued option",
  }),
  ql("DIR-QL-028", "DIR_CODED_MISSING_OPERATOR", "MISSING_CODE_OPERATOR", "CODE_SYMBOL", {
    inverseOrReconstructionBurden: "recover the unique missing operator that makes a target endpoint relation true",
    misconceptionProfile: "local edge meaning versus final-chain relation",
  }),
  ql("DIR-QL-029", "DIR_CODED_MOVEMENT_ENDPOINT", "CODED_MOVEMENT_ENDPOINT", "DIRECTION", {
    hiddenStateTopology: "coded absolute movement sequence rather than a static relation graph",
    independentSolverContract: "decode and replay ordered movement vectors",
  }),
] as const;

export function dirCp006Ql(qlId: string): DirCp006Ql {
  const found = DIR_CP006_QLS.find((candidate) => candidate.qlId === qlId);
  if (!found) throw new Error(`Unknown DIR-CP-006 QL: ${qlId}`);
  return found;
}
