import type { Mal001LocalizedLanguage } from "./chapter-multilingual-question-studio-v1";
import { applyMal001QuestionStudioLocalizationV5 } from "./chapter-multilingual-question-studio-v5";

export const MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6 = Object.freeze({
  localizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V6-RESIDUAL-NORMALIZATION",
  policy: "NATIVE_SURFACE_ZERO_UNINTENDED_LATIN",
  preservesMathematicalAuthority: true,
});

type Replacement = readonly [RegExp, string];

const PHRASES: Record<Mal001LocalizedLanguage, readonly Replacement[]> = {
  hi: [
    [/acid-to-water/giu, "अम्ल-से-पानी"],
    [/acid-water/giu, "अम्ल-पानी"],
    [/alcohol-to-water/giu, "अल्कोहल-से-पानी"],
    [/alcohol-water/giu, "अल्कोहल-पानी"],
    [/concentrate-water/giu, "कंसन्ट्रेट-पानी"],
    [/diesel-to-petrol/giu, "डीज़ल-से-पेट्रोल"],
    [/juice-to-water/giu, "रस-से-पानी"],
    [/juice-water/giu, "रस-पानी"],
    [/kerosene-to-petrol/giu, "मिट्टी के तेल-से-पेट्रोल"],
    [/milk-water/giu, "दूध-पानी"],
    [/petrol-to-diesel/giu, "पेट्रोल-से-डीज़ल"],
    [/petrol-to-kerosene/giu, "पेट्रोल-से-मिट्टी का तेल"],
    [/salt-water/giu, "नमक-पानी"],
    [/solution-concentration/giu, "घोल-सांद्रता"],
    [/spirit-water/giu, "स्पिरिट-पानी"],
    [/syrup-water/giu, "शरबत-पानी"],
    [/vinegar-to-water/giu, "सिरका-से-पानी"],
    [/water-to-acid/giu, "पानी-से-अम्ल"],
    [/water-to-spirit/giu, "पानी-से-स्पिरिट"],
    [/water-to-vinegar/giu, "पानी-से-सिरका"],
    [/water-to-wine/giu, "पानी-से-वाइन"],
    [/equal-replacement/giu, "समान-प्रतिस्थापन"],
    [/equal-volume/giu, "समान-आयतन"],
    [/first-stage/giu, "पहला-चरण"],
    [/second-stage/giu, "दूसरा-चरण"],
    [/one-stage/giu, "एक-चरण"],
    [/repeated-replacement/giu, "बार-बार प्रतिस्थापन"],
    [/remove-and-refill/giu, "निकालकर-पुनःभरना"],
    [/round-trip/giu, "आना-जाना"],
    [/stage-specific/giu, "चरण-विशिष्ट"],
    [/three-item/giu, "तीन-वस्तु"],
    [/competitive-exam/giu, "प्रतियोगी-परीक्षा"],
    [/higher-priced/giu, "अधिक-मूल्य वाला"],
    [/lower-grade/giu, "निम्न-ग्रेड"],
    [/x-litre/giu, "x-लीटर"],
    [/ratio-batch/giu, "अनुपात-बैच"],
  ],
  pa: [
    [/acid-to-water/giu, "ਤੇਜ਼ਾਬ-ਤੋਂ-ਪਾਣੀ"],
    [/acid-water/giu, "ਤੇਜ਼ਾਬ-ਪਾਣੀ"],
    [/alcohol-to-water/giu, "ਅਲਕੋਹਲ-ਤੋਂ-ਪਾਣੀ"],
    [/alcohol-water/giu, "ਅਲਕੋਹਲ-ਪਾਣੀ"],
    [/concentrate-water/giu, "ਕਨਸਨਟ੍ਰੇਟ-ਪਾਣੀ"],
    [/diesel-to-petrol/giu, "ਡੀਜ਼ਲ-ਤੋਂ-ਪੈਟਰੋਲ"],
    [/juice-to-water/giu, "ਰਸ-ਤੋਂ-ਪਾਣੀ"],
    [/juice-water/giu, "ਰਸ-ਪਾਣੀ"],
    [/kerosene-to-petrol/giu, "ਮਿੱਟੀ ਦਾ ਤੇਲ-ਤੋਂ-ਪੈਟਰੋਲ"],
    [/milk-water/giu, "ਦੁੱਧ-ਪਾਣੀ"],
    [/petrol-to-diesel/giu, "ਪੈਟਰੋਲ-ਤੋਂ-ਡੀਜ਼ਲ"],
    [/petrol-to-kerosene/giu, "ਪੈਟਰੋਲ-ਤੋਂ-ਮਿੱਟੀ ਦਾ ਤੇਲ"],
    [/salt-water/giu, "ਲੂਣ-ਪਾਣੀ"],
    [/solution-concentration/giu, "ਘੋਲ-ਸੰਘਣਾਪਣ"],
    [/spirit-water/giu, "ਸਪਿਰਿਟ-ਪਾਣੀ"],
    [/syrup-water/giu, "ਸ਼ਰਬਤ-ਪਾਣੀ"],
    [/vinegar-to-water/giu, "ਸਿਰਕਾ-ਤੋਂ-ਪਾਣੀ"],
    [/water-to-acid/giu, "ਪਾਣੀ-ਤੋਂ-ਤੇਜ਼ਾਬ"],
    [/water-to-spirit/giu, "ਪਾਣੀ-ਤੋਂ-ਸਪਿਰਿਟ"],
    [/water-to-vinegar/giu, "ਪਾਣੀ-ਤੋਂ-ਸਿਰਕਾ"],
    [/water-to-wine/giu, "ਪਾਣੀ-ਤੋਂ-ਵਾਈਨ"],
    [/equal-replacement/giu, "ਬਰਾਬਰ-ਬਦਲੀ"],
    [/equal-volume/giu, "ਬਰਾਬਰ-ਆਇਤਨ"],
    [/first-stage/giu, "ਪਹਿਲਾ-ਪੜਾਅ"],
    [/second-stage/giu, "ਦੂਜਾ-ਪੜਾਅ"],
    [/one-stage/giu, "ਇੱਕ-ਪੜਾਅ"],
    [/repeated-replacement/giu, "ਵਾਰ-ਵਾਰ ਬਦਲੀ"],
    [/remove-and-refill/giu, "ਕੱਢ ਕੇ-ਮੁੜ ਭਰਨਾ"],
    [/round-trip/giu, "ਆਉਣਾ-ਜਾਣਾ"],
    [/stage-specific/giu, "ਪੜਾਅ-ਵਿਸ਼ੇਸ਼"],
    [/three-item/giu, "ਤਿੰਨ-ਵਸਤੂ"],
    [/competitive-exam/giu, "ਮੁਕਾਬਲੇ-ਦੀ-ਪਰੀਖਿਆ"],
    [/higher-priced/giu, "ਵੱਧ-ਕੀਮਤ ਵਾਲਾ"],
    [/lower-grade/giu, "ਹੇਠਲਾ-ਗ੍ਰੇਡ"],
    [/x-litre/giu, "x-ਲੀਟਰ"],
    [/ratio-batch/giu, "ਅਨੁਪਾਤ-ਬੈਚ"],
  ],
};

