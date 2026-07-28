import {
  buildPnc002Cp009LocalizedPresentation as buildCandidatePresentation,
  PNC_002_CP009_LOCALIZATION_CANDIDATE,
} from "./localization-cp009";
import type { PncStudentSourcePackage } from "./student-presentation";
import { buildPnc002ProductionTeacherStudentPresentation } from "./student-presentation-teacher-production";
import type {
  PncLocalizedStudentPresentation,
  PncStudentLocale,
} from "./localization-types";

export { PNC_002_CP009_LOCALIZATION_CANDIDATE };

function reviewedText(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") return value.replace(/अधिक-से-अधिक/g, "अधिकतम");
  return value
    .replace(/ਕੈਟੇਗਰੀ/g, "ਵਰਗ")
    .replace(/ਸ਼੍ਰੇਣੀ/g, "ਵਰਗ")
    .replace(/ਖੁੱਲ੍ਹੇ ਤੌਰ ਉੱਤੇ/g, "ਆਪਣੀ ਮਰਜ਼ੀ ਨਾਲ");
}

function numericTokens(value: string): string[] {
  return [...value.matchAll(/\d[\d,]*/g)].map((match) => match[0]!);
}

function mathTokens(value: string): string[] {
  return [...value.matchAll(/\$\$[\s\S]*?\$\$|\$[^$\n]+\$/g)].map((match) => match[0]!);
}

function required(values: string[], index: number, qlId: string): string {
  const value = values[index];
  if (value === undefined) throw new Error(`${qlId}: missing reviewed inverse token ${index}`);
  return value;
}

function reviewedStem(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
  fallback: string,
): string {
  if (source.questionLanguageId !== "PNC-QL-171" && source.questionLanguageId !== "PNC-QL-172") {
    return reviewedText(fallback, locale);
  }
  const english = buildPnc002ProductionTeacherStudentPresentation(source);
  const t = numericTokens(english.stem);
  const m = mathTokens(english.stem);
  const hi = locale === "hi-IN";

  if (source.questionLanguageId === "PNC-QL-171") {
    const size = required(t, 0, source.questionLanguageId);
    const target = required(t, 1, source.questionLanguageId);
    const firstUnknown = required(m, 0, source.questionLanguageId);
    const secondUnknown = required(m, 1, source.questionLanguageId);
    const range = required(m, 2, source.questionLanguageId);
    return hi
      ? `${size} सदस्यों की समिति में एक निश्चित व्यक्ति अनिवार्य है। यदि कुल व्यक्तियों की संख्या ${firstUnknown} है और समिति ${target} तरीकों से बनती है, तो ${secondUnknown} ज्ञात कीजिए, जहाँ ${range}।`
      : `${size} ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਵਿੱਚ ਇੱਕ ਖਾਸ ਵਿਅਕਤੀ ਲਾਜ਼ਮੀ ਹੈ। ਜੇ ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ${firstUnknown} ਹੈ ਅਤੇ ਕਮੇਟੀ ${target} ਤਰੀਕਿਆਂ ਨਾਲ ਬਣਦੀ ਹੈ, ਤਾਂ ${secondUnknown} ਪਤਾ ਕਰੋ, ਜਿੱਥੇ ${range}।`;
  }

  const size = required(t, 0, source.questionLanguageId);
  const categoryB = required(t, 1, source.questionLanguageId);
  const requiredFromA = required(t, 2, source.questionLanguageId);
  const target = required(t, 3, source.questionLanguageId);
  const firstUnknown = required(m, 0, source.questionLanguageId);
  const secondUnknown = required(m, 1, source.questionLanguageId);
  const range = required(m, 2, source.questionLanguageId);
  return hi
    ? `${size} सदस्यों की समिति वर्ग A के ${firstUnknown} और वर्ग B के ${categoryB} सदस्यों में से बनानी है। वर्ग A से ठीक ${requiredFromA} सदस्य लेने पर चयन ${target} तरीकों से होता है। ${secondUnknown} ज्ञात कीजिए, जहाँ ${range}।`
    : `${size} ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਵਰਗ A ਦੇ ${firstUnknown} ਅਤੇ ਵਰਗ B ਦੇ ${categoryB} ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਬਣਾਉਣੀ ਹੈ। ਵਰਗ A ਤੋਂ ਠੀਕ ${requiredFromA} ਮੈਂਬਰ ਲੈਣ ਉੱਤੇ ਚੋਣ ${target} ਤਰੀਕਿਆਂ ਨਾਲ ਹੁੰਦੀ ਹੈ। ${secondUnknown} ਪਤਾ ਕਰੋ, ਜਿੱਥੇ ${range}।`;
}

export function buildPnc002Cp009LocalizedPresentation(
  source: PncStudentSourcePackage,
  locale: PncStudentLocale,
): PncLocalizedStudentPresentation {
  const candidate = buildCandidatePresentation(source, locale);
  return {
    ...candidate,
    stem: reviewedStem(source, locale, candidate.stem),
    optionUnit: reviewedText(candidate.optionUnit, locale),
    displayOptions: candidate.displayOptions.map((option) => reviewedText(option, locale)),
    answerLabel: reviewedText(candidate.answerLabel, locale),
    explanationSections: candidate.explanationSections.map((section) => ({
      ...section,
      heading: reviewedText(section.heading, locale),
      lines: section.lines.map((line) => reviewedText(line, locale)),
    })),
  };
}
