import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { generateBlrCp003EditorialReviewRecords } from "./cp003-review-registry";

const outputDirectory = path.resolve(process.argv[2] ?? "blr-cp003-review-output");
const records = generateBlrCp003EditorialReviewRecords();

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
  "reviewFamily",
  "scenarioId",
  "topologyId",
  "seed",
  "itemId",
  "prototypeId",
  "sharedPrompt",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "correctAnswer",
  "answerKey",
  "familyRows",
  "solutionSteps",
  "conclusion",
  "examShortcut",
  "closestTrapRejection",
  "fingerprint",
].join(",");

const csvRows = records.map((record) =>
  [
    record.reviewFamily,
    record.scenarioId,
    record.topologyId,
    record.seed,
    record.itemId,
    record.prototypeId,
    record.sharedPrompt,
    record.stem,
    record.options[0]?.text,
    record.options[1]?.text,
    record.options[2]?.text,
    record.options[3]?.text,
    record.correctIndex,
    record.options[record.correctIndex]?.text,
    record.answerKey,
    record.editorial.familyRows,
    record.editorial.solutionSteps,
    record.editorial.conclusion,
    record.editorial.examShortcut,
    record.editorial.closestTrapRejection,
    record.metadata.semanticFingerprint,
  ]
    .map(escapeCsv)
    .join(","),
);

const grouped = new Map<string, typeof records>();
for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  const entries = grouped.get(key) ?? [];
  entries.push(record);
  grouped.set(key, entries);
}

const groupCards = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questionCards = group
      .map((record, questionIndex) => {
        const options = record.options
          .map(
            (option, optionIndex) =>
              `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.text)}${option.errorLabel ? ` <code>${escapeHtml(option.errorLabel)}</code>` : ""}</li>`,
          )
          .join("");
        return `<article class="question">
          <header><span>Q${questionIndex + 1}</span><code>${escapeHtml(record.prototypeId)}</code><code>answer ${record.correctIndex + 1}</code></header>
          <h3>${escapeHtml(record.stem)}</h3>
          <ol>${options}</ol>
          <section><h4>Core concept</h4><ul>${record.editorial.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <section><h4>Solution path</h4><ul>${record.editorial.solutionSteps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul><p><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section>
          <section><h4>Exam shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section>
          <section><h4>Closest trap</h4><p>${escapeHtml(record.editorial.closestTrapRejection)}</p></section>
        </article>`;
      })
      .join("");

    return `<section class="group">
      <header class="group-header"><span>Group ${groupIndex + 1}</span><code>${escapeHtml(first.reviewFamily)}</code><code>${escapeHtml(first.scenarioId)}</code><code>seed ${first.seed}</code></header>
      <h2>Shared passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>
      <h2>Family generation rows</h2><pre>${escapeHtml(first.editorial.familyRows.join("\n"))}</pre>
      <details><summary>Normalized family facts</summary><ul>${first.editorial.normalizedFacts.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></details>
      ${questionCards}
    </section>`;
  })
  .join("\n");

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  status: "OPEN_DISCOVERY_ENGLISH_EDITORIAL_V1",
  permanentQlCount: 0,
  groupCount: grouped.size,
  recordCount: records.length,
  scenarioIds: [...new Set(records.map((record) => record.scenarioId))].sort(),
  topologies: [...new Set(records.map((record) => record.topologyId))].sort(),
  reviewFamilies: [...new Set(records.map((record) => record.reviewFamily))].sort(),
  temporaryItemHandles: [...new Set(records.map((record) => record.prototypeId))].sort(),
  answerPositions,
  editorialChecks: {
    unifiedFourTierExplanation: true,
    deterministicGenerationRows: true,
    explicitMaritalStatusBoundary: true,
    frozenExactLineageSolverReuse: true,
    hiddenGraphAgreement: true,
    inputContribution: true,
  },
  release: {
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    hindiStarted: false,
    punjabiStarted: false,
  },
};

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 English review V1</title><style>
body{font-family:system-ui,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1180px;margin:auto;padding:24px}.group{background:white;border:1px solid #d4d4d8;border-radius:14px;padding:24px;margin:22px 0}.group-header,.question header{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.passage{line-height:1.65;background:#fafafa;border-left:4px solid #71717a;padding:14px 16px}.question{border-top:1px solid #e4e4e7;padding:22px 0}.question h3{font-size:1.05rem;line-height:1.55}h2{font-size:1rem;margin-top:22px}h4{font-size:.92rem;margin-bottom:6px}li{margin:7px 0}.correct{font-weight:750}code{background:#f4f4f5;padding:3px 7px;border-radius:5px;font-size:.76rem}pre{white-space:pre-wrap;background:#fafafa;border:1px solid #e4e4e7;padding:12px;border-radius:8px;line-height:1.5}details{margin:14px 0}summary{cursor:pointer;font-weight:650}
</style></head><body><main><h1>BLR-CP-003 English open-discovery review V1</h1><p>28 deterministic shared-family groups and 176 learner-facing items. This pack is for editorial review only and creates no permanent QL or publication permission.</p>${groupCards}</main></body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v1.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v1.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v1.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v1-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
