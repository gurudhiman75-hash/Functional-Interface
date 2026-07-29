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

function simplifyOpening(value: string, locale: PncStudentLocale): string {
  if (locale === "hi-IN") {
    return value
      .replace(/^(\d[\d,]*) सदस्यों की समिति (\d[\d,]*) व्यक्तियों में से (?:बनानी|चुननी) है।/, "समिति में $1 सदस्य होंगे। चयन $2 व्यक्तियों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) खिलाड़ियों की टीम (\d[\d,]*) खिलाड़ियों में से चुननी है।/, "टीम में $1 खिलाड़ी होंगे। चयन $2 खिलाड़ियों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों का पैनल (\d[\d,]*) उम्मीदवारों में से चुनना है।/, "पैनल में $1 सदस्य होंगे। चयन $2 उम्मीदवारों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति (\d[\d,]*) महिलाओं और (\d[\d,]*) पुरुषों में से बनानी है।/, "समिति में $1 सदस्य होंगे। चयन $2 महिलाओं और $3 पुरुषों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति (\d[\d,]*) पुरुषों और (\d[\d,]*) महिलाओं में से बनानी है।/, "समिति में $1 सदस्य होंगे। चयन $2 पुरुषों और $3 महिलाओं में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति (\d[\d,]*) शिक्षकों और (\d[\d,]*) विद्यार्थियों में से बनानी है।/, "समिति में $1 सदस्य होंगे। चयन $2 शिक्षकों और $3 विद्यार्थियों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों का प्रोजेक्ट समूह (\d[\d,]*) इंजीनियरों और (\d[\d,]*) विश्लेषकों में से चुनना है।/, "प्रोजेक्ट समूह में $1 सदस्य होंगे। चयन $2 इंजीनियरों और $3 विश्लेषकों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति (\d[\d,]*) वरिष्ठ और (\d[\d,]*) कनिष्ठ अधिकारियों में से चुननी है।/, "समिति में $1 सदस्य होंगे। चयन $2 वरिष्ठ और $3 कनिष्ठ अधिकारियों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति विभाग A के (\d[\d,]*) और विभाग B के (\d[\d,]*) सदस्यों में से चुननी है।/, "समिति में $1 सदस्य होंगे। चयन विभाग A के $2 और विभाग B के $3 सदस्यों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति (\d[\d,]*) शिक्षकों, (\d[\d,]*) लिपिकों और (\d[\d,]*) अधिकारियों में से चुननी है।/, "समिति में $1 सदस्य होंगे। चयन $2 शिक्षकों, $3 लिपिकों और $4 अधिकारियों में से किया जाएगा।")
      .replace(/^(\d[\d,]*) शिक्षकों, (\d[\d,]*) लिपिकों और (\d[\d,]*) अधिकारियों में से समिति बनानी है।/, "उपलब्ध लोगों में $1 शिक्षक, $2 लिपिक और $3 अधिकारी हैं। इन्हीं में से समिति चुनी जाएगी।")
      .replace(/^(\d[\d,]*) व्यक्तियों में (\d[\d,]*) विशेष व्यक्ति हैं।/, "कुल $1 व्यक्ति हैं। इनमें $2 व्यक्तियों को विशेष माना गया है।")
      .replace(/^(\d[\d,]*) सदस्यों की समिति वर्ग A के (\d[\d,]*) और वर्ग B के (\d[\d,]*) सदस्यों में से चुननी है।/, "समिति में $1 सदस्य होंगे। चयन वर्ग A के $2 और वर्ग B के $3 सदस्यों में से किया जाएगा।");
  }

  return value
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ (\d[\d,]*) ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ (?:ਬਣਾਉਣੀ|ਚੁਣਨੀ) ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਵਿਅਕਤੀਆਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਖਿਡਾਰੀਆਂ ਦੀ ਟੀਮ (\d[\d,]*) ਖਿਡਾਰੀਆਂ ਵਿੱਚੋਂ ਚੁਣਨੀ ਹੈ।/, "ਟੀਮ ਵਿੱਚ $1 ਖਿਡਾਰੀ ਹੋਣਗੇ। ਚੋਣ $2 ਖਿਡਾਰੀਆਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦਾ ਪੈਨਲ (\d[\d,]*) ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਚੁਣਨਾ ਹੈ।/, "ਪੈਨਲ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਉਮੀਦਵਾਰਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ (\d[\d,]*) ਔਰਤਾਂ ਅਤੇ (\d[\d,]*) ਮਰਦਾਂ ਵਿੱਚੋਂ ਬਣਾਉਣੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਔਰਤਾਂ ਅਤੇ $3 ਮਰਦਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ (\d[\d,]*) ਮਰਦਾਂ ਅਤੇ (\d[\d,]*) ਔਰਤਾਂ ਵਿੱਚੋਂ ਬਣਾਉਣੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਮਰਦਾਂ ਅਤੇ $3 ਔਰਤਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ (\d[\d,]*) ਅਧਿਆਪਕਾਂ ਅਤੇ (\d[\d,]*) ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਬਣਾਉਣੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਅਧਿਆਪਕਾਂ ਅਤੇ $3 ਵਿਦਿਆਰਥੀਆਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦਾ ਪ੍ਰੋਜੈਕਟ ਗਰੁੱਪ (\d[\d,]*) ਇੰਜੀਨੀਅਰਾਂ ਅਤੇ (\d[\d,]*) ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਵਿੱਚੋਂ ਚੁਣਨਾ ਹੈ।/, "ਪ੍ਰੋਜੈਕਟ ਗਰੁੱਪ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਇੰਜੀਨੀਅਰਾਂ ਅਤੇ $3 ਵਿਸ਼ਲੇਸ਼ਕਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ (\d[\d,]*) ਸੀਨੀਅਰ ਅਤੇ (\d[\d,]*) ਜੂਨੀਅਰ ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਚੁਣਨੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਸੀਨੀਅਰ ਅਤੇ $3 ਜੂਨੀਅਰ ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਵਿਭਾਗ A ਦੇ (\d[\d,]*) ਅਤੇ ਵਿਭਾਗ B ਦੇ (\d[\d,]*) ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਚੁਣਨੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ ਵਿਭਾਗ A ਦੇ $2 ਅਤੇ ਵਿਭਾਗ B ਦੇ $3 ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ (\d[\d,]*) ਅਧਿਆਪਕਾਂ, (\d[\d,]*) ਕਲਰਕਾਂ ਅਤੇ (\d[\d,]*) ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਚੁਣਨੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ $2 ਅਧਿਆਪਕਾਂ, $3 ਕਲਰਕਾਂ ਅਤੇ $4 ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਅਧਿਆਪਕਾਂ, (\d[\d,]*) ਕਲਰਕਾਂ ਅਤੇ (\d[\d,]*) ਅਧਿਕਾਰੀਆਂ ਵਿੱਚੋਂ ਕਮੇਟੀ ਬਣਾਉਣੀ ਹੈ।/, "ਉਪਲਬਧ ਲੋਕਾਂ ਵਿੱਚ $1 ਅਧਿਆਪਕ, $2 ਕਲਰਕ ਅਤੇ $3 ਅਧਿਕਾਰੀ ਹਨ। ਕਮੇਟੀ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਚੁਣੀ ਜਾਵੇਗੀ।")
    .replace(/^(\d[\d,]*) ਵਿਅਕਤੀਆਂ ਵਿੱਚ (\d[\d,]*) ਖਾਸ ਵਿਅਕਤੀ ਹਨ।/, "ਕੁੱਲ $1 ਵਿਅਕਤੀ ਹਨ। ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ $2 ਵਿਅਕਤੀ ਖਾਸ ਮੰਨੇ ਗਏ ਹਨ।")
    .replace(/^(\d[\d,]*) ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਵਰਗ A ਦੇ (\d[\d,]*) ਅਤੇ ਵਰਗ B ਦੇ (\d[\d,]*) ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਚੁਣਨੀ ਹੈ।/, "ਕਮੇਟੀ ਵਿੱਚ $1 ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ ਵਰਗ A ਦੇ $2 ਅਤੇ ਵਰਗ B ਦੇ $3 ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ।");
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
    return simplifyOpening(reviewedText(fallback, locale), locale);
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
      ? `समिति में ${size} सदस्य होंगे और एक निश्चित व्यक्ति का चुना जाना अनिवार्य है। कुल व्यक्तियों की संख्या ${firstUnknown} है। यदि समिति ${target} तरीकों से बनती है, तो ${secondUnknown} ज्ञात कीजिए, जहाँ ${range}।`
      : `ਕਮੇਟੀ ਵਿੱਚ ${size} ਮੈਂਬਰ ਹੋਣਗੇ ਅਤੇ ਇੱਕ ਖਾਸ ਵਿਅਕਤੀ ਨੂੰ ਚੁਣਨਾ ਲਾਜ਼ਮੀ ਹੈ। ਕੁੱਲ ਵਿਅਕਤੀਆਂ ਦੀ ਗਿਣਤੀ ${firstUnknown} ਹੈ। ਜੇ ਕਮੇਟੀ ${target} ਤਰੀਕਿਆਂ ਨਾਲ ਬਣਦੀ ਹੈ, ਤਾਂ ${secondUnknown} ਪਤਾ ਕਰੋ, ਜਿੱਥੇ ${range}।`;
  }

  const size = required(t, 0, source.questionLanguageId);
  const categoryB = required(t, 1, source.questionLanguageId);
  const requiredFromA = required(t, 2, source.questionLanguageId);
  const target = required(t, 3, source.questionLanguageId);
  const firstUnknown = required(m, 0, source.questionLanguageId);
  const secondUnknown = required(m, 1, source.questionLanguageId);
  const range = required(m, 2, source.questionLanguageId);
  return hi
    ? `समिति में ${size} सदस्य होंगे। चयन वर्ग A के ${firstUnknown} और वर्ग B के ${categoryB} सदस्यों में से किया जाएगा। वर्ग A से ठीक ${requiredFromA} सदस्य लेने पर चयन ${target} तरीकों से होता है। ${secondUnknown} ज्ञात कीजिए, जहाँ ${range}।`
    : `ਕਮੇਟੀ ਵਿੱਚ ${size} ਮੈਂਬਰ ਹੋਣਗੇ। ਚੋਣ ਵਰਗ A ਦੇ ${firstUnknown} ਅਤੇ ਵਰਗ B ਦੇ ${categoryB} ਮੈਂਬਰਾਂ ਵਿੱਚੋਂ ਕੀਤੀ ਜਾਵੇਗੀ। ਵਰਗ A ਤੋਂ ਠੀਕ ${requiredFromA} ਮੈਂਬਰ ਲੈਣ ਉੱਤੇ ਚੋਣ ${target} ਤਰੀਕਿਆਂ ਨਾਲ ਹੁੰਦੀ ਹੈ। ${secondUnknown} ਪਤਾ ਕਰੋ, ਜਿੱਥੇ ${range}।`;
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
