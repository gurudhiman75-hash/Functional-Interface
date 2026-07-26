import { add, divide, multiply, rational, reciprocal, subtract } from "./rational";
import { pick } from "./cp001-helpers";
import type { Rational } from "./types";
import type { TmwCp004Context, TmwCp004Parameters, TmwCp004RegistryEntry } from "./cp004-types";

const contexts:readonly TmwCp004Context[] = [
 {jobPhrase:"a customer-record batch",actorA:"Operator A",actorB:"Operator B",actorC:"Operator C"},
 {jobPhrase:"an equipment overhaul",actorA:"Technician A",actorB:"Technician B",actorC:"Technician C"},
 {jobPhrase:"a loan-application set",actorA:"Clerk A",actorB:"Clerk B",actorC:"Clerk C"},
 {jobPhrase:"a printing order",actorA:"Machine A",actorB:"Machine B",actorC:"Machine C"},
 {jobPhrase:"a road-marking project",actorA:"Crew A",actorB:"Crew B",actorC:"Crew C"},
 {jobPhrase:"a packaging order",actorA:"Team A",actorB:"Team B",actorC:"Team C"},
 {jobPhrase:"a quality-inspection batch",actorA:"Inspector A",actorB:"Inspector B",actorC:"Inspector C"},
 {jobPhrase:"a manuscript-typing job",actorA:"Typist A",actorB:"Typist B",actorC:"Typist C"},
 {jobPhrase:"a school-building paint job",actorA:"Painter A",actorB:"Painter B",actorC:"Painter C"},
 {jobPhrase:"a warehouse inventory count",actorA:"Recorder A",actorB:"Recorder B",actorC:"Recorder C"},
 {jobPhrase:"a field survey",actorA:"Surveyor A",actorB:"Surveyor B",actorC:"Surveyor C"},
 {jobPhrase:"an electronics-assembly order",actorA:"Assembler A",actorB:"Assembler B",actorC:"Assembler C"},
];

function base(seed:string):TmwCp004Parameters{return {totalWork:rational(1),timeUnit:"day",context:pick(contexts,seed,"cp004-context")};}
function rateFromTime(time:number):Rational{return rational(1,time);}
function sum(values:Rational[]):Rational{return values.reduce((a,b)=>add(a,b),rational(0));}
function totalFromStages(stages:Array<{duration:Rational;rate:Rational}>):Rational{return stages.reduce((w,s)=>add(w,multiply(s.duration,s.rate)),rational(0));}

