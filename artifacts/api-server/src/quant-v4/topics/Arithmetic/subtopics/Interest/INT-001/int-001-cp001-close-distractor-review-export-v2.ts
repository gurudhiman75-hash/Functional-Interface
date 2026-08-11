import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  INT_CP001_FINAL_QL_IDS,
  type IntCp001FinalQlId,
} from "./cp001-final-registry";
import {
  generateIntCp001ReadableEnglishQuestion,
  generateIntCp001ReadableLocalizedQuestion,
} from "./cp001-readable-stem-runtime";
import {
  generateIntCp001CloseDistractorEnglishQuestion,
  generateIntCp001CloseDistractorLocalizedQuestion,
} from "./cp001-close-distractor-runtime-v2";
import {
  INT_CP001_CLOSE_DISTRACTOR_STANDARD,
  type IntCp001CloseDistractorLanguage,
} from "./cp001-close-distractor-release";

type Language = IntCp001CloseDistractorLanguage;

function generateReadable(qlId: IntCp001FinalQlId, seed: string, language: Language) {
  return language === "en"
    ? generateIntCp001ReadableEnglishQuestion(qlId, seed)
    : generateIntCp001ReadableLocalizedQuestion(qlId, seed, language);
}

function generateClose(qlId: IntCp001FinalQlId, seed: string, language: Language) {
  return language === "en"
    ? generateIntCp001CloseDistractorEnglishQuestion(qlId, seed)
    : generateIntCp001CloseDistractorLocalizedQuestion(qlId, seed, language);
}

function label(language: Language): string {
  return language === "en" ? "English" : language === "hi" ? "Hindi" : "Punjabi";
}

function optionLines(options: readonly string[], correctIndex: number): string[] {
  return options.map((option, index) => `${index + 1}. ${option}${index === correctIndex ? "  **← correct**" : ""}`);
}

function markdownFor(language: Language, rows: Array<Record<string, unknown>>, releaseId: string): string {
  const lines = [
    `# INT-001 / CP-001 ${label(language)} Close-Distractor Review Pack`,
    "",
    `Release candidate: **${releaseId}**`,
    `Editorial standard: **${INT_CP001_CLOSE_DISTRACTOR_STANDARD}**`,
    "Status: **PENDING HUMAN REVIEW — NOT PUBLISHED**",
    `Permanent QLs: **${INT_CP001_FINAL_QL_IDS.length}**`,
    `Samples: **${rows.length}**`,
    "",
    "The readable stem and correct answer are unchanged. Old misconception options are retained only when they are within 15% of the answer; all other wrong options are scaled near misses.",
    "",
    "---",
  ];

  rows.forEach((raw, rowIndex) => {
    const row = raw as {
      qlId: string;
      seed: string;
      solveContract: string;
      stem: string;
      oldOptions: string[];
      newOptions: string[];
      correctIndex: number;
      trace: { retainedConceptDistractors: number; generatedNearMisses: number; maximumRelativeDistanceBps: number };
      optionAudit: Array<{
        text: string;
        misconceptionId: string;
        proximityOrigin: string;
        relativeDistanceBps: number;
      }>;
      traps: Array<{ optionNumber: number; optionText: string; misconceptionId: string; explanation: string }>;
      validation: { ok: boolean };
    };
    lines.push(
      "",
      `## ${rowIndex + 1}. ${row.qlId} — ${row.solveContract}`,
      "",
      `- Seed: **${row.seed}**`,
      `- Retained concept traps: **${row.trace.retainedConceptDistractors}**`,
      `- Generated near misses: **${row.trace.generatedNearMisses}**`,
      `- Maximum relative distance: **${(row.trace.maximumRelativeDistanceBps / 100).toFixed(2)}%**`,
      "",
      `> **Stem:** ${row.stem}`,
      "",
      "### Previous options",
      "",
      ...optionLines(row.oldOptions, row.correctIndex),
      "",
      "### Tight close-distractor candidate",
      "",
      ...optionLines(row.newOptions, row.correctIndex),
      "",
      "### Distractor ownership",
      "",
    );
    row.optionAudit.forEach((audit, index) => {
      if (index === row.correctIndex) return;
      lines.push(
        `- Option ${index + 1}: **${audit.text}** — ${audit.misconceptionId}; `
        + `${audit.proximityOrigin}; ${(audit.relativeDistanceBps / 100).toFixed(2)}% from the answer.`,
      );
    });
    lines.push("", "### Trap explanations", "");
    row.traps.forEach((trap) => {
      lines.push(`- Option ${trap.optionNumber} (**${trap.optionText}**): ${trap.explanation}`);
    });
    lines.push("", `Validation: **${row.validation.ok ? "PASS" : "FAIL"}**`, "", "---");
  });

  return `${lines.join("\n")}\n`;
}

