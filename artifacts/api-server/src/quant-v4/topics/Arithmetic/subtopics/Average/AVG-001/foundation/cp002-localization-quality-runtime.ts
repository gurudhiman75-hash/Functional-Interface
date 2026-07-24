import {
  AVG_001_CP002_MULTILINGUAL_PILOT,
  getAvg001Cp002LocalizedQlIds,
  runAvg001Cp002LocalizationPilot as runBasePilot,
} from "./cp002-localization-pilot-runtime";
import { applyAvg001LocalizedStemQuality } from "./localized-stem-quality";
import type { Avg001QuestionPackage } from "./types";

export { AVG_001_CP002_MULTILINGUAL_PILOT, getAvg001Cp002LocalizedQlIds };

export function runAvg001Cp002LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  return applyAvg001LocalizedStemQuality(runBasePilot(input), input.language);
}
