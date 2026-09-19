import { generatePolCp001ReviewBatchV1 } from "../constitutional-history/pol-cp001-review-generator-v1";
import { POL_CP001_ACT_ROWS_V1 } from "../constitutional-history/pol-cp001-facts";
import { generatePolCp002ReviewBatchV2 } from "../constituent-assembly/pol-cp002-review-generator-v2";
import {
  POL_CP002_COMMITTEE_ROWS_V1,
  POL_CP002_COMPOSITION_ROWS_V1,
  POL_CP002_INFLUENCE_ROWS_V1,
  POL_CP002_MILESTONES_V1,
  POL_CP002_ROLE_ROWS_V1,
} from "../constituent-assembly/pol-cp002-facts";
import {
  POL_LOCALIZATION_V1,
  type PolLocaleV1,
  type PolLocalizedQuestionV1,
} from "./pol-localization-types-v1";

type NativeLocale = Exclude<PolLocaleV1, "en">;
type Pair = Readonly<{ hi: string; pa: string }>;
const lp = (hi: string, pa: string): Pair => ({ hi, pa });
const native = (pair: Pair, locale: NativeLocale) => pair[locale];

const CP001_EN = Object.freeze(generatePolCp001ReviewBatchV1());
const CP002_EN = Object.freeze(generatePolCp002ReviewBatchV2());

const COUNT_OPTIONS: Readonly<Record<string, Pair>> = Object.freeze({
  "I only": lp("केवल I", "ਸਿਰਫ਼ I"),
  "II only": lp("केवल II", "ਸਿਰਫ਼ II"),
  "Both I and II": lp("I और II दोनों", "I ਅਤੇ II ਦੋਵੇਂ"),
  "Neither I nor II": lp("न तो I, न II", "ਨਾ I, ਨਾ II"),
  "None": lp("कोई नहीं", "ਕੋਈ ਨਹੀਂ"),
  "Only one": lp("केवल एक", "ਸਿਰਫ਼ ਇੱਕ"),
  "Only two": lp("केवल दो", "ਸਿਰਫ਼ ਦੋ"),
  "All three": lp("तीनों", "ਤਿੰਨੇ"),
});

const CP1: Readonly<Record<string, {
  title: Pair;
  defining: Pair;
  compact: Pair;
  milestone?: Pair;
  reform?: Pair;
}>> = Object.freeze({
  "regulating-act-1773": {
    title: lp("रेग्युलेटिंग एक्ट, 1773", "ਰੈਗੂਲੇਟਿੰਗ ਐਕਟ, 1773"),
    defining: lp("बंगाल के गवर्नर-जनरल का पद बनाया और भारत में ईस्ट इंडिया कंपनी के प्रशासन पर संसदीय नियंत्रण की शुरुआत की", "ਬੰਗਾਲ ਦੇ ਗਵਰਨਰ-ਜਨਰਲ ਦਾ ਅਹੁਦਾ ਬਣਾਇਆ ਅਤੇ ਭਾਰਤ ਵਿੱਚ ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਦੇ ਪ੍ਰਸ਼ਾਸਨ ਉੱਤੇ ਸੰਸਦੀ ਨਿਯੰਤਰਣ ਦੀ ਸ਼ੁਰੂਆਤ ਕੀਤੀ"),
    compact: lp("बंगाल का गवर्नर-जनरल और संसदीय नियंत्रण", "ਬੰਗਾਲ ਦਾ ਗਵਰਨਰ-ਜਨਰਲ ਅਤੇ ਸੰਸਦੀ ਨਿਯੰਤਰਣ"),
    milestone: lp("ब्रिटिश संसद द्वारा ईस्ट इंडिया कंपनी के राजनीतिक प्रशासन को नियंत्रित करने की पहली बड़ी पहल थी", "ਬਰਤਾਨਵੀ ਸੰਸਦ ਵੱਲੋਂ ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਦੇ ਰਾਜਨੀਤਿਕ ਪ੍ਰਸ਼ਾਸਨ ਨੂੰ ਨਿਯੰਤਰਿਤ ਕਰਨ ਦੀ ਪਹਿਲੀ ਵੱਡੀ ਕੋਸ਼ਿਸ਼ ਸੀ"),
  },
  "pitts-india-act-1784": {
    title: lp("पिट्स इंडिया एक्ट, 1784", "ਪਿਟਸ ਇੰਡੀਆ ਐਕਟ, 1784"),
    defining: lp("राजनीतिक मामलों के लिए बोर्ड ऑफ कंट्रोल बनाया, जबकि कंपनी के वाणिज्यिक मामलों का प्रबंधन कोर्ट ऑफ डायरेक्टर्स के पास रहा", "ਰਾਜਨੀਤਿਕ ਮਾਮਲਿਆਂ ਲਈ ਬੋਰਡ ਆਫ ਕੰਟਰੋਲ ਬਣਾਇਆ, ਜਦਕਿ ਕੰਪਨੀ ਦੇ ਵਪਾਰਕ ਮਾਮਲੇ ਕੋਰਟ ਆਫ ਡਾਇਰੈਕਟਰਜ਼ ਕੋਲ ਰਹੇ"),
    compact: lp("बोर्ड ऑफ कंट्रोल और द्वैध नियंत्रण", "ਬੋਰਡ ਆਫ ਕੰਟਰੋਲ ਅਤੇ ਦੋਹਰਾ ਨਿਯੰਤਰਣ"),
    milestone: lp("कंपनी के भारतीय प्रशासन में द्वैध नियंत्रण की व्यवस्था स्थापित की", "ਕੰਪਨੀ ਦੇ ਭਾਰਤੀ ਪ੍ਰਸ਼ਾਸਨ ਵਿੱਚ ਦੋਹਰੇ ਨਿਯੰਤਰਣ ਦੀ ਪ੍ਰਣਾਲੀ ਕਾਇਮ ਕੀਤੀ"),
  },
  "charter-act-1793": {
    title: lp("चार्टर एक्ट, 1793", "ਚਾਰਟਰ ਐਕਟ, 1793"),
    defining: lp("ईस्ट इंडिया कंपनी के चार्टर को बीस वर्ष के लिए बढ़ाया और कंपनी शासन की मौजूदा व्यवस्था को बड़े स्तर पर जारी रखा", "ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਦੇ ਚਾਰਟਰ ਨੂੰ ਵੀਹ ਸਾਲਾਂ ਲਈ ਵਧਾਇਆ ਅਤੇ ਕੰਪਨੀ ਰਾਜ ਦੀ ਮੌਜੂਦਾ ਪ੍ਰਣਾਲੀ ਨੂੰ ਵੱਡੇ ਪੱਧਰ ਤੇ ਜਾਰੀ ਰੱਖਿਆ"),
    compact: lp("कंपनी का चार्टर बीस वर्ष के लिए नवीनीकृत", "ਕੰਪਨੀ ਦਾ ਚਾਰਟਰ ਵੀਹ ਸਾਲਾਂ ਲਈ ਨਵੀਨੀਕਰਿਤ"),
  },
  "charter-act-1813": {
    title: lp("चार्टर एक्ट, 1813", "ਚਾਰਟਰ ਐਕਟ, 1813"),
    defining: lp("चाय और चीन के साथ व्यापार को छोड़कर भारत में ईस्ट इंडिया कंपनी का व्यापारिक एकाधिकार समाप्त किया", "ਚਾਹ ਅਤੇ ਚੀਨ ਨਾਲ ਵਪਾਰ ਤੋਂ ਇਲਾਵਾ ਭਾਰਤ ਵਿੱਚ ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਦਾ ਵਪਾਰਕ ਏਕਾਧਿਕਾਰ ਖਤਮ ਕੀਤਾ"),
    compact: lp("चाय और चीन के अपवाद के साथ कंपनी का व्यापारिक एकाधिकार समाप्त", "ਚਾਹ ਅਤੇ ਚੀਨ ਦੇ ਅਪਵਾਦ ਨਾਲ ਕੰਪਨੀ ਦਾ ਵਪਾਰਕ ਏਕਾਧਿਕਾਰ ਖਤਮ"),
    milestone: lp("भारत में कंपनी के सामान्य व्यापारिक एकाधिकार में पहली बड़ी वैधानिक दरार डाली", "ਭਾਰਤ ਵਿੱਚ ਕੰਪਨੀ ਦੇ ਆਮ ਵਪਾਰਕ ਏਕਾਧਿਕਾਰ ਵਿੱਚ ਪਹਿਲੀ ਵੱਡੀ ਕਾਨੂੰਨੀ ਦਰਾਰ ਪਾਈ"),
  },
  "charter-act-1833": {
    title: lp("चार्टर एक्ट, 1833", "ਚਾਰਟਰ ਐਕਟ, 1833"),
    defining: lp("बंगाल के गवर्नर-जनरल को भारत का गवर्नर-जनरल बनाया और ईस्ट इंडिया कंपनी की बची हुई वाणिज्यिक गतिविधियाँ समाप्त कीं", "ਬੰਗਾਲ ਦੇ ਗਵਰਨਰ-ਜਨਰਲ ਨੂੰ ਭਾਰਤ ਦਾ ਗਵਰਨਰ-ਜਨਰਲ ਬਣਾਇਆ ਅਤੇ ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਦੀਆਂ ਬਾਕੀ ਵਪਾਰਕ ਗਤੀਵਿਧੀਆਂ ਖਤਮ ਕੀਤੀਆਂ"),
    compact: lp("भारत का गवर्नर-जनरल और कंपनी के व्यापार का अंत", "ਭਾਰਤ ਦਾ ਗਵਰਨਰ-ਜਨਰਲ ਅਤੇ ਕੰਪਨੀ ਦੇ ਵਪਾਰ ਦਾ ਅੰਤ"),
    milestone: lp("भारत के गवर्नर-जनरल का पद बनाया", "ਭਾਰਤ ਦੇ ਗਵਰਨਰ-ਜਨਰਲ ਦਾ ਅਹੁਦਾ ਬਣਾਇਆ"),
  },
  "charter-act-1853": {
    title: lp("चार्टर एक्ट, 1853", "ਚਾਰਟਰ ਐਕਟ, 1853"),
    defining: lp("गवर्नर-जनरल की परिषद के विधायी और कार्यकारी कार्यों को अलग किया और सिविल सेवाओं में प्रतियोगी भर्ती का मार्ग खोला", "ਗਵਰਨਰ-ਜਨਰਲ ਦੀ ਕੌਂਸਲ ਦੇ ਵਿਧਾਨਕ ਅਤੇ ਕਾਰਜਕਾਰੀ ਕੰਮ ਵੱਖ ਕੀਤੇ ਅਤੇ ਸਿਵਲ ਸੇਵਾਵਾਂ ਵਿੱਚ ਮੁਕਾਬਲੇ ਰਾਹੀਂ ਭਰਤੀ ਦਾ ਰਾਹ ਖੋਲ੍ਹਿਆ"),
    compact: lp("गवर्नर-जनरल की परिषद में विधायी-कार्यकारी पृथक्करण", "ਗਵਰਨਰ-ਜਨਰਲ ਦੀ ਕੌਂਸਲ ਵਿੱਚ ਵਿਧਾਨਕ-ਕਾਰਜਕਾਰੀ ਵੱਖਰਾ ਕਰਨਾ"),
    milestone: lp("ईस्ट इंडिया कंपनी के लिए पारित अंतिम चार्टर एक्ट था", "ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਲਈ ਪਾਸ ਕੀਤਾ ਆਖਰੀ ਚਾਰਟਰ ਐਕਟ ਸੀ"),
  },
  "government-of-india-act-1858": {
    title: lp("भारत शासन अधिनियम, 1858", "ਭਾਰਤ ਸਰਕਾਰ ਐਕਟ, 1858"),
    defining: lp("भारत का शासन ईस्ट इंडिया कंपनी से ब्रिटिश क्राउन को सौंपा और भारत सचिव का पद बनाया", "ਭਾਰਤ ਦਾ ਰਾਜ ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਤੋਂ ਬਰਤਾਨਵੀ ਤਾਜ ਨੂੰ ਸੌਂਪਿਆ ਅਤੇ ਭਾਰਤ ਸਕੱਤਰ ਦਾ ਅਹੁਦਾ ਬਣਾਇਆ"),
    compact: lp("क्राउन शासन और भारत सचिव", "ਤਾਜ ਦਾ ਰਾਜ ਅਤੇ ਭਾਰਤ ਸਕੱਤਰ"),
    milestone: lp("ईस्ट इंडिया कंपनी का शासन समाप्त कर भारत में सीधे क्राउन शासन की शुरुआत की", "ਈਸਟ ਇੰਡੀਆ ਕੰਪਨੀ ਦਾ ਰਾਜ ਖਤਮ ਕਰ ਭਾਰਤ ਵਿੱਚ ਸਿੱਧੇ ਤਾਜ ਦੇ ਰਾਜ ਦੀ ਸ਼ੁਰੂਆਤ ਕੀਤੀ"),
  },
  "indian-councils-act-1861": {
    title: lp("भारतीय परिषद अधिनियम, 1861", "ਭਾਰਤੀ ਕੌਂਸਲ ਐਕਟ, 1861"),
    defining: lp("वायसराय की विधायी परिषद का विस्तार किया और भारतीयों को गैर-सरकारी सदस्य के रूप में नामित करने की अनुमति दी", "ਵਾਇਸਰਾਏ ਦੀ ਵਿਧਾਨਕ ਕੌਂਸਲ ਦਾ ਵਿਸਥਾਰ ਕੀਤਾ ਅਤੇ ਭਾਰਤੀਆਂ ਨੂੰ ਗੈਰ-ਸਰਕਾਰੀ ਮੈਂਬਰ ਵਜੋਂ ਨਾਮਜ਼ਦ ਕਰਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿੱਤੀ"),
    compact: lp("विधायी परिषदों में भारतीयों का नामांकन", "ਵਿਧਾਨਕ ਕੌਂਸਲਾਂ ਵਿੱਚ ਭਾਰਤੀਆਂ ਦੀ ਨਾਮਜ਼ਦਗੀ"),
    milestone: lp("नामांकन के माध्यम से केंद्रीय विधायी कार्य में भारतीयों को शामिल करने की परंपरा शुरू की", "ਨਾਮਜ਼ਦਗੀ ਰਾਹੀਂ ਕੇਂਦਰੀ ਵਿਧਾਨਕ ਕੰਮ ਵਿੱਚ ਭਾਰਤੀਆਂ ਨੂੰ ਸ਼ਾਮਲ ਕਰਨ ਦੀ ਪ੍ਰਥਾ ਸ਼ੁਰੂ ਕੀਤੀ"),
  },
  "indian-councils-act-1892": {
    title: lp("भारतीय परिषद अधिनियम, 1892", "ਭਾਰਤੀ ਕੌਂਸਲ ਐਕਟ, 1892"),
    defining: lp("विधायी परिषदों का विस्तार किया और सदस्यों को सीमाओं के अधीन बजट पर चर्चा तथा प्रश्न पूछने की अनुमति दी", "ਵਿਧਾਨਕ ਕੌਂਸਲਾਂ ਦਾ ਵਿਸਥਾਰ ਕੀਤਾ ਅਤੇ ਮੈਂਬਰਾਂ ਨੂੰ ਪਾਬੰਦੀਆਂ ਅਧੀਨ ਬਜਟ ਤੇ ਚਰਚਾ ਅਤੇ ਪ੍ਰਸ਼ਨ ਪੁੱਛਣ ਦੀ ਇਜਾਜ਼ਤ ਦਿੱਤੀ"),
    compact: lp("विधायी परिषदों में बजट चर्चा और प्रश्न", "ਵਿਧਾਨਕ ਕੌਂਸਲਾਂ ਵਿੱਚ ਬਜਟ ਚਰਚਾ ਅਤੇ ਪ੍ਰਸ਼ਨ"),
    milestone: lp("बजट चर्चा और प्रश्नों के माध्यम से विधायी परिषदों की विचार-विमर्श भूमिका बढ़ाई", "ਬਜਟ ਚਰਚਾ ਅਤੇ ਪ੍ਰਸ਼ਨਾਂ ਰਾਹੀਂ ਵਿਧਾਨਕ ਕੌਂਸਲਾਂ ਦੀ ਵਿਚਾਰ-ਵਟਾਂਦਰਾ ਭੂਮਿਕਾ ਵਧਾਈ"),
  },
  "indian-councils-act-1909": {
    title: lp("भारतीय परिषद अधिनियम, 1909", "ਭਾਰਤੀ ਕੌਂਸਲ ਐਕਟ, 1909"),
    defining: lp("मुसलमानों के लिए पृथक निर्वाचक मंडल शुरू किए और विधायी परिषदों का विस्तार किया", "ਮੁਸਲਮਾਨਾਂ ਲਈ ਵੱਖਰੇ ਚੋਣ ਮੰਡਲ ਸ਼ੁਰੂ ਕੀਤੇ ਅਤੇ ਵਿਧਾਨਕ ਕੌਂਸਲਾਂ ਦਾ ਵਿਸਥਾਰ ਕੀਤਾ"),
    compact: lp("मुसलमानों के लिए पृथक निर्वाचक मंडल", "ਮੁਸਲਮਾਨਾਂ ਲਈ ਵੱਖਰੇ ਚੋਣ ਮੰਡਲ"),
    milestone: lp("मुसलमानों के लिए पृथक निर्वाचक मंडल शुरू किए", "ਮੁਸਲਮਾਨਾਂ ਲਈ ਵੱਖਰੇ ਚੋਣ ਮੰਡਲ ਸ਼ੁਰੂ ਕੀਤੇ"),
    reform: lp("मॉर्ले-मिंटो सुधार", "ਮਾਰਲੇ-ਮਿੰਟੋ ਸੁਧਾਰ"),
  },
  "government-of-india-act-1919": {
    title: lp("भारत शासन अधिनियम, 1919", "ਭਾਰਤ ਸਰਕਾਰ ਐਕਟ, 1919"),
    defining: lp("प्रांतीय विषयों को आरक्षित और हस्तांतरित विषयों में बाँटकर प्रांतों में द्वैध शासन शुरू किया", "ਸੂਬਾਈ ਵਿਸ਼ਿਆਂ ਨੂੰ ਰਾਖਵੇਂ ਅਤੇ ਹਸਤਾਂਤਰਿਤ ਵਿਸ਼ਿਆਂ ਵਿੱਚ ਵੰਡ ਕੇ ਸੂਬਿਆਂ ਵਿੱਚ ਦੋਹਰਾ ਰਾਜ ਸ਼ੁਰੂ ਕੀਤਾ"),
    compact: lp("प्रांतों में द्वैध शासन", "ਸੂਬਿਆਂ ਵਿੱਚ ਦੋਹਰਾ ਰਾਜ"),
    milestone: lp("प्रांतों में द्वैध शासन शुरू किया", "ਸੂਬਿਆਂ ਵਿੱਚ ਦੋਹਰਾ ਰਾਜ ਸ਼ੁਰੂ ਕੀਤਾ"),
    reform: lp("मॉन्टेग्यू-चेम्सफोर्ड सुधार", "ਮਾਂਟੇਗਿਊ-ਚੇਮਸਫੋਰਡ ਸੁਧਾਰ"),
  },
  "government-of-india-act-1935": {
    title: lp("भारत शासन अधिनियम, 1935", "ਭਾਰਤ ਸਰਕਾਰ ਐਕਟ, 1935"),
    defining: lp("प्रांतीय स्वायत्तता शुरू की, प्रांतों में द्वैध शासन समाप्त किया और एक अखिल भारतीय संघ प्रस्तावित किया जो लागू नहीं हुआ", "ਸੂਬਾਈ ਖੁਦਮੁਖਤਿਆਰੀ ਸ਼ੁਰੂ ਕੀਤੀ, ਸੂਬਿਆਂ ਵਿੱਚ ਦੋਹਰਾ ਰਾਜ ਖਤਮ ਕੀਤਾ ਅਤੇ ਇੱਕ ਅਖਿਲ ਭਾਰਤੀ ਸੰਘ ਦਾ ਪ੍ਰਸਤਾਵ ਕੀਤਾ ਜੋ ਲਾਗੂ ਨਾ ਹੋਇਆ"),
    compact: lp("प्रांतीय स्वायत्तता और प्रस्तावित संघ", "ਸੂਬਾਈ ਖੁਦਮੁਖਤਿਆਰੀ ਅਤੇ ਪ੍ਰਸਤਾਵਿਤ ਸੰਘ"),
    milestone: lp("प्रांतीय स्वायत्तता शुरू की और प्रांतों में द्वैध शासन समाप्त किया", "ਸੂਬਾਈ ਖੁਦਮੁਖਤਿਆਰੀ ਸ਼ੁਰੂ ਕੀਤੀ ਅਤੇ ਸੂਬਿਆਂ ਵਿੱਚ ਦੋਹਰਾ ਰਾਜ ਖਤਮ ਕੀਤਾ"),
  },
  "indian-independence-act-1947": {
    title: lp("भारतीय स्वतंत्रता अधिनियम, 1947", "ਭਾਰਤੀ ਆਜ਼ਾਦੀ ਐਕਟ, 1947"),
    defining: lp("15 अगस्त 1947 से भारत और पाकिस्तान के दो स्वतंत्र डोमिनियन बनाने का प्रावधान किया", "15 ਅਗਸਤ 1947 ਤੋਂ ਭਾਰਤ ਅਤੇ ਪਾਕਿਸਤਾਨ ਦੇ ਦੋ ਸੁਤੰਤਰ ਡੋਮੀਨੀਅਨ ਬਣਾਉਣ ਦਾ ਪ੍ਰਬੰਧ ਕੀਤਾ"),
    compact: lp("15 अगस्त 1947 से दो स्वतंत्र डोमिनियन", "15 ਅਗਸਤ 1947 ਤੋਂ ਦੋ ਸੁਤੰਤਰ ਡੋਮੀਨੀਅਨ"),
    milestone: lp("ब्रिटिश शासन समाप्त किया और भारत तथा पाकिस्तान के स्वतंत्र डोमिनियन बनाए", "ਬਰਤਾਨਵੀ ਰਾਜ ਖਤਮ ਕੀਤਾ ਅਤੇ ਭਾਰਤ ਤੇ ਪਾਕਿਸਤਾਨ ਦੇ ਸੁਤੰਤਰ ਡੋਮੀਨੀਅਨ ਬਣਾਏ"),
  },
});

