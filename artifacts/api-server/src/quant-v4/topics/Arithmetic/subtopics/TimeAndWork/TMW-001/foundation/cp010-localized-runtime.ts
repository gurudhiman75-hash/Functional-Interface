import { runTmwCp010Pipeline } from "./cp010-runtime";
import {
  localizeTmwCp010Question,
  type TmwCp010LocalizedQuestion,
} from "./localization-cp010";
import type { TmwLocalizedLanguage } from "./localization-types";

export function runTmwCp010LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp010LocalizedQuestion {
  const source = runTmwCp010Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
  });
  return localizeTmwCp010Question(source, input.language);
}
