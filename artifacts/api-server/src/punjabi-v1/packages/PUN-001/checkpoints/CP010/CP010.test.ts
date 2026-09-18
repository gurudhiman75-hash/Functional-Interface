import assert from "node:assert/strict";
import { CP010_AUTHORITIES,CP010_DOMAINS,cp010ItemsInDomain } from "./CP010-authorities";
import { CP010_FAMILIES,getCP010BreadthReport } from "./engine";

assert.equal(CP010_AUTHORITIES.length,64);
assert.equal(CP010_DOMAINS.length,8);
assert.equal(CP010_FAMILIES.length,8);
for(const domain of CP010_DOMAINS)assert.equal(cp010ItemsInDomain(domain).length,8,`${domain}: expected eight authorities`);

const ids=new Set<string>();
const words=new Set<string>();
const phrases=new Set<string>();
for(const a of CP010_AUTHORITIES){
 assert(!ids.has(a.id),`${a.id}: duplicate authority id`);ids.add(a.id);
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 for(const value of [a.phrasePa,a.wordPa,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),`${a.id}: NFC required`);
  assert(!/[A-Za-z]/.test(value),`${a.id}: English leakage in learner authority`);
  assert(!/(ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u.test(value),`${a.id}: editorial clutter`);
 }
 assert(!words.has(a.wordPa),`${a.id}: duplicate one-word answer ${a.wordPa}`);words.add(a.wordPa);
 assert(!phrases.has(a.phrasePa),`${a.id}: duplicate phrase ${a.phrasePa}`);phrases.add(a.phrasePa);
}
assert.equal(ids.size,64);
assert.equal(words.size,64);
assert.equal(phrases.size,64);

const breadth=getCP010BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,64);
assert.equal(breadth.totalDomains,8);
assert.equal(breadth.totalSemanticCapacity,3008);

const global=new Set<string>();
const f08Verdicts=new Set<string>();
for(const family of CP010_FAMILIES){
 const local=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,`${q.id}: four options required`);
   assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);
   assert(q.correctIndex>=0&&q.correctIndex<4,`${q.id}: invalid correct index`);
   assert.equal(q.metadata.cpId,"PUN-001-CP010");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),`${q.id}: English leaked into stem`);
   assert(!/[A-Za-z]/.test(q.explanation),`${q.id}: English leaked into explanation`);
   assert(!/(ਬਾਕੀ ਵਿਕਲਪ|ਬਾਕੀ ਤਿੰਨੇ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u.test(`${q.stem} ${q.explanation}`),`${q.id}: editorial filler`);
   assert(!local.has(q.metadata.fingerprint),`${q.id}: duplicate family fingerprint`);local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),`${q.id}: cross-family collision`);global.add(q.metadata.fingerprint);
   if(family.familyId==="F08")f08Verdicts.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,`${family.familyId}: semantic capacity mismatch`);
}
assert.equal(global.size,3008);
assert.equal(f08Verdicts.size,4,"F08 must expose all four truth outcomes");

const easy=CP010_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const medium=CP010_FAMILIES.find(x=>x.familyId==="F03")!.generate(1,"Medium");
const hard=CP010_FAMILIES.find(x=>x.familyId==="F07")!.generate(1,"Hard");
assert.equal(easy.metadata.authorityIds.length,1,"Easy should be a direct single-authority judgment");
assert(medium.metadata.authorityIds.length>1,"Medium same-domain precision must compare multiple authorities");
assert(hard.stem.includes("1.")&&hard.stem.includes("2."),"Hard must require two ordered judgments");

console.log(`CP010 exhaustive semantic gates passed: ${global.size} proof questions`);
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...f08Verdicts]},null,2));
