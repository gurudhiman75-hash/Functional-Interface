import { createHash, randomUUID } from "node:crypto";
import { Router, raw, type IRouter, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";
import { ingestPdfBuffer } from "../generators/knowledge/pdf-ingestion";
import {
  discoveryKeywords,
  extractResearchSignals,
  parseSyndicationFeed,
  pdfCandidateDedupeKey,
} from "../current-affairs/ingestion";
import { sourceCandidateDedupeKey } from "../current-affairs/core";

const router: IRouter = Router();
const sourceKeyPattern = /^[a-z0-9][a-z0-9_-]{1,79}$/;
const rightsBases = new Set(["user_supplied", "licensed", "public_domain", "publisher_authorized"]);
const contentPolicies = new Set(["primary_facts", "discovery_only", "licensed_research"]);
const ingestionModes = new Set(["manual", "feed", "pdf", "feed_and_pdf"]);
const MAX_FEED_BYTES = 2_500_000;

class CurrentAffairsIngestionError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly statusCode = 400,
  ) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function dateOnly(value: unknown): string | null {
  if (value == null || value === "") return null;
  const rawValue = text(value, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rawValue)) {
    throw new CurrentAffairsIngestionError("INVALID_PUBLICATION_DATE", "Publication date must use YYYY-MM-DD.");
  }
  const parsed = new Date(`${rawValue}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== rawValue) {
    throw new CurrentAffairsIngestionError("INVALID_PUBLICATION_DATE", "Publication date is invalid.");
  }
  return rawValue;
}

function positiveInteger(value: unknown): number | undefined {
  if (value == null || value === "") return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new CurrentAffairsIngestionError("INVALID_PAGE_RANGE", "PDF page numbers must be positive whole numbers.");
  }
  return parsed;
}

function publicHttpsUrl(value: unknown, label: string): string | null {
  if (value == null || value === "") return null;
  const rawValue = text(value, 2000);
  let parsed: URL;
  try {
    parsed = new URL(rawValue);
  } catch {
    throw new CurrentAffairsIngestionError("INVALID_URL", `${label} must be a valid HTTPS URL.`);
  }
  if (parsed.protocol !== "https:") {
    throw new CurrentAffairsIngestionError("INVALID_URL", `${label} must use HTTPS.`);
  }
  const host = parsed.hostname.toLowerCase();
  const blocked =
    host === "localhost" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".local") ||
    host === "169.254.169.254" ||
    host === "metadata.google.internal" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host);
  if (blocked) {
    throw new CurrentAffairsIngestionError("PRIVATE_NETWORK_URL_BLOCKED", `${label} cannot point to a private-network host.`);
  }
  parsed.hash = "";
  return parsed.toString();
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CurrentAffairsIngestionError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: "CURRENT_AFFAIRS_INGESTION_FAILED" });
}

async function loadSource(sourceKey: string) {
  const rows = await sqlClient`
    SELECT
      id::text AS id,
      source_key AS "sourceKey",
      name,
      source_type AS "sourceType",
      base_url AS "baseUrl",
      feed_url AS "feedUrl",
      trust_score::float8 AS "trustScore",
      is_primary_source AS "isPrimarySource",
      is_active AS "isActive",
      content_policy AS "contentPolicy",
      ingestion_mode AS "ingestionMode",
      allow_raw_text_persistence AS "allowRawTextPersistence"
    FROM content.current_affairs_sources
    WHERE source_key = ${sourceKey}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

router.use(authenticate);

router.get("/ingestion/recommended-sources", requireAdminPermission("content.questions.read"), (_req, res) => {
  res.json({
    sources: [
      {
        sourceKey: "the_hindu",
        name: "The Hindu",
        sourceType: "newspaper",
        baseUrl: "https://www.thehindu.com/",
        contentPolicy: "discovery_only",
        ingestionMode: "pdf",
        isPrimarySource: false,
        note: "Use for discovery and research. Verify exam facts against primary or independently corroborating sources before publication.",
      },
      {
        sourceKey: "rbi",
        name: "Reserve Bank of India",
        sourceType: "regulator",
        baseUrl: "https://www.rbi.org.in/",
        contentPolicy: "primary_facts",
        ingestionMode: "feed",
        isPrimarySource: true,
      },
      {
        sourceKey: "pib",
        name: "Press Information Bureau",
        sourceType: "official",
        baseUrl: "https://pib.gov.in/",
        contentPolicy: "primary_facts",
        ingestionMode: "feed",
        isPrimarySource: true,
      },
      {
        sourceKey: "punjab_gov",
        name: "Government of Punjab",
        sourceType: "state_government",
        baseUrl: "https://punjab.gov.in/",
        contentPolicy: "primary_facts",
        ingestionMode: "feed",
        isPrimarySource: true,
      },
    ],
    rawTextPersistence: false,
  });
});

router.patch("/ingestion/sources/:sourceKey/policy", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const sourceKey = text(req.params.sourceKey, 80).toLowerCase();
    if (!sourceKeyPattern.test(sourceKey)) {
      throw new CurrentAffairsIngestionError("INVALID_SOURCE_KEY", "Source key is invalid.");
    }
    const current = await loadSource(sourceKey);
    if (!current) throw new CurrentAffairsIngestionError("SOURCE_NOT_FOUND", "Current-affairs source not found.", 404);
    const contentPolicy = text(req.body?.contentPolicy, 40).toLowerCase();
    const ingestionMode = text(req.body?.ingestionMode, 40).toLowerCase();
    if (!contentPolicies.has(contentPolicy)) {
      throw new CurrentAffairsIngestionError("INVALID_CONTENT_POLICY", "Choose a supported content policy.");
    }
    if (!ingestionModes.has(ingestionMode)) {
      throw new CurrentAffairsIngestionError("INVALID_INGESTION_MODE", "Choose a supported ingestion mode.");
    }
    const feedUrl = req.body?.feedUrl === null || req.body?.feedUrl === ""
      ? null
      : req.body?.feedUrl === undefined
        ? current.feedUrl
        : publicHttpsUrl(req.body.feedUrl, "Feed URL");
    if ((ingestionMode === "feed" || ingestionMode === "feed_and_pdf") && !feedUrl) {
      throw new CurrentAffairsIngestionError("FEED_URL_REQUIRED", "Feed ingestion requires a registered HTTPS feed URL.");
    }

    await sqlClient`
      UPDATE content.current_affairs_sources
      SET content_policy = ${contentPolicy},
          ingestion_mode = ${ingestionMode},
          feed_url = ${feedUrl},
          allow_raw_text_persistence = false,
          updated_at = now()
      WHERE source_key = ${sourceKey}
    `;
    res.json({ source: await loadSource(sourceKey) });
  } catch (error) {
    sendError(res, error, "Unable to update current-affairs ingestion policy");
  }
});

