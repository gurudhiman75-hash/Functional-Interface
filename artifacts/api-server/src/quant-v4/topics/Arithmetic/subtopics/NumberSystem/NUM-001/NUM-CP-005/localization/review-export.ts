import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { NUM_CP005_PERMANENT_ALLOCATION } from "../permanent/allocation";
import { runNumCp005PermanentPipeline } from "../permanent/runtime";
import { generateNumCp005LocalizedQuestion } from "./runtime";
import type { NumCp005TranslatedLocale } from "./types";

const LOCALES = ["hi-IN", "pa-IN"] as const satisfies readonly NumCp005TranslatedLocale[];
const rows = LOCALES.flatMap((locale) =>
  NUM_CP005_PERMANENT_ALLOCATION.flatMap((allocation) =>
    [1, 2, 3].map((seed) => {
      const english = runNumCp005PermanentPipeline({
        questionLanguageId: allocation.qlId,
        seed,
      });
      const localized = generateNumCp005LocalizedQuestion({
        questionLanguageId: allocation.qlId,
        seed,
        locale,
      });
      return Object.freeze({ english, localized });
    }),
  ),
);

const outputDirectory = join(process.cwd(), "dist", "quant-v4");
mkdirSync(outputDirectory, { recursive: true });
const jsonPath = join(outputDirectory, "num-001-cp005-hi-pa-localisation-review.json");
const markdownPath = join(outputDirectory, "num-001-cp005-hi-pa-localisation-review.md");
const csvPath = join(outputDirectory, "num-001-cp005-hi-pa-localisation-review.csv");

writeFileSync(jsonPath, JSON.stringify(rows, null, 2));

const markdown = rows.map(({ english, localized }) => [
  `## ${localized.locale} — ${localized.questionLanguageId} — seed ${localized.seed}`,
  "",
  `- Authority: ${localized.authorityId}`,
  `- Solve mode: ${localized.solveModeId}`,
  `- Runtime prototype: ${localized.temporaryPrototypeId}`,
  `- Review status: ${localized.reviewStatus}`,
  `- Canonical English answer: ${english.canonicalAnswer}`,
  `- Localized answer: ${localized.canonicalAnswer}`,
  "",
  "### English authority",
  "",
  english.stem,
  "",
  "### Localized question",
  "",
  localized.stem,
  "",
  ...localized.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option.value}${option.isCorrect ? " ✓" : ""}`),
  "",
  `**Core concept:** ${localized.explanation.coreConcept}`,
  "",
  `**Strategy:** ${localized.explanation.givenDataAndStrategy}`,
  "",
  ...localized.explanation.stepByStep.map((step, index) => `${index + 1}. ${step}`),
  "",
  `**Speed method:** ${localized.explanation.examSpeedMethod}`,
  "",
  ...localized.explanation.commonTraps.map((trap) => `- ${trap}`),
  "",
  `**Final:** ${localized.explanation.finalAnswer}`,
].join("\n")).join("\n\n---\n\n");
writeFileSync(markdownPath, markdown);

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  return `"${text.replaceAll('"', '""')}"`;
}
const csv = [
  [
    "locale", "qlId", "seed", "authorityId", "solveModeId", "prototypeId",
    "difficulty", "representation", "englishStem", "localizedStem",
    "englishAnswer", "localizedAnswer", "reviewStatus",
  ],
  ...rows.map(({ english, localized }) => [
    localized.locale,
    localized.questionLanguageId,
    localized.seed,
    localized.authorityId,
    localized.solveModeId,
    localized.temporaryPrototypeId,
    localized.difficulty,
    localized.representation,
    english.stem,
    localized.stem,
    english.canonicalAnswer,
    localized.canonicalAnswer,
    localized.reviewStatus,
  ]),
].map((row) => row.map(csvCell).join(",")).join("\n");
writeFileSync(csvPath, csv);

console.log(JSON.stringify({
  status: "PASS_NUM_CP005_HI_PA_REVIEW_EXPORT",
  translatedLocaleCount: LOCALES.length,
  permanentQlCount: NUM_CP005_PERMANENT_ALLOCATION.length,
  reviewQuestionCount: rows.length,
  reviewQuestionsPerLocale: rows.length / LOCALES.length,
  jsonPath,
  markdownPath,
  csvPath,
}, null, 2));
