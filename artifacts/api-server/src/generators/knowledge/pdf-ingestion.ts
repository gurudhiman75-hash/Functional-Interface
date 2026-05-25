import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export type PdfExtractionQuality =
  | "high"
  | "medium"
  | "low";

export type PdfIngestionMetadata = {
  sourceType: "pdf" | "text";
  fileName?: string;
  mimeType?: string;
  bytes: number;
  pageCount: number;
  totalPages?: number;
  selectedStartPage?: number;
  selectedEndPage?: number;
  selectedPageCount?: number;
  ocrUsed: boolean;
  ocrPages: number[];
  extractionQuality: PdfExtractionQuality;
  charCount: number;
  wordCount: number;
  warnings: string[];
};

export type PdfIngestionResult = {
  text: string;
  rawText: string;
  metadata: PdfIngestionMetadata;
};

const MAX_PDF_BYTES =
  Number(process.env["PDF_MAX_BYTES"]) ||
  25 * 1024 * 1024;
const MAX_PDF_PAGES =
  Number(process.env["PDF_MAX_PAGES"]) || 80;
const MAX_OCR_PAGES =
  Number(process.env["PDF_MAX_OCR_PAGES"]) || 12;
const OCR_TIMEOUT_MS =
  Number(process.env["PDF_OCR_TIMEOUT_MS"]) ||
  120_000;

export type PdfPageRange = {
  startPage?: number;
  endPage?: number;
};

type ResolvedPdfPageRange = {
  startPage: number;
  endPage: number;
  selectedPageCount: number;
  totalPages: number;
  pages: number[];
  explicit: boolean;
};

const runtimeImport = new Function(
  "specifier",
  "return import(specifier)",
) as <T = unknown>(
  specifier: string,
) => Promise<T>;

async function loadPdfParse() {
  return runtimeImport<{
    PDFParse: new (
      options: Record<string, unknown>,
    ) => {
      getInfo: () => Promise<{
        total: number;
      }>;
      getText: (
        options: Record<string, unknown>,
      ) => Promise<{
        total: number;
        pages: Array<{
          text: string;
          num?: number;
        }>;
        text: string;
      }>;
      destroy: () => Promise<void>;
    };
  }>("pdf-parse");
}

function countWords(text: string) {
  return (
    text
      .trim()
      .match(
        /[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)?/gu,
      )?.length ?? 0
  );
}

