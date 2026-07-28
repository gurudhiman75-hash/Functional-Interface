import { rational, toLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp011CommonTrap, TmwCp011Explanation, TmwCp011Parameters, TmwCp011RegistryEntry, TmwCp011Solution } from "./cp011-types";
import { cp011TeacherConclusion, cp011TeacherOpening, cp011TeacherShortcut, cp011TeacherSteps } from "./cp011-teacher";

function inline(value:Rational){return `\\(${toLatex(value)}\\)`;}
function magnitude(value:Rational){return rational(Math.abs(value.numerator),value.denominator);}
function signedChange(change:Rational,unit:string){
 if(change.numerator===0)return "stays the same each day";
 const amount=magnitude(change);const label=amount.numerator===amount.denominator?unit.replace(/s$/," ").trim():unit;
 return `${change.numerator>0?"increases":"decreases"} by ${inline(amount)} ${label} each day`;
}
function multiplierPhrase(value:Rational){
 if(value.numerator===2&&value.denominator===1)return "doubles each day";
 if(value.numerator===1&&value.denominator===2)return "becomes half of the previous day's output";
 return `becomes ${inline(value)} times the previous day's output`;
}
function sequenceList(values:Rational[]){return values.map(value=>value.denominator===1?String(value.numerator):inline(value)).join(", ");}
function daysLabel(days:number){return days===1?"day":"days";}

