import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import { generateBlrCp003V8EditorialBaselineApprovedRecords } from "./cp003-v8-editorial-baseline-approved";
import {
  BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  BLR_CP003_V9_WAVE_01_TOPOLOGIES,
  blrCp003V9Wave01AuthorityCounts,
  blrCp003V9Wave01PrototypeIds,
  blrCp003V9Wave01TopologyCounts,
  generateBlrCp003V9TopologyGapWave01Candidates,
} from "./cp003-v9-topology-gap-wave-01";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-v9-topology-gap-wave-01-output",
);
const baseline = generateBlrCp003V8EditorialBaselineApprovedRecords();
const records = generateBlrCp003V9TopologyGapWave01Candidates();
const authorityCounts = blrCp003V9Wave01AuthorityCounts(records);
const topologyCounts = blrCp003V9Wave01TopologyCounts(records);
const prototypeIds = blrCp003V9Wave01PrototypeIds(records);

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

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const combinedAnswerPositions = [0, 1, 2, 3].map(
  (position) =>
    [...baseline, ...records].filter((record) => record.correctIndex === position)
      .length,
);
const combinedTopologies = new Set([
  ...baseline.map((record) => record.topologyId),
  ...records.map((record) => record.topologyId),
]);
const combinedPrototypes = new Set([
  ...baseline.map((record) => record.prototypeId),
  ...records.map((record) => record.prototypeId),
]);
const combinedGroups = new Set([
  ...baseline.map((record) => `${record.scenarioId}::${record.seed}`),
  ...records.map((record) => `${record.scenarioId}::${record.seed}`),
]);

const coverageMatrix = [
  {
    dimension: "Multi-married sibling branches and three children-in-law",
    status: "NEWLY_COVERED",
    evidence: "MULTI_MARRIED_SIBLING_IN_LAW",
  },
  {
    dimension: "Maternal and paternal branches in one shared graph",
    status: "NEWLY_COVERED",
    evidence: "MATERNAL_PATERNAL_DUAL_BRANCH",
  },
  {
    dimension: "Four displayed generations and deep exact lineage",
    status: "NEWLY_COVERED",
    evidence: "FOUR_GENERATION_ASYMMETRIC_LINEAGE",
  },
  {
    dimension: "Unequal cousin branch cardinality",
    status: "NEWLY_COVERED",
    evidence: "UNEQUAL_COUSIN_BRANCHES",
  },
  {
    dimension: "Spouse-sibling in-law pair",
    status: "NEWLY_COVERED",
    evidence: "BLR-CP003-PROT-V9-BROTHER-IN-LAW-PAIR",
  },
  {
    dimension: "Complete sets with three or four qualifying members",
    status: "NEWLY_COVERED",
    evidence: "children-in-law and grandparent sets",
  },
  {
    dimension: "Reference-based composite pair with two conditions",
    status: "NEWLY_COVERED",
    evidence: "BLR-CP003-PROT-V9-COMPOSITE-REFERENCE-PAIR",
  },
  {
    dimension: "Negative and exclusion-heavy passage constraints",
    status: "OPEN",
    evidence: "requires a future gap wave",
  },
  {
    dimension: "Unknown or deliberately unstated spouse boundary",
    status: "OPEN",
    evidence: "must not infer marital status from absence",
  },
  {
    dimension: "Structural saturation",
    status: "OPEN",
    evidence: "six total topologies and seventeen total prototypes are not a quota",
  },
] as const;

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_01_VERSION,
  status: "HUMAN_REVIEW_STRUCTURAL_GAP_WAVE_PENDING",
  approvedBaseline: {
    version: "BLR_CP003_V8_EDITORIAL_BASELINE_APPROVAL_V1",
    approvalScope: "EDITORIAL_STAGING_ONLY",
    records: baseline.length,
    humanEditorialBaselineApproved: true,
    structuralSaturationApproved: false,
  },
  wave01: {
    candidateRecords: records.length,
    passageGroups: grouped.size,
    topologyCount: BLR_CP003_V9_WAVE_01_TOPOLOGIES.length,
    topologyCounts,
    prototypeCount: prototypeIds.length,
    prototypeIds,
    authorityCounts,
    answerPositions,
    nativeSvgDiagrams: records.length,
    asciiFallbacks: records.length,
    humanReviewApproved: false,
  },
  combinedCandidateBank: {
    records: baseline.length + records.length,
    passageGroups: combinedGroups.size,
    topologyCount: combinedTopologies.size,
    prototypeCount: combinedPrototypes.size,
    answerPositions: combinedAnswerPositions,
  },
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
  summary.approvedBaseline.records !== 130 ||
  summary.wave01.candidateRecords !== 96 ||
  summary.wave01.passageGroups !== 32 ||
  summary.wave01.topologyCount !== 4 ||
  summary.wave01.prototypeCount !== 12 ||
  summary.combinedCandidateBank.records !== 226 ||
  summary.combinedCandidateBank.passageGroups !== 84 ||
  summary.combinedCandidateBank.topologyCount !== 6 ||
  summary.combinedCandidateBank.prototypeCount !== 17 ||
  answerPositions.some((count) => count !== 24) ||
  summary.release.permanentQlCount !== 0 ||
  summary.release.finalDiscoveryFreezeAllowed
) {
  throw new Error(`Unexpected V9 topology gap-wave inventory: ${JSON.stringify(summary)}.`);
}

