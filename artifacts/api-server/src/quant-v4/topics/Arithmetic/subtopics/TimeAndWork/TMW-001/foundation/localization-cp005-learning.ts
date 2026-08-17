import type {
  TmwCp005GeneratedQuestion,
  TmwCp005MisconceptionId,
  TmwCp005RuleId,
  TmwCp005SolveMode,
} from "./cp005-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import { cp005Actor, cp005Copy, cp005Job, cp005Label } from "./localization-cp005-language";

export function tmwCp005LocalizedOpening(ruleId: TmwCp005RuleId, language: TmwLocalizedLanguage): string {
  const openings: Record<TmwCp005RuleId, [string, string]> = {
    TMW_CYCLE_COMPLETION: [
      "एक पूरे दोहराए जाने वाले चक्र का काम और समय निकालें। जितने पूरे चक्र संभव हों, उतने लें; फिर अंतिम अधूरी बारी को उसकी सक्रिय दर से अलग पूरा करें।",
      "ਇੱਕ ਪੂਰੇ ਦੁਹਰਾਏ ਜਾਣ ਵਾਲੇ ਚੱਕਰ ਦਾ ਕੰਮ ਅਤੇ ਸਮਾਂ ਕੱਢੋ। ਜਿੰਨੇ ਪੂਰੇ ਚੱਕਰ ਸੰਭਵ ਹੋਣ, ਉਨ੍ਹਾਂ ਨੂੰ ਲਵੋ; ਫਿਰ ਆਖ਼ਰੀ ਅਧੂਰੀ ਵਾਰੀ ਨੂੰ ਉਸ ਦੀ ਸਰਗਰਮ ਦਰ ਨਾਲ ਵੱਖ ਪੂਰਾ ਕਰੋ।",
    ],
    TMW_CYCLE_STATE: [
      "पहले एक पूरे चक्र की अवस्था निकालें—कितना काम हुआ, कितना समय लगा और अगली बारी किसकी है। उसी अवस्था से पूरा, शेष या अंतिम खंड तय करें।",
      "ਪਹਿਲਾਂ ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦੀ ਸਥਿਤੀ ਕੱਢੋ—ਕਿੰਨਾ ਕੰਮ ਹੋਇਆ, ਕਿੰਨਾ ਸਮਾਂ ਲੱਗਿਆ ਅਤੇ ਅਗਲੀ ਵਾਰੀ ਕਿਸ ਦੀ ਹੈ। ਉਸੇ ਸਥਿਤੀ ਤੋਂ ਪੂਰਾ, ਬਾਕੀ ਜਾਂ ਆਖ਼ਰੀ ਖੰਡ ਤੈਅ ਕਰੋ।",
    ],
    TMW_CYCLE_INVERSE: [
      "हर ज्ञात और अज्ञात बारी की कुल सक्रिय अवधि गिनें। ज्ञात काम को एक पूरे काम में से घटाकर शेष काम को अज्ञात सक्रिय समय से भाग दें।",
      "ਹਰ ਜਾਣੀ ਅਤੇ ਅਣਜਾਣ ਵਾਰੀ ਦੀ ਕੁੱਲ ਸਰਗਰਮ ਮਿਆਦ ਗਿਣੋ। ਜਾਣਿਆ ਕੰਮ ਇੱਕ ਪੂਰੇ ਕੰਮ ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਬਾਕੀ ਕੰਮ ਨੂੰ ਅਣਜਾਣ ਸਰਗਰਮ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ।",
    ],
    TMW_CYCLE_SIGNED_RATE: [
      "हर चक्र में सकारात्मक काम जोड़ें और बिगड़े हुए काम को घटाएँ। इसी शुद्ध चक्र-काम को दोहराएँ और अंतिम बारी अलग जाँचें।",
      "ਹਰ ਚੱਕਰ ਵਿੱਚ ਸਕਾਰਾਤਮਕ ਕੰਮ ਜੋੜੋ ਅਤੇ ਖਰਾਬ ਹੋਇਆ ਕੰਮ ਘਟਾਓ। ਇਸੇ ਸ਼ੁੱਧ ਚੱਕਰ-ਕੰਮ ਨੂੰ ਦੁਹਰਾਓ ਅਤੇ ਆਖ਼ਰੀ ਵਾਰੀ ਵੱਖ ਜਾਂਚੋ।",
    ],
    TMW_CYCLE_OUTPUT: [
      "हर मशीन के लिए दर × चलने का समय निकालें। एक चक्र के दोनों उत्पादन जोड़कर चक्रों की संख्या से गुणा करें।",
      "ਹਰ ਮਸ਼ੀਨ ਲਈ ਦਰ × ਚੱਲਣ ਦਾ ਸਮਾਂ ਕੱਢੋ। ਇੱਕ ਚੱਕਰ ਦੇ ਦੋਵੇਂ ਉਤਪਾਦਨ ਜੋੜ ਕੇ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਨਾਲ ਗੁਣਾ ਕਰੋ।",
    ],
  };
  return openings[ruleId][language === "hi" ? 0 : 1];
}

