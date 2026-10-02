import { calculateDmAgeOnDate, evaluateDmDecision } from "./decision-engine.ts";
import { formatDmDate } from "./scenario-library.ts";
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
    writtenScore: "Written score", interviewScore: "Interview score",
  },
  hi: {
    age: "आयु", ageAtDate: "निर्धारित तिथि पर आयु", graduationMarks: "स्नातक में अंक",
    qualificationRank: "योग्यता", experienceYears: "संबंधित अनुभव", experienceArea: "अनुभव का क्षेत्र",
    residenceStatus: "निवास", registrationStatus: "पंजीकरण", certificateStatus: "प्रमाणपत्र की स्थिति",
    writtenScore: "लिखित परीक्षा के अंक", interviewScore: "साक्षात्कार के अंक",
  },
  pa: {
    age: "ਉਮਰ", ageAtDate: "ਨਿਰਧਾਰਤ ਮਿਤੀ ਨੂੰ ਉਮਰ", graduationMarks: "ਗ੍ਰੈਜੂਏਸ਼ਨ ਦੇ ਅੰਕ",
    qualificationRank: "ਯੋਗਤਾ", experienceYears: "ਸੰਬੰਧਤ ਤਜਰਬਾ", experienceArea: "ਤਜਰਬੇ ਦਾ ਖੇਤਰ",
    residenceStatus: "ਰਿਹਾਇਸ਼", registrationStatus: "ਰਜਿਸਟ੍ਰੇਸ਼ਨ", certificateStatus: "ਸਰਟੀਫਿਕੇਟ ਦੀ ਸਥਿਤੀ",
    writtenScore: "ਲਿਖਤੀ ਪ੍ਰੀਖਿਆ ਦੇ ਅੰਕ", interviewScore: "ਇੰਟਰਵਿਊ ਦੇ ਅੰਕ",
  },
});

const VALUE_LABELS: Readonly<Record<DmLocale, Readonly<Record<string, string>>>> = Object.freeze({
  en: {
    VALID: "valid", PENDING: "pending", INVALID: "invalid", MISMATCH: "does not match the record",
    HOME_STATE: "resident of the state", OTHER_STATE: "not a resident of the state",
    TEACHING: "teaching", CLERICAL: "clerical work", BANKING: "banking", TECHNICAL: "technical work", FIELD: "field work", LABORATORY: "laboratory work",
  },
  hi: {
    VALID: "वैध", PENDING: "लंबित", INVALID: "अमान्य", MISMATCH: "अभिलेख से मेल नहीं खाता",
    HOME_STATE: "राज्य का निवासी", OTHER_STATE: "राज्य का निवासी नहीं",
    TEACHING: "अध्यापन", CLERICAL: "लिपिकीय कार्य", BANKING: "बैंकिंग", TECHNICAL: "तकनीकी कार्य", FIELD: "क्षेत्रीय कार्य", LABORATORY: "प्रयोगशाला कार्य",
  },
  pa: {
    VALID: "ਵੈਧ", PENDING: "ਲੰਬਿਤ", INVALID: "ਅਵੈਧ", MISMATCH: "ਰਿਕਾਰਡ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ",
    HOME_STATE: "ਰਾਜ ਦਾ ਵਸਨੀਕ", OTHER_STATE: "ਰਾਜ ਦਾ ਵਸਨੀਕ ਨਹੀਂ",
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
    SELECT: "Eligible for selection", REJECT: "Not eligible", REFER_TO_MANAGER: "Refer the case to the Manager",
    REFER_TO_DIRECTOR: "Refer the case to the Director", REFER_TO_COMMITTEE: "Refer the case to the Review Committee",
    INFORMATION_REQUIRED: "Decision cannot be made; information is required",
  },
  hi: {
    SELECT: "चयन के लिए पात्र", REJECT: "अपात्र", REFER_TO_MANAGER: "मामला प्रबंधक को भेजें",
    REFER_TO_DIRECTOR: "मामला निदेशक को भेजें", REFER_TO_COMMITTEE: "मामला समीक्षा समिति को भेजें",
    INFORMATION_REQUIRED: "निर्णय के लिए अतिरिक्त जानकारी आवश्यक है",
  },
  pa: {
    SELECT: "ਚੋਣ ਲਈ ਯੋਗ", REJECT: "ਅਯੋਗ", REFER_TO_MANAGER: "ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜੋ",
    REFER_TO_DIRECTOR: "ਮਾਮਲਾ ਡਾਇਰੈਕਟਰ ਕੋਲ ਭੇਜੋ", REFER_TO_COMMITTEE: "ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜੋ",
    INFORMATION_REQUIRED: "ਫੈਸਲੇ ਲਈ ਹੋਰ ਜਾਣਕਾਰੀ ਲੋੜੀਂਦੀ ਹੈ",
  },
});

