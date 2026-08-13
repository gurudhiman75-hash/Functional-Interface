import type { AuditCaselet, AuditChild, AuditOption } from "../saturation/corpus.ts";
import type { Sea001TranslatedLocale } from "./readiness.ts";
import {
  localizeSea001LearnerText,
  localizeSea001ReviewCaselet,
  type Sea001LocalizedReviewCaselet,
} from "./candidate-localizer.ts";

const FINAL_WORDS: Readonly<Record<string, readonly [string, string]>> = Object.freeze({
  clue: ["संकेत", "ਸੰਕੇਤ"],
  clues: ["संकेत", "ਸੰਕੇਤ"],
  seat: ["सीट", "ਸੀਟ"],
  seats: ["सीटें", "ਸੀਟਾਂ"],
  person: ["व्यक्ति", "ਵਿਅਕਤੀ"],
  persons: ["व्यक्ति", "ਵਿਅਕਤੀ"],
  left: ["बायाँ", "ਖੱਬਾ"],
  right: ["दायाँ", "ਸੱਜਾ"],
  clockwise: ["घड़ी की दिशा में", "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ"],
  anticlockwise: ["घड़ी की विपरीत दिशा में", "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ"],
  centre: ["केंद्र", "ਕੇਂਦਰ"],
  center: ["केंद्र", "ਕੇਂਦਰ"],
  outward: ["बाहर की ओर", "ਬਾਹਰ ਵੱਲ"],
  north: ["उत्तर", "ਉੱਤਰ"],
  south: ["दक्षिण", "ਦੱਖਣ"],
  opposite: ["सामने", "ਸਾਹਮਣੇ"],
  adjacent: ["पास-पास", "ਨਾਲ-ਨਾਲ"],
  neighbour: ["पड़ोसी", "ਗੁਆਂਢੀ"],
  neighbours: ["पड़ोसी", "ਗੁਆਂਢੀ"],
  between: ["बीच में", "ਵਿਚਕਾਰ"],
  facing: ["मुख-दिशा", "ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ"],
  faces: ["मुख किए है", "ਮੂੰਹ ਕਰਕੇ ਹੈ"],
  face: ["मुख किए हैं", "ਮੂੰਹ ਕਰਕੇ ਹਨ"],
  row: ["पंक्ति", "ਕਤਾਰ"],
  circle: ["गोल व्यवस्था", "ਗੋਲ ਵਿਵਸਥਾ"],
  immediately: ["ठीक", "ਬਿਲਕੁਲ"],
  direction: ["दिशा", "ਦਿਸ਼ਾ"],
  directions: ["दिशाएँ", "ਦਿਸ਼ਾਵਾਂ"],
  question: ["प्रश्न", "ਸਵਾਲ"],
  answer: ["उत्तर", "ਉੱਤਰ"],
  option: ["विकल्प", "ਵਿਕਲਪ"],
  statement: ["कथन", "ਕਥਨ"],
  case: ["स्थिति", "ਸਥਿਤੀ"],
  step: ["चरण", "ਕਦਮ"],
});

function localeValue(locale: Sea001TranslatedLocale, values: readonly [string, string]): string {
  return locale === "hi-IN" ? values[0] : values[1];
}

function replaceWholeWord(text: string, word: string, replacement: string): string {
  return text.replace(new RegExp(`\\b${word}\\b`, "gi"), replacement);
}

export function polishSea001LocalizedReviewText(text: string, locale: Sea001TranslatedLocale): string {
  let output = localizeSea001LearnerText(text, locale);
  for (const [word, values] of Object.entries(FINAL_WORDS)) {
    output = replaceWholeWord(output, word, localeValue(locale, values));
  }

  if (locale === "hi-IN") {
    output = output
      .replaceAll("बैठेंting", "बैठे")
      .replaceAll("स्थानs", "स्थान")
      .replaceAll("तरीकाs", "तरीके")
      .replaceAll("व्यक्तिs", "व्यक्ति")
      .replaceAll("सीटs", "सीटें")
      .replaceAll("दिशाs", "दिशाएँ")
      .replaceAll("पड़ोसीs", "पड़ोसी")
      .replaceAll("गोल व्यवस्थाs", "गोल व्यवस्थाएँ");
  } else {
    output = output
      .replaceAll("ਬੈਠੋting", "ਬੈਠੇ")
      .replaceAll("ਥਾਂs", "ਥਾਵਾਂ")
      .replaceAll("ਤਰੀਕਾs", "ਤਰੀਕੇ")
      .replaceAll("ਵਿਅਕਤੀs", "ਵਿਅਕਤੀ")
      .replaceAll("ਸੀਟs", "ਸੀਟਾਂ")
      .replaceAll("ਦਿਸ਼ਾs", "ਦਿਸ਼ਾਵਾਂ")
      .replaceAll("ਗੁਆਂਢੀs", "ਗੁਆਂਢੀ")
      .replaceAll("ਗੋਲ ਵਿਵਸਥਾs", "ਗੋਲ ਵਿਵਸਥਾਵਾਂ");
  }

  return output.replace(/ {2,}/g, " ").replace(/ \./g, ".").trim();
}

function polishOption(option: AuditOption, locale: Sea001TranslatedLocale): AuditOption {
  return {
    ...option,
    display: polishSea001LocalizedReviewText(option.display, locale),
    explanation: polishSea001LocalizedReviewText(option.explanation, locale),
  };
}

function polishChild(child: AuditChild, locale: Sea001TranslatedLocale): AuditChild {
  return {
    ...child,
    text: polishSea001LocalizedReviewText(child.text, locale),
    explanation: polishSea001LocalizedReviewText(child.explanation, locale),
    options: child.options.map((option) => polishOption(option, locale)),
  };
}

export function buildSea001LocalizedReviewCandidate(
  canonical: AuditCaselet,
  locale: Sea001TranslatedLocale,
): Sea001LocalizedReviewCaselet {
  const firstPass = localizeSea001ReviewCaselet(canonical, locale);
  const diagramText = firstPass.diagramText
    ? polishSea001LocalizedReviewText(firstPass.diagramText, locale)
    : firstPass.diagramText;
  const diagram = firstPass.diagram
    ? {
        ...firstPass.diagram,
        text: firstPass.diagram.text
          ? polishSea001LocalizedReviewText(firstPass.diagram.text, locale)
          : firstPass.diagram.text,
      }
    : firstPass.diagram;

  return {
    ...firstPass,
    setupText: polishSea001LocalizedReviewText(firstPass.setupText, locale),
    clueTexts: firstPass.clueTexts.map((clue) => polishSea001LocalizedReviewText(clue, locale)),
    sharedExplanation: polishSea001LocalizedReviewText(firstPass.sharedExplanation, locale),
    diagramText,
    diagram,
    children: firstPass.children.map((child) => polishChild(child, locale)),
  };
}
