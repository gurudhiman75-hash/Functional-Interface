import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = (path) => readFileSync(path, 'utf8');
const registry = read('artifacts/api-server/src/routes/admin-question-studio-registry.ts');
const unified = read('artifacts/api-server/src/routes/admin-question-studio-engine-v1.ts');
const engines = read('artifacts/api-server/src/question-studio/engine-registry.ts');
const com001 = read('artifacts/api-server/src/question-studio/engines/knowledge-v1-com001-adapter.ts');
const ui = read('artifacts/admin-app/src/pages/content/QuestionStudioCockpitPage.tsx');

test('isolated staging capabilities precede every legacy ARG capabilities handler', () => {
  const direct = registry.indexOf('router.get("/capabilities", (req, res, next) => {');
  const legacy = registry.indexOf('router.use(adminQuestionStudioArgumentsCp015Router);');
  assert.ok(direct > 0 && legacy > direct, 'staging capabilities must bypass old ARG-only GET');
  assert.match(registry.slice(direct, legacy), /EXAMTREE_API_RUNTIME !== "cloud-run"/);
  assert.match(registry.slice(direct, legacy), /EXAMTREE_API_STAGING !== "true"/);
  assert.match(registry.slice(direct, legacy), /adminQuestionStudioEngineV1Router\(req, res, next\)/);
  assert.match(registry.slice(direct, legacy), /next\(\)/);
});
test('unified capabilities retain auth, RBAC and package-fed subject labels', () => {
  assert.match(unified, /router\.get\(\s*"\/capabilities",\s*authenticate,\s*requireAdminPermission\("content\.generation\.read"\)/);
  assert.match(unified, /generationSystems,\s*packages,/);
  assert.match(unified, /subject: packageSubjectLabel\(pkg\)/);
  assert.match(engines, /knowledgeV1QuestionStudioAdapter/);
  assert.match(engines, /languageV1QuestionStudioAdapter/);
  assert.match(engines, /reasoningV1QuestionStudioAdapter/);
  assert.match(engines, /quantV4QuestionStudioAdapter/);
  assert.match(com001, /packageId: COM001_QUESTION_STUDIO_PACKAGE_ID/);
  assert.match(com001, /subject: "Computer Awareness"/);
  assert.match(com001, /enabled: true/);
  assert.match(ui, /capabilities\.packages\.filter\(\(entry\) => entry\.enabled\)/);
});
