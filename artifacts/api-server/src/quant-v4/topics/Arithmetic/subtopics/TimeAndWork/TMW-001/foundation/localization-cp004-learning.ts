import type {
  TmwCp004GeneratedQuestion,
  TmwCp004MisconceptionId,
  TmwCp004RuleId,
  TmwCp004SolveMode,
} from "./cp004-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp004Actor, cp004Copy, cp004Job } from "./localization-cp004-language";

export function tmwCp004LocalizedOpening(ruleId: TmwCp004RuleId, language: TmwLocalizedLanguage): string {
  const openings: Record<TmwCp004RuleId, [string, string]> = {
    TMW_STAGE_LEDGER: [
      "हर चरण को अलग रखें। उस चरण में सक्रिय सदस्यों की संयुक्त दर से हुआ काम निकालें, फिर ठीक शेष काम अगले चरण में ले जाएँ।",
      "ਹਰ ਪੜਾਅ ਨੂੰ ਵੱਖ ਰੱਖੋ। ਉਸ ਪੜਾਅ ਵਿੱਚ ਸਰਗਰਮ ਮੈਂਬਰਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਨਾਲ ਹੋਇਆ ਕੰਮ ਕੱਢੋ, ਫਿਰ ਸਹੀ ਬਾਕੀ ਕੰਮ ਅਗਲੇ ਪੜਾਅ ਵਿੱਚ ਲੈ ਜਾਓ।",
    ],
    TMW_STAGE_HANDOFF: [
      "सदस्य बदलने पर पहले किया गया काम बना रहता है। पूरे काम में से उसे घटाकर शेष भाग पर नए सदस्य की दर लगाएँ।",
      "ਮੈਂਬਰ ਬਦਲਣ ਉੱਤੇ ਪਹਿਲਾਂ ਕੀਤਾ ਕੰਮ ਬਣਿਆ ਰਹਿੰਦਾ ਹੈ। ਸਾਰੇ ਕੰਮ ਵਿੱਚੋਂ ਉਹ ਘਟਾ ਕੇ ਬਾਕੀ ਹਿੱਸੇ ਉੱਤੇ ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਦਰ ਲਗਾਓ।",
    ],
    TMW_STAGE_INVERSE_EVENT: [
      "अज्ञात घटना-समय को एक चर मानें और सभी चरणों में हुए काम का योग एक पूरे काम के बराबर रखें।",
      "ਅਣਜਾਣ ਘਟਨਾ-ਸਮੇਂ ਨੂੰ ਇੱਕ ਚਲ ਮੰਨੋ ਅਤੇ ਸਾਰੇ ਪੜਾਵਾਂ ਵਿੱਚ ਹੋਏ ਕੰਮ ਦਾ ਜੋੜ ਇੱਕ ਪੂਰੇ ਕੰਮ ਦੇ ਬਰਾਬਰ ਰੱਖੋ।",
    ],
    TMW_STAGE_RATE_CHANGE: [
      "घटना से पहले हुआ काम नहीं बदलता। नई दैनिक अवधि या नई कार्यक्षमता से बदली हुई दर निकालें और उसे केवल बाद वाले चरण पर लगाएँ।",
      "ਘਟਨਾ ਤੋਂ ਪਹਿਲਾਂ ਹੋਇਆ ਕੰਮ ਨਹੀਂ ਬਦਲਦਾ। ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਮਿਆਦ ਜਾਂ ਨਵੀਂ ਕਾਰਗੁਜ਼ਾਰੀ ਨਾਲ ਬਦਲੀ ਦਰ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਸਿਰਫ਼ ਬਾਅਦ ਵਾਲੇ ਪੜਾਅ ਉੱਤੇ ਲਗਾਓ।",
    ],
    TMW_STAGE_SIGNED_RATE: [
      "हानिकारक प्रक्रिया शुरू होने से पहले केवल सकारात्मक दर लें। उसके बाद उसकी दर को जारी सकारात्मक दर से घटाकर शुद्ध दर पाएँ।",
      "ਨੁਕਸਾਨ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਪਹਿਲਾਂ ਸਿਰਫ਼ ਸਕਾਰਾਤਮਕ ਦਰ ਲਓ। ਉਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਦਰ ਨੂੰ ਜਾਰੀ ਸਕਾਰਾਤਮਕ ਦਰ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਸ਼ੁੱਧ ਦਰ ਲਵੋ।",
    ],
    TMW_STAGE_WORKFORCE_EVENT: [
      "हर कार्यबल चरण में कर्मचारी संख्या × प्रति कर्मचारी दर × समय से काम निकालें। शेष काम से घटना के बाद आवश्यक कर्मचारी संख्या मिलेगी।",
      "ਹਰ ਕਰਮਚਾਰੀ ਪੜਾਅ ਵਿੱਚ ਕਰਮਚਾਰੀ ਗਿਣਤੀ × ਪ੍ਰਤੀ ਕਰਮਚਾਰੀ ਦਰ × ਸਮੇਂ ਨਾਲ ਕੰਮ ਕੱਢੋ। ਬਾਕੀ ਕੰਮ ਤੋਂ ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਮਿਲੇਗੀ।",
    ],
    TMW_STAGE_COMPARISON: [
      "बदली हुई चरणबद्ध स्थिति और बिना बदलाव वाली संदर्भ स्थिति का समय अलग-अलग निकालें, फिर प्रश्न के क्रम में उनका अंतर लें।",
      "ਬਦਲੀ ਹੋਈ ਪੜਾਅਵਾਰ ਸਥਿਤੀ ਅਤੇ ਬਿਨਾਂ ਬਦਲਾਅ ਵਾਲੀ ਹਵਾਲਾ ਸਥਿਤੀ ਦਾ ਸਮਾਂ ਵੱਖ-ਵੱਖ ਕੱਢੋ, ਫਿਰ ਪ੍ਰਸ਼ਨ ਦੇ ਕ੍ਰਮ ਵਿੱਚ ਉਨ੍ਹਾਂ ਦਾ ਅੰਤਰ ਲਵੋ।",
    ],
  };
  return openings[ruleId][language === "hi" ? 0 : 1];
}

