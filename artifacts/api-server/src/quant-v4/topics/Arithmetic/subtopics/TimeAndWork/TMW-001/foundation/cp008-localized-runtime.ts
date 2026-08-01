import { runTmwCp008Pipeline } from "./cp008-runtime";
import {
  localizeTmwCp008Question,
  type TmwCp008LocalizedQuestion,
} from "./localization-cp008";
import type { TmwLocalizedLanguage } from "./localization-types";

export function runTmwCp008LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp008LocalizedQuestion {
  const source = runTmwCp008Pipeline({
    questionLanguageId: input.questionLanguageId,
    seed: input.seed,
  });
  return localizeTmwCp008Question(source, input.language);
}
