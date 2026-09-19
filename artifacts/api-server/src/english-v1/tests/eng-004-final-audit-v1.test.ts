import assert from"node:assert/strict";
import{ENG004_CP001_LEXICON_V2}from"../chapters/synonyms-antonyms/ENG-004/CP001/eng-004-cp001-lexicon-v1";
import{ENG004_CP002_LEXICON_V1}from"../chapters/synonyms-antonyms/ENG-004/CP002/eng-004-cp002-lexicon-v1";
import{ENG004_CP003_LEXICON_V1}from"../chapters/synonyms-antonyms/ENG-004/CP003/eng-004-cp003-lexicon-v1";
import{ENG004_CP004_SENSES_V1}from"../chapters/synonyms-antonyms/ENG-004/CP004/eng-004-cp004-lexicon-v1";
import{ENG004_CP005_LEXICON_V1}from"../chapters/synonyms-antonyms/ENG-004/CP005/eng-004-cp005-lexicon-v1";

const cp1=new Set(ENG004_CP001_LEXICON_V2.map(x=>x.word));
const cp2=new Set(ENG004_CP002_LEXICON_V1.map(x=>x.word));
const cp3=new Set(ENG004_CP003_LEXICON_V1.map(x=>x.word));
const cp5=new Set(ENG004_CP005_LEXICON_V1.map(x=>x.word));

assert.equal(ENG004_CP001_LEXICON_V2.length,500);assert.equal(cp1.size,500);
assert.equal(ENG004_CP002_LEXICON_V1.length,600);assert.equal(cp2.size,600);
assert.equal(ENG004_CP003_LEXICON_V1.length,450);assert.equal(cp3.size,450);
assert.equal(ENG004_CP004_SENSES_V1.length,300);assert.equal(new Set(ENG004_CP004_SENSES_V1.map(x=>x.word)).size,300);
assert.equal(ENG004_CP005_LEXICON_V1.length,550);assert.equal(cp5.size,550);

for(const word of cp2)assert.equal(cp1.has(word),false,`CP002 overlap: ${word}`);
for(const word of cp3)assert.equal(cp1.has(word)||cp2.has(word),false,`CP003 overlap: ${word}`);
const first1550=new Set([...cp1,...cp2,...cp3]);assert.equal(first1550.size,1550);
for(const entry of ENG004_CP004_SENSES_V1)assert.ok(first1550.has(entry.word),`CP004 non-base headword: ${entry.word}`);
for(const word of cp5)assert.equal(first1550.has(word),false,`CP005 overlap: ${word}`);

const uniqueHeadwords=new Set([...first1550,...cp5]);assert.equal(uniqueHeadwords.size,2100);
const all=[...ENG004_CP001_LEXICON_V2,...ENG004_CP002_LEXICON_V1,...ENG004_CP003_LEXICON_V1,...ENG004_CP004_SENSES_V1,...ENG004_CP005_LEXICON_V1];
assert.equal(all.length,2400);

let synonyms=0,antonyms=0;
for(const entry of all){
  synonyms+=entry.synonyms.length;antonyms+=entry.antonyms.length;
  assert.ok(entry.synonyms.length+entry.antonyms.length>0,`Relationless entry: ${entry.word}`);
}
assert.equal(synonyms,5524);assert.equal(antonyms,985);

for(const entry of ENG004_CP004_SENSES_V1){
  assert.ok(entry.context.length>0,`CP004 context missing: ${entry.word}`);
  const blocked=new Set([entry.word,...entry.synonyms,...entry.antonyms,...entry.blockedOtherSenseRelations].map(x=>x.toLowerCase()));
  assert.equal(entry.distractors.some(x=>blocked.has(x.toLowerCase())),false,`CP004 blocked relation leaked: ${entry.word}`);
}
for(const entry of ENG004_CP005_LEXICON_V1){
  if(entry.senseCount>1)assert.ok(entry.example.length>0,`CP005 multi-sense context missing: ${entry.word}`);
  const blocked=new Set([entry.word,...entry.synonyms,...entry.antonyms,...entry.blockedOtherSenseRelations].map(x=>x.toLowerCase()));
  assert.equal(entry.distractors.some(x=>blocked.has(x.toLowerCase())),false,`CP005 blocked relation leaked: ${entry.word}`);
}

console.log("ENG-004 final expansion audit passed.",{uniqueHeadwords:uniqueHeadwords.size,headwordSenses:all.length,synonymLinks:synonyms,antonymLinks:antonyms});
