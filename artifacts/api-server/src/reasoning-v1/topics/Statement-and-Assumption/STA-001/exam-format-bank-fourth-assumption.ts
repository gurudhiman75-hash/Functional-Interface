import type { StaLocalizedLocale } from "./localization-types.ts";
import type { StaCandidateAuthority, StaMisconceptionClass, StaProposition } from "./types.ts";

interface StaLocalizedPresentationCandidate {
  readonly textVariants: readonly [string, ...string[]];
  readonly rationale: string;
}

export interface StaBankFourthAssumptionOverlay {
  readonly scenarioId: string;
  readonly proposition: StaProposition;
  readonly candidate: StaCandidateAuthority;
  readonly localized: Readonly<Record<StaLocalizedLocale, StaLocalizedPresentationCandidate>>;
}

function overlay(
  scenarioId: string,
  semanticKey: string,
  oppositeSemanticKey: string,
  entities: readonly string[],
  misconceptionClass: StaMisconceptionClass,
  englishText: readonly [string, ...string[]],
  englishRationale: string,
  hindiText: readonly [string, ...string[]],
  hindiRationale: string,
  punjabiText: readonly [string, ...string[]],
  punjabiRationale: string,
): StaBankFourthAssumptionOverlay {
  return {
    scenarioId,
    proposition: {
      propositionId: "FMT-P4",
      semanticKey,
      oppositeSemanticKey,
      polarity: "POSITIVE",
      entities,
    },
    candidate: {
      candidateId: "FMT-C4",
      propositionId: "FMT-P4",
      textVariants: englishText,
      expectedClassification: "NOT_IMPLICIT",
      misconceptionClass,
      rationale: englishRationale,
    },
    localized: {
      "hi-IN": { textVariants: hindiText, rationale: hindiRationale },
      "pa-IN": { textVariants: punjabiText, rationale: punjabiRationale },
    },
  };
}

/**
 * RBI Grade B source review establishes a genuine four-assumption/five-option
 * presentation surface. These overlays add one same-scenario distractor only at
 * presentation time; they do not mutate the frozen 64-authority English corpus.
 * Every proposition is absent from hiddenDependencies, so the independent STA
 * oracle must classify it NOT_IMPLICIT / NO_REQUIRED_DEPENDENCY.
 */
