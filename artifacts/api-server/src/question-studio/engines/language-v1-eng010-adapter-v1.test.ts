import assert from"node:assert/strict";
import{languageV1QuestionStudioAdapter}from"./language-v1-adapter";
import{ENG010_QUESTION_STUDIO_PACKAGE_ID_V1,languageV1Eng010QuestionStudioAdapterV1}from"./language-v1-eng010-adapter-v1";
const base={packageId:ENG010_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Para Jumbles",language:"en" as const,runtimeMode:"review-only"};
const pkg=languageV1QuestionStudioAdapter.listPackages().find(x=>x.packageId===ENG010_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(pkg);
assert.deepEqual(pkg.cpIds,["ENG-010-CP001","ENG-010-CP002","ENG-010-CP003","ENG-010-CP004","ENG-010-CP005"]);\nassert.equal((pkg.metadata as any)?.authoritySets,450);
assert.equal(pkg.questionBankWritable,false);assert.equal(pkg.testEligible,false);assert.equal(pkg.mockTestEligible,false);assert.equal(pkg.publiclyPublishable,false);
for(const cp of["ENG-010-CP001","ENG-010-CP002","ENG-010-CP003","ENG-010-CP004"]as const){
 const r=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:cp,count:4,seed:`studio:${cp}`});
 assert.equal(r.questions.length,4);
 for(const q of r.questions){assert.equal(q.cpId,cp);assert.equal(q.reviewOnly,true);assert.equal((q.options as unknown[]).length,4);assert.ok(Array.isArray(q.sentences));}
}
const c=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:"ENG-010-CP005",subtopic:"banking-mains",count:4,seed:"studio:composer"});
assert.equal(c.questions.length,4);for(const q of c.questions){assert.equal(q.cpId,"ENG-010-CP005");assert.equal(q.sourceCpId,"ENG-010-CP004");assert.equal(q.composerProfile,"banking-mains");}
await assert.rejects(()=>languageV1Eng010QuestionStudioAdapterV1.generate({...base,language:"hi",count:1}),/English only/i);
await assert.rejects(()=>languageV1Eng010QuestionStudioAdapterV1.generate({...base,runtimeMode:"production",count:1}),/review-only/i);
console.log("ENG-010 Question Studio integration audit passed.");
