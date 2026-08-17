import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { generateQuestion, listQuantV4Packages } from "../../../../question-studio-generation-engine";
import { SAP_QUESTION_STUDIO_QLS } from "./question-studio-adapter";
import { SAP_LOCALIZATION_VERSION } from "./localization/types";

const INLINE_MATH = /\\\([\s\S]*?\\\)/gu;
const DEVANAGARI_LETTERS = /[\u0900-\u0963\u0970-\u097F]/u;
const GURMUKHI_LETTERS = /[\u0A01-\u0A74]/u;
const LATIN_TOKEN = /\b[A-Za-z]+\b/gu;
const ALLOWED_LATIN = new Set(["A", "B", "C", "D", "E", "I", "II", "III", "IV", "x", "y", "m", "n", "k"]);
const OUTPUT = resolve(process.cwd(), "dist/quant-v4/sap-localization-release-review");
mkdirSync(OUTPUT, { recursive: true });

const HI_BAD = /(?:क्या चाहिए हो|ज्ञात कीजिए मान का|का सटीक मान क्या है|चयन व्यंजक|जाँच हल हल|खाना है एक|पूर्णांकित होता है तक|से पहला पूर्णांकन|पहला हर दिए गए|मान लीजिए एक|के सबसे निकट तक|से लेते हुए प्रत्येक|के बीच होना ज्ञात|निम्न में\? के स्थान)/u;
const PA_BAD = /(?:ਕੀ ਚਾਹੀਦਾ ਹੋਵੇ|ਕੱਢੋ ਮੁੱਲ ਦਾ|ਦਾ ਸਟੀਕ ਮੁੱਲ ਕੀ ਹੈ|ਚੋਣ ਵਿਆੰਜਕ|ਜਾਂਚ ਹੱਲ ਹੱਲ|ਰਾਊਂਡ ਹੁੰਦਾ ਹੈ ਤੱਕ|ਨਾਲ ਪਹਿਲਾ ਰਾਊਂਡਿੰਗ|ਪਹਿਲਾ ਹਰ ਦਿੱਤੇ|ਮੰਨੋ ਇੱਕ|ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਤੱਕ|ਨਾਲ ਲੈਂਦੇ ਹੋਏ ਹਰ|ਵਿਚਕਾਰ ਹੋਣਾ ਪਤਾ|ਹੇਠਾਂ\? ਦੀ ਥਾਂ)/u;

function learnerText(question: any) {
  return [question.text, ...(question.options ?? []), question.explanation ?? ""].join("\n");
}

function proseOutsideMath(value: string) {
  return value.replace(INLINE_MATH, " ");
}

function latinLeaks(value: string) {
  return [...new Set(proseOutsideMath(value).match(LATIN_TOKEN) ?? [])].filter((token) => !ALLOWED_LATIN.has(token));
}

function wrongScript(value: string, language: "hi" | "pa") {
  const prose = proseOutsideMath(value);
  return language === "hi" ? GURMUKHI_LETTERS.test(prose) : DEVANAGARI_LETTERS.test(prose.replace(/[।॥]/gu, ""));
}

function expectedScript(value: string, language: "hi" | "pa") {
  const prose = proseOutsideMath(value);
  return language === "hi" ? DEVANAGARI_LETTERS.test(prose) : GURMUKHI_LETTERS.test(prose);
}

function knownUnnatural(value: string, language: "hi" | "pa") {
  return (language === "hi" ? HI_BAD : PA_BAD).test(proseOutsideMath(value));
}

interface Row {
  qlId: string;
  cpId: string;
  language: "hi" | "pa";
  difficulty: string;
  stem: string;
  options: string[];
  correctIndex: number;
  answer: string;
  explanation: string;
  sourceSeed: number;
  latinLeaks: string[];
  wrongScript: boolean;
  knownUnnatural: boolean;
}

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "SAP") as any;
assert.ok(packageCard);
assert.deepEqual(packageCard.supportedLanguages, ["en", "hi", "pa"]);
assert.equal(packageCard.questionBankStatus, "NOT_STORED");
assert.equal(packageCard.testEligibility, "INELIGIBLE");
assert.equal(packageCard.publiclyPublishable, false);

