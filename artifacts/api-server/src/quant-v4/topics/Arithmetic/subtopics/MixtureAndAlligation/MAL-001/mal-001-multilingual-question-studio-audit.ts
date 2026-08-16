import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";

const LANGUAGES = ["hi", "pa"] as const;
const SAMPLES_PER_QL = 10;

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function qlId(number: number): string {
  return `MAL-QL-${String(number).padStart(3, "0")}`;
}

function expectedCp(number: number): string {
  if (number <= 11) return "MAL-CP-001";
  if (number <= 28) return "MAL-CP-002";
  if (number <= 37) return "MAL-CP-003";
  if (number <= 47) return "MAL-CP-004";
  if (number <= 60) return "MAL-CP-005";
  return "MAL-CP-006";
}

function numericSignature(value: unknown): string[] {
  return String(value ?? "")
    .match(/-?\d+(?:[.,]\d+)*(?:\s+\d+\/\d+)?|-?\d+\/\d+/gu) ?? [];
}

function stripNonProse(value: string): string {
  return value
    .replace(/\[\[EXAMTREE_ALLIGATION_SVG_V1:[^\]]+\]\]/gu, " ")
    .replace(/\\[A-Za-z]+/gu, " ")
    .replace(/MAL-(?:CP|QL)-\d+/gu, " ");
}

