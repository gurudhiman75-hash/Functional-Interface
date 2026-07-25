import { COD_CP004_QUESTION_LOGICS } from "./question-language.en";

export const COD_CP004_TASK_REGISTRY = Object.freeze(Object.fromEntries(
  COD_CP004_QUESTION_LOGICS.map((logic) => [logic.qlId, logic]),
));

export function getCodCp004ActiveQuestionLogicIds(): string[] {
  return Object.keys(COD_CP004_TASK_REGISTRY).sort();
}
