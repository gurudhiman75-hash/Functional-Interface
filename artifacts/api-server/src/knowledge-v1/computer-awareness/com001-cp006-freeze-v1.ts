import { createHash } from "node:crypto";
import {
  COM001_CP006_ENGLISH_REVIEW_CANDIDATE,
  type Com001Cp006HistoryQuestion,
} from "./com001-cp006-history-generations";

export type Com001Cp006Language = "en" | "hi" | "pa";
export type Com001Cp006Locale = "en-IN" | "hi-IN" | "pa-IN";

export type Com001Cp006FrozenQuestion = {
  questionId: string;
  sourceQuestionId: string;
  qlId: string;
  language: Com001Cp006Language;
  locale: Com001Cp006Locale;
  difficulty: "EASY" | "MEDIUM";
  stem: string;
  options: readonly string[];
  correctIndex: number;
  canonicalAnswer: string;
  explanation: string;
  sourceFactIds: readonly string[];
  sourceEnglishAuthorityId: string;
  sourceEnglishFrozen: true;
  sourceLocalizationFrozen: true;
};

export const COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-001-CP-006-ENGLISH-FREEZE-V1",
  chapterCode: "COM-001",
  cpId: "COM-001-CP-006",
  language: "en" as const,
  locale: "en-IN" as const,
  questionCount: 28,
  questionsPerQl: 4,
  permanentQlIds: Object.freeze([
    "COM-001-CP-006-QL-001",
    "COM-001-CP-006-QL-002",
    "COM-001-CP-006-QL-003",
    "COM-001-CP-006-QL-004",
    "COM-001-CP-006-QL-005",
    "COM-001-CP-006-QL-006",
    "COM-001-CP-006-QL-007",
  ]),
  predecessorAuthorityId: "COM-001-CP-006-ENGLISH-REVIEW-CANDIDATE-V1",
} as const;

function freezeEnglish(question: Com001Cp006HistoryQuestion): Com001Cp006FrozenQuestion {
  const correctIndex = question.options.indexOf(question.canonicalAnswer);
  if (correctIndex < 0) throw new Error(`COM-001 CP-006 answer missing: ${question.questionId}`);
  return Object.freeze({
    questionId: question.questionId,
    sourceQuestionId: question.questionId,
    qlId: question.qlId,
    language: "en",
    locale: "en-IN",
    difficulty: question.difficulty,
    stem: question.stem,
    options: Object.freeze([...question.options]),
    correctIndex,
    canonicalAnswer: question.canonicalAnswer,
    explanation: question.explanation,
    sourceFactIds: Object.freeze([...question.sourceIds]),
    sourceEnglishAuthorityId: COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    sourceEnglishFrozen: true,
    sourceLocalizationFrozen: true,
  });
}

export const COM001_CP006_ENGLISH_FROZEN: readonly Com001Cp006FrozenQuestion[] =
  Object.freeze(COM001_CP006_ENGLISH_REVIEW_CANDIDATE.map(freezeEnglish));

type CopyEntry = {
  sourceQuestionId: string;
  stem: string;
  options: readonly string[];
  explanation: string;
};

