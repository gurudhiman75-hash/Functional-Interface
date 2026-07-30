import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { generateBlrCp003CompetitiveSvgReviewBundle } from "./cp003-competitive-svg-review";
import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-competitive-svg-review-v5-output",
);
const bundle = generateBlrCp003CompetitiveSvgReviewBundle();
const records = bundle.selected;
const rejected = bundle.rejected;

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

const grouped = new Map<string, typeof records>();
for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  const group = grouped.get(key) ?? [];
  group.push(record);
  grouped.set(key, group);
}

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const payloadSizes = records.map((record) =>
  Buffer.byteLength(JSON.stringify(record.proceduralLogic), "utf8"),
);
const rejectionReasons = new Map<string, number>();
for (const rejectedRecord of rejected) {
  for (const reason of rejectedRecord.audit.rejectionReasons) {
    rejectionReasons.set(reason, (rejectionReasons.get(reason) ?? 0) + 1);
  }
}

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  status: "OPEN_DISCOVERY_COMPETITIVE_SVG_REVIEW_V5",
  sourceRecordCount: bundle.sourceRecordCount,
  sourceEligibleRecordCount: bundle.sourceEligibleRecordCount,
  supplementalDerivedRecordCount: bundle.supplementalRecordCount,
  activeRecordCount: records.length,
  rejectedSourceRecordCount: rejected.length,
  passageGroupCount: grouped.size,
  minimumQuestionsPerPassage: Math.min(...[...grouped.values()].map((group) => group.length)),
  maximumQuestionsPerPassage: Math.max(...[...grouped.values()].map((group) => group.length)),
  answerPositions,
  rejectionReasons: Object.fromEntries([...rejectionReasons].sort()),
  visualRenderer: {
    primary: "native-inline-svg-v1",
    externalGraphLibrary: false,
    lazyClientChunk: true,
    databaseMigrationRequired: false,
    svgDiagramCount: records.length,
    highlightedAnswerPathCount: records.filter(
      (record) => (record.proceduralLogic.query?.pathPersonIds?.length ?? 0) >= 3,
    ).length,
    asciiFallbackCount: records.filter((record) =>
      record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"),
    ).length,
    averagePayloadBytes: Math.round(
      payloadSizes.reduce((sum, size) => sum + size, 0) / payloadSizes.length,
    ),
    maximumPayloadBytes: Math.max(...payloadSizes),
    hardPayloadLimitBytes: 12_000,
  },
  engineRules: {
    minimumGraphDistance: 2,
    maximumDirectTextMatch: 0,
    allClaimOptionsDerived: true,
    rawEngineKeywordsRejected: true,
    svgFamilyTreeRequired: true,
    asciiFallbackRetained: true,
    fourTierTeacherVoiceRequired: true,
    allDistractorsFriendlyWarned: true,
    reverseDirectionTrapExplained: true,
  },
  scopeBoundary: {
    relationAndLineageReasoning: "BLR-CP-003",
    familyCountsAndComposition: "BLR-CP-004",
  },
  release: {
    permanentQlCount: 0,
    nextQlIdClaimed: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    hindiStarted: false,
    punjabiStarted: false,
  },
};

if (
  summary.activeRecordCount !== 128 ||
  summary.rejectedSourceRecordCount !== 92 ||
  summary.passageGroupCount !== 32 ||
  summary.minimumQuestionsPerPassage < 3 ||
  summary.visualRenderer.svgDiagramCount !== 128 ||
  summary.visualRenderer.highlightedAnswerPathCount !== 128 ||
  summary.visualRenderer.asciiFallbackCount !== 128 ||
  summary.visualRenderer.maximumPayloadBytes >= summary.visualRenderer.hardPayloadLimitBytes
) {
  throw new Error(`Unexpected CP-003 V5 SVG inventory: ${JSON.stringify(summary)}.`);
}

