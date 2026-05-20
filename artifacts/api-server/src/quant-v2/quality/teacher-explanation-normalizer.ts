import type { LanguageCode } from "../localization/contracts/language-contracts";

const EN_REPLACEMENTS: Array<[RegExp, string]> = [
  [/^Take reference value as 100:$/gmu, "Let the original value be 100:"],
  [/^Take the reference value as 100:$/gmu, "Let the original value be 100:"],
  [/^Reference value =$/gmu, "Original value ="],
  [/^Using inverse relation:$/gmu, "Convert the given relation:"],
  [/^Using the inverse relation:$/gmu, "Convert the given relation:"],
  [/^Inverted relation index =$/gmu, "Value after this relation ="],
  [/^Using the percentage relation:$/gmu, "Apply the next relation:"],
  [/^Final value index =$/gmu, "After the change, value ="],
  [/^Compare with 100:$/gmu, "Now compare it with 100:"],
  [/^Remaining percentage =$/gmu, "Remaining part ="],
  [/^Percentage less =$/gmu, "Decrease percentage ="],
  [/^Percentage more =$/gmu, "Increase percentage ="],
  [/^Required value =/gmu, "Required answer ="],
  [/^Required value:$/gmu, "Required answer:"],
];

const HI_REPLACEMENTS: Array<[RegExp, string]> = [
  [/^After adding the bonus:$/gmu, "बोनस जोड़ने के बाद:"],
  [/^Value after this relation:?$/gmu, "इस संबंध के बाद मान:"],
  [/^Value after this relation =$/gmu, "इस संबंध के बाद मान ="],
  [/^Apply the next relation:$/gmu, "अगला संबंध लगाएं:"],
  [/^After the change, value =$/gmu, "बदलाव के बाद मान ="],
  [/^Increase percentage =$/gmu, "वृद्धि प्रतिशत ="],
  [/^Decrease percentage =$/gmu, "कमी प्रतिशत ="],
  [/^Remaining part =$/gmu, "बचा हुआ भाग ="],
  [/^Change %:?$/gmu, "परिवर्तन प्रतिशत:"],
  [/^Profit %:?$/gmu, "लाभ प्रतिशत:"],
  [/^Loss %:?$/gmu, "हानि प्रतिशत:"],
  [/^Take reference value as 100:$/gmu, "मूल मान 100 मान लेते हैं:"],
  [/^Take the reference value as 100:$/gmu, "मूल मान 100 मान लेते हैं:"],
  [/^Reference value =$/gmu, "मूल मान ="],
  [/^Using inverse relation:$/gmu, "दिए गए संबंध को बदलते हैं:"],
  [/^Using the inverse relation:$/gmu, "दिए गए संबंध को बदलते हैं:"],
  [/^Inverted relation index =$/gmu, "इस संबंध के बाद मान ="],
  [/^Using the percentage relation:$/gmu, "अगला प्रतिशत संबंध लगाएं:"],
  [/^Final value index =$/gmu, "बदलाव के बाद मान ="],
  [/^Compare with 100:$/gmu, "अब 100 से तुलना करें:"],
  [/^Remaining percentage =$/gmu, "बचा हुआ भाग ="],
  [/^Percentage less =$/gmu, "कमी प्रतिशत ="],
  [/^Percentage more =$/gmu, "वृद्धि प्रतिशत ="],
  [/^Required value =/gmu, "आवश्यक उत्तर ="],
  [/^Required value:$/gmu, "आवश्यक उत्तर:"],
];

