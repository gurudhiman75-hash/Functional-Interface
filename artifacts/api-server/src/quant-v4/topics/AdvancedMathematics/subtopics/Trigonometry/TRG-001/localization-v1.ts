import { createHash } from "node:crypto";

import { TRG_001_AUTHORITY_ALIGNED_IDS } from "./production-authority-runtime";
import {
  TRG_001_FREEZE,
  generateHumanApprovedTrg001Question,
} from "./production-human-approved-runtime";

export const TRG_001_LOCALIZATION_VERSION = "TRG001_HI_PA_LOCALIZATION_V1" as const;
export const TRG_001_LOCALIZATION_AUTHORITY = "FROZEN_ENGLISH_144_PRESENTATION_OVERLAY_V1" as const;
export const TRG_001_LOCALIZATION_QL_IDS = [...TRG_001_AUTHORITY_ALIGNED_IDS] as readonly string[];
export const TRG_001_LOCALIZATION_LOCALES = ["hi-IN", "pa-IN"] as const;
export type Trg001LocalizedLocale = typeof TRG_001_LOCALIZATION_LOCALES[number];

type AnyQuestion = Record<string, any>;
type TranslationPair = readonly [hi: string, pa: string];

function native(locale: Trg001LocalizedLocale, pair: TranslationPair) {
  return locale === "hi-IN" ? pair[0] : pair[1];
}

function stableJson(value: unknown) {
  return JSON.stringify(value, (_key, current) => typeof current === "bigint" ? `bigint:${current}` : current);
}

function sha256(value: unknown) {
  return createHash("sha256").update(typeof value === "string" ? value : stableJson(value), "utf8").digest("hex");
}

/**
 * Long phrases are intentionally translated before individual words. Trig
 * function names and symbolic expressions remain in their standard Latin
 * mathematical notation; the learner-facing prose is Hindi/Punjabi.
 */
