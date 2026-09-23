import assert from"node:assert/strict";
import{ENG007_CP006_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP006/eng-007-cp006-lexicon-v1";
import{generateEng007CP006QuestionV1}from"../chapters/spelling-correction/ENG-007/CP006/eng-007-cp006-v1";
assert.equal(ENG007_CP006_ENTRIES_V1.length,220);
assert.deepEqual(["easy","medium","hard"].map(d=>ENG007_CP006_ENTRIES_V1.filter(x=>x.difficulty===d).length),[73,111,36]);
assert.equal(new Set(ENG007_CP006_ENTRIES_V1.map(x=>x.correct.toLowerCase())).size,ENG007_CP006_ENTRIES_V1.length);
assert.equal(new Set(ENG007_CP006_ENTRIES_V1.map(x=>x.misspelling.toLowerCase())).size,ENG007_CP006_ENTRIES_V1.length);
for(const e of ENG007_CP006_ENTRIES_V1){
  for(const mode of["correct-spelling","misspelt-word"]as const){
    const q=generateEng007CP006QuestionV1({seed:`entry:${e.id}:${mode}`,difficulty:e.difficulty,entryId:e.id,mode});
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
    assert.equal(q.options[q.correctOptionIndex],mode==="correct-spelling"?e.correct:e.misspelling);
    assert.ok(q.explanation.includes(e.correct));
    assert.ok(q.explanation.length<=90);
    assert.ok(!/pay attention|standard spelling|common-type|internal letter|doubled-letter|word ending/i.test(q.explanation));
  }
}
const positions=[0,0,0,0],seen=new Set<string>();
for(let i=0;i<18000;i++){
  const difficulty=(["easy","medium","hard"]as const)[i%3]!;
  const mode=(["correct-spelling","misspelt-word"]as const)[Math.floor(i/3)%2]!;
  const q=generateEng007CP006QuestionV1({seed:`eng007-cp006-soak:${i}`,difficulty,mode});
  positions[q.correctOptionIndex]++;seen.add(q.metadata.entryId);
  assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
}
assert.equal(seen.size,ENG007_CP006_ENTRIES_V1.length);
for(const x of positions)assert.ok(x>=3900&&x<=5100,`Answer-position imbalance: ${positions.join(",")}`);
console.log("ENG-007 CP006 validation passed.",{entries:ENG007_CP006_ENTRIES_V1.length,positions});
