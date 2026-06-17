import { Router } from "express";
import {
  listApprovedKnowledgeFacts,
} from "../generators/knowledge";

const router = Router();

function aiIntakeCleared(res: any) {
  return res.status(410).json({
    success: false,
    error:
      "AI intake has been cleared. Question Studio uses Quant V4 generation only.",
    generationSystem: "quant-v4",
  });
}

router.get(
  "/extraction-candidates",
  async (_req, res) => aiIntakeCleared(res),
);

router.get(
  "/approved-facts",
  async (_req, res) => {
    try {
      const facts =
        await listApprovedKnowledgeFacts();
      res.json({
        success: true,
        facts,
      });
    } catch (error) {
      console.error(
        "[knowledge] list approved facts",
        error,
      );
      res.status(500).json({
        success: false,
        error:
          "Failed to load approved facts.",
      });
    }
  },
);

router.post(
  "/ingest-file",
  async (_req, res) => aiIntakeCleared(res),
);

router.post(
  "/extract",
  async (_req, res) => aiIntakeCleared(res),
);

router.post(
  "/extraction-candidates/:candidateId/review",
  async (_req, res) => aiIntakeCleared(res),
);

export default router;
