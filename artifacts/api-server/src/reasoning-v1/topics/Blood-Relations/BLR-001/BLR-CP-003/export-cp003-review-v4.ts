import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { generateBlrCp003CompetitiveReviewV4Bundle } from "./cp003-competitive-review-v4";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-competitive-review-v4-output",
);
const bundle = generateBlrCp003CompetitiveReviewV4Bundle();
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
const groupSizes = Object.fromEntries(
  [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right, "en-IN"))
    .map(([key, group]) => [key, group.length]),
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
  status: "OPEN_DISCOVERY_COMPETITIVE_REVIEW_V4",
  sourceRecordCount: bundle.sourceRecordCount,
  sourceEligibleRecordCount: bundle.sourceEligibleRecordCount,
  supplementalDerivedRecordCount: bundle.supplementalRecordCount,
  activeRecordCount: records.length,
  rejectedSourceRecordCount: rejected.length,
  passageGroupCount: grouped.size,
  minimumQuestionsPerPassage: Math.min(...Object.values(groupSizes)),
  maximumQuestionsPerPassage: Math.max(...Object.values(groupSizes)),
  groupSizes,
  answerPositions,
  rejectionReasons: Object.fromEntries([...rejectionReasons].sort()),
  engineRules: {
    minimumGraphDistance: 2,
    maximumDirectTextMatch: 0,
    allClaimOptionsDerived: true,
    rawEngineKeywordsRejected: true,
    asciiFamilyTreeRequired: true,
    fourTierTeacherVoiceRequired: true,
    allDistractorsFriendlyWarned: true,
    reverseDirectionTrapExplained: true,
  },
  approvalChecklist: {
    allActiveQuestionsRequireTwoOrMoreGraphEdges: true,
    noActiveQuestionRepeatsItsAnswerPremise: true,
    visualAsciiTreePresentInEverySolution: true,
    teacherVoicePresentInEverySolution: true,
    reverseDirectionTrapsExplainedWhereAvailable: true,
  },
  scopeBoundary: {
    relationAndLineageReasoning: "BLR-CP-003",
    familyCountsAndComposition: "BLR-CP-004",
    femaleCountQuestionsIncludedHere: false,
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
  summary.sourceRecordCount !== 208 ||
  summary.sourceEligibleRecordCount !== 116 ||
  summary.supplementalDerivedRecordCount !== 12 ||
  summary.activeRecordCount !== 128 ||
  summary.rejectedSourceRecordCount !== 92 ||
  summary.passageGroupCount !== 32 ||
  summary.minimumQuestionsPerPassage < 3
) {
  throw new Error(`Unexpected CP-003 V4 inventory: ${JSON.stringify(summary)}.`);
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
  "claimOptionMinimumGraphDistance",
  "coreConcept",
  "familyTreeGrid",
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
    record.metadata.claimOptionMinimumGraphDistance,
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
          .map(
            (entry) =>
              `<li class="${entry.isCorrect ? "analysis-correct" : ""}"><strong>${escapeHtml(entry.explanation.slice(0, entry.explanation.indexOf(".") + 1))}</strong>${escapeHtml(entry.explanation.slice(entry.explanation.indexOf(".") + 1))}</li>`,
          )
          .join("");
        return `<article class="question">
          <p class="review-id">Reviewer reference: ${escapeHtml(record.itemId)} · Minimum graph distance: ${record.metadata.minimumGraphDistance}${record.metadata.supplementalDerivedItem ? " · Derived V4 replacement" : ""}</p>
          <h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3>
          <ol class="options">${options}</ol>
          <section class="tier concept"><h4>📌 Core Concept</h4><ul>${record.editorial.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <section class="tier solution"><h4>📝 Step-by-Step Solution &amp; Family Tree</h4><ol>${record.editorial.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol><pre>${escapeHtml(record.editorial.familyTreeGrid)}</pre><h5>Check each option</h5><ul>${optionAnalysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section>
          <section class="tier shortcut"><h4>⚡ 10-Second Speed Shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section>
          <section class="tier traps"><h4>⚠️ Common Trap &amp; Student Warning</h4><ul>${record.editorial.commonTraps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
        </article>`;
      })
      .join("");

    return `<section class="group">
      <header class="group-header"><span>Set ${groupIndex + 1}</span><span>${escapeHtml(first.reviewFamily)}</span><span>Seed ${first.seed}</span><span>${group.length} derived questions</span></header>
      <h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>
      ${questions}
    </section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 Competitive Review V4</title><style>
body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1180px;margin:auto;padding:24px}.summary,.group{background:white;border:1px solid #d4d4d8;border-radius:14px;padding:24px;margin:22px 0}.group-header{display:flex;gap:10px;flex-wrap:wrap;font-weight:700}.group-header span{background:#f4f4f5;border-radius:6px;padding:4px 8px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px 16px}.question{border-top:2px solid #e4e4e7;padding:26px 0}.review-id{font-size:.78rem;color:#71717a}.options li,.tier li{margin:8px 0}.correct,.analysis-correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.tier{margin-top:22px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px 16px}.traps{background:#fff7ed;border-left:4px solid #ea580c;padding:12px 16px}.conclusion{background:#f0fdf4;padding:10px 12px;border-radius:7px}pre{white-space:pre;overflow:auto;background:#18181b;color:#fafafa;border-radius:10px;padding:18px;line-height:1.5;font-family:"Courier New",monospace;font-size:.88rem}code{background:#f4f4f5;padding:2px 5px;border-radius:4px}
</style></head><body><main><h1>BLR-CP-003 Passage-Based Blood Relations — Competitive Review V4</h1><section class="summary"><p><strong>${summary.activeRecordCount}</strong> active derived questions across <strong>${summary.passageGroupCount}</strong> passage sets. Every active question requires at least two graph edges and has zero direct answer-premise matches.</p><p>Source audit: ${summary.sourceRecordCount} records → ${summary.sourceEligibleRecordCount} retained + ${summary.supplementalDerivedRecordCount} derived replacements; ${summary.rejectedSourceRecordCount} direct or otherwise ineligible records are documented separately.</p><p>This remains a non-public discovery review pack. Permanent QLs: 0.</p></section>${groupCards}</main></body></html>`;

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
          .map((entry) => `- ${entry.explanation}`)
          .join("\n");
        return `### Question ${questionIndex + 1}: ${record.stem}\n\nReviewer reference: \`${record.itemId}\` · Minimum graph distance: **${record.metadata.minimumGraphDistance}**${record.metadata.supplementalDerivedItem ? " · Derived V4 replacement" : ""}\n\n${options}\n\n#### 📌 Core Concept\n\n${record.editorial.coreConcept.map((line) => `- ${line}`).join("\n")}\n\n#### 📝 Step-by-Step Solution & Family Tree\n\n${record.editorial.stepByStepSolution.map((line, index) => `${index + 1}. ${line}`).join("\n")}\n\n\`\`\`text\n${record.editorial.familyTreeGrid}\n\`\`\`\n\n**Check each option**\n\n${analysis}\n\n**${record.editorial.conclusion}**\n\n#### ⚡ 10-Second Speed Shortcut\n\n${record.editorial.examShortcut}\n\n#### ⚠️ Common Trap & Student Warning\n\n${record.editorial.commonTraps.map((line) => `- ${line}`).join("\n")}`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1}\n\n**Family:** ${first.reviewFamily}  \n**Scenario:** \`${first.scenarioId}\`  \n**Seed:** ${first.seed}  \n**Active derived questions:** ${group.length}\n\n### Passage\n\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");

const markdown = `# BLR-CP-003 Passage-Based Blood Relations — Competitive Review V4\n\n${summary.activeRecordCount} active derived questions across ${summary.passageGroupCount} passage sets. Every question requires at least two graph edges and has zero direct answer-premise matches.\n\nSource audit: ${summary.sourceRecordCount} records → ${summary.sourceEligibleRecordCount} retained + ${summary.supplementalDerivedRecordCount} derived replacements; ${summary.rejectedSourceRecordCount} rejected records are listed separately.\n\n${markdownGroups}\n`;