const shortcutTitles: Record<TmwCp004SolveMode, [string, string]> = {
  findRemainingWorkAfterInitialPhase: ["10-सेकंड पूरा भाग घटाएँ", "10-ਸਕਿੰਟ ਪੂਰਾ ਹਿੱਸਾ ਘਟਾਓ"],
  findWorkCompletedBeforeEvent: ["10-सेकंड संयुक्त दर × समय", "10-ਸਕਿੰਟ ਸਾਂਝੀ ਦਰ × ਸਮਾਂ"],
  findTotalTimeWhenFirstAgentStartsThenSecondFinishes: ["10-सेकंड पहला चरण + शेष समय", "10-ਸਕਿੰਟ ਪਹਿਲਾ ਪੜਾਅ + ਬਾਕੀ ਸਮਾਂ"],
  findTotalTimeWhenTeamStartsThenOneLeaves: ["10-सेकंड साथ, फिर अकेला", "10-ਸਕਿੰਟ ਇਕੱਠੇ, ਫਿਰ ਇਕੱਲਾ"],
  findTotalTimeWhenOneStartsThenAnotherJoins: ["10-सेकंड अकेला, फिर साथ", "10-ਸਕਿੰਟ ਇਕੱਲਾ, ਫਿਰ ਇਕੱਠੇ"],
  findTotalTimeWithStaggeredJoins: ["10-सेकंड बढ़ती संयुक्त दर", "10-ਸਕਿੰਟ ਵਧਦੀ ਸਾਂਝੀ ਦਰ"],
  findTotalTimeWithStaggeredExits: ["10-सेकंड घटती संयुक्त दर", "10-ਸਕਿੰਟ ਘਟਦੀ ਸਾਂਝੀ ਦਰ"],
  findTotalTimeWithJoinAndLeaveEvents: ["10-सेकंड तीन चरणों का हिसाब", "10-ਸਕਿੰਟ ਤਿੰਨ ਪੜਾਵਾਂ ਦਾ ਹਿਸਾਬ"],
  findJoinTimeFromFinalCompletion: ["10-सेकंड जुड़ने का समय x", "10-ਸਕਿੰਟ ਜੁੜਨ ਦਾ ਸਮਾਂ x"],
  findLeaveTimeFromFinalCompletion: ["10-सेकंड जाने का समय x", "10-ਸਕਿੰਟ ਜਾਣ ਦਾ ਸਮਾਂ x"],
  findUnknownInitialPhaseDuration: ["10-सेकंड अंतिम काम पहले घटाएँ", "10-ਸਕਿੰਟ ਆਖ਼ਰੀ ਕੰਮ ਪਹਿਲਾਂ ਘਟਾਓ"],
  findUnknownFinalPhaseDuration: ["10-सेकंड शेष काम ÷ अंतिम दर", "10-ਸਕਿੰਟ ਬਾਕੀ ਕੰਮ ÷ ਆਖ਼ਰੀ ਦਰ"],
  findReplacementWorkerRate: ["10-सेकंड शेष काम ÷ दिया समय", "10-ਸਕਿੰਟ ਬਾਕੀ ਕੰਮ ÷ ਦਿੱਤਾ ਸਮਾਂ"],
  findReplacementWorkerTime: ["10-सेकंड नई दर का उलटा", "10-ਸਕਿੰਟ ਨਵੀਂ ਦਰ ਦਾ ਉਲਟ"],
  findCompletionWithIdleInterval: ["10-सेकंड रुका समय अलग जोड़ें", "10-ਸਕਿੰਟ ਰੁਕਿਆ ਸਮਾਂ ਵੱਖ ਜੋੜੋ"],
  findCompletionWithChangedDailyHours: ["10-सेकंड घंटे के अनुपात से दर", "10-ਸਕਿੰਟ ਘੰਟਿਆਂ ਦੇ ਅਨੁਪਾਤ ਨਾਲ ਦਰ"],
  findCompletionWithMidProjectEfficiencyChange: ["10-सेकंड नई कार्यक्षमता, नई दर", "10-ਸਕਿੰਟ ਨਵੀਂ ਕਾਰਗੁਜ਼ਾਰੀ, ਨਵੀਂ ਦਰ"],
  findCompletionWithNegativeWorkerActivatedLater: ["10-सेकंड सकारात्मक दर − हानि दर", "10-ਸਕਿੰਟ ਸਕਾਰਾਤਮਕ ਦਰ − ਨੁਕਸਾਨ ਦਰ"],
  findEventTimeAtSpecifiedCompletionFraction: ["10-सेकंड लक्षित भाग ÷ दर", "10-ਸਕਿੰਟ ਟੀਚੇ ਵਾਲਾ ਹਿੱਸਾ ÷ ਦਰ"],
  findRequiredRemainingRateForDeadline: ["10-सेकंड शेष काम ÷ शेष समय", "10-ਸਕਿੰਟ ਬਾਕੀ ਕੰਮ ÷ ਬਾਕੀ ਸਮਾਂ"],
  findWorkerCountAddedAfterPartialProgress: ["10-सेकंड आवश्यक कुल − शुरुआती", "10-ਸਕਿੰਟ ਲੋੜੀਂਦੇ ਕੁੱਲ − ਸ਼ੁਰੂਆਤੀ"],
  findWorkerCountRemovedAfterPartialProgress: ["10-सेकंड शुरुआती − अंतिम", "10-ਸਕਿੰਟ ਸ਼ੁਰੂਆਤੀ − ਆਖ਼ਰੀ"],
  findDelayAfterWorkerLeaves: ["10-सेकंड बदला समय − सामान्य समय", "10-ਸਕਿੰਟ ਬਦਲਿਆ ਸਮਾਂ − ਆਮ ਸਮਾਂ"],
  findEarlyCompletionAfterWorkerJoins: ["10-सेकंड अकेला समय − बदला समय", "10-ਸਕਿੰਟ ਇਕੱਲਾ ਸਮਾਂ − ਬਦਲਿਆ ਸਮਾਂ"],
};

