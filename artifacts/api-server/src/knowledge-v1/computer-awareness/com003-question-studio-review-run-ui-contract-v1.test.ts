import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const apiSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/features/question-studio/com003-review-api.ts"),
  "utf8",
);
const panelSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioCom003ReviewPanel.tsx"),
  "utf8",
);
const operationsSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"),
  "utf8",
);

assert(apiSource.includes("'/admin/question-studio/runs'"));
assert(apiSource.includes("method: 'POST'"));
assert(apiSource.includes("engineId: 'knowledge-v1'"));
assert(apiSource.includes("packageId: 'COM-003'"));
assert(apiSource.includes("runtimeMode: 'review-only'"));
assert(!apiSource.includes("difficulty:"), "COM-003 review client must not submit an unaudited difficulty.");

for (const marker of [
  "Computer Awareness · COM-003 review runs",
  "standard REVIEW_ONLY lifecycle",
  "Review-run persistence",
  "No difficulty classifier",
  "Question Bank locked",
  "Generate review batch",
  "content.generation.run",
  "No Question Bank write occurred",
]) {
  assert(panelSource.includes(marker), `COM-003 review-run panel missing marker: ${marker}`);
}

for (const forbidden of [
  "updateGenerationItems",
  "regenerateGenerationItems",
  "reviseGenerationItem",
  "Approve to Question Bank",
  "questionBankWritable: true",
  "testEligible: true",
  "publiclyPublishable: true",
  "productionReleaseAuthorized: true",
  "<Field label=\"Difficulty\">",
]) {
  assert(!panelSource.includes(forbidden), `COM-003 review-run panel contains forbidden marker: ${forbidden}`);
  assert(!apiSource.includes(forbidden), `COM-003 review-run API contains forbidden marker: ${forbidden}`);
}

assert(panelSource.includes("hasPermission('content.generation.read')"));
assert(panelSource.includes("hasPermission('content.generation.run')"));
assert(panelSource.includes("qlId === MIXED_QL ? 50 : 12"));
assert(panelSource.includes("dashboard.runs.filter(isCom003Run)"));
assert(operationsSource.includes("import { QuestionStudioCom003ReviewPanel } from './QuestionStudioCom003ReviewPanel';"));
assert(operationsSource.includes("<QuestionStudioCom003ReviewPanel />"));

const previewIndex = operationsSource.indexOf("<QuestionStudioCom003PreviewPanel />");
const reviewIndex = operationsSource.indexOf("<QuestionStudioCom003ReviewPanel />");
assert(previewIndex >= 0 && reviewIndex > previewIndex, "COM-003 persisted review-run panel must follow the frozen read-only preview surface.");

console.log("[COM003-QUESTION-STUDIO-REVIEW-RUN-UI-CONTRACT-V1]", {
  valid: true,
  allowedWrite: "POST /admin/question-studio/runs",
  lifecycle: "REVIEW_ONLY",
  difficultySelector: false,
  questionBankActions: false,
  testPublicationActions: false,
});
