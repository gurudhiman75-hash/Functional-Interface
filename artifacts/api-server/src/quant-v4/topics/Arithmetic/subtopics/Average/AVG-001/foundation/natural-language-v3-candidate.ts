import { applyAvg001NaturalLanguageV3Final } from "./natural-language-v3-final";
import { buildAvg001AuthorityDistractorLine } from "./natural-language-v3-distractor-authority";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

export const AVG_001_NATURAL_LANGUAGE_V3_CANDIDATE =
  "AVG-001 natural teacher-language manual-review candidate v3.1";

const HINDI_LABELS: Readonly<Record<string, string>> = {
  "Endpoint mean": "सिरों का औसत",
  "middle term": "मध्य पद",
  "Old total": "पुराना कुल",
  "new average": "नया औसत",
  "New average": "नया औसत",
  "Added value": "जोड़ा गया मान",
  "Removed value": "हटाया गया मान",
  "Total change": "कुल बदलाव",
  "old value": "पुराना मान",
  "new value": "नया मान",
  "Required runs": "आवश्यक रन",
  "Original count": "मूल संख्या",
  "Combined average": "संयुक्त औसत",
  "Missing average": "लापता औसत",
  "Missing count": "लापता संख्या",
  "Subgroup total": "उपसमूह का कुल",
  "Overall total": "कुल योग",
  "Steps on one side": "एक ओर के अंतराल",
  "Required term": "आवश्यक पद",
};

const PUNJABI_LABELS: Readonly<Record<string, string>> = {
  "Endpoint mean": "ਸਿਰਿਆਂ ਦੀ ਔਸਤ",
  "middle term": "ਮੱਧਲਾ ਪਦ",
  "Old total": "ਪੁਰਾਣਾ ਕੁੱਲ",
  "new average": "ਨਵੀਂ ਔਸਤ",
  "New average": "ਨਵੀਂ ਔਸਤ",
  "Added value": "ਜੋੜਿਆ ਮੁੱਲ",
  "Removed value": "ਹਟਾਇਆ ਮੁੱਲ",
  "Total change": "ਕੁੱਲ ਬਦਲਾਅ",
  "old value": "ਪੁਰਾਣਾ ਮੁੱਲ",
  "new value": "ਨਵਾਂ ਮੁੱਲ",
  "Required runs": "ਲੋੜੀਂਦੀਆਂ ਦੌੜਾਂ",
  "Original count": "ਮੂਲ ਗਿਣਤੀ",
  "Combined average": "ਸੰਯੁਕਤ ਔਸਤ",
  "Missing average": "ਗੁੰਮ ਔਸਤ",
  "Missing count": "ਗੁੰਮ ਗਿਣਤੀ",
  "Subgroup total": "ਉਪ-ਸਮੂਹ ਦਾ ਕੁੱਲ",
  "Overall total": "ਕੁੱਲ ਜੋੜ",
  "Steps on one side": "ਇੱਕ ਪਾਸੇ ਦੇ ਅੰਤਰਾਲ",
  "Required term": "ਲੋੜੀਂਦਾ ਪਦ",
};

