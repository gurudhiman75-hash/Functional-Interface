import { PRB_001_LIBRARIES } from "./foundation/library";
import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import {
  getProbabilityNativeTerm,
  isProbabilityMathOrNumericOption,
} from "../native-language-primitives";

export type Prb001NativeEditorialStatus = "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW";

type NativePair = Readonly<{ hi: string; pa: string }>;
type NativeExplanation = Readonly<{
  approach: string;
  workingLead: string;
  keyPoint: string;
  answerLabel: string;
}>;
type NativeExplanationPair = Readonly<{ hi: NativeExplanation; pa: NativeExplanation }>;

type NativeFamilySpec = Readonly<{
  stem: NativePair;
  eventWording: NativePair;
  explanation: NativeExplanationPair;
}>;

export type Prb001NativeEditorialEntry = Readonly<{
  packageId: "PRB-001";
  qlId: string;
  sourceStemTemplateId: string;
  language: ProbabilityNativeLanguage;
  sourceLanguage: "en";
  editorialStatus: Prb001NativeEditorialStatus;
  contextFamily: string;
  eventWording: string;
  stemTemplate: string;
  explanation: NativeExplanation;
  learningOnly: boolean;
  questionStudioEnabled: false;
  publiclyPublishable: false;
}>;

const pair = (hi: string, pa: string): NativePair => ({ hi, pa });
const explanation = (
  hiApproach: string,
  hiWorkingLead: string,
  hiKeyPoint: string,
  paApproach: string,
  paWorkingLead: string,
  paKeyPoint: string,
): NativeExplanationPair => ({
  hi: { approach: hiApproach, workingLead: hiWorkingLead, keyPoint: hiKeyPoint, answerLabel: "उत्तर" },
  pa: { approach: paApproach, workingLead: paWorkingLead, keyPoint: paKeyPoint, answerLabel: "ਉੱਤਰ" },
});

const DIRECT_EXPLANATION = explanation(
  "कुल समान-संभावित परिणाम और अनुकूल परिणाम पहचानें।",
  "प्रायिकता = अनुकूल परिणामों की संख्या / कुल परिणामों की संख्या।",
  "हर परिणाम समान रूप से संभावित है, इसलिए सीधे अनुपात का उपयोग करें।",
  "ਕੁੱਲ ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ ਅਤੇ ਅਨੁਕੂਲ ਨਤੀਜੇ ਪਛਾਣੋ।",
  "ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ / ਕੁੱਲ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ।",
  "ਹਰ ਨਤੀਜੇ ਦੀ ਸੰਭਾਵਨਾ ਇੱਕੋ ਹੈ, ਇਸ ਲਈ ਸਿੱਧਾ ਅਨੁਪਾਤ ਵਰਤੋ।",
);

const REVERSE_EXPLANATION = explanation(
  "दिए गए प्रायिकता संबंध को उलटकर अज्ञात परिणाम-संख्या निकालें।",
  "प्रायिकता = अनुकूल परिणाम / कुल परिणाम लिखकर अज्ञात राशि अलग करें।",
  "भिन्न को केवल तभी उलटें जब समीकरण को बीजगणितीय रूप से पुनर्व्यवस्थित किया गया हो।",
  "ਦਿੱਤੇ ਸੰਭਾਵਨਾ ਸੰਬੰਧ ਨੂੰ ਉਲਟ ਕੇ ਅਣਜਾਣ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ।",
  "ਸੰਭਾਵਨਾ = ਅਨੁਕੂਲ ਨਤੀਜੇ / ਕੁੱਲ ਨਤੀਜੇ ਲਿਖ ਕੇ ਅਣਜਾਣ ਰਕਮ ਅਲੱਗ ਕਰੋ।",
  "ਭਿੰਨ ਨੂੰ ਸਿਰਫ਼ ਸਮੀਕਰਨ ਨੂੰ ਠੀਕ ਤਰ੍ਹਾਂ ਦੁਬਾਰਾ ਲਿਖਣ ਤੋਂ ਬਾਅਦ ਹੀ ਉਲਟੋ।",
);

const COMPLEMENT_EXPLANATION = explanation(
  "प्रत्यक्ष घटना की बजाय उसके पूरक का उपयोग करें।",
  "P(पूरक) = 1 - P(घटना)।",
  "'कम से कम एक' और 'घटना न हो' जैसे प्रश्नों में पूरक अक्सर सबसे छोटा रास्ता है।",
  "ਸਿੱਧੀ ਘਟਨਾ ਦੀ ਥਾਂ ਉਸ ਦੀ ਪੂਰਕ ਘਟਨਾ ਵਰਤੋ।",
  "P(ਪੂਰਕ) = 1 - P(ਘਟਨਾ)।",
  "'ਘੱਟੋ-ਘੱਟ ਇੱਕ' ਜਾਂ 'ਘਟਨਾ ਨਾ ਹੋਵੇ' ਵਾਲੇ ਸਵਾਲਾਂ ਵਿੱਚ ਪੂਰਕ ਅਕਸਰ ਸਭ ਤੋਂ ਛੋਟਾ ਤਰੀਕਾ ਹੈ।",
);

