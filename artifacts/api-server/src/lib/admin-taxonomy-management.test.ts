import assert from "node:assert/strict";
import test from "node:test";

import {
  TaxonomyManagementError,
  coveragePercent,
  normalizeTaxonomyCode,
  normalizeTaxonomyNodeInput,
} from "./admin-taxonomy-management";

test("normalizes taxonomy codes and complete node input", () => {
  const input = normalizeTaxonomyNodeInput({
    code: "quant percentage basics",
    nodeType: "chapter",
    name: "Percentage Basics",
    description: "Foundational percentage questions.",
    parentIds: ["parent-a", "parent-a", "parent-b"],
    examMappings: [
      {
        examVersionId: "exam-v1",
        targetCoverage: 50,
        sortOrder: 2,
      },
    ],
    reason: "Create the first canonical chapter mapping.",
  });

  assert.equal(normalizeTaxonomyCode("quant percentage basics"), "QUANT_PERCENTAGE_BASICS");
  assert.equal(input.code, "QUANT_PERCENTAGE_BASICS");
  assert.equal(input.nodeType, "chapter");
  assert.deepEqual(input.parentIds, ["parent-a", "parent-b"]);
  assert.equal(input.examMappings[0]?.targetCoverage, 50);
  assert.equal(input.examMappings[0]?.isActive, true);
});

test("rejects unsupported node types", () => {
  assert.throws(
    () => normalizeTaxonomyNodeInput({
      code: "QUANT_PERCENTAGE",
      nodeType: "folder",
      name: "Percentage",
      reason: "Invalid type check.",
    }),
    (error: unknown) => error instanceof TaxonomyManagementError
      && error.code === "INVALID_TAXONOMY_NODE_TYPE",
  );
});

test("rejects duplicate exam mappings", () => {
  assert.throws(
    () => normalizeTaxonomyNodeInput({
      code: "QUANT_PERCENTAGE",
      nodeType: "topic",
      name: "Percentage",
      reason: "Duplicate mapping check.",
      examMappings: [
        { examVersionId: "exam-v1" },
        { examVersionId: "exam-v1" },
      ],
    }),
    (error: unknown) => error instanceof TaxonomyManagementError
      && error.code === "DUPLICATE_EXAM_MAPPING",
  );
});

test("calculates bounded coverage percentages", () => {
  assert.equal(coveragePercent(20, 50), 40);
  assert.equal(coveragePercent(50, 50), 100);
  assert.equal(coveragePercent(600, 50), 999);
  assert.equal(coveragePercent(5, null), null);
  assert.equal(coveragePercent(5, 0), null);
});
