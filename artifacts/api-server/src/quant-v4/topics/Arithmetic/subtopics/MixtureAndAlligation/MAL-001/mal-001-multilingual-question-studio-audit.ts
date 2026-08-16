import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  generateQuestion,
  listQuantV4Packages,
} from "../../../../../generation-engine";

const LANGUAGES = ["hi", "pa"] as const;
const SAMPLES_PER_QL = 10;

type LocalizedLanguage = (typeof LANGUAGES)[number];
type SurfaceDiagnostic = {
  qlId: string;
  language: LocalizedLanguage;
  sample: number;
  type:
    | "UNTRANSLATED_LATIN"
    | "STEM_NOT_NATIVE"
    | "EXPLANATION_NOT_NATIVE"
    | "LOCALIZATION_TRACE_DRIFT";
  details: string[];
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function qlId(number: number): string {
  return `MAL-QL-${String(number).padStart(3, "0")}`;
}

function qlNumber(value: string): number {
  return Number(/^MAL-QL-(\d{3})$/u.exec(value)?.[1] ?? 0);
}

function expectedCp(number: number): string {
  if (number <= 11) return "MAL-CP-001";
  if (number <= 28) return "MAL-CP-002";
  if (number <= 37) return "MAL-CP-003";
  if (number <= 47) return "MAL-CP-004";
  if (number <= 60) return "MAL-CP-005";
  return "MAL-CP-006";
}

function expectedLocalizationId(ql: string): string {
  return qlNumber(ql) <= 11
    ? "MAL-001-HI-PA-QUESTION-STUDIO-V4"
    : "MAL-001-HI-PA-QUESTION-STUDIO-V3";
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
  const allowed = new Set([
    "A", "B", "C", "F", "Q", "T", "V", "V-r", "V-", "n", "q", "r", "s", "x", "y",
  ]);
  const tokens = stripNonProse(value).match(/[A-Za-z][A-Za-z'-]*/gu) ?? [];
  return [...new Set(tokens.filter((token) => !allowed.has(token)))].sort();
}

function nativeCount(value: string, language: LocalizedLanguage): number {
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

function hardParityCheck(
  english: any,
  localized: any,
  language: LocalizedLanguage,
  ql: string,
): void {
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
  assert(localized.questionBankStatus === "NOT_STORED", `${ql}:${language}: Question Bank boundary drift.`);
  assert(localized.questionBankWritable === false, `${ql}:${language}: Question Bank write unexpectedly enabled.`);
  assert(localized.testEligibility === "INELIGIBLE", `${ql}:${language}: test eligibility unexpectedly enabled.`);
  assert(localized.publiclyPublishable === false, `${ql}:${language}: public publication unexpectedly enabled.`);
  assert(
    localized.traceability?.mathematicalAuthorityLanguage === "en",
    `${ql}:${language}: English mathematical authority trace missing.`,
  );
  assert(
    localized.traceability?.residualNormalizationId ===
      "MAL-001-HI-PA-QUESTION-STUDIO-V6-RESIDUAL-NORMALIZATION",
    `${ql}:${language}: V6 native-surface normalization trace missing.`,
  );
}

function collectSurfaceDiagnostics(
  localized: any,
  language: LocalizedLanguage,
  ql: string,
  sample: number,
  diagnostics: SurfaceDiagnostic[],
): void {
  const latin = unexpectedLatinTokens(learnerSurface(localized));
  if (latin.length > 0) {
    diagnostics.push({
      qlId: ql,
      language,
      sample,
      type: "UNTRANSLATED_LATIN",
      details: latin,
    });
  }

  if (nativeCount(String(localized.text ?? ""), language) < 10) {
    diagnostics.push({
      qlId: ql,
      language,
      sample,
      type: "STEM_NOT_NATIVE",
      details: [String(localized.text ?? "")],
    });
  }

  if (nativeCount(String(localized.explanation ?? ""), language) < 10) {
    diagnostics.push({
      qlId: ql,
      language,
      sample,
      type: "EXPLANATION_NOT_NATIVE",
      details: [String(localized.explanation ?? "")],
    });
  }

  const localizationId = expectedLocalizationId(ql);
  if (localized.traceability?.localizationId !== localizationId) {
    diagnostics.push({
      qlId: ql,
      language,
      sample,
      type: "LOCALIZATION_TRACE_DRIFT",
      details: [
        `expected=${localizationId}`,
        `actual=${String(localized.traceability?.localizationId)}`,
      ],
    });
  }
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
const surfaceDiagnostics: SurfaceDiagnostic[] = [];
const retained: Array<{
  qlId: string;
  cpId: string;
  language: LocalizedLanguage;
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
      hardParityCheck(english, localized, language, ql);
      collectSurfaceDiagnostics(localized, language, ql, sample, surfaceDiagnostics);
      localizedQuestions += 1;
      parityChecks += 6;
      nativeSurfaceChecks += 3;
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

const outDir = resolve(process.cwd(), "dist/quant-v4");
await mkdir(outDir, { recursive: true });

const diagnosticSummary = {
  status: surfaceDiagnostics.length === 0
    ? "PASS_MAL_001_MULTILINGUAL_SURFACE_DIAGNOSTICS_V6"
    : "FAIL_MAL_001_MULTILINGUAL_SURFACE_DIAGNOSTICS_V6",
  totalDiagnostics: surfaceDiagnostics.length,
  byType: surfaceDiagnostics.reduce<Record<string, number>>((acc, item) => {
    acc[item.type] = (acc[item.type] ?? 0) + 1;
    return acc;
  }, {}),
  byQl: surfaceDiagnostics.reduce<Record<string, number>>((acc, item) => {
    acc[item.qlId] = (acc[item.qlId] ?? 0) + 1;
    return acc;
  }, {}),
  uniqueLatinTokens: [...new Set(
    surfaceDiagnostics
      .filter((item) => item.type === "UNTRANSLATED_LATIN")
      .flatMap((item) => item.details),
  )].sort(),
  diagnostics: surfaceDiagnostics,
};
await writeFile(
  resolve(outDir, "mal-001-multilingual-surface-diagnostics.json"),
  `${JSON.stringify(diagnosticSummary, null, 2)}\n`,
  "utf8",
);
console.log(JSON.stringify(diagnosticSummary, null, 2));

assert(
  surfaceDiagnostics.length === 0,
  `MAL-001 multilingual surface diagnostics found ${surfaceDiagnostics.length} blocking defects across ${Object.keys(diagnosticSummary.byQl).length} QLs.`,
);

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
    const latin = unexpectedLatinTokens(learnerSurface(question));
    assert(latin.length === 0, `${language}: mixed batch untranslated Latin learner tokens: ${latin.join(", ")}.`);
    assert(
      question.traceability?.residualNormalizationId ===
        "MAL-001-HI-PA-QUESTION-STUDIO-V6-RESIDUAL-NORMALIZATION",
      `${language}: mixed batch skipped V6 normalization.`,
    );
  }
}

const reviewLines = [
  "# MAL-001 — Hindi & Punjabi Question Studio Review",
  "",
  "> English remains the mathematical authority. Hindi and Punjabi use structured native templates where available plus full native-surface normalization, with Question Bank/test/publication locked.",
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

const reviewPath = resolve(outDir, "MAL-001-MULTILINGUAL-134Q-REVIEW.md");
await writeFile(reviewPath, reviewLines.join("\n"), "utf8");
const summary = {
  status: "PASS_MAL_001_MULTILINGUAL_QUESTION_STUDIO_V6",
  packageId: "MAL-001",
  permanentQlRange: "MAL-QL-001..MAL-QL-067",
  permanentQls: 67,
  localizedLanguages: [...LANGUAGES],
  samplesPerQlPerLanguage: SAMPLES_PER_QL,
  localizedQuestions,
  parityChecks,
  nativeSurfaceChecks,
  retainedReviewQuestions: retained.length,
  mathematicalAuthorityLanguage: "en",
  stemPolicy: "STRUCTURED_NATIVE_WHERE_AVAILABLE_PLUS_FULL_NATIVE_SURFACE_NORMALIZATION",
  residualNormalizationId: "MAL-001-HI-PA-QUESTION-STUDIO-V6-RESIDUAL-NORMALIZATION",
  lifecycle: {
    questionStudio: "ACTIVE_EN_HI_PA",
    questionBankStatus: "NOT_STORED",
    questionBankWritable: false,
    testEligibility: "INELIGIBLE",
    publiclyPublishable: false,
  },
};
const summaryPath = resolve(outDir, "mal-001-multilingual-question-studio-audit.json");
await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");
console.log(JSON.stringify(summary, null, 2));
