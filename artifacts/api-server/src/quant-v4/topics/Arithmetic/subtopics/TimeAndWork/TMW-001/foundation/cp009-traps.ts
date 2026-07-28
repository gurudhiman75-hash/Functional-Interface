import type { TmwCp009CommonTrap, TmwCp009Option, TmwCp009Parameters, TmwCp009RegistryEntry } from "./cp009-types";
function optionLetter(index:number):string{return "ABCD"[index]??String(index+1);}
function trapReason(id:TmwCp009Option["misconceptionId"]):string{switch(id){
 case"OTHER_PIPES_IGNORED":return "results from using one pipe's solo time and ignoring the contribution of the other open pipes.";
 case"PIPE_TIMES_ADDED":return "results from adding or averaging pipe completion times instead of adding their rates.";
 case"OUTFLOW_ADDED_AS_INFLOW":return "results from adding all pipe-rate magnitudes instead of applying positive signs to inlets and negative signs to outlets or leaks.";
 case"INFLOW_SUBTRACTED_FROM_OUTFLOW_WRONGLY":return "results from reversing the signed-rate subtraction.";
 case"TIME_USED_AS_RATE":return "results from using completion times directly as rates or reporting a given time as the answer.";
 case"DURATION_IGNORED":return "results from stopping at the hourly rate and not applying the stated operating duration.";
 case"INITIAL_LEVEL_IGNORED":return "results from treating a partially filled tank as completely empty or completely full.";
 case"REMAINING_LEVEL_IGNORED":return "results from using the current level instead of the level change still required to reach the target.";
 case"KNOWN_PIPE_SIGN_IGNORED":return "results from omitting a known pipe or assigning it the wrong sign in the combined-rate equation.";
 case"COUNT_RATIO_REVERSED":return "results from reversing the inverse relation between identical-pipe count and completion time.";
 case"CAPACITY_REPORTED_AS_FLOW":return "reports the tank capacity as though it were an hourly flow rate, without dividing by the filling time.";
 case"CAPACITY_FLOW_TIME_REVERSED":return "results from using the volume–flow–time relation in the wrong direction.";
 case"FLOW_UNIT_NOT_CONVERTED":return "results from leaving the rate in the original minute/hour unit or applying the factor 60 backwards.";
 case"RATIO_ORDER_REVERSED":return "contains the correct comparison in the reverse order from the one asked.";
 case"TIME_EFFICIENCY_INVERSION_MISSED":return "results from treating filling time and pipe efficiency as directly proportional.";
 case"BLOCKAGE_REPORTED_AS_REMAINING_EFFICIENCY":return "reports the efficiency still available rather than the percentage efficiency lost to blockage.";
 case"DIRECTION_FROM_PIPE_COUNT":return "results from counting pipes or assuming opposing pipes cancel without comparing their signed rates.";
 case"BOUNDARY_TIME_NOT_CHECKED":return "states an outcome without comparing the exact boundary time with the available time window.";
 case"PLAUSIBLE_SCALE_ERROR":return "is a nearby value but does not satisfy the signed-flow equation and target condition.";
 case"CORRECT":return "";
 }}
export function tmwCp009CommonTrap(options:TmwCp009Option[],correctIndex:number):TmwCp009CommonTrap{const chosen=options.map((option,index)=>({option,index})).find(({option,index})=>index!==correctIndex&&option.misconceptionId!=="PLAUSIBLE_SCALE_ERROR")??options.map((option,index)=>({option,index})).find(({index})=>index!==correctIndex);if(!chosen||chosen.option.misconceptionId==="CORRECT")throw new Error("No CP-009 distractor available for trap analysis");const label=`Option ${optionLetter(chosen.index)}`;return{optionLabel:label,optionText:chosen.option.text,misconceptionId:chosen.option.misconceptionId,explanation:`${label} (${chosen.option.text}) ${trapReason(chosen.option.misconceptionId)}`};}
export function tmwCp009Conclusion(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,answer:string):string{switch(entry.answerType){case"DIRECTION":return`Therefore, ${answer.toLowerCase()}.`;case"DECISION":return`Therefore, ${answer}.`;case"RATIO":return`Therefore, the required ratio is ${answer}.`;case"CAPACITY":return`Therefore, the tank capacity is ${answer}.`;case"FLOW_RATE":return`Therefore, the required flow rate is ${answer}.`;case"LEVEL":return`Therefore, the final water level is ${answer}.`;case"FRACTION":return`Therefore, ${answer} during the stated interval.`;case"COUNT":return`Therefore, ${answer} are required.`;case"PERCENT":return`Therefore, the effective flow rate is reduced by ${answer}.`;case"TIME":return`Therefore, the required time is ${answer}.`;}}