function scoreExtractionQuality(text: string) {
  const normalized = text.trim();
  const charCount = normalized.length;
  const wordCount = countWords(normalized);
  const symbolicCount = (
    normalized.match(
      /[^\p{L}\p{N}\s.,;:'"!?()[\]{}+\-*/=%₹°<>|]/gu,
    ) ?? []
  ).length;
  const symbolRatio =
    charCount > 0
      ? symbolicCount / charCount
      : 1;

  if (
    charCount >= 2000 &&
    wordCount >= 250 &&
    symbolRatio < 0.12
  ) {
    return "high" as const;
  }

  if (
    charCount >= 500 &&
    wordCount >= 80 &&
    symbolRatio < 0.25
  ) {
    return "medium" as const;
  }

  return "low" as const;
}

function shouldUseOcr(text: string) {
  return scoreExtractionQuality(text) === "low";
}

function validatePageNumber(
  value: number | undefined,
  label: string,
) {
  if (value === undefined) {
    return undefined;
  }

  if (
    !Number.isInteger(value) ||
    value < 1
  ) {
    throw new Error(
      `${label} must be a positive whole number.`,
    );
  }

  return value;
}

function resolvePdfPageRange(
  totalPages: number,
  requestedRange: PdfPageRange = {},
): ResolvedPdfPageRange {
  const requestedStart = validatePageNumber(
    requestedRange.startPage,
    "startPage",
  );
  const requestedEnd = validatePageNumber(
    requestedRange.endPage,
    "endPage",
  );
  const explicit =
    requestedStart !== undefined ||
    requestedEnd !== undefined;

  if (!explicit && totalPages > MAX_PDF_PAGES) {
    throw new Error(
      `PDF has ${totalPages} pages. Select a page range of at most ${MAX_PDF_PAGES} pages before extraction.`,
    );
  }

  const startPage = requestedStart ?? 1;
  const endPage =
    requestedEnd ??
    Math.min(
      totalPages,
      startPage + MAX_PDF_PAGES - 1,
    );

  if (startPage > totalPages) {
    throw new Error(
      `startPage ${startPage} is outside this PDF. Total pages: ${totalPages}.`,
    );
  }

  if (endPage > totalPages) {
    throw new Error(
      `endPage ${endPage} is outside this PDF. Total pages: ${totalPages}.`,
    );
  }

  if (endPage < startPage) {
    throw new Error(
      "endPage must be greater than or equal to startPage.",
    );
  }

  const selectedPageCount =
    endPage - startPage + 1;

  if (selectedPageCount > MAX_PDF_PAGES) {
    throw new Error(
      `Selected range has ${selectedPageCount} pages. Limit is ${MAX_PDF_PAGES} pages per extraction.`,
    );
  }

  return {
    startPage,
    endPage,
    selectedPageCount,
    totalPages,
    pages: Array.from(
      { length: selectedPageCount },
      (_value, index) =>
        startPage + index,
    ),
    explicit,
  };
}

function normalizeLine(line: string) {
  return line
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function removeRepeatedHeadersAndFooters(
  pages: string[],
) {
  if (pages.length < 3) {
    return pages;
  }

  const frequency = new Map<string, number>();

  for (const page of pages) {
    const lines = page
      .split(/\r?\n/)
      .map(normalizeLine)
      .filter(Boolean);
    const candidates = [
      ...lines.slice(0, 3),
      ...lines.slice(-3),
    ];

    for (const line of new Set(candidates)) {
      if (
        line.length >= 4 &&
        line.length <= 120
      ) {
        frequency.set(
          line,
          (frequency.get(line) ?? 0) + 1,
        );
      }
    }
  }

  const repeated = new Set(
    [...frequency.entries()]
      .filter(
        ([, count]) =>
          count >=
          Math.max(3, Math.ceil(pages.length * 0.45)),
      )
      .map(([line]) => line),
  );

  return pages.map((page) =>
    page
      .split(/\r?\n/)
      .map(normalizeLine)
      .filter(
        (line) =>
          line &&
          !repeated.has(line) &&
          !/^(page\s*)?\d+\s*(of\s*\d+)?$/i.test(
            line,
          ),
      )
      .join("\n"),
  );
}

export function cleanExtractedText(
  pagesOrText: string[] | string,
) {
  const pages = Array.isArray(pagesOrText)
    ? pagesOrText
    : pagesOrText.split(
        /\n\s*--\s*\d+\s+of\s+\d+\s*--\n/i,
      );
  const stripped =
    removeRepeatedHeadersAndFooters(pages);

  return stripped
    .join("\n\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(
      /([A-Za-z])-\n([A-Za-z])/g,
      "$1$2",
    )
    .replace(
      /([^\n.!?।॥:;])\n(?=[a-zA-Z0-9(\u0900-\u097F\u0A00-\u0A7F])/g,
      "$1 ",
    )
    .replace(/[ \t]{2,}/g, " ")
    .trim()
    .normalize("NFC");
}

async function extractPdfTextLayer(
  buffer: Buffer,
  requestedRange: PdfPageRange = {},
) {
  const { PDFParse } =
    await loadPdfParse();
  const parser = new PDFParse({
    data: new Uint8Array(buffer),
  });

  try {
    const info = await parser.getInfo();
    const pageRange =
      resolvePdfPageRange(
        info.total,
        requestedRange,
      );

    const textResult = await parser.getText({
      partial: pageRange.pages,
      pageJoiner: "\n-- page_number of total_number --\n",
      lineEnforce: true,
      itemJoiner: " ",
    });

    return {
      pageCount:
        textResult.pages.length ||
        pageRange.selectedPageCount,
      pageRange,
      pages: textResult.pages.map(
        (page) => page.text,
      ),
      text: textResult.text,
    };
  } finally {
    await parser.destroy();
  }
}

async function extractPdfWithOcr(
  buffer: Buffer,
  pageNumbers: number[],
) {
  const pagesToOcr = pageNumbers.slice(
    0,
    MAX_OCR_PAGES,
  );
  const tempDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "quant-ocr-"),
  );
  const pdfPath = path.join(
    tempDir,
    "source.pdf",
  );

  try {
    await fs.writeFile(pdfPath, buffer);
    const result =
      await runOcrInChildProcess(
        pdfPath,
        pagesToOcr,
      );
    return {
      pages: result.pages,
      text: result.text,
    };
  } finally {
    await fs.rm(tempDir, {
      recursive: true,
      force: true,
    });
  }
}

function runOcrInChildProcess(
  pdfPath: string,
  pages: number[],
) {
  const script = String.raw`
import { pdf } from "pdf-to-img";
import { createWorker } from "tesseract.js";

const [pdfPath, pageCsv] = process.argv.slice(1);
const pages = pageCsv.split(",").filter(Boolean).map(Number);
const document = await pdf(pdfPath, { scale: 2 });
const worker = await createWorker("eng+hin+pan", undefined, {});
const texts = [];

try {
  for (const pageNumber of pages) {
    const image = await document.getPage(pageNumber);
    if (!image?.length) continue;
    const result = await worker.recognize(image);
    texts.push(result.data.text);
  }
} finally {
  await worker.terminate();
  await document.destroy?.();
}

process.stdout.write(JSON.stringify({
  pages,
  text: texts.join("\n\n")
}));
`;

  return new Promise<{
    pages: number[];
    text: string;
  }>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        "--input-type=module",
        "-e",
        script,
        pdfPath,
        pages.join(","),
      ],
      {
        cwd: process.cwd(),
        env: process.env,
        windowsHide: true,
      },
    );
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    const timeout = setTimeout(() => {
      child.kill();
      reject(
        new Error(
          `OCR child process timed out after ${Math.round(OCR_TIMEOUT_MS / 1000)} seconds.`,
        ),
      );
    }, OCR_TIMEOUT_MS);

    child.stdout.on("data", (chunk) =>
      stdout.push(Buffer.from(chunk)),
    );
    child.stderr.on("data", (chunk) =>
      stderr.push(Buffer.from(chunk)),
    );
    child.on("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timeout);
      const output =
        Buffer.concat(stdout).toString("utf8");
      const errorOutput =
        Buffer.concat(stderr)
          .toString("utf8")
          .trim();
      if (code !== 0) {
        reject(
          new Error(
            `OCR child process exited with ${code}: ${errorOutput}`,
          ),
        );
        return;
      }
      try {
        resolve(JSON.parse(output));
      } catch (error: any) {
        reject(
          new Error(
            `OCR child process returned invalid JSON: ${error?.message ?? errorOutput}`,
          ),
        );
      }
    });
  });
}

