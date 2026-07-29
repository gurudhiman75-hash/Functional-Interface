import { strict as assert } from "node:assert";
import { getPnc002QuestionEntries } from "./foundation/library";
import {
  buildPnc002Cp009ApprovedLocalizedPresentation,
  PNC_002_CP009_LOCALIZATION_APPROVED,
} from "./foundation/localization-cp009-approved";
import { buildPnc002Cp009LocalizedPresentation as buildReviewedPresentation } from "./foundation/localization-cp009-reviewed";
import type { PncStudentLocale } from "./foundation/localization-types";
import { runPnc002Pipeline } from "./foundation/pipeline";

const entries = getPnc002QuestionEntries().filter((entry) => entry.cpId === "PNC-CP-009");
const expectedIds = Array.from({ length: 29 }, (_, index) => `PNC-QL-${String(index + 148).padStart(3, "0")}`);
const locales: PncStudentLocale[] = ["hi-IN", "pa-IN"];
const seeds = ["approval-a", "approval-b", "approval-c"];

assert.equal(PNC_002_CP009_LOCALIZATION_APPROVED.releaseId, "PNC-002-CP009-HI-PA-v1-APPROVED");
assert.equal(PNC_002_CP009_LOCALIZATION_APPROVED.status, "APPROVED");
assert.equal(PNC_002_CP009_LOCALIZATION_APPROVED.editorialStatus, "APPROVED");
assert.equal(PNC_002_CP009_LOCALIZATION_APPROVED.publiclyPublishable, false);
assert.equal(PNC_002_CP009_LOCALIZATION_APPROVED.qlCount, 29);
assert.equal(PNC_002_CP009_LOCALIZATION_APPROVED.approvedAt, "2026-07-29");
assert.deepEqual(entries.map((entry) => entry.qlId), expectedIds);

let auditedPackages = 0;
for (const entry of entries) {
  for (const locale of locales) {
    for (const seedName of seeds) {
      const source = runPnc002Pipeline({
        questionLanguageId: entry.qlId,
        seed: `pnc-cp009-approval:${locale}:${seedName}:${entry.qlId}`,
      });
      assert.equal(source.validation.valid, true);
      assert.equal(source.publiclyPublishable, false);

      const reviewed = buildReviewedPresentation(source, locale);
      const approved = buildPnc002Cp009ApprovedLocalizedPresentation(source, locale);

      assert.deepEqual(approved, {
        ...reviewed,
        editorialStatus: "APPROVED",
        publiclyPublishable: false,
      });
      assert.equal(approved.editorialStatus, "APPROVED");
      assert.equal(approved.publiclyPublishable, false);
      assert.equal(approved.displayOptions[approved.correctIndex], approved.answerLabel);

      const learnerText = [
        approved.stem,
        ...approved.explanationSections.flatMap((section) => [section.heading, ...section.lines]),
      ].join("\n");
      assert.equal(/मामल/u.test(learnerText), false);
      assert.equal(/ਮਾਮਲ/u.test(learnerText), false);
      assert.equal(locale === "hi-IN" ? approved.stem.startsWith("एक") : approved.stem.startsWith("ਇੱਕ"), true);
      auditedPackages += 1;
    }
  }
}

assert.equal(auditedPackages, 29 * 2 * 3);
console.log(JSON.stringify({
  releaseId: PNC_002_CP009_LOCALIZATION_APPROVED.releaseId,
  canonicalProblemId: "PNC-CP-009",
  qlRange: ["PNC-QL-148", "PNC-QL-176"],
  locales,
  auditedPackages,
  editorialStatus: "APPROVED",
  publiclyPublishable: false,
  approvedAt: PNC_002_CP009_LOCALIZATION_APPROVED.approvedAt,
  status: "PASS",
}, null, 2));
