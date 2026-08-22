import { TSD_CP007_HINDI_LOCALIZATION } from "./hindi-localization";
import { TSD_CP007_PUNJABI_LOCALIZATION } from "./punjabi-localization";
import type { TsdCp007LocalizedFamilyText, TsdCp007LocalizedQlSpec } from "./localization-authoring";

const hindiReplacements: Readonly<Record<string, TsdCp007LocalizedFamilyText>> = Object.freeze({
  "88-E": Object.freeze({
    stem: "एक {trainLength} m लंबी ट्रेन {speed} की चाल से चलकर किसी प्लेटफॉर्म को {crossingTime} सेकंड में पूरी तरह पार करती है। उस प्लेटफॉर्म की लंबाई कितनी है?",
    explanationGuide: "पहले दी गई चाल को जरूरत होने पर m/s में बदलें। {crossingTime} सेकंड में तय कुल दूरी से ट्रेन की लंबाई {trainLength} घटाने पर प्लेटफॉर्म की लंबाई मिलेगी।",
  }),
  "89-F": Object.freeze({
    stem: "एक ट्रेन को खंभा पार करने में {pointTime} सेकंड लगते हैं, जबकि {objectLength} m लंबे प्लेटफॉर्म को पूरी तरह पार करने में {crossingTime} सेकंड लगते हैं। ट्रेन की लंबाई ज्ञात करें।",
    explanationGuide: "दोनों समयों का अंतर केवल प्लेटफॉर्म की अतिरिक्त दूरी {objectLength} तय करने का समय है। इस अंतर से चाल निकालें और फिर चाल को {pointTime} से गुणा करें।",
  }),
});

const punjabiReplacements: Readonly<Record<string, TsdCp007LocalizedFamilyText>> = Object.freeze({
  "88-E": Object.freeze({
    stem: "ਇੱਕ {trainLength} m ਲੰਮੀ ਰੇਲਗੱਡੀ {speed} ਦੀ ਗਤੀ ਨਾਲ ਚੱਲ ਕੇ ਕਿਸੇ ਪਲੇਟਫਾਰਮ ਨੂੰ {crossingTime} ਸਕਿੰਟ ਵਿੱਚ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਦੀ ਹੈ। ਉਸ ਪਲੇਟਫਾਰਮ ਦੀ ਲੰਬਾਈ ਕਿੰਨੀ ਹੈ?",
    explanationGuide: "ਲੋੜ ਪਏ ਤਾਂ ਦਿੱਤੀ ਗਤੀ ਨੂੰ m/s ਵਿੱਚ ਬਦਲੋ। {crossingTime} ਸਕਿੰਟ ਵਿੱਚ ਤੈਅ ਕੁੱਲ ਦੂਰੀ ਵਿੱਚੋਂ ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ {trainLength} ਘਟਾਉਣ ਨਾਲ ਪਲੇਟਫਾਰਮ ਦੀ ਲੰਬਾਈ ਮਿਲੇਗੀ।",
  }),
  "89-F": Object.freeze({
    stem: "ਇੱਕ ਰੇਲਗੱਡੀ ਨੂੰ ਖੰਭਾ ਪਾਰ ਕਰਨ ਵਿੱਚ {pointTime} ਸਕਿੰਟ ਲੱਗਦੇ ਹਨ, ਜਦਕਿ {objectLength} m ਲੰਮਾ ਪਲੇਟਫਾਰਮ ਪੂਰੀ ਤਰ੍ਹਾਂ ਪਾਰ ਕਰਨ ਵਿੱਚ {crossingTime} ਸਕਿੰਟ ਲੱਗਦੇ ਹਨ। ਰੇਲਗੱਡੀ ਦੀ ਲੰਬਾਈ ਕੱਢੋ।",
    explanationGuide: "ਦੋਵੇਂ ਸਮਿਆਂ ਦਾ ਫਰਕ ਸਿਰਫ਼ ਪਲੇਟਫਾਰਮ ਦੀ ਵਾਧੂ ਦੂਰੀ {objectLength} ਤੈਅ ਕਰਨ ਦਾ ਸਮਾਂ ਹੈ। ਇਸ ਫਰਕ ਤੋਂ ਗਤੀ ਕੱਢੋ ਅਤੇ ਫਿਰ ਗਤੀ ਨੂੰ {pointTime} ਨਾਲ ਗੁਣਾ ਕਰੋ।",
  }),
});

function apply(
  source: readonly TsdCp007LocalizedQlSpec[],
  replacements: Readonly<Record<string, TsdCp007LocalizedFamilyText>>,
): readonly TsdCp007LocalizedQlSpec[] {
  return Object.freeze(source.map((ql) => Object.freeze({
    ...ql,
    stemFamilies: Object.freeze(ql.stemFamilies.map((family) => {
      const replacement = replacements[family.familyId];
      return replacement ? Object.freeze({ ...family, ...replacement }) : family;
    })),
  })));
}

export const TSD_CP007_EFFECTIVE_HINDI_LOCALIZATION = apply(TSD_CP007_HINDI_LOCALIZATION, hindiReplacements);
export const TSD_CP007_EFFECTIVE_PUNJABI_LOCALIZATION = apply(TSD_CP007_PUNJABI_LOCALIZATION, punjabiReplacements);
