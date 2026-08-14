import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { INE_001_CLOSURE_GROUPS } from "../chapter-closure/registry";
import { buildIneLocalizedReviewRows, loadIneEnglishClosureRows } from "./review-pack";

const chapterDirectory = path.resolve("src/reasoning-v1/topics/Inequality/INE-001");
const englishRows = await loadIneEnglishClosureRows(chapterDirectory);
assert.equal(englishRows.length, 360);

const closureByAuthority = new Map(
  INE_001_CLOSURE_GROUPS.flatMap((group) =>
    group.authorityIds.map((authorityId) => [authorityId, group.decision] as const),
  ),
);
const threeChoiceGuidedAuthorities = new Set([
  "CLASSIFY_SINGLE_CONCLUSION_TRUTH",
  "EVALUATE_INCLUSIVE_CONCLUSION_TRUTH",
]);
const hindiScript = /[\u0900-\u097F]/;
const hindiLettersOrDigits = /[\u0900-\u0963\u0966-\u097F]/;
const punjabiScript = /[\u0A00-\u0A7F]/;
const englishUi = /\b(?:which|what|assuming|statement|statements|conclusion|conclusions|relation|definitely|possible|impossible|therefore|because|option|means|true|false|answer|follows?|and|or)\b/i;

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const localized = buildIneLocalizedReviewRows(englishRows, locale);
  assert.equal(localized.length, 360);
  assert.equal(new Set(localized.map((row) => row.sourceRecordId)).size, 360);

  localized.forEach((row, index) => {
    const source = englishRows[index];
    assert.equal(row.authorityId, source.authorityId);
    assert.equal(row.seed, source.seed);
    assert.equal(row.difficulty, source.difficulty);
    assert.equal(row.deliveryProfile, source.deliveryProfile ?? "GUIDED_CONCEPT");
    assert.equal(row.options.length, source.options.length);
    assert.equal(row.correctIndex, source.correctIndex ?? source.options.indexOf(source.correctOption));
    assert.equal(row.correctOption, row.options[row.correctIndex]);
    assert.equal(new Set(row.options).size, row.options.length);
    assert.ok(row.options.every((option) => option.trim().length > 0));
    assert.equal(row.statements.length, source.statements?.length ?? 0);
    assert.equal(row.codeKey.length, source.codeKey?.length ?? 0);
    assert.equal(row.evidence.length, source.evidence?.length ?? 0);
    assert.equal(row.permanentQlId, null);
    assert.equal(row.questionStudioVisible, false);
    assert.ok(row.explanation.length >= 65, `${locale} explanation too short: ${row.sourceRecordId}`);
    assert.ok(row.explanation.length <= 420, `${locale} explanation too long: ${row.sourceRecordId}`);
    assert.doesNotMatch(row.stem, englishUi);
    assert.doesNotMatch(row.explanation, englishUi);
    for (const userFacingText of [
      ...row.statements,
      ...row.conclusions,
      ...row.codeKey,
      ...row.evidence,
      ...row.options,
    ]) {
      assert.doesNotMatch(userFacingText, englishUi, `${locale} contains untranslated UI text: ${row.sourceRecordId}`);
    }
    const queriedPair = source.stem.match(/(?:for|between) (.+?) (?:compared with|and) (.+?)(?: is [^?]+)?\?$/i);
    if (queriedPair) {
      assert.ok(row.stem.includes(queriedPair[1]), `${locale} lost the first queried entity.`);
      assert.ok(row.stem.includes(queriedPair[2]), `${locale} lost the second queried entity.`);
    }
    const endpoint = source.stem.match(/endpoint relation is (.+?)\?$/i)
      ?? source.stem.match(/has (.+?) as its strongest definite endpoint relation\?$/i);
    if (endpoint) assert.ok(row.stem.includes(endpoint[1]), `${locale} lost the required endpoint relation.`);
    const codedSymbol = source.stem.match(/coded symbol '(.+?)'/i);
    if (codedSymbol) assert.ok(row.stem.includes(codedSymbol[1]), `${locale} lost the queried code symbol.`);
    if (locale === "hi-IN") {
      assert.match(row.stem, hindiScript);
      assert.match(row.explanation, hindiScript);
      assert.doesNotMatch(`${row.stem} ${row.explanation}`, punjabiScript);
    } else {
      assert.match(row.stem, punjabiScript);
      assert.match(row.explanation, punjabiScript);
      assert.doesNotMatch(`${row.stem} ${row.explanation}`, hindiLettersOrDigits);
    }

    const decision = closureByAuthority.get(row.authorityId);
    assert.ok(decision);
    if (decision === "PERMANENT_QL_CANDIDATE") assert.equal(row.options.length, 4);
    else if (threeChoiceGuidedAuthorities.has(row.authorityId)) assert.equal(row.options.length, 3);
    else assert.equal(row.options.length, 4);
  });

  const language = locale === "hi-IN" ? "hindi" : "punjabi";
  const saved = JSON.parse(
    readFileSync(path.join(chapterDirectory, "localization", "review", `ine-001-${language}-review.json`), "utf8"),
  ) as typeof localized;
  assert.deepEqual(saved, localized, `${language} review pack is stale.`);
  const markdown = readFileSync(
    path.join(chapterDirectory, "localization", "review", `ine-001-${language}-review.md`),
    "utf8",
  );
  assert.match(markdown, locale === "hi-IN" ? /हिंदी समीक्षा पैक/ : /ਪੰਜਾਬੀ ਸਮੀਖਿਆ ਪੈਕ/);
  assert.doesNotMatch(markdown, /\b(?:undefined|null|NaN)\b/i);
}

console.log("INE-001 Hindi/Punjabi localization audit passed.", {
  englishSourceRecords: englishRows.length,
  localizedReviewRecords: englishRows.length * 2,
  authorityCount: new Set(englishRows.map((row) => row.authorityId)).size,
});
