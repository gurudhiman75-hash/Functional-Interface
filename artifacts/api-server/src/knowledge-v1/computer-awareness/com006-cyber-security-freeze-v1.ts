import { createHash } from "node:crypto";
import {
  COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY,
  COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE,
  type Com006CyberSecurityReviewQuestion,
} from "./com006-cyber-security-english-review-v1";

export type Com006Language = "en" | "hi" | "pa";
export type Com006Locale = "en-IN" | "hi-IN" | "pa-IN";
export type Com006FrozenQuestion = {
  questionId: string;
  sourceQuestionId: string;
  qlId: string;
  language: Com006Language;
  locale: Com006Locale;
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

export const COM006_ENGLISH_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-006-ENGLISH-FREEZE-V1",
  chapterCode: "COM-006",
  cpId: "COM-006-CP-001",
  language: "en",
  locale: "en-IN",
  questionCount: 32,
  questionsPerQl: 4,
  permanentQlIds: Object.freeze([...COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY.qlIds]),
  predecessorAuthorityId: COM006_CYBER_SECURITY_ENGLISH_REVIEW_AUTHORITY.authorityId,
} as const;

function freezeEnglish(question: Com006CyberSecurityReviewQuestion): Com006FrozenQuestion {
  const correctIndex = question.options.indexOf(question.answer);
  if (correctIndex < 0) throw new Error(`COM-006 answer missing: ${question.id}`);
  return Object.freeze({
    questionId: question.id,
    sourceQuestionId: question.id,
    qlId: question.ql,
    language: "en",
    locale: "en-IN",
    difficulty: question.difficulty,
    stem: question.stem,
    options: Object.freeze([...question.options]),
    correctIndex,
    canonicalAnswer: question.answer,
    explanation: question.explanation,
    sourceFactIds: Object.freeze([...question.source]),
    sourceEnglishAuthorityId: COM006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
    sourceEnglishFrozen: true,
    sourceLocalizationFrozen: true,
  });
}

export const COM006_ENGLISH_FROZEN: readonly Com006FrozenQuestion[] = Object.freeze(
  COM006_CYBER_SECURITY_ENGLISH_REVIEW_CANDIDATE.map(freezeEnglish),
);

type CopyEntry = { sourceQuestionId: string; stem: string; options: readonly string[]; explanation: string; };

