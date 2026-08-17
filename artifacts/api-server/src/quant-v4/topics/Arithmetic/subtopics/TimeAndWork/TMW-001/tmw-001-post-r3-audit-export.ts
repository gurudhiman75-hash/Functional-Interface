import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const qlIds = Array.from({ length: 211 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
const rows: any[] = [];

for (const qlId of qlIds) {
  for (const language of languages) {
    const seed = `post-r3-audit:${qlId}:${language}`;
    const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
    rows.push({
      qlId,
      cpId: q.canonicalProblemId ?? q.cpId ?? null,
      solveMode: q.solveMode ?? null,
      difficulty: q.difficulty ?? null,
      language,
      seed,
      stem: q.stem,
      options: q.options,
      correctIndex: q.correctIndex,
      solvedAnswer: q.solution?.answerText ?? q.answerText ?? null,
      learnerExplanationVersion: q.learnerExplanationVersion ?? null,
      learnerExplanation: q.learnerExplanation ?? null,
      validation: q.validation,
      publiclyPublishable: q.publiclyPublishable,
    });
  }
}

const output = process.argv[2] ?? "dist/quant-v4/tmw-001-post-r3-audit-samples.json";
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify({
  chapter: "TMW-001",
  generatedAt: new Date().toISOString(),
  qls: qlIds.length,
  languages: languages.length,
  rows: rows.length,
  samples: rows,
}, null, 2));
console.log(JSON.stringify({ output, qls: qlIds.length, languages: languages.length, rows: rows.length, verdict: "EXPORTED" }));
