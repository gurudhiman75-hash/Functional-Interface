import { generateAlpInstance } from "../instance-generator";
import { solveAlpInstance } from "../independent-solver";
import { generateAlpCp001Question } from "./generator";
import { ALP_CP001_TASK_REGISTRY } from "./task-registry";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(ALP_CP001_TASK_REGISTRY.questionLogics.length === 12, "ALP-CP-001 QL count mismatch.");
let generated = 0;
for (const ql of ALP_CP001_TASK_REGISTRY.questionLogics) {
  for (let seed = 0; seed < 40; seed += 1) {
    const data = generateAlpInstance(ql, seed);
    const solved = solveAlpInstance(ql, data);
    const question = generateAlpCp001Question(ql.qlId, seed, "en-IN");
    assert(question.answer === solved.answer, `${ql.qlId} seed ${seed} failed solver parity.`);
    assert(question.options.length === 4, `${ql.qlId} seed ${seed} failed option count.`);
    assert(question.options[question.correctIndex]?.value === question.answer, `${ql.qlId} seed ${seed} failed answer placement.`);
    generated += 1;
  }
}
console.log("ALP-CP-001 checkpoint audit passed.", { generated });
