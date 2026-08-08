import {
  buildBlrCp007EditorialV4Wave3FinalTelemetry,
  generateBlrCp007EditorialV4Wave3FinalBank,
} from "./cp007-editorial-v4-wave3-final";
import type { GeneratedBlrCp007EditorialV4Question } from "./cp007-editorial-v4-model";

function changedPositions(
  correct: GeneratedBlrCp007EditorialV4Question["completedStatements"],
  candidate: GeneratedBlrCp007EditorialV4Question["completedStatements"],
): number[] {
  const changed: number[] = [];
  for (let index = 0; index < correct.length; index += 1) {
    const left = correct[index]!;
    const right = candidate[index]!;
    if (left.leftId !== right.leftId || left.rightId !== right.rightId || left.token !== right.token) changed.push(index);
  }
  return changed;
}

const bank = generateBlrCp007EditorialV4Wave3FinalBank();
const telemetry = buildBlrCp007EditorialV4Wave3FinalTelemetry(bank);
const ql031ResidualDistractorGaps = bank
  .filter((question) => question.qlId === "BLR-QL-031" && question.query.kind === "SELECT_EXPRESSION")
  .flatMap((question) => {
    const correct = question.options[question.correctIndex]!.completedStatements;
    if (correct.length < 2 || question.sourcePrototypeId.includes("SELECT-DIRECT")) return [];
    const wrong = question.options.filter((option) => !option.isCorrectAnswerForTask);
    const changes = wrong.map((option) => ({ text: option.text, positions: changedPositions(correct, option.completedStatements) }));
    const covered = new Set(changes.flatMap((value) => value.positions));
    return covered.size < 2 ? [{
      itemId: question.itemId,
      prototype: question.sourcePrototypeId,
      target: question.query.target,
      correct: question.answer,
      changes,
    }] : [];
  });
const semanticAmbiguities = bank
  .filter((question) => question.qlId !== "BLR-QL-035")
  .flatMap((question) => {
    const satisfying = question.options.filter((option) => option.targetRelationSatisfied);
    return satisfying.length === 1 ? [] : [{
      itemId: question.itemId,
      qlId: question.qlId,
      prototype: question.sourcePrototypeId,
      satisfying: satisfying.map((option) => ({
        text: option.text,
        semanticKey: option.semanticKey,
        actualRelation: option.actualRelation,
        markedCorrect: option.isCorrectAnswerForTask,
      })),
    }];
  });

console.log(JSON.stringify({
  telemetry,
  ql031ResidualDistractorGaps,
  semanticAmbiguities,
}, null, 2));
