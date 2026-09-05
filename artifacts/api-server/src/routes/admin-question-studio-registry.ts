import { Router, type IRouter } from "express";

import adminQuestionStudioBulkHardeningRouter from "./admin-question-studio-bulk-hardening";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioCom003Router from "./admin-question-studio-com003";
import adminQuestionStudioSriRouter from "./admin-question-studio-sri";
import adminQuestionStudioEngineV1Router from "./admin-question-studio-engine-v1";
import adminQuestionStudioDataSufficiencyCurrentRouter from "./admin-question-studio-data-sufficiency-current";
import adminQuestionStudioCp014Router from "./admin-question-studio-cp014";
import adminQuestionStudioTrigonometryRouter from "./admin-question-studio-trigonometry";
import adminQuestionStudioCp013Router from "./admin-question-studio-cp013";
import adminQuestionStudioAverageRouter from "./admin-question-studio-average";
import adminQuestionStudioRegenerationRouter from "./admin-question-studio-regeneration";
import adminQuestionStudioCalibrationRouter from "./admin-question-studio-calibration";
import adminQuestionStudioMixedDifficultyRouter from "./admin-question-studio-mixed-difficulty";
import adminQuestionStudioSeriesRouter from "./admin-question-studio-series";
import adminQuestionStudioInterestRouter from "./admin-question-studio-interest";
import adminQuestionStudioMensurationRouter from "./admin-question-studio-mensuration";
import adminQuestionStudioMensurationFullRouter from "./admin-question-studio-mensuration-full";
import adminQuestionStudioAlgebraRouter from "./admin-question-studio-algebra";
import adminQuestionStudioDataSufficiencyRouter from "./admin-question-studio-data-sufficiency";
import adminQuestionStudioProbabilityRouter from "./admin-question-studio-probability";
import adminQuestionStudioCalendarRouter from "./admin-question-studio-calendar";
import adminQuestionStudioSpatialRouter from "./admin-question-studio-spatial";
import adminQuestionStudioRouter from "./admin-question-studio";

/**
 * Canonical Question Studio route registry.
 *
 * Order is intentional. Specialized read-only/hardening routers run first.
 * SRI retains ownership of the established aggregate GET /capabilities surface.
 * The multi-engine V1 router follows SRI so non-SRI knowledge/language POST
 * /runs requests can enter the standard persisted review lifecycle without
 * replacing that compatibility capabilities response. DSF and older package
 * fallbacks remain below it. COM-003 therefore has two distinct surfaces:
 * frozen read-only preview through its dedicated router and authorized
 * REVIEW_ONLY run persistence through the multi-engine router.
 */
const router: IRouter = Router();

router.use(adminQuestionStudioBulkHardeningRouter);
router.use(adminQuestionStudioQualityRouter);
router.use(adminQuestionStudioCom003Router);
router.use(adminQuestionStudioSriRouter);
router.use(adminQuestionStudioEngineV1Router);
router.use(adminQuestionStudioDataSufficiencyCurrentRouter);
router.use(adminQuestionStudioCp014Router);
router.use(adminQuestionStudioTrigonometryRouter);
router.use(adminQuestionStudioCp013Router);
router.use(adminQuestionStudioAverageRouter);
router.use(adminQuestionStudioRegenerationRouter);
router.use(adminQuestionStudioCalibrationRouter);
router.use(adminQuestionStudioMixedDifficultyRouter);
router.use(adminQuestionStudioSeriesRouter);
router.use(adminQuestionStudioInterestRouter);
router.use(adminQuestionStudioMensurationRouter);
router.use(adminQuestionStudioMensurationFullRouter);
router.use(adminQuestionStudioAlgebraRouter);
router.use(adminQuestionStudioDataSufficiencyRouter);
router.use(adminQuestionStudioProbabilityRouter);
router.use(adminQuestionStudioCalendarRouter);
router.use(adminQuestionStudioSpatialRouter);
router.use(adminQuestionStudioRouter);

export default router;