const PHRASES: ReadonlyArray<readonly [string, TranslationPair]> = [
  ["Find the exact value of", ["का सटीक मान ज्ञात कीजिए", "ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ"]],
  ["find the exact value of", ["का सटीक मान ज्ञात कीजिए", "ਦਾ ਸਹੀ ਮਾਨ ਕੱਢੋ"]],
  ["Evaluate exactly:", ["सटीक मान ज्ञात कीजिए:", "ਸਹੀ ਮਾਨ ਕੱਢੋ:"]],
  ["Evaluate exactly", ["सटीक मान ज्ञात कीजिए", "ਸਹੀ ਮਾਨ ਕੱਢੋ"]],
  ["Simplify exactly:", ["सटीक रूप से सरल कीजिए:", "ਸਹੀ ਰੂਪ ਵਿੱਚ ਸਰਲ ਕਰੋ:"]],
  ["Simplify exactly", ["सटीक रूप से सरल कीजिए", "ਸਹੀ ਰੂਪ ਵਿੱਚ ਸਰਲ ਕਰੋ"]],
  ["Which expression is equivalent to", ["कौन-सा व्यंजक इसके समतुल्य है", "ਕਿਹੜਾ ਵਿਅੰਜਕ ਇਸਦੇ ਬਰਾਬਰ ਹੈ"]],
  ["Which expression is equal to", ["कौन-सा व्यंजक इसके बराबर है", "ਕਿਹੜਾ ਵਿਅੰਜਕ ਇਸਦੇ ਬਰਾਬਰ ਹੈ"]],
  ["Which statement is correct?", ["कौन-सा कथन सही है?", "ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?"]],
  ["which statement is correct?", ["कौन-सा कथन सही है?", "ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?"]],
  ["which pair of trigonometric functions is positive?", ["त्रिकोणमितीय फलनों का कौन-सा युग्म धनात्मक है?", "ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨਾਂ ਦੀ ਕਿਹੜੀ ਜੋੜੀ ਧਨਾਤਮਕ ਹੈ?"]],
  ["where all terms are defined", ["जहाँ सभी पद परिभाषित हैं", "ਜਿੱਥੇ ਸਾਰੇ ਪਦ ਪਰਿਭਾਸ਼ਿਤ ਹਨ"]],
  ["wherever it is defined", ["जहाँ भी यह परिभाषित है", "ਜਿੱਥੇ ਵੀ ਇਹ ਪਰਿਭਾਸ਼ਿਤ ਹੈ"]],
  ["and θ is acute", ["और θ न्यूनकोण है", "ਅਤੇ θ ਨਿਊਨ ਕੋਣ ਹੈ"]],
  ["If the included angle is acute", ["यदि अंतर्विष्ट कोण न्यूनकोण है", "ਜੇ ਸ਼ਾਮਲ ਕੋਣ ਨਿਊਨ ਕੋਣ ਹੈ"]],
  ["For an acute angle θ", ["न्यूनकोण θ के लिए", "ਨਿਊਨ ਕੋਣ θ ਲਈ"]],
  ["For real θ", ["वास्तविक θ के लिए", "ਵਾਸਤਵਿਕ θ ਲਈ"]],
  ["right triangle", ["समकोण त्रिभुज", "ਸਮਕੋਣ ਤਿਕੋਣ"]],
  ["Right triangle", ["समकोण त्रिभुज", "ਸਮਕੋਣ ਤਿਕੋਣ"]],
  ["the side adjacent to θ", ["θ से सटी भुजा", "θ ਨਾਲ ਲੱਗਦੀ ਭੁਜਾ"]],
  ["the side opposite θ", ["θ के सामने वाली भुजा", "θ ਦੇ ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"]],
  ["the adjacent side", ["सटी हुई भुजा", "ਲੱਗਦੀ ਭੁਜਾ"]],
  ["the opposite side", ["सामने वाली भुजा", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"]],
  ["adjacent side", ["सटी हुई भुजा", "ਲੱਗਦੀ ਭੁਜਾ"]],
  ["opposite side", ["सामने वाली भुजा", "ਸਾਹਮਣੇ ਵਾਲੀ ਭੁਜਾ"]],
  ["the hypotenuse", ["कर्ण", "ਕਰਣ"]],
  ["hypotenuse", ["कर्ण", "ਕਰਣ"]],
  ["perpendicular and base", ["लंब और आधार", "ਲੰਬ ਅਤੇ ਆਧਾਰ"]],
  ["perpendicular", ["लंब", "ਲੰਬ"]],
  ["square units", ["वर्ग इकाई", "ਵਰਗ ਇਕਾਈ"]],
  ["units", ["इकाई", "ਇਕਾਈ"]],
  ["in terms of π", ["π के रूप में", "π ਦੇ ਰੂਪ ਵਿੱਚ"]],
  ["to radians", ["रेडियन में", "ਰੇਡੀਅਨ ਵਿੱਚ"]],
  ["to degrees", ["डिग्री में", "ਡਿਗਰੀ ਵਿੱਚ"]],
  ["trigonometric functions", ["त्रिकोणमितीय फलन", "ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨ"]],
  ["trigonometric function", ["त्रिकोणमितीय फलन", "ਤਿਕੋਣਮਿਤੀ ਫੰਕਸ਼ਨ"]],
  ["reference angle", ["संदर्भ कोण", "ਹਵਾਲਾ ਕੋਣ"]],
  ["quadrant II", ["द्वितीय चतुर्थांश", "ਦੂਜਾ ਚਤੁਰਭਾਗ"]],
  ["quadrant III", ["तृतीय चतुर्थांश", "ਤੀਜਾ ਚਤੁਰਭਾਗ"]],
  ["quadrant IV", ["चतुर्थ चतुर्थांश", "ਚੌਥਾ ਚਤੁਰਭਾਗ"]],
  ["standard angle", ["मानक कोण", "ਮਿਆਰੀ ਕੋਣ"]],
  ["standard values", ["मानक मान", "ਮਿਆਰੀ ਮਾਨ"]],
  ["standard value", ["मानक मान", "ਮਿਆਰੀ ਮਾਨ"]],
  ["exact value", ["सटीक मान", "ਸਹੀ ਮਾਨ"]],
  ["exact result", ["सटीक परिणाम", "ਸਹੀ ਨਤੀਜਾ"]],
  ["Pythagorean identity", ["पाइथागोरस सर्वसमिका", "ਪਾਇਥਾਗੋਰਸ ਸਰਬਸਮਿਕਾ"]],
  ["cofunction relation", ["सहफलन संबंध", "ਸਹਿ-ਫੰਕਸ਼ਨ ਸੰਬੰਧ"]],
  ["reciprocal functions", ["व्युत्क्रम फलन", "ਪਰਸਪਰ ਫੰਕਸ਼ਨ"]],
  ["reciprocal function", ["व्युत्क्रम फलन", "ਪਰਸਪਰ ਫੰਕਸ਼ਨ"]],
  ["same angle", ["एक ही कोण", "ਇੱਕੋ ਕੋਣ"]],
  ["full turn", ["पूरा चक्कर", "ਪੂਰਾ ਚੱਕਰ"]],
  ["common denominator", ["समान हर", "ਸਾਂਝਾ ਹਰ"]],
  ["scale factor", ["माप गुणक", "ਸਕੇਲ ਗੁਣਕ"]],
  ["ratio-parts", ["अनुपात-भाग", "ਅਨੁਪਾਤ-ਭਾਗ"]],
  ["ratio side", ["अनुपात वाली भुजा", "ਅਨੁਪਾਤ ਵਾਲੀ ਭੁਜਾ"]],
  ["included angle", ["अंतर्विष्ट कोण", "ਸ਼ਾਮਲ ਕੋਣ"]],
  ["maximum value", ["अधिकतम मान", "ਵੱਧ ਤੋਂ ਵੱਧ ਮਾਨ"]],
  ["minimum value", ["न्यूनतम मान", "ਘੱਟ ਤੋਂ ਘੱਟ ਮਾਨ"]],
  ["positive standard-angle solution", ["धनात्मक मानक-कोण हल", "ਧਨਾਤਮਕ ਮਿਆਰੀ-ਕੋਣ ਹੱਲ"]],
  ["acute standard angle", ["न्यून मानक कोण", "ਨਿਊਨ ਮਿਆਰੀ ਕੋਣ"]],
  ["acute-angle condition", ["न्यूनकोण की शर्त", "ਨਿਊਨ ਕੋਣ ਦੀ ਸ਼ਰਤ"]],
  ["acute interval", ["न्यूनकोण अंतराल", "ਨਿਊਨ ਕੋਣ ਅੰਤਰਾਲ"]],
  ["given relation", ["दिया गया संबंध", "ਦਿੱਤਾ ਸੰਬੰਧ"]],
  ["given difference", ["दिया गया अंतर", "ਦਿੱਤਾ ਅੰਤਰ"]],
  ["given sum", ["दिया गया योग", "ਦਿੱਤਾ ਜੋੜ"]],
  ["given area", ["दिया गया क्षेत्रफल", "ਦਿੱਤਾ ਖੇਤਰਫਲ"]],
  ["given value", ["दिया गया मान", "ਦਿੱਤਾ ਮਾਨ"]],
  ["given ratio", ["दिया गया अनुपात", "ਦਿੱਤਾ ਅਨੁਪਾਤ"]],
  ["The expression is", ["व्यंजक है", "ਵਿਅੰਜਕ ਹੈ"]],
  ["the expression is", ["व्यंजक है", "ਵਿਅੰਜਕ ਹੈ"]],
  ["The required ratio is", ["आवश्यक अनुपात है", "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਹੈ"]],
  ["the required ratio is", ["आवश्यक अनुपात है", "ਲੋੜੀਂਦਾ ਅਨੁਪਾਤ ਹੈ"]],
  ["The exact result is", ["सटीक परिणाम है", "ਸਹੀ ਨਤੀਜਾ ਹੈ"]],
  ["The exact value is", ["सटीक मान है", "ਸਹੀ ਮਾਨ ਹੈ"]],
  ["the exact value is", ["सटीक मान है", "ਸਹੀ ਮਾਨ ਹੈ"]],
  ["the value is", ["मान है", "ਮਾਨ ਹੈ"]],
  ["The value is", ["मान है", "ਮਾਨ ਹੈ"]],
  ["the result is", ["परिणाम है", "ਨਤੀਜਾ ਹੈ"]],
  ["The result is", ["परिणाम है", "ਨਤੀਜਾ ਹੈ"]],
  ["is undefined", ["अपरिभाषित है", "ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ"]],
  ["cannot be determined", ["निर्धारित नहीं किया जा सकता", "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ"]],
  ["All six functions", ["सभी छह फलन", "ਸਾਰੇ ਛੇ ਫੰਕਸ਼ਨ"]],
  ["Undefined", ["अपरिभाषित", "ਅਪਰਿਭਾਸ਼ਿਤ"]],
  ["undefined", ["अपरिभाषित", "ਅਪਰਿਭਾਸ਼ਿਤ"]],
];

const WORDS: Readonly<Record<string, TranslationPair>> = {
  "If": ["यदि", "ਜੇ"], "if": ["यदि", "ਜੇ"],
  "find": ["ज्ञात कीजिए", "ਕੱਢੋ"], "Find": ["ज्ञात कीजिए", "ਕੱਢੋ"],
  "evaluate": ["मान ज्ञात कीजिए", "ਮਾਨ ਕੱਢੋ"], "Evaluate": ["मान ज्ञात कीजिए", "ਮਾਨ ਕੱਢੋ"],
  "simplify": ["सरल कीजिए", "ਸਰਲ ਕਰੋ"], "Simplify": ["सरल कीजिए", "ਸਰਲ ਕਰੋ"],
  "use": ["प्रयोग करें", "ਵਰਤੋ"], "Use": ["प्रयोग करें", "ਵਰਤੋ"],
  "using": ["प्रयोग करके", "ਵਰਤ ਕੇ"], "Using": ["प्रयोग करके", "ਵਰਤ ਕੇ"],
  "take": ["मान लें", "ਮੰਨੋ"], "Take": ["मान लें", "ਮੰਨੋ"],
  "therefore": ["अतः", "ਇਸ ਲਈ"], "Therefore": ["अतः", "ਇਸ ਲਈ"],
  "thus": ["अतः", "ਇਸ ਲਈ"], "Thus": ["अतः", "ਇਸ ਲਈ"],
  "hence": ["अतः", "ਇਸ ਲਈ"], "Hence": ["अतः", "ਇਸ ਲਈ"],
  "so": ["इसलिए", "ਇਸ ਲਈ"], "So": ["इसलिए", "ਇਸ ਲਈ"],
  "then": ["तब", "ਤਦ"], "Then": ["तब", "ਤਦ"],
  "first": ["पहले", "ਪਹਿਲਾਂ"], "First": ["पहले", "ਪਹਿਲਾਂ"],
  "before": ["पहले", "ਪਹਿਲਾਂ"], "Before": ["पहले", "ਪਹਿਲਾਂ"],
  "after": ["बाद", "ਬਾਅਦ"], "After": ["बाद", "ਬਾਅਦ"],
  "from": ["से", "ਤੋਂ"], "From": ["से", "ਤੋਂ"],
  "with": ["के साथ", "ਨਾਲ"], "With": ["के साथ", "ਨਾਲ"],
  "without": ["बिना", "ਬਿਨਾਂ"], "Without": ["बिना", "ਬਿਨਾਂ"],
  "and": ["और", "ਅਤੇ"], "And": ["और", "ਅਤੇ"],
  "or": ["या", "ਜਾਂ"], "Or": ["या", "ਜਾਂ"],
  "where": ["जहाँ", "ਜਿੱਥੇ"], "Where": ["जहाँ", "ਜਿੱਥੇ"],
  "because": ["क्योंकि", "ਕਿਉਂਕਿ"], "Because": ["क्योंकि", "ਕਿਉਂਕਿ"],
  "which": ["कौन-सा", "ਕਿਹੜਾ"], "Which": ["कौन-सा", "ਕਿਹੜਾ"],
  "correct": ["सही", "ਸਹੀ"], "positive": ["धनात्मक", "ਧਨਾਤਮਕ"], "negative": ["ऋणात्मक", "ਰਿਣਾਤਮਕ"],
  "angle": ["कोण", "ਕੋਣ"], "angles": ["कोण", "ਕੋਣ"], "acute": ["न्यूनकोण", "ਨਿਊਨ ਕੋਣ"],
  "triangle": ["त्रिभुज", "ਤਿਕੋਣ"], "sides": ["भुजाएँ", "ਭੁਜਾਵਾਂ"], "side": ["भुजा", "ਭੁਜਾ"],
  "base": ["आधार", "ਆਧਾਰ"], "area": ["क्षेत्रफल", "ਖੇਤਰਫਲ"],
  "value": ["मान", "ਮਾਨ"], "values": ["मान", "ਮਾਨ"], "result": ["परिणाम", "ਨਤੀਜਾ"],
  "expression": ["व्यंजक", "ਵਿਅੰਜਕ"], "expressions": ["व्यंजक", "ਵਿਅੰਜਕ"],
  "identity": ["सर्वसमिका", "ਸਰਬਸਮਿਕਾ"], "identities": ["सर्वसमिकाएँ", "ਸਰਬਸਮਿਕਾਵਾਂ"],
  "relation": ["संबंध", "ਸੰਬੰਧ"], "relations": ["संबंध", "ਸੰਬੰਧ"], "equation": ["समीकरण", "ਸਮੀਕਰਨ"], "equations": ["समीकरण", "ਸਮੀਕਰਨ"],
  "ratio": ["अनुपात", "ਅਨੁਪਾਤ"], "ratios": ["अनुपात", "ਅਨੁਪਾਤ"],
  "sum": ["योग", "ਜੋੜ"], "difference": ["अंतर", "ਅੰਤਰ"], "product": ["गुणनफल", "ਗੁਣਨਫਲ"], "quotient": ["भागफल", "ਭਾਗਫਲ"],
  "numerator": ["अंश", "ਅੰਸ਼"], "denominator": ["हर", "ਹਰ"],
  "square": ["वर्ग", "ਵਰਗ"], "squared": ["वर्ग", "ਵਰਗ"], "squaring": ["वर्ग करने पर", "ਵਰਗ ਕਰਨ ਤੇ"],
  "add": ["जोड़ें", "ਜੋੜੋ"], "adding": ["जोड़ने पर", "ਜੋੜਨ ਤੇ"], "subtract": ["घटाएँ", "ਘਟਾਓ"], "subtracting": ["घटाने पर", "ਘਟਾਉਣ ਤੇ"],
  "multiply": ["गुणा करें", "ਗੁਣਾ ਕਰੋ"], "dividing": ["भाग देने पर", "ਭਾਗ ਦੇਣ ਤੇ"], "divide": ["भाग दें", "ਭਾਗ ਦਿਓ"],
  "replace": ["प्रतिस्थापित करें", "ਬਦਲੋ"], "replacing": ["प्रतिस्थापित करने पर", "ਬਦਲਣ ਤੇ"],
  "substitute": ["मान रखें", "ਮਾਨ ਰੱਖੋ"], "substituting": ["मान रखने पर", "ਮਾਨ ਰੱਖਣ ਤੇ"],
  "reduce": ["घटाकर सरल करें", "ਘਟਾ ਕੇ ਸਰਲ ਕਰੋ"], "reducing": ["सरल करने पर", "ਸਰਲ ਕਰਨ ਤੇ"],
  "simplification": ["सरलीकरण", "ਸਰਲੀਕਰਨ"], "simplifying": ["सरल करने पर", "ਸਰਲ ਕਰਨ ਤੇ"],
  "convert": ["बदलिए", "ਬਦਲੋ"], "Convert": ["बदलिए", "ਬਦਲੋ"], "conversion": ["रूपांतरण", "ਰੂਪਾਂਤਰਨ"],
  "degrees": ["डिग्री", "ਡਿਗਰੀ"], "degree": ["डिग्री", "ਡਿਗਰੀ"], "radians": ["रेडियन", "ਰੇਡੀਅਨ"], "radian": ["रेडियन", "ਰੇਡੀਅਨ"],
  "quadrant": ["चतुर्थांश", "ਚਤੁਰਭਾਗ"], "sign": ["चिह्न", "ਚਿੰਨ੍ਹ"], "magnitude": ["परिमाण", "ਪਰਿਮਾਣ"],
  "reciprocal": ["व्युत्क्रम", "ਪਰਸਪਰ"], "reciprocals": ["व्युत्क्रम", "ਪਰਸਪਰ"],
  "function": ["फलन", "ਫੰਕਸ਼ਨ"], "functions": ["फलन", "ਫੰਕਸ਼ਨ"],
  "defined": ["परिभाषित", "ਪਰਿਭਾਸ਼ਿਤ"], "zero": ["शून्य", "ਸਿਫ਼ਰ"],
  "equal": ["बराबर", "ਬਰਾਬਰ"], "equals": ["बराबर है", "ਬਰਾਬਰ ਹੈ"],
  "same": ["समान", "ਇੱਕੋ"], "different": ["भिन्न", "ਵੱਖਰਾ"],
  "greater": ["अधिक", "ਵੱਧ"], "less": ["कम", "ਘੱਟ"],
  "denominators": ["हर", "ਹਰ"], "numerators": ["अंश", "ਅੰਸ਼"],
  "common": ["समान", "ਸਾਂਝਾ"], "factor": ["गुणक", "ਗੁਣਕ"],
  "corresponding": ["संबंधित", "ਸੰਬੰਧਿਤ"], "proportional": ["समानुपाती", "ਸਮਾਨੁਪਾਤੀ"],
  "possible": ["संभव", "ਸੰਭਵ"], "range": ["परास", "ਪਰਾਸ"],
  "minimum": ["न्यूनतम", "ਘੱਟ ਤੋਂ ਘੱਟ"], "maximum": ["अधिकतम", "ਵੱਧ ਤੋਂ ਵੱਧ"],
  "solution": ["हल", "ਹੱਲ"], "branch": ["शाखा", "ਸ਼ਾਖਾ"], "condition": ["शर्त", "ਸ਼ਰਤ"],
  "term": ["पद", "ਪਦ"], "terms": ["पद", "ਪਦ"],
  "theorem": ["प्रमेय", "ਪ੍ਰਮੇਯ"], "formula": ["सूत्र", "ਸੂਤਰ"],
  "opposite": ["सामने", "ਸਾਹਮਣੇ"], "adjacent": ["सटा हुआ", "ਲੱਗਦਾ"],
};

function translateSurface(input: unknown, locale: Trg001LocalizedLocale) {
  let text = String(input ?? "");
  for (const [source, pair] of PHRASES) text = text.split(source).join(native(locale, pair));
  for (const [source, pair] of Object.entries(WORDS)) {
    text = text.replace(new RegExp(`\\b${source}\\b`, "gi"), native(locale, pair));
  }
  return text
    .replace(/\s+([.,;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function localizeExplanation(explanation: AnyQuestion, locale: Trg001LocalizedLocale) {
  const stepWord = native(locale, ["चरण", "ਕਦਮ"]);
  return {
    keyRule: translateSurface(explanation?.keyRule ?? "", locale),
    steps: (explanation?.steps ?? []).map((step: AnyQuestion, index: number) => ({
      title: `${stepWord} ${index + 1}`,
      body: translateSurface(step?.body ?? "", locale),
    })),
    shortcut: translateSurface(explanation?.shortcut ?? "", locale),
    traps: (explanation?.traps ?? []).map((trap: unknown) => translateSurface(trap, locale)),
  };
}

function localizeOptionDisplay(display: unknown, locale: Trg001LocalizedLocale) {
  const text = String(display ?? "");
  if (!/[A-Za-z]/.test(text)) return text;
  return translateSurface(text, locale);
}

function semanticOptionProjection(question: AnyQuestion) {
  return (question.options ?? []).map((option: AnyQuestion) => ({
    value: option.value,
    isCorrect: option.isCorrect,
    misconceptionId: option.misconceptionId,
  }));
}

export function trg001CanonicalSemanticFingerprint(question: AnyQuestion) {
  return sha256({
    packageId: question.packageId,
    cpId: question.cpId,
    qlId: question.qlId,
    seed: question.seed,
    lockedFamily: question.lockedFamily,
    solveMode: question.solveMode,
    difficulty: question.difficulty,
    target: question.target,
    exactAnswer: question.exactAnswer,
    answer: question.answer,
    options: semanticOptionProjection(question),
    correctIndex: question.correctIndex,
    canonicalState: question.canonicalState,
    verification: question.verification,
  });
}

function localizedCorrectDisplay(canonicalQuestion: AnyQuestion, localizedOptions: AnyQuestion[]) {
  const option = localizedOptions[canonicalQuestion.correctIndex];
  return option?.display ?? canonicalQuestion.answer;
}

export function localizeFrozenTrg001Question(canonicalQuestion: AnyQuestion, locale: Trg001LocalizedLocale) {
  if (!TRG_001_LOCALIZATION_QL_IDS.includes(canonicalQuestion.qlId)) {
    throw new Error(`${canonicalQuestion.qlId}: outside TRG-001 localization scope.`);
  }
  if (canonicalQuestion.freezeStatus !== "FROZEN" || canonicalQuestion.frozen !== true) {
    throw new Error(`${canonicalQuestion.qlId}: localization source must be the frozen English authority.`);
  }

  const canonicalSemanticFingerprint = trg001CanonicalSemanticFingerprint(canonicalQuestion);
  const stem = translateSurface(canonicalQuestion.stem, locale);
  const explanation = localizeExplanation(canonicalQuestion.explanation, locale);
  const options = canonicalQuestion.options.map((option: AnyQuestion) => ({
    ...option,
    display: localizeOptionDisplay(option.display, locale),
  }));
  const localizationFingerprint = sha256({
    version: TRG_001_LOCALIZATION_VERSION,
    locale,
    qlId: canonicalQuestion.qlId,
    seed: canonicalQuestion.seed,
    canonicalSemanticFingerprint,
    stem,
    explanation,
    optionDisplays: options.map((option: AnyQuestion) => option.display),
  });

  return {
    ...canonicalQuestion,
    language: locale === "hi-IN" ? "hi" : "pa",
    locale,
    stem,
    options,
    localizedAnswerDisplay: localizedCorrectDisplay(canonicalQuestion, options),
    explanation,
    reviewStatus: "LOCALIZATION_REVIEW_CANDIDATE_V1" as const,
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
      version: TRG_001_LOCALIZATION_VERSION,
      englishAuthority: "FROZEN_144" as const,
      englishAuthorityFingerprint: TRG_001_FREEZE.approvedContentFingerprint,
      hindiPunjabi: "REVIEW_CANDIDATE_V1" as const,
      humanLanguageReviewRequired: true,
      multilingualFreezeGranted: false,
      activationAuthorized: false,
      questionStudioEnabled: false,
      questionBankWritable: false,
      testBuilderEligible: false,
      productDeliveryUnlocked: false,
    },
    localizationProof: {
      authority: TRG_001_LOCALIZATION_AUTHORITY,
      canonicalSemanticFingerprint,
      localizationFingerprint,
      semanticParity: "CANONICAL_SEMANTICS_PRESERVED" as const,
      learnerSurfaceSource: "FROZEN_ENGLISH_144_WITH_DETERMINISTIC_NATIVE_PROSE_OVERLAY" as const,
      canonicalOutcomeSource: "TRG001_HUMAN_APPROVED_FROZEN_RUNTIME" as const,
      humanLanguageReviewRequired: true,
    },
  };
}

export function generateLocalizedTrg001Question(qlId: string, seed: string, locale: Trg001LocalizedLocale) {
  if (!TRG_001_LOCALIZATION_QL_IDS.includes(qlId)) throw new Error(`${qlId}: outside TRG-001 localization scope.`);
  return localizeFrozenTrg001Question(generateHumanApprovedTrg001Question(qlId, seed) as AnyQuestion, locale);
}

export function buildTrg001LocalizedReviewBank(locale: Trg001LocalizedLocale, seedsPerQl = 3) {
  return TRG_001_LOCALIZATION_QL_IDS.flatMap((qlId) =>
    Array.from({ length: seedsPerQl }, (_, index) => generateLocalizedTrg001Question(
      qlId,
      `trg001-localization-v1-${String(index + 1).padStart(2, "0")}`,
      locale,
    )),
  );
}
