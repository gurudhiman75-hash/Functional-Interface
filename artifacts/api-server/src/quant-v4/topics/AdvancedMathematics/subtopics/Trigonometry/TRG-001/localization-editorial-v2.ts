import { createHash } from "node:crypto";

import {
  TRG_001_LOCALIZATION_AUTHORITY,
  TRG_001_LOCALIZATION_QL_IDS,
  localizeFrozenTrg001Question,
  trg001CanonicalSemanticFingerprint,
  type Trg001LocalizedLocale,
} from "./localization-v1";
import { generateHumanApprovedTrg001Question } from "./production-human-approved-runtime";

export const TRG_001_LOCALIZATION_EDITORIAL_VERSION = "TRG001_HI_PA_LOCALIZATION_EDITORIAL_V2" as const;

type AnyQuestion = Record<string, any>;
type TranslationPair = readonly [hi: string, pa: string];

function native(locale: Trg001LocalizedLocale, pair: TranslationPair) {
  return locale === "hi-IN" ? pair[0] : pair[1];
}

function sha256(value: unknown) {
  return createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value), "utf8")
    .digest("hex");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const EDITORIAL_PHRASES: ReadonlyArray<readonly [string, TranslationPair]> = [
  ["Cannot be determined", ["निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"]],
  ["Do not", ["न करें", "ਨਾ ਕਰੋ"]],
  ["does not", ["नहीं करता", "ਨਹੀਂ ਕਰਦਾ"]],
  ["is not", ["नहीं है", "ਨਹੀਂ ਹੈ"]],
  ["are not", ["नहीं हैं", "ਨਹੀਂ ਹਨ"]],
  ["as well as", ["के साथ-साथ", "ਦੇ ਨਾਲ-ਨਾਲ"]],
  ["rather than", ["की बजाय", "ਦੀ ਬਜਾਏ"]],
  ["each other", ["एक-दूसरे", "ਇੱਕ-ਦੂਜੇ"]],
  ["the target", ["लक्ष्य", "ਲਕਸ਼"]],
  ["the given", ["दिए गए", "ਦਿੱਤੇ"]],
  ["the result", ["परिणाम", "ਨਤੀਜਾ"]],
  ["the answer", ["उत्तर", "ਉੱਤਰ"]],
  ["the expression", ["व्यंजक", "ਵਿਅੰਜਕ"]],
  ["the ratio", ["अनुपात", "ਅਨੁਪਾਤ"]],
  ["the value", ["मान", "ਮਾਨ"]],
  ["the angle", ["कोण", "ਕੋਣ"]],
  ["the sign", ["चिह्न", "ਚਿੰਨ੍ਹ"]],
  ["the denominator", ["हर", "ਹਰ"]],
  ["the numerator", ["अंश", "ਅੰਸ਼"]],
  ["the hypotenuse", ["कर्ण", "ਕਰਣ"]],
  ["the reference", ["संदर्भ", "ਹਵਾਲਾ"]],
  ["the comparison", ["तुलना", "ਤੁਲਨਾ"]],
  ["the interval", ["अंतराल", "ਅੰਤਰਾਲ"]],
  ["the question", ["प्रश्न", "ਪ੍ਰਸ਼ਨ"]],
  ["the same", ["समान", "ਇੱਕੋ"]],
  ["the two", ["दोनों", "ਦੋਵੇਂ"]],
  ["all three", ["तीनों", "ਤਿੰਨੇ"]],
  ["standard-", ["मानक-", "ਮਿਆਰੀ-"]],
  ["non-", ["गैर-", "ਗੈਰ-"]],
  ["rational-", ["परिमेय-", "ਪਰਿਮੇਯ-"]],
  ["reference-", ["संदर्भ-", "ਹਵਾਲਾ-"]],
  ["to-", ["से-", "ਤੋਂ-"]],
  ["plus-", ["जोड़-", "ਜੋੜ-"]],
  ["double-", ["द्वि-", "ਦੁੱਗਣਾ-"]],
  ["sine-only", ["केवल-साइन", "ਕੇਵਲ-ਸਾਈਨ"]],
  ["cosine-only", ["केवल-कोसाइन", "ਕੇਵਲ-ਕੋਸਾਈਨ"]],
  ["secant-tangent", ["सेकेंट-टैन्जेंट", "ਸੀਕੈਂਟ-ਟੈਂਜੈਂਟ"]],
  ["cosecant-cotangent", ["कोसेकेंट-कोटैन्जेंट", "ਕੋਸੀਕੈਂਟ-ਕੋਟੈਂਜੈਂਟ"]],
  ["tangent-cotangent", ["टैन्जेंट-कोटैन्जेंट", "ਟੈਂਜੈਂਟ-ਕੋਟੈਂਜੈਂਟ"]],
  ["sine-cosine", ["साइन-कोसाइन", "ਸਾਈਨ-ਕੋਸਾਈਨ"]],
  ["conjugate-looking", ["संयुग्मी-जैसा", "ਸੰਯੁਗਮੀ-ਵਰਗਾ"]],
  ["cosine's", ["कोसाइन का", "ਕੋਸਾਈਨ ਦਾ"]],
  ["Relative to", ["के संदर्भ में", "ਦੇ ਸਬੰਧ ਵਿੱਚ"]],
  ["अनुपातnal-", ["परिमेय-", "ਪਰਿਮੇਯ-"]],
  ["ਅਨੁਪਾਤnal-", ["परिमेय-", "ਪਰਿਮੇਯ-"]],
  ["In a समकोण त्रिभुज", ["एक समकोण त्रिभुज में", "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ"]],
  ["In a ਸਮਕੋਣ ਤਿਕੋਣ", ["एक समकोण त्रिभुज में", "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਵਿੱਚ"]],
  ["A समकोण त्रिभुज", ["एक समकोण त्रिभुज", "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ"]],
  ["A ਸਮਕੋਣ ਤਿਕੋਣ", ["एक समकोण त्रिभुज", "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ"]],
  ["The भुजाएँ of a समकोण त्रिभुज", ["एक समकोण त्रिभुज की भुजाएँ", "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ"]],
  ["The ਭੁਜਾਵਾਂ of a ਸਮਕੋਣ ਤਿਕੋਣ", ["एक समकोण त्रिभुज की भुजाएँ", "ਇੱਕ ਸਮਕੋਣ ਤਿਕੋਣ ਦੀਆਂ ਭੁਜਾਵਾਂ"]],
  ["Do not swap", ["अदला-बदली न करें", "ਅਦਲਾ-ਬਦਲੀ ਨਾ ਕਰੋ"]],
  ["Do not use", ["प्रयोग न करें", "ਵਰਤੋਂ ਨਾ ਕਰੋ"]],
  ["Do not lose", ["न खोएँ", "ਨਾ ਗੁਆਓ"]],
  ["Do not forget", ["न भूलें", "ਨਾ ਭੁੱਲੋ"]],
  ["Do not stop", ["न रुकें", "ਨਾ ਰੁਕੋ"]],
  ["Do not choose", ["न चुनें", "ਨਾ ਚੁਣੋ"]],
  ["Do not return", ["उत्तर न दें", "ਉੱਤਰ ਨਾ ਦਿਓ"]],
  ["Do not write", ["न लिखें", "ਨਾ ਲਿਖੋ"]],
  ["Do not report", ["न लिखें", "ਨਾ ਲਿਖੋ"]],
  ["Do not treat", ["न मानें", "ਨਾ ਮੰਨੋ"]],
  ["Do not confuse", ["भ्रमित न हों", "ਗਲਤ ਨਾ ਮਿਲਾਓ"]],
  ["Do not reverse", ["अनुपात न उलटें", "ਅਨੁਪਾਤ ਨਾ ਉਲਟੋ"]],
  ["Do not invert", ["व्युत्क्रम पहले न लें", "ਪਰਸਪਰ ਪਹਿਲਾਂ ਨਾ ਲਓ"]],
  ["Do not omit", ["न छोड़ें", "ਨਾ ਛੱਡੋ"]],
  ["Do not drop", ["न छोड़ें", "ਨਾ ਛੱਡੋ"]],
  ["Do not cancel", ["न काटें", "ਨਾ ਕੱਟੋ"]],
  ["Do not apply", ["लागू न करें", "ਲਾਗੂ ਨਾ ਕਰੋ"]],
  ["Do not insert", ["शामिल न करें", "ਸ਼ਾਮਲ ਨਾ ਕਰੋ"]],
  ["Do not introduce", ["शामिल न करें", "ਸ਼ਾਮਲ ਨਾ ਕਰੋ"]],
  ["Do not call", ["न कहें", "ਨਾ ਕਹੋ"]]
];

