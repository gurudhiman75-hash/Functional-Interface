import type { LocalizedAnalogyFact } from "../../../localization/types";

function fact(id: string, canonicalFactId: string, relation: string, left: string, right: string, predicate: string): LocalizedAnalogyFact {
  return { id, canonicalFactId, relation, locale: "pa-IN", left, right, predicate, mode: "TRANSLATED_FACT", version: "1.0.0", status: "CURATED", reviewedByNativeSpeaker: false };
}

export const ANA_CP001_PA_CORE_FACTS: readonly LocalizedAnalogyFact[] = [
  fact("ANA-PA-SF-001", "ANA-SF-001", "SEM_COUNTRY_CAPITAL", "ਭਾਰਤ", "ਨਵੀਂ ਦਿੱਲੀ", "ਨਵੀਂ ਦਿੱਲੀ ਭਾਰਤ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-002", "ANA-SF-002", "SEM_COUNTRY_CAPITAL", "ਜਪਾਨ", "ਟੋਕਿਓ", "ਟੋਕਿਓ ਜਪਾਨ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-003", "ANA-SF-003", "SEM_COUNTRY_CAPITAL", "ਫਰਾਂਸ", "ਪੈਰਿਸ", "ਪੈਰਿਸ ਫਰਾਂਸ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-004", "ANA-SF-004", "SEM_COUNTRY_CAPITAL", "ਨੇਪਾਲ", "ਕਾਠਮੰਡੂ", "ਕਾਠਮੰਡੂ ਨੇਪਾਲ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-005", "ANA-SF-013", "SEM_STATE_CAPITAL", "ਪੰਜਾਬ", "ਚੰਡੀਗੜ੍ਹ", "ਚੰਡੀਗੜ੍ਹ ਪੰਜਾਬ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-006", "ANA-SF-014", "SEM_STATE_CAPITAL", "ਰਾਜਸਥਾਨ", "ਜੈਪੁਰ", "ਜੈਪੁਰ ਰਾਜਸਥਾਨ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-007", "ANA-SF-015", "SEM_STATE_CAPITAL", "ਬਿਹਾਰ", "ਪਟਨਾ", "ਪਟਨਾ ਬਿਹਾਰ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-008", "ANA-SF-016", "SEM_STATE_CAPITAL", "ਅਸਾਮ", "ਦਿਸਪੁਰ", "ਦਿਸਪੁਰ ਅਸਾਮ ਦੀ ਰਾਜਧਾਨੀ ਹੈ।"),
  fact("ANA-PA-SF-009", "ANA-SF-025", "SEM_COUNTRY_CURRENCY", "ਜਪਾਨ", "ਯੇਨ", "ਜਪਾਨ ਦੀ ਮੁਦਰਾ ਯੇਨ ਹੈ।"),
  fact("ANA-PA-SF-010", "ANA-SF-026", "SEM_COUNTRY_CURRENCY", "ਯੂਨਾਈਟਿਡ ਕਿੰਗਡਮ", "ਪਾਊਂਡ ਸਟਰਲਿੰਗ", "ਯੂਨਾਈਟਿਡ ਕਿੰਗਡਮ ਦੀ ਮੁਦਰਾ ਪਾਊਂਡ ਸਟਰਲਿੰਗ ਹੈ।"),
  fact("ANA-PA-SF-011", "ANA-SF-027", "SEM_COUNTRY_CURRENCY", "ਬੰਗਲਾਦੇਸ਼", "ਟਕਾ", "ਬੰਗਲਾਦੇਸ਼ ਦੀ ਮੁਦਰਾ ਟਕਾ ਹੈ।"),
  fact("ANA-PA-SF-012", "ANA-SF-028", "SEM_COUNTRY_CURRENCY", "ਨੇਪਾਲ", "ਨੇਪਾਲੀ ਰੁਪਇਆ", "ਨੇਪਾਲ ਦੀ ਮੁਦਰਾ ਨੇਪਾਲੀ ਰੁਪਇਆ ਹੈ।"),
];