const STEMS: Readonly<Record<DmLocale, readonly string[]>> = Object.freeze({
  en: [
    "What decision applies to {name}'s application?", "How should {name}'s application be dealt with under these conditions?",
    "Which outcome follows from the stated rules?", "What status should be recorded for {name}?",
    "Should {name} be selected under the notice?", "Which result is supported by the information given?",
    "The application should be classified as...", "What is the correct decision on this application?",
    "Which option reflects {name}'s position under the rules?", "Does {name} satisfy the stated conditions?",
    "What action do the eligibility rules require?", "On the stated facts, {name} is...",
    "Which result follows after each condition is checked?", "How should the selection authority treat this case?",
    "Choose the decision that matches {name}'s case.", "Under the listed terms, {name} should be...",
    "Which status applies to the applicant?", "What should be recorded as the decision in {name}'s case?",
  ],
  hi: [
    "{name} के आवेदन पर क्या निर्णय लागू होगा?", "इन शर्तों के अनुसार {name} के आवेदन का निपटारा कैसे होना चाहिए?",
    "दिए गए नियमों से कौन-सा परिणाम निकलता है?", "{name} के लिए कौन-सी स्थिति दर्ज की जानी चाहिए?",
    "क्या सूचना के अनुसार {name} का चयन होना चाहिए?", "दी गई जानकारी किस निर्णय का समर्थन करती है?",
    "आवेदन को किस श्रेणी में रखा जाना चाहिए?", "इस आवेदन पर सही निर्णय क्या है?",
    "नियमों के अनुसार {name} की स्थिति कौन-सा विकल्प बताता है?", "क्या {name} का आवेदन दी गई सभी शर्तों के अनुरूप है?",
    "पात्रता के नियमों के अनुसार क्या किया जाना चाहिए?", "दी गई जानकारी के आधार पर {name}...",
    "हर शर्त की जाँच के बाद कौन-सा परिणाम निकलता है?", "चयन अधिकारी को इस मामले में क्या करना चाहिए?",
    "{name} के मामले से मेल खाने वाला निर्णय चुनें।", "दी गई शर्तों के तहत {name}...",
    "आवेदक पर कौन-सी स्थिति लागू होती है?", "{name} के मामले में निर्णय के रूप में क्या दर्ज किया जाए?",
  ],
  pa: [
    "{name} ਦੀ ਅਰਜ਼ੀ ਬਾਰੇ ਕਿਹੜਾ ਫੈਸਲਾ ਲਾਗੂ ਹੁੰਦਾ ਹੈ?", "ਇਨ੍ਹਾਂ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ {name} ਦੀ ਅਰਜ਼ੀ ਨਾਲ ਕੀ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    "ਦਿੱਤੇ ਨਿਯਮਾਂ ਤੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ?", "{name} ਲਈ ਕਿਹੜੀ ਸਥਿਤੀ ਦਰਜ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?",
    "ਨੋਟਿਸ ਦੀਆਂ ਸ਼ਰਤਾਂ ਅਨੁਸਾਰ ਕੀ {name} ਦੀ ਚੋਣ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?", "ਦਿੱਤੀ ਜਾਣਕਾਰੀ ਕਿਹੜੇ ਫੈਸਲੇ ਦਾ ਆਧਾਰ ਬਣਦੀ ਹੈ?",
    "ਅਰਜ਼ੀ ਨੂੰ ਕਿਹੜੀ ਸ਼੍ਰੇਣੀ ਵਿੱਚ ਰੱਖਿਆ ਜਾਵੇ?", "ਇਸ ਅਰਜ਼ੀ ਬਾਰੇ ਸਹੀ ਫੈਸਲਾ ਕੀ ਹੈ?",
    "ਨਿਯਮਾਂ ਅਨੁਸਾਰ {name} ਦੀ ਸਥਿਤੀ ਕਿਹੜਾ ਵਿਕਲਪ ਦੱਸਦਾ ਹੈ?", "ਕੀ {name} ਦੀ ਅਰਜ਼ੀ ਦਿੱਤੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਦੇ ਅਨੁਸਾਰ ਹੈ?",
    "ਯੋਗਤਾ ਦੇ ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਕੀ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?", "ਦਿੱਤੇ ਤੱਥਾਂ ਦੇ ਆਧਾਰ ਤੇ {name}...",
    "ਹਰ ਸ਼ਰਤ ਦੀ ਜਾਂਚ ਮਗਰੋਂ ਕਿਹੜਾ ਨਤੀਜਾ ਨਿਕਲਦਾ ਹੈ?", "ਚੋਣ ਅਧਿਕਾਰੀ ਨੂੰ ਇਸ ਮਾਮਲੇ ਵਿੱਚ ਕੀ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ?",
    "{name} ਦੇ ਮਾਮਲੇ ਨਾਲ ਮੇਲ ਖਾਂਦਾ ਫੈਸਲਾ ਚੁਣੋ।", "ਦਿੱਤੀਆਂ ਸ਼ਰਤਾਂ ਹੇਠ {name}...",
    "ਬਿਨੈਕਾਰ ਉੱਤੇ ਕਿਹੜੀ ਸਥਿਤੀ ਲਾਗੂ ਹੁੰਦੀ ਹੈ?", "{name} ਦੇ ਮਾਮਲੇ ਵਿੱਚ ਫੈਸਲੇ ਵਜੋਂ ਕੀ ਦਰਜ ਕੀਤਾ ਜਾਵੇ?",
  ],
});

