import assert from "node:assert/strict";
import { CP005_ADJECTIVES, CP005_ADVERBS } from "./CP005-authorities";
import { CP005_FAMILIES, getCP005BreadthReport } from "./generator";

assert.equal(CP005_ADJECTIVES.length,25);
assert.equal(CP005_ADVERBS.length,20);
assert.equal(CP005_FAMILIES.length,8);
for (const a of [...CP005_ADJECTIVES,...CP005_ADVERBS]) {
  assert.equal(a.sentence,a.sentence.normalize("NFC"));
  assert.equal(a.target,a.target.normalize("NFC"));
  assert(!/[A-Za-z]/.test(a.sentence));
  assert(!/[A-Za-z]/.test(a.target));
  assert.equal(a.sourceStatus,"REVIEW_PENDING");
}
const fingerprints=new Set<string>();
for (const family of CP005_FAMILIES) {
  for (const difficulty of family.targetDifficulties) {
    const seen=new Set<string>();
    for (let seed=1; seed<=Math.min(80,getCP005BreadthReport().capacities[family.familyId as keyof ReturnType<typeof getCP005BreadthReport>["capacities"]]); seed++) {
      const q=family.generate(seed,difficulty);
      assert.equal(q.options.length,4);
      assert.equal(new Set(q.options).size,4);
      assert(q.correctIndex>=0&&q.correctIndex<4);
      assert.equal(q.metadata.cpId,"PUN-001-CP005");
      assert.equal(q.metadata.lifecycle,"REVIEW_ONLY");
      assert(!/[A-Za-z]/.test(q.stem));
      assert(!/[A-Za-z]/.test(q.explanation));
      assert(!q.explanation.includes("ਬਾਕੀ ਤਿੰਨ"));
      assert(!q.explanation.includes("ਬਾਕੀ ਵਿਕਲਪ"));
      assert(!q.stem.includes("ਸਿੱਧੇ ਅਰਥ"));
      assert(!seen.has(q.metadata.fingerprint));
      seen.add(q.metadata.fingerprint);
      assert(!fingerprints.has(q.metadata.fingerprint));
      fingerprints.add(q.metadata.fingerprint);
    }
  }
}
const easy=CP005_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const hard=CP005_FAMILIES.find(x=>x.familyId==="F08")!.generate(1,"Hard");
assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length);
console.log(JSON.stringify(getCP005BreadthReport(),null,2));
console.log(`CP005 semantic gates passed: ${fingerprints.size} proof questions`);
