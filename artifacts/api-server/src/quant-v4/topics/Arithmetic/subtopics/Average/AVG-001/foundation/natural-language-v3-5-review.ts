import { runAvg001EditorialV2Pipeline } from "./editorial-v2-release";
import {
  applyAvg001NaturalLanguageV34Final,
  AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
} from "./natural-language-v3-4-final";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_5_REVIEW =
  "AVG-001 natural teacher-language manual-review candidate v3.5";

const CURRENCY_TARGET_TYPES = new Set(["ABSOLUTE", "AVERAGE", "MEMBER_VALUE", "DIFFERENCE"]);

function groupIndianDigits(value: string) {
  const [integerPart, decimalPart] = value.replaceAll(",", "").split(".");
  const sign = integerPart!.startsWith("-") ? "-" : "";
  const digits = integerPart!.replace(/^-/, "");
  const last = digits.slice(-3);
  const leading = digits.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = `${sign}${leading ? `${leading},${last}` : last}`;
  return decimalPart === undefined ? grouped : `${grouped}.${decimalPart}`;
}

function cleanText(text: string) {
  return text
    .replace(/₹{2,}/g, "₹")
    .replace(/(\d)₹(?=\d)/g, "$1,")
    .replace(/(^|[^A-Za-z\\])ext\{/g, (_full, prefix: string) => `${prefix}\\text{`)
    .replace(/₹\s*₹/g, "₹")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceDisplayToken(text: string, oldValue: string, newValue: string) {
  if (!oldValue || oldValue === newValue) return text;
  return text.replace(new RegExp(escapeRegex(oldValue), "g"), newValue);
}

function numericDisplay(value: string) {
  const cleaned = cleanText(value).replaceAll("₹", "").trim();
  const ratio = cleaned.match(/-?\d+\s*:\s*-?\d+/);
  if (ratio) return ratio[0].replace(/\s+/g, "");
  const fraction = cleaned.replaceAll(",", "").match(/-?\d+\s*\/\s*\d+/);
  if (fraction) return fraction[0].replace(/\s+/g, "");
  const percent = cleaned.replaceAll(",", "").match(/-?\d+(?:\.\d+)?\s*%/);
  if (percent) return percent[0].replace(/\s+/g, "");
  const number = cleaned.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/);
  return number ? groupIndianDigits(number[0]) : cleaned;
}

function targetIsCurrency(pkg: Avg001QuestionPackage) {
  return CURRENCY_TARGET_TYPES.has(pkg.parameters.answerType) && pkg.stem.includes("₹");
}

function countDisplay(value: string, language: Avg001QuestionPackage["language"]) {
  const cleaned = cleanText(value).replaceAll("₹", "").trim();
  const number = numericDisplay(cleaned);
  if (language !== "en") return number;
  const suffix = cleaned.match(/-?\d[\d,]*(?:\.\d+)?\s*(.*)$/)?.[1]?.trim() ?? "";
  return `${number}${suffix ? ` ${suffix}` : ""}`;
}

function displayForTarget(value: string, pkg: Avg001QuestionPackage) {
  if (pkg.parameters.answerType === "COUNT") return countDisplay(value, pkg.language);
  if (targetIsCurrency(pkg)) return `₹${numericDisplay(value)}`;
  return cleanText(value).replaceAll("₹", "").replace(/\s{2,}/g, " ").trim();
}

function repairTargetDisplay(pkg: Avg001QuestionPackage) {
  const cleanedStem = cleanText(pkg.stem);
  const prepared: Avg001QuestionPackage = {
    ...pkg,
    stem: cleanedStem,
    explanation: { lines: pkg.explanation.lines.map(cleanText) },
  };
  const optionPairs = prepared.options.map((option) => [cleanText(option), displayForTarget(option, prepared)] as const);
  const options = optionPairs.map(([, revised]) => revised);
  const oldAnswer = cleanText(prepared.answer);
  const answer = options[prepared.correctIndex]!;
  let lines = prepared.explanation.lines;
  for (const [oldValue, newValue] of [...optionPairs].sort((left, right) => right[0].length - left[0].length)) {
    lines = lines.map((line) => replaceDisplayToken(line, oldValue, newValue));
  }
  lines = lines.map((line) => replaceDisplayToken(line, oldAnswer, answer));
  return {
    ...prepared,
    options,
    answer,
    solver: { ...prepared.solver, answer },
    independentVerification: { ...prepared.independentVerification, displayAnswer: answer },
    explanation: { lines },
  };
}

function removeDebugClauses(stem: string) {
  return stem
    .replace(/\s*एक दिया गया मान\s+-?\d+(?:\.\d+)?\s+है।/g, "")
    .replace(/\s*ਇੱਕ ਦਿੱਤਾ ਮੁੱਲ\s+-?\d+(?:\.\d+)?\s+ਹੈ।/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function stemNumbers(stem: string) {
  return [...cleanText(stem).replaceAll(",", "").matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => match[0]);
}

function englishAuthority(source: Avg001QuestionPackage) {
  const englishSource = source.language === "en"
    ? source
    : runAvg001EditorialV2Pipeline({
        questionLanguageId: source.questionLanguageId,
        seed: source.seed,
        language: "en",
      });
  return repairTargetDisplay(applyAvg001NaturalLanguageV34Final(englishSource));
}

function rebuildProblemStems(source: Avg001QuestionPackage, pkg: Avg001QuestionPackage) {
  if (pkg.language === "en") return { ...pkg, stem: removeDebugClauses(cleanText(pkg.stem)) };
  const numbers = stemNumbers(englishAuthority(source).stem);
  const hi = pkg.language === "hi";
  let stem = removeDebugClauses(cleanText(pkg.stem));

  if (pkg.questionLanguageId === "AVG-QL-079" && numbers.length >= 4) {
    const [first, next, last, difference] = numbers;
    stem = hi
      ? `समान अंतर वाले पद ${first}, ${next}, …, ${last} हैं और हर दो क्रमागत पदों का अंतर ${difference} है। इन पदों का औसत ज्ञात कीजिए।`
      : `ਬਰਾਬਰ ਅੰਤਰ ਵਾਲੇ ਪਦ ${first}, ${next}, …, ${last} ਹਨ ਅਤੇ ਹਰ ਦੋ ਲਗਾਤਾਰ ਪਦਾਂ ਦਾ ਅੰਤਰ ${difference} ਹੈ। ਇਨ੍ਹਾਂ ਪਦਾਂ ਦੀ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  } else if (pkg.questionLanguageId === "AVG-QL-302" && numbers.length >= 4) {
    const [count, oldAverage, newAverage, correctedValue] = numbers;
    const oldDisplay = groupIndianDigits(oldAverage!);
    const newDisplay = groupIndianDigits(newAverage!);
    const correctedDisplay = groupIndianDigits(correctedValue!);
    stem = hi
      ? `एक दुकान का सही दैनिक बिक्री मान ₹${correctedDisplay} है। उसे सुधारने पर ${count} दुकानों की औसत दैनिक बिक्री ₹${oldDisplay} से ₹${newDisplay} हो गई। पहले दर्ज गलत मान ज्ञात कीजिए।`
      : `ਇੱਕ ਦੁਕਾਨ ਦੀ ਸਹੀ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹${correctedDisplay} ਹੈ। ਇਸ ਨੂੰ ਠੀਕ ਕਰਨ ਉੱਤੇ ${count} ਦੁਕਾਨਾਂ ਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਵਿਕਰੀ ₹${oldDisplay} ਤੋਂ ₹${newDisplay} ਹੋ ਗਈ। ਪਹਿਲਾਂ ਦਰਜ ਗਲਤ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  } else if (pkg.questionLanguageId === "AVG-QL-308" && numbers.length >= 3) {
    const [count, oldAverage, newAverage] = numbers;
    stem = hi
      ? `${count} लोगों में एक आयु-पंजी प्रविष्टि सुधारने पर औसत आयु ${oldAverage} वर्ष से ${newAverage} वर्ष हो गई। गलत और सही आयु का अंतर ज्ञात कीजिए।`
      : `${count} ਲੋਕਾਂ ਵਿੱਚ ਇੱਕ ਉਮਰ-ਰਜਿਸਟਰ ਐਂਟਰੀ ਠੀਕ ਕਰਨ ਉੱਤੇ ਔਸਤ ਉਮਰ ${oldAverage} ਸਾਲ ਤੋਂ ${newAverage} ਸਾਲ ਹੋ ਗਈ। ਗਲਤ ਅਤੇ ਸਹੀ ਉਮਰ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
  } else if (pkg.questionLanguageId === "AVG-QL-311" && numbers.length >= 3) {
    const [count, oldAverage, newAverage] = numbers;
    stem = hi
      ? `${count} पारियों में एक स्कोर सुधारने पर बल्लेबाजी औसत ${oldAverage} रन से ${newAverage} रन हो गया। गलत और सही स्कोर का अंतर ज्ञात कीजिए।`
      : `${count} ਪਾਰੀਆਂ ਵਿੱਚ ਇੱਕ ਸਕੋਰ ਠੀਕ ਕਰਨ ਉੱਤੇ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ${oldAverage} ਦੌੜਾਂ ਤੋਂ ${newAverage} ਦੌੜਾਂ ਹੋ ਗਈ। ਗਲਤ ਅਤੇ ਸਹੀ ਸਕੋਰ ਦਾ ਅੰਤਰ ਪਤਾ ਕਰੋ।`;
  } else if (pkg.questionLanguageId === "AVG-QL-319" && numbers.length >= 3) {
    const [wrongValue, correctValue, averageChange] = numbers;
    stem = hi
      ? `एक पारी का स्कोर ${wrongValue} रन से सुधारकर ${correctValue} रन किया गया, जिससे बल्लेबाजी औसत ${averageChange} रन बदल गया। गणना में कितनी पारियाँ थीं?`
      : `ਇੱਕ ਪਾਰੀ ਦਾ ਸਕੋਰ ${wrongValue} ਦੌੜਾਂ ਤੋਂ ਠੀਕ ਕਰਕੇ ${correctValue} ਦੌੜਾਂ ਕੀਤਾ ਗਿਆ, ਜਿਸ ਨਾਲ ਬੱਲੇਬਾਜ਼ੀ ਔਸਤ ${averageChange} ਦੌੜਾਂ ਬਦਲ ਗਈ। ਗਿਣਤੀ ਵਿੱਚ ਕਿੰਨੀਆਂ ਪਾਰੀਆਂ ਸਨ?`;
  } else if (pkg.questionLanguageId === "AVG-QL-322" && numbers.length >= 3) {
    const [wrongValue, correctValue, averageChange] = numbers;
    stem = hi
      ? `एक विद्यार्थी के अंक ${wrongValue} से सुधारकर ${correctValue} किए गए, जिससे औसत ${averageChange} अंक बदल गया। गणना में कितने विद्यार्थी थे?`
      : `ਇੱਕ ਵਿਦਿਆਰਥੀ ਦੇ ਅੰਕ ${wrongValue} ਤੋਂ ਠੀਕ ਕਰਕੇ ${correctValue} ਕੀਤੇ ਗਏ, ਜਿਸ ਨਾਲ ਔਸਤ ${averageChange} ਅੰਕ ਬਦਲ ਗਈ। ਗਿਣਤੀ ਵਿੱਚ ਕਿੰਨੇ ਵਿਦਿਆਰਥੀ ਸਨ?`;
  } else if (pkg.questionLanguageId === "AVG-QL-376" && numbers.length >= 4) {
    const [count, oldAverage, factor, increase] = numbers;
    stem = hi
      ? `${count} मापों का औसत ${oldAverage} है। हर माप को ${factor} से गुणा करके उसमें ${increase} जोड़ा जाता है। नया औसत ज्ञात कीजिए।`
      : `${count} ਮਾਪਾਂ ਦੀ ਔਸਤ ${oldAverage} ਹੈ। ਹਰ ਮਾਪ ਨੂੰ ${factor} ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਉਸ ਵਿੱਚ ${increase} ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ। ਨਵੀਂ ਔਸਤ ਪਤਾ ਕਰੋ।`;
  } else if (pkg.questionLanguageId === "AVG-QL-413" && numbers.length >= 3) {
    const [average1, average2, combinedAverage] = numbers.map(groupIndianDigits);
    stem = hi
      ? `दो खाता-समूहों का औसत शेष क्रमशः ₹${average1} और ₹${average2} है। उनका संयुक्त औसत शेष ₹${combinedAverage} है। दोनों समूहों में खातों की संख्याओं का अनुपात ज्ञात कीजिए।`
      : `ਦੋ ਖਾਤਾ-ਸਮੂਹਾਂ ਦਾ ਔਸਤ ਬਕਾਇਆ ਕ੍ਰਮਵਾਰ ₹${average1} ਅਤੇ ₹${average2} ਹੈ। ਉਨ੍ਹਾਂ ਦਾ ਸੰਯੁਕਤ ਔਸਤ ਬਕਾਇਆ ₹${combinedAverage} ਹੈ। ਦੋਵਾਂ ਸਮੂਹਾਂ ਵਿੱਚ ਖਾਤਿਆਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਦਾ ਅਨੁਪਾਤ ਪਤਾ ਕਰੋ।`;
  }
  return { ...pkg, stem };
}

function hasBrokenMathJax(text: string) {
  return /(^|[^A-Za-z\\])ext\{/.test(text);
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => !check.name.startsWith("avg001-natural-language-v3-4") &&
      check.name !== "avg001-natural-language-v3-5-review",
  );
  const allText = [pkg.stem, ...pkg.options, pkg.answer, ...pkg.explanation.lines].join("\n");
  const currencyTarget = targetIsCurrency(pkg);
  const currencyValid = currencyTarget
    ? pkg.options.every((option) => /^-?₹(?!₹)/.test(option)) && /^-?₹(?!₹)/.test(pkg.answer)
    : pkg.options.every((option) => !option.includes("₹")) && !pkg.answer.includes("₹");
  const localizedCountValid = pkg.parameters.answerType !== "COUNT" || pkg.language === "en" ||
    [...pkg.options, pkg.answer].every((value) => /^-?\d[\d,]*(?:\.\d+)?$/.test(value));
  const cleanStem = !/(?:एक दिया गया मान|ਇੱਕ ਦਿੱਤਾ ਮੁੱਲ)/.test(pkg.stem);
  const cleanCurrency = !/₹₹|\d₹\d/.test(allText);
  const mathJaxValid = !hasBrokenMathJax(allText);

  checks.push({
    name: "avg001-natural-language-v3-5-review",
    passed:
      pkg.options.length === 4 &&
      new Set(pkg.options).size === 4 &&
      pkg.options[pkg.correctIndex] === pkg.answer &&
      pkg.explanation.lines.length === 4 &&
      pkg.explanation.lines[3]?.includes(pkg.answer) === true &&
      currencyValid &&
      localizedCountValid &&
      cleanStem &&
      cleanCurrency &&
      mathJaxValid,
    message:
      "V3.5 applies answer-type-aware target formatting, removes debug clauses and currency pollution, and repairs MathJax text macros",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV35Review(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const v34 = applyAvg001NaturalLanguageV34Final(source);
  const displayRepaired = repairTargetDisplay(v34);
  const stemRepaired = rebuildProblemStems(source, displayRepaired);
  const revised: Avg001QuestionPackage = {
    ...stemRepaired,
    maturity: "MANUAL_REVIEW",
    publiclyPublishable: false,
    traceability: {
      ...stemRepaired.traceability,
      naturalLanguageV35ReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_5_REVIEW,
      naturalLanguageV35PresentationAuthority: "answer-type-aware target display over frozen V3.4 mathematical objects",
      editorialStatus: "PENDING_PRODUCT_REVIEW",
      publiclyPublishable: false,
      supersedesReviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_4_REVIEW,
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
