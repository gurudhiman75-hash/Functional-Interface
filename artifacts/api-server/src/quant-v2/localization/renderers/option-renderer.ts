import type { CanonicalPercentageProblem } from "../../canonical/percentage-types";
import type { LanguageCode } from "../contracts/language-contracts";
import { roundClean } from "../../utils/math-utils";

function n(value: number) {
  const rounded = roundClean(Math.abs(value), 2);
  return Number.isInteger(rounded)
    ? String(rounded)
    : String(rounded).replace(/0+$/u, "").replace(/\.$/u, "");
}

function answerNeedsPercent(problem: CanonicalPercentageProblem) {
  return [
    "profit_loss",
    "restore_original",
    "price_consumption",
    "salary_revision",
    "relational_percentage",
  ].includes(problem.subtype);
}

export function renderOption(input: {
  problem: CanonicalPercentageProblem;
  value: number;
  language?: LanguageCode;
}) {
  const language = input.language ?? "en";
  const value = input.value;
  const amount = n(value);

  if (input.problem.subtype === "profit_loss") {
    if (language === "hi") {
      return `${amount}% ${value < 0 ? "हानि" : "लाभ"}`;
    }
    if (language === "pa") {
      return `${amount}% ${value < 0 ? "ਨੁਕਸਾਨ" : "ਲਾਭ"}`;
    }
    return `${amount}% ${value < 0 ? "loss" : "profit"}`;
  }

  if (input.problem.subtype === "price_consumption") {
    if (language === "hi") {
      return `${amount}% कमी`;
    }
    if (language === "pa") {
      return `${amount}% ਕਮੀ`;
    }
    return `${amount}%`;
  }

  if (input.problem.subtype === "salary_revision") {
    if (language === "hi") {
      return `${amount}% ${value < 0 ? "कमी" : "वृद्धि"}`;
    }
    if (language === "pa") {
      return `${amount}% ${value < 0 ? "ਕਮੀ" : "ਵਾਧਾ"}`;
    }
    return `${amount}%`;
  }

  if (input.problem.subtype === "relational_percentage") {
    if (language === "hi") {
      return `${amount}% ${value < 0 ? "कम" : "अधिक"}`;
    }
    if (language === "pa") {
      return `${amount}% ${value < 0 ? "ਘੱਟ" : "ਵੱਧ"}`;
    }
    return `${amount}% ${value < 0 ? "less" : "more"}`;
  }

  if (input.problem.subtype === "restore_original") {
    if (language === "hi") {
      return `${amount}% वृद्धि`;
    }
    if (language === "pa") {
      return `${amount}% ਵਾਧਾ`;
    }
    return `${amount}%`;
  }

  if (answerNeedsPercent(input.problem)) {
    return `${amount}%`;
  }

  return n(value);
}

export function renderOptions(input: {
  problem: CanonicalPercentageProblem;
  values: readonly number[];
  language?: LanguageCode;
}) {
  const seen = new Set<string>();
  return input.values
    .map((value) =>
      renderOption({
        problem: input.problem,
        value,
        language: input.language,
      }),
    )
    .filter((value) => {
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    })
    .slice(0, 4);
}
