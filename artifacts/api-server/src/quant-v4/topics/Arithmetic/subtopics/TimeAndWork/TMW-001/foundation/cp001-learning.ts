import { add, divide, multiply, rational, reciprocal, subtract, toLatex } from "./rational";
import { percent, required } from "./cp001-helpers";
import type { Rational, TmwCp001Parameters, TmwCp001RegistryEntry, TmwCp001Solution, TmwMisconceptionId, TmwOption } from "./types";

export interface TmwCp001LearningShortcut {
  title: string;
  steps: string[];
}

export interface TmwCp001CommonTrap {
  optionLabel: string;
  optionText: string;
  misconceptionId: Exclude<TmwMisconceptionId, "CORRECT">;
  explanation: string;
}

function setupLatex(entry:TmwCp001RegistryEntry,p:TmwCp001Parameters):string {
  switch(entry.solveMode){
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":return `\\text{Known: }r=${toLatex(p.rate)},\\quad t=${toLatex(p.time)}`;
    case "findRateFromWorkAndTime":
    case "findRequiredRateForTargetCompletion":return `\\text{Known: }W=${toLatex(p.totalWork)},\\quad t=${toLatex(p.time)}`;
    case "findTimeFromWorkAndRate":return `\\text{Known: }W=${toLatex(p.totalWork)},\\quad r=${toLatex(p.rate)}`;
    case "findOneUnitWorkFromCompletionTime":return `\\text{Whole-work time }T=${toLatex(reciprocal(p.rate))}`;
    case "findCompletionTimeFromOneUnitWork":return `\\text{One-unit rate }r=${toLatex(p.rate)}`;
    case "findFractionCompletedInGivenTime":
    case "findPercentCompletedInGivenTime":
    case "findRemainingFractionAfterTime":
    case "findRemainingPercentAfterTime":return `\\text{Completed work starts from }r\\times t=${toLatex(p.rate)}\\times${toLatex(p.time)}`;
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent":return `\\text{Target work }W_{target}=${toLatex(required(p.requestedFraction,"requestedFraction"))},\\quad r=${toLatex(p.rate)}`;
    case "recoverWholeWorkFromPartAndFraction":return `W_{part}=${toLatex(required(p.partWork,"partWork"))},\\quad f=${toLatex(required(p.requestedFraction,"requestedFraction"))}`;
    case "recoverWholeTimeFromPartCompletion":return `t_{part}=${toLatex(required(p.partTime,"partTime"))},\\quad f=${toLatex(required(p.requestedFraction,"requestedFraction"))}`;
    case "convertRateAcrossTimeUnits":return `W_{source}=${toLatex(p.totalWork)},\\quad t_{source}=${toLatex(required(p.sourceDuration,"sourceDuration"))},\\quad t_{target}=${toLatex(required(p.targetDuration,"targetDuration"))}`;
    case "compareWorkCompletedAtEqualTime":return `r_1=${toLatex(p.rate)},\\quad r_2=${toLatex(required(p.secondaryRate,"secondaryRate"))},\\quad t=${toLatex(p.time)}`;
    case "compareTimeForDifferentWorkAtSameRate":return `W_1=${toLatex(p.totalWork)},\\quad W_2=${toLatex(required(p.secondaryWork,"secondaryWork"))},\\quad r=${toLatex(p.rate)}`;
    case "findDelayFromReducedUniformRate":
    case "findTimeSavedFromIncreasedUniformRate":return `t_{old}=${toLatex(required(p.originalTime,"originalTime"))},\\quad p=${toLatex(required(p.changePercent,"changePercent"))}\\%`;
  }
}

