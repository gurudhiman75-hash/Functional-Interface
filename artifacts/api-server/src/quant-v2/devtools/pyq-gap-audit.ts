import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { createRequire } from "node:module";
import {
  ingestPdfBuffer,
} from "../../generators/knowledge/pdf-ingestion";

type PdfPage = {
  num: number;
  text: string;
};

type ExtractedQuestion = {
  file: string;
  questionNo?: number;
  topic: string;
  family?: string;
  opening: string;
  text: string;
  extractionMode: "text-layer" | "ocr";
};

const require = createRequire(import.meta.url);

const DEFAULT_FOLDER =
  "ssc cgl tier 1 pyq";
const DEFAULT_OUT =
  "artifacts/api-server/exports/pyq-ssc-cgl-tier1-gap-analysis";

function argValue(name: string) {
  const direct = process.argv.find((arg) =>
    arg.startsWith(`${name}=`),
  );
  if (direct) {
    return direct.slice(name.length + 1);
  }
  const index = process.argv.indexOf(name);
  return index >= 0
    ? process.argv[index + 1]
    : undefined;
}

function hasFlag(name: string) {
  return process.argv.includes(name);
}

function resolveInputFolder(folder: string) {
  const candidates = [
    path.resolve(folder),
    path.resolve(process.cwd(), folder),
    path.resolve(process.cwd(), "..", "..", folder),
  ];

  return (
    candidates.find((candidate) =>
      fs.existsSync(candidate),
    ) ?? candidates[0]!
  );
}

function resolveOutputDir(outDir: string) {
  if (path.isAbsolute(outDir)) {
    return outDir;
  }

  if (
    outDir.startsWith("artifacts/") ||
    outDir.startsWith("artifacts\\") ||
    outDir === "exports" ||
    outDir.startsWith("exports/")
  ) {
    return path.resolve(
      process.cwd(),
      "..",
      "..",
      outDir,
    );
  }

  return path.resolve(outDir);
}

function normalizeText(text: string) {
  return text
    .replace(/\u00a0/gu, " ")
    .replace(/\0/gu, "fi")
    .replace(/[₹]/gu, "Rs.")
    .replace(/\s+/gu, " ")
    .trim();
}

function hashFile(filePath: string) {
  const hash = crypto.createHash("sha256");
  hash.update(fs.readFileSync(filePath));
  return hash.digest("hex");
}

async function loadPdfParse() {
  return import("pdf-parse") as Promise<{
    PDFParse: new (
      options: Record<string, unknown>,
    ) => {
      getInfo: () => Promise<{
        total: number;
      }>;
      getText: (
        options: Record<string, unknown>,
      ) => Promise<{
        pages: Array<{
          text: string;
          num?: number;
        }>;
        text: string;
      }>;
      destroy: () => Promise<void>;
    };
  }>;
}

async function extractTextPages(buffer: Buffer) {
  const { PDFParse } = await loadPdfParse();
  const parser = new PDFParse({
    data: new Uint8Array(buffer),
  });

  try {
    const info = await parser.getInfo();
    const result = await parser.getText({
      partial: Array.from(
        { length: Math.min(info.total, 120) },
        (_value, index) => index + 1,
      ),
      lineEnforce: true,
      itemJoiner: " ",
      pageJoiner: "\n",
    });
    return {
      totalPages: info.total,
      pages: result.pages.map((page, index) => ({
        num: page.num ?? index + 1,
        text: page.text ?? "",
      })),
      text: result.text ?? "",
    };
  } finally {
    await parser.destroy();
  }
}

function quantSlice(text: string) {
  const match = text.match(
    /Quantitative Aptitude(?<body>.*?)(English Comprehension|English Language|General English|PART-D|Downloaded from Cracku\.in For MBA\/CAT Courses:\s*\S+\s*22\/|$)/isu,
  );
  return match?.groups?.body ?? "";
}

