import type {
  KnowledgeFactType,
} from "../../generators/knowledge/types";
import type {
  AIExtractionRequest,
} from "./ai-extraction-service";

export function buildExtractionSystemPrompt(
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

export function buildExtractionUserPrompt(
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

export function buildExtractionJsonSchema(
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

