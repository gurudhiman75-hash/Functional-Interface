import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { FormulaQuestion } from "../../lib/core/generator-engine";
import { createQuantV2ProfitLossQuestionCandidate } from "../../lib/quant-v2/profit-loss-admin-adapter";
import { resolveQuestionPatternToPattern } from "../../lib/pattern-registry";
import {
  createCorpusSchedulerState,
  generateScheduledQuestion,
} from "../corpus-scheduler/corpus-scheduler";

function timestamp() {
  return new Date().toISOString()
    .replace(/[-:]/gu, "")
    .replace(/\..+$/u, "")
    .replace("T", "-");
}

function answerText(question: FormulaQuestion) {
  return String(question.options?.[question.correct ?? 0] ?? "");
}

function hasUglyDecimalAnswer(question: FormulaQuestion) {
  const decimals = answerText(question).match(/\d+\.\d+/gu) ?? [];
  return decimals.some((value) => {
    const [, decimal = ""] = value.split(".");
    if (decimal.length <= 1) return false;
    return !/^(25|33|5|50|67|75)$/u.test(decimal);
  });
}

function allText(question: FormulaQuestion) {
  return [
    question.text,
    question.textHi,
    question.textPa,
    question.explanation,
    question.explanationHi,
    question.explanationPa,
    ...(question.options ?? []),
    ...((question as any).optionsHi ?? []),
    ...((question as any).optionsPa ?? []),
  ].filter(Boolean).join("\n");
}

function renderText(exportName: string, questions: FormulaQuestion[]) {
  const lines = [
    "# Profit/Loss Admin Batch Export",
    "",
    `Export: ${exportName}`,
    `Count: ${questions.length}`,
    "Multilingual explanations: yes",
    "",
  ];

  questions.forEach((question, index) => {
    const quantV2 = question.debugMetadata?.quantV2 as any;
    lines.push(
      `[Q${index + 1}]`,
      `Family: ${quantV2?.canonicalProblem?.family ?? "unknown"}`,
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

export function runProfitLossAdminBatchExport() {
  const count = 50;
  const exportName = `profit-loss-admin-polish-50-${timestamp()}`;
  const outDir = join(process.cwd(), "exports", exportName);
  const pattern = resolveQuestionPatternToPattern({
    domain: "quant",
    topic: "profit-loss",
    pattern: "profit-loss",
    difficulty: "medium",
    examStyle: "ssc",
  });

  if (!pattern) {
    throw new Error("Profit/Loss registry pattern could not be resolved.");
  }

  const state = createCorpusSchedulerState({
    targetCount: count,
    profileId: "balanced_mock",
  });
  const questions = Array.from({ length: count }, (_, index) =>
    generateScheduledQuestion({
      state,
      index,
      seedPrefix: "profit-loss-admin-polish",
      examProfile: "ssc",
      generate: (options) =>
        createQuantV2ProfitLossQuestionCandidate(pattern, options),
    }).question as FormulaQuestion,
  );

  const familyDistribution: Record<string, number> = {};
  let uglyDecimalCount = 0;
  let grammarLeaks = 0;
  let punjabiTermLeaks = 0;
  let noProfitLossLeaks = 0;

  for (const question of questions) {
    const family = String((question.debugMetadata?.quantV2 as any)?.canonicalProblem?.family ?? "unknown");
    familyDistribution[family] = (familyDistribution[family] ?? 0) + 1;
    const text = allText(question);
    if (hasUglyDecimalAnswer(question)) uglyDecimalCount += 1;
    if (/watchs/iu.test(text)) grammarLeaks += 1;
    if (/ਲਾਗਤ ਮੁੱਲ|ਵੇਚਣ ਮੁੱਲ/u.test(text)) punjabiTermLeaks += 1;
    if (/(?<!\d)0%\s*(profit|loss)/iu.test(text)) noProfitLossLeaks += 1;
  }

  const summary = {
    exportName,
    count,
    familyDistribution,
    uglyDecimalCount,
    grammarScan: grammarLeaks === 0 ? "pass" : `fail:${grammarLeaks}`,
    punjabiTermScan: punjabiTermLeaks === 0 ? "pass" : `fail:${punjabiTermLeaks}`,
    noProfitNoLossScan: noProfitLossLeaks === 0 ? "pass" : `fail:${noProfitLossLeaks}`,
  };

  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "corpus.txt"), renderText(exportName, questions), "utf8");
  writeFileSync(join(outDir, "corpus.json"), JSON.stringify({ summary, questions }, null, 2), "utf8");
  writeFileSync(join(outDir, "summary.json"), JSON.stringify(summary, null, 2), "utf8");

  console.log(JSON.stringify(summary, null, 2));
  return summary;
}

if (process.argv[1]?.endsWith("profit-loss-admin-batch-export.mjs")) {
  runProfitLossAdminBatchExport();
}