const shortcutTitle: Record<TmwCp005SolveMode, [string, string]> = {
  findCompletionTimeForTwoAgentAlternationStartingA: ["10-सेकंड A-पहला चक्र", "10-ਸਕਿੰਟ A-ਪਹਿਲਾ ਚੱਕਰ"],
  findCompletionTimeForTwoAgentAlternationStartingB: ["10-सेकंड B-पहला चक्र", "10-ਸਕਿੰਟ B-ਪਹਿਲਾ ਚੱਕਰ"],
  findCompletionTimeForMultiDayCycle: ["10-सेकंड बहु-दिन चक्र", "10-ਸਕਿੰਟ ਬਹੁ-ਦਿਨ ਚੱਕਰ"],
  findCompletionTimeForThreeAgentCycle: ["10-सेकंड तीन-बारी चक्र", "10-ਸਕਿੰਟ ਤਿੰਨ-ਵਾਰੀ ਚੱਕਰ"],
  findCompletionDayAndTerminalFraction: ["10-सेकंड पूरे दिन + अंतिम भाग", "10-ਸਕਿੰਟ ਪੂਰੇ ਦਿਨ + ਆਖ਼ਰੀ ਹਿੱਸਾ"],
  findWorkAfterGivenNumberOfCycles: ["10-सेकंड चक्र-काम × संख्या", "10-ਸਕਿੰਟ ਚੱਕਰ-ਕੰਮ × ਗਿਣਤੀ"],
  findRemainingWorkAfterFullCycles: ["10-सेकंड पूरा − चक्र-काम", "10-ਸਕਿੰਟ ਪੂਰਾ − ਚੱਕਰ-ਕੰਮ"],
  findTerminalAgent: ["10-सेकंड अंतिम सक्रिय बारी", "10-ਸਕਿੰਟ ਆਖ਼ਰੀ ਸਰਗਰਮ ਵਾਰੀ"],
  findStartingAgentFromCompletionCondition: ["10-सेकंड दोनों शुरुआत जाँचें", "10-ਸਕਿੰਟ ਦੋਵੇਂ ਸ਼ੁਰੂਆਤਾਂ ਜਾਂਚੋ"],
  findUnknownRateFromAlternatingCompletion: ["10-सेकंड अज्ञात बारी की दर", "10-ਸਕਿੰਟ ਅਣਜਾਣ ਵਾਰੀ ਦੀ ਦਰ"],
  findUnknownTimeFromAlternatingCompletion: ["10-सेकंड दर का उलटा", "10-ਸਕਿੰਟ ਦਰ ਦਾ ਉਲਟ"],
  findCompletionWhenHelperWorksEveryNthDay: ["10-सेकंड हर kवें दिन सहायता", "10-ਸਕਿੰਟ ਹਰ kਵੇਂ ਦਿਨ ਮਦਦ"],
  findCompletionWhenAgentRestsEveryNthDay: ["10-सेकंड निर्धारित विश्राम", "10-ਸਕਿੰਟ ਨਿਰਧਾਰਤ ਆਰਾਮ"],
  findCompletionWithWeekendOrHolidayPattern: ["10-सेकंड कार्य-सप्ताह कैलेंडर", "10-ਸਕਿੰਟ ਕੰਮ-ਹਫ਼ਤਾ ਕੈਲੰਡਰ"],
  findCompletionWithUnequalShiftDurations: ["10-सेकंड दर × पाली-अवधि", "10-ਸਕਿੰਟ ਦਰ × ਸ਼ਿਫ਼ਟ ਮਿਆਦ"],
  findCompletionWithTwoDaysOnOneDayOffPattern: ["10-सेकंड दो काम, एक विश्राम", "10-ਸਕਿੰਟ ਦੋ ਕੰਮ, ਇੱਕ ਆਰਾਮ"],
  findCompletionWithPeriodicNegativeWork: ["10-सेकंड काम − नुकसान", "10-ਸਕਿੰਟ ਕੰਮ − ਨੁਕਸਾਨ"],
  findCompletionWithRepeatedJoinLeaveCycle: ["10-सेकंड अकेला + संयुक्त बारी", "10-ਸਕਿੰਟ ਇਕੱਲੀ + ਸਾਂਝੀ ਵਾਰੀ"],
  findCycleCountToReachSpecifiedFraction: ["10-सेकंड लक्ष्य ÷ चक्र-काम", "10-ਸਕਿੰਟ ਟੀਚਾ ÷ ਚੱਕਰ-ਕੰਮ"],
  findTimeFromArbitraryCyclePhase: ["10-सेकंड दिए क्रम से शुरू", "10-ਸਕਿੰਟ ਦਿੱਤੇ ਕ੍ਰਮ ਤੋਂ ਸ਼ੁਰੂ"],
  findExactBoundaryCompletion: ["10-सेकंड ठीक चक्र-सीमा", "10-ਸਕਿੰਟ ਠੀਕ ਚੱਕਰ-ਹੱਦ"],
  findCompletionWithinCycleSegment: ["10-सेकंड अंतिम खंड का भाग", "10-ਸਕਿੰਟ ਆਖ਼ਰੀ ਖੰਡ ਦਾ ਹਿੱਸਾ"],
  findOutputUnderPeriodicMachineSchedule: ["10-सेकंड दोहराया मशीन उत्पादन", "10-ਸਕਿੰਟ ਦੁਹਰਾਇਆ ਮਸ਼ੀਨ ਉਤਪਾਦਨ"],
  findRequiredCycleRateForDeadline: ["10-सेकंड समय-सीमा की अज्ञात दर", "10-ਸਕਿੰਟ ਸਮਾਂ-ਸੀਮਾ ਦੀ ਅਣਜਾਣ ਦਰ"],
};

