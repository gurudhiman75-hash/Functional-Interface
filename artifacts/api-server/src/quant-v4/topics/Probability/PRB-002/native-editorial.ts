import { PRB_002_LIBRARIES } from "./foundation/library";
import type { ProbabilityNativeLanguage } from "../multilingual-foundation";
import { isProbabilityMathOrNumericOption } from "../native-language-primitives";

export type Prb002NativeEditorialStatus = "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW";

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

export type Prb002NativeEditorialEntry = Readonly<{
  packageId: "PRB-002";
  qlId: string;
  sourceStemTemplateId: string;
  language: ProbabilityNativeLanguage;
  sourceLanguage: "en";
  editorialStatus: Prb002NativeEditorialStatus;
  contextFamily: string;
  eventWording: string;
  stemTemplate: string;
  explanation: NativeExplanation;
  learningOnly: false;
  answerKeyAuthority: "ENGLISH_RUNTIME";
  optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX";
  questionStudioEnabled: false;
  publiclyPublishable: false;
}>;

const pair = (hi: string, pa: string): NativePair => ({ hi, pa });
const pick = (language: ProbabilityNativeLanguage, value: NativePair): string => value[language];
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

const SUCCESSIVE_EXPLANATION = explanation(
  "हर ड्रॉ की प्रायिकता उसी समय उपलब्ध गेंदों और पुनःस्थापन की शर्त से तय करें।",
  "क्रमिक घटनाओं के लिए आवश्यक चरणों की प्रायिकताएँ गुणा करें; बिना पुनःस्थापन के हर अगला हर बदलता है।",
  "पुनःस्थापन होने पर ड्रॉ स्वतंत्र रहते हैं; बिना पुनःस्थापन के वे आश्रित होते हैं।",
  "ਹਰ ਡਰਾਅ ਦੀ ਸੰਭਾਵਨਾ ਉਸ ਵੇਲੇ ਮੌਜੂਦ ਗੇਂਦਾਂ ਅਤੇ ਵਾਪਸ ਰੱਖਣ ਦੀ ਸ਼ਰਤ ਤੋਂ ਨਿਰਧਾਰਤ ਕਰੋ।",
  "ਲਗਾਤਾਰ ਘਟਨਾਵਾਂ ਲਈ ਲੋੜੀਂਦੇ ਪੜਾਅਵਾਂ ਦੀਆਂ ਸੰਭਾਵਨਾਵਾਂ ਗੁਣਾ ਕਰੋ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਅਗਲਾ ਹਰ ਬਦਲਦਾ ਹੈ।",
  "ਵਾਪਸ ਰੱਖਣ ਤੇ ਡਰਾਅ ਸੁਤੰਤਰ ਰਹਿੰਦੇ ਹਨ; ਵਾਪਸ ਨਾ ਰੱਖਣ ਤੇ ਉਹ ਆਸ਼੍ਰਿਤ ਹੁੰਦੇ ਹਨ।",
);

const CONDITIONAL_EXPLANATION = explanation(
  "दी गई शर्त को नया नमूना-स्थान मानकर केवल उसी सीमित समूह में गणना करें।",
  "P(A|B) के लिए हर में B के परिणाम और अंश में A तथा B दोनों को पूरा करने वाले परिणाम रखें।",
  "शर्त लगने के बाद पुराने पूर्ण नमूना-स्थान का हर उपयोग न करें।",
  "ਦਿੱਤੀ ਸ਼ਰਤ ਨੂੰ ਨਵਾਂ ਨਮੂਨਾ ਅਵਕਾਸ ਮੰਨ ਕੇ ਸਿਰਫ਼ ਉਸੇ ਸੀਮਿਤ ਸਮੂਹ ਵਿੱਚ ਗਿਣਤੀ ਕਰੋ।",
  "P(A|B) ਲਈ ਹਰ ਵਿੱਚ B ਦੇ ਨਤੀਜੇ ਅਤੇ ਅੰਸ਼ ਵਿੱਚ A ਅਤੇ B ਦੋਵੇਂ ਪੂਰੇ ਕਰਨ ਵਾਲੇ ਨਤੀਜੇ ਰੱਖੋ।",
  "ਸ਼ਰਤ ਲੱਗਣ ਤੋਂ ਬਾਅਦ ਪੁਰਾਣੇ ਪੂਰੇ ਨਮੂਨਾ ਅਵਕਾਸ ਦਾ ਹਰ ਨਾ ਵਰਤੋ।",
);

