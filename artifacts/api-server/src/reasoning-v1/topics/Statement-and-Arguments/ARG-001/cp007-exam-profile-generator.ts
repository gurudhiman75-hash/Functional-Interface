import { createHash } from "node:crypto";

import { ARG_QL_IDS, type ArgDifficulty, type ArgLocale, type ArgQlId, type ArgStrength } from "./types.ts";

export const ARG_CP007_CHECKPOINT_ID = "ARG-CP-007" as const;
export const ARG_CP007_AUTHORITY = "ARG_CP007_REAL_PAPER_PARITY_V1" as const;

export const ARG_CP007_EXAM_PROFILES = Object.freeze({
  SSC_RECENT_2X4: Object.freeze({
    id: "SSC_RECENT_2X4" as const,
    label: "Recent SSC/state-style two-argument four-option",
    argumentCount: 2 as const,
    optionCount: 4 as const,
    supportedDifficulties: Object.freeze(["Easy", "Medium"] as const),
    evidenceBoundary: "Uploaded recent RRB/UPPCS/UP Police-style two-argument four-option questions",
  }),
  BANKING_CLASSIC_2X5: Object.freeze({
    id: "BANKING_CLASSIC_2X5" as const,
    label: "Classic banking two-argument five-option",
    argumentCount: 2 as const,
    optionCount: 5 as const,
    supportedDifficulties: Object.freeze(["Medium", "Hard"] as const),
    evidenceBoundary: "Uploaded RBI/SBI/Bank PO-style two-argument five-option questions",
  }),
  BANKING_COMBO_3X5: Object.freeze({
    id: "BANKING_COMBO_3X5" as const,
    label: "Banking three-argument combination",
    argumentCount: 3 as const,
    optionCount: 5 as const,
    supportedDifficulties: Object.freeze(["Medium", "Hard"] as const),
    evidenceBoundary: "Uploaded SBI PO/Bank PO-style three-argument combination questions",
  }),
  BANKING_COMBO_4X5: Object.freeze({
    id: "BANKING_COMBO_4X5" as const,
    label: "Banking four-argument combination",
    argumentCount: 4 as const,
    optionCount: 5 as const,
    supportedDifficulties: Object.freeze(["Hard"] as const),
    evidenceBoundary: "Uploaded Bank PO-style four-argument combination questions",
  }),
} as const);

export type ArgCp007ExamProfile = keyof typeof ARG_CP007_EXAM_PROFILES;
export type ArgCp007Difficulty = "Easy" | "Medium" | "Hard";

type Localized = Readonly<Record<ArgLocale, string>>;
type LocalizedSlot = Readonly<Record<ArgLocale, readonly [string, string, string, string]>>;

type MultiArgumentTemplate = Readonly<{
  qlId: ArgQlId;
  templateId: string;
  archetype: string;
  slotA: LocalizedSlot;
  slotB: LocalizedSlot;
  statement: Localized;
  arguments: readonly [
    Readonly<{ strength: ArgStrength; text: Localized; reason: Localized }>,
    Readonly<{ strength: ArgStrength; text: Localized; reason: Localized }>,
    Readonly<{ strength: ArgStrength; text: Localized; reason: Localized }>,
    Readonly<{ strength: ArgStrength; text: Localized; reason: Localized }>,
  ];
}>;

