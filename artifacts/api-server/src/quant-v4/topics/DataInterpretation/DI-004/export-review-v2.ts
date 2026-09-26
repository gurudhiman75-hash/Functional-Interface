import { writeFileSync } from "node:fs";
import { DI004_V2_REVIEW_QLS } from "./review-ql-registry-v2";
import { generateDi004V2ReviewQuestion } from "./review-question-generator-v2";
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

  for (const descriptor of DI004_V2_REVIEW_QLS) {
    const source = generateDi004V2ReviewQuestion({
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

export function renderDi004V2ReviewMarkdown() {
  return [
    "# DI-004 Line Graph V2 — Editorial Review Pack",
    "",
    "Status: ENGLISH_REVIEW_CANDIDATE · HUMAN APPROVAL PENDING",
    "",
    "The pack is generated from the V2 review candidate. The plotted-value table mirrors the values used by the semantic line graph. Question Studio, Question Bank, tests, mocks and public delivery remain unauthorized.",
    "",
    renderProfile("SSC_CGL_TIER_I"),
    "",
    renderProfile("BANKING_PRELIMS"),
  ].join("\n");
}

const outputPath = process.argv[2];
if (outputPath) {
  writeFileSync(outputPath, renderDi004V2ReviewMarkdown(), "utf8");
  console.log(outputPath);
}
