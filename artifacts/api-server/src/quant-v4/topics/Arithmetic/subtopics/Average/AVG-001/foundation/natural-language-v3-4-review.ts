import { applyAvg001NaturalLanguageV3ApprovedReview } from "./natural-language-v3-approved-review";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW =
  "AVG-001 natural teacher-language manual-review candidate v3.4";

function groupIndianDigits(value: string) {
  const [integerPart, decimalPart] = value.replaceAll(",", "").split(".");
  const sign = integerPart!.startsWith("-") ? "-" : "";
  const digits = integerPart!.replace("-", "");
  const last = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = `${sign}${leading ? `${leading},${last}` : last}`;
  return decimalPart === undefined ? grouped : `${grouped}.${decimalPart}`;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceDisplayToken(text: string, oldValue: string, newValue: string) {
  if (!oldValue || oldValue === newValue) return text;
  return text.replace(
    new RegExp(`(?<![\\d,])${escapeRegex(oldValue)}(?![\\d,])`, "g"),
    newValue,
  );
}

function formatCurrencyValue(value: string) {
  const match = value.trim().match(/^₹?\s*(-?\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return value;
  return `₹${groupIndianDigits(match[1]!)}${match[2] ?? ""}`;
}

function formatCurrencyText(text: string) {
  return text.replace(/₹\s*(-?\d[\d,]*(?:\.\d+)?)/g, (_full, number: string) =>
    `₹${groupIndianDigits(number)}`,
  );
}

function isCurrencyContext(pkg: Avg001QuestionPackage) {
  return pkg.stem.includes("₹") || pkg.options.some((option) => option.includes("₹"));
}

function repairCurrencyDisplay(pkg: Avg001QuestionPackage) {
  if (!isCurrencyContext(pkg)) return pkg;

  const optionPairs = pkg.options.map((option) => [option, formatCurrencyValue(option)] as const);
  const options = optionPairs.map(([, formatted]) => formatted);
  const answer = options[pkg.correctIndex]!;
  let lines = pkg.explanation.lines.map(formatCurrencyText);

  for (const [oldValue, newValue] of optionPairs
    .filter(([oldValue, newValue]) => oldValue !== newValue)
    .sort((left, right) => right[0].length - left[0].length)) {
    lines = lines.map((line) => replaceDisplayToken(line, oldValue, newValue));
  }
  lines = lines.map((line) => replaceDisplayToken(line, pkg.answer, answer));

  return {
    ...pkg,
    stem: formatCurrencyText(pkg.stem),
    options,
    answer,
    solver: {
      ...pkg.solver,
      answer: pkg.solver.answer === pkg.answer ? answer : formatCurrencyText(pkg.solver.answer),
    },
    independentVerification: {
      ...pkg.independentVerification,
      displayAnswer:
        pkg.independentVerification.displayAnswer === pkg.answer
          ? answer
          : formatCurrencyText(pkg.independentVerification.displayAnswer),
    },
    explanation: { lines },
  };
}

function isAgeContext(pkg: Avg001QuestionPackage) {
  return /\b(?:age|ages|aged|year|years|old)\b/i.test(pkg.stem) ||
    /(?:आयु|उम्र|वर्ष|ਸਾਲ|ਉਮਰ)/.test(pkg.stem);
}

function resolvedEnglishUnit(pkg: Avg001QuestionPackage) {
  const stem = pkg.stem;
  if (/\bcomponents?\b/i.test(stem)) return "components";
  if (/\b(?:output|production|machines?|units?)\b/i.test(stem)) return "units";
  if (/\b(?:km|kilometres?|kilometers?|distance)\b/i.test(stem)) return "km";
  if (/\b(?:marks?|scores?|tests?|examinations?)\b/i.test(stem)) return "marks";
  if (/\b(?:runs?|innings?|cricket)\b/i.test(stem)) return "runs";
  if (/\b(?:weights?|kg|kilograms?)\b/i.test(stem)) return "kg";
  return "";
}

function replaceYearSuffix(text: string, unit: string) {
  const suffix = unit ? ` ${unit}` : "";
  return text
    .replace(/\\text\{\s*years?\s*\}/gi, unit ? `\\text{${unit}}` : "")
    .replace(/\s+years?\b/gi, suffix)
    .replace(/\s{2,}/g, " ")
    .trim();
}

function repairEnglishWrongYearSuffix(pkg: Avg001QuestionPackage) {
  if (pkg.language !== "en" || isAgeContext(pkg)) return pkg;
  const learnerText = [pkg.answer, ...pkg.options, ...pkg.explanation.lines].join("\n");
  if (!/\byears?\b/i.test(learnerText)) return pkg;

  const unit = resolvedEnglishUnit(pkg);
  const options = pkg.options.map((option) => replaceYearSuffix(option, unit));
  const answer = options[pkg.correctIndex]!;
  return {
    ...pkg,
    options,
    answer,
    solver: { ...pkg.solver, answer: replaceYearSuffix(pkg.solver.answer, unit) },
    independentVerification: {
      ...pkg.independentVerification,
      displayAnswer: replaceYearSuffix(pkg.independentVerification.displayAnswer, unit),
    },
    explanation: {
      lines: pkg.explanation.lines.map((line) => replaceYearSuffix(line, unit)),
    },
  };
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-4-review",
  );
  const text = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  const localizedCurrencyValid =
    pkg.language === "en" ||
    !isCurrencyContext(pkg) ||
    (pkg.options.every((option) => option.startsWith("₹")) && pkg.answer.startsWith("₹"));
  const nonAgeEnglishYearValid =
    pkg.language !== "en" || isAgeContext(pkg) || !/\byears?\b/i.test(text);

  checks.push({
    name: "avg001-natural-language-v3-4-review",
    passed:
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      localizedCurrencyValid &&
      nonAgeEnglishYearValid,
    message:
      "V3.4 preserves the answer key, removes non-age year suffixes and formats currency options in every language",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV34Review(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const v33 = applyAvg001NaturalLanguageV3ApprovedReview(source);
  const repaired = repairCurrencyDisplay(repairEnglishWrongYearSuffix(v33));
  const revised: Avg001QuestionPackage = {
    ...repaired,
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...repaired.traceability,
      naturalLanguageV34ReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
      multilingualNumericalAuthority: "shared-seed English mathematical object",
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
