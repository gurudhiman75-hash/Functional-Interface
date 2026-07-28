import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { BLR_CP001_PERMANENT_CONTRACTS } from "./cp001-permanent-contracts";
import { generateBlrCp001Question } from "./cp001-runtime";

const REVIEW_SEEDS = [0, 1, 2, 3, 12, 25, 38, 51] as const;
const OPTION_LETTERS = ["A", "B", "C", "D"] as const;

interface PermanentReviewRecord {
  qlId: string;
  solveAuthority: string;
  sourcePrototypeId: string;
  seed: number;
  difficulty: string;
  renderer: string;
  answerType: string;
  stem: string;
  options: readonly {
    letter: string;
    value: string;
    isCorrect: boolean;
    errorLabel: string | null;
  }[];
  correctLetter: string;
  correctValue: string;
  coreConcept: readonly string[];
  familyTreeGrid: string;
  generationAnalysis: readonly string[];
  examShortcut: string;
  distractorAnalysis: readonly unknown[];
  conclusion: string;
  metadata: Readonly<Record<string, unknown>>;
}

function csvCell(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function escapeHtml(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value, null, 2);
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const records: PermanentReviewRecord[] = [];
for (const contract of BLR_CP001_PERMANENT_CONTRACTS) {
  for (const seed of REVIEW_SEEDS) {
    const question = generateBlrCp001Question(contract.qlId, seed);
    records.push({
      qlId: contract.qlId,
      solveAuthority: contract.solveAuthority,
      sourcePrototypeId: String(question.metadata.sourcePrototypeId),
      seed,
      difficulty: question.difficulty,
      renderer: question.renderer,
      answerType: question.answerType,
      stem: question.stem,
      options: question.options.map((option, index) => ({
        letter: OPTION_LETTERS[index]!,
        value: option.value,
        isCorrect: option.isCorrect,
        errorLabel: option.errorLabel ?? null,
      })),
      correctLetter: OPTION_LETTERS[question.correctIndex]!,
      correctValue: question.options[question.correctIndex]!.value,
      coreConcept: question.explanation.coreConcept ?? [],
      familyTreeGrid: question.explanation.familyTreeGrid ?? "",
      generationAnalysis: question.explanation.generationAnalysis ?? [],
      examShortcut: question.explanation.examShortcut ?? "",
      distractorAnalysis: question.explanation.distractorAnalysis ?? [],
      conclusion: question.explanation.conclusion,
      metadata: question.metadata,
    });
  }
}

function toCsv(items: readonly PermanentReviewRecord[]): string {
  const headings = [
    "qlId",
    "solveAuthority",
    "sourcePrototypeId",
    "seed",
    "difficulty",
    "renderer",
    "answerType",
    "stem",
    "optionA",
    "optionB",
    "optionC",
    "optionD",
    "correctLetter",
    "correctValue",
    "coreConcept",
    "familyTreeGrid",
    "generationAnalysis",
    "examShortcut",
    "distractorAnalysis",
    "conclusion",
    "metadata",
  ];
  const rows = items.map((record) => [
    record.qlId,
    record.solveAuthority,
    record.sourcePrototypeId,
    record.seed,
    record.difficulty,
    record.renderer,
    record.answerType,
    record.stem,
    record.options[0]!.value,
    record.options[1]!.value,
    record.options[2]!.value,
    record.options[3]!.value,
    record.correctLetter,
    record.correctValue,
    record.coreConcept,
    record.familyTreeGrid,
    record.generationAnalysis,
    record.examShortcut,
    record.distractorAnalysis,
    record.conclusion,
    record.metadata,
  ]);
  return [
    headings.map(csvCell).join(","),
    ...rows.map((row) => row.map(csvCell).join(",")),
  ].join("\n");
}

function toHtml(items: readonly PermanentReviewRecord[]): string {
  const cards = items
    .map((record, index) => {
      const options = record.options
        .map(
          (option) =>
            `<li><strong>${option.letter}.</strong> ${escapeHtml(option.value)}${
              option.isCorrect
                ? " <strong>✓ Correct</strong>"
                : ` <small>[${escapeHtml(option.errorLabel)}]</small>`
            }</li>`,
        )
        .join("");
      return `<article>
        <h2>${index + 1}. ${escapeHtml(record.qlId)} — ${escapeHtml(record.solveAuthority)}</h2>
        <p class="meta">${escapeHtml(record.sourcePrototypeId)} · seed ${record.seed} · ${escapeHtml(record.difficulty)} · ${escapeHtml(record.answerType)}</p>
        <p class="stem">${escapeHtml(record.stem)}</p>
        <ol>${options}</ol>
        <h3>Core concept</h3>
        <ul>${record.coreConcept.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
        <h3>Family tree and generation map</h3>
        <pre>${escapeHtml(record.familyTreeGrid)}</pre>
        <h3>Generation analysis</h3>
        <ol>${record.generationAnalysis.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>
        <p><strong>10-second shortcut:</strong> ${escapeHtml(record.examShortcut)}</p>
        <h3>Distractor analysis</h3>
        <pre>${escapeHtml(record.distractorAnalysis)}</pre>
        <p><strong>Conclusion:</strong> ${escapeHtml(record.conclusion)}</p>
      </article>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>BLR-CP-001 Permanent English Review</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #f4f6f8; color: #17202a; }
    main { max-width: 1050px; margin: 0 auto; padding: 30px 18px 70px; }
    header, article { background: white; border: 1px solid #d8dee7; border-radius: 12px; padding: 22px; margin-bottom: 20px; }
    h1, h2, h3 { margin-top: 0; }
    p, li { line-height: 1.55; }
    .meta { color: #5d6d7e; }
    .stem { font-size: 1.05rem; }
    pre { white-space: pre-wrap; overflow-wrap: anywhere; background: #f3f5f7; border-radius: 8px; padding: 14px; }
  </style>
</head>
<body><main>
<header>
  <h1>BLR-CP-001 Permanent English Review Pack</h1>
  <p>Fifty-six deterministic review-only questions across BLR-QL-001 through BLR-QL-007. Permanent identity does not enable Question Studio, Question Bank, mock tests, localisation or public publication.</p>
</header>
${cards}
</main></body></html>`;
}

const answerPositions = OPTION_LETTERS.map(
  (letter) => records.filter((record) => record.correctLetter === letter).length,
);
const qlCounts = Object.fromEntries(
  BLR_CP001_PERMANENT_CONTRACTS.map((contract) => [
    contract.qlId,
    records.filter((record) => record.qlId === contract.qlId).length,
  ]),
);
const summary = {
  packageId: "BLR-001",
  checkpointId: "BLR-CP-001",
  status: "PERMANENT_ENGLISH_REVIEW_ONLY",
  freezeVersion: "BLR_CP001_ENGLISH_DISCOVERY_FREEZE_V1",
  qlRange: "BLR-QL-001..007",
  qlCount: BLR_CP001_PERMANENT_CONTRACTS.length,
  recordCount: records.length,
  reviewSeeds: REVIEW_SEEDS,
  qlCounts,
  answerPositions,
  questionStudioVisible: false,
  mockTestEligible: false,
  publiclyPublishable: false,
};

const outputDirectory = process.argv[2] ?? "blr-cp001-review-output";
await mkdir(outputDirectory, { recursive: true });
await Promise.all([
  writeFile(
    path.join(outputDirectory, "blr-cp001-permanent-review.jsonl"),
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-permanent-review.csv"),
    `${toCsv(records)}\n`,
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-permanent-review.html"),
    toHtml(records),
    "utf8",
  ),
  writeFile(
    path.join(outputDirectory, "blr-cp001-permanent-review-summary.json"),
    `${JSON.stringify(summary, null, 2)}\n`,
    "utf8",
  ),
]);

console.log("BLR-CP-001 permanent English review pack exported.", summary);
