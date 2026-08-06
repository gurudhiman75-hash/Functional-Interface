import { applyAvg001NaturalLanguageV3ApprovedReview } from "./natural-language-v3-approved-review";
import { buildAvg001AuthorityDistractorLine } from "./natural-language-v3-distractor-authority";
import { runAvg001EditorialV2Pipeline } from "./editorial-v2-release";
import type { Avg001Language, Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

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

function englishReviewedAuthority(source: Avg001QuestionPackage) {
  const englishSource = source.language === "en"
    ? source
    : runAvg001EditorialV2Pipeline({
        questionLanguageId: source.questionLanguageId,
        seed: source.seed,
        language: "en",
      });
  return repairCurrencyDisplay(
    repairEnglishWrongYearSuffix(applyAvg001NaturalLanguageV3ApprovedReview(englishSource)),
  );
}

function localizedOptionFromEnglish(option: string, currency: boolean) {
  if (currency) return formatCurrencyValue(option);
  const ratio = option.match(/-?\d+\s*:\s*-?\d+/);
  if (ratio) return ratio[0].replace(/\s+/g, "");
  const fraction = option.replaceAll(",", "").match(/-?\d+\s*\/\s*\d+/);
  if (fraction) return fraction[0].replace(/\s+/g, "");
  const percent = option.replaceAll(",", "").match(/-?\d+(?:\.\d+)?\s*%/);
  if (percent) return percent[0].replace(/\s+/g, "");
  const number = option.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return number?.[0] ?? option;
}

function alignLocalizedOptionsToEnglishAuthority(
  source: Avg001QuestionPackage,
  pkg: Avg001QuestionPackage,
) {
  if (pkg.language === "en") return pkg;
  const authority = englishReviewedAuthority(source);
  const currency = isCurrencyContext(pkg) || isCurrencyContext(authority);
  const options = authority.options.map((option) => localizedOptionFromEnglish(option, currency));
  const correctIndex = authority.correctIndex;
  const answer = options[correctIndex]!;
  const oldAnswer = pkg.answer;
  const firstThreeLines = pkg.explanation.lines.slice(0, 3).map((line) =>
    replaceDisplayToken(formatCurrencyText(line), oldAnswer, answer),
  );
  const aligned: Avg001QuestionPackage = {
    ...pkg,
    options,
    correctIndex,
    answer,
    solver: { ...pkg.solver, answer },
    independentVerification: { ...pkg.independentVerification, displayAnswer: answer },
    explanation: {
      lines: [
        firstThreeLines[0]!,
        firstThreeLines[1]!,
        firstThreeLines[2]!,
        pkg.explanation.lines[3]!,
      ],
    },
  };
  const distractorLine = buildAvg001AuthorityDistractorLine(source, aligned);
  return {
    ...aligned,
    explanation: {
      lines: [
        aligned.explanation.lines[0]!,
        aligned.explanation.lines[1]!,
        aligned.explanation.lines[2]!,
        distractorLine,
      ],
    },
  };
}

function numericCounts(text: string) {
  const counts = new Map<string, number>();
  for (const match of text.replaceAll(",", "").matchAll(/-?\d+(?:\.\d+)?/g)) {
    const token = String(Number(match[0]));
    counts.set(token, (counts.get(token) ?? 0) + 1);
  }
  return counts;
}

function missingVisibleTokens(englishStem: string, localizedStem: string) {
  const english = numericCounts(englishStem);
  const localized = numericCounts(localizedStem);
  const missing: string[] = [];
  for (const [token, count] of english) {
    for (let index = localized.get(token) ?? 0; index < count; index += 1) missing.push(token);
  }
  return missing;
}

function renderVariableKeyForToken(source: Avg001QuestionPackage, token: string) {
  const preferred = [
    "commonDifference", "count", "knownCount", "firstTerm", "lastTerm", "average",
    "oldAverage", "currentAverage", "newAverage", "yearsElapsed", "knownTotal", "total",
    "count1", "count2", "count3", "count4", "average1", "average2", "average3", "average4",
    "subgroupCount1", "subgroupCount2", "subgroupCount3", "subgroupAverage1",
    "subgroupAverage2", "subgroupAverage3", "combinedAverage", "memberValue",
  ];
  const variables = source.parameters.renderVariables;
  for (const key of preferred) {
    const value = variables[key];
    if (value !== undefined && String(Number(String(value).replaceAll(",", ""))) === token) return key;
  }
  for (const [key, value] of Object.entries(variables)) {
    if (String(Number(String(value).replaceAll(",", ""))) === token) return key;
  }
  return "value";
}

function localizedGivenClause(key: string, value: string, language: Exclude<Avg001Language, "en">) {
  const hi: Record<string, string> = {
    commonDifference: `समान अंतर ${value} है।`, count: `कुल संख्या ${value} है।`,
    knownCount: `ज्ञात प्रविष्टियों की संख्या ${value} है।`, firstTerm: `पहला पद ${value} है।`,
    lastTerm: `अंतिम पद ${value} है।`, average: `दिया गया औसत ${value} है।`,
    oldAverage: `पुराना औसत ${value} है।`, currentAverage: `वर्तमान औसत ${value} है।`,
    newAverage: `नया औसत ${value} है।`, yearsElapsed: `बीता समय ${value} वर्ष है।`,
    knownTotal: `ज्ञात कुल ${value} है।`, total: `कुल ${value} है।`,
    count1: `पहले समूह की संख्या ${value} है।`, count2: `दूसरे समूह की संख्या ${value} है।`,
    count3: `तीसरे समूह की संख्या ${value} है।`, count4: `चौथे समूह की संख्या ${value} है।`,
    average1: `पहले समूह का औसत ${value} है।`, average2: `दूसरे समूह का औसत ${value} है।`,
    average3: `तीसरे समूह का औसत ${value} है।`, average4: `चौथे समूह का औसत ${value} है।`,
    value: `एक दिया गया मान ${value} है।`,
  };
  const pa: Record<string, string> = {
    commonDifference: `ਸਾਂਝਾ ਅੰਤਰ ${value} ਹੈ।`, count: `ਕੁੱਲ ਗਿਣਤੀ ${value} ਹੈ।`,
    knownCount: `ਜਾਣੀਆਂ ਐਂਟਰੀਆਂ ਦੀ ਗਿਣਤੀ ${value} ਹੈ।`, firstTerm: `ਪਹਿਲਾ ਪਦ ${value} ਹੈ।`,
    lastTerm: `ਆਖਰੀ ਪਦ ${value} ਹੈ।`, average: `ਦਿੱਤੀ ਔਸਤ ${value} ਹੈ।`,
    oldAverage: `ਪੁਰਾਣੀ ਔਸਤ ${value} ਹੈ।`, currentAverage: `ਮੌਜੂਦਾ ਔਸਤ ${value} ਹੈ।`,
    newAverage: `ਨਵੀਂ ਔਸਤ ${value} ਹੈ।`, yearsElapsed: `ਬੀਤਿਆ ਸਮਾਂ ${value} ਸਾਲ ਹੈ।`,
    knownTotal: `ਜਾਣਿਆ ਕੁੱਲ ${value} ਹੈ।`, total: `ਕੁੱਲ ${value} ਹੈ।`,
    count1: `ਪਹਿਲੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ${value} ਹੈ।`, count2: `ਦੂਜੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ${value} ਹੈ।`,
    count3: `ਤੀਜੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ${value} ਹੈ।`, count4: `ਚੌਥੇ ਸਮੂਹ ਦੀ ਗਿਣਤੀ ${value} ਹੈ।`,
    average1: `ਪਹਿਲੇ ਸਮੂਹ ਦੀ ਔਸਤ ${value} ਹੈ।`, average2: `ਦੂਜੇ ਸਮੂਹ ਦੀ ਔਸਤ ${value} ਹੈ।`,
    average3: `ਤੀਜੇ ਸਮੂਹ ਦੀ ਔਸਤ ${value} ਹੈ।`, average4: `ਚੌਥੇ ਸਮੂਹ ਦੀ ਔਸਤ ${value} ਹੈ।`,
    value: `ਇੱਕ ਦਿੱਤਾ ਮੁੱਲ ${value} ਹੈ।`,
  };
  return (language === "hi" ? hi : pa)[key] ?? (language === "hi" ? hi.value : pa.value);
}

function insertBeforeFinalInstruction(stem: string, clauses: string[], language: Exclude<Avg001Language, "en">) {
  if (!clauses.length) return stem;
  const separator = language === "hi" || language === "pa" ? "। " : ". ";
  const parts = stem.split(separator);
  if (parts.length < 2) return `${stem} ${clauses.join(" ")}`;
  const finalInstruction = parts.pop()!;
  return [...parts, clauses.join(" "), finalInstruction].join(separator);
}

function repairLocalizedVisibleGivens(source: Avg001QuestionPackage, pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return pkg;
  const englishQuestion = englishReviewedAuthority(source);
  const missing = missingVisibleTokens(englishQuestion.stem, pkg.stem);
  if (!missing.length) return pkg;
  const clauses = missing.map((token) =>
    localizedGivenClause(renderVariableKeyForToken(englishQuestion, token), token, pkg.language as "hi" | "pa"),
  );
  return {
    ...pkg,
    stem: insertBeforeFinalInstruction(pkg.stem, clauses, pkg.language as "hi" | "pa"),
  };
}

function englishVisibleGivensPreserved(pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return true;
  const englishQuestion = englishReviewedAuthority(pkg);
  return missingVisibleTokens(englishQuestion.stem, pkg.stem).length === 0;
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
      nonAgeEnglishYearValid &&
      englishVisibleGivensPreserved(pkg),
    message:
      "V3.4 preserves shared visible givens, English option authority and answer keys, removes non-age year suffixes and formats currency in every language",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV34Review(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const v33 = applyAvg001NaturalLanguageV3ApprovedReview(source);
  const displayRepaired = repairCurrencyDisplay(repairEnglishWrongYearSuffix(v33));
  const optionAligned = alignLocalizedOptionsToEnglishAuthority(source, displayRepaired);
  const repaired = repairLocalizedVisibleGivens(source, optionAligned);
  const revised: Avg001QuestionPackage = {
    ...repaired,
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...repaired.traceability,
      naturalLanguageV34ReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
      multilingualNumericalAuthority: "shared-seed English mathematical object and option array",
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
