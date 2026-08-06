import {
  applyAvg001NaturalLanguageV34Review,
  AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
} from "./natural-language-v3-4-review";
import type { Avg001QuestionPackage, Avg001ValidationCheck, Rational } from "./types";

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

function normalizeLocalizedPunctuation(pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return pkg;
  return {
    ...pkg,
    stem: pkg.stem.replace(/।{2,}/g, "।").replace(/\s+।/g, "।"),
    explanation: {
      lines: pkg.explanation.lines.map((line) => line.replace(/।{2,}/g, "।").replace(/\s+।/g, "।")),
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

function rationalNumber(value: Rational | undefined) {
  return value ? value.numerator / value.denominator : undefined;
}

function localizedReason(
  language: Avg001QuestionPackage["language"],
  key: "add-count" | "missing-equals-average" | "ratio" | "low" | "high" | "other",
) {
  const en = {
    "add-count": "adds the average and count instead of multiplying them",
    "missing-equals-average": "assumes the missing value is equal to the average",
    ratio: "forms the ratio from the wrong differences",
    low: "has an arithmetic error that makes the result too small",
    high: "has an arithmetic error that makes the result too large",
    other: "combines the given values incorrectly",
  };
  const hi = {
    "add-count": "औसत और संख्या को गुणा करने के बजाय जोड़ देता है",
    "missing-equals-average": "लापता मान को औसत के बराबर मान लेता है",
    ratio: "गलत अंतर से अनुपात बनाता है",
    low: "गणना की गलती से उत्तर छोटा हो जाता है",
    high: "गणना की गलती से उत्तर बड़ा हो जाता है",
    other: "दिए गए मानों को गलत ढंग से जोड़ता है",
  };
  const pa = {
    "add-count": "ਔਸਤ ਅਤੇ ਗਿਣਤੀ ਨੂੰ ਗੁਣਾ ਕਰਨ ਦੀ ਥਾਂ ਜੋੜ ਦਿੰਦਾ ਹੈ",
    "missing-equals-average": "ਗੁੰਮ ਮੁੱਲ ਨੂੰ ਔਸਤ ਦੇ ਬਰਾਬਰ ਮੰਨ ਲੈਂਦਾ ਹੈ",
    ratio: "ਗਲਤ ਫਰਕ ਨਾਲ ਅਨੁਪਾਤ ਬਣਾਉਂਦਾ ਹੈ",
    low: "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਛੋਟਾ ਹੋ ਜਾਂਦਾ ਹੈ",
    high: "ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ ਵੱਡਾ ਹੋ ਜਾਂਦਾ ਹੈ",
    other: "ਦਿੱਤੇ ਮੁੱਲਾਂ ਨੂੰ ਗਲਤ ਢੰਗ ਨਾਲ ਜੋੜਦਾ ਹੈ",
  };
  return (language === "hi" ? hi : language === "pa" ? pa : en)[key];
}

function contextualReason(pkg: Avg001QuestionPackage, option: string) {
  const optionValue = displayNumber(option);
  const answerValue = displayNumber(pkg.answer);
  const average = rationalNumber(pkg.parameters.values.average);
  const count = pkg.parameters.values.count;

  if (
    pkg.solveMode === "findSumFromAverageAndCount" &&
    optionValue !== undefined &&
    average !== undefined &&
    Math.abs(optionValue - (average + count)) < 1e-9
  ) {
    return localizedReason(pkg.language, "add-count");
  }
  if (
    pkg.solveMode === "findMissingValueFromAverage" &&
    optionValue !== undefined &&
    average !== undefined &&
    Math.abs(optionValue - average) < 1e-9
  ) {
    return localizedReason(pkg.language, "missing-equals-average");
  }
  if (/\d+\s*:\s*\d+/.test(option) || /\d+\s*:\s*\d+/.test(pkg.answer)) {
    return localizedReason(pkg.language, "ratio");
  }
  if (optionValue !== undefined && answerValue !== undefined) {
    if (optionValue < answerValue) return localizedReason(pkg.language, "low");
    if (optionValue > answerValue) return localizedReason(pkg.language, "high");
  }
  return localizedReason(pkg.language, "other");
}

function normalizeDirectionalDistractorReasons(pkg: Avg001QuestionPackage) {
  const line = pkg.explanation.lines[3]!;
  const patterns = [
    /([A-D]) \(([^)]+)\) (?:contains a small arithmetic error|has an arithmetic error that makes the result too (?:small|large)|makes an arithmetic error that gives a result (?:below|above) the correct value)/g,
    /([A-D]) \(([^)]+)\) (?:गणना में छोटी गलती करता है|गणना की गलती से उत्तर (?:छोटा|बड़ा) हो जाता है)/g,
    /([A-D]) \(([^)]+)\) (?:ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ|ਗਣਨਾ ਦੀ ਗਲਤੀ ਨਾਲ ਜਵਾਬ (?:ਛੋਟਾ|ਵੱਡਾ) ਹੋ ਜਾਂਦਾ ਹੈ)/g,
  ];
  let revisedLine = line;
  for (const pattern of patterns) {
    revisedLine = revisedLine.replace(pattern, (_full, letter: string, option: string) =>
      `${letter} (${option}) ${contextualReason(pkg, option)}`,
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
  const punctuationValid = pkg.language === "en" || !/।{2,}/.test([pkg.stem, ...pkg.explanation.lines].join("\n"));
  checks.push({
    name: "avg001-natural-language-v3-4-signed-currency",
    passed:
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      localizedCurrencyValid &&
      genericReasonFree &&
      punctuationValid,
    message:
      "V3.4 accepts signed rupee displays, normalizes Indic punctuation and keeps distractor direction numerically correct",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV34Final(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const repaired = normalizeDirectionalDistractorReasons(
    normalizeLocalizedPunctuation(
      normalizeSignedCurrency(applyAvg001NaturalLanguageV34Review(source)),
    ),
  );
  return {
    ...repaired,
    traceability: {
      ...repaired.traceability,
      naturalLanguageV34SignedCurrencyFinal: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
      naturalLanguageV34ContextualDistractors: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
      naturalLanguageV34IndicPunctuation: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
    },
    validation: refreshValidation(repaired),
  };
}
