import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001ApprovedLocalizedQuestion } from "./cp001-localized-runtime-approved";
import { generateIntCp001ApprovedV2LocalizedQuestion } from "./cp001-localized-runtime-v2-approved";
import type { IntCp001Locale } from "./cp001-multilingual-release";
import {
  INT_CP001_HINDI_RELEASE_V2_ID,
  INT_CP001_MULTILINGUAL_V2_STANDARD,
  INT_CP001_PUNJABI_RELEASE_V2_ID,
} from "./cp001-multilingual-release-v2";

function json(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });
const seeds = ["approved-a", "approved-b", "approved-c"] as const;
const locales: readonly IntCp001Locale[] = ["hi", "pa"];

for (const locale of locales) {
  const hindi = locale === "hi";
  const prefix = hindi ? "hindi-v2-approved" : "punjabi-v2-approved";
  const releaseId = hindi ? INT_CP001_HINDI_RELEASE_V2_ID : INT_CP001_PUNJABI_RELEASE_V2_ID;
  const rows = INT_CP001_FINAL_QL_IDS.flatMap((qlId) => seeds.map((seed) => {
    const v1 = generateIntCp001ApprovedLocalizedQuestion(qlId, seed, locale);
    const item = generateIntCp001ApprovedV2LocalizedQuestion(qlId, seed, locale);
    if (!item.validation.ok) throw new Error(`${qlId}/${seed}/${locale}: ${item.validation.errors.join(" | ")}`);
    return {
      ...item,
      supersededV1Stem: v1.stem,
      stemChanged: v1.stem !== item.stem,
    };
  }));

  await writeFile(
    path.join(outputDirectory, `int-001-cp001-${prefix}.json`),
    json({
      generatedAt: new Date().toISOString(),
      packageId: "INT-001",
      cpId: "INT-CP-001",
      locale,
      releaseId,
      supersedes: hindi ? "INT-CP-001-HI-v1" : "INT-CP-001-PA-v1",
      editorialStandard: INT_CP001_MULTILINGUAL_V2_STANDARD,
      maturity: "APPROVED_MULTILINGUAL_CONTRACT_V2",
      reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT_V2",
      localeReviewStatus: "APPROVED_HUMAN_REVIEW",
      qlCount: INT_CP001_FINAL_QL_IDS.length,
      sampleCount: rows.length,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      rows,
    }),
    "utf8",
  );

  const markdown: string[] = [
    `# INT-001 / CP-001 ${hindi ? "हिन्दी" : "ਪੰਜਾਬੀ"} V2 Approved Pack`,
    "",
    `Release: **${releaseId}**`,
    `Supersedes: **${hindi ? "INT-CP-001-HI-v1" : "INT-CP-001-PA-v1"}**`,
    `Editorial standard: **${INT_CP001_MULTILINGUAL_V2_STANDARD}**`,
    `Status: **${hindi ? "मानव समीक्षा में स्वीकृत; प्रकाशन अभी बंद" : "ਮਨੁੱਖੀ ਸਮੀਖਿਆ ਵਿੱਚ ਮਨਜ਼ੂਰ; ਪ੍ਰਕਾਸ਼ਨ ਹਾਲੇ ਬੰਦ"}**`,
    `Permanent QLs: **${INT_CP001_FINAL_QL_IDS.length}**`,
    `Samples: **${rows.length}**`,
    "",
    "---",
    "",
  ];

  for (const [index, row] of rows.entries()) {
    markdown.push(
      `## ${index + 1}. ${row.qlId} — ${row.solveContract}`,
      "",
      `- Seed: **${row.seed}**`,
      `- Scenario: **${row.localeEditorialTrace.scenarioId}**`,
      `- Cash-flow direction: **${row.localeEditorialTrace.cashFlowDirection}**`,
      `- Correct option: **${row.correctIndex + 1}**`,
      "",
      `> **${hindi ? "स्वीकृत V2 प्रश्न" : "ਮਨਜ਼ੂਰ V2 ਪ੍ਰਸ਼ਨ"}:** ${row.stem}`,
      "",
      ...row.options.map((option, optionIndex) =>
        `${optionIndex + 1}. ${option}${optionIndex === row.correctIndex ? (hindi ? "  **← सही**" : "  **← ਸਹੀ**") : ""}`
      ),
      "",
      `### ${row.explanation.coreConcept.heading}`,
      "",
      row.explanation.coreConcept.narrative,
      "",
      row.explanation.coreConcept.displayMath,
      "",
      `### ${row.explanation.stepByStep.heading}`,
      "",
      ...row.explanation.stepByStep.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
      `**${hindi ? "जाँच" : "ਜਾਂਚ"}:** ${row.explanation.stepByStep.verification}`,
      "",
      `**${hindi ? "उत्तर" : "ਉੱਤਰ"}:** ${row.explanation.stepByStep.conclusion}`,
      "",
      `### ${row.explanation.examShortcut.heading}`,
      "",
      row.explanation.examShortcut.narrative,
      "",
      row.explanation.examShortcut.displayMath,
      "",
      `### ${row.explanation.trapAnalysis.heading}`,
      "",
      ...row.explanation.trapAnalysis.items.map((trap) =>
        `- **${hindi ? "विकल्प" : "ਵਿਕਲਪ"} ${trap.optionNumber} (${trap.optionText}) [${trap.misconceptionId}]:** ${trap.explanation}`
      ),
      "",
      "---",
      "",
    );
  }

  await writeFile(
    path.join(outputDirectory, `int-001-cp001-${prefix}.md`),
    markdown.join("\n"),
    "utf8",
  );
}

await writeFile(
  path.join(outputDirectory, "int-001-cp001-multilingual-v2-approved-summary.json"),
  json({
    status: "PASS_INT_CP001_MULTILINGUAL_V2_APPROVED_EXPORT",
    editorialStandard: INT_CP001_MULTILINGUAL_V2_STANDARD,
    qlCount: INT_CP001_FINAL_QL_IDS.length,
    samplesPerLocale: INT_CP001_FINAL_QL_IDS.length * seeds.length,
    totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * locales.length,
    releases: {
      hi: INT_CP001_HINDI_RELEASE_V2_ID,
      pa: INT_CP001_PUNJABI_RELEASE_V2_ID,
    },
    maturity: "APPROVED_MULTILINGUAL_CONTRACT_V2",
    localeReviewStatus: "APPROVED_HUMAN_REVIEW",
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
  }),
  "utf8",
);

console.log(json({
  status: "PASS_INT_CP001_MULTILINGUAL_V2_APPROVED_EXPORT",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  samplesPerLocale: INT_CP001_FINAL_QL_IDS.length * seeds.length,
  totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * locales.length,
  outputDirectory,
}));
