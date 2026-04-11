import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import testsRouter from "./tests";
import attemptsRouter from "./attempts";
import categoriesRouter from "./categories";
import bundlesRouter from "./bundles";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/users", usersRouter);
router.use("/tests", testsRouter);
router.use("/attempts", attemptsRouter);
router.use("/categories", categoriesRouter);
router.use("/bundles", bundlesRouter);

export default router;
