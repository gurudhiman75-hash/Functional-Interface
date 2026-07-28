import { add, divide, multiply, rational, subtract, toLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp011LearningShortcut, TmwCp011Parameters, TmwCp011RegistryEntry, TmwCp011Solution } from "./cp011-types";
import { cp011RatesFor } from "./cp011-engine";

const m=(x:string)=>`\\(${x}\\)`;
const v=(x:Rational)=>toLatex(x);
const sum=(xs:Rational[])=>xs.reduce(add,rational(0));
const join=(xs:Rational[])=>xs.map(v).join("+");
const whole=(x:Rational)=>Math.trunc(x.numerator/x.denominator);
const abs=(x:Rational)=>rational(Math.abs(x.numerator),x.denominator);
const signed=(a:Rational,b:Rational)=>b.numerator<0?`${v(a)}+${v(abs(b))}`:`${v(a)}-${v(b)}`;

function arithmeticDays(p:TmwCp011Parameters,rates:Rational[],count=rates.length){
 const a=p.initialRate!,d=p.dailyChange!,unit=p.context.unit;
 return rates.slice(0,count).map((rate,i)=>i===0
  ?`Day 1 output = ${m(v(rate))} ${unit}.`
  :`Day ${i+1} output = ${m(`${v(a)}${d.numerator<0?"-":"+"}${i}\\times${v(abs(d))}=${v(rate)}`)} ${unit}.`);
}
function geometricDays(p:TmwCp011Parameters,rates:Rational[],count=rates.length){
 const unit=p.context.unit,q=p.multiplier!;
 return rates.slice(0,count).map((rate,i)=>i===0
  ?`Day 1 output = ${m(v(rate))} ${unit}.`
  :`Day ${i+1} output = ${m(`${v(rates[i-1])}\\times${v(q)}=${v(rate)}`)} ${unit}.`);
}
function completion(p:TmwCp011Parameters,s:TmwCp011Solution,rates:Rational[],prefix:string[]=[]){
 const k=whole(s.answer),done=sum(rates.slice(0,k)),left=subtract(p.targetOutput!,done),fraction=divide(left,rates[k]),unit=p.context.unit;
 return [...prefix,
  `Work completed after ${k} complete days = ${m(`${join(rates.slice(0,k))}=${v(done)}`)} ${unit}.`,
  `Work still left = ${m(`${v(p.targetOutput!)}-${v(done)}=${v(left)}`)} ${unit}.`,
  `Part of Day ${k+1} needed = ${m(`\\frac{${v(left)}}{${v(rates[k])}}=${v(fraction)}`)}.`,
  `Total time = ${m(`${k}+${v(fraction)}=${v(s.answer)}`)} days.`];
}

export function cp011TeacherOpening(e:TmwCp011RegistryEntry){
 if(e.ruleId==="TMW_ARITHMETIC_RATE_SUM")return e.solveMode.includes("Initial")||e.solveMode.includes("DailyChange")
  ?"Let's work backward from the total. The output changes by the same amount each day, so the arithmetic-series formula connects the total, Day 1 output and daily change."
  :"Let's write the output for each day. Because it changes by the same amount, we can add the daily values or use the arithmetic-series sum formula.";
 if(e.ruleId==="TMW_GEOMETRIC_RATE_SUM")return e.solveMode.includes("Initial")||e.solveMode.includes("Multiplier")
  ?"Let's work backward from the total. Write the daily multiplier pattern, add its factors, and find the missing value."
  :"Let's apply the same multiplier again each day, write the daily outputs, and add them.";
 if(e.ruleId==="TMW_VARIABLE_COMPLETION"||e.ruleId==="TMW_EXPLICIT_RATE_TABLE")return "Let's add each complete day's output in order. If only part of the next day is needed, divide the remaining work by that day's output.";
 if(e.ruleId==="TMW_THRESHOLD_SWITCH")return "Let's split the schedule into the days before the rate changes and the days after it changes. Calculate both parts separately.";
 if(e.ruleId==="TMW_CREW_SCHEDULE")return e.solveMode==="findCompletionTimeWithVaryingCrewByDay"
  ?"Let's turn each day's worker count into that day's output. Add complete days first, then use only the needed part of the last partly used day."
  :"Let's multiply each day's worker count by one worker's output, then add the daily totals.";
 if(e.ruleId==="TMW_COMBINED_SEQUENCE")return "Let's calculate each person's changing output separately, then add the two totals.";
 if(e.ruleId==="TMW_SIGNED_SEQUENCE")return "Let's total accepted and rejected output separately. Net output means accepted output minus rejected output.";
 return "Let's total the planned output first, then share the remaining shortfall equally across all available days.";
}

