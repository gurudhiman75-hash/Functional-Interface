import {strict as assert} from "node:assert";
import {solveBoundedScore,verifyBoundedScore,buildBoundedScoreReview} from "./bounded-score-counting";
let cases=0;
for(const capacities of [[2,3],[2,3,4],[1,2,3,4]])for(let target=0;target<=capacities.reduce((a,b)=>a+b,0);target++)for(const condition of ["exactly","atLeast"]as const){const p={capacities,target,condition};assert.equal(solveBoundedScore(p).answer,verifyBoundedScore(p));const review=buildBoundedScoreReview(p);const terms=review.explanation.filter(line=>/^[+−] C/.test(line));assert.equal(terms.reduce((sum,line)=>sum+Number(line.split(" = ")[1]),0),solveBoundedScore(p).answer);cases++;}
const p={capacities:[50,50,50,100],target:150,condition:"exactly"as const};assert.equal(solveBoundedScore(p).answer,110551);assert.equal(verifyBoundedScore(p),110551);
const q={capacities:[45,45,45,45],target:90,condition:"exactly"as const};assert.equal(solveBoundedScore(q).answer,64906);assert.equal(verifyBoundedScore(q),64906);
const qualified={...q,condition:"atLeast"as const};assert.equal(solveBoundedScore(qualified).answer,verifyBoundedScore(qualified));assert(solveBoundedScore(qualified).answer>64906);
assert.equal(buildBoundedScoreReview(q).publiclyPublishable,false);
console.log(JSON.stringify({status:"PASS",domainCases:cases,source13:110551,source50Exactly:64906,source50AtLeast:solveBoundedScore(qualified).answer}));
