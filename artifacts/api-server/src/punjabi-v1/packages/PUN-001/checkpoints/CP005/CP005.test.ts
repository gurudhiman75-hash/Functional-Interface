import assert from "node:assert/strict";
import { CP005_ADJECTIVES,CP005_ADVERBS,CP005_TYPE_OPTIONS } from "./CP005-authorities";
import { CP005_FAMILIES,getCP005BreadthReport } from "./generator";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਤਿੰਨੇ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP005_ADJECTIVES.length,151);
assert.equal(CP005_ADVERBS.length,111);
assert.equal(CP005_FAMILIES.length,8);
assert.equal(CP005_TYPE_OPTIONS.adjective.length,5);
assert.equal(CP005_TYPE_OPTIONS.adverb.length,5);

const adjCounts=new Map<string,number>(),advCounts=new Map<string,number>();
const ids=new Set<string>(),sentences=new Set<string>();
for(const a of [...CP005_ADJECTIVES,...CP005_ADVERBS]){
  assert(!ids.has(a.id),a.id+": duplicate authority id");ids.add(a.id);
  assert(!sentences.has(a.sentence),a.id+": duplicate authority sentence");sentences.add(a.sentence);
  assert(a.sentence.includes(a.target),a.id+": target must occur in its sentence");
  assert(a.donorKeys.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
  assert.equal(a.sourceStatus,"REVIEW_PENDING");
  for(const value of [a.sentence,a.target,a.typePa,a.meaningPa]){
    assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
    assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
    assert(!banned.test(value),a.id+": editorial clutter");
  }
}
for(const a of CP005_ADJECTIVES)adjCounts.set(a.type,(adjCounts.get(a.type)??0)+1);
for(const a of CP005_ADVERBS)advCounts.set(a.type,(advCounts.get(a.type)??0)+1);
assert.deepEqual(Object.fromEntries(adjCounts),{GUN:50,SANKHYA:40,PARIMAN:31,NISHCHAY:12,PADNAVI:18});
assert.deepEqual(Object.fromEntries(advCounts),{KAAL:25,ASTHAN:26,DHANG:27,PARIMAN:17,SANKHYA:16});

assert.equal(CP005_ADJECTIVES.filter(x=>x.priorApprovedIds.length>0).length,25,"all approved adjective authorities must survive");
assert.equal(CP005_ADVERBS.filter(x=>x.priorApprovedIds.length>0).length,20,"all approved adverb authorities must survive");
for(const forbidden of ["KARAN","TAKID","NIRNAY"])assert(!CP005_ADVERBS.some(x=>x.type===forbidden),forbidden+": noisy donor adverb category leaked");
for(const forbidden of ["ਕਿਲੋਗ੍ਰਾਮ","ਟਨ","ਕੁਇੰਟਲ"])assert(!CP005_ADJECTIVES.some(x=>x.target===forbidden),forbidden+": bare unit leaked as adjective authority");

const breadth=getCP005BreadthReport();
assert.equal(breadth.adjectiveAuthorities,151);
assert.equal(breadth.adverbAuthorities,111);
assert.equal(breadth.totalAtomicAuthorities,262);
assert.deepEqual(breadth.capacities,{F01:151,F02:151,F03:151,F04:111,F05:111,F06:16761,F07:16761,F08:67044});
assert.equal(breadth.totalSemanticCapacity,101241);

const global=new Set<string>(),outcomes=new Set<string>();
for(const family of CP005_FAMILIES){
 const cap=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
 const local=new Set<string>(),first=new Set<string>(),second=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=cap;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,q.id+": four options required");
   assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
   assert(q.correctIndex>=0&&q.correctIndex<4,q.id+": invalid correct index");
   assert.equal(q.metadata.cpId,"PUN-001-CP005");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem+q.explanation),q.id+": English leakage");
   assert(!banned.test(q.stem+q.explanation),q.id+": editorial clutter");
   assert(!q.stem.includes("____"),q.id+": unresolved blank leaked");
   assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),q.id+": cross-family fingerprint collision");global.add(q.metadata.fingerprint);
   first.add(q.metadata.authorityIds[0]!);if(q.metadata.authorityIds[1])second.add(q.metadata.authorityIds[1]!);
   if(family.familyId==="F08")outcomes.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,cap,family.familyId+": capacity mismatch");
 if(["F01","F02","F03"].includes(family.familyId))assert.equal(first.size,151,family.familyId+": all adjective authorities must be reachable");
 if(["F04","F05"].includes(family.familyId))assert.equal(first.size,111,family.familyId+": all adverb authorities must be reachable");
 if(["F06","F07","F08"].includes(family.familyId)){assert.equal(first.size,151);assert.equal(second.size,111);}
}
assert.equal(global.size,101241);
assert.deepEqual(outcomes,new Set(["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"]));

const f03=CP005_FAMILIES.find(x=>x.familyId==="F03")!;
for(let seed=1;seed<=151;seed++){const q=f03.generate(seed,"Medium");assert(q.options.every(o=>o.includes(" — ")),q.id+": F03 must test type + function");}
const easy=CP005_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const hard=CP005_FAMILIES.find(x=>x.familyId==="F08")!.generate(1,"Hard");
assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length);
console.log("CP005 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,adjectiveTypeCounts:Object.fromEntries(adjCounts),adverbTypeCounts:Object.fromEntries(advCounts),f08TruthOutcomes:[...outcomes]},null,2));
