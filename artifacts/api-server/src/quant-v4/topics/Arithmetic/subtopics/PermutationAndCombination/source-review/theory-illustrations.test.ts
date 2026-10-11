import assert from 'node:assert/strict';
import {primeExponentInFactorial,theoryIllustrations} from './theory-illustrations';
const expected=['3','6','60','7560','81','1','4060','6','249','10','14','36','720','3600','48','223'];
for(const [i,c]of theoryIllustrations.entries())assert.equal(c.answer,expected[i],c.id);
for(let n=0;n<=60;n++)for(const p of [2,3,5,7,11]){let e=0;for(let k=1;k<=n;k++){let v=k;while(v%p===0){v/=p;e++;}}assert.equal(primeExponentInFactorial(n,p),e);}
assert.throws(()=>primeExponentInFactorial(20,4));assert.throws(()=>primeExponentInFactorial(-1,5));
console.log(JSON.stringify({status:'PASS',theoryAndInlineTasks:16,valuationCases:305}));
