import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { renderBlrCp003SvgFamilyTreeMarkup } from "./cp003-svg-family-tree";
import {
  BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
  blrCp003V7CandidateAuthorityCounts,
  blrCp003V7VisualPairs,
  generateBlrCp003LearnerEvidenceV7Candidates,
} from "./cp003-learner-evidence-v7-candidate";

const outputDirectory = path.resolve(
  process.argv[2] ?? "blr-cp003-learner-evidence-v7-candidate-output",
);
const records = generateBlrCp003LearnerEvidenceV7Candidates();
const authorityCounts = blrCp003V7CandidateAuthorityCounts(records);

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

function pairKey(left: string, right: string): string {
  return [left, right].sort().join("::");
}

function visualEvidenceComplete(
  record: (typeof records)[number],
): boolean {
  const highlightedPairs = blrCp003V7VisualPairs(record);
  const highlightedNodes = new Set(
    record.proceduralLogic.query?.pathPersonIds ?? [],
  );
  return record.evidencePaths.every(
    (evidencePath) =>
      evidencePath.personIds.every((personId) => highlightedNodes.has(personId)) &&
      evidencePath.personIds
        .slice(0, -1)
        .every((personId, index) =>
          highlightedPairs.has(
            pairKey(personId, evidencePath.personIds[index + 1]!),
          ),
        ),
  );
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
const payloadSizes = records.map((record) =>
  Buffer.byteLength(JSON.stringify(record.proceduralLogic), "utf8"),
);

const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-003",
  version: BLR_CP003_LEARNER_EVIDENCE_V7_CANDIDATE_VERSION,
  status: "HUMAN_REVIEW_CANDIDATE_REMEDIATED_NOT_APPROVED",
  candidateRecordCount: records.length,
  candidateAuthorityCount: Object.keys(authorityCounts).length,
  authorityCounts,
  passageGroupCount: grouped.size,
  answerPositions,
  remediation: {
    genderTautologyCorrections: records.filter(
      (record) => record.provisionalAuthority === "DETERMINE_MEMBER_GENDER",
    ).length,
    learnerWordingCorrections: records.filter(
      (record) => record.provisionalAuthority === "SELECT_UNORDERED_FAMILY_PAIR",
    ).length,
    completeSetVisualCorrections: records.filter(
      (record) => record.provisionalAuthority === "IDENTIFY_ALL_MEMBERS_BY_RELATION",
    ).length,
    visualEvidenceCompleteCount: records.filter(visualEvidenceComplete).length,
  },
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
    multiPathRecordCount: records.filter(
      (record) => record.evidencePaths.length > 1,
    ).length,
  },
  visualRenderer: {
    primary: "native-inline-svg-v1",
    svgDiagramCount: records.length,
    completeHighlightedEvidenceCount: records.filter(visualEvidenceComplete).length,
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
    sourceV6PackPreserved: true,
    v6EditorialFindingsImplemented: true,
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
  summary.candidateRecordCount !== 20 ||
  summary.candidateAuthorityCount !== 5 ||
  Object.values(summary.authorityCounts).some((count) => count !== 4) ||
  summary.passageGroupCount !== 8 ||
  answerPositions.some((count) => count !== 5) ||
  summary.remediation.genderTautologyCorrections !== 4 ||
  summary.remediation.learnerWordingCorrections !== 4 ||
  summary.remediation.completeSetVisualCorrections !== 4 ||
  summary.remediation.visualEvidenceCompleteCount !== 20 ||
  summary.visualRenderer.svgDiagramCount !== 20 ||
  summary.visualRenderer.completeHighlightedEvidenceCount !== 20 ||
  summary.visualRenderer.asciiFallbackCount !== 20 ||
  summary.visualRenderer.maximumPayloadBytes >=
    summary.visualRenderer.hardPayloadLimitBytes
) {
  throw new Error(`Unexpected CP-003 V7 inventory: ${JSON.stringify(summary)}.`);
}