const WORDS: Record<Mal001LocalizedLanguage, Readonly<Record<string, string>>> = {
  hi: {
    Because:"क्योंकि", Consider:"मान लें", Convert:"बदलें", During:"के दौरान", Exact:"सटीक", First:"पहले", He:"वह", Honey:"शहद", Knowing:"यह जानते हुए", Multiplying:"गुणा करने पर", Mustard:"सरसों", No:"नहीं", Rearrange:"पुनर्व्यवस्थित करें", Reverse:"उलटा", Second:"दूसरा", Step:"चरण", Substitute:"मान रखकर", There:"वहाँ", Update:"अद्यतन करें", Vinegar:"सिरका", Weighted:"भारित", When:"जब", Wine:"वाइन",
    about:"लगभग", addition:"जोड़", adjusted:"समायोजित", along:"साथ", altogether:"कुल मिलाकर", asks:"पूछता है", basmati:"बासमती", because:"क्योंकि", been:"रहा", between:"के बीच", bought:"खरीदा", but:"लेकिन", calculated:"गणना किया", cancels:"कट जाता है", carries:"ले जाता है", carry:"ले जाएँ", cask:"पीपा", changed:"बदला", changes:"बदलता है", changing:"बदलते हुए", chemical:"रसायन", collecting:"एकत्र करने पर", comes:"आता है", common:"सामान्य", composition:"संरचना", concentrated:"सांद्र", concentrations:"सांद्रताएँ", consists:"से बना है", contained:"निहित", containers:"पात्र", containing:"जिसमें", content:"मात्रा", corresponds:"के अनुरूप", cream:"क्रीम", directed:"निर्देश दिया", does:"करता है", drum:"ड्रम", dust:"धूल", ends:"समाप्त होता है", equals:"बराबर है", evaporated:"वाष्पित", exact:"सटीक", exchanged:"अदला-बदली की", exponent:"घात", finishes:"समाप्त होता है", followed:"के बाद", following:"निम्न", formed:"बना", forms:"बनाता है", gain:"लाभ", get:"प्राप्त करें", giving:"जिससे", glucose:"ग्लूकोज़", grape:"अंगूर", grapes:"अंगूर", greater:"अधिक", groundnut:"मूंगफली", had:"था", half:"आधा", have:"है", he:"वह", herbal:"हर्बल", his:"उसका", hold:"रखें", honey:"शहद", including:"सहित", increases:"बढ़ता है", increasing:"बढ़ाते हुए", instance:"उदाहरण", integer:"पूर्णांक", involved:"शामिल", laboratory:"प्रयोगशाला", later:"बाद में", least:"कम-से-कम", lemon:"नींबू", lighter:"हल्का", losing:"खोते हुए", lost:"खोया", made:"बनाया", make:"बनाएँ", mango:"आम", measures:"मापता है", milkman:"दूधवाला", minimum:"न्यूनतम", multiplied:"गुणा किया", no:"नहीं", not:"नहीं", nothing:"कुछ नहीं", occasion:"स्थिति", occupy:"स्थान घेरें", occurs:"होता है", ordered:"क्रमबद्ध", ordinary:"सामान्य", other:"दूसरा", paid:"भुगतान किया", pays:"भुगतान करता है", percentages:"प्रतिशत", performs:"करता है", portion:"भाग", poured:"डाला", preparation:"तैयारी", problem:"प्रश्न", processing:"प्रसंस्करण", producing:"बनाते हुए", pulp:"गूदा", pulse:"दाल", pulses:"दालें", purchase:"खरीद", purchases:"खरीदता है", question:"प्रश्न", raisins:"किशमिश", received:"प्राप्त किया", receives:"प्राप्त करता है", record:"लिखें", refilled:"फिर भरा", refined:"परिष्कृत", relation:"संबंध", remain:"बचा रहे", remove:"निकालें", repeatedly:"बार-बार", replace:"बदलें", requested:"माँगा गया", rest:"शेष", retains:"बचाए रखता है", returned:"लौटाया", roasted:"भुना", routine:"प्रक्रिया", scale:"पैमाना", seasoned:"मसालेदार", second:"दूसरा", send:"भेजें", sends:"भेजता है", shortcut:"शॉर्टकट", simplify:"सरल करें", smaller:"छोटा", soyabean:"सोयाबीन", started:"शुरू हुआ", states:"बताता है", stays:"रहता है", step:"चरण", steps:"चरण", stone:"पत्थर", stored:"संग्रहित", strengths:"सांद्रताएँ", successively:"क्रमशः", sugar:"चीनी", sunflower:"सूरजमुखी", supplies:"आपूर्ति करता है", technician:"तकनीशियन", test:"जाँच", than:"से", there:"वहाँ", therefore:"इसलिए", they:"वे", thorough:"पूरी", thoroughly:"अच्छी तरह", timber:"लकड़ी", tin:"टिन", topped:"ऊपर तक भरा", unchanged:"अपरिवर्तित", unique:"अद्वितीय", until:"जब तक", used:"प्रयुक्त", vinegar:"सिरका", well:"अच्छी तरह", while:"जबकि", whose:"जिसका", wine:"वाइन"
  },
  pa: {
    Because:"ਕਿਉਂਕਿ", Consider:"ਮੰਨੋ", Convert:"ਬਦਲੋ", During:"ਦੌਰਾਨ", Exact:"ਸਹੀ", First:"ਪਹਿਲਾਂ", He:"ਉਹ", Honey:"ਸ਼ਹਿਦ", Knowing:"ਇਹ ਜਾਣਦੇ ਹੋਏ", Multiplying:"ਗੁਣਾ ਕਰਨ 'ਤੇ", Mustard:"ਸਰੋਂ", No:"ਨਹੀਂ", Rearrange:"ਮੁੜ ਵਿਵਸਥਿਤ ਕਰੋ", Reverse:"ਉਲਟ", Second:"ਦੂਜਾ", Step:"ਪੜਾਅ", Substitute:"ਮੁੱਲ ਰੱਖ ਕੇ", There:"ਉੱਥੇ", Update:"ਅਪਡੇਟ ਕਰੋ", Vinegar:"ਸਿਰਕਾ", Weighted:"ਭਾਰਿਤ", When:"ਜਦੋਂ", Wine:"ਵਾਈਨ",
    about:"ਲਗਭਗ", addition:"ਜੋੜ", adjusted:"ਸਮਾਇਤ", along:"ਨਾਲ", altogether:"ਕੁੱਲ ਮਿਲਾ ਕੇ", asks:"ਪੁੱਛਦਾ ਹੈ", basmati:"ਬਾਸਮਤੀ", because:"ਕਿਉਂਕਿ", been:"ਰਿਹਾ", between:"ਦੇ ਵਿਚਕਾਰ", bought:"ਖਰੀਦਿਆ", but:"ਪਰ", calculated:"ਗਿਣਿਆ", cancels:"ਕੱਟ ਜਾਂਦਾ ਹੈ", carries:"ਲੈ ਜਾਂਦਾ ਹੈ", carry:"ਲੈ ਜਾਓ", cask:"ਪੀਪਾ", changed:"ਬਦਲਿਆ", changes:"ਬਦਲਦਾ ਹੈ", changing:"ਬਦਲਦੇ ਹੋਏ", chemical:"ਰਸਾਇਣ", collecting:"ਇਕੱਠਾ ਕਰਨ 'ਤੇ", comes:"ਆਉਂਦਾ ਹੈ", common:"ਸਾਂਝਾ", composition:"ਬਣਤਰ", concentrated:"ਸੰਘਣਾ", concentrations:"ਸੰਘਣਾਪਣ", consists:"ਤੋਂ ਬਣਿਆ ਹੈ", contained:"ਮੌਜੂਦ", containers:"ਭਾਂਡੇ", containing:"ਜਿਸ ਵਿੱਚ", content:"ਮਾਤਰਾ", corresponds:"ਦੇ ਅਨੁਸਾਰ", cream:"ਕ੍ਰੀਮ", directed:"ਹਦਾਇਤ ਦਿੱਤੀ", does:"ਕਰਦਾ ਹੈ", drum:"ਡਰੱਮ", dust:"ਧੂੜ", ends:"ਖਤਮ ਹੁੰਦਾ ਹੈ", equals:"ਬਰਾਬਰ ਹੈ", evaporated:"ਬਾਫ਼ ਬਣਿਆ", exact:"ਸਹੀ", exchanged:"ਅਦਲਾ-ਬਦਲੀ ਕੀਤੀ", exponent:"ਘਾਤ", finishes:"ਖਤਮ ਹੁੰਦਾ ਹੈ", followed:"ਤੋਂ ਬਾਅਦ", following:"ਹੇਠਾਂ ਦਿੱਤਾ", formed:"ਬਣਿਆ", forms:"ਬਣਾਉਂਦਾ ਹੈ", gain:"ਲਾਭ", get:"ਪ੍ਰਾਪਤ ਕਰੋ", giving:"ਜਿਸ ਨਾਲ", glucose:"ਗਲੂਕੋਜ਼", grape:"ਅੰਗੂਰ", grapes:"ਅੰਗੂਰ", greater:"ਵੱਧ", groundnut:"ਮੂੰਗਫਲੀ", had:"ਸੀ", half:"ਅੱਧਾ", have:"ਹੈ", he:"ਉਹ", herbal:"ਹਰਬਲ", his:"ਉਸਦਾ", hold:"ਰੱਖੋ", honey:"ਸ਼ਹਿਦ", including:"ਸਮੇਤ", increases:"ਵੱਧਦਾ ਹੈ", increasing:"ਵਧਾਉਂਦੇ ਹੋਏ", instance:"ਉਦਾਹਰਨ", integer:"ਪੂਰਨ ਅੰਕ", involved:"ਸ਼ਾਮਲ", laboratory:"ਪ੍ਰਯੋਗਸ਼ਾਲਾ", later:"ਬਾਅਦ ਵਿੱਚ", least:"ਘੱਟੋ-ਘੱਟ", lemon:"ਨਿੰਬੂ", lighter:"ਹਲਕਾ", losing:"ਗੁਆਉਂਦੇ ਹੋਏ", lost:"ਗੁਆਇਆ", made:"ਬਣਾਇਆ", make:"ਬਣਾਓ", mango:"ਅੰਬ", measures:"ਮਾਪਦਾ ਹੈ", milkman:"ਦੁੱਧ ਵਾਲਾ", minimum:"ਘੱਟੋ-ਘੱਟ", multiplied:"ਗੁਣਾ ਕੀਤਾ", no:"ਨਹੀਂ", not:"ਨਹੀਂ", nothing:"ਕੁਝ ਨਹੀਂ", occasion:"ਸਥਿਤੀ", occupy:"ਥਾਂ ਘੇਰਨ", occurs:"ਹੁੰਦਾ ਹੈ", ordered:"ਕ੍ਰਮਬੱਧ", ordinary:"ਸਧਾਰਣ", other:"ਦੂਜਾ", paid:"ਭੁਗਤਾਨ ਕੀਤਾ", pays:"ਭੁਗਤਾਨ ਕਰਦਾ ਹੈ", percentages:"ਪ੍ਰਤੀਸ਼ਤ", performs:"ਕਰਦਾ ਹੈ", portion:"ਹਿੱਸਾ", poured:"ਪਾਇਆ", preparation:"ਤਿਆਰੀ", problem:"ਪ੍ਰਸ਼ਨ", processing:"ਪ੍ਰਕਿਰਿਆ", producing:"ਬਣਾਉਂਦੇ ਹੋਏ", pulp:"ਗੂਦਾ", pulse:"ਦਾਲ", pulses:"ਦਾਲਾਂ", purchase:"ਖਰੀਦ", purchases:"ਖਰੀਦਦਾ ਹੈ", question:"ਪ੍ਰਸ਼ਨ", raisins:"ਕਿਸ਼ਮਿਸ਼", received:"ਪ੍ਰਾਪਤ ਕੀਤਾ", receives:"ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ", record:"ਲਿਖੋ", refilled:"ਮੁੜ ਭਰਿਆ", refined:"ਸੁਧਾਰਿਆ", relation:"ਸਬੰਧ", remain:"ਬਚਿਆ ਰਹੇ", remove:"ਕੱਢੋ", repeatedly:"ਵਾਰ-ਵਾਰ", replace:"ਬਦਲੋ", requested:"ਮੰਗਿਆ ਗਿਆ", rest:"ਬਾਕੀ", retains:"ਬਚਾ ਰੱਖਦਾ ਹੈ", returned:"ਵਾਪਸ ਕੀਤਾ", roasted:"ਭੁੰਨਿਆ", routine:"ਪ੍ਰਕਿਰਿਆ", scale:"ਪੈਮਾਨਾ", seasoned:"ਮਸਾਲੇਦਾਰ", second:"ਦੂਜਾ", send:"ਭੇਜੋ", sends:"ਭੇਜਦਾ ਹੈ", shortcut:"ਛੋਟਾ ਤਰੀਕਾ", simplify:"ਸਰਲ ਕਰੋ", smaller:"ਛੋਟਾ", soyabean:"ਸੋਇਆਬੀਨ", started:"ਸ਼ੁਰੂ ਹੋਇਆ", states:"ਦੱਸਦਾ ਹੈ", stays:"ਰਹਿੰਦਾ ਹੈ", step:"ਪੜਾਅ", steps:"ਪੜਾਅ", stone:"ਪੱਥਰ", stored:"ਸੰਭਾਲਿਆ", strengths:"ਸੰਘਣਾਪਣ", successively:"ਲਗਾਤਾਰ", sugar:"ਚੀਨੀ", sunflower:"ਸੂਰਜਮੁਖੀ", supplies:"ਸਪਲਾਈ ਕਰਦਾ ਹੈ", technician:"ਤਕਨੀਸ਼ੀਅਨ", test:"ਜਾਂਚ", than:"ਨਾਲੋਂ", there:"ਉੱਥੇ", therefore:"ਇਸ ਲਈ", they:"ਉਹ", thorough:"ਪੂਰੀ", thoroughly:"ਚੰਗੀ ਤਰ੍ਹਾਂ", timber:"ਲੱਕੜ", tin:"ਟਿਨ", topped:"ਉੱਪਰ ਤੱਕ ਭਰਿਆ", unchanged:"ਅਣਬਦਲਿਆ", unique:"ਵੱਖਰਾ", until:"ਜਦ ਤੱਕ", used:"ਵਰਤਿਆ", vinegar:"ਸਿਰਕਾ", well:"ਚੰਗੀ ਤਰ੍ਹਾਂ", while:"ਜਦਕਿ", whose:"ਜਿਸਦਾ", wine:"ਵਾਈਨ"
  }
};

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceString(value: string, language: Mal001LocalizedLanguage): string {
  let text = PHRASES[language].reduce((out, [pattern, replacement]) => out.replace(pattern, replacement), value);
  const entries = Object.entries(WORDS[language]).sort((a, b) => b[0].length - a[0].length);
  for (const [word, replacement] of entries) {
    text = text.replace(new RegExp(`\\b${escapeRegExp(word)}\\b`, "gu"), replacement);
  }
  return text;
}

