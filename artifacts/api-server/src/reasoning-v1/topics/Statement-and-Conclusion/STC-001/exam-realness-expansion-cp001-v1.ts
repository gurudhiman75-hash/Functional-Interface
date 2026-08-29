import type { StcScenarioAuthority } from "./types.ts";
import { and, atom, not, or } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_EXAM_REALNESS_CP001_AUTHORITIES: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-025",
    qlId: "STC-QL-001",
    difficulty: "EASY",
    statement: t(
      "The online fee-payment window closes at 6 p.m. on Friday.",
      "ऑनलाइन शुल्क भुगतान की अवधि शुक्रवार शाम 6 बजे समाप्त होती है।",
      "ਆਨਲਾਈਨ ਫੀਸ ਭੁਗਤਾਨ ਦੀ ਮਿਆਦ ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ 6 ਵਜੇ ਖਤਮ ਹੁੰਦੀ ਹੈ।",
    ),
    premises: [atom("fee_window_closes_friday_6")],
    candidates: [
      { id: "C1", expression: atom("fee_window_closes_friday_6"), text: t("The fee-payment window remains open until 6 p.m. on Friday.", "शुल्क भुगतान की अवधि शुक्रवार शाम 6 बजे तक खुली रहती है।", "ਫੀਸ ਭੁਗਤਾਨ ਦੀ ਮਿਆਦ ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ 6 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।") },
      { id: "C2", expression: not(atom("fee_window_closes_friday_6")), text: t("The fee-payment window closes before 6 p.m. on Friday.", "शुल्क भुगतान की अवधि शुक्रवार शाम 6 बजे से पहले बंद हो जाती है।", "ਫੀਸ ਭੁਗਤਾਨ ਦੀ ਮਿਆਦ ਸ਼ੁੱਕਰਵਾਰ ਸ਼ਾਮ 6 ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਬੰਦ ਹੋ ਜਾਂਦੀ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("late_fee_allowed"), text: t("A late-fee payment is allowed after Friday.", "शुक्रवार के बाद विलंब शुल्क देकर भुगतान किया जा सकता है।", "ਸ਼ੁੱਕਰਵਾਰ ਤੋਂ ਬਾਅਦ ਲੇਟ ਫੀਸ ਦੇ ਕੇ ਭੁਗਤਾਨ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("fee_window_closes_midnight"), text: t("The fee-payment window stays open until midnight on Friday.", "शुल्क भुगतान की अवधि शुक्रवार आधी रात तक खुली रहती है।", "ਫੀਸ ਭੁਗਤਾਨ ਦੀ ਮਿਆਦ ਸ਼ੁੱਕਰਵਾਰ ਅੱਧੀ ਰਾਤ ਤੱਕ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।"), defectIfNotEntailed: "OVERCLAIM" },
    ],
  },
  {
    id: "STC-SC-026",
    qlId: "STC-QL-001",
    difficulty: "EASY",
    statement: t(
      "Admit cards are available only through the candidate portal.",
      "प्रवेश पत्र केवल अभ्यर्थी पोर्टल के माध्यम से उपलब्ध हैं।",
      "ਦਾਖਲਾ ਪੱਤਰ ਕੇਵਲ ਉਮੀਦਵਾਰ ਪੋਰਟਲ ਰਾਹੀਂ ਉਪਲਬਧ ਹਨ।",
    ),
    premises: [atom("admit_card_portal_only")],
    candidates: [
      { id: "C1", expression: atom("admit_card_portal_only"), text: t("Candidates must use the portal to obtain the admit card.", "प्रवेश पत्र प्राप्त करने के लिए अभ्यर्थी को पोर्टल का उपयोग करना होगा।", "ਦਾਖਲਾ ਪੱਤਰ ਪ੍ਰਾਪਤ ਕਰਨ ਲਈ ਉਮੀਦਵਾਰ ਨੂੰ ਪੋਰਟਲ ਵਰਤਣਾ ਹੋਵੇਗਾ।") },
      { id: "C2", expression: not(atom("admit_card_portal_only")), text: t("Admit cards are also issued at examination centres.", "प्रवेश पत्र परीक्षा केंद्रों पर भी जारी किए जाते हैं।", "ਦਾਖਲਾ ਪੱਤਰ ਪ੍ਰੀਖਿਆ ਕੇਂਦਰਾਂ ਤੇ ਵੀ ਜਾਰੀ ਕੀਤੇ ਜਾਂਦੇ ਹਨ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("portal_open_24_hours"), text: t("The candidate portal is available twenty-four hours a day.", "अभ्यर्थी पोर्टल चौबीसों घंटे उपलब्ध रहता है।", "ਉਮੀਦਵਾਰ ਪੋਰਟਲ ਚੌਵੀ ਘੰਟੇ ਉਪਲਬਧ ਰਹਿੰਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("admit_card_posted_home"), text: t("Admit cards are sent to every candidate by post.", "हर अभ्यर्थी को प्रवेश पत्र डाक से भेजा जाता है।", "ਹਰ ਉਮੀਦਵਾਰ ਨੂੰ ਦਾਖਲਾ ਪੱਤਰ ਡਾਕ ਰਾਹੀਂ ਭੇਜਿਆ ਜਾਂਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-027",
    qlId: "STC-QL-001",
    difficulty: "MEDIUM",
    statement: t(
      "Biometric verification is compulsory at the entry gate.",
      "प्रवेश द्वार पर बायोमेट्रिक सत्यापन अनिवार्य है।",
      "ਦਾਖਲਾ ਗੇਟ ਤੇ ਬਾਇਓਮੈਟ੍ਰਿਕ ਜਾਂਚ ਲਾਜ਼ਮੀ ਹੈ।",
    ),
    premises: [atom("biometric_gate_compulsory")],
    candidates: [
      { id: "C1", expression: atom("biometric_gate_compulsory"), text: t("Entry requires biometric verification at the gate.", "प्रवेश के लिए द्वार पर बायोमेट्रिक सत्यापन आवश्यक है।", "ਦਾਖਲੇ ਲਈ ਗੇਟ ਤੇ ਬਾਇਓਮੈਟ੍ਰਿਕ ਜਾਂਚ ਲਾਜ਼ਮੀ ਹੈ।") },
      { id: "C2", expression: not(atom("biometric_gate_compulsory")), text: t("Biometric verification at the gate is optional.", "द्वार पर बायोमेट्रिक सत्यापन वैकल्पिक है।", "ਗੇਟ ਤੇ ਬਾਇਓਮੈਟ੍ਰਿਕ ਜਾਂਚ ਚੋਣਵੀਂ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("photo_id_not_needed"), text: t("No photo identity document is required for entry.", "प्रवेश के लिए फोटो पहचान पत्र की आवश्यकता नहीं है।", "ਦਾਖਲੇ ਲਈ ਫੋਟੋ ਪਛਾਣ ਪੱਤਰ ਦੀ ਲੋੜ ਨਹੀਂ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("biometric_twice"), text: t("Every candidate undergoes biometric verification twice.", "हर अभ्यर्थी का बायोमेट्रिक सत्यापन दो बार होता है।", "ਹਰ ਉਮੀਦਵਾਰ ਦੀ ਬਾਇਓਮੈਟ੍ਰਿਕ ਜਾਂਚ ਦੋ ਵਾਰ ਹੁੰਦੀ ਹੈ।"), defectIfNotEntailed: "OVERCLAIM" },
    ],
  },
  {
    id: "STC-SC-028",
    qlId: "STC-QL-001",
    difficulty: "MEDIUM",
    statement: t(
      "The provisional answer key will be displayed on Wednesday.",
      "अस्थायी उत्तर कुंजी बुधवार को प्रदर्शित की जाएगी।",
      "ਅਸਥਾਈ ਉੱਤਰ ਕੁੰਜੀ ਬੁੱਧਵਾਰ ਨੂੰ ਜਾਰੀ ਕੀਤੀ ਜਾਵੇਗੀ।",
    ),
    premises: [atom("answer_key_wednesday")],
    candidates: [
      { id: "C1", expression: atom("answer_key_wednesday"), text: t("Wednesday is the scheduled day for displaying the provisional answer key.", "अस्थायी उत्तर कुंजी प्रदर्शित करने का निर्धारित दिन बुधवार है।", "ਅਸਥਾਈ ਉੱਤਰ ਕੁੰਜੀ ਜਾਰੀ ਕਰਨ ਲਈ ਨਿਰਧਾਰਤ ਦਿਨ ਬੁੱਧਵਾਰ ਹੈ।") },
      { id: "C2", expression: not(atom("answer_key_wednesday")), text: t("The provisional answer key will not be displayed on Wednesday.", "अस्थायी उत्तर कुंजी बुधवार को प्रदर्शित नहीं की जाएगी।", "ਅਸਥਾਈ ਉੱਤਰ ਕੁੰਜੀ ਬੁੱਧਵਾਰ ਨੂੰ ਜਾਰੀ ਨਹੀਂ ਕੀਤੀ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("objection_window_three_days"), text: t("Candidates will get three days to submit objections.", "अभ्यर्थियों को आपत्ति दर्ज करने के लिए तीन दिन मिलेंगे।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਇਤਰਾਜ਼ ਦਰਜ ਕਰਨ ਲਈ ਤਿੰਨ ਦਿਨ ਮਿਲਣਗੇ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("final_result_wednesday"), text: t("The final result will also be declared on Wednesday.", "अंतिम परिणाम भी बुधवार को घोषित किया जाएगा।", "ਅੰਤਿਮ ਨਤੀਜਾ ਵੀ ਬੁੱਧਵਾਰ ਨੂੰ ਐਲਾਨਿਆ ਜਾਵੇਗਾ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-029",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The application counter accepts UPI payments and debit-card payments.",
      "आवेदन काउंटर UPI भुगतान और डेबिट कार्ड भुगतान स्वीकार करता है।",
      "ਅਰਜ਼ੀ ਕਾਊਂਟਰ UPI ਭੁਗਤਾਨ ਅਤੇ ਡੈਬਿਟ ਕਾਰਡ ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਕਰਦਾ ਹੈ।",
    ),
    premises: [and(atom("upi_accepted"), atom("debit_accepted"))],
    candidates: [
      { id: "C1", expression: atom("upi_accepted"), text: t("UPI payment is accepted at the application counter.", "आवेदन काउंटर पर UPI भुगतान स्वीकार किया जाता है।", "ਅਰਜ਼ੀ ਕਾਊਂਟਰ ਤੇ UPI ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C2", expression: atom("debit_accepted"), text: t("Debit-card payment is accepted at the application counter.", "आवेदन काउंटर पर डेबिट कार्ड भुगतान स्वीकार किया जाता है।", "ਅਰਜ਼ੀ ਕਾਊਂਟਰ ਤੇ ਡੈਬਿਟ ਕਾਰਡ ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C3", expression: and(atom("upi_accepted"), atom("debit_accepted")), text: t("Both UPI and debit-card payments are accepted.", "UPI और डेबिट कार्ड दोनों से भुगतान स्वीकार किया जाता है।", "UPI ਅਤੇ ਡੈਬਿਟ ਕਾਰਡ ਦੋਵਾਂ ਰਾਹੀਂ ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C4", expression: atom("cash_accepted"), text: t("Cash payment is accepted at the application counter.", "आवेदन काउंटर पर नकद भुगतान स्वीकार किया जाता है।", "ਅਰਜ਼ੀ ਕਾਊਂਟਰ ਤੇ ਨਕਦ ਭੁਗਤਾਨ ਸਵੀਕਾਰ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-030",
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: t(
      "A candidate may submit the grievance online or at the district facilitation centre.",
      "अभ्यर्थी शिकायत ऑनलाइन या जिला सुविधा केंद्र पर जमा कर सकता है।",
      "ਉਮੀਦਵਾਰ ਸ਼ਿਕਾਇਤ ਆਨਲਾਈਨ ਜਾਂ ਜ਼ਿਲ੍ਹਾ ਸੁਵਿਧਾ ਕੇਂਦਰ ਤੇ ਜਮ੍ਹਾਂ ਕਰ ਸਕਦਾ ਹੈ।",
    ),
    premises: [or(atom("grievance_online"), atom("grievance_centre"))],
    candidates: [
      { id: "C1", expression: or(atom("grievance_online"), atom("grievance_centre")), text: t("At least one of the two stated grievance channels is available.", "बताए गए दो शिकायत माध्यमों में से कम-से-कम एक उपलब्ध है।", "ਦੱਸੇ ਗਏ ਦੋ ਸ਼ਿਕਾਇਤ ਮਾਧਿਅਮਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਉਪਲਬਧ ਹੈ।") },
      { id: "C2", expression: atom("grievance_online"), text: t("Every grievance must be submitted online.", "हर शिकायत केवल ऑनलाइन जमा करनी होगी।", "ਹਰ ਸ਼ਿਕਾਇਤ ਕੇਵਲ ਆਨਲਾਈਨ ਜਮ੍ਹਾਂ ਕਰਨੀ ਲਾਜ਼ਮੀ ਹੈ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C3", expression: and(atom("grievance_online"), atom("grievance_centre")), text: t("A grievance must be submitted through both channels.", "शिकायत दोनों माध्यमों से जमा करना अनिवार्य है।", "ਸ਼ਿਕਾਇਤ ਦੋਵਾਂ ਮਾਧਿਅਮਾਂ ਰਾਹੀਂ ਜਮ੍ਹਾਂ ਕਰਨੀ ਲਾਜ਼ਮੀ ਹੈ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("grievance_fee"), text: t("A fee is charged for submitting a grievance.", "शिकायत जमा करने के लिए शुल्क लिया जाता है।", "ਸ਼ਿਕਾਇਤ ਜਮ੍ਹਾਂ ਕਰਨ ਲਈ ਫੀਸ ਲੱਗਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-031",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "Candidates must carry the admit card and an original photo identity document to the examination hall.",
      "अभ्यर्थियों को परीक्षा कक्ष में प्रवेश पत्र और मूल फोटो पहचान पत्र दोनों साथ लाने होंगे।",
      "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਪ੍ਰੀਖਿਆ ਹਾਲ ਵਿੱਚ ਦਾਖਲਾ ਪੱਤਰ ਅਤੇ ਅਸਲ ਫੋਟੋ ਪਛਾਣ ਪੱਤਰ ਦੋਵੇਂ ਨਾਲ ਲਿਆਉਣੇ ਹੋਣਗੇ।",
    ),
    premises: [and(atom("carry_admit_card"), atom("carry_photo_id"))],
    candidates: [
      { id: "C1", expression: atom("carry_admit_card"), text: t("Candidates must carry the admit card.", "अभ्यर्थियों को प्रवेश पत्र साथ लाना होगा।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਦਾਖਲਾ ਪੱਤਰ ਨਾਲ ਲਿਆਉਣਾ ਹੋਵੇਗਾ।") },
      { id: "C2", expression: atom("carry_photo_id"), text: t("Candidates must carry an original photo identity document.", "अभ्यर्थियों को मूल फोटो पहचान पत्र साथ लाना होगा।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਅਸਲ ਫੋਟੋ ਪਛਾਣ ਪੱਤਰ ਨਾਲ ਲਿਆਉਣਾ ਹੋਵੇਗਾ।") },
      { id: "C3", expression: and(atom("carry_admit_card"), atom("carry_photo_id")), text: t("Both stated documents are required.", "बताए गए दोनों दस्तावेज़ आवश्यक हैं।", "ਦੱਸੇ ਗਏ ਦੋਵੇਂ ਦਸਤਾਵੇਜ਼ ਲਾਜ਼ਮੀ ਹਨ।") },
      { id: "C4", expression: atom("carry_two_photos"), text: t("Candidates must also carry two passport-size photographs.", "अभ्यर्थियों को दो पासपोर्ट आकार की तस्वीरें भी लानी होंगी।", "ਉਮੀਦਵਾਰਾਂ ਨੂੰ ਦੋ ਪਾਸਪੋਰਟ ਆਕਾਰ ਦੀਆਂ ਫੋਟੋਆਂ ਵੀ ਨਾਲ ਲਿਆਉਣੀਆਂ ਹੋਣਗੀਆਂ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-032",
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: t(
      "The result alert is sent through SMS or email to the registered contact details.",
      "परिणाम सूचना पंजीकृत संपर्क विवरण पर SMS या ईमेल के माध्यम से भेजी जाती है।",
      "ਨਤੀਜੇ ਦੀ ਸੂਚਨਾ ਰਜਿਸਟਰ ਕੀਤੇ ਸੰਪਰਕ ਵੇਰਵਿਆਂ ਤੇ SMS ਜਾਂ ਈਮੇਲ ਰਾਹੀਂ ਭੇਜੀ ਜਾਂਦੀ ਹੈ।",
    ),
    premises: [or(atom("result_sms"), atom("result_email"))],
    candidates: [
      { id: "C1", expression: or(atom("result_sms"), atom("result_email")), text: t("The result alert uses at least one of the two stated channels.", "परिणाम सूचना बताए गए दो माध्यमों में से कम-से-कम एक से भेजी जाती है।", "ਨਤੀਜੇ ਦੀ ਸੂਚਨਾ ਦੱਸੇ ਗਏ ਦੋ ਮਾਧਿਅਮਾਂ ਵਿੱਚੋਂ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਰਾਹੀਂ ਭੇਜੀ ਜਾਂਦੀ ਹੈ।") },
      { id: "C2", expression: atom("result_sms"), text: t("The result alert must always be sent by SMS.", "परिणाम सूचना हमेशा SMS से ही भेजी जाएगी।", "ਨਤੀਜੇ ਦੀ ਸੂਚਨਾ ਹਮੇਸ਼ਾਂ SMS ਰਾਹੀਂ ਹੀ ਭੇਜੀ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C3", expression: atom("result_email"), text: t("The result alert must always be sent by email.", "परिणाम सूचना हमेशा ईमेल से ही भेजी जाएगी।", "ਨਤੀਜੇ ਦੀ ਸੂਚਨਾ ਹਮੇਸ਼ਾਂ ਈਮੇਲ ਰਾਹੀਂ ਹੀ ਭੇਜੀ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("result_post"), text: t("A printed result alert is sent by post.", "परिणाम सूचना की मुद्रित प्रति डाक से भेजी जाती है।", "ਨਤੀਜੇ ਦੀ ਛਪੀ ਹੋਈ ਸੂਚਨਾ ਡਾਕ ਰਾਹੀਂ ਭੇਜੀ ਜਾਂਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
