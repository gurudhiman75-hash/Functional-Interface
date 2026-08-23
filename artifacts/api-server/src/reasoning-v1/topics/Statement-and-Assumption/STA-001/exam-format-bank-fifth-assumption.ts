import type {
  StaCandidateAuthority,
  StaClassification,
  StaDenialEffect,
  StaDependencyRelation,
  StaProposition,
} from "./types.ts";
import type { StaLocalizedLocale } from "./localization-types.ts";

export interface StaBankFifthAssumptionLocalizedCopy {
  readonly textVariants: readonly [string, ...string[]];
  readonly rationale: string;
}

export interface StaBankFifthAssumptionOverlay {
  readonly scenarioId: string;
  readonly proposition: StaProposition;
  readonly candidate: StaCandidateAuthority;
  readonly expectedClassification: StaClassification;
  readonly dependencyRelation?: StaDependencyRelation;
  readonly denialEffect?: StaDenialEffect;
  readonly localized: Readonly<Record<StaLocalizedLocale, StaBankFifthAssumptionLocalizedCopy>>;
}

function proposition(scenarioId: string, semanticKey: string): StaProposition {
  return {
    propositionId: `${scenarioId}-FMT-P5`,
    semanticKey,
    oppositeSemanticKey: `NOT_${semanticKey}`,
    polarity: "POSITIVE",
    entities: [scenarioId],
  };
}

function candidate(
  scenarioId: string,
  textVariants: readonly [string, ...string[]],
  expectedClassification: StaClassification,
  rationale: string,
): StaCandidateAuthority {
  return {
    candidateId: "FMT-C5",
    propositionId: `${scenarioId}-FMT-P5`,
    textVariants,
    expectedClassification,
    ...(expectedClassification === "NOT_IMPLICIT" ? { misconceptionClass: "RELATED_BUT_IRRELEVANT" as const } : {}),
    rationale,
  };
}

