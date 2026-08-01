import { runTmwCp009Pipeline } from "./cp009-runtime";
import {
  localizeTmwCp009Question,
  type TmwCp009LocalizedQuestion,
} from "./localization-cp009";
import type { TmwLocalizedLanguage } from "./localization-types";

export function runTmwCp009LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp009LocalizedQuestion {
  const source = runTmwCp009Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
  });
  return localizeTmwCp009Question(source, input.language);
}
