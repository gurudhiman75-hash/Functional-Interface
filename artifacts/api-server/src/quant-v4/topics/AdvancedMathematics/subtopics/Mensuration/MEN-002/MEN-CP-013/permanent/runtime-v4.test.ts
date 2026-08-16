import { MEN_CP_013_PERMANENT_ALLOCATION } from './allocation';
import { generateMenCp013PermanentEnglishQuestionV4,generateMenCp013PermanentEnglishQuestionFromSourceV4,listMenCp013PermanentEnglishSources } from './runtime-v4';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
let generated=0;const sources=new Set<string>(),areaAnswers=new Set<string>(),areaRises=new Set<string>();
for(const allocation of MEN_CP_013_PERMANENT_ALLOCATION){
 const positions=new Set<number>();
 for(let i=0;i<128;i++){
  const q=generateMenCp013PermanentEnglishQuestionV4(allocation.qlId,`cp013-v4:${allocation.qlId}:${String(i).padStart(3,'0')}`);
  assert(q.verification.valid,'V4 verifier failed');assert(new Set(q.options.map(o=>o.display)).size===4,'V4 duplicate options');assert(q.options[q.correctIndex]?.display===q.answer,'V4 answer parity');
  assert(!q.options.some(o=>/\d+\/\d+π/.test(o.display)),'V4 raw fraction-pi typography');assert(!/\d+\/\d+π/.test(q.answer),'V4 raw fraction-pi answer typography');
  assert(q.explanation.traps.length===2,'V4 trap count');
  if(q.clusterId==='DISPLACEMENT_LEVEL_CHANGE_DIRECT'){
    const joined=q.explanation.traps.join(' ');
    const multi=q.sourceId==='CP013-W1-MULTI-SPHERE-LEVEL-RISE'||q.sourceId==='CP013-W3-SSC-MULTI-STONE-RISE';
    const draw=q.sourceId==='CP013-W2-DRAW-OFF-LEVEL-DROP';
    if(multi)assert(joined.includes('all completely immersed objects'),'multi-object trap relevance');
    else if(draw)assert(joined.includes('Convert litres'),'draw-off trap relevance');
    else assert(joined.includes('immersed solid’s volume')&&!joined.includes('all completely immersed objects'),'single-object trap relevance');
  }
  if(q.clusterId==='DISPLACEMENT_INVERSE_BASE_AREA'){
    areaAnswers.add(q.answer);const m=/by ([\d.]+) cm/.exec(q.stem);if(m)areaRises.add(m[1]!);
  }
  positions.add(q.correctIndex);sources.add(q.sourceId);generated++;
 }
 assert(positions.size===4,`${allocation.qlId}: V4 A/B/C/D failed`);
}
assert(generated===1920,'V4 deterministic count');assert(sources.size===34,'V4 source coverage');assert(areaAnswers.size>=10&&areaRises.size>=5,'V4 inverse-area entropy');
let forced=0;for(const row of listMenCp013PermanentEnglishSources())for(const sourceId of row.sources)for(let p=0;p<4;p++){
 const q=generateMenCp013PermanentEnglishQuestionFromSourceV4(row.qlId,sourceId,`cp013-v4-force:${sourceId}:${p}`);assert(q.sourceId===sourceId&&q.correctIndex===p&&q.verification.valid,`${sourceId}: V4 source force`);forced++;
}
assert(forced===136,'V4 forced source count');
console.log(JSON.stringify({deterministicQuestions:generated,sourceMappings:sources.size,sourceForcedChecks:forced,inverseAreaAnswers:areaAnswers.size,inverseAreaRises:areaRises.size,productLocked:true},null,2));
