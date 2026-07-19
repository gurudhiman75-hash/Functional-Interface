import { Router, type IRouter } from "express";

import healthRouter from "./health";
import usersRouter from "./users";
import categoriesRouter from "./categories";
import subcategoriesRouter from "./subcategories";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioRouter from "./admin-question-studio";
import adminQuestionsRouter from "./admin-questions";
import adminTestsRouter from "./admin-tests";
import publishedTestsRouter from "./published-tests";
import publishedTestRunnerRouter from "./published-test-runner";
import canonicalAttemptResultsRouter from "./canonical-attempt-results";
import canonicalStudentReadRouter from "./canonical-student-read";
import adminSessionRouter from "./admin-session";
import retiredLegacyRouter from "./retired-legacy";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/categories", categoriesRouter);
router.use("/subcategories", subcategoriesRouter);

// Canonical student runtime. The result wrapper must precede the scorer so it
// can persist the scorer response before it is returned to the browser.
router.use(canonicalAttemptResultsRouter);
router.use(canonicalStudentReadRouter);
router.use(publishedTestRunnerRouter);
router.use("/published-tests", publishedTestsRouter);

// Canonical administration and Question Studio. Quality/revision middleware is
// mounted first so approval cannot bypass the production content gate.
router.use("/admin/session", adminSessionRouter);
router.use("/admin/question-studio", adminQuestionStudioQualityRouter);
router.use("/admin/question-studio", adminQuestionStudioRouter);
router.use("/admin/questions", adminQuestionsRouter);
router.use("/admin/tests", adminTestsRouter);

// Compatibility responses for intentionally discarded legacy features. No
// route below this point reads or writes the former public-schema database.
router.use(retiredLegacyRouter);

export default router;
