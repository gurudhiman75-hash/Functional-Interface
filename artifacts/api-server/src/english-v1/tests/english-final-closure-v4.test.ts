import assert from"node:assert/strict";
import{languageV1QuestionStudioAdapter}from"../../question-studio/engines/language-v1-adapter";
import{ENG009_CP001_PASSAGES_V1,ENG009_CP001_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP001/eng-009-cp001-authorities-v1";
import{ENG009_CP002_PASSAGES_V1,ENG009_CP002_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP002/eng-009-cp002-authorities-v1";
import{ENG009_CP003_PASSAGES_V1,ENG009_CP003_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP003/eng-009-cp003-authorities-v1";
import{ENG009_CP004_PASSAGES_V1,ENG009_CP004_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP004/eng-009-cp004-authorities-v1";
import{ENG009_CP005_PASSAGES_V1,ENG009_CP005_BLANKS_V1}from"../chapters/cloze-test/ENG-009/CP005/eng-009-cp005-authorities-v1";
import{ENG010_ACTIVE_SETS_V2}from"../chapters/para-jumbles/ENG-010/eng-010-active-v2";
import{ENG011_ACTIVE_SETS_V2}from"../chapters/sentence-rearrangement/ENG-011/eng-011-active-v2";
import{ENG012_ACTIVE_AUTHORITIES_V2,ENG012_ACTIVE_COUNTS_V2}from"../chapters/word-swap/ENG-012/eng-012-active-v2";
import{ENG013_ACTIVE_AUTHORITIES_V4,ENG013_ACTIVE_COUNTS_V4,ENG013_BREADTH3_AUTHORITIES_V4}from"../chapters/word-usage/ENG-013/eng-013-active-v4";
import{ENG009_HUMAN_APPROVAL_V1}from"../chapters/cloze-test/ENG-009/eng-009-human-approval-v1";
import{ENG010_HUMAN_APPROVAL_V1}from"../chapters/para-jumbles/ENG-010/eng-010-human-approval-v1";
import{ENG011_HUMAN_APPROVAL_V1}from"../chapters/sentence-rearrangement/ENG-011/eng-011-human-approval-v1";
import{ENG012_HUMAN_APPROVAL_V1}from"../chapters/word-swap/ENG-012/eng-012-human-approval-v1";
import{ENG013_HUMAN_APPROVAL_V1}from"../chapters/word-usage/ENG-013/eng-013-human-approval-v1";
import{ENGLISH_V1_FREEZE_AUTHORITY}from"../english-v1-freeze-authority";

const packages=languageV1QuestionStudioAdapter.listPackages().filter(x=>x.subject==="English");
assert.equal(packages.length,13,"Whole-English closure must expose exactly ENG-001 through ENG-013 packages");
for(const p of packages){
 assert.equal(p.runtimeMode,"review-only",`${p.packageId} must remain review-only`);
 assert.equal(p.questionBankWritable,false,`${p.packageId} must not write Question Bank`);
 assert.equal(p.testEligible,false,`${p.packageId} must not be scored-test eligible`);
 assert.equal(p.mockTestEligible,false,`${p.packageId} must not be mock-test eligible`);
 assert.equal(p.publiclyPublishable,false,`${p.packageId} must not be publicly publishable`);
 assert.equal(p.automaticStudentPublication,false,`${p.packageId} must not auto-publish to learners`);
 assert.equal(p.productionReleaseAuthorized,false,`${p.packageId} must remain production locked`);
}

const eng009Passages=[
 ENG009_CP001_PASSAGES_V1.length,
 ENG009_CP002_PASSAGES_V1.length,
 ENG009_CP003_PASSAGES_V1.length,
 ENG009_CP004_PASSAGES_V1.length,
 ENG009_CP005_PASSAGES_V1.length
];
const eng009Blanks=[
 ENG009_CP001_BLANKS_V1.length,
 ENG009_CP002_BLANKS_V1.length,
 ENG009_CP003_BLANKS_V1.length,
 ENG009_CP004_BLANKS_V1.length,
 ENG009_CP005_BLANKS_V1.length
];
assert.deepEqual(eng009Passages,[20,20,20,20,18]);
assert.deepEqual(eng009Blanks,[100,100,120,120,108]);
assert.equal(eng009Passages.reduce((a,b)=>a+b,0),98);
assert.equal(eng009Blanks.reduce((a,b)=>a+b,0),548);

assert.equal(ENG010_ACTIVE_SETS_V2.length,450);
assert.equal(ENG011_ACTIVE_SETS_V2.length,990);
assert.deepEqual(ENG012_ACTIVE_COUNTS_V2,{cp001:120,cp002:120,cp003:100,cp004:110,total:450,surfaces:1350});
assert.equal(ENG012_ACTIVE_AUTHORITIES_V2.length,450);
assert.deepEqual(ENG013_ACTIVE_COUNTS_V4,{cp001:192,cp002:192,cp003:192,cp004:192,total:768,breadthWave1Added:144,breadthWave2Added:144,breadthWave3Added:384});
assert.equal(ENG013_ACTIVE_AUTHORITIES_V4.length,768);
assert.equal(ENG013_BREADTH3_AUTHORITIES_V4.length,384);
assert.equal(new Set(ENG013_BREADTH3_AUTHORITIES_V4.map(x=>x.word.toLowerCase())).size,384);

for(const a of[ENG009_HUMAN_APPROVAL_V1,ENG010_HUMAN_APPROVAL_V1,ENG011_HUMAN_APPROVAL_V1,ENG012_HUMAN_APPROVAL_V1,ENG013_HUMAN_APPROVAL_V1]){
 assert.equal(a.humanReviewApproved,true);
 assert.equal(a.productionReleaseAuthorized,false);
}

assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.englishFreeze,true);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.approvalStatus,"HUMAN_PRODUCT_OWNER_APPROVED");
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.learnerContentChangeAllowedWithoutNewApproval,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.volumeExpansionAllowedWithoutNewEvidence,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.questionStudioReviewOnly,true);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.questionBankWritable,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.testEligible,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.mockTestEligible,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.publiclyPublishable,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.automaticStudentPublication,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.productionReleaseAuthorized,false);
assert.equal(ENGLISH_V1_FREEZE_AUTHORITY.reopenCriteria.length,4);
assert.deepEqual(ENGLISH_V1_FREEZE_AUTHORITY.certifiedInventories.eng009,{passages:98,governedBlanks:548});
assert.deepEqual(ENGLISH_V1_FREEZE_AUTHORITY.certifiedInventories.eng013,{authorities:768});

console.log("Whole-English final closure V4 regression passed.",{
 packages:packages.length,
 eng009:{passages:98,blanks:548},
 eng010:450,
 eng011:990,
 eng012:{authorities:450,surfaces:1350},
 eng013:768
});
