import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-pilot-runtime";
import type { Avg001QuestionPackage } from "./types";

export {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
};

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  const pkg = runBasePilot(input);
  if (
    pkg.solveMode !== "findOriginalCountFromJoiningMemberShift" &&
    pkg.solveMode !== "findOriginalCountFromLeavingMemberShift"
  ) {
    return pkg;
  }

  const variant = Number(pkg.questionLanguageId.slice(-3)) % 3;
  if (variant === 0) return pkg;

  const stem = input.language === "hi"
    ? variant === 1
      ? pkg.stem.replace("प्रारंभ में", "परिवर्तन से पहले")
      : pkg.stem.replace("प्रारंभ में", "मूल समूह में")
    : variant === 1
      ? pkg.stem.replace("ਸ਼ੁਰੂ ਵਿੱਚ", "ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ")
      : pkg.stem.replace("ਸ਼ੁਰੂ ਵਿੱਚ", "ਮੂਲ ਸਮੂਹ ਵਿੱਚ");

  return { ...pkg, stem };
}