const HI: readonly CopyEntry[] = Object.freeze([
  {
    "sourceQuestionId": "COM006-EN-001",
    "stem": "CIA ट्रायड किन तीन सुरक्षा लक्ष्यों से जुड़ा है?",
    "options": [
      "गोपनीयता, अखंडता और उपलब्धता",
      "गति, आकार और लागत",
      "इनपुट, आउटपुट और स्टोरेज",
      "फाइल, फोल्डर और प्रिंटर"
    ],
    "explanation": "CIA का अर्थ confidentiality, integrity और availability है। ये कंप्यूटर सुरक्षा के तीन मूल लक्ष्य हैं।"
  },
  {
    "sourceQuestionId": "COM006-EN-002",
    "stem": "गोपनीयता का क्या अर्थ है?",
    "options": [
      "केवल अनुमति वाले लोग डेटा देख सकें",
      "डेटा हमेशा उपलब्ध रहे",
      "डेटा जल्दी प्रोसेस हो",
      "डेटा सही तरीके से प्रिंट हो"
    ],
    "explanation": "गोपनीयता का अर्थ है कि डेटा केवल अनुमति वाले लोग ही देख सकें।"
  },
  {
    "sourceQuestionId": "COM006-EN-003",
    "stem": "अखंडता का क्या अर्थ है?",
    "options": [
      "डेटा सही और बिना अनुमति बदला हुआ न हो",
      "हर कोई डेटा पढ़ सके",
      "डिवाइस बिना बिजली चले",
      "फाइल हमेशा मिटा दी जाए"
    ],
    "explanation": "अखंडता का अर्थ है कि डेटा सही रहे और बिना अनुमति बदला न जाए।"
  },
  {
    "sourceQuestionId": "COM006-EN-004",
    "stem": "उपलब्धता का क्या अर्थ है?",
    "options": [
      "डेटा और सेवाएं जरूरत के समय मिलें",
      "डेटा सभी से छिपा रहे",
      "पासवर्ड साझा किया जाए",
      "फाइल बिना जांच के कॉपी हो"
    ],
    "explanation": "उपलब्धता का अर्थ है कि अनुमति वाला उपयोगकर्ता जरूरत के समय डेटा या सेवा इस्तेमाल कर सके।"
  },
  {
    "sourceQuestionId": "COM006-EN-005",
    "stem": "कौन-सा मैलवेयर फाइलों को लॉक करके पैसे मांगता है?",
    "options": [
      "रैनसमवेयर",
      "स्पाइवेयर",
      "वर्म",
      "एंटीवायरस"
    ],
    "explanation": "रैनसमवेयर ऐसा हानिकारक सॉफ्टवेयर है जो फाइलों को लॉक या एन्क्रिप्ट करके पैसे मांगता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-006",
    "stem": "कौन-सा मैलवेयर उपयोगकर्ता की गतिविधि पर चुपके से नजर रखता है?",
    "options": [
      "स्पाइवेयर",
      "फायरवॉल",
      "रैनसमवेयर",
      "कम्पाइलर"
    ],
    "explanation": "स्पाइवेयर ऐसा हानिकारक सॉफ्टवेयर है जो उपयोगकर्ता या डिवाइस की जानकारी चुपके से लेता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-007",
    "stem": "कौन-सा मैलवेयर स्वयं की प्रतियां बनाकर नेटवर्क में फैल सकता है?",
    "options": [
      "वर्म",
      "ट्रोजन हॉर्स",
      "स्पाइवेयर",
      "स्क्रीन लॉक"
    ],
    "explanation": "वर्म अपनी प्रतियां बना सकता है और नेटवर्क के माध्यम से दूसरे डिवाइस में फैल सकता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-008",
    "stem": "कंप्यूटर सुरक्षा में ट्रोजन हॉर्स क्या है?",
    "options": [
      "ऐसा हानिकारक प्रोग्राम जो उपयोगी दिखाई देता है",
      "नेटवर्क ट्रैफिक रोकने वाला डिवाइस",
      "सुरक्षित बैकअप कॉपी",
      "प्रिंटर का एक प्रकार"
    ],
    "explanation": "ट्रोजन हॉर्स उपयोगी प्रोग्राम जैसा दिखाई देता है, लेकिन खोलने पर हानिकारक काम करता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-009",
    "stem": "फिशिंग क्या है?",
    "options": [
      "जानकारी चुराने के लिए भेजा गया नकली संदेश",
      "फाइल सेव करने की विधि",
      "कंप्यूटर ठंडा करने का तरीका",
      "डेटा केबल का प्रकार"
    ],
    "explanation": "फिशिंग में नकली संदेश या वेबसाइट से व्यक्ति को जानकारी देने के लिए फंसाया जाता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-010",
    "stem": "स्पीयर फिशिंग क्या है?",
    "options": [
      "किसी खास व्यक्ति को भेजा गया लक्षित नकली संदेश",
      "केवल प्रिंटर पर हमला करने वाला वायरस",
      "हार्ड डिस्क एन्क्रिप्ट करने की विधि",
      "कीबोर्ड साफ करने का टूल"
    ],
    "explanation": "स्पीयर फिशिंग किसी खास व्यक्ति या संगठन को निशाना बनाती है।"
  },
  {
    "sourceQuestionId": "COM006-EN-011",
    "stem": "सोशल इंजीनियरिंग क्या है?",
    "options": [
      "लोगों को जानकारी या पहुंच देने के लिए बहकाना",
      "खराब कंप्यूटर भागों की मरम्मत",
      "कंप्यूटर प्रोग्राम लिखना",
      "दो प्रिंटर जोड़ना"
    ],
    "explanation": "सोशल इंजीनियरिंग में भरोसे या डर का उपयोग करके जानकारी या पहुंच ली जाती है।"
  },
  {
    "sourceQuestionId": "COM006-EN-012",
    "stem": "संदिग्ध लॉगिन लिंक मिलने पर क्या करना चाहिए?",
    "options": [
      "उसे न खोलें और भेजने वाले की दूसरे तरीके से जांच करें",
      "उसे तुरंत खोलें",
      "सभी संपर्कों को भेजें",
      "जांचने के लिए पासवर्ड डालें"
    ],
    "explanation": "संदिग्ध लिंक न खोलें। भेजने वाले की जांच किसी भरोसेमंद फोन नंबर या वेबसाइट से करें।"
  },
  {
    "sourceQuestionId": "COM006-EN-013",
    "stem": "कौन-सा पासवर्ड अधिक सुरक्षित है?",
    "options": [
      "लंबा और अलग पासफ्रेज",
      "नाम और जन्म वर्ष",
      "हर जगह इस्तेमाल किया गया पासवर्ड",
      "password जैसा छोटा शब्द"
    ],
    "explanation": "लंबा और अलग पासफ्रेज अनुमान लगाना कठिन होता है। इसे दूसरे खाते में दोबारा इस्तेमाल नहीं करना चाहिए।"
  },
  {
    "sourceQuestionId": "COM006-EN-014",
    "stem": "पासवर्ड दोबारा इस्तेमाल क्यों नहीं करना चाहिए?",
    "options": [
      "एक चोरी हुआ पासवर्ड कई खाते खोल सकता है",
      "इससे कंप्यूटर तेज होता है",
      "इससे स्क्रीन अधिक चमकती है",
      "एक पासवर्ड अधिक फाइल रख सकता है"
    ],
    "explanation": "अगर दोबारा इस्तेमाल किया गया पासवर्ड चोरी हो जाए, तो हमलावर उसे दूसरे खातों पर भी आजमा सकता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-015",
    "stem": "मल्टी-फैक्टर ऑथेंटिकेशन के लिए क्या जरूरी है?",
    "options": [
      "दो या अधिक अलग प्रमाण कारक",
      "केवल उपयोगकर्ता नाम",
      "केवल छोटा पासवर्ड",
      "नया कंप्यूटर"
    ],
    "explanation": "Multi-factor authentication (MFA) में पहचान जांचने के लिए दो या अधिक अलग प्रमाण कारक होते हैं।"
  },
  {
    "sourceQuestionId": "COM006-EN-016",
    "stem": "वन-टाइम पासवर्ड क्या है?",
    "options": [
      "एक बार या थोड़े समय के लिए चलने वाला कोड",
      "हर कर्मचारी का साझा पासवर्ड",
      "कभी न बदलने वाला पासवर्ड",
      "फाइल में सेव किया गया नाम"
    ],
    "explanation": "One-time password (OTP) ऐसा कोड है जो एक बार या थोड़े समय तक चलता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-017",
    "stem": "फायरवॉल क्या नियंत्रित करता है?",
    "options": [
      "डिवाइस में आने और बाहर जाने वाला नेटवर्क ट्रैफिक",
      "स्क्रीन का रंग",
      "हार्ड डिस्क का आकार",
      "कीबोर्ड की गति"
    ],
    "explanation": "फायरवॉल नेटवर्क ट्रैफिक की जांच करके सुरक्षा नियमों के अनुसार उसे रोकता या अनुमति देता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-018",
    "stem": "एंटीवायरस सॉफ्टवेयर किस काम में मदद करता है?",
    "options": [
      "हानिकारक सॉफ्टवेयर पहचानने, रोकने या हटाने में",
      "मॉनिटर का आकार बढ़ाने में",
      "नया कीबोर्ड बनाने में",
      "बिना कागज प्रिंट करने में"
    ],
    "explanation": "एंटीवायरस सॉफ्टवेयर हानिकारक सॉफ्टवेयर को पहचानने, रोकने या हटाने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-019",
    "stem": "सॉफ्टवेयर अपडेट सुरक्षा के लिए जरूरी क्यों हैं?",
    "options": [
      "वे ज्ञात सुरक्षा कमजोरियां ठीक कर सकते हैं",
      "वे हमेशा निजी फाइलें मिटाते हैं",
      "वे सभी पासवर्ड बंद कर देते हैं",
      "वे बैकअप की जरूरत खत्म कर देते हैं"
    ],
    "explanation": "सॉफ्टवेयर अपडेट अक्सर उन सुरक्षा कमजोरियों को ठीक करते हैं जिनका हमलावर उपयोग कर सकते हैं।"
  },
  {
    "sourceQuestionId": "COM006-EN-020",
    "stem": "least privilege का क्या अर्थ है?",
    "options": [
      "काम के लिए जितनी पहुंच चाहिए उतनी ही देना",
      "हर उपयोगकर्ता को पूरी पहुंच देना",
      "हर उपयोगकर्ता खाता हटाना",
      "बिना पासवर्ड पहुंच देना"
    ],
    "explanation": "Least privilege का अर्थ है कि उपयोगकर्ता या प्रोग्राम को केवल जरूरी पहुंच दी जाए।"
  },
  {
    "sourceQuestionId": "COM006-EN-021",
    "stem": "बैंकिंग के लिए public Wi-Fi इस्तेमाल करते समय क्या सुरक्षित है?",
    "options": [
      "अविश्वसनीय public network पर बैंकिंग से बचना",
      "बैंकिंग पासवर्ड मित्र को देना",
      "सभी सुरक्षा सुविधाएं बंद करना",
      "पहले अज्ञात लिंक खोलना"
    ],
    "explanation": "जब सुरक्षित कनेक्शन उपलब्ध हो, तो अविश्वसनीय public network पर संवेदनशील बैंकिंग काम न करें।"
  },
  {
    "sourceQuestionId": "COM006-EN-022",
    "stem": "अज्ञात USB drive मिलने पर क्या करना चाहिए?",
    "options": [
      "उसे न लगाएं और सुरक्षित जांच या रिपोर्ट करें",
      "उसकी हर फाइल खोलें",
      "उसे हर कंप्यूटर में लगाएं",
      "उसे administrator access दें"
    ],
    "explanation": "अज्ञात universal serial bus (USB) drive में हानिकारक सॉफ्टवेयर हो सकता है। सुरक्षित जांच के बिना उसका उपयोग न करें।"
  },
  {
    "sourceQuestionId": "COM006-EN-023",
    "stem": "अनपेक्षित email attachment मिलने पर क्या करना चाहिए?",
    "options": [
      "भेजने वाले की जांच होने तक उसे न खोलें",
      "उसे देखने के लिए खोलें",
      "उसे अधिक लोगों को भेजें",
      "नाम बदलकर खोलें"
    ],
    "explanation": "अनपेक्षित attachment में हानिकारक सॉफ्टवेयर हो सकता है। खोलने से पहले भेजने वाले की जांच करें।"
  },
  {
    "sourceQuestionId": "COM006-EN-024",
    "stem": "स्क्रीन लॉक क्यों करनी चाहिए?",
    "options": [
      "दूसरे लोगों को बिना अनुमति डिवाइस इस्तेमाल करने से रोकने के लिए",
      "बैटरी जल्दी चार्ज करने के लिए",
      "सारा मैलवेयर हटाने के लिए",
      "इंटरनेट तेज करने के लिए"
    ],
    "explanation": "स्क्रीन लॉक करने से आपके दूर रहने पर बिना अनुमति डिवाइस का उपयोग रोकने में मदद मिलती है।"
  },
  {
    "sourceQuestionId": "COM006-EN-025",
    "stem": "रैनसमवेयर से फाइलें खोने से बचने का सबसे अच्छा तरीका क्या है?",
    "options": [
      "जांचा हुआ offline backup",
      "लंबी स्क्रीन केबल",
      "अधिक चमकीला मॉनिटर",
      "दूसरा कीबोर्ड"
    ],
    "explanation": "offline backup रैनसमवेयर के बाद फाइलें वापस लाने में मदद कर सकता है। बैकअप की जांच भी होनी चाहिए।"
  },
  {
    "sourceQuestionId": "COM006-EN-026",
    "stem": "एन्क्रिप्शन क्या करता है?",
    "options": [
      "डेटा को ऐसे रूप में बदलता है जिसे key के बिना पढ़ना कठिन हो",
      "डेटा की हर कॉपी मिटा देता है",
      "कीबोर्ड को wireless बनाता है",
      "सभी वायरस हटा देता है"
    ],
    "explanation": "एन्क्रिप्शन पढ़े जाने वाले डेटा को सुरक्षित रूप में बदलता है। उसे पढ़ने के लिए सही key चाहिए।"
  },
  {
    "sourceQuestionId": "COM006-EN-027",
    "stem": "shoulder surfing क्या है?",
    "options": [
      "निजी जानकारी चुराने के लिए किसी व्यक्ति को देखते रहना",
      "कंप्यूटर स्क्रीन की मरम्मत",
      "टीम के साथ फाइल साझा करना",
      "कीबोर्ड साफ करना"
    ],
    "explanation": "shoulder surfing में किसी व्यक्ति को पासवर्ड या निजी जानकारी डालते हुए देखा जाता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-028",
    "stem": "महत्वपूर्ण backups की जांच क्यों करनी चाहिए?",
    "options": [
      "यह पक्का करने के लिए कि फाइलें वापस लाई जा सकती हैं",
      "फाइलों को सार्वजनिक करने के लिए",
      "पासवर्ड की जरूरत हटाने के लिए",
      "सभी software updates रोकने के लिए"
    ],
    "explanation": "बैकअप तभी उपयोगी है जब जरूरत पड़ने पर उसकी फाइलें वापस लाई जा सकें।"
  },
  {
    "sourceQuestionId": "COM006-EN-029",
    "stem": "संदिग्ध account login दिखने पर सबसे पहले क्या करना चाहिए?",
    "options": [
      "पासवर्ड बदलकर घटना की रिपोर्ट करें",
      "इसे हमेशा अनदेखा करें",
      "पासवर्ड online साझा करें",
      "तुरंत हर फाइल मिटा दें"
    ],
    "explanation": "सुरक्षित डिवाइस से पासवर्ड बदलें और संदिग्ध login की रिपोर्ट सेवा या security team को करें।"
  },
  {
    "sourceQuestionId": "COM006-EN-030",
    "stem": "कार्यस्थल के suspected cyber incident की सूचना किसे देनी चाहिए?",
    "options": [
      "कार्यस्थल की information technology या security team को",
      "हर social media व्यक्ति को",
      "किसी अज्ञात caller को",
      "public chat group को"
    ],
    "explanation": "information technology या security team घटना की जांच करके सही कार्रवाई कर सकती है।"
  },
  {
    "sourceQuestionId": "COM006-EN-031",
    "stem": "digital signature क्या जांचने में मदद करता है?",
    "options": [
      "किसने डेटा भेजा और क्या डेटा बदला गया",
      "वेबसाइट का रंग",
      "मॉनिटर का आकार",
      "प्रिंटर की गति"
    ],
    "explanation": "digital signature भेजने वाले की पहचान और डेटा में बदलाव की जांच करने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM006-EN-032",
    "stem": "काम के डिवाइस में malware मिलने पर सबसे सुरक्षित कदम क्या है?",
    "options": [
      "निर्देश के अनुसार उसे disconnect करके रिपोर्ट करें",
      "उससे काम करते रहें",
      "malware को दूसरे डिवाइस में कॉपी करें",
      "सभी security tools बंद करें"
    ],
    "explanation": "निर्देश के अनुसार disconnect करने से फैलाव कम हो सकता है। डिवाइस की रिपोर्ट करें ताकि security team जांच कर सके।"
  }
]);
const PA: readonly CopyEntry[] = Object.freeze([
  {
    "sourceQuestionId": "COM006-EN-001",
    "stem": "CIA ਟ੍ਰਾਇਡ ਕਿਹੜੇ ਤਿੰਨ ਸੁਰੱਖਿਆ ਟੀਚਿਆਂ ਨਾਲ ਜੁੜਿਆ ਹੈ?",
    "options": [
      "ਗੋਪਨੀਯਤਾ, ਅਖੰਡਤਾ ਅਤੇ ਉਪਲਬਧਤਾ",
      "ਗਤੀ, ਆਕਾਰ ਅਤੇ ਲਾਗਤ",
      "ਇਨਪੁਟ, ਆਉਟਪੁਟ ਅਤੇ ਸਟੋਰੇਜ",
      "ਫਾਈਲ, ਫੋਲਡਰ ਅਤੇ ਪ੍ਰਿੰਟਰ"
    ],
    "explanation": "CIA ਦਾ ਅਰਥ confidentiality, integrity ਅਤੇ availability ਹੈ। ਇਹ ਕੰਪਿਊਟਰ ਸੁਰੱਖਿਆ ਦੇ ਤਿੰਨ ਮੁੱਢਲੇ ਟੀਚੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM006-EN-002",
    "stem": "ਗੋਪਨੀਯਤਾ ਦਾ ਕੀ ਅਰਥ ਹੈ?",
    "options": [
      "ਕੇਵਲ ਇਜਾਜ਼ਤ ਵਾਲੇ ਲੋਕ ਡਾਟਾ ਦੇਖ ਸਕਣ",
      "ਡਾਟਾ ਹਮੇਸ਼ਾ ਉਪਲਬਧ ਰਹੇ",
      "ਡਾਟਾ ਤੇਜ਼ੀ ਨਾਲ ਪ੍ਰੋਸੈਸ ਹੋਵੇ",
      "ਡਾਟਾ ਠੀਕ ਤਰੀਕੇ ਨਾਲ ਪ੍ਰਿੰਟ ਹੋਵੇ"
    ],
    "explanation": "ਗੋਪਨੀਯਤਾ ਦਾ ਅਰਥ ਹੈ ਕਿ ਡਾਟਾ ਕੇਵਲ ਇਜਾਜ਼ਤ ਵਾਲੇ ਲੋਕ ਹੀ ਦੇਖ ਸਕਣ।"
  },
  {
    "sourceQuestionId": "COM006-EN-003",
    "stem": "ਅਖੰਡਤਾ ਦਾ ਕੀ ਅਰਥ ਹੈ?",
    "options": [
      "ਡਾਟਾ ਸਹੀ ਰਹੇ ਅਤੇ ਬਿਨਾਂ ਇਜਾਜ਼ਤ ਨਾ ਬਦਲੇ",
      "ਹਰ ਕੋਈ ਡਾਟਾ ਪੜ੍ਹ ਸਕੇ",
      "ਡਿਵਾਈਸ ਬਿਜਲੀ ਤੋਂ ਬਿਨਾਂ ਚੱਲੇ",
      "ਫਾਈਲ ਹਮੇਸ਼ਾ ਮਿਟਾ ਦਿੱਤੀ ਜਾਵੇ"
    ],
    "explanation": "ਅਖੰਡਤਾ ਦਾ ਅਰਥ ਹੈ ਕਿ ਡਾਟਾ ਸਹੀ ਰਹੇ ਅਤੇ ਬਿਨਾਂ ਇਜਾਜ਼ਤ ਨਾ ਬਦਲਿਆ ਜਾਵੇ।"
  },
  {
    "sourceQuestionId": "COM006-EN-004",
    "stem": "ਉਪਲਬਧਤਾ ਦਾ ਕੀ ਅਰਥ ਹੈ?",
    "options": [
      "ਡਾਟਾ ਅਤੇ ਸੇਵਾਵਾਂ ਲੋੜ ਵੇਲੇ ਮਿਲਣ",
      "ਡਾਟਾ ਸਭ ਤੋਂ ਲੁਕਿਆ ਰਹੇ",
      "ਪਾਸਵਰਡ ਸਾਂਝਾ ਕੀਤਾ ਜਾਵੇ",
      "ਫਾਈਲ ਬਿਨਾਂ ਜਾਂਚ ਕਾਪੀ ਹੋਵੇ"
    ],
    "explanation": "ਉਪਲਬਧਤਾ ਦਾ ਅਰਥ ਹੈ ਕਿ ਇਜਾਜ਼ਤ ਵਾਲਾ ਵਰਤੋਂਕਾਰ ਲੋੜ ਵੇਲੇ ਡਾਟਾ ਜਾਂ ਸੇਵਾ ਵਰਤ ਸਕੇ।"
  },
  {
    "sourceQuestionId": "COM006-EN-005",
    "stem": "ਕਿਹੜਾ ਮੈਲਵੇਅਰ ਫਾਈਲਾਂ ਲਾਕ ਕਰਕੇ ਪੈਸੇ ਮੰਗਦਾ ਹੈ?",
    "options": [
      "ਰੈਨਸਮਵੇਅਰ",
      "ਸਪਾਈਵੇਅਰ",
      "ਵਰਮ",
      "ਐਂਟੀਵਾਇਰਸ"
    ],
    "explanation": "ਰੈਨਸਮਵੇਅਰ ਹਾਨੀਕਾਰਕ ਸਾਫਟਵੇਅਰ ਹੈ ਜੋ ਫਾਈਲਾਂ ਲਾਕ ਜਾਂ ਇਨਕ੍ਰਿਪਟ ਕਰਕੇ ਪੈਸੇ ਮੰਗਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-006",
    "stem": "ਕਿਹੜਾ ਮੈਲਵੇਅਰ ਵਰਤੋਂਕਾਰ ਦੀ ਗਤੀਵਿਧੀ ਚੁੱਪਚਾਪ ਦੇਖਦਾ ਹੈ?",
    "options": [
      "ਸਪਾਈਵੇਅਰ",
      "ਫਾਇਰਵਾਲ",
      "ਰੈਨਸਮਵੇਅਰ",
      "ਕੰਪਾਈਲਰ"
    ],
    "explanation": "ਸਪਾਈਵੇਅਰ ਹਾਨੀਕਾਰਕ ਸਾਫਟਵੇਅਰ ਹੈ ਜੋ ਵਰਤੋਂਕਾਰ ਜਾਂ ਡਿਵਾਈਸ ਦੀ ਜਾਣਕਾਰੀ ਚੁੱਪਚਾਪ ਲੈਂਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-007",
    "stem": "ਕਿਹੜਾ ਮੈਲਵੇਅਰ ਆਪਣੀਆਂ ਕਾਪੀਆਂ ਬਣਾ ਕੇ ਨੈੱਟਵਰਕ ਵਿੱਚ ਫੈਲ ਸਕਦਾ ਹੈ?",
    "options": [
      "ਵਰਮ",
      "ਟ੍ਰੋਜਨ ਹੌਰਸ",
      "ਸਪਾਈਵੇਅਰ",
      "ਸਕਰੀਨ ਲਾਕ"
    ],
    "explanation": "ਵਰਮ ਆਪਣੀਆਂ ਕਾਪੀਆਂ ਬਣਾ ਸਕਦਾ ਹੈ ਅਤੇ ਨੈੱਟਵਰਕ ਰਾਹੀਂ ਹੋਰ ਡਿਵਾਈਸਾਂ ਵਿੱਚ ਫੈਲ ਸਕਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-008",
    "stem": "ਕੰਪਿਊਟਰ ਸੁਰੱਖਿਆ ਵਿੱਚ ਟ੍ਰੋਜਨ ਹੌਰਸ ਕੀ ਹੈ?",
    "options": [
      "ਉਪਯੋਗੀ ਦਿਖਾਈ ਦੇਣ ਵਾਲਾ ਹਾਨੀਕਾਰਕ ਪ੍ਰੋਗਰਾਮ",
      "ਨੈੱਟਵਰਕ ਟ੍ਰੈਫਿਕ ਰੋਕਣ ਵਾਲਾ ਡਿਵਾਈਸ",
      "ਸੁਰੱਖਿਅਤ ਬੈਕਅਪ ਕਾਪੀ",
      "ਪ੍ਰਿੰਟਰ ਦੀ ਇੱਕ ਕਿਸਮ"
    ],
    "explanation": "ਟ੍ਰੋਜਨ ਹੌਰਸ ਉਪਯੋਗੀ ਪ੍ਰੋਗਰਾਮ ਵਰਗਾ ਦਿਖਾਈ ਦਿੰਦਾ ਹੈ, ਪਰ ਖੋਲ੍ਹਣ ਉੱਤੇ ਹਾਨੀਕਾਰਕ ਕੰਮ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-009",
    "stem": "ਫਿਸ਼ਿੰਗ ਕੀ ਹੈ?",
    "options": [
      "ਜਾਣਕਾਰੀ ਚੋਰੀ ਕਰਨ ਲਈ ਭੇਜਿਆ ਨਕਲੀ ਸੁਨੇਹਾ",
      "ਫਾਈਲ ਸੇਵ ਕਰਨ ਦੀ ਵਿਧੀ",
      "ਕੰਪਿਊਟਰ ਠੰਢਾ ਕਰਨ ਦਾ ਤਰੀਕਾ",
      "ਡਾਟਾ ਕੇਬਲ ਦੀ ਕਿਸਮ"
    ],
    "explanation": "ਫਿਸ਼ਿੰਗ ਵਿੱਚ ਨਕਲੀ ਸੁਨੇਹੇ ਜਾਂ ਵੈੱਬਸਾਈਟ ਰਾਹੀਂ ਵਿਅਕਤੀ ਨੂੰ ਜਾਣਕਾਰੀ ਦੇਣ ਲਈ ਫਸਾਇਆ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-010",
    "stem": "ਸਪੀਅਰ ਫਿਸ਼ਿੰਗ ਕੀ ਹੈ?",
    "options": [
      "ਕਿਸੇ ਖਾਸ ਵਿਅਕਤੀ ਨੂੰ ਭੇਜਿਆ ਨਿਸ਼ਾਨਾਬੱਧ ਨਕਲੀ ਸੁਨੇਹਾ",
      "ਕੇਵਲ ਪ੍ਰਿੰਟਰ ਉੱਤੇ ਹਮਲਾ ਕਰਨ ਵਾਲਾ ਵਾਇਰਸ",
      "ਹਾਰਡ ਡਿਸਕ ਇਨਕ੍ਰਿਪਟ ਕਰਨ ਦੀ ਵਿਧੀ",
      "ਕੀਬੋਰਡ ਸਾਫ ਕਰਨ ਵਾਲਾ ਟੂਲ"
    ],
    "explanation": "ਸਪੀਅਰ ਫਿਸ਼ਿੰਗ ਕਿਸੇ ਖਾਸ ਵਿਅਕਤੀ ਜਾਂ ਸੰਸਥਾ ਨੂੰ ਨਿਸ਼ਾਨਾ ਬਣਾਉਂਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-011",
    "stem": "ਸੋਸ਼ਲ ਇੰਜੀਨੀਅਰਿੰਗ ਕੀ ਹੈ?",
    "options": [
      "ਜਾਣਕਾਰੀ ਜਾਂ ਪਹੁੰਚ ਦੇਣ ਲਈ ਲੋਕਾਂ ਨੂੰ ਭਰਮਾਉਣਾ",
      "ਖਰਾਬ ਕੰਪਿਊਟਰ ਭਾਗਾਂ ਦੀ ਮੁਰੰਮਤ",
      "ਕੰਪਿਊਟਰ ਪ੍ਰੋਗਰਾਮ ਲਿਖਣਾ",
      "ਦੋ ਪ੍ਰਿੰਟਰ ਜੋੜਨਾ"
    ],
    "explanation": "ਸੋਸ਼ਲ ਇੰਜੀਨੀਅਰਿੰਗ ਵਿੱਚ ਭਰੋਸੇ ਜਾਂ ਡਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਜਾਣਕਾਰੀ ਜਾਂ ਪਹੁੰਚ ਲਈ ਜਾਂਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-012",
    "stem": "ਸ਼ੱਕੀ ਲਾਗਇਨ ਲਿੰਕ ਮਿਲਣ ਉੱਤੇ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    "options": [
      "ਇਸਨੂੰ ਨਾ ਖੋਲ੍ਹੋ ਅਤੇ ਭੇਜਣ ਵਾਲੇ ਦੀ ਹੋਰ ਤਰੀਕੇ ਨਾਲ ਜਾਂਚ ਕਰੋ",
      "ਇਸਨੂੰ ਤੁਰੰਤ ਖੋਲ੍ਹੋ",
      "ਸਾਰੇ ਸੰਪਰਕਾਂ ਨੂੰ ਭੇਜੋ",
      "ਜਾਂਚਣ ਲਈ ਪਾਸਵਰਡ ਪਾਓ"
    ],
    "explanation": "ਸ਼ੱਕੀ ਲਿੰਕ ਨਾ ਖੋਲ੍ਹੋ। ਭੇਜਣ ਵਾਲੇ ਦੀ ਜਾਂਚ ਭਰੋਸੇਯੋਗ ਫੋਨ ਨੰਬਰ ਜਾਂ ਵੈੱਬਸਾਈਟ ਰਾਹੀਂ ਕਰੋ।"
  },
  {
    "sourceQuestionId": "COM006-EN-013",
    "stem": "ਕਿਹੜਾ ਪਾਸਵਰਡ ਵਧੇਰੇ ਸੁਰੱਖਿਅਤ ਹੈ?",
    "options": [
      "ਲੰਮਾ ਅਤੇ ਵੱਖਰਾ ਪਾਸਫਰੇਜ਼",
      "ਨਾਮ ਅਤੇ ਜਨਮ ਸਾਲ",
      "ਹਰ ਥਾਂ ਵਰਤਿਆ ਪਾਸਵਰਡ",
      "password ਵਰਗਾ ਛੋਟਾ ਸ਼ਬਦ"
    ],
    "explanation": "ਲੰਮਾ ਅਤੇ ਵੱਖਰਾ ਪਾਸਫਰੇਜ਼ ਅਨੁਮਾਨ ਲਗਾਉਣਾ ਔਖਾ ਹੁੰਦਾ ਹੈ। ਇਸਨੂੰ ਹੋਰ ਖਾਤੇ ਵਿੱਚ ਦੁਬਾਰਾ ਨਹੀਂ ਵਰਤਣਾ ਚਾਹੀਦਾ।"
  },
  {
    "sourceQuestionId": "COM006-EN-014",
    "stem": "ਪਾਸਵਰਡ ਦੁਬਾਰਾ ਕਿਉਂ ਨਹੀਂ ਵਰਤਣਾ ਚਾਹੀਦਾ?",
    "options": [
      "ਇੱਕ ਚੋਰੀ ਹੋਇਆ ਪਾਸਵਰਡ ਕਈ ਖਾਤੇ ਖੋਲ੍ਹ ਸਕਦਾ ਹੈ",
      "ਇਸ ਨਾਲ ਕੰਪਿਊਟਰ ਤੇਜ਼ ਹੁੰਦਾ ਹੈ",
      "ਇਸ ਨਾਲ ਸਕਰੀਨ ਵਧੇਰੇ ਚਮਕਦੀ ਹੈ",
      "ਇੱਕ ਪਾਸਵਰਡ ਹੋਰ ਫਾਈਲਾਂ ਰੱਖ ਸਕਦਾ ਹੈ"
    ],
    "explanation": "ਜੇ ਦੁਬਾਰਾ ਵਰਤਿਆ ਪਾਸਵਰਡ ਚੋਰੀ ਹੋ ਜਾਵੇ, ਤਾਂ ਹਮਲਾਵਰ ਇਸਨੂੰ ਹੋਰ ਖਾਤਿਆਂ ਉੱਤੇ ਵੀ ਅਜ਼ਮਾ ਸਕਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-015",
    "stem": "ਮਲਟੀ-ਫੈਕਟਰ ਆਥੈਂਟੀਕੇਸ਼ਨ ਲਈ ਕੀ ਲੋੜੀਂਦਾ ਹੈ?",
    "options": [
      "ਦੋ ਜਾਂ ਵੱਧ ਵੱਖਰੇ ਪ੍ਰਮਾਣ ਕਾਰਕ",
      "ਕੇਵਲ ਵਰਤੋਂਕਾਰ ਨਾਮ",
      "ਕੇਵਲ ਛੋਟਾ ਪਾਸਵਰਡ",
      "ਨਵਾਂ ਕੰਪਿਊਟਰ"
    ],
    "explanation": "Multi-factor authentication (MFA) ਵਿੱਚ ਪਛਾਣ ਜਾਂਚਣ ਲਈ ਦੋ ਜਾਂ ਵੱਧ ਵੱਖਰੇ ਪ੍ਰਮਾਣ ਕਾਰਕ ਹੁੰਦੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM006-EN-016",
    "stem": "ਵਨ-ਟਾਈਮ ਪਾਸਵਰਡ ਕੀ ਹੈ?",
    "options": [
      "ਇੱਕ ਵਾਰ ਜਾਂ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਚੱਲਣ ਵਾਲਾ ਕੋਡ",
      "ਹਰ ਕਰਮਚਾਰੀ ਦਾ ਸਾਂਝਾ ਪਾਸਵਰਡ",
      "ਕਦੇ ਨਾ ਬਦਲਣ ਵਾਲਾ ਪਾਸਵਰਡ",
      "ਫਾਈਲ ਵਿੱਚ ਸੇਵ ਕੀਤਾ ਨਾਮ"
    ],
    "explanation": "One-time password (OTP) ਉਹ ਕੋਡ ਹੈ ਜੋ ਇੱਕ ਵਾਰ ਜਾਂ ਥੋੜ੍ਹੇ ਸਮੇਂ ਲਈ ਚੱਲਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-017",
    "stem": "ਫਾਇਰਵਾਲ ਕੀ ਕੰਟਰੋਲ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਡਿਵਾਈਸ ਵਿੱਚ ਆਉਣ ਅਤੇ ਬਾਹਰ ਜਾਣ ਵਾਲਾ ਨੈੱਟਵਰਕ ਟ੍ਰੈਫਿਕ",
      "ਸਕਰੀਨ ਦਾ ਰੰਗ",
      "ਹਾਰਡ ਡਿਸਕ ਦਾ ਆਕਾਰ",
      "ਕੀਬੋਰਡ ਦੀ ਗਤੀ"
    ],
    "explanation": "ਫਾਇਰਵਾਲ ਨੈੱਟਵਰਕ ਟ੍ਰੈਫਿਕ ਦੀ ਜਾਂਚ ਕਰਕੇ ਸੁਰੱਖਿਆ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਇਸਨੂੰ ਰੋਕਦਾ ਜਾਂ ਇਜਾਜ਼ਤ ਦਿੰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-018",
    "stem": "ਐਂਟੀਵਾਇਰਸ ਸਾਫਟਵੇਅਰ ਕਿਸ ਕੰਮ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਹਾਨੀਕਾਰਕ ਸਾਫਟਵੇਅਰ ਪਛਾਣਨ, ਰੋਕਣ ਜਾਂ ਹਟਾਉਣ ਵਿੱਚ",
      "ਮਾਨੀਟਰ ਦਾ ਆਕਾਰ ਵਧਾਉਣ ਵਿੱਚ",
      "ਨਵਾਂ ਕੀਬੋਰਡ ਬਣਾਉਣ ਵਿੱਚ",
      "ਬਿਨਾਂ ਕਾਗਜ਼ ਪ੍ਰਿੰਟ ਕਰਨ ਵਿੱਚ"
    ],
    "explanation": "ਐਂਟੀਵਾਇਰਸ ਸਾਫਟਵੇਅਰ ਹਾਨੀਕਾਰਕ ਸਾਫਟਵੇਅਰ ਪਛਾਣਨ, ਰੋਕਣ ਜਾਂ ਹਟਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-019",
    "stem": "ਸਾਫਟਵੇਅਰ ਅਪਡੇਟ ਸੁਰੱਖਿਆ ਲਈ ਜ਼ਰੂਰੀ ਕਿਉਂ ਹਨ?",
    "options": [
      "ਉਹ ਜਾਣੀਆਂ ਸੁਰੱਖਿਆ ਕਮਜ਼ੋਰੀਆਂ ਠੀਕ ਕਰ ਸਕਦੇ ਹਨ",
      "ਉਹ ਹਮੇਸ਼ਾ ਨਿੱਜੀ ਫਾਈਲਾਂ ਮਿਟਾਉਂਦੇ ਹਨ",
      "ਉਹ ਸਾਰੇ ਪਾਸਵਰਡ ਬੰਦ ਕਰਦੇ ਹਨ",
      "ਉਹ ਬੈਕਅਪ ਦੀ ਲੋੜ ਖਤਮ ਕਰਦੇ ਹਨ"
    ],
    "explanation": "ਸਾਫਟਵੇਅਰ ਅਪਡੇਟ ਅਕਸਰ ਉਹ ਸੁਰੱਖਿਆ ਕਮਜ਼ੋਰੀਆਂ ਠੀਕ ਕਰਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਦਾ ਹਮਲਾਵਰ ਵਰਤੋਂ ਕਰ ਸਕਦੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM006-EN-020",
    "stem": "least privilege ਦਾ ਕੀ ਅਰਥ ਹੈ?",
    "options": [
      "ਕੰਮ ਲਈ ਜਿੰਨੀ ਪਹੁੰਚ ਚਾਹੀਦੀ ਹੈ ਉੱਨੀ ਹੀ ਦੇਣਾ",
      "ਹਰ ਵਰਤੋਂਕਾਰ ਨੂੰ ਪੂਰੀ ਪਹੁੰਚ ਦੇਣਾ",
      "ਹਰ ਵਰਤੋਂਕਾਰ ਖਾਤਾ ਮਿਟਾਉਣਾ",
      "ਬਿਨਾਂ ਪਾਸਵਰਡ ਪਹੁੰਚ ਦੇਣਾ"
    ],
    "explanation": "Least privilege ਦਾ ਅਰਥ ਹੈ ਕਿ ਵਰਤੋਂਕਾਰ ਜਾਂ ਪ੍ਰੋਗਰਾਮ ਨੂੰ ਕੇਵਲ ਲੋੜੀਂਦੀ ਪਹੁੰਚ ਦਿੱਤੀ ਜਾਵੇ।"
  },
  {
    "sourceQuestionId": "COM006-EN-021",
    "stem": "ਬੈਂਕਿੰਗ ਲਈ public Wi-Fi ਵਰਤਦੇ ਸਮੇਂ ਕੀ ਸੁਰੱਖਿਅਤ ਹੈ?",
    "options": [
      "ਅਣਭਰੋਸੇਯੋਗ public network ਉੱਤੇ ਬੈਂਕਿੰਗ ਤੋਂ ਬਚਣਾ",
      "ਬੈਂਕਿੰਗ ਪਾਸਵਰਡ ਦੋਸਤ ਨੂੰ ਦੇਣਾ",
      "ਸਾਰੀਆਂ ਸੁਰੱਖਿਆ ਸਹੂਲਤਾਂ ਬੰਦ ਕਰਨਾ",
      "ਪਹਿਲਾਂ ਅਣਜਾਣ ਲਿੰਕ ਖੋਲ੍ਹਣਾ"
    ],
    "explanation": "ਜਦੋਂ ਸੁਰੱਖਿਅਤ ਕਨੈਕਸ਼ਨ ਉਪਲਬਧ ਹੋਵੇ, ਤਾਂ ਅਣਭਰੋਸੇਯੋਗ public network ਉੱਤੇ ਸੰਵੇਦਨਸ਼ੀਲ ਬੈਂਕਿੰਗ ਕੰਮ ਨਾ ਕਰੋ।"
  },
  {
    "sourceQuestionId": "COM006-EN-022",
    "stem": "ਅਣਜਾਣ USB drive ਮਿਲਣ ਉੱਤੇ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    "options": [
      "ਇਸਨੂੰ ਨਾ ਲਗਾਓ ਅਤੇ ਸੁਰੱਖਿਅਤ ਜਾਂਚ ਜਾਂ ਰਿਪੋਰਟ ਕਰੋ",
      "ਇਸਦੀ ਹਰ ਫਾਈਲ ਖੋਲ੍ਹੋ",
      "ਇਸਨੂੰ ਹਰ ਕੰਪਿਊਟਰ ਵਿੱਚ ਲਗਾਓ",
      "ਇਸਨੂੰ administrator access ਦਿਓ"
    ],
    "explanation": "ਅਣਜਾਣ universal serial bus (USB) drive ਵਿੱਚ ਹਾਨੀਕਾਰਕ ਸਾਫਟਵੇਅਰ ਹੋ ਸਕਦਾ ਹੈ। ਸੁਰੱਖਿਅਤ ਜਾਂਚ ਤੋਂ ਬਿਨਾਂ ਇਸਨੂੰ ਨਾ ਵਰਤੋ।"
  },
  {
    "sourceQuestionId": "COM006-EN-023",
    "stem": "ਅਣਉਮੀਦ email attachment ਮਿਲਣ ਉੱਤੇ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    "options": [
      "ਭੇਜਣ ਵਾਲੇ ਦੀ ਜਾਂਚ ਹੋਣ ਤੱਕ ਇਸਨੂੰ ਨਾ ਖੋਲ੍ਹੋ",
      "ਇਹ ਦੇਖਣ ਲਈ ਖੋਲ੍ਹੋ ਕਿ ਅੰਦਰ ਕੀ ਹੈ",
      "ਇਸਨੂੰ ਹੋਰ ਲੋਕਾਂ ਨੂੰ ਭੇਜੋ",
      "ਨਾਮ ਬਦਲ ਕੇ ਖੋਲ੍ਹੋ"
    ],
    "explanation": "ਅਣਉਮੀਦ attachment ਵਿੱਚ ਹਾਨੀਕਾਰਕ ਸਾਫਟਵੇਅਰ ਹੋ ਸਕਦਾ ਹੈ। ਖੋਲ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ ਭੇਜਣ ਵਾਲੇ ਦੀ ਜਾਂਚ ਕਰੋ।"
  },
  {
    "sourceQuestionId": "COM006-EN-024",
    "stem": "ਸਕਰੀਨ ਲਾਕ ਕਿਉਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
    "options": [
      "ਦੂਜੇ ਲੋਕਾਂ ਨੂੰ ਬਿਨਾਂ ਇਜਾਜ਼ਤ ਡਿਵਾਈਸ ਵਰਤਣ ਤੋਂ ਰੋਕਣ ਲਈ",
      "ਬੈਟਰੀ ਜਲਦੀ ਚਾਰਜ ਕਰਨ ਲਈ",
      "ਸਾਰਾ ਮੈਲਵੇਅਰ ਹਟਾਉਣ ਲਈ",
      "ਇੰਟਰਨੈੱਟ ਤੇਜ਼ ਕਰਨ ਲਈ"
    ],
    "explanation": "ਸਕਰੀਨ ਲਾਕ ਕਰਨ ਨਾਲ ਤੁਹਾਡੇ ਦੂਰ ਹੋਣ ਵੇਲੇ ਬਿਨਾਂ ਇਜਾਜ਼ਤ ਡਿਵਾਈਸ ਦੀ ਵਰਤੋਂ ਰੋਕਣ ਵਿੱਚ ਮਦਦ ਮਿਲਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-025",
    "stem": "ਰੈਨਸਮਵੇਅਰ ਕਾਰਨ ਫਾਈਲਾਂ ਗੁਆਉਣ ਤੋਂ ਬਚਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ ਕੀ ਹੈ?",
    "options": [
      "ਜਾਂਚਿਆ ਹੋਇਆ offline backup",
      "ਲੰਮੀ ਸਕਰੀਨ ਕੇਬਲ",
      "ਵਧੇਰੇ ਚਮਕੀਲਾ ਮਾਨੀਟਰ",
      "ਦੂਜਾ ਕੀਬੋਰਡ"
    ],
    "explanation": "offline backup ਰੈਨਸਮਵੇਅਰ ਤੋਂ ਬਾਅਦ ਫਾਈਲਾਂ ਵਾਪਸ ਲਿਆਉਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ। ਬੈਕਅਪ ਦੀ ਜਾਂਚ ਵੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-026",
    "stem": "ਇਨਕ੍ਰਿਪਸ਼ਨ ਕੀ ਕਰਦੀ ਹੈ?",
    "options": [
      "ਡਾਟਾ ਨੂੰ ਅਜਿਹੇ ਰੂਪ ਵਿੱਚ ਬਦਲਦੀ ਹੈ ਜਿਸਨੂੰ key ਤੋਂ ਬਿਨਾਂ ਪੜ੍ਹਨਾ ਔਖਾ ਹੋਵੇ",
      "ਡਾਟਾ ਦੀ ਹਰ ਕਾਪੀ ਮਿਟਾ ਦਿੰਦੀ ਹੈ",
      "ਕੀਬੋਰਡ ਨੂੰ wireless ਬਣਾਉਂਦੀ ਹੈ",
      "ਸਾਰੇ ਵਾਇਰਸ ਹਟਾ ਦਿੰਦੀ ਹੈ"
    ],
    "explanation": "ਇਨਕ੍ਰਿਪਸ਼ਨ ਪੜ੍ਹਨਯੋਗ ਡਾਟਾ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰੂਪ ਵਿੱਚ ਬਦਲਦੀ ਹੈ। ਇਸਨੂੰ ਪੜ੍ਹਨ ਲਈ ਸਹੀ key ਚਾਹੀਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-027",
    "stem": "shoulder surfing ਕੀ ਹੈ?",
    "options": [
      "ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਚੋਰੀ ਕਰਨ ਲਈ ਕਿਸੇ ਵਿਅਕਤੀ ਨੂੰ ਦੇਖਦੇ ਰਹਿਣਾ",
      "ਕੰਪਿਊਟਰ ਸਕਰੀਨ ਦੀ ਮੁਰੰਮਤ",
      "ਟੀਮ ਨਾਲ ਫਾਈਲ ਸਾਂਝੀ ਕਰਨਾ",
      "ਕੀਬੋਰਡ ਸਾਫ ਕਰਨਾ"
    ],
    "explanation": "shoulder surfing ਵਿੱਚ ਕਿਸੇ ਵਿਅਕਤੀ ਨੂੰ ਪਾਸਵਰਡ ਜਾਂ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਦਾਖਲ ਕਰਦੇ ਹੋਏ ਦੇਖਿਆ ਜਾਂਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-028",
    "stem": "ਮਹੱਤਵਪੂਰਨ backups ਦੀ ਜਾਂਚ ਕਿਉਂ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
    "options": [
      "ਇਹ ਪੱਕਾ ਕਰਨ ਲਈ ਕਿ ਫਾਈਲਾਂ ਵਾਪਸ ਲਿਆਂਦੀਆਂ ਜਾ ਸਕਣ",
      "ਫਾਈਲਾਂ ਨੂੰ ਜਨਤਕ ਕਰਨ ਲਈ",
      "ਪਾਸਵਰਡ ਦੀ ਲੋੜ ਹਟਾਉਣ ਲਈ",
      "ਸਾਰੇ software updates ਰੋਕਣ ਲਈ"
    ],
    "explanation": "ਬੈਕਅਪ ਤਦ ਹੀ ਲਾਭਦਾਇਕ ਹੈ ਜਦੋਂ ਲੋੜ ਵੇਲੇ ਇਸ ਦੀਆਂ ਫਾਈਲਾਂ ਵਾਪਸ ਲਿਆਂਦੀਆਂ ਜਾ ਸਕਣ।"
  },
  {
    "sourceQuestionId": "COM006-EN-029",
    "stem": "ਸ਼ੱਕੀ account login ਦਿਖਣ ਉੱਤੇ ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    "options": [
      "ਪਾਸਵਰਡ ਬਦਲ ਕੇ ਘਟਨਾ ਦੀ ਰਿਪੋਰਟ ਕਰੋ",
      "ਇਸਨੂੰ ਹਮੇਸ਼ਾ ਅਣਡਿੱਠਾ ਕਰੋ",
      "ਪਾਸਵਰਡ online ਸਾਂਝਾ ਕਰੋ",
      "ਤੁਰੰਤ ਹਰ ਫਾਈਲ ਮਿਟਾ ਦਿਓ"
    ],
    "explanation": "ਸੁਰੱਖਿਅਤ ਡਿਵਾਈਸ ਤੋਂ ਪਾਸਵਰਡ ਬਦਲੋ ਅਤੇ ਸ਼ੱਕੀ login ਦੀ ਰਿਪੋਰਟ ਸੇਵਾ ਜਾਂ security team ਨੂੰ ਕਰੋ।"
  },
  {
    "sourceQuestionId": "COM006-EN-030",
    "stem": "ਕੰਮ ਵਾਲੀ ਥਾਂ ਦੇ suspected cyber incident ਦੀ ਜਾਣਕਾਰੀ ਕਿਸਨੂੰ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?",
    "options": [
      "ਕੰਮ ਵਾਲੀ ਥਾਂ ਦੀ information technology ਜਾਂ security team ਨੂੰ",
      "ਹਰ social media ਵਿਅਕਤੀ ਨੂੰ",
      "ਕਿਸੇ ਅਣਜਾਣ caller ਨੂੰ",
      "public chat group ਨੂੰ"
    ],
    "explanation": "information technology ਜਾਂ security team ਘਟਨਾ ਦੀ ਜਾਂਚ ਕਰਕੇ ਸਹੀ ਕਾਰਵਾਈ ਕਰ ਸਕਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-031",
    "stem": "digital signature ਕੀ ਜਾਂਚਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਕਿਸ ਨੇ ਡਾਟਾ ਭੇਜਿਆ ਅਤੇ ਕੀ ਡਾਟਾ ਬਦਲਿਆ ਗਿਆ",
      "ਵੈੱਬਸਾਈਟ ਦਾ ਰੰਗ",
      "ਮਾਨੀਟਰ ਦਾ ਆਕਾਰ",
      "ਪ੍ਰਿੰਟਰ ਦੀ ਗਤੀ"
    ],
    "explanation": "digital signature ਭੇਜਣ ਵਾਲੇ ਦੀ ਪਛਾਣ ਅਤੇ ਡਾਟਾ ਵਿੱਚ ਬਦਲਾਅ ਦੀ ਜਾਂਚ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM006-EN-032",
    "stem": "ਕੰਮ ਵਾਲੇ ਡਿਵਾਈਸ ਵਿੱਚ malware ਮਿਲਣ ਉੱਤੇ ਸਭ ਤੋਂ ਸੁਰੱਖਿਅਤ ਕਦਮ ਕੀ ਹੈ?",
    "options": [
      "ਹਦਾਇਤ ਅਨੁਸਾਰ ਇਸਨੂੰ disconnect ਕਰਕੇ ਰਿਪੋਰਟ ਕਰੋ",
      "ਇਸ ਨਾਲ ਕੰਮ ਕਰਦੇ ਰਹੋ",
      "malware ਨੂੰ ਹੋਰ ਡਿਵਾਈਸ ਵਿੱਚ ਕਾਪੀ ਕਰੋ",
      "ਸਾਰੇ security tools ਬੰਦ ਕਰੋ"
    ],
    "explanation": "ਹਦਾਇਤ ਅਨੁਸਾਰ disconnect ਕਰਨ ਨਾਲ ਫੈਲਾਅ ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ। ਡਿਵਾਈਸ ਦੀ ਰਿਪੋਰਟ ਕਰੋ ਤਾਂ ਜੋ security team ਜਾਂਚ ਕਰ ਸਕੇ।"
  }
]);

