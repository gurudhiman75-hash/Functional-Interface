import { calculateDmAgeOnDate, evaluateDmDecision, rankDmCandidates } from "./decision-engine.ts";
import { formatDmDate } from "./scenario-library.ts";
import { solveDmSituation } from "./situational-engine.ts";
import type {
  DmCandidateMode,
  DmCandidateProfile,
  DmConditionCheck,
  DmDecisionResult,
  DmDifficulty,
  DmField,
  DmGeneratedQuestion,
  DmLocale,
  DmOutcome,
  DmRuleCondition,
  DmScenario,
  DmRankingSpec,
  DmSetQuestionKind,
} from "./types.ts";

const NAMES: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: ["Aman", "Simran", "Kabir", "Meera", "Harjit", "Nisha", "Karan", "Riya", "Arjun", "Noor"],
  hi: ["अमन", "सिमरन", "कबीर", "मीरा", "हरजीत", "निशा", "करण", "रिया", "अर्जुन", "नूर"],
  pa: ["ਅਮਨ", "ਸਿਮਰਨ", "ਕਬੀਰ", "ਮੀਰਾ", "ਹਰਜੀਤ", "ਨਿਸ਼ਾ", "ਕਰਨ", "ਰੀਆ", "ਅਰਜੁਨ", "ਨੂਰ"],
});

const FIELD_LABELS: Readonly<Record<DmLocale, Readonly<Record<DmField, string>>>> = Object.freeze({
  en: {
    age: "Age", ageAtDate: "Age on the cut-off date", graduationMarks: "Graduation marks",
    qualificationRank: "Qualification", experienceYears: "Relevant experience", experienceArea: "Experience area",
    residenceStatus: "Residence", registrationStatus: "Registration", certificateStatus: "Certificate status",
    writtenScore: "Written score", sectionalScore: "Sectional score", interviewScore: "Interview score", overallScore: "Overall score",
    annualIncome: "Annual income", familyIncome: "Family income", employmentStatus: "Employment status",
    repaymentStatus: "Repayment record", collateralStatus: "Collateral", category: "Category", applicationOrder: "Application order",
  },
  hi: {
    age: "आयु", ageAtDate: "निर्धारित तिथि पर आयु", graduationMarks: "स्नातक में अंक",
    qualificationRank: "योग्यता", experienceYears: "संबंधित अनुभव", experienceArea: "अनुभव का क्षेत्र",
    residenceStatus: "निवास", registrationStatus: "पंजीकरण", certificateStatus: "प्रमाणपत्र की स्थिति",
    writtenScore: "लिखित परीक्षा के अंक", sectionalScore: "अनुभागीय अंक", interviewScore: "साक्षात्कार के अंक", overallScore: "कुल अंक",
    annualIncome: "वार्षिक आय", familyIncome: "परिवार की आय", employmentStatus: "रोज़गार की स्थिति",
    repaymentStatus: "भुगतान का रिकॉर्ड", collateralStatus: "जमानत", category: "श्रेणी", applicationOrder: "आवेदन क्रम",
  },
  pa: {
    age: "ਉਮਰ", ageAtDate: "ਨਿਰਧਾਰਤ ਮਿਤੀ ਨੂੰ ਉਮਰ", graduationMarks: "ਗ੍ਰੈਜੂਏਸ਼ਨ ਦੇ ਅੰਕ",
    qualificationRank: "ਯੋਗਤਾ", experienceYears: "ਸੰਬੰਧਤ ਤਜਰਬਾ", experienceArea: "ਤਜਰਬੇ ਦਾ ਖੇਤਰ",
    residenceStatus: "ਰਿਹਾਇਸ਼", registrationStatus: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ", certificateStatus: "ਸਰਟੀਫਿਕੇਟ ਦੀ ਸਥਿਤੀ",
    writtenScore: "ਲਿਖਤੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", sectionalScore: "ਭਾਗੀ ਅੰਕ", interviewScore: "ਇੰਟਰਵਿਊ ਦੇ ਅੰਕ", overallScore: "ਕੁੱਲ ਅੰਕ",
    annualIncome: "ਸਾਲਾਨਾ ਆਮਦਨ", familyIncome: "ਪਰਿਵਾਰਕ ਆਮਦਨ", employmentStatus: "ਰੁਜ਼ਗਾਰ ਦੀ ਸਥਿਤੀ",
    repaymentStatus: "ਭੁਗਤਾਨ ਰਿਕਾਰਡ", collateralStatus: "ਜਮਾਨਤ", category: "ਸ਼੍ਰੇਣੀ", applicationOrder: "ਅਰਜ਼ੀ ਦਾ ਕ੍ਰਮ",
  },
});

const VALUE_LABELS: Readonly<Record<DmLocale, Readonly<Record<string, string>>>> = Object.freeze({
  en: {
    VALID: "valid", PENDING: "pending", INVALID: "invalid", MISMATCH: "does not match the record",
    HOME_STATE: "resident of the state", OTHER_STATE: "not a resident of the state",
    STUDENT: "student", UNEMPLOYED: "unemployed", CURRENT: "up to date", NOT_APPLICABLE: "not applicable", ACCEPTABLE: "acceptable", GENERAL: "General category", OBC: "OBC category", SC: "SC category", ST: "ST category", OTHER: "other",
    TEACHING: "teaching", CLERICAL: "clerical work", BANKING: "banking", TECHNICAL: "technical work", FIELD: "field work", LABORATORY: "laboratory work",
  },
  hi: {
    VALID: "वैध", PENDING: "लंबित", INVALID: "अमान्य", MISMATCH: "अभिलेख से मेल नहीं खाता",
    HOME_STATE: "राज्य का निवासी", OTHER_STATE: "राज्य का निवासी नहीं",
    STUDENT: "विद्यार्थी", UNEMPLOYED: "बेरोज़गार", CURRENT: "भुगतान नियमित", NOT_APPLICABLE: "लागू नहीं", ACCEPTABLE: "स्वीकार्य", GENERAL: "सामान्य श्रेणी", OBC: "ओबीसी श्रेणी", SC: "एससी श्रेणी", ST: "एसटी श्रेणी", OTHER: "अन्य",
    TEACHING: "अध्यापन", CLERICAL: "लिपिकीय कार्य", BANKING: "बैंकिंग", TECHNICAL: "तकनीकी कार्य", FIELD: "क्षेत्रीय कार्य", LABORATORY: "प्रयोगशाला कार्य",
  },
  pa: {
    VALID: "ਵੈਧ", PENDING: "ਲੰਬਿਤ", INVALID: "ਅਵੈਧ", MISMATCH: "ਰਿਕਾਰਡ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ",
    HOME_STATE: "ਰਾਜ ਦਾ ਵਸਨੀਕ", OTHER_STATE: "ਰਾਜ ਦਾ ਵਸਨੀਕ ਨਹੀਂ",
    STUDENT: "ਵਿਦਿਆਰਥੀ", UNEMPLOYED: "ਬੇਰੁਜ਼ਗਾਰ", CURRENT: "ਭੁਗਤਾਨ ਠੀਕ", NOT_APPLICABLE: "ਲਾਗੂ ਨਹੀਂ", ACCEPTABLE: "ਮਨਜ਼ੂਰਯੋਗ", GENERAL: "ਜਨਰਲ ਸ਼੍ਰੇਣੀ", OBC: "ਓਬੀਸੀ ਸ਼੍ਰੇਣੀ", SC: "ਐਸਸੀ ਸ਼੍ਰੇਣੀ", ST: "ਐਸਟੀ ਸ਼੍ਰੇਣੀ", OTHER: "ਹੋਰ",
    TEACHING: "ਅਧਿਆਪਨ", CLERICAL: "ਕਲਰਕੀ ਕੰਮ", BANKING: "ਬੈਂਕਿੰਗ", TECHNICAL: "ਤਕਨੀਕੀ ਕੰਮ", FIELD: "ਫੀਲਡ ਕੰਮ", LABORATORY: "ਲੈਬੋਰਟਰੀ ਦਾ ਕੰਮ",
  },
});

const QUALIFICATIONS: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: ["", "ITI", "Diploma", "Graduation", "Postgraduation", "Professional degree"],
  hi: ["", "आईटीआई", "डिप्लोमा", "स्नातक", "स्नातकोत्तर", "व्यावसायिक डिग्री"],
  pa: ["", "ਆਈਟੀਆਈ", "ਡਿਪਲੋਮਾ", "ਗ੍ਰੈਜੂਏਸ਼ਨ", "ਪੋਸਟਗ੍ਰੈਜੂਏਸ਼ਨ", "ਪੇਸ਼ਾਵਰ ਡਿਗਰੀ"],
});

const OUTCOME_LABELS: Readonly<Record<DmLocale, Readonly<Record<DmOutcome, string>>>> = Object.freeze({
  en: {
    SELECT: "Eligible under the stated rules", REJECT: "Not eligible under the stated rules", REFER_TO_MANAGER: "Refer the case to the Manager",
    REFER_TO_DIRECTOR: "Refer the case to the Director", REFER_TO_COMMITTEE: "Refer the case to the Review Committee",
    INFORMATION_REQUIRED: "Decision cannot be made; information is required",
    TAKE_ACTION: "Take the identified action",
    SET_RESULT: "Use the computed set result",
  },
  hi: {
    SELECT: "दिए गए नियमों के अनुसार पात्र", REJECT: "दिए गए नियमों के अनुसार अपात्र", REFER_TO_MANAGER: "मामला प्रबंधक को भेजें",
    REFER_TO_DIRECTOR: "मामला निदेशक को भेजें", REFER_TO_COMMITTEE: "मामला समीक्षा समिति को भेजें",
    INFORMATION_REQUIRED: "निर्णय के लिए अतिरिक्त जानकारी आवश्यक है",
    TAKE_ACTION: "निर्धारित कार्रवाई करें",
    SET_RESULT: "गणना किए गए सेट परिणाम का उपयोग करें",
  },
  pa: {
    SELECT: "ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਯੋਗ", REJECT: "ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਅਯੋਗ", REFER_TO_MANAGER: "ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜੋ",
    REFER_TO_DIRECTOR: "ਮਾਮਲਾ ਡਾਇਰੈਕਟਰ ਕੋਲ ਭੇਜੋ", REFER_TO_COMMITTEE: "ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜੋ",
    INFORMATION_REQUIRED: "ਫੈਸਲੇ ਲਈ ਹੋਰ ਜਾਣਕਾਰੀ ਲੋੜੀਂਦੀ ਹੈ",
    TAKE_ACTION: "ਪਛਾਣੀ ਕਾਰਵਾਈ ਕਰੋ",
    SET_RESULT: "ਗਿਣੇ ਹੋਏ ਸੈੱਟ ਨਤੀਜੇ ਦੀ ਵਰਤੋਂ ਕਰੋ",
  },
});