const PA_REPLACEMENTS: Array<[RegExp, string]> = [
  [/^After adding the bonus:$/gmu, "ਬੋਨਸ ਜੋੜਨ ਤੋਂ ਬਾਅਦ:"],
  [/^Value after this relation:?$/gmu, "ਇਸ ਸੰਬੰਧ ਤੋਂ ਬਾਅਦ ਮੁੱਲ:"],
  [/^Value after this relation =$/gmu, "ਇਸ ਸੰਬੰਧ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ="],
  [/^Apply the next relation:$/gmu, "ਅਗਲਾ ਸੰਬੰਧ ਲਗਾਓ:"],
  [/^After the change, value =$/gmu, "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ="],
  [/^Increase percentage =$/gmu, "ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ ="],
  [/^Decrease percentage =$/gmu, "ਕਮੀ ਪ੍ਰਤੀਸ਼ਤ ="],
  [/^Remaining part =$/gmu, "ਬਚਿਆ ਹੋਇਆ ਹਿੱਸਾ ="],
  [/^Change %:?$/gmu, "ਬਦਲਾਅ ਪ੍ਰਤੀਸ਼ਤ:"],
  [/^Profit %:?$/gmu, "ਲਾਭ ਪ੍ਰਤੀਸ਼ਤ:"],
  [/^Loss %:?$/gmu, "ਨੁਕਸਾਨ ਪ੍ਰਤੀਸ਼ਤ:"],
  [/^Take reference value as 100:$/gmu, "ਮੂਲ ਮੁੱਲ 100 ਮੰਨ ਲਓ:"],
  [/^Take the reference value as 100:$/gmu, "ਮੂਲ ਮੁੱਲ 100 ਮੰਨ ਲਓ:"],
  [/^Reference value =$/gmu, "ਮੂਲ ਮੁੱਲ ="],
  [/^Using inverse relation:$/gmu, "ਦਿੱਤੇ ਸੰਬੰਧ ਨੂੰ ਬਦਲੋ:"],
  [/^Using the inverse relation:$/gmu, "ਦਿੱਤੇ ਸੰਬੰਧ ਨੂੰ ਬਦਲੋ:"],
  [/^Inverted relation index =$/gmu, "ਇਸ ਸੰਬੰਧ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ="],
  [/^Using the percentage relation:$/gmu, "ਅਗਲਾ ਪ੍ਰਤੀਸ਼ਤ ਸੰਬੰਧ ਲਗਾਓ:"],
  [/^Final value index =$/gmu, "ਬਦਲਾਅ ਤੋਂ ਬਾਅਦ ਮੁੱਲ ="],
  [/^Compare with 100:$/gmu, "ਹੁਣ 100 ਨਾਲ ਤੁਲਨਾ ਕਰੋ:"],
  [/^Remaining percentage =$/gmu, "ਬਚਿਆ ਹਿੱਸਾ ="],
  [/^Percentage less =$/gmu, "ਕਮੀ ਪ੍ਰਤੀਸ਼ਤ ="],
  [/^Percentage more =$/gmu, "ਵਾਧਾ ਪ੍ਰਤੀਸ਼ਤ ="],
  [/^Required value =/gmu, "ਲੋੜੀਂਦਾ ਉੱਤਰ ="],
  [/^Required value:$/gmu, "ਲੋੜੀਂਦਾ ਉੱਤਰ:"],
];

export const INTERNAL_EXPLANATION_TERMS = [
  "Final value index",
  "Reference value",
  "Using inverse relation",
  "Using the inverse relation",
  "Inverted relation index",
  "Using the percentage relation",
  "Required value",
  "Remaining percentage",
  "Take reference value as 100",
  "Take the reference value as 100",
] as const;

export function normalizeTeacherExplanation(
  text: string,
  language: LanguageCode = "en",
) {
  const replacements =
    language === "hi"
      ? HI_REPLACEMENTS
      : language === "pa"
        ? PA_REPLACEMENTS
        : EN_REPLACEMENTS;

  let output = text;
  for (const [pattern, replacement] of replacements) {
    output = output.replace(pattern, replacement);
  }
  return output;
}

export function leakedInternalExplanationTerms(text: string) {
  return INTERNAL_EXPLANATION_TERMS.filter((term) => text.includes(term));
}
