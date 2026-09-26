import { writeFileSync } from "node:fs";
import { DI002_PERMANENT_QLS } from "./permanent-ql-registry";
import { generateDi002PermanentQuestion } from "./permanent-question-generator";
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

export function renderDi002V2ReviewMarkdown() {
  return [
    "# DI-002 Advanced Table V2 — Editorial Review Pack",
    "",
    "This pack is generated from the approved permanent English source used by Question Studio CONTROLLED_REVIEW. Question Bank, tests, mocks and public delivery remain unauthorized.",
    "",
    renderProfile("SSC_CGL_TIER_I"),
    "",
    renderProfile("BANKING_PRELIMS"),
  ].join("\n");
}

const outputPath = process.argv[2];
if (outputPath) {
  writeFileSync(outputPath, renderDi002V2ReviewMarkdown(), "utf8");
  console.log(outputPath);
}
