import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { getGeneratedQuestionBankEligibilityIssue } from "../../../../../lib/admin-question-conversion.ts";
import {
  DSF_CP017_QUESTION_STUDIO_AUTHORITY,
  generateDsfCp017QuestionStudioBatch,
} from "./question-studio-normal-workflow-v1.ts";

const routeSource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-data-sufficiency-expanded.ts"),
  "utf8",
);
const registrySource = readFileSync(
  resolve(process.cwd(), "artifacts/api-server/src/routes/admin-question-studio-registry.ts"),
  "utf8",
);
const operationsPageSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"),
  "utf8",
);
const panelSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioDataSufficiencyExpandedReviewPanel.tsx"),
  "utf8",
);
const apiClientSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/features/question-studio/data-sufficiency-expanded-review-api.ts"),
  "utf8",
);

for (const marker of [
  '"/reasoning/data-sufficiency/expanded/package"',
  '"/reasoning/data-sufficiency/expanded/preview"',
  '"/reasoning/data-sufficiency/expanded/runs"',
  '"/reasoning/data-sufficiency/expanded/status"',
  "content.generation_runs",
  "content.generation_run_items",
  "content.generation_item_versions",
  "question_studio.data_sufficiency_expansion_run.created",
  "DSF_CP017_QUESTION_STUDIO_AUTHORITY",
  'questionBankStatus: "NOT_STORED"',
  "questionBankWritable: false",
  "testEligible: false",
  "mockTestEligible: false",
  "publiclyPublishable: false",
  "automaticStudentPublication: false",
]) {
  assert.ok(routeSource.includes(marker), `CP017 route missing marker: ${marker}`);
}

const expandedImport = 'import adminQuestionStudioDataSufficiencyExpandedRouter from "./admin-question-studio-data-sufficiency-expanded";';
const oldImport = 'import adminQuestionStudioDataSufficiencyRouter from "./admin-question-studio-data-sufficiency";';
const expandedMount = "router.use(adminQuestionStudioDataSufficiencyExpandedRouter);";
const oldMount = "router.use(adminQuestionStudioDataSufficiencyRouter);";
assert.ok(registrySource.includes(expandedImport), "CP017 expanded router import is missing from canonical Question Studio registry.");
assert.ok(registrySource.includes(oldImport), "Historical Data Sufficiency router import disappeared.");
assert.ok(registrySource.includes(expandedMount), "CP017 expanded router mount is missing.");
assert.ok(registrySource.includes(oldMount), "Historical Data Sufficiency router mount disappeared.");
assert.ok(
  registrySource.indexOf(expandedMount) < registrySource.indexOf(oldMount),
  "CP017 expanded router must be mounted before the historical CP010 Data Sufficiency router.",
);

assert.ok(
  operationsPageSource.includes("QuestionStudioDataSufficiencyExpandedReviewPanel"),
  "Question Studio Operations page does not surface the CP017 Data Sufficiency panel.",
);
assert.ok(
  operationsPageSource.includes("<QuestionStudioDataSufficiencyExpandedReviewPanel />"),
  "Question Studio Operations page does not render the CP017 Data Sufficiency panel.",
);
for (const marker of [
  "Data Sufficiency · CP017 expanded normal workflow",
  "Create review run",
  "Preview expansion",
  "Question Bank writable = No",
]) {
  assert.ok(panelSource.includes(marker), `CP017 admin panel missing marker: ${marker}`);
}
for (const endpoint of [
  "/admin/question-studio/reasoning/data-sufficiency/expanded/package",
  "/admin/question-studio/reasoning/data-sufficiency/expanded/preview",
  "/admin/question-studio/reasoning/data-sufficiency/expanded/runs",
  "/admin/question-studio/reasoning/data-sufficiency/expanded/status",
]) {
  assert.ok(apiClientSource.includes(endpoint), `CP017 admin API client missing endpoint: ${endpoint}`);
}

const generated = generateDsfCp017QuestionStudioBatch({ laneId: "SEATING", count: 1, seed: "cp017-route-contract" });
const question = generated.questions[0]!;
assert.equal(question.integrationAuthority, DSF_CP017_QUESTION_STUDIO_AUTHORITY);
assert.equal(question.lifecycle.questionStudioDiscoverable, true);
assert.equal(question.lifecycle.persistenceAllowed, true);
assert.equal(question.lifecycle.reviewOnly, true);
assert.equal(question.lifecycle.questionBankWritable, false);
assert.equal(question.lifecycle.testEligible, false);
assert.equal(question.lifecycle.mockTestEligible, false);
assert.equal(question.lifecycle.publiclyPublishable, false);
assert.equal(question.lifecycle.automaticStudentPublication, false);
assert.equal(
  getGeneratedQuestionBankEligibilityIssue(question),
  "questionBankStatus is NOT_STORED",
  "The shared Question Bank conversion guard must reject CP017 review-only items.",
);

console.log(JSON.stringify({
  status: "PASS_DSF_CP017_NORMAL_QUESTION_STUDIO_ROUTE_CONTRACT",
  canonicalRegistryMounted: true,
  expandedRouterBeforeHistoricalDsfRouter: true,
  operationsPageVisible: true,
  sharedReviewTablesUsed: true,
  sharedQuestionBankConversionGuard: "BLOCKED_NOT_STORED",
  questionStudioDiscoverable: true,
  persistenceAllowed: true,
  reviewOnly: true,
  questionBankWritable: false,
  testEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
}, null, 2));
