import type { Avg001QuestionPackage } from "./types";

type LocalizedLanguage = "hi" | "pa";
type OpeningTemplate = (concept: string, target: string) => string;

const HI_TARGETS = {
  ABSOLUTE: "कुल",
  COUNT: "संख्या",
  AVERAGE: "औसत",
  DIFFERENCE: "अंतर",
  RATIO: "अनुपात",
  MEMBER_VALUE: "लापता मान",
} as const;

const PA_TARGETS = {
  ABSOLUTE: "ਕੁੱਲ",
  COUNT: "ਗਿਣਤੀ",
  AVERAGE: "ਔਸਤ",
  DIFFERENCE: "ਫਰਕ",
  RATIO: "ਅਨੁਪਾਤ",
  MEMBER_VALUE: "ਗੁੰਮ ਮੁੱਲ",
} as const;

const HI_OPENINGS: readonly OpeningTemplate[] = [
  (concept) => `${concept}।`,
  (concept, target) => `${target} निकालने के लिए ${concept}।`,
  (concept, target) => `${target} की गणना में ${concept}।`,
  (concept, target) => `${target} ज्ञात करने का आधार है: ${concept}।`,
  (concept, target) => `${target} के लिए पहले ${concept}।`,
  (concept, target) => `${target} निकालते समय ${concept}।`,
  (concept, target) => `${target} की गणना इस तथ्य से शुरू होती है: ${concept}।`,
  (concept, target) => `${target} पाने के लिए ${concept}।`,
  (concept, target) => `${target} निकालने का पहला चरण है: ${concept}।`,
  (concept, target) => `${target} के लिए यह संबंध लगाएँ: ${concept}।`,
  (concept, target) => `${target} निकालने में मुख्य तथ्य है: ${concept}।`,
  (concept, target) => `${target} की गणना का आधार लें: ${concept}।`,
  (concept, target) => `${target} ज्ञात करने हेतु ${concept}।`,
  (concept, target) => `${target} निकालने का सीधा तरीका है: ${concept}।`,
  (concept, target) => `${target} के लिए गणना यहाँ से शुरू करें: ${concept}।`,
  (concept, target) => `${target} प्राप्त करने के लिए ${concept}।`,
  (concept, target) => `${target} का मान इस संबंध से निकालें: ${concept}।`,
  (concept, target) => `${target} की गणना में पहले यह तथ्य लें: ${concept}।`,
  (concept, target) => `${target} तक पहुँचने का पहला चरण है: ${concept}।`,
  (concept, target) => `${target} के लिए आवश्यक संबंध है: ${concept}।`,
  (concept, target) => `${target} की गणना सीधे इस तथ्य पर करें: ${concept}।`,
  (concept, target) => `${target} ज्ञात करने से पहले ${concept}।`,
  (concept, target) => `${target} निकालने का आरंभिक संबंध है: ${concept}।`,
];

const PA_OPENINGS: readonly OpeningTemplate[] = [
  (concept) => `${concept}।`,
  (concept, target) => `${target} ਕੱਢਣ ਲਈ ${concept}।`,
  (concept, target) => `${target} ਦੀ ਗਣਨਾ ਵਿੱਚ ${concept}।`,
  (concept, target) => `${target} ਪਤਾ ਕਰਨ ਦਾ ਆਧਾਰ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਲਈ ਪਹਿਲਾਂ ${concept}।`,
  (concept, target) => `${target} ਕੱਢਦੇ ਸਮੇਂ ${concept}।`,
  (concept, target) => `${target} ਦੀ ਗਣਨਾ ਇਸ ਤੱਥ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਲੈਣ ਲਈ ${concept}।`,
  (concept, target) => `${target} ਕੱਢਣ ਦਾ ਪਹਿਲਾ ਕਦਮ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਲਈ ਇਹ ਸੰਬੰਧ ਵਰਤੋ: ${concept}।`,
  (concept, target) => `${target} ਕੱਢਣ ਦਾ ਮੁੱਖ ਤੱਥ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਦੀ ਗਣਨਾ ਦਾ ਆਧਾਰ ਲਵੋ: ${concept}।`,
  (concept, target) => `${target} ਪਤਾ ਕਰਨ ਲਈ ${concept}।`,
  (concept, target) => `${target} ਕੱਢਣ ਦਾ ਸਿੱਧਾ ਤਰੀਕਾ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਲਈ ਗਣਨਾ ਇੱਥੋਂ ਸ਼ੁਰੂ ਕਰੋ: ${concept}।`,
  (concept, target) => `${target} ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ${concept}।`,
  (concept, target) => `${target} ਦਾ ਮੁੱਲ ਇਸ ਸੰਬੰਧ ਨਾਲ ਕੱਢੋ: ${concept}।`,
  (concept, target) => `${target} ਦੀ ਗਣਨਾ ਵਿੱਚ ਪਹਿਲਾਂ ਇਹ ਤੱਥ ਲਵੋ: ${concept}।`,
  (concept, target) => `${target} ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਪਹਿਲਾ ਕਦਮ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਲਈ ਲੋੜੀਂਦਾ ਸੰਬੰਧ ਹੈ: ${concept}।`,
  (concept, target) => `${target} ਦੀ ਗਣਨਾ ਸਿੱਧੀ ਇਸ ਤੱਥ ਉੱਤੇ ਕਰੋ: ${concept}।`,
  (concept, target) => `${target} ਪਤਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ${concept}।`,
  (concept, target) => `${target} ਕੱਢਣ ਦਾ ਸ਼ੁਰੂਆਤੀ ਸੰਬੰਧ ਹੈ: ${concept}।`,
];

function stripClosingPunctuation(value: string) {
  return value.trim().replace(/[.!?।]+$/u, "");
}

function targetFor(pkg: Avg001QuestionPackage, language: LocalizedLanguage) {
  const targets = language === "hi" ? HI_TARGETS : PA_TARGETS;
  return targets[pkg.parameters.answerType];
}

export function finalizeAvg001LocalizedExplanationOpeningVariant(
  pkg: Avg001QuestionPackage,
): Avg001QuestionPackage {
  if (pkg.language !== "hi" && pkg.language !== "pa") return pkg;

  const lines = [...pkg.explanation.lines];
  if (lines.length === 0) return pkg;

  const variant = Number(pkg.traceability.explanationOpeningVariant);
  const openings = pkg.language === "hi" ? HI_OPENINGS : PA_OPENINGS;
  if (!Number.isInteger(variant) || variant < 0 || variant >= openings.length) return pkg;

  const concept = stripClosingPunctuation(lines[0]);
  const opening = openings[variant];
  if (!opening) return pkg;

  lines[0] = opening(concept, targetFor(pkg, pkg.language));
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}
