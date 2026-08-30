import { Router, type IRouter } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { authenticate } from "../middlewares/auth";
import {
  loadValidatedRuntimeAdminGeometry,
  runtimeAdminGeometryConfigFromEnv,
} from "../static-gk-visual-atlas/geometry/runtime-admin-loader";
import { getStaticGkAtlasStatus } from "../static-gk-visual-atlas/status-registry";

const router: IRouter = Router();
router.use(authenticate);

router.get("/", requireAdminPermission("content.questions.read"), async (_req, res) => {
  const config = runtimeAdminGeometryConfigFromEnv();
  const configuredSourceCount = Number(Boolean(config.path)) + Number(Boolean(config.url));
  const runtimeGeometry = {
    configured: configuredSourceCount === 1,
    loaded: false,
    source: config.path ? "path" : config.url ? "https" : "none",
    geometryId: undefined as string | undefined,
    sourceProductCode: undefined as string | undefined,
    canonicalGeoJsonSha256: undefined as string | undefined,
    error: undefined as string | undefined,
  };

  let bundle: Awaited<ReturnType<typeof loadValidatedRuntimeAdminGeometry>> | undefined;
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
    runtimeGeometry.source = "invalid";
    runtimeGeometry.error = "Configure exactly one runtime geometry source, not both path and URL.";
  }

  res.json({
    ...getStaticGkAtlasStatus(bundle),
    runtimeGeometry,
    generatedAt: new Date().toISOString(),
  });
});

export default router;