const PROMPTS: Readonly<Record<DmLocale, Readonly<{ intro: string; conditions: string; applicant: string; additional: string; missing: string; pass: string; fail: string; unknown: string; result: string; }>>> = Object.freeze({
  en: { intro: "For {context}, applicants must meet every condition listed:", conditions: "Conditions", applicant: "Applicant", additional: "Additional rule", missing: "not provided", pass: "met", fail: "not met", unknown: "cannot be checked", result: "Decision" },
  hi: { intro: "{context} के लिए आवेदकों को नीचे दी गई सभी शर्तें पूरी करनी होंगी:", conditions: "शर्तें", applicant: "आवेदक", additional: "अतिरिक्त नियम", missing: "उपलब्ध नहीं", pass: "शर्त पूरी है", fail: "शर्त पूरी नहीं है", unknown: "जाँच संभव नहीं है", result: "निर्णय" },
  pa: { intro: "{context} ਲਈ ਬਿਨੈਕਾਰਾਂ ਨੂੰ ਹੇਠ ਲਿਖੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਨੀਆਂ ਲਾਜ਼ਮੀ ਹਨ:", conditions: "ਸ਼ਰਤਾਂ", applicant: "ਬਿਨੈਕਾਰ", additional: "ਵਾਧੂ ਨਿਯਮ", missing: "ਦਿੱਤੀ ਨਹੀਂ ਗਈ", pass: "ਸ਼ਰਤ ਪੂਰੀ ਹੈ", fail: "ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਹੈ", unknown: "ਜਾਂਚ ਨਹੀਂ ਹੋ ਸਕਦੀ", result: "ਫੈਸਲਾ" },
});