const TEMPLATES: Readonly<Record<ArgQlId, MultiArgumentTemplate>> = Object.freeze({
  "ARG-QL-001": Object.freeze({
    qlId: "ARG-QL-001", templateId: "ARG-CP007-QL001-T01", archetype: "CONCISE_MATERIALITY_TRANSPARENCY",
    slotA: Object.freeze({
      "en-IN": ["a recruitment board", "a university", "a licensing authority", "a scholarship authority"],
      "hi-IN": ["एक भर्ती बोर्ड", "एक विश्वविद्यालय", "एक लाइसेंसिंग प्राधिकरण", "एक छात्रवृत्ति प्राधिकरण"],
      "pa-IN": ["ਇੱਕ ਭਰਤੀ ਬੋਰਡ", "ਇੱਕ ਯੂਨੀਵਰਸਿਟੀ", "ਇੱਕ ਲਾਇਸੈਂਸਿੰਗ ਅਥਾਰਟੀ", "ਇੱਕ ਸਕਾਲਰਸ਼ਿਪ ਅਥਾਰਟੀ"],
    }),
    slotB: Object.freeze({
      "en-IN": ["model answer points", "evaluation criteria", "a correction deadline", "a grievance contact"],
      "hi-IN": ["मॉडल उत्तर बिंदु", "मूल्यांकन मानदंड", "सुधार की अंतिम तिथि", "शिकायत संपर्क"],
      "pa-IN": ["ਮਾਡਲ ਉੱਤਰ ਬਿੰਦੂ", "ਮੁਲਾਂਕਣ ਮਾਪਦੰਡ", "ਸੋਧ ਦੀ ਆਖਰੀ ਮਿਤੀ", "ਸ਼ਿਕਾਇਤ ਸੰਪਰਕ"],
    }),
    statement: Object.freeze({
      "en-IN": "Should {a} display {b} clearly after the relevant process is complete?",
      "hi-IN": "क्या संबंधित प्रक्रिया पूरी होने के बाद {a} को {b} स्पष्ट रूप से दिखाना चाहिए?",
      "pa-IN": "ਕੀ ਸੰਬੰਧਿਤ ਪ੍ਰਕਿਰਿਆ ਪੂਰੀ ਹੋਣ ਤੋਂ ਬਾਅਦ {a} ਨੂੰ {b} ਸਪੱਸ਼ਟ ਤੌਰ 'ਤੇ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?",
    }),
    arguments: [
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "Yes. Clear {b} can help users understand the decision process and identify avoidable errors.",
        "hi-IN": "हाँ। स्पष्ट {b} उपयोगकर्ताओं को निर्णय प्रक्रिया समझने और टाली जा सकने वाली त्रुटियाँ पहचानने में मदद कर सकता है।",
        "pa-IN": "ਹਾਂ। ਸਪੱਸ਼ਟ {b} ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਫੈਸਲਾ ਪ੍ਰਕਿਰਿਆ ਸਮਝਣ ਅਤੇ ਟਾਲੀਆਂ ਜਾ ਸਕਣ ਵਾਲੀਆਂ ਗਲਤੀਆਂ ਪਛਾਣਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It gives a direct transparency benefit.", "hi-IN": "यह सीधा पारदर्शिता लाभ बताता है।", "pa-IN": "ਇਹ ਸਿੱਧਾ ਪਾਰਦਰਸ਼ਤਾ ਲਾਭ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. A page with {b} may look less attractive, so the information should not be shown.",
        "hi-IN": "नहीं। {b} वाला पृष्ठ कम आकर्षक लग सकता है, इसलिए जानकारी नहीं दिखानी चाहिए।",
        "pa-IN": "ਨਹੀਂ। {b} ਵਾਲਾ ਪੰਨਾ ਘੱਟ ਆਕਰਸ਼ਕ ਲੱਗ ਸਕਦਾ ਹੈ, ਇਸ ਲਈ ਜਾਣਕਾਰੀ ਨਹੀਂ ਦਿਖਾਉਣੀ ਚਾਹੀਦੀ।",
      }), reason: Object.freeze({
        "en-IN": "Appearance is trivial compared with the decision-related value of the information.", "hi-IN": "जानकारी के निर्णय-संबंधी महत्व की तुलना में रूप-सज्जा तुच्छ है।", "pa-IN": "ਜਾਣਕਾਰੀ ਦੇ ਫੈਸਲਾ-ਸਬੰਧੀ ਮਹੱਤਵ ਦੇ ਮੁਕਾਬਲੇ ਦਿੱਖ ਮਾਮੂਲੀ ਹੈ।",
      })}),
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "No. If {b} can change, {a} must keep it updated or users may rely on stale information.",
        "hi-IN": "नहीं। यदि {b} बदल सकता है, तो {a} को इसे अद्यतन रखना होगा, अन्यथा उपयोगकर्ता पुरानी जानकारी पर निर्भर कर सकते हैं।",
        "pa-IN": "ਨਹੀਂ। ਜੇ {b} ਬਦਲ ਸਕਦਾ ਹੈ, ਤਾਂ {a} ਨੂੰ ਇਸ ਨੂੰ ਅੱਪਡੇਟ ਰੱਖਣਾ ਹੋਵੇਗਾ, ਨਹੀਂ ਤਾਂ ਵਰਤੋਂਕਾਰ ਪੁਰਾਣੀ ਜਾਣਕਾਰੀ 'ਤੇ ਨਿਰਭਰ ਕਰ ਸਕਦੇ ਹਨ।",
      }), reason: Object.freeze({
        "en-IN": "It raises a material accuracy condition on publication.", "hi-IN": "यह प्रकाशन से जुड़ी महत्वपूर्ण शुद्धता-शर्त उठाता है।", "pa-IN": "ਇਹ ਪ੍ਰਕਾਸ਼ਨ ਨਾਲ ਜੁੜੀ ਮਹੱਤਵਪੂਰਨ ਸਹੀਪਣ ਦੀ ਸ਼ਰਤ ਉਠਾਉਂਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "Yes. Successful organisations usually display more information, so {a} must display {b}.",
        "hi-IN": "हाँ। सफल संस्थाएँ आमतौर पर अधिक जानकारी दिखाती हैं, इसलिए {a} को {b} दिखाना ही चाहिए।",
        "pa-IN": "ਹਾਂ। ਸਫਲ ਸੰਸਥਾਵਾਂ ਆਮ ਤੌਰ 'ਤੇ ਵਧੇਰੇ ਜਾਣਕਾਰੀ ਦਿਖਾਉਂਦੀਆਂ ਹਨ, ਇਸ ਲਈ {a} ਨੂੰ {b} ਜ਼ਰੂਰ ਦਿਖਾਉਣਾ ਚਾਹੀਦਾ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "Popularity or imitation does not establish that the proposal is materially justified.", "hi-IN": "लोकप्रियता या नकल प्रस्ताव की वास्तविक आवश्यकता सिद्ध नहीं करती।", "pa-IN": "ਲੋਕਪ੍ਰਿਯਤਾ ਜਾਂ ਨਕਲ ਪ੍ਰਸਤਾਵ ਦੀ ਅਸਲ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
      })}),
    ],
  }),
  "ARG-QL-002": Object.freeze({
    qlId: "ARG-QL-002", templateId: "ARG-CP007-QL002-T01", archetype: "CONCISE_MECHANISM_SECURITY",
    slotA: Object.freeze({
      "en-IN": ["a bank", "a payment wallet", "an insurance portal", "a brokerage app"],
      "hi-IN": ["एक बैंक", "एक भुगतान वॉलेट", "एक बीमा पोर्टल", "एक ब्रोकरेज ऐप"],
      "pa-IN": ["ਇੱਕ ਬੈਂਕ", "ਇੱਕ ਭੁਗਤਾਨ ਵਾਲਿਟ", "ਇੱਕ ਬੀਮਾ ਪੋਰਟਲ", "ਇੱਕ ਬ੍ਰੋਕਰੇਜ ਐਪ"],
    }),
    slotB: Object.freeze({
      "en-IN": ["the registered mobile number", "the recovery email", "the payout account", "the transaction limit"],
      "hi-IN": ["पंजीकृत मोबाइल नंबर", "रिकवरी ईमेल", "भुगतान खाता", "लेन-देन सीमा"],
      "pa-IN": ["ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ ਨੰਬਰ", "ਰਿਕਵਰੀ ਈਮੇਲ", "ਭੁਗਤਾਨ ਖਾਤਾ", "ਲੈਣ-ਦੇਣ ਸੀਮਾ"],
    }),
    statement: Object.freeze({
      "en-IN": "Should {a} require an independent verification before changing {b}?",
      "hi-IN": "क्या {a} को {b} बदलने से पहले स्वतंत्र सत्यापन आवश्यक करना चाहिए?",
      "pa-IN": "ਕੀ {a} ਨੂੰ {b} ਬਦਲਣ ਤੋਂ ਪਹਿਲਾਂ ਸੁਤੰਤਰ ਤਸਦੀਕ ਲਾਜ਼ਮੀ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ?",
    }),
    arguments: [
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "Yes. A second verification can stop stolen login details alone from being enough to change {b}.",
        "hi-IN": "हाँ। दूसरा सत्यापन केवल चोरी हुए लॉगिन विवरण के आधार पर {b} बदलने से रोक सकता है।",
        "pa-IN": "ਹਾਂ। ਦੂਜੀ ਤਸਦੀਕ ਸਿਰਫ਼ ਚੋਰੀ ਹੋਏ ਲਾਗਇਨ ਵੇਰਵਿਆਂ ਦੇ ਆਧਾਰ 'ਤੇ {b} ਬਦਲਣ ਤੋਂ ਰੋਕ ਸਕਦੀ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It states a plausible security mechanism.", "hi-IN": "यह एक विश्वसनीय सुरक्षा तंत्र बताता है।", "pa-IN": "ਇਹ ਇੱਕ ਭਰੋਸੇਯੋਗ ਸੁਰੱਖਿਆ ਤਰੀਕਾ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. One customer once failed a verification step, so every genuine change to {b} will become impossible.",
        "hi-IN": "नहीं। एक ग्राहक कभी सत्यापन में विफल हुआ था, इसलिए {b} में हर वास्तविक बदलाव असंभव हो जाएगा।",
        "pa-IN": "ਨਹੀਂ। ਇੱਕ ਗਾਹਕ ਕਦੇ ਤਸਦੀਕ ਵਿੱਚ ਅਸਫਲ ਹੋਇਆ ਸੀ, ਇਸ ਲਈ {b} ਵਿੱਚ ਹਰ ਅਸਲੀ ਬਦਲਾਅ ਅਸੰਭਵ ਹੋ ਜਾਵੇਗਾ।",
      }), reason: Object.freeze({
        "en-IN": "A single anecdote cannot prove universal implementation failure.", "hi-IN": "एक घटना सार्वभौमिक विफलता सिद्ध नहीं करती।", "pa-IN": "ਇੱਕ ਘਟਨਾ ਸਰਬਭੌਮ ਨਾਕਾਮੀ ਸਾਬਤ ਨਹੀਂ ਕਰਦੀ।",
      })}),
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "Yes. An alert through an old verified channel can help detect an unauthorised change to {b} quickly.",
        "hi-IN": "हाँ। पुराने सत्यापित माध्यम से चेतावनी {b} में अनधिकृत बदलाव जल्दी पकड़ने में मदद कर सकती है।",
        "pa-IN": "ਹਾਂ। ਪੁਰਾਣੇ ਤਸਦੀਕਸ਼ੁਦਾ ਮਾਧਿਅਮ ਰਾਹੀਂ ਚੇਤਾਵਨੀ {b} ਵਿੱਚ ਗੈਰ-ਅਧਿਕਾਰਤ ਬਦਲਾਅ ਜਲਦੀ ਪਕੜਣ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦੀ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It gives a credible early-warning mechanism.", "hi-IN": "यह विश्वसनीय प्रारंभिक चेतावनी तंत्र बताता है।", "pa-IN": "ਇਹ ਭਰੋਸੇਯੋਗ ਸ਼ੁਰੂਆਤੀ ਚੇਤਾਵਨੀ ਤਰੀਕਾ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "Yes. Verification guarantees that fraud involving {b} can never occur.",
        "hi-IN": "हाँ। सत्यापन यह गारंटी देता है कि {b} से जुड़ी धोखाधड़ी कभी नहीं हो सकती।",
        "pa-IN": "ਹਾਂ। ਤਸਦੀਕ ਇਹ ਗਾਰੰਟੀ ਦਿੰਦੀ ਹੈ ਕਿ {b} ਨਾਲ ਜੁੜੀ ਧੋਖਾਧੜੀ ਕਦੇ ਨਹੀਂ ਹੋ ਸਕਦੀ।",
      }), reason: Object.freeze({
        "en-IN": "The absolute guarantee is unsupported.", "hi-IN": "पूर्ण गारंटी का दावा असमर्थित है।", "pa-IN": "ਪੂਰੀ ਗਾਰੰਟੀ ਦਾ ਦਾਅਵਾ ਬਿਨਾਂ ਆਧਾਰ ਹੈ।",
      })}),
    ],
  }),
  "ARG-QL-003": Object.freeze({
    qlId: "ARG-QL-003", templateId: "ARG-CP007-QL003-T01", archetype: "CONCISE_IMPLEMENTATION_QUEUE",
    slotA: Object.freeze({
      "en-IN": ["a passport centre", "a district hospital", "a municipal office", "a citizen-service centre"],
      "hi-IN": ["एक पासपोर्ट केंद्र", "एक जिला अस्पताल", "एक नगर कार्यालय", "एक नागरिक सेवा केंद्र"],
      "pa-IN": ["ਇੱਕ ਪਾਸਪੋਰਟ ਕੇਂਦਰ", "ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਹਸਪਤਾਲ", "ਇੱਕ ਨਗਰ ਦਫ਼ਤਰ", "ਇੱਕ ਨਾਗਰਿਕ ਸੇਵਾ ਕੇਂਦਰ"],
    }),
    slotB: Object.freeze({
      "en-IN": ["routine document services", "registration services", "fee-payment services", "standard certificate services"],
      "hi-IN": ["नियमित दस्तावेज सेवाओं", "पंजीकरण सेवाओं", "शुल्क भुगतान सेवाओं", "मानक प्रमाणपत्र सेवाओं"],
      "pa-IN": ["ਰੁਟੀਨ ਦਸਤਾਵੇਜ਼ ਸੇਵਾਵਾਂ", "ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸੇਵਾਵਾਂ", "ਫੀਸ ਭੁਗਤਾਨ ਸੇਵਾਵਾਂ", "ਮਿਆਰੀ ਸਰਟੀਫਿਕੇਟ ਸੇਵਾਵਾਂ"],
    }),
    statement: Object.freeze({
      "en-IN": "Should {a} introduce scheduled time slots for {b}?",
      "hi-IN": "क्या {a} को {b} के लिए निर्धारित समय-स्लॉट शुरू करने चाहिए?",
      "pa-IN": "ਕੀ {a} ਨੂੰ {b} ਲਈ ਨਿਰਧਾਰਤ ਸਮਾਂ-ਸਲਾਟ ਸ਼ੁਰੂ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ?",
    }),
    arguments: [
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "Yes. Time slots can spread arrivals and reduce crowding for {b}.",
        "hi-IN": "हाँ। समय-स्लॉट आगमन को फैलाकर {b} में भीड़ कम कर सकते हैं।",
        "pa-IN": "ਹਾਂ। ਸਮਾਂ-ਸਲਾਟ ਆਉਣ ਵਾਲਿਆਂ ਨੂੰ ਵੰਡ ਕੇ {b} ਵਿੱਚ ਭੀੜ ਘਟਾ ਸਕਦੇ ਹਨ।",
      }), reason: Object.freeze({
        "en-IN": "It gives a practical queue-management benefit.", "hi-IN": "यह व्यावहारिक कतार-प्रबंधन लाभ बताता है।", "pa-IN": "ਇਹ ਵਿਆਵਹਾਰਿਕ ਕਤਾਰ-ਪ੍ਰਬੰਧਨ ਲਾਭ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. Time slots require every visitor to own an expensive desktop computer.",
        "hi-IN": "नहीं। समय-स्लॉट के लिए हर आगंतुक के पास महंगा डेस्कटॉप कंप्यूटर होना जरूरी है।",
        "pa-IN": "ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਲਈ ਹਰ ਆਉਣ ਵਾਲੇ ਕੋਲ ਮਹਿੰਗਾ ਡੈਸਕਟਾਪ ਕੰਪਿਊਟਰ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It assumes an unnecessary implementation requirement.", "hi-IN": "यह अनावश्यक कार्यान्वयन शर्त मान लेता है।", "pa-IN": "ਇਹ ਬੇਲੋੜੀ ਲਾਗੂ ਕਰਨ ਦੀ ਸ਼ਰਤ ਮੰਨ ਲੈਂਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "No. {a} still needs a walk-in or assisted fallback for users who cannot book a slot.",
        "hi-IN": "नहीं। जो उपयोगकर्ता स्लॉट बुक नहीं कर सकते, उनके लिए {a} को वॉक-इन या सहायक विकल्प रखना होगा।",
        "pa-IN": "ਨਹੀਂ। ਜੋ ਵਰਤੋਂਕਾਰ ਸਲਾਟ ਬੁੱਕ ਨਹੀਂ ਕਰ ਸਕਦੇ, ਉਨ੍ਹਾਂ ਲਈ {a} ਨੂੰ ਵਾਕ-ਇਨ ਜਾਂ ਸਹਾਇਤਾ ਵਿਕਲਪ ਰੱਖਣਾ ਹੋਵੇਗਾ।",
      }), reason: Object.freeze({
        "en-IN": "It identifies a real access and implementation dependency.", "hi-IN": "यह वास्तविक पहुंच और कार्यान्वयन निर्भरता बताता है।", "pa-IN": "ਇਹ ਅਸਲੀ ਪਹੁੰਚ ਅਤੇ ਲਾਗੂ ਕਰਨ ਦੀ ਨਿਰਭਰਤਾ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. Any use of time slots makes {b} permanently impossible to deliver.",
        "hi-IN": "नहीं। समय-स्लॉट का कोई भी उपयोग {b} को स्थायी रूप से असंभव बना देता है।",
        "pa-IN": "ਨਹੀਂ। ਸਮਾਂ-ਸਲਾਟ ਦੀ ਕੋਈ ਵੀ ਵਰਤੋਂ {b} ਨੂੰ ਸਦਾ ਲਈ ਅਸੰਭਵ ਬਣਾ ਦਿੰਦੀ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "The absolute implementation claim is unsupported.", "hi-IN": "पूर्ण कार्यान्वयन दावा असमर्थित है।", "pa-IN": "ਪੂਰਨ ਲਾਗੂ ਕਰਨ ਵਾਲਾ ਦਾਅਵਾ ਬਿਨਾਂ ਆਧਾਰ ਹੈ।",
      })}),
    ],
  }),
  "ARG-QL-004": Object.freeze({
    qlId: "ARG-QL-004", templateId: "ARG-CP007-QL004-T01", archetype: "CONCISE_PROPORTIONALITY_RESTRICTION",
    slotA: Object.freeze({
      "en-IN": ["a market street", "a school-zone road", "a station-front road", "a hospital approach road"],
      "hi-IN": ["एक बाजार सड़क", "एक स्कूल-क्षेत्र सड़क", "एक स्टेशन-सामने की सड़क", "एक अस्पताल पहुंच सड़क"],
      "pa-IN": ["ਇੱਕ ਬਾਜ਼ਾਰ ਸੜਕ", "ਇੱਕ ਸਕੂਲ-ਇਲਾਕਾ ਸੜਕ", "ਇੱਕ ਸਟੇਸ਼ਨ-ਸਾਹਮਣੇ ਸੜਕ", "ਇੱਕ ਹਸਪਤਾਲ ਪਹੁੰਚ ਸੜਕ"],
    }),
    slotB: Object.freeze({
      "en-IN": ["the evening peak", "school closing time", "the morning rush", "weekend peak hours"],
      "hi-IN": ["शाम के व्यस्त समय", "स्कूल छुट्टी के समय", "सुबह की भीड़", "सप्ताहांत के व्यस्त समय"],
      "pa-IN": ["ਸ਼ਾਮ ਦੇ ਭੀੜ ਸਮੇਂ", "ਸਕੂਲ ਛੁੱਟੀ ਦੇ ਸਮੇਂ", "ਸਵੇਰ ਦੀ ਭੀੜ", "ਹਫ਼ਤੇਅੰਤ ਦੇ ਭੀੜ ਸਮੇਂ"],
    }),
    statement: Object.freeze({
      "en-IN": "Should heavy vehicles be restricted on {a} during {b}?",
      "hi-IN": "क्या {b} के दौरान {a} पर भारी वाहनों को सीमित किया जाना चाहिए?",
      "pa-IN": "ਕੀ {b} ਦੌਰਾਨ {a} 'ਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਸੀਮਿਤ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
    }),
    arguments: [
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "Yes. A limited restriction during {b} can reduce conflict without creating an all-day ban.",
        "hi-IN": "हाँ। {b} के दौरान सीमित प्रतिबंध पूरे दिन के प्रतिबंध के बिना टकराव कम कर सकता है।",
        "pa-IN": "ਹਾਂ। {b} ਦੌਰਾਨ ਸੀਮਿਤ ਪਾਬੰਦੀ ਪੂਰੇ ਦਿਨ ਦੀ ਪਾਬੰਦੀ ਤੋਂ ਬਿਨਾਂ ਟਕਰਾਅ ਘਟਾ ਸਕਦੀ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It is directly relevant and proportionate in time.", "hi-IN": "यह सीधे प्रासंगिक और समय की दृष्टि से अनुपातिक है।", "pa-IN": "ਇਹ ਸਿੱਧਾ ਸੰਬੰਧਿਤ ਅਤੇ ਸਮੇਂ ਦੇ ਹਿਸਾਬ ਨਾਲ ਅਨੁਪਾਤਿਕ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. A short restriction on {a} will permanently destroy all activity in the area.",
        "hi-IN": "नहीं। {a} पर थोड़े समय का प्रतिबंध क्षेत्र की सारी गतिविधि स्थायी रूप से नष्ट कर देगा।",
        "pa-IN": "ਨਹੀਂ। {a} 'ਤੇ ਥੋੜ੍ਹੇ ਸਮੇਂ ਦੀ ਪਾਬੰਦੀ ਇਲਾਕੇ ਦੀ ਸਾਰੀ ਸਰਗਰਮੀ ਸਦਾ ਲਈ ਖਤਮ ਕਰ ਦੇਵੇਗੀ।",
      }), reason: Object.freeze({
        "en-IN": "It turns a limited measure into an unsupported permanent-harm claim.", "hi-IN": "यह सीमित उपाय को बिना आधार स्थायी नुकसान के दावे में बदल देता है।", "pa-IN": "ਇਹ ਸੀਮਿਤ ਕਦਮ ਨੂੰ ਬਿਨਾਂ ਆਧਾਰ ਸਥਾਈ ਨੁਕਸਾਨ ਦੇ ਦਾਅਵੇ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "No. Emergency and essential-delivery access may need defined exceptions during {b}.",
        "hi-IN": "नहीं। {b} के दौरान आपातकालीन और आवश्यक डिलीवरी के लिए स्पष्ट अपवाद जरूरी हो सकते हैं।",
        "pa-IN": "ਨਹੀਂ। {b} ਦੌਰਾਨ ਐਮਰਜੈਂਸੀ ਅਤੇ ਜ਼ਰੂਰੀ ਡਿਲੀਵਰੀ ਲਈ ਸਪੱਸ਼ਟ ਛੋਟਾਂ ਲੋੜੀਂਦੀਆਂ ਹੋ ਸਕਦੀਆਂ ਹਨ।",
      }), reason: Object.freeze({
        "en-IN": "It raises a material scope limitation rather than rejecting the policy outright.", "hi-IN": "यह नीति को पूरी तरह नकारे बिना महत्वपूर्ण सीमा बताता है।", "pa-IN": "ਇਹ ਨੀਤੀ ਨੂੰ ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੱਦ ਕੀਤੇ ਬਿਨਾਂ ਮਹੱਤਵਪੂਰਨ ਹੱਦ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "Yes. If any restriction helps once, heavy vehicles should be banned from {a} at all times.",
        "hi-IN": "हाँ। यदि प्रतिबंध कभी मदद करता है, तो {a} पर भारी वाहनों को हर समय प्रतिबंधित कर देना चाहिए।",
        "pa-IN": "ਹਾਂ। ਜੇ ਪਾਬੰਦੀ ਕਦੇ ਮਦਦ ਕਰਦੀ ਹੈ, ਤਾਂ {a} 'ਤੇ ਭਾਰੀ ਵਾਹਨਾਂ ਨੂੰ ਹਰ ਵੇਲੇ ਬੰਦ ਕਰ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It unjustifiably expands a limited measure into a blanket ban.", "hi-IN": "यह सीमित उपाय को अनुचित रूप से पूर्ण प्रतिबंध में बदल देता है।", "pa-IN": "ਇਹ ਸੀਮਿਤ ਕਦਮ ਨੂੰ ਬਿਨਾਂ ਜਾਇਜ਼ ਕਾਰਨ ਪੂਰੀ ਪਾਬੰਦੀ ਵਿੱਚ ਬਦਲ ਦਿੰਦਾ ਹੈ।",
      })}),
    ],
  }),
  "ARG-QL-005": Object.freeze({
    qlId: "ARG-QL-005", templateId: "ARG-CP007-QL005-T01", archetype: "CONCISE_PRIVACY_NOTICE",
    slotA: Object.freeze({
      "en-IN": ["office employees", "remote employees", "field staff", "contract workers"],
      "hi-IN": ["कार्यालय कर्मचारियों", "दूरस्थ कर्मचारियों", "फील्ड स्टाफ", "संविदा कर्मचारियों"],
      "pa-IN": ["ਦਫ਼ਤਰੀ ਕਰਮਚਾਰੀਆਂ", "ਰਿਮੋਟ ਕਰਮਚਾਰੀਆਂ", "ਫੀਲਡ ਸਟਾਫ", "ਠੇਕਾ ਕਰਮਚਾਰੀਆਂ"],
    }),
    slotB: Object.freeze({
      "en-IN": ["continuous screen recording", "location tracking", "keystroke logging", "webcam activity monitoring"],
      "hi-IN": ["लगातार स्क्रीन रिकॉर्डिंग", "स्थान ट्रैकिंग", "कीस्ट्रोक लॉगिंग", "वेबकैम गतिविधि निगरानी"],
      "pa-IN": ["ਲਗਾਤਾਰ ਸਕ੍ਰੀਨ ਰਿਕਾਰਡਿੰਗ", "ਸਥਾਨ ਟ੍ਰੈਕਿੰਗ", "ਕੀ-ਸਟ੍ਰੋਕ ਲੌਗਿੰਗ", "ਵੈਬਕੈਮ ਸਰਗਰਮੀ ਨਿਗਰਾਨੀ"],
    }),
    statement: Object.freeze({
      "en-IN": "Should an employer inform {a} before introducing {b}?",
      "hi-IN": "क्या नियोक्ता को {b} शुरू करने से पहले {a} को सूचित करना चाहिए?",
      "pa-IN": "ਕੀ ਨਿਯੋਗਤਾ ਨੂੰ {b} ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ {a} ਨੂੰ ਜਾਣਕਾਰੀ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?",
    }),
    arguments: [
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "Yes. {a} should know what data {b} collects, why it is collected and who can access it.",
        "hi-IN": "हाँ। {a} को पता होना चाहिए कि {b} कौन-सा डेटा एकत्र करता है, क्यों करता है और उसे कौन देख सकता है।",
        "pa-IN": "ਹਾਂ। {a} ਨੂੰ ਪਤਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਕਿ {b} ਕਿਹੜਾ ਡਾਟਾ ਇਕੱਠਾ ਕਰਦਾ ਹੈ, ਕਿਉਂ ਕਰਦਾ ਹੈ ਅਤੇ ਉਸ ਤੱਕ ਕੌਣ ਪਹੁੰਚ ਸਕਦਾ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It identifies a direct privacy and informed-notice interest.", "hi-IN": "यह सीधा गोपनीयता और सूचित-नोटिस हित बताता है।", "pa-IN": "ਇਹ ਸਿੱਧਾ ਪਰਦੇਦਾਰੀ ਅਤੇ ਜਾਣਕਾਰੀ-ਨੋਟਿਸ ਹਿੱਤ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. Any employee who asks about {b} must have something to hide.",
        "hi-IN": "नहीं। जो कर्मचारी {b} के बारे में पूछे, उसके पास जरूर कुछ छिपाने को है।",
        "pa-IN": "ਨਹੀਂ। ਜੋ ਕਰਮਚਾਰੀ {b} ਬਾਰੇ ਪੁੱਛੇ, ਉਸ ਕੋਲ ਜ਼ਰੂਰ ਕੁਝ ਲੁਕਾਉਣ ਲਈ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It stereotypes employees instead of addressing the policy.", "hi-IN": "यह नीति पर विचार करने के बजाय कर्मचारियों को रूढ़िबद्ध करता है।", "pa-IN": "ਇਹ ਨੀਤੀ ਦੀ ਬਜਾਏ ਕਰਮਚਾਰੀਆਂ ਬਾਰੇ ਰੂੜੀਵਾਦੀ ਧਾਰਨਾ ਬਣਾਉਂਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "No. If {b} is excessive for the stated purpose, a less intrusive method should be considered.",
        "hi-IN": "नहीं। यदि बताए गए उद्देश्य के लिए {b} अत्यधिक है, तो कम हस्तक्षेप वाला तरीका विचार करना चाहिए।",
        "pa-IN": "ਨਹੀਂ। ਜੇ ਦੱਸੇ ਉਦੇਸ਼ ਲਈ {b} ਹੱਦ ਤੋਂ ਵੱਧ ਹੈ, ਤਾਂ ਘੱਟ ਦਖ਼ਲ ਵਾਲਾ ਤਰੀਕਾ ਵਿਚਾਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It raises a legitimate proportionality and privacy safeguard.", "hi-IN": "यह वैध अनुपातिकता और गोपनीयता सुरक्षा का मुद्दा उठाता है।", "pa-IN": "ਇਹ ਵਾਜਬ ਅਨੁਪਾਤਿਕਤਾ ਅਤੇ ਪਰਦੇਦਾਰੀ ਸੁਰੱਖਿਆ ਦਾ ਮੁੱਦਾ ਉਠਾਉਂਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "Yes. {b} is modern technology, so using it must always be fair to {a}.",
        "hi-IN": "हाँ। {b} आधुनिक तकनीक है, इसलिए इसका उपयोग {a} के लिए हमेशा न्यायसंगत होगा।",
        "pa-IN": "ਹਾਂ। {b} ਆਧੁਨਿਕ ਤਕਨਾਲੋਜੀ ਹੈ, ਇਸ ਲਈ ਇਸ ਦੀ ਵਰਤੋਂ {a} ਲਈ ਹਮੇਸ਼ਾਂ ਨਿਆਂਯੋਗ ਹੋਵੇਗੀ।",
      }), reason: Object.freeze({
        "en-IN": "Being modern does not establish fairness or necessity.", "hi-IN": "आधुनिक होना न्यायसंगतता या आवश्यकता सिद्ध नहीं करता।", "pa-IN": "ਆਧੁਨਿਕ ਹੋਣਾ ਨਿਆਂਯੋਗਤਾ ਜਾਂ ਲੋੜ ਸਾਬਤ ਨਹੀਂ ਕਰਦਾ।",
      })}),
    ],
  }),
  "ARG-QL-006": Object.freeze({
    qlId: "ARG-QL-006", templateId: "ARG-CP007-QL006-T01", archetype: "CONCISE_ALTERNATIVE_DUE_PROCESS",
    slotA: Object.freeze({
      "en-IN": ["an online marketplace", "an examination authority", "a bank", "a college"],
      "hi-IN": ["एक ऑनलाइन मार्केटप्लेस", "एक परीक्षा प्राधिकरण", "एक बैंक", "एक कॉलेज"],
      "pa-IN": ["ਇੱਕ ਆਨਲਾਈਨ ਮਾਰਕੀਟਪਲੇਸ", "ਇੱਕ ਪ੍ਰੀਖਿਆ ਅਥਾਰਟੀ", "ਇੱਕ ਬੈਂਕ", "ਇੱਕ ਕਾਲਜ"],
    }),
    slotB: Object.freeze({
      "en-IN": ["one buyer complaint", "one cheating complaint", "one automated fraud flag", "one misconduct allegation"],
      "hi-IN": ["एक खरीदार शिकायत", "एक नकल शिकायत", "एक स्वचालित धोखाधड़ी संकेत", "एक कदाचार आरोप"],
      "pa-IN": ["ਇੱਕ ਖਰੀਦਦਾਰ ਸ਼ਿਕਾਇਤ", "ਇੱਕ ਨਕਲ ਦੀ ਸ਼ਿਕਾਇਤ", "ਇੱਕ ਆਟੋਮੈਟਿਕ ਧੋਖਾਧੜੀ ਸੰਕੇਤ", "ਇੱਕ ਗਲਤ ਵਿਹਾਰ ਦਾ ਦੋਸ਼"],
    }),
    statement: Object.freeze({
      "en-IN": "Should {a} impose a permanent penalty immediately after {b}?",
      "hi-IN": "क्या {a} को {b} के तुरंत बाद स्थायी दंड लगा देना चाहिए?",
      "pa-IN": "ਕੀ {a} ਨੂੰ {b} ਤੋਂ ਤੁਰੰਤ ਬਾਅਦ ਸਥਾਈ ਸਜ਼ਾ ਲਗਾ ਦੇਣੀ ਚਾਹੀਦੀ ਹੈ?",
    }),
    arguments: [
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "No. Temporary safeguards and an evidence review can protect users before an irreversible penalty is imposed.",
        "hi-IN": "नहीं। अस्थायी सुरक्षा और साक्ष्य समीक्षा अपरिवर्तनीय दंड से पहले उपयोगकर्ताओं की रक्षा कर सकती है।",
        "pa-IN": "ਨਹੀਂ। ਅਸਥਾਈ ਸੁਰੱਖਿਆ ਅਤੇ ਸਬੂਤ ਸਮੀਖਿਆ ਅਟੱਲ ਸਜ਼ਾ ਤੋਂ ਪਹਿਲਾਂ ਵਰਤੋਂਕਾਰਾਂ ਦੀ ਰੱਖਿਆ ਕਰ ਸਕਦੀ ਹੈ।",
      }), reason: Object.freeze({
        "en-IN": "It offers a credible less-restrictive alternative with due process.", "hi-IN": "यह उचित प्रक्रिया के साथ विश्वसनीय कम-कठोर विकल्प देता है।", "pa-IN": "ਇਹ ਯੋਗ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਭਰੋਸੇਯੋਗ ਘੱਟ-ਕਠੋਰ ਵਿਕਲਪ ਦਿੰਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "Yes. {b} can occur only when guilt is already certain.",
        "hi-IN": "हाँ। {b} तभी हो सकता है जब दोष पहले से निश्चित हो।",
        "pa-IN": "ਹਾਂ। {b} ਸਿਰਫ਼ ਤਦ ਹੀ ਹੋ ਸਕਦਾ ਹੈ ਜਦੋਂ ਦੋਸ਼ ਪਹਿਲਾਂ ਹੀ ਪੱਕਾ ਹੋਵੇ।",
      }), reason: Object.freeze({
        "en-IN": "An allegation or flag is not automatic proof.", "hi-IN": "शिकायत या संकेत अपने-आप प्रमाण नहीं है।", "pa-IN": "ਸ਼ਿਕਾਇਤ ਜਾਂ ਸੰਕੇਤ ਆਪਣੇ ਆਪ ਸਬੂਤ ਨਹੀਂ ਹੁੰਦਾ।",
      })}),
      Object.freeze({ strength: "STRONG", text: Object.freeze({
        "en-IN": "No. A false or mistaken {b} can cause serious harm if the penalty cannot later be reversed.",
        "hi-IN": "नहीं। गलत {b} गंभीर नुकसान कर सकता है यदि दंड बाद में वापस न लिया जा सके।",
        "pa-IN": "ਨਹੀਂ। ਗਲਤ {b} ਗੰਭੀਰ ਨੁਕਸਾਨ ਕਰ ਸਕਦਾ ਹੈ ਜੇ ਸਜ਼ਾ ਬਾਅਦ ਵਿੱਚ ਵਾਪਸ ਨਾ ਲਈ ਜਾ ਸਕੇ।",
      }), reason: Object.freeze({
        "en-IN": "It identifies a credible second-order cost of an irreversible response.", "hi-IN": "यह अपरिवर्तनीय प्रतिक्रिया की विश्वसनीय द्वितीयक लागत बताता है।", "pa-IN": "ਇਹ ਅਟੱਲ ਕਾਰਵਾਈ ਦੀ ਭਰੋਸੇਯੋਗ ਦੂਜੇ ਪੱਧਰ ਦੀ ਲਾਗਤ ਦੱਸਦਾ ਹੈ।",
      })}),
      Object.freeze({ strength: "WEAK", text: Object.freeze({
        "en-IN": "No. If an immediate permanent penalty is rejected, {a} must ignore every future complaint.",
        "hi-IN": "नहीं। यदि तत्काल स्थायी दंड नहीं लगाया जाए, तो {a} को भविष्य की हर शिकायत अनदेखी करनी होगी।",
        "pa-IN": "ਨਹੀਂ। ਜੇ ਤੁਰੰਤ ਸਥਾਈ ਸਜ਼ਾ ਨਾ ਲਗਾਈ ਜਾਵੇ, ਤਾਂ {a} ਨੂੰ ਭਵਿੱਖ ਦੀ ਹਰ ਸ਼ਿਕਾਇਤ ਅਣਡਿੱਠੀ ਕਰਨੀ ਪਵੇਗੀ।",
      }), reason: Object.freeze({
        "en-IN": "It creates a false choice between permanent punishment and doing nothing.", "hi-IN": "यह स्थायी दंड और कुछ न करने के बीच झूठा विकल्प बनाता है।", "pa-IN": "ਇਹ ਸਥਾਈ ਸਜ਼ਾ ਅਤੇ ਕੁਝ ਨਾ ਕਰਨ ਵਿਚਕਾਰ ਝੂਠਾ ਚੋਣ-ਵਿਕਲਪ ਬਣਾਉਂਦਾ ਹੈ।",
      })}),
    ],
  }),
});

