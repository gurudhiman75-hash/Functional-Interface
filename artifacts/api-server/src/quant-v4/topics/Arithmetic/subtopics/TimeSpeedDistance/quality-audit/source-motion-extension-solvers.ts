import { add, subtract, multiply, divide, compare, rational, negate, type Rational } from "../TSD-001/foundation/rational";
import { EDITORIAL_REVIEW_LOCK } from "./worked-calculation";
const z=rational(0),one=rational(1),two=rational(2);
const sq=(v:Rational)=>multiply(v,v);
const positive=(v:Rational,name:string)=>{if(compare(v,z)<=0)throw new Error(`${name} must be positive`);};
const nonnegative=(v:Rational,name:string)=>{if(compare(v,z)<0)throw new Error(`${name} must be nonnegative`);};
const lock=<T extends object>(result:T)=>Object.freeze({...EDITORIAL_REVIEW_LOCK,...result});
/** Exact squared result; never approximates an irrational speed as a Rational. */
export function solveOppositeBankCrossing(bodySpeed:Rational,currentSpeed:Rational){
 positive(bodySpeed,"bodySpeed");nonnegative(currentSpeed,"currentSpeed");
 const crossSpeedSquared=subtract(sq(bodySpeed),sq(currentSpeed));
 positive(crossSpeedSquared,"crossSpeedSquared");
 return lock({model:"oppositeBankCrossing",upstreamComponent:negate(currentSpeed),crossSpeedSquared});
}
/** T(2u)/T(u)=r. Return u²/c²; positive current and u>c are assumed. */
export function solveDoubledBoatTimeRatio(timeRatio:Rational){
 positive(timeRatio,"timeRatio");if(compare(timeRatio,rational(1,2))>=0)throw new Error("timeRatio must be below one-half for nonzero current");
 const bodyToCurrentSquared=divide(subtract(two,timeRatio),subtract(two,multiply(rational(4),timeRatio)));
 return lock({model:"doubledBoatTimeRatio",bodyToCurrentSquared});
}
export function solveApproachingSoundReceiver(soundSpeed:Rational,emissionInterval:Rational,arrivalInterval:Rational){
 positive(soundSpeed,"soundSpeed");positive(emissionInterval,"emissionInterval");positive(arrivalInterval,"arrivalInterval");
 if(compare(arrivalInterval,emissionInterval)>0)throw new Error("Receiver is not approaching");
 return lock({model:"approachingSoundReceiver",receiverSpeed:multiply(soundSpeed,subtract(divide(emissionInterval,arrivalInterval),one))});
}
/** Bird starts on A and alternately intercepts B/A; cars approach until collision. */
export function solveBirdIntercepts(input:{separation:Rational;speedA:Rational;speedB:Rational;birdSpeed:Rational;visits:number}){
 const {separation,speedA,speedB,birdSpeed,visits}=input;
 for(const [name,v]of Object.entries({separation,speedA,speedB,birdSpeed}))positive(v,name);
 if(compare(birdSpeed,speedA)<=0||compare(birdSpeed,speedB)<=0)throw new Error("Bird must be faster than both cars for repeated visits");
 if(!Number.isInteger(visits)||visits<1||visits>1000)throw new Error("visits must be1..1000");
 const relative=add(speedA,speedB),collisionTime=divide(separation,relative);
 let time=z;const events=[];
 for(let n=1;n<=visits;n++){
  const gap=subtract(separation,multiply(relative,time));
  const targetSpeed=n%2?speedB:speedA;
  time=add(time,divide(gap,add(birdSpeed,targetSpeed)));
  const point=n%2?subtract(separation,multiply(speedB,time)):multiply(speedA,time);
  events.push(Object.freeze({visit:n,target:n%2?"B":"A",time,point,birdDistance:multiply(birdSpeed,time)}));
 }
 return lock({model:"birdIntercepts",events:Object.freeze(events),collisionTime,totalBirdDistance:multiply(birdSpeed,collisionTime),idealizedVisitCount:"INFINITE" as const});
}
/** p·p,p·v,v·v permit exact dot products even when coordinates contain radicals. */
export function solveClosestApproach(input:{positionSquared:Rational;positionVelocityDot:Rational;velocitySquared:Rational;until?:Rational}){
 nonnegative(input.positionSquared,"positionSquared");positive(input.velocitySquared,"velocitySquared");
 if(compare(sq(input.positionVelocityDot),multiply(input.positionSquared,input.velocitySquared))>0)throw new Error("Invalid vector Gram matrix");
 if(input.until)nonnegative(input.until,"until");
 let time=divide(negate(input.positionVelocityDot),input.velocitySquared);
 if(compare(time,z)<0)time=z;
 if(input.until && compare(time,input.until)>0)time=input.until;
 const distanceSquared=add(add(input.positionSquared,multiply(multiply(two,time),input.positionVelocityDot)),multiply(sq(time),input.velocitySquared));
 return lock({model:"closestApproach",time,distanceSquared});
}
/** Coefficients in ascending powers. Sampled distance sums absolute speeds. */
export function solvePolynomialMotion(input:{coefficients:readonly Rational[];at:Rational;sampleSeconds:number}){
 if(!input.coefficients.length||input.coefficients.length>10)throw new Error("Require1..10coefficients");
 nonnegative(input.at,"at");
 if(!Number.isInteger(input.sampleSeconds)||input.sampleSeconds<0||input.sampleSeconds>10000)throw new Error("Invalid sampleSeconds");
 const evaluate=(at:Rational)=>input.coefficients.reduceRight((sum,c)=>add(multiply(sum,at),c),z);
 const derivative=input.coefficients.slice(1).map((c,i)=>multiply(c,rational(i+1)));
 const acceleration=derivative.reduceRight((sum,c)=>add(multiply(sum,input.at),c),z);
 let sampledDisplacement=z,sampledDistance=z;
 for(let t=0;t<input.sampleSeconds;t++){const speed=evaluate(rational(t));sampledDisplacement=add(sampledDisplacement,speed);sampledDistance=add(sampledDistance,compare(speed,z)<0?negate(speed):speed);}
 return lock({model:"polynomialMotion",speed:evaluate(input.at),acceleration,sampledDisplacement,sampledDistance});
}
/** Constant acceleration; braking stops at zero instead of reversing motion. */
export function solveConstantAcceleration(input:{initialSpeed:Rational;acceleration:Rational;time:Rational;stopAtZero?:boolean}){
 nonnegative(input.initialSpeed,"initialSpeed");nonnegative(input.time,"time");
 let movingTime=input.time;
 if(input.stopAtZero && compare(input.acceleration,z)<0){const stoppingTime=divide(input.initialSpeed,negate(input.acceleration));if(compare(stoppingTime,movingTime)<0)movingTime=stoppingTime;}
 const displacement=add(multiply(input.initialSpeed,movingTime),divide(multiply(input.acceleration,sq(movingTime)),two));
 return lock({model:"constantAcceleration",movingTime,displacement,finalSpeed:add(input.initialSpeed,multiply(input.acceleration,movingTime))});
}
/** Highway projection and off-highway speed yield exact optimal offset². */
export function solveHighwayTurn(input:{projectionDistance:Rational;perpendicularDistance:Rational;highwaySpeed:Rational;offRoadSpeed:Rational}){
 nonnegative(input.projectionDistance,"projectionDistance");positive(input.perpendicularDistance,"perpendicularDistance");positive(input.highwaySpeed,"highwaySpeed");positive(input.offRoadSpeed,"offRoadSpeed");
 if(compare(input.offRoadSpeed,input.highwaySpeed)>=0)return lock({model:"highwayTurn",turnAtStart:true,offsetSquared:sq(input.projectionDistance)});
 const ratioSquared=sq(divide(input.offRoadSpeed,input.highwaySpeed));
 const candidate=divide(multiply(sq(input.perpendicularDistance),ratioSquared),subtract(one,ratioSquared));
 const turnAtStart=compare(candidate,sq(input.projectionDistance))>=0;
 return lock({model:"highwayTurn",turnAtStart,offsetSquared:turnAtStart?sq(input.projectionDistance):candidate});
}
export function solveAcceleratedCatch(input:{initialLeaderSpeed:Rational;leaderAcceleration:Rational;chaserSpeed:Rational}){
 nonnegative(input.initialLeaderSpeed,"initialLeaderSpeed");positive(input.leaderAcceleration,"leaderAcceleration");positive(input.chaserSpeed,"chaserSpeed");
 const advantage=subtract(input.chaserSpeed,input.initialLeaderSpeed);positive(advantage,"initial chaser advantage");
 const time=divide(multiply(two,advantage),input.leaderAcceleration);
 return lock({model:"acceleratedCatch",time,position:multiply(input.chaserSpeed,time)});
}
/** TasteQ41: each half-speed/double-time stage covers1/4lap. */
export function solveGeometricLapTime(round:number){
 if(!Number.isInteger(round)||round<1||round>1000)throw new Error("round must be1..1000");
 // First stage lasts1/2minute; stages4n−4..4n−1 belong to lap n.
 const durationMinutes=rational(15n*(2n**BigInt(4*(round-1))),2n);
 return lock({model:"geometricLapTime",round,durationMinutes,previousRoundRatio:round>1?rational(16):null});
}
/** SourceIII43–44: A meets B, carries B back to P, then travels to Q. */
export function solveReturnLiftInverse(input:{route:Rational;driverTimeFactor:Rational;walkTimeSaved:Rational}){
 positive(input.route,"route");positive(input.walkTimeSaved,"walkTimeSaved");
 if(compare(input.driverTimeFactor,two)<=0||compare(input.driverTimeFactor,rational(3))>=0)throw new Error("Faster driver with positive walk saving requires factor between2and3");
 const meetingPoint=multiply(input.route,divide(subtract(input.driverTimeFactor,one),two));
 const speedRatio=divide(meetingPoint,subtract(input.route,meetingPoint));
 const walkerSpeed=divide(multiply(meetingPoint,subtract(one,divide(one,speedRatio))),input.walkTimeSaved);
 return lock({model:"returnLiftInverse",meetingPoint,speedRatio,walkerSpeed,driverSpeed:multiply(speedRatio,walkerSpeed)});
}
/** SourceIII45: equal walkers; drop B, return to collect C, take C to Q. */
export function solveSharedRideDropPickup(input:{route:Rational;dropPoint:Rational;driverSpeed:Rational;walkSpeed:Rational}){
 positive(input.route,"route");positive(input.dropPoint,"dropPoint");positive(input.driverSpeed,"driverSpeed");positive(input.walkSpeed,"walkSpeed");
 if(compare(input.dropPoint,input.route)>=0||compare(input.driverSpeed,input.walkSpeed)<=0)throw new Error("Invalid pickup/dropoff route");
 const dropTime=divide(input.dropPoint,input.driverSpeed),cAtDrop=multiply(input.walkSpeed,dropTime);
 const returnDuration=divide(subtract(input.dropPoint,cAtDrop),add(input.driverSpeed,input.walkSpeed));
 const pickupTime=add(dropTime,returnDuration),pickupPoint=multiply(input.walkSpeed,pickupTime);
 const driverArrival=add(pickupTime,divide(subtract(input.route,pickupPoint),input.driverSpeed));
 const bArrival=add(dropTime,divide(subtract(input.route,input.dropPoint),input.walkSpeed));
 const firstArrival=compare(driverArrival,bArrival)<0?driverArrival:bArrival;
 const bPosition=compare(firstArrival,bArrival)>=0?input.route:add(input.dropPoint,multiply(input.walkSpeed,subtract(firstArrival,dropTime)));
 const cPosition=compare(firstArrival,driverArrival)>=0?input.route:add(pickupPoint,multiply(input.driverSpeed,subtract(firstArrival,pickupTime)));
 return lock({model:"sharedRideDropPickup",dropTime,pickupTime,pickupPoint,driverArrival,bArrival,firstArrival,bPosition,cPosition});
}
