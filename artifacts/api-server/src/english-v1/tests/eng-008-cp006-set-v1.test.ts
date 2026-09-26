import assert from"node:assert/strict";
import{ENG008_CP006_SET_PROFILES_V1,generateEng008Cp006SetV1}from"../chapters/reading-comprehension/ENG-008/CP006/eng-008-cp006-set-v1";

const expected={SSC_FOUNDATION_RC:6,SSC_EDITORIAL_CURRENT_AFFAIRS_RC:8,BANKING_PRELIMS_RC:9,BANKING_MAINS_RC:8,RESEARCH_SURVEY_REPORT_RC:8}as const;
for(const profile of ENG008_CP006_SET_PROFILES_V1){
 const a=generateEng008Cp006SetV1({seed:`audit:${profile}`,profile});
 const b=generateEng008Cp006SetV1({seed:`audit:${profile}`,profile});
 assert.deepEqual(a,b,`${profile} deterministic replay`);
 assert.equal(a.questionCount,expected[profile]);
 assert.equal(new Set(a.questions.map(q=>q.metadata.passageId)).size,1);
 assert.equal(new Set(a.questions.map(q=>q.metadata.familyId)).size,a.questions.length);
 assert.ok(a.passage.length>500);
 assert.equal(a.reviewOnly,true);
 for(const q of a.questions){assert.equal(q.metadata.passageId,a.passageId);assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);assert.equal(q.metadata.reviewOnly,true);}
}
assert.equal(generateEng008Cp006SetV1({seed:"ssc5",profile:"SSC_FOUNDATION_RC",questionCount:5}).questionCount,5);
assert.equal(generateEng008Cp006SetV1({seed:"ed6",profile:"SSC_EDITORIAL_CURRENT_AFFAIRS_RC",questionCount:6}).questionCount,6);
assert.equal(generateEng008Cp006SetV1({seed:"bp8",profile:"BANKING_PRELIMS_RC",questionCount:8}).questionCount,8);
const bp10=generateEng008Cp006SetV1({seed:"bp10",profile:"BANKING_PRELIMS_RC",questionCount:10});assert.equal(bp10.questionCount,10);assert.equal(new Set(bp10.questions.map(q=>q.metadata.familyId)).size,10);assert.ok(bp10.questions.some(q=>q.metadata.familyId==="BP-F10"));assert.ok(bp10.passage.includes("_____"));assert.equal(new Set(bp10.questions.map(q=>q.metadata.passageId)).size,1);
assert.equal(generateEng008Cp006SetV1({seed:"bm10",profile:"BANKING_MAINS_RC",questionCount:10}).questionCount,10);
assert.equal(generateEng008Cp006SetV1({seed:"rs6",profile:"RESEARCH_SURVEY_REPORT_RC",questionCount:6}).questionCount,6);

for(const profile of ENG008_CP006_SET_PROFILES_V1)for(let i=0;i<500;i++){const s=generateEng008Cp006SetV1({seed:`soak:${profile}:${i}`,profile});assert.equal(new Set(s.questions.map(q=>q.metadata.passageId)).size,1);}
console.log("ENG-008 CP006 full passage-set audit passed.",{profiles:5,soak:2500});