const englishById = new Map(COM006_ENGLISH_FROZEN.map((question) => [question.questionId, question]));

function buildLocalization(language: "hi" | "pa", locale: "hi-IN" | "pa-IN", copies: readonly CopyEntry[]) {
  return Object.freeze(copies.map((copy, index) => {
    const source = englishById.get(copy.sourceQuestionId);
    if (!source) throw new Error(`COM-006 localization source missing: ${copy.sourceQuestionId}`);
    if (copy.options.length !== source.options.length) throw new Error(`COM-006 option count mismatch: ${copy.sourceQuestionId}`);
    return Object.freeze({
      questionId: `COM006-${language.toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
      sourceQuestionId: source.sourceQuestionId,
      qlId: source.qlId,
      language,
      locale,
      difficulty: source.difficulty,
      stem: copy.stem,
      options: Object.freeze([...copy.options]),
      correctIndex: source.correctIndex,
      canonicalAnswer: copy.options[source.correctIndex],
      explanation: copy.explanation,
      sourceFactIds: source.sourceFactIds,
      sourceEnglishAuthorityId: source.sourceEnglishAuthorityId,
      sourceEnglishFrozen: true,
      sourceLocalizationFrozen: true,
    });
  }));
}

export const COM006_HINDI_FROZEN = buildLocalization("hi", "hi-IN", HI);
export const COM006_PUNJABI_FROZEN = buildLocalization("pa", "pa-IN", PA);

export const COM006_LOCALIZATION_FREEZE_AUTHORITY_V1 = {
  authorityId: "COM-006-HI-PA-LOCALIZATION-FREEZE-V1",
  predecessorAuthorityId: COM006_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  questionCountPerLanguage: 32,
  languageCounts: Object.freeze({ en: 32, hi: 32, pa: 32 }),
  localizationLanguages: Object.freeze(["hi", "pa"] as const),
  combinedFingerprint: createHash("sha256").update(JSON.stringify([
    ...COM006_ENGLISH_FROZEN,
    ...COM006_HINDI_FROZEN,
    ...COM006_PUNJABI_FROZEN,
  ])).digest("hex"),
} as const;

export function auditCom006FreezeV1() {
  const all = [...COM006_ENGLISH_FROZEN, ...COM006_HINDI_FROZEN, ...COM006_PUNJABI_FROZEN];
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const question of all) {
    if (ids.has(question.questionId)) issues.push(`DUPLICATE_ID:${question.questionId}`);
    ids.add(question.questionId);
    if (question.options.length !== 4 || new Set(question.options).size !== 4) issues.push(`OPTIONS:${question.questionId}`);
    if (question.options[question.correctIndex] !== question.canonicalAnswer) issues.push(`ANSWER:${question.questionId}`);
    if (!question.stem.trim() || !question.explanation.trim()) issues.push(`EMPTY_COPY:${question.questionId}`);
    if (question.stem.split(/\\s+/).filter(Boolean).length > 55) issues.push(`STEM_LENGTH:${question.questionId}`);
    if (question.explanation.split(/[.!?]/).filter(Boolean).length > 2) issues.push(`EXPLANATION_LENGTH:${question.questionId}`);
    if (/\\bassociat\\w*\\b/i.test(`${question.stem} ${question.explanation}`)) issues.push(`FORMAL_WORDING:${question.questionId}`);
  }
  for (const qlId of COM006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds) {
    for (const corpus of [COM006_ENGLISH_FROZEN, COM006_HINDI_FROZEN, COM006_PUNJABI_FROZEN]) {
      if (corpus.filter((question) => question.qlId === qlId).length !== 4) issues.push(`QL_COUNT:${qlId}`);
    }
  }
  if (COM006_ENGLISH_FROZEN.length !== 32 || COM006_HINDI_FROZEN.length !== 32 || COM006_PUNJABI_FROZEN.length !== 32) issues.push("LANGUAGE_COUNT");
  return {
    valid: issues.length === 0,
    issues,
    englishCount: COM006_ENGLISH_FROZEN.length,
    hindiCount: COM006_HINDI_FROZEN.length,
    punjabiCount: COM006_PUNJABI_FROZEN.length,
    qlCount: COM006_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds.length,
  };
}
