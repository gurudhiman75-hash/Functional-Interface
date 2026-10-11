import { independentlyVerifyCp006 } from "../verifier";
import { TSD_CP006_ENGLISH_FREEZE_ID } from "../english-approved-freeze-v5";
import { cp006NativeActor, hasDevanagariBeyondSharedDanda } from "./native-primitives-v1";
import { generateCp006NativeReviewV5, TSD_CP006_NATIVE_REVIEW_STATUS_V5 } from "./native-review-editorial-v5";

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
function nums(text: string): string { return (text.match(/\d+/g) ?? []).sort((a,b)=>Number(a)-Number(b)||a.localeCompare(b)).join("|"); }
function stripAllowedLatin(text: string): string { return text.replace(/m\/min/g, "").replace(/\bm\b/g, "").replace(/\b(?:AB|AC|BC|A|B|C|P)\b/g, ""); }

const rows=generateCp006NativeReviewV5();
assert(TSD_CP006_ENGLISH_FREEZE_ID === "TSD-CP-006-EN-v5-frozen", "V5 lost English V5 freeze authority");
assert(rows.length===156,"V5 must contain 156 rows");
assert(rows.filter(r=>r.presentation.language==="hi").length===78,"V5 Hindi count changed");
assert(rows.filter(r=>r.presentation.language==="pa").length===78,"V5 Punjabi count changed");
assert(new Set(rows.map(r=>r.source.permanentQlId)).size===13,"V5 QL coverage changed");
let verifierChecks=0;
for(const language of ["hi","pa"] as const){
  const subset=rows.filter(r=>r.presentation.language===language);
  assert(new Set(subset.map(r=>r.presentation.stem)).size===78,`${language}: stems not unique`);
  assert(new Set(subset.map(r=>r.source.objectFamily)).size===18,`${language}: object coverage changed`);
  assert(new Set(subset.map(r=>r.source.routeFamily)).size===6,`${language}: route coverage changed`);
  for(const ql of [...new Set(subset.map(r=>r.source.permanentQlId))]){
    const q=subset.filter(r=>r.source.permanentQlId===ql);
    assert(q.length===6,`${language}/${ql}: expected six rows`);
    assert(new Set(q.map(r=>r.presentation.stem)).size===6,`${language}/${ql}: stem variation changed`);
    assert(new Set(q.map(r=>r.source.objectFamily)).size===6,`${language}/${ql}: object variation changed`);
    assert(new Set(q.map(r=>r.source.routeFamily)).size===6,`${language}/${ql}: route variation changed`);
  }
}
for(const row of rows){
  const {source,presentation:p}=row; const label=`${source.seed}/${p.language}`; const learner=`${p.stem} ${p.explanation.steps.join(" ")}`;
  assert(source.lifecycle.englishFreezeStatus==="FROZEN"&&source.lifecycle.productOwnerApprovalRecorded===true,`${label}: English freeze changed`);
  assert(p.lifecycle.nativeReviewStatus===TSD_CP006_NATIVE_REVIEW_STATUS_V5,`${label}: V5 status missing`);
  assert(p.lifecycle.multilingualFreezeStatus==="UNFROZEN"&&p.lifecycle.productOwnerApprovalRecorded===false,`${label}: native lifecycle unlocked`);
  assert(!p.lifecycle.questionStudioEnabled&&p.lifecycle.questionBankStatus==="NOT_STORED"&&p.lifecycle.testEligibility==="INELIGIBLE"&&!p.lifecycle.publiclyPublishable,`${label}: downstream lifecycle unlocked`);
  assert(p.options.length===4&&new Set(p.options).size===4,`${label}: options changed`);
  assert(p.correctIndex===source.correctIndex&&p.options[p.correctIndex]===p.answerText,`${label}: answer identity changed`);
  assert(p.explanation.steps.length===2,`${label}: explanation step count changed`);
  assert(nums(source.stem)===nums(p.stem),`${label}: numeric givens changed`);
  assert(source.options.every((option,i)=>nums(option)===nums(p.options[i]!)),`${label}: option numeric identity changed`);
  assert(nums(source.answerText)===nums(p.answerText),`${label}: answer numeric identity changed`);
  const family=cp006NativeActor(source.objectFamily,"A",p.language).replace(/ A$/,""); assert(p.stem.includes(family),`${label}: object family invisible`);
  if(p.language==="hi") assert(/[\u0900-\u097F]/u.test(p.stem)&&!/[\u0A00-\u0A7F]/u.test(learner),`${label}: Hindi script gate failed`);
  else assert(/[\u0A00-\u0A7F]/u.test(p.stem)&&!hasDevanagariBeyondSharedDanda(learner),`${label}: Punjabi script gate failed`);
  assert(!/[A-Za-z]{2,}/.test(stripAllowedLatin(learner)),`${label}: unresolved English remains`);
  assert(!/पहली अगली|ਅਗਲੀ ਪਹਿਲੀ|ਪਹਿਲੀ ਅਗਲੀ|ਮਾਪਿਆਂ|ਕਿੰਨੇ ਮੁਲਾਕਾਤਾਂ|ਮੁਲਾਕਾਤਾਂ ਕਿੰਨੇ|ਪੂਰੇ ਹੋਣ ਵਾਲੇ ਮੁਲਾਕਾਤਾਂ|\sand\s/.test(learner),`${label}: known editorial defect remains`);
  assert(!/C की \d+(?: \d+\/\d+)? m\/min विपरीत दिशा में है/.test(p.stem),`${label}: Hindi C-speed agreement defect remains`);
  assert(!/C ਦੀ \d+(?: \d+\/\d+)? m\/min ਵਿਰੋਧੀ ਦਿਸ਼ਾ ਵਿੱਚ ਹੈ/.test(p.stem),`${label}: Punjabi C-speed agreement defect remains`);
  assert(independentlyVerifyCp006(source.solveMode,source.input,source.solution).valid,`${label}: verifier rejected source`); verifierChecks+=1;
}
console.log(JSON.stringify({status:"PASS",phase:"TSD_CP006_HI_PA_NATIVE_EDITORIAL_REVIEW_V5",englishAuthority:TSD_CP006_ENGLISH_FREEZE_ID,nativeRows:156,hindiRows:78,punjabiRows:78,permanentQlRange:"TSD-QL-071..TSD-QL-083",rowsPerQlPerLanguage:6,selectedObjectFamiliesPerLanguage:18,selectedRouteFamiliesPerLanguage:6,independentVerifierChecks:verifierChecks,frozenStemNumericMultisetParityGate:true,optionNumericIdentityGate:true,visibleNativeObjectFamilyGate:true,nativeScriptLeakGate:true,englishLeakGate:true,nativeGrammarGate:true,exactReviewSurfaceValidated:"V5",explanationStepsPerQuestion:2,multilingualFreezeStatus:"UNFROZEN",productOwnerApprovalRecorded:false,questionStudioEnabled:false,questionBankStatus:"NOT_STORED",testEligibility:"INELIGIBLE",publiclyPublishable:false,nextGate:"PRODUCT_OWNER_NATIVE_REVIEW_AND_APPROVAL_BEFORE_FREEZE"},null,2));
