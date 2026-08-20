import { TSD_CP006_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v5";
import { independentlyVerifyCp006 } from "../verifier";
import { generateCp006NativeReviewV2, TSD_CP006_NATIVE_REVIEW_STATUS_V2 } from "./native-review-editorial-v2";
import { hasDevanagariBeyondSharedDanda } from "./native-primitives-v1";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function numericTokens(text: string): readonly string[] { return text.match(/\d+/g) ?? []; }
function numericMultiset(text: string): string { return [...numericTokens(text)].sort((a,b)=>Number(a)-Number(b)||a.localeCompare(b)).join("|"); }
function stripAllowedLatin(text: string): string {
  return text.replace(/m\/min/g, "").replace(/\bm\b/g, "").replace(/\b(?:AB|AC|BC|A|B|C|P)\b/g, "");
}

const rows = generateCp006NativeReviewV2();
assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "CP006 native V2 must use exact English freeze");
assert(rows.length === 156, `expected 156 rows, found ${rows.length}`);
assert(rows.filter(r=>r.presentation.language==="hi").length===78, "expected 78 Hindi rows");
assert(rows.filter(r=>r.presentation.language==="pa").length===78, "expected 78 Punjabi rows");
assert(new Set(rows.map(r=>r.source.permanentQlId)).size===13, "expected 13 QLs");

let verifierChecks=0;
for (const language of ["hi","pa"] as const) {
  const subset=rows.filter(r=>r.presentation.language===language);
  assert(new Set(subset.map(r=>r.presentation.stem)).size===78, `${language}: stems must be unique`);
  assert(new Set(subset.map(r=>r.source.objectFamily)).size===18, `${language}: object coverage changed`);
  assert(new Set(subset.map(r=>r.source.routeFamily)).size===6, `${language}: route coverage changed`);
  for (const ql of [...new Set(subset.map(r=>r.source.permanentQlId))]) {
    const qlRows=subset.filter(r=>r.source.permanentQlId===ql);
    assert(qlRows.length===6, `${language}/${ql}: expected six rows`);
    assert(new Set(qlRows.map(r=>r.presentation.stem)).size===6, `${language}/${ql}: stems not unique`);
    assert(new Set(qlRows.map(r=>r.source.objectFamily)).size===6, `${language}/${ql}: object coverage changed`);
    assert(new Set(qlRows.map(r=>r.source.routeFamily)).size===6, `${language}/${ql}: route coverage changed`);
  }
}

for (const row of rows) {
  const {source,presentation}=row;
  const label=`${source.seed}/${presentation.language}`;
  assert(source.lifecycle.englishFreezeStatus==="FROZEN", `${label}: source not frozen`);
  assert(source.lifecycle.productOwnerApprovalRecorded===true, `${label}: English approval missing`);
  assert(presentation.lifecycle.nativeReviewStatus===TSD_CP006_NATIVE_REVIEW_STATUS_V2, `${label}: V2 status missing`);
  assert(presentation.lifecycle.multilingualFreezeStatus==="UNFROZEN", `${label}: native freeze unlocked`);
  assert(presentation.lifecycle.productOwnerApprovalRecorded===false, `${label}: native approval unexpectedly true`);
  assert(!presentation.lifecycle.questionStudioEnabled, `${label}: Studio unlocked`);
  assert(presentation.lifecycle.questionBankStatus==="NOT_STORED", `${label}: Bank unlocked`);
  assert(presentation.lifecycle.testEligibility==="INELIGIBLE", `${label}: tests unlocked`);
  assert(!presentation.lifecycle.publiclyPublishable, `${label}: publication unlocked`);
  assert(presentation.options.length===4 && new Set(presentation.options).size===4, `${label}: option uniqueness failed`);
  assert(presentation.options[presentation.correctIndex]===presentation.answerText, `${label}: answer identity failed`);
  assert(presentation.correctIndex===source.correctIndex, `${label}: correct index changed`);
  assert(presentation.explanation.steps.length===2, `${label}: explanation must have two steps`);
  assert(numericMultiset(source.stem)===numericMultiset(presentation.stem), `${label}: frozen numeric givens changed`);
  assert(source.options.every((o,i)=>numericTokens(o).join("|")===numericTokens(presentation.options[i]!).join("|")), `${label}: option numeric identity changed`);
  assert(numericTokens(source.answerText).join("|")===numericTokens(presentation.answerText).join("|"), `${label}: answer numeric identity changed`);
  const text=`${presentation.stem} ${presentation.explanation.steps.join(" ")}`;
  if (presentation.language==="hi") {
    assert(/[\u0900-\u097F]/u.test(presentation.stem), `${label}: no Hindi script`);
    assert(!/[\u0A00-\u0A7F]/u.test(text), `${label}: Punjabi leaked into Hindi`);
  } else {
    assert(/[\u0A00-\u0A7F]/u.test(presentation.stem), `${label}: no Punjabi script`);
    assert(!hasDevanagariBeyondSharedDanda(text), `${label}: Devanagari leaked into Punjabi`);
  }
  assert(!/[A-Za-z]{2,}/.test(stripAllowedLatin(text)), `${label}: unresolved English word remains`);
  assert(independentlyVerifyCp006(source.solveMode, source.input, source.solution).valid, `${label}: verifier rejected source`);
  verifierChecks++;
}
console.log(JSON.stringify({status:"PASS",phase:"TSD_CP006_HI_PA_NATIVE_REVIEW_V2",englishAuthority:TSD_CP006_ENGLISH_FREEZE_ID,nativeRows:rows.length,hindiRows:78,punjabiRows:78,permanentQlRange:"TSD-QL-071..TSD-QL-083",rowsPerQlPerLanguage:6,selectedObjectFamiliesPerLanguage:18,selectedRouteFamiliesPerLanguage:6,independentVerifierChecks:verifierChecks,frozenStemNumericMultisetParityGate:true,optionNumericIdentityGate:true,nativeScriptLeakGate:true,englishLeakGate:true,explanationStepsPerQuestion:2,multilingualFreezeStatus:"UNFROZEN",productOwnerApprovalRecorded:false,questionStudioEnabled:false,questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false,nextGate:"MANUAL_NATIVE_ARTIFACT_AUDIT_BEFORE_PRODUCT_OWNER_REVIEW"},null,2));
