import { generateBlrCp007EditorialV4Wave3Bank } from "./cp007-editorial-v4-wave3";
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

const gaps = generateBlrCp007EditorialV4Wave3Bank()
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
console.log(JSON.stringify({ ql031ResidualDistractorGaps: gaps }, null, 2));