export function cp011TeacherSteps(e:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution):string[]{
 const rates=cp011RatesFor(e,p),unit=p.context.unit,n=p.days??p.requiredDeadlineDays??rates.length,a=p.initialRate??rational(0),d=p.dailyChange??rational(0);
 switch(e.solveMode){
  case "findOutputFromArithmeticDailyRates":return [...arithmeticDays(p,rates),`Total output = ${m(`${join(rates)}=${v(s.answer)}`)} ${unit}.`];
  case "findCompletionTimeFromArithmeticDailyRates":return completion(p,s,rates,arithmeticDays(p,rates,whole(s.answer)+1));
  case "findInitialRateFromArithmeticTotal":{const twoS=multiply(rational(2),p.totalOutput!),part=multiply(rational(n*(n-1)),d),top=subtract(twoS,part);return[
   `Double the total: ${m(`2\\times${v(p.totalOutput!)}=${v(twoS)}`)}.`,
   `Daily-change part: ${m(`${n}\\times${n-1}\\times${v(d)}=${v(part)}`)}.`,
   `So ${m(`2na=${signed(twoS,part)}=${v(top)}`)}.`,
   `Day 1 output = ${m(`\\frac{${v(top)}}{${2*n}}=${v(s.answer)}`)} ${unit}.`];}
  case "findDailyChangeFromArithmeticTotal":{const twoS=multiply(rational(2),p.totalOutput!),base=multiply(rational(2*n),a),top=subtract(twoS,base),bottom=rational(n*(n-1));return[
   `Double the total: ${m(`2\\times${v(p.totalOutput!)}=${v(twoS)}`)}.`,
   `Day 1 part: ${m(`2\\times${n}\\times${v(a)}=${v(base)}`)}.`,
   `Difference = ${m(`${v(twoS)}-${v(base)}=${v(top)}`)}.`,
   `Number of change-units = ${m(`${n}\\times${n-1}=${v(bottom)}`)}.`,
   `Daily change = ${m(`\\frac{${v(top)}}{${v(bottom)}}=${v(s.answer)}`)} ${unit}.`];}
  case "findOutputFromGeometricDailyRates":return [...geometricDays(p,rates),`Total output = ${m(`${join(rates)}=${v(s.answer)}`)} ${unit}.`];
  case "findCompletionTimeFromGeometricDailyRates":return completion(p,s,rates,geometricDays(p,rates,whole(s.answer)+1));
  case "findInitialRateFromGeometricTotal":{const factors=rates.map(x=>divide(x,p.initialRate!)),factor=sum(factors);return[
   `Daily factors = ${m(factors.map(v).join(", "))}.`,
   `Factor total = ${m(`${join(factors)}=${v(factor)}`)}.`,
   `Total output = Day 1 output × ${m(v(factor))}.`,
   `Day 1 output = ${m(`\\frac{${v(p.totalOutput!)}}{${v(factor)}}=${v(s.answer)}`)} ${unit}.`];}
  case "findMultiplierFromGeometricTotal":{const factors=rates.map(x=>divide(x,a)),factor=sum(factors);return[
   `Remove the Day 1 scale: ${m(`\\frac{${v(p.totalOutput!)}}{${v(a)}}=${v(factor)}`)}.`,
   `For multiplier ${m(v(s.answer))}, the daily factors are ${m(factors.map(v).join(", "))}.`,
   `Check: ${m(`${join(factors)}=${v(factor)}`)}.`,
   `Therefore, the multiplier is ${m(v(s.answer))}.`];}
  case "findCompletionTimeAfterThresholdRateSwitch":{const first=multiply(a,rational(p.thresholdDay!)),left=subtract(p.targetOutput!,first),extra=divide(left,p.postThresholdRate!);return[
   `Work in the first ${p.thresholdDay} days = ${m(`${v(a)}\\times${p.thresholdDay}=${v(first)}`)} ${unit}.`,
   `Work still left = ${m(`${v(p.targetOutput!)}-${v(first)}=${v(left)}`)} ${unit}.`,
   `Time at the new rate = ${m(`\\frac{${v(left)}}{${v(p.postThresholdRate!)}}=${v(extra)}`)} days.`,
   `Total time = ${m(`${p.thresholdDay}+${v(extra)}=${v(s.answer)}`)} days.`];}
  case "findUnknownThresholdDay":{const base=multiply(p.postThresholdRate!,rational(n)),extra=subtract(p.totalOutput!,base),perDay=subtract(a,p.postThresholdRate!);return[
   `Output if the new rate applied for all ${n} days = ${m(`${n}\\times${v(p.postThresholdRate!)}=${v(base)}`)} ${unit}.`,
   `Extra output actually completed = ${m(`${v(p.totalOutput!)}-${v(base)}=${v(extra)}`)} ${unit}.`,
   `Each old-rate day adds ${m(`${v(a)}-${v(p.postThresholdRate!)}=${v(perDay)}`)} extra ${unit}.`,
   `Old-rate days = ${m(`\\frac{${v(extra)}}{${v(perDay)}}=${v(s.answer)}`)}.`,
   `So, the rate changed ${s.answerText}.`];}
  case "findUnknownPostThresholdRate":{const first=multiply(a,rational(p.thresholdDay!)),left=subtract(p.totalOutput!,first),later=n-p.thresholdDay!;return[
   `Work in the first ${p.thresholdDay} days = ${m(`${v(a)}\\times${p.thresholdDay}=${v(first)}`)} ${unit}.`,
   `Work left for the new rate = ${m(`${v(p.totalOutput!)}-${v(first)}=${v(left)}`)} ${unit}.`,
   `Days at the new rate = ${m(`${n}-${p.thresholdDay}=${later}`)}.`,
   `New daily rate = ${m(`\\frac{${v(left)}}{${later}}=${v(s.answer)}`)} ${unit} per day.`];}
  case "findOutputWithVaryingCrewByDay":return [...p.crewCounts!.map((crew,i)=>`Day ${i+1} output = ${m(`${crew}\\times${v(p.perWorkerRate!)}=${v(rates[i])}`)} ${unit}.`),`Total output = ${m(`${join(rates)}=${v(s.answer)}`)} ${unit}.`];
  case "findCombinedVariableAgentOutput":{const x=Array.from({length:n},(_,i)=>add(a,multiply(d,rational(i)))),y=Array.from({length:n},(_,i)=>add(p.peerInitialRate!,multiply(p.peerDailyChange!,rational(i)))),sx=sum(x),sy=sum(y);return[
   `${p.context.actor}'s daily outputs = ${m(x.map(v).join(", "))}.`,`${p.context.actor}'s total = ${m(`${join(x)}=${v(sx)}`)} ${unit}.`,
   `${p.context.peerActor}'s daily outputs = ${m(y.map(v).join(", "))}.`,`${p.context.peerActor}'s total = ${m(`${join(y)}=${v(sy)}`)} ${unit}.`,
   `Combined output = ${m(`${v(sx)}+${v(sy)}=${v(s.answer)}`)} ${unit}.`];}
  case "findSignedNetVariableOutput":{const x=Array.from({length:n},(_,i)=>add(a,multiply(d,rational(i)))),y=Array.from({length:n},(_,i)=>add(p.negativeInitialRate!,multiply(p.negativeDailyChange!,rational(i)))),sx=sum(x),sy=sum(y);return[
   `Accepted outputs = ${m(x.map(v).join(", "))}.`,`Total accepted = ${m(`${join(x)}=${v(sx)}`)} ${unit}.`,
   `Rejected outputs = ${m(y.map(v).join(", "))}.`,`Total rejected = ${m(`${join(y)}=${v(sy)}`)} ${unit}.`,
   `Net output = ${m(`${v(sx)}-${v(sy)}=${v(s.answer)}`)} ${unit}.`];}
  case "findCompletionTimeFromExplicitRateTable":return completion(p,s,rates,rates.slice(0,whole(s.answer)+1).map((x,i)=>`Day ${i+1} output = ${m(v(x))} ${unit}.`));
  case "findRequiredDailyAdjustmentForDeadline":{const planned=sum(rates),gap=subtract(p.targetOutput!,planned);return[
   `Planned daily outputs = ${m(rates.map(v).join(", "))}.`,`Planned total = ${m(`${join(rates)}=${v(planned)}`)} ${unit}.`,
   `Output still needed = ${m(`${v(p.targetOutput!)}-${v(planned)}=${v(gap)}`)} ${unit}.`,
   `Extra output per day = ${m(`\\frac{${v(gap)}}{${p.requiredDeadlineDays}}=${v(s.answer)}`)} ${unit}.`];}
  case "findOutputAfterThresholdRateSwitch":{const first=multiply(a,rational(p.thresholdDay!)),later=n-p.thresholdDay!,second=multiply(p.postThresholdRate!,rational(later));return[
   `First part = ${m(`${v(a)}\\times${p.thresholdDay}=${v(first)}`)} ${unit}.`,`Days after the change = ${m(`${n}-${p.thresholdDay}=${later}`)}.`,
   `Second part = ${m(`${v(p.postThresholdRate!)}\\times${later}=${v(second)}`)} ${unit}.`,`Total output = ${m(`${v(first)}+${v(second)}=${v(s.answer)}`)} ${unit}.`];}
  case "findCompletionTimeWithVaryingCrewByDay":{const k=whole(s.answer),prefix=p.crewCounts!.slice(0,k+1).map((crew,i)=>`Day ${i+1} output = ${m(`${crew}\\times${v(p.perWorkerRate!)}=${v(rates[i])}`)} ${unit}.`);return completion(p,s,rates,prefix);}
  case "findPostThresholdRateChange":{const first=multiply(a,rational(p.thresholdDay!)),left=subtract(p.totalOutput!,first),later=n-p.thresholdDay!,newRate=divide(left,rational(later));return[
   `Work before the change = ${m(`${v(a)}\\times${p.thresholdDay}=${v(first)}`)} ${unit}.`,`Work after the change = ${m(`${v(p.totalOutput!)}-${v(first)}=${v(left)}`)} ${unit}.`,
   `Days after the change = ${m(`${n}-${p.thresholdDay}=${later}`)}.`,`New daily rate = ${m(`\\frac{${v(left)}}{${later}}=${v(newRate)}`)} ${unit}.`,
   `Rate change = ${m(`${v(newRate)}-${v(a)}=${v(s.answer)}`)}, so it is an ${s.answer.numerator<0?"decrease":"increase"}.`];}
 }
}