function cp1RowByTitle(title: string) {
  const row = POL_CP001_ACT_ROWS_V1.find((item) => item.title === title);
  if (!row) throw new Error(`Unknown CP001 title: ${title}`);
  return row;
}
function cp1Title(title: string, locale: NativeLocale) {
  return native(CP1[cp1RowByTitle(title).id]!.title, locale);
}
function cp1Compact(compact: string, locale: NativeLocale) {
  const row = POL_CP001_ACT_ROWS_V1.find((item) => item.compactFeature === compact);
  if (!row) throw new Error(`Unknown CP001 compact feature: ${compact}`);
  return native(CP1[row.id]!.compact, locale);
}
function cp1Defining(defining: string, locale: NativeLocale) {
  const row = POL_CP001_ACT_ROWS_V1.find((item) => item.definingFeature === defining);
  if (!row) throw new Error(`Unknown CP001 defining feature: ${defining}`);
  return native(CP1[row.id]!.defining, locale);
}
function cp1Milestone(milestone: string, locale: NativeLocale) {
  const row = POL_CP001_ACT_ROWS_V1.find((item) => item.milestone === milestone);
  if (!row || !CP1[row.id]!.milestone) throw new Error(`Unknown CP001 milestone: ${milestone}`);
  return native(CP1[row.id]!.milestone!, locale);
}
function cp1Reform(reform: string, locale: NativeLocale) {
  const row = POL_CP001_ACT_ROWS_V1.find((item) => item.reformName === reform);
  if (!row || !CP1[row.id]!.reform) throw new Error(`Unknown CP001 reform: ${reform}`);
  return native(CP1[row.id]!.reform!, locale);
}

function cp1Option(text: string, locale: NativeLocale): string {
  if (COUNT_OPTIONS[text]) return native(COUNT_OPTIONS[text]!, locale);
  if (POL_CP001_ACT_ROWS_V1.some((row) => row.title === text)) return cp1Title(text, locale);
  if (POL_CP001_ACT_ROWS_V1.some((row) => row.compactFeature === text)) return cp1Compact(text, locale);
  if (text.includes(" → ")) return text.split(" → ").map((part) => cp1Title(part, locale)).join(" → ");
  if (text.includes("; ")) {
    return text.split("; ").map((part) => {
      const [title, feature] = part.split(": ");
      return `${cp1Title(title!, locale)}: ${cp1Compact(feature!, locale)}`;
    }).join("; ");
  }
  if (text.includes(" — ")) {
    const [title, feature] = text.split(" — ");
    return `${cp1Title(title!, locale)} — ${cp1Compact(feature!, locale)}`;
  }
  throw new Error(`Untranslated CP001 option: ${text}`);
}

