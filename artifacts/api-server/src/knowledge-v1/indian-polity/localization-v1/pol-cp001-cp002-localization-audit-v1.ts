import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generatePolCp001ReviewBatchV1 } from "../constitutional-history/pol-cp001-review-generator-v1";
import { generatePolCp002ReviewBatchV2 } from "../constituent-assembly/pol-cp002-review-generator-v2";
import {
  generatePolCp001LocalizedReviewV1,
  generatePolCp002LocalizedReviewV1,
} from "./pol-cp001-cp002-localization-v1";
import type { PolLocaleV1, PolLocalizedQuestionV1 } from "./pol-localization-types-v1";

const cps = [
  ["POL-CP-001", generatePolCp001ReviewBatchV1(), generatePolCp001LocalizedReviewV1],
  ["POL-CP-002", generatePolCp002ReviewBatchV2(), generatePolCp002LocalizedReviewV1],
] as const;
const locales: PolLocaleV1[] = ["en", "hi", "pa"];

function learnerText(q: PolLocalizedQuestionV1) {
  return [q.stem, ...q.options, q.explanation].join("\n");
}

function assertNative(locale: "hi" | "pa", q: PolLocalizedQuestionV1) {
  const text = learnerText(q);
  const withoutRomanNumerals = text.replace(/\b(?:I|II)\b/gu, "");
  assert.equal(/[A-Za-z]{2,}/u.test(withoutRomanNumerals), false, `${q.questionId}: Latin-script leakage`);
  if (locale === "hi") assert.match(text, /[\u0900-\u097F]/u, `${q.questionId}: missing Devanagari`);
  if (locale === "pa") assert.match(text, /[\u0A00-\u0A7F]/u, `${q.questionId}: missing Gurmukhi`);
}

let englishCount = 0;
for (const [cpId, english, generateLocalized] of cps) {
  englishCount += english.length;
  for (const locale of locales) {
    const localized = generateLocalized(locale);
    assert.equal(localized.length, english.length, `${cpId}/${locale}: question-count parity`);

    localized.forEach((q, index) => {
      const source = english[index]!;
      assert.equal(q.localizationV1.englishQuestionId, source.questionId);
      assert.equal(q.cpId, source.cpId);
      assert.equal(q.qlId, source.qlId);
      assert.equal(q.difficulty, source.difficulty);
      assert.equal(q.correctIndex, source.correctIndex);
      assert.deepEqual(q.sourceIds, source.sourceIds);
      assert.deepEqual(q.sourceFactIds, source.sourceFactIds);
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options).size, 4, `${q.questionId}: localized options must remain unique`);
      assert.equal(q.canonicalAnswer, q.options[q.correctIndex], `${q.questionId}: localized answer/index mismatch`);
      assert.equal(q.reviewOnly, true);
      assert.equal(q.runtimeRegistered, false);

      if (locale === "en") {
        assert.equal(q.questionId, source.questionId);
        assert.equal(q.stem, source.stem);
        assert.deepEqual(q.options, source.options);
        assert.equal(q.explanation, source.explanation);
        assert.equal(q.canonicalAnswer, source.canonicalAnswer);
      } else {
        assert.equal(q.questionId, `${source.questionId}-${locale.toUpperCase()}`);
        assertNative(locale, q);
      }
    });
  }
}

assert.equal(englishCount, 92, "CP001–CP002 English authority must contain 92 questions");

const evidence = {
  chapterId: "POL-001",
  cps: ["POL-CP-001", "POL-CP-002"],
  localizationVersion: "POL-LOCALIZATION-V1",
  englishQuestions: englishCount,
  questionsPerLocale: englishCount,
  locales,
  totalReviewSurfaces: englishCount * locales.length,
  semanticInvariant: true,
  optionOrderInvariant: true,
  correctIndexInvariant: true,
  qlInvariant: true,
  sourceInvariant: true,
  nativeScriptGuard: true,
  reviewOnly: true,
  runtimeRegistered: false,
};

const targetDir = path.resolve("dist/polity-review/POL-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(
  path.join(targetDir, "POL-CP001-CP002-MULTILINGUAL-PROOF.json"),
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence, null, 2));
