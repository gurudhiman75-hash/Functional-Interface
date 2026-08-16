import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import { auditMenCp013PermanentEnglishReviewV4,buildMenCp013PermanentEnglishReviewV4 } from './review-v4';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
const rows=buildMenCp013PermanentEnglishReviewV4(),audit=auditMenCp013PermanentEnglishReviewV4();
assert(audit.records===64,`expected 64 V4 review records, got ${audit.records}`);assert(audit.uniqueStems===64,'V4 unique stem regression');assert(audit.uniqueSources===34,'V4 source coverage regression');assert(JSON.stringify(audit.answerPositions)==='[16,16,16,16]','V4 answer balance');assert(audit.inverseBaseAreaAnswers===4&&audit.inverseBaseAreaRises===4,'V4 review inverse-area entropy');
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){const qlRows=rows.filter(row=>row.allocation.qlId===allocation.qlId);assert(new Set(qlRows.map(row=>row.question.correctIndex)).size===4,`${allocation.qlId}: V4 review positions`);for(const sourceId of allocation.sourceIds)assert(qlRows.some(row=>row.sourceId===sourceId),`${allocation.qlId}: V4 review missed ${sourceId}`);}
for(const {question} of rows){
 assert(question.verification.valid,`${question.permanentQlId}: V4 review verify`);assert(new Set(question.options.map(o=>o.display)).size===4,`${question.permanentQlId}: V4 duplicate options`);assert(question.options[question.correctIndex]?.display===question.answer,`${question.permanentQlId}: V4 answer parity`);assert(question.explanation.steps.length===4&&question.explanation.traps.length===2,`${question.permanentQlId}: V4 teaching`);
 assert(!question.options.some(o=>/\d+\/\d+π/.test(o.display)),`${question.permanentQlId}: raw fraction-pi option`);assert(!/\d+\/\d+π/.test(question.answer),`${question.permanentQlId}: raw fraction-pi answer`);assert(!question.options.some(o=>/\d+\.\d{4,}/.test(o.display)),`${question.permanentQlId}: long decimal`);
 if(question.clusterId==='DISPLACEMENT_LEVEL_CHANGE_DIRECT'){
  const traps=question.explanation.traps.join(' '),multi=question.sourceId==='CP013-W1-MULTI-SPHERE-LEVEL-RISE'||question.sourceId==='CP013-W3-SSC-MULTI-STONE-RISE',draw=question.sourceId==='CP013-W2-DRAW-OFF-LEVEL-DROP';
  if(multi)assert(traps.includes('all completely immersed objects'),'V4 multi trap mismatch');else if(draw)assert(traps.includes('Convert litres'),'V4 draw-off trap mismatch');else assert(traps.includes('immersed solid’s volume')&&!traps.includes('all completely immersed objects'),'V4 single displacement trap mismatch');
 }
 assert(!question.englishImplementationFrozen&&!question.active&&!question.questionStudioDiscoverable&&!question.publiclyPublishable,'V4 lifecycle leak');
}
console.log(JSON.stringify(audit,null,2));
