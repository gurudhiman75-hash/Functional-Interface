import {
  applyAvg001Cp005EditorialV2ApprovedCandidate,
  AVG_001_CP005_EDITORIAL_V2_APPROVED,
} from "./cp005-editorial-v2-approved";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_CP005_EDITORIAL_V2_REVIEWED =
  "AVG-CP-005 adversarial review remediation v1";

function normaliseSignedCurrencyLatex(text: string) {
  return text.replace(/\\text\{₹\}-(\d(?:[\d{}.,]*))/g, "-\\text{₹}$1");
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const replaced = new Set(["cp005-v2-reviewed", "cp005-v2-currency-sign-latex"]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => !replaced.has(check.name),
  );
  const explanation = pkg.explanation.lines.join("\n");
  checks.push(
    {
      name: "cp005-v2-reviewed",
      passed:
        pkg.traceability.cp005EditorialV2Approved ===
        AVG_001_CP005_EDITORIAL_V2_APPROVED,
      message: "CP-005 includes the approved MathJax and shortcut remediation",
    },
    {
      name: "cp005-v2-currency-sign-latex",
      passed: !/\\text\{₹\}-/.test(explanation),
      message: "Negative currency signs appear before the rupee symbol in MathJax",
    },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001Cp005EditorialV2ReviewedCandidate(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const candidate = applyAvg001Cp005EditorialV2ApprovedCandidate(pkg);
  if (candidate.canonicalProblemId !== "AVG-CP-005" || candidate.language !== "en") {
    return candidate;
  }

  const revised: Avg001QuestionPackage = {
    ...candidate,
    explanation: {
      lines: candidate.explanation.lines.map(normaliseSignedCurrencyLatex),
    },
    traceability: {
      ...candidate.traceability,
      cp005EditorialV2Reviewed: AVG_001_CP005_EDITORIAL_V2_REVIEWED,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
