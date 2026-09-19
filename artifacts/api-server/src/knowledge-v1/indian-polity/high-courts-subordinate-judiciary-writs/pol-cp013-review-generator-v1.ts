import type { PolCp013ReviewQuestion } from "./pol-cp013-review-types";
import { POL_CP013_SEEDS_A } from "./pol-cp013-seeds-a";
import { POL_CP013_SEEDS_B } from "./pol-cp013-seeds-b";
import { POL_CP013_SEEDS_C } from "./pol-cp013-seeds-c";
import { POL_CP013_SEEDS_D } from "./pol-cp013-seeds-d";

export function generatePolCp013ReviewBatchV1(): PolCp013ReviewQuestion[] {
  const seeds=[...POL_CP013_SEEDS_A,...POL_CP013_SEEDS_B,...POL_CP013_SEEDS_C,...POL_CP013_SEEDS_D];
  const questions=seeds.map((seed,index):PolCp013ReviewQuestion=>{
    const correctIndex=(index%4) as 0|1|2|3;
    const options=[...seed.distractors] as string[];
    options.splice(correctIndex,0,seed.canonicalAnswer);
    if(options.length!==4||new Set(options).size!==4) throw new Error(`Invalid options POL-CP013-V1-${index+1}`);
    return {
      questionId:`POL-CP013-V1-${String(index+1).padStart(3,"0")}`,
      qlId:seed.qlId,
      difficulty:seed.difficulty,
      stem:seed.stem,
      options:options as [string,string,string,string],
      correctIndex,
      canonicalAnswer:seed.canonicalAnswer,
      explanation:seed.explanation,
      sourceIds:seed.sourceIds,
      sourceFactIds:seed.sourceFactIds,
    };
  });

  if(questions.length!==80) throw new Error(`Expected 80 questions, got ${questions.length}`);
  if(new Set(questions.map(q=>q.stem)).size!==80) throw new Error("Repeated substantive stem in POL-CP-013 V1");
  if(new Set(questions.map(q=>q.explanation)).size!==80) throw new Error("Repeated explanation in POL-CP-013 V1");

  for(const q of questions){
    if(q.options[q.correctIndex]!==q.canonicalAnswer) throw new Error(`Answer mismatch ${q.questionId}`);
    const explanationWords=q.explanation.trim().split(/\s+/).length;
    const maxExplanationWords = q.qlId === "POL-013-QL-005" ? 55 : 32;
    if(explanationWords<13||explanationWords>maxExplanationWords) throw new Error(`Explanation length ${q.questionId}: ${explanationWords}`);
    if(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) throw new Error(`Generic clutter ${q.questionId}`);
    if(!q.stem.startsWith("Consider the following statements:")){
      const stemWords=q.stem.trim().split(/\s+/).length;
      if(stemWords>30) throw new Error(`Stem too long ${q.questionId}: ${stemWords}`);
      if(!q.stem.trim().endsWith("?")) throw new Error(`Non-question direct stem ${q.questionId}`);
      if(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:/i.test(q.stem) || /\bis mainly under:$|\bis a:$/i.test(q.stem)) throw new Error(`Database-style stem ${q.questionId}`);
    }
  }
  return questions;
}
