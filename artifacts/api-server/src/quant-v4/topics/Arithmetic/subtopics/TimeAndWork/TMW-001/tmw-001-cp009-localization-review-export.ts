import { mkdirSync, writeFileSync } from "node:fs";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { runTmwCp009LocalizedPipeline } from "./foundation/cp009-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const rows = TMW_CP009_REGISTRY.flatMap((entry) => languages.map((language) => {
  const seed = `tmw-cp009-localization-review:${entry.qlId}`;
  const question = runTmwCp009LocalizedPipeline({ questionLanguageId: entry.qlId, seed, language });
  return {
    qlId: entry.qlId,
    cpId: entry.cpId,
    solveMode: entry.solveMode,
    difficulty: entry.difficulty,
    answerType: entry.answerType,
    language,
    locale: question.locale,
    seed,
    stem: question.stem,
    options: question.options,
    optionKeys: question.optionAudit.map((option) => option.key),
    misconceptionIds: question.optionAudit.map((option) => option.misconceptionId),
    correctIndex: question.correctIndex,
    answerValues: question.solution.answerValues,
    answerKey: question.solution.answerKey,
    answerText: question.solution.answerText,
    opening: question.explanation.opening,
    formula: question.explanation.formula,
    givens: question.explanation.givens,
    steps: question.explanation.steps,
    shortcut: question.explanation.shortcut,
    commonTrap: question.explanation.commonTrap,
    conclusion: question.explanation.conclusion,
    mathematicalFingerprint: question.mathematicalFingerprint,
    validation: question.validation,
    editorialStatus: question.editorialStatus,
    publiclyPublishable: question.publiclyPublishable,
  };
}));

const output = {
  summary: {
    rows: rows.length,
    qls: TMW_CP009_REGISTRY.length,
    hindiRows: rows.filter((row) => row.language === "hi").length,
    punjabiRows: rows.filter((row) => row.language === "pa").length,
    publishableRows: rows.filter((row) => row.publiclyPublishable).length,
    invalidRows: rows.filter((row) => !row.validation.valid).length,
  },
  rows,
};

const outputDirectory = "artifacts/api-server/dist/quant-v4";
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(`${outputDirectory}/tmw-001-cp009-localization-review.json`, JSON.stringify(output, null, 2));
console.log(JSON.stringify(output.summary, null, 2));
