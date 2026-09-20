import assert from "node:assert/strict";
import { ENG004_HUMAN_EDITORIAL_APPROVAL_V1 } from "../../english-v1/chapters/synonyms-antonyms/ENG-004/eng-004-human-approval-v1";
import { ENG004_CP_IDS_V1, ENG004_QUESTION_STUDIO_PACKAGE_ID_V1, languageV1Eng004QuestionStudioAdapterV1 } from "./language-v1-eng004-adapter-v1";

const packages=languageV1Eng004QuestionStudioAdapterV1.listPackages();
assert.equal(packages.length,1);
const pkg=packages[0]!;
assert.equal(pkg.packageId,ENG004_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.deepEqual(pkg.cpIds,[...ENG004_CP_IDS_V1]);
assert.equal(pkg.lifecycleStage,"REVIEW_ONLY");
assert.equal(pkg.questionBankWritable,false);
assert.equal(pkg.testEligible,false);
assert.equal(pkg.mockTestEligible,false);
assert.equal(pkg.publiclyPublishable,false);
assert.equal(pkg.productionReleaseAuthorized,false);
assert.equal((pkg.metadata as any).registrationAuthorityId,ENG004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId);

for(const cp of ENG004_CP_IDS_V1){
  const result=await languageV1Eng004QuestionStudioAdapterV1.generate({packageId:ENG004_QUESTION_STUDIO_PACKAGE_ID_V1,patternId:cp,difficulty:"Medium",count:3,language:"en",seed:`adapter:${cp}`});
  assert.equal(result.questions.length,3);
  for(const q of result.questions){
    assert.equal(q.cpId,cp);
    assert.equal(q.reviewOnly,true);
    assert.equal(q.questionBankWritable,false);
    assert.equal(q.productionReleased,false);
    assert.equal(q.registrationAuthorityId,ENG004_HUMAN_EDITORIAL_APPROVAL_V1.authorityId);
    assert.equal((q.options as unknown[]).length,4);
  }
}
const mixed=await languageV1Eng004QuestionStudioAdapterV1.generate({packageId:ENG004_QUESTION_STUDIO_PACKAGE_ID_V1,difficulty:"Mixed",count:20,seed:"eng004-mixed"});
assert.equal(mixed.questions.length,20);
assert.ok(new Set(mixed.questions.map(q=>q.cpId)).size>=3);
await assert.rejects(()=>languageV1Eng004QuestionStudioAdapterV1.generate({packageId:ENG004_QUESTION_STUDIO_PACKAGE_ID_V1,runtimeMode:"bank-only",count:1}),/review-only/);
console.log("ENG-004 Question Studio review-only adapter validation passed.");
