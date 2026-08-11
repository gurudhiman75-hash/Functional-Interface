import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001ApprovedLocalizedQuestion } from "./cp001-localized-runtime-approved";
import {
  INT_CP001_HINDI_RELEASE_ID,
  INT_CP001_MULTILINGUAL_STANDARD,
  INT_CP001_PUNJABI_RELEASE_ID,
  type IntCp001Locale,
} from "./cp001-multilingual-release";

function serialise(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });

const seeds = ["review-a", "review-b", "review-c"] as const;
const locales: readonly IntCp001Locale[] = ["hi", "pa"];
const localeTitle: Record<IntCp001Locale, string> = {
  hi: "हिन्दी",
  pa: "ਪੰਜਾਬੀ",
};
const localeStatus: Record<IntCp001Locale, string> = {
  hi: "हिन्दी स्थानीयकरण मानव समीक्षा में स्वीकृत है; प्रकाशन अभी बंद है।",
  pa: "ਪੰਜਾਬੀ ਸਥਾਨਕੀਕਰਨ ਮਨੁੱਖੀ ਸਮੀਖਿਆ ਵਿੱਚ ਮਨਜ਼ੂਰ ਹੈ; ਪ੍ਰਕਾਸ਼ਨ ਹਾਲੇ ਬੰਦ ਹੈ।",
};

const summary: Record<string, unknown> = {
  generatedAt: new Date().toISOString(),
  approvedAt: "2026-07-28",
  packageId: "INT-001",
  cpId: "INT-CP-001",
  editorialStandard: INT_CP001_MULTILINGUAL_STANDARD,
  releases: {
    hi: INT_CP001_HINDI_RELEASE_ID,
    pa: INT_CP001_PUNJABI_RELEASE_ID,
  },
  maturity: "APPROVED_MULTILINGUAL_CONTRACT",
  reviewStatus: "APPROVED_MULTILINGUAL_CONTRACT",
  localeReviewStatus: "APPROVED_HUMAN_REVIEW",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  samplesPerQlPerLocale: seeds.length,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
};

for (const locale of locales) {
  const items = INT_CP001_FINAL_QL_IDS.flatMap((qlId) =>
    seeds.map((seed) => generateIntCp001ApprovedLocalizedQuestion(qlId, seed, locale)),
  );
  for (const item of items) {
    if (!item.validation.ok) throw new Error(`${item.qlId}/${item.seed}/${locale}: ${item.validation.errors.join(" | ")}`);
    if (
      item.maturity !== "APPROVED_MULTILINGUAL_CONTRACT"
      || item.reviewStatus !== "APPROVED_MULTILINGUAL_CONTRACT"
      || item.localeReviewStatus !== "APPROVED_HUMAN_REVIEW"
    ) {
      throw new Error(`${item.qlId}/${item.seed}/${locale}: approval lifecycle is not frozen.`);
    }
  }

  const releaseId = locale === "hi" ? INT_CP001_HINDI_RELEASE_ID : INT_CP001_PUNJABI_RELEASE_ID;
  const prefix = locale === "hi" ? "hindi" : "punjabi";
  const jsonPath = path.join(outputDirectory, `int-001-cp001-${prefix}-review.json`);
  const markdownPath = path.join(outputDirectory, `int-001-cp001-${prefix}-review.md`);

  await writeFile(jsonPath, serialise({
    ...summary,
    locale,
    releaseId,
    languageId: items[0]?.questionLanguageId,
    sampleCount: items.length,
    status: "APPROVED_HUMAN_REVIEW",
    items,
  }), "utf8");

  const markdown: string[] = [
    `# INT-001 / CP-001 ${localeTitle[locale]} Approved Locale Pack`,
    "",
    `Release: **${releaseId}**`,
    "",
    `Editorial standard: **${INT_CP001_MULTILINGUAL_STANDARD}**`,
    "",
    `Status: **${localeStatus[locale]}**`,
    "",
    `Permanent QLs: **${INT_CP001_FINAL_QL_IDS.length}**`,
    `Samples: **${items.length}**`,
    "",
    "---",
    "",
  ];

  for (const [index, item] of items.entries()) {
    markdown.push(
      `## ${index + 1}. ${item.qlId} — ${item.solveContract}`,
      "",
      `- Seed: **${item.seed}**`,
      `- Difficulty: **${item.difficulty}**`,
      `- Correct option: **${item.correctIndex + 1}**`,
      `- Source: **${item.internalProvenance.sourceKind} / ${item.internalProvenance.sourcePrototypeId}**`,
      `- Locale status: **${item.localeReviewStatus}**`,
      "",
      `> **${locale === "hi" ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"}:** ${item.stem}`,
      "",
      ...item.options.map((option, optionIndex) =>
        `${optionIndex + 1}. ${option}${optionIndex === item.correctIndex ? (locale === "hi" ? "  **← सही**" : "  **← ਸਹੀ**") : ""}`
      ),
      "",
      `### ${item.explanation.coreConcept.heading}`,
      "",
      item.explanation.coreConcept.narrative,
      "",
      item.explanation.coreConcept.displayMath,
      "",
      `### ${item.explanation.stepByStep.heading}`,
      "",
      ...item.explanation.stepByStep.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
      `**${locale === "hi" ? "जाँच" : "ਜਾਂਚ"}:** ${item.explanation.stepByStep.verification}`,
      "",
      `**${locale === "hi" ? "उत्तर" : "ਉੱਤਰ"}:** ${item.explanation.stepByStep.conclusion}`,
      "",
      `### ${item.explanation.examShortcut.heading}`,
      "",
      item.explanation.examShortcut.narrative,
      "",
      item.explanation.examShortcut.displayMath,
      "",
      `### ${item.explanation.trapAnalysis.heading}`,
      "",
      ...item.explanation.trapAnalysis.items.map((trap) =>
        `- **${locale === "hi" ? "विकल्प" : "ਵਿਕਲਪ"} ${trap.optionNumber} (${trap.optionText}) [${trap.misconceptionId}]:** ${trap.explanation}`
      ),
      "",
      `Validation: **${item.validation.ok ? "PASS" : "FAIL"}**`,
      "",
      "---",
      "",
    );
  }

  await writeFile(markdownPath, markdown.join("\n"), "utf8");
}

await writeFile(
  path.join(outputDirectory, "int-001-cp001-multilingual-review-summary.json"),
  serialise({
    ...summary,
    status: "PASS",
    samplesPerLocale: INT_CP001_FINAL_QL_IDS.length * seeds.length,
    totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * locales.length,
  }),
  "utf8",
);

console.log(serialise({
  status: "PASS",
  editorialStandard: INT_CP001_MULTILINGUAL_STANDARD,
  maturity: "APPROVED_MULTILINGUAL_CONTRACT",
  localeReviewStatus: "APPROVED_HUMAN_REVIEW",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  samplesPerLocale: INT_CP001_FINAL_QL_IDS.length * seeds.length,
  totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * locales.length,
  outputDirectory,
  publiclyPublishable: false,
}));
