import type { Avg001QuestionPackage } from "./types";

type OpeningTemplate = (concept: string) => string;

const HI_OPENINGS: readonly OpeningTemplate[] = [
  (concept) => `${concept}।`,
  (concept) => `यहाँ ${concept}।`,
  (concept) => `सीधा नियम है: ${concept}।`,
  (concept) => `गणना का आधार है: ${concept}।`,
  (concept) => `पहले यह संबंध लें: ${concept}।`,
  (concept) => `हल शुरू करते समय ${concept}।`,
  (concept) => `मुख्य गणितीय तथ्य है: ${concept}।`,
  (concept) => `आरंभ में यह संबंध लें: ${concept}।`,
  (concept) => `पहली गणना का नियम है: ${concept}।`,
  (concept) => `इस स्थिति में ${concept}।`,
  (concept) => `सीधे हल के लिए ${concept}।`,
  (concept) => `अगली गणना से पहले ${concept}।`,
  (concept) => `पहला गणितीय संबंध है: ${concept}।`,
  (concept) => `इस प्रश्न में उपयोगी नियम है: ${concept}।`,
  (concept) => `मान रखने से पहले ${concept}।`,
  (concept) => `हल का आधार यह है: ${concept}।`,
  (concept) => `गणना शुरू करते हुए ${concept}।`,
  (concept) => `इस चरण का नियम है: ${concept}।`,
  (concept) => `प्रारंभ में ध्यान दें: ${concept}।`,
  (concept) => `यहाँ आवश्यक नियम है: ${concept}।`,
  (concept) => `सीधी गणना का नियम है: ${concept}।`,
  (concept) => `पहले यह गणितीय संबंध तय करें: ${concept}।`,
  (concept) => `हल के पहले चरण का आधार है: ${concept}।`,
];

const PA_OPENINGS: readonly OpeningTemplate[] = [
  (concept) => `${concept}।`,
  (concept) => `ਇੱਥੇ ${concept}।`,
  (concept) => `ਸਿੱਧਾ ਨਿਯਮ ਹੈ: ${concept}।`,
  (concept) => `ਗਣਨਾ ਦਾ ਆਧਾਰ ਹੈ: ${concept}।`,
  (concept) => `ਪਹਿਲਾਂ ਇਹ ਸੰਬੰਧ ਲਵੋ: ${concept}।`,
  (concept) => `ਹੱਲ ਸ਼ੁਰੂ ਕਰਦੇ ਸਮੇਂ ${concept}।`,
  (concept) => `ਮੁੱਖ ਗਣਿਤਕ ਤੱਥ ਹੈ: ${concept}।`,
  (concept) => `ਸ਼ੁਰੂ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਲਵੋ: ${concept}।`,
  (concept) => `ਪਹਿਲੀ ਗਣਨਾ ਦਾ ਨਿਯਮ ਹੈ: ${concept}।`,
  (concept) => `ਇਸ ਸਥਿਤੀ ਵਿੱਚ ${concept}।`,
  (concept) => `ਸਿੱਧੇ ਹੱਲ ਲਈ ${concept}।`,
  (concept) => `ਅਗਲੀ ਗਣਨਾ ਤੋਂ ਪਹਿਲਾਂ ${concept}।`,
  (concept) => `ਪਹਿਲਾ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ: ${concept}।`,
  (concept) => `ਇਸ ਸਵਾਲ ਵਿੱਚ ਲਾਭਦਾਇਕ ਨਿਯਮ ਹੈ: ${concept}।`,
  (concept) => `ਮੁੱਲ ਰੱਖਣ ਤੋਂ ਪਹਿਲਾਂ ${concept}।`,
  (concept) => `ਹੱਲ ਦਾ ਆਧਾਰ ਇਹ ਹੈ: ${concept}।`,
  (concept) => `ਗਣਨਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ ${concept}।`,
  (concept) => `ਇਸ ਪੜਾਅ ਦਾ ਨਿਯਮ ਹੈ: ${concept}।`,
  (concept) => `ਸ਼ੁਰੂ ਵਿੱਚ ਧਿਆਨ ਦਿਓ: ${concept}।`,
  (concept) => `ਇੱਥੇ ਲੋੜੀਂਦਾ ਨਿਯਮ ਹੈ: ${concept}।`,
  (concept) => `ਸਿੱਧੀ ਗਣਨਾ ਦਾ ਨਿਯਮ ਹੈ: ${concept}।`,
  (concept) => `ਪਹਿਲਾਂ ਇਹ ਗਣਿਤਕ ਸੰਬੰਧ ਤੈਅ ਕਰੋ: ${concept}।`,
  (concept) => `ਹੱਲ ਦੇ ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਆਧਾਰ ਹੈ: ${concept}।`,
];

function stripClosingPunctuation(value: string) {
  return value.trim().replace(/[.!?।]+$/u, "");
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

  lines[0] = opening(concept);
  return {
    ...pkg,
    explanation: {
      ...pkg.explanation,
      lines,
    },
  };
}
