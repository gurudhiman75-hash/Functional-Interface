import assert from "node:assert/strict";
import { CP012_AUTHORITIES } from "./CP012-authorities";
import { CP012_FAMILIES,getCP012BreadthReport } from "./engine";

assert.equal(CP012_AUTHORITIES.length,133);
assert.equal(CP012_FAMILIES.length,8);

const ids=new Set<string>(),proverbs=new Set<string>(),firsts=new Set<string>(),seconds=new Set<string>(),meanings=new Set<string>();
for(const a of CP012_AUTHORITIES){
 assert(!ids.has(a.id),`${a.id}: duplicate authority id`);ids.add(a.id);
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 for(const value of [a.proverbPa,a.firstPartPa,a.secondPartPa,a.meaningPa,a.situationPa,...a.distractors,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),`${a.id}: NFC required`);
  assert(!/[A-Za-z]/.test(value),`${a.id}: English leakage in learner-facing authority`);
  assert(!/(ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ|ਬਾਕੀ ਤਿੰਨ)/u.test(value),`${a.id}: editorial clutter`);
 }
 assert.equal(a.distractors.length,3,`${a.id}: three reviewed distractors required`);
 assert.equal(new Set(a.distractors).size,3,`${a.id}: distractors must be unique`);
 assert(!a.distractors.includes(a.meaningPa as never),`${a.id}: correct meaning leaked into distractors`);
 assert(!proverbs.has(a.proverbPa),`${a.id}: duplicate proverb`);proverbs.add(a.proverbPa);
 assert(!firsts.has(a.firstPartPa),`${a.id}: duplicate first half`);firsts.add(a.firstPartPa);
 assert(!seconds.has(a.secondPartPa),`${a.id}: duplicate second half`);seconds.add(a.secondPartPa);
 assert(!meanings.has(a.meaningPa),`${a.id}: duplicate meaning`);meanings.add(a.meaningPa);
 assert(a.proverbPa.includes(a.firstPartPa)&&a.proverbPa.includes(a.secondPartPa),`${a.id}: halves must belong to proverb`);
}
assert.equal(ids.size,133);
assert.equal(proverbs.size,133);
assert.equal(firsts.size,133);
assert.equal(seconds.size,133);
assert.equal(meanings.size,133);

const breadth=getCP012BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,133);
assert.equal(breadth.totalSemanticCapacity,6118);

const global=new Set<string>();
const f08Verdicts=new Set<string>();
for(const family of CP012_FAMILIES){
 const local=new Set<string>();
 const targetAuthorityCoverage=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,`${q.id}: four options required`);
   assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);
   assert(q.correctIndex>=0&&q.correctIndex<4,`${q.id}: invalid correct index`);
   assert.equal(q.metadata.cpId,"PUN-001-CP012");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),`${q.id}: English leaked into stem`);
   assert(!/[A-Za-z]/.test(q.explanation),`${q.id}: English leaked into explanation`);
   assert(!/(ਬਾਕੀ ਵਿਕਲਪ|ਬਾਕੀ ਤਿੰਨੇ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u.test(`${q.stem} ${q.explanation}`),`${q.id}: editorial filler`);
   if(family.familyId==="F05"){
    const authority=CP012_AUTHORITIES.find(a=>a.id===q.metadata.authorityIds[0])!;
    assert(q.stem.includes(authority.situationPa),`${q.id}: situation family must use authored authority situation`);
   }
   assert(!local.has(q.metadata.fingerprint),`${q.id}: duplicate family fingerprint`);local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),`${q.id}: cross-family collision`);global.add(q.metadata.fingerprint);
   targetAuthorityCoverage.add(q.metadata.authorityIds[0]!);
   if(family.familyId==="F08")f08Verdicts.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,`${family.familyId}: semantic capacity mismatch`);
 assert.equal(targetAuthorityCoverage.size,133,`${family.familyId}: every exhaustive CP012 authority must be exercised as a target`);
}
assert.equal(global.size,6118);
assert.equal(f08Verdicts.size,4,"F08 must expose all four truth outcomes");

const easy=CP012_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const medium=CP012_FAMILIES.find(x=>x.familyId==="F05")!.generate(1,"Medium");
const hard=CP012_FAMILIES.find(x=>x.familyId==="F07")!.generate(1,"Hard");
assert.equal(easy.metadata.authorityIds.length,1,"Easy direct meaning should use one authority");
assert(medium.metadata.authorityIds.length>1,"Medium situation choice must compare multiple authorities");
assert(hard.stem.includes("1.")&&hard.stem.includes("2."),"Hard must require two ordered judgments");

console.log(`CP012 exhaustive semantic gates passed: ${global.size} proof questions`);
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...f08Verdicts]},null,2));
