import {strict as assert} from 'node:assert';
import {pncSourceReviewRows,pncSourceReviewPackage,generatePncSourceReviewBatch} from './quant-pnc-source-review';
const rows=pncSourceReviewRows();assert.equal(rows.length,948);
for(const q of rows){assert.equal(q.options![q.correctIndex!],q.answer);assert.equal(new Set(q.options).size,4);assert.equal(q.publiclyPublishable,false);assert.equal(q.testEligible,false);assert.doesNotThrow(()=>JSON.stringify(q));}
for(const language of ['en','hi','pa']as const)for(const difficulty of ['Easy','Medium','Hard']){const r={packageId:'PNC-SOURCE-REVIEW',language,difficulty,count:3,seed:'proof'};const q=generatePncSourceReviewBatch(r)!;assert.equal(q.questions.length,3);assert.deepEqual(q,generatePncSourceReviewBatch(r));assert(q.questions.every(q=>q.language===language&&q.difficulty===difficulty));}
assert.ok(generatePncSourceReviewBatch({packageId:'PNC-SOURCE-REVIEW',language:'hi',canonicalProblemId:'PNC-SOURCE-SUBSET'})!.questions[0].language==='hi');assert.equal(pncSourceReviewPackage().metadata!.editorialApproval,'PENDING');
console.log(JSON.stringify({status:'PASS',rows:rows.length,languageDifficultyBatches:9}));
