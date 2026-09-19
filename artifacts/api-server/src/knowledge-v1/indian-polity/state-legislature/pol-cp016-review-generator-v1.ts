import type { PolCp016ReviewQuestion } from "./pol-cp016-review-types";
import { POL_CP016_SEEDS_A } from "./pol-cp016-seeds-a";
import { POL_CP016_SEEDS_B } from "./pol-cp016-seeds-b";
import { POL_CP016_SEEDS_C } from "./pol-cp016-seeds-c";
import { POL_CP016_SEEDS_D } from "./pol-cp016-seeds-d";

export function generatePolCp016ReviewBatchV1(): PolCp016ReviewQuestion[] {
  const seeds=[...POL_CP016_SEEDS_A,...POL_CP016_SEEDS_B,...POL_CP016_SEEDS_C,...POL_CP016_SEEDS_D];
  const questions=seeds.map((seed,index):PolCp016ReviewQuestion=>{
    const correctIndex=(index%4) as 0|1|2|3;
    const options=[...seed.distractors] as string[];
    options.splice(correctIndex,0,seed.canonicalAnswer);
    if(options.length!==4||new Set(options).size!==4) throw new Error(`Invalid options POL-CP016-V1-${index+1}`);
    return {
      questionId:`POL-CP016-V1-${String(index+1).padStart(3,"0")}`,
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

  if(questions.length!==96) throw new Error(`Expected 96 questions, got ${questions.length}`);
  if(new Set(questions.map(q=>q.explanation)).size!==96) throw new Error("Repeated explanation in POL-CP-016 V1");
  if(new Set(questions.map(q=>q.stem)).size!==96) throw new Error("Repeated stem in POL-CP-016 V1");

  for(const question of questions){
    if(question.options[question.correctIndex]!==question.canonicalAnswer) throw new Error(`Answer mismatch ${question.questionId}`);
    const words=question.explanation.trim().split(/\s+/).length;
    const maxWords = question.explanation.includes("Article 173 qualifications:") ? 60 : 32;
    if(words<13||words>maxWords) throw new Error(`Explanation length ${question.questionId}: ${words}`);
    if(/Correct answer:|This is the exact|nearby Articles|Match the topic|Remember the word/i.test(question.explanation)) throw new Error(`Generic clutter ${question.questionId}`);
    const isStatement=question.stem.startsWith("Consider the statements:");
    if(!isStatement){
      if(!question.stem.endsWith("?")) throw new Error(`Incomplete stem ${question.questionId}`);
      if(question.stem.trim().split(/\s+/).length>30) throw new Error(`Stem too long ${question.questionId}`);
    }
    if(/^Article\s+\d+[A-Z]?\s+(mainly\s+)?deals with:|\bis mainly under:$|\bis a:$/i.test(question.stem)) throw new Error(`Database-style stem ${question.questionId}`);
  }
  return questions;
}