const STEMS: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: [
    "What decision applies in {name}'s case?", "How should {name}'s case be decided under these conditions?",
    "Which outcome follows from the stated rules?", "What status should be recorded for {name}?",
    "Does {name} qualify under the notice?", "Which result is supported by the information given?",
    "Which decision should be recorded for this case?", "What is the correct decision in this case?",
    "Which option reflects {name}'s position under the rules?", "Does {name} satisfy the stated conditions?",
    "What action do the eligibility rules require?", "Which decision follows in {name}'s case?",
    "Which result follows after each condition is checked?", "How should the responsible authority decide this case?",
    "Choose the decision that matches {name}'s case.", "What should be the outcome in {name}'s case?",
    "Which status applies to this case?", "What should be recorded as the decision in {name}'s case?",
  ],
  hi: [
    "{name} के मामले में क्या निर्णय लागू होगा?", "इन शर्तों के अनुसार {name} के मामले का निर्णय कैसे होना चाहिए?",
    "दिए गए नियमों से कौन-सा परिणाम निकलता है?", "{name} के लिए कौन-सी स्थिति दर्ज की जानी चाहिए?",
    "क्या सूचना के अनुसार {name} पात्र है?", "दी गई जानकारी किस निर्णय का समर्थन करती है?",
    "मामले को किस श्रेणी में रखा जाना चाहिए?", "इस मामले में सही निर्णय क्या है?",
    "नियमों के अनुसार {name} की स्थिति कौन-सा विकल्प बताता है?", "क्या {name} दी गई सभी शर्तें पूरी करता है?",
    "पात्रता के नियमों के अनुसार क्या किया जाना चाहिए?", "दी गई जानकारी के आधार पर {name} के मामले में कौन-सा निर्णय सही है?",
    "हर शर्त की जाँच के बाद कौन-सा परिणाम निकलता है?", "संबंधित प्राधिकारी को इस मामले में क्या करना चाहिए?",
    "{name} के मामले से मेल खाने वाला निर्णय चुनें।", "दी गई शर्तों के तहत {name} के मामले का क्या परिणाम होना चाहिए?",
    "इस मामले पर कौन-सी स्थिति लागू होती है?", "{name} के मामले में निर्णय के रूप में क्या दर्ज किया जाए?",
  ],
  pa: [
    "{name} ਦੇ ਮਾਮਲੇ ਵਿੱਚ ਕਿਹੜਾ ਫੈਸਲਾ ਲਾਗੂ ਹੁੰਦਾ ਹੈ?", "ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ {name} ਦੇ ਮਾਮਲੇ ਦਾ ਫੈਸਲਾ ਕਿਵੇਂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?",
    "ਦਿੱਤੇ ਨਿਯਮਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ?", "{name} ਲਈ ਕਿਹੜੀ ਸਥਿਤੀ ਦਰਜ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
    "ਨੋਟਿਸ ਦੀਆਂ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ ਕੀ {name} ਯੋਗ ਹੈ?", "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਕਿਹੜੇ ਫੈਸਲੇ ਦਾ ਆਧਾਰ ਬਣਦੀ ਹੈ?",
    "ਮਾਮਲੇ ਨੂੰ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਵੇ?", "ਇਸ ਮਾਮਲੇ ਬਾਰੇ ਸਹੀ ਫੈਸਲਾ ਕੀ ਹੈ?",
    "ਨਿਯਮਾਂ ਅਨੁਸਾਰ {name} ਦੀ ਸਥਿਤੀ ਕਿਹੜਾ ਵਿਕਲਪ ਦੱਸਦਾ ਹੈ?", "ਕੀ {name} ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ?",
    "ਯੋਗਤਾ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਕੀ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?", "ਦਿੱਤੇ ਤੱਥਾਂ ਦੇ ਆਧਾਰ ਤੇ {name} ਦੇ ਮਾਮਲੇ ਵਿੱਚ ਕਿਹੜਾ ਫੈਸਲਾ ਠੀਕ ਹੈ?",
    "ਹਰ ਸ਼ਰਤ ਦੀ ਜਾਂਚ ਮਗਰੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ?", "ਸੰਬੰਧਤ ਅਧਿਕਾਰੀ ਨੂੰ ਇਸ ਮਾਮਲੇ ਵਿੱਚ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    "{name} ਦੇ ਮਾਮਲੇ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਫੈਸਲਾ ਚੁਣੋ।", "ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠ {name} ਦੇ ਮਾਮਲੇ ਦਾ ਕੀ ਨਤੀਜਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ?",
    "ਇਸ ਮਾਮਲੇ ਉੱਤੇ ਕਿਹੜੀ ਸਥਿਤੀ ਲਾਗੂ ਹੁੰਦੀ ਹੈ?", "{name} ਦੇ ਮਾਮਲੇ ਵਿੱਚ ਫੈਸਲੇ ਵਜੋਂ ਕੀ ਦਰਜ ਕੀਤਾ ਜਾਵੇ?",
  ],
});

const SITUATIONAL_STEMS: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: [
    "Which is the most appropriate action?", "What should the responsible officer do?", "Which course of action should be followed?",
    "Which response is most appropriate in these circumstances?", "Which step follows sound administrative procedure?", "How should this matter be handled?",
    "Which action should be taken first?", "What is the most appropriate next step?", "Which response correctly applies the stated priorities?",
    "What should be done before any consequential action?", "Which option gives the correct sequence?", "Which action best protects the process?",
    "Which response is both practical and procedurally sound?", "How should the authority proceed?", "Which action avoids premature escalation?",
    "What is the proper immediate response?", "Which option should be implemented?", "Which choice best follows verification and procedure?",
  ],
  hi: [
    "सबसे उपयुक्त कार्रवाई कौन-सी है?", "जिम्मेदार अधिकारी को क्या करना चाहिए?", "कौन-सा कार्य-मार्ग अपनाया जाना चाहिए?",
    "इन परिस्थितियों में सबसे उचित प्रतिक्रिया कौन-सी है?", "कौन-सा कदम सही प्रशासनिक प्रक्रिया के अनुरूप है?", "इस मामले को कैसे निपटाया जाना चाहिए?",
    "सबसे पहले कौन-सी कार्रवाई करनी चाहिए?", "अगला सबसे उपयुक्त कदम क्या है?", "कौन-सी प्रतिक्रिया दी गई प्राथमिकताओं को सही लागू करती है?",
    "किसी निर्णायक कार्रवाई से पहले क्या करना चाहिए?", "कौन-सा विकल्प सही क्रम बताता है?", "कौन-सी कार्रवाई प्रक्रिया की सबसे अच्छी रक्षा करती है?",
    "कौन-सी प्रतिक्रिया व्यावहारिक और प्रक्रियागत रूप से सही है?", "प्राधिकारी को कैसे आगे बढ़ना चाहिए?", "कौन-सी कार्रवाई समय से पहले मामले को ऊपर भेजने से बचाती है?",
    "उचित तत्काल प्रतिक्रिया क्या है?", "कौन-सा विकल्प लागू किया जाना चाहिए?", "कौन-सा विकल्प सत्यापन और प्रक्रिया का सबसे अच्छा पालन करता है?",
  ],
  pa: [
    "ਸਭ ਤੋਂ ਢੁੱਕਵੀਂ ਕਾਰਵਾਈ ਕਿਹੜੀ ਹੈ?", "ਜ਼ਿੰਮੇਵਾਰ ਅਧਿਕਾਰੀ ਨੂੰ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?", "ਕਿਹੜਾ ਕਾਰਵਾਈ ਰਾਹ ਅਪਣਾਇਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    "ਇਨ੍ਹਾਂ ਹਾਲਾਤਾਂ ਵਿੱਚ ਸਭ ਤੋਂ ਢੁੱਕਵਾਂ ਜਵਾਬ ਕਿਹੜਾ ਹੈ?", "ਕਿਹੜਾ ਕਦਮ ਠੀਕ ਪ੍ਰਸ਼ਾਸਕੀ ਪ੍ਰਕਿਰਿਆ ਅਨੁਸਾਰ ਹੈ?", "ਇਸ ਮਾਮਲੇ ਨੂੰ ਕਿਵੇਂ ਨਿਪਟਾਇਆ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    "ਸਭ ਤੋਂ ਪਹਿਲਾਂ ਕਿਹੜੀ ਕਾਰਵਾਈ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?", "ਅਗਲਾ ਸਭ ਤੋਂ ਢੁੱਕਵਾਂ ਕਦਮ ਕੀ ਹੈ?", "ਕਿਹੜਾ ਜਵਾਬ ਦਿੱਤੀਆਂ ਤਰਜੀਹਾਂ ਠੀਕ ਲਾਗੂ ਕਰਦਾ ਹੈ?",
    "ਕਿਸੇ ਨਤੀਜਾਕਾਰੀ ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?", "ਕਿਹੜਾ ਵਿਕਲਪ ਠੀਕ ਕ੍ਰਮ ਦੱਸਦਾ ਹੈ?", "ਕਿਹੜੀ ਕਾਰਵਾਈ ਪ੍ਰਕਿਰਿਆ ਦੀ ਸਭ ਤੋਂ ਵਧੀਆ ਰੱਖਿਆ ਕਰਦੀ ਹੈ?",
    "ਕਿਹੜਾ ਜਵਾਬ ਵਿਹਾਰਕ ਅਤੇ ਪ੍ਰਕਿਰਿਆ ਅਨੁਸਾਰ ਠੀਕ ਹੈ?", "ਅਧਿਕਾਰੀ ਨੂੰ ਕਿਵੇਂ ਅੱਗੇ ਵਧਣਾ ਚਾਹੀਦਾ ਹੈ?", "ਕਿਹੜੀ ਕਾਰਵਾਈ ਬੇਲੋੜੀ ਉੱਚ ਪੱਧਰੀ ਭੇਜਣ ਤੋਂ ਬਚਾਉਂਦੀ ਹੈ?",
    "ਢੁੱਕਵਾਂ ਤੁਰੰਤ ਜਵਾਬ ਕੀ ਹੈ?", "ਕਿਹੜਾ ਵਿਕਲਪ ਲਾਗੂ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?", "ਕਿਹੜਾ ਵਿਕਲਪ ਤਸਦੀਕ ਅਤੇ ਪ੍ਰਕਿਰਿਆ ਦੀ ਸਭ ਤੋਂ ਵਧੀਆ ਪਾਲਣਾ ਕਰਦਾ ਹੈ?",
  ],
});

const RANKING_STEMS: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: [
    "Which person or group should receive the available places or awards?",
    "Who qualifies after applying every stated priority?",
    "Which listed group ranks within the available limit?",
    "Whose names belong on the final allocation list?",
    "Who receives the limited places or awards under the published order?",
    "Choose the group with the highest priority.",
    "Which answer correctly identifies the recipients?",
    "Who falls within the available allocation limit?",
    "Who qualifies after ineligible profiles are removed?",
    "Which profiles rank within the stated limit?",
    "Which group follows from the ordered tie-break rules?",
    "Whom should the authority include within the available limit?",
    "Who ranks above the others after the tie-break is applied?",
    "Which profiles qualify instead of being waitlisted?",
    "Which group receives the stated number of places or awards?",
    "Identify the eligible profiles that rank within the limit.",
    "Who has priority for the available allocation?",
    "Choose the successful group.",
  ],
  hi: [
    "उपलब्ध सीटें किस आवेदक या आवेदकों को मिलनी चाहिए?",
    "दी गई हर प्राथमिकता लागू करने के बाद किसका चयन होगा?",
    "कौन-सा उम्मीदवार समूह उपलब्ध सीटों के लिए सबसे ऊपर है?",
    "अंतिम चयन-सूची में किन आवेदकों को रखना चाहिए?",
    "प्रकाशित क्रम के अनुसार सीमित सीटें किसे मिलेंगी?",
    "सबसे अधिक प्राथमिकता वाले उम्मीदवार समूह को चुनें।",
    "सीट पाने वाले आवेदकों की सही पहचान कौन-सा विकल्प करता है?",
    "उपलब्ध रिक्तियाँ कौन-से उम्मीदवार भरेंगे?",
    "अपात्र आवेदकों को हटाने के बाद किसका चयन होगा?",
    "उपलब्ध सीटों की सीमा में कौन-से आवेदक आते हैं?",
    "बराबरी होने पर लागू क्रमबद्ध नियमों के बाद किस उम्मीदवार समूह का चयन होगा?",
    "इन सीटों के लिए प्राधिकरण को किन आवेदकों का चयन करना चाहिए?",
    "बराबरी की स्थिति में निर्णायक नियम लागू होने पर कौन ऊपर रहता है?",
    "किन उम्मीदवारों का चयन होगा और किन्हें प्रतीक्षा-सूची में रखा जाएगा?",
    "निर्धारित संख्या की सीटें किस समूह को मिलेंगी?",
    "सीमा के भीतर रैंक करने वाले पात्र आवेदकों की पहचान करें।",
    "इन रिक्तियों के लिए किन उम्मीदवारों को प्राथमिकता मिलेगी?",
    "सफल आवेदकों के समूह को चुनें।",
  ],
  pa: [
    "ਉਪਲਬਧ ਸੀਟਾਂ ਕਿਹੜੇ ਬਿਨੈਕਾਰ ਜਾਂ ਬਿਨੈਕਾਰਾਂ ਨੂੰ ਮਿਲਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ?",
    "ਦਿੱਤੀ ਹਰ ਤਰਜੀਹ ਲਾਗੂ ਕਰਨ ਮਗਰੋਂ ਕੌਣ ਚੁਣਿਆ ਜਾਵੇਗਾ?",
    "ਕਿਹੜਾ ਉਮੀਦਵਾਰ ਸਮੂਹ ਉਪਲਬਧ ਸੀਟਾਂ ਲਈ ਸਭ ਤੋਂ ਉੱਪਰ ਹੈ?",
    "ਅੰਤਿਮ ਚੋਣ-ਸੂਚੀ ਵਿੱਚ ਕਿਹੜੇ ਬਿਨੈਕਾਰ ਹੋਣੇ ਚਾਹੀਦੇ ਹਨ?",
    "ਦਿੱਤੇ ਕ੍ਰਮ ਅਨੁਸਾਰ ਸੀਮਤ ਸੀਟਾਂ ਕਿਸ ਨੂੰ ਮਿਲਣਗੀਆਂ?",
    "ਸਭ ਤੋਂ ਵੱਧ ਤਰਜੀਹ ਵਾਲੇ ਉਮੀਦਵਾਰ ਸਮੂਹ ਨੂੰ ਚੁਣੋ।",
    "ਸੀਟਾਂ ਲੈਣ ਵਾਲਿਆਂ ਦੀ ਸਹੀ ਪਛਾਣ ਕਿਹੜਾ ਵਿਕਲਪ ਕਰਦਾ ਹੈ?",
    "ਉਪਲਬਧ ਖਾਲੀ ਅਸਾਮੀਆਂ ਕਿਹੜੇ ਉਮੀਦਵਾਰ ਭਰਨਗੇ?",
    "ਅਯੋਗ ਬਿਨੈਕਾਰਾਂ ਨੂੰ ਹਟਾਉਣ ਮਗਰੋਂ ਕੌਣ ਚੁਣਿਆ ਜਾਵੇਗਾ?",
    "ਉਪਲਬਧ ਸੀਟਾਂ ਦੀ ਹੱਦ ਵਿੱਚ ਕਿਹੜੇ ਬਿਨੈਕਾਰ ਆਉਂਦੇ ਹਨ?",
    "ਬਰਾਬਰੀ ਹੋਣ ਉੱਤੇ ਲਾਗੂ ਤਰਤੀਬਵਾਰ ਨਿਯਮਾਂ ਤੋਂ ਬਾਅਦ ਕਿਹੜਾ ਉਮੀਦਵਾਰ ਸਮੂਹ ਚੁਣਿਆ ਜਾਵੇਗਾ?",
    "ਇਨ੍ਹਾਂ ਸੀਟਾਂ ਲਈ ਅਧਿਕਾਰੀ ਨੂੰ ਕਿਹੜੇ ਬਿਨੈਕਾਰ ਚੁਣਨੇ ਚਾਹੀਦੇ ਹਨ?",
    "ਬਰਾਬਰੀ ਦੀ ਸਥਿਤੀ ਵਿੱਚ ਨਿਰਣਾਇਕ ਨਿਯਮ ਲਾਗੂ ਹੋਣ ਮਗਰੋਂ ਕੌਣ ਉੱਪਰ ਰਹਿੰਦਾ ਹੈ?",
    "ਕਿਹੜੇ ਉਮੀਦਵਾਰ ਚੁਣੇ ਜਾਣਗੇ ਅਤੇ ਕਿਹੜੇ ਉਡੀਕ-ਸੂਚੀ ਵਿੱਚ ਰਹਿਣਗੇ?",
    "ਨਿਰਧਾਰਤ ਗਿਣਤੀ ਦੀਆਂ ਸੀਟਾਂ ਕਿਹੜੇ ਸਮੂਹ ਨੂੰ ਮਿਲਣਗੀਆਂ?",
    "ਸੀਟਾਂ ਦੀ ਹੱਦ ਅੰਦਰ ਦਰਜਾ ਲੈਣ ਵਾਲੇ ਯੋਗ ਬਿਨੈਕਾਰ ਪਛਾਣੋ।",
    "ਇਨ੍ਹਾਂ ਖਾਲੀ ਅਸਾਮੀਆਂ ਲਈ ਕਿਹੜੇ ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਤਰਜੀਹ ਮਿਲੇਗੀ?",
    "ਸਫਲ ਬਿਨੈਕਾਰਾਂ ਦੇ ਸਮੂਹ ਨੂੰ ਚੁਣੋ।",
  ],
});

