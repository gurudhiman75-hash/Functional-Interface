import { Router } from "express";

import { redactOperationalTelemetry } from "../lib/admin-system-health";

const router = Router();

router.use((_req, res, next) => {
  const originalJson = res.json.bind(res);
  res.json = ((body: unknown) => originalJson(redactOperationalTelemetry(body))) as typeof res.json;
  next();
});

export default router;
