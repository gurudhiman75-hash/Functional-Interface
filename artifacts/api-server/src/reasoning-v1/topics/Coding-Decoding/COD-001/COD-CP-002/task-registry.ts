import { COD_CP002_QUESTION_LOGICS } from "./question-language.en";

export const COD_CP002_TASK_REGISTRY = Object.freeze(Object.fromEntries(
  COD_CP002_QUESTION_LOGICS.map((logic) => [logic.qlId, logic]),
));

export function getCodCp002ActiveQuestionLogicIds(): string[] {
  return Object.keys(COD_CP002_TASK_REGISTRY).sort();
}
