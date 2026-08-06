import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { runAvg001EditorialV2Pipeline } from "./foundation/editorial-v2-release";
import {
  applyAvg001NaturalLanguageV35HeaderAlignment,
  AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT,
} from "./foundation/natural-language-v3-5-header-alignment";
import { applyAvg001NaturalLanguageV35Review } from "./foundation/natural-language-v3-5-review";
import { getAvg001QuestionEntries } from "./foundation/library";
import { runAvg001LocalizedRelease } from "./foundation/localized-release";
import type { Avg001Language, Avg001QuestionPackage } from "./foundation/types";

const out = resolve(process.cwd(), "dist/quant-v4/avg-001-natural-language-v3-5-review");
mkdirSync(out, { recursive: true });
const entries = getAvg001QuestionEntries();
const languages: Avg001Language[] = ["en", "hi", "pa"];
assert.equal(entries.length, 425);

const expectedHeaders = {
  en: [
    "📌 Key rule:",
    "📝 Step-by-step solution:",
    "⚡ Exam speed shortcut:",
    "⚠️ Why the other options are wrong:",
  ],
  hi: [
    "📌 मुख्य बात:",
    "📝 हल:",
    "⚡ तेज़ तरीका:",
    "⚠️ दूसरे विकल्प क्यों गलत हैं:",
  ],
  pa: [
    "📌 ਮੁੱਖ ਗੱਲ:",
    "📝 ਹੱਲ:",
    "⚡ ਤੇਜ਼ ਤਰੀਕਾ:",
    "⚠️ ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ:",
  ],
} as const;

const bareLabels = {
  en: ["Key rule:", "Step-by-step solution:", "Exam speed shortcut:", "Why the other options are wrong:"],
  hi: ["मुख्य बात:", "हल:", "तेज़ तरीका:", "दूसरे विकल्प क्यों गलत हैं:"],
  pa: ["ਮੁੱਖ ਗੱਲ:", "ਹੱਲ:", "ਤੇਜ਼ ਤਰੀਕਾ:", "ਬਾਕੀ ਵਿਕਲਪ ਕਿਉਂ ਗਲਤ ਹਨ:"],
} as const;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function contentWithoutHeader(line: string, index: number, language: Avg001Language) {
  const prefix = expectedHeaders[language][index]!;
  const label = bareLabels[language][index]!;
  return line
    .replace(prefix, "")
    .replace(/^[📌📝⚡⚠️]\uFE0F?\s*/u, "")
    .replace(new RegExp(`^${escapeRegex(label)}\\s*`), "")
    .trim();
}