export function tmwCp005LocalizedShortcut(
  mode: TmwCp005SolveMode,
  answerText: string,
  language: TmwLocalizedLanguage,
): { title: string; steps: string[] } {
  const steps: Record<TmwCp005SolveMode, [string, string]> = {
    findCompletionTimeForTwoAgentAlternationStartingA: [`A-फिर-B चक्र का काम निकालें, पूरे चक्र दोहराएँ और अंतिम बारी का आवश्यक भाग लें; कुल ${answerText}।`, `A-ਫਿਰ-B ਚੱਕਰ ਦਾ ਕੰਮ ਕੱਢੋ, ਪੂਰੇ ਚੱਕਰ ਦੁਹਰਾਓ ਅਤੇ ਆਖ਼ਰੀ ਵਾਰੀ ਦਾ ਲੋੜੀਂਦਾ ਹਿੱਸਾ ਲਵੋ; ਕੁੱਲ ${answerText}।`],
    findCompletionTimeForTwoAgentAlternationStartingB: [`B-फिर-A क्रम बनाए रखें, पूरे चक्र दोहराएँ और अंतिम अधूरी बारी निकालें; कुल ${answerText}।`, `B-ਫਿਰ-A ਕ੍ਰਮ ਬਣਾਈ ਰੱਖੋ, ਪੂਰੇ ਚੱਕਰ ਦੁਹਰਾਓ ਅਤੇ ਆਖ਼ਰੀ ਅਧੂਰੀ ਵਾਰੀ ਕੱਢੋ; ਕੁੱਲ ${answerText}।`],
    findCompletionTimeForMultiDayCycle: [`हर खंड का दर × अवधि जोड़कर एक चक्र का काम पाएँ; शेष खंड सहित कुल ${answerText}।`, `ਹਰ ਖੰਡ ਦਾ ਦਰ × ਮਿਆਦ ਜੋੜ ਕੇ ਇੱਕ ਚੱਕਰ ਦਾ ਕੰਮ ਲਵੋ; ਬਾਕੀ ਖੰਡ ਸਮੇਤ ਕੁੱਲ ${answerText}।`],
    findCompletionTimeForThreeAgentCycle: [`A, B और C की तीन बारियों को एक क्रमबद्ध चक्र मानें; अंतिम बारी सहित कुल ${answerText}।`, `A, B ਅਤੇ C ਦੀਆਂ ਤਿੰਨ ਵਾਰੀਆਂ ਨੂੰ ਇੱਕ ਕ੍ਰਮਬੱਧ ਚੱਕਰ ਮੰਨੋ; ਆਖ਼ਰੀ ਵਾਰੀ ਸਮੇਤ ਕੁੱਲ ${answerText}।`],
    findCompletionDayAndTerminalFraction: [`पूरी बारियों का समय गिनें और अंतिम शेष काम को अगली सक्रिय दर से भाग दें; सही समय ${answerText}।`, `ਪੂਰੀਆਂ ਵਾਰੀਆਂ ਦਾ ਸਮਾਂ ਗਿਣੋ ਅਤੇ ਆਖ਼ਰੀ ਬਾਕੀ ਕੰਮ ਨੂੰ ਅਗਲੀ ਸਰਗਰਮ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ; ਸਹੀ ਸਮਾਂ ${answerText}।`],
    findWorkAfterGivenNumberOfCycles: [`एक चक्र का काम × दिए पूरे चक्र = ${answerText}।`, `ਇੱਕ ਚੱਕਰ ਦਾ ਕੰਮ × ਦਿੱਤੇ ਪੂਰੇ ਚੱਕਰ = ${answerText}।`],
    findRemainingWorkAfterFullCycles: [`एक में से सभी पूरे चक्रों का काम घटाएँ; शेष ${answerText}।`, `ਇੱਕ ਵਿੱਚੋਂ ਸਾਰੇ ਪੂਰੇ ਚੱਕਰਾਂ ਦਾ ਕੰਮ ਘਟਾਓ; ਬਾਕੀ ${answerText}।`],
    findTerminalAgent: [`पूरे चक्रों के बाद बचा काम जिस अगली बारी में पूरा हो सके, वही अंतिम सक्रिय बारी है: ${answerText}।`, `ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ਬਚਿਆ ਕੰਮ ਜਿਸ ਅਗਲੀ ਵਾਰੀ ਵਿੱਚ ਪੂਰਾ ਹੋ ਸਕੇ, ਉਹੀ ਆਖ਼ਰੀ ਸਰਗਰਮ ਵਾਰੀ ਹੈ: ${answerText}।`],
    findStartingAgentFromCompletionCondition: [`दोनों संभावित शुरुआत चलाकर समय और अंतिम बारी दोनों मिलाएँ; सही शुरुआत ${answerText}।`, `ਦੋਵੇਂ ਸੰਭਾਵੀ ਸ਼ੁਰੂਆਤਾਂ ਚਲਾ ਕੇ ਸਮਾਂ ਅਤੇ ਆਖ਼ਰੀ ਵਾਰੀ ਦੋਵੇਂ ਮਿਲਾਓ; ਸਹੀ ਸ਼ੁਰੂਆਤ ${answerText}।`],
    findUnknownRateFromAlternatingCompletion: [`ज्ञात बारियों का काम घटाकर शेष को अज्ञात सक्रिय समय से भाग दें; दर ${answerText}।`, `ਜਾਣੀਆਂ ਵਾਰੀਆਂ ਦਾ ਕੰਮ ਘਟਾ ਕੇ ਬਾਕੀ ਨੂੰ ਅਣਜਾਣ ਸਰਗਰਮ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ; ਦਰ ${answerText}।`],
    findUnknownTimeFromAlternatingCompletion: [`पहले अज्ञात दर निकालें, फिर उसका उलटा लें; अकेला समय ${answerText}।`, `ਪਹਿਲਾਂ ਅਣਜਾਣ ਦਰ ਕੱਢੋ, ਫਿਰ ਉਸ ਦਾ ਉਲਟ ਲਵੋ; ਇਕੱਲਾ ਸਮਾਂ ${answerText}।`],
    findCompletionWhenHelperWorksEveryNthDay: [`k-दिन के चक्र में केवल kवें दिन सहायक की दर जोड़ें; कुल ${answerText}।`, `k-ਦਿਨਾਂ ਦੇ ਚੱਕਰ ਵਿੱਚ ਸਿਰਫ਼ kਵੇਂ ਦਿਨ ਮਦਦਗਾਰ ਦੀ ਦਰ ਜੋੜੋ; ਕੁੱਲ ${answerText}।`],
    findCompletionWhenAgentRestsEveryNthDay: [`विश्राम दिवस को समय में गिनें पर उसका काम शून्य रखें; कुल ${answerText}।`, `ਆਰਾਮ ਦੇ ਦਿਨ ਨੂੰ ਸਮੇਂ ਵਿੱਚ ਗਿਣੋ ਪਰ ਉਸ ਦਾ ਕੰਮ ਸਿਫ਼ਰ ਰੱਖੋ; ਕੁੱਲ ${answerText}।`],
    findCompletionWithWeekendOrHolidayPattern: [`पाँच काम वाले और दो शून्य-काम दिनों का कैलेंडर चक्र दोहराएँ; बीता समय ${answerText}।`, `ਪੰਜ ਕੰਮ ਵਾਲੇ ਅਤੇ ਦੋ ਸਿਫ਼ਰ-ਕੰਮ ਦਿਨਾਂ ਦਾ ਕੈਲੰਡਰ ਚੱਕਰ ਦੁਹਰਾਓ; ਬੀਤਿਆ ਸਮਾਂ ${answerText}।`],
    findCompletionWithUnequalShiftDurations: [`हर दर को उसकी अपनी पाली-अवधि से गुणा करें; अंतिम आंशिक पाली सहित ${answerText}।`, `ਹਰ ਦਰ ਨੂੰ ਉਸ ਦੀ ਆਪਣੀ ਸ਼ਿਫ਼ਟ ਮਿਆਦ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਆਖ਼ਰੀ ਅੰਸ਼ਿਕ ਸ਼ਿਫ਼ਟ ਸਮੇਤ ${answerText}।`],
    findCompletionWithTwoDaysOnOneDayOffPattern: [`दो उत्पादक दिन और एक शून्य-काम दिन का चक्र दोहराएँ; कुल ${answerText}।`, `ਦੋ ਉਤਪਾਦਕ ਦਿਨ ਅਤੇ ਇੱਕ ਸਿਫ਼ਰ-ਕੰਮ ਦਿਨ ਦਾ ਚੱਕਰ ਦੁਹਰਾਓ; ਕੁੱਲ ${answerText}।`],
    findCompletionWithPeriodicNegativeWork: [`दो सकारात्मक दिनों का काम जोड़ें, नुकसान वाले दिन का काम घटाएँ और शुद्ध चक्र दोहराएँ; कुल ${answerText}।`, `ਦੋ ਸਕਾਰਾਤਮਕ ਦਿਨਾਂ ਦਾ ਕੰਮ ਜੋੜੋ, ਨੁਕਸਾਨ ਵਾਲੇ ਦਿਨ ਦਾ ਕੰਮ ਘਟਾਓ ਅਤੇ ਸ਼ੁੱਧ ਚੱਕਰ ਦੁਹਰਾਓ; ਕੁੱਲ ${answerText}।`],
    findCompletionWithRepeatedJoinLeaveCycle: [`अकेली बारी और संयुक्त बारी का काम जोड़कर एक चक्र बनाएँ; कुल ${answerText}।`, `ਇਕੱਲੀ ਵਾਰੀ ਅਤੇ ਸਾਂਝੀ ਵਾਰੀ ਦਾ ਕੰਮ ਜੋੜ ਕੇ ਇੱਕ ਚੱਕਰ ਬਣਾਓ; ਕੁੱਲ ${answerText}।`],
    findCycleCountToReachSpecifiedFraction: [`लक्षित भाग को एक चक्र के काम से भाग दें; आवश्यक संख्या ${answerText}।`, `ਟੀਚੇ ਵਾਲੇ ਹਿੱਸੇ ਨੂੰ ਇੱਕ ਚੱਕਰ ਦੇ ਕੰਮ ਨਾਲ ਭਾਗ ਦਿਓ; ਲੋੜੀਂਦੀ ਗਿਣਤੀ ${answerText}।`],
    findTimeFromArbitraryCyclePhase: [`सामान्य पहले सदस्य से नहीं, प्रश्न में दी गई बारी से चक्र चलाएँ; कुल ${answerText}।`, `ਆਮ ਪਹਿਲੇ ਮੈਂਬਰ ਤੋਂ ਨਹੀਂ, ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਵਾਰੀ ਤੋਂ ਚੱਕਰ ਚਲਾਓ; ਕੁੱਲ ${answerText}।`],
    findExactBoundaryCompletion: [`कुल काम ÷ एक चक्र का काम × चक्र की अवधि; सीमा-समय ${answerText}।`, `ਕੁੱਲ ਕੰਮ ÷ ਇੱਕ ਚੱਕਰ ਦਾ ਕੰਮ × ਚੱਕਰ ਦੀ ਮਿਆਦ; ਹੱਦ-ਸਮਾਂ ${answerText}।`],
    findCompletionWithinCycleSegment: [`पूरे चक्रों के बाद अंतिम खंडों में क्रम से बढ़ें और आखिरी शेष को सक्रिय दर से भाग दें; ${answerText}।`, `ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ਆਖ਼ਰੀ ਖੰਡਾਂ ਵਿੱਚ ਕ੍ਰਮ ਨਾਲ ਵਧੋ ਅਤੇ ਆਖ਼ਰੀ ਬਾਕੀ ਨੂੰ ਸਰਗਰਮ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ; ${answerText}।`],
    findOutputUnderPeriodicMachineSchedule: [`एक चक्र में दोनों मशीनों का दर × समय जोड़ें और दोहरावों से गुणा करें; उत्पादन ${answerText}।`, `ਇੱਕ ਚੱਕਰ ਵਿੱਚ ਦੋਵਾਂ ਮਸ਼ੀਨਾਂ ਦਾ ਦਰ × ਸਮਾਂ ਜੋੜੋ ਅਤੇ ਦੁਹਰਾਵਾਂ ਨਾਲ ਗੁਣਾ ਕਰੋ; ਉਤਪਾਦਨ ${answerText}।`],
    findRequiredCycleRateForDeadline: [`समय-सीमा में अज्ञात बारी की कुल अवधि गिनें, ज्ञात काम घटाएँ और भाग दें; दर ${answerText}।`, `ਸਮਾਂ-ਸੀਮਾ ਵਿੱਚ ਅਣਜਾਣ ਵਾਰੀ ਦੀ ਕੁੱਲ ਮਿਆਦ ਗਿਣੋ, ਜਾਣਿਆ ਕੰਮ ਘਟਾਓ ਅਤੇ ਭਾਗ ਦਿਓ; ਦਰ ${answerText}।`],
  };
  return { title: shortcutTitle[mode][language === "hi" ? 0 : 1], steps: [steps[mode][language === "hi" ? 0 : 1]] };
}

