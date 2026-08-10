import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
  generateBlrCp003LearnerEvidenceV8ReviewedCandidates,
} from "./cp003-learner-evidence-v8-reviewed";
import {
  BLR_CP003_V8_AUTHORITY_DISPOSITIONS,
  BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
} from "./cp003-v8-authenticity-authority-audit";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-v8-reviewed-output",
);
const records = generateBlrCp003LearnerEvidenceV8ReviewedCandidates();
type RecordType = (typeof records)[number];

const htmlEscape = (value: unknown): string =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const csvEscape = (value: unknown): string => {
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
const topologies = new Set(records.map((record) => record.topologyId));
const prototypes = new Set(records.map((record) => record.prototypeId));
const answerPositions = [0, 1, 2, 3].map(
  (position) => records.filter((record) => record.correctIndex === position).length,
);
const pairGrammarDefects = records.filter((record) =>
  /\b[A-Z][a-z]+ and [A-Z][a-z]+ is the only (?:pair|cousin pair)\b/.test(
    record.editorial.stepByStepSolution.join(" "),
  ),
).length;

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  editorialVersion: BLR_CP003_V8_REVIEWED_EDITORIAL_VERSION,
  authorityAuditVersion: BLR_CP003_V8_AUTHORITY_AUDIT_VERSION,
  status: "HUMAN_REVIEW_EXPANDED_BANK_CANDIDATE_NOT_APPROVED",
  corpus: {
    candidateRecordCount: records.length,
    passageGroupCount: groups.size,
    uniqueTopologyCount: topologies.size,
    uniqueQuestionPrototypeCount: prototypes.size,
    answerPositions,
  },
  editorial: {
    pairGrammarDefects,
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
    unstackedPassageRecords: records.filter(
      (record) => !record.metadata.passageAudit.stackedLinearChain,
    ).length,
    phaseStructuredRecords: records.filter(
      (record) => record.editorial.solutionPhases.length === 4,
    ).length,
  },
  authorityReclassification: BLR_CP003_V8_AUTHORITY_DISPOSITIONS,
  review: {
    telemetryTargetSatisfied: records.length >= 100 && groups.size >= 30,
    structuralSaturationProven: false,
    reasonStructuralSaturationIsOpen:
      "The expanded bank currently uses two graph topologies and five question prototypes; seeded name and clue-order variation is not equivalent to exhaustive structural coverage.",
    humanReviewRequired: true,
    humanReviewApproved: false,
  },
  visualRenderer: {
    svgDiagramCount: records.length,
    asciiFallbackCount: records.filter((record) =>
      record.proceduralLogic.asciiFallback.includes("VISUAL FAMILY TREE GRID"),
    ).length,
    responsiveHtmlPolicy: "FIT_VIEWBOX_NO_FORCED_MINIMUM_WIDTH",
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
  summary.corpus.passageGroupCount !== 52 ||
  summary.corpus.uniqueTopologyCount !== 2 ||
  summary.corpus.uniqueQuestionPrototypeCount !== 5 ||
  summary.corpus.answerPositions.join(",") !== "32,33,33,32" ||
  summary.editorial.pairGrammarDefects !== 0 ||
  summary.editorial.cannedDontFallForPhrases !== 0 ||
  summary.editorial.metaDistractorRecords !== 0 ||
  summary.editorial.unstackedPassageRecords !== 130 ||
  summary.editorial.phaseStructuredRecords !== 130 ||
  summary.visualRenderer.svgDiagramCount !== 130 ||
  summary.visualRenderer.asciiFallbackCount !== 130 ||
  !summary.review.telemetryTargetSatisfied ||
  summary.review.structuralSaturationProven
) {
  throw new Error(`Unexpected V8 reviewed inventory: ${JSON.stringify(summary)}.`);
}

const csvHeader = [
  "authority",
  "topologyId",
  "prototypeId",
  "scenarioId",
  "seed",
  "itemId",
  "sharedPrompt",
  "stem",
  "options",
  "correctIndex",
  "solutionPhases",
  "optionAnalysis",
  "fingerprint",
].join(",");
const csvRows = records.map((record) =>
  [
    record.provisionalAuthority,
    record.topologyId,
    record.prototypeId,
    record.scenarioId,
    record.seed,
    record.itemId,
    record.sharedPrompt,
    record.stem,
    record.options.map((option) => option.text),
    record.correctIndex,
    record.editorial.solutionPhases,
    record.editorial.optionAnalysis,
    record.metadata.semanticFingerprint,
  ]
    .map(csvEscape)
    .join(","),
);

const optionList = (record: RecordType): string =>
  record.options
    .map(
      (option, index) =>
        `<li class="${option.isCorrect ? "correct" : ""}"><strong>${String.fromCharCode(65 + index)}.</strong> ${htmlEscape(option.text)}${option.isCorrect ? ' <span class="badge">Correct</span>' : ""}</li>`,
    )
    .join("");
const phaseCards = (record: RecordType): string =>
  record.editorial.solutionPhases
    .map(
      (phase) =>
        `<section class="phase"><h5>${htmlEscape(phase.title)}</h5><ul>${phase.points.map((point) => `<li>${htmlEscape(point)}</li>`).join("")}</ul></section>`,
    )
    .join("");

const htmlGroups = [...groups.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group
      .map((record, index) => {
        const analyses = record.editorial.optionAnalysis
          .map(
            (entry) =>
              `<li class="${entry.isCorrect ? "correct" : ""}">${htmlEscape(entry.explanation)}</li>`,
          )
          .join("");
        return `<article class="question"><p class="id">${htmlEscape(record.itemId)} · ${htmlEscape(record.prototypeId)}</p><h3>Question ${index + 1}: ${htmlEscape(record.stem)}</h3><ol>${optionList(record)}</ol><div class="phase-grid">${phaseCards(record)}</div>${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}<h4>Option analysis</h4><ul>${analyses}</ul><p class="conclusion"><strong>${htmlEscape(record.editorial.conclusion)}</strong></p><section class="shortcut"><h4>Shortcut</h4><p>${htmlEscape(record.editorial.examShortcut)}</p></section></article>`;
      })
      .join("");
    return `<section class="group"><header>Set ${groupIndex + 1} · ${htmlEscape(first.topologyId)} · Seed ${first.seed}</header><h2>Passage</h2><p class="passage">${htmlEscape(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${questions}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V8 Reviewed Candidate</title><style>*{box-sizing:border-box}body{margin:0;background:#f4f4f5;color:#18181b;font-family:system-ui,-apple-system,sans-serif}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{margin:22px 0;padding:24px;border:1px solid #d4d4d8;border-radius:16px;background:#fff}.warning{padding:14px;border-left:5px solid #ea580c;background:#fff7ed}.passage{padding:14px;border-left:4px solid #52525b;background:#fafafa;line-height:1.75}.question{padding:28px 0;border-top:2px solid #e4e4e7}.id{font-size:.78rem;color:#71717a}.correct{font-weight:750}.badge{padding:2px 7px;border-radius:999px;background:#dcfce7;font-size:.75rem}.phase-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.phase{padding:12px;border:1px solid #dbeafe;border-radius:12px;background:#f8fafc}.phase h5{margin:0 0 8px;color:#3730a3}.conclusion{padding:10px;background:#f0fdf4}.shortcut{padding:12px;border-left:4px solid #ca8a04;background:#fefce8}.svg-family-tree{overflow:hidden;margin:18px 0;padding:14px;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff)}.svg-family-tree svg{display:block;width:100%;max-width:100%;min-width:0;height:auto}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;padding:10px 8px 2px;border-top:1px solid #dbeafe;color:#475569;font-size:12px}@media(max-width:640px){main{padding:10px}.summary,.group{margin:12px 0;padding:14px}.phase-grid{grid-template-columns:1fr}.svg-family-tree{padding:4px}}</style></head><body><main><h1>BLR-CP-003 — V8 Reviewed Expanded Candidate Bank</h1><section class="summary"><p><strong>130 questions</strong> across <strong>52 seeded passage groups</strong>.</p><p class="warning"><strong>Not staging-ready.</strong> The package passes the senior-audit remediation contracts, but it contains only two graph topologies and five question prototypes. Structural saturation and human approval remain open.</p></section>${htmlGroups}</main></body></html>`;

const markdownGroups = [...groups.values()]
  .map((group, groupIndex) => {
    const first = group[0]!;
    const questions = group
      .map((record, index) => {
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
        return `### Question ${index + 1}: ${record.stem}\n\n${options}\n\n${phases}\n\n#### Option Analysis\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1} — ${first.topologyId}\n\n### Passage\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");
const markdown = `# BLR-CP-003 V8 Reviewed Expanded Candidate Bank\n\n130 questions across 52 seeded passage groups. Only two graph topologies and five question prototypes are currently represented; structural saturation and human approval remain open.\n\n${markdownGroups}\n`;

await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-reviewed-candidates.jsonl"),
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-reviewed-candidates.csv"),
    `${csvHeader}\n${csvRows.join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-reviewed-candidates.html"),
    html,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-reviewed-candidates.md"),
    markdown,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp003-v8-reviewed-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  ),
]);

console.log(JSON.stringify(summary, null, 2));