const PROMPTS: Readonly<Record<DmLocale, Readonly<{ intro: string; conditions: string; applicant: string; additional: string; missing: string; pass: string; fail: string; unknown: string; result: string; }>>> = Object.freeze({
  en: { intro: "Study the following conditions for {context} and decide the case.", conditions: "Eligibility conditions", applicant: "Details of", additional: "Special provisions", missing: "not provided", pass: "satisfied", fail: "not satisfied", unknown: "cannot be determined", result: "Decision" },
  hi: { intro: "{context} के लिए दी गई शर्तों का अध्ययन करके मामले का निर्णय कीजिए।", conditions: "पात्रता शर्तें", applicant: "विवरण—", additional: "विशेष प्रावधान", missing: "उपलब्ध नहीं", pass: "पूरी", fail: "पूरी नहीं", unknown: "निर्धारित नहीं किया जा सकता", result: "निर्णय" },
  pa: { intro: "{context} ਲਈ ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਪੜ੍ਹ ਕੇ ਮਾਮਲੇ ਦਾ ਫੈਸਲਾ ਕਰੋ।", conditions: "ਯੋਗਤਾ ਸ਼ਰਤਾਂ", applicant: "ਵੇਰਵਾ—", additional: "ਵਿਸ਼ੇਸ਼ ਪ੍ਰਬੰਧ", missing: "ਉਪਲਬਧ ਨਹੀਂ", pass: "ਪੂਰੀ", fail: "ਪੂਰੀ ਨਹੀਂ", unknown: "ਨਿਰਧਾਰਤ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ", result: "ਫੈਸਲਾ" },
});

const CONCLUSIONS: Readonly<Record<DmLocale, Readonly<Record<DmOutcome, string>>>> = Object.freeze({
  en: {
    SELECT: "Every required condition is met, so the case qualifies under the stated rules.",
    REJECT: "At least one mandatory condition is not met and no exception applies, so the case does not qualify.",
    REFER_TO_MANAGER: "The listed rule directs this case to the Manager before a final decision.",
    REFER_TO_DIRECTOR: "The listed rule assigns this case to the Director for a decision.",
    REFER_TO_COMMITTEE: "The listed rule assigns this case to the Review Committee.",
    INFORMATION_REQUIRED: "A required detail is missing or an exception cannot be checked, so a final decision cannot yet be made.",
    TAKE_ACTION: "The action follows the applicable administrative principle.",
    SET_RESULT: "The answer follows from the independently computed decision for every profile.",
  },
  hi: {
    SELECT: "सभी अनिवार्य शर्तें पूरी हैं, इसलिए मामला दिए गए नियमों के अनुसार पात्र है।",
    REJECT: "कम-से-कम एक अनिवार्य शर्त पूरी नहीं है और कोई अपवाद लागू नहीं होता, इसलिए मामला पात्र नहीं है।",
    REFER_TO_MANAGER: "दिया गया नियम अंतिम निर्णय से पहले इस मामले को प्रबंधक के पास भेजता है।",
    REFER_TO_DIRECTOR: "दिए गए नियम के अनुसार इस मामले का निर्णय निदेशक को करना है।",
    REFER_TO_COMMITTEE: "दिए गए नियम के अनुसार इस मामले को समीक्षा समिति के पास भेजना है।",
    INFORMATION_REQUIRED: "एक आवश्यक विवरण उपलब्ध नहीं है या अपवाद की जाँच संभव नहीं है, इसलिए अभी अंतिम निर्णय नहीं लिया जा सकता।",
    TAKE_ACTION: "यह कार्रवाई लागू प्रशासनिक सिद्धांत का पालन करती है।",
    SET_RESULT: "उत्तर प्रत्येक प्रोफाइल के स्वतंत्र रूप से निकाले गए निर्णय से मिलता है।",
  },
  pa: {
    SELECT: "ਸਾਰੀਆਂ ਲਾਜ਼ਮੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹਨ, ਇਸ ਲਈ ਮਾਮਲਾ ਦਿੱਤੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਯੋਗ ਹੈ।",
    REJECT: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਹੁੰਦੀ ਅਤੇ ਕੋਈ ਅਪਵਾਦ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਮਾਮਲਾ ਯੋਗ ਨਹੀਂ ਹੈ।",
    REFER_TO_MANAGER: "ਦਿੱਤਾ ਨਿਯਮ ਅੰਤਿਮ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਮਾਮਲੇ ਨੂੰ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜਦਾ ਹੈ।",
    REFER_TO_DIRECTOR: "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਇਸ ਮਾਮਲੇ ਦਾ ਫੈਸਲਾ ਡਾਇਰੈਕਟਰ ਨੇ ਕਰਨਾ ਹੈ।",
    REFER_TO_COMMITTEE: "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਇਸ ਮਾਮਲੇ ਨੂੰ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜਣਾ ਹੈ।",
    INFORMATION_REQUIRED: "ਇੱਕ ਲਾਜ਼ਮੀ ਵੇਰਵਾ ਉਪਲਬਧ ਨਹੀਂ ਜਾਂ ਅਪਵਾਦ ਦੀ ਜਾਂਚ ਨਹੀਂ ਹੋ ਸਕਦੀ, ਇਸ ਲਈ ਹਾਲੇ ਅੰਤਿਮ ਫੈਸਲਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",
    TAKE_ACTION: "ਇਹ ਕਾਰਵਾਈ ਲਾਗੂ ਪ੍ਰਸ਼ਾਸਕੀ ਸਿਧਾਂਤ ਦੀ ਪਾਲਣਾ ਕਰਦੀ ਹੈ।",
    SET_RESULT: "ਜਵਾਬ ਹਰ ਪ੍ਰੋਫਾਈਲ ਲਈ ਸੁਤੰਤਰ ਤੌਰ ਤੇ ਕੱਢੇ ਫੈਸਲੇ ਤੋਂ ਮਿਲਦਾ ਹੈ।",
  },
});

function hash(value: string): number {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return result >>> 0;
}

function propertyFor(field: DmField): keyof DmCandidateProfile {
  return field === "ageAtDate" ? "birthDate" : field as keyof DmCandidateProfile;
}

function firstAllowedValue(value: DmRuleCondition["value"]): number | string {
  return Array.isArray(value) ? value[0]! : value as number | string;
}

function rawConditionPasses(actual: number | string, condition: DmRuleCondition): boolean {
  const expected = condition.value;
  if (condition.operator === "EQ") return actual === expected;
  if (condition.operator === "IN") return Array.isArray(expected) && expected.includes(actual);
  if (typeof actual !== "number" || typeof expected !== "number") return false;
  return condition.operator === "LTE" ? actual <= expected : actual >= expected;
}

function satisfyingValue(conditions: readonly DmRuleCondition[], scenario: DmScenario, seed: number, boundary = false): number | string {
  const field = conditions[0]!.field;
  const thresholds = conditions.flatMap((item) => Array.isArray(item.value) ? item.value : [item.value]);
  if (field === "ageAtDate") {
    if (!scenario.referenceDate) throw new Error("Age-at-date scenario is missing its reference date.");
    const numericThresholds = thresholds.filter((value): value is number => typeof value === "number");
    const offset = boundary ? 0 : 1 + (seed % 2);
    const adjusted = conditions.flatMap((item) => typeof item.value === "number" ? [item.operator === "LTE" ? item.value - offset : item.value + offset] : []);
    const exact = numericThresholds;
    const ages = [...(boundary ? exact : adjusted), ...exact, ...Array.from({ length: 101 }, (_, index) => (index + seed) % 101)];
    const age = ages.find((candidate) => conditions.every((item) => rawConditionPasses(candidate, item)));
    if (age === undefined) throw new Error("DM-001 could not satisfy the age conditions in " + scenario.scenarioId);
    return dateOfBirthForAge(scenario.referenceDate, age);
  }
  const numericField = ["age", "graduationMarks", "qualificationRank", "experienceYears", "writtenScore", "sectionalScore", "interviewScore", "overallScore", "annualIncome", "familyIncome"].includes(field);
  if (numericField) {
    const numericThresholds = thresholds.filter((value): value is number => typeof value === "number");
    const offset = boundary ? 0 : 1 + (seed % 2);
    const adjusted = conditions.flatMap((item) => typeof item.value === "number" ? [item.operator === "LTE" ? item.value - offset : item.value + offset] : []);
    const candidates = [...(boundary ? numericThresholds : adjusted), ...numericThresholds, ...numericThresholds.map((value) => value + 1), ...numericThresholds.map((value) => Math.max(0, value - 1)), ...Array.from({ length: 101 }, (_, index) => (index + seed) % 101)];
    const value = candidates.find((candidate) => conditions.every((item) => rawConditionPasses(candidate, item)));
    if (value === undefined) throw new Error("DM-001 could not satisfy the numeric conditions in " + scenario.scenarioId);
    return value;
  }
  const candidates = [...thresholds, "VALID", "HOME_STATE", "TEACHING", "TECHNICAL", "BANKING", "CLERICAL", "FIELD", "LABORATORY"];
  const value = candidates.find((candidate) => conditions.every((item) => rawConditionPasses(candidate, item)));
  if (value === undefined) throw new Error("DM-001 could not satisfy the profile conditions in " + scenario.scenarioId);
  return value;
}

