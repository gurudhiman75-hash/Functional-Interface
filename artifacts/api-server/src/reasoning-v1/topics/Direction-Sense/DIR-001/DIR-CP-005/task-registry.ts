import { assertMaterialQlNeed } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";

export type DirCp005AnswerDemand =
  | "ENDPOINT_RELATIVE_DIRECTION"
  | "ENDPOINT_SEPARATION_DISTANCE"
  | "ENDPOINT_DIRECTION_AND_DISTANCE"
  | "MOVER_AT_RELATION"
  | "ENDPOINT_EXTREMUM"
  | "NEAREST_OR_FARTHEST_FROM_REFERENCE"
  | "FINAL_COINCIDENCE_PAIR";

export interface DirCp005Ql extends DirectionQuestionLogicContract {
  readonly checkpointId: "DIR-CP-005";
  readonly answerDemand: DirCp005AnswerDemand;
}

function ql(qlId: string, ruleId: string, answerDemand: DirCp005AnswerDemand, answerType: string, evidence: Parameters<typeof assertMaterialQlNeed>[0]): DirCp005Ql {
  assertMaterialQlNeed(evidence);
  return {
    qlId,
    checkpointId: "DIR-CP-005",
    ruleId,
    answerDemand,
    solverCapabilities: ["SOLVE_MULTIPLE_INDEPENDENT_PATHS", "COMPARE_ENDPOINTS"],
    presentationMode: "MULTI_MOVER_TEXT_WITH_DIAGRAM",
    answerType,
    renderer: "DIRECTION_DIAGRAM",
    localeMode: "TRANSLATABLE",
    status: "DRAFT",
  };
}

export const DIR_CP005_QLS = [
  ql("DIR-QL-016", "DIR_MULTI_MOVER_RELATIVE_DIRECTION", "ENDPOINT_RELATIVE_DIRECTION", "DIRECTION", { hiddenStateTopology: "two independent paths", answerDemand: "direction between final endpoints" }),
  ql("DIR-QL-017", "DIR_MULTI_MOVER_SEPARATION", "ENDPOINT_SEPARATION_DISTANCE", "DISTANCE", { answerDemand: "shortest distance between final endpoints", misconceptionProfile: "path totals versus endpoint separation" }),
  ql("DIR-QL-018", "DIR_MULTI_MOVER_DIRECTION_DISTANCE", "ENDPOINT_DIRECTION_AND_DISTANCE", "DIRECTION_AND_DISTANCE", { answerDemand: "combined qualitative and numeric endpoint relation" }),
  ql("DIR-QL-019", "DIR_MULTI_MOVER_ENTITY_LOOKUP", "MOVER_AT_RELATION", "ENTITY", { answerDemand: "identify mover occupying a supplied endpoint relation" }),
  ql("DIR-QL-020", "DIR_MULTI_MOVER_ENDPOINT_EXTREMUM", "ENDPOINT_EXTREMUM", "ENTITY", { answerDemand: "identify northmost/southmost/eastmost/westmost endpoint", generatorContract: "four distinct endpoint projections" }),
  ql("DIR-QL-021", "DIR_MULTI_MOVER_REFERENCE_DISTANCE_RANK", "NEAREST_OR_FARTHEST_FROM_REFERENCE", "ENTITY", { answerDemand: "identify nearest or farthest endpoint from a reference point", independentSolverContract: "rank exact endpoint distances" }),
  ql("DIR-QL-022", "DIR_MULTI_MOVER_FINAL_COINCIDENCE", "FINAL_COINCIDENCE_PAIR", "ENTITY_PAIR", { hiddenStateTopology: "independent paths converge to one endpoint", rendererContract: "group coincident mover names" }),
] as const;

export function dirCp005Ql(qlId: string): DirCp005Ql {
  const found = DIR_CP005_QLS.find((candidate) => candidate.qlId === qlId);
  if (!found) throw new Error(`Unknown DIR-CP-005 QL: ${qlId}`);
  return found;
}
