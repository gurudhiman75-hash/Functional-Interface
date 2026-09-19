import assert from "node:assert/strict";
import { ENG002_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng002-cp001-adapter-v1";
import { languageV1QuestionStudioAdapter } from "./language-v1-adapter";
import { ENG003_QUESTION_STUDIO_PACKAGE_ID_V1 } from "./language-v1-eng003-cp001-adapter-v1";
import { languageV1Eng003Cp010QuestionStudioAdapterV1 } from "./language-v1-eng003-cp010-adapter-v1";

const baseRequest={packageId:ENG003_QUESTION_STUDIO_PACKAGE_ID_V1,canonicalProblemId:"ENG-003-CP010",subject:"English",topic:"Fill in the Blanks / Grammar Fillers",subtopic:"Modifiers and Placement",language:"en" as const,runtimeMode:"review-only"};
const pkg=languageV1QuestionStudioAdapter.listPackages().find((item)=>item.packageId===ENG003_QUESTION_STUDIO_PACKAGE_ID_V1);
assert.ok(pkg);
assert.equal(pkg.cpIds.includes("ENG-003-CP010"),true);
assert.equal(pkg.questionBankWritable,false);
assert.equal(pkg.testEligible,false);
assert.equal(pkg.mockTestEligible,false);
assert.equal(pkg.publiclyPublishable,false);
assert.equal(pkg.automaticStudentPublication,false);
assert.equal(pkg.productionReleaseAuthorized,false);

for(const difficulty of ["Easy","Medium","Hard"] as const){
  const result=await languageV1Eng003Cp010QuestionStudioAdapterV1.generate({...baseRequest,difficulty,count:5,seed:`eng003:cp010:${difficulty}:adapter-test`});
  assert.equal(result.questions.length,5);
  for(const q of result.questions){
    assert.equal(q.cpId,"ENG-003-CP010");
    assert.equal(q.reviewOnly,true);
    assert.equal(q.questionBankWritable,false);
    assert.equal(q.testEligible,false);
    assert.equal(q.mockTestEligible,false);
    assert.equal(q.publiclyPublishable,false);
    assert.equal(q.automaticStudentPublication,false);
    assert.equal(q.productionReleaseAuthorized,false);
    assert.equal((String(q.sentence).match(/_____/g)??[]).length,1);
    assert.equal((q.options as unknown[]).includes("No improvement"),false);
  }
}
const filtered=await languageV1Eng003Cp010QuestionStudioAdapterV1.generate({...baseRequest,difficulty:"Medium",patternId:"GR-MOD-009",count:2,seed:"eng003:cp010:rule-filter"});
assert.equal(filtered.questions.every((q)=>q.ruleId==="GR-MOD-009"),true);

const routed=await languageV1QuestionStudioAdapter.generate({...baseRequest,patternId:"GR-MOD-010",difficulty:"Hard",count:1,seed:"eng003:cp010:route"});
assert.equal(routed.questions[0]?.cpId,"ENG-003-CP010");

const eng002=await languageV1QuestionStudioAdapter.generate({
  packageId:ENG002_QUESTION_STUDIO_PACKAGE_ID_V1,canonicalProblemId:"ENG-002-CP010",patternId:"GR-MOD-010",
  subject:"English",topic:"Sentence Improvement",subtopic:"Modifiers and Placement",language:"en",runtimeMode:"review-only",
  difficulty:"Hard",count:1,seed:"eng003:cp010:collision"
});
assert.equal(eng002.questions[0]?.cpId,"ENG-002-CP010");
assert.equal(String(eng002.questions[0]?.sentence).includes("_____"),false);

await assert.rejects(languageV1Eng003Cp010QuestionStudioAdapterV1.generate({...baseRequest,language:"hi",count:1}),/English only/i);
await assert.rejects(languageV1Eng003Cp010QuestionStudioAdapterV1.generate({...baseRequest,runtimeMode:"production",count:1}),/review-only/i);
console.log("ENG-003 CP010 Question Studio review-only lifecycle tests passed.");
