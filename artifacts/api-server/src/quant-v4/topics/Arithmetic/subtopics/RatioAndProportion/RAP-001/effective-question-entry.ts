import { getQuestionEntry } from "./library";
import { getRap001LocalizedQuestionOverride } from "./localized-question-overrides";
import type { Rap001CanonicalProblemId, Rap001Language } from "./types";

export function getEffectiveRap001QuestionEntry(
  cpId: Rap001CanonicalProblemId,
  questionLanguageId: string,
  language: Rap001Language,
) {
  const entry = getQuestionEntry(cpId, questionLanguageId, language);
  const template = getRap001LocalizedQuestionOverride(language, questionLanguageId) ?? entry.template;
  return { ...entry, template };
}
