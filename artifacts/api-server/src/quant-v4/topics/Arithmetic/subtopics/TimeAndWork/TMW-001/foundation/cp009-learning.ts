import { compare, formatRational, rational, subtract, toLatex } from "./rational";
import { required } from "./cp001-helpers";
import { tmwCp009NetRate } from "./cp009-engine";
import type { Rational } from "./types";
import type { TmwCp009LearningShortcut, TmwCp009Parameters, TmwCp009RegistryEntry, TmwCp009Solution } from "./cp009-types";
import { ONE, ZERO, boundaryWord, directionWord, flowUnit, hours, inline, num, pipeList, quantity, targetPipe } from "./cp009-presentation-helpers";
export function tmwCp009Opening(entry:TmwCp009RegistryEntry):string{switch(entry.ruleId){
 case"TMW_POSITIVE_FLOW":return "Convert each filling time into a per-hour filling rate and add the rates. Pipe times themselves must never be added.";
 case"TMW_SIGNED_FLOW":return "Treat every inlet as positive and every outlet or leak as negative. Decide whether the target is filling or emptying before taking the reciprocal of the net rate.";
 case"TMW_COMPONENT_EXTRACTION":return "Write the signed combined-rate equation first, then isolate the missing inlet, outlet or leak rate. Convert the recovered rate back into its solo time only at the end.";
 case"TMW_PIPE_COUNT":return "For identical inlet pipes, total rate is the number of pipes multiplied by one pipe's rate. Completion time is inversely proportional to the pipe count.";
 case"TMW_PHYSICAL_FLOW":return "For physical flow, tank volume, net flow and time satisfy volume = flow × time. Convert minutes and hours before using the relation.";
 case"TMW_INITIAL_LEVEL":return "Start from the stated tank level. Use only the level change still required to reach full or empty, or add the signed change to find the final level.";
 case"TMW_CAPACITY_COMPARISON":return "Each tank's capacity equals its filling flow multiplied by its filling time. Compare the two products in the order asked.";
 case"TMW_FLOW_EFFICIENCY":return "For the same tank, flow efficiency is inversely proportional to filling time. A longer filling time means a lower effective flow rate.";
 case"TMW_DIRECTION_FEASIBILITY":return "The sign of the net rate determines whether the level rises, falls or stays unchanged. For a time-window question, calculate the boundary time and compare it with the available duration.";
 }}
export function tmwCp009Givens(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters):string[]{const net=tmwCp009NetRate(p.pipes);switch(entry.solveMode){
 case"findFillTimeFromPositiveInlets":case"findFillTimeFromMixedPipes":case"findEmptyTimeFromMixedPipes":return[p.pipes.map(pipe=>`${pipe.label}: ${hours(pipe.soloTime)} alone`).join("; "),`Target: time to make the tank ${entry.solveMode==="findEmptyTimeFromMixedPipes"?"empty":"full"}.`];
 case"findNetFractionChangedInGivenTime":return[`Operating duration: ${hours(required(p.duration,"duration"))}.`,`Net direction: ${directionWord(net)}; target is the fraction ${compare(net,ZERO)>0?"filled":"emptied"}.`];
 case"findMissingInletTime":case"findMissingOutletOrLeakTime":return[`Known combined result: tank becomes ${boundaryWord(required(p.targetBoundary,"targetBoundary"))} in ${hours(required(p.targetCompletionTime,"targetCompletionTime"))}.`,`Unknown: solo time of ${targetPipe(p).label}.`];
 case"findIdenticalPipeCountForTargetTime":return[`One-pipe time: ${hours(required(p.identicalPipeSoloTime,"identicalPipeSoloTime"))}.`,`Required group time: ${hours(required(p.targetCompletionTime,"targetCompletionTime"))}.`];
 case"findTankCapacityFromFlowAndTime":return[`Flow: ${num(required(p.physicalFlow,"physicalFlow"))} litres per hour.`,`Filling time: ${hours(required(p.physicalTime,"physicalTime"))}.`];
 case"findFlowRateFromCapacityAndTime":return[`Capacity: ${num(required(p.capacity,"capacity"))} litres.`,`Filling time: ${hours(required(p.physicalTime,"physicalTime"))}.`];
 case"findTimeFromCapacityAndNetFlow":return[`Capacity: ${num(required(p.capacity,"capacity"))} litres.`,`Net inflow: ${num(required(p.physicalFlow,"physicalFlow"))} litres per hour.`];
 case"convertFlowUnits":return[`Given flow: ${num(required(p.physicalFlow,"physicalFlow"))} ${flowUnit(required(p.sourceFlowUnit,"sourceFlowUnit"))}.`,`Required unit: ${flowUnit(required(p.targetFlowUnit,"targetFlowUnit"))}.`];
 case"findTimeFromInitialLevelToBoundary":return[`Initial level: ${num(required(p.initialLevel,"initialLevel"))} full.`,`Target level: ${boundaryWord(required(p.targetBoundary,"targetBoundary"))}.`];
 case"findFinalLevelAfterGivenTime":return[`Initial level: ${num(required(p.initialLevel,"initialLevel"))} full.`,`Operating time: ${hours(required(p.duration,"duration"))}.`];
 case"compareTankCapacities":return[`Tank A and Tank B both start empty and finish full.`,`Required order: Tank A capacity : Tank B capacity.`];
 case"findReducedPipeEfficiencyFromChangedTime":case"findBlockagePercentFromChangedTime":return[`Original filling time: ${hours(required(p.originalTime,"originalTime"))}.`,`Changed filling time: ${hours(required(p.changedTime,"changedTime"))}.`];
 case"findNetRateDirection":return[p.pipes.map(pipe=>`${pipe.label}: ${pipe.kind.toLowerCase()}, ${hours(pipe.soloTime)} alone`).join("; "),"Target: direction of level change when all pipes operate." ];
 case"findBoundaryEventFeasibility":return[`Initial level: ${num(required(p.initialLevel,"initialLevel"))} full; available time: ${hours(required(p.decisionWindow,"decisionWindow"))}.`,`Boundary being tested: ${boundaryWord(required(p.targetBoundary,"targetBoundary"))}.`];
 }}
