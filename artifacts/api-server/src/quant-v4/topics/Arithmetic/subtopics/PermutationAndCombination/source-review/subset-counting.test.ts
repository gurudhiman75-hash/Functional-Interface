import {strict as assert} from "node:assert";
import {mkdirSync,writeFileSync} from "node:fs";
import {solveSubset,verifySubset,buildSubsetReview,type SubsetInput} from "./subset-counting";
const examples: {source:string;input:SubsetInput;answer:number}[]=[
 {source:"LODI-031",input:{mode:"atMostDistinct",counts:[15],maximumSelected:5,includeEmpty:true},answer:4944},
 {source:"LODI-051",input:{mode:"boundedIdentical",counts:[5,4,4]},answer:149},
 {source:"LODI-052",input:{mode:"nonemptyDistinct",counts:[5,3,6]},answer:16383},
 {source:"LODI-053",input:{mode:"eachDistinctCategory",counts:[5,3,6]},answer:13671},
 {source:"LODI-054",input:{mode:"optionalQuestions",counts:[15,2]},answer:14348906}
];
for(const e of examples){assert.equal(solveSubset(e.input).answer,e.answer);assert.equal(verifySubset(e.input),e.answer);}
let checked=0;
for(let n=2;n<=8;n++) for(const input of [
 {mode:"nonemptyDistinct",counts:[n]},
 {mode:"eachDistinctCategory",counts:[n,2]},
 {mode:"boundedIdentical",counts:[n,2,3]},
 {mode:"optionalQuestions",counts:[n,2]},
 {mode:"atMostDistinct",counts:[n],maximumSelected:2,includeEmpty:true},
 {mode:"atMostDistinct",counts:[n],maximumSelected:2,includeEmpty:false}
] as SubsetInput[]) {assert.equal(solveSubset(input).answer,verifySubset(input));const q=buildSubsetReview(input);assert.equal(q.options[q.correctIndex],q.answer);assert.equal(new Set(q.options).size,4);assert.equal(q.publiclyPublishable,false);checked++;}
assert.equal(solveSubset({mode:"atMostDistinct",counts:[15],maximumSelected:5,includeEmpty:false}).answer,4943);
assert.throws(()=>solveSubset({mode:"atMostDistinct",counts:[5],maximumSelected:6}));
assert.throws(()=>solveSubset({mode:"nonemptyDistinct",counts:[0]}));
const out=process.argv[2]??"dist/pnc-source-subset-review";mkdirSync(out,{recursive:true});
writeFileSync(`${out}/subset-review.json`,JSON.stringify({status:"PASS",checked,sourceCases:examples.map(e=>({...e,review:buildSubsetReview(e.input)}))},null,2)+"\n");
console.log(JSON.stringify({status:"PASS",checked,sourceCases:examples.length}));
