import { generateAlpInstance } from "../instance-generator";
import { solveAlpInstance } from "../independent-solver";
import { WORD_BANK } from "../foundation/word";
import { generateAlpCp005Question } from "./generator";
import { ALP_CP005_TASK_REGISTRY } from "./task-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ALP_CP005_TASK_REGISTRY.questionLogics.length === 30, "ALP-CP-005 QL count mismatch.");
assert(WORD_BANK.length >= 250, `ALP-CP-005 governed word reservoir is too small: ${WORD_BANK.length}`);
assert(new Set(WORD_BANK).size === WORD_BANK.length, "ALP-CP-005 governed word reservoir contains duplicate words.");
const eligibleWords = WORD_BANK.filter((word) => word.length >= 6);
assert(eligibleWords.length >= 240, `ALP-CP-005 has too few six-plus-letter words: ${eligibleWords.length}`);
assert(eligibleWords.filter((word) => word.length % 2 === 1).length >= 120, "ALP-CP-005 lacks odd-length variety for single-middle queries.");
assert(eligibleWords.filter((word) => word.length % 2 === 0).length >= 120, "ALP-CP-005 lacks even-length variety for middle-pair queries.");

let generated = 0;
for (const ql of ALP_CP005_TASK_REGISTRY.questionLogics) {
  const visibleWords = new Set<string>();
  for (let seed = 0; seed < 100; seed += 1) {
    const data = generateAlpInstance(ql, seed);
    const solved = solveAlpInstance(ql, data);
    const question = generateAlpCp005Question(ql.qlId, seed, "en-IN");
    assert(question.answer === solved.answer, `${ql.qlId} seed ${seed} failed solver parity.`);
    assert(question.options.length === 4, `${ql.qlId} seed ${seed} failed option count.`);
    assert(question.options[question.correctIndex]?.value === question.answer, `${ql.qlId} seed ${seed} failed answer placement.`);
    if (data.word) visibleWords.add(data.word);
    generated += 1;
  }
  assert(visibleWords.size >= 95, `${ql.qlId} fails the CP005 100-seed word-fatigue gate: ${visibleWords.size} distinct words.`);
}
console.log("ALP-CP-005 checkpoint audit passed.", {
  generated,
  governedWordReservoir: WORD_BANK.length,
  eligibleWords: eligibleWords.length,
});
