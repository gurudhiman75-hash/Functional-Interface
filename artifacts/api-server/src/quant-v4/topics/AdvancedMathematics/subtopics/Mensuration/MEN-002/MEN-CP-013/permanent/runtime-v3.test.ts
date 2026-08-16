import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import {
  generateMenCp013PermanentEnglishQuestionV3,
  generateMenCp013PermanentEnglishQuestionFromSourceV3,
  listMenCp013PermanentEnglishSources,
} from './runtime-v3';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
let generated=0;
const sources=new Set<string>(),inverseAreaAnswers=new Set<string>(),inverseAreaRises=new Set<string>();
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
  const positions=new Set<number>();
  for(let index=0;index<128;index++){
    const seed=`cp013-v3:${allocation.qlId}:${String(index).padStart(3,'0')}`;
    const q=generateMenCp013PermanentEnglishQuestionV3(allocation.qlId,seed);
    assert(q.verification.valid,`${allocation.qlId}/${seed}: verifier failed`);
    assert(q.options.length===4&&new Set(q.options.map(o=>o.display)).size===4,`${allocation.qlId}/${seed}: option contract`);
    assert(q.options.filter(o=>o.isCorrect).length===1&&q.options[q.correctIndex]?.display===q.answer,`${allocation.qlId}/${seed}: answer parity`);
    assert(q.explanation.steps.length===4&&q.explanation.traps.length===2,`${allocation.qlId}/${seed}: setter teaching contract`);
    assert(!q.options.some(o=>/\b\d+\/\d+π\b/.test(o.display)),`${allocation.qlId}/${seed}: raw fraction-pi option typography`);
    assert(!q.englishImplementationFrozen&&!q.active&&!q.questionStudioDiscoverable&&q.questionBankStatus==='NOT_STORED'&&q.testEligibility==='INELIGIBLE'&&!q.publiclyPublishable,`${allocation.qlId}/${seed}: lifecycle leak`);
    if(q.sourceId==='CP013-W1-MULTI-SPHERE-LEVEL-RISE'||q.sourceId==='CP013-W3-SSC-MULTI-STONE-RISE')assert(!q.answer.includes('π'),`${q.sourceId}: setter rise should be clean numeric`);
    if(q.sourceId==='CP013-W2-INVERSE-SPHERE-COUNT')assert(!q.stem.match(/rise of \d+\/\d+/),`${q.sourceId}: fractional rise regression`);
    if(allocation.clusterId==='INSCRIBED_DIAGONAL_CONTAINMENT'){
      assert(q.options.some(o=>o.display.includes('√2')),`${allocation.qlId}: diagonal misconception option missing`);
      assert(!q.options.some(o=>/^\d{3,}√3/.test(o.display)),`${allocation.qlId}: synthetic huge radical distractor`);
    }
    if(allocation.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA'){
      inverseAreaAnswers.add(q.answer);
      const match=/rises the water level by ([\d.]+) cm/.exec(q.stem);if(match)inverseAreaRises.add(match[1]!);
    }
    positions.add(q.correctIndex);sources.add(q.sourceId);generated++;
  }
  assert(positions.size===4,`${allocation.qlId}: A/B/C/D failed`);
}
assert(generated===1920,`expected 1920 V3 questions, got ${generated}`);
assert(sources.size===34,`V3 default routing reached ${sources.size}/34 sources`);
assert(inverseAreaAnswers.size>=10,'V3 inverse-area answer entropy regression');
assert(inverseAreaRises.size>=5,'V3 inverse-area rise entropy regression');
let forced=0;
for(const row of listMenCp013PermanentEnglishSources())for(const sourceId of row.sources)for(let p=0;p<4;p++){
  const q=generateMenCp013PermanentEnglishQuestionFromSourceV3(row.qlId,sourceId,`cp013-v3-force:${sourceId}:${p}`);
  assert(q.sourceId===sourceId,`${sourceId}: forced source drift`);assert(q.correctIndex===p,`${sourceId}: forced position drift`);assert(q.verification.valid,`${sourceId}: forced verify failed`);forced++;
}
assert(forced===136,`expected 136 V3 source-force checks, got ${forced}`);
console.log(JSON.stringify({deterministicQuestions:generated,sourceMappings:sources.size,sourceForcedChecks:forced,inverseAreaAnswerVariants:inverseAreaAnswers.size,inverseAreaRiseVariants:inverseAreaRises.size,productLocked:true},null,2));
