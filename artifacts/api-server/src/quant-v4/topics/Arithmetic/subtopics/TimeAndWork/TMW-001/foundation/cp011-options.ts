import { add, compare, divide, equals, multiply, rational, rationalKey, subtract, toLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp011CommonTrap, TmwCp011MisconceptionId, TmwCp011Option, TmwCp011Parameters, TmwCp011RegistryEntry, TmwCp011Solution } from "./cp011-types";
import { cp011RatesFor, cp011SeedNumber } from "./cp011-engine";

function sum(values:Rational[]){return values.reduce(add,rational(0));}
function positive(value:Rational){return compare(value,rational(0))>0;}
function format(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,value:Rational){
 if(entry.answerType==="TIME"){if(value.denominator===1)return `${value.numerator} days`;const whole=Math.trunc(value.numerator/value.denominator),rem=value.numerator-whole*value.denominator;return whole>0?`\\(${whole}\\frac{${rem}}{${value.denominator}}\\;\\text{days}\\)`:`\\(${toLatex(value)}\\;\\text{day}\\)`;}
 if(entry.answerType==="DAY_INDEX")return `after day ${value.numerator}`;
 if(entry.answerType==="MULTIPLIER")return `\\(${toLatex(value)}\\)`;
 if(entry.answerType==="RATE_CHANGE"){const magnitude=rational(Math.abs(value.numerator),value.denominator);const direction=value.numerator<0?"decrease":"increase";const unit=magnitude.numerator===magnitude.denominator?p.context.unit.replace(/s$/," ").trim():p.context.unit;const cadence=p.sequenceKind==="THRESHOLD"?"per day":"each day";return `${direction} of ${magnitude.denominator===1?magnitude.numerator:`\\(${toLatex(magnitude)}\\)`} ${unit} ${cadence}`; }
 if(entry.answerType==="RATE")return `${value.denominator===1?value.numerator:`\\(${toLatex(value)}\\)`} ${p.context.unit} per day`;
 return `${value.denominator===1?value.numerator:`\\(${toLatex(value)}\\)`} ${p.context.unit}`;
}
function candidateList(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution):Array<[Rational,TmwCp011MisconceptionId]>{
 const rates=cp011RatesFor(entry,p),n=p.days??p.requiredDeadlineDays??rates.length,first=rates[0]??rational(1),last=rates.at(-1)??first;
 const apNumerator=p.totalOutput&&p.initialRate?subtract(multiply(rational(2),p.totalOutput),multiply(rational(2*n),p.initialRate)):rational(0);
 switch(entry.solveMode){
  case "findOutputFromArithmeticDailyRates": return [[multiply(first,rational(n)),"FIRST_RATE_USED_FOR_ALL_DAYS"],[multiply(last,rational(n)),"LAST_RATE_USED_FOR_ALL_DAYS"],[multiply(s.answer,rational(2)),"AP_SUM_HALF_OMITTED"]];
  case "findCompletionTimeFromArithmeticDailyRates":
  case "findCompletionTimeFromGeometricDailyRates":
  case "findCompletionTimeAfterThresholdRateSwitch":
  case "findCompletionTimeFromExplicitRateTable": return [[divide(p.targetOutput!,first),"TARGET_DIVIDED_BY_INITIAL_RATE"],[rational(Math.ceil(s.answer.numerator/s.answer.denominator)),"TERMINAL_PARTIAL_DAY_IGNORED"],[rational(Math.max(1,Math.floor(s.answer.numerator/s.answer.denominator))),"TERMINAL_PARTIAL_DAY_IGNORED"]];
  case "findInitialRateFromArithmeticTotal": return [[divide(p.totalOutput!,rational(n)),"AVERAGE_REPORTED_AS_INITIAL"],[add(s.answer,p.dailyChange!),"RATE_CHANGE_COUNT_OFF_BY_ONE"],[add(s.answer,multiply(p.dailyChange!,rational(n-1))),"LAST_RATE_USED_FOR_ALL_DAYS"],[subtract(s.answer,p.dailyChange!),"RATE_CHANGE_COUNT_OFF_BY_ONE"]];
  case "findDailyChangeFromArithmeticTotal": return [[divide(p.totalOutput!,rational(n)),"AVERAGE_OUTPUT_REPORTED_AS_CHANGE"],[divide(apNumerator,rational(n*n)),"RATE_CHANGE_COUNT_OFF_BY_ONE"],[multiply(s.answer,rational(-1)),"INVERSE_FORMULA_REVERSED"]];
  case "findOutputFromGeometricDailyRates": return [[multiply(first,rational(n)),"FIRST_RATE_USED_FOR_ALL_DAYS"],[multiply(last,rational(n)),"LAST_RATE_USED_FOR_ALL_DAYS"],[divide(multiply(add(first,last),rational(n)),rational(2)),"GEOMETRIC_TREATED_AS_ARITHMETIC"]];
  case "findInitialRateFromGeometricTotal": return [[divide(p.totalOutput!,rational(n)),"AVERAGE_REPORTED_AS_INITIAL"],[rates[1],"MULTIPLIER_NOT_COMPOUNDED"],[last,"LAST_RATE_USED_FOR_ALL_DAYS"],[multiply(s.answer,rational(n)),"GEOMETRIC_SUM_FACTOR_WRONG"]];
  case "findMultiplierFromGeometricTotal": return [[add(s.answer,rational(1)),"MULTIPLIER_AS_ADDITIVE_INCREASE"],[divide(rational(1),s.answer),"INVERSE_FORMULA_REVERSED"],[rational(1),"GEOMETRIC_TREATED_AS_ARITHMETIC"]];
  case "findUnknownThresholdDay": return [[add(s.answer,rational(1)),"THRESHOLD_DAY_OFF_BY_ONE"],[subtract(s.answer,rational(1)),"THRESHOLD_DAY_OFF_BY_ONE"],[rational(n-s.answer.numerator),"POST_SWITCH_DURATION_REPORTED"],[rational(n),"FIRST_RATE_USED_FOR_ALL_DAYS"]];
  case "findUnknownPostThresholdRate": {const remaining=subtract(p.totalOutput!,multiply(p.initialRate!,rational(p.thresholdDay!)));return [[divide(p.totalOutput!,rational(n)),"ARITHMETIC_MEAN_MISUSED"],[p.initialRate!,"ORIGINAL_RATE_REPORTED"],[divide(remaining,rational(n)),"REMAINING_PERIOD_COUNT_WRONG"]];}
  case "findOutputWithVaryingCrewByDay": return [[multiply(rational(p.crewCounts![0]*n),p.perWorkerRate!),"CREW_VARIATION_IGNORED"],[multiply(rational(p.crewCounts!.at(-1)!*n),p.perWorkerRate!),"CREW_VARIATION_IGNORED"],[multiply(rational(Math.max(...p.crewCounts!)*n),p.perWorkerRate!),"CREW_VARIATION_IGNORED"],[multiply(rational(Math.min(...p.crewCounts!)*n),p.perWorkerRate!),"CREW_VARIATION_IGNORED"],[rational(p.crewCounts!.reduce((a,b)=>a+b,0)),"CREW_RATE_OMITTED"]];
  case "findCombinedVariableAgentOutput": {const aRates=Array.from({length:n},(_,i)=>add(p.initialRate!,multiply(p.dailyChange!,rational(i))));const bRates=Array.from({length:n},(_,i)=>add(p.peerInitialRate!,multiply(p.peerDailyChange!,rational(i))));return [[sum(aRates),"PEER_SEQUENCE_OMITTED"],[sum(bRates),"PEER_SEQUENCE_OMITTED"],[multiply(add(aRates[0],bRates[0]),rational(n)),"FIRST_RATE_USED_FOR_ALL_DAYS"]];}
  case "findSignedNetVariableOutput": {const positive=Array.from({length:n},(_,i)=>add(p.initialRate!,multiply(p.dailyChange!,rational(i))));const negative=Array.from({length:n},(_,i)=>add(p.negativeInitialRate!,multiply(p.negativeDailyChange!,rational(i))));return [[sum(positive),"NEGATIVE_SEQUENCE_IGNORED"],[add(sum(positive),sum(negative)),"NEGATIVE_SEQUENCE_ADDED"],[multiply(subtract(positive[0],negative[0]),rational(n)),"FIRST_RATE_USED_FOR_ALL_DAYS"]];}
  case "findRequiredDailyAdjustmentForDeadline": {const base=sum(rates);const gap=subtract(p.targetOutput!,base);return [[divide(p.targetOutput!,rational(n)),"TOTAL_AVERAGE_REPORTED_AS_ADJUSTMENT"],[gap,"DEADLINE_GAP_NOT_SPREAD"],[p.initialRate!,"PLANNED_RATE_REPORTED_AS_ADJUSTMENT"]];}
  case "findOutputAfterThresholdRateSwitch": return [[multiply(p.initialRate!,rational(n)),"FIRST_RATE_USED_FOR_ALL_DAYS"],[multiply(p.postThresholdRate!,rational(n)),"POST_SWITCH_RATE_APPLIED_FROM_DAY_ONE"],[multiply(add(p.initialRate!,p.postThresholdRate!),rational(n)),"PHASE_DURATIONS_IGNORED"]];
  case "findCompletionTimeWithVaryingCrewByDay": return [[divide(p.targetOutput!,first),"CREW_VARIATION_IGNORED"],[divide(p.targetOutput!,last),"CREW_VARIATION_IGNORED"],[divide(p.targetOutput!,rates.reduce((m,x)=>compare(x,m)>0?x:m,rates[0])),"CREW_VARIATION_IGNORED"],[divide(p.targetOutput!,divide(sum(rates),rational(rates.length))),"FULL_SCHEDULE_AVERAGE_USED_FOR_EARLY_COMPLETION"],[rational(Math.ceil(s.answer.numerator/s.answer.denominator)),"TERMINAL_PARTIAL_DAY_IGNORED"],[rational(Math.max(1,Math.floor(s.answer.numerator/s.answer.denominator))),"TERMINAL_PARTIAL_DAY_IGNORED"]];
  case "findPostThresholdRateChange": return [[p.postThresholdRate!,"NEW_RATE_REPORTED_AS_CHANGE"],[p.initialRate!,"ORIGINAL_RATE_REPORTED"],[multiply(s.answer,rational(-1)),"INVERSE_FORMULA_REVERSED"]];
 }
}
function genericFallbackCandidates(entry:TmwCp011RegistryEntry,s:TmwCp011Solution):Rational[]{
 const one=rational(1),two=rational(2);
 if(entry.answerType==="RATE_CHANGE")return [multiply(s.answer,rational(-1)),add(s.answer,one),subtract(s.answer,one),multiply(s.answer,two),divide(s.answer,two),add(s.answer,two),subtract(s.answer,two)];
 return [add(s.answer,one),subtract(s.answer,one),multiply(s.answer,two),divide(s.answer,two),add(s.answer,two),subtract(s.answer,two),multiply(s.answer,rational(3)),divide(s.answer,rational(3))];
}
function validDistractorValue(entry:TmwCp011RegistryEntry,value:Rational){
 if(entry.answerType!=="RATE_CHANGE"&&!positive(value))return false;
 if(entry.answerType==="DAY_INDEX"&&value.denominator!==1)return false;
 if(entry.answerType==="OUTPUT"&&value.denominator!==1)return false;
 return true;
}
export function buildTmwCp011Options(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution,seed:string){
 const used=new Set([rationalKey(s.answer)]);const wrong:Array<[Rational,TmwCp011MisconceptionId]>=[];
 for(const [value,id] of candidateList(entry,p,s)){if(!validDistractorValue(entry,value))continue;const key=rationalKey(value);if(used.has(key))continue;used.add(key);wrong.push([value,id]);if(wrong.length===3)break;}
 if(wrong.length<3){for(const value of genericFallbackCandidates(entry,s)){if(!validDistractorValue(entry,value))continue;const key=rationalKey(value);if(used.has(key))continue;used.add(key);wrong.push([value,"PLAUSIBLE_SCALE_ERROR"]);if(wrong.length===3)break;}}
 if(wrong.length<3)throw new Error(`insufficient CP-011 distractors for ${entry.qlId}`);
 const correctIndex=cp011SeedNumber(seed,`${entry.qlId}:position`)%4;const options:TmwCp011Option[]=[];let wi=0;
 for(let i=0;i<4;i++){if(i===correctIndex)options.push({text:s.answerText,value:s.answer,misconceptionId:"CORRECT"});else{const [value,misconceptionId]=wrong[wi++];options.push({text:format(entry,p,value),value,misconceptionId});}}
 return{options,correctIndex};
}
const trapText:Record<Exclude<TmwCp011MisconceptionId,"CORRECT">,string>={
 FIRST_RATE_USED_FOR_ALL_DAYS:"This assumes the Day 1 output stays unchanged on every day.",
 LAST_RATE_USED_FOR_ALL_DAYS:"This uses the last day's output for every day.",
 RATE_CHANGE_COUNT_OFF_BY_ONE:"This counts the daily changes incorrectly. Remember: n days have only n − 1 changes.",
 ARITHMETIC_MEAN_MISUSED:"This gives the overall average instead of the required rate for the second part.",
 AP_SUM_HALF_OMITTED:"This adds the first and last outputs but forgets the division by 2 in the arithmetic-series total.",
 PHASE_DURATIONS_IGNORED:"This uses both rates for the whole schedule instead of using each rate only for its own days.",
 AVERAGE_REPORTED_AS_INITIAL:"This reports the average daily output instead of the Day 1 output.",
 AVERAGE_OUTPUT_REPORTED_AS_CHANGE:"This reports the average daily output instead of the daily increase or decrease.",
 TARGET_DIVIDED_BY_INITIAL_RATE:"This divides the target by the Day 1 rate and wrongly assumes the output never changes.",
 TERMINAL_PARTIAL_DAY_IGNORED:"This rounds the last partly used day to a whole day or leaves that fraction out.",
 GEOMETRIC_TREATED_AS_ARITHMETIC:"This treats repeated multiplication as though the same amount were added each day.",
 GEOMETRIC_SUM_FACTOR_WRONG:"This leaves out one or more multiplier terms when finding the Day 1 output.",
 MULTIPLIER_NOT_COMPOUNDED:"This applies the multiplier only once instead of applying it again every day.",
 MULTIPLIER_AS_ADDITIVE_INCREASE:"This treats a multiplication factor as an amount to be added.",
 THRESHOLD_DAY_OFF_BY_ONE:"This moves the rate change one day too early or one day too late.",
 POST_SWITCH_RATE_APPLIED_FROM_DAY_ONE:"This uses the new rate from Day 1 instead of starting it after the stated change day.",
 POST_SWITCH_DURATION_REPORTED:"This gives the number of days at the new rate, not the day after which the rate changed.",
 ORIGINAL_RATE_REPORTED:"This repeats the old rate instead of calculating the new rate.",
 REMAINING_PERIOD_COUNT_WRONG:"This divides by all scheduled days instead of only the days after the rate changes.",
 CREW_VARIATION_IGNORED:"This keeps one day's worker count for the entire schedule.",
 FULL_SCHEDULE_AVERAGE_USED_FOR_EARLY_COMPLETION:"This uses the average for all displayed days even though the target is reached earlier.",
 CREW_RATE_OMITTED:"This adds worker counts but forgets to multiply by one worker's daily output.",
 PEER_SEQUENCE_OMITTED:"This leaves out one person's changing output.",
 NEGATIVE_SEQUENCE_IGNORED:"This totals accepted output but forgets to deduct rejected output.",
 NEGATIVE_SEQUENCE_ADDED:"This adds rejected output instead of subtracting it.",
 TABLE_ORDER_IGNORED:"This changes the given day order instead of following it exactly.",
 DEADLINE_GAP_NOT_SPREAD:"This treats the entire shortfall as one day's extra output instead of sharing it across all days.",
 TOTAL_AVERAGE_REPORTED_AS_ADJUSTMENT:"This gives the target's average per day, not the extra amount needed above the plan.",
 PLANNED_RATE_REPORTED_AS_ADJUSTMENT:"This repeats the planned Day 1 output instead of finding the extra daily amount.",
 NEW_RATE_REPORTED_AS_CHANGE:"This gives the new rate itself instead of the increase or decrease from the old rate.",
 INVERSE_FORMULA_REVERSED:"This works backward in the wrong direction, changing the sign or size of the answer.",
 PLAUSIBLE_SCALE_ERROR:"This comes from a believable multiplication, division or cancellation slip in the final calculation."
};
export function selectTmwCp011Trap(options:TmwCp011Option[],correctIndex:number):TmwCp011CommonTrap{const index=(correctIndex+1)%4;const option=options[index];if(option.misconceptionId==="CORRECT")throw new Error("trap selected correct option");const optionLabel=`Option ${"ABCD"[index]}`;return{optionLabel,optionText:option.text,misconceptionId:option.misconceptionId,explanation:`Don't fall for ${optionLabel} (${option.text})! ${trapText[option.misconceptionId]}`};}
