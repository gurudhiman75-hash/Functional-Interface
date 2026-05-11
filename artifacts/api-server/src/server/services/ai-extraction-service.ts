import {
  openai,
  requireOpenAIApiKey,
} from "../../lib/openai";
import type {
  KnowledgeDifficulty,
  KnowledgeFactType,
  KnowledgeSubject,
} from "../../generators/knowledge/types";

export type AIExtractionKind =
  | "gk-facts"
  | "pyq"
  | "quant-motifs"
  | "reasoning-motifs";

export type AIExtractedFactPayload = {
  rawText: string;
  subject: KnowledgeSubject;
  topic: string;
  subtopic: string;
  factType: KnowledgeFactType;
  contextGroupId: string;
  entityEn: string;
  entityHi: string;
  entityPa: string;
  factEn: string;
  factHi: string;
  factPa: string;
  detailEn: string;
  difficulty: KnowledgeDifficulty;
  examTags: string[];
  tags: string[];
  sequenceIndex: number;
  sourcePage: number;
  confidence: number;
  extractionNotes: string[];
};

export type AIExtractionRequest = {
  rawText: string;
  sourceName: string;
  sourceBook?: string;
  sourceChapter?: string;
  sourcePage?: number;
  sourceUrl?: string;
  allowedFactTypes: KnowledgeFactType[];
  extractionKind?: AIExtractionKind;
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

export type AIExtractionMetadata = {
  provider: "openai";
  model: string;
  extractionKind: AIExtractionKind;
  chunkCount: number;
  attemptedChunks: number;
  failedChunks: number;
  maxChunkCount: number;
  maxDocumentChars: number;
  sourceType?: string;
  ocrUsed?: boolean;
  pageCount?: number;
  totalPages?: number;
  selectedStartPage?: number;
  selectedEndPage?: number;
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  warnings: string[];
};

export type AIExtractionResult = {
  candidates: AIExtractedFactPayload[];
  metadata: AIExtractionMetadata;
};

const DEFAULT_MODEL =
  process.env[
    "OPENAI_KNOWLEDGE_EXTRACTION_MODEL"
  ] ?? "gpt-4.1-mini";

const DEFAULT_CHUNK_SIZE =
  Number(
    process.env[
      "OPENAI_EXTRACTION_CHUNK_CHARS"
    ],
  ) || 5000;

const MAX_CHUNK_COUNT =
  Number(
    process.env[
      "OPENAI_EXTRACTION_MAX_CHUNKS"
    ],
  ) || 12;

const MAX_DOCUMENT_CHARS =
  Number(
    process.env[
      "OPENAI_EXTRACTION_MAX_CHARS"
    ],
  ) || 120_000;

const OPENAI_TIMEOUT_MS =
  Number(
    process.env[
      "OPENAI_EXTRACTION_TIMEOUT_MS"
    ],
  ) || 60_000;

const MAX_RETRIES =
  Number(
    process.env[
      "OPENAI_EXTRACTION_RETRIES"
    ],
  ) || 2;

function delay(ms: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms),
  );
}

function trimForSafety(text: string) {
  const normalized = text
    .normalize("NFC")
    .replace(/\r\n/g, "\n")
    .trim();

  return normalized.length >
    MAX_DOCUMENT_CHARS
    ? normalized.slice(
        0,
        MAX_DOCUMENT_CHARS,
      )
    : normalized;
}

function splitLargeSegment(
  segment: string,
  targetSize: number,
) {
  const chunks: string[] = [];
  let cursor = 0;

  while (cursor < segment.length) {
    const hardEnd = Math.min(
      cursor + targetSize,
      segment.length,
    );
    const slice = segment.slice(
      cursor,
      hardEnd,
    );
    const softBreak = Math.max(
      slice.lastIndexOf("\n"),
      slice.lastIndexOf(". "),
      slice.lastIndexOf("; "),
    );
    const end =
      softBreak > targetSize * 0.55
        ? cursor + softBreak + 1
        : hardEnd;

    chunks.push(
      segment.slice(cursor, end).trim(),
    );
    cursor = end;
  }

  return chunks.filter(Boolean);
}

