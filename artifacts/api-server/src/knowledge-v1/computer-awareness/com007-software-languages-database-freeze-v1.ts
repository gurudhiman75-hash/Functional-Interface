import { createHash } from "node:crypto";
import { COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY, COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE, type Com007ReviewQuestion } from "./com007-software-languages-database-english-review-v1";

export type Com007Language = "en" | "hi" | "pa";
export type Com007Locale = "en-IN" | "hi-IN" | "pa-IN";
export type Com007FrozenQuestion = {
  questionId:string; sourceQuestionId:string; qlId:string; language:Com007Language; locale:Com007Locale;
  difficulty:"EASY"|"MEDIUM"; stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceFactIds:readonly string[]; sourceEnglishAuthorityId:string;
  sourceEnglishFrozen:true; sourceLocalizationFrozen:true;
};
export const COM007_ENGLISH_FREEZE_AUTHORITY_V1 = {
  authorityId:"COM-007-ENGLISH-FREEZE-V1", chapterCode:"COM-007", cpId:"COM-007-CP-001",
  language:"en", locale:"en-IN", questionCount:32, questionsPerQl:4,
  permanentQlIds:Object.freeze([...COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY.qlIds]),
  predecessorAuthorityId:COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_AUTHORITY.authorityId,
} as const;
function freezeEnglish(question:Com007ReviewQuestion):Com007FrozenQuestion {
  const correctIndex=question.options.indexOf(question.answer);
  if(correctIndex<0) throw new Error("COM-007 answer missing: "+question.id);
  return Object.freeze({
    questionId:question.id, sourceQuestionId:question.id, qlId:question.ql, language:"en", locale:"en-IN",
    difficulty:question.difficulty, stem:question.stem, options:Object.freeze([...question.options]), correctIndex,
    canonicalAnswer:question.answer, explanation:question.explanation, sourceFactIds:Object.freeze([...question.source]),
    sourceEnglishAuthorityId:COM007_ENGLISH_FREEZE_AUTHORITY_V1.authorityId, sourceEnglishFrozen:true, sourceLocalizationFrozen:true,
  });
}
export const COM007_ENGLISH_FROZEN:readonly Com007FrozenQuestion[]=Object.freeze(COM007_SOFTWARE_LANGUAGES_DATABASE_ENGLISH_REVIEW_CANDIDATE.map(freezeEnglish));
type CopyEntry={sourceQuestionId:string;stem:string;options:readonly string[];explanation:string;};
const HI:readonly CopyEntry[]=Object.freeze([
  {
    "sourceQuestionId": "COM007-EN-001",
    "stem": "कौन-सा सॉफ्टवेयर कंप्यूटर का मूल काम नियंत्रित करता है?",
    "options": [
      "सिस्टम सॉफ्टवेयर",
      "एप्लिकेशन सॉफ्टवेयर",
      "यूटिलिटी सॉफ्टवेयर",
      "डेटाबेस सॉफ्टवेयर"
    ],
    "explanation": "सिस्टम सॉफ्टवेयर कंप्यूटर को नियंत्रित करता है और दूसरे प्रोग्राम चलाने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-002",
    "stem": "एप्लिकेशन सॉफ्टवेयर का उदाहरण कौन-सा है?",
    "options": [
      "डिवाइस ड्राइवर",
      "वर्ड प्रोसेसर",
      "ऑपरेटिंग सिस्टम",
      "फर्मवेयर"
    ],
    "explanation": "एप्लिकेशन सॉफ्टवेयर किसी खास काम में मदद करता है, जैसे दस्तावेज लिखना।"
  },
  {
    "sourceQuestionId": "COM007-EN-003",
    "stem": "ऑपरेटिंग सिस्टम किस प्रकार का सॉफ्टवेयर है?",
    "options": [
      "यूटिलिटी सॉफ्टवेयर",
      "एप्लिकेशन सॉफ्टवेयर",
      "सिस्टम सॉफ्टवेयर",
      "फर्मवेयर"
    ],
    "explanation": "ऑपरेटिंग सिस्टम सिस्टम सॉफ्टवेयर है। यह हार्डवेयर और मूल सेवाओं को संभालता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-004",
    "stem": "प्रेजेंटेशन बनाने के लिए सीधे किस सॉफ्टवेयर का उपयोग होता है?",
    "options": [
      "डिवाइस ड्राइवर",
      "सिस्टम सॉफ्टवेयर",
      "फर्मवेयर",
      "एप्लिकेशन सॉफ्टवेयर"
    ],
    "explanation": "प्रेजेंटेशन सॉफ्टवेयर एप्लिकेशन सॉफ्टवेयर है। यह स्लाइड बनाने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-005",
    "stem": "यूटिलिटी सॉफ्टवेयर मुख्य रूप से किस काम में मदद करता है?",
    "options": [
      "कंप्यूटर को बनाए रखने और संभालने में",
      "केवल पत्र लिखने में",
      "केवल प्रिंटर जोड़ने में",
      "केवल वेबसाइट बनाने में"
    ],
    "explanation": "यूटिलिटी सॉफ्टवेयर कंप्यूटर को संभालने, बनाए रखने या सुरक्षित रखने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-006",
    "stem": "डिवाइस ड्राइवर ऑपरेटिंग सिस्टम को क्या करने में मदद करता है?",
    "options": [
      "डेटाबेस बनाने में",
      "हार्डवेयर से बात करने में",
      "प्रेजेंटेशन लिखने में",
      "वेबसाइट का अनुवाद करने में"
    ],
    "explanation": "डिवाइस ड्राइवर ऑपरेटिंग सिस्टम को हार्डवेयर डिवाइस से बात करने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-007",
    "stem": "फर्मवेयर क्या है?",
    "options": [
      "डेटाबेस टेबल का प्रकार",
      "अस्थायी इंटरनेट फाइल",
      "डिवाइस में रखा सॉफ्टवेयर",
      "दस्तावेज संपादित करने वाला प्रोग्राम"
    ],
    "explanation": "फर्मवेयर डिवाइस में रखा सॉफ्टवेयर है। यह उस डिवाइस को नियंत्रित करने में मदद करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-008",
    "stem": "यूटिलिटी सॉफ्टवेयर का उदाहरण कौन-सा है?",
    "options": [
      "वर्ड प्रोसेसर",
      "वेब ब्राउजर",
      "ऑपरेटिंग सिस्टम",
      "डिस्क क्लीनअप टूल"
    ],
    "explanation": "डिस्क क्लीनअप टूल अनचाही फाइलों को संभालने में मदद करता है। यह यूटिलिटी सॉफ्टवेयर है।"
  },
  {
    "sourceQuestionId": "COM007-EN-009",
    "stem": "मशीन लैंग्वेज किसका उपयोग करती है?",
    "options": [
      "बाइनरी निर्देश",
      "अंग्रेजी वाक्य",
      "डेटाबेस टेबल",
      "चित्र"
    ],
    "explanation": "मशीन लैंग्वेज 0 और 1 से बने बाइनरी निर्देशों का उपयोग करती है।"
  },
  {
    "sourceQuestionId": "COM007-EN-010",
    "stem": "हाई-लेवल लैंग्वेज कई लोगों के लिए आसान क्यों होती है?",
    "options": [
      "यह केवल बाइनरी नंबर इस्तेमाल करती है",
      "इसके कमांड मानव भाषा के करीब होते हैं",
      "इसका अनुवाद नहीं हो सकता",
      "यह कंप्यूटर के बिना चलती है"
    ],
    "explanation": "हाई-लेवल लैंग्वेज में ऐसे कमांड होते हैं जिन्हें पढ़ना और लिखना आसान होता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-011",
    "stem": "मशीन लैंग्वेज के सबसे करीब कौन-सी लैंग्वेज है?",
    "options": [
      "पाइथन",
      "एसक्यूएल",
      "असेंबली लैंग्वेज",
      "एचटीएमएल"
    ],
    "explanation": "असेंबली लैंग्वेज के छोटे निर्देश मशीन निर्देशों के करीब होते हैं।"
  },
  {
    "sourceQuestionId": "COM007-EN-012",
    "stem": "एसक्यूएल का मुख्य उपयोग क्या है?",
    "options": [
      "कीबोर्ड बनाने में",
      "मॉनिटर नियंत्रित करने में",
      "फोटो बदलने में",
      "डेटाबेस के डेटा पर काम करने में"
    ],
    "explanation": "SQL का अर्थ Structured Query Language है। इसका उपयोग डेटाबेस के डेटा पर काम करने के लिए होता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-013",
    "stem": "कंपाइलर आमतौर पर क्या करता है?",
    "options": [
      "चलने से पहले पूरे प्रोग्राम का अनुवाद करता है",
      "एक बार में केवल एक अक्षर चलाता है",
      "फाइलों को टेबल में रखता है",
      "प्रिंटर जोड़ता है"
    ],
    "explanation": "कंपाइलर प्रोग्राम चलने से पहले पूरे प्रोग्राम का अनुवाद करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-014",
    "stem": "इंटरप्रेटर आमतौर पर क्या करता है?",
    "options": [
      "कंप्यूटर बनाता है",
      "एक समय में एक स्टेटमेंट का अनुवाद करके चलाता है",
      "प्राइमरी की बनाता है",
      "फर्मवेयर रखता है"
    ],
    "explanation": "इंटरप्रेटर प्रोग्राम के स्टेटमेंट का एक-एक करके अनुवाद करता और चलाता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-015",
    "stem": "असेंबलर किसका अनुवाद करता है?",
    "options": [
      "डेटाबेस टेबल का रो में",
      "हाई-लेवल लैंग्वेज का अंग्रेजी में",
      "असेंबली लैंग्वेज का मशीन लैंग्वेज में",
      "प्रोग्राम का प्रिंटर में"
    ],
    "explanation": "असेंबलर असेंबली लैंग्वेज के निर्देशों को मशीन लैंग्वेज में बदलता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-016",
    "stem": "कौन-सा ट्रांसलेटर प्रोग्राम चलने से पहले पूरा प्रोग्राम तैयार करता है?",
    "options": [
      "इंटरप्रेटर",
      "असेंबलर",
      "डिवाइस ड्राइवर",
      "कंपाइलर"
    ],
    "explanation": "कंपाइलर आमतौर पर प्रोग्राम चलने से पहले पूरा प्रोग्राम तैयार करता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-017",
    "stem": "प्रोग्रामिंग लैंग्वेज की पहली पीढ़ी में कौन-सी लैंग्वेज आती है?",
    "options": [
      "मशीन लैंग्वेज",
      "असेंबली लैंग्वेज",
      "पाइथन",
      "एसक्यूएल"
    ],
    "explanation": "पहली पीढ़ी की प्रोग्रामिंग लैंग्वेज मशीन लैंग्वेज होती है। इसमें बाइनरी निर्देश होते हैं।"
  },
  {
    "sourceQuestionId": "COM007-EN-018",
    "stem": "प्रोग्रामिंग लैंग्वेज की दूसरी पीढ़ी में कौन-सी लैंग्वेज आती है?",
    "options": [
      "मशीन लैंग्वेज",
      "असेंबली लैंग्वेज",
      "पाइथन",
      "डेटाबेस लैंग्वेज"
    ],
    "explanation": "दूसरी पीढ़ी की प्रोग्रामिंग लैंग्वेज असेंबली लैंग्वेज होती है। इसमें छोटे निर्देश शब्द होते हैं।"
  },
  {
    "sourceQuestionId": "COM007-EN-019",
    "stem": "तीसरी पीढ़ी की लैंग्वेज की सामान्य विशेषता क्या है?",
    "options": [
      "वे केवल 0 और 1 का उपयोग करती हैं",
      "वे केवल फर्मवेयर में रखी जाती हैं",
      "उनके कमांड मानव भाषा जैसे होते हैं",
      "उनका अनुवाद नहीं हो सकता"
    ],
    "explanation": "तीसरी पीढ़ी की लैंग्वेज के कमांड मशीन निर्देशों से पढ़ने में आसान होते हैं।"
  },
  {
    "sourceQuestionId": "COM007-EN-020",
    "stem": "हाई-लेवल प्रोग्रामिंग लैंग्वेज का उदाहरण कौन-सा है?",
    "options": [
      "मशीन लैंग्वेज",
      "असेंबली लैंग्वेज",
      "बाइनरी कोड",
      "पाइथन"
    ],
    "explanation": "पाइथन एक हाई-लेवल प्रोग्रामिंग लैंग्वेज है। इसके कमांड लोगों के लिए पढ़ना आसान हैं।"
  },
  {
    "sourceQuestionId": "COM007-EN-021",
    "stem": "डेटाबेस क्या है?",
    "options": [
      "डेटा का व्यवस्थित संग्रह",
      "मॉनिटर का प्रकार",
      "प्रिंटर केबल",
      "कंप्यूटर गेम"
    ],
    "explanation": "डेटाबेस उपयोग के लिए रखा गया डेटा का व्यवस्थित संग्रह है।"
  },
  {
    "sourceQuestionId": "COM007-EN-022",
    "stem": "DBMS का पूरा नाम क्या है?",
    "options": [
      "Data Backup Machine Service",
      "Database Management System",
      "Digital Basic Memory System",
      "Database Machine Storage"
    ],
    "explanation": "DBMS का अर्थ Database Management System है। यह डेटाबेस को संभालने वाला सॉफ्टवेयर है।"
  },
  {
    "sourceQuestionId": "COM007-EN-023",
    "stem": "Database Management System का मुख्य काम क्या है?",
    "options": [
      "स्क्रीन का आकार बढ़ाना",
      "लैपटॉप चार्ज करना",
      "डेटाबेस के डेटा को संभालना",
      "दस्तावेज प्रिंट करना"
    ],
    "explanation": "Database Management System डेटाबेस के डेटा को रखता और संभालता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-024",
    "stem": "रिलेशनल डेटाबेस में डेटा आमतौर पर कैसे रखा जाता है?",
    "options": [
      "केवल चित्रों में",
      "केवल ध्वनि में",
      "केवल पासवर्ड में",
      "टेबल में"
    ],
    "explanation": "रिलेशनल डेटाबेस डेटा को रो और कॉलम वाली टेबल में रखता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-025",
    "stem": "डेटाबेस टेबल में रो क्या दिखाती है?",
    "options": [
      "एक रिकॉर्ड",
      "एक डेटाबेस प्रोग्राम",
      "एक मॉनिटर",
      "एक पासवर्ड नियम"
    ],
    "explanation": "रो में टेबल का एक पूरा रिकॉर्ड होता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-026",
    "stem": "डेटाबेस टेबल में कॉलम क्या दिखाता है?",
    "options": [
      "पूरा डेटाबेस",
      "एक फील्ड या डेटा आइटम",
      "कंप्यूटर स्क्रीन",
      "सॉफ्टवेयर अपडेट"
    ],
    "explanation": "कॉलम टेबल के रिकॉर्ड के लिए एक प्रकार का डेटा रखता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-027",
    "stem": "प्राइमरी की का क्या उद्देश्य है?",
    "options": [
      "स्क्रीन का रंग बदलना",
      "प्रिंटर शुरू करना",
      "हर रो की अलग पहचान करना",
      "प्रोग्राम का अनुवाद करना"
    ],
    "explanation": "प्राइमरी की टेबल की हर रो की अलग पहचान करती है।"
  },
  {
    "sourceQuestionId": "COM007-EN-028",
    "stem": "फॉरेन की आमतौर पर क्या करती है?",
    "options": [
      "हर टेबल मिटाती है",
      "मशीन लैंग्वेज बदलती है",
      "ऑपरेटिंग सिस्टम शुरू करती है",
      "संबंधित टेबल के डेटा को जोड़ती है"
    ],
    "explanation": "फॉरेन की एक टेबल की रो को दूसरी टेबल की रो से जोड़ने में मदद करती है।"
  },
  {
    "sourceQuestionId": "COM007-EN-029",
    "stem": "डेटा पढ़ने के लिए कौन-सा SQL कमांड उपयोग होता है?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL का अर्थ Structured Query Language है। SELECT का उपयोग डेटाबेस से डेटा पढ़ने के लिए होता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-030",
    "stem": "टेबल में नया डेटा जोड़ने के लिए कौन-सा SQL कमांड उपयोग होता है?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL का अर्थ Structured Query Language है। INSERT टेबल में नई रो जोड़ता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-031",
    "stem": "मौजूदा डेटा बदलने के लिए कौन-सा SQL कमांड उपयोग होता है?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL का अर्थ Structured Query Language है। UPDATE टेबल में मौजूदा मान बदलता है।"
  },
  {
    "sourceQuestionId": "COM007-EN-032",
    "stem": "टेबल से रो हटाने के लिए कौन-सा SQL कमांड उपयोग होता है?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL का अर्थ Structured Query Language है। DELETE टेबल से रो हटाता है।"
  }
]);
const PA:readonly CopyEntry[]=Object.freeze([
  {
    "sourceQuestionId": "COM007-EN-001",
    "stem": "ਕਿਹੜਾ ਸਾਫਟਵੇਅਰ ਕੰਪਿਊਟਰ ਦਾ ਮੁੱਢਲਾ ਕੰਮ ਕੰਟਰੋਲ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ",
      "ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ",
      "ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ",
      "ਡਾਟਾਬੇਸ ਸਾਫਟਵੇਅਰ"
    ],
    "explanation": "ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ ਕੰਪਿਊਟਰ ਨੂੰ ਕੰਟਰੋਲ ਕਰਦਾ ਹੈ ਅਤੇ ਹੋਰ ਪ੍ਰੋਗਰਾਮ ਚਲਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-002",
    "stem": "ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?",
    "options": [
      "ਡਿਵਾਈਸ ਡਰਾਈਵਰ",
      "ਵਰਡ ਪ੍ਰੋਸੈਸਰ",
      "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ",
      "ਫਰਮਵੇਅਰ"
    ],
    "explanation": "ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ ਕਿਸੇ ਖਾਸ ਕੰਮ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ, ਜਿਵੇਂ ਦਸਤਾਵੇਜ਼ ਲਿਖਣਾ।"
  },
  {
    "sourceQuestionId": "COM007-EN-003",
    "stem": "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਕਿਸ ਕਿਸਮ ਦਾ ਸਾਫਟਵੇਅਰ ਹੈ?",
    "options": [
      "ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ",
      "ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ",
      "ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ",
      "ਫਰਮਵੇਅਰ"
    ],
    "explanation": "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ ਹੈ। ਇਹ ਹਾਰਡਵੇਅਰ ਅਤੇ ਮੁੱਢਲੀਆਂ ਸੇਵਾਵਾਂ ਨੂੰ ਸੰਭਾਲਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-004",
    "stem": "ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਬਣਾਉਣ ਲਈ ਸਿੱਧਾ ਕਿਹੜਾ ਸਾਫਟਵੇਅਰ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "options": [
      "ਡਿਵਾਈਸ ਡਰਾਈਵਰ",
      "ਸਿਸਟਮ ਸਾਫਟਵੇਅਰ",
      "ਫਰਮਵੇਅਰ",
      "ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ"
    ],
    "explanation": "ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਸਾਫਟਵੇਅਰ ਐਪਲੀਕੇਸ਼ਨ ਸਾਫਟਵੇਅਰ ਹੈ। ਇਹ ਸਲਾਈਡਾਂ ਬਣਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-005",
    "stem": "ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ ਮੁੱਖ ਤੌਰ ਉੱਤੇ ਕਿਸ ਕੰਮ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਕੰਪਿਊਟਰ ਦੀ ਦੇਖਭਾਲ ਅਤੇ ਪ੍ਰਬੰਧ ਵਿੱਚ",
      "ਕੇਵਲ ਚਿੱਠੀਆਂ ਲਿਖਣ ਵਿੱਚ",
      "ਕੇਵਲ ਪ੍ਰਿੰਟਰ ਜੋੜਨ ਵਿੱਚ",
      "ਕੇਵਲ ਵੈੱਬਸਾਈਟ ਬਣਾਉਣ ਵਿੱਚ"
    ],
    "explanation": "ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ ਕੰਪਿਊਟਰ ਨੂੰ ਸੰਭਾਲਣ, ਠੀਕ ਰੱਖਣ ਜਾਂ ਸੁਰੱਖਿਅਤ ਰੱਖਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-006",
    "stem": "ਡਿਵਾਈਸ ਡਰਾਈਵਰ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਨੂੰ ਕੀ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਡਾਟਾਬੇਸ ਬਣਾਉਣ ਵਿੱਚ",
      "ਹਾਰਡਵੇਅਰ ਨਾਲ ਗੱਲ ਕਰਨ ਵਿੱਚ",
      "ਪ੍ਰੇਜ਼ੈਂਟੇਸ਼ਨ ਲਿਖਣ ਵਿੱਚ",
      "ਵੈੱਬਸਾਈਟ ਦਾ ਅਨੁਵਾਦ ਕਰਨ ਵਿੱਚ"
    ],
    "explanation": "ਡਿਵਾਈਸ ਡਰਾਈਵਰ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਨੂੰ ਹਾਰਡਵੇਅਰ ਡਿਵਾਈਸ ਨਾਲ ਗੱਲ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-007",
    "stem": "ਫਰਮਵੇਅਰ ਕੀ ਹੈ?",
    "options": [
      "ਡਾਟਾਬੇਸ ਟੇਬਲ ਦੀ ਕਿਸਮ",
      "ਅਸਥਾਈ ਇੰਟਰਨੈੱਟ ਫਾਈਲ",
      "ਡਿਵਾਈਸ ਵਿੱਚ ਰੱਖਿਆ ਸਾਫਟਵੇਅਰ",
      "ਦਸਤਾਵੇਜ਼ ਸੋਧਣ ਵਾਲਾ ਪ੍ਰੋਗਰਾਮ"
    ],
    "explanation": "ਫਰਮਵੇਅਰ ਡਿਵਾਈਸ ਵਿੱਚ ਰੱਖਿਆ ਸਾਫਟਵੇਅਰ ਹੈ। ਇਹ ਉਸ ਡਿਵਾਈਸ ਨੂੰ ਕੰਟਰੋਲ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-008",
    "stem": "ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?",
    "options": [
      "ਵਰਡ ਪ੍ਰੋਸੈਸਰ",
      "ਵੈੱਬ ਬਰਾਊਜ਼ਰ",
      "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ",
      "ਡਿਸਕ ਕਲੀਨਅਪ ਟੂਲ"
    ],
    "explanation": "ਡਿਸਕ ਕਲੀਨਅਪ ਟੂਲ ਬੇਲੋੜੀਆਂ ਫਾਈਲਾਂ ਨੂੰ ਸੰਭਾਲਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ। ਇਹ ਯੂਟਿਲਿਟੀ ਸਾਫਟਵੇਅਰ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-009",
    "stem": "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ ਕਿਸ ਦੀ ਵਰਤੋਂ ਕਰਦੀ ਹੈ?",
    "options": [
      "ਬਾਈਨਰੀ ਨਿਰਦੇਸ਼",
      "ਅੰਗਰੇਜ਼ੀ ਵਾਕ",
      "ਡਾਟਾਬੇਸ ਟੇਬਲ",
      "ਤਸਵੀਰਾਂ"
    ],
    "explanation": "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ 0 ਅਤੇ 1 ਨਾਲ ਬਣੇ ਬਾਈਨਰੀ ਨਿਰਦੇਸ਼ ਵਰਤਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-010",
    "stem": "ਹਾਈ-ਲੈਵਲ ਲੈਂਗਵੇਜ ਕਈ ਲੋਕਾਂ ਲਈ ਸੌਖੀ ਕਿਉਂ ਹੁੰਦੀ ਹੈ?",
    "options": [
      "ਇਹ ਕੇਵਲ ਬਾਈਨਰੀ ਨੰਬਰ ਵਰਤਦੀ ਹੈ",
      "ਇਸਦੇ ਕਮਾਂਡ ਮਨੁੱਖੀ ਭਾਸ਼ਾ ਦੇ ਨੇੜੇ ਹੁੰਦੇ ਹਨ",
      "ਇਸਦਾ ਅਨੁਵਾਦ ਨਹੀਂ ਹੋ ਸਕਦਾ",
      "ਇਹ ਕੰਪਿਊਟਰ ਤੋਂ ਬਿਨਾਂ ਚੱਲਦੀ ਹੈ"
    ],
    "explanation": "ਹਾਈ-ਲੈਵਲ ਲੈਂਗਵੇਜ ਵਿੱਚ ਉਹ ਕਮਾਂਡ ਹੁੰਦੇ ਹਨ ਜਿਨ੍ਹਾਂ ਨੂੰ ਪੜ੍ਹਨਾ ਅਤੇ ਲਿਖਣਾ ਸੌਖਾ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-011",
    "stem": "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਕਿਹੜੀ ਲੈਂਗਵੇਜ ਹੈ?",
    "options": [
      "ਪਾਈਥਨ",
      "ਐਸਕਿਊਐਲ",
      "ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ",
      "ਐਚਟੀਐਮਐਲ"
    ],
    "explanation": "ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ ਦੇ ਛੋਟੇ ਨਿਰਦੇਸ਼ ਮਸ਼ੀਨ ਨਿਰਦੇਸ਼ਾਂ ਦੇ ਨੇੜੇ ਹੁੰਦੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM007-EN-012",
    "stem": "SQL ਦਾ ਮੁੱਖ ਵਰਤੋਂ ਕੀ ਹੈ?",
    "options": [
      "ਕੀਬੋਰਡ ਬਣਾਉਣ ਵਿੱਚ",
      "ਮਾਨੀਟਰ ਕੰਟਰੋਲ ਕਰਨ ਵਿੱਚ",
      "ਫੋਟੋ ਬਦਲਣ ਵਿੱਚ",
      "ਡਾਟਾਬੇਸ ਦੇ ਡਾਟੇ ਉੱਤੇ ਕੰਮ ਕਰਨ ਵਿੱਚ"
    ],
    "explanation": "SQL ਦਾ ਅਰਥ Structured Query Language ਹੈ। ਇਸਦੀ ਵਰਤੋਂ ਡਾਟਾਬੇਸ ਦੇ ਡਾਟੇ ਉੱਤੇ ਕੰਮ ਕਰਨ ਲਈ ਹੁੰਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-013",
    "stem": "ਕੰਪਾਈਲਰ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਚੱਲਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਪ੍ਰੋਗਰਾਮ ਦਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ",
      "ਇੱਕ ਵਾਰ ਵਿੱਚ ਕੇਵਲ ਇੱਕ ਅੱਖਰ ਚਲਾਉਂਦਾ ਹੈ",
      "ਫਾਈਲਾਂ ਨੂੰ ਟੇਬਲ ਵਿੱਚ ਰੱਖਦਾ ਹੈ",
      "ਪ੍ਰਿੰਟਰ ਜੋੜਦਾ ਹੈ"
    ],
    "explanation": "ਕੰਪਾਈਲਰ ਪ੍ਰੋਗਰਾਮ ਚੱਲਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੇ ਪ੍ਰੋਗਰਾਮ ਦਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-014",
    "stem": "ਇੰਟਰਪ੍ਰੇਟਰ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਕੰਪਿਊਟਰ ਬਣਾਉਂਦਾ ਹੈ",
      "ਇੱਕ ਸਮੇਂ ਇੱਕ ਸਟੇਟਮੈਂਟ ਦਾ ਅਨੁਵਾਦ ਕਰਕੇ ਚਲਾਉਂਦਾ ਹੈ",
      "ਪ੍ਰਾਈਮਰੀ ਕੀ ਬਣਾਉਂਦਾ ਹੈ",
      "ਫਰਮਵੇਅਰ ਰੱਖਦਾ ਹੈ"
    ],
    "explanation": "ਇੰਟਰਪ੍ਰੇਟਰ ਪ੍ਰੋਗਰਾਮ ਦੇ ਸਟੇਟਮੈਂਟ ਦਾ ਇੱਕ-ਇੱਕ ਕਰਕੇ ਅਨੁਵਾਦ ਕਰਦਾ ਅਤੇ ਚਲਾਉਂਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-015",
    "stem": "ਅਸੈਂਬਲਰ ਕਿਸ ਦਾ ਅਨੁਵਾਦ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਡਾਟਾਬੇਸ ਟੇਬਲ ਦਾ ਰੋ ਵਿੱਚ",
      "ਹਾਈ-ਲੈਵਲ ਲੈਂਗਵੇਜ ਦਾ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ",
      "ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ ਦਾ ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ ਵਿੱਚ",
      "ਪ੍ਰੋਗਰਾਮ ਦਾ ਪ੍ਰਿੰਟਰ ਵਿੱਚ"
    ],
    "explanation": "ਅਸੈਂਬਲਰ ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ ਦੇ ਨਿਰਦੇਸ਼ਾਂ ਨੂੰ ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-016",
    "stem": "ਕਿਹੜਾ ਟ੍ਰਾਂਸਲੇਟਰ ਪ੍ਰੋਗਰਾਮ ਚੱਲਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰਾ ਪ੍ਰੋਗਰਾਮ ਤਿਆਰ ਕਰਦਾ ਹੈ?",
    "options": [
      "ਇੰਟਰਪ੍ਰੇਟਰ",
      "ਅਸੈਂਬਲਰ",
      "ਡਿਵਾਈਸ ਡਰਾਈਵਰ",
      "ਕੰਪਾਈਲਰ"
    ],
    "explanation": "ਕੰਪਾਈਲਰ ਆਮ ਤੌਰ ਉੱਤੇ ਪ੍ਰੋਗਰਾਮ ਚੱਲਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰਾ ਪ੍ਰੋਗਰਾਮ ਤਿਆਰ ਕਰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-017",
    "stem": "ਪ੍ਰੋਗਰਾਮਿੰਗ ਲੈਂਗਵੇਜ ਦੀ ਪਹਿਲੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਕਿਹੜੀ ਲੈਂਗਵੇਜ ਆਉਂਦੀ ਹੈ?",
    "options": [
      "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ",
      "ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ",
      "ਪਾਈਥਨ",
      "SQL"
    ],
    "explanation": "ਪਹਿਲੀ ਪੀੜ੍ਹੀ ਦੀ ਪ੍ਰੋਗਰਾਮਿੰਗ ਲੈਂਗਵੇਜ ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ ਹੁੰਦੀ ਹੈ। ਇਸ ਵਿੱਚ ਬਾਈਨਰੀ ਨਿਰਦੇਸ਼ ਹੁੰਦੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM007-EN-018",
    "stem": "ਪ੍ਰੋਗਰਾਮਿੰਗ ਲੈਂਗਵੇਜ ਦੀ ਦੂਜੀ ਪੀੜ੍ਹੀ ਵਿੱਚ ਕਿਹੜੀ ਲੈਂਗਵੇਜ ਆਉਂਦੀ ਹੈ?",
    "options": [
      "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ",
      "ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ",
      "ਪਾਈਥਨ",
      "ਡਾਟਾਬੇਸ ਲੈਂਗਵੇਜ"
    ],
    "explanation": "ਦੂਜੀ ਪੀੜ੍ਹੀ ਦੀ ਪ੍ਰੋਗਰਾਮਿੰਗ ਲੈਂਗਵੇਜ ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ ਹੁੰਦੀ ਹੈ। ਇਸ ਵਿੱਚ ਛੋਟੇ ਨਿਰਦੇਸ਼ ਸ਼ਬਦ ਹੁੰਦੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM007-EN-019",
    "stem": "ਤੀਜੀ ਪੀੜ੍ਹੀ ਦੀ ਲੈਂਗਵੇਜ ਦੀ ਆਮ ਵਿਸ਼ੇਸ਼ਤਾ ਕੀ ਹੈ?",
    "options": [
      "ਉਹ ਕੇਵਲ 0 ਅਤੇ 1 ਵਰਤਦੀਆਂ ਹਨ",
      "ਉਹ ਕੇਵਲ ਫਰਮਵੇਅਰ ਵਿੱਚ ਰੱਖੀਆਂ ਜਾਂਦੀਆਂ ਹਨ",
      "ਉਨ੍ਹਾਂ ਦੇ ਕਮਾਂਡ ਮਨੁੱਖੀ ਭਾਸ਼ਾ ਵਰਗੇ ਹੁੰਦੇ ਹਨ",
      "ਉਨ੍ਹਾਂ ਦਾ ਅਨੁਵਾਦ ਨਹੀਂ ਹੋ ਸਕਦਾ"
    ],
    "explanation": "ਤੀਜੀ ਪੀੜ੍ਹੀ ਦੀ ਲੈਂਗਵੇਜ ਦੇ ਕਮਾਂਡ ਮਸ਼ੀਨ ਨਿਰਦੇਸ਼ਾਂ ਨਾਲੋਂ ਪੜ੍ਹਨ ਵਿੱਚ ਸੌਖੇ ਹੁੰਦੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM007-EN-020",
    "stem": "ਹਾਈ-ਲੈਵਲ ਪ੍ਰੋਗਰਾਮਿੰਗ ਲੈਂਗਵੇਜ ਦੀ ਉਦਾਹਰਨ ਕਿਹੜੀ ਹੈ?",
    "options": [
      "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ",
      "ਅਸੈਂਬਲੀ ਲੈਂਗਵੇਜ",
      "ਬਾਈਨਰੀ ਕੋਡ",
      "ਪਾਈਥਨ"
    ],
    "explanation": "ਪਾਈਥਨ ਇੱਕ ਹਾਈ-ਲੈਵਲ ਪ੍ਰੋਗਰਾਮਿੰਗ ਲੈਂਗਵੇਜ ਹੈ। ਇਸਦੇ ਕਮਾਂਡ ਲੋਕਾਂ ਲਈ ਪੜ੍ਹਨੇ ਸੌਖੇ ਹਨ।"
  },
  {
    "sourceQuestionId": "COM007-EN-021",
    "stem": "ਡਾਟਾਬੇਸ ਕੀ ਹੈ?",
    "options": [
      "ਡਾਟੇ ਦਾ ਵਿਵਸਥਿਤ ਸੰਗ੍ਰਹਿ",
      "ਮਾਨੀਟਰ ਦੀ ਕਿਸਮ",
      "ਪ੍ਰਿੰਟਰ ਕੇਬਲ",
      "ਕੰਪਿਊਟਰ ਗੇਮ"
    ],
    "explanation": "ਡਾਟਾਬੇਸ ਵਰਤੋਂ ਲਈ ਰੱਖਿਆ ਡਾਟੇ ਦਾ ਵਿਵਸਥਿਤ ਸੰਗ੍ਰਹਿ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-022",
    "stem": "DBMS ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?",
    "options": [
      "Data Backup Machine Service",
      "Database Management System",
      "Digital Basic Memory System",
      "Database Machine Storage"
    ],
    "explanation": "DBMS ਦਾ ਅਰਥ Database Management System ਹੈ। ਇਹ ਡਾਟਾਬੇਸ ਨੂੰ ਸੰਭਾਲਣ ਵਾਲਾ ਸਾਫਟਵੇਅਰ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-023",
    "stem": "Database Management System ਦਾ ਮੁੱਖ ਕੰਮ ਕੀ ਹੈ?",
    "options": [
      "ਸਕਰੀਨ ਦਾ ਆਕਾਰ ਵਧਾਉਣਾ",
      "ਲੈਪਟਾਪ ਚਾਰਜ ਕਰਨਾ",
      "ਡਾਟਾਬੇਸ ਦੇ ਡਾਟੇ ਨੂੰ ਸੰਭਾਲਣਾ",
      "ਦਸਤਾਵੇਜ਼ ਪ੍ਰਿੰਟ ਕਰਨਾ"
    ],
    "explanation": "Database Management System ਡਾਟਾਬੇਸ ਦੇ ਡਾਟੇ ਨੂੰ ਰੱਖਦਾ ਅਤੇ ਸੰਭਾਲਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-024",
    "stem": "ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਵਿੱਚ ਡਾਟਾ ਆਮ ਤੌਰ ਉੱਤੇ ਕਿਵੇਂ ਰੱਖਿਆ ਜਾਂਦਾ ਹੈ?",
    "options": [
      "ਕੇਵਲ ਤਸਵੀਰਾਂ ਵਿੱਚ",
      "ਕੇਵਲ ਆਵਾਜ਼ ਵਿੱਚ",
      "ਕੇਵਲ ਪਾਸਵਰਡਾਂ ਵਿੱਚ",
      "ਟੇਬਲਾਂ ਵਿੱਚ"
    ],
    "explanation": "ਰਿਲੇਸ਼ਨਲ ਡਾਟਾਬੇਸ ਡਾਟਾ ਰੋ ਅਤੇ ਕਾਲਮ ਵਾਲੀਆਂ ਟੇਬਲਾਂ ਵਿੱਚ ਰੱਖਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-025",
    "stem": "ਡਾਟਾਬੇਸ ਟੇਬਲ ਵਿੱਚ ਰੋ ਕੀ ਦਿਖਾਉਂਦੀ ਹੈ?",
    "options": [
      "ਇੱਕ ਰਿਕਾਰਡ",
      "ਇੱਕ ਡਾਟਾਬੇਸ ਪ੍ਰੋਗਰਾਮ",
      "ਇੱਕ ਮਾਨੀਟਰ",
      "ਇੱਕ ਪਾਸਵਰਡ ਨਿਯਮ"
    ],
    "explanation": "ਰੋ ਵਿੱਚ ਟੇਬਲ ਦਾ ਇੱਕ ਪੂਰਾ ਰਿਕਾਰਡ ਹੁੰਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-026",
    "stem": "ਡਾਟਾਬੇਸ ਟੇਬਲ ਵਿੱਚ ਕਾਲਮ ਕੀ ਦਿਖਾਉਂਦਾ ਹੈ?",
    "options": [
      "ਪੂਰਾ ਡਾਟਾਬੇਸ",
      "ਇੱਕ ਫੀਲਡ ਜਾਂ ਡਾਟਾ ਆਈਟਮ",
      "ਕੰਪਿਊਟਰ ਸਕਰੀਨ",
      "ਸਾਫਟਵੇਅਰ ਅਪਡੇਟ"
    ],
    "explanation": "ਕਾਲਮ ਟੇਬਲ ਦੇ ਰਿਕਾਰਡਾਂ ਲਈ ਇੱਕ ਕਿਸਮ ਦਾ ਡਾਟਾ ਰੱਖਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-027",
    "stem": "ਪ੍ਰਾਈਮਰੀ ਕੀ ਦਾ ਕੀ ਮਕਸਦ ਹੈ?",
    "options": [
      "ਸਕਰੀਨ ਦਾ ਰੰਗ ਬਦਲਣਾ",
      "ਪ੍ਰਿੰਟਰ ਸ਼ੁਰੂ ਕਰਨਾ",
      "ਹਰ ਰੋ ਦੀ ਵੱਖਰੀ ਪਛਾਣ ਕਰਨਾ",
      "ਪ੍ਰੋਗਰਾਮ ਦਾ ਅਨੁਵਾਦ ਕਰਨਾ"
    ],
    "explanation": "ਪ੍ਰਾਈਮਰੀ ਕੀ ਟੇਬਲ ਦੀ ਹਰ ਰੋ ਦੀ ਵੱਖਰੀ ਪਛਾਣ ਕਰਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-028",
    "stem": "ਫੌਰਨ ਕੀ ਆਮ ਤੌਰ ਉੱਤੇ ਕੀ ਕਰਦੀ ਹੈ?",
    "options": [
      "ਹਰ ਟੇਬਲ ਮਿਟਾਉਂਦੀ ਹੈ",
      "ਮਸ਼ੀਨ ਲੈਂਗਵੇਜ ਬਦਲਦੀ ਹੈ",
      "ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਸ਼ੁਰੂ ਕਰਦੀ ਹੈ",
      "ਸੰਬੰਧਿਤ ਟੇਬਲਾਂ ਦੇ ਡਾਟੇ ਨੂੰ ਜੋੜਦੀ ਹੈ"
    ],
    "explanation": "ਫੌਰਨ ਕੀ ਇੱਕ ਟੇਬਲ ਦੀ ਰੋ ਨੂੰ ਦੂਜੀ ਟੇਬਲ ਦੀ ਰੋ ਨਾਲ ਜੋੜਨ ਵਿੱਚ ਮਦਦ ਕਰਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-029",
    "stem": "ਡਾਟਾ ਪੜ੍ਹਨ ਲਈ ਕਿਹੜਾ SQL ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL ਦਾ ਅਰਥ Structured Query Language ਹੈ। SELECT ਦੀ ਵਰਤੋਂ ਡਾਟਾਬੇਸ ਤੋਂ ਡਾਟਾ ਪੜ੍ਹਨ ਲਈ ਹੁੰਦੀ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-030",
    "stem": "ਟੇਬਲ ਵਿੱਚ ਨਵਾਂ ਡਾਟਾ ਜੋੜਨ ਲਈ ਕਿਹੜਾ SQL ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL ਦਾ ਅਰਥ Structured Query Language ਹੈ। INSERT ਟੇਬਲ ਵਿੱਚ ਨਵੀਆਂ ਰੋ ਜੋੜਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-031",
    "stem": "ਮੌਜੂਦਾ ਡਾਟਾ ਬਦਲਣ ਲਈ ਕਿਹੜਾ SQL ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL ਦਾ ਅਰਥ Structured Query Language ਹੈ। UPDATE ਟੇਬਲ ਵਿੱਚ ਮੌਜੂਦਾ ਮੁੱਲ ਬਦਲਦਾ ਹੈ।"
  },
  {
    "sourceQuestionId": "COM007-EN-032",
    "stem": "ਟੇਬਲ ਤੋਂ ਰੋ ਹਟਾਉਣ ਲਈ ਕਿਹੜਾ SQL ਕਮਾਂਡ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ?",
    "options": [
      "SELECT",
      "INSERT",
      "UPDATE",
      "DELETE"
    ],
    "explanation": "SQL ਦਾ ਅਰਥ Structured Query Language ਹੈ। DELETE ਟੇਬਲ ਤੋਂ ਰੋ ਹਟਾਉਂਦਾ ਹੈ।"
  }
]);
const englishById=new Map(COM007_ENGLISH_FROZEN.map((question)=>[question.questionId,question]));
function buildLocalization(language:"hi"|"pa",locale:"hi-IN"|"pa-IN",copies:readonly CopyEntry[]) {
  return Object.freeze(copies.map((copy,index)=>{
    const source=englishById.get(copy.sourceQuestionId);
    if(!source) throw new Error("COM-007 localization source missing: "+copy.sourceQuestionId);
    if(copy.options.length!==source.options.length) throw new Error("COM-007 option count mismatch: "+copy.sourceQuestionId);
    return Object.freeze({
      questionId:`COM007-${language.toUpperCase()}-${String(index+1).padStart(3,"0")}`,
      sourceQuestionId:source.sourceQuestionId, qlId:source.qlId, language, locale, difficulty:source.difficulty,
      stem:copy.stem, options:Object.freeze([...copy.options]), correctIndex:source.correctIndex,
      canonicalAnswer:copy.options[source.correctIndex], explanation:copy.explanation, sourceFactIds:source.sourceFactIds,
      sourceEnglishAuthorityId:source.sourceEnglishAuthorityId, sourceEnglishFrozen:true, sourceLocalizationFrozen:true,
    });
  }));
}
export const COM007_HINDI_FROZEN=buildLocalization("hi","hi-IN",HI);
export const COM007_PUNJABI_FROZEN=buildLocalization("pa","pa-IN",PA);
export const COM007_LOCALIZATION_FREEZE_AUTHORITY_V1={
  authorityId:"COM-007-HI-PA-LOCALIZATION-FREEZE-V1",
  predecessorAuthorityId:COM007_ENGLISH_FREEZE_AUTHORITY_V1.authorityId,
  questionCountPerLanguage:32, languageCounts:Object.freeze({en:32,hi:32,pa:32}),
  localizationLanguages:Object.freeze(["hi","pa"] as const),
  combinedFingerprint:createHash("sha256").update(JSON.stringify([...COM007_ENGLISH_FROZEN,...COM007_HINDI_FROZEN,...COM007_PUNJABI_FROZEN])).digest("hex"),
} as const;
export function auditCom007FreezeV1() {
  const all=[...COM007_ENGLISH_FROZEN,...COM007_HINDI_FROZEN,...COM007_PUNJABI_FROZEN], issues:string[]=[], ids=new Set<string>();
  for(const q of all){
    if(ids.has(q.questionId)) issues.push("DUPLICATE_ID:"+q.questionId); ids.add(q.questionId);
    if(q.options.length!==4||new Set(q.options).size!==4) issues.push("OPTIONS:"+q.questionId);
    if(q.options[q.correctIndex]!==q.canonicalAnswer) issues.push("ANSWER:"+q.questionId);
    if(!q.stem.trim()||!q.explanation.trim()) issues.push("EMPTY:"+q.questionId);
    if(/associat\w*/i.test(q.stem+" "+q.explanation)) issues.push("FORMAL_WORDING:"+q.questionId);
    if(q.explanation.split(/[.!?]/).filter(Boolean).length>2) issues.push("EXPLANATION_LENGTH:"+q.questionId);
  }
  for(const qlId of COM007_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds){
    for(const corpus of [COM007_ENGLISH_FROZEN,COM007_HINDI_FROZEN,COM007_PUNJABI_FROZEN]){
      if(corpus.filter((q)=>q.qlId===qlId).length!==4) issues.push("QL_COUNT:"+qlId);
    }
  }
  if(COM007_ENGLISH_FROZEN.length!==32||COM007_HINDI_FROZEN.length!==32||COM007_PUNJABI_FROZEN.length!==32) issues.push("LANGUAGE_COUNT");
  if(!COM007_HINDI_FROZEN.every((q)=>/[\u0900-\u097f]/.test(q.stem))) issues.push("HINDI_SCRIPT");
  if(!COM007_PUNJABI_FROZEN.every((q)=>/[\u0a00-\u0a7f]/.test(q.stem))) issues.push("PUNJABI_SCRIPT");
  return {valid:issues.length===0,issues,englishCount:COM007_ENGLISH_FROZEN.length,hindiCount:COM007_HINDI_FROZEN.length,punjabiCount:COM007_PUNJABI_FROZEN.length,qlCount:COM007_ENGLISH_FREEZE_AUTHORITY_V1.permanentQlIds.length};
}
