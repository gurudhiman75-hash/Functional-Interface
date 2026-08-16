import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import { auditMenCp013PermanentEnglishReviewV1, buildMenCp013PermanentEnglishReviewV1 } from './review-v1';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
const rows=buildMenCp013PermanentEnglishReviewV1();
const audit=auditMenCp013PermanentEnglishReviewV1();
assert(audit.records===64,`expected 64 review records, got ${audit.records}`);
assert(audit.uniqueSources===34,`expected all 34 sources, got ${audit.uniqueSources}`);
assert(audit.uniqueStems===64,`expected 64 unique review stems, got ${audit.uniqueStems}`);
assert(JSON.stringify(audit.answerPositions)==='[16,16,16,16]',`answer balance drift: ${audit.answerPositions}`);
assert(audit.inverseBaseAreaAnswers===4,`review should expose four inverse-base-area answers, got ${audit.inverseBaseAreaAnswers}`);
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
  const qlRows=rows.filter(row=>row.allocation.qlId===allocation.qlId);
  assert(new Set(qlRows.map(row=>row.question.correctIndex)).size===4,`${allocation.qlId}: review must expose A/B/C/D`);
  for(const sourceId of allocation.sourceIds)assert(qlRows.some(row=>row.sourceId===sourceId),`${allocation.qlId}: review missed ${sourceId}`);
}
for(const {question} of rows){
  assert(question.verification.valid,`${question.permanentQlId}: review verifier failed`);
  assert(new Set(question.options.map(option=>option.display)).size===4,`${question.permanentQlId}: duplicate review options`);
  assert(question.options[question.correctIndex]?.display===question.answer,`${question.permanentQlId}: review answer parity`);
  assert(!question.stem.includes('edge of edge'),'wording regression');
  assert(!question.options.some(option=>/\b1 spheres\b/.test(option.display)),'singular-count grammar regression');
  assert(!question.options.some(option=>/\d+\.\d{4,}/.test(option.display)),'long-decimal review option regression');
  assert(question.explanation.steps.length===4&&question.explanation.traps.length>=2,'teaching depth regression');
  assert(!question.englishImplementationFrozen&&!question.active&&!question.questionStudioDiscoverable&&!question.publiclyPublishable,'review lifecycle leak');
}
console.log(JSON.stringify(audit,null,2));
