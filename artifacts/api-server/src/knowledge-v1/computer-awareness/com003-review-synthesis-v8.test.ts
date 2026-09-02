import { strict as assert } from "node:assert";
import { COM003_EXAM_REALNESS_AUDIT_V3 } from "./com003-exam-realness-audit-v3";
import { COM003_PERMANENT_QLS } from "./com003-permanent-ql-allocation";
import { COM003_ENGLISH_REVIEW_CORPUS_V8, buildCom003EnglishReviewCorpusV8 } from "./com003-review-synthesis-v8";

assert.equal(COM003_ENGLISH_REVIEW_CORPUS_V8.length,228);
assert.equal(new Set(COM003_ENGLISH_REVIEW_CORPUS_V8.map(q=>q.qlId)).size,19);
for(const ql of COM003_PERMANENT_QLS){
 const qs=COM003_ENGLISH_REVIEW_CORPUS_V8.filter(q=>q.qlId===ql.qlId);
 assert.equal(qs.length,12);
 for(const family of ["DIRECT_RECALL","FUNCTIONAL_APPLICATION","EXAMPLE_RECOGNITION","CONTRAST_DISCRIMINATION"] as const) assert.equal(qs.filter(q=>q.examSurfaceFamily===family).length,3,`${ql.qlId}:${family}`);
 assert.equal(new Set(qs.map(q=>q.stem.toLowerCase())).size,12,`${ql.qlId}:unique stems`);
}
for(const q of COM003_ENGLISH_REVIEW_CORPUS_V8){assert.equal(q.options.length,4);assert.equal(q.options[q.correctIndex],q.canonicalAnswer);assert.equal(q.stemAuthority,"COM003_V8_DEEP_EXAM_SURFACE_AUTHORITY");}
assert.deepEqual(buildCom003EnglishReviewCorpusV8({seedPrefix:"replay"}),buildCom003EnglishReviewCorpusV8({seedPrefix:"replay"}));
assert.equal(COM003_EXAM_REALNESS_AUDIT_V3.valid,true,JSON.stringify(COM003_EXAM_REALNESS_AUDIT_V3.blockers,null,2));
console.log("[COM003-V8]",{questions:228,qls:19,familiesPerQl:4,status:COM003_EXAM_REALNESS_AUDIT_V3.status,advisories:COM003_EXAM_REALNESS_AUDIT_V3.advisoryCount});
