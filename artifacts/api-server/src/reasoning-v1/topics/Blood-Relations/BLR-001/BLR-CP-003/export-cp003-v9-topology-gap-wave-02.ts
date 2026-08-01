import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import { generateBlrCp003V8EditorialBaselineApprovedRecords } from "./cp003-v8-editorial-baseline-approved";
import { generateBlrCp003V9Wave01StructuralStagingApprovedRecords } from "./cp003-v9-wave01-structural-staging-approved";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  generateBlrCp003V9TopologyGapWave02Candidates,
} from "./cp003-v9-topology-gap-wave-02";
import { BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT } from "./cp003-v9-wave02-authority-audit";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-v9-topology-gap-wave-02-output",
);
const v8 = generateBlrCp003V8EditorialBaselineApprovedRecords();
const wave01 = generateBlrCp003V9Wave01StructuralStagingApprovedRecords();
const records = generateBlrCp003V9TopologyGapWave02Candidates();
const approved = [...v8, ...wave01];
const combined = [...approved, ...records];

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

const countBy = <T>(values: readonly T[], key: (value: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const id = key(value);
    counts[id] = (counts[id] ?? 0) + 1;
  }
  return counts;
};

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const combinedAnswerPositions = [0, 1, 2, 3].map(
  (position) => combined.filter((record) => record.correctIndex === position).length,
);
const authorityCounts = countBy(records, (record) => record.provisionalAuthority);
const topologyCounts = countBy(records, (record) => record.topologyId);
const prototypeCounts = countBy(records, (record) => record.prototypeId);
const combinedGroups = new Set(
  combined.map((record) => `${record.scenarioId}::${record.seed}`),
);
const combinedTopologies = new Set(combined.map((record) => record.topologyId));
const combinedPrototypes = new Set(combined.map((record) => record.prototypeId));

const coverageMatrix = [
  {
    dimension: "Negative and exclusion-heavy passage constraints",
    status: "NEWLY_COVERED",
    evidence: "all 18 Wave 02 passage groups contain at least four negative constraints",
  },
  {
    dimension: "Unknown or deliberately unstated spouse boundary",
    status: "NEWLY_COVERED",
    evidence: "UNSTATED_SPOUSE_SINGLE_PARENT_BRANCH and FOUR_SIBLING_NEGATIVE_STATUS_GRID",
  },
  {
    dimension: "Explicit unmarried status versus unresolved spouse status",
    status: "NEWLY_COVERED",
    evidence: "12 positive-status and 12 unresolved-status records",
  },
  {
    dimension: "Mixed in-law and generation-direction pair",
    status: "NEWLY_COVERED",
    evidence: "mother-in-law/daughter and brother-in-law/nephew prototypes",
  },
  {
    dimension: "Same relation reached through blood and spouse branches",
    status: "NEWLY_COVERED",
    evidence: "two-nephew branch set",
  },
  {
    dimension: "Unknown spouse branch retained in cousin reasoning",
    status: "NEWLY_COVERED",
    evidence: "three-branch cousin set",
  },
  {
    dimension: "Unresolved marital-status authority split",
    status: "OPEN_AUDIT",
    evidence: "one provisional split candidate; no permanent QL",
  },
  {
    dimension: "Combined-bank repetition and difficulty calibration",
    status: "OPEN",
    evidence: "requires chapter-wide audit over 298 candidate records",
  },
  {
    dimension: "Cross-checkpoint overlap and final merge/split audit",
    status: "OPEN",
    evidence: "must compare retained CP-003 contracts against frozen BLR-QL-001 through BLR-QL-008",
  },
  {
    dimension: "Structural saturation",
    status: "OPEN",
    evidence: "nine topologies and twenty-nine prototypes are evidence, not a quota",
  },
] as const;

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  status: "HUMAN_REVIEW_NEGATIVE_BOUNDARY_GAP_WAVE_PENDING",
  approvedBaseline: {
    v8Records: v8.length,
    v9Wave01Records: wave01.length,
    approvedRecords: approved.length,
    approvalScopes: ["EDITORIAL_STAGING_ONLY", "STRUCTURAL_STAGING_ONLY"],
  },
  wave02: {
    candidateRecords: records.length,
    passageGroups: grouped.size,
    topologyCount: Object.keys(topologyCounts).length,
    topologyCounts,
    prototypeCount: Object.keys(prototypeCounts).length,
    prototypeCounts,
    authorityCounts,
    answerPositions,
    negativeConstraintRecords: records.length,
    unknownStatusRecords: authorityCounts.IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS ?? 0,
    explicitStatusRecords: authorityCounts.IDENTIFY_MEMBER_BY_MARITAL_STATUS ?? 0,
    mixedRelationRecords: records.filter((record) => record.metadata.mixedRelationContract).length,
    nativeSvgDiagrams: records.length,
    asciiFallbacks: records.length,
    humanReviewApproved: false,
    wave02StructuralStagingApproved: false,
  },
  combinedCandidateBank: {
    records: combined.length,
    passageGroups: combinedGroups.size,
    topologyCount: combinedTopologies.size,
    prototypeCount: combinedPrototypes.size,
    answerPositions: combinedAnswerPositions,
  },
  authorityAudit: BLR_CP003_V9_WAVE02_AUTHORITY_AUDIT,
  coverageMatrix,
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
  summary.approvedBaseline.approvedRecords !== 226 ||
  summary.wave02.candidateRecords !== 72 ||
  summary.wave02.passageGroups !== 18 ||
  summary.wave02.topologyCount !== 3 ||
  summary.wave02.prototypeCount !== 12 ||
  summary.wave02.unknownStatusRecords !== 12 ||
  summary.wave02.explicitStatusRecords !== 12 ||
  summary.wave02.mixedRelationRecords !== 36 ||
  answerPositions.some((count) => count !== 18) ||
  summary.combinedCandidateBank.records !== 298 ||
  summary.combinedCandidateBank.passageGroups !== 102 ||
  summary.combinedCandidateBank.topologyCount !== 9 ||
  summary.combinedCandidateBank.prototypeCount !== 29 ||
  summary.release.permanentQlCount !== 0 ||
  summary.release.finalDiscoveryFreezeAllowed