export function buildTmwCp004Parameters(entry:TmwCp004RegistryEntry,seed:string):TmwCp004Parameters{
 const b=base(seed);
 switch(entry.solveMode){
  case "findRemainingWorkAfterInitialPhase":{
   const s=pick([{a:12,d:4},{a:15,d:6},{a:18,d:5},{a:20,d:8}],seed,"cp004-remain");
   return {...b,timeA:rational(s.a),rateA:rateFromTime(s.a),durationA:rational(s.d)};
  }
  case "findWorkCompletedBeforeEvent":{
   const s=pick([{a:12,b:18,d:4},{a:10,b:15,d:3},{a:16,b:24,d:4},{a:18,b:36,d:6}],seed,"cp004-done");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d)};
  }
  case "findTotalTimeWhenFirstAgentStartsThenSecondFinishes":{
   const s=pick([{a:12,b:18,d:4},{a:15,b:20,d:5},{a:10,b:16,d:3},{a:18,b:24,d:6}],seed,"cp004-handoff");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d)};
  }
  case "findTotalTimeWhenTeamStartsThenOneLeaves":{
   const s=pick([{a:12,b:18,d:3},{a:10,b:15,d:2},{a:16,b:24,d:4},{a:18,b:36,d:5}],seed,"cp004-leave-total");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d)};
  }
  case "findTotalTimeWhenOneStartsThenAnotherJoins":{
   const s=pick([{a:12,b:18,d:4},{a:10,b:15,d:3},{a:16,b:24,d:5},{a:18,b:36,d:6}],seed,"cp004-join-total");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d)};
  }
  case "findTotalTimeWithStaggeredJoins":{
   const s=pick([
    {a:12,b:18,c:36,d1:2,d2:2},{a:10,b:15,c:30,d1:2,d2:1},{a:16,b:24,c:48,d1:3,d2:2},{a:18,b:27,c:54,d1:3,d2:2}
   ],seed,"cp004-stagger-join");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),timeC:rational(s.c),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),rateC:rateFromTime(s.c),durationA:rational(s.d1),durationB:rational(s.d2)};
  }
  case "findTotalTimeWithStaggeredExits":{
   const s=pick([
    {a:12,b:18,c:36,d1:2,d2:2},{a:10,b:15,c:30,d1:1,d2:2},{a:16,b:24,c:48,d1:2,d2:3},{a:18,b:27,c:54,d1:2,d2:3}
   ],seed,"cp004-stagger-exit");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),timeC:rational(s.c),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),rateC:rateFromTime(s.c),durationA:rational(s.d1),durationB:rational(s.d2)};
  }
  case "findTotalTimeWithJoinAndLeaveEvents":{
   const s=pick([{a:12,b:18,d1:3,d2:3},{a:10,b:15,d1:2,d2:2},{a:16,b:24,d1:4,d2:3},{a:18,b:30,d1:4,d2:4}],seed,"cp004-join-leave");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d1),durationB:rational(s.d2)};
  }
  case "findJoinTimeFromFinalCompletion":{
   const s=pick([{a:12,b:18,x:4},{a:10,b:15,x:3},{a:16,b:24,x:5},{a:18,b:30,x:6}],seed,"cp004-find-join");
   const rA=rateFromTime(s.a),rB=rateFromTime(s.b),x=rational(s.x);
   const remaining=subtract(rational(1),multiply(x,rA));
   const total=add(x,divide(remaining,add(rA,rB)));
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rA,rateB:rB,durationA:x,totalCompletionTime:total};
  }
  case "findLeaveTimeFromFinalCompletion":{
   const s=pick([{a:12,b:18,x:3},{a:10,b:15,x:2},{a:16,b:24,x:4},{a:18,b:30,x:5}],seed,"cp004-find-leave");
   const rA=rateFromTime(s.a),rB=rateFromTime(s.b),x=rational(s.x);
   const done=multiply(x,add(rA,rB));
   const total=add(x,divide(subtract(rational(1),done),rB));
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rA,rateB:rB,durationA:x,totalCompletionTime:total};
  }
  case "findUnknownInitialPhaseDuration":{
   const s=pick([{a:12,b:18,x:4,y:9},{a:10,b:15,x:3,y:8},{a:16,b:24,x:6,y:9},{a:18,b:30,x:5,y:10}],seed,"cp004-unknown-initial");
   const rA=rateFromTime(s.a),rB=rateFromTime(s.b);
   const work=add(multiply(rational(s.x),rA),multiply(rational(s.y),rB));
   const scale=reciprocal(work);
   return {...b,totalWork:rational(1),rateA:multiply(rA,scale),rateB:multiply(rB,scale),durationA:rational(s.x),durationB:rational(s.y)};
  }
  case "findUnknownFinalPhaseDuration":{
   const s=pick([{a:12,b:18,x:4},{a:10,b:15,x:3},{a:16,b:24,x:5},{a:18,b:30,x:6}],seed,"cp004-unknown-final");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.x)};
  }
  case "findReplacementWorkerRate":
  case "findReplacementWorkerTime":{
   const s=pick([{a:12,d:4,y:8},{a:15,d:5,y:10},{a:18,d:6,y:8},{a:20,d:8,y:9}],seed,"cp004-replacement");
   const rA=rateFromTime(s.a),remaining=subtract(rational(1),multiply(rational(s.d),rA));
   const rB=divide(remaining,rational(s.y));
   return {...b,timeA:rational(s.a),rateA:rA,rateB:rB,timeB:reciprocal(rB),durationA:rational(s.d),durationB:rational(s.y)};
  }
  case "findCompletionWithIdleInterval":{
   const s=pick([{a:12,b:18,d:4,idle:2},{a:10,b:15,d:3,idle:1},{a:16,b:24,d:5,idle:3},{a:18,b:30,d:6,idle:2}],seed,"cp004-idle");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d),idleDuration:rational(s.idle)};
  }
  case "findCompletionWithChangedDailyHours":{
   const s=pick([{days:20,h1:8,h2:10,d:5},{days:18,h1:6,h2:9,d:6},{days:24,h1:8,h2:12,d:8},{days:15,h1:5,h2:8,d:5}],seed,"cp004-hours");
   return {...b,timeA:rational(s.days),rateA:rateFromTime(s.days),durationA:rational(s.d),originalDailyHours:rational(s.h1),changedDailyHours:rational(s.h2)};
  }
  case "findCompletionWithMidProjectEfficiencyChange":{
   const s=pick([{a:20,d:5,mNum:5,mDen:4},{a:18,d:6,mNum:3,mDen:2},{a:24,d:8,mNum:4,mDen:3},{a:15,d:5,mNum:6,mDen:5}],seed,"cp004-eff-change");
   return {...b,timeA:rational(s.a),rateA:rateFromTime(s.a),durationA:rational(s.d),efficiencyMultiplier:rational(s.mNum,s.mDen)};
  }
  case "findCompletionWithNegativeWorkerActivatedLater":{
   const s=pick([
    {a:12,b:18,c:36,d:3},{a:10,b:15,c:30,d:2},{a:16,b:24,c:48,d:4},{a:18,b:27,c:54,d:5}
   ],seed,"cp004-negative-later");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),timeC:rational(s.c),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),rateC:rateFromTime(s.c),durationA:rational(s.d)};
  }
  case "findEventTimeAtSpecifiedCompletionFraction":{
   const s=pick([{a:12,n:1,d:3},{a:15,n:2,d:5},{a:18,n:1,d:6},{a:20,n:3,d:5}],seed,"cp004-fraction-event");
   return {...b,timeA:rational(s.a),rateA:rateFromTime(s.a),targetFraction:rational(s.n,s.d)};
  }
  case "findRequiredRemainingRateForDeadline":{
   const s=pick([{a:12,d:4,deadline:10},{a:15,d:5,deadline:12},{a:18,d:6,deadline:14},{a:20,d:8,deadline:15}],seed,"cp004-deadline-rate");
   return {...b,timeA:rational(s.a),rateA:rateFromTime(s.a),durationA:rational(s.d),deadline:rational(s.deadline)};
  }
  case "findWorkerCountAddedAfterPartialProgress":{
   const s=pick([{single:60,n:5,d:4,add:3},{single:72,n:6,d:4,add:3},{single:80,n:8,d:5,add:2},{single:90,n:6,d:5,add:4}],seed,"cp004-workers-add");
   const per=rateFromTime(s.single),done=multiply(multiply(rational(s.n),per),rational(s.d));
   const remaining=subtract(rational(1),done),finalCount=s.n+s.add;
   const finalDuration=divide(remaining,multiply(rational(finalCount),per));
   return {...b,perWorkerTime:rational(s.single),rateA:per,durationA:rational(s.d),deadline:add(rational(s.d),finalDuration),initialWorkerCount:s.n,changedWorkerCount:finalCount};
  }
  case "findWorkerCountRemovedAfterPartialProgress":{
   const s=pick([{single:60,n:8,d:3,remove:3},{single:72,n:9,d:4,remove:3},{single:80,n:10,d:4,remove:2},{single:90,n:9,d:5,remove:4}],seed,"cp004-workers-remove");
   const per=rateFromTime(s.single),done=multiply(multiply(rational(s.n),per),rational(s.d));
   const remaining=subtract(rational(1),done),finalCount=s.n-s.remove;
   const finalDuration=divide(remaining,multiply(rational(finalCount),per));
   return {...b,perWorkerTime:rational(s.single),rateA:per,durationA:rational(s.d),deadline:add(rational(s.d),finalDuration),initialWorkerCount:s.n,changedWorkerCount:finalCount};
  }
  case "findDelayAfterWorkerLeaves":{
   const s=pick([{a:12,b:18,d:3},{a:10,b:15,d:2},{a:16,b:24,d:4},{a:18,b:30,d:5}],seed,"cp004-delay-leave");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d)};
  }
  case "findEarlyCompletionAfterWorkerJoins":{
   const s=pick([{a:12,b:18,d:4},{a:10,b:15,d:3},{a:16,b:24,d:5},{a:18,b:30,d:6}],seed,"cp004-early-join");
   return {...b,timeA:rational(s.a),timeB:rational(s.b),rateA:rateFromTime(s.a),rateB:rateFromTime(s.b),durationA:rational(s.d)};
  }
 }
}