const csvHeader = [
  "topologyId",
  "scenarioId",
  "seed",
  "prototypeId",
  "prototypeFamily",
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
  "evidencePaths",
  "solutionPhases",
  "optionAnalysis",
  "conclusion",
  "semanticFingerprint",
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
    record.evidencePaths,
    record.editorial.solutionPhases,
    record.editorial.optionAnalysis,
    record.editorial.conclusion,
    record.metadata.semanticFingerprint,
  ]
    .map(escapeCsv)
    .join(","),
);

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
        const phases = record.editorial.solutionPhases
          .map(
            (phase) =>
              `#### ${phase.title}\n${phase.points.map((point) => `- ${point}`).join("\n")}`,
          )
          .join("\n\n");
        return `### Question ${questionIndex + 1}: ${record.stem}\n\nPrototype: \`${record.prototypeId}\`  \nAuthority: \`${record.provisionalAuthority}\`\n\n${options}\n\n${phases}\n\n#### Option analysis\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n**Shortcut:** ${record.editorial.examShortcut}\n\n**Traps**\n${record.editorial.commonTraps.map((trap) => `- ${trap}`).join("\n")}`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1} — ${first.topologyId} — Seed ${first.seed}\n\n### Passage\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");

const coverageMarkdown = `# BLR-CP-003 V9 Structural Coverage Matrix\n\n| Dimension | Status | Evidence |\n|---|---|---|\n${coverageMatrix.map((entry) => `| ${entry.dimension} | ${entry.status} | ${entry.evidence} |`).join("\n")}\n\nStructural saturation remains open. Counts are evidence, not completion quotas.\n`;

const markdown = `# BLR-CP-003 V9 Topology Gap Wave 01 Review\n\nThe 130-record V8 editorial baseline is approved for editorial staging only. The 96 questions below are new structural candidates and remain unapproved. Permanent QLs: 0.\n\n${markdownGroups}\n`;

const htmlGroups = [...grouped.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group
      .map((record, questionIndex) => {
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
        return `<article class="question"><p class="id">${escapeHtml(record.itemId)} · ${escapeHtml(record.prototypeId)}</p><h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3><ol>${options}</ol>${phases}${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}<section><h4>Option analysis</h4><ul>${analysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section><section class="shortcut"><h4>Exam shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section></article>`;
      })
      .join("");
    return `<section class="group"><header>Set ${groupIndex + 1} · ${escapeHtml(first.topologyId)} · Seed ${first.seed}</header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${questions}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V9 Topology Gap Wave 01</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{background:#fff;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px}.question{border-top:2px solid #e4e4e7;padding:28px 0}.id{font-size:.78rem;color:#71717a;overflow-wrap:anywhere}.correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.phase{background:#f8fafc;border-left:4px solid #4f46e5;padding:10px 14px;margin:12px 0}.conclusion{background:#f0fdf4;padding:10px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px}.svg-family-tree{overflow:hidden;min-width:0;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;max-width:100%;height:auto;min-width:0}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}@media(max-width:640px){main{padding:10px}.summary,.group{padding:14px;border-radius:12px}.question{padding:20px 0}.svg-family-tree{padding:6px}.svg-tree-key{gap:8px;font-size:10px}}</style></head><body><main><h1>BLR-CP-003 — V9 Topology Gap Wave 01</h1><section class="summary"><p><strong>96 new questions</strong> cover four new graph topologies and twelve new prototypes. The approved V8 baseline remains immutable.</p><p class="warning"><strong>Human review is required for this wave.</strong> Structural saturation, QL allocation, Question Studio and publication remain blocked.</p><p>Combined evidence inventory: <strong>226 candidates, 84 passage groups, 6 topologies and 17 prototypes</strong>.</p></section>${htmlGroups}</main></body></html>`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-candidates.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-candidates.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-candidates.md"),
  markdown,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-candidates.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-wave01-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v9-structural-coverage-matrix.md"),
  coverageMarkdown,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