const COUNTING_EXPLANATION = explanation(
  "पहले तय करें कि चयन में क्रम महत्वपूर्ण है या नहीं, फिर सही संयोजन या क्रमचय गिनती बनाएं।",
  "कुल वैध व्यवस्थाएँ हर में और शर्त पूरी करने वाली व्यवस्थाएँ अंश में रखें।",
  "समिति में क्रम महत्वपूर्ण नहीं होता; पद, कोड और पंक्ति जैसी स्थितियों में क्रम महत्वपूर्ण हो सकता है।",
  "ਪਹਿਲਾਂ ਤੈਅ ਕਰੋ ਕਿ ਚੋਣ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੈ ਜਾਂ ਨਹੀਂ, ਫਿਰ ਠੀਕ ਸੰਚਯ ਜਾਂ ਕ੍ਰਮਚਯ ਗਿਣਤੀ ਬਣਾਓ।",
  "ਕੁੱਲ ਵੈਧ ਵਿਉਂਤਾਂ ਹਰ ਵਿੱਚ ਅਤੇ ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਵਾਲੀਆਂ ਵਿਉਂਤਾਂ ਅੰਸ਼ ਵਿੱਚ ਰੱਖੋ।",
  "ਕਮੇਟੀ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਨਹੀਂ ਹੁੰਦਾ; ਅਹੁਦੇ, ਕੋਡ ਅਤੇ ਕਤਾਰ ਵਰਗੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਕ੍ਰਮ ਮਹੱਤਵਪੂਰਨ ਹੋ ਸਕਦਾ ਹੈ।",
);

const EVENT_ALGEBRA_EXPLANATION = explanation(
  "A और B के संघ, प्रतिच्छेद और पूरक संबंध को पहले सही सूत्र में लिखें।",
  "P(A∪B)=P(A)+P(B)-P(A∩B) से आवश्यक पद निकालें; स्वतंत्र या परस्पर अपवर्ती शर्त हो तो उसे अलग से लागू करें।",
  "'ठीक एक' में साझा भाग हटता है और 'न तो A न B' के लिए संघ का पूरक लिया जाता है।",
  "A ਅਤੇ B ਦੇ ਸੰਘ, ਪ੍ਰਤੀਛੇਦ ਅਤੇ ਪੂਰਕ ਸੰਬੰਧ ਨੂੰ ਪਹਿਲਾਂ ਠੀਕ ਸੂਤਰ ਵਿੱਚ ਲਿਖੋ।",
  "P(A∪B)=P(A)+P(B)-P(A∩B) ਨਾਲ ਲੋੜੀਂਦਾ ਪਦ ਕੱਢੋ; ਸੁਤੰਤਰ ਜਾਂ ਪਰਸਪਰ ਅਲੱਗ ਸ਼ਰਤ ਹੋਵੇ ਤਾਂ ਉਸ ਨੂੰ ਵੱਖ ਲਾਗੂ ਕਰੋ।",
  "'ਠੀਕ ਇੱਕ' ਵਿੱਚ ਸਾਂਝਾ ਭਾਗ ਹਟਦਾ ਹੈ ਅਤੇ 'ਨਾ A ਨਾ B' ਲਈ ਸੰਘ ਦਾ ਪੂਰਕ ਲਿਆ ਜਾਂਦਾ ਹੈ।",
);

