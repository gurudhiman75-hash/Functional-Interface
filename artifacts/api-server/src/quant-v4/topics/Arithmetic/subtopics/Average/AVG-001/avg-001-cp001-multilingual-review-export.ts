import fs from "node:fs";
import path from "node:path";

import {
  AVG_001_CP001_MULTILINGUAL_PILOT,
  getAvg001Cp001LocalizedQlIds,
  runAvg001Cp001LocalizationPilot,
} from "./foundation/cp001-localization-pilot-runtime";

const header = [
  "packageId", "cpId", "qlId", "language", "solveMode", "difficulty",
  "answerType", "questionId", "seed", "parameterFingerprint", "stem",
  "options", "correctIndex", "correctAnswer", "explanation", "stemNaturalness",
  "placeholderAccuracy", "mathematicalParity", "optionQuality", "explanationQuality",
  "scriptAccuracy", "examRelevance", "editorialStatus", "defectCategory",
  "reviewNotes", "reviewer", "reviewedAt",
];
const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;

for (const language of AVG_001_CP001_MULTILINGUAL_PILOT.languages) {
  const rows = [header.map(csv).join(",")];
  for (const questionLanguageId of getAvg001Cp001LocalizedQlIds()) {
    const seed = `avg-cp001-multilingual-review:${questionLanguageId}:0`;
    const pkg = runAvg001Cp001LocalizationPilot({
      questionLanguageId,
      seed,
      language,
    });
    rows.push([
      pkg.packageId,
      pkg.canonicalProblemId,
      pkg.questionLanguageId,
      pkg.language,
      pkg.solveMode,
      pkg.difficultyBand,
      pkg.parameters.answerType,
      pkg.questionId,
      pkg.seed,
      pkg.mathematicalFingerprint,
      pkg.stem,
      pkg.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join("\n"),
      pkg.correctIndex,
      pkg.answer,
      pkg.explanation.lines.join("\n"),
      "", "", "", "", "", "", "",
      AVG_001_CP001_MULTILINGUAL_PILOT.editorialStatus,
      "",
      `Candidate ${AVG_001_CP001_MULTILINGUAL_PILOT.releaseId}; not publishable until product-owner language review.`,
      "",
      "",
    ].map(csv).join(","));
  }

  const output = path.resolve(
    "src/quant-v4/topics/Arithmetic/subtopics/Average/AVG-001",
    `avg-001-cp001-human-review-${language}.csv`,
  );
  fs.writeFileSync(output, `${rows.join("\n")}\n`, "utf8");
  if (rows.length - 1 !== 80) {
    throw new Error(`Expected 80 ${language} CP-001 review rows; got ${rows.length - 1}`);
  }
  console.log(JSON.stringify({
    releaseId: AVG_001_CP001_MULTILINGUAL_PILOT.releaseId,
    language,
    rows: rows.length - 1,
    editorialStatus: AVG_001_CP001_MULTILINGUAL_PILOT.editorialStatus,
    output,
  }, null, 2));
}