const HI: readonly CopyEntry[] = [
  { sourceQuestionId: "COM001-CP006-EN-001", stem: "प्रारम्भिक मैनुअल गणना सहायक उपकरण कौन-सा है?", options: ["अबेकस", "ट्रांजिस्टर", "प्रिंटर", "कम्पाइलर"], explanation: "अबेकस गिनती और गणना के लिए इस्तेमाल किया जाने वाला प्रारम्भिक मैनुअल उपकरण है।" },
  { sourceQuestionId: "COM001-CP006-EN-002", stem: "गणितीय सारणियाँ यांत्रिक रूप से निकालने के लिए कौन-सी मशीन बनाई गई थी?", options: ["डिफरेंस इंजन", "ENIAC", "UNIVAC", "माइक्रोप्रोसेसर"], explanation: "चार्ल्स बैबेज ने डिफरेंस इंजन को गणितीय सारणियाँ यांत्रिक रूप से निकालने के लिए बनाया था।" },
  { sourceQuestionId: "COM001-CP006-EN-003", stem: "कौन-सा उपकरण छड़ों पर लगे मोतियों से गणना करता है?", options: ["अबेकस", "एनालिटिकल इंजन", "वैक्यूम ट्यूब", "इंटीग्रेटेड सर्किट"], explanation: "अबेकस में संख्याएँ दिखाने और गणना करने के लिए छड़ों पर मोतियों का इस्तेमाल होता है।" },
  { sourceQuestionId: "COM001-CP006-EN-004", stem: "स्मृति और प्रोसेसिंग भाग वाले डिजाइन से सामान्य गणना करने के लिए कौन-सी प्रारम्भिक मशीन बनाई गई थी?", options: ["एनालिटिकल इंजन", "अबेकस", "केवल डिफरेंस इंजन", "पंच कार्ड"], explanation: "एनालिटिकल इंजन में सामान्य गणना के लिए स्मृति और प्रोसेसिंग भाग का विचार था।" },
  { sourceQuestionId: "COM001-CP006-EN-005", stem: "कंप्यूटर का जनक किसे कहा जाता है?", options: ["चार्ल्स बैबेज", "जॉन मॉक्ली", "ब्लेज़ पास्कल", "जे. प्रेस्पर एकर्ट"], explanation: "चार्ल्स बैबेज को कंप्यूटर का जनक कहा जाता है क्योंकि उन्होंने यांत्रिक कंप्यूटरों के डिजाइन बनाए थे।" },
  { sourceQuestionId: "COM001-CP006-EN-006", stem: "पहला प्रकाशित कंप्यूटर प्रोग्राम किसने लिखा था?", options: ["एडा लवलेस", "ग्रेस हॉपर", "चार्ल्स बैबेज", "हरमन होलेरिथ"], explanation: "एडा लवलेस ने बैबेज के एनालिटिकल इंजन के लिए चरणबद्ध प्रोग्राम लिखा था।" },
  { sourceQuestionId: "COM001-CP006-EN-007", stem: "एडा लवलेस ने किस मशीन के बारे में नोट्स लिखे थे?", options: ["एनालिटिकल इंजन", "ENIAC", "UNIVAC", "केवल डिफरेंस इंजन"], explanation: "एडा लवलेस के नोट्स में बताया गया था कि एनालिटिकल इंजन प्रोग्राम के चरणों का पालन कर सकता है।" },
  { sourceQuestionId: "COM001-CP006-EN-008", stem: "कौन-सा युग्म सही मिलान किया गया है?", options: ["बैबेज — एनालिटिकल इंजन", "एडा लवलेस — ट्रांजिस्टर", "बैबेज — ऑप्टिकल फाइबर", "एडा लवलेस — वैक्यूम ट्यूब"], explanation: "चार्ल्स बैबेज ने एनालिटिकल इंजन का डिजाइन बनाया था और एडा लवलेस ने उसके बारे में महत्वपूर्ण नोट्स लिखे थे।" },
  { sourceQuestionId: "COM001-CP006-EN-009", stem: "पहली पीढ़ी के कंप्यूटरों में कौन-सी तकनीक इस्तेमाल होती थी?", options: ["वैक्यूम ट्यूब", "ट्रांजिस्टर", "इंटीग्रेटेड सर्किट", "माइक्रोप्रोसेसर"], explanation: "पहली पीढ़ी के कंप्यूटरों में मुख्य रूप से वैक्यूम ट्यूब इस्तेमाल होती थीं।" },
  { sourceQuestionId: "COM001-CP006-EN-010", stem: "दूसरी पीढ़ी के कंप्यूटरों में कौन-सी तकनीक इस्तेमाल होती थी?", options: ["वैक्यूम ट्यूब", "ट्रांजिस्टर", "इंटीग्रेटेड सर्किट", "आर्टिफिशियल इंटेलिजेंस"], explanation: "दूसरी पीढ़ी के कंप्यूटरों में वैक्यूम ट्यूब की जगह ट्रांजिस्टर इस्तेमाल हुए।" },
  { sourceQuestionId: "COM001-CP006-EN-011", stem: "तीसरी पीढ़ी के कंप्यूटरों में कौन-सी तकनीक इस्तेमाल होती थी?", options: ["इंटीग्रेटेड सर्किट", "वैक्यूम ट्यूब", "मशीनी गियर", "केवल पंच कार्ड"], explanation: "तीसरी पीढ़ी के कंप्यूटरों में इंटीग्रेटेड सर्किट इस्तेमाल हुए।" },
  { sourceQuestionId: "COM001-CP006-EN-012", stem: "चौथी पीढ़ी के कंप्यूटरों में कौन-सी तकनीक इस्तेमाल होती थी?", options: ["माइक्रोप्रोसेसर", "वैक्यूम ट्यूब", "मशीनी रिले", "पंच कार्ड"], explanation: "चौथी पीढ़ी के कंप्यूटरों में माइक्रोप्रोसेसर इस्तेमाल हुए।" },
  { sourceQuestionId: "COM001-CP006-EN-013", stem: "ENIAC का पूरा नाम क्या है?", options: ["Electronic Numerical Integrator and Computer", "Electronic Network Information and Control", "Electrical Numerical Input and Calculator", "Electronic Network Integrating Automatic Computer"], explanation: "ENIAC का पूरा नाम Electronic Numerical Integrator and Computer है।" },
  { sourceQuestionId: "COM001-CP006-EN-014", stem: "ENIAC को किस रूप में सबसे सही बताया जाता है?", options: ["पहला सामान्य-उद्देश्य इलेक्ट्रॉनिक कंप्यूटर", "पहला मशीनी कैलकुलेटर", "पहला पर्सनल कंप्यूटर", "पहला लैपटॉप कंप्यूटर"], explanation: "ENIAC पहला सामान्य-उद्देश्य इलेक्ट्रॉनिक कंप्यूटर था।" },
  { sourceQuestionId: "COM001-CP006-EN-015", stem: "कौन-सी मशीन इलेक्ट्रॉनिक कंप्यूटरों की पहली पीढ़ी की है?", options: ["ENIAC", "स्मार्टफोन", "टैबलेट", "माइक्रोप्रोसेसर"], explanation: "ENIAC में वैक्यूम ट्यूब इस्तेमाल हुई थीं, इसलिए यह इलेक्ट्रॉनिक कंप्यूटरों की पहली पीढ़ी का है।" },
  { sourceQuestionId: "COM001-CP006-EN-016", stem: "प्रारम्भिक व्यावसायिक डेटा प्रोसेसिंग के लिए किस कंप्यूटर का इस्तेमाल किया गया था?", options: ["UNIVAC I", "अबेकस", "एनालिटिकल इंजन", "डिफरेंस इंजन"], explanation: "UNIVAC I शुरुआती व्यावसायिक इलेक्ट्रॉनिक कंप्यूटरों में से एक था और डेटा प्रोसेसिंग में इस्तेमाल हुआ।" },
  { sourceQuestionId: "COM001-CP006-EN-017", stem: "दूसरी पीढ़ी के कंप्यूटरों में वैक्यूम ट्यूब की जगह किसने ली?", options: ["ट्रांजिस्टर", "माइक्रोप्रोसेसर", "ऑप्टिकल फाइबर", "टच स्क्रीन"], explanation: "दूसरी पीढ़ी में ट्रांजिस्टर ने वैक्यूम ट्यूब की जगह ली।" },
  { sourceQuestionId: "COM001-CP006-EN-018", stem: "कौन-सा क्रम कंप्यूटर पीढ़ियों की तकनीक में सामान्य बदलाव दिखाता है?", options: ["वैक्यूम ट्यूब → ट्रांजिस्टर → इंटीग्रेटेड सर्किट → माइक्रोप्रोसेसर", "ट्रांजिस्टर → वैक्यूम ट्यूब → माइक्रोप्रोसेसर → इंटीग्रेटेड सर्किट", "माइक्रोप्रोसेसर → वैक्यूम ट्यूब → ट्रांजिस्टर → इंटीग्रेटेड सर्किट", "इंटीग्रेटेड सर्किट → वैक्यूम ट्यूब → ट्रांजिस्टर → माइक्रोप्रोसेसर"], explanation: "सामान्य क्रम वैक्यूम ट्यूब से ट्रांजिस्टर, फिर इंटीग्रेटेड सर्किट और माइक्रोप्रोसेसर तक जाता है।" },
  { sourceQuestionId: "COM001-CP006-EN-019", stem: "किस तकनीक ने कंप्यूटरों को वैक्यूम ट्यूब वाली मशीनों से छोटा बनाया?", options: ["ट्रांजिस्टर", "मशीनी गियर", "कागज़ी फाइल", "केवल पंच कार्ड"], explanation: "ट्रांजिस्टर वैक्यूम ट्यूब से छोटे और अधिक भरोसेमंद थे।" },
  { sourceQuestionId: "COM001-CP006-EN-020", stem: "किस घटक ने मुख्य प्रोसेसिंग कार्यों को एक चिप पर रखा?", options: ["माइक्रोप्रोसेसर", "वैक्यूम ट्यूब", "रिले", "पंच कार्ड"], explanation: "माइक्रोप्रोसेसर मुख्य प्रोसेसिंग कार्यों को एक चिप पर रखता है।" },
  { sourceQuestionId: "COM001-CP006-EN-021", stem: "पंच कार्ड से डेटा प्रोसेसिंग करने वाला उपकरण किसने विकसित किया?", options: ["हरमन होलेरिथ", "एडा लवलेस", "जॉन मॉक्ली", "चार्ल्स बैबेज"], explanation: "हरमन होलेरिथ ने डेटा प्रोसेसिंग के लिए पंच कार्ड उपकरण विकसित किया था।" },
  { sourceQuestionId: "COM001-CP006-EN-022", stem: "कौन-सा युग्म सही मिलान किया गया है?", options: ["जॉन मॉक्ली और जे. प्रेस्पर एकर्ट — ENIAC बनाया", "एडा लवलेस — ट्रांजिस्टर", "हरमन होलेरिथ — माइक्रोप्रोसेसर", "चार्ल्स बैबेज — ऑप्टिकल फाइबर"], explanation: "जॉन मॉक्ली और जे. प्रेस्पर एकर्ट ने पेंसिल्वेनिया विश्वविद्यालय में ENIAC बनाया था।" },
  { sourceQuestionId: "COM001-CP006-EN-023", stem: "कंप्यूटर प्रोग्रामिंग के शुरुआती विचार के लिए कौन प्रसिद्ध हैं?", options: ["एडा लवलेस", "हरमन होलेरिथ", "जॉन मॉक्ली", "ब्लेज़ पास्कल"], explanation: "एडा लवलेस ने पहला प्रकाशित कंप्यूटर प्रोग्राम लिखा था।" },
  { sourceQuestionId: "COM001-CP006-EN-024", stem: "कौन-सा युग्म सही है?", options: ["ENIAC — पेंसिल्वेनिया विश्वविद्यालय में बनाया गया", "एनालिटिकल इंजन — आधुनिक स्मार्टफोन", "अबेकस — चौथी पीढ़ी का कंप्यूटर", "माइक्रोप्रोसेसर — पहला मशीनी कैलकुलेटर"], explanation: "ENIAC पेंसिल्वेनिया विश्वविद्यालय के मूर स्कूल में बनाया गया था।" },
  { sourceQuestionId: "COM001-CP006-EN-025", stem: "कौन-सा कंप्यूटर लगातार बदलने वाले भौतिक मानों के साथ काम करता है?", options: ["एनालॉग कंप्यूटर", "डिजिटल कंप्यूटर", "माइक्रोकंप्यूटर", "मेनफ्रेम कंप्यूटर"], explanation: "एनालॉग कंप्यूटर तापमान या दबाव जैसे लगातार बदलने वाले भौतिक मानों के साथ काम करता है।" },
  { sourceQuestionId: "COM001-CP006-EN-026", stem: "कौन-सा कंप्यूटर मुख्य रूप से अलग-अलग संख्याओं या प्रतीकों के साथ काम करता है?", options: ["डिजिटल कंप्यूटर", "एनालॉग कंप्यूटर", "मशीनी घड़ी", "स्लाइड रूल"], explanation: "डिजिटल कंप्यूटर संख्याओं या प्रतीकों के रूप में दिए गए अलग-अलग मानों को प्रोसेस करता है।" },
  { sourceQuestionId: "COM001-CP006-EN-027", stem: "अलग-अलग प्रकार के कई काम करने के लिए बनाया गया कंप्यूटर कहलाता है:", options: ["सामान्य-उद्देश्य कंप्यूटर", "एक-काम वाला कैलकुलेटर", "पंच कार्ड", "इनपुट उपकरण"], explanation: "सामान्य-उद्देश्य कंप्यूटर प्रोग्राम की मदद से कई अलग-अलग काम कर सकता है।" },
  { sourceQuestionId: "COM001-CP006-EN-028", stem: "प्रोग्राम योग्य कंप्यूटर स्थिर-कार्य मशीन से कैसे अलग होता है?", options: ["यह अलग-अलग निर्देशों के सेट का पालन कर सकता है", "यह केवल एक गणना कर सकता है", "यह निर्देशों को रख नहीं सकता", "यह बिना इनपुट के काम करता है"], explanation: "प्रोग्राम योग्य कंप्यूटर अलग-अलग रखे गए निर्देशों का पालन करके अलग-अलग काम कर सकता है।" },
];

