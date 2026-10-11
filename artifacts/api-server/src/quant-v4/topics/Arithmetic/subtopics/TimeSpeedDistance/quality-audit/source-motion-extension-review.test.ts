import assert from "node:assert/strict";
import {TSD_SOURCE_MOTION_EXTENSION_REVIEW as rows} from "./source-motion-extension-review";
import {EDITORIAL_REVIEW_LOCK} from "./worked-calculation";
import {equals,rational as r,type Rational} from "../TSD-001/foundation/rational";
assert.equal(rows.length,45);assert.equal(new Set(rows.map(row=>row.familyId)).size,15);assert.equal(new Set(rows.map(row=>row.model)).size,14);
for(const row of rows){
 assert.equal(row.options.length,4);assert.equal(new Set(row.options).size,4);assert.equal(row.options[row.correctIndex],row.answerText);
 assert.ok(row.stem.endsWith("?")||row.stem.endsWith("है?")||row.stem.endsWith("ਹੈ?"));assert.ok(row.explanation.steps.length>=2);
 const text=[row.stem,...row.explanation.steps,...row.options].join(" ");
 assert.doesNotMatch(text,/\[object Object\]|sidhe arth|associated|do this first/i);
 if(row.locale==="hi"){assert.match(text,/[\u0900-\u097F]/u);assert.doesNotMatch(text,/[\u0A00-\u0A7F]/u);}
 if(row.locale==="pa"){assert.match(text,/[\u0A00-\u0A7F]/u);assert.doesNotMatch(text,/[\u0900-\u0963\u0966-\u097F]/u);}
 for(const[key,value]of Object.entries(EDITORIAL_REVIEW_LOCK))assert.equal((row as Record<string,unknown>)[key],value);
}
const eq=(a:unknown,b:Rational)=>assert.ok(equals(a as Rational,b));
type ReviewSolution={crossSpeedSquared?:Rational;bodyToCurrentSquared?:Rational;receiverSpeed?:Rational;time?:Rational;sampledDistance?:Rational;displacement?:Rational;offsetSquared?:Rational;previousRoundRatio?:Rational;walkerSpeed?:Rational;bPosition?:Rational;events?:readonly{birdDistance?:Rational;distanceA?:Rational}[];acknowledgements?:readonly{id:string;distanceAtNotice:Rational}[]};
for(const row of rows.filter(row=>row.locale==="en")){
 const s=row.solution as ReviewSolution;
 switch(row.model){
  case"oppositeBankCrossing":eq(s.crossSpeedSquared,r(364));break;
  case"doubledBoatTimeRatio":eq(s.bodyToCurrentSquared,r(7,4));break;
  case"approachingSoundReceiver":eq(s.receiverSpeed,r(330,23));break;
  case"birdIntercepts":eq(s.events?.[2]?.birdDistance,r(104,9));break;
  case"closestApproach":eq(s.time,r(4));break;
  case"polynomialMotion":eq(s.sampledDistance,r(22));break;
  case"constantAcceleration":eq(s.displacement,r(2000));break;
  case"highwayTurn":eq(s.offsetSquared,r(144));break;
  case"acceleratedCatch":eq(s.time,r(2));break;
  case"geometricLapTime":eq(s.previousRoundRatio,r(16));break;
  case"returnLiftInverse":eq(s.walkerSpeed,r(9,2));break;
  case"sharedRideDropPickup":eq(s.bPosition,r(61,7));break;
  case"meetingSpeedExchange":eq(s.events?.[2]?.distanceA,r(700));break;
  case"stationQueuedDispatch":eq(s.acknowledgements?.find(a=>a.id==="E")?.distanceAtNotice,row.familyId.endsWith("NEAREST")?r(120):r(140));break;
  default:assert.fail(`Missing proof for ${row.model}`);
 }
}
console.log("PASS:45 authored trilingual source-extension rows across15 states/14models; calculations, options, locale parity and all delivery locks retained.");
