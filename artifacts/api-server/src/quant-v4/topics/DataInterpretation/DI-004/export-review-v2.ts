import { writeFileSync } from "node:fs";
import { DI004_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi004PermanentQuestion } from "./permanent-question-generator";
import { generateDi004LocalizedReviewQuestion, type Di004LocalizationLocale } from "./localization-review-v1";
import type { Di004V2Stimulus } from "./line-v2-types";

function lineDataTable(stimulus: Di004V2Stimulus) {
  const labelA = stimulus.series[0].label;
  const labelB = stimulus.series[1].label;
  return [
    `| Period | ${labelA} | ${labelB} |`,
    "| --- | ---: | ---: |",
    ...stimulus.points.map((point) => `| ${point.period} | ${point.seriesA} | ${point.seriesB} |`),
  ].join("\n");
}

function renderProfile(profile: "SSC_CGL_TIER_I" | "BANKING_PRELIMS") {
  const parts: string[] = [`# DI-004 V2 Review — ${profile}\n`];

  for (const descriptor of DI004_PERMANENT_QLS) {
    const source = generateDi004PermanentQuestion({
      seed: `DI004-V2-REVIEW-PACK:${profile}:${descriptor.qlId}`,
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
      `**Y-axis:** ${source.stimulus.yAxisLabel} (${source.stimulus.unitLabel})`,
      "",
      source.stimulus.instruction,
      "",
      "**Plotted values used by the line graph:**",
      "",
      lineDataTable(source.stimulus),
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

function localizedLineTable(stimulus: ReturnType<typeof generateDi004LocalizedReviewQuestion>["stimulus"], locale: Di004LocalizationLocale) {
  const periodHeader = locale === "hi-IN" ? "अवधि" : "ਮਿਆਦ";
  const labelA = stimulus.series[0].label;
  const labelB = stimulus.series[1].label;
  return [
    `| ${periodHeader} | ${labelA} | ${labelB} |`,
    "| --- | ---: | ---: |",
    ...stimulus.points.map((point) => `| ${point.period} | ${point.seriesA} | ${point.seriesB} |`),
  ].join("\n");
}

function renderLocalized(locale: Di004LocalizationLocale) {
  const parts: string[] = [locale === "hi-IN" ? "# Hindi Review (hi-IN)\n" : "# Punjabi Review (pa-IN)\n"];
  for (const [index, descriptor] of DI004_PERMANENT_QLS.entries()) {
    const examProfile = index % 2 === 0 ? "SSC_CGL_TIER_I" as const : "BANKING_PRELIMS" as const;
    const source = generateDi004LocalizedReviewQuestion({
      seed: `DI004-LOCALIZATION-REVIEW:${locale}:${descriptor.qlId}`,
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
      localizedLineTable(source.stimulus, locale),
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

export function renderDi004V2ReviewMarkdown() {
  return [
    "# DI-004 Line Graph V2 — Editorial Review Pack",
    "",
    "English is the approved permanent authority. Hindi/Punjabi below are HI_PA_REVIEW_CANDIDATE and remain Question Studio locked until human approval.",
    "",
    "Learner-facing stems do not contain explicit rounding commands; approximate percentage/average wording is used where required. Question Bank, tests, mocks and public delivery remain unauthorized.",
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
  writeFileSync(outputPath, renderDi004V2ReviewMarkdown(), "utf8");
  console.log(outputPath);
}
