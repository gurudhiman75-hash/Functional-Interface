import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const apiSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/features/question-studio/com003-preview-api.ts"),
  "utf8",
);
const panelSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioCom003PreviewPanel.tsx"),
  "utf8",
);
const operationsSource = readFileSync(
  resolve(process.cwd(), "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx"),
  "utf8",
);

for (const endpoint of [
  "/admin/question-studio/computer/com003/package",
  "/admin/question-studio/computer/com003/preview",
  "/admin/question-studio/computer/com003/status",
]) {
  assert(apiSource.includes(endpoint), `COM-003 admin preview API client is missing ${endpoint}.`);
}

for (const marker of [
  "previewCom003QuestionStudio",
  "getCom003QuestionStudioPackage",
  "getCom003QuestionStudioStatus",
  "Computer Awareness · COM-003 frozen preview",
  "19 frozen QLs",
  "684 language artifacts",
  "Not registered",
  "does not create a generation run",
  "Preview frozen questions",
  "Question Bank: {question.questionBankStatus}",
  "Test: {question.testEligibility}",
]) {
  assert(panelSource.includes(marker), `COM-003 admin preview panel is missing marker: ${marker}`);
}

for (const qlNumber of Array.from({ length: 19 }, (_, index) => String(index + 1).padStart(3, "0"))) {
  const qlId = `COM-003-QL-${qlNumber}`;
  assert(panelSource.includes(qlId), `COM-003 admin preview panel is missing ${qlId}.`);
}

for (const forbidden of [
  "createGenerationRun",
  "updateGenerationItems",
  "regenerateGenerationItems",
  "reviseGenerationItem",
  "content.generation.run",
  "content.generation.review",
  "Approve to Question Bank",
  "Generate review batch",
  "router.post",
  "method: 'POST'",
  "method: \"POST\"",
  "method: 'PATCH'",
  "method: \"PATCH\"",
  "method: 'PUT'",
  "method: \"PUT\"",
  "method: 'DELETE'",
  "method: \"DELETE\"",
]) {
  assert(!apiSource.includes(forbidden), `COM-003 admin preview API contains forbidden write marker: ${forbidden}`);
  assert(!panelSource.includes(forbidden), `COM-003 admin preview panel contains forbidden write marker: ${forbidden}`);
}

assert(panelSource.includes("hasPermission('content.generation.read')"), "COM-003 admin preview must require read permission in the UI.");
assert(panelSource.includes("Math.min(12, count)"), "COM-003 admin preview UI must cap an interactive preview at 12 items.");
assert(panelSource.includes("difficulty selector is intentionally unavailable"), "COM-003 UI must state why difficulty filtering is unavailable.");
assert(!panelSource.includes("<Field label=\"Difficulty\">"), "COM-003 admin preview must not expose an unaudited difficulty selector.");

assert(
  operationsSource.includes("import { QuestionStudioCom003PreviewPanel } from './QuestionStudioCom003PreviewPanel';"),
  "Question Studio operations page is missing the COM-003 preview import.",
);
assert(
  operationsSource.includes("<QuestionStudioCom003PreviewPanel />"),
  "Question Studio operations page is missing the COM-003 preview panel.",
);
const com001Index = operationsSource.indexOf("<QuestionStudioComputerAwarenessReviewPanel />");
const com003Index = operationsSource.indexOf("<QuestionStudioCom003PreviewPanel />");
assert(com001Index >= 0 && com003Index > com001Index, "COM-003 preview should appear directly after the existing Computer Awareness review panel.");

console.log("[COM003-QUESTION-STUDIO-ADMIN-PREVIEW-UI-CONTRACT-V1]", {
  valid: true,
  qlCount: 19,
  languages: ["en", "hi", "pa"],
  interactivePreviewCap: 12,
  readPermissionRequired: true,
  writeClients: 0,
  difficultySelector: false,
  generationRunCreation: false,
  questionBankActions: false,
  testPublicationActions: false,
});