export function renderTmwCp011Stem(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters):string{
 const c=p.context,a=p.initialRate!,d=p.dailyChange!,n=p.days!;
 switch(entry.solveMode){
  case "findOutputFromArithmeticDailyRates":return `At ${c.setting}, ${c.actor} ${c.action} ${a.numerator} ${c.unit} on Day 1. The output ${signedChange(d,c.unit)}. How many ${c.unit} are completed in all after ${n} days?`;
  case "findCompletionTimeFromArithmeticDailyRates":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output ${signedChange(d,c.unit)}. A batch contains ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit}. In exactly how many days is the batch completed?`;
  case "findInitialRateFromArithmeticTotal":return `At ${c.setting}, ${c.actor}'s output ${signedChange(d,c.unit)}. In ${n} days, ${c.actor} completes ${p.totalOutput!.numerator} ${c.unit}. How many ${c.unit} were completed on Day 1?`;
  case "findDailyChangeFromArithmeticTotal":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output changes by the same amount every day. If the total for ${n} days is ${p.totalOutput!.numerator} ${c.unit}, what is the daily increase or decrease?`;
  case "findOutputFromGeometricDailyRates":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output ${multiplierPhrase(p.multiplier!)}. How many ${c.unit} are completed in all after ${n} days?`;
  case "findCompletionTimeFromGeometricDailyRates":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output ${multiplierPhrase(p.multiplier!)}. How long is needed to complete ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit}?`;
  case "findInitialRateFromGeometricTotal":return `At ${c.setting}, the output ${multiplierPhrase(p.multiplier!)}. The total for ${n} days is ${p.totalOutput!.denominator===1?p.totalOutput!.numerator:inline(p.totalOutput!)} ${c.unit}. What was the Day 1 output?`;
  case "findMultiplierFromGeometricTotal":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output is multiplied by the same factor every day. If the ${n}-day total is ${p.totalOutput!.denominator===1?p.totalOutput!.numerator:inline(p.totalOutput!)} ${c.unit}, what is that multiplier?`;
  case "findCompletionTimeAfterThresholdRateSwitch":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} ${daysLabel(p.thresholdDay!)}. From the next day, the rate is ${p.postThresholdRate!.numerator} ${c.unit} per day. How long is needed to complete ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit}?`;
  case "findUnknownThresholdDay":return `At ${c.setting}, ${c.actor} first completes ${a.numerator} ${c.unit} per day. After some complete days, the rate becomes ${p.postThresholdRate!.numerator} ${c.unit} per day. The total for ${n} days is ${p.totalOutput!.numerator} ${c.unit}. After which day did the rate change?`;
  case "findUnknownPostThresholdRate":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. The rate then changes and stays constant. If the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}, what is the new daily rate?`;
  case "findOutputWithVaryingCrewByDay":return `At ${c.setting}, the worker counts for five successive days are ${p.crewCounts!.join(", ")}. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. What is the total output for the five days?`;
  case "findCombinedVariableAgentOutput":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1 and the output ${signedChange(d,c.unit)}. ${c.peerActor} completes ${p.peerInitialRate!.numerator} ${c.unit} on Day 1 and the output ${signedChange(p.peerDailyChange!,c.unit)}. What is their combined output after ${n} days?`;
  case "findSignedNetVariableOutput":return `At ${c.setting}, accepted output is ${a.numerator} ${c.unit} on Day 1 and ${signedChange(d,c.unit)}. Rejected output is ${p.negativeInitialRate!.numerator} ${c.unit} on Day 1 and ${signedChange(p.negativeDailyChange!,c.unit)}. What is the net accepted output after ${n} days?`;
  case "findCompletionTimeFromExplicitRateTable":return `At ${c.setting}, the scheduled outputs for successive days are ${sequenceList(p.explicitRates!)} ${c.unit}. In exactly how many days is the target of ${p.targetOutput!.denominator===1?p.targetOutput!.numerator:inline(p.targetOutput!)} ${c.unit} reached?`;
  case "findRequiredDailyAdjustmentForDeadline":return `At ${c.setting}, ${c.actor}'s plan starts at ${a.numerator} ${c.unit} on Day 1 and increases by ${d.numerator} ${c.unit} each day. To complete ${p.targetOutput!.numerator} ${c.unit} within ${p.requiredDeadlineDays} days, how much extra output must be added equally on every day?`;
  case "findOutputAfterThresholdRateSwitch":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. From the next day, the rate is ${p.postThresholdRate!.numerator} ${c.unit} per day. What is the total output after ${n} days?`;
  case "findCompletionTimeWithVaryingCrewByDay":return `At ${c.setting}, the worker counts for five successive days are ${p.crewCounts!.join(", ")}. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. In exactly how many days is the target of ${p.targetOutput!.numerator} ${c.unit} completed?`;
  case "findPostThresholdRateChange":return `At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. The rate then changes and stays constant. If the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}, by how much did the daily rate increase or decrease?`;
 }
}

function givens(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters):string[]{
 const out:string[]=[];const mode=entry.solveMode;
 if(p.initialRate&&!["findInitialRateFromArithmeticTotal","findInitialRateFromGeometricTotal"].includes(mode))out.push(`Day 1 output: ${inline(p.initialRate)} ${p.context.unit}.`);
 if(p.dailyChange&&mode!=="findDailyChangeFromArithmeticTotal")out.push(`Daily change: ${p.dailyChange.numerator>0?"increase":"decrease"} of ${inline(magnitude(p.dailyChange))} ${p.context.unit}.`);
 if(p.multiplier&&mode!=="findMultiplierFromGeometricTotal")out.push(`Daily multiplier: ${inline(p.multiplier)}.`);
 if(p.days)out.push(`Number of days: ${p.days}.`);
 if(p.thresholdDay!==undefined&&mode!=="findUnknownThresholdDay")out.push(`The rate changes after Day ${p.thresholdDay}.`);
 if(p.postThresholdRate&&!["findUnknownPostThresholdRate","findPostThresholdRateChange"].includes(mode))out.push(`New daily rate: ${inline(p.postThresholdRate)} ${p.context.unit} per day.`);
 if(p.targetOutput)out.push(`Target: ${inline(p.targetOutput)} ${p.context.unit}.`);
 if(p.totalOutput&&entry.answerType!=="OUTPUT")out.push(`Total output: ${inline(p.totalOutput)} ${p.context.unit}.`);
 if(p.crewCounts)out.push(`Worker counts by day: ${p.crewCounts.join(", ")}.`);
 if(p.perWorkerRate)out.push(`One worker's daily output: ${inline(p.perWorkerRate)} ${p.context.unit}.`);
 if(p.peerInitialRate)out.push(`${p.context.peerActor}'s Day 1 output: ${inline(p.peerInitialRate)} ${p.context.unit}.`);
 if(p.peerDailyChange)out.push(`${p.context.peerActor}'s daily change: ${inline(p.peerDailyChange)} ${p.context.unit}.`);
 if(p.negativeInitialRate)out.push(`Rejected output on Day 1: ${inline(p.negativeInitialRate)} ${p.context.unit}.`);
 if(p.negativeDailyChange)out.push(`Change in rejected output each day: ${inline(p.negativeDailyChange)} ${p.context.unit}.`);
 if(p.explicitRates)out.push(`Daily outputs in order: ${sequenceList(p.explicitRates)} ${p.context.unit}.`);
 return out;
}

export function buildTmwCp011Explanation(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,s:TmwCp011Solution,trap:TmwCp011CommonTrap):TmwCp011Explanation{
 return{opening:cp011TeacherOpening(entry),formula:`\\(${s.formulaLatex}\\)`,givens:givens(entry,p),steps:cp011TeacherSteps(entry,p,s),shortcut:cp011TeacherShortcut(entry,s),commonTrap:trap,conclusion:cp011TeacherConclusion(s)};
}
