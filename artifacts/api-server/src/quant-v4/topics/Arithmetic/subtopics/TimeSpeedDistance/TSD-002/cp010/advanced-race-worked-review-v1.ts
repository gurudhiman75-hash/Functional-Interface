import { rational } from "../../TSD-001/foundation/rational";
import { calculationWriter,EDITORIAL_REVIEW_LOCK,type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW } from "./exam-paper-review-final-v3-all";
const sources=[TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW] as const;
const locales:readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
export const TSD_CP010_ADVANCED_RACE_WORKED_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(q=>["transitiveRaceComparison","multiOutcomeRaceComparison","changedRaceOutcomeState","runnerStateFromTwoRaceOutcomes"].includes(q.input.authorityKey)).map(source=>{
 const i=source.input,w=calculationWriter(locales[index]);let answer;
 const difference=["Winning distance","जीत की दूरी","ਜਿੱਤ ਦੀ ਦੂਰੀ"] as const;
 const ratioLabel=["Slower to faster speed ratio","धीमे और तेज़ धावक की चाल का अनुपात","ਹੌਲੀ ਅਤੇ ਤੇਜ਼ ਦੌੜਾਕ ਦੀ ਚਾਲ ਦਾ ਅਨੁਪਾਤ"] as const;
 if(i.authorityKey==="transitiveRaceComparison"){
  const b=w.binary(["B distance when A finishes","A के पहुँचने तक B की दूरी","A ਦੇ ਪਹੁੰਚਣ ਤੱਕ B ਦੀ ਦੂਰੀ"],i.raceDistance,"−",i.aBeatsBBy,"m");
  const c=w.binary(["C distance when B finishes","B के पहुँचने तक C की दूरी","B ਦੇ ਪਹੁੰਚਣ ਤੱਕ C ਦੀ ਦੂਰੀ"],i.raceDistance,"−",i.bBeatsCBy,"m");
  const ratio=w.binary(["C to B speed ratio","C और B की चाल का अनुपात","C ਅਤੇ B ਦੀ ਚਾਲ ਦਾ ਅਨੁਪਾਤ"],c,"÷",i.raceDistance,"");
  const position=w.binary(["C distance when A finishes","A के पहुँचने तक C की दूरी","A ਦੇ ਪਹੁੰਚਣ ਤੱਕ C ਦੀ ਦੂਰੀ"],b,"×",ratio,"m");
  answer=w.binary(difference,i.raceDistance,"−",position,"m");
 }else if(i.authorityKey==="multiOutcomeRaceComparison"){
  const covered=w.binary(["Slower runner first-race distance","पहली दौड़ में धीमे धावक की दूरी","ਪਹਿਲੀ ਦੌੜ ਵਿੱਚ ਹੌਲੀ ਦੌੜਾਕ ਦੀ ਦੂਰੀ"],i.firstRaceDistance,"−",i.firstRaceLead,"m");
  const ratio=w.binary(ratioLabel,covered,"÷",i.firstRaceDistance,"");
  const travel=w.binary(["Slower runner second-race travel","दूसरी दौड़ में धीमे धावक की तय दूरी","ਦੂਜੀ ਦੌੜ ਵਿੱਚ ਹੌਲੀ ਦੌੜਾਕ ਦੀ ਤੈਅ ਦੂਰੀ"],ratio,"×",i.secondRaceDistance,"m");
  const position=w.binary(["Position including head start","बढ़त सहित दूरी","ਅਗੇਤ ਸਮੇਤ ਦੂਰੀ"],travel,"+",i.secondRaceHeadStartForLoser,"m");
  answer=w.binary(difference,i.secondRaceDistance,"−",position,"m");
 }else if(i.authorityKey==="changedRaceOutcomeState"){
  const speed=i.mode==="FASTER_SPEED_CHANGE"?i.changedFasterSpeed:i.fasterSpeed;
  if(!speed)throw new Error("Missing speed");
  const fastTime=w.binary(["Faster runner travel time","तेज़ धावक का दौड़ने का समय","ਤੇਜ਼ ਦੌੜਾਕ ਦਾ ਦੌੜਨ ਦਾ ਸਮਾਂ"],i.raceDistance,"÷",speed,"s");
  let slowTime=fastTime;
  if(i.mode==="SLOWER_REST"){
   if(!i.slowerRestTime)throw new Error("Missing rest");
   slowTime=w.binary(["Slower runner moving time","धीमे धावक का चलने का समय","ਹੌਲੀ ਦੌੜਾਕ ਦਾ ਚੱਲਣ ਦਾ ਸਮਾਂ"],fastTime,"−",i.slowerRestTime,"s");
  }else if(i.mode==="FASTER_START_DELAY"){
   if(!i.fasterStartDelay)throw new Error("Missing delay");
   slowTime=w.binary(["Elapsed time from first departure","पहले धावक के शुरू करने से कुल समय","ਪਹਿਲੇ ਦੌੜਾਕ ਦੇ ਸ਼ੁਰੂ ਕਰਨ ਤੋਂ ਕੁੱਲ ਸਮਾਂ"],fastTime,"+",i.fasterStartDelay,"s");
  }
  const covered=w.binary(["Slower runner distance","धीमे धावक की दूरी","ਹੌਲੀ ਦੌੜਾਕ ਦੀ ਦੂਰੀ"],i.slowerSpeed,"×",slowTime,"m");
  answer=w.binary(difference,i.raceDistance,"−",covered,"m");
 }else if(i.authorityKey==="runnerStateFromTwoRaceOutcomes"){
  const covered=w.binary(["Slower runner first-race distance","पहली दौड़ में धीमे धावक की दूरी","ਪਹਿਲੀ ਦੌੜ ਵਿੱਚ ਹੌਲੀ ਦੌੜਾਕ ਦੀ ਦੂਰੀ"],i.firstRaceDistance,"−",i.firstRaceDistanceLead,"m");
  const ratio=w.binary(ratioLabel,covered,"÷",i.firstRaceDistance,"");
  const fraction=w.binary(["Winning fraction","जीत की दूरी का अंश","ਜਿੱਤ ਦੀ ਦੂਰੀ ਦਾ ਹਿੱਸਾ"],rational(1),"−",ratio,"");
  const numerator=w.binary(["Second-race lead at faster finish","दूसरी दौड़ में जीत की दूरी","ਦੂਜੀ ਦੌੜ ਵਿੱਚ ਜਿੱਤ ਦੀ ਦੂਰੀ"],i.secondRaceDistance,"×",fraction,"m");
  const denominator=w.binary(["Time gap multiplied by speed ratio","समय अंतर और चाल अनुपात का गुणनफल","ਸਮੇਂ ਦੇ ਫ਼ਰਕ ਅਤੇ ਚਾਲ ਅਨੁਪਾਤ ਦਾ ਗੁਣਨਫਲ"],i.secondRaceTimeLead,"×",ratio,"s");
  const fast=w.binary(["Faster speed","तेज़ धावक की चाल","ਤੇਜ਼ ਦੌੜਾਕ ਦੀ ਚਾਲ"],numerator,"÷",denominator,"m/s");
  const slow=w.binary(["Slower speed","धीमे धावक की चाल","ਹੌਲੀ ਦੌੜਾਕ ਦੀ ਚਾਲ"],fast,"×",ratio,"m/s");
  answer=i.target==="FASTER_SPEED"?fast:slow;
 }else throw new Error("Wrong authority");
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator)throw new Error("Source answer mismatch");
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP010-ADVANCED-RACE-WORKED-V1",calculations:Object.freeze(w.steps),computedAnswer:answer,explanation:Object.freeze({steps:Object.freeze(w.steps.map(s=>s.text)),conclusion:source.explanation.conclusion})});
})));
