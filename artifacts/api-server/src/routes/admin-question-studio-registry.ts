import { Router, type IRouter, type RequestHandler } from "express";

function lazyRouter(loader: () => Promise<{ default: IRouter }>): RequestHandler {
  let routerPromise: Promise<IRouter> | null = null;
  return (req, res, next) => {
    routerPromise ??= loader().then((module) => module.default);
    void routerPromise
      .then((loadedRouter) => loadedRouter(req, res, next))
      .catch(next);
  };
}

// Keep governed Question Studio packages isolated. Loading the registry must
// not hydrate every chapter engine/content authority into the 512 MiB web
// process; each package is imported only when request flow reaches it.
const adminQuestionStudioBulkHardeningRouter = lazyRouter(() => import("./admin-question-studio-bulk-hardening"));
const adminQuestionStudioQualityRouter = lazyRouter(() => import("./admin-question-studio-quality"));
const adminQuestionStudioArgumentsCp015Router = lazyRouter(() => import("./admin-question-studio-arguments-cp015"));
const adminQuestionStudioArgumentsCp014Router = lazyRouter(() => import("./admin-question-studio-arguments-cp014"));
const adminQuestionStudioArgumentsCp013Router = lazyRouter(() => import("./admin-question-studio-arguments-cp013"));
const adminQuestionStudioArgumentsCp012Router = lazyRouter(() => import("./admin-question-studio-arguments-cp012"));
const adminQuestionStudioArgumentsCp010Router = lazyRouter(() => import("./admin-question-studio-arguments-cp010"));
const adminQuestionStudioArgumentsCp007Router = lazyRouter(() => import("./admin-question-studio-arguments-cp007-v2"));
const adminQuestionStudioArgumentsRouter = lazyRouter(() => import("./admin-question-studio-arguments"));
const adminQuestionStudioCom003Router = lazyRouter(() => import("./admin-question-studio-com003"));
const adminQuestionStudioSriRouter = lazyRouter(() => import("./admin-question-studio-sri"));
const adminQuestionStudioEngineV1Router = lazyRouter(() => import("./admin-question-studio-engine-v1"));
const adminQuestionStudioDataSufficiencyCurrentRouter = lazyRouter(() => import("./admin-question-studio-data-sufficiency-current"));
const adminQuestionStudioCp014Router = lazyRouter(() => import("./admin-question-studio-cp014"));
const adminQuestionStudioTrigonometryRouter = lazyRouter(() => import("./admin-question-studio-trigonometry"));
const adminQuestionStudioCp013Router = lazyRouter(() => import("./admin-question-studio-cp013"));
const adminQuestionStudioAverageRouter = lazyRouter(() => import("./admin-question-studio-average"));
const adminQuestionStudioRegenerationRouter = lazyRouter(() => import("./admin-question-studio-regeneration"));
const adminQuestionStudioCalibrationRouter = lazyRouter(() => import("./admin-question-studio-calibration"));
const adminQuestionStudioMixedDifficultyRouter = lazyRouter(() => import("./admin-question-studio-mixed-difficulty"));
const adminQuestionStudioSeriesWorkflowRouter = lazyRouter(() => import("./admin-question-studio-series-workflow"));
const adminQuestionStudioSeriesRouter = lazyRouter(() => import("./admin-question-studio-series"));
const adminQuestionStudioInterestChapterRouter = lazyRouter(() => import("./admin-question-studio-interest-chapter"));
const adminQuestionStudioInterestRouter = lazyRouter(() => import("./admin-question-studio-interest"));
const adminQuestionStudioMensurationRouter = lazyRouter(() => import("./admin-question-studio-mensuration"));
const adminQuestionStudioMensurationFullRouter = lazyRouter(() => import("./admin-question-studio-mensuration-full"));
const adminQuestionStudioAlgebraRouter = lazyRouter(() => import("./admin-question-studio-algebra"));
const adminQuestionStudioDataSufficiencyRouter = lazyRouter(() => import("./admin-question-studio-data-sufficiency"));
const adminQuestionStudioProbabilityRouter = lazyRouter(() => import("./admin-question-studio-probability"));
const adminQuestionStudioCalendarRouter = lazyRouter(() => import("./admin-question-studio-calendar"));
const adminQuestionStudioCubesDiceWorkflowRouter = lazyRouter(() => import("./admin-question-studio-cubes-dice-workflow"));
const adminQuestionStudioCubesDiceRouter = lazyRouter(() => import("./admin-question-studio-cubes-dice"));
const adminQuestionStudioSpatialWorkflowRouter = lazyRouter(() => import("./admin-question-studio-spatial-workflow"));
const adminQuestionStudioSpatialV5Router = lazyRouter(() => import("./admin-question-studio-spatial-v5"));
const adminQuestionStudioSpatialRouter = lazyRouter(() => import("./admin-question-studio-spatial"));
const adminQuestionStudioRouter = lazyRouter(() => import("./admin-question-studio"));



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
