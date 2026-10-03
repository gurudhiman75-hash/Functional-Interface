import { dmQlIdsForCheckpoint } from "./ql-registry.ts";
import type {
  DmCheckpointId, DmDecisionRule, DmField, DmQlId, DmRankCriterion,
  DmRuleCondition, DmScenario, DmSetQuestionKind, LocalizedText,
} from "./types.ts";

const text = (en: string, hi: string, pa: string): LocalizedText => Object.freeze({ en, hi, pa });
const condition = (id: string, field: DmField, operator: DmRuleCondition["operator"], value: DmRuleCondition["value"]): DmRuleCondition =>
  Object.freeze({ id, field, operator, value });

type AdvancedCheckpoint = Extract<DmCheckpointId, "DM-CP-017" | "DM-CP-018" | "DM-CP-019" | "DM-CP-020">;

const CONTEXTS: Readonly<Record<AdvancedCheckpoint, readonly LocalizedText[]>> = Object.freeze({
  "DM-CP-017": [
    text("Merit scholarship with ordered preference rules", "क्रमबद्ध वरीयता नियमों वाली मेरिट छात्रवृत्ति", "ਕ੍ਰਮਬੱਧ ਤਰਜੀਹ ਨਿਯਮਾਂ ਵਾਲਾ ਮੈਰਿਟ ਵਜ਼ੀਫ਼ਾ"),
    text("Research grants with conflicting preference claims", "परस्पर विरोधी वरीयता दावों वाले अनुसंधान अनुदान", "ਟਕਰਾਉਂਦੇ ਤਰਜੀਹ ਦਾਵਿਆਂ ਵਾਲੀਆਂ ਖੋਜ ਗ੍ਰਾਂਟਾਂ"),
    text("Training awards with a published tie-break chain", "बराबरी के लिए प्रकाशित निर्णायक क्रम वाले प्रशिक्षण पुरस्कार", "ਬਰਾਬਰੀ ਲਈ ਪ੍ਰਕਾਸ਼ਿਤ ਨਿਰਣਾਇਕ ਕ੍ਰਮ ਵਾਲੇ ਸਿਖਲਾਈ ਇਨਾਮ"),
    text("Hostel allotment with limited places", "सीमित स्थानों वाला छात्रावास आवंटन", "ਸੀਮਤ ਥਾਵਾਂ ਵਾਲੀ ਹੋਸਟਲ ਵੰਡ"),
    text("Community-enterprise grants governed by precedence", "वरीयता क्रम से संचालित सामुदायिक उद्यम अनुदान", "ਤਰਜੀਹ ਕ੍ਰਮ ਨਾਲ ਚੱਲਦੀਆਂ ਕਮਿਊਨਿਟੀ ਉੱਦਮ ਗ੍ਰਾਂਟਾਂ"),
  ],
  "DM-CP-018": [
    text("Scholarship file with a missing marks entry", "छात्रवृत्ति फाइल जिसमें अंकों की एक प्रविष्टि उपलब्ध नहीं है", "ਵਜ਼ੀਫ਼ਾ ਫਾਈਲ ਜਿਸ ਵਿੱਚ ਅੰਕਾਂ ਦੀ ਇੱਕ ਐਂਟਰੀ ਉਪਲਬਧ ਨਹੀਂ ਹੈ"),
    text("Licence request with an unreported experience period", "लाइसेंस अनुरोध जिसमें अनुभव अवधि की जानकारी नहीं दी गई है", "ਲਾਇਸੈਂਸ ਬੇਨਤੀ ਜਿਸ ਵਿੱਚ ਤਜਰਬੇ ਦੀ ਮਿਆਦ ਨਹੀਂ ਦੱਸੀ ਗਈ ਹੈ"),
    text("Certification record awaiting certificate status", "प्रमाणन अभिलेख जिसमें प्रमाणपत्र की स्थिति लंबित है", "ਸਰਟੀਫਿਕੇਸ਼ਨ ਰਿਕਾਰਡ ਜਿਸ ਵਿੱਚ ਸਰਟੀਫਿਕੇਟ ਦੀ ਸਥਿਤੀ ਲੰਬਿਤ ਹੈ"),
    text("Benefit claim with incomplete residence evidence", "अधूरे निवास प्रमाण वाला लाभ दावा", "ਅਧੂਰੇ ਰਿਹਾਇਸ਼ ਸਬੂਤ ਵਾਲਾ ਲਾਭ ਦਾਅਵਾ"),
    text("Scrutiny record with one unresolved required field", "एक अनसुलझे अनिवार्य विवरण वाला जाँच अभिलेख", "ਇੱਕ ਅਣਸੁਲਝੇ ਲਾਜ਼ਮੀ ਵੇਰਵੇ ਵਾਲਾ ਜਾਂਚ ਰਿਕਾਰਡ"),
  ],
  "DM-CP-019": [
    text("Common licence rules applied to several profiles", "कई प्रोफाइलों पर लागू समान लाइसेंस नियम", "ਕਈ ਪ੍ਰੋਫਾਈਲਾਂ ਉੱਤੇ ਲਾਗੂ ਸਾਂਝੇ ਲਾਇਸੈਂਸ ਨਿਯਮ"),
    text("One admission notice applied to a group of profiles", "प्रोफाइल समूह पर लागू एक प्रवेश सूचना", "ਪ੍ਰੋਫਾਈਲ ਸਮੂਹ ਉੱਤੇ ਲਾਗੂ ਇੱਕ ਦਾਖ਼ਲਾ ਸੂਚਨਾ"),
    text("A shared scholarship rule block for multiple profiles", "कई प्रोफाइलों के लिए समान छात्रवृत्ति नियम", "ਕਈ ਪ੍ਰੋਫਾਈਲਾਂ ਲਈ ਸਾਂਝੇ ਵਜ਼ੀਫ਼ਾ ਨਿਯਮ"),
    text("Training eligibility decisions for a group of profiles", "प्रोफाइल समूह के लिए प्रशिक्षण-पात्रता निर्णय", "ਪ੍ਰੋਫਾਈਲ ਸਮੂਹ ਲਈ ਸਿਖਲਾਈ-ਯੋਗਤਾ ਦੇ ਫੈਸਲੇ"),
    text("Professional accreditation of several profiles", "कई प्रोफाइलों की व्यावसायिक मान्यता जाँच", "ਕਈ ਪ੍ਰੋਫਾਈਲਾਂ ਦੀ ਪੇਸ਼ਾਵਰ ਮਾਨਤਾ ਜਾਂਚ"),
  ],
  "DM-CP-020": [
    text("a professional accreditation exercise involving eligibility, relaxation and referral", "व्यावसायिक मान्यता में पात्रता, छूट और प्रेषण से जुड़े निर्णय", "ਪੇਸ਼ਾਵਰ ਮਾਨਤਾ ਵਿੱਚ ਯੋਗਤਾ, ਛੋਟ ਅਤੇ ਰੈਫਰਲ ਨਾਲ ਜੁੜੇ ਫੈਸਲੇ"),
    text("an advanced admission exercise involving exceptions and missing data", "उन्नत प्रवेश में अपवाद और अनुपलब्ध जानकारी से जुड़े निर्णय", "ਉੱਨਤ ਦਾਖ਼ਲੇ ਵਿੱਚ ਅਪਵਾਦ ਅਤੇ ਅਧੂਰੀ ਜਾਣਕਾਰੀ ਨਾਲ ਜੁੜੇ ਫੈਸਲੇ"),
    text("Mixed scholarship decisions under one rule notice", "एक नियम सूचना के तहत मिश्रित छात्रवृत्ति निर्णय", "ਇੱਕ ਨਿਯਮ ਸੂਚਨਾ ਹੇਠ ਮਿਲੇ-ਜੁਲੇ ਵਜ਼ੀਫ਼ਾ ਫੈਸਲੇ"),
    text("Comprehensive training-eligibility decision set", "व्यापक प्रशिक्षण-पात्रता निर्णय सेट", "ਵਿਆਪਕ ਸਿਖਲਾਈ-ਯੋਗਤਾ ਫੈਸਲਾ ਸੈੱਟ"),
    text("Full administrative screening set for five profiles", "पाँच प्रोफाइलों का पूर्ण प्रशासनिक जाँच सेट", "ਪੰਜ ਪ੍ਰੋਫਾਈਲਾਂ ਦਾ ਪੂਰਾ ਪ੍ਰਸ਼ਾਸਕੀ ਜਾਂਚ ਸੈੱਟ"),
  ],
});

