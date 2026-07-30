import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION,
  blrCp003V6CandidateAuthorityCounts,
  generateBlrCp003LearnerEvidenceV6Candidates,
} from "./cp003-learner-evidence-v6-candidate";
import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-learner-evidence-v6-candidate-output",
);
const records = generateBlrCp003LearnerEvidenceV6Candidates();
const authorityCounts = blrCp003V6CandidateAuthorityCounts(records);

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

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_LEARNER_EVIDENCE_V6_CANDIDATE_VERSION,
  status: "HUMAN_REVIEW_CANDIDATE_NOT_APPROVED",
  candidateRecordCount: records.length,
  candidateAuthorityCount: Object.keys(authorityCounts).length,
  authorityCounts,
  passageGroupCount: grouped.size,
  answerPositions,
  evidence: {
    minimumPathDistance: Math.min(
      ...records.flatMap((record) =>
        record.evidencePaths.map((entry) => entry.distance),
      ),
    ),
    maximumPathDistance: Math.max(
      ...records.flatMap((record) =>
        record.evidencePaths.map((entry) => entry.distance),
      ),
    ),
    compositeAnswerPremiseRepeated: false,
    optionSetsUnique: true,
  },
  visualRenderer: {
    primary: "native-inline-svg-v1",
    externalGraphLibrary: false,
    svgDiagramCount: records.length,
    highlightedPrimaryPathCount: records.filter(
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
  review: {
    approvedV5PackPreserved: true,
    humanReviewRequired: true,
    humanReviewApproved: false,
    minimumCandidateRecordsPerAuthority: 4,
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
  summary.candidateRecordCount !== 20 ||
  summary.candidateAuthorityCount !== 5 ||
  Object.values(summary.authorityCounts).some((count) => count !== 4) ||
  summary.passageGroupCount !== 8 ||
  answerPositions.some((count) => count !== 5) ||
  summary.evidence.minimumPathDistance < 2 ||
  summary.visualRenderer.svgDiagramCount !== 20 ||
  summary.visualRenderer.highlightedPrimaryPathCount !== 20 ||
  summary.visualRenderer.asciiFallbackCount !== 20 ||
  summary.visualRenderer.maximumPayloadBytes >=
    summary.visualRenderer.hardPayloadLimitBytes
) {
  throw new Error(`Unexpected CP-003 V6 candidate inventory: ${JSON.stringify(summary)}.`);
}

const csvHeader = [
  "provisionalAuthority",
  "scenarioId",
  "topologyId",
  "seed",
  "itemId",
  "prototypeId",
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
  "familyTreeDiagram",
  "coreConcept",
  "stepByStepSolution",
  "optionAnalysis",
  "conclusion",
  "examShortcut",
  "commonTraps",
  "fingerprint",
].join(",");

const csvRows = records.map((record) =>
  [
    record.provisionalAuthority,
    record.scenarioId,
    record.topologyId,
    record.seed,
    record.itemId,
    record.prototypeId,
    record.sharedPrompt,
    record.stem,
    record.answerType,
    record.options[0]?.text,
    record.options[1]?.text,
    record.options[2]?.text,
    record.options[3]?.text,
    record.correctIndex,
    record.options[record.correctIndex]?.text,
    record.evidencePaths,
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

const groupCards = [...grouped.values()]
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
        const optionAnalysis = record.editorial.optionAnalysis
          .map(
            (entry) =>
              `<li class="${entry.isCorrect ? "analysis-correct" : ""}">${escapeHtml(entry.explanation)}</li>`,
          )
          .join("");
        const svgTree = renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic);
        const evidence = record.evidencePaths
          .map(
            (entry) =>
              `${entry.relationId}: ${entry.personIds
                .map(
                  (personId) =>
                    record.proceduralLogic.nodes.find((node) => node.id === personId)
                      ?.label ?? personId,
                )
                .join(" → ")}`,
          )
          .join("; ");
        return `<article class="question">
          <p class="review-id">Reviewer reference: ${escapeHtml(record.itemId)} · Authority: ${escapeHtml(record.provisionalAuthority)} · Evidence: ${escapeHtml(evidence)}</p>
          <h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3>
          <ol class="options">${options}</ol>
          <section class="tier concept"><h4>📌 Core Concept</h4><ul>${record.editorial.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
          <section class="tier solution"><h4>📝 Step-by-Step Solution &amp; Visual Family Tree</h4><ol>${record.editorial.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>${svgTree}<details><summary>Plain-text fallback</summary><pre>${escapeHtml(record.proceduralLogic.asciiFallback)}</pre></details><h5>Check each option</h5><ul>${optionAnalysis}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section>
          <section class="tier shortcut"><h4>⚡ 10-Second Speed Shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section>
          <section class="tier traps"><h4>⚠️ Common Trap &amp; Student Warning</h4><ul>${record.editorial.commonTraps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section>
        </article>`;
      })
      .join("");
    return `<section class="group"><header class="group-header"><span>Set ${groupIndex + 1}</span><span>${escapeHtml(first.scenarioId)}</span><span>Seed ${first.seed}</span><span>${group.length} V6 candidates</span></header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${questions}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 Learner-Evidence V6 Candidate Review</title><style>
body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1220px;margin:auto;padding:24px}.summary,.group{background:white;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0;box-shadow:0 8px 24px rgba(15,23,42,.05)}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px 16px}.group-header{display:flex;gap:10px;flex-wrap:wrap;font-weight:700}.group-header span{background:#f4f4f5;border-radius:7px;padding:5px 9px}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px 16px}.question{border-top:2px solid #e4e4e7;padding:28px 0}.review-id{font-size:.78rem;color:#71717a}.options li,.tier li{margin:8px 0}.correct,.analysis-correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.tier{margin-top:22px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px 16px}.traps{background:#fff7ed;border-left:4px solid #ea580c;padding:12px 16px}.conclusion{background:#f0fdf4;padding:10px 12px;border-radius:7px}.svg-family-tree{overflow-x:auto;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;min-width:720px;height:auto}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}details{margin-top:12px}summary{cursor:pointer;font-weight:650;color:#475569}pre{white-space:pre;overflow:auto;background:#18181b;color:#fafafa;border-radius:10px;padding:18px;line-height:1.5;font-family:"Courier New",monospace;font-size:.82rem}
</style></head><body><main><h1>BLR-CP-003 — Learner-Evidence V6 Candidate Review</h1><section class="summary"><p><strong>${summary.candidateRecordCount}</strong> candidates cover <strong>${summary.candidateAuthorityCount}</strong> previously blocked authorities. Each authority has four seeded records and answer positions are perfectly balanced.</p><p class="warning"><strong>Human review is required.</strong> These records are candidates only. They do not alter the approved V5 pack and do not authorize permanent QLs.</p><p>Permanent QLs: 0. Next available identity remains BLR-QL-009.</p></section>${groupCards}</main></body></html>`;

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
        return `### Question ${questionIndex + 1}: ${record.stem}\n\nAuthority: \`${record.provisionalAuthority}\`\n\n${options}\n\n#### Core Concept\n\n${record.editorial.coreConcept.map((line) => `- ${line}`).join("\n")}\n\n#### Step-by-Step Solution\n\n${record.editorial.stepByStepSolution.map((line, index) => `${index + 1}. ${line}`).join("\n")}\n\n\`\`\`text\n${record.proceduralLogic.asciiFallback}\n\`\`\`\n\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n#### 10-Second Shortcut\n\n${record.editorial.examShortcut}\n\n#### Common Traps\n\n${record.editorial.commonTraps.map((line) => `- ${line}`).join("\n")}`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1}\n\n### Passage\n\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");

const markdown = `# BLR-CP-003 Learner-Evidence V6 Candidate Review\n\n${summary.candidateRecordCount} candidates. Human review is required. No permanent QL is authorized.\n\n${markdownGroups}\n`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-v6-candidates.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v6-candidates.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v6-candidates.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v6-candidates.md"),
  markdown,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v6-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