export function cp011TeacherShortcut(e:TmwCp011RegistryEntry,s:TmwCp011Solution):TmwCp011LearningShortcut{
 let title="10-Second Running-Total Shortcut",steps=["Add each day's output in the given order.","When the target is crossed, use only the needed part of the next day."];
 if(e.ruleId==="TMW_ARITHMETIC_RATE_SUM"){title="10-Second Arithmetic-Series Shortcut";steps=["Count the changes carefully: n days have n − 1 changes.","Use first + last, or work backward from the total, as required."];}
 else if(e.ruleId==="TMW_GEOMETRIC_RATE_SUM"){title="10-Second Multiplier Shortcut";steps=["Write the factor pattern 1, q, q², q³, ...","Add the factors once, then multiply or divide by Day 1 output."];}
 else if(e.ruleId==="TMW_THRESHOLD_SWITCH"){title="10-Second Two-Part Shortcut";steps=["Draw a line after the last day at the old rate.","Calculate the work on each side separately."];}
 else if(e.ruleId==="TMW_CREW_SCHEDULE"){title="10-Second Worker-Day Shortcut";steps=["Turn each crew count into that day's output.","Add complete days, then use only the needed part of the final day."];}
 else if(e.ruleId==="TMW_COMBINED_SEQUENCE"){title="10-Second Two-Person Shortcut";steps=["Find both totals separately.","Add them only at the end."];}
 else if(e.ruleId==="TMW_SIGNED_SEQUENCE"){title="10-Second Net-Output Shortcut";steps=["Total accepted and rejected output separately.","Subtract rejected output from accepted output."];}
 else if(e.ruleId==="TMW_DEADLINE_ADJUSTMENT"){title="10-Second Gap Shortcut";steps=["Find the planned total.","Use (target − planned total) ÷ number of days."];}
 return{title,steps:[...steps,`Answer: ${s.answerText}.`]};
}
export const cp011TeacherConclusion=(s:TmwCp011Solution)=>`So, ${s.answerText} is the correct answer.`;
