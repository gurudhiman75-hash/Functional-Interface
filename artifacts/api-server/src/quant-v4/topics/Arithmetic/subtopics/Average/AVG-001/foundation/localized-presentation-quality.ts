import { applyAvg001Cp003ExplanationAuthorship } from "./cp003-explanation-authorship";
import { applyAvg001Cp003LocalizedStemAuthorship } from "./cp003-localized-stem-authorship";
import { applyAvg001HumanAuthoredExplanation } from "./human-authored-explanation-final";
import type { Avg001QuestionPackage, Avg001ValidationCheck } from "./types";

type PilotLanguage = "hi" | "pa";

const HI_UNNATURAL = /(?:[\d,.]+ का एक मान समूह|एक नया सदस्य शामिल होने पर|हटाए गए सदस्य का मान|एक सदस्य हटने पर|अंक का एक स्कोर|उत्पादन-श्रृंखला|मूल्य-श्रृंखला|स्कोर-श्रृंखला|दूरी-श्रृंखला|बीच का संख्या|सबसे बड़ा संख्या|सबसे छोटा संख्या|समूह का पहला मान|संख्याएँ के|मान का पहला मान|आँकड़े की संख्या|परीक्षा-अंक की संख्या|मानों का औसत [^।]+। इसमें|एक और कीमत शामिल|एक परीक्षा का परिणाम हटाने|वजनों का औसत|दर्ज राशियों का औसत|औसत [\d,.]+ इकाइयाँ हो जाता है|औसत [\d,.]+ रन हो जाता है)/;
const PA_UNNATURAL = /(?:[\d,.]+ ਦਾ ਇੱਕ ਮੁੱਲ ਸਮੂਹ|ਇੱਕ ਨਵਾਂ ਮੈਂਬਰ ਸ਼ਾਮਲ ਹੋਣ ਉੱਤੇ|ਹਟਾਏ ਗਏ ਮੈਂਬਰ ਦਾ ਮੁੱਲ|ਇੱਕ ਮੈਂਬਰ ਹਟਣ ਉੱਤੇ|ਅੰਕ ਦਾ ਇੱਕ ਸਕੋਰ|ਉਤਪਾਦਨ ਲੜੀ|ਕੀਮਤਾਂ ਦੀ ਲੜੀ|ਸਕੋਰ ਲੜੀ|ਦੂਰੀ ਲੜੀ|ਵਿਚਕਾਰਲਾ ਸੰਖਿਆ|ਸਭ ਤੋਂ ਵੱਡਾ ਸੰਖਿਆ|ਸਭ ਤੋਂ ਛੋਟਾ ਸੰਖਿਆ|ਸਮੂਹ ਦਾ ਪਹਿਲਾ ਮੁੱਲ|ਅੰਕੜੇ ਦੀ ਗਿਣਤੀ|ਪ੍ਰੀਖਿਆ ਅੰਕ ਦੀ ਗਿਣਤੀ|ਮੁੱਲਾਂ ਦੀ ਔਸਤ [^।]+। ਇਸ ਵਿੱਚ|ਇੱਕ ਹੋਰ ਕੀਮਤ ਸ਼ਾਮਲ|ਇੱਕ ਪ੍ਰੀਖਿਆ ਦਾ ਨਤੀਜਾ ਹਟਾਉਣ|ਵਜ਼ਨਾਂ ਦੀ ਔਸਤ|ਦਰਜ ਰਕਮਾਂ ਦੀ ਔਸਤ|ਔਸਤ [\d,.]+ ਇਕਾਈਆਂ ਹੋ ਜਾਂਦੀ ਹੈ|ਔਸਤ [\d,.]+ ਦੌੜਾਂ ਹੋ ਜਾਂਦੀ ਹੈ)/;

function refreshValidation(pkg: Avg001QuestionPackage, language: PilotLanguage) {
  const replaced = new Set([
    "localized-script",
    "localized-stem",
    "localized-explanation",
    "localized-context-naturalness",
    "localized-explanation-authorship",
  ]);
  const checks: Avg001ValidationCheck[] = pkg.validation.checks.filter((check) => !replaced.has(check.name));
  const text = `${pkg.stem}\n${pkg.explanation.lines.join("\n")}`;
  const prose = pkg.explanation.lines.join("\n").replace(/\$\$[\s\S]*?\$\$/g, "");
  const devanagariLetters = /[\u0900-\u0963\u0970-\u097F]/;
  const gurmukhiLetters = /[\u0A01-\u0A74]/;
  const expectedScript = language === "hi" ? devanagariLetters : gurmukhiLetters;
  const wrongScript = language === "hi" ? gurmukhiLetters : devanagariLetters;
  const unnatural = language === "hi" ? HI_UNNATURAL : PA_UNNATURAL;
  const cp003Authored =
    pkg.canonicalProblemId !== "AVG-CP-003" ||
    pkg.traceability.cp003ExplanationAuthorship === "AVG-CP-003 context-authored explanations v1";

  checks.push(
    {
      name: "localized-script",
      passed: expectedScript.test(pkg.stem) && expectedScript.test(prose) && !wrongScript.test(text),
      message: "Localized stem and prose use the expected Indic script",
    },
    {
      name: "localized-stem",
      passed: !/[{}]|undefined|NaN|Infinity|null|[A-Za-z]/.test(pkg.stem),
      message: "Localized stem is fully rendered without Latin fallback",
    },
    {
      name: "localized-context-naturalness",
      passed: !unnatural.test(pkg.stem),
      message: "Localized stem avoids generic member/value wording, artificial labels and known grammar errors",
    },
    {
      name: "localized-explanation",
      passed:
        pkg.explanation.lines.length >= 4 &&
        pkg.explanation.lines.length <= 8 &&
        pkg.explanation.lines.some((line) => line.includes(pkg.answer)) &&
        pkg.explanation.lines.some((line) => /\\times|\\div|×|÷|\+|-|=/.test(line)),
      message: "Localized explanation contains meaningful reasoning, arithmetic and answer evidence",
    },
    {
      name: "localized-explanation-authorship",
      passed:
        pkg.traceability.explanationAuthorship === "AVG-001 deterministic human-authored presentation v2" &&
        typeof pkg.traceability.explanationOpeningVariant === "number" &&
        typeof pkg.traceability.explanationConclusionVariant === "number" &&
        cp003Authored,
      message: "Localized explanation uses context-authored prose with deterministic arithmetic",
    },
  );
  return { valid: checks.every((check) => check.passed), checks };
}

export function applyAvg001LocalizedPresentationQuality(
  pkg: Avg001QuestionPackage,
  language: PilotLanguage,
): Avg001QuestionPackage {
  const polishedStem = applyAvg001Cp003LocalizedStemAuthorship(pkg, language);
  const humanized = applyAvg001HumanAuthoredExplanation(polishedStem);
  const contextAuthored = applyAvg001Cp003ExplanationAuthorship(humanized);
  return { ...contextAuthored, validation: refreshValidation(contextAuthored, language) };
}
