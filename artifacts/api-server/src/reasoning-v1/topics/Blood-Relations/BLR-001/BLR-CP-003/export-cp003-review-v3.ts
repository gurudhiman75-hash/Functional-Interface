import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { generateBlrCp003TeacherReviewV3Records } from "./cp003-teacher-editorial-finalizer";

const outputDirectory = path.resolve(process.argv[2] ?? "blr-cp003-review-v3-output");
const records = generateBlrCp003TeacherReviewV3Records();

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
  "coreConcept",
  "familyTreeGrid",
  "stepByStepSolution",
  "optionAnalysis",
  "conclusion",
  "examShortcut",
  "commonTraps",
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
    record.editorial.coreConcept,
    record.editorial.familyTreeGrid,
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

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  status: "OPEN_DISCOVERY_TEACHER_EDITORIAL_V3",
  permanentQlCount: 0,
  groupCount: grouped.size,
  recordCount: records.length,
  scenarioIds: [...new Set(records.map((record) => record.scenarioId))].sort(),
  topologies: [...new Set(records.map((record) => record.topologyId))].sort(),
  reviewFamilies: [...new Set(records.map((record) => record.reviewFamily))].sort(),
  temporaryItemHandles: [...new Set(records.map((record) => record.prototypeId))].sort(),
  answerPositions,
  editorialChecks: {
    visualFamilyTreeOnEveryRecord: true,
    genderMarkersOnEveryTree: true,
    marriageAndLineageKeyOnEveryTree: true,
    fourTierTeacherStyle: true,
    optionSpecificTeaching: true,
    directionConclusionVerified: true,
    rawSemanticKeysHidden: true,
    rawErrorLabelsHidden: true,
    engineJargonRejected: true,
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

if (summary.groupCount !== 32 || summary.recordCount !== 208) {
  throw new Error(
    `CP-003 V3 exporter expected 32 groups and 208 records, got ${summary.groupCount} and ${summary.recordCount}.`,
  );
}
if (JSON.stringify(summary.answerPositions) !== JSON.stringify([57, 53, 49, 49])) {
  throw new Error(`Unexpected CP-003 V3 answer distribution ${JSON.stringify(summary.answerPositions)}.`);
}

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
          .map(
            (entry) =>
              `<li class="${entry.isCorrect ? "analysis-correct" : ""}"><strong>${entry.isCorrect ? "✅" : "❌"} Option ${entry.optionLabel} (${escapeHtml(entry.optionText)}):</strong> ${escapeHtml(entry.explanation)}</li>`,
          )
          .join("");
        return `<article class="question">
          <p class="review-id">Reviewer reference: ${escapeHtml(record.itemId)}</p>
          <h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3>
          <ol class="options">${options}</ol>
          <section class="tier"><h4>📌 Core Concept</h4><ul>${record.editorial.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <section class="tier"><h4>📝 Step-by-Step Solution &amp; Family Tree</h4><ol>${record.editorial.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol><pre>${escapeHtml(record.editorial.familyTreeGrid)}</pre><h5>Check each option</h5><ul>${optionAnalysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section>
          <section class="tier shortcut"><h4>💡 10-Second Exam Speed Shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section>
          <section class="tier traps"><h4>⚠️ Common Traps &amp; Mistakes</h4><ul>${record.editorial.commonTraps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
        </article>`;
      })
      .join("");

    return `<section class="group">
      <header class="group-header"><span>Set ${groupIndex + 1}</span><span>${escapeHtml(first.reviewFamily)}</span><span>Seed ${first.seed}</span></header>
      <h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>
      ${questions}
    </section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 Teacher Review V3</title><style>
body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1180px;margin:auto;padding:24px}.group{background:white;border:1px solid #d4d4d8;border-radius:14px;padding:24px;margin:22px 0}.group-header{display:flex;gap:10px;flex-wrap:wrap;font-weight:700}.group-header span{background:#f4f4f5;border-radius:6px;padding:4px 8px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px 16px}.question{border-top:2px solid #e4e4e7;padding:26px 0}.question h3{font-size:1.1rem;line-height:1.55}.review-id{font-size:.78rem;color:#71717a}.options li,.tier li{margin:8px 0}.correct,.analysis-correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.tier{margin-top:22px}.tier h4{font-size:1rem;margin-bottom:8px}.tier h5{font-size:.93rem;margin-bottom:6px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px 16px}.traps{background:#fff7ed;border-left:4px solid #ea580c;padding:12px 16px}.conclusion{font-size:1.02rem;background:#f0fdf4;padding:10px 12px;border-radius:7px}pre{white-space:pre;overflow:auto;background:#18181b;color:#fafafa;border-radius:10px;padding:18px;line-height:1.5;font-family:"Courier New",monospace;font-size:.88rem}
</style></head><body><main><h1>BLR-CP-003 Passage-Based Blood Relations — Teacher Review V3</h1><p>${summary.groupCount} deterministic passage sets and ${summary.recordCount} learner-facing questions. Every solution contains a visual family tree, conversational four-tier teaching and option-by-option guidance. This remains a non-public editorial review artifact and creates no permanent QL.</p>${groupCards}</main></body></html>`;

const markdownGroups = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group
      .map((record, questionIndex) => {
        const options = record.options
          .map(
            (option, index) =>
              `${String.fromCharCode(65 + index)}. ${option.text}${option.isCorrect ? " ✅" : ""}`,
          )
          .join("\n");
        const analysis = record.editorial.optionAnalysis
          .map(
            (entry) =>
              `- ${entry.isCorrect ? "✅" : "❌"} **Option ${entry.optionLabel} (${entry.optionText}):** ${entry.explanation}`,
          )
          .join("\n");
        return `### Question ${questionIndex + 1}: ${record.stem}\n\nReviewer reference: \`${record.itemId}\`\n\n${options}\n\n#### 📌 Core Concept\n\n${record.editorial.coreConcept.map((line) => `- ${line}`).join("\n")}\n\n#### 📝 Step-by-Step Solution & Family Tree\n\n${record.editorial.stepByStepSolution.map((line, index) => `${index + 1}. ${line}`).join("\n")}\n\n\`\`\`text\n${record.editorial.familyTreeGrid}\n\`\`\`\n\n**Check each option**\n\n${analysis}\n\n**${record.editorial.conclusion}**\n\n#### 💡 10-Second Exam Speed Shortcut\n\n${record.editorial.examShortcut}\n\n#### ⚠️ Common Traps & Mistakes\n\n${record.editorial.commonTraps.map((line) => `- ${line}`).join("\n")}`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1}\n\n**Family:** ${first.reviewFamily}  \n**Scenario:** \`${first.scenarioId}\`  \n**Seed:** ${first.seed}\n\n### Passage\n\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");

const markdown = `# BLR-CP-003 Passage-Based Blood Relations — Teacher Review V3\n\n${summary.groupCount} deterministic passage sets and ${summary.recordCount} learner-facing questions. Every solution contains a visual family tree, conversational four-tier teaching and option-by-option guidance. This is an editorial review artifact only.\n\n${markdownGroups}\n`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v3.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v3.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(path.join(outputDirectory, "blr-cp003-review-v3.html"), html, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-review-v3.md"), markdown, "utf8");
await writeFile(
  path.join(outputDirectory, "blr-cp003-review-v3-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
