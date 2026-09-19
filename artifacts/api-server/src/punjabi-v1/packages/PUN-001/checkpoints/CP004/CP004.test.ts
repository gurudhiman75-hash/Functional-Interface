import assert from "node:assert/strict";
import {
  CP004_AGREEMENT_CONTEXTS,
  CP004_DIRECT_NUMBER_PAIRS,
  CP004_GENDER_PAIRS,
  CP004_NUMBER_PAIRS,
  CP004_TRANSFORM_SAFE_GENDER_PAIRS,
} from "./CP004-authorities";
import { CP004_FAMILIES, getCP004BreadthReport } from "./generator";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਤਿੰਨੇ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP004_GENDER_PAIRS.length,58);
assert.equal(CP004_TRANSFORM_SAFE_GENDER_PAIRS.length,39);
assert.equal(CP004_NUMBER_PAIRS.length,66);
assert.equal(CP004_DIRECT_NUMBER_PAIRS.length,59);
assert.equal(CP004_AGREEMENT_CONTEXTS.length,12);
assert.equal(CP004_FAMILIES.length,9);

const genderIds=new Set<string>(),masculine=new Set<string>(),feminine=new Set<string>();
for(const a of CP004_GENDER_PAIRS){
  assert(!genderIds.has(a.id),a.id+": duplicate gender id");genderIds.add(a.id);
  assert(!masculine.has(a.masculine),a.id+": duplicate masculine source");masculine.add(a.masculine);
  assert(!feminine.has(a.feminine),a.id+": duplicate feminine target");feminine.add(a.feminine);
  assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
  assert.equal(a.sourceStatus,"REVIEW_PENDING");
  assert.equal(a.masculine,a.masculine.normalize("NFC"));
  assert.equal(a.feminine,a.feminine.normalize("NFC"));
  assert(!/[A-Za-z]/.test(a.masculine+a.feminine));
  if(a.transformSafe)assert.equal(a.kind,"MORPHOLOGICAL_PAIR",a.id+": only morphological pairs may transform directly");
}
for(const forbidden of ["ਵਰ","ਜਵਾਈ","ਸੰਤ","ਤੋਤਾ","ਸੁਨਿਆਰ"]){
  assert(!CP004_GENDER_PAIRS.some(x=>x.masculine===forbidden),forbidden+": excluded ambiguous/weak gender authority leaked");
}
assert(!CP004_GENDER_PAIRS.some(x=>x.masculine==="ਊਠ"&&x.feminine==="ਊਠਣੀ"),"ambiguous camel derivative leaked");
assert(CP004_GENDER_PAIRS.some(x=>x.masculine==="ਊਠ"&&x.feminine==="ਡਾਚੀ"),"audited camel lexical counterpart missing");

const numberIds=new Set<string>(),singulars=new Set<string>(),plurals=new Set<string>();
for(const a of CP004_NUMBER_PAIRS){
  assert(!numberIds.has(a.id),a.id+": duplicate number id");numberIds.add(a.id);
  assert(!singulars.has(a.singular),a.id+": duplicate singular source");singulars.add(a.singular);
  assert(!plurals.has(a.plural),a.id+": duplicate plural target");plurals.add(a.plural);
  assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
  assert.equal(a.sourceStatus,"REVIEW_PENDING");
  assert.equal(a.singular,a.singular.normalize("NFC"));
  assert.equal(a.plural,a.plural.normalize("NFC"));
  assert(!/[A-Za-z]/.test(a.singular+a.plural));
  assert.equal(a.directSafe,a.singular!==a.plural,a.id+": directSafe must reflect material transformation");
}
for(const forbidden of ["ਮੇਜ਼","ਬਾਤ","ਬਲਾ"])assert(!CP004_NUMBER_PAIRS.some(x=>x.singular===forbidden),forbidden+": excluded weak number authority leaked");

const contextIds=new Set<string>(),correctContexts=new Set<string>();
for(const a of CP004_AGREEMENT_CONTEXTS){
  assert(!contextIds.has(a.id),a.id+": duplicate context id");contextIds.add(a.id);
  assert(!correctContexts.has(a.correct),a.id+": duplicate correct context");correctContexts.add(a.correct);
  assert.equal(a.incorrect.length,4);
  assert.equal(new Set(a.incorrect).size,4);
  assert(!a.incorrect.includes(a.correct));
  assert(!/[A-Za-z]/.test(a.correct+a.principlePa));
  assert(!banned.test(a.correct+a.principlePa));
  assert.equal(a.sourceStatus,"REVIEW_PENDING");
}