function checkLatex(entry:TmwCp001RegistryEntry,p:TmwCp001Parameters,s:TmwCp001Solution):string {
  const x=s.answer;
  switch(entry.solveMode){
    case "findWorkFromRateAndTime":
    case "findOutputFromUnitRateAndTime":return `\\text{Check: }\\frac{${toLatex(x)}}{${toLatex(p.time)}}=${toLatex(p.rate)}`;
    case "findRateFromWorkAndTime":
    case "findRequiredRateForTargetCompletion":return `\\text{Check: }${toLatex(x)}\\times${toLatex(p.time)}=${toLatex(p.totalWork)}`;
    case "findTimeFromWorkAndRate":return `\\text{Check: }${toLatex(x)}\\times${toLatex(p.rate)}=${toLatex(p.totalWork)}`;
    case "findOneUnitWorkFromCompletionTime":return `\\text{Check: }${toLatex(x)}\\times${toLatex(reciprocal(p.rate))}=1`;
    case "findCompletionTimeFromOneUnitWork":return `\\text{Check: }${toLatex(x)}\\times${toLatex(p.rate)}=1`;
    case "findFractionCompletedInGivenTime":return `0<${toLatex(x)}\\le1`;
    case "findPercentCompletedInGivenTime":return `\\frac{${toLatex(x)}}{100}=${toLatex(multiply(p.rate,p.time))}`;
    case "findTimeForGivenFraction":
    case "findTimeForGivenPercent":return `\\text{Check: }${toLatex(x)}\\times${toLatex(p.rate)}=${toLatex(required(p.requestedFraction,"requestedFraction"))}`;
    case "findRemainingFractionAfterTime":return `${toLatex(x)}+${toLatex(multiply(p.rate,p.time))}=1`;
    case "findRemainingPercentAfterTime":return `\\frac{${toLatex(x)}}{100}+${toLatex(multiply(p.rate,p.time))}=1`;
    case "recoverWholeWorkFromPartAndFraction":return `${toLatex(x)}\\times${toLatex(required(p.requestedFraction,"requestedFraction"))}=${toLatex(required(p.partWork,"partWork"))}`;
    case "recoverWholeTimeFromPartCompletion":return `${toLatex(x)}\\times${toLatex(required(p.requestedFraction,"requestedFraction"))}=${toLatex(required(p.partTime,"partTime"))}`;
    case "convertRateAcrossTimeUnits":return `\\frac{${toLatex(x)}}{${toLatex(required(p.targetDuration,"targetDuration"))}}=\\frac{${toLatex(p.totalWork)}}{${toLatex(required(p.sourceDuration,"sourceDuration"))}}`;
    case "compareWorkCompletedAtEqualTime":return `${toLatex(x)}=(${toLatex(p.rate)}-${toLatex(required(p.secondaryRate,"secondaryRate"))})${toLatex(p.time)}`;
    case "compareTimeForDifferentWorkAtSameRate":return `${toLatex(x)}=\\frac{${toLatex(p.totalWork)}-${toLatex(required(p.secondaryWork,"secondaryWork"))}}{${toLatex(p.rate)}}`;
    case "findDelayFromReducedUniformRate":return `t_{new}=t_{old}+${toLatex(x)}`;
    case "findTimeSavedFromIncreasedUniformRate":return `t_{new}=t_{old}-${toLatex(x)}`;
  }
}

export function buildTmwCp001WorkingLatex(entry:TmwCp001RegistryEntry,p:TmwCp001Parameters,s:TmwCp001Solution):string[]{
  return [setupLatex(entry,p),...s.workedLatex,checkLatex(entry,p,s)];
}

