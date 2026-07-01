import { strict as assert } from "node:assert";
import { buildCsvPilotV2Report } from "./csv-pilot-v2-report";
import { generateCsvPilotV2 } from "./csv-pilot-v2";

const first = await generateCsvPilotV2();
const second = await generateCsvPilotV2();
assert.deepEqual(first, second, "CSV-002 must reproduce deterministically.");
assert.equal(first.accepted.length, 200);
assert.ok(first.accepted.every((item) => item.provenanceStatus === "APPROVED"));
assert.ok(first.accepted.every((item) => item.fallbackUsage === "NO"));
assert.ok(
  first.accepted.every(
    (item) =>
      item.sourceFile.endsWith("question-language.en.json") &&
      item.selectionPath.includes("getQuestionEntry") &&
      item.selectionPath.includes("renderTemplate") &&
      !item.selectionPath.includes("questionFor"),
  ),
);

const report = buildCsvPilotV2Report(first);
assert.equal(report.questionCount, 200);
assert.equal(report.approvedProvenanceCount, 200);
assert.equal(report.partialProvenanceCount, 0);
assert.equal(report.fallbackCount, 0);
assert.equal(report.unknownCount, 0);
assert.equal(report.qlDistribution.length, 5);
assert.ok(report.qlDistribution.every((entry) => entry.count === 40));
assert.equal(report.successTarget.passed, true);

console.log(
  `CSV-002: ${report.questionCount} questions; ` +
    `${report.approvedProvenanceCount} approved provenance; ` +
    `${report.fallbackCount} fallback.`,
);