const rows: Row[] = [];
const failures: Array<{ qlId: string; language: string; reasons: string[] }> = [];

for (const descriptor of SAP_QUESTION_STUDIO_QLS) {
  const seed = `sap-localization-release:${descriptor.qlId}`;
  const request = {
    packageId: "SAP" as const,
    topic: "Arithmetic",
    subtopic: "Simplification & Approximation",
    questionLanguageId: descriptor.qlId,
    count: 1,
    seed,
  };
  const english = (await generateQuestion({ ...request, language: "en" })).questions[0] as any;
  assert.ok(english, `${descriptor.qlId}: English canonical question missing.`);

  for (const language of ["hi", "pa"] as const) {
    const result = await generateQuestion({ ...request, language });
    const localized = result.questions[0] as any;
    assert.ok(localized, `${descriptor.qlId}/${language}: localized question missing.`);

    const reasons: string[] = [];
    if (localized.questionLanguageId !== english.questionLanguageId) reasons.push("QL identity drift");
    if (localized.canonicalProblemId !== english.canonicalProblemId) reasons.push("CP identity drift");
    if (localized.difficultyLabel !== english.difficultyLabel) reasons.push("difficulty drift");
    if (localized.correctIndex !== english.correctIndex) reasons.push("correct-index drift");
    if (localized.traceability?.sourceSeed !== english.traceability?.sourceSeed) reasons.push("source-state drift");
    if (localized.traceability?.canonicalEnglishQuestionId !== english.questionId) reasons.push("English ancestry drift");
    if (JSON.stringify(localized.traceability?.canonicalEnglishOptions) !== JSON.stringify(english.options)) reasons.push("option ancestry drift");
    if (localized.traceability?.canonicalEnglishAnswer !== english.answer) reasons.push("answer ancestry drift");
    if (localized.traceability?.localizationVersion !== SAP_LOCALIZATION_VERSION) reasons.push("localization-version drift");
    if (localized.traceability?.localizationAuthorship !== "SAP-CP-AUTHORED-PRESENTATION-V3") reasons.push("V3 authored release missing");
    if (localized.traceability?.localizedStemAuthorship !== "SAP-QL-FAMILY-STEM-V4") reasons.push("V4 authored stem missing");
    if (localized.localizationValidation?.ok !== true) reasons.push("package localization validation failed");
    if (localized.options?.[localized.correctIndex] !== localized.answer) reasons.push("answer binding failed");
    if (localized.questionBankStatus !== "NOT_STORED") reasons.push("question bank unexpectedly writable");
    if (localized.testEligibility !== "INELIGIBLE") reasons.push("test eligibility unexpectedly enabled");
    if (localized.publiclyPublishable !== false) reasons.push("public publication unexpectedly enabled");

    const text = learnerText(localized);
    const leaks = latinLeaks(text);
    const wrong = wrongScript(text, language);
    const unnatural = knownUnnatural(localized.text, language);
    if (!expectedScript(text, language)) reasons.push("target script missing");
    if (leaks.length) reasons.push(`Latin learner prose: ${leaks.join(", ")}`);
    if (wrong) reasons.push("wrong target script");
    if (unnatural) reasons.push("known machine-translated word order");
    if (!String(localized.explanation ?? "").includes(String(localized.answer))) reasons.push("answer absent from explanation");

    rows.push({
      qlId: descriptor.qlId,
      cpId: descriptor.checkpointId,
      language,
      difficulty: String(localized.difficultyLabel),
      stem: String(localized.text),
      options: [...localized.options].map(String),
      correctIndex: Number(localized.correctIndex),
      answer: String(localized.answer),
      explanation: String(localized.explanation),
      sourceSeed: Number(localized.traceability?.sourceSeed),
      latinLeaks: leaks,
      wrongScript: wrong,
      knownUnnatural: unnatural,
    });
    if (reasons.length) failures.push({ qlId: descriptor.qlId, language, reasons });
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
      seed: `sap-localized-release-cockpit:${language}:${difficulty}`,
    });
    assert.equal(result.questions.length, 50, `${language}/${difficulty}: Cockpit batch under-filled.`);
    assert.ok(result.questions.every((q: any) => q.language === language));
    assert.ok(result.questions.every((q: any) => q.difficultyLabel === difficulty));
    assert.ok(result.questions.every((q: any) => q.questionBankStatus === "NOT_STORED"));
    assert.ok(result.questions.every((q: any) => q.testEligibility === "INELIGIBLE"));
    assert.ok(result.questions.every((q: any) => q.publiclyPublishable === false));
    cockpitRuns[`${language}-${difficulty}`] = result.questions.length;
  }
}

