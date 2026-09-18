import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { generateEnvCp001ReviewBatchV4 } from "../ecology-fundamentals/env-cp001-review-generator-v4";
import { generateEnvCp001LocalizedReviewV1 } from "./env-cp001-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const english = generateEnvCp001ReviewBatchV4();
const locales: EnvLocaleV1[] = ["en", "hi", "pa"];

function learnerText(q: EnvLocalizedQuestionV1): string {
  return [q.stem, ...q.options, q.explanation].join("\n");
}

function assertNative(locale: "hi" | "pa", q: EnvLocalizedQuestionV1) {
  const text = learnerText(q);
  const withoutAllowedRoman = text.replace(/\b(?:I|II)\b/gu, "");
  assert.equal(/[A-Za-z]{2,}/u.test(withoutAllowedRoman), false, `${q.questionId}: Latin-script leakage`);
  if (locale === "hi") assert.match(text, /[\u0900-\u097F]/u, `${q.questionId}: missing Devanagari`);
  if (locale === "pa") assert.match(text, /[\u0A00-\u0A7F]/u, `${q.questionId}: missing Gurmukhi`);
}

assert.equal(english.length, 48, "frozen CP001 English V4 must contain 48 questions");

for (const locale of locales) {
  const localized = generateEnvCp001LocalizedReviewV1(locale);
  assert.equal(localized.length, english.length, `${locale}: question-count parity`);

  localized.forEach((q, index) => {
    const source = english[index];
    assert.equal(q.localizationV1.englishQuestionId, source.questionId);
    assert.equal(q.cpId, source.cpId);
    assert.equal(q.qlId, source.qlId);
    assert.equal(q.difficulty, source.difficulty);
    assert.equal(q.correctIndex, source.correctIndex);
    assert.deepEqual(q.sourceIds, source.sourceIds);
    assert.deepEqual(q.sourceFactIds, source.sourceFactIds);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4, `${q.questionId}: options must be unique`);
    assert.equal(q.canonicalAnswer, q.options[q.correctIndex], `${q.questionId}: answer/index parity`);
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

const evidence = {
  chapterId: "ENV-001",
  cpId: "ENV-CP-001",
  localizationVersion: "ENV-LOCALIZATION-V1",
  englishAuthority: "ENV-CP001-V4",
  questionsPerLocale: 48,
  locales,
  totalReviewSurfaces: 144,
  semanticInvariant: true,
  optionOrderInvariant: true,
  correctIndexInvariant: true,
  sourceInvariant: true,
  nativeScriptGuard: true,
  reviewOnly: true,
  runtimeRegistered: false,
};

const targetDir = path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(targetDir, { recursive: true });
fs.writeFileSync(path.join(targetDir, "ENV-CP001-MULTILINGUAL-PROOF.json"), JSON.stringify(evidence, null, 2));
console.log(JSON.stringify(evidence));