function detectQuantPageRange(pages: PdfPage[]) {
  const quantHeader = pages.find((page) =>
    /Quantitative Aptitude|PART-C/i.test(
      page.text,
    ),
  );
  const q51 = pages.find((page) =>
    /Q\.?\s*No\.?\s*:?\s*51\b|(?<!\d)51\.\s/u.test(
      page.text,
    ),
  );
  const q75 = pages.find((page) =>
    /Q\.?\s*No\.?\s*:?\s*75\b|(?<!\d)75\.\s/u.test(
      page.text,
    ),
  );

  const start =
    q51?.num ?? quantHeader?.num;
  const end =
    q75?.num ??
    (start ? Math.min(start + 18, pages.at(-1)?.num ?? start) : undefined);

  if (!start || !end) {
    return undefined;
  }

  return {
    startPage: start,
    endPage: Math.max(start, end),
  };
}

function extractQuestionBlocks(section: string) {
  const cleaned = section
    .replace(/Downloaded from Cracku\.in.*?\d+\/\d+/giu, " ")
    .replace(/Correct Option selected|Wrong Option selected|Not Answered/giu, " ");
  const starts = [
    ...cleaned.matchAll(
      /(?<!\d)(?:Q\.?\s*No\.?\s*:?\s*)?(5[1-9]|6[0-9]|7[0-5])[\).]?\s+/giu,
    ),
  ].map((match) => ({
    index: match.index ?? 0,
    no: Number(match[1]),
  }));

  const blocks: Array<{
    no?: number;
    text: string;
  }> = [];

  for (let index = 0; index < starts.length; index += 1) {
    const start = starts[index]!;
    const end =
      starts[index + 1]?.index ??
      cleaned.length;
    const block = normalizeText(
      cleaned.slice(start.index, end),
    );
    if (block.length > 30) {
      blocks.push({
        no: start.no,
        text: block,
      });
    }
  }

  return blocks;
}

const TOPIC_RULES: Array<[string, string[]]> = [
  [
    "data_interpretation",
    [
      "bar graph",
      "pie chart",
      "table",
      "chart",
      "graph",
      "imports",
      "sales of",
      "branch",
      "following data",
    ],
  ],
  [
    "profit_loss_discount",
    [
      "profit",
      "loss",
      "shopkeeper",
      "bought",
      "sold",
      "selling price",
      "cost price",
      "marked price",
      "discount",
      "weighing",
    ],
  ],
  [
    "simple_compound_interest",
    [
      "simple interest",
      "compound interest",
      "rate of interest",
      "per annum",
    ],
  ],
  ["percentage", ["percentage", "percent", "%"]],
  ["ratio_proportion", ["ratio", "proportion", "varies", "variation"]],
  ["average", ["average"]],
  [
    "time_work",
    [
      "complete a work",
      "complete it",
      "work in",
      "men and",
      "women can complete",
      "pipes",
      "cistern",
    ],
  ],
  [
    "speed_distance",
    [
      "speed",
      "km/h",
      "train",
      "boat",
      "stream",
      "distance",
      "policeman",
      "thief",
    ],
  ],
  [
    "geometry_mensuration",
    [
      "circle",
      "triangle",
      "cube",
      "cuboid",
      "cylinder",
      "cone",
      "sphere",
      "radius",
      "area",
      "volume",
      "tangent",
      "side",
      "cm",
    ],
  ],
  [
    "trigonometry",
    [
      "sin",
      "cos",
      "tan",
      "sec",
      "cosec",
      "cot",
      "theta",
      "α",
    ],
  ],
  [
    "number_system",
    [
      "remainder",
      "divisor",
      "quotient",
      "dividend",
      "divided by",
      "lcm",
      "hcf",
    ],
  ],
  [
    "algebra",
    [
      "equation",
      "value of",
      "polynomial",
      "find x",
      "find y",
    ],
  ],
  ["simplification", ["simplify", "find the value", "using"]],
];

