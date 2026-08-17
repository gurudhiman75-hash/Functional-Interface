import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import { auditMenCp013PermanentEnglishReviewV2, buildMenCp013PermanentEnglishReviewV2 } from './review-v2';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
const rows=buildMenCp013PermanentEnglishReviewV2(),audit=auditMenCp013PermanentEnglishReviewV2();
assert(audit.records===64,`expected 64 V3 review records, got ${audit.records}`);
assert(audit.uniqueSources===34,`expected 34 sources, got ${audit.uniqueSources}`);
assert(audit.uniqueStems===64,`expected 64 unique stems, got ${audit.uniqueStems}`);
assert(JSON.stringify(audit.answerPositions)==='[16,16,16,16]',`answer balance drift ${audit.answerPositions}`);
assert(audit.inverseBaseAreaAnswers===4,`review inverse-area answer entropy ${audit.inverseBaseAreaAnswers}`);
assert(audit.inverseBaseAreaRises===4,`review inverse-area rise entropy ${audit.inverseBaseAreaRises}`);
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
  const qlRows=rows.filter(row=>row.allocation.qlId===allocation.qlId);
  assert(new Set(qlRows.map(row=>row.question.correctIndex)).size===4,`${allocation.qlId}: review positions`);
  for(const sourceId of allocation.sourceIds)assert(qlRows.some(row=>row.sourceId===sourceId),`${allocation.qlId}: review missed ${sourceId}`);
}
for(const {question} of rows){
  assert(question.verification.valid,`${question.permanentQlId}: verify failed`);
  assert(question.options.length===4&&new Set(question.options.map(o=>o.display)).size===4,`${question.permanentQlId}: option contract`);
  assert(question.options[question.correctIndex]?.display===question.answer,`${question.permanentQlId}: answer parity`);
  assert(question.explanation.steps.length===4&&question.explanation.traps.length===2,`${question.permanentQlId}: teaching contract`);
  assert(!question.options.some(o=>/\b\d+\/\d+π\b/.test(o.display)),`${question.permanentQlId}: raw fraction-pi option`);
  assert(!question.options.some(o=>/\d+\.\d{4,}/.test(o.display)),`${question.permanentQlId}: long decimal option`);
  if(question.sourceId==='CP013-W1-MULTI-SPHERE-LEVEL-RISE'||question.sourceId==='CP013-W3-SSC-MULTI-STONE-RISE')assert(!question.answer.includes('π'),`${question.sourceId}: symbolic rise regression`);
  if(question.sourceId==='CP013-W2-INVERSE-SPHERE-COUNT')assert(!/rise of \d+\/\d+/.test(question.stem),`${question.sourceId}: fractional rise regression`);
}
console.log(JSON.stringify(audit,null,2));
