import { assertMaterialQlNeed, type QlNeedEvidence } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";
import { DIR_CP002_RULES, type DirCp002RuleId } from "./rule-definitions";

export interface DirCp002QuestionLogic extends DirectionQuestionLogicContract {
  readonly ruleId: DirCp002RuleId;
  readonly taskKind: "ORDERED_PATH";
  readonly answerDemand: "ENDPOINT_DIRECTION" | "ENDPOINT_DIRECTION_AND_FINAL_FACING";
  readonly needEvidence: QlNeedEvidence;
  readonly difficultyProfile: "VARIABLE_BY_INSTANCE";
}

export const DIR_CP002_QLS: readonly DirCp002QuestionLogic[] = [
  {
    qlId: "DIR-QL-004",
    checkpointId: "DIR-CP-002",
    ruleId: "DIR_PATH_ENDPOINT_DIRECTION",
    taskKind: "ORDERED_PATH",
    answerDemand: "ENDPOINT_DIRECTION",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "CLASSIFY_ENDPOINT_VECTOR", "REVERSE_QUERY_REFERENCE"],
    presentationMode: "NATURAL_ORDERED_PATH",
    answerType: "DIRECTION",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "IMPLEMENTED",
    needEvidence: {
      hiddenStateTopology: "The hidden state contains both an ordered movement path and a changing compass orientation.",
      answerDemand: "The final coordinate must be classified relative to a stated reference point.",
      independentSolverContract: "The solver replays path operations independently and derives the endpoint vector.",
    },
  },
  {
    qlId: "DIR-QL-005",
    checkpointId: "DIR-CP-002",
    ruleId: "DIR_PATH_ENDPOINT_AND_FACING",
    taskKind: "ORDERED_PATH",
    answerDemand: "ENDPOINT_DIRECTION_AND_FINAL_FACING",
    solverCapabilities: ["EVALUATE_ORDERED_PATH", "CLASSIFY_ENDPOINT_VECTOR", "TRACK_FINAL_FACING"],
    presentationMode: "NATURAL_ORDERED_PATH_COMBINED_QUERY",
    answerType: "DIRECTION_PAIR",
    renderer: "STRUCTURED_TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "IMPLEMENTED",
    needEvidence: {
      answerDemand: "The response combines two independently derived spatial facts: endpoint relation and final facing.",
      generatorContract: "Options must pair endpoint direction with facing direction without leaking either component.",
      misconceptionProfile: "Distractors isolate endpoint-reversal, facing-reversal and combined-state errors.",
    },
  },
];

for (const ql of DIR_CP002_QLS) {
  assertMaterialQlNeed(ql.needEvidence);
  if (!DIR_CP002_RULES.some((rule) => rule.ruleId === ql.ruleId)) {
    throw new Error(`QL ${ql.qlId} references unregistered rule ${ql.ruleId}`);
  }
}

const expectedIds = ["DIR-QL-004", "DIR-QL-005"];
if (DIR_CP002_QLS.some((ql, index) => ql.qlId !== expectedIds[index])) {
  throw new Error("DIR-CP-002 QL IDs must remain DIR-QL-004 and DIR-QL-005");
}

export function dirCp002Ql(qlId: string): DirCp002QuestionLogic {
  const ql = DIR_CP002_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) throw new Error(`Unknown DIR-CP-002 QL: ${qlId}`);
  return ql;
}
