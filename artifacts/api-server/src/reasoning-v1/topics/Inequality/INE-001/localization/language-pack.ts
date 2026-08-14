import type { IneTranslatedLocale } from "./types";

export interface IneLanguagePack {
  locale: IneTranslatedLocale;
  title: string;
  labels: {
    statements: string;
    conclusions: string;
    codeKey: string;
    evidence: string;
    options: string;
    correct: string;
    explanation: string;
    question: string;
    seed: string;
    difficulty: string;
  };
  fixed: Readonly<Record<string, string>>;
}

const HI_FIXED: Readonly<Record<string, string>> = {
  "The relation cannot be determined": "संबंध निर्धारित नहीं किया जा सकता",
  "Definitely follows": "निश्चित रूप से निकलता है",
  "May be true, but is not certain": "सत्य हो सकता है, पर निश्चित नहीं है",
  "Cannot be true": "सत्य नहीं हो सकता",
  "The statements contradict one another": "कथन परस्पर विरोधी हैं",
  "Possibly true, but not definite": "संभवतः सत्य, पर निश्चित नहीं",
  "Definitely true": "निश्चित रूप से सत्य",
  Impossible: "असंभव",
  "Only conclusion I follows": "केवल निष्कर्ष I निकलता है",
  "Only conclusion II follows": "केवल निष्कर्ष II निकलता है",
  "Both conclusions I and II follow": "निष्कर्ष I और II दोनों निकलते हैं",
  "Neither conclusion I nor conclusion II follows": "निष्कर्ष I और II में से कोई भी नहीं निकलता",
  "Either conclusion I or conclusion II follows": "निष्कर्ष I या II में से कोई एक निकलता है",
  "None of the conclusions follows": "कोई निष्कर्ष नहीं निकलता",
  "None of the conclusions follow": "कोई निष्कर्ष नहीं निकलता",
  "Only conclusion III follows": "केवल निष्कर्ष III निकलता है",
  "Only conclusions I and III follow": "केवल निष्कर्ष I और III निकलते हैं",
  "Only conclusions II and III follow": "केवल निष्कर्ष II और III निकलते हैं",
  "All three conclusions follow": "तीनों निष्कर्ष निकलते हैं",
  "Either conclusion II or conclusion III follows": "निष्कर्ष II या III में से कोई एक निकलता है",
  "Conclusion I and either conclusion II or conclusion III follow": "निष्कर्ष I तथा निष्कर्ष II या III में से कोई एक निकलता है",
  "Valid either-or pair": "मान्य या-तो जोड़ी",
  "Not either-or: some valid cases are left uncovered": "या-तो नहीं: कुछ मान्य स्थितियाँ छूट जाती हैं",
  "Not either-or: the conclusions overlap": "या-तो नहीं: निष्कर्ष आपस में मिलते हैं",
  "Cannot be determined from the statements": "कथनों से निर्धारित नहीं किया जा सकता",
  "less than": "से छोटा",
  "greater than": "से बड़ा",
  "equal to": "के बराबर",
  "less than or equal to": "से छोटा या बराबर",
  "greater than or equal to": "से बड़ा या बराबर",
};

