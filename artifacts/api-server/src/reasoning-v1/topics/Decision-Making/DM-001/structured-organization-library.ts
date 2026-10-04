import { dmQlIdsForCheckpoint } from "./ql-registry.ts";
import type {
  DmCheckpointId,
  DmDecisionRule,
  DmQlId,
  DmRuleCondition,
  DmScenario,
  LocalizedText,
} from "./types.ts";

function text(en: string, hi: string, pa: string): LocalizedText {
  return Object.freeze({ en, hi, pa });
}

function condition(
  id: string,
  field: DmRuleCondition["field"],
  operator: DmRuleCondition["operator"],
  value: DmRuleCondition["value"],
): DmRuleCondition {
  return Object.freeze({ id, field, operator, value });
}

function referralRule(
  ruleId: string,
  priority: number,
  conditions: readonly DmRuleCondition[],
  outcome: Extract<DmDecisionRule["outcome"], "REFER_TO_MANAGER" | "REFER_TO_DIRECTOR" | "REFER_TO_COMMITTEE">,
  explanation: LocalizedText,
): DmDecisionRule {
  return Object.freeze({ ruleId, priority, conditions: Object.freeze([...conditions]), outcome, explanation });
}

type OrganizationSeed = Readonly<{
  context: LocalizedText;
  base: readonly DmRuleCondition[];
  rules?: readonly DmDecisionRule[];
}>;

function cp004Seed(
  key: string,
  context: LocalizedText,
  minimumScore: number,
  minimumYears: number,
): OrganizationSeed {
  const common = [
    condition(key + "-years", "yearsOperating", "GTE", minimumYears),
    condition(key + "-score", "complianceScore", "GTE", minimumScore),
    condition(key + "-audit", "auditStatus", "EQ", "PASS"),
    condition(key + "-licence", "licenseStatus", "EQ", "VALID"),
    condition(key + "-documents", "documentStatus", "EQ", "VALID"),
  ];
  return Object.freeze({
    context,
    base: Object.freeze(common),
    rules: Object.freeze([
      referralRule(
        key + "_DOCUMENT_MISMATCH_MANAGER",
        5,
        [condition(key + "-document-mismatch", "documentStatus", "EQ", "MISMATCH")],
        "REFER_TO_MANAGER",
        text(
          "The submitted record does not match the verified document set, so the discrepancy requires Manager review before approval or rejection.",
          "जमा रिकॉर्ड सत्यापित दस्तावेज़ों से मेल नहीं खाता, इसलिए मंजूरी या अस्वीकृति से पहले इस अंतर की समीक्षा प्रबंधक करेगा।",
          "ਜਮ੍ਹਾਂ ਰਿਕਾਰਡ ਤਸਦੀਕ ਕੀਤੇ ਦਸਤਾਵੇਜ਼ਾਂ ਨਾਲ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ, ਇਸ ਲਈ ਮਨਜ਼ੂਰੀ ਜਾਂ ਰੱਦ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਇਸ ਫਰਕ ਦੀ ਸਮੀਖਿਆ ਮੈਨੇਜਰ ਕਰੇਗਾ।",
        ),
      ),
      referralRule(
        key + "_BORDERLINE_SCORE_DIRECTOR",
        10,
        [
          condition(key + "-director-score-low", "complianceScore", "GTE", minimumScore - 5),
          condition(key + "-director-score-high", "complianceScore", "LTE", minimumScore - 1),
          condition(key + "-director-years", "yearsOperating", "GTE", minimumYears + 2),
          condition(key + "-director-audit", "auditStatus", "EQ", "PASS"),
          condition(key + "-director-licence", "licenseStatus", "EQ", "VALID"),
          condition(key + "-director-documents", "documentStatus", "EQ", "VALID"),
          condition(key + "-director-insurance", "insuranceStatus", "EQ", "VALID"),
        ],
        "REFER_TO_DIRECTOR",
        text(
          "A borderline compliance score can be considered only for an established organisation with a clean audit, valid licence, valid insurance and complete records; the Director decides that exception.",
          "सीमांत अनुपालन अंक पर केवल ऐसी स्थापित संस्था के लिए विचार हो सकता है जिसका ऑडिट साफ हो, लाइसेंस व बीमा वैध हों और रिकॉर्ड पूरे हों; इस अपवाद पर निदेशक निर्णय करेगा।",
          "ਸੀਮਾਵਰਤੀ ਅਨੁਕੂਲਤਾ ਅੰਕ ਉੱਤੇ ਸਿਰਫ਼ ਉਸ ਸਥਾਪਿਤ ਸੰਸਥਾ ਲਈ ਵਿਚਾਰ ਹੋ ਸਕਦਾ ਹੈ ਜਿਸਦਾ ਆਡਿਟ ਸਾਫ਼ ਹੋਵੇ, ਲਾਇਸੈਂਸ ਅਤੇ ਬੀਮਾ ਵੈਧ ਹੋਣ ਅਤੇ ਰਿਕਾਰਡ ਪੂਰੇ ਹੋਣ; ਇਸ ਅਪਵਾਦ ਦਾ ਫੈਸਲਾ ਡਾਇਰੈਕਟਰ ਕਰੇਗਾ।",
        ),
      ),
      referralRule(
        key + "_AUDIT_REVIEW_COMMITTEE",
        20,
        [
          condition(key + "-committee-score", "complianceScore", "GTE", minimumScore + 5),
          condition(key + "-committee-years", "yearsOperating", "GTE", minimumYears),
          condition(key + "-committee-audit", "auditStatus", "EQ", "REVIEW"),
          condition(key + "-committee-licence", "licenseStatus", "EQ", "VALID"),
          condition(key + "-committee-documents", "documentStatus", "EQ", "VALID"),
          condition(key + "-committee-insurance", "insuranceStatus", "EQ", "VALID"),
        ],
        "REFER_TO_COMMITTEE",
        text(
          "When the compliance score is strong but the audit is formally under review, the application is not decided routinely; the Review Committee examines it.",
          "अनुपालन अंक मजबूत होने पर भी यदि ऑडिट औपचारिक समीक्षा में है, तो आवेदन का सामान्य निर्णय नहीं होगा; समीक्षा समिति इसकी जाँच करेगी।",
          "ਅਨੁਕੂਲਤਾ ਅੰਕ ਮਜ਼ਬੂਤ ਹੋਣ ਦੇ ਬਾਵਜੂਦ ਜੇ ਆਡਿਟ ਰਸਮੀ ਸਮੀਖਿਆ ਹੇਠ ਹੈ, ਤਾਂ ਅਰਜ਼ੀ ਦਾ ਆਮ ਫੈਸਲਾ ਨਹੀਂ ਹੋਵੇਗਾ; ਸਮੀਖਿਆ ਕਮੇਟੀ ਇਸਦੀ ਜਾਂਚ ਕਰੇਗੀ।",
        ),
      ),
    ]),
  });
}

