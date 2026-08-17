import { required } from "./cp001-helpers";
import type { TmwCp004GeneratedQuestion, TmwCp004SolveMode } from "./cp004-types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import {
  cp004Actor,
  cp004Copy,
  cp004Job,
  cp004Time,
} from "./localization-cp004-language";

function cleanTaskCase(
  value: string,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const assignment = cp004Job(source.parameters, language);
  const marked = language === "hi" ? `${assignment} को` : `${assignment} ਨੂੰ`;
  return value.replaceAll(marked, assignment);
}

function polishStem(
  question: TmwLocalizedQuestion,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const assignment = cp004Job(p, language);
  const A = cp004Actor(p, language, "actorA");
  const B = cp004Actor(p, language, "actorB");
  const C = cp004Actor(p, language, "actorC");
  const dA = p.durationA ? cp004Time(p, p.durationA, language) : "";
  const dB = p.durationB ? cp004Time(p, p.durationB, language) : "";
  let stem = cleanTaskCase(question.stem, source, language);

  switch (source.solveMode) {
    case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":
      stem = stem.replace(
        language === "hi" ? `${A} पहले ${dA} अकेले काम करता है` : `${A} ਪਹਿਲਾਂ ${dA} ਇਕੱਲਾ ਕੰਮ ਕਰਦਾ ਹੈ`,
        cp004Copy(language, `पहले ${dA} तक काम केवल ${A} से होता है`, `ਪਹਿਲਾਂ ${dA} ਤੱਕ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦਾ ਹੈ`),
      );
      break;
    case "findTotalTimeWhenTeamStartsThenOneLeaves":
      stem = stem
        .replace(
          language === "hi" ? `${B} चला जाता है` : `${B} ਚਲਾ ਜਾਂਦਾ ਹੈ`,
          cp004Copy(language, `${B} की भागीदारी समाप्त हो जाती है`, `${B} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ`),
        )
        .replace(
          language === "hi" ? `शेष काम ${A} अकेले पूरा करता है` : `ਬਾਕੀ ਕੰਮ ${A} ਇਕੱਲਾ ਪੂਰਾ ਕਰਦਾ ਹੈ`,
          cp004Copy(language, `शेष काम केवल ${A} से पूरा होता है`, `ਬਾਕੀ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ`),
        );
      break;
    case "findTotalTimeWhenOneStartsThenAnotherJoins":
      stem = stem
        .replace(
          language === "hi" ? `${A} अकेले शुरू करता है` : `${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ`,
          cp004Copy(language, `काम की शुरुआत केवल ${A} से होती है`, `ਕੰਮ ਦੀ ਸ਼ੁਰੂਆਤ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦੀ ਹੈ`),
        )
        .replace(
          language === "hi" ? `${B} साथ जुड़ जाता है` : `${B} ਨਾਲ ਜੁੜ ਜਾਂਦਾ ਹੈ`,
          cp004Copy(language, `${B} की भागीदारी शुरू हो जाती है`, `${B} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੋ ਜਾਂਦੀ ਹੈ`),
        );
      break;
    case "findTotalTimeWithStaggeredJoins": {
      const oldEvent = cp004Copy(
        language,
        `${A} अकेले शुरू करता है; ${dA} बाद ${B} और उसके ${dB} बाद ${C} जुड़ता है।`,
        `${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ; ${dA} ਬਾਅਦ ${B} ਅਤੇ ਉਸ ਤੋਂ ${dB} ਬਾਅਦ ${C} ਜੁੜਦਾ ਹੈ।`,
      );
      const newEvent = cp004Copy(
        language,
        `काम की शुरुआत केवल ${A} से होती है; ${dA} बाद ${B} की और उसके ${dB} बाद ${C} की भागीदारी शुरू होती है।`,
        `ਕੰਮ ਦੀ ਸ਼ੁਰੂਆਤ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦੀ ਹੈ; ${dA} ਬਾਅਦ ${B} ਦੀ ਅਤੇ ਉਸ ਤੋਂ ${dB} ਬਾਅਦ ${C} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।`,
      );
      stem = stem.replace(oldEvent, newEvent);
      break;
    }
    case "findTotalTimeWithStaggeredExits": {
      const oldEvent = cp004Copy(
        language,
        `${dA} बाद ${C} और उसके ${dB} बाद ${B} चला जाता है। शेष काम ${A} पूरा करता है।`,
        `${dA} ਬਾਅਦ ${C} ਅਤੇ ਉਸ ਤੋਂ ${dB} ਬਾਅਦ ${B} ਚਲਾ ਜਾਂਦਾ ਹੈ। ਬਾਕੀ ਕੰਮ ${A} ਪੂਰਾ ਕਰਦਾ ਹੈ।`,
      );
      const newEvent = cp004Copy(
        language,
        `${dA} बाद ${C} की और उसके ${dB} बाद ${B} की भागीदारी समाप्त होती है। शेष काम केवल ${A} से पूरा होता है।`,
        `${dA} ਬਾਅਦ ${C} ਦੀ ਅਤੇ ਉਸ ਤੋਂ ${dB} ਬਾਅਦ ${B} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੁੰਦੀ ਹੈ। ਬਾਕੀ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`,
      );
      stem = stem.replace(oldEvent, newEvent);
      break;
    }
    case "findTotalTimeWithJoinAndLeaveEvents": {
      const oldEvent = cp004Copy(
        language,
        `${A} अकेले शुरू करता है। ${dA} बाद ${B} जुड़ता है; दोनों ${dB} साथ काम करते हैं और फिर ${A} चला जाता है। ${B} शेष काम पूरा करता है।`,
        `${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${dA} ਬਾਅਦ ${B} ਜੁੜਦਾ ਹੈ; ਦੋਵੇਂ ${dB} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਫਿਰ ${A} ਚਲਾ ਜਾਂਦਾ ਹੈ। ${B} ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਦਾ ਹੈ।`,
      );
      const newEvent = cp004Copy(
        language,
        `काम की शुरुआत केवल ${A} से होती है। ${dA} बाद ${B} की भागीदारी शुरू होती है; दोनों ${dB} साथ काम करते हैं और फिर ${A} की भागीदारी समाप्त हो जाती है। शेष काम केवल ${B} से पूरा होता है।`,
        `ਕੰਮ ਦੀ ਸ਼ੁਰੂਆਤ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦੀ ਹੈ। ${dA} ਬਾਅਦ ${B} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ; ਦੋਵੇਂ ${dB} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਫਿਰ ${A} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ। ਬਾਕੀ ਕੰਮ ਸਿਰਫ਼ ${B} ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`,
      );
      stem = stem.replace(oldEvent, newEvent);
      break;
    }
    case "findJoinTimeFromFinalCompletion":
      stem = stem.replace(
        cp004Copy(language, `${A} अकेले शुरू करता है और ${B} बाद में जुड़ता है।`, `${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${B} ਬਾਅਦ ਵਿੱਚ ਜੁੜਦਾ ਹੈ।`),
        cp004Copy(language, `काम की शुरुआत केवल ${A} से होती है और ${B} की भागीदारी बाद में शुरू होती है।`, `ਕੰਮ ਦੀ ਸ਼ੁਰੂਆਤ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦੀ ਹੈ ਅਤੇ ${B} ਦੀ ਭਾਗੀਦਾਰੀ ਬਾਅਦ ਵਿੱਚ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ।`),
      );
      break;
    case "findLeaveTimeFromFinalCompletion":
      stem = stem.replace(
        cp004Copy(language, `बाद में ${A} चला जाता है और ${B} अकेले काम पूरा करता है।`, `ਬਾਅਦ ਵਿੱਚ ${A} ਚਲਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ${B} ਇਕੱਲਾ ਕੰਮ ਪੂਰਾ ਕਰਦਾ ਹੈ।`),
        cp004Copy(language, `बाद में ${A} की भागीदारी समाप्त हो जाती है और शेष काम केवल ${B} से पूरा होता है।`, `ਬਾਅਦ ਵਿੱਚ ${A} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ ਅਤੇ ਬਾਕੀ ਕੰਮ ਸਿਰਫ਼ ${B} ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`),
      );
      break;
    case "findUnknownInitialPhaseDuration":
      stem = stem.replace(
        language === "hi" ? `${assignment} पर पहले` : `${assignment} ਉੱਤੇ ਪਹਿਲਾਂ`,
        cp004Copy(language, `${assignment} में पहले`, `${assignment} ਵਿੱਚ ਪਹਿਲਾਂ`),
      );
      break;
    case "findUnknownFinalPhaseDuration":
      stem = stem.replace(
        cp004Copy(language, `${A} ने ${dA} काम करके रुक गया।`, `${A} ਨੇ ${dA} ਕੰਮ ਕਰਕੇ ਰੁਕ ਗਿਆ।`),
        cp004Copy(language, `${A} ने ${dA} काम किया; इसके बाद उसकी भागीदारी समाप्त हो गई।`, `${A} ਨੇ ${dA} ਕੰਮ ਕੀਤਾ; ਇਸ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਗਈ।`),
      );
      break;
    case "findCompletionWithIdleInterval":
      stem = stem
        .replace(
          cp004Copy(language, `${A} पहले ${dA} काम करता है`, `${A} ਪਹਿਲਾਂ ${dA} ਕੰਮ ਕਰਦਾ ਹੈ`),
          cp004Copy(language, `पहले ${dA} तक काम केवल ${A} से होता है`, `ਪਹਿਲਾਂ ${dA} ਤੱਕ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦਾ ਹੈ`),
        )
        .replace(
          cp004Copy(language, `${B} शेष काम अकेले पूरा करता है`, `${B} ਬਾਕੀ ਕੰਮ ਇਕੱਲਾ ਪੂਰਾ ਕਰਦਾ ਹੈ`),
          cp004Copy(language, `शेष काम केवल ${B} से पूरा होता है`, `ਬਾਕੀ ਕੰਮ ਸਿਰਫ਼ ${B} ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ`),
        );
      break;
    case "findCompletionWithChangedDailyHours": {
      const timeA = cp004Time(p, required(p.timeA, "timeA"), language);
      const oldHours = cp004Time(p, required(p.originalDailyHours, "originalDailyHours"), language);
      const oldSentence = cp004Copy(
        language,
        `${A} प्रतिदिन ${oldHours} काम करके ${assignment} ${timeA} में पूरा करता है।`,
        `${A} ਹਰ ਰੋਜ਼ ${oldHours} ਕੰਮ ਕਰਕੇ ${assignment} ${timeA} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ।`,
      );
      const newSentence = cp004Copy(
        language,
        `यदि ${A} प्रतिदिन ${oldHours} काम करे, तो ${assignment} ${timeA} में पूरा होता है।`,
        `ਜੇ ${A} ਹਰ ਰੋਜ਼ ${oldHours} ਕੰਮ ਕਰੇ, ਤਾਂ ${assignment} ${timeA} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`,
      );
      stem = stem.replace(oldSentence, newSentence);
      break;
    }
    case "findRequiredRemainingRateForDeadline": {
      const timeA = cp004Time(p, required(p.timeA, "timeA"), language);
      const oldSentence = cp004Copy(
        language,
        `${assignment} अकेले पूरा करने में ${A} को ${timeA} लगते हैं और वह पहले ${dA} काम करता है।`,
        `${assignment} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA} ਲੱਗਦੇ ਹਨ ਅਤੇ ਉਹ ਪਹਿਲਾਂ ${dA} ਕੰਮ ਕਰਦਾ ਹੈ।`,
      );
      const newSentence = cp004Copy(
        language,
        `${assignment} अकेले पूरा करने की ${A} की अवधि ${timeA} है। शुरुआती ${dA} तक उसी दर से काम होता है।`,
        `${assignment} ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਲਈ ${A} ਨੂੰ ${timeA} ਲੱਗਦੇ ਹਨ। ਸ਼ੁਰੂਆਤੀ ${dA} ਤੱਕ ਉਸੇ ਦਰ ਨਾਲ ਕੰਮ ਹੁੰਦਾ ਹੈ।`,
      );
      stem = stem.replace(oldSentence, newSentence);
      break;
    }
    case "findDelayAfterWorkerLeaves":
      stem = stem
        .replace(
          cp004Copy(language, `${B} चला जाता है`, `${B} ਚਲਾ ਜਾਂਦਾ ਹੈ`),
          cp004Copy(language, `${B} की भागीदारी समाप्त हो जाती है`, `${B} ਦੀ ਭਾਗੀਦਾਰੀ ਖਤਮ ਹੋ ਜਾਂਦੀ ਹੈ`),
        )
        .replace(
          cp004Copy(language, `${A} अकेले शेष काम पूरा करता है`, `${A} ਇਕੱਲਾ ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਦਾ ਹੈ`),
          cp004Copy(language, `शेष काम केवल ${A} से पूरा होता है`, `ਬਾਕੀ ਕੰਮ ਸਿਰਫ਼ ${A} ਨਾਲ ਪੂਰਾ ਹੁੰਦਾ ਹੈ`),
        );
      break;
    case "findEarlyCompletionAfterWorkerJoins":
      stem = stem
        .replace(
          cp004Copy(language, `${A} अकेले शुरू करता है`, `${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ`),
          cp004Copy(language, `काम की शुरुआत केवल ${A} से होती है`, `ਕੰਮ ਦੀ ਸ਼ੁਰੂਆਤ ਸਿਰਫ਼ ${A} ਨਾਲ ਹੁੰਦੀ ਹੈ`),
        )
        .replace(
          cp004Copy(language, `${B} जुड़ता है`, `${B} ਜੁੜਦਾ ਹੈ`),
          cp004Copy(language, `${B} की भागीदारी शुरू होती है`, `${B} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ`),
        );
      break;
    default:
      break;
  }

  return stem;
}