const seeds = ["review-a", "review-b", "review-c"];
const languages: Language[] = ["en", "hi", "pa"];
const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });

const summary: Record<string, unknown> = {
  generatedAt: new Date().toISOString(),
  packageId: "INT-001",
  cpId: "INT-CP-001",
  editorialStandard: INT_CP001_CLOSE_DISTRACTOR_STANDARD,
  retainedConceptMaximumBps: 1500,
  qlCount: INT_CP001_FINAL_QL_IDS.length,
  seeds,
  languages: {},
  publiclyPublishable: false,
  questionStudioDiscoverable: false,
};

for (const language of languages) {
  const rows = INT_CP001_FINAL_QL_IDS.flatMap((qlId) => seeds.map((seed) => {
    const readable = generateReadable(qlId, seed, language);
    const candidate = generateClose(qlId, seed, language);
    if (!candidate.validation.ok) {
      throw new Error(`${qlId}/${seed}/${language}: ${candidate.validation.errors.join(" | ")}`);
    }
    return {
      qlId,
      seed,
      solveContract: candidate.solveContract,
      releaseId: candidate.releaseId,
      supersedesReleaseId: readable.releaseId,
      stem: candidate.stem,
      stemPresentation: candidate.stemPresentation,
      oldOptions: readable.options,
      newOptions: candidate.options,
      correctIndex: candidate.correctIndex,
      correctOption: candidate.options[candidate.correctIndex],
      trace: candidate.distractorEditorialTrace,
      optionAudit: candidate.optionAudit,
      traps: candidate.explanation.trapAnalysis.items,
      validation: candidate.validation,
    };
  }));
  const releaseId = rows[0]!.releaseId;
  const baseName = language === "en"
    ? "int-001-cp001-english-v5-close-distractor-review"
    : language === "hi"
      ? "int-001-cp001-hindi-v4-close-distractor-review"
      : "int-001-cp001-punjabi-v4-close-distractor-review";
  const payload = {
    generatedAt: new Date().toISOString(),
    packageId: "INT-001",
    cpId: "INT-CP-001",
    language,
    releaseId,
    editorialStandard: INT_CP001_CLOSE_DISTRACTOR_STANDARD,
    status: "PENDING_HUMAN_REVIEW",
    qlCount: INT_CP001_FINAL_QL_IDS.length,
    sampleCount: rows.length,
    publiclyPublishable: false,
    questionStudioDiscoverable: false,
    rows,
  };
  writeFileSync(
    join(outputDirectory, `${baseName}.json`),
    `${JSON.stringify(payload, (_key, item) => typeof item === "bigint" ? item.toString() : item, 2)}\n`,
    "utf8",
  );
  writeFileSync(join(outputDirectory, `${baseName}.md`), markdownFor(language, rows, releaseId), "utf8");
  (summary.languages as Record<string, unknown>)[language] = {
    releaseId,
    sampleCount: rows.length,
    retainedConceptDistractors: rows.reduce((sum, row) => sum + row.trace.retainedConceptDistractors, 0),
    generatedNearMisses: rows.reduce((sum, row) => sum + row.trace.generatedNearMisses, 0),
    maximumRelativeDistanceBps: Math.max(...rows.map((row) => row.trace.maximumRelativeDistanceBps)),
  };
}

writeFileSync(
  join(outputDirectory, "int-001-cp001-close-distractor-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
  "utf8",
);

console.log(JSON.stringify(summary, null, 2));