const CP004: readonly OrganizationSeed[] = Object.freeze([
  cp004Seed(
    "vendor",
    text("supplier empanelment with record verification", "रिकॉर्ड सत्यापन सहित आपूर्तिकर्ता पैनल चयन", "ਰਿਕਾਰਡ ਤਸਦੀਕ ਨਾਲ ਸਪਲਾਇਰ ਪੈਨਲ ਚੋਣ"),
    78,
    3,
  ),
  cp004Seed(
    "lab",
    text("testing laboratory accreditation review", "परीक्षण प्रयोगशाला मान्यता समीक्षा", "ਟੈਸਟਿੰਗ ਲੈਬੋਰਟਰੀ ਮਾਨਤਾ ਸਮੀਖਿਆ"),
    82,
    2,
  ),
  cp004Seed(
    "transport",
    text("school transport operator permit review", "स्कूल परिवहन ऑपरेटर परमिट समीक्षा", "ਸਕੂਲ ਟਰਾਂਸਪੋਰਟ ਓਪਰੇਟਰ ਪਰਮਿਟ ਸਮੀਖਿਆ"),
    80,
    4,
  ),
  cp004Seed(
    "contractor",
    text("maintenance contractor prequalification review", "रखरखाव ठेकेदार पूर्व-योग्यता समीक्षा", "ਰੱਖ-ਰਖਾਵ ਠੇਕੇਦਾਰ ਪੂਰਵ-ਯੋਗਤਾ ਸਮੀਖਿਆ"),
    76,
    3,
  ),
  cp004Seed(
    "provider",
    text("training-provider registration review", "प्रशिक्षण प्रदाता पंजीकरण समीक्षा", "ਟ੍ਰੇਨਿੰਗ ਪ੍ਰਦਾਤਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਮੀਖਿਆ"),
    81,
    2,
  ),
]);

