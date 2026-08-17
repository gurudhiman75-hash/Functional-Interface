import { add, compare, divide, equals, formatRational, formatTimeText, multiply, rational, subtract } from "./rational";
import { seedNumber } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp004MisconceptionId, TmwCp004Option, TmwCp004Parameters, TmwCp004RegistryEntry, TmwCp004Solution } from "./cp004-types";

function abs(v:Rational):Rational{return v.numerator<0?rational(-v.numerator,v.denominator):v;}
function optionText(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,v:Rational):string{
 const value=formatRational(v);
 if(entry.answerType==="TIME")return formatTimeText(v,p.timeUnit,`${p.timeUnit}s`);
 if(entry.answerType==="FRACTION")return `${value} of the work`;
 if(entry.answerType==="RATE")return `${value} of the work per ${p.timeUnit}`;
 return `${value} ${equals(v,rational(1))?"worker":"workers"}`;
}
function pushUnique(target:Array<{value:Rational;misconceptionId:TmwCp004MisconceptionId}>,value:Rational|undefined,label:TmwCp004MisconceptionId,entry:TmwCp004RegistryEntry,correct:Rational):void{
 if(!value||compare(value,rational(0))<=0||equals(value,correct))return;
 if(entry.answerType==="FRACTION"&&compare(value,rational(1))>0)return;
 if(entry.answerType==="COUNT"&&value.denominator!==1)return;
 if(target.some(x=>equals(x.value,value)))return;
 target.push({value,misconceptionId:label});
}
function shuffle<T>(items:T[],seed:string):T[]{const a=[...items];for(let i=a.length-1;i>0;i--){const j=seedNumber(seed,`cp004-shuffle-${i}`)%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}

export function buildTmwCp004Options(entry:TmwCp004RegistryEntry,p:TmwCp004Parameters,s:TmwCp004Solution,seed:string):{options:TmwCp004Option[];correctIndex:number}{
 const wrong:Array<{value:Rational;misconceptionId:TmwCp004MisconceptionId}>=[];
 const a=s.answer;
 if(entry.answerType==="FRACTION"){
  pushUnique(wrong,subtract(rational(1),a),entry.solveMode==="findRemainingWorkAfterInitialPhase"?"REMAINING_REPORTED_AS_COMPLETED":"COMPLETED_REPORTED_AS_REMAINING",entry,a);
  pushUnique(wrong,divide(a,rational(2)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,divide(add(a,rational(1)),rational(2)),"ELAPSED_WORK_IGNORED",entry,a);
  pushUnique(wrong,add(a,rational(1,6)),"PLAUSIBLE_SCALE_ERROR",entry,a);
 }else if(entry.answerType==="COUNT"){
  pushUnique(wrong,add(a,rational(1)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,subtract(a,rational(1)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,p.initialWorkerCount===undefined?undefined:rational(p.initialWorkerCount),"TOTAL_COUNT_REPORTED_AS_ADDED",entry,a);
  pushUnique(wrong,p.changedWorkerCount===undefined?undefined:rational(p.changedWorkerCount),"ADDED_COUNT_REPORTED_AS_TOTAL",entry,a);
  pushUnique(wrong,add(a,rational(2)),"PLAUSIBLE_SCALE_ERROR",entry,a);
 }else if(entry.answerType==="RATE"){
  pushUnique(wrong,p.rateA,"ELAPSED_WORK_IGNORED",entry,a);
  pushUnique(wrong,p.durationB?divide(rational(1),p.durationB):undefined,"REMAINING_REPORTED_AS_COMPLETED",entry,a);
  pushUnique(wrong,p.deadline?divide(rational(1),p.deadline):undefined,"DEADLINE_REPORTED_AS_ANSWER",entry,a);
  pushUnique(wrong,multiply(a,rational(2)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,divide(a,rational(2)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,add(a,rational(1,20)),"PLAUSIBLE_SCALE_ERROR",entry,a);
 }else{
  pushUnique(wrong,p.durationA,"EVENT_TIME_REPORTED_AS_TOTAL",entry,a);
  pushUnique(wrong,p.durationB,"FINAL_PHASE_OMITTED",entry,a);
  pushUnique(wrong,p.totalCompletionTime,"TOTAL_TIME_REPORTED_AS_EVENT",entry,a);
  pushUnique(wrong,p.deadline,"DEADLINE_REPORTED_AS_ANSWER",entry,a);
  pushUnique(wrong,p.timeA,"ORIGINAL_TOTAL_TIME_REPORTED",entry,a);
  pushUnique(wrong,p.timeB,"CHANGED_TOTAL_TIME_REPORTED",entry,a);
  pushUnique(wrong,multiply(a,rational(2)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,divide(a,rational(2)),"PLAUSIBLE_SCALE_ERROR",entry,a);
  pushUnique(wrong,add(a,rational(1)),"INITIAL_PHASE_OMITTED",entry,a);
  pushUnique(wrong,abs(subtract(a,rational(1))),"FINAL_PHASE_OMITTED",entry,a);
 }
 if(entry.answerType==="FRACTION"){
  const fallbacks=[rational(1,2),rational(1,3),rational(2,3),rational(1,4),rational(3,4),rational(1,5),rational(4,5)];
  for(const value of fallbacks){if(wrong.length>=3)break;pushUnique(wrong,value,"PLAUSIBLE_SCALE_ERROR",entry,a);}
 }else{
  let k=2;
  while(wrong.length<3){pushUnique(wrong,add(a,rational(k)),"PLAUSIBLE_SCALE_ERROR",entry,a);k+=1;}
 }
 const raw:Array<{value:Rational;misconceptionId:TmwCp004MisconceptionId}>=[{value:a,misconceptionId:"CORRECT"},...wrong.slice(0,3)];
 const shuffled=shuffle(raw,seed).map(x=>({text:optionText(entry,p,x.value),value:x.value,misconceptionId:x.misconceptionId}));
 return {options:shuffled,correctIndex:shuffled.findIndex(x=>x.misconceptionId==="CORRECT")};
}
