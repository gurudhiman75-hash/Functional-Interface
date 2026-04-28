import { Router, type IRouter } from "express";
import { authenticate } from "../middlewares/auth";
import { assertAdmin } from "./admin-data";
import { createPatternFn, listPatternsFn } from "../lib/pattern-generator.service";

const router: IRouter = Router();

router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);
    const patterns = await listPatternsFn();
    return res.json({ patterns, meta: { total: patterns.length } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not load patterns";
    return res.status(400).json({ error: message });
  }
});

router.post("/", authenticate, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    await assertAdmin(req.user.id);

    const pattern = await createPatternFn({
      name: req.body?.name,
      section: req.body?.section,
      topic: req.body?.topic,
      subtopic: req.body?.subtopic,
      template: req.body?.template,
      answerExpression: req.body?.answerExpression,
      variables: req.body?.variables,
    });

    return res.status(201).json({ pattern });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create pattern";
    return res.status(400).json({ error: message });
  }
});

export default router;