function cp1Statement(statement: string, locale: NativeLocale): string {
  const text = statement.replace(/\.$/, "");
  const titleRow = POL_CP001_ACT_ROWS_V1.find((row) => text.startsWith(`${row.title} `));
  if (!titleRow) throw new Error(`Unparsed CP001 statement: ${statement}`);
  const feature = text.slice(titleRow.title.length + 1);
  return locale === "hi"
    ? `${native(CP1[titleRow.id]!.title, locale)} ने ${cp1Defining(feature, locale)}।`
    : `${native(CP1[titleRow.id]!.title, locale)} ਨੇ ${cp1Defining(feature, locale)}।`;
}

function cp1Stem(q: (typeof CP001_EN)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  const titleAnswerRow = POL_CP001_ACT_ROWS_V1.find((row) => row.title === q.canonicalAnswer);
  const compactAnswerRow = POL_CP001_ACT_ROWS_V1.find((row) => row.compactFeature === q.canonicalAnswer);

  if (ql === 1 && titleAnswerRow) {
    const feature = native(CP1[titleAnswerRow.id]!.defining, locale);
    return locale === "hi" ? `किस अधिनियम ने ${feature}?` : `ਕਿਹੜੇ ਐਕਟ ਨੇ ${feature}?`;
  }
  if (ql === 2 && compactAnswerRow) {
    const title = native(CP1[compactAnswerRow.id]!.title, locale);
    return locale === "hi" ? `${title} का एक प्रमुख प्रावधान क्या था?` : `${title} ਦਾ ਇੱਕ ਮੁੱਖ ਪ੍ਰਬੰਧ ਕੀ ਸੀ?`;
  }
  if (ql === 3 && titleAnswerRow) {
    return locale === "hi" ? `निम्न में से कौन-सा अधिनियम ${titleAnswerRow.year} में पारित हुआ था?` : `ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਐਕਟ ${titleAnswerRow.year} ਵਿੱਚ ਪਾਸ ਹੋਇਆ ਸੀ?`;
  }
  if (ql === 4) return locale === "hi" ? "निम्न में से कौन-सा युग्म सही सुमेलित है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if (ql === 5) return locale === "hi" ? "निम्न में से कौन-सा युग्म गलत सुमेलित है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਜੋੜ ਗਲਤ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if (ql === 6 && titleAnswerRow?.milestone) {
    const milestone = native(CP1[titleAnswerRow.id]!.milestone!, locale);
    return locale === "hi" ? `कौन-सा अधिनियम ${milestone}?` : `ਕਿਹੜਾ ਐਕਟ ${milestone}?`;
  }
  if (ql === 7 && titleAnswerRow?.reformName) {
    const reform = cp1Reform(titleAnswerRow.reformName, locale);
    return locale === "hi" ? `${reform} किस अधिनियम से जुड़े हैं?` : `${reform} ਕਿਹੜੇ ਐਕਟ ਨਾਲ ਸੰਬੰਧਿਤ ਹਨ?`;
  }
  if (ql === 8) {
    const lines = q.stem.split("\n");
    return [
      locale === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
      `I. ${cp1Statement(lines[1]!.replace(/^I\. /, ""), locale)}`,
      `II. ${cp1Statement(lines[2]!.replace(/^II\. /, ""), locale)}`,
      locale === "hi" ? "ऊपर दिए गए कथनों में कौन-सा/से सही है/हैं?" : "ਉੱਪਰ ਦਿੱਤੇ ਬਿਆਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ/ਕਿਹੜੇ ਸਹੀ ਹੈ/ਹਨ?",
    ].join("\n");
  }
  if (ql === 9) {
    const lines = q.stem.split("\n");
    return [
      locale === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
      `1. ${cp1Statement(lines[1]!.replace(/^1\. /, ""), locale)}`,
      `2. ${cp1Statement(lines[2]!.replace(/^2\. /, ""), locale)}`,
      `3. ${cp1Statement(lines[3]!.replace(/^3\. /, ""), locale)}`,
      locale === "hi" ? "ऊपर दिए गए कितने कथन सही हैं?" : "ਉੱਪਰ ਦਿੱਤੇ ਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
    ].join("\n");
  }
  if (ql === 10) return locale === "hi" ? "इन संवैधानिक अधिनियमों का सही कालानुक्रमिक क्रम कौन-सा है?" : "ਇਨ੍ਹਾਂ ਸੰਵਿਧਾਨਕ ਐਕਟਾਂ ਦਾ ਸਹੀ ਕਾਲਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?";
  if (ql === 11) {
    const match = q.stem.match(/^Which Act came after the (.+) but before the (.+)\?$/);
    if (!match) throw new Error(`${q.questionId}: CP001 QL011 stem not parsed`);
    return locale === "hi"
      ? `${cp1Title(match[1]!, locale)} के बाद लेकिन ${cp1Title(match[2]!, locale)} से पहले कौन-सा अधिनियम आया?`
      : `${cp1Title(match[1]!, locale)} ਤੋਂ ਬਾਅਦ ਪਰ ${cp1Title(match[2]!, locale)} ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜਾ ਐਕਟ ਆਇਆ?`;
  }
  if (ql === 12) {
    const match = q.stem.match(/^Which option correctly distinguishes the (.+) from the (.+)\?$/);
    if (!match) throw new Error(`${q.questionId}: CP001 QL012 stem not parsed`);
    return locale === "hi"
      ? `कौन-सा विकल्प ${cp1Title(match[1]!, locale)} और ${cp1Title(match[2]!, locale)} के बीच सही अंतर बताता है?`
      : `ਕਿਹੜਾ ਵਿਕਲਪ ${cp1Title(match[1]!, locale)} ਅਤੇ ${cp1Title(match[2]!, locale)} ਵਿਚਲਾ ਸਹੀ ਫਰਕ ਦੱਸਦਾ ਹੈ?`;
  }
  throw new Error(`${q.questionId}: unsupported CP001 QL ${ql}`);
}

function cp1Explanation(q: (typeof CP001_EN)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  const answer = cp1Option(q.canonicalAnswer, locale);
  if ([1, 2, 4, 7].includes(ql)) {
    return locale === "hi"
      ? `${answer} सही उत्तर है। यह इस संवैधानिक विकास से जुड़ा प्रमुख तथ्य है।`
      : `${answer} ਸਹੀ ਉੱਤਰ ਹੈ। ਇਹ ਇਸ ਸੰਵਿਧਾਨਕ ਵਿਕਾਸ ਨਾਲ ਜੁੜਿਆ ਮੁੱਖ ਤੱਥ ਹੈ।`;
  }
  if (ql === 3) {
    const row = cp1RowByTitle(q.canonicalAnswer);
    return locale === "hi" ? `${answer} ${row.year} में पारित हुआ था।` : `${answer} ${row.year} ਵਿੱਚ ਪਾਸ ਹੋਇਆ ਸੀ।`;
  }
  if (ql === 5) {
    const [wrongTitle, wrongFeature] = q.canonicalAnswer.split(" — ");
    const owner = POL_CP001_ACT_ROWS_V1.find((row) => row.compactFeature === wrongFeature)!;
    return locale === "hi"
      ? `${answer} गलत सुमेलित युग्म है। ${cp1Compact(wrongFeature!, locale)} वास्तव में ${native(CP1[owner.id]!.title, locale)} से जुड़ा है।`
      : `${answer} ਗਲਤ ਮਿਲਾਇਆ ਗਿਆ ਜੋੜ ਹੈ। ${cp1Compact(wrongFeature!, locale)} ਅਸਲ ਵਿੱਚ ${native(CP1[owner.id]!.title, locale)} ਨਾਲ ਜੁੜਿਆ ਹੈ।`;
  }
  if (ql === 6) {
    const row = cp1RowByTitle(q.canonicalAnswer);
    const milestone = native(CP1[row.id]!.milestone!, locale);
    return locale === "hi" ? `${answer} ${milestone}।` : `${answer} ${milestone}।`;
  }
  if (ql === 8) {
    const rows = q.stem.split("\n").slice(1, 3).map((line) => {
      const text = line.replace(/^(?:I|II)\. /, "");
      return POL_CP001_ACT_ROWS_V1.find((row) => text.startsWith(`${row.title} `))!;
    });
    return locale === "hi"
      ? `${native(CP1[rows[0]!.id]!.title, locale)} का सही संबंध ${native(CP1[rows[0]!.id]!.compact, locale)} से है; ${native(CP1[rows[1]!.id]!.title, locale)} का सही संबंध ${native(CP1[rows[1]!.id]!.compact, locale)} से है।`
      : `${native(CP1[rows[0]!.id]!.title, locale)} ਦਾ ਸਹੀ ਸੰਬੰਧ ${native(CP1[rows[0]!.id]!.compact, locale)} ਨਾਲ ਹੈ; ${native(CP1[rows[1]!.id]!.title, locale)} ਦਾ ਸਹੀ ਸੰਬੰਧ ${native(CP1[rows[1]!.id]!.compact, locale)} ਨਾਲ ਹੈ।`;
  }
  if (ql === 9) {
    const rows = q.stem.split("\n").slice(1, 4).map((line) => {
      const text = line.replace(/^\d\. /, "");
      return POL_CP001_ACT_ROWS_V1.find((row) => text.startsWith(`${row.title} `))!;
    });
    const summary = rows.map((row) => `${native(CP1[row.id]!.title, locale)} — ${native(CP1[row.id]!.compact, locale)}`).join("; ");
    return locale === "hi" ? `सही तथ्य हैं: ${summary}।` : `ਸਹੀ ਤੱਥ ਹਨ: ${summary}।`;
  }
  if (ql === 10) return locale === "hi" ? `सही कालानुक्रमिक क्रम ${answer} है।` : `ਸਹੀ ਕਾਲਕ੍ਰਮ ${answer} ਹੈ।`;
  if (ql === 11) {
    const middle = cp1RowByTitle(q.canonicalAnswer);
    return locale === "hi" ? `सही उत्तर ${answer} है। यह ${middle.year} में पारित हुआ और दिए गए दोनों अधिनियमों के बीच आता है।` : `ਸਹੀ ਉੱਤਰ ${answer} ਹੈ। ਇਹ ${middle.year} ਵਿੱਚ ਪਾਸ ਹੋਇਆ ਅਤੇ ਦਿੱਤੇ ਦੋਵੇਂ ਐਕਟਾਂ ਦੇ ਵਿਚਕਾਰ ਆਉਂਦਾ ਹੈ।`;
  }
  if (ql === 12) return locale === "hi" ? `${answer} दोनों अधिनियमों की प्रमुख विशेषताओं का सही अंतर बताता है।` : `${answer} ਦੋਵੇਂ ਐਕਟਾਂ ਦੀਆਂ ਮੁੱਖ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ ਦਾ ਸਹੀ ਫਰਕ ਦੱਸਦਾ ਹੈ।`;
  throw new Error(`${q.questionId}: unsupported CP001 explanation QL ${ql}`);
}

const MONTHS: Readonly<Record<string, Pair>> = Object.freeze({
  December: lp("दिसंबर", "ਦਸੰਬਰ"),
  January: lp("जनवरी", "ਜਨਵਰੀ"),
  August: lp("अगस्त", "ਅਗਸਤ"),
  February: lp("फरवरी", "ਫਰਵਰੀ"),
  November: lp("नवंबर", "ਨਵੰਬਰ"),
});
function dateLocal(value: string, locale: NativeLocale): string {
  const match = value.match(/^(\d{1,2}) ([A-Za-z]+) (\d{4})$/);
  if (!match) return value;
  const month = MONTHS[match[2]!];
  if (!month) throw new Error(`Unknown month in ${value}`);
  return `${match[1]} ${native(month, locale)} ${match[3]}`;
}

