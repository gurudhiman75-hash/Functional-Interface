import { add, divide, multiply, rational, reciprocal, subtract } from './rational';
import { pick, required, seedNumber } from './cp001-helpers';
import { context, pipe, r, tmwCp009NetRate, ZERO, ONE } from './cp009-core';
import type { Rational } from './types';
import type { TmwCp010CycleSegment, TmwCp010Parameters, TmwCp010PhysicalStage, TmwCp010RegistryEntry, TmwCp010Stage } from './cp010-types';
const R=(n:number,d=1)=>rational(n,d);
function st(label:string,duration:Rational|undefined,pipes:ReturnType<typeof pipe>[],idle=false):TmwCp010Stage{return{label,duration,pipes,idle};}
function seg(label:string,duration:Rational,pipes:ReturnType<typeof pipe>[]):TmwCp010CycleSegment{return{label,duration,pipes};}
function phys(label:string,duration:number,flow:number):TmwCp010PhysicalStage{return{label,duration:R(duration),netFlowLitresPerHour:R(flow)};}
function idx(seed:string,salt:string,n:number){return seedNumber(seed,salt)%n;}
function fullTarget(p:TmwCp010Parameters){p.targetBoundary='FULL';p.targetLevel=ONE;return p;}
function emptyTarget(p:TmwCp010Parameters){p.targetBoundary='EMPTY';p.targetLevel=ZERO;return p;}
export function buildTmwCp010Parameters(entry:TmwCp010RegistryEntry,seed:string):TmwCp010Parameters{
 const c=context(seed,entry.qlId),v=idx(seed,entry.qlId,4),base:TmwCp010Parameters={context:c,initialLevel:ZERO};
 switch(entry.solveMode){
  case'findCompletionAfterDelayedActivation':{
   if(v===0)return fullTarget({...base,stages:[st('Before Inlet B opens',R(3),[pipe('Inlet A','INLET',12)]),st('After Inlet B opens',undefined,[pipe('Inlet A','INLET',12),pipe('Inlet B','INLET',8)])],expectedEventKind:'OPEN'});
   if(v===1)return fullTarget({...base,stages:[st('Before Outlet B opens',R(2),[pipe('Inlet A','INLET',6)]),st('After Outlet B opens',undefined,[pipe('Inlet A','INLET',6),pipe('Outlet B','OUTLET',18)])],expectedEventKind:'OPEN'});
   if(v===2)return fullTarget({...base,stages:[st('Before the leak begins',R(4),[pipe('Inlet A','INLET',10)]),st('After the leak begins',undefined,[pipe('Inlet A','INLET',10),pipe('Leak B','LEAK',30)])],expectedEventKind:'OPEN'});
   return emptyTarget({...base,initialLevel:ONE,stages:[st('Before Inlet B opens',R(2),[pipe('Outlet A','OUTLET',8)]),st('After Inlet B opens',undefined,[pipe('Outlet A','OUTLET',8),pipe('Inlet B','INLET',24)])],expectedEventKind:'OPEN'});
  }
  case'findCompletionAfterDelayedDeactivation':{
   if(v===0)return fullTarget({...base,stages:[st('Before the leak is repaired',R(3),[pipe('Inlet A','INLET',8),pipe('Leak B','LEAK',24)]),st('After the leak is repaired',undefined,[pipe('Inlet A','INLET',8)])],expectedEventKind:'REPAIR'});
   if(v===1)return fullTarget({...base,stages:[st('Before Outlet B closes',R(2),[pipe('Inlet A','INLET',6),pipe('Outlet B','OUTLET',12)]),st('After Outlet B closes',undefined,[pipe('Inlet A','INLET',6)])],expectedEventKind:'CLOSE'});
   if(v===2)return emptyTarget({...base,initialLevel:ONE,stages:[st('Before Inlet A closes',R(2),[pipe('Inlet A','INLET',20),pipe('Outlet B','OUTLET',8)]),st('After Inlet A closes',undefined,[pipe('Outlet B','OUTLET',8)])],expectedEventKind:'CLOSE'});
   return fullTarget({...base,stages:[st('Before the temporary outlet is shut',R(4),[pipe('Inlet A','INLET',9),pipe('Outlet B','OUTLET',18)]),st('After the temporary outlet is shut',undefined,[pipe('Inlet A','INLET',9)])],expectedEventKind:'CLOSE'});
  }
  case'findCompletionWithMultipleStaggeredEvents':{
   const variants:TmwCp010Stage[][]=[
    [st('First interval',R(2),[pipe('Inlet A','INLET',12)]),st('Second interval',R(3),[pipe('Inlet A','INLET',12),pipe('Inlet B','INLET',18)]),st('Final interval',undefined,[pipe('Inlet A','INLET',12),pipe('Inlet B','INLET',18),pipe('Outlet C','OUTLET',36)])],
    [st('First interval',R(3),[pipe('Inlet A','INLET',10),pipe('Outlet C','OUTLET',30)]),st('Second interval',R(2),[pipe('Inlet A','INLET',10),pipe('Inlet B','INLET',15),pipe('Outlet C','OUTLET',30)]),st('Final interval',undefined,[pipe('Inlet A','INLET',10),pipe('Inlet B','INLET',15)])],
    [st('First interval',R(2),[pipe('Inlet A','INLET',8)]),st('Second interval',R(2),[pipe('Inlet A','INLET',8),pipe('Outlet B','OUTLET',24)]),st('Final interval',undefined,[pipe('Inlet A','INLET',8),pipe('Inlet C','INLET',12),pipe('Outlet B','OUTLET',24)])],
    [st('First interval',R(1),[pipe('Inlet A','INLET',6)]),st('Second interval',R(3),[pipe('Inlet A','INLET',6),pipe('Outlet B','OUTLET',18)]),st('Final interval',undefined,[pipe('Inlet A','INLET',6),pipe('Inlet C','INLET',9)])],
   ];return fullTarget({...base,stages:variants[v]});
  }
  case'findCompletionWithInterruptedFlow':{
   const on=v%2===0?8:10,first=v<2?3:4,idle=v%2===0?2:3;
   return fullTarget({...base,stages:[st('Initial pumping interval',R(first),[pipe('Inlet A','INLET',on)]),st('Power-cut interval',R(idle),[],true),st('Pumping resumes',undefined,[pipe('Inlet A','INLET',on)])]});
  }
  case'findCompletionFromPartialLevelAndStages':{
   const initial=[R(1,4),R(1,3),R(2,5),R(1,2)][v];
   const d=[2,3,2,4][v],a=[8,9,10,12][v],b=[16,18,20,24][v];
   return fullTarget({...base,initialLevel:initial,stages:[st('Initial scheduled interval',R(d),[pipe('Inlet A','INLET',a),pipe('Outlet B','OUTLET',b)]),st('Final filling interval',undefined,[pipe('Inlet A','INLET',a)])]});
  }
  case'findFinalLevelAfterStagedSchedule':{
   const initial=[R(1,5),R(1,4),R(1,3),R(2,5)][v];
   const stages=[
    [st('First interval',R(2),[pipe('Inlet A','INLET',10)]),st('Second interval',R(1),[pipe('Outlet B','OUTLET',20)])],
    [st('First interval',R(3),[pipe('Inlet A','INLET',12),pipe('Outlet B','OUTLET',24)]),st('Second interval',R(2),[pipe('Inlet A','INLET',12)])],
    [st('First interval',R(2),[pipe('Outlet A','OUTLET',18)]),st('Second interval',R(3),[pipe('Inlet B','INLET',12)])],
    [st('First interval',R(1),[pipe('Inlet A','INLET',8)]),st('Second interval',R(2),[pipe('Inlet A','INLET',8),pipe('Outlet B','OUTLET',16)])],
   ][v];return{...base,initialLevel:initial,stages};
  }
  case'findCompletionAfterThresholdSwitch':{
   const threshold=[R(1,3),R(2,5),R(1,2),R(3,5)][v];
   const first=[12,10,8,15][v],second=[6,8,10,9][v];
   const d=divide(threshold,reciprocal(R(first)));
   return fullTarget({...base,thresholdLevel:threshold,stages:[st('Before the level sensor switches',d,[pipe('Inlet A','INLET',first)]),st('After the level sensor switches',undefined,[pipe('Inlet B','INLET',second)])]});
  }
  case'findEventTimeFromKnownCompletion':{
   const states=[
    {x:4,T:8,before:[pipe('Inlet A','INLET',12)],after:[pipe('Inlet A','INLET',12),pipe('Inlet B','INLET',12)],event:'OPEN' as const},
    {x:5,T:9,before:[pipe('Inlet A','INLET',15)],after:[pipe('Inlet A','INLET',15),pipe('Inlet B','INLET',10)],event:'OPEN' as const},
    {x:3,T:9,before:[pipe('Inlet A','INLET',12),pipe('Inlet B','INLET',12)],after:[pipe('Inlet A','INLET',12)],event:'CLOSE' as const},
    {x:6,T:12,before:[pipe('Inlet A','INLET',9),pipe('Leak B','LEAK',18)],after:[pipe('Inlet A','INLET',9)],event:'REPAIR' as const},
   ];
   const state=states[v];
   return fullTarget({...base,stages:[st('Before the event',R(state.x),state.before),st('After the event',R(state.T-state.x),state.after)],knownCompletionTime:R(state.T),unknownStageIndex:0,expectedEventKind:state.event});
  }
  case'findRequiredFinalStageRate':{
   const d=[3,4,5,2][v],T=[9,10,12,8][v],r1=[R(1,12),R(1,10),R(1,15),R(1,8)][v];
   const target=ONE,r2=divide(subtract(target,multiply(r1,R(d))),R(T-d));
   const kind=r2.numerator>0?'INLET':'OUTLET';
   return fullTarget({...base,stages:[st('Known first interval',R(d),[pipe('Inlet A','INLET',reciprocal(r1))]),st('Required final interval',R(T-d),[pipe('Final Pipe',kind,reciprocal(r2.numerator<0?multiply(r2,R(-1)):r2))])],knownCompletionTime:R(T),unknownStageIndex:1});
  }
  case'findCapacityFromStagedPhysicalFlows':{
   const variants:TmwCp010PhysicalStage[][]=[
    [phys('Morning inlet',2,600),phys('Simultaneous inlet and outlet',3,400)],
    [phys('Primary pump',3,500),phys('Reduced net flow',2,300)],
    [phys('First shift',4,450),phys('Second shift',2,600)],
    [phys('Initial pumping',2,750),phys('Final pumping',3,500)],
   ];return fullTarget({...base,physicalStages:variants[v],capacityFraction:ONE});
  }
  case'findCompletionWithAlternatingPipes':{
   const cycles=[
    [seg('Inlet A hour',R(1),[pipe('Inlet A','INLET',6)]),seg('Outlet B hour',R(1),[pipe('Outlet B','OUTLET',18)])],
    [seg('Inlet A hour',R(1),[pipe('Inlet A','INLET',8)]),seg('Inlet B hour',R(1),[pipe('Inlet B','INLET',12)])],
    [seg('Inlet A hour',R(1),[pipe('Inlet A','INLET',10)]),seg('Outlet B hour',R(1),[pipe('Outlet B','OUTLET',20)])],
    [seg('Inlet A hour',R(1),[pipe('Inlet A','INLET',5)]),seg('Outlet B hour',R(1),[pipe('Outlet B','OUTLET',15)])],
   ];return fullTarget({...base,cycle:cycles[v],startingCycleIndex:0});
  }
  case'findCompletionWithPeriodicSchedule':{
   const cycles=[
    [seg('Both inlets operate',R(2),[pipe('Inlet A','INLET',12),pipe('Inlet B','INLET',18)]),seg('Only Inlet A operates',R(1),[pipe('Inlet A','INLET',12)]),seg('Outlet operates',R(1),[pipe('Outlet C','OUTLET',36)])],
    [seg('Inlet-only interval',R(2),[pipe('Inlet A','INLET',10)]),seg('Mixed-flow interval',R(1),[pipe('Inlet A','INLET',10),pipe('Outlet B','OUTLET',30)])],
    [seg('Fast inlet shift',R(1),[pipe('Inlet A','INLET',8)]),seg('Slow inlet shift',R(2),[pipe('Inlet B','INLET',16)]),seg('Drainage check',R(1),[pipe('Outlet C','OUTLET',32)])],
    [seg('Dual-pump interval',R(1),[pipe('Inlet A','INLET',9),pipe('Inlet B','INLET',18)]),seg('Single-pump interval',R(2),[pipe('Inlet A','INLET',9)])],
   ];return fullTarget({...base,cycle:cycles[v],startingCycleIndex:0});
  }
  case'findAutomaticLevelControlCompletion':{
   const lower=[R(1,4),R(1,3),R(2,5),R(1,2)][v],upper=[R(3,4),R(4,5),R(5,6),R(7,8)][v],hits=[2,3,2,3][v];
   return{...base,initialLevel:upper,targetLevel:upper,levelControl:{lower,upper,offPipes:[pipe('Outlet A','OUTLET',[8,9,10,12][v])],onPipes:[pipe('Inlet B','INLET',[4,5,6,6][v]),pipe('Outlet A','OUTLET',[8,9,10,12][v])],targetUpperHits:hits}};
  }
  case'findCompletionFromArbitraryCyclePhase':{
   const cycle=[seg('Inlet A shift',R(1),[pipe('Inlet A','INLET',8)]),seg('Outlet B shift',R(1),[pipe('Outlet B','OUTLET',24)]),seg('Inlet C shift',R(1),[pipe('Inlet C','INLET',12)])];
   return fullTarget({...base,initialLevel:[R(1,4),R(1,3),R(2,5),R(1,5)][v],cycle,startingCycleIndex:[1,2,1,2][v]});
  }
  case'findFullCycleCountToBoundary':{
   const cycle=[seg('Inlet interval',R(1),[pipe('Inlet A','INLET',[3,4,5,6][v])]),seg('Outlet interval',R(1),[pipe('Outlet B','OUTLET',[6,8,10,12][v])])];
   return fullTarget({...base,cycle,startingCycleIndex:0});
  }
  case'findTerminalActiveSegment':{
   const cycle=[seg('Inlet A interval',R(1),[pipe('Inlet A','INLET',[6,8,10,12][v])]),seg('Outlet B interval',R(1),[pipe('Outlet B','OUTLET',[18,24,30,36][v])]),seg('Inlet C interval',R(1),[pipe('Inlet C','INLET',[9,12,15,18][v])])];
   return fullTarget({...base,initialLevel:[ZERO,R(1,6),R(1,5),R(1,4)][v],cycle,startingCycleIndex:0});
  }
  case'findBoundaryEventTimeUnderSchedule':{
   if(v%2===0){const cycle=[seg('Pump-on interval',R(2),[pipe('Inlet A','INLET',8)]),seg('Drain interval',R(1),[pipe('Outlet B','OUTLET',24)])];return fullTarget({...base,initialLevel:v===0?R(1,5):R(1,3),cycle,startingCycleIndex:0});}
   const cycle=[seg('Drainage interval',R(2),[pipe('Outlet A','OUTLET',8)]),seg('Recovery inlet interval',R(1),[pipe('Inlet B','INLET',24)])];return emptyTarget({...base,initialLevel:v===1?R(4,5):R(3,4),cycle,startingCycleIndex:0});
  }
  case'findScheduleAdjustmentForDeadline':{
   const states=[
    {baseline:8,T:10,required:6,before:[pipe('Inlet A','INLET',12)],after:[pipe('Inlet B','INLET',8)],direction:'EARLIER' as const},
    {baseline:8,T:12,required:6,before:[pipe('Inlet A','INLET',15)],after:[pipe('Inlet B','INLET',10)],direction:'EARLIER' as const},
    {baseline:9,T:14,required:6,before:[pipe('Inlet A','INLET',18)],after:[pipe('Inlet B','INLET',12)],direction:'EARLIER' as const},
    {baseline:7,T:15,required:10,before:[pipe('Inlet A','INLET',20)],after:[pipe('Inlet B','INLET',10)],direction:'LATER' as const},
   ];
   const state=states[v];
   return fullTarget({...base,stages:[st('Before the schedule change',R(state.required),state.before),st('After the schedule change',R(state.T-state.required),state.after)],knownCompletionTime:R(state.T),unknownStageIndex:0,requiredDeadline:R(state.T),adjustmentBaseDuration:R(state.baseline),adjustmentDirection:state.direction,expectedEventKind:'SHIFT'});
  }
 }
}
