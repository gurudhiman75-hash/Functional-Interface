import assert from "node:assert/strict";
import { ENG004_CP001_LEXICON_V1, eng004Cp001PoolV1, type Eng004Difficulty } from "../chapters/synonyms-antonyms/ENG-004/CP001/eng-004-cp001-lexicon-v1";
import { generateEng004Cp001QuestionV1 } from "../chapters/synonyms-antonyms/ENG-004/CP001/eng-004-cp001-v1";

assert.equal(ENG004_CP001_LEXICON_V1.length,36);
for(const difficulty of ["easy","medium","hard"] as const){
  assert.equal(eng004Cp001PoolV1(difficulty).length,12);
}

for(const entry of ENG004_CP001_LEXICON_V1){
  for(const relationType of ["synonym","antonym"] as const){
    const input={seed:`eng004-cp001-entry-check:${entry.id}:${relationType}`,difficulty:entry.difficulty,entryId:entry.id,relationType};
    const a=generateEng004Cp001QuestionV1(input);
    const b=generateEng004Cp001QuestionV1(input);
    assert.deepEqual(a,b);
    assert.equal(a.options.length,4);
    assert.equal(new Set(a.options.map((x)=>x.toLowerCase())).size,4);
    assert.ok(a.correctOptionIndex>=0&&a.correctOptionIndex<4);
    assert.equal(a.metadata.entryId,entry.id);
    assert.equal(a.metadata.relationType,relationType);
    assert.match(a.explanation,new RegExp(entry.word,"i"));
    assert.match(a.explanation,/Example:/);
  }
}

const positions=[0,0,0,0];
const seen=new Set<string>();
const seenRelations=new Set<string>();
for(let i=0;i<6000;i+=1){
  const difficulty=(["easy","medium","hard"] as const)[i%3] as Eng004Difficulty;
  const q=generateEng004Cp001QuestionV1({seed:`eng004-cp001-soak:${i}`,difficulty});
  positions[q.correctOptionIndex]+=1;
  seen.add(q.metadata.entryId);
  seenRelations.add(`${difficulty}:${q.metadata.relationType}`);
  assert.equal(q.options.length,4);
  assert.equal(new Set(q.options.map((x)=>x.toLowerCase())).size,4);
}
assert.equal(seen.size,36);
for(const difficulty of ["easy","medium","hard"] as const){
  assert.ok(seenRelations.has(`${difficulty}:synonym`));
  assert.ok(seenRelations.has(`${difficulty}:antonym`));
}
for(const count of positions) assert.ok(count>=1200&&count<=1800,`Answer-position imbalance: ${positions.join(",")}`);

console.log("ENG-004 CP001 validation passed.",{entries:seen.size,positions});
