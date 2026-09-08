import { createHash } from "node:crypto";
import {
  COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_AUTHORITY,
  COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE,
  type Com008ReviewQuestion,
} from "./com008-data-representation-english-review-v1";

export type Com008Language = "en" | "hi" | "pa";
export type Com008Locale = "en-IN" | "hi-IN" | "pa-IN";
export type Com008FrozenQuestion = {
  questionId:string; sourceQuestionId:string; qlId:string; language:Com008Language; locale:Com008Locale;
  difficulty:"EASY"|"MEDIUM"; stem:string; options:readonly string[]; correctIndex:number; canonicalAnswer:string;
  explanation:string; sourceFactIds:readonly string[]; sourceEnglishAuthorityId:string;
  sourceEnglishFrozen:true; sourceLocalizationFrozen:true;
};

export const COM008_ENGLISH_FREEZE_AUTHORITY_V1={
  authorityId:"COM-008-ENGLISH-FREEZE-V1", chapterCode:"COM-008", cpId:"COM-008-CP-001",
  language:"en" as const, locale:"en-IN" as const, questionCount:32, questionsPerQl:4,
  permanentQlIds:Object.freeze(["COM-008-QL-001","COM-008-QL-002","COM-008-QL-003","COM-008-QL-004","COM-008-QL-005","COM-008-QL-006","COM-008-QL-007","COM-008-QL-008"]),
  predecessorAuthorityId:COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_AUTHORITY.authorityId,
} as const;

function freezeEnglish(question:Com008ReviewQuestion):Com008FrozenQuestion {
  const correctIndex=question.options.indexOf(question.answer);
  if(correctIndex<0) throw new Error(`COM-008 answer missing: ${question.id}`);
  return Object.freeze({
    questionId:question.id, sourceQuestionId:question.id, qlId:question.ql, language:"en" as const, locale:"en-IN" as const,
    difficulty:question.difficulty, stem:question.stem, options:Object.freeze([...question.options]), correctIndex,
    canonicalAnswer:question.answer, explanation:question.explanation, sourceFactIds:Object.freeze([...question.source]),
    sourceEnglishAuthorityId:COM008_ENGLISH_FREEZE_AUTHORITY_V1.authorityId, sourceEnglishFrozen:true as const, sourceLocalizationFrozen:true as const,
  });
}
export const COM008_ENGLISH_FROZEN:readonly Com008FrozenQuestion[]=Object.freeze(COM008_DATA_REPRESENTATION_ENGLISH_REVIEW_CANDIDATE.map(freezeEnglish));

