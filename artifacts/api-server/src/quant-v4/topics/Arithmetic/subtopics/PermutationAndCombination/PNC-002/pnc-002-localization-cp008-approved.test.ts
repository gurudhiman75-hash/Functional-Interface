import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import {
  buildPnc002Cp008ApprovedLocalizedPresentation,
  PNC_002_CP008_LOCALIZATION_APPROVED,
} from "./foundation/localization-cp008-approved";
import { buildPnc002Cp008LocalizedPresentation as buildReviewedPresentation } from "./foundation/localization-cp008-reviewed";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-008");
const expectedIds = Array.from({ length: 23 }, (_, index) => `PNC-QL-${String(index + 125).padStart(3, "0")}`);
const locales: PncStudentLocale[] = ["hi-IN", "pa-IN"];
const seeds = ["approval-a", "approval-b", "approval-c"];

assert.equal(PNC_002_CP008_LOCALIZATION_APPROVED.releaseId, "PNC-002-CP008-HI-PA-v1-APPROVED");
assert.equal(PNC_002_CP008_LOCALIZATION_APPROVED.status, "APPROVED");
assert.equal(PNC_002_CP008_LOCALIZATION_APPROVED.editorialStatus, "APPROVED");
assert.equal(PNC_002_CP008_LOCALIZATION_APPROVED.publiclyPublishable, false);
assert.equal(PNC_002_CP008_LOCALIZATION_APPROVED.qlCount, 23);
assert.deepEqual(entries.map((entry) => entry.qlId), expectedIds);

let auditedPackages = 0;
for (const entry of entries) {
  for (const locale of locales) {
    for (const seedName of seeds) {
      const source = runPnc002Pipeline({
        questionLanguageId: entry.qlId,
        seed: `pnc-cp008-approval:${locale}:${seedName}:${entry.qlId}`,
      });
      assert.equal(source.validation.valid, true);
      assert.equal(source.publiclyPublishable, false);

      const reviewed = buildReviewedPresentation(source, locale);
      const approved = buildPnc002Cp008ApprovedLocalizedPresentation(source, locale);

      assert.deepEqual(approved, {
        ...reviewed,
        editorialStatus: "APPROVED",
        publiclyPublishable: false,
      });
      assert.equal(approved.editorialStatus, "APPROVED");
      assert.equal(approved.publiclyPublishable, false);
      assert.equal(approved.displayOptions[approved.correctIndex], approved.answerLabel);
      auditedPackages += 1;
    }
  }
}

assert.equal(auditedPackages, 23 * 2 * 3);
console.log(JSON.stringify({
  releaseId: PNC_002_CP008_LOCALIZATION_APPROVED.releaseId,
  canonicalProblemId: "PNC-CP-008",
  qlRange: ["PNC-QL-125", "PNC-QL-147"],
  locales,
  auditedPackages,
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  status: "PASS",
}, null, 2));
