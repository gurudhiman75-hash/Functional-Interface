import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import { generateBlrCp003V8EditorialBaselineApprovedRecords } from "./cp003-v8-editorial-baseline-approved";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
  generateBlrCp003V9TopologyGapWave01ReviewedCandidates,
} from "./cp003-v9-topology-gap-wave-01-reviewed";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-v9-topology-gap-wave-01-reviewed-output",
);
const baseline = generateBlrCp003V8EditorialBaselineApprovedRecords();
const records = generateBlrCp003V9TopologyGapWave01ReviewedCandidates();

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function escapeCsv(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

const grouped = new Map<string, (typeof records)[number][]>();
for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  const group = grouped.get(key) ?? [];
  group.push(record);
  grouped.set(key, group);
}

const authorityCounts = Object.fromEntries(
  [...new Set(records.map((record) => record.provisionalAuthority))]
    .sort()
    .map((authority) => [
      authority,
      records.filter((record) => record.provisionalAuthority === authority).length,
    ]),
);
const topologyCounts = Object.fromEntries(
  [...new Set(records.map((record) => record.topologyId))]
    .sort()
    .map((topologyId) => [
      topologyId,
      records.filter((record) => record.topologyId === topologyId).length,
    ]),
);
const prototypeIds = [...new Set(records.map((record) => record.prototypeId))].sort();
const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const combinedRecords = [...baseline, ...records];
const combinedGroups = new Set(
  combinedRecords.map((record) => `${record.scenarioId}::${record.seed}`),
);
const combinedTopologies = new Set(combinedRecords.map((record) => record.topologyId));
const combinedPrototypes = new Set(combinedRecords.map((record) => record.prototypeId));
const combinedAnswerPositions = [0, 1, 2, 3].map(
  (position) =>
    combinedRecords.filter((record) => record.correctIndex === position).length,
);
const remediatedRecords = records.filter(
  (record) => record.metadata.passageEvidenceRemediated,
);
const remediatedGroups = new Set(
  remediatedRecords.map((record) => `${record.scenarioId}::${record.seed}`),
);

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_REVIEWED_VERSION,
  status: "HUMAN_REVIEW_STRUCTURAL_GAP_WAVE_REVIEWED_NOT_APPROVED",
  approvedBaseline: {
    records: baseline.length,
    approvalScope: "EDITORIAL_STAGING_ONLY",
    editorialBaselineApproved: true,
    structuralSaturationApproved: false,
  },
  reviewedWave01: {
    candidateRecords: records.length,
    passageGroups: grouped.size,
    topologyCount: Object.keys(topologyCounts).length,
    topologyCounts,
    prototypeCount: prototypeIds.length,
    prototypeIds,
    authorityCounts,
    answerPositions,
    manualPassageAuditApplied: true,
    remediatedRecords: remediatedRecords.length,
    remediatedPassageGroups: remediatedGroups.size,
    targetGenderEvidenceComplete: true,
    exactLineageRoleEvidenceComplete: true,
    spouseEvidenceComplete: true,
    independentlySolvedEvidencePaths: 176,
    nativeSvgDiagrams: records.length,
    asciiFallbacks: records.length,
    humanReviewApproved: false,
  },
  combinedCandidateBank: {
    records: combinedRecords.length,
    passageGroups: combinedGroups.size,
    topologyCount: combinedTopologies.size,
    prototypeCount: combinedPrototypes.size,
    answerPositions: combinedAnswerPositions,
  },
  remainingOpenCoverage: [
    "negative and exclusion-heavy clue systems",
    "unknown or deliberately unstated spouse boundaries",
    "cross-checkpoint overlap and final merge/split audit",
    "combined-bank repetition and difficulty calibration",
    "structural saturation",
  ],
  release: {
    permanentQlCount: 0,
    nextAvailableQlId: "BLR-QL-009",
    finalDiscoveryFreezeAllowed: false,
    questionStudioVisible: false,
    questionBankEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
    localisationAllowed: false,
    mergeAllowed: false,
  },
};

if (
  summary.reviewedWave01.candidateRecords !== 96 ||
  summary.reviewedWave01.passageGroups !== 32 ||
  summary.reviewedWave01.topologyCount !== 4 ||
  summary.reviewedWave01.prototypeCount !== 12 ||
  summary.reviewedWave01.remediatedRecords !== 42 ||
  summary.reviewedWave01.remediatedPassageGroups !== 14 ||
  answerPositions.some((count) => count !== 24) ||
  summary.combinedCandidateBank.records !== 226 ||
  summary.combinedCandidateBank.passageGroups !== 84 ||
  summary.combinedCandidateBank.topologyCount !== 6 ||
  summary.combinedCandidateBank.prototypeCount !== 17 ||
  summary.release.permanentQlCount !== 0 ||
  summary.release.finalDiscoveryFreezeAllowed
) {
  throw new Error(`Unexpected V9 reviewed inventory: ${JSON.stringify(summary)}.`);
}

const csvHeader = [
  "topologyId",
  "scenarioId",
  "seed",
  "prototypeId",
  "provisionalAuthority",
  "itemId",
  "sharedPrompt",
  "stem",
  "optionA",
  "optionB",
  "optionC",
  "optionD",
  "correctIndex",
  "correctAnswer",
  "passageEvidenceRemediated",
  "solutionPhases",
  "optionAnalysis",
  "conclusion",
  "fingerprint",
].join(",");
const csvRows = records.map((record) =>
  [
    record.topologyId,
    record.scenarioId,
    record.seed,
    record.prototypeId,
    record.provisionalAuthority,
    record.itemId,
    record.sharedPrompt,
    record.stem,
    ...record.options.map((option) => option.text),
    record.correctIndex,
    record.options[record.correctIndex]?.text,
    record.metadata.passageEvidenceRemediated,
    record.editorial.solutionPhases,
    record.editorial.optionAnalysis,
    record.editorial.conclusion,
    record.metadata.semanticFingerprint,
  ]
    .map(escapeCsv)
    .join(","),
);

