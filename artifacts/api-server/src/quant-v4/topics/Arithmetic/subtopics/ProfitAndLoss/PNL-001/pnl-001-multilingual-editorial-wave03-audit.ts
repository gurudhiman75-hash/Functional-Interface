import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import type {
  QuestionStemBlock,
  StructuredEditorialEntry,
} from "./foundation/editorial-content";

const root = dirname(fileURLToPath(import.meta.url));
const outputDirectory = resolve(
  process.cwd(),
  "dist/quant-v4/pnl-001-multilingual-editorial-wave03-audit",
);
mkdirSync(outputDirectory, { recursive: true });

const CP_META = [
  { cpId: "PNL-CP-001", folder: "CP-001", start: 1, count: 36 },
  { cpId: "PNL-CP-002", folder: "CP-002", start: 37, count: 34 },
  { cpId: "PNL-CP-003", folder: "CP-003", start: 71, count: 24 },
  { cpId: "PNL-CP-004", folder: "CP-004", start: 95, count: 26 },
  { cpId: "PNL-CP-005", folder: "CP-005", start: 121, count: 29 },
  { cpId: "PNL-CP-006", folder: "CP-006", start: 150, count: 37 },
] as const;
const LANGUAGES = ["hi", "pa"] as const;
type Language = (typeof LANGUAGES)[number];

type Library = Readonly<{
  cpId: string;
  language: Language | "en";
  entryCount: number;
  entries: Readonly<Record<string, StructuredEditorialEntry>>;
}>;

type Severity = "BLOCKER" | "MAJOR";
type Issue = Readonly<{ code: string; severity: Severity; note: string }>;

type ReviewRow = Readonly<{
  rowNumber: number;
  cpId: string;
  qlId: string;
  language: Language;
  contextFamily: string;
  representation: string;
  stem: string;
  prompt: string;
  opening: string;
  concept: string;
  steps: string;
  equationsLatex: string;
  conclusion: string;
  finalAnswerLatex: string;
  commonTrap: string;
  shortcut: string;
  difficulty: string;
  difficultyRationale: string;
  reviewerDecision: string;
  severity: string;
  issueCodes: string;
  reviewerNotes: string;
  replacementStem: string;
  replacementExplanation: string;
}>;

const STEP_PREFIXES = [
  "दिए आँकड़ों से — ",
  "सही आधार पर — ",
  "इस चरण में ",
  "अब ",
  "प्रश्न की शर्त के अनुसार — ",
  "संबंधित राशि पर — ",
  "जाँच के साथ — ",
  "क्रमवार — ",
  "ਦਿੱਤੇ ਅੰਕੜਿਆਂ ਤੋਂ — ",
  "ਸਹੀ ਆਧਾਰ ਉੱਤੇ — ",
  "ਇਸ ਪੜਾਅ ਵਿੱਚ ",
  "ਹੁਣ ",
  "ਸਵਾਲ ਦੀ ਸ਼ਰਤ ਅਨੁਸਾਰ — ",
  "ਸਬੰਧਤ ਰਕਮ ਉੱਤੇ — ",
  "ਜਾਂਚ ਸਮੇਤ — ",
  "ਕ੍ਰਮਵਾਰ — ",
] as const;

const PUNJABI_LITERAL_LEAKS = [
  "ਜਾਣੇ ਮੂਲ ਮੁੱਲ",
  "ਜਾਣਿਆ ਮੂਲ ਮੁੱਲ",
  "ਅੰਤਿਮ ਮੰਗ ਨਾ ਭੁੱਲੋ",
  "ਸੌਖੇ ਭਾਗ ਮੰਨੋ",
] as const;

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, "utf8")) as T;
}

function qlIdAt(start: number, index: number): string {
  return `PNL-QL-${String(start + index).padStart(3, "0")}`;
}

function blockText(block: QuestionStemBlock): readonly string[] {
  switch (block.type) {
    case "paragraph":
      return [block.content];
    case "table":
      return [
        block.caption ?? "",
        ...block.columns,
        ...(block.rows?.flat() ?? []),
        block.rowSource ? `{${block.rowSource}}` : "",
      ];
    case "caselet":
      return [
        block.title ?? "",
        ...(block.paragraphs ?? []),
        block.paragraphSource ? `{${block.paragraphSource}}` : "",
      ];
    case "statements":
      return [block.lead ?? "", ...block.statements];
    case "data_sufficiency":
      return [block.question, ...block.statements];
    case "equation":
      return [`\\[${block.latex}\\]`];
  }
}

function stemText(entry: StructuredEditorialEntry): string {
  return [...entry.stem.blocks.flatMap(blockText), entry.stem.prompt]
    .filter(Boolean)
    .join("\n\n");
}

function representation(entry: StructuredEditorialEntry): string {
  const special = entry.stem.blocks
    .map((block) => block.type)
    .filter((type) => type !== "paragraph");
  return special.length
    ? [...new Set(special)].join("+").toUpperCase()
    : "PARAGRAPH";
}

