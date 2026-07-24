import type { LocalizedAnalogyFact } from "../../../localization/types";

function fact(id: string, canonicalFactId: string, relation: string, left: string, right: string, predicate: string): LocalizedAnalogyFact {
  return { id, canonicalFactId, relation, locale: "hi-IN", left, right, predicate, mode: "TRANSLATED_FACT", version: "1.0.0", status: "CURATED", reviewedByNativeSpeaker: false };
}

export const ANA_CP001_HI_CORE_FACTS: readonly LocalizedAnalogyFact[] = [
  fact("ANA-HI-SF-001", "ANA-SF-001", "SEM_COUNTRY_CAPITAL", "भारत", "नई दिल्ली", "नई दिल्ली भारत की राजधानी है।"),
  fact("ANA-HI-SF-002", "ANA-SF-002", "SEM_COUNTRY_CAPITAL", "जापान", "टोक्यो", "टोक्यो जापान की राजधानी है।"),
  fact("ANA-HI-SF-003", "ANA-SF-003", "SEM_COUNTRY_CAPITAL", "फ्रांस", "पेरिस", "पेरिस फ्रांस की राजधानी है।"),
  fact("ANA-HI-SF-004", "ANA-SF-004", "SEM_COUNTRY_CAPITAL", "नेपाल", "काठमांडू", "काठमांडू नेपाल की राजधानी है।"),
  fact("ANA-HI-SF-005", "ANA-SF-013", "SEM_STATE_CAPITAL", "पंजाब", "चंडीगढ़", "चंडीगढ़ पंजाब की राजधानी है।"),
  fact("ANA-HI-SF-006", "ANA-SF-014", "SEM_STATE_CAPITAL", "राजस्थान", "जयपुर", "जयपुर राजस्थान की राजधानी है।"),
  fact("ANA-HI-SF-007", "ANA-SF-015", "SEM_STATE_CAPITAL", "बिहार", "पटना", "पटना बिहार की राजधानी है।"),
  fact("ANA-HI-SF-008", "ANA-SF-016", "SEM_STATE_CAPITAL", "असम", "दिसपुर", "दिसपुर असम की राजधानी है।"),
  fact("ANA-HI-SF-009", "ANA-SF-025", "SEM_COUNTRY_CURRENCY", "जापान", "येन", "जापान की मुद्रा येन है।"),
  fact("ANA-HI-SF-010", "ANA-SF-026", "SEM_COUNTRY_CURRENCY", "यूनाइटेड किंगडम", "पाउंड स्टर्लिंग", "यूनाइटेड किंगडम की मुद्रा पाउंड स्टर्लिंग है।"),
  fact("ANA-HI-SF-011", "ANA-SF-027", "SEM_COUNTRY_CURRENCY", "बांग्लादेश", "टका", "बांग्लादेश की मुद्रा टका है।"),
  fact("ANA-HI-SF-012", "ANA-SF-028", "SEM_COUNTRY_CURRENCY", "नेपाल", "नेपाली रुपया", "नेपाल की मुद्रा नेपाली रुपया है।"),
];
