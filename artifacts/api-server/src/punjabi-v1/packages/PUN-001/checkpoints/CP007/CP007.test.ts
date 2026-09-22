import assert from "node:assert/strict";
import { CP007_KARAK_AUTHORITIES,CP007_VISMIK_AUTHORITIES,CP007_YOJAK_AUTHORITIES } from "./CP007-authorities";
import { CP007_ALL_SAMBANDHAK_AUTHORITIES } from "./CP007-sambandhak";
import { CP007_FAMILIES,getCP007BreadthReport } from "./engine";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਤਿੰਨੇ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
const personal=/(ਗੁਰਪ੍ਰੀਤ|ਰੀਨਾ|ਮੋਹਨ|ਸੋਹਨ|ਸੁਖਵਿੰਦਰ|ਪੰਜਾਬ)/u;
assert.equal(CP007_KARAK_AUTHORITIES.length,95);
assert.equal(CP007_ALL_SAMBANDHAK_AUTHORITIES.length,36);
assert.equal(CP007_YOJAK_AUTHORITIES.length,23);
assert.equal(CP007_VISMIK_AUTHORITIES.length,37);
assert.equal(CP007_FAMILIES.length,9);

const ids=new Set<string>();
for(const a of CP007_KARAK_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
 assert(a.target.includes(a.marker),a.id+": marker must occur in target");
 assert.equal(a.sentenceDistractors.length,3);assert.equal(new Set(a.sentenceDistractors).size,3);assert(!a.sentenceDistractors.includes(a.target as never));
 for(const v of [a.sentence,a.target,a.marker,a.explanationPa,...a.sentenceDistractors]){assert.equal(v,v.normalize("NFC"));assert(!/[A-Za-z]/.test(v),a.id+": English leakage");assert(!banned.test(v));assert(!personal.test(v),a.id+": named/local example leaked");}
}
for(const a of CP007_ALL_SAMBANDHAK_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");assert(a.priorApprovedIds.length===1||a.breadthSource==="AUTHORED_V2",a.id+": provenance required");assert(a.sentence.includes(a.expression),a.id+": expression missing from sentence");
 for(const v of [a.expression,a.sentence,a.explanationPa]){assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));assert(!personal.test(v));}
}
for(const a of CP007_YOJAK_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");assert(a.donorId||a.priorApprovedIds.length,a.id+": provenance required");
 for(const v of [a.token,a.sentence,a.explanationPa]){assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));assert(!personal.test(v));}
}
for(const a of CP007_VISMIK_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");assert(a.donorKey||a.priorApprovedIds.length,a.id+": provenance required");
 assert(a.sentence.includes(a.token),a.id+": token missing from sentence");assert.equal(a.distractors.length,3);assert.equal(new Set(a.distractors).size,3);assert(!a.distractors.includes(a.token as never));
 for(const v of [a.token,a.sentence,a.context,a.explanationPa,...a.distractors]){assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
}
for(const weak of ["ਸਕੂਲੋਂ","ਕਿਨਾਰੇ","ਭਾਈਆ!","ਬੀਬਾ!"])assert(!CP007_KARAK_AUTHORITIES.some(x=>x.target===weak),weak+": weak-marker karak leaked");

const breadth=getCP007BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,191);
assert.deepEqual(breadth.capacities,{F01:95,F02:95,F03:95,F04:36,F05:23,F06:23,F07:37,F08:2185,F09:3312});
assert.equal(breadth.totalSemanticCapacity,5901);

const global=new Set<string>(),verdicts=new Set<string>();
for(const family of CP007_FAMILIES){
 const cap=family.semanticCapacity,local=new Set<string>(),first=new Set<string>(),second=new Set<string>();
 for(const difficulty of family.targetDifficulties)for(let seed=1;seed<=cap;seed++){
  const q=family.generate(seed,difficulty);
  assert.equal(q.options.length,4,q.id+": four options required");assert.equal(new Set(q.options).size,4,q.id+": duplicate options");assert(q.correctIndex>=0&&q.correctIndex<4);
  assert.equal(q.metadata.cpId,"PUN-001-CP007");assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");assert.equal(q.metadata.subtype,family.subtype);
  assert(!/[A-Za-z]/.test(q.stem+q.explanation),q.id+": English leakage");assert(!banned.test(q.stem+q.explanation));assert(!personal.test(q.stem+q.explanation));
  assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
  assert(!global.has(q.metadata.fingerprint),q.id+": cross-family collision");global.add(q.metadata.fingerprint);
  first.add(q.metadata.authorityIds[0]!);if(q.metadata.authorityIds[1])second.add(q.metadata.authorityIds[1]!);
  if(family.familyId==="F09")verdicts.add(q.options[q.correctIndex]!);
 }
 assert.equal(local.size,cap,family.familyId+": capacity mismatch");
 if(["F01","F02","F03"].includes(family.familyId))assert.equal(first.size,95);
 if(family.familyId==="F04")assert.equal(first.size,36);
 if(["F05","F06"].includes(family.familyId))assert.equal(first.size,23);
 if(family.familyId==="F07")assert.equal(first.size,37);
 if(family.familyId==="F08"){assert.equal(first.size,95);assert.equal(second.size,23);}
 if(family.familyId==="F09"){assert.equal(first.size,36);assert.equal(second.size,23);}
}
assert.equal(global.size,5901);assert.equal(verdicts.size,4);
const karakKinds=new Set(CP007_KARAK_AUTHORITIES.map(x=>x.kind));assert.equal(karakKinds.size,8);
const yKinds=new Set(CP007_YOJAK_AUTHORITIES.map(x=>x.kind));assert.equal(yKinds.size,2);
const sKinds=new Set(CP007_ALL_SAMBANDHAK_AUTHORITIES.map(x=>x.kind));assert.equal(sKinds.size,3);
const sKindCounts=CP007_ALL_SAMBANDHAK_AUTHORITIES.reduce((m,a)=>(m[a.kind]=(m[a.kind]??0)+1,m),{} as Record<string,number>);assert.deepEqual(sKindCounts,{PURAN:12,APURAN:12,DUBAJRA:12});
console.log("CP007 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,f09TruthOutcomes:[...verdicts]},null,2));