function target(entry: StructuredEditorialEntry): string {
  return entry.stem.prompt.replace(/[?？।.]+$/u, "").trim();
}

function prose(entry: StructuredEditorialEntry): string {
  return [
    entry.explanation.opening,
    entry.explanation.concept,
    ...entry.explanation.steps.flatMap((step) => [step.title, step.body]),
    entry.explanation.conclusion,
    entry.explanation.commonTrap ?? "",
    entry.explanation.shortcut ?? "",
  ].join("\n");
}

function stepReviewText(entry: StructuredEditorialEntry): string {
  return entry.explanation.steps
    .map((step, index) =>
      [
        `${index + 1}. ${step.title}`,
        step.body,
        step.equationLatex ? `\\[${step.equationLatex}\\]` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n\n");
}

function equationList(entry: StructuredEditorialEntry): readonly string[] {
  return [
    ...entry.stem.blocks
      .filter(
        (
          block,
        ): block is Extract<QuestionStemBlock, { type: "equation" }> =>
          block.type === "equation",
      )
      .map((block) => block.latex),
    ...entry.explanation.steps.flatMap((step) =>
      step.equationLatex ? [step.equationLatex] : [],
    ),
    ...(entry.explanation.finalAnswerLatex
      ? [entry.explanation.finalAnswerLatex]
      : []),
  ];
}

function equationTopology(entry: StructuredEditorialEntry): Readonly<{
  stemEquationCount: number;
  stepEquationMask: readonly boolean[];
  hasFinalAnswerEquation: boolean;
}> {
  return {
    stemEquationCount: entry.stem.blocks.filter(
      (block) => block.type === "equation",
    ).length,
    stepEquationMask: entry.explanation.steps.map((step) =>
      Boolean(step.equationLatex),
    ),
    hasFinalAnswerEquation: Boolean(entry.explanation.finalAnswerLatex),
  };
}

function inspect(
  language: Language,
  entry: StructuredEditorialEntry,
  englishEntry: StructuredEditorialEntry,
): readonly Issue[] {
  const issues: Issue[] = [];
  const quotedTarget = `“${target(entry)}”`;
  const echoFields = [
    ["opening", entry.explanation.opening],
    ["concept", entry.explanation.concept],
    ["conclusion", entry.explanation.conclusion],
    ["commonTrap", entry.explanation.commonTrap ?? ""],
  ] as const;

  for (const [field, value] of echoFields) {
    if (value.includes(quotedTarget)) {
      issues.push({
        code: "PROMPT-ECHO",
        severity: "MAJOR",
        note: `${field} repeats the question prompt verbatim.`,
      });
    }
  }

  entry.explanation.steps.forEach((step, index) => {
    const prefix = STEP_PREFIXES.find((candidate) =>
      step.title.startsWith(candidate),
    );
    if (prefix) {
      issues.push({
        code: "SYNTHETIC-STEP-PREFIX",
        severity: "MAJOR",
        note: `Step ${index + 1} starts with synthetic prefix ${prefix.trim()}.`,
      });
    }
  });

  if (language === "pa") {
    const combined = prose(entry);
    for (const phrase of PUNJABI_LITERAL_LEAKS) {
      if (combined.includes(phrase)) {
        issues.push({
          code: "PUNJABI-LITERAL-TRANSLATION",
          severity: "MAJOR",
          note: `Literal Hindi-style Punjabi phrase remains: ${phrase}.`,
        });
      }
    }
  }

  if (representation(entry) !== representation(englishEntry)) {
    issues.push({
      code: "REPRESENTATION-PARITY",
      severity: "BLOCKER",
      note: "Native representation differs from English authority.",
    });
  }
  if (entry.explanation.steps.length !== englishEntry.explanation.steps.length) {
    issues.push({
      code: "STEP-COUNT-PARITY",
      severity: "BLOCKER",
      note: "Native worked-step count differs from English authority.",
    });
  }
  if (
    JSON.stringify(equationTopology(entry)) !==
    JSON.stringify(equationTopology(englishEntry))
  ) {
    issues.push({
      code: "MATHJAX-TOPOLOGY",
      severity: "BLOCKER",
      note:
        "Native equation placement differs from the English structural authority.",
    });
  }

  return issues;
}

function csvCell(value: unknown): string {
  const text = String(value ?? "").replace(/\r?\n/g, "\n");
  return `"${text.replace(/"/g, '""')}"`;
}

const rows: ReviewRow[] = [];
const allIssues: Array<
  Readonly<{ cpId: string; qlId: string; language: Language; issue: Issue }>
> = [];
let rowNumber = 0;
let equationCount = 0;

for (const meta of CP_META) {
  const english = readJson<Library>(
    join(root, meta.folder, "editorial-content.en.json"),
  );
  for (const language of LANGUAGES) {
    const native = readJson<Library>(
      join(root, meta.folder, `editorial-content.${language}.json`),
    );
    if (native.entryCount !== meta.count) {
      throw new Error(
        `${meta.cpId}/${language}: expected ${meta.count} entries, found ${native.entryCount}.`,
      );
    }

    for (let index = 0; index < meta.count; index += 1) {
      const qlId = qlIdAt(meta.start, index);
      const entry = native.entries[qlId];
      const englishEntry = english.entries[qlId];
      if (!entry || !englishEntry) {
        throw new Error(`${meta.cpId}/${qlId}/${language}: missing entry.`);
      }

      rowNumber += 1;
      const issues = inspect(language, entry, englishEntry);
      issues.forEach((issue) =>
        allIssues.push({ cpId: meta.cpId, qlId, language, issue }),
      );
      const equations = equationList(entry);
      equationCount += equations.length;
      const highestSeverity = issues.some(
        (item) => item.severity === "BLOCKER",
      )
        ? "BLOCKER"
        : issues.some((item) => item.severity === "MAJOR")
          ? "MAJOR"
          : "";

      rows.push({
        rowNumber,
        cpId: meta.cpId,
        qlId,
        language,
        contextFamily: entry.stem.contextFamily,
        representation: representation(entry),
        stem: stemText(entry),
        prompt: entry.stem.prompt,
        opening: entry.explanation.opening,
        concept: entry.explanation.concept,
        steps: stepReviewText(entry),
        equationsLatex: equations.join("\n"),
        conclusion: entry.explanation.conclusion,
        finalAnswerLatex: entry.explanation.finalAnswerLatex ?? "",
        commonTrap: entry.explanation.commonTrap ?? "",
        shortcut: entry.explanation.shortcut ?? "",
        difficulty: entry.difficulty,
        difficultyRationale: entry.difficultyRationale,
        reviewerDecision: issues.length
          ? "AUTO_REJECTED"
          : "AWAITING_HUMAN_REVIEW",
        severity: highestSeverity,
        issueCodes: [...new Set(issues.map((item) => item.code))].join(";"),
        reviewerNotes: issues.length
          ? issues.map((item) => item.note).join(" | ")
          : "Automated Wave 03 checks passed; native-language human approval is still required.",
        replacementStem: "",
        replacementExplanation: "",
      });
    }
  }
}

const headers = Object.keys(rows[0] ?? {}) as readonly (keyof ReviewRow)[];
const csv = [
  headers.map(csvCell).join(","),
  ...rows.map((row) =>
    headers.map((header) => csvCell(row[header])).join(","),
  ),
].join("\n");

const summary = {
  ok: allIssues.length === 0,
  libraries: 12,
  rows: rows.length,
  hindiRows: rows.filter((row) => row.language === "hi").length,
  punjabiRows: rows.filter((row) => row.language === "pa").length,
  equationCount,
  promptEchoes: allIssues.filter(
    (item) => item.issue.code === "PROMPT-ECHO",
  ).length,
  syntheticStepPrefixes: allIssues.filter(
    (item) => item.issue.code === "SYNTHETIC-STEP-PREFIX",
  ).length,
  punjabiLiteralTranslations: allIssues.filter(
    (item) => item.issue.code === "PUNJABI-LITERAL-TRANSLATION",
  ).length,
  mathJaxTopologyFailures: allIssues.filter(
    (item) => item.issue.code === "MATHJAX-TOPOLOGY",
  ).length,
  blockerCount: allIssues.filter(
    (item) => item.issue.severity === "BLOCKER",
  ).length,
  majorCount: allIssues.filter(
    (item) => item.issue.severity === "MAJOR",
  ).length,
  humanApprovalState: "AWAITING_HUMAN_REVIEW",
};

writeFileSync(
  join(
    outputDirectory,
    "PNL-001-Multilingual-Editorial-Review-Wave03.csv",
  ),
  `${csv}\n`,
);
writeFileSync(
  join(
    outputDirectory,
    "pnl-001-multilingual-editorial-wave03-summary.json",
  ),
  `${JSON.stringify(summary, null, 2)}\n`,
);
writeFileSync(
  join(
    outputDirectory,
    "pnl-001-multilingual-editorial-wave03-findings.json",
  ),
  `${JSON.stringify(allIssues, null, 2)}\n`,
);
writeFileSync(
  join(outputDirectory, "README.md"),
  `# PNL-001 Multilingual Editorial Review — Wave 03\n\n` +
    `- Rows: ${summary.rows}\n` +
    `- Hindi: ${summary.hindiRows}\n` +
    `- Punjabi: ${summary.punjabiRows}\n` +
    `- Solver-owned equations exposed: ${summary.equationCount}\n` +
    `- Automated blockers: ${summary.blockerCount}\n` +
    `- Automated major findings: ${summary.majorCount}\n` +
    `- Human decision: ${summary.humanApprovalState}\n`,
);

console.log(JSON.stringify(summary, null, 2));
if (!summary.ok) process.exitCode = 1;
