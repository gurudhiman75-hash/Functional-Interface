import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../question-studio-generation-engine";
import {
  SAP_QUESTION_STUDIO_QLS,
} from "./question-studio-adapter";
import {
  SAP_LOCALIZATION_VERSION,
} from "./localization/types";

const DEVANAGARI = /[\u0900-\u097F]/u;
const GURMUKHI = /[\u0A00-\u0A7F]/u;
const LATIN_WORD = /[A-Za-z]{3,}/gu;
const OUTPUT_DIRECTORY = resolve(process.cwd(), "dist/quant-v4/sap-localization-review");
mkdirSync(OUTPUT_DIRECTORY, { recursive: true });

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(packageCard, "SAP package is absent from shared Question Studio capabilities.");
assert.deepEqual(packageCard.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);

function learnerText(question: any) {
  return [question.text, ...(question.options ?? []), question.explanation ?? ""].join("\n");
}

function proseForLeakCheck(text: string) {
  return text
    .replace(/\\\([\s\S]*?\\\)/gu, " ")
    .replace(/\b(?:SAP|QL|CP)\b/gu, " ")
    .replace(/\b(?:A|B|C|D|E|I|II|III|IV|x|y|m|n)\b/gu, " ");
}

interface ReviewRow {
  qlId: string;
  cpId: string;
  language: "hi" | "pa";
  difficulty: string;
  englishQuestionId: string;
  localizedQuestionId: string;
  sourceSeed: number;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  latinLeaks: string[];
}

const rows: ReviewRow[] = [];
const leaks: Array<{ qlId: string; language: string; words: string[]; text: string }> = [];

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  const seed = `sap-localization-parity:${descriptor.qlId}`;
  const request = {
    packageId: "SAP" as const,
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    questionLanguageId: descriptor.qlId,
    count: 1,
    seed,
  };

  const englishResult = await generateQuestion({ ...request, language: "en" });
  const english = englishResult.questions[0] as any;
  assert.ok(english, `${descriptor.qlId}: English canonical generation returned no question.`);
  assert.equal(english.questionLanguageId, descriptor.qlId);
  assert.equal(english.canonicalProblemId, descriptor.checkpointId);

  for (const language of ["hi", "pa"] as const) {
    const localizedResult = await generateQuestion({ ...request, language });
    const localized = localizedResult.questions[0] as any;
    assert.ok(localized, `${descriptor.qlId}/${language}: localization returned no question.`);
    assert.equal(localized.language, language);
    assert.equal(localizedResult.generationContext.language, language);
    assert.equal(localizedResult.generationContext.reviewStatus, "LOCALIZATION_REVIEW_CANDIDATE");
    assert.equal(localizedResult.generationContext.questionBankStatus, "NOT_STORED");
    assert.equal(localizedResult.generationContext.testEligibility, "INELIGIBLE");
    assert.equal(localizedResult.generationContext.publiclyPublishable, false);

    assert.equal(localized.questionLanguageId, english.questionLanguageId, `${descriptor.qlId}/${language}: QL identity changed.`);
    assert.equal(localized.canonicalProblemId, english.canonicalProblemId, `${descriptor.qlId}/${language}: CP identity changed.`);
    assert.equal(localized.difficultyLabel, english.difficultyLabel, `${descriptor.qlId}/${language}: difficulty changed.`);
    assert.equal(localized.correctIndex, english.correctIndex, `${descriptor.qlId}/${language}: correct index changed.`);
    assert.equal(localized.options.length, english.options.length, `${descriptor.qlId}/${language}: option count changed.`);
    assert.equal(localized.options[localized.correctIndex], localized.answer, `${descriptor.qlId}/${language}: localized answer binding failed.`);
    assert.equal(localized.traceability.sourceSeed, english.traceability.sourceSeed, `${descriptor.qlId}/${language}: mathematical source state changed.`);
    assert.equal(localized.traceability.canonicalEnglishQuestionId, english.questionId, `${descriptor.qlId}/${language}: canonical English question ancestry changed.`);
    assert.deepEqual(localized.traceability.canonicalEnglishOptions, english.options, `${descriptor.qlId}/${language}: canonical option ancestry changed.`);
    assert.equal(localized.traceability.canonicalEnglishAnswer, english.answer, `${descriptor.qlId}/${language}: canonical answer ancestry changed.`);
    assert.equal(localized.traceability.localizationVersion, SAP_LOCALIZATION_VERSION);
    assert.equal(localized.questionBankStatus, "NOT_STORED");
    assert.equal(localized.testEligibility, "INELIGIBLE");
    assert.equal(localized.publiclyPublishable, false);
    assert.equal(localized.localizationValidation?.ok, true, `${descriptor.qlId}/${language}: localization validation failed.`);

    const text = learnerText(localized);
    if (language === "hi") {
      assert.ok(DEVANAGARI.test(text), `${descriptor.qlId}/hi: Devanagari learner prose is missing.`);
      assert.ok(!GURMUKHI.test(text), `${descriptor.qlId}/hi: Gurmukhi leaked into Hindi.`);
    } else {
      assert.ok(GURMUKHI.test(text), `${descriptor.qlId}/pa: Gurmukhi learner prose is missing.`);
      assert.ok(!DEVANAGARI.test(text), `${descriptor.qlId}/pa: Devanagari leaked into Punjabi.`);
    }

    const prose = proseForLeakCheck(text);
    const latinLeaks = [...new Set(prose.match(LATIN_WORD) ?? [])]
      .filter((word) => !["MathJax"].includes(word));
    if (latinLeaks.length) {
      leaks.push({ qlId: descriptor.qlId, language, words: latinLeaks, text });
    }

    rows.push({
      qlId: descriptor.qlId,
      cpId: descriptor.checkpointId,
      language,
      difficulty: String(localized.difficultyLabel),
      englishQuestionId: String(english.questionId),
      localizedQuestionId: String(localized.questionId),
      sourceSeed: Number(localized.traceability.sourceSeed),
      stem: String(localized.text),
      options: [...localized.options].map(String),
      correctIndex: Number(localized.correctIndex),
      answer: String(localized.answer),
      explanation: String(localized.explanation),
      latinLeaks,
    });
  }
}