export function tmwCp004LocalizedShortcut(
  mode: TmwCp004SolveMode,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const phaseModes = new Set<TmwCp004SolveMode>([
    "findTotalTimeWhenFirstAgentStartsThenSecondFinishes",
    "findTotalTimeWhenTeamStartsThenOneLeaves",
    "findTotalTimeWhenOneStartsThenAnotherJoins",
    "findTotalTimeWithStaggeredJoins",
    "findTotalTimeWithStaggeredExits",
    "findTotalTimeWithJoinAndLeaveEvents",
    "findCompletionWithIdleInterval",
  ]);
  const inverseModes = new Set<TmwCp004SolveMode>([
    "findJoinTimeFromFinalCompletion",
    "findLeaveTimeFromFinalCompletion",
    "findUnknownInitialPhaseDuration",
    "findUnknownFinalPhaseDuration",
    "findEventTimeAtSpecifiedCompletionFraction",
    "findRequiredRemainingRateForDeadline",
  ]);
  let step: string;
  if (phaseModes.has(mode)) {
    step = cp004Copy(
      language,
      `हर चरण का काम निकालकर शेष भाग आगे ले जाने पर उत्तर ${answerText} मिलता है।`,
      `ਹਰ ਪੜਾਅ ਦਾ ਕੰਮ ਕੱਢ ਕੇ ਬਾਕੀ ਹਿੱਸਾ ਅੱਗੇ ਲਿਜਾਣ ਉੱਤੇ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`,
    );
  } else if (inverseModes.has(mode)) {
    step = cp004Copy(
      language,
      `अज्ञात समय या दर को समीकरण में रखकर कुल काम एक करने पर उत्तर ${answerText} मिलता है।`,
      `ਅਣਜਾਣ ਸਮਾਂ ਜਾਂ ਦਰ ਨੂੰ ਸਮੀਕਰਨ ਵਿੱਚ ਰੱਖ ਕੇ ਕੁੱਲ ਕੰਮ ਇੱਕ ਕਰਨ ਉੱਤੇ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`,
    );
  } else {
    step = cp004Copy(
      language,
      `दिए गए बदलाव को केवल संबंधित चरण पर लागू करने से उत्तर ${answerText} मिलता है।`,
      `ਦਿੱਤੇ ਬਦਲਾਅ ਨੂੰ ਸਿਰਫ਼ ਸੰਬੰਧਿਤ ਪੜਾਅ ਉੱਤੇ ਲਗਾਉਣ ਨਾਲ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`,
    );
  }
  return { title: shortcutTitles[mode][language === "hi" ? 0 : 1], steps: [step] };
}