function valueFailing(condition: DmRuleCondition, seed: number, scenario: DmScenario): number | string {
  const target = firstAllowedValue(condition.value);
  if (condition.operator === "EQ" || condition.operator === "IN") {
    if (condition.field === "registrationStatus") return "PENDING";
    if (condition.field === "certificateStatus") return "INVALID";
    if (condition.field === "residenceStatus") return "OTHER_STATE";
    if (condition.field === "experienceArea") return "FIELD";
    if (condition.field === "qualificationRank" && typeof target === "number") return Math.max(1, target - 1);
    return "OTHER";
  }
  if (condition.field === "ageAtDate") {
    if (!scenario.referenceDate || typeof target !== "number") throw new Error("Age cut-off is unavailable.");
    const failedAge = condition.operator === "LTE" ? target + 1 + (seed % 2) : Math.max(0, target - 1 - (seed % 2));
    return dateOfBirthForAge(scenario.referenceDate, failedAge);
  }
  if (typeof target !== "number") return "OTHER";
  const delta = 1 + (seed % 2);
  if (condition.operator === "LTE") return target + delta;
    if (condition.field === "experienceYears" || condition.field === "graduationMarks" || condition.field === "writtenScore" || condition.field === "sectionalScore" || condition.field === "interviewScore" || condition.field === "overallScore" || condition.field === "annualIncome" || condition.field === "familyIncome" || condition.field === "age") return Math.max(0, target - delta);
  return target - delta;
}

function dateOfBirthForAge(referenceDate: string, age: number): string {
  const parts = referenceDate.split("-").map(Number);
  const year = (parts[0] ?? 0) - age;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  return String(year).padStart(4, "0") + "-" + String(month).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

function setField(profile: Record<string, string | number | undefined>, field: DmField, value: number | string): void {
  profile[propertyFor(field)] = value;
}

function defaultForField(field: DmField): number | string | undefined {
  if (["experienceYears", "graduationMarks", "writtenScore", "sectionalScore", "interviewScore", "overallScore", "annualIncome", "familyIncome", "qualificationRank", "age", "ageAtDate", "applicationOrder"].includes(field)) return 0;
  if (field === "experienceArea") return "FIELD";
  if (field === "residenceStatus") return "OTHER_STATE";
  if (field === "registrationStatus") return "PENDING";
  if (field === "certificateStatus") return "INVALID";
  if (field === "employmentStatus") return "UNEMPLOYED";
  if (field === "repaymentStatus") return "NOT_APPLICABLE";
  if (field === "collateralStatus") return "ACCEPTABLE";
  if (field === "category") return "GENERAL";
  return undefined;
}

function allUniqueConditions(scenario: DmScenario): readonly DmRuleCondition[] {
  const found = new Map<string, DmRuleCondition>();
  for (const item of scenario.baseConditions) found.set(item.field, item);
  for (const rule of scenario.decisionRules) {
    for (const item of rule.conditions) if (!found.has(item.field)) found.set(item.field, item);
  }
  return [...found.values()];
}

function initialPassingProfile(scenario: DmScenario, seed: number, boundary: boolean): Record<string, string | number | undefined> {
  const profile: Record<string, string | number | undefined> = {};
  for (const item of allUniqueConditions(scenario)) {
    const defaultValue = defaultForField(item.field);
    if (defaultValue !== undefined) setField(profile, item.field, defaultValue);
  }
  const byField = new Map<DmField, DmRuleCondition[]>();
  for (const item of scenario.baseConditions) byField.set(item.field, [...(byField.get(item.field) ?? []), item]);
  for (const [field, conditions] of byField) setField(profile, field, satisfyingValue(conditions, scenario, seed + field.length, boundary));
  return profile;
}

function ruleForMode(scenario: DmScenario, mode: DmCandidateMode) {
  if (mode === "BOTH_RELAXATION") return scenario.decisionRules.find((rule) => /BOTH_RELAXATIONS/.test(rule.ruleId));
  if (mode === "AGE_EXCEPTION") return scenario.decisionRules.find((rule) => /AGE_/.test(rule.ruleId));
  if (mode === "MARKS_EXCEPTION") return scenario.decisionRules.find((rule) => /MARKS_/.test(rule.ruleId));
  if (mode === "DOCUMENT_REFERRAL") return scenario.decisionRules.find((rule) => /CERTIFICATE_MISMATCH/.test(rule.ruleId));
  if (mode === "DIRECTOR_REFERRAL") return scenario.decisionRules.find((rule) => /DIRECTOR/.test(rule.ruleId));
  if (mode === "COMMITTEE_REFERRAL") return scenario.decisionRules.find((rule) => /COMMITTEE/.test(rule.ruleId));
  return undefined;
}

export function buildDmCandidate(
  scenario: DmScenario,
  mode: DmCandidateMode,
  seed: number,
  locale: DmLocale,
): DmCandidateProfile {
  const values = initialPassingProfile(scenario, seed, mode === "BOUNDARY_PASS");
  if (mode === "SINGLE_FAIL" || mode === "MULTIPLE_FAIL") {
    const count = mode === "SINGLE_FAIL" ? 1 : Math.min(2, scenario.baseConditions.length);
    const start = seed % scenario.baseConditions.length;
    for (let index = 0; index < count; index += 1) {
      const item = scenario.baseConditions[(start + index) % scenario.baseConditions.length]!;
      if (item.field === "ageAtDate") {
        const target = Number(item.value);
        const failedAge = item.operator === "LTE" ? target + 1 + (seed % 2) : Math.max(0, target - 1 - (seed % 2));
        setField(values, item.field, dateOfBirthForAge(scenario.referenceDate!, failedAge));
      } else {
        setField(values, item.field, valueFailing(item, seed + index, scenario));
      }
    }
  }
  if (mode === "MISSING_REQUIRED") {
    const required = scenario.baseConditions[seed % scenario.baseConditions.length]!;
    delete values[propertyFor(required.field)];
  }
  if (mode === "DETERMINED_REJECT_WITH_MISSING") {
    const failed = scenario.baseConditions[seed % scenario.baseConditions.length]!;
    const missing = scenario.baseConditions[(seed + 1) % scenario.baseConditions.length]!;
    setField(values, failed.field, valueFailing(failed, seed, scenario));
    delete values[propertyFor(missing.field)];
  }
  const specialRule = ruleForMode(scenario, mode);
  if (specialRule) {
    const byField = new Map<DmField, DmRuleCondition[]>();
    for (const item of specialRule.conditions) byField.set(item.field, [...(byField.get(item.field) ?? []), item]);
    for (const [field, conditions] of byField) setField(values, field, satisfyingValue(conditions, scenario, seed + field.length, true));
    if (mode === "DOCUMENT_REFERRAL") setField(values, "certificateStatus", "MISMATCH");
  }
  const name = NAMES[locale][seed % NAMES[locale].length]!;
  values.name = name;
  return Object.freeze(values as DmCandidateProfile);
}

function formatRuleValue(field: DmField, value: number | string, locale: DmLocale): string {
  if (field === "qualificationRank" && typeof value === "number") return QUALIFICATIONS[locale][value] ?? QUALIFICATIONS[locale][5]!;
  const translated = VALUE_LABELS[locale][String(value)];
  if (translated) return translated;
  if (field === "annualIncome" || field === "familyIncome") return "₹" + String(value);
  if (field === "graduationMarks" || field === "writtenScore" || field === "sectionalScore" || field === "interviewScore" || field === "overallScore") return String(value) + "%";
  if (field === "age" || field === "ageAtDate" || field === "experienceYears") {
    if (locale === "en") return String(value) + (value === 1 ? " year" : " years");
    if (locale === "hi") return String(value) + " वर्ष";
    return String(value) + " ਸਾਲ";
  }
  return String(value);
}

export function formatDmRequirement(condition: DmRuleCondition, locale: DmLocale): string {
  const label = FIELD_LABELS[locale][condition.field];
  const target = Array.isArray(condition.value)
    ? condition.value.map((value) => formatRuleValue(condition.field, value, locale)).join(locale === "en" ? " or " : locale === "hi" ? " या " : " ਜਾਂ ")
    : formatRuleValue(condition.field, condition.value as number | string, locale);
  if (condition.operator === "LTE") {
    if (locale === "en") return label + ": at most " + target;
    if (locale === "hi") return label + ": अधिकतम " + target;
    return label + ": ਵੱਧ ਤੋਂ ਵੱਧ " + target;
  }
  if (condition.operator === "GTE") {
    if (condition.field === "qualificationRank") {
      if (locale === "en") return label + ": " + target + " or higher";
      if (locale === "hi") return label + ": " + target + " या उससे अधिक";
      return label + ": " + target + " ਜਾਂ ਇਸ ਤੋਂ ਉੱਚੀ";
    }
    if (locale === "en") return label + ": at least " + target;
    if (locale === "hi") return label + ": कम-से-कम " + target;
    return label + ": ਘੱਟੋ-ਘੱਟ " + target;
  }
  if (condition.operator === "IN") {
    if (locale === "en") return label + ": " + target;
    if (locale === "hi") return label + ": इनमें से एक — " + target;
    return label + ": ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਇੱਕ — " + target;
  }
  if (locale === "en") return label + ": " + target;
  if (locale === "hi") return label + ": " + target + " होना चाहिए";
  return label + ": " + target + " ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ";
}

function formatCandidateValue(field: DmField, candidate: DmCandidateProfile, scenario: DmScenario, locale: DmLocale): string {
  if (field === "ageAtDate") {
    if (!candidate.birthDate) return PROMPTS[locale].missing;
    if (!scenario.referenceDate) return formatDmDate(candidate.birthDate, locale);
    const age = calculateDmAgeOnDate(candidate.birthDate, scenario.referenceDate);
    const ageText = formatRuleValue("ageAtDate", age, locale);
    return locale === "en"
      ? "date of birth " + formatDmDate(candidate.birthDate, locale) + " (age " + ageText + ")"
      : locale === "hi"
        ? "जन्म-तिथि " + formatDmDate(candidate.birthDate, locale) + " (आयु " + ageText + ")"
        : "ਜਨਮ ਮਿਤੀ " + formatDmDate(candidate.birthDate, locale) + " (ਉਮਰ " + ageText + ")";
  }
  const raw = candidate[field as keyof DmCandidateProfile];
  if (raw === undefined) return PROMPTS[locale].missing;
  return formatRuleValue(field, raw as number | string, locale);
}

function localizedPriorityOrder(ranking: DmRankingSpec, locale: DmLocale): string {
  const direction = (value: DmRankingSpec["priorityOrder"][number]["direction"]): string => {
    if (locale === "en") return value === "HIGHER_FIRST" ? "higher first" : "lower first";
    if (locale === "hi") return value === "HIGHER_FIRST" ? "अधिक पहले" : "कम पहले";
    return value === "HIGHER_FIRST" ? "ਵੱਧ ਪਹਿਲਾਂ" : "ਘੱਟ ਪਹਿਲਾਂ";
  };
  const entries = ranking.priorityOrder.map((criterion, index) =>
    String(index + 1) + ". " + FIELD_LABELS[locale][criterion.field as DmField] + " (" + direction(criterion.direction) + ")",
  );
  return entries.join(locale === "en" ? " → " : " → ");
}

function formatRankingCandidate(candidate: DmCandidateProfile, scenario: DmScenario, locale: DmLocale): string {
  const fieldsToShow = new Set<DmField>(scenario.baseConditions.map((condition) => condition.field));
  for (const criterion of scenario.ranking!.priorityOrder) fieldsToShow.add(criterion.field);
  const fields = [...fieldsToShow].map((field) =>
    FIELD_LABELS[locale][field] + ": " + formatCandidateValue(field, candidate, scenario, locale),
  );
  return candidate.name + " — " + fields.join(locale === "en" ? "; " : "। ");
}

function localizedRankingStem(scenario: DmScenario, candidates: readonly DmCandidateProfile[], locale: DmLocale, seed: number): string {
  const ranking = scenario.ranking!;
  const intro = PROMPTS[locale].intro.replaceAll("{context}", scenario.context[locale]);
  const requirements = scenario.baseConditions.map((item, index) => String(index + 1) + ". " + formatDmRequirement(item, locale));
  const orderLabel = locale === "en" ? "Priority order (each item breaks a tie in the previous one)" : locale === "hi" ? "प्राथमिकता क्रम (हर अगली शर्त पिछले बराबर परिणाम का निर्णय करती है)" : "ਤਰਜੀਹ ਦਾ ਕ੍ਰਮ (ਹਰ ਅਗਲੀ ਸ਼ਰਤ ਪਿਛਲੀ ਬਰਾਬਰੀ ਦਾ ਫੈਸਲਾ ਕਰਦੀ ਹੈ)";
  const applicantsLabel = locale === "en" ? "Profiles" : locale === "hi" ? "प्रोफाइल" : "ਪ੍ਰੋਫਾਈਲਾਂ";
  const seatsLabel = locale === "en" ? "Available places or awards" : locale === "hi" ? "उपलब्ध स्थान या पुरस्कार" : "ਉਪਲਬਧ ਥਾਵਾਂ ਜਾਂ ਇਨਾਮ";
  const prompt = RANKING_STEMS[locale][seed % RANKING_STEMS[locale].length]!;
  return [
    intro,
    PROMPTS[locale].conditions + ":",
    ...requirements,
    orderLabel + ":",
    localizedPriorityOrder(ranking, locale),
    applicantsLabel + ":",
    ...candidates.map((candidate, index) => String(index + 1) + ". " + formatRankingCandidate(candidate, scenario, locale)),
    seatsLabel + ": " + String(ranking.seatCount),
    prompt,
  ].join("\n");
}

function rankingOptions(
  scenario: DmScenario,
  candidates: readonly DmCandidateProfile[],
  selected: readonly DmCandidateProfile[],
  locale: DmLocale,
  seed: number,
): { options: readonly string[]; correctIndex: number } {
  const seats = scenario.ranking!.seatCount;
  const combinations: DmCandidateProfile[][] = [];
  const choose = (from: number, picked: DmCandidateProfile[]): void => {
    if (picked.length === seats) { combinations.push([...picked]); return; }
    for (let index = from; index < candidates.length; index += 1) choose(index + 1, [...picked, candidates[index]!]);
  };
  choose(0, []);
  const key = (group: readonly DmCandidateProfile[]) => group.map((candidate) => candidate.name).sort().join("\u0000");
  const correctKey = key(selected);
  const correct = combinations.find((group) => key(group) === correctKey);
  if (!correct) throw new Error("The ranked selection must be present in the candidate option pool.");
  const alternatives = combinations.filter((group) => key(group) !== correctKey);
  const offset = alternatives.length ? seed % alternatives.length : 0;
  const selectedOptions = [selected, ...Array.from({ length: 3 }, (_, index) => alternatives[(offset + index) % alternatives.length]!)];
  const options = selectedOptions.map((group) => group.map((candidate) => candidate.name).join(locale === "en" ? " and " : locale === "hi" ? " और " : " ਅਤੇ "));
  if (options.length !== 4 || new Set(options).size !== 4) throw new Error("DM-010 requires four distinct candidate-set options.");
  const ordered = [...options];
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const swap = hash(String(seed) + ":rank-option:" + String(index)) % (index + 1);
    [ordered[index], ordered[swap]] = [ordered[swap]!, ordered[index]!];
  }
  return Object.freeze({ options: Object.freeze(ordered), correctIndex: ordered.indexOf(options[0]!) });
}

