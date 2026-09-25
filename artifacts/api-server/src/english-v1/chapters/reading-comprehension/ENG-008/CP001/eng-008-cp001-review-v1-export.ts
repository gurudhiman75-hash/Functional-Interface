import { writeFileSync } from "node:fs";
import { ENG008_CP001_PASSAGES_V1, generateEng008Cp001QuestionV1 } from "./eng-008-cp001-v1";

const lines:string[]=[
  "# ENG-008 CP001 — Narrative / Story-style Direct Comprehension — Review V1",
  "",
  "Status: `HUMAN_REVIEW_PENDING__REVIEW_ONLY`",
  "",
  "All 12 passages are shown once. Two questions are sampled from each passage for a 24-question editorial review.",
  ""
];

for(const passage of ENG008_CP001_PASSAGES_V1){
  lines.push(`## ${passage.id} — ${passage.difficulty.toUpperCase()} — ${passage.title}`,"");
  passage.paragraphs.forEach((paragraph,index)=>lines.push(`**Paragraph ${index+1}:** ${paragraph}`,""));
  for(const sourceQuestion of passage.questions.slice(0,2)){
    const q=generateEng008Cp001QuestionV1({
      seed:`review:${passage.id}:${sourceQuestion.id}`,
      difficulty:passage.difficulty,
      passageId:passage.id,
      questionId:sourceQuestion.id
    });
    lines.push(`### ${sourceQuestion.id}. ${q.stem}`,"");
    q.options.forEach((option,index)=>lines.push(`${String.fromCharCode(65+index)}. ${option}`));
    lines.push("",`**Answer:** ${String.fromCharCode(65+q.correctOptionIndex)}. ${q.options[q.correctOptionIndex]}`,"",`**Explanation:** ${q.explanation}`,"");
  }
}
writeFileSync("ENG-008-CP001-REVIEW-V1.md",lines.join("\n")+"\n");
console.log("Wrote ENG-008-CP001-REVIEW-V1.md");
