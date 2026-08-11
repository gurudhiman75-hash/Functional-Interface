import { required } from './cp001-helpers';
import { formatRational } from './rational';
import { timeText } from './cp009-core';
import type { TmwCp009Pipe } from './cp009-types';
import type { TmwCp010CycleSegment, TmwCp010Parameters, TmwCp010RegistryEntry, TmwCp010Stage } from './cp010-types';
import { arrangementText, capabilitySentences, levelText, uniquePipes } from './cp010-presentation-helpers';

function target(p:TmwCp010Parameters){return p.targetBoundary==='EMPTY'?'empty':'full';}
function stageCapabilities(p:TmwCp010Parameters){return compactCapabilities(uniquePipes((p.stages??[]).map(stage=>stage.pipes)));}
function cycleCapabilities(p:TmwCp010Parameters){return compactCapabilities(uniquePipes((p.cycle??[]).map(segment=>segment.pipes)));}
function compactPipeFact(pipe:TmwCp009Pipe):string{
  const verb=pipe.kind==='INLET'?'fills':'empties';
  return `${pipe.label} ${verb} it alone in ${timeText(pipe.soloTime)}`;
}
function compactCapabilities(pipes:TmwCp009Pipe[]):string{return `Pipe times: ${pipes.map(compactPipeFact).join('; ')}.`;}
function compactArrangement(pipes:TmwCp009Pipe[]):string{
  if(pipes.length===0)return 'no flow';
  const labels=pipes.map(pipe=>pipe.label).join(' + ');
  return pipes.length===1?labels:`${labels} together`;
}
function compactStages(stages:TmwCp010Stage[]):string{return stages.map((stage,index)=>{
  const lead=index===0?'First':stages.length===2?'Then':index===stages.length-1?'Finally':'Next';
  const duration=stage.duration?` for ${timeText(stage.duration)}`:'';
  return `${lead}, ${compactArrangement(stage.pipes)}${duration}.`;
}).join(' ');}
function compactCycle(cycle:TmwCp010CycleSegment[]):string{return cycle.map((segment,index)=>`${index+1}) ${compactArrangement(segment.pipes)} for ${timeText(segment.duration)}`).join('; ');}
function changedPipe(before:TmwCp010Parameters['stages'],after:TmwCp010Parameters['stages'],mode:'ADDED'|'REMOVED'){const first=before?.[0]?.pipes??[],second=after?.[1]?.pipes??[];const source=mode==='ADDED'?second:first,target=mode==='ADDED'?first:second;return source.find(pipe=>!target.some(other=>other.label===pipe.label&&other.kind===pipe.kind&&other.soloTime.numerator===pipe.soloTime.numerator&&other.soloTime.denominator===pipe.soloTime.denominator));}
function activationPhrase(stages:NonNullable<TmwCp010Parameters['stages']>):string{const pipe=changedPipe(stages,stages,'ADDED');if(!pipe)return 'the second operating arrangement begins';if(pipe.kind==='LEAK')return `${pipe.label} begins to drain water`;return `${pipe.label} is opened`;}
function deactivationPhrase(stages:NonNullable<TmwCp010Parameters['stages']>):string{const pipe=changedPipe(stages,stages,'REMOVED');if(!pipe)return 'the first operating arrangement ends';if(pipe.kind==='LEAK')return `${pipe.label} is repaired`;return `${pipe.label} is closed`;}
function eventPhrase(p:TmwCp010Parameters):string{switch(p.expectedEventKind){case'OPEN':return 'the additional inlet is opened';case'CLOSE':return 'the scheduled inlet is closed';case'REPAIR':return 'the leak is repaired';case'SHIFT':return 'the second arrangement begins';default:return 'the operating arrangement changes';}}

