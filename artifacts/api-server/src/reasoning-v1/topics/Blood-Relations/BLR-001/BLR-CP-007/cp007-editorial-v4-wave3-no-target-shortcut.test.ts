import { strict as assert } from "node:assert";
import {
  buildBlrCp007EditorialV4Wave3FinalTelemetry,
  generateBlrCp007EditorialV4Wave3FinalBank,
} from "./cp007-editorial-v4-wave3-final";

const bank = generateBlrCp007EditorialV4Wave3FinalBank();
const ql034 = bank.filter((question) => question.qlId === "BLR-QL-034");
const offenders = ql034.flatMap((question) => {
  if (question.query.kind !== "MISSING_PERSON") return [];
  const targetPeople = [question.query.target.subjectId, question.query.target.referenceId];
  return targetPeople.includes(question.answer)
    ? [{ itemId: question.itemId, answer: question.answer, target: question.query.target }]
    : [];
});
const telemetry = buildBlrCp007EditorialV4Wave3FinalTelemetry(bank);

assert.equal(ql034.length, 32);
assert.deepEqual(offenders, []);
assert.equal(telemetry.ql034AnswerMentionedInTargetCount, 0);

console.log(JSON.stringify({
  ql034Questions: ql034.length,
  ql034AnswerMentionedInTargetCount: telemetry.ql034AnswerMentionedInTargetCount,
  verdict: "QL-034 TARGET-NAME SHORTCUT AUDIT PASSED",
}, null, 2));