export function tmwCp004LocalizedTrapReason(
  id: Exclude<TmwCp004MisconceptionId, "CORRECT">,
  language: TmwLocalizedLanguage,
): string {
  const reasons: Record<Exclude<TmwCp004MisconceptionId, "CORRECT">, [string, string]> = {
    COMPLETED_REPORTED_AS_REMAINING: [
      "इस विकल्प में पूरा हो चुका भाग बताया गया है, जबकि प्रश्न शेष भाग पूछता है।",
      "ਇਸ ਚੋਣ ਵਿੱਚ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਦੱਸਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਬਾਕੀ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।",
    ],
    REMAINING_REPORTED_AS_COMPLETED: [
      "इस विकल्प में शेष भाग बताया गया है, जबकि प्रश्न घटना तक पूरा हुआ भाग पूछता है।",
      "ਇਸ ਚੋਣ ਵਿੱਚ ਬਾਕੀ ਹਿੱਸਾ ਦੱਸਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਘਟਨਾ ਤੱਕ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।",
    ],
    INITIAL_PHASE_OMITTED: [
      "शुरुआती चरण में लगा समय या हुआ काम छोड़ देने से यह विकल्प बनता है।",
      "ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਦਾ ਸਮਾਂ ਜਾਂ ਹੋਇਆ ਕੰਮ ਛੱਡਣ ਨਾਲ ਇਹ ਚੋਣ ਬਣਦੀ ਹੈ।",
    ],
    FINAL_PHASE_OMITTED: [
      "अंतिम चरण का समय छोड़कर केवल पहले चरणों का कुल लिया गया है।",
      "ਆਖ਼ਰੀ ਪੜਾਅ ਦਾ ਸਮਾਂ ਛੱਡ ਕੇ ਸਿਰਫ਼ ਪਹਿਲੇ ਪੜਾਵਾਂ ਦਾ ਕੁੱਲ ਲਿਆ ਗਿਆ ਹੈ।",
    ],
    PHASE_RATES_SWAPPED: [
      "दो चरणों की सक्रिय दरें आपस में बदल दी गई हैं।",
      "ਦੋ ਪੜਾਵਾਂ ਦੀਆਂ ਸਰਗਰਮ ਦਰਾਂ ਆਪਸ ਵਿੱਚ ਬਦਲ ਦਿੱਤੀਆਂ ਗਈਆਂ ਹਨ।",
    ],
    RATES_ADDED_ACROSS_SEQUENTIAL_PHASES: [
      "अलग-अलग समय पर लागू दरों को एक साथ जोड़ दिया गया है; क्रमिक चरणों का काम अलग निकलना चाहिए।",
      "ਵੱਖ-ਵੱਖ ਸਮਿਆਂ ਉੱਤੇ ਲੱਗੀਆਂ ਦਰਾਂ ਨੂੰ ਇਕੱਠੇ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ; ਲਗਾਤਾਰ ਪੜਾਵਾਂ ਦਾ ਕੰਮ ਵੱਖ ਕੱਢਣਾ ਚਾਹੀਦਾ ਹੈ।",
    ],
    EVENT_TIME_REPORTED_AS_TOTAL: [
      "यह घटना का समय है, जबकि प्रश्न शुरू से कुल पूरा होने का समय पूछता है।",
      "ਇਹ ਘਟਨਾ ਦਾ ਸਮਾਂ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ।",
    ],
    TOTAL_TIME_REPORTED_AS_EVENT: [
      "यह कुल पूरा होने का समय है, जबकि प्रश्न जुड़ने या जाने की घटना का समय पूछता है।",
      "ਇਹ ਕੁੱਲ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਜੁੜਨ ਜਾਂ ਜਾਣ ਦੀ ਘਟਨਾ ਦਾ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ।",
    ],
    IDLE_INTERVAL_OMITTED: [
      "काम रुका रहने का समय कुल बीते समय में नहीं जोड़ा गया है।",
      "ਕੰਮ ਰੁਕਿਆ ਰਹਿਣ ਦਾ ਸਮਾਂ ਕੁੱਲ ਬੀਤੇ ਸਮੇਂ ਵਿੱਚ ਨਹੀਂ ਜੋੜਿਆ ਗਿਆ।",
    ],
    IDLE_INTERVAL_TREATED_AS_WORK: [
      "रुके हुए समय में भी काम होने की गलत धारणा से यह विकल्प बनता है।",
      "ਰੁਕੇ ਹੋਏ ਸਮੇਂ ਵਿੱਚ ਵੀ ਕੰਮ ਹੋਣ ਦੀ ਗਲਤ ਧਾਰਨਾ ਨਾਲ ਇਹ ਚੋਣ ਬਣਦੀ ਹੈ।",
    ],
    RATE_CHANGE_APPLIED_TO_TIME: [
      "दर के गुणक को सीधे समय पर उसी दिशा में लगा दिया गया है, जबकि समय दर के उलटे अनुपात में बदलता है।",
      "ਦਰ ਦੇ ਗੁਣਕ ਨੂੰ ਸਿੱਧਾ ਸਮੇਂ ਉੱਤੇ ਉਸੇ ਦਿਸ਼ਾ ਵਿੱਚ ਲਗਾਇਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਸਮਾਂ ਦਰ ਦੇ ਉਲਟ ਅਨੁਪਾਤ ਵਿੱਚ ਬਦਲਦਾ ਹੈ।",
    ],
    HOUR_CHANGE_IGNORED: [
      "दैनिक काम के घंटे बदलने से दैनिक दर बदलती है; इस विकल्प में वह बदलाव छोड़ दिया गया है।",
      "ਰੋਜ਼ਾਨਾ ਕੰਮ ਦੇ ਘੰਟੇ ਬਦਲਣ ਨਾਲ ਰੋਜ਼ਾਨਾ ਦਰ ਬਦਲਦੀ ਹੈ; ਇਸ ਚੋਣ ਵਿੱਚ ਉਹ ਬਦਲਾਅ ਛੱਡਿਆ ਗਿਆ ਹੈ।",
    ],
    DESTRUCTIVE_RATE_ADDED: [
      "काम बिगाड़ने वाली प्रक्रिया की दर को घटाने के बजाय जोड़ दिया गया है।",
      "ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਦੀ ਦਰ ਨੂੰ ਘਟਾਉਣ ਦੀ ਥਾਂ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    ],
    DESTRUCTIVE_RATE_OMITTED: [
      "हानिकारक प्रक्रिया शुरू होने के बाद भी उसकी दर को शुद्ध दर में शामिल नहीं किया गया है।",
      "ਨੁਕਸਾਨ ਕਰਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੋਣ ਤੋਂ ਬਾਅਦ ਵੀ ਉਸ ਦੀ ਦਰ ਨੂੰ ਸ਼ੁੱਧ ਦਰ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।",
    ],
    ELAPSED_WORK_IGNORED: [
      "घटना से पहले हो चुका काम छोड़कर पूरे काम पर बाद वाली दर लगा दी गई है।",
      "ਘਟਨਾ ਤੋਂ ਪਹਿਲਾਂ ਹੋਇਆ ਕੰਮ ਛੱਡ ਕੇ ਸਾਰੇ ਕੰਮ ਉੱਤੇ ਬਾਅਦ ਵਾਲੀ ਦਰ ਲਗਾ ਦਿੱਤੀ ਗਈ ਹੈ।",
    ],
    DEADLINE_REPORTED_AS_ANSWER: [
      "दी गई अंतिम समय-सीमा को ही उत्तर मान लिया गया है; प्रश्न शेष समय की आवश्यक दर पूछता है।",
      "ਦਿੱਤੀ ਆਖ਼ਰੀ ਸਮਾਂ-ਸੀਮਾ ਨੂੰ ਹੀ ਉੱਤਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਪ੍ਰਸ਼ਨ ਬਾਕੀ ਸਮੇਂ ਦੀ ਲੋੜੀਂਦੀ ਦਰ ਪੁੱਛਦਾ ਹੈ।",
    ],
    TOTAL_COUNT_REPORTED_AS_ADDED: [
      "घटना के बाद आवश्यक कुल कर्मचारी संख्या को अतिरिक्त कर्मचारियों की संख्या बता दिया गया है।",
      "ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੀ ਕੁੱਲ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਨੂੰ ਵਾਧੂ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਦੱਸ ਦਿੱਤਾ ਗਿਆ ਹੈ।",
    ],
    ADDED_COUNT_REPORTED_AS_TOTAL: [
      "केवल जोड़े गए कर्मचारियों की संख्या को घटना के बाद की कुल संख्या मान लिया गया है।",
      "ਸਿਰਫ਼ ਜੋੜੇ ਗਏ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਦੀ ਕੁੱਲ ਗਿਣਤੀ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।",
    ],
    ORIGINAL_TOTAL_TIME_REPORTED: [
      "यह बदलाव से पहले का कुल समय है, जबकि प्रश्न देरी या बचत पूछता है।",
      "ਇਹ ਬਦਲਾਅ ਤੋਂ ਪਹਿਲਾਂ ਦਾ ਕੁੱਲ ਸਮਾਂ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਦੇਰੀ ਜਾਂ ਬਚਤ ਪੁੱਛਦਾ ਹੈ।",
    ],
    CHANGED_TOTAL_TIME_REPORTED: [
      "यह बदली हुई स्थिति का कुल समय है, जबकि प्रश्न दोनों स्थितियों का अंतर पूछता है।",
      "ਇਹ ਬਦਲੀ ਹੋਈ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਦੋਵਾਂ ਸਥਿਤੀਆਂ ਦਾ ਅੰਤਰ ਪੁੱਛਦਾ ਹੈ।",
    ],
    PLAUSIBLE_SCALE_ERROR: [
      "दर, समय या शेष काम के पैमाने में एक यथार्थ दिखने वाली लेकिन गलत अदला-बदली की गई है।",
      "ਦਰ, ਸਮਾਂ ਜਾਂ ਬਾਕੀ ਕੰਮ ਦੇ ਪੈਮਾਨੇ ਵਿੱਚ ਹਕੀਕਤ ਵਰਗੀ ਲੱਗਣ ਵਾਲੀ ਪਰ ਗਲਤ ਅਦਲਾ-ਬਦਲੀ ਕੀਤੀ ਗਈ ਹੈ।",
    ],
  };
  return reasons[id][language === "hi" ? 0 : 1];
}

export function tmwCp004LocalizedConclusion(
  source: TmwCp004GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const A = cp004Actor(p, language, "actorA");
  const B = cp004Actor(p, language, "actorB");
  const assignment = cp004Job(p, language);
  switch (source.solveMode) {
    case "findRemainingWorkAfterInitialPhase":
      return cp004Copy(language, `अतः शुरुआती चरण के बाद ${answerText} बाकी है।`, `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ${answerText} ਬਾਕੀ ਹੈ।`);
    case "findWorkCompletedBeforeEvent":
      return cp004Copy(language, `अतः घटना तक ${answerText} पूरा हो चुका है।`, `ਇਸ ਲਈ ਘਟਨਾ ਤੱਕ ${answerText} ਪੂਰਾ ਹੋ ਚੁੱਕਾ ਹੈ।`);
    case "findJoinTimeFromFinalCompletion":
      return cp004Copy(language, `अतः ${B} शुरू से ${answerText} बाद जुड़ा।`, `ਇਸ ਲਈ ${B} ਸ਼ੁਰੂ ਤੋਂ ${answerText} ਬਾਅਦ ਜੁੜਿਆ।`);
    case "findLeaveTimeFromFinalCompletion":
      return cp004Copy(language, `अतः ${A} शुरू से ${answerText} बाद गया।`, `ਇਸ ਲਈ ${A} ਸ਼ੁਰੂ ਤੋਂ ${answerText} ਬਾਅਦ ਗਿਆ।`);
    case "findUnknownInitialPhaseDuration":
      return cp004Copy(language, `अतः पहला चरण ${answerText} चला।`, `ਇਸ ਲਈ ਪਹਿਲਾ ਪੜਾਅ ${answerText} ਚੱਲਿਆ।`);
    case "findUnknownFinalPhaseDuration":
      return cp004Copy(language, `अतः अंतिम चरण की अवधि ${answerText} है।`, `ਇਸ ਲਈ ਆਖ਼ਰੀ ਪੜਾਅ ਦੀ ਮਿਆਦ ${answerText} ਹੈ।`);
    case "findReplacementWorkerRate":
      return cp004Copy(language, `अतः नए सदस्य को ${answerText} की दर बनाए रखनी होगी।`, `ਇਸ ਲਈ ਨਵੇਂ ਮੈਂਬਰ ਨੂੰ ${answerText} ਦੀ ਦਰ ਬਣਾਈ ਰੱਖਣੀ ਪਵੇਗੀ।`);
    case "findReplacementWorkerTime":
      return cp004Copy(language, `अतः नया सदस्य पूरा काम अकेले ${answerText} में करेगा।`, `ਇਸ ਲਈ ਨਵਾਂ ਮੈਂਬਰ ਸਾਰਾ ਕੰਮ ਇਕੱਲਾ ${answerText} ਵਿੱਚ ਕਰੇਗਾ।`);
    case "findEventTimeAtSpecifiedCompletionFraction":
      return cp004Copy(language, `अतः निर्धारित घटना शुरू से ${answerText} बाद होगी।`, `ਇਸ ਲਈ ਨਿਰਧਾਰਤ ਘਟਨਾ ਸ਼ੁਰੂ ਤੋਂ ${answerText} ਬਾਅਦ ਹੋਵੇਗੀ।`);
    case "findRequiredRemainingRateForDeadline":
      return cp004Copy(language, `अतः शुरुआती चरण के बाद आवश्यक दर ${answerText} है।`, `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੀ ਦਰ ${answerText} ਹੈ।`);
    case "findWorkerCountAddedAfterPartialProgress":
      return cp004Copy(language, `अतः शुरुआती चरण के बाद ${answerText} जोड़ने होंगे।`, `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ${answerText} ਜੋੜਣੇ ਪੈਣਗੇ।`);
    case "findWorkerCountRemovedAfterPartialProgress":
      return cp004Copy(language, `अतः शुरुआती चरण के बाद ${answerText} चले गए।`, `ਇਸ ਲਈ ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ${answerText} ਚਲੇ ਗਏ।`);
    case "findDelayAfterWorkerLeaves":
      return cp004Copy(language, `अतः सदस्य के जाने से ${answerText} की देरी हुई।`, `ਇਸ ਲਈ ਮੈਂਬਰ ਦੇ ਜਾਣ ਨਾਲ ${answerText} ਦੀ ਦੇਰੀ ਹੋਈ।`);
    case "findEarlyCompletionAfterWorkerJoins":
      return cp004Copy(language, `अतः बाद में सदस्य जुड़ने से ${answerText} की बचत हुई।`, `ਇਸ ਲਈ ਬਾਅਦ ਵਿੱਚ ਮੈਂਬਰ ਜੁੜਨ ਨਾਲ ${answerText} ਦੀ ਬਚਤ ਹੋਈ।`);
    default:
      return cp004Copy(language, `अतः ${assignment} शुरू से ${answerText} में पूरा होगा।`, `ਇਸ ਲਈ ${assignment} ਸ਼ੁਰੂ ਤੋਂ ${answerText} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ।`);
  }
}