const ROMAN = ["I", "II", "III", "IV"] as const;

function positiveModulo(value: number, divisor: number): number {
  const integer = Number.isFinite(value) ? Math.trunc(value) : 0;
  return ((integer % divisor) + divisor) % divisor;
}

function fill(text: string, a: string, b: string) {
  return text.replaceAll("{a}", a).replaceAll("{b}", b);
}

function difficultyValue(value: ArgCp007Difficulty): ArgDifficulty {
  if (value === "Easy") return "EASY";
  if (value === "Medium") return "MEDIUM";
  return "HARD";
}

function normalizeLocale(value: ArgLocale | string): ArgLocale {
  if (value === "hi" || value === "hi-IN") return "hi-IN";
  if (value === "pa" || value === "pb" || value === "pa-IN") return "pa-IN";
  return "en-IN";
}

function localizedInstruction(locale: ArgLocale, count: number) {
  if (locale === "hi-IN") return `कथन पढ़िए और तय कीजिए कि दिए गए ${count} तर्कों में से कौन-से मजबूत हैं।`;
  if (locale === "pa-IN") return `ਕਥਨ ਪੜ੍ਹੋ ਅਤੇ ਨਿਰਧਾਰਤ ਕਰੋ ਕਿ ਦਿੱਤੀਆਂ ${count} ਦਲੀਲਾਂ ਵਿੱਚੋਂ ਕਿਹੜੀਆਂ ਮਜ਼ਬੂਤ ਹਨ।`;
  return `Read the statement and decide which of the ${count} arguments are strong.`;
}

