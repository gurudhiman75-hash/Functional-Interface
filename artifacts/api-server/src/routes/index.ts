import { Router, type IRouter } from "express";

import healthRouter from "./health";
import usersRouter from "./users";
import categoriesRouter from "./categories";
import subcategoriesRouter from "./subcategories";
import adminAuditEventsHardeningRouter from "./admin-audit-events-hardening";
import adminAccessControlHardeningRouter from "./admin-access-control-hardening";
import adminAccessControlRouter from "./admin-access-control";
import adminContentIntelligenceRouter from "./admin-content-intelligence";
import adminContentReviewRouter from "./admin-content-review";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioRegenerationRouter from "./admin-question-studio-regeneration";
import adminQuestionStudioRouter from "./admin-question-studio";
import adminQuestionTaxonomyHardeningRouter from "./admin-question-taxonomy-hardening";
import adminQuestionsRouter from "./admin-questions";
import adminStudentActionsRouter from "./admin-student-actions";
import adminStudentsRouter from "./admin-students";
import adminSystemHealthActionsRouter from "./admin-system-health-actions";
import adminSystemHealthRedactionRouter from "./admin-system-health-redaction";
import adminSystemHealthRouter from "./admin-system-health";
import adminTaxonomyCoverageRouter from "./admin-taxonomy-coverage";
import adminTaxonomyRouter from "./admin-taxonomy";
import adminTestBlueprintAssemblyRouter from "./admin-test-blueprint-assembly";
import adminTestBlueprintsRouter from "./admin-test-blueprints";
import adminTestLocalizationGateRouter from "./admin-test-localization-gate";
import adminTestSeriesRouter from "./admin-test-series";
import adminTestQaGateRouter from "./admin-test-qa-gate";
import adminTestQaRouter from "./admin-test-qa";
import adminTestTranslationsRouter from "./admin-test-translations";
import adminTestsRouter from "./admin-tests";
import adminTranslationActionsRouter from "./admin-translation-actions";
import adminTranslationHardeningRouter from "./admin-translation-hardening";
import adminTranslationsRouter from "./admin-translations";
import publishedTestsRouter from "./published-tests";
import publishedTestMultilingualRunnerRouter from "./published-test-multilingual-runner";
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
// Multilingual publications shadow only configured bilingual tests; English-only
// publications continue through the proven source-language runner.
router.use(publishedTestMultilingualRunnerRouter);
router.use(publishedTestRunnerRouter);
router.use("/published-tests", publishedTestsRouter);

// Canonical administration. Collaboration layers preserve the underlying
// question and test lifecycle engines while enforcing their production gates.
router.use("/admin/session", adminSessionRouter);
// Focused correctness guards shadow only the affected control-plane routes;
// all unaffected reads and mutations continue through the canonical router.
router.use("/admin/access-control", adminAuditEventsHardeningRouter);
router.use("/admin/access-control", adminAccessControlHardeningRouter);
router.use("/admin/access-control", adminAccessControlRouter);
// Student account mutations are mounted before the canonical read workspace so
// status changes and session revocation always use the audited transactional path.
router.use("/admin/students", adminStudentActionsRouter);
router.use("/admin/students", adminStudentsRouter);
// Content intelligence extends the canonical review queue with deterministic
// duplicate scanning and audit-derived chapter freeze governance.
router.use("/admin/content-review", adminContentIntelligenceRouter);
router.use("/admin/content-review", adminContentReviewRouter);
router.use("/admin/question-studio", adminQuestionStudioQualityRouter);
router.use("/admin/question-studio", adminQuestionStudioRegenerationRouter);
router.use("/admin/question-studio", adminQuestionStudioRouter);
router.use("/admin/questions", adminQuestionTaxonomyHardeningRouter);
router.use("/admin/questions", adminQuestionsRouter);
// Translation operations own language configuration, terminology, question and
// test localization, reviewer workflow, and publication-readiness evidence.
// Focused correctness guards are mounted first for affected mutations.
router.use("/admin/translations", adminTranslationHardeningRouter);
router.use("/admin/translations", adminTranslationActionsRouter);
router.use("/admin/translations", adminTestTranslationsRouter);
router.use("/admin/translations", adminTranslationsRouter);
// Operational visibility reuses the canonical jobs, generation, validation,
// outbox and audit foundations without creating a parallel monitoring store.
// Response redaction is mounted first and the focused mutation router owns job actions.
router.use("/admin/system-health", adminSystemHealthRedactionRouter);
router.use("/admin/system-health", adminSystemHealthActionsRouter);
router.use("/admin/system-health", adminSystemHealthRouter);
router.use("/admin/taxonomy", adminTaxonomyCoverageRouter);
router.use("/admin/taxonomy", adminTaxonomyRouter);
// Assembly is mounted first so preview and draft creation always use the
// provenance-linked, duplicate-safe production implementation.
router.use("/admin/test-blueprints", adminTestBlueprintAssemblyRouter);
router.use("/admin/test-blueprints", adminTestBlueprintsRouter);
router.use("/admin/test-series", adminTestSeriesRouter);
router.use("/admin/test-qa", adminTestQaRouter);
// Localization must pass before the ordinary QA collaboration gate and lifecycle.
router.use("/admin/tests", adminTestLocalizationGateRouter);
router.use("/admin/tests", adminTestQaGateRouter);
router.use("/admin/tests", adminTestsRouter);

// Compatibility responses for intentionally discarded legacy features. No
// route below this point reads or writes the former public-schema database.
router.use(retiredLegacyRouter);

export default router;
