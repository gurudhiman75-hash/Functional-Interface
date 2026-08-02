import { runTmwCp011Pipeline } from "./cp011-runtime";
import {
  localizeTmwCp011Question,
  type TmwCp011LocalizedQuestion,
} from "./localization-cp011";
import type { TmwLocalizedLanguage } from "./localization-types";

export function runTmwCp011LocalizedPipeline(input: {
  questionLanguageId: string;
  seed: string;
  language: TmwLocalizedLanguage;
}): TmwCp011LocalizedQuestion {
  const source = runTmwCp011Pipeline(input.questionLanguageId, input.seed);
  return localizeTmwCp011Question(source, input.language);
}
