import test from "node:test";
import assert from "node:assert/strict";
import {examForQuestionStudioComputeAudit} from "../scripts/qs-universal-coverage-exam-profile.mjs";

test("IOP Banking-only package is never audited as SSC", () => {
  assert.equal(examForQuestionStudioComputeAudit("IOP-001"), "IBPS PO Mains");
});
test("other source-governed DI/Banks packages remain Banking", () => {
  assert.equal(examForQuestionStudioComputeAudit("DI-014"), "IBPS PO Mains");
  for (const pkg of ["DI-007", "DI-008", "SAP", "WFM-001"]) {
    assert.equal(examForQuestionStudioComputeAudit(pkg), "IBPS PO Prelims");
  }
});
test("unrestricted package uses SSC representative exam", () => {
  assert.equal(examForQuestionStudioComputeAudit("RNK-001"), "SSC CGL Tier 1");
  assert.equal(examForQuestionStudioComputeAudit("PCT-001"), "SSC CGL Tier 1");
});
