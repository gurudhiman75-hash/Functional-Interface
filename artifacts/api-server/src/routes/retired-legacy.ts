import { Router, type IRouter } from "express";

const router: IRouter = Router();

const retired = (feature: string) => ({
  error: `${feature} is not available in the canonical platform yet`,
  code: "LEGACY_FEATURE_RETIRED",
});

// Read-only compatibility responses prevent old UI surfaces from crashing while
// making it explicit that no legacy database content was migrated.
router.get("/bundles", (_req, res) => res.json([]));
router.get("/packages", (_req, res) => res.json([]));
router.get("/leaderboard", (_req, res) => res.json({ leaderboard: [], totalParticipants: 0 }));
router.get("/sections", (_req, res) => res.json([]));
router.get("/topics", (_req, res) => res.json([]));
router.get("/di-sets", (_req, res) => res.json([]));
router.get("/daily-challenge", (_req, res) => res.status(404).json(retired("Daily challenge")));
router.get("/billing/check-purchase", (req, res) => res.json({
  purchased: false,
  testId: String(req.query.testId ?? ""),
  access: "free",
  priceCents: null,
}));

for (const path of [
  "/billing/razorpay/create-order",
  "/billing/razorpay/verify",
  "/billing/mock-unlock",
  "/purchase",
  "/responses",
  "/upload-questions",
]) {
  router.post(path, (_req, res) => res.status(410).json(retired("Legacy write operation")));
}

export default router;
