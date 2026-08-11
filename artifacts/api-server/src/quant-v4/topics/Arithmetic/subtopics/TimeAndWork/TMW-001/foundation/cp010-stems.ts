import { required } from './cp001-helpers';
import { formatRational } from './rational';
import { timeText } from './cp009-core';
import type { TmwCp009Pipe } from './cp009-types';
import type { TmwCp010CycleSegment, TmwCp010Parameters, TmwCp010RegistryEntry, TmwCp010Stage } from './cp010-types';
import { capabilitySentences, levelText, uniquePipes } from './cp010-presentation-helpers';

function target(p:TmwCp010Parameters){return p.targetBoundary==='EMPTY'?'empty':'full';}
function stageCapabilities(p:TmwCp010Parameters){return compactCapabilities(uniquePipes((p.stages??[]).map(stage=>stage.pipes)));}
function cycleCapabilities(p:TmwCp010Parameters){return compactCapabilities(uniquePipes((p.cycle??[]).map(segment=>segment.pipes)));}
function compactPipeFact(pipe:TmwCp009Pipe):string{
  const verb=pipe.kind==='INLET'?'fills':'empties';
  return `${pipe.label} ${verb} in ${timeText(pipe.soloTime)}`;
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
function changedPipe(stages:TmwCp010Parameters['stages'],mode:'ADDED'|'REMOVED'){
  const first=stages?.[0]?.pipes??[],second=stages?.[1]?.pipes??[];
  const source=mode==='ADDED'?second:first,targetPipes=mode==='ADDED'?first:second;
  return source.find(pipe=>!targetPipes.some(other=>other.label===pipe.label&&other.kind===pipe.kind&&other.soloTime.numerator===pipe.soloTime.numerator&&other.soloTime.denominator===pipe.soloTime.denominator));
}
function activationPhrase(stages:NonNullable<TmwCp010Parameters['stages']>):string{const pipe=changedPipe(stages,'ADDED');if(!pipe)return 'the second arrangement begins';if(pipe.kind==='LEAK')return `${pipe.label} begins draining`;return `${pipe.label} opens`;}
function deactivationPhrase(stages:NonNullable<TmwCp010Parameters['stages']>):string{const pipe=changedPipe(stages,'REMOVED');if(!pipe)return 'the first arrangement ends';if(pipe.kind==='LEAK')return `${pipe.label} is repaired`;return `${pipe.label} closes`;}

export function renderTmwCp010Stem(entry:TmwCp010RegistryEntry,p:TmwCp010Parameters):string{
 const c=p.context,stages=p.stages??[],cycle=p.cycle??[];
 switch(entry.solveMode){
  case'findCompletionAfterDelayedActivation':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Staged schedule: for ${timeText(required(stages[0].duration,'delay'))}, ${compactArrangement(stages[0].pipes)} operates. Then ${activationPhrase(stages)}, and ${compactArrangement(stages[1].pipes)} continues until the tank is ${target(p)}. How long from the start?`;
  case'findCompletionAfterDelayedDeactivation':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Staged schedule: for ${timeText(required(stages[0].duration,'delay'))}, ${compactArrangement(stages[0].pipes)} operates. Then ${deactivationPhrase(stages)}, and ${compactArrangement(stages[1].pipes)} continues until the tank is ${target(p)}. How long from the start?`;
  case'findCompletionWithMultipleStaggeredEvents':return `${c.tankLabel} starts empty. ${stageCapabilities(p)} Schedule: ${compactStages(stages)} Continue the final arrangement until the tank is full. How long in total?`;
  case'findCompletionWithInterruptedFlow':return `${c.tankLabel} starts empty. ${stageCapabilities(p)} Schedule: ${compactArrangement(stages[0].pipes)} for ${timeText(required(stages[0].duration,'first duration'))}; an interruption stops all flow for ${timeText(required(stages[1].duration,'idle duration'))}; then ${compactArrangement(stages[2].pipes)} resumes until the tank is full. How long in total?`;
  case'findCompletionFromPartialLevelAndStages':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Schedule: ${compactArrangement(stages[0].pipes)} for ${timeText(required(stages[0].duration,'duration'))}; then ${compactArrangement(stages[1].pipes)} until the tank is full. How long in total?`;
  case'findFinalLevelAfterStagedSchedule':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Schedule: ${compactStages(stages)} What fraction of the tank is full at the end?`;
  case'findCompletionAfterThresholdSwitch':return `${c.tankLabel} starts empty. ${stageCapabilities(p)} ${compactArrangement(stages[0].pipes)} operates until level ${levelText(required(p.thresholdLevel,'threshold'))}; a level sensor then switches to ${compactArrangement(stages[1].pipes)} until the tank is full. How long in total?`;
  case'findEventTimeFromKnownCompletion':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Staged schedule: initially ${compactArrangement(stages[0].pipes)} operates. Later, ${p.expectedEventKind==='OPEN'?activationPhrase(stages):deactivationPhrase(stages)}, leaving ${compactArrangement(stages[1].pipes)}. The tank is full at ${timeText(required(p.knownCompletionTime,'completion time'))}. At what time did the change occur?`;
  case'findRequiredFinalStageRate':return `${c.tankLabel} starts empty and must be full in ${timeText(required(p.knownCompletionTime,'completion time'))}. ${capabilitySentences(uniquePipes([stages[0].pipes]),c.tankLabel)} Staged schedule: ${compactArrangement(stages[0].pipes)} for ${timeText(required(stages[0].duration,'first duration'))}; then a final inlet works alone. What fraction of the tank per hour must it fill?`;
  case'findCapacityFromStagedPhysicalFlows':return `${c.tankLabel} starts empty and follows this physical-flow schedule: ${required(p.physicalStages,'physical stages').map((stage,index)=>`${index+1}) ${formatRational(stage.netFlowLitresPerHour)} litres/hour for ${timeText(stage.duration)}`).join('; ')}. The tank is exactly full at the end. What is its capacity?`;
  case'findCompletionWithAlternatingPipes':return `${c.tankLabel} starts empty. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. Start with part 1. How long until the tank is full?`;
  case'findCompletionWithPeriodicSchedule':return `${c.tankLabel} starts empty. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. It repeats without a gap. How long until the tank is full?`;
  case'findAutomaticLevelControlCompletion':{
   const lc=required(p.levelControl,'level control'),pipes=uniquePipes([lc.offPipes,lc.onPipes]);
   return `A controller keeps ${c.tankLabel} between ${levelText(lc.lower)} and ${levelText(lc.upper)}. ${compactCapabilities(pipes)} Starting at the upper mark, ${compactArrangement(lc.offPipes)} runs to the lower mark; then ${compactArrangement(lc.onPipes)} returns it to the upper mark. How long to reach the upper mark for the ${lc.targetUpperHits}${lc.targetUpperHits===2?'nd':'rd'} subsequent time?`;
  }
  case'findCompletionFromArbitraryCyclePhase':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. Start at part ${(p.startingCycleIndex??0)+1}, then follow normal order. How long until the tank is full?`;
  case'findFullCycleCountToBoundary':return `${c.tankLabel} starts empty. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. How many complete cycles finish before the tank becomes full during the terminal cycle?`;
  case'findTerminalActiveSegment':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. In which segment does the tank first become full?`;
  case'findBoundaryEventTimeUnderSchedule':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${cycleCapabilities(p)} Repeating cycle: ${compactCycle(cycle)}. At what time does the tank first become ${target(p)}?`;
  case'findScheduleAdjustmentForDeadline':return `${c.tankLabel} starts ${levelText(p.initialLevel)}. ${stageCapabilities(p)} Schedule: ${compactArrangement(stages[0].pipes)} operates before the change; ${compactArrangement(stages[1].pipes)} after it. The change was planned after ${timeText(required(p.adjustmentBaseDuration,'baseline'))}. To finish by ${timeText(required(p.requiredDeadline,'deadline'))}, it must occur ${p.adjustmentDirection==='EARLIER'?'earlier':'later'}. By how many hours?`;
 }
}
