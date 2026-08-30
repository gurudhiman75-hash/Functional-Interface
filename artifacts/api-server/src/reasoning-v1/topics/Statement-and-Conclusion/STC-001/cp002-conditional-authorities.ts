import type { StcScenarioAuthority } from "./types.ts";
import { atom, implies, not } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_CP002_CONDITIONAL_AUTHORITIES: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-009",
    qlId: "STC-QL-003",
    difficulty: "MEDIUM",
    statement: t(
      "If the application is complete, an acknowledgement is issued. The application is complete.",
      "यदि आवेदन पूर्ण है, तो पावती जारी की जाती है। आवेदन पूर्ण है।",
      "ਜੇ ਅਰਜ਼ੀ ਪੂਰੀ ਹੈ, ਤਾਂ ਪ੍ਰਾਪਤੀ-ਪੱਤਰ ਜਾਰੀ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਅਰਜ਼ੀ ਪੂਰੀ ਹੈ।",
    ),
    premises: [implies(atom("application_complete"), atom("ack_issued")), atom("application_complete")],
    candidates: [
      { id: "C1", expression: atom("ack_issued"), text: t("An acknowledgement is issued.", "पावती जारी की जाती है।", "ਪ੍ਰਾਪਤੀ-ਪੱਤਰ ਜਾਰੀ ਕੀਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C2", expression: atom("application_complete"), text: t("The application is complete.", "आवेदन पूर्ण है।", "ਅਰਜ਼ੀ ਪੂਰੀ ਹੈ।") },
      { id: "C3", expression: not(atom("ack_issued")), text: t("No acknowledgement is issued.", "कोई पावती जारी नहीं की जाती।", "ਕੋਈ ਪ੍ਰਾਪਤੀ-ਪੱਤਰ ਜਾਰੀ ਨਹੀਂ ਕੀਤਾ ਜਾਂਦਾ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("application_approved"), text: t("The application has been approved.", "आवेदन स्वीकृत हो गया है।", "ਅਰਜ਼ੀ ਮਨਜ਼ੂਰ ਹੋ ਗਈ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-010",
    qlId: "STC-QL-003",
    difficulty: "HARD",
    statement: t(
      "If document verification is completed, the file moves to final review. If the file moves to final review, a decision notice is prepared. Document verification is completed.",
      "यदि दस्तावेज़ सत्यापन पूरा हो जाता है, तो फ़ाइल अंतिम समीक्षा में जाती है। यदि फ़ाइल अंतिम समीक्षा में जाती है, तो निर्णय सूचना तैयार की जाती है। दस्तावेज़ सत्यापन पूरा हो चुका है।",
      "ਜੇ ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਪੂਰੀ ਹੋ ਜਾਂਦੀ ਹੈ, ਤਾਂ ਫ਼ਾਈਲ ਅੰਤਿਮ ਸਮੀਖਿਆ ਵੱਲ ਜਾਂਦੀ ਹੈ। ਜੇ ਫ਼ਾਈਲ ਅੰਤਿਮ ਸਮੀਖਿਆ ਵੱਲ ਜਾਂਦੀ ਹੈ, ਤਾਂ ਫ਼ੈਸਲਾ ਸੂਚਨਾ ਤਿਆਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ। ਦਸਤਾਵੇਜ਼ ਜਾਂਚ ਪੂਰੀ ਹੋ ਚੁੱਕੀ ਹੈ।",
    ),
    premises: [
      implies(atom("verification_complete"), atom("final_review")),
      implies(atom("final_review"), atom("decision_notice")),
      atom("verification_complete"),
    ],
    candidates: [
      { id: "C1", expression: atom("final_review"), text: t("The file moves to final review.", "फ़ाइल अंतिम समीक्षा में जाती है।", "ਫ਼ਾਈਲ ਅੰਤਿਮ ਸਮੀਖਿਆ ਵੱਲ ਜਾਂਦੀ ਹੈ।") },
      { id: "C2", expression: atom("decision_notice"), text: t("A decision notice is prepared.", "निर्णय सूचना तैयार की जाती है।", "ਫ਼ੈਸਲਾ ਸੂਚਨਾ ਤਿਆਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।") },
      { id: "C3", expression: not(atom("final_review")), text: t("The file does not move to final review.", "फ़ाइल अंतिम समीक्षा में नहीं जाती।", "ਫ਼ਾਈਲ ਅੰਤਿਮ ਸਮੀਖਿਆ ਵੱਲ ਨਹੀਂ ਜਾਂਦੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("decision_favourable"), text: t("The final decision will be favourable.", "अंतिम निर्णय अनुकूल होगा।", "ਅੰਤਿਮ ਫ਼ੈਸਲਾ ਹੱਕ ਵਿੱਚ ਹੋਵੇਗਾ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-011",
    qlId: "STC-QL-003",
    difficulty: "MEDIUM",
    statement: t(
      "If the security seal is broken, the packet is rejected. The security seal is broken.",
      "यदि सुरक्षा सील टूटी हुई है, तो पैकेट अस्वीकार कर दिया जाता है। सुरक्षा सील टूटी हुई है।",
      "ਜੇ ਸੁਰੱਖਿਆ ਸੀਲ ਟੁੱਟੀ ਹੋਈ ਹੈ, ਤਾਂ ਪੈਕੇਟ ਰੱਦ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ। ਸੁਰੱਖਿਆ ਸੀਲ ਟੁੱਟੀ ਹੋਈ ਹੈ।",
    ),
    premises: [implies(atom("seal_broken"), atom("packet_rejected")), atom("seal_broken")],
    candidates: [
      { id: "C1", expression: atom("packet_rejected"), text: t("The packet is rejected.", "पैकेट अस्वीकार कर दिया जाता है।", "ਪੈਕੇਟ ਰੱਦ ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ।") },
      { id: "C2", expression: atom("seal_broken"), text: t("The security seal is broken.", "सुरक्षा सील टूटी हुई है।", "ਸੁਰੱਖਿਆ ਸੀਲ ਟੁੱਟੀ ਹੋਈ ਹੈ।") },
      { id: "C3", expression: not(atom("packet_rejected")), text: t("The packet is accepted.", "पैकेट स्वीकार कर लिया जाता है।", "ਪੈਕੇਟ ਸਵੀਕਾਰ ਕਰ ਲਿਆ ਜਾਂਦਾ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C4", expression: atom("packet_opened_by_staff"), text: t("The packet was opened by staff.", "पैकेट कर्मचारियों ने खोला था।", "ਪੈਕੇਟ ਕਰਮਚਾਰੀਆਂ ਨੇ ਖੋਲ੍ਹਿਆ ਸੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-012",
    qlId: "STC-QL-003",
    difficulty: "HARD",
    statement: t(
      "If the server is under maintenance, online registration is unavailable.",
      "यदि सर्वर रखरखाव में है, तो ऑनलाइन पंजीकरण उपलब्ध नहीं होता।",
      "ਜੇ ਸਰਵਰ ਰਖ-ਰਖਾਅ ਹੇਠ ਹੈ, ਤਾਂ ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਉਪਲਬਧ ਨਹੀਂ ਹੁੰਦੀ।",
    ),
    premises: [implies(atom("server_maintenance"), not(atom("registration_available")))],
    candidates: [
      { id: "C1", expression: implies(atom("server_maintenance"), not(atom("registration_available"))), text: t("Server maintenance implies that online registration is unavailable.", "सर्वर रखरखाव होने पर ऑनलाइन पंजीकरण उपलब्ध नहीं रहता।", "ਸਰਵਰ ਰਖ-ਰਖਾਅ ਹੋਣ ਤੇ ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਉਪਲਬਧ ਨਹੀਂ ਰਹਿੰਦੀ।") },
      { id: "C2", expression: implies(not(atom("registration_available")), atom("server_maintenance")), text: t("Whenever online registration is unavailable, the server must be under maintenance.", "जब भी ऑनलाइन पंजीकरण उपलब्ध न हो, सर्वर अवश्य रखरखाव में होता है।", "ਜਦੋਂ ਵੀ ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਉਪਲਬਧ ਨਾ ਹੋਵੇ, ਸਰਵਰ ਲਾਜ਼ਮੀ ਰਖ-ਰਖਾਅ ਹੇਠ ਹੁੰਦਾ ਹੈ।"), defectIfNotEntailed: "CONVERSE" },
      { id: "C3", expression: implies(not(atom("server_maintenance")), atom("registration_available")), text: t("If the server is not under maintenance, online registration must be available.", "यदि सर्वर रखरखाव में नहीं है, तो ऑनलाइन पंजीकरण अवश्य उपलब्ध होगा।", "ਜੇ ਸਰਵਰ ਰਖ-ਰਖਾਅ ਹੇਠ ਨਹੀਂ ਹੈ, ਤਾਂ ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਲਾਜ਼ਮੀ ਉਪਲਬਧ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "INVERSE" },
      { id: "C4", expression: implies(atom("server_maintenance"), not(atom("registration_available"))), text: t("Online registration cannot remain available while the stated maintenance condition holds.", "बताई गई रखरखाव स्थिति में ऑनलाइन पंजीकरण उपलब्ध नहीं रह सकता।", "ਦੱਸੀ ਗਈ ਰਖ-ਰਖਾਅ ਸਥਿਤੀ ਦੌਰਾਨ ਆਨਲਾਈਨ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਉਪਲਬਧ ਨਹੀਂ ਰਹਿ ਸਕਦੀ।") },
    ],
  },
] as const;
