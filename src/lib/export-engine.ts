export type QuestionExportFormat = "pdf" | "docx" | "json" | "csv" | "txt";

export type QuestionExportContent =
  | "questions"
  | "answers"
  | "explanations"
  | "reasoning"
  | "traceability";

export type QuestionExportOptions = {
  format: QuestionExportFormat;
  content: QuestionExportContent;
  cleanExport?: boolean;
  includeAnswers?: boolean;
  includeExplanations?: boolean;
  includeReasoningGraph?: boolean;
  includeTraceability?: boolean;
  includeMetadata?: boolean;
  title?: string;
  language?: string;
  generatedAt?: Date;
};

export type QuestionStudioExportItem = {
  text?: string;
  options?: string[] | null;
  correct?: number | null;
  answer?: unknown;
  explanation?: string;
  reasoningGraph?: unknown;
  traceability?: unknown;
  semanticMetadata?: unknown;
  validation?: unknown;
  section?: string;
  topic?: string;
  subtopic?: string;
  packageId?: string | null;
  patternId?: string | null;
  canonicalProblemId?: string | null;
  questionLanguageId?: string | null;
  explanationId?: string | null;
  taskKind?: string | null;
  difficulty?: string | null;
  difficultyLabel?: string | null;
  language?: string | null;
  questionId?: string | null;
  scenarioId?: string | null;
  seed?: string | null;
  questionIndex?: number | null;
  questionCount?: number | null;
  packageSource?: string | null;
  generationBackend?: string | null;
  proceduralLogic?: unknown;
  debugMetadata?: Record<string, unknown>;
  [key: string]: unknown;
};

type ValidationCheckSummary = {
  name: string;
  passed: boolean;
  message: string;
  originalMessage?: string;
};

type ValidationSummary = {
  valid: boolean | null;
  status: "passed" | "failed" | "unknown";
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  messageAuditWarnings?: string[];
  checks?: ValidationCheckSummary[];
};

type NormalizedQuestion = {
  questionNo: number;
  question: string;
  options: string[];
  correct: number | null;
  answer: string;
  explanation: string;
  reasoningGraph: unknown;
  traceability: unknown;
  semanticMetadata: unknown;
  validation: unknown;
  validationSummary: ValidationSummary;
  metadata: Record<string, unknown>;
  raw: QuestionStudioExportItem;
};

const MIME_TYPES: Record<QuestionExportFormat, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  json: "application/json;charset=utf-8",
  csv: "text/csv;charset=utf-8",
  txt: "text/plain;charset=utf-8",
};

const FILE_EXTENSIONS: Record<QuestionExportFormat, string> = {
  pdf: "pdf",
  docx: "docx",
  json: "json",
  csv: "csv",
  txt: "txt",
};