function buildRankingCandidates(scenario: DmScenario, mode: DmCandidateMode, seed: number, locale: DmLocale): readonly DmCandidateProfile[] {
  const qualification = [3, 4, 5, 3, 4];
  const experience = [2, 6, 4, 5, 3];
  const marks = [70, 80, 75, 90, 85];
  const written = [72, 88, 81, 90, 84];
  const interview = [86, 74, 89, 78, 92];
  const overall = [79, 82, 85, 86, 88];
  const ages = [24, 28, 26, 30, 22];
  const failingIndex = seed % 5;
  return Object.freeze(Array.from({ length: 5 }, (_, index) => {
    const applicantMode = index === failingIndex ? mode : "ALL_PASS";
    const candidate = buildDmCandidate(scenario, applicantMode, seed + index * 17, locale);
    return Object.freeze({
      ...candidate,
      name: NAMES[locale][(seed + index) % NAMES[locale].length]!,
      age: ages[index]!,
      qualificationRank: qualification[index]!,
      experienceYears: experience[index]!,
      graduationMarks: marks[index]!,
      writtenScore: written[index]!,
      interviewScore: interview[index]!,
      overallScore: overall[index]!,
      sectionalScore: Math.min(written[index]!, interview[index]!),
      applicationOrder: index + 1,
    });
  }));
}

function buildRankingExplanation(
  scenario: DmScenario,
  cohort: readonly DmCandidateProfile[],
  ranked: ReturnType<typeof rankDmCandidates>,
  locale: DmLocale,
): string {
  const selectedNames = new Set(ranked.selected.map((candidate) => candidate.name));
  const rankingRows = ranked.eligibleRanking.map((entry) => {
    const status = selectedNames.has(entry.candidate.name)
      ? locale === "en" ? "within the allocation limit" : locale === "hi" ? "आवंटन सीमा के भीतर" : "ਵੰਡ ਦੀ ਹੱਦ ਅੰਦਰ"
      : locale === "en" ? "outside the allocation limit" : locale === "hi" ? "आवंटन सीमा के बाहर" : "ਵੰਡ ਦੀ ਹੱਦ ਤੋਂ ਬਾਹਰ";
    return String(entry.rank) + ". " + formatRankingCandidate(entry.candidate, scenario, locale) + " — " + status;
  });
  const excluded = cohort.filter((candidate) => !ranked.eligibleRanking.some((entry) => entry.candidate.name === candidate.name));
  const excludedRows = excluded.map((candidate) => {
    const result = evaluateDmDecision(candidate, scenario);
    return candidate.name + " — " + OUTCOME_LABELS[locale][result.outcome];
  });
  const heading = locale === "en" ? "Ranking using the stated priority order" : locale === "hi" ? "दिए गए प्राथमिकता क्रम से वरीयता" : "ਦਿੱਤੇ ਤਰਜੀਹ ਕ੍ਰਮ ਅਨੁਸਾਰ ਦਰਜਾਬੰਦੀ";
  const eligibleHeading = locale === "en" ? "Eligible ranking" : locale === "hi" ? "पात्रता के बाद वरीयता" : "ਯੋਗਤਾ ਮਗਰੋਂ ਦਰਜਾਬੰਦੀ";
  const excludedHeading = locale === "en" ? "Not eligible" : locale === "hi" ? "अपात्र" : "ਅਯੋਗ";
  const selectedLine = locale === "en"
    ? scenario.ranking!.seatCount === 1
      ? "The highest-ranked eligible profile receives the available place or award."
      : "The first " + scenario.ranking!.seatCount + " eligible profiles receive the available places or awards."
    : locale === "hi"
      ? "पहली " + scenario.ranking!.seatCount + " पात्र प्रोफाइलों को उपलब्ध स्थान या पुरस्कार मिलेंगे।"
      : "ਪਹਿਲੀਆਂ " + scenario.ranking!.seatCount + " ਯੋਗ ਪ੍ਰੋਫਾਈਲਾਂ ਨੂੰ ਉਪਲਬਧ ਥਾਵਾਂ ਜਾਂ ਇਨਾਮ ਮਿਲਣਗੇ।";
  return heading + ": " + localizedPriorityOrder(scenario.ranking!, locale) + "\n\n" + eligibleHeading + ":\n" + rankingRows.join("\n")
    + (excludedRows.length ? "\n\n" + excludedHeading + ":\n" + excludedRows.join("\n") : "") + "\n\n" + selectedLine;
}

function generateRankedQuestion(scenario: DmScenario, locale: DmLocale, seed: number, mode: DmCandidateMode): DmGeneratedQuestion {
  const cohort = buildRankingCandidates(scenario, mode, seed, locale);
  const ranked = rankDmCandidates(cohort, scenario);
  if (ranked.eligibleRanking.length < scenario.ranking!.seatCount) throw new Error("DM-010 must have enough eligible applicants to fill the available seats.");
  const candidate = ranked.selected[0]!;
  const eligibility = evaluateDmDecision(candidate, scenario);
  const options = rankingOptions(scenario, cohort, ranked.selected, locale, seed);
  return Object.freeze({
    chapterId: "DM-001",
    checkpointId: scenario.checkpointId,
    blueprintCheckpointId: scenario.blueprintCheckpointId,
    qlId: scenario.qlId,
    scenarioId: scenario.scenarioId,
    seed,
    locale,
    difficulty: dmDifficultyForMode(scenario.checkpointId, mode),
    candidate,
    candidateGroup: cohort,
    selectedCandidates: Object.freeze(ranked.selected.map((selected) => selected.name)),
    answerMode: "RANKED_CANDIDATE_SET",
    stem: localizedRankingStem(scenario, cohort, locale, seed),
    options: options.options,
    correctIndex: options.correctIndex,
    outcome: "SELECT",
    explanation: buildRankingExplanation(scenario, cohort, ranked, locale),
    explanationRows: Object.freeze(explanationRows(eligibility, candidate, scenario, locale)),
  });
}

function profileFields(scenario: DmScenario): readonly DmField[] {
  const fields = new Set<DmField>();
  for (const item of scenario.baseConditions) fields.add(item.field);
  for (const rule of scenario.decisionRules) for (const item of rule.conditions) fields.add(item.field);
  return [...fields];
}

function formatApplicant(profile: DmCandidateProfile, scenario: DmScenario, locale: DmLocale, includeLabel = true): string {
  const label = PROMPTS[locale].applicant;
  const items = profileFields(scenario).map((field) => FIELD_LABELS[locale][field] + ": " + formatCandidateValue(field, profile, scenario, locale));
  const name = includeLabel ? label + " " + profile.name : profile.name;
  return locale === "en"
    ? name + " — " + items.join("; ") + "."
    : name + " — " + items.join("। ") + "।";
}

function asSentence(value: string, locale: DmLocale): string {
  return value.trim().replace(/[.!?।]+$/u, "") + (locale === "en" ? "." : "।");
}

function localizedStem(scenario: DmScenario, profile: DmCandidateProfile, locale: DmLocale, seed: number): string {
  const prompt = PROMPTS[locale];
  const intro = prompt.intro.replaceAll("{context}", scenario.context[locale]);
  const conditions = scenario.baseConditions.map((item, index) => String(index + 1) + ". " + formatDmRequirement(item, locale));
  const lines = [intro, prompt.conditions + ":", ...conditions];
  if (scenario.referenceDate) {
    const date = formatDmDate(scenario.referenceDate, locale);
    lines.push(locale === "en" ? "Age is counted as on " + date + "." : locale === "hi" ? "आयु की गणना " + date + " तक की जाएगी।" : "ਉਮਰ ਦੀ ਗਿਣਤੀ " + date + " ਤੱਕ ਕੀਤੀ ਜਾਵੇਗੀ।");
  }
  if (scenario.ruleNotes.length > 0) {
    lines.push(prompt.additional + ":");
    for (const note of scenario.ruleNotes) lines.push("• " + asSentence(note[locale], locale));
  }
  lines.push(formatApplicant(profile, scenario, locale));
  lines.push(STEMS[locale][seed % STEMS[locale].length]!.replaceAll("{name}", profile.name));
  return lines.join("\n");
}

function statusLabel(status: DmConditionCheck["status"], locale: DmLocale): string {
  const prompt = PROMPTS[locale];
  if (status === "PASS") return prompt.pass;
  if (status === "FAIL") return prompt.fail;
  return prompt.unknown;
}

function explanationRows(result: DmDecisionResult, candidate: DmCandidateProfile, scenario: DmScenario, locale: DmLocale) {
  return result.checks.map((check) => Object.freeze({
    condition: FIELD_LABELS[locale][check.condition.field],
    candidateValue: formatCandidateValue(check.condition.field, candidate, scenario, locale),
    requirement: formatDmRequirement(check.condition, locale),
    result: check.status,
  }));
}

