import { TSD_CP010_LOCALIZED_REVIEW } from "./localized-review";

const HINDI_REPLACEMENTS: readonly (readonly [string, string])[] = Object.freeze([
  [" की समान गति बनाए रखते हैं", " की अपनी-अपनी गति स्थिर रखते हैं"],
  ["दोनों की गति दोनों दौड़ों में समान रहती है", "प्रत्येक धावक की अपनी गति दोनों दौड़ों में नहीं बदलती"],
  ["धीमे धावक का समय minus तेज धावक का समय", "धीमे धावक के समय में से तेज धावक का समय"],
]);

const PUNJABI_REPLACEMENTS: readonly (readonly [string, string])[] = Object.freeze([
  [" ਦੀ ਇੱਕੋ ਰਫ਼ਤਾਰ ਬਣਾਈ ਰੱਖਦੇ ਹਨ", " ਦੀ ਆਪਣੀ-ਆਪਣੀ ਰਫ਼ਤਾਰ ਸਥਿਰ ਰੱਖਦੇ ਹਨ"],
  ["ਦੋਵਾਂ ਦੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ", "ਹਰ ਧਾਵਕ ਦੀ ਆਪਣੀ ਰਫ਼ਤਾਰ ਦੋਹਾਂ ਦੌੜਾਂ ਵਿੱਚ ਬਦਲਦੀ ਨਹੀਂ"],
  ["ਉਸ ਦੀ ਬੜ੍ਹਤ ਪੂਰੀ", "ਉਸ ਦਾ ਜਿੱਤ ਵਾਲਾ ਦੂਰੀ-ਅੰਤਰ ਪੂਰੀ"],
  ["ਕਿੰਨੇ ਮੀਟਰ ਦੀ ਬੜ੍ਹਤ ਨਾਲ", "ਕਿੰਨੇ ਮੀਟਰ ਦੇ ਫਰਕ ਨਾਲ"],
  ["ਦੂਰੀ-ਬੜ੍ਹਤ", "ਦੂਰੀ-ਅੰਤਰ"],
]);

function clean(text: string, language: "hi" | "pa") {
  const replacements = language === "hi" ? HINDI_REPLACEMENTS : PUNJABI_REPLACEMENTS;
  return replacements.reduce((value, [from, to]) => value.replaceAll(from, to), text);
}

export const TSD_CP010_NATIVE_FINAL_REVIEW = Object.freeze(
  TSD_CP010_LOCALIZED_REVIEW.map((question) => Object.freeze({
    ...question,
    stem: clean(question.stem, question.language),
    explanation: Object.freeze({
      steps: Object.freeze(question.explanation.steps.map((step) => clean(step, question.language))),
      conclusion: clean(question.explanation.conclusion, question.language),
    }),
  })),
);

export const TSD_CP010_NATIVE_FINAL_HINDI_REVIEW = Object.freeze(
  TSD_CP010_NATIVE_FINAL_REVIEW.filter((x) => x.language === "hi"),
);

export const TSD_CP010_NATIVE_FINAL_PUNJABI_REVIEW = Object.freeze(
  TSD_CP010_NATIVE_FINAL_REVIEW.filter((x) => x.language === "pa"),
);
