import assert from "node:assert/strict";
import {generateQuestionStudioQuestions,listQuestionStudioPackages} from "../../../../question-studio/engine-registry";
import {STAT001_PERMANENT_QLS as r1} from "../STAT-001/permanent-ql-registry";
import {STAT002_PERMANENT_QLS as r2} from "../STAT-002/permanent-ql-registry";
import {STAT003_PERMANENT_QLS as r3} from "../STAT-003/permanent-ql-registry";
import {STAT004_PERMANENT_QLS as r4} from "../STAT-004/permanent-ql-registry";
import {STAT005_PERMANENT_QLS as r5} from "../STAT-005/permanent-ql-registry";
import {STAT006_PERMANENT_QLS as r6} from "../STAT-006/permanent-ql-registry";
import {STAT007_PERMANENT_QLS as r7} from "../STAT-007/permanent-ql-registry";
import {STAT008_PERMANENT_QLS as r8} from "../STAT-008/permanent-ql-registry";
import {STAT009_PERMANENT_QLS as r9} from "../STAT-009/permanent-ql-registry";
import {STAT010_PERMANENT_QLS as r10} from "../STAT-010/permanent-ql-registry";
import {STAT011_PERMANENT_QLS as r11} from "../STAT-011/permanent-ql-registry";
import {STAT012_PERMANENT_QLS as r12} from "../STAT-012/permanent-ql-registry";
import {STAT013_PERMANENT_QLS as r13} from "../STAT-013/permanent-ql-registry";
import {STAT014_PERMANENT_QLS as r14} from "../STAT-014/permanent-ql-registry";
const seen=new Set<string>();let routes=0;
for(const [packageId,registry]of [["STAT-001",r1],["STAT-002",r2],["STAT-003",r3],["STAT-004",r4],["STAT-005",r5],["STAT-006",r6],["STAT-007",r7],["STAT-008",r8],["STAT-009",r9],["STAT-010",r10],["STAT-011",r11],["STAT-012",r12],["STAT-013",r13],["STAT-014",r14]]as const){
 const card=listQuestionStudioPackages().find(c=>c.packageId===packageId)!;assert.deepEqual(card.supportedLanguages,['en','hi','pa']);
 for(const owner of registry){assert(!seen.has(owner.qlId));seen.add(owner.qlId);
 for(const exam of ['SSC_CGL_TIER_II','SSC_CGL_JSO'])for(const language of ['hi','pa']){
 const result=await generateQuestionStudioQuestions({questionLanguageId:owner.qlId,exam,language,count:1,seed:'ALL-STAT-NATIVE-CLOSURE'});
 const q=result.questions[0]!;assert.equal(result.engineId,'quant-v4');assert.equal(q.packageId,packageId);assert.equal(q.questionLanguageId,owner.qlId);assert.equal(q.language,language);assert.equal(q.examProfile,exam);assert.equal(q.reviewStatus,'NATIVE_REVIEW_CANDIDATE');assert.equal(q.productionReleaseAuthorized,false);assert.equal(q.testEligible,false);assert.equal(q.publiclyPublishable,false);assert.equal(q.options[q.correctIndex],q.answer);routes++;
 }
 }
}
assert.equal(seen.size,214);assert.equal(routes,856);console.log({status:'PASS_ALL_STATISTICS_NATIVE_STUDIO',permanentQls:seen.size,routes,packages:14});