export function renderTmwCp010Stem(entry:TmwCp010RegistryEntry,p:TmwCp010Parameters):string{
 const c=p.context,stages=p.stages??[],cycle=p.cycle??[];
 switch(entry.solveMode){
  case'findCompletionAfterDelayedActivation':return `At ${c.setting}, the ${c.tankLabel} is initially ${levelText(p.initialLevel)}. ${stageCapabilities(p)} For the first ${timeText(required(stages[0].duration,'delay'))}, ${compactArrangement(stages[0].pipes)} operates. ${activationPhrase(stages)}, after which ${compactArrangement(stages[1].pipes)} continues until the tank is ${target(p)}. How long from the start will this take?`;
  case'findCompletionAfterDelayedDeactivation':return `At ${c.setting}, the ${c.tankLabel} is initially ${levelText(p.initialLevel)}. ${stageCapabilities(p)} For the first ${timeText(required(stages[0].duration,'delay'))}, ${compactArrangement(stages[0].pipes)} operates. ${deactivationPhrase(stages)}, after which ${compactArrangement(stages[1].pipes)} continues until the tank is ${target(p)}. How long from the start will this take?`;
  case'findCompletionWithMultipleStaggeredEvents':return `At ${c.setting}, the ${c.tankLabel} is initially empty. ${stageCapabilities(p)} Schedule: ${compactStages(stages)} The final arrangement continues until full. What is the total time?`;
  case'findCompletionWithInterruptedFlow':return `At ${c.setting}, the ${c.tankLabel} is initially empty. ${stageCapabilities(p)} Schedule: ${compactArrangement(stages[0].pipes)} operates for ${timeText(required(stages[0].duration,'first duration'))}; an interruption then stops all flow for ${timeText(required(stages[1].duration,'idle duration'))}. Afterward, ${compactArrangement(stages[2].pipes)} resumes until full. How long from the start?`;
  case'findCompletionFromPartialLevelAndStages':return `At ${c.setting}, the ${c.tankLabel} is initially ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Schedule: ${compactArrangement(stages[0].pipes)} operates for ${timeText(required(stages[0].duration,'duration'))}; then ${compactArrangement(stages[1].pipes)} continues until full. What is the total time from the start?`;
  case'findFinalLevelAfterStagedSchedule':return `At ${c.setting}, the ${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Schedule: ${compactStages(stages)} What fraction of the tank is full at the end?`;
  case'findCompletionAfterThresholdSwitch':return `At ${c.setting}, the ${c.tankLabel} is initially empty. ${stageCapabilities(p)} ${compactArrangement(stages[0].pipes)} operates until the tank reaches ${levelText(required(p.thresholdLevel,'threshold'))}; a level sensor then switches to ${compactArrangement(stages[1].pipes)} until full. How long from the start?`;
  case'findEventTimeFromKnownCompletion':return `At ${c.setting}, the ${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Initially ${compactArrangement(stages[0].pipes)} operates. Later, ${p.expectedEventKind==='OPEN'?activationPhrase(stages):deactivationPhrase(stages)}, leaving ${compactArrangement(stages[1].pipes)} for the rest. The tank is full at ${timeText(required(p.knownCompletionTime,'completion time'))}. After how many hours did the change occur?`;
  case'findRequiredFinalStageRate':return `At ${c.setting}, the initially empty ${c.tankLabel} must be full in ${timeText(required(p.knownCompletionTime,'completion time'))}. ${capabilitySentences(uniquePipes([stages[0].pipes]),c.tankLabel)} Staged schedule: ${compactArrangement(stages[0].pipes)} operates for ${timeText(required(stages[0].duration,'first duration'))}; a final inlet then works alone. What fraction of the tank per hour must that inlet fill?`;
  case'findCapacityFromStagedPhysicalFlows':return `An initially empty ${c.tankLabel} at ${c.setting} follows this physical-flow schedule: ${required(p.physicalStages,'physical stages').map((stage,index)=>`${index+1}) ${formatRational(stage.netFlowLitresPerHour)} litres/hour for ${timeText(stage.duration)}`).join('; ')}. It is exactly full at the end. What is its capacity?`;
  case'findCompletionWithAlternatingPipes':return `At ${c.setting}, the ${c.tankLabel} is initially empty. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. It starts with part 1. How long until the tank is full?`;
  case'findCompletionWithPeriodicSchedule':return `At ${c.setting}, the ${c.tankLabel} is initially empty. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. It repeats without a gap. How long until the tank is full?`;
  case'findAutomaticLevelControlCompletion':{
   const lc=required(p.levelControl,'level control'),pipes=uniquePipes([lc.offPipes,lc.onPipes]);
   return `At ${c.setting}, a controller keeps the ${c.tankLabel} between ${levelText(lc.lower)} and ${levelText(lc.upper)}. ${compactCapabilities(pipes)} Starting at the upper mark, ${compactArrangement(lc.offPipes)} runs down to the lower mark; then ${compactArrangement(lc.onPipes)} runs back to the upper mark. How long to reach the upper mark for the ${lc.targetUpperHits}${lc.targetUpperHits===2?'nd':'rd'} subsequent time?`;
  }
  case'findCompletionFromArbitraryCyclePhase':return `At ${c.setting}, the ${c.tankLabel} is initially ${levelText(p.initialLevel)}. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. The schedule starts at part ${(p.startingCycleIndex??0)+1}, then follows the normal order. How long until full?`;
  case'findFullCycleCountToBoundary':return `At ${c.setting}, the ${c.tankLabel} is initially empty. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. How many complete cycles finish before the tank becomes full during the terminal cycle?`;
  case'findTerminalActiveSegment':return `At ${c.setting}, the ${c.tankLabel} is initially ${levelText(p.initialLevel)}. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. In which segment does the tank first become full?`;
  case'findBoundaryEventTimeUnderSchedule':return `At ${c.setting}, the ${c.tankLabel} is initially ${levelText(p.initialLevel)}. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. At what time from the start does the tank first become ${target(p)}?`;
  case'findScheduleAdjustmentForDeadline':return `At ${c.setting}, the ${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} ${compactArrangement(stages[0].pipes)} operates before the change and ${compactArrangement(stages[1].pipes)} after it. The original change is after ${timeText(required(p.adjustmentBaseDuration,'baseline'))}; to finish by ${timeText(required(p.requiredDeadline,'deadline'))}, it must occur ${p.adjustmentDirection==='EARLIER'?'earlier':'later'}. By how many hours?`;
 }
}
