import {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
  runAvg001Cp001LocalizationPilot as runBasePilot,
} from "./cp001-localization-pilot-runtime";
import { applyAvg001LocalizedStemQuality } from "./localized-stem-quality";
import type { Avg001QuestionPackage } from "./types";

export { AVG_001_CP001_MULTILINGUAL_PILOT, getAvg001Cp001LocalizedQlIds };

export function runAvg001Cp001LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  return applyAvg001LocalizedStemQuality(runBasePilot(input), input.language);
}
