import { independentlyVerifyCp006 } from "../verifier";
import { TSD_CP006_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v5";
import { cp006NativeActor, hasDevanagariBeyondSharedDanda } from "./native-primitives-v1";
import { generateCp006NativeReviewV3, TSD_CP006_NATIVE_REVIEW_STATUS_V3 } from "./native-review-editorial-v3";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function numericMultiset(text: string): string {
  return (text.match(/\d+/g) ?? []).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b)).join("|");
}

function stripAllowedLatin(text: string): string {
  return text
    .replace(/m\/min/g, "")
    .replace(/\bm\b/g, "")
    .replace(/\b(?:AB|AC|BC|A|B|C|P)\b/g, "");
}

const rows = generateCp006NativeReviewV3();
assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "CP006 native V3 lost English V5 freeze authority");
assert(rows.length === 156, `CP006 native V3 expected 156 rows, found ${rows.length}`);
assert(rows.filter((row) => row.presentation.language === "hi").length === 78, "CP006 native V3 expected 78 Hindi rows");
assert(rows.filter((row) => row.presentation.language === "pa").length === 78, "CP006 native V3 expected 78 Punjabi rows");
assert(new Set(rows.map((row) => row.source.permanentQlId)).size === 13, "CP006 native V3 must cover 13 QLs");

let verifierChecks = 0;
for (const language of ["hi", "pa"] as const) {
  const subset = rows.filter((row) => row.presentation.language === language);
  assert(new Set(subset.map((row) => row.presentation.stem)).size === 78, `${language}: V3 native stems must be unique`);
  assert(new Set(subset.map((row) => row.source.objectFamily)).size === 18, `${language}: V3 object-family coverage changed`);
  assert(new Set(subset.map((row) => row.source.routeFamily)).size === 6, `${language}: V3 route-family coverage changed`);
  for (const ql of [...new Set(subset.map((row) => row.source.permanentQlId))]) {
    const qlRows = subset.filter((row) => row.source.permanentQlId === ql);
    assert(qlRows.length === 6, `${language}/${ql}: expected six V3 rows`);
    assert(new Set(qlRows.map((row) => row.presentation.stem)).size === 6, `${language}/${ql}: expected six unique V3 stems`);
    assert(new Set(qlRows.map((row) => row.source.objectFamily)).size === 6, `${language}/${ql}: expected six V3 object families`);
    assert(new Set(qlRows.map((row) => row.source.routeFamily)).size === 6, `${language}/${ql}: expected six V3 route families`);
  }
}

for (const row of rows) {
  const { source, presentation } = row;
  const label = `${source.seed}/${presentation.language}`;
  const learnerText = `${presentation.stem} ${presentation.explanation.steps.join(" ")}`;
  assert(source.lifecycle.englishFreezeStatus === "FROZEN", `${label}: frozen English source changed`);
  assert(source.lifecycle.productOwnerApprovalRecorded === true, `${label}: English approval marker missing`);
  assert(presentation.lifecycle.nativeReviewStatus === TSD_CP006_NATIVE_REVIEW_STATUS_V3, `${label}: V3 status missing`);
  assert(presentation.lifecycle.multilingualFreezeStatus === "UNFROZEN", `${label}: multilingual freeze unlocked`);
  assert(presentation.lifecycle.productOwnerApprovalRecorded === false, `${label}: native approval must remain false`);
  assert(!presentation.lifecycle.questionStudioEnabled, `${label}: CP006 native Studio unlocked`);
  assert(presentation.lifecycle.questionBankStatus === "NOT_STORED", `${label}: CP006 native Bank unlocked`);
  assert(presentation.lifecycle.testEligibility === "INELIGIBLE", `${label}: CP006 native tests unlocked`);
  assert(!presentation.lifecycle.publiclyPublishable, `${label}: CP006 native publication unlocked`);

  assert(presentation.options.length === 4 && new Set(presentation.options).size === 4, `${label}: expected four unique options`);
  assert(presentation.correctIndex === source.correctIndex, `${label}: correct index changed`);
  assert(presentation.options[presentation.correctIndex] === presentation.answerText, `${label}: localized correct-option identity failed`);
  assert(presentation.explanation.steps.length === 2, `${label}: explanation must have exactly two steps`);
  assert(numericMultiset(source.stem) === numericMultiset(presentation.stem), `${label}: frozen numeric givens changed`);
  assert(source.options.every((option, index) => numericMultiset(option) === numericMultiset(presentation.options[index]!)), `${label}: option numeric identity changed`);
  assert(numericMultiset(source.answerText) === numericMultiset(presentation.answerText), `${label}: answer numeric identity changed`);

  const family = cp006NativeActor(source.objectFamily, "A", presentation.language).replace(/ A$/, "");
  assert(presentation.stem.includes(family), `${label}: visible native object family missing`);
  if (presentation.language === "hi") {
    assert(/[\u0900-\u097F]/u.test(presentation.stem), `${label}: Hindi stem has no Devanagari`);
    assert(!/[\u0A00-\u0A7F]/u.test(learnerText), `${label}: Punjabi script leaked into Hindi`);
  } else {
    assert(/[\u0A00-\u0A7F]/u.test(presentation.stem), `${label}: Punjabi stem has no Gurmukhi`);
    assert(!hasDevanagariBeyondSharedDanda(learnerText), `${label}: Devanagari leaked into Punjabi`);
  }
  assert(!/[A-Za-z]{2,}/.test(stripAllowedLatin(learnerText)), `${label}: unresolved English word remains`);
  assert(!/पहली अगली|ਪਹਿਲੀ ਅਗਲੀ/.test(presentation.stem), `${label}: awkward next-return phrase remains`);
  assert(!/मापਿਆਂ|ਮਾਪਿਆਂ/.test(presentation.stem), `${label}: QL082 native phrasing defect remains`);
  assert(!/ਕਿੰਨੇ ਮੁਲਾਕਾਤਾਂ|ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੇ|ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੇ/.test(presentation.stem), `${label}: Punjabi meeting plural agreement defect remains`);
  assert(!/\sand\s/.test(learnerText), `${label}: English conjunction leaked`);

  const verified = independentlyVerifyCp006(source.solveMode, source.input, source.solution);
  assert(verified.valid, `${label}: independent verifier rejected frozen source`);
  verifierChecks += 1;
}

console.log(JSON.stringify({
  status: "PASS",
  phase: "TSD_CP006_HI_PA_NATIVE_EDITORIAL_REVIEW_V3",
  englishAuthority: TSD_CP006_ENGLISH_FREEZE_ID,
  nativeRows: rows.length,
  hindiRows: 78,
  punjabiRows: 78,
  permanentQlRange: "TSD-QL-071..TSD-QL-083",
  rowsPerQlPerLanguage: 6,
  selectedObjectFamiliesPerLanguage: 18,
  selectedRouteFamiliesPerLanguage: 6,
  independentVerifierChecks: verifierChecks,
  frozenStemNumericMultisetParityGate: true,
  optionNumericIdentityGate: true,
  visibleNativeObjectFamilyGate: true,
  nativeScriptLeakGate: true,
  englishLeakGate: true,
  nativePluralAgreementGate: true,
  explanationStepsPerQuestion: 2,
  multilingualFreezeStatus: "UNFROZEN",
  productOwnerApprovalRecorded: false,
  questionStudioEnabled: false,
  questionBankStatus: "NOT_STORED",
  testEligibility: "INELIGIBLE",
  publiclyPublishable: false,
  nextGate: "MANUAL_NATIVE_V3_ARTIFACT_AUDIT_BEFORE_PRODUCT_OWNER_REVIEW",
}, null, 2));
