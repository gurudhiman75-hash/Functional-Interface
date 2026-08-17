import { runTmwCp007Pipeline } from "./cp007-runtime";
import { localizeTmwCp007Question, type TmwCp007LocalizedQuestion } from "./localization-cp007";
import type { TmwLocalizedLanguage } from "./localization-types";

export function runTmwCp007LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp007LocalizedQuestion {
  const source = runTmwCp007Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
  });
  return localizeTmwCp007Question(source, input.language);
}
