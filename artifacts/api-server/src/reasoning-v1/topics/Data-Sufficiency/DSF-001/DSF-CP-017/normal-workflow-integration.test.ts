import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  generateQuestion,
  isDsf001NormalQuestionStudioRequest,
  listQuestionStudioPackages,
} from "../../../../../question-studio/shared-generation-engine-sri.ts";

async function main() {
  const packages = listQuestionStudioPackages();
  const dsfPackages = packages.filter((entry: any) => String(entry.packageId) === "DSF-001");
  assert.equal(dsfPackages.length, 1, "normal Question Studio capabilities must expose exactly one DSF-001 package");
  const pkg = dsfPackages[0] as any;
  assert.equal(pkg.enabled, true);
  assert.equal(pkg.questionStudioDiscoverable, true);
  assert.equal(pkg.questionStudioGenerationEnabled, true);
  assert.equal(pkg.persistenceAllowed, true);
  assert.equal(pkg.reviewOnly, true);
  assert.equal(pkg.questionBankWritable, false);
  assert.equal(pkg.testEligible, false);
  assert.equal(pkg.mockTestEligible, false);
  assert.equal(pkg.publiclyPublishable, false);
  assert.equal(pkg.automaticStudentPublication, false);
  assert.equal(pkg.canonicalProblems.length, 21);
  assert.deepEqual(pkg.permanentQlIds, ["DSF-QL-001", "DSF-QL-002"]);
  assert.deepEqual(pkg.generatableQlIds, ["DSF-QL-001"]);
  assert.deepEqual(pkg.runtimeDeferredQlIds, ["DSF-QL-002"]);

  assert.equal(isDsf001NormalQuestionStudioRequest({ packageId: "DSF-001" }), true);
  assert.equal(isDsf001NormalQuestionStudioRequest({ topic: "Reasoning", subtopic: "Data Sufficiency" }), true);

  const generated = await generateQuestion({
    packageId: "DSF-001",
    topic: "Reasoning",
    subtopic: "Data Sufficiency",
    canonicalProblemId: "DSF-QS-RANKING",
    patternId: "DSF-QL-001",
    difficulty: "Medium",
    language: "en",
    seed: "cp017-shared-engine",
    count: 3,
  } as any);
  assert.equal((generated as any).questions.length, 3);
  for (const question of (generated as any).questions) {
    assert.equal(question.packageId, "DSF-001");
    assert.equal(question.laneId, "DSF-QS-RANKING");
    assert.equal(question.questionStudioDiscoverable, true);
    assert.equal(question.persistenceAllowed, true);
    assert.equal(question.reviewOnly, true);
    assert.equal(question.questionBankWritable, false);
    assert.equal(question.testEligible, false);
    assert.equal(question.mockTestEligible, false);
    assert.equal(question.publiclyPublishable, false);
    assert.equal(question.automaticStudentPublication, false);
  }

  const currentFile = fileURLToPath(import.meta.url);
  const checkpointDir = currentFile.slice(0, currentFile.lastIndexOf("/reasoning-v1/topics/Data-Sufficiency/"));
  const apiSrc = checkpointDir;
  const routeRegistry = readFileSync(`${apiSrc}/routes/admin-question-studio-registry.ts`, "utf8");
  const currentRoute = readFileSync(`${apiSrc}/routes/admin-question-studio-data-sufficiency-current.ts`, "utf8");
  const sriIndex = routeRegistry.indexOf("router.use(adminQuestionStudioSriRouter)");
  const dsfIndex = routeRegistry.indexOf("router.use(adminQuestionStudioDataSufficiencyCurrentRouter)");
  const legacyIndex = routeRegistry.indexOf("router.use(adminQuestionStudioDataSufficiencyRouter)");
  const catchAllIndex = routeRegistry.indexOf("router.use(adminQuestionStudioRouter)");
  assert(sriIndex >= 0 && dsfIndex > sriIndex, "DSF normal route must follow the newest capabilities aggregator");
  assert(legacyIndex > dsfIndex, "DSF normal route must claim generic DSF runs before the legacy specialized route");
  assert(catchAllIndex > dsfIndex, "DSF normal route must run before the legacy catch-all generator");
  assert(currentRoute.includes('router.post("/runs"'), "DSF normal route must use the standard /runs endpoint");
  assert(currentRoute.includes("questionStudioDiscoverable !== true"), "route must enforce Studio discovery contract");
  assert(currentRoute.includes("questionBankWritable !== false"), "route must enforce Question Bank lock");
  assert(currentRoute.includes("testEligible !== false"), "route must enforce scored-test lock");
  assert(currentRoute.includes("mockTestEligible !== false"), "route must enforce mock-test lock");
  assert(currentRoute.includes("publiclyPublishable !== false"), "route must enforce public-publish lock");
  assert(currentRoute.includes("automaticStudentPublication !== false"), "route must enforce automatic-publication lock");

  console.log(JSON.stringify({
    status: "PASS_DSF_CP017_NORMAL_QUESTION_STUDIO_WORKFLOW_INTEGRATION",
    packageId: pkg.packageId,
    canonicalProblemCount: pkg.canonicalProblems.length,
    permanentQlIds: pkg.permanentQlIds,
    generatableQlIds: pkg.generatableQlIds,
    runtimeDeferredQlIds: pkg.runtimeDeferredQlIds,
    standardRunEndpoint: "/runs",
    reviewOnly: true,
  }, null, 2));
}

await main();