const FAMILY_RULES: Array<[string, string, string[]]> = [
  [
    "profit_loss_discount",
    "pl_partial_inventory_allocation",
    [
      "one-fifth",
      "one-fourth",
      "remaining",
      "overall",
      "stock",
      "mango",
      "apple",
    ],
  ],
  [
    "profit_loss_discount",
    "pl_dishonest_dealer_weight_fraud",
    ["weighing", "weight", "gm", "kg", "packet"],
  ],
  [
    "profit_loss_discount",
    "pl_successive_discount_equivalent",
    ["successive discount", "two successive", "maximum discount"],
  ],
  [
    "profit_loss_discount",
    "pl_markup_discount_triangle",
    ["marked price", "above", "cost price", "profit"],
  ],
  [
    "profit_loss_discount",
    "pl_mp_discount_to_sp",
    ["marked price", "discount"],
  ],
  [
    "profit_loss_discount",
    "pl_cp_sp_percent",
    ["bought", "sold", "profit", "loss"],
  ],
  [
    "data_interpretation",
    "di_percentage_comparison",
    ["percentage", "what percentage", "approximately"],
  ],
  [
    "percentage",
    "relation_chain",
    ["more than", "less than"],
  ],
  [
    "percentage",
    "price_consumption",
    ["price", "consumption", "expenditure"],
  ],
  [
    "percentage",
    "pass_fail_marks",
    ["marks", "pass", "failed", "scored"],
  ],
  [
    "percentage",
    "venn_percentage",
    ["at least", "both", "neither"],
  ],
];

function classifyTopic(text: string) {
  const lower = text.toLowerCase();
  for (const [topic, needles] of TOPIC_RULES) {
    if (
      needles.some((needle) =>
        lower.includes(needle),
      )
    ) {
      return topic;
    }
  }
  return "other_quant";
}

function classifyFamily(text: string, topic: string) {
  const lower = text.toLowerCase();
  for (const [
    ruleTopic,
    family,
    needles,
  ] of FAMILY_RULES) {
    if (
      ruleTopic === topic &&
      needles.some((needle) =>
        lower.includes(needle),
      )
    ) {
      return family;
    }
  }

  if (topic === "profit_loss_discount") {
    return "pl_other_or_unclassified";
  }

  if (
    topic === "percentage" ||
    topic === "data_interpretation"
  ) {
    return "percentage_other_or_unclassified";
  }

  return undefined;
}

function opening(text: string) {
  return normalizeText(
    text.replace(
      /^(?:Q\.?\s*No\.?\s*:?\s*)?\d+[\).]?\s*/iu,
      "",
    ),
  ).slice(0, 240);
}

function increment(
  counter: Record<string, number>,
  key: string | undefined,
) {
  if (!key) return;
  counter[key] = (counter[key] ?? 0) + 1;
}

async function extractQuestionsFromPdf(
  filePath: string,
  useOcr: boolean,
) {
  const buffer = fs.readFileSync(filePath);
  const pages = await extractTextPages(buffer);
  const fullText = pages.text;
  let section = quantSlice(fullText);
  const pageRange =
    detectQuantPageRange(pages.pages);
  let extractionMode: "text-layer" | "ocr" =
    "text-layer";
  let metadata: Record<string, unknown> = {
    totalPages: pages.totalPages,
    textChars: fullText.length,
  };

  if (!section) {
    if (pageRange) {
      section = pages.pages
        .filter(
          (page) =>
            page.num >= pageRange.startPage &&
            page.num <= pageRange.endPage,
        )
        .map((page) => page.text)
        .join("\n");
      metadata = {
        ...metadata,
        detectedStartPage:
          pageRange.startPage,
        detectedEndPage:
          pageRange.endPage,
      };

    }
  }

  let blocks =
    extractQuestionBlocks(section);

  if (
    useOcr &&
    pageRange &&
    blocks.length < 15
  ) {
    const ocr = await ingestPdfBuffer(
      buffer,
      {
        fileName: path.basename(filePath),
        mimeType: "application/pdf",
            startPage: pageRange.startPage,
            endPage: pageRange.endPage,
            forceOcr: true,
          },
        );
    const ocrBlocks =
      extractQuestionBlocks(ocr.text);

    if (ocrBlocks.length > blocks.length) {
      section = ocr.text;
      blocks = ocrBlocks;
      extractionMode = "ocr";
    }

    metadata = {
      ...metadata,
      ocrMetadata:
        ocr.metadata,
    };
  }
  return {
    metadata,
    extractionMode,
    questions: blocks.map((block) => {
      const topic =
        classifyTopic(block.text);
      const family =
        classifyFamily(
          block.text,
          topic,
        );
      return {
        file: path.basename(filePath),
        questionNo: block.no,
        topic,
        family,
        opening: opening(block.text),
        text: block.text.slice(0, 1500),
        extractionMode,
      } satisfies ExtractedQuestion;
    }),
  };
}

