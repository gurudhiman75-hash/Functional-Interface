import type { StcModalScenarioAuthority, StcScenarioAuthority } from "./types.ts";
import { modalClaim } from "./modal-strength-solver.ts";
import { atom, implies, not } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_EXAM_REALNESS_CONDITIONAL_AUTHORITIES: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-033",
    qlId: "STC-QL-003",
    difficulty: "MEDIUM",
    statement: t(
      "If the examination fee remains unpaid, the application is treated as incomplete. Rina has not paid the examination fee.",
      "यदि परीक्षा शुल्क जमा नहीं किया गया है, तो आवेदन अपूर्ण माना जाता है। रीना ने परीक्षा शुल्क जमा नहीं किया है।",
      "ਜੇ ਪ੍ਰੀਖਿਆ ਫੀਸ ਜਮ੍ਹਾਂ ਨਹੀਂ ਹੋਈ, ਤਾਂ ਅਰਜ਼ੀ ਅਧੂਰੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ। ਰੀਨਾ ਨੇ ਪ੍ਰੀਖਿਆ ਫੀਸ ਜਮ੍ਹਾਂ ਨਹੀਂ ਕੀਤੀ।",
    ),
    premises: [implies(atom("fee_unpaid"), atom("application_incomplete")), atom("fee_unpaid")],
    candidates: [
      { id: "C1", expression: atom("application_incomplete"), text: t("Rina's application is treated as incomplete.", "रीना का आवेदन अपूर्ण माना जाता है।", "ਰੀਨਾ ਦੀ ਅਰਜ਼ੀ ਅਧੂਰੀ ਮੰਨੀ ਜਾਂਦੀ ਹੈ।") },
      { id: "C2", expression: atom("fee_unpaid"), text: t("Rina has not paid the examination fee.", "रीना ने परीक्षा शुल्क जमा नहीं किया है।", "ਰੀਨਾ ਨੇ ਪ੍ਰੀਖਿਆ ਫੀਸ ਜਮ੍ਹਾਂ ਨਹੀਂ ਕੀਤੀ।") },
      { id: "C3", expression: not(atom("application_incomplete")), text: t("Rina's application is complete.", "रीना का आवेदन पूर्ण है।", "ਰੀਨਾ ਦੀ ਅਰਜ਼ੀ ਪੂਰੀ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("rinaa_disqualified"), text: t("Rina is disqualified from the examination.", "रीना परीक्षा से अयोग्य घोषित हो गई है।", "ਰੀਨਾ ਪ੍ਰੀਖਿਆ ਲਈ ਅਯੋਗ ਹੋ ਗਈ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-034",
    qlId: "STC-QL-003",
    difficulty: "HARD",
    statement: t(
      "If a candidate clears the preliminary test, the candidate becomes eligible for the main test. If eligible for the main test, the candidate receives a main-test admit card. Kabir has cleared the preliminary test.",
      "यदि अभ्यर्थी प्रारंभिक परीक्षा उत्तीर्ण करता है, तो वह मुख्य परीक्षा के लिए पात्र हो जाता है। मुख्य परीक्षा के लिए पात्र होने पर उसे मुख्य परीक्षा का प्रवेश पत्र मिलता है। कबीर ने प्रारंभिक परीक्षा उत्तीर्ण कर ली है।",
      "ਜੇ ਉਮੀਦਵਾਰ ਪ੍ਰਾਰੰਭਿਕ ਪ੍ਰੀਖਿਆ ਪਾਸ ਕਰਦਾ ਹੈ, ਤਾਂ ਉਹ ਮੁੱਖ ਪ੍ਰੀਖਿਆ ਲਈ ਯੋਗ ਹੋ ਜਾਂਦਾ ਹੈ। ਮੁੱਖ ਪ੍ਰੀਖਿਆ ਲਈ ਯੋਗ ਹੋਣ ਤੇ ਉਸ ਨੂੰ ਮੁੱਖ ਪ੍ਰੀਖਿਆ ਦਾ ਦਾਖਲਾ ਪੱਤਰ ਮਿਲਦਾ ਹੈ। ਕਬੀਰ ਨੇ ਪ੍ਰਾਰੰਭਿਕ ਪ੍ਰੀਖਿਆ ਪਾਸ ਕਰ ਲਈ ਹੈ।",
    ),
    premises: [
      implies(atom("prelim_cleared"), atom("mains_eligible")),
      implies(atom("mains_eligible"), atom("mains_admit_card")),
      atom("prelim_cleared"),
    ],
    candidates: [
      { id: "C1", expression: atom("mains_eligible"), text: t("Kabir is eligible for the main test.", "कबीर मुख्य परीक्षा के लिए पात्र है।", "ਕਬੀਰ ਮੁੱਖ ਪ੍ਰੀਖਿਆ ਲਈ ਯੋਗ ਹੈ।") },
      { id: "C2", expression: atom("mains_admit_card"), text: t("Kabir receives a main-test admit card.", "कबीर को मुख्य परीक्षा का प्रवेश पत्र मिलता है।", "ਕਬੀਰ ਨੂੰ ਮੁੱਖ ਪ੍ਰੀਖਿਆ ਦਾ ਦਾਖਲਾ ਪੱਤਰ ਮਿਲਦਾ ਹੈ।") },
      { id: "C3", expression: not(atom("mains_eligible")), text: t("Kabir is not eligible for the main test.", "कबीर मुख्य परीक्षा के लिए पात्र नहीं है।", "ਕਬੀਰ ਮੁੱਖ ਪ੍ਰੀਖਿਆ ਲਈ ਯੋਗ ਨਹੀਂ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("kabir_final_selected"), text: t("Kabir is finally selected.", "कबीर का अंतिम चयन हो गया है।", "ਕਬੀਰ ਦੀ ਅੰਤਿਮ ਚੋਣ ਹੋ ਗਈ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-035",
    qlId: "STC-QL-003",
    difficulty: "HARD",
    statement: t(
      "If an application contains a valid category certificate, the category claim is considered for reservation benefit.",
      "यदि आवेदन के साथ वैध श्रेणी प्रमाणपत्र है, तो आरक्षण लाभ के लिए श्रेणी दावे पर विचार किया जाता है।",
      "ਜੇ ਅਰਜ਼ੀ ਨਾਲ ਵੈਧ ਸ਼੍ਰੇਣੀ ਸਰਟੀਫਿਕੇਟ ਹੈ, ਤਾਂ ਰਾਖਵੇਂ ਲਾਭ ਲਈ ਸ਼੍ਰੇਣੀ ਦੇ ਦਾਅਵੇ ਤੇ ਵਿਚਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।",
    ),
    premises: [implies(atom("valid_category_certificate"), atom("reservation_claim_considered"))],
    candidates: [
      { id: "C1", expression: implies(atom("valid_category_certificate"), atom("reservation_claim_considered")), text: t("A valid category certificate is sufficient for the category claim to be considered for reservation benefit.", "वैध श्रेणी प्रमाणपत्र होने पर आरक्षण लाभ के लिए श्रेणी दावे पर विचार किया जाता है।", "ਵੈਧ ਸ਼੍ਰੇਣੀ ਸਰਟੀਫਿਕੇਟ ਹੋਣ ਤੇ ਰਾਖਵੇਂ ਲਾਭ ਲਈ ਸ਼੍ਰੇਣੀ ਦੇ ਦਾਅਵੇ ਤੇ ਵਿਚਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C2", expression: implies(atom("reservation_claim_considered"), atom("valid_category_certificate")), text: t("Whenever a category claim is considered, a valid category certificate must be present.", "जब भी श्रेणी दावे पर विचार किया जाए, वैध श्रेणी प्रमाणपत्र अवश्य मौजूद होता है।", "ਜਦੋਂ ਵੀ ਸ਼੍ਰੇਣੀ ਦੇ ਦਾਅਵੇ ਤੇ ਵਿਚਾਰ ਕੀਤਾ ਜਾਵੇ, ਵੈਧ ਸ਼੍ਰੇਣੀ ਸਰਟੀਫਿਕੇਟ ਲਾਜ਼ਮੀ ਮੌਜੂਦ ਹੁੰਦਾ ਹੈ।"), defectIfNotEntailed: "CONVERSE" },
      { id: "C3", expression: implies(not(atom("valid_category_certificate")), not(atom("reservation_claim_considered"))), text: t("Without a valid category certificate, the category claim can never be considered.", "वैध श्रेणी प्रमाणपत्र न होने पर श्रेणी दावे पर कभी विचार नहीं किया जा सकता।", "ਵੈਧ ਸ਼੍ਰੇਣੀ ਸਰਟੀਫਿਕੇਟ ਨਾ ਹੋਣ ਤੇ ਸ਼੍ਰੇਣੀ ਦੇ ਦਾਅਵੇ ਤੇ ਕਦੇ ਵਿਚਾਰ ਨਹੀਂ ਕੀਤਾ ਜਾ ਸਕਦਾ।"), defectIfNotEntailed: "INVERSE" },
      { id: "C4", expression: atom("reservation_benefit_granted"), text: t("Every considered category claim receives the reservation benefit.", "हर विचार किए गए श्रेणी दावे को आरक्षण लाभ मिल जाता है।", "ਹਰ ਵਿਚਾਰੇ ਗਏ ਸ਼੍ਰੇਣੀ ਦਾਅਵੇ ਨੂੰ ਰਾਖਵਾਂ ਲਾਭ ਮਿਲ ਜਾਂਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-036",
    qlId: "STC-QL-003",
    difficulty: "MEDIUM",
    statement: t(
      "If a severe-weather alert is active, the outdoor physical test is shifted indoors. A severe-weather alert is active today.",
      "यदि गंभीर मौसम चेतावनी सक्रिय है, तो बाहरी शारीरिक परीक्षा को अंदर स्थानांतरित कर दिया जाता है। आज गंभीर मौसम चेतावनी सक्रिय है।",
      "ਜੇ ਗੰਭੀਰ ਮੌਸਮ ਚੇਤਾਵਨੀ ਸਰਗਰਮ ਹੈ, ਤਾਂ ਬਾਹਰੀ ਸਰੀਰਕ ਟੈਸਟ ਨੂੰ ਅੰਦਰ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਅੱਜ ਗੰਭੀਰ ਮੌਸਮ ਚੇਤਾਵਨੀ ਸਰਗਰਮ ਹੈ।",
    ),
    premises: [implies(atom("weather_alert"), atom("physical_test_indoor")), atom("weather_alert")],
    candidates: [
      { id: "C1", expression: atom("physical_test_indoor"), text: t("Today's physical test is shifted indoors.", "आज की शारीरिक परीक्षा अंदर स्थानांतरित की जाती है।", "ਅੱਜ ਦਾ ਸਰੀਰਕ ਟੈਸਟ ਅੰਦਰ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C2", expression: atom("weather_alert"), text: t("A severe-weather alert is active today.", "आज गंभीर मौसम चेतावनी सक्रिय है।", "ਅੱਜ ਗੰਭੀਰ ਮੌਸਮ ਚੇਤਾਵਨੀ ਸਰਗਰਮ ਹੈ।") },
      { id: "C3", expression: not(atom("physical_test_indoor")), text: t("Today's physical test remains outdoors.", "आज की शारीरिक परीक्षा बाहर ही रहती है।", "ਅੱਜ ਦਾ ਸਰੀਰਕ ਟੈਸਟ ਬਾਹਰ ਹੀ ਰਹਿੰਦਾ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("physical_test_cancelled"), text: t("Today's physical test is cancelled.", "आज की शारीरिक परीक्षा रद्द कर दी गई है।", "ਅੱਜ ਦਾ ਸਰੀਰਕ ਟੈਸਟ ਰੱਦ ਕਰ ਦਿੱਤਾ ਗਿਆ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;

export const STC_EXAM_REALNESS_MODAL_AUTHORITIES: readonly StcModalScenarioAuthority[] = [
  {
    id: "STC-SC-037",
    qlId: "STC-QL-004",
    difficulty: "HARD",
    statement: t(
      "Publication of the district-wise vacancy list may be delayed.",
      "जिलावार रिक्ति सूची के प्रकाशन में देरी हो सकती है।",
      "ਜ਼ਿਲ੍ਹਾਵਾਰ ਖਾਲੀ ਅਸਾਮੀਆਂ ਦੀ ਸੂਚੀ ਜਾਰੀ ਹੋਣ ਵਿੱਚ ਦੇਰੀ ਹੋ ਸਕਦੀ ਹੈ।",
    ),
    premise: modalClaim("vacancy_list_delayed", "POSSIBLE"),
    candidates: [
      { id: "C1", claim: modalClaim("vacancy_list_delayed", "POSSIBLE"), text: t("A delay in publishing the vacancy list remains possible.", "रिक्ति सूची के प्रकाशन में देरी की संभावना बनी हुई है।", "ਖਾਲੀ ਅਸਾਮੀਆਂ ਦੀ ਸੂਚੀ ਜਾਰੀ ਹੋਣ ਵਿੱਚ ਦੇਰੀ ਦੀ ਸੰਭਾਵਨਾ ਬਣੀ ਹੋਈ ਹੈ।") },
      { id: "C2", claim: modalClaim("vacancy_list_delayed", "CERTAIN"), text: t("The vacancy list will definitely be delayed.", "रिक्ति सूची निश्चित रूप से देर से प्रकाशित होगी।", "ਖਾਲੀ ਅਸਾਮੀਆਂ ਦੀ ਸੂਚੀ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਦੇਰ ਨਾਲ ਜਾਰੀ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "STRONGER_MODALITY" },
      { id: "C3", claim: modalClaim("vacancy_list_delayed", "POSSIBLE", "NEGATIVE"), text: t("It is possible that the vacancy list will not be delayed.", "संभव है कि रिक्ति सूची के प्रकाशन में देरी न हो।", "ਸੰਭਵ ਹੈ ਕਿ ਖਾਲੀ ਅਸਾਮੀਆਂ ਦੀ ਸੂਚੀ ਜਾਰੀ ਹੋਣ ਵਿੱਚ ਦੇਰੀ ਨਾ ਹੋਵੇ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", claim: modalClaim("vacancies_reduced", "POSSIBLE"), text: t("The number of vacancies may be reduced.", "रिक्तियों की संख्या कम की जा सकती है।", "ਖਾਲੀ ਅਸਾਮੀਆਂ ਦੀ ਗਿਣਤੀ ਘਟ ਸਕਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-038",
    qlId: "STC-QL-004",
    difficulty: "MEDIUM",
    statement: t(
      "The document-verification camp will definitely open at 9 a.m. tomorrow.",
      "दस्तावेज़ सत्यापन शिविर कल सुबह 9 बजे निश्चित रूप से खुलेगा।",
      "ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਕੈਂਪ ਕੱਲ੍ਹ ਸਵੇਰੇ 9 ਵਜੇ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਖੁੱਲ੍ਹੇਗਾ।",
    ),
    premise: modalClaim("verification_camp_open_9", "CERTAIN"),
    candidates: [
      { id: "C1", claim: modalClaim("verification_camp_open_9", "CERTAIN"), text: t("The verification camp will open at 9 a.m. tomorrow.", "सत्यापन शिविर कल सुबह 9 बजे खुलेगा।", "ਜਾਂਚ ਕੈਂਪ ਕੱਲ੍ਹ ਸਵੇਰੇ 9 ਵਜੇ ਖੁੱਲ੍ਹੇਗਾ।") },
      { id: "C2", claim: modalClaim("verification_camp_open_9", "POSSIBLE"), text: t("The verification camp may open at 9 a.m. tomorrow.", "संभव है कि सत्यापन शिविर कल सुबह 9 बजे खुले।", "ਸੰਭਵ ਹੈ ਕਿ ਜਾਂਚ ਕੈਂਪ ਕੱਲ੍ਹ ਸਵੇਰੇ 9 ਵਜੇ ਖੁੱਲ੍ਹੇ।") },
      { id: "C3", claim: modalClaim("verification_camp_open_9", "CERTAIN", "NEGATIVE"), text: t("The verification camp definitely will not open at 9 a.m. tomorrow.", "सत्यापन शिविर कल सुबह 9 बजे निश्चित रूप से नहीं खुलेगा।", "ਜਾਂਚ ਕੈਂਪ ਕੱਲ੍ਹ ਸਵੇਰੇ 9 ਵਜੇ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਨਹੀਂ ਖੁੱਲ੍ਹੇਗਾ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", claim: modalClaim("verification_camp_close_5", "CERTAIN"), text: t("The verification camp will definitely close at 5 p.m.", "सत्यापन शिविर शाम 5 बजे निश्चित रूप से बंद होगा।", "ਜਾਂਚ ਕੈਂਪ ਸ਼ਾਮ 5 ਵਜੇ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਬੰਦ ਹੋਵੇਗਾ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-039",
    qlId: "STC-QL-004",
    difficulty: "HARD",
    statement: t(
      "The number of seats may not increase in the supplementary round.",
      "पूरक चरण में सीटों की संख्या न बढ़ने की संभावना है।",
      "ਵਾਧੂ ਦੌਰ ਵਿੱਚ ਸੀਟਾਂ ਦੀ ਗਿਣਤੀ ਨਾ ਵਧਣ ਦੀ ਸੰਭਾਵਨਾ ਹੈ।",
    ),
    premise: modalClaim("seats_increase_supplementary", "POSSIBLE", "NEGATIVE"),
    candidates: [
      { id: "C1", claim: modalClaim("seats_increase_supplementary", "POSSIBLE", "NEGATIVE"), text: t("It remains possible that the number of seats will not increase.", "सीटों की संख्या न बढ़ने की संभावना बनी हुई है।", "ਸੀਟਾਂ ਦੀ ਗਿਣਤੀ ਨਾ ਵਧਣ ਦੀ ਸੰਭਾਵਨਾ ਬਣੀ ਹੋਈ ਹੈ।") },
      { id: "C2", claim: modalClaim("seats_increase_supplementary", "CERTAIN", "NEGATIVE"), text: t("The number of seats definitely will not increase.", "सीटों की संख्या निश्चित रूप से नहीं बढ़ेगी।", "ਸੀਟਾਂ ਦੀ ਗਿਣਤੀ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਨਹੀਂ ਵਧੇਗੀ।"), defectIfNotEntailed: "STRONGER_MODALITY" },
      { id: "C3", claim: modalClaim("seats_increase_supplementary", "CERTAIN"), text: t("The number of seats will definitely increase.", "सीटों की संख्या निश्चित रूप से बढ़ेगी।", "ਸੀਟਾਂ ਦੀ ਗਿਣਤੀ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਵਧੇਗੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", claim: modalClaim("supplementary_round_cancelled", "POSSIBLE"), text: t("The supplementary round may be cancelled.", "पूरक चरण रद्द हो सकता है।", "ਵਾਧੂ ਦੌਰ ਰੱਦ ਹੋ ਸਕਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-040",
    qlId: "STC-QL-004",
    difficulty: "MEDIUM",
    statement: t(
      "The score-normalisation report will definitely be released before counselling begins.",
      "स्कोर सामान्यीकरण रिपोर्ट परामर्श शुरू होने से पहले निश्चित रूप से जारी की जाएगी।",
      "ਸਕੋਰ ਨਾਰਮਲਾਈਜ਼ੇਸ਼ਨ ਰਿਪੋਰਟ ਕਾਊਂਸਲਿੰਗ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਜਾਰੀ ਕੀਤੀ ਜਾਵੇਗੀ।",
    ),
    premise: modalClaim("normalisation_report_before_counselling", "CERTAIN"),
    candidates: [
      { id: "C1", claim: modalClaim("normalisation_report_before_counselling", "CERTAIN"), text: t("The normalisation report will be released before counselling begins.", "सामान्यीकरण रिपोर्ट परामर्श शुरू होने से पहले जारी की जाएगी।", "ਨਾਰਮਲਾਈਜ਼ੇਸ਼ਨ ਰਿਪੋਰਟ ਕਾਊਂਸਲਿੰਗ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਰੀ ਕੀਤੀ ਜਾਵੇਗੀ।") },
      { id: "C2", claim: modalClaim("normalisation_report_before_counselling", "POSSIBLE"), text: t("The normalisation report may be released before counselling begins.", "संभव है कि सामान्यीकरण रिपोर्ट परामर्श शुरू होने से पहले जारी हो।", "ਸੰਭਵ ਹੈ ਕਿ ਨਾਰਮਲਾਈਜ਼ੇਸ਼ਨ ਰਿਪੋਰਟ ਕਾਊਂਸਲਿੰਗ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਜਾਰੀ ਹੋਵੇ।") },
      { id: "C3", claim: modalClaim("normalisation_report_before_counselling", "CERTAIN", "NEGATIVE"), text: t("The normalisation report definitely will not be released before counselling begins.", "सामान्यीकरण रिपोर्ट परामर्श शुरू होने से पहले निश्चित रूप से जारी नहीं होगी।", "ਨਾਰਮਲਾਈਜ਼ੇਸ਼ਨ ਰਿਪੋਰਟ ਕਾਊਂਸਲਿੰਗ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਜਾਰੀ ਨਹੀਂ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", claim: modalClaim("counselling_online", "CERTAIN"), text: t("Counselling will definitely be conducted online.", "परामर्श निश्चित रूप से ऑनलाइन आयोजित होगा।", "ਕਾਊਂਸਲਿੰਗ ਨਿਸ਼ਚਿਤ ਤੌਰ ਤੇ ਆਨਲਾਈਨ ਕਰਵਾਈ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