const PA: readonly CopyEntry[] = [
  { sourceQuestionId: "COM001-CP006-EN-001", stem: "ਸ਼ੁਰੂਆਤੀ ਹੱਥੋਂ ਚਲਾਏ ਜਾਣ ਵਾਲੇ ਗਿਣਤੀ ਸਹਾਇਕ ਯੰਤਰ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?", options: ["ਐਬੈਕਸ", "ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਪ੍ਰਿੰਟਰ", "ਕੰਪਾਈਲਰ"], explanation: "ਐਬੈਕਸ ਗਿਣਤੀ ਅਤੇ ਹਿਸਾਬ ਲਈ ਵਰਤਿਆ ਜਾਣ ਵਾਲਾ ਪੁਰਾਣਾ ਹੱਥੋਂ ਚਲਾਇਆ ਯੰਤਰ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-002", stem: "ਗਣਿਤੀ ਸਾਰਣੀਆਂ ਨੂੰ ਮਕੈਨੀਕੀ ਢੰਗ ਨਾਲ ਕੱਢਣ ਲਈ ਕਿਹੜੀ ਮਸ਼ੀਨ ਬਣਾਈ ਗਈ ਸੀ?", options: ["ਡਿਫਰੈਂਸ ਇੰਜਣ", "ENIAC", "UNIVAC", "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ"], explanation: "ਚਾਰਲਸ ਬੈਬੇਜ ਨੇ ਡਿਫਰੈਂਸ ਇੰਜਣ ਨੂੰ ਗਣਿਤੀ ਸਾਰਣੀਆਂ ਮਕੈਨੀਕੀ ਢੰਗ ਨਾਲ ਕੱਢਣ ਲਈ ਬਣਾਇਆ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-003", stem: "ਛੜਾਂ ਉੱਤੇ ਲੱਗੇ ਮਣਕਿਆਂ ਨਾਲ ਗਿਣਤੀ ਕਰਨ ਵਾਲਾ ਯੰਤਰ ਕਿਹੜਾ ਹੈ?", options: ["ਐਬੈਕਸ", "ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ", "ਵੈਕਿਊਮ ਟਿਊਬ", "ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ"], explanation: "ਐਬੈਕਸ ਵਿੱਚ ਅੰਕ ਦਰਸਾਉਣ ਅਤੇ ਗਿਣਤੀ ਕਰਨ ਲਈ ਛੜਾਂ ਉੱਤੇ ਮਣਕੇ ਲੱਗੇ ਹੁੰਦੇ ਹਨ।" },
  { sourceQuestionId: "COM001-CP006-EN-004", stem: "ਯਾਦਦਾਸ਼ਤ ਅਤੇ ਪ੍ਰੋਸੈਸਿੰਗ ਭਾਗ ਵਾਲੇ ਡਿਜ਼ਾਈਨ ਨਾਲ ਆਮ ਗਣਨਾਵਾਂ ਕਰਨ ਲਈ ਕਿਹੜੀ ਸ਼ੁਰੂਆਤੀ ਮਸ਼ੀਨ ਬਣਾਈ ਗਈ ਸੀ?", options: ["ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ", "ਐਬੈਕਸ", "ਕੇਵਲ ਡਿਫਰੈਂਸ ਇੰਜਣ", "ਪੰਚ ਕਾਰਡ"], explanation: "ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ ਵਿੱਚ ਆਮ ਗਣਨਾਵਾਂ ਲਈ ਯਾਦਦਾਸ਼ਤ ਅਤੇ ਪ੍ਰੋਸੈਸਿੰਗ ਭਾਗ ਦਾ ਵਿਚਾਰ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-005", stem: "ਕੰਪਿਊਟਰ ਦਾ ਪਿਤਾ ਕਿਸਨੂੰ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?", options: ["ਚਾਰਲਸ ਬੈਬੇਜ", "ਜੌਨ ਮਾਕਲੀ", "ਬਲੇਜ਼ ਪਾਸਕਲ", "ਜੇ. ਪ੍ਰੈਸਪਰ ਏਕਰਟ"], explanation: "ਚਾਰਲਸ ਬੈਬੇਜ ਨੂੰ ਕੰਪਿਊਟਰ ਦਾ ਪਿਤਾ ਕਿਹਾ ਜਾਂਦਾ ਹੈ ਕਿਉਂਕਿ ਉਸ ਨੇ ਮਕੈਨੀਕੀ ਕੰਪਿਊਟਰਾਂ ਦੇ ਡਿਜ਼ਾਈਨ ਬਣਾਏ ਸਨ।" },
  { sourceQuestionId: "COM001-CP006-EN-006", stem: "ਪਹਿਲਾ ਪ੍ਰਕਾਸ਼ਿਤ ਕੰਪਿਊਟਰ ਪ੍ਰੋਗਰਾਮ ਕਿਸ ਨੇ ਲਿਖਿਆ ਸੀ?", options: ["ਐਡਾ ਲਵਲੇਸ", "ਗ੍ਰੇਸ ਹੌਪਰ", "ਚਾਰਲਸ ਬੈਬੇਜ", "ਹਰਮਨ ਹੋਲਰਿਥ"], explanation: "ਐਡਾ ਲਵਲੇਸ ਨੇ ਬੈਬੇਜ ਦੇ ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ ਲਈ ਕਦਮਾਂ ਵਾਲਾ ਪ੍ਰੋਗਰਾਮ ਲਿਖਿਆ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-007", stem: "ਐਡਾ ਲਵਲੇਸ ਨੇ ਕਿਸ ਮਸ਼ੀਨ ਬਾਰੇ ਨੋਟ ਲਿਖੇ ਸਨ?", options: ["ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ", "ENIAC", "UNIVAC", "ਕੇਵਲ ਡਿਫਰੈਂਸ ਇੰਜਣ"], explanation: "ਐਡਾ ਲਵਲੇਸ ਦੇ ਨੋਟਾਂ ਵਿੱਚ ਦੱਸਿਆ ਗਿਆ ਸੀ ਕਿ ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ ਪ੍ਰੋਗਰਾਮ ਦੇ ਕਦਮਾਂ ਦੀ ਪਾਲਣਾ ਕਰ ਸਕਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-008", stem: "ਕਿਹੜੀ ਜੋੜੀ ਦਾ ਮਿਲਾਨ ਸਹੀ ਹੈ?", options: ["ਬੈਬੇਜ — ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ", "ਐਡਾ ਲਵਲੇਸ — ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਬੈਬੇਜ — ਓਪਟੀਕਲ ਫਾਈਬਰ", "ਐਡਾ ਲਵਲੇਸ — ਵੈਕਿਊਮ ਟਿਊਬ"], explanation: "ਚਾਰਲਸ ਬੈਬੇਜ ਨੇ ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ ਦਾ ਡਿਜ਼ਾਈਨ ਬਣਾਇਆ ਸੀ ਅਤੇ ਐਡਾ ਲਵਲੇਸ ਨੇ ਇਸ ਬਾਰੇ ਮਹੱਤਵਪੂਰਨ ਨੋਟ ਲਿਖੇ ਸਨ।" },
  { sourceQuestionId: "COM001-CP006-EN-009", stem: "ਪਹਿਲੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਕਿਹੜੀ ਤਕਨਾਲੋਜੀ ਵਰਤੀ ਜਾਂਦੀ ਸੀ?", options: ["ਵੈਕਿਊਮ ਟਿਊਬ", "ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ", "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ"], explanation: "ਪਹਿਲੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਵਰਤੀਆਂ ਜਾਂਦੀਆਂ ਸਨ।" },
  { sourceQuestionId: "COM001-CP006-EN-010", stem: "ਦੂਜੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਕਿਹੜੀ ਤਕਨਾਲੋਜੀ ਵਰਤੀ ਜਾਂਦੀ ਸੀ?", options: ["ਵੈਕਿਊਮ ਟਿਊਬ", "ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ", "ਆਰਟੀਫਿਸ਼ਲ ਇੰਟੈਲੀਜੈਂਸ"], explanation: "ਦੂਜੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਦੀ ਥਾਂ ਟ੍ਰਾਂਜ਼ਿਸਟਰ ਵਰਤੇ ਗਏ।" },
  { sourceQuestionId: "COM001-CP006-EN-011", stem: "ਤੀਜੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਕਿਹੜੀ ਤਕਨਾਲੋਜੀ ਵਰਤੀ ਜਾਂਦੀ ਸੀ?", options: ["ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ", "ਵੈਕਿਊਮ ਟਿਊਬ", "ਮਕੈਨੀਕੀ ਗੀਅਰ", "ਸਿਰਫ਼ ਪੰਚ ਕਾਰਡ"], explanation: "ਤੀਜੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ ਵਰਤੇ ਗਏ।" },
  { sourceQuestionId: "COM001-CP006-EN-012", stem: "ਚੌਥੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਕਿਹੜੀ ਤਕਨਾਲੋਜੀ ਵਰਤੀ ਜਾਂਦੀ ਸੀ?", options: ["ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ", "ਵੈਕਿਊਮ ਟਿਊਬ", "ਮਕੈਨੀਕੀ ਰਿਲੇ", "ਪੰਚ ਕਾਰਡ"], explanation: "ਚੌਥੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ ਵਰਤੇ ਗਏ।" },
  { sourceQuestionId: "COM001-CP006-EN-013", stem: "ENIAC ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?", options: ["Electronic Numerical Integrator and Computer", "Electronic Network Information and Control", "Electrical Numerical Input and Calculator", "Electronic Network Integrating Automatic Computer"], explanation: "ENIAC ਦਾ ਪੂਰਾ ਨਾਮ Electronic Numerical Integrator and Computer ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-014", stem: "ENIAC ਨੂੰ ਸਭ ਤੋਂ ਸਹੀ ਢੰਗ ਨਾਲ ਕਿਹੜੀ ਮਸ਼ੀਨ ਕਿਹਾ ਜਾਂਦਾ ਹੈ?", options: ["ਪਹਿਲਾ ਆਮ-ਉਦੇਸ਼ ਵਾਲਾ ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਪਿਊਟਰ", "ਪਹਿਲਾ ਮਕੈਨੀਕੀ ਕੈਲਕੁਲੇਟਰ", "ਪਹਿਲਾ ਨਿੱਜੀ ਕੰਪਿਊਟਰ", "ਪਹਿਲਾ ਲੈਪਟਾਪ ਕੰਪਿਊਟਰ"], explanation: "ENIAC ਪਹਿਲਾ ਆਮ-ਉਦੇਸ਼ ਵਾਲਾ ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਪਿਊਟਰ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-015", stem: "ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਪਿਊਟਰਾਂ ਦੀ ਪਹਿਲੀ ਪੀੜ੍ਹੀ ਨਾਲ ਕਿਹੜੀ ਮਸ਼ੀਨ ਸਬੰਧਤ ਹੈ?", options: ["ENIAC", "ਸਮਾਰਟਫੋਨ", "ਟੈਬਲੇਟ", "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ"], explanation: "ENIAC ਵਿੱਚ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਵਰਤੀਆਂ ਗਈਆਂ ਸਨ, ਇਸ ਲਈ ਇਹ ਪਹਿਲੀ ਪੀੜ੍ਹੀ ਦੇ ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਆਉਂਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-016", stem: "ਸ਼ੁਰੂਆਤੀ ਵਪਾਰਕ ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਲਈ ਕਿਹੜਾ ਕੰਪਿਊਟਰ ਵਰਤਿਆ ਗਿਆ ਸੀ?", options: ["UNIVAC I", "ਐਬੈਕਸ", "ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ", "ਡਿਫਰੈਂਸ ਇੰਜਣ"], explanation: "UNIVAC I ਸ਼ੁਰੂਆਤੀ ਵਪਾਰਕ ਇਲੈਕਟ੍ਰਾਨਿਕ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚੋਂ ਇੱਕ ਸੀ ਅਤੇ ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਲਈ ਵਰਤਿਆ ਗਿਆ।" },
  { sourceQuestionId: "COM001-CP006-EN-017", stem: "ਦੂਜੀ ਪੀੜ੍ਹੀ ਦੇ ਕੰਪਿਊਟਰਾਂ ਵਿੱਚ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਦੀ ਥਾਂ ਕਿਸ ਨੇ ਲਈ?", options: ["ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ", "ਓਪਟੀਕਲ ਫਾਈਬਰ", "ਟੱਚ ਸਕਰੀਨ"], explanation: "ਦੂਜੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਟ੍ਰਾਂਜ਼ਿਸਟਰਾਂ ਨੇ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਦੀ ਥਾਂ ਲਈ।" },
  { sourceQuestionId: "COM001-CP006-EN-018", stem: "ਕਿਹੜਾ ਕ੍ਰਮ ਕੰਪਿਊਟਰ ਪੀੜ੍ਹੀਆਂ ਦੀ ਤਕਨਾਲੋਜੀ ਵਿੱਚ ਆਮ ਬਦਲਾਅ ਦਿਖਾਉਂਦਾ ਹੈ?", options: ["ਵੈਕਿਊਮ ਟਿਊਬ → ਟ੍ਰਾਂਜ਼ਿਸਟਰ → ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ → ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ", "ਟ੍ਰਾਂਜ਼ਿਸਟਰ → ਵੈਕਿਊਮ ਟਿਊਬ → ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ → ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ", "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ → ਵੈਕਿਊਮ ਟਿਊਬ → ਟ੍ਰਾਂਜ਼ਿਸਟਰ → ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ", "ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟ → ਵੈਕਿਊਮ ਟਿਊਬ → ਟ੍ਰਾਂਜ਼ਿਸਟਰ → ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ"], explanation: "ਆਮ ਕ੍ਰਮ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਤੋਂ ਟ੍ਰਾਂਜ਼ਿਸਟਰਾਂ, ਫਿਰ ਇੰਟੀਗ੍ਰੇਟਿਡ ਸਰਕਿਟਾਂ ਅਤੇ ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰਾਂ ਤੱਕ ਜਾਂਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-019", stem: "ਕਿਹੜੀ ਤਕਨਾਲੋਜੀ ਨੇ ਕੰਪਿਊਟਰਾਂ ਨੂੰ ਵੈਕਿਊਮ ਟਿਊਬ ਵਾਲੀਆਂ ਮਸ਼ੀਨਾਂ ਨਾਲੋਂ ਛੋਟਾ ਬਣਾਇਆ?", options: ["ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਮਕੈਨੀਕੀ ਗੀਅਰ", "ਕਾਗਜ਼ੀ ਫਾਈਲ", "ਸਿਰਫ਼ ਪੰਚ ਕਾਰਡ"], explanation: "ਟ੍ਰਾਂਜ਼ਿਸਟਰ ਵੈਕਿਊਮ ਟਿਊਬਾਂ ਨਾਲੋਂ ਛੋਟੇ ਅਤੇ ਜ਼ਿਆਦਾ ਭਰੋਸੇਯੋਗ ਸਨ।" },
  { sourceQuestionId: "COM001-CP006-EN-020", stem: "ਕਿਹੜੇ ਭਾਗ ਨੇ ਮੁੱਖ ਪ੍ਰੋਸੈਸਿੰਗ ਕੰਮਾਂ ਨੂੰ ਇੱਕ ਚਿੱਪ ਉੱਤੇ ਰੱਖਿਆ?", options: ["ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ", "ਵੈਕਿਊਮ ਟਿਊਬ", "ਰਿਲੇ", "ਪੰਚ ਕਾਰਡ"], explanation: "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ ਮੁੱਖ ਪ੍ਰੋਸੈਸਿੰਗ ਕੰਮਾਂ ਨੂੰ ਇੱਕ ਚਿੱਪ ਉੱਤੇ ਰੱਖਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-021", stem: "ਪੰਚ ਕਾਰਡ ਨਾਲ ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਕਰਨ ਵਾਲਾ ਉਪਕਰਣ ਕਿਸ ਨੇ ਵਿਕਸਿਤ ਕੀਤਾ?", options: ["ਹਰਮਨ ਹੋਲਰਿਥ", "ਐਡਾ ਲਵਲੇਸ", "ਜੌਨ ਮਾਕਲੀ", "ਚਾਰਲਸ ਬੈਬੇਜ"], explanation: "ਹਰਮਨ ਹੋਲਰਿਥ ਨੇ ਡਾਟਾ ਪ੍ਰੋਸੈਸਿੰਗ ਲਈ ਪੰਚ ਕਾਰਡ ਉਪਕਰਣ ਵਿਕਸਿਤ ਕੀਤਾ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-022", stem: "ਕਿਹੜੀ ਜੋੜੀ ਦਾ ਮਿਲਾਨ ਸਹੀ ਹੈ?", options: ["ਜੌਨ ਮਾਕਲੀ ਅਤੇ ਜੇ. ਪ੍ਰੈਸਪਰ ਏਕਰਟ — ENIAC ਬਣਾਇਆ", "ਐਡਾ ਲਵਲੇਸ — ਟ੍ਰਾਂਜ਼ਿਸਟਰ", "ਹਰਮਨ ਹੋਲਰਿਥ — ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ", "ਚਾਰਲਸ ਬੈਬੇਜ — ਓਪਟੀਕਲ ਫਾਈਬਰ"], explanation: "ਜੌਨ ਮਾਕਲੀ ਅਤੇ ਜੇ. ਪ੍ਰੈਸਪਰ ਏਕਰਟ ਨੇ ਪੈਨਸਿਲਵੇਨੀਆ ਯੂਨੀਵਰਸਿਟੀ ਵਿੱਚ ENIAC ਬਣਾਇਆ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-023", stem: "ਕੰਪਿਊਟਰ ਪ੍ਰੋਗਰਾਮਿੰਗ ਦੇ ਸ਼ੁਰੂਆਤੀ ਵਿਚਾਰ ਲਈ ਕੌਣ ਪ੍ਰਸਿੱਧ ਹੈ?", options: ["ਐਡਾ ਲਵਲੇਸ", "ਹਰਮਨ ਹੋਲਰਿਥ", "ਜੌਨ ਮਾਕਲੀ", "ਬਲੇਜ਼ ਪਾਸਕਲ"], explanation: "ਐਡਾ ਲਵਲੇਸ ਨੇ ਪਹਿਲਾ ਪ੍ਰਕਾਸ਼ਿਤ ਕੰਪਿਊਟਰ ਪ੍ਰੋਗਰਾਮ ਲਿਖਿਆ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-024", stem: "ਕਿਹੜੀ ਜੋੜੀ ਸਹੀ ਹੈ?", options: ["ENIAC — ਪੈਨਸਿਲਵੇਨੀਆ ਯੂਨੀਵਰਸਿਟੀ ਵਿੱਚ ਬਣਾਇਆ ਗਿਆ", "ਐਨਾਲਿਟਿਕਲ ਇੰਜਣ — ਆਧੁਨਿਕ ਸਮਾਰਟਫੋਨ", "ਐਬੈਕਸ — ਚੌਥੀ ਪੀੜ੍ਹੀ ਦਾ ਕੰਪਿਊਟਰ", "ਮਾਈਕ੍ਰੋਪ੍ਰੋਸੈਸਰ — ਪਹਿਲਾ ਮਕੈਨੀਕੀ ਕੈਲਕੁਲੇਟਰ"], explanation: "ENIAC ਪੈਨਸਿਲਵੇਨੀਆ ਯੂਨੀਵਰਸਿਟੀ ਦੇ ਮੂਰ ਸਕੂਲ ਵਿੱਚ ਬਣਾਇਆ ਗਿਆ ਸੀ।" },
  { sourceQuestionId: "COM001-CP006-EN-025", stem: "ਕਿਹੜਾ ਕੰਪਿਊਟਰ ਲਗਾਤਾਰ ਬਦਲਦੇ ਭੌਤਿਕ ਮਾਪਾਂ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ?", options: ["ਐਨਾਲਾਗ ਕੰਪਿਊਟਰ", "ਡਿਜ਼ਿਟਲ ਕੰਪਿਊਟਰ", "ਮਾਈਕ੍ਰੋਕੰਪਿਊਟਰ", "ਮੇਨਫ੍ਰੇਮ ਕੰਪਿਊਟਰ"], explanation: "ਐਨਾਲਾਗ ਕੰਪਿਊਟਰ ਤਾਪਮਾਨ ਜਾਂ ਦਬਾਅ ਵਰਗੇ ਲਗਾਤਾਰ ਬਦਲਦੇ ਭੌਤਿਕ ਮਾਪਾਂ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-026", stem: "ਕਿਹੜਾ ਕੰਪਿਊਟਰ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਵੱਖਰੀਆਂ ਸੰਖਿਆਵਾਂ ਜਾਂ ਚਿੰਨ੍ਹਾਂ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ?", options: ["ਡਿਜ਼ਿਟਲ ਕੰਪਿਊਟਰ", "ਐਨਾਲਾਗ ਕੰਪਿਊਟਰ", "ਮਕੈਨੀਕੀ ਘੜੀ", "ਸਲਾਈਡ ਰੂਲ"], explanation: "ਡਿਜ਼ਿਟਲ ਕੰਪਿਊਟਰ ਸੰਖਿਆਵਾਂ ਜਾਂ ਚਿੰਨ੍ਹਾਂ ਦੇ ਰੂਪ ਵਿੱਚ ਦਿੱਤੇ ਵੱਖਰੇ ਮੁੱਲਾਂ ਨੂੰ ਪ੍ਰੋਸੈਸ ਕਰਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-027", stem: "ਵੱਖ-ਵੱਖ ਕਿਸਮਾਂ ਦੇ ਕਈ ਕੰਮ ਕਰਨ ਲਈ ਬਣਾਇਆ ਗਿਆ ਕੰਪਿਊਟਰ ਕਹਾਉਂਦਾ ਹੈ:", options: ["ਆਮ-ਉਦੇਸ਼ ਵਾਲਾ ਕੰਪਿਊਟਰ", "ਇੱਕ-ਕੰਮ ਵਾਲਾ ਕੈਲਕੁਲੇਟਰ", "ਪੰਚ ਕਾਰਡ", "ਇਨਪੁਟ ਉਪਕਰਣ"], explanation: "ਆਮ-ਉਦੇਸ਼ ਵਾਲਾ ਕੰਪਿਊਟਰ ਪ੍ਰੋਗਰਾਮਾਂ ਦੀ ਮਦਦ ਨਾਲ ਕਈ ਵੱਖਰੇ ਕੰਮ ਕਰ ਸਕਦਾ ਹੈ।" },
  { sourceQuestionId: "COM001-CP006-EN-028", stem: "ਪ੍ਰੋਗਰਾਮਯੋਗ ਕੰਪਿਊਟਰ ਨਿਸ਼ਚਿਤ-ਕੰਮ ਵਾਲੀ ਮਸ਼ੀਨ ਤੋਂ ਕਿਵੇਂ ਵੱਖਰਾ ਹੈ?", options: ["ਇਹ ਵੱਖ-ਵੱਖ ਹਦਾਇਤਾਂ ਦੇ ਸੈੱਟਾਂ ਦੀ ਪਾਲਣਾ ਕਰ ਸਕਦਾ ਹੈ", "ਇਹ ਸਿਰਫ਼ ਇੱਕ ਗਣਨਾ ਕਰ ਸਕਦਾ ਹੈ", "ਇਹ ਹਦਾਇਤਾਂ ਸੰਭਾਲ ਨਹੀਂ ਸਕਦਾ", "ਇਹ ਬਿਨਾਂ ਇਨਪੁਟ ਦੇ ਕੰਮ ਕਰਦਾ ਹੈ"], explanation: "ਪ੍ਰੋਗਰਾਮਯੋਗ ਕੰਪਿਊਟਰ ਵੱਖ-ਵੱਖ ਸੰਭਾਲੀਆਂ ਹਦਾਇਤਾਂ ਦੀ ਪਾਲਣਾ ਕਰਕੇ ਵੱਖਰੇ ਕੰਮ ਕਰ ਸਕਦਾ ਹੈ।" },
];