type CopyEntry={sourceQuestionId:string;stem:string;options:readonly string[];explanation:string;};
const HI:readonly CopyEntry[]=Object.freeze([
  {
    "explanation": "बाइनरी संख्या पद्धति केवल 0 और 1 का उपयोग करती है।",
    "options": [
      "बाइनरी",
      "दशमलव",
      "ऑक्टल",
      "हेक्साडेसिमल"
    ],
    "sourceQuestionId": "COM008-EN-001",
    "stem": "0 और 1 का उपयोग कौन-सी संख्या पद्धति करती है?"
  },
  {
    "explanation": "ऑक्टल संख्या पद्धति का आधार 8 है।",
    "options": [
      "2",
      "8",
      "10",
      "16"
    ],
    "sourceQuestionId": "COM008-EN-002",
    "stem": "ऑक्टल संख्या पद्धति का आधार क्या है?"
  },
  {
    "explanation": "हेक्साडेसिमल पद्धति में 0 से 9 और A से F का उपयोग होता है।",
    "options": [
      "0 से 9 और A से F",
      "केवल 0 और 1",
      "केवल 0 से 7",
      "केवल 1 से 16"
    ],
    "sourceQuestionId": "COM008-EN-003",
    "stem": "हेक्साडेसिमल संख्या में कौन-से चिन्ह आ सकते हैं?"
  },
  {
    "explanation": "दशमलव संख्या पद्धति का आधार 10 है।",
    "options": [
      "आधार 2",
      "आधार 8",
      "आधार 10",
      "आधार 16"
    ],
    "sourceQuestionId": "COM008-EN-004",
    "stem": "दशमलव संख्या पद्धति का आधार क्या है?"
  },
  {
    "explanation": "बिट डिजिटल डेटा की सबसे छोटी इकाई है। Bit का अर्थ binary digit है।",
    "options": [
      "बिट",
      "बाइट",
      "निबल",
      "किलोबाइट"
    ],
    "sourceQuestionId": "COM008-EN-005",
    "stem": "डिजिटल डेटा की सबसे छोटी इकाई क्या है?"
  },
  {
    "explanation": "एक निबल में 4 बिट होते हैं। Bit का अर्थ binary digit है।",
    "options": [
      "2 बिट",
      "4 बिट",
      "8 बिट",
      "16 बिट"
    ],
    "sourceQuestionId": "COM008-EN-006",
    "stem": "एक निबल में कितने बिट होते हैं?"
  },
  {
    "explanation": "एक बाइट में 8 बिट होते हैं। Bit का अर्थ binary digit है।",
    "options": [
      "4 बिट",
      "8 बिट",
      "16 बिट",
      "32 बिट"
    ],
    "sourceQuestionId": "COM008-EN-007",
    "stem": "एक बाइट में कितने बिट होते हैं?"
  },
  {
    "explanation": "इस परीक्षा मानक में 1 KB = 1024 बाइट माना जाता है। KB का अर्थ kilobyte है।",
    "options": [
      "1024 बाइट",
      "1024 बिट",
      "100 बाइट",
      "8 बाइट"
    ],
    "sourceQuestionId": "COM008-EN-008",
    "stem": "सामान्य प्रतियोगी परीक्षा मानक में 1 KB किसके बराबर है?"
  },
  {
    "explanation": "टेराबाइट, गीगाबाइट, मेगाबाइट और किलोबाइट से बड़ी इकाई है।",
    "options": [
      "किलोबाइट",
      "मेगाबाइट",
      "गीगाबाइट",
      "टेराबाइट"
    ],
    "sourceQuestionId": "COM008-EN-009",
    "stem": "सबसे बड़ी स्टोरेज इकाई कौन-सी है?"
  },
  {
    "explanation": "सही क्रम बिट, निबल, बाइट और किलोबाइट है।",
    "options": [
      "बिट, निबल, बाइट, किलोबाइट",
      "बाइट, बिट, निबल, किलोबाइट",
      "किलोबाइट, बाइट, निबल, बिट",
      "निबल, बिट, किलोबाइट, बाइट"
    ],
    "sourceQuestionId": "COM008-EN-010",
    "stem": "छोटी से बड़ी सही क्रम कौन-सा है?"
  },
  {
    "explanation": "इस परीक्षा मानक में 1 MB = 1024 KB माना जाता है। KB का अर्थ kilobyte और MB का अर्थ megabyte है।",
    "options": [
      "1024 KB",
      "1024 MB",
      "1000 GB",
      "8 KB"
    ],
    "sourceQuestionId": "COM008-EN-011",
    "stem": "सामान्य परीक्षा मानक में 1 MB में कितने KB होते हैं?"
  },
  {
    "explanation": "इस परीक्षा मानक में 1 GB = 1024 MB माना जाता है। MB का अर्थ megabyte और GB का अर्थ gigabyte है।",
    "options": [
      "1024 KB",
      "1024 MB",
      "1024 GB",
      "1024 TB"
    ],
    "sourceQuestionId": "COM008-EN-012",
    "stem": "सामान्य परीक्षा मानक में 1 GB में कितने MB होते हैं?"
  },
  {
    "explanation": "बाइनरी संख्या 1010 का दशमलव मान 10 है।",
    "options": [
      "8",
      "10",
      "12",
      "14"
    ],
    "sourceQuestionId": "COM008-EN-013",
    "stem": "(1010)₂ का दशमलव मान क्या है?"
  },
  {
    "explanation": "दशमलव 5 को बाइनरी में 101 लिखा जाता है।",
    "options": [
      "100",
      "101",
      "110",
      "111"
    ],
    "sourceQuestionId": "COM008-EN-014",
    "stem": "दशमलव 5 का बाइनरी रूप क्या है?"
  },
  {
    "explanation": "बाइनरी संख्या 1111 का दशमलव मान 15 है।",
    "options": [
      "10",
      "12",
      "15",
      "16"
    ],
    "sourceQuestionId": "COM008-EN-015",
    "stem": "(1111)₂ का दशमलव मान क्या है?"
  },
  {
    "explanation": "दशमलव 8 को बाइनरी में 1000 लिखा जाता है।",
    "options": [
      "100",
      "1000",
      "1010",
      "1100"
    ],
    "sourceQuestionId": "COM008-EN-016",
    "stem": "दशमलव 8 का बाइनरी रूप क्या है?"
  },
  {
    "explanation": "ऑक्टल संख्या 10 का दशमलव मान 8 है।",
    "options": [
      "6",
      "8",
      "10",
      "12"
    ],
    "sourceQuestionId": "COM008-EN-017",
    "stem": "(10)₈ का दशमलव मान क्या है?"
  },
  {
    "explanation": "हेक्साडेसिमल में A का मान दशमलव 10 होता है।",
    "options": [
      "8",
      "10",
      "12",
      "16"
    ],
    "sourceQuestionId": "COM008-EN-018",
    "stem": "(A)₁₆ का दशमलव मान क्या है?"
  },
  {
    "explanation": "बाइनरी 1010 का हेक्साडेसिमल रूप A है।",
    "options": [
      "A",
      "B",
      "C",
      "F"
    ],
    "sourceQuestionId": "COM008-EN-019",
    "stem": "बाइनरी 1010 का हेक्साडेसिमल रूप क्या है?"
  },
  {
    "explanation": "बाइनरी 111 का ऑक्टल रूप 7 है।",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "sourceQuestionId": "COM008-EN-020",
    "stem": "बाइनरी 111 का ऑक्टल रूप क्या है?"
  },
  {
    "explanation": "बाइनरी संख्या 1101 का दशमलव मान 13 है।",
    "options": [
      "11",
      "12",
      "13",
      "14"
    ],
    "sourceQuestionId": "COM008-EN-021",
    "stem": "बाइनरी 1101 का दशमलव मान क्या है?"
  },
  {
    "explanation": "हेक्साडेसिमल F का बाइनरी रूप 1111 है।",
    "options": [
      "1110",
      "1111",
      "1010",
      "1001"
    ],
    "sourceQuestionId": "COM008-EN-022",
    "stem": "हेक्साडेसिमल F का बाइनरी रूप क्या है?"
  },
  {
    "explanation": "ऑक्टल 5 का बाइनरी रूप 101 है।",
    "options": [
      "001",
      "010",
      "101",
      "111"
    ],
    "sourceQuestionId": "COM008-EN-023",
    "stem": "ऑक्टल 5 का बाइनरी रूप क्या है?"
  },
  {
    "explanation": "बाइनरी अंकों को तीन-तीन के समूह में बाँटें: 100 000। इसका ऑक्टल रूप 40 है।",
    "options": [
      "20",
      "40",
      "80",
      "100"
    ],
    "sourceQuestionId": "COM008-EN-024",
    "stem": "बाइनरी 100000 का ऑक्टल रूप क्या है?"
  },
  {
    "explanation": "BCD का अर्थ Binary Coded Decimal है। यह दशमलव अंकों को बाइनरी अंकों से दिखाता है।",
    "options": [
      "Binary Coded Decimal",
      "Basic Code Data",
      "Binary Character Data",
      "Byte Coded Decimal"
    ],
    "sourceQuestionId": "COM008-EN-025",
    "stem": "BCD का पूरा नाम क्या है?"
  },
  {
    "explanation": "ASCII का अर्थ American Standard Code for Information Interchange है। यह कैरेक्टर कोड है।",
    "options": [
      "American Standard Code for Information Interchange",
      "Advanced Standard Code for Internet Information",
      "American System Code for Internal Information",
      "Automatic Standard Code for Information Input"
    ],
    "sourceQuestionId": "COM008-EN-026",
    "stem": "ASCII का पूरा नाम क्या है?"
  },
  {
    "explanation": "EBCDIC का अर्थ Extended Binary Coded Decimal Interchange Code है। यह कैरेक्टर कोड है।",
    "options": [
      "Extended Binary Coded Decimal Interchange Code",
      "Extended Byte Code for Digital Information Control",
      "Electronic Binary Character Data Information Code",
      "External Binary Coded Data Internet Code"
    ],
    "sourceQuestionId": "COM008-EN-027",
    "stem": "EBCDIC का पूरा नाम क्या है?"
  },
  {
    "explanation": "Unicode कई लेखन प्रणालियों और भाषाओं के कैरेक्टर दिखाता है।",
    "options": [
      "केवल संख्याएँ रखना",
      "कई लेखन प्रणालियों के कैरेक्टर दिखाना",
      "प्रिंटर जोड़ना",
      "प्रोसेसर की गति मापना"
    ],
    "sourceQuestionId": "COM008-EN-028",
    "stem": "Unicode का मुख्य उपयोग क्या है?"
  },
  {
    "explanation": "BCD का अर्थ Binary Coded Decimal है। इसमें हर दशमलव अंक के लिए चार बिट होते हैं।",
    "options": [
      "हर दशमलव अंक के लिए चार बिट का उपयोग करके",
      "केवल अक्षरों का उपयोग करके",
      "हर शब्द के लिए एक बाइट का उपयोग करके",
      "हर दशमलव अंक के लिए आठ बिट का उपयोग करके"
    ],
    "sourceQuestionId": "COM008-EN-029",
    "stem": "BCD दशमलव संख्या को कैसे दिखाता है?"
  },
  {
    "explanation": "ASCII का अर्थ American Standard Code for Information Interchange है। ASCII-7 में 7 बिट होते हैं।",
    "options": [
      "7",
      "8",
      "16",
      "32"
    ],
    "sourceQuestionId": "COM008-EN-030",
    "stem": "ASCII-7 में कितने बिट होते हैं?"
  },
  {
    "explanation": "Unicode कई भाषाओं और लेखन प्रणालियों के कैरेक्टर दिखाने के लिए बनाया गया है।",
    "options": [
      "BCD",
      "ASCII",
      "Unicode",
      "Machine language"
    ],
    "sourceQuestionId": "COM008-EN-031",
    "stem": "कई भाषाओं के कैरेक्टर के लिए कौन-सा कोड उपयोगी है?"
  },
  {
    "explanation": "EBCDIC का अर्थ Extended Binary Coded Decimal Interchange Code है। इसमें कैरेक्टर के लिए आठ बिट होते हैं।",
    "options": [
      "EBCDIC",
      "ASCII-7",
      "BCD",
      "Binary number system"
    ],
    "sourceQuestionId": "COM008-EN-032",
    "stem": "स्रोत में किस कोड में हर कैरेक्टर के लिए आठ बिट का उपयोग बताया गया है?"
  }
]);
const PA:readonly CopyEntry[]=Object.freeze([
  {
    "explanation": "ਬਾਈਨਰੀ ਨੰਬਰ ਪ੍ਰਣਾਲੀ ਸਿਰਫ਼ 0 ਅਤੇ 1 ਵਰਤਦੀ ਹੈ।",
    "options": [
      "ਬਾਈਨਰੀ",
      "ਦਸ਼ਮਲਵ",
      "ਆਕਟਲ",
      "ਹੈਕਸਾਡੈਸੀਮਲ"
    ],
    "sourceQuestionId": "COM008-EN-001",
    "stem": "0 ਅਤੇ 1 ਦੀ ਵਰਤੋਂ ਕਿਹੜੀ ਨੰਬਰ ਪ੍ਰਣਾਲੀ ਕਰਦੀ ਹੈ?"
  },
  {
    "explanation": "ਆਕਟਲ ਨੰਬਰ ਪ੍ਰਣਾਲੀ ਦਾ ਬੇਸ 8 ਹੈ।",
    "options": [
      "2",
      "8",
      "10",
      "16"
    ],
    "sourceQuestionId": "COM008-EN-002",
    "stem": "ਆਕਟਲ ਨੰਬਰ ਪ੍ਰਣਾਲੀ ਦਾ ਬੇਸ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਹੈਕਸਾਡੈਸੀਮਲ ਪ੍ਰਣਾਲੀ ਵਿੱਚ 0 ਤੋਂ 9 ਅਤੇ A ਤੋਂ F ਵਰਤੇ ਜਾਂਦੇ ਹਨ।",
    "options": [
      "0 ਤੋਂ 9 ਅਤੇ A ਤੋਂ F",
      "ਸਿਰਫ਼ 0 ਅਤੇ 1",
      "ਸਿਰਫ਼ 0 ਤੋਂ 7",
      "ਸਿਰਫ਼ 1 ਤੋਂ 16"
    ],
    "sourceQuestionId": "COM008-EN-003",
    "stem": "ਹੈਕਸਾਡੈਸੀਮਲ ਨੰਬਰ ਵਿੱਚ ਕਿਹੜੇ ਚਿੰਨ੍ਹ ਆ ਸਕਦੇ ਹਨ?"
  },
  {
    "explanation": "ਦਸ਼ਮਲਵ ਨੰਬਰ ਪ੍ਰਣਾਲੀ ਦਾ ਬੇਸ 10 ਹੈ।",
    "options": [
      "ਬੇਸ 2",
      "ਬੇਸ 8",
      "ਬੇਸ 10",
      "ਬੇਸ 16"
    ],
    "sourceQuestionId": "COM008-EN-004",
    "stem": "ਦਸ਼ਮਲਵ ਨੰਬਰ ਪ੍ਰਣਾਲੀ ਦਾ ਬੇਸ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਬਿਟ ਡਿਜ਼ਿਟਲ ਡਾਟੇ ਦੀ ਸਭ ਤੋਂ ਛੋਟੀ ਇਕਾਈ ਹੈ। Bit ਦਾ ਅਰਥ binary digit ਹੈ।",
    "options": [
      "ਬਿਟ",
      "ਬਾਈਟ",
      "ਨਿਬਲ",
      "ਕਿਲੋਬਾਈਟ"
    ],
    "sourceQuestionId": "COM008-EN-005",
    "stem": "ਡਿਜ਼ਿਟਲ ਡਾਟੇ ਦੀ ਸਭ ਤੋਂ ਛੋਟੀ ਇਕਾਈ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਇੱਕ ਨਿਬਲ ਵਿੱਚ 4 ਬਿਟ ਹੁੰਦੇ ਹਨ। Bit ਦਾ ਅਰਥ binary digit ਹੈ।",
    "options": [
      "2 ਬਿਟ",
      "4 ਬਿਟ",
      "8 ਬਿਟ",
      "16 ਬਿਟ"
    ],
    "sourceQuestionId": "COM008-EN-006",
    "stem": "ਇੱਕ ਨਿਬਲ ਵਿੱਚ ਕਿੰਨੇ ਬਿਟ ਹੁੰਦੇ ਹਨ?"
  },
  {
    "explanation": "ਇੱਕ ਬਾਈਟ ਵਿੱਚ 8 ਬਿਟ ਹੁੰਦੇ ਹਨ। Bit ਦਾ ਅਰਥ binary digit ਹੈ।",
    "options": [
      "4 ਬਿਟ",
      "8 ਬਿਟ",
      "16 ਬਿਟ",
      "32 ਬਿਟ"
    ],
    "sourceQuestionId": "COM008-EN-007",
    "stem": "ਇੱਕ ਬਾਈਟ ਵਿੱਚ ਕਿੰਨੇ ਬਿਟ ਹੁੰਦੇ ਹਨ?"
  },
  {
    "explanation": "ਇਸ ਪ੍ਰੀਖਿਆ ਮਿਆਰ ਵਿੱਚ 1 KB = 1024 ਬਾਈਟ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ। KB ਦਾ ਅਰਥ kilobyte ਹੈ।",
    "options": [
      "1024 ਬਾਈਟ",
      "1024 ਬਿਟ",
      "100 ਬਾਈਟ",
      "8 ਬਾਈਟ"
    ],
    "sourceQuestionId": "COM008-EN-008",
    "stem": "ਆਮ ਮੁਕਾਬਲਾ ਪ੍ਰੀਖਿਆ ਮਿਆਰ ਵਿੱਚ 1 KB ਕਿਸ ਦੇ ਬਰਾਬਰ ਹੈ?"
  },
  {
    "explanation": "ਟੈਰਾਬਾਈਟ, ਗੀਗਾਬਾਈਟ, ਮੈਗਾਬਾਈਟ ਅਤੇ ਕਿਲੋਬਾਈਟ ਤੋਂ ਵੱਡੀ ਇਕਾਈ ਹੈ।",
    "options": [
      "ਕਿਲੋਬਾਈਟ",
      "ਮੈਗਾਬਾਈਟ",
      "ਗੀਗਾਬਾਈਟ",
      "ਟੈਰਾਬਾਈਟ"
    ],
    "sourceQuestionId": "COM008-EN-009",
    "stem": "ਸਭ ਤੋਂ ਵੱਡੀ ਸਟੋਰੇਜ ਇਕਾਈ ਕਿਹੜੀ ਹੈ?"
  },
  {
    "explanation": "ਸਹੀ ਲੜੀ ਬਿਟ, ਨਿਬਲ, ਬਾਈਟ ਅਤੇ ਕਿਲੋਬਾਈਟ ਹੈ।",
    "options": [
      "ਬਿਟ, ਨਿਬਲ, ਬਾਈਟ, ਕਿਲੋਬਾਈਟ",
      "ਬਾਈਟ, ਬਿਟ, ਨਿਬਲ, ਕਿਲੋਬਾਈਟ",
      "ਕਿਲੋਬਾਈਟ, ਬਾਈਟ, ਨਿਬਲ, ਬਿਟ",
      "ਨਿਬਲ, ਬਿਟ, ਕਿਲੋਬਾਈਟ, ਬਾਈਟ"
    ],
    "sourceQuestionId": "COM008-EN-010",
    "stem": "ਛੋਟੀ ਤੋਂ ਵੱਡੀ ਸਹੀ ਲੜੀ ਕਿਹੜੀ ਹੈ?"
  },
  {
    "explanation": "ਇਸ ਪ੍ਰੀਖਿਆ ਮਿਆਰ ਵਿੱਚ 1 MB = 1024 KB ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ। KB ਦਾ ਅਰਥ kilobyte ਅਤੇ MB ਦਾ ਅਰਥ megabyte ਹੈ।",
    "options": [
      "1024 KB",
      "1024 MB",
      "1000 GB",
      "8 KB"
    ],
    "sourceQuestionId": "COM008-EN-011",
    "stem": "ਆਮ ਪ੍ਰੀਖਿਆ ਮਿਆਰ ਵਿੱਚ 1 MB ਵਿੱਚ ਕਿੰਨੇ KB ਹੁੰਦੇ ਹਨ?"
  },
  {
    "explanation": "ਇਸ ਪ੍ਰੀਖਿਆ ਮਿਆਰ ਵਿੱਚ 1 GB = 1024 MB ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ। MB ਦਾ ਅਰਥ megabyte ਅਤੇ GB ਦਾ ਅਰਥ gigabyte ਹੈ।",
    "options": [
      "1024 KB",
      "1024 MB",
      "1024 GB",
      "1024 TB"
    ],
    "sourceQuestionId": "COM008-EN-012",
    "stem": "ਆਮ ਪ੍ਰੀਖਿਆ ਮਿਆਰ ਵਿੱਚ 1 GB ਵਿੱਚ ਕਿੰਨੇ MB ਹੁੰਦੇ ਹਨ?"
  },
  {
    "explanation": "ਬਾਈਨਰੀ ਨੰਬਰ 1010 ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ 10 ਹੈ।",
    "options": [
      "8",
      "10",
      "12",
      "14"
    ],
    "sourceQuestionId": "COM008-EN-013",
    "stem": "(1010)₂ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਦਸ਼ਮਲਵ 5 ਨੂੰ ਬਾਈਨਰੀ ਵਿੱਚ 101 ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।",
    "options": [
      "100",
      "101",
      "110",
      "111"
    ],
    "sourceQuestionId": "COM008-EN-014",
    "stem": "ਦਸ਼ਮਲਵ 5 ਦਾ ਬਾਈਨਰੀ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਬਾਈਨਰੀ ਨੰਬਰ 1111 ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ 15 ਹੈ।",
    "options": [
      "10",
      "12",
      "15",
      "16"
    ],
    "sourceQuestionId": "COM008-EN-015",
    "stem": "(1111)₂ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਦਸ਼ਮਲਵ 8 ਨੂੰ ਬਾਈਨਰੀ ਵਿੱਚ 1000 ਲਿਖਿਆ ਜਾਂਦਾ ਹੈ।",
    "options": [
      "100",
      "1000",
      "1010",
      "1100"
    ],
    "sourceQuestionId": "COM008-EN-016",
    "stem": "ਦਸ਼ਮਲਵ 8 ਦਾ ਬਾਈਨਰੀ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਆਕਟਲ ਨੰਬਰ 10 ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ 8 ਹੈ।",
    "options": [
      "6",
      "8",
      "10",
      "12"
    ],
    "sourceQuestionId": "COM008-EN-017",
    "stem": "(10)₈ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਹੈਕਸਾਡੈਸੀਮਲ ਵਿੱਚ A ਦਾ ਮੁੱਲ ਦਸ਼ਮਲਵ 10 ਹੁੰਦਾ ਹੈ।",
    "options": [
      "8",
      "10",
      "12",
      "16"
    ],
    "sourceQuestionId": "COM008-EN-018",
    "stem": "(A)₁₆ ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਬਾਈਨਰੀ 1010 ਦਾ ਹੈਕਸਾਡੈਸੀਮਲ ਰੂਪ A ਹੈ।",
    "options": [
      "A",
      "B",
      "C",
      "F"
    ],
    "sourceQuestionId": "COM008-EN-019",
    "stem": "ਬਾਈਨਰੀ 1010 ਦਾ ਹੈਕਸਾਡੈਸੀਮਲ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਬਾਈਨਰੀ 111 ਦਾ ਆਕਟਲ ਰੂਪ 7 ਹੈ।",
    "options": [
      "5",
      "6",
      "7",
      "8"
    ],
    "sourceQuestionId": "COM008-EN-020",
    "stem": "ਬਾਈਨਰੀ 111 ਦਾ ਆਕਟਲ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਬਾਈਨਰੀ ਨੰਬਰ 1101 ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ 13 ਹੈ।",
    "options": [
      "11",
      "12",
      "13",
      "14"
    ],
    "sourceQuestionId": "COM008-EN-021",
    "stem": "ਬਾਈਨਰੀ 1101 ਦਾ ਦਸ਼ਮਲਵ ਮੁੱਲ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਹੈਕਸਾਡੈਸੀਮਲ F ਦਾ ਬਾਈਨਰੀ ਰੂਪ 1111 ਹੈ।",
    "options": [
      "1110",
      "1111",
      "1010",
      "1001"
    ],
    "sourceQuestionId": "COM008-EN-022",
    "stem": "ਹੈਕਸਾਡੈਸੀਮਲ F ਦਾ ਬਾਈਨਰੀ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਆਕਟਲ 5 ਦਾ ਬਾਈਨਰੀ ਰੂਪ 101 ਹੈ।",
    "options": [
      "001",
      "010",
      "101",
      "111"
    ],
    "sourceQuestionId": "COM008-EN-023",
    "stem": "ਆਕਟਲ 5 ਦਾ ਬਾਈਨਰੀ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ਬਾਈਨਰੀ ਅੰਕਾਂ ਨੂੰ ਤਿੰਨ-ਤਿੰਨ ਦੇ ਸਮੂਹ ਵਿੱਚ ਵੰਡੋ: 100 000। ਆਕਟਲ ਰੂਪ 40 ਹੈ।",
    "options": [
      "20",
      "40",
      "80",
      "100"
    ],
    "sourceQuestionId": "COM008-EN-024",
    "stem": "ਬਾਈਨਰੀ 100000 ਦਾ ਆਕਟਲ ਰੂਪ ਕੀ ਹੈ?"
  },
  {
    "explanation": "BCD ਦਾ ਅਰਥ Binary Coded Decimal ਹੈ। ਇਹ ਦਸ਼ਮਲਵ ਅੰਕਾਂ ਨੂੰ ਬਾਈਨਰੀ ਅੰਕਾਂ ਨਾਲ ਦਿਖਾਉਂਦਾ ਹੈ।",
    "options": [
      "Binary Coded Decimal",
      "Basic Code Data",
      "Binary Character Data",
      "Byte Coded Decimal"
    ],
    "sourceQuestionId": "COM008-EN-025",
    "stem": "BCD ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?"
  },
  {
    "explanation": "ASCII ਦਾ ਅਰਥ American Standard Code for Information Interchange ਹੈ। ਇਹ ਕੈਰੈਕਟਰ ਕੋਡ ਹੈ।",
    "options": [
      "American Standard Code for Information Interchange",
      "Advanced Standard Code for Internet Information",
      "American System Code for Internal Information",
      "Automatic Standard Code for Information Input"
    ],
    "sourceQuestionId": "COM008-EN-026",
    "stem": "ASCII ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?"
  },
  {
    "explanation": "EBCDIC ਦਾ ਅਰਥ Extended Binary Coded Decimal Interchange Code ਹੈ। ਇਹ ਕੈਰੈਕਟਰ ਕੋਡ ਹੈ।",
    "options": [
      "Extended Binary Coded Decimal Interchange Code",
      "Extended Byte Code for Digital Information Control",
      "Electronic Binary Character Data Information Code",
      "External Binary Coded Data Internet Code"
    ],
    "sourceQuestionId": "COM008-EN-027",
    "stem": "EBCDIC ਦਾ ਪੂਰਾ ਨਾਮ ਕੀ ਹੈ?"
  },
  {
    "explanation": "Unicode ਕਈ ਲਿਖਤ ਪ੍ਰਣਾਲੀਆਂ ਅਤੇ ਭਾਸ਼ਾਵਾਂ ਦੇ ਕੈਰੈਕਟਰ ਦਿਖਾਉਂਦਾ ਹੈ।",
    "options": [
      "ਸਿਰਫ਼ ਨੰਬਰ ਰੱਖਣਾ",
      "ਕਈ ਲਿਖਤ ਪ੍ਰਣਾਲੀਆਂ ਦੇ ਕੈਰੈਕਟਰ ਦਿਖਾਉਣਾ",
      "ਪ੍ਰਿੰਟਰ ਜੋੜਨਾ",
      "ਪ੍ਰੋਸੈਸਰ ਦੀ ਗਤੀ ਮਾਪਣਾ"
    ],
    "sourceQuestionId": "COM008-EN-028",
    "stem": "Unicode ਦਾ ਮੁੱਖ ਵਰਤੋਂ ਕੀ ਹੈ?"
  },
  {
    "explanation": "BCD ਦਾ ਅਰਥ Binary Coded Decimal ਹੈ। ਇਸ ਵਿੱਚ ਹਰ ਦਸ਼ਮਲਵ ਅੰਕ ਲਈ ਚਾਰ ਬਿਟ ਹੁੰਦੇ ਹਨ।",
    "options": [
      "ਹਰ ਦਸ਼ਮਲਵ ਅੰਕ ਲਈ ਚਾਰ ਬਿਟ ਵਰਤ ਕੇ",
      "ਸਿਰਫ਼ ਅੱਖਰ ਵਰਤ ਕੇ",
      "ਹਰ ਸ਼ਬਦ ਲਈ ਇੱਕ ਬਾਈਟ ਵਰਤ ਕੇ",
      "ਹਰ ਦਸ਼ਮਲਵ ਅੰਕ ਲਈ ਅੱਠ ਬਿਟ ਵਰਤ ਕੇ"
    ],
    "sourceQuestionId": "COM008-EN-029",
    "stem": "BCD ਦਸ਼ਮਲਵ ਨੰਬਰ ਨੂੰ ਕਿਵੇਂ ਦਿਖਾਉਂਦਾ ਹੈ?"
  },
  {
    "explanation": "ASCII ਦਾ ਅਰਥ American Standard Code for Information Interchange ਹੈ। ASCII-7 ਵਿੱਚ 7 ਬਿਟ ਹੁੰਦੇ ਹਨ।",
    "options": [
      "7",
      "8",
      "16",
      "32"
    ],
    "sourceQuestionId": "COM008-EN-030",
    "stem": "ASCII-7 ਵਿੱਚ ਕਿੰਨੇ ਬਿਟ ਹੁੰਦੇ ਹਨ?"
  },
  {
    "explanation": "Unicode ਕਈ ਭਾਸ਼ਾਵਾਂ ਅਤੇ ਲਿਖਤ ਪ੍ਰਣਾਲੀਆਂ ਦੇ ਕੈਰੈਕਟਰ ਦਿਖਾਉਣ ਲਈ ਬਣਾਇਆ ਗਿਆ ਹੈ।",
    "options": [
      "BCD",
      "ASCII",
      "Unicode",
      "Machine language"
    ],
    "sourceQuestionId": "COM008-EN-031",
    "stem": "ਕਈ ਭਾਸ਼ਾਵਾਂ ਦੇ ਕੈਰੈਕਟਰਾਂ ਲਈ ਕਿਹੜਾ ਕੋਡ ਲਾਭਦਾਇਕ ਹੈ?"
  },
  {
    "explanation": "EBCDIC ਦਾ ਅਰਥ Extended Binary Coded Decimal Interchange Code ਹੈ। ਇਸ ਵਿੱਚ ਕੈਰੈਕਟਰ ਲਈ ਅੱਠ ਬਿਟ ਹੁੰਦੇ ਹਨ।",
    "options": [
      "EBCDIC",
      "ASCII-7",
      "BCD",
      "Binary number system"
    ],
    "sourceQuestionId": "COM008-EN-032",
    "stem": "ਸਰੋਤ ਵਿੱਚ ਕਿਹੜੇ ਕੋਡ ਲਈ ਹਰ ਕੈਰੈਕਟਰ ਵਾਸਤੇ ਅੱਠ ਬਿਟ ਵਰਤਣੇ ਦੱਸੇ ਗਏ ਹਨ?"
  }
]);

