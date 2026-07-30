import { add, formatRational, multiply, rational } from "./rational";
import type { Rational } from "./types";

function lowerFirst(value:string):string{return value.length===0?value:value[0].toLowerCase()+value.slice(1);}
function optionLabel(index:number):string{return `Option ${"ABCD"[index]??String(index+1)}`;}
function isRational(value:any):value is Rational{return value&&Number.isInteger(value.numerator)&&Number.isInteger(value.denominator)&&value.denominator!==0;}

function polishString(value:string):string{
  return value
    .replace(/\bthe generated\b/gi,"the stated")
    .replace(/\bgenerated givens\b/gi,"stated givens")
    .replace(/\bgenerated equation\b/gi,"comparison equation")
    .replace(/\bgenerated work ledger\b/gi,"work ledger")
    .replace(/\bsigned rate equation\b/gi,"governing rate equation")
    .replace(/Independent heterogeneous-crew invariant verified[^:]*:/gi,"Check:")
    .replace(/Independent invariant verified[^:]*:/gi,"Check:")
    .replace(/Independent invariant check/gi,"independent check")
    .replace(/\s+for find[A-Z][A-Za-z]+:/g,":")
    .replace(/Don't fall for (Option [A-D]) \(([^)]+)\)!\s*/gi,"$1 ($2) reflects this trap: ")
    .replace(/Do not choose (Option [A-D]) \(([^)]+)\) because\s*/gi,"$1 ($2) reflects this trap because ")
    .replace(/Do not choose (Option [A-D]) \(([^)]+)\)\.\s*/gi,"$1 ($2) reflects this trap. ")
    .replace(/\bdo not apply a new ratio\b/gi,"the subtraction already gives the residual payment")
    .replace(/\bDo not apply the contribution ratio a second time\./g,"The subtraction already gives the residual payment, so a second contribution ratio is unnecessary.")
    .replace(/keep efficiencies in direct order; do not divide twice/gi,"keep efficiencies in direct order; one division is sufficient")
    .replace(/Do not stop at the total required workforce\./g,"Stopping at the total required workforce reports the wrong target.")
    .replace(/Do not use a direct proportion where the relation is inverse\./g,"A direct proportion would reverse this inverse relation.")
    .replace(/Do not copy an original value after the workforce, hours, deadline, population or workload has changed\./g,"Copying an original value ignores the changed workforce, hours, deadline, population or workload.")
    .replace(/Do not copy the group-count ratio as the efficiency ratio\./g,"Copying the group-count ratio directly reverses the required individual-efficiency ratio.")
    .replace(/Do not add raw headcounts\./g,"Adding raw headcounts ignores the different category efficiencies.")
    .replace(/Use pairwise subtraction or elimination; do not divide a group rate by its total category count\./gi,"Use pairwise subtraction or elimination; dividing a group rate by its total category count would mix unequal categories.")
    .replace(/Multiply its magnitude by the stated duration; do not take a reciprocal because the target is work changed, not completion time\./gi,"Multiply its magnitude by the stated duration; a reciprocal is unnecessary because the target is work changed, not completion time.")
    .replace(/Add every signed change to the initial level; do not take a reciprocal\./gi,"Add every signed change to the initial level; a reciprocal is unnecessary.")
    .replace(/(^|[.!?]\s+)Do not\s+/g,"$1It is incorrect to ")
    .replace(/(^|[.!?]\s+)Don't\s+/g,"$1It is incorrect to ")
    .replace(/\bof the tank filled per (minute|hour|day)\b/gi,"of the tank per $1")
    .replace(/\bis the correct answer\.?$/i,"is the required result.")
    .replace(/\bis the correct result for this pipe configuration\.?$/i,"is the required result for this pipe configuration.");
}

function deepPolish<T>(value:T):T{
  if(typeof value==="string")return polishString(value) as T;
  if(Array.isArray(value))return value.map(item=>deepPolish(item)) as T;
  if(value&&typeof value==="object"){
    const result:Record<string,unknown>={};
    for(const [key,item] of Object.entries(value as Record<string,unknown>))result[key]=deepPolish(item);
    return result as T;
  }
  return value;
}

function mapStrings<T>(value:T,transform:(text:string)=>string):T{
  if(typeof value==="string")return transform(value) as T;
  if(Array.isArray(value))return value.map(item=>mapStrings(item,transform)) as T;
  if(value&&typeof value==="object"){
    const result:Record<string,unknown>={};
    for(const [key,item] of Object.entries(value as Record<string,unknown>))result[key]=mapStrings(item,transform);
    return result as T;
  }
  return value;
}

