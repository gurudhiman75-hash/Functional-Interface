import assert from"node:assert/strict";
import{ENG007_CP001_ENTRIES_V1,eng007Cp001PoolV1}from"../chapters/spelling-correction/ENG-007/CP001/eng-007-cp001-lexicon-v1";
import{generateEng007Cp001QuestionV1}from"../chapters/spelling-correction/ENG-007/CP001/eng-007-cp001-v1";

assert.equal(ENG007_CP001_ENTRIES_V1.length,240);
assert.deepEqual(["easy","medium","hard"].map(d=>eng007Cp001PoolV1(d as any).length),[80,80,80]);
const correct=ENG007_CP001_ENTRIES_V1.map(x=>x.correct.toLowerCase()),wrong=ENG007_CP001_ENTRIES_V1.map(x=>x.misspelling.toLowerCase());
assert.equal(new Set(correct).size,240);
assert.equal(new Set(wrong).size,240);
assert.equal(correct.filter(x=>new Set(wrong).has(x)).length,0);
for(const e of ENG007_CP001_ENTRIES_V1){
  assert.notEqual(e.correct.toLowerCase(),e.misspelling.toLowerCase());
  assert.ok(e.correct.length>=4&&e.misspelling.length>=4);
  assert.ok(!/\s/.test(e.correct)&&!/\s/.test(e.misspelling));
}
const seen=new Set<string>(),positions=[0,0,0,0],modes=new Set<string>();
for(let i=0;i<18000;i++){
  const difficulty=(["easy","medium","hard"]as const)[i%3]!,mode=(["correct-spelling","misspelt-word"]as const)[Math.floor(i/3)%2]!;
  const q=generateEng007Cp001QuestionV1({seed:`eng007-cp001-soak:${i}`,difficulty,mode});
  seen.add(q.metadata.entryId);modes.add(q.metadata.mode);positions[q.correctOptionIndex]++;
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
  assert.ok(q.options.includes(mode==="correct-spelling"?q.metadata.correctSpelling:q.metadata.misspelling));
  assert.ok(q.explanation.includes(q.metadata.correctSpelling));
  assert.ok(!/best describes|associated with/i.test(q.stem));
}
assert.equal(seen.size,240);assert.equal(modes.size,2);
for(const n of positions)assert.ok(n>=3900&&n<=5100,`Answer-position imbalance: ${positions.join(",")}`);
console.log("ENG-007 CP001 validation passed.",{entries:240,positions});
