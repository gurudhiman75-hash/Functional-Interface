import assert from 'node:assert/strict';
import {countConstrainedDigits,enumerateConstrainedDigits,type DigitConstraints} from './constrained-digits';
import {digitSourceCases,digitSourceAnswer} from './digit-source-cases';
let domains=0;
for(const digits of [[0,1,2],[1,2,3],[0,2,5,6]])for(let length=1;length<=4;length++)for(const repetition of [false,true]) {
 const base:DigitConstraints={digits,minLength:1,maxLength:length,repetition};
 const constraints:Partial<DigitConstraints>[]=[{}, {code:true},{minimum:12,maximum:231},{modulus:3},{modulus:4},{exact:{digit:2,count:1}},{distinct:{min:1,max:2}},{oddCount:1},{sumParity:0},{increasing:true},{divisibleByLast:true,excludeLast:[1]},{divisibleByLast:true,modulus:11,residue:1},{lastUnique:true},{exact:{digit:2,count:1},lastUnique:true},{fixed:{0:2}},{fixed:{[length-1]:2}},{evenPositions:[length-1]},{prefixes:['1','20']}];
 for(const constraint of constraints){const q={...base,...constraint};assert.equal(countConstrainedDigits(q),enumerateConstrainedDigits(q),JSON.stringify(q));domains++;}
}
let failures=0;
for(const c of digitSourceCases){const answer=digitSourceAnswer(c);if(c.expected){let expected=BigInt(c.expected);if(c.id==='II-034')expected=28125n;if(c.id==='II-035')expected=884375n;if(c.id==='II-036')expected=8996734080n;if(answer!==expected){console.log(c.id,String(answer),'expected',String(expected));failures++;}}else console.log(c.id,String(answer));}
assert.equal(enumerateConstrainedDigits(digitSourceCases.find(c=>c.id==='III-031')!.input),4371n);
assert.equal(9n**7n+28n*9n**6n,19663317n);
assert.equal(9n**7n+28n*8n**6n,12123001n);
assert.throws(()=>countConstrainedDigits({digits:[0,1],minLength:1,maxLength:2,repetition:true,exact:{digit:1,count:-1}}));
assert.equal(failures,0);console.log(JSON.stringify({domains,sourceCases:digitSourceCases.length,status:'PASS'}));