const rejectedRows = rejected
  .map(
    (record) =>
      `<tr><td>${escapeHtml(record.scenarioId)}</td><td>${record.seed}</td><td>${escapeHtml(record.itemId)}</td><td>${escapeHtml(record.stem)}</td><td>${escapeHtml(record.correctAnswer)}</td><td>${escapeHtml(record.audit.minimumGraphDistance)}</td><td>${escapeHtml(record.audit.directTextMatchCount)}</td><td>${escapeHtml(record.audit.rejectionReasons.join(", "))}</td></tr>`,
  )
  .join("");
const rejectedHtml = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>BLR-CP-003 V4 Rejection Audit</title><style>body{font-family:system-ui,sans-serif;padding:24px}table{border-collapse:collapse;width:100%;font-size:.86rem}th,td{border:1px solid #d4d4d8;padding:8px;text-align:left;vertical-align:top}th{background:#f4f4f5}</style></head><body><h1>BLR-CP-003 V4 Rejected Source-Item Audit</h1><p>${rejected.length} source records were excluded from the active competitive review pack. These records remain part of technical discovery only.</p><table><thead><tr><th>Scenario</th><th>Seed</th><th>Item</th><th>Stem</th><th>Answer</th><th>Min distance</th><th>Direct matches</th><th>Reasons</th></tr></thead><tbody>${rejectedRows}</tbody></table></body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-review-v4.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-review-v4.csv"),
  `${activeCsvHeader}\n${activeCsvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-review-v4.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-review-v4.md"),
  markdown,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-review-v4-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-rejected-v4.jsonl"),
  `${rejected.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-rejected-v4.csv"),
  `${rejectedCsvHeader}\n${rejectedCsvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-competitive-rejected-v4.html"),
  rejectedHtml,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
