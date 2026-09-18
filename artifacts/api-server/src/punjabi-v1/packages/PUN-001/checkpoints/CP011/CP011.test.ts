import assert from "node:assert/strict";
import { CP011_AUTHORITIES,CP011_THEMES,cp011ItemsInTheme } from "./CP011-authorities";
import { CP011_FAMILIES,getCP011BreadthReport } from "./engine";

assert.equal(CP011_AUTHORITIES.length,64);
assert.equal(CP011_THEMES.length,8);
assert.equal(CP011_FAMILIES.length,8);
for(const theme of CP011_THEMES)assert.equal(cp011ItemsInTheme(theme).length,8,`${theme}: expected eight authorities`);

const ids=new Set<string>();
const idioms=new Set<string>();
const contexts=new Set<string>();
for(const a of CP011_AUTHORITIES){
 assert(!ids.has(a.id),`${a.id}: duplicate authority id`);ids.add(a.id);
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 for(const value of [a.idiomPa,a.meaningPa,a.contextSentence,a.literalTrapPa,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),`${a.id}: NFC required`);
  assert(!/[A-Za-z]/.test(value),`${a.id}: English leakage in learner authority`);
  assert(!/(ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ|ਬਾਕੀ ਤਿੰਨ)/u.test(value),`${a.id}: editorial clutter`);
 }
 assert(!idioms.has(a.idiomPa),`${a.id}: duplicate idiom ${a.idiomPa}`);idioms.add(a.idiomPa);
 assert(!contexts.has(a.contextSentence),`${a.id}: duplicate context`);contexts.add(a.contextSentence);
 assert(a.contextSentence.includes("____"),`${a.id}: authored context must contain one blank`);
 assert.notEqual(a.meaningPa,a.literalTrapPa,`${a.id}: literal trap must differ from idiomatic meaning`);
}
assert.equal(ids.size,64);
assert.equal(idioms.size,64);
assert.equal(contexts.size,64);

const breadth=getCP011BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,64);
assert.equal(breadth.totalThemes,8);
assert.equal(breadth.totalSemanticCapacity,3392);

const global=new Set<string>();
const f08Verdicts=new Set<string>();
for(const family of CP011_FAMILIES){
 const local=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,`${q.id}: four options required`);
   assert.equal(new Set(q.options).size,4,`${q.id}: duplicate options`);
   assert(q.correctIndex>=0&&q.correctIndex<4,`${q.id}: invalid correct index`);
   assert.equal(q.metadata.cpId,"PUN-001-CP011");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),`${q.id}: English leaked into stem`);
   assert(!/[A-Za-z]/.test(q.explanation),`${q.id}: English leaked into explanation`);
   assert(!/(ਬਾਕੀ ਵਿਕਲਪ|ਬਾਕੀ ਤਿੰਨੇ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਟਕਸਾਲੀ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u.test(`${q.stem} ${q.explanation}`),`${q.id}: editorial filler`);
   if(family.familyId==="F03")assert(q.stem.includes("____"),`${q.id}: context family must use authored blank sentence`);
   assert(!local.has(q.metadata.fingerprint),`${q.id}: duplicate family fingerprint`);local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),`${q.id}: cross-family collision`);global.add(q.metadata.fingerprint);
   if(family.familyId==="F08")f08Verdicts.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,`${family.familyId}: semantic capacity mismatch`);
}
assert.equal(global.size,3392);
assert.equal(f08Verdicts.size,4,"F08 must expose all four truth outcomes");

const easy=CP011_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const medium=CP011_FAMILIES.find(x=>x.familyId==="F03")!.generate(1,"Medium");
const hard=CP011_FAMILIES.find(x=>x.familyId==="F07")!.generate(1,"Hard");
assert.equal(easy.metadata.authorityIds.length,1,"Easy should be a direct single-authority judgment");
assert(medium.metadata.authorityIds.length>1,"Medium context choice must compare multiple authorities");
assert(hard.stem.includes("1.")&&hard.stem.includes("2."),"Hard must require two ordered judgments");

console.log(`CP011 exhaustive semantic gates passed: ${global.size} proof questions`);
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...f08Verdicts]},null,2));
