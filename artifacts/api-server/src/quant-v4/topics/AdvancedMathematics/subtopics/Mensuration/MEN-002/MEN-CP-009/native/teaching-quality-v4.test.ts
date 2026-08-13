import assert from "node:assert/strict";
import { buildMenCp009V3StudentReviewBatch } from "../coverage-v2/student-review-batch-v3";
import { generateMenCp009NativeTeachingV2 } from "./runtime-v2";

const review = buildMenCp009V3StudentReviewBatch();
const allowedAsciiWords = new Set(["cm", "TSA", "CSA"]);
const percentFamilies = new Set([
  "SPHERE_SURFACE_PERCENT_CHANGE",
  "SPHERE_VOLUME_PERCENT_CHANGE",
]);
const ratioFamilies = new Set([
  "SPHERE_SURFACE_RATIO",
  "SPHERE_VOLUME_RATIO",
  "RADIUS_RATIO_FROM_SURFACE_RATIO",
  "RADIUS_RATIO_FROM_VOLUME_RATIO",
  "SPHERE_HEMISPHERE_MEASURE_RATIO",
  "SPHERE_OR_HEMISPHERE_CURVED_SURFACE_VOLUME_RATIO",
  "HEMISPHERE_TOTAL_SURFACE_VOLUME_RATIO",
]);

let checked = 0;
let punjabiSurfaceOrthographyChecks = 0;
for (const source of review.rows) {
  for (const language of ["hi", "pa"] as const) {
    const native = generateMenCp009NativeTeachingV2(source.permanentQlId, source.seed, language);
    const prose = [native.stem, ...native.explanationLines].join(" ");
    const allLearnerText = [
      native.stem,
      ...native.options.map((option) => option.display),
      native.answer,
      ...native.explanationLines,
    ].join(" ");
    const asciiWords = prose.match(/[A-Za-z]{2,}/g) ?? [];
    const unexpected = asciiWords.filter((word) => !allowedAsciiWords.has(word));
    assert.deepEqual(
      unexpected,
      [],
      `${source.permanentQlId} ${language}: residual English prose: ${unexpected.join(", ")}`,
    );

    const finalLine = native.explanationLines.at(-1)!;
    assert.ok(finalLine.includes(native.answer), `${source.permanentQlId} ${language}: final line must contain answer.`);

    if (percentFamilies.has(native.familyId)) {
      assert.ok(
        language === "hi" ? /वृद्धि/.test(finalLine) : /ਵਾਧਾ/.test(finalLine),
        `${source.permanentQlId} ${language}: percent-change answer must explicitly say increase.`,
      );
    } else {
      assert.ok(
        language === "hi" ? !/वृद्धि/.test(finalLine) : !/ਵਾਧਾ/.test(finalLine),
        `${source.permanentQlId} ${language}: non-percent answer must not be mislabeled as an increase.`,
      );
    }

    if (ratioFamilies.has(native.familyId)) {
      assert.ok(
        language === "hi" ? /अनुपात/.test(finalLine) : /ਅਨੁਪਾਤ/.test(finalLine),
        `${source.permanentQlId} ${language}: ratio answer must be named as a ratio.`,
      );
    }

    if (language === "hi") {
      assert.ok(!/पृष्ठीय क्षेत्रफल|वक्र पृष्ठीय क्षेत्रफल|कुल पृष्ठीय क्षेत्रफल/.test(prose),
        `${source.permanentQlId}: learner Hindi must use सतह का क्षेत्रफल wording.`);
      assert.ok(!/एक गोले का सतह का क्षेत्रफल/.test(native.stem));
      assert.ok(!/सतह का क्षेत्रफलों/.test(native.stem));
    } else {
      assert.ok(!/ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ|ਵਕਰ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ|ਕੁੱਲ ਪ੍ਰਿਸ਼ਠੀ ਖੇਤਰਫਲ/.test(allLearnerText),
        `${source.permanentQlId}: learner Punjabi must not use bookish ਪ੍ਰਿਸ਼ਠੀ terminology.`);
      assert.ok(!/ਸਤਹ/.test(allLearnerText),
        `${source.permanentQlId}: learner Punjabi must spell surface as ਸਤ੍ਹਾ, not ਸਤਹ.`);
      assert.ok(!/ਅਰਧ ਵਿਆਸ/.test(native.stem));
      assert.ok(!/ਸਤ੍ਹਾ ਦਾ ਖੇਤਰਫਲਾਂ/.test(native.stem));
      assert.ok(!/ਉਨ੍ਹਾਂ ਦੇ ਸਤ੍ਹਾ ਦੇ ਖੇਤਰਫਲਾਂ/.test(native.stem));
      punjabiSurfaceOrthographyChecks += 1;
    }

    checked += 1;
  }
}

assert.equal(checked, 220);
assert.equal(punjabiSurfaceOrthographyChecks, 110);
console.log(`MEN-CP-009 native teaching quality V4 passed: ${checked} review surfaces, canonical सतह का क्षेत्रफल / ਸਤ੍ਹਾ ਦਾ ਖੇਤਰਫਲ terminology, 110 Punjabi orthography checks, no residual English prose, semantic final lines, and native stem grammar guards.`);
