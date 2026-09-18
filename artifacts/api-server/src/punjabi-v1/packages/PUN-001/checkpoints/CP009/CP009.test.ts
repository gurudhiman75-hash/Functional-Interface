import assert from "node:assert/strict";
import { CP009_ANTONYM_AUTHORITIES,CP009_CONTEXT_AUTHORITIES,CP009_SYNONYM_AUTHORITIES } from "./CP009-authorities";
import { CP009_FAMILIES,getCP009BreadthReport } from "./engine";

assert.equal(CP009_SYNONYM_AUTHORITIES.length,24);
assert.equal(CP009_ANTONYM_AUTHORITIES.length,32);
assert.equal(CP009_CONTEXT_AUTHORITIES.length,8);
assert.equal(CP009_FAMILIES.length,8);

const ids=new Set<string>();
function learnerText(id:string,values:readonly string[]){
 for(const value of values){
  assert.equal(value,value.normalize("NFC"),`${id}: NFC required`);
  assert(!/[A-Za-z]/.test(value),`${id}: English leakage in learner-facing authority text`);
  assert(!/(ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ)/u.test(value),`${id}: editorial clutter`);
 }
}
for(const a of CP009_SYNONYM_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");
 learnerText(a.id,[a.headword,...a.synonyms,...a.outsiders,a.explanationPa]);
 assert.equal(new Set(a.synonyms).size,3,`${a.id}: synonyms must be unique`);
 assert.equal(new Set(a.outsiders).size,4,`${a.id}: outsiders must be unique`);
 for(const s of a.synonyms)assert(!a.outsiders.includes(s as never),`${a.id}: synonym/outsider overlap`);
 assert(!a.synonyms.includes(a.headword as never),`${a.id}: headword repeated as synonym`);
}
for(const a of CP009_ANTONYM_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");
 learnerText(a.id,[a.word,a.antonym,...a.sourceConfusables,a.explanationPa]);
 assert.notEqual(a.word,a.antonym);
 assert.equal(new Set(a.sourceConfusables).size,3,`${a.id}: source confusables must be unique`);
 assert(!a.sourceConfusables.includes(a.antonym as never),`${a.id}: antonym leaked into confusables`);
}
for(const a of CP009_CONTEXT_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert.equal(a.sourceStatus,"REVIEW_PENDING");
 learnerText(a.id,[a.termA,a.termB,a.sentence,a.correctTerm,...a.distractors,a.explanationPa]);
 assert.equal(new Set(a.distractors).size,3,`${a.id}: context distractors must be unique`);
 assert(!a.distractors.includes(a.correctTerm as never),`${a.id}: correct term repeated as distractor`);
 assert(a.sentence.includes("____"),`${a.id}: context sentence must contain one blank`);
}
assert.equal(ids.size,64);

const breadth=getCP009BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,64);
assert.equal(breadth.totalSemanticCapacity,4848);

const global=new Set<string>();
const f07Answers=new Set<string>();
const f08Verdicts=new Set<string>();
for(const family of CP009_FAMILIES){
 const local=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,`${q.id}: four options required`);
   assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);
   assert(q.correctIndex>=0&&q.correctIndex<4,`${q.id}: invalid correct index`);
   assert.equal(q.metadata.cpId,"PUN-001-CP009");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),`${q.id}: English leaked into stem`);
   assert(!/[A-Za-z]/.test(q.explanation),`${q.id}: English leaked into explanation`);
   assert(!/(ਬਾਕੀ ਵਿਕਲਪ|ਬਾਕੀ ਤਿੰਨੇ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਸ਼ਾਰਟਕੱਟ|ਟ੍ਰਿਕ)/u.test(`${q.stem} ${q.explanation}`),`${q.id}: editorial filler`);
   assert(!local.has(q.metadata.fingerprint),`${q.id}: duplicate family fingerprint`);local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),`${q.id}: cross-family collision`);global.add(q.metadata.fingerprint);
   if(family.familyId==="F07")f07Answers.add(q.options[q.correctIndex]!);
   if(family.familyId==="F08")f08Verdicts.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,`${family.familyId}: semantic capacity mismatch`);
}
assert.equal(global.size,4848);
assert.equal(f07Answers.size,2,"F07 must expose both ordering outcomes");
assert.equal(f08Verdicts.size,4,"F08 must expose all four truth outcomes");

const easy=CP009_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const medium=CP009_FAMILIES.find(x=>x.familyId==="F05")!.generate(1,"Medium");
const hard=CP009_FAMILIES.find(x=>x.familyId==="F07")!.generate(1,"Hard");
assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length,"Hard must combine more authorities than Easy");
assert(hard.metadata.authorityIds.length>medium.metadata.authorityIds.length,"Hard must combine more authorities than Medium");

console.log(`CP009 exhaustive semantic gates passed: ${global.size} proof questions`);
console.log(JSON.stringify({...breadth,f07Outcomes:[...f07Answers],f08TruthOutcomes:[...f08Verdicts]},null,2));
