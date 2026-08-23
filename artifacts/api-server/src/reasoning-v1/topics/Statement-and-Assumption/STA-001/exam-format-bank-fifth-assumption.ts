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

function makeOverlay(args: {
  scenarioId: string;
  semanticKey: string;
  expectedClassification: StaClassification;
  english: string;
  englishRationale: string;
  hindi: string;
  hindiRationale: string;
  punjabi: string;
  punjabiRationale: string;
  dependencyRelation?: StaDependencyRelation;
  denialEffect?: StaDenialEffect;
}): StaBankFifthAssumptionOverlay {
  const propositionId = `${args.scenarioId}-FMT-P5`;
  return {
    scenarioId: args.scenarioId,
    proposition: {
      propositionId,
      semanticKey: args.semanticKey,
      oppositeSemanticKey: `NOT_${args.semanticKey}`,
      polarity: "POSITIVE",
      entities: [args.scenarioId],
    },
    candidate: {
      candidateId: "FMT-C5",
      propositionId,
      textVariants: [args.english],
      expectedClassification: args.expectedClassification,
      ...(args.expectedClassification === "NOT_IMPLICIT" ? { misconceptionClass: "RELATED_BUT_IRRELEVANT" as const } : {}),
      rationale: args.englishRationale,
    },
    expectedClassification: args.expectedClassification,
    ...(args.dependencyRelation ? { dependencyRelation: args.dependencyRelation } : {}),
    ...(args.denialEffect ? { denialEffect: args.denialEffect } : {}),
    localized: {
      "hi-IN": { textVariants: [args.hindi], rationale: args.hindiRationale },
      "pa-IN": { textVariants: [args.punjabi], rationale: args.punjabiRationale },
    },
  };
}

