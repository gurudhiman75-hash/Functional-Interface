import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { runTmw001ChapterPipeline, type Tmw001ChapterLanguage } from "./foundation/chapter-localized-runtime";

const languages: readonly Tmw001ChapterLanguage[] = ["en", "hi", "pa"];
const qlIds = Array.from({ length: 228 }, (_, index) => `TMW-QL-${String(index + 1).padStart(3, "0")}`);
const samples: any[] = [];

function auditSeed(qlId: string, language: Tmw001ChapterLanguage): string {
  return qlId === "TMW-QL-227" || qlId === "TMW-QL-228"
    ? `tmw-final-228-audit:TMW-CASELET-001:${language}`
    : `tmw-final-228-audit:${qlId}:${language}`;
}

for (const qlId of qlIds) {
  for (const language of languages) {
    const seed = auditSeed(qlId, language);
    const q = runTmw001ChapterPipeline({ questionLanguageId: qlId, language, seed });
    const explanation = q.learnerExplanation ?? q.explanation ?? null;
    samples.push({
      qlId,
      cpId: q.canonicalProblemId ?? q.cpId ?? null,
      solveMode: q.solveMode ?? null,
      difficulty: q.difficulty ?? null,
      representation: q.representation ?? "STANDARD_MCQ",
      answerSemantic: q.answerSemantic ?? q.solution?.answerType ?? null,
      language,
      seed,
      stem: q.stem,
      presentationBlocks: q.presentationBlocks ?? null,
      caseletGroupId: q.caseletGroupId ?? null,
      caseletStimulus: q.caseletStimulus ?? null,
      groupGenerationRequired: q.groupGenerationRequired ?? false,
      caseletItemIndex: q.caseletItemIndex ?? null,
      options: q.options,
      correctIndex: q.correctIndex,
      solvedAnswer: q.solution?.answerText ?? q.answerText ?? q.canonicalAnswer ?? null,
      learnerExplanationVersion: q.learnerExplanationVersion ?? null,
      explanation,
      mathematicalFingerprint: q.mathematicalFingerprint ?? null,
      validation: q.validation,
      publiclyPublishable: q.publiclyPublishable,
    });
  }
}

for (const language of languages) {
  const q227 = samples.find((sample) => sample.qlId === "TMW-QL-227" && sample.language === language);
  const q228 = samples.find((sample) => sample.qlId === "TMW-QL-228" && sample.language === language);
  if (!q227 || !q228 || q227.caseletStimulus !== q228.caseletStimulus || q227.seed !== q228.seed) {
    throw new Error(`Final export caselet pair is inconsistent for ${language}`);
  }
}

const output = process.argv[2] ?? "dist/quant-v4/tmw-001-final-228ql-audit.json";
mkdirSync(dirname(output), { recursive: true });
writeFileSync(output, JSON.stringify({
  chapter: "TMW-001",
  generatedAt: new Date().toISOString(),
  qls: qlIds.length,
  languages: languages.length,
  rows: samples.length,
  qlRange: "TMW-QL-001..TMW-QL-228",
  pairedCaseletExport: true,
  publicationLocked: samples.every((sample) => sample.publiclyPublishable === false),
  validPackages: samples.filter((sample) => sample.validation?.valid).length,
  samples,
}, null, 2));
console.log(JSON.stringify({
  output,
  qls: qlIds.length,
  languages: languages.length,
  rows: samples.length,
  validPackages: samples.filter((sample) => sample.validation?.valid).length,
  pairedCaseletExport: true,
  publicationLocked: samples.every((sample) => sample.publiclyPublishable === false),
  verdict: "EXPORTED",
}));
