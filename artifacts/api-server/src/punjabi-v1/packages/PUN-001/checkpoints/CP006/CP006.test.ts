import assert from "node:assert/strict";
import { CP006_ASPECT_AUTHORITIES } from "./CP006-aspects";
import {
 CP006_COMPOUND_VERBS,CP006_TENSE_SHIFTS,CP006_TENSE_TRIPLETS,
 CP006_TRANSITIVITY_CONVERSIONS,CP006_VERB_AUTHORITIES
} from "./CP006-authorities";
import { CP006_FAMILIES,getCP006BreadthReport } from "./engine";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਤਿੰਨੇ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP006_VERB_AUTHORITIES.length,138);
assert.equal(CP006_TENSE_TRIPLETS.length,12);
assert.equal(CP006_TENSE_SHIFTS.length,72);
assert.equal(CP006_TRANSITIVITY_CONVERSIONS.length,39);
assert.equal(CP006_COMPOUND_VERBS.length,35);
assert.equal(CP006_ASPECT_AUTHORITIES.length,35);
assert.equal(CP006_FAMILIES.length,12);

const ids=new Set<string>(),sentences=new Set<string>();
for(const a of CP006_VERB_AUTHORITIES){
 assert(!ids.has(a.id),a.id+": duplicate id");ids.add(a.id);
 assert(!sentences.has(a.sentence),a.id+": duplicate verb sentence");sentences.add(a.sentence);
 assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert.equal(a.sentenceDistractors.length,3);assert.equal(new Set(a.sentenceDistractors).size,3);
 assert(!a.sentenceDistractors.includes(a.verbPhrase as never),a.id+": answer leaked into sentence distractors");
 for(const v of [a.sentence,a.verbPhrase,a.mainVerb,a.auxiliaryVerb??"",a.directObject??"",a.explanationPa,...a.sentenceDistractors,...(a.objectDistractors??[])]){
  assert.equal(v,v.normalize("NFC"),a.id+": NFC required");assert(!/[A-Za-z]/.test(v),a.id+": English leakage");assert(!banned.test(v),a.id+": editorial clutter");
 }
 if(a.verbType==="SAKARMAK"){assert(a.directObject,a.id+": transitive object required");assert(a.objectDistractors);assert.equal(new Set(a.objectDistractors).size,3);assert(!a.objectDistractors.includes(a.directObject as never));}
}
for(const excluded of ["ਵਿਦਿਆਰਥੀ ਇਮਤਿਹਾਨ ਦੇਣਗੇ।","ਪਾਣੀ ਉਬਲ ਰਿਹਾ ਹੈ।","ਸੇਵਾਦਾਰ ਘੰਟੀ ਵਜਾਏਗਾ।"])assert(!CP006_VERB_AUTHORITIES.some(x=>x.sentence===excluded),excluded+": weak distractor context leaked");