const activeCsvHeader = [
  "reviewFamily",
  "scenarioId",
  "topologyId",
  "seed",
  "itemId",
  "prototypeId",
  "supplementalDerivedItem",
  "sharedPrompt",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "correctAnswer",
  "minimumGraphDistance",
  "directTextMatchCount",
  "familyTreeDiagram",
  "coreConcept",
  "stepByStepSolution",
  "optionAnalysis",
  "conclusion",
  "examShortcut",
  "commonTraps",
  "fingerprint",
].join(",");

const activeCsvRows = records.map((record) =>
  [
    record.reviewFamily,
    record.scenarioId,
    record.topologyId,
    record.seed,
    record.itemId,
    record.prototypeId,
    record.metadata.supplementalDerivedItem ?? false,
    record.sharedPrompt,
    record.stem,
    record.options[0]?.text,
    record.options[1]?.text,
    record.options[2]?.text,
    record.options[3]?.text,
    record.correctIndex,
    record.options[record.correctIndex]?.text,
    record.metadata.minimumGraphDistance,
    record.metadata.directTextMatchCount,
    record.proceduralLogic,
    record.editorial.coreConcept,
    record.editorial.stepByStepSolution,
    record.editorial.optionAnalysis,
    record.editorial.conclusion,
    record.editorial.examShortcut,
    record.editorial.commonTraps,
    record.metadata.semanticFingerprint,
  ]
    .map(escapeCsv)
    .join(","),
);

const rejectedCsvHeader = [
  "scenarioId",
  "topologyId",
  "seed",
  "itemId",
  "prototypeId",
  "stem",
  "correctAnswer",
  "minimumGraphDistance",
  "directTextMatchCount",
  "claimOptionMinimumGraphDistance",
  "claimOptionDirectTextMatchCount",
  "rejectionReasons",
].join(",");

const rejectedCsvRows = rejected.map((record) =>
  [
    record.scenarioId,
    record.topologyId,
    record.seed,
    record.itemId,
    record.prototypeId,
    record.stem,
    record.correctAnswer,
    record.audit.minimumGraphDistance,
    record.audit.directTextMatchCount,
    record.audit.claimOptionMinimumGraphDistance,
    record.audit.claimOptionDirectTextMatchCount,
    record.audit.rejectionReasons,
  ]
    .map(escapeCsv)
    .join(","),
);

