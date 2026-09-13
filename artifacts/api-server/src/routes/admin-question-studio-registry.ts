import { Router, type IRouter } from "express";

import adminQuestionStudioBulkHardeningRouter from "./admin-question-studio-bulk-hardening";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioArgumentsCp015Router from "./admin-question-studio-arguments-cp015";
import adminQuestionStudioArgumentsCp014Router from "./admin-question-studio-arguments-cp014";
import adminQuestionStudioArgumentsCp013Router from "./admin-question-studio-arguments-cp013";
import adminQuestionStudioArgumentsCp012Router from "./admin-question-studio-arguments-cp012";
import adminQuestionStudioArgumentsCp010Router from "./admin-question-studio-arguments-cp010";
import adminQuestionStudioArgumentsCp007Router from "./admin-question-studio-arguments-cp007-v2";
import adminQuestionStudioArgumentsRouter from "./admin-question-studio-arguments";
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
import adminQuestionStudioSeriesWorkflowRouter from "./admin-question-studio-series-workflow";
import adminQuestionStudioSeriesRouter from "./admin-question-studio-series";
import adminQuestionStudioInterestChapterRouter from "./admin-question-studio-interest-chapter";
import adminQuestionStudioInterestRouter from "./admin-question-studio-interest";
import adminQuestionStudioMensurationRouter from "./admin-question-studio-mensuration";
import adminQuestionStudioMensurationFullRouter from "./admin-question-studio-mensuration-full";
import adminQuestionStudioAlgebraRouter from "./admin-question-studio-algebra";
import adminQuestionStudioDataSufficiencyRouter from "./admin-question-studio-data-sufficiency";
import adminQuestionStudioProbabilityRouter from "./admin-question-studio-probability";
import adminQuestionStudioCalendarRouter from "./admin-question-studio-calendar";
import adminQuestionStudioCubesDiceWorkflowRouter from "./admin-question-studio-cubes-dice-workflow";
import adminQuestionStudioCubesDiceRouter from "./admin-question-studio-cubes-dice";
import adminQuestionStudioSpatialWorkflowRouter from "./admin-question-studio-spatial-workflow";
import adminQuestionStudioSpatialV5Router from "./admin-question-studio-spatial-v5";
import adminQuestionStudioSpatialRouter from "./admin-question-studio-spatial";
import adminQuestionStudioRouter from "./admin-question-studio";

/**
 * Canonical Question Studio route registry.
 *
 * Specialized hardening/read-only and governed chapter routers run before the
 * generic engine and legacy catch-all surfaces. ARG-001 CP015 is the current
 * diversity-hardened internal authority; CP014/CP013/CP012/CP010/CP007 and the
 * base ARG router remain historical fallbacks. COM-003, SRI and the multi-engine
 * V1 route retain their current New-main ownership and ordering, followed by
 * chapter/workflow routers and compatibility fallbacks.
 */
const router: IRouter = Router();

router.use(adminQuestionStudioBulkHardeningRouter);
router.use(adminQuestionStudioQualityRouter);
router.use(adminQuestionStudioArgumentsCp015Router);
router.use(adminQuestionStudioArgumentsCp014Router);
router.use(adminQuestionStudioArgumentsCp013Router);
router.use(adminQuestionStudioArgumentsCp012Router);
router.use(adminQuestionStudioArgumentsCp010Router);
router.use(adminQuestionStudioArgumentsCp007Router);
router.use(adminQuestionStudioArgumentsRouter);
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
router.use(adminQuestionStudioSeriesWorkflowRouter);
router.use(adminQuestionStudioSeriesRouter);
router.use(adminQuestionStudioInterestChapterRouter);
router.use(adminQuestionStudioInterestRouter);
router.use(adminQuestionStudioMensurationRouter);
router.use(adminQuestionStudioMensurationFullRouter);
router.use(adminQuestionStudioAlgebraRouter);
router.use(adminQuestionStudioDataSufficiencyRouter);
router.use(adminQuestionStudioProbabilityRouter);
router.use(adminQuestionStudioCalendarRouter);
router.use(adminQuestionStudioCubesDiceWorkflowRouter);
router.use(adminQuestionStudioCubesDiceRouter);
router.use(adminQuestionStudioSpatialWorkflowRouter);
router.use(adminQuestionStudioSpatialV5Router);
// Retain the prior Spatial router as a compatibility fallback; V5 owns the current endpoints above.
router.use(adminQuestionStudioSpatialRouter);
router.use(adminQuestionStudioRouter);

export default router;