function displayStem(locale: ArgLocale, statement: string, args: readonly string[]) {
  const statementLabel = locale === "hi-IN" ? "कथन" : locale === "pa-IN" ? "ਕਥਨ" : "Statement";
  const argsLabel = locale === "hi-IN" ? "तर्क" : locale === "pa-IN" ? "ਦਲੀਲਾਂ" : "Arguments";
  return `${statementLabel}: ${statement}\n${argsLabel}:\n${args.map((text, index) => `${ROMAN[index]}. ${text}`).join("\n")}`;
}

function subsetKey(indices: readonly number[]) {
  return [...indices].sort((a, b) => a - b).join(",");
}

function localizedSubset(locale: ArgLocale, indices: readonly number[], count: number) {
  const labels = indices.map((index) => ROMAN[index]);
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
  const joined = labels.join(locale === "en-IN" ? " and " : " और ").replaceAll(" और ", locale === "pa-IN" ? " ਅਤੇ " : " और ");
  if (locale === "hi-IN") return `केवल तर्क ${joined} मजबूत ${labels.length === 1 ? "है" : "हैं"}`;
  if (locale === "pa-IN") return `ਕੇਵਲ ਦਲੀਲ ${joined} ਮਜ਼ਬੂਤ ${labels.length === 1 ? "ਹੈ" : "ਹਨ"}`;
  return `Only argument${labels.length === 1 ? "" : "s"} ${joined} ${labels.length === 1 ? "is" : "are"} strong`;
}

