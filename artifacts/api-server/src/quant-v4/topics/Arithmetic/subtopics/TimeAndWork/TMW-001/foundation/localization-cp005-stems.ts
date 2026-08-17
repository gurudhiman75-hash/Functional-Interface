import { required } from "./cp001-helpers";
import { compare, rational } from "./rational";
import type { TmwCp005GeneratedQuestion, TmwCp005Segment } from "./cp005-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp005Actor,
  cp005Copy,
  cp005Hours,
  cp005HoursIn,
  cp005Job,
  cp005Label,
  cp005MathValue,
  cp005Ordinal,
  cp005OutputNoun,
  cp005Time,
  cp005TimeIn,
  cp005WorkRate,
} from "./localization-cp005-language";

function segmentSummary(
  source: TmwCp005GeneratedQuestion,
  segment: TmwCp005Segment,
  language: TmwLocalizedLanguage,
): string {
  const label = cp005Label(segment.label, source.parameters, language);
  const duration = source.parameters.timeUnit === "hour"
    ? cp005Hours(segment.duration, language)
    : cp005Time(source.parameters, segment.duration, language);
  if (segment.rate.numerator === 0) {
    return cp005Copy(language, `${duration} तक कोई काम नहीं होता`, `${duration} ਲਈ ਕੋਈ ਕੰਮ ਨਹੀਂ ਹੁੰਦਾ`);
  }
  if (compare(segment.rate, rational(0)) < 0) {
    return cp005Copy(language, `${duration} तक ${label} से पूरा हुआ काम घटता है`, `${duration} ਲਈ ${label} ਨਾਲ ਪੂਰਾ ਹੋਇਆ ਕੰਮ ਘਟਦਾ ਹੈ`);
  }
  return cp005Copy(language, `${duration} तक काम ${label} से होता है`, `${duration} ਲਈ ਕੰਮ ${label} ਨਾਲ ਹੁੰਦਾ ਹੈ`);
}

function cycleSummary(source: TmwCp005GeneratedQuestion, language: TmwLocalizedLanguage): string {
  return source.parameters.cycle.map((segment) => segmentSummary(source, segment, language)).join(cp005Copy(language, "; फिर ", "; ਫਿਰ "));
}

function soloSentence(
  job: string,
  actor: string,
  time: string,
  language: TmwLocalizedLanguage,
): string {
  return cp005Copy(
    language,
    `${job} अकेले पूरा करने में ${actor} को ${time} लगते हैं।`,
    `${job} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${actor} ਨੂੰ ${time} ਲੱਗਦੇ ਹਨ।`,
  );
}

