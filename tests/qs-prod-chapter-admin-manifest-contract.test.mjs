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
