import { MEN_CP_013_DEFINITIONS, generateMenCp013Question, auditMenCp013Definitions } from './discovery';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
const audit=auditMenCp013Definitions();
assert(audit.total===34,`expected 34 candidates, got ${audit.total}`);
assert(audit.wave01===16,`expected 16 wave01, got ${audit.wave01}`);
assert(audit.wave02===10,`expected 10 wave02, got ${audit.wave02}`);
assert(audit.wave03===8,`expected 8 wave03, got ${audit.wave03}`);
assert(audit.sourceBacked===8,'expected 8 source-backed candidates');
assert(new Set(MEN_CP_013_DEFINITIONS.map(d=>d.id)).size===34,'candidate IDs must be unique');
let total=0;
for(const d of MEN_CP_013_DEFINITIONS){
  const positions=new Set<number>(),stems=new Set<string>();
  for(let i=0;i<64;i++){
    const seed=`cp013-proof:${d.id}:${String(i).padStart(3,'0')}`;
    const a=generateMenCp013Question(d.id,seed),b=generateMenCp013Question(d.id,seed);
    assert(a.stem===b.stem&&a.answer===b.answer&&a.correctIndex===b.correctIndex,`${d.id}/${seed}: replay drift`);
    assert(a.options.length===4&&new Set(a.options.map(o=>o.display)).size===4,`${d.id}/${seed}: option contract`);
    assert(a.options.filter(o=>o.isCorrect).length===1,`${d.id}/${seed}: one correct option`);
    assert(a.options[a.correctIndex]?.display===a.answer,`${d.id}/${seed}: answer parity`);
    assert(a.explanation.steps.length===4,`${d.id}/${seed}: four teaching steps`);
    assert(a.verification.valid,`${d.id}/${seed}: verification`);
    assert(a.permanentQlId===null&&!a.questionStudioDiscoverable&&!a.publiclyPublishable,`${d.id}/${seed}: lifecycle leak`);
    positions.add(a.correctIndex);stems.add(a.stem);total++;
  }
  assert(positions.size===4,`${d.id}: A/B/C/D not reachable`);
  assert(stems.size>=4,`${d.id}: insufficient stem diversity ${stems.size}`);
}
console.log(JSON.stringify({authority:audit.authority,candidates:audit.total,deterministicPackages:total,waves:{wave01:audit.wave01,wave02:audit.wave02,wave03:audit.wave03},sourceBacked:audit.sourceBacked,permanentQlCount:0,productLocked:true},null,2));
