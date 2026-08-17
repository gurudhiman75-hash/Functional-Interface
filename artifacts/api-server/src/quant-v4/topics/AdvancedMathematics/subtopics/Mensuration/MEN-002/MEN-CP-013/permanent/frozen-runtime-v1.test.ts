import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import {
  MEN_CP_013_PERMANENT_ENGLISH_FREEZE_AUTHORITY,
  generateMenCp013FrozenEnglishQuestion,
  generateMenCp013FrozenEnglishQuestionFromSource,
  listMenCp013PermanentEnglishSources,
} from './frozen-runtime-v1';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}

let generated=0;
const sources=new Set<string>();
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
  const positions=new Set<number>();
  for(let index=0;index<128;index++){
    const seed=`cp013-frozen:${allocation.qlId}:${String(index).padStart(3,'0')}`;
    const q=generateMenCp013FrozenEnglishQuestion(allocation.qlId,seed);
    assert(q.authority===MEN_CP_013_PERMANENT_ENGLISH_FREEZE_AUTHORITY,`${allocation.qlId}/${seed}: freeze authority drift`);
    assert(q.maturity==='PERMANENT_ENGLISH_IMPLEMENTATION_FROZEN',`${allocation.qlId}/${seed}: maturity drift`);
    assert(q.reviewStatus==='ENGLISH_REVIEW_APPROVED',`${allocation.qlId}/${seed}: review status drift`);
    assert(q.englishImplementationFrozen===true,`${allocation.qlId}/${seed}: English freeze flag false`);
    assert(q.permanentQlId===allocation.qlId&&q.templateId===allocation.templateId&&q.solveModeId===allocation.solveModeId&&q.clusterId===allocation.clusterId,`${allocation.qlId}/${seed}: permanent identity drift`);
    assert(q.verification.valid,`${allocation.qlId}/${seed}: verifier failed`);
    assert(q.options.length===4&&new Set(q.options.map(option=>option.display)).size===4,`${allocation.qlId}/${seed}: option contract`);
    assert(q.options.filter(option=>option.isCorrect).length===1&&q.options[q.correctIndex]?.display===q.answer,`${allocation.qlId}/${seed}: answer parity`);
    assert(q.explanation.steps.length===4&&q.explanation.traps.length===2,`${allocation.qlId}/${seed}: frozen teaching contract`);
    assert(!q.active&&!q.questionStudioDiscoverable&&q.questionBankStatus==='NOT_STORED'&&q.testEligibility==='INELIGIBLE'&&!q.publiclyPublishable,`${allocation.qlId}/${seed}: product lifecycle leak`);
    assert(!q.options.some(option=>/\d+\/\d+π/.test(option.display)),`${allocation.qlId}/${seed}: fraction-pi typography regression`);
    positions.add(q.correctIndex);sources.add(q.sourceId);generated++;
  }
  assert(positions.size===4,`${allocation.qlId}: frozen A/B/C/D reachability failed`);
}
assert(generated===1920,`expected 1920 frozen questions, got ${generated}`);
assert(sources.size===34,`frozen default routing reached ${sources.size}/34 sources`);

let forced=0;
for(const row of listMenCp013PermanentEnglishSources()){
  for(const sourceId of row.sources){
    for(let p=0;p<4;p++){
      const q=generateMenCp013FrozenEnglishQuestionFromSource(row.qlId,sourceId,`cp013-frozen-force:${sourceId}:${p}`);
      assert(q.sourceId===sourceId,`${sourceId}: frozen forced source drift`);
      assert(q.correctIndex===p,`${sourceId}: frozen forced position drift`);
      assert(q.englishImplementationFrozen&&q.reviewStatus==='ENGLISH_REVIEW_APPROVED',`${sourceId}: frozen status drift`);
      assert(!q.active&&!q.questionStudioDiscoverable&&q.questionBankStatus==='NOT_STORED'&&q.testEligibility==='INELIGIBLE'&&!q.publiclyPublishable,`${sourceId}: frozen source product leak`);
      forced++;
    }
  }
}
assert(forced===136,`expected 136 frozen source-forced checks, got ${forced}`);
console.log(JSON.stringify({permanentQlCount:15,frozenQuestions:generated,sourceMappings:sources.size,sourceForcedChecks:forced,englishImplementationFrozen:true,questionStudioDiscoverable:false,questionBankStatus:'NOT_STORED',testEligibility:'INELIGIBLE',publiclyPublishable:false},null,2));
