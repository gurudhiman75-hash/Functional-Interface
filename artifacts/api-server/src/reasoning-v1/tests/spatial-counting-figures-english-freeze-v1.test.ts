import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { FCT_001_ENGLISH_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/counting-figures-english-freeze-v1";
import {
  FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1,
  generateCountingFiguresPermanentEnglishQuestionV1,
} from "../foundation/spatial/counting-figures-permanent-english-runtime-v1";
import { FCT_001_PRODUCT_OWNER_APPROVAL_V1 } from "../foundation/spatial/counting-figures-product-owner-approval-v1";
import { SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6 } from "../foundation/spatial/spatial-permanent-ql-allocation-v6";
import type { CountingFigureTargetShapeV1 } from "../foundation/spatial/counting-figures-production-generator-v1";

const freeze = FCT_001_ENGLISH_FREEZE_AUTHORITY_V1;
assert.equal(freeze.status, "FCT_001_PERMANENT_ENGLISH_RUNTIME_V1_FROZEN");
assert.equal(freeze.permanentQlId, "SPA-QL-042");
assert.equal(freeze.allocationAuthorityId, SPATIAL_PERMANENT_QL_ALLOCATION_AUTHORITY_V6.authorityId);
assert.equal(freeze.runtimeAuthorityId, FCT_001_PERMANENT_ENGLISH_RUNTIME_AUTHORITY_V1.authorityId);
assert.equal(freeze.productOwnerApprovalAuthorityId, FCT_001_PRODUCT_OWNER_APPROVAL_V1.authorityId);
assert.equal(freeze.exactAllocationGate.workflowRunId, 33228077051);
assert.equal(freeze.exactAllocationGate.artifactId, 9707540455);
assert.equal(freeze.exactRuntimeGate.workflowRunId, 33228186361);
assert.equal(freeze.exactRuntimeGate.artifactId, 9707578524);
assert.equal(freeze.frozenRuntime.permanentQlRangeAfterAllocation, "SPA-QL-001..SPA-QL-042");
assert.equal(freeze.frozenRuntime.nextAvailablePermanentQlId, "SPA-QL-043");
assert.equal(freeze.localizationContract.graphInvariant, true);
assert.equal(freeze.localizationContract.optionValuesInvariant, true);
assert.equal(freeze.localizationContract.correctCountInvariant, true);
assert.equal(freeze.localizationContract.correctIndexInvariant, true);
assert.equal(freeze.localizationContract.geometryFingerprintInvariant, true);
assert.deepEqual(freeze.localizationContract.localizedFieldsOnly, ["permanentQlTitle", "stem", "explanation", "language", "locale"]);
assert.equal(freeze.governance.englishFrozen, true);
assert.equal(freeze.governance.hindiPunjabiGenerationAllowed, true);
assert.equal(freeze.governance.questionStudioRegistrationAuthorized, false);
assert.equal(freeze.governance.persistenceAllowed, false);
assert.equal(freeze.governance.questionBankWritesAuthorized, false);
assert.equal(freeze.governance.testEligibilityAuthorized, false);
assert.equal(freeze.governance.automaticPublicationAuthorized, false);
assert.equal(freeze.governance.mergeAuthorized, false);
assert.equal(freeze.governance.deploymentAuthorized, false);

const requiredFrozenFields = [
  "permanentQlId",
  "permanentQlTitle",
  "candidateId",
  "chapterCode",
  "targetShape",
  "motifFamily",
  "structuralVariant",
  "difficulty",
  "graph",
  "svg",
  "correctCount",
  "constructionExpectedCount",
  "options",
  "correctIndex",
  "optionEvidence",
  "geometryFingerprint",
  "structuralFingerprint",
  "contentFingerprint",
  "stemVariant",
  "stem",
  "explanation",
  "language",
  "locale",
] as const;
for (const field of requiredFrozenFields) assert.ok((freeze.frozenFields as readonly string[]).includes(field), `Missing frozen field ${field}`);

const TARGETS = ["TRIANGLE", "SQUARE", "RECTANGLE", "QUADRILATERAL"] as const satisfies readonly CountingFigureTargetShapeV1[];
const questions = Array.from({ length: 96 }, (_, index) => {
  const targetShape = TARGETS[index % TARGETS.length]!;
  const seed = `FCT-EN-FREEZE-V1-${index}`;
  const first = generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape });
  const second = generateCountingFiguresPermanentEnglishQuestionV1({ seed, targetShape });
  assert.deepEqual(second, first);
  assert.equal(first.permanentQlId, freeze.permanentQlId);
  assert.equal(first.permanentQlTitle, freeze.permanentQlTitle);
  assert.equal(first.language, freeze.frozenRuntime.language);
  assert.equal(first.locale, freeze.frozenRuntime.locale);
  assert.equal(first.runtimeAuthorityId, freeze.runtimeAuthorityId);
  return first;
});
assert.equal(new Set(questions.map((question) => question.geometryFingerprint)).size, questions.length);
assert.equal(new Set(questions.map((question) => question.contentFingerprint)).size, questions.length);
assert.equal(new Set(questions.map((question) => question.targetShape)).size, 4);
assert.equal(new Set(questions.map((question) => question.motifFamily)).size, 11);
assert.equal(new Set(questions.map((question) => question.stemVariant)).size, 8);

const evidence = {
  status: "PASS_FCT_001_ENGLISH_FREEZE_V1",
  freezeAuthority: freeze.authorityId,
  permanentQlId: freeze.permanentQlId,
  runtimeAuthority: freeze.runtimeAuthorityId,
  allocationAuthority: freeze.allocationAuthorityId,
  exactAllocationGate: freeze.exactAllocationGate,
  exactRuntimeGate: freeze.exactRuntimeGate,
  frozenFieldCount: freeze.frozenFields.length,
  deterministicFrozenReplayChecks: questions.length,
  geometryUniqueCount: new Set(questions.map((question) => question.geometryFingerprint)).size,
  motifFamilyCount: new Set(questions.map((question) => question.motifFamily)).size,
  targetShapeCount: new Set(questions.map((question) => question.targetShape)).size,
  localizationContract: freeze.localizationContract,
  governance: freeze.governance,
  nextGate: freeze.nextGate,
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-fct-001-english-freeze-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));