export async function ingestPdfBuffer(
  buffer: Buffer,
  options: {
    fileName?: string;
    mimeType?: string;
    startPage?: number;
    endPage?: number;
    forceOcr?: boolean;
  } = {},
): Promise<PdfIngestionResult> {
  if (buffer.byteLength > MAX_PDF_BYTES) {
    throw new Error(
      `PDF is too large. Limit is ${Math.round(MAX_PDF_BYTES / 1024 / 1024)} MB.`,
    );
  }

  const warnings: string[] = [];
  const textLayer =
    await extractPdfTextLayer(buffer, {
      startPage: options.startPage,
      endPage: options.endPage,
    });
  let rawText = textLayer.text;
  let pages = textLayer.pages;
  let ocrUsed = false;
  let ocrPages: number[] = [];
  const pageRange = textLayer.pageRange;

  if (
    pageRange.explicit &&
    pageRange.selectedPageCount <
      pageRange.totalPages
  ) {
    warnings.push(
      `Only pages ${pageRange.startPage}-${pageRange.endPage} of ${pageRange.totalPages} were extracted.`,
    );
  }

  if (
    options.forceOcr ||
    shouldUseOcr(rawText)
  ) {
    warnings.push(
      options.forceOcr
        ? "OCR fallback was forced for this extraction."
        : "Digital text layer looked low quality; OCR fallback was attempted.",
    );
    if (
      pageRange.selectedPageCount >
      MAX_OCR_PAGES
    ) {
      warnings.push(
        `OCR fallback is limited to ${MAX_OCR_PAGES} page(s); narrow the page range if the scanned PDF needs more OCR.`,
      );
    }
    try {
      const ocr = await extractPdfWithOcr(
        buffer,
        pageRange.pages,
      );
      if (scoreExtractionQuality(ocr.text) !== "low") {
        rawText = ocr.text;
        pages = ocr.text.split(/\n{2,}/);
        ocrUsed = true;
        ocrPages = ocr.pages;
      } else {
        warnings.push(
          "OCR fallback completed but text quality is still low.",
        );
      }
    } catch (error: any) {
      const detail =
        error?.stack ??
        error?.message ??
        "Unknown OCR error";
      warnings.push(
        `OCR fallback failed: ${detail}`,
      );
    }
  }

  const text = cleanExtractedText(pages);
  const extractionQuality =
    scoreExtractionQuality(text);

  return {
    rawText,
    text,
    metadata: {
      sourceType: "pdf",
      fileName: options.fileName,
      mimeType: options.mimeType,
      bytes: buffer.byteLength,
      pageCount:
        pageRange.selectedPageCount,
      totalPages: pageRange.totalPages,
      selectedStartPage:
        pageRange.startPage,
      selectedEndPage: pageRange.endPage,
      selectedPageCount:
        pageRange.selectedPageCount,
      ocrUsed,
      ocrPages,
      extractionQuality,
      charCount: text.length,
      wordCount: countWords(text),
      warnings,
    },
  };
}

export function ingestPlainTextBuffer(
  buffer: Buffer,
  options: {
    fileName?: string;
    mimeType?: string;
  } = {},
): PdfIngestionResult {
  const rawText = buffer.toString("utf8");
  const text = cleanExtractedText(rawText);

  return {
    rawText,
    text,
    metadata: {
      sourceType: "text",
      fileName: options.fileName,
      mimeType: options.mimeType,
      bytes: buffer.byteLength,
      pageCount: 0,
      ocrUsed: false,
      ocrPages: [],
      extractionQuality:
        scoreExtractionQuality(text),
      charCount: text.length,
      wordCount: countWords(text),
      warnings: [],
    },
  };
}
