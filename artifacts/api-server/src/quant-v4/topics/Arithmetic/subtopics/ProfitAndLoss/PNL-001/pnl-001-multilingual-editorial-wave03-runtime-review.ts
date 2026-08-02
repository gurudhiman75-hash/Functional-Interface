import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  listPnlCp001DynamicQlIds,
  runPnlCp001DynamicPipeline,
} from "./CP-001/cp001-dynamic-runtime";
import {
  listPnlCp002DynamicQlIds,
  runPnlCp002DynamicPipeline,
} from "./CP-002/cp002-dynamic-runtime";
import {
  listPnlCp003DynamicQlIds,
  runPnlCp003DynamicPipeline,
} from "./CP-003/cp003-dynamic-runtime";
import {
  listPnlCp004DynamicQlIds,
  runPnlCp004DynamicPipeline,
} from "./CP-004/cp004-dynamic-runtime";
import {
  listPnlCp005DynamicQlIds,
  runPnlCp005DynamicPipeline,
} from "./CP-005/cp005-dynamic-runtime";
import {
  listPnlCp006DynamicQlIds,
  runPnlCp006DynamicPipeline,
} from "./CP-006/cp006-dynamic-runtime";
import {
  buildAllWave03MultilingualEditorialLibraries,
  renderLocalizedFriendlyExplanationMarkdown,
  renderLocalizedStructuredStemMarkdown,
  type NativeEditorialLanguage,
  type StructuredEditorialEntry,
} from "./foundation";

const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/pnl-001-multilingual-editorial-wave03-runtime-review",
);
mkdirSync(outputDirectory, { recursive: true });

const LANGUAGES = ["hi", "pa"] as const;

type RuntimeInput = Readonly<{
  questionLanguageId?: string;
  language?: "en";
  seed?: string;
}>;

type RuntimePackage = Readonly<{
  canonicalProblemId: string;
  questionLanguageId: string;
  difficultyBand: "Easy" | "Medium" | "Hard";
  stem: string;
  answer: string;
  parameters: Readonly<{
    variables: Readonly<Record<string, unknown>>;
    runtimeMode: string;
    reviewStatus: string;
    questionBankStatus: string;
    testEligibility: string;
    publiclyPublishable: boolean;
  }>;
  explanation: Readonly<{ lines: readonly string[] }>;
  validation: Readonly<{ valid: boolean }>;
}>;

type RuntimeAuthority = Readonly<{
  cpId: string;
  listQlIds: () => readonly string[];
  run: (input: RuntimeInput) => RuntimePackage;
}>;

type RuntimeReviewRow = Readonly<{
  rowNumber: number;
  cpId: string;
  qlId: string;
  language: NativeEditorialLanguage;
  seed: string;
  difficulty: string;
  renderedStem: string;
  renderedExplanation: string;
  runtimeAnswer: string;
  runtimeVariables: string;
  runtimeEnglishExplanation: string;
  nativeMathJaxBlocks: number;
  unresolvedPlaceholders: string;
  runtimeValidation: string;
  reviewerDecision: string;
  reviewerNotes: string;
}>;