function asText(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function getDebugValue(
  item: QuestionStudioExportItem,
  key: string,
) {
  return item.debugMetadata?.[key];
}

function normalizeOptionList(value: unknown) {
  return Array.isArray(value)
    ? value.map((option) => asText(option))
    : [];
}

function soundsLikeFailure(message: string) {
  return /\bmissing\b|\bleakage\b|\bbroken\b|\bduplicate\b|\billegal\b/i.test(
    message,
  );
}

function sanitizeValidationMessage(
  name: string,
  passed: boolean,
  message: string,
) {
  if (!passed || !soundsLikeFailure(message)) {
    return message;
  }

  if (name === "semanticDuplicates") {
    return "No duplicate semantic entities found.";
  }

  const translation = message.match(
    /^Missing translation for (.+)$/i,
  );
  if (translation) {
    return `Translation present for ${translation[1]}.`;
  }

  const leakage = message.match(
    /^Translation leakage in (.+)$/i,
  );
  if (leakage) {
    return `No translation leakage for ${leakage[1]}.`;
  }

  const unicode = message.match(
    /^Broken Unicode in (.+)$/i,
  );
  if (unicode) {
    return `Unicode valid for ${unicode[1]}.`;
  }

  return `Passed: ${message}`;
}

function summarizeValidation(
  validation: unknown,
  includeChecks = false,
): ValidationSummary {
  const report =
    validation &&
    typeof validation === "object"
      ? (validation as {
          valid?: unknown;
          checks?: Array<{
            name?: unknown;
            passed?: unknown;
            message?: unknown;
          }>;
        })
      : undefined;
  const checks = Array.isArray(report?.checks)
    ? report.checks
    : [];
  const messageAuditWarnings: string[] = [];
  const normalizedChecks = checks.map(
    (check) => {
      const name = asText(check?.name);
      const passed = Boolean(check?.passed);
      const originalMessage = asText(
        check?.message,
      );
      if (
        passed &&
        soundsLikeFailure(
          originalMessage,
        )
      ) {
        messageAuditWarnings.push(
          `${name}: ${originalMessage}`,
        );
      }
      return {
        name,
        passed,
        message:
          sanitizeValidationMessage(
            name,
            passed,
            originalMessage,
          ),
        originalMessage:
          includeChecks &&
          originalMessage !==
            sanitizeValidationMessage(
              name,
              passed,
              originalMessage,
            )
            ? originalMessage
            : undefined,
      };
    },
  );
  const passedChecks =
    normalizedChecks.filter(
      (check) => check.passed,
    ).length;
  const failedChecks =
    normalizedChecks.length -
    passedChecks;

  return {
    valid:
      typeof report?.valid === "boolean"
        ? report.valid
        : normalizedChecks.length
          ? failedChecks === 0
          : null,
    status:
      normalizedChecks.length === 0 &&
      typeof report?.valid !==
        "boolean"
        ? "unknown"
        : failedChecks === 0
          ? "passed"
          : "failed",
    totalChecks:
      normalizedChecks.length,
    passedChecks,
    failedChecks,
    messageAuditWarnings:
      includeChecks
        ? messageAuditWarnings
        : undefined,
    checks: includeChecks
      ? normalizedChecks
      : undefined,
  };
}

function normalizeQuestion(
  item: QuestionStudioExportItem,
  index: number,
  options: QuestionExportOptions,
): NormalizedQuestion {
  const validation =
    item.validation ??
    getDebugValue(item, "validatorReports");
  const includeDebug =
    shouldInclude(options, "reasoning") ||
    shouldInclude(options, "traceability");
  const validationSummary =
    summarizeValidation(
      validation,
      includeDebug,
    );
  const metadata = {
    subject:
      item.section ?? "Quant",
    topicGroup:
      item.topic ?? "Arithmetic",
    subtopic:
      item.subtopic ?? "",
    packageId:
      item.packageId ??
      item.patternId ??
      getDebugValue(item, "selectedArchetype") ??
      "",
    archetypeId:
      item.packageId ??
      item.patternId ??
      getDebugValue(item, "selectedArchetype") ??
      "",
    canonicalProblemId:
      item.canonicalProblemId ??
      getDebugValue(item, "canonicalProblemId") ??
      getDebugValue(item, "selectedMotif") ??
      "",
    questionLanguageId:
      item.questionLanguageId ??
      getDebugValue(item, "questionLanguageId") ??
      "",
    explanationId:
      item.explanationId ??
      getDebugValue(item, "explanationId") ??
      "",
    taskKind:
      item.taskKind ??
      getDebugValue(item, "taskKind") ??
      "",
    difficulty:
      item.difficultyLabel ??
      item.difficulty ??
      "",
    language:
      item.language ??
      options.language ??
      "",
    generationBackend:
      item.generationBackend ??
      getDebugValue(
        item,
        "generationDomain",
      ) ??
      "",
    questionId:
      item.questionId ??
      getDebugValue(item, "questionId") ??
      "",
    scenario:
      item.scenarioId ??
      getDebugValue(item, "scenarioId") ??
      "",
    validationStatus:
      validationSummary.status,
    seed:
      item.seed ??
      getDebugValue(item, "seed") ??
      "",
    generationTimestamp:
      options.generatedAt?.toISOString() ?? new Date().toISOString(),
    packageSource:
      item.packageSource ??
      getDebugValue(item, "packageSource") ??
      "",
  };

  return {
    questionNo: index + 1,
    question: asText(item.text),
    options: normalizeOptionList(
      item.options,
    ),
    correct:
      typeof item.correct === "number"
        ? item.correct
        : null,
    answer: asText(item.answer),
    explanation: asText(item.explanation),
    reasoningGraph: item.reasoningGraph ?? getDebugValue(item, "reasoningGraph"),
    traceability: item.traceability ?? getDebugValue(item, "traceability"),
    semanticMetadata:
      item.semanticMetadata ?? getDebugValue(item, "semanticMetadata"),
    validation,
    validationSummary,
    metadata,
    raw: item,
  };
}

function shouldInclude(
  options: QuestionExportOptions,
  section: "answers" | "explanations" | "reasoning" | "traceability",
) {
  const rank: Record<QuestionExportContent, number> = {
    questions: 0,
    answers: 1,
    explanations: 2,
    reasoning: 3,
    traceability: 4,
  };
  const sectionRank = {
    answers: 1,
    explanations: 2,
    reasoning: 3,
    traceability: 4,
  }[section];

  if (section === "answers" && options.includeAnswers) return true;
  if (section === "explanations" && options.includeExplanations) return true;
  if (section === "reasoning" && options.includeReasoningGraph) return true;
  if (section === "traceability" && options.includeTraceability) return true;

  return rank[options.content] >= sectionRank;
}

function escapeCsv(value: unknown) {
  const text = asText(value).replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatJson(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  return JSON.stringify(value, null, 2);
}

function buildTextBlocks(
  questions: NormalizedQuestion[],
  options: QuestionExportOptions,
) {
  const blocks = options.cleanExport
    ? []
    : [
        options.title ?? "Question Studio Export",
        `Generated: ${options.generatedAt?.toLocaleString() ?? new Date().toLocaleString()}`,
        `Count: ${questions.length}`,
        "",
      ];

  for (const question of questions) {
    if (!options.cleanExport) {
      blocks.push(`Question ${question.questionNo}`);
    }
    if (options.includeMetadata) {
      blocks.push(
        `Subject: ${question.metadata.subject}`,
        `Topic Group: ${question.metadata.topicGroup}`,
        `Subtopic: ${question.metadata.subtopic}`,
        `Package ID: ${question.metadata.packageId}`,
        `Archetype: ${question.metadata.archetypeId}`,
        `CP ID: ${question.metadata.canonicalProblemId}`,
        `QL ID: ${question.metadata.questionLanguageId}`,
        `Task Kind: ${question.metadata.taskKind}`,
        `Difficulty: ${question.metadata.difficulty}`,
        `Language: ${question.metadata.language}`,
        `Question ID: ${question.metadata.questionId}`,
        `Scenario: ${question.metadata.scenario}`,
        `Validation: ${question.validationSummary.status} (${question.validationSummary.passedChecks}/${question.validationSummary.totalChecks} checks passed)`,
        `Seed: ${question.metadata.seed}`,
      );
    }
    blocks.push(question.question);
    if (question.options.length) {
      blocks.push("Options:");
      question.options.forEach(
        (option, optionIndex) => {
          blocks.push(
            `${String.fromCharCode(65 + optionIndex)}. ${option}`,
          );
        },
      );
    }
    if (shouldInclude(options, "answers")) {
      blocks.push(`Answer: ${question.answer}`);
    }
    if (shouldInclude(options, "explanations")) {
      blocks.push("Explanation:", question.explanation);
    }
    if (shouldInclude(options, "reasoning")) {
      blocks.push("Reasoning Graph:", formatJson(question.reasoningGraph));
    }
    if (shouldInclude(options, "traceability")) {
      blocks.push(
        "Traceability:",
        formatJson(question.traceability),
        "Validation:",
        formatJson({
          summary:
            question.validationSummary,
          checks:
            question.validationSummary.checks,
        }),
        "Semantic Metadata:",
        formatJson(question.semanticMetadata),
      );
    }
    blocks.push("");
  }

  return blocks;
}

function makeTxt(questions: NormalizedQuestion[], options: QuestionExportOptions) {
  return new Blob([buildTextBlocks(questions, options).join("\n")], {
    type: MIME_TYPES.txt,
  });
}

function makeCsv(
  questions: NormalizedQuestion[],
  options: QuestionExportOptions,
) {
  const headers = options.cleanExport
    ? ["Question No", "Question", "Options", "Explanation"]
    : [
        "Question No",
        "Question",
        "Options",
        "Answer",
        "Explanation",
        "Package ID",
        "CP ID",
        "QL ID",
        "Task Kind",
        "Difficulty",
        "Language",
      ];
  const rows = questions.map((question) =>
    options.cleanExport
      ? [
          question.questionNo,
          question.question,
          question.options.join(" | "),
          question.explanation,
        ]
      : [
          question.questionNo,
          question.question,
          question.options.join(" | "),
          question.answer,
          question.explanation,
          question.metadata.packageId,
          question.metadata.canonicalProblemId,
          question.metadata.questionLanguageId,
          question.metadata.taskKind,
          question.metadata.difficulty,
          question.metadata.language,
        ],
  );
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(","))
    .join("\n");
  return new Blob([csv], { type: MIME_TYPES.csv });
}

function makeJson(questions: NormalizedQuestion[], options: QuestionExportOptions) {
  if (options.cleanExport) {
    return new Blob(
      [
        JSON.stringify(
          questions.map((question) => ({
            questionNo: question.questionNo,
            stem: question.question,
            options: question.options,
            explanation: question.explanation,
          })),
          null,
          2,
        ),
      ],
      { type: MIME_TYPES.json },
    );
  }

  const includeDebug =
    shouldInclude(options, "reasoning") ||
    shouldInclude(options, "traceability");
  const payload = {
    title: options.title ?? "Question Studio Export",
    generatedAt: options.generatedAt?.toISOString() ?? new Date().toISOString(),
    count: questions.length,
    content: options.content,
    questions: questions.map((question) => ({
      questionNo: question.questionNo,
      stem: question.question,
      options: question.options,
      correctIndex: question.correct,
      answer: question.answer,
      explanation: question.explanation,
      metadata: {
        subject: question.metadata.subject,
        topicGroup:
          question.metadata.topicGroup,
        subtopic:
          question.metadata.subtopic,
        packageId:
          question.metadata.packageId,
        archetypeId:
          question.metadata.archetypeId,
        canonicalProblemId:
          question.metadata.canonicalProblemId,
        questionLanguageId:
          question.metadata.questionLanguageId,
        explanationId:
          question.metadata.explanationId,
        taskKind:
          question.metadata.taskKind,
        difficulty:
          question.metadata.difficulty,
        language:
          question.metadata.language,
        generationBackend:
          question.metadata.generationBackend,
        packageSource:
          question.metadata.packageSource,
        questionId:
          question.metadata.questionId,
        seed: question.metadata.seed,
      },
      validationSummary:
        question.validationSummary,
      ...(includeDebug
        ? {
            debug: {
              reasoningGraph:
                question.reasoningGraph,
              traceability:
                question.traceability,
              semanticMetadata:
                question.semanticMetadata,
              validation: {
                summary:
                  question.validationSummary,
                raw: question.validation,
              },
              proceduralLogic:
                question.raw.proceduralLogic ??
                question.raw.logic ??
                null,
              sourceTrace:
                (
                  question.raw
                    .proceduralLogic as
                    | {
                        sourceTrace?: unknown;
                      }
                    | undefined
                )?.sourceTrace ??
                (
                  question.raw.logic as
                    | {
                        sourceTrace?: unknown;
                      }
                    | undefined
                )?.sourceTrace ??
                null,
            },
          }
        : {}),
    })),
  };

  return new Blob([JSON.stringify(payload, null, 2)], {
    type: MIME_TYPES.json,
  });
}

function crc32(bytes: Uint8Array) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function uint16(value: number) {
  return [value & 0xff, (value >>> 8) & 0xff];
}

function uint32(value: number) {
  return [
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ];
}

function makeZip(files: Array<{ name: string; data: string }>) {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encoder.encode(file.name);
    const dataBytes = encoder.encode(file.data);
    const crc = crc32(dataBytes);
    const localHeader = new Uint8Array([
      ...uint32(0x04034b50),
      ...uint16(20),
      ...uint16(0x0800),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(crc),
      ...uint32(dataBytes.length),
      ...uint32(dataBytes.length),
      ...uint16(nameBytes.length),
      ...uint16(0),
      ...nameBytes,
    ]);
    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array([
      ...uint32(0x02014b50),
      ...uint16(20),
      ...uint16(20),
      ...uint16(0x0800),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(crc),
      ...uint32(dataBytes.length),
      ...uint32(dataBytes.length),
      ...uint16(nameBytes.length),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint16(0),
      ...uint32(0),
      ...uint32(offset),
      ...nameBytes,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array([
    ...uint32(0x06054b50),
    ...uint16(0),
    ...uint16(0),
    ...uint16(files.length),
    ...uint16(files.length),
    ...uint32(centralSize),
    ...uint32(offset),
    ...uint16(0),
  ]);

  const archive = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const part of [...localParts, ...centralParts, end]) {
    archive.set(part, cursor);
    cursor += part.length;
  }

  return new Blob([archive.buffer], {
    type: MIME_TYPES.docx,
  });
}

function paragraph(text: string, style = "") {
  const safe = escapeXml(text);
  return `<w:p>${style}<w:r><w:t xml:space="preserve">${safe}</w:t></w:r></w:p>`;
}

function makeDocx(questions: NormalizedQuestion[], options: QuestionExportOptions) {
  const body = buildTextBlocks(questions, options)
    .flatMap((block) => block.split("\n"))
    .map((line, index) =>
      paragraph(
        line,
        index === 0
          ? '<w:pPr><w:pStyle w:val="Title"/></w:pPr>'
          : "",
      ),
    )
    .join("");
  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1080" w:right="1080" w:bottom="1080" w:left="1080"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  return makeZip([
    {
      name: "[Content_Types].xml",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
    },
    {
      name: "_rels/.rels",
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
    },
    {
      name: "word/document.xml",
      data: documentXml,
    },
  ]);
}

