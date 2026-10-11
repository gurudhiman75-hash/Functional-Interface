import { rational } from "../../TSD-001/foundation/rational";
import { calculationWriter,EDITORIAL_REVIEW_LOCK,type ReviewLocale } from "../../quality-audit/worked-calculation";
import { TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW } from "./exam-paper-review-final-v3-all";
const sources=[TSD_CP010_EXAM_PAPER_V3_ENGLISH_REVIEW,TSD_CP010_EXAM_PAPER_V3_HINDI_REVIEW,TSD_CP010_EXAM_PAPER_V3_PUNJABI_REVIEW] as const;
const locales:readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
export const TSD_CP010_RACE_EVIDENCE_WORKED_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(q=>["finishDistanceLeadState","raceSpeedRatioState","raceLengthFromLeadEvidence","leadConversionState"].includes(q.input.authorityKey)).map(source=>{
 const i=source.input,w=calculationWriter(locales[index]);let answer;
 const distanceLabel=["Race distance","दौड़ की दूरी","ਦੌੜ ਦੀ ਦੂਰੀ"] as const;
 if(i.authorityKey==="finishDistanceLeadState"){
  const time=w.binary(["Winner finish time","विजेता का समय","ਜੇਤੂ ਦਾ ਸਮਾਂ"],i.raceDistance,"÷",i.winnerSpeed,"s");
  const covered=w.binary(["Loser distance at winner finish","विजेता के पहुँचने तक दूसरे धावक की दूरी","ਜੇਤੂ ਦੇ ਪਹੁੰਚਣ ਤੱਕ ਦੂਜੇ ਦੌੜਾਕ ਦੀ ਦੂਰੀ"],i.loserSpeed,"×",time,"m");
  const lead=w.binary(["Winning distance","जीत की दूरी","ਜਿੱਤ ਦੀ ਦੂਰੀ"],i.raceDistance,"−",covered,"m");
  if(i.target==="DISTANCE_LEAD")answer=lead;else{
   const fraction=w.binary(["Fraction of race","दौड़ का अंश","ਦੌੜ ਦਾ ਹਿੱਸਾ"],lead,"÷",i.raceDistance,"");
   answer=w.binary(["Percentage of race","दौड़ का प्रतिशत","ਦੌੜ ਦਾ ਪ੍ਰਤੀਸ਼ਤ"],fraction,"×",rational(100),"");
  }
 }else if(i.authorityKey==="raceSpeedRatioState"){
  if(i.mode==="DISTANCE_LEAD"){
   const distance=w.binary(["Second runner distance","दूसरे धावक की दूरी","ਦੂਜੇ ਦੌੜਾਕ ਦੀ ਦੂਰੀ"],i.raceDistance,"−",i.distanceLead,"m");
   answer=w.binary(["First to second speed ratio","पहले और दूसरे धावक की चाल का अनुपात","ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਦੌੜਾਕ ਦੀ ਚਾਲ ਦਾ ਅਨੁਪਾਤ"],i.raceDistance,"÷",distance,"");
  }else{
   const time=w.binary(["Second runner finish time","दूसरे धावक का समय","ਦੂਜੇ ਦੌੜਾਕ ਦਾ ਸਮਾਂ"],i.winnerTime,"+",i.timeLead,"s");
   answer=w.binary(["First to second speed ratio","पहले और दूसरे धावक की चाल का अनुपात","ਪਹਿਲੇ ਅਤੇ ਦੂਜੇ ਦੌੜਾਕ ਦੀ ਚਾਲ ਦਾ ਅਨੁਪਾਤ"],time,"÷",i.winnerTime,"");
  }
 }else if(i.authorityKey==="raceLengthFromLeadEvidence"){
  if(i.mode==="DISTANCE_LEAD"){
   const ratio=w.binary(["Second to first speed ratio","दूसरे और पहले धावक की चाल का अनुपात","ਦੂਜੇ ਅਤੇ ਪਹਿਲੇ ਦੌੜਾਕ ਦੀ ਚਾਲ ਦਾ ਅਨੁਪਾਤ"],i.loserSpeed,"÷",i.winnerSpeed,"");
   const fraction=w.binary(["Winning fraction","जीत की दूरी का अंश","ਜਿੱਤ ਦੀ ਦੂਰੀ ਦਾ ਹਿੱਸਾ"],rational(1),"−",ratio,"");
   answer=w.binary(distanceLabel,i.distanceLead,"÷",fraction,"m");
  }else{
   const first=w.binary(["First runner time per metre","पहले धावक का प्रति मीटर समय","ਪਹਿਲੇ ਦੌੜਾਕ ਦਾ ਪ੍ਰਤੀ ਮੀਟਰ ਸਮਾਂ"],rational(1),"÷",i.winnerSpeed,"");
   const second=w.binary(["Second runner time per metre","दूसरे धावक का प्रति मीटर समय","ਦੂਜੇ ਦੌੜਾਕ ਦਾ ਪ੍ਰਤੀ ਮੀਟਰ ਸਮਾਂ"],rational(1),"÷",i.loserSpeed,"");
   const gap=w.binary(["Time gap per metre","प्रति मीटर समय अंतर","ਪ੍ਰਤੀ ਮੀਟਰ ਸਮੇਂ ਦਾ ਫ਼ਰਕ"],second,"−",first,"");
   answer=w.binary(distanceLabel,i.timeLead,"÷",gap,"m");
  }
 }else if(i.authorityKey==="leadConversionState"){
  if(i.mode==="DISTANCE_TO_TIME"){
   if(!i.distanceLead)throw new Error("Missing distance");
   answer=w.binary(["Time lead","समय की बढ़त","ਸਮੇਂ ਦੀ ਅਗੇਤ"],i.distanceLead,"÷",i.loserSpeed,"s");
  }else{
   if(!i.timeLead)throw new Error("Missing time");
   answer=w.binary(["Distance lead","दूरी की बढ़त","ਦੂਰੀ ਦੀ ਅਗੇਤ"],i.timeLead,"×",i.loserSpeed,"m");
  }
 }else throw new Error("Wrong authority");
 if(answer.numerator*source.solution.answer.denominator!==source.solution.answer.numerator*answer.denominator)throw new Error("Source answer mismatch");
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP010-RACE-EVIDENCE-WORKED-V1",calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze(w.steps.map(s=>s.text)),conclusion:source.explanation.conclusion})});
})));
