import fs from "node:fs";
import path from "node:path";

import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationStudioQuestionV1,
} from "./mensuration-question-studio-runtime-v1";

export const MENSURATION_CHAPTER_WIDE_SATURATION_AUDIT_V1_AUTHORITY =
  "MENSURATION-CHAPTER-WIDE-SATURATION-AUDIT-V1" as const;

const SAMPLES_PER_PATTERN = 16;

function questionStateKey(question: ReturnType<typeof generateMensurationStudioQuestionV1>) {
  return [question.stem, ...question.options].join("\n");
}

function contentKey(question: ReturnType<typeof generateMensurationStudioQuestionV1>) {
  return [question.stem, question.answer, ...question.explanation.steps].join("\n");
}

const patternMetrics = MENSURATION_QUESTION_STUDIO_PATTERNS.map((pattern) => {
  const questions = Array.from({ length: SAMPLES_PER_PATTERN }, (_unused, index) =>
    generateMensurationStudioQuestionV1({
      patternId: pattern.patternId,
      seed: `mensuration-saturation-v1:${pattern.cpId}:${pattern.patternId}:${index}`,
    }),
  );
  const namespaceA = generateMensurationStudioQuestionV1({
    patternId: pattern.patternId,
    seed: `mensuration-seed-a:${pattern.patternId}:0`,
  });
  const namespaceB = generateMensurationStudioQuestionV1({
    patternId: pattern.patternId,
    seed: `mensuration-seed-b:${pattern.patternId}:0`,
  });
  const positionCounts = [0, 1, 2, 3].map((position) =>
    questions.filter((question) => question.correctIndex === position).length,
  );
  return {
    cpId: pattern.cpId,
    patternId: pattern.patternId,
    patternKind: pattern.patternKind,
    title: pattern.title,
    generatedCount: questions.length,
    distinctQuestionStateCount: new Set(questions.map(questionStateKey)).size,
    distinctStemCount: new Set(questions.map((question) => question.stem)).size,
    distinctContentCount: new Set(questions.map(contentKey)).size,
    answerPositionCounts: positionCounts,
    allFourAnswerPositionsExercised: positionCounts.every((count) => count > 0),
    namespaceSensitiveAtSameIndex: contentKey(namespaceA) !== contentKey(namespaceB),
    firstFourDistinctContentCount: new Set(questions.slice(0, 4).map(contentKey)).size,
    firstEightDistinctContentCount: new Set(questions.slice(0, 8).map(contentKey)).size,
    firstSixteenDistinctContentCount: new Set(questions.map(contentKey)).size,
    sampleStems: [...new Set(questions.map((question) => question.stem))].slice(0, 6),
  };
});

const cpIds = [...new Set(patternMetrics.map((row) => row.cpId))];
const cpSummaries = cpIds.map((cpId) => {
  const rows = patternMetrics.filter((row) => row.cpId === cpId);
  return {
    cpId,
    patternCount: rows.length,
    totalGenerated: rows.length * SAMPLES_PER_PATTERN,
    patternsWithAllFourAnswerPositions: rows.filter((row) => row.allFourAnswerPositionsExercised).length,
    namespaceInsensitivePatternCount: rows.filter((row) => !row.namespaceSensitiveAtSameIndex).length,
    firstFourSingleContentPatternCount: rows.filter((row) => row.firstFourDistinctContentCount === 1).length,
    fewerThanFourContentStatesAcross16: rows.filter((row) => row.distinctContentCount < 4).length,
    medianDistinctContentStatesAcross16: (() => {
      const values = rows.map((row) => row.distinctContentCount).sort((a, b) => a - b);
      return values[Math.floor(values.length / 2)] ?? 0;
    })(),
  };
});

const report = {
  authority: MENSURATION_CHAPTER_WIDE_SATURATION_AUDIT_V1_AUTHORITY,
  generatedAt: new Date().toISOString(),
  patternCount: patternMetrics.length,
  samplesPerPattern: SAMPLES_PER_PATTERN,
  totalGenerated: patternMetrics.length * SAMPLES_PER_PATTERN,
  global: {
    patternsWithAllFourAnswerPositions: patternMetrics.filter((row) => row.allFourAnswerPositionsExercised).length,
    namespaceInsensitivePatternCount: patternMetrics.filter((row) => !row.namespaceSensitiveAtSameIndex).length,
    firstFourSingleContentPatternCount: patternMetrics.filter((row) => row.firstFourDistinctContentCount === 1).length,
    fewerThanFourContentStatesAcross16: patternMetrics.filter((row) => row.distinctContentCount < 4).length,
    fullSixteenContentStates: patternMetrics.filter((row) => row.distinctContentCount === 16).length,
  },
  cpSummaries,
  lowEntropyPatterns: patternMetrics.filter(
    (row) =>
      row.firstFourDistinctContentCount === 1 ||
      row.distinctContentCount < 4 ||
      !row.namespaceSensitiveAtSameIndex,
  ),
  answerPositionGaps: patternMetrics.filter((row) => !row.allFourAnswerPositionsExercised),
  patternMetrics,
};

const outDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "mensuration-chapter-wide-saturation-audit-v1.json"),
  JSON.stringify(report, null, 2),
);
console.log(JSON.stringify({
  authority: report.authority,
  patternCount: report.patternCount,
  totalGenerated: report.totalGenerated,
  global: report.global,
  cpSummaries: report.cpSummaries,
  lowEntropyPatterns: report.lowEntropyPatterns.map((row) => ({
    cpId: row.cpId,
    patternId: row.patternId,
    distinctContentCount: row.distinctContentCount,
    firstFourDistinctContentCount: row.firstFourDistinctContentCount,
    namespaceSensitiveAtSameIndex: row.namespaceSensitiveAtSameIndex,
    sampleStems: row.sampleStems,
  })),
  answerPositionGapCount: report.answerPositionGaps.length,
}, null, 2));
