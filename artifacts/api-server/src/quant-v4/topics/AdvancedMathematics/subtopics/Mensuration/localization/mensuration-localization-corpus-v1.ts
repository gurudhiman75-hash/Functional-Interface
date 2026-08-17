import fs from "node:fs";
import path from "node:path";
import {
  MENSURATION_QUESTION_STUDIO_PATTERNS,
  generateMensurationLocalizedQuestionV1,
} from "./mensuration-localization-runtime-v1";

const rows: Array<Record<string, unknown>> = [];
for (const pattern of MENSURATION_QUESTION_STUDIO_PATTERNS) {
  for (let index = 0; index < 4; index += 1) {
    const question = generateMensurationLocalizedQuestionV1({
      patternId: pattern.patternId,
      seed: `mensuration-localization-corpus:${pattern.patternId}:${index}`,
      language: "en",
      examProfile: "SSC_CORE",
    });
    rows.push({
      cpId: question.cpId,
      packageId: question.packageId,
      patternId: question.patternId,
      patternKind: question.patternKind,
      qlId: question.qlId,
      solveMode: question.solveMode,
      difficultyBand: question.difficultyBand,
      stem: question.stem,
      options: question.options,
      correctIndex: question.correctIndex,
      answer: question.answer,
      explanation: question.explanation,
      seed: question.seed,
      realism: question.realism,
    });
  }
}

const outputDir = path.resolve(process.cwd(), "artifacts/api-server/dist/quant-v4");
fs.mkdirSync(outputDir, { recursive: true });
const outputPath = path.join(outputDir, "mensuration-localization-corpus-v1.json");
fs.writeFileSync(outputPath, JSON.stringify({
  authority: "MENSURATION-ENGLISH-LEARNER-SURFACE-FOR-LOCALIZATION-V1",
  patternCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  questionCount: rows.length,
  rows,
}, null, 2));
console.log(JSON.stringify({
  authority: "MENSURATION-ENGLISH-LEARNER-SURFACE-FOR-LOCALIZATION-V1",
  patternCount: MENSURATION_QUESTION_STUDIO_PATTERNS.length,
  questionCount: rows.length,
  outputPath,
}, null, 2));