for(const t of CP006_TENSE_TRIPLETS){
 assert(!ids.has(t.id));ids.add(t.id);for(const v of [t.present,t.past,t.future,t.pastNearMiss,t.futureNearMiss,t.explanationPa]){assert.equal(v,v.normalize("NFC"));assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
}
for(const s of CP006_TENSE_SHIFTS){
 assert(!ids.has(s.id));ids.add(s.id);assert(s.donorIds.length>=1);assert.equal(s.distractors.length>=3,true);assert.equal(new Set(s.distractors).size,s.distractors.length);
 for(const v of [s.baseSentence,s.targetTense,s.convertedSentence,s.explanationPa,...s.distractors]){assert.equal(v,v.normalize("NFC"));assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
 assert(!/ਅਮਨ|ਦਿੱਲੀ/u.test(s.baseSentence+s.convertedSentence),"named/local donor shift leaked");
}
for(const t of CP006_TRANSITIVITY_CONVERSIONS){
 assert(!ids.has(t.id));ids.add(t.id);for(const v of [t.intransitive,t.transitive,t.explanationPa]){assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
}
assert(!CP006_TRANSITIVITY_CONVERSIONS.some(x=>x.intransitive==="ਰਿੱਝਣਾ"&&x.transitive==="ਰਿੰਨ੍ਹਣਾ"),"questionable conversion leaked");
for(const a of CP006_COMPOUND_VERBS){
 assert(!ids.has(a.id));ids.add(a.id);assert(a.sentence.includes(a.compoundVerb),a.id+": compound phrase missing from sentence");assert(a.compoundVerb.includes(a.mainVerb)&&a.compoundVerb.includes(a.sanchalakVerb),a.id+": compound decomposition mismatch");
 for(const v of [a.sentence,a.compoundVerb,a.mainVerb,a.sanchalakVerb,a.explanationPa]){assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
}
for(const a of CP006_ASPECT_AUTHORITIES){
 assert(!ids.has(a.id));ids.add(a.id);assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
 for(const v of [a.sentence,a.verbPhrase,a.aspectPa,a.explanationPa]){assert(!/[A-Za-z]/.test(v));assert(!banned.test(v));}
 assert(["HABITUAL","PROGRESSIVE","PERFECT"].includes(a.aspect));
}

const breadth=getCP006BreadthReport();
assert.equal(breadth.verbAuthorityCount,138);
assert.equal(breadth.auxiliaryAuthorityCount,57);
assert.equal(breadth.objectAuthorityCount,72);
assert.equal(breadth.tenseTripletCount,12);
assert.equal(breadth.tenseShiftCount,72);
assert.equal(breadth.transitivityConversionCount,39);
assert.equal(breadth.compoundVerbCount,35);
assert.equal(breadth.aspectAuthorityCount,35);
assert.equal(breadth.totalAtomicAuthorities,331);
assert.equal(breadth.familyCount,12);
assert.deepEqual(breadth.capacities,{F01:138,F02:138,F03:138,F04:57,F05:72,F06:72,F07:138,F08:528,F09:35,F10:72,F11:39,F12:35});
assert.equal(breadth.totalSemanticCapacity,1462);

const global=new Set<string>(),verdicts=new Set<string>();
for(const family of CP006_FAMILIES){
 const cap=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
 const local=new Set<string>(),first=new Set<string>(),second=new Set<string>();
 for(const difficulty of family.targetDifficulties)for(let seed=1;seed<=cap;seed++){
  const q=family.generate(seed,difficulty);
  assert.equal(q.options.length,4,q.id+": four options");assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
  assert(q.correctIndex>=0&&q.correctIndex<4);assert.equal(q.metadata.cpId,"PUN-001-CP006");assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");assert.equal(q.metadata.subtype,family.subtype);
  assert(!/[A-Za-z]/.test(q.stem+q.explanation),q.id+": English leak");assert(!banned.test(q.stem+q.explanation),q.id+": clutter");
  assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
  assert(!global.has(q.metadata.fingerprint),q.id+": cross-family collision");global.add(q.metadata.fingerprint);
  first.add(q.metadata.authorityIds[0]!);if(q.metadata.authorityIds[1])second.add(q.metadata.authorityIds[1]!);
  if(family.familyId==="F08")verdicts.add(q.options[q.correctIndex]!);
  if(family.familyId==="F12"){
   const a=CP006_COMPOUND_VERBS.find(x=>x.id===q.metadata.authorityIds[0])!;
   for(const option of q.options)assert(option===a.sanchalakVerb||a.sentence.includes(option),q.id+": F12 distractor must come from source sentence");
  }
 }
 assert.equal(local.size,cap,family.familyId+": capacity mismatch");
 if(["F01","F02","F03","F07"].includes(family.familyId))assert.equal(first.size,138);
 if(family.familyId==="F04")assert.equal(first.size,57);
 if(family.familyId==="F05")assert.equal(first.size,72);
 if(family.familyId==="F06")assert.equal(first.size,12);
 if(family.familyId==="F08"){assert.equal(first.size,12);assert.equal(second.size,12);}
 if(family.familyId==="F09")assert.equal(first.size,35);
 if(family.familyId==="F10")assert.equal(first.size,72);
 if(family.familyId==="F11")assert.equal(first.size,39);
 if(family.familyId==="F12")assert.equal(first.size,35);
}
assert.equal(global.size,1462);
assert.equal(verdicts.size,4);
console.log("CP006 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...verdicts]},null,2));