function cp2MilestoneQuestion(row: (typeof POL_CP002_MILESTONES_V1)[number], locale: NativeLocale): string {
  if (row.id === "rajendra-prasad-president") {
    return locale === "hi"
      ? "राजेंद्र प्रसाद संविधान सभा के स्थायी अध्यक्ष कब चुने गए?"
      : "ਰਾਜੇਂਦਰ ਪ੍ਰਸਾਦ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸਥਾਈ ਪ੍ਰਧਾਨ ਕਦੋਂ ਚੁਣੇ ਗਏ?";
  }
  if (row.id === "objectives-moved") {
    return locale === "hi"
      ? "जवाहरलाल नेहरू ने उद्देश्य प्रस्ताव कब प्रस्तुत किया?"
      : "ਜਵਾਹਰਲਾਲ ਨੇਹਰੂ ਨੇ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਕਦੋਂ ਪੇਸ਼ ਕੀਤਾ?";
  }
  if (row.id === "objectives-adopted") {
    return locale === "hi"
      ? "संविधान सभा ने उद्देश्य प्रस्ताव कब स्वीकार किया?"
      : "ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਕਦੋਂ ਸਵੀਕਾਰ ਕੀਤਾ?";
  }
  return locale === "hi"
    ? `${native(CP2_MILESTONES[row.id]!.event, locale)} किस तारीख को हुआ?`
    : `${native(CP2_MILESTONES[row.id]!.event, locale)} ਕਿਹੜੀ ਤਾਰੀਖ ਨੂੰ ਹੋਇਆ?`;
}

function cp2DatedSentence(row: (typeof POL_CP002_MILESTONES_V1)[number], locale: NativeLocale): string {
  const date = dateLocal(row.displayDate, locale);
  const hi: Readonly<Record<string, string>> = {
    "first-sitting": `संविधान सभा की पहली बैठक ${date} को हुई।`,
    "rajendra-prasad-president": `राजेंद्र प्रसाद ${date} को संविधान सभा के स्थायी अध्यक्ष चुने गए।`,
    "objectives-moved": `जवाहरलाल नेहरू ने ${date} को उद्देश्य प्रस्ताव प्रस्तुत किया।`,
    "objectives-adopted": `संविधान सभा ने ${date} को उद्देश्य प्रस्ताव स्वीकार किया।`,
    "drafting-committee-appointed": `संविधान सभा ने ${date} को प्रारूप समिति नियुक्त की।`,
    "draft-submitted": `प्रारूप समिति ने ${date} को संविधान सभा के अध्यक्ष को संविधान का मसौदा सौंपा।`,
    "constitution-adopted": `संविधान सभा ने ${date} को भारत का संविधान अंगीकृत किया।`,
    "constitution-signed": `संविधान सभा के सदस्यों ने ${date} को संविधान पर हस्ताक्षर किए।`,
    "constitution-commenced": `भारत का संविधान ${date} को पूर्ण रूप से लागू हुआ।`,
  };
  const pa: Readonly<Record<string, string>> = {
    "first-sitting": `ਸੰਵਿਧਾਨ ਸਭਾ ਦੀ ਪਹਿਲੀ ਬੈਠਕ ${date} ਨੂੰ ਹੋਈ।`,
    "rajendra-prasad-president": `ਰਾਜੇਂਦਰ ਪ੍ਰਸਾਦ ${date} ਨੂੰ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸਥਾਈ ਪ੍ਰਧਾਨ ਚੁਣੇ ਗਏ।`,
    "objectives-moved": `ਜਵਾਹਰਲਾਲ ਨੇਹਰੂ ਨੇ ${date} ਨੂੰ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਪੇਸ਼ ਕੀਤਾ।`,
    "objectives-adopted": `ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ${date} ਨੂੰ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਸਵੀਕਾਰ ਕੀਤਾ।`,
    "drafting-committee-appointed": `ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ${date} ਨੂੰ ਮਸੌਦਾ ਕਮੇਟੀ ਨਿਯੁਕਤ ਕੀਤੀ।`,
    "draft-submitted": `ਮਸੌਦਾ ਕਮੇਟੀ ਨੇ ${date} ਨੂੰ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਪ੍ਰਧਾਨ ਨੂੰ ਸੰਵਿਧਾਨ ਦਾ ਮਸੌਦਾ ਸੌਂਪਿਆ।`,
    "constitution-adopted": `ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ${date} ਨੂੰ ਭਾਰਤ ਦਾ ਸੰਵਿਧਾਨ ਅੰਗੀਕਾਰ ਕੀਤਾ।`,
    "constitution-signed": `ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਮੈਂਬਰਾਂ ਨੇ ${date} ਨੂੰ ਸੰਵਿਧਾਨ ਤੇ ਦਸਤਖਤ ਕੀਤੇ।`,
    "constitution-commenced": `ਭਾਰਤ ਦਾ ਸੰਵਿਧਾਨ ${date} ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਲਾਗੂ ਹੋਇਆ।`,
  };
  const output = (locale === "hi" ? hi : pa)[row.id];
  if (!output) throw new Error(`Missing dated milestone sentence for ${row.id}`);
  return output;
}


const CP2_MILESTONES: Readonly<Record<string, { event: Pair; detail: Pair }>> = Object.freeze({
  "first-sitting": { event: lp("संविधान सभा की पहली बैठक हुई", "ਸੰਵਿਧਾਨ ਸਭਾ ਦੀ ਪਹਿਲੀ ਬੈਠਕ ਹੋਈ"), detail: lp("पहली बैठक नई दिल्ली के संविधान कक्ष में हुई थी", "ਪਹਿਲੀ ਬੈਠਕ ਨਵੀਂ ਦਿੱਲੀ ਦੇ ਸੰਵਿਧਾਨ ਹਾਲ ਵਿੱਚ ਹੋਈ ਸੀ") },
  "rajendra-prasad-president": { event: lp("राजेंद्र प्रसाद संविधान सभा के स्थायी अध्यक्ष चुने गए", "ਰਾਜੇਂਦਰ ਪ੍ਰਸਾਦ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸਥਾਈ ਪ੍ਰਧਾਨ ਚੁਣੇ ਗਏ"), detail: lp("उन्होंने प्रारंभिक बैठक की अस्थायी अध्यक्षता के बाद स्थायी अध्यक्ष का पद संभाला", "ਉਨ੍ਹਾਂ ਨੇ ਸ਼ੁਰੂਆਤੀ ਬੈਠਕ ਦੀ ਅਸਥਾਈ ਅਧਿਆਕਸ਼ਤਾ ਤੋਂ ਬਾਅਦ ਸਥਾਈ ਪ੍ਰਧਾਨ ਦਾ ਅਹੁਦਾ ਸੰਭਾਲਿਆ") },
  "objectives-moved": { event: lp("जवाहरलाल नेहरू ने उद्देश्य प्रस्ताव प्रस्तुत किया", "ਜਵਾਹਰਲਾਲ ਨੇਹਰੂ ਨੇ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਪੇਸ਼ ਕੀਤਾ"), detail: lp("इस प्रस्ताव ने भावी संविधान के मूल उद्देश्यों को सामने रखा", "ਇਸ ਪ੍ਰਸਤਾਵ ਨੇ ਭਵਿੱਖ ਦੇ ਸੰਵਿਧਾਨ ਦੇ ਮੁੱਖ ਉਦੇਸ਼ ਦਰਸਾਏ") },
  "objectives-adopted": { event: lp("संविधान सभा ने उद्देश्य प्रस्ताव स्वीकार किया", "ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਸਵੀਕਾਰ ਕੀਤਾ"), detail: lp("यह प्रस्ताव बाद में प्रस्तावना में दिखाई देने वाले संवैधानिक दर्शन का महत्वपूर्ण आधार बना", "ਇਹ ਪ੍ਰਸਤਾਵ ਬਾਅਦ ਵਿੱਚ ਪ੍ਰਸਤਾਵਨਾ ਵਿੱਚ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਸੰਵਿਧਾਨਕ ਦਰਸ਼ਨ ਦਾ ਮਹੱਤਵਪੂਰਨ ਆਧਾਰ ਬਣਿਆ") },
  "drafting-committee-appointed": { event: lp("संविधान सभा ने प्रारूप समिति नियुक्त की", "ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ਮਸੌਦਾ ਕਮੇਟੀ ਨਿਯੁਕਤ ਕੀਤੀ"), detail: lp("प्रारंभिक समिति में सात सदस्य थे और उसे संवैधानिक मसौदे की जाँच व संशोधन का कार्य दिया गया", "ਸ਼ੁਰੂਆਤੀ ਕਮੇਟੀ ਵਿੱਚ ਸੱਤ ਮੈਂਬਰ ਸਨ ਅਤੇ ਇਸ ਨੂੰ ਸੰਵਿਧਾਨਕ ਮਸੌਦੇ ਦੀ ਜਾਂਚ ਤੇ ਸੋਧ ਦਾ ਕੰਮ ਦਿੱਤਾ ਗਿਆ") },
  "draft-submitted": { event: lp("प्रारूप समिति ने संविधान सभा के अध्यक्ष को संविधान का मसौदा सौंपा", "ਮਸੌਦਾ ਕਮੇਟੀ ਨੇ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਪ੍ਰਧਾਨ ਨੂੰ ਸੰਵਿਧਾਨ ਦਾ ਮਸੌਦਾ ਸੌਂਪਿਆ"), detail: lp("1948 के मसौदे में 315 अनुच्छेद और 8 अनुसूचियाँ थीं", "1948 ਦੇ ਮਸੌਦੇ ਵਿੱਚ 315 ਅਨੁਛੇਦ ਅਤੇ 8 ਅਨੁਸੂਚੀਆਂ ਸਨ") },
  "constitution-adopted": { event: lp("संविधान सभा ने भारत का संविधान अंगीकृत किया", "ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ਭਾਰਤ ਦਾ ਸੰਵਿਧਾਨ ਅੰਗੀਕਾਰ ਕੀਤਾ"), detail: lp("इसी दिन संविधान को अंगीकृत, अधिनियमित और जनता को समर्पित किया गया", "ਇਸੇ ਦਿਨ ਸੰਵਿਧਾਨ ਨੂੰ ਅੰਗੀਕਾਰ, ਅਧਿਨਿਯਮਿਤ ਅਤੇ ਲੋਕਾਂ ਨੂੰ ਸਮਰਪਿਤ ਕੀਤਾ ਗਿਆ") },
  "constitution-signed": { event: lp("संविधान सभा के सदस्यों ने संविधान पर हस्ताक्षर किए", "ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਮੈਂਬਰਾਂ ਨੇ ਸੰਵਿਧਾਨ ਤੇ ਦਸਤਖਤ ਕੀਤੇ"), detail: lp("आधिकारिक विवरण के अनुसार 284 सदस्यों ने संविधान पर हस्ताक्षर किए", "ਅਧਿਕਾਰਕ ਵੇਰਵੇ ਅਨੁਸਾਰ 284 ਮੈਂਬਰਾਂ ਨੇ ਸੰਵਿਧਾਨ ਤੇ ਦਸਤਖਤ ਕੀਤੇ") },
  "constitution-commenced": { event: lp("भारत का संविधान पूर्ण रूप से लागू हुआ", "ਭਾਰਤ ਦਾ ਸੰਵਿਧਾਨ ਪੂਰੀ ਤਰ੍ਹਾਂ ਲਾਗੂ ਹੋਇਆ"), detail: lp("अनुच्छेद 394 ने शेष प्रावधानों के लिए 26 जनवरी 1950 को प्रारंभ तिथि निर्धारित किया", "ਅਨੁਛੇਦ 394 ਨੇ ਬਾਕੀ ਪ੍ਰਬੰਧਾਂ ਲਈ 26 ਜਨਵਰੀ 1950 ਨੂੰ ਲਾਗੂ ਹੋਣ ਦੀ ਤਾਰੀਖ ਨਿਰਧਾਰਤ ਕੀਤਾ") },
});