export function renderTmwCp005LocalizedStem(
  source: TmwCp005GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const A = cp005Actor(p, language, "actorA");
  const B = cp005Actor(p, language, "actorB");
  const C = cp005Actor(p, language, "actorC");
  const job = cp005Job(p, language);
  const timeA = () => cp005Time(p, required(p.timeA, "timeA"), language);
  const timeB = () => cp005Time(p, required(p.timeB, "timeB"), language);
  const timeC = () => cp005Time(p, required(p.timeC, "timeC"), language);

  switch (source.solveMode) {
    case "findCompletionTimeForTwoAgentAlternationStartingA":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। दोनों एक-एक दिन बारी-बारी काम करते हैं और पहली बारी ${A} की है। काम कुल कितने समय में पूरा होगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ। ਕੰਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionTimeForTwoAgentAlternationStartingB":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। दोनों एक-एक दिन बारी-बारी काम करते हैं और पहली बारी ${B} की है। काम कुल कितने समय में पूरा होगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਪਹਿਲੀ ਵਾਰੀ ${B} ਦੀ ਹੈ। ਕੰਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionTimeForMultiDayCycle":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। दोहराया जाने वाला चक्र है: ${cycleSummary(source, language)}। काम कुल कितने समय में पूरा होगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੁਹਰਾਇਆ ਜਾਣ ਵਾਲਾ ਚੱਕਰ ਹੈ: ${cycleSummary(source, language)}। ਕੰਮ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionTimeForThreeAgentCycle":
      return cp005Copy(
        language,
        `${job} अकेले पूरा करने में ${A}, ${B} और ${C} को क्रमशः ${timeA()}, ${timeB()} और ${timeC()} लगते हैं। हर बारी एक दिन की है और क्रम ${A}, फिर ${B}, फिर ${C} है। यह क्रम दोहराया जाता है। कुल समय ज्ञात कीजिए।`,
        `${job} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A}, ${B} ਅਤੇ ${C} ਨੂੰ ਕ੍ਰਮਵਾਰ ${timeA()}, ${timeB()} ਅਤੇ ${timeC()} ਲੱਗਦੇ ਹਨ। ਹਰ ਵਾਰੀ ਇੱਕ ਦਿਨ ਦੀ ਹੈ ਅਤੇ ਕ੍ਰਮ ${A}, ਫਿਰ ${B}, ਫਿਰ ${C} ਹੈ। ਇਹ ਕ੍ਰਮ ਦੁਹਰਾਇਆ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findCompletionDayAndTerminalFraction":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। दोनों एक-एक दिन बारी-बारी काम करते हैं और पहली बारी ${A} की है। काम कितने पूरे दिनों और अगली बारी के कितने भाग में पूरा होगा? कुल सही समय बताइए।`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ। ਕੰਮ ਕਿੰਨੇ ਪੂਰੇ ਦਿਨਾਂ ਅਤੇ ਅਗਲੀ ਵਾਰੀ ਦੇ ਕਿੰਨੇ ਹਿੱਸੇ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ? ਕੁੱਲ ਸਹੀ ਸਮਾਂ ਦੱਸੋ।`,
      );
    case "findWorkAfterGivenNumberOfCycles":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। पहली बारी ${A} की है और दोनों एक-एक दिन बारी-बारी काम करते हैं। ${required(p.givenCycles, "givenCycles")} पूरे चक्रों के बाद काम का कितना भाग पूरा होगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ ਅਤੇ ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ। ${required(p.givenCycles, "givenCycles")} ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findRemainingWorkAfterFullCycles":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। पहली बारी ${A} की है। ${required(p.givenCycles, "givenCycles")} पूरे चक्रों के बाद काम का कितना भाग बाकी रहेगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ। ${required(p.givenCycles, "givenCycles")} ਪੂਰੇ ਚੱਕਰਾਂ ਤੋਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ?`,
      );
    case "findTerminalAgent":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। पहली बारी ${A} की है और दोनों एक-एक दिन बारी-बारी काम करते हैं। काम पूरा होते समय किसकी बारी होगी?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ ਅਤੇ ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੰਮ ਪੂਰਾ ਹੋਣ ਵੇਲੇ ਕਿਸ ਦੀ ਵਾਰੀ ਹੋਵੇਗੀ?`,
      );
    case "findStartingAgentFromCompletionCondition": {
      const terminal = cp005Label(required(p.knownTerminalLabel, "knownTerminalLabel"), p, language);
      const knownTime = cp005TimeIn(p, required(p.knownCompletionTime, "knownCompletionTime"), language);
      return cp005Copy(
        language,
        `${job} अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोनों एक-एक दिन बारी-बारी काम करते हैं। काम ${knownTime} पूरा होता है और अंतिम बारी ${terminal} की होती है। पहली बारी किसकी थी?`,
        `${job} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੰਮ ${knownTime} ਪੂਰਾ ਹੁੰਦਾ ਹੈ ਅਤੇ ਆਖ਼ਰੀ ਵਾਰੀ ${terminal} ਦੀ ਹੁੰਦੀ ਹੈ। ਪਹਿਲੀ ਵਾਰੀ ਕਿਸ ਦੀ ਸੀ?`,
      );
    }
    case "findUnknownRateFromAlternatingCompletion":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${A} और ${B} एक-एक दिन बारी-बारी काम करते हैं और पहली बारी ${A} की है। काम ${cp005TimeIn(p, required(p.knownCompletionTime, "knownCompletionTime"), language)} पूरा होता है। ${B} की दैनिक कार्य-दर ज्ञात कीजिए।`,
        `${soloSentence(job, A, timeA(), language)} ${A} ਅਤੇ ${B} ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ। ਕੰਮ ${cp005TimeIn(p, required(p.knownCompletionTime, "knownCompletionTime"), language)} ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${B} ਦੀ ਰੋਜ਼ਾਨਾ ਕੰਮ-ਦਰ ਕੱਢੋ।`,
      );
    case "findUnknownTimeFromAlternatingCompletion":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${A} और ${B} एक-एक दिन बारी-बारी काम करते हैं और पहली बारी ${A} की है। काम ${cp005TimeIn(p, required(p.knownCompletionTime, "knownCompletionTime"), language)} पूरा होता है। ${B} अकेले पूरा काम कितने समय में करेगा?`,
        `${soloSentence(job, A, timeA(), language)} ${A} ਅਤੇ ${B} ਇੱਕ-ਇੱਕ ਦਿਨ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ। ਕੰਮ ${cp005TimeIn(p, required(p.knownCompletionTime, "knownCompletionTime"), language)} ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${B} ਇਕੱਲਾ ਸਾਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕਰੇਗਾ?`,
      );
    case "findCompletionWhenHelperWorksEveryNthDay":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। हर दिन काम ${A} से होता है और हर ${cp005Ordinal(required(p.patternNumber, "patternNumber"), language)} दिन ${B} भी साथ काम करता है। कुल समय कितना होगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਹਰ ਦਿਨ ਕੰਮ ${A} ਨਾਲ ਹੁੰਦਾ ਹੈ ਅਤੇ ਹਰ ${cp005Ordinal(required(p.patternNumber, "patternNumber"), language)} ਦਿਨ ${B} ਵੀ ਨਾਲ ਕੰਮ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionWhenAgentRestsEveryNthDay":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} सामान्यतः हर दिन काम होता है, पर हर ${cp005Ordinal(required(p.patternNumber, "patternNumber"), language)} दिन विश्राम रहता है। कुल बीता समय कितना होगा?`,
        `${soloSentence(job, A, timeA(), language)} ਆਮ ਤੌਰ ਉੱਤੇ ਹਰ ਦਿਨ ਕੰਮ ਹੁੰਦਾ ਹੈ, ਪਰ ਹਰ ${cp005Ordinal(required(p.patternNumber, "patternNumber"), language)} ਦਿਨ ਆਰਾਮ ਰਹਿੰਦਾ ਹੈ। ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionWithWeekendOrHolidayPattern":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} सोमवार से शुक्रवार तक काम होता है और शनिवार-रविवार को कोई काम नहीं होता। शुरुआत सोमवार से होती है। कुल बीता समय ज्ञात कीजिए।`,
        `${soloSentence(job, A, timeA(), language)} ਸੋਮਵਾਰ ਤੋਂ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਕੰਮ ਹੁੰਦਾ ਹੈ ਅਤੇ ਸ਼ਨੀਵਾਰ-ਐਤਵਾਰ ਨੂੰ ਕੋਈ ਕੰਮ ਨਹੀਂ ਹੁੰਦਾ। ਸ਼ੁਰੂਆਤ ਸੋਮਵਾਰ ਤੋਂ ਹੁੰਦੀ ਹੈ। ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findCompletionWithUnequalShiftDurations":
      return cp005Copy(
        language,
        `${job} अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${cp005Hours(required(p.timeB, "timeB"), language)} लगते हैं। असमान पालियों का दोहराया क्रम है: ${cycleSummary(source, language)}। सही कुल समय ज्ञात कीजिए।`,
        `${job} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${cp005Hours(required(p.timeB, "timeB"), language)} ਲੱਗਦੇ ਹਨ। ਅਸਮਾਨ ਸ਼ਿਫ਼ਟਾਂ ਦਾ ਦੁਹਰਾਇਆ ਕ੍ਰਮ ਹੈ: ${cycleSummary(source, language)}। ਸਹੀ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findCompletionWithTwoDaysOnOneDayOffPattern":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} दो काम वाले दिन और फिर एक विश्राम दिवस का चक्र लगातार दोहरता है। कुल बीता समय कितना होगा?`,
        `${soloSentence(job, A, timeA(), language)} ਦੋ ਕੰਮ ਵਾਲੇ ਦਿਨ ਅਤੇ ਫਿਰ ਇੱਕ ਆਰਾਮ ਦਾ ਦਿਨ ਵਾਲਾ ਚੱਕਰ ਲਗਾਤਾਰ ਦੁਹਰਦਾ ਹੈ। ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionWithPeriodicNegativeWork":
      return cp005Copy(
        language,
        `${job} अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं, जबकि एक हानिकारक प्रक्रिया पूरे काम को ${timeC()} में बिगाड़ सकती है। पहले दो दिन ${A} और ${B} साथ काम करते हैं, फिर एक दिन हानिकारक प्रक्रिया से पूरा हुआ काम घटता है। यह तीन-दिन का चक्र दोहरता है। कुल समय कितना होगा?`,
        `${job} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ, ਜਦਕਿ ਇੱਕ ਨੁਕਸਾਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਸਾਰੇ ਕੰਮ ਨੂੰ ${timeC()} ਵਿੱਚ ਖਰਾਬ ਕਰ ਸਕਦੀ ਹੈ। ਪਹਿਲੇ ਦੋ ਦਿਨ ${A} ਅਤੇ ${B} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ, ਫਿਰ ਇੱਕ ਦਿਨ ਨੁਕਸਾਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਨਾਲ ਪੂਰਾ ਹੋਇਆ ਕੰਮ ਘਟਦਾ ਹੈ। ਇਹ ਤਿੰਨ-ਦਿਨਾਂ ਦਾ ਚੱਕਰ ਦੁਹਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionWithRepeatedJoinLeaveCycle":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। एक दिन काम केवल ${A} से होता है और अगले दिन दोनों साथ काम करते हैं। यह दो-दिन का चक्र दोहरता है। कुल समय कितना होगा?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਇੱਕ ਦਿਨ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦਾ ਹੈ ਅਤੇ ਅਗਲੇ ਦਿਨ ਦੋਵੇਂ ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਇਹ ਦੋ-ਦਿਨਾਂ ਦਾ ਚੱਕਰ ਦੁਹਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findCycleCountToReachSpecifiedFraction":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। पहली बारी ${A} की है और दोनों बारी-बारी काम करते हैं। काम का ठीक ${cp005MathValue(required(p.targetWork, "targetWork"))} भाग पूरा करने के लिए कितने पूरे चक्र चाहिए?`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ ਅਤੇ ਦੋਵੇਂ ਵਾਰੀ-ਵਾਰੀ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੰਮ ਦਾ ਠੀਕ ${cp005MathValue(required(p.targetWork, "targetWork"))} ਹਿੱਸਾ ਪੂਰਾ ਕਰਨ ਲਈ ਕਿੰਨੇ ਪੂਰੇ ਚੱਕਰ ਚਾਹੀਦੇ ਹਨ?`,
      );
    case "findTimeFromArbitraryCyclePhase":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। सामान्य क्रम ${A}, फिर ${B} है, लेकिन इस बार पहली बारी ${B} की है और इसके बाद वही क्रम दोहरता है। कुल समय ज्ञात कीजिए।`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਆਮ ਕ੍ਰਮ ${A}, ਫਿਰ ${B} ਹੈ, ਪਰ ਇਸ ਵਾਰ ਪਹਿਲੀ ਵਾਰੀ ${B} ਦੀ ਹੈ ਅਤੇ ਇਸ ਤੋਂ ਬਾਅਦ ਉਹੀ ਕ੍ਰਮ ਦੁਹਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findExactBoundaryCompletion":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} ${B} को वही काम अकेले पूरा करने में ${timeB()} लगते हैं। पहली बारी ${A} की है। काम ठीक एक पूरे चक्र की सीमा पर समाप्त होता है। कुल समय ज्ञात कीजिए।`,
        `${soloSentence(job, A, timeA(), language)} ${B} ਨੂੰ ਉਹੀ ਕੰਮ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${timeB()} ਲੱਗਦੇ ਹਨ। ਪਹਿਲੀ ਵਾਰੀ ${A} ਦੀ ਹੈ। ਕੰਮ ਠੀਕ ਇੱਕ ਪੂਰੇ ਚੱਕਰ ਦੀ ਹੱਦ ਉੱਤੇ ਮੁਕੰਮਲ ਹੁੰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findCompletionWithinCycleSegment":
      return cp005Copy(
        language,
        `${job} अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोहराए जाने वाले खंड हैं: ${cycleSummary(source, language)}। अंतिम खंड के आवश्यक भाग सहित सही कुल समय ज्ञात कीजिए।`,
        `${job} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੁਹਰਾਏ ਜਾਣ ਵਾਲੇ ਖੰਡ ਹਨ: ${cycleSummary(source, language)}। ਆਖ਼ਰੀ ਖੰਡ ਦੇ ਲੋੜੀਂਦੇ ਹਿੱਸੇ ਸਮੇਤ ਸਹੀ ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findOutputUnderPeriodicMachineSchedule": {
      const first = p.cycle[0];
      const second = p.cycle[1];
      const firstLabel = cp005Label(first.label, p, language);
      const secondLabel = cp005Label(second.label, p, language);
      const output = cp005OutputNoun(p, language);
      return cp005Copy(
        language,
        `${firstLabel} प्रति घंटा ${cp005MathValue(first.rate)} ${output} बनाती है और ${cp005Hours(first.duration, language)} चलती है। इसके बाद ${secondLabel} प्रति घंटा ${cp005MathValue(second.rate)} ${output} बनाती है और ${cp005Hours(second.duration, language)} चलती है। यह चक्र ${required(p.givenCycles, "givenCycles")} बार दोहरता है। कुल उत्पादन कितना होगा?`,
        `${firstLabel} ਪ੍ਰਤੀ ਘੰਟਾ ${cp005MathValue(first.rate)} ${output} ਬਣਾਉਂਦੀ ਹੈ ਅਤੇ ${cp005Hours(first.duration, language)} ਚੱਲਦੀ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ${secondLabel} ਪ੍ਰਤੀ ਘੰਟਾ ${cp005MathValue(second.rate)} ${output} ਬਣਾਉਂਦੀ ਹੈ ਅਤੇ ${cp005Hours(second.duration, language)} ਚੱਲਦੀ ਹੈ। ਇਹ ਚੱਕਰ ${required(p.givenCycles, "givenCycles")} ਵਾਰ ਦੁਹਰਦਾ ਹੈ। ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    }
    case "findRequiredCycleRateForDeadline":
      return cp005Copy(
        language,
        `${soloSentence(job, A, timeA(), language)} दो-दिन का चक्र दोहरता है: पहले दिन काम ${A} से और दूसरे दिन ${B} से होता है। काम को ठीक ${cp005TimeIn(p, required(p.deadline, "deadline"), language)} पूरा करने के लिए ${B} की आवश्यक दर क्या है?`,
        `${soloSentence(job, A, timeA(), language)} ਦੋ-ਦਿਨਾਂ ਦਾ ਚੱਕਰ ਦੁਹਰਦਾ ਹੈ: ਪਹਿਲੇ ਦਿਨ ਕੰਮ ${A} ਨਾਲ ਅਤੇ ਦੂਜੇ ਦਿਨ ${B} ਨਾਲ ਹੁੰਦਾ ਹੈ। ਕੰਮ ਨੂੰ ਠੀਕ ${cp005TimeIn(p, required(p.deadline, "deadline"), language)} ਪੂਰਾ ਕਰਨ ਲਈ ${B} ਦੀ ਲੋੜੀਂਦੀ ਦਰ ਕੀ ਹੈ?`,
      );
  }
}
