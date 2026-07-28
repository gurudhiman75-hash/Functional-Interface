import { add, compare, divide, multiply, rational, subtract, toLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp011CommonTrap, TmwCp011Explanation, TmwCp011GeneratedQuestion, TmwCp011LearningShortcut, TmwCp011Parameters, TmwCp011RegistryEntry, TmwCp011Solution } from "./cp011-types";
import { cp011RatesFor } from "./cp011-engine";

function inline(v:Rational){return `\\(${toLatex(v)}\\)`;}
function signedChange(d:Rational,unit:string){if(d.numerator===0)return "remains unchanged";const magnitude=rational(Math.abs(d.numerator),d.denominator);const label=magnitude.numerator===magnitude.denominator?unit.replace(/s$/,""):unit;return `${d.numerator>0?"increases":"decreases"} by ${inline(magnitude)} ${label} on each succeeding day`;}
function sequenceList(values:Rational[]){return values.map(v=>v.denominator===1?String(v.numerator):inline(v)).join(", ");}
function daysLabel(n:number){return n===1?"day":"days";}

export function renderTmwCp011Stem(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters):string{
 const c=p.context,a=p.initialRate!,d=p.dailyChange!,n=p.days!;
 switch(entry.solveMode){
  case "findOutputFromArithmeticDailyRates": return `At ${c.setting}, ${c.actor} ${c.action} ${a.numerator} ${c.unit} on the first day. The daily output ${signedChange(d,c.unit)}. How many ${c.unit} are completed in ${n} days?`;
  case "findCompletionTimeFromArithmeticDailyRates": return `At ${c.setting}, ${c.actor} starts by completing ${a.numerator} ${c.unit} on day 1, and the daily output ${signedChange(d,c.unit)}. A batch contains ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit}. In exactly how many days is the batch completed?`;
  case "findInitialRateFromArithmeticTotal": return `At ${c.setting}, ${c.actor}'s daily output ${signedChange(d,c.unit)}. Over ${n} days, ${c.actor} completes ${p.totalOutput!.numerator} ${c.unit}. How many ${c.unit} were completed on the first day?`;
  case "findDailyChangeFromArithmeticTotal": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on day 1. The output changes by the same amount each day, and the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}. What is the daily change in output?`;
  case "findOutputFromGeometricDailyRates": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on day 1. Each succeeding day's output is ${inline(p.multiplier!)} times the preceding day's output. What is the total output in ${n} days?`;
  case "findCompletionTimeFromGeometricDailyRates": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on day 1, and each succeeding day's output is ${inline(p.multiplier!)} times the previous day's output. How long is required to complete ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit}?`;
  case "findInitialRateFromGeometricTotal": return `At ${c.setting}, each day's output is ${inline(p.multiplier!)} times the preceding day's output. The total over ${n} days is ${p.totalOutput!.denominator===1?p.totalOutput!.numerator:inline(p.totalOutput!)} ${c.unit}. What was the first day's output?`;
  case "findMultiplierFromGeometricTotal": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on day 1. Output is multiplied by the same factor each day, and the ${n}-day total is ${p.totalOutput!.denominator===1?p.totalOutput!.numerator:inline(p.totalOutput!)} ${c.unit}. What is the daily multiplier?`;
  case "findCompletionTimeAfterThresholdRateSwitch": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} ${daysLabel(p.thresholdDay!)}. From the next day, the rate becomes ${p.postThresholdRate!.numerator} ${c.unit} per day. How long is required to complete ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit}?`;
  case "findUnknownThresholdDay": return `At ${c.setting}, ${c.actor} initially completes ${a.numerator} ${c.unit} per day. After an unknown number of complete days, the rate changes to ${p.postThresholdRate!.numerator} ${c.unit} per day. The ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}. After which day did the rate change?`;
  case "findUnknownPostThresholdRate": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. The rate then becomes constant at a new value. If the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}, what is the new daily rate?`;
  case "findOutputWithVaryingCrewByDay": return `At ${c.setting}, the number of equally efficient workers over five successive days is ${p.crewCounts!.join(", ")}. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. What is the total output over the five days?`;
  case "findCombinedVariableAgentOutput": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on day 1, and the daily output ${signedChange(d,c.unit)}. ${c.peerActor} completes ${p.peerInitialRate!.numerator} ${c.unit} on day 1, and the daily output ${signedChange(p.peerDailyChange!,c.unit)}. What is their combined output over ${n} days?`;
  case "findSignedNetVariableOutput": return `At ${c.setting}, accepted output is ${a.numerator} ${c.unit} on day 1 and ${signedChange(d,c.unit)}. Rejected output is ${p.negativeInitialRate!.numerator} ${c.unit} on day 1 and ${signedChange(p.negativeDailyChange!,c.unit)}. What is the net accepted output over ${n} days?`;
  case "findCompletionTimeFromExplicitRateTable": return `At ${c.setting}, the scheduled outputs for successive days are ${sequenceList(p.explicitRates!)} ${c.unit}. In exactly how many days is a target of ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit} reached?`;
  case "findRequiredDailyAdjustmentForDeadline": return `At ${c.setting}, ${c.actor}'s planned output starts at ${a.numerator} ${c.unit} on day 1 and increases by ${d.numerator} ${c.unit} each day. To complete ${p.targetOutput!.numerator} ${c.unit} within ${p.requiredDeadlineDays} days, what equal additional output is required on each day?`;
  case "findOutputAfterThresholdRateSwitch": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. From the next day, the rate becomes ${p.postThresholdRate!.numerator} ${c.unit} per day. What is the total output over ${n} days?`;
  case "findCompletionTimeWithVaryingCrewByDay": return `At ${c.setting}, the numbers of equally efficient workers scheduled on five successive days are ${p.crewCounts!.join(", ")}. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. In exactly how many days is a target of ${p.targetOutput!.numerator} ${c.unit} completed?`;
  case "findPostThresholdRateChange": return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. The rate then changes and remains constant. If the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}, by how much and in which direction did the daily rate change?`;
 }
}

