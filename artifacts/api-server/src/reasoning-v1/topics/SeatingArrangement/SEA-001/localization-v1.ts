import { buildSea001EnglishReviewPackV1, type Sea001EnglishReviewPackItemV1 } from "./english-review-pack-v1.ts";

export type Sea001LocaleV1 = "hi-IN" | "pa-IN";

export interface Sea001LocalizedReviewItemV1 extends Omit<Sea001EnglishReviewPackItemV1, "stem" | "options" | "explanation" | "reviewStatus"> {
  locale: Sea001LocaleV1;
  stem: string;
  options: readonly string[];
  explanation: string;
  sourceEnglishItemId: string;
  reviewStatus: "LOCALIZATION_REVIEW_REQUIRED";
}

function relationHi(value: string): string {
  return value
    .replace(/^Immediately to the left$/i, "तुरंत बाईं ओर")
    .replace(/^Immediately to the right$/i, "तुरंत दाईं ओर")
    .replace(/^Second to the left$/i, "बाईं ओर दूसरे स्थान पर")
    .replace(/^Second to the right$/i, "दाईं ओर दूसरे स्थान पर")
    .replace(/^Third to the left$/i, "बाईं ओर तीसरे स्थान पर")
    .replace(/^Third to the right$/i, "दाईं ओर तीसरे स्थान पर")
    .replace(/ - North$/i, " - उत्तर की ओर")
    .replace(/ - South$/i, " - दक्षिण की ओर");
}

function relationPa(value: string): string {
  return value
    .replace(/^Immediately to the left$/i, "ਤੁਰੰਤ ਖੱਬੇ ਪਾਸੇ")
    .replace(/^Immediately to the right$/i, "ਤੁਰੰਤ ਸੱਜੇ ਪਾਸੇ")
    .replace(/^Second to the left$/i, "ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ")
    .replace(/^Second to the right$/i, "ਸੱਜੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ")
    .replace(/^Third to the left$/i, "ਖੱਬੇ ਪਾਸੇ ਤੀਜੇ ਸਥਾਨ 'ਤੇ")
    .replace(/^Third to the right$/i, "ਸੱਜੇ ਪਾਸੇ ਤੀਜੇ ਸਥਾਨ 'ਤੇ")
    .replace(/ - North$/i, " - ਉੱਤਰ ਵੱਲ")
    .replace(/ - South$/i, " - ਦੱਖਣ ਵੱਲ");
}

function stemHi(text: string): string {
  let m: RegExpMatchArray | null;
  if (text === "Who sits at the left end of the row?") return "पंक्ति के बाएँ छोर पर कौन बैठा है?";
  if (text === "Which pair sits at the two extreme ends of the row?") return "पंक्ति के दोनों छोरों पर कौन-सा जोड़ा बैठा है?";
  if (text === "Which of the following statements is definitely true?") return "निम्नलिखित में से कौन-सा कथन निश्चित रूप से सत्य है?";
  if ((m = text.match(/^Who sits second to the (left|right) of (.+)\?$/))) return `${m[2]} के ${m[1] === "left" ? "बाईं" : "दाईं"} ओर दूसरे स्थान पर कौन बैठा है?`;
  if ((m = text.match(/^Who sits immediately to the (left|right) of (.+)\?$/))) return `${m[2]} के तुरंत ${m[1] === "left" ? "बाईं" : "दाईं"} ओर कौन बैठा है?`;
  if ((m = text.match(/^Who are the immediate neighbours of (.+)\?$/))) return `${m[1]} के ठीक पड़ोसी कौन हैं?`;
  if ((m = text.match(/^How many persons sit between (.+) and (.+)\?$/))) return `${m[1]} और ${m[2]} के बीच कितने व्यक्ति बैठे हैं?`;
  if ((m = text.match(/^Who sits opposite (.+)\?$/))) return `${m[1]} के ठीक सामने कौन बैठा है?`;
  if ((m = text.match(/^What is the position of (.+) with respect to (.+)\?$/))) return `${m[2]} के सापेक्ष ${m[1]} का स्थान क्या है?`;
  if ((m = text.match(/^How many persons are facing (north|south)\?$/))) return `${m[1] === "north" ? "उत्तर" : "दक्षिण"} की ओर कितने व्यक्ति मुख किए हुए हैं?`;
  if ((m = text.match(/^Who sits at the extreme (right|left) end and which direction does that person face\?$/))) return `सबसे ${m[1] === "right" ? "दाएँ" : "बाएँ"} छोर पर कौन बैठा है और उसका मुख किस दिशा में है?`;
  if ((m = text.match(/^If everyone changes their facing direction, who will sit second to the left of (.+)\?$/))) return `यदि सभी व्यक्ति अपने मुख की दिशा बदल लें, तो ${m[1]} के बाईं ओर दूसरे स्थान पर कौन बैठेगा?`;
  if ((m = text.match(/^How many persons sit (clockwise|anticlockwise) between (.+) and (.+)\?$/))) return `${m[2]} से ${m[3]} तक ${m[1] === "clockwise" ? "घड़ी की दिशा में" : "घड़ी की विपरीत दिशा में"} कितने व्यक्ति बीच में बैठे हैं?`;
  if ((m = text.match(/^How many persons sit between (.+) and (.+) when counted clockwise from (.+)\?$/))) return `${m[3]} से घड़ी की दिशा में गिनने पर ${m[1]} और ${m[2]} के बीच कितने व्यक्ति बैठे हैं?`;
  if ((m = text.match(/^Which sequence lists the next three persons clockwise from (.+)\?$/))) return `${m[1]} से घड़ी की दिशा में अगले तीन व्यक्तियों का सही क्रम कौन-सा है?`;
  return text
    .replace(/clockwise/gi, "घड़ी की दिशा में")
    .replace(/anticlockwise/gi, "घड़ी की विपरीत दिशा में");
}