function sortCounts(
  counts: Record<string, number>,
) {
  return Object.fromEntries(
    Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    ),
  );
}

async function main() {
  const folder =
    resolveInputFolder(
      argValue("--folder") ??
        DEFAULT_FOLDER,
    );
  const outDir =
    resolveOutputDir(
      argValue("--out") ??
        DEFAULT_OUT,
    );
  const maxFiles = Number(
    argValue("--max-files") ?? 0,
  );
  const matchPattern =
    argValue("--match")?.toLowerCase();
  const useOcr =
    hasFlag("--ocr");

  const pdfs = fs
    .readdirSync(folder)
    .filter((name) =>
      name.toLowerCase().endsWith(".pdf"),
    )
    .filter(
      (name) =>
        !matchPattern ||
        name.toLowerCase().includes(
          matchPattern,
        ),
    )
    .sort()
    .slice(
      0,
      maxFiles > 0
        ? maxFiles
        : undefined,
    )
    .map((name) =>
      path.join(folder, name),
    );

  fs.mkdirSync(outDir, {
    recursive: true,
  });

  const hashGroups = new Map<
    string,
    string[]
  >();
  for (const pdf of pdfs) {
    const hash = hashFile(pdf);
    hashGroups.set(hash, [
      ...(hashGroups.get(hash) ?? []),
      path.basename(pdf),
    ]);
  }

  const questions: ExtractedQuestion[] =
    [];
  const documents: Array<
    Record<string, unknown>
  > = [];
  const extractionIssues: Array<
    Record<string, unknown>
  > = [];

  for (const pdf of pdfs) {
    try {
      const result =
        await extractQuestionsFromPdf(
          pdf,
          useOcr,
        );
      documents.push({
        file: path.basename(pdf),
        extractionMode:
          result.extractionMode,
        quantQuestionsExtracted:
          result.questions.length,
        ...result.metadata,
      });
      if (result.questions.length < 15) {
        extractionIssues.push({
          file: path.basename(pdf),
          issue:
            "low_quant_question_extraction",
          count:
            result.questions.length,
        });
      }
      questions.push(
        ...result.questions,
      );
    } catch (error) {
      extractionIssues.push({
        file: path.basename(pdf),
        issue:
          error instanceof Error
            ? error.name
            : "Error",
        message:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }

  const topicCounts: Record<
    string,
    number
  > = {};
  const familyCounts: Record<
    string,
    number
  > = {};
  for (const question of questions) {
    increment(
      topicCounts,
      question.topic,
    );
    increment(
      familyCounts,
      question.family,
    );
  }

  const duplicateFileGroups = [
    ...hashGroups.values(),
  ].filter((names) => names.length > 1);

  const percentageLike =
    questions.filter(
      (question) =>
        question.topic ===
          "percentage" ||
        question.topic ===
          "data_interpretation" ||
        question.family?.startsWith(
          "di_",
        ) ||
        question.family?.startsWith(
          "percentage_",
        ),
    );
  const profitLossLike =
    questions.filter(
      (question) =>
        question.topic ===
        "profit_loss_discount",
    );

  const gaps = [
    {
      area:
        "SSC Quant topic coverage",
      finding:
        "Percentage and Profit/Loss cover only part of the extracted SSC CGL Quant mix; geometry, algebra, time-work, ratio, speed-distance, SI/CI, trigonometry, and DI need their own V2 chapters.",
    },
    {
      area:
        "Percentage DI hybrid",
      finding:
        "PYQs frequently ask percentage/comparison questions from bar graphs, pie charts, tables, imports, sales, and poverty-line data. Standalone Percentage V2 should add lightweight DI-percentage families if it is expected to cover SSC Tier 1 patterns.",
    },
    {
      area:
        "Profit/Loss inventory and discount comparison",
      finding:
        "Extracted PYQs include partial stock allocation, bill discount differences, maximum discount comparison, faulty weighing, dozen/unit conversion, and markup-discount inverses. Profit/Loss has many of these families, but needs more high-scale distractor-safe variants.",
    },
    {
      area:
        "OCR extraction",
      finding:
        useOcr
          ? "OCR mode was enabled; review per-file extraction counts to decide if page ranges/language settings need tuning."
          : "Many SSC official/challenge PDFs expose low-quality text layers. Re-run this audit with --ocr for the folder to extract those pages.",
    },
  ];

  const summary = {
    sourceFolder: folder,
    ocrEnabled: useOcr,
    pdfCount: pdfs.length,
    duplicateFileGroups,
    documents,
    totalQuantQuestionsExtracted:
      questions.length,
    topicCounts:
      sortCounts(topicCounts),
    familyCounts:
      sortCounts(familyCounts),
    percentageLikeCount:
      percentageLike.length,
    profitLossLikeCount:
      profitLossLike.length,
    extractionIssues,
    gapFindings: gaps,
    samplePercentageLike:
      percentageLike.slice(0, 30),
    sampleProfitLossLike:
      profitLossLike.slice(0, 30),
  };

  fs.writeFileSync(
    path.join(
      outDir,
      "pyq-gap-summary.json",
    ),
    JSON.stringify(
      summary,
      null,
      2,
    ),
    "utf8",
  );

  const lines = [
    "# SSC CGL Tier 1 PYQ Gap Analysis",
    "",
    `Source folder: ${folder}`,
    `OCR enabled: ${useOcr ? "yes" : "no"}`,
    `PDF files: ${pdfs.length}`,
    `Duplicate file groups: ${duplicateFileGroups.length}`,
    `Quant questions extracted: ${questions.length}`,
    `Percentage-like questions: ${percentageLike.length}`,
    `Profit/Loss-like questions: ${profitLossLike.length}`,
    "",
    "## Topic Counts",
    ...Object.entries(
      sortCounts(topicCounts),
    ).map(
      ([topic, count]) =>
        `- ${topic}: ${count}`,
    ),
    "",
    "## Family Counts",
    ...Object.entries(
      sortCounts(familyCounts),
    ).map(
      ([family, count]) =>
        `- ${family}: ${count}`,
    ),
    "",
    "## Gap Findings",
    ...gaps.map(
      (gap) =>
        `- **${gap.area}**: ${gap.finding}`,
    ),
    "",
    "## Sample Profit/Loss PYQs",
    ...profitLossLike
      .slice(0, 12)
      .map(
        (question) =>
          `- ${question.file}: ${question.opening}`,
      ),
    "",
    "## Sample Percentage/DI PYQs",
    ...percentageLike
      .slice(0, 12)
      .map(
        (question) =>
          `- ${question.file}: ${question.opening}`,
      ),
  ];

  fs.writeFileSync(
    path.join(outDir, "pyq-gap-report.md"),
    lines.join("\n"),
    "utf8",
  );

  console.log(
    JSON.stringify(
      {
        pdfCount: pdfs.length,
        ocrEnabled: useOcr,
        duplicateFileGroups:
          duplicateFileGroups.length,
        totalQuantQuestionsExtracted:
          questions.length,
        topicCounts:
          Object.fromEntries(
            Object.entries(
              sortCounts(topicCounts),
            ).slice(0, 12),
          ),
        familyCounts:
          Object.fromEntries(
            Object.entries(
              sortCounts(familyCounts),
            ).slice(0, 12),
          ),
        percentageLikeCount:
          percentageLike.length,
        profitLossLikeCount:
          profitLossLike.length,
        extractionIssues:
          extractionIssues.slice(0, 12),
        output: outDir,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
