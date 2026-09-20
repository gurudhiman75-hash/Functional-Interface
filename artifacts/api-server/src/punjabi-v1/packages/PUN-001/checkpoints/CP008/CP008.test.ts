import assert from "node:assert/strict";
import {
 CP008_AFFIX_AUTHORITIES,CP008_DERIVATION_AUTHORITIES,CP008_PREFIX_AFFIXES,CP008_PREFIX_DERIVATIONS,
 CP008_PREFIX_WORDS,CP008_SUFFIX_AFFIXES,CP008_SUFFIX_DERIVATIONS,CP008_SUFFIX_WORDS,CP008_WORD_AUTHORITIES
} from "./CP008-authorities";
import { CP008_FAMILIES,getCP008BreadthReport } from "./engine";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਤਿੰਨੇ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP008_AFFIX_AUTHORITIES.length,69);
assert.equal(CP008_WORD_AUTHORITIES.length,374);
assert.equal(CP008_DERIVATION_AUTHORITIES.length,63);
assert.equal(CP008_PREFIX_AFFIXES.length,36);
assert.equal(CP008_SUFFIX_AFFIXES.length,33);
assert.equal(CP008_PREFIX_WORDS.length,205);
assert.equal(CP008_SUFFIX_WORDS.length,169);
assert.equal(CP008_PREFIX_DERIVATIONS.length,33);
assert.equal(CP008_SUFFIX_DERIVATIONS.length,30);
assert.equal(CP008_FAMILIES.length,8);

const allIds=new Set<string>(),affixIds=new Set<string>();
for(const a of CP008_AFFIX_AUTHORITIES){
 assert(!allIds.has(a.id),a.id+": duplicate id");allIds.add(a.id);affixIds.add(a.id);
 assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
 for(const v of [a.affix,a.functionLabelPa,a.meaningPa]){assert.equal(v,v.normalize("NFC"));assert(!/[A-Za-z]/.test(v),a.id+": English leakage");assert(!banned.test(v),a.id+": clutter");}
}
const wordKeys=new Set<string>(),derivedTypeKeys=new Set<string>();
for(const w of CP008_WORD_AUTHORITIES){
 assert(!allIds.has(w.id),w.id+": duplicate id");allIds.add(w.id);
 assert(affixIds.has(w.affixId),w.id+": broken affix reference");
 const a=CP008_AFFIX_AUTHORITIES.find(x=>x.id===w.affixId)!;assert.equal(a.affix,w.affix);assert.equal(a.type,w.type);
 const key=[w.type,w.affix,w.derived].join("||");assert(!wordKeys.has(key),w.id+": duplicate membership");wordKeys.add(key);
 const dkey=w.type+"||"+w.derived;if(derivedTypeKeys.has(dkey))throw new Error(w.id+": derived word mapped to multiple affixes");derivedTypeKeys.add(dkey);
 assert(w.donorIds.length>=1||w.priorApprovedIds.length>=1,w.id+": provenance required");
 for(const v of [w.affix,w.derived,w.explanationPa]){assert.equal(v,v.normalize("NFC"));assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
}
const rootKeys=new Set<string>();
for(const d of CP008_DERIVATION_AUTHORITIES){
 assert(!allIds.has(d.id),d.id+": duplicate id");allIds.add(d.id);
 assert(affixIds.has(d.affixId),d.id+": broken affix reference");
 const a=CP008_AFFIX_AUTHORITIES.find(x=>x.id===d.affixId)!;assert.equal(a.affix,d.affix);assert.equal(a.type,d.type);
 const key=[d.type,d.affix,d.root,d.derived].join("||");assert(!rootKeys.has(key),d.id+": duplicate root derivation");rootKeys.add(key);
 assert(d.donorIds.length>=1||d.priorApprovedIds.length>=1,d.id+": provenance required");
 assert(CP008_WORD_AUTHORITIES.some(w=>w.type===d.type&&w.affix===d.affix&&w.derived===d.derived),d.id+": explicit root derivation must also be a valid affix membership");
 for(const v of [d.affix,d.root,d.derived,d.explanationPa]){assert.equal(v,v.normalize("NFC"));assert(!/[A-Za-z]/.test(v),d.id+": English leakage");assert(!banned.test(v),d.id+": clutter");}
}
assert.equal(allIds.size,506);
for(const bad of ["ਗ਼ੈਰਕਾਨੂੰਨੀ","ਲਿਖਾਵਟ"]){
 const root=CP008_DERIVATION_AUTHORITIES.find(x=>x.derived===bad);
 assert(!root||root.priorApprovedIds.length>0,bad+": excluded donor multi-step root record leaked");
}

const breadth=getCP008BreadthReport();
assert.equal(breadth.affixConcepts,69);
assert.equal(breadth.wordMembershipAuthorities,374);
assert.equal(breadth.rootDerivationAuthorities,63);
assert.equal(breadth.totalAtomicAuthorities,506);
assert.deepEqual(breadth.capacities,{F01:205,F02:169,F03:63,F04:69,F05:374,F06:63,F07:34645,F08:3960});
assert.equal(breadth.totalSemanticCapacity,39548);

const global=new Set<string>(),verdicts=new Set<string>();
for(const family of CP008_FAMILIES){
 const cap=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
 const local=new Set<string>(),first=new Set<string>(),second=new Set<string>();
 for(const difficulty of family.targetDifficulties)for(let seed=1;seed<=cap;seed++){
  const q=family.generate(seed,difficulty);
  assert.equal(q.options.length,4,q.id+": four options required");assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
  assert(q.correctIndex>=0&&q.correctIndex<4);assert.equal(q.metadata.cpId,"PUN-001-CP008");assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");assert.equal(q.metadata.subtype,family.subtype);
  assert(!/[A-Za-z]/.test(q.stem+q.explanation),q.id+": English leakage");assert(!banned.test(q.stem+q.explanation),q.id+": clutter");
  assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
  assert(!global.has(q.metadata.fingerprint),q.id+": cross-family collision");global.add(q.metadata.fingerprint);
  first.add(q.metadata.authorityIds[1]??q.metadata.authorityIds[0]!);
  if(q.metadata.authorityIds[3])second.add(q.metadata.authorityIds[3]!);
  if(family.familyId==="F08")verdicts.add(q.options[q.correctIndex]!);
 }
 assert.equal(local.size,cap,family.familyId+": capacity mismatch");
 if(family.familyId==="F01")assert.equal(first.size,205);
 if(family.familyId==="F02")assert.equal(first.size,169);
 if(family.familyId==="F03"||family.familyId==="F06")assert.equal(first.size,63);
 if(family.familyId==="F04")assert.equal(new Set(Array.from({length:cap},(_,i)=>family.generate(i+1,"Medium").metadata.authorityIds[0])).size,69);
 if(family.familyId==="F05")assert.equal(first.size,374);
 if(family.familyId==="F07"){assert.equal(first.size,205);assert.equal(second.size,169);}
 if(family.familyId==="F08"){assert.equal(first.size,33);assert.equal(second.size,30);}
}
assert.equal(global.size,39548);
assert.equal(verdicts.size,4);
console.log("CP008 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...verdicts]},null,2));