const OVERLAYS: readonly StaBankFifthAssumptionOverlay[] = [
  {
    scenarioId: "STA-EN-QL001-ATM-AFTER-HOURS",
    proposition: proposition("STA-EN-QL001-ATM-AFTER-HOURS", "LOBBY_ATM_IS_NEWEST_ATM"),
    candidate: candidate(
      "STA-EN-QL001-ATM-AFTER-HOURS",
      ["The lobby ATM is the branch's newest ATM.", "No older ATM is installed in the lobby."],
      "NOT_IMPLICIT",
      "The instruction depends on after-hours access and ATM availability, not on the machine being the newest one.",
    ),
    expectedClassification: "NOT_IMPLICIT",
    localized: {
      "hi-IN": {
        textVariants: ["लॉबी वाला एटीएम शाखा का सबसे नया एटीएम है।", "लॉबी में लगा एटीएम शाखा के पुराने एटीएमों में से नहीं है।"],
        rationale: "निर्देश के लिए कार्यालय समय के बाद लॉबी और एटीएम उपलब्ध होना जरूरी है; एटीएम का सबसे नया होना जरूरी नहीं है।",
      },
      "pa-IN": {
        textVariants: ["ਲੌਬੀ ਵਾਲਾ ਏਟੀਐਮ ਸ਼ਾਖਾ ਦਾ ਸਭ ਤੋਂ ਨਵਾਂ ਏਟੀਐਮ ਹੈ।", "ਲੌਬੀ ਵਿੱਚ ਲੱਗਿਆ ਏਟੀਐਮ ਸ਼ਾਖਾ ਦੇ ਪੁਰਾਣੇ ਏਟੀਐਮਾਂ ਵਿੱਚੋਂ ਨਹੀਂ ਹੈ।"],
        rationale: "ਹਦਾਇਤ ਲਈ ਦਫ਼ਤਰੀ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ਲੌਬੀ ਅਤੇ ਏਟੀਐਮ ਉਪਲਬਧ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ; ਏਟੀਐਮ ਦਾ ਸਭ ਤੋਂ ਨਵਾਂ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
      },
    },
  },
  {
    scenarioId: "STA-EN-QL001-SHARED-DRIVE",
    proposition: proposition("STA-EN-QL001-SHARED-DRIVE", "FINAL_REPORT_EXISTS_BEFORE_MEETING_UPLOAD"),
    candidate: candidate(
      "STA-EN-QL001-SHARED-DRIVE",
      ["The final report will be available to upload before the meeting.", "A completed report will exist before it has to be uploaded for the meeting."],
      "IMPLICIT",
      "Uploading the final report before the meeting presupposes that a completed report exists and is available by then.",
    ),
    expectedClassification: "IMPLICIT",
    dependencyRelation: "EXISTENCE",
    denialEffect: "BREAKS_FEASIBILITY",
    localized: {
      "hi-IN": {
        textVariants: ["बैठक से पहले अंतिम रिपोर्ट अपलोड करने के लिए उपलब्ध होगी।", "बैठक के लिए अपलोड करने के समय तक अंतिम रिपोर्ट तैयार हो चुकी होगी।"],
        rationale: "बैठक से पहले अंतिम रिपोर्ट अपलोड करने के लिए उसका तब तक तैयार और उपलब्ध होना जरूरी है।",
      },
      "pa-IN": {
        textVariants: ["ਮੀਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਅੰਤਿਮ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰਨ ਲਈ ਉਪਲਬਧ ਹੋਵੇਗੀ।", "ਮੀਟਿੰਗ ਲਈ ਅਪਲੋਡ ਕਰਨ ਦੇ ਸਮੇਂ ਤੱਕ ਅੰਤਿਮ ਰਿਪੋਰਟ ਤਿਆਰ ਹੋ ਚੁੱਕੀ ਹੋਵੇਗੀ।"],
        rationale: "ਮੀਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਅੰਤਿਮ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰਨ ਲਈ ਉਸ ਦਾ ਉਸ ਵੇਲੇ ਤੱਕ ਤਿਆਰ ਅਤੇ ਉਪਲਬਧ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
      },
    },
  },
  {
    scenarioId: "STA-EN-QL002-STAGGERED-BREAKS",
    proposition: proposition("STA-EN-QL002-STAGGERED-BREAKS", "BRANCH_CAN_STAGGER_LUNCH_BREAK_TIMES"),
    candidate: candidate(
      "STA-EN-QL002-STAGGERED-BREAKS",
      ["The branch can schedule employees' lunch breaks at different times.", "Lunch breaks can be staggered rather than being taken by everyone at the same time."],
      "IMPLICIT",
      "The proposal cannot be carried out unless the branch can actually stagger lunch-break timings.",
    ),
    expectedClassification: "IMPLICIT",
    dependencyRelation: "FEASIBILITY",
    denialEffect: "BREAKS_FEASIBILITY",
    localized: {
      "hi-IN": {
        textVariants: ["शाखा कर्मचारियों के भोजन-अवकाश अलग-अलग समय पर तय कर सकती है।", "सभी कर्मचारियों का भोजन-अवकाश एक साथ रखने के बजाय अलग-अलग समय पर रखा जा सकता है।"],
        rationale: "प्रस्ताव लागू करने के लिए शाखा को कर्मचारियों के भोजन-अवकाश अलग-अलग समय पर तय कर सकना चाहिए।",
      },
      "pa-IN": {
        textVariants: ["ਸ਼ਾਖਾ ਕਰਮਚਾਰੀਆਂ ਦੇ ਦੁਪਹਿਰ ਦੇ ਵਿਰਾਮ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਉੱਤੇ ਤੈਅ ਕਰ ਸਕਦੀ ਹੈ।", "ਸਾਰੇ ਕਰਮਚਾਰੀਆਂ ਦਾ ਦੁਪਹਿਰ ਦਾ ਵਿਰਾਮ ਇੱਕੋ ਵੇਲੇ ਰੱਖਣ ਦੀ ਬਜਾਏ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਉੱਤੇ ਰੱਖਿਆ ਜਾ ਸਕਦਾ ਹੈ।"],
        rationale: "ਪ੍ਰਸਤਾਵ ਲਾਗੂ ਕਰਨ ਲਈ ਸ਼ਾਖਾ ਕੋਲ ਕਰਮਚਾਰੀਆਂ ਦੇ ਦੁਪਹਿਰ ਦੇ ਵਿਰਾਮ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਉੱਤੇ ਤੈਅ ਕਰਨ ਦੀ ਸਮਰੱਥਾ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
      },
    },
  },
  {
    scenarioId: "STA-EN-QL002-HANDOFF-CHECKLIST",
    proposition: proposition("STA-EN-QL002-HANDOFF-CHECKLIST", "CHECKLIST_HAS_BRANCH_LOGO"),
    candidate: candidate(
      "STA-EN-QL002-HANDOFF-CHECKLIST",
      ["The handoff checklist carries the branch logo.", "The checklist is printed in the branch's standard design."],
      "NOT_IMPLICIT",
      "The proposal concerns whether the checklist reduces missed handoff steps; its logo or visual design is not required.",
    ),
    expectedClassification: "NOT_IMPLICIT",
    localized: {
      "hi-IN": {
        textVariants: ["हैंडऑफ चेकलिस्ट पर शाखा का लोगो है।", "चेकलिस्ट शाखा के मानक डिजाइन में छपी है।"],
        rationale: "प्रस्ताव इस बात पर निर्भर है कि चेकलिस्ट से हैंडऑफ के जरूरी चरण छूटना कम हो; उसका लोगो या डिजाइन जरूरी नहीं है।",
      },
      "pa-IN": {
        textVariants: ["ਹੈਂਡਆਫ ਚੈਕਲਿਸਟ ਉੱਤੇ ਸ਼ਾਖਾ ਦਾ ਲੋਗੋ ਹੈ।", "ਚੈਕਲਿਸਟ ਸ਼ਾਖਾ ਦੇ ਮਿਆਰੀ ਡਿਜ਼ਾਇਨ ਵਿੱਚ ਛਪੀ ਹੈ।"],
        rationale: "ਪ੍ਰਸਤਾਵ ਇਸ ਗੱਲ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਕਿ ਚੈਕਲਿਸਟ ਨਾਲ ਹੈਂਡਆਫ ਦੇ ਲੋੜੀਂਦੇ ਕਦਮ ਛੁੱਟਣ ਘਟਣ; ਉਸ ਦਾ ਲੋਗੋ ਜਾਂ ਡਿਜ਼ਾਇਨ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
      },
    },
  },
  {
    scenarioId: "STA-EN-QL003-KYC-REMINDER",
    proposition: proposition("STA-EN-QL003-KYC-REMINDER", "KYC_SERVICE_DESKS_AVAILABLE_BEFORE_FRIDAY"),
    candidate: candidate(
      "STA-EN-QL003-KYC-REMINDER",
      ["The relevant service desks will be available before Friday's KYC deadline.", "Customers will have access to a desk that can handle the KYC update before Friday."],
      "IMPLICIT",
      "A reminder directing customers to complete the update before Friday presupposes that the relevant service can be accessed before the deadline.",
    ),
    expectedClassification: "IMPLICIT",
    dependencyRelation: "AVAILABILITY",
    denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE",
    localized: {
      "hi-IN": {
        textVariants: ["शुक्रवार की केवाईसी समय-सीमा से पहले संबंधित सेवा डेस्क उपलब्ध रहेंगे।", "शुक्रवार से पहले ग्राहकों को ऐसा डेस्क मिल सकेगा जहाँ केवाईसी अपडेट किया जा सके।"],
        rationale: "शुक्रवार से पहले केवाईसी अपडेट पूरा करने की सूचना तभी उपयोगी है जब संबंधित सेवा समय-सीमा से पहले उपलब्ध हो।",
      },
      "pa-IN": {
        textVariants: ["ਸ਼ੁੱਕਰਵਾਰ ਦੀ ਕੇਵਾਈਸੀ ਸਮਾਂ-ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਸੰਬੰਧਿਤ ਸੇਵਾ ਡੈਸਕ ਉਪਲਬਧ ਰਹਿਣਗੇ।", "ਸ਼ੁੱਕਰਵਾਰ ਤੋਂ ਪਹਿਲਾਂ ਗਾਹਕਾਂ ਨੂੰ ਅਜਿਹਾ ਡੈਸਕ ਮਿਲ ਸਕੇਗਾ ਜਿੱਥੇ ਕੇਵਾਈਸੀ ਅਪਡੇਟ ਕੀਤਾ ਜਾ ਸਕੇ।"],
        rationale: "ਸ਼ੁੱਕਰਵਾਰ ਤੋਂ ਪਹਿਲਾਂ ਕੇਵਾਈਸੀ ਅਪਡੇਟ ਪੂਰਾ ਕਰਨ ਦੀ ਸੂਚਨਾ ਤਦ ਹੀ ਕਾਰਗਰ ਹੈ ਜਦੋਂ ਸੰਬੰਧਿਤ ਸੇਵਾ ਸਮਾਂ-ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਉਪਲਬਧ ਹੋਵੇ।",
      },
    },
  },
  {
    scenarioId: "STA-EN-QL003-SYSTEM-MAINTENANCE",
    proposition: proposition("STA-EN-QL003-SYSTEM-MAINTENANCE", "ALL_USERS_USE_SAME_DEVICE_OS"),
    candidate: candidate(
      "STA-EN-QL003-SYSTEM-MAINTENANCE",
      ["All users access the system through the same type of device and operating system.", "Every user works on an identical device setup."],
      "NOT_IMPLICIT",
      "The maintenance notice can guide users to save work without requiring every user to have the same device setup.",
    ),
    expectedClassification: "NOT_IMPLICIT",
    localized: {
      "hi-IN": {
        textVariants: ["सभी उपयोगकर्ता एक ही प्रकार के उपकरण और ऑपरेटिंग सिस्टम से सिस्टम चलाते हैं।", "हर उपयोगकर्ता का उपकरण सेटअप बिल्कुल एक जैसा है।"],
        rationale: "रखरखाव की सूचना उपयोगकर्ताओं को काम सहेजने के लिए कह सकती है; इसके लिए सभी का उपकरण सेटअप एक जैसा होना जरूरी नहीं है।",
      },
      "pa-IN": {
        textVariants: ["ਸਾਰੇ ਵਰਤੋਂਕਾਰ ਇੱਕੋ ਕਿਸਮ ਦੇ ਉਪਕਰਣ ਅਤੇ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਨਾਲ ਸਿਸਟਮ ਵਰਤਦੇ ਹਨ।", "ਹਰ ਵਰਤੋਂਕਾਰ ਦਾ ਉਪਕਰਣ ਸੈਟਅਪ ਬਿਲਕੁਲ ਇੱਕੋ ਜਿਹਾ ਹੈ।"],
        rationale: "ਰੱਖ-ਰਖਾਅ ਦੀ ਸੂਚਨਾ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਕੰਮ ਸੰਭਾਲਣ ਲਈ ਕਹਿ ਸਕਦੀ ਹੈ; ਇਸ ਲਈ ਸਭ ਦਾ ਉਪਕਰਣ ਸੈਟਅਪ ਇੱਕੋ ਜਿਹਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
      },
    },
  },
  {
    scenarioId: "STA-EN2-QL004-TOKEN-DISPLAY",
    proposition: proposition("STA-EN2-QL004-TOKEN-DISPLAY", "WAITING_CUSTOMERS_CAN_READ_TOKEN_DISPLAY"),
    candidate: candidate(
      "STA-EN2-QL004-TOKEN-DISPLAY",
      ["Waiting customers can see and understand the token-position display.", "The token display is visible and usable to at least some customers who are waiting."],
      "IMPLICIT",
      "For the display to reduce repeated status questions, at least some waiting customers must be able to use the information it shows.",
    ),
    expectedClassification: "IMPLICIT",
    dependencyRelation: "CAPABILITY",
    denialEffect: "BREAKS_RATIONALE",
    localized: {
      "hi-IN": {
        textVariants: ["प्रतीक्षा कर रहे ग्राहक टोकन-स्थिति वाली स्क्रीन देख और समझ सकते हैं।", "टोकन स्क्रीन कम-से-कम कुछ प्रतीक्षा कर रहे ग्राहकों को साफ दिखाई देती है और वे उसकी जानकारी उपयोग कर सकते हैं।"],
        rationale: "स्क्रीन से बार-बार स्थिति पूछने वाले सवाल तभी घटेंगे जब कम-से-कम कुछ प्रतीक्षा कर रहे ग्राहक उसकी जानकारी देख और उपयोग कर सकें।",
      },
      "pa-IN": {
        textVariants: ["ਉਡੀਕ ਕਰ ਰਹੇ ਗਾਹਕ ਟੋਕਨ ਦੀ ਸਥਿਤੀ ਵਾਲੀ ਸਕਰੀਨ ਵੇਖ ਅਤੇ ਸਮਝ ਸਕਦੇ ਹਨ।", "ਟੋਕਨ ਸਕਰੀਨ ਘੱਟੋ-ਘੱਟ ਕੁਝ ਉਡੀਕ ਕਰ ਰਹੇ ਗਾਹਕਾਂ ਨੂੰ ਸਾਫ਼ ਦਿਖਦੀ ਹੈ ਅਤੇ ਉਹ ਉਸ ਦੀ ਜਾਣਕਾਰੀ ਵਰਤ ਸਕਦੇ ਹਨ।"],
        rationale: "ਸਕਰੀਨ ਨਾਲ ਵਾਰ-ਵਾਰ ਸਥਿਤੀ ਪੁੱਛਣ ਵਾਲੇ ਸਵਾਲ ਤਦ ਹੀ ਘਟਣਗੇ ਜਦੋਂ ਘੱਟੋ-ਘੱਟ ਕੁਝ ਉਡੀਕ ਕਰ ਰਹੇ ਗਾਹਕ ਉਸ ਦੀ ਜਾਣਕਾਰੀ ਵੇਖ ਅਤੇ ਵਰਤ ਸਕਣ।",
      },
    },
  },
  {
    scenarioId: "STA-EN2-QL004-EXPRESS-DEPOSIT-LANE",
    proposition: proposition("STA-EN2-QL004-EXPRESS-DEPOSIT-LANE", "EXPRESS_LANE_IS_NEWEST_BRANCH_FACILITY"),
    candidate: candidate(
      "STA-EN2-QL004-EXPRESS-DEPOSIT-LANE",
      ["The express deposit lane is the branch's newest customer facility.", "No older customer facility at the branch was introduced after the express lane."],
      "NOT_IMPLICIT",
      "The prediction depends on eligible deposits moving through the express lane faster, not on the lane being the newest facility.",
    ),
    expectedClassification: "NOT_IMPLICIT",
    localized: {
      "hi-IN": {
        textVariants: ["एक्सप्रेस जमा लेन शाखा की सबसे नई ग्राहक सुविधा है।", "शाखा में एक्सप्रेस लेन के बाद कोई पुरानी ग्राहक सुविधा शुरू नहीं हुई।"],
        rationale: "दावा इस बात पर निर्भर है कि पात्र जमा एक्सप्रेस लेन से जल्दी निपटें; लेन का सबसे नई सुविधा होना जरूरी नहीं है।",
      },
      "pa-IN": {
        textVariants: ["ਐਕਸਪ੍ਰੈਸ ਜਮ੍ਹਾ ਲੇਨ ਸ਼ਾਖਾ ਦੀ ਸਭ ਤੋਂ ਨਵੀਂ ਗਾਹਕ ਸਹੂਲਤ ਹੈ।", "ਸ਼ਾਖਾ ਵਿੱਚ ਐਕਸਪ੍ਰੈਸ ਲੇਨ ਤੋਂ ਬਾਅਦ ਕੋਈ ਪੁਰਾਣੀ ਗਾਹਕ ਸਹੂਲਤ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋਈ।"],
        rationale: "ਦਾਅਵਾ ਇਸ ਗੱਲ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਕਿ ਯੋਗ ਜਮ੍ਹਾਂ ਐਕਸਪ੍ਰੈਸ ਲੇਨ ਰਾਹੀਂ ਜਲਦੀ ਨਿਪਟਣ; ਲੇਨ ਦਾ ਸਭ ਤੋਂ ਨਵੀਂ ਸਹੂਲਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
      },
    },
  },
];

export const STA_BANK_FIFTH_ASSUMPTION_OVERLAYS: Readonly<Record<string, StaBankFifthAssumptionOverlay>> = Object.fromEntries(
  OVERLAYS.map((overlay) => [overlay.scenarioId, overlay]),
);

export function getStaBankFifthAssumptionOverlay(scenarioId: string): StaBankFifthAssumptionOverlay | undefined {
  return STA_BANK_FIFTH_ASSUMPTION_OVERLAYS[scenarioId];
}