const CP2_ROLES: Readonly<Record<string, { person: Pair; role: Pair; detail: Pair }>> = Object.freeze({
  "sachchidananda-sinha": { person: lp("सच्चिदानंद सिन्हा", "ਸੱਚਿਦਾਨੰਦ ਸਿੰਹਾ"), role: lp("पहली बैठक में संविधान सभा के अस्थायी अध्यक्ष", "ਪਹਿਲੀ ਬੈਠਕ ਵਿੱਚ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਅਸਥਾਈ ਪ੍ਰਧਾਨ"), detail: lp("उन्होंने 9 दिसंबर 1946 की प्रारंभिक बैठक की अध्यक्षता की", "ਉਨ੍ਹਾਂ ਨੇ 9 ਦਸੰਬਰ 1946 ਦੀ ਸ਼ੁਰੂਆਤੀ ਬੈਠਕ ਦੀ ਅਧਿਆਕਸ਼ਤਾ ਕੀਤੀ") },
  "rajendra-prasad": { person: lp("राजेंद्र प्रसाद", "ਰਾਜੇਂਦਰ ਪ੍ਰਸਾਦ"), role: lp("संविधान सभा के स्थायी अध्यक्ष", "ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸਥਾਈ ਪ੍ਰਧਾਨ"), detail: lp("वे 11 दिसंबर 1946 को स्थायी अध्यक्ष चुने गए", "ਉਹ 11 ਦਸੰਬਰ 1946 ਨੂੰ ਸਥਾਈ ਪ੍ਰਧਾਨ ਚੁਣੇ ਗਏ") },
  "bn-rau": { person: lp("बी. एन. राव", "ਬੀ. ਐਨ. ਰਾਓ"), role: lp("संविधान सभा के संवैधानिक सलाहकार", "ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸੰਵਿਧਾਨਕ ਸਲਾਹਕਾਰ"), detail: lp("उन्होंने प्रारूप समिति के विचार के लिए एक प्रारंभिक मसौदा तैयार किया", "ਉਨ੍ਹਾਂ ਨੇ ਮਸੌਦਾ ਕਮੇਟੀ ਦੇ ਵਿਚਾਰ ਲਈ ਇੱਕ ਸ਼ੁਰੂਆਤੀ ਮਸੌਦਾ ਤਿਆਰ ਕੀਤਾ") },
  "br-ambedkar": { person: lp("बी. आर. आंबेडकर", "ਬੀ. ਆਰ. ਅੰਬੇਡਕਰ"), role: lp("प्रारूप समिति के अध्यक्ष", "ਮਸੌਦਾ ਕਮੇਟੀ ਦੇ ਅਧਿਆਕਸ਼"), detail: lp("प्रारूप समिति ने सभा के निर्णयों को विधिक रूप दिया और संवैधानिक मसौदे की जाँच की", "ਮਸੌਦਾ ਕਮੇਟੀ ਨੇ ਸਭਾ ਦੇ ਫੈਸਲਿਆਂ ਨੂੰ ਕਾਨੂੰਨੀ ਰੂਪ ਦਿੱਤਾ ਅਤੇ ਸੰਵਿਧਾਨਕ ਮਸੌਦੇ ਦੀ ਜਾਂਚ ਕੀਤੀ") },
  "jawaharlal-nehru-objectives": { person: lp("जवाहरलाल नेहरू", "ਜਵਾਹਰਲਾਲ ਨੇਹਰੂ"), role: lp("उद्देश्य प्रस्ताव के प्रस्तुतकर्ता", "ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਦੇ ਪੇਸ਼ਕਾਰ"), detail: lp("उन्होंने 13 दिसंबर 1946 को उद्देश्य प्रस्ताव प्रस्तुत किया", "ਉਨ੍ਹਾਂ ਨੇ 13 ਦਸੰਬਰ 1946 ਨੂੰ ਉਦੇਸ਼ ਪ੍ਰਸਤਾਵ ਪੇਸ਼ ਕੀਤਾ") },
});

const PATEL = lp("वल्लभभाई पटेल", "ਵੱਲਭਭਾਈ ਪਟੇਲ");

const CP2_COMMITTEES: Readonly<Record<string, { committee: Pair; chair: Pair; fn: Pair }>> = Object.freeze({
  "drafting-committee": { committee: lp("प्रारूप समिति", "ਮਸੌਦਾ ਕਮੇਟੀ"), chair: CP2_ROLES["br-ambedkar"]!.person, fn: lp("सभा के निर्णयों के अनुसार संवैधानिक मसौदे की जाँच और संशोधन", "ਸਭਾ ਦੇ ਫੈਸਲਿਆਂ ਅਨੁਸਾਰ ਸੰਵਿਧਾਨਕ ਮਸੌਦੇ ਦੀ ਜਾਂਚ ਅਤੇ ਸੋਧ") },
  "union-powers-committee": { committee: lp("संघ शक्ति समिति", "ਸੰਘ ਸ਼ਕਤੀ ਕਮੇਟੀ"), chair: CP2_ROLES["jawaharlal-nehru-objectives"]!.person, fn: lp("संघ को दिए जाने वाले विषयों और शक्तियों की जाँच", "ਸੰਘ ਨੂੰ ਦਿੱਤੇ ਜਾਣ ਵਾਲੇ ਵਿਸ਼ਿਆਂ ਅਤੇ ਸ਼ਕਤੀਆਂ ਦੀ ਜਾਂਚ") },
  "union-constitution-committee": { committee: lp("संघ संविधान समिति", "ਸੰਘ ਸੰਵਿਧਾਨ ਕਮੇਟੀ"), chair: CP2_ROLES["jawaharlal-nehru-objectives"]!.person, fn: lp("संघ संविधान के सिद्धांतों पर रिपोर्ट देना", "ਸੰਘ ਸੰਵਿਧਾਨ ਦੇ ਸਿਧਾਂਤਾਂ ਬਾਰੇ ਰਿਪੋਰਟ ਦੇਣਾ") },
  "provincial-constitution-committee": { committee: lp("प्रांतीय संविधान समिति", "ਸੂਬਾਈ ਸੰਵਿਧਾਨ ਕਮੇਟੀ"), chair: PATEL, fn: lp("आदर्श प्रांतीय संविधान के सिद्धांतों पर रिपोर्ट देना", "ਮਾਡਲ ਸੂਬਾਈ ਸੰਵਿਧਾਨ ਦੇ ਸਿਧਾਂਤਾਂ ਬਾਰੇ ਰਿਪੋਰਟ ਦੇਣਾ") },
  "advisory-committee": { committee: lp("मौलिक अधिकार, अल्पसंख्यक तथा जनजातीय और अपवर्जित क्षेत्रों पर सलाहकार समिति", "ਮੂਲ ਅਧਿਕਾਰਾਂ, ਘੱਟਗਿਣਤੀਆਂ ਅਤੇ ਕਬਾਇਲੀ ਤੇ ਬਾਹਰ ਰੱਖੇ ਖੇਤਰਾਂ ਬਾਰੇ ਸਲਾਹਕਾਰ ਕਮੇਟੀ"), chair: PATEL, fn: lp("मौलिक अधिकारों, अल्पसंख्यक सुरक्षा और जनजातीय/अपवर्जित क्षेत्रों के प्रश्नों की जाँच", "ਮੂਲ ਅਧਿਕਾਰਾਂ, ਘੱਟਗਿਣਤੀ ਸੁਰੱਖਿਆ ਅਤੇ ਕਬਾਇਲੀ/ਬਾਹਰ ਰੱਖੇ ਖੇਤਰਾਂ ਦੇ ਮਸਲਿਆਂ ਦੀ ਜਾਂਚ") },
});

const CP2_COMPOSITION: Readonly<Record<string, { label: Pair; explanation: Pair }>> = Object.freeze({
  "initial-strength": { label: lp("कैबिनेट मिशन योजना के अंतर्गत प्रारंभिक कुल सदस्य संख्या", "ਕੈਬਿਨੇਟ ਮਿਸ਼ਨ ਯੋਜਨਾ ਅਧੀਨ ਸ਼ੁਰੂਆਤੀ ਕੁੱਲ ਮੈਂਬਰ ਗਿਣਤੀ"), explanation: lp("प्रस्तावित संविधान सभा में कुल 389 सदस्य होने थे", "ਪ੍ਰਸਤਾਵਿਤ ਸੰਵਿਧਾਨ ਸਭਾ ਵਿੱਚ ਕੁੱਲ 389 ਮੈਂਬਰ ਹੋਣੇ ਸਨ") },
  "british-india-seats": { label: lp("ब्रिटिश भारत को दी गई सीटें", "ਬਰਤਾਨਵੀ ਭਾਰਤ ਨੂੰ ਦਿੱਤੀਆਂ ਸੀਟਾਂ"), explanation: lp("कैबिनेट मिशन योजना में ब्रिटिश भारत के लिए 296 सीटें थीं", "ਕੈਬਿਨੇਟ ਮਿਸ਼ਨ ਯੋਜਨਾ ਵਿੱਚ ਬਰਤਾਨਵੀ ਭਾਰਤ ਲਈ 296 ਸੀਟਾਂ ਸਨ") },
  "princely-state-seats": { label: lp("देशी रियासतों को आवंटित सीटें", "ਦੇਸੀ ਰਿਆਸਤਾਂ ਨੂੰ ਦਿੱਤੀਆਂ ਸੀਟਾਂ"), explanation: lp("भारतीय रियासतों को 93 सीटें आवंटित की गई थीं", "ਭਾਰਤੀ ਰਿਆਸਤਾਂ ਨੂੰ 93 ਸੀਟਾਂ ਦਿੱਤੀਆਂ ਗਈਆਂ ਸਨ") },
  "sessions": { label: lp("संविधान निर्माण के दौरान संविधान सभा के सत्र", "ਸੰਵਿਧਾਨ ਬਣਾਉਣ ਦੌਰਾਨ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸੈਸ਼ਨ"), explanation: lp("संविधान सभा ने संविधान निर्माण का कार्य पूरा करते हुए 11 सत्र किए", "ਸੰਵਿਧਾਨ ਸਭਾ ਨੇ ਸੰਵਿਧਾਨ ਬਣਾਉਣ ਦਾ ਕੰਮ ਪੂਰਾ ਕਰਦਿਆਂ 11 ਸੈਸ਼ਨ ਕੀਤੇ") },
  "sitting-days": { label: lp("संविधान सभा की कुल बैठक के दिन", "ਸੰਵਿਧਾਨ ਸਭਾ ਦੀਆਂ ਕੁੱਲ ਬੈਠਕਾਂ ਦੇ ਦਿਨ"), explanation: lp("आधिकारिक विवरण में 165 बैठक-दिन दर्ज हैं, जिनमें 114 दिन संविधान के मसौदे पर विचार में लगे", "ਅਧਿਕਾਰਕ ਵੇਰਵੇ ਵਿੱਚ 165 ਬੈਠਕ-ਦਿਨ ਦਰਜ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚ 114 ਦਿਨ ਸੰਵਿਧਾਨ ਦੇ ਮਸੌਦੇ ਤੇ ਵਿਚਾਰ ਵਿੱਚ ਲੱਗੇ") },
  "draft-days": { label: lp("संविधान के मसौदे पर विचार में लगे दिन", "ਸੰਵਿਧਾਨ ਦੇ ਮਸੌਦੇ ਤੇ ਵਿਚਾਰ ਲਈ ਲੱਗੇ ਦਿਨ"), explanation: lp("165 बैठक-दिनों में से 114 दिन संविधान के मसौदे पर विचार के लिए लगाए गए", "165 ਬੈਠਕ-ਦਿਨਾਂ ਵਿੱਚੋਂ 114 ਦਿਨ ਸੰਵਿਧਾਨ ਦੇ ਮਸੌਦੇ ਤੇ ਵਿਚਾਰ ਲਈ ਲਗੇ") },
  "draft-articles": { label: lp("21 फरवरी 1948 को प्रस्तुत संविधान के मसौदे में अनुच्छेद", "21 ਫਰਵਰੀ 1948 ਨੂੰ ਪੇਸ਼ ਸੰਵਿਧਾਨ ਦੇ ਮਸੌਦੇ ਵਿੱਚ ਅਨੁਛੇਦ"), explanation: lp("1948 के मसौदे में 315 अनुच्छेद और 8 अनुसूचियाँ थीं", "1948 ਦੇ ਮਸੌਦੇ ਵਿੱਚ 315 ਅਨੁਛੇਦ ਅਤੇ 8 ਅਨੁਸੂਚੀਆਂ ਸਨ") },
  "original-articles": { label: lp("प्रारंभ के समय संविधान में अनुच्छेद", "ਲਾਗੂ ਹੋਣ ਵੇਲੇ ਸੰਵਿਧਾਨ ਵਿੱਚ ਅਨੁਛੇਦ"), explanation: lp("मूल संविधान में 395 अनुच्छेद और 8 अनुसूचियाँ थीं", "ਮੂਲ ਸੰਵਿਧਾਨ ਵਿੱਚ 395 ਅਨੁਛੇਦ ਅਤੇ 8 ਅਨੁਸੂਚੀਆਂ ਸਨ") },
  "signatories": { label: lp("24 जनवरी 1950 को संविधान पर हस्ताक्षर करने वाले सदस्य", "24 ਜਨਵਰੀ 1950 ਨੂੰ ਸੰਵਿਧਾਨ ਤੇ ਦਸਤਖਤ ਕਰਨ ਵਾਲੇ ਮੈਂਬਰ"), explanation: lp("आधिकारिक विवरण में संविधान पर हस्ताक्षर करने वाले 284 सदस्य दर्ज हैं", "ਅਧਿਕਾਰਕ ਵੇਰਵੇ ਵਿੱਚ ਸੰਵਿਧਾਨ ਤੇ ਦਸਤਖਤ ਕਰਨ ਵਾਲੇ 284 ਮੈਂਬਰ ਦਰਜ ਹਨ") },
});