const cockpitRuns: Record<string, number> = {};
for (const language of ["hi", "pa"] as const) {
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const result = await generateQuestion({
      packageId: "SAP",
      topic: "Arithmetic",
      subtopic: "Simplification & Approximation",
      language,
      difficulty,
      count: 50,
      seed: `sap-localized-cockpit:${language}:${difficulty}`,
    });
    assert.equal(result.questions.length, 50, `${language}/${difficulty}: shared Cockpit batch under-filled.`);
    assert.ok(result.questions.every((question: any) => question.language === language));
    assert.ok(result.questions.every((question: any) => question.difficultyLabel === difficulty));
    assert.ok(result.questions.every((question: any) => question.questionBankStatus === "NOT_STORED"));
    assert.ok(result.questions.every((question: any) => question.testEligibility === "INELIGIBLE"));
    assert.ok(result.questions.every((question: any) => question.publiclyPublishable === false));
    cockpitRuns[`${language}-${difficulty}`] = result.questions.length;
  }
}

const summary = {
  status: leaks.length === 0 ? "PASS_SAP_HI_PA_LOCALIZATION" : "BLOCKED_ENGLISH_PROSE_LEAKAGE",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  localizedQuestionCount: rows.length,
  hindiCount: rows.filter((row) => row.language === "hi").length,
  punjabiCount: rows.filter((row) => row.language === "pa").length,
  canonicalParityCount: rows.length,
  englishLeakCount: leaks.length,
  cockpitRuns,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

const jsonPath = resolve(OUTPUT_DIRECTORY, "sap-localization-review.json");
const markdownPath = resolve(OUTPUT_DIRECTORY, "sap-localization-review.md");
const csvPath = resolve(OUTPUT_DIRECTORY, "sap-localization-review.csv");
writeFileSync(jsonPath, `${JSON.stringify({ summary, leaks, rows }, null, 2)}\n`, "utf8");

const csvEscape = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
const csvHeader = ["qlId", "cpId", "language", "difficulty", "sourceSeed", "stem", "A", "B", "C", "D", "correctIndex", "answer", "explanation", "latinLeaks"].join(",");
const csvRows = rows.map((row) => [
  row.qlId, row.cpId, row.language, row.difficulty, row.sourceSeed, row.stem,
  row.options[0], row.options[1], row.options[2], row.options[3], row.correctIndex,
  row.answer, row.explanation, row.latinLeaks.join(" | "),
].map(csvEscape).join(","));
writeFileSync(csvPath, `${csvHeader}\n${csvRows.join("\n")}\n`, "utf8");

const sampleQlIds = new Set([
  "SAP-QL-001", "SAP-QL-016", "SAP-QL-017", "SAP-QL-033", "SAP-QL-034", "SAP-QL-052",
  "SAP-QL-053", "SAP-QL-071", "SAP-QL-072", "SAP-QL-091", "SAP-QL-092", "SAP-QL-112",
  "SAP-QL-113", "SAP-QL-128", "SAP-QL-129", "SAP-QL-146", "SAP-QL-147", "SAP-QL-165",
  "SAP-QL-180", "SAP-QL-183", "SAP-QL-184", "SAP-QL-185", "SAP-QL-186", "SAP-QL-187",
  "SAP-QL-198", "SAP-QL-199", "SAP-QL-211",
]);
const samples = rows.filter((row) => sampleQlIds.has(row.qlId));
const markdown = [
  "# SAP Hindi / Punjabi Localization Review",
  "",
  `Status: **${summary.status}**`,
  "",
  `- Permanent QLs: ${summary.qlCount}`,
  `- Hindi localized questions: ${summary.hindiCount}`,
  `- Punjabi localized questions: ${summary.punjabiCount}`,
  `- Canonical parity checks: ${summary.canonicalParityCount}`,
  `- English prose leakage cases: ${summary.englishLeakCount}`,
  `- Shared Cockpit batches: ${JSON.stringify(summary.cockpitRuns)}`,
  "",
  "## English leakage diagnostics",
  "",
  ...(leaks.length ? leaks.slice(0, 100).map((leak) => `- ${leak.qlId}/${leak.language}: ${leak.words.join(", ")}`) : ["- None"]),
  "",
  "## Representative learner samples",
  "",
  ...samples.flatMap((row) => [
    `### ${row.qlId} · ${row.language} · ${row.difficulty}`,
    "",
    `**Question:** ${row.stem}`,
    "",
    ...row.options.map((option, index) => `${index === row.correctIndex ? "**" : ""}${String.fromCharCode(65 + index)}. ${option}${index === row.correctIndex ? "**" : ""}`),
    "",
    `**Answer:** ${row.answer}`,
    "",
    `**Explanation:** ${row.explanation.replaceAll("\n\n", " ")}`,
    "",
  ]),
].join("\n");
writeFileSync(markdownPath, `${markdown}\n`, "utf8");

console.log(JSON.stringify({ ...summary, jsonPath, markdownPath, csvPath, leakPreview: leaks.slice(0, 20) }));
assert.equal(leaks.length, 0, `Localized learner prose still contains English words in ${leaks.length} QL/language cases.`);
