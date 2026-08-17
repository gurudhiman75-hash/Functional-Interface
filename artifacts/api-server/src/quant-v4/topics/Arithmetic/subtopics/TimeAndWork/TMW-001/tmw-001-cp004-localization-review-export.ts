import { writeFileSync } from "node:fs";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { runTmwCp004Pipeline } from "./foundation/cp004-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const rows = TMW_CP004_REGISTRY.flatMap((entry) => languages.map((language) => {
  const seed = `tmw-cp004-localization-review:${entry.qlId}`;
  const question = runTmwCp004Pipeline({ questionLanguageId: entry.qlId, seed, language });
  return {
    qlId: entry.qlId,
    cpId: entry.cpId,
    solveMode: entry.solveMode,
    difficulty: entry.difficulty,
    language,
    locale: question.locale,
    seed,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answerText: question.solution.answerText,
    opening: question.explanation.opening,
    formula: question.explanation.formula,
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
    qls: TMW_CP004_REGISTRY.length,
    hindiRows: rows.filter((row) => row.language === "hi").length,
    punjabiRows: rows.filter((row) => row.language === "pa").length,
    publishableRows: rows.filter((row) => row.publiclyPublishable).length,
    invalidRows: rows.filter((row) => !row.validation.valid).length,
  },
  rows,
};

writeFileSync("dist/quant-v4/tmw-001-cp004-localization-review.json", JSON.stringify(output, null, 2));
console.log(JSON.stringify(output.summary, null, 2));
