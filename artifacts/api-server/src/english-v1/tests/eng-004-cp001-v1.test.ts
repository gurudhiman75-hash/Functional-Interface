import assert from "node:assert/strict";
import { ENG004_CP001_LEXICON_V2, eng004Cp001PoolV2, type Eng004Difficulty } from "../chapters/synonyms-antonyms/ENG-004/CP001/eng-004-cp001-lexicon-v1";
import { generateEng004Cp001QuestionV2 } from "../chapters/synonyms-antonyms/ENG-004/CP001/eng-004-cp001-v1";

assert.equal(ENG004_CP001_LEXICON_V2.length,500);
assert.equal(new Set(ENG004_CP001_LEXICON_V2.map((x)=>x.id)).size,500);
assert.equal(new Set(ENG004_CP001_LEXICON_V2.map((x)=>x.word)).size,500);
assert.equal(eng004Cp001PoolV2("easy").length,170);
assert.equal(eng004Cp001PoolV2("medium").length,180);
assert.equal(eng004Cp001PoolV2("hard").length,150);

let synonymLinks=0,antonymLinks=0,contextual=0;
for(const entry of ENG004_CP001_LEXICON_V2){
  synonymLinks+=entry.synonyms.length;antonymLinks+=entry.antonyms.length;
  assert.ok(entry.synonyms.length+entry.antonyms.length>=1,`${entry.id} has no relation`);
  assert.ok(entry.distractors.length>=3,`${entry.id} lacks distractors`);
  assert.equal(new Set([entry.word,...entry.synonyms,...entry.antonyms].map((x)=>x.toLowerCase())).size,1+entry.synonyms.length+entry.antonyms.length);
  if(entry.senseCount>1&&entry.example)contextual+=1;
  for(const relationType of ["synonym","antonym"] as const){
    const answers=relationType==="synonym"?entry.synonyms:entry.antonyms;
    if(!answers.length)continue;
    const q=generateEng004Cp001QuestionV2({seed:`eng004-cp001-v2-entry:${entry.id}:${relationType}`,difficulty:entry.difficulty,entryId:entry.id,relationType});
    assert.equal(q.options.length,4);
    assert.equal(new Set(q.options.map((x)=>x.toLowerCase())).size,4);
    assert.ok(answers.includes(q.options[q.correctOptionIndex]!));
    assert.equal(q.metadata.entryId,entry.id);
    assert.equal(q.metadata.relationType,relationType);
  }
}
assert.ok(synonymLinks>=700);
assert.ok(antonymLinks>=150);

const positions=[0,0,0,0],seen=new Set<string>(),seenRelations=new Set<string>();
for(let i=0;i<12000;i+=1){
  const difficulty=(["easy","medium","hard"] as const)[i%3] as Eng004Difficulty;
  const q=generateEng004Cp001QuestionV2({seed:`eng004-cp001-v2-soak:${i}`,difficulty});
  positions[q.correctOptionIndex]+=1;seen.add(q.metadata.entryId);seenRelations.add(`${difficulty}:${q.metadata.relationType}`);
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map((x)=>x.toLowerCase())).size,4);
}
assert.equal(seen.size,500);
for(const difficulty of ["easy","medium","hard"] as const){
  assert.ok(seenRelations.has(`${difficulty}:synonym`));
  assert.ok(seenRelations.has(`${difficulty}:antonym`));
}
for(const count of positions)assert.ok(count>=2500&&count<=3500,`Answer-position imbalance: ${positions.join(",")}`);
console.log("ENG-004 CP001 V2 validation passed.",{entries:500,synonymLinks,antonymLinks,contextual,positions});
