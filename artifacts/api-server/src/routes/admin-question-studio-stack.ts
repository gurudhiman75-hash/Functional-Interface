import { Router, type IRouter } from "express";

import adminQuestionStudioBulkHardeningRouter from "./admin-question-studio-bulk-hardening";
import adminQuestionStudioQualityRouter from "./admin-question-studio-quality";
import adminQuestionStudioAverageRouter from "./admin-question-studio-average";
import adminQuestionStudioRegenerationRouter from "./admin-question-studio-regeneration";
import adminQuestionStudioCalibrationRouter from "./admin-question-studio-calibration";
import adminQuestionStudioMixedDifficultyRouter from "./admin-question-studio-mixed-difficulty";
import adminQuestionStudioSeriesRouter from "./admin-question-studio-series";
import adminQuestionStudioInterestRouter from "./admin-question-studio-interest";
import adminQuestionStudioMensurationRouter from "./admin-question-studio-mensuration";
import adminQuestionStudioMensurationFullRouter from "./admin-question-studio-mensuration-full";
import adminQuestionStudioProbabilityRouter from "./admin-question-studio-probability";
import adminQuestionStudioCalendarRouter from "./admin-question-studio-calendar";
import adminQuestionStudioSpatialRouter from "./admin-question-studio-spatial";
import adminQuestionStudioRouter from "./admin-question-studio";

const router: IRouter = Router();

// Preserve the historical route precedence while keeping the generation-heavy
// module graph out of the API server's startup path. This stack is loaded only
// when an administrator first requests /api/admin/question-studio/*.
router.use(adminQuestionStudioBulkHardeningRouter);
router.use(adminQuestionStudioQualityRouter);
router.use(adminQuestionStudioAverageRouter);
router.use(adminQuestionStudioRegenerationRouter);
router.use(adminQuestionStudioCalibrationRouter);
router.use(adminQuestionStudioMixedDifficultyRouter);
router.use(adminQuestionStudioSeriesRouter);
router.use(adminQuestionStudioInterestRouter);
router.use(adminQuestionStudioMensurationRouter);
router.use(adminQuestionStudioMensurationFullRouter);
router.use(adminQuestionStudioProbabilityRouter);
router.use(adminQuestionStudioCalendarRouter);
router.use(adminQuestionStudioSpatialRouter);
router.use(adminQuestionStudioRouter);

export default router;
