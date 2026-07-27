import { applyAvg001Cp003ExamStrategy } from "./cp003-exam-strategy-finalizer";
import {
  AVG_001_CP003_MULTILINGUAL_PILOT,
  getAvg001Cp003LocalizedQlIds,
  runAvg001Cp003LocalizationPilot as runBasePilot,
} from "./cp003-localization-review-runtime";
import { applyAvg001Cp003RemovedMemberSupportFix } from "./cp003-removed-member-support-fix";
import { applyAvg001LocalizedPresentationQuality } from "./localized-presentation-quality";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export { AVG_001_CP003_MULTILINGUAL_PILOT, getAvg001Cp003LocalizedQlIds };

export function runAvg001Cp003LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  const presented = applyAvg001LocalizedPresentationQuality(runBasePilot(input), input.language);
  const supportCorrected = applyAvg001Cp003RemovedMemberSupportFix(presented);
  const examReady = applyAvg001Cp003ExamStrategy(supportCorrected);
  const checks: Avg001ValidationCheck[] = presented.validation.checks.filter(
    (check) => check.name !== "localized-exam-strategy",
  );
  checks.push({
    name: "localized-exam-strategy",
    passed:
      examReady.traceability.cp003ExamStrategyFinalizer ===
      "AVG-CP-003 compact exam shortcut and trap guidance v1",
    message: "Localized explanation includes compact exam shortcut and trap guidance",
  });
  return {
    ...examReady,
    validation: {
      valid: checks.every((check) => check.passed),
      checks,
    },
  };
}