function givens(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters):string[]{
 const out:string[]=[]; const mode=entry.solveMode;
 if(p.initialRate && !["findInitialRateFromArithmeticTotal","findInitialRateFromGeometricTotal"].includes(mode))out.push(`Initial daily output: ${inline(p.initialRate)} ${p.context.unit}.`);
 if(p.dailyChange && mode!=="findDailyChangeFromArithmeticTotal")out.push(`Daily arithmetic change: ${inline(p.dailyChange)} ${p.context.unit}.`);
 if(p.multiplier && mode!=="findMultiplierFromGeometricTotal")out.push(`Daily multiplier: ${inline(p.multiplier)}.`);
 if(p.days)out.push(`Number of scheduled days: ${p.days}.`);
 if(p.thresholdDay!==undefined && mode!=="findUnknownThresholdDay")out.push(`Rate switch occurs after day ${p.thresholdDay}.`);
 if(p.postThresholdRate && !["findUnknownPostThresholdRate","findPostThresholdRateChange"].includes(mode))out.push(`Post-switch rate: ${inline(p.postThresholdRate)} ${p.context.unit} per day.`);
 if(p.targetOutput)out.push(`Target output: ${inline(p.targetOutput)} ${p.context.unit}.`);
 if(p.totalOutput && entry.answerType!=="OUTPUT")out.push(`Total output: ${inline(p.totalOutput)} ${p.context.unit}.`);
 if(p.crewCounts)out.push(`Daily crew counts: ${p.crewCounts.join(", ")}.`);
 if(p.perWorkerRate)out.push(`Per-worker daily output: ${inline(p.perWorkerRate)} ${p.context.unit}.`);
 if(p.peerInitialRate)out.push(`Second agent's first-day output: ${inline(p.peerInitialRate)} ${p.context.unit}.`);
 if(p.peerDailyChange)out.push(`Second agent's daily change: ${inline(p.peerDailyChange)} ${p.context.unit}.`);
 if(p.negativeInitialRate)out.push(`Rejected first-day output: ${inline(p.negativeInitialRate)} ${p.context.unit}.`);
 if(p.negativeDailyChange)out.push(`Rejected-output daily change: ${inline(p.negativeDailyChange)} ${p.context.unit}.`);
 if(p.explicitRates)out.push(`Displayed daily rates: ${sequenceList(p.explicitRates)} ${p.context.unit}.`);
 return out;
}

