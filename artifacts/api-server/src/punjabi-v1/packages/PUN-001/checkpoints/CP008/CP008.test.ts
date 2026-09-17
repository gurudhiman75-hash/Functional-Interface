import assert from "node:assert/strict";
import { CP008_AFFIX_AUTHORITIES,CP008_DERIVATION_AUTHORITIES,CP008_PREFIX_DERIVATIONS,CP008_SUFFIX_DERIVATIONS } from "./CP008-authorities";
import { CP008_FAMILIES,getCP008BreadthReport } from "./engine";

const report=getCP008BreadthReport();
assert.equal(CP008_AFFIX_AUTHORITIES.length,12);
assert.equal(CP008_DERIVATION_AUTHORITIES.length,48);
assert.equal(CP008_PREFIX_DERIVATIONS.length,24);
assert.equal(CP008_SUFFIX_DERIVATIONS.length,24);
assert.equal(report.totalAtomicAuthorities,60);
assert.equal(CP008_FAMILIES.length,8);
assert.equal(report.totalSemanticCapacity,3084);

const authorityIds=new Set([...CP008_AFFIX_AUTHORITIES.map(x=>x.id),...CP008_DERIVATION_AUTHORITIES.map(x=>x.id)]);
assert.equal(authorityIds.size,60,"CP008 authority IDs must be unique");
for(const d of CP008_DERIVATION_AUTHORITIES){
 assert(CP008_AFFIX_AUTHORITIES.some(a=>a.id===d.affixId&&a.affix===d.affix&&a.type===d.type),`Broken derivation authority ${d.id}`);
 assert(d.root.trim()&&d.derived.trim()&&d.explanationPa.trim(),`Incomplete derivation ${d.id}`);
}

const fingerprints=new Set<string>();
const ids=new Set<string>();
const verdicts=new Set<string>();
let proofCount=0;
for(const family of CP008_FAMILIES){
 const difficulty=family.targetDifficulties[0]!;
 for(let seed=1;seed<=family.semanticCapacity;seed++){
  const q=family.generate(seed,difficulty);
  proofCount++;
  assert.equal(q.metadata.cpId,"PUN-001-CP008");
  assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
  assert.equal(q.metadata.familyId,family.familyId);
  assert.equal(q.difficulty,difficulty);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map(x=>x.normalize("NFC"))).size,4,`${family.familyId} seed ${seed}: duplicate options`);
  assert(q.correctIndex>=0&&q.correctIndex<4);
  assert(!/[A-Za-z]/u.test(`${q.stem} ${q.explanation}`),`${family.familyId} seed ${seed}: English leakage`);
  assert(!/(ਬਾਕੀ ਵਿਕਲਪ|ਬਾਕੀ ਤਿੰਨੇ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ)/u.test(`${q.stem} ${q.explanation}`),`${family.familyId} seed ${seed}: editorial clutter`);
  assert(Array.isArray(q.metadata.authorityIds)&&q.metadata.authorityIds.length>0);
  for(const id of q.metadata.authorityIds as string[])assert(authorityIds.has(id),`Unknown authority ${id}`);
  const fp=String(q.metadata.fingerprint);assert(!fingerprints.has(fp),`Duplicate fingerprint ${fp}`);fingerprints.add(fp);
  assert(!ids.has(q.id),`Duplicate question ID ${q.id}`);ids.add(q.id);
  if(family.familyId==="F08")verdicts.add(q.options[q.correctIndex]!);
 }
}
assert.equal(proofCount,3084);
assert.deepEqual(new Set(["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"]),verdicts);

const easy=CP008_FAMILIES.filter(f=>f.targetDifficulties.includes("Easy")).map(f=>f.generate(1,"Easy"));
const hard=CP008_FAMILIES.filter(f=>f.targetDifficulties.includes("Hard")).map(f=>f.generate(1,"Hard"));
assert(Math.min(...hard.map(q=>(q.metadata.authorityIds as string[]).length))>Math.max(...easy.map(q=>(q.metadata.authorityIds as string[]).length)),"Hard CP008 questions must combine more authorities than Easy questions");

console.log(`CP008 semantic proof passed: ${proofCount} governed questions, ${fingerprints.size} unique fingerprints.`);
