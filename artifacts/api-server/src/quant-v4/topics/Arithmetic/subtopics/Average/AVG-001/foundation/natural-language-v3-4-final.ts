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

function displayNumber(value: string) {
  const cleaned = value.replaceAll(",", "").replaceAll("₹", "").trim();
  const ratio = cleaned.match(/^(-?\d+)\s*:\s*(-?\d+)$/);
  if (ratio && Number(ratio[2]) !== 0) return Number(ratio[1]) / Number(ratio[2]);
  const fraction = cleaned.match(/^(-?\d+)\s*\/\s*(-?\d+)$/);
  if (fraction && Number(fraction[2]) !== 0) return Number(fraction[1]) / Number(fraction[2]);
  const number = cleaned.match(/-?\d+(?:\.\d+)?/);
  return number ? Number(number[0]) : undefined;
}

function contextualReason(
  option: string,
  answer: string,
  language: Avg001QuestionPackage["language"],
) {
  if (/\d+\s*:\s*\d+/.test(option) || /\d+\s*:\s*\d+/.test(answer)) {
    if (language === "hi") return "गलत अंतर से अनुपात बनाता है";
    if (language === "pa") return "ਗਲਤ ਫਰਕ ਨਾਲ ਅਨੁਪਾਤ ਬਣਾਉਂਦਾ ਹੈ";
    return "forms the ratio from the wrong differences";
  }
  const optionValue = displayNumber(option);
  const answerValue = displayNumber(answer);
  const direction = optionValue !== undefined && answerValue !== undefined
    ? Math.sign(optionValue - answerValue)
    : 0;
  if (language === "hi") {
    if (direction < 0) return "गणना की गलती से उत्तर छोटा हो जाता है";
    if (direction > 0) return "गणना की गलती से उत्तर बड़ा हो जाता है";
    return "दिए गए मानों को गलत ढंग से जोड़ता है";
  }
  if (language === "pa") {
    if (direction < 0) return "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਛੋਟਾ ਹੋ ਜਾਂਦਾ ਹੈ";
    if (direction > 0) return "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਵੱਡਾ ਹੋ ਜਾਂਦਾ ਹੈ";
    return "ਦਿੱਤੇ ਮੁੱਲਾਂ ਨੂੰ ਗਲਤ ਢੰਗ ਨਾਲ ਜੋੜਦਾ ਹੈ";
  }
  if (direction < 0) return "has an arithmetic error that makes the result too small";
  if (direction > 0) return "has an arithmetic error that makes the result too large";
  return "combines the given values incorrectly";
}

function replaceGenericDistractorReasons(pkg: Avg001QuestionPackage) {
  const line = pkg.explanation.lines[3]!;
  const patterns = [
    /([A-D]) \(([^)]+)\) contains a small arithmetic error/g,
    /([A-D]) \(([^)]+)\) गणना में छोटी गलती करता है/g,
    /([A-D]) \(([^)]+)\) ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ/g,
  ];
  let revisedLine = line;
  for (const pattern of patterns) {
    revisedLine = revisedLine.replace(pattern, (_full, letter: string, option: string) =>
      `${letter} (${option}) ${contextualReason(option, pkg.answer, pkg.language)}`,
    );
  }
  return {
    ...pkg,
    explanation: {
      lines: [
        pkg.explanation.lines[0]!,
        pkg.explanation.lines[1]!,
        pkg.explanation.lines[2]!,
        revisedLine,
      ],
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
  const genericReasonFree = !/(?:contains a small arithmetic error|गणना में छोटी गलती करता है|ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ)/.test(
    pkg.explanation.lines[3]!,
  );
  checks.push({
    name: "avg001-natural-language-v3-4-signed-currency",
    passed:
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      localizedCurrencyValid &&
      genericReasonFree,
    message:
      "V3.4 accepts signed rupee displays and replaces generic distractor fallbacks with option-specific reasons",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV34Final(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const repaired = replaceGenericDistractorReasons(
    normalizeSignedCurrency(applyAvg001NaturalLanguageV34Review(source)),
  );
  return {
    ...repaired,
    traceability: {
      ...repaired.traceability,
      naturalLanguageV34SignedCurrencyFinal: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
      naturalLanguageV34ContextualDistractors: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
    },
    validation: refreshValidation(repaired),
  };
}