router.post("/ingestion/pull/:sourceKey", requireAdminPermission("content.questions.update"), async (req, res) => {
  try {
    const sourceKey = text(req.params.sourceKey, 80).toLowerCase();
    if (!sourceKeyPattern.test(sourceKey)) {
      throw new CurrentAffairsIngestionError("INVALID_SOURCE_KEY", "Source key is invalid.");
    }
    const source = await loadSource(sourceKey) as Record<string, unknown> | null;
    if (!source || !source.isActive) {
      throw new CurrentAffairsIngestionError("SOURCE_UNAVAILABLE", "Choose an active registered source.", 404);
    }
    if (!["feed", "feed_and_pdf"].includes(String(source.ingestionMode))) {
      throw new CurrentAffairsIngestionError("FEED_INGESTION_DISABLED", "Feed ingestion is disabled for this source.", 409);
    }
    const feedUrl = publicHttpsUrl(source.feedUrl, "Feed URL");
    if (!feedUrl) throw new CurrentAffairsIngestionError("FEED_URL_REQUIRED", "This source has no feed URL.", 409);

    const response = await fetch(feedUrl, {
      headers: {
        accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, text/plain;q=0.5",
        "user-agent": "Examtree-Current-Affairs-Studio/1.0",
      },
      redirect: "error",
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new CurrentAffairsIngestionError("FEED_FETCH_FAILED", `Feed returned HTTP ${response.status}.`, 502);
    }
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > MAX_FEED_BYTES) {
      throw new CurrentAffairsIngestionError("FEED_TOO_LARGE", "Feed is larger than the ingestion limit.", 413);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > MAX_FEED_BYTES) {
      throw new CurrentAffairsIngestionError("FEED_TOO_LARGE", "Feed is larger than the ingestion limit.", 413);
    }
    const entries = parseSyndicationFeed(buffer.toString("utf8"), feedUrl);
    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const entry of entries) {
      const dedupeKey = sourceCandidateDedupeKey(sourceKey, entry.link, entry.title);
      const payload = {
        ingestionChannel: "feed",
        discoveryKeywords: discoveryKeywords(`${entry.title} ${entry.discoveryText ?? ""}`),
        sourceContentPolicy: source.contentPolicy,
        rawTextPersisted: false,
      };
      const rows = await sqlClient`
        INSERT INTO content.current_affairs_ingestion_candidates (
          id, source_id, source_url, source_document_id, external_id,
          raw_title, raw_summary, published_at, dedupe_key, status,
          payload, created_at, updated_at
        ) VALUES (
          ${randomUUID()}::uuid,
          ${String(source.id)}::uuid,
          ${entry.link},
          null,
          ${entry.id ?? null},
          ${entry.title},
          '',
          ${entry.publishedAt ?? null},
          ${dedupeKey},
          'queued',
          ${JSON.stringify(payload)},
          now(),
          now()
        )
        ON CONFLICT (source_url) DO UPDATE
        SET raw_title = EXCLUDED.raw_title,
            published_at = COALESCE(EXCLUDED.published_at, content.current_affairs_ingestion_candidates.published_at),
            dedupe_key = EXCLUDED.dedupe_key,
            payload = EXCLUDED.payload,
            updated_at = now()
        RETURNING (xmax = 0) AS inserted
      `;
      if (!rows[0]) {
        skipped += 1;
      } else if (rows[0].inserted) {
        created += 1;
      } else {
        updated += 1;
      }
    }

    res.json({
      sourceKey,
      feedUrl,
      entriesSeen: entries.length,
      created,
      updated,
      skipped,
      rawTextPersisted: false,
      pulledAt: new Date().toISOString(),
    });
  } catch (error) {
    sendError(res, error, "Unable to pull current-affairs feed");
  }
});

