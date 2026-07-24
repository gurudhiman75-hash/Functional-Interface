import {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
  runAvg001Cp001LocalizationPilot as runBasePilot,
} from "./cp001-localization-pilot";
import type { Avg001QuestionPackage } from "./types";

export {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
};

function normalizeLine(value: string, language: "hi" | "pa") {
  const punctuationSafe = language === "pa" ? value.replaceAll("।", ".") : value;
  return punctuationSafe.includes("$$")
    ? punctuationSafe.replaceAll("+", "\\mathbin{+}")
    : punctuationSafe;
}

function correctedValidation(pkg: Avg001QuestionPackage, language: "hi" | "pa") {
  const allText = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
  const gurmukhiLetters = /[\u0A01-\u0A74]/;
  const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
  const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
  const checks = pkg.validation.checks.map((check) => {
    if (check.name === "localized-script") {
      return {
        ...check,
        passed: expectedScript.test(allText) && !wrongScript.test(allText),
        message: "Localized prose uses the expected Indic script; shared punctuation is ignored",
      };
    }
    if (check.name === "localized-explanation") {
      return {
        ...check,
        passed:
          pkg.explanation.lines.length === 4 &&
          pkg.explanation.lines.some((line) => line.includes(pkg.answer)),
      };
    }
    return check;
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function runAvg001Cp001LocalizationPilot(input: {
  questionLanguageId: string;
  seed: string;
  language: "hi" | "pa";
}): Avg001QuestionPackage {
  const base = runBasePilot(input);
  const normalized: Avg001QuestionPackage = {
    ...base,
    stem: normalizeLine(base.stem, input.language),
    explanation: {
      lines: base.explanation.lines.map((line) => normalizeLine(line, input.language)),
    },
  };
  return {
    ...normalized,
    validation: correctedValidation(normalized, input.language),
  };
}
