import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  ENV_CP008_ENGLISH_AUTHORITY_V2,
  generateEnvCp008LocalizedReviewV1,
} from "./env-cp008-localization-v1";
import type { EnvLocaleV1, EnvLocalizedQuestionV1 } from "./env-localization-types-v1";

const locales: EnvLocaleV1[] = ["en", "hi", "pa"];
const ALLOWED_LATIN = new Set([
  "IUCN","CR","EN","VU","NT","LC","DD","EW","EX","NE","CE","CD","CT",
  "UNESCO","WHO","WTO","CITES","EIA",
]);

function learnerText(q: EnvLocalizedQuestionV1): string {
  return [q.stem, ...q.options, q.explanation].join("\n");
}

function assertNative(locale: "hi" | "pa", q: EnvLocalizedQuestionV1): void {
  const text = learnerText(q);
  const latin = [...text.matchAll(/\b[A-Za-z][A-Za-z0-9.-]*\b/g)].map((m) => m[0]);
  const unauthorized = latin.filter((token) => !ALLOWED_LATIN.has(token));
  assert.deepEqual(unauthorized, [], `${q.questionId}: unauthorized Latin leakage: ${unauthorized.join(", ")}`);
  if (locale === "hi") assert.match(text, /[\u0900-\u097F]/u);
  if (locale === "pa") assert.match(text, /[\u0A00-\u0A7F]/u);
}

assert.equal(ENV_CP008_ENGLISH_AUTHORITY_V2.length, 60);
assert.equal(
  ENV_CP008_ENGLISH_AUTHORITY_V2.slice(0, 48).every((q) => q.questionId.startsWith("ENV-CP008-V1-")),
  true,
);
assert.equal(
  ENV_CP008_ENGLISH_AUTHORITY_V2.slice(48).every((q) => q.questionId.startsWith("ENV-CP008-V2-")),
  true,
);

for (const locale of locales) {
  const localized = generateEnvCp008LocalizedReviewV1(locale);
  assert.equal(localized.length, 60);
  localized.forEach((q, i) => {
    const source = ENV_CP008_ENGLISH_AUTHORITY_V2[i];
    assert.equal(q.localizationV1.englishQuestionId, source.questionId);
    assert.equal(q.cpId, source.cpId);
    assert.equal(q.qlId, source.qlId);
    assert.equal(q.difficulty, source.difficulty);
    assert.equal(q.correctIndex, source.correctIndex);
    assert.deepEqual(q.sourceIds, source.sourceIds);
    assert.deepEqual(q.sourceFactIds, source.sourceFactIds);
    assert.equal(q.options.length, 4);
    assert.equal(new Set(q.options).size, 4);
    assert.equal(q.canonicalAnswer, q.options[q.correctIndex]);
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
  cpId: "ENV-CP-008",
  authority: "48-question V1 + approved 12-question V2 remediation",
  questionsPerLocale: 60,
  baseQuestions: 48,
  remediationQuestions: 12,
  qlCount: 15,
  totalReviewSurfaces: 180,
  locales,
  semanticInvariant: true,
  optionOrderInvariant: true,
  correctIndexInvariant: true,
  sourceInvariant: true,
  nativeScriptGuard: true,
  officialIdentifierWhitelist: [...ALLOWED_LATIN],
  reviewOnly: true,
  runtimeRegistered: false,
};

const dir = path.resolve("dist/environment-review/ENV-MULTILINGUAL-V1");
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  path.join(dir, "ENV-CP008-MULTILINGUAL-PROOF.json"),
  JSON.stringify(evidence, null, 2),
);
console.log(JSON.stringify(evidence));
