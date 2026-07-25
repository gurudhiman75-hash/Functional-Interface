import { COD_CP003_QUESTION_LOGICS } from "./question-language.en";

export const COD_CP003_TASK_REGISTRY = Object.freeze(Object.fromEntries(
  COD_CP003_QUESTION_LOGICS.map((logic) => [logic.qlId, logic]),
));

export function getCodCp003ActiveQuestionLogicIds(): string[] {
  return Object.keys(COD_CP003_TASK_REGISTRY).sort();
}
