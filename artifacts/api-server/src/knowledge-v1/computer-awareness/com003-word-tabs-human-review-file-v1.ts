import fs from "node:fs";
import path from "node:path";
import {
  COM003_WORD_TABS_AUTHORITY_V1,
  COM003_WORD_TABS_ENGLISH_REVIEW,
  COM003_WORD_TABS_HINDI_REVIEW,
  COM003_WORD_TABS_PUNJABI_REVIEW,
  COM003_WORD_TABS_QLS,
} from "./com003-word-tabs-completion-v1";
import { COM003_WORD_TABS_SOURCE_AUTHORITIES } from "./com003-word-tabs-source-authority-v1";

function md(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\|/g, "\\|");
}

function questionBlock(label: string, question: { stem: string; options: readonly string[]; canonicalAnswer: string; explanation: string; correctIndex: number; sourceQuestionId: string; difficulty: string; targetFactId: string }) {
  const options = question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${md(option)}`).join("\n");
  return [
    `#### ${label} — ${question.difficulty}`,
    `**Question:** ${md(question.stem)}`,
    "",
    options,
    "",
    `**Answer:** ${md(question.canonicalAnswer)}`,
    `**Explanation:** ${md(question.explanation)}`,
    `**Trace:** ${question.sourceQuestionId} · ${question.targetFactId}`,
  ].join("\n");
}

export function buildCom003WordTabsHumanReviewFile() {
  const sections: string[] = [
    "# COM-003 — Microsoft Word Ribbon Tabs & Interface Human Review V1",
    "",
    "> Status: REVIEW_ONLY. This package is connected to Question Studio for review generation, but it is not approved for Question Bank acceptance, Test Builder, mocks, publication or production.",
    "",
    "## Scope",
    "",
    "This completion pack covers durable, exam-relevant Word desktop interface and Ribbon functions. It covers the File tab/Backstage area and the Home, Insert, Design, Layout, References, Mailings, Review and View tabs. It does not claim to implement every version-specific command or every contextual tab.",
    "",
    "## Review rules",
    "",
    "- Direct exam-level stems; no filler openings.",
    "- Four options, one answer, and a short question-specific explanation.",
    "- English, Hindi and Punjabi identity and answer-position parity.",
    "- Easy/Medium only; Hard is disabled.",
    "- Review-only lifecycle; no Question Bank writes are authorized before approval.",
    "",
    "## Coverage summary",
    "",
    `- Learning units: ${COM003_WORD_TABS_AUTHORITY_V1.qlCount}`,
    `- Questions per language: ${COM003_WORD_TABS_AUTHORITY_V1.questionCountPerLanguage}`,
    `- Localized question-language artifacts: ${COM003_WORD_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts}`,
    "",
    "| QL | Tab / surface | Questions per language |",
    "|---|---|---:|",
    ...COM003_WORD_TABS_QLS.map((item) => `| ${item.qlId} | ${item.tab} — ${item.title} | 8 |`),
    "",
    "## Human review checklist",
    "",
    "For each question, verify the answer, option quality, wording, translation, explanation and source relation. Reject any question whose command placement depends on an unstated product version or platform.",
    "",
    "## Questions",
    "",
  ];

  for (const ql of COM003_WORD_TABS_QLS) {
    sections.push(`### ${ql.qlId} — ${ql.title}`);
    sections.push("");
    const languages = [
      ["English", COM003_WORD_TABS_ENGLISH_REVIEW],
      ["Hindi", COM003_WORD_TABS_HINDI_REVIEW],
      ["Punjabi", COM003_WORD_TABS_PUNJABI_REVIEW],
    ] as const;
    for (const [label, corpus] of languages) {
      sections.push(`#### ${label}`);
      sections.push("");
      corpus.filter((question) => question.qlId === ql.qlId).forEach((question, index) => {
        sections.push(questionBlock(`${index + 1}. ${question.sourceQuestionId}`, question));
        sections.push("");
      });
    }
  }

  sections.push("## Sources");
  sections.push("");
  for (const source of COM003_WORD_TABS_SOURCE_AUTHORITIES) {
    sections.push(`- **${source.sourceId}** — [${source.title}](${source.url}) — verified ${source.verifiedOn}`);
  }
  sections.push("");
  sections.push(`Authority: ${COM003_WORD_TABS_AUTHORITY_V1.authorityId}`);
  sections.push("");
  return `${sections.join("\n")}\n`;
}

export function writeCom003WordTabsHumanReviewFile(outputPath = path.resolve("dist/com003-word-tabs-review/COM003-WORD-TABS-HUMAN-REVIEW-V1.md")) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buildCom003WordTabsHumanReviewFile(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-word-tabs-human-review-file")) {
  const output = process.env.COM003_WORD_TABS_REVIEW_OUTPUT;
  console.log(`[COM003-WORD-TABS-REVIEW] ${writeCom003WordTabsHumanReviewFile(output || undefined)}`);
}
