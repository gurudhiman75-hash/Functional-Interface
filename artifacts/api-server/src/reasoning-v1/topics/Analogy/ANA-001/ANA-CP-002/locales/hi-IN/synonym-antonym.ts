import type { LocalizedAnalogyFact } from "../../../localization/types";

function fact(id: string, canonicalFactId: string, relation: string, left: string, right: string, predicate: string): LocalizedAnalogyFact {
  return { id, canonicalFactId, relation, locale: "hi-IN", left, right, predicate, mode: "LANGUAGE_SPECIFIC", version: "1.0.0", status: "CURATED", reviewedByNativeSpeaker: false };
}

export const ANA_CP002_HI_SYNONYM_ANTONYM_FACTS: readonly LocalizedAnalogyFact[] = [
  fact("ANA-HI-LF-SYN-001", "ANA-LF-001", "LEX_SYNONYM", "शीघ्र", "त्वरित", "त्वरित, शीघ्र का समानार्थी शब्द है।"),
  fact("ANA-HI-LF-SYN-002", "ANA-LF-002", "LEX_SYNONYM", "साहसी", "वीर", "वीर, साहसी का समानार्थी शब्द है।"),
  fact("ANA-HI-LF-SYN-003", "ANA-LF-003", "LEX_SYNONYM", "मौन", "शांत", "शांत, मौन का निकट समानार्थी शब्द है।"),
  fact("ANA-HI-LF-SYN-004", "ANA-LF-004", "LEX_SYNONYM", "प्राचीन", "पुरातन", "पुरातन, प्राचीन का समानार्थी शब्द है।"),
  fact("ANA-HI-LF-SYN-005", "ANA-LF-005", "LEX_SYNONYM", "आरंभ", "प्रारंभ", "प्रारंभ, आरंभ का समानार्थी शब्द है।"),
  fact("ANA-HI-LF-SYN-006", "ANA-LF-006", "LEX_SYNONYM", "त्यागना", "छोड़ना", "छोड़ना, त्यागना का समानार्थी शब्द है।"),
  fact("ANA-HI-LF-ANT-001", "ANA-LF-013", "LEX_ANTONYM", "विजय", "पराजय", "पराजय, विजय का विलोम शब्द है।"),
  fact("ANA-HI-LF-ANT-002", "ANA-LF-014", "LEX_ANTONYM", "प्राचीन", "आधुनिक", "आधुनिक, प्राचीन का विलोम शब्द है।"),
  fact("ANA-HI-LF-ANT-003", "ANA-LF-015", "LEX_ANTONYM", "विस्तार", "संकुचन", "संकुचन, विस्तार का विलोम है।"),
  fact("ANA-HI-LF-ANT-004", "ANA-LF-016", "LEX_ANTONYM", "आशावादी", "निराशावादी", "निराशावादी, आशावादी का विलोम शब्द है।"),
  fact("ANA-HI-LF-ANT-005", "ANA-LF-017", "LEX_ANTONYM", "स्थायी", "अस्थायी", "अस्थायी, स्थायी का विलोम शब्द है।"),
  fact("ANA-HI-LF-ANT-006", "ANA-LF-018", "LEX_ANTONYM", "पारदर्शी", "अपारदर्शी", "अपारदर्शी, पारदर्शी का विलोम शब्द है।"),
];
