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

const out = path.resolve(
  process.argv[2] ?? "blr-cp003-v9-topology-gap-wave-02-output",
);
const v8 = generateBlrCp003V8EditorialBaselineApprovedRecords();
const wave01 = generateBlrCp003V9Wave01StructuralStagingApprovedRecords();
const records = generateBlrCp003V9TopologyGapWave02Candidates();
const combined = [...v8, ...wave01, ...records];

function htmlEscape(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvEscape(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function counts(values: readonly string[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const value of values) result[value] = (result[value] ?? 0) + 1;
  return result;
}

const groups = new Map<string, (typeof records)[number][]>();
for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  const group = groups.get(key) ?? [];
  group.push(record);
  groups.set(key, group);
}

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const combinedAnswerPositions = [0, 1, 2, 3].map(
  (position) => combined.filter((record) => record.correctIndex === position).length,
);
const topologyCounts = counts(records.map((record) => record.topologyId));
const prototypeCounts = counts(records.map((record) => record.prototypeId));
const authorityCounts = counts(records.map((record) => record.provisionalAuthority));
const combinedGroups = new Set(
  combined.map((record) => `${record.scenarioId}::${record.seed}`),
);
const combinedTopologies = new Set(combined.map((record) => record.topologyId));
const combinedPrototypes = new Set(combined.map((record) => record.prototypeId));

const coverageMatrix = [
  ["Negative and exclusion-heavy clues", "NEWLY_COVERED", "18 groups with at least four negative constraints"],
  ["Unknown spouse boundaries", "NEWLY_COVERED", "two single-parent/unknown-status graph families"],
  ["Unmarried versus unresolved status", "NEWLY_COVERED", "12 records for each evidence state"],
  ["Mixed in-law and generation tasks", "NEWLY_COVERED", "mother-in-law/daughter and brother-in-law/nephew pairs"],
  ["Blood and spouse paths to the same relation", "NEWLY_COVERED", "two-nephew branch set"],
  ["Unresolved-status authority decision", "OPEN_AUDIT", "one provisional split candidate; no QL"],
  ["Combined repetition and difficulty", "OPEN", "chapter-wide audit over 298 candidates"],
  ["Cross-checkpoint merge/split", "OPEN", "compare against BLR-QL-001 through BLR-QL-008"],
  ["Structural saturation", "OPEN", "nine topologies and twenty-nine prototypes are not a quota"],
] as const;

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_V9_TOPOLOGY_GAP_WAVE_02_VERSION,
  status: "HUMAN_REVIEW_NEGATIVE_BOUNDARY_GAP_WAVE_PENDING",
  approvedBaseline: {
    v8Records: v8.length,
    v9Wave01Records: wave01.length,
    approvedRecords: v8.length + wave01.length,
  },
  wave02: {
    candidateRecords: records.length,
    passageGroups: groups.size,
    topologyCount: Object.keys(topologyCounts).length,
    topologyCounts,
    prototypeCount: Object.keys(prototypeCounts).length,
    prototypeCounts,
    authorityCounts,
    answerPositions,
    unknownStatusRecords:
      authorityCounts.IDENTIFY_MEMBER_WITH_UNRESOLVED_MARITAL_STATUS ?? 0,
    explicitStatusRecords:
      authorityCounts.IDENTIFY_MEMBER_BY_MARITAL_STATUS ?? 0,
    mixedRelationRecords: records.filter(
      (record) => record.metadata.mixedRelationContract,
    ).length,
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
) {
  throw new Error(`Unexpected V9 Wave 02 inventory: ${JSON.stringify(summary)}.`);
}

const csvColumns = [
  "topologyId", "scenarioId", "seed", "prototypeId", "provisionalAuthority",
  "itemId", "sharedPrompt", "stem", "optionA", "optionB", "optionC",
  "optionD", "correctIndex", "correctAnswer", "negativeClueCount",
  "boundaryPolicy", "unknownSpouseBoundaryIds", "explicitUnmarriedIds",
  "mixedRelationContract", "evidencePaths", "solutionPhases",
  "optionAnalysis", "conclusion", "semanticFingerprint",
] as const;
const csvRows = records.map((record) => {
  const row: Record<(typeof csvColumns)[number], unknown> = {
    topologyId: record.topologyId,
    scenarioId: record.scenarioId,
    seed: record.seed,
    prototypeId: record.prototypeId,
    provisionalAuthority: record.provisionalAuthority,
    itemId: record.itemId,
    sharedPrompt: record.sharedPrompt,
    stem: record.stem,
    optionA: record.options[0]?.text,
    optionB: record.options[1]?.text,
    optionC: record.options[2]?.text,
    optionD: record.options[3]?.text,
    correctIndex: record.correctIndex,
    correctAnswer: record.options[record.correctIndex]?.text,
    negativeClueCount: record.metadata.negativeClueCount,
    boundaryPolicy: record.metadata.boundaryPolicy,
    unknownSpouseBoundaryIds: record.metadata.unknownSpouseBoundaryIds,
    explicitUnmarriedIds: record.metadata.explicitUnmarriedIds,
    mixedRelationContract: record.metadata.mixedRelationContract,
    evidencePaths: record.evidencePaths,
    solutionPhases: record.editorial.solutionPhases,
    optionAnalysis: record.editorial.optionAnalysis,
    conclusion: record.editorial.conclusion,
    semanticFingerprint: record.metadata.semanticFingerprint,
  };
  return csvColumns.map((column) => csvEscape(row[column])).join(",");
});

const markdown = [...groups.values()].map((group, groupIndex) => {
  const first = group[0]!;
  const questions = group.map((record, questionIndex) => {
    const options = record.options.map((option, index) =>
      `${String.fromCharCode(65 + index)}. ${option.text}${option.isCorrect ? " ✅" : ""}`,
    ).join("\n");
    const phases = record.editorial.solutionPhases.map((phase) =>
      `#### ${phase.title}\n${phase.points.map((point) => `- ${point}`).join("\n")}`,
    ).join("\n\n");
    return `### Question ${questionIndex + 1}: ${record.stem}\n\n${options}\n\n${phases}\n\n**${record.editorial.conclusion}**\n\n**Shortcut:** ${record.editorial.examShortcut}`;
  }).join("\n\n---\n\n");
  return `## Set ${groupIndex + 1} — ${first.topologyId} — Seed ${first.seed}\n\n### Passage\n${first.sharedPrompt}\n\nBoundary policy: \`${first.metadata.boundaryPolicy}\`  \nUnknown spouse IDs: ${first.metadata.unknownSpouseBoundaryIds.join(", ") || "none"}  \nExplicitly unmarried IDs: ${first.metadata.explicitUnmarriedIds.join(", ") || "none"}\n\n${questions}`;
}).join("\n\n---\n\n");

const htmlGroups = [...groups.values()].map((group, groupIndex) => {
  const first = group[0]!;
  const questions = group.map((record, questionIndex) => {
    const options = record.options.map((option, index) =>
      `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${htmlEscape(option.text)}${option.isCorrect ? ' <span class="badge">Correct</span>' : ""}</li>`,
    ).join("");
    const phases = record.editorial.solutionPhases.map((phase) =>
      `<section class="phase"><h4>${htmlEscape(phase.title)}</h4><ul>${phase.points.map((point) => `<li>${htmlEscape(point)}</li>`).join("")}</ul></section>`,
    ).join("");
    return `<article class="question"><p class="id">${htmlEscape(record.itemId)}</p><h3>Question ${questionIndex + 1}: ${htmlEscape(record.stem)}</h3><ol>${options}</ol>${phases}${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}<p class="conclusion"><strong>${htmlEscape(record.editorial.conclusion)}</strong></p><section class="shortcut"><h4>Exam shortcut</h4><p>${htmlEscape(record.editorial.examShortcut)}</p></section></article>`;
  }).join("");
  return `<section class="group"><header>Set ${groupIndex + 1} · ${htmlEscape(first.topologyId)} · Seed ${first.seed}</header><h2>Passage</h2><p class="passage">${htmlEscape(first.sharedPrompt).replaceAll("\n", "<br>")}</p><p class="boundary">${htmlEscape(first.metadata.boundaryPolicy)}</p>${questions}</section>`;
}).join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V9 Wave 02</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{background:#fff;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px}.boundary,.id{font-size:.8rem;color:#71717a;overflow-wrap:anywhere}.question{border-top:2px solid #e4e4e7;padding:28px 0}.correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.phase{background:#f8fafc;border-left:4px solid #4f46e5;padding:10px 14px;margin:12px 0}.conclusion{background:#f0fdf4;padding:10px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px}.svg-family-tree{overflow:hidden;min-width:0;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;max-width:100%;height:auto;min-width:0}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}@media(max-width:640px){main{padding:10px}.summary,.group{padding:14px;border-radius:12px}.question{padding:20px 0}.svg-family-tree{padding:6px}.svg-tree-key{gap:8px;font-size:10px}}</style></head><body><main><h1>BLR-CP-003 — V9 Topology Gap Wave 02</h1><section class="summary"><p><strong>72 candidates</strong> cover negative constraints, unresolved spouse boundaries and mixed in-law/generation tasks.</p><p class="warning"><strong>Human review required.</strong> Structural saturation, permanent QLs and release remain blocked.</p><p>Combined evidence: <strong>298 candidates, 102 groups, 9 topologies and 29 prototypes</strong>.</p></section>${htmlGroups}</main></body></html>`;

const coverageMarkdown = `# BLR-CP-003 V9 Wave 02 Coverage Matrix\n\n| Dimension | Status | Evidence |\n|---|---|---|\n${coverageMatrix.map(([dimension, status, evidence]) => `| ${dimension} | ${status} | ${evidence} |`).join("\n")}\n\nStructural saturation remains open.\n`;

await mkdir(out, { recursive: true });
await writeFile(path.join(out, "blr-cp003-v9-wave02-summary.json"), `${JSON.stringify(summary, null, 2)}\n`, "utf8");
await writeFile(path.join(out, "blr-cp003-v9-wave02-candidates.jsonl"), `${records.map((record) => JSON.stringify(record)).join("\n")}\n`, "utf8");
await writeFile(path.join(out, "blr-cp003-v9-wave02-candidates.csv"), `${csvColumns.join(",")}\n${csvRows.join("\n")}\n`, "utf8");
await writeFile(path.join(out, "blr-cp003-v9-wave02-candidates.md"), `# BLR-CP-003 V9 Wave 02 Review\n\n${markdown}\n`, "utf8");
await writeFile(path.join(out, "blr-cp003-v9-wave02-candidates.html"), html, "utf8");
await writeFile(path.join(out, "blr-cp003-v9-wave02-coverage-matrix.md"), coverageMarkdown, "utf8");

console.log(JSON.stringify(summary, null, 2));