function keyRule(entry:TmwCp011RegistryEntry):string{
 if(entry.ruleId==="TMW_ARITHMETIC_RATE_SUM")return "When daily output changes by a fixed amount, the daily rates form an arithmetic progression. Count the first day as term 1, so the nth rate is \(a+(n-1)d\).";
 if(entry.ruleId==="TMW_GEOMETRIC_RATE_SUM")return "When each day's output is a fixed multiple of the previous day, the daily rates form a geometric progression. Apply the multiplier successively rather than only once.";
 if(entry.ruleId==="TMW_VARIABLE_COMPLETION"||entry.ruleId==="TMW_EXPLICIT_RATE_TABLE")return "Accumulate complete-day outputs first, then divide the remaining work by the active rate of the terminal day. A final partial day must not be rounded to a whole day.";
 if(entry.ruleId==="TMW_THRESHOLD_SWITCH")return "Split the timeline at the exact rate-change boundary. Work before and after the switch must be calculated with their own rates.";
 if(entry.ruleId==="TMW_CREW_SCHEDULE")return entry.solveMode==="findCompletionTimeWithVaryingCrewByDay"?"Convert each day's crew count into that day's output, accumulate complete days, and use only the required fraction of the terminal day.":"For each day, daily output equals crew count multiplied by per-worker output. Add the day-wise totals only after applying the changing crew size.";
 if(entry.ruleId==="TMW_COMBINED_SEQUENCE")return "Build each agent's daily-output sequence independently, total each sequence, and then combine the two contributions.";
 if(entry.ruleId==="TMW_SIGNED_SEQUENCE")return "Accepted or constructive output is positive; rejected or reversing output is negative. Calculate both variable sequences before taking the signed net total.";
 return "First calculate the output produced by the planned variable schedule. Spread the remaining deadline gap equally across all available days.";
}

function shortcut(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution):TmwCp011LearningShortcut{
 if(entry.solveMode.includes("Arithmetic")||entry.solveMode.includes("arithmetic"))return{title:"10-Second AP Shortcut",steps:["Use first + last to avoid listing every daily rate.",`Apply \\(S_n=\\frac{n}{2}(a+l)\\) whenever the first and final rates are known.`, `The required result is ${s.answerText}.`]};
 if(entry.solveMode.includes("Geometric")||entry.solveMode.includes("geometric")||entry.solveMode.includes("Multiplier"))return{title:"10-Second GP Shortcut",steps:["Write the first few powers of the multiplier and factor out the first-day rate.","Use the finite geometric-sum factor instead of repeated addition.",`The required result is ${s.answerText}.`]};
 if(entry.ruleId==="TMW_THRESHOLD_SWITCH")return{title:"10-Second Phase Split",steps:["Draw one vertical mark immediately after the last day at the old rate.","Compute old-rate work first; only the remainder uses the new rate.",`The required result is ${s.answerText}.`]};
 if(entry.ruleId==="TMW_CREW_SCHEDULE")return{title:"10-Second Crew-Total Method",steps:["Add the daily crew counts first because each worker has the same rate.","Multiply total worker-days by one worker's daily output.",`The required result is ${s.answerText}.`]};
 return{title:"10-Second Running-Total Method",steps:["Maintain one cumulative total and stop before the first day that would cross the target.","Use only the required fraction of the terminal day's rate.",`The required result is ${s.answerText}.`]};
}

export function buildTmwCp011Explanation(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution,trap:TmwCp011CommonTrap):TmwCp011Explanation{
 return{
  opening:keyRule(entry),
  formula:`\\(${s.formulaLatex}\\)`,
  givens:givens(entry,p),
  steps:s.workedLatex.map(x=>`\\(${x}\\)`),
  shortcut:shortcut(entry,p,s),
  commonTrap:trap,
  conclusion:`Therefore, ${s.answerText} is the required answer.`,
 };
}
