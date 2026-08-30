import type { StcScenarioAuthority } from "./types.ts";
import { and, atom, not, or } from "./truth-model-solver.ts";

const t = (en: string, hi: string, pa: string) => ({ "en-IN": en, "hi-IN": hi, "pa-IN": pa } as const);

export const STC_FIVE_WAY_EITHER_EXPANSION_V1: readonly StcScenarioAuthority[] = [
  {
    id: "STC-SC-E04",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "After scrutiny, the admit card will either be issued or the application will be rejected; exactly one of these outcomes will occur.",
      "जाँच के बाद या तो प्रवेश पत्र जारी होगा या आवेदन अस्वीकार होगा; इन दोनों में से ठीक एक परिणाम होगा।",
      "ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਜਾਂ ਤਾਂ ਦਾਖਲਾ ਪੱਤਰ ਜਾਰੀ ਹੋਵੇਗਾ ਜਾਂ ਅਰਜ਼ੀ ਰੱਦ ਹੋਵੇਗੀ; ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਨਤੀਜਾ ਹੋਵੇਗਾ।",
    ),
    premises: [or(atom("admit_card_issued"), atom("application_rejected")), not(and(atom("admit_card_issued"), atom("application_rejected")))],
    candidates: [
      { id: "C1", expression: atom("admit_card_issued"), text: t("The admit card will be issued.", "प्रवेश पत्र जारी होगा।", "ਦਾਖਲਾ ਪੱਤਰ ਜਾਰੀ ਹੋਵੇਗਾ।") },
      { id: "C2", expression: atom("application_rejected"), text: t("The application will be rejected.", "आवेदन अस्वीकार होगा।", "ਅਰਜ਼ੀ ਰੱਦ ਹੋਵੇਗੀ।") },
      { id: "C3", expression: and(atom("admit_card_issued"), atom("application_rejected")), text: t("Both outcomes will occur.", "दोनों परिणाम होंगे।", "ਦੋਵੇਂ ਨਤੀਜੇ ਹੋਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("fee_refunded"), text: t("The examination fee will be refunded.", "परीक्षा शुल्क वापस किया जाएगा।", "ਪ੍ਰੀਖਿਆ ਫੀਸ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E05",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The examination centre will either remain at the notified venue or be shifted to the reserve venue, but both cannot apply to the same session.",
      "परीक्षा केंद्र या तो अधिसूचित स्थान पर रहेगा या आरक्षित स्थान पर स्थानांतरित होगा, लेकिन एक ही सत्र के लिए दोनों नहीं हो सकते।",
      "ਪ੍ਰੀਖਿਆ ਕੇਂਦਰ ਜਾਂ ਤਾਂ ਸੂਚਿਤ ਥਾਂ ਤੇ ਰਹੇਗਾ ਜਾਂ ਰਿਜ਼ਰਵ ਥਾਂ ਤੇ ਤਬਦੀਲ ਹੋਵੇਗਾ, ਪਰ ਇੱਕੋ ਸੈਸ਼ਨ ਲਈ ਦੋਵੇਂ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
    ),
    premises: [or(atom("centre_notified_venue"), atom("centre_reserve_venue")), not(and(atom("centre_notified_venue"), atom("centre_reserve_venue")))],
    candidates: [
      { id: "C1", expression: atom("centre_notified_venue"), text: t("The centre will remain at the notified venue.", "केंद्र अधिसूचित स्थान पर रहेगा।", "ਕੇਂਦਰ ਸੂਚਿਤ ਥਾਂ ਤੇ ਰਹੇਗਾ।") },
      { id: "C2", expression: atom("centre_reserve_venue"), text: t("The centre will be shifted to the reserve venue.", "केंद्र आरक्षित स्थान पर स्थानांतरित होगा।", "ਕੇਂਦਰ ਰਿਜ਼ਰਵ ਥਾਂ ਤੇ ਤਬਦੀਲ ਹੋਵੇਗਾ।") },
      { id: "C3", expression: and(atom("centre_notified_venue"), atom("centre_reserve_venue")), text: t("The same session will use both venues.", "एक ही सत्र में दोनों स्थानों का उपयोग होगा।", "ਇੱਕੋ ਸੈਸ਼ਨ ਵਿੱਚ ਦੋਵੇਂ ਥਾਵਾਂ ਵਰਤੀਆਂ ਜਾਣਗੀਆਂ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("exam_postponed"), text: t("The examination will be postponed.", "परीक्षा स्थगित होगी।", "ਪ੍ਰੀਖਿਆ ਮੁਲਤਵੀ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E06",
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: t(
      "The tender will either be accepted for financial evaluation or returned as technically non-responsive, and only one status will be assigned.",
      "निविदा या तो वित्तीय मूल्यांकन के लिए स्वीकार होगी या तकनीकी रूप से अनुपयुक्त मानकर लौटाई जाएगी, और केवल एक स्थिति दी जाएगी।",
      "ਟੈਂਡਰ ਜਾਂ ਤਾਂ ਵਿੱਤੀ ਮੁਲਾਂਕਣ ਲਈ ਸਵੀਕਾਰ ਹੋਵੇਗਾ ਜਾਂ ਤਕਨੀਕੀ ਤੌਰ ਤੇ ਅਣਉਚਿਤ ਮੰਨ ਕੇ ਵਾਪਸ ਕੀਤਾ ਜਾਵੇਗਾ, ਅਤੇ ਕੇਵਲ ਇੱਕ ਸਥਿਤੀ ਦਿੱਤੀ ਜਾਵੇਗੀ।",
    ),
    premises: [or(atom("tender_financial"), atom("tender_nonresponsive")), not(and(atom("tender_financial"), atom("tender_nonresponsive")))],
    candidates: [
      { id: "C1", expression: atom("tender_financial"), text: t("The tender will move to financial evaluation.", "निविदा वित्तीय मूल्यांकन में जाएगी।", "ਟੈਂਡਰ ਵਿੱਤੀ ਮੁਲਾਂਕਣ ਵੱਲ ਜਾਵੇਗਾ।") },
      { id: "C2", expression: atom("tender_nonresponsive"), text: t("The tender will be returned as technically non-responsive.", "निविदा तकनीकी रूप से अनुपयुक्त मानकर लौटाई जाएगी।", "ਟੈਂਡਰ ਤਕਨੀਕੀ ਤੌਰ ਤੇ ਅਣਉਚਿਤ ਮੰਨ ਕੇ ਵਾਪਸ ਕੀਤਾ ਜਾਵੇਗਾ।") },
      { id: "C3", expression: and(atom("tender_financial"), atom("tender_nonresponsive")), text: t("The tender will receive both stated statuses.", "निविदा को दोनों बताई गई स्थितियाँ मिलेंगी।", "ਟੈਂਡਰ ਨੂੰ ਦੋਵੇਂ ਦੱਸੀਆਂ ਸਥਿਤੀਆਂ ਮਿਲਣਗੀਆਂ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("tender_awarded"), text: t("The contract will be awarded to this tenderer.", "ठेका इसी निविदादाता को दिया जाएगा।", "ਠੇਕਾ ਇਸੇ ਟੈਂਡਰਦਾਤਾ ਨੂੰ ਦਿੱਤਾ ਜਾਵੇਗਾ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E07",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "The scholarship amount will either be credited to the verified account or the claim will be returned for bank-detail correction; the two outcomes are mutually exclusive.",
      "छात्रवृत्ति राशि या तो सत्यापित खाते में जमा होगी या दावा बैंक विवरण सुधार के लिए लौटाया जाएगा; दोनों परिणाम एक साथ नहीं हो सकते।",
      "ਵਜ਼ੀਫ਼ੇ ਦੀ ਰਕਮ ਜਾਂ ਤਾਂ ਤਸਦੀਕ ਕੀਤੇ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੋਵੇਗੀ ਜਾਂ ਦਾਅਵਾ ਬੈਂਕ ਵੇਰਵੇ ਸੋਧਣ ਲਈ ਵਾਪਸ ਕੀਤਾ ਜਾਵੇਗਾ; ਦੋਵੇਂ ਨਤੀਜੇ ਇਕੱਠੇ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
    ),
    premises: [or(atom("scholarship_credited"), atom("bank_correction")), not(and(atom("scholarship_credited"), atom("bank_correction")))],
    candidates: [
      { id: "C1", expression: atom("scholarship_credited"), text: t("The scholarship amount will be credited to the verified account.", "छात्रवृत्ति राशि सत्यापित खाते में जमा होगी।", "ਵਜ਼ੀਫ਼ੇ ਦੀ ਰਕਮ ਤਸਦੀਕ ਕੀਤੇ ਖਾਤੇ ਵਿੱਚ ਜਮ੍ਹਾਂ ਹੋਵੇਗੀ।") },
      { id: "C2", expression: atom("bank_correction"), text: t("The claim will be returned for bank-detail correction.", "दावा बैंक विवरण सुधार के लिए लौटाया जाएगा।", "ਦਾਅਵਾ ਬੈਂਕ ਵੇਰਵੇ ਸੋਧਣ ਲਈ ਵਾਪਸ ਕੀਤਾ ਜਾਵੇਗਾ।") },
      { id: "C3", expression: and(atom("scholarship_credited"), atom("bank_correction")), text: t("The amount will be credited and the claim returned at the same time.", "राशि जमा भी होगी और दावा उसी समय लौटाया भी जाएगा।", "ਰਕਮ ਜਮ੍ਹਾਂ ਵੀ ਹੋਵੇਗੀ ਅਤੇ ਦਾਅਵਾ ਉਸੇ ਸਮੇਂ ਵਾਪਸ ਵੀ ਕੀਤਾ ਜਾਵੇਗਾ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("scholarship_doubled"), text: t("The scholarship amount will be doubled.", "छात्रवृत्ति राशि दोगुनी होगी।", "ਵਜ਼ੀਫ਼ੇ ਦੀ ਰਕਮ ਦੁੱਗਣੀ ਹੋਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E08",
    qlId: "STC-QL-002",
    difficulty: "MEDIUM",
    statement: t(
      "Tomorrow's physical test will either be conducted as scheduled or be postponed to a later date; both outcomes cannot be true for tomorrow.",
      "कल की शारीरिक परीक्षा या तो निर्धारित समय पर होगी या बाद की तिथि तक स्थगित होगी; कल के लिए दोनों परिणाम एक साथ सत्य नहीं हो सकते।",
      "ਕੱਲ੍ਹ ਦਾ ਸਰੀਰਕ ਟੈਸਟ ਜਾਂ ਤਾਂ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੇ ਹੋਵੇਗਾ ਜਾਂ ਬਾਅਦ ਦੀ ਤਾਰੀਖ ਲਈ ਮੁਲਤਵੀ ਹੋਵੇਗਾ; ਕੱਲ੍ਹ ਲਈ ਦੋਵੇਂ ਨਤੀਜੇ ਇਕੱਠੇ ਸੱਚ ਨਹੀਂ ਹੋ ਸਕਦੇ।",
    ),
    premises: [or(atom("physical_test_conducted"), atom("physical_test_postponed")), not(and(atom("physical_test_conducted"), atom("physical_test_postponed")))],
    candidates: [
      { id: "C1", expression: atom("physical_test_conducted"), text: t("The physical test will be conducted tomorrow as scheduled.", "शारीरिक परीक्षा कल निर्धारित समय पर होगी।", "ਸਰੀਰਕ ਟੈਸਟ ਕੱਲ੍ਹ ਨਿਰਧਾਰਤ ਸਮੇਂ ਤੇ ਹੋਵੇਗਾ।") },
      { id: "C2", expression: atom("physical_test_postponed"), text: t("The physical test will be postponed to a later date.", "शारीरिक परीक्षा बाद की तिथि तक स्थगित होगी।", "ਸਰੀਰਕ ਟੈਸਟ ਬਾਅਦ ਦੀ ਤਾਰੀਖ ਲਈ ਮੁਲਤਵੀ ਹੋਵੇਗਾ।") },
      { id: "C3", expression: and(atom("physical_test_conducted"), atom("physical_test_postponed")), text: t("The test will both be conducted tomorrow and postponed.", "परीक्षा कल होगी भी और स्थगित भी होगी।", "ਟੈਸਟ ਕੱਲ੍ਹ ਹੋਵੇਗਾ ਵੀ ਅਤੇ ਮੁਲਤਵੀ ਵੀ ਹੋਵੇਗਾ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("venue_changed"), text: t("The test venue will be changed.", "परीक्षा का स्थान बदला जाएगा।", "ਟੈਸਟ ਦੀ ਥਾਂ ਬਦਲੀ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
  {
    id: "STC-SC-E09",
    qlId: "STC-QL-002",
    difficulty: "HARD",
    statement: t(
      "The appeal will either be allowed and sent for reconsideration or dismissed finally, and exactly one of these decisions will be recorded.",
      "अपील या तो स्वीकार कर पुनर्विचार के लिए भेजी जाएगी या अंतिम रूप से खारिज होगी, और इन दोनों में से ठीक एक निर्णय दर्ज होगा।",
      "ਅਪੀਲ ਜਾਂ ਤਾਂ ਮਨਜ਼ੂਰ ਕਰਕੇ ਮੁੜ ਵਿਚਾਰ ਲਈ ਭੇਜੀ ਜਾਵੇਗੀ ਜਾਂ ਅੰਤਿਮ ਤੌਰ ਤੇ ਰੱਦ ਹੋਵੇਗੀ, ਅਤੇ ਇਨ੍ਹਾਂ ਵਿੱਚੋਂ ਠੀਕ ਇੱਕ ਫ਼ੈਸਲਾ ਦਰਜ ਹੋਵੇਗਾ।",
    ),
    premises: [or(atom("appeal_allowed"), atom("appeal_dismissed")), not(and(atom("appeal_allowed"), atom("appeal_dismissed")))],
    candidates: [
      { id: "C1", expression: atom("appeal_allowed"), text: t("The appeal will be allowed and sent for reconsideration.", "अपील स्वीकार कर पुनर्विचार के लिए भेजी जाएगी।", "ਅਪੀਲ ਮਨਜ਼ੂਰ ਕਰਕੇ ਮੁੜ ਵਿਚਾਰ ਲਈ ਭੇਜੀ ਜਾਵੇਗੀ।") },
      { id: "C2", expression: atom("appeal_dismissed"), text: t("The appeal will be dismissed finally.", "अपील अंतिम रूप से खारिज होगी।", "ਅਪੀਲ ਅੰਤਿਮ ਤੌਰ ਤੇ ਰੱਦ ਹੋਵੇਗੀ।") },
      { id: "C3", expression: and(atom("appeal_allowed"), atom("appeal_dismissed")), text: t("Both decisions will be recorded for the appeal.", "अपील के लिए दोनों निर्णय दर्ज होंगे।", "ਅਪੀਲ ਲਈ ਦੋਵੇਂ ਫ਼ੈਸਲੇ ਦਰਜ ਹੋਣਗੇ।"), defectIfNotEntailed: "INVALID_COMBINATION" },
      { id: "C4", expression: atom("appeal_fee_refunded"), text: t("The appeal fee will be refunded.", "अपील शुल्क वापस किया जाएगा।", "ਅਪੀਲ ਫੀਸ ਵਾਪਸ ਕੀਤੀ ਜਾਵੇਗੀ।"), defectIfNotEntailed: "UNSUPPORTED_EXTRA" },
    ],
  },
] as const;
