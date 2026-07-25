import type { LocalizedAnalogyFact } from "../../../localization/types";

function fact(id: string, canonicalFactId: string, relation: string, left: string, right: string, predicate: string): LocalizedAnalogyFact {
  return { id, canonicalFactId, relation, locale: "pa-IN", left, right, predicate, mode: "LANGUAGE_SPECIFIC", version: "1.0.0", status: "CURATED", reviewedByNativeSpeaker: false };
}

export const ANA_CP002_PA_SYNONYM_ANTONYM_FACTS: readonly LocalizedAnalogyFact[] = [
  fact("ANA-PA-LF-SYN-001", "ANA-LF-001", "LEX_SYNONYM", "ਤੇਜ਼", "ਫੁਰਤੀਲਾ", "ਫੁਰਤੀਲਾ, ਤੇਜ਼ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-SYN-002", "ANA-LF-002", "LEX_SYNONYM", "ਬਹਾਦਰ", "ਸਾਹਸੀ", "ਸਾਹਸੀ, ਬਹਾਦਰ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-SYN-003", "ANA-LF-003", "LEX_SYNONYM", "ਚੁੱਪ", "ਖਾਮੋਸ਼", "ਖਾਮੋਸ਼, ਚੁੱਪ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-SYN-004", "ANA-LF-004", "LEX_SYNONYM", "ਪੁਰਾਤਨ", "ਪ੍ਰਾਚੀਨ", "ਪ੍ਰਾਚੀਨ, ਪੁਰਾਤਨ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-SYN-005", "ANA-LF-005", "LEX_SYNONYM", "ਸ਼ੁਰੂ", "ਆਰੰਭ", "ਆਰੰਭ, ਸ਼ੁਰੂ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-SYN-006", "ANA-LF-006", "LEX_SYNONYM", "ਤਿਆਗਣਾ", "ਛੱਡਣਾ", "ਛੱਡਣਾ, ਤਿਆਗਣਾ ਦਾ ਸਮਾਨਾਰਥਕ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-ANT-001", "ANA-LF-013", "LEX_ANTONYM", "ਜਿੱਤ", "ਹਾਰ", "ਹਾਰ, ਜਿੱਤ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-ANT-002", "ANA-LF-014", "LEX_ANTONYM", "ਪੁਰਾਤਨ", "ਆਧੁਨਿਕ", "ਆਧੁਨਿਕ, ਪੁਰਾਤਨ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-ANT-003", "ANA-LF-015", "LEX_ANTONYM", "ਵਿਸਤਾਰ", "ਸੰਕੋਚ", "ਸੰਕੋਚ, ਵਿਸਤਾਰ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-ANT-004", "ANA-LF-016", "LEX_ANTONYM", "ਆਸ਼ਾਵਾਦੀ", "ਨਿਰਾਸ਼ਾਵਾਦੀ", "ਨਿਰਾਸ਼ਾਵਾਦੀ, ਆਸ਼ਾਵਾਦੀ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-ANT-005", "ANA-LF-017", "LEX_ANTONYM", "ਸਥਾਈ", "ਅਸਥਾਈ", "ਅਸਥਾਈ, ਸਥਾਈ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।"),
  fact("ANA-PA-LF-ANT-006", "ANA-LF-018", "LEX_ANTONYM", "ਪਾਰਦਰਸ਼ੀ", "ਅਪਾਰਦਰਸ਼ੀ", "ਅਪਾਰਦਰਸ਼ੀ, ਪਾਰਦਰਸ਼ੀ ਦਾ ਵਿਰੋਧੀ ਸ਼ਬਦ ਹੈ।"),
];
