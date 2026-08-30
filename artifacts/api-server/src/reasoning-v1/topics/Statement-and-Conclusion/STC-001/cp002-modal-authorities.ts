import type { StcModalScenarioAuthority } from "./types.ts";
import { modalClaim } from "./modal-strength-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_CP002_MODAL_AUTHORITIES: readonly StcModalScenarioAuthority[] = [
  {
    id: "STC-SC-013",
    qlId: "STC-QL-004",
    difficulty: "MEDIUM",
    statement: t(
      "The revised schedule will definitely be published today.",
      "संशोधित समय-सारिणी आज निश्चित रूप से प्रकाशित होगी।",
      "ਸੋਧਿਆ ਹੋਇਆ ਸਮਾਂ-ਸਾਰਣੀ ਅੱਜ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਵੇਗੀ।",
    ),
    premise: modalClaim("schedule_published_today", "CERTAIN"),
    candidates: [
      { id: "C1", claim: modalClaim("schedule_published_today", "CERTAIN"), text: t("The revised schedule will be published today.", "संशोधित समय-सारिणी आज प्रकाशित होगी।", "ਸੋਧਿਆ ਹੋਇਆ ਸਮਾਂ-ਸਾਰਣੀ ਅੱਜ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਵੇਗੀ।") },
      { id: "C2", claim: modalClaim("schedule_published_today", "POSSIBLE"), text: t("The revised schedule may be published today.", "संभव है कि संशोधित समय-सारिणी आज प्रकाशित हो।", "ਸੰਭਵ ਹੈ ਕਿ ਸੋਧਿਆ ਹੋਇਆ ਸਮਾਂ-ਸਾਰਣੀ ਅੱਜ ਪ੍ਰਕਾਸ਼ਿਤ ਹੋਵੇ।") },
      { id: "C3", claim: modalClaim("schedule_published_today", "CERTAIN", "NEGATIVE"), text: t("The revised schedule definitely will not be published today.", "संशोधित समय-सारिणी आज निश्चित रूप से प्रकाशित नहीं होगी।", "ਸੋਧਿਆ ਹੋਇਆ ਸਮਾਂ-ਸਾਰਣੀ ਅੱਜ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਪ੍ਰਕਾਸ਼ਿਤ ਨਹੀਂ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", claim: modalClaim("exam_postponed", "CERTAIN"), text: t("The examination will definitely be postponed.", "परीक्षा निश्चित रूप से स्थगित होगी।", "ਪਰੀਖਿਆ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਮੁਲਤਵੀ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-014",
    qlId: "STC-QL-004",
    difficulty: "HARD",
    statement: t(
      "The interview date may be changed after administrative review.",
      "प्रशासनिक समीक्षा के बाद साक्षात्कार की तिथि बदली जा सकती है।",
      "ਪ੍ਰਸ਼ਾਸਕੀ ਸਮੀਖਿਆ ਤੋਂ ਬਾਅਦ ਇੰਟਰਵਿਊ ਦੀ ਤਾਰੀਖ ਬਦਲੀ ਜਾ ਸਕਦੀ ਹੈ।",
    ),
    premise: modalClaim("interview_date_changed", "POSSIBLE"),
    candidates: [
      { id: "C1", claim: modalClaim("interview_date_changed", "POSSIBLE"), text: t("The interview date may change.", "साक्षात्कार की तिथि बदल सकती है।", "ਇੰਟਰਵਿਊ ਦੀ ਤਾਰੀਖ ਬਦਲ ਸਕਦੀ ਹੈ।") },
      { id: "C2", claim: modalClaim("interview_date_changed", "POSSIBLE"), text: t("A change in the interview date remains possible.", "साक्षात्कार की तिथि में बदलाव की संभावना बनी हुई है।", "ਇੰਟਰਵਿਊ ਦੀ ਤਾਰੀਖ ਵਿੱਚ ਬਦਲਾਅ ਦੀ ਸੰਭਾਵਨਾ ਬਣੀ ਹੋਈ ਹੈ।") },
      { id: "C3", claim: modalClaim("interview_date_changed", "CERTAIN"), text: t("The interview date will definitely change.", "साक्षात्कार की तिथि निश्चित रूप से बदलेगी।", "ਇੰਟਰਵਿਊ ਦੀ ਤਾਰੀਖ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਬਦਲੇਗੀ।"), defectIfNotEntailed: "STRONGER_MODALITY" },
      { id: "C4", claim: modalClaim("interview_cancelled", "POSSIBLE"), text: t("The interview may be cancelled.", "साक्षात्कार रद्द हो सकता है।", "ਇੰਟਰਵਿਊ ਰੱਦ ਹੋ ਸਕਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-015",
    qlId: "STC-QL-004",
    difficulty: "MEDIUM",
    statement: t(
      "The sealed answer packets definitely cannot be opened before the authorized time.",
      "सीलबंद उत्तर पैकेट अधिकृत समय से पहले निश्चित रूप से नहीं खोले जा सकते।",
      "ਸੀਲ ਕੀਤੇ ਉੱਤਰ ਪੈਕੇਟ ਅਧਿਕਾਰਤ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਨਹੀਂ ਖੋਲ੍ਹੇ ਜਾ ਸਕਦੇ।",
    ),
    premise: modalClaim("packets_opened_early", "CERTAIN", "NEGATIVE"),
    candidates: [
      { id: "C1", claim: modalClaim("packets_opened_early", "CERTAIN", "NEGATIVE"), text: t("The packets cannot be opened before the authorized time.", "पैकेट अधिकृत समय से पहले नहीं खोले जा सकते।", "ਪੈਕੇਟ ਅਧਿਕਾਰਤ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਨਹੀਂ ਖੋਲ੍ਹੇ ਜਾ ਸਕਦੇ।") },
      { id: "C2", claim: modalClaim("packets_opened_early", "POSSIBLE", "NEGATIVE"), text: t("It is possible that the packets are not opened early.", "संभव है कि पैकेट समय से पहले न खोले जाएँ।", "ਸੰਭਵ ਹੈ ਕਿ ਪੈਕੇਟ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਨਾ ਖੋਲ੍ਹੇ ਜਾਣ।") },
      { id: "C3", claim: modalClaim("packets_opened_early", "CERTAIN"), text: t("The packets will definitely be opened early.", "पैकेट निश्चित रूप से समय से पहले खोले जाएँगे।", "ਪੈਕੇਟ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਸਮੇਂ ਤੋਂ ਪਹਿਲਾਂ ਖੋਲ੍ਹੇ ਜਾਣਗੇ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", claim: modalClaim("packets_recounted", "CERTAIN"), text: t("The packets will definitely be recounted.", "पैकेटों की निश्चित रूप से पुनर्गणना होगी।", "ਪੈਕੇਟਾਂ ਦੀ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਮੁੜ ਗਿਣਤੀ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-016",
    qlId: "STC-QL-004",
    difficulty: "HARD",
    statement: t(
      "The final merit list may not be released this week.",
      "अंतिम मेरिट सूची इस सप्ताह जारी न होने की संभावना है।",
      "ਅੰਤਿਮ ਮੈਰਿਟ ਸੂਚੀ ਇਸ ਹਫ਼ਤੇ ਜਾਰੀ ਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।",
    ),
    premise: modalClaim("merit_list_released_week", "POSSIBLE", "NEGATIVE"),
    candidates: [
      { id: "C1", claim: modalClaim("merit_list_released_week", "POSSIBLE", "NEGATIVE"), text: t("The merit list may not be released this week.", "संभव है कि मेरिट सूची इस सप्ताह जारी न हो।", "ਸੰਭਵ ਹੈ ਕਿ ਮੈਰਿਟ ਸੂਚੀ ਇਸ ਹਫ਼ਤੇ ਜਾਰੀ ਨਾ ਹੋਵੇ।") },
      { id: "C2", claim: modalClaim("merit_list_released_week", "POSSIBLE", "NEGATIVE"), text: t("Non-release of the merit list this week remains possible.", "इस सप्ताह मेरिट सूची जारी न होने की संभावना बनी हुई है।", "ਇਸ ਹਫ਼ਤੇ ਮੈਰਿਟ ਸੂਚੀ ਜਾਰੀ ਨਾ ਹੋਣ ਦੀ ਸੰਭਾਵਨਾ ਬਣੀ ਹੋਈ ਹੈ।") },
      { id: "C3", claim: modalClaim("merit_list_released_week", "CERTAIN", "NEGATIVE"), text: t("The merit list definitely will not be released this week.", "मेरिट सूची इस सप्ताह निश्चित रूप से जारी नहीं होगी।", "ਮੈਰਿਟ ਸੂਚੀ ਇਸ ਹਫ਼ਤੇ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਜਾਰੀ ਨਹੀਂ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "STRONGER_MODALITY" },
      { id: "C4", claim: modalClaim("merit_list_released_week", "CERTAIN"), text: t("The merit list will definitely be released this week.", "मेरिट सूची इस सप्ताह निश्चित रूप से जारी होगी।", "ਮੈਰਿਟ ਸੂਚੀ ਇਸ ਹਫ਼ਤੇ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਜਾਰੀ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
    ],
  },
] as const;