function sourceFor(qlId: string, language: Avg001Language, seed: string): Avg001QuestionPackage {
  return language === "en"
    ? runAvg001EditorialV2Pipeline({ questionLanguageId: qlId, seed, language })
    : runAvg001LocalizedRelease({ questionLanguageId: qlId, seed, language });
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

const records: Record<string, unknown>[] = [];
let localizedHeaderRows = 0;
let englishHeaderRowsRealigned = 0;

for (const entry of entries) {
  const seed = `avg-001-natural-language-v3-4:${entry.qlId}`;
  for (const language of languages) {
    const source = sourceFor(entry.qlId, language, seed);
    const base = applyAvg001NaturalLanguageV35Review(source);
    const question = applyAvg001NaturalLanguageV35HeaderAlignment(source);
    const expected = expectedHeaders[language];

    assert.equal(question.validation.valid, true, `${entry.qlId}:${language} failed header-aligned validation`);
    assert.equal(question.maturity, "MANUAL_REVIEW");
    assert.equal(question.publiclyPublishable, false);
    assert.deepEqual(question.options, base.options, `${entry.qlId}:${language} options changed during header alignment`);
    assert.equal(question.answer, base.answer, `${entry.qlId}:${language} answer changed during header alignment`);
    assert.equal(question.correctIndex, base.correctIndex, `${entry.qlId}:${language} correct index changed during header alignment`);
    assert.equal(question.stem, base.stem, `${entry.qlId}:${language} stem changed during header alignment`);
    assert.equal(question.mathematicalFingerprint, base.mathematicalFingerprint);
    assert.deepEqual(question.parameters.values, base.parameters.values);
    assert.deepEqual(question.solver.exactAnswer, base.solver.exactAnswer);
    assert.equal(question.explanation.lines.length, 4);

    for (let index = 0; index < expected.length; index += 1) {
      assert.ok(
        question.explanation.lines[index]?.startsWith(expected[index]!),
        `${entry.qlId}:${language} line ${index + 1} does not start with ${expected[index]}`,
      );
      assert.equal(
        contentWithoutHeader(question.explanation.lines[index]!, index, language),
        contentWithoutHeader(base.explanation.lines[index]!, index, language),
        `${entry.qlId}:${language} line ${index + 1} changed beyond header placement`,
      );
    }

    if (language === "en") {
      if (question.explanation.lines.some((line, index) => line !== base.explanation.lines[index])) {
        englishHeaderRowsRealigned += 1;
      }
    } else {
      localizedHeaderRows += 1;
      assert.ok(
        question.explanation.lines.every((line) => /^[📌📝⚡⚠️]/u.test(line)),
        `${entry.qlId}:${language} lacks a visual badge`,
      );
    }

    records.push({
      packageId: question.packageId,
      cpId: question.canonicalProblemId,
      qlId: question.questionLanguageId,
      language: question.language,
      solveMode: question.solveMode,
      difficulty: question.difficultyBand,
      answerType: question.parameters.answerType,
      sharedSeed: seed,
      stem: question.stem,
      options: question.options.join("\n"),
      correctIndex: question.correctIndex,
      correctAnswer: question.answer,
      keyRule: question.explanation.lines[0],
      calculation: question.explanation.lines[1],
      shortcut: question.explanation.lines[2],
      distractorReasons: question.explanation.lines[3],
      mathematicalFingerprint: question.mathematicalFingerprint,
      reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT,
      sourceReleaseId: String(source.traceability.releaseId ?? ""),
      validation: question.validation.valid ? "PASS" : "FAIL",
      reviewStatus: "PENDING",
    });
  }
}

assert.equal(records.length, 1275);
assert.equal(localizedHeaderRows, 850);
assert.ok(englishHeaderRowsRealigned >= 1, "Expected at least one English row with a displaced header to be normalized");
assert.equal(new Set(records.map((record) => record.qlId)).size, 425);
assert.equal(new Set(records.map((record) => record.solveMode)).size, 45);

writeFileSync(
  resolve(out, "avg-001-natural-language-v3-5-review.json"),
  JSON.stringify(records, null, 2),
  "utf8",
);
const headers = Object.keys(records[0]!);
writeFileSync(
  resolve(out, "avg-001-natural-language-v3-5-review.csv"),
  [
    headers.map(csvCell).join(","),
    ...records.map((record) => headers.map((header) => csvCell(record[header]!)).join(",")),
  ].join("\n"),
  "utf8",
);
writeFileSync(
  resolve(out, "avg-001-natural-language-v3-5-summary.json"),
  JSON.stringify({
    packageId: "AVG-001",
    reviewCandidate: AVG_001_NATURAL_LANGUAGE_V3_5_HEADER_ALIGNMENT,
    status: "PASS",
    sourceReleases: ["AVG-001-EN-v2", "AVG-001-HI-v1", "AVG-001-PA-v1"],
    sourceReleasesUnchanged: true,
    v34MathematicalObjectsAndSeedsRetained: true,
    qlCountPerLanguage: 425,
    languageCount: 3,
    totalReviewRows: records.length,
    solveModeCount: 45,
    localizedHeaderRows,
    englishHeaderRowsRealigned,
    reviewStatus: "PENDING_PRODUCT_REVIEW",
    validation: {
      v35PresentationIntegrityRetained: true,
      allExplanationHeadersStartTheirSections: true,
      hindiFourTierEmojiHeadersAligned: true,
      punjabiFourTierEmojiHeadersAligned: true,
      localizedHeaderCoverage: "850/850",
      learnerContentOtherThanHeaderPrefixesUnchanged: true,
      publiclyPublishable: false,
    },
  }, null, 2),
  "utf8",
);

console.log(
  `PASS AVG-001 V3.5 header alignment: ${localizedHeaderRows} Hindi/Punjabi packages use the four shared visual badges; ${englishHeaderRowsRealigned} English rows had displaced headers moved to the start. Manual product review remains pending.`,
);
