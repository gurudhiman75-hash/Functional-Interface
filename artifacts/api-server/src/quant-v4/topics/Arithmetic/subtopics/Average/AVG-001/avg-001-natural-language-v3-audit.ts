import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import {
  applyAvg001NaturalLanguageV3Polish,
  AVG_001_NATURAL_LANGUAGE_V3_POLISH,
} from "./foundation/natural-language-v3-polish";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/avg-001-natural-language-v3-review");
mkdirSync(outputDirectory, { recursive: true });

function generateSource(qlId: string, language: Avg001Language, seed: string): Avg001QuestionPackage {
  if (language === "en") {
    return runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language });
  }
  return runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
}

function csvCell(value: unknown) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

const entries = getAvg001QuestionEntries();
assert.equal(entries.length, 425);
const languages: Avg001Language[] = ["en", "hi", "pa"];

const records = entries.flatMap((entry) => languages.map((language) => {
  const seed = `avg-001-natural-language-v3:${language}:${entry.qlId}`;
  const source = generateSource(entry.qlId, language, seed);
  const revised = applyAvg001NaturalLanguageV3Polish(source);

  assert.equal(revised.questionLanguageId, entry.qlId);
  assert.equal(revised.language, language);
  assert.equal(revised.correctIndex, source.correctIndex);
  assert.deepEqual(revised.solver.exactAnswer, source.solver.exactAnswer);
  assert.equal(revised.mathematicalFingerprint, source.mathematicalFingerprint);
  assert.equal(revised.options.length, 4);
  assert.equal(new Set(revised.options).size, 4);
  assert.equal(revised.options[revised.correctIndex], revised.answer);
  assert.equal(revised.explanation.lines.length, 4);
  assert.ok(revised.explanation.lines[1]?.includes("$$"));
  assert.ok(revised.explanation.lines[3]?.includes(revised.answer));
  assert.equal(revised.maturity, "MANUAL_REVIEW");
  assert.equal(revised.publiclyPublishable, false);
  assert.equal(revised.validation.valid, true, `${entry.qlId}:${language} failed natural-language validation`);

  const learnerText = [revised.stem, ...revised.options, ...revised.explanation.lines].join("\n");
  assert.doesNotMatch(learnerText, /\[[A-Z][A-Z0-9_]+\]/);
  assert.doesNotMatch(learnerText, /\b(?:Begin with this fact|Start from this relationship|The decisive relation is|For the total, the total|To get the average, the average|A inspection)\b/i);
  assert.doesNotMatch(learnerText, /(?:मुख्य गणितीय तथ्य है|पहला गणितीय संबंध है|प्रारंभ में ध्यान दें|गणना शुरू करते हुए|ਮੁੱਖ ਗਣਿਤਕ ਤੱਥ ਹੈ|ਪਹਿਲਾ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਧਿਆਨ ਦਿਓ|ਗਣਨਾ ਸ਼ੁਰੂ ਕਰਦੇ ਹੋਏ)/);
  if (language === "hi") {
    assert.doesNotMatch(learnerText, /भार दिया जाता है|भार दें/);
    assert.doesNotMatch(learnerText, /\b(?:units?|marks?|years?|runs?|operating days?)\b/i);
  }
  if (language === "pa") {
    assert.doesNotMatch(learnerText, /ਭਾਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ|ਭਾਰ ਦਿਓ/);
    assert.doesNotMatch(learnerText, /\b(?:units?|marks?|years?|runs?|operating days?)\b/i);
  }
  if (language === "en" && entry.solveMode === "findInningsValueOrNewCricketAverage") {
    assert.doesNotMatch(`${revised.options.join(" ")} ${revised.answer}`, /\bmarks?\b/i);
  }

  return {
    packageId: revised.packageId,
    cpId: revised.canonicalProblemId,
    qlId: revised.questionLanguageId,
    language: revised.language,
    solveMode: revised.solveMode,
    difficulty: revised.difficultyBand,
    answerType: revised.parameters.answerType,
    seed: revised.seed,
    stem: revised.stem,
    options: revised.options.join("\n"),
    correctIndex: revised.correctIndex,
    correctAnswer: revised.answer,
    explanation: revised.explanation.lines.join("\n"),
    mathematicalFingerprint: revised.mathematicalFingerprint,
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_POLISH,
    sourceReleaseId: String(source.traceability.releaseId ?? ""),
    validation: revised.validation.valid ? "PASS" : "FAIL",
  };
}));

assert.equal(records.length, 1275);
for (const language of languages) {
  assert.equal(records.filter((record) => record.language === language).length, 425);
}
assert.equal(new Set(records.map((record) => record.qlId)).size, 425);
assert.equal(new Set(records.map((record) => record.solveMode)).size, 45);

writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-review.json"),
  JSON.stringify(records, null, 2),
  "utf8",
);

const headers = Object.keys(records[0]!);
const csv = [
  headers.map(csvCell).join(","),
  ...records.map((record) => headers.map((header) => csvCell(record[header as keyof typeof record])).join(",")),
].join("\n");
writeFileSync(resolve(outputDirectory, "avg-001-natural-language-v3-review.csv"), csv, "utf8");

const markdown = [
  "# AVG-001 Natural-Language V3 Review",
  "",
  "> Manual-review candidate only. Existing frozen releases remain unchanged.",
  "",
  "- Questions per language: 425",
  "- Languages: English, Hindi, Punjabi",
  `- Total review rows: ${records.length}`,
  "- Solve modes: 45",
  "",
  ...records.flatMap((record, index) => [
    `## ${index + 1}. ${record.qlId} — ${record.language}`,
    "",
    `- CP: \`${record.cpId}\``,
    `- Solve mode: \`${record.solveMode}\``,
    `- Difficulty: \`${record.difficulty}\``,
    `- Seed: \`${record.seed}\``,
    "",
    `**Question:** ${record.stem}`,
    "",
    ...record.options.split("\n").map((option, optionIndex) => `- ${String.fromCharCode(65 + optionIndex)}. ${option}`),
    "",
    `**Correct answer:** ${record.correctAnswer}`,
    "",
    ...record.explanation.split("\n"),
    "",
    "---",
    "",
  ]),
].join("\n");
writeFileSync(resolve(outputDirectory, "avg-001-natural-language-v3-review.md"), markdown, "utf8");

writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-summary.json"),
  JSON.stringify({
    packageId: "AVG-001",
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_POLISH,
    status: "PASS",
    sourceReleases: ["AVG-001-EN-v2", "AVG-001-HI-v1", "AVG-001-PA-v1"],
    sourceReleasesUnchanged: true,
    qlCountPerLanguage: 425,
    languageCount: 3,
    totalReviewRows: records.length,
    solveModeCount: 45,
    validation: {
      exactAnswersPreserved: true,
      mathematicalFingerprintsPreserved: true,
      optionCountAndCorrectIndexPreserved: true,
      rawTechnicalDistractorTagsRemoved: true,
      demonstratedCalculationsRequired: true,
      localizedEnglishUnitLeakageRemoved: true,
      localizedDistractorReasonsRecovered: true,
      equationOnlyLocalizedShortcutsRemoved: true,
      naturalLanguageRegressionGate: true,
      publiclyPublishable: false,
    },
  }, null, 2),
  "utf8",
);

console.log(`PASS AVG-001 natural-language V3 polished review: ${records.length} rows across 425 QLs, 45 solve modes and 3 languages. Existing frozen releases remain unchanged.`);
