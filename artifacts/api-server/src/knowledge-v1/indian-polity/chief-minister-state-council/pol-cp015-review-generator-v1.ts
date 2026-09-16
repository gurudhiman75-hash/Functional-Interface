import type { PolCp015ReviewQuestion } from "./pol-cp015-review-types";
import { POL_CP015_SEEDS_A } from "./pol-cp015-seeds-a";
import { POL_CP015_SEEDS_B } from "./pol-cp015-seeds-b";
import { POL_CP015_SEEDS_C } from "./pol-cp015-seeds-c";
import { POL_CP015_SEEDS_D } from "./pol-cp015-seeds-d";

export function generatePolCp015ReviewBatchV1(): PolCp015ReviewQuestion[] {
  const seeds=[...POL_CP015_SEEDS_A,...POL_CP015_SEEDS_B,...POL_CP015_SEEDS_C,...POL_CP015_SEEDS_D];
  const questions=seeds.map((seed,index):PolCp015ReviewQuestion=>{
    const correctIndex=(index%4) as 0|1|2|3;
    const options=[...seed.distractors] as string[];
    options.splice(correctIndex,0,seed.canonicalAnswer);
    if(options.length!==4 || new Set(options).size!==4) throw new Error(`Invalid options POL-CP015-V1-${index+1}`);
    return {
      questionId:`POL-CP015-V1-${String(index+1).padStart(3,"0")}`,
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
  if(new Set(questions.map(q=>q.stem)).size!==80) throw new Error("Repeated stem in POL-CP-015 V1");
  if(new Set(questions.map(q=>q.explanation)).size!==80) throw new Error("Repeated explanation in POL-CP-015 V1");

  for(const q of questions){
    if(q.options[q.correctIndex]!==q.canonicalAnswer) throw new Error(`Answer mismatch ${q.questionId}`);
    const explanationWords=q.explanation.trim().split(/\s+/).length;
    if(explanationWords<13 || explanationWords>32) throw new Error(`Explanation length ${q.questionId}: ${explanationWords}`);
    if(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(q.explanation)) throw new Error(`Generic clutter ${q.questionId}`);
    if(!q.stem.startsWith("Consider the statements:")){
      const stemWords=q.stem.trim().split(/\s+/).length;
      if(stemWords>30) throw new Error(`Stem too long ${q.questionId}: ${stemWords}`);
      if(!q.stem.trim().endsWith("?")) throw new Error(`Direct stem must end with question mark ${q.questionId}`);
      if(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:|\bis mainly under:$|\bis a:$/i.test(q.stem)) throw new Error(`Database-style stem ${q.questionId}`);
    }
  }
  return questions;
}
