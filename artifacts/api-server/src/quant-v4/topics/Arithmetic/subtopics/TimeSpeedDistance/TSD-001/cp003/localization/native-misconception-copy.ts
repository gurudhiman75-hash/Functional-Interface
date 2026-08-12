import type { TsdCp003MisconceptionId } from "../runtime-types";
import type { TsdCp003NativeLanguage } from "./native-language-primitives";

type WrongId = Exclude<TsdCp003MisconceptionId, "CORRECT">;
type Copy = Readonly<{ hi: string; pa: string }>;
const copy = (hi: string, pa: string): Copy => Object.freeze({ hi, pa });

export const TSD_CP003_EXPLICIT_NATIVE_MISCONCEPTIONS: readonly WrongId[] = Object.freeze([
  "USE_FASTER_SPEED_ONLY",
  "COUNT_ONE_EXTRA_STOP",
  "MISS_ONE_STOP",
  "USE_OLD_TRAVEL_TIME",
  "USE_NEW_TRAVEL_TIME",
  "MULTIPLY_TIME_GAP_BY_SPEED_DIFFERENCE",
  "USE_SLOWER_SPEED_ONLY",
  "USE_SPEED_LOSS_RATIO_AS_TIME",
  "ADD_TRAVEL_TIMES",
  "USE_ARITHMETIC_MEAN_SPEED",
  "IGNORE_EARLY_COMPONENT",
  "COPY_DEPARTURE_CLOCK",
  "DOUBLE_TRAVEL_TIME_ON_CLOCK",
  "SUBTRACT_TRAVEL_TIME_FROM_CLOCK",
  "USE_DOUBLE_AVAILABLE_TIME",
  "TREAT_DISTANCE_AS_SPEED",
  "CONTINUE_AT_INITIAL_SPEED",
  "USE_OVERALL_AVERAGE_SPEED",
  "IGNORE_TIME_ALREADY_SPENT",
  "APPLY_SPEED_LOSS_TO_RUNNING_TIME",
  "IGNORE_STOPS",
  "APPLY_STOP_SHARE_AS_SPEED_REDUCTION",
  "SUBTRACT_STOP_DISTANCE_BEFORE_AVERAGING",
  "USE_OVERALL_SPEED_AS_RUNNING_SPEED",
  "DOUBLE_STOP_SHARE_AS_SPEED_INCREASE",
  "APPLY_STOP_SHARE_AS_SPEED_INCREASE",
  "MISS_TWO_STOPS",
  "COUNT_ONLY_ONE_STOP",
  "USE_TRAVEL_SECTION_TIME_AS_REST",
  "USE_TOTAL_REST_AS_ONE_REST",
  "COUNT_ONE_STOP_ONLY",
  "HALVE_ROUTE_BY_DEFAULT",
  "USE_FIRST_HOUR_DISTANCE",
  "ASSUME_EQUAL_ROUTE_SPLIT",
  "USE_COMPLEMENT_ROUTE_FRACTION",
  "ASSUME_FIXED_ROUTE_FRACTION",
  "IGNORE_FINAL_DELAY",
  "USE_ONE_TRAVEL_TIME",
  "ADD_TRAVEL_TIMES_FOR_SHIFT",
  "SUBTRACT_SHIFT_COMPONENTS",
  "IGNORE_DEPARTURE_SHIFT",
  "USE_OTHER_MODE_COMPONENT",
  "ASSUME_EQUAL_MODE_SPLIT",
  "USE_TOTAL_QUANTITY",
  "USE_HALF_KNOWN_SPEED",
  "COPY_KNOWN_SPEED",
  "REVERSE_TIME_GAP_DIRECTION",
  "USE_HALF_AVAILABLE_TIME",
  "APPLY_SPEED_LOSS_TO_OVERALL_TIME",
  "SUBTRACT_ONLY_ONE_TRAVEL_SECTION",
  "USE_SECOND_HOUR_DISTANCE",
  "USE_FINAL_DELAY_ONLY",
  "IGNORE_SPEED_SHIFT",
  "USE_RATIO_MEAN_SPEED",
  "USE_ONE_EXTRA_RATIO_PART",
  "USE_OTHER_RATIO_SPEED",
  "USE_TWO_THIRDS_AVAILABLE_TIME",
  "IGNORE_TRAVEL_TIME",
  "QUARTER_ROUTE_BY_DEFAULT",
  "SUBTRACT_FINAL_DELAY",
  "AVERAGE_TRAVEL_TIMES_FOR_SHIFT",
]);

