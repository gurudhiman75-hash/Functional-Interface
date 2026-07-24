import type { LocalizedQuestionText } from "./types";

export const ANA_LOCALIZED_QUESTION_TEXT: readonly LocalizedQuestionText[] = [
  {
    locale: "hi-IN",
    missingTermStem: "{sourceA} : {sourceB} :: {targetA} : ?",
    equivalentPairStem: "उस विकल्प-युग्म का चयन कीजिए जिसका संबंध {sourceA} : {sourceB} के समान है।",
    correctAnswerLead: "अतः सही उत्तर है",
  },
  {
    locale: "pa-IN",
    missingTermStem: "{sourceA} : {sourceB} :: {targetA} : ?",
    equivalentPairStem: "ਉਸ ਵਿਕਲਪ-ਜੋੜੇ ਦੀ ਚੋਣ ਕਰੋ ਜਿਸਦਾ ਸੰਬੰਧ {sourceA} : {sourceB} ਦੇ ਸਮਾਨ ਹੈ।",
    correctAnswerLead: "ਇਸ ਲਈ ਸਹੀ ਉੱਤਰ ਹੈ",
  },
];

export function localizedQuestionText(locale: "hi-IN" | "pa-IN"): LocalizedQuestionText {
  const text = ANA_LOCALIZED_QUESTION_TEXT.find((entry) => entry.locale === locale);
  if (!text) throw new Error(`Unsupported ANA locale: ${locale}`);
  return text;
}