const CP2_INFLUENCE: Readonly<Record<string, { feature: Pair; source: Pair; explanation: Pair }>> = Object.freeze({
  "uk-parliamentary": { feature: lp("संसदीय शासन प्रणाली", "ਸੰਸਦੀ ਸਰਕਾਰ ਪ੍ਰਣਾਲੀ"), source: lp("ब्रिटिश संवैधानिक परंपरा", "ਬਰਤਾਨਵੀ ਸੰਵਿਧਾਨਕ ਪਰੰਪਰਾ"), explanation: lp("भारत ने संसदीय शासन प्रणाली को ब्रिटिश संवैधानिक मॉडल से अपनाया", "ਭਾਰਤ ਨੇ ਸੰਸਦੀ ਸਰਕਾਰ ਪ੍ਰਣਾਲੀ ਨੂੰ ਬਰਤਾਨਵੀ ਸੰਵਿਧਾਨਕ ਮਾਡਲ ਤੋਂ ਅਪਣਾਇਆ") },
  "us-fundamental-rights": { feature: lp("मौलिक अधिकार", "ਮੂਲ ਅਧਿਕਾਰ"), source: lp("संयुक्त राज्य अमेरिका का संविधान", "ਸੰਯੁਕਤ ਰਾਜ ਅਮਰੀਕਾ ਦਾ ਸੰਵਿਧਾਨ"), explanation: lp("मौलिक अधिकारों के अध्याय को संयुक्त राज्य अमेरिका के संविधान से प्रमुख प्रेरणा मिली", "ਮੂਲ ਅਧਿਕਾਰਾਂ ਦੇ ਅਧਿਆਇ ਨੂੰ ਸੰਯੁਕਤ ਰਾਜ ਅਮਰੀਕਾ ਦੇ ਸੰਵਿਧਾਨ ਤੋਂ ਮੁੱਖ ਪ੍ਰੇਰਣਾ ਮਿਲੀ") },
  "ireland-dpsp": { feature: lp("राज्य के नीति-निदेशक तत्व", "ਰਾਜ ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ"), source: lp("आयरलैंड का संविधान", "ਆਇਰਲੈਂਡ ਦਾ ਸੰਵਿਧਾਨ"), explanation: lp("नीति-निदेशक तत्व आयरिश संवैधानिक मॉडल से अपनाए गए", "ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤ ਆਇਰਿਸ਼ ਸੰਵਿਧਾਨਕ ਮਾਡਲ ਤੋਂ ਅਪਣਾਏ ਗਏ") },
  "goi1935-federal-admin": { feature: lp("संघीय और प्रशासनिक ढाँचा", "ਸੰਘੀ ਅਤੇ ਪ੍ਰਸ਼ਾਸਕੀ ਢਾਂਚਾ"), source: lp("भारत शासन अधिनियम, 1935", "ਭਾਰਤ ਸਰਕਾਰ ਐਕਟ, 1935"), explanation: lp("1935 के अधिनियम ने संविधान के लिए संघीय और प्रशासनिक व्यवस्था का महत्वपूर्ण आधार दिया", "1935 ਦੇ ਐਕਟ ਨੇ ਸੰਵਿਧਾਨ ਲਈ ਸੰਘੀ ਅਤੇ ਪ੍ਰਸ਼ਾਸਕੀ ਪ੍ਰਣਾਲੀ ਦਾ ਮਹੱਤਵਪੂਰਨ ਆਧਾਰ ਦਿੱਤਾ") },
});

function cp2MilestoneByEvent(event: string) {
  const row = POL_CP002_MILESTONES_V1.find((item) => item.event === event);
  if (!row) throw new Error(`Unknown CP002 event: ${event}`);
  return row;
}
function cp2RoleByPerson(person: string) {
  const row = POL_CP002_ROLE_ROWS_V1.find((item) => item.person === person);
  if (!row) throw new Error(`Unknown CP002 person: ${person}`);
  return row;
}
function personLocal(person: string, locale: NativeLocale): string {
  if (person === "Vallabhbhai Patel") return native(PATEL, locale);
  return native(CP2_ROLES[cp2RoleByPerson(person).id]!.person, locale);
}
function roleLocal(role: string, locale: NativeLocale): string {
  const row = POL_CP002_ROLE_ROWS_V1.find((item) => item.role.toLowerCase() === role.toLowerCase());
  if (!row) throw new Error(`Unknown CP002 role: ${role}`);
  return native(CP2_ROLES[row.id]!.role, locale);
}
function committeeLocal(name: string, locale: NativeLocale): string {
  const row = POL_CP002_COMMITTEE_ROWS_V1.find((item) => item.committee === name);
  if (!row) throw new Error(`Unknown CP002 committee: ${name}`);
  return native(CP2_COMMITTEES[row.id]!.committee, locale);
}
function featureLocal(feature: string, locale: NativeLocale): string {
  const row = POL_CP002_INFLUENCE_ROWS_V1.find((item) => item.feature === feature);
  if (!row) throw new Error(`Unknown CP002 influence feature: ${feature}`);
  return native(CP2_INFLUENCE[row.id]!.feature, locale);
}
function sourceLocal(source: string, locale: NativeLocale): string {
  const row = POL_CP002_INFLUENCE_ROWS_V1.find((item) => item.source === source);
  if (!row) throw new Error(`Unknown CP002 influence source: ${source}`);
  return native(CP2_INFLUENCE[row.id]!.source, locale);
}

const ELECTION_OPTIONS: Readonly<Record<string, Pair>> = Object.freeze({
  "By Provincial Legislative Assemblies using proportional representation by the single transferable vote": lp(
    "प्रांतीय विधानसभाओं द्वारा एकल संक्रमणीय मत के माध्यम से आनुपातिक प्रतिनिधित्व से",
    "ਸੂਬਾਈ ਵਿਧਾਨ ਸਭਾਵਾਂ ਵੱਲੋਂ ਇਕਲ ਤਬਦੀਲੀਯੋਗ ਮਤ ਰਾਹੀਂ ਅਨੁਪਾਤਕ ਪ੍ਰਤੀਨਿਧਿਤਾ ਨਾਲ",
  ),
  "By direct election on the basis of universal adult franchise": lp("सार्वभौमिक वयस्क मताधिकार के आधार पर प्रत्यक्ष चुनाव से", "ਸਾਰਵਭੌਮ ਬਾਲਗ ਮਤਾਧਿਕਾਰ ਦੇ ਆਧਾਰ ਤੇ ਸਿੱਧੀ ਚੋਣ ਰਾਹੀਂ"),
  "By nomination of all provincial representatives by the Governor-General": lp("सभी प्रांतीय प्रतिनिधियों के गवर्नर-जनरल द्वारा नामांकन से", "ਸਾਰੇ ਸੂਬਾਈ ਪ੍ਰਤੀਨਿਧੀਆਂ ਦੀ ਗਵਰਨਰ-ਜਨਰਲ ਵੱਲੋਂ ਨਾਮਜ਼ਦਗੀ ਰਾਹੀਂ"),
  "By Provincial Legislative Assemblies using a simple plurality vote": lp("प्रांतीय विधानसभाओं द्वारा साधारण बहुलता मत से", "ਸੂਬਾਈ ਵਿਧਾਨ ਸਭਾਵਾਂ ਵੱਲੋਂ ਸਧਾਰਣ ਬਹੁਮਤ ਮਤ ਨਾਲ"),
});

const PROCESS_SEGMENTS: Readonly<Record<string, Pair>> = Object.freeze({
  "B. N. Rau prepared a rough draft": lp("बी. एन. राव ने प्रारंभिक मसौदा तैयार किया", "ਬੀ. ਐਨ. ਰਾਓ ਨੇ ਸ਼ੁਰੂਆਤੀ ਮਸੌਦਾ ਤਿਆਰ ਕੀਤਾ"),
  "Drafting Committee scrutinised and revised the draft": lp("प्रारूप समिति ने मसौदे की जाँच और संशोधन किया", "ਮਸੌਦਾ ਕਮੇਟੀ ਨੇ ਮਸੌਦੇ ਦੀ ਜਾਂਚ ਅਤੇ ਸੋਧ ਕੀਤੀ"),
  "Draft Constitution was submitted in February 1948": lp("संविधान का मसौदा फरवरी 1948 में प्रस्तुत किया गया", "ਸੰਵਿਧਾਨ ਦਾ ਮਸੌਦਾ ਫਰਵਰੀ 1948 ਵਿੱਚ ਪੇਸ਼ ਕੀਤਾ ਗਿਆ"),
  "Constitution was adopted in November 1949": lp("संविधान नवंबर 1949 में अंगीकृत किया गया", "ਸੰਵਿਧਾਨ ਨਵੰਬਰ 1949 ਵਿੱਚ ਅੰਗੀਕਾਰ ਕੀਤਾ ਗਿਆ"),
  "Drafting Committee was appointed": lp("प्रारूप समिति नियुक्त की गई", "ਮਸੌਦਾ ਕਮੇਟੀ ਨਿਯੁਕਤ ਕੀਤੀ ਗਈ"),
  "Constitution was adopted": lp("संविधान अंगीकृत किया गया", "ਸੰਵਿਧਾਨ ਅੰਗੀਕਾਰ ਕੀਤਾ ਗਿਆ"),
  "Draft Constitution was submitted": lp("संविधान का मसौदा प्रस्तुत किया गया", "ਸੰਵਿਧਾਨ ਦਾ ਮਸੌਦਾ ਪੇਸ਼ ਕੀਤਾ ਗਿਆ"),
});

function cp2Option(text: string, locale: NativeLocale): string {
  if (COUNT_OPTIONS[text]) return native(COUNT_OPTIONS[text]!, locale);
  if (/^\d+$/.test(text)) return text;
  const milestone = POL_CP002_MILESTONES_V1.find((row) => row.displayDate === text);
  if (milestone) return dateLocal(text, locale);
  const event = POL_CP002_MILESTONES_V1.find((row) => row.event === text);
  if (event) return native(CP2_MILESTONES[event.id]!.event, locale);
  if (POL_CP002_ROLE_ROWS_V1.some((row) => row.person === text) || text === "Vallabhbhai Patel") return personLocal(text, locale);
  if (POL_CP002_ROLE_ROWS_V1.some((row) => row.role === text)) return roleLocal(text, locale);
  const committee = POL_CP002_COMMITTEE_ROWS_V1.find((row) => row.committee === text);
  if (committee) return native(CP2_COMMITTEES[committee.id]!.committee, locale);
  const influenceFeature = POL_CP002_INFLUENCE_ROWS_V1.find((row) => row.feature === text);
  if (influenceFeature) return native(CP2_INFLUENCE[influenceFeature.id]!.feature, locale);
  const influenceSource = POL_CP002_INFLUENCE_ROWS_V1.find((row) => row.source === text);
  if (influenceSource) return native(CP2_INFLUENCE[influenceSource.id]!.source, locale);
  if (ELECTION_OPTIONS[text]) return native(ELECTION_OPTIONS[text]!, locale);

  if (text.includes(" → ")) {
    return text.split(" → ").map((part) => PROCESS_SEGMENTS[part]
      ? native(PROCESS_SEGMENTS[part]!, locale)
      : cp2Option(part, locale)).join(" → ");
  }
  if (text.startsWith("Adopted — ")) {
    return text.split("; ").map((part) => {
      const [label, date] = part.split(" — ");
      const labelPair = label === "Adopted"
        ? lp("अंगीकृत", "ਅੰਗੀਕਾਰ")
        : label === "Signed"
          ? lp("हस्ताक्षर", "ਦਸਤਖਤ")
          : lp("लागू", "ਲਾਗੂ");
      return `${native(labelPair, locale)} — ${dateLocal(date!, locale)}`;
    }).join("; ");
  }
  if (text.includes(" — ")) {
    const [left, right] = text.split(" — ");
    const leftLocalized =
      POL_CP002_MILESTONES_V1.some((row) => row.event === left) ? cp2Option(left!, locale)
      : POL_CP002_COMMITTEE_ROWS_V1.some((row) => row.committee === left) ? committeeLocal(left!, locale)
      : left!;
    const rightLocalized =
      POL_CP002_MILESTONES_V1.some((row) => row.displayDate === right) ? dateLocal(right!, locale)
      : POL_CP002_ROLE_ROWS_V1.some((row) => row.person === right) || right === "Vallabhbhai Patel" ? personLocal(right!, locale)
      : right!;
    if (/[A-Za-z]{2,}/.test(leftLocalized) || /[A-Za-z]{2,}/.test(rightLocalized)) {
      throw new Error(`Untranslated CP002 pair: ${text}`);
    }
    return `${leftLocalized} — ${rightLocalized}`;
  }
  throw new Error(`Untranslated CP002 option: ${text}`);
}

