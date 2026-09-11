import { strict as assert } from "node:assert";
import { generateGeoRiv001Cp007ReviewV2 } from "./geo-riv-001-cp007-review-generator-v2";

const QLS = Array.from({ length: 10 }, (_, index) => `GEO-RIV-001-QL-${String(55 + index).padStart(3, "0")}`);
const banned = /associated with|matches the reviewed relation|listed among|joining relation|therefore,|exam trap|shortcut|both banks|neither bank|at near|at below|at west of|the confluence of the Chandra and Bhaga rivers/i;

for (const qlId of QLS) {
  for (let index = 0; index < 100; index += 1) {
    const seed = `cp007-v2-audit-${qlId}-${index}`;
    const question = generateGeoRiv001Cp007ReviewV2(qlId, seed);
    const again = generateGeoRiv001Cp007ReviewV2(qlId, seed);
    assert.deepEqual(question, again, `NON_DETERMINISTIC:${question.questionId}`);
    assert.equal(question.options.length, 4);
    assert.equal(new Set(question.options).size, 4, `DUPLICATE_OPTION:${question.questionId}`);
    assert.equal(question.options[question.correctIndex], question.canonicalAnswer, `ANSWER_MISMATCH:${question.questionId}`);
    assert.equal(banned.test(`${question.stem}\n${question.explanation}\n${question.options.join("\n")}`), false, `EDITORIAL_DEFECT:${question.questionId}`);
    for (const option of question.options) {
      const pair = option.split(" — ");
      if (pair.length === 2) assert.notEqual(pair[0], pair[1], `SELF_PAIR:${question.questionId}:${option}`);
    }
    if (qlId === "GEO-RIV-001-QL-055" || qlId === "GEO-RIV-001-QL-056") assert.equal(question.difficulty, "Easy");
    else if (qlId === "GEO-RIV-001-QL-062" || qlId === "GEO-RIV-001-QL-064") assert.equal(question.difficulty, "Hard");
    else assert.equal(question.difficulty, "Medium");
  }
}

console.log(JSON.stringify({ valid: true, auditedQuestions: QLS.length * 100, qls: QLS }, null, 2));
