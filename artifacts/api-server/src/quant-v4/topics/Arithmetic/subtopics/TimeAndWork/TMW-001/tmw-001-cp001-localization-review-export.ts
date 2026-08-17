import { writeFileSync } from "node:fs";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { runTmwCp001Pipeline } from "./foundation/cp001-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const rows: any[] = [];
for (const entry of TMW_CP001_REGISTRY) {
  const seed = `tmw-cp001-localization-review:${entry.qlId}`;
  for (const language of ["hi", "pa"] as const satisfies readonly TmwLocalizedLanguage[]) {
    const question = runTmwCp001Pipeline({ questionLanguageId: entry.qlId, seed, language });
    if (!question.validation.valid) throw new Error(`${entry.qlId}:${language}: ${question.validation.errors.join(" | ")}`);
    rows.push({
      cpId: question.canonicalProblemId,
      qlId: question.questionLanguageId,
      solveMode: question.solveMode,
      language: question.language,
      locale: question.locale,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      answer: question.solution.answerText,
      opening: question.explanation.opening,
      formula: question.explanation.formula,
      steps: question.explanation.steps,
      shortcut: question.explanation.shortcut,
      commonTrap: question.explanation.commonTrap,
      conclusion: question.explanation.conclusion,
      fingerprint: question.mathematicalFingerprint,
      editorialStatus: question.editorialStatus,
      publiclyPublishable: question.publiclyPublishable,
    });
  }
}

const payload = {
  summary: {
    rows: rows.length,
    qls: new Set(rows.map((row) => row.qlId)).size,
    hindiRows: rows.filter((row) => row.language === "hi").length,
    punjabiRows: rows.filter((row) => row.language === "pa").length,
    publishableRows: rows.filter((row) => row.publiclyPublishable !== false).length,
  },
  rows,
};

writeFileSync("dist/quant-v4/tmw-001-cp001-localization-review.json", JSON.stringify(payload, null, 2));
console.log(JSON.stringify(payload.summary, null, 2));
if (payload.summary.rows !== 40 || payload.summary.qls !== 20 || payload.summary.hindiRows !== 20 || payload.summary.punjabiRows !== 20 || payload.summary.publishableRows !== 0) process.exitCode = 1;