function twoArgumentOptions(locale: ArgLocale, fiveOption: boolean) {
  if (!fiveOption) {
    if (locale === "hi-IN") return ["केवल तर्क I मजबूत है", "केवल तर्क II मजबूत है", "दोनों तर्क I और II मजबूत हैं", "न तो तर्क I और न ही II मजबूत है"] as const;
    if (locale === "pa-IN") return ["ਕੇਵਲ ਦਲੀਲ I ਮਜ਼ਬੂਤ ਹੈ", "ਕੇਵਲ ਦਲੀਲ II ਮਜ਼ਬੂਤ ਹੈ", "ਦੋਵੇਂ ਦਲੀਲਾਂ I ਅਤੇ II ਮਜ਼ਬੂਤ ਹਨ", "ਨਾ ਦਲੀਲ I ਅਤੇ ਨਾ ਹੀ II ਮਜ਼ਬੂਤ ਹੈ"] as const;
    return ["Only argument I is strong", "Only argument II is strong", "Both arguments I and II are strong", "Neither argument I nor II is strong"] as const;
  }
  if (locale === "hi-IN") return ["केवल तर्क I मजबूत है", "केवल तर्क II मजबूत है", "या तो तर्क I या II मजबूत है", "न तो तर्क I और न ही II मजबूत है", "दोनों तर्क I और II मजबूत हैं"] as const;
  if (locale === "pa-IN") return ["ਕੇਵਲ ਦਲੀਲ I ਮਜ਼ਬੂਤ ਹੈ", "ਕੇਵਲ ਦਲੀਲ II ਮਜ਼ਬੂਤ ਹੈ", "ਜਾਂ ਦਲੀਲ I ਜਾਂ II ਮਜ਼ਬੂਤ ਹੈ", "ਨਾ ਦਲੀਲ I ਅਤੇ ਨਾ ਹੀ II ਮਜ਼ਬੂਤ ਹੈ", "ਦੋਵੇਂ ਦਲੀਲਾਂ I ਅਤੇ II ਮਜ਼ਬੂਤ ਹਨ"] as const;
  return ["Only argument I is strong", "Only argument II is strong", "Either argument I or II is strong", "Neither argument I nor II is strong", "Both arguments I and II are strong"] as const;
}

