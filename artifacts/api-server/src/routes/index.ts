import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import testsRouter from "./tests";
import attemptsRouter from "./attempts";
import categoriesRouter from "./categories";
import bundlesRouter from "./bundles";
import adminDataRouter from "./admin-data";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/tests", testsRouter);
router.use("/attempts", attemptsRouter);
router.use("/categories", categoriesRouter);
router.use("/bundles", bundlesRouter);
router.use("/admin-data", adminDataRouter);

export default router;