function stemPa(text: string): string {
  let m: RegExpMatchArray | null;
  if (text === "Who sits at the left end of the row?") return "ਕਤਾਰ ਦੇ ਖੱਬੇ ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?";
  if (text === "Which pair sits at the two extreme ends of the row?") return "ਕਤਾਰ ਦੇ ਦੋਵੇਂ ਸਿਰਿਆਂ 'ਤੇ ਕਿਹੜੀ ਜੋੜੀ ਬੈਠੀ ਹੈ?";
  if (text === "Which of the following statements is definitely true?") return "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਨਿਸ਼ਚਿਤ ਤੌਰ 'ਤੇ ਸਹੀ ਹੈ?";
  if ((m = text.match(/^Who sits second to the (left|right) of (.+)\?$/))) return `${m[2]} ਦੇ ${m[1] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
  if ((m = text.match(/^Who sits immediately to the (left|right) of (.+)\?$/))) return `${m[2]} ਦੇ ਤੁਰੰਤ ${m[1] === "left" ? "ਖੱਬੇ" : "ਸੱਜੇ"} ਪਾਸੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
  if ((m = text.match(/^Who are the immediate neighbours of (.+)\?$/))) return `${m[1]} ਦੇ ਬਿਲਕੁਲ ਨਾਲ ਕੌਣ-ਕੌਣ ਬੈਠੇ ਹਨ?`;
  if ((m = text.match(/^How many persons sit between (.+) and (.+)\?$/))) return `${m[1]} ਅਤੇ ${m[2]} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`;
  if ((m = text.match(/^Who sits opposite (.+)\?$/))) return `${m[1]} ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਕੌਣ ਬੈਠਾ ਹੈ?`;
  if ((m = text.match(/^What is the position of (.+) with respect to (.+)\?$/))) return `${m[2]} ਦੇ ਸਬੰਧ ਵਿੱਚ ${m[1]} ਦੀ ਸਥਿਤੀ ਕੀ ਹੈ?`;
  if ((m = text.match(/^How many persons are facing (north|south)\?$/))) return `${m[1] === "north" ? "ਉੱਤਰ" : "ਦੱਖਣ"} ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`;
  if ((m = text.match(/^Who sits at the extreme (right|left) end and which direction does that person face\?$/))) return `ਸਭ ਤੋਂ ${m[1] === "right" ? "ਸੱਜੇ" : "ਖੱਬੇ"} ਸਿਰੇ 'ਤੇ ਕੌਣ ਬੈਠਾ ਹੈ ਅਤੇ ਉਸ ਦਾ ਮੂੰਹ ਕਿਸ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?`;
  if ((m = text.match(/^If everyone changes their facing direction, who will sit second to the left of (.+)\?$/))) return `ਜੇ ਸਾਰੇ ਵਿਅਕਤੀ ਆਪਣੇ ਮੂੰਹ ਦੀ ਦਿਸ਼ਾ ਬਦਲ ਲੈਣ, ਤਾਂ ${m[1]} ਦੇ ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਕੌਣ ਬੈਠੇਗਾ?`;
  if ((m = text.match(/^How many persons sit (clockwise|anticlockwise) between (.+) and (.+)\?$/))) return `${m[2]} ਤੋਂ ${m[3]} ਤੱਕ ${m[1] === "clockwise" ? "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ" : "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ"} ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`;
  if ((m = text.match(/^How many persons sit between (.+) and (.+) when counted clockwise from (.+)\?$/))) return `${m[3]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਗਿਣਣ 'ਤੇ ${m[1]} ਅਤੇ ${m[2]} ਦੇ ਵਿਚਕਾਰ ਕਿੰਨੇ ਵਿਅਕਤੀ ਬੈਠੇ ਹਨ?`;
  if ((m = text.match(/^Which sequence lists the next three persons clockwise from (.+)\?$/))) return `${m[1]} ਤੋਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਗਲੇ ਤਿੰਨ ਵਿਅਕਤੀਆਂ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?`;
  return text
    .replace(/clockwise/gi, "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ")
    .replace(/anticlockwise/gi, "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ");
}

