import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const route=read('artifacts/api-server/src/routes/admin-question-studio-capabilities.ts');
const index=read('artifacts/api-server/src/routes/index.ts');
const build=read('artifacts/api-server/build-runtime.mjs');
const docker=read('Dockerfile.examtree-cloudrun-api');
const builder=read('artifacts/api-server/src/question-studio/build-unified-admin-capabilities-manifest.ts');
const registry=read('artifacts/api-server/src/question-studio/engine-registry.ts');

test('earlier legacy manifest router is the actual owner of GET capabilities',()=>{
  assert.ok(index.indexOf('router.use("/admin/question-studio", adminQuestionStudioCapabilitiesRouter)') <
    index.indexOf('router.use("/admin/question-studio", adminQuestionStudioRegistryRouter)'));
});
test('staging and full Cloud Run admin select unified catalog; delegated student-only production remains legacy',()=>{
  assert.match(route,/EXAMTREE_API_RUNTIME === "cloud-run"/);
  assert.match(route,/EXAMTREE_API_STAGING === "true"/);
  assert.match(route,/EXAMTREE_API_STAGING === "false"/);
  assert.match(route,/EXAMTREE_ADMIN_ROUTES_DELEGATED_RENDER === "false"/);
  assert.match(route,/EXAMTREE_ADMIN_DETERMINISTIC_ONLY === "false"/);
  assert.match(route,/const useUnifiedCatalog = isIsolatedQsStaging \|\| isFullCloudRunAdmin/);
  assert.match(route,/if \(useUnifiedCatalog\)/);
  assert.match(route,/question-studio-unified-capabilities\.json/);
  assert.match(route,/question-studio-capabilities\.json/);
  assert.match(route,/requireAdminPermission\("content\.generation\.read"\)/);
  assert.match(route,/X-Examtree-QS-Catalog/);
  assert.match(route,/COM-001/);
});
test('Cloud Run image generates separate manifest in child process, not live API',()=>{
  assert.match(docker,/ENV EXAMTREE_QS_BUILD_UNIFIED_CAPABILITIES=true/);
  assert.match(build,/if \(process\.env\.EXAMTREE_QS_BUILD_UNIFIED_CAPABILITIES === "true"\)/);
  assert.match(build,/build-unified-admin-capabilities-manifest\.ts/);
  assert.match(build,/QUESTION_STUDIO_UNIFIED_CAPABILITIES_MANIFEST_OUT/);
  assert.match(build,/await rm\(unifiedBuilderPath/);
  assert.match(builder,/listQuestionStudioPackages/);
  assert.match(builder,/subject: packageSubject\(pkg\)/);
  assert.match(builder,/QUESTION_STUDIO_SUBJECT_OWNERSHIP_DRIFT/);
  assert.match(builder,/reasoning ability/);

  assert.match(builder,/chapter: packageChapter\(pkg\)/);
  assert.match(builder,/label: pkg\.label/);
  assert.match(builder,/supportedLanguages: pkg\.supportedLanguages/);
  assert.match(builder,/supportedDifficulties/);
  assert.match(builder,/COM-001/);
  for(const name of ['knowledgeV1QuestionStudioAdapter','languageV1QuestionStudioAdapter','quantV4QuestionStudioAdapter','reasoningV1QuestionStudioAdapter']){
    assert.ok(registry.includes(name));
  }
});