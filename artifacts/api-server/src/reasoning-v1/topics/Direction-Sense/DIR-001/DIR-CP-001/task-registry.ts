import { assertContinuousDirectionQlIds, assertMaterialQlNeed, type QlNeedEvidence } from "../DIR-001-CHAPTER-MANIFEST";
import type { DirectionQuestionLogicContract } from "../foundation/types";
import { DIR_CP001_RULES, type DirCp001RuleId } from "./rule-definitions";

export interface DirCp001QuestionLogic extends DirectionQuestionLogicContract {
  readonly ruleId: DirCp001RuleId;
  readonly taskKind: "ORIENTATION";
  readonly answerDemand: "FINAL_FACING" | "INITIAL_FACING" | "MISSING_TURN";
  readonly needEvidence: QlNeedEvidence;
  readonly difficultyProfile: "VARIABLE_BY_INSTANCE";
}

export const DIR_CP001_QLS: readonly DirCp001QuestionLogic[] = [
  {
    qlId: "DIR-QL-001",
    checkpointId: "DIR-CP-001",
    ruleId: "DIR_ORIENTATION_SEQUENCE_FORWARD",
    taskKind: "ORIENTATION",
    answerDemand: "FINAL_FACING",
    solverCapabilities: ["COMPOSE_ROTATIONS"],
    presentationMode: "NATURAL_TURN_SEQUENCE",
    answerType: "DIRECTION",
    renderer: "TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "IMPLEMENTED",
    needEvidence: {
      answerDemand: "Forward evaluation asks for the final facing after an ordered rotation sequence.",
      generatorContract: "Constructs one or more explicit relative or degree-based turns from a known initial facing.",
    },
  },
  {
    qlId: "DIR-QL-002",
    checkpointId: "DIR-CP-001",
    ruleId: "DIR_ORIENTATION_SEQUENCE_INVERSE",
    taskKind: "ORIENTATION",
    answerDemand: "INITIAL_FACING",
    solverCapabilities: ["COMPOSE_ROTATIONS", "INVERT_ROTATION_SEQUENCE"],
    presentationMode: "NATURAL_TURN_SEQUENCE",
    answerType: "DIRECTION",
    renderer: "TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "IMPLEMENTED",
    needEvidence: {
      solveDirection: "The known final facing must be inverted through the complete turn sequence.",
      independentSolverContract: "Uses reverse composition rather than forward answer evaluation.",
    },
  },
  {
    qlId: "DIR-QL-003",
    checkpointId: "DIR-CP-001",
    ruleId: "DIR_RELATIVE_TURN_RECONSTRUCTION",
    taskKind: "ORIENTATION",
    answerDemand: "MISSING_TURN",
    solverCapabilities: ["TEST_CANDIDATE_ROTATIONS", "PROVE_UNIQUE_ROTATION"],
    presentationMode: "MISSING_RELATIVE_TURN",
    answerType: "TURN",
    renderer: "TEXT",
    localeMode: "TRANSLATABLE",
    difficultyProfile: "VARIABLE_BY_INSTANCE",
    status: "IMPLEMENTED",
    needEvidence: {
      answerDemand: "The answer is a turn operation rather than a compass direction.",
      inverseOrReconstructionBurden: "The missing operation is recovered by testing the governed relative-turn candidate set.",
      misconceptionProfile: "Distractors are left/right reversal, about-turn confusion and no-turn assumption.",
    },
  },
];

for (const ql of DIR_CP001_QLS) {
  assertMaterialQlNeed(ql.needEvidence);
  if (!DIR_CP001_RULES.some((rule) => rule.ruleId === ql.ruleId)) {
    throw new Error(`QL ${ql.qlId} references unregistered rule ${ql.ruleId}`);
  }
}
assertContinuousDirectionQlIds(DIR_CP001_QLS);

export function dirCp001Ql(qlId: string): DirCp001QuestionLogic {
  const ql = DIR_CP001_QLS.find((candidate) => candidate.qlId === qlId);
  if (!ql) {
    throw new Error(`Unknown DIR-CP-001 QL: ${qlId}`);
  }
  return ql;
}