function explanationHi(text: string): string {
  return text
    .replace(/ faces north/gi, " का मुख उत्तर की ओर है")
    .replace(/ faces south/gi, " का मुख दक्षिण की ओर है")
    .replace(/ faces the centre/gi, " का मुख केंद्र की ओर है")
    .replace(/ faces outward/gi, " का मुख बाहर की ओर है")
    .replace(/clockwise/gi, "घड़ी की दिशा में")
    .replace(/anticlockwise/gi, "घड़ी की विपरीत दिशा में")
    .replace(/left-end seat/gi, "बाएँ छोर की सीट")
    .replace(/right-end seat/gi, "दाएँ छोर की सीट")
    .replace(/left end/gi, "बाएँ छोर")
    .replace(/right end/gi, "दाएँ छोर")
    .replace(/left/gi, "बाईं ओर")
    .replace(/right/gi, "दाईं ओर")
    .replace(/opposite seat/gi, "सामने वाली सीट")
    .replace(/opposite/gi, "सामने")
    .replace(/immediate neighbours/gi, "ठीक पड़ोसी")
    .replace(/neighbour/gi, "पड़ोसी")
    .replace(/persons sit between them/gi, "व्यक्ति उनके बीच बैठे हैं")
    .replace(/person sits between them/gi, "व्यक्ति उनके बीच बैठा है")
    .replace(/Count only the seats strictly between/gi, "केवल इनके बीच की सीटें गिनें:")
    .replace(/The count is/gi, "गिनती है")
    .replace(/Hence,/gi, "अतः,")
    .replace(/Therefore,/gi, "इसलिए,")
    .replace(/The correct person-direction pair is/gi, "सही व्यक्ति-दिशा जोड़ी है")
    .replace(/The verified facing pattern gives/gi, "सत्यापित मुख-दिशा विन्यास से संख्या मिलती है")
    .replace(/so that is the correct answer/gi, "इसलिए यही सही उत्तर है");
}

function explanationPa(text: string): string {
  return text
    .replace(/ faces north/gi, " ਦਾ ਮੂੰਹ ਉੱਤਰ ਵੱਲ ਹੈ")
    .replace(/ faces south/gi, " ਦਾ ਮੂੰਹ ਦੱਖਣ ਵੱਲ ਹੈ")
    .replace(/ faces the centre/gi, " ਦਾ ਮੂੰਹ ਕੇਂਦਰ ਵੱਲ ਹੈ")
    .replace(/ faces outward/gi, " ਦਾ ਮੂੰਹ ਬਾਹਰ ਵੱਲ ਹੈ")
    .replace(/clockwise/gi, "ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ")
    .replace(/anticlockwise/gi, "ਘੜੀ ਦੀ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ")
    .replace(/left-end seat/gi, "ਖੱਬੇ ਸਿਰੇ ਵਾਲੀ ਸੀਟ")
    .replace(/right-end seat/gi, "ਸੱਜੇ ਸਿਰੇ ਵਾਲੀ ਸੀਟ")
    .replace(/left end/gi, "ਖੱਬਾ ਸਿਰਾ")
    .replace(/right end/gi, "ਸੱਜਾ ਸਿਰਾ")
    .replace(/left/gi, "ਖੱਬੇ ਪਾਸੇ")
    .replace(/right/gi, "ਸੱਜੇ ਪਾਸੇ")
    .replace(/opposite seat/gi, "ਸਾਹਮਣੇ ਵਾਲੀ ਸੀਟ")
    .replace(/opposite/gi, "ਸਾਹਮਣੇ")
    .replace(/immediate neighbours/gi, "ਬਿਲਕੁਲ ਨਾਲ ਬੈਠੇ ਵਿਅਕਤੀ")
    .replace(/neighbour/gi, "ਨਾਲ ਬੈਠਾ ਵਿਅਕਤੀ")
    .replace(/persons sit between them/gi, "ਵਿਅਕਤੀ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਬੈਠੇ ਹਨ")
    .replace(/person sits between them/gi, "ਵਿਅਕਤੀ ਉਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਬੈਠਾ ਹੈ")
    .replace(/Count only the seats strictly between/gi, "ਸਿਰਫ਼ ਇਨ੍ਹਾਂ ਦੇ ਵਿਚਕਾਰ ਵਾਲੀਆਂ ਸੀਟਾਂ ਗਿਣੋ:")
    .replace(/The count is/gi, "ਗਿਣਤੀ ਹੈ")
    .replace(/Hence,/gi, "ਇਸ ਲਈ,")
    .replace(/Therefore,/gi, "ਇਸ ਕਰਕੇ,")
    .replace(/The correct person-direction pair is/gi, "ਸਹੀ ਵਿਅਕਤੀ-ਦਿਸ਼ਾ ਜੋੜੀ ਹੈ")
    .replace(/The verified facing pattern gives/gi, "ਪੱਕੇ ਮੂੰਹ-ਦਿਸ਼ਾ ਵਿਨਿਆਸ ਤੋਂ ਗਿਣਤੀ ਮਿਲਦੀ ਹੈ")
    .replace(/so that is the correct answer/gi, "ਇਸ ਲਈ ਇਹੀ ਸਹੀ ਉੱਤਰ ਹੈ");
}

