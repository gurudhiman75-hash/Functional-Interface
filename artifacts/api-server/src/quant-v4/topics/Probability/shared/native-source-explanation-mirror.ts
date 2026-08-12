import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import { assertProbabilityNativeTextValid } from "../native-language-primitives";
import type { ProbabilityQuestion } from "./types";
import { naturalizeProbabilityExplanationBody } from "./native-source-explanation-naturalizer";
import {
  canonicalizeProbabilityExplanationMathSegment,
  localizeProbabilityExplanationMathSegment,
} from "./native-math-event-labels";

type Rule = readonly [source: string, hi: string, pa: string];

const RULES: readonly Rule[] = [
  ["favourable cases", "अनुकूल स्थितियाँ", "ਅਨੁਕੂਲ ਮਾਮਲੇ"],
  ["total equally likely cases", "कुल समान-संभावित स्थितियाँ", "ਕੁੱਲ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਮਾਮਲੇ"],
  ["total cases", "कुल स्थितियाँ", "ਕੁੱਲ ਮਾਮਲੇ"],
  ["favourable selections", "अनुकूल चयन", "ਅਨੁਕੂਲ ਚੋਣਾਂ"],
  ["total selections", "कुल चयन", "ਕੁੱਲ ਚੋਣਾਂ"],
  ["required probability", "आवश्यक प्रायिकता", "ਲੋੜੀਂਦੀ ਸੰਭਾਵਨਾ"],
  ["required number of committees", "आवश्यक समितियों की संख्या", "ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ"],
  ["required number", "आवश्यक संख्या", "ਲੋੜੀਂਦੀ ਗਿਣਤੀ"],
  ["required committees", "आवश्यक समितियाँ", "ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ"],
  ["total committees", "कुल समितियाँ", "ਕੁੱਲ ਕਮੇਟੀਆਂ"],
  ["possible committees", "संभावित समितियाँ", "ਸੰਭਵ ਕਮੇਟੀਆਂ"],
  ["sample space", "कुल संभावित परिणामों का समूह", "ਕੁੱਲ ਸੰਭਵ ਨਤੀਜਿਆਂ ਦਾ ਸਮੂਹ"],
  ["restricted total", "सीमित कुल संख्या", "ਸੀਮਿਤ ਕੁੱਲ ਗਿਣਤੀ"],
  ["restricted group", "सीमित समूह", "ਸੀਮਿਤ ਸਮੂਹ"],
  ["first condition", "पहली शर्त", "ਪਹਿਲੀ ਸ਼ਰਤ"],
  ["second condition", "दूसरी शर्त", "ਦੂਜੀ ਸ਼ਰਤ"],
  ["given condition", "दी गई शर्त", "ਦਿੱਤੀ ਸ਼ਰਤ"],
  ["face cards", "फेस कार्ड", "ਫੇਸ ਕਾਰਡ"],
  ["face card", "फेस कार्ड", "ਫੇਸ ਕਾਰਡ"],
  ["standard deck", "मानक ताश की गड्डी", "ਮਿਆਰੀ ਤਾਸ਼ ਦੀ ਗੱਡੀ"],
  ["card deck", "ताश की गड्डी", "ਤਾਸ਼ ਦੀ ਗੱਡੀ"],
  ["fair tosses", "निष्पक्ष उछाल", "ਨਿਰਪੱਖ ਉਛਾਲ"],
  ["fair dice", "निष्पक्ष पासे", "ਨਿਰਪੱਖ ਪਾਸੇ"],
  ["fair die", "निष्पक्ष पासा", "ਨਿਰਪੱਖ ਪਾਸਾ"],
  ["ordered pairs", "क्रमित युग्म", "ਕ੍ਰਮਿਤ ਜੋੜੇ"],
  ["ordered outcomes", "क्रमित परिणाम", "ਕ੍ਰਮਿਤ ਨਤੀਜੇ"],
  ["equally likely", "समान रूप से संभावित", "ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ"],
  ["mutually exclusive", "परस्पर अपवर्ती", "ਪਰਸਪਰ ਅਲੱਗ"],
  ["independent choices", "स्वतंत्र चयन", "ਸੁਤੰਤਰ ਚੋਣਾਂ"],
  ["independent", "स्वतंत्र", "ਸੁਤੰਤਰ"],
  ["without replacement", "बिना वापस रखे", "ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ"],
  ["with replacement", "वापस रखकर", "ਵਾਪਸ ਰੱਖ ਕੇ"],
  ["not replaced", "वापस नहीं रखा गया", "ਵਾਪਸ ਨਹੀਂ ਰੱਖਿਆ ਗਿਆ"],
  ["not returned", "वापस नहीं रखी जाती", "ਵਾਪਸ ਨਹੀਂ ਰੱਖੀ ਜਾਂਦੀ"],
  ["remaining favourable count", "बची हुई अनुकूल संख्या", "ਬਚੀ ਅਨੁਕੂਲ ਗਿਣਤੀ"],
  ["remaining objects", "बची हुई वस्तुएँ", "ਬਚੀਆਂ ਵਸਤੂਆਂ"],
  ["remaining counts", "बची हुई संख्याएँ", "ਬਚੀਆਂ ਗਿਣਤੀਆਂ"],
  ["remaining posts", "बाकी पद", "ਬਾਕੀ ਅਹੁਦੇ"],
  ["remaining positions", "बाकी स्थान", "ਬਾਕੀ ਸਥਾਨ"],
  ["remaining places", "बाकी स्थान", "ਬਾਕੀ ਸਥਾਨ"],
  ["first position", "पहला स्थान", "ਪਹਿਲਾ ਸਥਾਨ"],
  ["first post", "पहला पद", "ਪਹਿਲਾ ਅਹੁਦਾ"],
  ["specified candidate", "निर्दिष्ट अभ्यर्थी", "ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ"],
  ["specified person", "निर्दिष्ट व्यक्ति", "ਨਿਰਧਾਰਤ ਵਿਅਕਤੀ"],
  ["two specified candidates", "दो निर्दिष्ट अभ्यर्थी", "ਦੋ ਨਿਰਧਾਰਤ ਉਮੀਦਵਾਰ"],
  ["two specified people", "दो निर्दिष्ट व्यक्ति", "ਦੋ ਨਿਰਧਾਰਤ ਵਿਅਕਤੀ"],
  ["unit digit", "इकाई अंक", "ਇਕਾਈ ਅੰਕ"],
  ["even choices", "सम अंक के विकल्प", "ਜੋੜੇ ਅੰਕਾਂ ਦੀਆਂ ਚੋਣਾਂ"],
  ["even digits", "सम अंक", "ਜੋੜੇ ਅੰਕ"],
  ["even number", "सम संख्या", "ਜੋੜੀ ਸੰਖਿਆ"],
  ["same colour", "एक ही रंग", "ਇੱਕੋ ਰੰਗ"],
  ["different colours", "अलग-अलग रंग", "ਵੱਖ-ਵੱਖ ਰੰਗ"],
  ["same face", "एक ही पक्ष", "ਇੱਕੋ ਪਾਸਾ"],
  ["same number of heads", "चित की समान संख्या", "ਚਿੱਤਾਂ ਦੀ ਇੱਕੋ ਗਿਣਤੀ"],
  ["different positions", "अलग स्थानों", "ਵੱਖ ਸਥਾਨਾਂ"],
  ["favourable sequences", "अनुकूल क्रम", "ਅਨੁਕੂਲ ਕ੍ਰਮ"],
  ["possible sequences", "संभावित क्रम", "ਸੰਭਵ ਕ੍ਰਮ"],
  ["H/T sequences", "चित/पट क्रम", "ਚਿੱਤ/ਪੱਟ ਕ੍ਰਮ"],
  ["no heads", "कोई चित नहीं", "ਕੋਈ ਚਿੱਤ ਨਹੀਂ"],
  ["no head", "कोई चित नहीं", "ਕੋਈ ਚਿੱਤ ਨਹੀਂ"],
  ["one head", "एक चित", "ਇੱਕ ਚਿੱਤ"],
  ["heads", "चित", "ਚਿੱਤ"],
  ["head", "चित", "ਚਿੱਤ"],
  ["tails", "पट", "ਪੱਟ"],
  ["tail", "पट", "ਪੱਟ"],
  ["red-red", "लाल-लाल", "ਲਾਲ-ਲਾਲ"],
  ["blue-blue", "नीला-नीला", "ਨੀਲਾ-ਨੀਲਾ"],
  ["red-blue", "लाल-नीला", "ਲਾਲ-ਨੀਲਾ"],
  ["blue-red", "नीला-लाल", "ਨੀਲਾ-ਲਾਲ"],
  ["red coloured stones", "लाल रंगीन पत्थर", "ਲਾਲ ਰੰਗੀਨ ਪੱਥਰ"],
  ["blue coloured stones", "नीले रंगीन पत्थर", "ਨੀਲੇ ਰੰਗੀਨ ਪੱਥਰ"],
  ["coloured stones", "रंगीन पत्थर", "ਰੰਗੀਨ ਪੱਥਰ"],
  ["red marbles", "लाल कंचे", "ਲਾਲ ਕੰਚੇ"],
  ["blue marbles", "नीले कंचे", "ਨੀਲੇ ਕੰਚੇ"],
  ["marbles", "कंचे", "ਕੰਚੇ"],
  ["marble", "कंचा", "ਕੰਚਾ"],
  ["red balls", "लाल गेंदें", "ਲਾਲ ਗੇਂਦਾਂ"],
  ["blue balls", "नीली गेंदें", "ਨੀਲੀਆਂ ਗੇਂਦਾਂ"],
  ["balls", "गेंदें", "ਗੇਂਦਾਂ"],
  ["ball", "गेंद", "ਗੇਂਦ"],
  ["red pens", "लाल पेन", "ਲਾਲ ਪੈਨ"],
  ["blue pens", "नीले पेन", "ਨੀਲੇ ਪੈਨ"],
  ["pens", "पेन", "ਪੈਨ"],
  ["pen", "पेन", "ਪੈਨ"],
  ["defective bulbs", "खराब बल्ब", "ਖਰਾਬ ਬਲਬ"],
  ["bulbs", "बल्ब", "ਬਲਬ"],
  ["bulb", "बल्ब", "ਬਲਬ"],
  ["successful candidates", "सफल अभ्यर्थी", "ਸਫਲ ਉਮੀਦਵਾਰ"],
  ["qualified candidates", "योग्य अभ्यर्थी", "ਯੋਗ ਉਮੀਦਵਾਰ"],
  ["candidates", "अभ्यर्थी", "ਉਮੀਦਵਾਰ"],
  ["candidate", "अभ्यर्थी", "ਉਮੀਦਵਾਰ"],
  ["students", "विद्यार्थी", "ਵਿਦਿਆਰਥੀ"],
  ["student", "विद्यार्थी", "ਵਿਦਿਆਰਥੀ"],
  ["committee members", "समिति सदस्य", "ਕਮੇਟੀ ਮੈਂਬਰ"],
  ["committees", "समितियाँ", "ਕਮੇਟੀਆਂ"],
  ["committee", "समिति", "ਕਮੇਟੀ"],
  ["women", "महिलाएँ", "ਔਰਤਾਂ"],
  ["woman", "महिला", "ਔਰਤ"],
  ["men", "पुरुष", "ਮਰਦ"],
  ["man", "पुरुष", "ਮਰਦ"],
  ["people", "लोग", "ਲੋਕ"],
  ["person", "व्यक्ति", "ਵਿਅਕਤੀ"],
  ["linear arrangements", "रैखिक व्यवस्थाएँ", "ਰੇਖੀ ਵਿਉਂਤਾਂ"],
  ["unrestricted arrangements", "कुल व्यवस्थाएँ", "ਕੁੱਲ ਵਿਉਂਤਾਂ"],
  ["adjacent arrangements", "सन्निकट व्यवस्थाएँ", "ਨਾਲ-ਨਾਲ ਵਿਉਂਤਾਂ"],
  ["non-adjacent arrangements", "असन्निकट व्यवस्थाएँ", "ਵੱਖ-ਵੱਖ ਵਿਉਂਤਾਂ"],
  ["arrangements", "व्यवस्थाएँ", "ਵਿਉਂਤਾਂ"],
  ["arrangement", "व्यवस्था", "ਵਿਉਂਤ"],
  ["allowed positions", "अनुमत स्थानों", "ਮਨਜ਼ੂਰ ਸਥਾਨਾਂ"],
  ["internal order", "आंतरिक क्रम", "ਅੰਦਰੂਨੀ ਕ੍ਰਮ"],
  ["shortlisted group", "शॉर्टलिस्ट समूह", "ਸ਼ਾਰਟਲਿਸਟ ਸਮੂਹ"],
  ["complete group", "पूरा समूह", "ਪੂਰਾ ਸਮੂਹ"],
  ["full group", "पूरा समूह", "ਪੂਰਾ ਸਮੂਹ"],
  ["both groups", "दोनों समूह", "ਦੋਵੇਂ ਸਮੂਹ"],
  ["two groups", "दो समूह", "ਦੋ ਸਮੂਹ"],
  ["group counts", "समूह की संख्याएँ", "ਸਮੂਹ ਦੀਆਂ ਗਿਣਤੀਆਂ"],
  ["overlap", "साझा भाग", "ਸਾਂਝਾ ਹਿੱਸਾ"],
  ["intersection", "प्रतिच्छेद", "ਸਾਂਝਾ ਹਿੱਸਾ"],
  ["union", "संघ", "ਜੋੜ"],
  ["both conditions", "दोनों शर्तें", "ਦੋਵੇਂ ਸ਼ਰਤਾਂ"],
  ["exactly one condition", "ठीक एक शर्त", "ਠੀਕ ਇੱਕ ਸ਼ਰਤ"],
  ["at least one condition", "कम-से-कम एक शर्त", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸ਼ਰਤ"],
  ["neither condition", "कोई भी शर्त नहीं", "ਕੋਈ ਵੀ ਸ਼ਰਤ ਨਹੀਂ"],
  ["required condition", "आवश्यक शर्त", "ਲੋੜੀਂਦੀ ਸ਼ਰਤ"],
  ["number property", "संख्या की शर्त", "ਸੰਖਿਆ ਦੀ ਸ਼ਰਤ"],
  ["stated range", "दी गई सीमा", "ਦਿੱਤੀ ਸੀਮਾ"],
  ["restricted numbers", "सीमित संख्याएँ", "ਸੀਮਿਤ ਸੰਖਿਆਵਾਂ"],
  ["required integers", "आवश्यक पूर्णांक", "ਲੋੜੀਂਦੇ ਪੂਰਨ ਅੰਕ"],
  ["even numbers", "सम संख्याएँ", "ਜੋੜੀਆਂ ਸੰਖਿਆਵਾਂ"],
  ["integers", "पूर्णांक", "ਪੂਰਨ ਅੰਕ"],
  ["integer", "पूर्णांक", "ਪੂਰਨ ਅੰਕ"],
  ["prize-winning tickets", "इनाम वाले टिकट", "ਇਨਾਮ ਵਾਲੀਆਂ ਟਿਕਟਾਂ"],
  ["lottery tickets", "लॉटरी टिकट", "ਲਾਟਰੀ ਟਿਕਟਾਂ"],
  ["tickets", "टिकट", "ਟਿਕਟਾਂ"],
  ["ticket", "टिकट", "ਟਿਕਟ"],
  ["sectors", "खंड", "ਖੰਡ"],
  ["sector", "खंड", "ਖੰਡ"],
  ["spinner", "स्पिनर", "ਸਪਿਨਰ"],
  ["black cards", "काले पत्ते", "ਕਾਲੇ ਪੱਤੇ"],
  ["red cards", "लाल पत्ते", "ਲਾਲ ਪੱਤੇ"],
  ["cards", "पत्ते", "ਪੱਤੇ"],
  ["card", "पत्ता", "ਪੱਤਾ"],
  ["diamonds", "डायमंड", "ਡਾਇਮੰਡ"],
  ["diamond", "डायमंड", "ਡਾਇਮੰਡ"],
  ["hearts", "हार्ट", "ਹਾਰਟ"],
  ["heart", "हार्ट", "ਹਾਰਟ"],
  ["spades", "स्पेड", "ਸਪੇਡ"],
  ["spade", "स्पेड", "ਸਪੇਡ"],
  ["clubs", "क्लब", "ਕਲੱਬ"],
  ["club", "क्लब", "ਕਲੱਬ"],
  ["kings", "बादशाह", "ਬਾਦਸ਼ਾਹ"],
  ["king", "बादशाह", "ਬਾਦਸ਼ਾਹ"],
  ["queens", "बेगम", "ਬੇਗਮ"],
  ["queen", "बेगम", "ਬੇਗਮ"],
  ["jacks", "गुलाम", "ਗੁਲਾਮ"],
  ["jack", "गुलाम", "ਗੁਲਾਮ"],
  ["aces", "इक्के", "ਇੱਕੇ"],
  ["ace", "इक्का", "ਇੱਕਾ"],
  ["first die", "पहला पासा", "ਪਹਿਲਾ ਪਾਸਾ"],
  ["second die", "दूसरा पासा", "ਦੂਜਾ ਪਾਸਾ"],
  ["dice", "पासे", "ਪਾਸੇ"],
  ["die", "पासा", "ਪਾਸਾ"],
  ["faces", "फलक", "ਪਾਸੇ"],
  ["face", "फलक", "ਪਾਸਾ"],
  ["different parity", "अलग सम-विषम प्रकार", "ਵੱਖ ਜੋੜਾ-ਬੇਜੋੜ ਕਿਸਮ"],
  ["odd faces", "विषम फलक", "ਬੇਜੋੜ ਪਾਸੇ"],
  ["even faces", "सम फलक", "ਜੋੜੇ ਪਾਸੇ"],
  ["probability relation", "प्रायिकता संबंध", "ਸੰਭਾਵਨਾ ਸੰਬੰਧ"],
  ["stage probabilities", "चरण की प्रायिकताएँ", "ਪੜਾਅ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ"],
  ["second-stage probability", "दूसरे चरण की प्रायिकता", "ਦੂਜੇ ਪੜਾਅ ਦੀ ਸੰਭਾਵਨਾ"],
  ["second probability", "दूसरी प्रायिकता", "ਦੂਜੀ ਸੰਭਾਵਨਾ"],
  ["original composition", "मूल संरचना", "ਮੂਲ ਬਣਤਰ"],
  ["original contents", "मूल संरचना", "ਮੂਲ ਬਣਤਰ"],
  ["probability", "प्रायिकता", "ਸੰਭਾਵਨਾ"],
  ["denominator", "हर", "ਹਰ"],
  ["numerator", "अंश", "ਅੰਸ਼"],
  ["selection", "चयन", "ਚੋਣ"],
  ["selections", "चयन", "ਚੋਣਾਂ"],
  ["outcomes", "परिणाम", "ਨਤੀਜੇ"],
  ["outcome", "परिणाम", "ਨਤੀਜਾ"],
  ["events", "घटनाएँ", "ਘਟਨਾਵਾਂ"],
  ["event", "घटना", "ਘਟਨਾ"],
  ["condition", "शर्त", "ਸ਼ਰਤ"],
  ["counts", "संख्याएँ", "ਗਿਣਤੀਆਂ"],
  ["count", "संख्या", "ਗਿਣਤੀ"],
  ["number", "संख्या", "ਗਿਣਤੀ"],
  ["ways", "तरीके", "ਤਰੀਕੇ"],
  ["way", "तरीका", "ਤਰੀਕਾ"],
  ["block", "ब्लॉक", "ਬਲਾਕ"],
  ["positions", "स्थान", "ਸਥਾਨ"],
  ["position", "स्थान", "ਸਥਾਨ"],
  ["places", "स्थान", "ਸਥਾਨ"],
  ["post", "पद", "ਅਹੁਦਾ"],
  ["posts", "पद", "ਅਹੁਦੇ"],
  ["order", "क्रम", "ਕ੍ਰਮ"],
  ["range", "सीमा", "ਸੀਮਾ"],
  ["result", "परिणाम", "ਨਤੀਜਾ"],
  ["results", "परिणाम", "ਨਤੀਜੇ"],
  ["favourable", "अनुकूल", "ਅਨੁਕੂਲ"],
  ["total", "कुल", "ਕੁੱਲ"],
  ["red", "लाल", "ਲਾਲ"],
  ["blue", "नीला", "ਨੀਲਾ"],
  ["green", "हरा", "ਹਰਾ"],
  ["black", "काला", "ਕਾਲਾ"],
  ["cricket", "क्रिकेट", "ਕ੍ਰਿਕਟ"],
  ["football", "फुटबॉल", "ਫੁੱਟਬਾਲ"],
  ["bag", "बैग", "ਬੈਗ"],
  ["jar", "जार", "ਜਾਰ"],
  ["box", "बॉक्स", "ਬਾਕਸ"],
  ["pouch", "पाउच", "ਪਾਊਚ"],
  ["container", "पात्र", "ਡੱਬਾ"],
  ["Replacement", "वापस रखना", "ਵਾਪਸ ਰੱਖਣਾ"],
  ["replacement", "वापस रखना", "ਵਾਪਸ ਰੱਖਣਾ"],
  ["replaced", "वापस रखा जाता है", "ਵਾਪਸ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ"],
  ["removed", "निकाला जाता है", "ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ"],
  ["remain", "बचे रहते हैं", "ਬਚਦੇ ਹਨ"],
  ["remaining", "बाकी", "ਬਾਕੀ"],
  ["represent", "दर्शाते हैं", "ਦਰਸਾਉਂਦੇ ਹਨ"],
  ["altogether", "कुल मिलाकर", "ਕੁੱਲ ਮਿਲਾ ਕੇ"],
  ["divisible", "विभाज्य", "ਭਾਗਯੋਗ"],
  ["distinct", "अलग", "ਵੱਖ"],
  ["common", "साझा", "ਸਾਂਝਾ"],
  ["subtracted", "घटाया जाना चाहिए", "ਘਟਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ"],
  ["irrelevant", "महत्वहीन", "ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ"],
  ["valid", "सही", "ਸਹੀ"],
  ["appear", "आ सकते हैं", "ਆ ਸਕਦੇ ਹਨ"],
  ["restricted", "सीमित", "ਸੀਮਿਤ"],
  ["Knowing", "यह ज्ञात होने पर कि", "ਇਹ ਪਤਾ ਹੋਣ ਤੇ ਕਿ"],
  ["reduces", "सीमित कर देता है", "ਸੀਮਿਤ ਕਰ ਦਿੰਦਾ ਹੈ"],
  ["tells", "बताती है", "ਦੱਸਦੀ ਹੈ"],
  ["happen", "घटित हो सकते हैं", "ਘਟ ਸਕਦੇ ਹਨ"],
  ["possibilities", "संभावनाएँ", "ਸੰਭਾਵਨਾਵਾਂ"],
  ["sequence", "क्रम", "ਕ੍ਰਮ"],
  ["sequences", "क्रम", "ਕ੍ਰਮ"],
  ["queue", "कतार", "ਕਤਾਰ"],
  ["allowed", "अनुमत", "ਮਨਜ਼ੂਰ"],
  ["admissible", "मान्य", "ਮਨਜ਼ੂਰ"],
  ["treated", "माना जाता है", "ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ"],
  ["size", "आकार", "ਆਕਾਰ"],
  ["group", "समूह", "ਸਮੂਹ"],
  ["groups", "समूह", "ਸਮੂਹ"],
  ["members", "सदस्य", "ਮੈਂਬਰ"],
  ["named", "दिया गया", "ਦਿੱਤਾ ਗਿਆ"],
  ["used", "उपयोग किया जाता है", "ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ"],
  ["create", "बनाता है", "ਬਣਾਉਂਦਾ ਹੈ"],
  ["restricts", "सीमित करती है", "ਸੀਮਿਤ ਕਰਦੀ ਹੈ"],
  ["must", "आवश्यक रूप से", "ਲਾਜ਼ਮੀ"],
  ["which", "जो", "ਜੋ"],
  ["who", "जो", "ਜੋ"],
  ["means", "का अर्थ है", "ਦਾ ਅਰਥ ਹੈ"],
  ["let", "मान लें", "ਮੰਨੋ"],
  ["would", "होगा", "ਹੋਵੇਗਾ"],
  ["otherwise", "अन्यथा", "ਨਹੀਂ ਤਾਂ"],
  ["keeps", "बनाए रखता है", "ਬਰਕਰਾਰ ਰੱਖਦਾ ਹੈ"],
  ["gives", "देता है", "ਦਿੰਦਾ ਹੈ"],
  ["fixing", "तय करने के बाद", "ਨਿਰਧਾਰਤ ਕਰਨ ਤੋਂ ਬਾਅਦ"],
  ["filled", "भरे जा सकते हैं", "ਭਰੇ ਜਾ ਸਕਦੇ ਹਨ"],
  ["occur", "हो सकते हैं", "ਹੋ ਸਕਦੇ ਹਨ"],
  ["added", "जोड़ी जाती हैं", "ਜੋੜੀਆਂ ਜਾਂਦੀਆਂ ਹਨ"],
  ["tosses", "उछाल", "ਉਛਾਲ"],
  ["toss", "उछाल", "ਉਛਾਲ"],
  ["affect", "प्रभावित करते हैं", "ਅਸਰ ਪਾਂਦੇ ਹਨ"],
  ["receives", "प्राप्त करता है", "ਮਿਲਦਾ ਹੈ"],
  ["receive", "प्राप्त करता है", "ਮਿਲਦਾ ਹੈ"],
  ["containing", "जिनमें", "ਜਿਨ੍ਹਾਂ ਵਿੱਚ"],
  ["includes", "शामिल करता है", "ਸ਼ਾਮਲ ਕਰਦਾ ਹੈ"],
  ["corrects", "सुधारता है", "ਠੀਕ ਕਰਦਾ ਹੈ"],
  ["successive", "क्रमिक", "ਲਗਾਤਾਰ"],
  ["changing", "बदलने से", "ਬਦਲਣ ਨਾਲ"],
  ["distinguishable", "पहचाने जा सकने वाले", "ਪਛਾਣਯੋਗ"],
  ["unless", "जब तक", "ਜਦ ਤੱਕ"],
  ["division", "भाग", "ਭਾਗ"],
  ["reused", "दोबारा उपयोग नहीं किया जा सकता", "ਮੁੜ ਵਰਤਿਆ ਨਹੀਂ ਜਾ ਸਕਦਾ"],
  ["probabilities", "प्रायिकताएँ", "ਸੰਭਾਵਨਾਵਾਂ"],
  ["time", "बार", "ਵਾਰ"],
  ["directly", "सीधे", "ਸਿੱਧਾ"],
  ["twice", "दो बार", "ਦੋ ਵਾਰ"],
  ["together", "साथ", "ਇਕੱਠੇ"],
  ["separately", "अलग-अलग", "ਵੱਖ-ਵੱਖ"],
  ["exactly", "ठीक", "ਠੀਕ"],
  ["randomly", "यादृच्छिक रूप से", "ਬੇਤਰਤੀਬੀ ਨਾਲ"],
  ["random", "यादृच्छिक", "ਬੇਤਰਤੀਬ"],
  ["selected", "चुने गए", "ਚੁਣੇ"],
  ["selecting", "चुनने पर", "ਚੁਣਨ ਤੇ"],
  ["possible", "संभावित", "ਸੰਭਵ"],
  ["available", "उपलब्ध", "ਮੌਜੂਦ"],
  ["known", "ज्ञात", "ਜਾਣਿਆ"],
  ["required", "आवश्यक", "ਲੋੜੀਂਦਾ"],
  ["given", "दी गई", "ਦਿੱਤਾ"],
  ["same", "समान", "ਇੱਕੋ"],
  ["different", "अलग", "ਵੱਖ"],
  ["first", "पहला", "ਪਹਿਲਾ"],
  ["second", "दूसरा", "ਦੂਜਾ"],
  ["all", "सभी", "ਸਾਰੇ"],
  ["both", "दोनों", "ਦੋਵੇਂ"],
  ["only", "केवल", "ਕੇਵਲ"],
  ["each", "प्रत्येक", "ਹਰ"],
  ["every", "प्रत्येक", "ਹਰ"],
  ["these", "इन", "ਇਨ੍ਹਾਂ"],
  ["those", "उन", "ਉਨ੍ਹਾਂ"],
  ["their", "उनकी", "ਉਨ੍ਹਾਂ ਦੀ"],
  ["them", "उन्हें", "ਉਨ੍ਹਾਂ ਨੂੰ"],
  ["because", "क्योंकि", "ਕਿਉਂਕਿ"],
  ["therefore", "अतः", "ਇਸ ਲਈ"],
  ["hence", "अतः", "ਇਸ ਲਈ"],
  ["thus", "इस प्रकार", "ਇਸ ਤਰ੍ਹਾਂ"],
  ["after", "के बाद", "ਤੋਂ ਬਾਅਦ"],
  ["before", "से पहले", "ਤੋਂ ਪਹਿਲਾਂ"],
  ["when", "जब", "ਜਦੋਂ"],
  ["then", "फिर", "ਫਿਰ"],
  ["so", "इसलिए", "ਇਸ ਲਈ"],
  ["and", "और", "ਅਤੇ"],
  ["or", "या", "ਜਾਂ"],
  ["from", "में से", "ਵਿੱਚੋਂ"],
  ["among", "में से", "ਵਿੱਚੋਂ"],
  ["with", "के साथ", "ਨਾਲ"],
  ["without", "बिना", "ਬਿਨਾ"],
  ["into", "में", "ਵਿੱਚ"],
  ["outside", "बाहर", "ਬਾਹਰ"],
  ["inside", "अंदर", "ਅੰਦਰ"],
  ["again", "फिर", "ਮੁੜ"],
  ["also", "भी", "ਵੀ"],
  ["not", "नहीं", "ਨਹੀਂ"],
  ["cannot", "नहीं हो सकता", "ਨਹੀਂ ਹੋ ਸਕਦਾ"],
  ["can", "हो सकता है", "ਹੋ ਸਕਦਾ ਹੈ"],
  ["apply", "लगाएँ", "ਲਗਾਓ"],
  ["find", "ज्ञात करें", "ਕੱਢੋ"],
  ["subtract", "घटाएँ", "ਘਟਾਓ"],
  ["add", "जोड़ें", "ਜੋੜੋ"],
  ["multiply", "गुणा करें", "ਗੁਣਾ ਕਰੋ"],
  ["divide", "भाग दें", "ਭਾਗ ਦਿਓ"],
  ["remove", "हटाएँ", "ਹਟਾਓ"],
  ["fix", "तय करें", "ਨਿਰਧਾਰਤ ਕਰੋ"],
  ["arrange", "व्यवस्थित करें", "ਲਗਾਓ"],
  ["treat", "मानें", "ਮੰਨੋ"],
  ["compare", "तुलना करें", "ਤੁਲਨਾ ਕਰੋ"],
  ["restrict", "सीमित करें", "ਸੀਮਿਤ ਕਰੋ"],
  ["choose", "चुनें", "ਚੁਣੋ"],
  ["counted", "गिना गया", "ਗਿਣਿਆ"],
  ["counting", "गिनना", "ਗਿਣਨਾ"],
  ["works", "अनुकूल है", "ਅਨੁਕੂਲ ਹੈ"],
  ["work", "अनुकूल हैं", "ਅਨੁਕੂਲ ਹਨ"],
  ["satisfying", "पूरी करने वाले", "ਪੂਰੀ ਕਰਨ ਵਾਲੇ"],
  ["satisfies", "पूरी करता है", "ਪੂਰੀ ਕਰਦਾ ਹੈ"],
  ["satisfy", "पूरी करते हैं", "ਪੂਰੀ ਕਰਦੇ ਹਨ"],
  ["has", "में हैं", "ਵਿੱਚ ਹਨ"],
  ["contains", "में हैं", "ਵਿੱਚ ਹਨ"],
  ["is", "है", "ਹੈ"],
  ["are", "हैं", "ਹਨ"],
  ["was", "था", "ਸੀ"],
  ["were", "थे", "ਸਨ"],
  ["be", "होना", "ਹੋਣਾ"],
  ["of", "का", "ਦਾ"],
  ["in", "में", "ਵਿੱਚ"],
  ["to", "तक", "ਤੱਕ"],
  ["by", "से", "ਨਾਲ"],
  ["for", "के लिए", "ਲਈ"],
  ["as", "के रूप में", "ਵਜੋਂ"],
  ["than", "से", "ਤੋਂ"],
  ["one", "एक", "ਇੱਕ"],
  ["two", "दो", "ਦੋ"],
  ["The", "", ""],
  ["A", "एक", "ਇੱਕ"],
  ["An", "एक", "ਇੱਕ"],
];

const EXTRA_SOURCE_EXPLANATION_RULES: readonly Rule[] = [
  ["space", "समूह", "ਸਮੂਹ"],
  ["make", "बनाते हैं", "ਬਣਾਉਂਦੇ ਹਨ"],
  ["made", "बने", "ਬਣੇ"],
  ["once", "एक बार", "ਇੱਕ ਵਾਰ"],
  ["relation", "संबंध", "ਸੰਬੰਧ"],
  ["stated", "दी गई", "ਦਿੱਤੀ"],
  ["likely", "संभावित", "ਸੰਭਾਵਨਾ ਵਾਲੇ"],
  ["deck", "ताश की गड्डी", "ਤਾਸ਼ ਦੀ ਗੱਡੀ"],
  ["the deck", "ताश की गड्डी", "ਤਾਸ਼ ਦੀ ਗੱਡੀ"],
  ["part", "भाग", "ਹਿੱਸਾ"],
  ["marked part", "चिह्नित भाग", "ਨਿਸ਼ਾਨਿਤ ਹਿੱਸਾ"],
  ["pair", "युग्म", "ਜੋੜਾ"],
  ["pairs", "युग्म", "ਜੋੜੇ"],
  ["equally likely pairs", "समान रूप से संभावित युग्म", "ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ਜੋੜੇ"],
  ["two fair dice produce", "दो निष्पक्ष पासों से", "ਦੋ ਨਿਰਪੱਖ ਪਾਸਿਆਂ ਤੋਂ"],
  ["Two fair dice produce", "दो निष्पक्ष पासों से", "ਦੋ ਨਿਰਪੱਖ ਪਾਸਿਆਂ ਤੋਂ"],
  ["choices", "चयन", "ਚੋਣਾਂ"],
  ["choice", "चयन", "ਚੋਣ"],
  ["member", "सदस्य", "ਮੈਂਬਰ"],
  ["coloured", "रंगीन", "ਰੰਗੀਨ"],
  ["stone", "पत्थर", "ਪੱਥਰ"],
  ["stones", "पत्थर", "ਪੱਥਰ"],
  ["qualified", "योग्य", "ਯੋਗ"],
  ["full", "पूरा", "ਪੂਰਾ"],
  ["happen", "घटित हों", "ਘਟਣ"],
  ["valid", "मान्य", "ਮਨਜ਼ੂਰ"],
  ["internal", "आंतरिक", "ਅੰਦਰੂਨੀ"],
  ["changing", "बदलने पर", "ਬਦਲਣ ਤੇ"],
  ["shortlisted", "शॉर्टलिस्ट", "ਸ਼ਾਰਟਲਿਸਟ"],
  ["knowing", "यह ज्ञात होने पर कि", "ਇਹ ਪਤਾ ਹੋਣ ਤੇ ਕਿ"],
  ["becomes", "हो जाता है", "ਹੋ ਜਾਂਦਾ ਹੈ"],
  ["fails", "पूरी नहीं करता", "ਪੂਰੀ ਨਹੀਂ ਕਰਦਾ"],
  ["based", "आधारित", "ਆਧਾਰਿਤ"],
  ["restores", "मूल स्थिति फिर बना देता है", "ਮੂਲ ਹਾਲਤ ਮੁੜ ਬਣਾ ਦਿੰਦਾ ਹੈ"],
  ["subtracted", "घटाया जाता है", "ਘਟਾਇਆ ਜਾਂਦਾ ਹੈ"],
  ["odd", "विषम", "ਬੇਜੋੜ"],
  ["occur", "घटित हों", "ਘਟਣ"],
  ["occurs", "घटित होती है", "ਘਟਦੀ ਹੈ"],
  ["exclusive", "अपवर्ती", "ਅਲੱਗ"],
  ["mutually", "परस्पर", "ਪਰਸਪਰ"],
  ["exclusion", "बहिष्करण", "ਬਹਿਸ਼ਕਰਨ"],
  ["inclusion", "समावेशन", "ਸਮਾਵੇਸ਼"],
  ["second-stage", "दूसरे चरण की", "ਦੂਜੇ ਪੜਾਅ ਦੀ"],
  ["even-odd", "सम-विषम", "ਜੋੜਾ-ਬੇਜੋੜ"],
  ["odd-even", "विषम-सम", "ਬੇਜੋੜ-ਜੋੜਾ"],
  ["blue-only", "केवल नीला", "ਕੇਵਲ ਨੀਲਾ"],
  ["red-only", "केवल लाल", "ਕੇਵਲ ਲਾਲ"],
  ["all-men", "सभी पुरुष", "ਸਾਰੇ ਮਰਦ"],
  ["complete", "पूरा", "ਪੂਰਾ"],
  ["original", "मूल", "ਮੂਲ"],
  ["added", "जोड़े जाते हैं", "ਜੋੜੇ ਜਾਂਦੇ ਹਨ"],
  ["belonging", "में आने वाले", "ਵਿੱਚ ਆਉਣ ਵਾਲੇ"],
  ["distinct", "अलग-अलग", "ਵੱਖ-ਵੱਖ"],
  ["exclude", "हटा दें", "ਹਟਾ ਦਿਓ"],
  ["symmetry", "सममिति", "ਸਮਮਿਤੀ"],
  ["named", "निर्दिष्ट", "ਨਿਰਧਾਰਤ"],
  ["colours", "रंग", "ਰੰਗ"],
  ["colour", "रंग", "ਰੰਗ"],
  ["stages", "चरण", "ਪੜਾਅ"],
  ["stage", "चरण", "ਪੜਾਅ"],
  ["follow", "क्रम से लें", "ਕ੍ਰਮ ਨਾਲ ਲਵੋ"],
  ["list", "गिनें", "ਗਿਣੋ"],
  ["orders", "क्रम", "ਕ੍ਰਮ"],
  ["standard", "मानक", "ਮਿਆਰੀ"],
  ["shaded", "छायांकित", "ਛਾਇਆ ਕੀਤਾ"],
  ["complement", "पूरक घटना", "ਪੂਰਕ ਘਟਨਾ"],
  ["fair", "निष्पक्ष", "ਨਿਰਪੱਖ"],
  ["batch", "बैच", "ਬੈਚ"],
  ["defective", "खराब", "ਖਰਾਬ"],
  ["successful", "सफल", "ਸਫਲ"],
  ["lottery", "लॉटरी", "ਲਾਟਰੀ"],
  ["missing", "अज्ञात", "ਅਣਜਾਣ"],
  ["rearrange", "संबंध को पुनर्व्यवस्थित करें", "ਸੰਬੰਧ ਨੂੰ ਦੁਬਾਰਾ ਲਿਖੋ"],
  ["in all", "कुल", "ਕੁੱਲ"],
  ["prize-winning", "इनाम वाले", "ਇਨਾਮ ਵਾਲੇ"],
  ["available digits", "उपलब्ध अंक", "ਮੌਜੂਦ ਅੰਕ"],
  ["allowed digits", "अनुमत अंक", "ਮਨਜ਼ੂਰ ਅੰਕ"],
  ["forming", "बनाने में", "ਬਣਾਉਣ ਵਿੱਚ"],
  ["formed", "बनाई गई", "ਬਣਾਈ ਗਈ"],
  ["leading zero", "आरंभिक शून्य", "ਸ਼ੁਰੂਆਤੀ ਸਿਫ਼ਰ"],
  ["repetition", "पुनरावृत्ति", "ਦੁਹਰਾਈ"],
  ["with repetition", "पुनरावृत्ति के साथ", "ਦੁਹਰਾਈ ਨਾਲ"],
  ["without repetition", "बिना पुनरावृत्ति", "ਬਿਨਾ ਦੁਹਰਾਈ"],
  ["repetition is allowed", "अंकों की पुनरावृत्ति अनुमत है", "ਅੰਕਾਂ ਦੀ ਦੁਹਰਾਈ ਮਨਜ਼ੂਰ ਹੈ"],
  ["repetition is not allowed", "अंकों की पुनरावृत्ति अनुमत नहीं है", "ਅੰਕਾਂ ਦੀ ਦੁਹਰਾਈ ਮਨਜ਼ੂਰ ਨਹੀਂ ਹੈ"],
  ["number", "संख्या", "ਸੰਖਿਆ"],
  ["numbers", "संख्याएँ", "ਸੰਖਿਆਵਾਂ"],
  ["5-digit numbers", "5-अंकीय संख्याएँ", "5-ਅੰਕੀ ਸੰਖਿਆਵਾਂ"],
  ["3-digit numbers", "3-अंकीय संख्याएँ", "3-ਅੰਕੀ ਸੰਖਿਆਵਾਂ"],
  ["4-digit numbers", "4-अंकीय संख्याएँ", "4-ਅੰਕੀ ਸੰਖਿਆਵਾਂ"],
  ["of the", "में से", "ਵਿੱਚੋਂ"],
  ["equal sectors", "समान खंड", "ਬਰਾਬਰ ਖੰਡ"],
  ["equally possible", "समान रूप से संभावित", "ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ"],
  ["does not matter", "महत्वपूर्ण नहीं होता", "ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ"],
  ["do not matter", "महत्वपूर्ण नहीं होते", "ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦੇ"],
  ["does matter", "महत्वपूर्ण होता है", "ਮਹੱਤਵਪੂਰਨ ਹੁੰਦਾ ਹੈ"],
  ["there are", "हैं", "ਹਨ"],
  ["there is", "है", "ਹੈ"],
  ["made up of", "से मिलकर बना है", "ਤੋਂ ਮਿਲ ਕੇ ਬਣਿਆ ਹੈ"],
  ["make up", "बनाते हैं", "ਬਣਾਉਂਦੇ ਹਨ"],
  ["out of", "में से", "ਵਿੱਚੋਂ"],
  ["at least", "कम-से-कम", "ਘੱਟੋ-ਘੱਟ"],
  ["at most", "अधिकतम", "ਵੱਧ ਤੋਂ ਵੱਧ"],
  ["more than", "से अधिक", "ਤੋਂ ਵੱਧ"],
  ["less than", "से कम", "ਤੋਂ ਘੱਟ"],
  ["part of", "का भाग", "ਦਾ ਹਿੱਸਾ"],
  ["belonging to", "में आने वाले", "ਵਿੱਚ ਆਉਣ ਵਾਲੇ"],
  ["based on", "के आधार पर", "ਦੇ ਆਧਾਰ ਤੇ"],
  ["in order", "क्रम से", "ਕ੍ਰਮ ਨਾਲ"],
  ["in total", "कुल मिलाकर", "ਕੁੱਲ ਮਿਲਾ ਕੇ"],
  ["as a block", "एक ब्लॉक के रूप में", "ਇੱਕ ਬਲਾਕ ਵਜੋਂ"],
  ["one of", "में से एक", "ਵਿੱਚੋਂ ਇੱਕ"],
  ["either of", "दोनों में से किसी एक", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ"],
  ["neither of", "दोनों में से कोई भी नहीं", "ਦੋਵਾਂ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਨਹੀਂ"],
  ["use", "उपयोग करें", "ਵਰਤੋ"],
  ["uses", "उपयोग करता है", "ਵਰਤਦਾ ਹੈ"],
  ["using", "उपयोग करके", "ਵਰਤ ਕੇ"],
  ["there", "वहाँ", "ਉੱਥੇ"],
  ["no", "कोई नहीं", "ਕੋਈ ਨਹੀਂ"],
  ["that", "कि", "ਕਿ"],
  ["does", "करता है", "ਕਰਦਾ ਹੈ"],
  ["do", "करते हैं", "ਕਰਦੇ ਹਨ"],
  ["on", "पर", "ਉੱਤੇ"],
  ["up", "तक", "ਤੱਕ"],
  ["at", "पर", "ਤੇ"],
  ["least", "न्यूनतम", "ਘੱਟੋ-ਘੱਟ"],
  ["have", "हैं", "ਹਨ"],
  ["having", "वाले", "ਵਾਲੇ"],
  ["since", "क्योंकि", "ਕਿਉਂਕਿ"],
  ["matter", "महत्वपूर्ण होना", "ਮਹੱਤਵਪੂਰਨ ਹੋਣਾ"],
  ["matters", "महत्वपूर्ण होता है", "ਮਹੱਤਵਪੂਰਨ ਹੁੰਦਾ ਹੈ"],
  ["marked", "चिह्नित", "ਨਿਸ਼ਾਨਿਤ"],
  ["suit", "सूट", "ਸੂਟ"],
  ["suits", "सूट", "ਸੂਟ"],
  ["rank", "रैंक", "ਰੈਂਕ"],
  ["ranks", "रैंक", "ਰੈਂਕ"],
  ["question", "प्रश्न", "ਪ੍ਰਸ਼ਨ"],
  ["product", "गुणनफल", "ਗੁਣਨਫਲ"],
  ["sum", "योग", "ਜੋੜ"],
  ["fails", "पूरा नहीं करता", "ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ"],
  ["fail", "पूरा नहीं करते", "ਪੂਰਾ ਨਹੀਂ ਕਰਦੇ"],
  ["update", "बदलें", "ਬਦਲੋ"],
  ["occupy", "स्थान पर हो", "ਸਥਾਨ ਤੇ ਹੋਵੇ"],
  ["occupies", "स्थान पर है", "ਸਥਾਨ ਤੇ ਹੈ"],
  ["show", "दिखाएँ", "ਦਿਖਾਓ"],
  ["shows", "दिखाता है", "ਦਿਖਾਉਂਦਾ ਹੈ"],
  ["fixed", "तय", "ਨਿਰਧਾਰਤ"],
  ["belonging", "आने वाले", "ਆਉਣ ਵਾਲੇ"],
  ["unordered", "क्रमरहित", "ਬਿਨਾ ਕ੍ਰਮ ਵਾਲਾ"],
  ["combinations", "संचय", "ਸੰਚਯ"],
  ["combination", "संचय", "ਸੰਚਯ"],
  ["affect", "प्रभावित करते हैं", "ਅਸਰ ਪਾਂਦੇ ਹਨ"],
  ["affects", "प्रभावित करता है", "ਅਸਰ ਪਾਂਦਾ ਹੈ"],
  ["opposite", "विपरीत", "ਉਲਟ"],
  ["change", "बदलें", "ਬਦਲੋ"],
  ["changes", "बदलता है", "ਬਦਲਦਾ ਹੈ"],
  ["object", "वस्तु", "ਵਸਤੂ"],
  ["objects", "वस्तुएँ", "ਵਸਤੂਆਂ"],
  ["fewer", "कम", "ਘੱਟ"],
  ["obtain", "प्राप्त करें", "ਪ੍ਰਾਪਤ ਕਰੋ"],
  ["obtains", "प्राप्त करता है", "ਪ੍ਰਾਪਤ ਕਰਦਾ ਹੈ"],
  ["adding", "जोड़कर", "ਜੋੜ ਕੇ"],
  ["double", "दो बार", "ਦੋ ਵਾਰ"],
  ["six", "छह", "ਛੇ"],
  ["property", "गुण", "ਗੁਣ"],
  ["assignments", "आवंटन", "ਵੰਡਾਂ"],
  ["assignment", "आवंटन", "ਵੰਡ"],
  ["makes", "बनाता है", "ਬਣਾਉਂਦਾ ਹੈ"],
  ["composition", "संरचना", "ਬਣਤਰ"],
  ["permutations", "क्रमचय", "ਕ੍ਰਮਚਯ"],
  ["permutation", "क्रमचय", "ਕ੍ਰਮਚਯ"],
  ["digits", "अंक", "ਅੰਕ"],
  ["digit", "अंक", "ਅੰਕ"],
  ["linear", "रैखिक", "ਰੇਖੀ"],
  ["but", "लेकिन", "ਪਰ"],
  ["produce", "बनाएँ", "ਬਣਾਓ"],
  ["produces", "बनाता है", "ਬਣਾਉਂਦਾ ਹੈ"],
  ["form", "बनाएँ", "ਬਣਾਓ"],
  ["forms", "बनाता है", "ਬਣਾਉਂਦਾ ਹੈ"],
  ["parity", "सम-विषम प्रकार", "ਜੋੜਾ-ਬੇਜੋੜ ਕਿਸਮ"],
  ["distinguishable", "पहचाने जा सकने वाले", "ਪਛਾਣਯੋਗ"],
  ["included", "शामिल", "ਸ਼ਾਮਲ"],
  ["draws", "चयन", "ਚੋਣਾਂ"],
  ["draw", "चयन", "ਚੋਣ"],
  ["known", "ज्ञात", "ਜਾਣਿਆ"],
  ["tells", "बताता है", "ਦੱਸਦਾ ਹੈ"],
  ["us", "हमें", "ਸਾਨੂੰ"],
  ["here", "यहाँ", "ਇੱਥੇ"],
  ["non-adjacent", "असन्निकट", "ਵੱਖ-ਵੱਖ"],
  ["adjacent", "सन्निकट", "ਨਾਲ-ਨਾਲ"],
  ["longer", "लंबा", "ਲੰਮਾ"],
  ["shorter", "छोटा", "ਛੋਟਾ"],
  ["either", "किसी एक", "ਕਿਸੇ ਇੱਕ"],
  ["any", "कोई भी", "ਕੋਈ ਵੀ"],
  ["its", "उसका", "ਉਸ ਦਾ"],
  ["it", "यह", "ਇਹ"],
  ["this", "यह", "ਇਹ"],
  ["they", "वे", "ਉਹ"],
  ["new", "नया", "ਨਵਾਂ"],
  ["needed", "आवश्यक", "ਲੋੜੀਂਦਾ"],
  ["asks", "पूछता है", "ਪੁੱਛਦਾ ਹੈ"],
  ["calculate", "गणना करें", "ਗਣਨਾ ਕਰੋ"],
  ["calculated", "गणना की गई", "ਗਣਨਾ ਕੀਤੀ ਗਈ"],
  ["belong", "आते हैं", "ਆਉਂਦੇ ਹਨ"],
  ["contains", "में हैं", "ਵਿੱਚ ਹਨ"],
  ["including", "शामिल करते हुए", "ਸ਼ਾਮਲ ਕਰਦੇ ਹੋਏ"],
  ["inside", "अंदर", "ਅੰਦਰ"],
  ["outside", "बाहर", "ਬਾਹਰ"],
  ["set", "समूह", "ਸਮੂਹ"],
  ["other", "अन्य", "ਹੋਰ"],
  ["long", "लंबा", "ਲੰਮਾ"],
  ["short", "छोटा", "ਛੋਟਾ"],
  ["equal", "समान", "ਬਰਾਬਰ"],
  ["random", "यादृच्छिक", "ਬੇਤਰਤੀਬ"],
  ["occupying", "स्थान पर होने", "ਸਥਾਨ ਤੇ ਹੋਣ"],
  ["common", "साझा", "ਸਾਂਝਾ"],
  ["included", "शामिल", "ਸ਼ਾਮਲ"],
  ["returned", "वापस रखा गया", "ਵਾਪਸ ਰੱਖਿਆ ਗਿਆ"],
  ["restores", "फिर मूल स्थिति में लाता है", "ਮੁੜ ਮੂਲ ਹਾਲਤ ਵਿੱਚ ਲਿਆਉਂਦਾ ਹੈ"],
  ["contents", "सामग्री", "ਸਮੱਗਰੀ"],
  ["needed", "आवश्यक", "ਲੋੜੀਂਦਾ"],
  ["get", "प्राप्त करें", "ਪ੍ਰਾਪਤ ਕਰੋ"],
];

const CLAUSE_RULES: readonly Rule[] = [
  ["and rearrange the relation to find the missing count", "और संबंध को पुनर्व्यवस्थित करके अज्ञात संख्या ज्ञात करें", "ਅਤੇ ਸੰਬੰਧ ਨੂੰ ਦੁਬਾਰਾ ਲਿਖ ਕੇ ਅਣਜਾਣ ਗਿਣਤੀ ਕੱਢੋ"],
  ["For one random selection", "एक यादृच्छिक चयन के लिए", "ਇੱਕ ਬੇਤਰਤੀਬ ਚੋਣ ਲਈ"],
  ["count the sequences satisfying the stated head condition", "दी गई चित संबंधी शर्त पूरी करने वाले क्रम गिनें", "ਦਿੱਤੀ ਚਿੱਤ ਵਾਲੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਕ੍ਰਮ ਗਿਣੋ"],
  ["Use the complement", "पूरक घटना का उपयोग करें", "ਪੂਰਕ ਘਟਨਾ ਵਰਤੋ"],
  ["it is shorter to exclude the sequence with no head", "कोई चित न आने वाले क्रम को हटाना आसान है", "ਕੋਈ ਚਿੱਤ ਨਾ ਆਉਣ ਵਾਲੇ ਕ੍ਰਮ ਨੂੰ ਹਟਾਉਣਾ ਆਸਾਨ ਹੈ"],
  ["and count any card belonging to two required groups only once", "और दोनों आवश्यक समूहों में आने वाले पत्ते को केवल एक बार गिनें", "ਅਤੇ ਦੋਵੇਂ ਲੋੜੀਂਦੇ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਪੱਤੇ ਨੂੰ ਕੇਵਲ ਇੱਕ ਵਾਰ ਗਿਣੋ"],
  ["Use inclusion–exclusion", "समावेशन–बहिष्करण का उपयोग करें", "ਸਮਾਵੇਸ਼–ਬਹਿਸ਼ਕਰਨ ਵਰਤੋ"],
  ["so that members belonging to both groups are not counted twice", "ताकि दोनों समूहों में आने वाले सदस्यों को दो बार न गिना जाए", "ਤਾਂ ਜੋ ਦੋਵੇਂ ਸਮੂਹਾਂ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਮੈਂਬਰ ਦੋ ਵਾਰ ਨਾ ਗਿਣੇ ਜਾਣ"],
  ["to find those in at least one group, then subtract that count from the total", "कम-से-कम एक समूह में आने वालों की संख्या ज्ञात करें, फिर उसे कुल से घटाएँ", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਮੂਹ ਵਿੱਚ ਆਉਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ ਕੁੱਲ ਤੋਂ ਘਟਾਓ"],
  ["Follow the two selections in order", "दोनों चयनों को क्रम से देखें", "ਦੋਵੇਂ ਚੋਣਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਵੋ"],
  ["Replacement restores the original contents", "वस्तु वापस रखने पर मूल संरचना फिर से प्राप्त हो जाती है", "ਵਸਤੂ ਵਾਪਸ ਰੱਖਣ ਨਾਲ ਮੂਲ ਬਣਤਰ ਮੁੜ ਬਣ ਜਾਂਦੀ ਹੈ"],
  ["so the second-stage probability uses the same denominator", "इसलिए दूसरे चरण की प्रायिकता में वही हर रहता है", "ਇਸ ਲਈ ਦੂਜੇ ਪੜਾਅ ਦੀ ਸੰਭਾਵਨਾ ਵਿੱਚ ਉਹੀ ਹਰ ਰਹਿੰਦਾ ਹੈ"],
  ["Follow the selections in order and multiply the stage probabilities", "चयनों को क्रम से लें और प्रत्येक चरण की प्रायिकताओं को गुणा करें", "ਚੋਣਾਂ ਨੂੰ ਕ੍ਰਮ ਨਾਲ ਲਵੋ ਅਤੇ ਹਰ ਪੜਾਅ ਦੀ ਸੰਭਾਵਨਾ ਨੂੰ ਗੁਣਾ ਕਰੋ"],
  ["Without replacement, update both the remaining favourable count and the total before the second selection", "बिना वापस रखे चयन में दूसरे चयन से पहले बची अनुकूल संख्या और कुल संख्या दोनों बदलें", "ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਦੂਜੀ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਬਚੀ ਅਨੁਕੂਲ ਗਿਣਤੀ ਅਤੇ ਕੁੱਲ ਗਿਣਤੀ ਦੋਵੇਂ ਬਦਲੋ"],
  ["are selected together, order does not matter", "एक साथ चुने जाते हैं, इसलिए क्रम महत्वपूर्ण नहीं होता", "ਇੱਕੋ ਵੇਲੇ ਚੁਣੇ ਜਾਂਦੇ ਹਨ, ਇਸ ਲਈ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ"],
  ["For a probability, divide the number of required committees by the total number of committees", "प्रायिकता के लिए आवश्यक समितियों की संख्या को कुल समितियों की संख्या से भाग दें", "ਸੰਭਾਵਨਾ ਲਈ ਲੋੜੀਂਦੀਆਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਕੁੱਲ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਭਾਗ ਦਿਓ"],
  ["A committee is an unordered selection", "समिति का चयन क्रमरहित होता है", "ਕਮੇਟੀ ਦੀ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ"],
  ["Choose the required women and men separately with combinations, then multiply the independent choices", "आवश्यक महिलाओं और पुरुषों को अलग-अलग संचय से चुनें, फिर दोनों चयन के तरीकों को गुणा करें", "ਲੋੜੀਂਦੀਆਂ ਔਰਤਾਂ ਅਤੇ ਮਰਦਾਂ ਨੂੰ ਵੱਖ-ਵੱਖ ਸੰਚਯ ਨਾਲ ਚੁਣੋ, ਫਿਰ ਦੋਵਾਂ ਚੋਣਾਂ ਦੇ ਤਰੀਕਿਆਂ ਨੂੰ ਗੁਣਾ ਕਰੋ"],
  ["Position matters, so use permutations", "स्थान का क्रम महत्वपूर्ण है, इसलिए क्रमचय का उपयोग करें", "ਸਥਾਨ ਦਾ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ, ਇਸ ਲਈ ਕ੍ਰਮਚਯ ਵਰਤੋ"],
  ["For an even number, first fix an even unit digit and then arrange the remaining digits", "सम संख्या के लिए पहले इकाई स्थान पर सम अंक तय करें, फिर बाकी अंकों को व्यवस्थित करें", "ਜੋੜੀ ਸੰਖਿਆ ਲਈ ਪਹਿਲਾਂ ਇਕਾਈ ਸਥਾਨ ਤੇ ਜੋੜਾ ਅੰਕ ਨਿਰਧਾਰਤ ਕਰੋ, ਫਿਰ ਬਾਕੀ ਅੰਕ ਲਗਾਓ"],
  ["Treat the outcomes as ordered pairs", "परिणामों को क्रमित युग्म मानें", "ਨਤੀਜਿਆਂ ਨੂੰ ਕ੍ਰਮਿਤ ਜੋੜੇ ਮੰਨੋ"],
  ["The events are independent, so multiply their probabilities to obtain the probability that both occur", "घटनाएँ स्वतंत्र हैं, इसलिए दोनों के एक साथ घटित होने की प्रायिकता के लिए उनकी प्रायिकताओं को गुणा करें", "ਘਟਨਾਵਾਂ ਸੁਤੰਤਰ ਹਨ, ਇਸ ਲਈ ਦੋਵੇਂ ਇਕੱਠੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਨੂੰ ਗੁਣਾ ਕਰੋ"],
  ["The events are mutually exclusive, so add their probabilities; there is no overlap to subtract", "घटनाएँ परस्पर अपवर्ती हैं, इसलिए उनकी प्रायिकताएँ जोड़ें; घटाने के लिए कोई साझा भाग नहीं है", "ਘਟਨਾਵਾਂ ਪਰਸਪਰ ਅਲੱਗ ਹਨ, ਇਸ ਲਈ ਉਨ੍ਹਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਜੋੜੋ; ਘਟਾਉਣ ਲਈ ਕੋਈ ਸਾਂਝਾ ਹਿੱਸਾ ਨਹੀਂ"],
  ["The required event is the overlap of the two groups; compare that overlap with the complete group", "आवश्यक घटना दोनों समूहों का साझा भाग है; उसकी संख्या की तुलना पूरे समूह से करें", "ਲੋੜੀਂਦੀ ਘਟਨਾ ਦੋਵੇਂ ਸਮੂਹਾਂ ਦਾ ਸਾਂਝਾ ਹਿੱਸਾ ਹੈ; ਇਸ ਦੀ ਗਿਣਤੀ ਦੀ ਤੁਲਨਾ ਪੂਰੇ ਸਮੂਹ ਨਾਲ ਕਰੋ"],
  ["Every integer in the stated range is equally likely; list or count those satisfying the number property", "दी गई सीमा का प्रत्येक पूर्णांक समान रूप से संभावित है; संख्या की शर्त पूरी करने वाले पूर्णांक गिनें", "ਦਿੱਤੀ ਸੀਮਾ ਦਾ ਹਰ ਪੂਰਨ ਅੰਕ ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲਾ ਹੈ; ਸੰਖਿਆ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਪੂਰਨ ਅੰਕ ਗਿਣੋ"],
  ["Count all arrangements first, then count the arrangements in which the specified person occupies one of the allowed positions", "पहले सभी व्यवस्थाएँ गिनें, फिर वे व्यवस्थाएँ गिनें जिनमें निर्दिष्ट व्यक्ति अनुमत स्थानों में से किसी एक पर हो", "ਪਹਿਲਾਂ ਸਾਰੀਆਂ ਵਿਉਂਤਾਂ ਗਿਣੋ, ਫਿਰ ਉਹ ਵਿਉਂਤਾਂ ਗਿਣੋ ਜਿਨ੍ਹਾਂ ਵਿੱਚ ਨਿਰਧਾਰਤ ਵਿਅਕਤੀ ਮਨਜ਼ੂਰ ਸਥਾਨਾਂ ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਤੇ ਹੋਵੇ"],
  ["Use symmetry: in a random queue, every candidate is equally likely to occupy the first position", "सममिति का उपयोग करें: यादृच्छिक कतार में प्रत्येक अभ्यर्थी के पहले स्थान पर आने की संभावना समान है", "ਸਮਮਿਤੀ ਵਰਤੋ: ਬੇਤਰਤੀਬ ਕਤਾਰ ਵਿੱਚ ਹਰ ਉਮੀਦਵਾਰ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਬਰਾਬਰ ਹੈ"],
];

const ROLE = /^(Method|Step (\d+)|Simplification|Key point|Answer) — (.*)$/u;
const MATH = /\\\([\s\S]*?\\\)/gu;
const LATIN_PROSE = /[A-Za-z]{2,}/gu;
const NUMBER = /\d+(?:\.\d+)?/gu;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceRule(value: string, source: string, replacement: string): string {
  const pattern = new RegExp(`(?<![A-Za-z])${escapeRegExp(source)}(?![A-Za-z])`, "giu");
  return value.replace(pattern, replacement);
}

function protectMath(value: string, language: ProbabilityNativeLanguage): { text: string; math: string[] } {
  const math: string[] = [];
  return {
    text: value.replace(MATH, (token) => {
      const index = math.push(localizeProbabilityExplanationMathSegment(token, language)) - 1;
      return `¤${index}¤`;
    }),
    math,
  };
}

function restoreMath(value: string, math: readonly string[]): string {
  return math.reduce((text, token, index) => text.replaceAll(`¤${index}¤`, token), value);
}

function localizeHtSequences(value: string, language: ProbabilityNativeLanguage): string {
  const head = language === "hi" ? "चित" : "ਚਿੱਤ";
  const tail = language === "hi" ? "पट" : "ਪੱਟ";
  return value
    .replace(/(?<![A-Za-z])[HT]{2,}(?![A-Za-z])/gu, (sequence) =>
      [...sequence].map((token) => token === "H" ? head : tail).join("-"))
    .replace(/(?<![A-Za-z])H(?![A-Za-z])/gu, head)
    .replace(/(?<![A-Za-z])T(?![A-Za-z])/gu, tail);
}

function localizeRole(role: string, step: string | undefined, language: ProbabilityNativeLanguage): string {
  if (role === "Method") return language === "hi" ? "विधि" : "ਵਿਧੀ";
  if (role.startsWith("Step")) return language === "hi" ? `चरण ${step}` : `ਕਦਮ ${step}`;
  if (role === "Simplification") return language === "hi" ? "सरलीकरण" : "ਸਰਲੀਕਰਨ";
  if (role === "Key point") return language === "hi" ? "मुख्य बिंदु" : "ਮੁੱਖ ਬਿੰਦੂ";
  if (role === "Answer") return language === "hi" ? "उत्तर" : "ਉੱਤਰ";
  throw new Error(`Unsupported Probability explanation role: ${role}.`);
}

function translateBody(value: string, language: ProbabilityNativeLanguage): string {
  const natural = naturalizeProbabilityExplanationBody(value, language);
  if (natural !== null) return natural;
  const equallyPossible = value.match(/^Thus, (\d+) of the (\d+) equally possible (marbles|balls|pens|coloured stones) are favourable\.$/iu);
  if (equallyPossible) {
    const favourable = equallyPossible[1]!;
    const total = equallyPossible[2]!;
    const object = equallyPossible[3]!.toLowerCase();
    const hiObject: Record<string, string> = { marbles: "कंचों", balls: "गेंदों", pens: "पेनों", "coloured stones": "रंगीन पत्थरों" };
    const paObject: Record<string, string> = { marbles: "ਕੰਚਿਆਂ", balls: "ਗੇਂਦਾਂ", pens: "ਪੈਨਾਂ", "coloured stones": "ਰੰਗੀਨ ਪੱਥਰਾਂ" };
    return language === "hi"
      ? `इस प्रकार, ${total} समान रूप से संभावित ${hiObject[object]} में से ${favourable} अनुकूल हैं।`
      : `ਇਸ ਤਰ੍ਹਾਂ, ${total} ਬਰਾਬਰ ਸੰਭਾਵਨਾ ਵਾਲੇ ${paObject[object]} ਵਿੱਚੋਂ ${favourable} ਅਨੁਕੂਲ ਹਨ।`;
  }

  let body = value;
  const orderedRules = [...CLAUSE_RULES, ...RULES, ...EXTRA_SOURCE_EXPLANATION_RULES].sort((left, right) => right[0].length - left[0].length);
  for (const [source, hi, pa] of orderedRules) {
    body = replaceRule(body, source, language === "hi" ? hi : pa);
  }

  body = localizeHtSequences(body, language);
  body = body
    .replace(/\s+([,;:])/gu, "$1")
    .replace(/\.\s+/gu, "। ")
    .replace(/\.$/u, "।")
    .replace(/\s+/gu, " ")
    .trim();

  const latin = [...new Set(body.match(LATIN_PROSE) ?? [])];
  if (latin.length) {
    throw new Error(`Probability native explanation mirror has unsupported English prose: ${JSON.stringify({ value, body, latin })}.`);
  }
  return body;
}

function roleSignature(value: string): string {
  const match = value.match(ROLE);
  if (!match) throw new Error(`Probability English explanation line has unsupported role: ${value}`);
  return match[1]!;
}

function numericMultiset(value: string): string[] {
  return (value.match(NUMBER) ?? []).sort();
}

function mathSegments(value: string): string[] {
  return [...value.matchAll(MATH)].map((match) => match[0]!);
}

function translateSourceLine(sourceLine: string, language: ProbabilityNativeLanguage): string {
  const protectedLine = protectMath(sourceLine, language);
  const match = protectedLine.text.match(ROLE);
  if (!match) throw new Error(`Probability English explanation line has unsupported structure: ${sourceLine}`);
  const role = match[1]!;
  const step = match[2];
  const body = match[3]!;
  const translatedBody = translateBody(body, language);
  const nativeLine = restoreMath(`${localizeRole(role, step, language)} — ${translatedBody}`, protectedLine.math);

  const canonicalNativeMath = mathSegments(nativeLine).map((segment) =>
    canonicalizeProbabilityExplanationMathSegment(segment, language));
  if (mathSegments(sourceLine).join("\u0000") !== canonicalNativeMath.join("\u0000")) {
    throw new Error(`Probability native explanation changed English-authority MathJax semantics: ${sourceLine}`);
  }
  if (numericMultiset(sourceLine).join("\u0000") !== numericMultiset(nativeLine).join("\u0000")) {
    throw new Error(`Probability native explanation changed English-authority numeric facts: ${sourceLine}`);
  }
  try {
    // The English authority contains this standard combination identity outside MathJax.
    // Audit it as mathematics without changing the learner-facing/native line itself.
    const auditLine = nativeLine.replaceAll("n!/[r!(n-r)!]", "\\(n!/[r!(n-r)!]\\)");
    assertProbabilityNativeTextValid(auditLine, language);
  } catch (error) {
    throw new Error(
      `Probability native explanation audit failed: ${JSON.stringify({ language, sourceLine, nativeLine })}; ${error instanceof Error ? error.message : String(error)}`,
    );
  }
  return nativeLine;
}

export function renderNativeSourceExplanationLines(
  source: ProbabilityQuestion,
  language: ProbabilityNativeLanguage,
): string[] {
  const english = [...source.explanation.lines];
  const native = english.map((line) => translateSourceLine(line, language));
  if (native.length !== english.length) {
    throw new Error(`${source.questionLanguageId}/${language}: native explanation line-count parity failed.`);
  }
  for (let index = 0; index < english.length; index += 1) {
    const sourceRole = roleSignature(english[index]!);
    const expectedNativeRole = localizeRole(sourceRole, english[index]!.match(/^Step (\d+)/u)?.[1], language);
    if (!native[index]!.startsWith(`${expectedNativeRole} — `)) {
      throw new Error(`${source.questionLanguageId}/${language}: native explanation role parity failed at line ${index + 1}.`);
    }
  }
  return native;
}
