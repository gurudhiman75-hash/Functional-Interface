import assert from "node:assert/strict";
import { buildMenCp010ExamRealismReviewV2 } from "./review-v2";

const records = buildMenCp010ExamRealismReviewV2();
assert.equal(records.length, 208);

const machinePrecisionDisplays = records.flatMap((q) =>
  [q.answer, ...q.options.map((option) => option.display)]
    .filter((display) => /\d+\.\d{6,}\s*(?:cm³|m³|cm²|m²|cm|m|litres)/.test(display))
    .map((display) => ({ qlId: q.permanentQlId, sourceId: q.sourceId, display })),
);
assert.deepEqual(machinePrecisionDisplays, [], "setter artifact must not expose floating-point tails");

const sourceTrapRequirements: Readonly<Record<string, RegExp>> = {
  "MEN-CP010-PROT-SQUARE-PYRAMID-LSA": /do not add the square base/i,
  "V3-REGULAR-PYRAMID-LSA": /do not add the base area/i,
  "MEN-CP010-PROT-SQUARE-PYRAMID-TSA": /include the square base exactly once/i,
  "V3-REGULAR-PYRAMID-TSA": /include the base area .*exactly once/i,
  "MEN-CP010-PROT-CONICAL-FRUSTUM-CSA": /do not add either circular end/i,
  "MEN-CP010-PROT-CONICAL-FRUSTUM-TSA": /include both circular ends exactly once/i,
  "MEN-CP010-PROT-SQUARE-FRUSTUM-LSA": /do not add either square base/i,
  "V3-REGULAR-FRUSTUM-LSA": /do not add the parallel-base areas/i,
  "MEN-CP010-PROT-SQUARE-FRUSTUM-TSA": /include both square bases exactly once/i,
};

const missingSourceSpecificTeaching = records.flatMap((q) => {
  const required = sourceTrapRequirements[q.sourceId];
  if (!required) return [];
  const trapText = q.explanation.traps.join(" | ");
  return required.test(trapText)
    ? []
    : [{ qlId: q.permanentQlId, sourceId: q.sourceId, traps: q.explanation.traps }];
});
assert.deepEqual(
  missingSourceSpecificTeaching,
  [],
  "direct LSA/TSA states must carry source-specific exposed-surface teaching",
);

const optionParityFailures = records
  .filter((q) => q.options[q.correctIndex]?.display !== q.answer)
  .map((q) => ({ qlId: q.permanentQlId, sourceId: q.sourceId, answer: q.answer }));
assert.deepEqual(optionParityFailures, [], "presentation polishing must preserve displayed answer parity");

console.log(JSON.stringify({
  authority: "MEN-CP010-FINAL-EDITORIAL-PRESENTATION-V2",
  reviewRecordCount: records.length,
  machinePrecisionDisplayCount: machinePrecisionDisplays.length,
  sourceSpecificTeachingFailureCount: missingSourceSpecificTeaching.length,
  optionParityFailureCount: optionParityFailures.length,
  status: "PASS",
}, null, 2));
