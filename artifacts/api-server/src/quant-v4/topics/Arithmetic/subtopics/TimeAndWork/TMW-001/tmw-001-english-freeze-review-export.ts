import { writeFileSync } from "node:fs";
import {
  TMW_ENGLISH_ADAPTERS,
  classifyTmwEnglishOpening,
  hasTmwEnglishFourTierExplanation,
  tmwEnglishExplanationParts,
} from "./foundation/english-freeze-adapter";

const rows: any[] = [];
const styleCounts = new Map<string, number>();
let previousStyle = "";
let currentRun = 0;
let longestRun = 0;

for (const adapter of TMW_ENGLISH_ADAPTERS) {
  for (const entry of adapter.registry) {
    let question: any | undefined;
    for (let attempt = 0; attempt < 100; attempt += 1) {
      const candidate = adapter.run(entry.qlId, `english-freeze-review-${entry.qlId}-${attempt}`);
      if (candidate.validation?.valid) {
        question = candidate;
        break;
      }
    }
    if (!question) throw new Error(`No valid review candidate found for ${entry.qlId}`);
    const style = classifyTmwEnglishOpening(question.stem);
    styleCounts.set(style, (styleCounts.get(style) ?? 0) + 1);
    if (style === previousStyle) currentRun += 1;
    else {
      previousStyle = style;
      currentRun = 1;
    }
    longestRun = Math.max(longestRun, currentRun);
    const explanation = question.explanation ?? {};
    rows.push({
      cpId: adapter.cpId,
      qlId: entry.qlId,
      solveMode: entry.solveMode,
      answerType: entry.answerType,
      ruleId: entry.ruleId,
      difficulty: entry.difficulty,
      openingStyle: style,
      hasFourTierExplanation: hasTmwEnglishFourTierExplanation(question),
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      correctAnswer: question.solution?.answerText ?? question.options[question.correctIndex],
      opening: explanation.opening ?? "",
      formula: explanation.formula ?? "",
      givens: explanation.givens ?? [],
      standardSteps: explanation.steps ?? [],
      shortcutTitle: explanation.shortcut?.title ?? "",
      shortcutSteps: explanation.shortcut?.steps ?? [],
      commonTrap: explanation.commonTrap ?? null,
      conclusion: explanation.conclusion ?? "",
      mathematicalFingerprint: question.mathematicalFingerprint,
      validationStatus: question.validation?.valid ? "PASS" : "FAIL",
      learnerExplanationParts: tmwEnglishExplanationParts(question).length,
      publiclyPublishable: question.publiclyPublishable,
    });
  }
}

const payload = {
  summary: {
    rows: rows.length,
    qls: new Set(rows.map((row) => row.qlId)).size,
    checkpoints: new Set(rows.map((row) => row.cpId)).size,
    openingStyles: Object.fromEntries(styleCounts),
    longestSameStyleRun: longestRun,
    fourTierRows: rows.filter((row) => row.hasFourTierExplanation).length,
    validRows: rows.filter((row) => row.validationStatus === "PASS").length,
    publishableRows: rows.filter((row) => row.publiclyPublishable !== false).length,
  },
  rows,
};

writeFileSync("dist/quant-v4/tmw-001-english-freeze-review.json", JSON.stringify(payload, null, 2));
console.log(JSON.stringify(payload.summary, null, 2));
if (payload.summary.rows !== 211 || payload.summary.validRows !== 211 || payload.summary.publishableRows !== 0) process.exitCode = 1;
