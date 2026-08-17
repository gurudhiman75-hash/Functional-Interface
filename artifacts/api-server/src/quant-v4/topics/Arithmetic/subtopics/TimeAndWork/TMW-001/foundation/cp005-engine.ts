import { add, compare, divide, multiply, rational, subtract } from "./rational";
import type { Rational } from "./types";
import type { TmwCp005Segment, TmwCp005Trace } from "./cp005-types";

export function cycleDuration(cycle:TmwCp005Segment[]):Rational{return cycle.reduce((total,segment)=>add(total,segment.duration),rational(0));}
export function cycleWork(cycle:TmwCp005Segment[]):Rational{return cycle.reduce((total,segment)=>add(total,multiply(segment.rate,segment.duration)),rational(0));}

export function workAfterTime(cycle:TmwCp005Segment[],elapsed:Rational,startOffset=0):Rational{
 let remaining=elapsed,work=rational(0),index=((startOffset%cycle.length)+cycle.length)%cycle.length,guard=0;
 while(compare(remaining,rational(0))>0){
  if(guard++>10000)throw new Error("Cycle simulation exceeded guard");
  const segment=cycle[index];
  const used=compare(remaining,segment.duration)>=0?segment.duration:remaining;
  work=add(work,multiply(segment.rate,used));
  remaining=subtract(remaining,used);
  if(compare(used,segment.duration)===0)index=(index+1)%cycle.length;
 }
 return work;
}

export function segmentDurationsUntil(cycle:TmwCp005Segment[],elapsed:Rational,startOffset=0):Rational[]{
 const totals=cycle.map(()=>rational(0));
 let remaining=elapsed,index=((startOffset%cycle.length)+cycle.length)%cycle.length,guard=0;
 while(compare(remaining,rational(0))>0){
  if(guard++>10000)throw new Error("Cycle duration accounting exceeded guard");
  const segment=cycle[index];
  const used=compare(remaining,segment.duration)>=0?segment.duration:remaining;
  totals[index]=add(totals[index],used);
  remaining=subtract(remaining,used);
  if(compare(used,segment.duration)===0)index=(index+1)%cycle.length;
 }
 return totals;
}

export function completionTrace(cycle:TmwCp005Segment[],targetWork:Rational,startOffset=0):TmwCp005Trace{
 let work=rational(0),time=rational(0),index=((startOffset%cycle.length)+cycle.length)%cycle.length,guard=0,wraps=0;
 while(compare(work,targetWork)<0){
  if(guard++>10000)throw new Error("Completion simulation exceeded guard");
  const segment=cycle[index];
  const segmentWork=multiply(segment.rate,segment.duration);
  if(segment.rate.numerator>0&&compare(add(work,segmentWork),targetWork)>=0){
   const needed=subtract(targetWork,work);
   const used=divide(needed,segment.rate);
   return {time:add(time,used),work:targetWork,terminalIndex:index,terminalLabel:segment.label,terminalFraction:divide(used,segment.duration),fullCycles:wraps};
  }
  work=add(work,segmentWork);
  time=add(time,segment.duration);
  index=(index+1)%cycle.length;
  if(index===((startOffset%cycle.length)+cycle.length)%cycle.length)wraps+=1;
 }
 throw new Error("Completion trace ended unexpectedly");
}

export function replaceSegmentRate(cycle:TmwCp005Segment[],index:number,rate:Rational):TmwCp005Segment[]{return cycle.map((segment,i)=>i===index?{...segment,rate}:segment);}
