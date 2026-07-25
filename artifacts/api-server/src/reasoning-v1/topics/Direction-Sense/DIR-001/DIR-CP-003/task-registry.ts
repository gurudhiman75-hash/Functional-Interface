import { assertMaterialQlNeed, type QlNeedEvidence } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";
import { DIR_CP003_RULES, type DirCp003RuleId } from "./rule-definitions";

export type DirCp003AnswerDemand =
  | "SHORTEST_DISTANCE"
  | "DIRECTION_AND_SHORTEST_DISTANCE"
  | "TOTAL_DISTANCE_AND_DISPLACEMENT"
  | "MISSING_MOVEMENT_DISTANCE"
  | "NON_INTEGER_SHORTEST_DISTANCE";

export interface DirCp003QuestionLogic extends DirectionQuestionLogicContract {
  readonly ruleId: DirCp003RuleId;
  readonly taskKind: "ORDERED_DISTANCE_PATH" | "INVERSE_DISTANCE_PATH";
  readonly answerDemand: DirCp003AnswerDemand;
  readonly needEvidence: QlNeedEvidence;
  readonly difficultyProfile: "VARIABLE_BY_INSTANCE" | "HARD_BY_CONTRACT";
}

export const DIR_CP003_QLS: readonly DirCp003QuestionLogic[] = [
  {
    qlId: "DIR-QL-006",
    checkpointId: "DIR-CP-003",
    ruleId: "DIR_SHORTEST_DISPLACEMENT",
    taskKind: "ORDERED_DISTANCE_PATH",
    answerDemand: "SHORTEST_DISTANCE",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "COMPUTE_NET_COMPONENTS", "COMPUTE_EXACT_DISPLACEMENT"],
    presentationMode: "NATURAL_ORDERED_PATH_DISTANCE_QUERY",
    answerType: "DISTANCE",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "DRAFT",
    needEvidence: {
      answerDemand: "The answer is the magnitude of the endpoint displacement rather than its compass class.",
      misconceptionProfile: "Distractors separate total path length, Manhattan distance, one-axis distance and squared distance.",
    },
  },
  {
    qlId: "DIR-QL-007",
    checkpointId: "DIR-CP-003",
    ruleId: "DIR_DIRECTION_AND_DISPLACEMENT",
    taskKind: "ORDERED_DISTANCE_PATH",
    answerDemand: "DIRECTION_AND_SHORTEST_DISTANCE",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "CLASSIFY_ENDPOINT_VECTOR", "COMPUTE_EXACT_DISPLACEMENT", "REVERSE_QUERY_REFERENCE"],
    presentationMode: "NATURAL_ORDERED_PATH_DIRECTION_DISTANCE_QUERY",
    answerType: "DIRECTION_DISTANCE_PAIR",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "DRAFT",
    needEvidence: {
      answerDemand: "The option must combine a qualitative direction with an independently computed numeric displacement.",
      generatorContract: "Options must isolate relation reversal from distance-computation errors.",
    },
  },
  {
    qlId: "DIR-QL-008",
    checkpointId: "DIR-CP-003",
    ruleId: "DIR_TRAVEL_DISTANCE_VS_DISPLACEMENT",
    taskKind: "ORDERED_DISTANCE_PATH",
    answerDemand: "TOTAL_DISTANCE_AND_DISPLACEMENT",
    solverCapabilities: ["SUM_PATH_LENGTH", "COMPUTE_NET_COMPONENTS", "COMPUTE_EXACT_DISPLACEMENT"],
    presentationMode: "NATURAL_ORDERED_PATH_TRAVEL_DISPLACEMENT_QUERY",
    answerType: "DISTANCE_PAIR",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "DRAFT",
    needEvidence: {
      answerDemand: "The learner must distinguish accumulated travel from straight-line displacement in one response.",
      misconceptionProfile: "Distractors swap the two quantities or replace displacement with an axis or Manhattan measure.",
    },
  },
  {
    qlId: "DIR-QL-009",
    checkpointId: "DIR-CP-003",
    ruleId: "DIR_MISSING_ORTHOGONAL_DISTANCE",
    taskKind: "INVERSE_DISTANCE_PATH",
    answerDemand: "MISSING_MOVEMENT_DISTANCE",
    solverCapabilities: ["REPLAY_PARTIAL_PATH", "SOLVE_SINGLE_UNKNOWN_ORTHOGONAL_DISTANCE", "VERIFY_TARGET_ENDPOINT"],
    presentationMode: "NATURAL_PATH_WITH_TARGET_ENDPOINT",
    answerType: "DISTANCE",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "DRAFT",
    needEvidence: {
      solveDirection: "The endpoint is supplied and one movement length must be reconstructed inversely.",
      inverseOrReconstructionBurden: "Exactly one positive distance must satisfy the target coordinate while all turns remain fixed.",
      independentSolverContract: "The solver derives the unknown from the target vector rather than replaying a fully known path.",
    },
  },
  {
    qlId: "DIR-QL-010",
    checkpointId: "DIR-CP-003",
    ruleId: "DIR_CONTROLLED_NON_INTEGER_DISPLACEMENT",
    taskKind: "ORDERED_DISTANCE_PATH",
    answerDemand: "NON_INTEGER_SHORTEST_DISTANCE",
    solverCapabilities: ["COMPUTE_NET_COMPONENTS", "SIMPLIFY_RADICAL_DISTANCE", "ROUND_AT_FINAL_DISPLAY"],
    presentationMode: "NATURAL_ORDERED_PATH_CONTROLLED_NUMERIC_DISPLAY",
    answerType: "EXACT_OR_ROUNDED_DISTANCE",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "HARD_BY_CONTRACT",
    status: "DRAFT",
    needEvidence: {
      generatorContract: "The generated endpoint must have a non-square integer squared distance and preserve the exact value internally.",
      rendererContract: "All options must share either simplified-radical formatting or one-decimal formatting, with rounding only at display time.",
      misconceptionProfile: "Distractors encode unsquared components, Manhattan distance and incorrect radical simplification.",
    },
  },
];

for (const ql of DIR_CP003_QLS) {
  assertMaterialQlNeed(ql.needEvidence);
  if (!DIR_CP003_RULES.some((rule) => rule.ruleId === ql.ruleId)) {
    throw new Error(`QL ${ql.qlId} references unregistered rule ${ql.ruleId}`);
  }
}

const expectedIds = ["DIR-QL-006", "DIR-QL-007", "DIR-QL-008", "DIR-QL-009", "DIR-QL-010"];
if (DIR_CP003_QLS.some((ql, index) => ql.qlId !== expectedIds[index])) {
  throw new Error("DIR-CP-003 QL IDs must remain continuous from DIR-QL-006 through DIR-QL-010");
}

export function dirCp003Ql(qlId: string): DirCp003QuestionLogic {
  const ql = DIR_CP003_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) throw new Error(`Unknown DIR-CP-003 QL: ${qlId}`);
  return ql;
}
