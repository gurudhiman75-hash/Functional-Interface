import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

const qls = Array.from({ length: 19 }, (_, index) => `TMW-QL-${String(index + 193).padStart(3, "0")}`);
const languages: readonly Tmw001ChapterLanguage[] = ["hi", "pa"];
const seeds = ["0", "1"] as const;

const rows = [];
for (const qlId of qls) {
  for (const language of languages) {
    for (const seedSuffix of seeds) {
      const seed = `tmw-cp011-editorial-review:${qlId}:${language}:${seedSuffix}`;
      const question = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      rows.push({
        qlId,
        checkpoint: question.canonicalProblemId,
        solveMode: question.solveMode,
        language,
        seed,
        stem: question.stem,
        options: question.options,
        correctIndex: question.correctIndex,
        answer: question.solution?.answerText,
        parameters: question.parameters,
        solution: question.solution,
        learnerExplanation: question.learnerExplanation,
        explanation: question.explanation,
        validation: question.validation,
        editorialStatus: question.editorialStatus,
        publiclyPublishable: question.publiclyPublishable,
      });
    }
  }
}

const output = resolve("dist/quant-v4/tmw-001-cp011-multilingual-editorial-review.json");
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, `${JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-011",
  qls: qls.length,
  languages,
  seedsPerQlLanguage: seeds.length,
  rows: rows.length,
  reviewState: "ASSISTANT_EDITORIAL_REVIEW",
  packages: rows,
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ output, rows: rows.length, qls: qls.length, languages: languages.length }, null, 2));