function pdfHexString(text: string) {
  const bytes = new Uint8Array((text.length + 1) * 2);
  bytes[0] = 0xfe;
  bytes[1] = 0xff;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    bytes[(index + 1) * 2] = (code >>> 8) & 0xff;
    bytes[(index + 1) * 2 + 1] = code & 0xff;
  }
  return `<${Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")}>`;
}

function wrapLine(text: string, limit = 86) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if ((current + " " + word).length > limit) {
      lines.push(current);
      current = word;
    } else {
      current += " " + word;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function makePdf(questions: NormalizedQuestion[], options: QuestionExportOptions) {
  const lines = buildTextBlocks(questions, options).flatMap((block) =>
    block ? wrapLine(block) : [""],
  );
  const pageCapacity = 45;
  const pages: string[][] = [];
  for (let index = 0; index < lines.length; index += pageCapacity) {
    pages.push(lines.slice(index, index + pageCapacity));
  }

  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const addObject = (content: string) => {
    objects.push(content);
    return objects.length;
  };

  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("PAGES_PLACEHOLDER");
  const fontId = addObject(
    "<< /Type /Font /Subtype /Type0 /BaseFont /NotoSans /Encoding /Identity-H /DescendantFonts [4 0 R] >>",
  );
  addObject(
    "<< /Type /Font /Subtype /CIDFontType2 /BaseFont /NotoSans /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor 5 0 R /W [0 [500]] >>",
  );
  addObject(
    "<< /Type /FontDescriptor /FontName /NotoSans /Flags 4 /FontBBox [-1000 -1000 1000 1000] /ItalicAngle 0 /Ascent 900 /Descent -250 /CapHeight 700 /StemV 80 >>",
  );

  for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    const pageLines = pages[pageIndex]!;
    const content = [
      "BT",
      "/F1 10 Tf",
      "50 790 Td",
      "14 TL",
      ...pageLines.map((line) => `${pdfHexString(line)} Tj T*`),
      `${pdfHexString(`Page ${pageIndex + 1} of ${pages.length}`)} Tj`,
      "ET",
    ].join("\n");
    const streamId = addObject(
      `<< /Length ${new TextEncoder().encode(content).length} >>\nstream\n${content}\nendstream`,
    );
    const pageId = addObject(
      `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 842] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${streamId} 0 R >>`,
    );
    pageObjectIds.push(pageId);
  }

  objects[pagesId - 1] =
    `<< /Type /Pages /Kids [${pageObjectIds
      .map((id) => `${id} 0 R`)
      .join(" ")}] /Count ${pageObjectIds.length} >>`;

  const encoder = new TextEncoder();
  let pdf = "%PDF-1.7\n";
  const offsets = [0];
  for (let index = 0; index < objects.length; index++) {
    offsets.push(encoder.encode(pdf).length);
    pdf += `${index + 1} 0 obj\n${objects[index]}\nendobj\n`;
  }
  const xrefOffset = encoder.encode(pdf).length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let index = 1; index < offsets.length; index++) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: MIME_TYPES.pdf });
}