const groupCards = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group
      .map((record, questionIndex) => {
        const options = record.options
          .map(
            (option, optionIndex) =>
              `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.text)}${option.isCorrect ? " <span class=\"badge\">Correct</span>" : ""}</li>`,
          )
          .join("");
        const optionAnalysis = record.editorial.optionAnalysis
          .map((entry) => `<li class="${entry.isCorrect ? "analysis-correct" : ""}">${escapeHtml(entry.explanation)}</li>`)
          .join("");
        const svgTree = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
        return `<article class="question">
          <p class="review-id">Reviewer reference: ${escapeHtml(record.itemId)} · Minimum graph distance: ${record.metadata.minimumGraphDistance}${record.metadata.supplementalDerivedItem ? " · Derived V4 replacement" : ""}</p>
          <h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3>
          <ol class="options">${options}</ol>
          <section class="tier concept"><h4>📌 Core Concept</h4><ul>${record.editorial.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <section class="tier solution"><h4>📝 Step-by-Step Solution &amp; Visual Family Tree</h4><ol>${record.editorial.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>${svgTree}<details><summary>Plain-text fallback</summary><pre>${escapeHtml(record.editorial.familyTreeGrid)}</pre></details><h5>Check each option</h5><ul>${optionAnalysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section>
          <section class="tier shortcut"><h4>⚡ 10-Second Speed Shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section>
          <section class="tier traps"><h4>⚠️ Common Trap &amp; Student Warning</h4><ul>${record.editorial.commonTraps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
        </article>`;
      })
      .join("");
    return `<section class="group"><header class="group-header"><span>Set ${groupIndex + 1}</span><span>${escapeHtml(first.reviewFamily)}</span><span>Seed ${first.seed}</span><span>${group.length} derived questions</span></header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${questions}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 Native SVG Review V5</title><style>
body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1220px;margin:auto;padding:24px}.summary,.group{background:white;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0;box-shadow:0 8px 24px rgba(15,23,42,.05)}.group-header{display:flex;gap:10px;flex-wrap:wrap;font-weight:700}.group-header span{background:#f4f4f5;border-radius:7px;padding:5px 9px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px 16px}.question{border-top:2px solid #e4e4e7;padding:28px 0}.review-id{font-size:.78rem;color:#71717a}.options li,.tier li{margin:8px 0}.correct,.analysis-correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.tier{margin-top:22px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px 16px}.traps{background:#fff7ed;border-left:4px solid #ea580c;padding:12px 16px}.conclusion{background:#f0fdf4;padding:10px 12px;border-radius:7px}.svg-family-tree{overflow-x:auto;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;min-width:720px;height:auto}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}details{margin-top:12px}summary{cursor:pointer;font-weight:650;color:#475569}pre{white-space:pre;overflow:auto;background:#18181b;color:#fafafa;border-radius:10px;padding:18px;line-height:1.5;font-family:"Courier New",monospace;font-size:.82rem}
</style></head><body><main><h1>BLR-CP-003 — Native SVG Competitive Review V5</h1><section class="summary"><p><strong>${summary.activeRecordCount}</strong> active derived questions across <strong>${summary.passageGroupCount}</strong> passage sets. The native SVG is the primary solution visual; ASCII is retained only as a fallback.</p><p>Average structured diagram payload: <strong>${summary.visualRenderer.averagePayloadBytes} bytes</strong>. Largest payload: <strong>${summary.visualRenderer.maximumPayloadBytes} bytes</strong>. No external graph library or database migration is required.</p><p>This remains a non-public discovery review pack. Permanent QLs: 0.</p></section>${groupCards}</main></body></html>`;

const markdownGroups = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group.map((record, questionIndex) => {
      const options = record.options.map((option, index) =>
        `${String.fromCharCode(65 + index)}. ${option.text}${option.isCorrect ? " ✅" : ""}`,
      ).join("\n");
      return `### Question ${questionIndex + 1}: ${record.stem}\n\n${options}\n\n#### 📌 Core Concept\n\n${record.editorial.coreConcept.map((line) => `- ${line}`).join("\n")}\n\n#### 📝 Step-by-Step Solution & Family Tree\n\n${record.editorial.stepByStepSolution.map((line, index) => `${index + 1}. ${line}`).join("\n")}\n\n> The HTML review contains the responsive native SVG. Markdown uses the plain-text fallback.\n\n\`\`\`text\n${record.editorial.familyTreeGrid}\n\`\`\`\n\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n#### ⚡ 10-Second Speed Shortcut\n\n${record.editorial.examShortcut}\n\n#### ⚠️ Common Trap & Student Warning\n\n${record.editorial.commonTraps.map((line) => `- ${line}`).join("\n")}`;
    }).join("\n\n---\n\n");
    return `## Set ${groupIndex + 1}\n\n### Passage\n\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");
const markdown = `# BLR-CP-003 Native SVG Competitive Review V5\n\n${summary.activeRecordCount} active questions. HTML is the authoritative visual review; Markdown contains the ASCII fallback.\n\n${markdownGroups}\n`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, "blr-cp003-active-v5.jsonl"), `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-active-v5.csv"), `${activeCsvHeader}\n${activeCsvRows.join("\n")}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-active-v5.html"), html, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-active-v5.md"), markdown, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-rejected-source-v5.jsonl"), `${rejected.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-rejected-source-v5.csv"), `${rejectedCsvHeader}\n${rejectedCsvRows.join("\n")}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-v5-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(JSON.stringify(summary, null, 2));
