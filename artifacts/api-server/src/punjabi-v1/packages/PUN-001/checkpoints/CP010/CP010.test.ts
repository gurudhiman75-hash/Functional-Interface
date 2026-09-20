import assert from "node:assert/strict";
import { CP010_AUTHORITIES,CP010_DOMAINS,cp010ItemsInDomain } from "./CP010-authorities";
import { CP010_FAMILIES,getCP010BreadthReport } from "./engine";

const banned=/(ਟਕਸਾਲੀ|ਸਿੱਧੇ ਅਰਥ|ਪ੍ਰਮਾਣਿਤ|ਬਾਕੀ ਤਿੰਨ|ਬਾਕੀ ਵਿਕਲਪ|ਟ੍ਰਿਕ|ਸ਼ਾਰਟਕੱਟ)/u;
assert.equal(CP010_AUTHORITIES.length,177);
assert.equal(CP010_DOMAINS.length,10);
assert.equal(CP010_FAMILIES.length,8);

const ids=new Set<string>(),words=new Set<string>(),phrases=new Set<string>();
for(const a of CP010_AUTHORITIES){
 assert(!ids.has(a.id),a.id+": duplicate authority id");ids.add(a.id);
 assert(!words.has(a.wordPa),a.id+": duplicate one-word answer");words.add(a.wordPa);
 assert(!phrases.has(a.phrasePa),a.id+": duplicate defining phrase");phrases.add(a.phrasePa);
 assert.equal(a.sourceStatus,"REVIEW_PENDING");
 assert(a.donorIds.length>=1||a.priorApprovedIds.length>=1,a.id+": provenance required");
 for(const value of [a.phrasePa,a.wordPa,a.explanationPa]){
  assert.equal(value,value.normalize("NFC"),a.id+": NFC required");
  assert(!/[A-Za-z]/.test(value),a.id+": English leakage");
  assert(!banned.test(value),a.id+": editorial clutter");
 }
}
for(const domain of CP010_DOMAINS){
 const items=cp010ItemsInDomain(domain);
 assert(items.length>=4,domain+": same-domain families require at least four authorities");
}

const forbiddenWords=new Set(["ਰੁਦਾਲੀ","ਦਰਸ਼ਨੀਕ","ਛੂਤਹਾ","ਘੁਰਨਾ","ਰੰਡੂਆ","ਯਤੀਮ","ਗਾਲੜੀ","ਅਮੋਲਕ","ਹਫ਼ਤਾਵਾਰੀ","ਸਰਵਗਿਆਨੀ","ਸਰਬ-ਗਿਆਨੀ","ਸਰਵ-ਵਿਆਪਕ","ਸਰਵ-ਸ਼ਕਤੀਮਾਨ","ਅਲਪਗ","ਕਬਰਿਸਤਾਨ","ਦੋਪਾਇਆ","ਅਮਿਟ","ਖ਼ੁਦਗ਼ਰਜ਼","ਸਾਖ਼ਰ","ਗੁਣਗਿਆ","ਤਬੇਲਾ","ਲਾਇਬ੍ਰੇਰੀ"]);
for(const a of CP010_AUTHORITIES)assert(!forbiddenWords.has(a.wordPa),a.id+": deprecated/ambiguous variant leaked into retrofit");

