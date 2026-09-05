import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROUTE_PATH = "src/routes/admin-question-studio-arguments-cp015.ts";
const REGISTRY_PATH = "src/routes/admin-question-studio-registry.ts";

function readSource(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function assertContains(source: string, expected: string, message: string): void {
  assert.ok(source.includes(expected), message);
}

function assertGenerationRunsInsertArity(route: string): void {
  const match = route.match(
    /INSERT INTO content\.generation_runs \(\s*([\s\S]*?)\s*\) VALUES \(\s*([\s\S]*?)\s*\)`;/,
  );
  assert.ok(match, "CP015 route generation_runs insert could not be located.");

  const columns = match[1]!.split(",").map((value) => value.trim()).filter(Boolean);
  const values = match[2]!.split(",").map((value) => value.trim()).filter(Boolean);
  assert.equal(columns.length, 16, `CP015 generation_runs insert expected 16 columns, found ${columns.length}.`);
  assert.equal(
    values.length,
    columns.length,
    `CP015 generation_runs insert arity mismatch: ${columns.length} columns vs ${values.length} values.`,
  );
}

function assertRouteContract(route: string): void {
  assertContains(
    route,
    "../reasoning-v1/topics/Statement-and-Arguments/ARG-001/cp015-perceived-diversity-expansion.ts",
    "CP015 admin route no longer imports the CP015 diversity authority.",
  );
  assertContains(route, "listQuestionStudioPackages", "CP015 capabilities lost the canonical package aggregation surface.");
  assertContains(route, "ARG_CP015_QUESTION_STUDIO_PACKAGE", "CP015 capabilities lost the CP015 package overlay.");
  assertContains(route, 'router.post("/runs"', "CP015 generation run endpoint is missing.");
  assertContains(route, "isArgCp015CurrentRequest(body)", "CP015 route lost current-request routing guard.");
  assertContains(route, "generateArgCp015QuestionStudioBatch(generationInput)", "CP015 route no longer invokes the CP015 generator.");
  assertContains(route, "ARG_CP015_QUESTION_STUDIO_AUTHORITY", "CP015 route lost its Question Studio authority marker.");
  assertContains(route, "ARG_CP015_LEARNER_RELEASE", "CP015 route lost learner-release boundary propagation.");

  for (const lifecycleGuard of [
    "question.questionBankWritable !== true",
    "question.testEligible !== true",
    "question.mockTestEligible !== true",
    "question.publiclyPublishable !== false",
    "question.publicReleaseAuthorized !== false",
    "question.studentDeliveryAuthorized !== false",
    "question.automaticStudentPublication !== false",
    "question.manualApprovalRequired !== false",
    "question.currentQuestionStudioAuthority !== ARG_CP015_QUESTION_STUDIO_AUTHORITY",
  ]) {
    assertContains(route, lifecycleGuard, `CP015 persistence boundary lost guard: ${lifecycleGuard}`);
  }

  assertContains(route, "questionBankStatus: \"WRITABLE\"", "CP015 capability surface lost internal Question Bank writable status.");
  assertContains(route, "testEligibility: \"ELIGIBLE\"", "CP015 capability surface lost approved internal test eligibility.");
  assertContains(route, "publiclyPublishable: false", "CP015 capability surface unexpectedly opened public publication.");
  assertContains(route, "publicReleaseAuthorized: false", "CP015 capability surface unexpectedly opened public release.");
  assertContains(route, "studentDeliveryAuthorized: false", "CP015 capability surface unexpectedly opened student delivery.");
  assertContains(route, "automaticStudentPublication: false", "CP015 capability surface unexpectedly opened automatic student publication.");

  assertGenerationRunsInsertArity(route);
}

function assertRegistryContract(registry: string): void {
  const cp015Import = 'import adminQuestionStudioArgumentsCp015Router from "./admin-question-studio-arguments-cp015";';
  const cp014Import = 'import adminQuestionStudioArgumentsCp014Router from "./admin-question-studio-arguments-cp014";';
  const cp015Mount = "router.use(adminQuestionStudioArgumentsCp015Router);";
  const cp014Mount = "router.use(adminQuestionStudioArgumentsCp014Router);";

  assertContains(registry, cp015Import, "CP015 route is not imported by the canonical Question Studio registry.");
  assertContains(registry, cp014Import, "CP014 historical fallback import is missing from the canonical registry.");
  assertContains(registry, cp015Mount, "CP015 route is not mounted by the canonical Question Studio registry.");
  assertContains(registry, cp014Mount, "CP014 historical fallback is not mounted by the canonical Question Studio registry.");

  const cp015Index = registry.indexOf(cp015Mount);
  const cp014Index = registry.indexOf(cp014Mount);
  assert.ok(cp015Index >= 0 && cp014Index >= 0 && cp015Index < cp014Index, "CP015 must remain ahead of CP014 in canonical Question Studio routing order.");
}

const route = readSource(ROUTE_PATH);
const registry = readSource(REGISTRY_PATH);
assertRouteContract(route);
assertRegistryContract(registry);

console.log(JSON.stringify({
  status: "PASS_ARG_CP015_QUESTION_STUDIO_REGISTRATION_CONTRACT",
  route: ROUTE_PATH,
  registry: REGISTRY_PATH,
  routeAuthority: "ARG_CP015_QUESTION_STUDIO_DIVERSITY_V1",
  lifecycle: {
    questionBankWritable: true,
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    publicReleaseAuthorized: false,
    studentDeliveryAuthorized: false,
    automaticStudentPublication: false,
  },
  routingOrder: "CP015_BEFORE_CP014",
  generationRunsInsertArity: 16,
}, null, 2));