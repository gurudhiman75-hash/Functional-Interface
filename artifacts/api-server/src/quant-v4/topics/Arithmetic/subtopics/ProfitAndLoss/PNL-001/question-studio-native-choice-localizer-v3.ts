import {
  localizePnl001CanonicalChoiceV2,
  type Pnl001NativeReviewLanguage,
} from "./question-studio-native-choice-localizer-v2";

export type { Pnl001NativeReviewLanguage };

export function localizePnl001CanonicalChoiceV3(
  value: string,
  language: Pnl001NativeReviewLanguage,
): string {
  const successive = /^Successive discounts are better by ₹(.+)$/u.exec(value);
  if (successive) {
    return language === "hi"
      ? `क्रमिक छूटें ₹${successive[1]} से बेहतर हैं`
      : `ਲਗਾਤਾਰ ਛੂਟਾਂ ₹${successive[1]} ਨਾਲ ਵਧੀਆ ਹਨ`;
  }
  return localizePnl001CanonicalChoiceV2(value, language);
}