function unexpectedLatinTokens(value: string): string[] {
  const allowed = new Set(["A", "B", "C", "V", "x", "y", "q", "r", "T"]);
  const tokens = stripNonProse(value).match(/[A-Za-z][A-Za-z'-]*/gu) ?? [];
  return [...new Set(tokens.filter((token) => !allowed.has(token)))].sort();
}

function nativeCount(value: string, language: "hi" | "pa"): number {
  const pattern = language === "hi" ? /[\u0900-\u097F]/gu : /[\u0A00-\u0A7F]/gu;
  return (value.match(pattern) ?? []).length;
}

function learnerSurface(question: any): string {
  return [
    question.text,
    ...(Array.isArray(question.options) ? question.options : []),
    question.explanation,
  ].join("\n");
}

function parityCheck(english: any, localized: any, language: "hi" | "pa", ql: string): void {
  assert(localized.packageId === "MAL-001", `${ql}:${language}: package drift.`);
  assert(localized.questionLanguageId === ql, `${ql}:${language}: QL drift.`);
  assert(localized.canonicalProblemId === english.canonicalProblemId, `${ql}:${language}: CP drift.`);
  assert(localized.difficulty === english.difficulty, `${ql}:${language}: difficulty drift.`);
  assert(localized.correctIndex === english.correctIndex, `${ql}:${language}: answer-position drift.`);
  assert(localized.language === language, `${ql}:${language}: language metadata drift.`);
  assert(Array.isArray(localized.options) && localized.options.length === 4, `${ql}:${language}: expected four options.`);
  assert(new Set(localized.options).size === 4, `${ql}:${language}: duplicate options.`);
  assert(localized.options[localized.correctIndex] === localized.answer, `${ql}:${language}: answer/index mismatch.`);
  assert(
    JSON.stringify(numericSignature(localized.answer)) === JSON.stringify(numericSignature(english.answer)),
    `${ql}:${language}: answer numeric structure changed (${english.answer} -> ${localized.answer}).`,
  );
  for (let index = 0; index < 4; index += 1) {
    assert(
      JSON.stringify(numericSignature(localized.options[index])) ===
        JSON.stringify(numericSignature(english.options[index])),
      `${ql}:${language}: option ${index + 1} numeric structure changed.`,
    );
  }
  assert(
    localized.traceability?.nativeStemTemplateMatched === true &&
      localized.traceability?.localizationStemTemplateId !== "FALLBACK",
    `${ql}:${language}: native QL stem template did not match this generated state.`,
  );
  const surface = learnerSurface(localized);
  const latin = unexpectedLatinTokens(surface);
  assert(latin.length === 0, `${ql}:${language}: untranslated Latin learner tokens: ${latin.join(", ")}.`);
  assert(nativeCount(String(localized.text ?? ""), language) >= 10, `${ql}:${language}: stem is not genuinely localized.`);
  assert(nativeCount(String(localized.explanation ?? ""), language) >= 10, `${ql}:${language}: explanation is not genuinely localized.`);
  assert(localized.questionBankStatus === "NOT_STORED", `${ql}:${language}: Question Bank boundary drift.`);
  assert(localized.questionBankWritable === false, `${ql}:${language}: Question Bank write unexpectedly enabled.`);
  assert(localized.testEligibility === "INELIGIBLE", `${ql}:${language}: test eligibility unexpectedly enabled.`);
  assert(localized.publiclyPublishable === false, `${ql}:${language}: public publication unexpectedly enabled.`);
  assert(
    localized.traceability?.mathematicalAuthorityLanguage === "en",
    `${ql}:${language}: English mathematical authority trace missing.`,
  );
  assert(
    localized.traceability?.localizationId === "MAL-001-HI-PA-QUESTION-STUDIO-V4",
    `${ql}:${language}: V4 localization trace missing.`,
  );
}

const packageCard = listQuantV4Packages().find((entry: any) => entry.packageId === "MAL-001") as any;
assert(packageCard, "MAL-001 is missing from Question Studio capabilities.");
assert(
  JSON.stringify(packageCard.supportedLanguages) === JSON.stringify(["en", "hi", "pa"]),
  `MAL-001 supported languages drifted: ${JSON.stringify(packageCard.supportedLanguages)}.`,
);
assert(packageCard.questionBankStatus === "NOT_STORED", "MAL-001 multilingual package must remain Question-Studio-only.");
assert(packageCard.publiclyPublishable === false, "MAL-001 multilingual package became publicly publishable.");

let localizedQuestions = 0;
let parityChecks = 0;
let nativeSurfaceChecks = 0;
let nativeStemTemplateChecks = 0;
const retained: Array<{
  qlId: string;
  cpId: string;
  language: "hi" | "pa";
  difficulty: string;
  stem: string;
  options: string[];
  answer: string;
  explanation: string;
}> = [];

for (let number = 1; number <= 67; number += 1) {
  const ql = qlId(number);
  const cpId = expectedCp(number);
  for (const language of LANGUAGES) {
    for (let sample = 0; sample < SAMPLES_PER_QL; sample += 1) {
      const seed = `mal-001-multilingual:${ql}:${sample}`;
      const englishResult = await generateQuestion({
        packageId: "MAL-001",
        questionLanguageId: ql,
        count: 1,
        seed,
        language: "en",
      } as any);
      const localizedResult = await generateQuestion({
        packageId: "MAL-001",
        questionLanguageId: ql,
        count: 1,
        seed,
        language,
      } as any);
      const english = englishResult.questions?.[0] as any;
      const localized = localizedResult.questions?.[0] as any;
      assert(english && localized, `${ql}:${language}:${sample}: missing generated preview.`);
      assert(english.canonicalProblemId === cpId, `${ql}: English CP routing drifted.`);
      parityCheck(english, localized, language, ql);
      localizedQuestions += 1;
      parityChecks += 6;
      nativeSurfaceChecks += 2;
      nativeStemTemplateChecks += 1;
      if (sample === 0) {
        retained.push({
          qlId: ql,
          cpId,
          language,
          difficulty: String(localized.difficulty),
          stem: String(localized.text),
          options: [...localized.options],
          answer: String(localized.answer),
          explanation: String(localized.explanation),
        });
      }
    }
  }
}

for (const language of LANGUAGES) {
  const batch = await generateQuestion({
    packageId: "MAL-001",
    count: 18,
    difficulty: "Medium",
    seed: `mal-001-multilingual:mixed:${language}`,
    language,
  } as any);
  assert(batch.questions.length === 18, `${language}: mixed multilingual batch count drifted.`);
  assert(batch.generationContext?.language === language, `${language}: batch language context drifted.`);
  assert(batch.generationContext?.questionBankStatus === "NOT_STORED", `${language}: batch Question Bank boundary drifted.`);
  for (const question of batch.questions as any[]) {
    assert(question.language === language, `${language}: mixed batch leaked another language.`);
    assert(nativeCount(String(question.text), language) >= 10, `${language}: mixed batch returned untranslated stem.`);
    assert(question.traceability?.nativeStemTemplateMatched === true, `${language}: mixed batch hit stem fallback.`);
  }
}

const reviewLines = [
  "# MAL-001 — Hindi & Punjabi Question Studio Review",
  "",
  "> English remains the mathematical authority. Hindi and Punjabi use native QL-specific stem templates plus localized solution surfaces, with Question Bank/test/publication locked.",
  "",
];
for (const item of retained) {
  reviewLines.push(
    `## ${item.qlId} — ${item.language.toUpperCase()} (${item.cpId}, ${item.difficulty})`,
    "",
    item.stem,
    "",
    ...item.options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}${index === item.options.indexOf(item.answer) ? " **✓**" : ""}`),
    "",
    `**Answer:** ${item.answer}`,
    "",
    "**Solution**",
    item.explanation,
    "",
    "---",
    "",
  );
}

const outDir = resolve(process.cwd(), "dist/quant-v4");
await mkdir(outDir, { recursive: true });
const reviewPath = resolve(outDir, "MAL-001-MULTILINGUAL-134Q-REVIEW.md");
await writeFile(reviewPath, reviewLines.join("\n"), "utf8");
const summary = {
  status: "PASS_MAL_001_MULTILINGUAL_QUESTION_STUDIO_V4",
  packageId: "MAL-001",
  permanentQlRange: "MAL-QL-001..MAL-QL-067",
  permanentQls: 67,
  localizedLanguages: [...LANGUAGES],
  samplesPerQlPerLanguage: SAMPLES_PER_QL,
  localizedQuestions,
  parityChecks,
  nativeSurfaceChecks,
  nativeStemTemplateChecks,
  retainedReviewQuestions: retained.length,
  mathematicalAuthorityLanguage: "en",
  stemPolicy: "STRUCTURED_NATIVE_CP001_THEN_NATIVE_QL_TEMPLATE",
  lifecycle: {
    questionStudio: "ACTIVE_EN_HI_PA",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
const summaryPath = resolve(process.cwd(), "dist/quant-v4/mal-001-multilingual-question-studio-audit.json");
await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
