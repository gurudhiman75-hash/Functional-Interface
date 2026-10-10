import { Router, type IRouter, type RequestHandler } from "express";

type RouteMatch = (req: Parameters<RequestHandler>[0]) => boolean;

function lazyRouter(
  loader: () => Promise<{ default: IRouter }>,
  matches?: RouteMatch,
): RequestHandler {
  let routerPromise: Promise<IRouter> | null = null;
  return (req, res, next) => {
    // Express runs every router.use middleware in order. Without this check,
    // even unrelated /runs and /items requests import every chapter engine.
    // On Render's small shared API instance that causes severe load spikes.
    if (matches && !matches(req)) {
      next();
      return;
    }
    routerPromise ??= loader().then((module) => module.default).catch((error) => {
      // Allow retry if a dynamic import fails instead of poisoning all requests.
      routerPromise = null;
      throw error;
    });
    void routerPromise
      .then((loadedRouter) => loadedRouter(req, res, next))
      .catch(next);
  };
}

// Dedicated ARG-001 generations must remain ahead of the general engine.
// Identify them from the same package/pattern/CP selectors used by legacy
// authoring requests; other subjects must never hydrate the seven ARG engines.
const isArgumentsRequest: RouteMatch = (req) => {
  if (req.path === "/capabilities") return true;
  if (req.method !== "POST" || req.path !== "/runs") return false;
  const body = (req.body ?? {}) as Record<string, unknown>;
  const selectors = [
    body.packageId, body.patternId, body.cpId, body.canonicalProblemId,
    body.qlId, body.topic, body.subtopic,
  ];
  return selectors.some((value) =>
    typeof value === "string"
    && (/(?:^|[^a-z])arg(?:[-_\s]|$)/i.test(value)
      || /statement\s*(?:&|and)\s*arguments?/i.test(value)),
  );
};

const isSriRequest: RouteMatch = (req) => {
  if (req.path === "/capabilities") return true;
  if (req.method !== "POST" || req.path !== "/runs") return false;
  const body = (req.body ?? {}) as Record<string, unknown>;
  return [body.packageId, body.patternId, body.topic, body.subtopic, body.canonicalProblemId]
    .some((value) => typeof value === "string"
      && (/(?:^|[^a-z])sri(?:[-_\s]|$)/i.test(value)
        || /surds?\s*(?:&|and)\s*indices/i.test(value)));
};

// Keep governed Question Studio packages isolated. Loading the registry must
// not hydrate every chapter engine/content authority into the 512 MiB web
// process; each package is imported only when request flow reaches it.
const adminQuestionStudioBulkHardeningRouter = lazyRouter(() => import("./admin-question-studio-bulk-hardening"), (req) => req.path === "/items/bulk");
const adminQuestionStudioQualityRouter = lazyRouter(() => import("./admin-question-studio-quality"), (req) => req.path === "/items/bulk" || /^\/items\/[^/]+\/revision$/.test(req.path));
const adminQuestionStudioArgumentsCp015Router = lazyRouter(() => import("./admin-question-studio-arguments-cp015"), isArgumentsRequest);
const adminQuestionStudioArgumentsCp014Router = lazyRouter(() => import("./admin-question-studio-arguments-cp014"), isArgumentsRequest);
const adminQuestionStudioArgumentsCp013Router = lazyRouter(() => import("./admin-question-studio-arguments-cp013"), isArgumentsRequest);
const adminQuestionStudioArgumentsCp012Router = lazyRouter(() => import("./admin-question-studio-arguments-cp012"), isArgumentsRequest);
const adminQuestionStudioArgumentsCp010Router = lazyRouter(() => import("./admin-question-studio-arguments-cp010"), isArgumentsRequest);
const adminQuestionStudioArgumentsCp007Router = lazyRouter(() => import("./admin-question-studio-arguments-cp007-v2"), isArgumentsRequest);
const adminQuestionStudioArgumentsRouter = lazyRouter(() => import("./admin-question-studio-arguments"), isArgumentsRequest);
const adminQuestionStudioCom003Router = lazyRouter(() => import("./admin-question-studio-com003"), (req) => req.path.startsWith("/computer/com003/"));
const adminQuestionStudioSriRouter = lazyRouter(() => import("./admin-question-studio-sri"), isSriRequest);
const adminQuestionStudioEngineV1Router = lazyRouter(() => import("./admin-question-studio-engine-v1"));
const adminQuestionStudioDataSufficiencyCurrentRouter = lazyRouter(() => import("./admin-question-studio-data-sufficiency-current"));
const adminQuestionStudioCp014Router = lazyRouter(() => import("./admin-question-studio-cp014"));
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
 * generic engine and shared review/bulk catch-all surface. ARG-001 CP015 is the current
 * diversity-hardened internal authority; CP014/CP013/CP012/CP010/CP007 and the
 * base ARG router remain historical fallbacks. COM-003, SRI and the multi-engine
 * V1 route retain their current New-main ownership and ordering, followed by
 * chapter/workflow routers and compatibility fallbacks. The hardened bulk router
 * owns item disposition; the final shared router owns paged review only.
 */
const router: IRouter = Router();

// The current TRG-002 chapter mix is owned by the canonical multi-engine V1
// router, not any historical ARG, SRI or chapter-compatibility endpoint.
// Route it directly to its existing authenticated generation handler. Otherwise
// Express walks the seven ARG lazy routers first, hydrating unrelated runtime
// modules before any TRG-002 work can begin. On a low-CPU shared API instance
// that can block health checks and abort the generation request.
//
// Keep every other package and endpoint on the established registry path.
router.post("/runs", (req, res, next) => {
  if (req.body?.packageId !== "TRG-002") {
    next();
    return;
  }
  adminQuestionStudioEngineV1Router(req, res, next);
});

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
