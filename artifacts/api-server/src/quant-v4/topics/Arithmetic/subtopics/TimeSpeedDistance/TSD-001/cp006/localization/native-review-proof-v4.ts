import { independentlyVerifyCp006 } from "../verifier";
import { TSD_CP006_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v5";
import { cp006NativeActor, hasDevanagariBeyondSharedDanda } from "./native-primitives-v1";
import { generateCp006NativeReviewV4, TSD_CP006_NATIVE_REVIEW_STATUS_V4 } from "./native-review-editorial-v4";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function nums(text: string): string { return (text.match(/\d+/g) ?? []).sort((a,b)=>Number(a)-Number(b)||a.localeCompare(b)).join("|"); }
function stripAllowedLatin(text: string): string {
  return text.replace(/m\/min/g, "").replace(/\bm\b/g, "").replace(/\b(?:AB|AC|BC|A|B|C|P)\b/g, "");
}

const rows = generateCp006NativeReviewV4();
assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "V4 lost English V5 freeze authority");
assert(rows.length === 156, `V4 expected 156 rows, found ${rows.length}`);
assert(rows.filter(r=>r.presentation.language === "hi").length === 78, "V4 Hindi count changed");
assert(rows.filter(r=>r.presentation.language === "pa").length === 78, "V4 Punjabi count changed");
assert(new Set(rows.map(r=>r.source.permanentQlId)).size === 13, "V4 QL coverage changed");
let verifierChecks = 0;
for (const language of ["hi","pa"] as const) {
  const subset = rows.filter(r=>r.presentation.language === language);
  assert(new Set(subset.map(r=>r.presentation.stem)).size === 78, `${language}: V4 stems not unique`);
  assert(new Set(subset.map(r=>r.source.objectFamily)).size === 18, `${language}: object-family coverage changed`);
  assert(new Set(subset.map(r=>r.source.routeFamily)).size === 6, `${language}: route-family coverage changed`);
  for (const ql of [...new Set(subset.map(r=>r.source.permanentQlId))]) {
    const q = subset.filter(r=>r.source.permanentQlId === ql);
    assert(q.length === 6, `${language}/${ql}: expected six rows`);
    assert(new Set(q.map(r=>r.presentation.stem)).size === 6, `${language}/${ql}: stem variation changed`);
    assert(new Set(q.map(r=>r.source.objectFamily)).size === 6, `${language}/${ql}: object variation changed`);
    assert(new Set(q.map(r=>r.source.routeFamily)).size === 6, `${language}/${ql}: route variation changed`);
  }
}
for (const row of rows) {
  const {source,presentation:p}=row;
  const label=`${source.seed}/${p.language}`;
  const learner=`${p.stem} ${p.explanation.steps.join(" ")}`;
  assert(source.lifecycle.englishFreezeStatus === "FROZEN" && source.lifecycle.productOwnerApprovalRecorded === true, `${label}: frozen source boundary changed`);
  assert(p.lifecycle.nativeReviewStatus === TSD_CP006_NATIVE_REVIEW_STATUS_V4, `${label}: V4 status missing`);
  assert(p.lifecycle.multilingualFreezeStatus === "UNFROZEN" && p.lifecycle.productOwnerApprovalRecorded === false, `${label}: native lifecycle unlocked`);
  assert(!p.lifecycle.questionStudioEnabled && p.lifecycle.questionBankStatus === "NOT_STORED" && p.lifecycle.testEligibility === "INELIGIBLE" && !p.lifecycle.publiclyPublishable, `${label}: downstream lifecycle unlocked`);
  assert(p.options.length === 4 && new Set(p.options).size === 4, `${label}: options changed`);
  assert(p.correctIndex === source.correctIndex && p.options[p.correctIndex] === p.answerText, `${label}: correct option identity changed`);
  assert(p.explanation.steps.length === 2, `${label}: explanation step count changed`);
  assert(nums(source.stem) === nums(p.stem), `${label}: numeric givens changed`);
  assert(source.options.every((option,i)=>nums(option) === nums(p.options[i]!)), `${label}: option numeric identity changed`);
  assert(nums(source.answerText) === nums(p.answerText), `${label}: answer numeric identity changed`);
  const family=cp006NativeActor(source.objectFamily,"A",p.language).replace(/ A$/,"");
  assert(p.stem.includes(family), `${label}: visible object family missing`);
  if (p.language === "hi") {
    assert(/[\u0900-\u097F]/u.test(p.stem) && !/[\u0A00-\u0A7F]/u.test(learner), `${label}: Hindi script gate failed`);
  } else {
    assert(/[\u0A00-\u0A7F]/u.test(p.stem) && !hasDevanagariBeyondSharedDanda(learner), `${label}: Punjabi script gate failed`);
  }
  assert(!/[A-Za-z]{2,}/.test(stripAllowedLatin(learner)), `${label}: unresolved English remains`);
  assert(!/पहली अगली|ਅਗਲੀ ਪਹਿਲੀ|ਪਹਿਲੀ ਅਗਲੀ/.test(p.stem), `${label}: awkward meeting-order phrase remains`);
  assert(!/ਕਿੰਨੇ ਮੁਲਾਕਾਤਾਂ|ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੇ|ਪੂਰੇ ਹੋਣ ਵਾਲੇ ਮੁਲਾਕਾਤਾਂ/.test(p.stem), `${label}: Punjabi plural agreement defect remains`);
  assert(!/ਮਾਪਿਆਂ/.test(p.stem), `${label}: Punjabi QL082 phrasing defect remains`);
  assert(!/\sand\s/.test(learner), `${label}: English conjunction leaked`);
  assert(independentlyVerifyCp006(source.solveMode, source.input, source.solution).valid, `${label}: verifier rejected source`);
  verifierChecks += 1;
}
console.log(JSON.stringify({status:"PASS",phase:"TSD_CP006_HI_PA_NATIVE_EDITORIAL_REVIEW_V4",englishAuthority:TSD_CP006_ENGLISH_FREEZE_ID,nativeRows:156,hindiRows:78,punjabiRows:78,permanentQlRange:"TSD-QL-071..TSD-QL-083",rowsPerQlPerLanguage:6,selectedObjectFamiliesPerLanguage:18,selectedRouteFamiliesPerLanguage:6,independentVerifierChecks:verifierChecks,frozenStemNumericMultisetParityGate:true,optionNumericIdentityGate:true,visibleNativeObjectFamilyGate:true,nativeScriptLeakGate:true,englishLeakGate:true,nativeGrammarGate:true,explanationStepsPerQuestion:2,multilingualFreezeStatus:"UNFROZEN",productOwnerApprovalRecorded:false,questionStudioEnabled:false,questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false,nextGate:"MANUAL_NATIVE_V4_ARTIFACT_AUDIT_BEFORE_PRODUCT_OWNER_REVIEW"},null,2));
