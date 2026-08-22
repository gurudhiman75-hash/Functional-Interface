import { renderCp007LocalizedReviewQuestions } from "./localized-rendered-review";
import { TSD_CP007_PERMANENT_QL_IDS } from "./ql-allocation";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`TSD-CP-007 localized rendered review proof failed: ${message}`);
}

function digitMultiset(value: string): readonly string[] {
  return Object.freeze([...(value.match(/\d+/g) ?? [])].sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)));
}

const rows = renderCp007LocalizedReviewQuestions();
assert(rows.length === 132, `expected 132 rendered localized questions, found ${rows.length}`);

for (const locale of ["hi-IN", "pa-IN"] as const) {
  const localized = rows.filter((row) => row.locale === locale);
  assert(localized.length === 66, `${locale}: expected 66 questions`);
  assert(new Set(localized.map((row) => row.familyId)).size === 66, `${locale}: family IDs are not unique`);
  assert(new Set(localized.map((row) => row.qlId)).size === 11, `${locale}: expected all 11 permanent QLs`);
  assert(JSON.stringify([...new Set(localized.map((row) => row.qlId))]) === JSON.stringify(TSD_CP007_PERMANENT_QL_IDS), `${locale}: QL order differs from permanent allocation`);

  for (const qlId of TSD_CP007_PERMANENT_QL_IDS) {
    assert(localized.filter((row) => row.qlId === qlId).length === 6, `${locale}/${qlId}: expected six questions`);
  }

  for (const row of localized) {
    assert(!/[{}]/.test(row.stem), `${locale}/${row.familyId}: unresolved placeholder remains`);
    assert(JSON.stringify(digitMultiset(row.stem)) === JSON.stringify(digitMultiset(row.sourceEnglishStem)), `${locale}/${row.familyId}: numeric multiset differs from frozen English`);
    if (locale === "hi-IN") {
      assert(/[\u0900-\u097F]/.test(row.stem), `${row.familyId}: Hindi script missing`);
      assert(!/चाल/.test(row.stem), `${row.familyId}: deprecated Hindi term 'चाल' remains in rendered question`);
    }
    if (locale === "pa-IN") assert(/[\u0A00-\u0A7F]/.test(row.stem), `${row.familyId}: Punjabi script missing`);
    assert(!/\b(the engine|the rear|the front|starting position|included in the count|excluded from the count)\b/i.test(row.stem), `${locale}/${row.familyId}: dynamic English review phrase leaked into localization`);
  }
}

console.log("TSD-CP-007 LOCALIZED RENDERED REVIEW PROOF: PASS");
console.log(JSON.stringify({
  totalRenderedLocalizedQuestions: rows.length,
  hindiQuestions: rows.filter((row) => row.locale === "hi-IN").length,
  punjabiQuestions: rows.filter((row) => row.locale === "pa-IN").length,
  questionsPerQlPerLocale: 6,
  qlsPerLocale: 11,
  unresolvedPlaceholders: 0,
  numericParity: "IDENTICAL_MULTISET_TO_FROZEN_ENGLISH_CASES",
  hindiTerminology: "गति",
  deprecatedHindiChaalOccurrences: 0,
  localizationStatus: "REVIEW_CANDIDATE",
  questionStudioEnabled: false,
}, null, 2));
