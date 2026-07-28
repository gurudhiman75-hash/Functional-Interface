import {
  buildPnc002Cp008LocalizedPresentation as buildCandidatePresentation,
  PNC_002_CP008_LOCALIZATION_CANDIDATE,
} from "./localization-cp008";
import type {
  PncStudentExplanationSection,
  PncStudentSourcePackage,
} from "./student-presentation";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP008_LOCALIZATION_CANDIDATE };

function reviewedText(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/स्थान क्रमांकों/g, "स्थान संख्याओं")
      .replace(/स्थान-क्रमांकों/g, "स्थान संख्याओं");
  }
  return value
    .replace(/ਬੇ-ਜੋੜ/g, "ਟਾਂਕ")
    .replace(/ਜੋੜ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ/g, "ਜਿਸਤ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ")
    .replace(/ਜੋੜ ਥਾਵਾਂ/g, "ਜਿਸਤ ਥਾਵਾਂ")
    .replace(/ਥਾਵਾਂ ਦੇ ਨੰਬਰਾਂ/g, "ਥਾਂ ਨੰਬਰਾਂ")
    .replace(/ਥਾਵਾਂ ਦਾ ਨੰਬਰਾਂ/g, "ਥਾਂ ਨੰਬਰਾਂ")
    .replace(/ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ/g, "ਆਪਣੀ ਮਰਜ਼ੀ ਦੇ ਕ੍ਰਮ ਵਿੱਚ");
}

function reviewedStem(
  value: string,
  qlId: string,
  locale: PncStudentLocale,
): string {
  const stem = reviewedText(value, locale);
  if (qlId === "PNC-QL-141") {
    if (locale === "hi-IN") {
      const match = stem.match(/^(\d[\d,]*) अलग-अलग व्यक्तियों में (\d[\d,]*) निश्चित व्यक्ति हैं। इनमें से ठीक (\d[\d,]*) व्यक्ति विषम क्रमांक वाले स्थानों पर हों। कितनी व्यवस्थाएँ संभव हैं\?$/);
      if (match) {
        return `${match[1]} अलग-अलग व्यक्तियों की व्यवस्था में ठीक ${match[3]} व्यक्ति विषम क्रमांक वाले स्थानों पर हों; ये दिए गए ${match[2]} निश्चित व्यक्तियों में से हों। कितनी व्यवस्थाएँ संभव हैं?`;
      }
    } else {
      const match = stem.match(/^(\d[\d,]*) ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ (\d[\d,]*) ਖਾਸ ਵਿਅਕਤੀ ਹਨ। ਉਹਨਾਂ ਵਿੱਚੋਂ ਠੀਕ (\d[\d,]*) ਵਿਅਕਤੀ ਟਾਂਕ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ\?$/);
      if (match) {
        return `${match[1]} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਠੀਕ ${match[3]} ਵਿਅਕਤੀ ਟਾਂਕ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ; ਇਹ ਦਿੱਤੇ ${match[2]} ਖਾਸ ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ ਹੋਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
      }
    }
  }
  if (qlId === "PNC-QL-147") {
    if (locale === "hi-IN") {
      const match = stem.match(/^(\d[\d,]*) अलग-अलग व्यक्तियों में (\d[\d,]*) निश्चित व्यक्ति हैं। इनमें से कम-से-कम (\d[\d,]*) व्यक्ति विषम क्रमांक वाले स्थानों पर हों। कितनी व्यवस्थाएँ संभव हैं\?$/);
      if (match) {
        return `${match[1]} अलग-अलग व्यक्तियों की व्यवस्था में कम-से-कम ${match[3]} व्यक्ति विषम क्रमांक वाले स्थानों पर हों; ये दिए गए ${match[2]} निश्चित व्यक्तियों में से हों। कितनी व्यवस्थाएँ संभव हैं?`;
      }
    } else {
      const match = stem.match(/^(\d[\d,]*) ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਵਿੱਚ (\d[\d,]*) ਖਾਸ ਵਿਅਕਤੀ ਹਨ। ਉਹਨਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ (\d[\d,]*) ਵਿਅਕਤੀ ਟਾਂਕ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ\?$/);
      if (match) {
        return `${match[1]} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ${match[3]} ਵਿਅਕਤੀ ਟਾਂਕ ਨੰਬਰ ਵਾਲੀਆਂ ਥਾਵਾਂ ਉੱਤੇ ਹੋਣ; ਇਹ ਦਿੱਤੇ ${match[2]} ਖਾਸ ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ ਹੋਣ। ਕਿੰਨੇ ਤਰੀਕੇ ਸੰਭਵ ਹਨ?`;
      }
    }
  }
  return stem;
}

function reviewedSection(
  section: PncStudentExplanationSection,
  locale: PncStudentLocale,
): PncStudentExplanationSection {
  return {
    ...section,
    heading: reviewedText(section.heading, locale),
    lines: section.lines.map((line) => reviewedText(line, locale)),
  };
}

export function buildPnc002Cp008LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const candidate = buildCandidatePresentation(source, locale);
  return {
    ...candidate,
    stem: reviewedStem(candidate.stem, source.questionLanguageId, locale),
    optionUnit: reviewedText(candidate.optionUnit, locale),
    displayOptions: candidate.displayOptions.map((option) => reviewedText(option, locale)),
    answerLabel: reviewedText(candidate.answerLabel, locale),
    explanationSections: candidate.explanationSections.map((section) => reviewedSection(section, locale)),
  };
}