function contextualConclusion(question:any,answerText:string):string{
  const answerType=String(question?.solution?.answerType??question?.answerType??"");
  switch(answerType){
    case "TIME":return `Therefore, the required elapsed time is ${answerText}.`;
    case "OUTPUT":return `Therefore, the stated schedule produces ${answerText}.`;
    case "RATE":case "FLOW_RATE":case "EFFICIENCY":return `Therefore, the required rate is ${answerText}.`;
    case "COUNT":return `Therefore, the required count is ${answerText}.`;
    case "PERCENT":return `Therefore, the requested percentage is ${answerText}.`;
    case "FRACTION":case "LEVEL":return `Therefore, the requested fraction is ${answerText}.`;
    case "CAPACITY":return `Therefore, the tank capacity is ${answerText}.`;
    case "RATIO":case "TRIPLE_RATIO":return `Therefore, the required ratio is ${answerText}.`;
    case "MONEY":case "MONEY_TRIPLE":return `Therefore, the required payment is ${answerText}.`;
    case "DECISION":return `Therefore, ${lowerFirst(answerText.replace(/^(?:Yes|No)\s+—\s+/i,""))}.`;
    default:return `Therefore, the requested value is ${answerText}.`;
  }
}

function diagnosticTrap(question:any):void{
  const trap=question?.explanation?.commonTrap;
  if(!trap?.optionLabel||!trap?.optionText||typeof trap.explanation!=="string")return;
  const expected=`${trap.optionLabel} (${trap.optionText})`;
  if(trap.explanation.startsWith(`${expected} reflects this trap:`))return;
  const reason=trap.explanation
    .replace(new RegExp(`^${trap.optionLabel} \\(${String(trap.optionText).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}\\)\\s*`,"i"),"")
    .replace(/^Don't fall for [^!]+!\s*/i,"")
    .replace(/^Do not choose [^.]+\.\s*/i,"")
    .replace(/^reflects this trap:\s*/i,"")
    .trim();
  trap.explanation=`${expected} reflects this trap: ${lowerFirst(reason||"it does not satisfy the governing relation.")}`;
}

function preferCp001ComplementTrap(question:any):void{
  const mode=String(question?.solveMode??"");
  if(!["findRemainingFractionAfterTime","findRemainingPercentAfterTime"].includes(mode))return;
  const audit=Array.isArray(question.optionAudit)?question.optionAudit:[];
  const index=audit.findIndex((item:any)=>item?.misconceptionId==="COMPLETED_REPORTED_AS_REMAINING");
  if(index<0)return;
  const item=audit[index];
  question.explanation.commonTrap={
    optionLabel:optionLabel(index),optionText:item.text,misconceptionId:item.misconceptionId,
    explanation:`${optionLabel(index)} (${item.text}) reflects this trap: it reports the completed share even though the question asks for the remaining share.`,
  };
}

function machineScheduleText(value:string):string{
  return value
    .replace(/\b(?:Operator|Technician|Clerk|Crew|Team|Inspector|Typist|Painter|Recorder|Surveyor|Assembler) ([ABC])\b/g,"Machine $1")
    .replace(/\ba school-building paint job\b/g,"a scheduled production run")
    .replace(/\ba customer-record batch\b|\ban equipment overhaul\b|\ba loan-application set\b|\ba road-marking project\b|\ba quality-inspection batch\b|\ba manuscript-typing job\b|\ba warehouse inventory count\b|\ba field survey\b/g,"a scheduled production run");
}

function cycleWork(question:any):Rational|undefined{
  const cycle=question?.parameters?.cycle;
  if(!Array.isArray(cycle)||cycle.length===0)return undefined;
  let total=rational(0);
  for(const segment of cycle){
    if(!isRational(segment?.rate)||!isRational(segment?.duration))return undefined;
    total=add(total,multiply(segment.rate,segment.duration));
  }
  return total;
}

function polishCp005MachineOutput(question:any):any{
  if(String(question?.questionLanguageId)!=="TMW-QL-104")return question;
  const polished=mapStrings(question,machineScheduleText);
  const perCycle=cycleWork(polished),cycles=Number(polished?.parameters?.givenCycles??0),answer=polished?.solution?.answer;
  if(!perCycle||!Number.isInteger(cycles)||cycles<2||!isRational(answer))return polished;
  const unit=String(polished?.parameters?.outputUnit??polished?.parameters?.context?.outputNoun??"units");
  const candidates=[
    {value:multiply(perCycle,rational(cycles-1)),misconceptionId:"FINAL_CYCLE_OMITTED",reason:"it counts one fewer complete cycle than the schedule specifies"},
    {value:perCycle,misconceptionId:"CYCLE_WORK_TREATED_AS_DAILY",reason:"it reports one cycle's output instead of repeating the cycle for the full schedule"},
    {value:multiply(perCycle,rational(cycles+1)),misconceptionId:"FULL_FINAL_SEGMENT_ASSUMED",reason:"it includes one extra complete cycle"},
  ];
  const correctIndex=Number(polished.correctIndex);
  const wrongAudits=candidates.map(item=>({text:`${formatRational(item.value)} ${unit}`,value:item.value,misconceptionId:item.misconceptionId,reason:item.reason}));
  const correctAudit={text:polished.solution.answerText,value:answer,misconceptionId:"CORRECT"};
  const optionAudit=wrongAudits.map(({reason,...item})=>item);
  optionAudit.splice(correctIndex,0,correctAudit);
  polished.optionAudit=optionAudit;
  polished.options=optionAudit.map((item:any)=>item.text);
  const trapCandidate=wrongAudits[0];
  const actualTrapIndex=polished.optionAudit.findIndex((item:any)=>item.misconceptionId===trapCandidate.misconceptionId);
  polished.explanation.commonTrap={
    optionLabel:optionLabel(actualTrapIndex),optionText:trapCandidate.text,misconceptionId:trapCandidate.misconceptionId,
    explanation:`${optionLabel(actualTrapIndex)} (${trapCandidate.text}) reflects this trap: ${trapCandidate.reason}.`,
  };
  return polished;
}

function polishCp008(question:any):void{
  const qlId=String(question?.questionLanguageId??"");
  if(qlId==="TMW-QL-146"){
    const trap=question?.explanation?.commonTrap;
    if(trap?.optionLabel&&trap?.optionText)trap.explanation=`${trap.optionLabel} (${trap.optionText}) reflects this trap: it treats the known individual payment as though it were the complete payment pool.`;
  }
  if(qlId==="TMW-QL-147"&&question?.explanation){
    question.explanation.opening="When the total pool and the other allocations are known, direct subtraction gives the remaining payment. A second contribution ratio is unnecessary.";
  }
}

function polishCp009Decision(question:any):void{
  if(String(question?.questionLanguageId)!=="TMW-QL-174")return;
  const answerText=String(question?.solution?.answerText??question?.options?.[question?.correctIndex]??"");
  const boundary=String(question?.parameters?.targetBoundary??"").toLowerCase()||"target level";
  const event=/^Yes\s+—/i.test(answerText);
  const wrongTexts=event
    ?[`No — the tank does not reach ${boundary} within the available time`,`Yes — the tank reaches ${boundary} only at the end of the available time`,`Yes — the tank reaches the opposite boundary within the available time`]
    :[`Yes — the tank reaches ${boundary} exactly at the end of the available time`,`Yes — the tank reaches the opposite boundary within the available time`,`No — the water level remains unchanged throughout the available time`];
  const labels=["BOUNDARY_TIME_NOT_CHECKED","DIRECTION_FROM_PIPE_COUNT","KNOWN_PIPE_SIGN_IGNORED"];
  const correctIndex=Number(question.correctIndex);
  const correctAudit=question.optionAudit?.[correctIndex]??{text:answerText,key:question.solution?.answerKey,misconceptionId:"CORRECT"};
  const wrongAudits=wrongTexts.map((text,index)=>({text,key:`manual:${index}:${text}`,misconceptionId:labels[index]}));
  const optionAudit=[...wrongAudits];optionAudit.splice(correctIndex,0,correctAudit);
  question.optionAudit=optionAudit;question.options=optionAudit.map(item=>item.text);
  const trapIndex=optionAudit.findIndex(item=>item.misconceptionId==="BOUNDARY_TIME_NOT_CHECKED");
  const trap=optionAudit[trapIndex];
  question.explanation.commonTrap={
    optionLabel:optionLabel(trapIndex),optionText:trap.text,misconceptionId:trap.misconceptionId,
    explanation:`${optionLabel(trapIndex)} (${trap.text}) reflects this trap: it states an outcome without comparing the exact boundary time with the available time window.`,
  };
  question.explanation.conclusion=contextualConclusion(question,answerText);
}

export function polishTmwEnglishQuestionForManualReview(question:any):any{
  let polished=deepPolish(question);
  polished=polishCp005MachineOutput(polished);
  const cpId=String(polished?.canonicalProblemId??"");
  const answerText=String(polished?.solution?.answerText??polished?.options?.[polished?.correctIndex]??"");
  if(!polished?.explanation||!answerText)return polished;
  if(cpId==="TMW-CP-001")preferCp001ComplementTrap(polished);
  if(cpId==="TMW-CP-008")polishCp008(polished);
  if(cpId==="TMW-CP-009")polishCp009Decision(polished);
  if(cpId==="TMW-CP-011")polished.explanation.conclusion=contextualConclusion(polished,answerText);
  diagnosticTrap(polished);
  return polished;
}
