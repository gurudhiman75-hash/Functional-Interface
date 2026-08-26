import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { PFC_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/paper-folding-english-freeze-v1";
import { generatePfcPermanentEnglishCorpusV1 } from "../foundation/spatial/paper-folding-permanent-english-runtime-v1";

const corpus = generatePfcPermanentEnglishCorpusV1();
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.status, "ENGLISH_RUNTIME_FROZEN_AFTER_OPERATOR_LEARNER_REVIEW");
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.workflowRunId, 32101470824);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.artifactId, 9311741709);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.reviewQuestionCount, 48);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.exactReviewedAuthority.reviewVerdict, "APPROVED_NO_REMAINING_ENGLISH_LEARNER_BLOCKER");
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.frozenCorpus.totalQuestions, 320);
assert.equal(corpus.length, 320);
assert.equal(new Set(corpus.map((question) => question.semanticFingerprint)).size, 320);
assert.equal(new Set(corpus.map((question) => question.deliveryFingerprint)).size, 320);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract.geometryInvariant, true);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract.optionOrderInvariant, true);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract.answerInvariant, true);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.localizationContract.idInvariant, true);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.englishFrozen, true);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.hindiPunjabiGenerationAllowed, true);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.questionStudioRegistrationAuthorized, false);
assert.equal(PFC_001_ENGLISH_FREEZE_AUTHORITY_V1.governance.automaticPublicationAuthorized, false);

const evidence = {
  authority: PFC_001_ENGLISH_FREEZE_AUTHORITY_V1,
  status: "PASS_PFC_001_ENGLISH_FREEZE_V1",
};
mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-pfc-001-english-freeze-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence));
