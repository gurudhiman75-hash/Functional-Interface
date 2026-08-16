import { auditMenCp013DiscoveryReview, buildMenCp013DiscoveryReview } from './review';
function assert(c:unknown,m:string):asserts c{if(!c)throw new Error(m)}
const rows=buildMenCp013DiscoveryReview(),a=auditMenCp013DiscoveryReview();
assert(a.records===136,`expected 136 review rows, got ${a.records}`);
assert(a.uniqueStems>=120,`expected broad stem diversity, got ${a.uniqueStems}`);
assert(JSON.stringify(a.answerPositions)==='[34,34,34,34]','review answer balance failed');
for(const d of new Set(rows.map(r=>r.definition.id))){const p=rows.filter(r=>r.definition.id===d).map(r=>r.question.correctIndex).sort();assert(JSON.stringify(p)==='[0,1,2,3]',`${d}: positions not balanced`)}
console.log(JSON.stringify(a,null,2));