const PRIORITY_ORDERS: readonly (readonly DmRankCriterion[])[] = Object.freeze([
  Object.freeze([{ field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "graduationMarks", direction: "HIGHER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "graduationMarks", direction: "HIGHER_FIRST" }, { field: "age", direction: "LOWER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "graduationMarks", direction: "HIGHER_FIRST" }, { field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "age", direction: "LOWER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "writtenScore", direction: "HIGHER_FIRST" }, { field: "interviewScore", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
  Object.freeze([{ field: "overallScore", direction: "HIGHER_FIRST" }, { field: "experienceYears", direction: "HIGHER_FIRST" }, { field: "qualificationRank", direction: "HIGHER_FIRST" }, { field: "applicationOrder", direction: "LOWER_FIRST" }] as const),
]);

function commonBase(policy: number, count = 6): DmRuleCondition[] {
  const all = [
    condition("advanced-age", "age", "LTE", 30 + policy),
    condition("advanced-qualification", "qualificationRank", "GTE", 3),
    condition("advanced-marks", "graduationMarks", "GTE", 58 + policy),
    condition("advanced-experience", "experienceYears", "GTE", 2 + (policy % 2)),
    condition("advanced-registration", "registrationStatus", "EQ", "VALID"),
    condition("advanced-certificate", "certificateStatus", "EQ", "VALID"),
    condition("advanced-residence", "residenceStatus", "EQ", "HOME_STATE"),
  ];
  return all.slice(0, count);
}

function documentReferral(): DmDecisionRule {
  return Object.freeze({
    ruleId: "CERTIFICATE_MISMATCH_REFER_MANAGER", priority: 5,
    conditions: Object.freeze([condition("set-certificate-mismatch", "certificateStatus", "EQ", "MISMATCH")]),
    outcome: "REFER_TO_MANAGER",
    explanation: text("A certificate mismatch must be referred to the Manager before a final decision.", "प्रमाणपत्र में अंतर होने पर अंतिम निर्णय से पहले मामला प्रबंधक को भेजना होगा।", "ਸਰਟੀਫਿਕੇਟ ਵਿੱਚ ਫ਼ਰਕ ਹੋਣ ਤੇ ਅੰਤਿਮ ਫੈਸਲੇ ਤੋਂ ਪਹਿਲਾਂ ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਕੋਲ ਭੇਜਣਾ ਲਾਜ਼ਮੀ ਹੈ।"),
  });
}

function mixedRules(policy: number): { base: DmRuleCondition[]; rules: DmDecisionRule[] } {
  const ageLimit = 30 + policy;
  const marksLimit = 58 + policy;
  const base = commonBase(policy, 7);
  const unaffectedAge = base.filter((item) => item.field !== "age");
  const unaffectedMarks = base.filter((item) => item.field !== "graduationMarks");
  return { base, rules: [
    Object.freeze({
      ruleId: "BOTH_RELAXATIONS_REFER_COMMITTEE", priority: 1,
      conditions: Object.freeze([
        ...base.filter((item) => item.field !== "age" && item.field !== "graduationMarks"),
        condition("mixed-age-lower", "age", "GTE", ageLimit + 1), condition("mixed-age-upper", "age", "LTE", ageLimit + 2),
        condition("mixed-experience", "experienceYears", "GTE", 5), condition("mixed-postgraduate", "qualificationRank", "GTE", 4),
        condition("mixed-marks-lower", "graduationMarks", "GTE", marksLimit - 5), condition("mixed-marks-upper", "graduationMarks", "LTE", marksLimit - 1),
      ]), outcome: "REFER_TO_COMMITTEE",
      explanation: text("Both relaxation conditions apply, so the higher-precedence rule sends the case to the Review Committee.", "दोनों छूट लागू हैं, इसलिए उच्च वरीयता वाला नियम मामला समीक्षा समिति को भेजता है।", "ਦੋਵੇਂ ਛੋਟਾਂ ਲਾਗੂ ਹਨ, ਇਸ ਲਈ ਉੱਚ ਤਰਜੀਹ ਵਾਲਾ ਨਿਯਮ ਮਾਮਲਾ ਸਮੀਖਿਆ ਕਮੇਟੀ ਕੋਲ ਭੇਜਦਾ ਹੈ।"),
    }),
    Object.freeze({
      ruleId: "AGE_EXPERIENCE_RELAXATION_REFER_MANAGER", priority: 2,
      conditions: Object.freeze([...unaffectedAge, condition("mixed-age-only-lower", "age", "GTE", ageLimit + 1), condition("mixed-age-only-upper", "age", "LTE", ageLimit + 2), condition("mixed-age-exp", "experienceYears", "GTE", 5)]),
      outcome: "REFER_TO_MANAGER",
      explanation: text("The age-and-experience relaxation applies, so the case goes to the Manager.", "आयु और अनुभव की छूट लागू है, इसलिए मामला प्रबंधक को जाएगा।", "ਉਮਰ ਅਤੇ ਤਜਰਬੇ ਦੀ ਛੋਟ ਲਾਗੂ ਹੈ, ਇਸ ਲਈ ਮਾਮਲਾ ਪ੍ਰਬੰਧਕ ਕੋਲ ਜਾਵੇਗਾ।"),
    }),
    Object.freeze({
      ruleId: "POSTGRADUATE_MARKS_RELAXATION_REFER_DIRECTOR", priority: 3,
      conditions: Object.freeze([...unaffectedMarks, condition("mixed-pg", "qualificationRank", "GTE", 4), condition("mixed-marks-only-lower", "graduationMarks", "GTE", marksLimit - 5), condition("mixed-marks-only-upper", "graduationMarks", "LTE", marksLimit - 1)]),
      outcome: "REFER_TO_DIRECTOR",
      explanation: text("The postgraduate marks relaxation applies, so the case goes to the Director.", "स्नातकोत्तर अंक छूट लागू है, इसलिए मामला निदेशक को जाएगा।", "ਪੋਸਟਗ੍ਰੈਜੂਏਟ ਅੰਕ ਛੋਟ ਲਾਗੂ ਹੈ, ਇਸ ਲਈ ਮਾਮਲਾ ਡਾਇਰੈਕਟਰ ਕੋਲ ਜਾਵੇਗਾ।"),
    }),
  ] };
}

const MULTI_KINDS: readonly (readonly DmSetQuestionKind[])[] = Object.freeze([
  Object.freeze(["COUNT_SELECTED", "SATISFIES_ALL"] as const),
  Object.freeze(["IDENTIFY_REJECTED", "INFORMATION_REQUIRED"] as const),
  Object.freeze(["IDENTIFY_REFERRED", "SAME_DECISION_PAIR"] as const),
]);
const MIXED_KINDS: readonly DmSetQuestionKind[] = Object.freeze(["COUNT_SELECTED", "IDENTIFY_REJECTED", "IDENTIFY_REFERRED", "SAME_DECISION_PAIR", "INFORMATION_REQUIRED"]);

export function buildDmAdvancedScenarios(): readonly DmScenario[] {
  const scenarios: DmScenario[] = [];
  for (const checkpointId of Object.keys(CONTEXTS) as AdvancedCheckpoint[]) {
    const qls = dmQlIdsForCheckpoint(checkpointId);
    CONTEXTS[checkpointId].forEach((context, contextIndex) => {
      for (let policy = 0; policy < 5; policy += 1) {
        const variant = (contextIndex + policy) % 3;
        const common = commonBase(policy, checkpointId === "DM-CP-018" ? 5 + (variant % 2) : 6);
        let base = common;
        let rules: DmDecisionRule[] = [];
        let ranking;
        let setSpec;
        if (checkpointId === "DM-CP-017") {
          ranking = Object.freeze({ seatCount: policy % 2 === 0 ? 1 : 2, priorityOrder: PRIORITY_ORDERS[policy]! });
        } else if (checkpointId === "DM-CP-019") {
          rules = [documentReferral()];
          setSpec = Object.freeze({ setFamily: "MULTI_PERSON" as const, questionKinds: MULTI_KINDS[variant]!, minimumProfiles: 4 as const, maximumProfiles: 6 as const, referralModes: Object.freeze(["DOCUMENT_REFERRAL" as const]) });
        } else if (checkpointId === "DM-CP-020") {
          const mixed = mixedRules(policy); base = mixed.base; rules = mixed.rules;
          setSpec = Object.freeze({ setFamily: "MIXED_ADVANCED" as const, questionKinds: MIXED_KINDS, minimumProfiles: 5 as const, maximumProfiles: 6 as const, referralModes: Object.freeze(["AGE_EXCEPTION" as const, "MARKS_EXCEPTION" as const, "BOTH_RELAXATION" as const]) });
        }
        scenarios.push(Object.freeze({
          scenarioId: checkpointId + "-SC-" + String(contextIndex * 5 + policy + 1).padStart(3, "0"), checkpointId,
          blueprintCheckpointId: checkpointId.replace("DM-CP-", "DM-"), qlId: qls[variant] as DmQlId, context,
          baseConditions: Object.freeze(base), decisionRules: Object.freeze(rules), ruleNotes: Object.freeze(rules.map((rule) => rule.explanation)),
          ...(ranking ? { ranking } : {}), ...(setSpec ? { setSpec } : {}),
        }));
      }
    });
  }
  return Object.freeze(scenarios);
}
