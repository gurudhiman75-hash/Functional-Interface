import {
  applyAvg001NaturalLanguageV34Review,
  AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
} from "./natural-language-v3-4-review";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export { AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW };

function groupIndianDigits(value: string) {
  const [integerPart, decimalPart] = value.replaceAll(",", "").split(".");
  const digits = integerPart!.replace(/^-/, "");
  const last = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = leading ? `${leading},${last}` : last;
  return decimalPart === undefined ? grouped : `${grouped}.${decimalPart}`;
}

function normalizeCurrencyValue(value: string) {
  const match = value.trim().match(/^(-?)₹?\s*(-?\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return value;
  const negative = match[1] === "-" || match[2]!.startsWith("-");
  return `${negative ? "-" : ""}₹${groupIndianDigits(match[2]!)}${match[3] ?? ""}`;
}

function normalizeCurrencyText(text: string) {
  return text.replace(/(-?)₹\s*(-?\d[\d,]*(?:\.\d+)?)/g, (_full, leading: string, number: string) => {
    const negative = leading === "-" || number.startsWith("-");
    return `${negative ? "-" : ""}₹${groupIndianDigits(number)}`;
  });
}

function isCurrencyContext(pkg: Avg001QuestionPackage) {
  return pkg.stem.includes("₹") || pkg.options.some((option) => option.includes("₹"));
}

function normalizeSignedCurrency(pkg: Avg001QuestionPackage) {
  if (!isCurrencyContext(pkg)) return pkg;
  const options = pkg.options.map(normalizeCurrencyValue);
  const answer = options[pkg.correctIndex]!;
  return {
    ...pkg,
    stem: normalizeCurrencyText(pkg.stem),
    options,
    answer,
    solver: { ...pkg.solver, answer: normalizeCurrencyValue(pkg.solver.answer) },
    independentVerification: {
      ...pkg.independentVerification,
      displayAnswer: normalizeCurrencyValue(pkg.independentVerification.displayAnswer),
    },
    explanation: {
      lines: pkg.explanation.lines.map(normalizeCurrencyText),
    },
  };
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-4-review" &&
      check.name !== "avg001-natural-language-v3-4-signed-currency",
  );
  const localizedCurrencyValid =
    pkg.language === "en" ||
    !isCurrencyContext(pkg) ||
    (pkg.options.every((option) => /^-?₹/.test(option)) && /^-?₹/.test(pkg.answer));
  checks.push({
    name: "avg001-natural-language-v3-4-signed-currency",
    passed:
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      localizedCurrencyValid,
    message:
      "V3.4 accepts normalized positive and negative rupee displays while preserving option and answer alignment",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV34Final(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const repaired = normalizeSignedCurrency(applyAvg001NaturalLanguageV34Review(source));
  return {
    ...repaired,
    traceability: {
      ...repaired.traceability,
      naturalLanguageV34SignedCurrencyFinal: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
    },
    validation: refreshValidation(repaired),
  };
}
