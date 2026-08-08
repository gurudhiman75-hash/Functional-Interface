import { RNK_CP005_AUTHORITY_IDS } from "./cp005-foundation";
import { generateRnkCp005ExamReadyQuestion } from "./cp005-exam-language-v2";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let pairQuestionsChecked = 0;
let neighbourQuestionsChecked = 0;
let totalQuestionsChecked = 0;

for (let seed = 0; seed < 192; seed += 1) {
  for (const authorityId of RNK_CP005_AUTHORITY_IDS) {
    const question = generateRnkCp005ExamReadyQuestion(authorityId, seed, seed % 4);
    totalQuestionsChecked += 1;
    assert(question.options.length === 4, `${authorityId}:${seed}: expected four options`);
    assert(new Set(question.options.map((option) => option.answerKey)).size === 4, `${authorityId}:${seed}: duplicate answer keys`);
    assert(question.options[question.correctIndex].answerKey === question.answerKey, `${authorityId}:${seed}: correct option drift`);

    if (question.query.kind === "PAIR_RELATION") {
      pairQuestionsChecked += 1;
      const { first, second } = question.query;
      for (const option of question.options) {
        assert(option.label.includes(first), `${authorityId}:${seed}: pair option omits ${first}`);
        assert(option.label.includes(second), `${authorityId}:${seed}: pair option omits ${second}`);
      }
      assert(
        question.options.filter((option) => option.answerKey.includes(">")).length === 2,
        `${authorityId}:${seed}: pair options must contain exactly the two possible directions`,
      );
    }

    if (question.query.kind === "IMMEDIATE_NEIGHBOUR") {
      neighbourQuestionsChecked += 1;
      assert(
        question.options.every((option) => option.label !== question.query.target),
        `${authorityId}:${seed}: target person offered as own neighbour`,
      );
      assert(
        question.options.every((option) => option.answerKey !== question.query.target),
        `${authorityId}:${seed}: target answer key offered as own neighbour`,
      );
    }
  }
}

assert(pairQuestionsChecked === 192, `Expected 192 pair questions, found ${pairQuestionsChecked}`);
assert(neighbourQuestionsChecked === 192, `Expected 192 neighbour questions, found ${neighbourQuestionsChecked}`);

console.log(JSON.stringify({
  status: "PASS",
  totalQuestionsChecked,
  pairQuestionsChecked,
  neighbourQuestionsChecked,
  unrelatedPairOptionCount: 0,
  targetAsOwnNeighbourOptionCount: 0,
}, null, 2));
