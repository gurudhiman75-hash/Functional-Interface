import type {
  FactExtractionCandidate,
  KnowledgeDifficulty,
  KnowledgeFact,
  KnowledgeFactType,
  KnowledgeSubject,
} from "./types";

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export function buildFactExtractionPrompt(
  sourceName: string,
  allowedFactTypes: string[],
) {
  return [
    "Extract atomic GK facts only. Do not create questions.",
    "Do not infer missing values. Mark uncertain fields in extractionNotes.",
    "Return JSON candidates matching the ExamTree KnowledgeFact schema.",
    `Source: ${sourceName}`,
    `Allowed fact types: ${allowedFactTypes.join(", ")}`,
    "Every candidate must include entity labels, fact labels, topic/subtopic, contextGroupId, source metadata, and verification.reviewed=false.",
  ].join("\n");
}

export function createDraftFactCandidate(
  rawText: string,
  partial: Pick<
    KnowledgeFact,
    | "subject"
    | "topic"
    | "subtopic"
    | "factType"
    | "contextGroupId"
    | "data"
    | "source"
  > &
    Partial<KnowledgeFact>,
): FactExtractionCandidate {
  const entityId =
    partial.entityId ??
    slug(partial.data.entity.en);
  const factId =
    partial.factId ??
    `${slug(partial.factType)}_${entityId}`;

  return {
    candidateId: `draft_${factId}`,
    rawText,
    proposedFact: {
      factId,
      entityId,
      subject: partial.subject,
      topic: partial.topic,
      subtopic: partial.subtopic,
      factType: partial.factType,
      contextGroupId: partial.contextGroupId,
      sequenceIndex: partial.sequenceIndex,
      data: partial.data,
      aliases: partial.aliases,
      difficulty:
        partial.difficulty ?? "moderate",
      examTags: partial.examTags ?? [],
      tags: partial.tags ?? [],
      relations: partial.relations ?? [],
      distractorPool:
        partial.distractorPool ?? [],
      pyqMetadata:
        partial.pyqMetadata ?? {
          wasAsked: false,
          occurrences: [],
        },
      verification: {
        reviewed: false,
        confidence:
          partial.verification
            ?.confidence ?? 0.5,
      },
      source: partial.source,
      currentAffair:
        partial.currentAffair,
    },
    extractionNotes: [
      "Draft extracted candidate. Human verification required before repository save.",
    ],
    status: "needs_review",
  };
}

