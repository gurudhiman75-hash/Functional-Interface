import assert from "node:assert/strict";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V2 } from "../foundation/spatial/spatial-question-studio-integration-v2";
import { SPATIAL_QUESTION_STUDIO_PACKAGE_V3 } from "../foundation/spatial/spatial-question-studio-integration-v3";
import { generateSpatialProductionStudioBatchV3 } from "../foundation/spatial/spatial-question-studio-production-v3";

const routeSource = readFileSync("src/routes/admin-question-studio-spatial.ts", "utf8");

assert.ok(
  routeSource.includes('from "../reasoning-v1/foundation/spatial/spatial-question-studio-integration-v3"'),
  "Spatial admin route is not wired to integration V3.",
);
assert.ok(
  routeSource.includes('from "../reasoning-v1/foundation/spatial/spatial-question-studio-production-v3"'),
  "Spatial admin route is not wired to production V3.",
);
assert.ok(
  routeSource.includes("PRE_EMB_SPATIAL_QUESTION_STUDIO_PACKAGE_V2"),
  "Spatial admin route does not preserve pre-EMB integration history.",
);
assert.ok(
  routeSource.includes("embeddedFigureLocalizationAuthority"),
  "Spatial status response does not expose the EMB localization authority.",
);
assert.ok(
  routeSource.includes("PRE_EMB_SPATIAL_QUESTION_STUDIO_PACKAGE_V2.supersedesIntegrationAuthority"),
  "Spatial status query does not preserve the pre-PFC integration authority.",
);

assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V2.permanentQlCount, 40);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount, 41);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.qlIds.at(-1), "SPA-QL-041");
assert.ok(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.chapters.includes("EMB-001"));
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.questionStudioDiscoverable, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.manualApprovalRequired, true);
assert.equal(SPATIAL_QUESTION_STUDIO_PACKAGE_V3.automaticStudentPublication, false);

const preview = generateSpatialProductionStudioBatchV3({
  seed: "EMB-ROUTE-ACTIVATION-PREVIEW",
  qlId: "SPA-QL-041",
  count: 3,
  language: "hi",
});
assert.equal(preview.questions.length, 3);
assert.ok(preview.questions.every((question) => question.qlId === "SPA-QL-041"));
assert.ok(preview.questions.every((question) => question.chapterCode === "EMB-001"));
assert.ok(preview.questions.every((question) => question.language === "hi"));
assert.ok(preview.questions.every((question) => question.lifecycle.questionStudioDiscoverable));
assert.ok(preview.questions.every((question) => question.lifecycle.persistenceAllowed));
assert.ok(preview.questions.every((question) => question.lifecycle.manualApprovalRequired));
assert.ok(preview.questions.every((question) => !question.lifecycle.automaticStudentPublication));
assert.equal(new Set(preview.questions.map((question) => question.contentFingerprint)).size, 3);

const evidence = {
  status: "PASS_EMB_001_ADMIN_QUESTION_STUDIO_ROUTE_ACTIVATION_V1",
  currentIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.integrationAuthority,
  previousIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.integrationAuthority,
  prePfcIntegrationAuthority: SPATIAL_QUESTION_STUDIO_PACKAGE_V2.supersedesIntegrationAuthority,
  permanentQlCount: SPATIAL_QUESTION_STUDIO_PACKAGE_V3.permanentQlCount,
  embeddedFigureQlId: "SPA-QL-041",
  embeddedFigureChapterCode: "EMB-001",
  previewQuestionCount: preview.questions.length,
  routeImportsV3Integration: true,
  routeImportsV3Production: true,
  historicStatusCoveragePreserved: true,
  embeddedFigureLocalizationAuthorityExposed: true,
  lifecycle: {
    questionStudioDiscoverable: true,
    persistenceAllowed: true,
    manualApprovalRequired: true,
    automaticStudentPublication: false,
  },
  deploymentPerformed: false,
  nextGate: "EMB_001_BRANCH_INTEGRATION_DECISION",
};

mkdirSync("dist/reasoning-v1/spatial", { recursive: true });
writeFileSync(
  "dist/reasoning-v1/spatial/spa-emb-001-admin-question-studio-route-activation-v1-evidence.json",
  `${JSON.stringify(evidence, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(evidence, null, 2));