const CP006: readonly OrganizationSeed[] = Object.freeze([
  Object.freeze({
    context: text("vocational training-provider approval", "व्यावसायिक प्रशिक्षण प्रदाता की मंजूरी", "ਵੋਕੇਸ਼ਨਲ ਟ੍ਰੇਨਿੰਗ ਪ੍ਰਦਾਤਾ ਦੀ ਮਨਜ਼ੂਰੀ"),
    base: Object.freeze([
      condition("training-years", "yearsOperating", "GTE", 2),
      condition("training-staff", "qualifiedStaffCount", "GTE", 5),
      condition("training-audit", "auditStatus", "EQ", "PASS"),
      condition("training-licence", "licenseStatus", "EQ", "VALID"),
    ]),
  }),
  Object.freeze({
    context: text("independent testing-laboratory accreditation", "स्वतंत्र परीक्षण प्रयोगशाला मान्यता", "ਸੁਤੰਤਰ ਟੈਸਟਿੰਗ ਲੈਬੋਰਟਰੀ ਮਾਨਤਾ"),
    base: Object.freeze([
      condition("lab6-score", "complianceScore", "GTE", 85),
      condition("lab6-staff", "qualifiedStaffCount", "GTE", 6),
      condition("lab6-audit", "auditStatus", "EQ", "PASS"),
      condition("lab6-insurance", "insuranceStatus", "EQ", "VALID"),
    ]),
  }),
  Object.freeze({
    context: text("school transport-operator approval", "स्कूल परिवहन ऑपरेटर की मंजूरी", "ਸਕੂਲ ਟਰਾਂਸਪੋਰਟ ਓਪਰੇਟਰ ਦੀ ਮਨਜ਼ੂਰੀ"),
    base: Object.freeze([
      condition("transport6-years", "yearsOperating", "GTE", 3),
      condition("transport6-incidents", "incidentCount", "LTE", 1),
      condition("transport6-insurance", "insuranceStatus", "EQ", "VALID"),
      condition("transport6-licence", "licenseStatus", "EQ", "VALID"),
    ]),
  }),
  Object.freeze({
    context: text("public canteen contractor prequalification", "सार्वजनिक कैंटीन ठेकेदार पूर्व-योग्यता", "ਸਰਕਾਰੀ ਕੈਂਟੀਨ ਠੇਕੇਦਾਰ ਪੂਰਵ-ਯੋਗਤਾ"),
    base: Object.freeze([
      condition("canteen6-years", "yearsOperating", "GTE", 3),
      condition("canteen6-score", "complianceScore", "GTE", 75),
      condition("canteen6-tax", "taxStatus", "EQ", "COMPLIANT"),
      condition("canteen6-audit", "auditStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("equipment-maintenance vendor empanelment", "उपकरण रखरखाव विक्रेता पैनल चयन", "ਉਪਕਰਣ ਰੱਖ-ਰਖਾਵ ਵੇਂਡਰ ਪੈਨਲ ਚੋਣ"),
    base: Object.freeze([
      condition("vendor6-staff", "qualifiedStaffCount", "GTE", 4),
      condition("vendor6-score", "complianceScore", "GTE", 80),
      condition("vendor6-licence", "licenseStatus", "EQ", "VALID"),
      condition("vendor6-insurance", "insuranceStatus", "EQ", "VALID"),
    ]),
  }),
]);

const CP007: readonly OrganizationSeed[] = Object.freeze([
  Object.freeze({
    context: text("Udyam Sahayak equipment grant (fictional programme)", "उद्यम सहायक उपकरण अनुदान (काल्पनिक कार्यक्रम)", "ਉਦਯਮ ਸਹਾਇਕ ਉਪਕਰਣ ਗ੍ਰਾਂਟ (ਕਾਲਪਨਿਕ ਪ੍ਰੋਗਰਾਮ)"),
    base: Object.freeze([
      condition("grant7-turnover", "annualTurnover", "LTE", 4_000_000),
      condition("grant7-years", "yearsOperating", "GTE", 2),
      condition("grant7-area", "serviceAreaStatus", "EQ", "LOCAL_AREA"),
      condition("grant7-audit", "auditStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("Setu supplier working-capital support (fictional programme)", "सेतु आपूर्तिकर्ता कार्यशील-पूंजी सहायता (काल्पनिक कार्यक्रम)", "ਸੇਤੂ ਸਪਲਾਇਰ ਵਰਕਿੰਗ-ਕੈਪੀਟਲ ਸਹਾਇਤਾ (ਕਾਲਪਨਿਕ ਪ੍ਰੋਗਰਾਮ)"),
    base: Object.freeze([
      condition("credit7-years", "yearsOperating", "GTE", 3),
      condition("credit7-financial", "financialRecordStatus", "EQ", "GOOD"),
      condition("credit7-security", "securityStatus", "EQ", "AVAILABLE"),
      condition("credit7-tax", "taxStatus", "EQ", "COMPLIANT"),
    ]),
  }),
  Object.freeze({
    context: text("Sahkar cooperative modernisation grant (fictional programme)", "सहकार सहकारी आधुनिकीकरण अनुदान (काल्पनिक कार्यक्रम)", "ਸਹਕਾਰ ਸਹਿਕਾਰੀ ਆਧੁਨੀਕੀਕਰਨ ਗ੍ਰਾਂਟ (ਕਾਲਪਨਿਕ ਪ੍ਰੋਗਰਾਮ)"),
    base: Object.freeze([
      condition("coop7-turnover", "annualTurnover", "LTE", 6_000_000),
      condition("coop7-years", "yearsOperating", "GTE", 4),
      condition("coop7-score", "complianceScore", "GTE", 75),
      condition("coop7-tax", "taxStatus", "EQ", "COMPLIANT"),
      condition("coop7-audit", "auditStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("Pragati training-provider upgrade grant (fictional programme)", "प्रगति प्रशिक्षण प्रदाता उन्नयन अनुदान (काल्पनिक कार्यक्रम)", "ਪ੍ਰਗਤੀ ਟ੍ਰੇਨਿੰਗ ਪ੍ਰਦਾਤਾ ਅਪਗ੍ਰੇਡ ਗ੍ਰਾਂਟ (ਕਾਲਪਨਿਕ ਪ੍ਰੋਗਰਾਮ)"),
    base: Object.freeze([
      condition("provider7-turnover", "annualTurnover", "LTE", 5_000_000),
      condition("provider7-staff", "qualifiedStaffCount", "GTE", 5),
      condition("provider7-area", "serviceAreaStatus", "EQ", "LOCAL_AREA"),
      condition("provider7-audit", "auditStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("Nirman workshop equipment loan (fictional programme)", "निर्माण कार्यशाला उपकरण ऋण (काल्पनिक कार्यक्रम)", "ਨਿਰਮਾਣ ਵਰਕਸ਼ਾਪ ਉਪਕਰਣ ਕਰਜ਼ਾ (ਕਾਲਪਨਿਕ ਪ੍ਰੋਗਰਾਮ)"),
    base: Object.freeze([
      condition("workshop7-years", "yearsOperating", "GTE", 2),
      condition("workshop7-financial", "financialRecordStatus", "EQ", "GOOD"),
      condition("workshop7-security", "securityStatus", "EQ", "AVAILABLE"),
      condition("workshop7-tax", "taxStatus", "EQ", "COMPLIANT"),
      condition("workshop7-licence", "licenseStatus", "EQ", "VALID"),
    ]),
  }),
]);

const ORGANIZATION_BY_CHECKPOINT: Readonly<Partial<Record<DmCheckpointId, readonly OrganizationSeed[]>>> = Object.freeze({
  "DM-CP-004": CP004,
  "DM-CP-006": CP006,
  "DM-CP-007": CP007,
});

export function buildDmStructuredOrganizationScenarios(): readonly DmScenario[] {
  const scenarios: DmScenario[] = [];
  for (const [checkpointIdRaw, seeds] of Object.entries(ORGANIZATION_BY_CHECKPOINT)) {
    const checkpointId = checkpointIdRaw as DmCheckpointId;
    const qlIds = dmQlIdsForCheckpoint(checkpointId);
    seeds!.forEach((seed, index) => {
      const qlId = qlIds[index % qlIds.length] as DmQlId;
      scenarios.push(Object.freeze({
        scenarioId: checkpointId + "-ORG-" + String(index + 1).padStart(2, "0"),
        checkpointId,
        blueprintCheckpointId: checkpointId.replace("DM-CP-", "DM-"),
        qlId,
        subjectKind: "ORGANIZATION",
        context: seed.context,
        baseConditions: Object.freeze([...seed.base]),
        decisionRules: Object.freeze([...(seed.rules ?? [])]),
        ruleNotes: Object.freeze((seed.rules ?? []).map((rule) => rule.explanation)),
      }));
    });
  }
  return Object.freeze(scenarios);
}
