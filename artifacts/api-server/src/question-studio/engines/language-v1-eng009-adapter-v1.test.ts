import assert from"node:assert/strict";
import{ENG009_CP006_PROFILES,generateEng009Cp006SetV1,generateEng009Cp006MixedSetsV1}from"../../english-v1/chapters/cloze-test/ENG-009/CP006/eng-009-cp006-composer-v1";
import{ENG009_QUESTION_STUDIO_PACKAGE_ID_V1,languageV1Eng009QuestionStudioAdapterV1}from"./language-v1-eng009-adapter-v1";
import{languageV1QuestionStudioAdapter}from"./language-v1-adapter";

assert.deepEqual(ENG009_CP006_PROFILES,["ssc-standard","ssc-advanced","banking-prelims","banking-mains","banking-new-pattern"]);
for(const profile of ENG009_CP006_PROFILES){
 const a=generateEng009Cp006SetV1(`profile:${profile}`,profile);
 const z=generateEng009Cp006SetV1(`profile:${profile}`,profile);
 assert.deepEqual(a,z);
 assert.equal(a.profile,profile);
 assert.ok(a.questions.length===5||a.questions.length===6);
 assert.equal(new Set(a.questions.map((q:any)=>q.passage)).size,1);
 assert.equal(new Set(a.questions.map((q:any)=>q.metadata.blankNo)).size,a.questions.length);
}
const mixed=generateEng009Cp006MixedSetsV1("mixed-audit",20);
assert.equal(mixed.length,20);
assert.ok(new Set(mixed.map(x=>x.profile)).size>=3);

const pkg=languageV1QuestionStudioAdapter.listPackages().find(x=>x.packageId===ENG009_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(pkg);
assert.deepEqual(pkg.cpIds,["ENG-009-CP001","ENG-009-CP002","ENG-009-CP003","ENG-009-CP004","ENG-009-CP005","ENG-009-CP006"]);
assert.equal(pkg.questionBankWritable,false);
assert.equal(pkg.testEligible,false);
assert.equal(pkg.mockTestEligible,false);
assert.equal(pkg.publiclyPublishable,false);
assert.equal(pkg.productionReleaseAuthorized,false);

const base={packageId:ENG009_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Cloze Test",language:"en" as const,runtimeMode:"review-only"};
for(const cp of["ENG-009-CP001","ENG-009-CP002","ENG-009-CP003","ENG-009-CP004","ENG-009-CP005"]as const){
 const r=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:cp,count:4,seed:`studio:${cp}`});
 assert.equal(r.questions.length,4);
 for(const q of r.questions){
  assert.equal(q.cpId,cp);assert.equal(q.reviewOnly,true);assert.equal(q.questionBankWritable,false);
  assert.ok(String(q.passage).includes("____("));assert.equal((q.options as unknown[]).length,4);assert.ok(String(q.explanation).length>10);
 }
}
const ssc=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:"ENG-009-CP006",subtopic:"ssc-standard",count:2,seed:"composer:ssc"});
assert.equal(ssc.questions.length,10);
assert.equal(new Set(ssc.questions.map(q=>q.setId)).size,2);
assert.ok(ssc.questions.every(q=>q.sourceCpId==="ENG-009-CP001"));
assert.ok(ssc.questions.every(q=>q.humanReviewApproved===false));

const mains=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:"ENG-009-CP006",subtopic:"banking-mains",count:2,seed:"composer:mains"});
assert.equal(mains.questions.length,12);
assert.equal(new Set(mains.questions.map(q=>q.setId)).size,2);
assert.ok(mains.questions.every(q=>q.sourceCpId==="ENG-009-CP004"));

await assert.rejects(()=>languageV1Eng009QuestionStudioAdapterV1.generate({...base,language:"hi",count:1}),/English only/i);
await assert.rejects(()=>languageV1Eng009QuestionStudioAdapterV1.generate({...base,runtimeMode:"production",count:1}),/review-only/i);
await assert.rejects(()=>languageV1Eng009QuestionStudioAdapterV1.generate({...base,canonicalProblemId:"ENG-009-CP002",difficulty:"Easy",count:1}),/medium\/hard/i);

console.log("ENG-009 CP006 composer + Question Studio integration audit passed.");
