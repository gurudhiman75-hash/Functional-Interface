import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
  BLR_CP003_V8_FULL_BANK_SEEDS,
  blrCp003V8CandidateAuthorityCounts,
  generateBlrCp003LearnerEvidenceV8Candidates,
} from "./cp003-learner-evidence-v8-candidate";
import {
  BLR_CP003_V8_AUTHORITY_DISPOSITIONS,
  BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
} from "./cp003-v8-authenticity-authority-audit";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-learner-evidence-v8-candidate-output",
);
const records = generateBlrCp003LearnerEvidenceV8Candidates();
const authorityCounts = blrCp003V8CandidateAuthorityCounts(records);
type RecordType = (typeof records)[number];

const escapeHtml = (value: unknown): string =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const escapeCsv = (value: unknown): string => {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
};

const groups = new Map<string, RecordType[]>();
for (const record of records) {
  const key = `${record.scenarioId}::${record.seed}`;
  const group = groups.get(key) ?? [];
  group.push(record);
  groups.set(key, group);
}

const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const promptCount = new Set(records.map((record) => record.sharedPrompt)).size;
const payloadSizes = records.map((record) =>
  Buffer.byteLength(JSON.stringify(record.proceduralLogic), "utf8"),
);
const analysisPrefixes = new Set(
  records.flatMap((record) =>
    record.editorial.optionAnalysis.map((entry) =>
      entry.explanation.split(/[.:;]/, 1)[0]?.trim(),
    ),
  ),
);

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_LEARNER_EVIDENCE_V8_CANDIDATE_VERSION,
  authorityAuditVersion: BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
  status: "HUMAN_REVIEW_FULL_BANK_CANDIDATE_NOT_APPROVED",
  corpus: {
    candidateRecordCount: records.length,
    seedCount: BLR_CP003_V8_FULL_BANK_SEEDS.length,
    passageGroupCount: groups.size,
    uniquePromptCount: promptCount,
    retainedAuthorityCount: Object.keys(authorityCounts).length,
    authorityCounts,
    answerPositions,
  },
  authorityReclassification: {
    dispositions: BLR_CP003_V8_AUTHORITY_DISPOSITIONS,
    genderLabelAuthorityRecords: 0,
    maritalStatusLabelAuthorityRecords: 0,
  },
  authenticity: {
    disjointNonTopologicalPassages: records.filter(
      (record) =>
        record.metadata.passageAudit.clueOrderStrategy ===
          "DISJOINT_NON_TOPOLOGICAL" &&
        !record.metadata.passageAudit.stackedLinearChain,
    ).length,
    recordsWithAtLeastTwoIndirectAnchors: records.filter(
      (record) => record.metadata.passageAudit.indirectAnchorCount >= 2,
    ).length,
    phaseStructuredExplanations: records.filter(
      (record) => record.editorial.solutionPhases.length === 4,
    ).length,
    nameBasedOptionRecords: records.filter(
      (record) => record.metadata.nameBasedOptions,
    ).length,
    cannedDontFallForPhrases: records.filter((record) =>
      record.editorial.optionAnalysis.some((entry) =>
        /don't fall for option/i.test(entry.explanation),
      ),
    ).length,
    metaDistractorRecords: records.filter((record) =>
      record.options.some((option) =>
        /(?:the passage is contradictory|divorced|cannot be determined)/i.test(
          option.text,
        ),
      ),
    ).length,
    optionAnalysisPrefixVariety: analysisPrefixes.size,
  },
  visualRenderer: {
    primary: "native-inline-svg-v1",
    svgDiagramCount: records.length,
    asciiFallbackCount: records.filter((record) =>
      record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"),
    ).length,
    responsiveHtmlPolicy: "FIT_VIEWBOX_NO_FORCED_720PX_MIN_WIDTH",
    averagePayloadBytes: Math.round(
      payloadSizes.reduce((sum, size) => sum + size, 0) / payloadSizes.length,
    ),
    maximumPayloadBytes: Math.max(...payloadSizes),
  },
  review: {
    v7PreservedForTraceability: true,
    seniorAuditImplemented: true,
    fullBankTelemetrySatisfied: records.length >= 100 && groups.size >= 30,
    exhaustiveSolveModeFreezeProven: false,
    humanReviewRequired: true,
    humanReviewApproved: false,
  },
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
  summary.corpus.candidateRecordCount !== 130 ||
  summary.corpus.seedCount !== 26 ||
  summary.corpus.passageGroupCount !== 52 ||
  summary.corpus.uniquePromptCount !== 52 ||
  summary.corpus.retainedAuthorityCount !== 3 ||
  summary.corpus.authorityCounts.SELECT_UNORDERED_FAMILY_PAIR !== 52 ||
  summary.corpus.authorityCounts.IDENTIFY_ALL_MEMBERS_BY_RELATION !== 52 ||
  summary.corpus.authorityCounts.IDENTIFY_MEMBER_BY_MARITAL_STATUS !== 26 ||
  summary.corpus.answerPositions.join(",") !== "32,33,33,32" ||
  summary.authenticity.disjointNonTopologicalPassages !== records.length ||
  summary.authenticity.recordsWithAtLeastTwoIndirectAnchors !== records.length ||
  summary.authenticity.phaseStructuredExplanations !== records.length ||
  summary.authenticity.nameBasedOptionRecords !== records.length ||
  summary.authenticity.cannedDontFallForPhrases !== 0 ||
  summary.authenticity.metaDistractorRecords !== 0 ||
  summary.authenticity.optionAnalysisPrefixVariety < 8 ||
  summary.visualRenderer.svgDiagramCount !== records.length ||
  summary.visualRenderer.asciiFallbackCount !== records.length ||
  !summary.review.fullBankTelemetrySatisfied
) {
  throw new Error(`Unexpected BLR-CP-003 V8 inventory: ${JSON.stringify(summary)}.`);
}

