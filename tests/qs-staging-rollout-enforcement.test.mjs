import test from "node:test";
import assert from "node:assert/strict";
import {mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from "node:fs";
import {execFileSync} from "node:child_process";
import {tmpdir} from "node:os";
import path from "node:path";
const read=p=>readFileSync(p,"utf8");
const route=read("artifacts/api-server/src/routes/admin-question-studio-async-staging.ts");
const gate=read("artifacts/api-server/src/question-studio/staging-rollout-authorization.ts");
test("existing authenticated admin route remains isolated staging only",()=>{
 assert.match(route,/requireAdminPermission\("content\.generation\.run"\)/);
 assert.match(route,/EXAMTREE_API_STAGING/);
 assert.match(route,/QUESTION_STUDIO_STAGING_ENQUEUE_DISABLED/);
});
test("scope must be authorized BEFORE Neon enqueue",()=>{
 assert.ok(route.indexOf("stagingRolloutAllowed(")>route.indexOf("validateUniversalStudioComputeInput(compute)"));
 assert.ok(route.indexOf("stagingRolloutAllowed(")<route.indexOf("recordQuestionStudioEnqueueIntent("));
 assert.match(route,/QUESTION_STUDIO_STAGING_ROLLOUT_SCOPE_DENIED/);
});
test("no permissive scope defaults or unsafe production path",()=>{
 assert.match(gate,/EXAMTREE_QS_STAGING_REVIEW_SCOPE_APPROVED/);
 assert.match(gate,/EXAMTREE_QS_STAGING_REVIEW_SCOPE_JSON/);
 assert.match(gate,/validateReviewOnlyRollout/);
 assert.match(gate,/return false;/);
 assert.doesNotMatch(gate,/run\.services\.update|tasks\.queues\.resume/);
});

test("staging gate reads the canonical task manifest alongside the UI catalog", t=>{
 const cwd=mkdtempSync(path.join(tmpdir(),"qs-staging-scope-"));
 t.after(()=>rmSync(cwd,{recursive:true,force:true}));
 const dist=path.join(cwd,"artifacts/api-server/dist");
 mkdirSync(dist,{recursive:true});
 const entry={engineId:"reasoning-v1",packageId:"RNK-001",cpId:"RNK-CP-001",reviewOnly:true};
 const compute={queueVersion:1,count:1,selectedCpIds:[entry.cpId],
   request:{engineId:entry.engineId,packageId:entry.packageId,count:1,language:"en",seed:"ranking01"}};
 writeFileSync(path.join(dist,"question-studio-capabilities.json"),JSON.stringify({packages:[]}));
 const canonicalPath=path.join(dist,"question-studio-chapter-review-capabilities.json");
 const manifest={source:"canonical-question-studio-engine-registry",schemaVersion:1,
   packages:[{...entry,enabled:true,cpIds:[entry.cpId],supportedLanguages:["en"],
     reviewSurfaceRequired:true,manualApprovalRequired:true,questionBankWritable:false,
     automaticStudentPublication:false,productionReleaseAuthorized:false}]};
 const gateUrl=new URL("../artifacts/api-server/src/question-studio/staging-rollout-authorization.ts",import.meta.url);
 const probe=()=>execFileSync(process.execPath,["--experimental-strip-types","--input-type=module","-e",`
   import {stagingRolloutAllowed} from ${JSON.stringify(gateUrl.href)};
   console.log(stagingRolloutAllowed(${JSON.stringify(compute)}, {
     EXAMTREE_API_RUNTIME:"cloud-run",
     EXAMTREE_API_STAGING:"true",
     EXAMTREE_QS_STAGING_REVIEW_SCOPE_APPROVED:"true",
     EXAMTREE_QS_STAGING_REVIEW_SCOPE_JSON:${JSON.stringify(JSON.stringify([entry]))}
   }));
 `],{cwd,encoding:"utf8",stdio:["ignore","pipe","pipe"]}).trim();
 assert.equal(probe(),"false");
 writeFileSync(canonicalPath,JSON.stringify(manifest));
 assert.equal(probe(),"true");
 manifest.packages[0].questionBankWritable=true;
 writeFileSync(canonicalPath,JSON.stringify(manifest));
 assert.equal(probe(),"false");
});