function buildExplanation(result: DmDecisionResult, candidate: DmCandidateProfile, scenario: DmScenario, locale: DmLocale): string {
  const prompt = PROMPTS[locale];
  const rows = result.checks.map((check) => {
    const observed = formatCandidateValue(check.condition.field, candidate, scenario, locale);
    const requirement = formatDmRequirement(check.condition, locale).replace(/^[^:]+:\s*/, "");
    const separator = locale === "en" ? "; required: " : locale === "hi" ? "; अपेक्षित: " : "; ਲੋੜ: ";
    const punctuation = locale === "en" ? "." : "।";
    return "• " + FIELD_LABELS[locale][check.condition.field] + ": " + observed + separator + requirement + " — " + statusLabel(check.status, locale) + punctuation;
  });
  const matchedRule = result.matchedRuleId ? scenario.decisionRules.find((rule) => rule.ruleId === result.matchedRuleId) : undefined;
  const ruleLine = asSentence(matchedRule ? matchedRule.explanation[locale] : CONCLUSIONS[locale][result.outcome], locale);
  const finalPunctuation = locale === "en" ? "." : "।";
  return prompt.conditions + ":\n" + rows.join("\n") + "\n\n" + prompt.result + ": " + OUTCOME_LABELS[locale][result.outcome] + finalPunctuation + "\n" + ruleLine;
}

const SET_QUESTIONS: Readonly<Record<DmLocale, Readonly<Record<DmSetQuestionKind, string>>>> = Object.freeze({
  en: { COUNT_SELECTED: "how many profiles qualify?", IDENTIFY_REJECTED: "which profile must be rejected?", IDENTIFY_REFERRED: "which case must be referred to the designated authority?", SAME_DECISION_PAIR: "which pair receives the same decision?", SATISFIES_ALL: "which profile satisfies every ordinary condition?", INFORMATION_REQUIRED: "for which case is additional information required?" },
  hi: { COUNT_SELECTED: "कितनी प्रोफाइल पात्र हैं?", IDENTIFY_REJECTED: "कौन-सी प्रोफाइल अस्वीकार की जानी चाहिए?", IDENTIFY_REFERRED: "कौन-सा मामला नामित प्राधिकारी को भेजना होगा?", SAME_DECISION_PAIR: "किस जोड़ी को समान निर्णय मिलता है?", SATISFIES_ALL: "कौन-सी प्रोफाइल सभी सामान्य शर्तें पूरी करती है?", INFORMATION_REQUIRED: "किस मामले के लिए अतिरिक्त जानकारी आवश्यक है?" },
  pa: { COUNT_SELECTED: "ਕਿੰਨੀਆਂ ਪ੍ਰੋਫਾਈਲਾਂ ਯੋਗ ਹਨ?", IDENTIFY_REJECTED: "ਕਿਹੜੀ ਪ੍ਰੋਫਾਈਲ ਰੱਦ ਕੀਤੀ ਜਾਣੀ ਚਾਹੀਦੀ ਹੈ?", IDENTIFY_REFERRED: "ਕਿਹੜਾ ਮਾਮਲਾ ਨਾਮਜ਼ਦ ਅਧਿਕਾਰੀ ਕੋਲ ਭੇਜਣਾ ਲਾਜ਼ਮੀ ਹੈ?", SAME_DECISION_PAIR: "ਕਿਹੜੀ ਜੋੜੀ ਨੂੰ ਇੱਕੋ ਫੈਸਲਾ ਮਿਲਦਾ ਹੈ?", SATISFIES_ALL: "ਕਿਹੜੀ ਪ੍ਰੋਫਾਈਲ ਸਾਰੀਆਂ ਆਮ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦੀ ਹੈ?", INFORMATION_REQUIRED: "ਕਿਹੜੇ ਮਾਮਲੇ ਲਈ ਹੋਰ ਜਾਣਕਾਰੀ ਲੋੜੀਂਦੀ ਹੈ?" },
});

const SET_STEM_WRAPPERS: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: ["According to the stated conditions, {q}", "After applying every rule, {q}", "On checking all the profiles, {q}", "Under the common rule block, {q}", "Which option correctly states {q}", "Based only on the information given, {q}", "After considering the applicable exception, {q}", "What follows from the rule-wise scrutiny: {q}", "Using the published conditions, {q}", "When each profile is decided independently, {q}", "After checking ordinary rules before exceptions, {q}", "Under the stated decision procedure, {q}", "From the complete set, {q}", "On a condition-by-condition check, {q}", "After resolving the referral rules in order, {q}", "Considering this group of profiles, {q}", "Which conclusion follows from the shared notice: {q}", "Applying the rules without adding assumptions, {q}"],
  hi: ["दी गई शर्तों के अनुसार, {q}", "हर नियम लागू करने के बाद, {q}", "सभी प्रोफाइल जाँचने पर, {q}", "समान नियम-खंड के तहत, {q}", "कौन-सा विकल्प सही बताता है कि {q}", "केवल दी गई जानकारी के आधार पर, {q}", "लागू अपवाद पर विचार करने के बाद, {q}", "नियमवार जाँच से क्या निकलता है: {q}", "प्रकाशित शर्तों का उपयोग करते हुए, {q}", "हर प्रोफाइल का स्वतंत्र निर्णय करने पर, {q}", "अपवाद से पहले सामान्य नियम जाँचने के बाद, {q}", "दी गई निर्णय प्रक्रिया के तहत, {q}", "पूर्ण सेट के आधार पर, {q}", "हर शर्त की जाँच करने पर, {q}", "प्रेषण नियमों को क्रम से लागू करने के बाद, {q}", "इस आवेदक समूह के लिए, {q}", "समान सूचना से कौन-सा निष्कर्ष निकलता है: {q}", "बिना कोई अनुमान जोड़े नियम लागू करने पर, {q}"],
  pa: ["ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ, {q}", "ਹਰ ਨਿਯਮ ਲਾਗੂ ਕਰਨ ਮਗਰੋਂ, {q}", "ਸਾਰੀਆਂ ਪ੍ਰੋਫਾਈਲਾਂ ਜਾਂਚਣ ਤੇ, {q}", "ਸਾਂਝੇ ਨਿਯਮ-ਖੰਡ ਹੇਠ, {q}", "ਕਿਹੜਾ ਵਿਕਲਪ ਠੀਕ ਦੱਸਦਾ ਹੈ ਕਿ {q}", "ਸਿਰਫ਼ ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਦੇ ਆਧਾਰ ਤੇ, {q}", "ਲਾਗੂ ਅਪਵਾਦ ਵੇਖਣ ਮਗਰੋਂ, {q}", "ਨਿਯਮਵਾਰ ਜਾਂਚ ਤੋਂ ਕੀ ਨਿਕਲਦਾ ਹੈ: {q}", "ਜਾਰੀ ਸ਼ਰਤਾਂ ਦੀ ਵਰਤੋਂ ਕਰਦਿਆਂ, {q}", "ਹਰ ਪ੍ਰੋਫਾਈਲ ਦਾ ਸੁਤੰਤਰ ਫੈਸਲਾ ਕਰਨ ਤੇ, {q}", "ਅਪਵਾਦ ਤੋਂ ਪਹਿਲਾਂ ਆਮ ਨਿਯਮ ਜਾਂਚਣ ਮਗਰੋਂ, {q}", "ਦਿੱਤੀ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਹੇਠ, {q}", "ਪੂਰੇ ਸੈੱਟ ਦੇ ਆਧਾਰ ਤੇ, {q}", "ਹਰ ਸ਼ਰਤ ਦੀ ਜਾਂਚ ਕਰਨ ਤੇ, {q}", "ਰੈਫਰਲ ਨਿਯਮ ਕ੍ਰਮ ਨਾਲ ਲਾਗੂ ਕਰਨ ਮਗਰੋਂ, {q}", "ਇਸ ਬਿਨੈਕਾਰ ਸਮੂਹ ਲਈ, {q}", "ਸਾਂਝੀ ਸੂਚਨਾ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ: {q}", "ਬਿਨਾਂ ਕੋਈ ਅਨੁਮਾਨ ਜੋੜੇ ਨਿਯਮ ਲਾਗੂ ਕਰਨ ਤੇ, {q}"],
});

function setProfileModes(scenario: DmScenario, kind: DmSetQuestionKind, count: number, seed: number): DmCandidateMode[] {
  const referral = scenario.setSpec!.referralModes[seed % scenario.setSpec!.referralModes.length] ?? "DOCUMENT_REFERRAL";
  const plans: Record<DmSetQuestionKind, DmCandidateMode[]> = {
    COUNT_SELECTED: ["ALL_PASS", "BOUNDARY_PASS", "SINGLE_FAIL", "MISSING_REQUIRED", referral, "MULTIPLE_FAIL"],
    IDENTIFY_REJECTED: ["ALL_PASS", "BOUNDARY_PASS", "SINGLE_FAIL", "MISSING_REQUIRED", referral, "MISSING_REQUIRED"],
    IDENTIFY_REFERRED: ["ALL_PASS", "BOUNDARY_PASS", referral, "SINGLE_FAIL", "MISSING_REQUIRED", "MULTIPLE_FAIL"],
    SAME_DECISION_PAIR: ["ALL_PASS", "BOUNDARY_PASS", "SINGLE_FAIL", "MISSING_REQUIRED", referral],
    SATISFIES_ALL: ["ALL_PASS", "SINGLE_FAIL", "MISSING_REQUIRED", referral, "MULTIPLE_FAIL", "MISSING_REQUIRED"],
    INFORMATION_REQUIRED: ["ALL_PASS", "SINGLE_FAIL", "MISSING_REQUIRED", referral, "BOUNDARY_PASS", "MULTIPLE_FAIL"],
  };
  return plans[kind].slice(0, count);
}

function setAnswer(kind: DmSetQuestionKind, cohort: readonly DmCandidateProfile[], results: readonly DmDecisionResult[], locale: DmLocale): { label: string; names: readonly string[] } {
  const indices = (outcome: DmOutcome) => results.map((result, index) => result.outcome === outcome ? index : -1).filter((index) => index >= 0);
  if (kind === "COUNT_SELECTED") return { label: String(indices("SELECT").length), names: indices("SELECT").map((index) => cohort[index]!.name) };
  if (kind === "IDENTIFY_REJECTED") { const found = indices("REJECT"); if (found.length !== 1) throw new Error("Decision set must contain exactly one rejected profile."); return { label: cohort[found[0]!]!.name, names: [cohort[found[0]!]!.name] }; }
  if (kind === "IDENTIFY_REFERRED") {
    const found = results.map((result, index) => result.outcome.startsWith("REFER_") ? index : -1).filter((index) => index >= 0);
    if (found.length !== 1) throw new Error("Decision set must contain exactly one referred profile.");
    return { label: cohort[found[0]!]!.name, names: [cohort[found[0]!]!.name] };
  }
  if (kind === "INFORMATION_REQUIRED") { const found = indices("INFORMATION_REQUIRED"); if (found.length !== 1) throw new Error("Decision set must contain exactly one unresolved profile."); return { label: cohort[found[0]!]!.name, names: [cohort[found[0]!]!.name] }; }
  if (kind === "SATISFIES_ALL") { const found = indices("SELECT"); if (found.length !== 1) throw new Error("Decision set must contain exactly one ordinary selection."); return { label: cohort[found[0]!]!.name, names: [cohort[found[0]!]!.name] }; }
  const groups = new Map<DmOutcome, number[]>();
  results.forEach((result, index) => groups.set(result.outcome, [...(groups.get(result.outcome) ?? []), index]));
  const pair = [...groups.values()].find((group) => group.length === 2);
  if (!pair || [...groups.values()].filter((group) => group.length === 2).length !== 1) throw new Error("Decision set must contain one unique same-decision pair.");
  const names = pair.map((index) => cohort[index]!.name);
  return { label: names.join(locale === "en" ? " and " : locale === "hi" ? " और " : " ਅਤੇ "), names };
}

function setOptions(kind: DmSetQuestionKind, answer: string, cohort: readonly DmCandidateProfile[], locale: DmLocale, seed: number): { options: readonly string[]; correctIndex: number } {
  let alternatives: string[];
  if (kind === "COUNT_SELECTED") alternatives = Array.from({ length: cohort.length + 1 }, (_, index) => String(index)).filter((value) => value !== answer);
  else if (kind === "SAME_DECISION_PAIR") {
    alternatives = [];
    for (let left = 0; left < cohort.length; left += 1) for (let right = left + 1; right < cohort.length; right += 1) {
      const label = [cohort[left]!.name, cohort[right]!.name].join(locale === "en" ? " and " : locale === "hi" ? " और " : " ਅਤੇ ");
      if (label !== answer) alternatives.push(label);
    }
  } else alternatives = cohort.map((candidate) => candidate.name).filter((name) => name !== answer);
  const offset = seed % alternatives.length;
  const options = [answer, ...Array.from({ length: 3 }, (_, index) => alternatives[(offset + index) % alternatives.length]!)];
  if (new Set(options).size !== 4) throw new Error("Decision-set options must be distinct.");
  for (let index = options.length - 1; index > 0; index -= 1) {
    const swap = hash(String(seed) + ":set-option:" + String(index)) % (index + 1);
    [options[index], options[swap]] = [options[swap]!, options[index]!];
  }
  return { options: Object.freeze(options), correctIndex: options.indexOf(answer) };
}

