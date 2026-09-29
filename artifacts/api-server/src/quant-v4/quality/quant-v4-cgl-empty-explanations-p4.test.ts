import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { QuantV4CglTier1ShadowQuestionRecord } from "./quant-v4-cgl-tier1-shadow-simulation-p3";

const snapshotPath = "dist/quant-v4/quality/quant-v4-cgl-tier1-shadow-simulation-p3.audit.json";
const snapshot = JSON.parse(readFileSync(snapshotPath, "utf8")) as {
  records?: QuantV4CglTier1ShadowQuestionRecord[];
};
const records = snapshot.records ?? [];
const empty = records.filter((record) =>
  record.sourceKind === "RUNTIME_GENERATED" && record.emptyExplanation
);
assert.equal(records.length, 500);
console.log("QUANT_V4_CGL_EMPTY_EXPLANATIONS_P4", JSON.stringify({
  count: empty.length,
  records: empty.map((record) => ({
    sectionIndex: record.sectionIndex,
    ordinal: record.ordinal,
    slotKind: record.slotKind,
    packageId: record.packageId,
    questionId: record.questionId ?? null,
    canonicalProblemId: record.canonicalProblemId ?? null,
    questionLanguageId: record.questionLanguageId ?? null,
    taskKind: record.taskKind ?? null,
    literalStem: record.literalStemSignature,
  })),
}));
