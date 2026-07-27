import { add, multiply, rational } from "./rational";
import { pick } from "./cp001-helpers";
import { completionTrace, cycleWork } from "./cp005-engine";
import type { Rational } from "./types";
import type { TmwCp005Context, TmwCp005Parameters, TmwCp005RegistryEntry, TmwCp005Segment } from "./cp005-types";

const contexts:readonly TmwCp005Context[]=[
 {jobPhrase:"a customer-record batch",actorA:"Operator A",actorB:"Operator B",actorC:"Operator C",outputNoun:"records"},
 {jobPhrase:"an equipment overhaul",actorA:"Technician A",actorB:"Technician B",actorC:"Technician C",outputNoun:"components"},
 {jobPhrase:"a loan-application set",actorA:"Clerk A",actorB:"Clerk B",actorC:"Clerk C",outputNoun:"applications"},
 {jobPhrase:"a printing order",actorA:"Machine A",actorB:"Machine B",actorC:"Machine C",outputNoun:"copies"},
 {jobPhrase:"a road-marking project",actorA:"Crew A",actorB:"Crew B",actorC:"Crew C",outputNoun:"metres"},
 {jobPhrase:"a packaging order",actorA:"Team A",actorB:"Team B",actorC:"Team C",outputNoun:"packages"},
 {jobPhrase:"a quality-inspection batch",actorA:"Inspector A",actorB:"Inspector B",actorC:"Inspector C",outputNoun:"units"},
 {jobPhrase:"a manuscript-typing job",actorA:"Typist A",actorB:"Typist B",actorC:"Typist C",outputNoun:"pages"},
 {jobPhrase:"a school-building paint job",actorA:"Painter A",actorB:"Painter B",actorC:"Painter C",outputNoun:"square metres"},
 {jobPhrase:"a warehouse inventory count",actorA:"Recorder A",actorB:"Recorder B",actorC:"Recorder C",outputNoun:"items"},
 {jobPhrase:"a field survey",actorA:"Surveyor A",actorB:"Surveyor B",actorC:"Surveyor C",outputNoun:"plots"},
 {jobPhrase:"an electronics-assembly order",actorA:"Assembler A",actorB:"Assembler B",actorC:"Assembler C",outputNoun:"units"},
];
function base(seed:string):TmwCp005Parameters{return {totalWork:rational(1),timeUnit:"day",context:pick(contexts,seed,"cp005-context"),cycle:[]};}
function rateFromTime(time:number):Rational{return rational(1,time);}
function seg(label:string,rate:Rational,duration=1,description=label):TmwCp005Segment{return {label,rate,duration:rational(duration),description};}
function alternating(context:TmwCp005Context,a:number,b:number,start:"A"|"B"="A"):TmwCp005Segment[]{const A=seg(context.actorA,rateFromTime(a),1,`${context.actorA} works`),B=seg(context.actorB,rateFromTime(b),1,`${context.actorB} works`);return start==="A"?[A,B]:[B,A];}
function unknownAlternation(context:TmwCp005Context,a:number,b:number):{cycle:TmwCp005Segment[];known:Rational;terminal:string}{const full=alternating(context,a,b,"A"),trace=completionTrace(full,rational(1));return {cycle:[full[0],{...full[1],rate:rational(0)}],known:trace.time,terminal:trace.terminalLabel};}