const OVERLAYS: readonly StaBankFifthAssumptionOverlay[] = [
  makeOverlay({
    scenarioId: "STA-EN-QL001-ATM-AFTER-HOURS",
    semanticKey: "LOBBY_ATM_IS_NEWEST_ATM",
    expectedClassification: "NOT_IMPLICIT",
    english: "The lobby ATM is the branch's newest ATM.",
    englishRationale: "The instruction depends on after-hours access and ATM availability, not on the machine being the newest one.",
    hindi: "लॉबी वाला एटीएम शाखा का सबसे नया एटीएम है।",
    hindiRationale: "निर्देश के लिए कार्यालय समय के बाद लॉबी और एटीएम उपलब्ध होना जरूरी है; एटीएम का सबसे नया होना जरूरी नहीं है।",
    punjabi: "ਲੌਬੀ ਵਾਲਾ ਏਟੀਐਮ ਸ਼ਾਖਾ ਦਾ ਸਭ ਤੋਂ ਨਵਾਂ ਏਟੀਐਮ ਹੈ।",
    punjabiRationale: "ਹਦਾਇਤ ਲਈ ਦਫ਼ਤਰੀ ਸਮੇਂ ਤੋਂ ਬਾਅਦ ਲੌਬੀ ਅਤੇ ਏਟੀਐਮ ਉਪਲਬਧ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ; ਏਟੀਐਮ ਦਾ ਸਭ ਤੋਂ ਨਵਾਂ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN-QL001-SHARED-DRIVE",
    semanticKey: "FINAL_REPORT_EXISTS_BEFORE_MEETING_UPLOAD",
    expectedClassification: "IMPLICIT",
    dependencyRelation: "EXISTENCE",
    denialEffect: "BREAKS_FEASIBILITY",
    english: "The final report will be available to upload before the meeting.",
    englishRationale: "Uploading the final report before the meeting presupposes that a completed report exists and is available by then.",
    hindi: "बैठक से पहले अंतिम रिपोर्ट अपलोड करने के लिए उपलब्ध होगी।",
    hindiRationale: "बैठक से पहले अंतिम रिपोर्ट अपलोड करने के लिए उसका तब तक तैयार और उपलब्ध होना जरूरी है।",
    punjabi: "ਮੀਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਅੰਤਿਮ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰਨ ਲਈ ਉਪਲਬਧ ਹੋਵੇਗੀ।",
    punjabiRationale: "ਮੀਟਿੰਗ ਤੋਂ ਪਹਿਲਾਂ ਅੰਤਿਮ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰਨ ਲਈ ਉਸ ਦਾ ਉਸ ਵੇਲੇ ਤੱਕ ਤਿਆਰ ਅਤੇ ਉਪਲਬਧ ਹੋਣਾ ਲਾਜ਼ਮੀ ਹੈ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN-QL002-STAGGERED-BREAKS",
    semanticKey: "BRANCH_CAN_STAGGER_LUNCH_BREAK_TIMES",
    expectedClassification: "IMPLICIT",
    dependencyRelation: "FEASIBILITY",
    denialEffect: "BREAKS_FEASIBILITY",
    english: "The branch can schedule employees' lunch breaks at different times.",
    englishRationale: "The proposal cannot be carried out unless the branch can actually stagger lunch-break timings.",
    hindi: "शाखा कर्मचारियों के भोजन-अवकाश अलग-अलग समय पर तय कर सकती है।",
    hindiRationale: "प्रस्ताव लागू करने के लिए शाखा को कर्मचारियों के भोजन-अवकाश अलग-अलग समय पर तय कर सकना चाहिए।",
    punjabi: "ਸ਼ਾਖਾ ਕਰਮਚਾਰੀਆਂ ਦੇ ਦੁਪਹਿਰ ਦੇ ਵਿਰਾਮ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਉੱਤੇ ਤੈਅ ਕਰ ਸਕਦੀ ਹੈ।",
    punjabiRationale: "ਪ੍ਰਸਤਾਵ ਲਾਗੂ ਕਰਨ ਲਈ ਸ਼ਾਖਾ ਕੋਲ ਕਰਮਚਾਰੀਆਂ ਦੇ ਦੁਪਹਿਰ ਦੇ ਵਿਰਾਮ ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਉੱਤੇ ਤੈਅ ਕਰਨ ਦੀ ਸਮਰੱਥਾ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN-QL002-HANDOFF-CHECKLIST",
    semanticKey: "CHECKLIST_HAS_BRANCH_LOGO",
    expectedClassification: "NOT_IMPLICIT",
    english: "The handoff checklist carries the branch logo.",
    englishRationale: "The proposal concerns whether the checklist reduces missed handoff steps; its logo or visual design is not required.",
    hindi: "हैंडऑफ चेकलिस्ट पर शाखा का लोगो है।",
    hindiRationale: "प्रस्ताव इस बात पर निर्भर है कि चेकलिस्ट से हैंडऑफ के जरूरी चरण छूटना कम हो; उसका लोगो जरूरी नहीं है।",
    punjabi: "ਹੈਂਡਆਫ ਚੈਕਲਿਸਟ ਉੱਤੇ ਸ਼ਾਖਾ ਦਾ ਲੋਗੋ ਹੈ।",
    punjabiRationale: "ਪ੍ਰਸਤਾਵ ਇਸ ਗੱਲ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਕਿ ਚੈਕਲਿਸਟ ਨਾਲ ਹੈਂਡਆਫ ਦੇ ਲੋੜੀਂਦੇ ਕਦਮ ਛੁੱਟਣ ਘਟਣ; ਉਸ ਦਾ ਲੋਗੋ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN-QL003-KYC-REMINDER",
    semanticKey: "KYC_SERVICE_DESKS_AVAILABLE_BEFORE_FRIDAY",
    expectedClassification: "IMPLICIT",
    dependencyRelation: "AVAILABILITY",
    denialEffect: "BREAKS_COMMUNICATIVE_PURPOSE",
    english: "The relevant service desks will be available before Friday's KYC deadline.",
    englishRationale: "A reminder directing customers to complete the update before Friday presupposes that the relevant service can be accessed before the deadline.",
    hindi: "शुक्रवार की केवाईसी समय-सीमा से पहले संबंधित सेवा डेस्क उपलब्ध रहेंगे।",
    hindiRationale: "शुक्रवार से पहले केवाईसी अपडेट पूरा करने की सूचना तभी उपयोगी है जब संबंधित सेवा समय-सीमा से पहले उपलब्ध हो।",
    punjabi: "ਸ਼ੁੱਕਰਵਾਰ ਦੀ ਕੇਵਾਈਸੀ ਸਮਾਂ-ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਸੰਬੰਧਿਤ ਸੇਵਾ ਡੈਸਕ ਉਪਲਬਧ ਰਹਿਣਗੇ।",
    punjabiRationale: "ਸ਼ੁੱਕਰਵਾਰ ਤੋਂ ਪਹਿਲਾਂ ਕੇਵਾਈਸੀ ਅਪਡੇਟ ਪੂਰਾ ਕਰਨ ਦੀ ਸੂਚਨਾ ਤਦ ਹੀ ਕਾਰਗਰ ਹੈ ਜਦੋਂ ਸੰਬੰਧਿਤ ਸੇਵਾ ਸਮਾਂ-ਸੀਮਾ ਤੋਂ ਪਹਿਲਾਂ ਉਪਲਬਧ ਹੋਵੇ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN-QL003-SYSTEM-MAINTENANCE",
    semanticKey: "ALL_USERS_USE_SAME_DEVICE_OS",
    expectedClassification: "NOT_IMPLICIT",
    english: "All users access the system through the same type of device and operating system.",
    englishRationale: "The maintenance notice can guide users to save work without requiring every user to have the same device setup.",
    hindi: "सभी उपयोगकर्ता एक ही प्रकार के उपकरण और ऑपरेटिंग सिस्टम से सिस्टम चलाते हैं।",
    hindiRationale: "रखरखाव की सूचना उपयोगकर्ताओं को काम सहेजने के लिए कह सकती है; इसके लिए सभी का उपकरण सेटअप एक जैसा होना जरूरी नहीं है।",
    punjabi: "ਸਾਰੇ ਵਰਤੋਂਕਾਰ ਇੱਕੋ ਕਿਸਮ ਦੇ ਉਪਕਰਣ ਅਤੇ ਓਪਰੇਟਿੰਗ ਸਿਸਟਮ ਨਾਲ ਸਿਸਟਮ ਵਰਤਦੇ ਹਨ।",
    punjabiRationale: "ਰੱਖ-ਰਖਾਅ ਦੀ ਸੂਚਨਾ ਵਰਤੋਂਕਾਰਾਂ ਨੂੰ ਕੰਮ ਸੰਭਾਲਣ ਲਈ ਕਹਿ ਸਕਦੀ ਹੈ; ਇਸ ਲਈ ਸਭ ਦਾ ਉਪਕਰਣ ਸੈਟਅਪ ਇੱਕੋ ਜਿਹਾ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN-QL004-TOKEN-DISPLAY",
    semanticKey: "WAITING_CUSTOMERS_CAN_READ_TOKEN_DISPLAY",
    expectedClassification: "IMPLICIT",
    dependencyRelation: "CAPABILITY",
    denialEffect: "BREAKS_RATIONALE",
    english: "Waiting customers can see and understand the token-position display.",
    englishRationale: "For the display to reduce clustering near the counter, at least some waiting customers must be able to use the queue-position information it shows.",
    hindi: "प्रतीक्षा कर रहे ग्राहक टोकन-स्थिति वाली स्क्रीन देख और समझ सकते हैं।",
    hindiRationale: "स्क्रीन से काउंटर के पास भीड़ तभी घटेगी जब कम-से-कम कुछ प्रतीक्षा कर रहे ग्राहक उसकी कतार-संबंधी जानकारी देख और उपयोग कर सकें।",
    punjabi: "ਉਡੀਕ ਕਰ ਰਹੇ ਗਾਹਕ ਟੋਕਨ ਦੀ ਸਥਿਤੀ ਵਾਲੀ ਸਕਰੀਨ ਵੇਖ ਅਤੇ ਸਮਝ ਸਕਦੇ ਹਨ।",
    punjabiRationale: "ਸਕਰੀਨ ਨਾਲ ਕਾਊਂਟਰ ਕੋਲ ਭੀੜ ਤਦ ਹੀ ਘਟੇਗੀ ਜਦੋਂ ਘੱਟੋ-ਘੱਟ ਕੁਝ ਉਡੀਕ ਕਰ ਰਹੇ ਗਾਹਕ ਉਸ ਦੀ ਕਤਾਰ ਸੰਬੰਧੀ ਜਾਣਕਾਰੀ ਵੇਖ ਅਤੇ ਵਰਤ ਸਕਣ।",
  }),
  makeOverlay({
    scenarioId: "STA-EN2-QL004-EXPRESS-DEPOSIT-LANE",
    semanticKey: "EXPRESS_LANE_IS_NEWEST_BRANCH_FACILITY",
    expectedClassification: "NOT_IMPLICIT",
    english: "The express deposit lane is the branch's newest customer facility.",
    englishRationale: "The prediction depends on eligible deposits moving through the express lane faster, not on the lane being the newest facility.",
    hindi: "एक्सप्रेस जमा लेन शाखा की सबसे नई ग्राहक सुविधा है।",
    hindiRationale: "दावा इस बात पर निर्भर है कि पात्र जमा एक्सप्रेस लेन से जल्दी निपटें; लेन का सबसे नई सुविधा होना जरूरी नहीं है।",
    punjabi: "ਐਕਸਪ੍ਰੈਸ ਜਮ੍ਹਾ ਲੇਨ ਸ਼ਾਖਾ ਦੀ ਸਭ ਤੋਂ ਨਵੀਂ ਗਾਹਕ ਸਹੂਲਤ ਹੈ।",
    punjabiRationale: "ਦਾਅਵਾ ਇਸ ਗੱਲ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ ਕਿ ਯੋਗ ਜਮ੍ਹਾਂ ਐਕਸਪ੍ਰੈਸ ਲੇਨ ਰਾਹੀਂ ਜਲਦੀ ਨਿਪਟਣ; ਲੇਨ ਦਾ ਸਭ ਤੋਂ ਨਵੀਂ ਸਹੂਲਤ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਹੈ।",
  }),
];

export const STA_BANK_FIFTH_ASSUMPTION_OVERLAYS: Readonly<Record<string, StaBankFifthAssumptionOverlay>> = Object.fromEntries(
  OVERLAYS.map((overlay) => [overlay.scenarioId, overlay]),
);

export function getStaBankFifthAssumptionOverlay(scenarioId: string): StaBankFifthAssumptionOverlay | undefined {
  return STA_BANK_FIFTH_ASSUMPTION_OVERLAYS[scenarioId];
}