const csvColumns = [
  "provisionalAuthority",
  "sourceAuthority",
  "scenarioId",
  "seed",
  "itemId",
  "sharedPrompt",
  "stem",
  "answerType",
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
  "examShortcut",
  "passageAudit",
  "fingerprint",
];
const csvRows = records.map((record) =>
  [
    record.provisionalAuthority,
    record.sourceAuthority,
    record.scenarioId,
    record.seed,
    record.itemId,
    record.sharedPrompt,
    record.stem,
    record.answerType,
    ...record.options.map((option) => option.text),
    record.correctIndex,
    record.options[record.correctIndex]?.text,
    record.evidencePaths,
    record.editorial.solutionPhases,
    record.editorial.optionAnalysis,
    record.editorial.conclusion,
    record.editorial.examShortcut,
    record.metadata.passageAudit,
    record.metadata.semanticFingerprint,
  ]
    .map(escapeCsv)
    .join(","),
);

const optionHtml = (record: RecordType): string =>
  record.options
    .map(
      (option, index) =>
        `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${escapeHtml(option.text)}${option.isCorrect ? ' <span class="badge">Correct</span>' : ""}</li>`,
    )
    .join("");

const phaseHtml = (record: RecordType): string =>
  record.editorial.solutionPhases
    .map(
      (phase) =>
        `<section class="phase"><h5>${escapeHtml(phase.title)}</h5><ul>${phase.points.map((point) => `<li>${escapeHtml(point)}</li>`).join("")}</ul></section>`,
    )
    .join("");

const dispositionRows = BLR_CP003_V8_AUTHORITY_DISPOSITIONS.map(
  (entry) =>
    `<tr><td><code>${escapeHtml(entry.authority)}</code></td><td>${escapeHtml(entry.decision)}</td><td><code>${escapeHtml(entry.targetAuthority)}</code></td><td>${escapeHtml(entry.rationale)}</td></tr>`,
).join("");

