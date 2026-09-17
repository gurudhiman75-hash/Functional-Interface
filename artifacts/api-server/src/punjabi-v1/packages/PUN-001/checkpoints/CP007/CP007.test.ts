import assert from "node:assert/strict";
import { CP007_KARAK_AUTHORITIES,CP007_SAMBANDHAK_AUTHORITIES,CP007_VISMIK_AUTHORITIES,CP007_YOJAK_AUTHORITIES } from "./CP007-authorities";
import { CP007_FAMILIES,getCP007BreadthReport } from "./engine";

assert.equal(CP007_KARAK_AUTHORITIES.length,24);
assert.equal(CP007_SAMBANDHAK_AUTHORITIES.length,9);
assert.equal(CP007_YOJAK_AUTHORITIES.length,16);
assert.equal(CP007_VISMIK_AUTHORITIES.length,12);
assert.equal(CP007_FAMILIES.length,9);
const ids=new Set<string>();
for(const group of [CP007_KARAK_AUTHORITIES,CP007_SAMBANDHAK_AUTHORITIES,CP007_YOJAK_AUTHORITIES,CP007_VISMIK_AUTHORITIES] as const){for(const a of group){assert(!ids.has(a.id),`${a.id}: duplicate authority id`);ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");for(const value of Object.values(a)){if(typeof value==="string"){assert.equal(value,value.normalize("NFC"));if(value!==a.id&&value!==a.sourceStatus)assert(!/[A-Za-z]/.test(value),`${a.id}: English leakage in learner authority`);}}}}
for(const a of CP007_KARAK_AUTHORITIES){assert.equal(a.sentenceDistractors.length,3);assert.equal(new Set(a.sentenceDistractors).size,3);assert(!a.sentenceDistractors.includes(a.target as never));}
for(const a of CP007_VISMIK_AUTHORITIES){assert.equal(a.distractors.length,3);assert.equal(new Set(a.distractors).size,3);assert(!a.distractors.includes(a.token as never));}
const breadth=getCP007BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,61);
assert.equal(breadth.totalSemanticCapacity,1085);
const global=new Set<string>();const verdicts=new Set<string>();const familyCounts=new Map<string,number>();
for(const family of CP007_FAMILIES){
 const cap=family.semanticCapacity;const local=new Set<string>();
 for(const difficulty of family.targetDifficulties){for(let seed=1;seed<=cap;seed++){
  const q=family.generate(seed,difficulty);
  assert.equal(q.options.length,4,`${q.id}: four options required`);assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);assert(q.correctIndex>=0&&q.correctIndex<4);
  assert.equal(q.metadata.cpId,"PUN-001-CP007");assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");assert.equal(q.metadata.subtype,family.subtype);
  assert(!/[A-Za-z]/.test(q.stem),`${q.id}: English leaked into stem`);assert(!/[A-Za-z]/.test(q.explanation),`${q.id}: English leaked into explanation`);
  assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"));assert(!q.explanation.includes("ਬਾਕੀ ਤਿੰਨੇ"));assert(!q.stem.includes("ਸਿੱਧੇ ਅਰਥ"));assert(!q.stem.includes("ਪ੍ਰਮਾਣਿਤ"));
  assert(!local.has(q.metadata.fingerprint),`${q.id}: duplicate family fingerprint`);local.add(q.metadata.fingerprint);assert(!global.has(q.metadata.fingerprint),`${q.id}: cross-family collision`);global.add(q.metadata.fingerprint);
  familyCounts.set(family.familyId,(familyCounts.get(family.familyId)??0)+1);if(family.familyId==="F09")verdicts.add(q.options[q.correctIndex]!);
 }}
 assert.equal(local.size,cap,`${family.familyId}: capacity mismatch`);
}
assert.equal(global.size,1085);assert.equal(verdicts.size,4,"F09 must expose all four truth outcomes");
const easy=CP007_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");const hard=CP007_FAMILIES.find(x=>x.familyId==="F08")!.generate(1,"Hard");assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length,"Hard must combine more authorities than Easy");
console.log(`CP007 exhaustive semantic gates passed: ${global.size} proof questions`);
console.log(JSON.stringify({...breadth,f09TruthOutcomes:[...verdicts]},null,2));
