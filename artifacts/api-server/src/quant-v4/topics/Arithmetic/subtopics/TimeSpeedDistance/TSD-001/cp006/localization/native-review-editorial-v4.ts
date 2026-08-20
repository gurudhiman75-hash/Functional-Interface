import { generateCp006NativeReviewV3, TSD_CP006_NATIVE_REVIEW_STATUS_V3 } from "./native-review-editorial-v3";

export const TSD_CP006_NATIVE_REVIEW_STATUS_V4 = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V4" as const;

function polishStemV4(stem: string, language: "hi" | "pa"): string {
  if (language === "hi") {
    return stem
      .replace("पहली अगली मुलाकात 2 मिनट बाद होती है।", "अगली मुलाकात 2 मिनट बाद होती है।")
      .replace("गति 72 m/min और 48 m/min है।", "गतियाँ 72 m/min और 48 m/min हैं।")
      .replace("ट्रैक 360 m और गतियाँ", "ट्रैक की लंबाई 360 m है और गतियाँ")
      .replace("और ट्रैक एथलीट C की 24 m/min विपरीत दिशा में है।", "हैं, जबकि ट्रैक एथलीट C की गति 24 m/min विपरीत दिशा में है।")
      .replace("A/B की घड़ी-दिशा गति 90 m/min/60 m/min और C की विपरीत-दिशा गति 30 m/min है।", "A और B की घड़ी की दिशा में गतियाँ 90 m/min और 60 m/min हैं, जबकि C की विपरीत दिशा में गति 30 m/min है।")
      .replace(/([ABC])=(\d)/g, "$1 = $2");
  }
  return stem
    .replace("ਅਗਲੀ ਪਹਿਲੀ ਮੁਲਾਕਾਤ 2 ਮਿੰਟ ਬਾਅਦ ਹੁੰਦੀ ਹੈ।", "ਅਗਲੀ ਮੁਲਾਕਾਤ 2 ਮਿੰਟ ਬਾਅਦ ਹੁੰਦੀ ਹੈ।")
    .replace("ਟਰੈਕ 360 m ਅਤੇ ਰਫ਼ਤਾਰਾਂ", "ਟਰੈਕ ਦੀ ਲੰਬਾਈ 360 m ਹੈ ਅਤੇ ਰਫ਼ਤਾਰਾਂ")
    .replace("ਅਤੇ ਟਰੈਕ ਐਥਲੀਟ C ਦੀ 24 m/min ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।", "ਹਨ, ਜਦਕਿ ਟਰੈਕ ਐਥਲੀਟ C ਦੀ ਰਫ਼ਤਾਰ 24 m/min ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।")
    .replace("A/B ਦੀ ਘੜੀ-ਦਿਸ਼ਾ ਰਫ਼ਤਾਰ 90 m/min/60 m/min ਅਤੇ C ਦੀ ਵਿਰੋਧੀ-ਦਿਸ਼ਾ ਰਫ਼ਤਾਰ 30 m/min ਹੈ।", "A ਅਤੇ B ਦੀਆਂ ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਰਫ਼ਤਾਰਾਂ 90 m/min ਅਤੇ 60 m/min ਹਨ, ਜਦਕਿ C ਦੀ ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ਰਫ਼ਤਾਰ 30 m/min ਹੈ।")
    .replace(/([ABC])=(\d)/g, "$1 = $2");
}

export function generateCp006NativeReviewV4() {
  return Object.freeze(generateCp006NativeReviewV3().map((row) => Object.freeze({
    ...row,
    presentation: Object.freeze({
      ...row.presentation,
      stem: polishStemV4(row.presentation.stem, row.presentation.language),
      lifecycle: Object.freeze({
        ...row.presentation.lifecycle,
        nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V4,
      }),
    }),
  })));
}

export const TSD_CP006_NATIVE_V4_SOURCE_STATUS = TSD_CP006_NATIVE_REVIEW_STATUS_V3;
