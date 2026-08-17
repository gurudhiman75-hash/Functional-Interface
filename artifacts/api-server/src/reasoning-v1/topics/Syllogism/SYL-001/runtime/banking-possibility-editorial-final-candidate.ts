import type { SylLocale } from "../foundation/types";
import {
  generateBankingPossibilityEditorialCandidate,
  type BankingPossibilityEditorialCandidate,
} from "./banking-possibility-editorial-candidate";

// Final candidate is presentation-only: semantics and V4 diagrams remain immutable.
export type BankingPossibilityEditorialFinalCandidate = BankingPossibilityEditorialCandidate;

function polish(line: string, locale: SylLocale): string {
  if (locale === "hi-IN") {
    return line
      .replace("कथन 1 और 2 और 3 को साथ पढ़ें", "कथन 1, 2 और 3 को साथ पढ़ें")
      .replace("यही containment दिखता है", "यही अंदर-होने का संबंध दिखता है")
      .replace("आरेख में भी दोनों वर्ग अलग हैं, इसलिए एक ही × दोनों में नहीं रखा जा सकता। इसलिए निष्कर्ष",
        "आरेख में भी दोनों वर्ग अलग हैं; एक ही × दोनों में नहीं रखा जा सकता। इसलिए निष्कर्ष")
      .replace(/। इसलिए पूरा “([^”]+)” वर्ग “([^”]+)” के अंदर नहीं हो सकता। इसलिए निष्कर्ष/gu,
        "। यह दिखाता है कि पूरा “$1” वर्ग “$2” के अंदर नहीं हो सकता। इसलिए निष्कर्ष")
      .replace(/। इसलिए दोनों वर्ग पूरी तरह अलग नहीं हो सकते। इसलिए निष्कर्ष/gu,
        "। यह दिखाता है कि दोनों वर्ग पूरी तरह अलग नहीं हो सकते। इसलिए निष्कर्ष")
      .replace(/। इसलिए “([^”]+)” का कोई × “([^”]+)” से बाहर नहीं रखा जा सकता। इसलिए निष्कर्ष/gu,
        "। ऐसे में “$1” का कोई आवश्यक सदस्य “$2” से बाहर नहीं हो सकता। इसलिए निष्कर्ष");
  }
  if (locale === "pa-IN") {
    return line
      .replace("ਕਥਨ 1 ਅਤੇ 2 ਅਤੇ 3 ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹੋ", "ਕਥਨ 1, 2 ਅਤੇ 3 ਨੂੰ ਇਕੱਠੇ ਪੜ੍ਹੋ")
      .replace("ਇਹੀ containment ਦਿਖਦਾ ਹੈ", "ਇਹੀ ਅੰਦਰ-ਹੋਣ ਵਾਲਾ ਸੰਬੰਧ ਦਿਖਦਾ ਹੈ")
      .replace("ਚਿੱਤਰ ਵਿੱਚ ਵੀ ਦੋਵੇਂ ਵਰਗ ਵੱਖ ਹਨ, ਇਸ ਲਈ ਇੱਕੋ × ਦੋਵਾਂ ਵਿੱਚ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ ਨਤੀਜਾ",
        "ਚਿੱਤਰ ਵਿੱਚ ਵੀ ਦੋਵੇਂ ਵਰਗ ਵੱਖ ਹਨ; ਇੱਕੋ × ਦੋਵਾਂ ਵਿੱਚ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ ਨਤੀਜਾ")
      .replace(/। ਇਸ ਲਈ ਪੂਰਾ “([^”]+)” ਵਰਗ “([^”]+)” ਦੇ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਇਸ ਲਈ ਨਤੀਜਾ/gu,
        "। ਇਹ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਪੂਰਾ “$1” ਵਰਗ “$2” ਦੇ ਅੰਦਰ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਇਸ ਲਈ ਨਤੀਜਾ")
      .replace(/। ਇਸ ਲਈ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ। ਇਸ ਲਈ ਨਤੀਜਾ/gu,
        "। ਇਹ ਦਿਖਾਉਂਦਾ ਹੈ ਕਿ ਦੋਵੇਂ ਵਰਗ ਪੂਰੀ ਤਰ੍ਹਾਂ ਵੱਖ ਨਹੀਂ ਹੋ ਸਕਦੇ। ਇਸ ਲਈ ਨਤੀਜਾ")
      .replace(/। ਇਸ ਲਈ “([^”]+)” ਦਾ ਕੋਈ × “([^”]+)” ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਰੱਖਿਆ ਜਾ ਸਕਦਾ। ਇਸ ਲਈ ਨਤੀਜਾ/gu,
        "। ਇਸ ਹਾਲਤ ਵਿੱਚ “$1” ਦਾ ਕੋਈ ਲੋੜੀਂਦਾ ਮੈਂਬਰ “$2” ਤੋਂ ਬਾਹਰ ਨਹੀਂ ਹੋ ਸਕਦਾ। ਇਸ ਲਈ ਨਤੀਜਾ");
  }
  return line
    .replace("Read Statements 1 and 2 and 3 together", "Read Statements 1, 2 and 3 together")
    .replace(/\. Therefore an × for “([^”]+)” cannot be placed outside “([^”]+)”\. Therefore Conclusion/gu,
      ". So no witness for the “$1” class can lie outside the “$2” class. Therefore Conclusion")
    .replace(/\. Therefore the whole “([^”]+)” class cannot be inside “([^”]+)”\. Therefore Conclusion/gu,
      ". This shows that the whole “$1” class cannot be inside “$2”. Therefore Conclusion")
    .replace(/\. Therefore the two classes cannot be completely disjoint\. Therefore Conclusion/gu,
      ". This shows that the two classes cannot be completely disjoint. Therefore Conclusion");
}

export function generateBankingPossibilityEditorialFinalCandidate(
  seed: number,
  locale: SylLocale,
): BankingPossibilityEditorialFinalCandidate {
  const question = generateBankingPossibilityEditorialCandidate(seed, locale);
  return {
    ...question,
    explanation: question.explanation.map((line) => polish(line, locale)) as [string, string],
  };
}
