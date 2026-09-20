import assert from"node:assert/strict";
import{ENG005_CP001_IDIOMS_V1}from"../chapters/idioms-phrases/ENG-005/CP001/eng-005-cp001-lexicon-v1";
import{generateEng005Cp001QuestionV1}from"../chapters/idioms-phrases/ENG-005/CP001/eng-005-cp001-v1";
import{ENG005_CP002_IDIOMS_V1}from"../chapters/idioms-phrases/ENG-005/CP002/eng-005-cp002-lexicon-v1";
import{generateEng005Cp002QuestionV1}from"../chapters/idioms-phrases/ENG-005/CP002/eng-005-cp002-v1";
import{ENG005_CP003_IDIOMS_V1}from"../chapters/idioms-phrases/ENG-005/CP003/eng-005-cp003-lexicon-v1";
import{generateEng005Cp003QuestionV1}from"../chapters/idioms-phrases/ENG-005/CP003/eng-005-cp003-v1";
import{ENG005_CP004_IDIOMS_V1}from"../chapters/idioms-phrases/ENG-005/CP004/eng-005-cp004-lexicon-v1";
import{generateEng005Cp004QuestionV1}from"../chapters/idioms-phrases/ENG-005/CP004/eng-005-cp004-v1";

const cps=[ENG005_CP001_IDIOMS_V1,ENG005_CP002_IDIOMS_V1,ENG005_CP003_IDIOMS_V1,ENG005_CP004_IDIOMS_V1] as const;
assert.deepEqual(cps.map(x=>x.length),[180,240,240,180]);
const all=cps.flatMap(x=>[...x]);
assert.equal(all.length,840);
assert.equal(new Set(all.map(x=>x.phrase.toLowerCase())).size,840);
for(const e of all){assert.ok(e.phrase.trim().length>2);assert.ok(e.meaning.trim().length>2);assert.ok(e.category.trim().length>2);}
for(const e of ENG005_CP004_IDIOMS_V1)assert.ok(e.contextTemplate.includes("{idiom}"));

async function checkFamily(
  generator:(input:any)=>any,
  entries:readonly any[],
  family:readonly string[],
  cp:string,
){
  for(const phrase of family){
    const e=entries.find(x=>x.phrase===phrase);assert.ok(e,`${cp}: missing family phrase ${phrase}`);
    for(const mode of["idiom-to-meaning","meaning-to-idiom"]as const){
      for(let i=0;i<20;i++){
        const q=generator({seed:`${cp}:family:${phrase}:${mode}:${i}`,difficulty:e.difficulty,entryId:e.id,mode});
        const options=q.options.map((x:string)=>x.toLowerCase());
        const forbidden=family.filter(x=>x!==phrase).map(x=>{
          const other=entries.find(y=>y.phrase===x)!;
          return (mode==="idiom-to-meaning"?other.meaning:other.phrase).toLowerCase();
        });
        for(const x of forbidden)assert.ok(!options.includes(x),`${cp}: near-equivalent leakage ${phrase} -> ${x}`);
      }
    }
  }
}
await checkFamily(generateEng005Cp001QuestionV1,ENG005_CP001_IDIOMS_V1,["spill the beans","let the cat out of the bag"],"CP001");
await checkFamily(generateEng005Cp001QuestionV1,ENG005_CP001_IDIOMS_V1,["leave no stone unturned","move heaven and earth","spare no effort"],"CP001");
await checkFamily(generateEng005Cp002QuestionV1,ENG005_CP002_IDIOMS_V1,["have a close shave","have a narrow escape","by the skin of one's teeth"],"CP002");
await checkFamily(generateEng005Cp002QuestionV1,ENG005_CP002_IDIOMS_V1,["lose steam","run out of steam"],"CP002");
await checkFamily(generateEng005Cp003QuestionV1,ENG005_CP003_IDIOMS_V1,["the last straw","the straw that broke the camel's back"],"CP003");
await checkFamily(generateEng005Cp004QuestionV1,ENG005_CP004_IDIOMS_V1,["in a pickle","in a jam","in a fix","up the creek without a paddle","in dire straits"],"CP004");
await checkFamily(generateEng005Cp004QuestionV1,ENG005_CP004_IDIOMS_V1,["throw in the towel","wave the white flag"],"CP004");

const generators=[generateEng005Cp001QuestionV1,generateEng005Cp002QuestionV1,generateEng005Cp003QuestionV1,generateEng005Cp004QuestionV1] as const;
const seen=new Set<string>();const positions=[0,0,0,0];
for(let i=0;i<24000;i++){
  const cp=i%4,difficulty=(["easy","medium","hard"]as const)[i%3],generator=generators[cp]!;
  const q:any=generator({seed:`eng005-final:${i}`,difficulty});
  seen.add(`${cp+1}:${q.metadata.entryId}`);positions[q.correctOptionIndex]++;
  assert.equal(q.options.length,4);assert.equal(new Set(q.options.map((x:string)=>x.toLowerCase())).size,4);
}
assert.equal(seen.size,840);
for(const n of positions)assert.ok(n>=5400&&n<=6600,`Final answer-position imbalance: ${positions.join(",")}`);
console.log("ENG-005 final audit passed.",{expressions:840,positions});
