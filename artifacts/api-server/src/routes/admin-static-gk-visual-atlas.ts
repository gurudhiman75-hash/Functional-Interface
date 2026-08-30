import { Router, type IRouter, type NextFunction, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  loadValidatedRuntimeAdminGeometry,
  runtimeAdminGeometryConfigFromEnv,
} from "../static-gk-visual-atlas/geometry/runtime-admin-loader";
import { normalizeStaticGkRenderableVisualId } from "../static-gk-visual-atlas/render-job-contract";
import {
  approveStaticGkRenderJob,
  createStaticGkRenderJob,
  getStaticGkRenderArtifact,
  getStaticGkRenderCapability,
  getStaticGkRenderJob,
  listStaticGkRenderJobs,
  StaticGkRenderJobError,
} from "../static-gk-visual-atlas/render-jobs";
import { getStaticGkAtlasStatus } from "../static-gk-visual-atlas/status-registry";

const router: IRouter = Router();
router.use(authenticate);

type RuntimeBundle = Awaited<ReturnType<typeof loadValidatedRuntimeAdminGeometry>>;

async function runtimeAtlasState(): Promise<{
  bundle: RuntimeBundle | undefined;
  runtimeGeometry: {
    configured: boolean;
    loaded: boolean;
    source: "none" | "path" | "https" | "invalid";
    geometryId?: string;
    sourceProductCode?: string;
    canonicalGeoJsonSha256?: string;
    error?: string;
  };
}> {
  const config = runtimeAdminGeometryConfigFromEnv();
  const configuredSourceCount = Number(Boolean(config.path)) + Number(Boolean(config.url));
  const runtimeGeometry = {
    configured: configuredSourceCount === 1,
    loaded: false,
    source: (config.path ? "path" : config.url ? "https" : configuredSourceCount > 1 ? "invalid" : "none") as
      | "none"
      | "path"
      | "https"
      | "invalid",
    geometryId: undefined as string | undefined,
    sourceProductCode: undefined as string | undefined,
    canonicalGeoJsonSha256: undefined as string | undefined,
    error: undefined as string | undefined,
  };

  let bundle: RuntimeBundle | undefined;
  if (configuredSourceCount === 1) {
    try {
      bundle = await loadValidatedRuntimeAdminGeometry(config);
      runtimeGeometry.loaded = true;
      runtimeGeometry.geometryId = bundle.receipt.geometryId;
      runtimeGeometry.sourceProductCode = bundle.receipt.sourceProductCode;
      runtimeGeometry.canonicalGeoJsonSha256 = bundle.receipt.canonicalGeoJsonSha256;
    } catch (error) {
      runtimeGeometry.error = error instanceof Error ? error.message : String(error);
    }
  } else if (configuredSourceCount > 1) {
    runtimeGeometry.error = "Configure exactly one runtime geometry source, not both path and URL.";
  }

  return { bundle, runtimeGeometry };
}

function handleRenderJobError(error: unknown, res: Response, next: NextFunction): void {
  if (error instanceof StaticGkRenderJobError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  next(error);
}

router.get("/", requireAdminPermission("content.questions.read"), async (_req, res) => {
  const [{ bundle, runtimeGeometry }, capability, recentJobs] = await Promise.all([
    runtimeAtlasState(),
    getStaticGkRenderCapability(),
    listStaticGkRenderJobs(),
  ]);
  res.json({
    ...getStaticGkAtlasStatus(bundle),
    runtimeGeometry,
    renderJobs: { capability, recent: recentJobs },
    generatedAt: new Date().toISOString(),
  });
});

router.get("/render-jobs/:jobId", requireAdminPermission("content.questions.read"), async (req, res, next) => {
  try {
    res.json({ job: await getStaticGkRenderJob(req.params.jobId) });
  } catch (error) {
    handleRenderJobError(error, res, next);
  }
});

router.post("/render-jobs", requireAdminPermission("content.questions.update"), async (req, res, next) => {
  try {
    let visualId;
    try {
      visualId = normalizeStaticGkRenderableVisualId(req.body?.visualId);
    } catch (error) {
      res.status(400).json({
        error: error instanceof Error ? error.message : "Invalid visualId.",
        code: "STATIC_GK_RENDER_VISUAL_INVALID",
      });
      return;
    }

    const { bundle, runtimeGeometry } = await runtimeAtlasState();
    if (!bundle || !runtimeGeometry.loaded) {
      res.status(409).json({
        error: runtimeGeometry.error || "Validated runtime geometry must be loaded before a render job can start.",
        code: "STATIC_GK_RENDER_GEOMETRY_NOT_READY",
      });
      return;
    }
    const item = getStaticGkAtlasStatus(bundle).items.find((candidate) => candidate.id === visualId);
    if (!item || item.readiness !== "render-ready") {
      res.status(409).json({
        error: item?.blockers[0] || "This Static GK lesson is not render-ready.",
        code: "STATIC_GK_RENDER_LESSON_NOT_READY",
      });
      return;
    }

    const session = req.adminSession!;
    const job = await createStaticGkRenderJob({
      visualId,
      requestedBy: {
        userId: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
      },
    });
    res.status(202).json({ job });
  } catch (error) {
    handleRenderJobError(error, res, next);
  }
});

router.post("/render-jobs/:jobId/review", requireAdminPermission("content.questions.update"), async (req, res, next) => {
  if (req.body?.acknowledgeNarrationReview !== true || req.body?.acknowledgeVisualFactReview !== true) {
    res.status(400).json({
      error: "Approval requires explicit acknowledgement of narration and visual/factual review.",
      code: "STATIC_GK_RENDER_REVIEW_ACK_REQUIRED",
    });
    return;
  }
  try {
    const session = req.adminSession!;
    const job = await approveStaticGkRenderJob({
      jobId: req.params.jobId,
      approvedBy: {
        userId: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
      },
    });
    res.json({ job });
  } catch (error) {
    handleRenderJobError(error, res, next);
  }
});

router.get(
  "/render-jobs/:jobId/artifacts/:artifactKey",
  requireAdminPermission("content.questions.read"),
  async (req, res, next) => {
    try {
      const artifact = await getStaticGkRenderArtifact({
        jobId: req.params.jobId,
        artifactKey: req.params.artifactKey,
      });
      res.setHeader("Content-Type", artifact.contentType);
      res.setHeader("Content-Disposition", `inline; filename="${artifact.fileName}"`);
      res.sendFile(artifact.path);
    } catch (error) {
      handleRenderJobError(error, res, next);
    }
  },
);

export default router;