const htmlGroups = [...groups.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group
      .map((record, questionIndex) => {
        const analyses = record.editorial.optionAnalysis
          .map(
            (entry) =>
              `<li class="${entry.isCorrect ? "correct" : ""}">${escapeHtml(entry.explanation)}</li>`,
          )
          .join("");
        return `<article class="question"><p class="id">${escapeHtml(record.itemId)} · ${escapeHtml(record.provisionalAuthority)}</p><h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3><ol class="options">${optionHtml(record)}</ol><section><h4>Structured solution</h4><div class="phase-grid">${phaseHtml(record)}</div>${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}</section><section><h4>Option analysis</h4><ul>${analyses}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section><section class="shortcut"><h4>10-second shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section><section class="traps"><h4>Common traps</h4><ul>${record.editorial.commonTraps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section></article>`;
      })
      .join("");
    return `<section class="group"><header>Set ${groupIndex + 1} · Seed ${first.seed} · ${group.length} questions</header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${questions}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V8 Full-Bank Authenticity Review</title><style>*{box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{background:#fff;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px}.group>header{font-weight:800}.passage{line-height:1.75;background:#fafafa;border-left:4px solid #52525b;padding:14px}.question{border-top:2px solid #e4e4e7;padding:28px 0}.id{font-size:.78rem;color:#71717a}.correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.phase-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.phase{border:1px solid #dbeafe;background:#f8fafc;border-radius:12px;padding:12px}.phase h5{margin:0 0 8px;color:#3730a3}.conclusion{background:#f0fdf4;padding:10px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px}.traps{background:#fff7ed;border-left:4px solid #ea580c;padding:12px}.svg-family-tree{overflow:hidden;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;max-width:100%;min-width:0;height:auto}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}table{width:100%;border-collapse:collapse}th,td{border:1px solid #d4d4d8;padding:8px;text-align:left;vertical-align:top}@media(max-width:640px){main{padding:10px}.summary,.group{padding:14px;margin:12px 0}.phase-grid{grid-template-columns:1fr}.question{padding:20px 0}.svg-family-tree{padding:4px}.svg-tree-key{gap:8px;font-size:10px}.options{padding-left:24px}table{display:block;overflow-x:auto}}</style></head><body><main><h1>BLR-CP-003 — V8 Full-Bank Authenticity Review</h1><section class="summary"><p><strong>130 candidate questions</strong> across <strong>52 disjoint passage groups</strong> cover three retained provisional authorities.</p><p class="warning"><strong>Human approval is still required.</strong> This is not a discovery freeze, QL allocation, staging approval or publication authorization.</p><table><thead><tr><th>Source authority</th><th>Decision</th><th>Target</th><th>Reason</th></tr></thead><tbody>${dispositionRows}</tbody></table></section>${htmlGroups}</main></body></html>`;

const markdownGroups = [...groups.values()]
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
        return `### Question ${questionIndex + 1}: ${record.stem}\n\nAuthority: \`${record.provisionalAuthority}\`\n\n${options}\n\n${phases}\n\n#### Option Analysis\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n#### Shortcut\n${record.editorial.examShortcut}\n\n#### Traps\n${record.editorial.commonTraps.map((line) => `- ${line}`).join("\n")}`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1}\n\n### Passage\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");

const markdown = `# BLR-CP-003 V8 Full-Bank Authenticity Review\n\n130 candidate questions across 52 passage groups. Human approval remains pending. Permanent QLs: 0.\n\n## Authority Reclassification\n\n${BLR_CP003_V8_AUTHORITY_DISPOSITIONS.map((entry) => `- \`${entry.authority}\` → **${entry.decision}** → \`${entry.targetAuthority}\`: ${entry.rationale}`).join("\n")}\n\n${markdownGroups}\n`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-candidates.jsonl"),
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-candidates.csv"),
    `${csvColumns.join(",")}\n${csvRows.join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-candidates.html"),
    html,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-candidates.md"),
    markdown,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  ),
]);

console.log(JSON.stringify(summary, null, 2));
