import { generatePolCp006ReviewBatchV1 } from "./pol-cp006-review-generator-v1";

function placeCorrect(options: string[], correct: string, target: number) {
  const index=options.indexOf(correct);
  if(index<0) throw new Error(`Correct option missing: ${correct}`);
  [options[index],options[target]]=[options[target],options[index]];
  return options;
}

export function generatePolCp006ReviewBatchV2() {
  const questions=generatePolCp006ReviewBatchV1().map((q) => {
    if(q.qlId !== "POL-006-QL-024") return q;

    if(q.canonicalAnswer === "Forty-second Amendment") {
      return { ...q, options: placeCorrect(["Forty-second Amendment","Forty-fourth Amendment","Twenty-fourth Amendment","Fifty-second Amendment"],q.canonicalAnswer,q.correctIndex) };
    }
    if(q.canonicalAnswer === "Forty-fourth Amendment") {
      return { ...q, options: placeCorrect(["Forty-fourth Amendment","Forty-second Amendment","Twenty-fourth Amendment","Fifty-second Amendment"],q.canonicalAnswer,q.correctIndex) };
    }
    return q;
  });

  for(const q of questions) {
    if(q.options.length!==4 || new Set(q.options).size!==4) throw new Error(`Duplicate/invalid options in ${q.questionId}`);
    if(q.options[q.correctIndex]!==q.canonicalAnswer) throw new Error(`Answer mismatch in ${q.questionId}`);
  }
  return questions;
}
