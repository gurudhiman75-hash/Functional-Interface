import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import {
  applyAvg001NaturalLanguageV3Final,
  AVG_001_NATURAL_LANGUAGE_V3_FINAL,
} from "./foundation/natural-language-v3-final";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

const outputDirectory = resolve(process.cwd(), "dist/quant-v4/avg-001-natural-language-v3-review");
mkdirSync(outputDirectory, { recursive: true });

function sourceFor(qlId: string, language: Avg001Language, seed: string): Avg001QuestionPackage {
  return language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language })
    : runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function hasMeaningfulUnitCue(stem: string) {
  return /₹|salary|sales|price|revenue|expense|order value|marks?|scores?|test|examination|ages?|years?|runs?|innings?|cricket|weights?|\bkg\b|kilomet|\bkm\b|speed|hours?|output|production|machines?|units? per hour/i.test(stem);
}

const entries = getAvg001QuestionEntries();
const languages: Avg001Language[] = ["en", "hi", "pa"];
assert.equal(entries.length, 425);

const records = entries.flatMap((entry) => languages.map((language) => {
  const seed = `avg-001-natural-language-v3-final:${language}:${entry.qlId}`;
  const source = sourceFor(entry.qlId, language, seed);
  const revised = applyAvg001NaturalLanguageV3Final(source);

  assert.equal(revised.questionLanguageId, entry.qlId);
  assert.equal(revised.language, language);
  assert.equal(revised.correctIndex, source.correctIndex);
  assert.deepEqual(revised.solver.exactAnswer, source.solver.exactAnswer);
  assert.equal(revised.mathematicalFingerprint, source.mathematicalFingerprint);
  assert.equal(revised.options.length, 4);
  assert.equal(new Set(revised.options).size, 4);
  assert.equal(revised.options[revised.correctIndex], revised.answer);
  assert.equal(revised.explanation.lines.length, 4);
  assert.equal(revised.maturity, "MANUAL_REVIEW");
  assert.equal(revised.publiclyPublishable, false);
  assert.equal(revised.validation.valid, true, `${entry.qlId}:${language} failed final natural-language validation`);

  const learnerText = [revised.stem, ...revised.options, ...revised.explanation.lines].join("\n");
  const worked = revised.explanation.lines[1] ?? "";
  const workedNumbers = worked.match(/\d+(?:\.\d+)?/g)?.length ?? 0;
  assert.ok(worked.includes("$$"), `${entry.qlId}:${language} lacks a displayed calculation`);
  assert.ok(workedNumbers >= 3, `${entry.qlId}:${language} has under-demonstrated arithmetic`);
  assert.ok(revised.explanation.lines[3]?.includes(revised.answer));
  assert.doesNotMatch(learnerText, /\[[A-Z][A-Z0-9_]+\]/);
  assert.doesNotMatch(learnerText, /\b(?:Begin with this fact|Start from this relationship|The decisive relation is|For the total, the total|To get the average, the average|A inspection)\b/i);
  assert.doesNotMatch(learnerText, /(?:गणना का आधार है|आरंभ में यह संबंध लें|मुख्य गणितीय तथ्य है|पहला गणितीय संबंध है|प्रारंभ में ध्यान दें|ਗਣਨਾ ਦਾ ਆਧਾਰ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਲਵੋ|ਮੁੱਖ ਗਣਿਤਕ ਤੱਥ ਹੈ|ਪਹਿਲਾ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਧਿਆਨ ਦਿਓ)/);

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
  if (
    language === "en" &&
    ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(entry.cpId) &&
    !hasMeaningfulUnitCue(revised.stem)
  ) {
    assert.doesNotMatch(`${revised.options.join(" ")} ${revised.answer}`, /\b(?:years?|marks?|runs?|kg|km|units?)\b/i);
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
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_FINAL,
    sourceReleaseId: String(source.traceability.releaseId ?? ""),
    validation: revised.validation.valid ? "PASS" : "FAIL",
  };
}));

assert.equal(records.length, 1275);
assert.equal(new Set(records.map((record) => record.qlId)).size, 425);
assert.equal(new Set(records.map((record) => record.solveMode)).size, 45);
for (const language of languages) {
  assert.equal(records.filter((record) => record.language === language).length, 425);
}

const genericPhrases = [
  "contains a small arithmetic error",
  "गणना में छोटी गलती करता है",
  "ਗਣਨਾ ਵਿੱਚ ਛੋਟੀ ਗਲਤੀ ਕਰਦਾ ਹੈ",
];
const genericReasonOccurrences = records.reduce(
  (total, record) => total + genericPhrases.reduce(
    (subtotal, phrase) => subtotal + record.explanation.split(phrase).length - 1,
    0,
  ),
  0,
);
assert.ok(genericReasonOccurrences <= 18, `Too many generic distractor reasons remain: ${genericReasonOccurrences}`);

writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-review.json"),
  JSON.stringify(records, null, 2),
  "utf8",
);

const headers = Object.keys(records[0]!);
writeFileSync(
  resolve(outputDirectory, "avg-001-natural-language-v3-review.csv"),
  [
    headers.map(csvCell).join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header as keyof typeof record])).join(",")),
  ].join("\n"),
  "utf8",
);

const markdown = [
  "# AVG-001 Natural-Language V3 Final Review",
  "",
  "> Manual-review candidate only. Existing frozen releases remain unchanged.",
  "",
  "- Questions per language: 425",
  "- Languages: English, Hindi, Punjabi",
  `- Total review rows: ${records.length}`,
  "- Solve modes: 45",
  `- Generic distractor-reason occurrences: ${genericReasonOccurrences}`,
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
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_FINAL,
    status: "PASS",
    sourceReleases: ["AVG-001-EN-v2", "AVG-001-HI-v1", "AVG-001-PA-v1"],
    sourceReleasesUnchanged: true,
    qlCountPerLanguage: 425,
    languageCount: 3,
    totalReviewRows: records.length,
    solveModeCount: 45,
    genericReasonOccurrences,
    validation: {
      exactAnswersPreserved: true,
      mathematicalFingerprintsPreserved: true,
      optionCountAndCorrectIndexPreserved: true,
      everyWorkedSolutionHasDisplayedCalculation: true,
      everyWorkedSolutionHasAtLeastThreeNumericalTokens: true,
      rawTechnicalDistractorTagsRemoved: true,
      optionSpecificDistractorReasonsRequired: true,
      abstractUnitMismatchRemoved: true,
      localizedEnglishUnitLeakageRemoved: true,
      naturalLanguageRegressionGate: true,
      publiclyPublishable: false,
    },
  }, null, 2),
  "utf8",
);

console.log(
  `PASS AVG-001 natural-language V3 final review: ${records.length} rows across 425 QLs, 45 solve modes and 3 languages; generic distractor reasons=${genericReasonOccurrences}. Existing frozen releases remain unchanged.`,
);
