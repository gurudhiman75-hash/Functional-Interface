import { add, subtract, multiply, divide, compare, modulo, equals, rational, type Rational } from "../TSD-001/foundation/rational";
import { EDITORIAL_REVIEW_LOCK } from "./worked-calculation";
const zero=rational(0);
const positive=(v:Rational,label:string)=>{if(compare(v,zero)<=0)throw new Error(`${label} must be positive`);};
const abs=(v:Rational)=>compare(v,zero)<0?multiply(v,rational(-1)):v;
/** Review Test3 Q6–9: common start, opposite directions, reverse directions
 * and exchange speed magnitudes at meetings except at the common start. */
export function solveMeetingSpeedExchange(input:{track:Rational;speedA:Rational;speedB:Rational;events:number}) {
 positive(input.track,"track"); positive(input.speedA,"speedA"); positive(input.speedB,"speedB");
 if(!Number.isInteger(input.events)||input.events<=0||input.events>10000)throw new Error("events must be1..10000");
 let a=input.speedA,b=input.speedB,dir=1,point=zero,time=zero,distanceA=zero,distanceB=zero;
 const period=divide(input.track,add(a,b));
 const events=[];
 for(let n=1;n<=input.events;n++) {
  point=modulo(add(point,multiply(multiply(a,rational(dir)),period)),input.track);
  time=add(time,period); distanceA=add(distanceA,multiply(a,period)); distanceB=add(distanceB,multiply(b,period));
  const atStart=equals(point,zero);
  if(!atStart){[a,b]=[b,a];dir*=-1;}
  events.push(Object.freeze({number:n,time,point,distanceA,distanceB,exchanged:!atStart,nextSignedSpeedA:multiply(a,rational(dir)),nextSignedSpeedB:multiply(b,rational(-dir))}));
 }
 return Object.freeze({...EDITORIAL_REVIEW_LOCK,model:"meetingSpeedExchange",events:Object.freeze(events)});
}
export type DispatchMessage=Readonly<{id:string;sentAt:Rational;position:Rational}>;
/** Taste Q16–17: instantaneous service; requests acknowledged only while at
 * a station; requests received during a trip wait for the next station visit. */
export function solveStationQueuedDispatch(input:{length:Rational;speed:Rational;messages:readonly DispatchMessage[];nearestStation:boolean}) {
 positive(input.length,"length");positive(input.speed,"speed");
 if(new Set(input.messages.map(m=>m.id)).size!==input.messages.length)throw new Error("Message ids must be unique");
 for(const m of input.messages)if(compare(m.sentAt,zero)<0||compare(m.position,zero)<=0||compare(m.position,input.length)>=0)throw new Error("Invalid dispatch message");
 const pending=[...input.messages];let time=zero,position=zero,distance=zero;
 const acknowledgements=[];const trips=[];
 while(pending.length) {
  let ready=pending.filter(m=>compare(m.sentAt,time)<=0);
  if(!ready.length){time=pending.reduce((first,m)=>compare(m.sentAt,first)<0?m.sentAt:first,pending[0]!.sentAt);ready=pending.filter(m=>compare(m.sentAt,time)<=0);}
  for(const m of ready)acknowledgements.push(Object.freeze({id:m.id,noticeTime:time,distanceAtNotice:distance}));
  const ids=new Set(ready.map(m=>m.id));for(let i=pending.length-1;i>=0;i--)if(ids.has(pending[i]!.id))pending.splice(i,1);
  ready.sort((a,b)=>compare(a.position,b.position)*(equals(position,zero)?1:-1));
  const last=ready.at(-1)!.position;
  const returnStation=input.nearestStation && compare(subtract(input.length,last),last)<0?input.length:zero;
  const tripDistance=add(abs(subtract(last,position)),abs(subtract(returnStation,last)));
  const finish=add(time,divide(tripDistance,input.speed));
  trips.push(Object.freeze({startTime:time,endTime:finish,startStation:position,endStation:returnStation,served:Object.freeze(ready.map(m=>m.id)),distance:tripDistance}));
  distance=add(distance,tripDistance);time=finish;position=returnStation;
 }
 return Object.freeze({...EDITORIAL_REVIEW_LOCK,model:"stationQueuedDispatch",acknowledgements:Object.freeze(acknowledgements),trips:Object.freeze(trips),totalDistance:distance,finishTime:time});
}
