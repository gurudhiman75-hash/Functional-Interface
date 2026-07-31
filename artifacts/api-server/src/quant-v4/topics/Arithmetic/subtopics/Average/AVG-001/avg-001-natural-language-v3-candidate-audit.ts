import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import {
  applyAvg001NaturalLanguageV3Review,
  AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
} from "./foundation/natural-language-v3-review";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

const out = resolve(process.cwd(), "dist/quant-v4/avg-001-natural-language-v3-review");
mkdirSync(out, { recursive: true });
const languages: Avg001Language[] = ["en", "hi", "pa"];
const entries = getAvg001QuestionEntries();
assert.equal(entries.length, 425);

function sourceFor(qlId: string, language: Avg001Language, seed: string): Avg001QuestionPackage {
  return language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language })
    : runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function hasUnitCue(stem: string) {
  return /₹|salary|sales|price|revenue|expense|order value|marks?|scores?|test|examination|ages?|years?|runs?|innings?|cricket|weights?|\bkg\b|kilomet|\bkm\b|speed|hours?|output|production|machines?|units? per hour/i.test(stem);
}

function numericDisplay(value: string) {
  return value.replaceAll(",", "").match(/-?\d+(?:\.\d+)?/)?.[0] ?? value;
}

const records = entries.flatMap((entry) => languages.map((language) => {
  const seed = `avg-001-natural-language-v3-review:${language}:${entry.qlId}`;
  const source = sourceFor(entry.qlId, language, seed);
  const question = applyAvg001NaturalLanguageV3Review(source);

  assert.equal(question.questionLanguageId, entry.qlId);
  assert.equal(question.language, language);
  assert.equal(question.correctIndex, source.correctIndex);
  assert.deepEqual(question.solver.exactAnswer, source.solver.exactAnswer);
  assert.equal(question.mathematicalFingerprint, source.mathematicalFingerprint);
  assert.equal(question.options.length, 4);
  assert.equal(new Set(question.options).size, 4);
  assert.equal(new Set(question.options.map(numericDisplay)).size, 4, `${entry.qlId}:${language} has numerically duplicate options`);
  assert.equal(question.options[question.correctIndex], question.answer);
  assert.equal(question.explanation.lines.length, 4);
  assert.equal(question.maturity, "MANUAL_REVIEW");
  assert.equal(question.publiclyPublishable, false);
  assert.equal(question.validation.valid, true, `${entry.qlId}:${language} failed V3.2 review validation`);

  const text = [question.stem, ...question.options, ...question.explanation.lines].join("\n");
  const worked = question.explanation.lines[1] ?? "";
  assert.ok(worked.includes("$$"), `${entry.qlId}:${language} lacks displayed arithmetic`);
  assert.ok((worked.match(/\d+(?:\.\d+)?/g)?.length ?? 0) >= 3, `${entry.qlId}:${language} under-demonstrates arithmetic`);
  assert.ok(question.explanation.lines[3]?.includes(question.answer));
  assert.doesNotMatch(text, /\[[A-Z][A-Z0-9_]+\]/);
  assert.doesNotMatch(text, /\b(?:Begin with this fact|Start from this relationship|The decisive relation is|For the total, the total|To get the average, the average|A inspection)\b/i);
  assert.doesNotMatch(text, /(?:गणना का आधार है|आरंभ में यह संबंध लें|मुख्य गणितीय तथ्य है|पहला गणितीय संबंध है|प्रारंभ में ध्यान दें|ਗਣਨਾ ਦਾ ਆਧਾਰ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਇਹ ਸੰਬੰਧ ਲਵੋ|ਮੁੱਖ ਗਣਿਤਕ ਤੱਥ ਹੈ|ਪਹਿਲਾ ਗਣਿਤਕ ਸੰਬੰਧ ਹੈ|ਸ਼ੁਰੂ ਵਿੱਚ ਧਿਆਨ ਦਿਓ)/);
  assert.doesNotMatch(text, /ज्ञात पहले से ज्ञात कुल|ਜਾਣਿਆ ਪਹਿਲਾਂ ਤੋਂ ਜਾਣਿਆ ਕੁੱਲ/);
  assert.doesNotMatch(text, /(?<!\\)(?:div|times)(?=[0-9\s({])/);

  if (language !== "en") {
    assert.doesNotMatch(text, /\b(?:units?|marks?|years?|runs?|operating days?)\b/i);
    assert.doesNotMatch(text, /\\text\{(?:Endpoint mean|middle term|Old total|new average|New average|Added value|Removed value|Total change|old value|new value|Required runs|Original count|Combined average|Missing average|Missing count|Subgroup total|Overall total|Steps on one side|Required term)\}/);
  }
  if (language === "hi") assert.doesNotMatch(text, /भार दिया जाता है|भार दें/);
  if (language === "pa") assert.doesNotMatch(text, /ਭਾਰ ਦਿੱਤਾ ਜਾਂਦਾ ਹੈ|ਭਾਰ ਦਿਓ/);
  if (language === "en" && entry.solveMode === "findInningsValueOrNewCricketAverage") {
    assert.doesNotMatch(`${question.options.join(" ")} ${question.answer}`, /\bmarks?\b/i);
  }
  if (
    language === "en" &&
    ["AVG-CP-001", "AVG-CP-002", "AVG-CP-003"].includes(entry.cpId) &&
    !hasUnitCue(question.stem)
  ) {
    assert.doesNotMatch(`${question.options.join(" ")} ${question.answer}`, /\b(?:years?|marks?|runs?|kg|km|units?)\b/i);
  }

  return {
    packageId: question.packageId,
    cpId: question.canonicalProblemId,
    qlId: question.questionLanguageId,
    language: question.language,
    solveMode: question.solveMode,
    difficulty: question.difficultyBand,
    answerType: question.parameters.answerType,
    seed: question.seed,
    stem: question.stem,
    options: question.options.join("\n"),
    correctIndex: question.correctIndex,
    correctAnswer: question.answer,
    explanation: question.explanation.lines.join("\n"),
    mathematicalFingerprint: question.mathematicalFingerprint,
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
    sourceReleaseId: String(source.traceability.releaseId ?? ""),
    validation: question.validation.valid ? "PASS" : "FAIL",
  };
}));

assert.equal(records.length, 1275);
assert.equal(new Set(records.map((record) => record.qlId)).size, 425);
assert.equal(new Set(records.map((record) => record.solveMode)).size, 45);
for (const language of languages) assert.equal(records.filter((record) => record.language === language).length, 425);

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
assert.equal(genericReasonOccurrences, 0, `Generic distractor reasons remain: ${genericReasonOccurrences}`);

writeFileSync(resolve(out, "avg-001-natural-language-v3-review.json"), JSON.stringify(records, null, 2), "utf8");
const headers = Object.keys(records[0]!);
writeFileSync(
  resolve(out, "avg-001-natural-language-v3-review.csv"),
  [headers.map(csvCell).join(","), ...records.map((record) => headers.map((header) => csvCell(record[header as keyof typeof record])).join(","))].join("\n"),
  "utf8",
);
const markdown = [
  "# AVG-001 Natural-Language V3.2 Review",
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
writeFileSync(resolve(out, "avg-001-natural-language-v3-review.md"), markdown, "utf8");
writeFileSync(resolve(out, "avg-001-natural-language-v3-summary.json"), JSON.stringify({
  packageId: "AVG-001",
  reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_REVIEW,
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
    optionNumericalUniquenessRequired: true,
    everyWorkedSolutionHasDisplayedCalculation: true,
    everyWorkedSolutionHasAtLeastThreeNumericalTokens: true,
    rawTechnicalDistractorTagsRemoved: true,
    contextualDistractorReasonsRequired: true,
    abstractUnitMismatchRemoved: true,
    localizedEnglishUnitLeakageRemoved: true,
    localizedMathLabelsRequired: true,
    bareMathJaxOperatorsRejected: true,
    publiclyPublishable: false,
  },
}, null, 2), "utf8");

console.log(`PASS AVG-001 natural-language V3.2 review: ${records.length} rows; generic distractor reasons=${genericReasonOccurrences}. Existing frozen releases remain unchanged.`);