function cp2MilestoneStatement(statement: string, locale: NativeLocale): string {
  const text = statement.replace(/\.$/, "");
  const row = POL_CP002_MILESTONES_V1.find((item) => text.startsWith(`${item.event} on `));
  if (!row) throw new Error(`Unparsed CP002 milestone statement: ${statement}`);
  const date = text.slice(row.event.length + 4);
  return locale === "hi"
    ? `${native(CP2_MILESTONES[row.id]!.event, locale)} — ${dateLocal(date, locale)}।`
    : `${native(CP2_MILESTONES[row.id]!.event, locale)} — ${dateLocal(date, locale)}।`;
}

function cp2RoleStatement(statement: string, locale: NativeLocale): string {
  const text = statement.replace(/\.$/, "");
  const person = POL_CP002_ROLE_ROWS_V1.find((row) => text.startsWith(`${row.person} was the `));
  if (person) {
    const role = text.slice(person.person.length + " was the ".length);
    return locale === "hi"
      ? `${native(CP2_ROLES[person.id]!.person, locale)} — ${roleLocal(role, locale)}।`
      : `${native(CP2_ROLES[person.id]!.person, locale)} — ${roleLocal(role, locale)}।`;
  }
  const committee = POL_CP002_COMMITTEE_ROWS_V1.find((row) => text.startsWith(`${row.committee} was chaired by `));
  if (committee) {
    const chair = text.slice(committee.committee.length + " was chaired by ".length);
    return locale === "hi"
      ? `${committeeLocal(committee.committee, locale)} की अध्यक्षता ${personLocal(chair, locale)} ने की।`
      : `${committeeLocal(committee.committee, locale)} ਦੀ ਅਧਿਆਕਸ਼ਤਾ ${personLocal(chair, locale)} ਨੇ ਕੀਤੀ।`;
  }
  throw new Error(`Unparsed CP002 role statement: ${statement}`);
}

function cp2Stem(q: (typeof CP002_EN)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  if (ql === 1) {
    const row = POL_CP002_MILESTONES_V1.find((item) => item.displayDate === q.canonicalAnswer)!;
    return cp2MilestoneQuestion(row, locale);
  }
  if (ql === 2) {
    const row = cp2MilestoneByEvent(q.canonicalAnswer);
    return locale === "hi"
      ? `${dateLocal(row.displayDate, locale)} को संविधान निर्माण से जुड़ी कौन-सी घटना हुई?`
      : `${dateLocal(row.displayDate, locale)} ਨੂੰ ਸੰਵਿਧਾਨ ਬਣਾਉਣ ਨਾਲ ਜੁੜੀ ਕਿਹੜੀ ਘਟਨਾ ਹੋਈ?`;
  }
  if (ql === 3) {
    const row = cp2RoleByPerson(q.canonicalAnswer);
    return locale === "hi"
      ? `${native(CP2_ROLES[row.id]!.role, locale)} के रूप में किसने कार्य किया?`
      : `${native(CP2_ROLES[row.id]!.role, locale)} ਵਜੋਂ ਕਿਸਨੇ ਕੰਮ ਕੀਤਾ?`;
  }
  if (ql === 4) {
    const row = POL_CP002_ROLE_ROWS_V1.find((item) => q.stem.includes(item.person))!;
    return locale === "hi"
      ? `संविधान निर्माण में ${native(CP2_ROLES[row.id]!.person, locale)} की भूमिका क्या थी?`
      : `ਸੰਵਿਧਾਨ ਬਣਾਉਣ ਵਿੱਚ ${native(CP2_ROLES[row.id]!.person, locale)} ਦੀ ਭੂਮਿਕਾ ਕੀ ਸੀ?`;
  }
  if (ql === 5) {
    const row = POL_CP002_COMMITTEE_ROWS_V1.find((item) => q.stem.includes(item.committee))!;
    return locale === "hi"
      ? `${native(CP2_COMMITTEES[row.id]!.committee, locale)} की अध्यक्षता किसने की?`
      : `${native(CP2_COMMITTEES[row.id]!.committee, locale)} ਦੀ ਅਧਿਆਕਸ਼ਤਾ ਕਿਸਨੇ ਕੀਤੀ?`;
  }
  if (ql === 6) return locale === "hi" ? "निम्न में से कौन-सा समिति–अध्यक्ष युग्म सही सुमेलित है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਮੇਟੀ–ਅਧਿਆਕਸ਼ ਜੋੜ ਸਹੀ ਮਿਲਾਇਆ ਗਿਆ ਹੈ?";
  if (ql === 7) {
    const row = POL_CP002_COMPOSITION_ROWS_V1.find((item) => item.value === q.canonicalAnswer)!;
    return locale === "hi" ? `${native(CP2_COMPOSITION[row.id]!.label, locale)} कितनी थी?` : `${native(CP2_COMPOSITION[row.id]!.label, locale)} ਕਿੰਨੀ ਸੀ?`;
  }
  if (ql === 8) return locale === "hi"
    ? "कैबिनेट मिशन योजना के तहत संविधान सभा के प्रांतीय प्रतिनिधि कैसे चुने जाने थे?"
    : "ਕੈਬਿਨੇਟ ਮਿਸ਼ਨ ਯੋਜਨਾ ਅਧੀਨ ਸੰਵਿਧਾਨ ਸਭਾ ਦੇ ਸੂਬਾਈ ਪ੍ਰਤੀਨਿਧੀ ਕਿਵੇਂ ਚੁਣੇ ਜਾਣੇ ਸਨ?";
  if (ql === 9) return locale === "hi" ? "निम्न में से कौन-सा संविधान-निर्माण घटना–तिथि युग्म सही है?" : "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਸੰਵਿਧਾਨ-ਨਿਰਮਾਣ ਘਟਨਾ–ਤਾਰੀਖ ਜੋੜ ਸਹੀ ਹੈ?";
  if (ql === 10) {
    const lines = q.stem.split("\n");
    return [
      locale === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
      `I. ${cp2MilestoneStatement(lines[1]!.replace(/^I\. /, ""), locale)}`,
      `II. ${cp2MilestoneStatement(lines[2]!.replace(/^II\. /, ""), locale)}`,
      locale === "hi" ? "ऊपर दिए गए कथनों में कौन-सा/से सही है/हैं?" : "ਉੱਪਰ ਦਿੱਤੇ ਬਿਆਨਾਂ ਵਿੱਚੋਂ ਕਿਹੜਾ/ਕਿਹੜੇ ਸਹੀ ਹੈ/ਹਨ?",
    ].join("\n");
  }
  if (ql === 11) {
    const lines = q.stem.split("\n");
    return [
      locale === "hi" ? "निम्न कथनों पर विचार कीजिए:" : "ਹੇਠ ਲਿਖੇ ਬਿਆਨਾਂ ਤੇ ਵਿਚਾਰ ਕਰੋ:",
      `1. ${cp2RoleStatement(lines[1]!.replace(/^1\. /, ""), locale)}`,
      `2. ${cp2RoleStatement(lines[2]!.replace(/^2\. /, ""), locale)}`,
      `3. ${cp2RoleStatement(lines[3]!.replace(/^3\. /, ""), locale)}`,
      locale === "hi" ? "ऊपर दिए गए कितने कथन सही हैं?" : "ਉੱਪਰ ਦਿੱਤੇ ਕਿੰਨੇ ਬਿਆਨ ਸਹੀ ਹਨ?",
    ].join("\n");
  }
  if (ql === 12) return locale === "hi" ? "संविधान निर्माण की इन घटनाओं का सही कालानुक्रमिक क्रम कौन-सा है?" : "ਸੰਵਿਧਾਨ ਬਣਾਉਣ ਦੀਆਂ ਇਨ੍ਹਾਂ ਘਟਨਾਵਾਂ ਦਾ ਸਹੀ ਕਾਲਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?";
  if (ql === 13) {
    const row = POL_CP002_INFLUENCE_ROWS_V1.find((item) => item.source === q.canonicalAnswer)!;
    const stems: Readonly<Record<string, Pair>> = {
      "uk-parliamentary": lp("भारतीय संविधान की संसदीय शासन प्रणाली का प्रमुख प्रेरणा-स्रोत कौन-सा था?", "ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੀ ਸੰਸਦੀ ਸਰਕਾਰ ਪ੍ਰਣਾਲੀ ਦਾ ਮੁੱਖ ਪ੍ਰੇਰਣਾ-ਸਰੋਤ ਕਿਹੜਾ ਸੀ?"),
      "us-fundamental-rights": lp("भारतीय संविधान के मौलिक अधिकारों का प्रमुख प्रेरणा-स्रोत कौन-सा था?", "ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੇ ਮੂਲ ਅਧਿਕਾਰਾਂ ਦਾ ਮੁੱਖ ਪ੍ਰੇਰਣਾ-ਸਰੋਤ ਕਿਹੜਾ ਸੀ?"),
      "ireland-dpsp": lp("भारतीय संविधान के राज्य के नीति-निदेशक तत्वों का प्रमुख प्रेरणा-स्रोत कौन-सा था?", "ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੇ ਰਾਜ ਦੇ ਨੀਤੀ-ਨਿਰਦੇਸ਼ਕ ਤੱਤਾਂ ਦਾ ਮੁੱਖ ਪ੍ਰੇਰਣਾ-ਸਰੋਤ ਕਿਹੜਾ ਸੀ?"),
      "goi1935-federal-admin": lp("भारतीय संविधान के संघीय और प्रशासनिक ढाँचे का प्रमुख प्रेरणा-स्रोत कौन-सा था?", "ਭਾਰਤੀ ਸੰਵਿਧਾਨ ਦੇ ਸੰਘੀ ਅਤੇ ਪ੍ਰਸ਼ਾਸਕੀ ਢਾਂਚੇ ਦਾ ਮੁੱਖ ਪ੍ਰੇਰਣਾ-ਸਰੋਤ ਕਿਹੜਾ ਸੀ?"),
    };
    return native(stems[row.id]!, locale);
  }
  if (ql === 14) {
    const row = POL_CP002_INFLUENCE_ROWS_V1.find((item) => item.feature === q.canonicalAnswer)!;
    const stems: Readonly<Record<string, Pair>> = {
      "uk-parliamentary": lp("निम्न में से कौन-सी संवैधानिक विशेषता ब्रिटिश संवैधानिक परंपरा से प्रेरित है?", "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਵਿਧਾਨਕ ਵਿਸ਼ੇਸ਼ਤਾ ਬਰਤਾਨਵੀ ਸੰਵਿਧਾਨਕ ਪਰੰਪਰਾ ਤੋਂ ਪ੍ਰੇਰਿਤ ਹੈ?"),
      "us-fundamental-rights": lp("निम्न में से कौन-सी संवैधानिक विशेषता संयुक्त राज्य अमेरिका के संविधान से प्रेरित है?", "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਵਿਧਾਨਕ ਵਿਸ਼ੇਸ਼ਤਾ ਸੰਯੁਕਤ ਰਾਜ ਅਮਰੀਕਾ ਦੇ ਸੰਵਿਧਾਨ ਤੋਂ ਪ੍ਰੇਰਿਤ ਹੈ?"),
      "ireland-dpsp": lp("निम्न में से कौन-सी संवैधानिक विशेषता आयरलैंड के संविधान से प्रेरित है?", "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਵਿਧਾਨਕ ਵਿਸ਼ੇਸ਼ਤਾ ਆਇਰਲੈਂਡ ਦੇ ਸੰਵਿਧਾਨ ਤੋਂ ਪ੍ਰੇਰਿਤ ਹੈ?"),
      "goi1935-federal-admin": lp("निम्न में से कौन-सी संवैधानिक विशेषता भारत शासन अधिनियम, 1935 से प्रेरित है?", "ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜੀ ਸੰਵਿਧਾਨਕ ਵਿਸ਼ੇਸ਼ਤਾ ਭਾਰਤ ਸਰਕਾਰ ਐਕਟ, 1935 ਤੋਂ ਪ੍ਰੇਰਿਤ ਹੈ?"),
    };
    return native(stems[row.id]!, locale);
  }
  if (ql === 15) return locale === "hi"
    ? "संविधान के अंगीकरण, हस्ताक्षर और लागू होने की तिथियों का सही मिलान कौन-सा है?"
    : "ਸੰਵਿਧਾਨ ਦੇ ਅੰਗੀਕਾਰ, ਦਸਤਖਤ ਅਤੇ ਲਾਗੂ ਹੋਣ ਦੀਆਂ ਤਾਰੀਖਾਂ ਦਾ ਸਹੀ ਮਿਲਾਨ ਕਿਹੜਾ ਹੈ?";
  if (ql === 16) return locale === "hi"
    ? "संविधान तैयार करने की प्रक्रिया का सही क्रम कौन-सा है?"
    : "ਸੰਵਿਧਾਨ ਤਿਆਰ ਕਰਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਦਾ ਸਹੀ ਕ੍ਰਮ ਕਿਹੜਾ ਹੈ?";
  throw new Error(`${q.questionId}: unsupported CP002 QL ${ql}`);
}