export function buildTmwCp001Shortcut(entry:TmwCp001RegistryEntry,p:TmwCp001Parameters,s:TmwCp001Solution):TmwCp001LearningShortcut {
  switch(entry.solveMode){
    case "findWorkFromRateAndTime":return {title:"10-Second Rate × Time",steps:[`Multiply the generated rate by the available ${p.timeUnit} count; the result is ${s.answerText}.`]};
    case "findRateFromWorkAndTime":return {title:"10-Second Work ÷ Time",steps:[`Divide ${p.context.object} completed by the elapsed time to obtain ${s.answerText}.`]};
    case "findTimeFromWorkAndRate":return {title:"10-Second Work ÷ Rate",steps:[`Divide the required work by the per-${p.timeUnit} rate; this gives ${s.answerText}.`]};
    case "findOneUnitWorkFromCompletionTime":return {title:"10-Second Reciprocal Rate",steps:[`A whole-work time and a one-${p.timeUnit} work rate are reciprocals, giving ${s.answerText}.`]};
    case "findCompletionTimeFromOneUnitWork":return {title:"10-Second Reciprocal Time",steps:[`Invert the one-${p.timeUnit} work rate to obtain the full completion time, ${s.answerText}.`]};
    case "findFractionCompletedInGivenTime":return {title:"10-Second Completed Share",steps:[`Multiply the whole-work rate by time and keep the result as a fraction: ${s.answerText}.`]};
    case "findPercentCompletedInGivenTime":return {title:"10-Second Fraction-to-Percent",steps:[`First find the completed fraction, then multiply it by 100 to obtain ${s.answerText}.`]};
    case "findTimeForGivenFraction":return {title:"10-Second Target-Fraction Time",steps:[`Divide the requested fraction by the work rate; the target is reached in ${s.answerText}.`]};
    case "findTimeForGivenPercent":return {title:"10-Second Percent Target",steps:[`Convert the target percentage to a fraction, then divide by the rate to get ${s.answerText}.`]};
    case "findRemainingFractionAfterTime":return {title:"10-Second Complement",steps:[`Find the completed fraction and subtract it from 1; the remainder is ${s.answerText}.`]};
    case "findRemainingPercentAfterTime":return {title:"10-Second Remaining Percent",steps:[`Subtract the completed fraction from 1 and convert the remainder to percent: ${s.answerText}.`]};
    case "findOutputFromUnitRateAndTime":return {title:"10-Second Output Scale",steps:[`Scale the unit output rate by the generated duration; total output is ${s.answerText}.`]};
    case "recoverWholeWorkFromPartAndFraction":return {title:"10-Second Part-to-Whole",steps:[`Divide the known part by the fraction it represents; the whole is ${s.answerText}.`]};
    case "recoverWholeTimeFromPartCompletion":return {title:"10-Second Time Scale-Up",steps:[`Divide the time used for the known fraction by that fraction; full time is ${s.answerText}.`]};
    case "convertRateAcrossTimeUnits":return {title:"10-Second Unit-Rate Bridge",steps:[`Find one source-time-unit output, then multiply by the target duration to get ${s.answerText}.`]};
    case "compareWorkCompletedAtEqualTime":return {title:"10-Second Rate Difference",steps:[`With equal time, multiply the difference of the two rates by the common time; the work gap is ${s.answerText}.`]};
    case "compareTimeForDifferentWorkAtSameRate":return {title:"10-Second Work-Difference Time",steps:[`At the same rate, divide the work difference by that rate; the time gap is ${s.answerText}.`]};
    case "findRequiredRateForTargetCompletion":return {title:"10-Second Deadline Rate",steps:[`Divide the target work by the allowed time; the required uniform rate is ${s.answerText}.`]};
    case "findDelayFromReducedUniformRate":return {title:"10-Second Reduced-Rate Delay",steps:[`Divide the old time by the retained rate fraction, then subtract the old time; delay is ${s.answerText}.`]};
    case "findTimeSavedFromIncreasedUniformRate":return {title:"10-Second Faster-Rate Saving",steps:[`Divide the old time by the increased rate factor, then subtract the new time from the old; saving is ${s.answerText}.`]};
  }
}

const preferredTrap:Partial<Record<TmwCp001RegistryEntry["solveMode"],TmwMisconceptionId[]>>={
  findWorkFromRateAndTime:["RATE_TIME_ADDITION","RATE_TIME_DIVISION"],
  findRateFromWorkAndTime:["WORK_TIME_MULTIPLICATION","RATE_TIME_DIVISION"],
  findTimeFromWorkAndRate:["WORK_RATE_MULTIPLICATION","RECIPROCAL_NOT_TAKEN"],
  findOneUnitWorkFromCompletionTime:["RECIPROCAL_NOT_TAKEN","RECIPROCAL_WRONG_DENOMINATOR"],
  findCompletionTimeFromOneUnitWork:["RECIPROCAL_NOT_TAKEN","RECIPROCAL_WRONG_DENOMINATOR"],
  findFractionCompletedInGivenTime:["RATE_TIME_ADDITION","PERCENT_NOT_SCALED"],
  findPercentCompletedInGivenTime:["PERCENT_NOT_SCALED","RATE_TIME_ADDITION"],
  findTimeForGivenFraction:["TARGET_FRACTION_INVERTED","TARGET_COMPLEMENT_USED"],
  findTimeForGivenPercent:["PERCENT_NOT_SCALED","TARGET_FRACTION_INVERTED"],
  findRemainingFractionAfterTime:["COMPLETED_REPORTED_AS_REMAINING","REMAINING_REPORTED_AS_COMPLETED"],
  findRemainingPercentAfterTime:["COMPLETED_REPORTED_AS_REMAINING","PERCENT_NOT_SCALED"],
  findOutputFromUnitRateAndTime:["RATE_TIME_ADDITION","RATE_TIME_DIVISION"],
  recoverWholeWorkFromPartAndFraction:["PART_MULTIPLIED_INSTEAD_OF_DIVIDED","PART_COMPLEMENT_USED"],
  recoverWholeTimeFromPartCompletion:["PART_MULTIPLIED_INSTEAD_OF_DIVIDED","PART_COMPLEMENT_USED"],
  convertRateAcrossTimeUnits:["UNIT_CONVERSION_REVERSED","UNIT_CONVERSION_IGNORED"],
  compareWorkCompletedAtEqualTime:["COMPARISON_SUM_INSTEAD_OF_DIFFERENCE","FIRST_QUANTITY_REPORTED"],
  compareTimeForDifferentWorkAtSameRate:["COMPARISON_SUM_INSTEAD_OF_DIFFERENCE","FIRST_QUANTITY_REPORTED"],
  findRequiredRateForTargetCompletion:["REQUIRED_RATE_INVERTED","WORK_TIME_MULTIPLICATION"],
  findDelayFromReducedUniformRate:["CHANGED_TOTAL_TIME_REPORTED","ORIGINAL_TIME_REPORTED"],
  findTimeSavedFromIncreasedUniformRate:["CHANGED_TOTAL_TIME_REPORTED","ORIGINAL_TIME_REPORTED"],
};

