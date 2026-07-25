import { COD_CP001_QUESTION_LOGICS } from "./question-language.en";

export const COD_CP001_TASK_REGISTRY = Object.freeze(Object.fromEntries(
  COD_CP001_QUESTION_LOGICS.map((logic) => [logic.qlId, logic]),
));

export function getCodCp001ActiveQuestionLogicIds(): string[] {
  return Object.keys(COD_CP001_TASK_REGISTRY).sort();
}
