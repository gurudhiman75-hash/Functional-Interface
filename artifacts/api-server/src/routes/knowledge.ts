import { Router } from "express";
import multer from "multer";
import {
  approveKnowledgeFact,
  extractFactCandidatesWithMetadata,
  listApprovedKnowledgeFacts,
  listExtractionCandidates,
  updateExtractionCandidate,
  upsertExtractionCandidates,
  validateFactCandidate,
  type KnowledgeFact,
  type KnowledgeFactType,
} from "../generators/knowledge";
import {
  ingestPdfBuffer,
  ingestPlainTextBuffer,
} from "../generators/knowledge/pdf-ingestion";

const router = Router();
const ingestionUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize:
      Number(process.env["KNOWLEDGE_UPLOAD_MAX_BYTES"]) ||
      25 * 1024 * 1024,
  },
  fileFilter(_req, file, cb) {
    const allowed =
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("text/") ||
      /\.(txt|csv|md|json)$/i.test(
        file.originalname,
      );

    if (allowed) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only PDF and text source files are allowed.",
        ),
      );
    }
  },
});

function parseOptionalPositiveInteger(
  value: unknown,
  fieldName: string,
) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  const parsed = Number(value);
  if (
    !Number.isInteger(parsed) ||
    parsed < 1
  ) {
    throw new Error(
      `${fieldName} must be a positive whole number.`,
    );
  }

  return parsed;
}

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
  "/ingest-file",
  ingestionUpload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "file is required.",
        });
      }

      const isPdf =
        req.file.mimetype ===
          "application/pdf" ||
        /\.pdf$/i.test(
          req.file.originalname,
        );
      const startPage =
        parseOptionalPositiveInteger(
          req.body?.startPage,
          "startPage",
        );
      const endPage =
        parseOptionalPositiveInteger(
          req.body?.endPage,
          "endPage",
        );
      const result = isPdf
        ? await ingestPdfBuffer(
            req.file.buffer,
            {
              fileName:
                req.file.originalname,
              mimeType:
                req.file.mimetype,
              startPage,
              endPage,
            },
          )
        : ingestPlainTextBuffer(
            req.file.buffer,
            {
              fileName:
                req.file.originalname,
              mimeType:
                req.file.mimetype,
            },
          );

      res.json({
        success: true,
        text: result.text,
        rawTextPreview:
          result.rawText.slice(0, 4000),
        metadata: result.metadata,
      });
    } catch (error: any) {
      console.error(
        "[knowledge] ingest file",
        error,
      );
      const message =
        error?.message ??
        "Knowledge source ingestion failed.";
      const isUserFixable =
        /page|range|limit|large|positive whole number/i.test(
          message,
        );
      res.status(isUserFixable ? 400 : 500).json({
        success: false,
        error: message,
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
        extractionKind,
        provider,
        model,
        sourceMetadata,
      } = req.body as {
        rawText?: string;
        sourceName?: string;
        sourceBook?: string;
        sourceChapter?: string;
        sourcePage?: number | string;
        sourceUrl?: string;
        allowedFactTypes?: KnowledgeFactType[];
        extractionKind?:
          | "gk-facts"
          | "pyq"
          | "quant-motifs"
          | "reasoning-motifs";
        provider?:
          | "openai"
          | "gemini"
          | "claude";
        model?: string;
        sourceMetadata?: {
          sourceType?: string;
          ocrUsed?: boolean;
          pageCount?: number;
          totalPages?: number;
          selectedStartPage?: number;
          selectedEndPage?: number;
        };
      };

      if (!rawText?.trim()) {
        return res.status(400).json({
          success: false,
          error:
            "rawText is required for knowledge extraction.",
        });
      }

      const extraction =
        await extractFactCandidatesWithMetadata({
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
          extractionKind,
          provider,
          model,
          sourceMetadata,
        });

      await upsertExtractionCandidates(
        extraction.candidates,
      );

      res.json({
        success: true,
        source: extraction.source,
        extractionMetadata:
          extraction.metadata,
        candidates:
          extraction.candidates,
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
