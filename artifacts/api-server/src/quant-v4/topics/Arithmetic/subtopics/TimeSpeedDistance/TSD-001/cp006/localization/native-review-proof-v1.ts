import { TSD_CP006_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v5";
import { independentlyVerifyCp006 } from "../verifier";
import { generateCp006NativeReviewV1, TSD_CP006_NATIVE_REVIEW_STATUS_V1 } from "./native-review-candidate-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericTokens(text: string): readonly string[] {
  return text.match(/\d+/g) ?? [];
}

function stripAllowedLatin(text: string): string {
  return text
    .replace(/m\/min/g, "")
    .replace(/\bm\b/g, "")
    .replace(/\b(?:AB|AC|BC|A|B|C|P)\b/g, "");
}

const rows = generateCp006NativeReviewV1();
assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "CP006 native V1 must depend on exact English V5 freeze");
assert(rows.length === 156, `CP006 native V1 expected 156 rows, found ${rows.length}`);
assert(rows.filter((row) => row.presentation.language === "hi").length === 78, "CP006 native V1 expected 78 Hindi rows");
assert(rows.filter((row) => row.presentation.language === "pa").length === 78, "CP006 native V1 expected 78 Punjabi rows");
assert(new Set(rows.map((row) => row.source.permanentQlId)).size === 13, "CP006 native V1 must cover 13 QLs");

let verifierChecks = 0;
for (const language of ["hi", "pa"] as const) {
  const subset = rows.filter((row) => row.presentation.language === language);
  assert(new Set(subset.map((row) => row.presentation.stem)).size === 78, `${language}: native stems must be unique`);
  assert(new Set(subset.map((row) => row.source.objectFamily)).size === 18, `${language}: object-family coverage changed`);
  assert(new Set(subset.map((row) => row.source.routeFamily)).size === 6, `${language}: route-family coverage changed`);
  for (const ql of [...new Set(subset.map((row) => row.source.permanentQlId))]) {
    const qlRows = subset.filter((row) => row.source.permanentQlId === ql);
    assert(qlRows.length === 6, `${language}/${ql}: expected six localized rows`);
    assert(new Set(qlRows.map((row) => row.presentation.stem)).size === 6, `${language}/${ql}: expected six unique native stems`);
    assert(new Set(qlRows.map((row) => row.source.objectFamily)).size === 6, `${language}/${ql}: expected six object families`);
    assert(new Set(qlRows.map((row) => row.source.routeFamily)).size === 6, `${language}/${ql}: expected six route families`);
  }
}

for (const row of rows) {
  const { source, presentation } = row;
  const label = `${source.seed}/${presentation.language}`;
  assert(source.lifecycle.englishFreezeStatus === "FROZEN", `${label}: source is not frozen English`);
  assert(source.lifecycle.productOwnerApprovalRecorded === true, `${label}: English approval marker missing`);
  assert(presentation.lifecycle.nativeReviewStatus === TSD_CP006_NATIVE_REVIEW_STATUS_V1, `${label}: native review status changed`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${label}: multilingual surface must remain unfrozen`);
  assert(presentation.lifecycle.productOwnerApprovalRecorded === false, `${label}: native product-owner approval must remain false`);
  assert(!presentation.lifecycle.questionStudioEnabled, `${label}: CP006 native Studio unlocked`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${label}: CP006 native Bank unlocked`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${label}: CP006 native tests unlocked`);
  assert(!presentation.lifecycle.publiclyPublishable, `${label}: CP006 native publication unlocked`);

  assert(presentation.options.length === 4 && new Set(presentation.options).size === 4, `${label}: localized options must remain four and unique`);
  assert(presentation.options[presentation.correctIndex] === presentation.answerText, `${label}: localized correct-option identity failed`);
  assert(presentation.correctIndex === source.correctIndex, `${label}: correct index changed`);
  assert(presentation.explanation.steps.length === 2, `${label}: explanation must have exactly two steps`);
  assert(numericTokens(source.stem).join("|") === numericTokens(presentation.stem).join("|"), `${label}: frozen stem numeric givens changed`);
  assert(source.options.every((option, index) => numericTokens(option).join("|") === numericTokens(presentation.options[index]!).join("|")), `${label}: option numeric identity changed`);
  assert(numericTokens(source.answerText).join("|") === numericTokens(presentation.answerText).join("|"), `${label}: answer numeric identity changed`);

  if (presentation.language === "hi") {
    assert(/[\u0900-\u097F]/u.test(presentation.stem), `${label}: Hindi stem has no Devanagari`);
    assert(!/[\u0A00-\u0A7F]/u.test(`${presentation.stem} ${presentation.explanation.steps.join(" ")}`), `${label}: Punjabi script leaked into Hindi`);
  } else {
    assert(/[\u0A00-\u0A7F]/u.test(presentation.stem), `${label}: Punjabi stem has no Gurmukhi`);
    assert(!/[\u0900-\u097F]/u.test(`${presentation.stem} ${presentation.explanation.steps.join(" ")}`), `${label}: Devanagari leaked into Punjabi`);
  }
  assert(!/[A-Za-z]{2,}/.test(stripAllowedLatin(`${presentation.stem} ${presentation.explanation.steps.join(" ")}`)), `${label}: unresolved English word remains`);

  const verified = independentlyVerifyCp006(source.solveMode, source.input, source.solution);
  assert(verified.valid, `${label}: independent verifier rejected frozen source`);
  verifierChecks += 1;
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_HI_PA_NATIVE_REVIEW_V1",
  englishAuthority: TSD_CP006_ENGLISH_FREEZE_ID,
  nativeRows: rows.length,
  hindiRows: 78,
  punjabiRows: 78,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  rowsPerQlPerLanguage: 6,
  selectedObjectFamiliesPerLanguage: 18,
  selectedRouteFamiliesPerLanguage: 6,
  independentVerifierChecks: verifierChecks,
  frozenStemNumericParityGate: true,
  optionNumericIdentityGate: true,
  nativeScriptLeakGate: true,
  englishLeakGate: true,
  explanationStepsPerQuestion: 2,
  multilingualFreezeStatus: "UNFROZEN",
  productOwnerApprovalRecorded: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "MANUAL_NATIVE_ARTIFACT_AUDIT_BEFORE_PRODUCT_OWNER_REVIEW",
}, null, 2));