export function createQuestionExport(
  items: QuestionStudioExportItem[],
  options: QuestionExportOptions,
) {
  const generatedAt = options.generatedAt ?? new Date();
  const resolvedOptions = {
    ...options,
    generatedAt,
    cleanExport: options.cleanExport ?? false,
    includeAnswers:
      options.includeAnswers ?? shouldInclude(options, "answers"),
    includeExplanations:
      options.includeExplanations ?? shouldInclude(options, "explanations"),
    includeReasoningGraph:
      options.includeReasoningGraph ?? shouldInclude(options, "reasoning"),
    includeTraceability:
      options.includeTraceability ?? shouldInclude(options, "traceability"),
    includeMetadata: options.includeMetadata ?? true,
  };
  if (resolvedOptions.cleanExport) {
    resolvedOptions.includeAnswers = false;
    resolvedOptions.includeExplanations = true;
    resolvedOptions.includeReasoningGraph = false;
    resolvedOptions.includeTraceability = false;
    resolvedOptions.includeMetadata = false;
  }
  const questions = items.map((item, index) =>
    normalizeQuestion(item, index, resolvedOptions),
  );
  const blob =
    resolvedOptions.format === "json"
      ? makeJson(questions, resolvedOptions)
      : resolvedOptions.format === "csv"
        ? makeCsv(questions, resolvedOptions)
        : resolvedOptions.format === "txt"
          ? makeTxt(questions, resolvedOptions)
          : resolvedOptions.format === "docx"
            ? makeDocx(questions, resolvedOptions)
            : makePdf(questions, resolvedOptions);

  return {
    blob,
    fileName: `question-studio-export-${generatedAt
      .toISOString()
      .replace(/[:.]/g, "-")}.${FILE_EXTENSIONS[resolvedOptions.format]}`,
    mimeType: MIME_TYPES[resolvedOptions.format],
    questionCount: questions.length,
  };
}

export function downloadQuestionExport(
  items: QuestionStudioExportItem[],
  options: QuestionExportOptions,
) {
  const exportResult = createQuestionExport(items, options);
  const url = URL.createObjectURL(exportResult.blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = exportResult.fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  return exportResult;
}
