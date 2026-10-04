import { dmQlIdsForCheckpoint } from "./ql-registry.ts";
import type {
  DmCheckpointId,
  DmDecisionRule,
  DmQlId,
  DmRankCriterion,
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

function exceptionRule(
  ruleId: string,
  priority: number,
  conditions: readonly DmRuleCondition[],
  explanation: LocalizedText,
): DmDecisionRule {
  return Object.freeze({
    ruleId,
    priority,
    conditions: Object.freeze([...conditions]),
    outcome: "SELECT",
    explanation,
  });
}

type ProductSeed = Readonly<{
  context: LocalizedText;
  base: readonly DmRuleCondition[];
  exceptions?: readonly DmDecisionRule[];
  ranking?: Readonly<{ seatCount: number; priorityOrder: readonly DmRankCriterion[] }>;
}>;

const CP001: readonly ProductSeed[] = Object.freeze([
  Object.freeze({
    context: text("Grade-A apple lot inspection", "ग्रेड-A सेब लॉट की जाँच", "ਗ੍ਰੇਡ-A ਸੇਬ ਲਾਟ ਦੀ ਜਾਂਚ"),
    base: Object.freeze([
      condition("apple-defects", "defectPercent", "LTE", 4),
      condition("apple-size", "sizeMm", "GTE", 70),
      condition("apple-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
  }),
  Object.freeze({
    context: text("wheat procurement quality check", "गेहूँ खरीद गुणवत्ता जाँच", "ਕਣਕ ਖਰੀਦ ਗੁਣਵੱਤਾ ਜਾਂਚ"),
    base: Object.freeze([
      condition("wheat-moisture", "moisturePercent", "LTE", 12),
      condition("wheat-purity", "purityPercent", "GTE", 98),
      condition("wheat-lab", "labStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("chilled milk tanker acceptance", "ठंडे दूध टैंकर की स्वीकृति", "ਠੰਢੇ ਦੁੱਧ ਟੈਂਕਰ ਦੀ ਮਨਜ਼ੂਰੀ"),
    base: Object.freeze([
      condition("milk-temperature", "temperatureC", "LTE", 4),
      condition("milk-seal", "sealStatus", "EQ", "SEALED"),
      condition("milk-lab", "labStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("packaged-food batch release", "पैक्ड-फूड बैच रिलीज़", "ਪੈਕ ਕੀਤੇ ਖਾਣੇ ਦੇ ਬੈਚ ਦੀ ਰਿਲੀਜ਼"),
    base: Object.freeze([
      condition("food-seal", "sealStatus", "EQ", "SEALED"),
      condition("food-label", "labelStatus", "EQ", "COMPLIANT"),
      condition("food-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
  }),
  Object.freeze({
    context: text("cement batch acceptance", "सीमेंट बैच की स्वीकृति", "ਸੀਮੈਂਟ ਬੈਚ ਦੀ ਮਨਜ਼ੂਰੀ"),
    base: Object.freeze([
      condition("cement-strength", "strengthMpa", "GTE", 43),
      condition("cement-lab", "labStatus", "EQ", "PASS"),
      condition("cement-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
  }),
]);

const CP002: readonly ProductSeed[] = Object.freeze([
  Object.freeze({
    context: text("export orange consignment grading", "निर्यात संतरा खेप की ग्रेडिंग", "ਨਿਰਯਾਤ ਸੰਤਰਾ ਖੇਪ ਦੀ ਗ੍ਰੇਡਿੰਗ"),
    base: Object.freeze([
      condition("orange-defects", "defectPercent", "LTE", 3),
      condition("orange-size", "sizeMm", "GTE", 65),
      condition("orange-temperature", "temperatureC", "LTE", 6),
      condition("orange-label", "labelStatus", "EQ", "COMPLIANT"),
      condition("orange-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
  }),
  Object.freeze({
    context: text("rice mill procurement lot", "चावल मिल खरीद लॉट", "ਚੌਲ ਮਿੱਲ ਖਰੀਦ ਲਾਟ"),
    base: Object.freeze([
      condition("rice-moisture", "moisturePercent", "LTE", 13),
      condition("rice-purity", "purityPercent", "GTE", 97),
      condition("rice-defects", "defectPercent", "LTE", 5),
      condition("rice-lab", "labStatus", "EQ", "PASS"),
      condition("rice-seal", "sealStatus", "EQ", "SEALED"),
      condition("rice-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
  }),
  Object.freeze({
    context: text("electronics dispatch batch inspection", "इलेक्ट्रॉनिक्स डिस्पैच बैच जाँच", "ਇਲੈਕਟ੍ਰਾਨਿਕਸ ਡਿਸਪੈਚ ਬੈਚ ਜਾਂਚ"),
    base: Object.freeze([
      condition("electronics-defects", "defectPercent", "LTE", 2),
      condition("electronics-packaging", "packagingStatus", "EQ", "INTACT"),
      condition("electronics-label", "labelStatus", "EQ", "COMPLIANT"),
      condition("electronics-seal", "sealStatus", "EQ", "SEALED"),
      condition("electronics-lab", "labStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("certified seed lot inspection", "प्रमाणित बीज लॉट की जाँच", "ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਲਾਟ ਦੀ ਜਾਂਚ"),
    base: Object.freeze([
      condition("seed-moisture", "moisturePercent", "LTE", 10),
      condition("seed-purity", "purityPercent", "GTE", 98),
      condition("seed-defects", "defectPercent", "LTE", 3),
      condition("seed-lab", "labStatus", "EQ", "PASS"),
      condition("seed-label", "labelStatus", "EQ", "COMPLIANT"),
      condition("seed-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
  }),
  Object.freeze({
    context: text("steel component batch acceptance", "स्टील कंपोनेंट बैच की स्वीकृति", "ਸਟੀਲ ਕੰਪੋਨੈਂਟ ਬੈਚ ਦੀ ਮਨਜ਼ੂਰੀ"),
    base: Object.freeze([
      condition("steel-strength", "strengthMpa", "GTE", 48),
      condition("steel-defects", "defectPercent", "LTE", 2),
      condition("steel-weight", "weightGrams", "GTE", 500),
      condition("steel-lab", "labStatus", "EQ", "PASS"),
      condition("steel-label", "labelStatus", "EQ", "COMPLIANT"),
      condition("steel-packaging", "packagingStatus", "EQ", "INTACT"),
      condition("steel-seal", "sealStatus", "EQ", "SEALED"),
    ]),
  }),
]);

const CP003: readonly ProductSeed[] = Object.freeze([
  Object.freeze({
    context: text("premium apple grading with a limited defect tolerance", "सीमित दोष-छूट वाली प्रीमियम सेब ग्रेडिंग", "ਸੀਮਿਤ ਖਾਮੀ ਛੂਟ ਵਾਲੀ ਪ੍ਰੀਮੀਅਮ ਸੇਬ ਗ੍ਰੇਡਿੰਗ"),
    base: Object.freeze([
      condition("apple3-defects", "defectPercent", "LTE", 4),
      condition("apple3-size", "sizeMm", "GTE", 70),
      condition("apple3-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_APPLE_SIZE_TOLERANCE", 10, [
        condition("apple3-defects-low", "defectPercent", "GTE", 5),
        condition("apple3-defects-high", "defectPercent", "LTE", 6),
        condition("apple3-size-exception", "sizeMm", "GTE", 76),
        condition("apple3-packaging-exception", "packagingStatus", "EQ", "INTACT"),
        condition("apple3-lab-exception", "labStatus", "EQ", "PASS"),
      ], text(
        "A lot with 5–6% defects may still be accepted when fruit size is at least 76 mm, packaging is intact and the verification sample passes.",
        "5–6% दोष वाला लॉट तब भी स्वीकार किया जा सकता है जब फल का आकार कम-से-कम 76 mm हो, पैकेजिंग सही हो और सत्यापन नमूना पास हो।",
        "5–6% ਖਾਮੀਆਂ ਵਾਲਾ ਲਾਟ ਤਦ ਵੀ ਮਨਜ਼ੂਰ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਫਲ ਦਾ ਆਕਾਰ ਘੱਟੋ-ਘੱਟ 76 mm ਹੋਵੇ, ਪੈਕਿੰਗ ਠੀਕ ਹੋਵੇ ਅਤੇ ਤਸਦੀਕੀ ਨਮੂਨਾ ਪਾਸ ਹੋਵੇ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("wheat moisture tolerance after laboratory confirmation", "प्रयोगशाला पुष्टि के बाद गेहूँ नमी-छूट", "ਲੈਬ ਪੁਸ਼ਟੀ ਤੋਂ ਬਾਅਦ ਕਣਕ ਨਮੀ ਛੂਟ"),
    base: Object.freeze([
      condition("wheat3-moisture", "moisturePercent", "LTE", 12),
      condition("wheat3-purity", "purityPercent", "GTE", 98),
      condition("wheat3-lab", "labStatus", "EQ", "PASS"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_WHEAT_MOISTURE_TOLERANCE", 10, [
        condition("wheat3-moisture-low", "moisturePercent", "GTE", 13),
        condition("wheat3-moisture-high", "moisturePercent", "LTE", 13),
        condition("wheat3-purity-exception", "purityPercent", "GTE", 99),
        condition("wheat3-lab-exception", "labStatus", "EQ", "PASS"),
        condition("wheat3-seal-exception", "sealStatus", "EQ", "SEALED"),
      ], text(
        "A 13% moisture reading is allowed only when purity is at least 99%, the laboratory result passes and the sample seal is intact.",
        "13% नमी केवल तब स्वीकार है जब शुद्धता कम-से-कम 99% हो, प्रयोगशाला परिणाम पास हो और नमूना सीलबंद हो।",
        "13% ਨਮੀ ਸਿਰਫ਼ ਤਦ ਮਨਜ਼ੂਰ ਹੈ ਜਦੋਂ ਸ਼ੁੱਧਤਾ ਘੱਟੋ-ਘੱਟ 99% ਹੋਵੇ, ਲੈਬ ਨਤੀਜਾ ਪਾਸ ਹੋਵੇ ਅਤੇ ਨਮੂਨਾ ਸੀਲਬੰਦ ਹੋਵੇ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("cold-chain fruit temperature tolerance", "कोल्ड-चेन फल तापमान छूट", "ਕੋਲਡ-ਚੇਨ ਫਲ ਤਾਪਮਾਨ ਛੂਟ"),
    base: Object.freeze([
      condition("cold3-temperature", "temperatureC", "LTE", 5),
      condition("cold3-packaging", "packagingStatus", "EQ", "INTACT"),
      condition("cold3-seal", "sealStatus", "EQ", "SEALED"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_COLD_CHAIN_TEMPERATURE_TOLERANCE", 10, [
        condition("cold3-temperature-low", "temperatureC", "GTE", 6),
        condition("cold3-temperature-high", "temperatureC", "LTE", 6),
        condition("cold3-packaging-exception", "packagingStatus", "EQ", "INTACT"),
        condition("cold3-seal-exception", "sealStatus", "EQ", "SEALED"),
        condition("cold3-lab-exception", "labStatus", "EQ", "PASS"),
      ], text(
        "A 6°C reading is acceptable only when the package and seal are intact and the verification test passes.",
        "6°C रीडिंग केवल तब स्वीकार है जब पैकेज और सील सही हों तथा सत्यापन परीक्षण पास हो।",
        "6°C ਰੀਡਿੰਗ ਸਿਰਫ਼ ਤਦ ਮਨਜ਼ੂਰ ਹੈ ਜਦੋਂ ਪੈਕਿੰਗ ਅਤੇ ਸੀਲ ਠੀਕ ਹੋਣ ਅਤੇ ਤਸਦੀਕੀ ਟੈਸਟ ਪਾਸ ਹੋਵੇ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("cement strength retest tolerance", "सीमेंट मजबूती पुनः-परीक्षण छूट", "ਸੀਮੈਂਟ ਮਜ਼ਬੂਤੀ ਮੁੜ-ਟੈਸਟ ਛੂਟ"),
    base: Object.freeze([
      condition("cement3-strength", "strengthMpa", "GTE", 43),
      condition("cement3-lab", "labStatus", "EQ", "PASS"),
      condition("cement3-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_CEMENT_RETEST_TOLERANCE", 10, [
        condition("cement3-strength-low", "strengthMpa", "GTE", 42),
        condition("cement3-strength-high", "strengthMpa", "LTE", 42),
        condition("cement3-lab-exception", "labStatus", "EQ", "PASS"),
        condition("cement3-packaging-exception", "packagingStatus", "EQ", "INTACT"),
        condition("cement3-label-exception", "labelStatus", "EQ", "COMPLIANT"),
      ], text(
        "A 42 MPa batch may be accepted only after a passing verification test with intact packaging and compliant identification.",
        "42 MPa बैच केवल पास सत्यापन परीक्षण, सही पैकेजिंग और अनुरूप पहचान के बाद स्वीकार किया जा सकता है।",
        "42 MPa ਬੈਚ ਸਿਰਫ਼ ਪਾਸ ਤਸਦੀਕੀ ਟੈਸਟ, ਠੀਕ ਪੈਕਿੰਗ ਅਤੇ ਅਨੁਕੂਲ ਪਛਾਣ ਤੋਂ ਬਾਅਦ ਮਨਜ਼ੂਰ ਹੋ ਸਕਦਾ ਹੈ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("500 g pack weight tolerance", "500 ग्राम पैक वजन छूट", "500 ਗ੍ਰਾਮ ਪੈਕ ਭਾਰ ਛੂਟ"),
    base: Object.freeze([
      condition("pack3-weight", "weightGrams", "GTE", 500),
      condition("pack3-seal", "sealStatus", "EQ", "SEALED"),
      condition("pack3-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_PACK_WEIGHT_TOLERANCE", 10, [
        condition("pack3-weight-low", "weightGrams", "GTE", 495),
        condition("pack3-weight-high", "weightGrams", "LTE", 499),
        condition("pack3-seal-exception", "sealStatus", "EQ", "SEALED"),
        condition("pack3-label-exception", "labelStatus", "EQ", "COMPLIANT"),
        condition("pack3-lab-exception", "labStatus", "EQ", "PASS"),
      ], text(
        "A pack between 495 g and 499 g is accepted only when the seal and label comply and the verification check passes.",
        "495 ग्राम से 499 ग्राम का पैक तभी स्वीकार है जब सील और लेबल अनुरूप हों तथा सत्यापन जाँच पास हो।",
        "495 ਗ੍ਰਾਮ ਤੋਂ 499 ਗ੍ਰਾਮ ਪੈਕ ਤਦ ਹੀ ਮਨਜ਼ੂਰ ਹੈ ਜਦੋਂ ਸੀਲ ਅਤੇ ਲੇਬਲ ਅਨੁਕੂਲ ਹੋਣ ਅਤੇ ਤਸਦੀਕੀ ਜਾਂਚ ਪਾਸ ਹੋਵੇ।"
      )),
    ]),
  }),
]);

const CP008: readonly ProductSeed[] = Object.freeze([
  Object.freeze({
    context: text("edible-oil laboratory release", "खाद्य तेल प्रयोगशाला रिलीज़", "ਖਾਣ ਵਾਲੇ ਤੇਲ ਦੀ ਲੈਬ ਰਿਲੀਜ਼"),
    base: Object.freeze([
      condition("oil-purity", "purityPercent", "GTE", 98),
      condition("oil-defects", "defectPercent", "LTE", 2),
    ]),
  }),
  Object.freeze({
    context: text("cold-store berry lot quality cut-offs", "कोल्ड-स्टोर बेरी लॉट गुणवत्ता कट-ऑफ", "ਕੋਲਡ-ਸਟੋਰ ਬੈਰੀ ਲਾਟ ਗੁਣਵੱਤਾ ਕਟ-ਆਫ"),
    base: Object.freeze([
      condition("berry-temperature", "temperatureC", "LTE", 4),
      condition("berry-defects", "defectPercent", "LTE", 3),
      condition("berry-size", "sizeMm", "GTE", 18),
    ]),
  }),
  Object.freeze({
    context: text("steel fastener batch quality cut-offs", "स्टील फास्टनर बैच गुणवत्ता कट-ऑफ", "ਸਟੀਲ ਫਾਸਟਨਰ ਬੈਚ ਗੁਣਵੱਤਾ ਕਟ-ਆਫ"),
    base: Object.freeze([
      condition("fastener-strength", "strengthMpa", "GTE", 50),
      condition("fastener-defects", "defectPercent", "LTE", 2),
      condition("fastener-weight", "weightGrams", "GTE", 20),
      condition("fastener-lab", "labStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("seed processing batch cut-offs", "बीज प्रसंस्करण बैच कट-ऑफ", "ਬੀਜ ਪ੍ਰੋਸੈਸਿੰਗ ਬੈਚ ਕਟ-ਆਫ"),
    base: Object.freeze([
      condition("seed8-purity", "purityPercent", "GTE", 99),
      condition("seed8-moisture", "moisturePercent", "LTE", 9),
      condition("seed8-defects", "defectPercent", "LTE", 2),
      condition("seed8-lab", "labStatus", "EQ", "PASS"),
    ]),
  }),
  Object.freeze({
    context: text("fruit export lot multi-cut-off inspection", "फल निर्यात लॉट बहु-कट-ऑफ जाँच", "ਫਲ ਨਿਰਯਾਤ ਲਾਟ ਬਹੁ-ਕਟ-ਆਫ ਜਾਂਚ"),
    base: Object.freeze([
      condition("fruit8-size", "sizeMm", "GTE", 68),
      condition("fruit8-defects", "defectPercent", "LTE", 3),
      condition("fruit8-temperature", "temperatureC", "LTE", 6),
      condition("fruit8-packaging", "packagingStatus", "EQ", "INTACT"),
      condition("fruit8-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
  }),
]);

const CP009: readonly ProductSeed[] = Object.freeze([
  Object.freeze({
    context: text("apple grade tolerance linked to fruit size", "फल आकार से जुड़ी सेब ग्रेड छूट", "ਫਲ ਆਕਾਰ ਨਾਲ ਜੁੜੀ ਸੇਬ ਗ੍ਰੇਡ ਛੂਟ"),
    base: Object.freeze([
      condition("apple9-defects", "defectPercent", "LTE", 3),
      condition("apple9-size", "sizeMm", "GTE", 70),
      condition("apple9-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_DEPENDENT_APPLE_TOLERANCE", 10, [
        condition("apple9-defects-low", "defectPercent", "GTE", 4),
        condition("apple9-defects-high", "defectPercent", "LTE", 5),
        condition("apple9-size-exception", "sizeMm", "GTE", 80),
        condition("apple9-lab", "labStatus", "EQ", "PASS"),
        condition("apple9-packaging-exception", "packagingStatus", "EQ", "INTACT"),
      ], text(
        "The higher defect allowance applies only to larger fruit of at least 80 mm with a passing verification result.",
        "अधिक दोष-छूट केवल कम-से-कम 80 mm बड़े फल और पास सत्यापन परिणाम पर लागू होती है।",
        "ਵੱਧ ਖਾਮੀ ਛੂਟ ਸਿਰਫ਼ ਘੱਟੋ-ਘੱਟ 80 mm ਵੱਡੇ ਫਲ ਅਤੇ ਪਾਸ ਤਸਦੀਕੀ ਨਤੀਜੇ ਉੱਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("wheat moisture tolerance linked to purity", "शुद्धता से जुड़ी गेहूँ नमी छूट", "ਸ਼ੁੱਧਤਾ ਨਾਲ ਜੁੜੀ ਕਣਕ ਨਮੀ ਛੂਟ"),
    base: Object.freeze([
      condition("wheat9-moisture", "moisturePercent", "LTE", 12),
      condition("wheat9-purity", "purityPercent", "GTE", 98),
      condition("wheat9-lab", "labStatus", "EQ", "PASS"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_DEPENDENT_WHEAT_TOLERANCE", 10, [
        condition("wheat9-moisture-low", "moisturePercent", "GTE", 13),
        condition("wheat9-moisture-high", "moisturePercent", "LTE", 14),
        condition("wheat9-purity-exception", "purityPercent", "GTE", 99),
        condition("wheat9-lab-exception", "labStatus", "EQ", "PASS"),
        condition("wheat9-seal", "sealStatus", "EQ", "SEALED"),
      ], text(
        "The moisture tolerance up to 14% applies only when purity is at least 99%, the test passes and the sample remains sealed.",
        "14% तक नमी की छूट केवल कम-से-कम 99% शुद्धता, पास परीक्षण और सीलबंद नमूने पर लागू होती है।",
        "14% ਤੱਕ ਨਮੀ ਦੀ ਛੂਟ ਸਿਰਫ਼ ਘੱਟੋ-ਘੱਟ 99% ਸ਼ੁੱਧਤਾ, ਪਾਸ ਟੈਸਟ ਅਤੇ ਸੀਲਬੰਦ ਨਮੂਨੇ ਉੱਤੇ ਲਾਗੂ ਹੁੰਦੀ ਹੈ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("chilled shipment temperature tolerance linked to seal integrity", "सील की स्थिति से जुड़ी ठंडी खेप तापमान छूट", "ਸੀਲ ਦੀ ਹਾਲਤ ਨਾਲ ਜੁੜੀ ਠੰਢੀ ਖੇਪ ਤਾਪਮਾਨ ਛੂਟ"),
    base: Object.freeze([
      condition("cold9-temperature", "temperatureC", "LTE", 5),
      condition("cold9-seal", "sealStatus", "EQ", "SEALED"),
      condition("cold9-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_DEPENDENT_COLD_TOLERANCE", 10, [
        condition("cold9-temperature-low", "temperatureC", "GTE", 6),
        condition("cold9-temperature-high", "temperatureC", "LTE", 7),
        condition("cold9-seal-exception", "sealStatus", "EQ", "SEALED"),
        condition("cold9-packaging-exception", "packagingStatus", "EQ", "INTACT"),
        condition("cold9-lab", "labStatus", "EQ", "PASS"),
      ], text(
        "A temperature of 6–7°C is tolerated only when seal and packaging integrity are intact and the verification test passes.",
        "6–7°C तापमान केवल तब स्वीकार है जब सील और पैकेजिंग सही हों तथा सत्यापन परीक्षण पास हो।",
        "6–7°C ਤਾਪਮਾਨ ਸਿਰਫ਼ ਤਦ ਮਨਜ਼ੂਰ ਹੈ ਜਦੋਂ ਸੀਲ ਅਤੇ ਪੈਕਿੰਗ ਠੀਕ ਹੋਣ ਅਤੇ ਤਸਦੀਕੀ ਟੈਸਟ ਪਾਸ ਹੋਵੇ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("cement strength tolerance linked to verification testing", "सत्यापन परीक्षण से जुड़ी सीमेंट मजबूती छूट", "ਤਸਦੀਕੀ ਟੈਸਟ ਨਾਲ ਜੁੜੀ ਸੀਮੈਂਟ ਮਜ਼ਬੂਤੀ ਛੂਟ"),
    base: Object.freeze([
      condition("cement9-strength", "strengthMpa", "GTE", 43),
      condition("cement9-lab", "labStatus", "EQ", "PASS"),
      condition("cement9-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_DEPENDENT_CEMENT_TOLERANCE", 10, [
        condition("cement9-strength-low", "strengthMpa", "GTE", 41),
        condition("cement9-strength-high", "strengthMpa", "LTE", 42),
        condition("cement9-lab-exception", "labStatus", "EQ", "PASS"),
        condition("cement9-label-exception", "labelStatus", "EQ", "COMPLIANT"),
        condition("cement9-packaging", "packagingStatus", "EQ", "INTACT"),
      ], text(
        "The reduced strength band is allowed only with a passing verification result, compliant identification and intact packaging.",
        "कम मजबूती वाला बैंड केवल पास सत्यापन परिणाम, अनुरूप पहचान और सही पैकेजिंग पर स्वीकार है।",
        "ਘੱਟ ਮਜ਼ਬੂਤੀ ਵਾਲਾ ਬੈਂਡ ਸਿਰਫ਼ ਪਾਸ ਤਸਦੀਕੀ ਨਤੀਜੇ, ਅਨੁਕੂਲ ਪਛਾਣ ਅਤੇ ਠੀਕ ਪੈਕਿੰਗ ਉੱਤੇ ਮਨਜ਼ੂਰ ਹੈ।"
      )),
    ]),
  }),
  Object.freeze({
    context: text("pack weight tolerance linked to sealing and lab verification", "सील और प्रयोगशाला सत्यापन से जुड़ी पैक वजन छूट", "ਸੀਲ ਅਤੇ ਲੈਬ ਤਸਦੀਕ ਨਾਲ ਜੁੜੀ ਪੈਕ ਭਾਰ ਛੂਟ"),
    base: Object.freeze([
      condition("pack9-weight", "weightGrams", "GTE", 500),
      condition("pack9-seal", "sealStatus", "EQ", "SEALED"),
      condition("pack9-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
    exceptions: Object.freeze([
      exceptionRule("PRODUCT_DEPENDENT_PACK_WEIGHT_TOLERANCE", 10, [
        condition("pack9-weight-low", "weightGrams", "GTE", 492),
        condition("pack9-weight-high", "weightGrams", "LTE", 499),
        condition("pack9-seal-exception", "sealStatus", "EQ", "SEALED"),
        condition("pack9-label-exception", "labelStatus", "EQ", "COMPLIANT"),
        condition("pack9-lab", "labStatus", "EQ", "PASS"),
      ], text(
        "The lower weight band is allowed only when sealing and lab verification both satisfy the stated controls.",
        "कम वजन वाला बैंड केवल तब स्वीकार है जब सील और प्रयोगशाला सत्यापन दोनों निर्धारित नियंत्रण पूरे करें।",
        "ਘੱਟ ਭਾਰ ਵਾਲਾ ਬੈਂਡ ਸਿਰਫ਼ ਤਦ ਮਨਜ਼ੂਰ ਹੈ ਜਦੋਂ ਸੀਲ ਅਤੇ ਲੈਬ ਤਸਦੀਕ ਦੋਵੇਂ ਦਿੱਤੇ ਨਿਯਮ ਪੂਰੇ ਕਰਨ।"
      )),
    ]),
  }),
]);

const CP010: readonly ProductSeed[] = Object.freeze([
  Object.freeze({
    context: text("wheat lots competing for limited procurement capacity", "सीमित खरीद क्षमता के लिए गेहूँ लॉट", "ਸੀਮਿਤ ਖਰੀਦ ਸਮਰੱਥਾ ਲਈ ਕਣਕ ਲਾਟ"),
    base: Object.freeze([
      condition("rank-wheat-lab", "labStatus", "EQ", "PASS"),
      condition("rank-wheat-seal", "sealStatus", "EQ", "SEALED"),
      condition("rank-wheat-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
    ranking: Object.freeze({
      seatCount: 2,
      priorityOrder: Object.freeze([
        { field: "purityPercent", direction: "HIGHER_FIRST" },
        { field: "moisturePercent", direction: "LOWER_FIRST" },
        { field: "inspectionOrder", direction: "LOWER_FIRST" },
      ] as const),
    }),
  }),
  Object.freeze({
    context: text("fruit export lots competing for refrigerated space", "रेफ्रिजरेटेड स्थान के लिए फल निर्यात लॉट", "ਰੈਫ੍ਰਿਜਰੇਟਡ ਥਾਂ ਲਈ ਫਲ ਨਿਰਯਾਤ ਲਾਟ"),
    base: Object.freeze([
      condition("rank-fruit-lab", "labStatus", "EQ", "PASS"),
      condition("rank-fruit-packaging", "packagingStatus", "EQ", "INTACT"),
      condition("rank-fruit-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
    ranking: Object.freeze({
      seatCount: 2,
      priorityOrder: Object.freeze([
        { field: "sizeMm", direction: "HIGHER_FIRST" },
        { field: "defectPercent", direction: "LOWER_FIRST" },
        { field: "temperatureC", direction: "LOWER_FIRST" },
        { field: "inspectionOrder", direction: "LOWER_FIRST" },
      ] as const),
    }),
  }),
  Object.freeze({
    context: text("cement batches competing for priority dispatch", "प्राथमिक डिस्पैच के लिए सीमेंट बैच", "ਤਰਜੀਹੀ ਡਿਸਪੈਚ ਲਈ ਸੀਮੈਂਟ ਬੈਚ"),
    base: Object.freeze([
      condition("rank-cement-lab", "labStatus", "EQ", "PASS"),
      condition("rank-cement-label", "labelStatus", "EQ", "COMPLIANT"),
      condition("rank-cement-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
    ranking: Object.freeze({
      seatCount: 2,
      priorityOrder: Object.freeze([
        { field: "strengthMpa", direction: "HIGHER_FIRST" },
        { field: "defectPercent", direction: "LOWER_FIRST" },
        { field: "inspectionOrder", direction: "LOWER_FIRST" },
      ] as const),
    }),
  }),
  Object.freeze({
    context: text("seed lots competing for processing slots", "प्रसंस्करण स्लॉट के लिए बीज लॉट", "ਪ੍ਰੋਸੈਸਿੰਗ ਸਲਾਟਾਂ ਲਈ ਬੀਜ ਲਾਟ"),
    base: Object.freeze([
      condition("rank-seed-lab", "labStatus", "EQ", "PASS"),
      condition("rank-seed-seal", "sealStatus", "EQ", "SEALED"),
      condition("rank-seed-label", "labelStatus", "EQ", "COMPLIANT"),
    ]),
    ranking: Object.freeze({
      seatCount: 2,
      priorityOrder: Object.freeze([
        { field: "purityPercent", direction: "HIGHER_FIRST" },
        { field: "moisturePercent", direction: "LOWER_FIRST" },
        { field: "inspectionOrder", direction: "LOWER_FIRST" },
      ] as const),
    }),
  }),
  Object.freeze({
    context: text("packaged-food lots competing for release slots", "रिलीज़ स्लॉट के लिए पैक्ड-फूड लॉट", "ਰਿਲੀਜ਼ ਸਲਾਟਾਂ ਲਈ ਪੈਕ ਕੀਤੇ ਖਾਣੇ ਦੇ ਲਾਟ"),
    base: Object.freeze([
      condition("rank-food-lab", "labStatus", "EQ", "PASS"),
      condition("rank-food-seal", "sealStatus", "EQ", "SEALED"),
      condition("rank-food-packaging", "packagingStatus", "EQ", "INTACT"),
    ]),
    ranking: Object.freeze({
      seatCount: 2,
      priorityOrder: Object.freeze([
        { field: "defectPercent", direction: "LOWER_FIRST" },
        { field: "purityPercent", direction: "HIGHER_FIRST" },
        { field: "inspectionOrder", direction: "LOWER_FIRST" },
      ] as const),
    }),
  }),
]);

const PRODUCT_BY_CHECKPOINT: Readonly<Partial<Record<DmCheckpointId, readonly ProductSeed[]>>> = Object.freeze({
  "DM-CP-001": CP001,
  "DM-CP-002": CP002,
  "DM-CP-003": CP003,
  "DM-CP-008": CP008,
  "DM-CP-009": CP009,
  "DM-CP-010": CP010,
});

export function buildDmStructuredProductScenarios(): readonly DmScenario[] {
  const scenarios: DmScenario[] = [];
  for (const [checkpointIdRaw, seeds] of Object.entries(PRODUCT_BY_CHECKPOINT)) {
    const checkpointId = checkpointIdRaw as DmCheckpointId;
    const qlIds = dmQlIdsForCheckpoint(checkpointId);
    seeds!.forEach((seed, index) => {
      const qlId = qlIds[index % qlIds.length] as DmQlId;
      scenarios.push(Object.freeze({
        scenarioId: checkpointId + "-PRODUCT-" + String(index + 1).padStart(2, "0"),
        checkpointId,
        blueprintCheckpointId: checkpointId.replace("DM-CP-", "DM-"),
        qlId,
        subjectKind: "PRODUCT_LOT",
        context: seed.context,
        baseConditions: Object.freeze([...seed.base]),
        decisionRules: Object.freeze([...(seed.exceptions ?? [])]),
        ruleNotes: Object.freeze((seed.exceptions ?? []).map((rule) => rule.explanation)),
        ...(seed.ranking ? { ranking: seed.ranking } : {}),
      }));
    });
  }
  return Object.freeze(scenarios);
}
