import assert from "node:assert/strict";
import { SCI_CP015_REVIEW_V1, validateSciCp015ReviewV1 } from "./sci-cp015-review-v1";

const result=validateSciCp015ReviewV1();
assert.equal(result.valid,true,result.errors.join("; "));
assert.equal(SCI_CP015_REVIEW_V1.length,60);
assert.deepEqual(result.difficultyCounts,{Easy:18,Medium:30,Hard:12});
assert.deepEqual(result.answerPositionCounts,{A:15,B:15,C:15,D:15});
assert.equal(new Set(SCI_CP015_REVIEW_V1.map(q=>q.stem)).size,60);
for(let ql=1;ql<=10;ql++)assert.equal(result.qlCounts[`SCI-015-QL-${String(ql).padStart(3,"0")}`],6);
assert.ok(SCI_CP015_REVIEW_V1.every(q=>q.reviewOnly&&!q.runtimeRegistered));

const answers=new Set(SCI_CP015_REVIEW_V1.map(q=>q.canonicalAnswer.toLowerCase()));
assert.ok(SCI_CP015_REVIEW_V1.some(q=>q.stem.includes("strong acid")));
assert.ok(SCI_CP015_REVIEW_V1.some(q=>q.stem.includes("strength")&&q.stem.includes("concentration")));
assert.ok(answers.has("sodium chloride"),"neutral salt example missing");
assert.ok(answers.has("ammonium chloride"),"acidic salt example missing");
assert.ok(answers.has("sodium carbonate"),"basic salt example missing");
assert.ok(answers.has("chlorine gas"),"chlor-alkali anode product missing");
assert.ok(answers.has("hydrogen gas"),"chlor-alkali cathode product missing");
assert.ok(answers.has("sodium hydroxide"),"chlor-alkali solution product missing");
assert.ok(SCI_CP015_REVIEW_V1.some(q=>q.canonicalAnswer==="concentrated aqueous sodium chloride"),"brine definition missing");
assert.ok(answers.has("sodium hydrogen carbonate"),"baking soda missing");
assert.ok(answers.has("sodium carbonate decahydrate"),"washing soda missing");
assert.ok(answers.has("CaOCl₂".toLowerCase()),"bleaching powder missing");
assert.ok(answers.has("CaSO₄·2H₂O".toLowerCase()),"gypsum missing");
assert.ok(answers.has("gypsum"),"POP hydration relation missing");
