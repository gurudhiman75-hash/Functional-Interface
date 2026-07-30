import { cycleDuration, cycleWork } from "./cp005-engine";
import { toLatex } from "./rational";
import type { TmwCp005MisconceptionId, TmwCp005Option, TmwCp005Parameters, TmwCp005RegistryEntry, TmwCp005Solution } from "./cp005-types";

export interface TmwCp005LearningShortcut { title:string; steps:string[]; }
export interface TmwCp005CommonTrap { optionLabel:string; optionText:string; misconceptionId:Exclude<TmwCp005MisconceptionId,"CORRECT">; explanation:string; }

function setupLatex(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters):string{
 const base=`W_{cycle}=${toLatex(cycleWork(p.cycle))},\\quad T_{cycle}=${toLatex(cycleDuration(p.cycle))},\\quad s=${p.startOffset??0}`;
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":return `${base},\\quad \\text{first turn}=A`;
  case "findCompletionTimeForTwoAgentAlternationStartingB":return `${base},\\quad \\text{first turn}=B`;
  case "findCompletionTimeForMultiDayCycle":return `${base},\\quad \\text{repeat the full multi-day block}`;
  case "findCompletionTimeForThreeAgentCycle":return `${base},\\quad \\text{order}=A\\to B\\to C`;
  case "findCompletionDayAndTerminalFraction":return `${base},\\quad \\text{retain the fractional final turn}`;
  case "findWorkAfterGivenNumberOfCycles":return `${base},\\quad n=${p.givenCycles??0}`;
  case "findRemainingWorkAfterFullCycles":return `${base},\\quad n=${p.givenCycles??0},\\quad W_{remaining}=1-nW_{cycle}`;
  case "findTerminalAgent":return `${base},\\quad \\text{identify the segment containing completion}`;
  case "findStartingAgentFromCompletionCondition":return `${base},\\quad T_{known}=${p.knownCompletionTime?toLatex(p.knownCompletionTime):"?"}`;
  case "findUnknownRateFromAlternatingCompletion":return `${base},\\quad T_{known}=${p.knownCompletionTime?toLatex(p.knownCompletionTime):"?"},\\quad r_x=?`;
  case "findUnknownTimeFromAlternatingCompletion":return `${base},\\quad T_{known}=${p.knownCompletionTime?toLatex(p.knownCompletionTime):"?"},\\quad T_x=1/r_x`;
  case "findCompletionWhenHelperWorksEveryNthDay":return `${base},\\quad k=${p.patternNumber??0},\\quad \\text{helper active on turn }k`;
  case "findCompletionWhenAgentRestsEveryNthDay":return `${base},\\quad k=${p.patternNumber??0},\\quad r_{rest}=0`;
  case "findCompletionWithWeekendOrHolidayPattern":return `${base},\\quad \\text{calendar includes zero-work days}`;
  case "findCompletionWithUnequalShiftDurations":return `${base},\\quad W_i=r_i\\Delta t_i`;
  case "findCompletionWithTwoDaysOnOneDayOffPattern":return `${base},\\quad \\text{two work days plus one rest day}`;
  case "findCompletionWithPeriodicNegativeWork":return `${base},\\quad W_{cycle}=W_+-W_-`;
  case "findCompletionWithRepeatedJoinLeaveCycle":return `${base},\\quad \\text{solo and together turns repeat}`;
  case "findCycleCountToReachSpecifiedFraction":return `${base},\\quad W_{target}=${p.targetWork?toLatex(p.targetWork):"?"}`;
  case "findTimeFromArbitraryCyclePhase":return `${base},\\quad \\text{start from offset }s`;
  case "findExactBoundaryCompletion":return `${base},\\quad W=nW_{cycle}`;
  case "findCompletionWithinCycleSegment":return `${base},\\quad \\text{final segment may be partial}`;
  case "findOutputUnderPeriodicMachineSchedule":return `${base},\\quad n=${p.givenCycles??0},\\quad Q=nW_{cycle}`;
  case "findRequiredCycleRateForDeadline":return `${base},\\quad D=${p.deadline?toLatex(p.deadline):"?"},\\quad r_x=?`;
 }
}

function checkLatex(entry:TmwCp005RegistryEntry,s:TmwCp005Solution):string{
 const answer=typeof s.answer==="string"?`\\text{${s.answer}}`:toLatex(s.answer);
 switch(entry.answerType){
  case "TIME":return `\\text{Verified exact elapsed time for ${entry.solveMode}: }T=${answer}`;
  case "FRACTION":return `\\text{Verified cycle-state fraction for ${entry.solveMode}: }W=${answer}`;
  case "COUNT":return `\\text{Verified whole-cycle count for ${entry.solveMode}: }n=${answer}`;
  case "AGENT":return `\\text{Verified schedule identity for ${entry.solveMode}: }${answer}`;
  case "RATE":return `\\text{Verified isolated cycle rate for ${entry.solveMode}: }r=${answer}`;
  case "OUTPUT":return `\\text{Verified repeated-cycle output for ${entry.solveMode}: }Q=${answer}`;
 }
}