const expectedCanonical=new Map([
 ["ਅਸਤਬਲ","ਉਹ ਥਾਂ ਜਿੱਥੇ ਘੋੜੇ ਰੱਖੇ ਜਾਂਦੇ ਹਨ"],
 ["ਪੁਸਤਕਾਲਾ","ਉਹ ਥਾਂ ਜਿੱਥੇ ਪੁਸਤਕਾਂ ਪੜ੍ਹਨ ਅਤੇ ਲੈਣ ਲਈ ਰੱਖੀਆਂ ਜਾਂਦੀਆਂ ਹਨ"],
 ["ਵਿਧੁਰ","ਜਿਸ ਪੁਰਸ਼ ਦੀ ਪਤਨੀ ਮਰ ਚੁੱਕੀ ਹੋਵੇ"],
 ["ਅਨਾਥ","ਜਿਸ ਬੱਚੇ ਦੇ ਮਾਤਾ-ਪਿਤਾ ਨਾ ਹੋਣ"],
 ["ਸਰਬੱਗ","ਜੋ ਸਭ ਕੁਝ ਜਾਣਦਾ ਹੋਵੇ"],
 ["ਅਮੁੱਲ","ਜਿਸ ਦੀ ਕੀਮਤ ਨਾ ਅੰਕੀ ਜਾ ਸਕੇ"],
 ["ਵਾਚਾਲ","ਜੋ ਬਹੁਤ ਜ਼ਿਆਦਾ ਬੋਲਦਾ ਹੋਵੇ"],
 ["ਚਸ਼ਮਦੀਦ","ਜਿਸ ਨੇ ਆਪਣੀ ਅੱਖੀਂ ਕੋਈ ਘਟਨਾ ਜਾਂ ਵਾਰਦਾਤ ਵੇਖੀ ਹੋਵੇ"]
]);
for(const [word,phrase] of expectedCanonical){
 const a=CP010_AUTHORITIES.find(x=>x.wordPa===word);
 assert(a,word+": canonical authority missing");
 assert.equal(a.phrasePa,phrase,word+": canonical phrase drift");
}

const breadth=getCP010BreadthReport();
assert.equal(breadth.totalAtomicAuthorities,177);
assert.equal(breadth.totalDomains,10);
assert.equal(breadth.orderedSameDomainPairs,4068);
assert.equal(breadth.totalSemanticCapacity,25293);
const expectedCapacity:Record<string,number>={F01:177,F02:177,F03:177,F04:177,F05:4068,F06:177,F07:4068,F08:16272};

const global=new Set<string>(),f08Outcomes=new Set<string>();
for(const family of CP010_FAMILIES){
 assert.equal(family.semanticCapacity,expectedCapacity[family.familyId],family.familyId+": wrong capacity");
 const local=new Set<string>(),firstCoverage=new Set<string>(),secondCoverage=new Set<string>();
 for(const difficulty of family.targetDifficulties){
  for(let seed=1;seed<=family.semanticCapacity;seed++){
   const q=family.generate(seed,difficulty);
   assert.equal(q.options.length,4,q.id+": four options required");
   assert.equal(new Set(q.options).size,4,q.id+": duplicate options");
   assert(q.correctIndex>=0&&q.correctIndex<4,q.id+": invalid correct index");
   assert.equal(q.metadata.cpId,"PUN-001-CP010");
   assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
   assert.equal(q.metadata.subtype,family.subtype);
   assert(!/[A-Za-z]/.test(q.stem),q.id+": English leaked into stem");
   assert(!/[A-Za-z]/.test(q.explanation),q.id+": English leaked into explanation");
   assert(!banned.test(q.stem+" "+q.explanation),q.id+": editorial filler");
   assert(!local.has(q.metadata.fingerprint),q.id+": duplicate family fingerprint");local.add(q.metadata.fingerprint);
   assert(!global.has(q.metadata.fingerprint),q.id+": cross-family fingerprint collision");global.add(q.metadata.fingerprint);
   firstCoverage.add(q.metadata.authorityIds[0]!);
   if(q.metadata.authorityIds[1])secondCoverage.add(q.metadata.authorityIds[1]!);
   if(family.familyId==="F08")f08Outcomes.add(q.options[q.correctIndex]!);
  }
 }
 assert.equal(local.size,family.semanticCapacity,family.familyId+": semantic capacity mismatch");
 assert.equal(firstCoverage.size,177,family.familyId+": every authority must be reachable as the primary target");
 if(family.familyId==="F05"||family.familyId==="F07"||family.familyId==="F08"){
  assert.equal(secondCoverage.size,177,family.familyId+": every authority must be reachable in second position");
 }
}
assert.equal(global.size,25293);
assert.equal(f08Outcomes.size,4,"F08 must expose all four truth outcomes");
console.log("CP010 retrofit exhaustive semantic gates passed: "+global.size+" governed questions");
console.log(JSON.stringify({...breadth,domainSizes:Object.fromEntries(CP010_DOMAINS.map(d=>[d,cp010ItemsInDomain(d).length])),f08TruthOutcomes:[...f08Outcomes]},null,2));
