import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { generateSylQuestionV5 } from "./generator-v5";
import { SYL_QL_REGISTRY } from "./ql-registry";

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
const MODAL_TASKS = new Set([
  "CLASSIFY_CONCLUSION_MODALITY",
  "ONLY_MODAL_CLASSIFICATION",
  "FEW_MODAL_CLASSIFICATION",
  "MIXED_MODAL_CLASSIFICATION",
]);
const LIVE_MODAL_STATUSES = new Set([
  "DEFINITELY_TRUE",
  "POSSIBLY_TRUE_NOT_DEFINITE",
  "IMPOSSIBLE",
]);

let records = 0;
let modalRecords = 0;
let deadInconsistentOptions = 0;
let nonModalOptionCountMismatches = 0;
const modalQlIds = new Set<string>();

for (const definition of SYL_QL_REGISTRY) {
  for (let seed = 0; seed < 80; seed += 1) {
    for (const locale of locales) {
      const question = generateSylQuestionV5(definition.qlId, seed, locale);
      records += 1;

      const correctOptions = question.options.filter((option) => option.isCorrect);
      assert.equal(
        correctOptions.length,
        1,
        `${definition.qlId}/${seed}/${locale}: expected exactly one correct option`,
      );
      assert.equal(
        question.correctIndex,
        question.options.findIndex((option) => option.isCorrect),
        `${definition.qlId}/${seed}/${locale}: correct index is not aligned with options`,
      );

      const deadOptions = question.options.filter((option) =>
        option.semanticValue === "PREMISES_INCONSISTENT");
      deadInconsistentOptions += deadOptions.length;
      assert.equal(
        deadOptions.length,
        0,
        `${definition.qlId}/${seed}/${locale}: dead inconsistent-premises option remains`,
      );

      if (MODAL_TASKS.has(question.metadata.taskKind)) {
        modalRecords += 1;
        modalQlIds.add(definition.qlId);
        assert.equal(question.options.length, 3);
        assert.equal(question.metadata.optionCount, 3);
        assert.equal(question.metadata.answerTemplateId, "DIAGNOSTIC_THREE_OPTION_V1");
        assert.deepEqual(
          new Set(question.options.map((option) => option.semanticValue)),
          LIVE_MODAL_STATUSES,
          `${definition.qlId}/${seed}/${locale}: modal status space is incomplete or duplicated`,
        );
        assert.equal(question.structuredProofV3.visibleOptionAnalysis.length, 3);
        assert.equal(question.learnerPresentationV5.optionAnalysis.length, 3);
        assert.equal(
          question.learnerPresentationV5.remediationEvidence.deadOptionRemediationStatus,
          "REMOVED_THREE_STATUS_DIAGNOSTIC",
        );
      } else {
        if (question.options.length !== definition.optionCount) nonModalOptionCountMismatches += 1;
        assert.equal(
          question.options.length,
          definition.optionCount,
          `${definition.qlId}/${seed}/${locale}: non-modal option count changed unexpectedly`,
        );
      }
    }
  }
}

assert.equal(records, 18 * 80 * 3);
assert.equal(modalRecords, 4 * 80 * 3);
assert.deepEqual(
  [...modalQlIds].sort(),
  ["SYL-QL-007", "SYL-QL-012", "SYL-QL-014", "SYL-QL-018"],
);
assert.equal(deadInconsistentOptions, 0);
assert.equal(nonModalOptionCountMismatches, 0);

console.log(JSON.stringify({
  status: "PASS_SYL_001_V5_DEAD_OPTION_REMEDIATION",
  records,
  modalRecords,
  modalQlIds: [...modalQlIds].sort(),
  liveModalStatuses: [...LIVE_MODAL_STATUSES],
  deadInconsistentOptions,
  nonModalOptionCountMismatches,
  deliveryContract: {
    optionCount: 3,
    answerTemplateId: "DIAGNOSTIC_THREE_OPTION_V1",
  },
}, null, 2));
