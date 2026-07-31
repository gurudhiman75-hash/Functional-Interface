import { required } from "./cp001-helpers";
import type { TmwCp004GeneratedQuestion } from "./cp004-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import {
  cp004Actor,
  cp004Copy,
  cp004Hours,
  cp004Job,
  cp004Time,
} from "./localization-cp004-language";

export function finalizeTmwCp004LocalizedQuestion(
  question: TmwLocalizedQuestion,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  const p = source.parameters;
  const assignment = cp004Job(p, language);
  const A = cp004Actor(p, language, "actorA");
  const B = cp004Actor(p, language, "actorB");
  let stem = question.stem;

  if (source.solveMode === "findCompletionWithChangedDailyHours") {
    const oldHours = cp004Hours(required(p.originalDailyHours, "originalDailyHours"), language);
    const newHours = cp004Hours(required(p.changedDailyHours, "changedDailyHours"), language);
    const totalTime = cp004Time(p, required(p.timeA, "timeA"), language);
    const initialDuration = cp004Time(p, required(p.durationA, "durationA"), language);
    stem = cp004Copy(
      language,
      `यदि ${A} प्रतिदिन ${oldHours} काम करे, तो ${assignment} ${totalTime} में पूरा होता है। ${initialDuration} बाद दैनिक काम का समय ${newHours} कर दिया जाता है और प्रति घंटे की उत्पादकता समान रहती है। कुल कितने कैलेंडर दिनों में काम पूरा होगा?`,
      `ਜੇ ${A} ਹਰ ਰੋਜ਼ ${oldHours} ਕੰਮ ਕਰੇ, ਤਾਂ ${assignment} ${totalTime} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ${initialDuration} ਬਾਅਦ ਰੋਜ਼ਾਨਾ ਕੰਮ ਦਾ ਸਮਾਂ ${newHours} ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਕਤਾ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ਕੈਲੰਡਰ ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਹੋਵੇਗਾ?`,
    );
  }

  if (source.solveMode === "findCompletionWithNegativeWorkerActivatedLater") {
    const timeA = cp004Time(p, required(p.timeA, "timeA"), language);
    const timeB = cp004Time(p, required(p.timeB, "timeB"), language);
    const timeC = cp004Time(p, required(p.timeC, "timeC"), language);
    const initialDuration = cp004Time(p, required(p.durationA, "durationA"), language);
    stem = cp004Copy(
      language,
      `${assignment} अकेले पूरा करने में ${A} को ${timeA} और ${B} को ${timeB} लगते हैं। दोनों ${initialDuration} साथ काम करते हैं। फिर एक ऐसी प्रक्रिया शुरू होती है जो अकेले पूरे काम को बिगाड़ने में ${timeC} लेती है, जबकि ${A} और ${B} काम जारी रखते हैं। कुल समय कितना होगा?`,
      `${assignment} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA} ਅਤੇ ${B} ਨੂੰ ${timeB} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ${initialDuration} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਫਿਰ ਇੱਕ ਐਸੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ ਜੋ ਇਕੱਲੀ ਸਾਰੇ ਕੰਮ ਨੂੰ ਖਰਾਬ ਕਰਨ ਵਿੱਚ ${timeC} ਲੈਂਦੀ ਹੈ, ਜਦਕਿ ${A} ਅਤੇ ${B} ਕੰਮ ਜਾਰੀ ਰੱਖਦੇ ਹਨ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
    );
  }

  return { ...question, stem };
}