const COIN_COUNT_EXPLANATION = explanation(
  "सभी सिक्का-उछाल क्रमों की संख्या और आवश्यक चित की संख्या गिनें।",
  "n उछालों में कुल क्रम 2^n होते हैं; ठीक k चित के लिए उपयुक्त संयोजन गिनें।",
  "क्रमों की कुल संख्या और चुने गए चित-स्थानों की संख्या को अलग रखें।",
  "ਸਿੱਕਾ ਉਛਾਲ ਦੇ ਸਾਰੇ ਕ੍ਰਮ ਅਤੇ ਲੋੜੀਂਦੇ ਚਿੱਤਾਂ ਦੀ ਗਿਣਤੀ ਕਰੋ।",
  "n ਉਛਾਲਾਂ ਵਿੱਚ ਕੁੱਲ ਕ੍ਰਮ 2^n ਹੁੰਦੇ ਹਨ; ਠੀਕ k ਚਿੱਤਾਂ ਲਈ ਢੁੱਕਵੇਂ ਸੰਚਯ ਗਿਣੋ।",
  "ਕੁੱਲ ਕ੍ਰਮਾਂ ਅਤੇ ਚਿੱਤ ਵਾਲੀਆਂ ਚੁਣੀਆਂ ਥਾਵਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਵੱਖ ਰੱਖੋ।",
);

const DICE_EXPLANATION = explanation(
  "पासे के सभी समान-संभावित परिणामों में शर्त पूरी करने वाले परिणाम गिनें।",
  "एक पासे के लिए 6 और दो अलग पहचाने जाने वाले पासों के लिए 36 क्रमित परिणाम लें।",
  "दो पासों में (a,b) और (b,a) को अलग परिणाम माना जाता है।",
  "ਪਾਸੇ ਦੇ ਸਾਰੇ ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜਿਆਂ ਵਿੱਚੋਂ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ ਗਿਣੋ।",
  "ਇੱਕ ਪਾਸੇ ਲਈ 6 ਅਤੇ ਦੋ ਵੱਖ ਪਛਾਣ ਵਾਲੇ ਪਾਸਿਆਂ ਲਈ 36 ਕ੍ਰਮਿਤ ਨਤੀਜੇ ਲਵੋ।",
  "ਦੋ ਪਾਸਿਆਂ ਵਿੱਚ (a,b) ਅਤੇ (b,a) ਵੱਖਰੇ ਨਤੀਜੇ ਹਨ।",
);

const CARD_EXPLANATION = explanation(
  "52 पत्तों की मानक गड्डी में संबंधित रैंक, सूट या रंग के पत्ते गिनें।",
  "प्रायिकता के अंश में केवल घटना को पूरा करने वाले पत्ते और हर में 52 रखें।",
  "'या' वाले प्रश्न में साझा पत्ता दो बार न गिनें; 'नहीं' वाले प्रश्न में पूरक उपयोगी है।",
  "52 ਪੱਤਿਆਂ ਦੀ ਮਿਆਰੀ ਗੱਡੀ ਵਿੱਚ ਲੋੜੀਂਦੇ ਦਰਜੇ, ਸੂਟ ਜਾਂ ਰੰਗ ਵਾਲੇ ਪੱਤੇ ਗਿਣੋ।",
  "ਸੰਭਾਵਨਾ ਦੇ ਅੰਸ਼ ਵਿੱਚ ਸਿਰਫ਼ ਘਟਨਾ ਪੂਰੀ ਕਰਨ ਵਾਲੇ ਪੱਤੇ ਅਤੇ ਹਰ ਵਿੱਚ 52 ਰੱਖੋ।",
  "'ਜਾਂ' ਵਾਲੇ ਸਵਾਲ ਵਿੱਚ ਸਾਂਝਾ ਪੱਤਾ ਦੋ ਵਾਰ ਨਾ ਗਿਣੋ; 'ਨਹੀਂ' ਲਈ ਪੂਰਕ ਲਾਭਦਾਇਕ ਹੈ।",
);

const URN_EXPLANATION = explanation(
  "चयन एक साथ और बिना पुनःस्थापन के है, इसलिए संयोजन आधारित नमूना-स्थान बनाएं।",
  "कुल चयन C(कुल गेंदें, चुनी गेंदें) और अनुकूल चयन घटना की संरचना से गिनें।",
  "एक साथ चयन में क्रम महत्वपूर्ण नहीं है; लाल-नीली संरचना को संयोजन से गिनें।",
  "ਚੋਣ ਇਕੱਠੇ ਅਤੇ ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਹੁੰਦੀ ਹੈ, ਇਸ ਲਈ ਸੰਚਯ-ਆਧਾਰਿਤ ਨਮੂਨਾ ਅਵਕਾਸ ਬਣਾਓ।",
  "ਕੁੱਲ ਚੋਣ C(ਕੁੱਲ ਗੇਂਦਾਂ, ਚੁਣੀਆਂ ਗੇਂਦਾਂ) ਅਤੇ ਅਨੁਕੂਲ ਚੋਣ ਘਟਨਾ ਦੀ ਬਣਤਰ ਤੋਂ ਗਿਣੋ।",
  "ਇਕੱਠੀ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ; ਲਾਲ-ਨੀਲੀ ਬਣਤਰ ਨੂੰ ਸੰਚਯ ਨਾਲ ਗਿਣੋ।",
);