function freezeLocalized(language:"hi"|"pa",locale:"hi-IN"|"pa-IN",copy:readonly CopyEntry[]):readonly Com008FrozenQuestion[] {
  if(copy.length!==COM008_ENGLISH_FROZEN.length) throw new Error(`COM-008 ${language} localization count mismatch`);
  return Object.freeze(copy.map((entry,index)=>{
    const english=COM008_ENGLISH_FROZEN[index]!;
    if(entry.sourceQuestionId!==english.sourceQuestionId) throw new Error(`COM-008 localization order mismatch: ${entry.sourceQuestionId}`);
    if(entry.options.length!==english.options.length) throw new Error(`COM-008 option count mismatch: ${entry.sourceQuestionId}`);
    return Object.freeze({
      questionId:`${english.questionId}-${language.toUpperCase()}`, sourceQuestionId:english.questionId, qlId:english.ql,
      language, locale, difficulty:english.difficulty, stem:entry.stem, options:Object.freeze([...entry.options]),
      correctIndex:english.correctIndex, canonicalAnswer:entry.options[english.correctIndex]!, explanation:entry.explanation,
      sourceFactIds:english.sourceFactIds, sourceEnglishAuthorityId:english.sourceEnglishAuthorityId,
      sourceEnglishFrozen:true as const, sourceLocalizationFrozen:true as const,
    });
  }));
}
export const COM008_HINDI_FROZEN=freezeLocalized("hi","hi-IN",HI);
export const COM008_PUNJABI_FROZEN=freezeLocalized("pa","pa-IN",PA);

