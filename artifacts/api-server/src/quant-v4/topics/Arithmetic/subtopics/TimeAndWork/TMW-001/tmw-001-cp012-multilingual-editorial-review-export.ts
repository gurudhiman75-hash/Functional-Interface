import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

const qls = ["TMW-QL-212", "TMW-QL-213", "TMW-QL-214", "TMW-QL-215"] as const;
const languages: readonly Tmw001ChapterLanguage[] = ["hi", "pa"];
const seeds = ["0", "1", "2", "3"] as const;
const packages = [];

for (const qlId of qls) {
  for (const language of languages) {
    for (const suffix of seeds) {
      const seed = `tmw-cp012-editorial-review:${qlId}:${suffix}`;
      const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
      packages.push({
        qlId,
        checkpoint: q.canonicalProblemId,
        solveMode: q.solveMode,
        language,
        seed,
        stem: q.stem,
        options: q.options,
        correctIndex: q.correctIndex,
        answer: q.solution?.answerText,
        parameters: q.parameters,
        solution: q.solution,
        learnerExplanationVersion: q.learnerExplanationVersion,
        learnerExplanation: q.learnerExplanation,
        explanation: q.explanation,
        validation: q.validation,
        editorialStatus: q.editorialStatus,
        publiclyPublishable: q.publiclyPublishable,
      });
    }
  }
}

const output = resolve("dist/quant-v4/tmw-001-cp012-multilingual-editorial-review.json");
mkdirSync(resolve("dist/quant-v4"), { recursive: true });
writeFileSync(output, `${JSON.stringify({
  chapter: "TMW-001",
  checkpoint: "TMW-CP-012",
  qls: qls.length,
  languages,
  seedsPerQlLanguage: seeds.length,
  rows: packages.length,
  reviewState: "ASSISTANT_EDITORIAL_REVIEW",
  packages,
}, null, 2)}\n`, "utf8");

console.log(JSON.stringify({ output, rows: packages.length, qls: qls.length, languages: languages.length }, null, 2));
