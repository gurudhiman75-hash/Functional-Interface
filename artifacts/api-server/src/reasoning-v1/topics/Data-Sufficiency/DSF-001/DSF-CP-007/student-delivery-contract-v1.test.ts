import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const dsfRoute = readFileSync(resolve(root, "src/routes/admin-question-studio-data-sufficiency.ts"), "utf8");
const questionLifecycle = readFileSync(resolve(root, "src/routes/admin-question-lifecycle-hardening.ts"), "utf8");
const adminTests = readFileSync(resolve(root, "src/routes/admin-tests.ts"), "utf8");
const studentSeries = readFileSync(resolve(root, "src/routes/student-test-series.ts"), "utf8");
const seriesLifecycle = readFileSync(resolve(root, "src/lib/admin-test-series.ts"), "utf8");
const spatialProduction = readFileSync(resolve(root, "src/reasoning-v1/foundation/spatial/spatial-question-studio-integration-v1.ts"), "utf8");

const dsfRoutes = [...dsfRoute.matchAll(/router\.(?:get|post)\("\/reasoning\/data-sufficiency\//g)];
assert.equal(dsfRoutes.length, 4, "Final DSF freeze must not add a parallel student/publication route");
assert.ok(!dsfRoute.includes('/reasoning/data-sufficiency/student'));
assert.ok(!dsfRoute.includes('/reasoning/data-sufficiency/publish'));
assert.ok(!dsfRoute.includes('/reasoning/data-sufficiency/mock'));
assert.ok(dsfRoute.includes('automaticStudentPublication: false'));
assert.ok(dsfRoute.includes('mockTestEligible: true'));
assert.ok(dsfRoute.includes('testEligible: true'));
assert.ok(dsfRoute.includes('publiclyPublishable: true'));

// Generated DSF questions must still pass the canonical manual Question Bank publication guard.
assert.ok(questionLifecycle.includes('generationTestEligible === false'));
assert.ok(questionLifecycle.includes('generationPubliclyPublishable === false'));
assert.ok(questionLifecycle.includes("status = 'published'::question_status"));
assert.ok(questionLifecycle.includes('published_version_id = approved_version_id'));

// Tests may only contain published question versions and must pass canonical validation.
assert.ok(adminTests.includes('String(row.status) !== "published"'));
assert.ok(adminTests.includes('String(row.publishedVersionId ?? "") !== questionVersionId'));
assert.ok(adminTests.includes('code: "QUESTION_NOT_PUBLISHED"'));
assert.ok(adminTests.includes('["submit-qa", "approve", "schedule", "publish"].includes(action)'));

// Explicit admin test publication creates the real student-visible publication record.
assert.ok(adminTests.includes('if (action === "publish")'));
assert.ok(adminTests.includes('INSERT INTO assessment.test_publications'));
assert.ok(adminTests.includes('now(),'));
assert.ok(adminTests.includes("status = 'live'::test_status"));
assert.ok(adminTests.includes('published_version_id = ${input.expectedCurrentDraftVersionId}::uuid'));

// Student test-series discovery only exposes tests that are both live and genuinely published.
assert.ok(studentSeries.includes("t.status = 'live'::test_status"));
assert.ok(studentSeries.includes('publication.published_at IS NOT NULL'));
assert.ok(studentSeries.includes("THEN 'live'"));
assert.ok(studentSeries.includes('HAVING COUNT(item.id) FILTER'));
assert.ok(studentSeries.includes('liveTestCount'));

// Series assembly retains its own QA/release gate.
assert.ok(seriesLifecycle.includes('["qa_approved", "scheduled", "live", "completed"].includes(status)'));
assert.ok(seriesLifecycle.includes('test(s) are not QA approved or released'));

// Mature production precedent also deliberately keeps automatic generation-to-student publication off.
assert.ok(spatialProduction.includes('publiclyPublishable: true'));
assert.ok(spatialProduction.includes('mockTestEligible: true'));
assert.ok(spatialProduction.includes('manualApprovalRequired: true'));
assert.ok(spatialProduction.includes('automaticStudentPublication: false'));

console.log(JSON.stringify({
  status: "PASS_DSF_CP007_STUDENT_DELIVERY_CONTRACT",
  dsfSpecificStudioRoutes: 4,
  directDsfStudentRouteAdded: false,
  generatedQuestionAutoPublish: false,
  manualQuestionPublicationRequired: true,
  canonicalTestValidationRequired: true,
  explicitTestPublicationRequired: true,
  studentSeriesRequiresLiveTest: true,
  studentSeriesRequiresPublicationRecord: true,
  canonicalSeriesQaReleaseRequired: true,
  matureProductionPrecedentAutomaticPublication: false,
}, null, 2));