const EDITORIAL_WORDS: Readonly<Record<string, TranslationPair>> = {
  "the": ["", ""],
  "is": ["है", "ਹੈ"],
  "not": ["नहीं", "ਨਹੀਂ"],
  "tangent": ["टैन्जेंट", "ਟੈਂਜੈਂਟ"],
  "to": ["को", "ਨੂੰ"],
  "do": ["करें", "ਕਰੋ"],
  "cosine": ["कोसाइन", "ਕੋਸਾਈਨ"],
  "in": ["में", "ਵਿੱਚ"],
  "for": ["के लिए", "ਲਈ"],
  "sine": ["साइन", "ਸਾਈਨ"],
  "by": ["से", "ਨਾਲ"],
  "of": ["का", "ਦਾ"],
  "exactly": ["सटीक रूप से", "ਸਹੀ ਤੌਰ ਤੇ"],
  "its": ["उसका", "ਇਸਦਾ"],
  "exact": ["सटीक", "ਸਹੀ"],
  "are": ["हैं", "ਹਨ"],
  "gives": ["देता है", "ਦਿੰਦਾ ਹੈ"],
  "secant": ["सेकेंट", "ਸੀਕੈਂਟ"],
  "two": ["दो", "ਦੋ"],
  "leg": ["भुजा", "ਭੁਜਾ"],
  "cotangent": ["कोटैन्जेंट", "ਕੋਟੈਂਜੈਂਟ"],
  "conjugate": ["संयुग्मी", "ਸੰਯੁਗਮੀ"],
  "both": ["दोनों", "ਦੋਵੇਂ"],
  "reconstruct": ["पुनर्निर्मित करें", "ਮੁੜ ਬਣਾਓ"],
  "standard": ["मानक", "ਮਿਆਰੀ"],
  "at": ["पर", "ਤੇ"],
  "recover": ["ज्ञात करें", "ਕੱਢੋ"],
  "when": ["जब", "ਜਦੋਂ"],
  "as": ["के रूप में", "ਦੇ ਰੂਪ ਵਿੱਚ"],
  "answer": ["उत्तर", "ਉੱਤਰ"],
  "their": ["उनका", "ਉਨ੍ਹਾਂ ਦਾ"],
  "apply": ["लागू करें", "ਲਾਗੂ ਕਰੋ"],
  "into": ["में", "ਵਿੱਚ"],
  "scale": ["स्केल", "ਸਕੇਲ"],
  "becomes": ["बन जाता है", "ਬਣ ਜਾਂਦਾ ਹੈ"],
  "cosecant": ["कोसेकेंट", "ਕੋਸੀਕੈਂਟ"],
  "complementary": ["पूरक", "ਪੂਰਕ"],
  "uses": ["प्रयोग करता है", "ਵਰਤਦਾ ਹੈ"],
  "it": ["यह", "ਇਹ"],
  "only": ["केवल", "ਕੇਵਲ"],
  "reciprocate": ["व्युत्क्रम लें", "ਪਰਸਪਰ ਲਓ"],
  "each": ["प्रत्येक", "ਹਰੇਕ"],
  "one": ["एक", "ਇੱਕ"],
  "target": ["लक्ष्य", "ਲਕਸ਼"],
  "cancel": ["काटें", "ਕੱਟੋ"],
  "since": ["क्योंकि", "ਕਿਉਂਕਿ"],
  "squares": ["वर्ग", "ਵਰਗ"],
  "lies": ["स्थित है", "ਸਥਿਤ ਹੈ"],
  "legs": ["भुजाएँ", "ਭੁਜਾਵਾਂ"],
  "this": ["यह", "ਇਹ"],
  "isolate": ["अलग करें", "ਵੱਖ ਕਰੋ"],
  "does": ["करता है", "ਕਰਦਾ ਹੈ"],
  "trig": ["त्रिकोणमितीय", "ਤਿਕੋਣਮਿਤੀ"],
  "an": ["", ""],
  "separately": ["अलग-अलग", "ਵੱਖ-ਵੱਖ"],
  "keep": ["रखें", "ਰੱਖੋ"],
  "combining": ["मिलाने पर", "ਮਿਲਾਉਣ ਤੇ"],
  "coefficient": ["गुणांक", "ਗੁਣਾਂਕ"],
  "changes": ["बदलता है", "ਬਦਲਦਾ ਹੈ"],
  "obtain": ["प्राप्त करें", "ਪ੍ਰਾਪਤ ਕਰੋ"],
  "required": ["आवश्यक", "ਲੋੜੀਂਦਾ"],
  "plus": ["जोड़", "ਜੋੜ"],
  "conjugates": ["संयुग्मी युग्म", "ਸੰਯੁਗਮੀ ਜੋੜੇ"],
  "cross": ["क्रॉस", "ਕਰਾਸ"],
  "but": ["लेकिन", "ਪਰ"],
  "right": ["समकोण", "ਸਮਕੋਣ"],
  "swap": ["अदला-बदली करें", "ਅਦਲਾ-ਬਦਲੀ ਕਰੋ"],
  "hypotenuse": ["कर्ण", "ਕਰਣ"],
  "pythagoras": ["पाइथागोरस", "ਪਾਇਥਾਗੋਰਸ"],
  "determine": ["ज्ञात कीजिए", "ਕੱਢੋ"],
  "build": ["बनाएँ", "ਬਣਾਓ"],
  "reverses": ["उलट जाता है", "ਉਲਟ ਜਾਂਦਾ ਹੈ"],
  "stated": ["दिए गए", "ਦਿੱਤੇ ਹੋਏ"],
  "addition": ["जोड़", "ਜੋੜ"],
  "subtraction": ["घटाव", "ਘਟਾਓ"],
  "cofunction": ["सहफलन", "ਸਹਿ-ਫੰਕਸ਼ਨ"],
  "unchanged": ["अपरिवर्तित", "ਬਿਨਾਂ ਬਦਲੇ"],
  "reference": ["संदर्भ", "ਹਵਾਲਾ"],
  "leaves": ["अपरिवर्तित रखता है", "ਬਿਨਾਂ ਬਦਲੇ ਰੱਖਦਾ ਹੈ"],
  "applying": ["लागू करने पर", "ਲਾਗੂ ਕਰਨ ਤੇ"],
  "across": ["के आर-पार", "ਦੇ ਪਾਰ"],
  "linear": ["रैखिक", "ਰੇਖੀ"],
  "solve": ["हल करें", "ਹੱਲ ਕਰੋ"],
  "match": ["मिलाएँ", "ਮਿਲਾਓ"],
  "products": ["गुणनफल", "ਗੁਣਨਫਲ"],
  "wherever": ["जहाँ भी", "ਜਿੱਥੇ ਵੀ"],
  "three": ["तीन", "ਤਿੰਨ"],
  "multiplying": ["गुणा करने से", "ਗੁਣਾ ਕਰਨ ਨਾਲ"],
  "relative": ["के सापेक्ष", "ਦੇ ਸਬੰਧ ਵਿੱਚ"],
  "remaining": ["शेष", "ਬਾਕੀ"],
  "roles": ["भूमिकाएँ", "ਭੂਮਿਕਾਵਾਂ"],
  "on": ["पर", "ਤੇ"],
  "change": ["बदलता", "ਬਦਲਦਾ"],
  "directly": ["सीधे", "ਸਿੱਧੇ"],
  "reverse": ["उलटें", "ਉਲਟੋ"],
  "needed": ["आवश्यक", "ਲੋੜੀਂਦਾ"],
  "familiar": ["परिचित", "ਜਾਣਿਆ-ਪਛਾਣਿਆ"],
  "treat": ["मानें", "ਮੰਨੋ"],
  "confuse": ["भ्रमित न करें", "ਗਲਤ ਨਾ ਮਿਲਾਓ"],
  "order": ["क्रम", "ਕ੍ਰਮ"],
  "recognize": ["पहचानें", "ਪਛਾਣੋ"],
  "every": ["प्रत्येक", "ਹਰੇਕ"],
  "power": ["घात", "ਘਾਤ"],
  "fraction": ["भिन्न", "ਭਿੰਨ"],
  "shift": ["स्थानांतरण", "ਸਥਾਨਾਂਤਰ"],
  "simplifies": ["सरल होकर", "ਸਰਲ ਹੋ ਕੇ"],
  "cancels": ["कट जाता है", "ਕੱਟ ਜਾਂਦਾ ਹੈ"],
  "whole": ["पूरे", "ਪੂਰੇ"],
  "rewrite": ["पुनर्लिखें", "ਮੁੜ ਲਿਖੋ"],
  "expand": ["विस्तार करें", "ਵਿਸਤਾਰ ਕਰੋ"],
  "factors": ["गुणक", "ਗੁਣਕ"],
  "pair": ["युग्म", "ਜੋੜਾ"],
  "cannot": ["नहीं किया जा सकता", "ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"],
  "touch": ["स्पर्श करती", "ਛੂਹਦੀ"],
  "touches": ["स्पर्श करती है", "ਛੂਹਦੀ ਹੈ"],
  "depends": ["निर्भर करता है", "ਨਿਰਭਰ ਕਰਦਾ ਹੈ"],
  "what": ["क्या", "ਕੀ"],
  "forming": ["बनाकर", "ਬਣਾ ਕੇ"],
  "given": ["दिया गया", "ਦਿੱਤਾ ਹੋਇਆ"],
  "correspond": ["के बराबर हैं", "ਦੇ ਬਰਾਬਰ ਹਨ"],
  "selects": ["चुनता है", "ਚੁਣਦਾ ਹੈ"],
  "fixes": ["निर्धारित करता है", "ਨਿਰਧਾਰਤ ਕਰਦਾ ਹੈ"],
  "return": ["उत्तर न दें", "ਉੱਤਰ ਨਾ ਦਿਓ"],
  "requested": ["पूछा गया", "ਪੁੱਛਿਆ ਗਿਆ"],
  "interpret": ["समझें", "ਸਮਝੋ"],
  "invert": ["उलटें", "ਉਲਟੋ"],
  "comparison": ["तुलना", "ਤੁਲਨਾ"],
  "here": ["यहाँ", "ਇੱਥੇ"],
  "once": ["एक बार", "ਇੱਕ ਵਾਰ"],
  "decimal": ["दशमलव", "ਦਸ਼ਮਲਵ"],
  "differ": ["भिन्न हैं", "ਵੱਖ ਹਨ"],
  "automatically": ["स्वतः", "ਆਪੇ"],
  "operation": ["क्रिया", "ਕ੍ਰਿਆ"],
  "preserve": ["बनाए रखें", "ਕਾਇਮ ਰੱਖੋ"],
  "infinity": ["अनंत", "ਅਨੰਤ"],
  "real": ["वास्तविक", "ਵਾਸਤਵਿਕ"],
  "trigonometric": ["त्रिकोणमितीय", "ਤਿਕੋਣਮਿਤੀ"],
  "pairs": ["युग्म बनता है", "ਜੋੜਾ ਬਣਦਾ ਹੈ"],
  "under": ["में", "ਵਿੱਚ"],
  "well": ["भी", "ਵੀ"],
  "remains": ["रहता है", "ਰਹਿੰਦਾ ਹੈ"],
  "coterminal": ["सह-अंतिम", "ਸਹਿ-ਅੰਤਿਮ"],
  "turn": ["चक्कर", "ਚੱਕਰ"],
  "simple": ["सरल", "ਸਰਲ"],
  "always": ["हमेशा", "ਹਮੇਸ਼ਾਂ"],
  "no": ["कोई नहीं", "ਕੋਈ ਨਹੀਂ"],
  "root": ["मूल", "ਮੂਲ"],
  "question": ["प्रश्न", "ਪ੍ਰਸ਼ਨ"],
  "asks": ["पूछता है", "ਪੁੱਛਦਾ ਹੈ"],
  "decimals": ["दशमलव", "ਦਸ਼ਮਲਵ"],
  "contains": ["में होता है", "ਵਿੱਚ ਹੁੰਦਾ ਹੈ"],
  "times": ["गुणा", "ਗੁਣਾ"],
  "that": ["वह", "ਉਹ"],
  "form": ["बनाएँ", "ਬਣਾਓ"],
  "reconstructing": ["पुनर्निर्माण के बाद", "ਮੁੜ ਬਣਾਉਣ ਤੋਂ ਬਾਅਦ"],
  "outer": ["बाहरी", "ਬਾਹਰੀ"],
  "moves": ["जाता है", "ਜਾਂਦਾ ਹੈ"],
  "second": ["दूसरा", "ਦੂਜਾ"],
  "connect": ["संबंध स्थापित करें", "ਸਬੰਧ ਬਣਾਓ"],
  "interval": ["अंतराल", "ਅੰਤਰਾਲ"],
  "removes": ["हटा देता है", "ਹਟਾ ਦਿੰਦਾ ਹੈ"],
  "collapse": ["सरल करें", "ਸਰਲ ਕਰੋ"],
  "cancelling": ["काटने के बाद", "ਕੱਟਣ ਤੋਂ ਬਾਅਦ"],
  "omit": ["छोड़ें", "ਛੱਡੋ"],
  "pythagorean": ["पाइथागोरस", "ਪਾਇਥਾਗੋਰਸ"],
  "between": ["के बीच", "ਦੇ ਵਿਚਕਾਰ"],
  "all": ["सभी", "ਸਾਰੇ"],
  "independently": ["स्वतंत्र रूप से", "ਸੁਤੰਤਰ ਤੌਰ ਤੇ"],
  "be": ["हो", "ਹੋ"],
  "determined": ["निर्धारित", "ਨਿਰਧਾਰਤ"],
  "formed": ["बनता है", "ਬਣਦਾ ਹੈ"],
  "call": ["न कहें", "ਨਾ ਕਹੋ"],
  "merely": ["केवल", "ਕੇਵਲ"],
  "longest": ["सबसे लंबी", "ਸਭ ਤੋਂ ਲੰਮੀ"],
  "exclude": ["हटा दें", "ਹਟਾਓ"],
  "naming": ["नाम देते समय", "ਨਾਮ ਦੇਣ ਵੇਲੇ"],
  "unlike": ["के विपरीत", "ਦੇ ਉਲਟ"],
  "chosen": ["चुने हुए", "ਚੁਣੇ ਹੋਏ"],
  "represents": ["दर्शाता है", "ਦਰਸਾਉਂਦਾ ਹੈ"],
  "identify": ["पहचानें", "ਪਛਾਣੋ"],
  "choosing": ["चुनने से", "ਚੁਣਨ ਤੋਂ ਪਹਿਲਾਂ"],
  "itself": ["स्वयं", "ਖੁਦ"],
  "introduce": ["शामिल करें", "ਸ਼ਾਮਲ ਕਰੋ"],
  "has": ["में हैं", "ਵਿੱਚ ਹਨ"],
  "unit": ["इकाई", "ਇਕਾਈ"],
  "stop": ["रुकें", "ਰੁਕੋ"],
  "finding": ["ज्ञात करने", "ਕੱਢਣ"],
  "reconstruction": ["पुनर्निर्माण", "ਮੁੜ-ਨਿਰਮਾਣ"],
  "assigning": ["निर्धारित करते समय", "ਨਿਰਧਾਰਤ ਕਰਦੇ ਵੇਲੇ"],
  "satisfies": ["संतुष्ट करता है", "ਸੰਤੁਸ਼ਟ ਕਰਦਾ ਹੈ"],
  "compare": ["तुलना करें", "ਤੁਲਨਾ ਕਰੋ"],
  "crosses": ["पार करता है", "ਪਾਰ ਕਰਦਾ ਹੈ"],
  "surd": ["करनी", "ਕਰਣੀ"],
  "either": ["किसी भी", "ਕਿਸੇ ਵੀ"],
  "alone": ["अकेले", "ਅਕੇਲਾ"],
  "measure": ["माप", "ਮਾਪ"],
  "rationalize": ["हर का परिमेयकरण करें", "ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰੋ"],
  "shortcut": ["शॉर्टकट", "ਸ਼ਾਰਟਕੱਟ"],
  "works": ["काम करता है", "ਕੰਮ ਕਰਦਾ ਹੈ"],
  "identical": ["समान", "ਇੱਕੋ"],
  "other": ["दूसरे", "ਦੂਜੇ"],
  "these": ["ये", "ਇਹ"],
  "own": ["अपने", "ਆਪਣੇ"],
  "invoke": ["लागू करें", "ਲਾਗੂ ਕਰੋ"],
  "final": ["अंतिम", "ਅੰਤਿਮ"],
  "division": ["भाग", "ਭਾਗ"],
  "report": ["लिखें", "ਲਿਖੋ"],
  "following": ["निम्नलिखित", "ਹੇਠਾਂ ਦਿੱਤੇ"],
  "finite": ["ससीम", "ਸੀਮਿਤ"],
  "axis": ["अक्ष", "ਅਕਸ"],
  "check": ["जाँचें", "ਜਾਂਚੋ"],
  "evaluating": ["मान निकालने से", "ਮਾਨ ਕੱਢਣ ਤੋਂ"],
  "write": ["लिखें", "ਲਿਖੋ"],
  "completely": ["पूरी तरह", "ਪੂਰੀ ਤਰ੍ਹਾਂ"],
  "corresponds": ["के बराबर है", "ਦੇ ਬਰਾਬਰ ਹੈ"],
  "complements": ["पूरक कोणों के लिए", "ਪੂਰਕ ਕੋਣਾਂ ਲਈ"],
  "swaps": ["अदला-बदली करता है", "ਅਦਲਾ-ਬਦਲੀ ਕਰਦਾ ਹੈ"],
  "lose": ["न खोएँ", "ਨਾ ਗੁਆਓ"],
  "full": ["पूरा", "ਪੂਰਾ"],
  "beyond": ["से आगे", "ਤੋਂ ਅੱਗੇ"],
  "reduction": ["अपचयन", "ਘਟਾਅ"],
  "keeps": ["बनाए रखता है", "ਕਾਇਮ ਰੱਖਦਾ ਹੈ"],
  "copy": ["सीधे नकल करें", "ਸਿੱਧੀ ਨਕਲ ਕਰੋ"],
  "also": ["भी", "ਵੀ"],
  "fixing": ["तय करने के बाद", "ਤੈਅ ਕਰਨ ਤੋਂ ਬਾਅਦ"],
  "separate": ["अलग", "ਵੱਖ"],
  "steps": ["चरण", "ਕਦਮ"],
  "there": ["वहाँ", "ਉੱਥੇ"],
  "decision": ["निर्णय", "ਫੈਸਲਾ"],
  "protects": ["सुरक्षित रखती है", "ਸੁਰੱਖਿਅਤ ਰੱਖਦੀ ਹੈ"],
  "applies": ["लागू होता है", "ਲਾਗੂ ਹੁੰਦਾ ਹੈ"],
  "rearrange": ["पुनर्व्यवस्थित करें", "ਮੁੜ ਵਿਵਸਥਿਤ ਕਰੋ"],
  "direction": ["दिशा", "ਦਿਸ਼ਾ"],
  "multiplicative": ["गुणात्मक", "ਗੁਣਾਤਮਕ"],
  "consistently": ["समान रूप से", "ਇੱਕੋ ਤਰ੍ਹਾਂ"],
  "approximate": ["लगभग", "ਲਗਭਗ"],
  "inserting": ["मान रखने से", "ਮਾਨ ਰੱਖਣ ਨਾਲ"],
  "rational": ["परिमेय", "ਪਰਿਮੇਯ"],
  "insert": ["शामिल करें", "ਸ਼ਾਮਲ ਕਰੋ"],
  "unless": ["जब तक नहीं", "ਜਦ ਤੱਕ ਨਹੀਂ"],
  "taking": ["लेने पर", "ਲੈਣ ਤੇ"],
  "equivalent": ["समतुल्य", "ਬਰਾਬਰ"],
  "orientation": ["क्रम", "ਕ੍ਰਮ"],
  "combine": ["मिलाएँ", "ਮਿਲਾਓ"],
  "share": ["साझा करते हैं", "ਸਾਂਝਾ ਕਰਦੇ ਹਨ"],
  "reconstructed": ["पुनर्निर्मित", "ਮੁੜ ਬਣਾਇਆ"],
  "fixed": ["निश्चित", "ਨਿਸ਼ਚਿਤ"],
  "knowing": ["जानने के बिना", "ਜਾਣੇ ਬਿਨਾਂ"],
  "mechanically": ["यांत्रिक रूप से", "ਯਾਂਤ੍ਰਿਕ ਤੌਰ ਤੇ"],
  "get": ["प्राप्त करें", "ਪ੍ਰਾਪਤ ਕਰੋ"],
  "isolates": ["अलग कर देता है", "ਵੱਖ ਕਰ ਦਿੰਦਾ ਹੈ"],
  "known": ["ज्ञात", "ਜਾਣੇ ਹੋਏ"],
  "moving": ["बदलते समय", "ਬਦਲਦੇ ਵੇਲੇ"],
  "select": ["चुनें", "ਚੁਣੋ"],
  "choose": ["चुनें", "ਚੁਣੋ"],
  "carrying": ["जिस पर", "ਜਿਸ ਉੱਤੇ"],
  "fundamental": ["मूल", "ਮੂਲ"],
  "bracket": ["कोष्ठक", "ਕੌਂਸ"],
  "single": ["एक ही", "ਇੱਕੋ"],
  "brackets": ["कोष्ठक", "ਕੌਂਸਾਂ"],
  "express": ["व्यक्त करें", "ਲਿਖੋ"],
  "drop": ["छोड़ें", "ਛੱਡੋ"],
  "fourth": ["चौथी", "ਚੌਥੀ"],
  "stopping": ["रुकने पर", "ਰੁਕਣ ਤੇ"],
  "misses": ["छूट जाता है", "ਛੁੱਟ ਜਾਂਦਾ ਹੈ"],
  "more": ["और", "ਹੋਰ"],
  "surds": ["करनियों", "ਕਰਨੀਆਂ"],
  "minus": ["ऋण", "ਘਟਾਓ"],
  "rationalizing": ["परिमेयकरण करने पर", "ਪਰਿਮੇਯਕਰਨ ਕਰਨ ਤੇ"],
  "above": ["से अधिक", "ਤੋਂ ਵੱਧ"],
  "reduces": ["सरल हो जाता है", "ਸਰਲ ਹੋ ਜਾਂਦਾ ਹੈ"],
  "total": ["कुल", "ਕੁੱਲ"],
  "multiplies": ["गुणा होकर", "ਗੁਣਾ ਹੋ ਕੇ"],
  "forget": ["न भूलें", "ਨਾ ਭੁੱਲੋ"],
  "them": ["इनका", "ਇਨ੍ਹਾਂ ਨੂੰ"],
  "individually": ["अलग-अलग", "ਵੱਖ-ਵੱਖ"],
  "rather": ["बजाय", "ਦੀ ਬਜਾਏ"],
  "than": ["के", "ਤੋਂ"],
  "compute": ["गणना करें", "ਗਣਨਾ ਕਰੋ"],
  "attain": ["प्राप्त कर सकते", "ਪ੍ਰਾਪਤ ਕਰ ਸਕਦੇ"],
  "amplitude": ["आयाम", "ਐਂਪਲੀਟਿਊਡ"],
  "solving": ["हल करने पर", "ਹੱਲ ਕਰਨ ਤੇ"],
  "supplementary": ["सम्पूरक", "ਸੰਪੂਰਕ"],
  "alternative": ["विकल्प", "ਵਿਕਲਪ"],
  "over": ["के ऊपर", "ਦੇ ਉੱਪਰ"],
  "creates": ["बनाता है", "ਬਣਾਉਂਦਾ ਹੈ"],
  "matches": ["मेल खाता है", "ਮਿਲਦਾ ਹੈ"],
  "inside": ["के अंदर", "ਦੇ ਅੰਦਰ"]
};