function shortcutStep(
  mode: TmwCp004SolveMode,
  answerText: string,
  language: TmwLocalizedLanguage,
): string {
  const steps: Record<TmwCp004SolveMode, [string, string]> = {
    findRemainingWorkAfterInitialPhase: [
      `पहले चरण का काम दर × समय से निकालकर 1 में से घटाएँ; शेष ${answerText} है।`,
      `ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਦਰ × ਸਮੇਂ ਨਾਲ ਕੱਢ ਕੇ 1 ਵਿੱਚੋਂ ਘਟਾਓ; ਬਾਕੀ ${answerText} ਹੈ।`,
    ],
    findWorkCompletedBeforeEvent: [
      `दोनों की संयुक्त दर को दिए समय से गुणा करने पर ${answerText} काम पूरा हुआ।`,
      `ਦੋਵਾਂ ਦੀ ਸਾਂਝੀ ਦਰ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਨ ਉੱਤੇ ${answerText} ਕੰਮ ਪੂਰਾ ਹੋਇਆ।`,
    ],
    findTotalTimeWhenFirstAgentStartsThenSecondFinishes: [
      `पहले चरण का काम घटाएँ, शेष को दूसरे सदस्य की दर से पूरा करने का समय जोड़ें: ${answerText}।`,
      `ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਘਟਾਓ, ਬਾਕੀ ਨੂੰ ਦੂਜੇ ਮੈਂਬਰ ਦੀ ਦਰ ਨਾਲ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਜੋੜੋ: ${answerText}।`,
    ],
    findTotalTimeWhenTeamStartsThenOneLeaves: [
      `साथ वाले चरण का काम निकालें; शेष भाग को बचे सदस्य की दर से पूरा करने पर कुल ${answerText} है।`,
      `ਇਕੱਠੇ ਵਾਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਕੱਢੋ; ਬਾਕੀ ਹਿੱਸੇ ਨੂੰ ਬਚੇ ਮੈਂਬਰ ਦੀ ਦਰ ਨਾਲ ਪੂਰਾ ਕਰਨ ਉੱਤੇ ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findTotalTimeWhenOneStartsThenAnotherJoins: [
      `अकेले चरण का काम घटाकर शेष भाग पर संयुक्त दर लगाएँ; कुल समय ${answerText} है।`,
      `ਇਕੱਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਘਟਾ ਕੇ ਬਾਕੀ ਹਿੱਸੇ ਉੱਤੇ ਸਾਂਝੀ ਦਰ ਲਗਾਓ; ਕੁੱਲ ਸਮਾਂ ${answerText} ਹੈ।`,
    ],
    findTotalTimeWithStaggeredJoins: [
      `हर जुड़ने की घटना पर संयुक्त दर बढ़ाएँ और शेष काम आगे ले जाएँ; कुल ${answerText} है।`,
      `ਹਰ ਜੁੜਨ ਵਾਲੀ ਘਟਨਾ ਉੱਤੇ ਸਾਂਝੀ ਦਰ ਵਧਾਓ ਅਤੇ ਬਾਕੀ ਕੰਮ ਅੱਗੇ ਲੈ ਜਾਓ; ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findTotalTimeWithStaggeredExits: [
      `हर जाने की घटना पर संयुक्त दर घटाएँ और अंतिम शेष भाग को अकेली दर से पूरा करें; कुल ${answerText} है।`,
      `ਹਰ ਜਾਣ ਵਾਲੀ ਘਟਨਾ ਉੱਤੇ ਸਾਂਝੀ ਦਰ ਘਟਾਓ ਅਤੇ ਆਖ਼ਰੀ ਬਾਕੀ ਹਿੱਸੇ ਨੂੰ ਇਕੱਲੀ ਦਰ ਨਾਲ ਪੂਰਾ ਕਰੋ; ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findTotalTimeWithJoinAndLeaveEvents: [
      `अकेला, संयुक्त और अंतिम अकेला—तीनों चरणों का समय जोड़ने पर ${answerText} मिलता है।`,
      `ਇਕੱਲਾ, ਸਾਂਝਾ ਅਤੇ ਆਖ਼ਰੀ ਇਕੱਲਾ—ਤਿੰਨਾਂ ਪੜਾਵਾਂ ਦਾ ਸਮਾਂ ਜੋੜਨ ਉੱਤੇ ${answerText} ਮਿਲਦਾ ਹੈ।`,
    ],
    findJoinTimeFromFinalCompletion: [
      `जुड़ने का समय x मानकर x की अकेली दर और शेष समय की संयुक्त दर का काम 1 रखें; x = ${answerText}।`,
      `ਜੁੜਨ ਦਾ ਸਮਾਂ x ਮੰਨ ਕੇ x ਦੀ ਇਕੱਲੀ ਦਰ ਅਤੇ ਬਾਕੀ ਸਮੇਂ ਦੀ ਸਾਂਝੀ ਦਰ ਦਾ ਕੰਮ 1 ਰੱਖੋ; x = ${answerText}।`,
    ],
    findLeaveTimeFromFinalCompletion: [
      `जाने का समय x मानकर पहले संयुक्त और बाद में अकेले हुए काम का योग 1 रखें; x = ${answerText}।`,
      `ਜਾਣ ਦਾ ਸਮਾਂ x ਮੰਨ ਕੇ ਪਹਿਲਾਂ ਸਾਂਝੇ ਅਤੇ ਬਾਅਦ ਵਿੱਚ ਇਕੱਲੇ ਹੋਏ ਕੰਮ ਦਾ ਜੋੜ 1 ਰੱਖੋ; x = ${answerText}।`,
    ],
    findUnknownInitialPhaseDuration: [
      `दिए अंतिम चरण का काम 1 में से घटाकर पहले चरण की दर से भाग दें; अवधि ${answerText} है।`,
      `ਦਿੱਤੇ ਆਖ਼ਰੀ ਪੜਾਅ ਦਾ ਕੰਮ 1 ਵਿੱਚੋਂ ਘਟਾ ਕੇ ਪਹਿਲੇ ਪੜਾਅ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ; ਮਿਆਦ ${answerText} ਹੈ।`,
    ],
    findUnknownFinalPhaseDuration: [
      `पहले चरण का काम घटाएँ और शेष को अंतिम दर से भाग दें; अंतिम अवधि ${answerText} है।`,
      `ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਕੰਮ ਘਟਾਓ ਅਤੇ ਬਾਕੀ ਨੂੰ ਆਖ਼ਰੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ; ਆਖ਼ਰੀ ਮਿਆਦ ${answerText} ਹੈ।`,
    ],
    findReplacementWorkerRate: [
      `पहले सदस्य का काम घटाकर शेष को दिए अंतिम समय से भाग दें; नई दर ${answerText} है।`,
      `ਪਹਿਲੇ ਮੈਂਬਰ ਦਾ ਕੰਮ ਘਟਾ ਕੇ ਬਾਕੀ ਨੂੰ ਦਿੱਤੇ ਆਖ਼ਰੀ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ; ਨਵੀਂ ਦਰ ${answerText} ਹੈ।`,
    ],
    findReplacementWorkerTime: [
      `शेष काम ÷ दिया अंतिम समय से नई दर पाएँ, फिर उसका उलटा लें; पूरा समय ${answerText} है।`,
      `ਬਾਕੀ ਕੰਮ ÷ ਦਿੱਤੇ ਆਖ਼ਰੀ ਸਮੇਂ ਨਾਲ ਨਵੀਂ ਦਰ ਲਵੋ, ਫਿਰ ਉਸ ਦਾ ਉਲਟ ਲਵੋ; ਪੂਰਾ ਸਮਾਂ ${answerText} ਹੈ।`,
    ],
    findCompletionWithIdleInterval: [
      `काम वाले दोनों चरणों का समय निकालें और रुका हुआ समय अलग जोड़ें; कुल ${answerText} है।`,
      `ਕੰਮ ਵਾਲੇ ਦੋਵੇਂ ਪੜਾਵਾਂ ਦਾ ਸਮਾਂ ਕੱਢੋ ਅਤੇ ਰੁਕਿਆ ਹੋਇਆ ਸਮਾਂ ਵੱਖ ਜੋੜੋ; ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findCompletionWithChangedDailyHours: [
      `नई दैनिक दर = पुरानी दर × नए घंटे ÷ पुराने घंटे; शेष काम जोड़कर कुल ${answerText} है।`,
      `ਨਵੀਂ ਰੋਜ਼ਾਨਾ ਦਰ = ਪੁਰਾਣੀ ਦਰ × ਨਵੇਂ ਘੰਟੇ ÷ ਪੁਰਾਣੇ ਘੰਟੇ; ਬਾਕੀ ਕੰਮ ਜੋੜ ਕੇ ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findCompletionWithMidProjectEfficiencyChange: [
      `घटना के बाद नई दर = पुरानी दर × कार्यक्षमता गुणक; शेष भाग से कुल ${answerText} है।`,
      `ਘਟਨਾ ਤੋਂ ਬਾਅਦ ਨਵੀਂ ਦਰ = ਪੁਰਾਣੀ ਦਰ × ਕਾਰਗੁਜ਼ਾਰੀ ਗੁਣਕ; ਬਾਕੀ ਹਿੱਸੇ ਤੋਂ ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findCompletionWithNegativeWorkerActivatedLater: [
      `हानिकारक प्रक्रिया के बाद शुद्ध दर = सकारात्मक संयुक्त दर − हानि दर; कुल ${answerText} है।`,
      `ਨੁਕਸਾਨ ਵਾਲੀ ਪ੍ਰਕਿਰਿਆ ਤੋਂ ਬਾਅਦ ਸ਼ੁੱਧ ਦਰ = ਸਕਾਰਾਤਮਕ ਸਾਂਝੀ ਦਰ − ਨੁਕਸਾਨ ਦਰ; ਕੁੱਲ ${answerText} ਹੈ।`,
    ],
    findEventTimeAtSpecifiedCompletionFraction: [
      `घटना का समय = लक्षित काम का भाग ÷ अकेली दर; उत्तर ${answerText} है।`,
      `ਘਟਨਾ ਦਾ ਸਮਾਂ = ਟੀਚੇ ਵਾਲਾ ਕੰਮ ਦਾ ਹਿੱਸਾ ÷ ਇਕੱਲੀ ਦਰ; ਉੱਤਰ ${answerText} ਹੈ।`,
    ],
    findRequiredRemainingRateForDeadline: [
      `पहले हुआ काम घटाएँ और शेष काम को उपलब्ध शेष समय से भाग दें; दर ${answerText} है।`,
      `ਪਹਿਲਾਂ ਹੋਇਆ ਕੰਮ ਘਟਾਓ ਅਤੇ ਬਾਕੀ ਕੰਮ ਨੂੰ ਉਪਲਬਧ ਬਾਕੀ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿਓ; ਦਰ ${answerText} ਹੈ।`,
    ],
    findWorkerCountAddedAfterPartialProgress: [
      `शेष काम से आवश्यक अंतिम कुल कर्मचारी निकालें और शुरुआती संख्या घटाएँ; जोड़ने हैं ${answerText}।`,
      `ਬਾਕੀ ਕੰਮ ਤੋਂ ਲੋੜੀਂਦੇ ਆਖ਼ਰੀ ਕੁੱਲ ਕਰਮਚਾਰੀ ਕੱਢੋ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ਘਟਾਓ; ਜੋੜਣੇ ਹਨ ${answerText}।`,
    ],
    findWorkerCountRemovedAfterPartialProgress: [
      `शेष काम से अंतिम कर्मचारी संख्या निकालें और उसे शुरुआती संख्या में से घटाएँ; गए ${answerText}।`,
      `ਬਾਕੀ ਕੰਮ ਤੋਂ ਆਖ਼ਰੀ ਕਰਮਚਾਰੀ ਗਿਣਤੀ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ਵਿੱਚੋਂ ਘਟਾਓ; ਗਏ ${answerText}।`,
    ],
    findDelayAfterWorkerLeaves: [
      `सदस्य जाने वाली स्थिति का कुल समय − लगातार साथ वाली स्थिति का समय = ${answerText} देरी।`,
      `ਮੈਂਬਰ ਜਾਣ ਵਾਲੀ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ − ਲਗਾਤਾਰ ਇਕੱਠੇ ਵਾਲੀ ਸਥਿਤੀ ਦਾ ਸਮਾਂ = ${answerText} ਦੇਰੀ।`,
    ],
    findEarlyCompletionAfterWorkerJoins: [
      `अकेले पूरा होने का समय − सदस्य जुड़ने वाली स्थिति का कुल समय = ${answerText} बचत।`,
      `ਇਕੱਲੇ ਪੂਰਾ ਹੋਣ ਦਾ ਸਮਾਂ − ਮੈਂਬਰ ਜੁੜਨ ਵਾਲੀ ਸਥਿਤੀ ਦਾ ਕੁੱਲ ਸਮਾਂ = ${answerText} ਬਚਤ।`,
    ],
  };
  return steps[mode][language === "hi" ? 0 : 1];
}

function modeTrapReason(
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
  fallback: string,
): string {
  switch (source.solveMode) {
    case "findRemainingWorkAfterInitialPhase":
      return cp004Copy(language, "यह विकल्प पहले चरण में पूरा हुआ भाग बताता है, जबकि प्रश्न बचा हुआ भाग पूछता है।", "ਇਹ ਚੋਣ ਪਹਿਲੇ ਪੜਾਅ ਵਿੱਚ ਪੂਰਾ ਹੋਇਆ ਹਿੱਸਾ ਦੱਸਦੀ ਹੈ, ਜਦਕਿ ਪ੍ਰਸ਼ਨ ਬਾਕੀ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।");
    case "findWorkCompletedBeforeEvent":
      return cp004Copy(language, "इस विकल्प में दोनों की संयुक्त दैनिक दर को दिए समय से सही गुणा नहीं किया गया है।", "ਇਸ ਚੋਣ ਵਿੱਚ ਦੋਵਾਂ ਦੀ ਸਾਂਝੀ ਰੋਜ਼ਾਨਾ ਦਰ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਸਹੀ ਗੁਣਾ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।");
    case "findUnknownInitialPhaseDuration":
      return cp004Copy(language, "यह दिया हुआ अंतिम चरण का समय दोहराता है; पहले चरण का समय शेष काम से अलग निकालना पड़ता है।", "ਇਹ ਦਿੱਤਾ ਹੋਇਆ ਆਖ਼ਰੀ ਪੜਾਅ ਦਾ ਸਮਾਂ ਦੁਹਰਾਉਂਦਾ ਹੈ; ਪਹਿਲੇ ਪੜਾਅ ਦਾ ਸਮਾਂ ਬਾਕੀ ਕੰਮ ਤੋਂ ਵੱਖ ਕੱਢਣਾ ਪੈਂਦਾ ਹੈ।");
    case "findUnknownFinalPhaseDuration":
      return cp004Copy(language, "यह शुरुआती चरण की अवधि है; प्रश्न शेष काम के लिए अंतिम चरण की अवधि पूछता है।", "ਇਹ ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਦੀ ਮਿਆਦ ਹੈ; ਪ੍ਰਸ਼ਨ ਬਾਕੀ ਕੰਮ ਲਈ ਆਖ਼ਰੀ ਪੜਾਅ ਦੀ ਮਿਆਦ ਪੁੱਛਦਾ ਹੈ।");
    case "findReplacementWorkerRate":
      return cp004Copy(language, "यह पहले सदस्य की मूल दर दोहराता है; नए सदस्य की दर शेष काम को दिए समय से भाग देकर मिलेगी।", "ਇਹ ਪਹਿਲੇ ਮੈਂਬਰ ਦੀ ਮੂਲ ਦਰ ਦੁਹਰਾਉਂਦਾ ਹੈ; ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਦਰ ਬਾਕੀ ਕੰਮ ਨੂੰ ਦਿੱਤੇ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਮਿਲੇਗੀ।");
    case "findReplacementWorkerTime":
      return cp004Copy(language, "यह केवल शेष काम पूरा करने का दिया समय है; प्रश्न नई दर पर पूरे काम का अकेला समय पूछता है।", "ਇਹ ਸਿਰਫ਼ ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਨ ਦਾ ਦਿੱਤਾ ਸਮਾਂ ਹੈ; ਪ੍ਰਸ਼ਨ ਨਵੀਂ ਦਰ ਉੱਤੇ ਸਾਰੇ ਕੰਮ ਦਾ ਇਕੱਲਾ ਸਮਾਂ ਪੁੱਛਦਾ ਹੈ।");
    case "findEventTimeAtSpecifiedCompletionFraction":
      return cp004Copy(language, "यह पूरे काम को पूरा करने का समय है; लक्षित भाग तक पहुँचने का समय उससे अलग है।", "ਇਹ ਸਾਰੇ ਕੰਮ ਨੂੰ ਪੂਰਾ ਕਰਨ ਦਾ ਸਮਾਂ ਹੈ; ਟੀਚੇ ਵਾਲੇ ਹਿੱਸੇ ਤੱਕ ਪਹੁੰਚਣ ਦਾ ਸਮਾਂ ਇਸ ਤੋਂ ਵੱਖ ਹੈ।");
    case "findRequiredRemainingRateForDeadline":
      return cp004Copy(language, "इस विकल्प में पूरी समय-सीमा का उलटा दर मान लिया गया है; पहले चरण के बाद शेष काम और शेष समय लेना चाहिए।", "ਇਸ ਚੋਣ ਵਿੱਚ ਪੂਰੀ ਸਮਾਂ-ਸੀਮਾ ਦਾ ਉਲਟ ਦਰ ਮੰਨ ਲਿਆ ਗਿਆ ਹੈ; ਪਹਿਲੇ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਬਾਕੀ ਕੰਮ ਅਤੇ ਬਾਕੀ ਸਮਾਂ ਲੈਣਾ ਚਾਹੀਦਾ ਹੈ।");
    case "findWorkerCountAddedAfterPartialProgress":
      return cp004Copy(language, "यह शुरुआती कर्मचारियों की संख्या को ही अतिरिक्त संख्या मानता है; आवश्यक अंतिम कुल में से शुरुआती संख्या घटानी चाहिए।", "ਇਹ ਸ਼ੁਰੂਆਤੀ ਕਰਮਚਾਰੀਆਂ ਦੀ ਗਿਣਤੀ ਨੂੰ ਹੀ ਵਾਧੂ ਗਿਣਤੀ ਮੰਨਦਾ ਹੈ; ਲੋੜੀਂਦੇ ਆਖ਼ਰੀ ਕੁੱਲ ਵਿੱਚੋਂ ਸ਼ੁਰੂਆਤੀ ਗਿਣਤੀ ਘਟਾਉਣੀ ਚਾਹੀਦੀ ਹੈ।");
    case "findWorkerCountRemovedAfterPartialProgress":
      return cp004Copy(language, "यह शुरुआती कुल कर्मचारियों को ही जाने वालों की संख्या मानता है; शुरुआती और अंतिम संख्या का अंतर चाहिए।", "ਇਹ ਸ਼ੁਰੂਆਤੀ ਕੁੱਲ ਕਰਮਚਾਰੀਆਂ ਨੂੰ ਹੀ ਜਾਣ ਵਾਲਿਆਂ ਦੀ ਗਿਣਤੀ ਮੰਨਦਾ ਹੈ; ਸ਼ੁਰੂਆਤੀ ਅਤੇ ਆਖ਼ਰੀ ਗਿਣਤੀ ਦਾ ਅੰਤਰ ਚਾਹੀਦਾ ਹੈ।");
    case "findDelayAfterWorkerLeaves":
      return cp004Copy(language, "यह सदस्य के जाने का समय है; प्रश्न बदली और सामान्य स्थितियों के कुल समय का अंतर पूछता है।", "ਇਹ ਮੈਂਬਰ ਦੇ ਜਾਣ ਦਾ ਸਮਾਂ ਹੈ; ਪ੍ਰਸ਼ਨ ਬਦਲੀ ਅਤੇ ਆਮ ਸਥਿਤੀਆਂ ਦੇ ਕੁੱਲ ਸਮੇਂ ਦਾ ਅੰਤਰ ਪੁੱਛਦਾ ਹੈ।");
    case "findEarlyCompletionAfterWorkerJoins":
      return cp004Copy(language, "यह सदस्य के जुड़ने का समय है; प्रश्न अकेली और बदली स्थितियों के कुल समय की बचत पूछता है।", "ਇਹ ਮੈਂਬਰ ਦੇ ਜੁੜਨ ਦਾ ਸਮਾਂ ਹੈ; ਪ੍ਰਸ਼ਨ ਇਕੱਲੀ ਅਤੇ ਬਦਲੀ ਸਥਿਤੀਆਂ ਦੇ ਕੁੱਲ ਸਮੇਂ ਦੀ ਬਚਤ ਪੁੱਛਦਾ ਹੈ।");
    default:
      return fallback;
  }
}

function polishConclusion(
  question: TmwLocalizedQuestion,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const A = cp004Actor(p, language, "actorA");
  const B = cp004Actor(p, language, "actorB");
  const answer = question.solution.answerText;
  if (source.solveMode === "findJoinTimeFromFinalCompletion") {
    return cp004Copy(language, `अतः ${B} की भागीदारी शुरू से ${answer} बाद शुरू हुई।`, `ਇਸ ਲਈ ${B} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਬਾਅਦ ਸ਼ੁਰੂ ਹੋਈ।`);
  }
  if (source.solveMode === "findLeaveTimeFromFinalCompletion") {
    return cp004Copy(language, `अतः ${A} की भागीदारी शुरू से ${answer} बाद समाप्त हुई।`, `ਇਸ ਲਈ ${A} ਦੀ ਭਾਗੀਦਾਰੀ ਸ਼ੁਰੂ ਤੋਂ ${answer} ਬਾਅਦ ਖਤਮ ਹੋਈ।`);
  }
  return cleanTaskCase(question.explanation.conclusion, source, language);
}

export function polishTmwCp004LocalizedQuestion(
  question: TmwLocalizedQuestion,
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): TmwLocalizedQuestion {
  return {
    ...question,
    stem: polishStem(question, source, language),
    explanation: {
      ...question.explanation,
      shortcut: {
        ...question.explanation.shortcut,
        steps: [shortcutStep(source.solveMode, question.solution.answerText, language)],
      },
      commonTrap: {
        ...question.explanation.commonTrap,
        explanation: modeTrapReason(
          source,
          language,
          question.explanation.commonTrap.explanation,
        ),
      },
      conclusion: polishConclusion(question, source, language),
    },
  };
}
