import type { PolCp012ReviewQuestion } from "./pol-cp012-review-types";
import { POL_CP012_SEEDS_A } from "./pol-cp012-seeds-a";
import { POL_CP012_SEEDS_B } from "./pol-cp012-seeds-b";
import { POL_CP012_SEEDS_C } from "./pol-cp012-seeds-c";
import { POL_CP012_SEEDS_D } from "./pol-cp012-seeds-d";

export function generatePolCp012ReviewBatchV1(): PolCp012ReviewQuestion[] {
  const seeds=[...POL_CP012_SEEDS_A,...POL_CP012_SEEDS_B,...POL_CP012_SEEDS_C,...POL_CP012_SEEDS_D];
  const questions=seeds.map((seed,index):PolCp012ReviewQuestion=>{
    const correctIndex=(index%4) as 0|1|2|3;
    const options=[...seed.distractors] as string[];
    options.splice(correctIndex,0,seed.canonicalAnswer);
    if(options.length!==4||new Set(options).size!==4) throw new Error(`Invalid options POL-CP012-V1-${index+1}`);
    return {questionId:`POL-CP012-V1-${String(index+1).padStart(3,"0")}`,qlId:seed.qlId,difficulty:seed.difficulty,stem:seed.stem,options:options as [string,string,string,string],correctIndex,canonicalAnswer:seed.canonicalAnswer,explanation:seed.explanation,sourceIds:seed.sourceIds,sourceFactIds:seed.sourceFactIds};
  });
  if(questions.length!==80) throw new Error(`Expected 80 questions, got ${questions.length}`);
  if(new Set(questions.map(q=>q.explanation)).size!==80) throw new Error("Repeated explanation in POL-CP-012 V1");
  for(const q of questions){
    if(q.options[q.correctIndex]!==q.canonicalAnswer) throw new Error(`Answer mismatch ${q.questionId}`);
    const words=q.explanation.trim().split(/\s+/).length;
    const maxWords = q.explanation.includes("Qualifications:") || q.explanation.includes("Article 124 qualifications:") ? 65 : 32;
    if(words<13||words>maxWords) throw new Error(`Explanation length ${q.questionId}: ${words}`);
    if(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) throw new Error(`Generic clutter ${q.questionId}`);
  }
  return questions;
}