function nativePostNormalize(text: string, locale: Trg001LocalizedLocale) {
  if (locale === "hi-IN") {
    return text
      .replace(/^में (समकोण त्रिभुज [A-Z]{2,4}),/u, "$1 में,")
      .replace(/^के लिए न्यूनकोण ([^,]+),/u, "न्यूनकोण $1 के लिए,")
      .replace(/^के लिए वास्तविक ([^,]+),/u, "वास्तविक $1 के लिए,")
      .replace(/समकोण कोण/g, "समकोण")
      .replace(/कौन-सा भुजा/g, "कौन-सी भुजा")
      .replace(/सटा हुआ भुजा/g, "सटी हुई भुजा")
      .replace(/सामने भुजा/g, "सामने वाली भुजा")
      .replace(/न करें\s+न कहें/g, "न कहें")
      .replace(/न करें\s+([\p{L}-]+) करें/gu, "$1 न करें")
      .replace(/के संदर्भ में कोण ([A-Z])/g, "कोण $1 के संदर्भ में")
      .replace(/के संदर्भ में ([A-Z]),/g, "$1 के संदर्भ में,")
      .replace(/([A-Z]{1,3}) है कर्ण/g, "$1 कर्ण है")
      .replace(/यह है सामने समकोण/g, "यह समकोण के सामने है")
      .replace(/भुजा सामने ([A-Z]) है ([A-Z]{2})/g, "$1 के सामने वाली भुजा $2 है")
      .replace(/\bमें a\b/gi, "एक")
      .replace(/\bका a\b/gi, "का एक")
      .replace(/\bके साथ a\b/gi, "के साथ एक")
      .replace(/\ba\s+(?=[\u0900-\u097F])/g, "एक ")
      .replace(/क्या है ([^?]+)\?/g, "$1 का मान क्या है?")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  return text
    .replace(/^ਵਿੱਚ (ਸਮਕੋਣ ਤਿਕੋਣ [A-Z]{2,4}),/u, "$1 ਵਿੱਚ,")
    .replace(/^ਲਈ ਨਿਊਨ ਕੋਣ ([^,]+),/u, "ਨਿਊਨ ਕੋਣ $1 ਲਈ,")
    .replace(/^ਲਈ ਵਾਸਤਵਿਕ ([^,]+),/u, "ਵਾਸਤਵਿਕ $1 ਲਈ,")
    .replace(/ਸਮਕੋਣ ਕੋਣ/g, "ਸਮਕੋਣ")
    .replace(/ਕਿਹੜਾ ਭੁਜਾ/g, "ਕਿਹੜੀ ਭੁਜਾ")
    .replace(/ਲੱਗਦਾ ਭੁਜਾ/g, "ਲੱਗਦੀ ਭੁਜਾ")
    .replace(/ਸਾਹਮਣੇ ਭੁਜਾ/g, "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ")
    .replace(/ਨਾ ਕਰੋ\s+ਨਾ ਕਹੋ/g, "ਨਾ ਕਹੋ")
    .replace(/ਨਾ ਕਰੋ\s+([\p{L}-]+) ਕਰੋ/gu, "$1 ਨਾ ਕਰੋ")
    .replace(/ਦੇ ਸਬੰਧ ਵਿੱਚ ਕੋਣ ([A-Z])/g, "ਕੋਣ $1 ਦੇ ਸਬੰਧ ਵਿੱਚ")
    .replace(/ਦੇ ਸਬੰਧ ਵਿੱਚ ([A-Z]),/g, "$1 ਦੇ ਸਬੰਧ ਵਿੱਚ,")
    .replace(/([A-Z]{1,3}) ਹੈ ਕਰਣ/g, "$1 ਕਰਣ ਹੈ")
    .replace(/ਇਹ ਹੈ ਸਾਹਮਣੇ ਸਮਕੋਣ/g, "ਇਹ ਸਮਕੋਣ ਦੇ ਸਾਹਮਣੇ ਹੈ")
    .replace(/ਭੁਜਾ ਸਾਹਮਣੇ ([A-Z]) ਹੈ ([A-Z]{2})/g, "$1 ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ $2 ਹੈ")
    .replace(/\bਵਿੱਚ a\b/gi, "ਇੱਕ")
    .replace(/\bਦਾ a\b/gi, "ਦਾ ਇੱਕ")
    .replace(/\bਨਾਲ a\b/gi, "ਨਾਲ ਇੱਕ")
    .replace(/\ba\s+(?=[\u0A00-\u0A7F])/g, "ਇੱਕ ")
    .replace(/ਕੀ ਹੈ ([^?]+)\?/g, "$1 ਦਾ ਮਾਨ ਕੀ ਹੈ?")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function editorializeTrg001LocalizedSurface(input: unknown, locale: Trg001LocalizedLocale) {
  let text = String(input ?? "");
  for (const [source, pair] of [...EDITORIAL_PHRASES].sort((a, b) => b[0].length - a[0].length)) {
    text = text.replace(new RegExp(escapeRegExp(source), "gi"), native(locale, pair));
  }
  for (const [source, pair] of Object.entries(EDITORIAL_WORDS).sort((a, b) => b[0].length - a[0].length)) {
    text = text.replace(new RegExp(`\\b${escapeRegExp(source)}\\b`, "gi"), native(locale, pair));
  }
  text = text
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
  return nativePostNormalize(text, locale);
}

function mapExplanation(explanation: AnyQuestion, locale: Trg001LocalizedLocale) {
  return {
    ...explanation,
    keyRule: editorializeTrg001LocalizedSurface(explanation?.keyRule ?? "", locale),
    steps: (explanation?.steps ?? []).map((step: AnyQuestion) => ({
      ...step,
      title: editorializeTrg001LocalizedSurface(step?.title ?? "", locale),
      body: editorializeTrg001LocalizedSurface(step?.body ?? "", locale),
      ...(step?.equation ? { equation: step.equation } : {}),
    })),
    shortcut: editorializeTrg001LocalizedSurface(explanation?.shortcut ?? "", locale),
    traps: (explanation?.traps ?? []).map((trap: unknown) => editorializeTrg001LocalizedSurface(trap, locale)),
  };
}

function permittedMathToken(token: string) {
  if (/^(?:sin|cos|tan|cot|sec|cosec)$/iu.test(token)) return true;
  if (/^(?:sin|cos|tan|cot|sec|cosec)[A-Za-z]$/iu.test(token)) return true;
  if (/^[A-Z]{1,4}$/u.test(token)) return true;
  if (/^[a-z]$/u.test(token)) return true;
  if (/^(?:ab|bc|ac|pr|pq|qr|abc|pqr)$/iu.test(token)) return true;
  return false;
}

export function trg001ResidualEnglishTokens(value: unknown) {
  return (String(value ?? "").match(/[A-Za-z][A-Za-z'-]*/g) ?? [])
    .filter((token) => !permittedMathToken(token));
}

export function localizeFrozenTrg001QuestionEditorialV2(canonicalQuestion: AnyQuestion, locale: Trg001LocalizedLocale) {
  const v1 = localizeFrozenTrg001Question(canonicalQuestion, locale) as AnyQuestion;
  const stem = editorializeTrg001LocalizedSurface(v1.stem, locale);
  const explanation = mapExplanation(v1.explanation, locale);
  const options = v1.options.map((option: AnyQuestion) => ({
    ...option,
    display: editorializeTrg001LocalizedSurface(option.display, locale),
  }));
  const localizedAnswerDisplay = editorializeTrg001LocalizedSurface(v1.localizedAnswerDisplay, locale);
  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(v1);
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_EDITORIAL_VERSION,
    locale,
    qlId: v1.qlId,
    seed: v1.seed,
    canonicalSemanticFingerprint,
    stem,
    explanation,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
    localizedAnswerDisplay,
  });

  return {
    ...v1,
    stem,
    explanation,
    options,
    localizedAnswerDisplay,
    reviewStatus: "LOCALIZATION_EDITORIAL_REVIEW_CANDIDATE_V2" as const,
    humanReviewStatus: "PENDING" as const,
    frozen: false,
    freezeEligible: false,
    freezeStatus: "NOT_FROZEN" as const,
    activationAuthorized: false,
    questionStudioDiscoverable: false,
    questionBankStatus: "NOT_STORED" as const,
    testEligibility: "INELIGIBLE" as const,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    localizationLifecycle: {
      ...v1.localizationLifecycle,
      version: TRG_001_LOCALIZATION_EDITORIAL_VERSION,
      hindiPunjabi: "EDITORIAL_REVIEW_CANDIDATE_V2" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      ...v1.localizationProof,
      authority: `${TRG_001_LOCALIZATION_AUTHORITY}+EDITORIAL_V2`,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      semanticParity: "CANONICAL_SEMANTICS_PRESERVED" as const,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_NATIVE_EDITORIAL_V2_OVERLAY" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001QuestionEditorialV2(
  qlId: string,
  seed: string,
  locale: Trg001LocalizedLocale,
) {
  if (!TRG_001_LOCALIZATION_QL_IDS.includes(qlId)) {
    throw new Error(`${qlId}: outside TRG-001 localization scope.`);
  }
  return localizeFrozenTrg001QuestionEditorialV2(
    generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion,
    locale,
  );
}
