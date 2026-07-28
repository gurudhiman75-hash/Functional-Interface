import { add, compare, divide, multiply, rational, reciprocal, subtract } from "./rational";
import { required, seedNumber } from "./cp001-helpers";
import { formatTmwCp009Answer, tmwCp009NetRate, tmwCp009SignedRate } from "./cp009-engine";
import type { Rational } from "./types";
import type { TmwCp009MisconceptionId, TmwCp009Option, TmwCp009Parameters, TmwCp009RegistryEntry, TmwCp009Solution } from "./cp009-types";
const r=(n:number,d=1):Rational=>rational(n,d),ZERO=r(0),ONE=r(1),HUNDRED=r(100),SIXTY=r(60);
function abs(value:Rational):Rational{return value.numerator<0?multiply(value,r(-1)):value;}
function sum(values:Rational[]):Rational{return values.reduce((total,value)=>add(total,value),ZERO);}
function key(values:Rational[]):string{return values.map(value=>`${value.numerator}/${value.denominator}`).join("|");}
function positive(values:Rational[]):boolean{return values.every(value=>value.numerator>0);}
function admissible(entry:TmwCp009RegistryEntry,values:Rational[]):boolean{
 if(entry.answerType==="DIRECTION"||entry.answerType==="DECISION")return true;
 if(!positive(values))return false;
 if(entry.answerType==="COUNT"&&values.some(value=>value.denominator!==1))return false;
 if((entry.answerType==="FRACTION"||entry.answerType==="LEVEL")&&compare(values[0],ONE)>0)return false;
 if(entry.answerType==="PERCENT"&&compare(values[0],HUNDRED)>=0)return false;
 return true;
}
function inletMagnitude(p:TmwCp009Parameters):Rational{return sum(p.pipes.filter(pipe=>pipe.kind==="INLET").map(tmwCp009SignedRate));}
function outletMagnitude(p:TmwCp009Parameters):Rational{return abs(sum(p.pipes.filter(pipe=>pipe.kind!=="INLET").map(tmwCp009SignedRate)));}
function allMagnitude(p:TmwCp009Parameters):Rational{return add(inletMagnitude(p),outletMagnitude(p));}
function candidatePool(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,s:TmwCp009Solution):Array<{values:Rational[];label:TmwCp009MisconceptionId}>{const a=s.answerValues,net=tmwCp009NetRate(p.pipes);switch(entry.solveMode){
 case"findFillTimeFromPositiveInlets":return[
  {values:[p.pipes[0].soloTime],label:"OTHER_PIPES_IGNORED"},
  {values:[sum(p.pipes.map(pipe=>pipe.soloTime))],label:"PIPE_TIMES_ADDED"},
  {values:[divide(sum(p.pipes.map(pipe=>pipe.soloTime)),r(p.pipes.length))],label:"TIME_USED_AS_RATE"},
 ];
 case"findFillTimeFromMixedPipes":case"findEmptyTimeFromMixedPipes":return[
  {values:[reciprocal(allMagnitude(p))],label:"OUTFLOW_ADDED_AS_INFLOW"},
  ...(inletMagnitude(p).numerator>0?[{values:[reciprocal(inletMagnitude(p))],label:"KNOWN_PIPE_SIGN_IGNORED" as const}]:[]),
  ...(outletMagnitude(p).numerator>0?[{values:[reciprocal(outletMagnitude(p))],label:"KNOWN_PIPE_SIGN_IGNORED" as const}]:[]),
  {values:[sum(p.pipes.map(pipe=>pipe.soloTime))],label:"PIPE_TIMES_ADDED"},
 ];
 case"findNetFractionChangedInGivenTime":return[
  {values:[multiply(allMagnitude(p),required(p.duration,"duration"))],label:"OUTFLOW_ADDED_AS_INFLOW"},
  {values:[abs(net)],label:"DURATION_IGNORED"},
  {values:[subtract(ONE,a[0])],label:"KNOWN_PIPE_SIGN_IGNORED"},
 ];
 case"findMissingInletTime":case"findMissingOutletOrLeakTime":{const index=required(p.unknownPipeIndex,"unknownPipeIndex"),target=required(p.targetCompletionTime,"targetCompletionTime"),known=tmwCp009NetRate(p.pipes,index),targetSigned=required(p.targetBoundary,"targetBoundary")==="FULL"?reciprocal(target):multiply(reciprocal(target),r(-1)),wrong=add(abs(targetSigned),abs(known));return[
  {values:[target],label:"KNOWN_PIPE_SIGN_IGNORED"},
  {values:[p.pipes.find((_,i)=>i!==index)?.soloTime??target],label:"KNOWN_PIPE_SIGN_IGNORED"},
  ...(wrong.numerator>0?[{values:[reciprocal(wrong)],label:"OUTFLOW_ADDED_AS_INFLOW" as const}]:[]),
 ];}
 case"findIdenticalPipeCountForTargetTime":return[
  {values:[required(p.targetCompletionTime,"targetCompletionTime")],label:"TIME_USED_AS_RATE"},
  {values:[required(p.identicalPipeSoloTime,"identicalPipeSoloTime")],label:"TIME_USED_AS_RATE"},
  {values:[add(a[0],ONE)],label:"PLAUSIBLE_SCALE_ERROR"},
 ];
 case"findTankCapacityFromFlowAndTime":{const flow=required(p.physicalFlow,"physicalFlow"),time=required(p.physicalTime,"physicalTime");return[
  {values:[flow],label:"DURATION_IGNORED"},
  {values:[divide(flow,time)],label:"CAPACITY_FLOW_TIME_REVERSED"},
  {values:[multiply(flow,add(time,ONE))],label:"PLAUSIBLE_SCALE_ERROR"},
 ];}
 case"findFlowRateFromCapacityAndTime":{const capacity=required(p.capacity,"capacity"),time=required(p.physicalTime,"physicalTime");return[
  {values:[capacity],label:"CAPACITY_REPORTED_AS_FLOW"},
  {values:[multiply(capacity,time)],label:"CAPACITY_FLOW_TIME_REVERSED"},
  {values:[divide(capacity,add(time,ONE))],label:"PLAUSIBLE_SCALE_ERROR"},
 ];}
 case"findTimeFromCapacityAndNetFlow":{const capacity=required(p.capacity,"capacity"),flow=required(p.physicalFlow,"physicalFlow");return[
  {values:[divide(flow,capacity)],label:"CAPACITY_FLOW_TIME_REVERSED"},
  {values:[multiply(a[0],r(2))],label:"CAPACITY_FLOW_TIME_REVERSED"},
  {values:[divide(a[0],r(2))],label:"CAPACITY_FLOW_TIME_REVERSED"},
 ];}
 case"convertFlowUnits":{const flow=required(p.physicalFlow,"physicalFlow"),source=required(p.sourceFlowUnit,"sourceFlowUnit");return[
  {values:[flow],label:"FLOW_UNIT_NOT_CONVERTED"},
  {values:[source==="LITRES_PER_MINUTE"?divide(flow,SIXTY):multiply(flow,SIXTY)],label:"FLOW_UNIT_NOT_CONVERTED"},
  {values:[source==="LITRES_PER_MINUTE"?multiply(flow,r(6)):divide(flow,r(6))],label:"PLAUSIBLE_SCALE_ERROR"},
 ];}
 case"findTimeFromInitialLevelToBoundary":{const initial=required(p.initialLevel,"initialLevel"),fullTime=reciprocal(abs(net)),wrongDistance=required(p.targetBoundary,"targetBoundary")==="FULL"?initial:subtract(ONE,initial);return[
  {values:[fullTime],label:"INITIAL_LEVEL_IGNORED"},
  {values:[divide(wrongDistance,abs(net))],label:"REMAINING_LEVEL_IGNORED"},
  {values:[divide(ONE,allMagnitude(p))],label:"OUTFLOW_ADDED_AS_INFLOW"},
 ];}
 case"findFinalLevelAfterGivenTime":{const initial=required(p.initialLevel,"initialLevel"),duration=required(p.duration,"duration"),change=multiply(net,duration);return[
  {values:[abs(change)],label:"INITIAL_LEVEL_IGNORED"},
  {values:[initial],label:"DURATION_IGNORED"},
  {values:[subtract(initial,change)],label:"KNOWN_PIPE_SIGN_IGNORED"},
  {values:[subtract(ONE,a[0])],label:"REMAINING_LEVEL_IGNORED"},
 ];}
 case"compareTankCapacities":{const state=required(p.comparison,"comparison");return[
  {values:[a[1],a[0]],label:"RATIO_ORDER_REVERSED"},
  {values:[state.flowA,state.flowB],label:"DURATION_IGNORED"},
  {values:[state.timeA,state.timeB],label:"TIME_USED_AS_RATE"},
 ];}
 case"findReducedPipeEfficiencyFromChangedTime":{const original=required(p.originalTime,"originalTime"),changed=required(p.changedTime,"changedTime");return[
  {values:[a[1],a[0]],label:"TIME_EFFICIENCY_INVERSION_MISSED"},
  {values:[ONE,ONE],label:"TIME_EFFICIENCY_INVERSION_MISSED"},
  {values:[subtract(changed,original),changed],label:"PLAUSIBLE_SCALE_ERROR"},
 ];}
 case"findBlockagePercentFromChangedTime":{const original=required(p.originalTime,"originalTime"),changed=required(p.changedTime,"changedTime"),remaining=multiply(divide(original,changed),HUNDRED),increase=multiply(divide(subtract(changed,original),original),HUNDRED);return[
  {values:[remaining],label:"BLOCKAGE_REPORTED_AS_REMAINING_EFFICIENCY"},
  {values:[increase],label:"TIME_EFFICIENCY_INVERSION_MISSED"},
  {values:[subtract(HUNDRED,a[0])],label:"BLOCKAGE_REPORTED_AS_REMAINING_EFFICIENCY"},
 ];}
 case"findNetRateDirection":case"findBoundaryEventFeasibility":return[];
 }}