function trapReason(id:Exclude<TmwMisconceptionId,"CORRECT">):string{
  switch(id){
    case "RATE_TIME_ADDITION":return "adds rate and time even though work is obtained by multiplying them";
    case "RATE_TIME_DIVISION":return "divides rate by time instead of applying the work-rate-time relation";
    case "WORK_TIME_MULTIPLICATION":return "multiplies work and time when rate requires work divided by time";
    case "WORK_RATE_MULTIPLICATION":return "multiplies work and rate when time requires work divided by rate";
    case "RECIPROCAL_NOT_TAKEN":return "uses a rate as though it were a completion time, or a time as though it were a rate";
    case "RECIPROCAL_WRONG_DENOMINATOR":return "forms the reciprocal from the wrong quantity";
    case "PERCENT_NOT_SCALED":return "stops at a fraction or treats a percentage as a whole number without the factor of 100";
    case "COMPLETED_REPORTED_AS_REMAINING":return "reports the completed share although the question asks for what remains";
    case "REMAINING_REPORTED_AS_COMPLETED":return "uses the complement although the question asks for the completed share";
    case "TARGET_FRACTION_INVERTED":return "reverses target work and rate while solving for time";
    case "TARGET_COMPLEMENT_USED":return "uses the complement of the requested target";
    case "PART_MULTIPLIED_INSTEAD_OF_DIVIDED":return "multiplies by the known fraction instead of dividing the part by it";
    case "PART_COMPLEMENT_USED":return "uses the uncompleted fraction rather than the fraction represented by the known part";
    case "UNIT_CONVERSION_REVERSED":return "reverses the source-to-target duration scale";
    case "UNIT_CONVERSION_IGNORED":return "keeps the source-duration output without scaling it to the target duration";
    case "COMPARISON_SUM_INSTEAD_OF_DIFFERENCE":return "adds the two quantities although the question asks for their difference";
    case "FIRST_QUANTITY_REPORTED":return "reports the first total rather than the difference between the two cases";
    case "SECOND_QUANTITY_REPORTED":return "reports the second total rather than the requested comparison";
    case "REQUIRED_RATE_INVERTED":return "uses time divided by work instead of work divided by time";
    case "CHANGED_TOTAL_TIME_REPORTED":return "reports the revised total time although only the delay or saving is required";
    case "ORIGINAL_TIME_REPORTED":return "copies the original time without applying the rate change";
    case "PERCENT_OF_TIME_ONLY":return "takes the percentage of the old time directly instead of first finding the changed completion time";
  }
}

export function buildTmwCp001CommonTrap(entry:TmwCp001RegistryEntry,options:TmwOption[]):TmwCp001CommonTrap{
  const preferred=preferredTrap[entry.solveMode]??[];
  let selectedIndex=-1;
  for(const id of preferred){
    const index=options.findIndex(option=>option.misconceptionId===id);
    if(index>=0){selectedIndex=index;break;}
  }
  if(selectedIndex<0)selectedIndex=options.findIndex(option=>option.misconceptionId!=="CORRECT");
  if(selectedIndex<0)throw new Error("CP-001 option set has no distractor for the common-trap explanation");
  const selected=options[selectedIndex];
  if(selected.misconceptionId==="CORRECT")throw new Error("CP-001 common trap selected the correct option");
  const optionLabel=`Option ${"ABCD"[selectedIndex]??selectedIndex+1}`;
  return {
    optionLabel,
    optionText:selected.text,
    misconceptionId:selected.misconceptionId,
    explanation:`${optionLabel} (${selected.text}) ${trapReason(selected.misconceptionId)}.`,
  };
}
