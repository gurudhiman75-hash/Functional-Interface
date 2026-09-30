import assert from"node:assert/strict";
import{languageV1QuestionStudioAdapter}from"./language-v1-adapter";
import{ENG012_QUESTION_STUDIO_PACKAGE_ID_V1,languageV1Eng012QuestionStudioAdapterV1}from"./language-v1-eng012-adapter-v1";

const base={packageId:ENG012_QUESTION_STUDIO_PACKAGE_ID_V1,subject:"English",topic:"Word Swap",language:"en" as const,runtimeMode:"review-only"};
const pkg=languageV1QuestionStudioAdapter.listPackages().find(x=>x.packageId===ENG012_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(pkg);
assert.deepEqual(pkg.cpIds,["ENG-012-CP001","ENG-012-CP002","ENG-012-CP003","ENG-012-CP004","ENG-012-CP005"]);
assert.equal((pkg.metadata as any)?.authorityPatterns,450);
assert.equal((pkg.metadata as any)?.generatedSurfaces,1350);
assert.equal((pkg.metadata as any)?.humanApprovalPending,false);
assert.equal((pkg.metadata as any)?.registrationAuthorityId,"ENG-012-PRODUCTION-450-HUMAN-APPROVED-V1");
assert.equal(pkg.questionBankWritable,false);
assert.equal(pkg.testEligible,false);
assert.equal(pkg.mockTestEligible,false);
assert.equal(pkg.publiclyPublishable,false);
assert.equal(pkg.productionReleaseAuthorized,false);

for(const cp of["ENG-012-CP001","ENG-012-CP002","ENG-012-CP003","ENG-012-CP004"]as const){
 const r=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:cp,count:4,seed:`studio:${cp}`});
 assert.equal(r.questions.length,4);
 for(const q of r.questions){
  assert.equal(q.cpId,cp);
  assert.equal(q.reviewOnly,true);
  assert.equal(q.humanReviewApproved,true);
  assert.equal(q.authoringReviewApproved,true);
  assert.equal(q.productionReleased,false);
  assert.equal((q.options as unknown[]).length,4);
 }
}
const profiles=[
 ["ssc-standard","ENG-012-CP001"],
 ["ssc-advanced","ENG-012-CP002"],
 ["banking-prelims","ENG-012-CP003"],
 ["banking-mains","ENG-012-CP004"]
]as const;
for(const [profile,sourceCpId] of profiles){
 const r=await languageV1QuestionStudioAdapter.generate({...base,canonicalProblemId:"ENG-012-CP005",subtopic:profile,count:4,seed:`composer:${profile}`});
 assert.equal(r.questions.length,4);
 for(const q of r.questions){
  assert.equal(q.cpId,"ENG-012-CP005");
  assert.equal(q.sourceCpId,sourceCpId);
  assert.equal(q.composerProfile,profile);
  assert.equal(q.humanReviewApproved,true);
  assert.equal(q.productionReleased,false);
 }
 assert.equal(r.generationContext.humanReviewApproved,true);
}
await assert.rejects(()=>languageV1Eng012QuestionStudioAdapterV1.generate({...base,language:"hi",count:1}),/English only/i);
await assert.rejects(()=>languageV1Eng012QuestionStudioAdapterV1.generate({...base,runtimeMode:"production",count:1}),/review-only/i);
console.log("ENG-012 Question Studio integration audit passed.");