export function validateFactCandidate(
  fact: KnowledgeFact,
) {
  const issues: string[] = [];

  if (!fact.factId) issues.push("Missing factId.");
  if (!fact.entityId) issues.push("Missing entityId.");
  if (!fact.contextGroupId) issues.push("Missing contextGroupId.");
  if (!fact.data.entity.en || !fact.data.fact.en) {
    issues.push("Missing English entity/fact labels.");
  }
  if (!fact.source.book && !fact.source.url) {
    issues.push("Missing source book or URL.");
  }
  if (fact.verification.reviewed) {
    if (fact.verification.confidence < 0.75) {
      issues.push("Reviewed fact has low confidence.");
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

const DEFAULT_FACT_TYPES: KnowledgeFactType[] =
  [
    "constitution-article",
    "person-event",
    "person-title",
    "date-event",
    "location-fact",
    "river-state",
    "capital-state",
    "award-recipient",
    "organization-founder",
    "historical-event",
    "sports-achievement",
    "scheme-purpose",
    "scientific-discovery",
    "computer-hardware",
    "computer-software",
    "computer-networking",
    "computer-security",
  ];

type ExtractedFactPayload = {
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

type ExtractionRequest = {
  rawText: string;
  sourceName: string;
  sourceBook?: string;
  sourceChapter?: string;
  sourcePage?: number;
  sourceUrl?: string;
  allowedFactTypes?: KnowledgeFactType[];
};

function safeSubject(
  value: unknown,
): KnowledgeSubject {
  const allowed: KnowledgeSubject[] = [
    "India GK",
    "Punjab GK",
    "Static GK",
    "Banking Awareness",
    "Current Affairs",
    "Computer Awareness",
  ];
  return allowed.includes(
    value as KnowledgeSubject,
  )
    ? (value as KnowledgeSubject)
    : "Static GK";
}

function safeFactType(
  value: unknown,
): KnowledgeFactType {
  return DEFAULT_FACT_TYPES.includes(
    value as KnowledgeFactType,
  )
    ? (value as KnowledgeFactType)
    : "location-fact";
}

function safeDifficulty(
  value: unknown,
): KnowledgeDifficulty {
  if (value === "easy") return "easy";
  if (value === "hard") return "hard";
  return "moderate";
}

function normalizeExtractedPayload(
  payload: Partial<ExtractedFactPayload>,
  request: ExtractionRequest,
): ExtractedFactPayload | null {
  const entityEn = String(
    payload.entityEn ?? "",
  ).trim();
  const factEn = String(
    payload.factEn ?? "",
  ).trim();

  if (!entityEn || !factEn) {
    return null;
  }

  const topic = String(
    payload.topic ?? "General",
  ).trim();
  const subtopic = String(
    payload.subtopic ?? "Static Facts",
  ).trim();
  const factType = safeFactType(
    payload.factType,
  );

  return {
    rawText: String(
      payload.rawText ??
        request.rawText.slice(0, 280),
    ).trim(),
    subject: safeSubject(
      payload.subject,
    ),
    topic,
    subtopic,
    factType,
    contextGroupId:
      String(
        payload.contextGroupId ??
          `${slug(topic)}_${slug(subtopic)}`,
      ).trim() ||
      `${slug(topic)}_${slug(subtopic)}`,
    entityEn,
    entityHi:
      String(
        payload.entityHi ?? entityEn,
      ).trim() || entityEn,
    entityPa:
      String(
        payload.entityPa ?? entityEn,
      ).trim() || entityEn,
    factEn,
    factHi:
      String(
        payload.factHi ?? factEn,
      ).trim() || factEn,
    factPa:
      String(
        payload.factPa ?? factEn,
      ).trim() || factEn,
    detailEn: String(
      payload.detailEn ?? "",
    ).trim(),
    difficulty: safeDifficulty(
      payload.difficulty,
    ),
    examTags: Array.isArray(
      payload.examTags,
    )
      ? payload.examTags
          .map(String)
          .filter(Boolean)
      : [],
    tags: Array.isArray(payload.tags)
      ? payload.tags
          .map(String)
          .filter(Boolean)
      : [topic, subtopic].filter(Boolean),
    sequenceIndex:
      Number.isFinite(
        payload.sequenceIndex,
      )
        ? Number(payload.sequenceIndex)
        : 0,
    sourcePage: Number.isFinite(
      payload.sourcePage,
    )
      ? Number(payload.sourcePage)
      : 0,
    confidence:
      typeof payload.confidence ===
      "number"
        ? Math.max(
            0,
            Math.min(
              1,
              payload.confidence,
            ),
          )
        : 0.55,
    extractionNotes: Array.isArray(
      payload.extractionNotes,
    )
      ? payload.extractionNotes
          .map(String)
          .filter(Boolean)
      : [
          "AI candidate requires human verification.",
        ],
  };
}

function payloadToCandidate(
  payload: ExtractedFactPayload,
  request: ExtractionRequest,
): FactExtractionCandidate {
  return createDraftFactCandidate(
    payload.rawText,
    {
      subject: payload.subject,
      topic: payload.topic,
      subtopic: payload.subtopic,
      factType: payload.factType,
      contextGroupId:
        payload.contextGroupId,
      sequenceIndex:
        payload.sequenceIndex || undefined,
      data: {
        entity: {
          en: payload.entityEn,
          hi: payload.entityHi,
          pa: payload.entityPa,
        },
        fact: {
          en: payload.factEn,
          hi: payload.factHi,
          pa: payload.factPa,
        },
        detail: payload.detailEn
          ? {
              en: payload.detailEn,
              hi: payload.detailEn,
              pa: payload.detailEn,
            }
          : undefined,
      },
      source: {
        book:
          request.sourceBook ??
          request.sourceName,
        chapter:
          request.sourceChapter,
        url: request.sourceUrl,
        page:
          payload.sourcePage ||
          request.sourcePage ||
          undefined,
        note:
          "Extracted candidate; verify before using in exams.",
      },
      difficulty: payload.difficulty,
      examTags: payload.examTags,
      tags: payload.tags,
      verification: {
        reviewed: false,
        confidence:
          payload.confidence,
      },
    },
  );
}

function extractResponseText(
  response: any,
) {
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
        typeof content.text ===
        "string"
      ) {
        fragments.push(content.text);
      }
    }
  }
  return fragments.join("\n");
}

async function callOpenAIExtraction(
  request: ExtractionRequest,
): Promise<ExtractedFactPayload[]> {
  const apiKey =
    process.env["OPENAI_API_KEY"];

  if (!apiKey) {
    return [];
  }

  const allowedFactTypes =
    request.allowedFactTypes?.length
      ? request.allowedFactTypes
      : DEFAULT_FACT_TYPES;
  const prompt =
    buildFactExtractionPrompt(
      request.sourceName,
      allowedFactTypes,
    );
  const model =
    process.env[
      "OPENAI_KNOWLEDGE_EXTRACTION_MODEL"
    ] ?? "gpt-4o-mini";

  const response = await fetch(
    "https://api.openai.com/v1/responses",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: [
              "Return JSON only. Extract 3-12 atomic factual candidates.",
              "Preserve Hindi and Punjabi labels if present; otherwise leave them equal to English for human review.",
              request.rawText,
            ].join("\n\n"),
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "knowledge_fact_candidates",
            strict: true,
            schema: {
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
                      rawText: {
                        type: "string",
                      },
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
                      topic: {
                        type: "string",
                      },
                      subtopic: {
                        type: "string",
                      },
                      factType: {
                        type: "string",
                        enum: allowedFactTypes,
                      },
                      contextGroupId: {
                        type: "string",
                      },
                      entityEn: {
                        type: "string",
                      },
                      entityHi: {
                        type: "string",
                      },
                      entityPa: {
                        type: "string",
                      },
                      factEn: {
                        type: "string",
                      },
                      factHi: {
                        type: "string",
                      },
                      factPa: {
                        type: "string",
                      },
                      detailEn: {
                        type: "string",
                      },
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
                        items: {
                          type: "string",
                        },
                      },
                      tags: {
                        type: "array",
                        items: {
                          type: "string",
                        },
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
                        items: {
                          type: "string",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      }),
    },
  );

  if (!response.ok) {
    const detail =
      await response.text();
    throw new Error(
      `OpenAI extraction failed (${response.status}): ${detail}`,
    );
  }

  const json = await response.json();
  const text =
    extractResponseText(json);
  const parsed = JSON.parse(text);
  return Array.isArray(
    parsed.candidates,
  )
    ? parsed.candidates
    : [];
}

