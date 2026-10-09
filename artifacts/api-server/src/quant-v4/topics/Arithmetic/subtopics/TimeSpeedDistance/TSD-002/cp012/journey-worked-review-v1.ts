import { rational,compare,ceilRational,floorRational,modulo,toMixedString,type Rational } from "../../TSD-001/foundation/rational";
import { calculationWriter,EDITORIAL_REVIEW_LOCK,type ReviewLocale,type CalculationUnit } from "../../quality-audit/worked-calculation";
import { TSD_CP012_ENGLISH_REVIEW_FINAL } from "./english-review-editorial-final";
import { TSD_CP012_NATIVE_HINDI_REVIEW_FINAL,TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL } from "./native-review-editorial-final";
const sources=[TSD_CP012_ENGLISH_REVIEW_FINAL,TSD_CP012_NATIVE_HINDI_REVIEW_FINAL,TSD_CP012_NATIVE_PUNJABI_REVIEW_FINAL] as const;
const locales:readonly ReviewLocale[]=["en-IN","hi-IN","pa-IN"];
const labels={distance:["Distance","दूरी","ਦੂਰੀ"],time:["Time","समय","ਸਮਾਂ"],speed:["Speed","चाल","ਚਾਲ"],remaining:["Remaining distance","शेष दूरी","ਬਾਕੀ ਦੂਰੀ"],total:["Total","कुल","ਕੁੱਲ"],difference:["Difference","अंतर","ਫ਼ਰਕ"],rate:["Combined speed","संयुक्त चाल","ਕੁੱਲ ਚਾਲ"],delay:["Delay","देरी","ਦੇਰੀ"],block:["Distance per travel block","प्रति यात्रा खंड दूरी","ਸਫ਼ਰ ਦੇ ਹਰੇਕ ਹਿੱਸੇ ਦੀ ਦੂਰੀ"],rests:["Rest count","विश्रामों की संख्या","ਆਰਾਮਾਂ ਦੀ ਗਿਣਤੀ"],available:["Available time","उपलब्ध समय","ਉਪਲਬਧ ਸਮਾਂ"],perMetre:["Time per metre","प्रति मीटर समय","ਪ੍ਰਤੀ ਮੀਟਰ ਸਮਾਂ"],index:["Fastest route number","सबसे तेज़ मार्ग की संख्या","ਸਭ ਤੋਂ ਤੇਜ਼ ਰਸਤੇ ਦਾ ਨੰਬਰ"],candidate:["Candidate speed","संभावित चाल","ਸੰਭਵ ਚਾਲ"],allowed:["Allowed speed count","स्वीकृत चालों की संख्या","ਮਨਜ਼ੂਰ ਚਾਲਾਂ ਦੀ ਗਿਣਤੀ"],position:["Position along track","ट्रैक पर स्थिति","ਟਰੈਕ ਉੱਤੇ ਸਥਿਤੀ"]} as const;
export const TSD_CP012_JOURNEY_WORKED_REVIEW_V1=Object.freeze(sources.flatMap((rows,index)=>rows.filter(q=>!["movingSurfaceScheduleSynthesisState","twoEngineInverseState"].includes(q.input.authorityKey)).map(source=>{
 const i=source.input,w=calculationWriter(locales[index]),zero=rational(0),one=rational(1);
 const b=(key:keyof typeof labels,a:Rational,op:"+"|"−"|"×"|"÷",c:Rational,u:CalculationUnit)=>w.binary(labels[key],a,op,c,u);
 const put=(key:keyof typeof labels,expr:string,value:Rational,u:CalculationUnit)=>w.put(labels[key],expr,value,u);
 const sum=(values:readonly Rational[],u:CalculationUnit)=>values.reduce((a,c)=>b("total",a,"+",c,u),zero);
 const timed=(stages:readonly {speed:Rational;duration:Rational}[])=>sum(stages.map(s=>b("distance",s.speed,"×",s.duration,"m")),"m");
 const route=(stages:readonly {speed:Rational;distance:Rational}[])=>sum(stages.map(s=>b("time",s.distance,"÷",s.speed,"s")),"s");
 const split=(d:Rational,t:Rational,a:Rational,c:Rational)=>{
  const base=b("time",d,"÷",c,"s");const numerator=b("difference",t,"−",base,"s");
  const denominator=b("difference",b("perMetre",one,"÷",a,"s/m"),"−",b("perMetre",one,"÷",c,"s/m"),"s/m");
  return b("distance",numerator,"÷",denominator,"m");
 };
 let answer:Rational|undefined,values:readonly Rational[]|undefined;
 if(i.authorityKey==="discreteSpeedProgramState"){
  if(i.target==="TOTAL_DISTANCE")answer=timed(i.stages);
  else if(i.target==="TOTAL_TIME")answer=route(i.stages);
  else if(i.target==="UNKNOWN_FINAL_SPEED")answer=b("speed",b("remaining",i.totalDistance,"−",timed(i.priorStages),"m"),"÷",i.finalDuration,"m/s");
  else if(i.target==="PERIODIC_DISTANCE")answer=b("distance",b("distance",timed(i.cycle),"×",rational(i.fullCycles),"m"),"+",timed(i.partialStages),"m");
  else{
   const cycleD=timed(i.cycle),cycleT=sum(i.cycle.map(s=>s.duration),"s");
   const quotient=b("total",i.distance,"÷",cycleD,"");const cycles=put("total",`floor(${toMixedString(quotient)})`,rational(floorRational(quotient)),"");
   let elapsed=b("time",cycles,"×",cycleT,"s"),remaining=b("remaining",i.distance,"−",b("distance",cycles,"×",cycleD,"m"),"m");
   for(const stage of i.cycle){if(compare(remaining,zero)===0)break;const d=b("distance",stage.speed,"×",stage.duration,"m");if(compare(remaining,d)<=0){elapsed=b("time",elapsed,"+",b("time",remaining,"÷",stage.speed,"s"),"s");remaining=zero;break;}elapsed=b("time",elapsed,"+",stage.duration,"s");remaining=b("remaining",remaining,"−",d,"m");}answer=elapsed;
  }
 }else if(i.authorityKey==="periodicTravelRestProgramState"){
  const block=b("block",i.travelSpeed,"×",i.travelDurationPerBlock,"m"),q=b("total",i.distance,"÷",block,"");
  const blocks=put("total",`ceil(${toMixedString(q)})`,rational(ceilRational(q)),"");const rests=b("rests",blocks,"−",one,"");
  if(i.target==="REST_COUNT")answer=rests;else{
   const moving=b("time",i.distance,"÷",i.travelSpeed,"s");
   answer=i.target==="COMPLETION_TIME"?b("time",moving,"+",b("time",rests,"×",i.restDuration,"s"),"s"):b("time",b("difference",i.totalElapsedTime,"−",moving,"s"),"÷",rests,"s");
  }
 }else if(i.authorityKey==="terminalConstraintProgramState"){
  if(i.target==="REQUIRED_FINAL_SPEED")answer=b("speed",b("remaining",i.totalDistance,"−",i.completedDistance,"m"),"÷",b("available",i.deadline,"−",i.elapsedTime,"s"),"m/s");
  else if(i.target==="REQUIRED_FINAL_TIME")answer=b("time",b("remaining",i.totalDistance,"−",i.completedDistance,"m"),"÷",i.finalSpeed,"s");
  else if(i.target==="STAGE_BOUNDARY_DISTANCE")answer=split(i.totalDistance,i.totalTime,i.firstSpeed,i.secondSpeed);
  else if(i.target==="MAXIMUM_DELAY")answer=b("delay",i.arrivalDeadline,"−",b("time",i.distance,"÷",i.speed,"s"),"s");
  else if(i.target==="MINIMUM_SPEED")answer=b("speed",i.distance,"÷",i.availableTime,"m/s");
  else answer=b("remaining",i.totalDistance,"−",timed(i.completedStages),"m");
 }else if(i.authorityKey==="routeProfileProgramState"){
  if(i.target==="TOTAL_TIME")answer=route(i.segments);
  else if(i.target==="DISTANCE_SPLIT_A")answer=split(i.totalDistance,i.totalTime,i.speedA,i.speedB);
  else if(i.target==="FASTEST_ROUTE_INDEX"){
   const times=i.routes.map(r=>route(r.segments));let best=0;times.forEach((t,j)=>{if(compare(t,times[best])<0)best=j;});answer=put("index",times.map(toMixedString).join(", "),rational(best+1),"");
  }else if(i.target==="TIME_DIFFERENCE_BETWEEN_ROUTES"){
   const a=route(i.routeA.segments),c=route(i.routeB.segments);answer=compare(a,c)>=0?b("difference",a,"−",c,"s"):b("difference",c,"−",a,"s");
  }else{
   const perimeter=sum(i.clockwiseSegments.map(s=>s.distance),"m");let ai=0,ci=0,ar=i.clockwiseSegments[0].distance,cr=i.counterclockwiseSegments[0].distance,closed=zero,elapsed=zero;
   while(compare(closed,perimeter)<0){
    const as=i.clockwiseSegments[ai].speed,cs=i.counterclockwiseSegments[ci].speed,rate=b("rate",as,"+",cs,"m/s");
    const meet=b("time",b("remaining",perimeter,"−",closed,"m"),"÷",rate,"s"),at=b("time",ar,"÷",as,"s"),ct=b("time",cr,"÷",cs,"s");
    const step=[meet,at,ct].reduce((a,c)=>compare(a,c)<0?a:c);
    elapsed=b("time",elapsed,"+",step,"s");closed=b("distance",closed,"+",b("distance",rate,"×",step,"m"),"m");ar=b("remaining",ar,"−",b("distance",as,"×",step,"m"),"m");cr=b("remaining",cr,"−",b("distance",cs,"×",step,"m"),"m");
    if(compare(closed,perimeter)===0)break;if(compare(ar,zero)===0)ar=i.clockwiseSegments[++ai].distance;if(compare(cr,zero)===0)cr=i.counterclockwiseSegments[++ci].distance;
   }answer=elapsed;
  }
 }else if(i.authorityKey==="motionReconstructionProgramState"){
  if(i.target==="MISSING_DISTANCE")answer=b("remaining",i.totalDistance,"−",sum(i.knownDistances,"m"),"m");
  else if(i.target==="MISSING_TIME")answer=b("time",i.totalTime,"−",sum(i.knownTimes,"s"),"s");
  else if(i.target==="MISSING_SPEED")answer=b("speed",i.missingDistance,"÷",i.missingTime,"m/s");
  else answer=b("distance",i.missingSpeed,"×",b("time",i.totalTime,"−",b("time",i.knownStage.distance,"÷",i.knownStage.speed,"s"),"s"),"m");
 }else if(i.authorityKey==="trainScheduleSynthesisState"){
  const rate=b("rate",i.speedA,"+",i.speedB,"m/s");
  if(i.target==="DELAY_B")answer=b("delay",b("difference",b("distance",rate,"×",i.meetingTimeFromFirstDeparture,"m"),"−",i.stationDistance,"m"),"÷",i.speedB,"s");
  else{
   const closure=i.target==="MEETING_TIME_FROM_FIRST_DEPARTURE"?i.stationDistance:b("distance",b("distance",i.initialGap,"+",i.lengthA,"m"),"+",i.lengthB,"m");
   const remaining=b("remaining",closure,"−",b("distance",i.speedA,"×",i.delayB,"m"),"m");answer=b("time",i.delayB,"+",b("time",remaining,"÷",rate,"s"),"s");
  }
 }else if(i.authorityKey==="mediumPursuitSynthesisState"){
  if(i.target==="CURRENT_SPEED")answer=b("speed",b("distance",i.boatStillWaterSpeed,"×",b("time",i.catchTimeFromRaftStart,"−",i.boatStartDelay,"s"),"m"),"÷",i.boatStartDelay,"m/s");
  else if(i.target==="DROPPED_OBJECT_RECOVERY_DISTANCE")answer=b("distance",b("time",rational(2),"×",i.detectionDelay,"s"),"×",i.currentSpeed,"m");
  else{
   const rate=b("rate",i.boatStillWaterSpeed,"+",i.currentSpeed,"m/s"),gap=b("distance",i.currentSpeed,"×",i.boatStartDelay,"m");
   const relative=b("difference",rate,"−",i.currentSpeed,"m/s");const time=b("time",i.boatStartDelay,"+",b("time",gap,"÷",relative,"s"),"s");answer=i.target==="RAFT_CATCH_TIME_FROM_RAFT_START"?time:b("distance",time,"×",i.currentSpeed,"m");
  }
 }else if(i.authorityKey==="closedTrackRaceSynthesisState"){
  if(i.target==="FIRST_OVERTAKE_TIME"){
   const mod=modulo(i.slowerHeadStart,i.trackLength),gap=compare(mod,zero)===0?i.trackLength:mod;
   put("distance",`${toMixedString(i.slowerHeadStart)} mod ${toMixedString(i.trackLength)}`,gap,"m");answer=b("time",gap,"÷",b("difference",i.fasterSpeed,"−",i.slowerSpeed,"m/s"),"s");
  }else{
   const distance=b("distance",i.trackLength,"×",rational(i.raceLaps),"m"),time=b("time",distance,"÷",i.fasterSpeed,"s"),travel=b("distance",time,"×",i.slowerSpeed,"m");
   if(i.target==="HEAD_START_FOR_DEAD_HEAT")answer=b("distance",distance,"−",travel,"m");
   else{const position=b("position",travel,"+",i.slowerHeadStart,"m");answer=put("remaining",`(−${toMixedString(position)}) mod ${toMixedString(i.trackLength)}`,modulo(rational(-position.numerator,position.denominator),i.trackLength),"m");}
  }
 }else if(i.authorityKey==="feasibleParameterSetState"){
  const allowed:Rational[]=[];
  for(let speed=i.minimumCandidate;speed<=i.maximumCandidate;speed++){
   const travel=b("time",i.distance,"÷",rational(speed),"s"),elapsed=b("time",travel,"+",i.fixedDelay,"s");
   put("candidate",`${speed}: ${toMixedString(elapsed)} ≤ ${toMixedString(i.deadline)} ⇒ ${compare(elapsed,i.deadline)<=0?"✓":"✗"}`,rational(speed),"m/s");if(compare(elapsed,i.deadline)<=0)allowed.push(rational(speed));
  }
  if(i.target==="COUNT")answer=put("allowed",allowed.map(toMixedString).join(", "),rational(allowed.length),"");else values=Object.freeze(allowed);
 }else throw new Error("Wrong journey authority");
 if(source.solution.kind==="SCALAR"){
  if(!answer || compare(answer,source.solution.answer)!==0)throw new Error(`Mismatch ${source.familyId}`);
 }else if(!values || values.length!==source.solution.values.length || values.some((a,j)=>compare(a,source.solution.kind==="SET"?source.solution.values[j]:zero)!==0))throw new Error(`Set mismatch ${source.familyId}`);
 const stem=index===0?source.stem.replace(/\b1 seconds\b/g,"1 second"):source.stem;
 return Object.freeze({...source,...EDITORIAL_REVIEW_LOCK,locale:locales[index],version:"TSD-CP012-JOURNEY-WORKED-V1",stem,computedAnswer:answer,computedValues:values,calculations:Object.freeze(w.steps),explanation:Object.freeze({steps:Object.freeze([...source.explanation.steps.slice(0,1),...w.steps.map(s=>s.text)]),conclusion:source.explanation.conclusion})});
})));