function normalizeValue(value: unknown, language: Mal001LocalizedLanguage): unknown {
  if (typeof value === "string") return replaceString(value, language);
  if (Array.isArray(value)) return value.map((item) => normalizeValue(item, language));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, entry]) => [key, normalizeValue(entry, language)]));
  }
  return value;
}

function normalizeLearnerFields<T extends Record<string, any>>(question: T, language: Mal001LocalizedLanguage): T {
  return {
    ...question,
    stem: normalizeValue(question.stem, language),
    options: normalizeValue(question.options, language),
    answer: normalizeValue(question.answer, language),
    explanation: normalizeValue(question.explanation, language),
    reasoningGraph: question.reasoningGraph ? {
      ...question.reasoningGraph,
      nodes: Array.isArray(question.reasoningGraph.nodes)
        ? question.reasoningGraph.nodes.map((node: Record<string, any>) => ({ ...node, text: normalizeValue(node.text, language) }))
        : question.reasoningGraph.nodes,
    } : question.reasoningGraph,
  } as T;
}

export function applyMal001QuestionStudioLocalizationV6<T extends Record<string, any>>(
  question: T,
  language: Mal001LocalizedLanguage,
): T {
  const localized = normalizeLearnerFields(applyMal001QuestionStudioLocalizationV5(question, language) as T, language);
  return {
    ...localized,
    traceability: {
      ...(localized.traceability ?? {}),
      residualNormalizationId: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6.localizationId,
      learnerSurfacePolicy: MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6.policy,
    },
  } as T;
}