const EXPLICIT = new Set<TsdCp003MisconceptionId>(TSD_CP003_EXPLICIT_NATIVE_MISCONCEPTIONS);

export function hasExplicitNativeMisconceptionCopy(id: TsdCp003MisconceptionId): boolean {
  return id === "CORRECT" || EXPLICIT.has(id);
}

function reasonFor(id: TsdCp003MisconceptionId): Copy {
  switch (id) {
    case "CORRECT":
      return copy("यह विकल्प सभी दी गई शर्तों को सही क्रम में लागू करने पर मिलता है।", "ਇਹ ਵਿਕਲਪ ਸਾਰੀਆਂ ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਨੂੰ ਸਹੀ ਕ੍ਰਮ ਵਿੱਚ ਲਾਗੂ ਕਰਨ ਉੱਤੇ ਮਿਲਦਾ ਹੈ।");
    case "USE_FASTER_SPEED_ONLY":
      return copy("समय-अंतर को पूरी तेज यात्रा का समय मानकर तेज गति से दूरी निकाल दी गई है।", "ਸਮੇਂ ਦੇ ਅੰਤਰ ਨੂੰ ਪੂਰੇ ਤੇਜ਼ ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਮੰਨ ਕੇ ਵੱਧ ਰਫ਼ਤਾਰ ਨਾਲ ਦੂਰੀ ਕੱਢ ਦਿੱਤੀ ਗਈ ਹੈ।");
    case "USE_SLOWER_SPEED_ONLY":
      return copy("समय-अंतर को पूरी धीमी यात्रा का समय मानकर कम गति से दूरी निकाल दी गई है।", "ਸਮੇਂ ਦੇ ਅੰਤਰ ਨੂੰ ਪੂਰੇ ਹੌਲੇ ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਮੰਨ ਕੇ ਘੱਟ ਰਫ਼ਤਾਰ ਨਾਲ ਦੂਰੀ ਕੱਢ ਦਿੱਤੀ ਗਈ ਹੈ।");
    case "MULTIPLY_TIME_GAP_BY_SPEED_DIFFERENCE":
      return copy("समय के अंतर को गति के अंतर से गुणा किया गया है, जबकि समान दूरी में व्युत्क्रम गति का संबंध चाहिए।", "ਸਮੇਂ ਦੇ ਅੰਤਰ ਨੂੰ ਰਫ਼ਤਾਰ ਦੇ ਅੰਤਰ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ, ਜਦਕਿ ਇੱਕੋ ਦੂਰੀ ਵਿੱਚ ਉਲਟੀ ਰਫ਼ਤਾਰ ਦਾ ਸੰਬੰਧ ਚਾਹੀਦਾ ਹੈ।");
    case "ADD_TRAVEL_TIMES":
      return copy("दो यात्रा-समयों का अंतर लेने के बजाय उन्हें जोड़ दिया गया है।", "ਦੋ ਸਫ਼ਰ-ਸਮਿਆਂ ਦਾ ਅੰਤਰ ਲੈਣ ਦੀ ਥਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "USE_ONE_TRAVEL_TIME":
      return copy("केवल एक यात्रा का समय लिया गया है; प्रश्न दोनों स्थितियों के समय-अंतर के बारे में है।", "ਸਿਰਫ਼ ਇੱਕ ਸਫ਼ਰ ਦਾ ਸਮਾਂ ਲਿਆ ਗਿਆ ਹੈ; ਪ੍ਰਸ਼ਨ ਦੋਵੇਂ ਹਾਲਤਾਂ ਦੇ ਸਮੇਂ ਦੇ ਅੰਤਰ ਬਾਰੇ ਹੈ।");
    case "USE_ARITHMETIC_MEAN_SPEED":
      return copy("दो दी गई गतियों का साधारण औसत लिया गया है, लेकिन समय-सारणी वाली स्थिति में यह औसत लागू नहीं होता।", "ਦੋ ਦਿੱਤੀਆਂ ਰਫ਼ਤਾਰਾਂ ਦਾ ਸਧਾਰਣ ਔਸਤ ਲਿਆ ਗਿਆ ਹੈ, ਪਰ ਸਮਾਂ-ਸਾਰਣੀ ਵਾਲੀ ਸਥਿਤੀ ਵਿੱਚ ਇਹ ਔਸਤ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦਾ।");
    case "USE_RATIO_MEAN_SPEED":
      return copy("गति-अनुपात के भागों का औसत लेकर गति बनाई गई है; पहले समान गुणक निकालना आवश्यक है।", "ਰਫ਼ਤਾਰ-ਅਨੁਪਾਤ ਦੇ ਭਾਗਾਂ ਦਾ ਔਸਤ ਲੈ ਕੇ ਰਫ਼ਤਾਰ ਬਣਾਈ ਗਈ ਹੈ; ਪਹਿਲਾਂ ਸਾਂਝਾ ਗੁਣਕ ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਹੈ।");
    case "USE_ONE_EXTRA_RATIO_PART":
      return copy("माँगे गए अनुपात-भाग के बजाय एक अतिरिक्त भाग जोड़ दिया गया है।", "ਮੰਗੇ ਗਏ ਅਨੁਪਾਤ-ਭਾਗ ਦੀ ਥਾਂ ਇੱਕ ਵਾਧੂ ਭਾਗ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "USE_OTHER_RATIO_SPEED":
      return copy("माँगी गई गति के बजाय अनुपात की दूसरी गति चुन ली गई है।", "ਮੰਗੀ ਗਈ ਰਫ਼ਤਾਰ ਦੀ ਥਾਂ ਅਨੁਪਾਤ ਵਾਲੀ ਦੂਜੀ ਰਫ਼ਤਾਰ ਚੁਣ ਲਈ ਗਈ ਹੈ।");
    case "USE_HALF_KNOWN_SPEED":
      return copy("दी हुई गति को बिना समय-संबंध बनाए आधा कर दिया गया है।", "ਦਿੱਤੀ ਰਫ਼ਤਾਰ ਨੂੰ ਸਮੇਂ ਦਾ ਸੰਬੰਧ ਬਣਾਏ ਬਿਨਾਂ ਅੱਧਾ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "COPY_KNOWN_SPEED":
      return copy("दूसरी गति निकालने के बजाय दी हुई गति को ही उत्तर मान लिया गया है।", "ਦੂਜੀ ਰਫ਼ਤਾਰ ਕੱਢਣ ਦੀ ਥਾਂ ਦਿੱਤੀ ਰਫ਼ਤਾਰ ਨੂੰ ਹੀ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "REVERSE_TIME_GAP_DIRECTION":
      return copy("समय-अंतर को उलटी दिशा में लगाया गया है, इसलिए तेज और धीमी स्थिति आपस में बदल गई है।", "ਸਮੇਂ ਦੇ ਅੰਤਰ ਨੂੰ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਇਸ ਕਰਕੇ ਤੇਜ਼ ਅਤੇ ਹੌਲੀ ਸਥਿਤੀ ਆਪਸ ਵਿੱਚ ਬਦਲ ਗਈ ਹੈ।");
    case "IGNORE_EARLY_COMPONENT":
      return copy("केवल देर से पहुँचने वाला समय लिया गया है; पहले पहुँचने वाला भाग भी कुल अंतर में जोड़ना चाहिए।", "ਸਿਰਫ਼ ਦੇਰ ਨਾਲ ਪਹੁੰਚਣ ਵਾਲਾ ਸਮਾਂ ਲਿਆ ਗਿਆ ਹੈ; ਪਹਿਲਾਂ ਪਹੁੰਚਣ ਵਾਲਾ ਭਾਗ ਵੀ ਕੁੱਲ ਅੰਤਰ ਵਿੱਚ ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ।");
    case "COPY_DEPARTURE_CLOCK":
      return copy("यात्रा-समय जोड़े बिना प्रस्थान का समय ही आगमन समय मान लिया गया है।", "ਸਫ਼ਰ-ਸਮਾਂ ਜੋੜੇ ਬਿਨਾਂ ਰਵਾਨਗੀ ਦਾ ਸਮਾਂ ਹੀ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "DOUBLE_TRAVEL_TIME_ON_CLOCK":
      return copy("यात्रा-समय को घड़ी में एक बार की जगह दो बार जोड़ दिया गया है।", "ਸਫ਼ਰ-ਸਮੇਂ ਨੂੰ ਘੜੀ ਵਿੱਚ ਇੱਕ ਵਾਰ ਦੀ ਥਾਂ ਦੋ ਵਾਰ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "SUBTRACT_TRAVEL_TIME_FROM_CLOCK":
      return copy("आगमन के लिए यात्रा-समय जोड़ने के बजाय प्रस्थान समय से घटा दिया गया है।", "ਪਹੁੰਚਣ ਲਈ ਸਫ਼ਰ-ਸਮਾਂ ਜੋੜਨ ਦੀ ਥਾਂ ਰਵਾਨਗੀ ਦੇ ਸਮੇਂ ਵਿੱਚੋਂ ਘਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "USE_DOUBLE_AVAILABLE_TIME":
      return copy("वास्तव में उपलब्ध समय को दुगुना मान लिया गया है, इसलिए आवश्यक गति कम निकलती है।", "ਅਸਲ ਉਪਲਬਧ ਸਮੇਂ ਨੂੰ ਦੁੱਗਣਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਘੱਟ ਨਿਕਲਦੀ ਹੈ।");
    case "USE_HALF_AVAILABLE_TIME":
      return copy("उपलब्ध समय को आधा मान लिया गया है, इसलिए आवश्यक गति अनावश्यक रूप से बढ़ जाती है।", "ਉਪਲਬਧ ਸਮੇਂ ਨੂੰ ਅੱਧਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ, ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਬਿਨਾਂ ਲੋੜ ਵੱਧ ਜਾਂਦੀ ਹੈ।");
    case "USE_TWO_THIRDS_AVAILABLE_TIME":
      return copy("दी हुई उपलब्ध अवधि के बजाय उसका केवल दो-तिहाई हिस्सा उपयोग किया गया है।", "ਦਿੱਤੀ ਉਪਲਬਧ ਮਿਆਦ ਦੀ ਥਾਂ ਉਸਦਾ ਸਿਰਫ਼ ਦੋ-ਤਿਹਾਈ ਹਿੱਸਾ ਵਰਤਿਆ ਗਿਆ ਹੈ।");
    case "TREAT_DISTANCE_AS_SPEED":
      return copy("दूरी के मान को ही गति मान लिया गया है; दूरी को उपलब्ध समय से भाग देना चाहिए।", "ਦੂਰੀ ਦੇ ਮਾਨ ਨੂੰ ਹੀ ਰਫ਼ਤਾਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਦੂਰੀ ਨੂੰ ਉਪਲਬਧ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।");
    case "CONTINUE_AT_INITIAL_SPEED":
      return copy("पहले भाग की गति को शेष मार्ग पर भी जारी मान लिया गया है, बिना समय-सीमा जाँचे।", "ਪਹਿਲੇ ਭਾਗ ਦੀ ਰਫ਼ਤਾਰ ਨੂੰ ਬਾਕੀ ਰਸਤੇ ਉੱਤੇ ਵੀ ਜਾਰੀ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ, ਸਮਾਂ-ਸੀਮਾ ਜਾਂਚੇ ਬਿਨਾਂ।");
    case "USE_OVERALL_AVERAGE_SPEED":
      return copy("पूरे मार्ग की नियोजित औसत गति को ही शेष भाग की आवश्यक गति मान लिया गया है।", "ਪੂਰੇ ਰਸਤੇ ਦੀ ਨਿਰਧਾਰਤ ਔਸਤ ਰਫ਼ਤਾਰ ਨੂੰ ਹੀ ਬਾਕੀ ਭਾਗ ਦੀ ਲੋੜੀਂਦੀ ਰਫ਼ਤਾਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "IGNORE_TIME_ALREADY_SPENT":
      return copy("पहले भाग में लग चुका समय नहीं घटाया गया और शेष दूरी को पूरा निर्धारित समय दे दिया गया है।", "ਪਹਿਲੇ ਭਾਗ ਵਿੱਚ ਲੱਗ ਚੁੱਕਿਆ ਸਮਾਂ ਨਹੀਂ ਘਟਾਇਆ ਗਿਆ ਅਤੇ ਬਾਕੀ ਦੂਰੀ ਨੂੰ ਪੂਰਾ ਨਿਰਧਾਰਤ ਸਮਾਂ ਦੇ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "USE_SPEED_LOSS_RATIO_AS_TIME":
      return copy("गति में कमी के अनुपात को सीधे समय मान लिया गया है; वास्तविक यात्रा-समय निकालना जरूरी है।", "ਰਫ਼ਤਾਰ ਵਿੱਚ ਕਮੀ ਦੇ ਅਨੁਪਾਤ ਨੂੰ ਸਿੱਧਾ ਸਮਾਂ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਅਸਲ ਸਫ਼ਰ-ਸਮਾਂ ਕੱਢਣਾ ਲਾਜ਼ਮੀ ਹੈ।");
    case "APPLY_SPEED_LOSS_TO_RUNNING_TIME":
      return copy("गति की कमी का अनुपात केवल चलने के समय पर लगाकर रुकने का समय निकाला गया है।", "ਰਫ਼ਤਾਰ ਦੀ ਕਮੀ ਦਾ ਅਨੁਪਾਤ ਸਿਰਫ਼ ਚੱਲਣ ਦੇ ਸਮੇਂ ਉੱਤੇ ਲਗਾ ਕੇ ਰੁਕਣ ਦਾ ਸਮਾਂ ਕੱਢਿਆ ਗਿਆ ਹੈ।");
    case "APPLY_SPEED_LOSS_TO_OVERALL_TIME":
      return copy("गति की कमी का अनुपात पूरे समय पर सीधे लगाया गया है, जबकि चलने और रुकने के समय अलग करने चाहिए।", "ਰਫ਼ਤਾਰ ਦੀ ਕਮੀ ਦਾ ਅਨੁਪਾਤ ਪੂਰੇ ਸਮੇਂ ਉੱਤੇ ਸਿੱਧਾ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਚੱਲਣ ਅਤੇ ਰੁਕਣ ਦੇ ਸਮੇਂ ਵੱਖ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।");
    case "IGNORE_STOPS":
      return copy("रुकने का समय पूरी तरह छोड़कर चलने की गति को ही कुल औसत गति मान लिया गया है।", "ਰੁਕਣ ਦਾ ਸਮਾਂ ਪੂਰੀ ਤਰ੍ਹਾਂ ਛੱਡ ਕੇ ਚੱਲਣ ਦੀ ਰਫ਼ਤਾਰ ਨੂੰ ਹੀ ਕੁੱਲ ਔਸਤ ਰਫ਼ਤਾਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "APPLY_STOP_SHARE_AS_SPEED_REDUCTION":
      return copy("रुकने के समय का हिस्सा सीधे गति में प्रतिशत कमी की तरह लगाया गया है।", "ਰੁਕਣ ਦੇ ਸਮੇਂ ਦੇ ਹਿੱਸੇ ਨੂੰ ਸਿੱਧਾ ਰਫ਼ਤਾਰ ਵਿੱਚ ਪ੍ਰਤੀਸ਼ਤ ਕਮੀ ਵਾਂਗ ਲਗਾਇਆ ਗਿਆ ਹੈ।");
    case "SUBTRACT_STOP_DISTANCE_BEFORE_AVERAGING":
      return copy("रुकने के समय को दूरी की तरह मानकर कुल दूरी से घटाया गया है।", "ਰੁਕਣ ਦੇ ਸਮੇਂ ਨੂੰ ਦੂਰੀ ਵਾਂਗ ਮੰਨ ਕੇ ਕੁੱਲ ਦੂਰੀ ਵਿੱਚੋਂ ਘਟਾਇਆ ਗਿਆ ਹੈ।");
    case "USE_OVERALL_SPEED_AS_RUNNING_SPEED":
      return copy("रुकने सहित औसत गति को ही चलते समय की गति मान लिया गया है।", "ਰੁਕਣ ਸਮੇਤ ਔਸਤ ਰਫ਼ਤਾਰ ਨੂੰ ਹੀ ਚੱਲਣ ਸਮੇਂ ਦੀ ਰਫ਼ਤਾਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "DOUBLE_STOP_SHARE_AS_SPEED_INCREASE":
      return copy("रुकने के समय के हिस्से को दुगुना करके सीधे गति में जोड़ दिया गया है।", "ਰੁਕਣ ਦੇ ਸਮੇਂ ਦੇ ਹਿੱਸੇ ਨੂੰ ਦੁੱਗਣਾ ਕਰਕੇ ਸਿੱਧਾ ਰਫ਼ਤਾਰ ਵਿੱਚ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "APPLY_STOP_SHARE_AS_SPEED_INCREASE":
      return copy("रुकने के समय के हिस्से को सीधे गति-वृद्धि मान लिया गया है।", "ਰੁਕਣ ਦੇ ਸਮੇਂ ਦੇ ਹਿੱਸੇ ਨੂੰ ਸਿੱਧਾ ਰਫ਼ਤਾਰ-ਵਾਧਾ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "COUNT_ONE_EXTRA_STOP":
      return copy("वास्तविक संख्या से एक ठहराव अधिक गिन लिया गया है।", "ਅਸਲ ਗਿਣਤੀ ਨਾਲੋਂ ਇੱਕ ਠਹਿਰਾਅ ਵੱਧ ਗਿਣ ਲਿਆ ਗਿਆ ਹੈ।");
    case "MISS_ONE_STOP":
      return copy("वास्तविक संख्या से एक ठहराव कम गिना गया है।", "ਅਸਲ ਗਿਣਤੀ ਨਾਲੋਂ ਇੱਕ ਠਹਿਰਾਅ ਘੱਟ ਗਿਣਿਆ ਗਿਆ ਹੈ।");
    case "MISS_TWO_STOPS":
      return copy("वास्तविक संख्या से दो ठहराव कम गिने गए हैं।", "ਅਸਲ ਗਿਣਤੀ ਨਾਲੋਂ ਦੋ ਠਹਿਰਾਅ ਘੱਟ ਗਿਣੇ ਗਏ ਹਨ।");
    case "COUNT_ONLY_ONE_STOP":
      return copy("सभी ठहरावों के बजाय केवल एक ठहराव का समय लिया गया है।", "ਸਾਰੇ ਠਹਿਰਾਅਾਂ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਇੱਕ ਠਹਿਰਾਅ ਦਾ ਸਮਾਂ ਲਿਆ ਗਿਆ ਹੈ।");
    case "USE_TRAVEL_SECTION_TIME_AS_REST":
      return copy("एक यात्रा-खंड के समय को ही एक विश्राम की अवधि मान लिया गया है।", "ਇੱਕ ਸਫ਼ਰ-ਭਾਗ ਦੇ ਸਮੇਂ ਨੂੰ ਹੀ ਇੱਕ ਆਰਾਮ ਦੀ ਮਿਆਦ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "USE_TOTAL_REST_AS_ONE_REST":
      return copy("सभी विश्रामों के कुल समय को एक ही विश्राम का समय मान लिया गया है।", "ਸਾਰੇ ਆਰਾਮਾਂ ਦੇ ਕੁੱਲ ਸਮੇਂ ਨੂੰ ਇੱਕ ਹੀ ਆਰਾਮ ਦਾ ਸਮਾਂ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "IGNORE_TRAVEL_TIME":
      return copy("कुल बीता समय पूरा का पूरा विश्राम मान लिया गया है और यात्रा-समय नहीं घटाया गया।", "ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ ਪੂਰਾ ਆਰਾਮ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ ਅਤੇ ਸਫ਼ਰ-ਸਮਾਂ ਨਹੀਂ ਘਟਾਇਆ ਗਿਆ।");
    case "COUNT_ONE_STOP_ONLY":
      return copy("कुल समय में सभी ठहरावों के बजाय केवल एक ठहराव जोड़ा गया है।", "ਕੁੱਲ ਸਮੇਂ ਵਿੱਚ ਸਾਰੇ ਠਹਿਰਾਅਾਂ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਇੱਕ ਠਹਿਰਾਅ ਜੋੜਿਆ ਗਿਆ ਹੈ।");
    case "SUBTRACT_ONLY_ONE_TRAVEL_SECTION":
      return copy("कुल समय से सभी यात्रा-खंडों का समय घटाने के बजाय केवल एक खंड घटाया गया है।", "ਕੁੱਲ ਸਮੇਂ ਵਿੱਚੋਂ ਸਾਰੇ ਸਫ਼ਰ-ਭਾਗਾਂ ਦਾ ਸਮਾਂ ਘਟਾਉਣ ਦੀ ਥਾਂ ਸਿਰਫ਼ ਇੱਕ ਭਾਗ ਘਟਾਇਆ ਗਿਆ ਹੈ।");
    case "HALVE_ROUTE_BY_DEFAULT":
      return copy("बिना समीकरण बनाए गति बदलने का बिंदु मार्ग के ठीक आधे पर मान लिया गया है।", "ਸਮੀਕਰਨ ਬਣਾਏ ਬਿਨਾਂ ਰਫ਼ਤਾਰ ਬਦਲਣ ਦਾ ਬਿੰਦੂ ਰਸਤੇ ਦੇ ਠੀਕ ਅੱਧ ਉੱਤੇ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "QUARTER_ROUTE_BY_DEFAULT":
      return copy("बिना समय की शर्त उपयोग किए पहला भाग मार्ग का एक-चौथाई मान लिया गया है।", "ਸਮੇਂ ਦੀ ਸ਼ਰਤ ਵਰਤੇ ਬਿਨਾਂ ਪਹਿਲਾ ਭਾਗ ਰਸਤੇ ਦਾ ਇੱਕ-ਚੌਥਾਈ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "ASSUME_FIXED_ROUTE_FRACTION":
      return copy("दिए गए समय और गतियों से निकालने के बजाय मार्ग का एक तय हिस्सा अनुमान से मान लिया गया है।", "ਦਿੱਤੇ ਸਮੇਂ ਅਤੇ ਰਫ਼ਤਾਰਾਂ ਤੋਂ ਕੱਢਣ ਦੀ ਥਾਂ ਰਸਤੇ ਦਾ ਇੱਕ ਨਿਰਧਾਰਤ ਹਿੱਸਾ ਅੰਦਾਜ਼ੇ ਨਾਲ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "USE_FIRST_HOUR_DISTANCE":
      return copy("गति बदलने की वास्तविक दूरी के बजाय पहली गति से एक घंटे में तय दूरी ले ली गई है।", "ਰਫ਼ਤਾਰ ਬਦਲਣ ਦੀ ਅਸਲ ਦੂਰੀ ਦੀ ਥਾਂ ਪਹਿਲੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਤੈਅ ਦੂਰੀ ਲੈ ਲਈ ਗਈ ਹੈ।");
    case "USE_SECOND_HOUR_DISTANCE":
      return copy("गति बदलने की दूरी के बजाय दूसरी गति से एक घंटे में तय दूरी ले ली गई है।", "ਰਫ਼ਤਾਰ ਬਦਲਣ ਦੀ ਦੂਰੀ ਦੀ ਥਾਂ ਦੂਜੀ ਰਫ਼ਤਾਰ ਨਾਲ ਇੱਕ ਘੰਟੇ ਵਿੱਚ ਤੈਅ ਦੂਰੀ ਲੈ ਲਈ ਗਈ ਹੈ।");
    case "ASSUME_EQUAL_ROUTE_SPLIT":
      return copy("मार्ग के दोनों हिस्से बिना गणना के बराबर मान लिए गए हैं।", "ਰਸਤੇ ਦੇ ਦੋਵੇਂ ਹਿੱਸੇ ਬਿਨਾਂ ਗਣਨਾ ਦੇ ਬਰਾਬਰ ਮੰਨ ਲਏ ਗਏ ਹਨ।");
    case "USE_COMPLEMENT_ROUTE_FRACTION":
      return copy("माँगे गए बदली-गति वाले हिस्से के बजाय उसका पूरक हिस्सा चुन लिया गया है।", "ਮੰਗੇ ਗਏ ਬਦਲੀ-ਰਫ਼ਤਾਰ ਵਾਲੇ ਹਿੱਸੇ ਦੀ ਥਾਂ ਉਸਦਾ ਪੂਰਕ ਹਿੱਸਾ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।");
    case "IGNORE_FINAL_DELAY":
      return copy("तेज चलकर बचाया समय तो लिया गया है, लेकिन अंत में बची देरी नहीं जोड़ी गई।", "ਤੇਜ਼ ਚੱਲ ਕੇ ਬਚਾਇਆ ਸਮਾਂ ਲਿਆ ਗਿਆ ਹੈ, ਪਰ ਅੰਤ ਵਿੱਚ ਬਚੀ ਦੇਰੀ ਨਹੀਂ ਜੋੜੀ ਗਈ।");
    case "USE_FINAL_DELAY_ONLY":
      return copy("शुरू में गंवाए समय के लिए केवल अंतिम देरी ली गई है और तेज चलकर बचाया समय छोड़ दिया गया है।", "ਸ਼ੁਰੂ ਵਿੱਚ ਗੁਆਏ ਸਮੇਂ ਲਈ ਸਿਰਫ਼ ਅੰਤਿਮ ਦੇਰੀ ਲਈ ਗਈ ਹੈ ਅਤੇ ਤੇਜ਼ ਚੱਲ ਕੇ ਬਚਾਇਆ ਸਮਾਂ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "SUBTRACT_FINAL_DELAY":
      return copy("तेज चलकर बचाए समय में अंतिम देरी जोड़ने के बजाय उसे घटा दिया गया है।", "ਤੇਜ਼ ਚੱਲ ਕੇ ਬਚਾਏ ਸਮੇਂ ਵਿੱਚ ਅੰਤਿਮ ਦੇਰੀ ਜੋੜਨ ਦੀ ਥਾਂ ਉਸਨੂੰ ਘਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "USE_OLD_TRAVEL_TIME":
      return copy("समय के बदलाव के बजाय पुरानी यात्रा का पूरा समय उत्तर मान लिया गया है।", "ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਦੀ ਥਾਂ ਪੁਰਾਣੇ ਸਫ਼ਰ ਦਾ ਪੂਰਾ ਸਮਾਂ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "USE_NEW_TRAVEL_TIME":
      return copy("समय के बदलाव के बजाय नई यात्रा का पूरा समय उत्तर मान लिया गया है।", "ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਦੀ ਥਾਂ ਨਵੇਂ ਸਫ਼ਰ ਦਾ ਪੂਰਾ ਸਮਾਂ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    case "ADD_TRAVEL_TIMES_FOR_SHIFT":
      return copy("प्रस्थान के बदलाव के लिए पुराने और नए यात्रा-समय का अंतर लेने के बजाय दोनों समय जोड़ दिए गए हैं।", "ਰਵਾਨਗੀ ਦੇ ਬਦਲਾਅ ਲਈ ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਸਫ਼ਰ-ਸਮੇਂ ਦਾ ਅੰਤਰ ਲੈਣ ਦੀ ਥਾਂ ਦੋਵੇਂ ਸਮੇਂ ਜੋੜ ਦਿੱਤੇ ਗਏ ਹਨ।");
    case "AVERAGE_TRAVEL_TIMES_FOR_SHIFT":
      return copy("प्रस्थान-समय के बदलाव के लिए पुराने और नए यात्रा-समय का औसत ले लिया गया है।", "ਰਵਾਨਗੀ-ਸਮੇਂ ਦੇ ਬਦਲਾਅ ਲਈ ਪੁਰਾਣੇ ਅਤੇ ਨਵੇਂ ਸਫ਼ਰ-ਸਮੇਂ ਦਾ ਔਸਤ ਲੈ ਲਿਆ ਗਿਆ ਹੈ।");
    case "SUBTRACT_SHIFT_COMPONENTS":
      return copy("प्रस्थान और यात्रा-समय के बदलावों की वास्तविक दिशाएँ देखे बिना उन्हें सीधे घटा दिया गया है।", "ਰਵਾਨਗੀ ਅਤੇ ਸਫ਼ਰ-ਸਮੇਂ ਦੇ ਬਦਲਾਅਾਂ ਦੀ ਅਸਲ ਦਿਸ਼ਾ ਵੇਖੇ ਬਿਨਾਂ ਉਨ੍ਹਾਂ ਨੂੰ ਸਿੱਧਾ ਘਟਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "IGNORE_DEPARTURE_SHIFT":
      return copy("आगमन में बदलाव निकालते समय प्रस्थान-समय का बदलाव छोड़ दिया गया है।", "ਪਹੁੰਚਣ ਵਿੱਚ ਬਦਲਾਅ ਕੱਢਦੇ ਸਮੇਂ ਰਵਾਨਗੀ-ਸਮੇਂ ਦਾ ਬਦਲਾਅ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "IGNORE_SPEED_SHIFT":
      return copy("आगमन में बदलाव निकालते समय नई गति से बदला यात्रा-समय छोड़ दिया गया है।", "ਪਹੁੰਚਣ ਵਿੱਚ ਬਦਲਾਅ ਕੱਢਦੇ ਸਮੇਂ ਨਵੀਂ ਰਫ਼ਤਾਰ ਨਾਲ ਬਦਲਿਆ ਸਫ਼ਰ-ਸਮਾਂ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।");
    case "USE_OTHER_MODE_COMPONENT":
      return copy("पैदल/सवारी में प्रश्न जिस भाग को पूछता है, उसके बजाय दूसरा भाग चुन लिया गया है।", "ਪੈਦਲ/ਸਵਾਰੀ ਵਿੱਚ ਪ੍ਰਸ਼ਨ ਜਿਸ ਭਾਗ ਨੂੰ ਪੁੱਛਦਾ ਹੈ, ਉਸਦੀ ਥਾਂ ਦੂਜਾ ਭਾਗ ਚੁਣ ਲਿਆ ਗਿਆ ਹੈ।");
    case "ASSUME_EQUAL_MODE_SPLIT":
      return copy("पैदल और सवारी के हिस्से बिना समीकरण बनाए बराबर मान लिए गए हैं।", "ਪੈਦਲ ਅਤੇ ਸਵਾਰੀ ਦੇ ਹਿੱਸੇ ਬਿਨਾਂ ਸਮੀਕਰਨ ਬਣਾਏ ਬਰਾਬਰ ਮੰਨ ਲਏ ਗਏ ਹਨ।");
    case "USE_TOTAL_QUANTITY":
      return copy("माँगे गए पैदल/सवारी हिस्से के बजाय पूरी दूरी या पूरा समय उत्तर मान लिया गया है।", "ਮੰਗੇ ਗਏ ਪੈਦਲ/ਸਵਾਰੀ ਹਿੱਸੇ ਦੀ ਥਾਂ ਪੂਰੀ ਦੂਰੀ ਜਾਂ ਪੂਰਾ ਸਮਾਂ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।");
    default:
      throw new Error(`No explicit native misconception copy for accepted misconception ${id}`);
  }
}

export function nativeMisconceptionReason(
  id: TsdCp003MisconceptionId,
  language: TsdCp003NativeLanguage,
): string {
  const value = reasonFor(id);
  return language === "hi" ? value.hi : value.pa;
}