+) {
  throw new Error(`Unexpected V9 Wave 02 inventory: ${JSON.stringify(summary)}.`);
}

const csvHeader = [
  "topologyId", "scenarioId", "seed", "prototypeId", "prototypeFamily",
  "provisionalAuthority", "itemId", "sharedPrompt", "stem",
  "optionA", "optionB", "optionC", "optionD", "correctIndex", "correctAnswer",
  "negativeClueCount", "boundaryPolicy", "unknownSpouseBoundaryIds",
  "explicitUnmarriedIds", "mixedRelationContract", "evidencePaths",
  "solutionPhases", "optionAnalysis", "conclusion", "semanticFingerprint",
].join(",");

const csvRows = records.map((record) =>
  [
    record.topologyId,
    record.scenarioId,
    record.seed,
    record.prototypeId,
    record.prototypeFamily,
    record.provisionalAuthority,
    record.itemId,
    record.sharedPrompt,
    record.stem,
    record.options[0]?.text,
    record.options[1]?.text,
    record.options[2]?.text,
    record.options[3]?.text,
    record.correctIndex,
    record.options[record.correctIndex]?.text,
    record.metadata.negativeClueCount,
    record.metadata.boundaryPolicy,
    record.metadata.unknownSpouseBoundaryIds,
    record.metadata.explicitUnmarriedIds,
    record.metadata.mixedRelationContract,
    record.evidencePaths,
    record.editorial.solutionPhases,
    record.editorial.optionAnalysis,
    record.editorial.conclusion,
    record.metadata.semanticFingerprint,
  ].map(escapeCsv).join(","),
);

const markdownGroups = [...grouped.values()].map((group, groupIndex) => {
  const first = group[0]!;
  const questions = group.map((record, questionIndex) => {
    const options = record.options.map((option, index) =>
      `${String.fromCharCode(65 + index)}. ${option.text}${option.isCorrect ? " ✅" : ""}`,
    ).join("\n");
    const phases = record.editorial.solutionPhases.map((phase) =>
      `#### ${phase.title}\n${phase.points.map((point) => `- ${point}`).join("\n")}`,
    ).join("\n\n");
    return `### Question ${questionIndex + 1}: ${record.stem}\n\nPrototype: \`${record.prototypeId}\`  \nAuthority: \`${record.provisionalAuthority}\`  \nBoundary policy: \`${record.metadata.boundaryPolicy}\`\n\n${options}\n\n${phases}\n\n#### Option analysis\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n**Shortcut:** ${record.editorial.examShortcut}\n\n**Traps**\n${record.editorial.commonTraps.map((trap) => `- ${trap}`).join("\n")}`;
  }).join("\n\n---\n\n");
  return `## Set ${groupIndex + 1} — ${first.topologyId} — Seed ${first.seed}\n\n### Passage\n${first.sharedPrompt}\n\nNegative constraints: ${first.metadata.negativeClueCount}  \nUnknown spouse boundaries: ${first.metadata.unknownSpouseBoundaryIds.join(", ") || "none"}  \nExplicitly unmarried: ${first.metadata.explicitUnmarriedIds.join(", ") || "none"}\n\n${questions}`;
}).join("\n\n---\n\n");

