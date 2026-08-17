import { percent, required } from "./cp001-helpers";
import { reciprocal } from "./rational";
import type { TmwCp001Parameters, TmwCp001SolveMode, TmwGeneratedQuestion, TmwMisconceptionId } from "./types";
import {
  displayLocale,
  type TmwLocalizedLanguage,
  type TmwLocalizedQuestion,
} from "./localization-types";
import {
  formatLocalizedTime,
  localizeAnswerText,
  localizedContext,
  localizedNumber,
  localizedOptionLabel,
  localizedPerUnit,
  localizeMathStep,
} from "./localization-glossary";

function copy(language: TmwLocalizedLanguage, hi: string, pa: string): string {
  return language === "hi" ? hi : pa;
}

function renderLocalizedStem(source: TmwGeneratedQuestion, language: TmwLocalizedLanguage): string {
  const entry = source.solveMode;
  const p = source.parameters;
  const actor = localizedContext(p.context.actor, language);
  const peer = localizedContext(p.context.peerActor, language);
  const object = localizedContext(p.context.object, language);
  const job = localizedContext(p.context.jobPhrase, language);
  const rate = localizedNumber(p.rate);
  const total = localizedNumber(p.totalWork);
  const elapsed = formatLocalizedTime(p.time, p.timeUnit, language);
  const perUnit = localizedPerUnit(p.timeUnit, language);
  const completionTime = reciprocal(p.rate);
  const completion = formatLocalizedTime(completionTime, p.timeUnit, language);
  const fraction = localizedNumber(required(p.requestedFraction, "requestedFraction"));

  switch (entry) {
    case "findWorkFromRateAndTime":
      return copy(language,
        `${actor} की उत्पादन दर ${perUnit} ${rate} ${object} है। ${elapsed} में कुल कितना उत्पादन होगा?`,
        `${actor} ਦੀ ਉਤਪਾਦਨ ਦਰ ${perUnit} ${rate} ${object} ਹੈ। ${elapsed} ਵਿੱਚ ਕੁੱਲ ਕਿੰਨਾ ਉਤਪਾਦਨ ਹੋਵੇਗਾ?`);
    case "findRateFromWorkAndTime":
      return copy(language,
        `${actor} द्वारा ${elapsed} में ${total} ${object} पूरे किए जाते हैं। ${perUnit} औसत उत्पादन कितना है?`,
        `${actor} ਵੱਲੋਂ ${elapsed} ਵਿੱਚ ${total} ${object} ਪੂਰੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। ${perUnit} ਔਸਤ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੈ?`);
    case "findTimeFromWorkAndRate":
      return copy(language,
        `${actor} की कार्य-दर ${perUnit} ${rate} ${object} है। ${total} ${object} पूरे करने में कितना समय लगेगा?`,
        `${actor} ਦੀ ਕੰਮ ਦੀ ਦਰ ${perUnit} ${rate} ${object} ਹੈ। ${total} ${object} ਪੂਰੇ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    case "findOneUnitWorkFromCompletionTime":
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। एक ${localizedContext(p.timeUnit, language)} में काम का कितना भाग पूरा होगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਇੱਕ ${localizedContext(p.timeUnit, language)} ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findCompletionTimeFromOneUnitWork":
      return copy(language,
        `${actor} द्वारा एक ${localizedContext(p.timeUnit, language)} में ${job} का ${rate} भाग पूरा किया जाता है। पूरा काम कितने समय में होगा?`,
        `${actor} ਵੱਲੋਂ ਇੱਕ ${localizedContext(p.timeUnit, language)} ਵਿੱਚ ${job} ਦਾ ${rate} ਹਿੱਸਾ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਹੋਵੇਗਾ?`);
    case "findFractionCompletedInGivenTime":
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। ${elapsed} में काम का कितना भाग पूरा होगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ${elapsed} ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findPercentCompletedInGivenTime":
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। ${elapsed} में काम का कितने प्रतिशत भाग पूरा होगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ${elapsed} ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findTimeForGivenFraction":
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। काम का ${fraction} भाग पूरा करने में कितना समय लगेगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    case "findTimeForGivenPercent": {
      const targetPercent = localizedNumber(percent(required(p.requestedFraction, "requestedFraction")));
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। काम का ${targetPercent}% भाग पूरा करने में कितना समय लगेगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਕੰਮ ਦਾ ${targetPercent}% ਹਿੱਸਾ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    }
    case "findRemainingFractionAfterTime":
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। ${elapsed} के बाद काम का कितना भाग बाकी रहेगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ${elapsed} ਤੋਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ?`);
    case "findRemainingPercentAfterTime":
      return copy(language,
        `${actor} द्वारा ${job} ${completion} में पूरा किया जाता है। ${elapsed} के बाद काम का कितने प्रतिशत भाग बाकी रहेगा?`,
        `${actor} ਵੱਲੋਂ ${job} ${completion} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ${elapsed} ਤੋਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ?`);
    case "findOutputFromUnitRateAndTime":
      return copy(language,
        `${actor} की उत्पादन दर ${perUnit} ${rate} ${object} है। ${elapsed} में कुल उत्पादन कितना होगा?`,
        `${actor} ਦੀ ਉਤਪਾਦਨ ਦਰ ${perUnit} ${rate} ${object} ਹੈ। ${elapsed} ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`);
    case "recoverWholeWorkFromPartAndFraction": {
      const part = localizedNumber(required(p.partWork, "partWork"));
      return copy(language,
        `${actor} द्वारा ${part} ${object} पूरे किए गए हैं, जो नियोजित काम का ${fraction} भाग है। कुल नियोजित मात्रा कितनी है?`,
        `${actor} ਵੱਲੋਂ ${part} ${object} ਪੂਰੇ ਕੀਤੇ ਗਏ ਹਨ, ਜੋ ਯੋਜਿਤ ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ਹੈ। ਕੁੱਲ ਯੋਜਿਤ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?`);
    }
    case "recoverWholeTimeFromPartCompletion": {
      const partTime = formatLocalizedTime(required(p.partTime, "partTime"), p.timeUnit, language);
      return copy(language,
        `${actor} द्वारा ${partTime} में ${job} का ${fraction} भाग पूरा किया जाता है। उसी दर से पूरा काम कितने समय में होगा?`,
        `${actor} ਵੱਲੋਂ ${partTime} ਵਿੱਚ ${job} ਦਾ ${fraction} ਹਿੱਸਾ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਉਸੇ ਦਰ ਨਾਲ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਹੋਵੇਗਾ?`);
    }
    case "convertRateAcrossTimeUnits": {
      const sourceDuration = formatLocalizedTime(required(p.sourceDuration, "sourceDuration"), p.timeUnit, language);
      const targetDuration = formatLocalizedTime(required(p.targetDuration, "targetDuration"), p.timeUnit, language);
      return copy(language,
        `${actor} द्वारा ${sourceDuration} में ${total} ${object} पूरे किए जाते हैं। उसी दर से ${targetDuration} में कितने ${object} पूरे होंगे?`,
        `${actor} ਵੱਲੋਂ ${sourceDuration} ਵਿੱਚ ${total} ${object} ਪੂਰੇ ਕੀਤੇ ਜਾਂਦੇ ਹਨ। ਉਸੇ ਦਰ ਨਾਲ ${targetDuration} ਵਿੱਚ ਕਿੰਨੇ ${object} ਪੂਰੇ ਹੋਣਗੇ?`);
    }
    case "compareWorkCompletedAtEqualTime": {
      const secondRate = localizedNumber(required(p.secondaryRate, "secondaryRate"));
      return copy(language,
        `${actor} की दर ${perUnit} ${rate} ${object} और ${peer} की दर ${perUnit} ${secondRate} ${object} है। ${elapsed} में पहला कितने अधिक ${object} पूरे करेगा?`,
        `${actor} ਦੀ ਦਰ ${perUnit} ${rate} ${object} ਅਤੇ ${peer} ਦੀ ਦਰ ${perUnit} ${secondRate} ${object} ਹੈ। ${elapsed} ਵਿੱਚ ਪਹਿਲਾ ਕਿੰਨੇ ਵੱਧ ${object} ਪੂਰੇ ਕਰੇਗਾ?`);
    }
    case "compareTimeForDifferentWorkAtSameRate": {
      const secondWork = localizedNumber(required(p.secondaryWork, "secondaryWork"));
      return copy(language,
        `${actor} की दर ${perUnit} ${rate} ${object} है। ${total} ${object} पूरे करने में ${secondWork} ${object} की तुलना में कितना अधिक समय लगेगा?`,
        `${actor} ਦੀ ਦਰ ${perUnit} ${rate} ${object} ਹੈ। ${total} ${object} ਪੂਰੇ ਕਰਨ ਵਿੱਚ ${secondWork} ${object} ਨਾਲੋਂ ਕਿੰਨਾ ਵੱਧ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    }
    case "findRequiredRateForTargetCompletion":
      return copy(language,
        `${actor} को ${total} ${object} ${elapsed} में पूरे करने हैं। आवश्यक समान कार्य-दर ${perUnit} कितनी होनी चाहिए?`,
        `${actor} ਨੇ ${total} ${object} ${elapsed} ਵਿੱਚ ਪੂਰੇ ਕਰਨੇ ਹਨ। ਲੋੜੀਂਦੀ ਇੱਕਸਾਰ ਕੰਮ ਦੀ ਦਰ ${perUnit} ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`);
    case "findDelayFromReducedUniformRate": {
      const oldTime = formatLocalizedTime(required(p.originalTime, "originalTime"), p.timeUnit, language);
      const change = localizedNumber(required(p.changePercent, "changePercent"));
      return copy(language,
        `${actor} द्वारा ${job} सामान्यतः ${oldTime} में पूरा किया जाता है। कार्य-दर ${change}% घटने पर कितनी देरी होगी?`,
        `${actor} ਵੱਲੋਂ ${job} ਆਮ ਤੌਰ ਤੇ ${oldTime} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਕੰਮ ਦੀ ਦਰ ${change}% ਘਟਣ ਤੇ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇਗੀ?`);
    }
    case "findTimeSavedFromIncreasedUniformRate": {
      const oldTime = formatLocalizedTime(required(p.originalTime, "originalTime"), p.timeUnit, language);
      const change = localizedNumber(required(p.changePercent, "changePercent"));
      return copy(language,
        `${actor} द्वारा ${job} सामान्यतः ${oldTime} में पूरा किया जाता है। कार्य-दर ${change}% बढ़ने पर कितना समय बचेगा?`,
        `${actor} ਵੱਲੋਂ ${job} ਆਮ ਤੌਰ ਤੇ ${oldTime} ਵਿੱਚ ਪੂਰਾ ਕੀਤਾ ਜਾਂਦਾ ਹੈ। ਕੰਮ ਦੀ ਦਰ ${change}% ਵਧਣ ਤੇ ਕਿੰਨਾ ਸਮਾਂ ਬਚੇਗਾ?`);
    }
  }
}

const openingCopy: Record<TmwCp001SolveMode, { hi: string; pa: string }> = {
  findWorkFromRateAndTime: { hi: "कुल काम निकालने के लिए कार्य-दर को समय से गुणा करें।", pa: "ਕੁੱਲ ਕੰਮ ਕੱਢਣ ਲਈ ਕੰਮ ਦੀ ਦਰ ਨੂੰ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।" },
  findRateFromWorkAndTime: { hi: "औसत कार्य-दर, पूरे किए गए काम को कुल समय से भाग देने पर मिलती है।", pa: "ਔਸਤ ਕੰਮ ਦੀ ਦਰ, ਪੂਰੇ ਕੀਤੇ ਕੰਮ ਨੂੰ ਕੁੱਲ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲਦੀ ਹੈ।" },
  findTimeFromWorkAndRate: { hi: "समय निकालने के लिए कुल काम को कार्य-दर से भाग दें।", pa: "ਸਮਾਂ ਕੱਢਣ ਲਈ ਕੁੱਲ ਕੰਮ ਨੂੰ ਕੰਮ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।" },
  findOneUnitWorkFromCompletionTime: { hi: "पूरे काम को 1 मानें; एक दिन का काम कुल समय का व्युत्क्रम होगा।", pa: "ਪੂਰੇ ਕੰਮ ਨੂੰ 1 ਮੰਨੋ; ਇੱਕ ਦਿਨ ਦਾ ਕੰਮ ਕੁੱਲ ਸਮੇਂ ਦਾ ਉਲਟ ਹੋਵੇਗਾ।" },
  findCompletionTimeFromOneUnitWork: { hi: "एक दिन में किए गए काम के भाग का व्युत्क्रम पूरा समय देता है।", pa: "ਇੱਕ ਦਿਨ ਵਿੱਚ ਕੀਤੇ ਕੰਮ ਦੇ ਹਿੱਸੇ ਦਾ ਉਲਟ ਪੂਰਾ ਸਮਾਂ ਦਿੰਦਾ ਹੈ।" },
  findFractionCompletedInGivenTime: { hi: "एक दिन का काम समय से गुणा करने पर पूरा किया गया भाग मिलता है।", pa: "ਇੱਕ ਦਿਨ ਦਾ ਕੰਮ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਪੂਰਾ ਕੀਤਾ ਹਿੱਸਾ ਮਿਲਦਾ ਹੈ।" },
  findPercentCompletedInGivenTime: { hi: "पहले पूरा किया गया भाग निकालें, फिर उसे प्रतिशत में बदलें।", pa: "ਪਹਿਲਾਂ ਪੂਰਾ ਕੀਤਾ ਹਿੱਸਾ ਕੱਢੋ, ਫਿਰ ਉਸ ਨੂੰ ਪ੍ਰਤੀਸ਼ਤ ਵਿੱਚ ਬਦਲੋ।" },
  findTimeForGivenFraction: { hi: "लक्षित भाग को एक दिन की कार्य-दर से भाग देने पर आवश्यक समय मिलता है।", pa: "ਟੀਚੇ ਵਾਲੇ ਹਿੱਸੇ ਨੂੰ ਇੱਕ ਦਿਨ ਦੀ ਕੰਮ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਲੋੜੀਂਦਾ ਸਮਾਂ ਮਿਲਦਾ ਹੈ।" },
  findTimeForGivenPercent: { hi: "प्रतिशत को पहले काम के भाग में बदलें, फिर कार्य-दर से भाग दें।", pa: "ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਪਹਿਲਾਂ ਕੰਮ ਦੇ ਹਿੱਸੇ ਵਿੱਚ ਬਦਲੋ, ਫਿਰ ਕੰਮ ਦੀ ਦਰ ਨਾਲ ਭਾਗ ਦਿਓ।" },
  findRemainingFractionAfterTime: { hi: "पहले पूरा किया गया भाग निकालें और उसे 1 से घटाएँ।", pa: "ਪਹਿਲਾਂ ਪੂਰਾ ਕੀਤਾ ਹਿੱਸਾ ਕੱਢੋ ਅਤੇ ਉਸ ਨੂੰ 1 ਵਿੱਚੋਂ ਘਟਾਓ।" },
  findRemainingPercentAfterTime: { hi: "बाकी प्रतिशत, पूरे काम में से किए गए प्रतिशत को घटाने पर मिलता है।", pa: "ਬਾਕੀ ਪ੍ਰਤੀਸ਼ਤ, ਪੂਰੇ ਕੰਮ ਵਿੱਚੋਂ ਕੀਤੇ ਪ੍ਰਤੀਸ਼ਤ ਨੂੰ ਘਟਾਉਣ ਤੇ ਮਿਲਦਾ ਹੈ।" },
  findOutputFromUnitRateAndTime: { hi: "कुल उत्पादन के लिए प्रति इकाई समय के उत्पादन को समय से गुणा करें।", pa: "ਕੁੱਲ ਉਤਪਾਦਨ ਲਈ ਪ੍ਰਤੀ ਇਕਾਈ ਸਮੇਂ ਦੇ ਉਤਪਾਦਨ ਨੂੰ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰੋ।" },
  recoverWholeWorkFromPartAndFraction: { hi: "ज्ञात भाग को उस भाग के भिन्न से भाग देने पर कुल काम मिलता है।", pa: "ਪਤਾ ਹਿੱਸੇ ਨੂੰ ਉਸ ਹਿੱਸੇ ਦੇ ਭਿੰਨ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਕੁੱਲ ਕੰਮ ਮਿਲਦਾ ਹੈ।" },
  recoverWholeTimeFromPartCompletion: { hi: "आंशिक काम के समय को उसके भिन्न से भाग देकर पूरा समय निकालें।", pa: "ਅਧੂਰੇ ਕੰਮ ਦੇ ਸਮੇਂ ਨੂੰ ਉਸ ਦੇ ਭਿੰਨ ਨਾਲ ਭਾਗ ਦੇ ਕੇ ਪੂਰਾ ਸਮਾਂ ਕੱਢੋ।" },
  convertRateAcrossTimeUnits: { hi: "पहले एक घंटे का उत्पादन निकालें, फिर माँगे गए समय तक बढ़ाएँ।", pa: "ਪਹਿਲਾਂ ਇੱਕ ਘੰਟੇ ਦਾ ਉਤਪਾਦਨ ਕੱਢੋ, ਫਿਰ ਮੰਗੇ ਸਮੇਂ ਤੱਕ ਵਧਾਓ।" },
  compareWorkCompletedAtEqualTime: { hi: "समान समय में काम का अंतर, दोनों दरों के अंतर को समय से गुणा करने पर मिलता है।", pa: "ਇੱਕੋ ਸਮੇਂ ਵਿੱਚ ਕੰਮ ਦਾ ਫਰਕ, ਦੋਵਾਂ ਦਰਾਂ ਦੇ ਫਰਕ ਨੂੰ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਕਰਨ ਤੇ ਮਿਲਦਾ ਹੈ।" },
  compareTimeForDifferentWorkAtSameRate: { hi: "समान दर पर समय का अंतर, काम के अंतर को दर से भाग देने पर मिलता है।", pa: "ਇੱਕੋ ਦਰ ਤੇ ਸਮੇਂ ਦਾ ਫਰਕ, ਕੰਮ ਦੇ ਫਰਕ ਨੂੰ ਦਰ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲਦਾ ਹੈ।" },
  findRequiredRateForTargetCompletion: { hi: "समय-सीमा के अनुसार आवश्यक दर, कुल काम को उपलब्ध समय से भाग देने पर मिलती है।", pa: "ਸਮਾਂ-ਸੀਮਾ ਅਨੁਸਾਰ ਲੋੜੀਂਦੀ ਦਰ, ਕੁੱਲ ਕੰਮ ਨੂੰ ਉਪਲਬਧ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦੇਣ ਤੇ ਮਿਲਦੀ ਹੈ।" },
  findDelayFromReducedUniformRate: { hi: "काम समान है; घटी हुई दर से नया कुल समय निकालकर पुराने समय से अंतर लें।", pa: "ਕੰਮ ਇੱਕੋ ਹੈ; ਘਟੀ ਦਰ ਨਾਲ ਨਵਾਂ ਕੁੱਲ ਸਮਾਂ ਕੱਢ ਕੇ ਪੁਰਾਣੇ ਸਮੇਂ ਨਾਲ ਫਰਕ ਲਵੋ।" },
  findTimeSavedFromIncreasedUniformRate: { hi: "काम समान है; बढ़ी हुई दर से नया समय निकालकर उसे पुराने समय से घटाएँ।", pa: "ਕੰਮ ਇੱਕੋ ਹੈ; ਵਧੀ ਦਰ ਨਾਲ ਨਵਾਂ ਸਮਾਂ ਕੱਢ ਕੇ ਉਸ ਨੂੰ ਪੁਰਾਣੇ ਸਮੇਂ ਵਿੱਚੋਂ ਘਟਾਓ।" },
};

const shortcutTitles: Record<TmwCp001SolveMode, { hi: string; pa: string }> = Object.fromEntries(
  Object.keys(openingCopy).map((mode) => [mode, {
    hi: "10-सेकंड तरीका",
    pa: "10-ਸਕਿੰਟ ਤਰੀਕਾ",
  }]),
) as Record<TmwCp001SolveMode, { hi: string; pa: string }>;

function trapReason(id: Exclude<TmwMisconceptionId, "CORRECT">, language: TmwLocalizedLanguage): string {
  const reasons: Record<Exclude<TmwMisconceptionId, "CORRECT">, { hi: string; pa: string }> = {
    RATE_TIME_ADDITION: { hi: "दर और समय को जोड़ दिया गया है, जबकि कुल काम के लिए गुणा करना चाहिए।", pa: "ਦਰ ਅਤੇ ਸਮੇਂ ਨੂੰ ਜੋੜਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਕੁੱਲ ਕੰਮ ਲਈ ਗੁਣਾ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।" },
    RATE_TIME_DIVISION: { hi: "दर को समय से भाग दिया गया है, जबकि दिए गए संबंध में ऐसा नहीं होता।", pa: "ਦਰ ਨੂੰ ਸਮੇਂ ਨਾਲ ਭਾਗ ਦਿੱਤਾ ਗਿਆ ਹੈ, ਜਦਕਿ ਦਿੱਤੇ ਸੰਬੰਧ ਵਿੱਚ ਇਹ ਨਹੀਂ ਹੁੰਦਾ।" },
    WORK_TIME_MULTIPLICATION: { hi: "दर निकालते समय काम और समय को गुणा कर दिया गया है; यहाँ भाग देना चाहिए।", pa: "ਦਰ ਕੱਢਦੇ ਸਮੇਂ ਕੰਮ ਅਤੇ ਸਮੇਂ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ; ਇੱਥੇ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।" },
    WORK_RATE_MULTIPLICATION: { hi: "समय निकालते समय काम और दर को गुणा कर दिया गया है; यहाँ भाग देना चाहिए।", pa: "ਸਮਾਂ ਕੱਢਦੇ ਸਮੇਂ ਕੰਮ ਅਤੇ ਦਰ ਨੂੰ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ; ਇੱਥੇ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।" },
    RECIPROCAL_NOT_TAKEN: { hi: "दर को ही समय मान लिया गया है, जबकि पूरा समय उसका व्युत्क्रम है।", pa: "ਦਰ ਨੂੰ ਹੀ ਸਮਾਂ ਮੰਨਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਪੂਰਾ ਸਮਾਂ ਉਸ ਦਾ ਉਲਟ ਹੈ।" },
    RECIPROCAL_WRONG_DENOMINATOR: { hi: "व्युत्क्रम बनाते समय गलत संख्या हर में रखी गई है।", pa: "ਉਲਟ ਬਣਾਉਂਦੇ ਸਮੇਂ ਗਲਤ ਸੰਖਿਆ ਹਰ ਵਿੱਚ ਰੱਖੀ ਗਈ ਹੈ।" },
    PERCENT_NOT_SCALED: { hi: "काम के भाग को 100 से गुणा किए बिना प्रतिशत मान लिया गया है।", pa: "ਕੰਮ ਦੇ ਹਿੱਸੇ ਨੂੰ 100 ਨਾਲ ਗੁਣਾ ਕੀਤੇ ਬਿਨਾਂ ਪ੍ਰਤੀਸ਼ਤ ਮੰਨਿਆ ਗਿਆ ਹੈ।" },
    COMPLETED_REPORTED_AS_REMAINING: { hi: "पूरा किया गया भाग बताया गया है, जबकि प्रश्न बाकी भाग पूछता है।", pa: "ਪੂਰਾ ਕੀਤਾ ਹਿੱਸਾ ਦੱਸਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਸਵਾਲ ਬਾਕੀ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।" },
    REMAINING_REPORTED_AS_COMPLETED: { hi: "बाकी भाग बताया गया है, जबकि प्रश्न पूरा किया गया भाग पूछता है।", pa: "ਬਾਕੀ ਹਿੱਸਾ ਦੱਸਿਆ ਗਿਆ ਹੈ, ਜਦਕਿ ਸਵਾਲ ਪੂਰਾ ਕੀਤਾ ਹਿੱਸਾ ਪੁੱਛਦਾ ਹੈ।" },
    TARGET_FRACTION_INVERTED: { hi: "लक्षित भाग और कार्य-दर का भाग उलटी दिशा में किया गया है।", pa: "ਟੀਚੇ ਵਾਲੇ ਹਿੱਸੇ ਅਤੇ ਕੰਮ ਦੀ ਦਰ ਦਾ ਭਾਗ ਉਲਟੀ ਦਿਸ਼ਾ ਵਿੱਚ ਕੀਤਾ ਗਿਆ ਹੈ।" },
    TARGET_COMPLEMENT_USED: { hi: "माँगे गए भाग के स्थान पर उसका बाकी भाग प्रयोग किया गया है।", pa: "ਮੰਗੇ ਹਿੱਸੇ ਦੀ ਥਾਂ ਉਸ ਦਾ ਬਾਕੀ ਹਿੱਸਾ ਵਰਤਿਆ ਗਿਆ ਹੈ।" },
    PART_MULTIPLIED_INSTEAD_OF_DIVIDED: { hi: "ज्ञात भाग को भिन्न से गुणा किया गया है, जबकि कुल मात्रा के लिए भाग देना चाहिए।", pa: "ਪਤਾ ਹਿੱਸੇ ਨੂੰ ਭਿੰਨ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ, ਜਦਕਿ ਕੁੱਲ ਮਾਤਰਾ ਲਈ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।" },
    PART_COMPLEMENT_USED: { hi: "ज्ञात भाग का वास्तविक भिन्न लेने के बजाय उसका पूरक लिया गया है।", pa: "ਪਤਾ ਹਿੱਸੇ ਦਾ ਅਸਲ ਭਿੰਨ ਲੈਣ ਦੀ ਥਾਂ ਉਸ ਦਾ ਪੂਰਕ ਲਿਆ ਗਿਆ ਹੈ।" },
    UNIT_CONVERSION_REVERSED: { hi: "समय की इकाइयों का अनुपात उलटा लगाया गया है।", pa: "ਸਮੇਂ ਦੀਆਂ ਇਕਾਈਆਂ ਦਾ ਅਨੁਪਾਤ ਉਲਟ ਲਾਇਆ ਗਿਆ ਹੈ।" },
    UNIT_CONVERSION_IGNORED: { hi: "माँगे गए समय के अनुसार उत्पादन को बदला ही नहीं गया है।", pa: "ਮੰਗੇ ਸਮੇਂ ਅਨੁਸਾਰ ਉਤਪਾਦਨ ਨੂੰ ਬਦਲਿਆ ਹੀ ਨਹੀਂ ਗਿਆ ਹੈ।" },
    COMPARISON_SUM_INSTEAD_OF_DIFFERENCE: { hi: "अंतर पूछे जाने पर दोनों मात्राओं को जोड़ दिया गया है।", pa: "ਫਰਕ ਪੁੱਛੇ ਜਾਣ ਤੇ ਦੋਵਾਂ ਮਾਤਰਾਵਾਂ ਨੂੰ ਜੋੜਿਆ ਗਿਆ ਹੈ।" },
    FIRST_QUANTITY_REPORTED: { hi: "तुलना का अंतर निकालने के बजाय पहली पूरी मात्रा ही बता दी गई है।", pa: "ਤੁਲਨਾ ਦਾ ਫਰਕ ਕੱਢਣ ਦੀ ਥਾਂ ਪਹਿਲੀ ਪੂਰੀ ਮਾਤਰਾ ਹੀ ਦੱਸੀ ਗਈ ਹੈ।" },
    SECOND_QUANTITY_REPORTED: { hi: "माँगी गई तुलना के बजाय दूसरी पूरी मात्रा बता दी गई है।", pa: "ਮੰਗੀ ਤੁਲਨਾ ਦੀ ਥਾਂ ਦੂਜੀ ਪੂਰੀ ਮਾਤਰਾ ਦੱਸੀ ਗਈ ਹੈ।" },
    REQUIRED_RATE_INVERTED: { hi: "आवश्यक दर के लिए काम ÷ समय के स्थान पर समय ÷ काम किया गया है।", pa: "ਲੋੜੀਂਦੀ ਦਰ ਲਈ ਕੰਮ ÷ ਸਮਾਂ ਦੀ ਥਾਂ ਸਮਾਂ ÷ ਕੰਮ ਕੀਤਾ ਗਿਆ ਹੈ।" },
    CHANGED_TOTAL_TIME_REPORTED: { hi: "प्रश्न देरी या बचत पूछता है, लेकिन बदला हुआ कुल समय बता दिया गया है।", pa: "ਸਵਾਲ ਦੇਰੀ ਜਾਂ ਬਚਤ ਪੁੱਛਦਾ ਹੈ, ਪਰ ਬਦਲਿਆ ਕੁੱਲ ਸਮਾਂ ਦੱਸਿਆ ਗਿਆ ਹੈ।" },
    ORIGINAL_TIME_REPORTED: { hi: "दर बदलने के बाद भी मूल समय को ही उत्तर मान लिया गया है।", pa: "ਦਰ ਬਦਲਣ ਤੋਂ ਬਾਅਦ ਵੀ ਮੂਲ ਸਮੇਂ ਨੂੰ ਹੀ ਉੱਤਰ ਮੰਨਿਆ ਗਿਆ ਹੈ।" },
    PERCENT_OF_TIME_ONLY: { hi: "नया कुल समय निकाले बिना सीधे पुराने समय का प्रतिशत ले लिया गया है।", pa: "ਨਵਾਂ ਕੁੱਲ ਸਮਾਂ ਕੱਢੇ ਬਿਨਾਂ ਸਿੱਧਾ ਪੁਰਾਣੇ ਸਮੇਂ ਦਾ ਪ੍ਰਤੀਸ਼ਤ ਲਿਆ ਗਿਆ ਹੈ।" },
  };
  return reasons[id][language];
}

function localizedConclusion(mode: TmwCp001SolveMode, answer: string, language: TmwLocalizedLanguage): string {
  switch (mode) {
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime": return copy(language, `अतः कुल उत्पादन ${answer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਉਤਪਾਦਨ ${answer} ਹੈ।`);
    case "findRateFromWorkAndTime": return copy(language, `अतः औसत कार्य-दर ${answer} है।`, `ਇਸ ਲਈ ਔਸਤ ਕੰਮ ਦੀ ਦਰ ${answer} ਹੈ।`);
    case "findTimeFromWorkAndRate":
    case "findCompletionTimeFromOneUnitWork":
    case "recoverWholeTimeFromPartCompletion": return copy(language, `अतः पूरा काम ${answer} में होगा।`, `ਇਸ ਲਈ ਪੂਰਾ ਕੰਮ ${answer} ਵਿੱਚ ਹੋਵੇਗਾ।`);
    case "findOneUnitWorkFromCompletionTime": return copy(language, `अतः एक इकाई समय में ${answer} पूरा होता है।`, `ਇਸ ਲਈ ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਵਿੱਚ ${answer} ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`);
    case "findFractionCompletedInGivenTime":
    case "findPercentCompletedInGivenTime": return copy(language, `अतः दिए गए समय में ${answer} पूरा होगा।`, `ਇਸ ਲਈ ਦਿੱਤੇ ਸਮੇਂ ਵਿੱਚ ${answer} ਪੂਰਾ ਹੋਵੇਗਾ।`);
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent": return copy(language, `अतः लक्षित भाग के लिए ${answer} चाहिए।`, `ਇਸ ਲਈ ਟੀਚੇ ਵਾਲੇ ਹਿੱਸੇ ਲਈ ${answer} ਚਾਹੀਦਾ ਹੈ।`);
    case "findRemainingFractionAfterTime":
    case "findRemainingPercentAfterTime": return copy(language, `अतः ${answer} बाकी रहेगा।`, `ਇਸ ਲਈ ${answer} ਬਾਕੀ ਰਹੇਗਾ।`);
    case "recoverWholeWorkFromPartAndFraction": return copy(language, `अतः कुल नियोजित मात्रा ${answer} है।`, `ਇਸ ਲਈ ਕੁੱਲ ਯੋਜਿਤ ਮਾਤਰਾ ${answer} ਹੈ।`);
    case "convertRateAcrossTimeUnits": return copy(language, `अतः माँगे गए समय का उत्पादन ${answer} है।`, `ਇਸ ਲਈ ਮੰਗੇ ਸਮੇਂ ਦਾ ਉਤਪਾਦਨ ${answer} ਹੈ।`);
    case "compareWorkCompletedAtEqualTime": return copy(language, `अतः पहला ${answer} अधिक पूरा करता है।`, `ਇਸ ਲਈ ਪਹਿਲਾ ${answer} ਵੱਧ ਪੂਰਾ ਕਰਦਾ ਹੈ।`);
    case "compareTimeForDifferentWorkAtSameRate": return copy(language, `अतः अधिक काम के लिए ${answer} अतिरिक्त लगेंगे।`, `ਇਸ ਲਈ ਵੱਧ ਕੰਮ ਲਈ ${answer} ਵਾਧੂ ਲੱਗਣਗੇ।`);
    case "findRequiredRateForTargetCompletion": return copy(language, `अतः आवश्यक कार्य-दर ${answer} है।`, `ਇਸ ਲਈ ਲੋੜੀਂਦੀ ਕੰਮ ਦੀ ਦਰ ${answer} ਹੈ।`);
    case "findDelayFromReducedUniformRate": return copy(language, `अतः काम में ${answer} की देरी होगी।`, `ਇਸ ਲਈ ਕੰਮ ਵਿੱਚ ${answer} ਦੀ ਦੇਰੀ ਹੋਵੇਗੀ।`);
    case "findTimeSavedFromIncreasedUniformRate": return copy(language, `अतः ${answer} बचेंगे।`, `ਇਸ ਲਈ ${answer} ਬਚਣਗੇ।`);
  }
}

function balancedInlineMath(value: string): boolean {
  return (value.match(/\\\(/g) ?? []).length === (value.match(/\\\)/g) ?? []).length;
}

export function localizeTmwCp001Question(source: TmwGeneratedQuestion, language: TmwLocalizedLanguage): TmwLocalizedQuestion {
  const optionAudit = source.optionAudit.map((option) => ({
    ...option,
    text: localizeAnswerText(option.text, language),
  }));
  const options = optionAudit.map((option) => option.text);
  const answerText = options[source.correctIndex]!;
  const sourceTrap = source.explanation.commonTrap;
  const trapIndex = source.optionAudit.findIndex((option) => option.misconceptionId === sourceTrap.misconceptionId);
  if (trapIndex < 0 || trapIndex === source.correctIndex) throw new Error(`${source.questionLanguageId}: CP-001 localisation cannot resolve the diagnostic trap`);
  const trap = optionAudit[trapIndex]!;
  const trapLabel = localizedOptionLabel(trapIndex, language);
  const opening = openingCopy[source.solveMode][language];
  const shortcutTitle = shortcutTitles[source.solveMode][language];
  const shortcutStep = copy(language,
    `${opening} इससे उत्तर ${answerText} मिलता है।`,
    `${opening} ਇਸ ਨਾਲ ਉੱਤਰ ${answerText} ਮਿਲਦਾ ਹੈ।`);
  const stem = renderLocalizedStem(source, language);
  const steps = source.explanation.steps.map((step) => localizeMathStep(step, language));
  const errors = [...source.validation.errors];

  if (!stem.trim() || !stem.endsWith("?")) errors.push("Localized stem is missing a direct target");
  if (options.length !== 4 || new Set(options).size !== 4) errors.push("Localized options are not four unique values");
  if (options[source.correctIndex] !== answerText) errors.push("Localized answer does not align with the correct option");
  if (!options.includes(trap.text)) errors.push("Localized common trap is not linked to an option");
  if (!balancedInlineMath([stem, ...options, ...steps].join("\n"))) errors.push("Localized learner text has unbalanced MathJax");
  if (language === "hi" && !/[\u0900-\u097F]/.test(stem)) errors.push("Hindi stem does not contain Devanagari text");
  if (language === "pa" && !/[\u0A00-\u0A7F]/.test(stem)) errors.push("Punjabi stem does not contain Gurmukhi text");
  if (/undefined|null|\{\{|\$\{/.test([stem, ...options].join(" "))) errors.push("Localized learner text contains an unresolved value");

  return {
    archetypeId: source.archetypeId,
    canonicalProblemId: source.canonicalProblemId,
    questionLanguageId: source.questionLanguageId,
    solveMode: source.solveMode,
    language,
    locale: displayLocale(language),
    sourceLanguage: "en",
    seed: source.seed,
    stem,
    parameters: source.parameters,
    solution: {
      ...source.solution,
      answerText,
    },
    options,
    optionAudit,
    correctIndex: source.correctIndex,
    explanation: {
      opening,
      formula: source.explanation.formula,
      steps,
      shortcut: {
        title: shortcutTitle,
        steps: [shortcutStep],
      },
      commonTrap: {
        optionLabel: trapLabel,
        optionText: trap.text,
        misconceptionId: trap.misconceptionId,
        explanation: copy(language,
          `${trapLabel} (${trap.text}) में यह गलती है: ${trapReason(trap.misconceptionId as Exclude<TmwMisconceptionId, "CORRECT">, language)}`,
          `${trapLabel} (${trap.text}) ਵਿੱਚ ਇਹ ਗਲਤੀ ਹੈ: ${trapReason(trap.misconceptionId as Exclude<TmwMisconceptionId, "CORRECT">, language)}`),
      },
      conclusion: localizedConclusion(source.solveMode, answerText, language),
    },
    mathematicalFingerprint: source.mathematicalFingerprint,
    validation: { valid: errors.length === 0, errors },
    editorialStatus: "PENDING",
    publiclyPublishable: false,
  };
}
