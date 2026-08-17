import { required } from "./cp001-helpers";
import type { TmwCp004GeneratedQuestion } from "./cp004-types";
import type { TmwLocalizedLanguage } from "./localization-types";
import {
  cp004Actor,
  cp004Copy,
  cp004Hours,
  cp004Job,
  cp004MathValue,
  cp004Time,
  cp004WorkRate,
} from "./localization-cp004-language";

export function renderTmwCp004LocalizedStem(
  source: TmwCp004GeneratedQuestion,
  language: TmwLocalizedLanguage,
): string {
  const p = source.parameters;
  const A = cp004Actor(p, language, "actorA");
  const B = cp004Actor(p, language, "actorB");
  const C = cp004Actor(p, language, "actorC");
  const assignment = cp004Job(p, language);
  const timeA = () => cp004Time(p, required(p.timeA, "timeA"), language);
  const timeB = () => cp004Time(p, required(p.timeB, "timeB"), language);
  const timeC = () => cp004Time(p, required(p.timeC, "timeC"), language);
  const durationA = () => cp004Time(p, required(p.durationA, "durationA"), language);
  const durationB = () => cp004Time(p, required(p.durationB, "durationB"), language);

  switch (source.solveMode) {
    case "findRemainingWorkAfterInitialPhase":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} लगते हैं। ${A} ने अकेले ${durationA()} काम किया। अब काम का कितना भाग बाकी है?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਲੱਗਦੇ ਹਨ। ${A} ਨੇ ਇਕੱਲੇ ${durationA()} ਕੰਮ ਕੀਤਾ। ਹੁਣ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਬਾਕੀ ਹੈ?`,
      );
    case "findWorkCompletedBeforeEvent":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोनों ${durationA()} साथ काम करते हैं, फिर कार्य-दल बदल जाता है। उस समय तक काम का कितना भाग पूरा हो चुका है?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ${durationA()} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ, ਫਿਰ ਟੀਮ ਬਦਲ ਜਾਂਦੀ ਹੈ। ਉਸ ਵੇਲੇ ਤੱਕ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋ ਚੁੱਕਾ ਹੈ?`,
      );
    case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} पहले ${durationA()} अकेले काम करता है और शेष काम ${B} को सौंप देता है। शुरू से कुल कितने समय में काम पूरा होगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਪਹਿਲਾਂ ${durationA()} ਇਕੱਲਾ ਕੰਮ ਕਰਦਾ ਹੈ ਅਤੇ ਬਾਕੀ ਕੰਮ ${B} ਨੂੰ ਸੌਂਪ ਦਿੰਦਾ ਹੈ। ਸ਼ੁਰੂ ਤੋਂ ਕੁੱਲ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findTotalTimeWhenTeamStartsThenOneLeaves":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोनों साथ शुरू करते हैं, पर ${durationA()} बाद ${B} चला जाता है। शेष काम ${A} अकेले पूरा करता है। कुल समय ज्ञात कीजिए।`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ, ਪਰ ${durationA()} ਬਾਅਦ ${B} ਚਲਾ ਜਾਂਦਾ ਹੈ। ਬਾਕੀ ਕੰਮ ${A} ਇਕੱਲਾ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findTotalTimeWhenOneStartsThenAnotherJoins":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} अकेले शुरू करता है और ${durationA()} बाद ${B} साथ जुड़ जाता है। कुल काम कितने समय में पूरा होगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${durationA()} ਬਾਅਦ ${B} ਨਾਲ ਜੁੜ ਜਾਂਦਾ ਹੈ। ਕੁੱਲ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findTotalTimeWithStaggeredJoins":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A}, ${B} और ${C} को क्रमशः ${timeA()}, ${timeB()} और ${timeC()} लगते हैं। ${A} अकेले शुरू करता है; ${durationA()} बाद ${B} और उसके ${durationB()} बाद ${C} जुड़ता है। सभी सक्रिय सदस्य अंत तक काम करते हैं। कुल समय कितना होगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A}, ${B} ਅਤੇ ${C} ਨੂੰ ਕ੍ਰਮਵਾਰ ${timeA()}, ${timeB()} ਅਤੇ ${timeC()} ਲੱਗਦੇ ਹਨ। ${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ; ${durationA()} ਬਾਅਦ ${B} ਅਤੇ ਉਸ ਤੋਂ ${durationB()} ਬਾਅਦ ${C} ਜੁੜਦਾ ਹੈ। ਸਾਰੇ ਸਰਗਰਮ ਮੈਂਬਰ ਅੰਤ ਤੱਕ ਕੰਮ ਕਰਦੇ ਹਨ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findTotalTimeWithStaggeredExits":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A}, ${B} और ${C} को क्रमशः ${timeA()}, ${timeB()} और ${timeC()} लगते हैं। तीनों साथ शुरू करते हैं। ${durationA()} बाद ${C} और उसके ${durationB()} बाद ${B} चला जाता है। शेष काम ${A} पूरा करता है। कुल समय कितना होगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A}, ${B} ਅਤੇ ${C} ਨੂੰ ਕ੍ਰਮਵਾਰ ${timeA()}, ${timeB()} ਅਤੇ ${timeC()} ਲੱਗਦੇ ਹਨ। ਤਿੰਨੇ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ। ${durationA()} ਬਾਅਦ ${C} ਅਤੇ ਉਸ ਤੋਂ ${durationB()} ਬਾਅਦ ${B} ਚਲਾ ਜਾਂਦਾ ਹੈ। ਬਾਕੀ ਕੰਮ ${A} ਪੂਰਾ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findTotalTimeWithJoinAndLeaveEvents":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} अकेले शुरू करता है। ${durationA()} बाद ${B} जुड़ता है; दोनों ${durationB()} साथ काम करते हैं और फिर ${A} चला जाता है। ${B} शेष काम पूरा करता है। कुल समय ज्ञात कीजिए।`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ। ${durationA()} ਬਾਅਦ ${B} ਜੁੜਦਾ ਹੈ; ਦੋਵੇਂ ${durationB()} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ ਅਤੇ ਫਿਰ ${A} ਚਲਾ ਜਾਂਦਾ ਹੈ। ${B} ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findJoinTimeFromFinalCompletion":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} अकेले शुरू करता है और ${B} बाद में जुड़ता है। यदि काम शुरू से ${cp004Time(p, required(p.totalCompletionTime, "totalCompletionTime"), language)} में पूरा हो जाता है, तो ${B} कितने समय बाद जुड़ा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${B} ਬਾਅਦ ਵਿੱਚ ਜੁੜਦਾ ਹੈ। ਜੇ ਕੰਮ ਸ਼ੁਰੂ ਤੋਂ ${cp004Time(p, required(p.totalCompletionTime, "totalCompletionTime"), language)} ਵਿੱਚ ਪੂਰਾ ਹੋ ਜਾਂਦਾ ਹੈ, ਤਾਂ ${B} ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਜੁੜਿਆ?`,
      );
    case "findLeaveTimeFromFinalCompletion":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोनों साथ शुरू करते हैं; बाद में ${A} चला जाता है और ${B} अकेले काम पूरा करता है। यदि कुल समय ${cp004Time(p, required(p.totalCompletionTime, "totalCompletionTime"), language)} है, तो ${A} कितने समय बाद गया?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ; ਬਾਅਦ ਵਿੱਚ ${A} ਚਲਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ${B} ਇਕੱਲਾ ਕੰਮ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਜੇ ਕੁੱਲ ਸਮਾਂ ${cp004Time(p, required(p.totalCompletionTime, "totalCompletionTime"), language)} ਹੈ, ਤਾਂ ${A} ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਗਿਆ?`,
      );
    case "findUnknownInitialPhaseDuration":
      return cp004Copy(
        language,
        `${assignment} पर पहले ${cp004WorkRate(required(p.rateA, "rateA"), p, language)} की दर से काम हुआ। बाद में ${cp004WorkRate(required(p.rateB, "rateB"), p, language)} की दर से ${durationB()} काम करके पूरा कार्य समाप्त हुआ। पहला चरण कितने समय चला?`,
        `${assignment} ਉੱਤੇ ਪਹਿਲਾਂ ${cp004WorkRate(required(p.rateA, "rateA"), p, language)} ਦੀ ਦਰ ਨਾਲ ਕੰਮ ਹੋਇਆ। ਬਾਅਦ ਵਿੱਚ ${cp004WorkRate(required(p.rateB, "rateB"), p, language)} ਦੀ ਦਰ ਨਾਲ ${durationB()} ਕੰਮ ਕਰਕੇ ਸਾਰਾ ਕੰਮ ਮੁਕੰਮਲ ਹੋਇਆ। ਪਹਿਲਾ ਪੜਾਅ ਕਿੰਨਾ ਸਮਾਂ ਚੱਲਿਆ?`,
      );
    case "findUnknownFinalPhaseDuration":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} ने ${durationA()} काम करके रुक गया। बाकी काम पूरा करने के लिए ${B} को अकेले कितना समय लगेगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਨੇ ${durationA()} ਕੰਮ ਕਰਕੇ ਰੁਕ ਗਿਆ। ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ${B} ਨੂੰ ਇਕੱਲੇ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`,
      );
    case "findReplacementWorkerRate":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} लगते हैं। ${durationA()} काम करने के बाद उसकी जगह दूसरा सदस्य आता है, जिसे बाकी काम ${durationB()} में पूरा करना है। नए सदस्य की आवश्यक दैनिक दर क्या होनी चाहिए?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਲੱਗਦੇ ਹਨ। ${durationA()} ਕੰਮ ਕਰਨ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਥਾਂ ਦੂਜਾ ਮੈਂਬਰ ਆਉਂਦਾ ਹੈ, ਜਿਸ ਨੇ ਬਾਕੀ ਕੰਮ ${durationB()} ਵਿੱਚ ਪੂਰਾ ਕਰਨਾ ਹੈ। ਨਵੇਂ ਮੈਂਬਰ ਦੀ ਲੋੜੀਂਦੀ ਰੋਜ਼ਾਨਾ ਦਰ ਕੀ ਹੋਵੇਗੀ?`,
      );
    case "findReplacementWorkerTime":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} लगते हैं। ${durationA()} बाद उसकी जगह नया सदस्य आता है और बाकी काम ${durationB()} में पूरा करता है। इसी दर से नया सदस्य पूरा काम अकेले कितने समय में करेगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਲੱਗਦੇ ਹਨ। ${durationA()} ਬਾਅਦ ਉਸ ਦੀ ਥਾਂ ਨਵਾਂ ਮੈਂਬਰ ਆਉਂਦਾ ਹੈ ਅਤੇ ਬਾਕੀ ਕੰਮ ${durationB()} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਇਸੇ ਦਰ ਨਾਲ ਨਵਾਂ ਮੈਂਬਰ ਸਾਰਾ ਕੰਮ ਇਕੱਲਾ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਕਰੇਗਾ?`,
      );
    case "findCompletionWithIdleInterval":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} पहले ${durationA()} काम करता है, फिर काम ${cp004Time(p, required(p.idleDuration, "idleDuration"), language)} तक पूरी तरह रुका रहता है। इसके बाद ${B} शेष काम अकेले पूरा करता है। कुल बीता समय कितना है?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਪਹਿਲਾਂ ${durationA()} ਕੰਮ ਕਰਦਾ ਹੈ, ਫਿਰ ਕੰਮ ${cp004Time(p, required(p.idleDuration, "idleDuration"), language)} ਲਈ ਪੂਰੀ ਤਰ੍ਹਾਂ ਰੁਕਿਆ ਰਹਿੰਦਾ ਹੈ। ਇਸ ਤੋਂ ਬਾਅਦ ${B} ਬਾਕੀ ਕੰਮ ਇਕੱਲਾ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਕੁੱਲ ਬੀਤਿਆ ਸਮਾਂ ਕਿੰਨਾ ਹੈ?`,
      );
    case "findCompletionWithChangedDailyHours":
      return cp004Copy(
        language,
        `${A} प्रतिदिन ${cp004Hours(required(p.originalDailyHours, "originalDailyHours"), language)} काम करके ${assignment} को ${timeA()} में पूरा करता है। ${durationA()} बाद दैनिक काम का समय ${cp004Hours(required(p.changedDailyHours, "changedDailyHours"), language)} कर दिया जाता है और प्रति घंटे की उत्पादकता समान रहती है। कुल कितने कैलेंडर दिनों में काम पूरा होगा?`,
        `${A} ਹਰ ਰੋਜ਼ ${cp004Hours(required(p.originalDailyHours, "originalDailyHours"), language)} ਕੰਮ ਕਰਕੇ ${assignment} ਨੂੰ ${timeA()} ਵਿੱਚ ਪੂਰਾ ਕਰਦਾ ਹੈ। ${durationA()} ਬਾਅਦ ਰੋਜ਼ਾਨਾ ਕੰਮ ਦਾ ਸਮਾਂ ${cp004Hours(required(p.changedDailyHours, "changedDailyHours"), language)} ਕਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ਪ੍ਰਤੀ ਘੰਟਾ ਉਤਪਾਦਕਤਾ ਇੱਕੋ ਰਹਿੰਦੀ ਹੈ। ਕੁੱਲ ਕਿੰਨੇ ਕੈਲੰਡਰ ਦਿਨਾਂ ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
    case "findCompletionWithMidProjectEfficiencyChange":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को शुरू में ${timeA()} लगते हैं। ${durationA()} काम करने के बाद उसकी कार्यक्षमता मूल स्तर की ${cp004MathValue(required(p.efficiencyMultiplier, "efficiencyMultiplier"))} गुना हो जाती है। कुल समय ज्ञात कीजिए।`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ਸ਼ੁਰੂ ਵਿੱਚ ${timeA()} ਲੱਗਦੇ ਹਨ। ${durationA()} ਕੰਮ ਕਰਨ ਤੋਂ ਬਾਅਦ ਉਸ ਦੀ ਕਾਰਗੁਜ਼ਾਰੀ ਮੂਲ ਪੱਧਰ ਦੀ ${cp004MathValue(required(p.efficiencyMultiplier, "efficiencyMultiplier"))} ਗੁਣਾ ਹੋ ਜਾਂਦੀ ਹੈ। ਕੁੱਲ ਸਮਾਂ ਕੱਢੋ।`,
      );
    case "findCompletionWithNegativeWorkerActivatedLater":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोनों ${durationA()} साथ काम करते हैं। फिर एक ऐसी प्रक्रिया शुरू होती है जो अकेले किए गए पूरे काम को ${timeC()} में बिगाड़ सकती है, जबकि ${A} और ${B} काम जारी रखते हैं। कुल समय कितना होगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ${durationA()} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਫਿਰ ਇੱਕ ਐਸੀ ਪ੍ਰਕਿਰਿਆ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ ਜੋ ਇਕੱਲੀ ਕੀਤੇ ਹੋਏ ਸਾਰੇ ਕੰਮ ਨੂੰ ${timeC()} ਵਿੱਚ ਖਰਾਬ ਕਰ ਸਕਦੀ ਹੈ, ਜਦਕਿ ${A} ਅਤੇ ${B} ਕੰਮ ਜਾਰੀ ਰੱਖਦੇ ਹਨ। ਕੁੱਲ ਸਮਾਂ ਕਿੰਨਾ ਹੋਵੇਗਾ?`,
      );
    case "findEventTimeAtSpecifiedCompletionFraction":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} लगते हैं। काम का ${cp004MathValue(required(p.targetFraction, "targetFraction"))} भाग पूरा होते ही निर्धारित घटना होगी। यह घटना शुरू से कितने समय बाद होगी?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਲੱਗਦੇ ਹਨ। ਕੰਮ ਦਾ ${cp004MathValue(required(p.targetFraction, "targetFraction"))} ਹਿੱਸਾ ਪੂਰਾ ਹੁੰਦੇ ਹੀ ਨਿਰਧਾਰਤ ਘਟਨਾ ਹੋਵੇਗੀ। ਇਹ ਘਟਨਾ ਸ਼ੁਰੂ ਤੋਂ ਕਿੰਨੇ ਸਮੇਂ ਬਾਅਦ ਹੋਵੇਗੀ?`,
      );
    case "findRequiredRemainingRateForDeadline":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} लगते हैं और वह पहले ${durationA()} काम करता है। पूरा काम शुरू से ${cp004Time(p, required(p.deadline, "deadline"), language)} के भीतर समाप्त होना चाहिए। शुरुआती चरण के बाद आवश्यक औसत दैनिक दर क्या है?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਲੱਗਦੇ ਹਨ ਅਤੇ ਉਹ ਪਹਿਲਾਂ ${durationA()} ਕੰਮ ਕਰਦਾ ਹੈ। ਸਾਰਾ ਕੰਮ ਸ਼ੁਰੂ ਤੋਂ ${cp004Time(p, required(p.deadline, "deadline"), language)} ਦੇ ਅੰਦਰ ਮੁਕੰਮਲ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਪੜਾਅ ਤੋਂ ਬਾਅਦ ਲੋੜੀਂਦੀ ਔਸਤ ਰੋਜ਼ਾਨਾ ਦਰ ਕੀ ਹੈ?`,
      );
    case "findWorkerCountAddedAfterPartialProgress":
      return cp004Copy(
        language,
        `एक कर्मचारी अकेले ${assignment} को ${cp004Time(p, required(p.perWorkerTime, "perWorkerTime"), language)} में पूरा कर सकता है। शुरू में ${required(p.initialWorkerCount, "initialWorkerCount")} समान कार्यक्षमता वाले कर्मचारी ${durationA()} साथ काम करते हैं। शुरू से ${cp004Time(p, required(p.deadline, "deadline"), language)} में काम पूरा करने के लिए इसके बाद कितने अतिरिक्त कर्मचारी जोड़ने होंगे?`,
        `ਇੱਕ ਕਰਮਚਾਰੀ ਇਕੱਲਾ ${assignment} ਨੂੰ ${cp004Time(p, required(p.perWorkerTime, "perWorkerTime"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${required(p.initialWorkerCount, "initialWorkerCount")} ਇੱਕੋ ਕਾਰਗੁਜ਼ਾਰੀ ਵਾਲੇ ਕਰਮਚਾਰੀ ${durationA()} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ। ਸ਼ੁਰੂ ਤੋਂ ${cp004Time(p, required(p.deadline, "deadline"), language)} ਵਿੱਚ ਕੰਮ ਪੂਰਾ ਕਰਨ ਲਈ ਇਸ ਤੋਂ ਬਾਅਦ ਕਿੰਨੇ ਵਾਧੂ ਕਰਮਚਾਰੀ ਜੋੜਣੇ ਪੈਣਗੇ?`,
      );
    case "findWorkerCountRemovedAfterPartialProgress":
      return cp004Copy(
        language,
        `एक कर्मचारी अकेले ${assignment} को ${cp004Time(p, required(p.perWorkerTime, "perWorkerTime"), language)} में पूरा कर सकता है। शुरू में ${required(p.initialWorkerCount, "initialWorkerCount")} समान कार्यक्षमता वाले कर्मचारी ${durationA()} साथ काम करते हैं, फिर कुछ कर्मचारी चले जाते हैं। यदि काम शुरू से ${cp004Time(p, required(p.deadline, "deadline"), language)} में पूरा होता है, तो कितने कर्मचारी गए?`,
        `ਇੱਕ ਕਰਮਚਾਰੀ ਇਕੱਲਾ ${assignment} ਨੂੰ ${cp004Time(p, required(p.perWorkerTime, "perWorkerTime"), language)} ਵਿੱਚ ਪੂਰਾ ਕਰ ਸਕਦਾ ਹੈ। ਸ਼ੁਰੂ ਵਿੱਚ ${required(p.initialWorkerCount, "initialWorkerCount")} ਇੱਕੋ ਕਾਰਗੁਜ਼ਾਰੀ ਵਾਲੇ ਕਰਮਚਾਰੀ ${durationA()} ਇਕੱਠੇ ਕੰਮ ਕਰਦੇ ਹਨ, ਫਿਰ ਕੁਝ ਕਰਮਚਾਰੀ ਚਲੇ ਜਾਂਦੇ ਹਨ। ਜੇ ਕੰਮ ਸ਼ੁਰੂ ਤੋਂ ${cp004Time(p, required(p.deadline, "deadline"), language)} ਵਿੱਚ ਪੂਰਾ ਹੁੰਦਾ ਹੈ, ਤਾਂ ਕਿੰਨੇ ਕਰਮਚਾਰੀ ਗਏ?`,
      );
    case "findDelayAfterWorkerLeaves":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। दोनों साथ शुरू करते हैं, पर ${durationA()} बाद ${B} चला जाता है और ${A} अकेले शेष काम पूरा करता है। दोनों के अंत तक साथ काम करने की स्थिति की तुलना में कितनी देरी होती है?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ਦੋਵੇਂ ਇਕੱਠੇ ਸ਼ੁਰੂ ਕਰਦੇ ਹਨ, ਪਰ ${durationA()} ਬਾਅਦ ${B} ਚਲਾ ਜਾਂਦਾ ਹੈ ਅਤੇ ${A} ਇਕੱਲਾ ਬਾਕੀ ਕੰਮ ਪੂਰਾ ਕਰਦਾ ਹੈ। ਦੋਵਾਂ ਦੇ ਅੰਤ ਤੱਕ ਇਕੱਠੇ ਕੰਮ ਕਰਨ ਵਾਲੀ ਸਥਿਤੀ ਨਾਲੋਂ ਕਿੰਨੀ ਦੇਰੀ ਹੁੰਦੀ ਹੈ?`,
      );
    case "findEarlyCompletionAfterWorkerJoins":
      return cp004Copy(
        language,
        `${assignment} को अकेले पूरा करने में ${A} को ${timeA()} और ${B} को ${timeB()} लगते हैं। ${A} अकेले शुरू करता है और ${durationA()} बाद ${B} जुड़ता है। केवल ${A} के अंत तक अकेले काम करने की तुलना में काम कितने समय पहले पूरा होगा?`,
        `${assignment} ਨੂੰ ਇਕੱਲੇ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${A} ਨੂੰ ${timeA()} ਅਤੇ ${B} ਨੂੰ ${timeB()} ਲੱਗਦੇ ਹਨ। ${A} ਇਕੱਲਾ ਸ਼ੁਰੂ ਕਰਦਾ ਹੈ ਅਤੇ ${durationA()} ਬਾਅਦ ${B} ਜੁੜਦਾ ਹੈ। ਸਿਰਫ਼ ${A} ਦੇ ਅੰਤ ਤੱਕ ਇਕੱਲੇ ਕੰਮ ਕਰਨ ਵਾਲੀ ਸਥਿਤੀ ਨਾਲੋਂ ਕੰਮ ਕਿੰਨਾ ਸਮਾਂ ਪਹਿਲਾਂ ਪੂਰਾ ਹੋਵੇਗਾ?`,
      );
  }
}