export function tmwCp009Shortcut(entry:TmwCp009RegistryEntry,p:TmwCp009Parameters,s:TmwCp009Solution):TmwCp009LearningShortcut{switch(entry.solveMode){
 case"findFillTimeFromPositiveInlets":return{title:"10-Second LCM Rate Method",steps:["Take an LCM of the individual filling times and treat it as tank units.","Add the units filled per hour, then divide total units by the combined hourly units."]};
 case"findFillTimeFromMixedPipes":case"findEmptyTimeFromMixedPipes":return{title:"10-Second Signed-Rate Check",steps:["Write +1/T for each inlet and −1/T for each outlet or leak.","Use the sign to confirm fill or empty, then take the reciprocal of the magnitude."]};
 case"findNetFractionChangedInGivenTime":return{title:"10-Second Rate × Time",steps:["Find the signed net fraction per hour.","Multiply its magnitude by the stated duration; do not take a reciprocal because the target is work changed, not completion time."]};
 case"findMissingInletTime":case"findMissingOutletOrLeakTime":return{title:"10-Second Rate Gap",steps:["Convert the stated combined result into a signed net rate.","Subtract the known signed rates; the reciprocal of the missing rate's magnitude is its solo time."]};
 case"findIdenticalPipeCountForTargetTime":return{title:"10-Second Inverse Count",steps:["For identical pipes, count and time are inversely proportional.",`Use one-pipe time ÷ target time to obtain ${s.answerText}.`]};
 case"findTankCapacityFromFlowAndTime":case"findFlowRateFromCapacityAndTime":case"findTimeFromCapacityAndNetFlow":return{title:"10-Second V–q–t Triangle",steps:["Place volume above flow × time.","Cover the required quantity and use the remaining multiplication or division directly."]};
 case"convertFlowUnits":return{title:"10-Second Sixty Rule",steps:["Minutes to hours: multiply by 60.","Hours to minutes: divide by 60."]};
 case"findTimeFromInitialLevelToBoundary":return{title:"10-Second Remaining-Level Method",steps:["For filling, use 1 − initial level; for emptying, use the initial level itself.","Divide that required change by the magnitude of the signed net rate."]};
 case"findFinalLevelAfterGivenTime":return{title:"10-Second Signed Level Update",steps:["Calculate net rate × time with its sign.","Add the signed change to the initial level."]};
 case"compareTankCapacities":return{title:"10-Second Product Ratio",steps:["Write flow × time for each tank.","Cancel common factors before multiplying, keeping Tank A first."]};
 case"findReducedPipeEfficiencyFromChangedTime":return{title:"10-Second Reverse-Time Ratio",steps:["For the same tank, efficiency ratio is the reverse of time ratio.","Write old time : new time for new efficiency : old efficiency."]};
 case"findBlockagePercentFromChangedTime":return{title:"10-Second Remaining-Efficiency Method",steps:["Remaining efficiency = old time ÷ new time.","Blockage percentage = 100% − remaining-efficiency percentage."]};
 case"findNetRateDirection":return{title:"10-Second Sign Test",steps:["Add inlet rates and outlet/leak rates separately.","Positive net means fill, negative means empty, and zero means no change."]};
 case"findBoundaryEventFeasibility":return{title:"10-Second Boundary Comparison",steps:["Find the exact time needed to reach full or empty from the current level.","Compare that time with the stated operating window before answering yes or no."]};
 }}
