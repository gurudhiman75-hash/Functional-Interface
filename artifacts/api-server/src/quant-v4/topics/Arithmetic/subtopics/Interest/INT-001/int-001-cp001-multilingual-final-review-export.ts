import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { INT_CP001_FINAL_QL_IDS } from "./cp001-final-registry";
import { generateIntCp001ReleaseLocalizedQuestion } from "./cp001-localized-runtime-release";
import {
  INT_CP001_HINDI_RELEASE_ID,
  INT_CP001_MULTILINGUAL_STANDARD,
  INT_CP001_PUNJABI_RELEASE_ID,
  type IntCp001Locale,
} from "./cp001-multilingual-release";

function json(value: unknown): string {
  return JSON.stringify(value, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2);
}

const outputDirectory = path.join(process.cwd(), "dist", "quant-v4");
await mkdir(outputDirectory, { recursive: true });
const seeds = ["review-a", "review-b", "review-c"] as const;
const locales: readonly IntCp001Locale[] = ["hi", "pa"];

for (const locale of locales) {
  const items = INT_CP001_FINAL_QL_IDS.flatMap((qlId) => seeds.map((seed) =>
    generateIntCp001ReleaseLocalizedQuestion(qlId, seed, locale)
  ));
  for (const item of items) {
    if (!item.validation.ok) throw new Error(`${item.qlId}/${item.seed}/${locale}: ${item.validation.errors.join(" | ")}`);
  }

  const hindi = locale === "hi";
  const prefix = hindi ? "hindi" : "punjabi";
  const releaseId = hindi ? INT_CP001_HINDI_RELEASE_ID : INT_CP001_PUNJABI_RELEASE_ID;
  await writeFile(
    path.join(outputDirectory, `int-001-cp001-${prefix}-review.json`),
    json({
      generatedAt: new Date().toISOString(),
      packageId: "INT-001",
      cpId: "INT-CP-001",
      locale,
      releaseId,
      editorialStandard: INT_CP001_MULTILINGUAL_STANDARD,
      status: "PENDING_HUMAN_REVIEW",
      qlCount: INT_CP001_FINAL_QL_IDS.length,
      sampleCount: items.length,
      publiclyPublishable: false,
      questionStudioDiscoverable: false,
      items,
    }),
    "utf8",
  );

  const markdown: string[] = [
    `# INT-001 / CP-001 ${hindi ? "हिन्दी" : "ਪੰਜਾਬੀ"} Review Pack`,
    "",
    `Release: **${releaseId}**`,
    `Editorial standard: **${INT_CP001_MULTILINGUAL_STANDARD}**`,
    `Status: **${hindi ? "मानव समीक्षा लंबित; प्रकाशन बंद" : "ਮਨੁੱਖੀ ਸਮੀਖਿਆ ਬਾਕੀ; ਪ੍ਰਕਾਸ਼ਨ ਬੰਦ"}**`,
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
      "",
      `> **${hindi ? "प्रश्न" : "ਪ੍ਰਸ਼ਨ"}:** ${item.stem}`,
      "",
      ...item.options.map((option, optionIndex) =>
        `${optionIndex + 1}. ${option}${optionIndex === item.correctIndex ? (hindi ? "  **← सही**" : "  **← ਸਹੀ**") : ""}`
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
      `**${hindi ? "जाँच" : "ਜਾਂਚ"}:** ${item.explanation.stepByStep.verification}`,
      "",
      `**${hindi ? "उत्तर" : "ਉੱਤਰ"}:** ${item.explanation.stepByStep.conclusion}`,
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
        `- **${hindi ? "विकल्प" : "ਵਿਕਲਪ"} ${trap.optionNumber} (${trap.optionText}) [${trap.misconceptionId}]:** ${trap.explanation}`
      ),
      "",
      `Validation: **${item.validation.ok ? "PASS" : "FAIL"}**`,
      "",
      "---",
      "",
    );
  }
  await writeFile(path.join(outputDirectory, `int-001-cp001-${prefix}-review.md`), markdown.join("\n"), "utf8");
}

await writeFile(
  path.join(outputDirectory, "int-001-cp001-multilingual-review-summary.json"),
  json({
    status: "PASS",
    editorialStandard: INT_CP001_MULTILINGUAL_STANDARD,
    qlCount: INT_CP001_FINAL_QL_IDS.length,
    samplesPerLocale: INT_CP001_FINAL_QL_IDS.length * seeds.length,
    totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * locales.length,
    releases: { hi: INT_CP001_HINDI_RELEASE_ID, pa: INT_CP001_PUNJABI_RELEASE_ID },
    publiclyPublishable: false,
  }),
  "utf8",
);

console.log(json({
  status: "PASS",
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  samplesPerLocale: INT_CP001_FINAL_QL_IDS.length * seeds.length,
  totalSamples: INT_CP001_FINAL_QL_IDS.length * seeds.length * locales.length,
  outputDirectory,
}));
