import type { Sea002Cp007ProductionCaselet } from "../production-caselet-v1.ts";
import {
  localizeSea002Cp007Candidate,
  type Sea002Cp007LocalizedCandidate,
} from "./candidate-localizer-v1.ts";
import type { Sea002Cp007TranslatedLocale } from "./readiness.ts";

function polishHindi(text: string): string {
  return text
    .replace(/([A-Za-z]+) किस दिशा की ओर मुख करता\/करती है\?/gu, "$1 का मुख किस दिशा की ओर है?")
    .replace(/([A-Za-z]+) (उत्तर|दक्षिण) की ओर मुख करके बैठा\/बैठी है/gu, "$1 का मुख $2 की ओर है")
    .replace(/([A-Za-z]+) (उत्तर|दक्षिण) की ओर मुख करता\/करती है/gu, "$1 का मुख $2 की ओर है")
    .replace(/([A-Za-z]+), ([A-Za-z]+) के (बाईं ओर|दाईं ओर) तुरंत बैठता\/बैठती है/gu, "$1, $2 के ठीक $3 है")
    .replace(/([A-Za-z]+), ([A-Za-z]+) के ठीक सामने बैठता\/बैठती है/gu, "$1, $2 के ठीक सामने है")
    .replace(/([A-Za-z]+), ([A-Za-z]+) से तिरछे ([A-Za-z]+) की (बाईं ओर|दाईं ओर) बैठता\/बैठती है/gu, "$1, $2 से तिरछे, $3 की $4 है")
    .replace(/([A-Za-z]+) (ऊपरी पंक्ति|निचली पंक्ति) में बैठता\/बैठती है/gu, "$1 $2 में है")
    .replace(/([A-Za-z]+), ([A-Za-z]+) के समान पंक्ति में है/gu, "$1, $2 की ही पंक्ति में है")
    .replace(/([A-Za-z]+), ([A-Za-z]+) के दूसरी पंक्ति में है/gu, "$1, $2 की दूसरी पंक्ति में है")
    .replace(/के (बाईं ओर|दाईं ओर) तुरंत कौन बैठता\/बैठती है\?/gu, "के ठीक $1 कौन है?")
    .replace(/कौन बैठता\/बैठती है\?/gu, "कौन है?")
    .replace(/बैठता\/बैठती है/gu, "है")
    .replace(/बैठा\/बैठी है/gu, "है")
    .replace(/के (बाईं ओर|दाईं ओर) तुरंत कौन है\?/gu, "के ठीक $1 कौन है?");
}

function polishPunjabi(text: string): string {
  return text
    .replace(/([A-Za-z]+) ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਮੂੰਹ ਕਰਦਾ\/ਕਰਦੀ ਹੈ\?/gu, "$1 ਦਾ ਮੂੰਹ ਕਿਹੜੀ ਦਿਸ਼ਾ ਵੱਲ ਹੈ?")
    .replace(/([A-Za-z]+) (ਉੱਤਰ|ਦੱਖਣ) ਵੱਲ ਮੂੰਹ ਕਰਕੇ ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ/gu, "$1 ਦਾ ਮੂੰਹ $2 ਵੱਲ ਹੈ")
    .replace(/([A-Za-z]+) (ਉੱਤਰ|ਦੱਖਣ) ਵੱਲ ਮੂੰਹ ਕਰਦਾ\/ਕਰਦੀ ਹੈ/gu, "$1 ਦਾ ਮੂੰਹ $2 ਵੱਲ ਹੈ")
    .replace(/([A-Za-z]+), ([A-Za-z]+) ਦੇ (ਖੱਬੇ ਪਾਸੇ|ਸੱਜੇ ਪਾਸੇ) ਤੁਰੰਤ ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ/gu, "$1, $2 ਦੇ ਬਿਲਕੁਲ $3 ਹੈ")
    .replace(/([A-Za-z]+), ([A-Za-z]+) ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ/gu, "$1, $2 ਦੇ ਬਿਲਕੁਲ ਸਾਹਮਣੇ ਹੈ")
    .replace(/([A-Za-z]+), ([A-Za-z]+) ਤੋਂ ਤਿਰਛੇ ([A-Za-z]+) ਦੇ (ਖੱਬੇ ਪਾਸੇ|ਸੱਜੇ ਪਾਸੇ) ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ/gu, "$1, $2 ਤੋਂ ਤਿਰਛੇ, $3 ਦੇ $4 ਹੈ")
    .replace(/([A-Za-z]+) (ਉੱਪਰਲੀ ਕਤਾਰ|ਹੇਠਲੀ ਕਤਾਰ) ਵਿੱਚ ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ/gu, "$1 $2 ਵਿੱਚ ਹੈ")
    .replace(/ਦੇ (ਖੱਬੇ ਪਾਸੇ|ਸੱਜੇ ਪਾਸੇ) ਤੁਰੰਤ ਕੌਣ ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ\?/gu, "ਦੇ ਬਿਲਕੁਲ $1 ਕੌਣ ਹੈ?")
    .replace(/ਕੌਣ ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ\?/gu, "ਕੌਣ ਹੈ?")
    .replace(/ਬੈਠਦਾ\/ਬੈਠਦੀ ਹੈ/gu, "ਹੈ")
    .replace(/ਦੇ (ਖੱਬੇ ਪਾਸੇ|ਸੱਜੇ ਪਾਸੇ) ਤੁਰੰਤ ਕੌਣ ਹੈ\?/gu, "ਦੇ ਬਿਲਕੁਲ $1 ਕੌਣ ਹੈ?");
}

function polish(text: string, locale: Sea002Cp007TranslatedLocale): string {
  return locale === "hi-IN" ? polishHindi(text) : polishPunjabi(text);
}

export function localizeSea002Cp007CandidateV2(
  caselet: Sea002Cp007ProductionCaselet,
  locale: Sea002Cp007TranslatedLocale,
): Sea002Cp007LocalizedCandidate {
  const base = localizeSea002Cp007Candidate(caselet, locale);
  return Object.freeze({
    ...base,
    stem: polish(base.stem, locale),
    question: polish(base.question, locale),
    options: Object.freeze(base.options.map((option) => polish(option, locale))),
    answer: polish(base.answer, locale),
    explanation: polish(base.explanation, locale),
  });
}