function buildSetCohort(scenario: DmScenario, locale: DmLocale, seed: number, modes: readonly DmCandidateMode[]): readonly DmCandidateProfile[] {
  return Object.freeze(modes.map((profileMode, index) => {
    const built = buildDmCandidate(scenario, profileMode, seed + index * 19, locale);
    return Object.freeze({
      ...built,
      ...(profileMode === "SINGLE_FAIL" || profileMode === "MULTIPLE_FAIL" ? { registrationStatus: "INVALID" } : {}),
      name: NAMES[locale][(seed + index) % NAMES[locale].length]!,
    });
  }));
}

function sharedSetStimulus(scenario: DmScenario, cohort: readonly DmCandidateProfile[], locale: DmLocale): string {
  const intro = locale === "en"
      ? "The following case concerns " + scenario.context.en.toLowerCase() + ". Study the eligibility conditions and profile details, then answer the questions that follow."
    : locale === "hi"
      ? "नीचे दिया गया मामला " + scenario.context.hi + " से संबंधित है। पात्रता शर्तों और आवेदकों के विवरण का अध्ययन करके आगे दिए गए प्रश्नों के उत्तर दीजिए।"
      : "ਹੇਠਾਂ ਦਿੱਤਾ ਮਾਮਲਾ " + scenario.context.pa + " ਨਾਲ ਸੰਬੰਧਿਤ ਹੈ। ਯੋਗਤਾ ਸ਼ਰਤਾਂ ਅਤੇ ਬਿਨੈਕਾਰਾਂ ਦੇ ਵੇਰਵੇ ਪੜ੍ਹ ਕੇ ਅਗਲੇ ਪ੍ਰਸ਼ਨਾਂ ਦੇ ਉੱਤਰ ਦਿਓ।";
  const ruleLines = scenario.baseConditions.map((item, index) => String(index + 1) + ". " + formatDmRequirement(item, locale));
  const additional = scenario.ruleNotes.length ? [PROMPTS[locale].additional + ":", ...scenario.ruleNotes.map((note) => "• " + asSentence(note[locale], locale))] : [];
  const applicants = locale === "en" ? "Profiles" : locale === "hi" ? "प्रोफाइल" : "ਪ੍ਰੋਫਾਈਲਾਂ";
  return [intro, PROMPTS[locale].conditions + ":", ...ruleLines, ...additional, applicants + ":", ...cohort.map((candidate, index) => String(index + 1) + ". " + formatApplicant(candidate, scenario, locale, false))].join("\n");
}

function generateSetQuestionFromCohort(
  scenario: DmScenario,
  locale: DmLocale,
  seed: number,
  mode: DmCandidateMode,
  kind: DmSetQuestionKind,
  questionNumber: number,
  cohort: readonly DmCandidateProfile[],
  sharedStimulus: string,
  setId?: string,
): DmGeneratedQuestion {
  const spec = scenario.setSpec!;
  const requestedDifficulty = dmDifficultyForMode(scenario.checkpointId, mode);
  const results = cohort.map((candidate) => evaluateDmDecision(candidate, scenario));
  const answer = setAnswer(kind, cohort, results, locale);
  const options = setOptions(kind, answer.label, cohort, locale, seed + questionNumber * 101);
  const question = SET_QUESTIONS[locale][kind];
  const prompt = SET_STEM_WRAPPERS[locale][(seed + questionNumber - 1) % SET_STEM_WRAPPERS[locale].length]!.replace("{q}", question);
  const stem = sharedStimulus + "\n" + prompt;
  const resultRows = cohort.map((candidate, index) => candidate.name + " — " + OUTCOME_LABELS[locale][results[index]!.outcome]);
  const finalPunctuation = locale === "en" ? "." : "।";
  const explanation = (locale === "en" ? "Each profile is decided independently" : locale === "hi" ? "हर प्रोफाइल का स्वतंत्र निर्णय" : "ਹਰ ਪ੍ਰੋਫਾਈਲ ਦਾ ਸੁਤੰਤਰ ਫੈਸਲਾ") + ":\n" + resultRows.join("\n") + "\n\n" + (locale === "en" ? "Therefore: " : locale === "hi" ? "अतः " : "ਇਸ ਲਈ ") + answer.label + finalPunctuation;
  const rows = results.flatMap((result, index) => result.checks.map((check) => Object.freeze({
    condition: cohort[index]!.name + " — " + FIELD_LABELS[locale][check.condition.field],
    candidateValue: formatCandidateValue(check.condition.field, cohort[index]!, scenario, locale),
    requirement: formatDmRequirement(check.condition, locale), result: check.status,
  })));
  return Object.freeze({
    chapterId: "DM-001", checkpointId: scenario.checkpointId, blueprintCheckpointId: scenario.blueprintCheckpointId,
    qlId: scenario.qlId, scenarioId: scenario.scenarioId, seed, locale, difficulty: requestedDifficulty,
    candidate: cohort[0]!, candidateGroup: cohort, selectedCandidates: Object.freeze(answer.names),
    answerMode: spec.setFamily === "MIXED_ADVANCED" ? "MIXED_DECISION_SET" : "MULTI_PERSON_DECISION_SET",
    setQuestionKind: kind, setQuestionNumber: questionNumber, ...(setId ? { setId, setSize: spec.questionKinds.length } : {}),
    stem, options: options.options, correctIndex: options.correctIndex,
    outcome: "SET_RESULT", explanation, explanationRows: Object.freeze(rows),
  });
}

function generateSetQuestion(scenario: DmScenario, locale: DmLocale, seed: number, mode: DmCandidateMode): DmGeneratedQuestion {
  const spec = scenario.setSpec!;
  const kindIndex = seed % spec.questionKinds.length;
  const kind = spec.questionKinds[kindIndex]!;
  const requestedDifficulty = dmDifficultyForMode(scenario.checkpointId, mode);
  const count = kind === "SAME_DECISION_PAIR" ? 5 : requestedDifficulty === "EASY" ? spec.minimumProfiles : requestedDifficulty === "HARD" ? spec.maximumProfiles : 5;
  const cohort = buildSetCohort(scenario, locale, seed, setProfileModes(scenario, kind, count, seed));
  return generateSetQuestionFromCohort(scenario, locale, seed, mode, kind, kindIndex + 1, cohort, sharedSetStimulus(scenario, cohort, locale));
}

export function generateDm020QuestionSet(input: {
  scenario: DmScenario;
  locale: DmLocale;
  seed: number;
  mode: DmCandidateMode;
}): import("./types.ts").DmGeneratedQuestionSet {
  const { scenario, locale, seed, mode } = input;
  if (scenario.checkpointId !== "DM-CP-020" || scenario.setSpec?.setFamily !== "MIXED_ADVANCED") {
    throw new Error("A cohesive DM-020 set requires a DM-CP-020 mixed-set scenario.");
  }
  const referralMode = scenario.setSpec.referralModes[seed % scenario.setSpec.referralModes.length]!;
  const cohort = buildSetCohort(scenario, locale, seed, ["ALL_PASS", "BOUNDARY_PASS", "SINGLE_FAIL", referralMode, "MISSING_REQUIRED"]);
  const stimulus = sharedSetStimulus(scenario, cohort, locale);
  const setId = scenario.scenarioId + ":SET:" + String(seed) + ":" + locale;
  const questions = Object.freeze(scenario.setSpec.questionKinds.map((kind, index) =>
    generateSetQuestionFromCohort(scenario, locale, seed, mode, kind, index + 1, cohort, stimulus, setId),
  ));
  return Object.freeze({
    setId,
    chapterId: "DM-001",
    checkpointId: "DM-CP-020",
    blueprintCheckpointId: "DM-020",
    qlId: scenario.qlId,
    scenarioId: scenario.scenarioId,
    seed,
    locale,
    difficulty: dmDifficultyForMode(scenario.checkpointId, mode),
    sharedStimulus: stimulus,
    candidateGroup: cohort,
    questions,
  });
}

function distractors(correct: DmOutcome): readonly DmOutcome[] {
  const preferred: Readonly<Record<DmOutcome, readonly DmOutcome[]>> = {
    SELECT: ["REJECT", "INFORMATION_REQUIRED", "REFER_TO_MANAGER"],
    REJECT: ["SELECT", "INFORMATION_REQUIRED", "REFER_TO_MANAGER"],
    REFER_TO_MANAGER: ["SELECT", "REJECT", "INFORMATION_REQUIRED"],
    REFER_TO_DIRECTOR: ["SELECT", "REJECT", "REFER_TO_MANAGER"],
    REFER_TO_COMMITTEE: ["SELECT", "REJECT", "REFER_TO_MANAGER"],
    INFORMATION_REQUIRED: ["SELECT", "REJECT", "REFER_TO_MANAGER"],
    TAKE_ACTION: ["SELECT", "REJECT", "INFORMATION_REQUIRED"],
    SET_RESULT: ["SELECT", "REJECT", "INFORMATION_REQUIRED"],
  };
  return preferred[correct];
}

function orderedOptions(correct: DmOutcome, locale: DmLocale, seed: number): { options: readonly string[]; correctIndex: number } {
  const keys: DmOutcome[] = [correct, ...distractors(correct)];
  for (let index = keys.length - 1; index > 0; index -= 1) {
    const swap = hash(String(seed) + ":option:" + String(index)) % (index + 1);
    const current = keys[index]!;
    keys[index] = keys[swap]!;
    keys[swap] = current;
  }
  const options = keys.map((key) => OUTCOME_LABELS[locale][key]);
  if (new Set(options).size !== 4) throw new Error("DM-001 option labels must be unique in every supported locale.");
  return Object.freeze({ options: Object.freeze(options), correctIndex: keys.indexOf(correct) });
}

const PRINCIPLE_LABELS = Object.freeze({
  en: { VERIFY_FACTS: "verify the relevant facts before acting", FOLLOW_PROCEDURE: "follow the prescribed procedure", ESCALATE_AUTHORIZED: "escalate only to the competent authority", DOCUMENT_ACTION: "keep an auditable record", PROTECT_CONFIDENTIALITY: "protect confidential information", PRIORITIZE_URGENCY: "give verified emergencies first priority", PRIORITIZE_DEADLINE: "give time-bound work priority over routine work", SERVE_FAIRLY: "apply a transparent and equal service rule" },
  hi: { VERIFY_FACTS: "कार्रवाई से पहले संबंधित तथ्यों का सत्यापन", FOLLOW_PROCEDURE: "निर्धारित प्रक्रिया का पालन", ESCALATE_AUTHORIZED: "केवल सक्षम प्राधिकारी को मामला भेजना", DOCUMENT_ACTION: "जाँच योग्य अभिलेख रखना", PROTECT_CONFIDENTIALITY: "गोपनीय जानकारी की रक्षा", PRIORITIZE_URGENCY: "सत्यापित आपात मामलों को पहली प्राथमिकता", PRIORITIZE_DEADLINE: "नियमित कार्य से पहले समयबद्ध कार्य", SERVE_FAIRLY: "पारदर्शी और समान सेवा नियम" },
  pa: { VERIFY_FACTS: "ਕਾਰਵਾਈ ਤੋਂ ਪਹਿਲਾਂ ਸੰਬੰਧਤ ਤੱਥਾਂ ਦੀ ਤਸਦੀਕ", FOLLOW_PROCEDURE: "ਨਿਰਧਾਰਤ ਪ੍ਰਕਿਰਿਆ ਦੀ ਪਾਲਣਾ", ESCALATE_AUTHORIZED: "ਸਿਰਫ਼ ਸਮਰੱਥ ਅਧਿਕਾਰੀ ਕੋਲ ਮਾਮਲਾ ਭੇਜਣਾ", DOCUMENT_ACTION: "ਜਾਂਚਯੋਗ ਰਿਕਾਰਡ ਰੱਖਣਾ", PROTECT_CONFIDENTIALITY: "ਗੁਪਤ ਜਾਣਕਾਰੀ ਦੀ ਰੱਖਿਆ", PRIORITIZE_URGENCY: "ਤਸਦੀਕਸ਼ੁਦਾ ਐਮਰਜੈਂਸੀ ਨੂੰ ਪਹਿਲੀ ਤਰਜੀਹ", PRIORITIZE_DEADLINE: "ਰੁਟੀਨੀ ਕੰਮ ਤੋਂ ਪਹਿਲਾਂ ਮਿਆਦਬੱਧ ਕੰਮ", SERVE_FAIRLY: "ਪਾਰਦਰਸ਼ੀ ਅਤੇ ਇੱਕਸਾਰ ਸੇਵਾ ਨਿਯਮ" },
} as const);

