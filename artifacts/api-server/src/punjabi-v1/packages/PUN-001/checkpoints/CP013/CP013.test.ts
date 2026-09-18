import assert from "node:assert/strict";
import {
  CP013_CLASSIFICATION_ITEMS,
  CP013_TRANSFORMATION_ITEMS,
  CP013_CORRECTION_ITEMS,
} from "./CP013-authorities";
import { CP013_FAMILIES,getCP013BreadthReport } from "./engine";

assert.equal(CP013_CLASSIFICATION_ITEMS.length,89);
assert.equal(CP013_TRANSFORMATION_ITEMS.length,63);
assert.equal(CP013_CORRECTION_ITEMS.length,71);
assert.equal(CP013_FAMILIES.length,8);

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
const city=/(ਦਿੱਲੀ|ਚੰਡੀਗੜ੍ਹ|ਲੁਧਿਆਣਾ|ਅੰਮ੍ਰਿਤਸਰ|ਪਟਿਆਲਾ|ਜਲੰਧਰ|ਮੋਹਾਲੀ|ਬਠਿੰਡਾ|ਮਾਨਸਾ)/u;

const clsIds=new Set<string>(),clsSentences=new Set<string>();
const structures=new Set<string>(),functions=new Set<string>();
for(const a of CP013_CLASSIFICATION_ITEMS){
 assert(!clsIds.has(a.id),a.id+": duplicate classification id");clsIds.add(a.id);
 assert(!clsSentences.has(a.sentencePa),a.id+": duplicate classification sentence");clsSentences.add(a.sentencePa);
 structures.add(a.structureType);functions.add(a.functionType);
 for(const value of [a.sentencePa,a.structureType,a.functionType,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
  assert(!city.test(value),a.id+": city-specific learner wording");
 }
}
assert.equal(structures.size,3);
assert.equal(functions.size,5);

const trfIds=new Set<string>(),trfOriginals=new Set<string>(),trfCorrects=new Set<string>();
for(const a of CP013_TRANSFORMATION_ITEMS){
 assert(!trfIds.has(a.id),a.id+": duplicate transformation id");trfIds.add(a.id);
 assert(!trfOriginals.has(a.originalSentence),a.id+": duplicate original transformation sentence");trfOriginals.add(a.originalSentence);
 assert(!trfCorrects.has(a.correctSentence),a.id+": ambiguous reverse transformation output");trfCorrects.add(a.correctSentence);
 assert.notEqual(a.originalSentence,a.correctSentence,a.id+": transformation must change form");
 assert.equal(a.distractors.length,3,a.id+": exactly three reviewed distractors required");
 assert.equal(new Set(a.distractors).size,3,a.id+": duplicate transformation distractors");
 assert(!a.distractors.includes(a.correctSentence as never),a.id+": correct transformation leaked into distractors");
 for(const value of [a.originalSentence,a.originalCategory,a.targetCategory,a.correctSentence,...a.distractors,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
  assert(!city.test(value),a.id+": city-specific learner wording");
 }
}

const corIds=new Set<string>(),incorrects=new Set<string>(),corrects=new Set<string>();
for(const a of CP013_CORRECTION_ITEMS){
 assert(!corIds.has(a.id),a.id+": duplicate correction id");corIds.add(a.id);
 assert(!incorrects.has(a.incorrectSentence),a.id+": duplicate incorrect sentence");incorrects.add(a.incorrectSentence);
 assert(!corrects.has(a.correctSentence),a.id+": duplicate corrected sentence");corrects.add(a.correctSentence);
 assert.notEqual(a.incorrectSentence,a.correctSentence,a.id+": correction must change sentence");
 assert.equal(a.distractors.length,3,a.id+": exactly three reviewed correction distractors required");
 assert.equal(new Set(a.distractors).size,3,a.id+": duplicate correction distractors");
 assert(!a.distractors.includes(a.correctSentence as never),a.id+": correct sentence leaked into distractors");
 for(const value of [a.incorrectSentence,a.correctSentence,a.errorType,...a.distractors,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
  assert(!city.test(value),a.id+": city-specific learner wording");
 }
}

for(const excluded of ["CLS-083","TRF-044","TRF-057","COR-006","COR-011","COR-012","COR-018","COR-019","COR-046","COR-055","COR-070","COR-075","TRF-009","TRF-010","TRF-023","TRF-030","TRF-037","TRF-060","TRF-063","TRF-066","TRF-074","TRF-075"]){
 assert(!clsIds.has(excluded)&&!trfIds.has(excluded)&&!corIds.has(excluded),excluded+": excluded donor authority leaked back in");
}

const breadth=getCP013BreadthReport();
assert.equal(breadth.classificationAuthorities,89);
assert.equal(breadth.transformationAuthorities,63);
assert.equal(breadth.correctionAuthorities,71);
assert.equal(breadth.totalAtomicAuthorities,223);
assert.equal(breadth.totalSemanticCapacity,8341);

const global=new Set<string>();
for(const family of CP013_FAMILIES){
 const local=new Set<string>();
 const targetCoverage=new Set<string>();
 const secondCoverage=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,q.id+": four options required");
   assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
   assert(q.correctIndex>=0&&q.correctIndex<4,q.id+": invalid correct index");
   assert.equal(q.metadata.cpId,"PUN-001-CP013");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),q.id+": English leaked into stem");
   assert(!/[A-Za-z]/.test(q.explanation),q.id+": English leaked into explanation");
   assert(!banned.test(q.stem+" "+q.explanation),q.id+": editorial filler");
   assert(!city.test(q.stem+" "+q.explanation),q.id+": city-specific wording");
   assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),q.id+": cross-family fingerprint collision");global.add(q.metadata.fingerprint);
   targetCoverage.add(q.metadata.authorityIds[0]!);
   if(family.familyId==="F08")secondCoverage.add(q.metadata.authorityIds[1]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,family.familyId+": semantic capacity mismatch");
 const expected=(family.familyId==="F01"||family.familyId==="F02"||family.familyId==="F08")
  ?89
  :(family.familyId==="F03"||family.familyId==="F04"||family.familyId==="F07")
   ?63
   :71;
 assert.equal(targetCoverage.size,expected,family.familyId+": exhaustive target authority coverage required");
 if(family.familyId==="F08")assert.equal(secondCoverage.size,89,"F08 must exercise every classification authority in second position");
}
assert.equal(global.size,8341);

const easy=CP013_FAMILIES.find(x=>x.familyId==="F03")!.generate(1,"Easy");
const medium=CP013_FAMILIES.find(x=>x.familyId==="F04")!.generate(1,"Medium");
const hard=CP013_FAMILIES.find(x=>x.familyId==="F08")!.generate(1,"Hard");
assert.equal(easy.metadata.authorityIds.length,1);
assert(medium.metadata.authorityIds.length>1);
assert(hard.stem.includes("1.")&&hard.stem.includes("2."));
assert.equal(hard.metadata.authorityIds.length,2);

console.log("CP013 exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify(breadth,null,2));