export function chunkDocumentText(
  rawText: string,
  targetSize = DEFAULT_CHUNK_SIZE,
) {
  const safeText =
    trimForSafety(rawText);
  const sections = safeText
    .split(
      /\n\s*(?:chapter|section|unit|part)\s+[\w\d .:-]+\n/gi,
    )
    .flatMap((section) =>
      section.split(/\f+/g),
    )
    .flatMap((section) =>
      section.split(/\n{3,}/g),
    )
    .map((section) => section.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  let current = "";

  for (const section of sections) {
    if (section.length > targetSize) {
      if (current.trim()) {
        chunks.push(current.trim());
        current = "";
      }
      chunks.push(
        ...splitLargeSegment(
          section,
          targetSize,
        ),
      );
      continue;
    }

    const next = current
      ? `${current}\n\n${section}`
      : section;
    if (next.length > targetSize) {
      chunks.push(current.trim());
      current = section;
    } else {
      current = next;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks
    .filter(Boolean)
    .slice(0, MAX_CHUNK_COUNT);
}

function buildSystemPrompt(
  request: AIExtractionRequest,
) {
  return [
    "You are ExamTree's deterministic content extraction service.",
    "Extract structured candidates only. Do not generate questions unless the extraction kind asks for PYQ preservation metadata.",
    "Do not infer missing facts. If uncertain, lower confidence and add an extraction note.",
    "Preserve math expressions and exact dates/entities.",
    "Return JSON that matches the provided schema exactly.",
    `Extraction kind: ${request.extractionKind ?? "gk-facts"}`,
    `Source: ${request.sourceName}`,
    `Allowed fact types: ${request.allowedFactTypes.join(", ")}`,
  ].join("\n");
}

function buildUserPrompt(
  chunk: string,
  index: number,
  total: number,
  request: AIExtractionRequest,
) {
  return [
    `Chunk ${index + 1} of ${total}.`,
    request.sourceBook
      ? `Book/source: ${request.sourceBook}`
      : "",
    request.sourceChapter
      ? `Chapter: ${request.sourceChapter}`
      : "",
    request.sourcePage
      ? `Starting page: ${request.sourcePage}`
      : "",
    "Extract 3-12 atomic candidates from this chunk.",
    "For multilingual labels: use native labels only if present or obvious standard terminology; otherwise repeat English and mark for review.",
    "Text:",
    chunk,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function responseText(response: any) {
  if (
    typeof response?.output_text ===
    "string"
  ) {
    return response.output_text;
  }

  const fragments: string[] = [];
  for (const item of response?.output ?? []) {
    for (const content of item.content ??
      []) {
      if (
        typeof content.text === "string"
      ) {
        fragments.push(content.text);
      }
    }
  }
  return fragments.join("\n");
}

function parseCandidates(
  text: string,
): AIExtractedFactPayload[] {
  const parsed = JSON.parse(text);
  return Array.isArray(parsed.candidates)
    ? parsed.candidates
    : [];
}

function usageFromResponse(response: any) {
  return {
    inputTokens:
      Number(
        response?.usage?.input_tokens,
      ) || 0,
    outputTokens:
      Number(
        response?.usage?.output_tokens,
      ) || 0,
    totalTokens:
      Number(
        response?.usage?.total_tokens,
      ) || 0,
  };
}

function describeOpenAIError(error: unknown) {
  const err = error as {
    message?: string;
    code?: string;
    status?: number;
    cause?: {
      message?: string;
      code?: string;
    };
  };
  const parts = [
    err.status
      ? `status ${err.status}`
      : "",
    err.code ? `code ${err.code}` : "",
    err.message ?? String(error),
    err.cause?.code
      ? `cause ${err.cause.code}`
      : "",
    err.cause?.message,
  ].filter(Boolean);
  const raw = parts.join(" - ");

  if (/connection error/i.test(raw)) {
    return [
      "OpenAI connection failed.",
      "Check backend internet access, proxy/firewall rules, OPENAI_API_KEY, and OPENAI_BASE_URL if you use a gateway.",
    ].join(" ");
  }

  return raw;
}

function extractionJsonSchema(
  allowedFactTypes: KnowledgeFactType[],
) {
  return {
    type: "object",
    additionalProperties: false,
    required: ["candidates"],
    properties: {
      candidates: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "rawText",
            "subject",
            "topic",
            "subtopic",
            "factType",
            "contextGroupId",
            "entityEn",
            "entityHi",
            "entityPa",
            "factEn",
            "factHi",
            "factPa",
            "detailEn",
            "difficulty",
            "examTags",
            "tags",
            "sequenceIndex",
            "sourcePage",
            "confidence",
            "extractionNotes",
          ],
          properties: {
            rawText: { type: "string" },
            subject: {
              type: "string",
              enum: [
                "India GK",
                "Punjab GK",
                "Static GK",
                "Banking Awareness",
                "Current Affairs",
                "Computer Awareness",
              ],
            },
            topic: { type: "string" },
            subtopic: { type: "string" },
            factType: {
              type: "string",
              enum: allowedFactTypes,
            },
            contextGroupId: {
              type: "string",
            },
            entityEn: { type: "string" },
            entityHi: { type: "string" },
            entityPa: { type: "string" },
            factEn: { type: "string" },
            factHi: { type: "string" },
            factPa: { type: "string" },
            detailEn: { type: "string" },
            difficulty: {
              type: "string",
              enum: [
                "easy",
                "moderate",
                "hard",
              ],
            },
            examTags: {
              type: "array",
              items: { type: "string" },
            },
            tags: {
              type: "array",
              items: { type: "string" },
            },
            sequenceIndex: {
              type: "integer",
            },
            sourcePage: {
              type: "integer",
            },
            confidence: {
              type: "number",
            },
            extractionNotes: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
    },
  };
}

async function extractChunk(
  request: AIExtractionRequest,
  chunk: string,
  index: number,
  total: number,
) {
  const payload = {
    model:
      request.model ?? DEFAULT_MODEL,
    input: [
      {
        role: "system",
        content:
          buildSystemPrompt(request),
      },
      {
        role: "user",
        content: buildUserPrompt(
          chunk,
          index,
          total,
          request,
        ),
      },
    ],
    temperature: 0,
    text: {
      format: {
        type: "json_schema",
        name: "examtree_extraction_candidates",
        strict: true,
        schema: extractionJsonSchema(
          request.allowedFactTypes,
        ),
      },
    },
  };

  let lastError: unknown;
  for (
    let attempt = 0;
    attempt <= MAX_RETRIES;
    attempt += 1
  ) {
    try {
      const response =
        await openai.responses.create(
          payload as any,
          {
            timeout: OPENAI_TIMEOUT_MS,
            maxRetries: 0,
          } as any,
        );
      return {
        candidates: parseCandidates(
          responseText(response),
        ),
        usage:
          usageFromResponse(response),
      };
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await delay(
          750 * (attempt + 1),
        );
      }
    }
  }

  throw lastError;
}

export async function extractStructuredKnowledgeWithOpenAI(
  request: AIExtractionRequest,
): Promise<AIExtractionResult> {
  requireOpenAIApiKey();

  const chunks = chunkDocumentText(
    request.rawText,
  );
  if (!chunks.length) {
    return {
      candidates: [],
      metadata: {
        provider: "openai",
        model:
          request.model ?? DEFAULT_MODEL,
        extractionKind:
          request.extractionKind ??
          "gk-facts",
        chunkCount: 0,
        attemptedChunks: 0,
        failedChunks: 0,
        maxChunkCount: MAX_CHUNK_COUNT,
        maxDocumentChars:
          MAX_DOCUMENT_CHARS,
        sourceType:
          request.sourceMetadata
            ?.sourceType,
        ocrUsed:
          request.sourceMetadata
            ?.ocrUsed,
        pageCount:
          request.sourceMetadata
            ?.pageCount,
        totalPages:
          request.sourceMetadata
            ?.totalPages,
        selectedStartPage:
          request.sourceMetadata
            ?.selectedStartPage,
        selectedEndPage:
          request.sourceMetadata
            ?.selectedEndPage,
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        },
        warnings: [
          "No extractable text chunks were found.",
        ],
      },
    };
  }

  const candidates: AIExtractedFactPayload[] =
    [];
  const warnings: string[] = [];
  const usage = {
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
  };
  let failedChunks = 0;

  for (const [index, chunk] of chunks.entries()) {
    try {
      const result = await extractChunk(
        request,
        chunk,
        index,
        chunks.length,
      );
      candidates.push(
        ...result.candidates,
      );
      usage.inputTokens +=
        result.usage.inputTokens;
      usage.outputTokens +=
        result.usage.outputTokens;
      usage.totalTokens +=
        result.usage.totalTokens;
    } catch (error) {
      failedChunks += 1;
      warnings.push(
        `Chunk ${index + 1} failed: ${
          describeOpenAIError(error)
        }`,
      );
    }
  }

  if (
    chunks.length > 0 &&
    failedChunks === chunks.length
  ) {
    const firstFailure =
      warnings[0]?.replace(
        /^Chunk \d+ failed:\s*/,
        "",
      ) ??
      "OpenAI extraction failed for every chunk.";
    warnings.splice(
      0,
      warnings.length,
      firstFailure,
      "AI extraction did not produce candidates; offline heuristic extraction will be used for staging. Verify carefully before saving.",
    );
  }

  console.info(
    "[knowledge-ai-extraction]",
    {
      model:
        request.model ?? DEFAULT_MODEL,
      chunkCount: chunks.length,
      candidateCount:
        candidates.length,
      failedChunks,
      usage,
    },
  );

  return {
    candidates,
    metadata: {
      provider: "openai",
      model:
        request.model ?? DEFAULT_MODEL,
      extractionKind:
        request.extractionKind ??
        "gk-facts",
      chunkCount: chunks.length,
      attemptedChunks: chunks.length,
      failedChunks,
      maxChunkCount: MAX_CHUNK_COUNT,
      maxDocumentChars:
        MAX_DOCUMENT_CHARS,
      sourceType:
        request.sourceMetadata
          ?.sourceType,
      ocrUsed:
        request.sourceMetadata?.ocrUsed,
      pageCount:
        request.sourceMetadata
          ?.pageCount,
      totalPages:
        request.sourceMetadata
          ?.totalPages,
      selectedStartPage:
        request.sourceMetadata
          ?.selectedStartPage,
      selectedEndPage:
        request.sourceMetadata
          ?.selectedEndPage,
      usage,
      warnings,
    },
  };
}
