import assert from"node:assert/strict";
import{ENG007_CP002_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP002/eng-007-cp002-lexicon-v1";
import{generateEng007CP002QuestionV1}from"../chapters/spelling-correction/ENG-007/CP002/eng-007-cp002-v1";
assert.equal(ENG007_CP002_ENTRIES_V1.length,260);
assert.deepEqual(["easy","medium","hard"].map(d=>ENG007_CP002_ENTRIES_V1.filter(x=>x.difficulty===d).length),[80,100,80]);
assert.equal(new Set(ENG007_CP002_ENTRIES_V1.map(x=>x.correct.toLowerCase())).size,260);
assert.equal(new Set(ENG007_CP002_ENTRIES_V1.map(x=>x.misspelling.toLowerCase())).size,260);
for(const e of ENG007_CP002_ENTRIES_V1){
 for(const mode of["correct-spelling","misspelt-word"]as const){
  const q=generateEng007CP002QuestionV1({seed:`entry:${e.id}:${mode}`,difficulty:e.difficulty,entryId:e.id,mode});
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
  assert.equal(q.options[q.correctOptionIndex],mode==="correct-spelling"?e.correct:e.misspelling);
  assert.ok(q.explanation.includes(e.correct));
 }
}
const positions=[0,0,0,0],seen=new Set<string>();
for(let i=0;i<18000;i++){
 const difficulty=(["easy","medium","hard"]as const)[i%3]!,mode=(["correct-spelling","misspelt-word"]as const)[Math.floor(i/3)%2]!;
 const q=generateEng007CP002QuestionV1({seed:`eng007-cp002-soak:${i}`,difficulty,mode});
 positions[q.correctOptionIndex]++;seen.add(q.metadata.entryId);
}
assert.equal(seen.size,260);for(const x of positions)assert.ok(x>=3900&&x<=5100);
console.log("ENG-007 CP002 validation passed.",{entries:260,positions});