function cp2Explanation(q: (typeof CP002_EN)[number], locale: NativeLocale): string {
  const ql = Number(q.qlId.slice(-3));
  if ([1, 2, 9].includes(ql)) {
    const row = ql === 1
      ? POL_CP002_MILESTONES_V1.find((item) => item.displayDate === q.canonicalAnswer)!
      : ql === 2
        ? cp2MilestoneByEvent(q.canonicalAnswer)
        : POL_CP002_MILESTONES_V1.find((item) => q.canonicalAnswer.startsWith(`${item.event} — `))!;
    return cp2DatedSentence(row, locale);
  }
  if ([3, 4].includes(ql)) {
    const row = ql === 3 ? cp2RoleByPerson(q.canonicalAnswer) : POL_CP002_ROLE_ROWS_V1.find((item) => item.role === q.canonicalAnswer)!;
    return locale === "hi"
      ? `${native(CP2_ROLES[row.id]!.person, locale)} ${native(CP2_ROLES[row.id]!.role, locale)} थे। ${native(CP2_ROLES[row.id]!.detail, locale)}।`
      : `${native(CP2_ROLES[row.id]!.person, locale)} ${native(CP2_ROLES[row.id]!.role, locale)} ਸਨ। ${native(CP2_ROLES[row.id]!.detail, locale)}।`;
  }
  if ([5, 6].includes(ql)) {
    const committee = ql === 5
      ? POL_CP002_COMMITTEE_ROWS_V1.find((item) => item.chair === q.canonicalAnswer && q.stem.includes(item.committee))!
      : POL_CP002_COMMITTEE_ROWS_V1.find((item) => q.canonicalAnswer.startsWith(`${item.committee} — `))!;
    return locale === "hi"
      ? `${committeeLocal(committee.committee, locale)} की अध्यक्षता ${personLocal(committee.chair, locale)} ने की। यह समिति ${native(CP2_COMMITTEES[committee.id]!.fn, locale)} से जुड़ी थी।`
      : `${committeeLocal(committee.committee, locale)} ਦੀ ਅਧਿਆਕਸ਼ਤਾ ${personLocal(committee.chair, locale)} ਨੇ ਕੀਤੀ। ਇਹ ਕਮੇਟੀ ${native(CP2_COMMITTEES[committee.id]!.fn, locale)} ਨਾਲ ਜੁੜੀ ਸੀ।`;
  }
  if (ql === 7) {
    const row = POL_CP002_COMPOSITION_ROWS_V1.find((item) => item.value === q.canonicalAnswer)!;
    return `${native(CP2_COMPOSITION[row.id]!.explanation, locale)}।`;
  }
  if (ql === 8) return locale === "hi"
    ? "प्रांतीय प्रतिनिधियों का चुनाव मौजूदा प्रांतीय विधानसभाओं द्वारा एकल संक्रमणीय मत से आनुपातिक प्रतिनिधित्व की पद्धति से होना था।"
    : "ਸੂਬਾਈ ਪ੍ਰਤੀਨਿਧੀਆਂ ਦੀ ਚੋਣ ਮੌਜੂਦਾ ਸੂਬਾਈ ਵਿਧਾਨ ਸਭਾਵਾਂ ਵੱਲੋਂ ਇਕਲ ਤਬਦੀਲੀਯੋਗ ਮਤ ਨਾਲ ਅਨੁਪਾਤਕ ਪ੍ਰਤੀਨਿਧਿਤਾ ਦੀ ਵਿਧੀ ਰਾਹੀਂ ਹੋਣੀ ਸੀ।";
  if (ql === 10) {
    const rows = q.stem.split("\n").slice(1, 3).map((line) => {
      const text = line.replace(/^(?:I|II)\. /, "").replace(/\.$/, "");
      return POL_CP002_MILESTONES_V1.find((item) => text.startsWith(`${item.event} on `))!;
    });
    return locale === "hi"
      ? `सही तिथियाँ हैं: ${native(CP2_MILESTONES[rows[0]!.id]!.event, locale)} — ${dateLocal(rows[0]!.displayDate, locale)}; ${native(CP2_MILESTONES[rows[1]!.id]!.event, locale)} — ${dateLocal(rows[1]!.displayDate, locale)}।`
      : `ਸਹੀ ਤਾਰੀਖਾਂ ਹਨ: ${native(CP2_MILESTONES[rows[0]!.id]!.event, locale)} — ${dateLocal(rows[0]!.displayDate, locale)}; ${native(CP2_MILESTONES[rows[1]!.id]!.event, locale)} — ${dateLocal(rows[1]!.displayDate, locale)}।`;
  }
  if (ql === 11) return locale === "hi"
    ? "दो कथन सही हैं। व्यक्ति की वास्तविक भूमिका और समिति के वास्तविक अध्यक्ष से प्रत्येक कथन का मिलान करना चाहिए।"
    : "ਦੋ ਬਿਆਨ ਸਹੀ ਹਨ। ਹਰ ਬਿਆਨ ਨੂੰ ਵਿਅਕਤੀ ਦੀ ਅਸਲ ਭੂਮਿਕਾ ਅਤੇ ਕਮੇਟੀ ਦੇ ਅਸਲ ਅਧਿਆਕਸ਼ ਨਾਲ ਮਿਲਾ ਕੇ ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।";
  if (ql === 12) return locale === "hi" ? `सही कालानुक्रमिक क्रम है: ${cp2Option(q.canonicalAnswer, locale)}।` : `ਸਹੀ ਕਾਲਕ੍ਰਮ ਹੈ: ${cp2Option(q.canonicalAnswer, locale)}।`;
  if ([13, 14].includes(ql)) {
    const row = ql === 13
      ? POL_CP002_INFLUENCE_ROWS_V1.find((item) => item.source === q.canonicalAnswer)!
      : POL_CP002_INFLUENCE_ROWS_V1.find((item) => item.feature === q.canonicalAnswer)!;
    return `${native(CP2_INFLUENCE[row.id]!.explanation, locale)}।`;
  }
  if (ql === 15) return locale === "hi"
    ? "संविधान 26 नवंबर 1949 को अंगीकृत हुआ, सदस्यों ने 24 जनवरी 1950 को हस्ताक्षर किए और यह 26 जनवरी 1950 को पूर्ण रूप से लागू हुआ।"
    : "ਸੰਵਿਧਾਨ 26 ਨਵੰਬਰ 1949 ਨੂੰ ਅੰਗੀਕਾਰ ਹੋਇਆ, ਮੈਂਬਰਾਂ ਨੇ 24 ਜਨਵਰੀ 1950 ਨੂੰ ਦਸਤਖਤ ਕੀਤੇ ਅਤੇ ਇਹ 26 ਜਨਵਰੀ 1950 ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਲਾਗੂ ਹੋਇਆ।";
  if (ql === 16) return locale === "hi"
    ? "बी. एन. राव ने प्रारंभिक मसौदा तैयार किया; प्रारूप समिति ने उसकी जाँच और संशोधन किया; मसौदा फरवरी 1948 में प्रस्तुत हुआ और संविधान नवंबर 1949 में अंगीकृत हुआ।"
    : "ਬੀ. ਐਨ. ਰਾਓ ਨੇ ਸ਼ੁਰੂਆਤੀ ਮਸੌਦਾ ਤਿਆਰ ਕੀਤਾ; ਮਸੌਦਾ ਕਮੇਟੀ ਨੇ ਉਸਦੀ ਜਾਂਚ ਅਤੇ ਸੋਧ ਕੀਤੀ; ਮਸੌਦਾ ਫਰਵਰੀ 1948 ਵਿੱਚ ਪੇਸ਼ ਹੋਇਆ ਅਤੇ ਸੰਵਿਧਾਨ ਨਵੰਬਰ 1949 ਵਿੱਚ ਅੰਗੀਕਾਰ ਹੋਇਆ।";
  throw new Error(`${q.questionId}: unsupported CP002 explanation QL ${ql}`);
}

function localizedBase<T extends {
  questionId: string;
  chapterId: "POL-001";
  cpId: string;
  qlId: string;
  qlName: string;
  difficulty: PolLocalizedQuestionV1["difficulty"];
  correctIndex: number;
  sourceIds: string[];
  sourceFactIds: string[];
  reviewOnly: true;
  runtimeRegistered: false;
}>(
  q: T,
  locale: PolLocaleV1,
  stem: string,
  options: string[],
  explanation: string,
): PolLocalizedQuestionV1 {
  return {
    ...q,
    questionId: locale === "en" ? q.questionId : `${q.questionId}-${locale.toUpperCase()}`,
    stem,
    options,
    canonicalAnswer: options[q.correctIndex]!,
    explanation,
    locale,
    localizationV1: {
      version: POL_LOCALIZATION_V1,
      englishQuestionId: q.questionId,
      semanticInvariant: true,
      cpInvariant: true,
      qlInvariant: true,
      difficultyInvariant: true,
      sourceInvariant: true,
      optionOrderInvariant: true,
      correctIndexInvariant: true,
      reviewOnly: true,
    },
  };
}

function localizeCp001(q: (typeof CP001_EN)[number], locale: PolLocaleV1): PolLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(q, locale, q.stem, [...q.options], q.explanation);
  return localizedBase(
    q,
    locale,
    cp1Stem(q, locale),
    q.options.map((option) => cp1Option(option, locale)),
    cp1Explanation(q, locale),
  );
}

function localizeCp002(q: (typeof CP002_EN)[number], locale: PolLocaleV1): PolLocalizedQuestionV1 {
  if (locale === "en") return localizedBase(q, locale, q.stem, [...q.options], q.explanation);
  return localizedBase(
    q,
    locale,
    cp2Stem(q, locale),
    q.options.map((option) => cp2Option(option, locale)),
    cp2Explanation(q, locale),
  );
}

export const POL_CP001_CP002_LOCALIZATION_V1_SUPPORTED_CPS = ["POL-CP-001", "POL-CP-002"] as const;
export const POL_CP001_CP002_LOCALIZATION_V1_SUPPORTED_LOCALES = ["en", "hi", "pa"] as const;

export function generatePolCp001LocalizedReviewV1(locale: PolLocaleV1): PolLocalizedQuestionV1[] {
  return CP001_EN.map((q) => localizeCp001(q, locale));
}

export function generatePolCp002LocalizedReviewV1(locale: PolLocaleV1): PolLocalizedQuestionV1[] {
  return CP002_EN.map((q) => localizeCp002(q, locale));
}

export function generatePolCp001Cp002LocalizedReviewV1(locale: PolLocaleV1): PolLocalizedQuestionV1[] {
  return [...generatePolCp001LocalizedReviewV1(locale), ...generatePolCp002LocalizedReviewV1(locale)];
}

export const POL_MULTILINGUAL_CP001_CP002_V1 = Object.freeze({
  en: generatePolCp001Cp002LocalizedReviewV1("en"),
  hi: generatePolCp001Cp002LocalizedReviewV1("hi"),
  pa: generatePolCp001Cp002LocalizedReviewV1("pa"),
});
