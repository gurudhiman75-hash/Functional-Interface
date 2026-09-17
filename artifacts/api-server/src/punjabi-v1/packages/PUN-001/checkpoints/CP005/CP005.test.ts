import assert from "node:assert/strict";
import { CP005_ADJECTIVES, CP005_ADVERBS } from "./CP005-authorities";
import { CP005_FAMILIES, getCP005BreadthReport } from "./generator";

assert.equal(CP005_ADJECTIVES.length,25);
assert.equal(CP005_ADVERBS.length,20);
assert.equal(CP005_FAMILIES.length,8);
assert.deepEqual(Object.fromEntries(CP005_FAMILIES.map((f)=>[f.familyId,[...f.targetDifficulties]])),{
  F01:["Easy"],F02:["Easy"],F03:["Medium"],F04:["Easy"],F05:["Medium"],F06:["Medium"],F07:["Hard"],F08:["Hard"]
},"CP005 difficulty must be operation-driven; the same family cannot be relabeled across bands");

for (const a of [...CP005_ADJECTIVES,...CP005_ADVERBS]) {
  assert.equal(a.sentence,a.sentence.normalize("NFC"));
  assert.equal(a.target,a.target.normalize("NFC"));
  assert(!/[A-Za-z]/.test(a.sentence));
  assert(!/[A-Za-z]/.test(a.target));
  assert.equal(a.sourceStatus,"REVIEW_PENDING");
}

const breadth=getCP005BreadthReport();
assert.equal(breadth.totalSemanticCapacity,3115);
assert.equal(breadth.capacities.F06,500);
assert.equal(breadth.capacities.F07,500);
assert.equal(breadth.capacities.F08,2000);

const fingerprints=new Set<string>();
for (const family of CP005_FAMILIES) {
  for (const difficulty of family.targetDifficulties) {
    const seen=new Set<string>();
    const cap=breadth.capacities[family.familyId as keyof typeof breadth.capacities];
    for (let seed=1; seed<=Math.min(120,cap); seed++) {
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
      assert(!q.stem.includes("____"),`${q.id}: unresolved blank leaked into learner stem`);
      assert(!q.options.some((o)=>o.includes("____")),`${q.id}: blank distractor leaked`);
      assert(!seen.has(q.metadata.fingerprint),`${q.id}: duplicate semantic fingerprint inside ${family.familyId}`);
      seen.add(q.metadata.fingerprint);
      assert(!fingerprints.has(q.metadata.fingerprint),`${q.id}: cross-family fingerprint collision`);
      fingerprints.add(q.metadata.fingerprint);
    }
  }
}

const f03=CP005_FAMILIES.find(x=>x.familyId==="F03")!;
for (let seed=1;seed<=25;seed++) {
  const q=f03.generate(seed,"Medium");
  assert(q.options.every((o)=>o.includes(" — ")),`${q.id}: F03 must test type + function, not ambiguous blank completion`);
}

const f07=CP005_FAMILIES.find(x=>x.familyId==="F07")!;
for (let seed=1;seed<=80;seed++) {
  const q=f07.generate(seed,"Hard");
  assert(q.stem.includes("ਵਾਕ 1:")&&q.stem.includes("ਵਾਕ 2:"),`${q.id}: F07 must require two contextual decisions`);
  assert(q.options.every((o)=>o.includes("ਵਾਕ 1:")&&o.includes("ਵਾਕ 2:")),`${q.id}: F07 options must be full paired classifications`);
}

const f08=CP005_FAMILIES.find(x=>x.familyId==="F08")!;
const verdicts=new Set<string>();
for (let seed=1;seed<=40;seed++) {
  const q=f08.generate(seed,"Hard");
  verdicts.add(q.options[q.correctIndex]!);
  assert(q.stem.includes("ਕਥਨ 1")&&q.stem.includes("ਕਥਨ 2"));
}
assert.deepEqual(verdicts,new Set(["ਦੋਵੇਂ ਕਥਨ ਸਹੀ ਹਨ","ਕੇਵਲ ਕਥਨ 1 ਸਹੀ ਹੈ","ਕੇਵਲ ਕਥਨ 2 ਸਹੀ ਹੈ","ਦੋਵੇਂ ਕਥਨ ਗਲਤ ਹਨ"]),"F08 must reach all four truth outcomes");

const easy=CP005_FAMILIES.find(x=>x.familyId==="F01")!.generate(1,"Easy");
const hard=CP005_FAMILIES.find(x=>x.familyId==="F08")!.generate(1,"Hard");
assert(hard.metadata.authorityIds.length>easy.metadata.authorityIds.length);
console.log(JSON.stringify(breadth,null,2));
console.log(`CP005 semantic gates passed: ${fingerprints.size} proof questions`);