function correctIndexForTwo(strengths: readonly ArgStrength[], fiveOption: boolean) {
  const first = strengths[0] === "STRONG";
  const second = strengths[1] === "STRONG";
  if (!fiveOption) {
    if (first && second) return 2;
    if (first) return 0;
    if (second) return 1;
    return 3;
  }
  if (first && second) return 4;
  if (first) return 0;
  if (second) return 1;
  return 3;
}

function combinationOptions(locale: ArgLocale, strengths: readonly ArgStrength[], seed: number) {
  const count = strengths.length;
  const correct = strengths.flatMap((strength, index) => strength === "STRONG" ? [index] : []);
  const correctKey = subsetKey(correct);
  const all = Array.from({ length: 1 << count }, (_, mask) =>
    Array.from({ length: count }, (_, index) => index).filter((index) => Boolean(mask & (1 << index))),
  );
  const distractors = all.filter((indices) => subsetKey(indices) !== correctKey);
  const chosen: number[][] = [correct];
  const offset = positiveModulo(seed * 7 + count * 11, distractors.length);
  for (let step = 0; chosen.length < 5 && step < distractors.length * 2; step += 1) {
    const candidate = distractors[(offset + step * 3) % distractors.length]!;
    if (!chosen.some((entry) => subsetKey(entry) === subsetKey(candidate))) chosen.push(candidate);
  }
  const rotation = positiveModulo(seed, chosen.length);
  const ordered = [...chosen.slice(rotation), ...chosen.slice(0, rotation)];
  const options = ordered.map((indices) => localizedSubset(locale, indices, count));
  const correctIndex = ordered.findIndex((indices) => subsetKey(indices) === correctKey);
  if (correctIndex < 0 || new Set(options).size !== 5) throw new Error("ARG-001 CP007 combination option construction failed");
  return Object.freeze({ options: Object.freeze(options), correctIndex, strongIndices: Object.freeze(correct) });
}

