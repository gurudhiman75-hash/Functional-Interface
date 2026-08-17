import { reciprocal } from "./rational";
import { pick } from "./cp001-helpers";
import type { TmwCp009Parameters, TmwCp009RegistryEntry } from "./cp009-types";
import { abs, boundaryForRate, context, pipe, r, tmwCp009NetRate } from "./cp009-core";
export function buildTmwCp009Parameters(entry:TmwCp009RegistryEntry,seed:string):TmwCp009Parameters{
 const c=context(seed,entry.qlId);
 switch(entry.solveMode){
  case"findFillTimeFromPositiveInlets":{const times=pick([[6,12],[8,24],[10,15,30],[12,18,36]] as const,seed,"positive");return{context:c,pipes:times.map((t,i)=>pipe(`inlet ${String.fromCharCode(65+i)}`,"INLET",t))};}
  case"findFillTimeFromMixedPipes":{const v=pick([
   {ins:[6,8],outs:[24]},{ins:[8,12],outs:[24]},{ins:[10,15],outs:[30]},{ins:[12,18],outs:[36]},
  ] as const,seed,"mixed-fill");return{context:c,pipes:[...v.ins.map((t,i)=>pipe(`inlet ${String.fromCharCode(65+i)}`,"INLET",t)),...v.outs.map((t,i)=>pipe(i===0?"outlet C":`outlet ${String.fromCharCode(67+i)}`,"OUTLET",t))]};}
  case"findEmptyTimeFromMixedPipes":{const v=pick([
   {ins:[12],outs:[8,24]},{ins:[15],outs:[10,30]},{ins:[20],outs:[12,30]},{ins:[18],outs:[12,36]},
  ] as const,seed,"mixed-empty");return{context:c,pipes:[...v.ins.map((t,i)=>pipe(`inlet ${String.fromCharCode(65+i)}`,"INLET",t)),...v.outs.map((t,i)=>pipe(`outlet ${String.fromCharCode(66+i)}`,"OUTLET",t))]};}
  case"findNetFractionChangedInGivenTime":{const v=pick([
   {pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",12)],duration:r(2)},
   {pipes:[pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",8)],duration:r(2)},
   {pipes:[pipe("inlet A","INLET",8),pipe("inlet B","INLET",12),pipe("outlet C","OUTLET",24)],duration:r(3)},
   {pipes:[pipe("inlet A","INLET",20),pipe("outlet B","OUTLET",12)],duration:r(3)},
  ],seed,"fraction");return{context:c,pipes:v.pipes,duration:v.duration};}
  case"findMissingInletTime":{const v=pick([
   {pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",12)],unknown:0},
   {pipes:[pipe("inlet A","INLET",8),pipe("inlet B","INLET",12),pipe("outlet C","OUTLET",24)],unknown:0},
   {pipes:[pipe("inlet A","INLET",10),pipe("outlet B","OUTLET",15)],unknown:0},
   {pipes:[pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",8)],unknown:0},
  ],seed,"missing-inlet"),net=tmwCp009NetRate(v.pipes);return{context:c,pipes:v.pipes,unknownPipeIndex:v.unknown,targetBoundary:boundaryForRate(net),targetCompletionTime:reciprocal(abs(net))};}
  case"findMissingOutletOrLeakTime":{const v=pick([
   {pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",12)],unknown:1},
   {pipes:[pipe("inlet A","INLET",8),pipe("inlet B","INLET",12),pipe("leak C","LEAK",24)],unknown:2},
   {pipes:[pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",8),pipe("leak C","LEAK",24)],unknown:2},
   {pipes:[pipe("inlet A","INLET",15),pipe("outlet B","OUTLET",10),pipe("leak C","LEAK",30)],unknown:2},
  ],seed,"missing-outlet"),net=tmwCp009NetRate(v.pipes);return{context:c,pipes:v.pipes,unknownPipeIndex:v.unknown,targetBoundary:boundaryForRate(net),targetCompletionTime:reciprocal(abs(net))};}
  case"findIdenticalPipeCountForTargetTime":{const v=pick([{solo:12,target:3},{solo:18,target:3},{solo:24,target:4},{solo:30,target:5}],seed,"count");return{context:c,pipes:[],identicalPipeSoloTime:r(v.solo),targetCompletionTime:r(v.target)};}
  case"findTankCapacityFromFlowAndTime":{const v=pick([{flow:300,time:4},{flow:250,time:6},{flow:480,time:5},{flow:600,time:3}],seed,"capacity");return{context:c,pipes:[],physicalFlow:r(v.flow),physicalTime:r(v.time),sourceFlowUnit:"LITRES_PER_HOUR"};}
  case"findFlowRateFromCapacityAndTime":{const v=pick([{capacity:1200,time:4},{capacity:1500,time:6},{capacity:2400,time:5},{capacity:1800,time:3}],seed,"flow");return{context:c,pipes:[],capacity:r(v.capacity),physicalTime:r(v.time),targetFlowUnit:"LITRES_PER_HOUR"};}
  case"findTimeFromCapacityAndNetFlow":{const v=pick([{capacity:1800,flow:450},{capacity:1500,flow:250},{capacity:2400,flow:480},{capacity:1200,flow:300}],seed,"physical-time");return{context:c,pipes:[],capacity:r(v.capacity),physicalFlow:r(v.flow),sourceFlowUnit:"LITRES_PER_HOUR"};}
  case"convertFlowUnits":{const v=pick([
   {flow:25,source:"LITRES_PER_MINUTE" as const,target:"LITRES_PER_HOUR" as const},
   {flow:1800,source:"LITRES_PER_HOUR" as const,target:"LITRES_PER_MINUTE" as const},
   {flow:40,source:"LITRES_PER_MINUTE" as const,target:"LITRES_PER_HOUR" as const},
   {flow:900,source:"LITRES_PER_HOUR" as const,target:"LITRES_PER_MINUTE" as const},
  ],seed,"convert");return{context:c,pipes:[],physicalFlow:r(v.flow),sourceFlowUnit:v.source,targetFlowUnit:v.target};}
  case"findTimeFromInitialLevelToBoundary":{const v=pick([
   {initial:r(1,4),pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",24)]},
   {initial:r(3,4),pipes:[pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",6)]},
   {initial:r(2,5),pipes:[pipe("inlet A","INLET",5),pipe("outlet B","OUTLET",10)]},
   {initial:r(5,6),pipes:[pipe("inlet A","INLET",18),pipe("outlet B","OUTLET",9)]},
  ],seed,"initial-boundary"),net=tmwCp009NetRate(v.pipes);return{context:c,pipes:v.pipes,initialLevel:v.initial,targetBoundary:boundaryForRate(net)};}
  case"findFinalLevelAfterGivenTime":{const v=pick([
   {initial:r(1,4),pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",12)],duration:r(3)},
   {initial:r(3,4),pipes:[pipe("inlet A","INLET",20),pipe("outlet B","OUTLET",10)],duration:r(5)},
   {initial:r(2,5),pipes:[pipe("inlet A","INLET",10),pipe("outlet B","OUTLET",30)],duration:r(3)},
   {initial:r(4,5),pipes:[pipe("inlet A","INLET",15),pipe("outlet B","OUTLET",10)],duration:r(6)},
  ],seed,"final-level");return{context:c,pipes:v.pipes,initialLevel:v.initial,duration:v.duration};}
  case"compareTankCapacities":{const v=pick([
   {fa:300,ta:4,fb:250,tb:6},{fa:450,ta:4,fb:300,tb:4},{fa:240,ta:5,fb:360,tb:5},{fa:500,ta:3,fb:300,tb:4},
  ],seed,"compare");return{context:c,pipes:[],comparison:{flowA:r(v.fa),timeA:r(v.ta),flowB:r(v.fb),timeB:r(v.tb)}};}
  case"findReducedPipeEfficiencyFromChangedTime":{const v=pick([{old:6,changed:8},{old:8,changed:10},{old:10,changed:15},{old:12,changed:16}],seed,"efficiency");return{context:c,pipes:[],originalTime:r(v.old),changedTime:r(v.changed)};}
  case"findBlockagePercentFromChangedTime":{const v=pick([{old:6,changed:8},{old:8,changed:10},{old:10,changed:25},{old:12,changed:16}],seed,"blockage");return{context:c,pipes:[],originalTime:r(v.old),changedTime:r(v.changed)};}
  case"findNetRateDirection":{const v=pick([
   [pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",12)],
   [pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",6)],
   [pipe("inlet A","INLET",8),pipe("outlet B","OUTLET",8)],
   [pipe("inlet A","INLET",8),pipe("inlet B","INLET",24),pipe("outlet C","OUTLET",12)],
  ],seed,"direction");return{context:c,pipes:v};}
  case"findBoundaryEventFeasibility":{const v=pick([
   {initial:r(1,2),pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",24)],window:r(5)},
   {initial:r(1,4),pipes:[pipe("inlet A","INLET",6),pipe("outlet B","OUTLET",12)],window:r(6)},
   {initial:r(3,4),pipes:[pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",6)],window:r(5)},
   {initial:r(2,3),pipes:[pipe("inlet A","INLET",12),pipe("outlet B","OUTLET",4)],window:r(5)},
  ],seed,"feasibility"),net=tmwCp009NetRate(v.pipes);return{context:c,pipes:v.pipes,initialLevel:v.initial,targetBoundary:boundaryForRate(net),decisionWindow:v.window};}
 }
}
