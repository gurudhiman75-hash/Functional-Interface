import {strict as assert} from "node:assert";
import {solveExactDigit,verifyExactDigit,buildExactDigitReview,type ExactDigitInput} from "./exact-digit-counting";
let cases=0;
for(const digits of [[0,1,2],[1,2,3],[0,1,2,3]])for(let length=2;length<=4;length++)for(const specified of digits)for(let occurrences=1;occurrences<=length;occurrences++) {
 const p={digits,length,specified,occurrences,repetition:true};assert.equal(solveExactDigit(p).answer,verifyExactDigit(p));cases++;
 if(occurrences===1&&length<=digits.length){const q={...p,repetition:false};assert.equal(solveExactDigit(q).answer,verifyExactDigit(q));cases++;}
}
const examples:[ExactDigitInput,number][]=[
 [{digits:[1,2,3,4,5,6,7,8],length:4,specified:1,occurrences:1,repetition:true},1372],
 [{digits:[1,2,3],length:7,specified:3,occurrences:2,repetition:true},672],
 [{digits:[1,2,3,4,5,6,7,8],length:4,specified:2,occurrences:1,repetition:false},840]
];
for(const [p,expected]of examples){assert.equal(solveExactDigit(p).answer,expected);assert.equal(verifyExactDigit(p),expected);assert.equal(buildExactDigitReview(p).publiclyPublishable,false);}
assert.throws(()=>solveExactDigit({digits:[1,1],length:2,specified:1,occurrences:1,repetition:true}));
console.log(JSON.stringify({status:"PASS",domainCases:cases,sourceCases:3}));