function argumentSelection(profile: ArgCp007ExamProfile, difficulty: ArgCp007Difficulty, seed: number) {
  if (profile === "BANKING_COMBO_4X5") {
    const rotation = positiveModulo(seed, 4);
    return [0, 1, 2, 3].map((index) => (index + rotation) % 4);
  }
  if (profile === "BANKING_COMBO_3X5") {
    const hard = difficulty === "Hard";
    const bases = hard ? [[1, 2, 3], [3, 0, 1]] : [[0, 1, 2], [2, 3, 0]];
    return bases[positiveModulo(seed, bases.length)]!;
  }
  const sameStrength = difficulty === "Medium" && profile === "SSC_RECENT_2X4"
    || difficulty === "Hard" && profile === "BANKING_CLASSIC_2X5";
  const pairs = sameStrength ? [[0, 2], [1, 3]] : [[0, 1], [1, 0], [2, 3], [3, 2]];
  return pairs[positiveModulo(seed, pairs.length)]!;
}

function validateDifficulty(profile: ArgCp007ExamProfile, difficulty: ArgCp007Difficulty) {
  const supported = ARG_CP007_EXAM_PROFILES[profile].supportedDifficulties as readonly string[];
  if (!supported.includes(difficulty)) throw new Error(`${profile} does not support ${difficulty}. Supported: ${supported.join(", ")}`);
}