const sourceById = new Map(COM001_CP006_ENGLISH_FROZEN.map((question) => [question.questionId, question]));

function buildLocalization(
  language: Exclude<Com001Cp006Language, "en">,
  locale: Exclude<Com001Cp006Locale, "en-IN">,
  copies: readonly CopyEntry[],
): readonly Com001Cp006FrozenQuestion[] {
  return Object.freeze(copies.map((copy, index) => {
    const source = sourceById.get(copy.sourceQuestionId);
    if (!source) throw new Error(`COM-001 CP-006 localization source missing: ${copy.sourceQuestionId}`);
    if (copy.options.length !== source.options.length) throw new Error(`COM-001 CP-006 option count mismatch: ${copy.sourceQuestionId}`);
    const correctIndex = source.correctIndex;
    return Object.freeze({
      questionId: `COM001-CP006-${language.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      sourceQuestionId: source.questionId,
      qlId: source.qlId,
      language,
      locale,
      difficulty: source.difficulty,
      stem: copy.stem,
      options: Object.freeze([...copy.options]),
      correctIndex,
      canonicalAnswer: copy.options[correctIndex]!,
      explanation: copy.explanation,
      sourceFactIds: source.sourceFactIds,
      sourceEnglishAuthorityId: source.sourceEnglishAuthorityId,
      sourceEnglishFrozen: true,
      sourceLocalizationFrozen: true,
    });
  }));
}

export const COM001_CP006_HINDI_FROZEN = buildLocalization("hi", "hi-IN", HI);
export const COM001_CP006_PUNJABI_FROZEN = buildLocalization("pa", "pa-IN", PA);

export const COM001_CP006_LOCALIZATION_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-001-CP-006-HI-PA-LOCALIZATION-FREEZE-V1",
  predecessorAuthorityId: COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  languageCounts: Object.freeze({ en: 28, hi: 28, pa: 28 }),
  localizationLanguages: Object.freeze(["hi", "pa"] as const),
  questionCountPerLanguage: 28,
  combinedFingerprint: createHash("sha256")
    .update(JSON.stringify([...COM001_CP006_ENGLISH_FROZEN, ...COM001_CP006_HINDI_FROZEN, ...COM001_CP006_PUNJABI_FROZEN]))
    .digest("hex"),
} as const;

export function auditCom001Cp006FreezeV1() {
  const all = [
    ...COM001_CP006_ENGLISH_FROZEN,
    ...COM001_CP006_HINDI_FROZEN,
    ...COM001_CP006_PUNJABI_FROZEN,
  ];
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const question of all) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.stem.trim() || !question.explanation.trim()) issues.push(`EMPTY_COPY:${question.questionId}`);
    if (question.stem.split(/\s+/).filter(Boolean).length > 55) issues.push(`STEM_LENGTH:${question.questionId}`);
    if (question.explanation.split(/[.!?]/).filter(Boolean).length > 2) issues.push(`EXPLANATION_LENGTH:${question.questionId}`);
  }
  for (const qlId of COM001_CP006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) {
    if (COM001_CP006_ENGLISH_FROZEN.filter((question) => question.qlId === qlId).length !== 4) issues.push(`ENGLISH_QL_COUNT:${qlId}`);
    if (COM001_CP006_HINDI_FROZEN.filter((question) => question.qlId === qlId).length !== 4) issues.push(`HINDI_QL_COUNT:${qlId}`);
    if (COM001_CP006_PUNJABI_FROZEN.filter((question) => question.qlId === qlId).length !== 4) issues.push(`PUNJABI_QL_COUNT:${qlId}`);
  }
  return { valid: issues.length === 0, issues, englishCount: 28, hindiCount: 28, punjabiCount: 28, qlCount: 7 };
}
