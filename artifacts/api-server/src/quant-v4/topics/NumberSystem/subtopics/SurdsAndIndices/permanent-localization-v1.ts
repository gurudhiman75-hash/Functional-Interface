import type { SriDiscoveryQuestion, SriHumanExplanation } from "./discovery-types";
import { generateSriPermanentEnglishQuestionV1 } from "./permanent-runtime-v1";
import type { SriPermanentQlId } from "./permanent-allocation-v1";
import {
  localizeSriLearnerTextV1 as localizeSriLearnerTextNaturalV1,
  type SriLocalizedLocaleV1,
  type SriLocalizedLanguageV1,
  type SriLocalizedDiscoveryQuestionV1,
  type SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-natural-v1";

export type {
  SriLocalizedLocaleV1,
  SriLocalizedLanguageV1,
  SriLocalizedDiscoveryQuestionV1,
  SriPermanentLocalizedQuestionV1,
} from "./permanent-localization-natural-v1";

const LANGUAGE_BY_LOCALE: Record<SriLocalizedLocaleV1, SriLocalizedLanguageV1> = {
  "hi-IN": "Hindi",
  "pa-IN": "Punjabi",
};

const ZERO_EXPONENT_SENTENCE: Record<SriLocalizedLocaleV1, string> = {
  "hi-IN": "किसी भी शून्येतर संख्या की 0 घात 1 होती है।",
  "pa-IN": "ਕਿਸੇ ਵੀ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਸੰਖਿਆ ਦੀ 0 ਘਾਤ 1 ਹੁੰਦੀ ਹੈ।",
};

const CROSS_TERM_COMPARISON_SENTENCE: Record<SriLocalizedLocaleV1, string> = {
  "hi-IN": "दोनों धनात्मक व्यंजकों का वर्ग कीजिए। उनके परिमेय भाग समान हैं, इसलिए मिश्र पदों के सटीक गुणनफलों की तुलना कीजिए।",
  "pa-IN": "ਦੋਵੇਂ ਧਨਾਤਮਕ ਵਿਅੰਜਕਾਂ ਦਾ ਵਰਗ ਕਰੋ। ਉਨ੍ਹਾਂ ਦੇ ਪਰਿਮੇਯ ਭਾਗ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਮਿਸ਼ਰਤ ਪਦਾਂ ਦੇ ਸਟੀਕ ਗੁਣਨਫਲਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
};

const EXACT_SENTENCES: Record<SriLocalizedLocaleV1, Readonly<Record<string, string>>> = {
  "hi-IN": {
    "Simplify the index expression using the applicable law.": "उपयुक्त घातांक नियम का उपयोग करके व्यंजक को सरल कीजिए।",
    "Evaluate the index expression exactly over the real numbers.": "वास्तविक संख्याओं में घातांक व्यंजक का सटीक मान ज्ञात कीजिए।",
    "Rewrite the bases into a common structure and simplify exactly.": "आधारों को समान आधार के रूप में लिखकर सटीक रूप से सरल कीजिए।",
    "Use the supplied power relation to recover the requested exact quantity.": "दिए गए घात संबंध का उपयोग करके पूछी गई राशि का सटीक मान ज्ञात कीजिए।",
    "Compare the quantities exactly using index laws.": "घातांक नियमों का उपयोग करके राशियों की सटीक तुलना कीजिए।",
    "Simplify or classify the radical exactly.": "करणी को सटीक रूप से सरल कीजिए या उसका वर्गीकरण कीजिए।",
    "Simplify the surd expression exactly.": "करणी व्यंजक को सटीक रूप से सरल कीजिए।",
    "Rationalise the denominator and simplify exactly.": "हर का परिमेयकरण करके सटीक रूप से सरल कीजिए।",
    "Simplify the nested surd exactly.": "संयुक्त करणी को सटीक रूप से सरल करणी रूप में लिखिए।",
    "Evaluate the expression exactly.": "व्यंजक का सटीक मान ज्ञात कीजिए।",
    "Classify it as rational or a surd.": "निर्धारित कीजिए कि यह परिमेय है या करणी।",
    "Find the condition forced by the equality.": "समानता से आवश्यक होने वाली शर्त ज्ञात कीजिए।",
    "Compare the two expressions exactly.": "दोनों व्यंजकों की सटीक तुलना कीजिए।",
    "Identify the candidate that fails the original radical equation.": "उस मान की पहचान कीजिए जो मूल करणी समीकरण को संतुष्ट नहीं करता।",
    "Evaluate the fractional-index expression through its radical form.": "करणी रूप का उपयोग करके भिन्नात्मक घातांक व्यंजक का मान ज्ञात कीजिए।",
    "Arrange all three powers in increasing order.": "तीनों घातों को आरोही क्रम में लगाइए।",
    "Choose the one statement that is mathematically valid.": "एकमात्र गणितीय रूप से सही कथन चुनिए।",
    "Select the correct law of indices.": "सही घातांक नियम चुनिए।",
    "Which statement is valid under its stated domain?": "अपने दिए गए परिभाषा-क्षेत्र में कौन-सा कथन सही है?",
    "Identify the true index-law statement.": "सही घातांक-नियम वाला कथन पहचानिए।",
    "Which of the following statements about indices is true?": "घातांकों के बारे में निम्नलिखित में से कौन-सा कथन सत्य है?",
    "Determine the truth value of each statement independently.": "प्रत्येक कथन की सत्यता अलग-अलग निर्धारित कीजिए।",
    "Both I and II are true": "I और II दोनों सत्य हैं",
    "Only I is true": "केवल I सत्य है",
    "Only II is true": "केवल II सत्य है",
    "Both I and II are false": "I और II दोनों असत्य हैं",
    "Normalize both quantities to powers of the same base and compare the exact exponents.": "दोनों राशियों को समान आधार की घातों में बदलकर सटीक घातांकों की तुलना कीजिए।",
    "Same-base multiplication adds exponents.": "समान आधार वाली घातों के गुणा में घातांक जुड़ते हैं।",
    "Same-base division subtracts exponents.": "समान आधार वाली घातों के भाग में घातांक घटते हैं।",
    "A power raised to a power multiplies exponents.": "एक घात को दूसरी घात तक उठाने पर घातांकों का गुणा होता है।",
    "Every non-zero base raised to zero equals 1.": "प्रत्येक शून्येतर आधार की शून्य घात 1 होती है।",
    "A common integer exponent distributes over multiplication.": "समान पूर्णांक घातांक गुणनफल के प्रत्येक गुणनखंड पर लागू किया जा सकता है।",
    "Exponent addition applies to multiplication, not addition.": "घातांकों का जोड़ समान आधार वाली घातों के गुणा पर लागू होता है, साधारण जोड़ पर नहीं।",
    "For a non-zero base, a^0=1.": "शून्येतर आधार के लिए, a^0=1।",
    "Power-of-power multiplies exponents.": "घात की घात में घातांकों का गुणा होता है।",
    "Division subtracts exponents.": "भाग में घातांक घटते हैं।",
    "The square also contains the term 2ab.": "वर्ग के विस्तार में 2ab पद भी होता है।",
    "First convert the terminating decimal exponent exactly: -1.5 = -3/2.": "पहले समाप्त दशमलव घातांक को सटीक भिन्न में बदलिए: -1.5 = -3/2।",
    "Check zero-base edge conditions before applying ordinary index laws.": "सामान्य घातांक नियम लगाने से पहले शून्य आधार की विशेष स्थितियाँ जाँचिए।",
    "Negative exponent requires a non-zero base": "ऋणात्मक घातांक के लिए आधार शून्येतर होना आवश्यक है",
    "A negative exponent requires a non-zero base": "ऋणात्मक घातांक के लिए आधार शून्येतर होना आवश्यक है",
    "0^0 is undefined": "0^0 अपरिभाषित है",
    "A negative number": "एक ऋणात्मक संख्या",
    "Equal exponents allow the bases to be multiplied; the composite result can also be harmonised to the prime base.": "समान घातांक होने पर आधारों को गुणा किया जा सकता है; प्राप्त परिणाम को भी समान अभाज्य आधार की घात के रूप में लिखा जा सकता है।",
    "First recover the multiplier a^k from the ratio, then apply that multiplier once more.": "पहले अनुपात से गुणक a^k ज्ञात कीजिए, फिर उसी गुणक का एक बार और उपयोग कीजिए।",
    "Find the requested combination of the linked exponents.": "जुड़े हुए घातांकों का पूछा गया संयोजन ज्ञात कीजिए।",
    "Cannot be determined exactly": "सटीक रूप से निर्धारित नहीं किया जा सकता",
  },
  "pa-IN": {
    "Simplify the index expression using the applicable law.": "ਉਚਿਤ ਘਾਤਾਂਕ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਵਿਅੰਜਕ ਨੂੰ ਸਰਲ ਕਰੋ।",
    "Evaluate the index expression exactly over the real numbers.": "ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ਘਾਤਾਂਕ ਵਿਅੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Rewrite the bases into a common structure and simplify exactly.": "ਅਧਾਰਾਂ ਨੂੰ ਇੱਕੋ ਸਾਂਝੇ ਅਧਾਰ ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖ ਕੇ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।",
    "Use the supplied power relation to recover the requested exact quantity.": "ਦਿੱਤੇ ਘਾਤ ਸੰਬੰਧ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਪੁੱਛੀ ਗਈ ਰਾਸ਼ੀ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Compare the quantities exactly using index laws.": "ਘਾਤਾਂਕ ਨਿਯਮਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਰਾਸ਼ੀਆਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।",
    "Simplify or classify the radical exactly.": "ਕਰਣੀ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ ਜਾਂ ਇਸ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।",
    "Simplify the surd expression exactly.": "ਕਰਣੀ ਵਿਅੰਜਕ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।",
    "Rationalise the denominator and simplify exactly.": "ਹਰ ਦਾ ਪਰਿਮੇਯਕਰਨ ਕਰਕੇ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।",
    "Simplify the nested surd exactly.": "ਸੰਯੁਕਤ ਕਰਣੀ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।",
    "Evaluate the expression exactly.": "ਵਿਅੰਜਕ ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Classify it as rational or a surd.": "ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਇਹ ਪਰਿਮੇਯ ਹੈ ਜਾਂ ਕਰਣੀ।",
    "Find the condition forced by the equality.": "ਬਰਾਬਰੀ ਤੋਂ ਲਾਜ਼ਮੀ ਹੋਣ ਵਾਲੀ ਸ਼ਰਤ ਪਤਾ ਕਰੋ।",
    "Compare the two expressions exactly.": "ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦੀ ਸਟੀਕ ਤੁਲਨਾ ਕਰੋ।",
    "Identify the candidate that fails the original radical equation.": "ਉਸ ਮੁੱਲ ਦੀ ਪਛਾਣ ਕਰੋ ਜੋ ਮੂਲ ਕਰਣੀ ਸਮੀਕਰਨ ਨੂੰ ਪੂਰਾ ਨਹੀਂ ਕਰਦਾ।",
    "Evaluate the fractional-index expression through its radical form.": "ਕਰਣੀ ਰੂਪ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਵਿਅੰਜਕ ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।",
    "Arrange all three powers in increasing order.": "ਤਿੰਨਾਂ ਘਾਤਾਂ ਨੂੰ ਵੱਧਦੇ ਕ੍ਰਮ ਵਿੱਚ ਲਗਾਓ।",
    "Choose the one statement that is mathematically valid.": "ਇੱਕੋ ਗਣਿਤਕ ਤੌਰ ਤੇ ਸਹੀ ਕਥਨ ਚੁਣੋ।",
    "Select the correct law of indices.": "ਸਹੀ ਘਾਤਾਂਕ ਨਿਯਮ ਚੁਣੋ।",
    "Which statement is valid under its stated domain?": "ਆਪਣੇ ਦਿੱਤੇ ਪਰਿਭਾਸ਼ਾ-ਖੇਤਰ ਵਿੱਚ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?",
    "Identify the true index-law statement.": "ਸਹੀ ਘਾਤਾਂਕ-ਨਿਯਮ ਵਾਲੇ ਕਥਨ ਦੀ ਪਛਾਣ ਕਰੋ।",
    "Which of the following statements about indices is true?": "ਘਾਤਾਂਕਾਂ ਬਾਰੇ ਹੇਠ ਲਿਖਿਆਂ ਵਿੱਚੋਂ ਕਿਹੜਾ ਕਥਨ ਸੱਚ ਹੈ?",
    "Determine the truth value of each statement independently.": "ਹਰੇਕ ਕਥਨ ਦੀ ਸੱਚਾਈ ਵੱਖ-ਵੱਖ ਨਿਰਧਾਰਤ ਕਰੋ।",
    "Both I and II are true": "I ਅਤੇ II ਦੋਵੇਂ ਸੱਚ ਹਨ",
    "Only I is true": "ਕੇਵਲ I ਸੱਚ ਹੈ",
    "Only II is true": "ਕੇਵਲ II ਸੱਚ ਹੈ",
    "Both I and II are false": "I ਅਤੇ II ਦੋਵੇਂ ਝੂਠ ਹਨ",
    "Normalize both quantities to powers of the same base and compare the exact exponents.": "ਦੋਵੇਂ ਰਾਸ਼ੀਆਂ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਦੀਆਂ ਘਾਤਾਂ ਵਿੱਚ ਬਦਲ ਕੇ ਸਟੀਕ ਘਾਤਾਂਕਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    "Same-base multiplication adds exponents.": "ਇੱਕੋ ਅਧਾਰ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦੇ ਗੁਣਾ ਵਿੱਚ ਘਾਤਾਂਕ ਜੋੜੇ ਜਾਂਦੇ ਹਨ।",
    "Same-base division subtracts exponents.": "ਇੱਕੋ ਅਧਾਰ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦੇ ਭਾਗ ਵਿੱਚ ਘਾਤਾਂਕ ਘਟਾਏ ਜਾਂਦੇ ਹਨ।",
    "A power raised to a power multiplies exponents.": "ਇੱਕ ਘਾਤ ਨੂੰ ਹੋਰ ਘਾਤ ਤੱਕ ਚੁੱਕਣ ਤੇ ਘਾਤਾਂਕਾਂ ਦਾ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।",
    "Every non-zero base raised to zero equals 1.": "ਹਰੇਕ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਅਧਾਰ ਦੀ ਸਿਫ਼ਰ ਘਾਤ 1 ਹੁੰਦੀ ਹੈ।",
    "A common integer exponent distributes over multiplication.": "ਸਾਂਝਾ ਪੂਰਨ ਅੰਕ ਘਾਤਾਂਕ ਗੁਣਨਫਲ ਦੇ ਹਰੇਕ ਗੁਣਨਖੰਡ ਉੱਤੇ ਲਗਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
    "Exponent addition applies to multiplication, not addition.": "ਘਾਤਾਂਕਾਂ ਦਾ ਜੋੜ ਇੱਕੋ ਅਧਾਰ ਵਾਲੀਆਂ ਘਾਤਾਂ ਦੇ ਗੁਣਾ ਉੱਤੇ ਲਾਗੂ ਹੁੰਦਾ ਹੈ, ਸਧਾਰਣ ਜੋੜ ਉੱਤੇ ਨਹੀਂ।",
    "For a non-zero base, a^0=1.": "ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਅਧਾਰ ਲਈ, a^0=1।",
    "Power-of-power multiplies exponents.": "ਘਾਤ ਦੀ ਘਾਤ ਵਿੱਚ ਘਾਤਾਂਕਾਂ ਦਾ ਗੁਣਾ ਹੁੰਦਾ ਹੈ।",
    "Division subtracts exponents.": "ਭਾਗ ਵਿੱਚ ਘਾਤਾਂਕ ਘਟਾਏ ਜਾਂਦੇ ਹਨ।",
    "The square also contains the term 2ab.": "ਵਰਗ ਦੇ ਵਿਸਥਾਰ ਵਿੱਚ 2ab ਪਦ ਵੀ ਹੁੰਦਾ ਹੈ।",
    "First convert the terminating decimal exponent exactly: -1.5 = -3/2.": "ਪਹਿਲਾਂ ਸਮਾਪਤ ਦਸ਼ਮਲਵ ਘਾਤਾਂਕ ਨੂੰ ਸਟੀਕ ਭਿੰਨ ਵਿੱਚ ਬਦਲੋ: -1.5 = -3/2।",
    "Check zero-base edge conditions before applying ordinary index laws.": "ਆਮ ਘਾਤਾਂਕ ਨਿਯਮ ਲਗਾਉਣ ਤੋਂ ਪਹਿਲਾਂ ਸਿਫ਼ਰ ਅਧਾਰ ਦੀਆਂ ਵਿਸ਼ੇਸ਼ ਸਥਿਤੀਆਂ ਜਾਂਚੋ।",
    "Negative exponent requires a non-zero base": "ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਲਈ ਅਧਾਰ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    "A negative exponent requires a non-zero base": "ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਲਈ ਅਧਾਰ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    "0^0 is undefined": "0^0 ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ",
    "A negative number": "ਇੱਕ ਰਿਣਾਤਮਕ ਸੰਖਿਆ",
    "Equal exponents allow the bases to be multiplied; the composite result can also be harmonised to the prime base.": "ਇੱਕੋ ਘਾਤਾਂਕ ਹੋਣ ਤੇ ਅਧਾਰਾਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ; ਮਿਲੇ ਨਤੀਜੇ ਨੂੰ ਵੀ ਸਾਂਝੇ ਅਭਾਜ ਅਧਾਰ ਦੀ ਘਾਤ ਵਜੋਂ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
    "First recover the multiplier a^k from the ratio, then apply that multiplier once more.": "ਪਹਿਲਾਂ ਅਨੁਪਾਤ ਤੋਂ ਗੁਣਕ a^k ਪਤਾ ਕਰੋ, ਫਿਰ ਉਸੇ ਗੁਣਕ ਦੀ ਇੱਕ ਵਾਰ ਹੋਰ ਵਰਤੋਂ ਕਰੋ।",
    "Find the requested combination of the linked exponents.": "ਜੁੜੇ ਹੋਏ ਘਾਤਾਂਕਾਂ ਦਾ ਪੁੱਛਿਆ ਗਿਆ ਸੰਯੋਗ ਪਤਾ ਕਰੋ।",
    "Cannot be determined exactly": "ਸਟੀਕ ਤੌਰ ਤੇ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  },
};

function nativeConnectorText(value: string, locale: SriLocalizedLocaleV1): string {
  return value
    .replace(/\s+and then\s+/giu, locale === "hi-IN" ? " और फिर " : " ਅਤੇ ਫਿਰ ")
    .replace(/\s+and\s+/giu, locale === "hi-IN" ? " और " : " ਅਤੇ ")
    .replace(/\s+or\s+/giu, locale === "hi-IN" ? " या " : " ਜਾਂ ")
    .replace(/\s+with\s+/giu, locale === "hi-IN" ? " तथा " : " ਅਤੇ ");
}

function localizeEmbeddedLaw(text: string, locale: SriLocalizedLocaleV1): string {
  return localizeSriLearnerTextV1(text.trim(), locale);
}

export function localizeSriLearnerTextV1(text: string, locale: SriLocalizedLocaleV1): string {
  if (text === "Any non-zero number raised to the power 0 equals 1.") {
    return ZERO_EXPONENT_SENTENCE[locale];
  }

  if (text === "Square both positive expressions. Their rational parts match, so compare the exact cross-term products.") {
    return CROSS_TERM_COMPARISON_SENTENCE[locale];
  }

  const exact = EXACT_SENTENCES[locale][text];
  if (exact) return exact;

  let match = text.match(/^(?:A )?negative exponent requires a non-zero base\.?$/iu);
  if (match) {
    return locale === "hi-IN"
      ? "ऋणात्मक घातांक के लिए आधार शून्येतर होना आवश्यक है।"
      : "ਰਿਣਾਤਮਕ ਘਾਤਾਂਕ ਲਈ ਅਧਾਰ ਸਿਫ਼ਰ ਤੋਂ ਵੱਖ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।";
  }

  match = text.match(/^0\^0 is undefined\.?$/iu);
  if (match) {
    return locale === "hi-IN" ? "0^0 अपरिभाषित है।" : "0^0 ਅਪਰਿਭਾਸ਼ਿਤ ਹੈ।";
  }

  match = text.match(/^Equal exponents allow(?: the)? bases to be multiplied; the composite result can also be harmonised to (?:the )?(?:prime|common) base\.?$/iu);
  if (match) {
    return locale === "hi-IN"
      ? "समान घातांक होने पर आधारों को गुणा किया जा सकता है; प्राप्त परिणाम को भी समान अभाज्य आधार की घात के रूप में लिखा जा सकता है।"
      : "ਇੱਕੋ ਘਾਤਾਂਕ ਹੋਣ ਤੇ ਅਧਾਰਾਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ; ਮਿਲੇ ਨਤੀਜੇ ਨੂੰ ਵੀ ਸਾਂਝੇ ਅਭਾਜ ਅਧਾਰ ਦੀ ਘਾਤ ਵਜੋਂ ਲਿਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।";
  }

  match = text.match(/^For real a,b and integer n, (.+) whenever both sides are defined\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक a,b और पूर्णांक n के लिए, ${match[1]} जब दोनों पक्ष परिभाषित हों।`
      : `ਵਾਸਤਵਿਕ a,b ਅਤੇ ਪੂਰਨ ਅੰਕ n ਲਈ, ${match[1]} ਜਦੋਂ ਦੋਵੇਂ ਪਾਸੇ ਪਰਿਭਾਸ਼ਿਤ ਹੋਣ।`;
  }

  match = text.match(/^For all real a,b, (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `सभी वास्तविक a,b के लिए, ${match[1]}।`
      : `ਸਭ ਵਾਸਤਵਿਕ a,b ਲਈ, ${match[1]}।`;
  }

  match = text.match(/^Statement I: (.+?) Statement II: (.+?) Which conclusion is correct\?$/u);
  if (match) {
    const first = localizeEmbeddedLaw(match[1], locale);
    const second = localizeEmbeddedLaw(match[2], locale);
    return locale === "hi-IN"
      ? `कथन I: ${first} कथन II: ${second} सही निष्कर्ष चुनिए।`
      : `ਕਥਨ I: ${first} ਕਥਨ II: ${second} ਸਹੀ ਨਤੀਜਾ ਚੁਣੋ।`;
  }

  match = text.match(/^Consider I: (.+?) II: (.+?) Choose the correct truth combination\.$/u);
  if (match) {
    const first = localizeEmbeddedLaw(match[1], locale);
    const second = localizeEmbeddedLaw(match[2], locale);
    return locale === "hi-IN"
      ? `I पर विचार कीजिए: ${first} II: ${second} सही सत्यता-संयोजन चुनिए।`
      : `I ਬਾਰੇ ਵਿਚਾਰ ਕਰੋ: ${first} II: ${second} ਸਹੀ ਸੱਚਾਈ-ਸੰਯੋਗ ਚੁਣੋ।`;
  }

  match = text.match(/^For the following two index statements— I\. (.+?) II\. (.+?) —which option is correct\?$/u);
  if (match) {
    const first = localizeEmbeddedLaw(match[1], locale);
    const second = localizeEmbeddedLaw(match[2], locale);
    return locale === "hi-IN"
      ? `निम्न दो घातांक कथनों के लिए— I. ${first} II. ${second} —कौन-सा विकल्प सही है?`
      : `ਹੇਠਲੇ ਦੋ ਘਾਤਾਂਕ ਕਥਨਾਂ ਲਈ— I. ${first} II. ${second} —ਕਿਹੜਾ ਵਿਕਲਪ ਸਹੀ ਹੈ?`;
  }

  match = text.match(/^Statement I is [A-Z0-9_]+; Statement II is [A-Z0-9_]+\.$/u);
  if (match) {
    return locale === "hi-IN" ? "कथन I और कथन II दिए गए हैं।" : "ਕਥਨ I ਅਤੇ ਕਥਨ II ਦਿੱਤੇ ਗਏ ਹਨ।";
  }

  match = text.match(/^Which statement correctly describes (.+) over the real numbers\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक संख्याओं में ${match[1]} के बारे में कौन-सा कथन सही है?`
      : `ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ${match[1]} ਬਾਰੇ ਕਿਹੜਾ ਕਥਨ ਸਹੀ ਹੈ?`;
  }

  match = text.match(/^Over the real numbers, how should (.+) be classified\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `वास्तविक संख्याओं में ${match[1]} का वर्गीकरण कैसे होगा?`
      : `ਵਾਸਤਵਿਕ ਸੰਖਿਆਵਾਂ ਵਿੱਚ ${match[1]} ਦਾ ਵਰਗੀਕਰਨ ਕਿਵੇਂ ਹੋਵੇਗਾ?`;
  }

  match = text.match(/^Cube root of (.+) is (.+)$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} का घनमूल ${match[2]} है`
      : `${match[1]} ਦਾ ਘਣਮੂਲ ${match[2]} ਹੈ`;
  }

  match = text.match(/^Use fractional-index laws to simplify (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्नात्मक घातांक नियमों का उपयोग करके ${match[1]} को सरल कीजिए।`
      : `ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਨਿਯਮਾਂ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;
  }

  match = text.match(/^Use fractional-index rule to simplify (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्नात्मक घातांक नियम का उपयोग करके ${match[1]} को सरल कीजिए।`
      : `ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਨਿਯਮ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;
  }

  match = text.match(/^Evaluate the rational base (.+) raised to (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `परिमेय आधार ${match[1]} की घात ${match[2]} का सटीक मान ज्ञात कीजिए।`
      : `ਪਰਿਮੇਯ ਅਧਾਰ ${match[1]} ਦੀ ਘਾਤ ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Evaluate the fraction (.+) raised to (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्न ${match[1]} की घात ${match[2]} का सटीक मान ज्ञात कीजिए।`
      : `ਭਿੰਨ ${match[1]} ਦੀ ਘਾਤ ${match[2]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The fraction (.+) is raised to the reduced negative fractional index (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `भिन्न ${match[1]} पर लघुतम ऋणात्मक भिन्नात्मक घातांक ${match[2]} लगाया गया है।`
      : `ਭਿੰਨ ${match[1]} ਉੱਤੇ ਘਟਾਇਆ ਹੋਇਆ ਰਿਣਾਤਮਕ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ${match[2]} ਲਗਾਇਆ ਗਿਆ ਹੈ।`;
  }

  match = text.match(/^Rewrite (.+) as a single power of (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} को ${match[2]} की एकल घात के रूप में लिखिए।`
      : `${match[1]} ਨੂੰ ${match[2]} ਦੀ ਇੱਕਲ ਘਾਤ ਵਜੋਂ ਲਿਖੋ।`;
  }

  match = text.match(/^Using the common exponent, find an equivalent single-power form of (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `समान घातांक का उपयोग करके ${match[1]} का समतुल्य एकल-घात रूप ज्ञात कीजिए।`
      : `ਸਾਂਝੇ ਘਾਤਾਂਕ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਦਾ ਸਮਤੁੱਲ ਇੱਕਲ-ਘਾਤ ਰੂਪ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Which single power is equal to (.+)\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} के बराबर कौन-सी एकल घात है?`
      : `${match[1]} ਦੇ ਬਰਾਬਰ ਕਿਹੜੀ ਇੱਕਲ ਘਾਤ ਹੈ?`;
  }

  match = text.match(/^The given power expression is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया घात व्यंजक ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤਾ ਗਿਆ ਘਾਤ ਵਿਅੰਜਕ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  match = text.match(/^The given product is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया गुणनफल ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤਾ ਗਿਆ ਗੁਣਨਫਲ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  match = text.match(/^Since (.+), this is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `क्योंकि ${nativeConnectorText(match[1], locale)}, इसलिए यह ${match[2]} है।`
      : `ਕਿਉਂਕਿ ${nativeConnectorText(match[1], locale)}, ਇਸ ਲਈ ਇਹ ${match[2]} ਹੈ।`;
  }

  match = text.match(/^If (.+?) and their common exponent on base (.+?) is (.+?), find (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `यदि ${match[1]} और आधार ${match[2]} पर इनका समान घातांक ${match[3]} है, तो ${match[4]} ज्ञात कीजिए।`
      : `ਜੇ ${match[1]} ਅਤੇ ਅਧਾਰ ${match[2]} ਉੱਤੇ ਇਨ੍ਹਾਂ ਦਾ ਸਾਂਝਾ ਘਾਤਾਂਕ ${match[3]} ਹੈ, ਤਾਂ ${match[4]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Given (.+?) and the common exponent on base (.+?) is (.+?), find (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया है ${match[1]} और आधार ${match[2]} पर समान घातांक ${match[3]} है; ${match[4]} ज्ञात कीजिए।`
      : `ਦਿੱਤਾ ਹੈ ${match[1]} ਅਤੇ ਅਧਾਰ ${match[2]} ਉੱਤੇ ਸਾਂਝਾ ਘਾਤਾਂਕ ${match[3]} ਹੈ; ${match[4]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^For (.+?), the common (.+)-exponent is (.+)\. Determine (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} के लिए समान ${match[2]}-घातांक ${match[3]} है। ${match[4]} ज्ञात कीजिए।`
      : `${match[1]} ਲਈ ਸਾਂਝਾ ${match[2]}-ਘਾਤਾਂਕ ${match[3]} ਹੈ। ${match[4]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The supplied condition is (.+?) and (?:their|the) common exponent on base (.+?) is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दी गई शर्त ${match[1]} है और आधार ${match[2]} पर समान घातांक ${match[3]} है।`
      : `ਦਿੱਤੀ ਗਈ ਸ਼ਰਤ ${match[1]} ਹੈ ਅਤੇ ਅਧਾਰ ${match[2]} ਉੱਤੇ ਸਾਂਝਾ ਘਾਤਾਂਕ ${match[3]} ਹੈ।`;
  }

  match = text.match(/^Solve (.+) and then evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} को हल कीजिए और फिर ${match[2]} का मान ज्ञात कीजिए।`
      : `${match[1]} ਨੂੰ ਹੱਲ ਕਰੋ ਅਤੇ ਫਿਰ ${match[2]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^The given equation is (.+) and then evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया समीकरण ${match[1]} है और इसके बाद ${match[2]} का मान ज्ञात करना है।`
      : `ਦਿੱਤਾ ਗਿਆ ਸਮੀਕਰਨ ${match[1]} ਹੈ ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ${match[2]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰਨਾ ਹੈ।`;
  }

  match = text.match(/^If (.+) and (.+), find (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `यदि ${match[1]} और ${match[2]}, तो ${match[3]} ज्ञात कीजिए।`
      : `ਜੇ ${match[1]} ਅਤੇ ${match[2]}, ਤਾਂ ${match[3]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Given (.+) and (.+), evaluate (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया है ${match[1]} और ${match[2]}; ${match[3]} का मान ज्ञात कीजिए।`
      : `ਦਿੱਤਾ ਹੈ ${match[1]} ਅਤੇ ${match[2]}; ${match[3]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^Using the two relations (.+) and (.+), determine (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दोनों संबंध ${match[1]} और ${match[2]} का उपयोग करके ${match[3]} ज्ञात कीजिए।`
      : `ਦੋਵੇਂ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[3]} ਪਤਾ ਕਰੋ।`;
  }

  match = text.match(/^After writing both with base (.+), compare (.+) with (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दोनों को आधार ${match[1]} में लिखने के बाद ${match[2]} और ${match[3]} की तुलना कीजिए।`
      : `ਦੋਵਾਂ ਨੂੰ ਅਧਾਰ ${match[1]} ਵਿੱਚ ਲਿਖਣ ਤੋਂ ਬਾਅਦ ${match[2]} ਅਤੇ ${match[3]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  match = text.match(/^The powers to compare are (.+) with (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `तुलना की जाने वाली घातें ${match[1]} और ${match[2]} हैं।`
      : `ਤੁਲਨਾ ਲਈ ਘਾਤਾਂ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  match = text.match(/^Rewrite both expressions with the same base and compare their resulting exponents\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? "दोनों व्यंजकों को समान आधार में लिखकर प्राप्त घातांकों की तुलना कीजिए।"
      : "ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਨੂੰ ਇੱਕੋ ਅਧਾਰ ਵਿੱਚ ਲਿਖ ਕੇ ਮਿਲੇ ਘਾਤਾਂਕਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ।";
  }

  match = text.match(/^Compare (.+) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} की तुलना कीजिए।`
      : `${match[1]} ਅਤੇ ${match[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  match = text.match(/^Which is greater: (.+) or (.+)\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `${match[1]} और ${match[2]} में कौन बड़ा है?`
      : `${match[1]} ਅਤੇ ${match[2]} ਵਿੱਚ ਕਿਹੜਾ ਵੱਡਾ ਹੈ?`;
  }

  match = text.match(/^The two expressions have the same exponent (.+)\. Compare (.+) with (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दोनों व्यंजकों का घातांक ${match[1]} समान है। ${match[2]} और ${match[3]} की तुलना कीजिए।`
      : `ਦੋਵੇਂ ਵਿਅੰਜਕਾਂ ਦਾ ਘਾਤਾਂਕ ${match[1]} ਇੱਕੋ ਹੈ। ${match[2]} ਅਤੇ ${match[3]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  match = text.match(/^Quantity A: (.+)\. Quantity B: (.+)\. Compare A and B\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `राशि A: ${match[1]}। राशि B: ${match[2]}। A और B की तुलना कीजिए।`
      : `ਰਾਸ਼ੀ A: ${match[1]}। ਰਾਸ਼ੀ B: ${match[2]}। A ਅਤੇ B ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  match = text.match(/^Compare Quantity A = (.+) with Quantity B = (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `राशि A = ${match[1]} और राशि B = ${match[2]} की तुलना कीजिए।`
      : `ਰਾਸ਼ੀ A = ${match[1]} ਅਤੇ ਰਾਸ਼ੀ B = ${match[2]} ਦੀ ਤੁਲਨਾ ਕਰੋ।`;
  }

  match = text.match(/^Which relation is correct for A=(.+) and B=(.+)\?$/u);
  if (match) {
    return locale === "hi-IN"
      ? `A=${match[1]} और B=${match[2]} के लिए कौन-सा संबंध सही है?`
      : `A=${match[1]} ਅਤੇ B=${match[2]} ਲਈ ਕਿਹੜਾ ਸੰਬੰਧ ਸਹੀ ਹੈ?`;
  }

  match = text.match(/^The supplied condition is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दी गई शर्त ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤੀ ਗਈ ਸ਼ਰਤ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  match = text.match(/^The supplied relation is the two relations (.+) and (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिए गए दो संबंध ${match[1]} और ${match[2]} हैं।`
      : `ਦਿੱਤੇ ਗਏ ਦੋ ਸੰਬੰਧ ${match[1]} ਅਤੇ ${match[2]} ਹਨ।`;
  }

  match = text.match(/^The supplied relation is (.+)\.$/u);
  if (match) {
    return locale === "hi-IN"
      ? `दिया गया संबंध ${nativeConnectorText(match[1], locale)} है।`
      : `ਦਿੱਤਾ ਗਿਆ ਸੰਬੰਧ ${nativeConnectorText(match[1], locale)} ਹੈ।`;
  }

  // RUN35_SURD_LOCALIZATION_BLOCK_V1
  match = text.match(/^The two displayed index statements are I\. (.+?) II\. (.+)\.$/u);
  if (match) {
    const first = localizeEmbeddedLaw(match[1], locale);
    const second = localizeEmbeddedLaw(match[2], locale);
    return locale === "hi-IN"
      ? `दिखाए गए दो घातांक कथन हैं— I. ${first} II. ${second}`
      : `ਦਿਖਾਏ ਗਏ ਦੋ ਘਾਤਾਂਕ ਕਥਨ ਹਨ— I. ${first} II. ${second}`;
  }

  match = text.match(/^The displayed statements are I: (.+?) II: (.+)\.$/u);
  if (match) {
    const first = localizeEmbeddedLaw(match[1], locale);
    const second = localizeEmbeddedLaw(match[2], locale);
    return locale === "hi-IN"
      ? `दिखाए गए कथन हैं— I: ${first} II: ${second}`
      : `ਦਿਖਾਏ ਗਏ ਕਥਨ ਹਨ— I: ${first} II: ${second}`;
  }

  match = text.match(/^The given information is Statement I: (.+?) Statement II: (.+)\.$/u);
  if (match) {
    const first = localizeEmbeddedLaw(match[1], locale);
    const second = localizeEmbeddedLaw(match[2], locale);
    return locale === "hi-IN"
      ? `दी गई जानकारी में कथन I: ${first} और कथन II: ${second}`
      : `ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਵਿੱਚ ਕਥਨ I: ${first} ਅਤੇ ਕਥਨ II: ${second}`;
  }

  match = text.match(/^([IV]+): (.+)$/u);
  if (match) {
    return `${match[1]}: ${localizeEmbeddedLaw(match[2], locale)}`;
  }

  match = text.match(/^Write (.+) in simplest surd form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को सरलतम करणी रूप में लिखिए।` : `${match[1]} ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Write (.+) in simplest radical form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को सरलतम करणी रूप में लिखिए।` : `${match[1]} ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Extract the greatest perfect-square factor from (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} में से सबसे बड़ा पूर्ण-वर्ग गुणनखंड बाहर निकालिए।` : `${match[1]} ਵਿੱਚੋਂ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ-ਵਰਗ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢੋ।`;

  match = text.match(/^Extract the greatest perfect-cube factor from (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} में से सबसे बड़ा पूर्ण-घन गुणनखंड बाहर निकालिए।` : `${match[1]} ਵਿੱਚੋਂ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ-ਘਣ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢੋ।`;

  match = text.match(/^Which is the simplest form of (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सरलतम रूप कौन-सा है?` : `${match[1]} ਦਾ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਕਿਹੜਾ ਹੈ?`;

  match = text.match(/^Find the simplified form of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सरल रूप ज्ञात कीजिए।` : `${match[1]} ਦਾ ਸਰਲ ਰੂਪ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Find the simplest exact radical form of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सरलतम सटीक करणी रूप ज्ञात कीजिए।` : `${match[1]} ਦਾ ਸਭ ਤੋਂ ਸਰਲ ਸਟੀਕ ਕਰਣੀ ਰੂਪ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Reduce (.+) to index-free radicand form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को इस प्रकार सरल कीजिए कि करणीगत संख्या में कोई पूर्ण-घात गुणनखंड न बचे।` : `${match[1]} ਨੂੰ ਇਸ ਤਰ੍ਹਾਂ ਸਰਲ ਕਰੋ ਕਿ ਕਰਣੀਗਤ ਸੰਖਿਆ ਵਿੱਚ ਕੋਈ ਪੂਰਨ-ਘਾਤ ਗੁਣਨਖੰਡ ਨਾ ਬਚੇ।`;

  match = text.match(/^The radical expression to simplify is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सरल किया जाने वाला करणी व्यंजक ${match[1]} है।` : `ਸਰਲ ਕੀਤਾ ਜਾਣ ਵਾਲਾ ਕਰਣੀ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  match = text.match(/^The root to simplify is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सरल किया जाने वाला मूल ${match[1]} है।` : `ਸਰਲ ਕੀਤਾ ਜਾਣ ਵਾਲਾ ਮੂਲ ${match[1]} ਹੈ।`;

  match = text.match(/^The expression to classify is (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `वर्गीकृत किया जाने वाला व्यंजक ${match[1]} है।` : `ਵਰਗੀਕਰਨ ਲਈ ਵਿਅੰਜਕ ${match[1]} ਹੈ।`;

  if (text === "Separate the largest perfect-square factor and take its square root outside the radical.") {
    return locale === "hi-IN" ? "सबसे बड़ा पूर्ण-वर्ग गुणनखंड अलग कीजिए और उसका वर्गमूल करणी के बाहर निकालिए।" : "ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ-ਵਰਗ ਗੁਣਨਖੰਡ ਵੱਖ ਕਰੋ ਅਤੇ ਉਸ ਦਾ ਵਰਗਮੂਲ ਕਰਣੀ ਤੋਂ ਬਾਹਰ ਕੱਢੋ।";
  }

  if (text === "Separate the largest perfect-cube factor and take its cube root outside.") {
    return locale === "hi-IN" ? "सबसे बड़ा पूर्ण-घन गुणनखंड अलग कीजिए और उसका घनमूल बाहर निकालिए।" : "ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ-ਘਣ ਗੁਣਨਖੰਡ ਵੱਖ ਕਰੋ ਅਤੇ ਉਸ ਦਾ ਘਣਮੂਲ ਬਾਹਰ ਕੱਢੋ।";
  }

  match = text.match(/^Factor out the largest perfect ([0-9]+)th power from the radicand\.$/u);
  if (match) return locale === "hi-IN" ? `करणीगत संख्या से सबसे बड़ा पूर्ण ${match[1]}वीं घात वाला गुणनखंड बाहर निकालिए।` : `ਕਰਣੀਗਤ ਸੰਖਿਆ ਵਿੱਚੋਂ ਸਭ ਤੋਂ ਵੱਡਾ ਪੂਰਨ ${match[1]}ਵੀਂ ਘਾਤ ਵਾਲਾ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢੋ।`;

  match = text.match(/^Classify (.+) as rational or a surd\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को परिमेय या करणी के रूप में वर्गीकृत कीजिए।` : `${match[1]} ਨੂੰ ਪਰਿਮੇਯ ਜਾਂ ਕਰਣੀ ਵਜੋਂ ਵਰਗੀਕਰਨ ਕਰੋ।`;

  match = text.match(/^Is (.+) rational or a surd\?$/u);
  if (match) return locale === "hi-IN" ? `क्या ${match[1]} परिमेय है या करणी?` : `ਕੀ ${match[1]} ਪਰਿਮੇਯ ਹੈ ਜਾਂ ਕਰਣੀ?`;

  match = text.match(/^Choose the correct classification of (?:the radical )?(.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सही वर्गीकरण चुनिए।` : `${match[1]} ਦਾ ਸਹੀ ਵਰਗੀਕਰਨ ਚੁਣੋ।`;

  match = text.match(/^Determine whether (.+) has an exact rational value\.$/u);
  if (match) return locale === "hi-IN" ? `निर्धारित कीजिए कि ${match[1]} का सटीक परिमेय मान है या नहीं।` : `ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ${match[1]} ਦਾ ਸਟੀਕ ਪਰਿਮੇਯ ਮੁੱਲ ਹੈ ਜਾਂ ਨਹੀਂ।`;

  if (text === "Not a real number") return locale === "hi-IN" ? "वास्तविक संख्या नहीं" : "ਵਾਸਤਵਿਕ ਸੰਖਿਆ ਨਹੀਂ";

  if (text === "A positive square root expression is given.") return locale === "hi-IN" ? "एक धनात्मक वर्गमूल व्यंजक दिया गया है।" : "ਇੱਕ ਧਨਾਤਮਕ ਵਰਗਮੂਲ ਵਿਅੰਜਕ ਦਿੱਤਾ ਗਿਆ ਹੈ।";
  if (text === "A positive cube root expression is given.") return locale === "hi-IN" ? "एक धनात्मक घनमूल व्यंजक दिया गया है।" : "ਇੱਕ ਧਨਾਤਮਕ ਘਣਮੂਲ ਵਿਅੰਜਕ ਦਿੱਤਾ ਗਿਆ ਹੈ।";

  match = text.match(/^A positive ([0-9]+)th root expression is given\.$/u);
  if (match) return locale === "hi-IN" ? `एक धनात्मक ${match[1]}वीं मूल वाला व्यंजक दिया गया है।` : `ਇੱਕ ਧਨਾਤਮਕ ${match[1]}ਵੀਂ ਮੂਲ ਵਾਲਾ ਵਿਅੰਜਕ ਦਿੱਤਾ ਗਿਆ ਹੈ।`;

  if (text === "Check whether the radicand is a perfect square.") return locale === "hi-IN" ? "जाँचिए कि करणीगत संख्या पूर्ण वर्ग है या नहीं।" : "ਜਾਂਚੋ ਕਿ ਕਰਣੀਗਤ ਸੰਖਿਆ ਪੂਰਨ ਵਰਗ ਹੈ ਜਾਂ ਨਹੀਂ।";
  if (text === "Check whether the radicand is a perfect cube.") return locale === "hi-IN" ? "जाँचिए कि करणीगत संख्या पूर्ण घन है या नहीं।" : "ਜਾਂਚੋ ਕਿ ਕਰਣੀਗਤ ਸੰਖਿਆ ਪੂਰਨ ਘਣ ਹੈ ਜਾਂ ਨਹੀਂ।";

  match = text.match(/^Check whether the radicand is a perfect ([0-9]+)th power\.$/u);
  if (match) return locale === "hi-IN" ? `जाँचिए कि करणीगत संख्या पूर्ण ${match[1]}वीं घात है या नहीं।` : `ਜਾਂਚੋ ਕਿ ਕਰਣੀਗਤ ਸੰਖਿਆ ਪੂਰਨ ${match[1]}ਵੀਂ ਘਾਤ ਹੈ ਜਾਂ ਨਹੀਂ।`;

  match = text.match(/^(.+) is not a perfect square, so the radical remains irrational\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} पूर्ण वर्ग नहीं है, इसलिए करणी अपरिमेय रहती है।` : `${match[1]} ਪੂਰਨ ਵਰਗ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਕਰਣੀ ਅਪਰਿਮੇਯ ਰਹਿੰਦੀ ਹੈ।`;

  match = text.match(/^(.+) is not a perfect cube, so the radical remains irrational\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} पूर्ण घन नहीं है, इसलिए करणी अपरिमेय रहती है।` : `${match[1]} ਪੂਰਨ ਘਣ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਕਰਣੀ ਅਪਰਿਮੇਯ ਰਹਿੰਦੀ ਹੈ।`;

  match = text.match(/^(.+) is not a perfect ([0-9]+)th power, so the radical remains irrational\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} पूर्ण ${match[2]}वीं घात नहीं है, इसलिए करणी अपरिमेय रहती है।` : `${match[1]} ਪੂਰਨ ${match[2]}ਵੀਂ ਘਾਤ ਨਹੀਂ ਹੈ, ਇਸ ਲਈ ਕਰਣੀ ਅਪਰਿਮੇਯ ਰਹਿੰਦੀ ਹੈ।`;

  match = text.match(/^(.+), so the radical equals (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]}, इसलिए करणी का मान ${match[2]} है।` : `${match[1]}, ਇਸ ਲਈ ਕਰਣੀ ਦਾ ਮੁੱਲ ${match[2]} ਹੈ।`;

  match = text.match(/^Classify (.+) as rational or irrational\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को परिमेय या अपरिमेय के रूप में वर्गीकृत कीजिए।` : `${match[1]} ਨੂੰ ਪਰਿਮੇਯ ਜਾਂ ਅਪਰਿਮੇਯ ਵਜੋਂ ਵਰਗੀਕਰਨ ਕਰੋ।`;

  match = text.match(/^Is (.+) rational or irrational\?$/u);
  if (match) return locale === "hi-IN" ? `क्या ${match[1]} परिमेय है या अपरिमेय?` : `ਕੀ ${match[1]} ਪਰਿਮੇਯ ਹੈ ਜਾਂ ਅਪਰਿਮੇਯ?`;

  match = text.match(/^After exact simplification, classify (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सटीक रूप से सरल करने के बाद ${match[1]} का वर्गीकरण कीजिए।` : `ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰਨ ਤੋਂ ਬਾਅਦ ${match[1]} ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।`;

  match = text.match(/^Determine the number type of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} की संख्या-प्रकृति निर्धारित कीजिए।` : `${match[1]} ਦੀ ਸੰਖਿਆ-ਕਿਸਮ ਨਿਰਧਾਰਤ ਕਰੋ।`;

  if (text === "Simplify the first radical to a like surd, combine coefficients, then classify the result.") {
    return locale === "hi-IN" ? "पहली करणी को समान करणी में सरल कीजिए, गुणांकों को मिलाइए और फिर परिणाम का वर्गीकरण कीजिए।" : "ਪਹਿਲੀ ਕਰਣੀ ਨੂੰ ਇੱਕੋ ਕਰਣੀ ਵਿੱਚ ਸਰਲ ਕਰੋ, ਗੁਣਾਂਕ ਮਿਲਾਓ ਅਤੇ ਫਿਰ ਨਤੀਜੇ ਦਾ ਵਰਗੀਕਰਨ ਕਰੋ।";
  }

  if (text === "The two like surds cancel to 0, which is rational.") return locale === "hi-IN" ? "दोनों समान करणियाँ कटकर 0 देती हैं, जो परिमेय है।" : "ਦੋਵੇਂ ਇੱਕੋ ਕਰਣੀਆਂ ਕੱਟ ਕੇ 0 ਦਿੰਦੀਆਂ ਹਨ, ਜੋ ਪਰਿਮੇਯ ਹੈ।";

  match = text.match(/^The result is (.+), which is irrational\.$/u);
  if (match) return locale === "hi-IN" ? `परिणाम ${match[1]} है, जो अपरिमेय है।` : `ਨਤੀਜਾ ${match[1]} ਹੈ, ਜੋ ਅਪਰਿਮੇਯ ਹੈ।`;

  match = text.match(/^Write (.+) using a fractional index\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को भिन्नात्मक घातांक में लिखिए।` : `${match[1]} ਨੂੰ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Convert (.+) to exponent notation\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को घातांक रूप में बदलिए।` : `${match[1]} ਨੂੰ ਘਾਤਾਂਕ ਰੂਪ ਵਿੱਚ ਬਦਲੋ।`;

  match = text.match(/^Which power of a is equivalent to (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `a की कौन-सी घात ${match[1]} के समतुल्य है?` : `a ਦੀ ਕਿਹੜੀ ਘਾਤ ${match[1]} ਦੇ ਸਮਤੁੱਲ ਹੈ?`;

  match = text.match(/^Express (.+) without a radical sign\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को करणी चिह्न के बिना लिखिए।` : `${match[1]} ਨੂੰ ਕਰਣੀ ਚਿੰਨ੍ਹ ਤੋਂ ਬਿਨਾਂ ਲਿਖੋ।`;

  match = text.match(/^Write (.+) in radical notation\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को करणी रूप में लिखिए।` : `${match[1]} ਨੂੰ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Convert (.+) to an equivalent radical\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को समतुल्य करणी में बदलिए।` : `${match[1]} ਨੂੰ ਸਮਤੁੱਲ ਕਰਣੀ ਵਿੱਚ ਬਦਲੋ।`;

  match = text.match(/^Which radical (?:is equivalent to|represents) (.+)\?$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} के समतुल्य कौन-सी करणी है?` : `${match[1]} ਦੇ ਸਮਤੁੱਲ ਕਿਹੜੀ ਕਰਣੀ ਹੈ?`;

  match = text.match(/^Express (.+) using a root sign\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को मूल चिह्न का उपयोग करके लिखिए।` : `${match[1]} ਨੂੰ ਮੂਲ ਚਿੰਨ੍ਹ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਲਿਖੋ।`;

  if (text === "Convert between radical and fractional-index notation.") return locale === "hi-IN" ? "करणी और भिन्नात्मक घातांक रूपों के बीच रूपांतरण कीजिए।" : "ਕਰਣੀ ਅਤੇ ਭਿੰਨਾਤਮਕ ਘਾਤਾਂਕ ਰੂਪਾਂ ਵਿਚਕਾਰ ਬਦਲਾਅ ਕਰੋ।";
  if (text === "Use the identity that an nth root contributes denominator n to the exponent.") return locale === "hi-IN" ? "इस तथ्य का उपयोग कीजिए कि nवाँ मूल घातांक के हर में n देता है।" : "ਇਸ ਤੱਥ ਦੀ ਵਰਤੋਂ ਕਰੋ ਕਿ nਵਾਂ ਮੂਲ ਘਾਤਾਂਕ ਦੇ ਹਰ ਵਿੱਚ n ਦਿੰਦਾ ਹੈ।";

  match = text.match(/^Reduced exponent = (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `लघुतम घातांक = ${match[1]}।` : `ਘਟਾਇਆ ਹੋਇਆ ਘਾਤਾਂਕ = ${match[1]}।`;

  match = text.match(/^Combine the like surds: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `समान करणियों को मिलाइए: ${match[1]}।` : `ਇੱਕੋ ਕਰਣੀਆਂ ਨੂੰ ਮਿਲਾਓ: ${match[1]}।`;

  match = text.match(/^Find the exact value of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सटीक मान ज्ञात कीजिए।` : `${match[1]} ਦਾ ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Reduce (.+) to one surd term\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को एक करणी पद में सरल कीजिए।` : `${match[1]} ਨੂੰ ਇੱਕ ਕਰਣੀ ਪਦ ਵਿੱਚ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^First reduce the radical, then simplify (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `पहले करणी को सरल कीजिए, फिर ${match[1]} को सरल कीजिए।` : `ਪਹਿਲਾਂ ਕਰਣੀ ਨੂੰ ਸਰਲ ਕਰੋ, ਫਿਰ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^Combine (.+) into simplest form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को मिलाकर सरलतम रूप में लिखिए।` : `${match[1]} ਨੂੰ ਮਿਲਾ ਕੇ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Evaluate exactly: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `सटीक मान ज्ञात कीजिए: ${match[1]}।` : `ਸਟੀਕ ਮੁੱਲ ਪਤਾ ਕਰੋ: ${match[1]}।`;

  match = text.match(/^Multiply and simplify (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का गुणा करके सरल कीजिए।` : `${match[1]} ਦਾ ਗੁਣਾ ਕਰਕੇ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^Find the exact product of (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} और ${match[2]} का सटीक गुणनफल ज्ञात कीजिए।` : `${match[1]} ਅਤੇ ${match[2]} ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Reduce (.+) to simplest surd form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को सरलतम करणी रूप में लिखिए।` : `${match[1]} ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Divide the surds exactly: (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `करणियों का सटीक भाग कीजिए: ${match[1]}।` : `ਕਰਣੀਆਂ ਦਾ ਸਟੀਕ ਭਾਗ ਕਰੋ: ${match[1]}।`;

  match = text.match(/^Find the simplest form of (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का सरलतम रूप ज्ञात कीजिए।` : `${match[1]} ਦਾ ਸਭ ਤੋਂ ਸਰਲ ਰੂਪ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Reduce the quotient (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `भागफल ${match[1]} को सरल कीजिए।` : `ਭਾਗਫਲ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^Expand and simplify (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} का विस्तार करके सरल कीजिए।` : `${match[1]} ਦਾ ਵਿਸਥਾਰ ਕਰਕੇ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^Write (.+) in the form (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को ${match[2]} के रूप में लिखिए।` : `${match[1]} ਨੂੰ ${match[2]} ਦੇ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  match = text.match(/^Simplify the surd binomial square (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `करणी वाली द्विपदी के वर्ग ${match[1]} को सरल कीजिए।` : `ਕਰਣੀ ਵਾਲੇ ਦੋਪਦੀ ਵਰਗ ${match[1]} ਨੂੰ ਸਰਲ ਕਰੋ।`;

  match = text.match(/^Evaluate the conjugate product (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `संयुग्मी गुणनफल ${match[1]} का मान ज्ञात कीजिए।` : `ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ ${match[1]} ਦਾ ਮੁੱਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Use a difference of squares to find (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `वर्गों के अंतर का उपयोग करके ${match[1]} ज्ञात कीजिए।` : `ਵਰਗਾਂ ਦੇ ਅੰਤਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ${match[1]} ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Find the exact product of (.+) and its conjugate\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} और उसके संयुग्मी का सटीक गुणनफल ज्ञात कीजिए।` : `${match[1]} ਅਤੇ ਇਸ ਦੇ ਸੰਯੁਗਮੀ ਦਾ ਸਟੀਕ ਗੁਣਨਫਲ ਪਤਾ ਕਰੋ।`;

  match = text.match(/^Multiply the surd sums (.+) and (.+)\.$/u);
  if (match) return locale === "hi-IN" ? `करणी योग ${match[1]} और ${match[2]} का गुणा कीजिए।` : `ਕਰਣੀ ਜੋੜ ${match[1]} ਅਤੇ ${match[2]} ਦਾ ਗੁਣਾ ਕਰੋ।`;

  match = text.match(/^Write (.+) in canonical surd form\.$/u);
  if (match) return locale === "hi-IN" ? `${match[1]} को मानक करणी रूप में लिखिए।` : `${match[1]} ਨੂੰ ਮਿਆਰੀ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;

  if (text === "The radicals are already alike, so combine only their coefficients.") return locale === "hi-IN" ? "करणियाँ पहले से समान हैं, इसलिए केवल उनके गुणांक मिलाइए।" : "ਕਰਣੀਆਂ ਪਹਿਲਾਂ ਹੀ ਇੱਕੋ ਹਨ, ਇਸ ਲਈ ਕੇਵਲ ਉਨ੍ਹਾਂ ਦੇ ਗੁਣਾਂਕ ਮਿਲਾਓ।";
  if (text === "Multiply the coefficients and radicands, then extract any perfect-square factor from the product radicand.") return locale === "hi-IN" ? "गुणांकों और करणीगत संख्याओं का गुणा कीजिए, फिर प्राप्त करणीगत संख्या से कोई भी पूर्ण-वर्ग गुणनखंड बाहर निकालिए।" : "ਗੁਣਾਂਕਾਂ ਅਤੇ ਕਰਣੀਗਤ ਸੰਖਿਆਵਾਂ ਦਾ ਗੁਣਾ ਕਰੋ, ਫਿਰ ਮਿਲੀ ਕਰਣੀਗਤ ਸੰਖਿਆ ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਪੂਰਨ-ਵਰਗ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢੋ।";
  if (text === "Cancel the common radical factor exactly and reduce the rational coefficient.") return locale === "hi-IN" ? "समान करणी गुणनखंड को सटीक रूप से काटिए और परिमेय गुणांक को सरल कीजिए।" : "ਸਾਂਝੇ ਕਰਣੀ ਗੁਣਨਖੰਡ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਕੱਟੋ ਅਤੇ ਪਰਿਮੇਯ ਗੁਣਾਂਕ ਨੂੰ ਸਰਲ ਕਰੋ।";
  if (text === "Use (a+b)^2=a^2+2ab+b^2 and simplify the square of the radical exactly.") return locale === "hi-IN" ? "(a+b)^2=a^2+2ab+b^2 का उपयोग कीजिए और करणी के वर्ग को सटीक रूप से सरल कीजिए।" : "(a+b)^2=a^2+2ab+b^2 ਦੀ ਵਰਤੋਂ ਕਰੋ ਅਤੇ ਕਰਣੀ ਦੇ ਵਰਗ ਨੂੰ ਸਟੀਕ ਤੌਰ ਤੇ ਸਰਲ ਕਰੋ।";
  if (text === "A conjugate product is a difference of squares, so the mixed radical terms cancel.") return locale === "hi-IN" ? "संयुग्मी गुणनफल वर्गों का अंतर होता है, इसलिए मिश्र करणी पद कट जाते हैं।" : "ਸੰਯੁਗਮੀ ਗੁਣਨਫਲ ਵਰਗਾਂ ਦਾ ਅੰਤਰ ਹੁੰਦਾ ਹੈ, ਇਸ ਲਈ ਮਿਸ਼ਰਤ ਕਰਣੀ ਪਦ ਕੱਟ ਜਾਂਦੇ ਹਨ।";

  match = text.match(/^Canonical result = (.+)$/u);
  if (match) return locale === "hi-IN" ? `मानक परिणाम = ${match[1]}` : `ਮਿਆਰੀ ਨਤੀਜਾ = ${match[1]}`;

  match = text.match(/^Coefficient = (.+)$/u);
  if (match) return locale === "hi-IN" ? `गुणांक = ${match[1]}` : `ਗੁਣਾਂਕ = ${match[1]}`;

  match = text.match(/^Result = (.+)$/u);
  if (match) return locale === "hi-IN" ? `परिणाम = ${match[1]}` : `ਨਤੀਜਾ = ${match[1]}`;

  const denest = text.match(/^Denest (.+)\.$/u);
  if (denest) {
    return locale === "hi-IN"
      ? `${denest[1]} को सरल करणी रूप में लिखिए।`
      : `${denest[1]} ਨੂੰ ਸਰਲ ਕਰਣੀ ਰੂਪ ਵਿੱਚ ਲਿਖੋ।`;
  }

  const crossTermRadicand = text.match(/^Second cross-term radicand: (.+)$/u);
  if (crossTermRadicand) {
    return locale === "hi-IN"
      ? `दूसरे मिश्र पद की करणीगत संख्या: ${crossTermRadicand[1]}`
      : `ਦੂਜੇ ਮਿਸ਼ਰਤ ਪਦ ਦੀ ਕਰਣੀਗਤ ਸੰਖਿਆ: ${crossTermRadicand[1]}`;
  }

  const extraction = text.match(/^Write (.+) after extracting the perfect (.+)-power factor\.$/u);
  if (extraction) {
    return locale === "hi-IN"
      ? `${extraction[1]} में पूर्ण ${extraction[2]} घात वाला गुणनखंड बाहर निकालकर लिखिए।`
      : `${extraction[1]} ਵਿੱਚ ਪੂਰਨ ${extraction[2]} ਘਾਤ ਵਾਲਾ ਗੁਣਨਖੰਡ ਬਾਹਰ ਕੱਢ ਕੇ ਲਿਖੋ।`;
  }

  return localizeSriLearnerTextNaturalV1(text, locale);
}

export function localizeSriDiscoveryQuestionV1(
  source: SriDiscoveryQuestion,
  locale: SriLocalizedLocaleV1,
): SriLocalizedDiscoveryQuestionV1 {
  const answer = {
    ...source.answer,
    text: localizeSriLearnerTextV1(source.answer.text, locale),
  };
  const options = source.options.map((option) => ({
    ...option,
    text: localizeSriLearnerTextV1(option.text, locale),
  })) as unknown as SriDiscoveryQuestion["options"];
  const explanation: SriHumanExplanation = {
    given: localizeSriLearnerTextV1(source.explanation.given, locale),
    asked: localizeSriLearnerTextV1(source.explanation.asked, locale),
    method: localizeSriLearnerTextV1(source.explanation.method, locale),
    working: source.explanation.working.map((line) => localizeSriLearnerTextV1(line, locale)),
    answer: localizeSriLearnerTextV1(source.explanation.answer, locale),
  };
  return deepFreeze({
    ...source,
    stem: localizeSriLearnerTextV1(source.stem, locale),
    answer,
    options,
    explanation,
  });
}

export function generateSriPermanentLocalizedQuestionV1(
  qlId: SriPermanentQlId,
  externalSeed: string,
  locale: SriLocalizedLocaleV1,
): SriPermanentLocalizedQuestionV1 {
  const english = generateSriPermanentEnglishQuestionV1(qlId, externalSeed);
  const question = localizeSriDiscoveryQuestionV1(english.question, locale);
  return deepFreeze({
    packageId: english.packageId,
    checkpointId: english.checkpointId,
    permanentQlId: english.permanentQlId,
    permanentSolveModeId: english.permanentSolveModeId,
    retainedGroupId: english.retainedGroupId,
    englishQlTitle: english.qlTitle,
    locale,
    language: LANGUAGE_BY_LOCALE[locale],
    externalSeed,
    sourceCandidateId: english.sourceCandidateId,
    sourceCheckpointId: english.sourceCheckpointId,
    sourceSeed: english.sourceSeed,
    englishFingerprint: english.englishFingerprint,
    question,
    lifecycle: {
      maturity: "PERMANENT_AUTHORITY" as const,
      reviewStatus: "LOCALIZATION_REVIEW_READY" as const,
      localizationStatus: "REVIEW_READY" as const,
      questionBankStatus: "NOT_STORED" as const,
      testEligibility: "INELIGIBLE" as const,
      active: false as const,
      questionStudioDiscoverable: false as const,
      questionStudioGenerationEnabled: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      publiclyPublishable: false as const,
    },
  });
}

function deepFreeze<T>(value: T, seen = new WeakSet<object>()): T {
  if (typeof value !== "object" || value === null) return value;
  const objectValue = value as object;
  if (seen.has(objectValue)) return value;
  seen.add(objectValue);
  for (const key of Reflect.ownKeys(objectValue)) {
    deepFreeze((objectValue as Record<PropertyKey, unknown>)[key], seen);
  }
  return Object.freeze(value);
}
