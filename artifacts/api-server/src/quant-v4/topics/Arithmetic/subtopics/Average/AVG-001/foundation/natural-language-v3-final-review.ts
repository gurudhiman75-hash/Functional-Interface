import { applyAvg001NaturalLanguageV3Review } from "./natural-language-v3-review";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck, Rational } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_FINAL_REVIEW =
  "AVG-001 natural teacher-language manual-review candidate v3.3";

function numeric(value: number | Rational | undefined) {
  if (typeof value === "number") return value;
  if (value && typeof value === "object" && value.denominator) return value.numerator / value.denominator;
  return undefined;
}

function optionNumber(value: string) {
  const match = value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : undefined;
}

function close(left: number | undefined, right: number | undefined) {
  return left !== undefined && right !== undefined && Math.abs(left - right) < 0.06;
}

function hasRealUnitCue(stem: string) {
  return /₹|\b(?:salary|salaries|sales|price|revenue|expense|order value|mark|marks|score|scores|test|tests|examination|examinations|age|ages|year|years|run|runs|inning|innings|cricket|weight|weights|kg|kilogram|kilograms|kilometre|kilometres|kilometer|kilometers|km|speed|hour|hours|output|production|machine|machines|unit per hour|units per hour)\b/i.test(stem);
}

function stripFalseAbstractUnit(text: string) {
  return text
    .replace(/\\text\{\s*(?:years?|marks?|runs?|kg|km|units?)\s*\}/gi, "")
    .replace(/\s+(?:years?|marks?|runs?|kg|km|units?)\b/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function groupIndianDigits(value: string) {
  const clean = value.replaceAll(",", "");
  const last = clean.slice(-3);
  const leading = clean.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return leading ? `${leading},${last}` : last;
}

function repairEnglishSalaryStem(stem: string, answer: string) {
  if (!answer.startsWith("₹")) return stem;
  return stem.replace(
    /(averages?\s+are\s+)(\d[\d,]*)(\s*,\s*)(\d[\d,]*)(\s*,\s*)(\d[\d,]*)/i,
    (_full, lead: string, first: string, comma1: string, second: string, comma2: string, third: string) =>
      `${lead}₹${groupIndianDigits(first)}${comma1}₹${groupIndianDigits(second)}${comma2}₹${groupIndianDigits(third)}`,
  );
}

function replaceAnswerEverywhere(pkg: Avg001QuestionPackage, answer: string) {
  const oldAnswer = pkg.answer;
  return {
    ...pkg,
    answer,
    solver: { ...pkg.solver, answer: pkg.solver.answer === oldAnswer ? answer : pkg.solver.answer },
    independentVerification: {
      ...pkg.independentVerification,
      displayAnswer: pkg.independentVerification.displayAnswer === oldAnswer ? answer : pkg.independentVerification.displayAnswer,
    },
    explanation: {
      lines: pkg.explanation.lines.map((line) => line.replaceAll(oldAnswer, answer)),
    },
  };
}

function repairAbstractEnglish(source: Avg001QuestionPackage, pkg: Avg001QuestionPackage) {
  if (
    pkg.language !== "en" ||
    !["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(pkg.canonicalProblemId) ||
    hasRealUnitCue(pkg.stem)
  ) return pkg;
  const options = pkg.options.map(stripFalseAbstractUnit);
  const answer = options[pkg.correctIndex]!;
  const revised = replaceAnswerEverywhere({ ...pkg, options }, answer);
  return {
    ...revised,
    solver: { ...revised.solver, answer: stripFalseAbstractUnit(revised.solver.answer) },
    independentVerification: {
      ...revised.independentVerification,
      displayAnswer: stripFalseAbstractUnit(revised.independentVerification.displayAnswer),
    },
    explanation: { lines: revised.explanation.lines.map(stripFalseAbstractUnit) },
  };
}

function parseRatio(value: string) {
  const match = value.match(/(-?\d+)\s*:\s*(-?\d+)/);
  return match ? [Number(match[1]), Number(match[2])] as const : null;
}

function ratioReason(option: string, answer: string, language: Avg001Language) {
  const wrong = parseRatio(option);
  const correct = parseRatio(answer);
  const reversed = Boolean(wrong && correct && wrong[0] === correct[1] && wrong[1] === correct[0]);
  if (language === "en") return reversed
    ? "writes the required ratio in reverse order"
    : "uses the wrong distances from the combined average";
  if (language === "hi") return reversed
    ? "आवश्यक अनुपात उलटे क्रम में लिखता है"
    : "संयुक्त औसत से गलत दूरियाँ लेकर अनुपात बनाता है";
  return reversed
    ? "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਉਲਟੇ ਕ੍ਰਮ ਵਿੱਚ ਲਿਖਦਾ ਹੈ"
    : "ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਤੋਂ ਗਲਤ ਦੂਰੀਆਂ ਲੈ ਕੇ ਅਨੁਪਾਤ ਬਣਾਉਂਦਾ ਹੈ";
}

function subgroupAverages(source: Avg001QuestionPackage) {
  const v = source.parameters.values;
  return (v.subgroupAverages ?? v.groupAverages ?? [])
    .map(numeric)
    .filter((item): item is number => item !== undefined);
}

function subgroupCounts(source: Avg001QuestionPackage) {
  const v = source.parameters.values;
  return v.subgroupCounts ?? v.groupCounts ?? [];
}

function hierarchyReason(source: Avg001QuestionPackage, option: string, language: Avg001Language) {
  const value = optionNumber(option);
  const averages = subgroupAverages(source);
  const counts = subgroupCounts(source);
  let kind: "subgroup" | "simple" | "omit" | "arithmetic" = "arithmetic";
  if (averages.some((average) => close(value, average))) kind = "subgroup";
  else if (averages.length > 1 && close(value, averages.reduce((sum, average) => sum + average, 0) / averages.length)) kind = "simple";
  else if (averages.length === counts.length && averages.length > 2) {
    for (let omitted = 0; omitted < averages.length; omitted += 1) {
      let total = 0;
      let count = 0;
      for (let index = 0; index < averages.length; index += 1) {
        if (index === omitted) continue;
        total += averages[index]! * counts[index]!;
        count += counts[index]!;
      }
      if (close(value, count ? total / count : undefined)) kind = "omit";
    }
  }
  const text = {
    en: {
      subgroup: "reuses one subgroup average instead of finding the combined result",
      simple: "takes a simple mean even though the groups are not equally sized",
      omit: "leaves out one group while forming the combined total",
      arithmetic: "makes an arithmetic error while combining group totals and counts",
    },
    hi: {
      subgroup: "संयुक्त परिणाम की जगह एक उपसमूह का औसत दोहरा देता है",
      simple: "असमान समूहों का साधारण औसत लेता है",
      omit: "संयुक्त कुल बनाते समय एक समूह छोड़ देता है",
      arithmetic: "समूह-कुल और संख्याएँ जोड़ते समय गणना गलत करता है",
    },
    pa: {
      subgroup: "ਮਿਲੀ-ਜੁਲੀ ਨਤੀਜੇ ਦੀ ਥਾਂ ਇੱਕ ਉਪ-ਸਮੂਹ ਦੀ ਔਸਤ ਦੁਹਰਾਉਂਦਾ ਹੈ",
      simple: "ਅਸਮਾਨ ਸਮੂਹਾਂ ਦੀ ਸਧਾਰਣ ਔਸਤ ਲੈਂਦਾ ਹੈ",
      omit: "ਮਿਲੀ-ਜੁਲੀ ਕੁੱਲ ਬਣਾਉਂਦੇ ਸਮੇਂ ਇੱਕ ਸਮੂਹ ਛੱਡ ਦਿੰਦਾ ਹੈ",
      arithmetic: "ਸਮੂਹ-ਕੁੱਲ ਅਤੇ ਗਿਣਤੀਆਂ ਜੋੜਦੇ ਸਮੇਂ ਗਣਨਾ ਗਲਤ ਕਰਦਾ ਹੈ",
    },
  } as const;
  return text[language][kind];
}

function buildParts(pkg: Avg001QuestionPackage, reason: (option: string) => string) {
  return pkg.options
    .map((option, index) => ({ option, index, label: String.fromCharCode(65 + index) }))
    .filter(({ index }) => index !== pkg.correctIndex)
    .map(({ option, label }) => `${label} (${option}) ${reason(option)}`);
}

function finishDistractors(pkg: Avg001QuestionPackage, parts: string[]) {
  if (pkg.language === "en") return `⚠️ Why the other options are wrong: ${parts.join("; ")}. Therefore, the correct answer is ${pkg.answer}.`;
  if (pkg.language === "hi") return `दूसरे विकल्प क्यों गलत हैं: ${parts.join("; ")}। इसलिए सही उत्तर ${pkg.answer} है।`;
  return `ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ: ${parts.join("; ")}। ਇਸ ਲਈ ਸਹੀ ਜਵਾਬ ${pkg.answer} ਹੈ।`;
}

function ratioConcept(language: Avg001Language) {
  if (language === "en") return "📌 Key rule: The group sizes are in the opposite ratio of their distances from the combined average.";
  if (language === "hi") return "मुख्य बात: समूहों की संख्याओं का अनुपात, संयुक्त औसत से उनकी दूरियों के उलटे अनुपात में होता है।";
  return "ਮੁੱਖ ਗੱਲ: ਸਮੂਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ, ਮਿਲੀ-ਜੁਲੀ ਔਸਤ ਤੋਂ ਉਨ੍ਹਾਂ ਦੀਆਂ ਦੂਰੀਆਂ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਹੁੰਦਾ ਹੈ।";
}

function rebuildContext(source: Avg001QuestionPackage, pkg: Avg001QuestionPackage) {
  if (source.solveMode === "findGroupCountRatioFromCombinedAverage") {
    return {
      ...pkg,
      explanation: {
        lines: [
          ratioConcept(pkg.language),
          pkg.explanation.lines[1]!,
          pkg.explanation.lines[2]!,
          finishDistractors(pkg, buildParts(pkg, (option) => ratioReason(option, pkg.answer, pkg.language))),
        ],
      },
    };
  }
  if (source.canonicalProblemId === "AVG-CP-006" && source.parameters.answerType === "AVERAGE") {
    return {
      ...pkg,
      explanation: {
        lines: [
          pkg.explanation.lines[0]!,
          pkg.explanation.lines[1]!,
          pkg.explanation.lines[2]!,
          finishDistractors(pkg, buildParts(pkg, (option) => hierarchyReason(source, option, pkg.language))),
        ],
      },
    };
  }
  return pkg;
}

function validateFinal(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-final-review",
  );
  const text = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  checks.push({
    name: "avg001-natural-language-v3-final-review",
    passed:
      pkg.options[pkg.correctIndex] === pkg.answer &&
      !/(?<!\\)(?:div|times)(?=[0-9\s({])/.test(text) &&
      !/\baverage\b.*\b(?:year|years)\b/i.test(`${pkg.stem}\n${pkg.options.join("\n")}`),
    message: "V3.3 final review has justified units, valid operators and context-aligned ratio/hierarchy guidance",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3FinalReview(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const base = applyAvg001NaturalLanguageV3Review(source);
  const abstractRepaired = repairAbstractEnglish(source, base);
  const stemRepaired: Avg001QuestionPackage = {
    ...abstractRepaired,
    stem: abstractRepaired.language === "en"
      ? repairEnglishSalaryStem(abstractRepaired.stem, abstractRepaired.answer)
      : abstractRepaired.stem,
  };
  const contextual = rebuildContext(source, stemRepaired);
  const revised: Avg001QuestionPackage = {
    ...contextual,
    traceability: {
      ...contextual.traceability,
      naturalLanguageReviewFinalPolish: AVG_001_NATURAL_LANGUAGE_V3_FINAL_REVIEW,
    },
  };
  return { ...revised, validation: validateFinal(revised) };
}