const csvHeader = [
  "provisionalAuthority",
  "scenarioId",
  "seed",
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
  "visualPathPersonIds",
  "accessibleSummary",
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
    record.seed,
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
    record.proceduralLogic.query?.pathPersonIds,
    record.proceduralLogic.accessibleSummary,
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
        const analyses = record.editorial.optionAnalysis
          .map(
            (entry) =>
              `<li class="${entry.isCorrect ? "correct" : ""}">${escapeHtml(entry.explanation)}</li>`,
          )
          .join("");
        const evidence = record.evidencePaths
          .map((entry) =>
            `${entry.relationId}: ${entry.personIds
              .map(
                (personId) =>
                  record.proceduralLogic.nodes.find((node) => node.id === personId)
                    ?.label ?? personId,
              )
              .join(" → ")}`,
          )
          .join("; ");
        return `<article class="question"><p class="id">${escapeHtml(record.itemId)} · ${escapeHtml(record.provisionalAuthority)}</p><h3>Question ${questionIndex + 1}: ${escapeHtml(record.stem)}</h3><ol>${options}</ol><p class="evidence"><strong>Visual evidence:</strong> ${escapeHtml(evidence)}</p><section><h4>Core concept</h4><ul>${record.editorial.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section><section><h4>Step-by-step solution</h4><ol>${record.editorial.stepByStepSolution.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>${renderBlrCp003SvgFamilyTreeMarkup(record.proceduralLogic)}</section><section><h4>Option analysis</h4><ul>${analyses}</ul><p class="conclusion"><strong>${escapeHtml(record.editorial.conclusion)}</strong></p></section><section class="shortcut"><h4>10-second shortcut</h4><p>${escapeHtml(record.editorial.examShortcut)}</p></section><section class="traps"><h4>Common traps</h4><ul>${record.editorial.commonTraps.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul></section></article>`;
      })
      .join("");
    return `<section class="group"><header>Set ${groupIndex + 1} · ${escapeHtml(first.scenarioId)} · Seed ${first.seed}</header><h2>Passage</h2><p class="passage">${escapeHtml(first.sharedPrompt).replaceAll("\n", "<br>")}</p>${questions}</section>`;
  })
  .join("\n");

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BLR-CP-003 V7 Remediated Review</title><style>body{font-family:system-ui,-apple-system,sans-serif;margin:0;background:#f4f4f5;color:#18181b}main{max-width:1240px;margin:auto;padding:24px}.summary,.group{background:#fff;border:1px solid #d4d4d8;border-radius:16px;padding:24px;margin:22px 0}.warning{background:#fff7ed;border-left:5px solid #ea580c;padding:14px}.group>header{font-weight:800}.passage{line-height:1.7;background:#fafafa;border-left:4px solid #52525b;padding:14px}.question{border-top:2px solid #e4e4e7;padding:28px 0}.id{font-size:.78rem;color:#71717a}.correct{font-weight:750}.badge{font-size:.75rem;background:#dcfce7;border-radius:999px;padding:2px 7px}.evidence{background:#eef2ff;padding:10px}.conclusion{background:#f0fdf4;padding:10px}.shortcut{background:#fefce8;border-left:4px solid #ca8a04;padding:12px}.traps{background:#fff7ed;border-left:4px solid #ea580c;padding:12px}.svg-family-tree{overflow-x:auto;margin:18px 0;border:1px solid #dbeafe;border-radius:14px;background:linear-gradient(135deg,#eef2ff,#fff,#f0f9ff);padding:14px}.svg-family-tree svg{display:block;width:100%;min-width:720px;height:auto}.svg-tree-key{display:flex;flex-wrap:wrap;gap:16px;border-top:1px solid #dbeafe;padding:10px 8px 2px;color:#475569;font-size:12px;font-weight:650}</style></head><body><main><h1>BLR-CP-003 — V7 Remediated Learner-Evidence Review</h1><section class="summary"><p><strong>20 candidates</strong> cover five provisional authorities. The 12 V6 review findings have been implemented: four gender tautologies removed, four learner-facing jargon instances removed, and four set-answer diagrams completed.</p><p class="warning"><strong>Human approval is still required.</strong> No permanent QL, publication, localisation or merge is authorized.</p><p>Next available identity remains <strong>BLR-QL-009</strong>.</p></section>${htmlGroups}</main></body></html>`;

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
        return `### Question ${questionIndex + 1}: ${record.stem}\n\nAuthority: \`${record.provisionalAuthority}\`\n\n${options}\n\n#### Core Concept\n${record.editorial.coreConcept.map((line) => `- ${line}`).join("\n")}\n\n#### Step-by-Step Solution\n${record.editorial.stepByStepSolution.map((line, index) => `${index + 1}. ${line}`).join("\n")}\n\n#### Option Analysis\n${record.editorial.optionAnalysis.map((entry) => `- ${entry.explanation}`).join("\n")}\n\n**${record.editorial.conclusion}**\n\n#### Shortcut\n${record.editorial.examShortcut}\n\n#### Traps\n${record.editorial.commonTraps.map((line) => `- ${line}`).join("\n")}`;
      })
      .join("\n\n---\n\n");
    return `## Set ${groupIndex + 1}\n\n### Passage\n${first.sharedPrompt}\n\n${questions}`;
  })
  .join("\n\n---\n\n");

const markdown = `# BLR-CP-003 V7 Remediated Learner-Evidence Review\n\nAll 12 V6 findings are implemented. Human approval remains pending. Permanent QLs: 0.\n\n${markdownGroups}\n`;

await mkdir(outputDirectory, { recursive: true });
await writeFile(
  path.join(outputDirectory, "blr-cp003-v7-candidates.jsonl"),
  `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v7-candidates.csv"),
  `${csvHeader}\n${csvRows.join("\n")}\n`,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v7-candidates.html"),
  html,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v7-candidates.md"),
  markdown,
  "utf8",
);
await writeFile(
  path.join(outputDirectory, "blr-cp003-v7-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
