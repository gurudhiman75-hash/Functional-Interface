import assert from "node:assert/strict";
import { CP011_AUTHORITIES } from "./CP011-authorities";
import { CP011_FAMILIES,getCP011BreadthReport } from "./engine";
const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP011_AUTHORITIES.length,170);
assert.equal(CP011_FAMILIES.length,8);
const ids=new Set<string>(),idioms=new Set<string>(),meanings=new Set<string>();
for(const a of CP011_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);
 assert(!idioms.has(a.idiomPa),a.id+": duplicate idiom");idioms.add(a.idiomPa);
 assert(!meanings.has(a.meaningPa),a.id+": duplicate governed meaning");meanings.add(a.meaningPa);
 assert(a.donorIds.length>=1,a.id+": donor provenance required");
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert(/_{3,}/.test(a.contextSentence),a.id+": authored context blank required");
 assert.notEqual(a.literalTrapPa,a.meaningPa,a.id+": literal trap cannot equal meaning");
 for(const v of [a.idiomPa,a.meaningPa,a.contextSentence,a.literalTrapPa,a.explanationPa]){
  assert.equal(v,v.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(v),a.id+": English leakage");
  assert(!banned.test(v),a.id+": editorial clutter");
 }
}
for(const removed of ["ਖ਼ੂਨ ਖ਼ੌਲਣਾ","ਗਲ਼ ਪੈਣਾ","ਗਲ਼ ਪਿਆ ਢੋਲ ਵਜਾਉਣਾ","ਅਸਮਾਨ ਸਿਰ 'ਤੇ ਚੁੱਕਣਾ","ਅੰਗੂਠਾ ਵਿਖਾਉਣਾ","ਧੂੜ ਚੱਟਣਾ","ਦੰਦ ਪੀਸਣਾ"])assert(!idioms.has(removed),removed+": duplicate spelling variant leaked");
const breadth=getCP011BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,170);
assert.equal(breadth.safeOrderedPairs,28344);
assert.equal(breadth.totalSemanticCapacity,170914);
const expected:Record<string,number>={F01:170,F02:170,F03:170,F04:170,F05:170,F06:28344,F07:28344,F08:113376};
const global=new Set<string>(),outcomes=new Set<string>();
for(const family of CP011_FAMILIES){
 assert.equal(family.semanticCapacity,expected[family.familyId]);
 const local=new Set<string>(),first=new Set<string>(),second=new Set<string>();
 for(const difficulty of family.targetDifficulties)for(let seed=1;seed<=family.semanticCapacity;seed++){
  const q=family.generate(seed,difficulty);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
  assert(q.correctIndex>=0&&q.correctIndex<4);assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");assert.equal(q.metadata.subtype,family.subtype);
  assert(!/[A-Za-z]/.test(q.stem+" "+q.explanation),q.id+": English leak");assert(!banned.test(q.stem+" "+q.explanation),q.id+": clutter");
  assert(!local.has(q.metadata.fingerprint),q.id+": local duplicate");local.add(q.metadata.fingerprint);
  assert(!global.has(q.metadata.fingerprint),q.id+": global duplicate");global.add(q.metadata.fingerprint);
  first.add(q.metadata.authorityIds[0]!);if(q.metadata.authorityIds[1])second.add(q.metadata.authorityIds[1]!);
  if(family.familyId==="F08")outcomes.add(q.options[q.correctIndex]!);
 }
 assert.equal(local.size,family.semanticCapacity,family.familyId+": capacity mismatch");
 assert.equal(first.size,170,family.familyId+": primary authority coverage required");
 if(["F06","F07","F08"].includes(family.familyId))assert.equal(second.size,170,family.familyId+": second-position coverage required");
}
assert.equal(global.size,170914);
assert.equal(outcomes.size,4);
console.log("CP011 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...outcomes]},null,2));