const runtimes: readonly RuntimeAuthority[] = [
  {
    cpId: "PNL-CP-001",
    listQlIds: listPnlCp001DynamicQlIds,
    run: runPnlCp001DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-002",
    listQlIds: listPnlCp002DynamicQlIds,
    run: runPnlCp002DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-003",
    listQlIds: listPnlCp003DynamicQlIds,
    run: runPnlCp003DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-004",
    listQlIds: listPnlCp004DynamicQlIds,
    run: runPnlCp004DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-005",
    listQlIds: listPnlCp005DynamicQlIds,
    run: runPnlCp005DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
  {
    cpId: "PNL-CP-006",
    listQlIds: listPnlCp006DynamicQlIds,
    run: runPnlCp006DynamicPipeline as (input: RuntimeInput) => RuntimePackage,
  },
];

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

function unresolvedPlaceholders(value: string): readonly string[] {
  const proseOnly = value
    .replace(/\\\[[\s\S]*?\\\]/g, "")
    .replace(/\\\([\s\S]*?\\\)/g, "");
  return [
    ...new Set(
      [...proseOnly.matchAll(/\{([a-z][A-Za-z0-9_]*)\}/g)].map(
        (match) => match[1]!,
      ),
    ),
  ].sort();
}

function mathJaxBlockCount(value: string): number {
  return (value.match(/\\\[|\\\(/g) ?? []).length;
}

const libraries = buildAllWave03MultilingualEditorialLibraries();
const libraryByKey = new Map(
  libraries.map((library) => [
    `${library.cpId}:${library.language}`,
    library,
  ]),
);

const rows: RuntimeReviewRow[] = [];
let rowNumber = 0;
let runtimeValidationFailures = 0;
let unresolvedNativePlaceholderRows = 0;
let rowsWithNativeMathJax = 0;
let rowsWithNumericRuntimeEvidence = 0;
const generatedQlIds = new Set<string>();

for (const runtime of runtimes) {
  for (const qlId of runtime.listQlIds()) {
    const seed = `${qlId}:wave03-runtime-review`;
    const runtimePackage = runtime.run({
      questionLanguageId: qlId,
      language: "en",
      seed,
    });
    generatedQlIds.add(qlId);

    if (!runtimePackage.validation.valid) runtimeValidationFailures += 1;

    for (const language of LANGUAGES) {
      const library = libraryByKey.get(`${runtime.cpId}:${language}`);
      const entry = library?.entries[qlId] as StructuredEditorialEntry | undefined;
      if (!entry) {
        throw new Error(`${runtime.cpId}/${qlId}/${language}: Wave 03 entry missing.`);
      }

      const context = runtimePackage.parameters.variables;
      const renderedStem = renderLocalizedStructuredStemMarkdown(
        entry.stem,
        language,
        context,
      );
      const renderedExplanation = renderLocalizedFriendlyExplanationMarkdown(
        entry.explanation,
        language,
        context,
      );
      const unresolved = unresolvedPlaceholders(
        `${renderedStem}\n${renderedExplanation}`,
      );
      const mathJaxBlocks = mathJaxBlockCount(renderedExplanation);
      const hasNumericRuntimeEvidence = /[0-9]/.test(
        runtimePackage.explanation.lines.join("\n"),
      );

      rowNumber += 1;
      if (unresolved.length > 0) unresolvedNativePlaceholderRows += 1;
      if (mathJaxBlocks > 0) rowsWithNativeMathJax += 1;
      if (hasNumericRuntimeEvidence) rowsWithNumericRuntimeEvidence += 1;

      rows.push({
        rowNumber,
        cpId: runtime.cpId,
        qlId,
        language,
        seed,
        difficulty: runtimePackage.difficultyBand,
        renderedStem,
        renderedExplanation,
        runtimeAnswer: runtimePackage.answer,
        runtimeVariables: JSON.stringify(context, null, 2),
        runtimeEnglishExplanation: runtimePackage.explanation.lines.join("\n\n"),
        nativeMathJaxBlocks: mathJaxBlocks,
        unresolvedPlaceholders: unresolved.join(";"),
        runtimeValidation: runtimePackage.validation.valid ? "PASS" : "FAIL",
        reviewerDecision:
          runtimePackage.validation.valid && unresolved.length === 0
            ? "AWAITING_HUMAN_REVIEW"
            : "AUTO_REJECTED",
        reviewerNotes:
          runtimePackage.validation.valid && unresolved.length === 0
            ? "Deterministic runtime values and verified answer rendered successfully; native-language human approval is still required."
            : "Resolve runtime validation or interpolation failures before human review.",
      });
    }
  }
}

const expectedQlIds = Array.from(
  { length: 186 },
  (_, index) => `PNL-QL-${String(index + 1).padStart(3, "0")}`,
);
const actualQlIds = [...generatedQlIds].sort();
if (JSON.stringify(actualQlIds) !== JSON.stringify(expectedQlIds)) {
  throw new Error("Wave 03 runtime review does not cover all 186 QLs.");
}

const headers = Object.keys(rows[0] ?? {}) as readonly (keyof RuntimeReviewRow)[];
const csv = [
  headers.map(csvCell).join(","),
  ...rows.map((row) =>
    headers.map((header) => csvCell(row[header])).join(","),
  ),
].join("\n");

const summary = {
  ok:
    rows.length === 372 &&
    runtimeValidationFailures === 0 &&
    unresolvedNativePlaceholderRows === 0,
  qlCount: generatedQlIds.size,
  rows: rows.length,
  hindiRows: rows.filter((row) => row.language === "hi").length,
  punjabiRows: rows.filter((row) => row.language === "pa").length,
  runtimeValidationFailures,
  unresolvedNativePlaceholderRows,
  rowsWithNativeMathJax,
  rowsWithNumericRuntimeEvidence,
  humanApprovalState: "AWAITING_HUMAN_REVIEW",
};

writeFileSync(
  resolve(
    outputDirectory,
    "PNL-001-Multilingual-Rendered-Runtime-Review-Wave03.csv",
  ),
  `${csv}\n`,
);
writeFileSync(
  resolve(outputDirectory, "pnl-001-wave03-runtime-review-summary.json"),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  resolve(outputDirectory, "README.md"),
  `# PNL-001 Multilingual Rendered Runtime Review — Wave 03\n\n` +
    `This corpus renders one deterministic, solver-verified value set for every QL in Hindi and Punjabi. ` +
    `The English runtime explanation is included only as technical calculation evidence; native editorial approval remains manual.\n\n` +
    `- QLs: ${summary.qlCount}\n` +
    `- Native rows: ${summary.rows}\n` +
    `- Runtime validation failures: ${summary.runtimeValidationFailures}\n` +
    `- Unresolved native placeholders: ${summary.unresolvedNativePlaceholderRows}\n` +
    `- Rows with native MathJax: ${summary.rowsWithNativeMathJax}\n` +
    `- Rows with numeric runtime evidence: ${summary.rowsWithNumericRuntimeEvidence}\n` +
    `- Human decision: ${summary.humanApprovalState}\n`,
);

console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exitCode = 1;
