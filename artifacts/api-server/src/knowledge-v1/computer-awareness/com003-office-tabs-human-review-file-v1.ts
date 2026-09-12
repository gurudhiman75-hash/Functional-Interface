import fs from "node:fs";
import path from "node:path";
import {
  COM003_OFFICE_TABS_AUTHORITY_V1,
  COM003_OFFICE_TABS_ENGLISH_REVIEW,
  COM003_OFFICE_TABS_HINDI_REVIEW,
  COM003_OFFICE_TABS_PUNJABI_REVIEW,
  COM003_OFFICE_TABS_QLS,
} from "./com003-office-tabs-completion-v1";
import { COM003_OFFICE_TABS_SOURCE_AUTHORITIES } from "./com003-office-tabs-source-authority-v1";

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

export function buildCom003OfficeTabsHumanReviewFile() {
  const sections: string[] = [
    "# COM-003 — Microsoft Excel & PowerPoint Ribbon Tabs Human Review V1",
    "",
    "> Status: REVIEW_ONLY. This package is connected to Question Studio for review generation, but it is not approved for Question Bank acceptance, Test Builder, mocks, publication or production.",
    "",
    "## Scope",
    "",
    "This completion pack covers durable, exam-relevant Excel and PowerPoint desktop interface and Ribbon functions. It covers the principal File surface and the standard Home, Insert, Page Layout, Formulas, Data, Review and View tabs in Excel, plus Home, Insert, Design, Transitions, Animations, Slide Show, Review and View in PowerPoint. It does not claim every version-specific command, add-in or contextual tab.",
    "",
    "The current COM-003 syllabus owns Microsoft Word, Microsoft Excel and Microsoft PowerPoint. Outlook, Access and other Office applications are outside this pack because they are not in the current COM-003 source roadmap.",
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
    `- Learning units: ${COM003_OFFICE_TABS_AUTHORITY_V1.qlCount}`,
    `- Questions per language: ${COM003_OFFICE_TABS_AUTHORITY_V1.questionCountPerLanguage}`,
    `- Localized question-language artifacts: ${COM003_OFFICE_TABS_AUTHORITY_V1.totalQuestionLanguageArtifacts}`,
    "",
    "| QL | Product | Tab / surface | Questions per language |",
    "|---|---|---|---:|",
    ...COM003_OFFICE_TABS_QLS.map((item) => `| ${item.qlId} | ${item.product} | ${item.tab} — ${item.title} | 8 |`),
    "",
    "## Human review checklist",
    "",
    "For each question, verify the answer, option quality, wording, translation, explanation and source relation. Reject any question whose command placement depends on an unstated product version or platform.",
    "",
    "## Questions",
    "",
  ];

  const languages = [
    ["English", COM003_OFFICE_TABS_ENGLISH_REVIEW],
    ["Hindi", COM003_OFFICE_TABS_HINDI_REVIEW],
    ["Punjabi", COM003_OFFICE_TABS_PUNJABI_REVIEW],
  ] as const;
  for (const ql of COM003_OFFICE_TABS_QLS) {
    sections.push(`### ${ql.qlId} — ${ql.product} — ${ql.title}`);
    sections.push("");
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
  for (const source of COM003_OFFICE_TABS_SOURCE_AUTHORITIES) {
    sections.push(`- **${source.sourceId}** — [${source.title}](${source.url}) — verified ${source.verifiedOn}`);
  }
  sections.push("");
  sections.push(`Authority: ${COM003_OFFICE_TABS_AUTHORITY_V1.authorityId}`);
  sections.push("");
  return `${sections.join("\n")}\n`;
}

export function writeCom003OfficeTabsHumanReviewFile(outputPath = path.resolve("dist/com003-office-tabs-review/COM003-OFFICE-TABS-HUMAN-REVIEW-V1.md")) {
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buildCom003OfficeTabsHumanReviewFile(), "utf8");
  return outputPath;
}

if (process.argv[1]?.includes("com003-office-tabs-human-review-file")) {
  const output = process.env.COM003_OFFICE_TABS_REVIEW_OUTPUT;
  console.log(`[COM003-OFFICE-TABS-REVIEW] ${writeCom003OfficeTabsHumanReviewFile(output || undefined)}`);
}
