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
 if(entry.answerType==="RATE_CHANGE"){const magnitude=rational(Math.abs(value.numerator),value.denominator);const direction=value.numerator<0?"decrease":"increase";const unit=magnitude.numerator===magnitude.denominator?p.context.unit.replace(/s$/," ").trim():p.context.unit;const cadence=p.sequenceKind==="THRESHOLD"?"per day":"each day";return `${direction} of ${magnitude.denominator===1?magnitude.numerator:`\(${toLatex(magnitude)}\)`} ${unit} ${cadence}`; }
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
export function buildTmwCp011Options(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution,seed:string){
 const used=new Set([rationalKey(s.answer)]);const wrong:Array<[Rational,TmwCp011MisconceptionId]>=[];
 for(const [value,id] of candidateList(entry,p,s)){if(entry.answerType!=="RATE_CHANGE"&&!positive(value)||entry.answerType==="DAY_INDEX"&&value.denominator!==1||entry.answerType==="OUTPUT"&&value.denominator!==1)continue;const key=rationalKey(value);if(used.has(key))continue;used.add(key);wrong.push([value,id]);if(wrong.length===3)break;}
 if(wrong.length<3)throw new Error(`insufficient CP-011 distractors for ${entry.qlId}`);
 const correctIndex=cp011SeedNumber(seed,`${entry.qlId}:position`)%4;const options:TmwCp011Option[]=[];let wi=0;
 for(let i=0;i<4;i++){if(i===correctIndex)options.push({text:s.answerText,value:s.answer,misconceptionId:"CORRECT"});else{const [value,misconceptionId]=wrong[wi++];options.push({text:format(entry,p,value),value,misconceptionId});}}
 return{options,correctIndex};
}
const trapText:Record<Exclude<TmwCp011MisconceptionId,"CORRECT">,string>={
 FIRST_RATE_USED_FOR_ALL_DAYS:"results from treating the first day's rate as constant throughout the schedule.",
 LAST_RATE_USED_FOR_ALL_DAYS:"results from applying the final day's rate to every day.",
 RATE_CHANGE_COUNT_OFF_BY_ONE:"results from using the wrong number of changes between the first and final terms.",
 ARITHMETIC_MEAN_MISUSED:"reports the overall average output instead of isolating the required phase rate.",
 AP_SUM_HALF_OMITTED:"results from using n(first + last) and forgetting the division by 2 in the arithmetic-series sum.",
 PHASE_DURATIONS_IGNORED:"applies both phase rates across the full schedule instead of weighting each rate by its own duration.",
 AVERAGE_REPORTED_AS_INITIAL:"reports the average daily output as though it were the first day's output.",
 AVERAGE_OUTPUT_REPORTED_AS_CHANGE:"reports the average daily output instead of the daily increase or decrease.",
 TARGET_DIVIDED_BY_INITIAL_RATE:"results from dividing the target by the first-day rate as though productivity never changes.",
 TERMINAL_PARTIAL_DAY_IGNORED:"results from rounding the terminal fraction to a whole day or omitting it.",
 GEOMETRIC_TREATED_AS_ARITHMETIC:"results from treating multiplicative growth or decline as an arithmetic sequence.",
 GEOMETRIC_SUM_FACTOR_WRONG:"uses an incomplete geometric-sum factor when recovering the first term.",
 MULTIPLIER_NOT_COMPOUNDED:"results from applying the multiplier only once instead of successively.",
 MULTIPLIER_AS_ADDITIVE_INCREASE:"treats the multiplicative factor as an additive increase to the multiplier itself.",
 THRESHOLD_DAY_OFF_BY_ONE:"results from moving the rate switch one day earlier or later.",
 POST_SWITCH_RATE_APPLIED_FROM_DAY_ONE:"results from applying the new rate before the stated threshold.",
 POST_SWITCH_DURATION_REPORTED:"reports the number of days at the new rate instead of the day after which the switch occurred.",
 ORIGINAL_RATE_REPORTED:"reports the original phase rate instead of solving the post-switch rate.",
 REMAINING_PERIOD_COUNT_WRONG:"divides the post-switch work by all scheduled days instead of only the remaining days.",
 CREW_VARIATION_IGNORED:"results from keeping one day's crew size for the entire schedule.",
 FULL_SCHEDULE_AVERAGE_USED_FOR_EARLY_COMPLETION:"uses the average rate of the entire displayed schedule even though the target is reached before that schedule ends.",
 CREW_RATE_OMITTED:"adds worker counts but omits each worker's daily output rate.",
 PEER_SEQUENCE_OMITTED:"results from omitting one contributor's changing output sequence.",
 NEGATIVE_SEQUENCE_IGNORED:"counts all accepted output but fails to deduct the rejected-output sequence.",
 NEGATIVE_SEQUENCE_ADDED:"adds rejected or reversing output instead of subtracting it.",
 TABLE_ORDER_IGNORED:"results from rearranging the displayed daily rates rather than following their order.",
 DEADLINE_GAP_NOT_SPREAD:"treats the whole output shortfall as a one-day adjustment instead of spreading it across the deadline.",
 TOTAL_AVERAGE_REPORTED_AS_ADJUSTMENT:"reports the target's average daily output instead of the extra output required above the planned schedule.",
 PLANNED_RATE_REPORTED_AS_ADJUSTMENT:"reports the planned first-day rate as though it were the required additional daily output.",
 NEW_RATE_REPORTED_AS_CHANGE:"reports the new daily rate itself instead of the increase or decrease from the original rate.",
 INVERSE_FORMULA_REVERSED:"results from reversing the inverse relation used to recover the unknown parameter.",
 PLAUSIBLE_SCALE_ERROR:"results from an otherwise plausible scale or cancellation error in the final arithmetic."
};
export function selectTmwCp011Trap(options:TmwCp011Option[],correctIndex:number):TmwCp011CommonTrap{const index=(correctIndex+1)%4;const option=options[index];if(option.misconceptionId==="CORRECT")throw new Error("trap selected correct option");return{optionLabel:`Option ${"ABCD"[index]}`,optionText:option.text,misconceptionId:option.misconceptionId,explanation:`${`Option ${"ABCD"[index]} (${option.text})`} ${trapText[option.misconceptionId]}`};}
