import type { StcScenarioAuthority } from "./types.ts";
import { and, atom, not, or } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_CP001_AUTHORITIES: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-001",
    qlId: "STC-QL-001",
    difficulty: "EASY",
    statement: t(
      "The district library remains open until 8 p.m. on weekdays.",
      "जिला पुस्तकालय कार्यदिवसों में रात 8 बजे तक खुला रहता है।",
      "ਜ਼ਿਲ੍ਹਾ ਲਾਇਬ੍ਰੇਰੀ ਕੰਮ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਰਾਤ 8 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।",
    ),
    premises: [atom("library_open_until_8")],
    candidates: [
      { id: "C1", expression: atom("library_open_until_8"), text: t("On weekdays, the library is open until 8 p.m.", "कार्यदिवसों में पुस्तकालय रात 8 बजे तक खुला रहता है।", "ਕੰਮ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਲਾਇਬ੍ਰੇਰੀ ਰਾਤ 8 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।") },
      { id: "C2", expression: not(atom("library_open_until_8")), text: t("The library closes before 8 p.m. on every weekday.", "पुस्तकालय प्रत्येक कार्यदिवस में रात 8 बजे से पहले बंद हो जाता है।", "ਲਾਇਬ੍ਰੇਰੀ ਹਰ ਕੰਮ ਵਾਲੇ ਦਿਨ ਰਾਤ 8 ਵਜੇ ਤੋਂ ਪਹਿਲਾਂ ਬੰਦ ਹੋ ਜਾਂਦੀ ਹੈ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("library_has_weekend_hours"), text: t("The library is also open on Sundays.", "पुस्तकालय रविवार को भी खुला रहता है।", "ਲਾਇਬ੍ਰੇਰੀ ਐਤਵਾਰ ਨੂੰ ਵੀ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("library_open_until_10"), text: t("The library remains open until 10 p.m. on weekdays.", "पुस्तकालय कार्यदिवसों में रात 10 बजे तक खुला रहता है।", "ਲਾਇਬ੍ਰੇਰੀ ਕੰਮ ਵਾਲੇ ਦਿਨਾਂ ਵਿੱਚ ਰਾਤ 10 ਵਜੇ ਤੱਕ ਖੁੱਲ੍ਹੀ ਰਹਿੰਦੀ ਹੈ।"), defectIfNotEntailed: "OVERCLAIM" },
    ],
  },
  {
    id: "STC-SC-002",
    qlId: "STC-QL-001",
    difficulty: "EASY",
    statement: t(
      "Applications submitted after the deadline are not accepted.",
      "अंतिम तिथि के बाद जमा किए गए आवेदन स्वीकार नहीं किए जाते।",
      "ਅੰਤਿਮ ਮਿਤੀ ਤੋਂ ਬਾਅਦ ਜਮ੍ਹਾਂ ਕੀਤੀਆਂ ਅਰਜ਼ੀਆਂ ਸਵੀਕਾਰ ਨਹੀਂ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ।",
    ),
    premises: [not(atom("late_applications_accepted"))],
    candidates: [
      { id: "C1", expression: not(atom("late_applications_accepted")), text: t("Late applications are not accepted.", "देरी से जमा आवेदन स्वीकार नहीं किए जाते।", "ਦੇਰ ਨਾਲ ਜਮ੍ਹਾਂ ਕੀਤੀਆਂ ਅਰਜ਼ੀਆਂ ਸਵੀਕਾਰ ਨਹੀਂ ਕੀਤੀਆਂ ਜਾਂਦੀਆਂ।") },
      { id: "C2", expression: atom("late_applications_accepted"), text: t("Late applications may be accepted routinely.", "देरी से जमा आवेदन सामान्य रूप से स्वीकार किए जा सकते हैं।", "ਦੇਰ ਨਾਲ ਜਮ੍ਹਾਂ ਕੀਤੀਆਂ ਅਰਜ਼ੀਆਂ ਆਮ ਤੌਰ ਤੇ ਸਵੀਕਾਰ ਕੀਤੀਆਂ ਜਾ ਸਕਦੀਆਂ ਹਨ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("all_on_time_applications_accepted"), text: t("Every application submitted on time is accepted.", "समय पर जमा किया गया प्रत्येक आवेदन स्वीकार किया जाता है।", "ਸਮੇਂ ਤੇ ਜਮ੍ਹਾਂ ਕੀਤੀ ਹਰ ਅਰਜ਼ੀ ਸਵੀਕਾਰ ਕੀਤੀ ਜਾਂਦੀ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("deadline_extended"), text: t("The deadline has been extended.", "अंतिम तिथि बढ़ा दी गई है।", "ਅੰਤਿਮ ਮਿਤੀ ਵਧਾ ਦਿੱਤੀ ਗਈ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-003",
    qlId: "STC-QL-001",
    difficulty: "MEDIUM",
    statement: t(
      "The new bus service begins on Monday.",
      "नई बस सेवा सोमवार से शुरू होती है।",
      "ਨਵੀਂ ਬੱਸ ਸੇਵਾ ਸੋਮਵਾਰ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।",
    ),
    premises: [atom("bus_starts_monday")],
    candidates: [
      { id: "C1", expression: atom("bus_starts_monday"), text: t("Monday is the starting day of the new bus service.", "सोमवार नई बस सेवा का प्रारंभिक दिन है।", "ਸੋਮਵਾਰ ਨਵੀਂ ਬੱਸ ਸੇਵਾ ਦਾ ਸ਼ੁਰੂਆਤੀ ਦਿਨ ਹੈ।") },
      { id: "C2", expression: not(atom("bus_starts_monday")), text: t("The new bus service does not begin on Monday.", "नई बस सेवा सोमवार से शुरू नहीं होती।", "ਨਵੀਂ ਬੱਸ ਸੇਵਾ ਸੋਮਵਾਰ ਤੋਂ ਸ਼ੁਰੂ ਨਹੀਂ ਹੁੰਦੀ।"), defectIfNotEntailed: "POLARITY_FLIP" },
      { id: "C3", expression: atom("bus_runs_daily"), text: t("The new bus will run every day.", "नई बस प्रतिदिन चलेगी।", "ਨਵੀਂ ਬੱਸ ਹਰ ਰੋਜ਼ ਚੱਲੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
      { id: "C4", expression: atom("bus_is_free"), text: t("Travel on the new bus is free.", "नई बस में यात्रा निःशुल्क है।", "ਨਵੀਂ ਬੱਸ ਵਿੱਚ ਯਾਤਰਾ ਮੁਫ਼ਤ ਹੈ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-004",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The training centre provides printed notes and conducts a weekly practice test.",
      "प्रशिक्षण केंद्र मुद्रित नोट्स देता है और साप्ताहिक अभ्यास परीक्षा आयोजित करता है।",
      "ਟ੍ਰੇਨਿੰਗ ਸੈਂਟਰ ਛਪੇ ਹੋਏ ਨੋਟਸ ਦਿੰਦਾ ਹੈ ਅਤੇ ਹਫ਼ਤਾਵਾਰੀ ਅਭਿਆਸ ਟੈਸਟ ਕਰਵਾਉਂਦਾ ਹੈ।",
    ),
    premises: [and(atom("printed_notes"), atom("weekly_test"))],
    candidates: [
      { id: "C1", expression: atom("printed_notes"), text: t("Printed notes are provided by the training centre.", "प्रशिक्षण केंद्र मुद्रित नोट्स देता है।", "ਟ੍ਰੇਨਿੰਗ ਸੈਂਟਰ ਛਪੇ ਹੋਏ ਨੋਟਸ ਦਿੰਦਾ ਹੈ।") },
      { id: "C2", expression: atom("weekly_test"), text: t("The training centre conducts a weekly practice test.", "प्रशिक्षण केंद्र साप्ताहिक अभ्यास परीक्षा आयोजित करता है।", "ਟ੍ਰੇਨਿੰਗ ਸੈਂਟਰ ਹਫ਼ਤਾਵਾਰੀ ਅਭਿਆਸ ਟੈਸਟ ਕਰਵਾਉਂਦਾ ਹੈ।") },
      { id: "C3", expression: and(atom("printed_notes"), atom("weekly_test")), text: t("The centre provides printed notes as well as a weekly practice test.", "केंद्र मुद्रित नोट्स के साथ साप्ताहिक अभ्यास परीक्षा भी देता है।", "ਸੈਂਟਰ ਛਪੇ ਹੋਏ ਨੋਟਸ ਦੇ ਨਾਲ ਹਫ਼ਤਾਵਾਰੀ ਅਭਿਆਸ ਟੈਸਟ ਵੀ ਦਿੰਦਾ ਹੈ।") },
      { id: "C4", expression: atom("daily_test"), text: t("The centre conducts a practice test every day.", "केंद्र प्रतिदिन अभ्यास परीक्षा आयोजित करता है।", "ਸੈਂਟਰ ਹਰ ਰੋਜ਼ ਅਭਿਆਸ ਟੈਸਟ ਕਰਵਾਉਂਦਾ ਹੈ।"), defectIfNotEntailed: "OVERCLAIM" },
    ],
  },
  {
    id: "STC-SC-005",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The help desk answers phone queries or replies through email during office hours.",
      "हेल्प डेस्क कार्यालय समय में फोन पर प्रश्नों का उत्तर देता है या ईमेल से जवाब देता है।",
      "ਹੈਲਪ ਡੈਸਕ ਦਫ਼ਤਰੀ ਸਮੇਂ ਦੌਰਾਨ ਫ਼ੋਨ ਸਵਾਲਾਂ ਦੇ ਜਵਾਬ ਦਿੰਦਾ ਹੈ ਜਾਂ ਈਮੇਲ ਰਾਹੀਂ ਜਵਾਬ ਦਿੰਦਾ ਹੈ।",
    ),
    premises: [or(atom("phone_queries"), atom("email_replies"))],
    candidates: [
      { id: "C1", expression: or(atom("phone_queries"), atom("email_replies")), text: t("During office hours, at least one of the two support channels is used.", "कार्यालय समय में कम-से-कम एक सहायता माध्यम का उपयोग होता है।", "ਦਫ਼ਤਰੀ ਸਮੇਂ ਦੌਰਾਨ ਘੱਟੋ-ਘੱਟ ਇੱਕ ਸਹਾਇਤਾ ਮਾਧਿਅਮ ਵਰਤਿਆ ਜਾਂਦਾ ਹੈ।") },
      { id: "C2", expression: and(atom("phone_queries"), atom("email_replies")), text: t("Both support channels are necessarily used during office hours.", "कार्यालय समय में दोनों सहायता माध्यमों का उपयोग अनिवार्य रूप से होता है।", "ਦਫ਼ਤਰੀ ਸਮੇਂ ਦੌਰਾਨ ਦੋਵੇਂ ਸਹਾਇਤਾ ਮਾਧਿਅਮ ਲਾਜ਼ਮੀ ਤੌਰ ਤੇ ਵਰਤੇ ਜਾਂਦੇ ਹਨ।"), defectIfNotEntailed: "OVERCLAIM" },
      { id: "C3", expression: atom("phone_queries"), text: t("Phone support is necessarily used during office hours.", "कार्यालय समय में फोन सहायता का उपयोग अनिवार्य है।", "ਦਫ਼ਤਰੀ ਸਮੇਂ ਦੌਰਾਨ ਫ਼ੋਨ ਸਹਾਇਤਾ ਲਾਜ਼ਮੀ ਵਰਤੀ ਜਾਂਦੀ ਹੈ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: not(or(atom("phone_queries"), atom("email_replies"))), text: t("Neither support channel is used during office hours.", "कार्यालय समय में किसी भी सहायता माध्यम का उपयोग नहीं होता।", "ਦਫ਼ਤਰੀ ਸਮੇਂ ਦੌਰਾਨ ਕੋਈ ਵੀ ਸਹਾਇਤਾ ਮਾਧਿਅਮ ਨਹੀਂ ਵਰਤਿਆ ਜਾਂਦਾ।"), defectIfNotEntailed: "POLARITY_FLIP" },
    ],
  },
  {
    id: "STC-SC-006",
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: t(
      "The records room is locked and the archive terminal is disconnected from the public network.",
      "अभिलेख कक्ष बंद है और अभिलेख टर्मिनल सार्वजनिक नेटवर्क से अलग है।",
      "ਰਿਕਾਰਡ ਕਮਰਾ ਤਾਲਾਬੰਦ ਹੈ ਅਤੇ ਆਰਕਾਈਵ ਟਰਮੀਨਲ ਜਨਤਕ ਨੈੱਟਵਰਕ ਤੋਂ ਵੱਖ ਹੈ।",
    ),
    premises: [and(atom("records_locked"), not(atom("terminal_public_network")))],
    candidates: [
      { id: "C1", expression: atom("records_locked"), text: t("The records room is locked.", "अभिलेख कक्ष बंद है।", "ਰਿਕਾਰਡ ਕਮਰਾ ਤਾਲਾਬੰਦ ਹੈ।") },
      { id: "C2", expression: not(atom("terminal_public_network")), text: t("The archive terminal is not connected to the public network.", "अभिलेख टर्मिनल सार्वजनिक नेटवर्क से जुड़ा नहीं है।", "ਆਰਕਾਈਵ ਟਰਮੀਨਲ ਜਨਤਕ ਨੈੱਟਵਰਕ ਨਾਲ ਜੁੜਿਆ ਨਹੀਂ ਹੈ।") },
      { id: "C3", expression: and(atom("records_locked"), not(atom("terminal_public_network"))), text: t("Both stated access restrictions are in force.", "बताई गई दोनों पहुँच पाबंदियाँ लागू हैं।", "ਦੱਸੀਆਂ ਗਈਆਂ ਦੋਵੇਂ ਪਹੁੰਚ ਪਾਬੰਦੀਆਂ ਲਾਗੂ ਹਨ।") },
      { id: "C4", expression: atom("records_destroyed"), text: t("The records have been destroyed.", "अभिलेख नष्ट कर दिए गए हैं।", "ਰਿਕਾਰਡ ਨਸ਼ਟ ਕਰ ਦਿੱਤੇ ਗਏ ਹਨ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
