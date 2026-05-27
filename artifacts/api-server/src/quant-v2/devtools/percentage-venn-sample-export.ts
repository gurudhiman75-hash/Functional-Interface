import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { FormulaQuestion, Pattern } from "../../lib/core/generator-engine";
import { createQuantV2PercentageQuestionCandidate } from "../../lib/quant-v2/percentage-admin-adapter";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
  interleaveScheduledPreviewQuestions,
} from "../corpus-scheduler/corpus-scheduler";

const pattern: Pattern = {
  id: "percentage-venn-visual-sample",
  type: "formula",
  section: "Quant",
  topic: "percentage",
  subtopic: "percentage",
  difficulty: "Medium",
  templateVariants: ["Percentage V2 Venn visual sample"],
  variables: {},
  formula: "quant-v2",
  generationDomain: "quant-v2-percentage",
};

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function familyOf(question: FormulaQuestion) {
  return String((question.debugMetadata?.quantV2 as any)?.subtype ?? "unknown");
}

function visualOf(question: FormulaQuestion) {
  return (question as any).visual ??
    (question.debugMetadata?.quantV2 as any)?.visual ??
    (question.debugMetadata?.quantV2 as any)?.semanticMetadata?.visual;
}

function renderText(exportName: string, questions: FormulaQuestion[]) {
  const lines = [
    "# Percentage Venn Visual Sample Export",
    "",
    `Export: ${exportName}`,
    `Count: ${questions.length}`,
    `Venn count: ${questions.filter((question) => familyOf(question) === "venn_diagram").length}`,
    "Multilingual explanations: yes",
    "",
  ];

  questions.forEach((question, index) => {
    const visual = visualOf(question);
    lines.push(
      `[Q${index + 1}]`,
      `Family: ${familyOf(question)}`,
      "EN:",
      question.text,
      "",
      "HI:",
      question.textHi ?? "",
      "",
      "PA:",
      question.textPa ?? "",
      "",
      `Options: ${(question.options ?? []).join(" | ")}`,
      `Answer: ${answerText(question)}`,
      visual?.type === "venn"
        ? `Visual: venn onlyA=${visual.regions.onlyA}, both=${visual.regions.both}, onlyB=${visual.regions.onlyB}, neither=${visual.regions.neither}, universe=${visual.universe}`
        : "Visual: none",
      "",
      "Explanation EN:",
      question.explanation,
      "",
      "Explanation HI:",
      question.explanationHi ?? "",
      "",
      "Explanation PA:",
      question.explanationPa ?? "",
      "",
    );
  });

  return lines.join("\n");
}

export function runPercentageVennSampleExport() {
  const count = 30;
  const exportName = "percentage-venn-visual-30";
  const outDir = join(process.cwd(), "exports", exportName);
  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "balanced_mock",
  });
  const questions: FormulaQuestion[] = [];

  for (let index = 0; index < count; index += 1) {
    const forcedMotifId = index < 5 ? "perc_venn_diagram" : undefined;
    questions.push(
      generateScheduledQuestion({
        state,
        index,
        seedPrefix: "percentage-venn-visual-sample",
        examProfile: "ssc",
        forcedMotifId,
        generate: (options) =>
          createQuantV2PercentageQuestionCandidate(pattern, options),
      }).question as FormulaQuestion,
    );
  }

  const orderedQuestions = interleaveScheduledPreviewQuestions(
    questions,
    "percentage-venn-visual-sample",
    familyOf,
  );
  const visualIssues = orderedQuestions
    .filter((question) => familyOf(question) === "venn_diagram")
    .filter((question) => {
      const visual = visualOf(question);
      const regions = visual?.regions;
      return !visual ||
        visual.type !== "venn" ||
        !regions ||
        regions.onlyA + regions.onlyB + regions.both + regions.neither !== visual.universe;
    }).length;
  const summary = {
    exportName,
    folder: outDir,
    count,
    vennCount: orderedQuestions.filter((question) => familyOf(question) === "venn_diagram").length,
    visualAudit: visualIssues === 0 ? "pass" : `fail:${visualIssues}`,
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "corpus.txt"), renderText(exportName, orderedQuestions), "utf8");
  writeFileSync(join(outDir, "corpus.json"), JSON.stringify({ summary, questions: orderedQuestions }, null, 2), "utf8");
  writeFileSync(join(outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");
  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

if (process.argv[1]?.endsWith("percentage-venn-sample-export.mjs")) {
  runPercentageVennSampleExport();
}