export const STA_BANK_FOURTH_ASSUMPTION_OVERLAYS = [
  overlay(
    "STA-EN-QL001-ATM-AFTER-HOURS",
    "ALL_AFTER_HOURS_CUSTOMERS_PREFER_ATM",
    "NOT_ALL_AFTER_HOURS_CUSTOMERS_PREFER_ATM",
    ["customers", "ATM", "after hours"],
    "TOO_STRONG_QUANTIFIER",
    ["Every customer prefers using the ATM after counter hours.", "All customers prefer an ATM withdrawal once the cash counter closes."],
    "The instruction only requires the ATM to be available and able to dispense cash; universal customer preference for the ATM is unnecessary.",
    ["काउंटर बंद होने के बाद हर ग्राहक ATM का उपयोग करना पसंद करता है।", "कैश काउंटर बंद होने पर सभी ग्राहक ATM से नकद निकालना पसंद करते हैं।"],
    "निर्देश के लिए यह जरूरी नहीं कि हर ग्राहक ATM को पसंद करे; जरूरी केवल यह है कि काउंटर बंद होने के बाद ATM उपलब्ध हो और नकद निकाल सके।",
    ["ਕਾਊਂਟਰ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ ਹਰ ਗਾਹਕ ATM ਵਰਤਣਾ ਪਸੰਦ ਕਰਦਾ ਹੈ।", "ਕੈਸ਼ ਕਾਊਂਟਰ ਬੰਦ ਹੋਣ ਉੱਤੇ ਸਾਰੇ ਗਾਹਕ ATM ਤੋਂ ਨਕਦ ਕੱਢਣਾ ਪਸੰਦ ਕਰਦੇ ਹਨ।"],
    "ਹਦਾਇਤ ਲਈ ਹਰ ਗਾਹਕ ਦਾ ATM ਨੂੰ ਪਸੰਦ ਕਰਨਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਸਿਰਫ਼ ਇਹ ਹੈ ਕਿ ਕਾਊਂਟਰ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ ATM ਉਪਲਬਧ ਹੋਵੇ ਅਤੇ ਨਕਦ ਦੇ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL001-SHARED-DRIVE",
    "ALL_TEAM_MEMBERS_CAN_ACCESS_SHARED_DRIVE",
    "NOT_ALL_TEAM_MEMBERS_CAN_ACCESS_SHARED_DRIVE",
    ["team members", "shared drive"],
    "TOO_STRONG_QUANTIFIER",
    ["Every team member can access the shared drive.", "All members of the team have access to the shared drive."],
    "The upload instruction requires access for the employee who must place the report there; it does not require every team member to have access.",
    ["टीम का हर सदस्य साझा ड्राइव तक पहुँच सकता है।", "टीम के सभी सदस्यों को साझा ड्राइव की पहुँच है।"],
    "रिपोर्ट अपलोड करने वाले कर्मचारी को साझा ड्राइव की पहुँच होना जरूरी है; टीम के हर सदस्य को पहुँच होना जरूरी नहीं है।",
    ["ਟੀਮ ਦਾ ਹਰ ਮੈਂਬਰ ਸਾਂਝੀ ਡਰਾਈਵ ਤੱਕ ਪਹੁੰਚ ਸਕਦਾ ਹੈ।", "ਟੀਮ ਦੇ ਸਾਰੇ ਮੈਂਬਰਾਂ ਕੋਲ ਸਾਂਝੀ ਡਰਾਈਵ ਦੀ ਪਹੁੰਚ ਹੈ।"],
    "ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰਨ ਵਾਲੇ ਕਰਮਚਾਰੀ ਕੋਲ ਸਾਂਝੀ ਡਰਾਈਵ ਦੀ ਪਹੁੰਚ ਹੋਣੀ ਲਾਜ਼ਮੀ ਹੈ; ਟੀਮ ਦੇ ਹਰ ਮੈਂਬਰ ਕੋਲ ਪਹੁੰਚ ਹੋਣੀ ਲਾਜ਼ਮੀ ਨਹੀਂ।",
  ),
  overlay(
    "STA-EN-QL002-STAGGERED-BREAKS",
    "STAGGERED_BREAKS_ARE_BEST_STAFFING_POLICY",
    "STAGGERED_BREAKS_ARE_NOT_BEST_STAFFING_POLICY",
    ["staggered breaks", "staffing policy"],
    "VALUE_JUDGEMENT_NOT_REQUIRED",
    ["Staggering lunch breaks is the best possible staffing policy.", "No other staffing arrangement is better than staggered lunch breaks."],
    "The decision only requires staggered breaks to help maintain noon counter capacity; it need not be the best possible staffing policy.",
    ["लंच ब्रेक को अलग-अलग समय पर देना सबसे अच्छी स्टाफिंग नीति है।", "स्टाफिंग की कोई दूसरी व्यवस्था अलग-अलग समय के लंच ब्रेक से बेहतर नहीं है।"],
    "निर्णय के लिए यह जरूरी है कि अलग-अलग समय पर ब्रेक देने से दोपहर में पर्याप्त काउंटर चालू रह सकें; इसे सबसे अच्छी संभव नीति मानना जरूरी नहीं है।",
    ["ਲੰਚ ਬ੍ਰੇਕ ਵੱਖ-ਵੱਖ ਸਮੇਂ ਦੇਣਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਟਾਫਿੰਗ ਨੀਤੀ ਹੈ।", "ਸਟਾਫਿੰਗ ਦੀ ਕੋਈ ਹੋਰ ਵਿਵਸਥਾ ਵੱਖ-ਵੱਖ ਸਮੇਂ ਦੇ ਲੰਚ ਬ੍ਰੇਕ ਨਾਲੋਂ ਵਧੀਆ ਨਹੀਂ ਹੈ।"],
    "ਫੈਸਲੇ ਲਈ ਇਹ ਲੋੜੀਂਦਾ ਹੈ ਕਿ ਵੱਖ-ਵੱਖ ਸਮੇਂ ਬ੍ਰੇਕ ਦੇਣ ਨਾਲ ਦੁਪਹਿਰ ਵੇਲੇ ਕਾਫ਼ੀ ਕਾਊਂਟਰ ਚੱਲ ਸਕਣ; ਇਸ ਨੂੰ ਸਭ ਤੋਂ ਵਧੀਆ ਸੰਭਵ ਨੀਤੀ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ।",
  ),
  overlay(
    "STA-EN-QL002-HANDOFF-CHECKLIST",
    "HANDOFF_CHECKLIST_WILL_BE_PRINTED_ON_PAPER",
    "HANDOFF_CHECKLIST_WILL_NOT_BE_PRINTED_ON_PAPER",
    ["handoff checklist", "paper"],
    "RELATED_BUT_IRRELEVANT",
    ["The handoff checklist will be printed on paper.", "The proposed checklist will be used as a paper form."],
    "The proposal requires a checklist capable of reducing missed handoffs; it does not require the checklist to be printed rather than digital.",
    ["हैंडऑफ चेकलिस्ट कागज पर छापी जाएगी।", "प्रस्तावित चेकलिस्ट का उपयोग कागजी फॉर्म के रूप में किया जाएगा।"],
    "प्रस्ताव के लिए चेकलिस्ट का कागज पर होना जरूरी नहीं है; जरूरी यह है कि उसका उपयोग शिफ्ट बदलते समय छूटने वाले काम कम कर सके।",
    ["ਹੈਂਡਆਫ ਚੈਕਲਿਸਟ ਕਾਗਜ਼ ਉੱਤੇ ਛਾਪੀ ਜਾਵੇਗੀ।", "ਪ੍ਰਸਤਾਵਿਤ ਚੈਕਲਿਸਟ ਕਾਗਜ਼ੀ ਫਾਰਮ ਵਜੋਂ ਵਰਤੀ ਜਾਵੇਗੀ।"],
    "ਪ੍ਰਸਤਾਵ ਲਈ ਚੈਕਲਿਸਟ ਦਾ ਕਾਗਜ਼ ਉੱਤੇ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਇਸ ਦੀ ਵਰਤੋਂ ਸ਼ਿਫਟ ਬਦਲਣ ਵੇਲੇ ਛੁੱਟਣ ਵਾਲੇ ਕੰਮ ਘਟਾ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL003-KYC-REMINDER",
    "EVERY_DUE_CUSTOMER_WILL_UPDATE_KYC_BY_FRIDAY",
    "NOT_EVERY_DUE_CUSTOMER_WILL_UPDATE_KYC_BY_FRIDAY",
    ["due customers", "KYC", "Friday"],
    "TOO_STRONG_QUANTIFIER",
    ["Every customer whose KYC is due will complete the update by Friday.", "All due customers will act on the reminder before Friday."],
    "A reminder can be meaningful without assuming universal compliance; it only needs a relevant audience and a service desk capable of completing the update.",
    ["जिन ग्राहकों का KYC अपडेट बाकी है, वे सभी शुक्रवार तक उसे पूरा कर देंगे।", "सभी संबंधित ग्राहक शुक्रवार से पहले रिमाइंडर पर कार्रवाई करेंगे।"],
    "रिमाइंडर के लिए यह मानना जरूरी नहीं कि हर संबंधित ग्राहक कार्रवाई करेगा; जरूरी यह है कि संबंधित ग्राहक हों और सेवा डेस्क KYC अपडेट कर सके।",
    ["ਜਿਨ੍ਹਾਂ ਗਾਹਕਾਂ ਦਾ KYC ਅਪਡੇਟ ਬਾਕੀ ਹੈ, ਉਹ ਸਾਰੇ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਇਸ ਨੂੰ ਪੂਰਾ ਕਰ ਦੇਣਗੇ।", "ਸਾਰੇ ਸੰਬੰਧਿਤ ਗਾਹਕ ਸ਼ੁੱਕਰਵਾਰ ਤੋਂ ਪਹਿਲਾਂ ਯਾਦ ਦਿਹਾਨੀ ਉੱਤੇ ਕਾਰਵਾਈ ਕਰਨਗੇ।"],
    "ਯਾਦ ਦਿਹਾਨੀ ਲਈ ਇਹ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਿ ਹਰ ਸੰਬੰਧਿਤ ਗਾਹਕ ਕਾਰਵਾਈ ਕਰੇਗਾ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਸੰਬੰਧਿਤ ਗਾਹਕ ਹੋਣ ਅਤੇ ਸੇਵਾ ਡੈਸਕ KYC ਅਪਡੇਟ ਕਰ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL003-SYSTEM-MAINTENANCE",
    "MAINTENANCE_WILL_REMOVE_ALL_APPLICATION_PROBLEMS",
    "MAINTENANCE_WILL_NOT_REMOVE_ALL_APPLICATION_PROBLEMS",
    ["maintenance", "application problems"],
    "CAUSE_EFFECT_OVERREACH",
    ["The scheduled maintenance will remove every problem in the shared application.", "No application problem will remain after the maintenance window."],
    "The notice is about saving work before an outage; it does not require maintenance to eliminate every possible application problem.",
    ["निर्धारित मेंटेनेंस साझा एप्लिकेशन की हर समस्या दूर कर देगा।", "मेंटेनेंस के बाद एप्लिकेशन में कोई समस्या नहीं बचेगी।"],
    "सूचना का उद्देश्य मेंटेनेंस से पहले काम सेव कराना है; इसके लिए यह मानना जरूरी नहीं कि मेंटेनेंस एप्लिकेशन की हर समस्या खत्म कर देगा।",
    ["ਨਿਰਧਾਰਤ ਮੈਂਟੇਨੈਂਸ ਸਾਂਝੀ ਐਪਲੀਕੇਸ਼ਨ ਦੀ ਹਰ ਸਮੱਸਿਆ ਦੂਰ ਕਰ ਦੇਵੇਗਾ।", "ਮੈਂਟੇਨੈਂਸ ਤੋਂ ਬਾਅਦ ਐਪਲੀਕੇਸ਼ਨ ਵਿੱਚ ਕੋਈ ਸਮੱਸਿਆ ਨਹੀਂ ਰਹੇਗੀ।"],
    "ਸੂਚਨਾ ਦਾ ਮਕਸਦ ਮੈਂਟੇਨੈਂਸ ਤੋਂ ਪਹਿਲਾਂ ਕੰਮ ਸੇਵ ਕਰਵਾਉਣਾ ਹੈ; ਇਸ ਲਈ ਇਹ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ ਕਿ ਮੈਂਟੇਨੈਂਸ ਐਪਲੀਕੇਸ਼ਨ ਦੀ ਹਰ ਸਮੱਸਿਆ ਖਤਮ ਕਰ ਦੇਵੇਗਾ।",
  ),
  overlay(
    "STA-EN-QL004-TOKEN-DISPLAY",
    "TOKEN_DISPLAY_SCREEN_IS_NEWLY_INSTALLED",
    "TOKEN_DISPLAY_SCREEN_IS_NOT_NEWLY_INSTALLED",
    ["token display", "screen"],
    "RELATED_BUT_IRRELEVANT",
    ["The token-position screen was newly installed this month.", "The large token display is a newly installed screen."],
    "The expected reduction in clustering depends on customers being able to use queue-position information, not on how recently the display was installed.",
    ["टोकन की स्थिति दिखाने वाली स्क्रीन इसी महीने नई लगाई गई है।", "बड़ी टोकन डिस्प्ले स्क्रीन हाल ही में लगाई गई है।"],
    "भीड़ कम होने का दावा स्क्रीन के नया होने पर निर्भर नहीं करता; जरूरी यह है कि टोकन की स्थिति दिखने से ग्राहक काउंटर के पास खड़े रहने की जरूरत कम महसूस करें।",
    ["ਟੋਕਨ ਦੀ ਸਥਿਤੀ ਦਿਖਾਉਣ ਵਾਲੀ ਸਕਰੀਨ ਇਸੇ ਮਹੀਨੇ ਨਵੀਂ ਲਗਾਈ ਗਈ ਹੈ।", "ਵੱਡੀ ਟੋਕਨ ਡਿਸਪਲੇ ਸਕਰੀਨ ਹਾਲ ਹੀ ਵਿੱਚ ਲਗਾਈ ਗਈ ਹੈ।"],
    "ਭੀੜ ਘਟਣ ਦਾ ਦਾਅਵਾ ਸਕਰੀਨ ਦੇ ਨਵਾਂ ਹੋਣ ਉੱਤੇ ਨਿਰਭਰ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਟੋਕਨ ਦੀ ਸਥਿਤੀ ਦਿਖਣ ਨਾਲ ਗਾਹਕ ਕਾਊਂਟਰ ਕੋਲ ਖੜ੍ਹੇ ਰਹਿਣ ਦੀ ਲੋੜ ਘੱਟ ਮਹਿਸੂਸ ਕਰਨ।",
  ),
  overlay(
    "STA-EN2-QL004-EXPRESS-DEPOSIT-LANE",
    "EXPRESS_LANE_IS_BEST_QUEUE_MANAGEMENT_METHOD",
    "EXPRESS_LANE_IS_NOT_BEST_QUEUE_MANAGEMENT_METHOD",
    ["express lane", "queue management"],
    "VALUE_JUDGEMENT_NOT_REQUIRED",
    ["A separate express lane is the best possible way to manage branch queues.", "No other queue-management method is better than the express lane."],
    "The claim only requires the express lane to divert relevant simple-deposit load; it does not require the lane to be the best possible queue-management method.",
    ["अलग एक्सप्रेस लेन शाखा की कतारें संभालने का सबसे अच्छा तरीका है।", "कतार प्रबंधन का कोई दूसरा तरीका एक्सप्रेस लेन से बेहतर नहीं है।"],
    "दावे के लिए यह जरूरी है कि एक्सप्रेस लेन साधारण जमा का कुछ भार नियमित काउंटर से हटा सके; इसे कतार प्रबंधन का सबसे अच्छा तरीका मानना जरूरी नहीं है।",
    ["ਵੱਖਰੀ ਐਕਸਪ੍ਰੈੱਸ ਲੇਨ ਸ਼ਾਖਾ ਦੀਆਂ ਕਤਾਰਾਂ ਸੰਭਾਲਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ ਹੈ।", "ਕਤਾਰ ਪ੍ਰਬੰਧਨ ਦਾ ਕੋਈ ਹੋਰ ਤਰੀਕਾ ਐਕਸਪ੍ਰੈੱਸ ਲੇਨ ਨਾਲੋਂ ਵਧੀਆ ਨਹੀਂ ਹੈ।"],
    "ਦਾਅਵੇ ਲਈ ਇਹ ਲੋੜੀਂਦਾ ਹੈ ਕਿ ਐਕਸਪ੍ਰੈੱਸ ਲੇਨ ਸਧਾਰਣ ਜਮ੍ਹਾਂ ਦਾ ਕੁਝ ਭਾਰ ਨਿਯਮਤ ਕਾਊਂਟਰ ਤੋਂ ਹਟਾ ਸਕੇ; ਇਸ ਨੂੰ ਕਤਾਰ ਪ੍ਰਬੰਧਨ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਤਰੀਕਾ ਮੰਨਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ।",
  ),
] as const satisfies readonly StaBankFourthAssumptionOverlay[];

const OVERLAY_BY_SCENARIO = new Map(STA_BANK_FOURTH_ASSUMPTION_OVERLAYS.map((item) => [item.scenarioId, item] as const));

export function getStaBankFourthAssumptionOverlay(scenarioId: string): StaBankFourthAssumptionOverlay | undefined {
  return OVERLAY_BY_SCENARIO.get(scenarioId);
}