function markdownQuestion(
  record: (typeof records)[number],
  index: number,
): string {
  const options = record.options
    .map(
      (option, optionIndex) =>
        `${String.fromCharCode(65 + optionIndex)}. ${option.text}${option.isCorrect ? " ✅" : ""}`,
    )
    .join("\n");
  const phases = record.editorial.solutionPhases
    .map(
      (phase) =>
        `#### ${phase.title}\n${phase.points.map((point) => `- ${point}`).join("\n")}`,
    )
    .join("\n\n");
  return `### Question ${index + 1}: ${record.stem}\n\nPrototype: \`${record.prototypeId}\`  \nAuthority: \`${record.provisionalAuthority}\`  \nPassage remediated: **${record.metadata.passageEvidenceRemediated}**\n\n${options}\n\n${phases}\n\n#### Option Analysis\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n**Shortcut:** ${record.editorial.examShortcut}`;
}

const markdownGroups = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    return `## Set ${groupIndex + 1} — ${first.topologyId} — Seed ${first.seed}\n\n### Passage\n${first.sharedPrompt}\n\n${group.map(markdownQuestion).join("\n\n---\n\n")}`;
  })
  .join("\n\n---\n\n");
const markdown = `# BLR-CP-003 V9 Topology Gap Wave 01 — Reviewed\n\nThis package contains 96 new structural candidates. Manual passage audit corrected 14 passage groups affecting 42 records. V8 approval does not transfer to this wave. Human review remains pending; permanent QLs: 0.\n\n${markdownGroups}\n`;

function htmlQuestion(
  record: (typeof records)[number],
  index: number,
): string {
  const options = record.options
    .map(
      (option, optionIndex) =>
        `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + optionIndex)}.</strong> ${escapeHtml(option.text)}${option.isCorrect ? ' <span class="badge">Correct</span>' : ""}</li>`,
    )
    .join("");
  const phases = record.editorial.solutionPhases
    .map(
      (phase) =>
        `<section class="phase"><h4>${escapeHtml(phase.title)}</h4><ul>${phase.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></section>`,
    )
    .join("");
  const analysis = record.editorial.optionAnalysis
    .map(
      (entry) =>
        `<li class="${entry.isCorrect ? "correct" : ""}">${escapeHtml(entry.explanation)}</li>`,
    )
    .join("");
  return `<article class="question"><p class="id">${escapeHtml(record.itemId)} · ${escapeHtml(record.prototypeId)}</p><p class="audit">Passage evidence remediated: <strong>${record.metadata.passageEvidenceRemediated}</strong></p><h3>Question ${index + 1}: ${escapeHtml(record.stem)}</h3><ol>${options}</ol>${phases}${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}<section><h4>Option analysis</h4><ul>${analysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section><section class="shortcut"><h4>Exam shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section></article>`;
}

const htmlGroups = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    return `<section class="group"><header>Set ${groupIndex + 1} · ${escapeHtml(first.topologyId)} · Seed ${first.seed}</header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${group.map(htmlQuestion).join("")}</section>`;
  })
  .join("\n");
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V9 Wave 01 Reviewed</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{background:#fff;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px}.question{border-top:2px solid #e4e4e7;padding:28px 0}.id,.audit{font-size:.78rem;color:#71717a;overflow-wrap:anywhere}.correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.phase{background:#f8fafc;border-left:4px solid #4f46e5;padding:10px 14px;margin:12px 0}.conclusion{background:#f0fdf4;padding:10px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px}.svg-family-tree{overflow:hidden;min-width:0;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;max-width:100%;height:auto;min-width:0}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}@media(max-width:640px){main{padding:10px}.summary,.group{padding:14px;border-radius:12px}.question{padding:20px 0}.svg-family-tree{padding:6px}.svg-tree-key{gap:8px;font-size:10px}}</style></head><body><main><h1>BLR-CP-003 — V9 Topology Gap Wave 01 Reviewed</h1><section class="summary"><p><strong>96 candidates</strong> across 32 new passage groups, four topologies and twelve prototypes.</p><p><strong>Manual remediation:</strong> 14 passage groups / 42 records.</p><p class="warning"><strong>Human review remains required.</strong> Structural saturation, permanent QLs, Question Studio and publication remain blocked.</p></section>${htmlGroups}</main></body></html>`;

const coverage = `# BLR-CP-003 V9 Reviewed Structural Coverage\n\n## Newly covered\n\n- Multi-married sibling and in-law branches\n- Maternal and paternal branches in one graph\n- Four-generation great-grand relations\n- Unequal cousin branch cardinality\n- Composite pair conditions\n- Complete sets of three and four members\n\n## Manual evidence defects closed\n\n- Male cousin is now explicitly identified as a son in every relevant passage.\n- Maternal uncle's target child is explicitly identified as a daughter in every passage variant.\n- The top-generation marriage is explicit in every great-grandmother exact-lineage passage.\n\n## Still open\n\n${summary.remainingOpenCoverage.map((entry) => `- ${entry}`).join("\n")}\n`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-reviewed-candidates.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-reviewed-candidates.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-reviewed-candidates.md"),
  markdown,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-reviewed-candidates.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-reviewed-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-reviewed-coverage.md"),
  coverage,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
