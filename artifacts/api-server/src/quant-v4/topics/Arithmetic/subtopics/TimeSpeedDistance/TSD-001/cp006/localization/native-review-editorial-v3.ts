import { cp006NativeActor, type TsdCp006NativeLanguage } from "./native-primitives-v1";
import { generateCp006NativeReviewV2, TSD_CP006_NATIVE_REVIEW_STATUS_V2 } from "./native-review-editorial-v2";

export const TSD_CP006_NATIVE_REVIEW_STATUS_V3 = "READY_FOR_PRODUCT_OWNER_NATIVE_REVIEW_V3" as const;

function visibleFamilyStem(stem: string, objectFamily: string, language: TsdCp006NativeLanguage): string {
  const actorA = cp006NativeActor(objectFamily, "A", language);
  const family = actorA.replace(/ A$/, "");
  if (stem.includes(family)) return stem;
  return stem
    .replace(/\bA\b/g, cp006NativeActor(objectFamily, "A", language))
    .replace(/\bB\b/g, cp006NativeActor(objectFamily, "B", language))
    .replace(/\bC\b/g, cp006NativeActor(objectFamily, "C", language));
}

function polishStem(stem: string, language: TsdCp006NativeLanguage): string {
  if (language === "hi") {
    return stem
      .replace("अगली बार सभी P पर साथ कब पहुँचेंगे?", "अगली बार दोनों P पर साथ कब पहुँचेंगे?")
      .replace("सभी के पूरे चक्कर एक साथ पहली बार कब समाप्त होंगे?", "दोनों के पूरे चक्कर पहली बार एक साथ कब समाप्त होंगे?")
      .replace("पहला साझा वापसी समय ज्ञात कीजिए।", "तीनों की पहली साझा वापसी का समय ज्ञात कीजिए।")
      .replace("शुरुआती रेखा पर उनकी पहली अगली एक-साथ वापसी कब है?", "शुरुआती रेखा पर तीनों अगली बार एक साथ कब लौटेंगे?")
      .replace("A, B की गतियाँ", "A और B की गतियाँ");
  }
  return stem
    .replace("ਕਿੰਨੇ ਮੁਲਾਕਾਤਾਂ ਹੋਣਗੇ?", "ਕਿੰਨੀਆਂ ਮੁਲਾਕਾਤਾਂ ਹੋਣਗੀਆਂ?")
    .replace("ਪੂਰੇ ਹੋਣ ਵਾਲੇ ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੇ ਹਨ?", "ਪੂਰੀਆਂ ਹੋਣ ਵਾਲੀਆਂ ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੀਆਂ ਹਨ?")
    .replace("ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੇ ਹੋਣਗੇ?", "ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੀਆਂ ਹੋਣਗੀਆਂ?")
    .replace("ਅਗਲੀ ਵਾਰ ਸਾਰੇ P ਉੱਤੇ ਇਕੱਠੇ ਕਦੋਂ ਪਹੁੰਚਣਗੇ?", "ਅਗਲੀ ਵਾਰ ਦੋਵੇਂ P ਉੱਤੇ ਇਕੱਠੇ ਕਦੋਂ ਪਹੁੰਚਣਗੇ?")
    .replace("ਸਭ ਦੇ ਪੂਰੇ ਚੱਕਰ ਇਕੱਠੇ ਪਹਿਲੀ ਵਾਰ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਣਗੇ?", "ਦੋਵਾਂ ਦੇ ਪੂਰੇ ਚੱਕਰ ਪਹਿਲੀ ਵਾਰ ਇਕੱਠੇ ਕਦੋਂ ਮੁਕੰਮਲ ਹੋਣਗੇ?")
    .replace("ਪਹਿਲਾ ਸਾਂਝਾ ਵਾਪਸੀ ਸਮਾਂ ਕੱਢੋ।", "ਤਿੰਨਾਂ ਦੀ ਪਹਿਲੀ ਸਾਂਝੀ ਵਾਪਸੀ ਦਾ ਸਮਾਂ ਕੱਢੋ।")
    .replace("ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਉੱਤੇ ਉਨ੍ਹਾਂ ਦੀ ਪਹਿਲੀ ਅਗਲੀ ਇਕੱਠੀ ਵਾਪਸੀ ਕਦੋਂ ਹੈ?", "ਸ਼ੁਰੂਆਤੀ ਰੇਖਾ ਉੱਤੇ ਤਿੰਨੇ ਅਗਲੀ ਵਾਰ ਇਕੱਠੇ ਕਦੋਂ ਵਾਪਸ ਆਉਣਗੇ?")
    .replace("ਦੀ ਸ਼ੁਰੂਆਤ ਤੋਂ ਮਾਪਿਆਂ ਪਹਿਲੀ", "ਦੀ ਸ਼ੁਰੂਆਤ ਤੋਂ ਮਾਪਿਆ ਜਾਵੇ ਤਾਂ ਪਹਿਲੀ")
    .replace("A, B ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ", "A ਅਤੇ B ਦੀਆਂ ਰਫ਼ਤਾਰਾਂ");
}

function polishStep(step: string, language: TsdCp006NativeLanguage): string {
  if (language === "hi") {
    return step
      .replace(/\sand\s/g, " और ")
      .replace(/^व्यक्तिगत चक्कर समय (.+?) और (.+?); तीसरे का समय (.+?) हैं।$/, "पहले दो के चक्कर समय $1 और $2 हैं; तीसरे का चक्कर समय $3 है।")
      .replace(/^व्यक्तिगत चक्कर समय (.+?) और (.+?) हैं।$/, "दोनों के व्यक्तिगत चक्कर समय $1 और $2 हैं।");
  }
  return step
    .replace(/\sand\s/g, " ਅਤੇ ")
    .replace(/^ਵਿਅਕਤੀਗਤ ਚੱਕਰ ਸਮੇਂ (.+?) ਅਤੇ (.+?); ਤੀਜੇ ਦਾ ਸਮਾਂ (.+?) ਹਨ।$/, "ਪਹਿਲੇ ਦੋ ਦੇ ਚੱਕਰ ਸਮੇਂ $1 ਅਤੇ $2 ਹਨ; ਤੀਜੇ ਦਾ ਚੱਕਰ ਸਮਾਂ $3 ਹੈ।")
    .replace(/^ਵਿਅਕਤੀਗਤ ਚੱਕਰ ਸਮੇਂ (.+?) ਅਤੇ (.+?) ਹਨ।$/, "ਦੋਵਾਂ ਦੇ ਵਿਅਕਤੀਗਤ ਚੱਕਰ ਸਮੇਂ $1 ਅਤੇ $2 ਹਨ।");
}

export function generateCp006NativeReviewV3() {
  return Object.freeze(generateCp006NativeReviewV2().map((row) => {
    const language = row.presentation.language;
    const stem = polishStem(visibleFamilyStem(row.presentation.stem, row.source.objectFamily, language), language);
    const steps = Object.freeze(row.presentation.explanation.steps.map((step) => polishStep(step, language))) as readonly [string, string];
    return Object.freeze({
      ...row,
      presentation: Object.freeze({
        ...row.presentation,
        stem,
        explanation: Object.freeze({ steps }),
        lifecycle: Object.freeze({
          ...row.presentation.lifecycle,
          nativeReviewStatus: TSD_CP006_NATIVE_REVIEW_STATUS_V3,
        }),
      }),
    });
  }));
}

export const TSD_CP006_NATIVE_V3_SOURCE_STATUS = TSD_CP006_NATIVE_REVIEW_STATUS_V2;
