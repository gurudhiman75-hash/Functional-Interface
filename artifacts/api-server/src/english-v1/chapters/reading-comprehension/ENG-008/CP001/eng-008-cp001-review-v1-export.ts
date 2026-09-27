import{mkdirSync,writeFileSync}from"node:fs";
import{dirname,resolve}from"node:path";
import{ENG008_CP001_PASSAGES_V1}from"./eng-008-cp001-authorities-v1";
import{generateEng008Cp001QuestionV1}from"./eng-008-cp001-v1";

const out:string[]=[
 "# ENG-008 CP001 — SSC Foundation Reading Comprehension — Review V1","",
 "Status: HUMAN REVIEW PENDING / REVIEW ONLY","",
 "Scope: full current SSC-foundation authority corpus, with six governed RC families per passage.","",
 "Genres: 4 simple narrative/story + 4 straightforward report/expository. Editorial/current-affairs RC is separated into CP002.","",
 "Families: factual retrieval, inference, main idea, title, vocabulary in context, passage-supported statement.","",
 "Review note: every authority is shown exactly once below. Option order is deterministic for this export.",""
];
let number=0;
for(const passage of ENG008_CP001_PASSAGES_V1){
 out.push(`## ${passage.id} — ${passage.title} [${passage.genre}]`,"",passage.text,"");
 for(const authority of passage.questions){
  number++;
  const q=generateEng008Cp001QuestionV1({seed:`review:${authority.id}`,difficulty:authority.difficulty,authorityId:authority.id});
  out.push(
   `### Q${String(number).padStart(3,"0")} — ${authority.familyId} — ${authority.difficulty.toUpperCase()}`,"",
   q.prompt,"",
   ...q.options.map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`),"",
   `**Answer:** ${String.fromCharCode(65+q.correctOptionIndex)}. ${q.options[q.correctOptionIndex]}`,"",
   `**Explanation:** ${q.explanation}`,"",
   `**Evidence:** ${q.metadata.evidence}`,""
  );
 }
}
const expectedReviewQuestions=ENG008_CP001_PASSAGES_V1.reduce((sum,p)=>sum+p.questions.length,0);
if(number!==expectedReviewQuestions)throw new Error(`Expected ${expectedReviewQuestions} review questions, got ${number}`);
const target=resolve(process.cwd(),"dist/english-v1/ENG-008-CP001-REVIEW-V1.md");
mkdirSync(dirname(target),{recursive:true});
writeFileSync(target,out.join("\n"),"utf8");
console.log(`Wrote ${target} with ${number} RC authorities`);
