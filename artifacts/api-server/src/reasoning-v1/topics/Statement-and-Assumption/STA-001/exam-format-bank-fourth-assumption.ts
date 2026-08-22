import type { StaLocalizedLocale } from "./localization-types.ts";
import type { StaCandidateAuthority, StaProposition } from "./types.ts";

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
      misconceptionClass: "RELATED_BUT_IRRELEVANT",
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
 * presentation surface. These overlays add a fourth same-scenario distractor
 * only at presentation time; they do not mutate the frozen 64-authority English
 * corpus. Each proposition is deliberately absent from hiddenDependencies, so
 * the independent STA oracle must classify it NOT_IMPLICIT/NO_REQUIRED_DEPENDENCY.
 */
export const STA_BANK_FOURTH_ASSUMPTION_OVERLAYS = [
  overlay(
    "STA-EN-QL001-ATM-AFTER-HOURS",
    "LOBBY_ATM_IS_ON_GROUND_FLOOR",
    "LOBBY_ATM_IS_NOT_ON_GROUND_FLOOR",
    ["lobby ATM", "ground floor"],
    ["The lobby ATM is located on the ground floor.", "The ATM mentioned in the instruction is on the ground floor."],
    "The floor on which the ATM is located is not required for the after-hours withdrawal instruction; only its availability and ability to dispense cash matter.",
    ["लॉबी का ATM भूतल पर स्थित है।", "निर्देश में बताया गया ATM भूतल पर है।"],
    "ATM किस मंजिल पर है, यह निर्देश के लिए जरूरी नहीं है; जरूरी यह है कि वह काउंटर बंद होने के बाद उपलब्ध हो और नकद निकाल सके।",
    ["ਲੌਬੀ ਵਾਲਾ ATM ਜ਼ਮੀਨੀ ਮੰਜ਼ਿਲ ਉੱਤੇ ਹੈ।", "ਹਦਾਇਤ ਵਿੱਚ ਦੱਸਿਆ ATM ਜ਼ਮੀਨੀ ਮੰਜ਼ਿਲ ਉੱਤੇ ਸਥਿਤ ਹੈ।"],
    "ATM ਕਿਹੜੀ ਮੰਜ਼ਿਲ ਉੱਤੇ ਹੈ, ਇਹ ਹਦਾਇਤ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਕਾਊਂਟਰ ਬੰਦ ਹੋਣ ਤੋਂ ਬਾਅਦ ATM ਉਪਲਬਧ ਹੋਵੇ ਅਤੇ ਨਕਦ ਦੇ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL001-SHARED-DRIVE",
    "SHARED_DRIVE_WAS_CREATED_THIS_YEAR",
    "SHARED_DRIVE_WAS_NOT_CREATED_THIS_YEAR",
    ["shared drive", "year"],
    ["The team shared drive was created this year.", "The shared drive mentioned in the instruction is newly created this year."],
    "The age of the shared drive is irrelevant to whether the employee can access it and upload the report before the meeting.",
    ["टीम का साझा ड्राइव इसी वर्ष बनाया गया है।", "निर्देश में बताया गया साझा ड्राइव इस वर्ष नया बनाया गया है।"],
    "साझा ड्राइव कितना नया है, इससे निर्देश की व्यवहार्यता तय नहीं होती; जरूरी यह है कि कर्मचारी उस तक पहुँचकर रिपोर्ट अपलोड कर सके।",
    ["ਟੀਮ ਦੀ ਸਾਂਝੀ ਡਰਾਈਵ ਇਸੇ ਸਾਲ ਬਣਾਈ ਗਈ ਹੈ।", "ਹਦਾਇਤ ਵਿੱਚ ਦੱਸੀ ਸਾਂਝੀ ਡਰਾਈਵ ਇਸ ਸਾਲ ਨਵੀਂ ਬਣਾਈ ਗਈ ਹੈ।"],
    "ਸਾਂਝੀ ਡਰਾਈਵ ਕਿੰਨੀ ਨਵੀਂ ਹੈ, ਇਸ ਨਾਲ ਹਦਾਇਤ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਤੈਅ ਨਹੀਂ ਹੁੰਦੀ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਕਰਮਚਾਰੀ ਉਸ ਤੱਕ ਪਹੁੰਚ ਕੇ ਰਿਪੋਰਟ ਅਪਲੋਡ ਕਰ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL002-STAGGERED-BREAKS",
    "BRANCH_HAS_SEPARATE_STAFF_CAFETERIA",
    "BRANCH_DOES_NOT_HAVE_SEPARATE_STAFF_CAFETERIA",
    ["branch", "staff cafeteria"],
    ["The branch has a separate cafeteria for staff.", "Employees have a separate staff cafeteria inside the branch."],
    "A separate cafeteria may be true, but the decision to stagger lunch breaks depends on counter staffing and the effect of staggered breaks, not on where staff eat.",
    ["शाखा में कर्मचारियों के लिए अलग कैफेटेरिया है।", "कर्मचारियों के लिए शाखा के भीतर अलग कैफेटेरिया उपलब्ध है।"],
    "अलग कैफेटेरिया होना निर्णय के लिए जरूरी नहीं है; निर्णय काउंटरों पर स्टाफ की उपलब्धता और अलग-अलग समय पर ब्रेक देने के प्रभाव पर निर्भर करता है।",
    ["ਸ਼ਾਖਾ ਵਿੱਚ ਕਰਮਚਾਰੀਆਂ ਲਈ ਵੱਖਰਾ ਕੈਫੇਟੇਰੀਆ ਹੈ।", "ਕਰਮਚਾਰੀਆਂ ਲਈ ਸ਼ਾਖਾ ਦੇ ਅੰਦਰ ਵੱਖਰਾ ਕੈਫੇਟੇਰੀਆ ਉਪਲਬਧ ਹੈ।"],
    "ਵੱਖਰਾ ਕੈਫੇਟੇਰੀਆ ਹੋਣਾ ਫੈਸਲੇ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਫੈਸਲਾ ਕਾਊਂਟਰਾਂ ਉੱਤੇ ਸਟਾਫ ਦੀ ਉਪਲਬਧਤਾ ਅਤੇ ਵੱਖ-ਵੱਖ ਸਮੇਂ ਬ੍ਰੇਕ ਦੇਣ ਦੇ ਅਸਰ ਉੱਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
  ),
  overlay(
    "STA-EN-QL002-HANDOFF-CHECKLIST",
    "HANDOFF_CHECKLIST_WILL_BE_PRINTED_ON_PAPER",
    "HANDOFF_CHECKLIST_WILL_NOT_BE_PRINTED_ON_PAPER",
    ["handoff checklist", "paper"],
    ["The handoff checklist will be printed on paper.", "The proposed checklist will be used as a paper form."],
    "The proposal requires a checklist capable of reducing missed handoffs; it does not require the checklist to be printed rather than digital.",
    ["हैंडऑफ चेकलिस्ट कागज पर छापी जाएगी।", "प्रस्तावित चेकलिस्ट का उपयोग कागजी फॉर्म के रूप में किया जाएगा।"],
    "प्रस्ताव के लिए चेकलिस्ट का कागज पर होना जरूरी नहीं है; जरूरी यह है कि उसका उपयोग शिफ्ट बदलते समय छूटने वाले काम कम कर सके।",
    ["ਹੈਂਡਆਫ ਚੈਕਲਿਸਟ ਕਾਗਜ਼ ਉੱਤੇ ਛਾਪੀ ਜਾਵੇਗੀ।", "ਪ੍ਰਸਤਾਵਿਤ ਚੈਕਲਿਸਟ ਕਾਗਜ਼ੀ ਫਾਰਮ ਵਜੋਂ ਵਰਤੀ ਜਾਵੇਗੀ।"],
    "ਪ੍ਰਸਤਾਵ ਲਈ ਚੈਕਲਿਸਟ ਦਾ ਕਾਗਜ਼ ਉੱਤੇ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਇਸ ਦੀ ਵਰਤੋਂ ਸ਼ਿਫਟ ਬਦਲਣ ਵੇਲੇ ਛੁੱਟਣ ਵਾਲੇ ਕੰਮ ਘਟਾ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL003-KYC-REMINDER",
    "KYC_DESK_IS_NEAR_BRANCH_ENTRANCE",
    "KYC_DESK_IS_NOT_NEAR_BRANCH_ENTRANCE",
    ["KYC desk", "branch entrance"],
    ["The KYC service desk is near the branch entrance.", "The desk handling KYC updates is located close to the entrance."],
    "The reminder assumes that due customers exist and that the service desk can complete KYC updates; the desk's position inside the branch is not required.",
    ["KYC सेवा डेस्क शाखा के प्रवेश द्वार के पास है।", "KYC अपडेट करने वाला डेस्क प्रवेश द्वार के नजदीक स्थित है।"],
    "रिमाइंडर के लिए यह जरूरी नहीं कि डेस्क प्रवेश द्वार के पास हो; जरूरी यह है कि संबंधित ग्राहक हों और सेवा डेस्क KYC अपडेट कर सके।",
    ["KYC ਸੇਵਾ ਡੈਸਕ ਸ਼ਾਖਾ ਦੇ ਦਾਖ਼ਲੇ ਦੇ ਨੇੜੇ ਹੈ।", "KYC ਅਪਡੇਟ ਕਰਨ ਵਾਲਾ ਡੈਸਕ ਦਾਖ਼ਲੇ ਦੇ ਕੋਲ ਸਥਿਤ ਹੈ।"],
    "ਯਾਦ ਦਿਹਾਨੀ ਲਈ ਡੈਸਕ ਦਾ ਦਾਖ਼ਲੇ ਕੋਲ ਹੋਣਾ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਸੰਬੰਧਿਤ ਗਾਹਕ ਹੋਣ ਅਤੇ ਸੇਵਾ ਡੈਸਕ KYC ਅਪਡੇਟ ਕਰ ਸਕੇ।",
  ),
  overlay(
    "STA-EN-QL003-SYSTEM-MAINTENANCE",
    "MAINTENANCE_TEAM_HAS_FIVE_MEMBERS",
    "MAINTENANCE_TEAM_DOES_NOT_HAVE_FIVE_MEMBERS",
    ["maintenance team", "members"],
    ["The maintenance team has five members.", "Exactly five people are assigned to the maintenance team."],
    "The number of people on the maintenance team is irrelevant to whether users may have unsaved work and can save it before the outage begins.",
    ["मेंटेनेंस टीम में पाँच सदस्य हैं।", "मेंटेनेंस टीम में ठीक पाँच लोग नियुक्त हैं।"],
    "मेंटेनेंस टीम में कितने सदस्य हैं, यह चेतावनी के लिए जरूरी नहीं है; जरूरी यह है कि कुछ उपयोगकर्ताओं का काम सेव होना बाकी हो सकता है और वे समय रहते उसे सेव कर सकें।",
    ["ਮੈਂਟੇਨੈਂਸ ਟੀਮ ਵਿੱਚ ਪੰਜ ਮੈਂਬਰ ਹਨ।", "ਮੈਂਟੇਨੈਂਸ ਟੀਮ ਵਿੱਚ ਠੀਕ ਪੰਜ ਲੋਕ ਹਨ।"],
    "ਮੈਂਟੇਨੈਂਸ ਟੀਮ ਵਿੱਚ ਕਿੰਨੇ ਮੈਂਬਰ ਹਨ, ਇਹ ਚੇਤਾਵਨੀ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਕੁਝ ਵਰਤੋਂਕਾਰਾਂ ਦਾ ਕੰਮ ਸੇਵ ਹੋਣਾ ਬਾਕੀ ਹੋ ਸਕਦਾ ਹੈ ਅਤੇ ਉਹ ਸਮੇਂ ਸਿਰ ਉਸ ਨੂੰ ਸੇਵ ਕਰ ਸਕਣ।",
  ),
  overlay(
    "STA-EN-QL004-TOKEN-DISPLAY",
    "TOKEN_DISPLAY_SCREEN_IS_NEWLY_INSTALLED",
    "TOKEN_DISPLAY_SCREEN_IS_NOT_NEWLY_INSTALLED",
    ["token display", "screen"],
    ["The token-position screen was newly installed this month.", "The large token display is a newly installed screen."],
    "The expected reduction in clustering depends on customers being able to use queue-position information, not on how recently the display was installed.",
    ["टोकन की स्थिति दिखाने वाली स्क्रीन इसी महीने नई लगाई गई है।", "बड़ी टोकन डिस्प्ले स्क्रीन हाल ही में लगाई गई है।"],
    "भीड़ कम होने का दावा स्क्रीन के नया होने पर निर्भर नहीं करता; जरूरी यह है कि टोकन की स्थिति दिखने से ग्राहक काउंटर के पास खड़े रहने की जरूरत कम महसूस करें।",
    ["ਟੋਕਨ ਦੀ ਸਥਿਤੀ ਦਿਖਾਉਣ ਵਾਲੀ ਸਕਰੀਨ ਇਸੇ ਮਹੀਨੇ ਨਵੀਂ ਲਗਾਈ ਗਈ ਹੈ।", "ਵੱਡੀ ਟੋਕਨ ਡਿਸਪਲੇ ਸਕਰੀਨ ਹਾਲ ਹੀ ਵਿੱਚ ਲਗਾਈ ਗਈ ਹੈ।"],
    "ਭੀੜ ਘਟਣ ਦਾ ਦਾਅਵਾ ਸਕਰੀਨ ਦੇ ਨਵਾਂ ਹੋਣ ਉੱਤੇ ਨਿਰਭਰ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਟੋਕਨ ਦੀ ਸਥਿਤੀ ਦਿਖਣ ਨਾਲ ਗਾਹਕ ਕਾਊਂਟਰ ਕੋਲ ਖੜ੍ਹੇ ਰਹਿਣ ਦੀ ਲੋੜ ਘੱਟ ਮਹਿਸੂਸ ਕਰਨ।",
  ),
  overlay(
    "STA-EN2-QL004-EXPRESS-DEPOSIT-LANE",
    "EXPRESS_LANE_SIGN_IS_BLUE",
    "EXPRESS_LANE_SIGN_IS_NOT_BLUE",
    ["express lane", "sign"],
    ["The express-lane sign is blue.", "A blue sign identifies the separate express lane."],
    "The colour of the lane sign is not required for the claim; the relevant assumption is that moving simple deposits can divert queue load from the regular counters.",
    ["एक्सप्रेस लेन का संकेत-पट्ट नीले रंग का है।", "अलग एक्सप्रेस लेन की पहचान नीले संकेत-पट्ट से होती है।"],
    "लेन के संकेत-पट्ट का रंग दावे के लिए जरूरी नहीं है; जरूरी यह है कि साधारण जमा को अलग लेन में भेजने से नियमित काउंटर की कतार का कुछ दबाव कम हो सके।",
    ["ਐਕਸਪ੍ਰੈੱਸ ਲੇਨ ਦਾ ਸਾਈਨ ਨੀਲੇ ਰੰਗ ਦਾ ਹੈ।", "ਵੱਖਰੀ ਐਕਸਪ੍ਰੈੱਸ ਲੇਨ ਦੀ ਪਛਾਣ ਨੀਲੇ ਸਾਈਨ ਨਾਲ ਹੁੰਦੀ ਹੈ।"],
    "ਲੇਨ ਦੇ ਸਾਈਨ ਦਾ ਰੰਗ ਦਾਅਵੇ ਲਈ ਲਾਜ਼ਮੀ ਨਹੀਂ; ਲੋੜ ਇਹ ਹੈ ਕਿ ਸਧਾਰਣ ਜਮ੍ਹਾਂ ਨੂੰ ਵੱਖਰੀ ਲੇਨ ਵਿੱਚ ਭੇਜਣ ਨਾਲ ਨਿਯਮਤ ਕਾਊਂਟਰ ਦੀ ਕਤਾਰ ਦਾ ਕੁਝ ਦਬਾਅ ਘਟ ਸਕੇ।",
  ),
] as const satisfies readonly StaBankFourthAssumptionOverlay[];

const OVERLAY_BY_SCENARIO = new Map(STA_BANK_FOURTH_ASSUMPTION_OVERLAYS.map((item) => [item.scenarioId, item] as const));

export function getStaBankFourthAssumptionOverlay(scenarioId: string): StaBankFourthAssumptionOverlay | undefined {
  return OVERLAY_BY_SCENARIO.get(scenarioId);
}
