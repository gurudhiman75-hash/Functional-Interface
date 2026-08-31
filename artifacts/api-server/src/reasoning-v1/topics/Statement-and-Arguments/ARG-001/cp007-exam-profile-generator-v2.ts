import { createHash } from "node:crypto";

import { ARG_QL_IDS, type ArgDifficulty, type ArgLocale, type ArgQlId, type ArgStrength } from "./types.ts";

export const ARG_CP007_CHECKPOINT_ID = "ARG-CP-007" as const;
export const ARG_CP007_AUTHORITY = "ARG_CP007_REAL_PAPER_PARITY_V2" as const;

export const ARG_CP007_EXAM_PROFILES = Object.freeze({
  SSC_RECENT_2X4: Object.freeze({
    id: "SSC_RECENT_2X4" as const,
    label: "Recent SSC/state-style two-argument four-option",
    argumentCount: 2 as const,
    optionCount: 4 as const,
    supportedDifficulties: Object.freeze(["Easy", "Medium"] as const),
    sourceProfile: "RRB/UPPCS/UP Police-style 2-argument 4-option",
  }),
  BANKING_CLASSIC_2X5: Object.freeze({
    id: "BANKING_CLASSIC_2X5" as const,
    label: "Classic banking two-argument five-option",
    argumentCount: 2 as const,
    optionCount: 5 as const,
    supportedDifficulties: Object.freeze(["Medium", "Hard"] as const),
    sourceProfile: "RBI/SBI/Bank PO-style 2-argument 5-option",
  }),
  BANKING_COMBO_3X5: Object.freeze({
    id: "BANKING_COMBO_3X5" as const,
    label: "Banking three-argument combination",
    argumentCount: 3 as const,
    optionCount: 5 as const,
    supportedDifficulties: Object.freeze(["Medium", "Hard"] as const),
    sourceProfile: "SBI PO/Bank PO-style 3-argument combination",
  }),
  BANKING_COMBO_4X5: Object.freeze({
    id: "BANKING_COMBO_4X5" as const,
    label: "Banking four-argument combination",
    argumentCount: 4 as const,
    optionCount: 5 as const,
    supportedDifficulties: Object.freeze(["Hard"] as const),
    sourceProfile: "Bank PO-style 4-argument combination",
  }),
} as const);

export type ArgCp007ExamProfile = keyof typeof ARG_CP007_EXAM_PROFILES;
export type ArgCp007Difficulty = "Easy" | "Medium" | "Hard";

type Localized = Readonly<Record<ArgLocale, string>>;
type LocalizedSlot = Readonly<Record<ArgLocale, readonly string[]>>;
type CandidateArgument = Readonly<{ strength: ArgStrength; text: Localized; reason: Localized }>;
type ProfileTemplate = Readonly<{
  qlId: ArgQlId;
  templateId: string;
  archetype: string;
  slotA: LocalizedSlot;
  slotB: LocalizedSlot;
  statement: Localized;
  arguments: readonly CandidateArgument[];
}>;

const LOCALES = ["en-IN", "hi-IN", "pa-IN"] as const;
const ROMAN = ["I", "II", "III", "IV"] as const;

function localized(en: string, hi: string, pa: string): Localized {
  return Object.freeze({ "en-IN": en, "hi-IN": hi, "pa-IN": pa });
}

function slots(en: readonly string[], hi: readonly string[], pa: readonly string[]): LocalizedSlot {
  if (en.length !== 4 || hi.length !== 4 || pa.length !== 4) throw new Error("ARG-001 CP007 slots require exactly four values per locale");
  return Object.freeze({ "en-IN": Object.freeze([...en]), "hi-IN": Object.freeze([...hi]), "pa-IN": Object.freeze([...pa]) });
}

function candidate(strength: ArgStrength, text: Localized, reason: Localized): CandidateArgument {
  return Object.freeze({ strength, text, reason });
}