export function buildTmwCp005WorkingLatex(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,s:TmwCp005Solution):string[]{return [setupLatex(entry,p),...s.workedLatex,checkLatex(entry,s)];}

export function buildTmwCp005Shortcut(entry:TmwCp005RegistryEntry,p:TmwCp005Parameters,s:TmwCp005Solution):TmwCp005LearningShortcut{
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":return {title:"10-Second A-First Alternation",steps:[`Find one A-then-B cycle, repeat full cycles, and use only the required part of the final turn; total ${s.answerText}.`]};
  case "findCompletionTimeForTwoAgentAlternationStartingB":return {title:"10-Second B-First Alternation",steps:[`Preserve the B-first order while repeating cycles and calculate the last partial turn; total ${s.answerText}.`]};
  case "findCompletionTimeForMultiDayCycle":return {title:"10-Second Multi-Day Block",steps:[`Add every segment's work for one full block, repeat it, then finish the residual work; answer ${s.answerText}.`]};
  case "findCompletionTimeForThreeAgentCycle":return {title:"10-Second Three-Agent Rotation",steps:[`Treat A, B, and C as one ordered cycle and locate completion inside the final rotation; answer ${s.answerText}.`]};
  case "findCompletionDayAndTerminalFraction":return {title:"10-Second Complete Days Plus Fraction",steps:[`Count completed turns first, then divide the last work remainder by the active rate; exact time ${s.answerText}.`]};
  case "findWorkAfterGivenNumberOfCycles":return {title:"10-Second Cycle Work Scale",steps:[`Multiply one-cycle work by the stated whole-cycle count; completed work ${s.answerText}.`]};
  case "findRemainingWorkAfterFullCycles":return {title:"10-Second Cycle Complement",steps:[`Subtract full-cycle work from the whole assignment; remaining work ${s.answerText}.`]};
  case "findTerminalAgent":return {title:"10-Second Terminal Turn",steps:[`Repeat complete cycles and identify whose next segment can absorb the remaining work; ${s.answerText}.`]};
  case "findStartingAgentFromCompletionCondition":return {title:"10-Second Test Both Starts",steps:[`Run the schedule once from each possible start and retain the one matching both finish time and terminal agent; ${s.answerText}.`]};
  case "findUnknownRateFromAlternatingCompletion":return {title:"10-Second Missing Turn Rate",steps:[`Count the unknown worker's active duration, subtract known work from one, and divide; rate ${s.answerText}.`]};
  case "findUnknownTimeFromAlternatingCompletion":return {title:"10-Second Missing Solo Time",steps:[`Isolate the unknown alternating rate, then take its reciprocal; solo time ${s.answerText}.`]};
  case "findCompletionWhenHelperWorksEveryNthDay":return {title:"10-Second Nth-Day Helper Block",steps:[`Build one k-day block with the helper rate only on the kth day, then repeat; total ${s.answerText}.`]};
  case "findCompletionWhenAgentRestsEveryNthDay":return {title:"10-Second Scheduled Rest Block",steps:[`Include every rest day in elapsed time but assign it zero work; completion ${s.answerText}.`]};
  case "findCompletionWithWeekendOrHolidayPattern":return {title:"10-Second Workweek Calendar",steps:[`Repeat the working-day output while retaining weekend zero-work days in the calendar; elapsed ${s.answerText}.`]};
  case "findCompletionWithUnequalShiftDurations":return {title:"10-Second Rate × Shift Length",steps:[`Multiply each rate by its own shift duration before adding cycle work; exact time ${s.answerText}.`]};
  case "findCompletionWithTwoDaysOnOneDayOffPattern":return {title:"10-Second Two-On One-Off",steps:[`Use a three-day calendar block with two productive days and one zero-work day; total ${s.answerText}.`]};
  case "findCompletionWithPeriodicNegativeWork":return {title:"10-Second Productive Minus Undo Cycle",steps:[`Subtract undone work inside each cycle before repeating it; net completion ${s.answerText}.`]};
  case "findCompletionWithRepeatedJoinLeaveCycle":return {title:"10-Second Solo-Then-Together Cycle",steps:[`Add the solo turn and joined turn as one repeating block, then finish the last partial turn; total ${s.answerText}.`]};
  case "findCycleCountToReachSpecifiedFraction":return {title:"10-Second Target ÷ Cycle Work",steps:[`Divide the exact target fraction by one-cycle work and retain the whole-cycle count; ${s.answerText}.`]};
  case "findTimeFromArbitraryCyclePhase":return {title:"10-Second Offset-Aware Cycle",steps:[`Begin at the stated cycle offset rather than the default first segment, then follow the normal rotation; ${s.answerText}.`]};
  case "findExactBoundaryCompletion":return {title:"10-Second Boundary Cycle Count",steps:[`Because completion falls on a cycle boundary, divide total work by cycle work and multiply by cycle length; ${s.answerText}.`]};
  case "findCompletionWithinCycleSegment":return {title:"10-Second Inside-Segment Finish",steps:[`After full cycles, traverse final segments and divide only the last remainder by its active rate; ${s.answerText}.`]};
  case "findOutputUnderPeriodicMachineSchedule":return {title:"10-Second Repeated Machine Output",steps:[`Add rate × runtime for each machine in one cycle and multiply by repetitions; output ${s.answerText}.`]};
  case "findRequiredCycleRateForDeadline":return {title:"10-Second Deadline Cycle Rate",steps:[`Count the unknown segment's available turns, subtract known work, and divide by its total active time; rate ${s.answerText}.`]};
 }
}

