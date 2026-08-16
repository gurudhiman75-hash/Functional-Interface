import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import {
  generateMenCp013PermanentEnglishQuestionV2,
  generateMenCp013PermanentEnglishQuestionFromSourceV2,
  listMenCp013PermanentEnglishSources,
} from './runtime-v2';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}

let generated=0;
const seenSources=new Set<string>();
const inverseAreaAnswers=new Set<string>();
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
  const positions=new Set<number>();
  for(let index=0;index<128;index++){
    const seed=`cp013-permanent:${allocation.qlId}:${String(index).padStart(3,'0')}`;
    const q=generateMenCp013PermanentEnglishQuestionV2(allocation.qlId,seed);
    assert(q.permanentQlId===allocation.qlId,`${allocation.qlId}/${seed}: QL drift`);
    assert(q.templateId===allocation.templateId&&q.solveModeId===allocation.solveModeId,`${allocation.qlId}/${seed}: identity drift`);
    assert(q.clusterId===allocation.clusterId,`${allocation.qlId}/${seed}: cluster drift`);
    assert(q.verification.valid,`${allocation.qlId}/${seed}: verifier failed`);
    assert(q.options.length===4&&new Set(q.options.map(o=>o.display)).size===4,`${allocation.qlId}/${seed}: option contract`);
    assert(q.options.filter(o=>o.isCorrect).length===1&&q.options[q.correctIndex]?.display===q.answer,`${allocation.qlId}/${seed}: answer parity`);
    assert(q.explanation.steps.length===4,`${allocation.qlId}/${seed}: expected four teaching steps`);
    assert(q.explanation.shortcut.length>10&&q.explanation.traps.length>=2,`${allocation.qlId}/${seed}: permanent teaching incomplete`);
    assert(q.englishImplementationFrozen===false&&!q.active&&!q.questionStudioDiscoverable&&q.questionBankStatus==='NOT_STORED'&&q.testEligibility==='INELIGIBLE'&&!q.publiclyPublishable,`${allocation.qlId}/${seed}: lifecycle leak`);
    seenSources.add(q.sourceId);positions.add(q.correctIndex);generated++;
    if(allocation.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA')inverseAreaAnswers.add(q.answer);
  }
  assert(positions.size===4,`${allocation.qlId}: A/B/C/D reachability failed`);
}
assert(generated===1920,`expected 1920 permanent questions, got ${generated}`);
const declared=listMenCp013PermanentEnglishSources().flatMap(row=>row.sources);
assert(declared.length===34&&new Set(declared).size===34,'declared source inventory must contain 34 unique mappings');
assert(seenSources.size===34,`default permanent proof reached only ${seenSources.size}/34 sources`);
for(const source of declared)assert(seenSources.has(source),`default proof missed source ${source}`);
assert(inverseAreaAnswers.size>=10,`inverse base-area entropy too low: ${inverseAreaAnswers.size}`);

let forced=0;
for(const row of listMenCp013PermanentEnglishSources()){
  for(const sourceId of row.sources){
    const positions=new Set<number>();
    for(let p=0;p<4;p++){
      const seed=`cp013-source-force:${sourceId}:${p}`;
      const q=generateMenCp013PermanentEnglishQuestionFromSourceV2(row.qlId,sourceId,seed);
      assert(q.sourceId===sourceId,`${sourceId}: forced source drift`);
      assert(q.verification.valid,`${sourceId}: forced source verification failed`);
      assert(q.correctIndex===p,`${sourceId}: requested position ${p} not reached`);
      positions.add(q.correctIndex);forced++;
    }
    assert(positions.size===4,`${sourceId}: source-level A/B/C/D failed`);
  }
}
assert(forced===136,`expected 136 source-forced checks, got ${forced}`);
console.log(JSON.stringify({permanentQlCount:15,deterministicQuestions:generated,forcedSourceChecks:forced,sourceMappings:seenSources.size,inverseAreaAnswerVariants:inverseAreaAnswers.size,productLocked:true},null,2));
