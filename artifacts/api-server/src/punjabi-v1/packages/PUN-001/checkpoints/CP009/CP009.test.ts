import assert from "node:assert/strict";
import { CP009_ANTONYM_AUTHORITIES,CP009_SYNONYM_AUTHORITIES } from "./CP009-authorities";
import { CP009_ALL_CONTEXT_AUTHORITIES } from "./CP009-contexts";
import { CP009_FAMILIES,getCP009BreadthReport } from "./engine";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP009_SYNONYM_AUTHORITIES.length,98);
assert.equal(CP009_ANTONYM_AUTHORITIES.length,110);
assert.equal(CP009_ALL_CONTEXT_AUTHORITIES.length,60);
assert.equal(CP009_FAMILIES.length,8);

const synIds=new Set<string>(),heads=new Set<string>();
let synonymEdges=0,deepSynonyms=0,outsiderCases=0,completionCases=0;
for(const a of CP009_SYNONYM_AUTHORITIES){
 assert(!synIds.has(a.id),a.id+": duplicate synonym id");synIds.add(a.id);
 assert(!heads.has(a.headword),a.id+": duplicate synonym headword");heads.add(a.headword);
 assert(a.donorIds.length>=1,a.id+": donor provenance required");
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert(a.synonyms.length>=1,a.id+": synonym authority needs at least one strong synonym");
 assert(a.outsiders.length>=3,a.id+": synonym authority needs at least three outsiders");
 assert.equal(new Set(a.synonyms).size,a.synonyms.length,a.id+": duplicate synonyms");
 assert.equal(new Set(a.outsiders).size,a.outsiders.length,a.id+": duplicate outsiders");
 for(const s of a.synonyms)assert.notEqual(s,a.headword,a.id+": headword leaked into synonyms");
 for(const s of a.synonyms)assert(!a.outsiders.includes(s),a.id+": synonym leaked into outsiders");
 for(const value of [a.headword,...a.synonyms,...a.outsiders,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
 }
 synonymEdges+=a.synonyms.length;
 if(a.synonyms.length>=3&&a.outsiders.length>=3){deepSynonyms++;outsiderCases+=a.outsiders.length;completionCases+=a.synonyms.length;}
}
assert.equal(synonymEdges,378);
assert.equal(deepSynonyms,86);
assert.equal(outsiderCases,392);
assert.equal(completionCases,355);

const antIds=new Set<string>(),sourceWords=new Set<string>(),unorderedPairs=new Set<string>();
for(const a of CP009_ANTONYM_AUTHORITIES){
 assert(!antIds.has(a.id),a.id+": duplicate antonym id");antIds.add(a.id);
 assert(!sourceWords.has(a.word),a.id+": ambiguous direct antonym source word");sourceWords.add(a.word);
 const pair=[a.word,a.antonym].sort().join("||");
 assert(!unorderedPairs.has(pair),a.id+": duplicate/reversed antonym concept");unorderedPairs.add(pair);
 assert(a.donorIds.length>=1,a.id+": donor provenance required");
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert(a.sourceConfusables.length>=3,a.id+": needs three source-side confusables");
 assert.equal(new Set(a.sourceConfusables).size,a.sourceConfusables.length,a.id+": duplicate confusables");
 assert(!a.sourceConfusables.includes(a.antonym),a.id+": correct antonym leaked into confusables");
 for(const value of [a.word,a.antonym,...a.sourceConfusables,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
 }
}

const ctxIds=new Set<string>();
for(const a of CP009_ALL_CONTEXT_AUTHORITIES){
 assert(!ctxIds.has(a.id),a.id+": duplicate context id");ctxIds.add(a.id);
 assert(a.donorIds.length>=1,a.id+": donor provenance required");
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert.equal(a.distractors.length,3,a.id+": exactly three context distractors required");
 assert.equal(new Set(a.distractors).size,3,a.id+": duplicate context distractors");
 assert(!a.distractors.includes(a.correctTerm),a.id+": correct context term leaked into distractors");
 assert(a.sentence.includes("____"),a.id+": authored context must contain blank");
 for(const value of [a.termA,a.termB,a.sentence,a.correctTerm,...a.distractors,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
 }
}

const excludedDonors=new Set(["ANT-077","ANT-099","ANT-120","ANT-154","ANT-151","ANT-071","ANT-087","ANT-116","ANT-098"]);
for(const a of CP009_ANTONYM_AUTHORITIES)for(const id of a.donorIds)assert(!excludedDonors.has(id),id+": excluded weak donor antonym leaked back in");

const breadth=getCP009BreadthReport();
assert.equal(breadth.synonymHeadwordAuthorities,98);
assert.equal(breadth.synonymEdgeCount,378);
assert.equal(breadth.deepSynonymAuthorities,86);
assert.equal(breadth.antonymConceptAuthorities,110);
assert.equal(breadth.contextAuthorities,60);
assert.equal(breadth.totalAtomicAuthorities,268);
assert.equal(breadth.totalSemanticCapacity,66463);

const expectedCapacity:Record<string,number>={F01:378,F02:110,F03:488,F04:60,F05:392,F06:355,F07:21560,F08:43120};
const global=new Set<string>(),f08Outcomes=new Set<string>();
for(const family of CP009_FAMILIES){
 assert.equal(family.semanticCapacity,expectedCapacity[family.familyId],family.familyId+": wrong capacity");
 const local=new Set<string>(),firstCoverage=new Set<string>(),secondCoverage=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,q.id+": four options required");
   assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
   assert(q.correctIndex>=0&&q.correctIndex<4,q.id+": invalid correct index");
   assert.equal(q.metadata.cpId,"PUN-001-CP009");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),q.id+": English leaked into stem");
   assert(!/[A-Za-z]/.test(q.explanation),q.id+": English leaked into explanation");
   assert(!banned.test(q.stem+" "+q.explanation),q.id+": editorial filler");
   assert(!q.options.includes("ਇੱਕੋ ਸ਼ਬਦ ਦੇ ਰੂਪ"),q.id+": weak relation-label option leaked");
   assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),q.id+": cross-family fingerprint collision");global.add(q.metadata.fingerprint);
   firstCoverage.add(q.metadata.authorityIds[0]!);
   if(q.metadata.authorityIds[1])secondCoverage.add(q.metadata.authorityIds[1]!);
   if(family.familyId==="F08")f08Outcomes.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,family.familyId+": semantic capacity mismatch");
 if(family.familyId==="F01")assert.equal(firstCoverage.size,98,"F01 must reach all synonym headwords");
 if(family.familyId==="F02")assert.equal(firstCoverage.size,110,"F02 must reach all antonym concepts");
 if(family.familyId==="F03")assert.equal(firstCoverage.size,208,"F03 must reach all synonym and antonym authorities");
 if(family.familyId==="F04")assert.equal(firstCoverage.size,60,"F04 must reach all authored contexts");
 if(family.familyId==="F05"||family.familyId==="F06")assert.equal(firstCoverage.size,86,family.familyId+": must reach all deep synonym authorities");
 if(family.familyId==="F07"||family.familyId==="F08"){
  assert.equal(firstCoverage.size,98,family.familyId+": must reach all synonym authorities");
  assert.equal(secondCoverage.size,110,family.familyId+": must reach all antonym authorities");
 }
}
assert.equal(global.size,66463);
assert.equal(f08Outcomes.size,4,"F08 must expose all four truth outcomes");
console.log("CP009 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...f08Outcomes]},null,2));
