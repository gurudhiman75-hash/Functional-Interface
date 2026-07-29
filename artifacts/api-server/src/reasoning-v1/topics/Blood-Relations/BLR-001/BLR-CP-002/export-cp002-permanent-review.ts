import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { generateBlrCp002Question } from "./cp002-runtime";

const outputDirectory = path.resolve(process.argv[2] ?? "blr-cp002-frozen-output");
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;
const questions = Array.from({ length: 180 }, (_, seed) =>
  generateBlrCp002Question("BLR-QL-008", seed),
);

const escapeCsv = (value: unknown): string => {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
};

const escapeHtml = (value: unknown): string =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const csvHeader = [
  "qlId",
  "solveAuthority",
  "sourcePrototypeId",
  "sourceScenarioId",
  "seed",
  "presentation",
  "questionForm",
  "difficulty",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "answerId",
  "onlyConstraintCount",
  "negativeConstraintCount",
  "assertionRoleDepth",
  "queryRoleDepth",
  "pathLength",
  "selfIdentity",
].join(",");

const csvRows = questions.map((question) =>
  [
    question.qlId,
    question.metadata.solveAuthority,
    question.metadata.sourcePrototypeId,
    question.metadata.sourceScenarioId,
    question.seed,
    question.metadata.presentation,
    question.metadata.questionForm,
    question.difficulty,
    question.stem,
    question.options[0]?.value,
    question.options[1]?.value,
    question.options[2]?.value,
    question.options[3]?.value,
    question.correctIndex,
    question.metadata.answerId,
    question.metadata.onlyConstraintCount,
    question.metadata.negativeConstraintCount,
    question.metadata.assertionRoleDepth,
    question.metadata.queryRoleDepth,
    question.metadata.pathLength,
    question.metadata.selfIdentity,
  ].map(escapeCsv).join(","),
);

const cards = questions.map((question, index) => {
  const options = question.options.map(
    (option, optionIndex) =>
      `<li class="${option.isCorrect ? "correct" : ""}"><strong>${OPTION_LETTERS[optionIndex]}.</strong> ${escapeHtml(option.value)}${option.isCorrect ? " <strong>✓ Correct</strong>" : ` <code>${escapeHtml(option.errorLabel ?? "")}</code>`}</li>`,
  ).join("");
  return `<article>
    <header><span>#${index + 1}</span><code>${question.qlId}</code><code>${escapeHtml(question.metadata.sourceScenarioId)}</code></header>
    <p class="meta">Seed ${question.seed} · ${escapeHtml(question.metadata.sourcePrototypeId)} · ${escapeHtml(question.metadata.presentation)} · ${escapeHtml(question.metadata.questionForm)} · ${escapeHtml(question.difficulty)}</p>
    <h2>${escapeHtml(question.stem)}</h2>
    <ol>${options}</ol>
    <h3>Core concept</h3><ul>${(question.explanation.coreConcept ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>Role resolution</h3><ul>${question.explanation.normalizedClues.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>Family tree</h3><pre>${escapeHtml(question.explanation.familyTreeGrid ?? "")}</pre>
    <h3>Generation analysis</h3><ul>${(question.explanation.generationAnalysis ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>Query path</h3><ul>${question.explanation.queryPath.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <p><strong>${escapeHtml(question.explanation.conclusion)}</strong></p>
    <h3>10-second shortcut</h3><p>${escapeHtml(question.explanation.examShortcut ?? "")}</p>
    <h3>Distractor analysis</h3><pre>${escapeHtml(JSON.stringify(question.explanation.distractorAnalysis ?? [], null, 2))}</pre>
  </article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-002 permanent English review</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#f5f5f5;color:#18181b}main{max-width:1100px;margin:auto;padding:24px}article,.intro{background:white;border:1px solid #ddd;border-radius:12px;padding:22px;margin:18px 0}header{display:flex;gap:10px;flex-wrap:wrap}.meta{color:#52525b}h2{font-size:1.08rem;line-height:1.55}h3{font-size:.95rem;margin-top:22px}li{margin:7px 0}.correct{font-weight:700}code{background:#f4f4f5;padding:2px 6px;border-radius:4px;font-size:.78rem}pre{white-space:pre-wrap;background:#fafafa;border:1px solid #e4e4e7;padding:12px;border-radius:8px;line-height:1.45}
</style></head><body><main><section class="intro"><h1>BLR-CP-002 Permanent English Review Pack</h1><p>One hundred eighty deterministic review-only records for BLR-QL-008. Every one of the forty-five canonical scenarios appears at all four answer positions. Permanent identity does not enable Question Studio, Question Bank, mock tests, localisation or public publication.</p></section>${cards}</main></body></html>`;

const answerPositions = [0, 1, 2, 3].map(
  (index) => questions.filter((question) => question.correctIndex === index).length,
);
const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-002",
  status: "PERMANENT_ENGLISH_REVIEW_ONLY",
  freezeVersion: "BLR_CP002_ENGLISH_DISCOVERY_FREEZE_V1",
  qlRange: "BLR-QL-008",
  qlCount: 1,
  solveAuthority: "RESOLVE_ANCHORED_ROLE_CHAIN_RELATION",
  prototypeCount: new Set(questions.map((question) => question.metadata.sourcePrototypeId)).size,
  scenarioCount: new Set(questions.map((question) => question.metadata.sourceScenarioId)).size,
  recordCount: questions.length,
  answerPositions,
  questionForms: [...new Set(questions.map((question) => question.metadata.questionForm))].sort(),
  presentations: [...new Set(questions.map((question) => question.metadata.presentation))].sort(),
  nextAvailableQlId: "BLR-QL-009",
  questionStudioVisible: false,
  questionBankEligible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
};

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp002-permanent-review.jsonl"),
    `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp002-permanent-review.csv"),
    `${csvHeader}\n${csvRows.join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp002-permanent-review.html"),
    html,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp002-permanent-review-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  ),
]);

console.log(JSON.stringify(summary, null, 2));
