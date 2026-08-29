import type { StcOrderScenarioAuthority, StcTemporalScenarioAuthority } from "./types.ts";
import { orderClaim } from "./strict-order-solver.ts";
import { beforeClaim, trendClaim } from "./temporal-trend-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_EXAM_REALNESS_ORDER_AUTHORITIES: readonly StcOrderScenarioAuthority[] = [
  {
    id: "STC-SC-041",
    qlId: "STC-QL-005",
    difficulty: "MEDIUM",
    statement: t(
      "Candidate P has a higher merit rank than Candidate Q, and Candidate Q has a higher merit rank than Candidate R.",
      "अभ्यर्थी P की मेरिट रैंक अभ्यर्थी Q से ऊँची है और अभ्यर्थी Q की मेरिट रैंक अभ्यर्थी R से ऊँची है।",
      "ਉਮੀਦਵਾਰ P ਦੀ ਮੇਰਿਟ ਰੈਂਕ ਉਮੀਦਵਾਰ Q ਨਾਲੋਂ ਉੱਚੀ ਹੈ ਅਤੇ ਉਮੀਦਵਾਰ Q ਦੀ ਮੇਰਿਟ ਰੈਂਕ ਉਮੀਦਵਾਰ R ਨਾਲੋਂ ਉੱਚੀ ਹੈ।",
    ),
    premises: [orderClaim("merit_rank", "p", "q"), orderClaim("merit_rank", "q", "r")],
    candidates: [
      { id: "C1", claim: orderClaim("merit_rank", "p", "r"), text: t("Candidate P has a higher merit rank than Candidate R.", "अभ्यर्थी P की मेरिट रैंक अभ्यर्थी R से ऊँची है।", "ਉਮੀਦਵਾਰ P ਦੀ ਮੇਰਿਟ ਰੈਂਕ ਉਮੀਦਵਾਰ R ਨਾਲੋਂ ਉੱਚੀ ਹੈ।") },
      { id: "C2", claim: orderClaim("merit_rank", "q", "r"), text: t("Candidate Q has a higher merit rank than Candidate R.", "अभ्यर्थी Q की मेरिट रैंक अभ्यर्थी R से ऊँची है।", "ਉਮੀਦਵਾਰ Q ਦੀ ਮੇਰਿਟ ਰੈਂਕ ਉਮੀਦਵਾਰ R ਨਾਲੋਂ ਉੱਚੀ ਹੈ।") },
      { id: "C3", claim: orderClaim("merit_rank", "r", "p"), text: t("Candidate R has a higher merit rank than Candidate P.", "अभ्यर्थी R की मेरिट रैंक अभ्यर्थी P से ऊँची है।", "ਉਮੀਦਵਾਰ R ਦੀ ਮੇਰਿਟ ਰੈਂਕ ਉਮੀਦਵਾਰ P ਨਾਲੋਂ ਉੱਚੀ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("age", "p", "r"), text: t("Candidate P is older than Candidate R.", "अभ्यर्थी P, अभ्यर्थी R से आयु में बड़ा है।", "ਉਮੀਦਵਾਰ P, ਉਮੀਦਵਾਰ R ਨਾਲੋਂ ਉਮਰ ਵਿੱਚ ਵੱਡਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
  {
    id: "STC-SC-042",
    qlId: "STC-QL-005",
    difficulty: "HARD",
    statement: t(
      "Zone A has a higher cut-off score than Zone B, while Zone B has a higher cut-off score than Zone C.",
      "क्षेत्र A का कट-ऑफ अंक क्षेत्र B से अधिक है, जबकि क्षेत्र B का कट-ऑफ अंक क्षेत्र C से अधिक है।",
      "ਜ਼ੋਨ A ਦਾ ਕਟ-ਆਫ਼ ਅੰਕ ਜ਼ੋਨ B ਨਾਲੋਂ ਵੱਧ ਹੈ, ਜਦਕਿ ਜ਼ੋਨ B ਦਾ ਕਟ-ਆਫ਼ ਅੰਕ ਜ਼ੋਨ C ਨਾਲੋਂ ਵੱਧ ਹੈ।",
    ),
    premises: [orderClaim("cutoff", "zone_a", "zone_b"), orderClaim("cutoff", "zone_b", "zone_c")],
    candidates: [
      { id: "C1", claim: orderClaim("cutoff", "zone_a", "zone_c"), text: t("Zone A has a higher cut-off score than Zone C.", "क्षेत्र A का कट-ऑफ अंक क्षेत्र C से अधिक है।", "ਜ਼ੋਨ A ਦਾ ਕਟ-ਆਫ਼ ਅੰਕ ਜ਼ੋਨ C ਨਾਲੋਂ ਵੱਧ ਹੈ।") },
      { id: "C2", claim: orderClaim("cutoff", "zone_a", "zone_b"), text: t("Zone A has a higher cut-off score than Zone B.", "क्षेत्र A का कट-ऑफ अंक क्षेत्र B से अधिक है।", "ਜ਼ੋਨ A ਦਾ ਕਟ-ਆਫ਼ ਅੰਕ ਜ਼ੋਨ B ਨਾਲੋਂ ਵੱਧ ਹੈ।") },
      { id: "C3", claim: orderClaim("cutoff", "zone_c", "zone_a"), text: t("Zone C has a higher cut-off score than Zone A.", "क्षेत्र C का कट-ऑफ अंक क्षेत्र A से अधिक है।", "ਜ਼ੋਨ C ਦਾ ਕਟ-ਆਫ਼ ਅੰਕ ਜ਼ੋਨ A ਨਾਲੋਂ ਵੱਧ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("vacancies", "zone_a", "zone_c"), text: t("Zone A has more vacancies than Zone C.", "क्षेत्र A में क्षेत्र C से अधिक रिक्तियाँ हैं।", "ਜ਼ੋਨ A ਵਿੱਚ ਜ਼ੋਨ C ਨਾਲੋਂ ਵੱਧ ਖਾਲੀ ਅਸਾਮੀਆਂ ਹਨ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
  {
    id: "STC-SC-043",
    qlId: "STC-QL-005",
    difficulty: "MEDIUM",
    statement: t(
      "Centre K has a larger seating capacity than Centre L, and Centre L has a larger seating capacity than Centre M.",
      "केंद्र K की बैठने की क्षमता केंद्र L से अधिक है और केंद्र L की क्षमता केंद्र M से अधिक है।",
      "ਕੇਂਦਰ K ਦੀ ਬੈਠਕ ਸਮਰੱਥਾ ਕੇਂਦਰ L ਨਾਲੋਂ ਵੱਧ ਹੈ ਅਤੇ ਕੇਂਦਰ L ਦੀ ਸਮਰੱਥਾ ਕੇਂਦਰ M ਨਾਲੋਂ ਵੱਧ ਹੈ।",
    ),
    premises: [orderClaim("capacity", "k", "l"), orderClaim("capacity", "l", "m")],
    candidates: [
      { id: "C1", claim: orderClaim("capacity", "k", "m"), text: t("Centre K has a larger seating capacity than Centre M.", "केंद्र K की बैठने की क्षमता केंद्र M से अधिक है।", "ਕੇਂਦਰ K ਦੀ ਬੈਠਕ ਸਮਰੱਥਾ ਕੇਂਦਰ M ਨਾਲੋਂ ਵੱਧ ਹੈ।") },
      { id: "C2", claim: orderClaim("capacity", "l", "m"), text: t("Centre L has a larger seating capacity than Centre M.", "केंद्र L की बैठने की क्षमता केंद्र M से अधिक है।", "ਕੇਂਦਰ L ਦੀ ਬੈਠਕ ਸਮਰੱਥਾ ਕੇਂਦਰ M ਨਾਲੋਂ ਵੱਧ ਹੈ।") },
      { id: "C3", claim: orderClaim("capacity", "m", "k"), text: t("Centre M has a larger seating capacity than Centre K.", "केंद्र M की बैठने की क्षमता केंद्र K से अधिक है।", "ਕੇਂਦਰ M ਦੀ ਬੈਠਕ ਸਮਰੱਥਾ ਕੇਂਦਰ K ਨਾਲੋਂ ਵੱਧ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("distance", "k", "m"), text: t("Centre K is farther away than Centre M.", "केंद्र K, केंद्र M से अधिक दूर है।", "ਕੇਂਦਰ K, ਕੇਂਦਰ M ਨਾਲੋਂ ਵੱਧ ਦੂਰ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
  {
    id: "STC-SC-044",
    qlId: "STC-QL-005",
    difficulty: "HARD",
    statement: t(
      "Officer X is senior to Officer Y, and Officer Y is senior to Officer Z.",
      "अधिकारी X, अधिकारी Y से वरिष्ठ है और अधिकारी Y, अधिकारी Z से वरिष्ठ है।",
      "ਅਧਿਕਾਰੀ X, ਅਧਿਕਾਰੀ Y ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ ਅਤੇ ਅਧਿਕਾਰੀ Y, ਅਧਿਕਾਰੀ Z ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ।",
    ),
    premises: [orderClaim("seniority", "x", "y"), orderClaim("seniority", "y", "z")],
    candidates: [
      { id: "C1", claim: orderClaim("seniority", "x", "z"), text: t("Officer X is senior to Officer Z.", "अधिकारी X, अधिकारी Z से वरिष्ठ है।", "ਅਧਿਕਾਰੀ X, ਅਧਿਕਾਰੀ Z ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ।") },
      { id: "C2", claim: orderClaim("seniority", "x", "y"), text: t("Officer X is senior to Officer Y.", "अधिकारी X, अधिकारी Y से वरिष्ठ है।", "ਅਧਿਕਾਰੀ X, ਅਧਿਕਾਰੀ Y ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ।") },
      { id: "C3", claim: orderClaim("seniority", "z", "x"), text: t("Officer Z is senior to Officer X.", "अधिकारी Z, अधिकारी X से वरिष्ठ है।", "ਅਧਿਕਾਰੀ Z, ਅਧਿਕਾਰੀ X ਨਾਲੋਂ ਸੀਨੀਅਰ ਹੈ।"), defectIfNotEntailed: "REVERSED_ORDER" },
      { id: "C4", claim: orderClaim("salary", "x", "z"), text: t("Officer X has a higher salary than Officer Z.", "अधिकारी X का वेतन अधिकारी Z से अधिक है।", "ਅਧਿਕਾਰੀ X ਦੀ ਤਨਖਾਹ ਅਧਿਕਾਰੀ Z ਨਾਲੋਂ ਵੱਧ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_RELATION" },
    ],
  },
] as const;

export const STC_EXAM_REALNESS_TEMPORAL_AUTHORITIES: readonly StcTemporalScenarioAuthority[] = [
  {
    id: "STC-SC-045",
    qlId: "STC-QL-006",
    difficulty: "MEDIUM",
    statement: t(
      "The examination notice is published before registration begins, and registration begins before the examination date.",
      "परीक्षा सूचना पंजीकरण शुरू होने से पहले प्रकाशित होती है और पंजीकरण परीक्षा तिथि से पहले शुरू होता है।",
      "ਪ੍ਰੀਖਿਆ ਸੂਚਨਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਰੀ ਹੁੰਦੀ ਹੈ ਅਤੇ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਪ੍ਰੀਖਿਆ ਦੀ ਤਾਰੀਖ ਤੋਂ ਪਹਿਲਾਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
    ),
    premises: [beforeClaim("exam_notice", "registration_start"), beforeClaim("registration_start", "exam_date")],
    candidates: [
      { id: "C1", claim: beforeClaim("exam_notice", "exam_date"), text: t("The examination notice is published before the examination date.", "परीक्षा सूचना परीक्षा तिथि से पहले प्रकाशित होती है।", "ਪ੍ਰੀਖਿਆ ਸੂਚਨਾ ਪ੍ਰੀਖਿਆ ਦੀ ਤਾਰੀਖ ਤੋਂ ਪਹਿਲਾਂ ਜਾਰੀ ਹੁੰਦੀ ਹੈ।") },
      { id: "C2", claim: beforeClaim("exam_notice", "registration_start"), text: t("The examination notice is published before registration begins.", "परीक्षा सूचना पंजीकरण शुरू होने से पहले प्रकाशित होती है।", "ਪ੍ਰੀਖਿਆ ਸੂਚਨਾ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਰੀ ਹੁੰਦੀ ਹੈ।") },
      { id: "C3", claim: beforeClaim("exam_date", "exam_notice"), text: t("The examination date comes before publication of the notice.", "परीक्षा तिथि सूचना के प्रकाशन से पहले आती है।", "ਪ੍ਰੀਖਿਆ ਦੀ ਤਾਰੀਖ ਸੂਚਨਾ ਜਾਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਆਉਂਦੀ ਹੈ।"), defectIfNotEntailed: "REVERSED_TIME" },
      { id: "C4", claim: beforeClaim("fee_payment", "exam_date"), text: t("Fee payment takes place before the examination date.", "शुल्क भुगतान परीक्षा तिथि से पहले होता है।", "ਫੀਸ ਭੁਗਤਾਨ ਪ੍ਰੀਖਿਆ ਦੀ ਤਾਰੀਖ ਤੋਂ ਪਹਿਲਾਂ ਹੁੰਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-046",
    qlId: "STC-QL-006",
    difficulty: "HARD",
    statement: t(
      "Attendance increased from the first session to the second session and increased again from the second session to the third session.",
      "उपस्थिति पहले सत्र से दूसरे सत्र तक बढ़ी और दूसरे सत्र से तीसरे सत्र तक फिर बढ़ी।",
      "ਹਾਜ਼ਰੀ ਪਹਿਲੇ ਸੈਸ਼ਨ ਤੋਂ ਦੂਜੇ ਸੈਸ਼ਨ ਤੱਕ ਵਧੀ ਅਤੇ ਦੂਜੇ ਸੈਸ਼ਨ ਤੋਂ ਤੀਜੇ ਸੈਸ਼ਨ ਤੱਕ ਫਿਰ ਵਧੀ।",
    ),
    premises: [trendClaim("attendance", "s1", "s2", "INCREASED"), trendClaim("attendance", "s2", "s3", "INCREASED")],
    candidates: [
      { id: "C1", claim: trendClaim("attendance", "s1", "s3", "INCREASED"), text: t("Attendance was higher in the third session than in the first session.", "तीसरे सत्र में उपस्थिति पहले सत्र से अधिक थी।", "ਤੀਜੇ ਸੈਸ਼ਨ ਵਿੱਚ ਹਾਜ਼ਰੀ ਪਹਿਲੇ ਸੈਸ਼ਨ ਨਾਲੋਂ ਵੱਧ ਸੀ।") },
      { id: "C2", claim: trendClaim("attendance", "s2", "s3", "INCREASED"), text: t("Attendance increased from the second session to the third session.", "उपस्थिति दूसरे सत्र से तीसरे सत्र तक बढ़ी।", "ਹਾਜ਼ਰੀ ਦੂਜੇ ਸੈਸ਼ਨ ਤੋਂ ਤੀਜੇ ਸੈਸ਼ਨ ਤੱਕ ਵਧੀ।") },
      { id: "C3", claim: trendClaim("attendance", "s1", "s3", "DECREASED"), text: t("Attendance was lower in the third session than in the first session.", "तीसरे सत्र में उपस्थिति पहले सत्र से कम थी।", "ਤੀਜੇ ਸੈਸ਼ਨ ਵਿੱਚ ਹਾਜ਼ਰੀ ਪਹਿਲੇ ਸੈਸ਼ਨ ਨਾਲੋਂ ਘੱਟ ਸੀ।"), defectIfNotEntailed: "REVERSED_TREND" },
      { id: "C4", claim: trendClaim("average_score", "s1", "s3", "INCREASED"), text: t("The average score increased from the first session to the third session.", "औसत अंक पहले सत्र से तीसरे सत्र तक बढ़े।", "ਔਸਤ ਅੰਕ ਪਹਿਲੇ ਸੈਸ਼ਨ ਤੋਂ ਤੀਜੇ ਸੈਸ਼ਨ ਤੱਕ ਵਧੇ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-047",
    qlId: "STC-QL-006",
    difficulty: "HARD",
    statement: t(
      "The error rate decreased from the first audit to the second audit and decreased further from the second audit to the third audit.",
      "त्रुटि दर पहले ऑडिट से दूसरे ऑडिट तक घटी और दूसरे ऑडिट से तीसरे ऑडिट तक और घटी।",
      "ਗਲਤੀ ਦਰ ਪਹਿਲੇ ਆਡਿਟ ਤੋਂ ਦੂਜੇ ਆਡਿਟ ਤੱਕ ਘਟੀ ਅਤੇ ਦੂਜੇ ਆਡਿਟ ਤੋਂ ਤੀਜੇ ਆਡਿਟ ਤੱਕ ਹੋਰ ਘਟੀ।",
    ),
    premises: [trendClaim("error_rate", "a1", "a2", "DECREASED"), trendClaim("error_rate", "a2", "a3", "DECREASED")],
    candidates: [
      { id: "C1", claim: trendClaim("error_rate", "a1", "a3", "DECREASED"), text: t("The error rate was lower in the third audit than in the first audit.", "तीसरे ऑडिट में त्रुटि दर पहले ऑडिट से कम थी।", "ਤੀਜੇ ਆਡਿਟ ਵਿੱਚ ਗਲਤੀ ਦਰ ਪਹਿਲੇ ਆਡਿਟ ਨਾਲੋਂ ਘੱਟ ਸੀ।") },
      { id: "C2", claim: trendClaim("error_rate", "a2", "a3", "DECREASED"), text: t("The error rate decreased from the second audit to the third audit.", "त्रुटि दर दूसरे ऑडिट से तीसरे ऑडिट तक घटी।", "ਗਲਤੀ ਦਰ ਦੂਜੇ ਆਡਿਟ ਤੋਂ ਤੀਜੇ ਆਡਿਟ ਤੱਕ ਘਟੀ।") },
      { id: "C3", claim: trendClaim("error_rate", "a1", "a3", "INCREASED"), text: t("The error rate was higher in the third audit than in the first audit.", "तीसरे ऑडिट में त्रुटि दर पहले ऑडिट से अधिक थी।", "ਤੀਜੇ ਆਡਿਟ ਵਿੱਚ ਗਲਤੀ ਦਰ ਪਹਿਲੇ ਆਡਿਟ ਨਾਲੋਂ ਵੱਧ ਸੀ।"), defectIfNotEntailed: "REVERSED_TREND" },
      { id: "C4", claim: trendClaim("cases_checked", "a1", "a3", "INCREASED"), text: t("The number of cases checked increased from the first audit to the third audit.", "जाँचे गए मामलों की संख्या पहले ऑडिट से तीसरे ऑडिट तक बढ़ी।", "ਜਾਂਚੇ ਗਏ ਮਾਮਲਿਆਂ ਦੀ ਗਿਣਤੀ ਪਹਿਲੇ ਆਡਿਟ ਤੋਂ ਤੀਜੇ ਆਡਿਟ ਤੱਕ ਵਧੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-048",
    qlId: "STC-QL-006",
    difficulty: "MEDIUM",
    statement: t(
      "Document verification is completed before the medical examination, and the medical examination is completed before appointment letters are issued.",
      "दस्तावेज़ सत्यापन चिकित्सा परीक्षण से पहले पूरा होता है और चिकित्सा परीक्षण नियुक्ति पत्र जारी होने से पहले पूरा होता है।",
      "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਮੈਡੀਕਲ ਜਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ ਅਤੇ ਮੈਡੀਕਲ ਜਾਂਚ ਨਿਯੁਕਤੀ ਪੱਤਰ ਜਾਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।",
    ),
    premises: [beforeClaim("document_verification", "medical_exam"), beforeClaim("medical_exam", "appointment_letter")],
    candidates: [
      { id: "C1", claim: beforeClaim("document_verification", "appointment_letter"), text: t("Document verification is completed before appointment letters are issued.", "दस्तावेज़ सत्यापन नियुक्ति पत्र जारी होने से पहले पूरा होता है।", "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਨਿਯੁਕਤੀ ਪੱਤਰ ਜਾਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।") },
      { id: "C2", claim: beforeClaim("medical_exam", "appointment_letter"), text: t("The medical examination is completed before appointment letters are issued.", "चिकित्सा परीक्षण नियुक्ति पत्र जारी होने से पहले पूरा होता है।", "ਮੈਡੀਕਲ ਜਾਂਚ ਨਿਯੁਕਤੀ ਪੱਤਰ ਜਾਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।") },
      { id: "C3", claim: beforeClaim("appointment_letter", "document_verification"), text: t("Appointment letters are issued before document verification.", "नियुक्ति पत्र दस्तावेज़ सत्यापन से पहले जारी होते हैं।", "ਨਿਯੁਕਤੀ ਪੱਤਰ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਤੋਂ ਪਹਿਲਾਂ ਜਾਰੀ ਹੁੰਦੇ ਹਨ।"), defectIfNotEntailed: "REVERSED_TIME" },
      { id: "C4", claim: beforeClaim("police_verification", "appointment_letter"), text: t("Police verification is completed before appointment letters are issued.", "पुलिस सत्यापन नियुक्ति पत्र जारी होने से पहले पूरा होता है।", "ਪੁਲਿਸ ਜਾਂਚ ਨਿਯੁਕਤੀ ਪੱਤਰ ਜਾਰੀ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਪੂਰੀ ਹੁੰਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
