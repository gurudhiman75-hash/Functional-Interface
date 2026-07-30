import { applyAvg001NaturalLanguageV3FinalReview } from "./natural-language-v3-final-review";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_APPROVED_REVIEW =
  "AVG-001 natural teacher-language manual-review candidate v3.3";

function groupIndianDigits(value: string) {
  const clean = value.replaceAll(",", "");
  const last = clean.slice(-3);
  const leading = clean.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return leading ? `${leading},${last}` : last;
}

function repairAllCurrencyAmounts(pkg: Avg001QuestionPackage) {
  if (pkg.language !== "en" || !pkg.answer.startsWith("₹")) return pkg;
  return {
    ...pkg,
    stem: pkg.stem.replace(/(?<!₹)\b\d[\d,]*\b/g, (token) => {
      const digits = token.replaceAll(",", "");
      return digits.length >= 4 ? `₹${groupIndianDigits(digits)}` : token;
    }),
  };
}

function clarifySymmetricRatio(pkg: Avg001QuestionPackage) {
  if (pkg.solveMode !== "findGroupCountRatioFromCombinedAverage") return pkg;
  const ratio = pkg.answer.match(/(\d+)\s*:\s*(\d+)/);
  if (!ratio || ratio[1] !== ratio[2]) return pkg;
  const note = pkg.language === "en"
    ? "A 1:1 ratio is unchanged in reverse order, so every unequal option is incorrect. "
    : pkg.language === "hi"
      ? "1:1 अनुपात उलटे क्रम में भी वही रहता है, इसलिए हर असमान विकल्प गलत है। "
      : "1:1 ਅਨੁਪਾਤ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਵੀ ਉਹੀ ਰਹਿੰਦਾ ਹੈ, ਇਸ ਲਈ ਹਰ ਅਸਮਾਨ ਵਿਕਲਪ ਗਲਤ ਹੈ। ";
  const lines = [...pkg.explanation.lines];
  lines[3] = `${note}${lines[3]}`;
  return { ...pkg, explanation: { lines } };
}

function hasUnlabelledLargeAmount(text: string) {
  return [...text.matchAll(/(?<!₹)\b\d[\d,]*\b/g)]
    .some((match) => match[0].replaceAll(",", "").length >= 4);
}

function refreshedValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-final-review",
  );
  const text = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  checks.push({
    name: "avg001-natural-language-v3-approved-review",
    passed:
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      !/(?<!\\)(?:div|times)(?=[0-9\s({])/.test(text) &&
      (pkg.language !== "en" || !pkg.answer.startsWith("₹") || !hasUnlabelledLargeAmount(pkg.stem)),
    message: "V3.3 candidate preserves the correct display, four-part explanation, valid MathJax operators and explicit currency amounts",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3ApprovedReview(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const reviewed = clarifySymmetricRatio(
    repairAllCurrencyAmounts(applyAvg001NaturalLanguageV3FinalReview(source)),
  );
  const revised: Avg001QuestionPackage = {
    ...reviewed,
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...reviewed.traceability,
      naturalLanguageApprovedReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_APPROVED_REVIEW,
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
    },
  };
  return { ...revised, validation: refreshedValidation(revised) };
}
