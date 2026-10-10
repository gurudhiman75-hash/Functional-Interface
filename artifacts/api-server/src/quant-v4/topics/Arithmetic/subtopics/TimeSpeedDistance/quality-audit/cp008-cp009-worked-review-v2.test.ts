import assert from "node:assert/strict";
import { add, divide, equals, multiply, rational, subtract } from "../TSD-001/foundation/rational";
import { TSD_CP008_CONTENT_REVIEW_V2 } from "../TSD-002/cp008/content-review-candidate-v2";
import { TSD_CP009_CONTENT_REVIEW_V2 } from "../TSD-002/cp009/content-review-candidate-v2";
import { verifyTsdCp008 } from "../TSD-002/cp008/executable-verifier";
import { verifyTsdCp009 } from "../TSD-002/cp009/executable-verifier";
import { TSD_CP008_RENDERED_ENGLISH_QUESTIONS } from "../TSD-002/cp008/english-rendered-review";
import { TSD_CP008_RENDERED_LOCALIZED_QUESTIONS } from "../TSD-002/cp008/localized-rendered-review";
import { TSD_CP009_RENDERED_ENGLISH_QUESTIONS } from "../TSD-002/cp009/english-rendered-review";
import { TSD_CP009_RENDERED_LOCALIZED_QUESTIONS } from "../TSD-002/cp009/localized-rendered-review";

const cp008Sources = new Map([...TSD_CP008_RENDERED_ENGLISH_QUESTIONS.map(row => ({...row, locale: "en-IN"})), ...TSD_CP008_RENDERED_LOCALIZED_QUESTIONS].map(row => [`${row.locale}:${row.familyId}`, row]));
const cp009Sources = new Map([...TSD_CP009_RENDERED_ENGLISH_QUESTIONS.map(row => ({...row, locale: "en-IN"})), ...TSD_CP009_RENDERED_LOCALIZED_QUESTIONS].map(row => [`${row.locale}:${row.familyId}`, row]));
assert.equal(TSD_CP008_CONTENT_REVIEW_V2.length, 162);
assert.equal(TSD_CP009_CONTENT_REVIEW_V2.length, 198);
for (const rows of [TSD_CP008_CONTENT_REVIEW_V2, TSD_CP009_CONTENT_REVIEW_V2]) {
  for (const locale of ["en-IN", "hi-IN", "pa-IN"]) {
    const selected = rows.filter(row => row.locale === locale);
    assert.equal(selected.length, rows.length / 3);
    assert.equal(new Set(selected.map(row => row.familyId)).size, selected.length);
  }
  for (const row of rows) {
    assert.ok(row.calculations.length > 0);
    assert.ok(row.calculations.every(step => step.text.includes("=") && /[0-9]/.test(step.expression)));
    assert.ok(row.explanation.length >= row.calculations.length);
    assert.ok(!/[{}]/.test(row.stem));
    for (const key of ["contentApproved", "frozen", "registered", "persistence", "bank", "test", "mock", "public"] as const) assert.equal(row[key], false);
    if (row.locale !== "en-IN") {
      assert.ok(!/[A-Za-z]{2,}/.test(row.explanation.join(" ")), `${row.locale}/${row.familyId}: English label leakage`);
      const wrongScript = row.locale === "hi-IN" ? /\p{Script=Gurmukhi}/u : /\p{Script=Devanagari}/u;
      assert.ok(!wrongScript.test(row.explanation.join(" ")));
    }
  }
}
for (const row of TSD_CP008_CONTENT_REVIEW_V2) {
  assert.ok(verifyTsdCp008(row.input, row.sourceSolution).valid);
  assert.ok(equals(row.calculations.at(-1)!.value, row.sourceSolution.value));
  const source = cp008Sources.get(`${row.locale}:${row.familyId}`)!;
  assert.equal(row.stem, source.stem);
  assert.equal(row.answer, source.answer);
  assert.equal(row.sourceExplanation, source.explanation);
}
for (const row of TSD_CP009_CONTENT_REVIEW_V2) {
  assert.ok(verifyTsdCp009(row.input, row.sourceSolution).valid);
  const last = row.calculations.at(-1)!;
  const inSi = last.unit === "km" ? multiply(last.value, rational(1000)) : last.unit === "h" ? multiply(last.value, rational(3600)) : multiply(last.value, rational(5, 18));
  assert.ok(equals(inSi, row.sourceSolution.value));
  const source = cp009Sources.get(`${row.locale}:${row.familyId}`)!;
  assert.equal(row.answer, source.answer);
  assert.equal(row.sourceStem, source.stem);
  assert.equal(row.sourceExplanation, source.explanation);
  if (row.input.authorityKey !== "mediumShiftedMeetingPoint") assert.equal(row.stem, source.stem);
  else assert.ok(row.stem.includes("A") && row.stem.includes("B"));
  // Independently substitute the selected quadratic root into the two-leg time relation.
  const i = row.input;
  if (i.authorityKey === "mixedUnequalLegMediumState" && i.target === "BODY_SPEED") {
    const u = inSi;
    assert.ok(u.numerator * i.mediumSpeed.denominator > i.mediumSpeed.numerator * u.denominator);
    const t = add(divide(i.assistedDistance, add(u, i.mediumSpeed)), divide(i.opposedDistance, subtract(u, i.mediumSpeed)));
    assert.ok(equals(t, i.totalTime));
  }
}
const english = (family: string) => TSD_CP009_CONTENT_REVIEW_V2.find(row => row.familyId === family && row.locale === "en-IN")!;
assert.equal(english("111-A").answer, "42 km");
assert.ok(equals(english("109-C").calculations.at(-1)!.value, rational(18)));
assert.ok(equals(english("109-F").calculations.at(-1)!.value, rational(16)));
console.log("CP008/CP009 worked review V2: PASS 360 trilingual candidates, 20 authorities, exact answers, quadratic substitution, native labels, release locks");
