import assert from"node:assert/strict";
import{ENG007_CP001_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP001/eng-007-cp001-lexicon-v1";
import{ENG007_CP002_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP002/eng-007-cp002-lexicon-v1";
import{ENG007_CP003_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP003/eng-007-cp003-lexicon-v1";
import{ENG007_CP004_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP004/eng-007-cp004-lexicon-v1";
import{ENG007_CP005_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP005/eng-007-cp005-lexicon-v1";
import{ENG007_CP006_ENTRIES_V1}from"../chapters/spelling-correction/ENG-007/CP006/eng-007-cp006-lexicon-v1";
const all=[...ENG007_CP001_ENTRIES_V1,...ENG007_CP002_ENTRIES_V1,...ENG007_CP003_ENTRIES_V1,...ENG007_CP004_ENTRIES_V1,...ENG007_CP005_ENTRIES_V1,...ENG007_CP006_ENTRIES_V1];
assert.equal(all.length,1387);
const correct=all.map(x=>x.correct.toLowerCase()),wrong=all.map(x=>x.misspelling.toLowerCase());
assert.equal(new Set(correct).size,1387,"duplicate canonical spellings");
assert.equal(new Set(wrong).size,1387,"duplicate misspellings");
const correctSet=new Set(correct),wrongSet=new Set(wrong);
assert.equal(correct.filter(x=>wrongSet.has(x)).length,0,"canonical spelling collides with a misspelling");
assert.equal(wrong.filter(x=>correctSet.has(x)).length,0,"misspelling collides with a canonical spelling");
for(const e of all){assert.ok(/^[a-z]+$/i.test(e.correct));assert.ok(/^[a-z]+$/i.test(e.misspelling));}
console.log("ENG-007 CP001-CP006 breadth audit passed.",{canonical:correctSet.size,misspellings:wrongSet.size});
