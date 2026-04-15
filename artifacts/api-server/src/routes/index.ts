import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import testsRouter from "./tests";
import attemptsRouter from "./attempts";
import leaderboardRouter from "./leaderboard";
import categoriesRouter from "./categories";
import bundlesRouter from "./bundles";
import adminDataRouter from "./admin-data";
import billingRouter from "./billing";
import analyticsRouter from "./analytics";
import packagesRouter from "./packages";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/billing", billingRouter);
router.use("/tests", testsRouter);
router.use("/attempts", attemptsRouter);
router.use("/analytics", analyticsRouter);
router.use("/packages", packagesRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/categories", categoriesRouter);
router.use("/bundles", bundlesRouter);
router.use("/admin-data", adminDataRouter);

export default router;