const CONCLUSIONS: Readonly<Record<DmLocale, Readonly<Record<DmOutcome, string>>>> = Object.freeze({
  en: {
    SELECT: "Every required condition is met, so the applicant is eligible for selection.",
    REJECT: "At least one mandatory condition is not met and no exception applies, so the applicant is not eligible.",
    REFER_TO_MANAGER: "The listed rule directs this case to the Manager before a final decision.",
    REFER_TO_DIRECTOR: "The listed rule assigns this case to the Director for a decision.",
    REFER_TO_COMMITTEE: "The listed rule assigns this case to the Review Committee.",
    INFORMATION_REQUIRED: "A required detail is missing or an exception cannot be checked, so a final decision cannot yet be made.",
  },
  hi: {
    SELECT: "सभी अनिवार्य शर्तें पूरी हैं, इसलिए आवेदक चयन के लिए पात्र है।",
    REJECT: "कम-से-कम एक अनिवार्य शर्त पूरी नहीं है और कोई अपवाद लागू नहीं होता, इसलिए आवेदक पात्र नहीं है।",
    REFER_TO_MANAGER: "दिया गया नियम अंतिम निर्णय से पहले इस मामले को प्रबंधक के पास भेजता है।",
    REFER_TO_DIRECTOR: "दिए गए नियम के अनुसार इस मामले का निर्णय निदेशक को करना है।",
    REFER_TO_COMMITTEE: "दिए गए नियम के अनुसार इस मामले को समीक्षा समिति के पास भेजना है।",
    INFORMATION_REQUIRED: "एक आवश्यक विवरण उपलब्ध नहीं है या अपवाद की जाँच संभव नहीं है, इसलिए अभी अंतिम निर्णय नहीं लिया जा सकता।",
  },
  pa: {
    SELECT: "ਸਾਰੀਆਂ ਲਾਜ਼ਮੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹਨ, ਇਸ ਲਈ ਬਿਨੈਕਾਰ ਚੋਣ ਲਈ ਯੋਗ ਹੈ।",
    REJECT: "ਘੱਟੋ-ਘੱਟ ਇੱਕ ਲਾਜ਼ਮੀ ਸ਼ਰਤ ਪੂਰੀ ਨਹੀਂ ਹੁੰਦੀ ਅਤੇ ਕੋਈ ਅਪਵਾਦ ਲਾਗੂ ਨਹੀਂ ਹੁੰਦਾ, ਇਸ ਲਈ ਬਿਨੈਕਾਰ ਯੋਗ ਨਹੀਂ ਹੈ।",
    REFER_TO_MANAGER: "ਦਿੱਤਾ ਨਿਯਮ ਅੰਤਿਮ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਮਾਮਲੇ ਨੂੰ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜਦਾ ਹੈ।",
    REFER_TO_DIRECTOR: "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਇਸ ਮਾਮਲੇ ਦਾ ਫੈਸਲਾ ਡਾਇਰੈਕਟਰ ਨੇ ਕਰਨਾ ਹੈ।",
    REFER_TO_COMMITTEE: "ਦਿੱਤੇ ਨਿਯਮ ਅਨੁਸਾਰ ਇਸ ਮਾਮਲੇ ਨੂੰ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜਣਾ ਹੈ।",
    INFORMATION_REQUIRED: "ਇੱਕ ਲਾਜ਼ਮੀ ਵੇਰਵਾ ਉਪਲਬਧ ਨਹੀਂ ਜਾਂ ਅਪਵਾਦ ਦੀ ਜਾਂਚ ਨਹੀਂ ਹੋ ਸਕਦੀ, ਇਸ ਲਈ ਹਾਲੇ ਅੰਤਿਮ ਫੈਸਲਾ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।",
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
  const numericField = ["age", "graduationMarks", "qualificationRank", "experienceYears", "writtenScore", "interviewScore"].includes(field);
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
  if (condition.field === "experienceYears" || condition.field === "graduationMarks" || condition.field === "writtenScore" || condition.field === "interviewScore" || condition.field === "age") return Math.max(0, target - delta);
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
  if (field === "experienceYears" || field === "graduationMarks" || field === "writtenScore" || field === "interviewScore" || field === "qualificationRank" || field === "age" || field === "ageAtDate") return 0;
  if (field === "experienceArea") return "FIELD";
  if (field === "residenceStatus") return "OTHER_STATE";
  if (field === "registrationStatus") return "PENDING";
  if (field === "certificateStatus") return "INVALID";
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
  if (field === "graduationMarks" || field === "writtenScore" || field === "interviewScore") return String(value) + "%";
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
    if (locale === "en") return label + ": one of " + target;
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

function profileFields(scenario: DmScenario): readonly DmField[] {
  const fields = new Set<DmField>();
  for (const item of scenario.baseConditions) fields.add(item.field);
  for (const rule of scenario.decisionRules) for (const item of rule.conditions) fields.add(item.field);
  return [...fields];
}

function formatApplicant(profile: DmCandidateProfile, scenario: DmScenario, locale: DmLocale): string {
  const label = PROMPTS[locale].applicant;
  const items = profileFields(scenario).map((field) => FIELD_LABELS[locale][field] + ": " + formatCandidateValue(field, profile, scenario, locale));
  return label + " " + profile.name + ": " + items.join(locale === "en" ? "; " : "। ") + ".";
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
    for (const note of scenario.ruleNotes) lines.push("• " + note[locale]);
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
    return "• " + FIELD_LABELS[locale][check.condition.field] + ": " + observed + "; " + formatDmRequirement(check.condition, locale) + " — " + statusLabel(check.status, locale) + ".";
  });
  const matchedRule = result.matchedRuleId ? scenario.decisionRules.find((rule) => rule.ruleId === result.matchedRuleId) : undefined;
  const ruleLine = matchedRule ? matchedRule.explanation[locale] : CONCLUSIONS[locale][result.outcome];
  return prompt.conditions + ":\n" + rows.join("\n") + "\n\n" + prompt.result + ": " + OUTCOME_LABELS[locale][result.outcome] + ".\n" + ruleLine;
}

function distractors(correct: DmOutcome): readonly DmOutcome[] {
  const preferred: Readonly<Record<DmOutcome, readonly DmOutcome[]>> = {
    SELECT: ["REJECT", "INFORMATION_REQUIRED", "REFER_TO_MANAGER"],
    REJECT: ["SELECT", "INFORMATION_REQUIRED", "REFER_TO_MANAGER"],
    REFER_TO_MANAGER: ["SELECT", "REJECT", "INFORMATION_REQUIRED"],
    REFER_TO_DIRECTOR: ["SELECT", "REJECT", "REFER_TO_MANAGER"],
    REFER_TO_COMMITTEE: ["SELECT", "REJECT", "REFER_TO_MANAGER"],
    INFORMATION_REQUIRED: ["SELECT", "REJECT", "REFER_TO_MANAGER"],
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

export function dmDifficultyForMode(checkpointId: DmScenario["checkpointId"], mode: DmCandidateMode): DmDifficulty {
  if (mode === "ALL_PASS" || mode === "BOUNDARY_PASS") return "EASY";
  if (mode === "SINGLE_FAIL" || mode === "MISSING_REQUIRED" || mode === "DOCUMENT_REFERRAL") return "MEDIUM";
  if (checkpointId === "DM-CP-003" && (mode === "AGE_EXCEPTION" || mode === "MARKS_EXCEPTION")) return "HARD";
  if (checkpointId === "DM-CP-004" && (mode === "DIRECTOR_REFERRAL" || mode === "COMMITTEE_REFERRAL")) return "HARD";
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
  if (scenario.checkpointId === "DM-CP-004") {
    const special = scenario.decisionRules.filter((rule) => rule.outcome === "REFER_TO_DIRECTOR" || rule.outcome === "REFER_TO_COMMITTEE");
    const rule = special.length ? special[seed % special.length] : undefined;
    if (rule?.outcome === "REFER_TO_DIRECTOR") return "DIRECTOR_REFERRAL";
    if (rule?.outcome === "REFER_TO_COMMITTEE") return "COMMITTEE_REFERRAL";
  }
  return "MULTIPLE_FAIL";
}

export function generateDmQuestion(input: {
  scenario: DmScenario;
  locale: DmLocale;
  seed: number;
  mode: DmCandidateMode;
}): DmGeneratedQuestion {
  const { scenario, locale, seed, mode } = input;
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
    stem: localizedStem(scenario, candidate, locale, seed),
    options: options.options,
    correctIndex: options.correctIndex,
    outcome: result.outcome,
    explanation: buildExplanation(result, candidate, scenario, locale),
    explanationRows: Object.freeze(explanationRows(result, candidate, scenario, locale)),
  });
}