export function tmwCp005LocalizedTrapReason(
  id: Exclude<TmwCp005MisconceptionId, "CORRECT">,
  language: TmwLocalizedLanguage,
): string {
  const reasons: Record<Exclude<TmwCp005MisconceptionId, "CORRECT">, [string, string]> = {
    WRONG_STARTING_AGENT: ["इस विकल्प में पहली बारी उलट दी गई है।", "ਇਸ ਚੋਣ ਵਿੱਚ ਪਹਿਲੀ ਵਾਰੀ ਉਲਟ ਦਿੱਤੀ ਗਈ ਹੈ।"],
    FULL_FINAL_SEGMENT_ASSUMED: ["अंतिम बारी का केवल एक भाग चाहिए, पर इस विकल्प में पूरी बारी जोड़ दी गई है।", "ਆਖ਼ਰੀ ਵਾਰੀ ਦਾ ਸਿਰਫ਼ ਇੱਕ ਹਿੱਸਾ ਚਾਹੀਦਾ ਹੈ, ਪਰ ਇਸ ਚੋਣ ਵਿੱਚ ਪੂਰੀ ਵਾਰੀ ਜੋੜ ਦਿੱਤੀ ਗਈ ਹੈ।"],
    PARTIAL_SEGMENT_IGNORED: ["यह पूरे चक्रों पर रुक जाता है और अंतिम अधूरी बारी छोड़ देता है।", "ਇਹ ਪੂਰੇ ਚੱਕਰਾਂ ਉੱਤੇ ਰੁਕ ਜਾਂਦਾ ਹੈ ਅਤੇ ਆਖ਼ਰੀ ਅਧੂਰੀ ਵਾਰੀ ਛੱਡ ਦਿੰਦਾ ਹੈ।"],
    FINAL_CYCLE_OMITTED: ["यह अंतिम पूरा होने वाले चक्र को गिनती या उत्पादन में शामिल नहीं करता।", "ਇਹ ਆਖ਼ਰੀ ਪੂਰਾ ਹੋਣ ਵਾਲੇ ਚੱਕਰ ਨੂੰ ਗਿਣਤੀ ਜਾਂ ਉਤਪਾਦਨ ਵਿੱਚ ਸ਼ਾਮਲ ਨਹੀਂ ਕਰਦਾ।"],
    CYCLE_WORK_TREATED_AS_DAILY: ["एक पूरे चक्र के काम को हर एक दिन का काम मान लिया गया है।", "ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦੇ ਕੰਮ ਨੂੰ ਹਰ ਇੱਕ ਦਿਨ ਦਾ ਕੰਮ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।"],
    CYCLE_LENGTH_CONFUSED: ["चक्रों की संख्या को बारियों या कैलेंडर इकाइयों की संख्या समझ लिया गया है।", "ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਵਾਰੀਆਂ ਜਾਂ ਕੈਲੰਡਰ ਇਕਾਈਆਂ ਦੀ ਗਿਣਤੀ ਸਮਝ ਲਿਆ ਗਿਆ ਹੈ।"],
    REST_DAY_TREATED_AS_WORK: ["विश्राम दिवस पर भी उत्पादक काम जोड़ दिया गया है, जबकि उस दिन काम शून्य है।", "ਆਰਾਮ ਦੇ ਦਿਨ ਉੱਤੇ ਵੀ ਉਤਪਾਦਕ ਕੰਮ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਜਦਕਿ ਉਸ ਦਿਨ ਕੰਮ ਸਿਫ਼ਰ ਹੈ।"],
    NEGATIVE_RATE_ADDED: ["काम बिगाड़ने वाली दर को घटाने के बजाय जोड़ दिया गया है।", "ਕੰਮ ਖਰਾਬ ਕਰਨ ਵਾਲੀ ਦਰ ਨੂੰ ਘਟਾਉਣ ਦੀ ਥਾਂ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
    NEGATIVE_RATE_OMITTED: ["नुकसान वाली बारी में घटा काम छोड़ दिया गया है।", "ਨੁਕਸਾਨ ਵਾਲੀ ਵਾਰੀ ਵਿੱਚ ਘਟਿਆ ਕੰਮ ਛੱਡ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
    TERMINAL_AGENT_OFF_BY_ONE: ["यह वास्तविक पूरा होने वाली बारी से एक बारी पहले या बाद का सदस्य चुनता है।", "ਇਹ ਅਸਲ ਪੂਰਾ ਹੋਣ ਵਾਲੀ ਵਾਰੀ ਤੋਂ ਇੱਕ ਵਾਰੀ ਪਹਿਲਾਂ ਜਾਂ ਬਾਅਦ ਦਾ ਮੈਂਬਰ ਚੁਣਦਾ ਹੈ।"],
    RECIPROCAL_NOT_TAKEN: ["प्रश्न अकेला समय पूछता है, लेकिन इस विकल्प में दर को ही समय मान लिया गया है।", "ਪ੍ਰਸ਼ਨ ਇਕੱਲਾ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ, ਪਰ ਇਸ ਚੋਣ ਵਿੱਚ ਦਰ ਨੂੰ ਹੀ ਸਮਾਂ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।"],
    KNOWN_RATE_REUSED: ["अज्ञात बारी की दर निकालने के बजाय ज्ञात दर को दोहरा दिया गया है।", "ਅਣਜਾਣ ਵਾਰੀ ਦੀ ਦਰ ਕੱਢਣ ਦੀ ਥਾਂ ਜਾਣੀ ਦਰ ਨੂੰ ਦੁਹਰਾ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
    TARGET_FRACTION_COMPLEMENT: ["माँगे गए पूरे या शेष भाग के बजाय उसका पूरक लिया गया है।", "ਮੰਗੇ ਗਏ ਪੂਰੇ ਜਾਂ ਬਾਕੀ ਹਿੱਸੇ ਦੀ ਥਾਂ ਉਸ ਦਾ ਪੂਰਕ ਲਿਆ ਗਿਆ ਹੈ।"],
    FULL_CYCLE_ROUNDED_DOWN: ["ठीक लक्ष्य तक पहुँचने से पहले चक्रों की संख्या नीचे पूर्णांक कर दी गई है।", "ਠੀਕ ਟੀਚੇ ਤੱਕ ਪਹੁੰਚਣ ਤੋਂ ਪਹਿਲਾਂ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਹੇਠਾਂ ਪੂਰਨ ਅੰਕ ਕਰ ਦਿੱਤੀ ਗਈ ਹੈ।"],
    FULL_CYCLE_ROUNDED_UP: ["लक्ष्य पहले ही चक्र-सीमा पर मिल जाता है, फिर भी एक अतिरिक्त चक्र जोड़ दिया गया है।", "ਟੀਚਾ ਪਹਿਲਾਂ ਹੀ ਚੱਕਰ-ਹੱਦ ਉੱਤੇ ਮਿਲ ਜਾਂਦਾ ਹੈ, ਫਿਰ ਵੀ ਇੱਕ ਵਾਧੂ ਚੱਕਰ ਜੋੜ ਦਿੱਤਾ ਗਿਆ ਹੈ।"],
    SHIFT_DURATION_IGNORED: ["असमान पालियों की वास्तविक अवधि से दरों को गुणा नहीं किया गया है।", "ਅਸਮਾਨ ਸ਼ਿਫ਼ਟਾਂ ਦੀ ਅਸਲ ਮਿਆਦ ਨਾਲ ਦਰਾਂ ਨੂੰ ਗੁਣਾ ਨਹੀਂ ਕੀਤਾ ਗਿਆ ਹੈ।"],
    OFFSET_IGNORED: ["प्रश्न में दी गई शुरुआती बारी छोड़कर सामान्य पहली बारी से चक्र शुरू किया गया है।", "ਪ੍ਰਸ਼ਨ ਵਿੱਚ ਦਿੱਤੀ ਸ਼ੁਰੂਆਤੀ ਵਾਰੀ ਛੱਡ ਕੇ ਆਮ ਪਹਿਲੀ ਵਾਰੀ ਤੋਂ ਚੱਕਰ ਸ਼ੁਰੂ ਕੀਤਾ ਗਿਆ ਹੈ।"],
    DEADLINE_TREATED_AS_CYCLE_COUNT: ["समय-सीमा को उपलब्ध समय मानने के बजाय चक्रों की संख्या मान लिया गया है।", "ਸਮਾਂ-ਸੀਮਾ ਨੂੰ ਉਪਲਬਧ ਸਮਾਂ ਮੰਨਣ ਦੀ ਥਾਂ ਚੱਕਰਾਂ ਦੀ ਗਿਣਤੀ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ।"],
    PLAUSIBLE_SCALE_ERROR: ["यह संख्या पास दिखाई देती है, पर सही क्रमबद्ध चक्र को दोहराने पर नहीं मिलती।", "ਇਹ ਗਿਣਤੀ ਨੇੜੇ ਦਿਖਾਈ ਦਿੰਦੀ ਹੈ, ਪਰ ਸਹੀ ਕ੍ਰਮਬੱਧ ਚੱਕਰ ਦੁਹਰਾਉਣ ਉੱਤੇ ਨਹੀਂ ਮਿਲਦੀ।"],
  };
  return reasons[id][language === "hi" ? 0 : 1];
}

export function tmwCp005LocalizedConclusion(
  source: TmwCp005GeneratedQuestion,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const B = cp005Actor(p, language, "actorB");
  const job = cp005Job(p, language);
  switch (source.solveMode) {
    case "findTerminalAgent":
      return cp005Copy(language, `अतः काम पूरा होते समय ${answerText} की बारी सक्रिय है।`, `ਇਸ ਲਈ ਕੰਮ ਪੂਰਾ ਹੋਣ ਵੇਲੇ ${answerText} ਦੀ ਵਾਰੀ ਸਰਗਰਮ ਹੈ।`);
    case "findStartingAgentFromCompletionCondition":
      return cp005Copy(language, `अतः दी गई समाप्ति-शर्त तभी मिलती है जब पहली बारी ${answerText} की हो।`, `ਇਸ ਲਈ ਦਿੱਤੀ ਸਮਾਪਤੀ-ਸ਼ਰਤ ਤਦੋਂ ਹੀ ਮਿਲਦੀ ਹੈ ਜਦੋਂ ਪਹਿਲੀ ਵਾਰੀ ${answerText} ਦੀ ਹੋਵੇ।`);
    case "findUnknownRateFromAlternatingCompletion":
      return cp005Copy(language, `अतः ${B} की आवश्यक दर ${answerText} है।`, `ਇਸ ਲਈ ${B} ਦੀ ਲੋੜੀਂਦੀ ਦਰ ${answerText} ਹੈ।`);
    case "findUnknownTimeFromAlternatingCompletion":
      return cp005Copy(language, `अतः ${B} अकेले पूरा काम ${answerText} में करेगा।`, `ਇਸ ਲਈ ${B} ਇਕੱਲਾ ਸਾਰਾ ਕੰਮ ${answerText} ਵਿੱਚ ਕਰੇਗਾ।`);
    case "findCycleCountToReachSpecifiedFraction":
      return cp005Copy(language, `अतः लक्षित भाग ${answerText} के बाद मिलता है।`, `ਇਸ ਲਈ ਟੀਚੇ ਵਾਲਾ ਹਿੱਸਾ ${answerText} ਤੋਂ ਬਾਅਦ ਮਿਲਦਾ ਹੈ।`);
    case "findOutputUnderPeriodicMachineSchedule":
      return cp005Copy(language, `अतः दोहराया मशीन-चक्र कुल ${answerText} बनाता है।`, `ਇਸ ਲਈ ਦੁਹਰਾਇਆ ਮਸ਼ੀਨ-ਚੱਕਰ ਕੁੱਲ ${answerText} ਬਣਾਉਂਦਾ ਹੈ।`);
    case "findRequiredCycleRateForDeadline":
      return cp005Copy(language, `अतः हर निर्धारित बारी में ${B} को ${answerText} की दर बनाए रखनी होगी।`, `ਇਸ ਲਈ ਹਰ ਨਿਰਧਾਰਤ ਵਾਰੀ ਵਿੱਚ ${B} ਨੂੰ ${answerText} ਦੀ ਦਰ ਬਣਾਈ ਰੱਖਣੀ ਪਵੇਗੀ।`);
    case "findWorkAfterGivenNumberOfCycles":
      return cp005Copy(language, `अतः दिए पूरे चक्रों के बाद ${answerText} पूरा हो चुका है।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ${answerText} ਪੂਰਾ ਹੋ ਚੁੱਕਾ ਹੈ।`);
    case "findRemainingWorkAfterFullCycles":
      return cp005Copy(language, `अतः दिए पूरे चक्रों के बाद ${answerText} बाकी है।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ${answerText} ਬਾਕੀ ਹੈ।`);
    default:
      return cp005Copy(language, `अतः ${job} ${answerText} में पूरा होगा।`, `ਇਸ ਲਈ ${job} ${answerText} ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ।`);
  }
}
