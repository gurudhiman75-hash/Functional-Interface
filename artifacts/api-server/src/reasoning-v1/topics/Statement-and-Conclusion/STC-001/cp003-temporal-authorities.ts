import type { StcTemporalScenarioAuthority } from "./types.ts";
import { beforeClaim, trendClaim } from "./temporal-trend-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_CP003_TEMPORAL_AUTHORITIES: readonly StcTemporalScenarioAuthority[] = [
  {
    id: "STC-SC-021",
    qlId: "STC-QL-006",
    difficulty: "MEDIUM",
    statement: t("Document verification takes place before the interview, and the interview takes place before final selection.", "दस्तावेज़ सत्यापन साक्षात्कार से पहले होता है और साक्षात्कार अंतिम चयन से पहले होता है।", "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਇੰਟਰਵਿਊ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ ਅਤੇ ਇੰਟਰਵਿਊ ਅੰਤਿਮ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦਾ ਹੈ।"),
    premises: [beforeClaim("verification", "interview"), beforeClaim("interview", "selection")],
    candidates: [
      { id: "C1", claim: beforeClaim("verification", "selection"), text: t("Document verification takes place before final selection.", "दस्तावेज़ सत्यापन अंतिम चयन से पहले होता है।", "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਅੰਤਿਮ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ।") },
      { id: "C2", claim: beforeClaim("interview", "selection"), text: t("The interview takes place before final selection.", "साक्षात्कार अंतिम चयन से पहले होता है।", "ਇੰਟਰਵਿਊ ਅੰਤਿਮ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦਾ ਹੈ।") },
      { id: "C3", claim: beforeClaim("selection", "verification"), text: t("Final selection takes place before document verification.", "अंतिम चयन दस्तावेज़ सत्यापन से पहले होता है।", "ਅੰਤਿਮ ਚੋਣ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ।"), defectIfNotEntailed: "REVERSED_TIME" },
      { id: "C4", claim: beforeClaim("written_test", "selection"), text: t("The written test takes place before final selection.", "लिखित परीक्षा अंतिम चयन से पहले होती है।", "ਲਿਖਤੀ ਪਰੀਖਿਆ ਅੰਤਿਮ ਚੋਣ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-022",
    qlId: "STC-QL-006",
    difficulty: "HARD",
    statement: t("The number of applications increased from January to February and increased again from February to March.", "आवेदनों की संख्या जनवरी से फरवरी तक बढ़ी और फरवरी से मार्च तक फिर बढ़ी।", "ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਜਨਵਰੀ ਤੋਂ ਫ਼ਰਵਰੀ ਤੱਕ ਵਧੀ ਅਤੇ ਫ਼ਰਵਰੀ ਤੋਂ ਮਾਰਚ ਤੱਕ ਫਿਰ ਵਧੀ।"),
    premises: [trendClaim("applications", "jan", "feb", "INCREASED"), trendClaim("applications", "feb", "mar", "INCREASED")],
    candidates: [
      { id: "C1", claim: trendClaim("applications", "jan", "mar", "INCREASED"), text: t("Applications were higher in March than in January.", "मार्च में आवेदनों की संख्या जनवरी से अधिक थी।", "ਮਾਰਚ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਜਨਵਰੀ ਨਾਲੋਂ ਵੱਧ ਸੀ।") },
      { id: "C2", claim: trendClaim("applications", "feb", "mar", "INCREASED"), text: t("Applications increased from February to March.", "आवेदनों की संख्या फरवरी से मार्च तक बढ़ी।", "ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਫ਼ਰਵਰੀ ਤੋਂ ਮਾਰਚ ਤੱਕ ਵਧੀ।") },
      { id: "C3", claim: trendClaim("applications", "jan", "mar", "DECREASED"), text: t("Applications were lower in March than in January.", "मार्च में आवेदनों की संख्या जनवरी से कम थी।", "ਮਾਰਚ ਵਿੱਚ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਜਨਵਰੀ ਨਾਲੋਂ ਘੱਟ ਸੀ।"), defectIfNotEntailed: "REVERSED_TREND" },
      { id: "C4", claim: trendClaim("vacancies", "jan", "mar", "INCREASED"), text: t("Vacancies increased from January to March.", "रिक्तियों की संख्या जनवरी से मार्च तक बढ़ी।", "ਖਾਲੀ ਅਸਾਮੀਆਂ ਦੀ ਗਿਣਤੀ ਜਨਵਰੀ ਤੋਂ ਮਾਰਚ ਤੱਕ ਵਧੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-023",
    qlId: "STC-QL-006",
    difficulty: "HARD",
    statement: t("Pending complaints decreased from April to May and decreased further from May to June.", "लंबित शिकायतें अप्रैल से मई तक घटीं और मई से जून तक और घटीं।", "ਬਕਾਇਆ ਸ਼ਿਕਾਇਤਾਂ ਅਪ੍ਰੈਲ ਤੋਂ ਮਈ ਤੱਕ ਘਟੀਆਂ ਅਤੇ ਮਈ ਤੋਂ ਜੂਨ ਤੱਕ ਹੋਰ ਘਟੀਆਂ।"),
    premises: [trendClaim("complaints", "apr", "may", "DECREASED"), trendClaim("complaints", "may", "jun", "DECREASED")],
    candidates: [
      { id: "C1", claim: trendClaim("complaints", "apr", "jun", "DECREASED"), text: t("Pending complaints were lower in June than in April.", "जून में लंबित शिकायतें अप्रैल से कम थीं।", "ਜੂਨ ਵਿੱਚ ਬਕਾਇਆ ਸ਼ਿਕਾਇਤਾਂ ਅਪ੍ਰੈਲ ਨਾਲੋਂ ਘੱਟ ਸਨ।") },
      { id: "C2", claim: trendClaim("complaints", "may", "jun", "DECREASED"), text: t("Pending complaints decreased from May to June.", "लंबित शिकायतें मई से जून तक घटीं।", "ਬਕਾਇਆ ਸ਼ਿਕਾਇਤਾਂ ਮਈ ਤੋਂ ਜੂਨ ਤੱਕ ਘਟੀਆਂ।") },
      { id: "C3", claim: trendClaim("complaints", "apr", "jun", "INCREASED"), text: t("Pending complaints were higher in June than in April.", "जून में लंबित शिकायतें अप्रैल से अधिक थीं।", "ਜੂਨ ਵਿੱਚ ਬਕਾਇਆ ਸ਼ਿਕਾਇਤਾਂ ਅਪ੍ਰੈਲ ਨਾਲੋਂ ਵੱਧ ਸਨ।"), defectIfNotEntailed: "REVERSED_TREND" },
      { id: "C4", claim: trendClaim("resolved_cases", "apr", "jun", "INCREASED"), text: t("Resolved cases increased from April to June.", "निपटाए गए मामलों की संख्या अप्रैल से जून तक बढ़ी।", "ਨਿਪਟਾਏ ਗਏ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਅਪ੍ਰੈਲ ਤੋਂ ਜੂਨ ਤੱਕ ਵਧੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-024",
    qlId: "STC-QL-006",
    difficulty: "MEDIUM",
    statement: t("The notification is published before registration opens, and registration opens before the last date for applying.", "अधिसूचना पंजीकरण खुलने से पहले प्रकाशित होती है और पंजीकरण आवेदन की अंतिम तिथि से पहले खुलता है।", "ਨੋਟੀਫਿਕੇਸ਼ਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਖੁੱਲ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ ਪ੍ਰਕਾਸ਼ਿਤ ਹੁੰਦਾ ਹੈ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਅਰਜ਼ੀ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਖੁੱਲ੍ਹਦੀ ਹੈ।"),
    premises: [beforeClaim("notification", "registration"), beforeClaim("registration", "deadline")],
    candidates: [
      { id: "C1", claim: beforeClaim("notification", "deadline"), text: t("The notification is published before the application deadline.", "अधिसूचना आवेदन की अंतिम तिथि से पहले प्रकाशित होती है।", "ਨੋਟੀਫਿਕੇਸ਼ਨ ਅਰਜ਼ੀ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਪ੍ਰਕਾਸ਼ਿਤ ਹੁੰਦਾ ਹੈ।") },
      { id: "C2", claim: beforeClaim("notification", "registration"), text: t("The notification is published before registration opens.", "अधिसूचना पंजीकरण खुलने से पहले प्रकाशित होती है।", "ਨੋਟੀਫਿਕੇਸ਼ਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਖੁੱਲ੍ਹਣ ਤੋਂ ਪਹਿਲਾਂ ਪ੍ਰਕਾਸ਼ਿਤ ਹੁੰਦਾ ਹੈ।") },
      { id: "C3", claim: beforeClaim("deadline", "notification"), text: t("The application deadline comes before the notification.", "आवेदन की अंतिम तिथि अधिसूचना से पहले आती है।", "ਅਰਜ਼ੀ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ ਨੋਟੀਫਿਕੇਸ਼ਨ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦੀ ਹੈ।"), defectIfNotEntailed: "REVERSED_TIME" },
      { id: "C4", claim: beforeClaim("exam", "deadline"), text: t("The examination takes place before the application deadline.", "परीक्षा आवेदन की अंतिम तिथि से पहले होती है।", "ਪਰੀਖਿਆ ਅਰਜ਼ੀ ਦੀ ਆਖ਼ਰੀ ਮਿਤੀ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
