import {
  asInteger,
  type Cp004AnswerSemantic,
  type Cp004Frequency,
  type Cp004MathematicalState,
} from "./cp004-frequency-math";
import { moneyText, percentText } from "./cp004-frequency-options";
import type { IntCp004EnglishFrozenQuestion } from "./cp004-english-frozen-runtime";
import {
  assertCp004LocalizedText,
  cp004CorrectFeedback,
  cp004FrequencyLabel,
  cp004MonthsText,
  cp004YearsText,
} from "./cp004-localization-language-pack";
import type {
  IntCp004LocalizedLocale,
  IntCp004LocalizedOption,
} from "./cp004-localization-types";

export const INT_CP004_LOCALIZED_OPTION_VERSION = "INT-CP-004-HI-PA-OPTIONS-v1" as const;

type FeedbackPair = Readonly<{ hi: string; pa: string }>;

const FEEDBACK: Readonly<Record<string, FeedbackPair>> = Object.freeze({
  USED_SIMPLE_INTEREST: {
    hi: "यह गणना चक्रवृद्धि ब्याज के स्थान पर साधारण ब्याज लगाती है। प्रत्येक अवधि के बाद ब्याज नई शेष राशि में जुड़ना चाहिए।",
    pa: "ਇਸ ਗਿਣਤੀ ਵਿੱਚ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਦੀ ਥਾਂ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਗਿਆ ਹੈ। ਹਰ ਅਵਧੀ ਤੋਂ ਬਾਅਦ ਵਿਆਜ ਨਵੇਂ ਬਕਾਏ ਵਿੱਚ ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  MISSED_ONE_PERIOD: {
    hi: "चक्रवृद्धि की एक निर्धारित अवधि छोड़ दी गई है।",
    pa: "ਚੱਕਰਵੱਧੀ ਦੀ ਇੱਕ ਨਿਰਧਾਰਤ ਅਵਧੀ ਛੱਡ ਦਿੱਤੀ ਗਈ ਹੈ।",
  },
  RETURNED_PRINCIPAL: {
    hi: "यह केवल प्रारम्भिक मूलधन है, जबकि प्रश्न अंतिम राशि पूछता है।",
    pa: "ਇਹ ਕੇਵਲ ਸ਼ੁਰੂਆਤੀ ਮੂਲਧਨ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਅੰਤਿਮ ਰਕਮ ਪੁੱਛਦਾ ਹੈ।",
  },
  RETURNED_AMOUNT: {
    hi: "यह अंतिम राशि है, केवल अर्जित ब्याज नहीं।",
    pa: "ਇਹ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਕੇਵਲ ਕਮਾਇਆ ਵਿਆਜ ਨਹੀਂ।",
  },
  RETURNED_FINAL_AMOUNT: {
    hi: "दी गई अंतिम राशि को मूलधन मान लिया गया है; मूलधन प्राप्त करने के लिए वृद्धि को उलटना होगा।",
    pa: "ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਨੂੰ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਮੂਲਧਨ ਲਈ ਵਾਧੇ ਨੂੰ ਉਲਟਣਾ ਪਵੇਗਾ।",
  },
  REMOVED_ONLY_ONE_PERIOD: {
    hi: "केवल एक अवधि की वृद्धि हटाई गई है, जबकि सभी चक्रवृद्धि अवधियाँ उलटनी हैं।",
    pa: "ਕੇਵਲ ਇੱਕ ਅਵਧੀ ਦਾ ਵਾਧਾ ਹਟਾਇਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਸਾਰੀਆਂ ਚੱਕਰਵੱਧੀ ਅਵਧੀਆਂ ਉਲਟਣੀਆਂ ਹਨ।",
  },
  REVERSED_SIMPLE_INTEREST: {
    hi: "गणना पीछे जाते समय साधारण ब्याज का नियम लगाती है, जबकि दी गई वृद्धि चक्रवृद्धि है।",
    pa: "ਪਿੱਛੇ ਗਿਣਦੇ ਸਮੇਂ ਸਧਾਰਣ ਵਿਆਜ ਦਾ ਨਿਯਮ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਦਿੱਤਾ ਵਾਧਾ ਚੱਕਰਵੱਧੀ ਹੈ।",
  },
  RETURNED_GIVEN_INTEREST: {
    hi: "दिए गए चक्रवृद्धि ब्याज को ही मूलधन मान लिया गया है।",
    pa: "ਦਿੱਤੇ ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨੂੰ ਹੀ ਮੂਲਧਨ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।",
  },
  USED_SIMPLE_INTEREST_INVERSE: {
    hi: "यह उलटी गणना I = PRT वाले साधारण ब्याज संबंध से करती है, जबकि ब्याज चक्रवृद्धि है।",
    pa: "ਇਹ ਉਲਟੀ ਗਿਣਤੀ I = PRT ਵਾਲੇ ਸਧਾਰਣ ਵਿਆਜ ਸੰਬੰਧ ਨਾਲ ਕਰਦੀ ਹੈ, ਜਦਕਿ ਵਿਆਜ ਚੱਕਰਵੱਧੀ ਹੈ।",
  },
  TREATED_INTEREST_AS_AMOUNT: {
    hi: "चक्रवृद्धि ब्याज को अंतिम राशि मानकर उलटा चक्रवृद्धि किया गया है।",
    pa: "ਚੱਕਰਵੱਧੀ ਵਿਆਜ ਨੂੰ ਅੰਤਿਮ ਰਕਮ ਮੰਨ ਕੇ ਉਲਟੀ ਚੱਕਰਵੱਧੀ ਕੀਤੀ ਗਈ ਹੈ।",
  },
  RETURNED_PERIOD_RATE: {
    hi: "यह एक चक्रवृद्धि अवधि की दर है, प्रश्न में माँगी गई वार्षिक दर नहीं।",
    pa: "ਇਹ ਇੱਕ ਚੱਕਰਵੱਧੀ ਅਵਧੀ ਦੀ ਦਰ ਹੈ, ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਮੰਗੀ ਸਾਲਾਨਾ ਦਰ ਨਹੀਂ।",
  },
  DIVIDED_BY_TOTAL_PERIODS: {
    hi: "वार्षिक दर को वर्ष की अवधियों से बाँटना चाहिए, कुल अवधि-संख्या से नहीं।",
    pa: "ਸਾਲਾਨਾ ਦਰ ਨੂੰ ਇੱਕ ਸਾਲ ਦੀਆਂ ਅਵਧੀਆਂ ਨਾਲ ਵੰਡਣਾ ਚਾਹੀਦਾ ਹੈ, ਕੁੱਲ ਅਵਧੀ-ਗਿਣਤੀ ਨਾਲ ਨਹੀਂ।",
  },
  USED_SIMPLE_RATE: {
    hi: "पूरी वृद्धि को साधारण ब्याज मान लिया गया है; चक्रवृद्धि चरण अलग से लागू होना चाहिए।",
    pa: "ਪੂਰੇ ਵਾਧੇ ਨੂੰ ਸਧਾਰਣ ਵਿਆਜ ਮੰਨਿਆ ਗਿਆ ਹੈ; ਚੱਕਰਵੱਧੀ ਪੜਾਅ ਵੱਖਰੇ ਤੌਰ 'ਤੇ ਲਾਗੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  ONE_PERIOD_SHORT: {
    hi: "एक अवधि कम लेने पर राशि अभी प्रश्न में दी गई राशि तक नहीं पहुँचती।",
    pa: "ਇੱਕ ਅਵਧੀ ਘੱਟ ਲੈਣ ਨਾਲ ਰਕਮ ਹਾਲੇ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਰਕਮ ਤੱਕ ਨਹੀਂ ਪਹੁੰਚਦੀ।",
  },
  ONE_PERIOD_EXTRA: {
    hi: "एक अनावश्यक अतिरिक्त चक्रवृद्धि अवधि जोड़ दी गई है।",
    pa: "ਇੱਕ ਬੇਲੋੜੀ ਵਾਧੂ ਚੱਕਰਵੱਧੀ ਅਵਧੀ ਜੋੜ ਦਿੱਤੀ ਗਈ ਹੈ।",
  },
  MULTIPLIED_PERIODS_BY_FREQUENCY: {
    hi: "अवधि-संख्या को वार्षिक आवृत्ति से गुणा किया गया है; उसे वास्तविक समय में बदलना चाहिए।",
    pa: "ਅਵਧੀ-ਗਿਣਤੀ ਨੂੰ ਸਾਲਾਨਾ ਆਵ੍ਰਿਤੀ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ; ਇਸ ਨੂੰ ਅਸਲ ਸਮੇਂ ਵਿੱਚ ਬਦਲਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  ASSUMED_NO_FREQUENCY_EFFECT: {
    hi: "समान वार्षिक दर पर भी अधिक बार चक्रवृद्धि होने से अंतिम राशि बदलती है।",
    pa: "ਇੱਕੋ ਸਾਲਾਨਾ ਦਰ ਉੱਤੇ ਵੀ ਵੱਧ ਵਾਰ ਚੱਕਰਵੱਧੀ ਹੋਣ ਨਾਲ ਅੰਤਿਮ ਰਕਮ ਬਦਲਦੀ ਹੈ।",
  },
  RETURNED_ONE_AMOUNT: {
    hi: "यह एक योजना की पूरी अंतिम राशि है, दोनों योजनाओं की राशियों का अंतर नहीं।",
    pa: "ਇਹ ਇੱਕ ਯੋਜਨਾ ਦੀ ਪੂਰੀ ਅੰਤਿਮ ਰਕਮ ਹੈ, ਦੋਵਾਂ ਯੋਜਨਾਵਾਂ ਦੀਆਂ ਰਕਮਾਂ ਦਾ ਅੰਤਰ ਨਹੀਂ।",
  },
  RETURNED_NOMINAL_RATE: {
    hi: "दी गई नाममात्र वार्षिक दर वास्तविक एक-वर्षीय वृद्धि नहीं होती, जब ब्याज वर्ष में एक से अधिक बार जुड़ता है।",
    pa: "ਦਿੱਤੀ ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਅਸਲ ਇੱਕ-ਸਾਲੀ ਵਾਧਾ ਨਹੀਂ ਹੁੰਦੀ, ਜਦੋਂ ਵਿਆਜ ਸਾਲ ਵਿੱਚ ਇੱਕ ਤੋਂ ਵੱਧ ਵਾਰ ਜੋੜਿਆ ਜਾਂਦਾ ਹੈ।",
  },
  ADDED_ONE_CREDITING_PERIOD: {
    hi: "एक वर्ष की निर्धारित गणना से एक अतिरिक्त ब्याज-अवधि जोड़ दी गई है।",
    pa: "ਇੱਕ ਸਾਲ ਦੀ ਨਿਰਧਾਰਤ ਗਿਣਤੀ ਤੋਂ ਇੱਕ ਵਾਧੂ ਵਿਆਜ-ਅਵਧੀ ਜੋੜ ਦਿੱਤੀ ਗਈ ਹੈ।",
  },
  RETURNED_EFFECTIVE_RATE: {
    hi: "दी गई प्रभावी दर को ही उत्तर दोहरा दिया गया है; नाममात्र वार्षिक दर ज्ञात करनी है।",
    pa: "ਦਿੱਤੀ ਪ੍ਰਭਾਵੀ ਦਰ ਨੂੰ ਹੀ ਉੱਤਰ ਵਜੋਂ ਦੁਹਰਾਇਆ ਗਿਆ ਹੈ; ਨਾਮਮਾਤਰ ਸਾਲਾਨਾ ਦਰ ਪਤਾ ਕਰਨੀ ਹੈ।",
  },
  MULTIPLIED_EFFECTIVE_RATE: {
    hi: "प्रभावी दर पहले ही पूरे वर्ष की वृद्धि बताती है; उसे अवधि-संख्या से गुणा नहीं करना चाहिए।",
    pa: "ਪ੍ਰਭਾਵੀ ਦਰ ਪਹਿਲਾਂ ਹੀ ਪੂਰੇ ਸਾਲ ਦਾ ਵਾਧਾ ਦੱਸਦੀ ਹੈ; ਇਸ ਨੂੰ ਅਵਧੀ-ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕਰਨਾ ਚਾਹੀਦਾ।",
  },
  IGNORED_TAIL: {
    hi: "पूर्ण वर्षों के बाद दिए गए अतिरिक्त महीनों को छोड़ दिया गया है।",
    pa: "ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਦਿੱਤੇ ਵਾਧੂ ਮਹੀਨਿਆਂ ਨੂੰ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  },
  COMPOUNDED_TAIL_MONTHLY: {
    hi: "अतिरिक्त महीनों पर मासिक चक्रवृद्धि लगा दी गई है, जबकि प्रश्न वहाँ साधारण ब्याज बताता है।",
    pa: "ਵਾਧੂ ਮਹੀਨਿਆਂ ਉੱਤੇ ਮਾਸਿਕ ਚੱਕਰਵੱਧੀ ਲਗਾਈ ਗਈ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਉੱਥੇ ਸਧਾਰਣ ਵਿਆਜ ਦੱਸਦਾ ਹੈ।",
  },
  TAIL_INTEREST_ON_ORIGINAL_PRINCIPAL: {
    hi: "अंतिम साधारण ब्याज मूलधन पर लगाया गया है; इसे पूर्ण वर्षों के बाद की शेष राशि पर लगाना चाहिए।",
    pa: "ਅੰਤਿਮ ਸਧਾਰਣ ਵਿਆਜ ਮੂਲਧਨ ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ ਹੈ; ਇਹ ਪੂਰੇ ਸਾਲਾਂ ਤੋਂ ਬਾਅਦ ਦੇ ਬਕਾਏ ਉੱਤੇ ਲੱਗਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  SUBTRACTED_TAIL_FROM_FINAL_AMOUNT: {
    hi: "अंतिम ब्याज को अंतिम राशि का प्रतिशत मानकर घटाया गया है; अंतिम चरण को उसके आरम्भिक शेष से उलटना चाहिए।",
    pa: "ਅੰਤਿਮ ਵਿਆਜ ਨੂੰ ਅੰਤਿਮ ਰਕਮ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਮੰਨ ਕੇ ਘਟਾਇਆ ਗਿਆ ਹੈ; ਅੰਤਿਮ ਪੜਾਅ ਨੂੰ ਉਸ ਦੇ ਸ਼ੁਰੂਆਤੀ ਬਕਾਏ ਤੋਂ ਉਲਟਣਾ ਚਾਹੀਦਾ ਹੈ।",
  },
  RETURNED_MONTHLY_RATE: {
    hi: "यह एक माह की दर है, जबकि प्रश्न वार्षिक दर पूछता है।",
    pa: "ਇਹ ਇੱਕ ਮਹੀਨੇ ਦੀ ਦਰ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਸਾਲਾਨਾ ਦਰ ਪੁੱਛਦਾ ਹੈ।",
  },
  RETURNED_TAIL_PERIOD_RATE: {
    hi: "यह केवल अंतिम आंशिक अवधि में लगाया गया प्रतिशत है, वार्षिक दर नहीं।",
    pa: "ਇਹ ਕੇਵਲ ਅੰਤਿਮ ਅਧੂਰੀ ਅਵਧੀ ਵਿੱਚ ਲੱਗਿਆ ਪ੍ਰਤੀਸ਼ਤ ਹੈ, ਸਾਲਾਨਾ ਦਰ ਨਹੀਂ।",
  },
  IGNORED_COMPLETE_YEARS: {
    hi: "पूर्ण वर्षों का चक्रवृद्धि चरण छोड़कर केवल अंतिम महीनों को गिना गया है।",
    pa: "ਪੂਰੇ ਸਾਲਾਂ ਦਾ ਚੱਕਰਵੱਧੀ ਪੜਾਅ ਛੱਡ ਕੇ ਕੇਵਲ ਅੰਤਿਮ ਮਹੀਨਿਆਂ ਨੂੰ ਗਿਣਿਆ ਗਿਆ ਹੈ।",
  },
  ONE_YEAR_EXTRA: {
    hi: "एक पूर्ण वर्ष आवश्यकता से अधिक जोड़ दिया गया है।",
    pa: "ਇੱਕ ਪੂਰਾ ਸਾਲ ਲੋੜ ਤੋਂ ਵੱਧ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
  },
  COUNTED_TAIL_AS_EXTRA_YEARS: {
    hi: "शेष महीनों को अतिरिक्त पूर्ण वर्षों के रूप में गिन लिया गया है।",
    pa: "ਬਾਕੀ ਮਹੀਨਿਆਂ ਨੂੰ ਵਾਧੂ ਪੂਰੇ ਸਾਲਾਂ ਵਜੋਂ ਗਿਣ ਲਿਆ ਗਿਆ ਹੈ।",
  },
  USED_FIRST_FREQUENCY_THROUGHOUT: {
    hi: "पहले अंतराल की चक्रवृद्धि आवृत्ति को पूरी अवधि पर लगा दिया गया है; दूसरे अंतराल की आवृत्ति अलग है।",
    pa: "ਪਹਿਲੇ ਅੰਤਰਾਲ ਦੀ ਚੱਕਰਵੱਧੀ ਆਵ੍ਰਿਤੀ ਨੂੰ ਪੂਰੀ ਮਿਆਦ ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ ਹੈ; ਦੂਜੇ ਅੰਤਰਾਲ ਦੀ ਆਵ੍ਰਿਤੀ ਵੱਖਰੀ ਹੈ।",
  },
  USED_SECOND_FREQUENCY_THROUGHOUT: {
    hi: "दूसरे अंतराल की चक्रवृद्धि आवृत्ति को पूरी अवधि पर लगा दिया गया है; पहले अंतराल की आवृत्ति अलग है।",
    pa: "ਦੂਜੇ ਅੰਤਰਾਲ ਦੀ ਚੱਕਰਵੱਧੀ ਆਵ੍ਰਿਤੀ ਨੂੰ ਪੂਰੀ ਮਿਆਦ ਉੱਤੇ ਲਗਾਇਆ ਗਿਆ ਹੈ; ਪਹਿਲੇ ਅੰਤਰਾਲ ਦੀ ਆਵ੍ਰਿਤੀ ਵੱਖਰੀ ਹੈ।",
  },
  USED_SIMPLE_INTEREST_THROUGHOUT: {
    hi: "दोनों चक्रवृद्धि क्रमों को छोड़कर पूरी अवधि पर साधारण ब्याज लगा दिया गया है।",
    pa: "ਦੋਵਾਂ ਚੱਕਰਵੱਧੀ ਕ੍ਰਮਾਂ ਨੂੰ ਛੱਡ ਕੇ ਪੂਰੀ ਮਿਆਦ ਉੱਤੇ ਸਧਾਰਣ ਵਿਆਜ ਲਗਾਇਆ ਗਿਆ ਹੈ।",
  },
  ARITHMETIC_SLIP_FALLBACK: {
    hi: "यह मान प्रश्न में दी गई चक्रवृद्धि शर्तों का पालन नहीं करता।",
    pa: "ਇਹ ਮੁੱਲ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀਆਂ ਚੱਕਰਵੱਧੀ ਸ਼ਰਤਾਂ ਦੀ ਪਾਲਣਾ ਨਹੀਂ ਕਰਦਾ।",
  },
});

function durationText(
  locale: IntCp004LocalizedLocale,
  periods: number,
  frequency: Cp004Frequency,
): string {
  const months = periods * (12 / frequency);
  if (months % 12 === 0) return cp004YearsText(locale, months / 12);
  return cp004MonthsText(locale, months);
}

export function localizedCp004AnswerText(
  locale: IntCp004LocalizedLocale,
  semantic: Cp004AnswerSemantic,
  state: Cp004MathematicalState,
  value: IntCp004EnglishFrozenQuestion["solution"],
): string {
  if (semantic === "MONEY") return moneyText(value);
  if (semantic === "RATE_PERCENT") return percentText(value);
  if (semantic === "FREQUENCY") {
    return cp004FrequencyLabel(locale, asInteger(value) as Cp004Frequency);
  }
  if (state.qlId === "INT-QL-072") {
    return durationText(locale, asInteger(value), state.frequency);
  }
  const years = asInteger(value);
  return locale === "hi-IN" ? `${years} पूर्ण वर्ष` : `${years} ਪੂਰੇ ਸਾਲ`;
}

function assumedFrequencyFeedback(
  locale: IntCp004LocalizedLocale,
  misconceptionId: string,
): string | undefined {
  const match = /^ASSUMED_(1|2|4|12)_PER_YEAR$/u.exec(misconceptionId);
  if (!match) return undefined;
  const label = cp004FrequencyLabel(locale, Number(match[1]) as Cp004Frequency);
  return locale === "hi-IN"
    ? `${label} चक्रवृद्धि से प्रश्न में दी गई अंतिम राशि प्राप्त नहीं होती।`
    : `${label} ਚੱਕਰਵੱਧੀ ਨਾਲ ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਅੰਤਿਮ ਰਕਮ ਪ੍ਰਾਪਤ ਨਹੀਂ ਹੁੰਦੀ।`;
}

export function localizedCp004Feedback(
  locale: IntCp004LocalizedLocale,
  misconceptionId: string,
): string {
  if (misconceptionId === "CORRECT") return cp004CorrectFeedback(locale);
  const dynamic = assumedFrequencyFeedback(locale, misconceptionId);
  if (dynamic) return dynamic;
  const pair = FEEDBACK[misconceptionId];
  if (!pair) throw new Error(`Missing CP-004 localized feedback for ${misconceptionId}.`);
  return locale === "hi-IN" ? pair.hi : pair.pa;
}

export function localizeCp004Options(
  source: IntCp004EnglishFrozenQuestion,
  locale: IntCp004LocalizedLocale,
): readonly IntCp004LocalizedOption[] {
  const localized = source.options.map((option) => {
    const text = localizedCp004AnswerText(locale, source.answerSemantic, source.mathematicalState, option.value);
    const feedback = localizedCp004Feedback(locale, option.misconceptionId);
    assertCp004LocalizedText(locale, feedback, `${source.qlId}/${source.seed}/${option.id}/feedback`);
    return Object.freeze({
      ...option,
      text,
      feedback,
    });
  });
  return Object.freeze(localized);
}