function fingerprint(rows:readonly Com008FrozenQuestion[]) {
  return createHash("sha256").update(JSON.stringify(rows.map((row)=>({sourceQuestionId:row.sourceQuestionId,qlId:row.qlId,language:row.language,stem:row.stem,options:row.options,correctIndex:row.correctIndex,explanation:row.explanation})))).digest("hex");
}
export const COM008_LOCALIZATION_FREEZE_AUTHORITY_V1={
  authorityId:"COM-008-HI-PA-LOCALIZATION-FREEZE-V1", chapterCode:"COM-008",
  englishQuestionCount:COM008_ENGLISH_FROZEN.length, hindiQuestionCount:COM008_HINDI_FROZEN.length, punjabiQuestionCount:COM008_PUNJABI_FROZEN.length,
  languages:Object.freeze(["en","hi","pa"] as const), combinedFingerprint:fingerprint([...COM008_ENGLISH_FROZEN,...COM008_HINDI_FROZEN,...COM008_PUNJABI_FROZEN]),
} as const;

export function auditCom008FreezeV1() {
  const issues:string[]=[]; const english=COM008_ENGLISH_FROZEN; const hindi=COM008_HINDI_FROZEN; const punjabi=COM008_PUNJABI_FROZEN;
  if(english.length!==32) issues.push("ENGLISH_COUNT"); if(hindi.length!==32) issues.push("HINDI_COUNT"); if(punjabi.length!==32) issues.push("PUNJABI_COUNT");
  for(const [index,row] of english.entries()) {
    if(row.options.length!==4 || new Set(row.options).size!==4) issues.push(`ENGLISH_OPTIONS:${row.questionId}`);
    if(row.correctIndex<0 || row.correctIndex>3) issues.push(`ENGLISH_INDEX:${row.questionId}`);
    for(const localized of [hindi[index],punjabi[index]]) {
      if(!localized || localized.sourceQuestionId!==row.sourceQuestionId) issues.push(`PARITY:${row.questionId}`);
      else if(localized.correctIndex!==row.correctIndex) issues.push(`INDEX_PARITY:${row.questionId}`);
    }
  }
  return {valid:issues.length===0,issues,englishCount:english.length,hindiCount:hindi.length,punjabiCount:punjabi.length};
}