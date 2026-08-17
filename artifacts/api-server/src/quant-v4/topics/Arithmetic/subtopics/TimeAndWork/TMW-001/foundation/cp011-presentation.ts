import { rational, toLatex } from "./rational";
import type { Rational } from "./types";
import type { TmwCp011CommonTrap, TmwCp011Explanation, TmwCp011Parameters, TmwCp011RegistryEntry, TmwCp011Solution } from "./cp011-types";
import { cp011SeedNumber } from "./cp011-engine";
import { cp011TeacherConclusion, cp011TeacherOpening, cp011TeacherShortcut, cp011TeacherSteps } from "./cp011-teacher";

export type TmwCp011StemOpeningStyle = "SUBJECT_FIRST" | "TEMPORAL_FIRST" | "OBJECTIVE_FIRST" | "CONTEXT_FIRST";
type StemVariants = Record<TmwCp011StemOpeningStyle,string>;

const STEM_OPENING_ROTATION:readonly TmwCp011StemOpeningStyle[]=["SUBJECT_FIRST","TEMPORAL_FIRST","SUBJECT_FIRST","OBJECTIVE_FIRST","CONTEXT_FIRST"];

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
function displayed(value:Rational){return value.denominator===1?String(value.numerator):inline(value);}
function seedOrdinal(seed:string){const match=seed.match(/(\d+)$/);return match?Number(match[1]):cp011SeedNumber(seed,"stem-opening");}
export function selectTmwCp011StemOpeningStyle(entry:TmwCp011RegistryEntry,seed:string):TmwCp011StemOpeningStyle{
 const qlOrdinal=Number(entry.qlId.slice(-3))-193;
 return STEM_OPENING_ROTATION[(qlOrdinal+seedOrdinal(seed))%STEM_OPENING_ROTATION.length];
}
function selectStem(entry:TmwCp011RegistryEntry,seed:string,variants:StemVariants){return variants[selectTmwCp011StemOpeningStyle(entry,seed)];}