const WHY_FIRST = Object.freeze({
  en: {
    VERIFY_FACTS: "the disputed fact must be checked against the authoritative record before any final decision",
    FOLLOW_PROCEDURE: "the prescribed route provides the authorized remedy and should be used before escalation or rejection",
    ESCALATE_AUTHORIZED: "the designated authority must resolve the issue after the relevant record is placed before it",
    DOCUMENT_ACTION: "the action, reason and responsible officer must remain traceable in the official record",
    PROTECT_CONFIDENTIALITY: "identity and authorization must be verified before any protected information is disclosed",
    PRIORITIZE_URGENCY: "a verified emergency takes precedence over deadline-bound and routine work",
    PRIORITIZE_DEADLINE: "the time-bound task must be secured before resources return to routine work",
    SERVE_FAIRLY: "the same published and transparent rule must be applied to every comparable case",
  },
  hi: {
    VERIFY_FACTS: "अंतिम निर्णय से पहले विवादित तथ्य का सत्यापन प्रामाणिक अभिलेख से करना आवश्यक है",
    FOLLOW_PROCEDURE: "निर्धारित प्रक्रिया अधिकृत समाधान देती है और प्रेषण या अस्वीकृति से पहले उसी का पालन होना चाहिए",
    ESCALATE_AUTHORIZED: "संबंधित अभिलेख प्रस्तुत करने के बाद नामित प्राधिकारी को ही मामले का समाधान करना है",
    DOCUMENT_ACTION: "कार्रवाई, कारण और जिम्मेदार अधिकारी का विवरण आधिकारिक अभिलेख में जाँच योग्य रहना चाहिए",
    PROTECT_CONFIDENTIALITY: "संरक्षित जानकारी देने से पहले पहचान और प्राधिकरण का सत्यापन आवश्यक है",
    PRIORITIZE_URGENCY: "सत्यापित आपात स्थिति को समयबद्ध और सामान्य कार्य से पहले लिया जाता है",
    PRIORITIZE_DEADLINE: "सामान्य कार्य पर लौटने से पहले समयबद्ध कार्य पूरा करने की व्यवस्था आवश्यक है",
    SERVE_FAIRLY: "समान मामलों पर एक ही प्रकाशित और पारदर्शी नियम लागू होना चाहिए",
  },
  pa: {
    VERIFY_FACTS: "ਅੰਤਿਮ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਵਿਵਾਦਿਤ ਤੱਥ ਨੂੰ ਅਧਿਕਾਰਤ ਰਿਕਾਰਡ ਨਾਲ ਮਿਲਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ",
    FOLLOW_PROCEDURE: "ਨਿਰਧਾਰਤ ਪ੍ਰਕਿਰਿਆ ਅਧਿਕਾਰਤ ਹੱਲ ਦਿੰਦੀ ਹੈ ਅਤੇ ਰੈਫਰਲ ਜਾਂ ਰੱਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇਸਦੀ ਪਾਲਣਾ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ",
    ESCALATE_AUTHORIZED: "ਸੰਬੰਧਤ ਰਿਕਾਰਡ ਪੇਸ਼ ਕਰਨ ਤੋਂ ਬਾਅਦ ਨਾਮਜ਼ਦ ਅਧਿਕਾਰੀ ਨੂੰ ਹੀ ਮਾਮਲਾ ਸੁਲਝਾਉਣਾ ਚਾਹੀਦਾ ਹੈ",
    DOCUMENT_ACTION: "ਕਾਰਵਾਈ, ਕਾਰਨ ਅਤੇ ਜ਼ਿੰਮੇਵਾਰ ਅਧਿਕਾਰੀ ਦਾ ਵੇਰਵਾ ਸਰਕਾਰੀ ਰਿਕਾਰਡ ਵਿੱਚ ਜਾਂਚਯੋਗ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ",
    PROTECT_CONFIDENTIALITY: "ਸੁਰੱਖਿਅਤ ਜਾਣਕਾਰੀ ਦੇਣ ਤੋਂ ਪਹਿਲਾਂ ਪਛਾਣ ਅਤੇ ਅਧਿਕਾਰ ਦੀ ਤਸਦੀਕ ਲਾਜ਼ਮੀ ਹੈ",
    PRIORITIZE_URGENCY: "ਤਸਦੀਕਸ਼ੁਦਾ ਐਮਰਜੈਂਸੀ ਨੂੰ ਮਿਆਦ ਵਾਲੇ ਅਤੇ ਆਮ ਕੰਮ ਤੋਂ ਪਹਿਲਾਂ ਤਰਜੀਹ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ",
    PRIORITIZE_DEADLINE: "ਆਮ ਕੰਮ ਵੱਲ ਮੁੜਨ ਤੋਂ ਪਹਿਲਾਂ ਮਿਆਦ ਵਾਲਾ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਪ੍ਰਬੰਧ ਲਾਜ਼ਮੀ ਹੈ",
    SERVE_FAIRLY: "ਇੱਕੋ ਜਿਹੇ ਮਾਮਲਿਆਂ ਉੱਤੇ ਇੱਕੋ ਪ੍ਰਕਾਸ਼ਿਤ ਅਤੇ ਪਾਰਦਰਸ਼ੀ ਨਿਯਮ ਲਾਗੂ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ",
  },
} as const);

function generateSituationalQuestion(scenario: DmScenario, locale: DmLocale, seed: number, mode: DmCandidateMode): DmGeneratedQuestion {
  const spec = scenario.situational!;
  const decision = solveDmSituation(spec);
  const choices = [...spec.choices];
  for (let index = choices.length - 1; index > 0; index -= 1) {
    const swap = hash(scenario.scenarioId + ":situational:" + String(seed) + ":" + String(index)) % (index + 1);
    [choices[index], choices[swap]] = [choices[swap]!, choices[index]!];
  }
  const correctIndex = choices.findIndex((choice) => choice.choiceId === decision.choice.choiceId);
  const stem = spec.situation[locale] + "\n" + SITUATIONAL_STEMS[locale][seed % SITUATIONAL_STEMS[locale].length]!;
  const principle = PRINCIPLE_LABELS[locale][decision.choice.principle];
  const whyFirst = WHY_FIRST[locale][decision.choice.principle];
  const explanation = locale === "en"
    ? "Situation: " + spec.situation.en + "\nRelevant principle: " + principle + ".\nWhy this comes first: " + whyFirst + ".\nConclusion: " + decision.choice.text.en
    : locale === "hi"
      ? "स्थिति: " + spec.situation.hi + "\nसंबंधित सिद्धांत: " + principle + "।\nयह पहले क्यों: " + whyFirst + "।\nनिष्कर्ष: " + decision.choice.text.hi
      : "ਸਥਿਤੀ: " + spec.situation.pa + "\nਸੰਬੰਧਤ ਸਿਧਾਂਤ: " + principle + "।\nਇਹ ਪਹਿਲਾਂ ਕਿਉਂ: " + whyFirst + "।\nਨਤੀਜਾ: " + decision.choice.text.pa;
  return Object.freeze({
    chapterId: "DM-001", checkpointId: scenario.checkpointId, blueprintCheckpointId: scenario.blueprintCheckpointId,
    qlId: scenario.qlId, scenarioId: scenario.scenarioId, seed, locale,
    difficulty: dmDifficultyForMode(scenario.checkpointId, mode), candidate: Object.freeze({ name: "Administrative case" }),
    answerMode: "SITUATIONAL_ACTION", stem, options: Object.freeze(choices.map((choice) => choice.text[locale])),
    correctIndex, outcome: "TAKE_ACTION", explanation, explanationRows: Object.freeze([]),
  });
}

export function dmDifficultyForMode(checkpointId: DmScenario["checkpointId"], mode: DmCandidateMode): DmDifficulty {
  if (mode === "ALL_PASS" || mode === "BOUNDARY_PASS") return "EASY";
  if (mode === "SINGLE_FAIL" || mode === "MISSING_REQUIRED" || mode === "DOCUMENT_REFERRAL") return "MEDIUM";
  if (checkpointId === "DM-CP-003" && (mode === "AGE_EXCEPTION" || mode === "MARKS_EXCEPTION")) return "HARD";
  if (checkpointId === "DM-CP-009" && (mode === "AGE_EXCEPTION" || mode === "MARKS_EXCEPTION" || mode === "BOTH_RELAXATION")) return "HARD";
  if (checkpointId === "DM-CP-004" && (mode === "DIRECTOR_REFERRAL" || mode === "COMMITTEE_REFERRAL")) return "HARD";
  if (mode === "DETERMINED_REJECT_WITH_MISSING") return "HARD";
  return "HARD";
}

export function modesForDmDifficulty(
  scenario: DmScenario,
  difficulty: DmDifficulty,
  seed: number,
): DmCandidateMode {
  if (difficulty === "EASY") return seed % 2 === 0 ? "ALL_PASS" : "BOUNDARY_PASS";
  if (difficulty === "MEDIUM") {
    if (scenario.checkpointId === "DM-CP-004") {
      return seed % 3 === 0 ? "DOCUMENT_REFERRAL" : seed % 3 === 1 ? "MISSING_REQUIRED" : "SINGLE_FAIL";
    }
    return seed % 4 === 0 ? "MISSING_REQUIRED" : "SINGLE_FAIL";
  }
  if (scenario.checkpointId === "DM-CP-003") {
    const rule = scenario.decisionRules[seed % scenario.decisionRules.length];
    return rule?.ruleId.includes("AGE_") ? "AGE_EXCEPTION" : rule ? "MARKS_EXCEPTION" : "MULTIPLE_FAIL";
  }
  if (scenario.checkpointId === "DM-CP-009") {
    return seed % 3 === 0 ? "BOTH_RELAXATION" : seed % 3 === 1 ? "AGE_EXCEPTION" : "MARKS_EXCEPTION";
  }
  if (scenario.checkpointId === "DM-CP-004") {
    const special = scenario.decisionRules.filter((rule) => rule.outcome === "REFER_TO_DIRECTOR" || rule.outcome === "REFER_TO_COMMITTEE");
    const rule = special.length ? special[seed % special.length] : undefined;
    if (rule?.outcome === "REFER_TO_DIRECTOR") return "DIRECTOR_REFERRAL";
    if (rule?.outcome === "REFER_TO_COMMITTEE") return "COMMITTEE_REFERRAL";
  }
  if (scenario.checkpointId === "DM-CP-018") return "DETERMINED_REJECT_WITH_MISSING";
  return "MULTIPLE_FAIL";
}

export function generateDmQuestion(input: {
  scenario: DmScenario;
  locale: DmLocale;
  seed: number;
  mode: DmCandidateMode;
}): DmGeneratedQuestion {
  const { scenario, locale, seed, mode } = input;
  if (scenario.setSpec) return generateSetQuestion(scenario, locale, seed, mode);
  if (scenario.situational) return generateSituationalQuestion(scenario, locale, seed, mode);
  if (scenario.ranking) return generateRankedQuestion(scenario, locale, seed, mode);
  const candidate = buildDmCandidate(scenario, mode, seed, locale);
  const result = evaluateDmDecision(candidate, scenario);
  const expectedSpecialRule = ruleForMode(scenario, mode);
  if (expectedSpecialRule && result.outcome !== expectedSpecialRule.outcome) {
    throw new Error(scenario.scenarioId + " did not resolve the candidate through " + expectedSpecialRule.ruleId + ".");
  }
  const options = orderedOptions(result.outcome, locale, seed);
  return Object.freeze({
    chapterId: "DM-001",
    checkpointId: scenario.checkpointId,
    blueprintCheckpointId: scenario.blueprintCheckpointId,
    qlId: scenario.qlId,
    scenarioId: scenario.scenarioId,
    seed,
    locale,
    difficulty: dmDifficultyForMode(scenario.checkpointId, mode),
    candidate,
    answerMode: "ELIGIBILITY_OUTCOME",
    stem: localizedStem(scenario, candidate, locale, seed),
    options: options.options,
    correctIndex: options.correctIndex,
    outcome: result.outcome,
    explanation: buildExplanation(result, candidate, scenario, locale),
    explanationRows: Object.freeze(explanationRows(result, candidate, scenario, locale)),
  });
}