function renderTemplate(template: MultiArgumentTemplate, locale: ArgLocale, seed: number) {
  const aIndex = positiveModulo(seed, 4);
  const bIndex = positiveModulo(Math.floor(seed / 4) + seed * 3, 4);
  const a = template.slotA[locale][aIndex]!;
  const b = template.slotB[locale][bIndex]!;
  return Object.freeze({
    variantKey: `${aIndex}${bIndex}`,
    statement: fill(template.statement[locale], a, b),
    arguments: template.arguments.map((argument) => Object.freeze({
      strength: argument.strength,
      text: fill(argument.text[locale], a, b),
      reason: fill(argument.reason[locale], a, b),
    })),
  });
}

function fingerprint(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
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
  const selectedIndices = argumentSelection(input.profile, input.difficulty, input.seed);
  const selected = selectedIndices.map((index) => rendered.arguments[index]!);
  const argumentsList = selected.map((argument) => argument.text);
  const strengths = selected.map((argument) => argument.strength);
  const profileMeta = ARG_CP007_EXAM_PROFILES[input.profile];

  let options: readonly string[];
  let correctIndex: number;
  let strongIndices: readonly number[];
  if (profileMeta.argumentCount === 2) {
    const fiveOption = input.profile === "BANKING_CLASSIC_2X5";
    options = twoArgumentOptions(locale, fiveOption);
    correctIndex = correctIndexForTwo(strengths, fiveOption);
    strongIndices = Object.freeze(strengths.flatMap((strength, index) => strength === "STRONG" ? [index] : []));
    if (fiveOption && correctIndex === 2) throw new Error("ARG-001 CP007 banking either-option must remain a distractor");
  } else {
    const combo = combinationOptions(locale, strengths, input.seed);
    options = combo.options;
    correctIndex = combo.correctIndex;
    strongIndices = combo.strongIndices;
  }

  const answer = options[correctIndex]!;
  const explanation = selected.map((argument, index) => {
    const label = ROMAN[index];
    if (locale === "hi-IN") return `तर्क ${label} ${argument.strength === "STRONG" ? "मजबूत" : "कमजोर"} है: ${argument.reason}`;
    if (locale === "pa-IN") return `ਦਲੀਲ ${label} ${argument.strength === "STRONG" ? "ਮਜ਼ਬੂਤ" : "ਕਮਜ਼ੋਰ"} ਹੈ: ${argument.reason}`;
    return `Argument ${label} is ${argument.strength.toLowerCase()}: ${argument.reason}`;
  }).join(" ");
  const stem = displayStem(locale, rendered.statement, argumentsList);
  const questionFingerprint = fingerprint([input.qlId, input.profile, input.difficulty, locale, input.seed, rendered.variantKey, argumentsList, options, correctIndex]);

  return Object.freeze({
    chapterId: "ARG-001" as const,
    checkpointId: ARG_CP007_CHECKPOINT_ID,
    version: "CP007" as const,
    authority: ARG_CP007_AUTHORITY,
    qlId: input.qlId,
    templateId: template.templateId,
    archetype: template.archetype,
    scenarioId: `${template.templateId}-${input.profile}-${rendered.variantKey}`,
    profile: input.profile,
    profileLabel: profileMeta.label,
    locale,
    seed: input.seed,
    difficulty: difficultyValue(input.difficulty),
    difficultyLabel: input.difficulty,
    instruction: localizedInstruction(locale, profileMeta.argumentCount),
    stem,
    statement: rendered.statement,
    arguments: Object.freeze(argumentsList),
    argumentStrengths: Object.freeze(strengths),
    strongArgumentIndices: strongIndices,
    options,
    correctIndex,
    answer,
    explanation,
    contentFingerprint: questionFingerprint,
    metadata: Object.freeze({
      authority: ARG_CP007_AUTHORITY,
      sourceEvidenceBoundary: profileMeta.evidenceBoundary,
      examProfile: input.profile,
      argumentCount: profileMeta.argumentCount,
      optionCount: profileMeta.optionCount,
      conciseExamSurface: true as const,
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

function stableHash(text: string) {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return hash >>> 0;
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
  const batchSeed = String(input.seed ?? "ARG-CP007-DEFAULT");
  const questions = Array.from({ length: count }, (_, index) => {
    const qlId = input.qlId ?? ARG_QL_IDS[index % ARG_QL_IDS.length]!;
    const seed = stableHash(`${ARG_CP007_AUTHORITY}:${batchSeed}:${input.profile}:${input.difficulty}:${qlId}:${index}`) & 0x7fffffff;
    return generateArgCp007ExamProfileQuestion({ qlId, locale: input.locale ?? "en-IN", seed, profile: input.profile, difficulty: input.difficulty });
  });
  return Object.freeze({
    packageId: "ARG-001" as const,
    checkpointId: ARG_CP007_CHECKPOINT_ID,
    authority: ARG_CP007_AUTHORITY,
    profile: input.profile,
    difficulty: input.difficulty,
    questions: Object.freeze(questions),
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
