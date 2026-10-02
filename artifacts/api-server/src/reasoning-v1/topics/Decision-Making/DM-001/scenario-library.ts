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

const text = (en: string, hi: string, pa: string): LocalizedText => Object.freeze({ en, hi, pa });
const condition = (id: string, field: DmField, operator: DmRuleCondition["operator"], value: DmRuleCondition["value"]): DmRuleCondition =>
  Object.freeze({ id, field, operator, value });

const CONTEXTS: Readonly<Record<DmCheckpointId, readonly LocalizedText[]>> = Object.freeze({
  "DM-CP-001": [
    text("Junior clerk recruitment", "कनिष्ठ लिपिक भर्ती", "ਜੂਨੀਅਰ ਕਲਰਕ ਦੀ ਭਰਤੀ"),
    text("ITI apprentice intake", "आईटीआई प्रशिक्षु चयन", "ਆਈਟੀਆਈ ਸਿਖਿਆਰਥੀ ਦੀ ਚੋਣ"),
    text("Public library assistant appointment", "सार्वजनिक पुस्तकालय सहायक नियुक्ति", "ਜਨਤਕ ਲਾਇਬ੍ਰੇਰੀ ਸਹਾਇਕ ਦੀ ਨਿਯੁਕਤੀ"),
    text("Diploma programme admission", "डिप्लोमा कार्यक्रम में प्रवेश", "ਡਿਪਲੋਮਾ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
    text("Field survey trainee selection", "क्षेत्र सर्वेक्षण प्रशिक्षु चयन", "ਫੀਲਡ ਸਰਵੇਖਣ ਸਿਖਿਆਰਥੀ ਦੀ ਚੋਣ"),
  ],
  "DM-CP-002": [
    text("Revenue records assistant recruitment", "राजस्व अभिलेख सहायक भर्ती", "ਮਾਲ ਰਿਕਾਰਡ ਸਹਾਇਕ ਦੀ ਭਰਤੀ"),
    text("State service desk trainee intake", "राज्य सेवा केंद्र प्रशिक्षु चयन", "ਰਾਜ ਸੇਵਾ ਕੇਂਦਰ ਸਿਖਿਆਰਥੀ ਦੀ ਚੋਣ"),
    text("Polytechnic scholarship selection", "पॉलिटेक्निक छात्रवृत्ति चयन", "ਪੌਲੀਟੈਕਨਿਕ ਵਜ਼ੀਫ਼ਾ ਚੋਣ"),
    text("Banking operations trainee recruitment", "बैंकिंग संचालन प्रशिक्षु भर्ती", "ਬੈਂਕਿੰਗ ਕਾਰਜ ਸਿਖਿਆਰਥੀ ਦੀ ਭਰਤੀ"),
    text("Health records operator appointment", "स्वास्थ्य अभिलेख ऑपरेटर नियुक्ति", "ਸਿਹਤ ਰਿਕਾਰਡ ਓਪਰੇਟਰ ਦੀ ਨਿਯੁਕਤੀ"),
  ],
  "DM-CP-003": [
    text("Departmental appointment", "विभागीय नियुक्ति", "ਵਿਭਾਗੀ ਨਿਯੁਕਤੀ"),
    text("Teaching fellowship selection", "शिक्षण फेलोशिप चयन", "ਅਧਿਆਪਨ ਫੈਲੋਸ਼ਿਪ ਦੀ ਚੋਣ"),
    text("Technical apprenticeship intake", "तकनीकी प्रशिक्षु चयन", "ਤਕਨੀਕੀ ਸਿਖਿਆਰਥੀ ਦੀ ਚੋਣ"),
    text("Municipal data operator recruitment", "नगरपालिका डेटा ऑपरेटर भर्ती", "ਨਗਰ ਪਾਲਿਕਾ ਡਾਟਾ ਓਪਰੇਟਰ ਦੀ ਭਰਤੀ"),
    text("State training programme admission", "राज्य प्रशिक्षण कार्यक्रम में प्रवेश", "ਰਾਜ ਸਿਖਲਾਈ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
  ],
  "DM-CP-004": [
    text("recruitment for an office post", "कार्यालय पद की भर्ती", "ਦਫ਼ਤਰੀ ਅਹੁਦੇ ਦੀ ਭਰਤੀ"),
    text("selection by a regional recruitment board", "क्षेत्रीय भर्ती बोर्ड द्वारा चयन", "ਖੇਤਰੀ ਭਰਤੀ ਬੋਰਡ ਵੱਲੋਂ ਚੋਣ"),
    text("admission to an institute programme", "संस्थान के कार्यक्रम में प्रवेश", "ਸੰਸਥਾ ਦੇ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਦਾਖ਼ਲਾ"),
    text("a public-service internship", "लोक सेवा इंटर्नशिप", "ਲੋਕ ਸੇਵਾ ਇੰਟਰਨਸ਼ਿਪ"),
    text("a research fellowship", "अनुसंधान फेलोशिप", "ਖੋਜ ਫੈਲੋਸ਼ਿਪ"),
  ],
  "DM-CP-006": [
    text("Government recruitment for a junior analyst", "कनिष्ठ विश्लेषक के लिए सरकारी भर्ती", "ਜੂਨੀਅਰ ਵਿਸ਼ਲੇਸ਼ਕ ਲਈ ਸਰਕਾਰੀ ਭਰਤੀ"),
    text("College admission to a science programme", "विज्ञान कार्यक्रम में कॉलेज प्रवेश", "ਵਿਗਿਆਨ ਪ੍ਰੋਗਰਾਮ ਵਿੱਚ ਕਾਲਜ ਦਾਖ਼ਲਾ"),
    text("Technical training intake", "तकनीकी प्रशिक्षण में चयन", "ਤਕਨੀਕੀ ਸਿਖਲਾਈ ਲਈ ਚੋਣ"),
    text("Apprenticeship placement", "प्रशिक्षुता में नियुक्ति", "ਸਿਖਿਆਰਥੀ ਅਹੁਦੇ ਲਈ ਚੋਣ"),
    text("Scholarship, internship and promotion applications", "छात्रवृत्ति, इंटर्नशिप और पदोन्नति के आवेदन", "ਵਜ਼ੀਫ਼ੇ, ਇੰਟਰਨਸ਼ਿਪ ਅਤੇ ਤਰੱਕੀ ਲਈ ਅਰਜ਼ੀਆਂ"),
  ],
  "DM-CP-007": [
    text("Nayi Disha education grant (fictional scheme)", "नई दिशा शिक्षा अनुदान (काल्पनिक योजना)", "ਨਵੀਂ ਦਿਸ਼ਾ ਸਿੱਖਿਆ ਗ੍ਰਾਂਟ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Udaan starter loan (fictional scheme)", "उड़ान प्रारंभिक ऋण (काल्पनिक योजना)", "ਉਡਾਣ ਸ਼ੁਰੂਆਤੀ ਕਰਜ਼ਾ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Sahyog household benefit (fictional scheme)", "सहयोग परिवार लाभ (काल्पनिक योजना)", "ਸਹਿਯੋਗ ਪਰਿਵਾਰਕ ਲਾਭ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Kaushal training stipend (fictional scheme)", "कौशल प्रशिक्षण वजीफा (काल्पनिक योजना)", "ਕੌਸ਼ਲ ਸਿਖਲਾਈ ਵਜ਼ੀਫ਼ਾ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
    text("Nirman micro-enterprise support (fictional scheme)", "निर्माण सूक्ष्म-उद्यम सहायता (काल्पनिक योजना)", "ਨਿਰਮਾਣ ਛੋਟੇ ਕਾਰੋਬਾਰ ਲਈ ਸਹਾਇਤਾ (ਕਾਲਪਨਿਕ ਯੋਜਨਾ)"),
  ],
  "DM-CP-008": [
    text("Written and sectional cut-offs for an examination", "परीक्षा के लिखित और अनुभागीय न्यूनतम अंक", "ਇਮਤਿਹਾਨ ਲਈ ਲਿਖਤੀ ਅਤੇ ਭਾਗੀ ਕੱਟ-ਆਫ਼"),
    text("Interview and overall score cut-offs", "साक्षात्कार और कुल अंक की न्यूनतम सीमा", "ਇੰਟਰਵਿਊ ਅਤੇ ਕੁੱਲ ਅੰਕਾਂ ਦੀ ਕੱਟ-ਆਫ਼"),
    text("Experience and written-score minimums", "अनुभव और लिखित अंक की न्यूनतम शर्तें", "ਤਜਰਬੇ ਅਤੇ ਲਿਖਤੀ ਅੰਕਾਂ ਦੀ ਘੱਟੋ-ਘੱਟ ਹੱਦ"),
    text("Sectional, interview and overall cut-offs", "अनुभागीय, साक्षात्कार और कुल न्यूनतम अंक", "ਭਾਗੀ, ਇੰਟਰਵਿਊ ਅਤੇ ਕੁੱਲ ਕੱਟ-ਆਫ਼"),
    text("Written, interview and experience thresholds", "लिखित, साक्षात्कार और अनुभव की सीमाएँ", "ਲਿਖਤੀ, ਇੰਟਰਵਿਊ ਅਤੇ ਤਜਰਬੇ ਦੀਆਂ ਹੱਦਾਂ"),
  ],
  "DM-CP-009": [
    text("Age relaxation with relevant experience", "संबंधित अनुभव के साथ आयु में छूट", "ਸੰਬੰਧਤ ਤਜਰਬੇ ਨਾਲ ਉਮਰ ਵਿੱਚ ਛੋਟ"),
    text("Postgraduate marks relaxation", "स्नातकोत्तर अंकों में छूट", "ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਅੰਕਾਂ ਵਿੱਚ ਛੋਟ"),
    text("Combined age and marks relaxation review", "आयु और अंकों में संयुक्त छूट की समीक्षा", "ਉਮਰ ਅਤੇ ਅੰਕਾਂ ਵਿੱਚ ਸਾਂਝੀ ਛੋਟ ਦੀ ਸਮੀਖਿਆ"),
    text("Experience-based admission exception", "अनुभव पर आधारित प्रवेश अपवाद", "ਤਜਰਬੇ ਅਧਾਰਿਤ ਦਾਖ਼ਲਾ ਛੋਟ"),
    text("Departmental promotion with dependent relaxations", "परस्पर निर्भर छूट के साथ विभागीय पदोन्नति", "ਆਪਸੀ ਨਿਰਭਰ ਛੋਟਾਂ ਨਾਲ ਵਿਭਾਗੀ ਤਰੱਕੀ"),
  ],
  "DM-CP-010": [
    text("Two training seats ranked by the published priorities", "प्रकाशित प्राथमिकताओं के अनुसार दो प्रशिक्षण सीटों की वरीयता", "ਦਿੱਤੀਆਂ ਤਰਜੀਹਾਂ ਅਨੁਸਾਰ ਸਿਖਲਾਈ ਦੀਆਂ ਦੋ ਸੀਟਾਂ"),
    text("Limited college programme seats", "कॉलेज कार्यक्रम की सीमित सीटें", "ਕਾਲਜ ਪ੍ਰੋਗਰਾਮ ਦੀਆਂ ਸੀਮਤ ਸੀਟਾਂ"),
    text("Apprenticeship shortlist and waitlist", "प्रशिक्षुता की चयन-सूची और प्रतीक्षा-सूची", "ਸਿਖਿਆਰਥੀ ਚੋਣ-ਸੂਚੀ ਅਤੇ ਉਡੀਕ-ਸੂਚੀ"),
    text("Scholarship awards under a fixed seat limit", "निश्चित संख्या की छात्रवृत्ति", "ਨਿਰਧਾਰਤ ਗਿਣਤੀ ਦੇ ਵਜ਼ੀਫ਼ੇ"),
    text("Promotion vacancies with a stated tie-break", "घोषित बराबरी-निर्णय नियम वाली पदोन्नति रिक्तियाँ", "ਦਿੱਤੇ ਬਰਾਬਰੀ-ਫੈਸਲਾ ਨਿਯਮ ਵਾਲੀਆਂ ਤਰੱਕੀ ਦੀਆਂ ਅਸਾਮੀਆਂ"),
  ],
  "DM-CP-005": [
    text("Technical assistant recruitment", "तकनीकी सहायक भर्ती", "ਤਕਨੀਕੀ ਸਹਾਇਕ ਦੀ ਭਰਤੀ"),
    text("College laboratory technician appointment", "कॉलेज प्रयोगशाला तकनीशियन नियुक्ति", "ਕਾਲਜ ਲੈਬੋਰਟਰੀ ਟੈਕਨੀਸ਼ਨ ਦੀ ਨਿਯੁਕਤੀ"),
    text("Skilled apprenticeship intake", "कुशल प्रशिक्षु चयन", "ਹੁਨਰਮੰਦ ਸਿਖਿਆਰਥੀ ਦੀ ਚੋਣ"),
    text("Clerical training seat allocation", "लिपिकीय प्रशिक्षण सीट आवंटन", "ਕਲਰਕੀ ਸਿਖਲਾਈ ਸੀਟ ਦੀ ਵੰਡ"),
    text("Teaching assistant recruitment", "शिक्षण सहायक भर्ती", "ਅਧਿਆਪਨ ਸਹਾਇਕ ਦੀ ਭਰਤੀ"),
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
        "The age limit is exceeded by no more than two years, the candidate has at least five years of relevant experience, and every other basic condition is met; the rules send the case to the Manager.",
        "अभ्यर्थी की आयु निर्धारित सीमा से अधिकतम दो वर्ष अधिक है, उसके पास कम-से-कम पाँच वर्ष का संबंधित अनुभव है और बाकी सभी मूल शर्तें पूरी हैं; नियमों के अनुसार मामला प्रबंधक को भेजा जाएगा।",
        "ਉਮਰ ਦੀ ਹੱਦ ਵੱਧ ਤੋਂ ਵੱਧ ਦੋ ਸਾਲ ਪਾਰ ਹੈ, ਉਮੀਦਵਾਰ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੈ ਅਤੇ ਬਾਕੀ ਸਾਰੀਆਂ ਮੁੱਢਲੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹਨ; ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜਿਆ ਜਾਵੇਗਾ।",
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
      "The certificate details do not match the application, so the case must be checked by the Manager before a final decision.",
      "प्रमाणपत्र का विवरण आवेदन से मेल नहीं खाता; अंतिम निर्णय से पहले मामला प्रबंधक से जाँचवाना होगा।",
      "ਸਰਟੀਫਿਕੇਟ ਦਾ ਵੇਰਵਾ ਅਰਜ਼ੀ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ; ਅੰਤਿਮ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਤੋਂ ਜਾਂਚਵਾਉਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
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
        "The applicant is no more than two years above the age limit and has at least five years of relevant experience while meeting the other requirements; the rules require the Director to decide the case.",
        "आवेदक आयु-सीमा से अधिकतम दो वर्ष ऊपर है, उसके पास कम-से-कम पाँच वर्ष का संबंधित अनुभव है और बाकी शर्तें पूरी हैं; नियमों के अनुसार मामला निदेशक के निर्णय के लिए भेजा जाएगा।",
        "ਬਿਨੈਕਾਰ ਉਮਰ ਦੀ ਹੱਦ ਤੋਂ ਵੱਧ ਤੋਂ ਵੱਧ ਦੋ ਸਾਲ ਉੱਪਰ ਹੈ, ਉਸ ਕੋਲ ਘੱਟੋ-ਘੱਟ ਪੰਜ ਸਾਲ ਦਾ ਸੰਬੰਧਤ ਤਜਰਬਾ ਹੈ ਅਤੇ ਬਾਕੀ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹਨ; ਨਿਯਮਾਂ ਅਨੁਸਾਰ ਮਾਮਲਾ ਡਾਇਰੈਕਟਰ ਦੇ ਫੈਸਲੇ ਲਈ ਭੇਜਿਆ ਜਾਵੇਗਾ।",
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
  const explanation = text(
    "The stated dependent relaxation applies only because every linked condition is met; the case must be referred to the Review Committee.",
    "दी गई परस्पर-निर्भर छूट तभी लागू होती है जब उससे जुड़ी सभी शर्तें पूरी हों; मामला समीक्षा समिति को भेजना होगा।",
    "ਦਿੱਤੀ ਆਪਸੀ ਨਿਰਭਰ ਛੋਟ ਤਦ ਹੀ ਲਾਗੂ ਹੁੰਦੀ ਹੈ ਜਦੋਂ ਇਸ ਨਾਲ ਜੁੜੀਆਂ ਸਾਰੀਆਂ ਸ਼ਰਤਾਂ ਪੂਰੀਆਂ ਹੋਣ; ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
  );
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
    Object.freeze({ ruleId: "BOTH_RELAXATIONS_REFER_COMMITTEE", priority: 5, conditions: Object.freeze(both), outcome: "REFER_TO_COMMITTEE", explanation }),
    Object.freeze({ ruleId: "AGE_EXPERIENCE_RELAXATION_REFER_COMMITTEE", priority: 10, conditions: Object.freeze(age), outcome: "REFER_TO_COMMITTEE", explanation }),
    Object.freeze({ ruleId: "POSTGRADUATE_MARKS_RELAXATION_REFER_COMMITTEE", priority: 20, conditions: Object.freeze(marks), outcome: "REFER_TO_COMMITTEE", explanation }),
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
  const checkpoints = [...DM_001_CHECKPOINT_IDS];
  const scenarios: DmScenario[] = [];
  for (const checkpointId of checkpoints) {
    const contexts = CONTEXTS[checkpointId];
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
