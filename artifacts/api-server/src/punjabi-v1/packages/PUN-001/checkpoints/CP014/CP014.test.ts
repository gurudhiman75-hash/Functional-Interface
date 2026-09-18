import assert from "node:assert/strict";
import { CP014_PASSAGES,CP014_ADMIN_TERMS } from "./CP014-authorities";
import { CP014_FAMILIES,getCP014BreadthReport } from "./engine";

assert.equal(CP014_PASSAGES.length,13);
assert.equal(CP014_ADMIN_TERMS.length,215);
assert.equal(CP014_FAMILIES.length,8);

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
const passageIds=new Set<string>(),qIds=new Set<string>();
const typeCounts=new Map<string,number>();
let passageQuestions=0;
for(const p of CP014_PASSAGES){
 assert(!passageIds.has(p.id),p.id+": duplicate passage id");passageIds.add(p.id);
 assert.equal(p.textPa,p.textPa.normalize("NFC"),p.id+": passage NFC required");
 assert(!/[A-Za-z]/.test(p.textPa),p.id+": English leakage in Punjabi passage");
 assert(!banned.test(p.textPa),p.id+": editorial clutter in passage");
 assert(p.questions.length>=2,p.id+": passage requires at least two questions");
 for(const q of p.questions){
  passageQuestions++;
  assert(!qIds.has(q.qId),q.qId+": duplicate passage question id");qIds.add(q.qId);
  typeCounts.set(q.type,(typeCounts.get(q.type)??0)+1);
  assert.equal(q.distractors.length,3,q.qId+": exactly three distractors required");
  assert.equal(new Set(q.distractors).size,3,q.qId+": duplicate distractors");
  assert(!q.distractors.includes(q.correctAnswer as never),q.qId+": correct answer leaked into distractors");
  for(const value of [q.questionStem,q.correctAnswer,...q.distractors,q.explanationPa]){
   assert.equal(value,value.normalize("NFC"),q.qId+": NFC required");
   assert(!/[A-Za-z]/.test(value),q.qId+": English leakage in Punjabi passage authority");
   assert(!banned.test(value),q.qId+": editorial clutter");
  }
 }
}
assert.equal(passageQuestions,42);
assert.equal(typeCounts.get("factual"),15);
assert.equal(typeCounts.get("inferential"),11);
assert.equal(typeCounts.get("title"),13);
assert.equal(typeCounts.get("summary"),3);

const adminIds=new Set<string>(),englishConcepts=new Set<string>(),punjabiTerms=new Set<string>();
const normEn=(s:string)=>s.normalize("NFKC").toLowerCase().replace(/[‐‑‒–—-]/g," ").replace(/[().,:'"]/g,"").replace(/\s+/g," ").trim();
for(const a of CP014_ADMIN_TERMS){
 assert(!adminIds.has(a.id),a.id+": duplicate admin id");adminIds.add(a.id);
 const en=normEn(a.englishTerm);
 assert(!englishConcepts.has(en),a.id+": duplicate normalized English concept");englishConcepts.add(en);
 assert(!punjabiTerms.has(a.punjabiTerm),a.id+": duplicate Punjabi term");punjabiTerms.add(a.punjabiTerm);
 assert(a.donorIds.length>=1,a.id+": donor provenance required");
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert.equal(a.punjabiTerm,a.punjabiTerm.normalize("NFC"),a.id+": Punjabi term NFC required");
 assert(!/[A-Za-z]/.test(a.punjabiTerm),a.id+": English leakage in Punjabi term");
 assert(!/[()/]/.test(a.punjabiTerm),a.id+": answer term must be concise, not contain alternative glosses");
 assert(!banned.test(a.punjabiTerm),a.id+": editorial clutter in Punjabi term");
 assert(a.explanationPa.includes(a.englishTerm)&&a.explanationPa.includes(a.punjabiTerm),a.id+": explanation must teach the mapping");
}
assert.equal(adminIds.size,215);
assert.equal(englishConcepts.size,215);
assert.equal(punjabiTerms.size,215);

const breadth=getCP014BreadthReport();
assert.equal(breadth.passageCount,13);
assert.equal(breadth.passageQuestionAuthorities,42);
assert.equal(breadth.administrativeAuthorities,215);
assert.equal(breadth.totalAtomicAuthorities,257);
assert.equal(breadth.totalSemanticCapacity,1643);

const global=new Set<string>();
const f08Outcomes=new Set<string>();
for(const family of CP014_FAMILIES){
 const local=new Set<string>();
 const primaryCoverage=new Set<string>();
 const secondaryCoverage=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,q.id+": four options required");
   assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
   assert(q.correctIndex>=0&&q.correctIndex<4,q.id+": invalid correct index");
   assert.equal(q.metadata.cpId,"PUN-001-CP014");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!banned.test(q.stem+" "+q.explanation),q.id+": editorial filler");
   assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),q.id+": cross-family fingerprint collision");global.add(q.metadata.fingerprint);

   if(family.familyId==="F01"||family.familyId==="F02"||family.familyId==="F03"){
    primaryCoverage.add(q.metadata.authorityIds[1]!);
   }else if(family.familyId==="F07"){
    primaryCoverage.add(q.metadata.authorityIds[1]!);
    secondaryCoverage.add(q.metadata.authorityIds[2]!);
   }else{
    primaryCoverage.add(q.metadata.authorityIds[0]!);
    if(family.familyId==="F08"){
     secondaryCoverage.add(q.metadata.authorityIds[1]!);
     f08Outcomes.add(q.options[q.correctIndex]!);
    }
   }
  }
 }
 assert.equal(local.size,family.semanticCapacity,family.familyId+": semantic capacity mismatch");
 const expected=family.familyId==="F01"?15:family.familyId==="F02"?11:family.familyId==="F03"?16:family.familyId==="F07"?42:215;
 assert.equal(primaryCoverage.size,expected,family.familyId+": exhaustive primary authority coverage required");
 if(family.familyId==="F07")assert.equal(secondaryCoverage.size,42,"F07 must exercise all passage questions in second position");
 if(family.familyId==="F08")assert.equal(secondaryCoverage.size,215,"F08 must exercise all admin authorities in second position");
}
assert.equal(global.size,1643);
assert.equal(f08Outcomes.size,4,"F08 must expose all four truth outcomes");

const easy=CP014_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const medium=CP014_FAMILIES.find(x=>x.familyId==="F02")!.generate(1,"Medium");
const hard=CP014_FAMILIES.find(x=>x.familyId==="F07")!.generate(1,"Hard");
assert(easy.metadata.authorityIds.length>=2);
assert(medium.metadata.authorityIds.length>=2);
assert(hard.stem.includes("1.")&&hard.stem.includes("2."));
assert.equal(hard.metadata.authorityIds.length,3);

console.log("CP014 exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,f08TruthOutcomes:[...f08Outcomes]},null,2));
