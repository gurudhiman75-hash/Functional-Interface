import { add, compare, divide, equals, formatRational, formatTimeText, multiply, rational, reciprocal, subtract } from "./rational";
import { seedNumber } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp005Option, TmwCp005Parameters, TmwCp005RegistryEntry, TmwCp005Solution, TmwCp005MisconceptionId } from "./cp005-types";
function text(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,value:Rational|string):string{
 if(typeof value==="string")return value;
 const formatted=formatRational(value);
 if(entry.answerType==="TIME")return formatTimeText(value,p.timeUnit,`${p.timeUnit}s`);
 if(entry.answerType==="FRACTION")return `${formatted} of the work`;
 if(entry.answerType==="COUNT")return `${formatted} ${equals(value,rational(1))?"cycle":"cycles"}`;
 if(entry.answerType==="RATE")return `${formatted} of the work per ${p.timeUnit}`;
 return `${formatted} ${p.outputUnit??p.context.outputNoun}`;
}
function positive(value:Rational):boolean{return compare(value,rational(0))>0;}
function numericCandidates(entry:TmwCp005RegistryEntry,answer:Rational):Array<{value:Rational;label:TmwCp005MisconceptionId}>{
 const result:Array<{value:Rational;label:TmwCp005MisconceptionId}>=[];
 if(entry.answerType==="FRACTION"){
  const complement=subtract(rational(1),answer);if(positive(complement))result.push({value:complement,label:"TARGET_FRACTION_COMPLEMENT"});
  result.push({value:divide(answer,rational(2)),label:"PARTIAL_SEGMENT_IGNORED"});
  const doubled=multiply(answer,rational(2));if(compare(doubled,rational(1))<0)result.push({value:doubled,label:"CYCLE_WORK_TREATED_AS_DAILY"});
  result.push({value:add(answer,rational(1,6)),label:"PLAUSIBLE_SCALE_ERROR"});
 }else if(entry.answerType==="COUNT"){
  if(compare(answer,rational(1))>0)result.push({value:subtract(answer,rational(1)),label:"FULL_CYCLE_ROUNDED_DOWN"});
  result.push({value:add(answer,rational(1)),label:"FULL_CYCLE_ROUNDED_UP"},{value:add(answer,rational(2)),label:"CYCLE_LENGTH_CONFUSED"},{value:multiply(answer,rational(2)),label:"CYCLE_WORK_TREATED_AS_DAILY"});
 }else if(entry.answerType==="RATE"){
  result.push({value:divide(answer,rational(2)),label:"KNOWN_RATE_REUSED"},{value:multiply(answer,rational(2)),label:"CYCLE_WORK_TREATED_AS_DAILY"},{value:add(answer,rational(1,20)),label:"PLAUSIBLE_SCALE_ERROR"});
  if(answer.numerator!==0&&compare(reciprocal(answer),rational(1))<0)result.push({value:reciprocal(answer),label:"RECIPROCAL_NOT_TAKEN"});
 }else{
  if(compare(answer,rational(1))>0)result.push({value:subtract(answer,rational(1)),label:"FINAL_CYCLE_OMITTED"});
  result.push({value:add(answer,rational(1)),label:"FULL_FINAL_SEGMENT_ASSUMED"},{value:multiply(answer,rational(2)),label:"CYCLE_LENGTH_CONFUSED"},{value:divide(answer,rational(2)),label:"PARTIAL_SEGMENT_IGNORED"});
 }
 return result;
}
export function buildTmwCp005Options(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,solution:TmwCp005Solution,seed:string):{options:TmwCp005Option[];correctIndex:number}{
 const correct:TmwCp005Option={text:solution.answerText,value:solution.answer,misconceptionId:"CORRECT"};
 let distractors:TmwCp005Option[]=[];
 if(typeof solution.answer==="string"){
  const values=[p.context.actorA,p.context.actorB,p.context.actorC,"Cannot be determined"].filter(value=>value!==solution.answer);
  distractors=values.slice(0,3).map((value,index)=>({text:value,value,misconceptionId:(index===0?"WRONG_STARTING_AGENT":index===1?"TERMINAL_AGENT_OFF_BY_ONE":"CYCLE_LENGTH_CONFUSED") as TmwCp005MisconceptionId}));
 }else{
  const seen=new Set<string>([`${solution.answer.numerator}/${solution.answer.denominator}`]);
  for(const candidate of numericCandidates(entry,solution.answer)){
   if(!positive(candidate.value))continue;
   if(entry.answerType==="COUNT"&&candidate.value.denominator!==1)continue;
   const key=`${candidate.value.numerator}/${candidate.value.denominator}`;if(seen.has(key))continue;seen.add(key);
   distractors.push({text:text(entry,p,candidate.value),value:candidate.value,misconceptionId:candidate.label});if(distractors.length===3)break;
  }
  let bump=2;while(distractors.length<3){const value=add(solution.answer,rational(bump++));const key=`${value.numerator}/${value.denominator}`;if(seen.has(key))continue;seen.add(key);distractors.push({text:text(entry,p,value),value,misconceptionId:"PLAUSIBLE_SCALE_ERROR"});}
 }
 const correctIndex=seedNumber(seed,`${entry.qlId}:correct-position`)%4,options=[...distractors];options.splice(correctIndex,0,correct);
 return {options,correctIndex};
}
