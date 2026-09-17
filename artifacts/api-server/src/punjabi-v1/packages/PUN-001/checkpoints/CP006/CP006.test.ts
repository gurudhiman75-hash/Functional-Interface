import assert from "node:assert/strict";
import { CP006_ASPECT_AUTHORITIES } from "./CP006-aspects";
import { CP006_TENSE_TRIPLETS, CP006_VERB_AUTHORITIES } from "./CP006-authorities";
import { CP006_FAMILIES, getCP006BreadthReport } from "./engine";

assert.equal(CP006_VERB_AUTHORITIES.length,24,"CP006 must expose 24 audited verb contexts");
assert.equal(CP006_TENSE_TRIPLETS.length,12,"CP006 must expose 12 tense triplets");
assert.equal(CP006_ASPECT_AUTHORITIES.length,12,"CP006 must expose 12 aspect contexts");
assert.equal(CP006_FAMILIES.length,9,"CP006 must expose 9 operation families");

const authorityIds=new Set<string>();
for(const a of CP006_VERB_AUTHORITIES){
 assert(!authorityIds.has(a.id),`${a.id}: duplicate authority id`);authorityIds.add(a.id);
 assert.equal(a.sentence,a.sentence.normalize("NFC"));assert.equal(a.verbPhrase,a.verbPhrase.normalize("NFC"));
 assert(!/[A-Za-z]/.test(a.sentence));assert(!/[A-Za-z]/.test(a.explanationPa));
 assert.equal(a.sentenceDistractors.length,3);assert.equal(new Set(a.sentenceDistractors).size,3);
 assert(!a.sentenceDistractors.includes(a.verbPhrase as never));assert.equal(a.sourceStatus,"REVIEW_PENDING");
 if(a.verbType==="SAKARMAK"){assert(a.directObject,`${a.id}: transitive authority missing object`);assert(a.objectDistractors,`${a.id}: transitive authority missing object distractors`);assert.equal(new Set(a.objectDistractors).size,3);}
}
for(const t of CP006_TENSE_TRIPLETS){assert(!authorityIds.has(t.id));authorityIds.add(t.id);for(const text of [t.present,t.past,t.future,t.pastNearMiss,t.futureNearMiss,t.explanationPa]){assert.equal(text,text.normalize("NFC"));assert(!/[A-Za-z]/.test(text));}assert.equal(t.sourceStatus,"REVIEW_PENDING");}
for(const a of CP006_ASPECT_AUTHORITIES){assert(!authorityIds.has(a.id));authorityIds.add(a.id);assert(!/[A-Za-z]/.test(a.sentence));assert(!/[A-Za-z]/.test(a.explanationPa));assert.equal(a.sourceStatus,"REVIEW_PENDING");}

const breadth=getCP006BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,48);
assert.equal(breadth.totalSemanticCapacity,731);
const global=new Set<string>();
const patterns=new Map<string,Set<string>>();
const verdicts=new Set<string>();
for(const family of CP006_FAMILIES){
 const cap=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
 for(const difficulty of family.targetDifficulties){
  const local=new Set<string>();
  for(let seed=1;seed<=cap;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,`${q.id}: four options required`);assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);
   assert(q.correctIndex>=0&&q.correctIndex<4);assert.equal(q.metadata.cpId,"PUN-001-CP006");assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),`${q.id}: English leaked into stem`);assert(!/[A-Za-z]/.test(q.explanation),`${q.id}: English leaked into explanation`);
   assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"));assert(!q.explanation.includes("ਬਾਕੀ ਤਿੰਨੇ"));assert(!q.stem.includes("ਸਿੱਧੇ ਅਰਥ"));assert(!q.stem.includes("ਪ੍ਰਮਾਣਿਤ"));
   assert(!local.has(q.metadata.fingerprint),`${q.id}: duplicate family fingerprint`);local.add(q.metadata.fingerprint);assert(!global.has(q.metadata.fingerprint),`${q.id}: cross-family fingerprint collision`);global.add(q.metadata.fingerprint);
   const pattern=q.stem.replace(/[‘’][^‘’]+[‘’]/g,"‘X’").replace(/ਕਥਨ 1:[^\n]+/g,"ਕਥਨ 1: X").replace(/ਕਥਨ 2:[^\n]+/g,"ਕਥਨ 2: X");
   const set=patterns.get(family.familyId)??new Set<string>();set.add(pattern);patterns.set(family.familyId,set);
   if(family.familyId==="F08")verdicts.add(q.options[q.correctIndex]!);
  }
  assert.equal(local.size,cap,`${family.familyId}: semantic capacity mismatch`);
 }
}
for(const family of CP006_FAMILIES){assert((patterns.get(family.familyId)?.size??0)>1,`${family.familyId}: fixed stem instruction repetition`);}
assert.equal(verdicts.size,4,"F08 must expose all four truth outcomes");

const easy=CP006_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const hard=CP006_FAMILIES.find(x=>x.familyId==="F08")!.generate(1,"Hard");
assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length,"Hard operation must require more semantic decisions than Easy");

console.log(`CP006 exhaustive semantic gates passed: ${global.size} proof questions`);
console.log(JSON.stringify({...breadth,stemPatternCounts:Object.fromEntries([...patterns].map(([id,s])=>[id,s.size])),f08TruthOutcomes:[...verdicts]},null,2));
