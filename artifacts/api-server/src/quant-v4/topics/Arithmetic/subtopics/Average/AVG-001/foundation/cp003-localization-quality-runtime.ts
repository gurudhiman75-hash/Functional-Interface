import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-review-runtime";
import { applyAvg001LocalizedPresentationQuality } from "./localized-presentation-quality";
import type { Avg001QuestionPackage } from "./types";

export { AVG_001_CP003_MULTILINGUAL_PILOT, getAvg001Cp003LocalizedQlIds };

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  return applyAvg001LocalizedPresentationQuality(runBasePilot(input), input.language);
}