export function buildTmwCp005Parameters(entry:TmwCp005RegistryEntry,seed:string):TmwCp005Parameters{
 const b=base(seed),c=b.context;
 switch(entry.solveMode){
  case "findCompletionTimeForTwoAgentAlternationStartingA":{const s=pick([{a:12,b:18},{a:10,b:15},{a:16,b:24},{a:18,b:30}],seed,"cp005-alt-a");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:alternating(c,s.a,s.b,"A")};}
  case "findCompletionTimeForTwoAgentAlternationStartingB":{const s=pick([{a:12,b:18},{a:10,b:15},{a:16,b:24},{a:18,b:30}],seed,"cp005-alt-b");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:alternating(c,s.a,s.b,"B")};}
  case "findCompletionTimeForMultiDayCycle":{const s=pick([{a:12,b:18,da:2,db:1},{a:15,b:20,da:3,db:2},{a:16,b:24,da:2,db:2},{a:18,b:30,da:3,db:1}],seed,"cp005-multi");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:[seg(c.actorA,rateFromTime(s.a),s.da,`${c.actorA} works for ${s.da} ${s.da===1?"day":"days"}`),seg(c.actorB,rateFromTime(s.b),s.db,`${c.actorB} works for ${s.db} ${s.db===1?"day":"days"}`)]};}
  case "findCompletionTimeForThreeAgentCycle":{const s=pick([{a:12,b:18,cc:36},{a:15,b:20,cc:30},{a:16,b:24,cc:48},{a:18,b:27,cc:54}],seed,"cp005-three");return {...b,timeA:rational(s.a),timeB:rational(s.b),timeC:rational(s.cc),cycle:[seg(c.actorA,rateFromTime(s.a)),seg(c.actorB,rateFromTime(s.b)),seg(c.actorC,rateFromTime(s.cc))]};}
  case "findCompletionDayAndTerminalFraction":
  case "findTerminalAgent":{const s=pick([{a:12,b:18},{a:10,b:15},{a:16,b:24},{a:18,b:30}],seed,"cp005-terminal");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:alternating(c,s.a,s.b,"A")};}
  case "findCompletionWithinCycleSegment":{const s=pick([{a:12,b:18,da:2,db:1},{a:15,b:20,da:3,db:2},{a:16,b:24,da:2,db:2},{a:18,b:30,da:3,db:1}],seed,"cp005-within-segment");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:[seg(c.actorA,rateFromTime(s.a),s.da,`${c.actorA} works for ${s.da} ${s.da===1?"day":"days"}`),seg(c.actorB,rateFromTime(s.b),s.db,`${c.actorB} works for ${s.db} ${s.db===1?"day":"days"}`)]};}
  case "findWorkAfterGivenNumberOfCycles":
  case "findRemainingWorkAfterFullCycles":{const s=pick([{a:12,b:18,n:2},{a:15,b:20,n:3},{a:16,b:24,n:3},{a:18,b:30,n:4}],seed,"cp005-cycle-work");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:alternating(c,s.a,s.b,"A"),givenCycles:s.n};}
  case "findStartingAgentFromCompletionCondition":{const s=pick([{a:12,b:18,start:"A" as const},{a:10,b:15,start:"B" as const},{a:16,b:24,start:"A" as const},{a:18,b:30,start:"B" as const}],seed,"cp005-start-inverse");const cycleA=alternating(c,s.a,s.b,"A"),cycleB=alternating(c,s.a,s.b,"B"),chosen=s.start==="A"?cycleA:cycleB,trace=completionTrace(chosen,rational(1));return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:cycleA,alternateCycle:cycleB,knownCompletionTime:trace.time,knownTerminalLabel:trace.terminalLabel,expectedStartLabel:s.start==="A"?c.actorA:c.actorB};}
  case "findUnknownRateFromAlternatingCompletion":
  case "findUnknownTimeFromAlternatingCompletion":{const s=pick([{a:12,b:18},{a:10,b:15},{a:16,b:24},{a:18,b:30}],seed,"cp005-unknown");const u=unknownAlternation(c,s.a,s.b);return {...b,timeA:rational(s.a),cycle:u.cycle,knownCompletionTime:u.known,knownTerminalLabel:u.terminal,unknownSegmentIndex:1};}
  case "findCompletionWhenHelperWorksEveryNthDay":{const s=pick([{a:18,b:36,n:3},{a:20,b:40,n:4},{a:24,b:48,n:3},{a:15,b:30,n:5}],seed,"cp005-helper");const cycle:TmwCp005Segment[]=[];for(let i=1;i<s.n;i++)cycle.push(seg(c.actorA,rateFromTime(s.a),1,`${c.actorA} works alone`));cycle.push(seg(`${c.actorA} + ${c.actorB}`,add(rateFromTime(s.a),rateFromTime(s.b)),1,`${c.actorB} helps on every ${s.n}th day`));return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle,patternNumber:s.n};}
  case "findCompletionWhenAgentRestsEveryNthDay":{const s=pick([{a:12,n:4},{a:15,n:5},{a:18,n:3},{a:20,n:6}],seed,"cp005-rest");const cycle:TmwCp005Segment[]=[];for(let i=1;i<s.n;i++)cycle.push(seg(c.actorA,rateFromTime(s.a),1,`${c.actorA} works`));cycle.push(seg("Rest day",rational(0),1,`${c.actorA} rests`));return {...b,timeA:rational(s.a),cycle,patternNumber:s.n};}
  case "findCompletionWithWeekendOrHolidayPattern":{const s=pick([{a:10},{a:12},{a:15},{a:18}],seed,"cp005-weekend");const cycle:TmwCp005Segment[]=[];for(let i=0;i<5;i++)cycle.push(seg(c.actorA,rateFromTime(s.a),1,"working day"));cycle.push(seg("Saturday",rational(0),1,"no work"),seg("Sunday",rational(0),1,"no work"));return {...b,timeA:rational(s.a),cycle,patternNumber:7};}
  case "findCompletionWithUnequalShiftDurations":{const s=pick([{a:60,b:80,da:6,db:8},{a:72,b:96,da:8,db:6},{a:90,b:120,da:10,db:8},{a:84,b:126,da:7,db:9}],seed,"cp005-shifts");return {...b,timeUnit:"hour",timeA:rational(s.a),timeB:rational(s.b),cycle:[seg(c.actorA,rateFromTime(s.a),s.da,`${c.actorA} works ${s.da===8?"an":"a"} ${s.da}-hour shift`),seg(c.actorB,rateFromTime(s.b),s.db,`${c.actorB} works ${s.db===8?"an":"a"} ${s.db}-hour shift`)]};}
  case "findCompletionWithTwoDaysOnOneDayOffPattern":{const s=pick([{a:12},{a:15},{a:18},{a:20}],seed,"cp005-two-on");return {...b,timeA:rational(s.a),cycle:[seg(c.actorA,rateFromTime(s.a),2,"works for two days"),seg("Rest day",rational(0),1,"rests for one day")]};}
  case "findCompletionWithPeriodicNegativeWork":{const s=pick([{a:12,b:18,cc:36},{a:15,b:20,cc:60},{a:16,b:24,cc:48},{a:18,b:27,cc:54}],seed,"cp005-negative");const positive=add(rateFromTime(s.a),rateFromTime(s.b));return {...b,timeA:rational(s.a),timeB:rational(s.b),timeC:rational(s.cc),cycle:[seg(`${c.actorA} + ${c.actorB}`,positive,2,"productive team works for two days"),seg(c.actorC,multiply(rational(-1),rateFromTime(s.cc)),1,`${c.actorC} undoes work for one day`)]};}
  case "findCompletionWithRepeatedJoinLeaveCycle":{const s=pick([{a:12,b:18},{a:10,b:15},{a:16,b:24},{a:18,b:30}],seed,"cp005-join-leave");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:[seg(c.actorA,rateFromTime(s.a),1,`${c.actorA} works alone`),seg(`${c.actorA} + ${c.actorB}`,add(rateFromTime(s.a),rateFromTime(s.b)),1,`${c.actorB} joins for one day`)]};}
  case "findCycleCountToReachSpecifiedFraction":{const s=pick([{a:12,b:18,n:2},{a:15,b:20,n:3},{a:16,b:24,n:2},{a:18,b:30,n:3}],seed,"cp005-cycle-count");const cycle=alternating(c,s.a,s.b,"A"),target=multiply(cycleWork(cycle),rational(s.n));return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle,targetWork:target};}
  case "findTimeFromArbitraryCyclePhase":{const s=pick([{a:12,b:18,offset:1},{a:10,b:15,offset:1},{a:16,b:24,offset:1},{a:18,b:30,offset:1}],seed,"cp005-offset");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:alternating(c,s.a,s.b,"A"),startOffset:s.offset};}
  case "findExactBoundaryCompletion":{const s=pick([{a:12,b:6},{a:16,b:8},{a:20,b:10},{a:24,b:12}],seed,"cp005-boundary");return {...b,timeA:rational(s.a),timeB:rational(s.b),cycle:alternating(c,s.a,s.b,"A")};}
  case "findOutputUnderPeriodicMachineSchedule":{const s=pick([{a:30,b:20,da:2,db:1,n:4},{a:24,b:18,da:3,db:2,n:3},{a:40,b:25,da:2,db:2,n:5},{a:36,b:28,da:1,db:2,n:4}],seed,"cp005-output");const cycle=[seg(c.actorA,rational(s.a),s.da,`${c.actorA} runs for ${s.da} hours`),seg(c.actorB,rational(s.b),s.db,`${c.actorB} runs for ${s.db} hours`)];return {...b,totalWork:rational(0),timeUnit:"hour",cycle,givenCycles:s.n,outputUnit:c.outputNoun};}
  case "findRequiredCycleRateForDeadline":{const s=pick([{a:16,d:8},{a:20,d:10},{a:24,d:12},{a:28,d:14}],seed,"cp005-required-rate");return {...b,timeA:rational(s.a),cycle:[seg(c.actorA,rateFromTime(s.a),1,`${c.actorA} works`),seg(c.actorB,rational(0),1,`${c.actorB} works at an unknown rate`)],deadline:rational(s.d),unknownSegmentIndex:1};}
 }
}
