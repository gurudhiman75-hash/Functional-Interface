import { buildCp004EditorialV2Visual, renderCp004NativeEditorialV2Stem } from "./editorial-v2";
import { renderCp004PolishedNativeQuestion, type TsdCp004FinalNativeQuestion } from "./native-polished";
import type { TsdCp004NativeLanguage } from "./native";
import type { TsdCp004Explanation, TsdCp004Question } from "./types";

const METHODS = Object.freeze({
  hi: Object.freeze({
    RELATIVE_SPEED_OPPOSITE: "एक-दूसरे की ओर चलते पिंडों के लिए दोनों गतियाँ जोड़ें।",
    RELATIVE_SPEED_SAME_DIRECTION: "एक ही दिशा में तेज गति में से धीमी गति घटाएँ।",
    FIRST_MEETING_TIME: "शुरुआती अंतर को सही सापेक्ष पकड़ गति से भाग देकर पहली मुलाकात का समय निकालें।",
    INITIAL_GAP_FROM_MEETING: "दिया गया मिलने का समय और सापेक्ष गति लेकर शुरुआती अंतर वापस निकालें।",
    UNKNOWN_SPEED_FROM_MEETING: "पहले अंतर और समय से आवश्यक सापेक्ष गति निकालें, फिर ज्ञात गति से अज्ञात गति अलग करें।",
    HEAD_START_CATCH_UP_TIME: "शुरुआती बढ़त को एक-दिशीय सापेक्ष पकड़ गति से भाग दें।",
    HEAD_START_DISTANCE: "गति के अंतर को पकड़ने के समय से गुणा करके शुरुआती बढ़त निकालें।",
    DELAYED_START_CATCH_UP_TIME: "पहले शुरुआती देरी से बनी दूरी की बढ़त निकालें, फिर उसे गति के अंतर से मिटाएँ।",
    START_DELAY_FROM_CATCH_UP: "पीछा के दौरान मिटाई गई बढ़त को पहले चलने वाले की शुरुआती बढ़त मानकर देरी निकालें।",
    SEPARATION_AFTER_TIME: "शुरुआती अंतर में सापेक्ष दूरी जोड़ें या घटाएँ, इस पर निर्भर कि पिंड दूर जा रहे हैं या पास आ रहे हैं।",
    TIME_TO_SPECIFIED_SEPARATION: "अंतर में जितना बदलाव चाहिए, उसे सापेक्ष गति से भाग दें।",
    MEETING_POINT_DISTANCE_SPLIT: "समान मिलने के समय के कारण मार्ग को दोनों गतियों के अनुपात में बाँटें।",
    SPEED_RATIO_FROM_MEETING_POINT: "समान समय के कारण गति अनुपात को तय की गई दूरियों के अनुपात के बराबर रखें।",
    MEETING_POINT_FROM_SPEED_RATIO: "पूरे मार्ग को दिए गए गति अनुपात में बाँटकर मिलने का बिंदु निकालें।",
    REQUIRED_SPEED_FOR_MEETING_DEADLINE: "समय सीमा से आवश्यक सापेक्ष पकड़ गति निकालें और फिर आवश्यक व्यक्तिगत गति अलग करें।",
    MULTI_PURSUER_MEETING_ORDER: "हर पीछा करने वाले का पकड़ने का समय अलग-अलग निकालकर सबसे छोटा समय चुनें।",
  }),
  pa: Object.freeze({
    RELATIVE_SPEED_OPPOSITE: "ਇੱਕ-ਦੂਜੇ ਵੱਲ ਚੱਲਦੇ ਪਿੰਡਾਂ ਲਈ ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਜੋੜੋ।",
    RELATIVE_SPEED_SAME_DIRECTION: "ਇੱਕੋ ਦਿਸ਼ਾ ਵਿੱਚ ਤੇਜ਼ ਰਫ਼ਤਾਰ ਵਿੱਚੋਂ ਹੌਲੀ ਰਫ਼ਤਾਰ ਘਟਾਓ।",
    FIRST_MEETING_TIME: "ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲੇ ਨੂੰ ਸਹੀ ਸਾਪੇਖ ਪਕੜ ਰਫ਼ਤਾਰ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਪਹਿਲੀ ਮੁਲਾਕਾਤ ਦਾ ਸਮਾਂ ਕੱਢੋ।",
    INITIAL_GAP_FROM_MEETING: "ਦਿੱਤੇ ਮਿਲਣ ਦੇ ਸਮੇਂ ਅਤੇ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਾਲ ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲਾ ਵਾਪਸ ਕੱਢੋ।",
    UNKNOWN_SPEED_FROM_MEETING: "ਪਹਿਲਾਂ ਫ਼ਾਸਲੇ ਅਤੇ ਸਮੇਂ ਤੋਂ ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਕੱਢੋ, ਫਿਰ ਜਾਣੀ ਰਫ਼ਤਾਰ ਤੋਂ ਅਣਜਾਣ ਰਫ਼ਤਾਰ ਵੱਖ ਕਰੋ।",
    HEAD_START_CATCH_UP_TIME: "ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਨੂੰ ਇੱਕੋ-ਦਿਸ਼ਾ ਸਾਪੇਖ ਪਕੜ ਰਫ਼ਤਾਰ ਨਾਲ ਭਾਗ ਦਿਓ।",
    HEAD_START_DISTANCE: "ਰਫ਼ਤਾਰ ਦੇ ਅੰਤਰ ਨੂੰ ਪਕੜਨ ਦੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਕੇ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਕੱਢੋ।",
    DELAYED_START_CATCH_UP_TIME: "ਪਹਿਲਾਂ ਸ਼ੁਰੂਆਤੀ ਦੇਰੀ ਨਾਲ ਬਣੀ ਦੂਰੀ ਦੀ ਬੜ੍ਹਤ ਕੱਢੋ, ਫਿਰ ਉਸਨੂੰ ਰਫ਼ਤਾਰ ਦੇ ਅੰਤਰ ਨਾਲ ਮਿਟਾਓ।",
    START_DELAY_FROM_CATCH_UP: "ਪਿੱਛੇ ਦੌਰਾਨ ਮਿਟਾਈ ਬੜ੍ਹਤ ਨੂੰ ਪਹਿਲਾਂ ਚੱਲਣ ਵਾਲੇ ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੜ੍ਹਤ ਮੰਨ ਕੇ ਦੇਰੀ ਕੱਢੋ।",
    SEPARATION_AFTER_TIME: "ਸ਼ੁਰੂਆਤੀ ਫ਼ਾਸਲੇ ਵਿੱਚ ਸਾਪੇਖ ਦੂਰੀ ਜੋੜੋ ਜਾਂ ਘਟਾਓ, ਇਸ ਅਨੁਸਾਰ ਕਿ ਪਿੰਡ ਦੂਰ ਜਾ ਰਹੇ ਹਨ ਜਾਂ ਨੇੜੇ ਆ ਰਹੇ ਹਨ।",
    TIME_TO_SPECIFIED_SEPARATION: "ਫ਼ਾਸਲੇ ਵਿੱਚ ਜਿੰਨਾ ਬਦਲਾਅ ਚਾਹੀਦਾ ਹੈ, ਉਸਨੂੰ ਸਾਪੇਖ ਰਫ਼ਤਾਰ ਨਾਲ ਭਾਗ ਦਿਓ।",
    MEETING_POINT_DISTANCE_SPLIT: "ਇੱਕੋ ਮਿਲਣ ਦੇ ਸਮੇਂ ਕਰਕੇ ਰਸਤੇ ਨੂੰ ਦੋਵੇਂ ਰਫ਼ਤਾਰਾਂ ਦੇ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡੋ।",
    SPEED_RATIO_FROM_MEETING_POINT: "ਇੱਕੋ ਸਮੇਂ ਕਰਕੇ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਨੂੰ ਤੈਅ ਦੂਰੀਆਂ ਦੇ ਅਨੁਪਾਤ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।",
    MEETING_POINT_FROM_SPEED_RATIO: "ਪੂਰੇ ਰਸਤੇ ਨੂੰ ਦਿੱਤੇ ਰਫ਼ਤਾਰ ਅਨੁਪਾਤ ਵਿੱਚ ਵੰਡ ਕੇ ਮਿਲਣ ਦਾ ਬਿੰਦੂ ਕੱਢੋ।",
    REQUIRED_SPEED_FOR_MEETING_DEADLINE: "ਸਮਾਂ ਸੀਮਾ ਤੋਂ ਲੋੜੀਂਦੀ ਸਾਪੇਖ ਪਕੜ ਰਫ਼ਤਾਰ ਕੱਢੋ ਅਤੇ ਫਿਰ ਲੋੜੀਂਦੀ ਵਿਅਕਤੀਗਤ ਰਫ਼ਤਾਰ ਵੱਖ ਕਰੋ।",
    MULTI_PURSUER_MEETING_ORDER: "ਹਰ ਪਿੱਛਾ ਕਰਨ ਵਾਲੇ ਦਾ ਪਕੜਨ ਦਾ ਸਮਾਂ ਵੱਖ-ਵੱਖ ਕੱਢ ਕੇ ਸਭ ਤੋਂ ਛੋਟਾ ਸਮਾਂ ਚੁਣੋ।",
  }),
});

function withMethod(base: TsdCp004Explanation, language: TsdCp004NativeLanguage, authorityId: TsdCp004Question["authorityId"]): TsdCp004Explanation {
  return Object.freeze({
    ...base,
    method: METHODS[language][authorityId],
  });
}

export function renderCp004EditorialV2NativeQuestion(english: TsdCp004Question, language: TsdCp004NativeLanguage): TsdCp004FinalNativeQuestion {
  const base = renderCp004PolishedNativeQuestion(english, language);
  return Object.freeze({
    ...base,
    stem: renderCp004NativeEditorialV2Stem(english, language),
    visual: buildCp004EditorialV2Visual(english.state, language),
    explanation: withMethod(base.explanation, language, english.authorityId),
  });
}