function directionOptions(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,s:TmwCp009Solution,seed:string):{options:TmwCp009Option[];correctIndex:number}{const correctCode=s.answerValues[0].numerator,labelFor=(value:number):TmwCp009MisconceptionId=>{if(value===2)return"TIME_USED_AS_RATE";if(correctCode===0)return"KNOWN_PIPE_SIGN_IGNORED";if(value===0)return"DIRECTION_FROM_PIPE_COUNT";return"INFLOW_SUBTRACTED_FROM_OUTFLOW_WRONGLY";},choices:[Rational,string][]=[
 [r(1),"The tank fills"],
 [r(-1),"The tank empties"],
 [ZERO,"The water level remains unchanged"],
 [r(2),"The direction cannot be determined"],
 ],correctIndex=seedNumber(seed,`${entry.qlId}:position`)%4,correctKey=s.answerKey;const wrong=choices.filter(([value])=>key([value])!==correctKey).slice(0,3).map(([value,text])=>({text,key:key([value]),misconceptionId:labelFor(value.numerator)})),correct:TmwCp009Option={text:s.answerText,key:s.answerKey,misconceptionId:"CORRECT"},options:TmwCp009Option[]=[...wrong];options.splice(correctIndex,0,correct);return{options,correctIndex};}
function decisionOptions(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,s:TmwCp009Solution,seed:string):{options:TmwCp009Option[];correctIndex:number}{const boundary=required(p.targetBoundary,"targetBoundary")==="FULL"?"full":"empty",opposite=boundary==="full"?"empty":"full",window=required(p.decisionWindow,"decisionWindow"),eventTime=s.answerValues[1],event=s.answerValues[0].numerator===1;const wrongTexts=event?[
 `No — the tank does not become ${boundary} within ${formatTmwCp009Answer({...entry,answerType:"TIME"},p,[window])}`,
 `Yes — the tank becomes ${boundary} in ${formatTmwCp009Answer({...entry,answerType:"TIME"},p,[window])}`,
 `Yes — the tank becomes ${opposite} in ${formatTmwCp009Answer({...entry,answerType:"TIME"},p,[eventTime])}`,
]:[
 `Yes — the tank becomes ${boundary} in ${formatTmwCp009Answer({...entry,answerType:"TIME"},p,[eventTime])}`,
 `Yes — the tank becomes ${opposite} in ${formatTmwCp009Answer({...entry,answerType:"TIME"},p,[eventTime])}`,
 `The water level remains unchanged for ${formatTmwCp009Answer({...entry,answerType:"TIME"},p,[window])}`,
];const labels:[TmwCp009MisconceptionId,TmwCp009MisconceptionId,TmwCp009MisconceptionId]=["BOUNDARY_TIME_NOT_CHECKED","DIRECTION_FROM_PIPE_COUNT","KNOWN_PIPE_SIGN_IGNORED"],correctIndex=seedNumber(seed,`${entry.qlId}:position`)%4,options:TmwCp009Option[]=wrongTexts.map((text,i)=>({text,key:`wrong:${i}:${text}`,misconceptionId:labels[i]}));options.splice(correctIndex,0,{text:s.answerText,key:s.answerKey,misconceptionId:"CORRECT"});return{options,correctIndex};}
export function buildTmwCp009Options(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,s:TmwCp009Solution,seed:string):{options:TmwCp009Option[];correctIndex:number}{
 if(entry.answerType==="DIRECTION")return directionOptions(entry,p,s,seed);
 if(entry.answerType==="DECISION")return decisionOptions(entry,p,s,seed);
 const correct:TmwCp009Option={text:s.answerText,key:s.answerKey,misconceptionId:"CORRECT"},fractionFallback=(entry.answerType==="FRACTION"||entry.answerType==="LEVEL")?[r(1,4),r(1,3),r(1,2),r(2,3),r(3,4),r(4,5)].map(value=>({values:[value],label:"PLAUSIBLE_SCALE_ERROR" as const})):[],pool=[...candidatePool(entry,p,s),...fractionFallback,{values:s.answerValues.map(value=>multiply(value,r(2))),label:"PLAUSIBLE_SCALE_ERROR" as const},{values:s.answerValues.map(value=>divide(value,r(2))),label:"PLAUSIBLE_SCALE_ERROR" as const},{values:s.answerValues.map((value,index)=>index===0?add(value,ONE):value),label:"PLAUSIBLE_SCALE_ERROR" as const},{values:s.answerValues.map((value,index)=>index===0?subtract(value,ONE):value),label:"PLAUSIBLE_SCALE_ERROR" as const}],seen=new Set([s.answerKey]),seenText=new Set([s.answerText]),distractors:TmwCp009Option[]=[];
 for(const item of pool){if(!admissible(entry,item.values))continue;const k=key(item.values),text=formatTmwCp009Answer(entry,p,item.values);if(seen.has(k)||seenText.has(text))continue;seen.add(k);seenText.add(text);distractors.push({text,key:k,misconceptionId:item.label});if(distractors.length===3)break;}
 let bump=2,attempts=0;while(distractors.length<3&&attempts<80){attempts+=1;const values=s.answerValues.map((value,index)=>index===0?add(value,r(bump)):value);bump+=1;if(!admissible(entry,values))continue;const k=key(values),text=formatTmwCp009Answer(entry,p,values);if(seen.has(k)||seenText.has(text))continue;seen.add(k);seenText.add(text);distractors.push({text,key:k,misconceptionId:"PLAUSIBLE_SCALE_ERROR"});}
 if(distractors.length!==3)throw new Error(`${entry.qlId} could not build three admissible distractors`);const correctIndex=seedNumber(seed,`${entry.qlId}:position`)%4,options=[...distractors];options.splice(correctIndex,0,correct);return{options,correctIndex};
}
