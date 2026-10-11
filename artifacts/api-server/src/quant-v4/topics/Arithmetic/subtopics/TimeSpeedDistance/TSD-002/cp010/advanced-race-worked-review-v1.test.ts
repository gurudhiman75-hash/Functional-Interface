import assert from "node:assert/strict";
import { TSD_CP010_ADVANCED_RACE_WORKED_REVIEW_V1 as rows } from "./advanced-race-worked-review-v1";
import { add,subtract,multiply,divide,type Rational } from "../../TSD-001/foundation/rational";
function eq(a:Rational,b:Rational){assert.equal(a.numerator*b.denominator,b.numerator*a.denominator);}
assert.equal(rows.length,72);
for(const row of rows){
 const i=row.input,a=row.computedAnswer;
 if(i.authorityKey==="transitiveRaceComparison")eq(multiply(subtract(i.raceDistance,a),i.raceDistance),multiply(subtract(i.raceDistance,i.aBeatsBBy),subtract(i.raceDistance,i.bBeatsCBy)));
 else if(i.authorityKey==="multiOutcomeRaceComparison")eq(multiply(subtract(subtract(i.secondRaceDistance,a),i.secondRaceHeadStartForLoser),i.firstRaceDistance),multiply(subtract(i.firstRaceDistance,i.firstRaceLead),i.secondRaceDistance));
 else if(i.authorityKey==="changedRaceOutcomeState"){
  const fast=i.mode==="FASTER_SPEED_CHANGE"?i.changedFasterSpeed!:i.fasterSpeed;
  const time=divide(i.raceDistance,fast);
  const elapsed=i.mode==="SLOWER_REST"?subtract(time,i.slowerRestTime!):i.mode==="FASTER_START_DELAY"?add(time,i.fasterStartDelay!):time;
  eq(divide(subtract(i.raceDistance,a),i.slowerSpeed),elapsed);
 }else if(i.authorityKey==="runnerStateFromTwoRaceOutcomes"){
  const ratio=divide(subtract(i.firstRaceDistance,i.firstRaceDistanceLead),i.firstRaceDistance);
  const fast=i.target==="FASTER_SPEED"?a:divide(a,ratio),slow=i.target==="SLOWER_SPEED"?a:multiply(a,ratio);
  eq(subtract(divide(i.secondRaceDistance,slow),divide(i.secondRaceDistance,fast)),i.secondRaceTimeLead);
  eq(multiply(slow,divide(i.firstRaceDistance,fast)),subtract(i.firstRaceDistance,i.firstRaceDistanceLead));
 }else throw new Error("Wrong authority");
 for(const flag of [row.contentApproved,row.frozen,row.registered,row.persistence,row.bank,row.test,row.mock,row.public])assert.equal(flag,false);
}
console.log("PASS: 72 advanced race candidates; independent position and two-race identities.");
