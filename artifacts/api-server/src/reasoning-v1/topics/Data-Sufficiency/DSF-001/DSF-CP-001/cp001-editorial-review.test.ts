import assert from "node:assert/strict";
import { SUFFICIENCY_CLASSES } from "../foundation/index.ts";
import { generateDsfCp001NumberSystemQuestion } from "./cp001-number-system-runtime.ts";

const corpus = Array.from({ length: 200 }, (_, seed) => generateDsfCp001NumberSystemQuestion(seed));
const learnerText = (question: ReturnType<typeof generateDsfCp001NumberSystemQuestion>) => [
  question.stem,
  question.questionPrompt,
  ...question.statements.map((statement) => statement.text),
  ...question.options.map((option) => option.value),
  question.explanation.askedTarget,
  question.explanation.statementI,
  question.explanation.statementII,
  question.explanation.together ?? "",
  question.explanation.conclusion,
].join(" ");

for (const question of corpus) {
  const text = learnerText(question);
  assert(!/normalized|target projection|surviving world|world count|semantic class|ql-|dsf-|num-/i.test(text));
  assert(question.stem.length < 240);
  assert(question.statements.every((statement) => statement.text.length < 100));
  assert(question.explanation.statementI.split(/\s+/).length < 45);
  assert(question.explanation.statementII.split(/\s+/).length < 45);
  if (question.canonicalAnswer === "BOTH_TOGETHER_ONLY" || question.canonicalAnswer === "INSUFFICIENT_EVEN_TOGETHER") {
    assert(question.explanation.together);
  } else {
    assert.equal(question.explanation.together, undefined);
  }
  if (question.canonicalAnswer === "BOTH_TOGETHER_ONLY") {
    assert.match(question.explanation.conclusion, /neither statement alone/i);
  }
  if (question.canonicalAnswer === "EACH_STATEMENT_ALONE") {
    assert.equal(question.explanation.conclusion, "Each statement alone is sufficient.");
  }
}

const representative = SUFFICIENCY_CLASSES.map((semanticClass) => {
  const question = corpus.find((candidate) => candidate.canonicalAnswer === semanticClass)!;
  assert(question, `Missing representative for ${semanticClass}`);
  return {
    seed: question.seed,
    class: semanticClass,
    difficulty: question.difficulty,
    solveMode: question.solveModeId,
    stem: question.stem,
    statementI: question.statements[0].text,
    statementII: question.statements[1].text,
    correctOption: question.options[question.correctIndex]?.value,
    explanation: [
      question.explanation.statementI,
      question.explanation.statementII,
      question.explanation.together,
      question.explanation.conclusion,
    ].filter(Boolean),
  };
});

const parityRepresentative = corpus.find((question) => question.targetKind === "DIGIT_PARITY" && (
  (question.proof.statementIDigits.length > 1 && question.proof.statementITargetAnswers.length === 1)
  || (question.proof.statementIIDigits.length > 1 && question.proof.statementIITargetAnswers.length === 1)
  || (question.proof.togetherDigits.length > 1 && question.proof.togetherTargetAnswers.length === 1)
));
assert(parityRepresentative);

console.log(JSON.stringify({
  status: "PASS_DSF_CP_001_EDITORIAL_REVIEW_GATE",
  reviewed: corpus.length,
  representative,
  parityProjectionRepresentative: {
    seed: parityRepresentative.seed,
    class: parityRepresentative.canonicalAnswer,
    stem: parityRepresentative.stem,
    statementI: parityRepresentative.statements[0].text,
    statementII: parityRepresentative.statements[1].text,
    proof: parityRepresentative.proof,
    explanation: parityRepresentative.explanation,
  },
}, null, 2));