const FAMILY_SPECS: Readonly<Record<string, NativeFamilySpec>> = {
  "Direct Event": {
    stem: pair(
      "एक पात्र में {total} समान रूप से संभावित {object} हैं, जिनमें से {favourable} दी गई शर्त पूरी करते हैं। एक को यादृच्छिक रूप से चुना जाता है। दी गई घटना की प्रायिकता क्या है? {answerInstruction}",
      "ਇੱਕ ਭਾਂਡੇ ਵਿੱਚ {total} ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ {object} ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ {favourable} ਦਿੱਤੀ ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ। ਇੱਕ ਨੂੰ ਯਾਦ੍ਰਿਚਛਿਕ ਤੌਰ ਤੇ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਦਿੱਤੀ ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("प्रत्यक्ष घटना", "ਸਿੱਧੀ ਘਟਨਾ"),
    explanation: DIRECT_EXPLANATION,
  },
  "Reverse Favourable": {
    stem: pair(
      "कुल {total} समान रूप से संभावित परिणाम हैं और {context} में से किसी एक के चुने जाने की प्रायिकता {probability} है। अनुकूल परिणामों की संख्या कितनी है? {answerInstruction}",
      "ਕੁੱਲ {total} ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ ਹਨ ਅਤੇ {context} ਵਿੱਚੋਂ ਕਿਸੇ ਇੱਕ ਦੇ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ {probability} ਹੈ। ਅਨੁਕੂਲ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("अनुकूल परिणामों की उलटी गणना", "ਅਨੁਕੂਲ ਨਤੀਜਿਆਂ ਦੀ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: REVERSE_EXPLANATION,
  },
  "Reverse Total": {
    stem: pair(
      "{favourable} परिणाम अनुकूल हैं और उनकी प्रायिकता {probability} है। पूर्ण नमूना-स्थान में कुल समान रूप से संभावित परिणाम कितने हैं? {answerInstruction}",
      "{favourable} ਨਤੀਜੇ ਅਨੁਕੂਲ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਦੀ ਸੰਭਾਵਨਾ {probability} ਹੈ। ਪੂਰੇ ਨਮੂਨਾ ਅਵਕਾਸ ਵਿੱਚ ਕੁੱਲ ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜੇ ਕਿੰਨੇ ਹਨ? {answerInstruction}",
    ),
    eventWording: pair("कुल परिणामों की उलटी गणना", "ਕੁੱਲ ਨਤੀਜਿਆਂ ਦੀ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: REVERSE_EXPLANATION,
  },
  "Certain Impossible Possible": {
    stem: pair(
      "1 से {n} तक की पूर्णांकों की सूची में से एक संख्या समान संभावना से चुनी जाती है। {eventLabel} चुने जाने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "1 ਤੋਂ {n} ਤੱਕ ਦੇ ਪੂਰਨ ਅੰਕਾਂ ਵਿੱਚੋਂ ਇੱਕ ਸੰਖਿਆ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। {eventLabel} ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("निश्चित, असंभव या संभावित घटना", "ਨਿਸ਼ਚਿਤ, ਅਸੰਭਵ ਜਾਂ ਸੰਭਵ ਘਟਨਾ"),
    explanation: DIRECT_EXPLANATION,
  },
  "Frequency Event": {
    stem: pair(
      "एक डिब्बे में {red} लाल, {blue} नीले और {green} हरे टोकन हैं। एक टोकन समान संभावना से चुना जाता है। उसके {target} होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਡੱਬੇ ਵਿੱਚ {red} ਲਾਲ, {blue} ਨੀਲੇ ਅਤੇ {green} ਹਰੇ ਟੋਕਨ ਹਨ। ਇੱਕ ਟੋਕਨ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {target} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("आवृत्ति आधारित घटना", "ਆਵ੍ਰਿੱਤੀ-ਆਧਾਰਿਤ ਘਟਨਾ"),
    explanation: DIRECT_EXPLANATION,
  },
  "Missing Event Count": {
    stem: pair(
      "कुल {total} परिणाम समान रूप से संभावित हैं और घटना की प्रायिकता {probability} है। घटना में आने वाले परिणामों की संख्या ज्ञात करें। {answerInstruction}",
      "ਕੁੱਲ {total} ਨਤੀਜੇ ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਹਨ ਅਤੇ ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ {probability} ਹੈ। ਘਟਨਾ ਵਿੱਚ ਆਉਣ ਵਾਲੇ ਨਤੀਜਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("घटना-गणना की उलटी गणना", "ਘਟਨਾ-ਗਿਣਤੀ ਦੀ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: REVERSE_EXPLANATION,
  },
  "Complement Event": {
    stem: pair(
      "{eventLabel} होने की प्रायिकता {givenProbability} है। इस घटना के न होने की प्रायिकता क्या है? {answerInstruction}",
      "{eventLabel} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ {givenProbability} ਹੈ। ਇਸ ਘਟਨਾ ਦੇ ਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("पूरक घटना", "ਪੂਰਕ ਘਟਨਾ"),
    explanation: COMPLEMENT_EXPLANATION,
  },
  "At Least One": {
    stem: pair(
      "एक निष्पक्ष सिक्का {trials} बार उछाला जाता है। कम से कम एक चित आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("कम से कम एक चित", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਚਿੱਤ"),
    explanation: COMPLEMENT_EXPLANATION,
  },
  "None Success": {
    stem: pair(
      "एक निष्पक्ष सिक्का {trials} बार उछाला जाता है। एक भी चित न आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਇੱਕ ਵੀ ਚਿੱਤ ਨਾ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("कोई चित नहीं", "ਕੋਈ ਚਿੱਤ ਨਹੀਂ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "Exactly One": {
    stem: pair(
      "एक निष्पक्ष सिक्का {trials} बार उछाला जाता है। ठीक एक चित आने की प्रायिकता क्या है? {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ ਇੱਕ ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("ठीक एक चित", "ਠੀਕ ਇੱਕ ਚਿੱਤ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "Exactly K": {
    stem: pair(
      "एक निष्पक्ष सिक्का {trials} बार उछाला जाता है। ठीक {k} चित आने की प्रायिकता क्या है? {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ {k} ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("ठीक k चित", "ਠੀਕ k ਚਿੱਤ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "At Most K": {
    stem: pair(
      "एक निष्पक्ष सिक्का {trials} बार उछाला जाता है। अधिकतम {k} चित आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਵੱਧ ਤੋਂ ਵੱਧ {k} ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("अधिकतम k चित", "ਵੱਧ ਤੋਂ ਵੱਧ k ਚਿੱਤ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "All Or Not All": {
    stem: pair(
      "एक निष्पक्ष सिक्का {trials} बार उछाला जाता है। सभी उछालों में एक ही सतह आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {trials} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਸਾਰੇ ਉਛਾਲਾਂ ਵਿੱਚ ਇੱਕੋ ਪਾਸਾ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("सभी उछाल समान", "ਸਾਰੇ ਉਛਾਲ ਇੱਕੋ ਜਿਹੇ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "Coin Pattern": {
    stem: pair(
      "एक निष्पक्ष सिक्का क्रम से {tosses} बार उछाला जाता है। ठीक {pattern} क्रम आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ ਕ੍ਰਮ ਨਾਲ {tosses} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ {pattern} ਕ੍ਰਮ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("सिक्का क्रम", "ਸਿੱਕਾ ਕ੍ਰਮ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "Coin Head Count": {
    stem: pair(
      "एक निष्पक्ष सिक्का {tosses} बार उछाला जाता है। ठीक {heads} उछालों में चित आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਸਿੱਕਾ {tosses} ਵਾਰ ਉਛਾਲਿਆ ਜਾਂਦਾ ਹੈ। ਠੀਕ {heads} ਉਛਾਲਾਂ ਵਿੱਚ ਚਿੱਤ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("चित की संख्या", "ਚਿੱਤਾਂ ਦੀ ਗਿਣਤੀ"),
    explanation: COIN_COUNT_EXPLANATION,
  },
  "Single Die Property": {
    stem: pair(
      "एक निष्पक्ष छह-मुखी पासा एक बार फेंका जाता है। परिणाम के {property} शर्त पूरी करने की प्रायिकता ज्ञात करें; जहाँ आवश्यक हो वहाँ सीमा {threshold} लें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਛੇ-ਮੁਖੀ ਪਾਸਾ ਇੱਕ ਵਾਰ ਸੁੱਟਿਆ ਜਾਂਦਾ ਹੈ। ਨਤੀਜੇ ਵੱਲੋਂ {property} ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ; ਜਿੱਥੇ ਲੋੜ ਹੋਵੇ ਉੱਥੇ ਸੀਮਾ {threshold} ਲਵੋ। {answerInstruction}",
    ),
    eventWording: pair("एक पासे का गुणधर्म", "ਇੱਕ ਪਾਸੇ ਦਾ ਗੁਣ"),
    explanation: DICE_EXPLANATION,
  },
  "Two Dice Sum": {
    stem: pair(
      "दो अलग पहचाने जाने वाले निष्पक्ष पासे साथ फेंके जाते हैं। उनके योग के {targetSum} होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਦੋ ਵੱਖ ਪਛਾਣ ਵਾਲੇ ਨਿਰਪੱਖ ਪਾਸੇ ਇਕੱਠੇ ਸੁੱਟੇ ਜਾਂਦੇ ਹਨ। ਉਨ੍ਹਾਂ ਦੇ ਜੋੜ ਦੇ {targetSum} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("दो पासों का योग", "ਦੋ ਪਾਸਿਆਂ ਦਾ ਜੋੜ"),
    explanation: DICE_EXPLANATION,
  },
  "Two Dice Product Parity": {
    stem: pair(
      "दो अलग पहचाने जाने वाले निष्पक्ष पासे साथ फेंके जाते हैं। {eventType} घटना की प्रायिकता ज्ञात करें; जहाँ लागू हो वहाँ लक्ष्य गुणनफल {targetProduct} है। {answerInstruction}",
      "ਦੋ ਵੱਖ ਪਛਾਣ ਵਾਲੇ ਨਿਰਪੱਖ ਪਾਸੇ ਇਕੱਠੇ ਸੁੱਟੇ ਜਾਂਦੇ ਹਨ। {eventType} ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ; ਜਿੱਥੇ ਲਾਗੂ ਹੋਵੇ ਉੱਥੇ ਲਕਸ਼ ਗੁਣਨਫਲ {targetProduct} ਹੈ। {answerInstruction}",
    ),
    eventWording: pair("दो पासों का गुणनफल या सम-विषमता", "ਦੋ ਪਾਸਿਆਂ ਦਾ ਗੁਣਨਫਲ ਜਾਂ ਸਮ-ਵਿਸਮਤਾ"),
    explanation: DICE_EXPLANATION,
  },
  "Spinner Event": {
    stem: pair(
      "एक निष्पक्ष घूमने वाले चक्र में {sectors} बराबर खंड हैं, जिनमें से {favourableSectors} चिह्नित हैं। चिह्नित खंड पर रुकने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਘੁੰਮਣ ਵਾਲੇ ਚੱਕਰ ਵਿੱਚ {sectors} ਬਰਾਬਰ ਖੰਡ ਹਨ, ਜਿਨ੍ਹਾਂ ਵਿੱਚੋਂ {favourableSectors} ਨਿਸ਼ਾਨਿਤ ਹਨ। ਨਿਸ਼ਾਨਿਤ ਖੰਡ ਉੱਤੇ ਰੁਕਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("चक्र की घटना", "ਚੱਕਰ ਦੀ ਘਟਨਾ"),
    explanation: DIRECT_EXPLANATION,
  },
  "Number Property": {
    stem: pair(
      "{lower} से {upper} तक, दोनों सहित, एक पूर्णांक समान संभावना से चुना जाता है। उसके {property} गुणधर्म को पूरा करने की प्रायिकता ज्ञात करें; जहाँ लागू हो वहाँ भाजक {divisor} लें। {answerInstruction}",
      "{lower} ਤੋਂ {upper} ਤੱਕ, ਦੋਵੇਂ ਸਮੇਤ, ਇੱਕ ਪੂਰਨ ਅੰਕ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {property} ਗੁਣ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ; ਜਿੱਥੇ ਲਾਗੂ ਹੋਵੇ ਉੱਥੇ ਭਾਜਕ {divisor} ਲਵੋ। {answerInstruction}",
    ),
    eventWording: pair("संख्या का गुणधर्म", "ਸੰਖਿਆ ਦਾ ਗੁਣ"),
    explanation: DIRECT_EXPLANATION,
  },
  "Reverse Spinner Count": {
    stem: pair(
      "एक निष्पक्ष चक्र में {sectors} बराबर खंड हैं और चिह्नित घटना की प्रायिकता {answer} है। चिह्नित खंडों की संख्या कितनी है? {answerInstruction}",
      "ਇੱਕ ਨਿਰਪੱਖ ਚੱਕਰ ਵਿੱਚ {sectors} ਬਰਾਬਰ ਖੰਡ ਹਨ ਅਤੇ ਨਿਸ਼ਾਨਿਤ ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ {answer} ਹੈ। ਨਿਸ਼ਾਨਿਤ ਖੰਡਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("चक्र की उलटी गणना", "ਚੱਕਰ ਦੀ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: REVERSE_EXPLANATION,
  },
  "Card Rank": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके {rank} रैंक का होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {rank} ਦਰਜੇ ਦਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्ते का रैंक", "ਪੱਤੇ ਦਾ ਦਰਜਾ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Suit": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके {suit} सूट का होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {suit} ਸੂਟ ਦਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्ते का सूट", "ਪੱਤੇ ਦਾ ਸੂਟ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Colour": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके {colour} होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {colour} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्ते का रंग", "ਪੱਤੇ ਦਾ ਰੰਗ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Face": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके फेस कार्ड होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਤਸਵੀਰ ਵਾਲਾ ਪੱਤਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("फेस कार्ड", "ਤਸਵੀਰ ਵਾਲਾ ਪੱਤਾ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Union": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके {rank} रैंक का या {suit} सूट का होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {rank} ਦਰਜੇ ਦਾ ਜਾਂ {suit} ਸੂਟ ਦਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्तों का संघ", "ਪੱਤਿਆਂ ਦਾ ਯੂਨੀਅਨ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Complement": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके {suit} सूट का न होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {suit} ਸੂਟ ਦਾ ਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्ते की पूरक घटना", "ਪੱਤੇ ਦੀ ਪੂਰਕ ਘਟਨਾ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Intersection": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से एक पत्ता निकाला जाता है। उसके {suit} सूट का {rank} होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਇੱਕ ਪੱਤਾ ਕੱਢਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ {suit} ਸੂਟ ਦਾ {rank} ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्ते का प्रतिच्छेद", "ਪੱਤੇ ਦਾ ਇੰਟਰਸੈਕਸ਼ਨ"),
    explanation: CARD_EXPLANATION,
  },
  "Card Reverse Count": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी में किसी घटना की प्रायिकता {answer} है। उस घटना को पूरा करने वाले पत्तों की संख्या ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚ ਕਿਸੇ ਘਟਨਾ ਦੀ ਸੰਭਾਵਨਾ {answer} ਹੈ। ਉਸ ਘਟਨਾ ਨੂੰ ਪੂਰਾ ਕਰਨ ਵਾਲੇ ਪੱਤਿਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्तों की उलटी गणना", "ਪੱਤਿਆਂ ਦੀ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: REVERSE_EXPLANATION,
  },
  "Urn Single": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। एक गेंद समान संभावना से निकाली जाती है। उसके लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਇੱਕ ਗੇਂਦ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ਉਸ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("एक गेंद का चयन", "ਇੱਕ ਗੇਂਦ ਦੀ ਚੋਣ"),
    explanation: DIRECT_EXPLANATION,
  },
  "Urn Same Type": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के {draw} गेंदें एक साथ चुनी जाती हैं। सभी चुनी गेंदों के एक ही रंग की होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ {draw} ਗੇਂਦਾਂ ਇਕੱਠੇ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਸਾਰੀਆਂ ਚੁਣੀਆਂ ਗੇਂਦਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("एक ही रंग की गेंदें", "ਇੱਕੋ ਰੰਗ ਦੀਆਂ ਗੇਂਦਾਂ"),
    explanation: URN_EXPLANATION,
  },
  "Urn Both Colours": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के {draw} गेंदें एक साथ चुनी जाती हैं। चयन में दोनों रंग आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ {draw} ਗੇਂਦਾਂ ਇਕੱਠੇ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਚੋਣ ਵਿੱਚ ਦੋਵੇਂ ਰੰਗ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("दोनों रंग", "ਦੋਵੇਂ ਰੰਗ"),
    explanation: URN_EXPLANATION,
  },
  "Urn Exact Composition": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के {draw} गेंदें एक साथ चुनी जाती हैं। ठीक {exactRed} चुनी गेंदों के लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ {draw} ਗੇਂਦਾਂ ਇਕੱਠੇ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਠੀਕ {exactRed} ਚੁਣੀਆਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("ठीक लाल गेंदों की संख्या", "ਠੀਕ ਲਾਲ ਗੇਂਦਾਂ ਦੀ ਗਿਣਤੀ"),
    explanation: URN_EXPLANATION,
  },
  "Urn None": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के {draw} गेंदें एक साथ चुनी जाती हैं। एक भी लाल गेंद न चुने जाने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ {draw} ਗੇਂਦਾਂ ਇਕੱਠੇ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਇੱਕ ਵੀ ਲਾਲ ਗੇਂਦ ਨਾ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("कोई लाल गेंद नहीं", "ਕੋਈ ਲਾਲ ਗੇਂਦ ਨਹੀਂ"),
    explanation: URN_EXPLANATION,
  },
  "Urn At Least One": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के {draw} गेंदें एक साथ चुनी जाती हैं। कम से कम एक लाल गेंद चुने जाने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ {draw} ਗੇਂਦਾਂ ਇਕੱਠੇ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("कम से कम एक लाल गेंद", "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ"),
    explanation: COMPLEMENT_EXPLANATION,
  },
  "Urn Reverse Count": {
    stem: pair(
      "एक थैले में कुल {urnTotal} गेंदें हैं और लाल गेंद निकलने की प्रायिकता {answer} है। थैले में लाल गेंदों की संख्या कितनी है? {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ ਕੁੱਲ {urnTotal} ਗੇਂਦਾਂ ਹਨ ਅਤੇ ਲਾਲ ਗੇਂਦ ਨਿਕਲਣ ਦੀ ਸੰਭਾਵਨਾ {answer} ਹੈ। ਥੈਲੇ ਵਿੱਚ ਲਾਲ ਗੇਂਦਾਂ ਦੀ ਗਿਣਤੀ ਕਿੰਨੀ ਹੈ? {answerInstruction}",
    ),
    eventWording: pair("गेंदों की उलटी गणना", "ਗੇਂਦਾਂ ਦੀ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: REVERSE_EXPLANATION,
  },
  "Urn Combination": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के {draw} गेंदें एक साथ चुनी जाती हैं। ठीक {exactRed} गेंदों के लाल होने की प्रायिकता संयोजन से ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ {draw} ਗੇਂਦਾਂ ਇਕੱਠੇ ਚੁਣੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਠੀਕ {exactRed} ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਸੰਚਯ ਨਾਲ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("संयोजन आधारित गेंद चयन", "ਸੰਚਯ-ਆਧਾਰਿਤ ਗੇਂਦ ਚੋਣ"),
    explanation: URN_EXPLANATION,
  },
};

function pick<T extends NativePair>(language: ProbabilityNativeLanguage, value: T): string {
  return value[language];
}

export const PRB_001_NATIVE_FAMILY_COUNT = Object.keys(FAMILY_SPECS).length;

export function buildPrb001NativeEditorialLibrary(): readonly Prb001NativeEditorialEntry[] {
  return PRB_001_LIBRARIES.language.flatMap((source) => {
    const spec = FAMILY_SPECS[source.eventWording];
    if (!spec) throw new Error(`Missing PRB-001 native editorial family for ${source.qlId}: ${source.eventWording}`);
    return (["hi", "pa"] as const).map((language) => ({
      packageId: "PRB-001" as const,
      qlId: source.qlId,
      sourceStemTemplateId: source.stemTemplateId,
      language,
      sourceLanguage: "en" as const,
      editorialStatus: "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW" as const,
      contextFamily: source.contextFamily,
      eventWording: pick(language, spec.eventWording),
      stemTemplate: pick(language, spec.stem),
      explanation: spec.explanation[language],
      learningOnly: source.qlId === "PRB-QL-004" || source.qlId === "PRB-QL-010",
      questionStudioEnabled: false as const,
      publiclyPublishable: false as const,
    }));
  });
}

export function getPrb001NativeEditorialEntry(
  qlId: string,
  language: ProbabilityNativeLanguage,
): Prb001NativeEditorialEntry {
  const entry = buildPrb001NativeEditorialLibrary().find(
    (candidate) => candidate.qlId === qlId && candidate.language === language,
  );
  if (!entry) throw new Error(`Missing PRB-001 ${language} editorial entry for ${qlId}.`);
  return entry;
}

const SIMPLE_BINDINGS: Readonly<Record<string, NativePair>> = {
  tickets: pair("टिकट", "ਟਿਕਟਾਂ"),
  bulbs: pair("बल्ब", "ਬਲਬ"),
  balls: pair("गेंदें", "ਗੇਂਦਾਂ"),
  books: pair("पुस्तकें", "ਕਿਤਾਬਾਂ"),
  "winning tickets": pair("विजेता टिकट", "ਜਿੱਤਣ ਵਾਲੀਆਂ ਟਿਕਟਾਂ"),
  "defective bulbs": pair("खराब बल्ब", "ਖਰਾਬ ਬਲਬ"),
  "qualified candidates": pair("योग्य अभ्यर्थी", "ਯੋਗ ਉਮੀਦਵਾਰ"),
  "female employees": pair("महिला कर्मचारी", "ਮਹਿਲਾ ਕਰਮਚਾਰੀ"),
  "red balls": pair("लाल गेंदें", "ਲਾਲ ਗੇਂਦਾਂ"),
  "approved loan applications": pair("स्वीकृत ऋण आवेदन", "ਮਨਜ਼ੂਰ ਕਰਜ਼ਾ ਅਰਜ਼ੀਆਂ"),
  "successful candidates": pair("सफल अभ्यर्थी", "ਸਫਲ ਉਮੀਦਵਾਰ"),
  red: pair("लाल", "ਲਾਲ"),
  blue: pair("नीला", "ਨੀਲਾ"),
  green: pair("हरा", "ਹਰਾ"),
  black: pair("काला", "ਕਾਲਾ"),
  ace: pair("इक्का", "ਇੱਕਾ"),
  king: pair("बादशाह", "ਬਾਦਸ਼ਾਹ"),
  queen: pair("बेगम", "ਬੇਗਮ"),
  jack: pair("गुलाम", "ਗੁਲਾਮ"),
  hearts: pair("हार्ट", "ਹਾਰਟ"),
  diamonds: pair("डायमंड", "ਡਾਇਮੰਡ"),
  clubs: pair("क्लब", "ਕਲੱਬ"),
  spades: pair("स्पेड", "ਸਪੇਡ"),
  EVEN: pair("सम", "ਸਮ"),
  PRIME: pair("अभाज्य", "ਅਭਾਜ"),
  GREATER_THAN: pair("निर्धारित सीमा से अधिक", "ਦਿੱਤੀ ਸੀਮਾ ਤੋਂ ਵੱਧ"),
  LESS_THAN: pair("निर्धारित सीमा से कम", "ਦਿੱਤੀ ਸੀਮਾ ਤੋਂ ਘੱਟ"),
  DIVISIBLE: pair("दिए गए भाजक से विभाज्य", "ਦਿੱਤੇ ਭਾਜਕ ਨਾਲ ਵੰਡਯੋਗ"),
  COMPOSITE: pair("संयोज्य", "ਸੰਯੁਕਤ"),
  PRODUCT: pair("लक्ष्य गुणनफल", "ਲਕਸ਼ ਗੁਣਨਫਲ"),
  SAME_PARITY: pair("दोनों परिणाम समान सम-विषमता वाले हों", "ਦੋਵੇਂ ਨਤੀਜਿਆਂ ਦੀ ਸਮ-ਵਿਸਮਤਾ ਇੱਕੋ ਹੋਵੇ"),
  DIFFERENT_PARITY: pair("दोनों परिणाम अलग सम-विषमता वाले हों", "ਦੋਵੇਂ ਨਤੀਜਿਆਂ ਦੀ ਸਮ-ਵਿਸਮਤਾ ਵੱਖ ਹੋਵੇ"),
  "a machine passes inspection": pair("मशीन निरीक्षण में सफल होती है", "ਮਸ਼ੀਨ ਜਾਂਚ ਵਿੱਚ ਪਾਸ ਹੁੰਦੀ ਹੈ"),
  "a candidate qualifies": pair("अभ्यर्थी योग्य घोषित होता है", "ਉਮੀਦਵਾਰ ਯੋਗ ਘੋਸ਼ਿਤ ਹੁੰਦਾ ਹੈ"),
  "a train arrives on time": pair("ट्रेन समय पर पहुँचती है", "ਰੇਲਗੱਡੀ ਸਮੇਂ ਤੇ ਪਹੁੰਚਦੀ ਹੈ"),
};

function nativeAnswerInstruction(language: ProbabilityNativeLanguage, qlId: string): string {
  const registry = PRB_001_LIBRARIES.registry.find((entry) => entry.qlId === qlId);
  if (!registry) throw new Error(`Missing PRB-001 registry entry for ${qlId}.`);
  if (registry.answerDimension === "COUNT") {
    return language === "hi"
      ? "उत्तर सटीक पूर्ण संख्या में दें।"
      : "ਉੱਤਰ ਸਹੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਦਿਓ।";
  }
  return language === "hi"
    ? "अंतिम प्रायिकता को सरलतम सटीक भिन्न में दें।"
    : "ਅੰਤਿਮ ਸੰਭਾਵਨਾ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਸਹੀ ਭਿੰਨ ਵਿੱਚ ਦਿਓ।";
}

function localizePattern(value: string, language: ProbabilityNativeLanguage): string {
  if (!/^[HT]+$/u.test(value)) throw new Error(`Unsupported PRB-001 coin pattern: ${value}`);
  const head = getProbabilityNativeTerm("HEAD", language);
  const tail = getProbabilityNativeTerm("TAIL", language);
  return [...value].map((token) => token === "H" ? head : tail).join("-");
}

export function localizePrb001NativeBindingValue(
  key: string,
  value: unknown,
  language: ProbabilityNativeLanguage,
  qlId: string,
): string {
  if (key === "answerInstruction") return nativeAnswerInstruction(language, qlId);
  if (typeof value === "number" || typeof value === "bigint") return value.toString();
  if (typeof value !== "string") {
    throw new Error(`Unsupported PRB-001 native binding type for ${key}: ${typeof value}.`);
  }
  if (isProbabilityMathOrNumericOption(value)) return value;
  if (key === "pattern") return localizePattern(value, language);

  const exact = SIMPLE_BINDINGS[value];
  if (exact) return pick(language, exact);

  const notExceeding = /^an integer not exceeding (\d+)$/u.exec(value);
  if (notExceeding) {
    return language === "hi"
      ? `${notExceeding[1]} से अधिक न होने वाला पूर्णांक`
      : `${notExceeding[1]} ਤੋਂ ਵੱਧ ਨਾ ਹੋਣ ਵਾਲਾ ਪੂਰਨ ਅੰਕ`;
  }
  const greaterThan = /^an integer greater than (\d+)$/u.exec(value);
  if (greaterThan) {
    return language === "hi"
      ? `${greaterThan[1]} से बड़ा पूर्णांक`
      : `${greaterThan[1]} ਤੋਂ ਵੱਡਾ ਪੂਰਨ ਅੰਕ`;
  }
  if (value === "an even integer") return language === "hi" ? "एक सम पूर्णांक" : "ਇੱਕ ਸਮ ਪੂਰਨ ਅੰਕ";

  throw new Error(
    `PRB-001 ${language} binding is fail-closed for ${qlId}/${key}: ${JSON.stringify(value)}.`,
  );
}

export function getPrb001NativeEditorialReadinessSummary(): Readonly<{
  englishQlCount: number;
  nativeEntryCount: number;
  hindiEntryCount: number;
  punjabiEntryCount: number;
  familyCount: number;
  draftCount: number;
  questionStudioEnabledCount: number;
  publiclyPublishableCount: number;
}> {
  const library = buildPrb001NativeEditorialLibrary();
  return {
    englishQlCount: PRB_001_LIBRARIES.language.length,
    nativeEntryCount: library.length,
    hindiEntryCount: library.filter((entry) => entry.language === "hi").length,
    punjabiEntryCount: library.filter((entry) => entry.language === "pa").length,
    familyCount: PRB_001_NATIVE_FAMILY_COUNT,
    draftCount: library.filter((entry) => entry.editorialStatus === "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW").length,
    questionStudioEnabledCount: library.filter((entry) => entry.questionStudioEnabled).length,
    publiclyPublishableCount: library.filter((entry) => entry.publiclyPublishable).length,
  };
}
