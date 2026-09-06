import fs from 'node:fs/promises';

const [mode, filePath, startRaw, endRaw] = process.argv.slice(2);

function countWords(value) {
  return value.trim().match(/[\p{L}\p{N}]+(?:[-'][\p{L}\p{N}]+)?/gu)?.length ?? 0;
}

function extractionQuality(value) {
  const text = value.trim();
  const charCount = text.length;
  const wordCount = countWords(text);
  const symbolicCount = (text.match(/[^\p{L}\p{N}\s.,;:'"!?()[\]{}+\-*/=%₹°<>|]/gu) ?? []).length;
  const symbolRatio = charCount > 0 ? symbolicCount / charCount : 1;
  if (charCount >= 2000 && wordCount >= 250 && symbolRatio < 0.12) return 'high';
  if (charCount >= 500 && wordCount >= 80 && symbolRatio < 0.25) return 'medium';
  return 'low';
}

function normalizeLine(line) {
  return String(line ?? '').replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
}

function cleanPages(input) {
  const pages = Array.isArray(input) ? input.map((item) => String(item ?? '')) : [String(input ?? '')];
  const frequency = new Map();
  if (pages.length >= 3) {
    for (const page of pages) {
      const lines = page.split(/\r?\n/).map(normalizeLine).filter(Boolean);
      const candidates = [...lines.slice(0, 3), ...lines.slice(-3)];
      for (const line of new Set(candidates)) {
        if (line.length >= 4 && line.length <= 120) frequency.set(line, (frequency.get(line) ?? 0) + 1);
      }
    }
  }
  const repeated = new Set(
    [...frequency.entries()]
      .filter(([, count]) => count >= Math.max(3, Math.ceil(pages.length * 0.45)))
      .map(([line]) => line),
  );
  return pages
    .map((page) => page
      .split(/\r?\n/)
      .map(normalizeLine)
      .filter((line) => line && !repeated.has(line) && !/^(page\s*)?\d+\s*(of\s*\d+)?$/i.test(line))
      .join('\n'))
    .join('\n\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/([A-Za-z])-\n([A-Za-z])/g, '$1$2')
    .replace(/([^\n.!?।॥:;])\n(?=[a-zA-Z0-9(\u0900-\u097F\u0A00-\u0A7F])/g, '$1 ')
    .replace(/[ \t]{2,}/g, ' ')
    .trim()
    .normalize('NFC');
}

function parsePageNumber(value, label) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new Error(`${label} must be a positive whole number.`);
  return parsed;
}

async function extractTextLayer() {
  let data = await fs.readFile(filePath);
  const { PDFParse } = await import('pdf-parse');
  const parser = new PDFParse({ data: new Uint8Array(data) });
  try {
    const info = await parser.getInfo();
    const totalPages = Number(info.total ?? 0);
    if (!Number.isInteger(totalPages) || totalPages < 1) throw new Error('PDF does not contain readable pages.');
    const startPage = parsePageNumber(startRaw, 'startPage');
    const requestedEnd = parsePageNumber(endRaw, 'endPage');
    if (startPage > totalPages) throw new Error(`startPage ${startPage} is outside this PDF. Total pages: ${totalPages}.`);
    const endPage = Math.min(requestedEnd, totalPages);
    if (endPage < startPage) throw new Error('endPage must be greater than or equal to startPage.');
    const pages = Array.from({ length: endPage - startPage + 1 }, (_value, index) => startPage + index);
    const result = await parser.getText({
      partial: pages,
      pageJoiner: '\n-- page_number of total_number --\n',
      lineEnforce: true,
      itemJoiner: ' ',
    });
    const pageTexts = result.pages?.map((page) => page.text) ?? [];
    const text = cleanPages(pageTexts.length ? pageTexts : result.text);
    return {
      mode: 'text',
      totalPages,
      startPage,
      endPage,
      selectedPageCount: pages.length,
      text,
      extractionQuality: extractionQuality(text),
      charCount: text.length,
      wordCount: countWords(text),
      ocrUsed: false,
      ocrPages: [],
      warnings: [],
    };
  } finally {
    await parser.destroy();
    data = null;
  }
}

async function extractOcr() {
  const startPage = parsePageNumber(startRaw, 'startPage');
  const endPage = parsePageNumber(endRaw, 'endPage');
  if (endPage < startPage) throw new Error('endPage must be greater than or equal to startPage.');
  const pages = Array.from({ length: endPage - startPage + 1 }, (_value, index) => startPage + index);
  if (pages.length > 12) throw new Error('OCR worker accepts at most 12 pages per run.');
  const [{ pdf }, { createWorker }] = await Promise.all([import('pdf-to-img'), import('tesseract.js')]);
  const document = await pdf(filePath, { scale: 2 });
  const worker = await createWorker('eng+hin+pan', undefined, {});
  const texts = [];
  const completedPages = [];
  try {
    for (const pageNumber of pages) {
      const image = await document.getPage(pageNumber);
      if (!image?.length) continue;
      const result = await worker.recognize(image);
      texts.push(result.data.text);
      completedPages.push(pageNumber);
    }
  } finally {
    await worker.terminate();
    await document.destroy?.();
  }
  const text = cleanPages(texts);
  return {
    mode: 'ocr',
    totalPages: null,
    startPage,
    endPage,
    selectedPageCount: pages.length,
    text,
    extractionQuality: extractionQuality(text),
    charCount: text.length,
    wordCount: countWords(text),
    ocrUsed: true,
    ocrPages: completedPages,
    warnings: ['Digital text layer was low quality; OCR fallback was used.'],
  };
}

async function main() {
  if (!filePath) throw new Error('PDF worker file path is required.');
  if (mode === 'text') return extractTextLayer();
  if (mode === 'ocr') return extractOcr();
  throw new Error(`Unknown PDF worker mode: ${mode || '(empty)'}.`);
}

try {
  const result = await main();
  process.stdout.write(JSON.stringify(result));
} catch (error) {
  const message = error instanceof Error ? `${error.name}: ${error.message}\n${error.stack ?? ''}` : String(error);
  process.stderr.write(message.slice(0, 16000));
  process.exitCode = 1;
}