const FAMILY_SPECS: Readonly<Record<string, NativeFamilySpec>> = {
  "Successive Independent": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। दो गेंदें पुनःस्थापन के साथ निकाली जाती हैं। दोनों गेंदों के लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਵਾਪਸ ਰੱਖ ਕੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पुनःस्थापन के साथ क्रमिक स्वतंत्र ड्रॉ", "ਵਾਪਸ ਰੱਖ ਕੇ ਲਗਾਤਾਰ ਸੁਤੰਤਰ ਡਰਾਅ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "Successive Dependent": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। दो गेंदें बिना पुनःस्थापन के क्रमशः निकाली जाती हैं। दोनों के लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਲਗਾਤਾਰ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("बिना पुनःस्थापन क्रमिक आश्रित ड्रॉ", "ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਲਗਾਤਾਰ ਆਸ਼੍ਰਿਤ ਡਰਾਅ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "With Replacement": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। एक गेंद निकालकर वापस रख दी जाती है और फिर दूसरी गेंद निकाली जाती है। दोनों के लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਇੱਕ ਗੇਂਦ ਕੱਢ ਕੇ ਵਾਪਸ ਰੱਖੀ ਜਾਂਦੀ ਹੈ ਅਤੇ ਫਿਰ ਦੂਜੀ ਗੇਂਦ ਕੱਢੀ ਜਾਂਦੀ ਹੈ। ਦੋਵੇਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पुनःस्थापन सहित", "ਵਾਪਸ ਰੱਖ ਕੇ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "Without Replacement": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। दो गेंदें एक के बाद एक बिना पुनःस्थापन के निकाली जाती हैं। दोनों के लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਇੱਕ ਤੋਂ ਬਾਅਦ ਇੱਕ ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पुनःस्थापन के बिना", "ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "Ordered Sequence": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। दो गेंदें बिना पुनःस्थापन के निकाली जाती हैं। पहले लाल और फिर नीली गेंद आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਪਹਿਲਾਂ ਲਾਲ ਅਤੇ ਫਿਰ ਨੀਲੀ ਗੇਂਦ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("निर्धारित क्रम", "ਨਿਰਧਾਰਤ ਕ੍ਰਮ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "Same Type Successive": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। दो गेंदें क्रमशः बिना पुनःस्थापन के निकाली जाती हैं। दोनों गेंदों के एक ही रंग की होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਲਗਾਤਾਰ ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਇੱਕੋ ਰੰਗ ਦੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("क्रमिक ड्रॉ में एक ही रंग", "ਲਗਾਤਾਰ ਡਰਾਅ ਵਿੱਚ ਇੱਕੋ ਰੰਗ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "Different Types Successive": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। दो गेंदें क्रमशः बिना पुनःस्थापन के निकाली जाती हैं। दोनों गेंदों के अलग-अलग रंग की होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਦੋ ਗੇਂਦਾਂ ਲਗਾਤਾਰ ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਕੱਢੀਆਂ ਜਾਂਦੀਆਂ ਹਨ। ਦੋਵੇਂ ਗੇਂਦਾਂ ਦੇ ਵੱਖ-ਵੱਖ ਰੰਗ ਦੀਆਂ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("क्रमिक ड्रॉ में अलग रंग", "ਲਗਾਤਾਰ ਡਰਾਅ ਵਿੱਚ ਵੱਖ ਰੰਗ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "At Least One Independent": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। पुनःस्थापन के साथ दो ड्रॉ किए जाते हैं। कम से कम एक लाल गेंद आने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਰੱਖ ਕੇ ਦੋ ਡਰਾਅ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਲ ਗੇਂਦ ਆਉਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("स्वतंत्र ड्रॉ में कम से कम एक", "ਸੁਤੰਤਰ ਡਰਾਅ ਵਿੱਚ ਘੱਟੋ-ਘੱਟ ਇੱਕ"),
    explanation: SUCCESSIVE_EXPLANATION,
  },
  "Conditional Count": {
    stem: pair(
      "{mathTotal} विद्यार्थी “{conditionLabel}” शर्त पूरी करते हैं और उनमें से {both} विद्यार्थी {targetLabel} भी हैं। दी गई शर्त के अंतर्गत लक्ष्य घटना की सशर्त प्रायिकता ज्ञात करें। {answerInstruction}",
      "{mathTotal} ਵਿਦਿਆਰਥੀ “{conditionLabel}” ਸ਼ਰਤ ਪੂਰੀ ਕਰਦੇ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {both} ਵਿਦਿਆਰਥੀ {targetLabel} ਵੀ ਹਨ। ਦਿੱਤੀ ਸ਼ਰਤ ਹੇਠ ਲਕਸ਼ ਘਟਨਾ ਦੀ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("गणना द्वारा सशर्त प्रायिकता", "ਗਿਣਤੀ ਰਾਹੀਂ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ"),
    explanation: CONDITIONAL_EXPLANATION,
  },
  "Conditional Card": {
    stem: pair(
      "मानक 52-पत्तों की गड्डी से निकला पत्ता फेस कार्ड होना ज्ञात है। उसके बादशाह होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਮਿਆਰੀ 52-ਪੱਤਿਆਂ ਦੀ ਗੱਡੀ ਵਿੱਚੋਂ ਨਿਕਲਿਆ ਪੱਤਾ ਫੇਸ ਕਾਰਡ ਹੋਣਾ ਪਤਾ ਹੈ। ਉਸ ਦੇ ਬਾਦਸ਼ਾਹ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पत्तों पर सशर्त प्रायिकता", "ਪੱਤਿਆਂ ਉੱਤੇ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ"),
    explanation: CONDITIONAL_EXPLANATION,
  },
  "Conditional Number": {
    stem: pair(
      "1 से {upper} तक में से समान संभावना से चुना गया पूर्णांक {conditionDivisor} से विभाज्य होना ज्ञात है। उसके {targetDivisor} से भी विभाज्य होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "1 ਤੋਂ {upper} ਤੱਕ ਵਿੱਚੋਂ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣਿਆ ਪੂਰਨ ਅੰਕ {conditionDivisor} ਨਾਲ ਵੰਡਯੋਗ ਹੋਣਾ ਪਤਾ ਹੈ। ਉਸ ਦੇ {targetDivisor} ਨਾਲ ਵੀ ਵੰਡਯੋਗ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("संख्याओं पर सशर्त प्रायिकता", "ਸੰਖਿਆਵਾਂ ਉੱਤੇ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ"),
    explanation: CONDITIONAL_EXPLANATION,
  },
  "Conditional Urn": {
    stem: pair(
      "एक थैले में {red} लाल और {blue} नीली गेंदें हैं। बिना पुनःस्थापन के पहली निकली गेंद लाल होना ज्ञात है। अगली गेंद के लाल होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "ਇੱਕ ਥੈਲੇ ਵਿੱਚ {red} ਲਾਲ ਅਤੇ {blue} ਨੀਲੀਆਂ ਗੇਂਦਾਂ ਹਨ। ਵਾਪਸ ਨਾ ਰੱਖ ਕੇ ਪਹਿਲੀ ਕੱਢੀ ਗੇਂਦ ਲਾਲ ਹੋਣਾ ਪਤਾ ਹੈ। ਅਗਲੀ ਗੇਂਦ ਦੇ ਲਾਲ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("गेंद चयन पर सशर्त प्रायिकता", "ਗੇਂਦ ਚੋਣ ਉੱਤੇ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ"),
    explanation: CONDITIONAL_EXPLANATION,
  },
  "Reverse Conditional": {
    stem: pair(
      "{restrictedTotal} {conditionLabel} अभ्यर्थियों में {targetLabel} होने की सशर्त प्रायिकता {answer} है। लक्ष्य गुण रखने वाले अभ्यर्थियों की संख्या ज्ञात करें। {answerInstruction}",
      "{restrictedTotal} {conditionLabel} ਉਮੀਦਵਾਰਾਂ ਵਿੱਚ {targetLabel} ਹੋਣ ਦੀ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ {answer} ਹੈ। ਲਕਸ਼ ਗੁਣ ਵਾਲੇ ਉਮੀਦਵਾਰਾਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("सशर्त प्रायिकता से उलटी गणना", "ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ ਤੋਂ ਉਲਟੀ ਗਿਣਤੀ"),
    explanation: CONDITIONAL_EXPLANATION,
  },
  "Conditional Table": {
    stem: pair(
      "{mathTotal} विद्यार्थी गणित में उत्तीर्ण हैं और उनमें से {both} अंग्रेजी में भी उत्तीर्ण हैं। गणित में उत्तीर्ण समूह से एक विद्यार्थी चुना जाता है। उसके अंग्रेजी में भी उत्तीर्ण होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{mathTotal} ਵਿਦਿਆਰਥੀ ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ ਅਤੇ ਉਨ੍ਹਾਂ ਵਿੱਚੋਂ {both} ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹਨ। ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਸਮੂਹ ਵਿੱਚੋਂ ਇੱਕ ਵਿਦਿਆਰਥੀ ਚੁਣਿਆ ਜਾਂਦਾ ਹੈ। ਉਸ ਦੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਵੀ ਪਾਸ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("तालिका आधारित सशर्त प्रायिकता", "ਸਾਰਣੀ-ਆਧਾਰਿਤ ਸ਼ਰਤੀ ਸੰਭਾਵਨਾ"),
    explanation: CONDITIONAL_EXPLANATION,
  },
  "Committee Selection": {
    stem: pair(
      "{men} पुरुष और {women} महिलाओं में से {committeeSize} सदस्यों की समिति समान संभावना से चुनी जाती है। ठीक {requiredWomen} महिला चुने जाने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{men} ਪੁਰਸ਼ਾਂ ਅਤੇ {women} ਮਹਿਲਾਵਾਂ ਵਿੱਚੋਂ {committeeSize} ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਠੀਕ {requiredWomen} ਮਹਿਲਾ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("समिति चयन", "ਕਮੇਟੀ ਚੋਣ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Committee Composition": {
    stem: pair(
      "{men} पुरुष और {women} महिलाओं में से {committeeSize} सदस्यों की समिति समान संभावना से चुनी जाती है। ठीक {requiredWomen} महिलाओं के चुने जाने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{men} ਪੁਰਸ਼ਾਂ ਅਤੇ {women} ਮਹਿਲਾਵਾਂ ਵਿੱਚੋਂ {committeeSize} ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਠੀਕ {requiredWomen} ਮਹਿਲਾਵਾਂ ਦੇ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("समिति की निश्चित संरचना", "ਕਮੇਟੀ ਦੀ ਨਿਰਧਾਰਤ ਬਣਤਰ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Random Arrangement": {
    stem: pair(
      "{people} अलग-अलग व्यक्तियों को एक पंक्ति में यादृच्छिक रूप से व्यवस्थित किया जाता है। किसी निर्दिष्ट व्यक्ति के पहले स्थान पर होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{people} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਯਾਦ੍ਰਿਚਛਿਕ ਤੌਰ ਤੇ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਕਿਸੇ ਨਿਰਧਾਰਤ ਵਿਅਕਤੀ ਦੇ ਪਹਿਲੇ ਸਥਾਨ ਤੇ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("यादृच्छिक व्यवस्था", "ਯਾਦ੍ਰਿਚਛਿਕ ਵਿਉਂਤ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Together Apart": {
    stem: pair(
      "{people} अलग-अलग व्यक्तियों को एक पंक्ति में यादृच्छिक रूप से व्यवस्थित किया जाता है। दो निर्दिष्ट व्यक्तियों के {relation} शर्त पूरी करने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{people} ਵੱਖ-ਵੱਖ ਵਿਅਕਤੀਆਂ ਨੂੰ ਇੱਕ ਕਤਾਰ ਵਿੱਚ ਯਾਦ੍ਰਿਚਛਿਕ ਤੌਰ ਤੇ ਲਗਾਇਆ ਜਾਂਦਾ ਹੈ। ਦੋ ਨਿਰਧਾਰਤ ਵਿਅਕਤੀਆਂ ਦੇ {relation} ਸ਼ਰਤ ਪੂਰੀ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("साथ या अलग व्यवस्था", "ਇਕੱਠੇ ਜਾਂ ਵੱਖ ਵਿਉਂਤ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Position Restriction": {
    stem: pair(
      "{men} पुरुष और {women} महिलाओं में से {positions} अलग-अलग पद समान संभावना से दिए जाते हैं। पहले सूचीबद्ध पद के किसी महिला को मिलने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{men} ਪੁਰਸ਼ਾਂ ਅਤੇ {women} ਮਹਿਲਾਵਾਂ ਵਿੱਚੋਂ {positions} ਵੱਖ-ਵੱਖ ਅਹੁਦੇ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਦਿੱਤੇ ਜਾਂਦੇ ਹਨ। ਪਹਿਲੇ ਦਰਜ ਅਹੁਦੇ ਦੇ ਕਿਸੇ ਮਹਿਲਾ ਨੂੰ ਮਿਲਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("पद प्रतिबंध", "ਅਹੁਦਾ ਪਾਬੰਦੀ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Number Formation": {
    stem: pair(
      "{minDigit} से {maxDigit} तक के अंकों से बिना पुनरावृत्ति एक {length}-अंकीय कोड समान संभावना से बनाया जाता है। कोड के सम अंक पर समाप्त होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{minDigit} ਤੋਂ {maxDigit} ਤੱਕ ਦੇ ਅੰਕਾਂ ਨਾਲ ਬਿਨਾਂ ਦੁਹਰਾਵੇ ਇੱਕ {length}-ਅੰਕੀ ਕੋਡ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਬਣਾਇਆ ਜਾਂਦਾ ਹੈ। ਕੋਡ ਦੇ ਸਮ ਅੰਕ ਤੇ ਖਤਮ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("अंक-कोड निर्माण", "ਅੰਕ-ਕੋਡ ਬਣਤਰ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Restricted Selection": {
    stem: pair(
      "{men} पुरुष और {women} महिलाओं में से {committeeSize} सदस्यों की समिति समान संभावना से चुनी जाती है। कम से कम एक महिला चुने जाने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{men} ਪੁਰਸ਼ਾਂ ਅਤੇ {women} ਮਹਿਲਾਵਾਂ ਵਿੱਚੋਂ {committeeSize} ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਇੱਕੋ ਸੰਭਾਵਨਾ ਨਾਲ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਘੱਟੋ-ਘੱਟ ਇੱਕ ਮਹਿਲਾ ਚੁਣੇ ਜਾਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("प्रतिबंधित समिति चयन", "ਪਾਬੰਦੀ ਵਾਲੀ ਕਮੇਟੀ ਚੋਣ"),
    explanation: COUNTING_EXPLANATION,
  },
  "Reverse Counting": {
    stem: pair(
      "{men} पुरुष और {women} महिलाओं में से {committeeSize} सदस्यों की समिति चुनी जाती है। दी गई संरचना की प्रायिकता {probability} है। उस संरचना वाली समितियों की संख्या ज्ञात करें। {answerInstruction}",
      "{men} ਪੁਰਸ਼ਾਂ ਅਤੇ {women} ਮਹਿਲਾਵਾਂ ਵਿੱਚੋਂ {committeeSize} ਮੈਂਬਰਾਂ ਦੀ ਕਮੇਟੀ ਚੁਣੀ ਜਾਂਦੀ ਹੈ। ਦਿੱਤੀ ਬਣਤਰ ਦੀ ਸੰਭਾਵਨਾ {probability} ਹੈ। ਉਸ ਬਣਤਰ ਵਾਲੀਆਂ ਕਮੇਟੀਆਂ ਦੀ ਗਿਣਤੀ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("गणना की उलटी प्रायिकता", "ਗਿਣਤੀ ਦੀ ਉਲਟੀ ਸੰਭਾਵਨਾ"),
    explanation: COUNTING_EXPLANATION,
  },
  Union: {
    stem: pair(
      "{total} सदस्यों के समूह में {aCount} घटना A, {bCount} घटना B और {overlap} दोनों घटनाएँ पूरी करते हैं। यादृच्छिक सदस्य के A या B पूरा करने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "{total} ਮੈਂਬਰਾਂ ਦੇ ਸਮੂਹ ਵਿੱਚ {aCount} ਘਟਨਾ A, {bCount} ਘਟਨਾ B ਅਤੇ {overlap} ਦੋਵੇਂ ਘਟਨਾਵਾਂ ਪੂਰੀਆਂ ਕਰਦੇ ਹਨ। ਯਾਦ੍ਰਿਚਛਿਕ ਮੈਂਬਰ ਦੇ A ਜਾਂ B ਪੂਰਾ ਕਰਨ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("घटनाओं का संघ", "ਘਟਨਾਵਾਂ ਦਾ ਸੰਘ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  Intersection: {
    stem: pair(
      "{total} समान रूप से संभावित परिणामों में {overlap} परिणाम A और B दोनों में हैं। P(A ∩ B) ज्ञात करें। {answerInstruction}",
      "{total} ਇੱਕੋ-ਜਿਹੀ ਸੰਭਾਵਨਾ ਵਾਲੇ ਨਤੀਜਿਆਂ ਵਿੱਚ {overlap} ਨਤੀਜੇ A ਅਤੇ B ਦੋਵਾਂ ਵਿੱਚ ਹਨ। P(A ∩ B) ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("घटनाओं का प्रतिच्छेद", "ਘਟਨਾਵਾਂ ਦਾ ਪ੍ਰਤੀਛੇਦ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  "Exactly One Of Two": {
    stem: pair(
      "P(A)={pA}, P(B)={pB} और P(A ∩ B)={pIntersection} हैं। A और B में से ठीक एक घटना होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "P(A)={pA}, P(B)={pB} ਅਤੇ P(A ∩ B)={pIntersection} ਹਨ। A ਅਤੇ B ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਘਟਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("दो घटनाओं में ठीक एक", "ਦੋ ਘਟਨਾਵਾਂ ਵਿੱਚ ਠੀਕ ਇੱਕ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  Neither: {
    stem: pair(
      "P(A)={pA}, P(B)={pB} और P(A ∩ B)={pIntersection} हैं। न A और न B होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "P(A)={pA}, P(B)={pB} ਅਤੇ P(A ∩ B)={pIntersection} ਹਨ। ਨਾ A ਅਤੇ ਨਾ B ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("न A न B", "ਨਾ A ਨਾ B"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  "Mutually Exclusive Union": {
    stem: pair(
      "A और B परस्पर अपवर्ती घटनाएँ हैं तथा P(A)={pA} और P(B)={pB} हैं। P(A ∪ B) ज्ञात करें। {answerInstruction}",
      "A ਅਤੇ B ਪਰਸਪਰ ਅਲੱਗ ਘਟਨਾਵਾਂ ਹਨ ਅਤੇ P(A)={pA} ਅਤੇ P(B)={pB} ਹਨ। P(A ∪ B) ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("परस्पर अपवर्ती घटनाओं का संघ", "ਪਰਸਪਰ ਅਲੱਗ ਘਟਨਾਵਾਂ ਦਾ ਸੰਘ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  "Independent Intersection": {
    stem: pair(
      "A और B स्वतंत्र घटनाएँ हैं तथा P(A)={pA} और P(B)={pB} हैं। P(A ∩ B) ज्ञात करें। {answerInstruction}",
      "A ਅਤੇ B ਸੁਤੰਤਰ ਘਟਨਾਵਾਂ ਹਨ ਅਤੇ P(A)={pA} ਅਤੇ P(B)={pB} ਹਨ। P(A ∩ B) ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("स्वतंत्र घटनाओं का प्रतिच्छेद", "ਸੁਤੰਤਰ ਘਟਨਾਵਾਂ ਦਾ ਪ੍ਰਤੀਛੇਦ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  "Missing Intersection": {
    stem: pair(
      "P(A)={pA}, P(B)={pB} और P(A ∪ B)={pUnion} हैं। P(A ∩ B) ज्ञात करें। {answerInstruction}",
      "P(A)={pA}, P(B)={pB} ਅਤੇ P(A ∪ B)={pUnion} ਹਨ। P(A ∩ B) ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("अज्ञात प्रतिच्छेद", "ਅਣਜਾਣ ਪ੍ਰਤੀਛੇਦ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
  "Mixed Event Expression": {
    stem: pair(
      "P(A)={pA}, P(B)={pB} और P(A ∩ B)={pIntersection} हैं। A या B होने, लेकिन दोनों न होने की प्रायिकता ज्ञात करें। {answerInstruction}",
      "P(A)={pA}, P(B)={pB} ਅਤੇ P(A ∩ B)={pIntersection} ਹਨ। A ਜਾਂ B ਹੋਣ, ਪਰ ਦੋਵੇਂ ਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਕੱਢੋ। {answerInstruction}",
    ),
    eventWording: pair("मिश्रित घटना व्यंजक", "ਮਿਸ਼ਰਤ ਘਟਨਾ ਪ੍ਰਗਟਾਵਾ"),
    explanation: EVENT_ALGEBRA_EXPLANATION,
  },
};

export const PRB_002_NATIVE_FAMILY_COUNT = Object.keys(FAMILY_SPECS).length;

export function buildPrb002NativeEditorialLibrary(): readonly Prb002NativeEditorialEntry[] {
  return PRB_002_LIBRARIES.language.flatMap((source) => {
    const spec = FAMILY_SPECS[source.eventWording];
    if (!spec) throw new Error(`Missing PRB-002 native editorial family for ${source.qlId}: ${source.eventWording}`);
    return (["hi", "pa"] as const).map((language) => ({
      packageId: "PRB-002" as const,
      qlId: source.qlId,
      sourceStemTemplateId: source.stemTemplateId,
      language,
      sourceLanguage: "en" as const,
      editorialStatus: "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW" as const,
      contextFamily: source.contextFamily,
      eventWording: pick(language, spec.eventWording),
      stemTemplate: pick(language, spec.stem),
      explanation: spec.explanation[language],
      learningOnly: false as const,
      answerKeyAuthority: "ENGLISH_RUNTIME" as const,
      optionPolicy: "PRESERVE_ENGLISH_OPTIONS_AND_CORRECT_INDEX" as const,
      questionStudioEnabled: false as const,
      publiclyPublishable: false as const,
    }));
  });
}

export function getPrb002NativeEditorialEntry(
  qlId: string,
  language: ProbabilityNativeLanguage,
): Prb002NativeEditorialEntry {
  const entry = buildPrb002NativeEditorialLibrary().find(
    (candidate) => candidate.qlId === qlId && candidate.language === language,
  );
  if (!entry) throw new Error(`Missing PRB-002 ${language} editorial entry for ${qlId}.`);
  return entry;
}

const SIMPLE_BINDINGS: Readonly<Record<string, NativePair>> = {
  "passed Mathematics": pair("गणित में उत्तीर्ण हैं", "ਗਣਿਤ ਵਿੱਚ ਪਾਸ ਹਨ"),
  "passed English": pair("अंग्रेजी में उत्तीर्ण हैं", "ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਪਾਸ ਹਨ"),
  shortlisted: pair("संक्षिप्त सूची में शामिल", "ਛਾਂਟੀ ਸੂਚੀ ਵਿੱਚ ਸ਼ਾਮਲ"),
  certified: pair("प्रमाणित", "ਪ੍ਰਮਾਣਿਤ"),
  TOGETHER: pair("साथ-साथ हों", "ਇਕੱਠੇ ਹੋਣ"),
  APART: pair("साथ-साथ न हों", "ਇਕੱਠੇ ਨਾ ਹੋਣ"),
};

function nativeAnswerInstruction(language: ProbabilityNativeLanguage, qlId: string): string {
  const registry = PRB_002_LIBRARIES.registry.find((entry) => entry.qlId === qlId);
  if (!registry) throw new Error(`Missing PRB-002 registry entry for ${qlId}.`);
  if (registry.answerDimension === "COUNT") {
    return language === "hi"
      ? "उत्तर सटीक पूर्ण संख्या में दें।"
      : "ਉੱਤਰ ਸਹੀ ਪੂਰੀ ਸੰਖਿਆ ਵਿੱਚ ਦਿਓ।";
  }
  return language === "hi"
    ? "अंतिम प्रायिकता को सरलतम सटीक भिन्न में दें।"
    : "ਅੰਤਿਮ ਸੰਭਾਵਨਾ ਨੂੰ ਸਭ ਤੋਂ ਸਰਲ ਸਹੀ ਭਿੰਨ ਵਿੱਚ ਦਿਓ।";
}

export function localizePrb002NativeBindingValue(
  key: string,
  value: unknown,
  language: ProbabilityNativeLanguage,
  qlId: string,
): string {
  if (key === "answerInstruction") return nativeAnswerInstruction(language, qlId);
  if (typeof value === "number" || typeof value === "bigint") return value.toString();
  if (typeof value !== "string") {
    throw new Error(`Unsupported PRB-002 native binding type for ${key}: ${typeof value}.`);
  }
  if (isProbabilityMathOrNumericOption(value)) return value;
  const exact = SIMPLE_BINDINGS[value];
  if (exact) return pick(language, exact);
  throw new Error(
    `PRB-002 ${language} binding is fail-closed for ${qlId}/${key}: ${JSON.stringify(value)}.`,
  );
}

export function getPrb002NativeEditorialReadinessSummary(): Readonly<{
  englishQlCount: number;
  nativeEntryCount: number;
  hindiEntryCount: number;
  punjabiEntryCount: number;
  familyCount: number;
  draftCount: number;
  questionStudioEnabledCount: number;
  publiclyPublishableCount: number;
}> {
  const library = buildPrb002NativeEditorialLibrary();
  return {
    englishQlCount: PRB_002_LIBRARIES.language.length,
    nativeEntryCount: library.length,
    hindiEntryCount: library.filter((entry) => entry.language === "hi").length,
    punjabiEntryCount: library.filter((entry) => entry.language === "pa").length,
    familyCount: PRB_002_NATIVE_FAMILY_COUNT,
    draftCount: library.filter((entry) => entry.editorialStatus === "DRAFT_NATIVE_EDITORIAL_REQUIRES_HUMAN_REVIEW").length,
    questionStudioEnabledCount: library.filter((entry) => entry.questionStudioEnabled).length,
    publiclyPublishableCount: library.filter((entry) => entry.publiclyPublishable).length,
  };
}