router.get("/research-documents", requireAdminPermission("content.questions.read"), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        document.id::text AS id,
        source.source_key AS "sourceKey",
        source.name AS "sourceName",
        document.file_name AS "fileName",
        document.sha256,
        document.publication_date AS "publicationDate",
        document.origin_url AS "originUrl",
        document.rights_basis AS "rightsBasis",
        document.status,
        document.extraction_metadata AS "extractionMetadata",
        document.signal_count AS "signalCount",
        document.raw_text_persisted AS "rawTextPersisted",
        document.failure_reason AS "failureReason",
        document.created_at AS "createdAt"
      FROM content.current_affairs_research_documents document
      JOIN content.current_affairs_sources source ON source.id = document.source_id
      ORDER BY document.created_at DESC
      LIMIT 200
    `;
    res.json({ documents: rows });
  } catch (error) {
    sendError(res, error, "Unable to load current-affairs research documents");
  }
});

router.post(
  "/research-documents/pdf",
  requireAdminPermission("content.questions.update"),
  raw({ type: ["application/pdf", "application/octet-stream"], limit: "30mb" }),
  async (req, res) => {
    const actorUserId = req.adminSession?.user.id;
    let documentId: string | null = null;
    try {
      if (!actorUserId) throw new CurrentAffairsIngestionError("ADMIN_SESSION_REQUIRED", "Administrator session required.", 403);
      if (!Buffer.isBuffer(req.body) || req.body.byteLength === 0) {
        throw new CurrentAffairsIngestionError("PDF_BODY_REQUIRED", "Send the newspaper PDF as the request body using application/pdf.");
      }
      const sourceKey = text(req.query.sourceKey, 80).toLowerCase();
      if (!sourceKeyPattern.test(sourceKey)) {
        throw new CurrentAffairsIngestionError("INVALID_SOURCE_KEY", "Source key is invalid.");
      }
      const source = await loadSource(sourceKey) as Record<string, unknown> | null;
      if (!source || !source.isActive) {
        throw new CurrentAffairsIngestionError("SOURCE_UNAVAILABLE", "Choose an active registered source.", 404);
      }
      if (!["pdf", "feed_and_pdf", "manual"].includes(String(source.ingestionMode))) {
        throw new CurrentAffairsIngestionError("PDF_INGESTION_DISABLED", "PDF research ingestion is disabled for this source.", 409);
      }

      const rightsBasis = text(req.query.rightsBasis, 40).toLowerCase() || "user_supplied";
      if (!rightsBases.has(rightsBasis)) {
        throw new CurrentAffairsIngestionError("INVALID_RIGHTS_BASIS", "Choose user_supplied, licensed, public_domain or publisher_authorized.");
      }
      const publicationDate = dateOnly(req.query.publicationDate);
      const originUrl = publicHttpsUrl(req.query.originUrl, "Origin URL");
      const fileName = text(req.headers["x-file-name"], 240) || `newspaper-${publicationDate ?? "research"}.pdf`;
      const startPage = positiveInteger(req.query.startPage);
      const endPage = positiveInteger(req.query.endPage);
      const forceOcr = String(req.query.forceOcr ?? "").toLowerCase() === "true";
      const sha256 = createHash("sha256").update(req.body).digest("hex");

      const duplicate = await sqlClient`
        SELECT id::text AS id, status, signal_count AS "signalCount", extraction_metadata AS "extractionMetadata"
        FROM content.current_affairs_research_documents
        WHERE source_id = ${String(source.id)}::uuid AND sha256 = ${sha256}
        LIMIT 1
      `;
      if (duplicate[0]) {
        res.json({ document: duplicate[0], duplicate: true, rawTextPersisted: false });
        return;
      }

      documentId = randomUUID();
      await sqlClient`
        INSERT INTO content.current_affairs_research_documents (
          id, source_id, file_name, sha256, publication_date, origin_url,
          rights_basis, status, raw_text_persisted, created_by, created_at, updated_at
        ) VALUES (
          ${documentId}::uuid,
          ${String(source.id)}::uuid,
          ${fileName},
          ${sha256},
          ${publicationDate},
          ${originUrl},
          ${rightsBasis},
          'processing',
          false,
          ${actorUserId}::uuid,
          now(),
          now()
        )
      `;

      const extraction = await ingestPdfBuffer(req.body, {
        fileName,
        mimeType: "application/pdf",
        startPage,
        endPage,
        forceOcr,
      });
      const signals = extractResearchSignals(extraction.text);

      await sqlClient.begin(async (tx) => {
        for (const signal of signals) {
          const signalId = randomUUID();
          const candidateId = randomUUID();
          const dedupeKey = pdfCandidateDedupeKey(sourceKey, sha256, signal.headline);
          await tx`
            INSERT INTO content.current_affairs_ingestion_candidates (
              id, source_id, source_url, source_document_id, external_id,
              raw_title, raw_summary, published_at, dedupe_key, status,
              payload, created_at, updated_at
            ) VALUES (
              ${candidateId}::uuid,
              ${String(source.id)}::uuid,
              null,
              ${documentId}::uuid,
              ${`pdf:${sha256.slice(0, 16)}:${signal.fingerprint.slice(0, 16)}`},
              ${signal.headline},
              '',
              ${publicationDate ? `${publicationDate}T00:00:00.000Z` : null},
              ${dedupeKey},
              'queued',
              ${JSON.stringify({
                ingestionChannel: "research_pdf",
                researchDocumentId: documentId,
                categoryGuess: signal.categoryGuess,
                relevanceScore: signal.relevanceScore,
                discoveryKeywords: signal.keywords,
                sourceContentPolicy: source.contentPolicy,
                rawTextPersisted: false,
              })},
              now(),
              now()
            )
          `;
          await tx`
            INSERT INTO content.current_affairs_research_signals (
              id, document_id, headline, category_guess, relevance_score,
              keywords, signal_fingerprint, promoted_candidate_id, created_at
            ) VALUES (
              ${signalId}::uuid,
              ${documentId}::uuid,
              ${signal.headline},
              ${signal.categoryGuess},
              ${signal.relevanceScore},
              ${JSON.stringify(signal.keywords)},
              ${signal.fingerprint},
              ${candidateId}::uuid,
              now()
            )
          `;
        }

        await tx`
          UPDATE content.current_affairs_research_documents
          SET status = 'processed',
              extraction_metadata = ${JSON.stringify({
                ...extraction.metadata,
                rawTextPersisted: false,
                retentionPolicy: "derived_metadata_only",
              })},
              signal_count = ${signals.length},
              raw_text_persisted = false,
              updated_at = now()
          WHERE id = ${documentId}::uuid
        `;
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            'current_affairs.research_pdf.processed',
            'current_affairs_research_document',
            ${documentId}::uuid,
            ${`Rights basis: ${rightsBasis}`},
            ${`Processed research PDF into ${signals.length} Current Affairs discovery signals`},
            ${JSON.stringify({ sourceKey, publicationDate, extraction: extraction.metadata, rawTextPersisted: false })}
          )
        `;
      });

      res.status(201).json({
        document: {
          id: documentId,
          sourceKey,
          fileName,
          publicationDate,
          rightsBasis,
          sha256,
          extractionMetadata: extraction.metadata,
          signalCount: signals.length,
          rawTextPersisted: false,
        },
        signals: signals.slice(0, 30),
      });
    } catch (error) {
      if (documentId) {
        const reason = error instanceof Error ? error.message.slice(0, 1000) : "Unknown PDF ingestion failure";
        try {
          await sqlClient`
            UPDATE content.current_affairs_research_documents
            SET status = 'failed', failure_reason = ${reason}, raw_text_persisted = false, updated_at = now()
            WHERE id = ${documentId}::uuid
          `;
        } catch (updateError) {
          console.error("Unable to mark research PDF as failed", updateError);
        }
      }
      sendError(res, error, "Unable to process current-affairs research PDF");
    }
  },
);

router.get("/research-documents/:id/signals", requireAdminPermission("content.questions.read"), async (req, res) => {
  try {
    const id = text(req.params.id, 80);
    if (!/^[0-9a-f-]{36}$/i.test(id)) {
      throw new CurrentAffairsIngestionError("INVALID_DOCUMENT_ID", "Research document ID is invalid.");
    }
    const rows = await sqlClient`
      SELECT
        signal.id::text AS id,
        signal.headline,
        signal.category_guess AS "categoryGuess",
        signal.relevance_score AS "relevanceScore",
        signal.keywords,
        signal.promoted_candidate_id::text AS "candidateId",
        signal.created_at AS "createdAt"
      FROM content.current_affairs_research_signals signal
      WHERE signal.document_id = ${id}::uuid
      ORDER BY signal.relevance_score DESC, signal.created_at
    `;
    res.json({ signals: rows });
  } catch (error) {
    sendError(res, error, "Unable to load research-document signals");
  }
});

export default router;
