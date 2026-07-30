import { percent, required } from "./cp001-helpers";
import { reciprocal } from "./rational";
import type { TmwCp001Parameters, TmwCp001SolveMode } from "./types";
import type { TmwLocalizedLanguage, TmwLocalizedQuestion } from "./localization-types";
import {
  formatLocalizedTime,
  localizedContext,
  localizedNumber,
  localizedPerUnit,
} from "./localization-glossary";

function copy(language:TmwLocalizedLanguage,hi:string,pa:string):string{return language==="hi"?hi:pa;}

function polishedStem(question:TmwLocalizedQuestion,language:TmwLocalizedLanguage):string{
  const mode=question.solveMode as TmwCp001SolveMode;
  const p=question.parameters as TmwCp001Parameters;
  const actor=localizedContext(p.context.actor,language);
  const object=localizedContext(p.context.object,language);
  const rate=localizedNumber(p.rate);
  const total=localizedNumber(p.totalWork);
  const elapsed=formatLocalizedTime(p.time,p.timeUnit,language);
  const perUnit=localizedPerUnit(p.timeUnit,language);
  const completion=formatLocalizedTime(reciprocal(p.rate),p.timeUnit,language);
  const unit=localizedContext(p.timeUnit,language);
  const fraction=localizedNumber(required(p.requestedFraction,"requestedFraction"));
  const assignedWork=copy(language,"दिया गया काम","ਦਿੱਤਾ ਹੋਇਆ ਕੰਮ");

  switch(mode){
    case "findRateFromWorkAndTime":
      return copy(language,
        `${elapsed} में ${actor} का कुल उत्पादन ${total} ${object} है। ${perUnit} औसत उत्पादन कितना है?`,
        `${elapsed} ਵਿੱਚ ${actor} ਦਾ ਕੁੱਲ ਉਤਪਾਦਨ ${total} ${object} ਹਨ। ${perUnit} ਔਸਤ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੈ?`);
    case "findOneUnitWorkFromCompletionTime":
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। एक ${unit} में काम का कितना भाग पूरा होगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ਇੱਕ ${unit} ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findCompletionTimeFromOneUnitWork":
      return copy(language,
        `${actor} द्वारा एक ${unit} में ${assignedWork} का ${rate} भाग पूरा होता है। पूरा काम कितने समय में होगा?`,
        `${actor} ਵੱਲੋਂ ਇੱਕ ${unit} ਵਿੱਚ ${assignedWork} ਦਾ ${rate} ਹਿੱਸਾ ਪੂਰਾ ਹੁੰਦਾ ਹੈ। ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਹੋਵੇਗਾ?`);
    case "findFractionCompletedInGivenTime":
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। ${elapsed} में काम का कितना भाग पूरा होगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ${elapsed} ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findPercentCompletedInGivenTime":
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। ${elapsed} में काम का कितने प्रतिशत भाग पूरा होगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ${elapsed} ਵਿੱਚ ਕੰਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਪੂਰਾ ਹੋਵੇਗਾ?`);
    case "findTimeForGivenFraction":
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। काम का ${fraction} भाग पूरा करने में कितना समय लगेगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    case "findTimeForGivenPercent":{
      const target=localizedNumber(percent(required(p.requestedFraction,"requestedFraction")));
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। काम का ${target}% भाग पूरा करने में कितना समय लगेगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ਕੰਮ ਦਾ ${target}% ਹਿੱਸਾ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਕਿੰਨਾ ਸਮਾਂ ਲੱਗੇਗਾ?`);
    }
    case "findRemainingFractionAfterTime":
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। ${elapsed} के बाद काम का कितना भाग बाकी रहेगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ${elapsed} ਤੋਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨਾ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ?`);
    case "findRemainingPercentAfterTime":
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में ${completion} लगते हैं। ${elapsed} के बाद काम का कितने प्रतिशत भाग बाकी रहेगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${completion} ਲੱਗਦੇ ਹਨ। ${elapsed} ਤੋਂ ਬਾਅਦ ਕੰਮ ਦਾ ਕਿੰਨੇ ਪ੍ਰਤੀਸ਼ਤ ਹਿੱਸਾ ਬਾਕੀ ਰਹੇਗਾ?`);
    case "recoverWholeWorkFromPartAndFraction":{
      const part=localizedNumber(required(p.partWork,"partWork"));
      return copy(language,
        `${part} ${object}, कुल नियोजित काम का ${fraction} भाग है। कुल नियोजित मात्रा कितनी है?`,
        `${part} ${object}, ਕੁੱਲ ਯੋਜਿਤ ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ਹੈ। ਕੁੱਲ ਯੋਜਿਤ ਮਾਤਰਾ ਕਿੰਨੀ ਹੈ?`);
    }
    case "recoverWholeTimeFromPartCompletion":{
      const partTime=formatLocalizedTime(required(p.partTime,"partTime"),p.timeUnit,language);
      return copy(language,
        `${actor} को कुल काम का ${fraction} भाग पूरा करने में ${partTime} लगते हैं। उसी दर से पूरा काम कितने समय में होगा?`,
        `${actor} ਨੂੰ ਕੁੱਲ ਕੰਮ ਦਾ ${fraction} ਹਿੱਸਾ ਪੂਰਾ ਕਰਨ ਵਿੱਚ ${partTime} ਲੱਗਦੇ ਹਨ। ਉਸੇ ਦਰ ਨਾਲ ਪੂਰਾ ਕੰਮ ਕਿੰਨੇ ਸਮੇਂ ਵਿੱਚ ਹੋਵੇਗਾ?`);
    }
    case "convertRateAcrossTimeUnits":{
      const source=formatLocalizedTime(required(p.sourceDuration,"sourceDuration"),p.timeUnit,language);
      const target=formatLocalizedTime(required(p.targetDuration,"targetDuration"),p.timeUnit,language);
      return copy(language,
        `${source} में कुल उत्पादन ${total} ${object} है। उसी दर से ${target} में कुल उत्पादन कितना होगा?`,
        `${source} ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ${total} ${object} ਹੈ। ਉਸੇ ਦਰ ਨਾਲ ${target} ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ਕਿੰਨਾ ਹੋਵੇਗਾ?`);
    }
    case "compareWorkCompletedAtEqualTime":{
      const secondRate=localizedNumber(required(p.secondaryRate,"secondaryRate"));
      return copy(language,
        `${actor} की दर ${perUnit} ${rate} ${object} है, जबकि दूसरे की दर ${perUnit} ${secondRate} ${object} है। ${elapsed} में पहला कितना अधिक उत्पादन करेगा?`,
        `${actor} ਦੀ ਦਰ ${perUnit} ${rate} ${object} ਹੈ, ਜਦਕਿ ਦੂਜੇ ਦੀ ਦਰ ${perUnit} ${secondRate} ${object} ਹੈ। ${elapsed} ਵਿੱਚ ਪਹਿਲਾ ਕਿੰਨਾ ਵੱਧ ਉਤਪਾਦਨ ਕਰੇਗਾ?`);
    }
    case "findRequiredRateForTargetCompletion":
      return copy(language,
        `${actor} को ${elapsed} में ${total} ${object} का काम पूरा करना है। आवश्यक समान कार्य-दर ${perUnit} कितनी होनी चाहिए?`,
        `${actor} ਨੇ ${elapsed} ਵਿੱਚ ${total} ${object} ਦਾ ਕੰਮ ਪੂਰਾ ਕਰਨਾ ਹੈ। ਲੋੜੀਂਦੀ ਇੱਕਸਾਰ ਕੰਮ ਦੀ ਦਰ ${perUnit} ਕਿੰਨੀ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ?`);
    case "findDelayFromReducedUniformRate":{
      const oldTime=formatLocalizedTime(required(p.originalTime,"originalTime"),p.timeUnit,language);
      const change=localizedNumber(required(p.changePercent,"changePercent"));
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में सामान्यतः ${oldTime} लगते हैं। कार्य-दर ${change}% घटने पर कितनी देरी होगी?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਆਮ ਤੌਰ ਤੇ ${oldTime} ਲੱਗਦੇ ਹਨ। ਕੰਮ ਦੀ ਦਰ ${change}% ਘਟਣ ਤੇ ਕਿੰਨੀ ਦੇਰੀ ਹੋਵੇਗੀ?`);
    }
    case "findTimeSavedFromIncreasedUniformRate":{
      const oldTime=formatLocalizedTime(required(p.originalTime,"originalTime"),p.timeUnit,language);
      const change=localizedNumber(required(p.changePercent,"changePercent"));
      return copy(language,
        `${actor} को ${assignedWork} पूरा करने में सामान्यतः ${oldTime} लगते हैं। कार्य-दर ${change}% बढ़ने पर कितना समय बचेगा?`,
        `${actor} ਨੂੰ ${assignedWork} ਪੂਰਾ ਕਰਨ ਵਿੱਚ ਆਮ ਤੌਰ ਤੇ ${oldTime} ਲੱਗਦੇ ਹਨ। ਕੰਮ ਦੀ ਦਰ ${change}% ਵਧਣ ਤੇ ਕਿੰਨਾ ਸਮਾਂ ਬਚੇਗਾ?`);
    }
    default:return question.stem;
  }
}

function polishTrap(question:TmwLocalizedQuestion,language:TmwLocalizedLanguage):void{
  const trap=question.explanation.commonTrap;
  const prefix=`${trap.optionLabel} (${trap.optionText})`;
  if(question.solveMode==="findFractionCompletedInGivenTime"&&trap.misconceptionId==="FIRST_QUANTITY_REPORTED"){
    trap.explanation=copy(language,
      `${prefix} में यह गलती है: केवल एक इकाई समय का काम बताया गया है; दिए गए पूरे समय से गुणा नहीं किया गया।`,
      `${prefix} ਵਿੱਚ ਇਹ ਗਲਤੀ ਹੈ: ਸਿਰਫ਼ ਇੱਕ ਇਕਾਈ ਸਮੇਂ ਦਾ ਕੰਮ ਦੱਸਿਆ ਗਿਆ ਹੈ; ਦਿੱਤੇ ਪੂਰੇ ਸਮੇਂ ਨਾਲ ਗੁਣਾ ਨਹੀਂ ਕੀਤਾ ਗਿਆ।`);
  }
  if(question.solveMode==="recoverWholeTimeFromPartCompletion"&&trap.misconceptionId==="PART_MULTIPLIED_INSTEAD_OF_DIVIDED"){
    trap.explanation=copy(language,
      `${prefix} में यह गलती है: आंशिक समय को भिन्न से गुणा किया गया है; पूरा समय निकालने के लिए भाग देना चाहिए।`,
      `${prefix} ਵਿੱਚ ਇਹ ਗਲਤੀ ਹੈ: ਅਧੂਰੇ ਸਮੇਂ ਨੂੰ ਭਿੰਨ ਨਾਲ ਗੁਣਾ ਕੀਤਾ ਗਿਆ ਹੈ; ਪੂਰਾ ਸਮਾਂ ਕੱਢਣ ਲਈ ਭਾਗ ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।`);
  }
}

function polishConclusion(question:TmwLocalizedQuestion,language:TmwLocalizedLanguage):void{
  const answer=question.solution.answerText;
  if(question.solveMode==="findOneUnitWorkFromCompletionTime"){
    question.explanation.conclusion=copy(language,`अतः ${answer} पूरा होता है।`,`ਇਸ ਲਈ ${answer} ਪੂਰਾ ਹੁੰਦਾ ਹੈ।`);
  }
  if(question.solveMode==="convertRateAcrossTimeUnits"){
    question.explanation.conclusion=copy(language,`अतः माँगे गए समय में कुल उत्पादन ${answer} होगा।`,`ਇਸ ਲਈ ਮੰਗੇ ਸਮੇਂ ਵਿੱਚ ਕੁੱਲ ਉਤਪਾਦਨ ${answer} ਹੋਵੇਗਾ।`);
  }
  if(question.solveMode==="compareWorkCompletedAtEqualTime"){
    question.explanation.conclusion=copy(language,`अतः पहला ${answer} अधिक उत्पादन करता है।`,`ਇਸ ਲਈ ਪਹਿਲਾ ${answer} ਵੱਧ ਉਤਪਾਦਨ ਕਰਦਾ ਹੈ।`);
  }
}

export function polishTmwCp001LocalizedQuestion(question:TmwLocalizedQuestion,language:TmwLocalizedLanguage):TmwLocalizedQuestion{
  const polished={...question,explanation:{...question.explanation,commonTrap:{...question.explanation.commonTrap}}};
  polished.stem=polishedStem(polished,language);
  polishTrap(polished,language);
  polishConclusion(polished,language);
  return polished;
}
