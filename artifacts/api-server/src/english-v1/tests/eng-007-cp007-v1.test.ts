import assert from"node:assert/strict";
import{ENG007_CP007_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP007/eng-007-cp007-lexicon-v1";
import{generateEng007CP007QuestionV1}from"../chapters/spelling-correction/ENG-007/CP007/eng-007-cp007-v1";

assert.equal(ENG007_CP007_ENTRIES_V1.length,53);
assert.deepEqual(["easy","medium","hard"].map(d=>ENG007_CP007_ENTRIES_V1.filter(x=>x.difficulty===d).length),[21,25,7]);
assert.equal(new Set(ENG007_CP007_ENTRIES_V1.map(x=>x.correct.toLowerCase())).size,53);
assert.equal(new Set(ENG007_CP007_ENTRIES_V1.map(x=>x.misspelling.toLowerCase())).size,53);
const canonicalSet=new Set(ENG007_CP007_ENTRIES_V1.map(x=>x.correct.toLowerCase()));
const misspellingSet=new Set(ENG007_CP007_ENTRIES_V1.map(x=>x.misspelling.toLowerCase()));

for(const e of ENG007_CP007_ENTRIES_V1){
  for(const mode of["correct-spelling","misspelt-word"]as const){
    const q=generateEng007CP007QuestionV1({seed:`entry:${e.id}:${mode}`,difficulty:e.difficulty,entryId:e.id,mode});
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);
    assert.equal(q.options[q.correctOptionIndex],mode==="correct-spelling"?e.correct:e.misspelling);
    const canonicalOptions=q.options.filter(x=>canonicalSet.has(x.toLowerCase())).length;
    const misspeltOptions=q.options.filter(x=>misspellingSet.has(x.toLowerCase())).length;
    if(mode==="correct-spelling"){assert.equal(canonicalOptions,1);assert.equal(misspeltOptions,3);}
    else{assert.equal(canonicalOptions,3);assert.equal(misspeltOptions,1);}
    assert.ok(q.explanation.includes(e.correct));
    assert.ok(q.explanation.length<=90);
  }
}
const positions=[0,0,0,0],seen=new Set<string>();
for(let i=0;i<18000;i++){
  const difficulty=(["easy","medium","hard"]as const)[i%3]!;
  const mode=(["correct-spelling","misspelt-word"]as const)[Math.floor(i/3)%2]!;
  const q=generateEng007CP007QuestionV1({seed:`eng007-cp007-soak:${i}`,difficulty,mode});
  positions[q.correctOptionIndex]++;seen.add(q.metadata.entryId);
}
assert.equal(seen.size,53);
for(const x of positions)assert.ok(x>=3900&&x<=5100,`Answer-position imbalance: ${positions.join(",")}`);
console.log("ENG-007 CP007 validation passed.",{entries:53,positions});