const preferredByType:Record<TmwCp005RegistryEntry["answerType"],TmwCp005MisconceptionId[]>={
 TIME:["FINAL_CYCLE_OMITTED","FULL_FINAL_SEGMENT_ASSUMED","PARTIAL_SEGMENT_IGNORED","CYCLE_LENGTH_CONFUSED"],
 FRACTION:["TARGET_FRACTION_COMPLEMENT","PARTIAL_SEGMENT_IGNORED","CYCLE_WORK_TREATED_AS_DAILY"],
 COUNT:["FULL_CYCLE_ROUNDED_DOWN","FULL_CYCLE_ROUNDED_UP","CYCLE_LENGTH_CONFUSED"],
 AGENT:["WRONG_STARTING_AGENT","TERMINAL_AGENT_OFF_BY_ONE","CYCLE_LENGTH_CONFUSED"],
 RATE:["KNOWN_RATE_REUSED","RECIPROCAL_NOT_TAKEN","CYCLE_WORK_TREATED_AS_DAILY"],
 OUTPUT:["FINAL_CYCLE_OMITTED","FULL_FINAL_SEGMENT_ASSUMED","CYCLE_LENGTH_CONFUSED"],
};

function trapReason(id:Exclude<TmwCp005MisconceptionId,"CORRECT">):string{
 switch(id){
  case "WRONG_STARTING_AGENT":return "uses the opposite starting order from the generated schedule";
  case "FULL_FINAL_SEGMENT_ASSUMED":return "charges a complete final turn although only part of that segment is required";
  case "PARTIAL_SEGMENT_IGNORED":return "stops after complete cycles and omits the final partial segment";
  case "FINAL_CYCLE_OMITTED":return "reports only the repeated full cycles and leaves the completion cycle out";
  case "CYCLE_WORK_TREATED_AS_DAILY":return "treats work from the whole cycle as though it were completed every single day";
  case "CYCLE_LENGTH_CONFUSED":return "confuses the number of cycles with the number of turns or calendar units";
  case "REST_DAY_TREATED_AS_WORK":return "credits productive output on a scheduled zero-work day";
  case "NEGATIVE_RATE_ADDED":return "adds the undo rate although it reduces completed work";
  case "NEGATIVE_RATE_OMITTED":return "ignores work lost during the negative segment";
  case "TERMINAL_AGENT_OFF_BY_ONE":return "moves one turn past or before the segment where completion actually occurs";
  case "RECIPROCAL_NOT_TAKEN":return "reports a rate when the requested quantity is the corresponding solo time";
  case "KNOWN_RATE_REUSED":return "copies a known worker's rate instead of isolating the unknown segment";
  case "TARGET_FRACTION_COMPLEMENT":return "uses the complement of the requested completed or remaining fraction";
  case "FULL_CYCLE_ROUNDED_DOWN":return "rounds down before checking whether the exact target needs another full cycle";
  case "FULL_CYCLE_ROUNDED_UP":return "rounds up despite the target being reached at an earlier cycle boundary";
  case "SHIFT_DURATION_IGNORED":return "adds rates without multiplying by their unequal active durations";
  case "OFFSET_IGNORED":return "starts from the default first segment instead of the stated cycle phase";
  case "DEADLINE_TREATED_AS_CYCLE_COUNT":return "uses the deadline value as a repetition count rather than available elapsed time";
  case "PLAUSIBLE_SCALE_ERROR":return "is numerically close but does not reproduce the generated cycle trace";
 }
}

export function buildTmwCp005CommonTrap(entry:TmwCp005RegistryEntry,options:TmwCp005Option[]):TmwCp005CommonTrap{
 const preferred=preferredByType[entry.answerType];let selectedIndex=-1;
 for(const id of preferred){const index=options.findIndex(option=>option.misconceptionId===id);if(index>=0){selectedIndex=index;break;}}
 if(selectedIndex<0)selectedIndex=options.findIndex(option=>option.misconceptionId!=="CORRECT");
 if(selectedIndex<0)throw new Error("CP-005 option set has no distractor for the common-trap explanation");
 const selected=options[selectedIndex];if(selected.misconceptionId==="CORRECT")throw new Error("CP-005 common trap selected the correct option");
 const optionLabel=`Option ${"ABCD"[selectedIndex]??selectedIndex+1}`;
 return {optionLabel,optionText:selected.text,misconceptionId:selected.misconceptionId,explanation:`${optionLabel} (${selected.text}) ${trapReason(selected.misconceptionId)}; follow the ordered cycle trace above through the exact finishing segment.`};
}
