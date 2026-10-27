import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=p=>readFileSync(p,"utf8");
const build=read("artifacts/api-server/build-runtime.mjs");
const policy=read("artifacts/api-server/src/question-studio/prod-chapter-review-policy.mjs");
const validation=read("artifacts/api-server/src/question-studio/async-task-package-capabilities.ts");
const docker=read("Dockerfile.examtree-cloudrun-api");
const canonical=read("artifacts/api-server/src/question-studio/build-async-task-capabilities-manifest.ts");
const discovery=read("artifacts/api-server/src/question-studio/build-unified-admin-capabilities-manifest.ts");

test("Cloud Run admin runtime builds separate registry-derived authorization JSON",()=>{
  assert.match(docker,/EXAMTREE_QS_BUILD_UNIFIED_CAPABILITIES=true/);
  assert.match(build,/if \(process\.env\.EXAMTREE_QS_BUILD_UNIFIED_CAPABILITIES === "true"\)/);
  assert.match(build,/src\/question-studio\/build-async-task-capabilities-manifest\.ts/);
  assert.match(build,/question-studio-chapter-review-capabilities\.json/);
  assert.match(build,/QUESTION_STUDIO_CAPABILITIES_MANIFEST_OUT: chapterManifestPath/);
  assert.match(docker,/COPY --from=builder \/src\/artifacts\/api-server\/dist \/app\/artifacts\/api-server\/dist/);
  assert.match(canonical,/source:"canonical-question-studio-engine-registry"/);
  assert.match(discovery,/source: "canonical-four-engine-registry"/);
});
test("production chapter authorization and compute validation read canonical JSON first",()=>{
  const name="question-studio-chapter-review-capabilities.json";
  for(const src of [policy,validation]) {
    assert.ok(src.includes(name),"missing canonical admin manifest lookup");
    assert.ok(src.indexOf(name)<src.indexOf("question-studio-capabilities.json"),
      "legacy discovery JSON must not overshadow canonical release metadata");
  }
  assert.match(policy,/manifest\?\.source==="canonical-question-studio-engine-registry"/);
  // Source Question Bank eligibility must not govern NEW review-only output.
  assert.match(policy,/isProductionChapterGenerationEligiblePackage\(p\)/);
  assert.match(policy,/p\.manualApprovalRequired===true/);
  assert.match(policy,/p\.productionReleaseAuthorized===false/);
});
test("original legacy catalog remains present for ordinary API discovery",()=>{
  assert.match(build,/const capabilitiesManifestPath = path\.resolve\(/);
  assert.match(build,/question-studio-capabilities\.json/);
  assert.match(build,/question-studio-unified-capabilities\.json/);
});

test("native Reasoning source checkpoints explicitly require guarded review without publishing",()=>{
  const src=read("artifacts/api-server/src/question-studio/engines/reasoning-v1-adapter.ts");
  const start=src.indexOf("function nativeReasoningSourceCard(");
  const end=src.indexOf("const lifecycle =",start);
  assert.ok(start>=0&&end>start,"native Reasoning adapter missing");
  const body=src.slice(start,end);
  for(const [field,value] of Object.entries({
    reviewSurfaceRequired:"true",
    manualApprovalRequired:"true",
    questionBankWritable:"false",
    testEligible:"false",
    mockTestEligible:"false",
    publiclyPublishable:"false",
    automaticStudentPublication:"false",
    productionReleaseAuthorized:"false",
  }))assert.ok(body.includes(field+": "+value),"native Reasoning safeguard missing: "+field);
  assert.match(src,/\.\.\.nativeReasoningSourceCards\.map\(nativeReasoningSourceCard\)/);
});

test("DI-001 frozen multilingual review declares production chapter admission without bank or publication",()=>{
  const src=read("artifacts/api-server/src/quant-v4/topics/DataInterpretation/DI-001/question-studio-adapter.ts");
  const start=src.indexOf("export function di001QuestionStudioPackageCard()");
  assert.ok(start>=0,"DI-001 registry card missing");
  const card=src.slice(start);
  for(const [key,value] of Object.entries({
    enabled:"true",
    reviewSurfaceRequired:"true",
    manualApprovalRequired:"true",
    questionBankWritable:"false",
    testEligible:"false",
    mockTestEligible:"false",
    publiclyPublishable:"false",
    automaticStudentPublication:"false",
    productionReleaseAuthorized:"false",
  }))assert.ok(card.includes(key+": "+value),"DI-001 admission/safety property missing: "+key);
  assert.match(card,/supportedLanguages: \["en", "hi", "pa"\]/);
  assert.match(card,/reviewStatus: "MULTILINGUAL_FROZEN"/);
});


test("all fifteen DI review package cards declare guarded, non-publishing chapter admission",()=>{
  const paths=[
    ...Array.from({length:14},(_,index)=>{
      const id="DI-"+String(index+1).padStart(3,"0");
      return "artifacts/api-server/src/quant-v4/topics/DataInterpretation/"+id+"/question-studio-adapter.ts";
    }),
    "artifacts/api-server/src/quant-v4/topics/DataInterpretation/di-delivery-novelty-mix-v1.ts",
  ];
  for(const path of paths){
    const src=read(path);
    const cardIndex=src.lastIndexOf("export function ");
    assert.ok(cardIndex>=0,"DI card missing: "+path);
    const card=src.slice(cardIndex);
    for(const [field,value] of Object.entries({
      enabled:"true",reviewSurfaceRequired:"true",manualApprovalRequired:"true",
      questionBankWritable:"false",testEligible:"false",mockTestEligible:"false",
      publiclyPublishable:"false",automaticStudentPublication:"false",
      productionReleaseAuthorized:"false",
    })){
      assert.match(card,new RegExp(field+"\\s*:\\s*"+value+"\\b"),
        "DI review admission restriction missing: "+field+" in "+path);
    }
    assert.match(card,/cpIds\s*:/,"DI canonical checkpoints missing: "+path);
    assert.match(card,/supportedLanguages\s*:/,"DI language authority missing: "+path);
  }
});

test("STAT-002 through STAT-004 permit guarded review without claiming localized approval",()=>{
 for(const n of [2,3,4]){
   const id="STAT-"+String(n).padStart(3,"0");
   const path="artifacts/api-server/src/quant-v4/topics/Statistics/"+id+"/question-studio-adapter.ts";
   const src=read(path);
   const ix=src.lastIndexOf("export function stat"+String(n).padStart(3,"0")+"QuestionStudioPackageCard()");
   assert.ok(ix>=0,"missing card for "+id);
   const card=src.slice(ix);
   for(const [field,value] of Object.entries({
      reviewSurfaceRequired:"true",manualApprovalRequired:"true",questionBankWritable:"false",
      testEligible:"false",publiclyPublishable:"false",automaticStudentPublication:"false",
      productionReleaseAuthorized:"false"
   }))assert.match(card,new RegExp(field+"\\s*:\\s*"+value+"\\b"),id+": "+field);
   assert.match(card,/localizationStatus\s*:\s*"HI_PA_REVIEW_CANDIDATE"/,id+" must not imply native release");
 }
});

test("STAT-005 through STAT-014 retain controlled-review locks and review-candidate localization",()=>{
 const sources={
  5:"partition-dispersion",6:"moments-shape",7:"correlation-regression",
  8:"probability-theory",9:"random-variables",10:"sampling-theory",
  11:"statistical-inference",12:"anova",13:"time-series",14:"index-numbers",
 };
 for(const [n,name] of Object.entries(sources)){
  const id="STAT-"+n.padStart(3,"0");
  const path="artifacts/api-server/src/quant-v4/topics/Statistics/"+id+"/"+name+".ts";
  const source=read(path),label="stat"+n.padStart(3,"0")+"QuestionStudioPackageCard()";
  const start=source.lastIndexOf("export function "+label);
  assert.ok(start>=0,"missing "+id+" source card");
  const card=source.slice(start);
  for(const [key,value] of Object.entries({
   reviewSurfaceRequired:"true",manualApprovalRequired:"true",questionBankWritable:"false",
   testEligible:"false",publiclyPublishable:"false",
   automaticStudentPublication:"false",productionReleaseAuthorized:"false"
  }))assert.match(card,new RegExp(key+"\\s*:\\s*"+value+"\\b"),id+" safeguard "+key);
  assert.match(card,/HI_PA_REVIEW_CANDIDATE/,id+" must remain native-language review candidate");
 }
});

test("STAT-001 remains review only while becoming eligible for chapter admission",()=>{
 const src=read("artifacts/api-server/src/quant-v4/topics/Statistics/STAT-001/question-studio-adapter.ts");
 const idx=src.lastIndexOf("export function stat001QuestionStudioPackageCard()");
 assert.ok(idx>=0);
 const card=src.slice(idx);
 for(const [field,value] of Object.entries({
   reviewSurfaceRequired:"true",manualApprovalRequired:"true",
   productionReleaseAuthorized:"false",questionBankWritable:"false",
   testEligible:"false",publiclyPublishable:"false",automaticStudentPublication:"false"
 }))assert.match(card,new RegExp(field+"\\s*:\\s*"+value+"\\b"),field);
 assert.match(card,/reviewStatus:\s*"ENGLISH_REVIEW_READY"/);
 assert.match(card,/localizationStatus:\s*"HI_PA_REVIEW_CANDIDATE"/);
});

test("legacy Percentage Ratio and Partnership packages receive safe review-only registration",()=>{
 const src=read("artifacts/api-server/src/question-studio/engines/quant-v4-adapter.ts");
 const begin=src.indexOf("const standardQuantReviewIds = new Set(");
 const end=src.indexOf("for (const pkg of sriEnginePackages())",begin);
 assert.ok(begin>=0 && end>begin,"Quant guarded-review adapter missing");
 const section=src.slice(begin,end);
 for(const id of ["PCT-001","PCT-002","PCT-003","PCT-004","PCT-005","PCT-006","PCT-007",
                  "RAP-001","RAP-002","RAP-003","PRT-001"])
  assert.ok(section.includes('"'+id+'"'),"Quant review package not listed: "+id);
 for(const [field,value] of Object.entries({
   reviewSurfaceRequired:"true",manualApprovalRequired:"true",questionBankWritable:"false",
   testEligible:"false",publiclyPublishable:"false",automaticStudentPublication:"false",
   productionReleaseAuthorized:"false"
 }))assert.match(section,new RegExp(field+"\\s*:\\s*"+value+"\\b"),field+" must stay locked");
 assert.match(section,/!pkg.enabled \|\| !pkg.cpIds.length/,"cannot admit disabled or CP-less source packages");
 assert.ok(!section.includes("supportedLanguages:"),"must preserve original RAP English-only language authority");
});

test("MAL-001 standard source card allows guarded review but not automatic release",()=>{
 const src=read("artifacts/api-server/src/quant-v4/topics/Arithmetic/subtopics/MixtureAndAlligation/MAL-001/question-studio-standard-integration.ts");
 const start=src.indexOf("export function listMal001StandardQuestionStudioPackages()");
 const end=src.indexOf("function toQuestionStudioReviewPackage(",start);
 assert.ok(start>=0&&end>start,"MAL source card missing");
 const card=src.slice(start,end);
 for(const [name,value] of Object.entries({
  reviewSurfaceRequired:"true",manualApprovalRequired:"true",
  questionBankWritable:"false",testEligible:"false",publiclyPublishable:"false",
  automaticStudentPublication:"false",productionReleaseAuthorized:"false"
 }))assert.match(card,new RegExp(name+"\\s*:\\s*"+value+"\\b"),name);
 assert.match(src,/NATIVE_QUALITY_REVIEW_CANDIDATE/,"native quality review must remain pending");
});

test("Probability chapter admission is a separate locked review projection",()=>{
 const src=read("artifacts/api-server/src/question-studio/engines/quant-v4-adapter.ts");
 const start=src.indexOf('for (const packageId of ["PRB-001", "PRB-002"])');
 const end=src.indexOf("for (const pkg of sriEnginePackages())",start);
 assert.ok(start>=0&&end>start,"Probability review projection missing");
 const block=src.slice(start,end);
 for(const [key,value] of Object.entries({
   reviewSurfaceRequired:"true",manualApprovalRequired:"true",
   questionBankWritable:"false",testEligible:"false",
   publiclyPublishable:"false",automaticStudentPublication:"false",
   productionReleaseAuthorized:"false"
 }))assert.match(block,new RegExp(key+"\\s*:\\s*"+value+"\\b"),key);
 assert.match(block,/sourceItemAndLanguagePolicyUnchanged: true/);
 assert.match(block,/!source\?\.enabled \|\| !source\.cpIds\.length/);
 const runtime=read("artifacts/api-server/src/quant-v4/topics/Probability/question-studio-runtime.ts");
 assert.match(runtime,/DRAFT_PARITY_PREVIEW_REQUIRES_HUMAN_REVIEW/);
 assert.match(runtime,/ELIGIBLE_WITH_FAMILY_LIMIT/);
});

test("Mensuration full-chapter source is guarded review only",()=>{
 const src=read("artifacts/api-server/src/quant-v4/topics/AdvancedMathematics/subtopics/Mensuration/mensuration-question-studio-standard-runtime-v3.ts");
 const start=src.indexOf("export const MENSURATION_STANDARD_QUESTION_STUDIO_PACKAGE =");
 const end=src.indexOf("export type MensurationStandardQuestionStudioRequest",start);
 assert.ok(start>=0&&end>start,"full chapter registry missing");
 const card=src.slice(start,end);
 for(const [field,value] of Object.entries({
  reviewSurfaceRequired:"true",manualApprovalRequired:"true",
  productionReleaseAuthorized:"false",questionBankWritable:"false",
  testEligible:"false",publiclyPublishable:"false",automaticStudentPublication:"false"
 }))assert.match(card,new RegExp(field+"\\s*:\\s*"+value+"\\b"),"Mensuration "+field);
});
