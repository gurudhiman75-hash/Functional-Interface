import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { allBlrCp002CanonicalScenarios } from "./cp002-canonical-scenario-registry";
import { generateBlrCp002ScenarioReviewQuestion } from "./cp002-review-registry";

const outputDirectory = path.resolve(process.argv[2] ?? "blr-cp002-review-output");
const scenarios = allBlrCp002CanonicalScenarios();
const questions = scenarios.flatMap((scenario) =>
  Array.from({ length: 4 }, (_, seed) =>
    generateBlrCp002ScenarioReviewQuestion(scenario.scenarioId, seed),
  ),
);

const escapeCsv = (value: unknown): string => {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
};

const escapeHtml = (value: unknown): string =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const csvHeader = [
  "scenarioId",
  "prototypeId",
  "seed",
  "presentation",
  "difficulty",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "answerId",
  "onlyConstraintCount",
  "assertionRoleDepth",
  "queryRoleDepth",
  "pathLength",
  "selfIdentity",
].join(",");

const csvRows = questions.map((question) =>
  [
    question.metadata.scenarioId,
    question.prototypeId,
    question.seed,
    question.metadata.presentation,
    question.difficulty,
    question.stem,
    question.options[0]?.value,
    question.options[1]?.value,
    question.options[2]?.value,
    question.options[3]?.value,
    question.correctIndex,
    question.metadata.answerId,
    question.metadata.onlyConstraintCount,
    question.metadata.assertionRoleDepth,
    question.metadata.queryRoleDepth,
    question.metadata.pathLength,
    question.metadata.selfIdentity,
  ].map(escapeCsv).join(","),
);

const cards = questions.map((question, index) => {
  const options = question.options.map(
    (option, optionIndex) =>
      `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.value)}${option.errorLabel ? ` <code>${escapeHtml(option.errorLabel)}</code>` : ""}</li>`,
  ).join("");
  return `<article>
    <header><span>#${index + 1}</span><code>${escapeHtml(question.metadata.scenarioId)}</code><code>${escapeHtml(question.prototypeId)}</code></header>
    <p class="meta">Seed ${question.seed} · ${escapeHtml(question.metadata.presentation)} · ${escapeHtml(question.difficulty)} · Answer ${question.correctIndex + 1}</p>
    <h2>${escapeHtml(question.stem)}</h2>
    <ol>${options}</ol>
    <h3>Core concept</h3><ul>${(question.explanation.coreConcept ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>Role resolution</h3><ul>${question.explanation.normalizedClues.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>Family tree</h3><pre>${escapeHtml(question.explanation.familyTreeGrid ?? "")}</pre>
    <h3>Generation analysis</h3><ul>${(question.explanation.generationAnalysis ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <h3>Query path</h3><ul>${question.explanation.queryPath.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
    <p><strong>${escapeHtml(question.explanation.conclusion)}</strong></p>
    <h3>10-second shortcut</h3><p>${escapeHtml(question.explanation.examShortcut ?? "")}</p>
  </article>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-002 canonical scenario appendix</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#f5f5f5;color:#18181b}main{max-width:1100px;margin:auto;padding:24px}article{background:white;border:1px solid #ddd;border-radius:12px;padding:22px;margin:18px 0}header{display:flex;gap:10px;flex-wrap:wrap}.meta{color:#52525b}h2{font-size:1.08rem;line-height:1.55}h3{font-size:.95rem;margin-top:22px}li{margin:7px 0}.correct{font-weight:700}code{background:#f4f4f5;padding:2px 6px;border-radius:4px;font-size:.78rem}pre{white-space:pre-wrap;background:#fafafa;border:1px solid #e4e4e7;padding:12px;border-radius:8px;line-height:1.45}
</style></head><body><main><h1>BLR-CP-002 canonical scenario appendix</h1><p>Every one of the 26 positive source scenarios is rendered at all four answer positions. These remain non-permanent English discovery records.</p>${cards}</main></body></html>`;

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-002",
  status: "CANONICAL_SCENARIO_APPENDIX_V1",
  permanentQlCount: 0,
  provisionalAuthorityCount: 1,
  scenarioCount: scenarios.length,
  recordCount: questions.length,
  scenarioIds: scenarios.map((scenario) => scenario.scenarioId),
  answerIds: [...new Set(questions.map((question) => question.metadata.answerId))].sort(),
  presentations: [...new Set(questions.map((question) => question.metadata.presentation))].sort(),
  answerPositions: [0, 1, 2, 3].map(
    (index) => questions.filter((question) => question.correctIndex === index).length,
  ),
  release: {
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  },
};

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp002-canonical-appendix.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp002-canonical-appendix.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp002-canonical-appendix.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp002-canonical-appendix-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