export function renderTmwCp011Stem(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters,seed:string):string{
 const c=p.context,a=p.initialRate!,d=p.dailyChange!,n=p.days!;
 switch(entry.solveMode){
  case "findOutputFromArithmeticDailyRates":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} ${c.action} ${a.numerator} ${c.unit} on Day 1 while working at ${c.setting}. The daily output ${signedChange(d,c.unit)}. How many ${c.unit} are completed in all after ${n} days?`,
   TEMPORAL_FIRST:`On Day 1 at ${c.setting}, ${c.actor} ${c.action} ${a.numerator} ${c.unit}. The output ${signedChange(d,c.unit)}. What is the total output after ${n} days?`,
   OBJECTIVE_FIRST:`Across the ${n}-day work schedule at ${c.setting}, ${c.actor} begins with ${a.numerator} ${c.unit} on Day 1. The output ${signedChange(d,c.unit)}. How many ${c.unit} are completed altogether?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} ${c.action} ${a.numerator} ${c.unit} on Day 1. The output ${signedChange(d,c.unit)}. How many ${c.unit} are completed in all after ${n} days?`
  });
  case "findCompletionTimeFromArithmeticDailyRates":{const target=displayed(p.targetOutput!);return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} on Day 1 at ${c.setting}. The daily output ${signedChange(d,c.unit)}. In exactly how many days will a batch of ${target} ${c.unit} be completed?`,
   TEMPORAL_FIRST:`Starting on Day 1 at ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit}, and the output then ${signedChange(d,c.unit)}. How long will it take to finish ${target} ${c.unit}?`,
   OBJECTIVE_FIRST:`A batch of ${target} ${c.unit} must be completed at ${c.setting}. ${c.actor} starts with ${a.numerator} ${c.unit} on Day 1, and the output ${signedChange(d,c.unit)}. In exactly how many days is the batch completed?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output ${signedChange(d,c.unit)}. A batch contains ${target} ${c.unit}. In exactly how many days is the batch completed?`
  });}
  case "findInitialRateFromArithmeticTotal":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor}'s daily output at ${c.setting} ${signedChange(d,c.unit)}. After ${n} days, the total is ${p.totalOutput!.numerator} ${c.unit}. How many ${c.unit} were completed on Day 1?`,
   TEMPORAL_FIRST:`Over ${n} days, ${c.actor} completes ${p.totalOutput!.numerator} ${c.unit} at ${c.setting}. If the daily output ${signedChange(d,c.unit)}, what was the Day 1 output?`,
   OBJECTIVE_FIRST:`A total of ${p.totalOutput!.numerator} ${c.unit} is completed by ${c.actor} in ${n} days at ${c.setting}. The daily output ${signedChange(d,c.unit)}. How many ${c.unit} were completed on the first day?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor}'s output ${signedChange(d,c.unit)}. In ${n} days, ${c.actor} completes ${p.totalOutput!.numerator} ${c.unit}. How many ${c.unit} were completed on Day 1?`
  });
  case "findDailyChangeFromArithmeticTotal":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} on Day 1 at ${c.setting}. The output changes by the same amount every day, producing ${p.totalOutput!.numerator} ${c.unit} in ${n} days. What is the daily increase or decrease?`,
   TEMPORAL_FIRST:`Over ${n} days at ${c.setting}, ${c.actor} completes ${p.totalOutput!.numerator} ${c.unit} after starting with ${a.numerator} ${c.unit} on Day 1. If the output changes equally each day, what is that daily change?`,
   OBJECTIVE_FIRST:`To reach a total of ${p.totalOutput!.numerator} ${c.unit} over ${n} days at ${c.setting}, ${c.actor} starts with ${a.numerator} ${c.unit} on Day 1 and changes the output by a fixed amount each day. Find that daily change.`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output changes by the same amount every day. If the total for ${n} days is ${p.totalOutput!.numerator} ${c.unit}, what is the daily increase or decrease?`
  });
  case "findOutputFromGeometricDailyRates":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} on Day 1 at ${c.setting}. The output ${multiplierPhrase(p.multiplier!)}. How many ${c.unit} are completed altogether in ${n} days?`,
   TEMPORAL_FIRST:`On Day 1 at ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit}. The output then ${multiplierPhrase(p.multiplier!)}. What is the total after ${n} days?`,
   OBJECTIVE_FIRST:`Across the ${n}-day production run at ${c.setting}, ${c.actor} begins with ${a.numerator} ${c.unit} on Day 1 and the output ${multiplierPhrase(p.multiplier!)}. Find the total output.`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output ${multiplierPhrase(p.multiplier!)}. How many ${c.unit} are completed in all after ${n} days?`
  });
  case "findCompletionTimeFromGeometricDailyRates":{const target=displayed(p.targetOutput!);return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} on Day 1 at ${c.setting}, and the output ${multiplierPhrase(p.multiplier!)}. How long is needed to complete ${target} ${c.unit}?`,
   TEMPORAL_FIRST:`Beginning on Day 1 at ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit}. The output then ${multiplierPhrase(p.multiplier!)}. In exactly how many days will ${target} ${c.unit} be completed?`,
   OBJECTIVE_FIRST:`A target of ${target} ${c.unit} must be completed at ${c.setting}. ${c.actor} starts with ${a.numerator} ${c.unit} on Day 1, and the output ${multiplierPhrase(p.multiplier!)}. Find the exact completion time.`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output ${multiplierPhrase(p.multiplier!)}. How long is needed to complete ${target} ${c.unit}?`
  });}
  case "findInitialRateFromGeometricTotal":{const total=displayed(p.totalOutput!);return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor}'s output at ${c.setting} ${multiplierPhrase(p.multiplier!)}. The ${n}-day total is ${total} ${c.unit}. What was the Day 1 output?`,
   TEMPORAL_FIRST:`Over ${n} days at ${c.setting}, the output ${multiplierPhrase(p.multiplier!)} and totals ${total} ${c.unit}. How many ${c.unit} were completed on Day 1?`,
   OBJECTIVE_FIRST:`The total for ${n} days at ${c.setting} is ${total} ${c.unit}. If each day's output ${multiplierPhrase(p.multiplier!)}, find the first day's output.`,
   CONTEXT_FIRST:`At ${c.setting}, the output ${multiplierPhrase(p.multiplier!)}. The total for ${n} days is ${total} ${c.unit}. What was the Day 1 output?`
  });}
  case "findMultiplierFromGeometricTotal":{const total=displayed(p.totalOutput!);return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} on Day 1 at ${c.setting}. The output is multiplied by the same factor each day, giving ${total} ${c.unit} in ${n} days. What is the multiplier?`,
   TEMPORAL_FIRST:`During the ${n}-day run at ${c.setting}, ${c.actor} starts with ${a.numerator} ${c.unit} and reaches a total of ${total} ${c.unit} by multiplying the output by the same factor each day. Find that factor.`,
   OBJECTIVE_FIRST:`To account for a ${n}-day total of ${total} ${c.unit} at ${c.setting}, ${c.actor} starts with ${a.numerator} ${c.unit} on Day 1 and uses one constant daily multiplier. What is it?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1. The output is multiplied by the same factor every day. If the ${n}-day total is ${total} ${c.unit}, what is that multiplier?`
  });}
  case "findCompletionTimeAfterThresholdRateSwitch":{const target=displayed(p.targetOutput!);return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} ${daysLabel(p.thresholdDay!)} at ${c.setting}. The rate then becomes ${p.postThresholdRate!.numerator} ${c.unit} per day. How long is needed to complete ${target} ${c.unit}?`,
   TEMPORAL_FIRST:`For the first ${p.thresholdDay} ${daysLabel(p.thresholdDay!)} at ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day. From the next day, the rate is ${p.postThresholdRate!.numerator} ${c.unit} per day. Find the exact time needed for ${target} ${c.unit}.`,
   OBJECTIVE_FIRST:`A target of ${target} ${c.unit} must be completed at ${c.setting}. ${c.actor} works at ${a.numerator} ${c.unit} per day for ${p.thresholdDay} ${daysLabel(p.thresholdDay!)}, then at ${p.postThresholdRate!.numerator} ${c.unit} per day. How long will the work take?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} ${daysLabel(p.thresholdDay!)}. From the next day, the rate is ${p.postThresholdRate!.numerator} ${c.unit} per day. How long is needed to complete ${target} ${c.unit}?`
  });}
  case "findUnknownThresholdDay":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} first completes ${a.numerator} ${c.unit} per day at ${c.setting}. After some complete days, the rate becomes ${p.postThresholdRate!.numerator} ${c.unit} per day, and the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}. After which day did the rate change?`,
   TEMPORAL_FIRST:`During the ${n}-day schedule at ${c.setting}, ${c.actor}'s rate changes from ${a.numerator} to ${p.postThresholdRate!.numerator} ${c.unit} per day. The total is ${p.totalOutput!.numerator} ${c.unit}. After which day did the change occur?`,
   OBJECTIVE_FIRST:`To produce ${p.totalOutput!.numerator} ${c.unit} in ${n} days at ${c.setting}, ${c.actor} works first at ${a.numerator} ${c.unit} per day and then at ${p.postThresholdRate!.numerator} ${c.unit} per day. Find the day after which the rate changed.`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} first completes ${a.numerator} ${c.unit} per day. After some complete days, the rate becomes ${p.postThresholdRate!.numerator} ${c.unit} per day. The total for ${n} days is ${p.totalOutput!.numerator} ${c.unit}. After which day did the rate change?`
  });
  case "findUnknownPostThresholdRate":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days at ${c.setting}. The rate then changes and stays constant, producing ${p.totalOutput!.numerator} ${c.unit} in ${n} days. What is the new daily rate?`,
   TEMPORAL_FIRST:`During the ${n}-day period at ${c.setting}, ${c.actor} works at ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. A new constant rate then takes the total to ${p.totalOutput!.numerator} ${c.unit}. Find the new rate.`,
   OBJECTIVE_FIRST:`A total of ${p.totalOutput!.numerator} ${c.unit} must be completed in ${n} days at ${c.setting}. ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days, then changes to a constant rate. What is that rate?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. The rate then changes and stays constant. If the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}, what is the new daily rate?`
  });
  case "findOutputWithVaryingCrewByDay":return selectStem(entry,seed,{
   SUBJECT_FIRST:`Workers at ${c.setting} are scheduled in groups of ${p.crewCounts!.join(", ")} over five successive days. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. What is the total output?`,
   TEMPORAL_FIRST:`Over five successive days at ${c.setting}, the worker counts are ${p.crewCounts!.join(", ")}. If each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day, find the five-day output.`,
   OBJECTIVE_FIRST:`To find the five-day output at ${c.setting}, use daily crew sizes of ${p.crewCounts!.join(", ")} and a per-worker rate of ${p.perWorkerRate!.numerator} ${c.unit} per day. What total is completed?`,
   CONTEXT_FIRST:`At ${c.setting}, the worker counts for five successive days are ${p.crewCounts!.join(", ")}. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. What is the total output for the five days?`
  });
  case "findCombinedVariableAgentOutput":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} starts with ${a.numerator} ${c.unit} on Day 1 at ${c.setting}, and the output ${signedChange(d,c.unit)}. ${c.peerActor} starts with ${p.peerInitialRate!.numerator} ${c.unit}, and the output ${signedChange(p.peerDailyChange!,c.unit)}. What is their combined output after ${n} days?`,
   TEMPORAL_FIRST:`Over ${n} days at ${c.setting}, ${c.actor} and ${c.peerActor} follow changing output schedules. They start with ${a.numerator} and ${p.peerInitialRate!.numerator} ${c.unit} respectively. ${c.actor}'s output ${signedChange(d,c.unit)}, while ${c.peerActor}'s output ${signedChange(p.peerDailyChange!,c.unit)}. Find their combined total.`,
   OBJECTIVE_FIRST:`The combined ${n}-day output of ${c.actor} and ${c.peerActor} must be found at ${c.setting}. ${c.actor} starts with ${a.numerator} ${c.unit}, and the output ${signedChange(d,c.unit)}. ${c.peerActor} starts with ${p.peerInitialRate!.numerator} ${c.unit}, and the output ${signedChange(p.peerDailyChange!,c.unit)}. What is the total?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} on Day 1 and the output ${signedChange(d,c.unit)}. ${c.peerActor} completes ${p.peerInitialRate!.numerator} ${c.unit} on Day 1 and the output ${signedChange(p.peerDailyChange!,c.unit)}. What is their combined output after ${n} days?`
  });
  case "findSignedNetVariableOutput":return selectStem(entry,seed,{
   SUBJECT_FIRST:`Accepted output at ${c.setting} starts at ${a.numerator} ${c.unit} on Day 1 and ${signedChange(d,c.unit)}. Rejected output starts at ${p.negativeInitialRate!.numerator} ${c.unit} and ${signedChange(p.negativeDailyChange!,c.unit)}. What is the net accepted output after ${n} days?`,
   TEMPORAL_FIRST:`During the ${n}-day quality-control run at ${c.setting}, accepted output starts at ${a.numerator} ${c.unit} and rejected output at ${p.negativeInitialRate!.numerator} ${c.unit}. Accepted output ${signedChange(d,c.unit)}, while rejected output ${signedChange(p.negativeDailyChange!,c.unit)}. Find the net accepted output.`,
   OBJECTIVE_FIRST:`To calculate net accepted output for ${n} days at ${c.setting}, track accepted work beginning at ${a.numerator} ${c.unit} and rejected work beginning at ${p.negativeInitialRate!.numerator} ${c.unit}. Accepted output ${signedChange(d,c.unit)}, while rejected output ${signedChange(p.negativeDailyChange!,c.unit)}. What is the net total?`,
   CONTEXT_FIRST:`At ${c.setting}, accepted output is ${a.numerator} ${c.unit} on Day 1 and ${signedChange(d,c.unit)}. Rejected output is ${p.negativeInitialRate!.numerator} ${c.unit} on Day 1 and ${signedChange(p.negativeDailyChange!,c.unit)}. What is the net accepted output after ${n} days?`
  });
  case "findCompletionTimeFromExplicitRateTable":{const target=displayed(p.targetOutput!);return selectStem(entry,seed,{
   SUBJECT_FIRST:`The daily schedule at ${c.setting} lists outputs of ${sequenceList(p.explicitRates!)} ${c.unit} in order. In exactly how many days is the target of ${target} ${c.unit} reached?`,
   TEMPORAL_FIRST:`Across successive days at ${c.setting}, the scheduled outputs are ${sequenceList(p.explicitRates!)} ${c.unit}. Find the exact time needed to reach ${target} ${c.unit}.`,
   OBJECTIVE_FIRST:`A target of ${target} ${c.unit} must be reached at ${c.setting} using the daily outputs ${sequenceList(p.explicitRates!)} in the given order. In exactly how many days is it reached?`,
   CONTEXT_FIRST:`At ${c.setting}, the scheduled outputs for successive days are ${sequenceList(p.explicitRates!)} ${c.unit}. In exactly how many days is the target of ${target} ${c.unit} reached?`
  });}
  case "findRequiredDailyAdjustmentForDeadline":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor}'s plan at ${c.setting} starts with ${a.numerator} ${c.unit} on Day 1 and increases by ${d.numerator} ${c.unit} each day. How much extra output must be added equally each day to complete ${p.targetOutput!.numerator} ${c.unit} within ${p.requiredDeadlineDays} days?`,
   TEMPORAL_FIRST:`Within ${p.requiredDeadlineDays} days at ${c.setting}, ${c.actor} must complete ${p.targetOutput!.numerator} ${c.unit}. The plan starts at ${a.numerator} ${c.unit} on Day 1 and rises by ${d.numerator} ${c.unit} each day. Find the equal extra output needed per day.`,
   OBJECTIVE_FIRST:`To complete ${p.targetOutput!.numerator} ${c.unit} within ${p.requiredDeadlineDays} days at ${c.setting}, ${c.actor} follows a plan beginning at ${a.numerator} ${c.unit} and increasing by ${d.numerator} each day. What equal daily addition is required?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor}'s plan starts at ${a.numerator} ${c.unit} on Day 1 and increases by ${d.numerator} ${c.unit} each day. To complete ${p.targetOutput!.numerator} ${c.unit} within ${p.requiredDeadlineDays} days, how much extra output must be added equally on every day?`
  });
  case "findOutputAfterThresholdRateSwitch":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days at ${c.setting}. From the next day, the rate is ${p.postThresholdRate!.numerator} ${c.unit} per day. What is the total output after ${n} days?`,
   TEMPORAL_FIRST:`For the first ${p.thresholdDay} days at ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day. The rate then changes to ${p.postThresholdRate!.numerator} ${c.unit} per day. Find the ${n}-day total.`,
   OBJECTIVE_FIRST:`The total output for ${n} days must be found at ${c.setting}. ${c.actor} works at ${a.numerator} ${c.unit} per day for ${p.thresholdDay} days and at ${p.postThresholdRate!.numerator} ${c.unit} per day thereafter. What is the total?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. From the next day, the rate is ${p.postThresholdRate!.numerator} ${c.unit} per day. What is the total output after ${n} days?`
  });
  case "findCompletionTimeWithVaryingCrewByDay":return selectStem(entry,seed,{
   SUBJECT_FIRST:`A changing crew at ${c.setting} has ${p.crewCounts!.join(", ")} workers on five successive days. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. In exactly how many days is the target of ${p.targetOutput!.numerator} ${c.unit} completed?`,
   TEMPORAL_FIRST:`Over five successive days at ${c.setting}, the worker counts are ${p.crewCounts!.join(", ")}. At ${p.perWorkerRate!.numerator} ${c.unit} per worker per day, how long is needed to complete ${p.targetOutput!.numerator} ${c.unit}?`,
   OBJECTIVE_FIRST:`A target of ${p.targetOutput!.numerator} ${c.unit} must be completed at ${c.setting}. The five daily crew sizes are ${p.crewCounts!.join(", ")}, and each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. Find the exact completion time.`,
   CONTEXT_FIRST:`At ${c.setting}, the worker counts for five successive days are ${p.crewCounts!.join(", ")}. Each worker completes ${p.perWorkerRate!.numerator} ${c.unit} per day. In exactly how many days is the target of ${p.targetOutput!.numerator} ${c.unit} completed?`
  });
  case "findPostThresholdRateChange":return selectStem(entry,seed,{
   SUBJECT_FIRST:`${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days at ${c.setting}. The rate then changes and stays constant, giving ${p.totalOutput!.numerator} ${c.unit} in ${n} days. By how much did the daily rate increase or decrease?`,
   TEMPORAL_FIRST:`During the ${n}-day period at ${c.setting}, ${c.actor} works at ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. A new constant rate produces a total of ${p.totalOutput!.numerator} ${c.unit}. Find the change in daily rate.`,
   OBJECTIVE_FIRST:`To explain a total of ${p.totalOutput!.numerator} ${c.unit} in ${n} days at ${c.setting}, ${c.actor}'s rate changes after Day ${p.thresholdDay} from ${a.numerator} ${c.unit} per day to a new constant rate. By how much did it change?`,
   CONTEXT_FIRST:`At ${c.setting}, ${c.actor} completes ${a.numerator} ${c.unit} per day for the first ${p.thresholdDay} days. The rate then changes and stays constant. If the ${n}-day total is ${p.totalOutput!.numerator} ${c.unit}, by how much did the daily rate increase or decrease?`
  });
 }
}

function givens(entry:TmwCp011RegistryEntry,p:TmwCp011Parameters):string[]{
 const out:string[]=[];const mode=entry.solveMode;
 if(p.initialRate&&!['findInitialRateFromArithmeticTotal','findInitialRateFromGeometricTotal'].includes(mode))out.push(`Day 1 output: ${inline(p.initialRate)} ${p.context.unit}.`);
 if(p.dailyChange&&mode!=="findDailyChangeFromArithmeticTotal")out.push(`Daily change: ${p.dailyChange.numerator>0?"increase":"decrease"} of ${inline(magnitude(p.dailyChange))} ${p.context.unit}.`);
 if(p.multiplier&&mode!=="findMultiplierFromGeometricTotal")out.push(`Daily multiplier: ${inline(p.multiplier)}.`);
 if(p.days)out.push(`Number of days: ${p.days}.`);
 if(p.thresholdDay!==undefined&&mode!=="findUnknownThresholdDay")out.push(`The rate changes after Day ${p.thresholdDay}.`);
 if(p.postThresholdRate&&!['findUnknownPostThresholdRate','findPostThresholdRateChange'].includes(mode))out.push(`New daily rate: ${inline(p.postThresholdRate)} ${p.context.unit} per day.`);
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
