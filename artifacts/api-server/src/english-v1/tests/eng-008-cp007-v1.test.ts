import assert from"node:assert/strict";
import{ENG008_CP007_AUTHORITIES_V1,eng008Cp007MaskedPassageV1}from"../chapters/reading-comprehension/ENG-008/CP007/eng-008-cp007-authorities-v1";
import{generateEng008Cp007QuestionV1}from"../chapters/reading-comprehension/ENG-008/CP007/eng-008-cp007-v1";
assert.equal(ENG008_CP007_AUTHORITIES_V1.length,46);assert.equal(new Set(ENG008_CP007_AUTHORITIES_V1.map(x=>x.passageId)).size,46);
for(const a of ENG008_CP007_AUTHORITIES_V1){const p=eng008Cp007MaskedPassageV1(a);assert.ok(p.includes("_____"));assert.ok(!p.includes(a.evidence));const q=generateEng008Cp007QuestionV1({seed:`audit:${a.id}`,authorityId:a.id});assert.equal(q.metadata.familyId,"BP-F10");assert.equal(q.options[q.correctOptionIndex],a.correctAnswer);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);assert.equal(q.metadata.reviewOnly,true);}
for(let i=0;i<1600;i++){const q=generateEng008Cp007QuestionV1({seed:`soak:${i}`});assert.equal(q.options.length,4);assert.ok(q.passage.includes("_____"));}
console.log("ENG-008 CP007 Banking Prelims word-fit audit passed.",{authorities:46,soak:1600});