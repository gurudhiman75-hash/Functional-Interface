import { Router } from "express";
import {
  approveKnowledgeFact,
  extractFactCandidatesFromText,
  listApprovedKnowledgeFacts,
  listExtractionCandidates,
  updateExtractionCandidate,
  upsertExtractionCandidates,
  validateFactCandidate,
  type KnowledgeFact,
  type KnowledgeFactType,
} from "../generators/knowledge";

const router = Router();

router.get(
  "/extraction-candidates",
  async (_req, res) => {
    try {
      const candidates =
        await listExtractionCandidates();
      res.json({
        success: true,
        candidates,
      });
    } catch (error) {
      console.error(
        "[knowledge] list extraction candidates",
        error,
      );
      res.status(500).json({
        success: false,
        error:
          "Failed to load extraction candidates.",
      });
    }
  },
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
  "/extract",
  async (req, res) => {
    try {
      const {
        rawText,
        sourceName,
        sourceBook,
        sourceChapter,
        sourcePage,
        sourceUrl,
        allowedFactTypes,
      } = req.body as {
        rawText?: string;
        sourceName?: string;
        sourceBook?: string;
        sourceChapter?: string;
        sourcePage?: number | string;
        sourceUrl?: string;
        allowedFactTypes?: KnowledgeFactType[];
      };

      if (!rawText?.trim()) {
        return res.status(400).json({
          success: false,
          error:
            "rawText is required for knowledge extraction.",
        });
      }

      const candidates =
        await extractFactCandidatesFromText({
          rawText,
          sourceName:
            sourceName ??
            sourceBook ??
            "Untitled source",
          sourceBook,
          sourceChapter,
          sourcePage:
            sourcePage === undefined ||
            sourcePage === ""
              ? undefined
              : Number(sourcePage),
          sourceUrl,
          allowedFactTypes,
        });

      await upsertExtractionCandidates(
        candidates,
      );

      res.json({
        success: true,
        source:
          process.env["OPENAI_API_KEY"]
            ? "openai"
            : "offline-heuristic",
        candidates,
      });
    } catch (error: any) {
      console.error(
        "[knowledge] extract",
        error,
      );
      res.status(500).json({
        success: false,
        error:
          error?.message ??
          "Knowledge extraction failed.",
      });
    }
  },
);

router.post(
  "/extraction-candidates/:candidateId/review",
  async (req, res) => {
    try {
      const { candidateId } =
        req.params;
      const {
        status,
        notes,
        proposedFact,
      } = req.body as {
        status?:
          | "needs_review"
          | "approved"
          | "rejected";
        notes?: string;
        proposedFact?: KnowledgeFact;
      };

      if (
        status !== "needs_review" &&
        status !== "approved" &&
        status !== "rejected"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "status must be needs_review, approved, or rejected.",
        });
      }

      const updated =
        await updateExtractionCandidate(
          candidateId,
          (candidate) => {
            const fact =
              proposedFact ??
              candidate.proposedFact;
            return {
              ...candidate,
              proposedFact: fact,
              status,
              review: {
                reviewedAt:
                  new Date().toISOString(),
                notes,
              },
            };
          },
        );

      if (!updated) {
        return res.status(404).json({
          success: false,
          error:
            "Extraction candidate not found.",
        });
      }

      if (status === "approved") {
        const fact = {
          ...updated.proposedFact,
          verification: {
            reviewed: true,
            confidence: Math.max(
              updated.proposedFact
                .verification
                .confidence,
              0.8,
            ),
          },
        };
        const validation =
          validateFactCandidate(fact);

        if (!validation.valid) {
          return res.status(400).json({
            success: false,
            error:
              "Approved fact failed validation.",
            issues: validation.issues,
          });
        }

        await approveKnowledgeFact(fact);
      }

      res.json({
        success: true,
        candidate: updated,
      });
    } catch (error: any) {
      console.error(
        "[knowledge] review candidate",
        error,
      );
      res.status(500).json({
        success: false,
        error:
          error?.message ??
          "Failed to review extraction candidate.",
      });
    }
  },
);

export default router;
