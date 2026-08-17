import { mkdirSync, writeFileSync } from "node:fs";
import { TMW_CP001_REGISTRY } from "./foundation/cp001-registry";
import { TMW_CP002_REGISTRY } from "./foundation/cp002-registry";
import { TMW_CP003_REGISTRY } from "./foundation/cp003-registry";
import { TMW_CP004_REGISTRY } from "./foundation/cp004-registry";
import { TMW_CP005_REGISTRY } from "./foundation/cp005-registry";
import { TMW_CP006_REGISTRY } from "./foundation/cp006-registry";
import { TMW_CP007_REGISTRY } from "./foundation/cp007-registry";
import { TMW_CP008_REGISTRY } from "./foundation/cp008-registry";
import { TMW_CP009_REGISTRY } from "./foundation/cp009-registry";
import { TMW_CP010_REGISTRY } from "./foundation/cp010-registry";
import { TMW_CP_011_REGISTRY } from "./foundation/cp011-registry";
import { runTmw001ChapterPipeline } from "./foundation/chapter-localized-runtime";
import type { TmwLocalizedLanguage } from "./foundation/localization-types";

const languages: readonly TmwLocalizedLanguage[] = ["hi", "pa"];
const registry = [
  ...TMW_CP001_REGISTRY,
  ...TMW_CP002_REGISTRY,
  ...TMW_CP003_REGISTRY,
  ...TMW_CP004_REGISTRY,
  ...TMW_CP005_REGISTRY,
  ...TMW_CP006_REGISTRY,
  ...TMW_CP007_REGISTRY,
  ...TMW_CP008_REGISTRY,
  ...TMW_CP009_REGISTRY,
  ...TMW_CP010_REGISTRY,
  ...TMW_CP_011_REGISTRY,
];

function ordinal(qlId: string): number {
  return Number(qlId.slice(-3));
}

function checkpointNumber(qlId: string): number {
  const value = ordinal(qlId);
  if (value <= 20) return 1;
  if (value <= 34) return 2;
  if (value <= 57) return 3;
  if (value <= 81) return 4;
  if (value <= 105) return 5;
  if (value <= 127) return 6;
  if (value <= 143) return 7;
  if (value <= 156) return 8;
  if (value <= 174) return 9;
  if (value <= 192) return 10;
  return 11;
}

function reviewSeed(qlId: string): string {
  const cp = checkpointNumber(qlId);
  return cp === 11
    ? `review-${qlId}-0`
    : `tmw-cp${String(cp).padStart(3, "0")}-localization:${qlId}:0`;
}

const rows = registry.flatMap((entry) => languages.map((language) => {
  const seed = reviewSeed(entry.qlId);
  const question = runTmw001ChapterPipeline({
    questionLanguageId: entry.qlId,
    seed,
    language,
  });
  return {
    qlId: entry.qlId,
    checkpoint: `TMW-CP-${String(checkpointNumber(entry.qlId)).padStart(3, "0")}`,
    solveMode: question.solveMode,
    difficulty: question.difficulty ?? entry.difficulty,
    language,
    locale: question.locale,
    seed,
    stem: question.stem,
    options: question.options,
    optionAudit: question.optionAudit,
    correctIndex: question.correctIndex,
    answerText: question.solution.answerText,
    opening: question.explanation.opening,
    formula: question.explanation.formula,
    givens: question.explanation.givens ?? [],
    steps: question.explanation.steps,
    shortcut: question.explanation.shortcut,
    commonTrap: question.explanation.commonTrap,
    conclusion: question.explanation.conclusion,
    mathematicalFingerprint: question.mathematicalFingerprint,
    validation: question.validation,
    editorialStatus: question.editorialStatus,
    publiclyPublishable: question.publiclyPublishable,
    reviewDecision: "AWAITING_HUMAN_REVIEW",
    reviewNotes: "",
    replacementStem: "",
    replacementExplanation: "",
  };
}));

const output = {
  summary: {
    chapter: "TMW-001",
    qlRange: "TMW-QL-001..TMW-QL-211",
    checkpoints: 11,
    qls: registry.length,
    rows: rows.length,
    hindiRows: rows.filter((row) => row.language === "hi").length,
    punjabiRows: rows.filter((row) => row.language === "pa").length,
    invalidRows: rows.filter((row) => !row.validation.valid).length,
    publishableRows: rows.filter((row) => row.publiclyPublishable).length,
    reviewStatus: "AWAITING_HUMAN_REVIEW",
  },
  rows,
};

const outputDirectory = "artifacts/api-server/dist/quant-v4";
mkdirSync(outputDirectory, { recursive: true });
writeFileSync(
  `${outputDirectory}/tmw-001-multilingual-chapter-review.json`,
  JSON.stringify(output, null, 2),
);
console.log(JSON.stringify(output.summary, null, 2));
