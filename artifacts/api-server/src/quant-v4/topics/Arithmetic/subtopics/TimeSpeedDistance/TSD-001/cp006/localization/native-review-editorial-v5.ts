import { generateCp006NativeReviewV4, TSD_CP006_NATIVE_REVIEW_STATUS_V4 } from "./native-review-editorial-v4";

export const TSD_CP006_NATIVE_REVIEW_STATUS_V5 = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V5" as const;

function polishV5(stem: string, language: "hi" | "pa"): string {
  if (language === "hi") {
    return stem.replace(
      "A और B की गतियाँ 72 m/min, 48 m/min घड़ी की दिशा में और C की 24 m/min विपरीत दिशा में है।",
      "A और B की गतियाँ 72 m/min और 48 m/min घड़ी की दिशा में हैं, जबकि C की गति 24 m/min विपरीत दिशा में है।",
    );
  }
  return stem.replace(
    "A ਅਤੇ B ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ 72 m/min, 48 m/min ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਅਤੇ C ਦੀ 24 m/min ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।",
    "A ਅਤੇ B ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ 72 m/min ਅਤੇ 48 m/min ਘੜੀ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹਨ, ਜਦਕਿ C ਦੀ ਰਫ਼ਤਾਰ 24 m/min ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ।",
  );
}

export function generateCp006NativeReviewV5() {
  return Object.freeze(generateCp006NativeReviewV4().map((row) => Object.freeze({
    ...row,
    presentation: Object.freeze({
      ...row.presentation,
      stem: polishV5(row.presentation.stem, row.presentation.language),
      lifecycle: Object.freeze({
        ...row.presentation.lifecycle,
        nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V5,
      }),
    }),
  })));
}

export const TSD_CP006_NATIVE_V5_SOURCE_STATUS = TSD_CP006_NATIVE_REVIEW_STATUS_V4;
