import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  SER_CP007_PERMANENT_QL_IDS,
} from "../SER-PERMANENT-QL-REGISTRY";
import {
  SER_001_QUESTION_STUDIO_REVIEW_PACKAGE,
} from "./question-studio-review-adapter";
import {
  SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1,
} from "./ser-001-internal-test-builder-activation-v1";

const REVIEW = SER_001_QUESTION_STUDIO_REVIEW_PACKAGE;
const ACTIVATION = SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1;

// The frozen review source remains review-only.
assert.equal(REVIEW.packageId, "SER-001");
assert.equal(REVIEW.reviewOnly, true);
assert.equal(REVIEW.questionStudioDiscoverable, true);
assert.equal(REVIEW.questionBankStatus, "NOT_STORED");
assert.equal(REVIEW.questionBankWritable, false);
assert.equal(REVIEW.testEligibility, "INELIGIBLE");
assert.equal(REVIEW.testEligible, false);
assert.equal(REVIEW.publiclyPublishable, false);
assert.deepEqual(REVIEW.qlIds, [...SER_CP007_PERMANENT_QL_IDS]);

// The separately approved internal activation may persist to Question Bank and
// feed the internal Test Builder, while public/student release remains blocked.
assert.equal(ACTIVATION.sourceReviewAuthorityId, REVIEW.integrationAuthority);
assert.deepEqual(ACTIVATION.permanentQlIds, [...SER_CP007_PERMANENT_QL_IDS]);
assert.equal(ACTIVATION.status, "ACTIVE_INTERNAL_TEST_BUILDER");
assert.equal(
  ACTIVATION.activationScope,
  "QUESTION_STUDIO_QUESTION_BANK_AND_INTERNAL_TEST_BUILDER",
);
assert.equal(ACTIVATION.questionBankStatus, "READY_FOR_STORAGE");
assert.equal(ACTIVATION.questionBankWritable, true);
assert.equal(ACTIVATION.testEligibility, "ELIGIBLE");
assert.equal(ACTIVATION.testEligible, true);
assert.equal(ACTIVATION.testBuilderEligible, true);
assert.equal(ACTIVATION.mockTestEligible, false);
assert.equal(ACTIVATION.publiclyPublishable, true);
assert.equal(ACTIVATION.publicReleaseAuthorized, false);
assert.equal(ACTIVATION.studentDeliveryAuthorized, false);
assert.equal(ACTIVATION.automaticStudentPublication, false);
assert.equal(ACTIVATION.contentMutationAuthorized, false);

const seriesRoute = readFileSync(
  "artifacts/api-server/src/routes/admin-question-studio-series.ts",
  "utf8",
);
const registryRoute = readFileSync(
  "artifacts/api-server/src/routes/admin-question-studio-registry.ts",
  "utf8",
);
const routeIndex = readFileSync(
  "artifacts/api-server/src/routes/index.ts",
  "utf8",
);
const adminOperationsPage = readFileSync(
  "artifacts/admin-app/src/pages/content/QuestionStudioOperationsPage.tsx",
  "utf8",
);

// The Series route exposes only the approved CP007 authority.
assert.match(seriesRoute, /SER_001_QUESTION_STUDIO_REVIEW_PACKAGE/);
assert.match(seriesRoute, /SER_001_INTERNAL_TEST_BUILDER_ACTIVATION_AUTHORITY_V1/);
assert.match(seriesRoute, /\/reasoning\/series\/package/);
assert.match(seriesRoute, /\/reasoning\/series\/preview/);
assert.match(seriesRoute, /\/reasoning\/series\/runs/);
assert.match(seriesRoute, /\/reasoning\/series\/status/);
assert.match(seriesRoute, /questionBankWritable: true/);
assert.match(seriesRoute, /testEligible: true/);
assert.match(seriesRoute, /testBuilderEligible: true/);
assert.match(seriesRoute, /mockTestEligible: false/);
assert.match(seriesRoute, /publiclyPublishable: true/);
assert.match(seriesRoute, /publicReleaseAuthorized: false/);
assert.match(seriesRoute, /studentDeliveryAuthorized: false/);
assert.match(seriesRoute, /automaticStudentPublication: false/);
assert.doesNotMatch(
  seriesRoute,
  /SER-CP-008|SER-CP-009|SER-QL-0(?:1[4-9]|2\d|3\d|4[0-2])/,
);

// Current-main mounts Series through the canonical Question Studio registry,
// rather than mounting the Series router directly in routes/index.ts.
assert.match(registryRoute, /adminQuestionStudioSeriesRouter/);
assert.match(registryRoute, /router\.use\(adminQuestionStudioSeriesRouter\)/);
assert.ok(
  registryRoute.indexOf("router.use(adminQuestionStudioSeriesRouter)")
    < registryRoute.indexOf("router.use(adminQuestionStudioRouter)"),
  "Series router must run before the generic Question Studio fallback.",
);
assert.match(routeIndex, /adminQuestionStudioRegistryRouter/);
assert.match(
  routeIndex,
  /router\.use\("\/admin\/question-studio", adminQuestionStudioRegistryRouter\)/,
);
assert.match(adminOperationsPage, /QuestionStudioSeriesReviewPanel/);

console.log(JSON.stringify({
  status: "PASS_SER_CP007_CURRENT_MAIN_QUESTION_STUDIO_INTEGRATION",
  packageId: "SER-001",
  permanentQls: SER_CP007_PERMANENT_QL_IDS.length,
  reviewSourceBoundary: {
    questionBankStatus: REVIEW.questionBankStatus,
    questionBankWritable: REVIEW.questionBankWritable,
    testEligibility: REVIEW.testEligibility,
    testEligible: REVIEW.testEligible,
    publiclyPublishable: REVIEW.publiclyPublishable,
  },
  internalActivationBoundary: {
    authorityId: ACTIVATION.authorityId,
    questionBankStatus: ACTIVATION.questionBankStatus,
    questionBankWritable: ACTIVATION.questionBankWritable,
    testEligibility: ACTIVATION.testEligibility,
    testEligible: ACTIVATION.testEligible,
    testBuilderEligible: ACTIVATION.testBuilderEligible,
    mockTestEligible: ACTIVATION.mockTestEligible,
    publiclyPublishable: ACTIVATION.publiclyPublishable,
    publicReleaseAuthorized: ACTIVATION.publicReleaseAuthorized,
    studentDeliveryAuthorized: ACTIVATION.studentDeliveryAuthorized,
    automaticStudentPublication: ACTIVATION.automaticStudentPublication,
  },
  canonicalRegistryMountProof: true,
  provisionalAuditLeakageProof: true,
  adminPanelProof: true,
}, null, 2));
