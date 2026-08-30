import { generateCom002ReviewQuestionV2 } from "./com002-review-synthesis-v2";

const qlIds = Array.from({ length: 13 }, (_, index) => `COM-002-QL-${String(index + 1).padStart(3, "0")}`);
let number = 0;
for (const qlId of qlIds) {
  for (const suffix of ["A", "B"]) {
    number += 1;
    const seed = `human-review-wave1:${qlId}:${suffix}`;
    const question = generateCom002ReviewQuestionV2({ qlId, seed });
    console.log(`\n[COM002-HUMAN-REVIEW] Q${String(number).padStart(2, "0")} ${qlId} ${question.surfaceMode}`);
    console.log(`Seed: ${seed}`);
    console.log(question.stem);
    question.options.forEach((option, index) => {
      console.log(`${String.fromCharCode(65 + index)}. ${option}${index === question.correctIndex ? "  <-- CORRECT" : ""}`);
    });
    console.log(`Answer: ${question.canonicalAnswer}`);
    console.log(`Explanation: ${question.explanation}`);
    console.log(`Sources: ${question.sourceIds.join(", ")}`);
    console.log(`Facts: ${question.sourceFactIds.join(", ")}`);
  }
}
console.log(`\n[com002-human-review-wave1-v2] PASS questions=${number}`);
