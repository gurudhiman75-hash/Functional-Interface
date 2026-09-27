import { writeFileSync } from "node:fs";
import { DI002_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi002PermanentQuestion } from "./permanent-question-generator";
import { generateDi002LocalizedReviewQuestion, type Di002LocalizationLocale } from "./localization-review-v1";
import type { Di002V2Stimulus } from "./advanced-table-v2-types";

function table(stimulus: Di002V2Stimulus) {
  const header = `| ${stimulus.columns.join(" | ")} |`;
  const divider = `| ${stimulus.columns.map(() => "---").join(" | ")} |`;
  const rows = stimulus.rows.map((row) => `| ${row.label} | ${row.applicants} | ${row.selected} | ${row.selectionPercent}% |`);
  return [header, divider, ...rows].join("\n");
}

function renderProfile(profile: "SSC_CGL_TIER_I" | "BANKING_PRELIMS") {
  const parts: string[] = [`# DI-002 V2 Review — ${profile}\n`];

  for (const descriptor of DI002_PERMANENT_QLS) {
    const source = generateDi002PermanentQuestion({
      seed: `DI002-V2-REVIEW-PACK:${profile}:${descriptor.qlId}`,
      examProfile: profile,
      taskKind: descriptor.taskKind,
    });
    const question = source.question;
    parts.push(
      `## ${descriptor.qlId} — ${descriptor.label}`,
      "",
      `**Difficulty:** ${question.difficulty}  `,
      `**Task:** ${question.kind}  `,
      `**Context:** ${source.stimulus.title}`,
      "",
      source.stimulus.instruction,
      "",
      table(source.stimulus),
      "",
      `**Question:** ${question.stem}`,
      "",
      ...question.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`),
      "",
      `**Answer:** ${String.fromCharCode(65 + question.correctIndex)}. ${question.answer}`,
      "",
      `**Explanation:** ${question.explanation.keyIdea}`,
      "",
      ...question.explanation.steps.map((step, index) => `${index + 1}. ${step}`),
      "",
    );
    if (question.explanation.workingTable) {
      parts.push(
        `| ${question.explanation.workingTable.headers.join(" | ")} |`,
        `| ${question.explanation.workingTable.headers.map(() => "---").join(" | ")} |`,
        ...question.explanation.workingTable.rows.map((row) => `| ${row.join(" | ")} |`),
        "",
      );
    }
    parts.push("---", "");
  }
  return parts.join("\n");
}

function localizedTable(stimulus: ReturnType<typeof generateDi002LocalizedReviewQuestion>["stimulus"]) {
  const header = `| ${stimulus.columns.join(" | ")} |`;
  const divider = `| ${stimulus.columns.map(() => "---").join(" | ")} |`;
  const rows = stimulus.rows.map((row) => `| ${row.label} | ${row.applicants} | ${row.selected} | ${row.selectionPercent}% |`);
  return [header, divider, ...rows].join("\n");
}

function renderLocalized(locale: Di002LocalizationLocale) {
  const parts: string[] = [locale === "hi-IN" ? "# Hindi Review (hi-IN)\n" : "# Punjabi Review (pa-IN)\n"];
  for (const [index, descriptor] of DI002_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const source = generateDi002LocalizedReviewQuestion({
      seed: `DI002-LOCALIZATION-REVIEW:${locale}:${descriptor.qlId}`,
      examProfile,
      taskKind: descriptor.taskKind,
      locale,
    });
    const q = source.question;
    parts.push(
      `## ${descriptor.qlId} — ${descriptor.taskKind}`,
      "",
      `**Difficulty:** ${q.difficulty}`,
      "",
      `**${source.stimulus.title}**`,
      "",
      source.stimulus.instruction,
      "",
      localizedTable(source.stimulus),
      "",
      `**Question:** ${q.stem}`,
      "",
      ...q.options.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
      "",
      `**Answer:** ${String.fromCharCode(65 + q.correctIndex)}. ${q.answer}`,
      "",
      `**Explanation:** ${q.explanation.keyIdea}`,
      "",
      ...q.explanation.steps.map((step, stepIndex) => `${stepIndex + 1}. ${step}`),
      "",
    );
    if (q.explanation.workingTable) {
      parts.push(
        `| ${q.explanation.workingTable.headers.join(" | ")} |`,
        `| ${q.explanation.workingTable.headers.map(() => "---").join(" | ")} |`,
        ...q.explanation.workingTable.rows.map((row) => `| ${row.join(" | ")} |`),
        "",
      );
    }
    parts.push("---", "");
  }
  return parts.join("\n");
}

export function renderDi002V2ReviewMarkdown() {
  return [
    "# DI-002 Advanced Table V2 — Editorial Review Pack",
    "",
    "English is the approved permanent authority. Hindi/Punjabi below are HI_PA_FROZEN and are enabled in Question Studio CONTROLLED_REVIEW. Question Bank, tests, mocks and public delivery remain unauthorized.",
    "",
    renderProfile("SSC_CGL_TIER_I"),
    "",
    renderProfile("BANKING_PRELIMS"),
    "",
    renderLocalized("hi-IN"),
    "",
    renderLocalized("pa-IN"),
  ].join("\n");
}

const outputPath = process.argv[2];
if (outputPath) {
  writeFileSync(outputPath, renderDi002V2ReviewMarkdown(), "utf8");
  console.log(outputPath);
}