const breadth=getCP004BreadthReport();
assert.equal(breadth.genderAuthorityCount,58);
assert.equal(breadth.transformSafeGenderCount,39);
assert.equal(breadth.numberAuthorityCount,66);
assert.equal(breadth.directNumberAuthorityCount,59);
assert.equal(breadth.agreementContextCount,12);
assert.equal(breadth.totalAtomicAuthorities,136);
assert.equal(breadth.familyCount,9);
assert.deepEqual(breadth.capacities,{F01:78,F02:58,F03:954,F04:59,F05:59,F06:66,F07:12,F08:48,F09:528});
assert.equal(breadth.totalSemanticCapacity,1862);

const global=new Set<string>(),stemPatterns=new Map<string,Set<string>>();
for(const family of CP004_FAMILIES){
  const capacity=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
  const local=new Set<string>(),firstCoverage=new Set<string>(),secondCoverage=new Set<string>();
  const patterns=new Set<string>();stemPatterns.set(family.familyId,patterns);
  for(const difficulty of family.targetDifficulties){
    for(let seed=1;seed<=capacity;seed++){
      const q=family.generate(seed,difficulty);
      assert.equal(q.options.length,4,q.id+": four options required");
      assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
      assert(q.correctIndex>=0&&q.correctIndex<4,q.id+": invalid correct index");
      assert.equal(q.metadata.cpId,"PUN-001-CP004");
      assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
      assert.equal(q.metadata.subtype,family.subtype);
      assert(!/[A-Za-z]/.test(q.stem+q.explanation),q.id+": English leakage");
      assert(!banned.test(q.stem+q.explanation),q.id+": editorial clutter");
      assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
      assert(!global.has(q.metadata.fingerprint),q.id+": cross-family fingerprint collision");global.add(q.metadata.fingerprint);
      firstCoverage.add(q.metadata.authorityIds[0]!);
      if(q.metadata.authorityIds[1])secondCoverage.add(q.metadata.authorityIds[1]!);
      patterns.add(q.stem.replace(/[‘’][^‘’]+[‘’]/g,"‘X’").replace(/ਕਥਨ 1:[^\n]+/g,"ਕਥਨ 1: X").replace(/ਕਥਨ 2:[^\n]+/g,"ਕਥਨ 2: X"));
    }
  }
  assert.equal(local.size,capacity,family.familyId+": capacity mismatch");
  if(family.familyId==="F01")assert.equal(firstCoverage.size,39,"F01 must reach every transform-safe gender authority");
  if(family.familyId==="F02"||family.familyId==="F03")assert.equal(firstCoverage.size,58,family.familyId+": all gender authorities must be reachable");
  if(family.familyId==="F04"||family.familyId==="F05")assert.equal(firstCoverage.size,59,family.familyId+": all direct-safe number authorities must be reachable");
  if(family.familyId==="F06")assert.equal(firstCoverage.size,66,"F06 must reach every number authority including invariable forms");
  if(family.familyId==="F07"||family.familyId==="F08")assert.equal(firstCoverage.size,12,family.familyId+": every context must be reachable");
  if(family.familyId==="F09"){assert.equal(firstCoverage.size,12);assert.equal(secondCoverage.size,12);}
  assert(patterns.size>1,family.familyId+": fixed stem repetition is not allowed");
}
assert.equal(global.size,1862);

const f04=CP004_FAMILIES.find(x=>x.familyId==="F04")!;
const f05=CP004_FAMILIES.find(x=>x.familyId==="F05")!;
for(let seed=1;seed<=59;seed++){
  const q4=f04.generate(seed,"Easy"),a4=CP004_NUMBER_PAIRS.find(x=>x.id===q4.metadata.authorityIds[0])!;
  const q5=f05.generate(seed,"Easy"),a5=CP004_NUMBER_PAIRS.find(x=>x.id===q5.metadata.authorityIds[0])!;
  assert(a4.directSafe&&a5.directSafe,"invariable number authority leaked into direct transformation");
}
const easy=CP004_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const hard=CP004_FAMILIES.find(x=>x.familyId==="F09")!.generate(1,"Hard");
assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length);
console.log("CP004 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,stemPatternCounts:Object.fromEntries([...stemPatterns].map(([k,v])=>[k,v.size]))},null,2));
