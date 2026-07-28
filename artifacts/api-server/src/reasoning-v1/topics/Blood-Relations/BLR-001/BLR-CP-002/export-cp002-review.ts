import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { BLR_CP002_PROTOTYPE_CONTRACTS } from "./cp002-contracts";
import { generateBlrCp002PrototypeQuestion } from "./cp002-generator";

const outputDirectory = path.resolve(process.argv[2] ?? "blr-cp002-review-output");
const seedsPerPrototype = 12;
const questions = BLR_CP002_PROTOTYPE_CONTRACTS.flatMap((contract) =>
  Array.from({ length: seedsPerPrototype }, (_, seed) =>
    generateBlrCp002PrototypeQuestion(contract.prototypeId, seed),
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
  "prototypeId",
  "seed",
  "scenarioId",
  "presentation",
  "difficulty",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "correctAnswer",
  "answerId",
  "assertionRoleDepth",
  "queryRoleDepth",
  "onlyConstraintCount",
  "pathLength",
  "selfIdentity",
  "fingerprint",
].join(",");

const csvRows = questions.map((question) =>
  [
    question.prototypeId,
    question.seed,
    question.metadata.scenarioId,
    question.metadata.presentation,
    question.difficulty,
    question.stem,
    question.options[0]?.value,
    question.options[1]?.value,
    question.options[2]?.value,
    question.options[3]?.value,
    question.correctIndex,
    question.options[question.correctIndex]?.value,
    question.metadata.answerId,
    question.metadata.assertionRoleDepth,
    question.metadata.queryRoleDepth,
    question.metadata.onlyConstraintCount,
    question.metadata.pathLength,
    question.metadata.selfIdentity,
    question.metadata.hiddenFingerprint,
  ]
    .map(escapeCsv)
    .join(","),
);

const cards = questions
  .map((question, index) => {
    const options = question.options
      .map(
        (option, optionIndex) =>
          `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.value)}${option.errorLabel ? ` <code>${escapeHtml(option.errorLabel)}</code>` : ""}</li>`,
      )
      .join("");
    const distractors = (question.explanation.distractorAnalysis ?? [])
      .map(
        (entry) =>
          `<li><strong>${escapeHtml(entry.optionValue)}</strong> — ${escapeHtml(entry.studentWarning)} <code>${escapeHtml(entry.errorLabel)}</code></li>`,
      )
      .join("");
    return `<article>
      <header><span>#${index + 1}</span><code>${escapeHtml(question.prototypeId)}</code><code>${escapeHtml(question.metadata.scenarioId)}</code></header>
      <p class="meta">Seed ${question.seed} · ${escapeHtml(question.metadata.presentation)} · ${escapeHtml(question.difficulty)} · Answer ${question.correctIndex + 1}</p>
      <h2>${escapeHtml(question.stem)}</h2>
      <ol>${options}</ol>
      <section><h3>Core concept</h3><ul>${(question.explanation.coreConcept ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
      <section><h3>Normalized role resolution</h3><ul>${question.explanation.normalizedClues.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
      <section><h3>Family tree and generations</h3><pre>${escapeHtml(question.explanation.familyTreeGrid ?? "")}</pre><ul>${(question.explanation.generationAnalysis ?? []).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
      <section><h3>Query path</h3><ul>${question.explanation.queryPath.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul><p><strong>${escapeHtml(question.explanation.conclusion)}</strong></p></section>
      <section><h3>10-second shortcut</h3><p>${escapeHtml(question.explanation.examShortcut ?? "")}</p></section>
      <section><h3>Distractor analysis</h3><ul>${distractors}</ul></section>
    </article>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-002 English review</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#f5f5f5;color:#18181b}main{max-width:1100px;margin:auto;padding:24px}article{background:white;border:1px solid #ddd;border-radius:12px;padding:22px;margin:18px 0}header{display:flex;gap:10px;flex-wrap:wrap}.meta{color:#52525b}h2{font-size:1.08rem;line-height:1.55}h3{font-size:.95rem;margin-top:22px}li{margin:7px 0}.correct{font-weight:700}code{background:#f4f4f5;padding:2px 6px;border-radius:4px;font-size:.78rem}pre{white-space:pre-wrap;background:#fafafa;border:1px solid #e4e4e7;padding:12px;border-radius:8px;line-height:1.45}
</style></head><body><main><h1>BLR-CP-002 English open-discovery review</h1><p>60 deterministic records across five non-permanent role-chain prototypes. No QL allocation or publication permission is implied.</p>${cards}</main></body></html>`;

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-002",
  status: "OPEN_DISCOVERY",
  permanentQlCount: 0,
  prototypes: BLR_CP002_PROTOTYPE_CONTRACTS.map((contract) => contract.prototypeId),
  recordCount: questions.length,
  scenarioIds: [...new Set(questions.map((question) => question.metadata.scenarioId))].sort(),
  presentations: [...new Set(questions.map((question) => question.metadata.presentation))].sort(),
  answerIds: [...new Set(questions.map((question) => question.metadata.answerId))].sort(),
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
  path.join(outputDirectory, "blr-cp002-review.jsonl"),
  `${questions.map((question) => JSON.stringify(question)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp002-review.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(path.join(outputDirectory, "blr-cp002-review.html"), html, "utf8");
await writeFile(
  path.join(outputDirectory, "blr-cp002-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