const markdown = `# BLR-CP-003 V9 Topology Gap Wave 02 Review\n\nThe V8 and V9 Wave 01 banks are approved only within their scoped staging boundaries. The 72 Wave 02 questions below are unapproved candidates. Permanent QLs remain 0.\n\n${markdownGroups}\n`;

const coverageMarkdown = `# BLR-CP-003 V9 Wave 02 Coverage Matrix\n\n| Dimension | Status | Evidence |\n|---|---|---|\n${coverageMatrix.map((entry) => `| ${entry.dimension} | ${entry.status} | ${entry.evidence} |`).join("\n")}\n\nStructural saturation remains open. Counts are discovery evidence, not completion quotas.\n`;

const htmlGroups = [...grouped.values()].map((group, groupIndex) => {
  const first = group[0]!;
  const questions = group.map((record, questionIndex) => {
    const options = record.options.map((option, index) =>
      `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option.text)}${option.isCorrect ? ' <span class="badge">Correct</span>' : ""}</li>`,
    ).join("");
    const phases = record.editorial.solutionPhases.map((phase) =>
      `<section class="phase"><h4>${escapeHtml(phase.title)}</h4><ul>${phase.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></section>`,
    ).join("");
    const analysis = record.editorial.optionAnalysis.map((entry) =>
      `<li class="${entry.isCorrect ? "correct" : ""}">${escapeHtml(entry.explanation)}</li>`,
    ).join("");
    return `<article class="question"><p class="id">${escapeHtml(record.itemId)} · ${escapeHtml(record.prototypeId)}</p><h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3><p class="contract">${escapeHtml(record.provisionalAuthority)} · ${escapeHtml(record.metadata.boundaryPolicy)}</p><ol>${options}</ol>${phases}${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}<section><h4>Option analysis</h4><ul>${analysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section><section class="shortcut"><h4>Exam shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section></article>`;
  }).join("");
  return `<section class="group"><header>Set ${groupIndex + 1} · ${escapeHtml(first.topologyId)} · Seed ${first.seed}</header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p><div class="evidence"><strong>Negative constraints:</strong> ${first.metadata.negativeClueCount} · <strong>Unknown spouse boundary:</strong> ${escapeHtml(first.metadata.unknownSpouseBoundaryIds.join(", ") || "none")} · <strong>Explicitly unmarried:</strong> ${escapeHtml(first.metadata.explicitUnmarriedIds.join(", ") || "none")}</div>${questions}</section>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V9 Wave 02</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{background:#fff;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px}.evidence,.contract{font-size:.85rem;color:#52525b}.question{border-top:2px solid #e4e4e7;padding:28px 0}.id{font-size:.78rem;color:#71717a;overflow-wrap:anywhere}.correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.phase{background:#f8fafc;border-left:4px solid #4f46e5;padding:10px 14px;margin:12px 0}.conclusion{background:#f0fdf4;padding:10px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px}.svg-family-tree{overflow:hidden;min-width:0;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;max-width:100%;height:auto;min-width:0}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}@media(max-width:640px){main{padding:10px}.summary,.group{padding:14px;border-radius:12px}.question{padding:20px 0}.svg-family-tree{padding:6px}.svg-tree-key{gap:8px;font-size:10px}}</style></head><body><main><h1>BLR-CP-003 — V9 Topology Gap Wave 02</h1><section class="summary"><p><strong>72 new candidates</strong> cover negative constraints, unresolved spouse boundaries and mixed in-law/generation tasks.</p><p class="warning"><strong>Human review is required.</strong> Structural saturation, permanent QLs, Question Studio and publication remain blocked.</p><p>Combined discovery evidence: <strong>298 candidates, 102 passage groups, 9 topologies and 29 prototypes</strong>.</p></section>${htmlGroups}</main></body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(path.join(outputDirectory, "blr-cp003-v9-wave02-candidates.jsonl"), `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-v9-wave02-candidates.csv"), `${csvHeader}\n${csvRows.join("\n")}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-v9-wave02-candidates.md"), markdown, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-v9-wave02-candidates.html"), html, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-v9-wave02-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
await writeFile(path.join(outputDirectory, "blr-cp003-v9-wave02-coverage-matrix.md"), coverageMarkdown, "utf8");

console.log(JSON.stringify(summary, null, 2));
