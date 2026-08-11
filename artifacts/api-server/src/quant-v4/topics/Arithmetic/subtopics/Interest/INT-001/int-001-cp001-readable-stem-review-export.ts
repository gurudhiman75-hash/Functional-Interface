import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001FinalEditorialV3Question } from "./cp001-final-editorial-runtime-v3";
import { generateIntCp001ApprovedV2LocalizedQuestion } from "./cp001-localized-runtime-v2-approved";
import {
  generateIntCp001ReadableEnglishQuestion,
  generateIntCp001ReadableLocalizedQuestion,
} from "./cp001-readable-stem-runtime";
import type { IntCp001ReadableStemPresentation } from "./cp001-readable-stem-builder";
import {
  getIntCp001ReadableReleaseId,
  INT_CP001_READABLE_STEM_STANDARD,
  type IntCp001ReadableLanguage,
} from "./cp001-readable-stem-release";

function json(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

function markdownStem(presentation: IntCp001ReadableStemPresentation): string {
  let output = "";
  let cursor = 0;
  for (const span of presentation.emphasisSpans) {
    output += presentation.plainText.slice(cursor, span.start);
    output += `**${span.text}**`;
    cursor = span.end;
  }
  output += presentation.plainText.slice(cursor);
  return output;
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });

const seeds = ["review-a", "review-b", "review-c"] as const;
const languages: readonly IntCp001ReadableLanguage[] = ["en", "hi", "pa"];
const labels = {
  en: "English",
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
} as const;

const summaries: Record<string, unknown> = {};

for (const language of languages) {
  const rows = INT_CP001_FINAL_QL_IDS.flatMap((qlId) => seeds.map((seed) => {
    const approved = language === "en"
      ? generateIntCp001FinalEditorialV3Question(qlId, seed)
      : generateIntCp001ApprovedV2LocalizedQuestion(qlId, seed, language);
    const candidate = language === "en"
      ? generateIntCp001ReadableEnglishQuestion(qlId, seed)
      : generateIntCp001ReadableLocalizedQuestion(qlId, seed, language);
    if (!candidate.validation.ok) {
      throw new Error(`${qlId}/${seed}/${language}: ${candidate.validation.errors.join(" | ")}`);
    }
    return {
      qlId,
      seed,
      solveContract: candidate.solveContract,
      scenarioId: candidate.readabilityEditorialTrace.scenarioId,
      cashFlowDirection: candidate.readabilityEditorialTrace.cashFlowDirection,
      approvedReleaseId: approved.releaseId,
      candidateReleaseId: candidate.releaseId,
      approvedStem: approved.stem,
      candidateStem: candidate.stem,
      candidateStemWithScanAnchors: markdownStem(candidate.stemPresentation),
      richTextHtml: candidate.stemPresentation.richTextHtml,
      emphasisSpans: candidate.stemPresentation.emphasisSpans,
      options: candidate.options,
      correctIndex: candidate.correctIndex,
      explanation: candidate.explanation,
      validation: candidate.validation,
    };
  }));

  const prefix = language === "en" ? "english-v4" : language === "hi" ? "hindi-v3" : "punjabi-v3";
  const releaseId = getIntCp001ReadableReleaseId(language);
  const packageObject = {
    generatedAt: new Date().toISOString(),
    packageId: "INT-001",
    cpId: "INT-CP-001",
    language,
    releaseId,
    editorialStandard: INT_CP001_READABLE_STEM_STANDARD,
    status: "PENDING_HUMAN_REVIEW",
    qlCount: INT_CP001_FINAL_QL_IDS.length,
    sampleCount: rows.length,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    rows,
  };

  await writeFile(
    path.join(outputDirectory, `int-001-cp001-${prefix}-readable-stem-review.json`),
    json(packageObject),
    "utf8",
  );

  const markdown: string[] = [
    `# INT-001 / CP-001 ${labels[language]} Readable-Stem Review Pack`,
    "",
    `Release candidate: **${releaseId}**`,
    `Editorial standard: **${INT_CP001_READABLE_STEM_STANDARD}**`,
    "Status: **PENDING HUMAN REVIEW — NOT PUBLISHED**",
    `Permanent QLs: **${INT_CP001_FINAL_QL_IDS.length}**`,
    `Samples: **${rows.length}**`,
    "",
    "The approved stem is shown for comparison. Bold text in the candidate is generated from structured emphasis spans; raw Markdown is not stored in the canonical stem.",
    "",
    "---",
    "",
  ];

  for (const [index, row] of rows.entries()) {
    markdown.push(
      `## ${index + 1}. ${row.qlId} — ${row.solveContract}`,
      "",
      `- Seed: **${row.seed}**`,
      `- Scenario: **${row.scenarioId}**`,
      `- Cash-flow direction: **${row.cashFlowDirection}**`,
      `- Correct option: **${row.correctIndex + 1}**`,
      "",
      `> **Approved stem:** ${row.approvedStem}`,
      "",
      `> **Readable candidate:** ${row.candidateStemWithScanAnchors}`,
      "",
      ...row.options.map((option, optionIndex) =>
        `${optionIndex + 1}. ${option}${optionIndex === row.correctIndex ? "  **← correct**" : ""}`
      ),
      "",
      `Validation: **${row.validation.ok ? "PASS" : "FAIL"}**`,
      "",
      "---",
      "",
    );
  }

  await writeFile(
    path.join(outputDirectory, `int-001-cp001-${prefix}-readable-stem-review.md`),
    markdown.join("\n"),
    "utf8",
  );

  summaries[language] = {
    releaseId,
    sampleCount: rows.length,
    changedStems: rows.filter((row) => row.approvedStem !== row.candidateStem).length,
    averageApprovedCharacters: Number((rows.reduce((sum, row) => sum + row.approvedStem.length, 0) / rows.length).toFixed(2)),
    averageCandidateCharacters: Number((rows.reduce((sum, row) => sum + row.candidateStem.length, 0) / rows.length).toFixed(2)),
  };
}

await writeFile(
  path.join(outputDirectory, "int-001-cp001-readable-stem-review-summary.json"),
  json({
    status: "PASS",
    editorialStandard: INT_CP001_READABLE_STEM_STANDARD,
    qlCount: INT_CP001_FINAL_QL_IDS.length,
    samplesPerLanguage: INT_CP001_FINAL_QL_IDS.length * seeds.length,
    totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * languages.length,
    languages: summaries,
    reviewStatus: "PENDING_HUMAN_REVIEW",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  }),
  "utf8",
);

console.log(json({
  status: "PASS",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  samplesPerLanguage: INT_CP001_FINAL_QL_IDS.length * seeds.length,
  totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * languages.length,
  outputDirectory,
}));
