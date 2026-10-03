import type {
  DmCheckpointId,
  DmDecisionRule,
  DmField,
  DmQlId,
  DmRankCriterion,
  DmRankingSpec,
  DmRuleCondition,
  DmScenario,
  LocalizedText,
} from "./types.ts";
import { dmQlIdsForCheckpoint } from "./ql-registry.ts";
import { DM_001_CHECKPOINT_IDS } from "./types.ts";
import { buildDmSituationalScenarios } from "./situational-library.ts";
import { buildDmAdvancedScenarios } from "./advanced-library.ts";

const text = (en: string, hi: string, pa: string): LocalizedText => Object.freeze({ en, hi, pa });
const condition = (id: string, field: DmField, operator: DmRuleCondition["operator"], value: DmRuleCondition["value"]): DmRuleCondition =>
  Object.freeze({ id, field, operator, value });

const CONTEXTS: Readonly<Partial<Record<DmCheckpointId, readonly LocalizedText[]>>> = Object.freeze({
  "DM-CP-001": [
    text("Merit scholarship eligibility", "मेधा छात्रवृत्ति पात्रता", "ਮੈਰਿਟ ਵਜ਼ੀਫ਼ੇ ਲਈ ਯੋਗਤਾ"),
    text("Trade licence renewal", "व्यापार लाइसेंस का नवीनीकरण", "ਵਪਾਰ ਲਾਇਸੈਂਸ ਦਾ ਨਵੀਨੀਕਰਨ"),
    text("Student hostel allotment", "छात्रावास आवंटन", "ਵਿਦਿਆਰਥੀ ਹੋਸਟਲ ਦੀ ਵੰਡ"),
    text("First-aid certification", "प्राथमिक उपचार प्रमाणन", "ਮੁੱਢਲੀ ਸਹਾਇਤਾ ਸਰਟੀਫਿਕੇਸ਼ਨ"),
    text("Diploma programme admission", "डिप्लोमा कार्यक्रम में प्रवेश", "ਡਿਪਲੋਮਾ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
  ],
  "DM-CP-002": [
    text("Polytechnic scholarship eligibility", "पॉलिटेक्निक छात्रवृत्ति पात्रता", "ਪੌਲੀਟੈਕਨਿਕ ਵਜ਼ੀਫ਼ੇ ਲਈ ਯੋਗਤਾ"),
    text("Community health-volunteer certification", "सामुदायिक स्वास्थ्य स्वयंसेवक प्रमाणन", "ਕਮਿਊਨਿਟੀ ਸਿਹਤ ਸਵੈਸੇਵਕ ਸਰਟੀਫਿਕੇਸ਼ਨ"),
    text("State sports-coaching accreditation", "राज्य खेल-प्रशिक्षण मान्यता", "ਰਾਜ ਖੇਡ ਕੋਚਿੰਗ ਮਾਨਤਾ"),
    text("Technical course admission", "तकनीकी पाठ्यक्रम में प्रवेश", "ਤਕਨੀਕੀ ਕੋਰਸ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
    text("Professional register enrolment", "व्यावसायिक रजिस्टर में नामांकन", "ਪੇਸ਼ਾਵਰ ਰਜਿਸਟਰ ਵਿੱਚ ਨਾਮ ਦਰਜ ਕਰਨਾ"),
  ],
  "DM-CP-003": [
    text("Teaching fellowship eligibility", "शिक्षण फेलोशिप पात्रता", "ਅਧਿਆਪਨ ਫੈਲੋਸ਼ਿਪ ਲਈ ਯੋਗਤਾ"),
    text("Professional licence with an experience exception", "अनुभव-आधारित अपवाद वाला व्यावसायिक लाइसेंस", "ਤਜਰਬੇ ਅਧਾਰਿਤ ਛੋਟ ਵਾਲਾ ਪੇਸ਼ਾਵਰ ਲਾਇਸੈਂਸ"),
    text("Research grant eligibility", "अनुसंधान अनुदान पात्रता", "ਖੋਜ ਗ੍ਰਾਂਟ ਲਈ ਯੋਗਤਾ"),
    text("Advanced coaching certification", "उन्नत प्रशिक्षण प्रमाणन", "ਉੱਚ ਪੱਧਰੀ ਕੋਚਿੰਗ ਸਰਟੀਫਿਕੇਸ਼ਨ"),
    text("State training programme admission", "राज्य प्रशिक्षण कार्यक्रम में प्रवेश", "ਰਾਜ ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
  ],
  "DM-CP-004": [
    text("a professional licence requiring document review", "दस्तावेज़ समीक्षा वाला व्यावसायिक लाइसेंस", "ਦਸਤਾਵੇਜ਼ੀ ਜਾਂਚ ਵਾਲਾ ਪੇਸ਼ਾਵਰ ਲਾਇਸੈਂਸ"),
    text("a scholarship requiring committee review", "समिति समीक्षा वाली छात्रवृत्ति", "ਕਮੇਟੀ ਸਮੀਖਿਆ ਵਾਲਾ ਵਜ਼ੀਫ਼ਾ"),
    text("admission to an institute programme", "संस्थान के कार्यक्रम में प्रवेश", "ਸੰਸਥਾ ਦੇ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
    text("a public-service internship", "लोक सेवा इंटर्नशिप", "ਲੋਕ ਸੇਵਾ ਇੰਟਰਨਸ਼ਿਪ"),
    text("a research fellowship", "अनुसंधान फेलोशिप", "ਖੋਜ ਫੈਲੋਸ਼ਿਪ"),
  ],
  "DM-CP-006": [
    text("Science programme admission", "विज्ञान कार्यक्रम में प्रवेश", "ਵਿਗਿਆਨ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
    text("Technical training certification", "तकनीकी प्रशिक्षण प्रमाणन", "ਤਕਨੀਕੀ ਸਿਖਲਾਈ ਸਰਟੀਫਿਕੇਸ਼ਨ"),
    text("District-level merit scholarship", "जिला-स्तरीय मेधा छात्रवृत्ति", "ਜ਼ਿਲ੍ਹਾ ਪੱਧਰੀ ਮੈਰਿਟ ਵਜ਼ੀਫ਼ਾ"),
    text("Professional association membership", "व्यावसायिक संघ की सदस्यता", "ਪੇਸ਼ਾਵਰ ਸੰਘ ਦੀ ਮੈਂਬਰਸ਼ਿਪ"),
    text("Field-research fellowship", "क्षेत्रीय अनुसंधान फेलोशिप", "ਫੀਲਡ ਖੋਜ ਫੈਲੋਸ਼ਿਪ"),
  ],
  "DM-CP-007": [
    text("Nayi Disha education grant (fictional scheme)", "नई दिशा शिक्षा अनुदान (काल्पनिक योजना)", "ਨਵੀਂ ਦਿਸ਼ਾ ਸਿੱਖਿਆ ਗ੍ਰਾਂਟ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Udaan starter loan (fictional scheme)", "उड़ान प्रारंभिक ऋण (काल्पनिक योजना)", "ਉਡਾਣ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Sahyog household benefit (fictional scheme)", "सहयोग परिवार लाभ (काल्पनिक योजना)", "ਸਹਿਯੋਗ ਪਰਿਵਾਰਕ ਲਾਭ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Kaushal training stipend (fictional scheme)", "कौशल प्रशिक्षण वजीफा (काल्पनिक योजना)", "ਕੌਸ਼ਲ ਸਿਖਲਾਈ ਵਜ਼ੀਫ਼ਾ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Nirman micro-enterprise support (fictional scheme)", "निर्माण सूक्ष्म-उद्यम सहायता (काल्पनिक योजना)", "ਨਿਰਮਾਣ ਛੋਟੇ ਕਾਰੋਬਾਰ ਲਈ ਸਹਾਇਤਾ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
  ],
  "DM-CP-008": [
    text("a professional certification examination", "व्यावसायिक प्रमाणन परीक्षा", "ਪੇਸ਼ਾਵਰ ਸਰਟੀਫਿਕੇਸ਼ਨ ਪ੍ਰੀਖਿਆ"),
    text("a scholarship aptitude assessment", "छात्रवृत्ति योग्यता आकलन", "ਵਜ਼ੀਫ਼ਾ ਯੋਗਤਾ ਮੁਲਾਂਕਣ"),
    text("a coaching accreditation assessment", "प्रशिक्षण मान्यता आकलन", "ਕੋਚਿੰਗ ਮਾਨਤਾ ਮੁਲਾਂਕਣ"),
    text("an advanced-course entrance assessment", "उन्नत पाठ्यक्रम प्रवेश आकलन", "ਉੱਚ ਕੋਰਸ ਦਾਖ਼ਲਾ ਮੁਲਾਂਕਣ"),
    text("a departmental promotion examination", "विभागीय पदोन्नति परीक्षा", "ਵਿਭਾਗੀ ਤਰੱਕੀ ਪ੍ਰੀਖਿਆ"),
  ],
  "DM-CP-009": [
    text("Professional licence with an experience-based age exception", "अनुभव-आधारित आयु छूट वाला व्यावसायिक लाइसेंस", "ਤਜਰਬੇ ਅਧਾਰਿਤ ਉਮਰ ਛੋਟ ਵਾਲਾ ਪੇਸ਼ਾਵਰ ਲਾਇਸੈਂਸ"),
    text("Research fellowship with a postgraduate marks exception", "स्नातकोत्तर अंक छूट वाली अनुसंधान फेलोशिप", "ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਅੰਕ ਛੋਟ ਵਾਲੀ ਖੋਜ ਫੈਲੋਸ਼ਿਪ"),
    text("Training grant with combined age and marks review", "संयुक्त आयु और अंक समीक्षा वाला प्रशिक्षण अनुदान", "ਸਾਂਝੀ ਉਮਰ ਅਤੇ ਅੰਕ ਸਮੀਖਿਆ ਵਾਲੀ ਸਿਖਲਾਈ ਗ੍ਰਾਂਟ"),
    text("Advanced-course admission with an experience exception", "अनुभव-आधारित छूट वाला उन्नत पाठ्यक्रम प्रवेश", "ਤਜਰਬੇ ਅਧਾਰਿਤ ਛੋਟ ਵਾਲਾ ਉੱਚ ਕੋਰਸ ਦਾਖ਼ਲਾ"),
    text("Departmental promotion with dependent relaxations", "परस्पर निर्भर छूट के साथ विभागीय पदोन्नति", "ਆਪਸੀ ਨਿਰਭਰ ਛੋਟਾਂ ਨਾਲ ਵਿਭਾਗੀ ਤਰੱਕੀ"),
  ],
  "DM-CP-010": [
    text("training grants awarded by published priorities", "प्रकाशित प्राथमिकताओं के अनुसार प्रशिक्षण अनुदान", "ਜਾਰੀ ਤਰਜੀਹਾਂ ਅਨੁਸਾਰ ਸਿਖਲਾਈ ਗ੍ਰਾਂਟਾਂ"),
    text("limited college programme places", "कॉलेज कार्यक्रम के सीमित स्थान", "ਕਾਲਜ ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਸੀਮਤ ਥਾਵਾਂ"),
    text("research grants with an ordered tie-break", "क्रमबद्ध बराबरी-निर्णय वाले अनुसंधान अनुदान", "ਤਰਤੀਬਵਾਰ ਬਰਾਬਰੀ-ਫੈਸਲੇ ਵਾਲੀਆਂ ਖੋਜ ਗ੍ਰਾਂਟਾਂ"),
    text("scholarship awards under a fixed limit", "निश्चित संख्या में छात्रवृत्ति पुरस्कार", "ਨਿਰਧਾਰਤ ਗਿਣਤੀ ਦੇ ਵਜ਼ੀਫ਼ੇ"),
    text("hostel allotments with a stated tie-break", "घोषित बराबरी-निर्णय नियम वाला छात्रावास आवंटन", "ਦਿੱਤੇ ਬਰਾਬਰੀ-ਫੈਸਲਾ ਨਿਯਮ ਵਾਲੀ ਹੋਸਟਲ ਵੰਡ"),
  ],
  "DM-CP-005": [
    text("Commercial driving-instructor licence", "वाणिज्यिक वाहन प्रशिक्षक लाइसेंस", "ਵਪਾਰਕ ਡਰਾਈਵਿੰਗ ਇੰਸਟ੍ਰਕਟਰ ਲਾਇਸੈਂਸ"),
    text("Laboratory safety certification", "प्रयोगशाला सुरक्षा प्रमाणन", "ਲੈਬੋਰਟਰੀ ਸੁਰੱਖਿਆ ਸਰਟੀਫਿਕੇਸ਼ਨ"),
    text("Skilled-trade scholarship", "कुशल व्यवसाय छात्रवृत्ति", "ਹੁਨਰਮੰਦ ਕਿੱਤਾ ਵਜ਼ੀਫ਼ਾ"),
    text("Clerical upskilling programme", "लिपिकीय कौशल-विकास कार्यक्रम", "ਕਲਰਕੀ ਹੁਨਰ-ਵਿਕਾਸ ਪ੍ਰੋਗਰਾਮ"),
    text("Adult-education instructor accreditation", "प्रौढ़ शिक्षा प्रशिक्षक मान्यता", "ਬਾਲਗ ਸਿੱਖਿਆ ਇੰਸਟ੍ਰਕਟਰ ਮਾਨਤਾ"),
  ],
});

const MONTHS: Readonly<Record<"en" | "hi" | "pa", readonly string[]>> = Object.freeze({
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  hi: ["जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"],
  pa: ["ਜਨਵਰੀ", "ਫ਼ਰਵਰੀ", "ਮਾਰਚ", "ਅਪ੍ਰੈਲ", "ਮਈ", "ਜੂਨ", "ਜੁਲਾਈ", "ਅਗਸਤ", "ਸਤੰਬਰ", "ਅਕਤੂਬਰ", "ਨਵੰਬਰ", "ਦਸੰਬਰ"],
});

const AREAS = ["TEACHING", "CLERICAL", "BANKING", "TECHNICAL", "FIELD", "LABORATORY"] as const;

function makeBasicConditions(policy: number, variant: number): DmRuleCondition[] {
  const ageLimit = 28 + policy + (variant % 2);
  const marks = 52 + policy * 2;
  if (variant === 0) return [
    condition("basic-age", "age", "LTE", ageLimit),
    condition("basic-qualification", "qualificationRank", "GTE", 3 + (policy % 2)),
    condition("basic-registration", "registrationStatus", "EQ", "VALID"),
  ];
  if (variant === 1) return [
    condition("basic-marks", "graduationMarks", "GTE", marks),
    condition("basic-residence", "residenceStatus", "EQ", "HOME_STATE"),
    condition("basic-certificate", "certificateStatus", "EQ", "VALID"),
  ];
  return [
    condition("basic-age", "age", "LTE", ageLimit + 2),
    condition("basic-experience", "experienceYears", "GTE", 1 + (policy % 2)),
    condition("basic-qualification", "qualificationRank", "GTE", 2 + (policy % 2)),
    condition("basic-registration", "registrationStatus", "EQ", "VALID"),
  ];
}

function makeMultipleConditions(policy: number, variant: number): DmRuleCondition[] {
  const ageLimit = 29 + policy;
  const marks = 50 + policy * 3;
  const experience = 1 + (policy % 3);
  const five = [
    condition("multi-age", "age", "LTE", ageLimit),
    condition("multi-qualification", "qualificationRank", "GTE", 3),
    condition("multi-marks", "graduationMarks", "GTE", marks),
    condition("multi-experience", "experienceYears", "GTE", experience),
    condition("multi-registration", "registrationStatus", "EQ", "VALID"),
  ];
  const six = [...five, condition("multi-certificate", "certificateStatus", "EQ", "VALID")];
  const seven = [...six, condition("multi-residence", "residenceStatus", "EQ", "HOME_STATE")];
  return variant === 0 ? five : variant === 1 ? six : seven;
}

function exceptionRules(base: readonly DmRuleCondition[], ageLimit: number, marksLimit: number, variant: number): DmDecisionRule[] {
  const rules: DmDecisionRule[] = [];
  if (variant !== 2) {
    const unaffected = base.filter((item) => item.field !== "age");
    rules.push(Object.freeze({
      ruleId: "AGE_OVER_BY_TWO_REFER_MANAGER",
      priority: 10,
      conditions: Object.freeze([
        ...unaffected,
        condition("exception-age-lower", "age", "GTE", ageLimit + 1),
        condition("exception-age-upper", "age", "LTE", ageLimit + 2),
        condition("exception-experience", "experienceYears", "GTE", 5),
      ]),
      outcome: "REFER_TO_MANAGER",
      explanation: text(
        "When the age excess is no more than two years and the applicant has at least five years of relevant experience, the ordinary rejection is not final; the Manager reviews the exception if every other condition is satisfied.",
        "यदि आयु-सीमा अधिकतम दो वर्ष पार होती है और आवेदक के पास कम-से-कम पाँच वर्ष का संबंधित अनुभव है, तो बाकी सभी शर्तें पूरी होने पर सामान्य अस्वीकृति अंतिम नहीं होगी; अपवाद की समीक्षा प्रबंधक करेगा।",
        "ਜੇ ਉਮਰ ਦੀ ਹੱਦ ਵੱਧ ਤੋਂ ਵੱਧ ਦੋ ਸਾਲ ਪਾਰ ਹੁੰਦੀ ਹੈ ਅਤੇ ਬਿਨੈਕਾਰ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੈ, ਤਾਂ ਬਾਕੀ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੋਣ ਤੇ ਆਮ ਰੱਦਗੀ ਅੰਤਿਮ ਨਹੀਂ ਰਹੇਗੀ; ਅਪਵਾਦ ਦੀ ਸਮੀਖਿਆ ਮੈਨੇਜਰ ਕਰੇਗਾ।",
      ),
    }));
  }
  if (variant !== 0) {
    const unaffected = base.filter((item) => item.field !== "graduationMarks" && item.field !== "qualificationRank");
    rules.push(Object.freeze({
      ruleId: "POSTGRADUATE_MARKS_SHORTFALL_REFER_COMMITTEE",
      priority: 20,
      conditions: Object.freeze([
        ...unaffected,
        condition("exception-postgraduate", "qualificationRank", "GTE", 4),
        condition("exception-marks-lower", "graduationMarks", "GTE", Math.max(40, marksLimit - 5)),
        condition("exception-marks-upper", "graduationMarks", "LTE", marksLimit - 1),
        condition("exception-experience", "experienceYears", "GTE", 3),
      ]),
      outcome: "REFER_TO_COMMITTEE",
      explanation: text(
        "A postgraduate candidate may fall short of the marks cut-off by up to five percentage points when they have at least three years of relevant experience and meet the remaining conditions; the case goes to the Review Committee.",
        "स्नातकोत्तर अभ्यर्थी के अंक निर्धारित सीमा से अधिकतम पाँच प्रतिशत-अंक कम हो सकते हैं, यदि उसके पास कम-से-कम तीन वर्ष का संबंधित अनुभव हो और बाकी शर्तें पूरी हों; मामला समीक्षा समिति को भेजा जाएगा।",
        "ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਉਮੀਦਵਾਰ ਦੇ ਅੰਕ ਨਿਰਧਾਰਤ ਹੱਦ ਤੋਂ ਵੱਧ ਤੋਂ ਵੱਧ ਪੰਜ ਅੰਕ ਘੱਟ ਹੋ ਸਕਦੇ ਹਨ, ਜੇ ਉਸ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਤਿੰਨ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੋਵੇ ਅਤੇ ਬਾਕੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੋਣ; ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜਿਆ ਜਾਵੇਗਾ।",
      ),
    }));
  }
  return rules;
}

function makeExceptionConditions(policy: number): DmRuleCondition[] {
  const ageLimit = 29 + policy;
  const marksLimit = 54 + policy * 2;
  return [
    condition("exception-base-age", "age", "LTE", ageLimit),
    condition("exception-base-qualification", "qualificationRank", "GTE", 3),
    condition("exception-base-marks", "graduationMarks", "GTE", marksLimit),
    condition("exception-base-registration", "registrationStatus", "EQ", "VALID"),
    condition("exception-base-certificate", "certificateStatus", "EQ", "VALID"),
  ];
}

function makeReferralRules(base: readonly DmRuleCondition[], policy: number, variant: number): DmDecisionRule[] {
  const rules: DmDecisionRule[] = [Object.freeze({
    ruleId: "CERTIFICATE_MISMATCH_REFER_MANAGER",
    priority: 5,
    conditions: Object.freeze([condition("certificate-mismatch", "certificateStatus", "EQ", "MISMATCH")]),
    outcome: "REFER_TO_MANAGER",
    explanation: text(
      "The certificate and application do not match. A final eligibility decision waits until the Manager reviews that discrepancy.",
      "प्रमाणपत्र और आवेदन का विवरण मेल नहीं खाता। अंतिम पात्रता निर्णय से पहले इस अंतर की समीक्षा प्रबंधक करेगा।",
      "ਸਰਟੀਫਿਕੇਟ ਅਤੇ ਅਰਜ਼ੀ ਦਾ ਵੇਰਵਾ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ। ਅੰਤਿਮ ਯੋਗਤਾ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਫਰਕ ਦੀ ਸਮੀਖਿਆ ਮੈਨੇਜਰ ਕਰੇਗਾ।",
    ),
  })];
  if (variant !== 0) {
    const ageLimit = 29 + policy;
    rules.push(Object.freeze({
      ruleId: "AGE_OVER_BY_TWO_REFER_DIRECTOR",
      priority: 10,
      conditions: Object.freeze([
        ...base.filter((item) => item.field !== "age"),
        condition("director-age-lower", "age", "GTE", ageLimit + 1),
        condition("director-age-upper", "age", "LTE", ageLimit + 2),
        condition("director-experience", "experienceYears", "GTE", 5),
      ]),
      outcome: "REFER_TO_DIRECTOR",
      explanation: text(
        "A candidate who is up to two years over the age limit and has at least five years of relevant experience must be referred to the Director, provided all other conditions are met.",
        "यदि आवेदक आयु-सीमा से अधिकतम दो वर्ष अधिक है, उसके पास कम-से-कम पाँच वर्ष का संबंधित अनुभव है और वह बाकी सभी शर्तें पूरी करता है, तो मामला निदेशक के निर्णय के लिए भेजा जाएगा।",
        "ਜੇ ਬਿਨੈਕਾਰ ਦੀ ਉਮਰ ਨਿਰਧਾਰਤ ਹੱਦ ਤੋਂ ਦੋ ਸਾਲ ਤੱਕ ਵੱਧ ਹੈ, ਉਸ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੈ ਅਤੇ ਉਹ ਬਾਕੀ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਕਰਦਾ ਹੈ, ਤਾਂ ਮਾਮਲਾ ਡਾਇਰੈਕਟਰ ਦੇ ਫੈਸਲੇ ਲਈ ਭੇਜਿਆ ਜਾਵੇਗਾ।",
      ),
    }));
  }
  if (variant === 2) {
    const marksLimit = 54 + policy * 2;
    rules.push(Object.freeze({
      ruleId: "POSTGRADUATE_BORDERLINE_MARKS_REFER_COMMITTEE",
      priority: 20,
      conditions: Object.freeze([
        ...base.filter((item) => item.field !== "graduationMarks"),
        condition("committee-postgraduate", "qualificationRank", "GTE", 4),
        condition("committee-marks-lower", "graduationMarks", "GTE", marksLimit - 2),
        condition("committee-marks-upper", "graduationMarks", "LTE", marksLimit - 1),
        condition("committee-experience", "experienceYears", "GTE", 3),
      ]),
      outcome: "REFER_TO_COMMITTEE",
      explanation: text(
        "A postgraduate applicant is one or two percentage points below the marks cut-off and has the required relevant experience; the case must go to the Review Committee.",
        "स्नातकोत्तर आवेदक के अंक निर्धारित सीमा से एक या दो प्रतिशत-अंक कम हैं और संबंधित अनुभव की शर्त पूरी है; मामला समीक्षा समिति को भेजा जाएगा।",
        "ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਬਿਨੈਕਾਰ ਦੇ ਅੰਕ ਨਿਰਧਾਰਤ ਹੱਦ ਤੋਂ ਇੱਕ ਜਾਂ ਦੋ ਅੰਕ ਘੱਟ ਹਨ ਅਤੇ ਸੰਬੰਧਤ ਤਜਰਬੇ ਦੀ ਸ਼ਰਤ ਪੂਰੀ ਹੈ; ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜਿਆ ਜਾਵੇਗਾ।",
      ),
    }));
  }
  return rules;
}

function makeReferralBase(policy: number): DmRuleCondition[] {
  return [
    condition("referral-age", "age", "LTE", 29 + policy),
    condition("referral-qualification", "qualificationRank", "GTE", 3),
    condition("referral-marks", "graduationMarks", "GTE", 54 + policy * 2),
    condition("referral-registration", "registrationStatus", "EQ", "VALID"),
    condition("referral-certificate", "certificateStatus", "EQ", "VALID"),
  ];
}

function makeAgeQualificationExperience(policy: number, variant: number): DmRuleCondition[] {
  const ageLimit = 27 + policy;
  const minimumQualification = 2 + (policy % 3);
  const years = 1 + (policy % 3);
  if (variant === 0) return [
    condition("date-age-limit", "ageAtDate", "LTE", ageLimit),
    condition("date-qualification", "qualificationRank", "GTE", minimumQualification),
    condition("date-experience", "experienceYears", "GTE", years),
  ];
  if (variant === 1) return [
    condition("ordinary-age-limit", "age", "LTE", ageLimit + 1),
    condition("field-qualification", "qualificationRank", "GTE", minimumQualification),
    condition("field-experience", "experienceYears", "GTE", years + 1),
    condition("field-experience-area", "experienceArea", "EQ", AREAS[(policy + 1) % AREAS.length]!),
  ];
  return [
    condition("date-minimum-age", "ageAtDate", "GTE", 18),
    condition("date-maximum-age", "ageAtDate", "LTE", ageLimit),
    condition("date-qualification", "qualificationRank", "GTE", minimumQualification),
    condition("date-experience", "experienceYears", "GTE", years),
    condition("date-experience-area", "experienceArea", "EQ", AREAS[policy % AREAS.length]!),
  ];
}

function makeRecruitmentConditions(policy: number, variant: number): DmRuleCondition[] {
  if (variant === 0) return [
    condition("recruit-age", "age", "LTE", 30 + policy),
    condition("recruit-qualification", "qualificationRank", "GTE", 3),
    condition("recruit-registration", "registrationStatus", "EQ", "VALID"),
  ];
  if (variant === 1) return [
    condition("admission-marks", "graduationMarks", "GTE", 55 + policy),
    condition("admission-residence", "residenceStatus", "EQ", "HOME_STATE"),
    condition("admission-certificate", "certificateStatus", "EQ", "VALID"),
  ];
  return [
    condition("training-age", "age", "LTE", 34 + policy),
    condition("training-experience", "experienceYears", "GTE", 2 + (policy % 2)),
    condition("training-qualification", "qualificationRank", "GTE", 2),
    condition("training-registration", "registrationStatus", "EQ", "VALID"),
  ];
}

function makeBenefitConditions(policy: number, variant: number): DmRuleCondition[] {
  const incomeLimit = 240_000 + policy * 40_000;
  if (variant === 0) return [
    condition("scheme-household-income", "familyIncome", "LTE", incomeLimit),
    condition("scheme-residence", "residenceStatus", "EQ", "HOME_STATE"),
    condition("scheme-employment", "employmentStatus", "IN", ["STUDENT", "UNEMPLOYED"]),
  ];
  if (variant === 1) return [
    condition("loan-family-income", "familyIncome", "LTE", incomeLimit + 80_000),
    condition("loan-repayment", "repaymentStatus", "EQ", "CURRENT"),
    condition("loan-collateral", "collateralStatus", "EQ", "ACCEPTABLE"),
    condition("loan-category", "category", "IN", ["GENERAL", "OBC"]),
  ];
  return [
    condition("benefit-income", "annualIncome", "LTE", incomeLimit),
    condition("benefit-age", "age", "LTE", 45 + policy),
    condition("benefit-residence", "residenceStatus", "EQ", "HOME_STATE"),
    condition("benefit-repayment", "repaymentStatus", "IN", ["CURRENT", "NOT_APPLICABLE"]),
    condition("benefit-category", "category", "IN", ["SC", "ST", "OBC"]),
  ];
}

function makeCutoffConditions(policy: number, variant: number): DmRuleCondition[] {
  const written = 55 + policy;
  const sectional = 45 + policy;
  const interview = 50 + policy;
  const overall = 60 + policy;
  if (variant === 0) return [
    condition("written-minimum", "writtenScore", "GTE", written),
    condition("sectional-minimum", "sectionalScore", "GTE", sectional),
  ];
  if (variant === 1) return [
    condition("interview-minimum", "interviewScore", "GTE", interview),
    condition("overall-minimum", "overallScore", "GTE", overall),
  ];
  return [
    condition("written-minimum", "writtenScore", "GTE", written),
    condition("sectional-minimum", "sectionalScore", "GTE", sectional),
    condition("interview-minimum", "interviewScore", "GTE", interview),
    condition("overall-minimum", "overallScore", "GTE", overall),
    condition("experience-minimum", "experienceYears", "GTE", 2 + (policy % 2)),
  ];
}

function makeRelaxationRules(policy: number): { base: DmRuleCondition[]; exceptions: DmDecisionRule[] } {
  const ageLimit = 30 + policy;
  const marksLimit = 60 + policy;
  const base = [
    condition("relax-base-age", "age", "LTE", ageLimit),
    condition("relax-base-qualification", "qualificationRank", "GTE", 3),
    condition("relax-base-marks", "graduationMarks", "GTE", marksLimit),
    condition("relax-base-experience", "experienceYears", "GTE", 1),
    condition("relax-base-certificate", "certificateStatus", "EQ", "VALID"),
  ];
  const common = base.filter((item) => item.field !== "age" && item.field !== "graduationMarks" && item.field !== "qualificationRank");
  const both = [
    ...common,
    condition("both-age-lower", "age", "GTE", ageLimit + 1),
    condition("both-age-upper", "age", "LTE", ageLimit + 3),
    condition("both-postgraduate", "qualificationRank", "GTE", 4),
    condition("both-marks-lower", "graduationMarks", "GTE", marksLimit - 5),
    condition("both-marks-upper", "graduationMarks", "LTE", marksLimit - 1),
    condition("both-experience", "experienceYears", "GTE", 5),
  ];
  const age = [
    ...base.filter((item) => item.field !== "age"),
    condition("age-relax-lower", "age", "GTE", ageLimit + 1),
    condition("age-relax-upper", "age", "LTE", ageLimit + 3),
    condition("age-relax-experience", "experienceYears", "GTE", 5),
  ];
  const marks = [
    ...common,
    condition("marks-relax-postgraduate", "qualificationRank", "GTE", 4),
    condition("marks-relax-lower", "graduationMarks", "GTE", marksLimit - 5),
    condition("marks-relax-upper", "graduationMarks", "LTE", marksLimit - 1),
    condition("marks-relax-experience", "experienceYears", "GTE", 3),
    condition("marks-relax-age", "age", "LTE", ageLimit),
  ];
  const exceptions: DmDecisionRule[] = [
    Object.freeze({ ruleId: "BOTH_RELAXATIONS_REFER_COMMITTEE", priority: 5, conditions: Object.freeze(both), outcome: "REFER_TO_COMMITTEE", explanation: text(
      "A candidate exceeding the age limit and falling short of the marks cut-off receives the combined relaxation only if the postgraduate and five-year experience conditions are also met; refer the case to the Review Committee.",
      "आयु-सीमा से अधिक और अंक-सीमा से कम होने पर संयुक्त छूट तभी मिलेगी जब स्नातकोत्तर योग्यता तथा पाँच वर्ष के अनुभव की शर्त भी पूरी हो; मामला समीक्षा समिति को भेजें।",
      "ਉਮਰ ਹੱਦ ਤੋਂ ਵੱਧ ਅਤੇ ਅੰਕ ਹੱਦ ਤੋਂ ਘੱਟ ਹੋਣ ਤੇ ਸਾਂਝੀ ਛੋਟ ਤਾਂ ਹੀ ਮਿਲੇਗੀ ਜੇ ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਯੋਗਤਾ ਅਤੇ ਪੰਜ ਸਾਲ ਦੇ ਤਜਰਬੇ ਦੀ ਸ਼ਰਤ ਵੀ ਪੂਰੀ ਹੋਵੇ; ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜੋ।",
    ) }),
    Object.freeze({ ruleId: "AGE_EXPERIENCE_RELAXATION_REFER_COMMITTEE", priority: 10, conditions: Object.freeze(age), outcome: "REFER_TO_COMMITTEE", explanation: text(
      "An applicant up to three years above the age limit may be considered only with at least five years of relevant experience and all other ordinary conditions met; refer the case to the Review Committee.",
      "आयु-सीमा से अधिकतम तीन वर्ष अधिक आवेदक पर तभी विचार होगा जब उसके पास कम-से-कम पाँच वर्ष का संबंधित अनुभव हो और अन्य सभी सामान्य शर्तें पूरी हों; मामला समीक्षा समिति को भेजें।",
      "ਉਮਰ ਹੱਦ ਤੋਂ ਵੱਧ ਤੋਂ ਵੱਧ ਤਿੰਨ ਸਾਲ ਵੱਧ ਬਿਨੈਕਾਰ ਉੱਤੇ ਤਾਂ ਹੀ ਵਿਚਾਰ ਹੋਵੇਗਾ ਜੇ ਉਸ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੋਵੇ ਅਤੇ ਬਾਕੀ ਸਾਰੀਆਂ ਆਮ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੋਣ; ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜੋ।",
    ) }),
    Object.freeze({ ruleId: "POSTGRADUATE_MARKS_RELAXATION_REFER_COMMITTEE", priority: 20, conditions: Object.freeze(marks), outcome: "REFER_TO_COMMITTEE", explanation: text(
      "A postgraduate applicant within five percentage points of the marks cut-off may be considered only with at least three years of relevant experience and within the ordinary age limit; refer the case to the Review Committee.",
      "अंक-सीमा से अधिकतम पाँच प्रतिशत-अंक कम स्नातकोत्तर आवेदक पर तभी विचार होगा जब उसके पास कम-से-कम तीन वर्ष का संबंधित अनुभव हो और वह सामान्य आयु-सीमा में हो; मामला समीक्षा समिति को भेजें।",
      "ਅੰਕ ਹੱਦ ਤੋਂ ਵੱਧ ਤੋਂ ਵੱਧ ਪੰਜ ਅੰਕ ਘੱਟ ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਬਿਨੈਕਾਰ ਉੱਤੇ ਤਾਂ ਹੀ ਵਿਚਾਰ ਹੋਵੇਗਾ ਜੇ ਉਸ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਤਿੰਨ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੋਵੇ ਅਤੇ ਉਹ ਆਮ ਉਮਰ ਹੱਦ ਵਿੱਚ ਹੋਵੇ; ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜੋ।",
    ) }),
  ];
  return { base, exceptions };
}

const RANKING_ORDERS: readonly (readonly DmRankCriterion[])[] = Object.freeze([
  Object.freeze([{ field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "graduationMarks", direction: "HIGHER_FIRST" }, { field: "age", direction: "LOWER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "graduationMarks", direction: "HIGHER_FIRST" }, { field: "age", direction: "LOWER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "graduationMarks", direction: "HIGHER_FIRST" }, { field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "age", direction: "LOWER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "writtenScore", direction: "HIGHER_FIRST" }, { field: "interviewScore", direction: "HIGHER_FIRST" }, { field: "overallScore", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "overallScore", direction: "HIGHER_FIRST" }, { field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "age", direction: "LOWER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
]);

function makeRanking(policy: number): DmRankingSpec {
  return Object.freeze({ seatCount: policy % 2 === 0 ? 1 : 2, priorityOrder: RANKING_ORDERS[policy]! });
}

const REFERENCE_DATES = ["2026-01-01", "2026-03-31", "2026-06-30", "2026-09-01", "2026-10-01"] as const;

function rulesFor(checkpointId: DmCheckpointId, policy: number, variant: number): { base: DmRuleCondition[]; exceptions: DmDecisionRule[]; referenceDate?: string; ranking?: DmRankingSpec } {
  if (checkpointId === "DM-CP-001") return { base: makeBasicConditions(policy, variant), exceptions: [] };
  if (checkpointId === "DM-CP-002") return { base: makeMultipleConditions(policy, variant), exceptions: [] };
  if (checkpointId === "DM-CP-003") {
    const base = makeExceptionConditions(policy);
    return { base, exceptions: exceptionRules(base, 29 + policy, 54 + policy * 2, variant) };
  }
  if (checkpointId === "DM-CP-004") {
    const base = makeReferralBase(policy);
    return { base, exceptions: makeReferralRules(base, policy, variant) };
  }
  if (checkpointId === "DM-CP-005") {
    const referenceDate = REFERENCE_DATES[policy]!;
    return { base: makeAgeQualificationExperience(policy, variant), exceptions: [], referenceDate };
  }
  if (checkpointId === "DM-CP-006") return { base: makeRecruitmentConditions(policy, variant), exceptions: [] };
  if (checkpointId === "DM-CP-007") return { base: makeBenefitConditions(policy, variant), exceptions: [] };
  if (checkpointId === "DM-CP-008") return { base: makeCutoffConditions(policy, variant), exceptions: [] };
  if (checkpointId === "DM-CP-009") return makeRelaxationRules(policy);
  return {
    base: [condition("priority-eligible-age", "age", "LTE", 45), condition("priority-eligible-qualification", "qualificationRank", "GTE", 2), condition("priority-eligible-registration", "registrationStatus", "EQ", "VALID")],
    exceptions: [],
    ranking: makeRanking(policy),
  };
}

export function buildDmScenarioLibrary(): readonly DmScenario[] {
  const checkpoints = DM_001_CHECKPOINT_IDS.filter((checkpointId) => Number(checkpointId.slice(-3)) <= 10);
  const scenarios: DmScenario[] = [];
  for (const checkpointId of checkpoints) {
    const contexts = CONTEXTS[checkpointId]!;
    for (let contextIndex = 0; contextIndex < contexts.length; contextIndex += 1) {
      for (let policy = 0; policy < 5; policy += 1) {
        const variant = (contextIndex + policy) % 3;
        const qlId = dmQlIdsForCheckpoint(checkpointId)[variant] as DmQlId;
        const built = rulesFor(checkpointId, policy, variant);
        const notes = built.exceptions.map((rule) => rule.explanation);
        scenarios.push(Object.freeze({
          scenarioId: checkpointId + "-SC-" + String(contextIndex * 5 + policy + 1).padStart(3, "0"),
          checkpointId,
          blueprintCheckpointId: checkpointId.replace("DM-CP-", "DM-"),
          qlId,
          context: contexts[contextIndex]!,
          baseConditions: Object.freeze(built.base),
          decisionRules: Object.freeze(built.exceptions),
          ruleNotes: Object.freeze(notes),
          ...(built.referenceDate ? { referenceDate: built.referenceDate } : {}),
          ...(built.ranking ? { ranking: built.ranking } : {}),
        }));
      }
    }
  }
  scenarios.push(...buildDmSituationalScenarios());
  scenarios.push(...buildDmAdvancedScenarios());
  return Object.freeze(scenarios);
}

export const DM_001_SCENARIO_LIBRARY = buildDmScenarioLibrary();

export function dmScenariosForCheckpoint(checkpointId: DmCheckpointId): readonly DmScenario[] {
  return DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.checkpointId === checkpointId);
}

export function dmScenarioForQl(qlId: DmQlId): readonly DmScenario[] {
  return DM_001_SCENARIO_LIBRARY.filter((scenario) => scenario.qlId === qlId);
}

export function formatDmDate(isoDate: string, locale: "en" | "hi" | "pa"): string {
  const parts = isoDate.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  return String(day) + " " + (MONTHS[locale][month - 1] ?? MONTHS[locale][0]) + " " + String(year);
}