const PA_FIXED: Readonly<Record<string, string>> = {
  "The relation cannot be determined": "ਸੰਬੰਧ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  "Definitely follows": "ਯਕੀਨੀ ਤੌਰ ਤੇ ਨਿਕਲਦਾ ਹੈ",
  "May be true, but is not certain": "ਸਹੀ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ ਯਕੀਨੀ ਨਹੀਂ",
  "Cannot be true": "ਸਹੀ ਨਹੀਂ ਹੋ ਸਕਦਾ",
  "The statements contradict one another": "ਕਥਨ ਆਪਸ ਵਿੱਚ ਵਿਰੋਧੀ ਹਨ",
  "Possibly true, but not definite": "ਸੰਭਵ ਤੌਰ ਤੇ ਸਹੀ, ਪਰ ਯਕੀਨੀ ਨਹੀਂ",
  "Definitely true": "ਯਕੀਨੀ ਤੌਰ ਤੇ ਸਹੀ",
  Impossible: "ਅਸੰਭਵ",
  "Only conclusion I follows": "ਕੇਵਲ ਨਤੀਜਾ I ਨਿਕਲਦਾ ਹੈ",
  "Only conclusion II follows": "ਕੇਵਲ ਨਤੀਜਾ II ਨਿਕਲਦਾ ਹੈ",
  "Both conclusions I and II follow": "ਨਤੀਜੇ I ਅਤੇ II ਦੋਵੇਂ ਨਿਕਲਦੇ ਹਨ",
  "Neither conclusion I nor conclusion II follows": "ਨਤੀਜਾ I ਅਤੇ II ਵਿੱਚੋਂ ਕੋਈ ਵੀ ਨਹੀਂ ਨਿਕਲਦਾ",
  "Either conclusion I or conclusion II follows": "ਨਤੀਜਾ I ਜਾਂ ਨਤੀਜਾ II ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਨਿਕਲਦਾ ਹੈ",
  "None of the conclusions follows": "ਕੋਈ ਵੀ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ",
  "None of the conclusions follow": "ਕੋਈ ਵੀ ਨਤੀਜਾ ਨਹੀਂ ਨਿਕਲਦਾ",
  "Only conclusion III follows": "ਕੇਵਲ ਨਤੀਜਾ III ਨਿਕਲਦਾ ਹੈ",
  "Only conclusions I and III follow": "ਕੇਵਲ ਨਤੀਜੇ I ਅਤੇ III ਨਿਕਲਦੇ ਹਨ",
  "Only conclusions II and III follow": "ਕੇਵਲ ਨਤੀਜੇ II ਅਤੇ III ਨਿਕਲਦੇ ਹਨ",
  "All three conclusions follow": "ਤਿੰਨੇ ਨਤੀਜੇ ਨਿਕਲਦੇ ਹਨ",
  "Either conclusion II or conclusion III follows": "ਨਤੀਜਾ II ਜਾਂ ਨਤੀਜਾ III ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਨਿਕਲਦਾ ਹੈ",
  "Conclusion I and either conclusion II or conclusion III follow": "ਨਤੀਜਾ I ਅਤੇ ਨਤੀਜਾ II ਜਾਂ III ਵਿੱਚੋਂ ਕੋਈ ਇੱਕ ਨਿਕਲਦਾ ਹੈ",
  "Valid either-or pair": "ਮੰਨਣਯੋਗ ਜਾਂ-ਤਾਂ ਜੋੜੀ",
  "Not either-or: some valid cases are left uncovered": "ਜਾਂ-ਤਾਂ ਨਹੀਂ: ਕੁਝ ਸੰਭਵ ਹਾਲਤਾਂ ਰਹਿ ਜਾਂਦੀਆਂ ਹਨ",
  "Not either-or: the conclusions overlap": "ਜਾਂ-ਤਾਂ ਨਹੀਂ: ਨਤੀਜੇ ਆਪਸ ਵਿੱਚ ਮਿਲਦੇ ਹਨ",
  "Cannot be determined from the statements": "ਕਥਨਾਂ ਤੋਂ ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ",
  "less than": "ਤੋਂ ਛੋਟਾ",
  "greater than": "ਤੋਂ ਵੱਡਾ",
  "equal to": "ਦੇ ਬਰਾਬਰ",
  "less than or equal to": "ਤੋਂ ਛੋਟਾ ਜਾਂ ਬਰਾਬਰ",
  "greater than or equal to": "ਤੋਂ ਵੱਡਾ ਜਾਂ ਬਰਾਬਰ",
};

const HINDI: IneLanguagePack = {
  locale: "hi-IN",
  title: "INE-001 हिंदी समीक्षा पैक",
  labels: {
    statements: "कथन",
    conclusions: "निष्कर्ष",
    codeKey: "कोड कुंजी",
    evidence: "दी गई जानकारी",
    options: "विकल्प",
    correct: "सही उत्तर",
    explanation: "सरल व्याख्या",
    question: "प्रश्न",
    seed: "बीज",
    difficulty: "कठिनाई",
  },
  fixed: HI_FIXED,
};

const PUNJABI: IneLanguagePack = {
  locale: "pa-IN",
  title: "INE-001 ਪੰਜਾਬੀ ਸਮੀਖਿਆ ਪੈਕ",
  labels: {
    statements: "ਕਥਨ",
    conclusions: "ਨਤੀਜੇ",
    codeKey: "ਕੋਡ ਕੁੰਜੀ",
    evidence: "ਦਿੱਤੀ ਜਾਣਕਾਰੀ",
    options: "ਚੋਣਾਂ",
    correct: "ਸਹੀ ਉੱਤਰ",
    explanation: "ਸੌਖੀ ਵਿਆਖਿਆ",
    question: "ਸਵਾਲ",
    seed: "ਬੀਜ",
    difficulty: "ਔਖਿਆਈ",
  },
  fixed: PA_FIXED,
};

export function ineLanguagePack(locale: IneTranslatedLocale): IneLanguagePack {
  return locale === "hi-IN" ? HINDI : PUNJABI;
}