const summary = {
  status: failures.length ? "BLOCKED_SAP_HI_PA_RELEASE_EDITORIAL" : "PASS_SAP_HI_PA_AUTHORED_RELEASE_AUDIT",
  qlCount: SAP_QUESTION_STUDIO_QLS.length,
  localizedCount: rows.length,
  hindiCount: rows.filter((r) => r.language === "hi").length,
  punjabiCount: rows.filter((r) => r.language === "pa").length,
  failureCount: failures.length,
  failedQlCount: new Set(failures.map((f) => f.qlId)).size,
  cockpitRuns,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
};

const jsonPath = resolve(OUTPUT, "sap-localization-release-review.json");
const markdownPath = resolve(OUTPUT, "sap-localization-release-review.md");
const csvPath = resolve(OUTPUT, "sap-localization-release-review.csv");
writeFileSync(jsonPath, `${JSON.stringify({ summary, failures, rows }, null, 2)}\n`, "utf8");
const sampleIds = new Set(["SAP-QL-008", "SAP-QL-014", "SAP-QL-016", "SAP-QL-031", "SAP-QL-050", "SAP-QL-069", "SAP-QL-085", "SAP-QL-096", "SAP-QL-112", "SAP-QL-125", "SAP-QL-129", "SAP-QL-140", "SAP-QL-148", "SAP-QL-160", "SAP-QL-171", "SAP-QL-179", "SAP-QL-182", "SAP-QL-192", "SAP-QL-198", "SAP-QL-207", "SAP-QL-210", "SAP-QL-211"]);
const samples = rows.filter((row) => sampleIds.has(row.qlId));
writeFileSync(markdownPath, [
  "# SAP Hindi / Punjabi Authored Release Review",
  "",
  `Status: **${summary.status}**`,
  `Localized QL/language cases: **${summary.localizedCount}**`,
  `Failures: **${summary.failureCount}** across **${summary.failedQlCount}** QLs`,
  "",
  "## Failures",
  ...(failures.length ? failures.map((f) => `- ${f.qlId}/${f.language}: ${f.reasons.join(" | ")}`) : ["- None"]),
  "",
  "## Human-review samples",
  ...samples.flatMap((row) => [
    "",
    `### ${row.qlId} · ${row.language}`,
    `Question: ${row.stem}`,
    ...row.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === row.correctIndex ? "  ← correct" : ""}`),
    `Explanation: ${row.explanation.replaceAll("\n", " ")}`,
  ]),
].join("\n"), "utf8");
const esc = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
writeFileSync(csvPath, [
  ["qlId", "cpId", "language", "difficulty", "stem", "A", "B", "C", "D", "correctIndex", "answer", "explanation"].join(","),
  ...rows.map((r) => [r.qlId, r.cpId, r.language, r.difficulty, r.stem, ...r.options, r.correctIndex, r.answer, r.explanation].map(esc).join(",")),
].join("\n") + "\n", "utf8");

console.log(JSON.stringify({ ...summary, jsonPath, markdownPath, csvPath, failurePreview: failures.slice(0, 20) }));
assert.equal(failures.length, 0, `${failures.length} localized QL/language cases still fail authored release checks.`);
