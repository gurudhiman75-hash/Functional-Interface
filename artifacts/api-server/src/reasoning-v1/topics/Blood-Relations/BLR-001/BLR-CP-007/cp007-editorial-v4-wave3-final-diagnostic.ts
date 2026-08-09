import { generateBlrCp007EditorialV4Wave3FinalBank } from "./cp007-editorial-v4-wave3-final";

const ambiguities = generateBlrCp007EditorialV4Wave3FinalBank()
  .filter((question) => question.qlId !== "BLR-QL-035")
  .flatMap((question) => {
    const satisfying = question.options
      .map((option, index) => ({
        index,
        text: option.text,
        semanticKey: option.semanticKey,
        actualRelation: option.actualRelation,
        targetRelationSatisfied: option.targetRelationSatisfied,
        markedCorrect: option.isCorrectAnswerForTask,
      }))
      .filter((option) => option.targetRelationSatisfied);
    return satisfying.length === 1 ? [] : [{
      itemId: question.itemId,
      qlId: question.qlId,
      prototype: question.sourcePrototypeId,
      target: "target" in question.query ? question.query.target : null,
      correctIndex: question.correctIndex,
      answer: question.answer,
      satisfying,
    }];
  });

console.log(JSON.stringify({ semanticAmbiguities: ambiguities }, null, 2));