const TEMPLATES: Readonly<Record<ArgQlId, ProfileTemplate>> = Object.freeze({
  "ARG-QL-001": Object.freeze({
    qlId: "ARG-QL-001", templateId: "ARG-CP007-QL001-T01", archetype: "CONCISE_MATERIALITY",
    slotA: slots(
      ["a recruitment board", "a university", "a licensing authority", "a scholarship authority"],
      ["एक भर्ती बोर्ड", "एक विश्वविद्यालय", "एक लाइसेंसिंग प्राधिकरण", "एक छात्रवृत्ति प्राधिकरण"],
      ["ਇੱਕ ਭਰਤੀ ਬੋਰਡ", "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ", "ਇੱਕ ਲਾਇਸੈਂਸਿੰਗ ਅਥਾਰਟੀ", "ਇੱਕ ਸਕਾਲਰਸ਼ਿਪ ਅਥਾਰਟੀ"],
    ),
    slotB: slots(
      ["model answer points", "evaluation criteria", "a correction deadline", "a grievance contact"],
      ["मॉडल उत्तर बिंदु", "मूल्यांकन मानदंड", "सुधार की अंतिम तिथि", "शिकायत संपर्क"],
      ["ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ", "ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ", "ਸੋਧ ਦੀ ਆਖਰੀ ਮਿਤੀ", "ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ"],
    ),
    statement: localized(
      "Should {a} display {b} clearly after the relevant process is complete?",
      "क्या संबंधित प्रक्रिया पूरी होने के बाद {a} को {b} स्पष्ट रूप से दिखाना चाहिए?",
      "ਕੀ ਸੰਬੰਧਿਤ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ {a} ਨੂੰ {b} ਸਪੱਸ਼ਟ ਤੌਰ 'ਤੇ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
    ),
    arguments: [
      candidate("STRONG", localized(
        "Yes. Clear {b} helps users understand the decision process and identify avoidable errors.",
        "हाँ। स्पष्ट {b} उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद करता है।",
        "ਹਾਂ। ਸਪੱਸ਼ਟ {b} ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
      ), localized("It gives a direct transparency benefit.", "यह सीधा पारदर्शिता लाभ बताता है।", "ਇਹ ਸਿੱਧਾ ਪਾਰਦਰਸ਼ਤਾ ਲਾਭ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "No. A page with {b} may look less attractive, so the information should not be shown.",
        "नहीं। {b} वाला पृष्ठ कम आकर्षक लग सकता है, इसलिए जानकारी नहीं दिखानी चाहिए।",
        "ਨਹੀਂ। {b} ਵਾਲਾ ਪੰਨਾ ਘੱਟ ਆਕਰਸ਼ਕ ਲੱਗ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿਖਾਉਣੀ ਚਾਹੀਦੀ।",
      ), localized("Appearance is a trivial consideration here.", "यहाँ रूप-सज्जा एक तुच्छ विचार है।", "ਇੱਥੇ ਦਿੱਖ ਇੱਕ ਮਾਮੂਲੀ ਵਿਚਾਰ ਹੈ।")),
      candidate("STRONG", localized(
        "No. If {b} can change, {a} must keep it updated or users may rely on stale information.",
        "नहीं। यदि {b} बदल सकता है, तो {a} को इसे अद्यतन रखना होगा, अन्यथा उपयोगकर्ता पुरानी जानकारी पर निर्भर कर सकते हैं।",
        "ਨਹੀਂ। ਜੇ {b} ਬਦਲ ਸਕਦਾ ਹੈ, ਤਾਂ {a} ਨੂੰ ਇਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ ਹੋਵੇਗਾ, ਨਹੀਂ ਤਾਂ ਵਰਤੋਂਕਾਰ ਪੁਰਾਣੀ ਜਾਣਕਾਰੀ 'ਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।",
      ), localized("It raises a material accuracy condition.", "यह महत्वपूर्ण शुद्धता-शर्त उठाता है।", "ਇਹ ਮਹੱਤਵਪੂਰਨ ਸਹੀਪਣ ਦੀ ਸ਼ਰਤ ਉਠਾਉਂਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "Yes. Successful organisations display more information, so {a} must display {b}.",
        "हाँ। सफल संस्थाएँ अधिक जानकारी दिखाती हैं, इसलिए {a} को {b} दिखाना ही चाहिए।",
        "ਹਾਂ। ਸਫਲ ਸੰਸਥਾਵਾਂ ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਦਿਖਾਉਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ {a} ਨੂੰ {b} ਜ਼ਰੂਰ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।",
      ), localized("Popularity or imitation does not establish material value.", "लोकप्रियता या नकल वास्तविक महत्व सिद्ध नहीं करती।", "ਲੋਕਪ੍ਰਿਯਤਾ ਜਾਂ ਨਕਲ ਅਸਲ ਮਹੱਤਵ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।")),
    ],
  }),
  "ARG-QL-002": Object.freeze({
    qlId: "ARG-QL-002", templateId: "ARG-CP007-QL002-T01", archetype: "CONCISE_MECHANISM",
    slotA: slots(
      ["a bank", "a payment wallet", "an insurance portal", "a brokerage app"],
      ["एक बैंक", "एक भुगतान वॉलेट", "एक बीमा पोर्टल", "एक ब्रोकरेज ऐप"],
      ["ਇੱਕ ਬੈਂਕ", "ਇੱਕ ਭੁਗਤਾਨ ਵਾਲਿਟ", "ਇੱਕ ਬੀਮਾ ਪੋਰਟਲ", "ਇੱਕ ਬ੍ਰੋਕਰੇਜ ਐਪ"],
    ),
    slotB: slots(
      ["the registered mobile number", "the recovery email", "the payout account", "the transaction limit"],
      ["पंजीकृत मोबाइल नंबर", "रिकवरी ईमेल", "भुगतान खाता", "लेन-देन सीमा"],
      ["ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ", "ਰਿਕਵਰੀ ਈਮੇਲ", "ਭੁਗਤਾਨ ਖਾਤਾ", "ਲੈਣ-ਦੇਣ ਸੀਮਾ"],
    ),
    statement: localized(
      "Should {a} require independent verification before changing {b}?",
      "क्या {a} को {b} बदलने से पहले स्वतंत्र सत्यापन आवश्यक करना चाहिए?",
      "ਕੀ {a} ਨੂੰ {b} ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਸੁਤੰਤਰ ਤਸਦੀਕ ਲਾਜ਼ਮੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
    ),
    arguments: [
      candidate("STRONG", localized(
        "Yes. A second verification can stop stolen login details alone from being enough to change {b}.",
        "हाँ। दूसरा सत्यापन केवल चोरी हुए लॉगिन विवरण के आधार पर {b} बदलने से रोक सकता है।",
        "ਹਾਂ। ਦੂਜੀ ਤਸਦੀਕ ਸਿਰਫ਼ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵਿਆਂ ਦੇ ਆਧਾਰ 'ਤੇ {b} ਬਦਲਣ ਤੋਂ ਰੋਕ ਸਕਦੀ ਹੈ।",
      ), localized("It states a plausible security mechanism.", "यह विश्वसनीय सुरक्षा तंत्र बताता है।", "ਇਹ ਭਰੋਸੇਯੋਗ ਸੁਰੱਖਿਆ ਤਰੀਕਾ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "No. One customer once failed verification, so every genuine change to {b} will become impossible.",
        "नहीं। एक ग्राहक कभी सत्यापन में विफल हुआ था, इसलिए {b} में हर वास्तविक बदलाव असंभव हो जाएगा।",
        "ਨਹੀਂ। ਇੱਕ ਗਾਹਕ ਕਦੇ ਤਸਦੀਕ ਵਿੱਚ ਅਸਫਲ ਹੋਇਆ ਸੀ, ਇਸ ਲਈ {b} ਵਿੱਚ ਹਰ ਅਸਲੀ ਬਦਲਾਅ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ।",
      ), localized("One anecdote does not prove universal failure.", "एक घटना सार्वभौमिक विफलता सिद्ध नहीं करती।", "ਇੱਕ ਘਟਨਾ ਸਰਬਭੌਮ ਨਾਕਾਮੀ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।")),
      candidate("STRONG", localized(
        "Yes. An alert through an old verified channel can help detect an unauthorised change to {b} quickly.",
        "हाँ। पुराने सत्यापित माध्यम से चेतावनी {b} में अनधिकृत बदलाव जल्दी पकड़ने में मदद कर सकती है।",
        "ਹਾਂ। ਪੁਰਾਣੇ ਤਸਦੀਕਸ਼ੁਦਾ ਮਾਧਿਅਮ ਰਾਹੀਂ ਚੇਤਾਵਨੀ {b} ਵਿੱਚ ਗੈਰ-ਅਧਿਕਾਰਤ ਬਦਲਾਅ ਜਲਦੀ ਪਕੜਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ।",
      ), localized("It gives a credible early-warning mechanism.", "यह विश्वसनीय प्रारंभिक चेतावनी तंत्र बताता है।", "ਇਹ ਭਰੋਸੇਯੋਗ ਸ਼ੁਰੂਆਤੀ ਚੇਤਾਵਨੀ ਤਰੀਕਾ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "Yes. Verification guarantees that fraud involving {b} can never occur.",
        "हाँ। सत्यापन यह गारंटी देता है कि {b} से जुड़ी धोखाधड़ी कभी नहीं हो सकती।",
        "ਹਾਂ। ਤਸਦੀਕ ਇਹ ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ {b} ਨਾਲ ਜੁੜੀ ਧੋਖਾਧੜੀ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
      ), localized("The absolute guarantee is unsupported.", "पूर्ण गारंटी का दावा असमर्थित है।", "ਪੂਰੀ ਗਾਰੰਟੀ ਦਾ ਦਾਅਵਾ ਬਿਨਾਂ ਆਧਾਰ ਹੈ।")),
    ],
  }),
  "ARG-QL-003": Object.freeze({
    qlId: "ARG-QL-003", templateId: "ARG-CP007-QL003-T01", archetype: "CONCISE_IMPLEMENTATION",
    slotA: slots(
      ["a passport centre", "a district hospital", "a municipal office", "a citizen-service centre"],
      ["एक पासपोर्ट केंद्र", "एक जिला अस्पताल", "एक नगर कार्यालय", "एक नागरिक सेवा केंद्र"],
      ["ਇੱਕ ਪਾਸਪੋਰਟ ਕੇਂਦਰ", "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲ", "ਇੱਕ ਨਗਰ ਦਫ਼ਤਰ", "ਇੱਕ ਨਾਗਰਿਕ ਸੇਵਾ ਕੇਂਦਰ"],
    ),
    slotB: slots(
      ["routine document services", "registration services", "fee-payment services", "standard certificate services"],
      ["नियमित दस्तावेज सेवाओं", "पंजीकरण सेवाओं", "शुल्क भुगतान सेवाओं", "मानक प्रमाणपत्र सेवाओं"],
      ["ਰੁਟੀਨ ਦਸਤਾਵੇਜ਼ ਸੇਵਾਵਾਂ", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸੇਵਾਵਾਂ", "ਫੀਸ ਭੁਗਤਾਨ ਸੇਵਾਵਾਂ", "ਮਿਆਰੀ ਸਰਟੀਫਿਕੇਟ ਸੇਵਾਵਾਂ"],
    ),
    statement: localized(
      "Should {a} introduce scheduled time slots for {b}?",
      "क्या {a} को {b} के लिए निर्धारित समय-स्लॉट शुरू करने चाहिए?",
      "ਕੀ {a} ਨੂੰ {b} ਲਈ ਨਿਰਧਾਰਤ ਸਮਾਂ-ਸਲਾਟ ਸ਼ੁਰੂ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ?",
    ),
    arguments: [
      candidate("STRONG", localized(
        "Yes. Time slots can spread arrivals and reduce crowding for {b}.",
        "हाँ। समय-स्लॉट आगमन को फैलाकर {b} में भीड़ कम कर सकते हैं।",
        "ਹਾਂ। ਸਮਾਂ-ਸਲਾਟ ਆਉਣ ਵਾਲਿਆਂ ਨੂੰ ਵੰਡ ਕੇ {b} ਵਿੱਚ ਭੀੜ ਘਟਾ ਸਕਦੇ ਹਨ।",
      ), localized("It gives a practical queue-management benefit.", "यह व्यावहारिक कतार-प्रबंधन लाभ बताता है।", "ਇਹ ਵਿਆਵਹਾਰਿਕ ਕਤਾਰ-ਪ੍ਰਬੰਧਨ ਲਾਭ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "No. Time slots require every visitor to own an expensive desktop computer.",
        "नहीं। समय-स्लॉट के लिए हर आगंतुक के पास महंगा डेस्कटॉप कंप्यूटर होना जरूरी है।",
        "ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਲਈ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
      ), localized("It assumes an unnecessary implementation requirement.", "यह अनावश्यक कार्यान्वयन शर्त मान लेता है।", "ਇਹ ਬੇਲੋੜੀ ਲਾਗੂ ਕਰਨ ਦੀ ਸ਼ਰਤ ਮੰਨ ਲੈਂਦਾ ਹੈ।")),
      candidate("STRONG", localized(
        "No. {a} still needs a walk-in or assisted fallback for users who cannot book a slot.",
        "नहीं। जो उपयोगकर्ता स्लॉट बुक नहीं कर सकते, उनके लिए {a} को वॉक-इन या सहायक विकल्प रखना होगा।",
        "ਨਹੀਂ। ਜੋ ਵਰਤੋਂਕਾਰ ਸਲਾਟ ਬੁੱਕ ਨਹੀਂ ਕਰ ਸਕਦੇ, ਉਨ੍ਹਾਂ ਲਈ {a} ਨੂੰ ਵਾਕ-ਇਨ ਜਾਂ ਸਹਾਇਤਾ ਵਿਕਲਪ ਰੱਖਣਾ ਹੋਵੇਗਾ।",
      ), localized("It identifies a real access dependency.", "यह वास्तविक पहुंच निर्भरता बताता है।", "ਇਹ ਅਸਲੀ ਪਹੁੰਚ ਦੀ ਨਿਰਭਰਤਾ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "No. Any use of time slots makes {b} permanently impossible to deliver.",
        "नहीं। समय-स्लॉट का कोई भी उपयोग {b} को स्थायी रूप से असंभव बना देता है।",
        "ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਦੀ ਕੋਈ ਵੀ ਵਰਤੋਂ {b} ਨੂੰ ਸਦਾ ਲਈ ਅਸੰਭਵ ਬਣਾ ਦਿੰਦੀ ਹੈ।",
      ), localized("The absolute implementation claim is unsupported.", "पूर्ण कार्यान्वयन दावा असमर्थित है।", "ਪੂਰਨ ਲਾਗੂ ਕਰਨ ਵਾਲਾ ਦਾਅਵਾ ਬਿਨਾਂ ਆਧਾਰ ਹੈ।")),
    ],
  }),
  "ARG-QL-004": Object.freeze({
    qlId: "ARG-QL-004", templateId: "ARG-CP007-QL004-T01", archetype: "CONCISE_PROPORTIONALITY",
    slotA: slots(
      ["a market street", "a school-zone road", "a station-front road", "a hospital approach road"],
      ["एक बाजार सड़क", "एक स्कूल-क्षेत्र सड़क", "एक स्टेशन-सामने की सड़क", "एक अस्पताल पहुंच सड़क"],
      ["ਇੱਕ ਬਾਜ਼ਾਰ ਸੜਕ", "ਇੱਕ ਸਕੂਲ-ਇਲਾਕਾ ਸੜਕ", "ਇੱਕ ਸਟੇਸ਼ਨ-ਸਾਹਮਣੇ ਸੜਕ", "ਇੱਕ ਹਸਪਤਾਲ ਪਹੁੰਚ ਸੜਕ"],
    ),
    slotB: slots(
      ["the evening peak", "school closing time", "the morning rush", "weekend peak hours"],
      ["शाम के व्यस्त समय", "स्कूल छुट्टी के समय", "सुबह की भीड़", "सप्ताहांत के व्यस्त समय"],
      ["ਸ਼ਾਮ ਦੇ ਭੀੜ ਸਮੇਂ", "ਸਕੂਲ ਛੁੱਟੀ ਦੇ ਸਮੇਂ", "ਸਵੇਰ ਦੀ ਭੀੜ", "ਹਫ਼ਤੇਅੰਤ ਦੇ ਭੀੜ ਸਮੇਂ"],
    ),
    statement: localized(
      "Should heavy vehicles be restricted on {a} during {b}?",
      "क्या {b} के दौरान {a} पर भारी वाहनों को सीमित किया जाना चाहिए?",
      "ਕੀ {b} ਦੌਰਾਨ {a} 'ਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਸੀਮਿਤ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    ),
    arguments: [
      candidate("STRONG", localized(
        "Yes. A limited restriction during {b} can reduce conflict without creating an all-day ban.",
        "हाँ। {b} के दौरान सीमित प्रतिबंध पूरे दिन के प्रतिबंध के बिना टकराव कम कर सकता है।",
        "ਹਾਂ। {b} ਦੌਰਾਨ ਸੀਮਿਤ ਪਾਬੰਦੀ ਪੂਰੇ ਦਿਨ ਦੀ ਪਾਬੰਦੀ ਤੋਂ ਬਿਨਾਂ ਟਕਰਾਅ ਘਟਾ ਸਕਦੀ ਹੈ।",
      ), localized("It is directly relevant and proportionate in time.", "यह सीधे प्रासंगिक और समय की दृष्टि से अनुपातिक है।", "ਇਹ ਸਿੱਧਾ ਸੰਬੰਧਿਤ ਅਤੇ ਸਮੇਂ ਦੇ ਹਿਸਾਬ ਨਾਲ ਅਨੁਪਾਤਿਕ ਹੈ।")),
      candidate("WEAK", localized(
        "No. A short restriction on {a} will permanently destroy all activity in the area.",
        "नहीं। {a} पर थोड़े समय का प्रतिबंध क्षेत्र की सारी गतिविधि स्थायी रूप से नष्ट कर देगा।",
        "ਨਹੀਂ। {a} 'ਤੇ ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਇਲਾਕੇ ਦੀ ਸਾਰੀ ਸਰਗਰਮੀ ਸਦਾ ਲਈ ਖਤਮ ਕਰ ਦੇਵੇਗੀ।",
      ), localized("It turns a limited measure into an unsupported permanent-harm claim.", "यह सीमित उपाय को बिना आधार स्थायी नुकसान के दावे में बदल देता है।", "ਇਹ ਸੀਮਿਤ ਕਦਮ ਨੂੰ ਬਿਨਾਂ ਆਧਾਰ ਸਥਾਈ ਨੁਕਸਾਨ ਦੇ ਦਾਅਵੇ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ।")),
      candidate("STRONG", localized(
        "No. Emergency and essential-delivery access may need defined exceptions during {b}.",
        "नहीं। {b} के दौरान आपातकालीन और आवश्यक डिलीवरी के लिए स्पष्ट अपवाद जरूरी हो सकते हैं।",
        "ਨਹੀਂ। {b} ਦੌਰਾਨ ਐਮਰਜੈਂਸੀ ਅਤੇ ਜ਼ਰੂਰੀ ਡਿਲੀਵਰੀ ਲਈ ਸਪੱਸ਼ਟ ਛੋਟਾਂ ਲੋੜੀਂਦੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।",
      ), localized("It raises a material scope limitation.", "यह महत्वपूर्ण सीमा बताता है।", "ਇਹ ਮਹੱਤਵਪੂਰਨ ਹੱਦ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "Yes. If any restriction helps once, heavy vehicles should be banned from {a} at all times.",
        "हाँ। यदि प्रतिबंध कभी मदद करता है, तो {a} पर भारी वाहनों को हर समय प्रतिबंधित कर देना चाहिए।",
        "ਹਾਂ। ਜੇ ਪਾਬੰਦੀ ਕਦੇ ਮਦਦ ਕਰਦੀ ਹੈ, ਤਾਂ {a} 'ਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਹਰ ਵੇਲੇ ਬੰਦ ਕਰ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।",
      ), localized("It unjustifiably expands a limited measure into a blanket ban.", "यह सीमित उपाय को अनुचित रूप से पूर्ण प्रतिबंध में बदल देता है।", "ਇਹ ਸੀਮਿਤ ਕਦਮ ਨੂੰ ਬਿਨਾਂ ਜਾਇਜ਼ ਕਾਰਨ ਪੂਰੀ ਪਾਬੰਦੀ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ।")),
    ],
  }),
  "ARG-QL-005": Object.freeze({
    qlId: "ARG-QL-005", templateId: "ARG-CP007-QL005-T01", archetype: "CONCISE_FAIRNESS_PRIVACY",
    slotA: slots(
      ["office employees", "remote employees", "field staff", "contract workers"],
      ["कार्यालय कर्मचारियों", "दूरस्थ कर्मचारियों", "फील्ड स्टाफ", "संविदा कर्मचारियों"],
      ["ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀਆਂ", "ਰਿਮੋਟ ਕਰਮਚਾਰੀਆਂ", "ਫੀਲਡ ਸਟਾਫ", "ਠੇਕਾ ਕਰਮਚਾਰੀਆਂ"],
    ),
    slotB: slots(
      ["continuous screen recording", "location tracking", "keystroke logging", "webcam activity monitoring"],
      ["लगातार स्क्रीन रिकॉर्डिंग", "स्थान ट्रैकिंग", "कीस्ट्रोक लॉगिंग", "वेबकैम गतिविधि निगरानी"],
      ["ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ", "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ", "ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ", "ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਨਿਗਰਾਨੀ"],
    ),
    statement: localized(
      "Should an employer inform {a} before introducing {b}?",
      "क्या नियोक्ता को {b} शुरू करने से पहले {a} को सूचित करना चाहिए?",
      "ਕੀ ਨਿਯੋਗਤਾ ਨੂੰ {b} ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ {a} ਨੂੰ ਜਾਣਕਾਰੀ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?",
    ),
    arguments: [
      candidate("STRONG", localized(
        "Yes. {a} should know what data {b} collects, why it is collected and who can access it.",
        "हाँ। {a} को पता होना चाहिए कि {b} कौन-सा डेटा एकत्र करता है, क्यों करता है और उसे कौन देख सकता है।",
        "ਹਾਂ। {a} ਨੂੰ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ {b} ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ, ਕਿਉਂ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸ ਤੱਕ ਕੌਣ ਪਹੁੰਚ ਸਕਦਾ ਹੈ।",
      ), localized("It identifies a direct privacy and informed-notice interest.", "यह सीधा गोपनीयता और सूचित-नोटिस हित बताता है।", "ਇਹ ਸਿੱਧਾ ਪਰਦੇਦਾਰੀ ਅਤੇ ਜਾਣਕਾਰੀ-ਨੋਟਿਸ ਹਿੱਤ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "No. Any employee who asks about {b} must have something to hide.",
        "नहीं। जो कर्मचारी {b} के बारे में पूछे, उसके पास जरूर कुछ छिपाने को है।",
        "ਨਹੀਂ। ਜੋ ਕਰਮਚਾਰੀ {b} ਬਾਰੇ ਪੁੱਛੇ, ਉਸ ਕੋਲ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾਉਣ ਲਈ ਹੈ।",
      ), localized("It stereotypes employees instead of addressing the policy.", "यह नीति के बजाय कर्मचारियों को रूढ़िबद्ध करता है।", "ਇਹ ਨੀਤੀ ਦੀ ਬਜਾਏ ਕਰਮਚਾਰੀਆਂ ਬਾਰੇ ਰੂੜੀਵਾਦੀ ਧਾਰਨਾ ਬਣਾਉਂਦਾ ਹੈ।")),
      candidate("STRONG", localized(
        "No. If {b} is excessive for the stated purpose, a less intrusive method should be considered.",
        "नहीं। यदि बताए गए उद्देश्य के लिए {b} अत्यधिक है, तो कम हस्तक्षेप वाला तरीका विचार करना चाहिए।",
        "ਨਹੀਂ। ਜੇ ਦੱਸੇ ਉਦੇਸ਼ ਲਈ {b} ਹੱਦ ਤੋਂ ਵੱਧ ਹੈ, ਤਾਂ ਘੱਟ ਦਖ਼ਲ ਵਾਲਾ ਤਰੀਕਾ ਵਿਚਾਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      ), localized("It raises a legitimate proportionality safeguard.", "यह वैध अनुपातिकता सुरक्षा उठाता है।", "ਇਹ ਵਾਜਬ ਅਨੁਪਾਤਿਕਤਾ ਸੁਰੱਖਿਆ ਦਾ ਮੁੱਦਾ ਉਠਾਉਂਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "Yes. {b} is modern technology, so using it must always be fair to {a}.",
        "हाँ। {b} आधुनिक तकनीक है, इसलिए इसका उपयोग {a} के लिए हमेशा न्यायसंगत होगा।",
        "ਹਾਂ। {b} ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੀ ਵਰਤੋਂ {a} ਲਈ ਹਮੇਸ਼ਾਂ ਨਿਆਂਯੋਗ ਹੋਵੇਗੀ।",
      ), localized("Being modern does not establish fairness or necessity.", "आधुनिक होना न्यायसंगतता या आवश्यकता सिद्ध नहीं करता।", "ਆਧੁਨਿਕ ਹੋਣਾ ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।")),
    ],
  }),
  "ARG-QL-006": Object.freeze({
    qlId: "ARG-QL-006", templateId: "ARG-CP007-QL006-T01", archetype: "CONCISE_ALTERNATIVE_EFFECT",
    slotA: slots(
      ["an online marketplace", "an examination authority", "a bank", "a college"],
      ["एक ऑनलाइन मार्केटप्लेस", "एक परीक्षा प्राधिकरण", "एक बैंक", "एक कॉलेज"],
      ["ਇੱਕ ਆਨਲਾਈਨ ਮਾਰਕੀਟਪਲੇਸ", "ਇੱਕ ਪ੍ਰੀਖਿਆ ਅਥਾਰਟੀ", "ਇੱਕ ਬੈਂਕ", "ਇੱਕ ਕਾਲਜ"],
    ),
    slotB: slots(
      ["one buyer complaint", "one cheating complaint", "one automated fraud flag", "one misconduct allegation"],
      ["एक खरीदार शिकायत", "एक नकल शिकायत", "एक स्वचालित धोखाधड़ी संकेत", "एक कदाचार आरोप"],
      ["ਇੱਕ ਖਰੀਦਦਾਰ ਸ਼ਿਕਾਇਤ", "ਇੱਕ ਨਕਲ ਦੀ ਸ਼ਿਕਾਇਤ", "ਇੱਕ ਆਟੋਮੈਟਿਕ ਧੋਖਾਧੜੀ ਸੰਕੇਤ", "ਇੱਕ ਗਲਤ ਵਿਹਾਰ ਦਾ ਦੋਸ਼"],
    ),
    statement: localized(
      "Should {a} impose a permanent penalty immediately after {b}?",
      "क्या {a} को {b} के तुरंत बाद स्थायी दंड लगा देना चाहिए?",
      "ਕੀ {a} ਨੂੰ {b} ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?",
    ),
    arguments: [
      candidate("STRONG", localized(
        "No. Temporary safeguards and evidence review can protect users before an irreversible penalty is imposed.",
        "नहीं। अस्थायी सुरक्षा और साक्ष्य समीक्षा अपरिवर्तनीय दंड से पहले उपयोगकर्ताओं की रक्षा कर सकती है।",
        "ਨਹੀਂ। ਅਸਥਾਈ ਸੁਰੱਖਿਆ ਅਤੇ ਸਬੂਤ ਸਮੀਖਿਆ ਅਟੱਲ ਸਜ਼ਾ ਤੋਂ ਪਹਿਲਾਂ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਰੱਖਿਆ ਕਰ ਸਕਦੀ ਹੈ।",
      ), localized("It offers a credible less-restrictive alternative with due process.", "यह उचित प्रक्रिया के साथ विश्वसनीय कम-कठोर विकल्प देता है।", "ਇਹ ਯੋਗ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਭਰੋਸੇਯੋਗ ਘੱਟ-ਕਠੋਰ ਵਿਕਲਪ ਦਿੰਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "Yes. {b} can occur only when guilt is already certain.",
        "हाँ। {b} तभी हो सकता है जब दोष पहले से निश्चित हो।",
        "ਹਾਂ। {b} ਸਿਰਫ਼ ਤਦ ਹੀ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੋਵੇ।",
      ), localized("A complaint or flag is not automatic proof.", "शिकायत या संकेत अपने-आप प्रमाण नहीं है।", "ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਕੇਤ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ ਹੁੰਦਾ।")),
      candidate("STRONG", localized(
        "No. A mistaken {b} can cause serious harm if the penalty cannot later be reversed.",
        "नहीं। गलत {b} गंभीर नुकसान कर सकता है यदि दंड बाद में वापस न लिया जा सके।",
        "ਨਹੀਂ। ਗਲਤ {b} ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦਾ ਹੈ ਜੇ ਸਜ਼ਾ ਬਾਅਦ ਵਿੱਚ ਵਾਪਸ ਨਾ ਲਈ ਜਾ ਸਕੇ।",
      ), localized("It identifies a credible second-order cost of an irreversible response.", "यह अपरिवर्तनीय प्रतिक्रिया की विश्वसनीय द्वितीयक लागत बताता है।", "ਇਹ ਅਟੱਲ ਕਾਰਵਾਈ ਦੀ ਭਰੋਸੇਯੋਗ ਦੂਜੇ ਪੱਧਰ ਦੀ ਲਾਗਤ ਦੱਸਦਾ ਹੈ।")),
      candidate("WEAK", localized(
        "No. If an immediate permanent penalty is rejected, {a} must ignore every future complaint.",
        "नहीं। यदि तत्काल स्थायी दंड नहीं लगाया जाए, तो {a} को भविष्य की हर शिकायत अनदेखी करनी होगी।",
        "ਨਹੀਂ। ਜੇ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਲਗਾਈ ਜਾਵੇ, ਤਾਂ {a} ਨੂੰ ਭਵਿੱਖ ਦੀ ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ।",
      ), localized("It creates a false choice between permanent punishment and doing nothing.", "यह स्थायी दंड और कुछ न करने के बीच झूठा विकल्प बनाता है।", "ਇਹ ਸਥਾਈ ਸਜ਼ਾ ਅਤੇ ਕੁਝ ਨਾ ਕਰਨ ਵਿਚਕਾਰ ਝੂਠਾ ਚੋਣ-ਵਿਕਲਪ ਬਣਾਉਂਦਾ ਹੈ।")),
    ],
  }),
});

function positiveModulo(value: number, divisor: number) {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function fill(value: string, a: string, b: string) {
  return value.replaceAll("{a}", a).replaceAll("{b}", b);
}

function normalizeLocale(value: ArgLocale | string): ArgLocale {
  if (value === "hi" || value === "hi-IN") return "hi-IN";
  if (value === "pa" || value === "pb" || value === "pa-IN") return "pa-IN";
  return "en-IN";
}

function authorityDifficulty(value: ArgCp007Difficulty): ArgDifficulty {
  if (value === "Easy") return "EASY";
  if (value === "Medium") return "MEDIUM";
  return "HARD";
}

function validateDifficulty(profile: ArgCp007ExamProfile, difficulty: ArgCp007Difficulty) {
  const supported = ARG_CP007_EXAM_PROFILES[profile].supportedDifficulties as readonly string[];
  if (!supported.includes(difficulty)) throw new Error(`${profile} does not support ${difficulty}. Supported: ${supported.join(", ")}`);
}

function renderTemplate(template: ProfileTemplate, locale: ArgLocale, seed: number) {
  for (const candidateLocale of LOCALES) {
    if (template.slotA[candidateLocale].length !== 4 || template.slotB[candidateLocale].length !== 4) {
      throw new Error(`${template.templateId}: every CP007 semantic slot requires exactly four values for ${candidateLocale}`);
    }
  }
  const aIndex = positiveModulo(seed, 4);
  const bIndex = positiveModulo(Math.floor(seed / 4) + Math.imul(seed, 3), 4);
  const a = template.slotA[locale][aIndex]!;
  const b = template.slotB[locale][bIndex]!;
  return Object.freeze({
    variantKey: `${aIndex}${bIndex}`,
    statement: fill(template.statement[locale], a, b),
    arguments: Object.freeze(template.arguments.map((argument) => Object.freeze({
      strength: argument.strength,
      text: fill(argument.text[locale], a, b),
      reason: fill(argument.reason[locale], a, b),
    }))),
  });
}

function selection(profile: ArgCp007ExamProfile, difficulty: ArgCp007Difficulty, seed: number): readonly number[] {
  if (profile === "BANKING_COMBO_4X5") {
    const rotation = positiveModulo(seed, 4);
    return [0, 1, 2, 3].map((index) => (index + rotation) % 4);
  }
  if (profile === "BANKING_COMBO_3X5") {
    const sets = difficulty === "Hard" ? [[1, 2, 3], [3, 0, 1]] : [[0, 1, 2], [2, 3, 0]];
    return sets[positiveModulo(seed, sets.length)]!;
  }
  if (profile === "SSC_RECENT_2X4") {
    const sets = difficulty === "Easy" ? [[0, 1], [1, 2], [2, 3], [3, 0]] : [[0, 2], [1, 3], [2, 0], [3, 1]];
    return sets[positiveModulo(seed, sets.length)]!;
  }
  const sets = difficulty === "Medium" ? [[0, 1], [1, 2], [2, 3], [3, 0]] : [[0, 2], [1, 3], [2, 0], [3, 1]];
  return sets[positiveModulo(seed, sets.length)]!;
}

function twoOptions(locale: ArgLocale, five: boolean): readonly string[] {
  if (locale === "hi-IN") return five
    ? ["केवल तर्क I मजबूत है", "केवल तर्क II मजबूत है", "या तो तर्क I या II मजबूत है", "न तो तर्क I और न ही II मजबूत है", "दोनों तर्क I और II मजबूत हैं"]
    : ["केवल तर्क I मजबूत है", "केवल तर्क II मजबूत है", "दोनों तर्क I और II मजबूत हैं", "न तो तर्क I और न ही II मजबूत है"];
  if (locale === "pa-IN") return five
    ? ["ਕੇਵਲ ਦਲੀਲ I ਮਜ਼ਬੂਤ ਹੈ", "ਕੇਵਲ ਦਲੀਲ II ਮਜ਼ਬੂਤ ਹੈ", "ਜਾਂ ਦਲੀਲ I ਜਾਂ II ਮਜ਼ਬੂਤ ਹੈ", "ਨਾ ਦਲੀਲ I ਅਤੇ ਨਾ ਹੀ II ਮਜ਼ਬੂਤ ਹੈ", "ਦੋਵੇਂ ਦਲੀਲਾਂ I ਅਤੇ II ਮਜ਼ਬੂਤ ਹਨ"]
    : ["ਕੇਵਲ ਦਲੀਲ I ਮਜ਼ਬੂਤ ਹੈ", "ਕੇਵਲ ਦਲੀਲ II ਮਜ਼ਬੂਤ ਹੈ", "ਦੋਵੇਂ ਦਲੀਲਾਂ I ਅਤੇ II ਮਜ਼ਬੂਤ ਹਨ", "ਨਾ ਦਲੀਲ I ਅਤੇ ਨਾ ਹੀ II ਮਜ਼ਬੂਤ ਹੈ"];
  return five
    ? ["Only argument I is strong", "Only argument II is strong", "Either argument I or II is strong", "Neither argument I nor II is strong", "Both arguments I and II are strong"]
    : ["Only argument I is strong", "Only argument II is strong", "Both arguments I and II are strong", "Neither argument I nor II is strong"];
}

function twoCorrectIndex(strengths: readonly ArgStrength[], five: boolean) {
  const first = strengths[0] === "STRONG";
  const second = strengths[1] === "STRONG";
  if (first && second) return five ? 4 : 2;
  if (first) return 0;
  if (second) return 1;
  return 3;
}

function subsetKey(indices: readonly number[]) {
  return [...indices].sort((a, b) => a - b).join(",");
}

function subsetLabel(locale: ArgLocale, indices: readonly number[], count: number) {
  if (indices.length === 0) {
    if (locale === "hi-IN") return "कोई भी तर्क मजबूत नहीं है";
    if (locale === "pa-IN") return "ਕੋਈ ਵੀ ਦਲੀਲ ਮਜ਼ਬੂਤ ਨਹੀਂ ਹੈ";
    return "None of the arguments is strong";
  }
  if (indices.length === count) {
    if (locale === "hi-IN") return "सभी तर्क मजबूत हैं";
    if (locale === "pa-IN") return "ਸਾਰੀਆਂ ਦਲੀਲਾਂ ਮਜ਼ਬੂਤ ਹਨ";
    return "All arguments are strong";
  }
  const labels = indices.map((index) => ROMAN[index]!);
  const joiner = locale === "hi-IN" ? " और " : locale === "pa-IN" ? " ਅਤੇ " : " and ";
  const names = labels.join(joiner);
  if (locale === "hi-IN") return `केवल तर्क ${names} मजबूत ${labels.length === 1 ? "है" : "हैं"}`;
  if (locale === "pa-IN") return `ਕੇਵਲ ਦਲੀਲ ${names} ਮਜ਼ਬੂਤ ${labels.length === 1 ? "ਹੈ" : "ਹਨ"}`;
  return `Only argument${labels.length === 1 ? "" : "s"} ${names} ${labels.length === 1 ? "is" : "are"} strong`;
}

function combinationOptions(locale: ArgLocale, strengths: readonly ArgStrength[], seed: number) {
  const count = strengths.length;
  const correct = strengths.flatMap((strength, index) => strength === "STRONG" ? [index] : []);
  const correctKey = subsetKey(correct);
  const subsets = Array.from({ length: 1 << count }, (_, mask) =>
    Array.from({ length: count }, (_, index) => index).filter((index) => Boolean(mask & (1 << index))),
  ).filter((indices) => subsetKey(indices) !== correctKey);
  const choices: number[][] = [correct];
  const offset = positiveModulo(seed * 5 + count * 13, subsets.length);
  for (let step = 0; choices.length < 5 && step < subsets.length * 2; step += 1) {
    const next = subsets[(offset + step * 3) % subsets.length]!;
    if (!choices.some((entry) => subsetKey(entry) === subsetKey(next))) choices.push(next);
  }
  if (choices.length !== 5) throw new Error("ARG-001 CP007 could not construct five unique combination options");
  const rotation = positiveModulo(seed, 5);
  const ordered = [...choices.slice(rotation), ...choices.slice(0, rotation)];
  const options = Object.freeze(ordered.map((indices) => subsetLabel(locale, indices, count)));
  const correctIndex = ordered.findIndex((indices) => subsetKey(indices) === correctKey);
  if (correctIndex < 0 || new Set(options).size !== 5) throw new Error("ARG-001 CP007 option integrity failure");
  return Object.freeze({ options, correctIndex, strongIndices: Object.freeze(correct) });
}

function instruction(locale: ArgLocale, count: number) {
  if (locale === "hi-IN") return `कथन पढ़िए और तय कीजिए कि दिए गए ${count} तर्कों में से कौन-से मजबूत हैं।`;
  if (locale === "pa-IN") return `ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਦਿੱਤੀਆਂ ${count} ਦਲੀਲਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀਆਂ ਮਜ਼ਬੂਤ ਹਨ।`;
  return `Read the statement and decide which of the ${count} arguments are strong.`;
}

function stem(locale: ArgLocale, statement: string, argumentsList: readonly string[]) {
  const statementLabel = locale === "hi-IN" ? "कथन" : locale === "pa-IN" ? "ਕਥਨ" : "Statement";
  const argumentsLabel = locale === "hi-IN" ? "तर्क" : locale === "pa-IN" ? "ਦਲੀਲਾਂ" : "Arguments";
  return `${statementLabel}: ${statement}\n${argumentsLabel}:\n${argumentsList.map((value, index) => `${ROMAN[index]}. ${value}`).join("\n")}`;
}

function hash(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function stableHash(text: string) {
  let hashValue = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hashValue ^= text.charCodeAt(index);
    hashValue = Math.imul(hashValue, 16777619) >>> 0;
  }
  return hashValue >>> 0;
}

export function generateArgCp007ExamProfileQuestion(input: {
  readonly qlId: ArgQlId;
  readonly locale: ArgLocale | string;
  readonly seed: number;
  readonly profile: ArgCp007ExamProfile;
  readonly difficulty: ArgCp007Difficulty;
}) {
  validateDifficulty(input.profile, input.difficulty);
  const locale = normalizeLocale(input.locale);
  const template = TEMPLATES[input.qlId];
  const rendered = renderTemplate(template, locale, input.seed);
  const indices = selection(input.profile, input.difficulty, input.seed);
  const chosen = indices.map((index) => rendered.arguments[index]!);
  const argumentsList = Object.freeze(chosen.map((argument) => argument.text));
  const strengths = Object.freeze(chosen.map((argument) => argument.strength));
  const profileMeta = ARG_CP007_EXAM_PROFILES[input.profile];

  let options: readonly string[];
  let correctIndex: number;
  let strongIndices: readonly number[];
  if (profileMeta.argumentCount === 2) {
    const five = input.profile === "BANKING_CLASSIC_2X5";
    options = Object.freeze(twoOptions(locale, five));
    correctIndex = twoCorrectIndex(strengths, five);
    strongIndices = Object.freeze(strengths.flatMap((strength, index) => strength === "STRONG" ? [index] : []));
    if (five && correctIndex === 2) throw new Error("ARG-001 CP007 either-option must remain a distractor");
  } else {
    const combination = combinationOptions(locale, strengths, input.seed);
    options = combination.options;
    correctIndex = combination.correctIndex;
    strongIndices = combination.strongIndices;
  }

  if (argumentsList.length !== profileMeta.argumentCount || options.length !== profileMeta.optionCount) {
    throw new Error("ARG-001 CP007 profile-shape integrity failure");
  }

  const explanation = chosen.map((argument, index) => {
    const label = ROMAN[index]!;
    if (locale === "hi-IN") return `तर्क ${label} ${argument.strength === "STRONG" ? "मजबूत" : "कमजोर"} है: ${argument.reason}`;
    if (locale === "pa-IN") return `ਦਲੀਲ ${label} ${argument.strength === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${argument.reason}`;
    return `Argument ${label} is ${argument.strength.toLowerCase()}: ${argument.reason}`;
  }).join(" ");
  const contentFingerprint = hash([input.qlId, input.profile, input.difficulty, locale, input.seed, rendered.variantKey, argumentsList, options, correctIndex]);

  return Object.freeze({
    chapterId: "ARG-001" as const,
    checkpointId: ARG_CP007_CHECKPOINT_ID,
    authority: ARG_CP007_AUTHORITY,
    qlId: input.qlId,
    templateId: template.templateId,
    archetype: template.archetype,
    scenarioId: `${template.templateId}-${input.profile}-${rendered.variantKey}`,
    profile: input.profile,
    profileLabel: profileMeta.label,
    locale,
    seed: input.seed,
    difficulty: authorityDifficulty(input.difficulty),
    difficultyLabel: input.difficulty,
    instruction: instruction(locale, profileMeta.argumentCount),
    stem: stem(locale, rendered.statement, argumentsList),
    statement: rendered.statement,
    arguments: argumentsList,
    argumentStrengths: strengths,
    strongArgumentIndices: strongIndices,
    options,
    correctIndex,
    answer: options[correctIndex]!,
    explanation,
    contentFingerprint,
    metadata: Object.freeze({
      authority: ARG_CP007_AUTHORITY,
      sourceProfile: profileMeta.sourceProfile,
      argumentCount: profileMeta.argumentCount,
      optionCount: profileMeta.optionCount,
      conciseExamSurface: input.profile === "SSC_RECENT_2X4",
      trilingualSemanticParity: true as const,
      cp006CoreUnmodified: true as const,
      cp006FreezeAuthorityRetained: "ARG_CP006_IMMUTABLE_FREEZE_V1" as const,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockEligible: false as const,
      publicEligible: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export function generateArgCp007ExamProfileBatch(input: {
  readonly profile: ArgCp007ExamProfile;
  readonly qlId?: ArgQlId;
  readonly locale?: ArgLocale | string;
  readonly difficulty: ArgCp007Difficulty;
  readonly seed?: string;
  readonly count?: number;
}) {
  validateDifficulty(input.profile, input.difficulty);
  const count = Math.min(50, Math.max(1, Math.floor(Number(input.count ?? 1) || 1)));
  const seedText = String(input.seed ?? "ARG-CP007-DEFAULT");
  const questions = Object.freeze(Array.from({ length: count }, (_, index) => {
    const qlId = input.qlId ?? ARG_QL_IDS[index % ARG_QL_IDS.length]!;
    const seed = stableHash(`${ARG_CP007_AUTHORITY}:${seedText}:${input.profile}:${input.difficulty}:${qlId}:${index}`) & 0x7fffffff;
    return generateArgCp007ExamProfileQuestion({ qlId, locale: input.locale ?? "en-IN", seed, profile: input.profile, difficulty: input.difficulty });
  }));
  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP007_CHECKPOINT_ID,
    authority: ARG_CP007_AUTHORITY,
    profile: input.profile,
    difficulty: input.difficulty,
    questions,
    generationContext: Object.freeze({
      chapterId: "ARG-001" as const,
      checkpointId: ARG_CP007_CHECKPOINT_ID,
      authority: ARG_CP007_AUTHORITY,
      examProfile: input.profile,
      reviewOnly: true as const,
      manualApprovalRequired: true as const,
      persistenceAllowed: false as const,
      questionBankWritable: false as const,
      testEligible: false as const,
      mockTestEligible: false as const,
      publiclyPublishable: false as const,
      automaticStudentPublication: false as const,
      learnerRelease: "LOCKED" as const,
    }),
  });
}

export const ARG_CP007_PROFILE_TEMPLATE_IDS = Object.freeze(
  ARG_QL_IDS.map((qlId) => TEMPLATES[qlId].templateId),
);