function optionHi(value: string): string {
  return relationHi(value)
    .replace(/\band\b/gi, "और")
    .replace(/sits second to the left of/gi, "के बाईं ओर दूसरे स्थान पर बैठा है:")
    .replace(/sits second to the right of/gi, "के दाईं ओर दूसरे स्थान पर बैठा है:")
    .replace(/sits immediately to the left of/gi, "के तुरंत बाईं ओर बैठा है:")
    .replace(/sits immediately to the right of/gi, "के तुरंत दाईं ओर बैठा है:");
}

function optionPa(value: string): string {
  return relationPa(value)
    .replace(/\band\b/gi, "ਅਤੇ")
    .replace(/sits second to the left of/gi, "ਦੇ ਖੱਬੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ:")
    .replace(/sits second to the right of/gi, "ਦੇ ਸੱਜੇ ਪਾਸੇ ਦੂਜੇ ਸਥਾਨ 'ਤੇ ਬੈਠਾ ਹੈ:")
    .replace(/sits immediately to the left of/gi, "ਦੇ ਤੁਰੰਤ ਖੱਬੇ ਪਾਸੇ ਬੈਠਾ ਹੈ:")
    .replace(/sits immediately to the right of/gi, "ਦੇ ਤੁਰੰਤ ਸੱਜੇ ਪਾਸੇ ਬੈਠਾ ਹੈ:");
}

export function localizeSea001ReviewItemV1(
  item: Sea001EnglishReviewPackItemV1,
  locale: Sea001LocaleV1,
): Sea001LocalizedReviewItemV1 {
  const hi = locale === "hi-IN";
  return Object.freeze({
    ...item,
    locale,
    stem: hi ? stemHi(item.stem) : stemPa(item.stem),
    options: Object.freeze(item.options.map((option) => hi ? optionHi(option) : optionPa(option))),
    explanation: hi ? explanationHi(item.explanation) : explanationPa(item.explanation),
    sourceEnglishItemId: item.itemId,
    reviewStatus: "LOCALIZATION_REVIEW_REQUIRED",
  });
}

export function buildSea001LocalizationReviewPackV1(locale: Sea001LocaleV1): readonly Sea001LocalizedReviewItemV1[] {
  return Object.freeze(buildSea001EnglishReviewPackV1().map((item) => localizeSea001ReviewItemV1(item, locale)));
}

export const SEA_001_LOCALIZATION_V1 = Object.freeze({
  authorityId: "SEA_001_LOCALIZATION_V1",
  sourceEnglishAuthority: "SEA_001_ENGLISH_FREEZE_V1",
  locales: ["hi-IN", "pa-IN"] as const,
  semanticStateSource: "FROZEN_ENGLISH",
  answerIndexParityRequired: true,
  qlParityRequired: true,
  difficultyParityRequired: true,
  diagramPolicy: "EXPLANATION_ONLY",
  manualLocalizationReviewRequired: true,
  multilingualFreezePermitted: false,
  questionStudioRegistered: false,
  downstreamActivationPermitted: false,
});
