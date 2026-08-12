import { generateCp004FinalMultilingualReviewCorpus, renderCp004FinalNativeQuestion, type TsdCp004FinalNativeQuestion } from "./native-final";
import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004Explanation, TsdCp004Question } from "./types";

function polishText(text: string, language: TsdCp004NativeLanguage): string {
  if (language === "hi") {
    return text
      .replace(/closing speed/giu, "सापेक्ष पकड़ गति")
      .replace(/distance lead/giu, "दूरी की बढ़त")
      .replace(/speed difference/giu, "गति का अंतर")
      .replace(/deadline/giu, "समय सीमा")
      .replace(/required/giu, "आवश्यक")
      .replace(/pursuer/giu, "पीछा करने वाला")
      .replace(/catch time/giu, "पकड़ने का समय")
      .replace(/positive/giu, "सकारात्मक")
      .replace(/meeting time/giu, "मिलने का समय")
      .replace(/travelled-distance ratio/giu, "तय दूरी का अनुपात")
      .replace(/speed ratio/giu, "गति अनुपात")
      .replace(/meeting/giu, "मिलने")
      .replace(/catch/giu, "पकड़")
      .replace(/speed/giu, "गति")
      .replace(/distance/giu, "दूरी");
  }
  return text
    .replace(/closing speed/giu, "ਸਾਪੇਖ ਪਕੜ ਰਫ਼ਤਾਰ")
    .replace(/distance lead/giu, "ਦੂਰੀ ਦੀ ਬੜ੍ਹਤ")
    .replace(/speed difference/giu, "ਰਫ਼ਤਾਰ ਦਾ ਅੰਤਰ")
    .replace(/deadline/giu, "ਸਮਾਂ ਸੀਮਾ")
    .replace(/required/giu, "ਲੋੜੀਂਦੀ")
    .replace(/pursuer/giu, "ਪਿੱਛਾ ਕਰਨ ਵਾਲਾ")
    .replace(/catch time/giu, "ਪਕੜਨ ਦਾ ਸਮਾਂ")
    .replace(/positive/giu, "ਧਨਾਤਮਕ")
    .replace(/meeting time/giu, "ਮਿਲਣ ਦਾ ਸਮਾਂ")
    .replace(/travelled-distance ratio/giu, "ਤੈਅ ਦੂਰੀ ਦਾ ਅਨੁਪਾਤ")
    .replace(/speed ratio/giu, "ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ")
    .replace(/meeting/giu, "ਮਿਲਣ")
    .replace(/catch/giu, "ਪਕੜ")
    .replace(/speed/giu, "ਰਫ਼ਤਾਰ")
    .replace(/distance/giu, "ਦੂਰੀ");
}

function polishExplanation(explanation: TsdCp004Explanation, language: TsdCp004NativeLanguage): TsdCp004Explanation {
  return Object.freeze({
    method: polishText(explanation.method, language),
    steps: Object.freeze(explanation.steps.map((step) => polishText(step, language))),
    shortcut: polishText(explanation.shortcut, language),
    answer: polishText(explanation.answer, language),
  });
}

export function renderCp004PolishedNativeQuestion(english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  const base = renderCp004FinalNativeQuestion(english, language);
  return Object.freeze({
    ...base,
    explanation: polishExplanation(base.explanation, language),
  });
}

export function generateCp004PolishedMultilingualReviewCorpus(): readonly (TsdCp004Question | TsdCp004FinalNativeQuestion)[] {
  const base = generateCp004FinalMultilingualReviewCorpus();
  const rows: (TsdCp004Question | TsdCp004FinalNativeQuestion)[] = [];
  for (let i = 0; i < base.length; i += 3) {
    const english = base[i] as TsdCp004Question;
    rows.push(english, renderCp004PolishedNativeQuestion(english, "hi"), renderCp004PolishedNativeQuestion(english, "pa"));
  }
  return Object.freeze(rows);
}

export type { TsdCp004FinalNativeQuestion } from "./native-final";
