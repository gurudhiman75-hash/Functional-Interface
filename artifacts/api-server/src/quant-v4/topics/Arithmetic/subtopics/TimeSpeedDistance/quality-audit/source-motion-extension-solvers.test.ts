import assert from "node:assert/strict";
import { rational as r,equals,multiply,add,subtract,divide,type Rational } from "../TSD-001/foundation/rational";
import * as solve from "./source-motion-extension-solvers";
import { EDITORIAL_REVIEW_LOCK } from "./worked-calculation";
const eq=(a:Rational,b:Rational)=>assert.ok(equals(a,b));
const sq=(a:Rational)=>multiply(a,a);
const crossing=solve.solveOppositeBankCrossing(r(20),r(6));eq(crossing.crossSpeedSquared,r(364));eq(add(crossing.upstreamComponent,r(6)),r(0));eq(add(crossing.crossSpeedSquared,sq(crossing.upstreamComponent)),r(400));
eq(solve.solveDoubledBoatTimeRatio(r(1,4)).bodyToCurrentSquared,r(7,4));
eq(solve.solveDoubledBoatTimeRatio(r(1,5)).bodyToCurrentSquared,r(3,2)); //LODIII46
const sound=solve.solveApproachingSoundReceiver(r(330),r(720),r(690));eq(sound.receiverSpeed,r(330,23));eq(multiply(add(r(330),sound.receiverSpeed),r(690)),multiply(r(330),r(720)));
const bird=solve.solveBirdIntercepts({separation:r(12),speedA:r(60),speedB:r(60),birdSpeed:r(120),visits:9});
eq(bird.collisionTime,r(1,10));eq(bird.totalBirdDistance,r(12));eq(bird.events[2]!.birdDistance,r(104,9));
for(let i=0;i<bird.events.length;i++){
 const event=bird.events[i]!;eq(event.point,event.target==="A"?multiply(r(60),event.time):subtract(r(12),multiply(r(60),event.time)));
 const last=i?bird.events[i-1]!:null;const displacement=subtract(event.point,last?.point??r(0));
 eq(sq(displacement),sq(multiply(r(120),subtract(event.time,last?.time??r(0)))));
}
assert.equal(bird.idealizedVisitCount,"INFINITE");
eq(solve.solveClosestApproach({positionSquared:r(40000),positionVelocityDot:r(-8000),velocitySquared:r(2000),until:r(5)}).time,r(4)); //III17
eq(solve.solveClosestApproach({positionSquared:r(28224),positionVelocityDot:r(-12600),velocitySquared:r(6300),until:r(14,5)}).time,r(2)); //III15
// Endpoint clamping and initially separating trajectories are materially different states.
eq(solve.solveClosestApproach({positionSquared:r(100),positionVelocityDot:r(-10),velocitySquared:r(1),until:r(3)}).time,r(3));
eq(solve.solveClosestApproach({positionSquared:r(100),positionVelocityDot:r(10),velocitySquared:r(1)}).time,r(0));
const polynomial=solve.solvePolynomialMotion({coefficients:[r(4),r(-5),r(1)],at:r(6),sampleSeconds:7});eq(polynomial.speed,r(10));eq(polynomial.acceleration,r(7));eq(polynomial.sampledDisplacement,r(14));eq(polynomial.sampledDistance,r(22));
const robot=solve.solvePolynomialMotion({coefficients:[r(3),r(2),r(-1)],at:r(2),sampleSeconds:6});eq(robot.acceleration,r(-2));eq(robot.sampledDisplacement,r(-7));eq(robot.sampledDistance,r(27));
//III14: both ships brake at0.1m/s², stop atzero;20m/s exactly reaches collision.
const braking=solve.solveConstantAcceleration({initialSpeed:r(20),acceleration:r(-1,10),time:r(240),stopAtZero:true});eq(braking.movingTime,r(200));eq(braking.finalSpeed,r(0));eq(multiply(r(2),braking.displacement),r(4000));
eq(solve.solveConstantAcceleration({initialSpeed:r(19),acceleration:r(-1,10),time:r(240),stopAtZero:true}).displacement,r(1805));
//III18:120km at20km/h then120km in2h with acceleration40km/h².
eq(solve.solveConstantAcceleration({initialSpeed:r(20),acceleration:r(40),time:r(2)}).displacement,r(120));eq(add(divide(r(120),r(20)),r(2)),r(8));
//III19: perpendicular16, projection30, highway10/offroad6 =>offset12, turn18.
const highway=solve.solveHighwayTurn({projectionDistance:r(30),perpendicularDistance:r(16),highwaySpeed:r(10),offRoadSpeed:r(6)});eq(highway.offsetSquared,r(144));assert.equal(highway.turnAtStart,false);eq(divide(r(12),r(20)),r(6,10));
const catchState=solve.solveAcceleratedCatch({initialLeaderSpeed:r(5),leaderAcceleration:r(4),chaserSpeed:r(9)});eq(catchState.time,r(2));eq(catchState.position,r(18));
eq(solve.solveConstantAcceleration({initialSpeed:r(5),acceleration:r(4),time:catchState.time}).displacement,catchState.position);
for(let n=2;n<=12;n++)eq(divide(solve.solveGeometricLapTime(n).durationMinutes,solve.solveGeometricLapTime(n-1).durationMinutes),r(16));
const lift=solve.solveReturnLiftInverse({route:r(200),driverTimeFactor:r(13,5),walkTimeSaved:r(2,3)});eq(lift.speedRatio,r(4));eq(lift.walkerSpeed,r(180));eq(lift.driverSpeed,r(720));
eq(add(divide(r(200),lift.driverSpeed),divide(multiply(r(2),lift.meetingPoint),lift.driverSpeed)),multiply(r(13,5),divide(r(200),lift.driverSpeed)));
eq(subtract(divide(r(200),lift.walkerSpeed),add(divide(subtract(r(200),lift.meetingPoint),lift.walkerSpeed),divide(lift.meetingPoint,lift.driverSpeed))),r(2,3));
const pickup=solve.solveSharedRideDropPickup({route:r(100),dropPoint:r(50),driverSpeed:r(5),walkSpeed:r(2)});eq(pickup.pickupPoint,r(200,7));eq(subtract(r(100),pickup.bPosition),r(90,7));eq(pickup.cPosition,r(100));
eq(multiply(r(2),pickup.pickupTime),pickup.pickupPoint);eq(subtract(r(50),multiply(r(5),subtract(pickup.pickupTime,pickup.dropTime))),pickup.pickupPoint);
for(const result of [crossing,sound,bird,lift,pickup,polynomial,robot])for(const[key,value]of Object.entries(EDITORIAL_REVIEW_LOCK))assert.equal((result as Record<string,unknown>)[key],value);
assert.throws(()=>solve.solveOppositeBankCrossing(r(5),r(8)));assert.throws(()=>solve.solveDoubledBoatTimeRatio(r(1,2)));assert.throws(()=>solve.solveClosestApproach({positionSquared:r(1),positionVelocityDot:r(2),velocitySquared:r(1)}));
console.log("PASS:12 separate locked source-motion models; exact vector/radical, sound, bird limits, closest approach, braking/acceleration, highway optimum, polynomial distance, lap recurrence and rider membership reconstructed.");
