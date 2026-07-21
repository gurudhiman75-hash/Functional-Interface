import { Router, type IRouter } from "express";

import healthRouter from "./health";
import usersRouter from "./users";
import categoriesRouter from "./categories";
import subcategoriesRouter from "./subcategories";
import adminAccessControlRouter from "./admin-access-control";
import adminContentReviewRouter from "./admin-content-review";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioRegenerationRouter from "./admin-question-studio-regeneration";
import adminQuestionStudioRouter from "./admin-question-studio";
import adminQuestionsRouter from "./admin-questions";
import adminTaxonomyCoverageRouter from "./admin-taxonomy-coverage";
import adminTaxonomyRouter from "./admin-taxonomy";
import adminTestBlueprintAssemblyRouter from "./admin-test-blueprint-assembly";
import adminTestBlueprintsRouter from "./admin-test-blueprints";
import adminTestSeriesRouter from "./admin-test-series";
import adminTestQaGateRouter from "./admin-test-qa-gate";
import adminTestQaRouter from "./admin-test-qa";
import adminTestsRouter from "./admin-tests";
import publishedTestsRouter from "./published-tests";
import publishedTestRunnerRouter from "./published-test-runner";
import attemptReliabilityRouter from "./attempt-reliability";
import canonicalAttemptResultsRouter from "./canonical-attempt-results";
import canonicalStudentReadRouter from "./canonical-student-read";
import studentTestSeriesRouter from "./student-test-series";
import adminSessionRouter from "./admin-session";
import retiredLegacyRouter from "./retired-legacy";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/subcategories", subcategoriesRouter);

// Canonical student runtime. Series access is mounted first so series-bound
// tests cannot bypass release or progression checks on load or submission.
// Durable attempt sessions are established before the scorer and canonical
// results are always read from the committed learning.attempts row.
router.use(studentTestSeriesRouter);
router.use(attemptReliabilityRouter);
router.use(canonicalAttemptResultsRouter);
router.use(canonicalStudentReadRouter);
router.use(publishedTestRunnerRouter);
router.use("/published-tests", publishedTestsRouter);

// Canonical administration. Collaboration layers preserve the underlying
// question and test lifecycle engines while enforcing their production gates.
router.use("/admin/session", adminSessionRouter);
router.use("/admin/access-control", adminAccessControlRouter);
router.use("/admin/content-review", adminContentReviewRouter);
router.use("/admin/question-studio", adminQuestionStudioQualityRouter);
router.use("/admin/question-studio", adminQuestionStudioRegenerationRouter);
router.use("/admin/question-studio", adminQuestionStudioRouter);
router.use("/admin/questions", adminQuestionsRouter);
router.use("/admin/taxonomy", adminTaxonomyCoverageRouter);
router.use("/admin/taxonomy", adminTaxonomyRouter);
// Assembly is mounted first so preview and draft creation always use the
// provenance-linked, duplicate-safe production implementation.
router.use("/admin/test-blueprints", adminTestBlueprintAssemblyRouter);
router.use("/admin/test-blueprints", adminTestBlueprintsRouter);
router.use("/admin/test-series", adminTestSeriesRouter);
router.use("/admin/test-qa", adminTestQaRouter);
router.use("/admin/tests", adminTestQaGateRouter);
router.use("/admin/tests", adminTestsRouter);

// Compatibility responses for intentionally discarded legacy features. No
// route below this point reads or writes the former public-schema database.
router.use(retiredLegacyRouter);

export default router;