function normalizeMathEscapes(text: string) {
  return text
    .replace(/\text\{/g, "\\text{")
    .replace(/\times/g, "\\times")
    .replace(/(?<!\\)\bdiv\b/g, "\\div")
    .replace(/(?<!\\)\bquad\b/g, "\\quad");
}

function localizeMathText(
  text: string,
  labels: Readonly<Record<string, string>> | null,
) {
  const normalized = normalizeMathEscapes(text);
  if (!labels) return normalized;
  return normalized.replace(/\\text\{([^{}]+)\}/g, (full, label: string) => {
    const localized = labels[label];
    return localized ? `\\text{${localized}}` : full;
  });
}

function contextualFallback(source: Avg001QuestionPackage) {
  if (source.solveMode === "findMissingValueFromAverage") {
    if (source.language === "hi") return "आवश्यक कुल में से ज्ञात कुल सही तरह नहीं घटाता";
    if (source.language === "pa") return "ਲੋੜੀਂਦੇ ਕੁੱਲ ਵਿੱਚੋਂ ਜਾਣਿਆ ਕੁੱਲ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਘਟਾਉਂਦਾ";
    return "does not subtract the known total from the required total correctly";
  }
  if (source.canonicalProblemId === "AVG-CP-004" || source.canonicalProblemId === "AVG-CP-006") {
    if (source.language === "hi") return "समूहों के कुल और उनकी संख्याएँ सही तरह नहीं जोड़ता";
    if (source.language === "pa") return "ਸਮੂਹਾਂ ਦੇ ਕੁੱਲ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀਆਂ ਗਿਣਤੀਆਂ ਠੀਕ ਤਰ੍ਹਾਂ ਨਹੀਂ ਜੋੜਦਾ";
    return "does not combine the group totals and counts correctly";
  }
  if (source.canonicalProblemId === "AVG-CP-005") {
    if (source.language === "hi") return "कुल में हुए सुधार को सही दिशा में नहीं लगाता";
    if (source.language === "pa") return "ਕੁੱਲ ਵਿੱਚ ਹੋਏ ਸੁਧਾਰ ਨੂੰ ਸਹੀ ਦਿਸ਼ਾ ਵਿੱਚ ਨਹੀਂ ਲਗਾਉਂਦਾ";
    return "does not apply the correction to the total correctly";
  }
  if (source.language === "hi") return "दिखाई गई पूरी गणना का पालन नहीं करता";
  if (source.language === "pa") return "ਦਿਖਾਈ ਗਈ ਪੂਰੀ ਗਣਨਾ ਦੀ ਪਾਲਣਾ ਨਹੀਂ ਕਰਦਾ";
  return "does not follow the complete calculation shown above";
}

function refineGenericDistractorReason(
  line: string,
  source: Avg001QuestionPackage,
) {
  const replacement = contextualFallback(source);
  return line
    .replaceAll("contains a small arithmetic error", replacement)
    .replaceAll("गणना में छोटी गलती करता है", replacement)
    .replaceAll("ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ", replacement);
}

function refreshValidation(pkg: Avg001QuestionPackage) {
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter(
    (check) => check.name !== "avg001-natural-language-v3-localized-math-labels",
  );
  const learnerText = [pkg.stem, ...pkg.options, ...pkg.explanation.lines].join("\n");
  checks.push({
    name: "avg001-natural-language-v3-localized-math-labels",
    passed:
      !/\text\{|\times/.test(learnerText) &&
      (
        pkg.language === "en" ||
        !/\\text\{(?:Endpoint mean|middle term|Old total|new average|New average|Added value|Removed value|Total change|old value|new value|Required runs|Original count|Combined average|Missing average|Missing count|Subgroup total|Overall total|Steps on one side|Required term)\}/.test(learnerText)
      ),
    message: "Displayed calculations preserve MathJax escapes and use localized labels in Hindi and Punjabi",
  });
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001NaturalLanguageV3Candidate(
  source: Avg001QuestionPackage,
): Avg001QuestionPackage {
  const base = applyAvg001NaturalLanguageV3Final(source);
  const labels = base.language === "hi"
    ? HINDI_LABELS
    : base.language === "pa"
      ? PUNJABI_LABELS
      : null;
  const localizedLines = base.explanation.lines.map((line) => localizeMathText(line, labels));
  const localized: Avg001QuestionPackage = {
    ...base,
    explanation: { lines: localizedLines },
    traceability: {
      ...base.traceability,
      naturalLanguageReviewCandidateFinal: AVG_001_NATURAL_LANGUAGE_V3_CANDIDATE,
    },
  };
  const distractorLine = refineGenericDistractorReason(
    buildAvg001AuthorityDistractorLine(source, localized),
    source,
  );
  const revised: Avg001QuestionPackage = {
    ...localized,
    explanation: {
      lines: [
        localized.explanation.lines[0]!,
        localized.explanation.lines[1]!,
        localized.explanation.lines[2]!,
        distractorLine,
      ],
    },
  };
  return { ...revised, validation: refreshValidation(revised) };
}