function heuristicExtract(
  request: ExtractionRequest,
): ExtractedFactPayload[] {
  const lines = request.rawText
    .split(/\r?\n|[.;]\s+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 8)
    .slice(0, 12);

  return lines
    .map((line) => {
      const article =
        line.match(
          /(Article|Art\.?)\s+(\d+[A-Z]?)/i,
        );
      if (article) {
        return {
          rawText: line,
          subject: "India GK" as KnowledgeSubject,
          topic: "Polity",
          subtopic:
            "Constitution Articles",
          factType:
            "constitution-article" as KnowledgeFactType,
          contextGroupId:
            "constitution_articles",
          entityEn: `Article ${article[2]}`,
          entityHi: `अनुच्छेद ${article[2]}`,
          entityPa: `ਆਰਟੀਕਲ ${article[2]}`,
          factEn: line
            .replace(article[0], "")
            .replace(/^[-:–\s]+/, "")
            .trim() || line,
          factHi: line,
          factPa: line,
          detailEn: line,
          difficulty:
            "moderate" as KnowledgeDifficulty,
          examTags: [],
          tags: [
            "Constitution",
            "Important Articles",
          ],
          sequenceIndex: Number(
            article[2].replace(
              /\D/g,
              "",
            ),
          ),
          sourcePage: 0,
          confidence: 0.45,
          extractionNotes: [
            "Offline heuristic extraction; verify carefully.",
          ],
        };
      }

      const year =
        line.match(/\b(1[5-9]\d{2}|20\d{2})\b/);
      if (year) {
        const event = line
          .replace(year[0], "")
          .replace(/^[-:–\s]+|[-:–\s]+$/g, "")
          .trim() || line;
        return {
          rawText: line,
          subject: "India GK" as KnowledgeSubject,
          topic: "History",
          subtopic: "Important Events",
          factType:
            "date-event" as KnowledgeFactType,
          contextGroupId:
            "important_dates",
          entityEn: event,
          entityHi: event,
          entityPa: event,
          factEn: year[0],
          factHi: year[0],
          factPa: year[0],
          detailEn: line,
          difficulty:
            "moderate" as KnowledgeDifficulty,
          examTags: [],
          tags: [
            "History",
            "Chronology",
          ],
          sequenceIndex: Number(year[0]),
          sourcePage: 0,
          confidence: 0.45,
          extractionNotes: [
            "Offline heuristic extraction; verify carefully.",
          ],
        };
      }

      return null;
    })
    .filter(
      (
        payload,
      ): payload is ExtractedFactPayload =>
        Boolean(payload),
    );
}

export async function extractFactCandidatesFromText(
  request: ExtractionRequest,
) {
  const payloads =
    (await callOpenAIExtraction(
      request,
    )) ??
    [];
  const sourcePayloads = payloads.length
    ? payloads
    : heuristicExtract(request);

  return sourcePayloads
    .map((payload) =>
      normalizeExtractedPayload(
        payload,
        request,
      ),
    )
    .filter(
      (
        payload,
      ): payload is ExtractedFactPayload =>
        Boolean(payload),
    )
    .map((payload) =>
      payloadToCandidate(
        payload,
        request,
      ),
    );
}
