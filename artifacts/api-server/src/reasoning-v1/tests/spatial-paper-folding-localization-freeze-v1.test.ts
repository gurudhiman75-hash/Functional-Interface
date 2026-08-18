import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/paper-folding-localization-freeze-v1";
import { generatePfcLocalizedCorpusV1 } from "../foundation/spatial/paper-folding-localization-v1";

const hi = generatePfcLocalizedCorpusV1("hi");
const pa = generatePfcLocalizedCorpusV1("pa");
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.status, "HINDI_PUNJABI_RUNTIME_FROZEN_AFTER_OPERATOR_LEARNER_REVIEW");
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.workflowRunId, 32101893567);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactId, 9311847071);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.reviewQuestionCount, 48);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.exactReviewedAuthority.reviewVerdict, "APPROVED_SIMPLE_HI_PA_NO_REMAINING_LEARNER_BLOCKER");
assert.equal(hi.length, 320);
assert.equal(pa.length, 320);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.frozenCorpus.parityComparisons, 640);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.invariants.geometry, true);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.invariants.optionOrder, true);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.invariants.answer, true);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.invariants.ids, true);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.invariants.fingerprints, true);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.localizationFrozen, true);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);

const evidence = {
  authority: PFC_001_HI_PA_LOCALIZATION_FREEZE_AUTHORITY_V1,
  status: "PASS_PFC_001_HI_PA_LOCALIZATION_FREEZE_V1",
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-hi-pa-localization-freeze-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
